export declare enum OvertimeStatus {
    PENDING = "PENDING",
    MANAGER_APPROVED = "MANAGER_APPROVED",
    HR_APPROVED = "HR_APPROVED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class UpdateOvertimeRequestDto {
    status?: OvertimeStatus;
    managerComments?: string;
    hrComments?: string;
    rejectionReason?: string;
}
