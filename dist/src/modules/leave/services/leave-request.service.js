"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveRequestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const leave_request_repository_1 = require("../repositories/leave-request.repository");
const leave_balance_repository_1 = require("../repositories/leave-balance.repository");
const leave_email_service_1 = require("./leave-email.service");
const client_1 = require("@prisma/client");
let LeaveRequestService = class LeaveRequestService {
    leaveRequestRepository;
    leaveBalanceRepository;
    leaveEmailService;
    prisma;
    constructor(leaveRequestRepository, leaveBalanceRepository, leaveEmailService, prisma) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leaveEmailService = leaveEmailService;
        this.prisma = prisma;
    }
    async submitRequest(createDto, employeeId) {
        const startDate = new Date(createDto.startDate);
        const endDate = new Date(createDto.endDate);
        if (startDate > endDate) {
            throw new common_1.BadRequestException('Start date cannot be after end date');
        }
        if (startDate < new Date()) {
            throw new common_1.BadRequestException('Cannot request leave for past dates');
        }
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
        if (!activePeriod) {
            throw new common_1.BadRequestException('No active leave period found');
        }
        let balance = await this.leaveBalanceRepository.findSpecific(BigInt(employeeId), activePeriod.id, BigInt(createDto.leaveTypeConfigId));
        if (!balance) {
            balance = await this.leaveBalanceRepository.initializeBalance(BigInt(employeeId), BigInt(createDto.leaveTypeConfigId));
        }
        if (!balance) {
            throw new Error('Failed to initialize leave balance');
        }
        const availableBalance = balance.totalQuota - balance.usedQuota;
        if (totalDays > availableBalance) {
            throw new common_1.BadRequestException(`Insufficient leave balance. Available: ${availableBalance} days, Requested: ${totalDays} days`);
        }
        const advanceNoticeDays = balance.leaveTypeConfig.advanceNoticeDays;
        const noticeDate = new Date();
        noticeDate.setDate(noticeDate.getDate() + advanceNoticeDays);
        if (startDate < noticeDate) {
            throw new common_1.BadRequestException(`This leave type requires ${advanceNoticeDays} days advance notice`);
        }
        const maxConsecutiveDays = balance.leaveTypeConfig.maxConsecutiveDays;
        if (maxConsecutiveDays && totalDays > maxConsecutiveDays) {
            throw new common_1.BadRequestException(`Maximum consecutive days for this leave type is ${maxConsecutiveDays} days`);
        }
        const overlapping = await this.leaveRequestRepository.findConflicting(BigInt(employeeId), startDate, endDate);
        if (overlapping.length > 0) {
            throw new common_1.BadRequestException('Leave request overlaps with existing request');
        }
        const leaveRequest = await this.leaveRequestRepository.create({
            employee: { connect: { id: BigInt(employeeId) } },
            leaveTypeConfig: { connect: { id: BigInt(createDto.leaveTypeConfigId) } },
            leavePeriod: { connect: { id: activePeriod.id } },
            startDate,
            endDate,
            totalDays,
            reason: createDto.reason,
            status: client_1.LeaveRequestStatus.PENDING,
            emergencyContact: createDto.emergencyContact,
            handoverNotes: createDto.handoverNotes,
            submittedAt: new Date()
        });
        await this.leaveBalanceRepository.updateQuotas(BigInt(employeeId), activePeriod.id, BigInt(createDto.leaveTypeConfigId), totalDays);
        await this.leaveEmailService.notifyLeaveSubmission(leaveRequest, 'manager@company.com', 'hr@company.com');
        return this.mapToResponseDto(leaveRequest);
    }
    async getEmployeeRequests(employeeId, filters) {
        const skip = (filters.page - 1) * filters.limit;
        const whereConditions = {
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
        const requests = await this.leaveRequestRepository.findByEmployee(BigInt(employeeId), {
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
            status: filters.status
        });
        return requests.map(request => this.mapToHistoryDto(request));
    }
    async getRequestDetails(requestId, employeeId, userRole) {
        const request = await this.leaveRequestRepository.findById(BigInt(requestId));
        if (!request) {
            throw new common_1.NotFoundException(`Leave request with ID ${requestId} not found`);
        }
        if (userRole === client_1.Role.EMPLOYEE && Number(request.employeeId) !== employeeId) {
            throw new common_1.ForbiddenException('You can only view your own leave requests');
        }
        return this.mapToResponseDto(request);
    }
    async cancelRequest(requestId, employeeId) {
        const request = await this.leaveRequestRepository.findById(BigInt(requestId));
        if (!request) {
            throw new common_1.NotFoundException(`Leave request with ID ${requestId} not found`);
        }
        if (Number(request.employeeId) !== employeeId) {
            throw new common_1.ForbiddenException('You can only cancel your own leave requests');
        }
        if (request.status !== client_1.LeaveRequestStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending requests can be cancelled');
        }
        const updatedRequest = await this.leaveRequestRepository.update(BigInt(requestId), {
            status: client_1.LeaveRequestStatus.CANCELLED
        });
        const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
        if (!activePeriod) {
            throw new common_1.BadRequestException('No active leave period found');
        }
        const balance = await this.leaveBalanceRepository.findByEmployeeAndType(BigInt(employeeId), request.leaveTypeConfigId);
        if (balance) {
            await this.leaveBalanceRepository.updateQuotas(BigInt(employeeId), activePeriod.id, request.leaveTypeConfigId, -request.totalDays);
        }
        return this.mapToResponseDto(updatedRequest);
    }
    async getPendingApprovals(approverId, approverRole, filters) {
        const skip = (filters.page - 1) * filters.limit;
        if (approverRole === client_1.Role.HR || approverRole === client_1.Role.SUPER) {
            const whereConditions = {
                OR: [
                    { status: client_1.LeaveRequestStatus.MANAGER_APPROVED },
                    {
                        status: client_1.LeaveRequestStatus.PENDING,
                        employee: { managerId: null }
                    }
                ]
            };
            if (filters.department) {
                whereConditions.OR = whereConditions.OR.map((condition) => ({
                    ...condition,
                    employee: {
                        ...condition.employee,
                        department: filters.department
                    }
                }));
            }
            const requests = await this.leaveRequestRepository.findAll({
                where: whereConditions,
                skip,
                take: filters.limit,
                orderBy: { submittedAt: 'asc' }
            });
            return requests.map(request => this.mapToHistoryDto(request));
        }
        const hasSubordinates = await this.checkHasSubordinates(BigInt(approverId));
        if (hasSubordinates || approverRole === client_1.Role.MANAGER) {
            const requests = await this.leaveRequestRepository.findPendingForApprover(BigInt(approverId));
            const paginatedRequests = requests.slice(skip, skip + filters.limit);
            return paginatedRequests.map(request => this.mapToHistoryDto(request));
        }
        return [];
    }
    async approveRequest(requestId, approverId, approverRole, approveDto) {
        const request = await this.leaveRequestRepository.findById(BigInt(requestId));
        if (!request) {
            throw new common_1.NotFoundException(`Leave request with ID ${requestId} not found`);
        }
        const employee = await this.prisma.employee.findUnique({
            where: { id: request.employeeId },
            select: { managerId: true }
        });
        const hasManager = !!employee?.managerId;
        let approvalLevel;
        if (approverRole === client_1.Role.HR || approverRole === client_1.Role.SUPER) {
            if (hasManager) {
                if (request.status !== client_1.LeaveRequestStatus.MANAGER_APPROVED) {
                    throw new common_1.BadRequestException('HR can only approve requests that have been approved by manager first');
                }
            }
            else {
                if (request.status !== client_1.LeaveRequestStatus.PENDING) {
                    throw new common_1.BadRequestException('Only pending requests can be approved');
                }
            }
            approvalLevel = 'HR';
        }
        else {
            if (request.status !== client_1.LeaveRequestStatus.PENDING) {
                throw new common_1.BadRequestException('Only pending requests can be approved by manager');
            }
            if (!employee || employee.managerId !== BigInt(approverId)) {
                throw new common_1.ForbiddenException('You can only approve leave requests from your subordinates');
            }
            approvalLevel = 'MANAGER';
        }
        const updatedRequest = await this.leaveRequestRepository.approveRequest(BigInt(requestId), BigInt(approverId), approveDto.comments || '', approvalLevel);
        if (approvalLevel === 'HR') {
            const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
            if (!activePeriod) {
                throw new common_1.BadRequestException('No active leave period found');
            }
            const balance = await this.leaveBalanceRepository.findByEmployeeAndType(request.employeeId, request.leaveTypeConfigId);
        }
        return this.mapToResponseDto(updatedRequest);
    }
    async rejectRequest(requestId, approverId, approverRole, rejectDto) {
        const request = await this.leaveRequestRepository.findById(BigInt(requestId));
        if (!request) {
            throw new common_1.NotFoundException(`Leave request with ID ${requestId} not found`);
        }
        if (approverRole === client_1.Role.HR || approverRole === client_1.Role.SUPER) {
            if (request.status !== client_1.LeaveRequestStatus.MANAGER_APPROVED) {
                throw new common_1.BadRequestException('HR can only reject requests that have been approved by manager first');
            }
        }
        else {
            if (request.status !== client_1.LeaveRequestStatus.PENDING) {
                throw new common_1.BadRequestException('Only pending requests can be rejected by manager');
            }
            const employee = await this.prisma.employee.findUnique({
                where: { id: request.employeeId },
                select: { managerId: true }
            });
            if (!employee || employee.managerId !== BigInt(approverId)) {
                throw new common_1.ForbiddenException('You can only reject leave requests from your subordinates');
            }
        }
        const updatedRequest = await this.leaveRequestRepository.rejectRequest(BigInt(requestId), BigInt(approverId), rejectDto.rejectionReason, rejectDto.comments);
        const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
        if (!activePeriod) {
            throw new common_1.BadRequestException('No active leave period found');
        }
        const balance = await this.leaveBalanceRepository.findByEmployeeAndType(request.employeeId, request.leaveTypeConfigId);
        if (balance) {
            await this.leaveBalanceRepository.updateQuotas(request.employeeId, activePeriod.id, request.leaveTypeConfigId, -request.totalDays);
        }
        return this.mapToResponseDto(updatedRequest);
    }
    async checkHasSubordinates(employeeId) {
        const subordinatesCount = await this.prisma.employee.count({
            where: {
                managerId: employeeId,
                isDeleted: false
            }
        });
        return subordinatesCount > 0;
    }
    mapToResponseDto(request) {
        const requiresManagerApproval = !!request.employee?.managerId;
        const { managerStatus, hrStatus } = this.getApprovalStatuses(request, requiresManagerApproval);
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
            handoverNotes: request.handoverNotes,
            requiresManagerApproval: requiresManagerApproval,
            managerApprovalStatus: requiresManagerApproval ? managerStatus : undefined,
            managerApprovedAt: request.managerApprovedAt ? request.managerApprovedAt.toISOString() : undefined,
            hrApprovalStatus: hrStatus,
            hrApprovedAt: request.hrApprovedAt ? request.hrApprovedAt.toISOString() : undefined
        };
    }
    mapToHistoryDto(request) {
        const lastApproval = request.approvals && request.approvals.length > 0
            ? request.approvals[request.approvals.length - 1]
            : null;
        const requiresManagerApproval = !!request.employee?.managerId;
        const { managerStatus, hrStatus } = this.getApprovalStatuses(request, requiresManagerApproval);
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
            approverComments: lastApproval?.comments,
            requiresManagerApproval: requiresManagerApproval,
            managerApprovalStatus: requiresManagerApproval ? managerStatus : undefined,
            managerApprovedAt: request.managerApprovedAt ? request.managerApprovedAt.toISOString() : undefined,
            hrApprovalStatus: hrStatus,
            hrApprovedAt: request.hrApprovedAt ? request.hrApprovedAt.toISOString() : undefined
        };
    }
    getApprovalStatuses(request, requiresManagerApproval) {
        let managerStatus = 'PENDING';
        let hrStatus = 'PENDING';
        if (requiresManagerApproval) {
            if (request.status === 'PENDING') {
                managerStatus = 'PENDING';
                hrStatus = 'PENDING';
            }
            else if (['MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED'].includes(request.status)) {
                managerStatus = 'APPROVED';
                hrStatus = ['HR_APPROVED', 'APPROVED'].includes(request.status) ? 'APPROVED' : 'PENDING';
            }
            else if (request.status === 'REJECTED') {
                if (request.managerApprovedAt) {
                    managerStatus = 'APPROVED';
                    hrStatus = 'REJECTED';
                }
                else {
                    managerStatus = 'REJECTED';
                    hrStatus = 'PENDING';
                }
            }
        }
        else {
            if (['PENDING'].includes(request.status)) {
                hrStatus = 'PENDING';
            }
            else if (['APPROVED', 'HR_APPROVED'].includes(request.status)) {
                hrStatus = 'APPROVED';
            }
            else if (request.status === 'REJECTED') {
                hrStatus = 'REJECTED';
            }
        }
        return { managerStatus, hrStatus };
    }
};
exports.LeaveRequestService = LeaveRequestService;
exports.LeaveRequestService = LeaveRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leave_request_repository_1.LeaveRequestRepository,
        leave_balance_repository_1.LeaveBalanceRepository,
        leave_email_service_1.LeaveEmailService,
        prisma_service_1.PrismaService])
], LeaveRequestService);
//# sourceMappingURL=leave-request.service.js.map