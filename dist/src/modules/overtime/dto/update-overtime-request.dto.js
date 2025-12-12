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
exports.UpdateOvertimeRequestDto = exports.OvertimeStatus = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var OvertimeStatus;
(function (OvertimeStatus) {
    OvertimeStatus["PENDING"] = "PENDING";
    OvertimeStatus["MANAGER_APPROVED"] = "MANAGER_APPROVED";
    OvertimeStatus["HR_APPROVED"] = "HR_APPROVED";
    OvertimeStatus["APPROVED"] = "APPROVED";
    OvertimeStatus["REJECTED"] = "REJECTED";
    OvertimeStatus["CANCELLED"] = "CANCELLED";
})(OvertimeStatus || (exports.OvertimeStatus = OvertimeStatus = {}));
class UpdateOvertimeRequestDto {
    status;
    managerComments;
    hrComments;
    rejectionReason;
}
exports.UpdateOvertimeRequestDto = UpdateOvertimeRequestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: OvertimeStatus,
        example: OvertimeStatus.APPROVED,
        description: 'Status of the overtime request'
    }),
    (0, class_validator_1.IsEnum)(OvertimeStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOvertimeRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Approved for urgent project deadline',
        description: 'Manager comments on the overtime request'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOvertimeRequestDto.prototype, "managerComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Overtime compensation approved',
        description: 'HR comments on the overtime request'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOvertimeRequestDto.prototype, "hrComments", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        example: 'Not enough justification for overtime',
        description: 'Reason for rejection'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOvertimeRequestDto.prototype, "rejectionReason", void 0);
//# sourceMappingURL=update-overtime-request.dto.js.map