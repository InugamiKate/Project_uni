import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ExamService } from './application/exam.service';
import { CreateExamDto } from './dto/create_exam.dto';
import { UpdateExamDto } from './dto/update_exam.dto';
import { ListExamDto } from './dto/list_exam.dto';
import { ListExamRegistDto } from './dto/list_exam_regist.dto';
import { ValidateRegistDto } from './dto/validate_regist.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
@ApiTags('Exam')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('exam')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('create')
  create(@Body() dto: CreateExamDto , @Req() req) {
    const user = req.user;
    return this.examService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListExamDto, @Req() req) {
    const user = req.user;
    return this.examService.findAll(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.examService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateExamDto, @Req() req) {
    const user = req.user;
    return this.examService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.examService.softDelete(String(id), user);
  }

  @Post('regist/:id')
  registExam(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.examService.registExam(String(id), user);
  }

  @Post('unregist/:id')
  unregistExam(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.examService.unregistExam(String(id), user);
  }

  @Get('list_regist')
  async listExamRegist(@Query() query: ListExamRegistDto, @Req() req) {
    const user = req.user;
    return this.examService.listExamRegist(query, user);
  }

  @Put('validate_regist/:id')
  validateRegist(@Param('id') id: string, @Body() dto: ValidateRegistDto, @Req() req) {
    const user = req.user;
    return this.examService.validateRegist(String(id), dto, user);
  }
}
