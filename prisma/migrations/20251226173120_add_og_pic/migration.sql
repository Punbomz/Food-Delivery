/*
  Warnings:

  - Added the required column `ogPic` to the `OptionGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OptionGroup" ADD COLUMN     "ogPic" TEXT NOT NULL;
