import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { LeaveRequestRepository } from '../repositories/leave-request.repository';
import { LeaveBalanceRepository } from '../repositories/leave-balance.repository';
import { LeaveEmailService } from './leave-email.service';
import { 
  CreateLeaveRequestDto, 
  LeaveRequestResponseDto, 
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
  LeaveRequestHistoryDto
} from '../dto/leave-request.dto';
import { LeaveRequestStatus, Role } from '@prisma/client';

@Injectable()
export class LeaveRequestService {
  constructor(
    private readonly leaveRequestRepository: LeaveRequestRepository,
    private readonly leaveBalanceRepository: LeaveBalanceRepository,
    private readonly leaveEmailService: LeaveEmailService
  ) {}

  async submitRequest(
    createDto: CreateLeaveRequestDto,
    employeeId: number
  ): Promise<LeaveRequestResponseDto> {
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);

    // Validate dates
    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Cannot request leave for past dates');
    }

    // Calculate total days
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Get active period
    const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
    if (!activePeriod) {
      throw new BadRequestException('No active leave period found');
    }

    // Get or create employee balance for this leave type
    let balance = await this.leaveBalanceRepository.findSpecific(
      BigInt(employeeId),
      activePeriod.id,
      BigInt(createDto.leaveTypeConfigId)
    );

    if (!balance) {
      // Auto-initialize balance if not found
      balance = await this.leaveBalanceRepository.initializeBalance(
        BigInt(employeeId),
        BigInt(createDto.leaveTypeConfigId)
      );
    }

    // Additional null check after initialization
    if (!balance) {
      throw new Error('Failed to initialize leave balance');
    }

    // Check if employee has sufficient balance
    const availableBalance = balance!.totalQuota - balance!.usedQuota;
    if (totalDays > availableBalance) {
      throw new BadRequestException(
        `Insufficient leave balance. Available: ${availableBalance} days, Requested: ${totalDays} days`
      );
    }

    // Check advance notice requirement
    const advanceNoticeDays = balance!.leaveTypeConfig.advanceNoticeDays;
    const noticeDate = new Date();
    noticeDate.setDate(noticeDate.getDate() + advanceNoticeDays);
    
    if (startDate < noticeDate) {
      throw new BadRequestException(
        `This leave type requires ${advanceNoticeDays} days advance notice`
      );
    }

    // Check maximum consecutive days
    const maxConsecutiveDays = balance!.leaveTypeConfig.maxConsecutiveDays;
    if (maxConsecutiveDays && totalDays > maxConsecutiveDays) {
      throw new BadRequestException(
        `Maximum consecutive days for this leave type is ${maxConsecutiveDays} days`
      );
    }

    // Check for overlapping requests
    const overlapping = await this.leaveRequestRepository.findConflicting(
      BigInt(employeeId),
      startDate,
      endDate
    );

    if (overlapping.length > 0) {
      throw new BadRequestException('Leave request overlaps with existing request');
    }

    // Create the leave request
    const leaveRequest = await this.leaveRequestRepository.create({
      employee: { connect: { id: BigInt(employeeId) } },
      leaveTypeConfig: { connect: { id: BigInt(createDto.leaveTypeConfigId) } },
      leavePeriod: { connect: { id: activePeriod.id } },
      startDate,
      endDate,
      totalDays,
      reason: createDto.reason,
      status: LeaveRequestStatus.PENDING,
      emergencyContact: createDto.emergencyContact,
      handoverNotes: createDto.handoverNotes,
      submittedAt: new Date()
    });

    // Update pending quota (use activePeriod.id)
    await this.leaveBalanceRepository.updateQuotas(
      BigInt(employeeId),
      activePeriod.id,
      BigInt(createDto.leaveTypeConfigId),
      totalDays
    );

    // Send notification to manager/HR
    await this.leaveEmailService.notifyLeaveSubmission(
      leaveRequest,
      'manager@company.com', // You might want to get actual manager email
      'hr@company.com'
    );

    return this.mapToResponseDto(leaveRequest);
  }

  async getEmployeeRequests(
    employeeId: number,
    filters: {
      status?: LeaveRequestStatus;
      startDate?: string;
      endDate?: string;
      page: number;
      limit: number;
    }
  ): Promise<LeaveRequestHistoryDto[]> {
    const skip = (filters.page - 1) * filters.limit;
    
    const whereConditions: any = {
      employeeId: BigInt(employeeId)
    };

    if (filters.status) {
      whereConditions.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      whereConditions.startDate = {};
      if (filters.startDate) {
        whereConditions.startDate.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        whereConditions.startDate.lte = new Date(filters.endDate);
      }
    }

    const requests = await this.leaveRequestRepository.findByEmployee(
      BigInt(employeeId),
      { 
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
        status: filters.status
      }
    );

    return requests.map(request => this.mapToHistoryDto(request));
  }

  async getRequestDetails(
    requestId: number,
    employeeId: number,
    userRole: Role
  ): Promise<LeaveRequestResponseDto> {
    const request = await this.leaveRequestRepository.findById(BigInt(requestId));
    
    if (!request) {
      throw new NotFoundException(`Leave request with ID ${requestId} not found`);
    }

    // Check access permissions
    if (userRole === Role.EMPLOYEE && Number(request.employeeId) !== employeeId) {
      throw new ForbiddenException('You can only view your own leave requests');
    }

    return this.mapToResponseDto(request);
  }

  async cancelRequest(requestId: number, employeeId: number): Promise<LeaveRequestResponseDto> {
    const request = await this.leaveRequestRepository.findById(BigInt(requestId));
    
    if (!request) {
      throw new NotFoundException(`Leave request with ID ${requestId} not found`);
    }

    if (Number(request.employeeId) !== employeeId) {
      throw new ForbiddenException('You can only cancel your own leave requests');
    }

    if (request.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be cancelled');
    }

    // Update request status
    const updatedRequest = await this.leaveRequestRepository.update(BigInt(requestId), {
      status: LeaveRequestStatus.CANCELLED
    });

    // Update pending quota (reduce it)
    // Get active period first
    const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
    if (!activePeriod) {
      throw new BadRequestException('No active leave period found');
    }

    // Update balance - revert the pending quota
    const balance = await this.leaveBalanceRepository.findByEmployeeAndType(
      BigInt(employeeId),
      request.leaveTypeConfigId
    );

    if (balance) {
      await this.leaveBalanceRepository.updateQuotas(
        BigInt(employeeId),
        activePeriod.id,
        request.leaveTypeConfigId,
        -request.totalDays // Negative to revert
      );
    }

    // Send cancellation notification
    // await this.leaveEmailService.notifyLeaveApproval(updatedRequest, { firstName: 'System', lastName: '', position: 'System' }, false, 'Request cancelled by employee');

    return this.mapToResponseDto(updatedRequest);
  }

  async getPendingApprovals(
    approverId: number,
    approverRole: Role,
    filters: {
      department?: string;
      page: number;
      limit: number;
    }
  ): Promise<LeaveRequestHistoryDto[]> {
    const skip = (filters.page - 1) * filters.limit;
    
    const whereConditions: any = {
      status: LeaveRequestStatus.PENDING
    };

    if (filters.department) {
      whereConditions.employee = {
        department: filters.department
      };
    }

    const requests = await this.leaveRequestRepository.findAll({
      where: whereConditions,
      skip,
      take: filters.limit,
      orderBy: { submittedAt: 'asc' }
    });

    return requests.map(request => this.mapToHistoryDto(request));
  }

  async approveRequest(
    requestId: number,
    approverId: number,
    approverRole: Role,
    approveDto: ApproveLeaveRequestDto
  ): Promise<LeaveRequestResponseDto> {
    const request = await this.leaveRequestRepository.findById(BigInt(requestId));
    
    if (!request) {
      throw new NotFoundException(`Leave request with ID ${requestId} not found`);
    }

    if (request.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be approved');
    }

    // Update request status and create approval record
    const updatedRequest = await this.leaveRequestRepository.approveRequest(
      BigInt(requestId),
      BigInt(approverId),
      approveDto.comments || ''
    );

    // Get active period first
    const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
    if (!activePeriod) {
      throw new BadRequestException('No active leave period found');
    }

    // Update leave balance (this confirms the quota usage)
    const balance = await this.leaveBalanceRepository.findByEmployeeAndType(
      request.employeeId,
      request.leaveTypeConfigId
    );

    // Note: updateQuotas will handle incrementing used quota
    // No need to recalculate here since the quota was already allocated on submission

    // Send approval notification
    // await this.leaveEmailService.notifyLeaveApproval(updatedRequest, { firstName: 'Manager', lastName: '', position: 'Manager' }, true, approveDto.comments);

    return this.mapToResponseDto(updatedRequest);
  }

  async rejectRequest(
    requestId: number,
    approverId: number,
    approverRole: Role,
    rejectDto: RejectLeaveRequestDto
  ): Promise<LeaveRequestResponseDto> {
    const request = await this.leaveRequestRepository.findById(BigInt(requestId));
    
    if (!request) {
      throw new NotFoundException(`Leave request with ID ${requestId} not found`);
    }

    if (request.status !== LeaveRequestStatus.PENDING) {
      throw new BadRequestException('Only pending requests can be rejected');
    }

    // Update request status and create approval record
    const updatedRequest = await this.leaveRequestRepository.rejectRequest(
      BigInt(requestId),
      BigInt(approverId),
      rejectDto.rejectionReason,
      rejectDto.comments
    );

    // Get active period first
    const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
    if (!activePeriod) {
      throw new BadRequestException('No active leave period found');
    }

    // Update pending quota (reduce it since request is rejected) 
    const balance = await this.leaveBalanceRepository.findByEmployeeAndType(
      request.employeeId,
      request.leaveTypeConfigId
    );

    if (balance) {
      await this.leaveBalanceRepository.updateQuotas(
        request.employeeId,
        activePeriod.id,
        request.leaveTypeConfigId,
        -request.totalDays // Negative to revert
      );
    }

    // Send rejection notification
    // Send rejection notification
    // await this.leaveEmailService.notifyLeaveApproval(updatedRequest, { firstName: 'Manager', lastName: '', position: 'Manager' }, false, rejectDto.rejectionReason);

    return this.mapToResponseDto(updatedRequest);
  }

  private mapToResponseDto(request: any): LeaveRequestResponseDto {
    return {
      id: request.id.toString(),
      employeeId: request.employeeId.toString(),
      employeeName: request.employee ? 
        `${request.employee.firstName} ${request.employee.lastName}` : 'Unknown',
      leaveTypeName: request.leaveTypeConfig?.name || 'Unknown',
      startDate: request.startDate.toISOString().split('T')[0],
      endDate: request.endDate.toISOString().split('T')[0],
      totalDays: request.totalDays,
      reason: request.reason,
      status: request.status,
      submittedAt: request.submittedAt ? request.submittedAt.toISOString() : request.createdAt.toISOString(),
      managerComments: request.managerComments,
      hrComments: request.hrComments,
      emergencyContact: request.emergencyContact,
      handoverNotes: request.handoverNotes
    };
  }

  private mapToHistoryDto(request: any): LeaveRequestHistoryDto {
    const lastApproval = request.approvals && request.approvals.length > 0 
      ? request.approvals[request.approvals.length - 1] 
      : null;

    return {
      id: request.id.toString(),
      leaveTypeName: request.leaveTypeConfig?.name || 'Unknown',
      startDate: request.startDate.toISOString().split('T')[0],
      endDate: request.endDate.toISOString().split('T')[0],
      totalDays: request.totalDays,
      reason: request.reason,
      status: request.status,
      submittedAt: request.submittedAt ? request.submittedAt.toISOString() : request.createdAt.toISOString(),
      approvedAt: lastApproval?.approvedAt ? lastApproval.approvedAt.toISOString() : undefined,
      approvedBy: lastApproval?.approver ? 
        `${lastApproval.approver.firstName} ${lastApproval.approver.lastName}` : undefined,
      approverComments: lastApproval?.comments
    };
  }
}