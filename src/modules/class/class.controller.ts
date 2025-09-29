import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ClassService } from './application/class.service';
import { CreateClassDto } from './dto/create_class.dto';
import { UpdateClassDto } from './dto/update_class.dto';
import { ListClassDto } from './dto/list_class.dto';
import { ListClassRegistDto } from './dto/list_class_regist.dto';
import { ValidateRegistDto } from './dto/validate_regist.dto';
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

  @Post('regist/:id')
  registClass(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.classService.registClass(String(id), user);
  }

  @Post('unregist/:id')
  unregistClass(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.classService.unregistClass(String(id), user);
  }

  @Get('list_regist')
  async listClassRegist(@Query() query: ListClassRegistDto, @Req() req) {
    const user = req.user;
    return this.classService.listClassRegist(query, user);
  }

  @Put('validate_regist/:id')
  validateRegist(@Param('id') id: string, @Body() dto: ValidateRegistDto, @Req() req) {
    const user = req.user;
    return this.classService.validateRegist(String(id), dto, user);
  }
}
