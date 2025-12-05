import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
import { Prisma, Role } from '@prisma/client';
export declare class EmployeeService {
    private repository;
    constructor(repository: EmployeeRepository);
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
        baseSalary: Prisma.Decimal;
        userId: bigint;
    }>;
    findAll(query: FindAllEmployeesDto, userRole: Role): Promise<any[] | {
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
    private transformEmployees;
    findOne(id: bigint): Promise<any>;
    update(id: bigint, updateEmployeeDto: UpdateEmployeeDto, userRole: Role, userId: string): Promise<{
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
        baseSalary: Prisma.Decimal;
        userId: bigint;
    }>;
    remove(id: bigint, userRole: Role, userId: string): Promise<{
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
        baseSalary: Prisma.Decimal;
        userId: bigint;
    }>;
    restore(id: bigint): Promise<any>;
}
