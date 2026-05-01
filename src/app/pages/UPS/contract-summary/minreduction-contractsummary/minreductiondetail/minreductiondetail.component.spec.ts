import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinreductiondetailComponent } from './minreductiondetail.component';

describe('MinreductiondetailComponent', () => {
  let component: MinreductiondetailComponent;
  let fixture: ComponentFixture<MinreductiondetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinreductiondetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinreductiondetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
