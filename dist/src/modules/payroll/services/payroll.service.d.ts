import { PayrollRepository } from '../repositories/payroll.repository';
import { SalaryService } from '../../salary/services/salary.service';
import { OvertimeRequestService } from '../../overtime/services/overtime-request.service';
import { SettingsService } from '../../settings/services/settings.service';
import { AttendanceService } from '../../attendance/services/attendance.service';
import { CreatePayrollDto, ProcessPayrollDto } from '../dto/create-payroll.dto';
import { PayrollQueryDto } from '../dto/payroll-query.dto';
import { PayrollDto, PayrollListResponseDto } from '../dto/payroll-response.dto';
export declare class PayrollService {
    private payrollRepository;
    private salaryService;
    private overtimeRequestService;
    private settingsService;
    private attendanceService;
    constructor(payrollRepository: PayrollRepository, salaryService: SalaryService, overtimeRequestService: OvertimeRequestService, settingsService: SettingsService, attendanceService: AttendanceService);
    createPayroll(createPayrollDto: CreatePayrollDto, userId: string): Promise<PayrollDto>;
    findAll(query: PayrollQueryDto): Promise<PayrollListResponseDto>;
    findById(id: string): Promise<PayrollDto>;
    processPayrolls(processPayrollDto: ProcessPayrollDto, userId: string): Promise<{
        processed: number;
        failed: string[];
    }>;
    markAsPaid(id: string, userId: string): Promise<PayrollDto>;
    deletePayroll(id: string): Promise<void>;
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
    private calculateRegularHours;
    private calculateOvertimePay;
    private isHoliday;
    private transformPayrollToDto;
}
