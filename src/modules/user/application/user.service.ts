// application/user.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateUserDto } from '../dto/create_user.dto';
import { UpdateUserDto } from '../dto/update_user.dto';
import { ListUserDto } from '../dto/list_user.dto';
import {hashPassword} from '../../../infrastructure/common/crypto.util';
import { TextUtil } from 'src/infrastructure/common/text.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto, creator?: any) {
    const plain = data.code || '123456';
    const hashedPassword = await hashPassword(plain);

    return this.prisma.user.create({ 
      data: {
        name: data.name,
        plain_name: TextUtil.skipVN(data.name),
        code: data.code,
        birthday: data.birthday,
        phone: data.phone,
        email: data.email,
        role: data.role,
        major_id: data.major_id,
        mi_id: data.mi_id,
        is_graduated: data.is_graduated || false,
        is_student: data.is_student || true,
        sex: data.sex,
        deleted: false,
        active: true,
        created_by: creator?.uid || null,

        account: {
          create: {
            username: data.email,   

            password: hashedPassword,
            role: 'USER',
          },
        },
      },
    });
  }

  async findAll(query: ListUserDto) {
    const { offset, limit, name, orderBy, order } = query;

    const where: Prisma.UserWhereInput = {
      deleted: false,
    };

    if (name) {
      let name_plain = TextUtil.skipVN(name);
      where.plain_name = { contains: name_plain, mode: 'insensitive' };
    }

    const list = await this.prisma.user.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
    });

    const count = await this.prisma.user.count({ where });

    return { list, count };
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.prisma.user.update({ where: { id }, data: { deleted: true }  });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id , deleted: false },
      include: {
        major_intake: true, // nếu có quan hệ major_intake
        major: true,           // nếu có quan hệ major
      },
    });
  }
}
