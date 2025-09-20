/*
  Warnings:

  - You are about to drop the column `head_teacher_id` on the `Intake` table. All the data in the column will be lost.
  - You are about to drop the column `num_days` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the column `semester_order` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the `IntakeHasCourse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updated_at` to the `MajorIntake` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mi_id` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plain_name` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Intake" DROP CONSTRAINT "Intake_head_teacher_id_fkey";

-- AlterTable
ALTER TABLE "Intake" DROP COLUMN "head_teacher_id";

-- AlterTable
ALTER TABLE "MajorIntake" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "num_days",
DROP COLUMN "semester_order",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "mi_id" TEXT NOT NULL,
ADD COLUMN     "plain_name" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- DropTable
DROP TABLE "IntakeHasCourse";

-- CreateTable
CREATE TABLE "MajorIntakeCourse" (
    "id" TEXT NOT NULL,
    "mi_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "MajorIntakeCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "semester_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "plain_name" TEXT NOT NULL,
    "weight" TEXT,
    "description" TEXT,
    "parent_id" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MajorIntakeCourse" ADD CONSTRAINT "MajorIntakeCourse_mi_id_fkey" FOREIGN KEY ("mi_id") REFERENCES "MajorIntake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorIntakeCourse" ADD CONSTRAINT "MajorIntakeCourse_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
