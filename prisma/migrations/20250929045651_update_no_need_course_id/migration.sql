/*
  Warnings:

  - You are about to drop the column `course_id` on the `ClassAttend` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClassAttend" DROP CONSTRAINT "ClassAttend_course_id_fkey";

-- AlterTable
ALTER TABLE "ClassAttend" DROP COLUMN "course_id";
