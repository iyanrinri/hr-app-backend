export declare enum SalaryChangeType {
    INITIAL = "INITIAL",
    PROMOTION = "PROMOTION",
    GRADE_ADJUSTMENT = "GRADE_ADJUSTMENT",
    PERFORMANCE_INCREASE = "PERFORMANCE_INCREASE",
    MARKET_ADJUSTMENT = "MARKET_ADJUSTMENT",
    DEPARTMENT_TRANSFER = "DEPARTMENT_TRANSFER",
    POSITION_CHANGE = "POSITION_CHANGE",
    ANNUAL_INCREMENT = "ANNUAL_INCREMENT"
}
export declare class CreateSalaryHistoryDto {
    employeeId: number;
    changeType: SalaryChangeType;
    oldBaseSalary?: number;
    newBaseSalary: number;
    oldGrade?: string;
    newGrade?: string;
    oldPosition?: string;
    newPosition?: string;
    oldDepartment?: string;
    newDepartment?: string;
    reason: string;
    effectiveDate: string;
    approvedBy?: number;
}
