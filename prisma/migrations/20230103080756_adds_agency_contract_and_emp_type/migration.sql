/*
  Warnings:

  - Added the required column `agency` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_type` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employment_type` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "agency" TEXT NOT NULL,
ADD COLUMN     "contract_type" TEXT NOT NULL,
ADD COLUMN     "employment_type" TEXT NOT NULL;
