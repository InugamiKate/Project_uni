// application/class.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateClassDto } from '../dto/create_class.dto';
import { UpdateClassDto } from '../dto/update_class.dto';
import { ListClassDto } from '../dto/list_class.dto';
import { ListClassRegistDto } from '../dto/list_class_regist.dto';
import { ValidateRegistDto } from '../dto/validate_regist.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { ACCOUNT_ROLES, USER_ROLES, CLASS_STATUS, CLASS_REGIST, REGIST_STATUS } from 'src/constants/constant';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClassDto, user: any) {
    let major_id = data.major_id || null;
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      major_id = user.major_id || null;
    }

    // Only admin and program_head can create class
    if (user.account_role !== ACCOUNT_ROLES.ADMIN && user.account_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new Error('You do not have permission to create a class');
    }

    return this.prisma.class.create({
      data: {
        name: data.name,
        plain_name: TextUtil.skipVN(data.name),
        status: data.status || CLASS_STATUS.NEW,
        regist_status: data.regist_status || REGIST_STATUS.CLOSED,
        max_student: data.max_student || 0,
        major_id: major_id,
        semester_id: data.semester_id,
        course_id: data.course_id,
        lecturer_id: data.lecturer_id,
        description: data.description || '',
        location: data.location || '',
        deleted: false,
        created_by: user?.uid || null,
        updated_by: user?.uid || null,
      },
    });
  }

  async findAll(query: ListClassDto, user: any) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.ClassWhereInput = {
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

    if (query.status) {
      where.status = query.status;
    }

    if (query.regist_status) {
      where.regist_status = query.regist_status;
    }

    const list = await this.prisma.class.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
      include: {
        ClassRegist: true,
        ClassAttend: true
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
      if (item.lecturer_id) {
        if (!already_query[item.lecturer_id]) {
          already_query[item.lecturer_id] = await this.prisma.user.findUnique({ where: { id: item.lecturer_id } });
        }
        item['lecturer'] = already_query[item.lecturer_id];
      }
    }

    const count = await this.prisma.class.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateClassDto, user: any) {
    if (!id) {
      throw new Error('ID is required for update');
    }

    const class_ = await this.prisma.class.findUnique({ where: { id : id, deleted: false } });
    if (!class_) {
      console.log('Class not found for id:', id);
      throw new Error('Class not found');
    }

    const plainName = TextUtil.skipVN(data.name || class_.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.class.update({ where: { id }, data: dataToUpdate });

    return { message: 'Class updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for delete');
    }

    const class_ = await this.prisma.class.findUnique({ where: { id : id, deleted: false } });
    if (!class_) {
      throw new Error('Class not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.class.update({ where: { id }, data: dataToUpdate });

    return { message: 'Class soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.class.findUnique({
      where: { id, deleted: false },
      include: {
        course: true,
        semester: true,
        lecturer: true,
        major: true,
        ClassAttend: {
          include: {
            student: true
          }
        },
      }
    });
  }

  async registClass(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for regist');
    }

    const this_class = await this.prisma.class.findUnique({ where: { id : id, deleted: false, status: CLASS_STATUS.REGIST_AVAILABLE, regist_status: REGIST_STATUS.OPEN } });
    if (!this_class) {
      throw new Error('Class not found or not available for registration');
    }

    const this_regist_class = await this.prisma.classRegist.findFirst({
      where: { class_id: id, student_id: user.uid }
    })
    if (this_regist_class) {
      throw new Error('You are already registered in this class');
    }

    await this.prisma.classRegist.create({
      data: {
        class_id: id,
        student_id: user.uid,
        status: CLASS_REGIST.PENDING,
      }
    })

    const num_in_class = await this.prisma.classRegist.count({
      where: {class_id: id}
    })

    if (this_class.max_student && num_in_class >= this_class.max_student && this_class.max_student > 0) {
      await this.prisma.class.update({
        where: { id : id },
        data: { regist_status: REGIST_STATUS.MAX_NUM }
      })
    }

    return { message: 'Registered to class successfully' };
  }

  async unregistClass(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for unregist');
    }

    const this_class = await this.prisma.class.findUnique({ where: { id : id, deleted: false } });
    if (!this_class) {
      throw new Error('Class not found');
    }

    const this_regist_class = await this.prisma.classRegist.findFirst({
      where: { class_id: id, student_id: user.uid }
    })

    if (!this_regist_class) {
      throw new Error('You are not registered in this class');
    }

    await this.prisma.classRegist.delete({
      where: { id: this_regist_class.id }
    });

    if (this_class.regist_status === REGIST_STATUS.MAX_NUM) {
      await this.prisma.class.update({
        where: { id: id },
        data: { regist_status: REGIST_STATUS.OPEN }
      })
    }

    return { message: 'Unregist class successfully' }
  }

  async listClassRegist(query: ListClassRegistDto, user: any) {
    const { offset, limit, orderBy, order, class_id, student_id } = query;

    const where: Prisma.ClassRegistWhereInput = {};

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new Error('You do not have permission to view class registrations');
    }

    if (class_id) {
      where.class_id = class_id;
    }

    if (student_id) {
      where.student_id = student_id;
    }

    const list = await this.prisma.classRegist.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy || 'created_at']: order || 'desc',
      },
    });

    const count = await this.prisma.classRegist.count({ where });

    return { list, count };
  }

  async validateRegist(id: string, data: ValidateRegistDto, user: any) {
    if (!id) {
      throw new Error('ID is required for validate regist');
    }

    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new Error('You do not have permission to validate class registrations');
    }

    const this_regist = await this.prisma.classRegist.findUnique({ where: { id : id } });
    if (!this_regist) {
      throw new Error('Class registration not found');
    }

    const this_class = await this.prisma.class.findUnique({ where: { id : this_regist.class_id, deleted: false } });
    if (!this_class) {
      throw new Error('Class not found');
    }

    const status = data.valid ? CLASS_REGIST.APPROVED : CLASS_REGIST.REJECTED;

    await this.prisma.classRegist.update({
      where: { id },
      data: { status }
    });

    if (status === CLASS_REGIST.APPROVED) {
      await this.prisma.classAttend.create({
        data: {
          class_id: this_regist.class_id,
          student_id: this_regist.student_id
        }
      })
    }
  }

}
