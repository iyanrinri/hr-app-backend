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
exports.AttendancePeriodRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
let AttendancePeriodRepository = class AttendancePeriodRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.attendancePeriod.create({
            data,
            include: {
                holidays: true,
            },
        });
    }
    async findAll(params) {
        return this.prisma.attendancePeriod.findMany({
            ...params,
            include: {
                holidays: true,
                _count: {
                    select: {
                        attendances: true,
                        attendanceLogs: true,
                    },
                },
            },
        });
    }
    async findOne(where) {
        return this.prisma.attendancePeriod.findUnique({
            where,
            include: {
                holidays: true,
                _count: {
                    select: {
                        attendances: true,
                        attendanceLogs: true,
                    },
                },
            },
        });
    }
    async update(params) {
        return this.prisma.attendancePeriod.update({
            ...params,
            include: {
                holidays: true,
            },
        });
    }
    async delete(where) {
        return this.prisma.attendancePeriod.delete({
            where,
        });
    }
    async count(where) {
        return this.prisma.attendancePeriod.count({ where });
    }
    async findActivePeriod() {
        const now = new Date();
        return this.prisma.attendancePeriod.findFirst({
            where: {
                isActive: true,
                startDate: { lte: now },
                endDate: { gte: now },
            },
            include: {
                holidays: true,
            },
        });
    }
    async createHoliday(data) {
        return this.prisma.holiday.create({
            data,
        });
    }
    async findHolidays(params) {
        return this.prisma.holiday.findMany({
            ...params,
            include: {
                attendancePeriod: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }
    async updateHoliday(params) {
        return this.prisma.holiday.update({
            ...params,
        });
    }
    async deleteHoliday(where) {
        return this.prisma.holiday.delete({
            where,
        });
    }
    async findHolidaysByDateRange(startDate, endDate, attendancePeriodId) {
        return this.prisma.holiday.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
                ...(attendancePeriodId && {
                    OR: [
                        { attendancePeriodId },
                        { attendancePeriodId: null, isNational: true },
                    ],
                }),
            },
        });
    }
};
exports.AttendancePeriodRepository = AttendancePeriodRepository;
exports.AttendancePeriodRepository = AttendancePeriodRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendancePeriodRepository);
//# sourceMappingURL=attendance-period.repository.js.map