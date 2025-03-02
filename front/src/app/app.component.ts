import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { fromEvent, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div style="padding: 20px"><router-outlet></router-outlet></div>`,
})
export class AppComponent implements OnInit {
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    )
      .pipe(startWith(navigator.onLine))
      .subscribe((online) => {
        if (online) {
          return;
        }
        this.router.navigate(['/no-internet']);
      });
  }
}
