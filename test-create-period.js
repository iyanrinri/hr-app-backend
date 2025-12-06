import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCreatePeriod() {
  try {
    console.log('🧪 Testing attendance period creation with new fields...\n');

    // First, check existing periods
    const existingPeriods = await prisma.attendancePeriod.findMany();
    console.log(`📊 Found ${existingPeriods.length} existing periods`);

    // Create test period exactly like the user's request
    const testPeriod = await prisma.attendancePeriod.create({
      data: {
        name: "Test Period - New Fields",
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-31'),
        workingDaysPerWeek: 5,
        workingHoursPerDay: 8,
        workingStartTime: "09:00",
        workingEndTime: "17:00", 
        allowSaturdayWork: true,    // This should be TRUE
        allowSundayWork: true,      // This should be TRUE 
        lateToleranceMinutes: 15,
        earlyLeaveToleranceMinutes: 15,
        description: "Test period with weekend and working hours config",
        isActive: false, // Don't conflict with active period
        createdBy: BigInt(1),
      },
    });

    console.log('✅ Created test period successfully!');
    console.log('📄 Period details:');
    console.log(`   - Name: ${testPeriod.name}`);
    console.log(`   - Working Start: ${testPeriod.workingStartTime}`);
    console.log(`   - Working End: ${testPeriod.workingEndTime}`);
    console.log(`   - Allow Saturday: ${testPeriod.allowSaturdayWork}`);
    console.log(`   - Allow Sunday: ${testPeriod.allowSundayWork}`);
    console.log(`   - Late Tolerance: ${testPeriod.lateToleranceMinutes} min`);
    console.log(`   - Early Leave Tolerance: ${testPeriod.earlyLeaveToleranceMinutes} min`);

    // Verify by fetching again
    const fetchedPeriod = await prisma.attendancePeriod.findUnique({
      where: { id: testPeriod.id },
    });

    console.log('\n🔍 Verification fetch:');
    console.log(`   - Allow Saturday (DB): ${fetchedPeriod?.allowSaturdayWork}`);
    console.log(`   - Allow Sunday (DB): ${fetchedPeriod?.allowSundayWork}`);

    if (fetchedPeriod?.allowSaturdayWork && fetchedPeriod?.allowSundayWork) {
      console.log('\n🎉 SUCCESS: Weekend fields saved correctly!');
    } else {
      console.log('\n❌ FAIL: Weekend fields not saved correctly!');
      console.log(`Expected: Saturday=true, Sunday=true`);
      console.log(`Got: Saturday=${fetchedPeriod?.allowSaturdayWork}, Sunday=${fetchedPeriod?.allowSundayWork}`);
    }

    // Clean up test period
    await prisma.attendancePeriod.delete({
      where: { id: testPeriod.id },
    });
    console.log('\n🧹 Cleaned up test period');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCreatePeriod();