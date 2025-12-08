"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const attendance_repository_1 = require("../repositories/attendance.repository");
const attendance_period_service_1 = require("../../attendance-period/services/attendance-period.service");
const client_1 = require("@prisma/client");
const notification_service_1 = require("../../../common/services/notification.service");
let AttendanceService = class AttendanceService {
    attendanceRepository;
    attendancePeriodService;
    notificationService;
    constructor(attendanceRepository, attendancePeriodService, notificationService) {
        this.attendanceRepository = attendanceRepository;
        this.attendancePeriodService = attendancePeriodService;
        this.notificationService = notificationService;
    }
    async clockIn(employeeId, clockInDto, ipAddress, userAgent) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activePeriod = await this.attendancePeriodService.getActivePeriod();
        const isWorkingDay = await this.attendancePeriodService.isWorkingDay(today, BigInt(activePeriod.id));
        if (!isWorkingDay) {
            throw new common_1.BadRequestException('Cannot clock in on weekends or holidays');
        }
        const existingAttendance = await this.attendanceRepository.findTodayAttendance(employeeId, today);
        if (existingAttendance && existingAttendance.checkIn) {
            throw new common_1.BadRequestException('Already clocked in today');
        }
        const now = new Date();
        const locationData = {
            latitude: clockInDto.latitude,
            longitude: clockInDto.longitude,
            address: clockInDto.address,
        };
        const log = await this.attendanceRepository.createAttendanceLog({
            employee: { connect: { id: employeeId } },
            attendancePeriod: { connect: { id: BigInt(activePeriod.id) } },
            type: client_1.AttendanceType.CLOCK_IN,
            timestamp: now,
            location: JSON.stringify(locationData),
            ipAddress,
            userAgent,
            notes: clockInDto.notes,
        });
        let attendance;
        if (existingAttendance) {
            attendance = await this.attendanceRepository.updateAttendance({
                where: { id: existingAttendance.id },
                data: {
                    checkIn: now,
                    checkInLocation: JSON.stringify(locationData),
                    status: await this.determineAttendanceStatus(now, activePeriod),
                    notes: clockInDto.notes,
                },
            });
        }
        else {
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
        await this.sendClockInNotification(employeeId, now, attendance.status === client_1.AttendanceStatus.LATE, locationData);
        return {
            status: 'success',
            message: 'Successfully clocked in',
            log: this.transformAttendanceLog(log),
            attendance: this.transformAttendance(attendance),
        };
    }
    async clockOut(employeeId, clockOutDto, ipAddress, userAgent) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activePeriod = await this.attendancePeriodService.getActivePeriod();
        const isWorkingDay = await this.attendancePeriodService.isWorkingDay(today, BigInt(activePeriod.id));
        if (!isWorkingDay) {
            throw new common_1.BadRequestException('Cannot clock out on weekends or holidays');
        }
        const existingAttendance = await this.attendanceRepository.findTodayAttendance(employeeId, today);
        if (!existingAttendance || !existingAttendance.checkIn) {
            throw new common_1.BadRequestException('Must clock in before clocking out');
        }
        const now = new Date();
        const locationData = {
            latitude: clockOutDto.latitude,
            longitude: clockOutDto.longitude,
            address: clockOutDto.address,
        };
        const workDuration = this.calculateWorkDuration(existingAttendance.checkIn, now);
        const isEarlyLeave = await this.checkEarlyLeave(now, activePeriod);
        const log = await this.attendanceRepository.createAttendanceLog({
            employee: { connect: { id: employeeId } },
            attendancePeriod: { connect: { id: BigInt(activePeriod.id) } },
            type: client_1.AttendanceType.CLOCK_OUT,
            timestamp: now,
            location: JSON.stringify(locationData),
            ipAddress,
            userAgent,
            notes: clockOutDto.notes,
        });
        const attendance = await this.attendanceRepository.updateAttendance({
            where: { id: existingAttendance.id },
            data: {
                checkOut: now,
                checkOutLocation: JSON.stringify(locationData),
                workDuration,
                notes: clockOutDto.notes ? `${existingAttendance.notes || ''}; ${clockOutDto.notes}` : existingAttendance.notes,
            },
        });
        await this.sendClockOutNotification(employeeId, now, isEarlyLeave, workDuration, locationData, !!existingAttendance.checkOut);
        return {
            status: 'success',
            message: existingAttendance.checkOut
                ? 'Successfully updated clock-out time'
                : 'Successfully clocked out',
            log: this.transformAttendanceLog(log),
            attendance: this.transformAttendance(attendance),
        };
    }
    async getTodayAttendance(employeeId) {
        const today = new Date();
        const attendance = await this.attendanceRepository.findTodayAttendance(employeeId, today);
        if (!attendance) {
            return null;
        }
        return this.transformAttendance(attendance);
    }
    async getAttendanceHistory(query, userRole, requestingUserId) {
        let whereCondition = {};
        if (userRole === client_1.Role.EMPLOYEE || userRole === client_1.Role.MANAGER) {
            const employee = await this.attendanceRepository.findAttendanceHistory({
                where: { employee: { userId: BigInt(requestingUserId) } },
                take: 1,
            });
            if (employee.length === 0) {
                throw new common_1.NotFoundException('Employee record not found');
            }
            whereCondition.employeeId = employee[0].employeeId;
        }
        else if (userRole === client_1.Role.HR || userRole === client_1.Role.SUPER) {
            if (query.employeeId) {
                whereCondition.employeeId = query.employeeId;
            }
        }
        if (query.startDate || query.endDate) {
            whereCondition.date = {};
            if (query.startDate) {
                whereCondition.date.gte = new Date(query.startDate);
            }
            if (query.endDate) {
                whereCondition.date.lte = new Date(query.endDate);
            }
        }
        if (query.status) {
            whereCondition.status = query.status;
        }
        if (query.page && query.limit) {
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
        }
        else {
            const attendances = await this.attendanceRepository.findAttendanceHistory({
                where: whereCondition,
                orderBy: { date: 'desc' },
            });
            return attendances.map(attendance => this.transformAttendance(attendance));
        }
    }
    async getAttendanceLogs(employeeId, date) {
        let whereCondition = {};
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
            take: 100,
        });
        return logs.map(log => this.transformAttendanceLog(log));
    }
    async getAttendanceStats(employeeId, startDate, endDate) {
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
    async determineAttendanceStatus(checkInTime, period) {
        const hour = checkInTime.getHours();
        const minute = checkInTime.getMinutes();
        const [startHour, startMinute] = period.workingStartTime.split(':').map(Number);
        const checkInMinutes = hour * 60 + minute;
        const workingStartMinutes = startHour * 60 + startMinute;
        const lateThreshold = workingStartMinutes + (period.lateToleranceMinutes || 15);
        if (checkInMinutes > lateThreshold) {
            return client_1.AttendanceStatus.LATE;
        }
        return client_1.AttendanceStatus.PRESENT;
    }
    async checkEarlyLeave(checkOutTime, period) {
        const hour = checkOutTime.getHours();
        const minute = checkOutTime.getMinutes();
        const [endHour, endMinute] = period.workingEndTime.split(':').map(Number);
        const checkOutMinutes = hour * 60 + minute;
        const workingEndMinutes = endHour * 60 + endMinute;
        const earlyLeaveThreshold = workingEndMinutes - (period.earlyLeaveToleranceMinutes || 15);
        return checkOutMinutes < earlyLeaveThreshold;
    }
    calculateWorkDuration(checkIn, checkOut) {
        const diffMs = checkOut.getTime() - checkIn.getTime();
        return Math.round(diffMs / (1000 * 60));
    }
    transformAttendance(attendance) {
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
    async sendClockInNotification(employeeId, timestamp, isLate, location) {
        try {
            const employeeInfo = await this.getEmployeeInfo(employeeId);
            const event = {
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
        }
        catch (error) {
            console.error('Failed to send clock-in notification:', error);
        }
    }
    async sendClockOutNotification(employeeId, timestamp, isEarlyLeave, workDuration, location, wasAlreadyClockedOut) {
        try {
            const employeeInfo = await this.getEmployeeInfo(employeeId);
            const event = {
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
            if (!wasAlreadyClockedOut || isEarlyLeave) {
                await this.notificationService.sendAttendanceNotification(event);
            }
        }
        catch (error) {
            console.error('Failed to send clock-out notification:', error);
        }
    }
    async getEmployeeInfo(employeeId) {
        const employee = await this.attendanceRepository.findEmployeeById(Number(employeeId));
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        return {
            fullName: `${employee.firstName} ${employee.lastName}`,
            employeeNumber: `EMP${employee.id.toString().padStart(3, '0')}`,
            department: employee.department,
            position: employee.position,
            email: employee.user.email,
        };
    }
    transformAttendanceLog(log) {
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
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_repository_1.AttendanceRepository,
        attendance_period_service_1.AttendancePeriodService,
        notification_service_1.NotificationService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map