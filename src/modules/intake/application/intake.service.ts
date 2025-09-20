// application/intake.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateIntakeDto } from '../dto/create_intake.dto';
import { UpdateIntakeDto } from '../dto/update_intake.dto';
import { ListIntakeDto } from '../dto/list_intake.dto';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { USER_ROLES } from '../../../constants/constant';
import { Prisma } from '@prisma/client';

@Injectable()
export class IntakeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateIntakeDto, user: any) {

    return this.prisma.intake.create({
      data: {
        name: data.name,
        plain_name: TextUtil.skipVN(data.name),
        year: data.year,
        deleted: false,
        created_by: user?.uid || null,
        updated_by: user?.uid || null,
      },
    });
  }

  async findAll(query: ListIntakeDto) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.IntakeWhereInput = {
      deleted: false,
    };

    if (name) {
      let plainName = TextUtil.skipVN(name);
      where.plain_name = { contains: plainName, mode: 'insensitive' };
    }

    const list = await this.prisma.intake.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
    });

    const count = await this.prisma.intake.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateIntakeDto, user: any) {
    if (!id) {
      throw new Error('ID is required for update');
    }

    const intake = await this.prisma.intake.findUnique({ where: { id : id, deleted: false } });
    if (!intake) {
      console.log('Intake not found for id:', id);
      console.log('intake:', intake);
      throw new Error('Intake not found');
    }

    const plainName = TextUtil.skipVN(data.name || intake.name);

    const uid = user?.uid || null;
    const dataToUpdate = { ...data, plain_name: plainName, updated_by: uid };

    await this.prisma.intake.update({ where: { id }, data: dataToUpdate });

    return { message: 'Intake updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for delete');
    }

    const intake = await this.prisma.intake.findUnique({ where: { id : id, deleted: false } });
    if (!intake) {
      throw new Error('Intake not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.intake.update({ where: { id }, data: dataToUpdate });

    return { message: 'Intake soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.intake.findUnique({
      where: { id, deleted: false },
      include: {
        users: true,         // lấy luôn thông tin các user thuộc intake này
      }
    });
  }
}
