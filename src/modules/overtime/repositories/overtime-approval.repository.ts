import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, OvertimeApproval } from '@prisma/client';

@Injectable()
export class OvertimeApprovalRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OvertimeApprovalCreateInput): Promise<OvertimeApproval> {
    return this.prisma.overtimeApproval.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OvertimeApprovalWhereUniqueInput;
    where?: Prisma.OvertimeApprovalWhereInput;
    orderBy?: Prisma.OvertimeApprovalOrderByWithRelationInput;
    include?: Prisma.OvertimeApprovalInclude;
  }): Promise<OvertimeApproval[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    
    return this.prisma.overtimeApproval.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findUnique(
    where: Prisma.OvertimeApprovalWhereUniqueInput,
    include?: Prisma.OvertimeApprovalInclude
  ): Promise<OvertimeApproval | null> {
    return this.prisma.overtimeApproval.findUnique({
      where,
      include,
    });
  }

  async findByRequest(overtimeRequestId: bigint): Promise<OvertimeApproval[]> {
    return this.prisma.overtimeApproval.findMany({
      where: { overtimeRequestId },
      include: {
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true
          }
        },
        overtimeRequest: {
          select: {
            id: true,
            employeeId: true,
            date: true,
            reason: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findByApprover(
    approverId: bigint,
    params?: {
      skip?: number;
      take?: number;
      status?: string;
      approverType?: string;
    }
  ): Promise<OvertimeApproval[]> {
    const { skip = 0, take = 20, status, approverType } = params || {};

    const where: Prisma.OvertimeApprovalWhereInput = {
      approverId,
    };

    if (status) {
      where.status = status as any;
    }

    if (approverType) {
      where.approverType = approverType;
    }

    return this.prisma.overtimeApproval.findMany({
      skip,
      take,
      where,
      include: {
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true
          }
        },
        overtimeRequest: {
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
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findPendingApprovals(
    approverId?: bigint,
    approverType?: string
  ): Promise<OvertimeApproval[]> {
    const where: Prisma.OvertimeApprovalWhereInput = {
      status: 'PENDING'
    };

    if (approverId) {
      where.approverId = approverId;
    }

    if (approverType) {
      where.approverType = approverType;
    }

    return this.prisma.overtimeApproval.findMany({
      where,
      include: {
        approver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true
          }
        },
        overtimeRequest: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                department: true
              }
            },
            attendance: {
              select: {
                id: true,
                date: true,
                checkIn: true,
                checkOut: true,
                workDuration: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async findExisting(
    overtimeRequestId: bigint,
    approverId: bigint,
    approverType: string
  ): Promise<OvertimeApproval | null> {
    return this.prisma.overtimeApproval.findUnique({
      where: {
        overtimeRequestId_approverId_approverType: {
          overtimeRequestId,
          approverId,
          approverType
        }
      }
    });
  }

  async update(
    where: Prisma.OvertimeApprovalWhereUniqueInput,
    data: Prisma.OvertimeApprovalUpdateInput
  ): Promise<OvertimeApproval> {
    return this.prisma.overtimeApproval.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.OvertimeApprovalWhereUniqueInput): Promise<OvertimeApproval> {
    return this.prisma.overtimeApproval.delete({ where });
  }

  async count(where?: Prisma.OvertimeApprovalWhereInput): Promise<number> {
    return this.prisma.overtimeApproval.count({ where });
  }

  async getApprovalStats(approverId?: bigint, startDate?: Date, endDate?: Date) {
    const where: Prisma.OvertimeApprovalWhereInput = {};

    if (approverId) {
      where.approverId = approverId;
    }

    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate
      };
    }

    const stats = await this.prisma.overtimeApproval.groupBy({
      by: ['status'],
      where,
      _count: {
        status: true
      }
    });

    return stats.reduce((acc, curr) => {
      acc[curr.status] = curr._count.status;
      return acc;
    }, {} as Record<string, number>);
  }
}
