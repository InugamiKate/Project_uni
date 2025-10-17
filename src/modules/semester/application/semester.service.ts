// application/semester.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateSemesterDto } from '../dto/create_semester.dto';
import { UpdateSemesterDto } from '../dto/update_semester.dto';
import { ListSemesterDto } from '../dto/list_semester.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class SemesterService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSemesterDto, user: any) {
    return this.prisma.semester.create({
      data: {
        name: data.name,
        plain_name: TextUtil.skipVN(data.name),
        start_date: data.start_date,
        end_date: data.end_date,
        deleted: false,
        created_by: user?.uid || null,
        updated_by: user?.uid || null,
      },
    });
  }

  async findAll(query: ListSemesterDto) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.SemesterWhereInput = {
      deleted: false,
    };

    if (name) {
      let plainName = TextUtil.skipVN(name);
      where.plain_name = { contains: plainName, mode: 'insensitive' };
    }

    const list = await this.prisma.semester.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
    });

    const count = await this.prisma.semester.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateSemesterDto, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for update');
    }

    const semester = await this.prisma.semester.findUnique({ where: { id : id, deleted: false } });
    if (!semester) {
      console.log('Semester not found for id:', id);
      throw new NotFoundException('Semester not found');
    }

    const plainName = TextUtil.skipVN(data.name || semester.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.semester.update({ where: { id }, data: dataToUpdate });

    return { message: 'Semester updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for delete');
    }

    const semester = await this.prisma.semester.findUnique({ where: { id : id, deleted: false } });
    if (!semester) {
      throw new NotFoundException('Semester not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.semester.update({ where: { id }, data: dataToUpdate });

    return { message: 'Semester soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.semester.findUnique({
      where: { id, deleted: false },
    });
  }
}
