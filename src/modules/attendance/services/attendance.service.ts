import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AttendanceRepository } from '../repositories/attendance.repository';
import { AttendancePeriodService } from '../../attendance-period/services/attendance-period.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
import { AttendanceStatus, AttendanceType, Role } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(
    private attendanceRepository: AttendanceRepository,
    private attendancePeriodService: AttendancePeriodService,
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
          status: this.determineAttendanceStatus(now),
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
        status: this.determineAttendanceStatus(now),
        notes: clockInDto.notes,
      });
    }

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

    if (existingAttendance.checkOut) {
      throw new BadRequestException('Already clocked out today');
    }

    const now = new Date();
    const locationData = {
      latitude: clockOutDto.latitude,
      longitude: clockOutDto.longitude,
      address: clockOutDto.address,
    };

    // Calculate work duration
    const workDuration = this.calculateWorkDuration(existingAttendance.checkIn!, now);

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

    // Update attendance record
    const attendance = await this.attendanceRepository.updateAttendance({
      where: { id: existingAttendance.id },
      data: {
        checkOut: now,
        checkOutLocation: JSON.stringify(locationData),
        workDuration,
        notes: clockOutDto.notes ? `${existingAttendance.notes || ''}; ${clockOutDto.notes}` : existingAttendance.notes,
      },
    });

    return {
      status: 'success',
      message: 'Successfully clocked out',
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

  private determineAttendanceStatus(checkInTime: Date): AttendanceStatus {
    const hour = checkInTime.getHours();
    const minute = checkInTime.getMinutes();
    
    // Consider late if after 9:00 AM (9 * 60 + 0 = 540 minutes)
    const checkInMinutes = hour * 60 + minute;
    const lateThreshold = 9 * 60; // 9:00 AM
    
    if (checkInMinutes > lateThreshold) {
      return AttendanceStatus.LATE;
    }
    
    return AttendanceStatus.PRESENT;
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
}