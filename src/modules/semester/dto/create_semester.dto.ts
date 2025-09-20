// dto/create_semester.dto.ts

import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSemesterDto {
  @ApiProperty({ example: 'Winter Semester', description: 'Tên học kỳ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'id của major_intake', description: 'ID của Major Intake' })
  @IsUUID()
  @IsNotEmpty()
  mid: string;
  
  @ApiProperty({ example: '2023-08-24', description: 'Ngày bắt đầu học kỳ' })
  @IsString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ example: '2023-12-15', description: 'Ngày kết thúc học kỳ' })
  @IsString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({ example: '12', description: 'Số lượng môn trong học kỳ' })
  @IsOptional()
  @IsInt()
  number_of_courses?: number;

}