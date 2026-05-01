import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OntracDashboardComponent } from './dashboard/dashboard.component';
import { UpsDetailsReportEditComponent } from '../UPS/detailsreport-edit/detailsreport-edit.component';
import { UpsUserLogPopupComponent } from '../UPS/user-log-popup/user-log-popup.component';
import { ontracSetupComponent } from './setup/setup.component';
import { OnTracDetailReportsComponent } from './detail-reports/detail-reports.component';
import { OnTracReportHistoryComponent } from './report-history/report-history.component';
import { OnTracEditProfileComponent } from './edit-profile/editprofilecomponent';
import { OntracCarrierTrendsInsightComponent } from './carrier-trends-insights/carrier-trends-insights.component';
import { OnTracZoneDistributionComponent } from './zone-distribution/zone-distribution.component';
import { OnTracAccountnumberComponent } from './accountnumber/accountnumber.component';
import { OnTracChargeDescriptionComponent } from './charge-description/charge-description.component';
import { OntracShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';


const routes: Routes = [
  { path: 'dashboard', component: OntracDashboardComponent },
  { path: 'admin/detailsreport-edit', component: UpsDetailsReportEditComponent },
  { path: 'admin/UserLogPopup', component: UpsUserLogPopupComponent },
  { path: 'admin/setup', component: ontracSetupComponent },
  { path: 'dashboard', component: OntracDashboardComponent },
  { path: 'admin/detailsreport-edit', component: UpsDetailsReportEditComponent },
  { path: 'admin/UserLogPopup', component: UpsUserLogPopupComponent },
  { path: 'detail-reports', component: OnTracDetailReportsComponent },

  { path: 'report-history', component: OnTracReportHistoryComponent },
  { path: 'settings/editprofile', component: OnTracEditProfileComponent, data: { bodyClass: 'ups-edit-profile' } },

  { path: 'carrier-trends-insights', component: OntracCarrierTrendsInsightComponent },

  { path: 'zone-distribution', component: OnTracZoneDistributionComponent },

  { path: 'settings/accountnumber', component: OnTracAccountnumberComponent },

  { path: 'charge-description', component: OnTracChargeDescriptionComponent },
  { path: 'tracking', component: OntracShipmentDetailSearchComponent },

  // {
  //   path: "contacts",
  //   component: ContactsComponent
  // },
  // {
  //   path: "companies",
  //   component: CompaniesComponent
  // },
  // {
  //   path: "deals",
  //   component: DealsComponent
  // },
  // {
  //   path: "leads",
  //   component: LeadsComponent
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnTracRoutingModule { }
