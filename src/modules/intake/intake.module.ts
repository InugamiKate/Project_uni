import { Module } from '@nestjs/common';
import { IntakeController } from './intake.controller';
import { IntakeService } from './application/intake.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [IntakeController],
  providers: [IntakeService, PrismaService],
})
export class IntakeModule {}