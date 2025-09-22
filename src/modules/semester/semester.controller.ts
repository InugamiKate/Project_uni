import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { SemesterService } from './application/semester.service';
import { CreateSemesterDto } from './dto/create_semester.dto';
import { UpdateSemesterDto } from './dto/update_semester.dto';
import { ListSemesterDto } from './dto/list_semester.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
    
@ApiTags('Semester')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Post('create')
  create(@Body() dto: CreateSemesterDto , @Req() req) {
    const user = req.user;
    return this.semesterService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListSemesterDto) {
    return this.semesterService.findAll(query);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.semesterService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateSemesterDto, @Req() req) {
    const user = req.user;
    return this.semesterService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.semesterService.softDelete(String(id), user);
  }
}
