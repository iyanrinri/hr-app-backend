import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PayslipRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PayslipCreateInput) {
    return this.prisma.payslip.create({
      data,
      include: {
        deductions: true,
        payroll: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                department: true,
                employeeNumber: true,
              },
            },
          },
        },
        generator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: bigint) {
    return this.prisma.payslip.findUnique({
      where: { id },
      include: {
        deductions: true,
        payroll: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                department: true,
                employeeNumber: true,
                maritalStatus: true,
              },
            },
          },
        },
        generator: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findByPayrollId(payrollId: bigint) {
    return this.prisma.payslip.findUnique({
      where: { payrollId },
      include: {
        deductions: true,
        payroll: {
          include: {
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                position: true,
                department: true,
                employeeNumber: true,
                maritalStatus: true,
              },
            },
          },
        },
      },
    });
  }

  async findByEmployeeId(employeeId: bigint, limit: number = 10) {
    return this.prisma.payslip.findMany({
      where: {
        payroll: {
          employeeId,
        },
      },
      include: {
        deductions: true,
        payroll: {
          select: {
            periodStart: true,
            periodEnd: true,
            baseSalary: true,
            overtimePay: true,
            bonuses: true,
          },
        },
      },
      orderBy: {
        generatedAt: 'desc',
      },
      take: limit,
    });
  }

  async createDeduction(data: Prisma.PayrollDeductionCreateInput) {
    return this.prisma.payrollDeduction.create({
      data,
    });
  }

  async createManyDeductions(data: Prisma.PayrollDeductionCreateManyInput[]) {
    return this.prisma.payrollDeduction.createMany({
      data,
    });
  }

  async delete(id: bigint) {
    return this.prisma.payslip.delete({
      where: { id },
    });
  }

  async updatePdfUrl(id: bigint, pdfUrl: string) {
    return this.prisma.payslip.update({
      where: { id },
      data: { pdfUrl },
    });
  }
}
