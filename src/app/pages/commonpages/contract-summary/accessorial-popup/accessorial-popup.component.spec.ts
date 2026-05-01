import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorialPopupComponent } from './accessorial-popup.component';

describe('AccessorialPopupComponent', () => {
  let component: AccessorialPopupComponent;
  let fixture: ComponentFixture<AccessorialPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessorialPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessorialPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
