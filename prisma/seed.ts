import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create Admin User
  const adminEmail = 'admin@company.com';
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminPassword,
      role: Role.SUPER,
    },
  });

  console.log({ admin });

  // Create Employee User & Profile
  const empEmail = 'john.doe@company.com';
  const empPassword = await bcrypt.hash('password123', 10);

  const employeeUser = await prisma.user.create({
    data: {
      email: empEmail,
      password: empPassword,
      role: Role.EMPLOYEE,
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

  // Create HR User & Profile
  const hrEmail = 'hr@company.com';
  const hrPassword = await bcrypt.hash('passwordhr123', 10);

  const hrUser = await prisma.user.create({
    data: {
      email: hrEmail,
      password: hrPassword,
      role: Role.HR,
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
