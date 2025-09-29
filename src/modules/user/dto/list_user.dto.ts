// dto/list_user.dto.ts

import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListUserDto {
  @ApiProperty({required: false, example: 0, description: 'The amount of data that should be skipped, default is 0' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({required: false,  example: 10, description: 'The maximum number of values to return, default is 10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({required: false,  example: 'John', description: 'Search user by name' })
  @IsOptional()
  @IsString()
  name?: string = '';

  @ApiProperty({ required: false, example: 'created_at', description: 'Sort by which field, default is created_at' })
  @IsOptional()
  @IsString()
  orderBy: string = 'created_at';

  @ApiProperty({required: false,  example: 'desc', description: 'Sort order, asc or desc, default is desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order must be asc or desc' })
  order?: 'asc' | 'desc' = 'desc';
}
