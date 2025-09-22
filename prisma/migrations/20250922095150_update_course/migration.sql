/*
  Warnings:

  - You are about to drop the column `semester_id` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `course_num` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the column `mi_id` on the `Semester` table. All the data in the column will be lost.
  - Added the required column `major_id` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_semester_id_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "semester_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "major_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "MajorIntake" ALTER COLUMN "deleted" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "course_num",
DROP COLUMN "mi_id";
