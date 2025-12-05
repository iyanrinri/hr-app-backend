import { AttendancePeriodRepository } from '../repositories/attendance-period.repository';
import { CreateAttendancePeriodDto } from '../dto/create-attendance-period.dto';
import { UpdateAttendancePeriodDto } from '../dto/update-attendance-period.dto';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { FindAllPeriodsDto } from '../dto/find-all-periods.dto';
export declare class AttendancePeriodService {
    private repository;
    constructor(repository: AttendancePeriodRepository);
    create(createDto: CreateAttendancePeriodDto, userId: string): Promise<{
        holidays: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            date: Date;
            attendancePeriodId: bigint | null;
            isNational: boolean;
            isRecurring: boolean;
        }[];
    } & {
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        startDate: Date;
        endDate: Date;
        workingDaysPerWeek: number;
        workingHoursPerDay: number;
        isActive: boolean;
        createdBy: bigint;
    }>;
    findAll(query: FindAllPeriodsDto): Promise<any[] | {
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
    findOne(id: bigint): Promise<any>;
    update(id: bigint, updateDto: UpdateAttendancePeriodDto): Promise<any>;
    remove(id: bigint): Promise<{
        message: string;
    }>;
    getActivePeriod(): Promise<any>;
    createHoliday(createDto: CreateHolidayDto): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        date: Date;
        attendancePeriodId: bigint | null;
        isNational: boolean;
        isRecurring: boolean;
    }>;
    findHolidays(attendancePeriodId?: bigint): Promise<{
        id: string;
        attendancePeriodId: string | undefined;
        date: string;
        createdAt: string;
        updatedAt: string;
        attendancePeriod: {
            id: bigint;
            name: string;
        } | null;
        name: string;
        description: string | null;
        isNational: boolean;
        isRecurring: boolean;
    }[]>;
    updateHoliday(id: bigint, updateData: Partial<CreateHolidayDto>): Promise<{
        id: bigint;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        date: Date;
        attendancePeriodId: bigint | null;
        isNational: boolean;
        isRecurring: boolean;
    }>;
    deleteHoliday(id: bigint): Promise<{
        message: string;
    }>;
    isWorkingDay(date: Date, attendancePeriodId?: bigint): Promise<boolean>;
    private transformPeriods;
    private transformPeriod;
}
