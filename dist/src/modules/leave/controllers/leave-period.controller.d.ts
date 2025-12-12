import { LeavePeriodService } from '../services/leave-period.service';
import { CreateLeavePeriodDto, UpdateLeavePeriodDto } from '../dto/leave-period.dto';
export declare class LeavePeriodController {
    private readonly leavePeriodService;
    constructor(leavePeriodService: LeavePeriodService);
    create(createDto: CreateLeavePeriodDto, req: any): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        endDate: Date;
        isActive: boolean;
        createdBy: bigint;
        startDate: Date;
    }>;
    getAvailableLeaveTypes(): Promise<{
        data: string[];
        message: string;
    }>;
    setupDefaultTypes(id: number): Promise<{
        message: string;
        count: number;
    }>;
    findAll(page?: number, limit?: number, activeOnly?: string): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, updateDto: UpdateLeavePeriodDto): Promise<{
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
    remove(id: number): Promise<{
        message: string;
    }>;
}
