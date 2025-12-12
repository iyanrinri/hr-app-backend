import { PrismaService } from '../../../database/prisma.service';
import { Prisma, OvertimeApproval } from '@prisma/client';
export declare class OvertimeApprovalRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.OvertimeApprovalCreateInput): Promise<OvertimeApproval>;
    findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OvertimeApprovalWhereUniqueInput;
        where?: Prisma.OvertimeApprovalWhereInput;
        orderBy?: Prisma.OvertimeApprovalOrderByWithRelationInput;
        include?: Prisma.OvertimeApprovalInclude;
    }): Promise<OvertimeApproval[]>;
    findUnique(where: Prisma.OvertimeApprovalWhereUniqueInput, include?: Prisma.OvertimeApprovalInclude): Promise<OvertimeApproval | null>;
    findByRequest(overtimeRequestId: bigint): Promise<OvertimeApproval[]>;
    findByApprover(approverId: bigint, params?: {
        skip?: number;
        take?: number;
        status?: string;
        approverType?: string;
    }): Promise<OvertimeApproval[]>;
    findPendingApprovals(approverId?: bigint, approverType?: string): Promise<OvertimeApproval[]>;
    findExisting(overtimeRequestId: bigint, approverId: bigint, approverType: string): Promise<OvertimeApproval | null>;
    update(where: Prisma.OvertimeApprovalWhereUniqueInput, data: Prisma.OvertimeApprovalUpdateInput): Promise<OvertimeApproval>;
    delete(where: Prisma.OvertimeApprovalWhereUniqueInput): Promise<OvertimeApproval>;
    count(where?: Prisma.OvertimeApprovalWhereInput): Promise<number>;
    getApprovalStats(approverId?: bigint, startDate?: Date, endDate?: Date): Promise<Record<string, number>>;
}
