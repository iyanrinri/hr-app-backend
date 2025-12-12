-- Migration: Add salary and overtime tables with data migration
-- Step 1: Create new tables first
CREATE TABLE "salaries" (
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

CREATE TABLE "salary_histories" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "changeType" TEXT NOT NULL,
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

CREATE TABLE "overtime_requests" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "attendanceId" BIGINT,
    "date" DATE NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "totalMinutes" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
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

CREATE TABLE "overtime_approvals" (
    "id" BIGSERIAL NOT NULL,
    "overtimeRequestId" BIGINT NOT NULL,
    "approverId" BIGINT NOT NULL,
    "approverType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "overtime_approvals_pkey" PRIMARY KEY ("id")
);

-- Step 2: Add foreign key constraints
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "salary_histories" ADD CONSTRAINT "salary_histories_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_overtimeRequestId_fkey" FOREIGN KEY ("overtimeRequestId") REFERENCES "overtime_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Step 3: Add unique constraints
ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_overtimeRequestId_approverId_approverType_key" UNIQUE ("overtimeRequestId", "approverId", "approverType");

-- Step 4: Data migration - Move existing baseSalary data to salaries table
INSERT INTO "salaries" ("employeeId", "baseSalary", "effectiveDate", "isActive", "createdBy", "updatedAt")
SELECT 
    "id",
    "baseSalary",
    "joinDate",
    true,
    1, -- Default createdBy (system user)
    CURRENT_TIMESTAMP
FROM "employees" 
WHERE "baseSalary" IS NOT NULL AND "isDeleted" = false;

-- Step 5: Create initial salary history records
INSERT INTO "salary_histories" ("employeeId", "changeType", "newBaseSalary", "reason", "effectiveDate")
SELECT 
    "id",
    'INITIAL',
    "baseSalary",
    'Initial salary setup during system migration',
    "joinDate"
FROM "employees" 
WHERE "baseSalary" IS NOT NULL AND "isDeleted" = false;

-- Step 6: Drop baseSalary column from employees table
ALTER TABLE "employees" DROP COLUMN "baseSalary";