import { ApiResponseProperty } from '@nestjs/swagger';

export class BrandHttpResponse {
  @ApiResponseProperty()
  name: string;
}
