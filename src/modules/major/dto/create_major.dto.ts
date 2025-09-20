// dto/create_major.dto.ts

import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMajorDto {
  @ApiProperty({ example: 'Computer Science', description: 'Tên chuyên ngành' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Chuyên ngành về khoa học máy tính', description: 'Mô tả chuyên ngành' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: 'true', description: 'Chuyên ngành đã bị xóa hay chưa, mặc định là false' })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean = false;
}