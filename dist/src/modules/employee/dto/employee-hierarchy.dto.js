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
exports.OrganizationTreeDto = exports.EmployeeHierarchyResponseDto = exports.SetManagerDto = exports.AssignSubordinatesDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class AssignSubordinatesDto {
    subordinateIds;
}
exports.AssignSubordinatesDto = AssignSubordinatesDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [123, 456, 789],
        description: 'Array of employee IDs to assign as subordinates'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], AssignSubordinatesDto.prototype, "subordinateIds", void 0);
class SetManagerDto {
    managerId;
}
exports.SetManagerDto = SetManagerDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 456,
        description: 'Employee ID of the manager. Set to null to remove manager'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SetManagerDto.prototype, "managerId", void 0);
class EmployeeHierarchyResponseDto {
    id;
    firstName;
    lastName;
    position;
    department;
    managerId;
}
exports.EmployeeHierarchyResponseDto = EmployeeHierarchyResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 123 }),
    __metadata("design:type", Number)
], EmployeeHierarchyResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John' }),
    __metadata("design:type", String)
], EmployeeHierarchyResponseDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Doe' }),
    __metadata("design:type", String)
], EmployeeHierarchyResponseDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Software Engineer' }),
    __metadata("design:type", String)
], EmployeeHierarchyResponseDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Engineering' }),
    __metadata("design:type", String)
], EmployeeHierarchyResponseDto.prototype, "department", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 456, nullable: true }),
    __metadata("design:type", Number)
], EmployeeHierarchyResponseDto.prototype, "managerId", void 0);
class OrganizationTreeDto {
    manager;
    employee;
    subordinates;
    siblings;
    managementChain;
}
exports.OrganizationTreeDto = OrganizationTreeDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: EmployeeHierarchyResponseDto, nullable: true }),
    __metadata("design:type", EmployeeHierarchyResponseDto)
], OrganizationTreeDto.prototype, "manager", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: EmployeeHierarchyResponseDto }),
    __metadata("design:type", EmployeeHierarchyResponseDto)
], OrganizationTreeDto.prototype, "employee", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EmployeeHierarchyResponseDto] }),
    __metadata("design:type", Array)
], OrganizationTreeDto.prototype, "subordinates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EmployeeHierarchyResponseDto] }),
    __metadata("design:type", Array)
], OrganizationTreeDto.prototype, "siblings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [EmployeeHierarchyResponseDto] }),
    __metadata("design:type", Array)
], OrganizationTreeDto.prototype, "managementChain", void 0);
//# sourceMappingURL=employee-hierarchy.dto.js.map