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
exports.OvertimeApprovalRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let OvertimeApprovalRepository = class OvertimeApprovalRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.overtimeApproval.create({ data });
    }
    async findAll(params) {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.overtimeApproval.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }
    async findUnique(where, include) {
        return this.prisma.overtimeApproval.findUnique({
            where,
            include,
        });
    }
    async findByRequest(overtimeRequestId) {
        return this.prisma.overtimeApproval.findMany({
            where: { overtimeRequestId },
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
                    select: {
                        id: true,
                        employeeId: true,
                        date: true,
                        reason: true,
                        status: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    }
    async findByApprover(approverId, params) {
        const { skip = 0, take = 20, status, approverType } = params || {};
        const where = {
            approverId,
        };
        if (status) {
            where.status = status;
        }
        if (approverType) {
            where.approverType = approverType;
        }
        return this.prisma.overtimeApproval.findMany({
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
        });
    }
    async findPendingApprovals(approverId, approverType) {
        const where = {
            status: 'PENDING'
        };
        if (approverId) {
            where.approverId = approverId;
        }
        if (approverType) {
            where.approverType = approverType;
        }
        return this.prisma.overtimeApproval.findMany({
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
                        },
                        attendance: {
                            select: {
                                id: true,
                                date: true,
                                checkIn: true,
                                checkOut: true,
                                workDuration: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
    }
    async findExisting(overtimeRequestId, approverId, approverType) {
        return this.prisma.overtimeApproval.findUnique({
            where: {
                overtimeRequestId_approverId_approverType: {
                    overtimeRequestId,
                    approverId,
                    approverType
                }
            }
        });
    }
    async update(where, data) {
        return this.prisma.overtimeApproval.update({
            where,
            data,
        });
    }
    async delete(where) {
        return this.prisma.overtimeApproval.delete({ where });
    }
    async count(where) {
        return this.prisma.overtimeApproval.count({ where });
    }
    async getApprovalStats(approverId, startDate, endDate) {
        const where = {};
        if (approverId) {
            where.approverId = approverId;
        }
        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }
        const stats = await this.prisma.overtimeApproval.groupBy({
            by: ['status'],
            where,
            _count: {
                status: true
            }
        });
        return stats.reduce((acc, curr) => {
            acc[curr.status] = curr._count.status;
            return acc;
        }, {});
    }
};
exports.OvertimeApprovalRepository = OvertimeApprovalRepository;
exports.OvertimeApprovalRepository = OvertimeApprovalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OvertimeApprovalRepository);
//# sourceMappingURL=overtime-approval.repository.js.map