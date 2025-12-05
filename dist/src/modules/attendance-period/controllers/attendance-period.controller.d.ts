import { AttendancePeriodService } from '../services/attendance-period.service';
import { CreateAttendancePeriodDto } from '../dto/create-attendance-period.dto';
import { UpdateAttendancePeriodDto } from '../dto/update-attendance-period.dto';
import { CreateHolidayDto } from '../dto/create-holiday.dto';
import { FindAllPeriodsDto } from '../dto/find-all-periods.dto';
export declare class AttendancePeriodController {
    private readonly attendancePeriodService;
    constructor(attendancePeriodService: AttendancePeriodService);
    create(createDto: CreateAttendancePeriodDto, req: any): Promise<{
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
    getActivePeriod(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateDto: UpdateAttendancePeriodDto): Promise<any>;
    remove(id: number): Promise<{
        message: string;
    }>;
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
    findHolidays(attendancePeriodId?: string): Promise<{
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
    updateHoliday(id: number, updateData: Partial<CreateHolidayDto>): Promise<{
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
    deleteHoliday(id: number): Promise<{
        message: string;
    }>;
}
