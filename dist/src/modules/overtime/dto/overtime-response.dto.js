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
exports.PaginatedOvertimeResponseDto = exports.OvertimeApprovalResponseDto = exports.OvertimeRequestResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const update_overtime_request_dto_1 = require("./update-overtime-request.dto");
const overtime_approval_dto_1 = require("./overtime-approval.dto");
class OvertimeRequestResponseDto {
    id;
    employeeId;
    attendanceId;
    date;
    startTime;
    endTime;
    totalMinutes;
    reason;
    status;
    overtimeRate;
    calculatedAmount;
    managerComments;
    hrComments;
    rejectionReason;
    submittedAt;
    managerApprovedAt;
    hrApprovedAt;
    finalizedAt;
    createdAt;
    updatedAt;
    employee;
    attendance;
    approvals;
}
exports.OvertimeRequestResponseDto = OvertimeRequestResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '456' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "attendanceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T18:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T21:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 180 }),
    __metadata("design:type", Number)
], OvertimeRequestResponseDto.prototype, "totalMinutes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'System deployment and maintenance work' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: update_overtime_request_dto_1.OvertimeStatus, example: update_overtime_request_dto_1.OvertimeStatus.PENDING }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1.5' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "overtimeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '450000' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "calculatedAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved for urgent project deadline' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "managerComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Overtime compensation approved' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "hrComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Not enough justification for overtime' }),
    __metadata("design:type", String)
], OvertimeRequestResponseDto.prototype, "rejectionReason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T15:30:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "submittedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-12-12T16:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "managerApprovedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-12-12T17:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "hrApprovedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-12-12T17:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "finalizedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T15:30:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T17:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeRequestResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OvertimeRequestResponseDto.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OvertimeRequestResponseDto.prototype, "attendance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'array', items: { type: 'object' } }),
    __metadata("design:type", Array)
], OvertimeRequestResponseDto.prototype, "approvals", void 0);
class OvertimeApprovalResponseDto {
    id;
    overtimeRequestId;
    approverId;
    approverType;
    status;
    comments;
    approvedAt;
    createdAt;
    updatedAt;
    approver;
}
exports.OvertimeApprovalResponseDto = OvertimeApprovalResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], OvertimeApprovalResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    __metadata("design:type", String)
], OvertimeApprovalResponseDto.prototype, "overtimeRequestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '456' }),
    __metadata("design:type", String)
], OvertimeApprovalResponseDto.prototype, "approverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: overtime_approval_dto_1.ApproverType, example: overtime_approval_dto_1.ApproverType.MANAGER }),
    __metadata("design:type", String)
], OvertimeApprovalResponseDto.prototype, "approverType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: overtime_approval_dto_1.ApprovalStatus, example: overtime_approval_dto_1.ApprovalStatus.PENDING }),
    __metadata("design:type", String)
], OvertimeApprovalResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Approved due to project urgency' }),
    __metadata("design:type", String)
], OvertimeApprovalResponseDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2024-12-12T16:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeApprovalResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T15:30:00Z' }),
    __metadata("design:type", Date)
], OvertimeApprovalResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-12T16:00:00Z' }),
    __metadata("design:type", Date)
], OvertimeApprovalResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], OvertimeApprovalResponseDto.prototype, "approver", void 0);
class PaginatedOvertimeResponseDto {
    requests;
    total;
    skip;
    take;
}
exports.PaginatedOvertimeResponseDto = PaginatedOvertimeResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OvertimeRequestResponseDto] }),
    __metadata("design:type", Array)
], PaginatedOvertimeResponseDto.prototype, "requests", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    __metadata("design:type", Number)
], PaginatedOvertimeResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0 }),
    __metadata("design:type", Number)
], PaginatedOvertimeResponseDto.prototype, "skip", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    __metadata("design:type", Number)
], PaginatedOvertimeResponseDto.prototype, "take", void 0);
//# sourceMappingURL=overtime-response.dto.js.map