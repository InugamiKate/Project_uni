import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTimetableDto {
  @ApiProperty({ example: 'Meeting', description: 'Name of this timetable entry' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Meeting for all CS students', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Room 101', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY', description: 'Day of the week for this timetable entry', required: true })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty({ example: 'MORNING, AFTERNOON, EVENING', description: 'Periods of the day for this timetable entry', required: false })
  @IsString()
  @IsNotEmpty()
  period: string;

  @ApiProperty({ example: 'CLASS, EXAM, OTHER', description: 'Type of the object this timetable relates to (CLASS, EXAM, OTHER)', required: true })
  @IsString()
  @IsNotEmpty()
  object_type: string;

  @ApiProperty({ example: 'id of the object_type', required: false })
  @IsOptional()
  @IsString()
  object_id?: string;

  @ApiProperty({ example: 'id of the major only admin can set', required: false })
  @IsOptional()
  @IsString()
  major_id?: string;

  @ApiProperty({ example: 'id of the major intake', required: false })
  @IsOptional()
  @IsString()
  mi_id?: string;

  @ApiProperty({ example: '9:00', required: false })
  @IsOptional()
  @IsString()
  start_time: string;

  @ApiProperty({ example: '11:00', required: false })
  @IsOptional()
  @IsString()
  end_time: string;
}