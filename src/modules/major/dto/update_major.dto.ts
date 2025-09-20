// dto/update_major.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMajorDto {
  @ApiPropertyOptional({ example: 'Computer Science', description: 'Tên chuyên ngành' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Chuyên ngành về khoa học máy tính', description: 'Mô tả chuyên ngành' })
  @IsOptional()
  @IsString()
  description?: string;
}