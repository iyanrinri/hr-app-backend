export declare class CreatePayrollDto {
    employeeId: string;
    periodStart: string;
    periodEnd: string;
    deductions?: string;
    bonuses?: string;
    overtimeRequestIds?: string[];
}
export declare class ProcessPayrollDto {
    payrollIds: string[];
}
