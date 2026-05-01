import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPopupComponent } from './reset-popup.component';

describe('ResetPopupComponent', () => {
  let component: ResetPopupComponent;
  let fixture: ComponentFixture<ResetPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
