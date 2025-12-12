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
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const payroll_repository_1 = require("../repositories/payroll.repository");
const salary_service_1 = require("../../salary/services/salary.service");
const overtime_request_service_1 = require("../../overtime/services/overtime-request.service");
const settings_service_1 = require("../../settings/services/settings.service");
const attendance_service_1 = require("../../attendance/services/attendance.service");
const payroll_response_dto_1 = require("../dto/payroll-response.dto");
const class_transformer_1 = require("class-transformer");
let PayrollService = class PayrollService {
    payrollRepository;
    salaryService;
    overtimeRequestService;
    settingsService;
    attendanceService;
    constructor(payrollRepository, salaryService, overtimeRequestService, settingsService, attendanceService) {
        this.payrollRepository = payrollRepository;
        this.salaryService = salaryService;
        this.overtimeRequestService = overtimeRequestService;
        this.settingsService = settingsService;
        this.attendanceService = attendanceService;
    }
    async createPayroll(createPayrollDto, userId) {
        const { employeeId, periodStart, periodEnd, deductions = '0', bonuses = '0', overtimeRequestIds = [], } = createPayrollDto;
        const existingPayroll = await this.payrollRepository.findByEmployeeAndPeriod(employeeId, new Date(periodStart), new Date(periodEnd));
        if (existingPayroll) {
            throw new common_1.BadRequestException('Payroll already exists for this employee in the overlapping period');
        }
        const currentSalary = await this.salaryService.getCurrentSalary(parseInt(employeeId));
        if (!currentSalary) {
            throw new common_1.BadRequestException('No salary record found for this employee');
        }
        const regularHours = await this.calculateRegularHours(employeeId, new Date(periodStart), new Date(periodEnd));
        const overtimeCalculation = await this.calculateOvertimePay(employeeId, new Date(periodStart), new Date(periodEnd), overtimeRequestIds);
        const baseSalaryDecimal = new client_1.Prisma.Decimal(currentSalary.baseSalary);
        const overtimePayDecimal = new client_1.Prisma.Decimal(overtimeCalculation.totalPay);
        const deductionsDecimal = new client_1.Prisma.Decimal(deductions);
        const bonusesDecimal = new client_1.Prisma.Decimal(bonuses);
        const grossSalary = baseSalaryDecimal
            .plus(overtimePayDecimal)
            .plus(bonusesDecimal);
        const netSalary = grossSalary.minus(deductionsDecimal);
        const payrollData = {
            employeeId: BigInt(employeeId),
            periodStart: new Date(periodStart),
            periodEnd: new Date(periodEnd),
            baseSalary: baseSalaryDecimal,
            overtimePay: overtimePayDecimal,
            deductions: deductionsDecimal,
            bonuses: bonusesDecimal,
            grossSalary,
            netSalary,
            overtimeHours: new client_1.Prisma.Decimal(overtimeCalculation.totalHours),
            regularHours: new client_1.Prisma.Decimal(regularHours),
            employee: {
                connect: { id: BigInt(employeeId) },
            },
        };
        const payroll = await this.payrollRepository.create(payrollData);
        return this.transformPayrollToDto(payroll);
    }
    async findAll(query) {
        const result = await this.payrollRepository.findMany(query);
        return {
            ...result,
            data: result.data.map(payroll => this.transformPayrollToDto(payroll)),
        };
    }
    async findById(id) {
        const payroll = await this.payrollRepository.findById(id);
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        return this.transformPayrollToDto(payroll);
    }
    async processPayrolls(processPayrollDto, userId) {
        const { payrollIds } = processPayrollDto;
        const failed = [];
        let processed = 0;
        for (const payrollId of payrollIds) {
            try {
                const payroll = await this.payrollRepository.findById(payrollId);
                if (!payroll) {
                    failed.push(`Payroll ${payrollId}: Not found`);
                    continue;
                }
                if (payroll.processedAt) {
                    failed.push(`Payroll ${payrollId}: Already processed`);
                    continue;
                }
                await this.payrollRepository.update(payrollId, {
                    processedAt: new Date(),
                });
                processed++;
            }
            catch (error) {
                failed.push(`Payroll ${payrollId}: ${error.message}`);
            }
        }
        return { processed, failed };
    }
    async markAsPaid(id, userId) {
        const payroll = await this.payrollRepository.findById(id);
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        if (payroll.isPaid) {
            throw new common_1.BadRequestException('Payroll is already marked as paid');
        }
        if (!payroll.processedAt) {
            throw new common_1.BadRequestException('Payroll must be processed before marking as paid');
        }
        const updatedPayroll = await this.payrollRepository.update(id, {
            isPaid: true,
            updatedAt: new Date(),
        });
        return this.transformPayrollToDto(updatedPayroll);
    }
    async deletePayroll(id) {
        const payroll = await this.payrollRepository.findById(id);
        if (!payroll) {
            throw new common_1.NotFoundException('Payroll not found');
        }
        if (payroll.isPaid) {
            throw new common_1.BadRequestException('Cannot delete a paid payroll');
        }
        await this.payrollRepository.delete(id);
    }
    async getPayrollSummary(employeeId) {
        return this.payrollRepository.getPayrollSummary(employeeId);
    }
    async calculateRegularHours(employeeId, periodStart, periodEnd) {
        try {
            return 168;
        }
        catch (error) {
            console.error('Failed to calculate regular hours:', error);
            return 0;
        }
    }
    async calculateOvertimePay(employeeId, periodStart, periodEnd, overtimeRequestIds = []) {
        return {
            totalHours: 0,
            totalPay: '0',
        };
    }
    isHoliday(date) {
        const holidays = [
            '2024-01-01',
            '2024-12-25',
        ];
        const dateStr = date.toISOString().split('T')[0];
        return holidays.includes(dateStr);
    }
    transformPayrollToDto(payroll) {
        const dto = (0, class_transformer_1.plainToInstance)(payroll_response_dto_1.PayrollDto, {
            ...payroll,
            id: payroll.id.toString(),
            employeeId: payroll.employeeId.toString(),
            baseSalary: payroll.baseSalary.toString(),
            overtimePay: payroll.overtimePay.toString(),
            deductions: payroll.deductions.toString(),
            bonuses: payroll.bonuses.toString(),
            grossSalary: payroll.grossSalary.toString(),
            netSalary: payroll.netSalary.toString(),
            overtimeHours: payroll.overtimeHours.toString(),
            regularHours: payroll.regularHours.toString(),
            processedBy: payroll.processedBy?.toString(),
            employee: payroll.employee ? {
                id: payroll.employee.id.toString(),
                firstName: payroll.employee.firstName,
                lastName: payroll.employee.lastName,
                position: payroll.employee.position,
                department: payroll.employee.department,
            } : undefined,
            processor: payroll.processor ? {
                id: payroll.processor.id.toString(),
                email: payroll.processor.email,
            } : undefined,
        });
        return dto;
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payroll_repository_1.PayrollRepository,
        salary_service_1.SalaryService,
        overtime_request_service_1.OvertimeRequestService,
        settings_service_1.SettingsService,
        attendance_service_1.AttendanceService])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map