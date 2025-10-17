import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './application/notification.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PrismaService],
})
export class NotificationModule {}