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
exports.LeaveBalanceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let LeaveBalanceRepository = class LeaveBalanceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.leaveBalance.create({ data });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.leaveBalance.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                employee: {
                    select: { id: true, firstName: true, lastName: true, department: true, position: true }
                },
                leavePeriod: {
                    select: { id: true, name: true }
                },
                leaveTypeConfig: {
                    select: { id: true, name: true, type: true }
                }
            },
        });
    }
    async findByEmployee(employeeId, leavePeriodId) {
        return this.prisma.leaveBalance.findMany({
            where: {
                employeeId,
                ...(leavePeriodId && { leavePeriodId })
            },
            include: {
                leaveTypeConfig: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        maxConsecutiveDays: true,
                        advanceNoticeDays: true,
                        isCarryForward: true,
                        maxCarryForward: true
                    }
                },
                leavePeriod: {
                    select: { id: true, name: true, isActive: true }
                }
            },
        });
    }
    async findByEmployeeAndType(employeeId, leaveTypeConfigId) {
        return this.prisma.leaveBalance.findUnique({
            where: {
                employeeId_leavePeriodId_leaveTypeConfigId: {
                    employeeId,
                    leavePeriodId: 0,
                    leaveTypeConfigId
                }
            },
            include: {
                leaveTypeConfig: true,
                leavePeriod: true
            }
        });
    }
    async findSpecific(employeeId, leavePeriodId, leaveTypeConfigId) {
        return this.prisma.leaveBalance.findUnique({
            where: {
                employeeId_leavePeriodId_leaveTypeConfigId: {
                    employeeId,
                    leavePeriodId,
                    leaveTypeConfigId
                }
            },
            include: {
                leaveTypeConfig: true,
                leavePeriod: true
            }
        });
    }
    async update(id, data) {
        return this.prisma.leaveBalance.update({
            where: { id },
            data,
        });
    }
    async updateSpecific(employeeId, leavePeriodId, leaveTypeConfigId, data) {
        return this.prisma.leaveBalance.update({
            where: {
                employeeId_leavePeriodId_leaveTypeConfigId: {
                    employeeId,
                    leavePeriodId,
                    leaveTypeConfigId
                }
            },
            data,
        });
    }
    async createOrUpdate(employeeId, leavePeriodId, leaveTypeConfigId, data) {
        return this.prisma.leaveBalance.upsert({
            where: {
                employeeId_leavePeriodId_leaveTypeConfigId: {
                    employeeId,
                    leavePeriodId,
                    leaveTypeConfigId
                }
            },
            update: data,
            create: {
                employeeId,
                leavePeriodId,
                leaveTypeConfigId,
                ...data
            },
        });
    }
    async delete(id) {
        return this.prisma.leaveBalance.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.prisma.leaveBalance.count({ where });
    }
    async findActivePeriod() {
        return this.prisma.leavePeriod.findFirst({
            where: { isActive: true },
            orderBy: { startDate: 'desc' }
        });
    }
    async updateQuotas(employeeId, leavePeriodId, leaveTypeConfigId, usedDays) {
        return this.prisma.leaveBalance.update({
            where: {
                employeeId_leavePeriodId_leaveTypeConfigId: {
                    employeeId,
                    leavePeriodId,
                    leaveTypeConfigId
                }
            },
            data: {
                usedQuota: {
                    increment: usedDays
                }
            }
        });
    }
    async initializeBalance(employeeId, leaveTypeConfigId, customQuota) {
        const activePeriod = await this.findActivePeriod();
        if (!activePeriod) {
            throw new Error('No active leave period found');
        }
        const leaveTypeConfig = await this.prisma.leaveTypeConfig.findUnique({
            where: { id: leaveTypeConfigId }
        });
        if (!leaveTypeConfig) {
            throw new Error('Leave type config not found');
        }
        const quota = customQuota || leaveTypeConfig.defaultQuota || 0;
        const result = await this.createOrUpdate(employeeId, activePeriod.id, leaveTypeConfigId, {
            totalQuota: quota,
            usedQuota: 0
        });
        return this.findSpecific(employeeId, activePeriod.id, leaveTypeConfigId);
    }
};
exports.LeaveBalanceRepository = LeaveBalanceRepository;
exports.LeaveBalanceRepository = LeaveBalanceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveBalanceRepository);
//# sourceMappingURL=leave-balance.repository.js.map