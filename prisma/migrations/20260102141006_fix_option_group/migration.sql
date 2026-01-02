/*
  Warnings:

  - You are about to drop the column `foodOptions` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the `_FoodToOptionGroup` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shopID,ogName]` on the table `OptionGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_ogID_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToOptionGroup" DROP CONSTRAINT "_FoodToOptionGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToOptionGroup" DROP CONSTRAINT "_FoodToOptionGroup_B_fkey";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "foodOptions";

-- DropTable
DROP TABLE "_FoodToOptionGroup";

-- CreateTable
CREATE TABLE "FoodOptionGroup" (
    "foodID" INTEGER NOT NULL,
    "ogID" INTEGER NOT NULL,

    CONSTRAINT "FoodOptionGroup_pkey" PRIMARY KEY ("foodID","ogID")
);

-- CreateIndex
CREATE INDEX "Option_ogID_idx" ON "Option"("ogID");

-- CreateIndex
CREATE UNIQUE INDEX "OptionGroup_shopID_ogName_key" ON "OptionGroup"("shopID", "ogName");

-- AddForeignKey
ALTER TABLE "FoodOptionGroup" ADD CONSTRAINT "FoodOptionGroup_foodID_fkey" FOREIGN KEY ("foodID") REFERENCES "Food"("foodID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodOptionGroup" ADD CONSTRAINT "FoodOptionGroup_ogID_fkey" FOREIGN KEY ("ogID") REFERENCES "OptionGroup"("ogID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_ogID_fkey" FOREIGN KEY ("ogID") REFERENCES "OptionGroup"("ogID") ON DELETE CASCADE ON UPDATE CASCADE;
