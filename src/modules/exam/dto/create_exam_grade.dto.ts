// src/modules/exam/dto/create_exam_grade.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsArray, ValidateNested, IsBoolean, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ExamGradeItemDto {
  @ApiProperty({ example: 'd3ae653b-8c0b-4371-b2ca-122d86ea33e7' })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 3.0 })
  @IsNotEmpty()
  @IsNumber()
  grade: number;

  @ApiProperty({ example: true, description: 'Optional: whether the student has passed the exam' })
  @IsNotEmpty()
  @IsBoolean()
  is_passed?: boolean;
}

export class CreateExamGradeDto {
  @ApiProperty({
    type: [ExamGradeItemDto],
    example: [
      { user_id: 'uuid-1', grade: 3.0, is_passed: true },
      { user_id: 'uuid-2', grade: 5.0, is_passed: false },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamGradeItemDto)
  grades: ExamGradeItemDto[];
}