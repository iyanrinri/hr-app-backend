import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender, MaritalStatus, EmploymentStatus } from '@prisma/client';

export class UpdateEmployeeProfileDto {
  // Personal Information
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'EMP001', required: false })
  @IsString()
  @IsOptional()
  employeeNumber?: string;

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiProperty({ example: 'MALE', enum: Gender, required: false })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ example: 'SINGLE', enum: MaritalStatus, required: false })
  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @ApiProperty({ example: 'Indonesian', required: false })
  @IsString()
  @IsOptional()
  nationality?: string;

  @ApiProperty({ example: 'Islam', required: false })
  @IsString()
  @IsOptional()
  religion?: string;

  @ApiProperty({ example: 'A+', required: false })
  @IsString()
  @IsOptional()
  bloodType?: string;

  @ApiProperty({ example: '3201234567890123', required: false })
  @IsString()
  @IsOptional()
  idNumber?: string;

  @ApiProperty({ example: '12.345.678.9-012.345', required: false })
  @IsString()
  @IsOptional()
  taxNumber?: string;

  // Contact Information
  @ApiProperty({ example: '+628123456789', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: '+628987654321', required: false })
  @IsString()
  @IsOptional()
  alternativePhone?: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 123', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Jakarta', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'DKI Jakarta', required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: '12345', required: false })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty({ example: 'Jane Doe', required: false })
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiProperty({ example: '+628111222333', required: false })
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiProperty({ example: 'Spouse', required: false })
  @IsString()
  @IsOptional()
  emergencyContactRelation?: string;

  // Bank Information
  @ApiProperty({ example: 'Bank Mandiri', required: false })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  bankAccountName?: string;

  // Employment Details  
  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ example: 'Information Technology', required: false })
  @IsString()
  @IsOptional()
  department?: string;

  @ApiProperty({ example: 'PERMANENT', enum: EmploymentStatus, required: false })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  employmentStatus?: EmploymentStatus;

  @ApiProperty({ example: '2023-01-01', required: false })
  @IsDateString()
  @IsOptional()
  contractStartDate?: string;

  @ApiProperty({ example: '2024-12-31', required: false })
  @IsDateString()
  @IsOptional()
  contractEndDate?: string;

  @ApiProperty({ example: 'Jakarta Office', required: false })
  @IsString()
  @IsOptional()
  workLocation?: string;
}
