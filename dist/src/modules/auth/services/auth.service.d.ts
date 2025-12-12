import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../database/prisma.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private employeeService;
    constructor(prisma: PrismaService, jwtService: JwtService, employeeService: EmployeeService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: any;
            email: any;
            role: any;
            hasSubordinates: boolean;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            hasSubordinates: boolean;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        hasSubordinates: boolean;
        createdAt: string;
        updatedAt: string;
    }>;
    private checkHasSubordinates;
}
