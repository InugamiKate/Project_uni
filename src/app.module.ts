import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MajorModule } from './modules/major/major.module';
import { MajorIntakeModule } from './modules/major_intake/major_intake.module';
import { CourseModule } from './modules/course/course.module';
import { SemesterModule } from './modules/semester/semester.module';
import { ClassModule } from './modules/class/class.module';
import { ExamModule } from './modules/exam/exam.module';
import { CronModule } from './modules/cron/cron.module';
import { NotificationModule } from './modules/notification/notification.module';
import { JwtAuthGuard } from './infrastructure/common/guard/jwtAuth.guard';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), CronModule, AuthModule, UserModule, MajorModule, MajorIntakeModule, CourseModule, SemesterModule, ClassModule, ExamModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService ,JwtAuthGuard],
})
export class AppModule {}
