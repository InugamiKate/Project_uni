import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ClassService } from './application/class.service';
import { CreateClassDto } from './dto/create_class.dto';
import { UpdateClassDto } from './dto/update_class.dto';
import { ListClassDto } from './dto/list_class.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
@ApiTags('Class')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('create')
  create(@Body() dto: CreateClassDto , @Req() req) {
    const user = req.user;
    return this.classService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListClassDto, @Req() req) {
    const user = req.user;
    return this.classService.findAll(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.classService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateClassDto, @Req() req) {
    const user = req.user;
    return this.classService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.classService.softDelete(String(id), user);
  }
}
