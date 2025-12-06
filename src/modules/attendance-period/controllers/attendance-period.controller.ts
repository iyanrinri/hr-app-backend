import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { AttendancePeriodService } from '../services/attendance-period.service';
import { AttendancePeriodScheduler } from '../services/attendance-period.scheduler';
import { CreateAttendancePeriodDto } from '../dto/create-attendance-period.dto';
import { UpdateAttendancePeriodDto } from '../dto/update-attendance-period.dto';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { FindAllPeriodsDto } from '../dto/find-all-periods.dto';
import { AttendancePeriodResponseDto, HolidayResponseDto } from '../dto/period-response.dto';
import { SchedulerRunResponseDto, SchedulerStatsWrapperDto } from '../dto/scheduler-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('attendance-periods')
@Controller('attendance-periods')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER, Role.HR)
@ApiSecurity('JWT-auth')
export class AttendancePeriodController {
  constructor(
    private readonly attendancePeriodService: AttendancePeriodService,
    private readonly attendancePeriodScheduler: AttendancePeriodScheduler,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create attendance period (SUPER/HR only)' })
  @ApiResponse({ status: 201, description: 'Attendance period created successfully.', type: AttendancePeriodResponseDto })
  create(@Body() createDto: CreateAttendancePeriodDto, @Request() req: any) {
    return this.attendancePeriodService.create(createDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance periods (SUPER/HR only)' })
  @ApiResponse({ status: 200, description: 'List of attendance periods.', type: [AttendancePeriodResponseDto] })
  findAll(@Query() query: FindAllPeriodsDto) {
    return this.attendancePeriodService.findAll(query);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get current active attendance period (SUPER/HR only)' })
  @ApiResponse({ status: 200, description: 'Current active attendance period.', type: AttendancePeriodResponseDto })
  getActivePeriod() {
    return this.attendancePeriodService.getActivePeriod();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance period by ID (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Attendance period ID' })
  @ApiResponse({ status: 200, description: 'Attendance period details.', type: AttendancePeriodResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendancePeriodService.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance period (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Attendance period ID' })
  @ApiResponse({ status: 200, description: 'Attendance period updated successfully.', type: AttendancePeriodResponseDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateAttendancePeriodDto) {
    return this.attendancePeriodService.update(BigInt(id), updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance period (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Attendance period ID' })
  @ApiResponse({ status: 200, description: 'Attendance period deleted successfully.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendancePeriodService.remove(BigInt(id));
  }

  // Holiday management endpoints
  @Post('holidays')
  @ApiOperation({ summary: 'Create holiday (SUPER/HR only)' })
  @ApiResponse({ status: 201, description: 'Holiday created successfully.', type: HolidayResponseDto })
  createHoliday(@Body() createDto: CreateHolidayDto) {
    return this.attendancePeriodService.createHoliday(createDto);
  }

  @Get('holidays/list')
  @ApiOperation({ summary: 'Get holidays (SUPER/HR only)' })
  @ApiResponse({ status: 200, description: 'List of holidays.', type: [HolidayResponseDto] })
  findHolidays(@Query('attendancePeriodId') attendancePeriodId?: string) {
    return this.attendancePeriodService.findHolidays(
      attendancePeriodId ? BigInt(attendancePeriodId) : undefined
    );
  }

  @Patch('holidays/:id')
  @ApiOperation({ summary: 'Update holiday (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Holiday ID' })
  @ApiResponse({ status: 200, description: 'Holiday updated successfully.' })
  updateHoliday(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<CreateHolidayDto>) {
    return this.attendancePeriodService.updateHoliday(BigInt(id), updateData);
  }

  @Delete('holidays/:id')
  @ApiOperation({ summary: 'Delete holiday (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Holiday ID' })
  @ApiResponse({ status: 200, description: 'Holiday deleted successfully.' })
  deleteHoliday(@Param('id', ParseIntPipe) id: number) {
    return this.attendancePeriodService.deleteHoliday(BigInt(id));
  }

  // Scheduler endpoints
  @Post('scheduler/run-check')
  @ApiOperation({ summary: 'Manually run period status check (SUPER/HR only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Period check completed successfully.',
    type: SchedulerRunResponseDto 
  })
  async runPeriodsCheck() {
    await this.attendancePeriodScheduler.runPeriodsCheck();
    return {
      status: 'success',
      message: 'Period status check completed',
      timestamp: new Date(),
    };
  }

  @Get('scheduler/stats')
  @ApiOperation({ summary: 'Get period scheduler statistics (SUPER/HR only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Period scheduler statistics.',
    type: SchedulerStatsWrapperDto 
  })
  async getSchedulerStats() {
    const stats = await this.attendancePeriodScheduler.getPeriodStatusStats();
    return {
      status: 'success',
      data: stats,
    };
  }
}