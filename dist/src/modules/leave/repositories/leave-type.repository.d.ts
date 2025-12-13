import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class LeaveTypeRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.LeaveTypeConfigCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    }>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.LeaveTypeConfigWhereInput;
        orderBy?: Prisma.LeaveTypeConfigOrderByWithRelationInput;
    }): Promise<({
        leavePeriod: {
            id: bigint;
            name: string;
            isActive: boolean;
        };
        _count: {
            leaveRequests: number;
            leaveBalances: number;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    })[]>;
    findById(id: number): Promise<({
        leaveBalances: ({
            employee: {
                id: bigint;
                firstName: string;
                lastName: string;
                department: string;
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
        })[];
        leavePeriod: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            createdBy: bigint;
            endDate: Date;
            isActive: boolean;
            startDate: Date;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    }) | null>;
    findByPeriod(leavePeriodId: bigint, activeOnly?: boolean): Promise<({
        _count: {
            leaveRequests: number;
            leaveBalances: number;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    })[]>;
    findByTypeAndPeriod(type: string, leavePeriodId: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    } | null>;
    update(id: number, data: Prisma.LeaveTypeConfigUpdateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    }>;
    delete(id: number): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        type: import("@prisma/client").$Enums.LeaveType;
        isActive: boolean;
        defaultQuota: number;
        maxConsecutiveDays: number | null;
        advanceNoticeDays: number;
        isCarryForward: boolean;
        maxCarryForward: number | null;
        leavePeriodId: bigint;
    }>;
    isUsedInBalancesOrRequests(id: number): Promise<boolean>;
    count(where?: Prisma.LeaveTypeConfigWhereInput): Promise<number>;
}
