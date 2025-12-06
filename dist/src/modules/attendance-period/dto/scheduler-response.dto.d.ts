export declare class SchedulerStatsResponseDto {
    totalActive: number;
    totalInactive: number;
    currentlyValidActive: number;
    expiredButStillActive: number;
    shouldBeActiveButInactive: number;
    lastChecked: Date;
}
export declare class SchedulerRunResponseDto {
    status: string;
    message: string;
    timestamp: Date;
}
export declare class SchedulerStatsWrapperDto {
    status: string;
    data: SchedulerStatsResponseDto;
}
