import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSettingDto } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { SettingsFilterDto } from '../dto/settings-filter.dto';
export declare class SettingsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: CreateSettingDto & {
        createdBy: bigint;
        updatedBy: bigint;
    }): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        isPublic: boolean;
        description: string | null;
        createdBy: bigint;
        updatedBy: bigint;
    }>;
    findByKey(key: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        isPublic: boolean;
        description: string | null;
        createdBy: bigint;
        updatedBy: bigint;
    } | null>;
    update(key: string, data: UpdateSettingDto & {
        updatedBy: bigint;
    }): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        isPublic: boolean;
        description: string | null;
        createdBy: bigint;
        updatedBy: bigint;
    }>;
    delete(key: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        isPublic: boolean;
        description: string | null;
        createdBy: bigint;
        updatedBy: bigint;
    }>;
    findAll(filter: SettingsFilterDto): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        isPublic: boolean;
        description: string | null;
        createdBy: bigint;
        updatedBy: bigint;
    }[]>;
    count(filter: SettingsFilterDto): Promise<number>;
    getByCategory(category: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        isPublic: boolean;
        description: string | null;
        createdBy: bigint;
        updatedBy: bigint;
    }[]>;
    getPublicSettings(): Promise<{
        key: string;
        value: string;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        category: import("@prisma/client").$Enums.SettingCategory;
        description: string | null;
    }[]>;
    createMany(settings: any[]): Promise<Prisma.BatchPayload>;
}
