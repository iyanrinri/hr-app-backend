import { OvertimeRequestService } from '../services/overtime-request.service';
import { CreateOvertimeRequestDto } from '../dto/create-overtime-request.dto';
import { UpdateOvertimeRequestDto } from '../dto/update-overtime-request.dto';
import { OvertimeRequestResponseDto, PaginatedOvertimeResponseDto } from '../dto/overtime-response.dto';
export declare class OvertimeRequestController {
    private readonly overtimeRequestService;
    constructor(overtimeRequestService: OvertimeRequestService);
    create(createOvertimeRequestDto: CreateOvertimeRequestDto, req: any): Promise<OvertimeRequestResponseDto>;
    findAll(skip?: number, take?: number, employeeId?: number, status?: string, startDate?: string, endDate?: string, req?: any): Promise<PaginatedOvertimeResponseDto>;
    getPendingRequests(skip?: number, take?: number, req?: any): Promise<OvertimeRequestResponseDto[]>;
    getEmployeeHistory(employeeId: number, skip?: number, take?: number, status?: string, startDate?: string, endDate?: string, req?: any): Promise<OvertimeRequestResponseDto[]>;
    getTotalOvertimeHours(employeeId: number, startDate: string, endDate: string, status?: string, req?: any): Promise<{
        totalMinutes: number;
        totalHours: number;
    }>;
    findOne(id: number, req?: any): Promise<OvertimeRequestResponseDto>;
    update(id: number, updateOvertimeRequestDto: UpdateOvertimeRequestDto): Promise<OvertimeRequestResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
