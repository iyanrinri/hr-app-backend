import { Controller, Post, Get, Body, Query, Request, UseGuards, HttpCode, HttpStatus, Ip, Headers, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@ApiTags('attendance')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
    private readonly employeeService: EmployeeService,
  ) {}

  @Post('clock-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clock in to start work' })
  @ApiResponse({ status: 200, description: 'Successfully clocked in.' })
  @ApiResponse({ status: 400, description: 'Bad request - already clocked in or weekend/holiday.' })
  async clockIn(
    @Body() clockInDto: ClockInDto,
    @Request() req: any,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.attendanceService.clockIn(employee.id, clockInDto, ip, userAgent);
  }

  @Post('clock-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clock out to end work' })
  @ApiResponse({ status: 200, description: 'Successfully clocked out.' })
  @ApiResponse({ status: 400, description: 'Bad request - not clocked in or weekend/holiday.' })
  async clockOut(
    @Body() clockOutDto: ClockOutDto,
    @Request() req: any,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.attendanceService.clockOut(employee.id, clockOutDto, ip, userAgent);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s attendance status' })
  @ApiResponse({ status: 200, description: 'Today\'s attendance data.' })
  async getTodayAttendance(@Request() req: any) {
    const userId = BigInt(req.user.sub);
    const employee = await this.employeeService.findByUserId(userId);
    return this.attendanceService.getTodayAttendance(employee.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get attendance history' })
  @ApiResponse({ status: 200, description: 'Attendance history data.' })
  async getAttendanceHistory(@Query() query: AttendanceHistoryDto, @Request() req: any) {
    const userRole = req.user.role;
    const userId = req.user.sub;
    return this.attendanceService.getAttendanceHistory(query, userRole, userId);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get attendance logs' })
  @ApiResponse({ status: 200, description: 'Attendance logs data.' })
  async getAttendanceLogs(
    @Query('employeeId') employeeId?: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getAttendanceLogs(
      employeeId ? BigInt(employeeId) : undefined,
      date,
    );
  }

  @Get('stats')
  @ApiOperation({ 
    summary: 'Get attendance statistics',
    description: 'Get attendance statistics for the authenticated user. Only SUPER/HR users can query other employees by providing employeeId parameter.'
  })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date for statistics (YYYY-MM-DD)',
    example: '2025-12-01'
  })
  @ApiQuery({
    name: 'endDate', 
    required: true,
    description: 'End date for statistics (YYYY-MM-DD)',
    example: '2025-12-31'
  })
  @ApiQuery({
    name: 'employeeId',
    required: false,
    description: 'Employee ID to query (only available for SUPER/HR users). If not provided, returns current user stats.',
    example: '1'
  })
  @ApiResponse({ status: 200, description: 'Attendance statistics data.' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions to query other employee data.' })
  async getAttendanceStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req: any,
    @Query('employeeId') employeeId?: string,
  ) {
    let targetEmployeeId: bigint;
    const currentUserId = BigInt(req.user.sub);
    const userRole = req.user.role;

    // If employeeId is provided, validate permissions
    if (employeeId) {
      // Only SUPER and HR users can query other employees
      if (userRole !== Role.SUPER && userRole !== Role.HR) {
        throw new ForbiddenException(
          'Access denied. Only SUPER and HR users can query other employee statistics.'
        );
      }
      targetEmployeeId = BigInt(employeeId);
    } else {
      // If no employeeId provided, use current user's ID
      targetEmployeeId = currentUserId;
    }

    return this.attendanceService.getAttendanceStats(targetEmployeeId, startDate, endDate);
  }

  @Get('dashboard/today')
  @ApiOperation({ 
    summary: 'Get today\'s attendance dashboard data',
    description: 'Get comprehensive dashboard data including attendance stats, present/absent/late employees list for today. Only accessible by SUPER and HR users.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Today\'s attendance dashboard data.',
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string', example: '2025-12-08' },
        summary: {
          type: 'object',
          properties: {
            totalEmployees: { type: 'number', example: 150 },
            totalPresent: { type: 'number', example: 120 },
            totalAbsent: { type: 'number', example: 30 },
            totalLate: { type: 'number', example: 15 },
            attendanceRate: { type: 'number', example: 80.0 },
            lateRate: { type: 'number', example: 12.5 },
            onTimeRate: { type: 'number', example: 67.5 }
          }
        },
        presentEmployees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              department: { type: 'string' },
              position: { type: 'string' },
              checkIn: { type: 'string' },
              checkOut: { type: 'string', nullable: true },
              status: { type: 'string' },
              isLate: { type: 'boolean' },
              minutesLate: { type: 'number' },
              workDuration: { type: 'number' }
            }
          }
        },
        absentEmployees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              department: { type: 'string' },
              position: { type: 'string' }
            }
          }
        },
        lateEmployees: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              department: { type: 'string' },
              position: { type: 'string' },
              checkIn: { type: 'string' },
              minutesLate: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions.' })
  @ApiResponse({ status: 404, description: 'No active attendance period found.' })
  async getDashboardToday(@Request() req: any) {
    const userRole = req.user.role;
    const userId = BigInt(req.user.sub);

    // Only SUPER and HR users can access dashboard
    if (userRole !== Role.SUPER && userRole !== Role.HR) {
      throw new ForbiddenException(
        'Access denied. Only SUPER and HR users can access attendance dashboard.'
      );
    }

    return this.attendanceService.getDashboardToday();
  }
}