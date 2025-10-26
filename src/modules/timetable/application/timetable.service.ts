// application/timetable.service.ts

import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateTimetableDto } from '../dto/create_timetable.dto';
import { ListTimetableDto } from '../dto/list_timetable.dto';
import { ACCOUNT_ROLES, USER_ROLES, DAY_OF_WEEK, PERIOD_OF_DAY, TIMETABLE_OBJECT_TYPE } from 'src/constants/constant';

@Injectable()
export class TimetableService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTimetableDto, user: any) {
    const { name, description, location, day, period, object_type, object_id, mi_id, start_time, end_time } = data;

    // Only admin and program_head can create timetable
    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to create a timetable entry');
    }

    // Only admin can choose major_id freely
    let major_id = data.major_id || null;
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      major_id = user.major_id || null;
    }

    if (!name || !object_type || !day || !period) {
      throw new BadRequestException('Missing required fields');
    }

    if (!Object.values(TIMETABLE_OBJECT_TYPE).includes(object_type as any) || !Object.values(DAY_OF_WEEK).includes(day as any) || !Object.values(PERIOD_OF_DAY).includes(period as any)) {
      throw new BadRequestException('Invalid timetable entry data');
    }

    const timetable = await this.prisma.timetable.create({
      data: {
        name: name,
        description: description || null,
        location: location || null,
        day: day,
        period: period,
        object_type: object_type,
        object_id: object_id || null,
        major_id: major_id,
        mi_id: mi_id || null,
        time_start: start_time || null,
        time_end: end_time || null,
        created_by: user.user_id,
      }
    })

    return {
      success: true,
      message: 'Timetable entry created successfully',
      data: timetable
    }
  }

  async findAll(data: ListTimetableDto, user: any) {

    // Only admin and program_head can create timetable
    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to create a timetable entry');
    }

    // Only admin can choose major_id freely
    let major_id = data.major_id || null;
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      major_id = user.major_id || null;
    }

    const where: any = {
      is_deleted: false,
    };

    if (major_id) where.major_id = major_id;

    if (data.mi_id) {
      // Check if mi_id is exists
      const mi = await this.prisma.majorIntake.findUnique({ where: { id: data.mi_id } });
      if (!mi) {
        throw new NotFoundException('Major intake not found');
      }
    }

    var orderBy: any = [{ created_at: 'asc' }, { day: 'asc' }, { period: 'asc' }];


    const timetables = await this.prisma.timetable.findMany({
      where,
      orderBy,
      skip: Number(data.offset) || 0,
      take: Number(data.limit) || 50,
    });

    for (let item of timetables) {
      if (item.object_type !== TIMETABLE_OBJECT_TYPE.OTHER && item.object_id) {
        if (item.object_type === TIMETABLE_OBJECT_TYPE.CLASS) {
          item['object'] = await this.prisma.class.findUnique({ where: { id: item.object_id } });
        } else if (item.object_type === TIMETABLE_OBJECT_TYPE.EXAM) {
          item['object'] = await this.prisma.exam.findUnique({ where: { id: item.object_id } });
        } else {
          item['object'] = null;
        }
      }
    }

    return timetables;
  }

  async findByUser(data: ListTimetableDto, user: any) {
    const { major_id, mi_id, offset, limit } = data;

    const where : any = {
      is_deleted: false,
    };

    // Only admin can choose major_id freely
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      where.major_id = user.major_id || null;
    } else if (major_id) {
      where.major_id = major_id;
    }

    if (!mi_id) {
      throw new BadRequestException('mi_id is required');
    }
    // Check if mi_id is exists
    const mi = await this.prisma.majorIntake.findUnique({ where: { id: mi_id } });
    if (!mi) {
      throw new NotFoundException('Major intake not found');
    }
    where.mi_id = mi_id;

    var orderBy: any = [{ created_at: 'asc' }, { day: 'asc' }, { period: 'asc' }];

    const timetables = await this.prisma.timetable.findMany({
      where,
      orderBy,
      skip: Number(offset) || 0,
      take: Number(limit) || 10,
    });

    for (let item of timetables) {
      if (item.object_type !== TIMETABLE_OBJECT_TYPE.OTHER && item.object_id) {
        if (item.object_type === TIMETABLE_OBJECT_TYPE.CLASS) {
          item['object'] = await this.prisma.class.findUnique({ where: { id: item.object_id } });
        } else if (item.object_type === TIMETABLE_OBJECT_TYPE.EXAM) {
          item['object'] = await this.prisma.exam.findUnique({ where: { id: item.object_id } });
        } else {
          item['object'] = null;
        }
      }
    }

    return {
      success: true,
      message: 'Timetables retrieved successfully',
      data: timetables
    }
  }

  async findOne(id: string) {
    const timetable = await this.prisma.timetable.findFirst({
      where: {
        id: id,
        is_deleted: false,
      }
    });
    if (!timetable) {
      throw new NotFoundException('Timetable entry not found');
    }
    return {
      success: true,
      message: 'Timetable entry retrieved successfully',
      data: timetable
    }
  }

  async deleteOne(id: string, user: any) {
    // Only admin and program_head can delete timetable
    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to delete a timetable entry');
    }

    const timetable = await this.prisma.timetable.findFirst({
      where: {
        id: id,
        is_deleted: false,
      }
    });
    if (!timetable) {
      throw new NotFoundException('Timetable entry not found');
    }

    await this.prisma.timetable.update({
      where: { id: id },
      data: { is_deleted: true }
    });

    return {
      success: true,
      message: 'Timetable entry deleted successfully',
    }
  }

  async update(id: string, dto: CreateTimetableDto, user: any) {

    // Only admin and program_head can update timetable
    if (user.user_role !== USER_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to update a timetable entry');
    }

    const timetable = await this.prisma.timetable.findFirst({
      where: {
        id: id,
        is_deleted: false,
      }
    });

    if (!timetable) {
      throw new NotFoundException('Timetable entry not found');
    }

    const { name, description, location, day, period, object_type, object_id, major_id, mi_id, start_time, end_time } = dto;

    if (!name || !object_type || !day || !period) {
      throw new BadRequestException('Missing required fields');
    }

    if (!Object.values(TIMETABLE_OBJECT_TYPE).includes(object_type as any) || !Object.values(DAY_OF_WEEK).includes(day as any) || !Object.values(PERIOD_OF_DAY).includes(period as any)) {
      throw new BadRequestException('Invalid timetable entry data');
    }

    await this.prisma.timetable.update({
      where: { id: id },
      data: {
        name: name,
        description: description || null,
        location: location || null,
        day: day,
        period: period,
        object_type: object_type,
        object_id: object_id || null,
        major_id: major_id || null,
        mi_id: mi_id || null,
        time_start: start_time || null,
        time_end: end_time || null,
      }
    });

    return {
      success: true,
      message: 'Timetable entry updated successfully',
    }
  }

}