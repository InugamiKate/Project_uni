/*
  Warnings:

  - You are about to drop the column `graduated_num` on the `Intake` table. All the data in the column will be lost.
  - You are about to drop the column `remain_num` on the `Intake` table. All the data in the column will be lost.
  - You are about to drop the column `semester_num` on the `Intake` table. All the data in the column will be lost.
  - You are about to drop the column `student_num` on the `Intake` table. All the data in the column will be lost.
  - You are about to drop the column `remain_num` on the `Major` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the `IntakeHaveSemsemester` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MajorHasIntake` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IntakeHasCourse" DROP CONSTRAINT "IntakeHasCourse_intake_id_fkey";

-- DropForeignKey
ALTER TABLE "IntakeHaveSemsemester" DROP CONSTRAINT "IntakeHaveSemsemester_intake_id_fkey";

-- DropForeignKey
ALTER TABLE "IntakeHaveSemsemester" DROP CONSTRAINT "IntakeHaveSemsemester_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "MajorHasIntake" DROP CONSTRAINT "MajorHasIntake_intake_id_fkey";

-- DropForeignKey
ALTER TABLE "MajorHasIntake" DROP CONSTRAINT "MajorHasIntake_major_id_fkey";

-- AlterTable
ALTER TABLE "Intake" DROP COLUMN "graduated_num",
DROP COLUMN "remain_num",
DROP COLUMN "semester_num",
DROP COLUMN "student_num",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Major" DROP COLUMN "remain_num";

-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "weight";

-- DropTable
DROP TABLE "IntakeHaveSemsemester";

-- DropTable
DROP TABLE "MajorHasIntake";

-- CreateTable
CREATE TABLE "MajorIntake" (
    "id" TEXT NOT NULL,
    "major_id" TEXT NOT NULL,
    "intake_id" TEXT NOT NULL,
    "head_teacher_id" TEXT,
    "total_weight" DOUBLE PRECISION,

    CONSTRAINT "MajorIntake_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MajorIntake" ADD CONSTRAINT "MajorIntake_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorIntake" ADD CONSTRAINT "MajorIntake_intake_id_fkey" FOREIGN KEY ("intake_id") REFERENCES "Intake"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
