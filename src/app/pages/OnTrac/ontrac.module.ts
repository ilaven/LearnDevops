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
import { OnTracRoutingModule } from './ontrac-routing.module';
import { OntracDashboardComponent } from './dashboard/dashboard.component';
import { OntracChargeDescPopupComponent } from './popup/ontrac-charge-desc-popup/ontrac-charge-desc-popup.component';
import { OntracMoreServicePopupComponent } from './popup/ontrac-more-service-popup/ontrac-more-service-popup.component';
import { OntracServiceByWeightPopupComponent } from './popup/ontrac-weight-dist-popup/ontrac-Serviceby-weight/ontrac-serviceby-weight.component';
import { OntracWeightDistPopupComponent } from './popup/ontrac-weight-dist-popup/ontrac-weight-dist-popup.component';
import { OntracZonePopupComponent } from './popup/ontrac-zone-popup/ontrac-zone-popup.component';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OnTracEditProfileComponent } from './edit-profile/editprofilecomponent';
import { OnTracAccountnumberComponent } from './accountnumber/accountnumber.component';
import { ontracSetupComponent } from './setup/setup.component';
import { OntracCarrierTrendsInsightComponent } from './carrier-trends-insights/carrier-trends-insights.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OnTracZoneDistributionComponent } from './zone-distribution/zone-distribution.component';
import { OnTracReportHistoryComponent } from './report-history/report-history.component';
import { OnTracDetailReportsComponent } from './detail-reports/detail-reports.component';
import { OnTracReportLogComponent } from './detail-reports/report-log/report-log.component';
import { SchedularEditComponent } from './detail-reports/schedular-edit/schedular-edit.component';
import { SchedularPopup } from './detail-reports/schedularpopup/schedular-popup.component';
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
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { OnTracChargeDescriptionComponent} from './charge-description/charge-description.component';
import { OntracTrackingPopupComponent } from './shipment-detail-search/tracking-popup/tracking-popup.component';
import { OntracShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';

@NgModule({
  declarations: [
    OntracWeightDistPopupComponent, OntracServiceByWeightPopupComponent, OntracZonePopupComponent, OntracChargeDescPopupComponent, OntracMoreServicePopupComponent,
    OntracDashboardComponent,
    OnTracEditProfileComponent,
    OnTracAccountnumberComponent,
    ontracSetupComponent,
    OnTracAccountnumberComponent,
    OntracCarrierTrendsInsightComponent,
    OnTracZoneDistributionComponent,
    OnTracReportHistoryComponent,
    OnTracDetailReportsComponent,
    OnTracReportLogComponent,
    SchedularEditComponent,
    SchedularPopup,
    MailPopupComponent,
    OnTracChargeDescriptionComponent,
    OntracTrackingPopupComponent,
    OntracShipmentDetailSearchComponent,
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
    OnTracRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatIconModule, MatRadioModule, MatCardModule, MatSlideToggleModule,
    NgxMatSelectSearchModule, MatTabsModule,
    MatDialogModule,
    MatExpansionModule,
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OntracModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
