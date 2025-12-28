/*
  Warnings:

  - You are about to drop the column `ogMax` on the `OptionGroup` table. All the data in the column will be lost.
  - Added the required column `ogMultiple` to the `OptionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionGroup" DROP COLUMN "ogMax",
ADD COLUMN     "ogMultiple" BOOLEAN NOT NULL;
