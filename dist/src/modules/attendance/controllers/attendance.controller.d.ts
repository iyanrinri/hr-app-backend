import { AttendanceService } from '../services/attendance.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    clockIn(clockInDto: ClockInDto, req: any, ip: string, userAgent: string): Promise<{
        status: string;
        message: string;
        log: any;
        attendance: any;
    }>;
    clockOut(clockOutDto: ClockOutDto, req: any, ip: string, userAgent: string): Promise<{
        status: string;
        message: string;
        log: any;
        attendance: any;
    }>;
    getTodayAttendance(req: any): Promise<any>;
    getAttendanceHistory(query: AttendanceHistoryDto, req: any): Promise<any[] | {
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
    getAttendanceLogs(employeeId?: string, date?: string): Promise<any[]>;
    getAttendanceStats(startDate: string, endDate: string, req: any, employeeId?: string): Promise<{
        statusCounts: Record<string, number>;
        totalWorkDuration: number;
        totalWorkDays: number;
        averageWorkDuration: number;
    }>;
}
