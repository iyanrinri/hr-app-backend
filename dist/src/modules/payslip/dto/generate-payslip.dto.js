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
exports.GeneratePayslipDto = exports.JKKRiskCategory = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var JKKRiskCategory;
(function (JKKRiskCategory) {
    JKKRiskCategory["LOW"] = "LOW";
    JKKRiskCategory["MEDIUM_LOW"] = "MEDIUM_LOW";
    JKKRiskCategory["MEDIUM"] = "MEDIUM";
    JKKRiskCategory["MEDIUM_HIGH"] = "MEDIUM_HIGH";
    JKKRiskCategory["HIGH"] = "HIGH";
})(JKKRiskCategory || (exports.JKKRiskCategory = JKKRiskCategory = {}));
class GeneratePayslipDto {
    payrollId;
    jkkRiskCategory;
    dependents;
    additionalAllowances;
    otherDeductions;
}
exports.GeneratePayslipDto = GeneratePayslipDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payroll ID to generate payslip for',
        example: 1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GeneratePayslipDto.prototype, "payrollId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'JKK (Work Accident Insurance) risk category',
        example: 'LOW',
        enum: JKKRiskCategory,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(JKKRiskCategory),
    __metadata("design:type", String)
], GeneratePayslipDto.prototype, "jkkRiskCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of dependents for tax calculation (0-3)',
        example: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GeneratePayslipDto.prototype, "dependents", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional allowances not in payroll',
        example: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GeneratePayslipDto.prototype, "additionalAllowances", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Other deductions not calculated automatically',
        example: 0,
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], GeneratePayslipDto.prototype, "otherDeductions", void 0);
//# sourceMappingURL=generate-payslip.dto.js.map