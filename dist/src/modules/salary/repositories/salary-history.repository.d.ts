import { PrismaService } from '../../../database/prisma.service';
import { Prisma, SalaryHistory } from '@prisma/client';
export declare class SalaryHistoryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.SalaryHistoryCreateInput): Promise<SalaryHistory>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.SalaryHistoryWhereUniqueInput;
        where?: Prisma.SalaryHistoryWhereInput;
        orderBy?: Prisma.SalaryHistoryOrderByWithRelationInput;
        include?: Prisma.SalaryHistoryInclude;
    }): Promise<SalaryHistory[]>;
    findUnique(where: Prisma.SalaryHistoryWhereUniqueInput, include?: Prisma.SalaryHistoryInclude): Promise<SalaryHistory | null>;
    findEmployeeHistory(employeeId: bigint): Promise<SalaryHistory[]>;
    findByDateRange(employeeId: bigint, startDate: Date, endDate: Date): Promise<SalaryHistory[]>;
    findByChangeType(changeType: string): Promise<SalaryHistory[]>;
    count(where?: Prisma.SalaryHistoryWhereInput): Promise<number>;
}
