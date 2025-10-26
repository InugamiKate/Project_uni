import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TimetableService } from './application/timetable.service';
import { ListTimetableDto } from './dto/list_timetable.dto';
import { CreateTimetableDto } from './dto/create_timetable.dto';
import { Patch, Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Timetable')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post('create')
  create(@Body() dto: CreateTimetableDto , @Req() req) {
    const user = req.user;
    return this.timetableService.create(dto, user);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() dto: CreateTimetableDto, @Req() req) {
    const user = req.user;
    return this.timetableService.update(id, dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListTimetableDto, @Req() req) {
    const user = req.user;
    return this.timetableService.findAll(query, user);
  }

  @Get('list_by_user')
  async findByUser(@Query() query: ListTimetableDto, @Req() req) {
    const user = req.user;
    return this.timetableService.findByUser(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.timetableService.findOne(id);
  }

  @Delete('delete/:id')
  async deleteOne(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.timetableService.deleteOne(id, user);
  }

  @Get('list_by_lecture_use_object_type')
  async findByLecture(@Query() query: ListTimetableDto, @Req() req) {
    const user = req.user;
    return this.timetableService.findByLecture(query, user);
  }
}
