import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from './layouts/topbar/loader.component'; 
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'LJM Webportal';
 
 

  ngOnInit(): void {
    // this.cookiesService.clearDuplicateCookies();
  }
}
