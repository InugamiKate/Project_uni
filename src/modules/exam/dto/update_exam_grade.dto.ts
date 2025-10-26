// dto/update_exam_grade.dto.ts

import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateExamGradeDto {
    @ApiProperty({ required: true, example: '3.0', description: 'Grade of the exam' })
    @IsString()
    grade: string;

    @ApiProperty({ required: true, example: 'true', description: 'Indicates if the student passed the exam' })
    @IsString()
    is_passed: string;
}