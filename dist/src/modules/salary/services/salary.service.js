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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const salary_repository_1 = require("../repositories/salary.repository");
const salary_history_repository_1 = require("../repositories/salary-history.repository");
const create_salary_history_dto_1 = require("../dto/create-salary-history.dto");
let SalaryService = class SalaryService {
    salaryRepository;
    salaryHistoryRepository;
    constructor(salaryRepository, salaryHistoryRepository) {
        this.salaryRepository = salaryRepository;
        this.salaryHistoryRepository = salaryHistoryRepository;
    }
    transformSalaryResponse(salary) {
        return {
            ...salary,
            id: salary.id.toString(),
            employeeId: salary.employeeId.toString(),
            baseSalary: salary.baseSalary.toString(),
            allowances: salary.allowances.toString(),
            createdBy: salary.createdBy.toString(),
            employee: salary.employee ? {
                id: salary.employee.id.toString(),
                firstName: salary.employee.firstName,
                lastName: salary.employee.lastName,
                position: salary.employee.position,
                department: salary.employee.department,
            } : undefined,
        };
    }
    transformSalaryHistoryResponse(salaryHistory) {
        return {
            ...salaryHistory,
            id: salaryHistory.id.toString(),
            employeeId: salaryHistory.employeeId.toString(),
            oldBaseSalary: salaryHistory.oldBaseSalary?.toString(),
            newBaseSalary: salaryHistory.newBaseSalary.toString(),
            approvedBy: salaryHistory.approvedBy?.toString(),
            employee: salaryHistory.employee ? {
                id: salaryHistory.employee.id.toString(),
                firstName: salaryHistory.employee.firstName,
                lastName: salaryHistory.employee.lastName,
                position: salaryHistory.employee.position,
                department: salaryHistory.employee.department,
            } : undefined,
        };
    }
    async create(createSalaryDto) {
        const { employeeId, effectiveDate, endDate, createdBy, ...salaryData } = createSalaryDto;
        const currentSalary = await this.salaryRepository.findCurrentSalary(BigInt(employeeId));
        if (currentSalary) {
            const endCurrentDate = new Date(effectiveDate);
            endCurrentDate.setDate(endCurrentDate.getDate() - 1);
            await this.salaryRepository.endCurrentSalary(BigInt(employeeId), endCurrentDate);
        }
        const salary = await this.salaryRepository.create({
            ...salaryData,
            employee: {
                connect: { id: BigInt(employeeId) }
            },
            effectiveDate: new Date(effectiveDate),
            endDate: endDate ? new Date(endDate) : null,
            createdBy: BigInt(createdBy),
        });
        await this.salaryHistoryRepository.create({
            employee: {
                connect: { id: BigInt(employeeId) }
            },
            changeType: currentSalary ? create_salary_history_dto_1.SalaryChangeType.GRADE_ADJUSTMENT : create_salary_history_dto_1.SalaryChangeType.INITIAL,
            oldBaseSalary: currentSalary?.baseSalary,
            newBaseSalary: salaryData.baseSalary,
            reason: currentSalary ? 'Salary adjustment' : 'Initial salary setup',
            effectiveDate: new Date(effectiveDate),
            approvedBy: BigInt(createdBy),
        });
        const createdSalary = await this.salaryRepository.findUnique({ id: salary.id }, {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            }
        });
        return this.transformSalaryResponse(createdSalary);
    }
    async findAll(params = {}) {
        const { skip = 0, take = 10, employeeId, isActive, grade } = params;
        const where = {};
        if (employeeId)
            where.employeeId = BigInt(employeeId);
        if (isActive !== undefined)
            where.isActive = isActive;
        if (grade)
            where.grade = { contains: grade, mode: 'insensitive' };
        const [salaries, total] = await Promise.all([
            this.salaryRepository.findAll({
                skip,
                take,
                where,
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            position: true,
                            department: true
                        }
                    }
                },
                orderBy: { effectiveDate: 'desc' }
            }),
            this.salaryRepository.count(where)
        ]);
        return {
            salaries: salaries.map(salary => this.transformSalaryResponse(salary)),
            total
        };
    }
    async findOne(id) {
        const salary = await this.salaryRepository.findUnique({ id: BigInt(id) }, {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            }
        });
        if (!salary) {
            throw new common_1.NotFoundException(`Salary with ID ${id} not found`);
        }
        return this.transformSalaryResponse(salary);
    }
    async getCurrentSalary(employeeId) {
        const salary = await this.salaryRepository.findCurrentSalary(BigInt(employeeId));
        if (!salary) {
            throw new common_1.NotFoundException(`No active salary found for employee ${employeeId}`);
        }
        return this.transformSalaryResponse(salary);
    }
    async getEmployeeSalaryHistory(employeeId) {
        const salaries = await this.salaryRepository.findEmployeeSalaryHistory(BigInt(employeeId));
        return salaries.map(salary => this.transformSalaryResponse(salary));
    }
    async update(id, updateSalaryDto) {
        const existingSalary = await this.salaryRepository.findUnique({ id: BigInt(id) });
        if (!existingSalary) {
            throw new common_1.NotFoundException(`Salary with ID ${id} not found`);
        }
        const { endDate, ...updateData } = updateSalaryDto;
        const updatedSalary = await this.salaryRepository.update({ id: BigInt(id) }, {
            ...updateData,
            endDate: endDate ? new Date(endDate) : undefined,
        });
        const result = await this.salaryRepository.findUnique({ id: BigInt(id) }, {
            employee: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    position: true,
                    department: true
                }
            }
        });
        return this.transformSalaryResponse(result);
    }
    async remove(id) {
        const salary = await this.salaryRepository.findUnique({ id: BigInt(id) });
        if (!salary) {
            throw new common_1.NotFoundException(`Salary with ID ${id} not found`);
        }
        await this.salaryRepository.delete({ id: BigInt(id) });
    }
};
exports.SalaryService = SalaryService;
exports.SalaryService = SalaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [salary_repository_1.SalaryRepository,
        salary_history_repository_1.SalaryHistoryRepository])
], SalaryService);
//# sourceMappingURL=salary.service.js.map