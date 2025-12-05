import { Controller, Post, Get, Body, Query, Request, UseGuards, HttpCode, HttpStatus, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { AttendanceService } from '../services/attendance.service';
import { ClockInDto } from '../dto/clock-in.dto';
import { ClockOutDto } from '../dto/clock-out.dto';
import { AttendanceHistoryDto } from '../dto/attendance-history.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Role } from '@prisma/client';

@ApiTags('attendance')
@ApiSecurity('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

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
    const employeeId = BigInt(req.user.sub);
    return this.attendanceService.clockIn(employeeId, clockInDto, ip, userAgent);
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
    const employeeId = BigInt(req.user.sub);
    return this.attendanceService.clockOut(employeeId, clockOutDto, ip, userAgent);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get today\'s attendance status' })
  @ApiResponse({ status: 200, description: 'Today\'s attendance data.' })
  async getTodayAttendance(@Request() req: any) {
    const employeeId = BigInt(req.user.sub);
    return this.attendanceService.getTodayAttendance(employeeId);
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
  @ApiOperation({ summary: 'Get attendance statistics' })
  @ApiResponse({ status: 200, description: 'Attendance statistics data.' })
  async getAttendanceStats(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Request() req: any,
    @Query('employeeId') employeeId?: string,
  ) {
    let targetEmployeeId: bigint;

    if (employeeId && (req.user.role === Role.SUPER || req.user.role === Role.HR)) {
      targetEmployeeId = BigInt(employeeId);
    } else {
      targetEmployeeId = BigInt(req.user.sub);
    }

    return this.attendanceService.getAttendanceStats(targetEmployeeId, startDate, endDate);
  }
}