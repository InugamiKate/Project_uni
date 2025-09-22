/*
  Warnings:

  - You are about to drop the column `intake_id` on the `MajorIntake` table. All the data in the column will be lost.
  - You are about to drop the column `intake_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Intake` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `intake` to the `MajorIntake` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MajorIntake" DROP CONSTRAINT "MajorIntake_intake_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_intake_id_fkey";

-- AlterTable
ALTER TABLE "MajorIntake" DROP COLUMN "intake_id",
ADD COLUMN     "intake" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "intake_id",
ADD COLUMN     "mi_id" TEXT;

-- DropTable
DROP TABLE "Intake";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mi_id_fkey" FOREIGN KEY ("mi_id") REFERENCES "MajorIntake"("id") ON DELETE SET NULL ON UPDATE CASCADE;
