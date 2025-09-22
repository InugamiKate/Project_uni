import { Module } from '@nestjs/common';
import { SemesterController } from './semester.controller';
import { SemesterService } from './application/semester.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService, PrismaService],
})
export class SemesterModule {}