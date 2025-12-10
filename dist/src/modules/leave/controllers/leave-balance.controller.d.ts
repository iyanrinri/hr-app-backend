import { LeaveBalanceService } from '../services/leave-balance.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { LeaveBalanceResponseDto, LeaveBalanceSummaryDto } from '../dto/leave-request.dto';
export declare class LeaveBalanceController {
    private readonly leaveBalanceService;
    private readonly employeeService;
    constructor(leaveBalanceService: LeaveBalanceService, employeeService: EmployeeService);
    getMyLeaveBalances(req: any, periodId?: string): Promise<LeaveBalanceResponseDto[]>;
    getMyBalanceSummary(req: any, periodId?: string): Promise<LeaveBalanceSummaryDto>;
    getEmployeeLeaveBalances(employeeId: number, periodId?: string): Promise<LeaveBalanceResponseDto[]>;
    getEmployeeLeaveBalanceSummary(employeeId: number, periodId?: string): Promise<LeaveBalanceSummaryDto>;
}
