import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, Request, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
import { PaginatedEmployeeResponseDto } from '../dto/paginated-response.dto';
import { AssignSubordinatesDto, SetManagerDto, OrganizationTreeDto, EmployeeHierarchyResponseDto } from '../dto/employee-hierarchy.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER, Role.HR)
@ApiBearerAuth('bearer')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create employee (SUPER/HR only)' })
  @ApiBody({
    type: CreateEmployeeDto,
    description: 'Employee creation data',
    examples: {
      example1: {
        summary: 'Software Engineer Example',
        description: 'Example of creating a software engineer employee',
        value: {
          email: 'jane.smith@company.com',
          password: 'SecurePassword123!',
          firstName: 'Jane',
          lastName: 'Smith',
          position: 'Software Engineer',
          department: 'Engineering',
          joinDate: '2024-01-15T00:00:00Z',
          baseSalary: 75000
        }
      },
      example2: {
        summary: 'HR Manager Example',
        description: 'Example of creating an HR manager employee',
        value: {
          email: 'mike.johnson@company.com',
          password: 'HRPassword456!',
          firstName: 'Mike',
          lastName: 'Johnson',
          position: 'HR Manager',
          department: 'Human Resources',
          joinDate: '2024-02-01T00:00:00Z',
          baseSalary: 85000
        }
      }
    }
  })
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
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for firstName, lastName, email, position, or department' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive'], description: 'Filter by employee status (active = deletedAt null, inactive = deletedAt not null)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return employees based on role, pagination, search, and status filter.',
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
  @ApiBody({
    type: UpdateEmployeeDto,
    description: 'Employee update data (all fields are optional)',
    examples: {
      updatePosition: {
        summary: 'Update Position & Salary',
        description: 'Update employee position and salary',
        value: {
          position: 'Senior Software Engineer',
          baseSalary: 95000
        }
      },
      updateDepartment: {
        summary: 'Department Transfer',
        description: 'Move employee to different department with new position',
        value: {
          department: 'DevOps',
          position: 'DevOps Engineer',
          baseSalary: 90000
        }
      },
      updatePersonal: {
        summary: 'Update Personal Info',
        description: 'Update personal information and contact details',
        value: {
          firstName: 'Jane',
          lastName: 'Smith-Johnson',
          email: 'jane.smith-johnson@company.com'
        }
      },
      updatePassword: {
        summary: 'Change Password',
        description: 'Update employee password (leave empty if no change needed)',
        value: {
          password: 'NewSecurePassword123!'
        }
      },
      updateComplete: {
        summary: 'Complete Update',
        description: 'Update multiple fields at once',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe.updated@company.com',
          position: 'Lead Software Engineer',
          department: 'Engineering',
          baseSalary: 105000,
          password: 'UpdatedPassword123!'
        }
      }
    }
  })
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

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore soft-deleted employee (SUPER only)' })
  @ApiResponse({ status: 200, description: 'The employee has been successfully restored.' })
  @ApiResponse({ status: 404, description: 'Employee not found or not deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden - SUPER role required.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Roles(Role.SUPER)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.employeeService.restore(BigInt(id));
  }

  // Hierarchy Management Endpoints

  @Post(':id/subordinates')
  @ApiOperation({ summary: 'Assign subordinates to manager (Parent adds Children)' })
  @ApiParam({ name: 'id', description: 'Manager Employee ID' })
  @ApiBody({ type: AssignSubordinatesDto })
  @ApiResponse({ status: 200, description: 'Subordinates assigned successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Circular dependency or invalid data.' })
  @ApiResponse({ status: 404, description: 'Manager or subordinates not found.' })
  assignSubordinates(
    @Param('id', ParseIntPipe) managerId: number, 
    @Body() assignDto: AssignSubordinatesDto
  ) {
    return this.employeeService.assignSubordinates(BigInt(managerId), assignDto);
  }

  @Put(':id/manager')
  @ApiOperation({ summary: 'Set or update manager for employee (Child sets Parent)' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiBody({ type: SetManagerDto })
  @ApiResponse({ status: 200, description: 'Manager set successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request - Cannot set self as manager or circular dependency.' })
  @ApiResponse({ status: 404, description: 'Employee or manager not found.' })
  setManager(
    @Param('id', ParseIntPipe) employeeId: number, 
    @Body() setManagerDto: SetManagerDto
  ) {
    return this.employeeService.setManager(BigInt(employeeId), setManagerDto);
  }

  @Get(':id/organization-tree')
  @ApiOperation({ summary: 'Get organization tree for employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Organization tree retrieved successfully.',
    type: OrganizationTreeDto 
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @Roles(Role.SUPER, Role.HR, Role.EMPLOYEE) // Allow employees to see their own hierarchy
  getOrganizationTree(@Param('id', ParseIntPipe) employeeId: number) {
    return this.employeeService.getOrganizationTree(BigInt(employeeId));
  }

  @Get(':id/subordinates')
  @ApiOperation({ summary: 'Get all subordinates (recursive)' })
  @ApiParam({ name: 'id', description: 'Manager Employee ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'All subordinates retrieved successfully.',
    type: [EmployeeHierarchyResponseDto] 
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  getAllSubordinates(@Param('id', ParseIntPipe) managerId: number) {
    return this.employeeService.getAllSubordinates(BigInt(managerId));
  }

  @Get(':id/management-chain')
  @ApiOperation({ summary: 'Get management chain from employee to top' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Management chain retrieved successfully.',
    type: [EmployeeHierarchyResponseDto] 
  })
  @ApiResponse({ status: 404, description: 'Employee not found.' })
  @Roles(Role.SUPER, Role.HR, Role.EMPLOYEE) // Allow employees to see their own chain
  getManagementChain(@Param('id', ParseIntPipe) employeeId: number) {
    return this.employeeService.getManagementChain(BigInt(employeeId));
  }
}
