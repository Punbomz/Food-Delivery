/*
  Warnings:

  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_shopID_fkey";

-- DropTable
DROP TABLE "History";

-- CreateTable
CREATE TABLE "ShopHistory" (
    "shopHistoryID" SERIAL NOT NULL,
    "shopID" INTEGER NOT NULL,
    "shopLogin" TIMESTAMP(3) NOT NULL,
    "shopLogout" TIMESTAMP(3),

    CONSTRAINT "ShopHistory_pkey" PRIMARY KEY ("shopHistoryID")
);

-- AddForeignKey
ALTER TABLE "ShopHistory" ADD CONSTRAINT "ShopHistory_shopID_fkey" FOREIGN KEY ("shopID") REFERENCES "Shop"("shopID") ON DELETE RESTRICT ON UPDATE CASCADE;
