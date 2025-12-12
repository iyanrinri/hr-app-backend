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
exports.SalaryHistoryResponseDto = exports.SalaryResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_salary_history_dto_1 = require("./create-salary-history.dto");
class SalaryResponseDto {
    id;
    employeeId;
    baseSalary;
    allowances;
    grade;
    effectiveDate;
    endDate;
    isActive;
    notes;
    createdBy;
    createdAt;
    updatedAt;
    employee;
}
exports.SalaryResponseDto = SalaryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5000000' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "baseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '500000' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "allowances", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Grade 5' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01' }),
    __metadata("design:type", Date)
], SalaryResponseDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-12-31' }),
    __metadata("design:type", Date)
], SalaryResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], SalaryResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Annual salary adjustment' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], SalaryResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    __metadata("design:type", Date)
], SalaryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    __metadata("design:type", Date)
], SalaryResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SalaryResponseDto.prototype, "employee", void 0);
class SalaryHistoryResponseDto {
    id;
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
    createdAt;
    employee;
}
exports.SalaryHistoryResponseDto = SalaryHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: create_salary_history_dto_1.SalaryChangeType, example: create_salary_history_dto_1.SalaryChangeType.PROMOTION }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "changeType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5000000' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "oldBaseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '6000000' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "newBaseSalary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Grade 5' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "oldGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Grade 6' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "newGrade", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Software Engineer' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "oldPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Senior Software Engineer' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "newPosition", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Engineering' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "oldDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Engineering' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "newDepartment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Promoted to senior position' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01' }),
    __metadata("design:type", Date)
], SalaryHistoryResponseDto.prototype, "effectiveDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '456' }),
    __metadata("design:type", String)
], SalaryHistoryResponseDto.prototype, "approvedBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-01-01T00:00:00Z' }),
    __metadata("design:type", Date)
], SalaryHistoryResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SalaryHistoryResponseDto.prototype, "employee", void 0);
//# sourceMappingURL=salary-response.dto.js.map