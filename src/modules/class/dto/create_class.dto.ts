// dto/create_class.dto.ts

import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
  @ApiProperty({ example: 'This is the id of major', description: 'Id of major, only show if the account_role is admin' })
  @IsUUID()
  @IsOptional()
  major_id?: string;

  @ApiProperty({ example: 'This is the id of semester', description: 'Id of semester' })
  @IsUUID()
  @IsNotEmpty()
  semester_id: string;

  @ApiProperty({ example: 'This is the id of course', description: 'Id of course' })
  @IsUUID()
  @IsNotEmpty()
  course_id: string;

  @ApiProperty({ example: 'This is the id of lecturer', description: 'Id of lecturer' })
  @IsUUID()
  @IsNotEmpty()
  lecturer_id: string;

  @ApiProperty({ example: 'English 101', description: 'Name of the class' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'This is a basic English class', description: 'Description of the class' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: 'Room 101', description: 'Location of the class' })
  @IsString()
  @IsOptional()
  location?: string;
}