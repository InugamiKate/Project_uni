import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { USER_ROLES, STUDENT_COURSE_EXAM_STATUS, CLASS_REGIST } from 'src/constants/constant';

@Injectable()
export class UpdateDatabaseService {
  private readonly logger = new Logger(UpdateDatabaseService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run every day at midnight
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.log('Running database update student_course, class_attend, exam_attend...');

    // get list courses with and without major
    const courses = await this.prisma.course.findMany({
      where: { deleted: false },
    });

    // get list students
    const students = await this.prisma.user.findMany({
      where: { role: USER_ROLES.STUDENT, deleted: false },
    });

    //check each student with each course is exist in student_course table
    for (const student of students) {
      for (const course of courses) {
        const student_course = await this.prisma.studentCourse.findFirst({
          where: { student_id: student.id, course_id: course.id },
        });
        if (!student_course) {
          await this.prisma.studentCourse.create({
            data: { 
              student_id: student.id, 
              course_id: course.id,
              exam_status: STUDENT_COURSE_EXAM_STATUS.NOT_ATTEMPTED, 
            },
          });
          this.logger.log(
            `Added student_course for student ${student.id} and course ${course.id}`,
          );
        }
      }
    }

    // get list class_regist where user is approved
    const class_regist = await this.prisma.classRegist.findMany({
      where: { status: CLASS_REGIST.APPROVED }
    })

    for (const regist of class_regist) {
      const exist = await this.prisma.classAttend.findFirst({
        where: { class_id: regist.class_id, student_id: regist.student_id }
      });
      if (!exist) {
        await this.prisma.classAttend.create({
          data: {
            class_id: regist.class_id,
            student_id: regist.student_id,
          }
        });
        this.logger.log(
          `Created class_attend for regist ${regist.id}`
        );
      }
    }

    // Update exam_attend table
    const exam_regists = await this.prisma.examRegist.findMany({
      where: { status: CLASS_REGIST.APPROVED }
    });

    for (const exam_regist of exam_regists) {
      const exist = await this.prisma.examAttend.findFirst({
        where: { exam_id: exam_regist.exam_id, student_id: exam_regist.student_id }
      });
      if (!exist) {
        await this.prisma.examAttend.create({
          data: {
            exam_id: exam_regist.exam_id,
            student_id: exam_regist.student_id,
          }
        });
        this.logger.log(
          `Created exam_attend for regist ${exam_regist.id}`
        );
      }
    }
  }

  // Run every day at 1 AM
  @Cron(CronExpression.EVERY_10_MINUTES)
  async dailyTask() {
    this.logger.log('Running daily database update student_course status according to exam results...');
    
    // Get all student courses where exam_status is not passed
    const studentCourses = await this.prisma.studentCourse.findMany({
      where: {
        exam_status: { not: STUDENT_COURSE_EXAM_STATUS.PASSED },
      },
    });

    for (const sc of studentCourses) {
      // Get all the exams for the course and student
      const exams = await this.prisma.exam.findMany({
        where: {
          course_id: sc.course_id,
          deleted: false,
        },
        orderBy: { date: 'asc' },
      });

      // Get exam result for each exam that updated today
      let hasFailed = false;
      let examPassedId: string | null = null;
      let lastExamID: string | null = null;
      for (const exam of exams) {
        const ExamGrade = await this.prisma.examGrade.findFirst({
          where: {
            exam_id: exam.id,
            student_id: sc.student_id,
            updated_at: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // today
            },
          },
        });
        if (ExamGrade && ExamGrade.is_passed) {
          examPassedId = exam.id;
          break; // No need to check further if passed
        } else if (ExamGrade && !ExamGrade.is_passed) {
          hasFailed = true;
          lastExamID = exam.id;
        }
      }

      // Update student_course based on exam results
      if (examPassedId) {
        await this.prisma.studentCourse.update({
          where: { id: sc.id },
          data: { exam_status: STUDENT_COURSE_EXAM_STATUS.PASSED, last_exam_id: examPassedId },
        });
        this.logger.log(
          `StudentCourse ${sc.id} updated to PASSED based on exam ${examPassedId}`,
        );
      } else if (hasFailed) {
        await this.prisma.studentCourse.update({
          where: { id: sc.id },
          data: { exam_status: STUDENT_COURSE_EXAM_STATUS.FAILED, last_exam_id: lastExamID },
        });
        this.logger.log(
          `StudentCourse ${sc.id} updated to FAILED based on exam ${lastExamID}`,
        );
      }
    }
  }
}