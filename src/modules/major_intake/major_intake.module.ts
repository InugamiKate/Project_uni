import { Module } from '@nestjs/common';
import { MajorIntakeController } from './major_intake.controller';
import { MajorIntakeService } from './application/major_intake.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [MajorIntakeController],
  providers: [MajorIntakeService, PrismaService],
})
export class MajorIntakeModule {}