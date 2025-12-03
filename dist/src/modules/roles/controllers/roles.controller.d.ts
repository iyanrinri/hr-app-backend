import { RolesService } from '../services/roles.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    getAllUsers(): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: string;
        updatedAt: string;
    }[]>;
    getUserById(id: number): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: string;
        updatedAt: string;
    }>;
    updateUserRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: string;
        updatedAt: string;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
    getAllRoles(): Promise<{
        value: "SUPER" | "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";
        label: string;
    }[]>;
}
