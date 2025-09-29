// dto/validate_regist.dto.ts

import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateRegistDto {
  @ApiPropertyOptional({ required: true, example: true, description: 'Indicates if the registration is valid' })
  @IsNotEmpty()
  @IsBoolean()
  valid?: boolean;
}