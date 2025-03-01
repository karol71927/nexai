import { Component } from '@angular/core';
import { CarHttpService } from '../service/car.http-service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Car } from '../types/car.type';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-car-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    AsyncPipe,
  ],
  templateUrl: './car-edit.component.html',
  styleUrl: './car-edit.component.css',
})
export class CarEditComponent {
  form: FormGroup = new FormGroup({
    brand: new FormControl('', [Validators.required]),
    vin: new FormControl('', [Validators.required]),
    registrationNumber: new FormControl('', [Validators.required]),
  });
  brands: Observable<string[]>;
  private action: 'create' | 'edit' = 'create';
  private carId: string;

  constructor(
    private readonly carHttpService: CarHttpService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        tap((params) => {
          if (params['id']) {
            this.action = 'edit';
            this.carId = params['id'];
          }
        }),
        map((params) => {
          const carId = params['id'] as string;
          return carId;
        }),
        switchMap((carId) => {
          if (!carId) {
            return of(null);
          }

          return this.carHttpService.getById(carId);
        })
      )
      .subscribe((car) => {
        if (car) {
          this.form.patchValue(car);
        }
      });

    this.brands = this.carHttpService.getAvailableBrands();
  }

  onSave(): void {
    if (this.form.invalid) {
      return;
    }

    const car: Car = this.form.value;

    if (this.action === 'create') {
      this.carHttpService.add(car).subscribe(() => {
        this.goBack();
      });
    } else {
      this.carHttpService.edit(this.carId, car).subscribe(() => {
        this.goBack();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['../..']);
  }
}
