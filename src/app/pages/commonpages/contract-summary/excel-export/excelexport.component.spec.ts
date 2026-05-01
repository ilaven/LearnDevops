import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcelExport } from './excelexport.component';


describe('FilterscreenComponent', () => {
  let component: ExcelExport;
  let fixture: ComponentFixture<ExcelExport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelExport ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelExport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
