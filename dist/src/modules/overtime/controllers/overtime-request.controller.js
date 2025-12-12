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
exports.OvertimeRequestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const overtime_request_service_1 = require("../services/overtime-request.service");
const create_overtime_request_dto_1 = require("../dto/create-overtime-request.dto");
const update_overtime_request_dto_1 = require("../dto/update-overtime-request.dto");
const overtime_response_dto_1 = require("../dto/overtime-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let OvertimeRequestController = class OvertimeRequestController {
    overtimeRequestService;
    constructor(overtimeRequestService) {
        this.overtimeRequestService = overtimeRequestService;
    }
    async create(createOvertimeRequestDto, req) {
        if (req.user.role === client_1.Role.EMPLOYEE) {
            const employeeId = await this.overtimeRequestService.getEmployeeIdByUserId(req.user.sub);
            if (!employeeId) {
                throw new Error('Employee record not found for this user');
            }
            createOvertimeRequestDto.employeeId = Number(employeeId);
        }
        return this.overtimeRequestService.create(createOvertimeRequestDto);
    }
    async findAll(skip, take, employeeId, status, startDate, endDate, req) {
        return this.overtimeRequestService.findAll({
            skip,
            take,
            employeeId,
            status,
            startDate,
            endDate,
            userRole: req.user.role,
            userId: req.user.role === client_1.Role.EMPLOYEE ? Number(req.user.employee?.id) : undefined
        });
    }
    async getPendingRequests(skip, take, req) {
        const managerId = req.user.role === client_1.Role.MANAGER ? Number(req.user.employee?.id) : undefined;
        return this.overtimeRequestService.getPendingRequests(managerId, {
            skip,
            take
        });
    }
    async getEmployeeHistory(employeeId, skip, take, status, startDate, endDate, req) {
        if (req.user.role === client_1.Role.EMPLOYEE && req.user.employee?.id !== employeeId.toString()) {
            throw new Error('Forbidden: You can only view your own overtime history');
        }
        return this.overtimeRequestService.getEmployeeOvertimeHistory(employeeId, {
            skip,
            take,
            status,
            startDate,
            endDate
        });
    }
    async getTotalOvertimeHours(employeeId, startDate, endDate, status = 'APPROVED', req) {
        if (req.user.role === client_1.Role.EMPLOYEE && req.user.employee?.id !== employeeId.toString()) {
            throw new Error('Forbidden: You can only view your own overtime totals');
        }
        return this.overtimeRequestService.getTotalOvertimeHours(employeeId, startDate, endDate, status);
    }
    async findOne(id, req) {
        const overtimeRequest = await this.overtimeRequestService.findOne(id);
        if (req.user.role === client_1.Role.EMPLOYEE && req.user.employee?.id !== overtimeRequest.employeeId) {
            throw new Error('Forbidden: You can only view your own overtime requests');
        }
        return overtimeRequest;
    }
    async update(id, updateOvertimeRequestDto) {
        return this.overtimeRequestService.update(id, updateOvertimeRequestDto);
    }
    async remove(id) {
        await this.overtimeRequestService.remove(id);
        return { message: `Overtime request with ID ${id} has been deleted successfully` };
    }
};
exports.OvertimeRequestController = OvertimeRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Submit overtime request' }),
    (0, swagger_1.ApiBody)({
        type: create_overtime_request_dto_1.CreateOvertimeRequestDto,
        description: 'Overtime request data',
        examples: {
            example1: {
                summary: 'Evening Overtime Request',
                description: 'Employee submitting overtime for evening work',
                value: {
                    employeeId: 123,
                    date: '2024-12-12',
                    startTime: '2024-12-12T18:00:00Z',
                    endTime: '2024-12-12T21:00:00Z',
                    reason: 'System deployment and maintenance work'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Overtime request submitted successfully', type: overtime_response_dto_1.OvertimeRequestResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data or business rule violation' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_overtime_request_dto_1.CreateOvertimeRequestDto, Object]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get overtime requests with filtering and pagination' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false, type: Number, description: 'Filter by employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Filter by start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Filter by end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime requests retrieved successfully', type: overtime_response_dto_1.PaginatedOvertimeResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Query)('skip', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('take', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('employeeId', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending overtime requests (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending requests retrieved successfully', type: [overtime_response_dto_1.OvertimeRequestResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Query)('skip', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('take', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/history'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get overtime history for specific employee' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Filter by start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Filter by end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee overtime history retrieved successfully', type: [overtime_response_dto_1.OvertimeRequestResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('skip', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('take', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __param(6, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "getEmployeeHistory", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/total-hours'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get total overtime hours for employee within date range' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by status (default: APPROVED)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Total overtime hours calculated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid date range' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "getTotalOvertimeHours", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get overtime request by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Overtime request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime request retrieved successfully', type: overtime_response_dto_1.OvertimeRequestResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime request not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update overtime request (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Overtime request ID' }),
    (0, swagger_1.ApiBody)({ type: update_overtime_request_dto_1.UpdateOvertimeRequestDto, description: 'Overtime request update data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime request updated successfully', type: overtime_response_dto_1.OvertimeRequestResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime request not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data or business rule violation' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_overtime_request_dto_1.UpdateOvertimeRequestDto]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete overtime request (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Overtime request ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime request deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime request not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot delete non-pending requests' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OvertimeRequestController.prototype, "remove", null);
exports.OvertimeRequestController = OvertimeRequestController = __decorate([
    (0, swagger_1.ApiTags)('overtime-requests'),
    (0, common_1.Controller)('overtime-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [overtime_request_service_1.OvertimeRequestService])
], OvertimeRequestController);
//# sourceMappingURL=overtime-request.controller.js.map