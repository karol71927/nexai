import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car } from '../../../core/car/model/car.model';
import { Brand } from '../../../supporting/brand/model/brand.model';
import { Model } from 'mongoose';

@Injectable()
export class Seeder implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<Car>,
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}

  async onApplicationBootstrap() {
    console.log('Seeding data...', process.env.SEED);
    if (process.env.SEED !== 'true') {
      return;
    }

    const brandNames = await this.seedBrands();

    await this.seedCars(brandNames);
  }

  private async seedBrands(): Promise<string[]> {
    const brands = await this.brandModel.find({}).exec();

    if (brands.length > 0) {
      return [];
    }

    const brandNames = [
      'BMW',
      'Audi',
      'Mercedes',
      'Volkswagen',
      'Toyota',
      'Honda',
      'Ford',
      'Chevrolet',
      'Hyundai',
      'Nissan',
    ];

    for (const brandName of brandNames) {
      await this.brandModel.create({ name: brandName });
    }

    return brandNames;
  }

  private async seedCars(brandNames: string[]) {
    const cars = await this.carModel.find({}).exec();

    if (cars.length > 0) {
      return;
    }

    const carsToSeed = 100;

    for (let i = 0; i < carsToSeed; i++) {
      const brand = this.getRandomArrayElement(brandNames);
      const vin = this.generateRandomString(17);
      const registrationNumber = this.generateRandomString(8);

      const addClient = Math.random() < 0.5;
      if (addClient) {
        const clientEmail = `${this.generateRandomString(5)}@${this.generateRandomString(5)}.com`;
        const clientAddress = this.generateRandomString(10);
        await this.carModel.create({
          brand,
          vin,
          registrationNumber,
          client: { email: clientEmail, address: clientAddress },
          location: this.generateRandomString(10),
        });
      } else {
        await this.carModel.create({ brand, vin, registrationNumber });
      }
    }
  }

  private getRandomArrayElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }
}
