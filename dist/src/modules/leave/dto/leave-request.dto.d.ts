export declare class CreateLeaveRequestDto {
    leaveTypeConfigId: string;
    startDate: string;
    endDate: string;
    reason: string;
    emergencyContact?: string;
    handoverNotes?: string;
}
export declare class ApproveLeaveRequestDto {
    comments?: string;
}
export declare class RejectLeaveRequestDto {
    rejectionReason: string;
    comments?: string;
}
export declare class LeaveRequestResponseDto {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: string;
    submittedAt: string;
    managerComments?: string;
    hrComments?: string;
    emergencyContact?: string;
    handoverNotes?: string;
    requiresManagerApproval?: boolean;
    managerApprovalStatus?: string;
    managerApprovedAt?: string;
    hrApprovalStatus?: string;
    hrApprovedAt?: string;
}
export declare class LeaveBalanceResponseDto {
    id: string;
    leaveTypeName: string;
    totalQuota: number;
    usedQuota: number;
    remainingQuota: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}
export declare class LeaveBalanceSummaryDto {
    employeeId: string;
    employeeName: string;
    balances: LeaveBalanceResponseDto[];
    totalQuota: number;
    totalUsed: number;
    totalRemaining: number;
}
export declare class LeaveRequestHistoryDto {
    id: string;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: string;
    submittedAt: string;
    approvedAt?: string;
    approvedBy?: string;
    approverComments?: string;
    requiresManagerApproval?: boolean;
    managerApprovalStatus?: string;
    managerApprovedAt?: string;
    hrApprovalStatus?: string;
    hrApprovedAt?: string;
}
