"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaveBalanceService = void 0;
const common_1 = require("@nestjs/common");
const leave_balance_repository_1 = require("../repositories/leave-balance.repository");
const leave_period_repository_1 = require("../repositories/leave-period.repository");
let LeaveBalanceService = class LeaveBalanceService {
    leaveBalanceRepository;
    leavePeriodRepository;
    constructor(leaveBalanceRepository, leavePeriodRepository) {
        this.leaveBalanceRepository = leaveBalanceRepository;
        this.leavePeriodRepository = leavePeriodRepository;
    }
    async getEmployeeBalances(employeeId, periodId) {
        let targetPeriodId;
        if (periodId) {
            targetPeriodId = BigInt(periodId);
            const period = await this.leavePeriodRepository.findById(targetPeriodId);
            if (!period) {
                throw new common_1.NotFoundException(`Leave period with ID ${periodId} not found`);
            }
        }
        else {
            const activePeriod = await this.leaveBalanceRepository.findActivePeriod();
            if (!activePeriod) {
                throw new common_1.NotFoundException('No active leave period found');
            }
            targetPeriodId = activePeriod.id;
        }
        const balances = await this.leaveBalanceRepository.findByEmployee(BigInt(employeeId), targetPeriodId);
        return balances.map(balance => this.mapToResponseDto(balance));
    }
    async getEmployeeBalanceSummary(employeeId, periodId) {
        const balances = await this.getEmployeeBalances(employeeId, periodId);
        const totalQuota = balances.reduce((sum, balance) => sum + balance.totalQuota, 0);
        const totalUsed = balances.reduce((sum, balance) => sum + balance.usedQuota, 0);
        const totalRemaining = balances.reduce((sum, balance) => sum + balance.remainingQuota, 0);
        return {
            employeeId: employeeId.toString(),
            employeeName: 'Employee Name',
            balances,
            totalQuota,
            totalUsed,
            totalRemaining
        };
    }
    async getEmployeeBalanceByType(employeeId, leaveTypeConfigId) {
        const balance = await this.leaveBalanceRepository.findByEmployeeAndType(BigInt(employeeId), BigInt(leaveTypeConfigId));
        return balance ? this.mapToResponseDto(balance) : null;
    }
    async updateBalance(employeeId, periodId, leaveTypeConfigId, usedDays) {
        const balance = await this.leaveBalanceRepository.updateQuotas(BigInt(employeeId), BigInt(periodId), BigInt(leaveTypeConfigId), usedDays);
        return this.mapToResponseDto(balance);
    }
    async initializeEmployeeBalance(employeeId, leaveTypeConfigId, customQuota) {
        const balance = await this.leaveBalanceRepository.initializeBalance(BigInt(employeeId), BigInt(leaveTypeConfigId), customQuota);
        return this.mapToResponseDto(balance);
    }
    mapToResponseDto(balance) {
        return {
            id: balance.id.toString(),
            leaveTypeName: balance.leaveTypeConfig?.name || 'Unknown',
            totalQuota: balance.totalQuota,
            usedQuota: balance.usedQuota,
            remainingQuota: balance.totalQuota - balance.usedQuota,
            validFrom: balance.leavePeriod?.startDate?.toISOString()?.split('T')[0] || '',
            validTo: balance.leavePeriod?.endDate?.toISOString()?.split('T')[0] || '',
            isActive: balance.leavePeriod?.isActive || false
        };
    }
};
exports.LeaveBalanceService = LeaveBalanceService;
exports.LeaveBalanceService = LeaveBalanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leave_balance_repository_1.LeaveBalanceRepository,
        leave_period_repository_1.LeavePeriodRepository])
], LeaveBalanceService);
//# sourceMappingURL=leave-balance.service.js.map