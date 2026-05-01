import { DatePipe } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fedex-report-history',
  templateUrl: './report-history.component.html',
  styleUrls: ['./report-history.component.scss'],
  standalone: false
})

/**
 * Create Component
 */
export class FedexReportHistoryComponent implements OnInit, AfterViewInit, AfterViewChecked {

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
    private httpfedexService: HttpfedexService, public dialog: MatDialog, private router: Router, private commonService: CommonService,
    private datePipe: DatePipe, private cd: ChangeDetectorRef
  ) {


  }

  ngOnInit(): void {
    this.loaderService.show();
    this.initializeDefaults();
    this.getUserFedex();
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

  async getUserFedex() {
    try {
      this.openLoading();
      // Await the promise directly
      const result = await this.commonService.getUserprofileData();
      this.userProfifleData = result;
      this.userProfifle = this.userProfifleData[0];
      this.clientName = this.userProfifle.clientName;
      this.cd.detectChanges();
      // Trigger report log once profile is ready
      this.reportLog_clickHandlerFedex(this.userProfifle);
    } catch (error) {
      // handle error gracefully
      console.error('Error fetching user profile', error);
    } finally {
      // Always close loading, even if error
      this.closeLoading();
      this.cd.detectChanges();
    }
  }

  async reportLog_clickHandlerFedex(param: any): Promise<void> {
    const userprofile: any = { t002ClientProfileobj: param };

    this.httpfedexService.fetchReportData(userprofile).subscribe({
      next: (result: any[]) => {
        this.closeLoading();

        for (let loop = 0; loop < result.length; loop++) {
          const resultObj = result[loop];
          const resultDateToNum = Number(resultObj['toDate']);

          if (resultObj['toDate'] === '0' && resultObj['fromDate'].length === 4) {
            resultObj['fromDate'] = `01/01/${resultObj['fromDate']}`;

            const strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
            const strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
            const strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);

            const dateAsOf = `${strMonthEnd}/${strDateEnd}/${strYearEnd}`;
            resultObj['toDate'] = this.datePipe.transform(dateAsOf, 'MM/dd/yyyy');
          } else if (resultDateToNum > 0 && resultDateToNum <= 12) {
            const date = new Date();
            const monthStartDay = new Date(date.getFullYear(), resultDateToNum - 1, 1);
            const monthEndDay = new Date(date.getFullYear(), resultDateToNum, 0);

            resultObj['toDate'] = this.datePipe.transform(monthEndDay, 'MM/dd/yyyy');
            resultObj['fromDate'] = this.datePipe.transform(monthStartDay, 'MM/dd/yyyy');
          } else {
            resultObj['toDate'] = this.datePipe.transform(resultObj['toDate'], 'MM/dd/yyyy');
            resultObj['fromDate'] = this.datePipe.transform(resultObj['fromDate'], 'MM/dd/yyyy');
          }
        }

        this.reportDetails = result;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cd.detectChanges();
      }
    });
    this.cd.detectChanges();
  }


  loadUser() {
    this.openLoading();
    this.reportLog_clickHandlerFedex(this.userProfifle);
  }


}
