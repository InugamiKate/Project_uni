// dto/update_intake.dto.ts

import { IsOptional, IsString, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateIntakeDto {
  @ApiPropertyOptional({ example: 'Computer Science', description: 'Tên chuyên ngành' })
  @IsOptional()
  @IsString()
  name?: string;
  
  @ApiPropertyOptional({ example: 2023, description: 'Năm tuyển sinh' })
  @IsInt()
  @IsOptional()
  year?: number;
}