import { PayslipService } from '../services/payslip.service';
import { GeneratePayslipDto } from '../dto/generate-payslip.dto';
import { PayslipResponseDto } from '../dto/payslip-response.dto';
export declare class PayslipController {
    private readonly payslipService;
    constructor(payslipService: PayslipService);
    generatePayslip(dto: GeneratePayslipDto, req: any): Promise<PayslipResponseDto>;
    getPayslipById(id: number): Promise<PayslipResponseDto>;
    getPayslipByPayrollId(payrollId: number): Promise<PayslipResponseDto>;
    getEmployeePayslips(employeeId: number): Promise<PayslipResponseDto[]>;
    getMyPayslips(req: any): Promise<PayslipResponseDto[]>;
    deletePayslip(id: number): Promise<{
        message: string;
    }>;
    private transformPayslip;
}
