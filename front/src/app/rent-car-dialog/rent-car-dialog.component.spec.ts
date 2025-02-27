import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarDialogComponent } from './rent-car-dialog.component';

describe('RentCarDialogComponent', () => {
  let component: RentCarDialogComponent;
  let fixture: ComponentFixture<RentCarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentCarDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
