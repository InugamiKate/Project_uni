// dto/list_exam_grade.dto.ts

import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListExamGradeDto {
  @ApiProperty({required: false, example: 0, description: 'The amount of data that should be skipped, default is 0' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({required: false,  example: 10, description: 'The length of the list, default is 10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({ required: false, example: 'grade', description: 'Orderby which column, default is grade' })
  @IsOptional()
  @IsString()
  orderBy: string = 'grade';

  @ApiProperty({required: false,  example: 'desc', description: 'The order direction, either asc or desc, default is desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order must be either asc or desc' })
  order?: 'asc' | 'desc' = 'desc';
}
