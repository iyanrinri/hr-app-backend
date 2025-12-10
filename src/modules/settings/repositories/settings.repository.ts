import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { SettingsFilterDto } from '../dto/settings-filter.dto';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSettingDto & { createdBy: bigint; updatedBy: bigint }) {
    return this.prisma.setting.create({
      data: {
        ...data,
        dataType: data.dataType as any,
        category: data.category as any,
      },
    });
  }

  async findByKey(key: string) {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async update(key: string, data: UpdateSettingDto & { updatedBy: bigint }) {
    return this.prisma.setting.update({
      where: { key },
      data: {
        ...data,
        dataType: data.dataType ? data.dataType as any : undefined,
        category: data.category ? data.category as any : undefined,
      },
    });
  }

  async delete(key: string) {
    return this.prisma.setting.delete({
      where: { key },
    });
  }

  async findAll(filter: SettingsFilterDto) {
    const {
      page = 1,
      limit = 10,
      category,
      isPublic,
      searchTerm,
    } = filter;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.SettingWhereInput = {};

    if (category) {
      where.category = category as any;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (searchTerm) {
      where.OR = [
        { key: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    return this.prisma.setting.findMany({
      where,
      skip,
      take,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' },
      ],
    });
  }

  async count(filter: SettingsFilterDto) {
    const {
      category,
      isPublic,
      searchTerm,
    } = filter;

    const where: Prisma.SettingWhereInput = {};

    if (category) {
      where.category = category as any;
    }

    if (isPublic !== undefined) {
      where.isPublic = isPublic;
    }

    if (searchTerm) {
      where.OR = [
        { key: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    return this.prisma.setting.count({ where });
  }

  async getByCategory(category: string) {
    return this.prisma.setting.findMany({
      where: { category: category as any },
      orderBy: { key: 'asc' },
    });
  }

  async getPublicSettings() {
    return this.prisma.setting.findMany({
      where: { isPublic: true },
      select: {
        key: true,
        value: true,
        category: true,
        description: true,
        dataType: true,
      },
      orderBy: [
        { category: 'asc' },
        { key: 'asc' },
      ],
    });
  }

  async createMany(settings: any[]) {
    const data = settings.map(setting => ({
      ...setting,
      dataType: setting.dataType as any,
      category: setting.category as any,
    }));
    
    return this.prisma.setting.createMany({
      data,
      skipDuplicates: true,
    });
  }
}