import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { Car } from '../types/car.type';
import { CarHttpService } from '../service/car.http-service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { RentCarDialogComponent } from '../rent-car-dialog/rent-car-dialog.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatPaginatorModule,
    SearchComponent,
  ],
  templateUrl: './car-list.component.html',
  styleUrl: './car-list.component.css',
})
export class CarListComponent implements OnInit {
  displayedColumns: { property: string; name: string }[] = [
    { property: 'brand', name: 'Marka' },
    { property: 'clientEmail', name: 'Email klienta' },
    { property: 'clientAddress', name: 'Adres klienta' },
    { property: 'vin', name: 'Numer VIN' },
    { property: 'registrationNumber', name: 'Numer rejestracyjny' },
    { property: 'isRented', name: 'W wypożyczeniu' },
    { property: 'currentLocation', name: 'Aktualna lokacja' },
  ];

  displayedColumnProperties = [
    ...this.displayedColumns.map((column) => column.property),
    'actions',
  ];

  pagination: {
    size: number;
    sizeOptions: number[];
    pageIndex: number;
    length: number;
  } = {
    size: 10,
    sizeOptions: [5, 10, 25, 100],
    pageIndex: 0,
    length: 0,
  };

  search: string | null = null;

  cars!: Observable<Car[]>;

  constructor(
    private readonly carHttpService: CarHttpService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCars();
  }

  onEditCar(car: Car): void {
    this.router.navigate(['car', car.id]);
  }

  onDeleteCar(car: Car): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Usuwanie samochodu',
        message: `Czy na pewno chcesz usunąć samochód ${car.brand}?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.carHttpService.delete(car.id);
          }

          return of(null);
        })
      )
      .subscribe(() => {
        this.getCars();
      });
  }

  onAddCar(): void {
    this.router.navigate(['car', 'create']);
  }

  onReturnCar(car: Car): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Zwrot samochodu',
        message: `Czy na pewno chcesz zwrócić samochód ${car.brand}?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.carHttpService.returnCar(car.id);
          }

          return of(null);
        })
      )
      .subscribe(() => {
        this.getCars();
      });
  }

  onRentCar(car: Car): void {
    const dialogRef = this.dialog.open(RentCarDialogComponent);

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result) => {
          if (result) {
            return this.carHttpService.rentCar(car.id, result);
          }

          return of(null);
        })
      )
      .subscribe(() => {
        this.getCars();
      });
  }

  handlePageEvent(event: PageEvent): void {
    if (event.pageIndex !== this.pagination.pageIndex) {
      this.pagination.pageIndex = event.pageIndex;
    }

    if (event.pageSize !== this.pagination.size) {
      this.pagination.size = event.pageSize;
      this.pagination.pageIndex = 0;
    }

    this.getCars();
  }

  onSearch(search: string | null): void {
    this.search = search;
    this.getCars();
  }

  private getCars(): void {
    this.cars = this.carHttpService
      .getList(this.pagination.pageIndex, this.pagination.size, this.search)
      .pipe(
        tap((response) => {
          this.pagination.length = response.total;
          if (
            response.resources.length === 0 &&
            this.pagination.pageIndex > 0
          ) {
            this.pagination.pageIndex = 0;
            this.getCars();
          }
          this.changeDetectorRef.detectChanges();
        }),
        map((response) => response.resources)
      );
  }
}
