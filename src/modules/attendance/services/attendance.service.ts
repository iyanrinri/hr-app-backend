import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { AttendancePeriodService } from '../../attendance-period/services/attendance-period.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
import { AttendanceStatus, AttendanceType, Role } from '@prisma/client';
import { NotificationService } from '../../../common/services/notification.service';
import { NotificationGateway } from '../../../common/gateways/notification.gateway';
import { AttendanceEvent } from '../../../common/services/kafka.service';

@Injectable()
export class AttendanceService {
  constructor(
    private attendanceRepository: AttendanceRepository,
    private attendancePeriodService: AttendancePeriodService,
    private notificationService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  async clockIn(employeeId: bigint, clockInDto: ClockInDto, ipAddress?: string, userAgent?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if it's a working day
    const activePeriod = await this.attendancePeriodService.getActivePeriod();
    const isWorkingDay = await this.attendancePeriodService.isWorkingDay(today, BigInt(activePeriod.id));
    
    if (!isWorkingDay) {
      throw new BadRequestException('Cannot clock in on weekends or holidays');
    }

    // Check if already clocked in today
    const existingAttendance = await this.attendanceRepository.findTodayAttendance(employeeId, today);
    
    if (existingAttendance && existingAttendance.checkIn) {
      throw new BadRequestException('Already clocked in today');
    }

    const now = new Date();
    const locationData = {
      latitude: clockInDto.latitude,
      longitude: clockInDto.longitude,
      address: clockInDto.address,
    };

    // Create attendance log
    const log = await this.attendanceRepository.createAttendanceLog({
      employee: { connect: { id: employeeId } },
      attendancePeriod: { connect: { id: BigInt(activePeriod.id) } },
      type: AttendanceType.CLOCK_IN,
      timestamp: now,
      location: JSON.stringify(locationData),
      ipAddress,
      userAgent,
      notes: clockInDto.notes,
    });

    let attendance;
    if (existingAttendance) {
      // Update existing attendance record
      attendance = await this.attendanceRepository.updateAttendance({
        where: { id: existingAttendance.id },
        data: {
          checkIn: now,
          checkInLocation: JSON.stringify(locationData),
          status: await this.determineAttendanceStatus(now, activePeriod),
          notes: clockInDto.notes,
        },
      });
    } else {
      // Create new attendance record
      attendance = await this.attendanceRepository.createAttendance({
        employee: { connect: { id: employeeId } },
        attendancePeriod: { connect: { id: BigInt(activePeriod.id) } },
        date: today,
        checkIn: now,
        checkInLocation: JSON.stringify(locationData),
        status: await this.determineAttendanceStatus(now, activePeriod),
        notes: clockInDto.notes,
      });
    }

    // Send notification after successful clock-in
    await this.sendClockInNotification(employeeId, now, attendance.status === AttendanceStatus.LATE, locationData);

    // Send dashboard update to admin clients
    await this.sendDashboardUpdate();

    return {
      status: 'success',
      message: 'Successfully clocked in',
      log: this.transformAttendanceLog(log),
      attendance: this.transformAttendance(attendance),
    };
  }

  async clockOut(employeeId: bigint, clockOutDto: ClockOutDto, ipAddress?: string, userAgent?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if it's a working day
    const activePeriod = await this.attendancePeriodService.getActivePeriod();
    const isWorkingDay = await this.attendancePeriodService.isWorkingDay(today, BigInt(activePeriod.id));
    
    if (!isWorkingDay) {
      throw new BadRequestException('Cannot clock out on weekends or holidays');
    }

    // Check if clocked in today
    const existingAttendance = await this.attendanceRepository.findTodayAttendance(employeeId, today);
    
    if (!existingAttendance || !existingAttendance.checkIn) {
      throw new BadRequestException('Must clock in before clocking out');
    }

    // Allow multiple clock-outs as long as user has clocked in
    // Remove the check that prevents multiple clock-outs

    const now = new Date();
    const locationData = {
      latitude: clockOutDto.latitude,
      longitude: clockOutDto.longitude,
      address: clockOutDto.address,
    };

    // Calculate work duration
    const workDuration = this.calculateWorkDuration(existingAttendance.checkIn!, now);

    // Determine if this is early leave
    const isEarlyLeave = await this.checkEarlyLeave(now, activePeriod);

    // Create attendance log
    const log = await this.attendanceRepository.createAttendanceLog({
      employee: { connect: { id: employeeId } },
      attendancePeriod: { connect: { id: BigInt(activePeriod.id) } },
      type: AttendanceType.CLOCK_OUT,
      timestamp: now,
      location: JSON.stringify(locationData),
      ipAddress,
      userAgent,
      notes: clockOutDto.notes,
    });

    // Update attendance record with latest clock-out info
    const attendance = await this.attendanceRepository.updateAttendance({
      where: { id: existingAttendance.id },
      data: {
        checkOut: now, // Always update to latest clock-out time
        checkOutLocation: JSON.stringify(locationData),
        workDuration, // Recalculate based on latest clock-out
        notes: clockOutDto.notes ? `${existingAttendance.notes || ''}; ${clockOutDto.notes}` : existingAttendance.notes,
      },
    });

    // Send notification after successful clock-out
    await this.sendClockOutNotification(
      employeeId, 
      now, 
      isEarlyLeave, 
      workDuration, 
      locationData,
      !!existingAttendance.checkOut // was already clocked out
    );

    // Send dashboard update to admin clients
    await this.sendDashboardUpdate();

    return {
      status: 'success',
      message: existingAttendance.checkOut 
        ? 'Successfully updated clock-out time' 
        : 'Successfully clocked out',
      log: this.transformAttendanceLog(log),
      attendance: this.transformAttendance(attendance),
    };
  }

  async getTodayAttendance(employeeId: bigint) {
    const today = new Date();
    const attendance = await this.attendanceRepository.findTodayAttendance(employeeId, today);
    
    if (!attendance) {
      return null;
    }

    return this.transformAttendance(attendance);
  }

  async getAttendanceHistory(query: AttendanceHistoryDto, userRole: Role, requestingUserId: string) {
    let whereCondition: any = {};

    // Role-based filtering
    if (userRole === Role.EMPLOYEE || userRole === Role.MANAGER) {
      // Employees can only see their own attendance
      // Find the employee record for the requesting user
      const employee = await this.attendanceRepository.findAttendanceHistory({
        where: { employee: { userId: BigInt(requestingUserId) } },
        take: 1,
      });
      
      if (employee.length === 0) {
        throw new NotFoundException('Employee record not found');
      }
      
      whereCondition.employeeId = employee[0].employeeId;
    } else if (userRole === Role.HR || userRole === Role.SUPER) {
      // HR and SUPER can filter by specific employee or see all
      if (query.employeeId) {
        whereCondition.employeeId = query.employeeId;
      }
    }

    // Date range filter
    if (query.startDate || query.endDate) {
      whereCondition.date = {};
      if (query.startDate) {
        whereCondition.date.gte = new Date(query.startDate);
      }
      if (query.endDate) {
        whereCondition.date.lte = new Date(query.endDate);
      }
    }

    // Status filter
    if (query.status) {
      whereCondition.status = query.status;
    }

    if (query.page && query.limit) {
      // Paginated response
      const page = query.page;
      const limit = query.limit;
      const skip = (page - 1) * limit;

      const total = await this.attendanceRepository.countAttendance(whereCondition);
      const attendances = await this.attendanceRepository.findAttendanceHistory({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: { date: 'desc' },
      });

      return {
        data: attendances.map(attendance => this.transformAttendance(attendance)),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } else {
      // Non-paginated response
      const attendances = await this.attendanceRepository.findAttendanceHistory({
        where: whereCondition,
        orderBy: { date: 'desc' },
      });

      return attendances.map(attendance => this.transformAttendance(attendance));
    }
  }

  async getAttendanceLogs(employeeId?: bigint, date?: string) {
    let whereCondition: any = {};

    if (employeeId) {
      whereCondition.employeeId = employeeId;
    }

    if (date) {
      const logDate = new Date(date);
      const startOfDay = new Date(logDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(logDate);
      endOfDay.setHours(23, 59, 59, 999);

      whereCondition.timestamp = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    const logs = await this.attendanceRepository.findAttendanceLogs({
      where: whereCondition,
      orderBy: { timestamp: 'desc' },
      take: 100, // Limit to recent logs
    });

    return logs.map(log => this.transformAttendanceLog(log));
  }

  async getAttendanceStats(employeeId: bigint, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const stats = await this.attendanceRepository.getAttendanceStats(employeeId, start, end);

    return {
      statusCounts: stats.statusCounts,
      totalWorkDuration: stats.totalWorkDuration,
      totalWorkDays: Object.values(stats.statusCounts).reduce((sum, count) => sum + count, 0),
      averageWorkDuration: stats.statusCounts.PRESENT > 0 
        ? Math.round(stats.totalWorkDuration / stats.statusCounts.PRESENT)
        : 0,
    };
  }

  private async determineAttendanceStatus(checkInTime: Date, period: any): Promise<AttendanceStatus> {
    const hour = checkInTime.getHours();
    const minute = checkInTime.getMinutes();
    
    // Parse working start time from period configuration
    const [startHour, startMinute] = period.workingStartTime.split(':').map(Number);
    
    // Calculate minutes from midnight
    const checkInMinutes = hour * 60 + minute;
    const workingStartMinutes = startHour * 60 + startMinute;
    
    // Add late tolerance
    const lateThreshold = workingStartMinutes + (period.lateToleranceMinutes || 15);
    
    if (checkInMinutes > lateThreshold) {
      return AttendanceStatus.LATE;
    }
    
    return AttendanceStatus.PRESENT;
  }

  private async checkEarlyLeave(checkOutTime: Date, period: any): Promise<boolean> {
    const hour = checkOutTime.getHours();
    const minute = checkOutTime.getMinutes();
    
    // Parse working end time from period configuration  
    const [endHour, endMinute] = period.workingEndTime.split(':').map(Number);
    
    // Calculate minutes from midnight
    const checkOutMinutes = hour * 60 + minute;
    const workingEndMinutes = endHour * 60 + endMinute;
    
    // Subtract early leave tolerance
    const earlyLeaveThreshold = workingEndMinutes - (period.earlyLeaveToleranceMinutes || 15);
    
    return checkOutMinutes < earlyLeaveThreshold;
  }

  private calculateWorkDuration(checkIn: Date, checkOut: Date): number {
    // Return duration in minutes
    const diffMs = checkOut.getTime() - checkIn.getTime();
    return Math.round(diffMs / (1000 * 60));
  }

  private transformAttendance(attendance: any) {
    return {
      ...attendance,
      id: attendance.id.toString(),
      employeeId: attendance.employeeId.toString(),
      attendancePeriodId: attendance.attendancePeriodId.toString(),
      date: attendance.date instanceof Date ? attendance.date.toISOString() : attendance.date,
      checkIn: attendance.checkIn instanceof Date ? attendance.checkIn.toISOString() : attendance.checkIn,
      checkOut: attendance.checkOut instanceof Date ? attendance.checkOut.toISOString() : attendance.checkOut,
      checkInLocation: attendance.checkInLocation ? JSON.parse(attendance.checkInLocation) : null,
      checkOutLocation: attendance.checkOutLocation ? JSON.parse(attendance.checkOutLocation) : null,
      createdAt: attendance.createdAt instanceof Date ? attendance.createdAt.toISOString() : attendance.createdAt,
      updatedAt: attendance.updatedAt instanceof Date ? attendance.updatedAt.toISOString() : attendance.updatedAt,
    };
  }

  // Helper method to send clock-in notification
  private async sendClockInNotification(
    employeeId: bigint,
    timestamp: Date,
    isLate: boolean,
    location: any
  ) {
    try {
      const employeeInfo = await this.getEmployeeInfo(employeeId);
      
      const event: AttendanceEvent = {
        type: 'CLOCK_IN',
        employeeId: employeeId.toString(),
        employeeName: employeeInfo.fullName,
        department: employeeInfo.department,
        timestamp: timestamp.toISOString(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
        isLate,
      };

      await this.notificationService.sendAttendanceNotification(event);
    } catch (error) {
      // Don't block attendance process if notification fails
      console.error('Failed to send clock-in notification:', error);
    }
  }

  // Helper method to send clock-out notification
  private async sendClockOutNotification(
    employeeId: bigint,
    timestamp: Date,
    isEarlyLeave: boolean,
    workDuration: number,
    location: any,
    wasAlreadyClockedOut: boolean
  ) {
    try {
      const employeeInfo = await this.getEmployeeInfo(employeeId);
      
      const event: AttendanceEvent = {
        type: 'CLOCK_OUT',
        employeeId: employeeId.toString(),
        employeeName: employeeInfo.fullName,
        department: employeeInfo.department,
        timestamp: timestamp.toISOString(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        },
        isEarlyLeave,
        workDuration,
      };

      // Only send notification if this is first clock-out or if it's an update worth notifying
      if (!wasAlreadyClockedOut || isEarlyLeave) {
        await this.notificationService.sendAttendanceNotification(event);
      }
    } catch (error) {
      // Don't block attendance process if notification fails
      console.error('Failed to send clock-out notification:', error);
    }
  }

  // Helper method to get employee information for notifications
  private async getEmployeeInfo(employeeId: bigint) {
    const employee = await this.attendanceRepository.findEmployeeById(Number(employeeId));
    
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return {
      fullName: `${employee.firstName} ${employee.lastName}`,
      employeeNumber: `EMP${employee.id.toString().padStart(3, '0')}`,
      department: employee.department,
      position: employee.position,
      email: employee.user.email,
    };
  }

  private transformAttendanceLog(log: any) {
    return {
      ...log,
      id: log.id.toString(),
      employeeId: log.employeeId.toString(),
      attendancePeriodId: log.attendancePeriodId.toString(),
      timestamp: log.timestamp instanceof Date ? log.timestamp.toISOString() : log.timestamp,
      location: log.location ? JSON.parse(log.location) : null,
      createdAt: log.createdAt instanceof Date ? log.createdAt.toISOString() : log.createdAt,
    };
  }

  async getDashboardToday() {
    // Get active attendance period
    const activePeriod = await this.attendancePeriodService.getActivePeriod();
    if (!activePeriod) {
      throw new NotFoundException('No active attendance period found');
    }

    const today = new Date();
    const dashboardData = await this.attendanceRepository.getDashboardData(today, Number(activePeriod.id));

    // Calculate working hours for late detection
    const workingStartTime = this.parseTime(activePeriod.workingStartTime);
    const toleranceMinutes = activePeriod.lateToleranceMinutes || 0;
    const lateThreshold = new Date(today);
    lateThreshold.setHours(workingStartTime.hours, workingStartTime.minutes + toleranceMinutes, 0, 0);

    // Process data
    const presentEmployees = [];
    const lateEmployees = [];
    const employeeAttendanceMap = new Map();

    // Map attendances by employee ID
    for (const attendance of dashboardData.todayAttendances) {
      employeeAttendanceMap.set(Number(attendance.employeeId), attendance);
      
      const employee = attendance.employee;
      
      if (attendance.checkIn) {
        const checkInTime = new Date(attendance.checkIn);
        const isLate = checkInTime > lateThreshold;
        const minutesLate = isLate ? Math.floor((checkInTime.getTime() - lateThreshold.getTime()) / 60000) : 0;

        const employeeData = {
          id: employee.id.toString(),
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.user.email,
          department: employee.department,
          position: employee.position,
          checkIn: attendance.checkIn instanceof Date ? attendance.checkIn.toISOString() : attendance.checkIn,
          checkOut: attendance.checkOut ? (attendance.checkOut instanceof Date ? attendance.checkOut.toISOString() : attendance.checkOut) : null,
          status: attendance.status || 'PRESENT',
          isLate,
          minutesLate,
          workDuration: attendance.workDuration || 0,
        };

        presentEmployees.push(employeeData);
        
        if (isLate) {
          lateEmployees.push({
            ...employeeData,
            minutesLate,
          });
        }
      }
    }

    // Find absent employees
    const absentEmployees = dashboardData.allEmployees
      .filter(emp => !employeeAttendanceMap.has(Number(emp.id)))
      .map(emp => ({
        id: emp.id.toString(),
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.user.email,
        department: emp.department,
        position: emp.position,
      }));

    // Calculate statistics
    const totalEmployees = dashboardData.allEmployees.length;
    const totalPresent = presentEmployees.length;
    const totalAbsent = absentEmployees.length;
    const totalLate = lateEmployees.length;
    const attendanceRate = totalEmployees > 0 ? (totalPresent / totalEmployees) * 100 : 0;
    const lateRate = totalEmployees > 0 ? (totalLate / totalEmployees) * 100 : 0;
    const onTimeRate = totalEmployees > 0 ? ((totalPresent - totalLate) / totalEmployees) * 100 : 0;

    return {
      date: today.toISOString().split('T')[0],
      summary: {
        totalEmployees,
        totalPresent,
        totalAbsent,
        totalLate,
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        lateRate: Math.round(lateRate * 10) / 10,
        onTimeRate: Math.round(onTimeRate * 10) / 10,
      },
      presentEmployees,
      absentEmployees,
      lateEmployees,
      attendancePeriod: {
        id: activePeriod.id,
        name: activePeriod.name,
        workingStartTime: activePeriod.workingStartTime,
        workingEndTime: activePeriod.workingEndTime,
        toleranceMinutes: activePeriod.lateToleranceMinutes,
      },
    };
  }

  private parseTime(timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  // Send dashboard update notification
  private async sendDashboardUpdate() {
    try {
      const dashboardData = await this.getDashboardToday();
      await this.notificationGateway.sendDashboardUpdate(dashboardData);
    } catch (error) {
      // Don't block attendance process if dashboard update fails
      console.error('Failed to send dashboard update:', error);
    }
  }
}