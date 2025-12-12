/*
  Warnings:

  - You are about to drop the column `baseSalary` on the `employees` table. All the data in the column will be lost.
  - Added the required column `grossSalary` to the `payrolls` table without a default value. This is not possible if the table is not empty.

*/
/*
  Migration: Add Salary and Overtime Tables
  This migration:
  1. Creates salary and overtime tables
  2. Migrates existing employee baseSalary data to salaries table
  3. Drops the baseSalary column from employees table
*/

-- Skip enum creation if already exists (from previous migration)
DO $$ BEGIN
    CREATE TYPE "SalaryChangeType" AS ENUM ('INITIAL', 'PROMOTION', 'GRADE_ADJUSTMENT', 'PERFORMANCE_INCREASE', 'MARKET_ADJUSTMENT', 'DEPARTMENT_TRANSFER', 'POSITION_CHANGE', 'ANNUAL_INCREMENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OvertimeStatus" AS ENUM ('PENDING', 'MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "payrolls" ADD COLUMN IF NOT EXISTS "grossSalary" DECIMAL(65,30),
ADD COLUMN     "overtimeHours" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "overtimePay" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "processedBy" BIGINT,
ADD COLUMN     "regularHours" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- Update existing payrolls to have grossSalary equal to baseSalary + bonuses - deductions
UPDATE "payrolls" 
SET "grossSalary" = "baseSalary" + "bonuses" - "deductions"
WHERE "grossSalary" IS NULL;

-- Make grossSalary NOT NULL after migration
ALTER TABLE "payrolls" ALTER COLUMN "grossSalary" SET NOT NULL;

-- CreateTable
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

-- CreateTable
CREATE TABLE "salary_histories" (
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

-- CreateTable
CREATE TABLE "overtime_requests" (
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

-- CreateTable
CREATE TABLE "overtime_approvals" (
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

-- CreateIndex
CREATE UNIQUE INDEX "overtime_approvals_overtimeRequestId_approverId_approverTyp_key" ON "overtime_approvals"("overtimeRequestId", "approverId", "approverType");

-- AddForeignKey
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salaries" ADD CONSTRAINT "salaries_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salary_histories" ADD CONSTRAINT "salary_histories_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_requests" ADD CONSTRAINT "overtime_requests_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_overtimeRequestId_fkey" FOREIGN KEY ("overtimeRequestId") REFERENCES "overtime_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "overtime_approvals" ADD CONSTRAINT "overtime_approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Migrate employee baseSalary to salaries table
-- Get first user ID for createdBy (assuming we have at least one user)
DO $$
DECLARE
  first_user_id BIGINT;
BEGIN
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
  WHERE e."baseSalary" IS NOT NULL;
  
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
  WHERE e."baseSalary" IS NOT NULL;
END $$;

-- Now it's safe to drop the baseSalary column
ALTER TABLE "employees" DROP COLUMN IF EXISTS "baseSalary";