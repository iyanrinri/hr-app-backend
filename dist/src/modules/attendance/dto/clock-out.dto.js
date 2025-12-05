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
exports.ClockOutDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ClockOutDto {
    latitude;
    longitude;
    address;
    notes;
}
exports.ClockOutDto = ClockOutDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: -6.2088,
        description: 'Latitude coordinate of clock-out location'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLatitude)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ClockOutDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 106.8456,
        description: 'Longitude coordinate of clock-out location'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsLongitude)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ClockOutDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Jl. Sudirman No. 1, Jakarta',
        description: 'Human-readable address of the location',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Completed all tasks for today',
        description: 'Optional notes for clock-out',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClockOutDto.prototype, "notes", void 0);
//# sourceMappingURL=clock-out.dto.js.map