import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
 

const routes: Routes = [
  // {
  //   path: "cost-optimization",
  //   component: CarrierTrendsInsightsComponent
  // },   
  // { path: 'cost-optimization', component: CostOptimizationComponent },

  // { path: 'executive-management', component: ExecutiveManagementComponent },

  // { path: 'servicelevel-usage-summary', component: ServicelevelUsageSummaryComponent },

  // { path: 'charge-description', component: ChargeDescriptionComponent },

  // { path: 'graphicmap/domestic', component: DomesticComponent },

  // { path: 'graphicmap/international', component: InternationalComponent },

  // { path: 'zone-distribution', component: ZoneDistributionComponent },

  // { path: 'detail-reports', component: DetailReportsComponent },

  // { path: 'report-history', component: ReportHistoryComponent },

  // { path: 'contract-summary', component: ContractSummaryComponent },

  // { path: 'general-rate-increase', component: GeneralRateIncreaseComponent },

  // { path: 'settings/accountnumber', component: AccountnumberComponent },

  // { path: 'settings/plannumber', component: PlannumberComponent },

  // { path: 'admin/total-spend-by-customers', component: AdminMenuControlComponent },

  // { path: 'admin/average-discount', component: AverageDiscountComponent },

  // { path: 'admin/setup', component: SetupComponent },

  // { path: 'admin/activeUsersPopup', component: ActiveUsersPopupComponent },

  // { path: 'admin/UserLogPopup', component: UserLogPopupComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OtherPagesRoutingModule {}
