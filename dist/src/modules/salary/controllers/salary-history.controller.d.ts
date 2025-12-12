import { SalaryHistoryService } from '../services/salary-history.service';
import { CreateSalaryHistoryDto } from '../dto/create-salary-history.dto';
import { SalaryHistoryResponseDto } from '../dto/salary-response.dto';
export declare class SalaryHistoryController {
    private readonly salaryHistoryService;
    constructor(salaryHistoryService: SalaryHistoryService);
    create(createSalaryHistoryDto: CreateSalaryHistoryDto): Promise<SalaryHistoryResponseDto>;
    findAll(skip?: number, take?: number, employeeId?: number, changeType?: string, startDate?: string, endDate?: string): Promise<{
        histories: SalaryHistoryResponseDto[];
        total: number;
    }>;
    getEmployeeHistory(employeeId: number, req: any): Promise<SalaryHistoryResponseDto[]>;
    getByDateRange(employeeId: number, startDate: string, endDate: string): Promise<SalaryHistoryResponseDto[]>;
    getByChangeType(changeType: string): Promise<SalaryHistoryResponseDto[]>;
    findOne(id: number): Promise<SalaryHistoryResponseDto>;
}
