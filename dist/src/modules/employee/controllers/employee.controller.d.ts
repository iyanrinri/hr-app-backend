import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<{
        id: bigint;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
        joinDate: Date;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        userId: bigint;
    }>;
    findAll(query: FindAllEmployeesDto, req: any): Promise<any[] | {
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    findOne(id: number): Promise<any>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto, req: any): Promise<{
        id: bigint;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
        joinDate: Date;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        userId: bigint;
    }>;
    remove(id: number, req: any): Promise<{
        id: bigint;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
        joinDate: Date;
        baseSalary: import("@prisma/client-runtime-utils").Decimal;
        userId: bigint;
    }>;
    restore(id: number): Promise<any>;
}
