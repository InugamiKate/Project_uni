-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "regist_status" TEXT NOT NULL DEFAULT 'closed',
ALTER COLUMN "status" SET DEFAULT 'new';
