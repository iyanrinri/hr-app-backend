import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma, AttendanceType } from '@prisma/client';

@Injectable()
export class AttendanceRepository {
  constructor(private prisma: PrismaService) {}

  async findTodayAttendance(employeeId: bigint, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        attendancePeriod: true,
        employee: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async createAttendance(data: Prisma.AttendanceCreateInput) {
    return this.prisma.attendance.create({
      data,
      include: {
        attendancePeriod: true,
        employee: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async updateAttendance(params: {
    where: Prisma.AttendanceWhereUniqueInput;
    data: Prisma.AttendanceUpdateInput;
  }) {
    return this.prisma.attendance.update({
      ...params,
      include: {
        attendancePeriod: true,
        employee: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async createAttendanceLog(data: Prisma.AttendanceLogCreateInput) {
    return this.prisma.attendanceLog.create({
      data,
    });
  }

  async findAttendanceHistory(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AttendanceWhereInput;
    orderBy?: Prisma.AttendanceOrderByWithRelationInput;
  }) {
    return this.prisma.attendance.findMany({
      ...params,
      include: {
        attendancePeriod: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
          },
        },
        employee: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async countAttendance(where?: Prisma.AttendanceWhereInput) {
    return this.prisma.attendance.count({ where });
  }

  async findAttendanceLogs(params: {
    where?: Prisma.AttendanceLogWhereInput;
    orderBy?: Prisma.AttendanceLogOrderByWithRelationInput;
    take?: number;
  }) {
    return this.prisma.attendanceLog.findMany({
      ...params,
      include: {
        employee: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        },
        attendancePeriod: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getLatestLog(employeeId: bigint, date: Date, type?: AttendanceType) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.attendanceLog.findFirst({
      where: {
        employeeId,
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
        ...(type && { type }),
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async findAttendanceWithLogs(attendanceId: bigint) {
    return this.prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        attendancePeriod: true,
        employee: {
          include: {
            user: {
              select: {
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });
  }

  async getAttendanceStats(employeeId: bigint, startDate: Date, endDate: Date) {
    const stats = await this.prisma.attendance.groupBy({
      by: ['status'],
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        status: true,
      },
    });

    const totalWorkDuration = await this.prisma.attendance.aggregate({
      where: {
        employeeId,
        date: {
          gte: startDate,
          lte: endDate,
        },
        workDuration: {
          not: null,
        },
      },
      _sum: {
        workDuration: true,
      },
    });

    return {
      statusCounts: stats.reduce((acc, curr) => {
        acc[curr.status] = curr._count.status;
        return acc;
      }, {} as Record<string, number>),
      totalWorkDuration: totalWorkDuration._sum.workDuration || 0,
    };
  }

  async findEmployeeById(employeeId: number) {
    return this.prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        position: true,
        department: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });
  }
}