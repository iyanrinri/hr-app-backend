export declare class AttendanceHistoryDto {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    employeeId?: bigint;
    status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}
