import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dto/create-employee.dto';
import { UpdateEmployeeDto } from '../dto/update-employee.dto';
import { FindAllEmployeesDto } from '../dto/find-all-employees.dto';
import { AssignSubordinatesDto, SetManagerDto, OrganizationTreeDto, EmployeeHierarchyResponseDto } from '../dto/employee-hierarchy.dto';
export declare class EmployeeController {
    private readonly employeeService;
    constructor(employeeService: EmployeeService);
    create(createEmployeeDto: CreateEmployeeDto, req: any): Promise<{
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
        managerId: bigint | null;
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
        managerId: bigint | null;
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
        managerId: bigint | null;
        userId: bigint;
    }>;
    restore(id: number): Promise<any>;
    assignSubordinates(managerId: number, assignDto: AssignSubordinatesDto): Promise<{
        message: string;
        managerId: number;
        assignedSubordinates: number[];
    }>;
    setManager(employeeId: number, setManagerDto: SetManagerDto): Promise<{
        message: string;
        employeeId: number;
        managerId: null;
    } | {
        message: string;
        employeeId: number;
        managerId: number;
    }>;
    getOrganizationTree(employeeId: number): Promise<OrganizationTreeDto>;
    getAllSubordinates(managerId: number): Promise<EmployeeHierarchyResponseDto[]>;
    getManagementChain(employeeId: number): Promise<any[]>;
}
