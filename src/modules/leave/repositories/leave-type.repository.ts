import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeaveTypeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LeaveTypeConfigCreateInput) {
    return this.prisma.leaveTypeConfig.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.LeaveTypeConfigWhereInput;
    orderBy?: Prisma.LeaveTypeConfigOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.leaveTypeConfig.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        leavePeriod: {
          select: { id: true, name: true, isActive: true }
        },
        _count: {
          select: {
            leaveBalances: true,
            leaveRequests: true
          }
        }
      },
    });
  }

  async findById(id: number) {
    return this.prisma.leaveTypeConfig.findUnique({
      where: { id: BigInt(id) },
      include: {
        leavePeriod: true,
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

  async findByPeriod(leavePeriodId: bigint, activeOnly = false) {
    return this.prisma.leaveTypeConfig.findMany({
      where: { 
        leavePeriodId,
        ...(activeOnly && { isActive: true })
      },
      include: {
        _count: {
          select: {
            leaveBalances: true,
            leaveRequests: true
          }
        }
      },
    });
  }

  async findByTypeAndPeriod(type: string, leavePeriodId: bigint) {
    return this.prisma.leaveTypeConfig.findFirst({
      where: { 
        type: type as any,
        leavePeriodId,
        isActive: true
      },
    });
  }

  async update(id: number, data: Prisma.LeaveTypeConfigUpdateInput) {
    return this.prisma.leaveTypeConfig.update({
      where: { id: BigInt(id) },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.leaveTypeConfig.delete({
      where: { id: BigInt(id) },
    });
  }

  async isUsedInBalancesOrRequests(id: number): Promise<boolean> {
    const balanceCount = await this.prisma.leaveBalance.count({
      where: { leaveTypeConfigId: BigInt(id) }
    });
    
    const requestCount = await this.prisma.leaveRequest.count({
      where: { leaveTypeConfigId: BigInt(id) }
    });

    return balanceCount > 0 || requestCount > 0;
  }

  async count(where?: Prisma.LeaveTypeConfigWhereInput) {
    return this.prisma.leaveTypeConfig.count({ where });
  }
}