// dto/update_exam.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExamDto {
  @ApiPropertyOptional({ example: 'Computer Science Exam', description: 'Name of the exam' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Room 101', description: 'Location of the exam' })
  @IsOptional()
  @IsString()
  place?: string;

  @ApiPropertyOptional({ example: '10:00:00 20/12/2025', description: 'Date of the exam' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ required: false, example: 'regist_available', description: 'Status of the exam' })
  @IsString()
  @IsOptional()
  status? : string;

  @ApiPropertyOptional({ required: false, example: 'open', description: 'Regist status of the exam'})
  @IsOptional()
  @IsString()
  regist_status?: string
}