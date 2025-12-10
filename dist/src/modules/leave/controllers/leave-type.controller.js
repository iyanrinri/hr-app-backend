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
exports.LeaveTypeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leave_type_service_1 = require("../services/leave-type.service");
const leave_type_dto_1 = require("../dto/leave-type.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let LeaveTypeController = class LeaveTypeController {
    leaveTypeService;
    constructor(leaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }
    async create(createLeaveTypeDto) {
        return this.leaveTypeService.create(createLeaveTypeDto);
    }
    async findAll() {
        return this.leaveTypeService.findAll();
    }
    async findOne(id) {
        return this.leaveTypeService.findOne(id);
    }
    async update(id, updateLeaveTypeDto) {
        return this.leaveTypeService.update(id, updateLeaveTypeDto);
    }
    async remove(id) {
        await this.leaveTypeService.remove(id);
        return { message: 'Leave type configuration deleted successfully' };
    }
};
exports.LeaveTypeController = LeaveTypeController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new leave type configuration (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Leave type configuration created successfully.',
        type: leave_type_dto_1.LeaveTypeConfigResponseDto
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_type_dto_1.CreateLeaveTypeConfigDto]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get all leave type configurations' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of leave type configurations retrieved successfully.',
        type: [leave_type_dto_1.LeaveTypeConfigResponseDto]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get leave type configuration by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave type configuration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave type configuration retrieved successfully.',
        type: leave_type_dto_1.LeaveTypeConfigResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update leave type configuration (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave type configuration ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Leave type configuration updated successfully.',
        type: leave_type_dto_1.LeaveTypeConfigResponseDto
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, leave_type_dto_1.UpdateLeaveTypeConfigDto]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Delete leave type configuration (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: 'number', description: 'Leave type configuration ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Leave type configuration deleted successfully.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeaveTypeController.prototype, "remove", null);
exports.LeaveTypeController = LeaveTypeController = __decorate([
    (0, swagger_1.ApiTags)('leave-types'),
    (0, common_1.Controller)('leave-types'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [leave_type_service_1.LeaveTypeService])
], LeaveTypeController);
//# sourceMappingURL=leave-type.controller.js.map