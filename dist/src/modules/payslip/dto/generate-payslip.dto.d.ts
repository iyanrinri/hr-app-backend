export declare enum JKKRiskCategory {
    LOW = "LOW",
    MEDIUM_LOW = "MEDIUM_LOW",
    MEDIUM = "MEDIUM",
    MEDIUM_HIGH = "MEDIUM_HIGH",
    HIGH = "HIGH"
}
export declare class GeneratePayslipDto {
    payrollId: number;
    jkkRiskCategory?: JKKRiskCategory;
    dependents?: number;
    additionalAllowances?: number;
    otherDeductions?: number;
}
