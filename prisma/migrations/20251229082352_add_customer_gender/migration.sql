/*
  Warnings:

  - Added the required column `customerGender` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "customerGender" TEXT NOT NULL;
