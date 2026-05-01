import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { USPSDashboardComponent } from './dashboard/dashboard.component';
import { UpsUserLogPopupComponent } from '../UPS/user-log-popup/user-log-popup.component';
import { UspsSetupComponent } from './setup/setup.component';
import { UspsDetailReportsComponent } from './detail-reports/detail-reports.component';
import { UspsReportHistoryComponent } from './report-history/report-history.component';
import { UspsEditProfileComponent } from './edit-profile/editprofilecomponent';
import { UspsChargeDescriptionComponent } from './charge-description/charge-description.component';
import { USPSShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';


const routes: Routes = [
  { path: 'dashboard', component: USPSDashboardComponent },
  { path: 'admin/UserLogPopup', component: UpsUserLogPopupComponent },
  { path: 'admin/setup', component: UspsSetupComponent },
  { path: 'detail-reports', component: UspsDetailReportsComponent },

  { path: 'report-history', component: UspsReportHistoryComponent },
  { path: 'settings/editprofile', component: UspsEditProfileComponent, data: { bodyClass: 'ups-edit-profile' } },
  { path: 'charge-description', component: UspsChargeDescriptionComponent },
  { path: 'tracking', component: USPSShipmentDetailSearchComponent },

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
export class USPSRoutingModule { }
