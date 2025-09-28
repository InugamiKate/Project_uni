-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "max_student" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'closed';
