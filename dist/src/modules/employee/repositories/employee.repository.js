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
exports.EmployeeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let EmployeeRepository = class EmployeeRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.employee.create({ data });
    }
    async findAll(params) {
        const { skip, take, cursor, where, orderBy } = params;
        const whereCondition = {
            ...where,
        };
        return this.prisma.employee.findMany({
            skip,
            take,
            cursor,
            where: whereCondition,
            orderBy,
            include: { user: true },
        });
    }
    async count(where) {
        const whereCondition = {
            ...where,
        };
        return this.prisma.employee.count({ where: whereCondition });
    }
    async findOne(where) {
        return this.prisma.employee.findFirst({
            where: {
                ...where,
                isDeleted: false,
                user: {
                    isDeleted: false,
                },
            },
            include: { user: true },
        });
    }
    async update(params) {
        const { where, data } = params;
        return this.prisma.employee.update({
            data,
            where,
        });
    }
    async softDelete(where) {
        const now = new Date();
        const employee = await this.prisma.employee.findUnique({
            where,
            include: { user: true },
        });
        if (!employee) {
            throw new Error('Employee not found');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: employee.userId },
                data: {
                    isDeleted: true,
                    deletedAt: now,
                },
            });
            return tx.employee.update({
                where,
                data: {
                    isDeleted: true,
                    deletedAt: now,
                },
            });
        });
    }
    async restore(where) {
        const employee = await this.prisma.employee.findFirst({
            where: {
                ...where,
                isDeleted: true,
            },
            include: { user: true },
        });
        if (!employee) {
            throw new Error('Employee not found or not deleted');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: employee.userId },
                data: {
                    isDeleted: false,
                    deletedAt: null,
                },
            });
            return tx.employee.update({
                where,
                data: {
                    isDeleted: false,
                    deletedAt: null,
                },
            });
        });
    }
};
exports.EmployeeRepository = EmployeeRepository;
exports.EmployeeRepository = EmployeeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployeeRepository);
//# sourceMappingURL=employee.repository.js.map