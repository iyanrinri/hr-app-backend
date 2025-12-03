import { PrismaService } from '../../../database/prisma.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: string;
        updatedAt: string;
    }[]>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: string;
        updatedAt: string;
    }>;
    updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: string;
        updatedAt: string;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    getAllRoles(): {
        value: "SUPER" | "HR" | "MANAGER" | "EMPLOYEE";
        label: string;
    }[];
}
