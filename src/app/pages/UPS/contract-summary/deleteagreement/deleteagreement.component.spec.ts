import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterscreenComponent } from './filterscreen.component';

describe('FilterscreenComponent', () => {
  let component: FilterscreenComponent;
  let fixture: ComponentFixture<FilterscreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterscreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
