import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FedexDashboardComponent } from './dashboard/dashboard.component';
import { FedexCostOptimizationComponent } from './cost-optimization/cost-optimization.component';
import { FedexcarriertreandsinsightComponent } from './carrier-trends-insights/carrier-trends-insights.component';
import { FedexServicelevelUsageSummaryComponent } from './servicelevel-usage-summary/servicelevel-usage-summary.component';
import { FedexReportHistoryComponent } from './report-history/report-history.component';
import { FedExZoneDistributionComponent } from './zone-distribution/zone-distribution.component';
import { FedExEditProfileComponent } from './edit-profile/editprofilecomponent';
import { FedexAccountnumberComponent } from './accountnumber/accountnumber.component';
import { CompareAnalysisComponent } from 'src/app/shared/compare-analysis/compare-analysis.component';
import { UpsDetailsReportEditComponent } from '../UPS/detailsreport-edit/detailsreport-edit.component';
import { UpsUserLogPopupComponent } from '../UPS/user-log-popup/user-log-popup.component';
import { UpsActiveUsersPopupComponent } from '../UPS/active-users-popup/active-users-popup.component';
import { ContractAnalysisReviewComponent } from '../UPS/contract-analysis-review/contract-analysis-review.component';
import { RevenueBandReviewComponent } from '../UPS/revenue-band-review/revenue-band-review.component';
import { UpsAverageDiscountComponent } from '../UPS/average-discount/average-discount.component';
import { UpsSetupComponent } from '../UPS/setup/setup.component';
import { FedexChargeDescriptionComponent } from './charge-description/charge-description.component';
import { FedexDetailReportsComponent } from './detail-reports/detail-reports.component';
import { TrackingComponent } from '../UPS/tracking/tracking.component';
import { ManageAutomateReportComponent } from './manage-automate-report/manage-automate-report.component';
import { FedexShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';
import { FedExInternationalComponent } from './international/international.component';
import { FedExDomesticComponent } from './domestic/domestic.component';
import { UpsContractSummaryComponent } from '../commonpages/contract-summary/contract-summary.component';
//import { FedexContractSummaryComponent } from './contract-summary/contract-summary.component';
import { GRIComponent } from '../commonpages/general-rate-increase/general-rate-increase.component';

const routes: Routes = [
    { path: 'dashboard', component: FedexDashboardComponent },
    // {
    //   path: "cost-optimization",
    //   component: FedExCarrierTrendsInsightsComponent
    // },   
    { path: 'cost-optimization', component: FedexCostOptimizationComponent },

    { path: 'carrier-trends-insights', component: FedexcarriertreandsinsightComponent },

    { path: 'servicelevel-usage-summary', component: FedexServicelevelUsageSummaryComponent },

    { path: 'charge-description', component: FedexChargeDescriptionComponent },

    { path: 'graphicmap/domestic', component: FedExDomesticComponent },

    { path: 'graphicmap/international', component: FedExInternationalComponent },

    { path: 'zone-distribution', component: FedExZoneDistributionComponent },

    { path: 'detail-reports', component: FedexDetailReportsComponent },

    { path: 'report-history', component: FedexReportHistoryComponent },

   { path: 'contract-summary', component: UpsContractSummaryComponent },

{ path: 'general-rate-increase', component: GRIComponent },

    { path: 'settings/accountnumber', component: FedexAccountnumberComponent },

    // { path: 'settings/plannumber', component: FedExPlannumberComponent },

    // { path: 'admin/total-spend-by-customers', component: FedExAdminMenuControlComponent },
    { path: 'admin/setup', component: UpsSetupComponent },
    { path: 'admin/average-discount', component: UpsAverageDiscountComponent },
    { path: 'settings/editprofile', component: FedExEditProfileComponent, data: { bodyClass: 'fedex-edit-profile' } },
    { path: 'compareanalysis', component: CompareAnalysisComponent },
    { path: 'compareanalysis/:id', component: CompareAnalysisComponent },
    { path: 'admin/detailsreport-edit', component: UpsDetailsReportEditComponent },
    { path: 'admin/UserLogPopup', component: UpsUserLogPopupComponent },
    { path: 'admin/activeUsersPopup', component: UpsActiveUsersPopupComponent },
    { path: 'admin/contract-analysis-review', component: ContractAnalysisReviewComponent },
    { path: 'admin/revenue-band-review', component: RevenueBandReviewComponent },
    { path: 'manage-automatereport', component: ManageAutomateReportComponent },
    { path: 'tracking', component: FedexShipmentDetailSearchComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FedExRoutingModule { }
