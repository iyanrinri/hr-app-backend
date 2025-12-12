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
exports.PayrollRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const payroll_query_dto_1 = require("../dto/payroll-query.dto");
let PayrollRepository = class PayrollRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.payroll.create({
            data,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        department: true,
                    },
                },
                processor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findMany(query) {
        const { employeeId, department, periodStartFrom, periodStartTo, periodEndFrom, periodEndTo, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (employeeId) {
            where.employeeId = BigInt(employeeId);
        }
        if (department) {
            where.employee = {
                department: {
                    contains: department,
                    mode: 'insensitive',
                },
            };
        }
        if (periodStartFrom && periodStartTo) {
            where.periodStart = {
                gte: new Date(periodStartFrom),
                lte: new Date(periodStartTo),
            };
        }
        else if (periodStartFrom) {
            where.periodStart = {
                gte: new Date(periodStartFrom),
            };
        }
        else if (periodStartTo) {
            where.periodStart = {
                lte: new Date(periodStartTo),
            };
        }
        if (periodEndFrom && periodEndTo) {
            where.periodEnd = {
                gte: new Date(periodEndFrom),
                lte: new Date(periodEndTo),
            };
        }
        else if (periodEndFrom) {
            where.periodEnd = {
                gte: new Date(periodEndFrom),
            };
        }
        else if (periodEndTo) {
            where.periodEnd = {
                lte: new Date(periodEndTo),
            };
        }
        if (status) {
            switch (status) {
                case payroll_query_dto_1.PayrollStatus.PENDING:
                    where.processedAt = null;
                    where.isPaid = false;
                    break;
                case payroll_query_dto_1.PayrollStatus.PROCESSED:
                    where.processedAt = { not: null };
                    where.isPaid = false;
                    break;
                case payroll_query_dto_1.PayrollStatus.PAID:
                    where.isPaid = true;
                    break;
            }
        }
        const orderBy = {};
        if (sortBy === 'employee') {
            orderBy.employee = { firstName: sortOrder };
        }
        else {
            orderBy[sortBy] = sortOrder;
        }
        const [payrolls, total] = await Promise.all([
            this.prisma.payroll.findMany({
                where,
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            position: true,
                            department: true,
                        },
                    },
                    processor: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.payroll.count({ where }),
        ]);
        return {
            data: payrolls,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        return this.prisma.payroll.findUnique({
            where: { id: BigInt(id) },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        department: true,
                    },
                },
                processor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findByEmployeeAndPeriod(employeeId, periodStart, periodEnd) {
        return this.prisma.payroll.findFirst({
            where: {
                employeeId: BigInt(employeeId),
                OR: [
                    {
                        AND: [
                            { periodStart: { lte: periodStart } },
                            { periodEnd: { gte: periodStart } },
                        ],
                    },
                    {
                        AND: [
                            { periodStart: { lte: periodEnd } },
                            { periodEnd: { gte: periodEnd } },
                        ],
                    },
                    {
                        AND: [
                            { periodStart: { gte: periodStart } },
                            { periodEnd: { lte: periodEnd } },
                        ],
                    },
                ],
            },
        });
    }
    async update(id, data) {
        return this.prisma.payroll.update({
            where: { id: BigInt(id) },
            data,
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        position: true,
                        department: true,
                    },
                },
                processor: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }
    async updateMany(ids, data) {
        return this.prisma.payroll.updateMany({
            where: {
                id: {
                    in: ids.map(id => BigInt(id)),
                },
            },
            data,
        });
    }
    async delete(id) {
        return this.prisma.payroll.delete({
            where: { id: BigInt(id) },
        });
    }
    async getPayrollSummary(employeeId) {
        const where = {};
        if (employeeId) {
            where.employeeId = BigInt(employeeId);
        }
        const result = await this.prisma.payroll.aggregate({
            where,
            _sum: {
                baseSalary: true,
                overtimePay: true,
                deductions: true,
                bonuses: true,
                grossSalary: true,
                netSalary: true,
                overtimeHours: true,
                regularHours: true,
            },
            _count: {
                id: true,
            },
        });
        return {
            totalPayrolls: result._count.id,
            totalBaseSalary: result._sum.baseSalary?.toString() || '0',
            totalOvertimePay: result._sum.overtimePay?.toString() || '0',
            totalDeductions: result._sum.deductions?.toString() || '0',
            totalBonuses: result._sum.bonuses?.toString() || '0',
            totalGrossSalary: result._sum.grossSalary?.toString() || '0',
            totalNetSalary: result._sum.netSalary?.toString() || '0',
            totalOvertimeHours: result._sum.overtimeHours?.toString() || '0',
            totalRegularHours: result._sum.regularHours?.toString() || '0',
        };
    }
};
exports.PayrollRepository = PayrollRepository;
exports.PayrollRepository = PayrollRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayrollRepository);
//# sourceMappingURL=payroll.repository.js.map