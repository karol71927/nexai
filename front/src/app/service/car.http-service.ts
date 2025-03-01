import { map, Observable, of } from 'rxjs';
import { Car } from '../types/car.type';
import { Injectable } from '@angular/core';
import { EditCar } from '../types/edit-car.type';
import { ClientData } from '../types/client-data.type';
import { PaginatedHttpResponse } from '../types/paginated-http-response.type';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CarHttpResponse } from './http-response/car.http-response';

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

  constructor(private readonly client: HttpClient) {}

  getAvailableBrands(): Observable<string[]> {
    return this.client
      .get<{ name: string }[]>(`${environment.baseUrl}/brands`)
      .pipe(map((response) => response.map((brand) => brand.name)));
  }

  getList(
    pageIndex = 0,
    pageSize = 10
  ): Observable<PaginatedHttpResponse<Car>> {
    const limit = pageSize;
    const offset = pageIndex * pageSize;

    return this.client
      .get<PaginatedHttpResponse<CarHttpResponse>>(
        `${environment.baseUrl}/cars`,
        {
          params: {
            limit,
            offset,
          },
        }
      )
      .pipe(
        map((response) => {
          return {
            ...response,
            resources: response.resources.map(this.mapCarHttpResponseToCar),
          };
        })
      );
  }

  getById(id: string): Observable<Car> {
    return this.client
      .get<CarHttpResponse>(`${environment.baseUrl}/cars/${id}`)
      .pipe(map(this.mapCarHttpResponseToCar));
  }

  add(car: EditCar): Observable<void> {
    return this.client
      .post(`${environment.baseUrl}/cars`, car)
      .pipe(map(() => {}));
  }

  edit(id: string, car: Partial<EditCar>): Observable<void> {
    return this.client
      .patch(`${environment.baseUrl}/cars/${id}`, car)
      .pipe(map(() => {}));
  }

  delete(id: string): Observable<void> {
    return this.client
      .delete(`${environment.baseUrl}/cars/${id}`)
      .pipe(map(() => {}));
  }

  returnCar(id: string): Observable<void> {
    return this.client
      .delete(`${environment.baseUrl}/cars/${id}/clients`)
      .pipe(map(() => {}));
  }

  rentCar(id: string, client: ClientData): Observable<void> {
    return this.client
      .patch(`${environment.baseUrl}/cars/${id}/clients`, client)
      .pipe(map(() => {}));
  }

  private mapCarHttpResponseToCar(response: CarHttpResponse): Car {
    return {
      id: response.id,
      brand: response.brand,
      clientEmail: response.client?.email,
      clientAddress: response.client?.address,
      vin: response.vin,
      registrationNumber: response.registrationNumber,
      isRented: response.isRented,
      currentLocation: response.location,
    };
  }
}
