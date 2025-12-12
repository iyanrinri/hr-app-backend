export declare enum PayrollStatus {
    PENDING = "PENDING",
    PROCESSED = "PROCESSED",
    PAID = "PAID"
}
export declare class PayrollQueryDto {
    employeeId?: string;
    department?: string;
    periodStartFrom?: string;
    periodStartTo?: string;
    periodEndFrom?: string;
    periodEndTo?: string;
    status?: PayrollStatus;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
