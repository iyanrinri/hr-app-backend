import { LeaveTypeService } from '../services/leave-type.service';
import { CreateLeaveTypeConfigDto, UpdateLeaveTypeConfigDto, LeaveTypeConfigResponseDto } from '../dto/leave-type.dto';
export declare class LeaveTypeController {
    private readonly leaveTypeService;
    constructor(leaveTypeService: LeaveTypeService);
    create(createLeaveTypeDto: CreateLeaveTypeConfigDto): Promise<LeaveTypeConfigResponseDto>;
    findAll(): Promise<LeaveTypeConfigResponseDto[]>;
    findOne(id: number): Promise<LeaveTypeConfigResponseDto>;
    update(id: number, updateLeaveTypeDto: UpdateLeaveTypeConfigDto): Promise<LeaveTypeConfigResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
