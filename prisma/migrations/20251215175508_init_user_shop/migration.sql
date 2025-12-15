/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userFname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userGender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userLname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPass` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userPhone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "userEmail" TEXT NOT NULL,
ADD COLUMN     "userFname" TEXT NOT NULL,
ADD COLUMN     "userGender" TEXT NOT NULL,
ADD COLUMN     "userID" SERIAL NOT NULL,
ADD COLUMN     "userLname" TEXT NOT NULL,
ADD COLUMN     "userPass" TEXT NOT NULL,
ADD COLUMN     "userPhone" TEXT NOT NULL,
ADD COLUMN     "userPic" TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Shop" (
    "shopID" SERIAL NOT NULL,
    "shopFname" TEXT NOT NULL,
    "shopLname" TEXT NOT NULL,
    "shopGender" TEXT NOT NULL,
    "shopEmail" TEXT NOT NULL,
    "shopPhone" TEXT NOT NULL,
    "shopPass" TEXT NOT NULL,
    "shopName" TEXT NOT NULL,
    "shopLocation" TEXT NOT NULL,
    "shopPic" TEXT,
    "shopQR" TEXT,
    "shopOpenTime" TEXT NOT NULL DEFAULT '09:00',
    "shopCloseTime" TEXT NOT NULL DEFAULT '18:00',
    "shopOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("shopID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopEmail_key" ON "Shop"("shopEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");
