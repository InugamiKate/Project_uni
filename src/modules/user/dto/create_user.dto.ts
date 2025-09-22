// dto/create_user.dto.ts

import { IsBoolean, IsNotEmpty, IsString, IsUUID, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { USER_ROLES } from '../../../constants/constant';

export class CreateUserDto {
  @ApiProperty({ example: 'Dang Tran', description: 'Tên đầy đủ của user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: '123456', description: 'Code của user' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ required: false, example: '2000-01-01', description: 'Ngày sinh của user là dạng string thôi' })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false, example: '0123456789', description: 'Số điện thoại của user' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'dangtran@example.com', description: 'Email của user' })
  @IsString()
  email: string;

  // @ApiProperty({ example: '123456', description: 'Mật khẩu đăng nhập default là code' })
  // password?: string;

  @ApiProperty({ required: false, example: 'male', description: 'Giới tính của user' })
  @IsOptional()
  @IsString()
  sex?: string;

  @ApiProperty({ required: false, example: '123 Main St, City, Country', description: 'Địa chỉ của user' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false, example: 'user', description: 'Hiện tại có vai trò user' })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(USER_ROLES), { message: `Role phải nằm trong: ${Object.values(USER_ROLES).join(', ')}` })
  role?: string;

  @ApiProperty({ required: false, description: 'ID chuyên ngành của user' })
  @IsOptional()
  @IsUUID()
  major_id?: string;

  @ApiProperty({ required: false, description: 'ID khóa học của user' })
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