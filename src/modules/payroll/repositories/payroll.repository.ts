import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { PayrollQueryDto, PayrollStatus } from '../dto/payroll-query.dto';

@Injectable()
export class PayrollRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PayrollCreateInput) {
    return this.prisma.payroll.create({
      data,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
        processor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findMany(query: PayrollQueryDto) {
    const {
      employeeId,
      department,
      periodStartFrom,
      periodStartTo,
      periodEndFrom,
      periodEndTo,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const where: Prisma.PayrollWhereInput = {};

    // Employee filter
    if (employeeId) {
      where.employeeId = BigInt(employeeId);
    }

    // Department filter
    if (department) {
      where.employee = {
        department: {
          contains: department,
          mode: 'insensitive',
        },
      };
    }

    // Period filters
    if (periodStartFrom && periodStartTo) {
      where.periodStart = {
        gte: new Date(periodStartFrom),
        lte: new Date(periodStartTo),
      };
    } else if (periodStartFrom) {
      where.periodStart = {
        gte: new Date(periodStartFrom),
      };
    } else if (periodStartTo) {
      where.periodStart = {
        lte: new Date(periodStartTo),
      };
    }

    if (periodEndFrom && periodEndTo) {
      where.periodEnd = {
        gte: new Date(periodEndFrom),
        lte: new Date(periodEndTo),
      };
    } else if (periodEndFrom) {
      where.periodEnd = {
        gte: new Date(periodEndFrom),
      };
    } else if (periodEndTo) {
      where.periodEnd = {
        lte: new Date(periodEndTo),
      };
    }

    // Status filter
    if (status) {
      switch (status) {
        case PayrollStatus.PENDING:
          where.processedAt = null;
          where.isPaid = false;
          break;
        case PayrollStatus.PROCESSED:
          where.processedAt = { not: null };
          where.isPaid = false;
          break;
        case PayrollStatus.PAID:
          where.isPaid = true;
          break;
      }
    }

    const orderBy: Prisma.PayrollOrderByWithRelationInput = {};
    if (sortBy === 'employee') {
      orderBy.employee = { firstName: sortOrder };
    } else {
      orderBy[sortBy as keyof Prisma.PayrollOrderByWithRelationInput] = sortOrder;
    }

    const [payrolls, total] = await Promise.all([
      this.prisma.payroll.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              department: true,
            },
          },
          processor: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.payroll.count({ where }),
    ]);

    return {
      data: payrolls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.prisma.payroll.findUnique({
      where: { id: BigInt(id) },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
        processor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findByEmployeeAndPeriod(
    employeeId: string,
    periodStart: Date,
    periodEnd: Date,
  ) {
    return this.prisma.payroll.findFirst({
      where: {
        employeeId: BigInt(employeeId),
        OR: [
          {
            AND: [
              { periodStart: { lte: periodStart } },
              { periodEnd: { gte: periodStart } },
            ],
          },
          {
            AND: [
              { periodStart: { lte: periodEnd } },
              { periodEnd: { gte: periodEnd } },
            ],
          },
          {
            AND: [
              { periodStart: { gte: periodStart } },
              { periodEnd: { lte: periodEnd } },
            ],
          },
        ],
      },
    });
  }

  async update(id: string, data: Prisma.PayrollUpdateInput) {
    return this.prisma.payroll.update({
      where: { id: BigInt(id) },
      data,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
          },
        },
        processor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async updateMany(ids: string[], data: Prisma.PayrollUpdateInput) {
    return this.prisma.payroll.updateMany({
      where: {
        id: {
          in: ids.map(id => BigInt(id)),
        },
      },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.payroll.delete({
      where: { id: BigInt(id) },
    });
  }

  async getPayrollSummary(employeeId?: string) {
    const where: Prisma.PayrollWhereInput = {};
    if (employeeId) {
      where.employeeId = BigInt(employeeId);
    }

    const result = await this.prisma.payroll.aggregate({
      where,
      _sum: {
        baseSalary: true,
        overtimePay: true,
        deductions: true,
        bonuses: true,
        grossSalary: true,
        netSalary: true,
        overtimeHours: true,
        regularHours: true,
      },
      _count: {
        id: true,
      },
    });

    return {
      totalPayrolls: result._count.id,
      totalBaseSalary: result._sum.baseSalary?.toString() || '0',
      totalOvertimePay: result._sum.overtimePay?.toString() || '0',
      totalDeductions: result._sum.deductions?.toString() || '0',
      totalBonuses: result._sum.bonuses?.toString() || '0',
      totalGrossSalary: result._sum.grossSalary?.toString() || '0',
      totalNetSalary: result._sum.netSalary?.toString() || '0',
      totalOvertimeHours: result._sum.overtimeHours?.toString() || '0',
      totalRegularHours: result._sum.regularHours?.toString() || '0',
    };
  }
}