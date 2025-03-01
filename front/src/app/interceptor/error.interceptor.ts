import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 404) {
        router.navigate(['/404']);
      } else if (error.status === 0) {
        router.navigate(['/no-internet']);
      } else {
        snackBar.open('Ups, coś poszło nie tak', 'Zamknij', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      }

      throw error;
    })
  );
};
