import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class LeaveBalanceRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.LeaveBalanceCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.LeaveBalanceWhereInput;
        orderBy?: Prisma.LeaveBalanceOrderByWithRelationInput;
    }): Promise<({
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
        };
        leavePeriod: {
            id: bigint;
            name: string;
        };
        leaveTypeConfig: {
            id: bigint;
            name: string;
            type: import("@prisma/client").$Enums.LeaveType;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    })[]>;
    findByEmployee(employeeId: bigint, leavePeriodId?: bigint): Promise<({
        leavePeriod: {
            id: bigint;
            name: string;
            isActive: boolean;
        };
        leaveTypeConfig: {
            id: bigint;
            name: string;
            type: import("@prisma/client").$Enums.LeaveType;
            maxConsecutiveDays: number | null;
            advanceNoticeDays: number;
            isCarryForward: boolean;
            maxCarryForward: number | null;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    })[]>;
    findByEmployeeAndType(employeeId: bigint, leaveTypeConfigId: bigint): Promise<({
        leavePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            createdBy: bigint;
        };
        leaveTypeConfig: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: import("@prisma/client").$Enums.LeaveType;
            description: string | null;
            isActive: boolean;
            defaultQuota: number;
            maxConsecutiveDays: number | null;
            advanceNoticeDays: number;
            isCarryForward: boolean;
            maxCarryForward: number | null;
            leavePeriodId: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }) | null>;
    findSpecific(employeeId: bigint, leavePeriodId: bigint, leaveTypeConfigId: bigint): Promise<({
        leavePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            createdBy: bigint;
        };
        leaveTypeConfig: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: import("@prisma/client").$Enums.LeaveType;
            description: string | null;
            isActive: boolean;
            defaultQuota: number;
            maxConsecutiveDays: number | null;
            advanceNoticeDays: number;
            isCarryForward: boolean;
            maxCarryForward: number | null;
            leavePeriodId: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }) | null>;
    update(id: bigint, data: Prisma.LeaveBalanceUpdateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }>;
    updateSpecific(employeeId: bigint, leavePeriodId: bigint, leaveTypeConfigId: bigint, data: Prisma.LeaveBalanceUpdateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }>;
    createOrUpdate(employeeId: bigint, leavePeriodId: bigint, leaveTypeConfigId: bigint, data: Partial<Prisma.LeaveBalanceCreateInput>): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }>;
    delete(id: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }>;
    count(where?: Prisma.LeaveBalanceWhereInput): Promise<number>;
    findActivePeriod(): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
    } | null>;
    updateQuotas(employeeId: bigint, leavePeriodId: bigint, leaveTypeConfigId: bigint, usedDays: number): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }>;
    initializeBalance(employeeId: bigint, leaveTypeConfigId: bigint, customQuota?: number): Promise<({
        leavePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
            createdBy: bigint;
        };
        leaveTypeConfig: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: import("@prisma/client").$Enums.LeaveType;
            description: string | null;
            isActive: boolean;
            defaultQuota: number;
            maxConsecutiveDays: number | null;
            advanceNoticeDays: number;
            isCarryForward: boolean;
            maxCarryForward: number | null;
            leavePeriodId: bigint;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        totalQuota: number;
        usedQuota: number;
        pendingQuota: number;
        carriedForward: number;
        leaveTypeConfigId: bigint;
    }) | null>;
}
