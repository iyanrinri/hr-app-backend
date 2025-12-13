import { PrismaService } from '../../../database/prisma.service';
export interface TaxCalculationResult {
    annualGrossSalary: number;
    ptkp: number;
    taxableIncome: number;
    annualTax: number;
    monthlyTax: number;
    taxDetails: {
        bracket: number;
        income: number;
        rate: number;
        tax: number;
    }[];
    ptkpCategory: string;
}
export interface PTKPConfig {
    TK_0: number;
    TK_1: number;
    TK_2: number;
    TK_3: number;
    K_0: number;
    K_1: number;
    K_2: number;
    K_3: number;
}
export interface TaxBracket {
    limit: number | null;
    rate: number;
}
export declare class TaxCalculationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculatePPh21(monthlyGrossSalary: number, maritalStatus: 'SINGLE' | 'MARRIED' | null, dependents?: number): Promise<TaxCalculationResult>;
    private getPTKPConfig;
    private getTaxBrackets;
    private determinePTKPCategory;
    private getPTKP;
    private calculateProgressiveTax;
    calculateTaxForEmployee(employeeId: bigint, monthlyGrossSalary: number): Promise<TaxCalculationResult>;
}
