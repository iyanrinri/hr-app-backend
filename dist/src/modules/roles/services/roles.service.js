"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const client_1 = require("@prisma/client");
let RolesService = class RolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getUserById(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return {
            id: user.id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        };
    }
    async updateUserRole(id, updateUserRoleDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: BigInt(id) },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (existingUser.role === client_1.Role.SUPER && updateUserRoleDto.role !== client_1.Role.SUPER) {
            const superUserCount = await this.prisma.user.count({
                where: { role: client_1.Role.SUPER },
            });
            if (superUserCount <= 1) {
                throw new common_1.ForbiddenException('Cannot demote the last SUPER user');
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
    async deleteUser(id) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: BigInt(id) },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (existingUser.role === 'SUPER') {
            const superUserCount = await this.prisma.user.count({
                where: { role: 'SUPER' },
            });
            if (superUserCount <= 1) {
                throw new common_1.ForbiddenException('Cannot delete the last SUPER user');
            }
        }
        await this.prisma.user.delete({
            where: { id: BigInt(id) },
        });
        return { message: 'User deleted successfully' };
    }
    getAllRoles() {
        return Object.values(client_1.Role).map(role => ({
            value: role,
            label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
        }));
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolesService);
//# sourceMappingURL=roles.service.js.map