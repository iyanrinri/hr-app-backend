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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const payroll_service_1 = require("../services/payroll.service");
const create_payroll_dto_1 = require("../dto/create-payroll.dto");
const payroll_query_dto_1 = require("../dto/payroll-query.dto");
const payroll_response_dto_1 = require("../dto/payroll-response.dto");
const client_1 = require("@prisma/client");
let PayrollController = class PayrollController {
    payrollService;
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async createPayroll(createPayrollDto, req) {
        return this.payrollService.createPayroll(createPayrollDto, req.user.userId);
    }
    async findAll(query) {
        return this.payrollService.findAll(query);
    }
    async getPayrollSummary(employeeId) {
        return this.payrollService.getPayrollSummary(employeeId);
    }
    async getMyPayrolls(query, req) {
        const modifiedQuery = {
            ...query,
            employeeId: req.user.employee?.id?.toString(),
        };
        return this.payrollService.findAll(modifiedQuery);
    }
    async findById(id, req) {
        const payroll = await this.payrollService.findById(id);
        if (req.user.role === client_1.Role.EMPLOYEE) {
            if (payroll.employeeId !== req.user.employee?.id?.toString()) {
                throw new Error('Forbidden - can only view own payroll');
            }
        }
        return payroll;
    }
    async processPayrolls(processPayrollDto, req) {
        return this.payrollService.processPayrolls(processPayrollDto, req.user.userId);
    }
    async markAsPaid(id, req) {
        return this.payrollService.markAsPaid(id, req.user.userId);
    }
    async deletePayroll(id) {
        await this.payrollService.deletePayroll(id);
        return { message: 'Payroll deleted successfully' };
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({
        summary: 'Create payroll record',
        description: 'Create a new payroll record for an employee with automatic overtime calculation',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Payroll created successfully',
        type: payroll_response_dto_1.PayrollDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - validation error or overlapping period',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - insufficient permissions',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_dto_1.CreatePayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "createPayroll", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payroll records',
        description: 'Retrieve paginated list of payroll records with filtering options',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payroll records retrieved successfully',
        type: payroll_response_dto_1.PayrollListResponseDto,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'employeeId',
        required: false,
        description: 'Filter by employee ID',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'department',
        required: false,
        description: 'Filter by department',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        enum: payroll_query_dto_1.PayrollStatus,
        description: 'Filter by payroll status',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'periodStartFrom',
        required: false,
        description: 'Filter by period start date (from)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'periodStartTo',
        required: false,
        description: 'Filter by period start date (to)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number',
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Items per page',
        example: 10,
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_query_dto_1.PayrollQueryDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payroll summary',
        description: 'Retrieve aggregated payroll statistics',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payroll summary retrieved successfully',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'employeeId',
        required: false,
        description: 'Filter summary by employee ID',
    }),
    __param(0, (0, common_1.Query)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayrollSummary", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({
        summary: 'Get own payroll records',
        description: 'Retrieve payroll records for the authenticated employee',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Own payroll records retrieved successfully',
        type: payroll_response_dto_1.PayrollListResponseDto,
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payroll_query_dto_1.PayrollQueryDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMyPayrolls", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({
        summary: 'Get payroll by ID',
        description: 'Retrieve a specific payroll record by ID',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Payroll ID',
        example: '1',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payroll found',
        type: payroll_response_dto_1.PayrollDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Payroll not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)('process'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({
        summary: 'Process payroll records',
        description: 'Mark multiple payroll records as processed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payrolls processed successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payroll_dto_1.ProcessPayrollDto, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "processPayrolls", null);
__decorate([
    (0, common_1.Put)(':id/mark-paid'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({
        summary: 'Mark payroll as paid',
        description: 'Mark a payroll record as paid',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Payroll ID',
        example: '1',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payroll marked as paid successfully',
        type: payroll_response_dto_1.PayrollDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - payroll already paid or not processed',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Payroll not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "markAsPaid", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete payroll record',
        description: 'Delete a payroll record (only unpaid records can be deleted)',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Payroll ID',
        example: '1',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Payroll deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - cannot delete paid payroll',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Payroll not found',
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "deletePayroll", null);
exports.PayrollController = PayrollController = __decorate([
    (0, swagger_1.ApiTags)('Payroll'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map