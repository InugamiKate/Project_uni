import { Module } from '@nestjs/common';
import { TimetableController } from './timetable.controller';
import { TimetableService } from './application/timetable.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [TimetableController],
  providers: [TimetableService, PrismaService],
})
export class TimetableModule {}