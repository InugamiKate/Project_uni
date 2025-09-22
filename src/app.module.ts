import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MajorModule } from './modules/major/major.module';
import { MajorIntakeModule } from './modules/major_intake/major_intake.module';
import { CourseModule } from './modules/course/course.module';
import { JwtAuthGuard } from './infrastructure/common/guard/jwtAuth.guard';

@Module({
  imports: [AuthModule, UserModule, MajorModule, MajorIntakeModule, CourseModule],
  controllers: [AppController],
  providers: [AppService ,JwtAuthGuard],
})
export class AppModule {}
