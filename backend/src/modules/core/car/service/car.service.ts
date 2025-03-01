import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../model/car.model';
import { Model } from 'mongoose';
import { QueryBus } from '@nestjs/cqrs';
import { IsExistingCarBrandQuery } from '../../../supporting/brand/use-case/query/is-existing-car-brand.query';

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<Car>,
    private readonly queryBus: QueryBus,
  ) {}

  async findOne(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).exec();

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async findPaginated(limit: number, offset: number): Promise<[Car[], number]> {
    const total = await this.carModel.countDocuments({}).exec();

    if (total === 0) {
      return [[], 0];
    }

    const cars = await this.carModel.find({}).limit(limit).skip(offset);

    return [cars, total];
  }

  async add(
    brand: string,
    vin: string,
    registrationNumber: string,
  ): Promise<void> {
    const existingCar = await this.carModel
      .findOne({
        $or: [{ vin }, { registrationNumber }],
      })
      .exec();

    if (existingCar) {
      throw new ConflictException('Car already exists');
    }

    const isExistingBrand = await this.queryBus.execute(
      new IsExistingCarBrandQuery(brand),
    );

    if (!isExistingBrand) {
      throw new NotFoundException('Brand not found');
    }

    await this.carModel.create(new Car(brand, vin, registrationNumber));
  }

  async update(
    id: string,
    brand?: string,
    vin?: string,
    registrationNumber?: string,
  ): Promise<void> {
    if (!brand && !vin && !registrationNumber) {
      return;
    }

    const car = await this.carModel.findById(id).exec();

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (
      (vin && vin !== car.vin) ||
      (registrationNumber && registrationNumber !== car.registrationNumber)
    ) {
      const existingCar = await this.carModel
        .findOne({
          $or: [{ vin }, { registrationNumber }],
        })
        .exec();

      if (existingCar) {
        throw new ConflictException('Car already exists');
      }

      car.vin = vin ?? car.vin;
      car.registrationNumber = registrationNumber ?? car.registrationNumber;
    }

    if (brand && brand !== car.brand) {
      const isExistingBrand = await this.queryBus.execute(
        new IsExistingCarBrandQuery(brand),
      );

      if (!isExistingBrand) {
        throw new NotFoundException('Brand not found');
      }

      car.brand = brand;
    }

    await car.save();
  }

  async remove(id: string): Promise<void> {
    const car = await this.carModel.findById(id);

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.client) {
      throw new BadRequestException('Cannot delete rented car');
    }

    await this.carModel.deleteOne({ id });
  }
}
