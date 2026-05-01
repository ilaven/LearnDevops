import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsummarydiscountComponent } from './contractsummarydiscount.component';

describe('ContractsummarydiscountComponent', () => {
  let component: ContractsummarydiscountComponent;
  let fixture: ComponentFixture<ContractsummarydiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsummarydiscountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsummarydiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
