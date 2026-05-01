import { Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { UpsDashboardComponent } from '../../UPS/dashboard/dashboard.component';
import { FedexDashboardComponent } from '../../FedEx/dashboard/dashboard.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class DashboardComponent {
  clientType = signal<any>('');
  constructor(public toastService: ToastService, private router: Router,
    private cookiesService: CookiesService,) {
    this.cookiesService.carrierType.subscribe((clienttype:any) => {
      console.log('clienttype', clienttype);
      let clientData=clienttype.toLowerCase();
      this.router.navigate(['/'+clientData+'/dashboard']);
      this.clientType.set(clienttype);
      console.log('this.clientType', this.clientType());
    });
      let clientId :any= this.cookiesService.getCookie('clientId');
    if (clientId){
       this.router.navigate(['/login']);
    }
  }
} 
