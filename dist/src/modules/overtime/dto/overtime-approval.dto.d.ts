export declare enum ApprovalStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum ApproverType {
    MANAGER = "MANAGER",
    HR = "HR"
}
export declare class CreateOvertimeApprovalDto {
    overtimeRequestId: number;
    approverId: number;
    approverType: ApproverType;
    status: ApprovalStatus;
    comments?: string;
}
export declare class UpdateOvertimeApprovalDto {
    status?: ApprovalStatus;
    comments?: string;
}
