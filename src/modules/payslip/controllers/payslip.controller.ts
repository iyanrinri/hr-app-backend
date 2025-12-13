import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PayslipService } from '../services/payslip.service';
import { GeneratePayslipDto } from '../dto/generate-payslip.dto';
import { PayslipResponseDto } from '../dto/payslip-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { plainToInstance } from 'class-transformer';

@ApiTags('Payslip')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payslip')
export class PayslipController {
  constructor(private readonly payslipService: PayslipService) {}

  @Post('generate')
  @Roles('SUPER', 'HR')
  @ApiOperation({
    summary: 'Generate payslip from payroll',
    description:
      'Calculate PPh 21 tax and BPJS deductions, then generate payslip',
  })
  async generatePayslip(@Body() dto: GeneratePayslipDto, @Request() req: any) {
    const payslip = await this.payslipService.generatePayslip(
      dto,
      BigInt(req.user.sub),
    );
    return this.transformPayslip(payslip);
  }

  @Get(':id')
  @Roles('SUPER', 'HR', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Get payslip by ID' })
  async getPayslipById(@Param('id', ParseIntPipe) id: number) {
    const payslip = await this.payslipService.getPayslipById(BigInt(id));
    return this.transformPayslip(payslip);
  }

  @Get('by-payroll/:payrollId')
  @Roles('SUPER', 'HR', 'MANAGER', 'EMPLOYEE')
  @ApiOperation({ summary: 'Get payslip by payroll ID' })
  async getPayslipByPayrollId(
    @Param('payrollId', ParseIntPipe) payrollId: number,
  ) {
    const payslip = await this.payslipService.getPayslipByPayrollId(
      BigInt(payrollId),
    );
    return this.transformPayslip(payslip);
  }

  @Get('employee/:employeeId')
  @Roles('SUPER', 'HR', 'MANAGER')
  @ApiOperation({ summary: 'Get employee payslips history' })
  async getEmployeePayslips(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    const payslips = await this.payslipService.getEmployeePayslips(
      BigInt(employeeId),
    );
    return payslips.map((p) => this.transformPayslip(p));
  }

  @Get('my/history')
  @Roles('EMPLOYEE')
  @ApiOperation({ summary: 'Get my payslips (self-service for employees)' })
  async getMyPayslips(@Request() req: any) {
    // Get employee ID from user
    const employee = await this.payslipService['prisma'].employee.findUnique({
      where: { userId: BigInt(req.user.sub) },
    });

    if (!employee) {
      throw new NotFoundException('Employee profile not found');
    }

    const payslips = await this.payslipService.getEmployeePayslips(employee.id);
    return payslips.map((p) => this.transformPayslip(p));
  }

  @Delete(':id')
  @Roles('SUPER', 'HR')
  @ApiOperation({
    summary: 'Delete payslip (for corrections)',
    description: 'Admin only - delete payslip if corrections are needed',
  })
  async deletePayslip(@Param('id', ParseIntPipe) id: number) {
    await this.payslipService.deletePayslip(BigInt(id));
    return {
      message: 'Payslip deleted successfully',
    };
  }

  /**
   * Transform payslip data for response (convert BigInt to string)
   */
  private transformPayslip(payslip: any): PayslipResponseDto {
    const transformed = {
      ...payslip,
      id: payslip.id.toString(),
      payrollId: payslip.payrollId.toString(),
      grossSalary: payslip.grossSalary.toString(),
      overtimePay: payslip.overtimePay.toString(),
      bonuses: payslip.bonuses.toString(),
      allowances: payslip.allowances.toString(),
      taxAmount: payslip.taxAmount.toString(),
      bpjsKesehatanEmployee: payslip.bpjsKesehatanEmployee.toString(),
      bpjsKesehatanCompany: payslip.bpjsKesehatanCompany.toString(),
      bpjsKetenagakerjaanEmployee:
        payslip.bpjsKetenagakerjaanEmployee.toString(),
      bpjsKetenagakerjaanCompany:
        payslip.bpjsKetenagakerjaanCompany.toString(),
      otherDeductions: payslip.otherDeductions.toString(),
      takeHomePay: payslip.takeHomePay.toString(),
      generatedBy: payslip.generatedBy.toString(),
      generatedAt: payslip.generatedAt.toISOString(),
      createdAt: payslip.createdAt.toISOString(),
      updatedAt: payslip.updatedAt.toISOString(),
      deductions: payslip.deductions?.map((d: any) => ({
        id: d.id.toString(),
        type: d.type,
        description: d.description,
        amount: d.amount.toString(),
      })),
    };

    return plainToInstance(PayslipResponseDto, transformed, {
      excludeExtraneousValues: true,
    });
  }
}

