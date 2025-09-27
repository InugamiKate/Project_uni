import { Module } from '@nestjs/common';
import { TokenCleanerService } from './token-cleaner.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  providers: [TokenCleanerService, PrismaService],
})
export class CronModule {}