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
exports.LeaveTypeService = void 0;
const common_1 = require("@nestjs/common");
const leave_type_repository_1 = require("../repositories/leave-type.repository");
let LeaveTypeService = class LeaveTypeService {
    leaveTypeRepository;
    constructor(leaveTypeRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
    }
    async create(createLeaveTypeDto) {
        const createData = {
            type: createLeaveTypeDto.type,
            name: createLeaveTypeDto.name,
            description: createLeaveTypeDto.description,
            defaultQuota: createLeaveTypeDto.defaultQuota,
            maxConsecutiveDays: createLeaveTypeDto.maxConsecutiveDays,
            advanceNoticeDays: createLeaveTypeDto.advanceNoticeDays,
            isCarryForward: createLeaveTypeDto.isCarryForward,
            maxCarryForward: createLeaveTypeDto.maxCarryForward,
            isActive: createLeaveTypeDto.isActive ?? true,
            leavePeriod: {
                connect: { id: BigInt(createLeaveTypeDto.leavePeriodId) }
            }
        };
        const leaveTypeConfig = await this.leaveTypeRepository.create(createData);
        return this.mapToResponseDto(leaveTypeConfig);
    }
    async findAll() {
        const leaveTypeConfigs = await this.leaveTypeRepository.findAll();
        return leaveTypeConfigs.map(config => this.mapToResponseDto(config));
    }
    async findOne(id) {
        const leaveTypeConfig = await this.leaveTypeRepository.findById(id);
        if (!leaveTypeConfig) {
            throw new common_1.NotFoundException(`Leave type configuration with ID ${id} not found`);
        }
        return this.mapToResponseDto(leaveTypeConfig);
    }
    async update(id, updateLeaveTypeDto) {
        const existingConfig = await this.leaveTypeRepository.findById(id);
        if (!existingConfig) {
            throw new common_1.NotFoundException(`Leave type configuration with ID ${id} not found`);
        }
        const updatedConfig = await this.leaveTypeRepository.update(id, updateLeaveTypeDto);
        return this.mapToResponseDto(updatedConfig);
    }
    async remove(id) {
        const existingConfig = await this.leaveTypeRepository.findById(id);
        if (!existingConfig) {
            throw new common_1.NotFoundException(`Leave type configuration with ID ${id} not found`);
        }
        const isUsed = await this.leaveTypeRepository.isUsedInBalancesOrRequests(id);
        if (isUsed) {
            throw new common_1.BadRequestException('Cannot delete leave type configuration that is being used in leave balances or requests');
        }
        await this.leaveTypeRepository.delete(id);
    }
    mapToResponseDto(leaveTypeConfig) {
        return {
            id: Number(leaveTypeConfig.id),
            type: leaveTypeConfig.type,
            name: leaveTypeConfig.name,
            description: leaveTypeConfig.description,
            defaultQuota: leaveTypeConfig.defaultQuota,
            maxConsecutiveDays: leaveTypeConfig.maxConsecutiveDays,
            advanceNoticeDays: leaveTypeConfig.advanceNoticeDays,
            isCarryForward: leaveTypeConfig.isCarryForward,
            maxCarryForward: leaveTypeConfig.maxCarryForward,
            isActive: leaveTypeConfig.isActive,
            createdAt: leaveTypeConfig.createdAt,
            updatedAt: leaveTypeConfig.updatedAt
        };
    }
};
exports.LeaveTypeService = LeaveTypeService;
exports.LeaveTypeService = LeaveTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [leave_type_repository_1.LeaveTypeRepository])
], LeaveTypeService);
//# sourceMappingURL=leave-type.service.js.map