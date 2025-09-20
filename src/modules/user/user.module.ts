import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './application/user.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}