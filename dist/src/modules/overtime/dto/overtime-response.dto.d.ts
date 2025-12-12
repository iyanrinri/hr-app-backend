import { OvertimeStatus } from './update-overtime-request.dto';
import { ApprovalStatus, ApproverType } from './overtime-approval.dto';
export declare class OvertimeRequestResponseDto {
    id: string;
    employeeId: string;
    attendanceId?: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    totalMinutes: number;
    reason: string;
    status: OvertimeStatus;
    overtimeRate?: string;
    calculatedAmount?: string;
    managerComments?: string;
    hrComments?: string;
    rejectionReason?: string;
    submittedAt: Date;
    managerApprovedAt?: Date;
    hrApprovedAt?: Date;
    finalizedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    employee?: {
        id: string;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
    };
    attendance?: {
        id: string;
        date: Date;
        checkIn?: Date;
        checkOut?: Date;
        workDuration?: number;
    };
    approvals?: OvertimeApprovalResponseDto[];
}
export declare class OvertimeApprovalResponseDto {
    id: string;
    overtimeRequestId: string;
    approverId: string;
    approverType: ApproverType;
    status: ApprovalStatus;
    comments?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    approver?: {
        id: string;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
    };
}
export declare class PaginatedOvertimeResponseDto {
    requests: OvertimeRequestResponseDto[];
    total: number;
    skip: number;
    take: number;
}
