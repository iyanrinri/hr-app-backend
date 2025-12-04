"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeService = void 0;
const common_1 = require("@nestjs/common");
const employee_repository_1 = require("../repositories/employee.repository");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
function parsePrismaError(error) {
    const cause = error.meta?.driverAdapterError?.cause;
    const kind = cause?.kind;
    const originalMessage = cause?.originalMessage;
    if (kind === 'UniqueConstraintViolation') {
        if (originalMessage.includes('email') && originalMessage.includes('duplicate')) {
            return {
                message: "User with this email already exists",
                code: 409
            };
        }
    }
    return null;
}
let EmployeeService = class EmployeeService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(createEmployeeDto) {
        const { email, password, ...employeeData } = createEmployeeDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            return await this.repository.create({
                ...employeeData,
                user: {
                    create: {
                        email,
                        password: hashedPassword,
                        role: 'EMPLOYEE',
                    },
                },
            });
        }
        catch (error) {
            const meta = parsePrismaError(error);
            if (meta?.code === 409) {
                throw new common_1.ConflictException(meta.message);
            }
            throw error;
        }
    }
    async findAll(query, userRole) {
        let whereCondition = {};
        if (userRole === client_1.Role.HR) {
            whereCondition.user = {
                role: {
                    notIn: [client_1.Role.SUPER, client_1.Role.HR]
                }
            };
        }
        if (query.status === 'active') {
            whereCondition.isDeleted = false;
        }
        else if (query.status === 'inactive') {
            whereCondition.isDeleted = true;
        }
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            whereCondition.OR = [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { position: { contains: searchTerm, mode: 'insensitive' } },
                { department: { contains: searchTerm, mode: 'insensitive' } },
                { user: { email: { contains: searchTerm, mode: 'insensitive' } } }
            ];
        }
        let employees;
        let total = 0;
        if (query.paginated === 1) {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;
            total = await this.repository.count(whereCondition);
            employees = await this.repository.findAll({
                skip,
                take: limit,
                where: whereCondition,
                orderBy: { createdAt: 'desc' }
            });
            return {
                data: this.transformEmployees(employees),
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };
        }
        else {
            employees = await this.repository.findAll({
                where: whereCondition,
                orderBy: { createdAt: 'desc' }
            });
            return this.transformEmployees(employees);
        }
    }
    transformEmployees(employees) {
        return employees.map(employee => {
            const emp = employee;
            return {
                ...emp,
                id: emp.id.toString(),
                userId: emp.userId.toString(),
                joinDate: emp.joinDate instanceof Date ? emp.joinDate.toISOString() : emp.joinDate,
                baseSalary: emp.baseSalary ? parseFloat(emp.baseSalary.toString()) : null,
                deletedAt: emp.deletedAt instanceof Date ? emp.deletedAt.toISOString() : emp.deletedAt,
                createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
                updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
                user: emp.user ? {
                    ...emp.user,
                    id: emp.user.id.toString(),
                    deletedAt: emp.user.deletedAt instanceof Date ? emp.user.deletedAt.toISOString() : emp.user.deletedAt,
                    createdAt: emp.user.createdAt instanceof Date ? emp.user.createdAt.toISOString() : emp.user.createdAt,
                    updatedAt: emp.user.updatedAt instanceof Date ? emp.user.updatedAt.toISOString() : emp.user.updatedAt,
                } : null
            };
        });
    }
    async findOne(id) {
        const employee = await this.repository.findOne({ id });
        if (!employee) {
            return null;
        }
        const emp = employee;
        return {
            ...emp,
            id: emp.id.toString(),
            userId: emp.userId.toString(),
            joinDate: emp.joinDate instanceof Date ? emp.joinDate.toISOString() : emp.joinDate,
            baseSalary: emp.baseSalary ? parseFloat(emp.baseSalary.toString()) : null,
            deletedAt: emp.deletedAt instanceof Date ? emp.deletedAt.toISOString() : emp.deletedAt,
            createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
            updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
            user: emp.user ? {
                ...emp.user,
                id: emp.user.id.toString(),
                deletedAt: emp.user.deletedAt instanceof Date ? emp.user.deletedAt.toISOString() : emp.user.deletedAt,
                createdAt: emp.user.createdAt instanceof Date ? emp.user.createdAt.toISOString() : emp.user.createdAt,
                updatedAt: emp.user.updatedAt instanceof Date ? emp.user.updatedAt.toISOString() : emp.user.updatedAt,
            } : null
        };
    }
    async update(id, updateEmployeeDto, userRole, userId) {
        const employee = await this.repository.findOne({ id });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const employeeWithUser = employee;
        if (userRole === client_1.Role.HR) {
            if (employeeWithUser.user?.role === client_1.Role.SUPER || employeeWithUser.user?.role === client_1.Role.HR) {
                throw new common_1.ForbiddenException('HR users cannot edit SUPER or HR role employees');
            }
        }
        const { email, password, ...employeeData } = updateEmployeeDto;
        const updateData = {};
        if (employeeData.firstName !== undefined)
            updateData.firstName = employeeData.firstName;
        if (employeeData.lastName !== undefined)
            updateData.lastName = employeeData.lastName;
        if (employeeData.position !== undefined)
            updateData.position = employeeData.position;
        if (employeeData.department !== undefined)
            updateData.department = employeeData.department;
        if (employeeData.baseSalary !== undefined)
            updateData.baseSalary = employeeData.baseSalary;
        let userUpdateData = {};
        if (email !== undefined) {
            userUpdateData.email = email;
        }
        if (password !== undefined && password.trim() !== '') {
            userUpdateData.password = await bcrypt.hash(password, 10);
        }
        if (Object.keys(userUpdateData).length > 0) {
            updateData.user = {
                update: userUpdateData
            };
        }
        try {
            return await this.repository.update({
                where: { id },
                data: updateData,
            });
        }
        catch (error) {
            const meta = parsePrismaError(error);
            if (meta?.code === 409) {
                throw new common_1.ConflictException(meta.message);
            }
            throw error;
        }
    }
    async remove(id, userRole, userId) {
        const employee = await this.repository.findOne({ id });
        if (!employee) {
            throw new common_1.NotFoundException('Employee not found');
        }
        const employeeWithUser = employee;
        if (userRole === client_1.Role.SUPER) {
            if (employeeWithUser.userId.toString() === userId) {
                throw new common_1.ForbiddenException('SUPER users cannot delete their own employee record');
            }
        }
        else if (userRole === client_1.Role.HR) {
            if (employeeWithUser.user?.role === client_1.Role.SUPER || employeeWithUser.user?.role === client_1.Role.HR) {
                throw new common_1.ForbiddenException('HR users cannot delete SUPER or HR role employees');
            }
            if (employeeWithUser.userId.toString() === userId) {
                throw new common_1.ForbiddenException('HR users cannot delete their own employee record');
            }
        }
        return this.repository.softDelete({ id });
    }
    async restore(id) {
        try {
            const restoredEmployee = await this.repository.restore({ id });
            const emp = restoredEmployee;
            return {
                ...emp,
                id: emp.id.toString(),
                userId: emp.userId.toString(),
                joinDate: emp.joinDate instanceof Date ? emp.joinDate.toISOString() : emp.joinDate,
                baseSalary: emp.baseSalary ? parseFloat(emp.baseSalary.toString()) : null,
                deletedAt: emp.deletedAt instanceof Date ? emp.deletedAt.toISOString() : emp.deletedAt,
                createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
                updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
            };
        }
        catch (error) {
            if (error.message === 'Employee not found or not deleted') {
                throw new common_1.NotFoundException('Employee not found or not deleted');
            }
            throw error;
        }
    }
};
exports.EmployeeService = EmployeeService;
exports.EmployeeService = EmployeeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [employee_repository_1.EmployeeRepository])
], EmployeeService);
//# sourceMappingURL=employee.service.js.map