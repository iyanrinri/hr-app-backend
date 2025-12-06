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
exports.CreateAttendancePeriodDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAttendancePeriodDto {
    name;
    startDate;
    endDate;
    workingDaysPerWeek;
    workingHoursPerDay;
    workingStartTime;
    workingEndTime;
    allowSaturdayWork;
    allowSundayWork;
    lateToleranceMinutes;
    earlyLeaveToleranceMinutes;
    description;
    isActive;
}
exports.CreateAttendancePeriodDto = CreateAttendancePeriodDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'January 2024',
        description: 'Name of the attendance period'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttendancePeriodDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01',
        description: 'Start date of the attendance period (YYYY-MM-DD)'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttendancePeriodDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-31',
        description: 'End date of the attendance period (YYYY-MM-DD)'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAttendancePeriodDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Number of working days per week (default: 5 for Mon-Fri)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], CreateAttendancePeriodDto.prototype, "workingDaysPerWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 8,
        description: 'Number of working hours per day (default: 8)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], CreateAttendancePeriodDto.prototype, "workingHoursPerDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '09:00',
        description: 'Working start time in HH:MM format (default: 09:00)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'workingStartTime must be in HH:MM format'
    }),
    __metadata("design:type", String)
], CreateAttendancePeriodDto.prototype, "workingStartTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '17:00',
        description: 'Working end time in HH:MM format (default: 17:00)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'workingEndTime must be in HH:MM format'
    }),
    __metadata("design:type", String)
], CreateAttendancePeriodDto.prototype, "workingEndTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Allow employees to clock-in/out on Saturday (default: false)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAttendancePeriodDto.prototype, "allowSaturdayWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Allow employees to clock-in/out on Sunday (default: false)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAttendancePeriodDto.prototype, "allowSundayWork", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 15,
        description: 'Late tolerance in minutes (default: 15)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateAttendancePeriodDto.prototype, "lateToleranceMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 15,
        description: 'Early leave tolerance in minutes (default: 15)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(120),
    __metadata("design:type", Number)
], CreateAttendancePeriodDto.prototype, "earlyLeaveToleranceMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Monthly attendance period for January 2024',
        description: 'Optional description of the period',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAttendancePeriodDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether this period is active (default: true)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateAttendancePeriodDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-attendance-period.dto.js.map