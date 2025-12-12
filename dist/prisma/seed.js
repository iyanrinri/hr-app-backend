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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Seeding database...');
    const adminEmail = 'admin@company.com';
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: adminPassword,
            role: client_1.Role.SUPER,
        },
    });
    console.log({ admin });
    const empEmail = 'john.doe@company.com';
    const empPassword = await bcrypt.hash('password123', 10);
    const employeeUser = await prisma.user.create({
        data: {
            email: empEmail,
            password: empPassword,
            role: client_1.Role.EMPLOYEE,
            employee: {
                create: {
                    firstName: 'John',
                    lastName: 'Doe',
                    position: 'Software Engineer',
                    department: 'IT',
                    joinDate: new Date('2023-01-01'),
                },
            },
        },
        include: {
            employee: true,
        },
    });
    console.log({ employeeUser });
    const hrEmail = 'hr@company.com';
    const hrPassword = await bcrypt.hash('passwordhr123', 10);
    const hrUser = await prisma.user.create({
        data: {
            email: hrEmail,
            password: hrPassword,
            role: client_1.Role.HR,
            employee: {
                create: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    position: 'HR Manager',
                    department: 'Human Resources',
                    joinDate: new Date('2022-06-15'),
                },
            },
        },
        include: {
            employee: true,
        },
    });
    console.log({ hrUser });
    console.log('\n✅ Seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map