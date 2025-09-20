// dto/create_major_intake.dto.ts

import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMajorIntakeDto {
  @ApiProperty({ required: true, example: 'major-123', description: 'ID của chuyên ngành' })
  @IsUUID()
  @IsNotEmpty()
  major_id: string;

  @ApiProperty({ required: true, example: 'intake-456', description: 'ID của khóa' })
  @IsUUID()
  @IsNotEmpty()
  intake_id: string;

  @ApiProperty({ required: false, example: 'teacher-789', description: 'ID của trưởng ngành năm đó' })
  @IsUUID()
  @IsOptional()
  head_teacher_id?: string;

  @ApiProperty({ required: true, example: 100, description: 'Tổng trọng số' })
  @IsOptional()
  @IsNumber()
  total_weight: number;
}