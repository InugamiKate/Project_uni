// dto/update_major.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMajorDto {
  @ApiPropertyOptional({ example: 'Computer Science', description: 'Name of the Major' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Description of Computer Science', description: 'Description of Major' })
  @IsOptional()
  @IsString()
  description?: string;
}