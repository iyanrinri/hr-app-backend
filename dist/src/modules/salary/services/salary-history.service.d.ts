import { SalaryHistoryRepository } from '../repositories/salary-history.repository';
import { CreateSalaryHistoryDto } from '../dto/create-salary-history.dto';
import { SalaryHistoryResponseDto } from '../dto/salary-response.dto';
export declare class SalaryHistoryService {
    private salaryHistoryRepository;
    constructor(salaryHistoryRepository: SalaryHistoryRepository);
    private transformSalaryHistoryResponse;
    create(createSalaryHistoryDto: CreateSalaryHistoryDto): Promise<SalaryHistoryResponseDto>;
    findAll(params?: {
        skip?: number;
        take?: number;
        employeeId?: number;
        changeType?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        histories: SalaryHistoryResponseDto[];
        total: number;
    }>;
    findOne(id: number): Promise<SalaryHistoryResponseDto>;
    getEmployeeHistory(employeeId: number): Promise<SalaryHistoryResponseDto[]>;
    getByDateRange(employeeId: number, startDate: string, endDate: string): Promise<SalaryHistoryResponseDto[]>;
    getByChangeType(changeType: string): Promise<SalaryHistoryResponseDto[]>;
}
