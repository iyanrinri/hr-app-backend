import { PrismaClient, Role, SettingCategory } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Upsert Admin User
  const adminEmail = 'admin@company.com';
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      role: Role.SUPER,
    },
  });

  console.log({ admin });

  // Upsert Employee User & Profile
  const empEmail = 'john.doe@company.com';
  const empPassword = await bcrypt.hash('password123', 10);

  const employeeUser = await prisma.user.upsert({
    where: { email: empEmail },
    update: {},
    create: {
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

  // Upsert HR User & Profile
  const hrEmail = 'hr@company.com';
  const hrPassword = await bcrypt.hash('passwordhr123', 10);

  const hrUser = await prisma.user.upsert({
    where: { email: hrEmail },
    update: {},
    create: {
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

  // ====================================
  // SEED TAX (PPh 21) SETTINGS
  // ====================================
  console.log('\n📊 Seeding Indonesian Tax (PPh 21) Settings...');
  
  // PTKP (Tax-free Income) values untuk 2024
  const ptkpSettings = [
    { key: 'TAX_PTKP_TK_0', value: '54000000', description: 'PTKP Tidak Kawin (TK/0)', category: SettingCategory.TAX_PPH21 },
    { key: 'TAX_PTKP_TK_1', value: '58500000', description: 'PTKP Tidak Kawin dengan 1 tanggungan (TK/1)', category: 'TAX_PPH21' },
    { key: 'TAX_PTKP_TK_2', value: '63000000', description: 'PTKP Tidak Kawin dengan 2 tanggungan (TK/2)', category: 'TAX_PPH21' },
    { key: 'TAX_PTKP_TK_3', value: '67500000', description: 'PTKP Tidak Kawin dengan 3 tanggungan (TK/3)', category: 'TAX_PPH21' },
    { key: 'TAX_PTKP_K_0', value: '58500000', description: 'PTKP Kawin (K/0)', category: 'TAX_PPH21' },
    { key: 'TAX_PTKP_K_1', value: '63000000', description: 'PTKP Kawin dengan 1 tanggungan (K/1)', category: 'TAX_PPH21' },
    { key: 'TAX_PTKP_K_2', value: '67500000', description: 'PTKP Kawin dengan 2 tanggungan (K/2)', category: 'TAX_PPH21' },
    { key: 'TAX_PTKP_K_3', value: '72000000', description: 'PTKP Kawin dengan 3 tanggungan (K/3)', category: 'TAX_PPH21' },
  ];

  // Progressive Tax Brackets (PPh 21)
  const taxBrackets = [
    { key: 'TAX_BRACKET_1_LIMIT', value: '60000000', description: 'Batas Penghasilan Kena Pajak Lapisan 1 (0-60 juta)', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_1_RATE', value: '0.05', description: 'Tarif Pajak Lapisan 1: 5%', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_2_LIMIT', value: '250000000', description: 'Batas Penghasilan Kena Pajak Lapisan 2 (60-250 juta)', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_2_RATE', value: '0.15', description: 'Tarif Pajak Lapisan 2: 15%', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_3_LIMIT', value: '500000000', description: 'Batas Penghasilan Kena Pajak Lapisan 3 (250-500 juta)', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_3_RATE', value: '0.25', description: 'Tarif Pajak Lapisan 3: 25%', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_4_LIMIT', value: '5000000000', description: 'Batas Penghasilan Kena Pajak Lapisan 4 (500 juta - 5 miliar)', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_4_RATE', value: '0.30', description: 'Tarif Pajak Lapisan 4: 30%', category: 'TAX_PPH21' },
    { key: 'TAX_BRACKET_5_RATE', value: '0.35', description: 'Tarif Pajak Lapisan 5 (>5 miliar): 35%', category: 'TAX_PPH21' },
  ];

  // ====================================
  // SEED BPJS KESEHATAN SETTINGS
  // ====================================
  console.log('🏥 Seeding BPJS Kesehatan Settings...');
  
  const bpjsKesehatanSettings = [
    { key: 'BPJS_KESEHATAN_EMPLOYEE_RATE', value: '0.01', description: 'BPJS Kesehatan rate karyawan: 1%', category: 'BPJS_KESEHATAN' },
    { key: 'BPJS_KESEHATAN_COMPANY_RATE', value: '0.04', description: 'BPJS Kesehatan rate perusahaan: 4%', category: 'BPJS_KESEHATAN' },
    { key: 'BPJS_KESEHATAN_MAX_SALARY', value: '12000000', description: 'Maksimal gaji untuk perhitungan BPJS Kesehatan (12 juta)', category: 'BPJS_KESEHATAN' },
  ];

  // ====================================
  // SEED BPJS KETENAGAKERJAAN SETTINGS
  // ====================================
  console.log('💼 Seeding BPJS Ketenagakerjaan Settings...');
  
  const bpjsKetenagakerjaanSettings = [
    // Jaminan Hari Tua (JHT)
    { key: 'BPJS_TK_JHT_EMPLOYEE_RATE', value: '0.02', description: 'JHT rate karyawan: 2%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JHT_COMPANY_RATE', value: '0.037', description: 'JHT rate perusahaan: 3.7%', category: 'BPJS_KETENAGAKERJAAN' },
    
    // Jaminan Pensiun (JP)
    { key: 'BPJS_TK_JP_EMPLOYEE_RATE', value: '0.01', description: 'JP rate karyawan: 1%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JP_COMPANY_RATE', value: '0.02', description: 'JP rate perusahaan: 2%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JP_MAX_SALARY', value: '9559600', description: 'Maksimal gaji untuk perhitungan JP (updated 2024)', category: 'BPJS_KETENAGAKERJAAN' },
    
    // Jaminan Kecelakaan Kerja (JKK) - varies by risk level
    { key: 'BPJS_TK_JKK_RATE_LOW', value: '0.0024', description: 'JKK rate risiko sangat rendah: 0.24%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JKK_RATE_MEDIUM_LOW', value: '0.0054', description: 'JKK rate risiko rendah: 0.54%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JKK_RATE_MEDIUM', value: '0.0089', description: 'JKK rate risiko sedang: 0.89%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JKK_RATE_MEDIUM_HIGH', value: '0.0127', description: 'JKK rate risiko tinggi: 1.27%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JKK_RATE_HIGH', value: '0.0174', description: 'JKK rate risiko sangat tinggi: 1.74%', category: 'BPJS_KETENAGAKERJAAN' },
    { key: 'BPJS_TK_JKK_DEFAULT_RATE', value: '0.0024', description: 'JKK rate default (sangat rendah untuk kantor)', category: 'BPJS_KETENAGAKERJAAN' },
    
    // Jaminan Kematian (JKM)
    { key: 'BPJS_TK_JKM_COMPANY_RATE', value: '0.003', description: 'JKM rate perusahaan: 0.3%', category: 'BPJS_KETENAGAKERJAAN' },
  ];

  // ====================================
  // INSERT ALL SETTINGS
  // ====================================
  const allSettings = [
    ...ptkpSettings,
    ...taxBrackets,
    ...bpjsKesehatanSettings,
    ...bpjsKetenagakerjaanSettings,
  ];

  for (const setting of allSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
        description: setting.description,
        category: setting.category as any,
        createdBy: admin.id,
        updatedBy: admin.id,
      },
    });
  }

  console.log(`✅ Successfully seeded ${allSettings.length} tax and BPJS settings!`);
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
