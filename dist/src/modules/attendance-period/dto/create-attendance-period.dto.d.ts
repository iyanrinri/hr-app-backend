export declare class CreateAttendancePeriodDto {
    name: string;
    startDate: string;
    endDate: string;
    workingDaysPerWeek?: number;
    workingHoursPerDay?: number;
    workingStartTime?: string;
    workingEndTime?: string;
    allowSaturdayWork?: boolean;
    allowSundayWork?: boolean;
    lateToleranceMinutes?: number;
    earlyLeaveToleranceMinutes?: number;
    description?: string;
    isActive?: boolean;
}
