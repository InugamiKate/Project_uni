import { IsNotEmpty, IsString, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'This is the id of major', description: 'Id of major, only show if the account_role is admin' })
  @IsUUID()
  @IsOptional()
  major_id: string;

  @ApiProperty({ example: 'New Course Available', description: 'Title of the notification' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A new course has been added to the catalog.', description: 'Content of the notification' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: 'ALL',
    description: 'Type of the notification: ALL, INTAKE, COURSE, CLASS, EXAM, OTHER',
  })
  @IsString()
  @IsNotEmpty()
  object_type: string;

  @ApiProperty({
    example: 'd3ae653b-8c0b-4371-b2ca-122d86ea33e7',
    required: false,
    description: 'ID of the object related to the notification (for INTAKE, COURSE, CLASS, EXAM)',
  })
  @IsOptional()
  @IsString()
  object_id?: string;

  @ApiProperty({
    example: ['user-uuid-1', 'user-uuid-2'],
    required: false,
    description: 'List of user IDs (only used when object_type = OTHER)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  user_ids?: string[];
}