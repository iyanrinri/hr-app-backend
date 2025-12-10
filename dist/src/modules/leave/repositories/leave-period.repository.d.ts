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
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
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
            type: import("@prisma/client").$Enums.LeaveType;
            description: string | null;
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
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
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
            type: import("@prisma/client").$Enums.LeaveType;
            description: string | null;
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
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
    }) | null>;
    findActive(): Promise<({
        leaveTypes: {
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
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
    }) | null>;
    update(id: bigint, data: Prisma.LeavePeriodUpdateInput): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
    }>;
    delete(id: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
    }>;
    count(where?: Prisma.LeavePeriodWhereInput): Promise<number>;
}
