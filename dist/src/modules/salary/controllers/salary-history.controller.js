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
exports.SalaryHistoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salary_history_service_1 = require("../services/salary-history.service");
const create_salary_history_dto_1 = require("../dto/create-salary-history.dto");
const salary_response_dto_1 = require("../dto/salary-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SalaryHistoryController = class SalaryHistoryController {
    salaryHistoryService;
    constructor(salaryHistoryService) {
        this.salaryHistoryService = salaryHistoryService;
    }
    async create(createSalaryHistoryDto) {
        return this.salaryHistoryService.create(createSalaryHistoryDto);
    }
    async findAll(skip, take, employeeId, changeType, startDate, endDate) {
        return this.salaryHistoryService.findAll({
            skip,
            take,
            employeeId,
            changeType,
            startDate,
            endDate
        });
    }
    async getEmployeeHistory(employeeId, req) {
        if (req.user.role === client_1.Role.EMPLOYEE && req.user.employee?.id !== employeeId.toString()) {
            throw new Error('Forbidden: You can only view your own salary history');
        }
        return this.salaryHistoryService.getEmployeeHistory(employeeId);
    }
    async getByDateRange(employeeId, startDate, endDate) {
        return this.salaryHistoryService.getByDateRange(employeeId, startDate, endDate);
    }
    async getByChangeType(changeType) {
        return this.salaryHistoryService.getByChangeType(changeType);
    }
    async findOne(id) {
        return this.salaryHistoryService.findOne(id);
    }
};
exports.SalaryHistoryController = SalaryHistoryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create salary history record (SUPER/HR only)' }),
    (0, swagger_1.ApiBody)({
        type: create_salary_history_dto_1.CreateSalaryHistoryDto,
        description: 'Salary history creation data',
        examples: {
            example1: {
                summary: 'Promotion Record',
                description: 'Record of salary change due to promotion',
                value: {
                    employeeId: 123,
                    changeType: 'PROMOTION',
                    oldBaseSalary: 5000000,
                    newBaseSalary: 6000000,
                    oldGrade: 'Grade 5',
                    newGrade: 'Grade 6',
                    oldPosition: 'Software Engineer',
                    newPosition: 'Senior Software Engineer',
                    reason: 'Promoted to senior position based on performance',
                    effectiveDate: '2024-01-01',
                    approvedBy: 1
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Salary history created successfully', type: salary_response_dto_1.SalaryHistoryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_salary_history_dto_1.CreateSalaryHistoryDto]),
    __metadata("design:returntype", Promise)
], SalaryHistoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary history with filtering and pagination (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false, type: Number, description: 'Filter by employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'changeType', required: false, type: String, description: 'Filter by change type' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String, description: 'Filter by start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String, description: 'Filter by end date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary history retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Query)('skip', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('take', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('employeeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('changeType')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], SalaryHistoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary history for specific employee' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Employee salary history retrieved successfully', type: [salary_response_dto_1.SalaryHistoryResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SalaryHistoryController.prototype, "getEmployeeHistory", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/date-range'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary history for employee within date range (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String, description: 'Start date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String, description: 'End date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary history within date range retrieved successfully', type: [salary_response_dto_1.SalaryHistoryResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid date range' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], SalaryHistoryController.prototype, "getByDateRange", null);
__decorate([
    (0, common_1.Get)('change-type/:changeType'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary history by change type (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'changeType', type: String, description: 'Change type (PROMOTION, GRADE_ADJUSTMENT, etc.)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary history by change type retrieved successfully', type: [salary_response_dto_1.SalaryHistoryResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR role required' }),
    __param(0, (0, common_1.Param)('changeType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SalaryHistoryController.prototype, "getByChangeType", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary history by ID (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Salary history ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary history retrieved successfully', type: salary_response_dto_1.SalaryHistoryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary history not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalaryHistoryController.prototype, "findOne", null);
exports.SalaryHistoryController = SalaryHistoryController = __decorate([
    (0, swagger_1.ApiTags)('salary-history'),
    (0, common_1.Controller)('salary-history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [salary_history_service_1.SalaryHistoryService])
], SalaryHistoryController);
//# sourceMappingURL=salary-history.controller.js.map