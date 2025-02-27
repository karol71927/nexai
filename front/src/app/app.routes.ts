import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./car-list/car-list.component').then((m) => m.CarListComponent),
  },
  {
    path: 'car/create',
    loadComponent: () =>
      import('./car-edit/car-edit.component').then((m) => m.CarEditComponent),
  },
  {
    path: 'car/:id',
    loadComponent: () =>
      import('./car-edit/car-edit.component').then((m) => m.CarEditComponent),
  },
];
