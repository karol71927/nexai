import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CarService } from '../../car.service';
import { Car } from '../../../model/car.model';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { IsExistingCarBrandQuery } from '../../../../../supporting/brand/use-case/query/is-existing-car-brand.query';

describe('CarService', () => {
  let carService: CarService;
  let carModel: any;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            findById: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    carService = module.get<CarService>(CarService);
    carModel = module.get(getModelToken(Car.name));
    queryBus = module.get(QueryBus);
  });

  describe('findOne', () => {
    it('should return a car when it exists', async () => {
      const carId = '123';
      const car = {
        _id: carId,
        brand: 'Toyota',
        vin: '123456',
        registrationNumber: 'ABC123',
      };
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });

      const result = await carService.findOne(carId);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(result).toEqual(car);
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const carId = '123';
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(carService.findOne(carId)).rejects.toThrow(
        NotFoundException,
      );
      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });
  });

  describe('findPaginated', () => {
    it('should return an empty array and total count of 0 when no cars exist', async () => {
      carModel.countDocuments.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(0),
      });

      const result = await carService.findPaginated(10, 0);

      expect(carModel.countDocuments).toHaveBeenCalledWith({});
      expect(result).toEqual([[], 0]);
    });

    it('should return an array of cars and the total count', async () => {
      const cars = [
        {
          _id: '1',
          brand: 'Toyota',
          vin: '123456',
          registrationNumber: 'ABC123',
        },
        {
          _id: '2',
          brand: 'Honda',
          vin: '654321',
          registrationNumber: 'XYZ789',
        },
      ];
      const total = cars.length;
      carModel.countDocuments.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(total),
      });
      carModel.find.mockReturnValueOnce({
        limit: jest
          .fn()
          .mockReturnValueOnce({ skip: jest.fn().mockResolvedValueOnce(cars) }),
      });

      const result = await carService.findPaginated(10, 0);

      expect(carModel.countDocuments).toHaveBeenCalledWith({});
      expect(carModel.find).toHaveBeenCalledWith({});
      expect(result).toEqual([cars, total]);
    });
  });

  describe('add', () => {
    it('should add a new car when it does not exist and brand is valid', async () => {
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const isExistingBrand = true;
      const existingCar = null;
      jest
        .spyOn(queryBus, 'execute')
        .mockReturnValueOnce(Promise.resolve(isExistingBrand));
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingCar),
      });

      await carService.add(brand, vin, registrationNumber);

      expect(queryBus.execute).toHaveBeenCalledWith(
        new IsExistingCarBrandQuery(brand),
      );
      expect(carModel.findOne).toHaveBeenCalledWith({
        $or: [{ vin }, { registrationNumber }],
      });
      expect(carModel.create).toHaveBeenCalledWith(
        new Car(brand, vin, registrationNumber),
      );
    });

    it('should throw ConflictException when car already exists', async () => {
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const isExistingBrand = true;
      const existingCar = { _id: '1', brand, vin, registrationNumber };
      jest
        .spyOn(queryBus, 'execute')
        .mockReturnValueOnce(Promise.resolve(isExistingBrand));
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingCar),
      });

      await expect(
        carService.add(brand, vin, registrationNumber),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when brand does not exist', async () => {
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const isExistingBrand = false;
      jest
        .spyOn(queryBus, 'execute')
        .mockReturnValueOnce(Promise.resolve(isExistingBrand));
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        carService.add(brand, vin, registrationNumber),
      ).rejects.toThrow(NotFoundException);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new IsExistingCarBrandQuery(brand),
      );
    });
  });

  describe('update', () => {
    it('should do nothing when no properties are provided', async () => {
      const carId = '1';

      await carService.update(carId);

      expect(carModel.findById).not.toHaveBeenCalled();
    });

    it('should update car properties when provided', async () => {
      const carId = '1';
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const car = {
        _id: carId,
        brand: 'Honda',
        vin: '654321',
        registrationNumber: 'XYZ789',
        save: jest.fn(),
      };
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });
      jest
        .spyOn(queryBus, 'execute')
        .mockReturnValueOnce(Promise.resolve(true));

      await carService.update(carId, brand, vin, registrationNumber);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(carModel.findOne).toHaveBeenCalledWith({
        $or: [{ vin }, { registrationNumber }],
      });
      expect(car.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const carId = '1';
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(
        carService.update(carId, brand, vin, registrationNumber),
      ).rejects.toThrow(NotFoundException);
      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });

    it('should throw ConflictException when car with the same vin or registration number already exists', async () => {
      const carId = '1';
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const existingCar = { _id: '2', brand: 'Honda', vin, registrationNumber };
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({
          _id: '1',
          brand: 'Toyota',
          vin: '654321',
          registrationNumber: 'XYZ789',
        }),
      });
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ existingCar }),
      });

      await expect(
        carService.update(carId, brand, vin, registrationNumber),
      ).rejects.toThrow(ConflictException);
      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(carModel.findOne).toHaveBeenCalledWith({
        $or: [{ vin }, { registrationNumber }],
      });
    });

    it('should update brand when provided and it is valid', async () => {
      const carId = '1';
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const car = {
        _id: carId,
        brand: 'Honda',
        vin: '654321',
        registrationNumber: 'XYZ789',
        save: jest.fn(),
      };
      const existingCar = null;
      const isExistingBrand = true;
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingCar),
      });
      jest
        .spyOn(queryBus, 'execute')
        .mockReturnValueOnce(Promise.resolve(isExistingBrand));

      await carService.update(carId, brand, vin, registrationNumber);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(carModel.findOne).toHaveBeenCalledWith({
        $or: [{ vin }, { registrationNumber }],
      });
      expect(queryBus.execute).toHaveBeenCalledWith(
        new IsExistingCarBrandQuery(brand),
      );
      expect(car.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when brand does not exist', async () => {
      const carId = '1';
      const brand = 'Toyota';
      const vin = '123456';
      const registrationNumber = 'ABC123';
      const car = {
        _id: carId,
        brand: 'Honda',
        vin: '654321',
        registrationNumber: 'XYZ789',
      };
      const existingCar = null;
      const isExistingBrand = false;
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });
      carModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(existingCar),
      });
      jest
        .spyOn(queryBus, 'execute')
        .mockReturnValueOnce(Promise.resolve(isExistingBrand));

      await expect(
        carService.update(carId, brand, vin, registrationNumber),
      ).rejects.toThrow(NotFoundException);
      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(carModel.findOne).toHaveBeenCalledWith({
        $or: [{ vin }, { registrationNumber }],
      });
      expect(queryBus.execute).toHaveBeenCalledWith(
        new IsExistingCarBrandQuery(brand),
      );
    });
  });

  describe('remove', () => {
    it('should remove a car when it exists and is not rented', async () => {
      const carId = '1';
      const car = {
        _id: carId,
        brand: 'Toyota',
        vin: '123456',
        registrationNumber: 'ABC123',
        client: null,
      };
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });
      carModel.deleteOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce({ deletedCount: 1 }),
      });

      await carService.remove(carId);

      expect(carModel.findById).toHaveBeenCalledWith(carId);
      expect(carModel.deleteOne).toHaveBeenCalledWith({ _id: carId });
    });

    it('should throw NotFoundException when car does not exist', async () => {
      const carId = '1';
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(carService.remove(carId)).rejects.toThrow(NotFoundException);
      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });

    it('should throw BadRequestException when car is rented', async () => {
      const carId = '1';
      const car = {
        _id: carId,
        brand: 'Toyota',
        vin: '123456',
        registrationNumber: 'ABC123',
        client: 'John Doe',
      };
      carModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(car),
      });

      await expect(carService.remove(carId)).rejects.toThrow(
        BadRequestException,
      );
      expect(carModel.findById).toHaveBeenCalledWith(carId);
    });
  });
});
