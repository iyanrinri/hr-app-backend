import { OvertimeApprovalRepository } from '../repositories/overtime-approval.repository';
import { OvertimeRequestRepository } from '../repositories/overtime-request.repository';
import { CreateOvertimeApprovalDto, UpdateOvertimeApprovalDto, ApprovalStatus, ApproverType } from '../dto/overtime-approval.dto';
import { OvertimeApprovalResponseDto } from '../dto/overtime-response.dto';
export declare class OvertimeApprovalService {
    private overtimeApprovalRepository;
    private overtimeRequestRepository;
    constructor(overtimeApprovalRepository: OvertimeApprovalRepository, overtimeRequestRepository: OvertimeRequestRepository);
    private transformApprovalResponse;
    create(createOvertimeApprovalDto: CreateOvertimeApprovalDto): Promise<OvertimeApprovalResponseDto>;
    processApproval(overtimeRequestId: number, approverId: number, approverType: ApproverType, status: ApprovalStatus, comments?: string): Promise<OvertimeApprovalResponseDto>;
    private updateOvertimeRequestStatus;
    findAll(params?: {
        skip?: number;
        take?: number;
        approverId?: number;
        status?: string;
        approverType?: string;
    }): Promise<{
        approvals: OvertimeApprovalResponseDto[];
        total: number;
    }>;
    findOne(id: number): Promise<OvertimeApprovalResponseDto>;
    update(id: number, updateOvertimeApprovalDto: UpdateOvertimeApprovalDto): Promise<OvertimeApprovalResponseDto>;
    getPendingApprovals(approverId?: number, approverType?: string): Promise<OvertimeApprovalResponseDto[]>;
    getApprovalStats(approverId?: number, startDate?: string, endDate?: string): Promise<Record<string, number>>;
    remove(id: number): Promise<void>;
}
