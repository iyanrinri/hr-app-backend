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
exports.PayslipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const payslip_repository_1 = require("../repositories/payslip.repository");
const tax_calculation_service_1 = require("./tax-calculation.service");
const bpjs_calculation_service_1 = require("./bpjs-calculation.service");
const client_1 = require("@prisma/client");
let PayslipService = class PayslipService {
    prisma;
    payslipRepository;
    taxService;
    bpjsService;
    constructor(prisma, payslipRepository, taxService, bpjsService) {
        this.prisma = prisma;
        this.payslipRepository = payslipRepository;
        this.taxService = taxService;
        this.bpjsService = bpjsService;
    }
    async generatePayslip(dto, generatedBy) {
        const payroll = await this.prisma.payroll.findUnique({
            where: { id: BigInt(dto.payrollId) },
            include: {
                employee: true,
            },
        });
        if (!payroll) {
            throw new common_1.NotFoundException(`Payroll with ID ${dto.payrollId} not found`);
        }
        const existingPayslip = await this.payslipRepository.findByPayrollId(payroll.id);
        if (existingPayslip) {
            throw new common_1.BadRequestException('Payslip already generated for this payroll period');
        }
        const grossSalary = Number(payroll.baseSalary);
        const overtimePay = Number(payroll.overtimePay);
        const bonuses = Number(payroll.bonuses);
        const allowances = dto.additionalAllowances || 0;
        const monthlyGross = grossSalary + overtimePay + bonuses + allowances;
        const maritalStatus = payroll.employee.maritalStatus;
        const dependents = dto.dependents || 0;
        const taxResult = await this.taxService.calculatePPh21(monthlyGross, maritalStatus, dependents);
        const jkkRisk = dto.jkkRiskCategory || 'LOW';
        const bpjsResult = await this.bpjsService.calculateBPJS(grossSalary, jkkRisk);
        const otherDeductions = dto.otherDeductions || 0;
        const totalDeductions = taxResult.monthlyTax +
            bpjsResult.bpjsKesehatanEmployee +
            bpjsResult.bpjsKetenagakerjaanEmployee +
            otherDeductions;
        const takeHomePay = monthlyGross - totalDeductions;
        const payslip = await this.payslipRepository.create({
            payroll: {
                connect: { id: payroll.id },
            },
            grossSalary: new client_1.Prisma.Decimal(grossSalary),
            overtimePay: new client_1.Prisma.Decimal(overtimePay),
            bonuses: new client_1.Prisma.Decimal(bonuses),
            allowances: new client_1.Prisma.Decimal(allowances),
            taxAmount: new client_1.Prisma.Decimal(taxResult.monthlyTax),
            bpjsKesehatanEmployee: new client_1.Prisma.Decimal(bpjsResult.bpjsKesehatanEmployee),
            bpjsKesehatanCompany: new client_1.Prisma.Decimal(bpjsResult.bpjsKesehatanCompany),
            bpjsKetenagakerjaanEmployee: new client_1.Prisma.Decimal(bpjsResult.bpjsKetenagakerjaanEmployee),
            bpjsKetenagakerjaanCompany: new client_1.Prisma.Decimal(bpjsResult.bpjsKetenagakerjaanCompany),
            otherDeductions: new client_1.Prisma.Decimal(otherDeductions),
            takeHomePay: new client_1.Prisma.Decimal(takeHomePay),
            taxCalculationDetails: {
                ...taxResult,
                dependents,
            },
            generator: {
                connect: { id: generatedBy },
            },
        });
        const deductions = [
            {
                payslipId: payslip.id,
                type: 'TAX',
                description: `PPh 21 (${taxResult.ptkpCategory})`,
                amount: new client_1.Prisma.Decimal(taxResult.monthlyTax),
            },
            {
                payslipId: payslip.id,
                type: 'BPJS_KESEHATAN',
                description: 'BPJS Kesehatan (1%)',
                amount: new client_1.Prisma.Decimal(bpjsResult.bpjsKesehatanEmployee),
            },
            {
                payslipId: payslip.id,
                type: 'BPJS_TK',
                description: `BPJS Ketenagakerjaan (JHT 2% + JP 1%)`,
                amount: new client_1.Prisma.Decimal(bpjsResult.bpjsKetenagakerjaanEmployee),
            },
        ];
        if (otherDeductions > 0) {
            deductions.push({
                payslipId: payslip.id,
                type: 'OTHER',
                description: 'Other Deductions',
                amount: new client_1.Prisma.Decimal(otherDeductions),
            });
        }
        await this.payslipRepository.createManyDeductions(deductions);
        return this.payslipRepository.findOne(payslip.id);
    }
    async getPayslipById(id) {
        const payslip = await this.payslipRepository.findOne(id);
        if (!payslip) {
            throw new common_1.NotFoundException(`Payslip with ID ${id} not found`);
        }
        return payslip;
    }
    async getPayslipByPayrollId(payrollId) {
        const payslip = await this.payslipRepository.findByPayrollId(payrollId);
        if (!payslip) {
            throw new common_1.NotFoundException(`Payslip for payroll ID ${payrollId} not found`);
        }
        return payslip;
    }
    async getEmployeePayslips(employeeId, limit = 10) {
        return this.payslipRepository.findByEmployeeId(employeeId, limit);
    }
    async deletePayslip(id) {
        const payslip = await this.payslipRepository.findOne(id);
        if (!payslip) {
            throw new common_1.NotFoundException(`Payslip with ID ${id} not found`);
        }
        return this.payslipRepository.delete(id);
    }
};
exports.PayslipService = PayslipService;
exports.PayslipService = PayslipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payslip_repository_1.PayslipRepository,
        tax_calculation_service_1.TaxCalculationService,
        bpjs_calculation_service_1.BPJSCalculationService])
], PayslipService);
//# sourceMappingURL=payslip.service.js.map