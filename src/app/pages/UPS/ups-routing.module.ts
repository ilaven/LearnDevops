import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpsCostOptimizationComponent } from './cost-optimization/cost-optimization.component';
import { UpsAccountnumberComponent } from './accountnumber/accountnumber.component';
import { UpsActiveUsersPopupComponent } from './active-users-popup/active-users-popup.component';
import { UpsAdminMenuControlComponent } from './admin-menu-control/admin-menu-control.component';
import { UpsAverageDiscountComponent } from './average-discount/average-discount.component';
import { UpsChargeDescriptionComponent } from './charge-description/charge-description.component'; 
import { UpsDetailReportsComponent } from './detail-reports/detail-reports.component';
import { UpsDomesticComponent } from './domestic/domestic.component';
import { UpsExecutiveManagementComponent } from './executive-management/executive-management.component';
import { GRIComponent } from '../commonpages/general-rate-increase/general-rate-increase.component';
import { UpsInternationalComponent } from './international/international.component';
import { UpsPlannumberComponent } from './plannumber/plannumber.component';
import { UpsReportHistoryComponent } from './report-history/report-history.component';
import { UpsServicelevelUsageSummaryComponent } from './servicelevel-usage-summary/servicelevel-usage-summary.component';
import { UpsSetupComponent } from './setup/setup.component';
import { UpsUserLogPopupComponent } from './user-log-popup/user-log-popup.component';
import { UpsZoneDistributionComponent } from './zone-distribution/zone-distribution.component';
import { UpsDashboardComponent } from './dashboard/dashboard.component';
import { UPScarriertreandsinsightComponent } from './carrier-trends-insights/carrier-trends-insights.component';
import { UpsDetailsReportEditComponent } from './detailsreport-edit/detailsreport-edit.component';
import { UpsEditProfileComponent } from './edit-profile/editprofilecomponent';
import { UpsReportmenuAccessComponent } from './reportmenu-access/reportmenu-access.component';
import { UpsTotalSpenByCustomersdComponent } from './total-spen-by-customersd/total-spen-by-customersd.component';
import { UserMenuControl } from './user-menu-control/user-menu-control.component';
import { CarrierAgreementSavingsComponent } from './carrier-agreement-savings/carrier-agreement-savings.component';
import { CarrierAgreementNotificationComponent } from './carrier-agreement-savings/carrier-agrement-notification/carrier-agreement-savings.component';
import { CompareAnalysisComponent } from 'src/app/shared/compare-analysis/compare-analysis.component';
import { ContractAnalysisReviewComponent } from './contract-analysis-review/contract-analysis-review.component';
import { RevenueBandReviewComponent } from './revenue-band-review/revenue-band-review.component';// import { UpsContractSummaryComponent_UI } from './contract-summary1/contract-summary.component';
import { TrackingComponent } from './tracking/tracking.component';
import { ShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';
import { UpsContractSummaryComponent } from '../commonpages/contract-summary/contract-summary.component';

const routes: Routes = [
  // {
  //   path: "cost-optimization",
  //   component: UPSCarrierTrendsInsightsComponent
  // },   
  { path: 'dashboard', component: UpsDashboardComponent },

  { path: 'cost-optimization', component: UpsCostOptimizationComponent },

  { path: 'carrier-trends-insights', component: UPScarriertreandsinsightComponent },

  { path: 'executive-management', component: UpsExecutiveManagementComponent },

  { path: 'servicelevel-usage-summary', component: UpsServicelevelUsageSummaryComponent },

  { path: 'charge-description', component: UpsChargeDescriptionComponent },

  { path: 'graphicmap/domestic', component: UpsDomesticComponent },

  { path: 'graphicmap/international', component: UpsInternationalComponent },

  { path: 'zone-distribution', component: UpsZoneDistributionComponent },

  { path: 'detail-reports', component: UpsDetailReportsComponent },

  { path: 'report-history', component: UpsReportHistoryComponent },

  { path: 'contract-summary', component: UpsContractSummaryComponent },

  // { path: 'contract-summary-ui', component: UpsContractSummaryComponent_UI },

  { path: 'general-rate-increase', component: GRIComponent },

  { path: 'settings/accountnumber', component: UpsAccountnumberComponent },

  { path: 'settings/plannumber', component: UpsPlannumberComponent },

  { path: 'admin/total-spend-by-customers', component: UpsAdminMenuControlComponent },

  { path: 'admin/average-discount', component: UpsAverageDiscountComponent },

  { path: 'admin/setup', component: UpsSetupComponent },

  { path: 'admin/activeUsersPopup', component: UpsActiveUsersPopupComponent },

  { path: 'admin/UserLogPopup', component: UpsUserLogPopupComponent },

  { path: 'admin/total-spen-by-customersd', component: UpsTotalSpenByCustomersdComponent },

  { path: 'admin/adminmenuContrl', component: UserMenuControl },

  { path: 'admin/reportmenu-access', component: UpsReportmenuAccessComponent },

  { path: 'admin/detailsreport-edit', component: UpsDetailsReportEditComponent },

  { path: 'settings/editprofile', component: UpsEditProfileComponent, data: { bodyClass: 'ups-edit-profile' } },
  { path: 'upscarrier-agreement-savings', component: CarrierAgreementNotificationComponent },
  { path: 'compareanalysis', component: CompareAnalysisComponent },
  { path: 'compareanalysis/:id', component: CompareAnalysisComponent },
  { path: 'admin/contract-analysis-review', component: ContractAnalysisReviewComponent },
  { path: 'admin/revenue-band-review', component: RevenueBandReviewComponent },
  { path: 'tracking', component: ShipmentDetailSearchComponent },
  { path:'shipment-detail-search',component: TrackingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UPSRoutingModule { }
