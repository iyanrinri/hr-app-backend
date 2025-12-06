import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class AttendancePeriodRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AttendancePeriodCreateInput): Promise<{
        holidays: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            attendancePeriodId: bigint | null;
            date: Date;
            isNational: boolean;
            isRecurring: boolean;
        }[];
    } & {
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
    }>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.AttendancePeriodWhereInput;
        orderBy?: Prisma.AttendancePeriodOrderByWithRelationInput;
    }): Promise<({
        _count: {
            attendanceLogs: number;
            attendances: number;
        };
        holidays: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            attendancePeriodId: bigint | null;
            date: Date;
            isNational: boolean;
            isRecurring: boolean;
        }[];
    } & {
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
    })[]>;
    findOne(where: Prisma.AttendancePeriodWhereUniqueInput): Promise<({
        _count: {
            attendanceLogs: number;
            attendances: number;
        };
        holidays: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            attendancePeriodId: bigint | null;
            date: Date;
            isNational: boolean;
            isRecurring: boolean;
        }[];
    } & {
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
    }) | null>;
    update(params: {
        where: Prisma.AttendancePeriodWhereUniqueInput;
        data: Prisma.AttendancePeriodUpdateInput;
    }): Promise<{
        holidays: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            attendancePeriodId: bigint | null;
            date: Date;
            isNational: boolean;
            isRecurring: boolean;
        }[];
    } & {
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
    }>;
    delete(where: Prisma.AttendancePeriodWhereUniqueInput): Promise<{
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
    }>;
    count(where?: Prisma.AttendancePeriodWhereInput): Promise<number>;
    findActivePeriod(): Promise<({
        holidays: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            attendancePeriodId: bigint | null;
            date: Date;
            isNational: boolean;
            isRecurring: boolean;
        }[];
    } & {
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
    }) | null>;
    createHoliday(data: Prisma.HolidayCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        attendancePeriodId: bigint | null;
        date: Date;
        isNational: boolean;
        isRecurring: boolean;
    }>;
    findHolidays(params: {
        where?: Prisma.HolidayWhereInput;
        orderBy?: Prisma.HolidayOrderByWithRelationInput;
    }): Promise<({
        attendancePeriod: {
            id: bigint;
            name: string;
        } | null;
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        attendancePeriodId: bigint | null;
        date: Date;
        isNational: boolean;
        isRecurring: boolean;
    })[]>;
    updateHoliday(params: {
        where: Prisma.HolidayWhereUniqueInput;
        data: Prisma.HolidayUpdateInput;
    }): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        attendancePeriodId: bigint | null;
        date: Date;
        isNational: boolean;
        isRecurring: boolean;
    }>;
    deleteHoliday(where: Prisma.HolidayWhereUniqueInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        attendancePeriodId: bigint | null;
        date: Date;
        isNational: boolean;
        isRecurring: boolean;
    }>;
    findHolidaysByDateRange(startDate: Date, endDate: Date, attendancePeriodId?: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        attendancePeriodId: bigint | null;
        date: Date;
        isNational: boolean;
        isRecurring: boolean;
    }[]>;
}
