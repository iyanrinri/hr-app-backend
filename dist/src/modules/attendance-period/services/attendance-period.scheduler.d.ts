import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
export declare class AttendancePeriodScheduler implements OnModuleInit {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    checkPeriodTransitions(): Promise<{
        deactivated: number;
        activated: number;
        message: string;
    }>;
    runPeriodsCheck(): Promise<{
        timestamp: Date;
        deactivated: number;
        activated: number;
        message: string;
    }>;
    getPeriodStatusStats(): Promise<{
        totalActive: number;
        totalInactive: number;
        currentlyValidActive: number;
        expiredButStillActive: number;
        upcomingButIncorrectlyActive: number;
        shouldBeActiveButInactive: number;
        lastChecked: Date;
    }>;
}
