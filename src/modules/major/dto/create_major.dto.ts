// dto/create_major.dto.ts

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMajorDto {
  @ApiProperty({ example: 'Computer Science', description: 'Name of Major' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Description of Computer Science', description: 'Description of Major' })
  @IsString()
  @IsOptional()
  description?: string;
}