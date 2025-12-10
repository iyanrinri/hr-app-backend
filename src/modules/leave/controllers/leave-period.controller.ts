import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards, 
  Query,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { LeavePeriodService } from '../services/leave-period.service';
import { CreateLeavePeriodDto, UpdateLeavePeriodDto } from '../dto/leave-period.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role, LeaveType } from '@prisma/client';

@ApiTags('leave-periods')
@Controller('leave-periods')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('bearer')
export class LeavePeriodController {
  constructor(private readonly leavePeriodService: LeavePeriodService) {}

  @Post()
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Create leave period (SUPER/HR only)' })
  @ApiResponse({ 
    status: 201, 
    description: 'Leave period created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Annual Leave 2024',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isActive: true,
        description: 'Annual leave allocation for 2024'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid dates or overlapping period' })
  @ApiResponse({ status: 409, description: 'Conflict - Period overlaps with existing period' })
  create(@Body() createDto: CreateLeavePeriodDto, @Request() req: any) {
    return this.leavePeriodService.create(createDto, req.user.sub);
  }

  @Get('available-leave-types')
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Get all available leave types for creating periods (SUPER/HR only)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Available leave types retrieved successfully',
    schema: {
      example: {
        data: ['ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'HAJJ_UMRAH', 'EMERGENCY', 'COMPASSIONATE', 'STUDY', 'UNPAID'],
        message: 'Available leave types retrieved successfully'
      }
    }
  })
  async getAvailableLeaveTypes(): Promise<{ data: string[], message: string }> {
    const leaveTypes = Object.values(LeaveType);
    return {
      data: leaveTypes,
      message: 'Available leave types retrieved successfully'
    };
  }

  @Post(':id/setup-default-types')
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Setup default leave type configurations for a period (SUPER/HR only)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Leave period ID' })
  @ApiResponse({ 
    status: 201, 
    description: 'Default leave types created successfully',
    schema: {
      example: {
        message: 'Default leave type configurations created successfully',
        count: 5
      }
    }
  })
  async setupDefaultTypes(@Param('id', ParseIntPipe) id: number): Promise<{ message: string, count: number }> {
    return this.leavePeriodService.setupDefaultLeaveTypes(id);
  }

  @Get()
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Get all leave periods (SUPER/HR only)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'activeOnly', required: false, example: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave periods retrieved successfully',
    schema: {
      example: {
        data: [{
          id: 1,
          name: 'Annual Leave 2024',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isActive: true,
          leaveTypes: [
            { id: 1, type: 'ANNUAL', name: 'Annual Leave', defaultQuota: 30 }
          ],
          stats: {
            totalEmployeesWithBalances: 25,
            totalLeaveRequests: 45
          }
        }],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      }
    }
  })
  findAll(
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('activeOnly') activeOnly?: string
  ) {
    return this.leavePeriodService.findAll({
      page,
      limit,
      activeOnly: activeOnly === 'true'
    });
  }

  @Get('active')
  @Roles(Role.SUPER, Role.HR, Role.EMPLOYEE)
  @ApiOperation({ summary: 'Get active leave period' })
  @ApiResponse({ 
    status: 200, 
    description: 'Active leave period retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'No active leave period found' })
  findActive() {
    return this.leavePeriodService.findActive();
  }

  @Get(':id')
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Get leave period by ID (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Leave period ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave period retrieved successfully'
  })
  @ApiResponse({ status: 404, description: 'Leave period not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leavePeriodService.findById(BigInt(id));
  }

  @Patch(':id')
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Update leave period (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Leave period ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave period updated successfully'
  })
  @ApiResponse({ status: 404, description: 'Leave period not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDto: UpdateLeavePeriodDto
  ) {
    return this.leavePeriodService.update(BigInt(id), updateDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER, Role.HR)
  @ApiOperation({ summary: 'Delete leave period (SUPER/HR only)' })
  @ApiParam({ name: 'id', description: 'Leave period ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Leave period deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Leave period not found' })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot delete period with existing data' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leavePeriodService.delete(BigInt(id));
  }
}