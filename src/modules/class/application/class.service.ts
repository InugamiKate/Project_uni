// application/class.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateClassDto } from '../dto/create_class.dto';
import { UpdateClassDto } from '../dto/update_class.dto';
import { ListClassDto } from '../dto/list_class.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { ACCOUNT_ROLES, USER_ROLES } from 'src/constants/constant';
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

    const list = await this.prisma.class.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
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
      }
    });
  }
}
