import { SettingCategory } from './create-setting.dto';
export declare class SettingsFilterDto {
    category?: SettingCategory;
    searchTerm?: string;
    isPublic?: boolean;
    page?: number;
    limit?: number;
}
