import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { CourseService } from './application/course.service';
import { CreateCourseDto } from './dto/create_course.dto';
import { UpdateCourseDto } from './dto/update_course.dto';
import { ListCourseDto } from './dto/list_course.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
@ApiTags('Course')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('create')
  create(@Body() dto: CreateCourseDto , @Req() req) {
    const user = req.user;
    return this.courseService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListCourseDto, @Req() req) {
    const user = req.user;
    return this.courseService.findAll(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCourseDto, @Req() req) {
    const user = req.user;
    return this.courseService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.courseService.softDelete(String(id), user);
  }
}
