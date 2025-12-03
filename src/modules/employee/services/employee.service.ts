import { Injectable, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
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
    const { email, password, ...employeeData } = createEmployeeDto;

    // Hash the password from request body
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return await this.repository.create({
        ...employeeData,
        user: {
          create: {
            email,
            password: hashedPassword,
            role: 'EMPLOYEE',
          },
        },
      });
    } catch (error) {
      const meta = parsePrismaError(error);
      if (meta?.code === 409) {
        throw new ConflictException(meta.message);
      }
      throw error;
    }
  }

  async findAll(query: FindAllEmployeesDto, userRole: Role) {
    // Determine role filter based on user role
    let roleFilter = {};
    if (userRole === Role.HR) {
      // HR can only see EMPLOYEE, MANAGER roles (exclude SUPER, ADMIN, HR)
      roleFilter = {
        user: {
          role: {
            in: [Role.EMPLOYEE, Role.MANAGER]
          }
        }
      };
    }
    // SUPER can see all roles (no filter applied)

    let employees;
    let total = 0;
    
    if (query.paginated === 1) {
      // Paginated response
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      // Get total count for pagination meta
      total = await this.repository.count(roleFilter);

      employees = await this.repository.findAll({
        skip,
        take: limit,
        where: roleFilter,
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
        where: roleFilter,
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
        createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
        updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
        user: emp.user ? {
          ...emp.user,
          id: emp.user.id.toString(),
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
      createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : emp.createdAt,
      updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : emp.updatedAt,
      user: emp.user ? {
        ...emp.user,
        id: emp.user.id.toString(),
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

    const { email, ...data } = updateEmployeeDto as any; // Handle email update separately if needed
    return this.repository.update({
      where: { id },
      data: data,
    });
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

    return this.repository.remove({ id });
  }
}
