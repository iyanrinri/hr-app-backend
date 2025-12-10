import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeavePeriodRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LeavePeriodCreateInput) {
    return this.prisma.leavePeriod.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.LeavePeriodWhereInput;
    orderBy?: Prisma.LeavePeriodOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.leavePeriod.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        leaveTypes: true,
        _count: {
          select: {
            leaveBalances: true,
            leaveRequests: true
          }
        }
      },
    });
  }

  async findById(id: bigint) {
    return this.prisma.leavePeriod.findUnique({
      where: { id },
      include: {
        leaveTypes: true,
        leaveBalances: {
          include: {
            employee: {
              select: { id: true, firstName: true, lastName: true, department: true }
            }
          }
        }
      },
    });
  }

  async findActive() {
    return this.prisma.leavePeriod.findFirst({
      where: { isActive: true },
      include: {
        leaveTypes: {
          where: { isActive: true }
        }
      },
    });
  }

  async update(id: bigint, data: Prisma.LeavePeriodUpdateInput) {
    return this.prisma.leavePeriod.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint) {
    return this.prisma.leavePeriod.delete({
      where: { id },
    });
  }

  async count(where?: Prisma.LeavePeriodWhereInput) {
    return this.prisma.leavePeriod.count({ where });
  }
}