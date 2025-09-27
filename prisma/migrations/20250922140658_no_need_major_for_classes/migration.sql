-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_major_id_fkey";

-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "major_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;
