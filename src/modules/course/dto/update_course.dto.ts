// dto/update_course.dto.ts

import { IsOptional, IsString, IsUUID, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Computer Science', description: 'Name of the course' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'This is a course about computer science', description: 'Description of the course' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3, description: 'Weight of the course' })
  @IsOptional()
  @IsInt()
  weight?: number;

  @ApiPropertyOptional({ example: 'This is the id of the parent course - the course that need to pass to take this course', description: 'Id of the parent course' })
  @IsOptional()
  @IsUUID()
  parent_id?: string;
}