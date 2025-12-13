import { PrismaService } from '../../../database/prisma.service';
export interface BPJSCalculationResult {
    bpjsKesehatanEmployee: number;
    bpjsKesehatanCompany: number;
    bpjsKesehatanTotal: number;
    jhtEmployee: number;
    jhtCompany: number;
    jpEmployee: number;
    jpCompany: number;
    jkkCompany: number;
    jkmCompany: number;
    bpjsKetenagakerjaanEmployee: number;
    bpjsKetenagakerjaanCompany: number;
    bpjsKetenagakerjaanTotal: number;
    totalEmployeeDeduction: number;
    totalCompanyContribution: number;
    totalBPJS: number;
    grossSalaryUsed: number;
    kesehatanMaxSalaryCap: number;
    jpMaxSalaryCap: number;
    jkkRiskCategory: string;
}
export interface BPJSConfig {
    kesehatanEmployeeRate: number;
    kesehatanCompanyRate: number;
    kesehatanMaxSalary: number;
    jhtEmployeeRate: number;
    jhtCompanyRate: number;
    jpEmployeeRate: number;
    jpCompanyRate: number;
    jpMaxSalary: number;
    jkkRate: number;
    jkmCompanyRate: number;
}
export declare class BPJSCalculationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculateBPJS(monthlyGrossSalary: number, jkkRiskCategory?: 'LOW' | 'MEDIUM' | 'HIGH'): Promise<BPJSCalculationResult>;
    private getBPJSConfig;
    getJKKRate(riskCategory: 'LOW' | 'MEDIUM_LOW' | 'MEDIUM' | 'MEDIUM_HIGH' | 'HIGH'): Promise<number>;
}
