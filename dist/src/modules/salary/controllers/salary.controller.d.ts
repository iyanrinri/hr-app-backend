import { SalaryService } from '../services/salary.service';
import { CreateSalaryDto } from '../dto/create-salary.dto';
import { UpdateSalaryDto } from '../dto/update-salary.dto';
import { SalaryResponseDto } from '../dto/salary-response.dto';
export declare class SalaryController {
    private readonly salaryService;
    constructor(salaryService: SalaryService);
    create(createSalaryDto: CreateSalaryDto): Promise<SalaryResponseDto>;
    findAll(skip?: number, take?: number, employeeId?: number, isActive?: boolean, grade?: string): Promise<{
        salaries: SalaryResponseDto[];
        total: number;
    }>;
    getCurrentSalary(employeeId: number, req: any): Promise<SalaryResponseDto>;
    getEmployeeSalaryHistory(employeeId: number, req: any): Promise<SalaryResponseDto[]>;
    findOne(id: number): Promise<SalaryResponseDto>;
    update(id: number, updateSalaryDto: UpdateSalaryDto): Promise<SalaryResponseDto>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
