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
exports.LeaveRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let LeaveRequestRepository = class LeaveRequestRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.leaveRequest.create({
            data,
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, department: true, manager: true }
                },
                leaveTypeConfig: {
                    select: { id: true, name: true, type: true }
                },
                approvals: {
                    include: {
                        approver: {
                            select: { id: true, firstName: true, lastName: true, position: true }
                        }
                    }
                }
            }
        });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.leaveRequest.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, department: true, position: true }
                },
                leaveTypeConfig: {
                    select: { id: true, name: true, type: true }
                },
                leavePeriod: {
                    select: { id: true, name: true }
                },
                approvals: {
                    include: {
                        approver: {
                            select: { id: true, firstName: true, lastName: true, position: true }
                        }
                    }
                }
            },
        });
    }
    async findById(id) {
        return this.prisma.leaveRequest.findUnique({
            where: { id },
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, department: true, manager: true }
                },
                leaveTypeConfig: true,
                leavePeriod: true,
                approvals: {
                    include: {
                        approver: {
                            select: { id: true, firstName: true, lastName: true, position: true }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
        });
    }
    async findByEmployee(employeeId, params) {
        const { skip, take, status } = params || {};
        return this.prisma.leaveRequest.findMany({
            skip,
            take,
            where: {
                employeeId,
                ...(status && { status: status })
            },
            include: {
                leaveTypeConfig: {
                    select: { id: true, name: true, type: true }
                },
                leavePeriod: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async findPendingForApprover(approverId) {
        return this.prisma.leaveRequest.findMany({
            where: {
                OR: [
                    {
                        status: 'PENDING',
                        employee: {
                            managerId: approverId
                        }
                    },
                    {
                        approvals: {
                            some: {
                                approverId,
                                status: 'PENDING'
                            }
                        }
                    }
                ]
            },
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, department: true, position: true }
                },
                leaveTypeConfig: {
                    select: { id: true, name: true, type: true }
                },
                leavePeriod: {
                    select: { id: true, name: true }
                },
                approvals: {
                    include: {
                        approver: {
                            select: { id: true, firstName: true, lastName: true, position: true }
                        }
                    }
                }
            },
            orderBy: { submittedAt: 'asc' },
        });
    }
    async findConflicting(employeeId, startDate, endDate, excludeId) {
        return this.prisma.leaveRequest.findMany({
            where: {
                employeeId,
                status: {
                    in: ['PENDING', 'MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED']
                },
                OR: [
                    {
                        startDate: {
                            lte: endDate
                        },
                        endDate: {
                            gte: startDate
                        }
                    }
                ],
                ...(excludeId && { id: { not: excludeId } })
            },
        });
    }
    async update(id, data) {
        return this.prisma.leaveRequest.update({
            where: { id },
            data,
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, department: true }
                },
                leaveTypeConfig: {
                    select: { id: true, name: true, type: true }
                }
            }
        });
    }
    async delete(id) {
        return this.prisma.leaveRequest.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.prisma.leaveRequest.count({ where });
    }
    async approveRequest(id, approverId, comments, level) {
        return this.prisma.$transaction(async (tx) => {
            const updateData = {
                status: level === 'HR' ? 'APPROVED' : (level === 'MANAGER' ? 'MANAGER_APPROVED' : 'APPROVED'),
                ...(level === 'MANAGER' && {
                    managerComments: comments,
                    managerApprovedAt: new Date()
                }),
                ...(level === 'HR' && {
                    hrComments: comments,
                    hrApprovedAt: new Date(),
                    finalizedAt: new Date()
                })
            };
            const updatedRequest = await tx.leaveRequest.update({
                where: { id },
                data: updateData
            });
            await tx.leaveApproval.create({
                data: {
                    leaveRequestId: id,
                    approverId,
                    approverType: level || 'MANAGER',
                    status: 'APPROVED',
                    comments,
                    approvedAt: new Date()
                }
            });
            return updatedRequest;
        });
    }
    async rejectRequest(id, approverId, rejectionReason, comments) {
        return this.prisma.$transaction(async (tx) => {
            const updatedRequest = await tx.leaveRequest.update({
                where: { id },
                data: {
                    status: 'REJECTED',
                    rejectionReason,
                    managerComments: comments,
                    managerApprovedAt: new Date(),
                    finalizedAt: new Date()
                }
            });
            await tx.leaveApproval.create({
                data: {
                    leaveRequestId: id,
                    approverId,
                    approverType: 'MANAGER',
                    status: 'REJECTED',
                    comments: rejectionReason,
                    approvedAt: new Date()
                }
            });
            return updatedRequest;
        });
    }
};
exports.LeaveRequestRepository = LeaveRequestRepository;
exports.LeaveRequestRepository = LeaveRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveRequestRepository);
//# sourceMappingURL=leave-request.repository.js.map