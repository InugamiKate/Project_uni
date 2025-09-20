// dto/list_semester.dto.ts

import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListSemesterDto {
  @ApiProperty({required: false, example: 0, description: 'Số giá trị muốn bỏ qua, mặc định là 0' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Offset phải là số nguyên' })
  @Min(0, { message: 'Offset phải >= 0' })
  offset?: number = 0;

  @ApiProperty({required: false,  example: 10, description: 'Số giá trị tối đa trả về, mặc định là 10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải >= 1' })
  limit?: number = 10;

  @ApiProperty({required: false,  example: 'John', description: 'Tên học kỳ để tìm kiếm không dấu' })
  @IsOptional()
  @IsString()
  name?: string = '';

  @ApiProperty({ required: false, example: 'created_at', description: 'Theo thứ tự nào, mặc định là created_at' })
  @IsOptional()
  @IsString()
  orderBy: string = 'created_at';

  @ApiProperty({required: false,  example: 'desc', description: 'Thứ tự sắp xếp, asc hoặc desc, mặc định là desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'Order phải là asc hoặc desc' })
  order?: 'asc' | 'desc' = 'desc';
}
