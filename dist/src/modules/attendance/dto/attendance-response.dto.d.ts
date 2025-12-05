export declare class LocationDto {
    latitude: number;
    longitude: number;
    address?: string;
}
export declare class AttendanceLogResponseDto {
    id: string;
    type: 'CLOCK_IN' | 'CLOCK_OUT';
    timestamp: string;
    location: LocationDto;
    ipAddress?: string;
    userAgent?: string;
    notes?: string;
    createdAt: string;
}
export declare class AttendanceResponseDto {
    id: string;
    employeeId: string;
    attendancePeriodId: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    checkInLocation?: LocationDto;
    checkOutLocation?: LocationDto;
    workDuration?: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
    notes?: string;
    createdAt: string;
    updatedAt: string;
    logs?: AttendanceLogResponseDto[];
}
export declare class ClockActionResponseDto {
    status: string;
    message: string;
    log: AttendanceLogResponseDto;
    attendance: AttendanceResponseDto;
}
