// dto/list_class.dto.ts

import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListClassDto {
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

  @ApiProperty({required: false,  example: 'Class A', description: 'Search name with keyword' })
  @IsOptional()
  @IsString()
  name?: string = '';

  @ApiProperty({ required: false, example: 'created_at', description: 'Orderby which column, default is created_at' })
  @IsOptional()
  @IsString()
  orderBy: string = 'created_at';

  @ApiProperty({required: false,  example: 'desc', description: 'The order direction, either asc or desc, default is desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order must be either asc or desc' })
  order?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ required: false, example: 'semester_id', description: 'Filter by semester_id' })
  @IsOptional()
  @IsString()
  semester_id?: string = '';

  @ApiProperty({ required: false, example: 'course_id', description: 'Filter by course_id' })
  @IsOptional()
  @IsString()
  course_id?: string = '';
}
