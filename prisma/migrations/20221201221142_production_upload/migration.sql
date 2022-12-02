/*
  Warnings:

  - A unique constraint covering the columns `[emp_no]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employee_id` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('PILOT', 'ATTENDANT');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "type" "EmployeeType" NOT NULL DEFAULT E'ATTENDANT';

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "employee_id" INTEGER NOT NULL,
ALTER COLUMN "vehicle_type" DROP NOT NULL,
ALTER COLUMN "roster_designators" DROP NOT NULL,
ALTER COLUMN "project_name_text" DROP NOT NULL;

-- CreateTable
CREATE TABLE "DangerZone" (
    "id" SERIAL NOT NULL,
    "zone" TEXT NOT NULL,
    "bonus_amount" DOUBLE PRECISION NOT NULL DEFAULT 25.5,
    "bonus_currency" TEXT NOT NULL DEFAULT E'EUR',

    CONSTRAINT "DangerZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DangerZone_zone_key" ON "DangerZone"("zone");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_emp_no_key" ON "Employee"("emp_no");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
