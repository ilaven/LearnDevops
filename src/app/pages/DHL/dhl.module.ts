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
import { SchedularPopup } from './detail-reports/schedularpopup/schedular-popup.component';
import { DatePipe } from '@angular/common';
import { DHLRoutingModule } from './dhl-routing.module';
import { DhlDashboardComponent } from './dashboard/dashboard.component';
import { DhlChargeDescPopupComponent } from './popup/dhl-charge-desc-popup/dhl-charge-desc-popup.component';
import { DhlMoreServicePopupComponent } from './popup/dhl-more-service-popup/dhl-more-service-popup.component';
import { DhlServiceByWeightPopupComponent } from './popup/dhl-weight-dist-popup/dhl-Serviceby-weight/dhl-serviceby-weight.component';
import { DhlWeightDistPopupComponent } from './popup/dhl-weight-dist-popup/dhl-weight-dist-popup.component';
import { DhlZonePopupComponent } from './popup/dhl-zone-popup/dhl-zone-popup.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DhlAccountnumberComponent } from './accountnumber/accountnumber.component';
import { DhlEditProfileComponent } from './edit-profile/editprofilecomponent';
import { DHLReportHistoryComponent } from './report-history/report-history.component';
import { DhlDetailReportsComponent } from './detail-reports/detail-reports.component';
import { DhlReportLogComponent } from './detail-reports/report-log/report-log.component';
import { SchedularEditComponent } from './detail-reports/schedular-edit/schedular-edit.component';
import { MailPopupComponent } from './detail-reports/mail-popup/mail-popup.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DhlChargeDescriptionComponent } from './charge-description/charge-description.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DhlShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';
import { DhlTrackingPopupComponent } from './shipment-detail-search/tracking-popup/tracking-popup.component';


@NgModule({
  declarations: [
    DhlWeightDistPopupComponent, DhlServiceByWeightPopupComponent,
    DhlZonePopupComponent, DhlChargeDescPopupComponent, DhlMoreServicePopupComponent,
    DhlDashboardComponent,
    DhlAccountnumberComponent,
    DhlEditProfileComponent,
    DHLReportHistoryComponent,
    DhlDetailReportsComponent,
    DhlReportLogComponent,
    SchedularEditComponent,
    MailPopupComponent,
    DhlChargeDescriptionComponent,
    DhlShipmentDetailSearchComponent,
    DhlTrackingPopupComponent,
    SchedularPopup
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
    DHLRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule, MatRadioModule, MatCardModule, MatSlideToggleModule, MatTooltipModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DhlModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
