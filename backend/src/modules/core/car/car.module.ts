import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './model/car.model';
import { CqrsModule } from '@nestjs/cqrs';
import { CarService } from './service/car.service';
import { CarController } from './http/car/car.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    CqrsModule,
  ],
  providers: [CarService],
  controllers: [CarController],
})
export class CarModule {}
