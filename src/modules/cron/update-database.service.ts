import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { USER_ROLES, STUDENT_COURSE_EXAM_STATUS, CLASS_REGIST } from 'src/constants/constant';

@Injectable()
export class UpdateDatabaseService {
  private readonly logger = new Logger(UpdateDatabaseService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running database update job...');

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
  }
}