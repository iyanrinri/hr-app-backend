import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return users.map(user => ({
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Prevent demoting the last SUPER user
    if (existingUser.role === Role.SUPER && updateUserRoleDto.role !== Role.SUPER) {
      const superUserCount = await this.prisma.user.count({
        where: { role: Role.SUPER },
      });

      if (superUserCount <= 1) {
        throw new ForbiddenException('Cannot demote the last SUPER user');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: BigInt(id) },
      data: {
        role: updateUserRoleDto.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };
  }

  async deleteUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Prevent deleting SUPER users
    if (existingUser.role === 'SUPER') {
      const superUserCount = await this.prisma.user.count({
        where: { role: 'SUPER' },
      });

      if (superUserCount <= 1) {
        throw new ForbiddenException('Cannot delete the last SUPER user');
      }
    }

    await this.prisma.user.delete({
      where: { id: BigInt(id) },
    });

    return { message: 'User deleted successfully' };
  }

  getAllRoles() {
    return Object.values(Role).map(role => ({
      value: role,
      label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
    }));
  }
}