import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountContractsummaryComponent } from './discount-contractsummary.component';

describe('DiscountContractsummaryComponent', () => {
  let component: DiscountContractsummaryComponent;
  let fixture: ComponentFixture<DiscountContractsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscountContractsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountContractsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
