import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './application/course.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
})
export class CourseModule {}