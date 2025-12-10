import { LeaveTypeRepository } from '../repositories/leave-type.repository';
import { CreateLeaveTypeConfigDto, UpdateLeaveTypeConfigDto, LeaveTypeConfigResponseDto } from '../dto/leave-type.dto';
export declare class LeaveTypeService {
    private readonly leaveTypeRepository;
    constructor(leaveTypeRepository: LeaveTypeRepository);
    create(createLeaveTypeDto: CreateLeaveTypeConfigDto): Promise<LeaveTypeConfigResponseDto>;
    findAll(): Promise<LeaveTypeConfigResponseDto[]>;
    findOne(id: number): Promise<LeaveTypeConfigResponseDto>;
    update(id: number, updateLeaveTypeDto: UpdateLeaveTypeConfigDto): Promise<LeaveTypeConfigResponseDto>;
    remove(id: number): Promise<void>;
    private mapToResponseDto;
}
