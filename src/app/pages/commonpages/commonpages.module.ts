import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../shared/shared.module';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// Components
import { GRIComponent } from './general-rate-increase/general-rate-increase.component';
import { AccessorialGRIComponent } from './general-rate-increase/accessorial-gri/accessorial-gri.component';
import { CreateProposalGRIComponent } from './general-rate-increase/create-proposal-gri/create-proposal-gri.component';
import { DashBoardSaveAlertGRIComponent } from './general-rate-increase/dasboard-save-alert-gri/dashboard-save-alert-gri.component';
import { DeleteAgreementGRIComponent } from './general-rate-increase/deleteagreement-gri/deleteagreement-gri.component';
import { DimfactorGRIComponent } from './general-rate-increase/dimfactor-gri/dimfactor-gri.component';
import { DiscountGRIComponent } from './general-rate-increase/discount-gri/discount-gri.component';
import { DownloadGRIComponent } from './general-rate-increase/download-GRI/download-GRI.component';
import { ExcelExportGRI } from './general-rate-increase/excel-export-gri/excelexport-gri.component';
import { FilterscreenGRIComponent } from './general-rate-increase/filterscreen-gir/filterscreen-gir.component';
import { HundredweightTierGRIComponent } from './general-rate-increase/hwttier-gri/hwttier-gri.component';
import { MinReductionGRIComponent } from './general-rate-increase/minreduction-gri/minreduction-gri.component';
import { ResetPopupGRIComponent } from './general-rate-increase/reset-popup-gri/reset-popup-gri.component';
import { AccessorialPopupGRIComponent } from './general-rate-increase/accessorial-popup-gri/accessorial-popup-gri.component';
import { GRIHWTAccountNumberUpdate } from './general-rate-increase/hwt-accountnumber-update/hwt-accountnumber-update.component';
import { GRIdiscountComponent } from './general-rate-increase/gri-discount/gri-discount.component';
import { MinreductiondetailGRIComponent } from './general-rate-increase/minreduction-gri/minreductiondetail-gri/minreductiondetail-gri.component';
import { NoteDialogGRIComponent } from './general-rate-increase/note-dialog-gri/note-dialog-gri-component';

import { AccessorialContractsummaryComponent } from './contract-summary/accessorial-contractsummary/accessorial-contractsummary.component';
import { AccessorialPopupComponent } from './contract-summary/accessorial-popup/accessorial-popup.component';
import { UpsContractSummaryComponent } from './contract-summary/contract-summary.component';
import { ContractsummarydiscountComponent } from './contract-summary/contractsummarydiscount/contractsummarydiscount.component';
import { CreateProposalComponent } from './contract-summary/create-proposal/create-proposal.component';
import { DashBoardSaveAlertComponent } from './contract-summary/dasboard-save-alert/dashboard-save-alert.component';
import { DeleteAgreementComponent } from './contract-summary/deleteagreement/deleteagreement.component';
import { DimfactorContractsummaryComponent } from './contract-summary/dimfactor-contractsummary/dimfactor-contractsummary.component';
import { DiscountContractsummaryComponent } from './contract-summary/discount-contractsummary/discount-contractsummary.component';
import { ExcelExport } from './contract-summary/excel-export/excelexport.component';
import { FilterscreenComponent } from './contract-summary/filterscreen/filterscreen.component';
import { HundredweightTierComponent } from './contract-summary/hwttier-contractsummary/hwttier-contractsummary.component';
import { MinReductionContractsummaryComponent } from './contract-summary/minreduction-contractsummary/minreduction-contractsummary.component';
import { MinreductiondetailComponent } from './contract-summary/minreduction-contractsummary/minreductiondetail/minreductiondetail.component';
import { NoteDialogComponent } from './contract-summary/note-dialog/note-dialog-component';
import { ResetPopupComponent } from './contract-summary/reset-popup/reset-popup.component';

const COMPONENTS = [
  UpsContractSummaryComponent,
  AccessorialContractsummaryComponent,
  CreateProposalComponent,
  DashBoardSaveAlertComponent,
  DeleteAgreementComponent,
  DimfactorContractsummaryComponent,
  DiscountContractsummaryComponent,
  ExcelExport,
  FilterscreenComponent,
  HundredweightTierComponent,
  MinReductionContractsummaryComponent,
  NoteDialogComponent,
  ResetPopupComponent,
  ContractsummarydiscountComponent,
  AccessorialPopupComponent,
  MinreductiondetailComponent,
  GRIComponent,
  AccessorialGRIComponent,
  CreateProposalGRIComponent,
  DashBoardSaveAlertGRIComponent,
  DeleteAgreementGRIComponent,
  DimfactorGRIComponent,
  DiscountGRIComponent,
  DownloadGRIComponent,
  ExcelExportGRI,
  FilterscreenGRIComponent,
  HundredweightTierGRIComponent,
  MinReductionGRIComponent,
  ResetPopupGRIComponent,
  AccessorialPopupGRIComponent,
  GRIHWTAccountNumberUpdate,
  GRIdiscountComponent,
  MinreductiondetailGRIComponent,
  NoteDialogGRIComponent
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FlatpickrModule,
    NgSelectModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    DragDropModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTooltipModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    ...COMPONENTS
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonPagesModule { }
