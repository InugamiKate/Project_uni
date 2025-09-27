import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class TokenCleanerService {
  private readonly logger = new Logger(TokenCleanerService.name);

  constructor(private readonly prisma: PrismaService) {}

  // chạy lúc 0h mỗi ngày
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('Running refresh token cleanup job...');

    const now = new Date();

    const result = await this.prisma.jwtToken.deleteMany({
      where: {
        expires_at: { lt: now },
      },
    });

    this.logger.log(`Deleted ${result.count} expired JWT tokens`);
  }
}
