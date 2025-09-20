// application/major_intake.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateMajorIntakeDto } from '../dto/create_major_intake.dto';
import { UpdateMajorIntakeDto } from '../dto/update_major_intake.dto';
import { ListMajorIntakeDto } from '../dto/list_major_intake.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MajorIntakeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMajorIntakeDto, user: any) {
    const { major_id, intake_id, head_teacher_id, total_weight } = data;

    if (!major_id || !intake_id) {
      throw new Error('major_id and intake_id are required');
    }

    let major = await this.prisma.major.findUnique({ where: { id: major_id, deleted: false } });
    if (!major) {
      throw new Error('Major not found for id: ' + major_id);
    }

    let intake = await this.prisma.intake.findUnique({ where: { id: intake_id, deleted: false } });
    if (!intake) {
      throw new Error('Intake not found for id: ' + intake_id);
    }

    if (head_teacher_id) {
      let teacher = await this.prisma.user.findUnique({ where: { id: head_teacher_id, deleted: false } });
      if (!teacher) {
        throw new Error('User not found: ' + head_teacher_id);
      }
    }

    const uid = user?.uid || null;
    const majorIntake = await this.prisma.majorIntake.create({
      data: {
        major_id,
        intake_id,
        head_teacher_id: head_teacher_id || null,
        total_weight,
        created_by: uid,
        updated_by: uid,
      },
    });

    return majorIntake;
  }

  async findAll(query: ListMajorIntakeDto) {
    const { offset, limit, orderBy, order, major_id, intake_id } = query;

    const where: Prisma.MajorIntakeWhereInput = {
      deleted: false,
    };

    if (major_id) {
      where.major_id = major_id;
    }

    if (intake_id) {
      where.intake_id = intake_id;
    }

    const list = await this.prisma.majorIntake.findMany({
      where,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
      orderBy: {
        [orderBy]: order,
      },
    });

    const count = await this.prisma.majorIntake.count({ where });

    return { list, count };
  }

  async update(id: string, data: UpdateMajorIntakeDto, user: any) {
    if (!id) {
      throw new Error('ID is required for update');
    }

    const major_intake = await this.prisma.majorIntake.findUnique({ 
      where: { id : id, deleted: false },
      include: { major_intake_course: true }
    });

    if (!major_intake) {
      console.log('Major intake not found for id:', id);
      console.log('major_intake:', major_intake);
      throw new Error('Major intake not found');
    }

    // const courses = data.courses ? JSON.stringify(data.courses) : major_intake.courses;


    const uid = user?.uid || null;
    const dataToUpdate = { ...data, updated_by: uid };

    await this.prisma.majorIntake.update({ where: { id }, data: dataToUpdate });

    return { message: 'Major intake updated successfully' };
  }

  async softDelete(id: string, user: any) {
    if (!id) {
      throw new Error('ID is required for delete');
    }

    const major_intake = await this.prisma.majorIntake.findUnique({ where: { id : id, deleted: false } });
    if (!major_intake) {
      throw new Error('Major intake not found');
    }

    const uid = user?.uid || null;
    const dataToUpdate = { deleted: true, updated_by: uid };

    await this.prisma.majorIntake.update({ where: { id }, data: dataToUpdate });

    return { message: 'Major intake soft deleted successfully' };
  }

  async findOne(id: string) {
    return this.prisma.majorIntake.findUnique({
      where: { id, deleted: false },
      // include: {
      //   users: true,         // lấy luôn thông tin các user thuộc ngành này
      // }
    });
  }
}
