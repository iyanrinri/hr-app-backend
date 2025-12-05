import { IsString, IsNotEmpty, IsDateString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendancePeriodDto {
  @ApiProperty({ 
    example: 'January 2024',
    description: 'Name of the attendance period'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    example: '2024-01-01',
    description: 'Start date of the attendance period (YYYY-MM-DD)'
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ 
    example: '2024-01-31',
    description: 'End date of the attendance period (YYYY-MM-DD)'
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ 
    example: 5,
    description: 'Number of working days per week (default: 5 for Mon-Fri)',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(7)
  workingDaysPerWeek?: number;

  @ApiProperty({ 
    example: 8,
    description: 'Number of working hours per day (default: 8)',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(24)
  workingHoursPerDay?: number;

  @ApiProperty({ 
    example: 'Monthly attendance period for January 2024',
    description: 'Optional description of the period',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: true,
    description: 'Whether this period is active (default: true)',
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}