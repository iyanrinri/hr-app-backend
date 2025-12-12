export declare class PayrollDto {
    id: string;
    employeeId: string;
    periodStart: Date;
    periodEnd: Date;
    baseSalary: string;
    overtimePay: string;
    deductions: string;
    bonuses: string;
    grossSalary: string;
    netSalary: string;
    overtimeHours: string;
    regularHours: string;
    isPaid: boolean;
    processedAt?: Date;
    processedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: {
        id: string;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
    };
    processor?: {
        id: string;
        email: string;
    };
}
export declare class PayrollListResponseDto {
    data: PayrollDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
