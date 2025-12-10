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
exports.LeaveTypeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let LeaveTypeRepository = class LeaveTypeRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.leaveTypeConfig.create({ data });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.leaveTypeConfig.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                leavePeriod: {
                    select: { id: true, name: true, isActive: true }
                },
                _count: {
                    select: {
                        leaveBalances: true,
                        leaveRequests: true
                    }
                }
            },
        });
    }
    async findById(id) {
        return this.prisma.leaveTypeConfig.findUnique({
            where: { id: BigInt(id) },
            include: {
                leavePeriod: true,
                leaveBalances: {
                    include: {
                        employee: {
                            select: { id: true, firstName: true, lastName: true, department: true }
                        }
                    }
                }
            },
        });
    }
    async findByPeriod(leavePeriodId, activeOnly = false) {
        return this.prisma.leaveTypeConfig.findMany({
            where: {
                leavePeriodId,
                ...(activeOnly && { isActive: true })
            },
            include: {
                _count: {
                    select: {
                        leaveBalances: true,
                        leaveRequests: true
                    }
                }
            },
        });
    }
    async findByTypeAndPeriod(type, leavePeriodId) {
        return this.prisma.leaveTypeConfig.findFirst({
            where: {
                type: type,
                leavePeriodId,
                isActive: true
            },
        });
    }
    async update(id, data) {
        return this.prisma.leaveTypeConfig.update({
            where: { id: BigInt(id) },
            data,
        });
    }
    async delete(id) {
        return this.prisma.leaveTypeConfig.delete({
            where: { id: BigInt(id) },
        });
    }
    async isUsedInBalancesOrRequests(id) {
        const balanceCount = await this.prisma.leaveBalance.count({
            where: { leaveTypeConfigId: BigInt(id) }
        });
        const requestCount = await this.prisma.leaveRequest.count({
            where: { leaveTypeConfigId: BigInt(id) }
        });
        return balanceCount > 0 || requestCount > 0;
    }
    async count(where) {
        return this.prisma.leaveTypeConfig.count({ where });
    }
};
exports.LeaveTypeRepository = LeaveTypeRepository;
exports.LeaveTypeRepository = LeaveTypeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeaveTypeRepository);
//# sourceMappingURL=leave-type.repository.js.map