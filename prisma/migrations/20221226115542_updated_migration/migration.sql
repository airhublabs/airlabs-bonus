/*
  Warnings:

  - You are about to drop the column `bonus_amount` on the `DangerZone` table. All the data in the column will be lost.
  - You are about to drop the column `bonus_currency` on the `DangerZone` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DangerZone" DROP COLUMN "bonus_amount",
DROP COLUMN "bonus_currency";
