import { Controller, Get, Query, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LeaveBalanceService } from '../services/leave-balance.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { LeaveBalanceResponseDto, LeaveBalanceSummaryDto } from '../dto/leave-request.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('leave-balances')
@Controller('leave-balances')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('bearer')
export class LeaveBalanceController {
  constructor(
    private readonly leaveBalanceService: LeaveBalanceService,
    private readonly employeeService: EmployeeService
  ) {}

  @Get('my')
  @Roles(Role.EMPLOYEE, Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get my leave balances' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave balances retrieved successfully',
    type: [LeaveBalanceResponseDto]
  })
  async getMyLeaveBalances(
    @Request() req: any,
    @Query('periodId') periodId?: string
  ): Promise<LeaveBalanceResponseDto[]> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
    return this.leaveBalanceService.getEmployeeBalances(Number(employee.id), parsedPeriodId);
  }

  @Get('my/summary')
  @Roles(Role.EMPLOYEE, Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get my leave balance summary' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave balance summary retrieved successfully',
    type: LeaveBalanceSummaryDto
  })
  async getMyBalanceSummary(
    @Request() req: any,
    @Query('periodId') periodId?: string
  ): Promise<LeaveBalanceSummaryDto> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
    return this.leaveBalanceService.getEmployeeBalanceSummary(Number(employee.id), parsedPeriodId);
  }

  @Get('employee/:employeeId')
  @Roles(Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get employee leave balances (HR/SUPER only)' })
  @ApiParam({ name: 'employeeId', type: 'number', description: 'Employee ID' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee leave balances retrieved successfully',
    type: [LeaveBalanceResponseDto]
  })
  async getEmployeeLeaveBalances(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('periodId') periodId?: string
  ): Promise<LeaveBalanceResponseDto[]> {
    const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
    return this.leaveBalanceService.getEmployeeBalances(employeeId, parsedPeriodId);
  }

  @Get('employee/:employeeId/summary')
  @Roles(Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get employee leave balance summary (HR/SUPER only)' })
  @ApiParam({ name: 'employeeId', type: 'number', description: 'Employee ID' })
  @ApiQuery({ name: 'periodId', required: false, description: 'Leave period ID (defaults to active period)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Employee leave balance summary retrieved successfully',
    type: LeaveBalanceSummaryDto
  })
  async getEmployeeLeaveBalanceSummary(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('periodId') periodId?: string
  ): Promise<LeaveBalanceSummaryDto> {
    const parsedPeriodId = periodId ? parseInt(periodId) : undefined;
    return this.leaveBalanceService.getEmployeeBalanceSummary(employeeId, parsedPeriodId);
  }
}