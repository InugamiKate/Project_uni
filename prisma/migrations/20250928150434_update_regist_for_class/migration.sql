-- CreateTable
CREATE TABLE "ClassRegist" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "ClassRegist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAttend" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "is_passed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ClassAttend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClassRegist" ADD CONSTRAINT "ClassRegist_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassRegist" ADD CONSTRAINT "ClassRegist_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAttend" ADD CONSTRAINT "ClassAttend_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAttend" ADD CONSTRAINT "ClassAttend_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAttend" ADD CONSTRAINT "ClassAttend_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
