// dto/create_major_intake.dto.ts

import { IsNotEmpty, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMajorIntakeDto {
  @ApiProperty({ required: true, example: 'major-123', description: 'ID of the Major' })
  @IsUUID()
  @IsNotEmpty()
  major_id: string;

  @ApiProperty({ required: true, example: 'intake-456', description: 'ID of the Intake' })
  @IsUUID()
  @IsNotEmpty()
  intake: string;

  @ApiProperty({ required: false, example: 'teacher-789', description: 'ID of the Head Teacher for the year' })
  @IsUUID()
  @IsOptional()
  head_teacher_id?: string;

  @ApiProperty({ required: true, example: 100, description: 'Total weight' })
  @IsOptional()
  @IsNumber()
  total_weight: number;
}