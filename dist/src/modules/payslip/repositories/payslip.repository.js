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
exports.PayslipRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let PayslipRepository = class PayslipRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.payslip.create({
            data,
            include: {
                deductions: true,
                payroll: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                position: true,
                                department: true,
                                employeeNumber: true,
                            },
                        },
                    },
                },
                generator: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        return this.prisma.payslip.findUnique({
            where: { id },
            include: {
                deductions: true,
                payroll: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                position: true,
                                department: true,
                                employeeNumber: true,
                                maritalStatus: true,
                            },
                        },
                    },
                },
                generator: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    }
    async findByPayrollId(payrollId) {
        return this.prisma.payslip.findUnique({
            where: { payrollId },
            include: {
                deductions: true,
                payroll: {
                    include: {
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                position: true,
                                department: true,
                                employeeNumber: true,
                                maritalStatus: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async findByEmployeeId(employeeId, limit = 10) {
        return this.prisma.payslip.findMany({
            where: {
                payroll: {
                    employeeId,
                },
            },
            include: {
                deductions: true,
                payroll: {
                    select: {
                        periodStart: true,
                        periodEnd: true,
                        baseSalary: true,
                        overtimePay: true,
                        bonuses: true,
                    },
                },
            },
            orderBy: {
                generatedAt: 'desc',
            },
            take: limit,
        });
    }
    async createDeduction(data) {
        return this.prisma.payrollDeduction.create({
            data,
        });
    }
    async createManyDeductions(data) {
        return this.prisma.payrollDeduction.createMany({
            data,
        });
    }
    async delete(id) {
        return this.prisma.payslip.delete({
            where: { id },
        });
    }
    async updatePdfUrl(id, pdfUrl) {
        return this.prisma.payslip.update({
            where: { id },
            data: { pdfUrl },
        });
    }
};
exports.PayslipRepository = PayslipRepository;
exports.PayslipRepository = PayslipRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PayslipRepository);
//# sourceMappingURL=payslip.repository.js.map