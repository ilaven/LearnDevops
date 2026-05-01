import { Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
@Component({
  selector: 'app-reportmenu-access',
  templateUrl: './reportmenu-access.component.html',
  styleUrls: ['./reportmenu-access.component.scss'],
  standalone: false
})
export class ReportmenuAccessComponent {
  clientType = signal<any>('');
  constructor(private cookiesService: CookiesService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      console.log('clienttype',clienttype);
      this.clientType.set(clienttype);
    });
  }
} 
