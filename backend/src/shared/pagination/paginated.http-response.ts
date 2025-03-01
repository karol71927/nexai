import { ApiResponseProperty } from '@nestjs/swagger';

export class PaginatedHttpResponse<T> {
  resources: T[];

  @ApiResponseProperty()
  limit: number;

  @ApiResponseProperty()
  offset: number;

  @ApiResponseProperty()
  total: number;

  constructor(limit: number, offset: number, total: number, resources: T[]) {
    this.limit = limit;
    this.offset = offset;
    this.total = total;
    this.resources = resources;
  }
}
