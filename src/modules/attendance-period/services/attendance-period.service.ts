import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { AttendancePeriodRepository } from '../repositories/attendance-period.repository';
import { CreateAttendancePeriodDto } from '../dto/create-attendance-period.dto';
import { UpdateAttendancePeriodDto } from '../dto/update-attendance-period.dto';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { FindAllPeriodsDto } from '../dto/find-all-periods.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AttendancePeriodService {
  constructor(private repository: AttendancePeriodRepository) {}

  async create(createDto: CreateAttendancePeriodDto, userId: string) {
    const startDate = new Date(createDto.startDate);
    const endDate = new Date(createDto.endDate);

    // Validate dates
    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // Check for overlapping periods
    const overlapping = await this.repository.findAll({
      where: {
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (overlapping.length > 0) {
      throw new ConflictException('Attendance period overlaps with existing period');
    }

    return await this.repository.create({
      name: createDto.name,
      startDate,
      endDate,
      workingDaysPerWeek: createDto.workingDaysPerWeek || 5,
      workingHoursPerDay: createDto.workingHoursPerDay || 8,
      description: createDto.description,
      isActive: createDto.isActive ?? true,
      createdBy: BigInt(userId),
    });
  }

  async findAll(query: FindAllPeriodsDto) {
    let whereCondition: any = {};

    // Search filter
    if (query.search) {
      whereCondition.name = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    // Active status filter
    if (query.isActive !== undefined) {
      whereCondition.isActive = query.isActive;
    }

    if (query.page && query.limit) {
      // Paginated response
      const page = query.page;
      const limit = query.limit;
      const skip = (page - 1) * limit;

      const total = await this.repository.count(whereCondition);
      const periods = await this.repository.findAll({
        skip,
        take: limit,
        where: whereCondition,
        orderBy: { startDate: 'desc' },
      });

      return {
        data: this.transformPeriods(periods),
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      };
    } else {
      // Non-paginated response
      const periods = await this.repository.findAll({
        where: whereCondition,
        orderBy: { startDate: 'desc' },
      });

      return this.transformPeriods(periods);
    }
  }

  async findOne(id: bigint) {
    const period = await this.repository.findOne({ id });
    
    if (!period) {
      throw new NotFoundException('Attendance period not found');
    }

    return this.transformPeriod(period);
  }

  async update(id: bigint, updateDto: UpdateAttendancePeriodDto) {
    const existingPeriod = await this.repository.findOne({ id });
    
    if (!existingPeriod) {
      throw new NotFoundException('Attendance period not found');
    }

    const updateData: any = {};

    if (updateDto.name !== undefined) updateData.name = updateDto.name;
    if (updateDto.description !== undefined) updateData.description = updateDto.description;
    if (updateDto.isActive !== undefined) updateData.isActive = updateDto.isActive;
    if (updateDto.workingDaysPerWeek !== undefined) updateData.workingDaysPerWeek = updateDto.workingDaysPerWeek;
    if (updateDto.workingHoursPerDay !== undefined) updateData.workingHoursPerDay = updateDto.workingHoursPerDay;

    // Handle date updates with validation
    if (updateDto.startDate || updateDto.endDate) {
      const startDate = updateDto.startDate ? new Date(updateDto.startDate) : existingPeriod.startDate;
      const endDate = updateDto.endDate ? new Date(updateDto.endDate) : existingPeriod.endDate;

      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      updateData.startDate = startDate;
      updateData.endDate = endDate;

      // Check for overlapping periods (exclude current period)
      const overlapping = await this.repository.findAll({
        where: {
          id: { not: id },
          OR: [
            {
              startDate: { lte: endDate },
              endDate: { gte: startDate },
            },
          ],
        },
      });

      if (overlapping.length > 0) {
        throw new ConflictException('Updated attendance period would overlap with existing period');
      }
    }

    const updated = await this.repository.update({
      where: { id },
      data: updateData,
    });

    return this.transformPeriod(updated);
  }

  async remove(id: bigint) {
    const period = await this.repository.findOne({ id });
    
    if (!period) {
      throw new NotFoundException('Attendance period not found');
    }

    // Check if period has attendance records
    const periodWithCounts = period as any;
    if (periodWithCounts._count?.attendances > 0 || periodWithCounts._count?.attendanceLogs > 0) {
      throw new BadRequestException('Cannot delete attendance period with existing attendance records');
    }

    await this.repository.delete({ id });
    return { message: 'Attendance period deleted successfully' };
  }

  async getActivePeriod() {
    const activePeriod = await this.repository.findActivePeriod();
    
    if (!activePeriod) {
      throw new NotFoundException('No active attendance period found');
    }

    return this.transformPeriod(activePeriod);
  }

  // Holiday management methods
  async createHoliday(createDto: CreateHolidayDto) {
    const holidayDate = new Date(createDto.date);

    // If attendancePeriodId is provided, validate it exists
    if (createDto.attendancePeriodId) {
      const period = await this.repository.findOne({ id: createDto.attendancePeriodId });
      if (!period) {
        throw new NotFoundException('Attendance period not found');
      }
    }

    return await this.repository.createHoliday({
      name: createDto.name,
      date: holidayDate,
      isNational: createDto.isNational || false,
      isRecurring: createDto.isRecurring || false,
      description: createDto.description,
      ...(createDto.attendancePeriodId && {
        attendancePeriod: {
          connect: { id: createDto.attendancePeriodId },
        },
      }),
    });
  }

  async findHolidays(attendancePeriodId?: bigint) {
    const holidays = await this.repository.findHolidays({
      where: attendancePeriodId 
        ? {
            OR: [
              { attendancePeriodId },
              { attendancePeriodId: null, isNational: true },
            ],
          }
        : undefined,
      orderBy: { date: 'asc' },
    });

    return holidays.map(holiday => ({
      ...holiday,
      id: holiday.id.toString(),
      attendancePeriodId: holiday.attendancePeriodId?.toString(),
      date: holiday.date.toISOString(),
      createdAt: holiday.createdAt.toISOString(),
      updatedAt: holiday.updatedAt.toISOString(),
    }));
  }

  async updateHoliday(id: bigint, updateData: Partial<CreateHolidayDto>) {
    const existingHoliday = await this.repository.findHolidays({
      where: { id },
    });

    if (existingHoliday.length === 0) {
      throw new NotFoundException('Holiday not found');
    }

    const data: any = {};
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.date !== undefined) data.date = new Date(updateData.date);
    if (updateData.isNational !== undefined) data.isNational = updateData.isNational;
    if (updateData.isRecurring !== undefined) data.isRecurring = updateData.isRecurring;
    if (updateData.description !== undefined) data.description = updateData.description;

    return await this.repository.updateHoliday({
      where: { id },
      data,
    });
  }

  async deleteHoliday(id: bigint) {
    const existing = await this.repository.findHolidays({
      where: { id },
    });

    if (existing.length === 0) {
      throw new NotFoundException('Holiday not found');
    }

    await this.repository.deleteHoliday({ id });
    return { message: 'Holiday deleted successfully' };
  }

  async isWorkingDay(date: Date, attendancePeriodId?: bigint): Promise<boolean> {
    // Check if it's weekend (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }

    // Check if it's a holiday
    const holidays = await this.repository.findHolidaysByDateRange(date, date, attendancePeriodId);
    return holidays.length === 0;
  }

  private transformPeriods(periods: any[]) {
    return periods.map(period => this.transformPeriod(period));
  }

  private transformPeriod(period: any) {
    return {
      ...period,
      id: period.id.toString(),
      createdBy: period.createdBy.toString(),
      startDate: period.startDate.toISOString(),
      endDate: period.endDate.toISOString(),
      createdAt: period.createdAt.toISOString(),
      updatedAt: period.updatedAt.toISOString(),
      holidays: period.holidays?.map((holiday: any) => ({
        ...holiday,
        id: holiday.id.toString(),
        date: holiday.date.toISOString(),
        createdAt: holiday.createdAt.toISOString(),
        updatedAt: holiday.updatedAt.toISOString(),
      })),
    };
  }
}