// dto/update_semester.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSemesterDto {
  @ApiPropertyOptional({ example: 'Winter Semester', description: 'Semester name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '01/09/2023', description: 'Start date of the semester' })
  @IsOptional()
  @IsString()
  start_date?: string;

  @ApiPropertyOptional({ example: '31/12/2023', description: 'End date of the semester' })
  @IsOptional()
  @IsString()
  end_date?: string;
}