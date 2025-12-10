import { Injectable, ConflictException, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
import { AssignSubordinatesDto, SetManagerDto, EmployeeHierarchyResponseDto, OrganizationTreeDto } from '../dto/employee-hierarchy.dto';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function parsePrismaError(error: any): { message: string; code: number } | null {
  const cause = error.meta?.driverAdapterError?.cause;
  const kind = cause?.kind;
  const originalMessage = cause?.originalMessage;
  if (kind === 'UniqueConstraintViolation') {
    // const constraint = cause.constraint;
    if (originalMessage.includes('email') && originalMessage.includes('duplicate')) {
      return {
        message: "User with this email already exists",
        code: 409
      }
    }
  }
  return null
}

@Injectable()
export class EmployeeService {
  constructor(private repository: EmployeeRepository) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { email, password, managerId, ...employeeData } = createEmployeeDto;

    // Hash the password from request body
    const hashedPassword = await bcrypt.hash(password, 10);

    // If managerId is provided, verify manager exists
    if (managerId) {
      const manager = await this.repository.findById(BigInt(managerId));
      if (!manager) {
        throw new NotFoundException('Manager not found');
      }
    }

    try {
      const createData: any = {
        ...employeeData,
        user: {
          create: {
            email,
            password: hashedPassword,
            role: 'EMPLOYEE',
          },
        },
      };

      // Add manager relationship if provided
      if (managerId) {
        createData.manager = {
          connect: { id: BigInt(managerId) }
        };
      }

      return await this.repository.create(createData);
    } catch (error) {
      const meta = parsePrismaError(error);
      if (meta?.code === 409) {
        throw new ConflictException(meta.message);
      }
      throw error;
    }
  }

  async findAll(query: FindAllEmployeesDto, userRole: Role) {
    // Build base filter conditions
    let whereCondition: any = {};

    // Role filter based on user role
    if (userRole === Role.HR) {
      // HR can only see EMPLOYEE, MANAGER roles (exclude SUPER, HR)
      whereCondition.user = {
        role: {
          notIn: [Role.SUPER, Role.HR]
        }
      };
    }

    // Status filter
    if (query.status === 'active') {
      whereCondition.isDeleted = false;
    } else if (query.status === 'inactive') {
      whereCondition.isDeleted = true;
    }
    // If no status filter, show all (active and inactive)

    // Search filter
    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      whereCondition.OR = [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { position: { contains: searchTerm, mode: 'insensitive' } },
        { department: { contains: searchTerm, mode: 'insensitive' } },
        { user: { email: { contains: searchTerm, mode: 'insensitive' } } }
      ];
    }

    let employees;
    let total = 0;
    
    if (query.paginated === 1) {
      // Paginated response
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      // Get total count for pagination meta
      total = await this.repository.count(whereCondition);

      employees = await this.repository.findAll({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: { createdAt: 'desc' }
      });

      return {
        data: this.transformEmployees(employees),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } else {
      // Non-paginated response (all employees)
      employees = await this.repository.findAll({
        where: whereCondition,
        orderBy: { createdAt: 'desc' }
      });

      return this.transformEmployees(employees);
    }
  }

  private transformEmployees(employees: any[]) {
    // Transform the data to handle Date and Decimal serialization
    return employees.map(employee => {
      const emp = employee as any; // Cast to any to access included relations
      return {
        ...emp,
        id: emp.id.toString(),
        userId: emp.userId.toString(),
        joinDate: emp.joinDate instanceof Date ? emp.joinDate.toISOString() : emp.joinDate,
        baseSalary: emp.baseSalary ? parseFloat(emp.baseSalary.toString()) : null,
        deletedAt: emp.deletedAt instanceof Date ? emp.deletedAt.toISOString() : emp.deletedAt,
        createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
        updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
        user: emp.user ? {
          ...emp.user,
          id: emp.user.id.toString(),
          deletedAt: emp.user.deletedAt instanceof Date ? emp.user.deletedAt.toISOString() : emp.user.deletedAt,
          createdAt: emp.user.createdAt instanceof Date ? emp.user.createdAt.toISOString() : emp.user.createdAt,
          updatedAt: emp.user.updatedAt instanceof Date ? emp.user.updatedAt.toISOString() : emp.user.updatedAt,
        } : null
      };
    });
  }

  async findOne(id: bigint) {
    const employee = await this.repository.findOne({ id });
    
    if (!employee) {
      return null;
    }
    
    const emp = employee as any; // Cast to any to access included relations
    return {
      ...emp,
      id: emp.id.toString(),
      userId: emp.userId.toString(),
      joinDate: emp.joinDate instanceof Date ? emp.joinDate.toISOString() : emp.joinDate,
      baseSalary: emp.baseSalary ? parseFloat(emp.baseSalary.toString()) : null,
      deletedAt: emp.deletedAt instanceof Date ? emp.deletedAt.toISOString() : emp.deletedAt,
      createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
      updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
      user: emp.user ? {
        ...emp.user,
        id: emp.user.id.toString(),
        deletedAt: emp.user.deletedAt instanceof Date ? emp.user.deletedAt.toISOString() : emp.user.deletedAt,
        createdAt: emp.user.createdAt instanceof Date ? emp.user.createdAt.toISOString() : emp.user.createdAt,
        updatedAt: emp.user.updatedAt instanceof Date ? emp.user.updatedAt.toISOString() : emp.user.updatedAt,
      } : null
    };
  }

  async update(id: bigint, updateEmployeeDto: UpdateEmployeeDto, userRole: Role, userId: string) {
    // First, get the employee to check their role and user info
    const employee = await this.repository.findOne({ id });
    
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const employeeWithUser = employee as any; // Cast to access user relation
    
    // If user is HR, apply restrictions
    if (userRole === Role.HR) {
      // HR cannot edit SUPER or HR roles
      if (employeeWithUser.user?.role === Role.SUPER || employeeWithUser.user?.role === Role.HR) {
        throw new ForbiddenException('HR users cannot edit SUPER or HR role employees');
      }
    }

    const { email, password, ...employeeData } = updateEmployeeDto;

    // Prepare update data for employee table
    const updateData: any = {};
    
    // Only add fields that are provided
    if (employeeData.firstName !== undefined) updateData.firstName = employeeData.firstName;
    if (employeeData.lastName !== undefined) updateData.lastName = employeeData.lastName;
    if (employeeData.position !== undefined) updateData.position = employeeData.position;
    if (employeeData.department !== undefined) updateData.department = employeeData.department;
    if (employeeData.baseSalary !== undefined) updateData.baseSalary = employeeData.baseSalary;

    // Prepare user update data if email or password is provided
    let userUpdateData: any = {};
    if (email !== undefined) {
      userUpdateData.email = email;
    }
    if (password !== undefined && password.trim() !== '') {
      // Hash the new password if provided
      userUpdateData.password = await bcrypt.hash(password, 10);
    }

    // If there's user data to update, include it in the update
    if (Object.keys(userUpdateData).length > 0) {
      updateData.user = {
        update: userUpdateData
      };
    }

    try {
      return await this.repository.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      const meta = parsePrismaError(error);
      if (meta?.code === 409) {
        throw new ConflictException(meta.message);
      }
      throw error;
    }
  }

  async remove(id: bigint, userRole: Role, userId: string) {
    // First, get the employee to check their role and user info
    const employee = await this.repository.findOne({ id });
    
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const employeeWithUser = employee as any; // Cast to access user relation
    
    if (userRole === Role.SUPER) {
      // SUPER cannot delete themselves
      if (employeeWithUser.userId.toString() === userId) {
        throw new ForbiddenException('SUPER users cannot delete their own employee record');
      }
      // SUPER can delete anyone else
    } else if (userRole === Role.HR) {
      // HR cannot delete SUPER or HR roles
      if (employeeWithUser.user?.role === Role.SUPER || employeeWithUser.user?.role === Role.HR) {
        throw new ForbiddenException('HR users cannot delete SUPER or HR role employees');
      }
      
      // HR cannot delete themselves
      if (employeeWithUser.userId.toString() === userId) {
        throw new ForbiddenException('HR users cannot delete their own employee record');
      }
    }

    return this.repository.softDelete({ id });
  }

  async restore(id: bigint) {
    try {
      const restoredEmployee = await this.repository.restore({ id });
      
      // Transform the response using the same logic as findOne
      const emp = restoredEmployee as any;
      return {
        ...emp,
        id: emp.id.toString(),
        userId: emp.userId.toString(),
        joinDate: emp.joinDate instanceof Date ? emp.joinDate.toISOString() : emp.joinDate,
        baseSalary: emp.baseSalary ? parseFloat(emp.baseSalary.toString()) : null,
        deletedAt: emp.deletedAt instanceof Date ? emp.deletedAt.toISOString() : emp.deletedAt,
        createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
        updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
      };
    } catch (error) {
      if (error.message === 'Employee not found or not deleted') {
        throw new NotFoundException('Employee not found or not deleted');
      }
      throw error;
    }
  }

  async findByUserId(userId: bigint) {
    const employee = await this.repository.findByUserId(userId);
    if (!employee) {
      throw new NotFoundException('Employee not found for this user');
    }
    return employee;
  }

  // Hierarchy Management Methods

  /**
   * Assign multiple subordinates to a manager (Parent adds Children)
   */
  async assignSubordinates(managerId: bigint, assignDto: AssignSubordinatesDto) {
    // Verify manager exists
    const manager = await this.repository.findById(managerId);
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    const subordinateIds = assignDto.subordinateIds.map(id => BigInt(id));

    // Verify all subordinates exist
    const subordinates = await this.repository.findByIds(subordinateIds);
    if (subordinates.length !== subordinateIds.length) {
      throw new BadRequestException('One or more subordinates not found');
    }

    // Validate no circular dependencies
    await this.validateNoCyclicDependency(managerId, subordinateIds);

    // Update all subordinates to have this manager
    await this.repository.updateManagerForEmployees(subordinateIds, managerId);

    return {
      message: 'Subordinates assigned successfully',
      managerId: Number(managerId),
      assignedSubordinates: subordinateIds.map(id => Number(id))
    };
  }

  /**
   * Set or update manager for an employee (Child sets Parent)
   */
  async setManager(employeeId: bigint, setManagerDto: SetManagerDto) {
    // Verify employee exists
    const employee = await this.repository.findById(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // If removing manager
    if (setManagerDto.managerId === undefined || setManagerDto.managerId === null) {
      await this.repository.updateManager(employeeId, null);
      return {
        message: 'Manager removed successfully',
        employeeId: Number(employeeId),
        managerId: null
      };
    }

    const managerId = BigInt(setManagerDto.managerId);

    // Verify manager exists
    const manager = await this.repository.findById(managerId);
    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    // Employee cannot be their own manager
    if (managerId === employeeId) {
      throw new BadRequestException('Employee cannot be their own manager');
    }

    // Validate no circular dependencies
    await this.validateNoCyclicDependency(managerId, [employeeId]);

    await this.repository.updateManager(employeeId, managerId);

    return {
      message: 'Manager set successfully',
      employeeId: Number(employeeId),
      managerId: Number(managerId)
    };
  }

  /**
   * Get organization tree for an employee
   */
  async getOrganizationTree(employeeId: bigint): Promise<OrganizationTreeDto> {
    const employee = await this.repository.findWithHierarchy(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Get management chain (from employee to top)
    const managementChain = await this.getManagementChain(employeeId);
    
    // Get all subordinates
    const subordinates = await this.repository.findSubordinates(employeeId);
    
    // Get siblings (employees with same manager)
    const siblings = employee.managerId 
      ? await this.repository.findSiblings(employeeId, employee.managerId)
      : [];

    return {
      manager: employee.manager ? this.transformEmployee(employee.manager) : undefined,
      employee: this.transformEmployee(employee),
      subordinates: subordinates.map(sub => this.transformEmployee(sub)),
      siblings: siblings.map(sib => this.transformEmployee(sib)),
      managementChain: managementChain.map(emp => this.transformEmployee(emp))
    };
  }

  /**
   * Get all subordinates recursively
   */
  async getAllSubordinates(managerId: bigint): Promise<EmployeeHierarchyResponseDto[]> {
    const allSubordinates = await this.repository.findAllSubordinatesRecursive(managerId);
    return allSubordinates.map(emp => this.transformEmployee(emp));
  }

  /**
   * Get management chain from employee to top
   */
  async getManagementChain(employeeId: bigint): Promise<any[]> {
    const chain = [];
    let currentEmployee = await this.repository.findWithManager(employeeId);
    
    while (currentEmployee?.manager) {
      chain.push(currentEmployee.manager);
      currentEmployee = await this.repository.findWithManager(currentEmployee.manager.id);
    }
    
    return chain;
  }

  /**
   * Validate that assigning these relationships won't create cycles
   */
  private async validateNoCyclicDependency(managerId: bigint, subordinateIds: bigint[]) {
    for (const subordinateId of subordinateIds) {
      const managementChain = await this.getManagementChain(managerId);
      const chainIds = managementChain.map(emp => emp.id);
      
      if (chainIds.includes(subordinateId)) {
        throw new BadRequestException(
          `Circular dependency detected: Employee ${subordinateId} is already in the management chain of manager ${managerId}`
        );
      }
    }
  }

  /**
   * Transform employee to hierarchy response DTO
   */
  private transformEmployee(employee: any): EmployeeHierarchyResponseDto {
    return {
      id: Number(employee.id),
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      department: employee.department,
      managerId: employee.managerId ? Number(employee.managerId) : undefined
    };
  }
}
