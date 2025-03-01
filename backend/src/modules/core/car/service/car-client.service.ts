import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car } from '../model/car.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientAssignedEvent } from '../../../../events/client-assigned.event';

@Injectable()
export class CarClientService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<Car>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async assignClient(
    carId: string,
    clientEmail: string,
    clientAddress: string,
  ) {
    const car = await this.carModel.findById(carId).exec();

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (car.client) {
      throw new BadRequestException('Car already has a client');
    }

    car.client = {
      email: clientEmail,
      address: clientAddress,
    };

    await car.save();

    this.eventEmitter.emit(
      ClientAssignedEvent.name,
      new ClientAssignedEvent(carId, clientEmail, clientAddress),
    );
  }

  async unassignClient(carId: string) {
    const car = await this.carModel.findById(carId).exec();

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    if (!car.client) {
      throw new BadRequestException('Car does not have a client');
    }

    car.client = null;

    await car.save();
  }
}
