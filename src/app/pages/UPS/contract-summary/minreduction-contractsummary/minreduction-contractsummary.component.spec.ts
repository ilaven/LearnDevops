import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinReductionContractsummaryComponent } from './minreduction-contractsummary.component';

describe('MinReductionContractsummaryComponent', () => {
  let component: MinReductionContractsummaryComponent;
  let fixture: ComponentFixture<MinReductionContractsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinReductionContractsummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinReductionContractsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
