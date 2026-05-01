import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboards/dashboard/dashboard.component';
const routes: Routes = [
  {
      path: "",
      component: DashboardComponent
  },
  {
    path: 'dashboard', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  // {
  //   path: 'pages', loadChildren: () => import('./commonpages/commonpages.module').then(m => m.CommonPagesModule)
  // },
  {
    path: 'ups', loadChildren: () => import('./UPS/ups.module').then(m => m.UpsModule)
  },
  {
    path: 'dhl', loadChildren: () => import('./DHL/dhl.module').then(m => m.DhlModule)
  },
  {
    path: 'fedex', loadChildren: () => import('./FedEx/fedex.module').then(m => m.FedExModule)
  },
  {
    path: 'ontrac', loadChildren: () => import('./OnTrac/ontrac.module').then(m => m.OntracModule)
  },
  {
    path: 'usps', loadChildren: () => import('./USPS/usps.module').then(m => m.UspsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
