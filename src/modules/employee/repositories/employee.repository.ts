import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Employee } from '@prisma/client';

@Injectable()
export class EmployeeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EmployeeCreateInput): Promise<Employee> {
    return this.prisma.employee.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EmployeeWhereUniqueInput;
    where?: Prisma.EmployeeWhereInput;
    orderBy?: Prisma.EmployeeOrderByWithRelationInput;
  }): Promise<Employee[]> {
    const { skip, take, cursor, where, orderBy } = params;
    
    // Show all employees including soft-deleted ones
    const whereCondition: Prisma.EmployeeWhereInput = {
      ...where,
    };
    
    return this.prisma.employee.findMany({
      skip,
      take,
      cursor,
      where: whereCondition,
      orderBy,
      include: { user: true },
    });
  }

  async count(where?: Prisma.EmployeeWhereInput): Promise<number> {
    // Count all employees including soft-deleted ones
    const whereCondition: Prisma.EmployeeWhereInput = {
      ...where,
    };
    return this.prisma.employee.count({ where: whereCondition });
  }

  async findOne(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: {
        ...where,
        isDeleted: false,
        user: {
          isDeleted: false,
        },
      },
      include: { user: true },
    });
  }

  async update(params: {
    where: Prisma.EmployeeWhereUniqueInput;
    data: Prisma.EmployeeUpdateInput;
  }): Promise<Employee> {
    const { where, data } = params;
    return this.prisma.employee.update({
      data,
      where,
    });
  }

  async softDelete(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee> {
    const now = new Date();
    
    // First find the employee (including soft-deleted to avoid issues)
    const employee = await this.prisma.employee.findUnique({
      where,
      include: { user: true },
    });
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Use transaction to soft delete both employee and user
    return this.prisma.$transaction(async (tx) => {
      // Soft delete the user first
      await tx.user.update({
        where: { id: employee.userId },
        data: {
          isDeleted: true,
          deletedAt: now,
        },
      });
      
      // Then soft delete the employee
      return tx.employee.update({
        where,
        data: {
          isDeleted: true,
          deletedAt: now,
        },
      });
    });
  }

  async restore(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee> {
    // First find the soft-deleted employee
    const employee = await this.prisma.employee.findFirst({
      where: {
        ...where,
        isDeleted: true,
      },
      include: { user: true },
    });
    
    if (!employee) {
      throw new Error('Employee not found or not deleted');
    }
    
    // Use transaction to restore both employee and user
    return this.prisma.$transaction(async (tx) => {
      // Restore the user first
      await tx.user.update({
        where: { id: employee.userId },
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      });
      
      // Then restore the employee
      return tx.employee.update({
        where,
        data: {
          isDeleted: false,
          deletedAt: null,
        },
      });
    });
  }

  async findByUserId(userId: bigint): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  // Hierarchy Management Methods

  async findById(id: bigint): Promise<Employee | null> {
    return this.prisma.employee.findFirst({
      where: { 
        id,
        isDeleted: false,
        user: { isDeleted: false }
      },
    });
  }

  async findByIds(ids: bigint[]): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { 
        id: { in: ids },
        isDeleted: false,
        user: { isDeleted: false }
      },
    });
  }

  async findWithHierarchy(id: bigint): Promise<any | null> {
    return this.prisma.employee.findFirst({
      where: { 
        id,
        isDeleted: false,
        user: { isDeleted: false }
      },
      include: {
        manager: {
          where: { isDeleted: false, user: { isDeleted: false } }
        },
        subordinates: {
          where: { isDeleted: false, user: { isDeleted: false } }
        }
      }
    });
  }

  async findWithManager(id: bigint): Promise<any | null> {
    return this.prisma.employee.findFirst({
      where: { 
        id,
        isDeleted: false,
        user: { isDeleted: false }
      },
      include: {
        manager: {
          where: { isDeleted: false, user: { isDeleted: false } }
        }
      }
    });
  }

  async findSubordinates(managerId: bigint): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { 
        managerId,
        isDeleted: false,
        user: { isDeleted: false }
      },
    });
  }

  async findSiblings(employeeId: bigint, managerId: bigint): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: { 
        managerId,
        id: { not: employeeId },
        isDeleted: false,
        user: { isDeleted: false }
      },
    });
  }

  async findAllSubordinatesRecursive(managerId: bigint): Promise<Employee[]> {
    // This will be a simple implementation. For complex hierarchies, consider using recursive CTEs
    const directSubordinates = await this.findSubordinates(managerId);
    const allSubordinates = [...directSubordinates];

    for (const subordinate of directSubordinates) {
      const subSubordinates = await this.findAllSubordinatesRecursive(subordinate.id);
      allSubordinates.push(...subSubordinates);
    }

    return allSubordinates;
  }

  async updateManager(employeeId: bigint, managerId: bigint | null): Promise<Employee> {
    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { managerId }
    });
  }

  async updateManagerForEmployees(employeeIds: bigint[], managerId: bigint): Promise<void> {
    await this.prisma.employee.updateMany({
      where: { id: { in: employeeIds } },
      data: { managerId }
    });
  }

  async removeAllSubordinates(managerId: bigint): Promise<void> {
    await this.prisma.employee.updateMany({
      where: { managerId: managerId },
      data: { managerId: null }
    });
  }
}
