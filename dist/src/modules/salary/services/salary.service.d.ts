import { SalaryRepository } from '../repositories/salary.repository';
import { SalaryHistoryRepository } from '../repositories/salary-history.repository';
import { CreateSalaryDto } from '../dto/create-salary.dto';
import { UpdateSalaryDto } from '../dto/update-salary.dto';
import { SalaryResponseDto } from '../dto/salary-response.dto';
export declare class SalaryService {
    private salaryRepository;
    private salaryHistoryRepository;
    constructor(salaryRepository: SalaryRepository, salaryHistoryRepository: SalaryHistoryRepository);
    private transformSalaryResponse;
    private transformSalaryHistoryResponse;
    create(createSalaryDto: CreateSalaryDto): Promise<SalaryResponseDto>;
    findAll(params?: {
        skip?: number;
        take?: number;
        employeeId?: number;
        isActive?: boolean;
        grade?: string;
    }): Promise<{
        salaries: SalaryResponseDto[];
        total: number;
    }>;
    findOne(id: number): Promise<SalaryResponseDto>;
    getCurrentSalary(employeeId: number): Promise<SalaryResponseDto>;
    getEmployeeSalaryHistory(employeeId: number): Promise<SalaryResponseDto[]>;
    update(id: number, updateSalaryDto: UpdateSalaryDto): Promise<SalaryResponseDto>;
    remove(id: number): Promise<void>;
}
