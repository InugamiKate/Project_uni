// dto/change_password.dto.ts

import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID of the user to change password if not admin the user_id from token will be used' })
    @IsUUID()
    @IsOptional()
    user_id: string;

    @ApiProperty({ example: 'ABC123', description: 'New password of the user' })
    @IsString()
    @IsOptional()
    new_password?: string;

    @ApiProperty({ example: 'XYZ789', description: 'Old password of the user' })
    @IsString()
    @IsOptional()
    old_password?: string;
}