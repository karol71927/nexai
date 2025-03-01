import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from '../../core/car/model/car.model';
import { Brand, BrandSchema } from '../../supporting/brand/model/brand.model';
import { Seeder } from './seeder/seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Car.name, schema: CarSchema },
      { name: Brand.name, schema: BrandSchema },
    ]),
  ],
  providers: [Seeder],
})
export class SeederModule {}
