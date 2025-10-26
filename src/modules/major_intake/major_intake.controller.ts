import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { MajorIntakeService } from './application/major_intake.service';
import { CreateMajorIntakeDto } from './dto/create_major_intake.dto';
import { UpdateMajorIntakeDto } from './dto/update_major_intake.dto';
import { ListMajorIntakeDto } from './dto/list_major_intake.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('MajorIntake')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('major_intake')
export class MajorIntakeController {
  constructor(private readonly majorIntakeService: MajorIntakeService) {}

  @Post('create')
  create(@Body() dto: CreateMajorIntakeDto , @Req() req) {
    const user = req.user;
    return this.majorIntakeService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListMajorIntakeDto, @Req() req) {
    const user = req.user;
    return this.majorIntakeService.findAll(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.majorIntakeService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateMajorIntakeDto, @Req() req) {
    const user = req.user;
    return this.majorIntakeService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.majorIntakeService.softDelete(String(id), user);
  }
}
