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
exports.LeaveBalanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leave_balance_service_1 = require("../services/leave-balance.service");
const employee_service_1 = require("../../employee/services/employee.service");
const leave_request_dto_1 = require("../dto/leave-request.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let LeaveBalanceController = class LeaveBalanceController {
    leaveBalanceService;
    employeeService;
    constructor(leaveBalanceService, employeeService) {
        this.leaveBalanceService = leaveBalanceService;
        this.employeeService = employeeService;
    }
    async getMyLeaveBalances(req, periodId) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
        return this.leaveBalanceService.getEmployeeBalances(Number(employee.id), parsedPeriodId);
    }
    async getMyBalanceSummary(req, periodId) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
        return this.leaveBalanceService.getEmployeeBalanceSummary(Number(employee.id), parsedPeriodId);
    }
    async getEmployeeLeaveBalances(employeeId, periodId) {
        const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
        return this.leaveBalanceService.getEmployeeBalances(employeeId, parsedPeriodId);
    }
    async getEmployeeLeaveBalanceSummary(employeeId, periodId) {
        const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
        return this.leaveBalanceService.getEmployeeBalanceSummary(employeeId, parsedPeriodId);
    }
};
exports.LeaveBalanceController = LeaveBalanceController;
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get my leave balances' }),
    (0, swagger_1.ApiQuery)({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave balances retrieved successfully',
        type: [leave_request_dto_1.LeaveBalanceResponseDto]
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "getMyLeaveBalances", null);
__decorate([
    (0, common_1.Get)('my/summary'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get my leave balance summary' }),
    (0, swagger_1.ApiQuery)({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave balance summary retrieved successfully',
        type: leave_request_dto_1.LeaveBalanceSummaryDto
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "getMyBalanceSummary", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, roles_decorator_1.Roles)(client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee leave balances (HR/SUPER only)' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: 'number', description: 'Employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee leave balances retrieved successfully',
        type: [leave_request_dto_1.LeaveBalanceResponseDto]
    }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "getEmployeeLeaveBalances", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/summary'),
    (0, roles_decorator_1.Roles)(client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee leave balance summary (HR/SUPER only)' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: 'number', description: 'Employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Employee leave balance summary retrieved successfully',
        type: leave_request_dto_1.LeaveBalanceSummaryDto
    }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('periodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], LeaveBalanceController.prototype, "getEmployeeLeaveBalanceSummary", null);
exports.LeaveBalanceController = LeaveBalanceController = __decorate([
    (0, swagger_1.ApiTags)('leave-balances'),
    (0, common_1.Controller)('leave-balances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [leave_balance_service_1.LeaveBalanceService,
        employee_service_1.EmployeeService])
], LeaveBalanceController);
//# sourceMappingURL=leave-balance.controller.js.map