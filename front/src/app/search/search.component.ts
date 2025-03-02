import { Component, OnDestroy, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Subject,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm = new FormGroup({
    search: new FormControl<string>(''),
  });

  search = output<string | null>();

  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(500),
        map((value) => value.search),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((value) => {
        this.search.emit(value ?? null);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
