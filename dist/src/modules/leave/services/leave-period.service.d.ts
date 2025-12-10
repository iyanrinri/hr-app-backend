import { LeavePeriodRepository } from '../repositories/leave-period.repository';
import { LeaveTypeRepository } from '../repositories/leave-type.repository';
import { CreateLeavePeriodDto, UpdateLeavePeriodDto } from '../dto/leave-period.dto';
export declare class LeavePeriodService {
    private repository;
    private leaveTypeRepository;
    constructor(repository: LeavePeriodRepository, leaveTypeRepository: LeaveTypeRepository);
    create(createDto: CreateLeavePeriodDto, userId: bigint): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
    }>;
    findAll(params?: {
        page?: number;
        limit?: number;
        activeOnly?: boolean;
    }): Promise<{
        data: {
            id: number;
            name: any;
            startDate: any;
            endDate: any;
            isActive: any;
            description: any;
            createdBy: number;
            createdAt: any;
            updatedAt: any;
            leaveTypes: any;
            stats: {
                totalEmployeesWithBalances: any;
                totalLeaveRequests: any;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: bigint): Promise<{
        id: number;
        name: any;
        startDate: any;
        endDate: any;
        isActive: any;
        description: any;
        createdBy: number;
        createdAt: any;
        updatedAt: any;
        leaveTypes: any;
        stats: {
            totalEmployeesWithBalances: any;
            totalLeaveRequests: any;
        };
    }>;
    findActive(): Promise<{
        id: number;
        name: any;
        startDate: any;
        endDate: any;
        isActive: any;
        description: any;
        createdBy: number;
        createdAt: any;
        updatedAt: any;
        leaveTypes: any;
        stats: {
            totalEmployeesWithBalances: any;
            totalLeaveRequests: any;
        };
    }>;
    update(id: bigint, updateDto: UpdateLeavePeriodDto): Promise<{
        id: number;
        name: any;
        startDate: any;
        endDate: any;
        isActive: any;
        description: any;
        createdBy: number;
        createdAt: any;
        updatedAt: any;
        leaveTypes: any;
        stats: {
            totalEmployeesWithBalances: any;
            totalLeaveRequests: any;
        };
    }>;
    delete(id: bigint): Promise<{
        message: string;
    }>;
    private transformPeriod;
    setupDefaultLeaveTypes(periodId: number): Promise<{
        message: string;
        count: number;
    }>;
}
