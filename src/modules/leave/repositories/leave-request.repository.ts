import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeaveRequestRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.LeaveRequestCreateInput) {
    return this.prisma.leaveRequest.create({ 
      data,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, manager: true }
        },
        leaveTypeConfig: {
          select: { id: true, name: true, type: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, firstName: true, lastName: true, position: true }
            }
          }
        }
      }
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.LeaveRequestWhereInput;
    orderBy?: Prisma.LeaveRequestOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.leaveRequest.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, position: true }
        },
        leaveTypeConfig: {
          select: { id: true, name: true, type: true }
        },
        leavePeriod: {
          select: { id: true, name: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, firstName: true, lastName: true, position: true }
            }
          }
        }
      },
    });
  }

  async findById(id: bigint) {
    return this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, manager: true }
        },
        leaveTypeConfig: true,
        leavePeriod: true,
        approvals: {
          include: {
            approver: {
              select: { id: true, firstName: true, lastName: true, position: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
    });
  }

  async findByEmployee(employeeId: bigint, params?: {
    skip?: number;
    take?: number;
    status?: string;
  }) {
    const { skip, take, status } = params || {};
    return this.prisma.leaveRequest.findMany({
      skip,
      take,
      where: { 
        employeeId,
        ...(status && { status: status as any })
      },
      include: {
        leaveTypeConfig: {
          select: { id: true, name: true, type: true }
        },
        leavePeriod: {
          select: { id: true, name: true }
        }
      },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findPendingForApprover(approverId: bigint) {
    return this.prisma.leaveRequest.findMany({
      where: {
        OR: [
          {
            status: 'PENDING',
            employee: {
              managerId: approverId
            }
          },
          {
            approvals: {
              some: {
                approverId,
                status: 'PENDING'
              }
            }
          }
        ]
      },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true, position: true }
        },
        leaveTypeConfig: {
          select: { id: true, name: true, type: true }
        },
        leavePeriod: {
          select: { id: true, name: true }
        },
        approvals: {
          include: {
            approver: {
              select: { id: true, firstName: true, lastName: true, position: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async findConflicting(employeeId: bigint, startDate: Date, endDate: Date, excludeId?: bigint) {
    return this.prisma.leaveRequest.findMany({
      where: {
        employeeId,
        status: {
          in: ['PENDING', 'MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED']
        },
        OR: [
          {
            startDate: {
              lte: endDate
            },
            endDate: {
              gte: startDate
            }
          }
        ],
        ...(excludeId && { id: { not: excludeId } })
      },
    });
  }

  async update(id: bigint, data: Prisma.LeaveRequestUpdateInput) {
    return this.prisma.leaveRequest.update({
      where: { id },
      data,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, department: true }
        },
        leaveTypeConfig: {
          select: { id: true, name: true, type: true }
        }
      }
    });
  }

  async delete(id: bigint) {
    return this.prisma.leaveRequest.delete({
      where: { id },
    });
  }

  async count(where?: Prisma.LeaveRequestWhereInput) {
    return this.prisma.leaveRequest.count({ where });
  }

  async approveRequest(id: bigint, approverId: bigint, comments?: string, level?: 'MANAGER' | 'HR') {
    return this.prisma.$transaction(async (tx) => {
      // Update the leave request status
      const updateData: any = {
        status: level === 'HR' ? 'APPROVED' : (level === 'MANAGER' ? 'MANAGER_APPROVED' : 'APPROVED'),
        ...(level === 'MANAGER' && { 
          managerComments: comments,
          managerApprovedAt: new Date()
        }),
        ...(level === 'HR' && { 
          hrComments: comments,
          hrApprovedAt: new Date(),
          finalizedAt: new Date()
        })
      };

      const updatedRequest = await tx.leaveRequest.update({
        where: { id },
        data: updateData
      });

      // Create approval record
      await tx.leaveApproval.create({
        data: {
          leaveRequestId: id,
          approverId,
          approverType: level || 'MANAGER',
          status: 'APPROVED',
          comments,
          approvedAt: new Date()
        }
      });

      return updatedRequest;
    });
  }

  async rejectRequest(id: bigint, approverId: bigint, rejectionReason: string, comments?: string) {
    return this.prisma.$transaction(async (tx) => {
      // Update the leave request status
      const updatedRequest = await tx.leaveRequest.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason,
          managerComments: comments,
          managerApprovedAt: new Date(),
          finalizedAt: new Date()
        }
      });

      // Create approval record
      await tx.leaveApproval.create({
        data: {
          leaveRequestId: id,
          approverId,
          approverType: 'MANAGER',
          status: 'REJECTED',
          comments: rejectionReason,
          approvedAt: new Date()
        }
      });

      return updatedRequest;
    });
  }
}