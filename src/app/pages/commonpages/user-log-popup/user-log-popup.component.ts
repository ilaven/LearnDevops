import { Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
@Component({
  selector: 'app-user-log-popup',
  templateUrl: './user-log-popup.component.html',
  styleUrls: ['./user-log-popup.component.scss'],
  standalone: false
})
export class UserLogPopupComponent {
  clientType = signal<any>('');
  constructor(private cookiesService: CookiesService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      console.log('clienttype',clienttype);
      this.clientType.set(clienttype);
    });
  }
} 
