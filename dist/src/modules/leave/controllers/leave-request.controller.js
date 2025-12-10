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
exports.LeaveRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leave_request_service_1 = require("../services/leave-request.service");
const employee_service_1 = require("../../employee/services/employee.service");
const leave_request_dto_1 = require("../dto/leave-request.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let LeaveRequestController = class LeaveRequestController {
    leaveRequestService;
    employeeService;
    constructor(leaveRequestService, employeeService) {
        this.leaveRequestService = leaveRequestService;
        this.employeeService = employeeService;
    }
    async submitLeaveRequest(createDto, req) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        return this.leaveRequestService.submitRequest(createDto, Number(employee.id));
    }
    async getMyLeaveRequests(req, status, startDate, endDate, page, limit) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.leaveRequestService.getEmployeeRequests(Number(employee.id), { status, startDate, endDate, page: pageNum, limit: limitNum });
    }
    async getLeaveRequest(id, req) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        return this.leaveRequestService.getRequestDetails(id, Number(employee.id), req.user.role);
    }
    async cancelLeaveRequest(id, req) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        return this.leaveRequestService.cancelRequest(id, Number(employee.id));
    }
    async getPendingApprovals(req, department, page, limit) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        return this.leaveRequestService.getPendingApprovals(Number(employee.id), req.user.role, { department, page: pageNum, limit: limitNum });
    }
    async approveLeaveRequest(id, approveDto, req) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        return this.leaveRequestService.approveRequest(id, Number(employee.id), req.user.role, approveDto);
    }
    async rejectLeaveRequest(id, rejectDto, req) {
        const userId = BigInt(req.user.sub);
        const employee = await this.employeeService.findByUserId(userId);
        return this.leaveRequestService.rejectRequest(id, Number(employee.id), req.user.role, rejectDto);
    }
};
exports.LeaveRequestController = LeaveRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new leave request' }),
    (0, swagger_1.ApiBody)({ type: leave_request_dto_1.CreateLeaveRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Leave request submitted successfully',
        type: leave_request_dto_1.LeaveRequestResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid dates or insufficient balance' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_request_dto_1.CreateLeaveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "submitLeaveRequest", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get my leave requests' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.LeaveRequestStatus }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, description: 'Filter from start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, description: 'Filter to end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave requests retrieved successfully',
        type: leave_request_dto_1.LeaveRequestHistoryDto
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "getMyLeaveRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave request details' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave request ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave request details retrieved successfully',
        type: leave_request_dto_1.LeaveRequestResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "getLeaveRequest", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(client_1.Role.EMPLOYEE, client_1.Role.HR, client_1.Role.SUPER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a pending leave request' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave request ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave request cancelled successfully',
        type: leave_request_dto_1.LeaveRequestResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "cancelLeaveRequest", null);
__decorate([
    (0, common_1.Get)('pending/for-approval'),
    (0, roles_decorator_1.Roles)(client_1.Role.HR, client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave requests pending for approval (HR/Manager only)' }),
    (0, swagger_1.ApiQuery)({ name: 'department', required: false, description: 'Filter by department' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Pending leave requests retrieved successfully',
        type: leave_request_dto_1.LeaveRequestHistoryDto
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('department')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)(client_1.Role.HR, client_1.Role.SUPER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a leave request (HR/Manager only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave request ID' }),
    (0, swagger_1.ApiBody)({ type: leave_request_dto_1.ApproveLeaveRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave request approved successfully',
        type: leave_request_dto_1.LeaveRequestResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, leave_request_dto_1.ApproveLeaveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "approveLeaveRequest", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(client_1.Role.HR, client_1.Role.SUPER),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a leave request (HR/Manager only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave request ID' }),
    (0, swagger_1.ApiBody)({ type: leave_request_dto_1.RejectLeaveRequestDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave request rejected successfully',
        type: leave_request_dto_1.LeaveRequestResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, leave_request_dto_1.RejectLeaveRequestDto, Object]),
    __metadata("design:returntype", Promise)
], LeaveRequestController.prototype, "rejectLeaveRequest", null);
exports.LeaveRequestController = LeaveRequestController = __decorate([
    (0, swagger_1.ApiTags)('leave-requests'),
    (0, common_1.Controller)('leave-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [leave_request_service_1.LeaveRequestService,
        employee_service_1.EmployeeService])
], LeaveRequestController);
//# sourceMappingURL=leave-request.controller.js.map