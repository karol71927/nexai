import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCarHttpRequest {
  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  vin: string;

  @ApiProperty()
  @IsString()
  registrationNumber: string;
}
