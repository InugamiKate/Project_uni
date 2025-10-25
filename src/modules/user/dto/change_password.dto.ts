// dto/change_password.dto.ts

import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangePasswordDto {
    @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID của user để thay đổi mật khẩu chỉ admin mới đc chọn không thì lấy trong token' })
    @IsUUID()
    @IsOptional()
    user_id: string;

    @ApiProperty({ example: 'ABC123', description: 'Mật khẩu mới của user' })
    @IsString()
    @IsOptional()
    new_password?: string;

    @ApiProperty({ example: 'XYZ789', description: 'Mật khẩu cũ của user' })
    @IsString()
    @IsOptional()
    old_password?: string;
}