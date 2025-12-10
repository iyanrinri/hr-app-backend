export declare enum SettingDataType {
    STRING = "STRING",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    JSON = "JSON",
    FILE = "STRING"
}
export declare enum SettingCategory {
    COMPANY = "COMPANY",
    ATTENDANCE = "ATTENDANCE",
    SYSTEM = "GENERAL",
    NOTIFICATION = "NOTIFICATION",
    SECURITY = "SECURITY"
}
export declare class CreateSettingDto {
    key: string;
    value: string;
    category: SettingCategory;
    description?: string;
    dataType: SettingDataType;
    isPublic?: boolean;
}
