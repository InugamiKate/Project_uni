// application/exam.service.ts

import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateExamDto } from '../dto/create_exam.dto';
import { UpdateExamDto } from '../dto/update_exam.dto';
import { ListExamDto } from '../dto/list_exam.dto';
import { ListExamRegistDto } from '../dto/list_exam_regist.dto';
import { ListExamAttendDto } from '../dto/list_exam_attend.dto';
import { ValidateRegistDto } from '../dto/validate_regist.dto';
import { CreateExamGradeDto } from '../dto/create_exam_grade.dto';
import { ListExamGradeDto } from '../dto/list_exam_grade.dto';
import { ListExamGradeStudentIdDto } from '../dto/list_exam_grade_student_id.dto';
import { UpdateExamGradeDto } from '../dto/update_exam_grade.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { ACCOUNT_ROLES, USER_ROLES, STUDENT_COURSE_EXAM_STATUS, EXAM_STATUS, REGIST_STATUS, EXAM_REGIST } from 'src/constants/constant';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExamDto, user: any) {
    let major_id = data.major_id || null;
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      major_id = user.major_id || null;
    }

    // Only admin and program_head can create exams
    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      console.log("user.user_role:", user.user_role);
      throw new ForbiddenException('You do not have permission to create an exam');
    }

    return this.prisma.exam.create({
      data: {
        name: data.name,
        plain_name: TextUtil.skipVN(data.name),
        status: data.status || EXAM_STATUS.NEW,
        regist_status: data.regist_status || REGIST_STATUS.CLOSED,
        major_id: data.major_id,
        semester_id: data.semester_id,
        course_id: data.course_id,
        class_id: data.class_id || null,
        place: data.place || null,
        date: data.date || null,
        deleted: false,
        created_by: user?.uid || null,
        updated_by: user?.uid || null,
      },
    });
  }

  async findAll(query: ListExamDto, user: any) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.ExamWhereInput = {
      deleted: false,
    };

    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      where.major_id = user.major_id || null;
    }

    if (name) {
      let plainName = TextUtil.skipVN(name);
      where.plain_name = { contains: plainName, mode: 'insensitive' };
    }

    if (query.semester_id) {
      where.semester_id = query.semester_id;
    }

    if (query.course_id) {
      where.course_id = query.course_id;
    }

    if (query.class_id) {
      where.class_id = query.class_id;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.regist_status) {
      where.regist_status = query.regist_status;
    }

    if (user.user_role === USER_ROLES.STUDENT) {
      where.course = {
        StudentCourse: {
          some: {
            student_id: user.uid,
            exam_status: { not: STUDENT_COURSE_EXAM_STATUS.PASSED },
          },
        },
      };
    }

    const list = await this.prisma.exam.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
      include: {
        ExamRegist: true,
        ExamAttend: true,
        course: true,
      },
    });

    var already_query = {};

    for (let item of list) {
      if (item.major_id) {
        if (!already_query[item.major_id]) {
          already_query[item.major_id] = await this.prisma.major.findUnique({ where: { id: item.major_id } });
        }
        item['major'] = already_query[item.major_id];
      }
      if (item.semester_id) {
        if (!already_query[item.semester_id]) {
          already_query[item.semester_id] = await this.prisma.semester.findUnique({ where: { id: item.semester_id } });
        }
        item['semester'] = already_query[item.semester_id];
      }
      if (item.course_id) {
        if (!already_query[item.course_id]) {
          already_query[item.course_id] = await this.prisma.course.findUnique({ where: { id: item.course_id } });
        }
        item['course'] = already_query[item.course_id];
      }
      if (item.class_id) {
        if (!already_query[item.class_id]) {
          already_query[item.class_id] = await this.prisma.class.findUnique({ where: { id: item.class_id } });
        }
        item['class'] = already_query[item.class_id];
      }
      if (user.user_role === USER_ROLES.STUDENT) {
        if (item.ExamRegist && item.ExamRegist.length > 0) {
          const regist = item.ExamRegist.find(r => r.student_id === user.uid);
          if (regist) {
            item['my_regist'] = regist;
          }
          else {
            item['my_regist'] = null;
          }
        }
        if (item.ExamAttend && item.ExamAttend.length > 0) {
          const attend = item.ExamAttend.find(a => a.student_id === user.uid);
          if (attend) {
            item['my_attend'] = attend;
          }
          else {
            item['my_attend'] = null;
          }
        }
      }
    }

    const count = await this.prisma.exam.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateExamDto, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for update');
    }

    const exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false } });
    if (!exam) {
      console.log('Exam not found for id:', id);
      throw new NotFoundException('Exam not found');
    }

    const plainName = TextUtil.skipVN(data.name || exam.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.exam.update({ where: { id }, data: dataToUpdate });

    return { message: 'Exam updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for delete');
    }

    const exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false } });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.exam.update({ where: { id }, data: dataToUpdate });

    return { message: 'Exam soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.exam.findUnique({
      where: { id, deleted: false },
      include: {
        course: true,
        semester: true,
        major: true,
        class: true,
      }
    });
  }

  async registExam(id: string, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for regist');
    }

    const this_exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false, status: EXAM_STATUS.REGIST_AVAILABLE, regist_status: REGIST_STATUS.OPEN } });
    if (!this_exam) {
      throw new NotFoundException('Exam not found or not available for registration');
    }

    const this_regist_exam = await this.prisma.examRegist.findFirst({
      where: { exam_id: id, student_id: user.uid }
    });

    if (this_regist_exam) {
      throw new ForbiddenException('You are already registered in this exam');
    }

    await this.prisma.examRegist.create({
      data: {
        exam_id: id,
        student_id: user.uid,
        status: EXAM_REGIST.PENDING,
      }
    });

    return { message: 'Registered to exam successfully' };
  }

  async unregistExam(id: string, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for unregist');
    }

    const this_exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false } });
    if (!this_exam) {
      throw new NotFoundException('Exam not found');
    }

    if (this_exam.status !== EXAM_STATUS.REGIST_AVAILABLE && this_exam.regist_status !== REGIST_STATUS.OPEN) {
      throw new ForbiddenException('Exam is not open for unregistration');
    }

    const this_regist_exam = await this.prisma.examRegist.findFirst({
      where: { exam_id: id, student_id: user.uid }
    })

    if (!this_regist_exam) {
      throw new NotFoundException('You are not registered in this exam');
    }

    await this.prisma.examRegist.delete({
      where: { id: this_regist_exam.id }
    });

    return { message: 'Unregist exam successfully' }
  }

  async listExamRegist(query: ListExamRegistDto, user: any) {
    const { offset, limit, orderBy, order, exam_id, student_id } = query;

    const where: Prisma.ExamRegistWhereInput = {};

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to view exam registrations');
    }

    if (exam_id) {
      where.exam_id = exam_id;
    }

    if (student_id) {
      where.student_id = student_id;
    }

    const list = await this.prisma.examRegist.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy || 'created_at']: order || 'desc',
      },
    });

    const count = await this.prisma.examRegist.count({ where });

    return { list, count };
  }

    async listExamAttend(query: ListExamAttendDto, user: any) {
    const { offset, limit, exam_id, student_id } = query;

    const where: Prisma.ExamAttendWhereInput = {};

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to view exam attendances');
    }

    if (exam_id) {
      where.exam_id = exam_id;
    }

    if (student_id) {
      where.student_id = student_id;
    }

    const list = await this.prisma.examAttend.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
    });

    const count = await this.prisma.examAttend.count({ where });

    return { list, count };
  }

  async validateRegist(id: string, data: ValidateRegistDto, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for validate regist');
    }

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to validate exam registrations');
    }

    const this_regist = await this.prisma.examRegist.findUnique({ where: { id : id, status: EXAM_REGIST.PENDING } });
    if (!this_regist) {
      throw new NotFoundException('Exam registration not found');
    }

    const this_exam = await this.prisma.exam.findUnique({ where: { id : this_regist.exam_id, deleted: false } });
    if (!this_exam) {
      throw new NotFoundException('Exam not found');
    }

    const status = data.valid ? EXAM_REGIST.APPROVED : EXAM_REGIST.REJECTED;

    await this.prisma.examRegist.update({
      where: { id },
      data: { status }
    });

    if (status === EXAM_REGIST.APPROVED) {
      await this.prisma.examAttend.create({
        data: {
          exam_id: this_regist.exam_id,
          student_id: this_regist.student_id
        }
      })
    }
    return { message: 'Exam registration validated successfully' };
  }

  async addExamGrades(examId: string, dto: CreateExamGradeDto) {

    if (!dto.grades || dto.grades.length === 0) {
      throw new BadRequestException('No grades provided');
    }

    const exam = await this.prisma.exam.findUnique({ where: { id: examId } });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const course_id = exam.course_id;

    const data = dto.grades.map((item) => ({
      exam_id: examId,
      student_id: item.user_id,
      grade: item.grade,
      is_passed: item.is_passed,
    }));

    await this.prisma.examGrade.createMany({
      data,
    });

    for (let item of dto.grades) {
      await this.prisma.studentCourse.updateMany({
        where:
        {
          student_id : item.user_id,
          course_id  : course_id
        },
        data:
        {
          exam_status: item.is_passed ? STUDENT_COURSE_EXAM_STATUS.PASSED : STUDENT_COURSE_EXAM_STATUS.FAILED,
          last_exam_id: examId
        }
      })
    }

    return { success: true, count: data.length };
  }

  async listExamGrades(examId: string, query: ListExamGradeDto, user: any) {
    const { offset, limit, orderBy, order } = query;
    
    const where: Prisma.ExamGradeWhereInput = {
      exam_id: examId
    };

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to view exam grades');
    }

    const list = await this.prisma.examGrade.findMany({
      where: where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy || 'grade']: order || 'desc',
      },
    });

    for (let item of list) {
      if (item.student_id) {
        let student = await this.prisma.user.findUnique({ where: { id: item.student_id } });
        item['student_name'] = student?.name || null;
      }
    }

    const count = await this.prisma.examGrade.count({ where });

    return { list, count };
  }

  async listExamGradesStudent(query: ListExamGradeStudentIdDto, user: any) {
    const { offset, limit, orderBy, order } = query;

    var user_id = user.uid;

    if (user.user_role === USER_ROLES.ADMIN || user.user_role === USER_ROLES.PROGRAM_HEAD) {
      user_id = query.student_id;
      if (!user_id) {
        throw new BadRequestException('student_id is required for non-student users');
      }
    }

    const where: Prisma.CourseWhereInput = {
      deleted: false,
      StudentCourse: {
        some: {
          student_id: user_id,
        }
      }
    };

    const list = await this.prisma.course.findMany({
      where: where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy || 'created_at']: order || 'desc',
      },
      include: {
        exam: {
          include: {
            ExamGrade: true,
          }
        }
      },
    });

    // Filter out the exam grades for the current student
    const filteredList = list.map(course => ({
      ...course,
      exam: course.exam.map(exam => ({
        ...exam,
        ExamGrade: exam.ExamGrade.filter(
          grade => grade.student_id === user_id
        ),
      })),
    }));

    const count = await this.prisma.course.count({ where });

    return { filteredList, count };
  }

  async updateExamGrade(id: string, dto: UpdateExamGradeDto, user: any) {
    const { grade, is_passed } = dto;
    if (!id) {
      throw new BadRequestException('ID is required for update exam grade');
    }
    const examGrade = await this.prisma.examGrade.findUnique({ where: { id : id } });
    if (!examGrade) {
      throw new NotFoundException('Exam grade not found');
    }
    const uid = user?.uid || null;
    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to update exam grades');
    }
    if (!uid) {
      throw new BadRequestException('User ID not found');
    } else {
      const userInfo = await this.prisma.user.findUnique({ where: { id: uid } });
      if (!userInfo) {
        throw new NotFoundException('User not found');
      }
    }

    await this.prisma.examGrade.update({
      where: { id },
      data: {
        grade: Number(grade),
        is_passed: Boolean(is_passed),
      },
    });

    return { message: 'Exam grade updated successfully' };
  }

}
