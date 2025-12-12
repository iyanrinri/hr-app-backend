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
exports.OvertimeRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let OvertimeRequestRepository = class OvertimeRequestRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.overtimeRequest.create({ data });
    }
    async findAll(params) {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.overtimeRequest.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }
    async findUnique(where, include) {
        return this.prisma.overtimeRequest.findUnique({
            where,
            include,
        });
    }
    async findByEmployee(employeeId, params) {
        const { skip = 0, take = 20, status, startDate, endDate } = params || {};
        const where = {
            employeeId,
        };
        if (status) {
            where.status = status;
        }
        if (startDate && endDate) {
            where.date = {
                gte: startDate,
                lte: endDate
            };
        }
        return this.prisma.overtimeRequest.findMany({
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
        });
    }
    async findPendingRequests(params) {
        const { skip = 0, take = 20, managerId } = params || {};
        const where = {
            status: {
                in: ['PENDING', 'MANAGER_APPROVED']
            }
        };
        if (managerId) {
            where.employee = {
                managerId
            };
        }
        return this.prisma.overtimeRequest.findMany({
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
            },
            orderBy: { submittedAt: 'asc' }
        });
    }
    async findByDateRange(startDate, endDate, employeeId) {
        const where = {
            date: {
                gte: startDate,
                lte: endDate
            }
        };
        if (employeeId) {
            where.employeeId = employeeId;
        }
        return this.prisma.overtimeRequest.findMany({
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
                }
            },
            orderBy: { date: 'desc' }
        });
    }
    async checkExistingRequest(employeeId, date) {
        return this.prisma.overtimeRequest.findFirst({
            where: {
                employeeId,
                date,
                status: {
                    notIn: ['REJECTED', 'CANCELLED']
                }
            }
        });
    }
    async findAttendanceByDate(employeeId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        return this.prisma.attendance.findFirst({
            where: {
                employeeId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            select: {
                id: true
            }
        });
    }
    async update(where, data) {
        return this.prisma.overtimeRequest.update({
            where,
            data,
        });
    }
    async delete(where) {
        return this.prisma.overtimeRequest.delete({ where });
    }
    async count(where) {
        return this.prisma.overtimeRequest.count({ where });
    }
    async getTotalOvertimeMinutes(employeeId, startDate, endDate, status) {
        const where = {
            employeeId,
            date: {
                gte: startDate,
                lte: endDate
            }
        };
        if (status) {
            where.status = status;
        }
        const result = await this.prisma.overtimeRequest.aggregate({
            where,
            _sum: {
                totalMinutes: true
            }
        });
        return result._sum.totalMinutes || 0;
    }
    async getEmployeeIdByUserId(userId) {
        const employee = await this.prisma.employee.findFirst({
            where: { userId },
            select: { id: true }
        });
        return employee?.id || null;
    }
};
exports.OvertimeRequestRepository = OvertimeRequestRepository;
exports.OvertimeRequestRepository = OvertimeRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OvertimeRequestRepository);
//# sourceMappingURL=overtime-request.repository.js.map