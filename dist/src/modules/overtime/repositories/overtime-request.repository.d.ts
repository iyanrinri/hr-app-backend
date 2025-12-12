import { PrismaService } from '../../../database/prisma.service';
import { Prisma, OvertimeRequest } from '@prisma/client';
export declare class OvertimeRequestRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.OvertimeRequestCreateInput): Promise<OvertimeRequest>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OvertimeRequestWhereUniqueInput;
        where?: Prisma.OvertimeRequestWhereInput;
        orderBy?: Prisma.OvertimeRequestOrderByWithRelationInput;
        include?: Prisma.OvertimeRequestInclude;
    }): Promise<OvertimeRequest[]>;
    findUnique(where: Prisma.OvertimeRequestWhereUniqueInput, include?: Prisma.OvertimeRequestInclude): Promise<OvertimeRequest | null>;
    findByEmployee(employeeId: bigint, params?: {
        skip?: number;
        take?: number;
        status?: string;
        startDate?: Date;
        endDate?: Date;
    }): Promise<OvertimeRequest[]>;
    findPendingRequests(params?: {
        skip?: number;
        take?: number;
        managerId?: bigint;
    }): Promise<OvertimeRequest[]>;
    findByDateRange(startDate: Date, endDate: Date, employeeId?: bigint): Promise<OvertimeRequest[]>;
    checkExistingRequest(employeeId: bigint, date: Date): Promise<OvertimeRequest | null>;
    findAttendanceByDate(employeeId: bigint, date: Date): Promise<{
        id: bigint;
    } | null>;
    update(where: Prisma.OvertimeRequestWhereUniqueInput, data: Prisma.OvertimeRequestUpdateInput): Promise<OvertimeRequest>;
    delete(where: Prisma.OvertimeRequestWhereUniqueInput): Promise<OvertimeRequest>;
    count(where?: Prisma.OvertimeRequestWhereInput): Promise<number>;
    getTotalOvertimeMinutes(employeeId: bigint, startDate: Date, endDate: Date, status?: string): Promise<number>;
    getEmployeeIdByUserId(userId: bigint): Promise<bigint | null>;
}
