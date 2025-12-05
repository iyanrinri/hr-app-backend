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
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
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
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
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
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
    }>;
    createAttendanceLog(data: Prisma.AttendanceLogCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        timestamp: Date;
        location: string;
        ipAddress: string | null;
        userAgent: string | null;
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
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
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
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        timestamp: Date;
        location: string;
        ipAddress: string | null;
        userAgent: string | null;
    })[]>;
    getLatestLog(employeeId: bigint, date: Date, type?: AttendanceType): Promise<{
        id: bigint;
        createdAt: Date;
        type: import("@prisma/client").$Enums.AttendanceType;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
        timestamp: Date;
        location: string;
        ipAddress: string | null;
        userAgent: string | null;
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
            isActive: boolean;
            createdBy: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.AttendanceStatus;
        date: Date;
        checkIn: Date | null;
        checkOut: Date | null;
        checkInLocation: string | null;
        checkOutLocation: string | null;
        workDuration: number | null;
        notes: string | null;
        employeeId: bigint;
        attendancePeriodId: bigint;
    }) | null>;
    getAttendanceStats(employeeId: bigint, startDate: Date, endDate: Date): Promise<{
        statusCounts: Record<string, number>;
        totalWorkDuration: number;
    }>;
}
