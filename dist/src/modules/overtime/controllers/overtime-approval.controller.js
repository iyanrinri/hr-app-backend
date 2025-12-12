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
exports.OvertimeApprovalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const overtime_approval_service_1 = require("../services/overtime-approval.service");
const overtime_approval_dto_1 = require("../dto/overtime-approval.dto");
const overtime_response_dto_1 = require("../dto/overtime-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let OvertimeApprovalController = class OvertimeApprovalController {
    overtimeApprovalService;
    constructor(overtimeApprovalService) {
        this.overtimeApprovalService = overtimeApprovalService;
    }
    async create(createOvertimeApprovalDto) {
        return this.overtimeApprovalService.create(createOvertimeApprovalDto);
    }
    async processApproval(body) {
        const { overtimeRequestId, approverId, approverType, status, comments } = body;
        return this.overtimeApprovalService.processApproval(overtimeRequestId, approverId, approverType, status, comments);
    }
    async findAll(skip, take, approverId, status, approverType, req) {
        if (req.user.role === client_1.Role.MANAGER && !approverId) {
            approverId = Number(req.user.employee?.id);
        }
        return this.overtimeApprovalService.findAll({
            skip,
            take,
            approverId,
            status,
            approverType
        });
    }
    async getPendingApprovals(approverType, req) {
        let approverId = undefined;
        let filterApproverType = approverType;
        if (req.user.role === client_1.Role.MANAGER) {
            approverId = Number(req.user.employee?.id);
            filterApproverType = filterApproverType || overtime_approval_dto_1.ApproverType.MANAGER;
        }
        else if (req.user.role === client_1.Role.HR) {
            filterApproverType = filterApproverType || overtime_approval_dto_1.ApproverType.HR;
        }
        return this.overtimeApprovalService.getPendingApprovals(approverId, filterApproverType);
    }
    async getApprovalStats(approverId, startDate, endDate, req) {
        if (req.user.role === client_1.Role.MANAGER && !approverId) {
            approverId = Number(req.user.employee?.id);
        }
        return this.overtimeApprovalService.getApprovalStats(approverId, startDate, endDate);
    }
    async findOne(id) {
        return this.overtimeApprovalService.findOne(id);
    }
    async update(id, updateOvertimeApprovalDto) {
        return this.overtimeApprovalService.update(id, updateOvertimeApprovalDto);
    }
    async remove(id) {
        await this.overtimeApprovalService.remove(id);
        return { message: `Overtime approval with ID ${id} has been deleted successfully` };
    }
};
exports.OvertimeApprovalController = OvertimeApprovalController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Create overtime approval (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiBody)({
        type: overtime_approval_dto_1.CreateOvertimeApprovalDto,
        description: 'Overtime approval data',
        examples: {
            example1: {
                summary: 'Manager Approval',
                description: 'Manager approving an overtime request',
                value: {
                    overtimeRequestId: 123,
                    approverId: 456,
                    approverType: 'MANAGER',
                    status: 'APPROVED',
                    comments: 'Approved due to project urgency'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Overtime approval created successfully', type: overtime_response_dto_1.OvertimeApprovalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data or approval already exists' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime request not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [overtime_approval_dto_1.CreateOvertimeApprovalDto]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('process'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Process overtime approval (approve/reject)' }),
    (0, swagger_1.ApiBody)({
        description: 'Approval processing data',
        examples: {
            example1: {
                summary: 'Approve Request',
                description: 'Manager approving an overtime request',
                value: {
                    overtimeRequestId: 123,
                    approverId: 456,
                    approverType: 'MANAGER',
                    status: 'APPROVED',
                    comments: 'Approved for urgent project completion'
                }
            },
            example2: {
                summary: 'Reject Request',
                description: 'HR rejecting an overtime request',
                value: {
                    overtimeRequestId: 123,
                    approverId: 789,
                    approverType: 'HR',
                    status: 'REJECTED',
                    comments: 'Insufficient justification for overtime'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Overtime approval processed successfully', type: overtime_response_dto_1.OvertimeApprovalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime request not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "processApproval", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get overtime approvals with filtering and pagination (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiQuery)({ name: 'approverId', required: false, type: Number, description: 'Filter by approver ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, type: String, description: 'Filter by approval status' }),
    (0, swagger_1.ApiQuery)({ name: 'approverType', required: false, type: String, description: 'Filter by approver type (MANAGER/HR)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime approvals retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Query)('skip', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('take', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('approverId', new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('approverType')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending approvals for current user (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiQuery)({ name: 'approverType', required: false, type: String, description: 'Filter by approver type (MANAGER/HR)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pending approvals retrieved successfully', type: [overtime_response_dto_1.OvertimeApprovalResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Query)('approverType')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get approval statistics (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiQuery)({ name: 'approverId', required: false, type: Number, description: 'Filter by approver ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approval statistics retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Query)('approverId', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "getApprovalStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get overtime approval by ID (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Overtime approval ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime approval retrieved successfully', type: overtime_response_dto_1.OvertimeApprovalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime approval not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Update overtime approval (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Overtime approval ID' }),
    (0, swagger_1.ApiBody)({ type: overtime_approval_dto_1.UpdateOvertimeApprovalDto, description: 'Overtime approval update data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime approval updated successfully', type: overtime_response_dto_1.OvertimeApprovalResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime approval not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, overtime_approval_dto_1.UpdateOvertimeApprovalDto]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete overtime approval (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Overtime approval ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Overtime approval deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Overtime approval not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OvertimeApprovalController.prototype, "remove", null);
exports.OvertimeApprovalController = OvertimeApprovalController = __decorate([
    (0, swagger_1.ApiTags)('overtime-approvals'),
    (0, common_1.Controller)('overtime-approvals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [overtime_approval_service_1.OvertimeApprovalService])
], OvertimeApprovalController);
//# sourceMappingURL=overtime-approval.controller.js.map