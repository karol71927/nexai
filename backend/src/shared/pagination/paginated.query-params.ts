import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min, Max } from 'class-validator';

export class PaginatedQueryParams {
  @ApiProperty()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;

  @ApiProperty()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;
}
