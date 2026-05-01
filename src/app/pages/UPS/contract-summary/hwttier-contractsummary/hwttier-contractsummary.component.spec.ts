import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HundredweightTierComponent } from './hwttier-contractsummary.component';

describe('DiscountContractsummaryComponent', () => {
  let component: HundredweightTierComponent;
  let fixture: ComponentFixture<HundredweightTierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HundredweightTierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HundredweightTierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
