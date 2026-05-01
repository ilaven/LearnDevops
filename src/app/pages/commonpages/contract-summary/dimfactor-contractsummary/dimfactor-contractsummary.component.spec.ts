import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimfactorContractsummaryComponent } from './dimfactor-contractsummary.component';

describe('DiscountContractsummaryComponent', () => {
  let component: DimfactorContractsummaryComponent;
  let fixture: ComponentFixture<DimfactorContractsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DimfactorContractsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DimfactorContractsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
