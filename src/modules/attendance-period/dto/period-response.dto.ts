import { ApiProperty } from '@nestjs/swagger';

export class HolidayResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'New Year\'s Day' })
  name: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  date: string;

  @ApiProperty({ example: true })
  isNational: boolean;

  @ApiProperty({ example: false })
  isRecurring: boolean;

  @ApiProperty({ example: 'National holiday celebrating the new year', required: false })
  description?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;
}

export class AttendancePeriodResponseDto {
  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'January 2024' })
  name: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  startDate: string;

  @ApiProperty({ example: '2024-01-31T00:00:00.000Z' })
  endDate: string;

  @ApiProperty({ example: 5 })
  workingDaysPerWeek: number;

  @ApiProperty({ example: 8 })
  workingHoursPerDay: number;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 'Monthly attendance period for January 2024', required: false })
  description?: string;

  @ApiProperty({ example: '1' })
  createdBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: [HolidayResponseDto], required: false })
  holidays?: HolidayResponseDto[];
}