-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "major_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "class_id" TEXT,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "regist_status" TEXT NOT NULL DEFAULT 'closed',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamRegist" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamRegist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttend" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "exam_id" TEXT NOT NULL,
    "status" TEXT,

    CONSTRAINT "ExamAttend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_major_id_fkey" FOREIGN KEY ("major_id") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegist" ADD CONSTRAINT "ExamRegist_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegist" ADD CONSTRAINT "ExamRegist_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttend" ADD CONSTRAINT "ExamAttend_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttend" ADD CONSTRAINT "ExamAttend_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
