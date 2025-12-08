import { AttendanceService } from '../services/attendance.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    private readonly employeeService;
    constructor(attendanceService: AttendanceService, employeeService: EmployeeService);
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
    getDashboardToday(req: any): Promise<{
        date: string;
        summary: {
            totalEmployees: number;
            totalPresent: number;
            totalAbsent: number;
            totalLate: number;
            attendanceRate: number;
            lateRate: number;
            onTimeRate: number;
        };
        presentEmployees: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            department: string;
            position: string;
            checkIn: string;
            checkOut: string | null;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            isLate: boolean;
            minutesLate: number;
            workDuration: number;
        }[];
        absentEmployees: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            department: string;
            position: string;
        }[];
        lateEmployees: {
            minutesLate: number;
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            department: string;
            position: string;
            checkIn: string;
            checkOut: string | null;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            isLate: boolean;
            workDuration: number;
        }[];
        attendancePeriod: {
            id: any;
            name: any;
            workingStartTime: any;
            workingEndTime: any;
            toleranceMinutes: any;
        };
    }>;
}
