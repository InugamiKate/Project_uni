-- AddForeignKey
ALTER TABLE "Intake" ADD CONSTRAINT "Intake_head_teacher_id_fkey" FOREIGN KEY ("head_teacher_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
