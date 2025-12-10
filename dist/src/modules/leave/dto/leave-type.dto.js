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
exports.LeaveTypeConfigResponseDto = exports.UpdateLeaveTypeConfigDto = exports.CreateLeaveTypeConfigDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateLeaveTypeConfigDto {
    leavePeriodId;
    type;
    name;
    description;
    defaultQuota;
    maxConsecutiveDays;
    advanceNoticeDays;
    isCarryForward;
    maxCarryForward;
    isActive;
}
exports.CreateLeaveTypeConfigDto = CreateLeaveTypeConfigDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Leave period ID this configuration belongs to'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveTypeConfigDto.prototype, "leavePeriodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'ANNUAL',
        description: 'Type of leave',
        enum: client_1.LeaveType
    }),
    (0, class_validator_1.IsEnum)(client_1.LeaveType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveTypeConfigDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Annual Leave',
        description: 'Display name for the leave type'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveTypeConfigDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Yearly vacation entitlement',
        description: 'Description of the leave type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveTypeConfigDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 30,
        description: 'Default quota in days for this leave type'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveTypeConfigDto.prototype, "defaultQuota", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 15,
        description: 'Maximum consecutive days that can be taken'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveTypeConfigDto.prototype, "maxConsecutiveDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Required advance notice in days'
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveTypeConfigDto.prototype, "advanceNoticeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Whether unused quota can be carried forward to next period'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLeaveTypeConfigDto.prototype, "isCarryForward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 5,
        description: 'Maximum days that can be carried forward'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLeaveTypeConfigDto.prototype, "maxCarryForward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: true,
        description: 'Whether this leave type configuration is active'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateLeaveTypeConfigDto.prototype, "isActive", void 0);
class UpdateLeaveTypeConfigDto {
    name;
    description;
    defaultQuota;
    maxConsecutiveDays;
    advanceNoticeDays;
    isCarryForward;
    maxCarryForward;
    isActive;
}
exports.UpdateLeaveTypeConfigDto = UpdateLeaveTypeConfigDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Annual Leave Updated',
        description: 'Display name for the leave type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateLeaveTypeConfigDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Updated description',
        description: 'Description of the leave type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLeaveTypeConfigDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 25,
        description: 'Default quota in days for this leave type'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLeaveTypeConfigDto.prototype, "defaultQuota", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 10,
        description: 'Maximum consecutive days that can be taken'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLeaveTypeConfigDto.prototype, "maxConsecutiveDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 5,
        description: 'Required advance notice in days'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLeaveTypeConfigDto.prototype, "advanceNoticeDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: false,
        description: 'Whether unused quota can be carried forward to next period'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLeaveTypeConfigDto.prototype, "isCarryForward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 3,
        description: 'Maximum days that can be carried forward'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLeaveTypeConfigDto.prototype, "maxCarryForward", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: false,
        description: 'Whether this leave type is active'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateLeaveTypeConfigDto.prototype, "isActive", void 0);
class LeaveTypeConfigResponseDto {
    id;
    type;
    name;
    description;
    defaultQuota;
    maxConsecutiveDays;
    advanceNoticeDays;
    isCarryForward;
    maxCarryForward;
    isActive;
    createdAt;
    updatedAt;
}
exports.LeaveTypeConfigResponseDto = LeaveTypeConfigResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    __metadata("design:type", Number)
], LeaveTypeConfigResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ANNUAL', enum: client_1.LeaveType }),
    __metadata("design:type", String)
], LeaveTypeConfigResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Annual Leave' }),
    __metadata("design:type", String)
], LeaveTypeConfigResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Yearly vacation entitlement' }),
    __metadata("design:type", String)
], LeaveTypeConfigResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    __metadata("design:type", Number)
], LeaveTypeConfigResponseDto.prototype, "defaultQuota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], LeaveTypeConfigResponseDto.prototype, "maxConsecutiveDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], LeaveTypeConfigResponseDto.prototype, "advanceNoticeDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LeaveTypeConfigResponseDto.prototype, "isCarryForward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], LeaveTypeConfigResponseDto.prototype, "maxCarryForward", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LeaveTypeConfigResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    __metadata("design:type", Date)
], LeaveTypeConfigResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    __metadata("design:type", Date)
], LeaveTypeConfigResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=leave-type.dto.js.map