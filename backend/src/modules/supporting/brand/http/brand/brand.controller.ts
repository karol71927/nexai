import { Controller, Get } from '@nestjs/common';
import { BrandHttpResponse } from './response/brand.http-response';
import { BrandService } from '../../service/brand.service';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll(): Promise<BrandHttpResponse[]> {
    const brands = await this.brandService.findAll();

    return brands.map((brand) => {
      return {
        name: brand.name,
      };
    });
  }
}
