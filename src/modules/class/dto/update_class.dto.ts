// dto/update_class.dto.ts

import { IsOptional, IsString, IsInt } from 'class-validator';
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
  
  @ApiPropertyOptional({ required: false, example: 'regist_available', description: 'Status of the class' })
  @IsString()
  @IsOptional()
  status? : string;

  @ApiPropertyOptional({ required: false, example: 'open', description: 'Regist status of the class'})
  @IsOptional()
  @IsString()
  regist_status?: string

  @ApiPropertyOptional({ required: false, example: '40 if null is no limited', description: 'Max number of students allowed in the class' })
  @IsInt()
  @IsOptional()
  max_student: number;
}