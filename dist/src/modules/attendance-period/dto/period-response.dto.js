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
exports.AttendancePeriodResponseDto = exports.HolidayResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class HolidayResponseDto {
    id;
    name;
    date;
    isNational;
    isRecurring;
    description;
    createdAt;
    updatedAt;
}
exports.HolidayResponseDto = HolidayResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'New Year\'s Day' }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], HolidayResponseDto.prototype, "isNational", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], HolidayResponseDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'National holiday celebrating the new year', required: false }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], HolidayResponseDto.prototype, "updatedAt", void 0);
class AttendancePeriodResponseDto {
    id;
    name;
    startDate;
    endDate;
    workingDaysPerWeek;
    workingHoursPerDay;
    isActive;
    description;
    createdBy;
    createdAt;
    updatedAt;
    holidays;
}
exports.AttendancePeriodResponseDto = AttendancePeriodResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'January 2024' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-31T00:00:00.000Z' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], AttendancePeriodResponseDto.prototype, "workingDaysPerWeek", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], AttendancePeriodResponseDto.prototype, "workingHoursPerDay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AttendancePeriodResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Monthly attendance period for January 2024', required: false }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00.000Z' }),
    __metadata("design:type", String)
], AttendancePeriodResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [HolidayResponseDto], required: false }),
    __metadata("design:type", Array)
], AttendancePeriodResponseDto.prototype, "holidays", void 0);
//# sourceMappingURL=period-response.dto.js.map