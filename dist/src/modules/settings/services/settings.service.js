"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const settings_repository_1 = require("../repositories/settings.repository");
const create_setting_dto_1 = require("../dto/create-setting.dto");
let SettingsService = class SettingsService {
    settingsRepository;
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository;
    }
    async create(createSettingDto, userId) {
        const existing = await this.settingsRepository.findByKey(createSettingDto.key);
        if (existing) {
            throw new common_1.ConflictException(`Setting with key '${createSettingDto.key}' already exists`);
        }
        this.validateSettingValue(createSettingDto.value, createSettingDto.dataType);
        try {
            const result = await this.settingsRepository.create({
                key: createSettingDto.key,
                value: createSettingDto.value,
                category: createSettingDto.category,
                description: createSettingDto.description,
                dataType: createSettingDto.dataType,
                isPublic: createSettingDto.isPublic,
                createdBy: userId,
                updatedBy: userId,
            });
            return this.transformSetting(await this.settingsRepository.findByKey(createSettingDto.key));
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create setting');
        }
    }
    async findAll(filter) {
        const { page = 1, limit = 10 } = filter;
        const [settings, total] = await Promise.all([
            this.settingsRepository.findAll(filter),
            this.settingsRepository.count(filter),
        ]);
        return {
            data: settings.map(setting => this.transformSetting(setting)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findByKey(key) {
        const setting = await this.settingsRepository.findByKey(key);
        if (!setting) {
            throw new common_1.NotFoundException(`Setting with key '${key}' not found`);
        }
        return this.transformSetting(setting);
    }
    async update(key, updateSettingDto, userId) {
        const existing = await this.settingsRepository.findByKey(key);
        if (!existing) {
            throw new common_1.NotFoundException(`Setting with key '${key}' not found`);
        }
        if (updateSettingDto.value !== undefined) {
            const dataType = updateSettingDto.dataType || existing.dataType;
            this.validateSettingValue(updateSettingDto.value, dataType);
        }
        try {
            await this.settingsRepository.update(key, {
                ...updateSettingDto,
                updatedBy: userId,
            });
            return this.transformSetting(await this.settingsRepository.findByKey(key));
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to update setting');
        }
    }
    async remove(key) {
        const existing = await this.settingsRepository.findByKey(key);
        if (!existing) {
            throw new common_1.NotFoundException(`Setting with key '${key}' not found`);
        }
        await this.settingsRepository.delete(key);
        return { message: `Setting '${key}' deleted successfully` };
    }
    async getByCategory(category) {
        const settings = await this.settingsRepository.getByCategory(category);
        return settings.map(setting => this.transformSetting(setting));
    }
    async getPublicSettings() {
        const settings = await this.settingsRepository.getPublicSettings();
        return settings.map(setting => this.transformSetting(setting));
    }
    async getCompanyInfo() {
        const companySettings = await this.settingsRepository.getByCategory(create_setting_dto_1.SettingCategory.COMPANY);
        const publicSettings = companySettings.filter(setting => setting.isPublic);
        const companyInfo = {
            name: null,
            description: null,
            logo: null,
            address: null,
            phone: null,
            email: null,
            website: null,
            language: 'en',
            timezone: 'UTC',
        };
        publicSettings.forEach(setting => {
            const parsed = this.parseSettingValue(setting.value, setting.dataType);
            switch (setting.key) {
                case 'company_name':
                    companyInfo.name = parsed;
                    break;
                case 'company_description':
                    companyInfo.description = parsed;
                    break;
                case 'company_logo':
                    companyInfo.logo = parsed;
                    break;
                case 'company_address':
                    companyInfo.address = parsed;
                    break;
                case 'company_phone':
                    companyInfo.phone = parsed;
                    break;
                case 'company_email':
                    companyInfo.email = parsed;
                    break;
                case 'company_website':
                    companyInfo.website = parsed;
                    break;
                case 'system_language':
                    companyInfo.language = parsed;
                    break;
                case 'system_timezone':
                    companyInfo.timezone = parsed;
                    break;
            }
        });
        return companyInfo;
    }
    async getAttendanceSettings() {
        const attendanceSettings = await this.settingsRepository.getByCategory(create_setting_dto_1.SettingCategory.ATTENDANCE);
        const settings = {
            allowWeekendWork: false,
            checkPointEnabled: false,
            checkPointRadius: 100,
            checkPointLatitude: null,
            checkPointLongitude: null,
            checkPointAddress: null,
            lateToleranceMinutes: 15,
            earlyLeaveToleranceMinutes: 15,
            autoClockOutEnabled: false,
            autoClockOutTime: '18:00',
            overtimeEnabled: false,
            overtimeMinThreshold: 60,
        };
        attendanceSettings.forEach(setting => {
            const parsed = this.parseSettingValue(setting.value, setting.dataType);
            switch (setting.key) {
                case 'attendance_weekend_work':
                    settings.allowWeekendWork = parsed;
                    break;
                case 'attendance_checkpoint_enabled':
                    settings.checkPointEnabled = parsed;
                    break;
                case 'attendance_checkpoint_radius':
                    settings.checkPointRadius = parsed;
                    break;
                case 'attendance_checkpoint_lat':
                    settings.checkPointLatitude = parsed && parsed !== '' ? parseFloat(parsed) : null;
                    break;
                case 'attendance_checkpoint_lng':
                    settings.checkPointLongitude = parsed && parsed !== '' ? parseFloat(parsed) : null;
                    break;
                case 'attendance_checkpoint_address':
                    settings.checkPointAddress = parsed;
                    break;
                case 'attendance_late_tolerance':
                    settings.lateToleranceMinutes = parsed;
                    break;
                case 'attendance_early_leave_tolerance':
                    settings.earlyLeaveToleranceMinutes = parsed;
                    break;
                case 'attendance_auto_clockout':
                    settings.autoClockOutEnabled = parsed;
                    break;
                case 'attendance_auto_clockout_time':
                    settings.autoClockOutTime = parsed;
                    break;
                case 'attendance_overtime_enabled':
                    settings.overtimeEnabled = parsed;
                    break;
                case 'attendance_overtime_threshold':
                    settings.overtimeMinThreshold = parsed;
                    break;
            }
        });
        return settings;
    }
    async initializeDefaultSettings(userId) {
        const defaultSettings = [
            { key: 'company_name', value: 'Your Company Name', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Company name displayed in application', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'company_description', value: 'Your company description', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Brief company description', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'company_logo', value: '', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Company logo URL or base64', dataType: create_setting_dto_1.SettingDataType.FILE, isPublic: true },
            { key: 'company_address', value: '', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Company address', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'company_phone', value: '', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Company phone number', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'company_email', value: '', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Company email address', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'company_website', value: '', category: create_setting_dto_1.SettingCategory.COMPANY, description: 'Company website URL', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'system_language', value: 'en', category: create_setting_dto_1.SettingCategory.SYSTEM, description: 'Default application language', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'system_timezone', value: 'UTC', category: create_setting_dto_1.SettingCategory.SYSTEM, description: 'Default timezone', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: false },
            { key: 'system_date_format', value: 'YYYY-MM-DD', category: create_setting_dto_1.SettingCategory.SYSTEM, description: 'Date display format', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'system_time_format', value: '24h', category: create_setting_dto_1.SettingCategory.SYSTEM, description: 'Time display format (12h/24h)', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: true },
            { key: 'attendance_weekend_work', value: 'false', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Allow weekend attendance', dataType: create_setting_dto_1.SettingDataType.BOOLEAN, isPublic: false },
            { key: 'attendance_checkpoint_enabled', value: 'false', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Enable location-based check point', dataType: create_setting_dto_1.SettingDataType.BOOLEAN, isPublic: false },
            { key: 'attendance_checkpoint_radius', value: '100', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Check point radius in meters', dataType: create_setting_dto_1.SettingDataType.INTEGER, isPublic: false },
            { key: 'attendance_checkpoint_lat', value: '', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Check point latitude', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: false },
            { key: 'attendance_checkpoint_lng', value: '', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Check point longitude', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: false },
            { key: 'attendance_checkpoint_address', value: '', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Check point address', dataType: create_setting_dto_1.SettingDataType.STRING, isPublic: false },
            { key: 'attendance_late_tolerance', value: '15', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Late tolerance in minutes', dataType: create_setting_dto_1.SettingDataType.INTEGER, isPublic: false },
            { key: 'attendance_early_leave_tolerance', value: '15', category: create_setting_dto_1.SettingCategory.ATTENDANCE, description: 'Early leave tolerance in minutes', dataType: create_setting_dto_1.SettingDataType.INTEGER, isPublic: false },
            { key: 'notification_email_enabled', value: 'false', category: create_setting_dto_1.SettingCategory.NOTIFICATION, description: 'Enable email notifications', dataType: create_setting_dto_1.SettingDataType.BOOLEAN, isPublic: false },
            { key: 'notification_sms_enabled', value: 'false', category: create_setting_dto_1.SettingCategory.NOTIFICATION, description: 'Enable SMS notifications', dataType: create_setting_dto_1.SettingDataType.BOOLEAN, isPublic: false },
            { key: 'notification_realtime_enabled', value: 'true', category: create_setting_dto_1.SettingCategory.NOTIFICATION, description: 'Enable real-time notifications', dataType: create_setting_dto_1.SettingDataType.BOOLEAN, isPublic: false },
            { key: 'security_session_timeout', value: '3600', category: create_setting_dto_1.SettingCategory.SECURITY, description: 'Session timeout in seconds', dataType: create_setting_dto_1.SettingDataType.INTEGER, isPublic: false },
            { key: 'security_password_min_length', value: '8', category: create_setting_dto_1.SettingCategory.SECURITY, description: 'Minimum password length', dataType: create_setting_dto_1.SettingDataType.INTEGER, isPublic: false },
            { key: 'security_max_login_attempts', value: '5', category: create_setting_dto_1.SettingCategory.SECURITY, description: 'Maximum login attempts before lockout', dataType: create_setting_dto_1.SettingDataType.INTEGER, isPublic: false },
        ];
        const createdSettings = [];
        for (const setting of defaultSettings) {
            try {
                const existing = await this.settingsRepository.findByKey(setting.key);
                if (!existing) {
                    await this.settingsRepository.create({
                        ...setting,
                        createdBy: userId,
                        updatedBy: userId,
                    });
                    createdSettings.push(setting.key);
                }
            }
            catch (error) {
                console.error(`Failed to create default setting: ${setting.key}`, error);
            }
        }
        return {
            message: 'Default settings initialized',
            created: createdSettings,
        };
    }
    transformSetting(setting) {
        if (!setting)
            return null;
        return {
            id: setting.id?.toString(),
            key: setting.key,
            value: setting.value,
            parsedValue: this.parseSettingValue(setting.value, setting.dataType),
            category: setting.category,
            description: setting.description,
            dataType: setting.dataType,
            isPublic: setting.isPublic,
            createdAt: setting.createdAt instanceof Date ? setting.createdAt.toISOString() : setting.createdAt,
            updatedAt: setting.updatedAt instanceof Date ? setting.updatedAt.toISOString() : setting.updatedAt,
            createdBy: setting.createdByEmail,
            updatedBy: setting.updatedByEmail,
        };
    }
    parseSettingValue(value, dataType) {
        switch (dataType) {
            case create_setting_dto_1.SettingDataType.BOOLEAN:
                return value === 'true';
            case create_setting_dto_1.SettingDataType.INTEGER:
                return parseFloat(value);
            case create_setting_dto_1.SettingDataType.JSON:
                try {
                    return JSON.parse(value);
                }
                catch {
                    return value;
                }
            case create_setting_dto_1.SettingDataType.STRING:
            case create_setting_dto_1.SettingDataType.FILE:
            default:
                return value;
        }
    }
    validateSettingValue(value, dataType) {
        switch (dataType) {
            case create_setting_dto_1.SettingDataType.BOOLEAN:
                if (value !== 'true' && value !== 'false') {
                    throw new common_1.BadRequestException('Boolean setting must be "true" or "false"');
                }
                break;
            case create_setting_dto_1.SettingDataType.INTEGER:
                if (isNaN(parseFloat(value))) {
                    throw new common_1.BadRequestException('Number setting must be a valid number');
                }
                break;
            case create_setting_dto_1.SettingDataType.JSON:
                try {
                    JSON.parse(value);
                }
                catch {
                    throw new common_1.BadRequestException('JSON setting must be valid JSON');
                }
                break;
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_repository_1.SettingsRepository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map