import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MajorModule } from './modules/major/major.module';
import { MajorIntakeModule } from './modules/major_intake/major_intake.module';
import { CourseModule } from './modules/course/course.module';
import { SemesterModule } from './modules/semester/semester.module';
import { JwtAuthGuard } from './infrastructure/common/guard/jwtAuth.guard';

@Module({
  imports: [AuthModule, UserModule, MajorModule, MajorIntakeModule, CourseModule, SemesterModule],
  controllers: [AppController],
  providers: [AppService ,JwtAuthGuard],
})
export class AppModule {}
