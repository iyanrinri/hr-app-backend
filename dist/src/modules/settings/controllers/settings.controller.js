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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const settings_service_1 = require("../services/settings.service");
const create_setting_dto_1 = require("../dto/create-setting.dto");
const update_setting_dto_1 = require("../dto/update-setting.dto");
const settings_filter_dto_1 = require("../dto/settings-filter.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const client_1 = require("@prisma/client");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async create(createSettingDto, req) {
        if (req.user.role !== client_1.Role.SUPER) {
            throw new common_1.ForbiddenException('Only SUPER users can create settings');
        }
        return this.settingsService.create(createSettingDto, BigInt(req.user.sub));
    }
    async findAll(filter, req) {
        if (req.user.role !== client_1.Role.SUPER) {
            filter.isPublic = true;
        }
        return this.settingsService.findAll(filter);
    }
    async getPublicSettings() {
        return this.settingsService.getPublicSettings();
    }
    async getCompanyInfo() {
        return this.settingsService.getCompanyInfo();
    }
    async getAttendanceSettings(req) {
        if (req.user.role !== client_1.Role.SUPER && req.user.role !== client_1.Role.HR) {
            throw new common_1.ForbiddenException('Only SUPER and HR users can access attendance settings');
        }
        return this.settingsService.getAttendanceSettings();
    }
    async getByCategory(category, req) {
        const settings = await this.settingsService.getByCategory(category);
        if (req.user.role !== client_1.Role.SUPER) {
            return settings.filter(setting => setting?.isPublic);
        }
        return settings;
    }
    async findOne(key, req) {
        const setting = await this.settingsService.findByKey(key);
        if (!setting) {
            throw new common_1.ForbiddenException('Setting not found');
        }
        if (req.user.role !== client_1.Role.SUPER && !setting.isPublic) {
            throw new common_1.ForbiddenException('Cannot access private setting');
        }
        return setting;
    }
    async update(key, updateSettingDto, req) {
        if (req.user.role !== client_1.Role.SUPER) {
            throw new common_1.ForbiddenException('Only SUPER users can update settings');
        }
        return this.settingsService.update(key, updateSettingDto, BigInt(req.user.sub));
    }
    async remove(key, req) {
        if (req.user.role !== client_1.Role.SUPER) {
            throw new common_1.ForbiddenException('Only SUPER users can delete settings');
        }
        return this.settingsService.remove(key);
    }
    async initializeDefaults(req) {
        if (req.user.role !== client_1.Role.SUPER) {
            throw new common_1.ForbiddenException('Only SUPER users can initialize settings');
        }
        return this.settingsService.initializeDefaultSettings(BigInt(req.user.sub));
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new setting',
        description: 'Create a new application setting. Only SUPER users can create settings.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Setting created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only SUPER users can create settings' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Setting key already exists' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_setting_dto_1.CreateSettingDto, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all settings with pagination and filtering',
        description: 'Retrieve settings with pagination, filtering, and search. SUPER users see all, others see only public settings.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [settings_filter_dto_1.SettingsFilterDto, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('public'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all public settings',
        description: 'Retrieve all public settings available to all authenticated users'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Public settings retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getPublicSettings", null);
__decorate([
    (0, common_1.Get)('company'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get company information',
        description: 'Retrieve public company settings formatted for display'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Company information retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'PT. Contoh Teknologi' },
                description: { type: 'string', example: 'Leading technology company' },
                logo: { type: 'string', example: 'https://example.com/logo.png' },
                address: { type: 'string', example: 'Jakarta, Indonesia' },
                phone: { type: 'string', example: '+62-21-12345678' },
                email: { type: 'string', example: 'info@company.com' },
                website: { type: 'string', example: 'https://company.com' },
                language: { type: 'string', example: 'en' },
                timezone: { type: 'string', example: 'Asia/Jakarta' },
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getCompanyInfo", null);
__decorate([
    (0, common_1.Get)('attendance'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance settings',
        description: 'Retrieve attendance-related settings. Only SUPER and HR users can access.'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance settings retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only SUPER and HR users can access attendance settings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getAttendanceSettings", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get settings by category',
        description: 'Retrieve all settings in a specific category. SUPER users see all, others see only public.'
    }),
    (0, swagger_1.ApiParam)({
        name: 'category',
        enum: create_setting_dto_1.SettingCategory,
        description: 'Setting category to filter by'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings retrieved successfully' }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "getByCategory", null);
__decorate([
    (0, common_1.Get)(':key'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get setting by key',
        description: 'Retrieve a specific setting by its key. SUPER users can access all, others only public settings.'
    }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Setting key', example: 'company_name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Cannot access private setting' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':key'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update setting by key',
        description: 'Update a specific setting. Only SUPER users can update settings.'
    }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Setting key', example: 'company_name' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only SUPER users can update settings' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_setting_dto_1.UpdateSettingDto, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':key'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete setting by key',
        description: 'Delete a specific setting. Only SUPER users can delete settings.'
    }),
    (0, swagger_1.ApiParam)({ name: 'key', description: 'Setting key', example: 'custom_setting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Setting deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only SUPER users can delete settings' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Setting not found' }),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('initialize'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initialize default settings',
        description: 'Create default application settings. Only SUPER users can initialize.'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Default settings initialized successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden - Only SUPER users can initialize settings' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "initializeDefaults", null);
exports.SettingsController = SettingsController = __decorate([
    (0, swagger_1.ApiTags)('settings'),
    (0, swagger_1.ApiSecurity)('JWT-auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map