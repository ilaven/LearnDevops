import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';

// Ng Select
import { NgSelectModule } from '@ng-select/ng-select';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { SharedModule } from '../../shared/shared.module';

import { DatePipe } from '@angular/common';
import { USPSRoutingModule } from './usps-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { USPSDashboardComponent } from './dashboard/dashboard.component';
import { UspsEditProfileComponent } from './edit-profile/editprofilecomponent';
import { UspsSetupComponent } from './setup/setup.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UspsDetailReportsComponent } from './detail-reports/detail-reports.component';
import { UspsReportLogComponent } from './detail-reports/report-log/report-log.component';
import { SchedularEditComponent } from './detail-reports/schedular-edit/schedular-edit.component';
import { SchedularPopup } from './detail-reports/schedularpopup/schedular-popup.component';
import { UspsReportHistoryComponent } from './report-history/report-history.component';
import { MailPopupComponent } from './detail-reports/mail-popup/mail-popup.component';
import { UspsChargeDescriptionComponent } from './charge-description/charge-description.component';
import { USPSShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';
import { TrackingUSPSPopupComponent } from './shipment-detail-search/tracking-popup/tracking-popup.component';

@NgModule({
  declarations: [
    USPSDashboardComponent,
    UspsEditProfileComponent,
    UspsSetupComponent,
    UspsEditProfileComponent,
    UspsDetailReportsComponent,
    UspsReportLogComponent,
    SchedularEditComponent,
    SchedularPopup,
    UspsReportHistoryComponent,
    MailPopupComponent,
    UspsChargeDescriptionComponent,
    USPSShipmentDetailSearchComponent,
    TrackingUSPSPopupComponent,
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
    USPSRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule, MatRadioModule, MatCardModule, MatSlideToggleModule, MatTooltipModule


  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UspsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
