-- Migration: Update Payroll table with overtime fields
-- This migration adds overtime calculation fields to the payrolls table

-- Add new columns to payrolls table
ALTER TABLE "payrolls" ADD COLUMN "overtimePay" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "payrolls" ADD COLUMN "grossSalary" DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE "payrolls" ADD COLUMN "overtimeHours" DECIMAL(5,2) NOT NULL DEFAULT 0;
ALTER TABLE "payrolls" ADD COLUMN "regularHours" DECIMAL(5,2) NOT NULL DEFAULT 0;
ALTER TABLE "payrolls" ADD COLUMN "processedAt" TIMESTAMP;
ALTER TABLE "payrolls" ADD COLUMN "processedBy" BIGINT;

-- Add foreign key constraint for processedBy
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_processedBy_fkey" 
  FOREIGN KEY ("processedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update existing records to set grossSalary = baseSalary + bonuses - deductions
UPDATE "payrolls" SET "grossSalary" = "baseSalary" + "bonuses";

-- Create index for better query performance
CREATE INDEX "payrolls_processedBy_idx" ON "payrolls"("processedBy");
CREATE INDEX "payrolls_isPaid_idx" ON "payrolls"("isPaid");
CREATE INDEX "payrolls_periodStart_idx" ON "payrolls"("periodStart");
CREATE INDEX "payrolls_periodEnd_idx" ON "payrolls"("periodEnd");