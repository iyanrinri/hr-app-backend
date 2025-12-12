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
exports.ProcessPayrollDto = exports.CreatePayrollDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreatePayrollDto {
    employeeId;
    periodStart;
    periodEnd;
    deductions;
    bonuses;
    overtimeRequestIds;
}
exports.CreatePayrollDto = CreatePayrollDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee ID',
        example: '1',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payroll period start date',
        example: '2024-01-01T00:00:00Z',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payroll period end date',
        example: '2024-01-31T23:59:59Z',
    }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manual deductions',
        example: '100.00',
        default: '0',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '2' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "deductions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Manual bonuses',
        example: '500.00',
        default: '0',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)({ decimal_digits: '2' }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], CreatePayrollDto.prototype, "bonuses", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Array of approved overtime request IDs to include',
        example: ['1', '2', '3'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreatePayrollDto.prototype, "overtimeRequestIds", void 0);
class ProcessPayrollDto {
    payrollIds;
}
exports.ProcessPayrollDto = ProcessPayrollDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of payroll IDs to process',
        example: ['1', '2', '3'],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], ProcessPayrollDto.prototype, "payrollIds", void 0);
//# sourceMappingURL=create-payroll.dto.js.map