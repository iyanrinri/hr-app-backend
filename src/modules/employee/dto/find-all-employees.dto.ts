import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindAllEmployeesDto {
  @ApiPropertyOptional({ 
    description: 'Enable pagination (1 for paginated, 0 or omit for all)',
    example: 1,
    type: Number
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) => parseInt(value))
  @IsInt()
  paginated?: number;

  @ApiPropertyOptional({
    description: 'Page number (only when paginated=1)',
    example: 1,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page (only when paginated=1)',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}