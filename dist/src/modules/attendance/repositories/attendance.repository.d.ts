import { PrismaService } from '../../../database/prisma.service';
import { Prisma, AttendanceType } from '@prisma/client';
export declare class AttendanceRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findTodayAttendance(employeeId: bigint, date: Date): Promise<({
        employee: {
            user: {
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            workingDaysPerWeek: number;
            workingHoursPerDay: number;
            workingStartTime: string;
            workingEndTime: string;
            allowSaturdayWork: boolean;
            allowSundayWork: boolean;
            lateToleranceMinutes: number;
            earlyLeaveToleranceMinutes: number;
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
    }) | null>;
    createAttendance(data: Prisma.AttendanceCreateInput): Promise<{
        employee: {
            user: {
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            workingDaysPerWeek: number;
            workingHoursPerDay: number;
            workingStartTime: string;
            workingEndTime: string;
            allowSaturdayWork: boolean;
            allowSundayWork: boolean;
            lateToleranceMinutes: number;
            earlyLeaveToleranceMinutes: number;
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
    }>;
    updateAttendance(params: {
        where: Prisma.AttendanceWhereUniqueInput;
        data: Prisma.AttendanceUpdateInput;
    }): Promise<{
        employee: {
            user: {
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            workingDaysPerWeek: number;
            workingHoursPerDay: number;
            workingStartTime: string;
            workingEndTime: string;
            allowSaturdayWork: boolean;
            allowSundayWork: boolean;
            lateToleranceMinutes: number;
            earlyLeaveToleranceMinutes: number;
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
    }>;
    createAttendanceLog(data: Prisma.AttendanceLogCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        timestamp: Date;
        location: string;
        ipAddress: string | null;
        userAgent: string | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
    }>;
    findAttendanceHistory(params: {
        skip?: number;
        take?: number;
        where?: Prisma.AttendanceWhereInput;
        orderBy?: Prisma.AttendanceOrderByWithRelationInput;
    }): Promise<({
        employee: {
            user: {
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            name: string;
            startDate: Date;
            endDate: Date;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
    })[]>;
    countAttendance(where?: Prisma.AttendanceWhereInput): Promise<number>;
    findAttendanceLogs(params: {
        where?: Prisma.AttendanceLogWhereInput;
        orderBy?: Prisma.AttendanceLogOrderByWithRelationInput;
        take?: number;
    }): Promise<({
        employee: {
            user: {
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            name: string;
        };
    } & {
        id: bigint;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        timestamp: Date;
        location: string;
        ipAddress: string | null;
        userAgent: string | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
    })[]>;
    getLatestLog(employeeId: bigint, date: Date, type?: AttendanceType): Promise<{
        id: bigint;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        timestamp: Date;
        location: string;
        ipAddress: string | null;
        userAgent: string | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
    } | null>;
    findAttendanceWithLogs(attendanceId: bigint): Promise<({
        employee: {
            user: {
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            workingDaysPerWeek: number;
            workingHoursPerDay: number;
            workingStartTime: string;
            workingEndTime: string;
            allowSaturdayWork: boolean;
            allowSundayWork: boolean;
            lateToleranceMinutes: number;
            earlyLeaveToleranceMinutes: number;
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
    }) | null>;
    getAttendanceStats(employeeId: bigint, startDate: Date, endDate: Date): Promise<{
        statusCounts: Record<string, number>;
        totalWorkDuration: number;
    }>;
    findEmployeeById(employeeId: number): Promise<{
        id: bigint;
        user: {
            email: string;
        };
        firstName: string;
        lastName: string;
        position: string;
        department: string;
    } | null>;
    getDashboardData(date: Date, attendancePeriodId: number): Promise<{
        allEmployees: ({
            user: {
                id: bigint;
                email: string;
                role: import("@prisma/client").$Enums.Role;
            };
        } & {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        })[];
        todayAttendances: ({
            employee: {
                user: {
                    email: string;
                    role: import("@prisma/client").$Enums.Role;
                };
            } & {
                id: bigint;
                isDeleted: boolean;
                deletedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                position: string;
                department: string;
                joinDate: Date;
                baseSalary: Prisma.Decimal;
                userId: bigint;
            };
            attendancePeriod: {
                id: bigint;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                startDate: Date;
                endDate: Date;
                workingDaysPerWeek: number;
                workingHoursPerDay: number;
                workingStartTime: string;
                workingEndTime: string;
                allowSaturdayWork: boolean;
                allowSundayWork: boolean;
                lateToleranceMinutes: number;
                earlyLeaveToleranceMinutes: number;
                isActive: boolean;
                createdBy: bigint;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.AttendanceStatus;
            notes: string | null;
            employeeId: bigint;
            attendancePeriodId: bigint;
            date: Date;
            checkIn: Date | null;
            checkOut: Date | null;
            checkInLocation: string | null;
            checkOutLocation: string | null;
            workDuration: number | null;
        })[];
        attendancePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            workingDaysPerWeek: number;
            workingHoursPerDay: number;
            workingStartTime: string;
            workingEndTime: string;
            allowSaturdayWork: boolean;
            allowSundayWork: boolean;
            lateToleranceMinutes: number;
            earlyLeaveToleranceMinutes: number;
            isActive: boolean;
            createdBy: bigint;
        } | null;
    }>;
    getEmployeeAttendanceToday(employeeId: number, date: Date): Promise<({
        employee: {
            id: bigint;
            isDeleted: boolean;
            deletedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
            joinDate: Date;
            baseSalary: Prisma.Decimal;
            userId: bigint;
        };
        attendancePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            workingDaysPerWeek: number;
            workingHoursPerDay: number;
            workingStartTime: string;
            workingEndTime: string;
            allowSaturdayWork: boolean;
            allowSundayWork: boolean;
            lateToleranceMinutes: number;
            earlyLeaveToleranceMinutes: number;
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
    }) | null>;
}
