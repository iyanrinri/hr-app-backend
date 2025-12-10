import { LeaveType } from '@prisma/client';
export declare class CreateLeaveTypeConfigDto {
    leavePeriodId: number;
    type: LeaveType;
    name: string;
    description?: string;
    defaultQuota: number;
    maxConsecutiveDays?: number;
    advanceNoticeDays: number;
    isCarryForward?: boolean;
    maxCarryForward?: number;
    isActive?: boolean;
}
export declare class UpdateLeaveTypeConfigDto {
    name?: string;
    description?: string;
    defaultQuota?: number;
    maxConsecutiveDays?: number;
    advanceNoticeDays?: number;
    isCarryForward?: boolean;
    maxCarryForward?: number;
    isActive?: boolean;
}
export declare class LeaveTypeConfigResponseDto {
    id: number;
    type: LeaveType;
    name: string;
    description?: string;
    defaultQuota: number;
    maxConsecutiveDays?: number;
    advanceNoticeDays: number;
    isCarryForward?: boolean;
    maxCarryForward?: number;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}
