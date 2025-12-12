import { SalaryChangeType } from './create-salary-history.dto';
export declare class SalaryResponseDto {
    id: string;
    employeeId: string;
    baseSalary: string;
    allowances: string;
    grade?: string;
    effectiveDate: Date;
    endDate?: Date;
    isActive: boolean;
    notes?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    employee?: {
        id: string;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
    };
}
export declare class SalaryHistoryResponseDto {
    id: string;
    employeeId: string;
    changeType: SalaryChangeType;
    oldBaseSalary?: string;
    newBaseSalary: string;
    oldGrade?: string;
    newGrade?: string;
    oldPosition?: string;
    newPosition?: string;
    oldDepartment?: string;
    newDepartment?: string;
    reason: string;
    effectiveDate: Date;
    approvedBy?: string;
    createdAt: Date;
    employee?: {
        id: string;
        firstName: string;
        lastName: string;
        position: string;
        department: string;
    };
}
