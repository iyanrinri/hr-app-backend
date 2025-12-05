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
exports.AttendanceHistoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class AttendanceHistoryDto {
    page;
    limit;
    startDate;
    endDate;
    employeeId;
    status;
}
exports.AttendanceHistoryDto = AttendanceHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Page number for pagination',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AttendanceHistoryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 10,
        description: 'Number of items per page',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value)),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AttendanceHistoryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01',
        description: 'Start date for filtering attendance (YYYY-MM-DD)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AttendanceHistoryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-31',
        description: 'End date for filtering attendance (YYYY-MM-DD)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AttendanceHistoryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1',
        description: 'Filter by specific employee ID (for HR/SUPER)',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value ? BigInt(value) : undefined),
    __metadata("design:type", BigInt)
], AttendanceHistoryDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'PRESENT',
        description: 'Filter by attendance status',
        enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'],
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceHistoryDto.prototype, "status", void 0);
//# sourceMappingURL=attendance-history.dto.js.map