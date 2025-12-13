import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class LeavePeriodRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.LeavePeriodCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        createdBy: bigint;
        endDate: Date;
        isActive: boolean;
        startDate: Date;
    }>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.LeavePeriodWhereInput;
        orderBy?: Prisma.LeavePeriodOrderByWithRelationInput;
    }): Promise<({
        _count: {
            leaveRequests: number;
            leaveBalances: number;
        };
        leaveTypes: {
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
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        createdBy: bigint;
        endDate: Date;
        isActive: boolean;
        startDate: Date;
    })[]>;
    findById(id: bigint): Promise<({
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
        leaveTypes: {
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
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        createdBy: bigint;
        endDate: Date;
        isActive: boolean;
        startDate: Date;
    }) | null>;
    findActive(): Promise<({
        leaveTypes: {
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
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        createdBy: bigint;
        endDate: Date;
        isActive: boolean;
        startDate: Date;
    }) | null>;
    update(id: bigint, data: Prisma.LeavePeriodUpdateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        createdBy: bigint;
        endDate: Date;
        isActive: boolean;
        startDate: Date;
    }>;
    delete(id: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        createdBy: bigint;
        endDate: Date;
        isActive: boolean;
        startDate: Date;
    }>;
    count(where?: Prisma.LeavePeriodWhereInput): Promise<number>;
}
