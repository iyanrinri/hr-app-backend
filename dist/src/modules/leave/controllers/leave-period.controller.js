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
exports.LeavePeriodController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leave_period_service_1 = require("../services/leave-period.service");
const leave_period_dto_1 = require("../dto/leave-period.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let LeavePeriodController = class LeavePeriodController {
    leavePeriodService;
    constructor(leavePeriodService) {
        this.leavePeriodService = leavePeriodService;
    }
    create(createDto, req) {
        return this.leavePeriodService.create(createDto, req.user.sub);
    }
    async getAvailableLeaveTypes() {
        const leaveTypes = Object.values(client_1.LeaveType);
        return {
            data: leaveTypes,
            message: 'Available leave types retrieved successfully'
        };
    }
    async setupDefaultTypes(id) {
        return this.leavePeriodService.setupDefaultLeaveTypes(id);
    }
    findAll(page, limit, activeOnly) {
        return this.leavePeriodService.findAll({
            page,
            limit,
            activeOnly: activeOnly === 'true'
        });
    }
    findActive() {
        return this.leavePeriodService.findActive();
    }
    findOne(id) {
        return this.leavePeriodService.findById(BigInt(id));
    }
    update(id, updateDto) {
        return this.leavePeriodService.update(BigInt(id), updateDto);
    }
    remove(id) {
        return this.leavePeriodService.delete(BigInt(id));
    }
};
exports.LeavePeriodController = LeavePeriodController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create leave period (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Leave period created successfully',
        schema: {
            example: {
                id: 1,
                name: 'Annual Leave 2024',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                isActive: true,
                description: 'Annual leave allocation for 2024'
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid dates or overlapping period' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflict - Period overlaps with existing period' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_period_dto_1.CreateLeavePeriodDto, Object]),
    __metadata("design:returntype", void 0)
], LeavePeriodController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('available-leave-types'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available leave types for creating periods (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Available leave types retrieved successfully',
        schema: {
            example: {
                data: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'HAJJ_UMRAH', 'EMERGENCY', 'COMPASSIONATE', 'STUDY', 'UNPAID'],
                message: 'Available leave types retrieved successfully'
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeavePeriodController.prototype, "getAvailableLeaveTypes", null);
__decorate([
    (0, common_1.Post)(':id/setup-default-types'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Setup default leave type configurations for a period (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave period ID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Default leave types created successfully',
        schema: {
            example: {
                message: 'Default leave type configurations created successfully',
                count: 5
            }
        }
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeavePeriodController.prototype, "setupDefaultTypes", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get all leave periods (SUPER/HR only)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'activeOnly', required: false, example: false }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave periods retrieved successfully',
        schema: {
            example: {
                data: [{
                        id: 1,
                        name: 'Annual Leave 2024',
                        startDate: '2024-01-01',
                        endDate: '2024-12-31',
                        isActive: true,
                        leaveTypes: [
                            { id: 1, type: 'ANNUAL', name: 'Annual Leave', defaultQuota: 30 }
                        ],
                        stats: {
                            totalEmployeesWithBalances: 25,
                            totalLeaveRequests: 45
                        }
                    }],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 1,
                    totalPages: 1
                }
            }
        }
    }),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('activeOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], LeavePeriodController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('active'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get active leave period' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Active leave period retrieved successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active leave period found' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LeavePeriodController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave period by ID (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Leave period ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave period retrieved successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Leave period not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LeavePeriodController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update leave period (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Leave period ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave period updated successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Leave period not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Invalid data' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, leave_period_dto_1.UpdateLeavePeriodDto]),
    __metadata("design:returntype", void 0)
], LeavePeriodController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete leave period (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Leave period ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave period deleted successfully'
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Leave period not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - Cannot delete period with existing data' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LeavePeriodController.prototype, "remove", null);
exports.LeavePeriodController = LeavePeriodController = __decorate([
    (0, swagger_1.ApiTags)('leave-periods'),
    (0, common_1.Controller)('leave-periods'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [leave_period_service_1.LeavePeriodService])
], LeavePeriodController);
//# sourceMappingURL=leave-period.controller.js.map