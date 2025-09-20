// dto/update_major_intake.dto.ts

import { IsOptional, IsUUID, IsNumber, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMajorIntakeDto {
  
    @ApiPropertyOptional({ required: false, example: 'teacher-789', description: 'ID của trưởng ngành năm đó' })
    @IsUUID()
    @IsOptional()
    head_teacher_id?: string;
  
    @ApiPropertyOptional({ required: true, example: 100, description: 'Tổng trọng số' })
    @IsOptional()
    @IsNumber()
    total_weight: number;

    @ApiPropertyOptional({ required: false, description: 'Môn học', example: { subject1: { weight: 50 }, subject2: { weight: 50 } } })
    @IsOptional()
    @IsObject()
    courses?: Record<string, any>;
}