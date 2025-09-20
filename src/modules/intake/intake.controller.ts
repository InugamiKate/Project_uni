import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { IntakeService } from './application/intake.service';
import { CreateIntakeDto } from './dto/create_intake.dto';
import { UpdateIntakeDto } from './dto/update_intake.dto';
import { ListIntakeDto } from './dto/list_intake.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Intake')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('intake')
export class IntakeController {
  constructor(private readonly intakeService: IntakeService) {}

  @Post('create')
  create(@Body() dto: CreateIntakeDto , @Req() req) {
    const user = req.user;
    return this.intakeService.create(dto, user);
  }

  @Get('list')
  async findAll(@Query() query: ListIntakeDto) {
    return this.intakeService.findAll(query);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.intakeService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateIntakeDto, @Req() req) {
    const user = req.user;
    return this.intakeService.update(String(id), dto, user);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string, @Req() req) {
    const user = req.user;
    return this.intakeService.softDelete(String(id), user);
  }
}
