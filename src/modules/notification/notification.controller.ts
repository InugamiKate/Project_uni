import { Controller, Get, Post, Body, Param, Put, Delete, Patch, UseGuards, Req } from '@nestjs/common';
import { NotificationService } from './application/notification.service';
import { ListNotificationDto } from './dto/list_notification.dto';
import { CreateNotificationDto } from './dto/create_notification.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
    
@ApiTags('Notificaiton')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('create')
  create(@Body() dto: CreateNotificationDto , @Req() req) {
    const user = req.user;
    return this.notificationService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListNotificationDto, @Req() req) {
    const user = req.user;
    return this.notificationService.findAll(query, user);
  }

  @Get('list_by_user')
  async findByUser(@Query() query: ListNotificationDto, @Req() req) {
    const user = req.user;
    return this.notificationService.findByUser(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.notificationService.findOne(id, user);
  }

  @Patch('mark_all_read')
  async markAllRead(@Req() req) {
    const user = req.user;
    return this.notificationService.markAllRead(user);
  }

  @Patch('delete_all')
  async deleteAll(@Req() req) {
    const user = req.user;
    return this.notificationService.deleteAll(user);
  }

  @Patch('delete/:id')
  async deleteOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.notificationService.deleteOne(id, user);
  }
}
