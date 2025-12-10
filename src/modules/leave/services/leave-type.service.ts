import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { LeaveTypeRepository } from '../repositories/leave-type.repository';
import { CreateLeaveTypeConfigDto, UpdateLeaveTypeConfigDto, LeaveTypeConfigResponseDto } from '../dto/leave-type.dto';

@Injectable()
export class LeaveTypeService {
  constructor(private readonly leaveTypeRepository: LeaveTypeRepository) {}

  async create(createLeaveTypeDto: CreateLeaveTypeConfigDto): Promise<LeaveTypeConfigResponseDto> {
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

  async findAll(): Promise<LeaveTypeConfigResponseDto[]> {
    const leaveTypeConfigs = await this.leaveTypeRepository.findAll();
    return leaveTypeConfigs.map(config => this.mapToResponseDto(config));
  }

  async findOne(id: number): Promise<LeaveTypeConfigResponseDto> {
    const leaveTypeConfig = await this.leaveTypeRepository.findById(id);
    if (!leaveTypeConfig) {
      throw new NotFoundException(`Leave type configuration with ID ${id} not found`);
    }
    return this.mapToResponseDto(leaveTypeConfig);
  }

  async update(id: number, updateLeaveTypeDto: UpdateLeaveTypeConfigDto): Promise<LeaveTypeConfigResponseDto> {
    const existingConfig = await this.leaveTypeRepository.findById(id);
    if (!existingConfig) {
      throw new NotFoundException(`Leave type configuration with ID ${id} not found`);
    }

    const updatedConfig = await this.leaveTypeRepository.update(id, updateLeaveTypeDto);
    return this.mapToResponseDto(updatedConfig);
  }

  async remove(id: number): Promise<void> {
    const existingConfig = await this.leaveTypeRepository.findById(id);
    if (!existingConfig) {
      throw new NotFoundException(`Leave type configuration with ID ${id} not found`);
    }

    // Check if leave type config is being used in any leave balances or requests
    const isUsed = await this.leaveTypeRepository.isUsedInBalancesOrRequests(id);
    if (isUsed) {
      throw new BadRequestException('Cannot delete leave type configuration that is being used in leave balances or requests');
    }

    await this.leaveTypeRepository.delete(id);
  }

  private mapToResponseDto(leaveTypeConfig: any): LeaveTypeConfigResponseDto {
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
}