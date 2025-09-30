-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;
