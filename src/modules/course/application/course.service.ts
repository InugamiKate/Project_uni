// application/course.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateCourseDto } from '../dto/create_course.dto';
import { UpdateCourseDto } from '../dto/update_course.dto';
import { ListCourseDto } from '../dto/list_course.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { ACCOUNT_ROLES } from 'src/constants/constant';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCourseDto, user: any) {
    let major_id = data.major_id || null;
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      major_id = user.major_id || null;
    }

    return this.prisma.course.create({
      data: {
        name: data.name,
        major_id: major_id,
        plain_name: TextUtil.skipVN(data.name),
        description: data.description || '',
        weight: data.weight || 10,
        parent_id: data.parent_id || null,
        deleted: false,
        created_by: user?.uid || null,
        updated_by: user?.uid || null,
      },
    });
  }

  async findAll(query: ListCourseDto, user: any) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.CourseWhereInput = {
      deleted: false,
    };

    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      where.major_id = user.major_id || null;
    }

    if (name) {
      let plainName = TextUtil.skipVN(name);
      where.plain_name = { contains: plainName, mode: 'insensitive' };
    }

    const list = await this.prisma.course.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
    });

    const count = await this.prisma.course.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateCourseDto, user: any) {
    if (!id) {
      throw new Error('ID is required for update');
    }

    const course = await this.prisma.course.findUnique({ where: { id : id, deleted: false } });
    if (!course) {
      console.log('Course not found for id:', id);
      throw new Error('Course not found');
    }

    if (data.parent_id) {
      const parentCourse = await this.prisma.course.findUnique({ where: { id: data.parent_id, deleted: false } });
      if (!parentCourse) {
        console.log('Parent course not found for id:', data.parent_id);
        throw new Error('Parent course not found');
      }
    }

    const plainName = TextUtil.skipVN(data.name || course.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.course.update({ where: { id }, data: dataToUpdate });

    return { message: 'Course updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for delete');
    }

    const course = await this.prisma.course.findUnique({ where: { id : id, deleted: false } });
    if (!course) {
      throw new Error('Course not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.course.update({ where: { id }, data: dataToUpdate });

    return { message: 'Course soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id, deleted: false },
      include: {
        major_intake_courses: true,
        parent: true,
        children: true,
      }
    });
  }
}
