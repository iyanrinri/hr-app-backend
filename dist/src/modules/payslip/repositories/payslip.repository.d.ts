import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class PayslipRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PayslipCreateInput): Promise<{
        payroll: {
            employee: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
                department: string;
                employeeNumber: string | null;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            employeeId: bigint;
            baseSalary: Prisma.Decimal;
            periodStart: Date;
            periodEnd: Date;
            overtimePay: Prisma.Decimal;
            deductions: Prisma.Decimal;
            bonuses: Prisma.Decimal;
            grossSalary: Prisma.Decimal;
            netSalary: Prisma.Decimal;
            overtimeHours: Prisma.Decimal;
            regularHours: Prisma.Decimal;
            isPaid: boolean;
            processedAt: Date | null;
            processedBy: bigint | null;
        };
        deductions: {
            id: bigint;
            createdAt: Date;
            description: string;
            type: string;
            amount: Prisma.Decimal;
            payslipId: bigint;
        }[];
        generator: {
            id: bigint;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        allowances: Prisma.Decimal;
        overtimePay: Prisma.Decimal;
        bonuses: Prisma.Decimal;
        grossSalary: Prisma.Decimal;
        taxAmount: Prisma.Decimal;
        bpjsKesehatanEmployee: Prisma.Decimal;
        bpjsKesehatanCompany: Prisma.Decimal;
        bpjsKetenagakerjaanEmployee: Prisma.Decimal;
        bpjsKetenagakerjaanCompany: Prisma.Decimal;
        otherDeductions: Prisma.Decimal;
        takeHomePay: Prisma.Decimal;
        taxCalculationDetails: Prisma.JsonValue | null;
        generatedAt: Date;
        pdfUrl: string | null;
        payrollId: bigint;
        generatedBy: bigint;
    }>;
    findOne(id: bigint): Promise<({
        payroll: {
            employee: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
                department: string;
                employeeNumber: string | null;
                maritalStatus: import("@prisma/client").$Enums.MaritalStatus | null;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            employeeId: bigint;
            baseSalary: Prisma.Decimal;
            periodStart: Date;
            periodEnd: Date;
            overtimePay: Prisma.Decimal;
            deductions: Prisma.Decimal;
            bonuses: Prisma.Decimal;
            grossSalary: Prisma.Decimal;
            netSalary: Prisma.Decimal;
            overtimeHours: Prisma.Decimal;
            regularHours: Prisma.Decimal;
            isPaid: boolean;
            processedAt: Date | null;
            processedBy: bigint | null;
        };
        deductions: {
            id: bigint;
            createdAt: Date;
            description: string;
            type: string;
            amount: Prisma.Decimal;
            payslipId: bigint;
        }[];
        generator: {
            id: bigint;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        allowances: Prisma.Decimal;
        overtimePay: Prisma.Decimal;
        bonuses: Prisma.Decimal;
        grossSalary: Prisma.Decimal;
        taxAmount: Prisma.Decimal;
        bpjsKesehatanEmployee: Prisma.Decimal;
        bpjsKesehatanCompany: Prisma.Decimal;
        bpjsKetenagakerjaanEmployee: Prisma.Decimal;
        bpjsKetenagakerjaanCompany: Prisma.Decimal;
        otherDeductions: Prisma.Decimal;
        takeHomePay: Prisma.Decimal;
        taxCalculationDetails: Prisma.JsonValue | null;
        generatedAt: Date;
        pdfUrl: string | null;
        payrollId: bigint;
        generatedBy: bigint;
    }) | null>;
    findByPayrollId(payrollId: bigint): Promise<({
        payroll: {
            employee: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
                department: string;
                employeeNumber: string | null;
                maritalStatus: import("@prisma/client").$Enums.MaritalStatus | null;
            };
        } & {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            employeeId: bigint;
            baseSalary: Prisma.Decimal;
            periodStart: Date;
            periodEnd: Date;
            overtimePay: Prisma.Decimal;
            deductions: Prisma.Decimal;
            bonuses: Prisma.Decimal;
            grossSalary: Prisma.Decimal;
            netSalary: Prisma.Decimal;
            overtimeHours: Prisma.Decimal;
            regularHours: Prisma.Decimal;
            isPaid: boolean;
            processedAt: Date | null;
            processedBy: bigint | null;
        };
        deductions: {
            id: bigint;
            createdAt: Date;
            description: string;
            type: string;
            amount: Prisma.Decimal;
            payslipId: bigint;
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        allowances: Prisma.Decimal;
        overtimePay: Prisma.Decimal;
        bonuses: Prisma.Decimal;
        grossSalary: Prisma.Decimal;
        taxAmount: Prisma.Decimal;
        bpjsKesehatanEmployee: Prisma.Decimal;
        bpjsKesehatanCompany: Prisma.Decimal;
        bpjsKetenagakerjaanEmployee: Prisma.Decimal;
        bpjsKetenagakerjaanCompany: Prisma.Decimal;
        otherDeductions: Prisma.Decimal;
        takeHomePay: Prisma.Decimal;
        taxCalculationDetails: Prisma.JsonValue | null;
        generatedAt: Date;
        pdfUrl: string | null;
        payrollId: bigint;
        generatedBy: bigint;
    }) | null>;
    findByEmployeeId(employeeId: bigint, limit?: number): Promise<({
        payroll: {
            baseSalary: Prisma.Decimal;
            periodStart: Date;
            periodEnd: Date;
            overtimePay: Prisma.Decimal;
            bonuses: Prisma.Decimal;
        };
        deductions: {
            id: bigint;
            createdAt: Date;
            description: string;
            type: string;
            amount: Prisma.Decimal;
            payslipId: bigint;
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        allowances: Prisma.Decimal;
        overtimePay: Prisma.Decimal;
        bonuses: Prisma.Decimal;
        grossSalary: Prisma.Decimal;
        taxAmount: Prisma.Decimal;
        bpjsKesehatanEmployee: Prisma.Decimal;
        bpjsKesehatanCompany: Prisma.Decimal;
        bpjsKetenagakerjaanEmployee: Prisma.Decimal;
        bpjsKetenagakerjaanCompany: Prisma.Decimal;
        otherDeductions: Prisma.Decimal;
        takeHomePay: Prisma.Decimal;
        taxCalculationDetails: Prisma.JsonValue | null;
        generatedAt: Date;
        pdfUrl: string | null;
        payrollId: bigint;
        generatedBy: bigint;
    })[]>;
    createDeduction(data: Prisma.PayrollDeductionCreateInput): Promise<{
        id: bigint;
        createdAt: Date;
        description: string;
        type: string;
        amount: Prisma.Decimal;
        payslipId: bigint;
    }>;
    createManyDeductions(data: Prisma.PayrollDeductionCreateManyInput[]): Promise<Prisma.BatchPayload>;
    delete(id: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        allowances: Prisma.Decimal;
        overtimePay: Prisma.Decimal;
        bonuses: Prisma.Decimal;
        grossSalary: Prisma.Decimal;
        taxAmount: Prisma.Decimal;
        bpjsKesehatanEmployee: Prisma.Decimal;
        bpjsKesehatanCompany: Prisma.Decimal;
        bpjsKetenagakerjaanEmployee: Prisma.Decimal;
        bpjsKetenagakerjaanCompany: Prisma.Decimal;
        otherDeductions: Prisma.Decimal;
        takeHomePay: Prisma.Decimal;
        taxCalculationDetails: Prisma.JsonValue | null;
        generatedAt: Date;
        pdfUrl: string | null;
        payrollId: bigint;
        generatedBy: bigint;
    }>;
    updatePdfUrl(id: bigint, pdfUrl: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        allowances: Prisma.Decimal;
        overtimePay: Prisma.Decimal;
        bonuses: Prisma.Decimal;
        grossSalary: Prisma.Decimal;
        taxAmount: Prisma.Decimal;
        bpjsKesehatanEmployee: Prisma.Decimal;
        bpjsKesehatanCompany: Prisma.Decimal;
        bpjsKetenagakerjaanEmployee: Prisma.Decimal;
        bpjsKetenagakerjaanCompany: Prisma.Decimal;
        otherDeductions: Prisma.Decimal;
        takeHomePay: Prisma.Decimal;
        taxCalculationDetails: Prisma.JsonValue | null;
        generatedAt: Date;
        pdfUrl: string | null;
        payrollId: bigint;
        generatedBy: bigint;
    }>;
}
