import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Salary } from '@prisma/client';

@Injectable()
export class SalaryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SalaryCreateInput): Promise<Salary> {
    return this.prisma.salary.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SalaryWhereUniqueInput;
    where?: Prisma.SalaryWhereInput;
    orderBy?: Prisma.SalaryOrderByWithRelationInput;
    include?: Prisma.SalaryInclude;
  }): Promise<Salary[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    
    return this.prisma.salary.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findUnique(where: Prisma.SalaryWhereUniqueInput, include?: Prisma.SalaryInclude): Promise<Salary | null> {
    return this.prisma.salary.findUnique({
      where,
      include,
    });
  }

  async findFirst(where: Prisma.SalaryWhereInput, include?: Prisma.SalaryInclude): Promise<Salary | null> {
    return this.prisma.salary.findFirst({
      where,
      include,
    });
  }

  async findCurrentSalary(employeeId: bigint): Promise<Salary | null> {
    return this.prisma.salary.findFirst({
      where: {
        employeeId,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true
          }
        }
      },
      orderBy: { effectiveDate: 'desc' }
    });
  }

  async findEmployeeSalaryHistory(employeeId: bigint): Promise<Salary[]> {
    return this.prisma.salary.findMany({
      where: { employeeId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true
          }
        }
      },
      orderBy: { effectiveDate: 'desc' }
    });
  }

  async update(where: Prisma.SalaryWhereUniqueInput, data: Prisma.SalaryUpdateInput): Promise<Salary> {
    return this.prisma.salary.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.SalaryWhereUniqueInput): Promise<Salary> {
    return this.prisma.salary.delete({ where });
  }

  async count(where?: Prisma.SalaryWhereInput): Promise<number> {
    return this.prisma.salary.count({ where });
  }

  async endCurrentSalary(employeeId: bigint, endDate: Date): Promise<Salary[]> {
    return this.prisma.salary.updateMany({
      where: {
        employeeId,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } }
        ]
      },
      data: {
        endDate,
        isActive: false
      }
    }) as any;
  }
}
