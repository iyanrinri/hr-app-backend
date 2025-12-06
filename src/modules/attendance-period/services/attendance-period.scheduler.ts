import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AttendancePeriodScheduler implements OnModuleInit {
  private readonly logger = new Logger(AttendancePeriodScheduler.name);

  constructor(private prisma: PrismaService) {}

  // Runs immediately when the module is initialized (app startup)
  async onModuleInit() {
    this.logger.log('🚀 AttendancePeriodScheduler initialized - running startup check...');
    
    // Run the periods check immediately on startup
    await this.runPeriodsCheck();
    
    this.logger.log('✅ Startup periods check completed');
  }

  // Runs every hour to check for period transitions (deactivate expired & activate new ones)
  @Cron(CronExpression.EVERY_HOUR)
  async checkPeriodTransitions() {
    this.logger.log('🔄 Checking for attendance period transitions...');
    
    try {
      const now = new Date();
      
      // Step 1: Find and deactivate periods that should not be active
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

      // Step 2: Find and activate periods that should be active
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

      // Execute deactivations
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
          this.logger.log(
            `   ❌ Expired: "${period.name}" (ID: ${period.id}) - ended ${period.endDate.toISOString()}`
          );
        });

        upcomingButActive.forEach(period => {
          this.logger.log(
            `   ⏰ Too early: "${period.name}" (ID: ${period.id}) - starts ${period.startDate.toISOString()}`
          );
        });
      }

      // Execute activations
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
          this.logger.log(
            `   ✅ Started: "${period.name}" (ID: ${period.id}) - active from ${period.startDate.toISOString()} to ${period.endDate.toISOString()}`
          );
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

    } catch (error) {
      this.logger.error('❌ Error during period transitions:', error);
      throw error;
    }
  }

  // Manual method to run the transition check immediately (useful for testing)
  async runPeriodsCheck() {
    this.logger.log('🎛️  Running manual periods transition check...');
    const result = await this.checkPeriodTransitions();
    this.logger.log('✅ Manual check completed');
    return {
      ...result,
      timestamp: new Date(),
    };
  }

  // Get statistics about period status
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
}