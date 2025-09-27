import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './application/class.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService, PrismaService],
})
export class ClassModule {}