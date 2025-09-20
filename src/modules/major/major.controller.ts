import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { MajorService } from './application/major.service';
import { CreateMajorDto } from './dto/create_major.dto';
import { UpdateMajorDto } from './dto/update_major.dto';
import { ListMajorDto } from './dto/list_major.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
@ApiTags('Major')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('major')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Post('create')
  create(@Body() dto: CreateMajorDto , @Req() req) {
    const user = req.user;
    return this.majorService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListMajorDto) {
    return this.majorService.findAll(query);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.majorService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMajorDto, @Req() req) {
    const user = req.user;
    return this.majorService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.majorService.softDelete(String(id), user);
  }
}
