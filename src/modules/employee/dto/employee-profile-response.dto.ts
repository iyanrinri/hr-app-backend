import { ApiProperty } from '@nestjs/swagger';
import { Gender, MaritalStatus, EmploymentStatus } from '@prisma/client';

export class EmployeeProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  position: string;

  @ApiProperty()
  department: string;

  @ApiProperty()
  joinDate: string;

  @ApiProperty({ required: false })
  managerId?: string;

  // Personal Information
  @ApiProperty({ required: false })
  employeeNumber?: string;

  @ApiProperty({ required: false })
  dateOfBirth?: string;

  @ApiProperty({ required: false, enum: Gender })
  gender?: Gender;

  @ApiProperty({ required: false, enum: MaritalStatus })
  maritalStatus?: MaritalStatus;

  @ApiProperty({ required: false })
  nationality?: string;

  @ApiProperty({ required: false })
  religion?: string;

  @ApiProperty({ required: false })
  bloodType?: string;

  @ApiProperty({ required: false })
  idNumber?: string;

  @ApiProperty({ required: false })
  taxNumber?: string;

  // Contact Information
  @ApiProperty({ required: false })
  phoneNumber?: string;

  @ApiProperty({ required: false })
  alternativePhone?: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  city?: string;

  @ApiProperty({ required: false })
  province?: string;

  @ApiProperty({ required: false })
  postalCode?: string;

  @ApiProperty({ required: false })
  emergencyContactName?: string;

  @ApiProperty({ required: false })
  emergencyContactPhone?: string;

  @ApiProperty({ required: false })
  emergencyContactRelation?: string;

  // Bank Information
  @ApiProperty({ required: false })
  bankName?: string;

  @ApiProperty({ required: false })
  bankAccountNumber?: string;

  @ApiProperty({ required: false })
  bankAccountName?: string;

  // Employment Details
  @ApiProperty({ enum: EmploymentStatus })
  employmentStatus: EmploymentStatus;

  @ApiProperty({ required: false })
  contractStartDate?: string;

  @ApiProperty({ required: false })
  contractEndDate?: string;

  @ApiProperty({ required: false })
  workLocation?: string;

  // Profile Picture
  @ApiProperty({ required: false, example: 'http://localhost:3000/uploads/profiles/1702345678901-profile.jpg' })
  profilePicture?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  // Relations
  @ApiProperty({ required: false })
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
  };

  @ApiProperty({ required: false })
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
