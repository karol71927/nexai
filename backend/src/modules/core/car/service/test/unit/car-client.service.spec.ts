import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CarClientService } from '../../car-client.service';
import { Car } from '../../../model/car.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientAssignedEvent } from '../../../../../../events/client-assigned.event';

describe('CarClientService', () => {
  let carClientService: CarClientService;
  let carModel: any;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarClientService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    carClientService = module.get<CarClientService>(CarClientService);
    carModel = module.get(getModelToken(Car.name));
    eventEmitter = module.get(EventEmitter2);
  });

  describe('assignClient', () => {
    it('should assign a client to a car', async () => {
      const carId = '1';
      const clientEmail = 'test@example.com';
      const clientAddress = '123 Main St';

      const car = {
        _id: carId,
        client: null,
        save: jest.fn(),
      };

      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });

      await carClientService.assignClient(carId, clientEmail, clientAddress);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(car.client).toEqual({
        email: clientEmail,
        address: clientAddress,
      });
      expect(car.save).toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        ClientAssignedEvent.name,
        new ClientAssignedEvent(carId, clientEmail, clientAddress),
      );
    });

    it('should throw NotFoundException when car is not found', async () => {
      const carId = '1';
      const clientEmail = 'test@example.com';
      const clientAddress = '123 Main St';

      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        carClientService.assignClient(carId, clientEmail, clientAddress),
      ).rejects.toThrow(NotFoundException);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });

    it('should throw BadRequestException when car already has a client', async () => {
      const carId = '1';
      const clientEmail = 'test@example.com';
      const clientAddress = '123 Main St';

      const car = {
        _id: carId,
        client: {
          email: 'existing@example.com',
          address: '456 Main St',
        },
      };

      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });

      await expect(
        carClientService.assignClient(carId, clientEmail, clientAddress),
      ).rejects.toThrow(BadRequestException);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });
  });

  describe('unassignClient', () => {
    it('should unassign a client from a car', async () => {
      const carId = '1';

      const car = {
        _id: carId,
        client: {
          email: 'test@example.com',
          address: '123 Main St',
        },
        save: jest.fn(),
      };

      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });

      await carClientService.unassignClient(carId);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(car.client).toBeNull();
      expect(car.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when car is not found', async () => {
      const carId = '1';

      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(carClientService.unassignClient(carId)).rejects.toThrow(
        NotFoundException,
      );

      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });

    it('should throw BadRequestException when car does not have a client', async () => {
      const carId = '1';

      const car = {
        _id: carId,
        client: null,
      };

      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });

      await expect(carClientService.unassignClient(carId)).rejects.toThrow(
        BadRequestException,
      );

      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });
  });
});
