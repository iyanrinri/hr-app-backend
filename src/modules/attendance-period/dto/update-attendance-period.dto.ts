import { IsString, IsDateString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAttendancePeriodDto {
  @ApiProperty({ 
    example: 'January 2024 - Updated',
    description: 'Name of the attendance period',
    required: false
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    example: '2024-01-01',
    description: 'Start date of the attendance period (YYYY-MM-DD)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    example: '2024-01-31',
    description: 'End date of the attendance period (YYYY-MM-DD)',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    example: 5,
    description: 'Number of working days per week',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  workingDaysPerWeek?: number;

  @ApiProperty({ 
    example: 8,
    description: 'Number of working hours per day',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  workingHoursPerDay?: number;

  @ApiProperty({ 
    example: 'Updated monthly attendance period for January 2024',
    description: 'Optional description of the period',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: false,
    description: 'Whether this period is active',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}