// dto/create_course.dto.ts

import { IsNotEmpty, IsString, IsOptional, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'This is the id of major', description: 'Id of major, only show if the account_role is admin' })
  @IsUUID()
  @IsOptional()
  major_id?: string;

  @ApiProperty({ example: 'English 101', description: 'Name of the course' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'This is a basic English course', description: 'Description of the course' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 3, description: 'Weight of the course' })
  @IsOptional()
  @IsInt()
  weight?: number;

  @ApiProperty({ required: false, example: 'This is the id of the parent course - the course that need to pass to take this course', description: 'Id of the parent course' })
  @IsUUID()
  @IsOptional()
  parent_id?: string;
}