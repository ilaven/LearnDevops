import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { TrackingUSPSPopupComponent } from './tracking-popup/tracking-popup.component';

interface SearchUserObj {
  clientId: string;
  clientName: string;
  fromDate: string;
  toDate: string;
  basisValue: string;
  searchDetail: string;
  searchSource: string;
  fromdate?: string | Date;
  todate?: string | Date;
}

interface TrackingDetailApi {
  clientBillingId: string;
  trackingNo: string;
  printDate: string;
  shipDate: string;
  classService: string;
  amountPaid: number;
  dateDelivered: string;
  originZip: string;
  totalCharge?: number;
}

interface TrackingDetailView {
  clientBillingId: string;
  trackingNumber: string;
  type: string;
  printDate: string;
  shipDate: string;
  classService: string;
  amountPaid: number;
  dateDelivered: string;
  originZip: string;
}

@Component({
  selector: 'app-usps_shipment-detail-search',
  templateUrl: './shipment-detail-search.component.html',
  styleUrls: ['./shipment-detail-search.component.scss'],
  standalone: false
})
export class USPSShipmentDetailSearchComponent implements OnInit, OnDestroy {
  @ViewChild('criteria', { static: true }) criteria: any;

  private destroy$ = new Subject<void>();

  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({
      clientId: new FormControl('')
    }),
    t002ClientProfileobj: new FormGroup({
      clientId: new FormControl('')
    })
  });

  apiControllerFormGroup = new FormGroup({
    clientId: new FormControl(''),
    clientname: new FormControl(''),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    basisValue: new FormControl(''),
    trackingNumber: new FormControl(''),
    receiverPostal: new FormControl(''),
    chargeSource: new FormControl(''),
    upsinternalUse: new FormControl(''),
    typeCode1: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    reportType: new FormControl(''),
    status: new FormControl(''),
    moduleName: new FormControl(''),
    login_id: new FormControl(''),
    reportFormat: new FormControl('')
  });

  searchForm: FormGroup = new FormGroup({
    clientId: new FormControl(''),
    clientname: new FormControl(''),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    basisValue: new FormControl(''),
    trackingNumber: new FormControl(''),
    receiverPostal: new FormControl(''),
    chargeSource: new FormControl(''),
    upsinternalUse: new FormControl(''),
    typeCode1: new FormControl(''),
    dateRange: new FormGroup({
      start: new FormControl(''),
      end: new FormControl('')
    })
  });

  fedexFormGroup: FormGroup = new FormGroup({
    clientname: new FormControl(''),
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    trackingNumber: new FormControl(''),
    receiverPostal: new FormControl(''),
    chargeSource: new FormControl(''),
    trackingcount: new FormControl(''),
    clientId: new FormControl(''),
    type: new FormControl(''),
    dateRange: new FormGroup({
      start: new FormControl(''),
      end: new FormControl('')
    })
  });

  loginId: number = 123; // Replace with authenticated user login id
  userProfifleData: any;
  userProfifle: any;

  resultObj: any;
  fetchTrakingnumberRes: TrackingDetailApi[] = [];
  trackingAC: any;
  value: any;
  uniquetrackinglistAC: any[] = [];
  commoncollAC: any[] = [];
  commoncollAC_value: any[] = [];
  trackingnumber: any;
  invoiceNumber: any;
  accountNumber: any;
  invoiceDate: any;
  transactionDate: any;
  packagecount: any;
  amount: any;
  refund: any;
  netdue: any;
  themeoption: any;
  testTempObj: any[] = [];
  total: any;
  disamount: any;
  clientName: string = '';
  clientId: any;
  selectedOptionText: any;
  upsInternalUseName: any;
  searchUserobj: SearchUserObj | null = null;
  pendingSearchUserobj: SearchUserObj | null = null;
  fromDate: string | null = null;
  toDate: string | null = null;
  isLoading = true;
  clientID: any;
  showTable = false;
  showCount = false;
  dataNoneTxt: any;
  clientNameSearch: any;

  clientType: any;
  showTableFedEx: any;
  panelClass: string = '';
  dataNoneTxtFedEx: any;
  currentDate: any;
  randomNumber: number = 0;
  private sessionPayload: any | null = null;

  showColumnPicker = false;
  carrierType: any;
  spreadSearchUserobj: any;
  searchClickCnt = 0;
  commoncollACDetails: TrackingDetailView[] = [];
  trackingDetails: TrackingDetailApi[] = [];
  trackignnumberpopupDetails: any;
  t002clntProObj = {};
  commoncollACDetailsObjList: TrackingDetailView[] = [];
  tableCount = 0;
  dialogValue: any;
  sendValue: any;
  fromdate: any;
  todate: any;
  fetch_trackingForModal: any[] = [];

  constructor(
    private loaderService: LoaderService,
    private cookiesService: CookiesService,
    private httpUspsService: HttpUSPSService,
    public dialog: MatDialog,
    private router: Router,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    private httpfedexService: HttpfedexService,
    private switchProj: SwitchProjectService
  ) {
    this.cookiesService.checkForClientName();

    this.cookiesService.carrierType
      .pipe(takeUntil(this.destroy$))
      .subscribe((clienttype: string) => {
        this.clientType = clienttype;
        if (this.clientType !== 'USPS') {
          this.router.navigate(['/dashboard/dashboard']);
        }
      });

    // this.switchProj.setCommonAc().subscribe(async (respsearchUserobj: any) => {
    //     const payload = Array.isArray(respsearchUserobj) ? respsearchUserobj[0] : null;
    //     this.searchUserobj = payload ?? null;

    if (localStorage.getItem('payload_usps')) {
      let searchUserobj: any = localStorage.getItem('payload_usps');
      this.searchUserobj = JSON.parse(searchUserobj);
      if (this.searchUserobj) {
        const fromDatefrmDashbrd: any = this.datePipe.transform(this.searchUserobj.fromDate, 'MM-dd-yyyy');
        const toDatefrmDashbrd: any = this.datePipe.transform(this.searchUserobj.toDate, 'MM-dd-yyyy');

        this.getUser();
        this.clientName = this.searchUserobj.clientName;

        this.searchForm.patchValue({
          dateRange: {
            start: this.searchUserobj.fromdate ? new Date(this.searchUserobj.fromdate) : null,
            end: this.searchUserobj.todate ? new Date(this.searchUserobj.todate) : null
          }
        });

        this.searchForm.get('fromdate')?.setValue(fromDatefrmDashbrd ? new Date(fromDatefrmDashbrd) : null);
        this.searchForm.get('todate')?.setValue(toDatefrmDashbrd ? new Date(toDatefrmDashbrd) : null);
        this.searchForm.get('trackingNumber')?.setValue(this.searchUserobj.searchDetail ?? '');
        this.searchForm.get('chargeSource')?.setValue(this.searchUserobj.searchSource ?? '');

        this.fromdate = this.searchUserobj.fromDate;
        this.fetch_Trakingnumber(this.searchUserobj);
      } else {
        this.openLoading();
        this.getUser();
        this.closeLoading();
      }
    }
  }

  ngOnInit(): void {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.getUser();
  }

  toggleColumnPicker(): void {
    this.showColumnPicker = !this.showColumnPicker;
  }

  async getUser(): Promise<void> {
    const date = new Date();
    const monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);

    this.toDate = this.formatDate(monthEndDay);
    this.fromDate = this.formatDate(monthStartDay);

    if (!this.searchUserobj) {
      this.searchForm.get('fromdate')?.setValue(monthStartDay);
      this.searchForm.get('todate')?.setValue(monthEndDay);
    }

    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => res);
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = this.userProfifleData?.[0];

    this.panelClass = this.themeoption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';

    if (this.userProfifle?.dataasof) {
      this.currentDate = this.datePipe.transform(this.userProfifle.dataasof, 'MM/dd/yyyy');
    }

    this.clientID = this.userProfifle?.clientId ?? '';
    this.clientName = this.userProfifle?.clientName ?? '';
  }

  formatDate(date: Date | null | undefined): string {
    if (!date) return '';
    return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
  }

  searchUser(): void {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateT = this.searchForm.get('todate')?.value;
    const chargeSource = this.searchForm.get('chargeSource')?.value;
    const trackingNumber = this.searchForm.get('trackingNumber')?.value;

    if (!dateFr || !dateT || !chargeSource || !trackingNumber) {
      this.openModal('Please fill required field');
      return;
    }

    const dateFrom = this.formatDate(dateFr);
    const dateTo = this.formatDate(dateT);

    const dateFrYear = new Date(dateFr).getFullYear();
    const dateTYear = new Date(dateT).getFullYear();
    const yearDiff = dateTYear - dateFrYear;

    if (yearDiff > 1) {
      this.openModal('Time Frame Greater than 2 years');
      return;
    }

    this.openLoading();

    this.searchUserobj = {
      clientId: String(this.clientID),
      clientName: this.clientName,
      fromDate: dateFrom,
      toDate: dateTo,
      basisValue: 'USPS',
      searchDetail: trackingNumber,
      searchSource: chargeSource
    };

    this.clientType = 'USPS';
    this.fetch_Trakingnumber(this.searchUserobj);
  }

  async fetch_Trakingnumber(searchUserobjValue: SearchUserObj): Promise<void> {
    this.openLoading();

    try {
      const result = await firstValueFrom(
        this.httpUspsService.fetchShipmentDetailSearch(searchUserobjValue)
      );

      this.fetchTrakingnumberRes = Array.isArray(result) ? result : [];

      if (this.fetchTrakingnumberRes.length > 0) {
        this.dataNoneTxt = false;
        this.showTable = true;
        this.showCount = true;
        this.trackingList(this.fetchTrakingnumberRes);
      } else {
        this.showTable = false;
        this.showCount = false;
        this.closeLoading();
        this.openModal('No data found!');
      }
    } catch (error) {
      console.error('fetch_Trakingnumber error:', error);
      this.showTable = false;
      this.showCount = false;
      this.closeLoading();
      this.openModal('Something went wrong while fetching shipment details.');
    } finally {
      this.closeLoading();
    }
  }

  trackingList(event: TrackingDetailApi[]): void {
    this.trackingDetails = event ?? [];

    if (!this.trackingDetails.length) {
      this.commoncollACDetailsObjList = [];
      this.commoncollACDetails = [];
      this.showTable = true;
      this.dataNoneTxt = true;
      this.showCount = false;
      return;
    }

    this.commoncollACDetails = [];
    this.commoncollACDetailsObjList = [];

    for (let listcount = 0; listcount < this.trackingDetails.length; listcount++) {
      const item = this.trackingDetails[listcount];

      const tempObj: TrackingDetailView = {
        clientBillingId: item.clientBillingId,
        trackingNumber: item.trackingNo,
        type: 'USPS',
        printDate: item.printDate,
        shipDate: item.shipDate,
        classService: item.classService,
        amountPaid: item.amountPaid,
        dateDelivered: item.dateDelivered,
        originZip: item.originZip
      };

      this.commoncollACDetails.push(tempObj);
    }

    if (this.commoncollACDetails.length > 1) {
      this.commoncollACDetailsObjList = [...this.commoncollACDetails];
      this.tableCount = this.commoncollACDetailsObjList.length;
      this.showTable = true;
      this.showCount = true;
    } else {
      this.showTable = false;
      this.showCount = false;
      this.getTrackingDetail(this.commoncollACDetails[0]);
    }
  }

  async getTrackingDetail(trackingParam: TrackingDetailView): Promise<void> {
    if (!this.searchUserobj) {
      this.openModal('Search context missing.');
      return;
    }

    const dateT = this.searchForm.get('todate')?.value;
    const modulename = 'TrackingNumberreport';

    const trackingobj = {
      clientBillingId: trackingParam.clientBillingId,
      clientName: this.searchUserobj.clientName,
      fromDate: this.searchUserobj.fromDate,
      toDate: this.searchUserobj.toDate,
      searchDetail: trackingParam.trackingNumber,
      carrierType: trackingParam.type,
      searchSource: 'TrackingNumberWithID',
      themeoption: this.themeoption,
      t001ClientProfile: this.userProfifle,
      reportType: 'TRACKING_NUMBER_EXCEL',
      designFileName: 'TrackingNumber_Excel',
      status: 'IN QUEUE',
      reportFormat: 'excel',
      moduleName: modulename,
      clientId: this.searchUserobj.clientId,
      crmaccountNumber: `T004_${this.clientName}_${this.datePipe.transform(dateT, 'yyyy')}`,
      reportName: 'TRACKING_NUMBER_EXCEL;',
      login_id: String(this.loginId),
      fzone: 0,
      tzone: 0
    };

    this.sendValue = trackingobj;
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(TrackingUSPSPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        pageValue: this.sendValue,
        panelClass: this.panelClass
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.dialogValue = result?.data;
      });
  }

  openLoading(): void {
    this.isLoading = true;
  }

  closeLoading(): void {
    this.isLoading = false;
  }

  image_clickHandler(): void {
    if (!this.commoncollACDetails?.length) {
      this.openModal('No data found!');
      return;
    }

    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateT = this.searchForm.get('todate')?.value;
    const dateFrom = this.formatDate(dateFr);
    const dateTo = this.formatDate(dateT);
    const modulename = 'TrackingNumberreport';

    const t007_reportlogobj: any = {
      fromDate: dateFrom,
      toDate: dateTo,
      t001ClientProfile: this.userProfifle,
      reportType: 'Tracking_Number_Report',
      reportName: 'Tracking Number Report',
      designFileName: 'TrackingNumberFullReport_Excel',
      status: 'IN QUEUE',
      reportFormat: 'CSV',
      moduleName: modulename,
      chargeDes: this.searchForm.get('chargeSource')?.value,
      clientId: this.clientID,
      clientname: this.clientName,
      crmaccountNumber: (this.searchForm.get('trackingNumber')?.value || '').replace(/[ ]/g, '_'),
      login_id: String(this.loginId),
      fzone: 0,
      tzone: 0
    };

    this.httpUspsService.runReport(t007_reportlogobj)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => this.saveOrUpdateReportLogResult(result),
        error: error => {
          console.error(error);
          this.openModal('Unable to queue report request.');
        }
      });
  }

  saveOrUpdateReportLogResult(result: any): void {
    this.reportsFormGroup.get('reportLogId')?.setValue(result?.reportLogId ?? '');
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result?.t001ClientProfile?.clientId ?? '');
    this.commonService._setIntervalUSPS(this.reportsFormGroup.value);
    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
    dialogConfig.afterClosed().subscribe(result => {
      return this.dialogValue = result.data;
    });
  }

  generatetrackingexcel(trackingNo: string, clientBillingId: string): void {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateT = this.searchForm.get('todate')?.value;
    const dateFrom = this.formatDate(dateFr);
    const dateTo = this.formatDate(dateT);
    const modulename = 'TrackingNumberreport';

    const t007_reportlogobj: any = {
      fromDate: dateFrom,
      toDate: dateTo,
      t001ClientProfile: this.userProfifle,
      reportType: 'Tracking_Number_Report',
      reportName: 'Tracking Number Report',
      designFileName: 'TrackingNumber_Excel',
      status: 'IN QUEUE',
      reportFormat: 'CSV',
      moduleName: modulename,
      chargeDes: trackingNo,
      clientId: this.clientID,
      clientname: this.clientName,
      crmaccountNumber: clientBillingId,
      login_id: String(this.loginId),
      fzone: 0,
      tzone: 0
    };

    this.httpUspsService.runReport(t007_reportlogobj)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => this.saveOrUpdateReportLogResult(result),
        error: error => {
          console.error(error);
          this.openModal('Unable to generate tracking Excel report.');
        }
      });
  }

  generatetrackingpdf(trackingNo: string, clientBillingId: string): void {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateT = this.searchForm.get('todate')?.value;
    const dateFrom = this.formatDate(dateFr);
    const dateTo = this.formatDate(dateT);
    const clientName = (this.clientName || '').replace(/[^a-zA-Z0-9 ]/g, '');

    const master_reportlogobj: any = {
      fromDate: dateFrom,
      toDate: dateTo,
      searchSource: 'TrackingNumberWithID',
      searchDetail: trackingNo,
      clientId: String(this.clientID),
      clientBillingId: clientBillingId,
      clientName: clientName,
      typeCode1: 'Tracking_Number_Report',
      basisValue: this.clientType
    };

    this.fetch_TrackingReport(master_reportlogobj);
    this.openModal('Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.');
  }

  fetch_TrackingReport(param: any): void {
    this.httpUspsService.fetch_TrackingReport(param)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          const urlParam: any = {
            pdfpath: result,
            action: 'Trackingnumberreport'
          };

          let fields_string = '';
          for (const [key, value] of Object.entries(urlParam)) {
            fields_string += `${key}=${value}&`;
          }

          this.httpUspsService.reportServlet(fields_string);
        },
        error: (error: any) => {
          console.error('fetch_TrackingReport error:', error);
          this.openModal('Unable to download tracking PDF report.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}