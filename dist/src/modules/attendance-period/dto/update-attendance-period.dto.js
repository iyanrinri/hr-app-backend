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
exports.UpdateAttendancePeriodDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateAttendancePeriodDto {
    name;
    startDate;
    endDate;
    workingDaysPerWeek;
    workingHoursPerDay;
    description;
    isActive;
}
exports.UpdateAttendancePeriodDto = UpdateAttendancePeriodDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'January 2024 - Updated',
        description: 'Name of the attendance period',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAttendancePeriodDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01',
        description: 'Start date of the attendance period (YYYY-MM-DD)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAttendancePeriodDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-31',
        description: 'End date of the attendance period (YYYY-MM-DD)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateAttendancePeriodDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 5,
        description: 'Number of working days per week',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(7),
    __metadata("design:type", Number)
], UpdateAttendancePeriodDto.prototype, "workingDaysPerWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 8,
        description: 'Number of working hours per day',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(24),
    __metadata("design:type", Number)
], UpdateAttendancePeriodDto.prototype, "workingHoursPerDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Updated monthly attendance period for January 2024',
        description: 'Optional description of the period',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAttendancePeriodDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether this period is active',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateAttendancePeriodDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-attendance-period.dto.js.map