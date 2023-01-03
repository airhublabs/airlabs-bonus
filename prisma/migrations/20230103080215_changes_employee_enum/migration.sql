/*
  Warnings:

  - The values [PILOT,ATTENDANT] on the enum `EmployeeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeType_new" AS ENUM ('FLIGHT', 'CABIN');
ALTER TABLE "Employee" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Employee" ALTER COLUMN "type" TYPE "EmployeeType_new" USING ("type"::text::"EmployeeType_new");
ALTER TYPE "EmployeeType" RENAME TO "EmployeeType_old";
ALTER TYPE "EmployeeType_new" RENAME TO "EmployeeType";
DROP TYPE "EmployeeType_old";
ALTER TABLE "Employee" ALTER COLUMN "type" SET DEFAULT 'CABIN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_employee_id_fkey";

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "type" SET DEFAULT 'CABIN';

-- CreateTable
CREATE TABLE "ZohoIntergration" (
    "id" SERIAL NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "ZohoIntergration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
