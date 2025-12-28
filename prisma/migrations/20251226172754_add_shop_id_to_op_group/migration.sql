/*
  Warnings:

  - Added the required column `shopID` to the `OptionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionGroup" ADD COLUMN     "shopID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OptionGroup" ADD CONSTRAINT "OptionGroup_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE RESTRICT ON UPDATE CASCADE;
