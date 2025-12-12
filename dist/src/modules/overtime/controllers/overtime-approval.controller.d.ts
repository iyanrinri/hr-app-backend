import { OvertimeApprovalService } from '../services/overtime-approval.service';
import { CreateOvertimeApprovalDto, UpdateOvertimeApprovalDto, ApprovalStatus, ApproverType } from '../dto/overtime-approval.dto';
import { OvertimeApprovalResponseDto } from '../dto/overtime-response.dto';
export declare class OvertimeApprovalController {
    private readonly overtimeApprovalService;
    constructor(overtimeApprovalService: OvertimeApprovalService);
    create(createOvertimeApprovalDto: CreateOvertimeApprovalDto): Promise<OvertimeApprovalResponseDto>;
    processApproval(body: {
        overtimeRequestId: number;
        approverId: number;
        approverType: ApproverType;
        status: ApprovalStatus;
        comments?: string;
    }): Promise<OvertimeApprovalResponseDto>;
    findAll(skip?: number, take?: number, approverId?: number, status?: string, approverType?: string, req?: any): Promise<{
        approvals: OvertimeApprovalResponseDto[];
        total: number;
    }>;
    getPendingApprovals(approverType?: string, req?: any): Promise<OvertimeApprovalResponseDto[]>;
    getApprovalStats(approverId?: number, startDate?: string, endDate?: string, req?: any): Promise<Record<string, number>>;
    findOne(id: number): Promise<OvertimeApprovalResponseDto>;
    update(id: number, updateOvertimeApprovalDto: UpdateOvertimeApprovalDto): Promise<OvertimeApprovalResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
