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
        description: string | null;
        value: string;
        createdBy: bigint;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        isPublic: boolean;
        updatedBy: bigint;
    }>;
    findByKey(key: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        createdBy: bigint;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        isPublic: boolean;
        updatedBy: bigint;
    } | null>;
    update(key: string, data: UpdateSettingDto & {
        updatedBy: bigint;
    }): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        createdBy: bigint;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        isPublic: boolean;
        updatedBy: bigint;
    }>;
    delete(key: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        createdBy: bigint;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        isPublic: boolean;
        updatedBy: bigint;
    }>;
    findAll(filter: SettingsFilterDto): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        createdBy: bigint;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        isPublic: boolean;
        updatedBy: bigint;
    }[]>;
    count(filter: SettingsFilterDto): Promise<number>;
    getByCategory(category: string): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        value: string;
        createdBy: bigint;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
        isPublic: boolean;
        updatedBy: bigint;
    }[]>;
    getPublicSettings(): Promise<{
        description: string | null;
        value: string;
        key: string;
        category: import("@prisma/client").$Enums.SettingCategory;
        dataType: import("@prisma/client").$Enums.SettingDataType;
    }[]>;
    createMany(settings: any[]): Promise<Prisma.BatchPayload>;
}
