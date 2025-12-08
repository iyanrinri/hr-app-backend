import { AttendanceRepository } from '../repositories/attendance.repository';
import { AttendancePeriodService } from '../../attendance-period/services/attendance-period.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
import { Role } from '@prisma/client';
import { NotificationService } from '../../../common/services/notification.service';
export declare class AttendanceService {
    private attendanceRepository;
    private attendancePeriodService;
    private notificationService;
    constructor(attendanceRepository: AttendanceRepository, attendancePeriodService: AttendancePeriodService, notificationService: NotificationService);
    clockIn(employeeId: bigint, clockInDto: ClockInDto, ipAddress?: string, userAgent?: string): Promise<{
        status: string;
        message: string;
        log: any;
        attendance: any;
    }>;
    clockOut(employeeId: bigint, clockOutDto: ClockOutDto, ipAddress?: string, userAgent?: string): Promise<{
        status: string;
        message: string;
        log: any;
        attendance: any;
    }>;
    getTodayAttendance(employeeId: bigint): Promise<any>;
    getAttendanceHistory(query: AttendanceHistoryDto, userRole: Role, requestingUserId: string): Promise<any[] | {
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getAttendanceLogs(employeeId?: bigint, date?: string): Promise<any[]>;
    getAttendanceStats(employeeId: bigint, startDate: string, endDate: string): Promise<{
        statusCounts: Record<string, number>;
        totalWorkDuration: number;
        totalWorkDays: number;
        averageWorkDuration: number;
    }>;
    private determineAttendanceStatus;
    private checkEarlyLeave;
    private calculateWorkDuration;
    private transformAttendance;
    private sendClockInNotification;
    private sendClockOutNotification;
    private getEmployeeInfo;
    private transformAttendanceLog;
}
