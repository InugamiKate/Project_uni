import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './application/exam.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [ExamController],
  providers: [ExamService, PrismaService],
})
export class ExamModule {}