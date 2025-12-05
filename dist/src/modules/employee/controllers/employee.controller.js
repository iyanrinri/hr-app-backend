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
exports.EmployeeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const employee_service_1 = require("../services/employee.service");
const create_employee_dto_1 = require("../dto/create-employee.dto");
const update_employee_dto_1 = require("../dto/update-employee.dto");
const find_all_employees_dto_1 = require("../dto/find-all-employees.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let EmployeeController = class EmployeeController {
    employeeService;
    constructor(employeeService) {
        this.employeeService = employeeService;
    }
    create(createEmployeeDto) {
        return this.employeeService.create(createEmployeeDto);
    }
    findAll(query, req) {
        return this.employeeService.findAll(query, req.user.role);
    }
    findOne(id) {
        return this.employeeService.findOne(BigInt(id));
    }
    update(id, updateEmployeeDto, req) {
        return this.employeeService.update(BigInt(id), updateEmployeeDto, req.user.role, req.user.sub);
    }
    remove(id, req) {
        return this.employeeService.remove(BigInt(id), req.user.role, req.user.sub);
    }
    restore(id) {
        return this.employeeService.restore(BigInt(id));
    }
};
exports.EmployeeController = EmployeeController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create employee (SUPER/HR only)' }),
    (0, swagger_1.ApiBody)({
        type: create_employee_dto_1.CreateEmployeeDto,
        description: 'Employee creation data',
        examples: {
            example1: {
                summary: 'Software Engineer Example',
                description: 'Example of creating a software engineer employee',
                value: {
                    email: 'jane.smith@company.com',
                    password: 'SecurePassword123!',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    position: 'Software Engineer',
                    department: 'Engineering',
                    joinDate: '2024-01-15T00:00:00Z',
                    baseSalary: 75000
                }
            },
            example2: {
                summary: 'HR Manager Example',
                description: 'Example of creating an HR manager employee',
                value: {
                    email: 'mike.johnson@company.com',
                    password: 'HRPassword456!',
                    firstName: 'Mike',
                    lastName: 'Johnson',
                    position: 'HR Manager',
                    department: 'Human Resources',
                    joinDate: '2024-02-01T00:00:00Z',
                    baseSalary: 85000
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The employee has been successfully created.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User with this email already exists.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER or HR role required.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees (SUPER/HR only)' }),
    (0, swagger_1.ApiQuery)({ name: 'paginated', required: false, type: Number, description: 'Enable pagination (1 for paginated, 0 or omit for all)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, description: 'Page number (only when paginated=1)' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Items per page (only when paginated=1)' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String, description: 'Search term for firstName, lastName, email, position, or department' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: ['active', 'inactive'], description: 'Filter by employee status (active = deletedAt null, inactive = deletedAt not null)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return employees based on role, pagination, search, and status filter.',
        type: [Object],
        schema: {
            oneOf: [
                { type: 'array', items: { type: 'object' } },
                { $ref: '#/components/schemas/PaginatedEmployeeResponseDto' }
            ]
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER or HR role required.' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_all_employees_dto_1.FindAllEmployeesDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee by id (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the employee.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER or HR role required.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee (SUPER/HR only)' }),
    (0, swagger_1.ApiBody)({
        type: update_employee_dto_1.UpdateEmployeeDto,
        description: 'Employee update data (all fields are optional)',
        examples: {
            updatePosition: {
                summary: 'Update Position & Salary',
                description: 'Update employee position and salary',
                value: {
                    position: 'Senior Software Engineer',
                    baseSalary: 95000
                }
            },
            updateDepartment: {
                summary: 'Department Transfer',
                description: 'Move employee to different department with new position',
                value: {
                    department: 'DevOps',
                    position: 'DevOps Engineer',
                    baseSalary: 90000
                }
            },
            updatePersonal: {
                summary: 'Update Personal Info',
                description: 'Update personal information and contact details',
                value: {
                    firstName: 'Jane',
                    lastName: 'Smith-Johnson',
                    email: 'jane.smith-johnson@company.com'
                }
            },
            updatePassword: {
                summary: 'Change Password',
                description: 'Update employee password (leave empty if no change needed)',
                value: {
                    password: 'NewSecurePassword123!'
                }
            },
            updateComplete: {
                summary: 'Complete Update',
                description: 'Update multiple fields at once',
                value: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe.updated@company.com',
                    position: 'Lead Software Engineer',
                    department: 'Engineering',
                    baseSalary: 105000,
                    password: 'UpdatedPassword123!'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The employee has been successfully updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - HR cannot edit SUPER/HR roles.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER or HR role required.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_employee_dto_1.UpdateEmployeeDto, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete employee (SUPER/HR only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The employee has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot delete protected roles or own record.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/restore'),
    (0, swagger_1.ApiOperation)({ summary: 'Restore soft-deleted employee (SUPER only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The employee has been successfully restored.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Employee not found or not deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - SUPER role required.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized.' }),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EmployeeController.prototype, "restore", null);
exports.EmployeeController = EmployeeController = __decorate([
    (0, swagger_1.ApiTags)('employees'),
    (0, common_1.Controller)('employees'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER, client_1.Role.HR),
    (0, swagger_1.ApiSecurity)('JWT-auth'),
    __metadata("design:paramtypes", [employee_service_1.EmployeeService])
], EmployeeController);
//# sourceMappingURL=employee.controller.js.map