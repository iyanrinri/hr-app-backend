import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeaveBalanceRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LeaveBalanceCreateInput) {
    return this.prisma.leaveBalance.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.LeaveBalanceWhereInput;
    orderBy?: Prisma.LeaveBalanceOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.leaveBalance.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, position: true }
        },
        leavePeriod: {
          select: { id: true, name: true }
        },
        leaveTypeConfig: {
          select: { id: true, name: true, type: true }
        }
      },
    });
  }

  async findByEmployee(employeeId: bigint, leavePeriodId?: bigint) {
    return this.prisma.leaveBalance.findMany({
      where: { 
        employeeId,
        ...(leavePeriodId && { leavePeriodId })
      },
      include: {
        leaveTypeConfig: {
          select: { 
            id: true, 
            name: true, 
            type: true,
            maxConsecutiveDays: true,
            advanceNoticeDays: true,
            isCarryForward: true,
            maxCarryForward: true
          }
        },
        leavePeriod: {
          select: { id: true, name: true, isActive: true }
        }
      },
    });
  }

  async findByEmployeeAndType(employeeId: bigint, leaveTypeConfigId: bigint) {
    return this.prisma.leaveBalance.findUnique({
      where: { 
        employeeId_leavePeriodId_leaveTypeConfigId: {
          employeeId,
          leavePeriodId: 0, // Will be updated when we know the period
          leaveTypeConfigId
        }
      },
      include: {
        leaveTypeConfig: true,
        leavePeriod: true
      }
    });
  }

  async findSpecific(employeeId: bigint, leavePeriodId: bigint, leaveTypeConfigId: bigint) {
    return this.prisma.leaveBalance.findUnique({
      where: { 
        employeeId_leavePeriodId_leaveTypeConfigId: {
          employeeId,
          leavePeriodId,
          leaveTypeConfigId
        }
      },
      include: {
        leaveTypeConfig: true,
        leavePeriod: true
      }
    });
  }

  async update(id: bigint, data: Prisma.LeaveBalanceUpdateInput) {
    return this.prisma.leaveBalance.update({
      where: { id },
      data,
    });
  }

  async updateSpecific(
    employeeId: bigint, 
    leavePeriodId: bigint, 
    leaveTypeConfigId: bigint, 
    data: Prisma.LeaveBalanceUpdateInput
  ) {
    return this.prisma.leaveBalance.update({
      where: {
        employeeId_leavePeriodId_leaveTypeConfigId: {
          employeeId,
          leavePeriodId,
          leaveTypeConfigId
        }
      },
      data,
    });
  }

  async createOrUpdate(
    employeeId: bigint, 
    leavePeriodId: bigint, 
    leaveTypeConfigId: bigint, 
    data: Partial<Prisma.LeaveBalanceCreateInput>
  ) {
    return this.prisma.leaveBalance.upsert({
      where: {
        employeeId_leavePeriodId_leaveTypeConfigId: {
          employeeId,
          leavePeriodId,
          leaveTypeConfigId
        }
      },
      update: data,
      create: {
        employeeId,
        leavePeriodId,
        leaveTypeConfigId,
        ...data
      } as Prisma.LeaveBalanceCreateInput,
    });
  }

  async delete(id: bigint) {
    return this.prisma.leaveBalance.delete({
      where: { id },
    });
  }

  async count(where?: Prisma.LeaveBalanceWhereInput) {
    return this.prisma.leaveBalance.count({ where });
  }

  async findActivePeriod() {
    return this.prisma.leavePeriod.findFirst({
      where: { isActive: true },
      orderBy: { startDate: 'desc' }
    });
  }

  async updateQuotas(
    employeeId: bigint,
    leavePeriodId: bigint,
    leaveTypeConfigId: bigint,
    usedDays: number
  ) {
    return this.prisma.leaveBalance.update({
      where: {
        employeeId_leavePeriodId_leaveTypeConfigId: {
          employeeId,
          leavePeriodId,
          leaveTypeConfigId
        }
      },
      data: {
        usedQuota: {
          increment: usedDays
        }
      }
    });
  }

  async initializeBalance(
    employeeId: bigint,
    leaveTypeConfigId: bigint,
    customQuota?: number
  ) {
    // First find the active period
    const activePeriod = await this.findActivePeriod();
    if (!activePeriod) {
      throw new Error('No active leave period found');
    }

    // Get the leave type config to determine default quota
    const leaveTypeConfig = await this.prisma.leaveTypeConfig.findUnique({
      where: { id: leaveTypeConfigId }
    });

    if (!leaveTypeConfig) {
      throw new Error('Leave type config not found');
    }

    const quota = customQuota || leaveTypeConfig.defaultQuota || 0;

    const result = await this.createOrUpdate(
      employeeId,
      activePeriod.id,
      leaveTypeConfigId,
      {
        totalQuota: quota,
        usedQuota: 0
      }
    );

    // Return with includes for consistency
    return this.findSpecific(employeeId, activePeriod.id, leaveTypeConfigId);
  }
}