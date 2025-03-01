import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCarHttpRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  vin?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  registrationNumber?: string;
}
