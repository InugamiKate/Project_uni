// dto/update_class.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassDto {
  @ApiPropertyOptional({ example: 'Computer Science', description: 'Name of the class' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'This is a class about computer science', description: 'Description of the class' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Room 101', description: 'Location of the class' })
  @IsOptional()
  @IsString()
  location?: string;
}