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
exports.UpdateOvertimeApprovalDto = exports.CreateOvertimeApprovalDto = exports.ApproverType = exports.ApprovalStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var ApproverType;
(function (ApproverType) {
    ApproverType["MANAGER"] = "MANAGER";
    ApproverType["HR"] = "HR";
})(ApproverType || (exports.ApproverType = ApproverType = {}));
class CreateOvertimeApprovalDto {
    overtimeRequestId;
    approverId;
    approverType;
    status;
    comments;
}
exports.CreateOvertimeApprovalDto = CreateOvertimeApprovalDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 123,
        description: 'Overtime request ID'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateOvertimeApprovalDto.prototype, "overtimeRequestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 456,
        description: 'Approver employee ID'
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateOvertimeApprovalDto.prototype, "approverId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ApproverType,
        example: ApproverType.MANAGER,
        description: 'Type of approver'
    }),
    (0, class_validator_1.IsEnum)(ApproverType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOvertimeApprovalDto.prototype, "approverType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ApprovalStatus,
        example: ApprovalStatus.APPROVED,
        description: 'Approval status'
    }),
    (0, class_validator_1.IsEnum)(ApprovalStatus),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOvertimeApprovalDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Approved due to project urgency',
        description: 'Comments from approver'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOvertimeApprovalDto.prototype, "comments", void 0);
class UpdateOvertimeApprovalDto {
    status;
    comments;
}
exports.UpdateOvertimeApprovalDto = UpdateOvertimeApprovalDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: ApprovalStatus,
        example: ApprovalStatus.APPROVED,
        description: 'Approval status'
    }),
    (0, class_validator_1.IsEnum)(ApprovalStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOvertimeApprovalDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Approved with conditions',
        description: 'Comments from approver'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOvertimeApprovalDto.prototype, "comments", void 0);
//# sourceMappingURL=overtime-approval.dto.js.map