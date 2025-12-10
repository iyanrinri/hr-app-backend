import { LeaveBalanceRepository } from '../repositories/leave-balance.repository';
import { LeavePeriodRepository } from '../repositories/leave-period.repository';
import { LeaveBalanceResponseDto, LeaveBalanceSummaryDto } from '../dto/leave-request.dto';
export declare class LeaveBalanceService {
    private readonly leaveBalanceRepository;
    private readonly leavePeriodRepository;
    constructor(leaveBalanceRepository: LeaveBalanceRepository, leavePeriodRepository: LeavePeriodRepository);
    getEmployeeBalances(employeeId: number, periodId?: number): Promise<LeaveBalanceResponseDto[]>;
    getEmployeeBalanceSummary(employeeId: number, periodId?: number): Promise<LeaveBalanceSummaryDto>;
    getEmployeeBalanceByType(employeeId: number, leaveTypeConfigId: number): Promise<LeaveBalanceResponseDto | null>;
    updateBalance(employeeId: number, periodId: number, leaveTypeConfigId: number, usedDays: number): Promise<LeaveBalanceResponseDto>;
    initializeEmployeeBalance(employeeId: number, leaveTypeConfigId: number, customQuota?: number): Promise<LeaveBalanceResponseDto>;
    private mapToResponseDto;
}
