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
exports.LeavePeriodService = void 0;
const common_1 = require("@nestjs/common");
const leave_period_repository_1 = require("../repositories/leave-period.repository");
const leave_type_repository_1 = require("../repositories/leave-type.repository");
const client_1 = require("@prisma/client");
let LeavePeriodService = class LeavePeriodService {
    repository;
    leaveTypeRepository;
    constructor(repository, leaveTypeRepository) {
        this.repository = repository;
        this.leaveTypeRepository = leaveTypeRepository;
    }
    async create(createDto, userId) {
        const startDate = new Date(createDto.startDate);
        const endDate = new Date(createDto.endDate);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const existingPeriods = await this.repository.findAll({
            where: {
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate }
                    }
                ]
            }
        });
        if (existingPeriods.length > 0) {
            throw new common_1.ConflictException('Leave period overlaps with existing period');
        }
        return this.repository.create({
            name: createDto.name,
            startDate,
            endDate,
            description: createDto.description,
            createdBy: userId,
        });
    }
    async findAll(params) {
        const { page = 1, limit = 10, activeOnly = false } = params || {};
        const skip = (page - 1) * limit;
        const where = activeOnly ? { isActive: true } : undefined;
        const [periods, total] = await Promise.all([
            this.repository.findAll({
                skip,
                take: limit,
                where,
                orderBy: { startDate: 'desc' }
            }),
            this.repository.count(where)
        ]);
        return {
            data: periods.map(period => this.transformPeriod(period)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findById(id) {
        const period = await this.repository.findById(id);
        if (!period) {
            throw new common_1.NotFoundException('Leave period not found');
        }
        return this.transformPeriod(period);
    }
    async findActive() {
        const period = await this.repository.findActive();
        if (!period) {
            throw new common_1.NotFoundException('No active leave period found');
        }
        return this.transformPeriod(period);
    }
    async update(id, updateDto) {
        const existingPeriod = await this.repository.findById(id);
        if (!existingPeriod) {
            throw new common_1.NotFoundException('Leave period not found');
        }
        const updateData = {};
        if (updateDto.name)
            updateData.name = updateDto.name;
        if (updateDto.description !== undefined)
            updateData.description = updateDto.description;
        if (updateDto.isActive !== undefined)
            updateData.isActive = updateDto.isActive;
        if (updateDto.startDate || updateDto.endDate) {
            const startDate = updateDto.startDate ? new Date(updateDto.startDate) : existingPeriod.startDate;
            const endDate = updateDto.endDate ? new Date(updateDto.endDate) : existingPeriod.endDate;
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('Start date must be before end date');
            }
            updateData.startDate = startDate;
            updateData.endDate = endDate;
        }
        const updatedPeriod = await this.repository.update(id, updateData);
        return this.transformPeriod(updatedPeriod);
    }
    async delete(id) {
        const period = await this.repository.findById(id);
        if (!period) {
            throw new common_1.NotFoundException('Leave period not found');
        }
        if (period.leaveBalances.length > 0) {
            throw new common_1.BadRequestException('Cannot delete period with existing leave balances');
        }
        await this.repository.delete(id);
        return { message: 'Leave period deleted successfully' };
    }
    transformPeriod(period) {
        return {
            id: Number(period.id),
            name: period.name,
            startDate: period.startDate.toISOString().split('T')[0],
            endDate: period.endDate.toISOString().split('T')[0],
            isActive: period.isActive,
            description: period.description,
            createdBy: Number(period.createdBy),
            createdAt: period.createdAt.toISOString(),
            updatedAt: period.updatedAt.toISOString(),
            leaveTypes: period.leaveTypes?.map((lt) => ({
                id: Number(lt.id),
                type: lt.type,
                name: lt.name,
                defaultQuota: lt.defaultQuota,
                isActive: lt.isActive
            })) || [],
            stats: {
                totalEmployeesWithBalances: period._count?.leaveBalances || 0,
                totalLeaveRequests: period._count?.leaveRequests || 0
            }
        };
    }
    async setupDefaultLeaveTypes(periodId) {
        const period = await this.repository.findById(BigInt(periodId));
        if (!period) {
            throw new common_1.NotFoundException(`Leave period with ID ${periodId} not found`);
        }
        const defaultConfigs = [
            {
                type: client_1.LeaveType.ANNUAL,
                name: 'Annual Leave',
                description: 'Yearly vacation leave entitlement',
                defaultQuota: 12,
                maxConsecutiveDays: 14,
                advanceNoticeDays: 3,
                isCarryForward: true,
                maxCarryForward: 6,
                isActive: true
            },
            {
                type: client_1.LeaveType.SICK,
                name: 'Sick Leave',
                description: 'Medical leave for illness or injury',
                defaultQuota: 12,
                maxConsecutiveDays: 7,
                advanceNoticeDays: 0,
                isCarryForward: false,
                maxCarryForward: 0,
                isActive: true
            },
            {
                type: client_1.LeaveType.EMERGENCY,
                name: 'Emergency Leave',
                description: 'Urgent family or personal emergency leave',
                defaultQuota: 2,
                maxConsecutiveDays: 2,
                advanceNoticeDays: 0,
                isCarryForward: false,
                maxCarryForward: 0,
                isActive: true
            },
            {
                type: client_1.LeaveType.MATERNITY,
                name: 'Maternity Leave',
                description: 'Maternity leave for mothers',
                defaultQuota: 90,
                maxConsecutiveDays: 90,
                advanceNoticeDays: 30,
                isCarryForward: false,
                maxCarryForward: 0,
                isActive: true
            },
            {
                type: client_1.LeaveType.PATERNITY,
                name: 'Paternity Leave',
                description: 'Paternity leave for fathers',
                defaultQuota: 14,
                maxConsecutiveDays: 14,
                advanceNoticeDays: 14,
                isCarryForward: false,
                maxCarryForward: 0,
                isActive: true
            }
        ];
        let createdCount = 0;
        for (const config of defaultConfigs) {
            const existing = await this.leaveTypeRepository.findByTypeAndPeriod(config.type, BigInt(periodId));
            if (!existing) {
                const createData = {
                    ...config,
                    leavePeriod: {
                        connect: { id: BigInt(periodId) }
                    }
                };
                await this.leaveTypeRepository.create(createData);
                createdCount++;
            }
        }
        return {
            message: `Default leave type configurations setup completed`,
            count: createdCount
        };
    }
};
exports.LeavePeriodService = LeavePeriodService;
exports.LeavePeriodService = LeavePeriodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leave_period_repository_1.LeavePeriodRepository,
        leave_type_repository_1.LeaveTypeRepository])
], LeavePeriodService);
//# sourceMappingURL=leave-period.service.js.map