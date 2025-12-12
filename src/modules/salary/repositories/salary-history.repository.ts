import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, SalaryHistory } from '@prisma/client';

@Injectable()
export class SalaryHistoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SalaryHistoryCreateInput): Promise<SalaryHistory> {
    return this.prisma.salaryHistory.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.SalaryHistoryWhereUniqueInput;
    where?: Prisma.SalaryHistoryWhereInput;
    orderBy?: Prisma.SalaryHistoryOrderByWithRelationInput;
    include?: Prisma.SalaryHistoryInclude;
  }): Promise<SalaryHistory[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    
    return this.prisma.salaryHistory.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findUnique(where: Prisma.SalaryHistoryWhereUniqueInput, include?: Prisma.SalaryHistoryInclude): Promise<SalaryHistory | null> {
    return this.prisma.salaryHistory.findUnique({
      where,
      include,
    });
  }

  async findEmployeeHistory(employeeId: bigint): Promise<SalaryHistory[]> {
    return this.prisma.salaryHistory.findMany({
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

  async findByDateRange(employeeId: bigint, startDate: Date, endDate: Date): Promise<SalaryHistory[]> {
    return this.prisma.salaryHistory.findMany({
      where: {
        employeeId,
        effectiveDate: {
          gte: startDate,
          lte: endDate
        }
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

  async findByChangeType(changeType: string): Promise<SalaryHistory[]> {
    return this.prisma.salaryHistory.findMany({
      where: { changeType: changeType as any },
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

  async count(where?: Prisma.SalaryHistoryWhereInput): Promise<number> {
    return this.prisma.salaryHistory.count({ where });
  }
}
