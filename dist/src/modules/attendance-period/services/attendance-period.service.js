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
exports.AttendancePeriodService = void 0;
const common_1 = require("@nestjs/common");
const attendance_period_repository_1 = require("../repositories/attendance-period.repository");
let AttendancePeriodService = class AttendancePeriodService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async create(createDto, userId) {
        const startDate = new Date(createDto.startDate);
        const endDate = new Date(createDto.endDate);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const overlapping = await this.repository.findAll({
            where: {
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate },
                    },
                ],
            },
        });
        if (overlapping.length > 0) {
            throw new common_1.ConflictException('Attendance period overlaps with existing period');
        }
        const createdPeriod = await this.repository.create({
            name: createDto.name,
            startDate,
            endDate,
            workingDaysPerWeek: createDto.workingDaysPerWeek || 5,
            workingHoursPerDay: createDto.workingHoursPerDay || 8,
            workingStartTime: createDto.workingStartTime || "09:00",
            workingEndTime: createDto.workingEndTime || "17:00",
            allowSaturdayWork: createDto.allowSaturdayWork ?? false,
            allowSundayWork: createDto.allowSundayWork ?? false,
            lateToleranceMinutes: createDto.lateToleranceMinutes ?? 15,
            earlyLeaveToleranceMinutes: createDto.earlyLeaveToleranceMinutes ?? 15,
            description: createDto.description,
            isActive: createDto.isActive ?? true,
            createdBy: BigInt(userId),
        });
        return this.transformPeriod(createdPeriod);
    }
    async findAll(query) {
        let whereCondition = {};
        if (query.search) {
            whereCondition.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }
        if (query.isActive !== undefined) {
            whereCondition.isActive = query.isActive;
        }
        if (query.page && query.limit) {
            const page = query.page;
            const limit = query.limit;
            const skip = (page - 1) * limit;
            const total = await this.repository.count(whereCondition);
            const periods = await this.repository.findAll({
                skip,
                take: limit,
                where: whereCondition,
                orderBy: { startDate: 'desc' },
            });
            return {
                data: this.transformPeriods(periods),
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                },
            };
        }
        else {
            const periods = await this.repository.findAll({
                where: whereCondition,
                orderBy: { startDate: 'desc' },
            });
            return this.transformPeriods(periods);
        }
    }
    async findOne(id) {
        const period = await this.repository.findOne({ id });
        if (!period) {
            throw new common_1.NotFoundException('Attendance period not found');
        }
        return this.transformPeriod(period);
    }
    async update(id, updateDto) {
        const existingPeriod = await this.repository.findOne({ id });
        if (!existingPeriod) {
            throw new common_1.NotFoundException('Attendance period not found');
        }
        const updateData = {};
        if (updateDto.name !== undefined)
            updateData.name = updateDto.name;
        if (updateDto.description !== undefined)
            updateData.description = updateDto.description;
        if (updateDto.isActive !== undefined)
            updateData.isActive = updateDto.isActive;
        if (updateDto.workingDaysPerWeek !== undefined)
            updateData.workingDaysPerWeek = updateDto.workingDaysPerWeek;
        if (updateDto.workingHoursPerDay !== undefined)
            updateData.workingHoursPerDay = updateDto.workingHoursPerDay;
        if (updateDto.workingStartTime !== undefined)
            updateData.workingStartTime = updateDto.workingStartTime;
        if (updateDto.workingEndTime !== undefined)
            updateData.workingEndTime = updateDto.workingEndTime;
        if (updateDto.allowSaturdayWork !== undefined)
            updateData.allowSaturdayWork = updateDto.allowSaturdayWork;
        if (updateDto.allowSundayWork !== undefined)
            updateData.allowSundayWork = updateDto.allowSundayWork;
        if (updateDto.lateToleranceMinutes !== undefined)
            updateData.lateToleranceMinutes = updateDto.lateToleranceMinutes;
        if (updateDto.earlyLeaveToleranceMinutes !== undefined)
            updateData.earlyLeaveToleranceMinutes = updateDto.earlyLeaveToleranceMinutes;
        if (updateDto.startDate || updateDto.endDate) {
            const startDate = updateDto.startDate ? new Date(updateDto.startDate) : existingPeriod.startDate;
            const endDate = updateDto.endDate ? new Date(updateDto.endDate) : existingPeriod.endDate;
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('Start date must be before end date');
            }
            updateData.startDate = startDate;
            updateData.endDate = endDate;
            const overlapping = await this.repository.findAll({
                where: {
                    id: { not: id },
                    OR: [
                        {
                            startDate: { lte: endDate },
                            endDate: { gte: startDate },
                        },
                    ],
                },
            });
            if (overlapping.length > 0) {
                throw new common_1.ConflictException('Updated attendance period would overlap with existing period');
            }
        }
        const updated = await this.repository.update({
            where: { id },
            data: updateData,
        });
        return this.transformPeriod(updated);
    }
    async remove(id) {
        const period = await this.repository.findOne({ id });
        if (!period) {
            throw new common_1.NotFoundException('Attendance period not found');
        }
        const periodWithCounts = period;
        if (periodWithCounts._count?.attendances > 0 || periodWithCounts._count?.attendanceLogs > 0) {
            throw new common_1.BadRequestException('Cannot delete attendance period with existing attendance records');
        }
        await this.repository.delete({ id });
        return { message: 'Attendance period deleted successfully' };
    }
    async getActivePeriod() {
        const activePeriod = await this.repository.findActivePeriod();
        if (!activePeriod) {
            throw new common_1.NotFoundException('No active attendance period found');
        }
        return this.transformPeriod(activePeriod);
    }
    async createHoliday(createDto) {
        const holidayDate = new Date(createDto.date);
        if (createDto.attendancePeriodId) {
            const period = await this.repository.findOne({ id: createDto.attendancePeriodId });
            if (!period) {
                throw new common_1.NotFoundException('Attendance period not found');
            }
        }
        return await this.repository.createHoliday({
            name: createDto.name,
            date: holidayDate,
            isNational: createDto.isNational || false,
            isRecurring: createDto.isRecurring || false,
            description: createDto.description,
            ...(createDto.attendancePeriodId && {
                attendancePeriod: {
                    connect: { id: createDto.attendancePeriodId },
                },
            }),
        });
    }
    async findHolidays(attendancePeriodId) {
        const holidays = await this.repository.findHolidays({
            where: attendancePeriodId
                ? {
                    OR: [
                        { attendancePeriodId },
                        { attendancePeriodId: null, isNational: true },
                    ],
                }
                : undefined,
            orderBy: { date: 'asc' },
        });
        return holidays.map((holiday) => ({
            ...holiday,
            id: holiday.id.toString(),
            attendancePeriodId: holiday.attendancePeriodId?.toString() || null,
            date: holiday.date.toISOString(),
            createdAt: holiday.createdAt.toISOString(),
            updatedAt: holiday.updatedAt.toISOString(),
        }));
    }
    async updateHoliday(id, updateData) {
        const existingHoliday = await this.repository.findHolidays({
            where: { id },
        });
        if (existingHoliday.length === 0) {
            throw new common_1.NotFoundException('Holiday not found');
        }
        const data = {};
        if (updateData.name !== undefined)
            data.name = updateData.name;
        if (updateData.date !== undefined)
            data.date = new Date(updateData.date);
        if (updateData.isNational !== undefined)
            data.isNational = updateData.isNational;
        if (updateData.isRecurring !== undefined)
            data.isRecurring = updateData.isRecurring;
        if (updateData.description !== undefined)
            data.description = updateData.description;
        return await this.repository.updateHoliday({
            where: { id },
            data,
        });
    }
    async deleteHoliday(id) {
        const existing = await this.repository.findHolidays({
            where: { id },
        });
        if (existing.length === 0) {
            throw new common_1.NotFoundException('Holiday not found');
        }
        await this.repository.deleteHoliday({ id });
        return { message: 'Holiday deleted successfully' };
    }
    async isWorkingDay(date, attendancePeriodId) {
        let periodConfig;
        if (attendancePeriodId) {
            periodConfig = await this.repository.findOne({ id: attendancePeriodId });
        }
        else {
            periodConfig = await this.getActivePeriod();
        }
        if (!periodConfig) {
            throw new Error('No attendance period found');
        }
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 && !periodConfig.allowSundayWork) {
            return false;
        }
        if (dayOfWeek === 6 && !periodConfig.allowSaturdayWork) {
            return false;
        }
        const holidays = await this.repository.findHolidaysByDateRange(date, date, attendancePeriodId);
        return holidays.length === 0;
    }
    transformPeriods(periods) {
        return periods.map(period => this.transformPeriod(period));
    }
    transformPeriod(period) {
        return {
            id: period.id.toString(),
            name: period.name,
            startDate: period.startDate instanceof Date ? period.startDate.toISOString() : period.startDate,
            endDate: period.endDate instanceof Date ? period.endDate.toISOString() : period.endDate,
            workingDaysPerWeek: period.workingDaysPerWeek,
            workingHoursPerDay: period.workingHoursPerDay,
            workingStartTime: period.workingStartTime || "09:00",
            workingEndTime: period.workingEndTime || "17:00",
            allowSaturdayWork: period.allowSaturdayWork || false,
            allowSundayWork: period.allowSundayWork || false,
            lateToleranceMinutes: period.lateToleranceMinutes || 15,
            earlyLeaveToleranceMinutes: period.earlyLeaveToleranceMinutes || 15,
            isActive: period.isActive,
            description: period.description,
            createdBy: period.createdBy.toString(),
            createdAt: period.createdAt instanceof Date ? period.createdAt.toISOString() : period.createdAt,
            updatedAt: period.updatedAt instanceof Date ? period.updatedAt.toISOString() : period.updatedAt,
            holidays: period.holidays?.map((holiday) => ({
                ...holiday,
                id: holiday.id.toString(),
                date: holiday.date instanceof Date ? holiday.date.toISOString() : holiday.date,
                createdAt: holiday.createdAt instanceof Date ? holiday.createdAt.toISOString() : holiday.createdAt,
                updatedAt: holiday.updatedAt instanceof Date ? holiday.updatedAt.toISOString() : holiday.updatedAt,
            })),
        };
    }
};
exports.AttendancePeriodService = AttendancePeriodService;
exports.AttendancePeriodService = AttendancePeriodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_period_repository_1.AttendancePeriodRepository])
], AttendancePeriodService);
//# sourceMappingURL=attendance-period.service.js.map