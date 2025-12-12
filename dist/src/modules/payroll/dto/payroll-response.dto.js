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
exports.PayrollListResponseDto = exports.PayrollDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class PayrollDto {
    id;
    employeeId;
    periodStart;
    periodEnd;
    baseSalary;
    overtimePay;
    deductions;
    bonuses;
    grossSalary;
    netSalary;
    overtimeHours;
    regularHours;
    isPaid;
    processedAt;
    processedBy;
    createdAt;
    updatedAt;
    employee;
    processor;
}
exports.PayrollDto = PayrollDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payroll ID',
        example: '1',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Employee ID',
        example: '1',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payroll period start date',
        example: '2024-01-01T00:00:00Z',
    }),
    __metadata("design:type", Date)
], PayrollDto.prototype, "periodStart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payroll period end date',
        example: '2024-01-31T23:59:59Z',
    }),
    __metadata("design:type", Date)
], PayrollDto.prototype, "periodEnd", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Base salary amount',
        example: '5000000.00',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "baseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Overtime pay amount',
        example: '750000.00',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "overtimePay", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Deductions amount',
        example: '250000.00',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "deductions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Bonuses amount',
        example: '500000.00',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "bonuses", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gross salary (base + overtime + bonuses)',
        example: '6250000.00',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "grossSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Net salary after deductions',
        example: '6000000.00',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "netSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total overtime hours',
        example: '10.5',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "overtimeHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total regular working hours',
        example: '168.0',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "regularHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment status',
        example: false,
    }),
    __metadata("design:type", Boolean)
], PayrollDto.prototype, "isPaid", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Date when payroll was processed',
        example: '2024-02-01T10:30:00Z',
    }),
    __metadata("design:type", Date)
], PayrollDto.prototype, "processedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'ID of user who processed the payroll',
        example: '1',
    }),
    (0, class_transformer_1.Transform)(({ value }) => value?.toString()),
    __metadata("design:type", String)
], PayrollDto.prototype, "processedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation date',
        example: '2024-01-31T23:59:59Z',
    }),
    __metadata("design:type", Date)
], PayrollDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update date',
        example: '2024-02-01T10:30:00Z',
    }),
    __metadata("design:type", Date)
], PayrollDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Employee information',
    }),
    __metadata("design:type", Object)
], PayrollDto.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Processor information',
    }),
    __metadata("design:type", Object)
], PayrollDto.prototype, "processor", void 0);
class PayrollListResponseDto {
    data;
    total;
    page;
    limit;
    totalPages;
}
exports.PayrollListResponseDto = PayrollListResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of payroll records',
        type: [PayrollDto],
    }),
    __metadata("design:type", Array)
], PayrollListResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of records',
        example: 25,
    }),
    __metadata("design:type", Number)
], PayrollListResponseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1,
    }),
    __metadata("design:type", Number)
], PayrollListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of records per page',
        example: 10,
    }),
    __metadata("design:type", Number)
], PayrollListResponseDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 3,
    }),
    __metadata("design:type", Number)
], PayrollListResponseDto.prototype, "totalPages", void 0);
//# sourceMappingURL=payroll-response.dto.js.map