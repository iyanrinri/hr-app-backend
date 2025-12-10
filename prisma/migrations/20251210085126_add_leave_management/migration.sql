/*
  Warnings:

  - You are about to drop the column `approvedBy` on the `leave_requests` table. All the data in the column will be lost.
  - The `status` column on the `leave_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `leavePeriodId` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveTypeConfigId` to the `leave_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDays` to the `leave_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('ANNUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'HAJJ_UMRAH', 'EMERGENCY', 'COMPASSIONATE', 'STUDY', 'UNPAID');

-- CreateEnum
CREATE TYPE "LeaveRequestStatus" AS ENUM ('PENDING', 'MANAGER_APPROVED', 'HR_APPROVED', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "leave_requests" DROP COLUMN "approvedBy",
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "finalizedAt" TIMESTAMP(3),
ADD COLUMN     "handoverNotes" TEXT,
ADD COLUMN     "hrApprovedAt" TIMESTAMP(3),
ADD COLUMN     "hrComments" TEXT,
ADD COLUMN     "leavePeriodId" BIGINT NOT NULL,
ADD COLUMN     "leaveTypeConfigId" BIGINT NOT NULL,
ADD COLUMN     "managerApprovedAt" TIMESTAMP(3),
ADD COLUMN     "managerComments" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalDays" INTEGER NOT NULL,
ALTER COLUMN "startDate" SET DATA TYPE DATE,
ALTER COLUMN "endDate" SET DATA TYPE DATE,
DROP COLUMN "status",
ADD COLUMN     "status" "LeaveRequestStatus" NOT NULL DEFAULT 'PENDING';

-- DropEnum
DROP TYPE "LeaveStatus";

-- CreateTable
CREATE TABLE "leave_periods" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdBy" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_type_configs" (
    "id" BIGSERIAL NOT NULL,
    "leavePeriodId" BIGINT NOT NULL,
    "type" "LeaveType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "defaultQuota" INTEGER NOT NULL DEFAULT 0,
    "maxConsecutiveDays" INTEGER,
    "advanceNoticeDays" INTEGER NOT NULL DEFAULT 0,
    "isCarryForward" BOOLEAN NOT NULL DEFAULT false,
    "maxCarryForward" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_type_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_balances" (
    "id" BIGSERIAL NOT NULL,
    "employeeId" BIGINT NOT NULL,
    "leavePeriodId" BIGINT NOT NULL,
    "leaveTypeConfigId" BIGINT NOT NULL,
    "totalQuota" INTEGER NOT NULL DEFAULT 0,
    "usedQuota" INTEGER NOT NULL DEFAULT 0,
    "pendingQuota" INTEGER NOT NULL DEFAULT 0,
    "carriedForward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_balances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_approvals" (
    "id" BIGSERIAL NOT NULL,
    "leaveRequestId" BIGINT NOT NULL,
    "approverId" BIGINT NOT NULL,
    "approverType" TEXT NOT NULL,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leave_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leave_type_configs_leavePeriodId_type_key" ON "leave_type_configs"("leavePeriodId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "leave_balances_employeeId_leavePeriodId_leaveTypeConfigId_key" ON "leave_balances"("employeeId", "leavePeriodId", "leaveTypeConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "leave_approvals_leaveRequestId_approverId_approverType_key" ON "leave_approvals"("leaveRequestId", "approverId", "approverType");

-- AddForeignKey
ALTER TABLE "leave_type_configs" ADD CONSTRAINT "leave_type_configs_leavePeriodId_fkey" FOREIGN KEY ("leavePeriodId") REFERENCES "leave_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_leavePeriodId_fkey" FOREIGN KEY ("leavePeriodId") REFERENCES "leave_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_balances" ADD CONSTRAINT "leave_balances_leaveTypeConfigId_fkey" FOREIGN KEY ("leaveTypeConfigId") REFERENCES "leave_type_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leavePeriodId_fkey" FOREIGN KEY ("leavePeriodId") REFERENCES "leave_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_leaveTypeConfigId_fkey" FOREIGN KEY ("leaveTypeConfigId") REFERENCES "leave_type_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_approvals" ADD CONSTRAINT "leave_approvals_leaveRequestId_fkey" FOREIGN KEY ("leaveRequestId") REFERENCES "leave_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_approvals" ADD CONSTRAINT "leave_approvals_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
