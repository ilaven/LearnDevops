import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  {
    path: 'signin', loadChildren: () => import('./login/auth/signin/signin.module').then(m => m.SigninModule)
  },
{
    path: "login",
    component: LoginComponent
  }  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
