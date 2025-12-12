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
exports.OvertimeApprovalService = void 0;
const common_1 = require("@nestjs/common");
const overtime_approval_repository_1 = require("../repositories/overtime-approval.repository");
const overtime_request_repository_1 = require("../repositories/overtime-request.repository");
const overtime_approval_dto_1 = require("../dto/overtime-approval.dto");
const update_overtime_request_dto_1 = require("../dto/update-overtime-request.dto");
let OvertimeApprovalService = class OvertimeApprovalService {
    overtimeApprovalRepository;
    overtimeRequestRepository;
    constructor(overtimeApprovalRepository, overtimeRequestRepository) {
        this.overtimeApprovalRepository = overtimeApprovalRepository;
        this.overtimeRequestRepository = overtimeRequestRepository;
    }
    transformApprovalResponse(approval) {
        return {
            ...approval,
            id: approval.id.toString(),
            overtimeRequestId: approval.overtimeRequestId.toString(),
            approverId: approval.approverId.toString(),
            approver: approval.approver ? {
                id: approval.approver.id.toString(),
                firstName: approval.approver.firstName,
                lastName: approval.approver.lastName,
                position: approval.approver.position,
                department: approval.approver.department,
            } : undefined,
        };
    }
    async create(createOvertimeApprovalDto) {
        const { overtimeRequestId, approverId, approverType, status, comments } = createOvertimeApprovalDto;
        const overtimeRequest = await this.overtimeRequestRepository.findUnique({
            id: BigInt(overtimeRequestId)
        });
        if (!overtimeRequest) {
            throw new common_1.NotFoundException(`Overtime request with ID ${overtimeRequestId} not found`);
        }
        const existingApproval = await this.overtimeApprovalRepository.findExisting(BigInt(overtimeRequestId), BigInt(approverId), approverType);
        if (existingApproval) {
            throw new common_1.BadRequestException(`Approval already exists for this overtime request by this approver`);
        }
        const approvalData = {
            overtimeRequestId: BigInt(overtimeRequestId),
            approverId: BigInt(approverId),
            approverType,
            status,
            comments
        };
        if (status === overtime_approval_dto_1.ApprovalStatus.APPROVED) {
            approvalData.approvedAt = new Date();
        }
        const approval = await this.overtimeApprovalRepository.create(approvalData);
        await this.updateOvertimeRequestStatus(BigInt(overtimeRequestId));
        const createdApproval = await this.overtimeApprovalRepository.findUnique({ id: approval.id }, {
            approver: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            }
        });
        return this.transformApprovalResponse(createdApproval);
    }
    async processApproval(overtimeRequestId, approverId, approverType, status, comments) {
        const existingApproval = await this.overtimeApprovalRepository.findExisting(BigInt(overtimeRequestId), BigInt(approverId), approverType);
        if (!existingApproval) {
            return this.create({
                overtimeRequestId,
                approverId,
                approverType,
                status,
                comments
            });
        }
        else {
            return this.update(Number(existingApproval.id), {
                status,
                comments
            });
        }
    }
    async updateOvertimeRequestStatus(overtimeRequestId) {
        const approvals = await this.overtimeApprovalRepository.findByRequest(overtimeRequestId);
        const managerApproval = approvals.find(a => a.approverType === overtime_approval_dto_1.ApproverType.MANAGER);
        const hrApproval = approvals.find(a => a.approverType === overtime_approval_dto_1.ApproverType.HR);
        let newStatus = update_overtime_request_dto_1.OvertimeStatus.PENDING;
        let managerApprovedAt = null;
        let hrApprovedAt = null;
        let finalizedAt = null;
        if (approvals.some(a => a.status === overtime_approval_dto_1.ApprovalStatus.REJECTED)) {
            newStatus = update_overtime_request_dto_1.OvertimeStatus.REJECTED;
            finalizedAt = new Date();
        }
        else if (managerApproval?.status === overtime_approval_dto_1.ApprovalStatus.APPROVED && hrApproval?.status === overtime_approval_dto_1.ApprovalStatus.APPROVED) {
            newStatus = update_overtime_request_dto_1.OvertimeStatus.APPROVED;
            managerApprovedAt = managerApproval.approvedAt;
            hrApprovedAt = hrApproval.approvedAt;
            finalizedAt = new Date();
        }
        else if (hrApproval?.status === overtime_approval_dto_1.ApprovalStatus.APPROVED && !managerApproval) {
            newStatus = update_overtime_request_dto_1.OvertimeStatus.APPROVED;
            hrApprovedAt = hrApproval.approvedAt;
            finalizedAt = new Date();
        }
        else if (managerApproval?.status === overtime_approval_dto_1.ApprovalStatus.APPROVED && !hrApproval) {
            newStatus = update_overtime_request_dto_1.OvertimeStatus.MANAGER_APPROVED;
            managerApprovedAt = managerApproval.approvedAt;
        }
        else if (hrApproval?.status === overtime_approval_dto_1.ApprovalStatus.APPROVED && managerApproval?.status === overtime_approval_dto_1.ApprovalStatus.PENDING) {
            newStatus = update_overtime_request_dto_1.OvertimeStatus.HR_APPROVED;
            hrApprovedAt = hrApproval.approvedAt;
        }
        await this.overtimeRequestRepository.update({ id: overtimeRequestId }, {
            status: newStatus,
            managerApprovedAt,
            hrApprovedAt,
            finalizedAt
        });
    }
    async findAll(params = {}) {
        const { skip = 0, take = 10, approverId, status, approverType } = params;
        const where = {};
        if (approverId)
            where.approverId = BigInt(approverId);
        if (status)
            where.status = status;
        if (approverType)
            where.approverType = approverType;
        const [approvals, total] = await Promise.all([
            this.overtimeApprovalRepository.findAll({
                skip,
                take,
                where,
                include: {
                    approver: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            position: true,
                            department: true
                        }
                    },
                    overtimeRequest: {
                        include: {
                            employee: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    position: true,
                                    department: true
                                }
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.overtimeApprovalRepository.count(where)
        ]);
        return {
            approvals: approvals.map(approval => this.transformApprovalResponse(approval)),
            total
        };
    }
    async findOne(id) {
        const approval = await this.overtimeApprovalRepository.findUnique({ id: BigInt(id) }, {
            approver: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            }
        });
        if (!approval) {
            throw new common_1.NotFoundException(`Overtime approval with ID ${id} not found`);
        }
        return this.transformApprovalResponse(approval);
    }
    async update(id, updateOvertimeApprovalDto) {
        const existingApproval = await this.overtimeApprovalRepository.findUnique({ id: BigInt(id) });
        if (!existingApproval) {
            throw new common_1.NotFoundException(`Overtime approval with ID ${id} not found`);
        }
        const updateData = { ...updateOvertimeApprovalDto };
        if (updateData.status === overtime_approval_dto_1.ApprovalStatus.APPROVED) {
            updateData.approvedAt = new Date();
        }
        const updatedApproval = await this.overtimeApprovalRepository.update({ id: BigInt(id) }, updateData);
        await this.updateOvertimeRequestStatus(existingApproval.overtimeRequestId);
        const result = await this.overtimeApprovalRepository.findUnique({ id: BigInt(id) }, {
            approver: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            }
        });
        return this.transformApprovalResponse(result);
    }
    async getPendingApprovals(approverId, approverType) {
        const approvals = await this.overtimeApprovalRepository.findPendingApprovals(approverId ? BigInt(approverId) : undefined, approverType);
        return approvals.map(approval => this.transformApprovalResponse(approval));
    }
    async getApprovalStats(approverId, startDate, endDate) {
        return this.overtimeApprovalRepository.getApprovalStats(approverId ? BigInt(approverId) : undefined, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
    }
    async remove(id) {
        const approval = await this.overtimeApprovalRepository.findUnique({ id: BigInt(id) });
        if (!approval) {
            throw new common_1.NotFoundException(`Overtime approval with ID ${id} not found`);
        }
        await this.overtimeApprovalRepository.delete({ id: BigInt(id) });
        await this.updateOvertimeRequestStatus(approval.overtimeRequestId);
    }
};
exports.OvertimeApprovalService = OvertimeApprovalService;
exports.OvertimeApprovalService = OvertimeApprovalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [overtime_approval_repository_1.OvertimeApprovalRepository,
        overtime_request_repository_1.OvertimeRequestRepository])
], OvertimeApprovalService);
//# sourceMappingURL=overtime-approval.service.js.map