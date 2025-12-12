export declare class CreateSalaryDto {
    employeeId: number;
    baseSalary: number;
    allowances?: number;
    grade?: string;
    effectiveDate: string;
    endDate?: string;
    isActive?: boolean;
    notes?: string;
    createdBy: number;
}
