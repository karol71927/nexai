import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from './model/brand.model';
import { BrandService } from './service/brand.service';
import { BrandController } from './http/brand/brand.controller';
import { IsExistingCarBrandQueryHandler } from './use-case/query/is-existing-car-brand.query-handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }]),
  ],
  controllers: [BrandController],
  providers: [BrandService, IsExistingCarBrandQueryHandler],
})
export class BrandModule {}
