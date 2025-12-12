import { PayrollService } from '../services/payroll.service';
import { CreatePayrollDto, ProcessPayrollDto } from '../dto/create-payroll.dto';
import { PayrollQueryDto } from '../dto/payroll-query.dto';
import { PayrollDto, PayrollListResponseDto } from '../dto/payroll-response.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    createPayroll(createPayrollDto: CreatePayrollDto, req: any): Promise<PayrollDto>;
    findAll(query: PayrollQueryDto): Promise<PayrollListResponseDto>;
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
    getMyPayrolls(query: PayrollQueryDto, req: any): Promise<PayrollListResponseDto>;
    findById(id: string, req: any): Promise<PayrollDto>;
    processPayrolls(processPayrollDto: ProcessPayrollDto, req: any): Promise<{
        processed: number;
        failed: string[];
    }>;
    markAsPaid(id: string, req: any): Promise<PayrollDto>;
    deletePayroll(id: string): Promise<{
        message: string;
    }>;
}
