-- CreateEnum
CREATE TYPE "SettingDataType" AS ENUM ('STRING', 'INTEGER', 'DECIMAL', 'BOOLEAN', 'JSON', 'EMAIL', 'URL', 'DATE', 'DATETIME', 'TIME', 'PASSWORD');

-- CreateEnum
CREATE TYPE "SettingCategory" AS ENUM ('GENERAL', 'COMPANY', 'ATTENDANCE', 'LEAVE', 'PAYROLL', 'NOTIFICATION', 'SECURITY', 'INTEGRATION');

-- CreateTable
CREATE TABLE "settings" (
    "id" BIGSERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "dataType" "SettingDataType" NOT NULL DEFAULT 'STRING',
    "category" "SettingCategory" NOT NULL DEFAULT 'GENERAL',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdBy" BIGINT NOT NULL,
    "updatedBy" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");
