import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class LeaveRequestRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.LeaveRequestCreateInput): Promise<{
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            department: string;
            manager: {
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
                managerId: bigint | null;
                userId: bigint;
            } | null;
        };
        leaveTypeConfig: {
            id: bigint;
            name: string;
            type: import("@prisma/client").$Enums.LeaveType;
        };
        approvals: ({
            approver: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            comments: string | null;
            approvedAt: Date | null;
            approverId: bigint;
            approverType: string;
            leaveRequestId: bigint;
        })[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }>;
    findAll(params?: {
        skip?: number;
        take?: number;
        where?: Prisma.LeaveRequestWhereInput;
        orderBy?: Prisma.LeaveRequestOrderByWithRelationInput;
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
        approvals: ({
            approver: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            comments: string | null;
            approvedAt: Date | null;
            approverId: bigint;
            approverType: string;
            leaveRequestId: bigint;
        })[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    })[]>;
    findById(id: bigint): Promise<({
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            department: string;
            manager: {
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
                managerId: bigint | null;
                userId: bigint;
            } | null;
        };
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
        approvals: ({
            approver: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            comments: string | null;
            approvedAt: Date | null;
            approverId: bigint;
            approverType: string;
            leaveRequestId: bigint;
        })[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }) | null>;
    findByEmployee(employeeId: bigint, params?: {
        skip?: number;
        take?: number;
        status?: string;
    }): Promise<({
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
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    })[]>;
    findPendingForApprover(approverId: bigint): Promise<({
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
        approvals: ({
            approver: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApprovalStatus;
            comments: string | null;
            approvedAt: Date | null;
            approverId: bigint;
            approverType: string;
            leaveRequestId: bigint;
        })[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    })[]>;
    findConflicting(employeeId: bigint, startDate: Date, endDate: Date, excludeId?: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }[]>;
    update(id: bigint, data: Prisma.LeaveRequestUpdateInput): Promise<{
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            department: string;
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
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }>;
    delete(id: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }>;
    count(where?: Prisma.LeaveRequestWhereInput): Promise<number>;
    approveRequest(id: bigint, approverId: bigint, comments?: string, level?: 'MANAGER' | 'HR'): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }>;
    rejectRequest(id: bigint, approverId: bigint, rejectionReason: string, comments?: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaveRequestStatus;
        startDate: Date;
        endDate: Date;
        employeeId: bigint;
        leavePeriodId: bigint;
        leaveTypeConfigId: bigint;
        totalDays: number;
        reason: string;
        managerComments: string | null;
        hrComments: string | null;
        rejectionReason: string | null;
        emergencyContact: string | null;
        handoverNotes: string | null;
        submittedAt: Date;
        managerApprovedAt: Date | null;
        hrApprovedAt: Date | null;
        finalizedAt: Date | null;
    }>;
}
