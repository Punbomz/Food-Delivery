/*
  Warnings:

  - A unique constraint covering the columns `[customerID]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cart_customerID_idx";

-- DropIndex
DROP INDEX "Cart_customerID_shopID_key";

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customerID_key" ON "Cart"("customerID");
