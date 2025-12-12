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
exports.SalaryHistoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let SalaryHistoryRepository = class SalaryHistoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.salaryHistory.create({ data });
    }
    async findAll(params) {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.salaryHistory.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }
    async findUnique(where, include) {
        return this.prisma.salaryHistory.findUnique({
            where,
            include,
        });
    }
    async findEmployeeHistory(employeeId) {
        return this.prisma.salaryHistory.findMany({
            where: { employeeId },
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
        });
    }
    async findByDateRange(employeeId, startDate, endDate) {
        return this.prisma.salaryHistory.findMany({
            where: {
                employeeId,
                effectiveDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
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
        });
    }
    async findByChangeType(changeType) {
        return this.prisma.salaryHistory.findMany({
            where: { changeType: changeType },
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
        });
    }
    async count(where) {
        return this.prisma.salaryHistory.count({ where });
    }
};
exports.SalaryHistoryRepository = SalaryHistoryRepository;
exports.SalaryHistoryRepository = SalaryHistoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalaryHistoryRepository);
//# sourceMappingURL=salary-history.repository.js.map