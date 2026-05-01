import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usps-report-log',
  templateUrl: './report-log.component.html',
  styleUrls: ['./report-log.component.scss'],
  standalone: false
})

/**
 * Create Component
 */
export class UspsReportLogComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  //variable Declarations
  randomNumber: any;
  isLoading: boolean = false;
  userProfifleData: any;
  userProfifle: any;
  clientName: any;
  reportDetails: any;
  url_path = environment.urlPath;
  clientProfile: any;

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  constructor(private loaderService: LoaderService, private cookiesService: CookiesService,
    private httpUspsService: HttpUSPSService, public dialog: MatDialog, private commonService: CommonService, public dialogRef: MatDialogRef<UspsReportLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe
  ) {

    this.clientName = data.clientName;
    this.clientProfile = data.userprofile;
    this.reportDetails = data.reportDetails;
  }

  ngOnInit(): void {

  }

  loadUser() {
    this.httpUspsService.fetchReportLog(this.clientProfile).subscribe({
      next: (result) => {
        this.reportDetails = result;
      }, error: (error) => {
      }
    });
  }

  close() {
    this.dialogRef.close();
  }


}
