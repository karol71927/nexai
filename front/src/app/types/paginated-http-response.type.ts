export class PaginatedHttpResponse<T> {
  resources: T[];
  limit: number;
  offset: number;
  total: number;
}
