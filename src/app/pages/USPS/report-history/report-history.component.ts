import { DatePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-usps-report-history',
  templateUrl: './report-history.component.html',
  styleUrls: ['./report-history.component.scss'],
  standalone: false
})

/**
 * Create Component
 */
export class UspsReportHistoryComponent implements OnInit, AfterViewInit, AfterViewChecked {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  //variable Declarations
  randomNumber: any;
  isLoading: boolean = false;
  userProfifleData: any;
  userProfifle: any;
  clientName: any = '';
  reportDetails: any = [];
  url_path = environment.urlPath;

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngAfterViewChecked() {
    this.syncScrollbarWidth();
  }

  syncScrollbarWidth() {
    if (this.topScroll && this.tableScroll) {
      const tableElement = this.tableScroll.nativeElement.querySelector('table');
      const scrollContent = this.topScroll.nativeElement.querySelector('.scroll-content') as HTMLElement;
      if (tableElement && scrollContent) {
        const tableWidth = tableElement.offsetWidth;
        scrollContent.style.width = tableWidth + 'px';
      }
    }
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      if (this.tableScroll) {
        this.tableScroll.nativeElement.scrollLeft = scrollLeft;
      }
    } else {
      if (this.topScroll) {
        this.topScroll.nativeElement.scrollLeft = scrollLeft;
      }
    }
  }

  constructor(private loaderService: LoaderService, private cookiesService: CookiesService,
    private httpUspsService: HttpUSPSService, public dialog: MatDialog, private router: Router, private commonService: CommonService,
    private datePipe: DatePipe, private cd: ChangeDetectorRef
  ) {


  }

  ngOnInit(): void {
    this.openLoading();
    this.initializeDefaults();
    this.getUser();
  }

  private initializeDefaults(): void {
    this.randomNumber = Math.floor(100000 + Math.random() * 900000);
    var date = new Date();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);
  }


  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  async getUser() {
    try {
      // Await the promise directly
      const result = await this.commonService.getUserprofileData();
      this.userProfifleData = result;
      this.userProfifle = this.userProfifleData[0];
      this.clientName = this.userProfifle.clientName;
      this.cd.detectChanges();
      // Trigger report log once profile is ready
      this.reportLog_clickHandler(this.userProfifle);
    } catch (error) {
      // handle error gracefully
      console.error('Error fetching user profile', error);
    } finally {
      // Always close loading, even if error
      this.closeLoading();
      this.cd.detectChanges();
    }
  }

  reportLog_clickHandler(param: any) {
    const userprofile: any = { t001ClientProfile: param };

    this.httpUspsService.fetchReportLog(userprofile).subscribe({
      next: result => {
        this.reportDetails = result;
        this.closeLoading();
        this.cd.detectChanges();
      },
      error: err => {
        this.closeLoading();
        console.error('Error fetching report log', err);
        this.cd.detectChanges();
      }
    });
    this.cd.detectChanges();
  }

  loadUser() {
    this.openLoading();
    this.reportLog_clickHandler(this.userProfifle);
  }


}
