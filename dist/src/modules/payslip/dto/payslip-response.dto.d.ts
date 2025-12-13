export declare class PayslipDeductionDto {
    id: string;
    type: string;
    description: string;
    amount: string;
}
export declare class PayslipResponseDto {
    id: string;
    payrollId: string;
    grossSalary: string;
    overtimePay: string;
    bonuses: string;
    allowances: string;
    taxAmount: string;
    bpjsKesehatanEmployee: string;
    bpjsKesehatanCompany: string;
    bpjsKetenagakerjaanEmployee: string;
    bpjsKetenagakerjaanCompany: string;
    otherDeductions: string;
    takeHomePay: string;
    taxCalculationDetails: any;
    generatedAt: string;
    generatedBy: string;
    pdfUrl?: string;
    createdAt: string;
    updatedAt: string;
    deductions?: PayslipDeductionDto[];
    constructor(partial: Partial<PayslipResponseDto>);
}
