// dto/list_timetable.dto.ts

import { IsInt, IsOptional, IsString, IsIn, Min, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListTimetableDto {
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

  @ApiProperty({required: false,  example: 'id of major' })
  @IsOptional()
  @IsString()
  major_id?: string = '';

  @ApiProperty({required: false,  example: 'id of intake' })
  @IsNotEmpty()
  @IsString()
  mi_id?: string = '';
}
