/*
  Warnings:

  - Added the required column `plain_name` to the `Exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exam" ADD COLUMN     "plain_name" TEXT NOT NULL;
