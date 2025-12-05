import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttendancePeriodRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AttendancePeriodCreateInput) {
    return this.prisma.attendancePeriod.create({
      data,
      include: {
        holidays: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AttendancePeriodWhereInput;
    orderBy?: Prisma.AttendancePeriodOrderByWithRelationInput;
  }) {
    return this.prisma.attendancePeriod.findMany({
      ...params,
      include: {
        holidays: true,
        _count: {
          select: {
            attendances: true,
            attendanceLogs: true,
          },
        },
      },
    });
  }

  async findOne(where: Prisma.AttendancePeriodWhereUniqueInput) {
    return this.prisma.attendancePeriod.findUnique({
      where,
      include: {
        holidays: true,
        _count: {
          select: {
            attendances: true,
            attendanceLogs: true,
          },
        },
      },
    });
  }

  async update(params: {
    where: Prisma.AttendancePeriodWhereUniqueInput;
    data: Prisma.AttendancePeriodUpdateInput;
  }) {
    return this.prisma.attendancePeriod.update({
      ...params,
      include: {
        holidays: true,
      },
    });
  }

  async delete(where: Prisma.AttendancePeriodWhereUniqueInput) {
    return this.prisma.attendancePeriod.delete({
      where,
    });
  }

  async count(where?: Prisma.AttendancePeriodWhereInput) {
    return this.prisma.attendancePeriod.count({ where });
  }

  async findActivePeriod() {
    const now = new Date();
    return this.prisma.attendancePeriod.findFirst({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        holidays: true,
      },
    });
  }

  // Holiday management
  async createHoliday(data: Prisma.HolidayCreateInput) {
    return this.prisma.holiday.create({
      data,
    });
  }

  async findHolidays(params: {
    where?: Prisma.HolidayWhereInput;
    orderBy?: Prisma.HolidayOrderByWithRelationInput;
  }) {
    return this.prisma.holiday.findMany({
      ...params,
      include: {
        attendancePeriod: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateHoliday(params: {
    where: Prisma.HolidayWhereUniqueInput;
    data: Prisma.HolidayUpdateInput;
  }) {
    return this.prisma.holiday.update({
      ...params,
    });
  }

  async deleteHoliday(where: Prisma.HolidayWhereUniqueInput) {
    return this.prisma.holiday.delete({
      where,
    });
  }

  async findHolidaysByDateRange(startDate: Date, endDate: Date, attendancePeriodId?: bigint) {
    return this.prisma.holiday.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(attendancePeriodId && {
          OR: [
            { attendancePeriodId },
            { attendancePeriodId: null, isNational: true },
          ],
        }),
      },
    });
  }
}