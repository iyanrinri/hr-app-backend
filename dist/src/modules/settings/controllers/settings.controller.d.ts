import { SettingsService } from '../services/settings.service';
import { CreateSettingDto, SettingCategory } from '../dto/create-setting.dto';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { SettingsFilterDto } from '../dto/settings-filter.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    create(createSettingDto: CreateSettingDto, req: any): Promise<{
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
    findAll(filter: SettingsFilterDto, req: any): Promise<{
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
    getAttendanceSettings(req: any): Promise<any>;
    getByCategory(category: SettingCategory, req: any): Promise<({
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
    findOne(key: string, req: any): Promise<{
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
    }>;
    update(key: string, updateSettingDto: UpdateSettingDto, req: any): Promise<{
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
    remove(key: string, req: any): Promise<{
        message: string;
    }>;
    initializeDefaults(req: any): Promise<{
        message: string;
        created: string[];
    }>;
}
