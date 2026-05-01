import { Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
@Component({
  selector: 'app-servicelevel-usage-summary',
  templateUrl: './servicelevel-usage-summary.component.html',
  styleUrls: ['./servicelevel-usage-summary.component.scss'],
  standalone: false
})
export class ServicelevelUsageSummaryComponent {
  clientType = signal<any>('');
  constructor(private cookiesService: CookiesService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      console.log('clienttype',clienttype);
      this.clientType.set(clienttype);
    });
  }
} 
