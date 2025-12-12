import { OvertimeRequestRepository } from '../repositories/overtime-request.repository';
import { OvertimeApprovalRepository } from '../repositories/overtime-approval.repository';
import { CreateOvertimeRequestDto } from '../dto/create-overtime-request.dto';
import { UpdateOvertimeRequestDto } from '../dto/update-overtime-request.dto';
import { OvertimeRequestResponseDto, PaginatedOvertimeResponseDto } from '../dto/overtime-response.dto';
import { Role } from '@prisma/client';
export declare class OvertimeRequestService {
    private overtimeRequestRepository;
    private overtimeApprovalRepository;
    constructor(overtimeRequestRepository: OvertimeRequestRepository, overtimeApprovalRepository: OvertimeApprovalRepository);
    private transformOvertimeResponse;
    private calculateOvertimeMinutes;
    create(createOvertimeRequestDto: CreateOvertimeRequestDto): Promise<OvertimeRequestResponseDto>;
    private createApprovalWorkflow;
    findAll(params?: {
        skip?: number;
        take?: number;
        employeeId?: number;
        status?: string;
        startDate?: string;
        endDate?: string;
        userRole?: Role;
        userId?: number;
    }): Promise<PaginatedOvertimeResponseDto>;
    findOne(id: number): Promise<OvertimeRequestResponseDto>;
    update(id: number, updateOvertimeRequestDto: UpdateOvertimeRequestDto): Promise<OvertimeRequestResponseDto>;
    remove(id: number): Promise<void>;
    getEmployeeOvertimeHistory(employeeId: number, params?: {
        skip?: number;
        take?: number;
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<OvertimeRequestResponseDto[]>;
    getPendingRequests(managerId?: number, params?: {
        skip?: number;
        take?: number;
    }): Promise<OvertimeRequestResponseDto[]>;
    getTotalOvertimeHours(employeeId: number, startDate: string, endDate: string, status?: string): Promise<{
        totalMinutes: number;
        totalHours: number;
    }>;
    getEmployeeIdByUserId(userId: string): Promise<bigint | null>;
}
