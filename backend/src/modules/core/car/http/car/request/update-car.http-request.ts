import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateCarHttpRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(17, 17)
  vin?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Length(7, 8)
  registrationNumber?: string;
}
