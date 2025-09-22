// dto/list_semester.dto.ts

import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
  
export class ListSemesterDto {
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

  @ApiProperty({required: false,  example: 'Winter', description: 'Search name with keyword' })
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
}
