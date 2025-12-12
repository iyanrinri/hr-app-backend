import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../database/prisma.service';
import { EmployeeService } from '../../employee/services/employee.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private employeeService: EmployeeService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findFirst({
      where: { 
        email,
        isDeleted: false,
      },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has subordinates
    const hasSubordinates = await this.checkHasSubordinates(user.id);

    const payload = { 
      sub: user.id.toString(), 
      email: user.email, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        hasSubordinates,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists (including soft-deleted)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser && !existingUser.isDeleted) {
      throw new ConflictException('User with this email already exists');
    }
    
    // If user is soft-deleted, we can reactivate them
    if (existingUser && existingUser.isDeleted) {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      
      const user = await this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role: registerDto.role,
          isDeleted: false,
          deletedAt: null,
        },
      });
      
      const { password: _, ...userWithoutPassword } = user;
      
      // Check if user has subordinates
      const hasSubordinates = await this.checkHasSubordinates(user.id);
      
      const payload = { 
        sub: user.id.toString(), 
        email: user.email, 
        role: user.role 
      };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user: {
          id: userWithoutPassword.id.toString(),
          email: userWithoutPassword.email,
          role: userWithoutPassword.role,
          hasSubordinates,
        },
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    // Check if user has subordinates
    const hasSubordinates = await this.checkHasSubordinates(user.id);

    const payload = { 
      sub: user.id.toString(), 
      email: user.email, 
      role: user.role 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: userWithoutPassword.id.toString(),
        email: userWithoutPassword.email,
        role: userWithoutPassword.role,
        hasSubordinates,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { 
        id: BigInt(userId),
        isDeleted: false,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if user has subordinates
    const hasSubordinates = await this.checkHasSubordinates(user.id);

    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      hasSubordinates,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private async checkHasSubordinates(userId: bigint): Promise<boolean> {
    try {
      // Get employee record for this user
      const employee = await this.employeeService.findByUserId(userId);
      if (!employee) {
        return false;
      }

      // Check if employee has subordinates
      const subordinates = await this.employeeService.getAllSubordinates(employee.id);
      return subordinates.length > 0;
    } catch (error) {
      // If any error occurs, return false
      return false;
    }
  }
}