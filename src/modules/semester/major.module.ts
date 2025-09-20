import { Module } from '@nestjs/common';
import { MajorController } from './major.controller';
import { MajorService } from './application/major.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [MajorController],
  providers: [MajorService, PrismaService],
})
export class MajorModule {}