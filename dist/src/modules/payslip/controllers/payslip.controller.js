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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayslipController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payslip_service_1 = require("../services/payslip.service");
const generate_payslip_dto_1 = require("../dto/generate-payslip.dto");
const payslip_response_dto_1 = require("../dto/payslip-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const class_transformer_1 = require("class-transformer");
let PayslipController = class PayslipController {
    payslipService;
    constructor(payslipService) {
        this.payslipService = payslipService;
    }
    async generatePayslip(dto, req) {
        const payslip = await this.payslipService.generatePayslip(dto, BigInt(req.user.sub));
        return this.transformPayslip(payslip);
    }
    async getPayslipById(id) {
        const payslip = await this.payslipService.getPayslipById(BigInt(id));
        return this.transformPayslip(payslip);
    }
    async getPayslipByPayrollId(payrollId) {
        const payslip = await this.payslipService.getPayslipByPayrollId(BigInt(payrollId));
        return this.transformPayslip(payslip);
    }
    async getEmployeePayslips(employeeId) {
        const payslips = await this.payslipService.getEmployeePayslips(BigInt(employeeId));
        return payslips.map((p) => this.transformPayslip(p));
    }
    async getMyPayslips(req) {
        const employee = await this.payslipService['prisma'].employee.findUnique({
            where: { userId: BigInt(req.user.sub) },
        });
        if (!employee) {
            throw new common_1.NotFoundException('Employee profile not found');
        }
        const payslips = await this.payslipService.getEmployeePayslips(employee.id);
        return payslips.map((p) => this.transformPayslip(p));
    }
    async deletePayslip(id) {
        await this.payslipService.deletePayslip(BigInt(id));
        return {
            message: 'Payslip deleted successfully',
        };
    }
    transformPayslip(payslip) {
        const transformed = {
            ...payslip,
            id: payslip.id.toString(),
            payrollId: payslip.payrollId.toString(),
            grossSalary: payslip.grossSalary.toString(),
            overtimePay: payslip.overtimePay.toString(),
            bonuses: payslip.bonuses.toString(),
            allowances: payslip.allowances.toString(),
            taxAmount: payslip.taxAmount.toString(),
            bpjsKesehatanEmployee: payslip.bpjsKesehatanEmployee.toString(),
            bpjsKesehatanCompany: payslip.bpjsKesehatanCompany.toString(),
            bpjsKetenagakerjaanEmployee: payslip.bpjsKetenagakerjaanEmployee.toString(),
            bpjsKetenagakerjaanCompany: payslip.bpjsKetenagakerjaanCompany.toString(),
            otherDeductions: payslip.otherDeductions.toString(),
            takeHomePay: payslip.takeHomePay.toString(),
            generatedBy: payslip.generatedBy.toString(),
            generatedAt: payslip.generatedAt.toISOString(),
            createdAt: payslip.createdAt.toISOString(),
            updatedAt: payslip.updatedAt.toISOString(),
            deductions: payslip.deductions?.map((d) => ({
                id: d.id.toString(),
                type: d.type,
                description: d.description,
                amount: d.amount.toString(),
            })),
        };
        return (0, class_transformer_1.plainToInstance)(payslip_response_dto_1.PayslipResponseDto, transformed, {
            excludeExtraneousValues: true,
        });
    }
};
exports.PayslipController = PayslipController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, roles_decorator_1.Roles)('SUPER', 'HR'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate payslip from payroll',
        description: 'Calculate PPh 21 tax and BPJS deductions, then generate payslip',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_payslip_dto_1.GeneratePayslipDto, Object]),
    __metadata("design:returntype", Promise)
], PayslipController.prototype, "generatePayslip", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('SUPER', 'HR', 'MANAGER', 'EMPLOYEE'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payslip by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayslipController.prototype, "getPayslipById", null);
__decorate([
    (0, common_1.Get)('by-payroll/:payrollId'),
    (0, roles_decorator_1.Roles)('SUPER', 'HR', 'MANAGER', 'EMPLOYEE'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payslip by payroll ID' }),
    __param(0, (0, common_1.Param)('payrollId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayslipController.prototype, "getPayslipByPayrollId", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, roles_decorator_1.Roles)('SUPER', 'HR', 'MANAGER'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee payslips history' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayslipController.prototype, "getEmployeePayslips", null);
__decorate([
    (0, common_1.Get)('my/history'),
    (0, roles_decorator_1.Roles)('EMPLOYEE'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my payslips (self-service for employees)' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PayslipController.prototype, "getMyPayslips", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('SUPER', 'HR'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete payslip (for corrections)',
        description: 'Admin only - delete payslip if corrections are needed',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PayslipController.prototype, "deletePayslip", null);
exports.PayslipController = PayslipController = __decorate([
    (0, swagger_1.ApiTags)('Payslip'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('payslip'),
    __metadata("design:paramtypes", [payslip_service_1.PayslipService])
], PayslipController);
//# sourceMappingURL=payslip.controller.js.map