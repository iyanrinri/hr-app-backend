import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PayrollQueryDto } from '../dto/payroll-query.dto';
export declare class PayrollRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PayrollCreateInput): Promise<{
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
        };
        processor: {
            id: bigint;
            email: string;
        } | null;
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
    }>;
    findMany(query: PayrollQueryDto): Promise<{
        data: ({
            employee: {
                id: bigint;
                firstName: string;
                lastName: string;
                position: string;
                department: string;
            };
            processor: {
                id: bigint;
                email: string;
            } | null;
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<({
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
        };
        processor: {
            id: bigint;
            email: string;
        } | null;
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
    }) | null>;
    findByEmployeeAndPeriod(employeeId: string, periodStart: Date, periodEnd: Date): Promise<{
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
    } | null>;
    update(id: string, data: Prisma.PayrollUpdateInput): Promise<{
        employee: {
            id: bigint;
            firstName: string;
            lastName: string;
            position: string;
            department: string;
        };
        processor: {
            id: bigint;
            email: string;
        } | null;
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
    }>;
    updateMany(ids: string[], data: Prisma.PayrollUpdateInput): Promise<Prisma.BatchPayload>;
    delete(id: string): Promise<{
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
    }>;
    getPayrollSummary(employeeId?: string): Promise<{
        totalPayrolls: number;
        totalBaseSalary: string;
        totalOvertimePay: string;
        totalDeductions: string;
        totalBonuses: string;
        totalGrossSalary: string;
        totalNetSalary: string;
        totalOvertimeHours: string;
        totalRegularHours: string;
    }>;
}
