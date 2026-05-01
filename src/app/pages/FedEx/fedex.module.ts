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
import { FedExRoutingModule } from './fedex-routing.module';
import { FedexAccountnumberComponent } from './accountnumber/accountnumber.component';
import { EditAccountNumberComponent } from './accountnumber/edit-account-number/edit-account-number.component';
import { FedexChargeDescPopupComponent } from './popup/fedex-charge-desc-popup/fedex-charge-desc-popup.component';
import { FedexMoreServicePopupComponent } from './popup/fedex-more-service-popup/fedex-more-service-popup.component';
import { FedexServiceByWeightPopupComponent } from './popup/fedex-weight-dist-popup/fedex-Serviceby-weight/fedex-serviceby-weight.component';
import { FedexWeightDistPopupComponent } from './popup/fedex-weight-dist-popup/fedex-weight-dist-popup.component';
import { FedexZonePopupComponent } from './popup/fedex-zone-popup/fedex-zone-popup.component';
import { FedexDashboardComponent } from './dashboard/dashboard.component';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatFormField } from '@angular/material/form-field';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FedexCostOptimizationComponent } from './cost-optimization/cost-optimization.component';
import { FedexcarriertreandsinsightComponent } from './carrier-trends-insights/carrier-trends-insights.component';
import { FedexServicelevelUsageSummaryComponent } from './servicelevel-usage-summary/servicelevel-usage-summary.component';
import { FedexReportHistoryComponent } from './report-history/report-history.component';
import { FedExZoneDistributionComponent } from './zone-distribution/zone-distribution.component';
import { FedexReportLogComponent } from './detail-reports/report-log/report-log.component';
import { SchedularPopup } from './detail-reports/schedularpopup/schedular-popup.component';
import { SchedularEditComponent } from './detail-reports/schedular-edit/schedular-edit.component';
import { MailPopupComponent } from './detail-reports/mail-popup/mail-popup.component';
import { FedexDetailReportsComponent } from './detail-reports/detail-reports.component';
import { FedexChargeDescriptionComponent } from './charge-description/charge-description.component';
import { CarrierAgreementSavingsComponent } from './carrier-agreement-savings/carrier-agreement-savings.component';
import { CarrierAgreementSavingsPopup } from './carrier-agreement-savings/carrier-agreement-savings-popup/carrier-agreement-savings-popup.component';
import { DetailSavingsPopup } from './carrier-agreement-savings/detail-savings-popup/detail-savings-popup.component';
import { CarrierAgreementNotificationComponent } from './carrier-agreement-savings/carrier-agrement-notification/carrier-agreement-savings.component';
import { FedExEditProfileComponent } from './edit-profile/editprofilecomponent';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ManageAutomateReportComponent } from './manage-automate-report/manage-automate-report.component';
import { AutomateReportAddComponent } from './manage-automate-report/report-add-popup/report-add.component';
import { ReportStatusPopupComponent } from './manage-automate-report/report-status/report-status.component';
import { RecipientsdetailsPopupComponent } from './manage-automate-report/recipients-add/recipients-add.component';
import { AutomateClientdetailsPopupComponent } from './manage-automate-report/automate-clientdetails-popup/automate-clientdetails-popup.component';
import { FedexShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';
import { FedexTrackingPopupComponent } from './shipment-detail-search/tracking-popup/tracking-popup.component';
import { FedExInternationalComponent } from './international/international.component';
import { FedexInternationalPopupComponent } from './popup/international-popup/international-popup.component';
import { FedExDomesticComponent } from './domestic/domestic.component';
import { CommonPagesModule } from '../commonpages/commonpages.module';
 
@NgModule({
  declarations: [
    FedexDashboardComponent,
    FedexWeightDistPopupComponent, FedexServiceByWeightPopupComponent, FedexZonePopupComponent,
    FedexChargeDescPopupComponent, FedexMoreServicePopupComponent, FedexCostOptimizationComponent, FedexcarriertreandsinsightComponent, FedexServicelevelUsageSummaryComponent
    , FedexReportHistoryComponent, FedExZoneDistributionComponent, FedexReportLogComponent, SchedularPopup,
    SchedularEditComponent,
    MailPopupComponent,
    FedexDetailReportsComponent,
    FedexChargeDescriptionComponent,
    CarrierAgreementSavingsComponent,
    CarrierAgreementSavingsPopup,
    DetailSavingsPopup,
    CarrierAgreementNotificationComponent,
    FedexAccountnumberComponent,
    EditAccountNumberComponent,
    FedExEditProfileComponent,
    ManageAutomateReportComponent,
    AutomateReportAddComponent,
    ReportStatusPopupComponent,
    RecipientsdetailsPopupComponent,
    AutomateClientdetailsPopupComponent,
    FedexShipmentDetailSearchComponent,
    FedexTrackingPopupComponent,
    FedExInternationalComponent,
    FedexInternationalPopupComponent,
    FedExDomesticComponent
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
    FedExRoutingModule,
    SharedModule,
    MatCheckboxModule,
    MatIconModule, MatRadioModule, MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule, MatRadioModule, MatCardModule, MatSlideToggleModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatTooltipModule,
    NgxMatSelectSearchModule,CommonPagesModule
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FedExModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
