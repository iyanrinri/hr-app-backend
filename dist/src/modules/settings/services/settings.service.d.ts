import { SettingsRepository } from '../repositories/settings.repository';
import { CreateSettingDto, SettingCategory } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { SettingsFilterDto } from '../dto/settings-filter.dto';
export declare class SettingsService {
    private settingsRepository;
    constructor(settingsRepository: SettingsRepository);
    create(createSettingDto: CreateSettingDto, userId: bigint): Promise<{
        id: any;
        key: any;
        value: any;
        parsedValue: any;
        category: any;
        description: any;
        dataType: any;
        isPublic: any;
        createdAt: any;
        updatedAt: any;
        createdBy: any;
        updatedBy: any;
    } | null>;
    findAll(filter: SettingsFilterDto): Promise<{
        data: ({
            id: any;
            key: any;
            value: any;
            parsedValue: any;
            category: any;
            description: any;
            dataType: any;
            isPublic: any;
            createdAt: any;
            updatedAt: any;
            createdBy: any;
            updatedBy: any;
        } | null)[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByKey(key: string): Promise<{
        id: any;
        key: any;
        value: any;
        parsedValue: any;
        category: any;
        description: any;
        dataType: any;
        isPublic: any;
        createdAt: any;
        updatedAt: any;
        createdBy: any;
        updatedBy: any;
    } | null>;
    update(key: string, updateSettingDto: UpdateSettingDto, userId: bigint): Promise<{
        id: any;
        key: any;
        value: any;
        parsedValue: any;
        category: any;
        description: any;
        dataType: any;
        isPublic: any;
        createdAt: any;
        updatedAt: any;
        createdBy: any;
        updatedBy: any;
    } | null>;
    remove(key: string): Promise<{
        message: string;
    }>;
    getByCategory(category: SettingCategory): Promise<({
        id: any;
        key: any;
        value: any;
        parsedValue: any;
        category: any;
        description: any;
        dataType: any;
        isPublic: any;
        createdAt: any;
        updatedAt: any;
        createdBy: any;
        updatedBy: any;
    } | null)[]>;
    getPublicSettings(): Promise<({
        id: any;
        key: any;
        value: any;
        parsedValue: any;
        category: any;
        description: any;
        dataType: any;
        isPublic: any;
        createdAt: any;
        updatedAt: any;
        createdBy: any;
        updatedBy: any;
    } | null)[]>;
    getCompanyInfo(): Promise<any>;
    getAttendanceSettings(): Promise<any>;
    getOvertimeSettings(): Promise<{
        enabled: boolean;
        minThresholdMinutes: number;
        maxHoursPerDay: number;
        maxHoursPerWeek: number;
        maxHoursPerMonth: number;
        weekdayRate: number;
        weekendRate: number;
        holidayRate: number;
        requiresApproval: boolean;
        managerApprovalRequired: boolean;
        hrApprovalRequired: boolean;
    }>;
    initializeDefaultSettings(userId: bigint): Promise<{
        message: string;
        created: string[];
    }>;
    private transformSetting;
    private parseSettingValue;
    private validateSettingValue;
}
