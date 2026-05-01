import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table'; 
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
@Component({
  selector: 'app-download-GRI',
  templateUrl: './download-GRI.component.html',
  styleUrls: ['./download-GRI.component.css'],
  standalone:false
})
export class DownloadGRIComponent implements OnInit {
  isLoading: boolean = false;

  constructor(public dialogRef: MatDialogRef<DownloadGRIComponent>, public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService, private cookie: CookieService, private cookiesService: CookiesService,
    private fedexService: HttpfedexService) {
  }

  async ngOnInit(): Promise<void> {

  }

  downloadclickHandler(event: any, reportType: any){
    this.dialogRef.close(reportType)
  }
  close() {
    this.dialogRef.close();
  }  

}

