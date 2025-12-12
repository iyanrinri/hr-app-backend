import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, OvertimeRequest } from '@prisma/client';

@Injectable()
export class OvertimeRequestRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OvertimeRequestCreateInput): Promise<OvertimeRequest> {
    return this.prisma.overtimeRequest.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.OvertimeRequestWhereUniqueInput;
    where?: Prisma.OvertimeRequestWhereInput;
    orderBy?: Prisma.OvertimeRequestOrderByWithRelationInput;
    include?: Prisma.OvertimeRequestInclude;
  }): Promise<OvertimeRequest[]> {
    const { skip, take, cursor, where, orderBy, include } = params;
    
    return this.prisma.overtimeRequest.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findUnique(
    where: Prisma.OvertimeRequestWhereUniqueInput,
    include?: Prisma.OvertimeRequestInclude
  ): Promise<OvertimeRequest | null> {
    return this.prisma.overtimeRequest.findUnique({
      where,
      include,
    });
  }

  async findByEmployee(employeeId: bigint, params?: {
    skip?: number;
    take?: number;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<OvertimeRequest[]> {
    const { skip = 0, take = 20, status, startDate, endDate } = params || {};

    const where: Prisma.OvertimeRequestWhereInput = {
      employeeId,
    };

    if (status) {
      where.status = status as any;
    }

    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }

    return this.prisma.overtimeRequest.findMany({
      skip,
      take,
      where,
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
        },
        approvals: {
          include: {
            approver: {
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
      orderBy: { submittedAt: 'desc' }
    });
  }

  async findPendingRequests(params?: {
    skip?: number;
    take?: number;
    managerId?: bigint;
  }): Promise<OvertimeRequest[]> {
    const { skip = 0, take = 20, managerId } = params || {};

    const where: Prisma.OvertimeRequestWhereInput = {
      status: {
        in: ['PENDING', 'MANAGER_APPROVED']
      }
    };

    if (managerId) {
      where.employee = {
        managerId
      };
    }

    return this.prisma.overtimeRequest.findMany({
      skip,
      take,
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            department: true,
            managerId: true
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
        },
        approvals: {
          include: {
            approver: {
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
      orderBy: { submittedAt: 'asc' }
    });
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
    employeeId?: bigint
  ): Promise<OvertimeRequest[]> {
    const where: Prisma.OvertimeRequestWhereInput = {
      date: {
        gte: startDate,
        lte: endDate
      }
    };

    if (employeeId) {
      where.employeeId = employeeId;
    }

    return this.prisma.overtimeRequest.findMany({
      where,
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
      },
      orderBy: { date: 'desc' }
    });
  }

  async checkExistingRequest(
    employeeId: bigint,
    date: Date
  ): Promise<OvertimeRequest | null> {
    return this.prisma.overtimeRequest.findFirst({
      where: {
        employeeId,
        date,
        status: {
          notIn: ['REJECTED', 'CANCELLED']
        }
      }
    });
  }

  async findAttendanceByDate(
    employeeId: bigint,
    date: Date
  ): Promise<{ id: bigint } | null> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      select: {
        id: true
      }
    });
  }

  async update(
    where: Prisma.OvertimeRequestWhereUniqueInput,
    data: Prisma.OvertimeRequestUpdateInput
  ): Promise<OvertimeRequest> {
    return this.prisma.overtimeRequest.update({
      where,
      data,
    });
  }

  async delete(where: Prisma.OvertimeRequestWhereUniqueInput): Promise<OvertimeRequest> {
    return this.prisma.overtimeRequest.delete({ where });
  }

  async count(where?: Prisma.OvertimeRequestWhereInput): Promise<number> {
    return this.prisma.overtimeRequest.count({ where });
  }

  async getTotalOvertimeMinutes(
    employeeId: bigint,
    startDate: Date,
    endDate: Date,
    status?: string
  ): Promise<number> {
    const where: Prisma.OvertimeRequestWhereInput = {
      employeeId,
      date: {
        gte: startDate,
        lte: endDate
      }
    };

    if (status) {
      where.status = status as any;
    }

    const result = await this.prisma.overtimeRequest.aggregate({
      where,
      _sum: {
        totalMinutes: true
      }
    });

    return result._sum.totalMinutes || 0;
  }

  async getEmployeeIdByUserId(userId: bigint): Promise<bigint | null> {
    const employee = await this.prisma.employee.findFirst({
      where: { userId },
      select: { id: true }
    });
    return employee?.id || null;
  }
}
