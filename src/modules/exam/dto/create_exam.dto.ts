// dto/create_exam.dto.ts

import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ example: 'This is the id of major', description: 'Id of major, only show if the account_role is admin' })
  @IsUUID()
  @IsOptional()
  major_id: string;

  @ApiProperty({ example: 'This is the id of semester', description: 'Id of semester' })
  @IsUUID()
  @IsNotEmpty()
  semester_id: string;

  @ApiProperty({ example: 'This is the id of course', description: 'Id of course' })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ example: 'This is the id of the class', description: 'Id of the class' })
  @IsUUID()
  @IsOptional()
  class_id?: string;

  @ApiProperty({ example: 'English 101 Exam', description: 'Name of the exam' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Room 101', description: 'Place of the exam' })
  @IsString()
  @IsOptional()
  place?: string;

  @ApiProperty({ required: false, example: '2023-10-10 10:00', description: 'Date of the exam' })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({ required: false, example: 'default is new', description: 'Status of the exam' })
  @IsString()
  @IsOptional()
  status? : string;

  @ApiProperty({ required: false, example: 'default is closed', description: 'Regist status of the exam'})
  @IsString()
  @IsOptional()
  regist_status? : string;
}