"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../../database/prisma.service");
const employee_service_1 = require("../../employee/services/employee.service");
const bcrypt = __importStar(require("bcrypt"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    employeeService;
    constructor(prisma, jwtService, employeeService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.employeeService = employeeService;
    }
    async validateUser(email, password) {
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
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
    async register(registerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: registerDto.email },
        });
        if (existingUser && !existingUser.isDeleted) {
            throw new common_1.ConflictException('User with this email already exists');
        }
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
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                role: registerDto.role,
            },
        });
        const { password: _, ...userWithoutPassword } = user;
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
    async getProfile(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
        }
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
    async checkHasSubordinates(userId) {
        try {
            const employee = await this.employeeService.findByUserId(userId);
            if (!employee) {
                return false;
            }
            const subordinates = await this.employeeService.getAllSubordinates(employee.id);
            return subordinates.length > 0;
        }
        catch (error) {
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        employee_service_1.EmployeeService])
], AuthService);
//# sourceMappingURL=auth.service.js.map