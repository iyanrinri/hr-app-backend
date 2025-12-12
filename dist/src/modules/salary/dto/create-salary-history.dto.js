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
exports.CreateSalaryHistoryDto = exports.SalaryChangeType = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var SalaryChangeType;
(function (SalaryChangeType) {
    SalaryChangeType["INITIAL"] = "INITIAL";
    SalaryChangeType["PROMOTION"] = "PROMOTION";
    SalaryChangeType["GRADE_ADJUSTMENT"] = "GRADE_ADJUSTMENT";
    SalaryChangeType["PERFORMANCE_INCREASE"] = "PERFORMANCE_INCREASE";
    SalaryChangeType["MARKET_ADJUSTMENT"] = "MARKET_ADJUSTMENT";
    SalaryChangeType["DEPARTMENT_TRANSFER"] = "DEPARTMENT_TRANSFER";
    SalaryChangeType["POSITION_CHANGE"] = "POSITION_CHANGE";
    SalaryChangeType["ANNUAL_INCREMENT"] = "ANNUAL_INCREMENT";
})(SalaryChangeType || (exports.SalaryChangeType = SalaryChangeType = {}));
class CreateSalaryHistoryDto {
    employeeId;
    changeType;
    oldBaseSalary;
    newBaseSalary;
    oldGrade;
    newGrade;
    oldPosition;
    newPosition;
    oldDepartment;
    newDepartment;
    reason;
    effectiveDate;
    approvedBy;
}
exports.CreateSalaryHistoryDto = CreateSalaryHistoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSalaryHistoryDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: SalaryChangeType, example: SalaryChangeType.PROMOTION }),
    (0, class_validator_1.IsEnum)(SalaryChangeType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "changeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000000, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSalaryHistoryDto.prototype, "oldBaseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 6000000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateSalaryHistoryDto.prototype, "newBaseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Grade 5', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "oldGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Grade 6', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "newGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Software Engineer', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "oldPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senior Software Engineer', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "newPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Engineering', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "oldDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Engineering', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "newDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Promoted to senior position' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalaryHistoryDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 456, required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateSalaryHistoryDto.prototype, "approvedBy", void 0);
//# sourceMappingURL=create-salary-history.dto.js.map