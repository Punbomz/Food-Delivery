/*
  Warnings:

  - You are about to drop the column `foodID` on the `OptionGroup` table. All the data in the column will be lost.
  - Added the required column `ogForce` to the `OptionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OptionGroup" DROP CONSTRAINT "OptionGroup_foodID_fkey";

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "foodOptions" TEXT[];

-- AlterTable
ALTER TABLE "OptionGroup" DROP COLUMN "foodID",
ADD COLUMN     "ogForce" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "customerId" INTEGER;

-- CreateTable
CREATE TABLE "Customer" (
    "customerID" SERIAL NOT NULL,
    "customerFname" TEXT NOT NULL,
    "customerLname" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerPass" TEXT NOT NULL,
    "customerPic" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customerID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerEmail_key" ON "Customer"("customerEmail");

-- CreateIndex
CREATE INDEX "Session_customerId_idx" ON "Session"("customerId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("customerID") ON DELETE CASCADE ON UPDATE CASCADE;
