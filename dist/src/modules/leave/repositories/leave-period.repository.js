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
exports.LeavePeriodRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let LeavePeriodRepository = class LeavePeriodRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.leavePeriod.create({ data });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params || {};
        return this.prisma.leavePeriod.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                leaveTypes: true,
                _count: {
                    select: {
                        leaveBalances: true,
                        leaveRequests: true
                    }
                }
            },
        });
    }
    async findById(id) {
        return this.prisma.leavePeriod.findUnique({
            where: { id },
            include: {
                leaveTypes: true,
                leaveBalances: {
                    include: {
                        employee: {
                            select: { id: true, firstName: true, lastName: true, department: true }
                        }
                    }
                }
            },
        });
    }
    async findActive() {
        return this.prisma.leavePeriod.findFirst({
            where: { isActive: true },
            include: {
                leaveTypes: {
                    where: { isActive: true }
                }
            },
        });
    }
    async update(id, data) {
        return this.prisma.leavePeriod.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.leavePeriod.delete({
            where: { id },
        });
    }
    async count(where) {
        return this.prisma.leavePeriod.count({ where });
    }
};
exports.LeavePeriodRepository = LeavePeriodRepository;
exports.LeavePeriodRepository = LeavePeriodRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LeavePeriodRepository);
//# sourceMappingURL=leave-period.repository.js.map