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
    isActive: boolean;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    holidays?: HolidayResponseDto[];
}
