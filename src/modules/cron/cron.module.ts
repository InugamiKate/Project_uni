import { Module } from '@nestjs/common';
import { TokenCleanerService } from './token-cleaner.service';
import { UpdateDatabaseService } from './update-database.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  providers: [TokenCleanerService, UpdateDatabaseService, PrismaService],
})
export class CronModule {}