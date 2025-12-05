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
exports.CreateHolidayDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateHolidayDto {
    name;
    date;
    attendancePeriodId;
    isNational;
    isRecurring;
    description;
}
exports.CreateHolidayDto = CreateHolidayDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'New Year\'s Day',
        description: 'Name of the holiday'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-01-01',
        description: 'Date of the holiday (YYYY-MM-DD)'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'ID of the attendance period this holiday belongs to',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_transformer_1.Transform)(({ value }) => value ? BigInt(value) : undefined),
    __metadata("design:type", BigInt)
], CreateHolidayDto.prototype, "attendancePeriodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Whether this is a national holiday',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHolidayDto.prototype, "isNational", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Whether this holiday recurs annually',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateHolidayDto.prototype, "isRecurring", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'National holiday celebrating the new year',
        description: 'Optional description of the holiday',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHolidayDto.prototype, "description", void 0);
//# sourceMappingURL=create-holiday.dto.js.map