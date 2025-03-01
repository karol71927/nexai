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
  {
    path: '404',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: 'no-internet',
    loadComponent: () =>
      import('./no-internet/no-internet.component').then(
        (m) => m.NoInternetComponent
      ),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
