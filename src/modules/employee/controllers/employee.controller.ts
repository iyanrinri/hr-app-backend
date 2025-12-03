import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
import { PaginatedEmployeeResponseDto } from '../dto/paginated-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER, Role.HR)
@ApiBearerAuth()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create employee (SUPER/HR only)' })
  @ApiResponse({ status: 201, description: 'The employee has been successfully created.' })
  @ApiResponse({ status: 409, description: 'User with this email already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER or HR role required.' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all employees (SUPER/HR only)' })
  @ApiQuery({ name: 'paginated', required: false, type: Number, description: 'Enable pagination (1 for paginated, 0 or omit for all)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (only when paginated=1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (only when paginated=1)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return employees based on role and pagination.',
    type: [Object],
    schema: {
      oneOf: [
        { type: 'array', items: { type: 'object' } },
        { $ref: '#/components/schemas/PaginatedEmployeeResponseDto' }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER or HR role required.' })
  findAll(@Query() query: FindAllEmployeesDto, @Request() req: any) {
    return this.employeeService.findAll(query, req.user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get employee by id (SUPER/HR only)' })
  @ApiResponse({ status: 200, description: 'Return the employee.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER or HR role required.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update employee (SUPER/HR only)' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - HR cannot edit SUPER/HR roles.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER or HR role required.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEmployeeDto: UpdateEmployeeDto, @Request() req: any) {
    return this.employeeService.update(BigInt(id), updateEmployeeDto, req.user.role, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete employee (SUPER/HR only)' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot delete protected roles or own record.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.employeeService.remove(BigInt(id), req.user.role, req.user.sub);
  }
}
