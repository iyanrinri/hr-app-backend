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
exports.SalaryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salary_service_1 = require("../services/salary.service");
const create_salary_dto_1 = require("../dto/create-salary.dto");
const update_salary_dto_1 = require("../dto/update-salary.dto");
const salary_response_dto_1 = require("../dto/salary-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SalaryController = class SalaryController {
    salaryService;
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    async create(createSalaryDto) {
        return this.salaryService.create(createSalaryDto);
    }
    async findAll(skip, take, employeeId, isActive, grade) {
        return this.salaryService.findAll({
            skip,
            take,
            employeeId,
            isActive: isActive !== undefined ? isActive === true : undefined,
            grade
        });
    }
    async getCurrentSalary(employeeId, req) {
        if (req.user.role === client_1.Role.EMPLOYEE && req.user.employee?.id !== employeeId.toString()) {
            throw new Error('Forbidden: You can only view your own salary');
        }
        return this.salaryService.getCurrentSalary(employeeId);
    }
    async getEmployeeSalaryHistory(employeeId, req) {
        if (req.user.role === client_1.Role.EMPLOYEE && req.user.employee?.id !== employeeId.toString()) {
            throw new Error('Forbidden: You can only view your own salary history');
        }
        return this.salaryService.getEmployeeSalaryHistory(employeeId);
    }
    async findOne(id) {
        return this.salaryService.findOne(id);
    }
    async update(id, updateSalaryDto) {
        return this.salaryService.update(id, updateSalaryDto);
    }
    async remove(id) {
        await this.salaryService.remove(id);
        return { message: `Salary with ID ${id} has been deleted successfully` };
    }
};
exports.SalaryController = SalaryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Create salary record (SUPER/HR only)' }),
    (0, swagger_1.ApiBody)({
        type: create_salary_dto_1.CreateSalaryDto,
        description: 'Salary creation data',
        examples: {
            example1: {
                summary: 'New Employee Salary',
                description: 'Initial salary setup for new employee',
                value: {
                    employeeId: 123,
                    baseSalary: 5000000,
                    allowances: 500000,
                    grade: 'Grade 5',
                    effectiveDate: '2024-01-01',
                    createdBy: 1
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Salary created successfully', type: salary_response_dto_1.SalaryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR role required' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_salary_dto_1.CreateSalaryDto]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get all salaries with filtering and pagination (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number, description: 'Number of records to skip' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number, description: 'Number of records to take' }),
    (0, swagger_1.ApiQuery)({ name: 'employeeId', required: false, type: Number, description: 'Filter by employee ID' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' }),
    (0, swagger_1.ApiQuery)({ name: 'grade', required: false, type: String, description: 'Filter by salary grade' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salaries retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Query)('skip', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('take', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('employeeId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('isActive')),
    __param(4, (0, common_1.Query)('grade')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Boolean, String]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/current'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get current salary for employee' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current salary retrieved successfully', type: salary_response_dto_1.SalaryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No active salary found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getCurrentSalary", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId/history'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER, client_1.Role.EMPLOYEE),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary history for employee' }),
    (0, swagger_1.ApiParam)({ name: 'employeeId', type: Number, description: 'Employee ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary history retrieved successfully', type: [salary_response_dto_1.SalaryResponseDto] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('employeeId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "getEmployeeSalaryHistory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR, client_1.Role.MANAGER),
    (0, swagger_1.ApiOperation)({ summary: 'Get salary by ID (SUPER/HR/MANAGER only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Salary ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary retrieved successfully', type: salary_response_dto_1.SalaryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR/MANAGER role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiOperation)({ summary: 'Update salary (SUPER/HR only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Salary ID' }),
    (0, swagger_1.ApiBody)({ type: update_salary_dto_1.UpdateSalaryDto, description: 'Salary update data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary updated successfully', type: salary_response_dto_1.SalaryResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary not found' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER/HR role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_salary_dto_1.UpdateSalaryDto]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER),
    (0, swagger_1.ApiOperation)({ summary: 'Delete salary (SUPER only)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Salary ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Salary deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Salary not found' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER role required' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalaryController.prototype, "remove", null);
exports.SalaryController = SalaryController = __decorate([
    (0, swagger_1.ApiTags)('salaries'),
    (0, common_1.Controller)('salaries'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    __metadata("design:paramtypes", [salary_service_1.SalaryService])
], SalaryController);
//# sourceMappingURL=salary.controller.js.map