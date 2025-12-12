import { PrismaService } from '../../../database/prisma.service';
import { LeaveRequestRepository } from '../repositories/leave-request.repository';
import { LeaveBalanceRepository } from '../repositories/leave-balance.repository';
import { LeaveEmailService } from './leave-email.service';
import { CreateLeaveRequestDto, LeaveRequestResponseDto, ApproveLeaveRequestDto, RejectLeaveRequestDto, LeaveRequestHistoryDto } from '../dto/leave-request.dto';
import { LeaveRequestStatus, Role } from '@prisma/client';
export declare class LeaveRequestService {
    private readonly leaveRequestRepository;
    private readonly leaveBalanceRepository;
    private readonly leaveEmailService;
    private readonly prisma;
    constructor(leaveRequestRepository: LeaveRequestRepository, leaveBalanceRepository: LeaveBalanceRepository, leaveEmailService: LeaveEmailService, prisma: PrismaService);
    submitRequest(createDto: CreateLeaveRequestDto, employeeId: number): Promise<LeaveRequestResponseDto>;
    getEmployeeRequests(employeeId: number, filters: {
        status?: LeaveRequestStatus;
        startDate?: string;
        endDate?: string;
        page: number;
        limit: number;
    }): Promise<LeaveRequestHistoryDto[]>;
    getRequestDetails(requestId: number, employeeId: number, userRole: Role): Promise<LeaveRequestResponseDto>;
    cancelRequest(requestId: number, employeeId: number): Promise<LeaveRequestResponseDto>;
    getPendingApprovals(approverId: number, approverRole: Role, filters: {
        department?: string;
        page: number;
        limit: number;
    }): Promise<LeaveRequestHistoryDto[]>;
    approveRequest(requestId: number, approverId: number, approverRole: Role, approveDto: ApproveLeaveRequestDto): Promise<LeaveRequestResponseDto>;
    rejectRequest(requestId: number, approverId: number, approverRole: Role, rejectDto: RejectLeaveRequestDto): Promise<LeaveRequestResponseDto>;
    private checkHasSubordinates;
    private mapToResponseDto;
    private mapToHistoryDto;
    private getApprovalStatuses;
}
