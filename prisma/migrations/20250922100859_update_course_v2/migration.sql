/*
  Warnings:

  - The `weight` column on the `Course` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "weight",
ADD COLUMN     "weight" INTEGER;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
