import { Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}
