// dto/create_user.dto.ts

import { IsBoolean, IsNotEmpty, IsString, IsUUID, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES } from '../../../constants/constant';

export class CreateUserDto {
  @ApiProperty({ example: 'Dang Tran', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: '123456', description: 'Code of the user' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false, example: '2000-01-01', description: 'Birthday of the user in string format' })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false, example: '0123456789', description: 'Phone number of the user' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'dangtran@example.com', description: 'Email of the user' })
  @IsString()
  email: string;

  // @ApiProperty({ example: '123456', description: 'Mật khẩu đăng nhập default là code' })
  // password?: string;

  @ApiProperty({ required: false, example: 'male', description: 'Gender of the user' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ required: false, example: '123 Main St, City, Country', description: 'Address of the user' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'user', description: 'Current role of the user' })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(USER_ROLES), { message: `Role must be one of: ${Object.values(USER_ROLES).join(', ')}` })
  role?: string;

  @ApiProperty({ required: false, description: 'Major ID of the user' })
  @IsOptional()
  @IsUUID()
  major_id?: string;

  @ApiProperty({ required: false, description: 'Major Intake ID of the user' })
  @IsOptional()
  @IsUUID()
  mi_id?: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_graduated?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  is_student?: boolean;
}