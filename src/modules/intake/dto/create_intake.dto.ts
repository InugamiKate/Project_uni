// dto/create_intake.dto.ts

import { IsBoolean, IsNotEmpty, IsString, IsUUID, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIntakeDto {
  @ApiProperty({ example: 'Computer Science', description: 'Tên Intake' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 2023, description: 'Năm tuyển sinh' })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ required: false, example: 'true', description: 'Intake đã bị xóa hay chưa, mặc định là false' })
  @IsOptional()
  @IsBoolean()
  deleted?: boolean = false;
}