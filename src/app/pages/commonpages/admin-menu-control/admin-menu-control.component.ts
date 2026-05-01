import { Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
@Component({
  selector: 'app-admin-menu-control',
  templateUrl: './admin-menu-control.component.html',
  styleUrls: ['./admin-menu-control.component.scss'],
  standalone: false
})
export class AdminMenuControlComponent {
  clientType = signal<any>('');
  constructor(private cookiesService: CookiesService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      console.log('clienttype',clienttype);
      this.clientType.set(clienttype);
    });
  }
} 
