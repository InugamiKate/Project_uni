// application/exam.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateExamDto } from '../dto/create_exam.dto';
import { UpdateExamDto } from '../dto/update_exam.dto';
import { ListExamDto } from '../dto/list_exam.dto';
import { ListExamRegistDto } from '../dto/list_exam_regist.dto';
import { ValidateRegistDto } from '../dto/validate_regist.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { ACCOUNT_ROLES, USER_ROLES, EXAM_ATTEND, EXAM_STATUS, REGIST_STATUS, EXAM_REGIST } from 'src/constants/constant';
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
    if (user.account_role !== ACCOUNT_ROLES.ADMIN && user.account_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new Error('You do not have permission to create an exam');
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

    const list = await this.prisma.exam.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
      include: {
        ExamRegist: true,
        ExamAttend: true
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
    }

    const count = await this.prisma.exam.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateExamDto, user: any) {
    if (!id) {
      throw new Error('ID is required for update');
    }

    const exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false } });
    if (!exam) {
      console.log('Exam not found for id:', id);
      throw new Error('Exam not found');
    }

    const plainName = TextUtil.skipVN(data.name || exam.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.exam.update({ where: { id }, data: dataToUpdate });

    return { message: 'Exam updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for delete');
    }

    const exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false } });
    if (!exam) {
      throw new Error('Exam not found');
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
      throw new Error('ID is required for regist');
    }

    const this_exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false, status: EXAM_STATUS.REGIST_AVAILABLE, regist_status: REGIST_STATUS.OPEN } });
    if (!this_exam) {
      throw new Error('Exam not found or not available for registration');
    }

    const this_regist_exam = await this.prisma.examRegist.findFirst({
      where: { exam_id: id, student_id: user.uid }
    });

    if (this_regist_exam) {
      throw new Error('You are already registered in this exam');
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
      throw new Error('ID is required for unregist');
    }

    const this_exam = await this.prisma.exam.findUnique({ where: { id : id, deleted: false } });
    if (!this_exam) {
      throw new Error('Exam not found');
    }

    if (this_exam.status !== EXAM_STATUS.REGIST_AVAILABLE && this_exam.regist_status !== REGIST_STATUS.OPEN) {
      throw new Error('Exam is not open for unregistration');
    }

    const this_regist_exam = await this.prisma.examRegist.findFirst({
      where: { exam_id: id, student_id: user.uid }
    })

    if (!this_regist_exam) {
      throw new Error('You are not registered in this exam');
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
      throw new Error('You do not have permission to view exam registrations');
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

  async validateRegist(id: string, data: ValidateRegistDto, user: any) {
    if (!id) {
      throw new Error('ID is required for validate regist');
    }

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new Error('You do not have permission to validate exam registrations');
    }

    const this_regist = await this.prisma.examRegist.findUnique({ where: { id : id } });
    if (!this_regist) {
      throw new Error('Exam registration not found');
    }

    const this_exam = await this.prisma.exam.findUnique({ where: { id : this_regist.exam_id, deleted: false } });
    if (!this_exam) {
      throw new Error('Exam not found');
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
  }

}
