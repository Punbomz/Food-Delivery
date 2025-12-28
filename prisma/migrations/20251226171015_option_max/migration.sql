/*
  Warnings:

  - You are about to drop the column `ogMultiple` on the `OptionGroup` table. All the data in the column will be lost.
  - Added the required column `ogMax` to the `OptionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionGroup" DROP COLUMN "ogMultiple",
ADD COLUMN     "ogMax" INTEGER NOT NULL;
