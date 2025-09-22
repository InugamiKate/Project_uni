// dto/create_semester.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSemesterDto {
  @ApiProperty({ example: 'Winter Semester', description: 'Name of the semester' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '01/09/2023', description: 'Start date of the semester' })
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ example: '31/12/2023', description: 'End date of the semester' })
  @IsString()
  @IsNotEmpty()
  end_date: string;
}