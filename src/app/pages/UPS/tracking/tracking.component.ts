import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { TrackingPopupModalComponent } from '../tracking/modal/modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TrackingPopupFedexComponent } from '../tracking/tracking-popup-fedex/tracking-popup-fedex.component';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule,
    MatSelectModule, MatInputModule, MatOptionModule, MatIconModule, MatCardModule, DatePipe],
  providers: [DatePipe],
})
export class TrackingComponent implements OnInit, OnDestroy {
  @ViewChild('criteria', { static: true }) criteria: any;

  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new UntypedFormControl(''),
    t001ClientProfile: new UntypedFormGroup({
      clientId: new UntypedFormControl('')
    }),
    t002ClientProfileobj: new UntypedFormGroup({
      clientId: new UntypedFormControl('')
    })
  });

  apiControllerFormGroup = new UntypedFormGroup({
    clientId: new UntypedFormControl(''),
    clientname: new UntypedFormControl(''),
    fromdate: new UntypedFormControl(''),
    todate: new UntypedFormControl(''),
    basisValue: new UntypedFormControl(''),
    trackingNumber: new UntypedFormControl(''),
    receiverPostal: new UntypedFormControl(''),
    chargeSource: new UntypedFormControl(''),
    upsinternalUse: new UntypedFormControl(''),
    typeCode1: new UntypedFormControl(''),
    fromDate: new UntypedFormControl(''),
    toDate: new UntypedFormControl(''),
    reportType: new UntypedFormControl(''),
    status: new UntypedFormControl(''),
    moduleName: new UntypedFormControl(''),
    login_id: new UntypedFormControl(''),
    reportFormat: new UntypedFormControl('')
  });

  searchForm: UntypedFormGroup = new UntypedFormGroup({
    clientId: new UntypedFormControl(''),
    clientname: new UntypedFormControl(''),
    fromdate: new UntypedFormControl(''),
    todate: new UntypedFormControl(''),
    basisValue: new UntypedFormControl(''),
    trackingNumber: new UntypedFormControl(''),
    receiverPostal: new UntypedFormControl(''),
    chargeSource: new UntypedFormControl(''),
    upsinternalUse: new UntypedFormControl(''),
    typeCode1: new UntypedFormControl(''),
    dateRange: new UntypedFormGroup({
      start: new UntypedFormControl(''),
      end: new UntypedFormControl('')
    })
  });

  fedexFormGroup = new UntypedFormGroup({
    clientname: new UntypedFormControl(''),
    fromdate: new UntypedFormControl(''),
    todate: new UntypedFormControl(''),
    trackingNumber: new UntypedFormControl(''),
    receiverPostal: new UntypedFormControl(''),
    chargeSource: new UntypedFormControl(''),
    trackingcount: new UntypedFormControl(''),
    clientId: new UntypedFormControl(''),
    type: new UntypedFormControl(''),
    dateRange: new UntypedFormGroup({
      start: new UntypedFormControl(''),
      end: new UntypedFormControl('')
    })
  });

  loginId: number = 123;
  userProfifleData: any;
  resultObj: any;
  fetchTrakingnumberRes: any;

  trackingAC: any;
  value: any;
  uniquetrackinglistAC: any[] = [];
  commoncollAC: any[] | null = [];
  commoncollAC_value: any[] = [];

  trackingnumber: any;
  invoiceNumber: any;
  accountNumber: any;
  invoiceDate: any;
  transactionDate: any;
  packagecount: number = 0;
  amount: number = 0;
  refund: number = 0;
  netdue: number = 0;
  themeoption: any;
  testTempObj: any[] = [];
  total: number = 0;
  disamount: number = 0;
  clientName: any;
  clientId: any;
  selectedOptionText: any;
  upsInternalUseName: any;
  userProfifle: any;
  searchUserobj: any = null;
  pendingSearchUserobj: any = null;
  fromDate: any;
  toDate: any;
  isLoading = true;
  clientID: any;
  showTable = false;
  showCount = false;
  dataNoneTxt = false;
  clientNameSearch: any;

  clientType: any;
  showTableFedEx = false;
  panelClass: any;
  dataNoneTxtFedEx = false;
  private onSetCommonAc!: Subscription;
  currentDate: Date | null = null;
  randomNumber: any;

  searchClickCnt = 0;
  tableCount = 0;

  commoncollACFedEx: any[] = [];
  trackingACFedEx: any[] = [];
  trackignnumberpopupFedEx: any;
  t002clntProObj: any = {};
  commoncollACFedExObjList: any[] | null = [];

  dialogValue: any;
  sendValue: any;
  fromdate: any;
  todate: any;
  fetch_trackingForModal: any[] = [];

  constructor(
    private authentocationService: AuthenticationService,
    private httpfedexService: HttpfedexService,
    private httpClientService: HttpClientService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private cookiesService: CookiesService,
    private switchProj: SwitchProjectService
  ) {
    this.cookiesService.checkForClientName();

    this.cookiesService.carrierType.subscribe((clienttype: any) => {
      this.clientType = clienttype;
      if (this.clientType == 'OnTrac' || this.clientType == 'Dhl') {
        this.router.navigate(['/dashboard/dashboard']);
      }
    });

    this.onSetCommonAc = this.switchProj.setCommonAc().subscribe((respsearchUserobj: any) => {
      this.pendingSearchUserobj = respsearchUserobj?.[0] ?? null;
    });
  }

  async ngOnInit() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.openLoading();

    try {
      await this.waitForClientType();
      await this.getUser();

      this.showTable = false;
      this.showTableFedEx = false;
      this.dataNoneTxt = false;
      this.dataNoneTxtFedEx = false;
      this.showCount = false;

      if (this.pendingSearchUserobj) {
        this.searchUserobj = this.pendingSearchUserobj;

        if (this.searchUserobj.basisValue == 'UPS') {
          this.applyUpsDashboardValues(this.searchUserobj);
          this.fetch_Trakingnumber(this.searchUserobj);
        } else {
          this.applyFedexDashboardValues(this.searchUserobj);
          this.fetchTrakingnumberFedEx(this.searchUserobj);
        }
      } else {
        this.applyDefaultDates();
        this.closeLoading();
      }
    } catch (error) {
      this.closeLoading();
      console.log(error);
    }
  }

  private waitForClientType(): Promise<void> {
    if (this.clientType) return Promise.resolve();

    return new Promise((resolve) => {
      const sub = this.cookiesService.carrierType.subscribe((clienttype: any) => {
        if (clienttype) {
          this.clientType = clienttype;
          sub.unsubscribe();
          resolve();
        }
      });
    });
  }

  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }

  private applyDefaultDates() {
    const date = new Date();
    const monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);

    this.toDate = this.datePipe.transform(monthEndDay, 'yyyy-MM-dd');
    this.fromDate = this.datePipe.transform(monthStartDay, 'yyyy-MM-dd');

    if (this.clientType == 'UPS') {
      this.searchForm.patchValue({
        fromdate: monthStartDay,
        todate: monthEndDay,
        dateRange: {
          start: monthStartDay,
          end: monthEndDay
        }
      });
    } else {
      this.fedexFormGroup.patchValue({
        fromdate: monthStartDay,
        todate: monthEndDay,
        dateRange: {
          start: monthStartDay,
          end: monthEndDay
        }
      });
    }
  }

  async getUser() {
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => res);
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = this.userProfifleData?.[0];

    if (this.themeoption == 'dark') {
      this.panelClass = 'page-dark';
    } else {
      this.panelClass = 'custom-dialog-panel-class';
    }

    if (this.clientType == 'UPS') {
      this.clientID = this.userProfifle?.clientId;
      this.clientName = this.userProfifle?.clientName;
      this.currentDate = this.userProfifle?.dataasof
        ? new Date(this.userProfifle.dataasof)
        : new Date();
    }

    if (this.clientType == 'FedEx') {
      this.clientID = this.userProfifle?.clientId;
      this.clientName = this.userProfifle?.clientName?.replace(/[ ]/g, '_');

      const fileEndDate = this.userProfifle?.fileenddate1;
      if (fileEndDate && fileEndDate.length >= 8) {
        const year = Number(fileEndDate.substring(0, 4));
        const month = Number(fileEndDate.substring(4, 6)) - 1;
        const day = Number(fileEndDate.substring(6, 8));
        this.currentDate = new Date(year, month, day);
      } else {
        this.currentDate = new Date();
      }
    }
  }

  private applyUpsDashboardValues(data: any) {
    this.clientName = data.clientname;

    this.searchForm.patchValue({
      clientId: (this.clientID).toString(),
      clientname: data.clientname || '',
      basisValue: 'UPS',
      chargeSource: data.chargeSource || '',
      trackingNumber: data.trackingNumber || '',
      receiverPostal: data.trackingNumber || '',
      fromdate: data.fromdate ? new Date(data.fromdate) : null,
      todate: data.todate ? new Date(data.todate) : null,
      dateRange: {
        start: data.fromdate ? new Date(data.fromdate) : null,
        end: data.todate ? new Date(data.todate) : null
      }
    });
  }

  private applyFedexDashboardValues(data: any) {
    this.clientName = data.clientname;
    this.clientNameSearch = data.clientname?.replace(/[ ]/g, '_');

    this.fedexFormGroup.patchValue({
      clientId: (this.clientID).toString(),
      clientname: data.clientname || '',
      type: this.clientType || '',
      chargeSource: data.chargeSource || '',
      trackingNumber: data.trackingNumber || '',
      receiverPostal: data.trackingNumber || '',
      fromdate: data.fromdate ? new Date(data.fromdate) : null,
      todate: data.todate ? new Date(data.todate) : null,
      dateRange: {
        start: data.fromdate ? new Date(data.fromdate) : null,
        end: data.todate ? new Date(data.todate) : null
      }
    });
  }

  searchUser() {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateT = this.searchForm.get('todate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const chargeSource = this.searchForm.get('chargeSource')?.value;
    const trackingNumber = this.searchForm.get('trackingNumber')?.value;

    if (chargeSource != '' && trackingNumber != '') {
      const dateFrYear = dateFr.getFullYear();
      const dateTYear = dateT.getFullYear();
      const yearDiff = dateTYear - dateFrYear;

      if (yearDiff > 1) {
        this.openModal('Time Frame Greater than 2 years');
        return;
      }

      this.openLoading();
      this.searchUserobj = {
        clientId: (this.clientID).toString(),
        clientname: this.clientName,
        fromdate: dateFrom,
        todate: dateTo,
        basisValue: 'UPS',
        trackingNumber: this.searchForm.get('trackingNumber')?.value,
        receiverPostal: this.searchForm.get('trackingNumber')?.value,
        chargeSource: this.searchForm.get('chargeSource')?.value
      };
      this.fetch_Trakingnumber(this.searchUserobj);
    } else {
      this.openModal('Pleace fill required field');
      return;
    }
  }

  fetch_Trakingnumber(searchUserobjValue: any) {
    this.openLoading();
    this.httpClientService.fetch_Trakingnumber(searchUserobjValue).subscribe(
      (result: any) => {
        this.fetchTrakingnumberRes = result;
        if (this.fetchTrakingnumberRes.length > 0) {
          this.dataNoneTxt = false;
          this.showTable = true;
          this.showCount = true;
          this.trackingList(this.fetchTrakingnumberRes);
          this.closeLoading();
        } else {
          this.closeLoading();
          this.openModal('No data found!');
          this.trackingList(null);
        }
      },
      (error: any) => {
        this.closeLoading();
        console.log('error ', error);
      }
    );
  }

  saveOrUpdateReportLog() {
    this.httpClientService.saveOrUpdateReportLog(this.apiControllerFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error ', error);
      }
    );
  }

  fetchservicefedex() {
    this.httpfedexService.fetchservicefedex(this.fedexFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  trackingList(resultParameter: any) {
    if (resultParameter == null) {
      this.commoncollAC = null;
      this.showTable = true;
      this.showCount = false;
      this.dataNoneTxt = true;
      return;
    }

    this.trackingAC = resultParameter;
    if (this.trackingAC != null && this.trackingAC.length > 0) {
      this.uniquetrackinglistAC = [];

      for (let tracklistcount = 0; tracklistcount < this.trackingAC.length; tracklistcount++) {
        this.value = this.trackingAC[tracklistcount].trackingNumber;
        if (this.uniquetrackinglistAC.indexOf(this.value) == -1) {
          this.uniquetrackinglistAC.push(this.value);
        }
      }

      this.commoncollAC_value = [];
      this.commoncollAC = [];

      for (let distinctlistcount = 0; distinctlistcount < this.uniquetrackinglistAC.length; distinctlistcount++) {
        const tempObj: any = {};
        this.trackingnumber = this.uniquetrackinglistAC[distinctlistcount].toString();
        this.packagecount = 0;
        this.amount = 0;
        this.refund = 0;
        this.netdue = 0;
        this.total = 0;
        this.disamount = 0;

        for (let listcount = 0; listcount < this.trackingAC.length; listcount++) {
          if (this.trackingnumber == this.trackingAC[listcount].trackingNumber) {
            this.packagecount += Number(this.trackingAC[listcount].packageQuantity);
            this.disamount += Number(this.trackingAC[listcount].incentiveAmount);

            if (
              this.trackingAC[listcount].chargeCategoryDetailCode == 'CADJ' ||
              this.trackingAC[listcount].chargeCategoryDetailCode == 'VOID' ||
              this.trackingAC[listcount].chargeCategoryDetailCode == 'GSR'
            ) {
              this.refund += Number(this.trackingAC[listcount].netAmount);
            } else {
              this.amount += Number(this.trackingAC[listcount].netAmount);
            }

            this.invoiceNumber = this.trackingAC[listcount].invoiceNumber.toString();
            this.invoiceDate = this.trackingAC[listcount].invoiceDate.toString();
            this.accountNumber = this.trackingAC[listcount].accountNumber.toString();
            this.transactionDate = this.trackingAC[listcount].transactionDate.toString();
          }
        }

        this.total = this.amount + this.refund;

        tempObj['trackingNumber'] = this.trackingnumber;
        tempObj['containerType'] = 'UPS';
        tempObj['accountNumber'] = this.accountNumber;
        tempObj['invoiceNumber'] = this.invoiceNumber;
        tempObj['invoiceDate'] = this.invoiceDate;
        tempObj['transactionDate'] = this.transactionDate;
        tempObj['packageQuantity'] = this.packagecount.toString();
        tempObj['netAmount'] = '$ ' + this.amount.toFixed(2);
        tempObj['gstamount'] = '$ ' + this.refund.toFixed(2);
        tempObj['total'] = '$ ' + this.total.toFixed(2);
        this.commoncollAC_value.push(tempObj);
      }

      if (this.commoncollAC_value.length > 1) {
        this.commoncollAC = this.commoncollAC_value;
        this.tableCount = this.commoncollAC.length;
      } else {
        this.showTable = false;
        this.dataNoneTxt = false;
        this.showCount = false;
        this.getTrackingDetail(this.commoncollAC_value[0]);
      }

      this.searchClickCnt++;
    }
    this.closeLoading();
  }

  async getTrackingDetail(trackingParam: any) {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.searchForm.get('todate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const modulename = 'TrackingNumberreport';

    const trackingobj = {
      clientname: this.clientName,
      fromdate: this.searchUserobj.fromdate,
      todate: this.searchUserobj.todate,
      trackingNumber: trackingParam.trackingNumber,
      basisValue: trackingParam.containerType,
      chargeSource: 'Tracking Number',
      themeoption: this.themeoption,
      fromDate: dateFrom,
      toDate: dateTo,
      t001ClientProfile: this.userProfifle,
      reportType: 'UPS_Tracking_Number_Report',
      designFileName: 'TrackingNumber_Excel',
      status: 'IN QUEUE',
      reportFormat: 'CSV',
      moduleName: modulename,
      chargeDes: trackingParam.trackingNumber,
      clientId: this.searchUserobj.clientId,
      crmaccountNumber: 'T004_' + this.clientName + '_' + this.datePipe.transform(dateT, 'yyyy'),
      login_id: this.loginId.toString(),
      fzone: 0,
      tzone: 0
    };

    this.sendValue = trackingobj;
    this.openDialog();
  }

  async getFedExTrackingDetail(trackingParam: any) {
    const dateFr = this.fedexFormGroup.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.fedexFormGroup.get('todate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const modulename = 'TrackingNumberreport';

    let userData = this.userProfifle;
    if (this.searchUserobj.t002ClientProfileObj != null || this.searchUserobj.t002ClientProfileObj != undefined) {
      userData = this.searchUserobj.t002ClientProfileObj[0];
    }

    const trackingobj = {
      invoiceId: trackingParam.invoiceId,
      clientname: this.clientName,
      fromdate: this.searchUserobj.fromdate,
      todate: this.searchUserobj.todate,
      trackingNumber: trackingParam.trackingNumber,
      carrierType: trackingParam.type,
      chargeSource: 'Tracking Number',
      themeoption: this.themeoption,
      t002ClientProfileObj: userData,
      reportType: 'TRACKING_NUMBER_EXCEL',
      designFileName: 'TrackingNumber_Excel',
      status: 'IN QUEUE',
      reportFormat: 'excel',
      moduleName: modulename,
      chargeDes: trackingParam.trackingNumber,
      clientId: this.searchUserobj.clientId,
      crmaccountNumber: 'T004_' + this.clientName + '_' + this.datePipe.transform(dateT, 'yyyy'),
      reportName: 'TRACKING_NUMBER_EXCEL;',
      login_id: this.loginId.toString(),
      fzone: 0,
      tzone: 0
    };

    this.sendValue = trackingobj;
    this.openTrackingFedExDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(TrackingPopupModalComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        pageValue: this.sendValue,
        panelClass: this.panelClass
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogValue = result?.data;
    });
  }

  openTrackingFedExDialog() {
    const dialogRef = this.dialog.open(TrackingPopupFedexComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        pageValue: this.sendValue,
        panelClass: this.panelClass
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.dialogValue = result?.data;
    });
  }

  openLoading() {
    this.isLoading = true;
  }

  closeLoading() {
    this.isLoading = false;
  }

  image_clickHandler() {
    if (this.commoncollAC == null) {
      this.openModal('No data found!');
      return;
    }

    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.searchForm.get('todate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');

    const t007_reportlogobj: any = {};
    const modulename = 'TrackingNumberreport';

    t007_reportlogobj['fromDate'] = dateFrom;
    t007_reportlogobj['toDate'] = dateTo;
    t007_reportlogobj['t001ClientProfile'] = this.userProfifle;
    t007_reportlogobj['reportType'] = 'Tracking_Number_Report';
    t007_reportlogobj['reportName'] = 'Tracking Number Report';
    t007_reportlogobj['designFileName'] = 'TrackingNumberFullReport_Excel';
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['reportFormat'] = 'CSV';
    t007_reportlogobj['moduleName'] = modulename;
    t007_reportlogobj['chargeDes'] = this.searchForm.get('chargeSource')?.value;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientname'] = this.clientName;
    t007_reportlogobj['crmaccountNumber'] = this.searchForm.get('trackingNumber')?.value.replace(/[ ]/g, '_');
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;

    this.httpClientService.runReport(t007_reportlogobj).subscribe(
      (result: any) => {
        this.saveOrUpdateReportLogResult(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);
    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '420px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

    dialogConfig.afterClosed().subscribe((result) => {
      this.dialogValue = result?.data;
    });
  }

  searchUserFedEx() {
    const dateFr = this.fedexFormGroup.get('fromdate')?.value;
    const dateT = this.fedexFormGroup.get('todate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const chargeSource = this.fedexFormGroup.get('chargeSource')?.value;
    const trackingNumber = this.fedexFormGroup.get('trackingNumber')?.value;

    if (chargeSource != '' && trackingNumber != '') {
      const dateFrYear = dateFr.getFullYear();
      const dateTYear = dateT.getFullYear();
      const yearDiff = dateTYear - dateFrYear;

      if (yearDiff > 1) {
        this.openModal('Time Frame Greater than 2 years');
        return;
      }

      this.openLoading();
      this.searchUserobj = {
        clientId: (this.clientID).toString(),
        clientname: this.clientName,
        fromdate: dateFrom,
        todate: dateTo,
        basisValue: this.clientType,
        trackingNumber: this.fedexFormGroup.get('trackingNumber')?.value,
        receiverPostal: this.fedexFormGroup.get('trackingNumber')?.value,
        chargeSource: this.fedexFormGroup.get('chargeSource')?.value
      };

      this.fedexFormGroup.get('clientname')?.setValue(this.clientName);
      this.fedexFormGroup.get('trackingNumber')?.setValue(trackingNumber);
      this.fedexFormGroup.get('receiverPostal')?.setValue(trackingNumber);
      this.fedexFormGroup.get('chargeSource')?.setValue(chargeSource);

      this.fetchTrakingnumberFedEx(this.searchUserobj);
    } else {
      this.openModal('Pleace fill required field');
    }
  }

  fetchTrakingnumberFedEx(resParam: any) {
    this.httpfedexService.fetchTrakingnumber(resParam).subscribe(
      (result: any) => {
        const resultObj: any = result;

        if (resultObj.length > 0) {
          this.dataNoneTxtFedEx = false;
          this.showTableFedEx = true;
          this.showCount = true;
          this.trackingListFedEx(resultObj);
          this.closeLoading();
        } else {
          this.closeLoading();
          this.openModal('No data found!');
          this.trackingListFedEx(null);
        }
      },
      (error: any) => {
        this.closeLoading();
        console.log('error', error);
      }
    );
  }

  trackingListFedEx(event: any) {
    this.trackingACFedEx = event;
    let tempObj: any = {};
    let refund: number = 0;
    let amount: number = 0;

    if (this.trackingACFedEx == null || this.trackingACFedEx.length == 0) {
      this.commoncollACFedExObjList = null;
      this.showTableFedEx = true;
      this.dataNoneTxtFedEx = true;
      this.showCount = false;
      return;
    }

    if (this.trackingACFedEx != null && this.trackingACFedEx.length != 0) {
      this.commoncollACFedEx = [];
      this.commoncollACFedExObjList = [];

      for (let listcount = 0; listcount < this.trackingACFedEx.length; listcount++) {
        tempObj = {};

        if (this.trackingACFedEx.length == 1) {
          refund = 0.0;
          amount = Number(this.trackingACFedEx[listcount].netAmount);
        }

        tempObj['invoiceId'] = this.trackingACFedEx[listcount].invoiceId;
        tempObj['trackingNumber'] = this.trackingACFedEx[listcount].trackingNumber;
        tempObj['type'] = 'FedEx';
        tempObj['accountNumber'] = this.trackingACFedEx[listcount].accountNumber;
        tempObj['invoiceNumber'] = this.trackingACFedEx[listcount].invoiceNumber;
        tempObj['invoiceDate'] = this.trackingACFedEx[listcount].invoiceDate;
        tempObj['invoiceDueDate'] = this.trackingACFedEx[listcount].invoiceDueDate;
        tempObj['packageQuantity'] = this.trackingACFedEx[listcount].packageQuantity;
        tempObj['netAmount'] = '$ ' + Number(this.trackingACFedEx[listcount].netAmount).toFixed(2);
        tempObj['gstamount'] = '$ ' + refund.toFixed(2);
        tempObj['total'] = '$ ' + Number(this.trackingACFedEx[listcount].netAmount).toFixed(2);

        this.commoncollACFedEx.push(tempObj);
      }

      if (this.commoncollACFedEx.length > 1) {
        this.commoncollACFedExObjList = this.commoncollACFedEx;
        this.tableCount = this.commoncollACFedExObjList.length;
      } else {
        this.showTableFedEx = false;
        this.showCount = false;
        this.getFedExTrackingDetail(this.commoncollACFedEx[0]);
      }
    }
  }

  saveSearchHitDetails() {
    this.httpfedexService.saveSearchHitDetails(this.fedexFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  ngOnDestroy() {
    this.onSetCommonAc?.unsubscribe();
  }

  generatetrackingexcel(trackingNo: any) {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.searchForm.get('todate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');

    const t007_reportlogobj: any = {};
    const modulename = 'TrackingNumberreport';

    t007_reportlogobj['fromDate'] = dateFrom;
    t007_reportlogobj['toDate'] = dateTo;
    t007_reportlogobj['t001ClientProfile'] = this.userProfifle;
    t007_reportlogobj['reportType'] = 'UPS_Tracking_Number_Report';
    t007_reportlogobj['reportName'] = 'Tracking Number Report';
    t007_reportlogobj['designFileName'] = 'TrackingNumber_Excel';
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['reportFormat'] = 'CSV';
    t007_reportlogobj['moduleName'] = modulename;
    t007_reportlogobj['chargeDes'] = trackingNo;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientname'] = this.clientName;
    t007_reportlogobj['crmaccountNumber'] = 'T004_' + this.clientName + '_' + this.datePipe.transform(dateT, 'yyyy');
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;

    this.httpClientService.runReport(t007_reportlogobj).subscribe(
      (result: any) => {
        this.saveOrUpdateReportLogResult(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  generatetrackingexcelFedex(trackingNo: any) {
    const urlParam: any = {};
    const dateFr = this.fedexFormGroup.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.fedexFormGroup.get('todate')?.value;
    const dateTo: any = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const currentDate = new Date();

    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['reportName'] = 'TRACKING_NUMBER_EXCEL';
    urlParam['reportType'] = 'TRACKING_NUMBER_EXCEL';
    urlParam['reportFormat'] = 'excel';
    urlParam['accNo'] = '';
    urlParam['accountNumber'] = '';
    urlParam['clientName'] = this.clientName;
    urlParam['tableName'] = 'T001_' + this.clientName.replace(/[ ]/g, '_') + '_Invoice_2015';
    urlParam['clientId'] = this.clientID;
    urlParam['fromDate'] = dateFrom;
    urlParam['toDate'] = dateTo.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = 'TrackingNo_Report';
    urlParam['status'] = 'IN QUEUE';
    urlParam['desc'] = '';
    urlParam['grp'] = '';
    urlParam['chargeType'] = trackingNo;
    urlParam['chargeDesc'] = this.clientName.replace(/[^a-zA-Z0-9 ]/g, '');
    urlParam['chargeGroup'] = '';
    urlParam['t002ClientProfileobj'] = this.userProfifle;

    this.httpfedexService.runReport(urlParam).subscribe((result: any) => {
      this.saveOrUpdateReportLogResultFedex(result);
    });
  }

  saveOrUpdateReportLogResultFedex(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');
  }

  image_clickHandlerFedex() {
    if (this.commoncollACFedExObjList == null) {
      this.openModal('No data found!');
      return;
    }

    const urlParam: any = {};
    const dateFr = this.fedexFormGroup.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.fedexFormGroup.get('todate')?.value;
    const dateTo: any = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const currentDate = new Date();

    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['reportName'] = 'TRACKING_NUMBER_FULLREPORT_EXCEL';
    urlParam['reportType'] = 'TRACKING_NUMBER_FULLREPORT_EXCEL';
    urlParam['reportFormat'] = 'excel';
    urlParam['accNo'] = '';
    urlParam['accountNumber'] = '';
    urlParam['clientName'] = this.clientName;
    urlParam['tableName'] = 'T001_' + this.clientName.replace(/[ ]/g, '_') + '_Invoice_2015';
    urlParam['clientId'] = this.clientID;
    urlParam['fromDate'] = dateFrom;
    urlParam['toDate'] = dateTo.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = 'TrackingNo_Report';
    urlParam['status'] = 'IN QUEUE';
    urlParam['desc'] = '';
    urlParam['grp'] = '';
    urlParam['chargeType'] = this.fedexFormGroup.get('trackingNumber')?.value.replace(/[ ]/g, '_');
    urlParam['chargeDesc'] = this.clientName.replace(/[^a-zA-Z0-9 ]/g, '');
    urlParam['chargeGroup'] = this.fedexFormGroup.get('chargeSource')?.value;
    urlParam['t002ClientProfileobj'] = this.userProfifle;

    this.httpfedexService.runReport(urlParam).subscribe(
      (result: any) => {
        this.saveOrUpdateReportLogResultFedex(result);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  generatetrackingpdf(trackingNo: any) {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.searchForm.get('todate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const clientName = this.clientName.replace(/[^a-zA-Z0-9 ]/g, '');

    const Master_reportlogobj: any = {};
    Master_reportlogobj['fromdate'] = dateFrom;
    Master_reportlogobj['todate'] = dateTo;
    Master_reportlogobj['chargeSource'] = 'Tracking Number';
    Master_reportlogobj['trackingNumber'] = trackingNo;
    Master_reportlogobj['clientId'] = this.clientID.toString();
    Master_reportlogobj['clientname'] = clientName;
    Master_reportlogobj['typeCode1'] = 'UPS_Tracking_Number_Report';
    Master_reportlogobj['basisValue'] = this.clientType;

    this.fetch_TrackingReport(Master_reportlogobj);
    this.openModal('Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.');
  }

  fetch_TrackingReport(param: any) {
    this.httpClientService.fetch_TrackingReport(param).subscribe(
      (result: any) => {
        const urlParam: any = {};
        urlParam['pdfpath'] = result;
        urlParam['action'] = 'Trackingnumberreport';

        let fields_string = '';
        for (const [key, value] of Object.entries(urlParam)) {
          fields_string += key + '=' + value + '&';
        }

        this.httpClientService.reportServlet(fields_string);
      },
      (error: any) => {
        console.log('error ', error);
      }
    );
  }

  generatetrackingpdfFedex(trackingNo: any, invoiceId: any) {
    const dateFr = this.fedexFormGroup.get('fromdate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.fedexFormGroup.get('todate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');
    const clientName = this.clientName.replace(/[ ]/g, '_');

    const Master_reportlogobj: any = {};
    Master_reportlogobj['fromdate'] = dateFrom;
    Master_reportlogobj['todate'] = dateTo;
    Master_reportlogobj['chargeSource'] = 'Tracking Number';
    Master_reportlogobj['trackingNumber'] = trackingNo;
    Master_reportlogobj['clientId'] = this.clientID.toString();
    Master_reportlogobj['clientname'] = clientName;
    Master_reportlogobj['invoiceId'] = invoiceId;
    Master_reportlogobj['type'] = 'Fedex_Tracking_Number_Report';

    this.fedexFetch_TrackingReport(Master_reportlogobj);
    this.openModal('Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.');
  }

  fedexFetch_TrackingReport(param: any) {
    this.httpfedexService.fedexFetch_TrackingReport(param).subscribe(
      (result: any) => {
        const urlParam: any = {};
        urlParam['pdfpath'] = result;
        urlParam['action'] = 'Trackingnumberreport';

        let fields_string = '';
        for (const [key, value] of Object.entries(urlParam)) {
          fields_string += key + '=' + value + '&';
        }

        this.httpfedexService.reportServlet(fields_string);
      },
      (error: any) => {
        console.log('error ', error);
      }
    );
  }
}