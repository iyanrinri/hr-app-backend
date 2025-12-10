import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Employee } from '@prisma/client';
export declare class EmployeeRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.EmployeeCreateInput): Promise<Employee>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.EmployeeWhereUniqueInput;
        where?: Prisma.EmployeeWhereInput;
        orderBy?: Prisma.EmployeeOrderByWithRelationInput;
    }): Promise<Employee[]>;
    count(where?: Prisma.EmployeeWhereInput): Promise<number>;
    findOne(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee | null>;
    update(params: {
        where: Prisma.EmployeeWhereUniqueInput;
        data: Prisma.EmployeeUpdateInput;
    }): Promise<Employee>;
    softDelete(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee>;
    restore(where: Prisma.EmployeeWhereUniqueInput): Promise<Employee>;
    findByUserId(userId: bigint): Promise<Employee | null>;
    findById(id: bigint): Promise<Employee | null>;
    findByIds(ids: bigint[]): Promise<Employee[]>;
    findWithHierarchy(id: bigint): Promise<any | null>;
    findWithManager(id: bigint): Promise<any | null>;
    findSubordinates(managerId: bigint): Promise<Employee[]>;
    findSiblings(employeeId: bigint, managerId: bigint): Promise<Employee[]>;
    findAllSubordinatesRecursive(managerId: bigint): Promise<Employee[]>;
    updateManager(employeeId: bigint, managerId: bigint | null): Promise<Employee>;
    updateManagerForEmployees(employeeIds: bigint[], managerId: bigint): Promise<void>;
}
