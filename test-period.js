import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAttendancePeriod() {
  try {
    // Create test period with new fields
    const period = await prisma.attendancePeriod.create({
      data: {
        name: "Test Period with New Fields",
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-31'),
        workingStartTime: "08:00",
        workingEndTime: "18:00", 
        allowSaturdayWork: true,
        allowSundayWork: false,
        lateToleranceMinutes: 10,
        earlyLeaveToleranceMinutes: 15,
        description: "Test period with weekend and working hours config",
        createdBy: BigInt(1), // Assuming admin user exists
      },
    });

    console.log('✅ Created period:', JSON.stringify(period, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value, 2
    ));

    // Fetch it back to see full structure
    const fetchedPeriod = await prisma.attendancePeriod.findUnique({
      where: { id: period.id },
    });

    console.log('\n✅ Fetched period:', JSON.stringify(fetchedPeriod, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value, 2
    ));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAttendancePeriod();