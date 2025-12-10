import { LeaveRequestService } from '../services/leave-request.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { CreateLeaveRequestDto, LeaveRequestResponseDto, ApproveLeaveRequestDto, RejectLeaveRequestDto, LeaveRequestHistoryDto } from '../dto/leave-request.dto';
import { LeaveRequestStatus } from '@prisma/client';
export declare class LeaveRequestController {
    private readonly leaveRequestService;
    private readonly employeeService;
    constructor(leaveRequestService: LeaveRequestService, employeeService: EmployeeService);
    submitLeaveRequest(createDto: CreateLeaveRequestDto, req: any): Promise<LeaveRequestResponseDto>;
    getMyLeaveRequests(req: any, status?: LeaveRequestStatus, startDate?: string, endDate?: string, page?: string, limit?: string): Promise<LeaveRequestHistoryDto[]>;
    getLeaveRequest(id: number, req: any): Promise<LeaveRequestResponseDto>;
    cancelLeaveRequest(id: number, req: any): Promise<LeaveRequestResponseDto>;
    getPendingApprovals(req: any, department?: string, page?: string, limit?: string): Promise<LeaveRequestHistoryDto[]>;
    approveLeaveRequest(id: number, approveDto: ApproveLeaveRequestDto, req: any): Promise<LeaveRequestResponseDto>;
    rejectLeaveRequest(id: number, rejectDto: RejectLeaveRequestDto, req: any): Promise<LeaveRequestResponseDto>;
}
