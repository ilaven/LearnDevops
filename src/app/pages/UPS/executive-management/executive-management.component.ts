import { Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
@Component({
  selector: 'app-ups-executive-management',
  templateUrl: './executive-management.component.html',
  styleUrls: ['./executive-management.component.scss'],
  standalone: false
})
export class UpsExecutiveManagementComponent {
  clientType = signal<any>('');
  constructor(private cookiesService: CookiesService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      console.log('clienttype',clienttype);
      this.clientType.set(clienttype);
    });
  }
} 
