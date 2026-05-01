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
import { UPSRoutingModule } from './ups-routing.module';
import { UpsAccountnumberComponent } from './accountnumber/accountnumber.component';
import { UpsActiveUsersPopupComponent } from './active-users-popup/active-users-popup.component';
import { UpsAdminMenuControlComponent } from './admin-menu-control/admin-menu-control.component';
import { UpsAverageDiscountComponent } from './average-discount/average-discount.component';
import { UpsChargeDescriptionComponent } from './charge-description/charge-description.component';
import { UpsZoneDistributionComponent } from './zone-distribution/zone-distribution.component';
import { UpsDashboardComponent } from './dashboard/dashboard.component';
import { ChargeDescPopupComponent } from './popup/charge-desc-popup/charge-desc-popup.component';
import { MoreServicePopupComponent } from './popup/more-service-popup/more-service-popup.component';
import { ServiceByWeightPopupComponent } from './popup/weight-dist-popup/Serviceby-weight/serviceby-weight.component';
import { WeightDistPopupComponent } from './popup/weight-dist-popup/weight-dist-popup.component';
import { ZonePopupComponent } from './popup/zone-popup/zone-popup.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserMenuControl } from './user-menu-control/user-menu-control.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { UpsEditProfileComponent } from "./edit-profile/editprofilecomponent"
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { EditAccountNumberComponent } from "./accountnumber/edit-account-number/edit-account-number.component";
import { EditReportmenuAccessComponent } from './reportmenu-access/edit-reportmenu-access/edit-reportmenu-access.component';
import { AverageDiscountSearchComponent } from "./average-discount/average-discount-search/average-discount-search.component";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { TotalSpenSearchComponent } from './total-spen-by-customersd/total-spen-search/total-spen-search.component';
import { CarrierAgreementSavingsPopup } from './carrier-agreement-savings/carrier-agreement-savings-popup/carrier-agreement-savings-popup.component';
import { CarrierAgreementSavingsComponent } from './carrier-agreement-savings/carrier-agreement-savings.component';
import { InternationalPopupComponent } from './popup/international-popup/international-popup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DetailSavingsPopup } from './carrier-agreement-savings/detail-savings-popup/detail-savings-popup.component';
import { UpsTotalSpenByCustomersdComponent } from './total-spen-by-customersd/total-spen-by-customersd.component';

import { ContractAnalysisReviewComponent } from './contract-analysis-review/contract-analysis-review.component';
import { ShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';
import { TrackingPopupComponent } from './shipment-detail-search/tracking-popup/tracking-popup.component';
import { CommonPagesModule } from '../commonpages/commonpages.module';
import { SchedularPopup } from './detail-reports/schedularpopup/schedular-popup.component';
import { UpsReportLogComponent } from './detail-reports/report-log/report-log.component';
import { SchedularEditComponent } from './detail-reports/schedular-edit/schedular-edit.component';
import { MailPopupComponent } from './detail-reports/mail-popup/mail-popup.component';
import { CarrierAgreementNotificationComponent } from './carrier-agreement-savings/carrier-agrement-notification/carrier-agreement-savings.component';
import { UpsCostOptimizationComponent } from './cost-optimization/cost-optimization.component';
import { UPScarriertreandsinsightComponent } from './carrier-trends-insights/carrier-trends-insights.component';
import { UpsDetailReportsComponent } from './detail-reports/detail-reports.component';
import { UpsDetailsReportEditComponent } from './detailsreport-edit/detailsreport-edit.component';
import { UpsDomesticComponent } from './domestic/domestic.component';
import { UpsExecutiveManagementComponent } from './executive-management/executive-management.component';
import { UpsInternationalComponent } from './international/international.component';
import { UpsPlannumberComponent } from './plannumber/plannumber.component';
import { UpsReportHistoryComponent } from './report-history/report-history.component';
import { UpsReportmenuAccessComponent } from './reportmenu-access/reportmenu-access.component';
import { UpsServicelevelUsageSummaryComponent } from './servicelevel-usage-summary/servicelevel-usage-summary.component';
import { UpsSetupComponent } from './setup/setup.component';
import { UpsUserLogPopupComponent } from './user-log-popup/user-log-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    WeightDistPopupComponent,
    ServiceByWeightPopupComponent, ZonePopupComponent,
    ChargeDescPopupComponent, MoreServicePopupComponent,
    UpsDashboardComponent,
    UPScarriertreandsinsightComponent,
    UpsAccountnumberComponent,
    UpsActiveUsersPopupComponent,
    UpsAdminMenuControlComponent,
    UpsAverageDiscountComponent,
    UpsCostOptimizationComponent,
    UpsChargeDescriptionComponent,
    UpsDetailReportsComponent,
    UpsDetailsReportEditComponent,
    UpsDomesticComponent,
    UpsExecutiveManagementComponent,
    UpsInternationalComponent,
    UpsPlannumberComponent,
    UpsReportHistoryComponent,
    UpsReportmenuAccessComponent,
    UpsServicelevelUsageSummaryComponent,
    UpsSetupComponent, UpsUserLogPopupComponent,
    UpsZoneDistributionComponent,
    UpsTotalSpenByCustomersdComponent,
    UserMenuControl,
    UpsEditProfileComponent,
    EditAccountNumberComponent,
    EditReportmenuAccessComponent,
    AverageDiscountSearchComponent,
    TotalSpenSearchComponent,
    CarrierAgreementSavingsComponent,
    CarrierAgreementSavingsPopup,
    InternationalPopupComponent,
    DetailSavingsPopup,
    SchedularPopup,
    UpsReportLogComponent,
    SchedularEditComponent,
    MailPopupComponent,
    CarrierAgreementNotificationComponent,
    ContractAnalysisReviewComponent,
    ShipmentDetailSearchComponent,
    TrackingPopupComponent
  ],
  imports: [
    MatMenuModule,
    MatTooltipModule,
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
    UPSRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    DragDropModule,
    MatIconModule, MatRadioModule, MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    NgxMatSelectSearchModule,
    CommonPagesModule
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UpsModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
