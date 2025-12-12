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
exports.SalaryHistoryService = void 0;
const common_1 = require("@nestjs/common");
const salary_history_repository_1 = require("../repositories/salary-history.repository");
let SalaryHistoryService = class SalaryHistoryService {
    salaryHistoryRepository;
    constructor(salaryHistoryRepository) {
        this.salaryHistoryRepository = salaryHistoryRepository;
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
    async create(createSalaryHistoryDto) {
        const { employeeId, effectiveDate, approvedBy, ...historyData } = createSalaryHistoryDto;
        const salaryHistory = await this.salaryHistoryRepository.create({
            ...historyData,
            employee: {
                connect: { id: BigInt(employeeId) }
            },
            effectiveDate: new Date(effectiveDate),
            approvedBy: approvedBy ? BigInt(approvedBy) : null,
        });
        const createdHistory = await this.salaryHistoryRepository.findUnique({ id: salaryHistory.id }, {
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
        return this.transformSalaryHistoryResponse(createdHistory);
    }
    async findAll(params = {}) {
        const { skip = 0, take = 20, employeeId, changeType, startDate, endDate } = params;
        const where = {};
        if (employeeId)
            where.employeeId = BigInt(employeeId);
        if (changeType)
            where.changeType = changeType;
        if (startDate && endDate) {
            where.effectiveDate = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        const [histories, total] = await Promise.all([
            this.salaryHistoryRepository.findAll({
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
            this.salaryHistoryRepository.count(where)
        ]);
        return {
            histories: histories.map(history => this.transformSalaryHistoryResponse(history)),
            total
        };
    }
    async findOne(id) {
        const salaryHistory = await this.salaryHistoryRepository.findUnique({ id: BigInt(id) }, {
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
        if (!salaryHistory) {
            throw new common_1.NotFoundException(`Salary history with ID ${id} not found`);
        }
        return this.transformSalaryHistoryResponse(salaryHistory);
    }
    async getEmployeeHistory(employeeId) {
        const histories = await this.salaryHistoryRepository.findEmployeeHistory(BigInt(employeeId));
        return histories.map(history => this.transformSalaryHistoryResponse(history));
    }
    async getByDateRange(employeeId, startDate, endDate) {
        const histories = await this.salaryHistoryRepository.findByDateRange(BigInt(employeeId), new Date(startDate), new Date(endDate));
        return histories.map(history => this.transformSalaryHistoryResponse(history));
    }
    async getByChangeType(changeType) {
        const histories = await this.salaryHistoryRepository.findByChangeType(changeType);
        return histories.map(history => this.transformSalaryHistoryResponse(history));
    }
};
exports.SalaryHistoryService = SalaryHistoryService;
exports.SalaryHistoryService = SalaryHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [salary_history_repository_1.SalaryHistoryRepository])
], SalaryHistoryService);
//# sourceMappingURL=salary-history.service.js.map