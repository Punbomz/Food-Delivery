/*
  Warnings:

  - The `foodOptions` column on the `Food` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `opStatus` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Food" DROP COLUMN "foodOptions",
ADD COLUMN     "foodOptions" INTEGER[];

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "opStatus";
