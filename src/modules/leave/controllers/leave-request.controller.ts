import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query,
  Request,
  ParseIntPipe, 
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { LeaveRequestService } from '../services/leave-request.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { 
  CreateLeaveRequestDto, 
  LeaveRequestResponseDto, 
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
  LeaveRequestHistoryDto
} from '../dto/leave-request.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role, LeaveRequestStatus } from '@prisma/client';

@ApiTags('leave-requests')
@Controller('leave-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('bearer')
export class LeaveRequestController {
  constructor(
    private readonly leaveRequestService: LeaveRequestService,
    private readonly employeeService: EmployeeService
  ) {}

  @Post()
  @Roles(Role.EMPLOYEE, Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Submit a new leave request' })
  @ApiBody({ type: CreateLeaveRequestDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Leave request submitted successfully',
    type: LeaveRequestResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid dates or insufficient balance' })
  async submitLeaveRequest(
    @Body() createDto: CreateLeaveRequestDto,
    @Request() req: any
  ): Promise<LeaveRequestResponseDto> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.leaveRequestService.submitRequest(createDto, Number(employee.id));
  }

  @Get('my')
  @Roles(Role.EMPLOYEE, Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get my leave requests' })
  @ApiQuery({ name: 'status', required: false, enum: LeaveRequestStatus })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter from start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter to end date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave requests retrieved successfully',
    type: LeaveRequestHistoryDto
  })
  async getMyLeaveRequests(
    @Request() req: any,
    @Query('status') status?: LeaveRequestStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<LeaveRequestHistoryDto[]> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    
    return this.leaveRequestService.getEmployeeRequests(
      Number(employee.id),
      { status, startDate, endDate, page: pageNum, limit: limitNum }
    );
  }

  @Get(':id')
  @Roles(Role.EMPLOYEE, Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get leave request details' })
  @ApiParam({ name: 'id', type: 'number', description: 'Leave request ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave request details retrieved successfully',
    type: LeaveRequestResponseDto
  })
  async getLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<LeaveRequestResponseDto> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.leaveRequestService.getRequestDetails(id, Number(employee.id), req.user.role);
  }

  @Patch(':id/cancel')
  @Roles(Role.EMPLOYEE, Role.HR, Role.SUPER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a pending leave request' })
  @ApiParam({ name: 'id', type: 'number', description: 'Leave request ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave request cancelled successfully',
    type: LeaveRequestResponseDto
  })
  async cancelLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
  ): Promise<LeaveRequestResponseDto> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.leaveRequestService.cancelRequest(id, Number(employee.id));
  }

  @Get('pending/for-approval')
  @Roles(Role.HR, Role.SUPER)
  @ApiOperation({ summary: 'Get leave requests pending for approval (HR/Manager only)' })
  @ApiQuery({ name: 'department', required: false, description: 'Filter by department' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'Pending leave requests retrieved successfully',
    type: LeaveRequestHistoryDto
  })
  async getPendingApprovals(
    @Request() req: any,
    @Query('department') department?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ): Promise<LeaveRequestHistoryDto[]> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 10;
    
    return this.leaveRequestService.getPendingApprovals(
      Number(employee.id),
      req.user.role,
      { department, page: pageNum, limit: limitNum }
    );
  }

  @Patch(':id/approve')
  @Roles(Role.HR, Role.SUPER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a leave request (HR/Manager only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Leave request ID' })
  @ApiBody({ type: ApproveLeaveRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave request approved successfully',
    type: LeaveRequestResponseDto
  })
  async approveLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() approveDto: ApproveLeaveRequestDto,
    @Request() req: any
  ): Promise<LeaveRequestResponseDto> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.leaveRequestService.approveRequest(
      id,
      Number(employee.id),
      req.user.role,
      approveDto
    );
  }  @Patch(':id/reject')
  @Roles(Role.HR, Role.SUPER)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a leave request (HR/Manager only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Leave request ID' })
  @ApiBody({ type: RejectLeaveRequestDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave request rejected successfully',
    type: LeaveRequestResponseDto
  })
  async rejectLeaveRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() rejectDto: RejectLeaveRequestDto,
    @Request() req: any
  ): Promise<LeaveRequestResponseDto> {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.leaveRequestService.rejectRequest(
      id,
      Number(employee.id),
      req.user.role,
      rejectDto
    );
  }
}