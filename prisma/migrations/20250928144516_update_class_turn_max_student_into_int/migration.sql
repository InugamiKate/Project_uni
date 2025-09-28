/*
  Warnings:

  - The `max_student` column on the `Class` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Class" DROP COLUMN "max_student",
ADD COLUMN     "max_student" INTEGER;
