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
exports.LeaveRequestHistoryDto = exports.LeaveBalanceSummaryDto = exports.LeaveBalanceResponseDto = exports.LeaveRequestResponseDto = exports.RejectLeaveRequestDto = exports.ApproveLeaveRequestDto = exports.CreateLeaveRequestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateLeaveRequestDto {
    leaveTypeConfigId;
    startDate;
    endDate;
    reason;
    emergencyContact;
    handoverNotes;
}
exports.CreateLeaveRequestDto = CreateLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1',
        description: 'Leave type configuration ID'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "leaveTypeConfigId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-20',
        description: 'Start date of the leave'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-12-25',
        description: 'End date of the leave'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Family vacation',
        description: 'Reason for the leave request'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: '+1234567890',
        description: 'Emergency contact number'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'John will handle my responsibilities',
        description: 'Work handover notes'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaveRequestDto.prototype, "handoverNotes", void 0);
class ApproveLeaveRequestDto {
    comments;
}
exports.ApproveLeaveRequestDto = ApproveLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Approved for family vacation',
        description: 'Comments from the approver'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveLeaveRequestDto.prototype, "comments", void 0);
class RejectLeaveRequestDto {
    rejectionReason;
    comments;
}
exports.RejectLeaveRequestDto = RejectLeaveRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Insufficient notice period',
        description: 'Reason for rejection'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RejectLeaveRequestDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Please resubmit with proper notice',
        description: 'Additional comments'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectLeaveRequestDto.prototype, "comments", void 0);
class LeaveRequestResponseDto {
    id;
    employeeId;
    employeeName;
    leaveTypeName;
    startDate;
    endDate;
    totalDays;
    reason;
    status;
    submittedAt;
    managerComments;
    hrComments;
    emergencyContact;
    handoverNotes;
}
exports.LeaveRequestResponseDto = LeaveRequestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Annual Leave' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "leaveTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-20' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-25' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], LeaveRequestResponseDto.prototype, "totalDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Family vacation' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PENDING' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-15T10:00:00Z' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved by manager' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "managerComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved by HR' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "hrComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+1234567890' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "emergencyContact", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'John will handle responsibilities' }),
    __metadata("design:type", String)
], LeaveRequestResponseDto.prototype, "handoverNotes", void 0);
class LeaveBalanceResponseDto {
    id;
    leaveTypeName;
    totalQuota;
    usedQuota;
    remainingQuota;
    validFrom;
    validTo;
    isActive;
}
exports.LeaveBalanceResponseDto = LeaveBalanceResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], LeaveBalanceResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Annual Leave' }),
    __metadata("design:type", String)
], LeaveBalanceResponseDto.prototype, "leaveTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 20 }),
    __metadata("design:type", Number)
], LeaveBalanceResponseDto.prototype, "totalQuota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], LeaveBalanceResponseDto.prototype, "usedQuota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], LeaveBalanceResponseDto.prototype, "remainingQuota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01' }),
    __metadata("design:type", String)
], LeaveBalanceResponseDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31' }),
    __metadata("design:type", String)
], LeaveBalanceResponseDto.prototype, "validTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], LeaveBalanceResponseDto.prototype, "isActive", void 0);
class LeaveBalanceSummaryDto {
    employeeId;
    employeeName;
    balances;
    totalQuota;
    totalUsed;
    totalRemaining;
}
exports.LeaveBalanceSummaryDto = LeaveBalanceSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    __metadata("design:type", String)
], LeaveBalanceSummaryDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    __metadata("design:type", String)
], LeaveBalanceSummaryDto.prototype, "employeeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [LeaveBalanceResponseDto],
        description: 'List of leave balances for all leave types'
    }),
    __metadata("design:type", Array)
], LeaveBalanceSummaryDto.prototype, "balances", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50 }),
    __metadata("design:type", Number)
], LeaveBalanceSummaryDto.prototype, "totalQuota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 15 }),
    __metadata("design:type", Number)
], LeaveBalanceSummaryDto.prototype, "totalUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 35 }),
    __metadata("design:type", Number)
], LeaveBalanceSummaryDto.prototype, "totalRemaining", void 0);
class LeaveRequestHistoryDto {
    id;
    leaveTypeName;
    startDate;
    endDate;
    totalDays;
    reason;
    status;
    submittedAt;
    approvedAt;
    approvedBy;
    approverComments;
}
exports.LeaveRequestHistoryDto = LeaveRequestHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Annual Leave' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "leaveTypeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-20' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-25' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], LeaveRequestHistoryDto.prototype, "totalDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Family vacation' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'APPROVED',
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']
    }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-15T10:00:00Z' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-12-16T09:00:00Z' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Jane Smith' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved for family time' }),
    __metadata("design:type", String)
], LeaveRequestHistoryDto.prototype, "approverComments", void 0);
//# sourceMappingURL=leave-request.dto.js.map