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
exports.SalaryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let SalaryRepository = class SalaryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.salary.create({ data });
    }
    async findAll(params) {
        const { skip, take, cursor, where, orderBy, include } = params;
        return this.prisma.salary.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include,
        });
    }
    async findUnique(where, include) {
        return this.prisma.salary.findUnique({
            where,
            include,
        });
    }
    async findFirst(where, include) {
        return this.prisma.salary.findFirst({
            where,
            include,
        });
    }
    async findCurrentSalary(employeeId) {
        return this.prisma.salary.findFirst({
            where: {
                employeeId,
                isActive: true,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } }
                ]
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
    async findEmployeeSalaryHistory(employeeId) {
        return this.prisma.salary.findMany({
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
    async update(where, data) {
        return this.prisma.salary.update({
            where,
            data,
        });
    }
    async delete(where) {
        return this.prisma.salary.delete({ where });
    }
    async count(where) {
        return this.prisma.salary.count({ where });
    }
    async endCurrentSalary(employeeId, endDate) {
        return this.prisma.salary.updateMany({
            where: {
                employeeId,
                isActive: true,
                OR: [
                    { endDate: null },
                    { endDate: { gte: new Date() } }
                ]
            },
            data: {
                endDate,
                isActive: false
            }
        });
    }
};
exports.SalaryRepository = SalaryRepository;
exports.SalaryRepository = SalaryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalaryRepository);
//# sourceMappingURL=salary.repository.js.map