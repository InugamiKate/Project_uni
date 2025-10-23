import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './application/user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { ListUserDto } from './dto/list_user.dto';
import { Query } from '@nestjs/common/decorators';
import { JwtAuthGuard } from '../../infrastructure/common/guard/jwtAuth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get('list')
  async findAll(@Query() query: ListUserDto, @Req() req) {
    const user = req.user;
    return this.userService.findAll(query, user);
  }

  @Get('detail/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(String(id), dto);
  }

  @Delete('delete/:id')
  softDelete(@Param('id') id: string) {
    return this.userService.softDelete(String(id));
  }

  @Get('grades/:id')
  getUserGrades(@Param('id') id: string) {
    return this.userService.getUserGrades(String(id));
  }
  
}
