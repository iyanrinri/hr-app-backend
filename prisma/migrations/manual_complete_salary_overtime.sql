-- Complete migration for salary and overtime modules
-- This file can be executed safely multiple times

-- 1. Create enums if not exist
DO $$ BEGIN
    CREATE TYPE "SalaryChangeType" AS ENUM (
        'INITIAL', 'PROMOTION', 'GRADE_ADJUSTMENT', 'PERFORMANCE_INCREASE', 
        'MARKET_ADJUSTMENT', 'DEPARTMENT_TRANSFER', 'POSITION_CHANGE', 'ANNUAL_INCREMENT'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OvertimeStatus" AS ENUM (
        'PENDING', 'MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create salaries table if not exists
CREATE TABLE IF NOT EXISTS "salaries" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "baseSalary" DECIMAL(65,30) NOT NULL,
    "allowances" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "grade" TEXT,
    "effectiveDate" DATE NOT NULL,
    "endDate" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdBy" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- 3. Create salary_histories table if not exists
CREATE TABLE IF NOT EXISTS "salary_histories" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "changeType" "SalaryChangeType" NOT NULL,
    "oldBaseSalary" DECIMAL(65,30),
    "newBaseSalary" DECIMAL(65,30) NOT NULL,
    "oldGrade" TEXT,
    "newGrade" TEXT,
    "oldPosition" TEXT,
    "newPosition" TEXT,
    "oldDepartment" TEXT,
    "newDepartment" TEXT,
    "reason" TEXT NOT NULL,
    "effectiveDate" DATE NOT NULL,
    "approvedBy" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "salary_histories_pkey" PRIMARY KEY ("id")
);

-- 4. Create overtime_requests table if not exists
CREATE TABLE IF NOT EXISTS "overtime_requests" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "attendanceId" BIGINT,
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalMinutes" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "OvertimeStatus" NOT NULL DEFAULT 'PENDING',
    "overtimeRate" DECIMAL(65,30),
    "calculatedAmount" DECIMAL(65,30),
    "managerComments" TEXT,
    "hrComments" TEXT,
    "rejectionReason" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerApprovedAt" TIMESTAMP(3),
    "hrApprovedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "overtime_requests_pkey" PRIMARY KEY ("id")
);

-- 5. Create overtime_approvals table if not exists
CREATE TABLE IF NOT EXISTS "overtime_approvals" (
    "id" BIGSERIAL NOT NULL,
    "overtimeRequestId" BIGINT NOT NULL,
    "approverId" BIGINT NOT NULL,
    "approverType" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "overtime_approvals_pkey" PRIMARY KEY ("id")
);

-- 6. Add new columns to payrolls table
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "grossSalary" DECIMAL(65,30);
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "overtimeHours" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "overtimePay" DECIMAL(65,30) NOT NULL DEFAULT 0;
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "processedAt" TIMESTAMP(3);
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "processedBy" BIGINT;
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "regularHours" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- 7. Update existing payrolls to have grossSalary
UPDATE "payrolls" 
SET "grossSalary" = "baseSalary" + "bonuses" - "deductions"
WHERE "grossSalary" IS NULL;

-- 8. Make grossSalary NOT NULL after migration
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payrolls' AND column_name = 'grossSalary' AND is_nullable = 'YES') THEN
        ALTER TABLE "payrolls" ALTER COLUMN "grossSalary" SET NOT NULL;
    END IF;
END $$;

-- 9. Add foreign keys if not exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payrolls_processedBy_fkey') THEN
        ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_processedBy_fkey" 
        FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'salaries_employeeId_fkey') THEN
        ALTER TABLE "salaries" ADD CONSTRAINT "salaries_employeeId_fkey" 
        FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'salary_histories_employeeId_fkey') THEN
        ALTER TABLE "salary_histories" ADD CONSTRAINT "salary_histories_employeeId_fkey" 
        FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'overtime_requests_employeeId_fkey') THEN
        ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_employeeId_fkey" 
        FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'overtime_requests_attendanceId_fkey') THEN
        ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_attendanceId_fkey" 
        FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'overtime_approvals_overtimeRequestId_fkey') THEN
        ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_overtimeRequestId_fkey" 
        FOREIGN KEY ("overtimeRequestId") REFERENCES "overtime_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'overtime_approvals_approverId_fkey') THEN
        ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_approverId_fkey" 
        FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

-- 10. Create unique index if not exists
CREATE UNIQUE INDEX IF NOT EXISTS "overtime_approvals_unique_approval" 
ON "overtime_approvals"("overtimeRequestId", "approverId", "approverType");

-- 11. Migrate employee baseSalary to salaries table (only if baseSalary column still exists)
DO $$
DECLARE
  first_user_id BIGINT;
  column_exists BOOLEAN;
BEGIN
  -- Check if baseSalary column exists
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'employees' AND column_name = 'baseSalary'
  ) INTO column_exists;
  
  IF column_exists THEN
    -- Get first user ID for createdBy
    SELECT id INTO first_user_id FROM users LIMIT 1;
    
    -- Create salary records for all employees with baseSalary
    INSERT INTO "salaries" ("employeeId", "baseSalary", "effectiveDate", "isActive", "createdBy", "createdAt", "updatedAt")
    SELECT 
      e.id,
      e."baseSalary",
      e."hireDate",
      true,
      COALESCE(first_user_id, 1),
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    FROM "employees" e
    WHERE e."baseSalary" IS NOT NULL
    ON CONFLICT DO NOTHING;  -- Skip if already migrated
    
    -- Create salary history records
    INSERT INTO "salary_histories" ("employeeId", "changeType", "newBaseSalary", "reason", "effectiveDate", "createdAt")
    SELECT 
      e.id,
      'INITIAL',
      e."baseSalary",
      'Initial salary setup - migrated from employees table',
      e."hireDate",
      CURRENT_TIMESTAMP
    FROM "employees" e
    WHERE e."baseSalary" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM "salary_histories" sh 
        WHERE sh."employeeId" = e.id AND sh."changeType" = 'INITIAL'
      );  -- Skip if history already exists
    
    -- Now drop the baseSalary column
    ALTER TABLE "employees" DROP COLUMN "baseSalary";
  END IF;
END $$;

-- Migration complete! Tables are ready for use.
