export declare enum OvertimeStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare const getOvertimeSettings: () => {
    maxHoursPerDay: number;
    maxHoursPerWeek: number;
    maxHoursPerMonth: number;
    weekdayRate: number;
    weekendRate: number;
    holidayRate: number;
    requiresApproval: boolean;
    managerApprovalRequired: boolean;
    hrApprovalRequired: boolean;
};
