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
exports.SchedulerStatsWrapperDto = exports.SchedulerRunResponseDto = exports.SchedulerStatsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class SchedulerStatsResponseDto {
    totalActive;
    totalInactive;
    currentlyValidActive;
    expiredButStillActive;
    shouldBeActiveButInactive;
    lastChecked;
}
exports.SchedulerStatsResponseDto = SchedulerStatsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, description: 'Total number of active periods' }),
    __metadata("design:type", Number)
], SchedulerStatsResponseDto.prototype, "totalActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Total number of inactive periods' }),
    __metadata("design:type", Number)
], SchedulerStatsResponseDto.prototype, "totalInactive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Currently valid active periods' }),
    __metadata("design:type", Number)
], SchedulerStatsResponseDto.prototype, "currentlyValidActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Expired periods that are still marked as active' }),
    __metadata("design:type", Number)
], SchedulerStatsResponseDto.prototype, "expiredButStillActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Periods that should be active but are marked as inactive' }),
    __metadata("design:type", Number)
], SchedulerStatsResponseDto.prototype, "shouldBeActiveButInactive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-06T11:05:53.000Z', description: 'Last time the check was performed' }),
    __metadata("design:type", Date)
], SchedulerStatsResponseDto.prototype, "lastChecked", void 0);
class SchedulerRunResponseDto {
    status;
    message;
    timestamp;
}
exports.SchedulerRunResponseDto = SchedulerRunResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'success', description: 'Operation status' }),
    __metadata("design:type", String)
], SchedulerRunResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Period status check completed', description: 'Response message' }),
    __metadata("design:type", String)
], SchedulerRunResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-06T11:05:53.000Z', description: 'Timestamp when check was performed' }),
    __metadata("design:type", Date)
], SchedulerRunResponseDto.prototype, "timestamp", void 0);
class SchedulerStatsWrapperDto {
    status;
    data;
}
exports.SchedulerStatsWrapperDto = SchedulerStatsWrapperDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'success', description: 'Operation status' }),
    __metadata("design:type", String)
], SchedulerStatsWrapperDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: SchedulerStatsResponseDto, description: 'Scheduler statistics data' }),
    __metadata("design:type", SchedulerStatsResponseDto)
], SchedulerStatsWrapperDto.prototype, "data", void 0);
//# sourceMappingURL=scheduler-response.dto.js.map