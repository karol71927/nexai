import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCarHttpRequest {
  @ApiProperty()
  @IsString()
  brand: string;

  @ApiProperty()
  @IsString()
  @Length(17, 17)
  vin: string;

  @ApiProperty()
  @IsString()
  @Length(7, 8)
  registrationNumber: string;
}
