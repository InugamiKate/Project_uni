// application/major.service.ts

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateMajorDto } from '../dto/create_major.dto';
import { UpdateMajorDto } from '../dto/update_major.dto';
import { ListMajorDto } from '../dto/list_major.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class MajorService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMajorDto, user: any) {
    return this.prisma.major.create({
      data: {
        name: data.name,
        plain_name: TextUtil.skipVN(data.name),
        description: data.description || '',
        deleted: false,
        created_by: user?.uid || null,
        updated_by: user?.uid || null,
      },
    });
  }

  async findAll(query: ListMajorDto) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.MajorWhereInput = {
      deleted: false,
    };

    if (name) {
      let plainName = TextUtil.skipVN(name);
      where.plain_name = { contains: plainName, mode: 'insensitive' };
    }

    const list = await this.prisma.major.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
    });

    const count = await this.prisma.major.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateMajorDto, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for update');
    }

    const major = await this.prisma.major.findUnique({ where: { id : id, deleted: false } });
    if (!major) {
      console.log('Major not found for id:', id);
      console.log('major:', major);
      throw new NotFoundException('Major not found');
    }

    const plainName = TextUtil.skipVN(data.name || major.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.major.update({ where: { id }, data: dataToUpdate });

    return { message: 'Major updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new BadRequestException('ID is required for delete');
    }

    const major = await this.prisma.major.findUnique({ where: { id : id, deleted: false } });
    if (!major) {
      throw new NotFoundException('Major not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.major.update({ where: { id }, data: dataToUpdate });

    return { message: 'Major soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.major.findUnique({
      where: { id, deleted: false },
      include: {
        users: true,         // lấy luôn thông tin các user thuộc ngành này
      }
    });
  }
}
