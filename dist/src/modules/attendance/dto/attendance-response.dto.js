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
exports.ClockActionResponseDto = exports.AttendanceResponseDto = exports.AttendanceLogResponseDto = exports.LocationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class LocationDto {
    latitude;
    longitude;
    address;
}
exports.LocationDto = LocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: -6.2088 }),
    __metadata("design:type", Number)
], LocationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 106.8456 }),
    __metadata("design:type", Number)
], LocationDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Jl. Sudirman No. 1, Jakarta' }),
    __metadata("design:type", String)
], LocationDto.prototype, "address", void 0);
class AttendanceLogResponseDto {
    id;
    type;
    timestamp;
    location;
    ipAddress;
    userAgent;
    notes;
    createdAt;
}
exports.AttendanceLogResponseDto = AttendanceLogResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CLOCK_IN', enum: ['CLOCK_IN', 'CLOCK_OUT'] }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T08:00:00.000Z' }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LocationDto }),
    __metadata("design:type", LocationDto)
], AttendanceLogResponseDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '192.168.1.1', required: false }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mozilla/5.0...', required: false }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Starting work for the day', required: false }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T08:00:00.000Z' }),
    __metadata("design:type", String)
], AttendanceLogResponseDto.prototype, "createdAt", void 0);
class AttendanceResponseDto {
    id;
    employeeId;
    attendancePeriodId;
    date;
    checkIn;
    checkOut;
    checkInLocation;
    checkOutLocation;
    workDuration;
    status;
    notes;
    createdAt;
    updatedAt;
    logs;
}
exports.AttendanceResponseDto = AttendanceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "attendancePeriodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T00:00:00.000Z' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T08:00:00.000Z', required: false }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "checkIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T17:00:00.000Z', required: false }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "checkOut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LocationDto, required: false }),
    __metadata("design:type", LocationDto)
], AttendanceResponseDto.prototype, "checkInLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: LocationDto, required: false }),
    __metadata("design:type", LocationDto)
], AttendanceResponseDto.prototype, "checkOutLocation", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 480, description: 'Work duration in minutes', required: false }),
    __metadata("design:type", Number)
], AttendanceResponseDto.prototype, "workDuration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PRESENT', enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Normal working day', required: false }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T08:00:00.000Z' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-15T17:00:00.000Z' }),
    __metadata("design:type", String)
], AttendanceResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AttendanceLogResponseDto], required: false }),
    __metadata("design:type", Array)
], AttendanceResponseDto.prototype, "logs", void 0);
class ClockActionResponseDto {
    status;
    message;
    log;
    attendance;
}
exports.ClockActionResponseDto = ClockActionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'success' }),
    __metadata("design:type", String)
], ClockActionResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Successfully clocked in' }),
    __metadata("design:type", String)
], ClockActionResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AttendanceLogResponseDto }),
    __metadata("design:type", AttendanceLogResponseDto)
], ClockActionResponseDto.prototype, "log", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: AttendanceResponseDto }),
    __metadata("design:type", AttendanceResponseDto)
], ClockActionResponseDto.prototype, "attendance", void 0);
//# sourceMappingURL=attendance-response.dto.js.map