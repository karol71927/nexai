import { Observable, of } from 'rxjs';
import { Car } from '../types/car.type';
import { Injectable, resource } from '@angular/core';
import { EditCar } from '../types/edit-car.type';
import { ClientData } from '../types/client-data.type';
import { PaginatedHttpResponse } from '../types/paginated-http-response.type';

@Injectable({
  providedIn: 'root',
})
export class CarHttpService {
  readonly mockCars: Car[] = [
    {
      id: '1',
      brand: 'Toyota',
      clientEmail: 'john.doe@example.com',
      clientAddress: '123 Main St, New York, NY',
      vin: '1HGCM82633A123456',
      registrationNumber: 'ABC-1234',
      isRented: true,
      currentLocation: 'New York, NY',
    },
    {
      id: '2',
      brand: 'Honda',
      clientEmail: 'jane.smith@example.com',
      clientAddress: '456 Elm St, Los Angeles, CA',
      vin: '2HGFA16598H123456',
      registrationNumber: 'XYZ-5678',
      isRented: false,
      currentLocation: 'Los Angeles, CA',
    },
    {
      id: '3',
      brand: 'Ford',
      clientEmail: 'mike.jones@example.com',
      clientAddress: '789 Oak St, Chicago, IL',
      vin: '3FAHP0HA7CR123456',
      registrationNumber: 'LMN-9101',
      isRented: true,
      currentLocation: 'Chicago, IL',
    },
    {
      id: '4',
      brand: 'BMW',
      clientEmail: 'lisa.brown@example.com',
      clientAddress: '321 Maple St, Miami, FL',
      vin: '5UXFA135X9L123456',
      registrationNumber: 'PQR-2345',
      isRented: false,
      currentLocation: 'Miami, FL',
    },
    {
      id: '5',
      brand: 'Tesla',
      clientEmail: 'david.white@example.com',
      clientAddress: '654 Pine St, Seattle, WA',
      vin: '5YJ3E1EA7LF123456',
      registrationNumber: 'GHI-6789',
      isRented: true,
      currentLocation: 'Seattle, WA',
    },
    {
      id: '6',
      brand: 'Toyota',
      clientEmail: 'john.doe@example.com',
      clientAddress: '123 Main St, New York, NY',
      vin: '1HGCM82633A123456',
      registrationNumber: 'ABC-1234',
      isRented: true,
      currentLocation: 'New York, NY',
    },
  ];

  getAvailableBrands(): Observable<string[]> {
    return of(['Toyota', 'Honda', 'Ford', 'BMW', 'Tesla']);
  }

  getList(
    pageIndex = 0,
    pageSize = 10
  ): Observable<PaginatedHttpResponse<Car>> {
    const limit = pageSize;
    const offset = pageIndex * pageSize;

    return of({
      resources: this.mockCars,
      limit,
      offset,
      total: this.mockCars.length,
    });
  }

  getById(id: string): Observable<Car> {
    return of(this.mockCars[0]);
  }

  add(car: EditCar): Observable<void> {
    return of();
  }

  edit(id: string, car: EditCar): Observable<void> {
    return of();
  }

  delete(id: string): Observable<void> {
    return of();
  }

  returnCar(id: string): Observable<void> {
    return of();
  }

  rentCar(id: string, client: ClientData): Observable<void> {
    return of();
  }
}
