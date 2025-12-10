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
exports.CreateSettingDto = exports.SettingCategory = exports.SettingDataType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SettingDataType;
(function (SettingDataType) {
    SettingDataType["STRING"] = "STRING";
    SettingDataType["INTEGER"] = "INTEGER";
    SettingDataType["BOOLEAN"] = "BOOLEAN";
    SettingDataType["JSON"] = "JSON";
    SettingDataType["FILE"] = "STRING";
})(SettingDataType || (exports.SettingDataType = SettingDataType = {}));
var SettingCategory;
(function (SettingCategory) {
    SettingCategory["COMPANY"] = "COMPANY";
    SettingCategory["ATTENDANCE"] = "ATTENDANCE";
    SettingCategory["SYSTEM"] = "GENERAL";
    SettingCategory["NOTIFICATION"] = "NOTIFICATION";
    SettingCategory["SECURITY"] = "SECURITY";
})(SettingCategory || (exports.SettingCategory = SettingCategory = {}));
class CreateSettingDto {
    key;
    value;
    category;
    description;
    dataType;
    isPublic = false;
}
exports.CreateSettingDto = CreateSettingDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique setting key',
        example: 'company_name'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSettingDto.prototype, "key", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Setting value (will be stored as string, parsed based on dataType)',
        example: 'PT. Contoh Teknologi Indonesia'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSettingDto.prototype, "value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Setting category for grouping',
        enum: SettingCategory,
        example: SettingCategory.COMPANY
    }),
    (0, class_validator_1.IsEnum)(SettingCategory),
    __metadata("design:type", String)
], CreateSettingDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Optional description of the setting',
        example: 'Company name displayed in application header',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSettingDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data type for proper parsing and validation',
        enum: SettingDataType,
        example: SettingDataType.STRING
    }),
    (0, class_validator_1.IsEnum)(SettingDataType),
    __metadata("design:type", String)
], CreateSettingDto.prototype, "dataType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether this setting can be accessed by all users',
        example: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSettingDto.prototype, "isPublic", void 0);
//# sourceMappingURL=create-setting.dto.js.map