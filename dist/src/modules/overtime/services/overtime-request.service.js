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
exports.OvertimeRequestService = void 0;
const common_1 = require("@nestjs/common");
const overtime_request_repository_1 = require("../repositories/overtime-request.repository");
const overtime_approval_repository_1 = require("../repositories/overtime-approval.repository");
const update_overtime_request_dto_1 = require("../dto/update-overtime-request.dto");
const client_1 = require("@prisma/client");
let OvertimeRequestService = class OvertimeRequestService {
    overtimeRequestRepository;
    overtimeApprovalRepository;
    constructor(overtimeRequestRepository, overtimeApprovalRepository) {
        this.overtimeRequestRepository = overtimeRequestRepository;
        this.overtimeApprovalRepository = overtimeApprovalRepository;
    }
    transformOvertimeResponse(overtime) {
        return {
            ...overtime,
            id: overtime.id.toString(),
            employeeId: overtime.employeeId.toString(),
            attendanceId: overtime.attendanceId?.toString(),
            overtimeRate: overtime.overtimeRate?.toString(),
            calculatedAmount: overtime.calculatedAmount?.toString(),
            date: overtime.date instanceof Date ? overtime.date.toISOString() : overtime.date,
            startTime: overtime.startTime instanceof Date ? overtime.startTime.toISOString() : overtime.startTime,
            endTime: overtime.endTime instanceof Date ? overtime.endTime.toISOString() : overtime.endTime,
            submittedAt: overtime.submittedAt instanceof Date ? overtime.submittedAt.toISOString() : overtime.submittedAt,
            managerApprovedAt: overtime.managerApprovedAt instanceof Date ? overtime.managerApprovedAt.toISOString() : overtime.managerApprovedAt,
            hrApprovedAt: overtime.hrApprovedAt instanceof Date ? overtime.hrApprovedAt.toISOString() : overtime.hrApprovedAt,
            finalizedAt: overtime.finalizedAt instanceof Date ? overtime.finalizedAt.toISOString() : overtime.finalizedAt,
            createdAt: overtime.createdAt instanceof Date ? overtime.createdAt.toISOString() : overtime.createdAt,
            updatedAt: overtime.updatedAt instanceof Date ? overtime.updatedAt.toISOString() : overtime.updatedAt,
            employee: overtime.employee ? {
                id: overtime.employee.id.toString(),
                firstName: overtime.employee.firstName,
                lastName: overtime.employee.lastName,
                position: overtime.employee.position,
                department: overtime.employee.department,
            } : undefined,
            attendance: overtime.attendance ? {
                id: overtime.attendance.id.toString(),
                date: overtime.attendance.date instanceof Date ? overtime.attendance.date.toISOString() : overtime.attendance.date,
                checkIn: overtime.attendance.checkIn instanceof Date ? overtime.attendance.checkIn.toISOString() : overtime.attendance.checkIn,
                checkOut: overtime.attendance.checkOut instanceof Date ? overtime.attendance.checkOut.toISOString() : overtime.attendance.checkOut,
                workDuration: overtime.attendance.workDuration,
            } : undefined,
            approvals: overtime.approvals?.map((approval) => ({
                id: approval.id.toString(),
                overtimeRequestId: approval.overtimeRequestId.toString(),
                approverId: approval.approverId.toString(),
                approverType: approval.approverType,
                status: approval.status,
                comments: approval.comments,
                approvedAt: approval.approvedAt instanceof Date ? approval.approvedAt.toISOString() : approval.approvedAt,
                createdAt: approval.createdAt instanceof Date ? approval.createdAt.toISOString() : approval.createdAt,
                updatedAt: approval.updatedAt instanceof Date ? approval.updatedAt.toISOString() : approval.updatedAt,
                approver: approval.approver ? {
                    id: approval.approver.id.toString(),
                    firstName: approval.approver.firstName,
                    lastName: approval.approver.lastName,
                    position: approval.approver.position,
                    department: approval.approver.department,
                } : undefined,
            })),
        };
    }
    calculateOvertimeMinutes(startTime, endTime) {
        const diffMs = endTime.getTime() - startTime.getTime();
        return Math.round(diffMs / (1000 * 60));
    }
    async create(createOvertimeRequestDto) {
        const { employeeId, date, startTime, endTime, reason } = createOvertimeRequestDto;
        const startDateTime = new Date(startTime);
        const endDateTime = new Date(endTime);
        if (endDateTime <= startDateTime) {
            throw new common_1.BadRequestException('End time must be after start time');
        }
        const existingRequest = await this.overtimeRequestRepository.checkExistingRequest(BigInt(employeeId), new Date(date));
        if (existingRequest) {
            throw new common_1.BadRequestException(`An overtime request for ${date} already exists with status: ${existingRequest.status}`);
        }
        const attendance = await this.overtimeRequestRepository.findAttendanceByDate(BigInt(employeeId), new Date(date));
        const totalMinutes = this.calculateOvertimeMinutes(startDateTime, endDateTime);
        const overtimeRequest = await this.overtimeRequestRepository.create({
            employee: {
                connect: { id: BigInt(employeeId) }
            },
            attendance: attendance ? {
                connect: { id: attendance.id }
            } : undefined,
            date: new Date(date),
            startTime: startDateTime,
            endTime: endDateTime,
            totalMinutes,
            reason,
            status: update_overtime_request_dto_1.OvertimeStatus.PENDING,
        });
        await this.createApprovalWorkflow(overtimeRequest.id, BigInt(employeeId));
        const createdRequest = await this.overtimeRequestRepository.findUnique({ id: overtimeRequest.id }, {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true,
                    managerId: true
                }
            },
            attendance: {
                select: {
                    id: true,
                    date: true,
                    checkIn: true,
                    checkOut: true,
                    workDuration: true
                }
            },
            approvals: {
                include: {
                    approver: {
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
        });
        return this.transformOvertimeResponse(createdRequest);
    }
    async createApprovalWorkflow(overtimeRequestId, employeeId) {
        console.log(`Creating approval workflow for overtime request ${overtimeRequestId}`);
    }
    async findAll(params = {}) {
        const { skip = 0, take = 10, employeeId, status, startDate, endDate, userRole, userId } = params;
        let where = {};
        if (userRole === client_1.Role.EMPLOYEE && userId) {
            where.employeeId = BigInt(userId);
        }
        else if (employeeId) {
            where.employeeId = BigInt(employeeId);
        }
        if (status) {
            where.status = status;
        }
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        const [requests, total] = await Promise.all([
            this.overtimeRequestRepository.findAll({
                skip,
                take,
                where,
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            position: true,
                            department: true
                        }
                    },
                    attendance: {
                        select: {
                            id: true,
                            date: true,
                            checkIn: true,
                            checkOut: true,
                            workDuration: true
                        }
                    },
                    approvals: {
                        include: {
                            approver: {
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
                orderBy: { submittedAt: 'desc' }
            }),
            this.overtimeRequestRepository.count(where)
        ]);
        return {
            requests: requests.map(request => this.transformOvertimeResponse(request)),
            total,
            skip,
            take
        };
    }
    async findOne(id) {
        const overtimeRequest = await this.overtimeRequestRepository.findUnique({ id: BigInt(id) }, {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            },
            attendance: {
                select: {
                    id: true,
                    date: true,
                    checkIn: true,
                    checkOut: true,
                    workDuration: true
                }
            },
            approvals: {
                include: {
                    approver: {
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
        });
        if (!overtimeRequest) {
            throw new common_1.NotFoundException(`Overtime request with ID ${id} not found`);
        }
        return this.transformOvertimeResponse(overtimeRequest);
    }
    async update(id, updateOvertimeRequestDto) {
        const existingRequest = await this.overtimeRequestRepository.findUnique({ id: BigInt(id) });
        if (!existingRequest) {
            throw new common_1.NotFoundException(`Overtime request with ID ${id} not found`);
        }
        if (existingRequest.status !== update_overtime_request_dto_1.OvertimeStatus.PENDING) {
            throw new common_1.BadRequestException('Can only update pending overtime requests');
        }
        const updateData = { ...updateOvertimeRequestDto };
        if (updateData.status && ['APPROVED', 'REJECTED', 'CANCELLED'].includes(updateData.status)) {
            updateData.finalizedAt = new Date();
        }
        const updatedRequest = await this.overtimeRequestRepository.update({ id: BigInt(id) }, updateData);
        const result = await this.overtimeRequestRepository.findUnique({ id: BigInt(id) }, {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            },
            attendance: {
                select: {
                    id: true,
                    date: true,
                    checkIn: true,
                    checkOut: true,
                    workDuration: true
                }
            },
            approvals: {
                include: {
                    approver: {
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
        });
        return this.transformOvertimeResponse(result);
    }
    async remove(id) {
        const overtimeRequest = await this.overtimeRequestRepository.findUnique({ id: BigInt(id) });
        if (!overtimeRequest) {
            throw new common_1.NotFoundException(`Overtime request with ID ${id} not found`);
        }
        if (overtimeRequest.status !== update_overtime_request_dto_1.OvertimeStatus.PENDING) {
            throw new common_1.BadRequestException('Can only delete pending overtime requests');
        }
        await this.overtimeRequestRepository.delete({ id: BigInt(id) });
    }
    async getEmployeeOvertimeHistory(employeeId, params) {
        const { skip, take, status, startDate, endDate } = params || {};
        const requests = await this.overtimeRequestRepository.findByEmployee(BigInt(employeeId), {
            skip,
            take,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined
        });
        return requests.map(request => this.transformOvertimeResponse(request));
    }
    async getPendingRequests(managerId, params) {
        const { skip, take } = params || {};
        const requests = await this.overtimeRequestRepository.findPendingRequests({
            skip,
            take,
            managerId: managerId ? BigInt(managerId) : undefined
        });
        return requests.map(request => this.transformOvertimeResponse(request));
    }
    async getTotalOvertimeHours(employeeId, startDate, endDate, status) {
        const totalMinutes = await this.overtimeRequestRepository.getTotalOvertimeMinutes(BigInt(employeeId), new Date(startDate), new Date(endDate), status);
        return {
            totalMinutes,
            totalHours: Math.round((totalMinutes / 60) * 100) / 100
        };
    }
    async getEmployeeIdByUserId(userId) {
        return this.overtimeRequestRepository.getEmployeeIdByUserId(BigInt(userId));
    }
};
exports.OvertimeRequestService = OvertimeRequestService;
exports.OvertimeRequestService = OvertimeRequestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [overtime_request_repository_1.OvertimeRequestRepository,
        overtime_approval_repository_1.OvertimeApprovalRepository])
], OvertimeRequestService);
//# sourceMappingURL=overtime-request.service.js.map