export declare class HolidayResponseDto {
    id: string;
    name: string;
    date: string;
    isNational: boolean;
    isRecurring: boolean;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class AttendancePeriodResponseDto {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    workingDaysPerWeek: number;
    workingHoursPerDay: number;
    workingStartTime: string;
    workingEndTime: string;
    allowSaturdayWork: boolean;
    allowSundayWork: boolean;
    lateToleranceMinutes: number;
    earlyLeaveToleranceMinutes: number;
    isActive: boolean;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    holidays?: HolidayResponseDto[];
}
