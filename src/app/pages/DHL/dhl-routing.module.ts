import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DhlDashboardComponent } from './dashboard/dashboard.component';
import { UpsUserLogPopupComponent } from '../UPS/user-log-popup/user-log-popup.component';
import { ontracSetupComponent } from '../OnTrac/setup/setup.component';
import { DhlAccountnumberComponent } from './accountnumber/accountnumber.component';
import { DhlDetailReportsComponent } from './detail-reports/detail-reports.component';
import { DHLReportHistoryComponent } from './report-history/report-history.component';
import { DhlEditProfileComponent } from './edit-profile/editprofilecomponent';
import { DhlChargeDescriptionComponent } from './charge-description/charge-description.component';
import { DhlShipmentDetailSearchComponent } from './shipment-detail-search/shipment-detail-search.component';


const routes: Routes = [
  { path: 'dashboard', component: DhlDashboardComponent },
  { path: 'admin/UserLogPopup', component: UpsUserLogPopupComponent },
  { path: 'admin/setup', component: ontracSetupComponent },
  { path: 'settings/accountnumber', component: DhlAccountnumberComponent },
  { path: 'detail-reports', component: DhlDetailReportsComponent },

  { path: 'report-history', component: DHLReportHistoryComponent },
  { path: 'settings/editprofile', component: DhlEditProfileComponent, data: { bodyClass: 'app-dhl-editprofile' } },
  { path: 'charge-description', component: DhlChargeDescriptionComponent },
  { path: 'tracking', component: DhlShipmentDetailSearchComponent },
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
export class DHLRoutingModule { }
