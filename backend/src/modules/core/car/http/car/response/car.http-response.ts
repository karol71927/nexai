import { ApiResponseProperty } from '@nestjs/swagger';
import { Car } from '../../../model/car.model';

class Client {
  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  address: string;
}

export class CarHttpResponse {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  brand: string;

  @ApiResponseProperty()
  vin: string;

  @ApiResponseProperty()
  registrationNumber: string;

  @ApiResponseProperty({ type: () => Client })
  client: Client | null;

  @ApiResponseProperty()
  isRented: boolean;

  @ApiResponseProperty()
  location: string | null;

  constructor(car: Car) {
    this.id = car._id;
    this.brand = car.brand;
    this.vin = car.vin;
    this.registrationNumber = car.registrationNumber;
    this.client = car.client
      ? {
          email: car.client.email,
          address: car.client.address,
        }
      : null;
    this.location = car.location;
    this.isRented = !!car.client;
  }
}
