import { PrismaService } from '../../../database/prisma.service';
import { Prisma, Salary } from '@prisma/client';
export declare class SalaryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SalaryCreateInput): Promise<Salary>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.SalaryWhereUniqueInput;
        where?: Prisma.SalaryWhereInput;
        orderBy?: Prisma.SalaryOrderByWithRelationInput;
        include?: Prisma.SalaryInclude;
    }): Promise<Salary[]>;
    findUnique(where: Prisma.SalaryWhereUniqueInput, include?: Prisma.SalaryInclude): Promise<Salary | null>;
    findFirst(where: Prisma.SalaryWhereInput, include?: Prisma.SalaryInclude): Promise<Salary | null>;
    findCurrentSalary(employeeId: bigint): Promise<Salary | null>;
    findEmployeeSalaryHistory(employeeId: bigint): Promise<Salary[]>;
    update(where: Prisma.SalaryWhereUniqueInput, data: Prisma.SalaryUpdateInput): Promise<Salary>;
    delete(where: Prisma.SalaryWhereUniqueInput): Promise<Salary>;
    count(where?: Prisma.SalaryWhereInput): Promise<number>;
    endCurrentSalary(employeeId: bigint, endDate: Date): Promise<Salary[]>;
}
