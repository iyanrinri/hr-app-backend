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
var AttendancePeriodScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendancePeriodScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../../database/prisma.service");
let AttendancePeriodScheduler = AttendancePeriodScheduler_1 = class AttendancePeriodScheduler {
    prisma;
    logger = new common_1.Logger(AttendancePeriodScheduler_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        this.logger.log('🚀 AttendancePeriodScheduler initialized - running startup check...');
        await this.runPeriodsCheck();
        this.logger.log('✅ Startup periods check completed');
    }
    async checkPeriodTransitions() {
        this.logger.log('🔄 Checking for attendance period transitions...');
        try {
            const now = new Date();
            const expiredPeriods = await this.prisma.attendancePeriod.findMany({
                where: {
                    isActive: true,
                    endDate: {
                        lt: now,
                    },
                },
            });
            const upcomingButActive = await this.prisma.attendancePeriod.findMany({
                where: {
                    isActive: true,
                    startDate: {
                        gt: now,
                    },
                },
            });
            const periodsToDeactivate = [...expiredPeriods, ...upcomingButActive];
            const periodsToActivate = await this.prisma.attendancePeriod.findMany({
                where: {
                    isActive: false,
                    startDate: {
                        lte: now,
                    },
                    endDate: {
                        gte: now,
                    },
                },
            });
            if (periodsToDeactivate.length > 0) {
                const deactivateResult = await this.prisma.attendancePeriod.updateMany({
                    where: {
                        id: {
                            in: periodsToDeactivate.map(period => period.id),
                        },
                    },
                    data: {
                        isActive: false,
                        updatedAt: now,
                    },
                });
                this.logger.log(`➖ Deactivated ${deactivateResult.count} periods`);
                expiredPeriods.forEach(period => {
                    this.logger.log(`   ❌ Expired: "${period.name}" (ID: ${period.id}) - ended ${period.endDate.toISOString()}`);
                });
                upcomingButActive.forEach(period => {
                    this.logger.log(`   ⏰ Too early: "${period.name}" (ID: ${period.id}) - starts ${period.startDate.toISOString()}`);
                });
            }
            if (periodsToActivate.length > 0) {
                const activateResult = await this.prisma.attendancePeriod.updateMany({
                    where: {
                        id: {
                            in: periodsToActivate.map(period => period.id),
                        },
                    },
                    data: {
                        isActive: true,
                        updatedAt: now,
                    },
                });
                this.logger.log(`➕ Activated ${activateResult.count} periods`);
                periodsToActivate.forEach(period => {
                    this.logger.log(`   ✅ Started: "${period.name}" (ID: ${period.id}) - active from ${period.startDate.toISOString()} to ${period.endDate.toISOString()}`);
                });
            }
            if (periodsToDeactivate.length === 0 && periodsToActivate.length === 0) {
                this.logger.log('✨ All periods are in correct status - no transitions needed');
            }
            return {
                deactivated: periodsToDeactivate.length,
                activated: periodsToActivate.length,
                message: 'Period transition check completed',
            };
        }
        catch (error) {
            this.logger.error('❌ Error during period transitions:', error);
            throw error;
        }
    }
    async runPeriodsCheck() {
        this.logger.log('🎛️  Running manual periods transition check...');
        const result = await this.checkPeriodTransitions();
        this.logger.log('✅ Manual check completed');
        return {
            ...result,
            timestamp: new Date(),
        };
    }
    async getPeriodStatusStats() {
        const now = new Date();
        const stats = await this.prisma.attendancePeriod.groupBy({
            by: ['isActive'],
            _count: {
                isActive: true,
            },
        });
        const activePeriods = await this.prisma.attendancePeriod.count({
            where: {
                isActive: true,
                startDate: { lte: now },
                endDate: { gte: now },
            },
        });
        const expiredButActive = await this.prisma.attendancePeriod.count({
            where: {
                isActive: true,
                endDate: { lt: now },
            },
        });
        const shouldBeActiveButNot = await this.prisma.attendancePeriod.count({
            where: {
                isActive: false,
                startDate: { lte: now },
                endDate: { gte: now },
            },
        });
        const upcomingButActive = await this.prisma.attendancePeriod.count({
            where: {
                isActive: true,
                startDate: { gt: now },
            },
        });
        return {
            totalActive: stats.find(s => s.isActive)?._count.isActive || 0,
            totalInactive: stats.find(s => !s.isActive)?._count.isActive || 0,
            currentlyValidActive: activePeriods,
            expiredButStillActive: expiredButActive,
            upcomingButIncorrectlyActive: upcomingButActive,
            shouldBeActiveButInactive: shouldBeActiveButNot,
            lastChecked: new Date(),
        };
    }
};
exports.AttendancePeriodScheduler = AttendancePeriodScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_HOUR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AttendancePeriodScheduler.prototype, "checkPeriodTransitions", null);
exports.AttendancePeriodScheduler = AttendancePeriodScheduler = AttendancePeriodScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendancePeriodScheduler);
//# sourceMappingURL=attendance-period.scheduler.js.map