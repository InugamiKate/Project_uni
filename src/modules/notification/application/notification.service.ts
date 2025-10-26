// application/notification.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create_notification.dto';
import { ListNotificationDto } from '../dto/list_notification.dto';
import { ACCOUNT_ROLES, USER_ROLES, NOTIFICATION_OBJECT_TYPE } from 'src/constants/constant';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateNotificationDto, user: any) {
    const title = data.title;
    const content = data.content;
    const object_type = data.object_type;
    const object_id = data.object_id;
    const user_ids = data.user_ids;
    const uid = user?.uid || null;

    let major_id = data.major_id || null;
    if (user.account_role !== ACCOUNT_ROLES.ADMIN) {
      major_id = user.major_id || null;
    }

    // Only admin and program_head can create notification
    if (user.user_role !== ACCOUNT_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to create an notification');
    }

    if (!title || !content || !object_type) {
      throw new BadRequestException('Title, content, and object_type are required');
    }

    if (object_type && !NOTIFICATION_OBJECT_TYPE[object_type]) {
      throw new BadRequestException(`Invalid object_type: ${object_type}`);
    }

    // Get the list of users to notify
    let receivers: string[] = [];
    
    switch (object_type) {
      case 'ALL':
        if (user.account_role === USER_ROLES.ADMIN) {
          const users = await this.prisma.user.findMany({
            where: { active: true, deleted: false },
            select: { id: true },
          });
          receivers = users.map(u => u.id);
        } else if (user.account_role === USER_ROLES.PROGRAM_HEAD) {
          const users = await this.prisma.user.findMany({
            where: {
              active: true,
              deleted: false,
              major_id: major_id,
            },
            select: { id: true },
          });
          receivers = users.map(u => u.id);
        }
        break;

      case 'INTAKE':
        if (!object_id) throw new NotFoundException('Missing object_id for INTAKE');
        const intakeUsers = await this.prisma.user.findMany({
          where: {
            active: true,
            deleted: false,
            mi_id: object_id,
          },
          select: { id: true },
        });
        receivers = intakeUsers.map(u => u.id);
        break;

      case 'COURSE':
        if (!object_id) throw new NotFoundException('Missing object_id for COURSE');
        const courseUsers = await this.prisma.studentCourse.findMany({
          where: { course_id: object_id },
          select: { student_id: true },
        });
        receivers = courseUsers.map(u => u.student_id);
        break;

      case 'CLASS':
        if (!object_id) throw new NotFoundException('Missing object_id for CLASS');
        const classUsers = await this.prisma.classAttend.findMany({
          where: { class_id: object_id },
          select: { student_id: true },
        });
        receivers = classUsers.map(u => u.student_id);
        break;

      case 'EXAM':
        if (!object_id) throw new NotFoundException('Missing object_id for EXAM');
        const examUsers = await this.prisma.examAttend.findMany({
          where: { exam_id: object_id },
          select: { student_id: true },
        });
        receivers = examUsers.map(u => u.student_id);
        break;

      case 'OTHER':
        if (!user_ids || user_ids.length === 0) {
          throw new BadRequestException('user_ids is required when object_type = OTHER');
        }
        receivers = user_ids;
        break;

      default:
        throw new BadRequestException(`Invalid object_type: ${object_type}`);
    }
    
    // Remove duplicate user IDs
    receivers = [...new Set(receivers)];

    // If no receivers found, return error
    if (receivers.length === 0) {
      throw new BadRequestException('No users found to receive the notification');
    }

    // Transaction to create notification and notification_user entries
    const result = await this.prisma.$transaction(async (tx) => {
      
      // Create notification
      const notification = await tx.notification.create({
        data: {
          title: title,
          content: content,
          object_type: object_type,
          object_id: object_id ?? null,
          created_by: uid,
        },
      });

      await tx.notificationUser.createMany({
        data: receivers.map((uid) => ({
          user_id: uid,
          notification_id: notification.id,
          is_read: false,
          is_deleted: false,
        })),
      });

      return notification;
    });

    return {
      success: true,
      message: 'Notification created successfully',
      data: {
        id: result.id,
        receiver_count: receivers.length,
      },
    };
  }

  async findAll(query: ListNotificationDto, user: any) {
    const { offset, limit, orderBy, order } = query;
    const uid = user?.uid || null;

    // Only admin and program_head can create notification
    if (user.account_role !== ACCOUNT_ROLES.ADMIN && user.user_role !== USER_ROLES.PROGRAM_HEAD) {
      throw new ForbiddenException('You do not have permission to get list notification');
    }

    const whereClause: any = {};
    if (user.account_role === USER_ROLES.PROGRAM_HEAD) {
      whereClause.created_by = uid;
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: whereClause,
        skip: Number(offset),
        take: Number(limit),
        orderBy: {
          [orderBy]: order,
        },
        select: {
          id: true,
          title: true,
          content: true,
          object_type: true,
          object_id: true,
          created_by: true,
          created_at: true,
          updated_at: true,
        },
      }),
      this.prisma.notification.count({ where: whereClause }),
    ]);

    return {
      success: true,
      data: list,
      meta: {
        total,
        offset,
        limit,
      },
    };
  }

  async findByUser(dto: ListNotificationDto, user_login: any) {
    const { offset, limit } = dto;
    const uid = user_login.uid;

    if (!uid) {
      throw new NotFoundException('Missing user ID');
    }

    const [list, total] = await this.prisma.$transaction([
      this.prisma.notificationUser.findMany({
        where: {
          user_id: uid,
          is_deleted: false,
        },
        skip: Number(offset),
        take: Number(limit),
        orderBy: {
          notification: {
            created_at: 'desc',
          },
        },
        select: {
          id: true,
          is_read: true,
          is_deleted: true,
          created_at: true,
          notification: {
            select: {
              id: true,
              title: true,
              content: true,
              object_type: true,
              object_id: true,
              created_by: true,
              created_at: true,
            },
          },
        },
      }),
      this.prisma.notificationUser.count({
        where: {
          user_id: uid,
          is_deleted: false,
        },
      }),
    ]);

    const data = list.map((n) => ({
      id: n.notification.id,
      title: n.notification.title,
      content: n.notification.content,
      object_type: n.notification.object_type,
      object_id: n.notification.object_id,
      created_at: n.notification.created_at,
      is_read: n.is_read,
    }));

    return {
      success: true,
      data,
      meta: {
        total,
        offset,
        limit,
      },
    };
  }

  async findOne(id: string, user_login: any) {
    if (!id) {
      throw new NotFoundException('Missing notification ID');
    }

    const uid = user_login.uid;
    if (!uid) {
      throw new NotFoundException('Missing user ID');
    }

    const notification = await this.prisma.notification.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        object_type: true,
        object_id: true,
        created_by: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const notiUser = await this.prisma.notificationUser.findFirst({
      where: {
        notification_id: id,
        user_id: uid,
        is_deleted: false,
      },
    });

    if (notiUser && !notiUser.is_read) {
      await this.prisma.notificationUser.update({
        where: { id: notiUser.id },
        data: { is_read: true },
      });
    }

    return {
      success: true,
      data: {
        ...notification,
        is_read: true,
      },
    };
  }

  async markAllRead(user_login: any) {
    const uid = user_login.uid;
    if (!uid) {
      throw new NotFoundException('Missing user ID');
    }

    const result = await this.prisma.notificationUser.updateMany({
      where: {
        user_id: uid,
        is_read: false,
        is_deleted: false,
      },
      data: {
        is_read: true,
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'All notifications marked as read',
      data: {
        updated_count: result.count,
      },
    };
  }

  async deleteAll(user_login: any) {
    const uid = user_login.uid;
    if (!uid) {
      throw new NotFoundException('Missing user ID');
    }

    const result = await this.prisma.notificationUser.updateMany({
      where: {
        user_id: uid,
        is_deleted: false,
      },
      data: {
        is_deleted: true,
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'All notifications marked as deleted',
      data: {
        deleted_count: result.count,
      },
    };
  }

  async deleteOne(id: string, user_login: any) {
    const uid = user_login.uid;
    if (!id) {
      throw new NotFoundException('Missing notification ID');
    }
    if (!uid) {
      throw new NotFoundException('Missing user ID');
    }

    const notiUser = await this.prisma.notificationUser.findFirst({
      where: {
        notification_id: id,
        user_id: uid,
        is_deleted: false,
      },
    });

    if (!notiUser) {
      throw new NotFoundException('Notification not found or already deleted');
    }

    await this.prisma.notificationUser.update({
      where: { id: notiUser.id },
      data: {
        is_deleted: true,
        updated_at: new Date(),
      },
    });

    return {
      success: true,
      message: 'Notification deleted successfully',
      data: {
        id: id,
      },
    };
  }

}