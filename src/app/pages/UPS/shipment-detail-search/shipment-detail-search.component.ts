import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { environment } from 'src/environments/environment';
import { TrackingPopupModalComponent } from '../tracking/modal/modal.component';
import { TrackingPopupFedexComponent } from '../tracking/tracking-popup-fedex/tracking-popup-fedex.component';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { TrackingPopupComponent } from './tracking-popup/tracking-popup.component';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';

@Component({
  selector: 'app-shipment-detail-search',
  templateUrl: './shipment-detail-search.component.html',
  styleUrls: ['./shipment-detail-search.component.scss'],
  standalone: false
})

/**
 * Create Component
 */
export class ShipmentDetailSearchComponent implements OnInit {

  @ViewChild('criteria', { static: true }) criteria: any;
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
  });
  loginId: Number = 123;
  userProfifleData: any;
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
  })
  resultObj: any;
  fetchTrakingnumberRes: any;
  trackingAC: any;
  value: any;
  uniquetrackinglistAC: any = [];
  commoncollAC: any = [];
  commoncollAC_value: any = [];
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
  testTempObj = [];
  total: any;
  disamount: any;
  clientName: any;
  clientId: any;
  selectedOptionText: any;
  upsInternalUseName: any;
  searchForm: FormGroup;
  userProfifle: any;
  searchUserobj: any;
  fromDate: any;
  toDate: any;
  isLoading = true;
  clientID: any;
  showTable: any;
  showCount = false;
  dataNoneTxt: any; clientNameSearch: any;

  ///*Fedex API *////
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
  })
  clientType: any;
  showTableFedEx: any;
  panelClass: any;
  dataNoneTxtFedEx: any;
  // private onSetCommonAc: Subscription;
  currentDate: any;
  randomNumber: any;
  private sessionPayload: any | null = null;
  private onSetCommonAc!: Subscription;
  pendingSearchUserobj: any = null;

  ///*Fedex API *////
  constructor(private loaderService: LoaderService, private cookiesService: CookiesService,
    private httpClientService: HttpClientService, public dialog: MatDialog, private router: Router, private commonService: CommonService,
    private datePipe: DatePipe, private cd: ChangeDetectorRef, private httpfedexService: HttpfedexService
    , private switchProj: SwitchProjectService
  ) {

    this.searchForm = new FormGroup({
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
    this.cookiesService.checkForClientName();
    this.sessionPayload = this.switchProj.getTrackingPayload();

    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
      if (this.clientType == "OnTrac" || this.clientType == "Dhl") {
        this.router.navigate(['/dashboard/dashboard']);
      }
    });
    ;
    // if (localStorage.getItem('payload')) {
    //   let searchUserobj: any = localStorage.getItem('payload');
    //   this.searchUserobj = JSON.parse(searchUserobj);
    //   if (this.searchUserobj != undefined) {
    //     var fromDatefrmDashbrd: any = this.datePipe.transform(this.searchUserobj.fromdate, "MM-dd-yyyy");
    //     var toDatefrmDashbrd: any = this.datePipe.transform(this.searchUserobj.todate, "MM-dd-yyyy");
    //     if (this.searchUserobj.basisValue == "UPS") {
    //       const getUserDeatails = this.getUser();
    //       this.clientName = this.searchUserobj.clientname;
    //       this.searchForm.get('chargeSource')?.setValue(this.searchUserobj.chargeSource);
    //       this.searchForm.get('trackingNumber')?.setValue(this.searchUserobj.trackingNumber);
    //       this.searchForm.patchValue({
    //         dateRange: {
    //           "start": new Date(this.searchUserobj.fromdate), "end": new Date(this.searchUserobj.todate)
    //         }
    //       });

    //       if (this.searchUserobj != undefined) {
    //         this.searchForm.get('fromdate')?.setValue(new Date(fromDatefrmDashbrd));
    //         this.searchForm.get('todate')?.setValue(new Date(toDatefrmDashbrd));
    //       }
    //       this.openLoading();
    //       this.fetch_Trakingnumber(this.searchUserobj);
    //     } else {
    //       const getUserDeatails = this.getUser();
    //       this.openLoading();
    //       this.fedexFormGroup.get('chargeSource')?.setValue(this.searchUserobj.chargeSource);
    //       this.fedexFormGroup.get('trackingNumber')?.setValue(this.searchUserobj.trackingNumber);
    //       this.fedexFormGroup.patchValue({
    //         dateRange: { "start": new Date(this.searchUserobj.fromdate), "end": new Date(this.searchUserobj.todate) }
    //       });
    //       this.clientName = this.searchUserobj.clientname;
    //       this.clientNameSearch = this.searchUserobj.clientname.replace(/[ ]/g, "_");
    //       if (this.searchUserobj != undefined) {
    //         this.fedexFormGroup.get('fromdate')?.setValue(new Date(fromDatefrmDashbrd));
    //         this.fedexFormGroup.get('todate')?.setValue(new Date(toDatefrmDashbrd));
    //       }
    //       this.fetchTrakingnumberFedEx(this.searchUserobj);
    //     }
    //   }

    // }
    this.onSetCommonAc = this.switchProj.setCommonAc().subscribe((respsearchUserobj: any) => {
      this.pendingSearchUserobj = respsearchUserobj?.[0] ?? null;
    });
  }

  showColumnPicker = false;
  toggleColumnPicker() {
    this.showColumnPicker = !this.showColumnPicker;
  }
  ngOnInit(): void {

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.getUser();
    if (this.clientType == "UPS") {
      this.openLoading()
      this.showTable = false;
      this.dataNoneTxt = false;
      this.showCount = false;
    }
    else if (this.clientType == "FedEx") {
      this.showTableFedEx = false;
      this.openLoading();
      this.dataNoneTxtFedEx = false;
      this.showCount = false;
    }

    const resolvedPayload = this.sessionPayload ?? this.pendingSearchUserobj ?? null;

    if (resolvedPayload) {
      this.searchUserobj = resolvedPayload;

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
  }


  private applyUpsDashboardValues(data: any) {
    if (data.clientId) this.clientID = data.clientId;
    if (data.clientname) this.clientName = data.clientname;

    this.searchForm.patchValue({
      clientId: (this.clientID)?.toString() || '',
      clientname: this.clientName || '',
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
    if (data.clientId) this.clientID = data.clientId;
    if (data.clientname) this.clientName = data.clientname;
    this.clientNameSearch = this.clientName?.replace(/[ ]/g, '_');

    this.fedexFormGroup.patchValue({
      clientId: (this.clientID)?.toString() || '',
      clientname: this.clientName || '',
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


  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }
  carrierType: any;
  spreadSearchUserobj: any;
  async getUser() {
    var date = new Date();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);
    var tempmonthStartDay: any = monthStartDay.toString();
    var tempmonthEndDay: any = monthEndDay.toString();

    //trackingDate 
    this.toDate = this.datePipe.transform(monthEndDay, "yyyy-MM-dd");
    this.fromDate = this.datePipe.transform(monthStartDay, "yyyy-MM-dd");

    if (this.searchUserobj == undefined) {//9126
      if (this.clientType == "UPS") {
        this.searchForm.get('fromdate')?.setValue(new Date(tempmonthStartDay));
        this.searchForm.get('todate')?.setValue(new Date(tempmonthEndDay));
      } else {
        let fromdateTemp: any = tempmonthStartDay;
        this.fedexFormGroup.get('fromdate')?.setValue(new Date(fromdateTemp));
        this.fedexFormGroup.get('todate')?.setValue(new Date(tempmonthEndDay));
      }
    }
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    if (this.clientType == "UPS") {
      this.clientID = await this.userProfifle.clientId;
      this.clientName = await this.userProfifle.clientName;
      let currentDate: any = this.datePipe.transform(this.userProfifle.dataasof, "MM/dd/yyyy")
      this.currentDate = new Date(currentDate);
    }
    if (this.clientType == "FedEx") {
      this.clientID = await this.userProfifle.clientId;
      this.clientName = await this.userProfifle.clientName.replace(/[ ]/g, "_");
      var strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
      var strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
      var strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);
      let currentDate: any = this.datePipe.transform(strMonthEnd + "/" + strDateEnd + "/" + strYearEnd, "MM/dd/yyyy")
      this.currentDate = new Date(currentDate);
    }


    if (this.searchUserobj == undefined) {
      this.closeLoading();
    }
  }



  searchUser() {
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateT = this.searchForm.get('todate')?.value;

    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    this.datePipe.transform(dateT, "yyyy-MM-dd");
    var chargeSource = this.searchForm.get('chargeSource')?.value;
    var trackingNumber = this.searchForm.get('trackingNumber')?.value;
    if (chargeSource != '' && trackingNumber != '') {
      var dateFrYear = dateFr.getFullYear();// 9126 
      var dateTYear = dateT.getFullYear();
      var yearDiff = dateTYear - dateFrYear;
      if (yearDiff > 1) {
        this.openModal("Time Frame Greater than 2 years");
        return;
      }
      this.openLoading();
      this.searchUserobj = {
        clientId: (this.clientID).toString(),
        clientname: this.clientName,
        fromdate: dateFrom,
        todate: dateTo,
        basisValue: "UPS",
        trackingNumber: this.searchForm.get('trackingNumber')?.value,
        receiverPostal: this.searchForm.get('trackingNumber')?.value,
        chargeSource: this.searchForm.get('chargeSource')?.value,

      };
      this.fetch_Trakingnumber(this.searchUserobj);
    }
    else {
      this.openModal("Pleace fill required field");
      return;
    }
  }



  async fetch_Trakingnumber(searchUserobjValue: any) {

    this.openLoading();
    await this.httpClientService.fetch_Trakingnumber(searchUserobjValue).subscribe(
      result => {
        this.fetchTrakingnumberRes = result;
        if (this.fetchTrakingnumberRes.length > 0) {
          this.dataNoneTxt = false;
          this.showTable = true;
          this.showCount = true;
          this.trackingList(this.fetchTrakingnumberRes);
          this.closeLoading();
        } else {
          this.closeLoading();
          this.openModal("No data found!");
          this.trackingList(null);

        }
      },
      error => {
        console.log('error ', error);

      })
  }


  saveOrUpdateReportLog() {
    this.httpClientService.saveOrUpdateReportLog(this.apiControllerFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log('error ', error);

      })
  }
  ///*Fedex API *////


  fetchservicefedex() {
    this.httpfedexService.fetchservicefedex(this.fedexFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log('error', error);
      })
  }


  searchClickCnt = 0;
  tableCount = 0;
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
        var tempObj: any = [];
        this.trackingnumber = this.uniquetrackinglistAC[distinctlistcount].toString();
        this.packagecount = 0;
        this.amount = 0;
        this.refund = 0;
        this.netdue = 0;
        this.total = 0;
        for (var listcount = 0; listcount < this.trackingAC.length; listcount++) {
          if (this.trackingnumber == this.trackingAC[listcount].trackingNumber) {
            this.packagecount += Number(this.trackingAC[listcount].packageQuantity);


            this.disamount += Number(this.trackingAC[listcount].incentiveAmount);
            if (this.trackingAC[listcount].chargeCategoryDetailCode == "CADJ" || this.trackingAC[listcount].chargeCategoryDetailCode == "VOID" || this.trackingAC[listcount].chargeCategoryDetailCode == "GSR") {
              this.refund += Number(this.trackingAC[listcount].netAmount);
            }
            else {
              this.amount += Number(this.trackingAC[listcount].netAmount);
            }
            this.invoiceNumber = this.trackingAC[listcount].invoiceNumber.toString();
            this.invoiceDate = this.trackingAC[listcount].invoiceDate.toString();
            this.accountNumber = this.trackingAC[listcount].accountNumber.toString();
            this.transactionDate = this.trackingAC[listcount].transactionDate.toString();


          }
        }
        this.total = this.amount + this.refund;

        tempObj["trackingNumber"] = this.trackingnumber;
        tempObj["containerType"] = "UPS";
        tempObj["accountNumber"] = this.accountNumber;
        tempObj["invoiceNumber"] = this.invoiceNumber;
        tempObj["invoiceDate"] = this.invoiceDate;
        tempObj["transactionDate"] = this.transactionDate;
        tempObj["packageQuantity"] = this.packagecount.toString();
        tempObj["netAmount"] = "$ " + this.amount.toFixed(2)
        tempObj["gstamount"] = "$ " + this.refund.toFixed(2)
        tempObj["total"] = "$ " + this.total.toFixed(2)
        this.commoncollAC_value.push(tempObj);

      }

      if (this.commoncollAC_value.length > 1) {
        this.commoncollAC = this.commoncollAC_value;
        this.tableCount = this.commoncollAC.length;
      }
      else {
        this.showTable = false;
        this.dataNoneTxt = false;
        this.showCount = false;
        this.getTrackingDetail(this.commoncollAC_value[0]);
      }

      this.searchClickCnt++;

    }
    this.closeLoading();
  }

  dialogValue: any;
  sendValue: any;
  fromdate: any;
  todate: any;
  fetch_trackingForModal = [];

  async getTrackingDetail(trackingParam: any) {
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.searchForm.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var modulename = "TrackingNumberreport";
    var trackingobj = {
      clientname: this.clientName,
      fromdate: this.searchUserobj.fromdate,
      todate: this.searchUserobj.todate,
      trackingNumber: trackingParam.trackingNumber,
      basisValue: trackingParam.containerType,
      chargeSource: "Tracking Number",
      themeoption: this.themeoption,
      fromDate: dateFrom,
      toDate: dateTo,
      t001ClientProfile: this.userProfifle,
      reportType: "UPS_Tracking_Number_Report",
      designFileName: "TrackingNumber_Excel",
      status: 'IN QUEUE',
      reportFormat: "CSV",
      moduleName: modulename,
      chargeDes: trackingParam.trackingNumber,
      clientId: this.searchUserobj.clientId,
      crmaccountNumber: "T004_" + this.clientName + "_" + this.datePipe.transform(dateT, "yyyy"),
      login_id: this.loginId.toString(),
      fzone: 0,
      tzone: 0
    }
    this.sendValue = null;
    this.sendValue = trackingobj;

    this.openDialog();

  }

  async getFedExTrackingDetail(trackingParam: any) {
    var dateFr = this.fedexFormGroup.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.fedexFormGroup.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var modulename = "TrackingNumberreport";
    var userData = this.userProfifle;
    if (this.searchUserobj.t002ClientProfileObj != null || this.searchUserobj.t002ClientProfileObj != undefined) {
      userData = this.searchUserobj.t002ClientProfileObj[0];
    }
    var trackingobj = {
      invoiceId: trackingParam.invoiceId,
      clientname: this.clientName,
      fromdate: this.searchUserobj.fromdate,
      todate: this.searchUserobj.todate,
      trackingNumber: trackingParam.trackingNumber,
      carrierType: trackingParam.type,
      chargeSource: "Tracking Number",
      themeoption: this.themeoption,

      t002ClientProfileObj: userData,

      reportType: "TRACKING_NUMBER_EXCEL",
      designFileName: "TrackingNumber_Excel",
      status: 'IN QUEUE',
      reportFormat: "excel",
      moduleName: modulename,
      chargeDes: trackingParam.trackingNumber,
      clientId: this.searchUserobj.clientId,
      crmaccountNumber: "T004_" + this.clientName + "_" + this.datePipe.transform(dateT, "yyyy"),
      reportName: "TRACKING_NUMBER_EXCEL;",
      login_id: this.loginId.toString(),
      fzone: 0,
      tzone: 0
    }
    this.sendValue = null;
    this.sendValue = trackingobj;
    this.openTrackingFedExDialog();

  }

  openDialog() {
    const dialogRef = this.dialog.open(TrackingPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,

      data: {
        pageValue: this.sendValue,
        panelClass: this.panelClass
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
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

    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }

  image_clickHandler() {
    if (this.commoncollAC == null) {
      this.openModal("No data found!");
      return;
    }
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.searchForm.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var t007_reportlogobj: any = {};
    var modulename = "TrackingNumberreport";
    var reportfromat = "CSV";
    t007_reportlogobj['fromDate'] = dateFrom;
    t007_reportlogobj['toDate'] = dateTo;
    t007_reportlogobj['t001ClientProfile'] = this.userProfifle;
    t007_reportlogobj['reportType'] = "Tracking_Number_Report";
    t007_reportlogobj['reportName'] = "Tracking Number Report";
    t007_reportlogobj['designFileName'] = "TrackingNumberFullReport_Excel";
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['reportFormat'] = "CSV"
    t007_reportlogobj['moduleName'] = modulename;
    t007_reportlogobj['chargeDes'] = this.searchForm.get('chargeSource')?.value;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientname'] = this.clientName;
    t007_reportlogobj['crmaccountNumber'] = this.searchForm.get('trackingNumber')?.value.replace(/[ ]/g, "_");
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;
    this.httpClientService.runReport(t007_reportlogobj).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
        console.log(error);
      });
  }


  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
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

  ///fedex code starts///

  searchUserFedEx() {
    var dateFr: any = this.fedexFormGroup.get('fromdate')?.value;
    var dateT: any = this.fedexFormGroup.get('todate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var chargeSource: any = this.fedexFormGroup.get('chargeSource')?.value;
    var trackingNumber: any = this.fedexFormGroup.get('trackingNumber')?.value;
    if (chargeSource != '' && trackingNumber != '') {
      var dateFrYear = dateFr.getFullYear();// 9126 
      var dateTYear = dateT.getFullYear();
      var yearDiff = dateTYear - dateFrYear;
      if (yearDiff > 1) {
        this.openModal("Time Frame Greater than 2 years");
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
        chargeSource: this.fedexFormGroup.get('chargeSource')?.value,

      };
      this.fedexFormGroup.get('clientname')?.setValue(this.clientName);
      this.fedexFormGroup.get('trackingNumber')?.setValue(trackingNumber);
      this.fedexFormGroup.get('receiverPostal')?.setValue(trackingNumber);
      this.fedexFormGroup.get('chargeSource')?.setValue(chargeSource);
      this.fetchTrakingnumberFedEx(this.searchUserobj);
    }
    else {
      this.openModal("Pleace fill required field");
    }
  }

  async fetchTrakingnumberFedEx(resParam: any) {
    await this.httpfedexService.fetchTrakingnumber(resParam).subscribe(
      result => {
        var resultObj: any = result;

        if (resultObj.length > 0) {
          this.dataNoneTxtFedEx = false;
          this.showTableFedEx = true;
          this.showCount = true;
          this.trackingListFedEx(resultObj);
          this.closeLoading();
        } else {
          this.closeLoading();
          this.openModal("No data found!");
          this.trackingListFedEx(null);

        }
      },
      (error: any) => {
        console.log('error', error);
      })
  }

  commoncollACFedEx: any = [];
  trackingACFedEx: any = [];
  trackignnumberpopupFedEx: any;
  t002clntProObj = {};
  commoncollACFedExObjList: any;
  trackingListFedEx(event: any) {


    this.trackingACFedEx = event;
    var tempObj: any = {};
    var trackingnumber: any = null;
    var privioustrackingnumber: any = null;
    var packagecount: Number = 0;
    var amount: Number = 0;
    var refund: Number = 0;
    var netdue: Number = 0;
    var total: Number = 0;
    var frtamount: Number = 0;
    var disamount: Number = 0;
    var unique: Object = {};
    var value: String;

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
      for (var listcount = 0; listcount < this.trackingACFedEx.length; listcount++) {
        tempObj = {};
        if (this.trackingACFedEx.length == 1) {

          refund = 0.0;
          amount = Number(this.trackingACFedEx[listcount].netAmount);
        }


        tempObj["invoiceId"] = this.trackingACFedEx[listcount].invoiceId;
        tempObj["trackingNumber"] = this.trackingACFedEx[listcount].trackingNumber;
        tempObj["type"] = "FedEx";
        tempObj["accountNumber"] = this.trackingACFedEx[listcount].accountNumber;
        tempObj["invoiceNumber"] = this.trackingACFedEx[listcount].invoiceNumber;
        tempObj["invoiceDate"] = this.trackingACFedEx[listcount].invoiceDate;
        tempObj["invoiceDueDate"] = this.trackingACFedEx[listcount].invoiceDueDate;
        tempObj["packageQuantity"] = this.trackingACFedEx[listcount].packageQuantity;
        tempObj["netAmount"] = "$ " + Number(this.trackingACFedEx[listcount].netAmount).toFixed(2);
        tempObj["gstamount"] = "$ " + refund.toFixed(2)
        tempObj["total"] = "$ " + Number(this.trackingACFedEx[listcount].netAmount).toFixed(2);
        this.commoncollACFedEx.push(tempObj);

      }
      if (this.commoncollACFedEx.length > 1) {
        this.commoncollACFedExObjList = this.commoncollACFedEx;
        this.tableCount = this.commoncollACFedExObjList.length;
      }
      else {
        this.showTableFedEx = false;
        this.showCount = false;
        this.getFedExTrackingDetail(this.commoncollACFedEx[0]);
      }
    }


  }

  saveSearchHitDetails() {
    this.httpfedexService.saveSearchHitDetails(this.fedexFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log('error', error);
      })
  }

  ngOnDestroy() {
    // this.onSetCommonAc.unsubscribe();
  }


  generatetrackingexcel(trackingNo: any) {
    var dateVal = this.searchForm.get('dateRange')?.value;
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.searchForm.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var t007_reportlogobj: any = {};
    var modulename = "TrackingNumberreport";
    var reportfromat = "CSV";
    t007_reportlogobj['fromDate'] = dateFrom;
    t007_reportlogobj['toDate'] = dateTo;
    t007_reportlogobj['t001ClientProfile'] = this.userProfifle;
    t007_reportlogobj['reportType'] = "UPS_Tracking_Number_Report";
    t007_reportlogobj['reportName'] = "Tracking Number Report";
    t007_reportlogobj['designFileName'] = "TrackingNumber_Excel";
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['reportFormat'] = "CSV"
    t007_reportlogobj['moduleName'] = modulename;
    t007_reportlogobj['chargeDes'] = trackingNo;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientname'] = this.clientName;
    t007_reportlogobj['crmaccountNumber'] = "T004_" + this.clientName + "_" + this.datePipe.transform(dateT, "yyyy");
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;
    this.httpClientService.runReport(t007_reportlogobj).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
        console.log(error);
      });
  }

  async generatetrackingexcelFedex(trackingNo: any) {

    var urlParam: any = {};
    var dateVal = this.fedexFormGroup.get('dateRange')?.value;
    var dateFr = this.fedexFormGroup.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.fedexFormGroup.get('todate')?.value;
    var dateTo: any = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var currentDate = new Date();

    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['reportName'] = "TRACKING_NUMBER_EXCEL";
    urlParam['reportType'] = "TRACKING_NUMBER_EXCEL";

    urlParam['reportFormat'] = "excel";

    urlParam['accNo'] = "";
    urlParam['accountNumber'] = "";
    urlParam['clientName'] = this.clientName;
    urlParam['tableName'] = "T001_" + this.clientName.replace(/[ ]/g, "_") + "_Invoice_2015";
    urlParam['clientId'] = this.clientID;
    urlParam['fromDate'] = dateFrom;
    urlParam['toDate'] = dateTo.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = "TrackingNo_Report";
    urlParam['status'] = "IN QUEUE";

    urlParam['desc'] = "";
    urlParam['grp'] = "";
    urlParam['chargeType'] = trackingNo;
    urlParam['chargeDesc'] = this.clientName.replace(/[^a-zA-Z0-9 ]/g, "");
    urlParam['chargeGroup'] = "";

    urlParam['t002ClientProfileobj'] = this.userProfifle;
    this.httpfedexService.runReport(urlParam).subscribe(
      result => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error => {
      });

  }
  async saveOrUpdateReportLogResultFedex(result: any) {

    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");


  }


  image_clickHandlerFedex() {
    if (this.commoncollACFedExObjList == null) {
      this.openModal("No data found!");
      return;
    }
    var urlParam: any = {};
    var dateVal = this.fedexFormGroup.get('dateRange')?.value;
    var dateFr = this.fedexFormGroup.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.fedexFormGroup.get('todate')?.value;
    var dateTo: any = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var clientName = this.clientName.replace(/[^a-zA-Z0-9 ]/g, "");
    var currentDate = new Date();

    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['reportName'] = "TRACKING_NUMBER_FULLREPORT_EXCEL";
    urlParam['reportType'] = "TRACKING_NUMBER_FULLREPORT_EXCEL";

    urlParam['reportFormat'] = "excel";

    urlParam['accNo'] = "";
    urlParam['accountNumber'] = "";
    urlParam['clientName'] = this.clientName;

    urlParam['tableName'] = "T001_" + this.clientName.replace(/[ ]/g, "_") + "_Invoice_2015";
    urlParam['clientId'] = this.clientID;
    urlParam['fromDate'] = dateFrom;
    urlParam['toDate'] = dateTo.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = "TrackingNo_Report";
    urlParam['status'] = "IN QUEUE";

    urlParam['desc'] = "";
    urlParam['grp'] = "";
    let trackingNumberReplace: any = this.fedexFormGroup.get("trackingNumber")?.value;
    urlParam['chargeType'] = trackingNumberReplace.replace(/[ ]/g, "_");
    urlParam['chargeDesc'] = this.clientName.replace(/[^a-zA-Z0-9 ]/g, "");
    urlParam['chargeGroup'] = this.fedexFormGroup.get('chargeSource')?.value;

    urlParam['t002ClientProfileobj'] = this.userProfifle;
    this.httpfedexService.runReport(urlParam).subscribe(
      result => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error => {
        console.log(error);
      });
  }

  generatetrackingpdf(trackingNo: any) {

    var dateVal = this.searchForm.get('dateRange')?.value;
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.searchForm.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var clientName = this.clientName.replace(/[^a-zA-Z0-9 ]/g, "");
    var reportfromat = "PDF"
    var Master_reportlogobj: any = {};
    Master_reportlogobj["fromdate"] = dateFrom;
    Master_reportlogobj["todate"] = dateTo;
    Master_reportlogobj["chargeSource"] = "Tracking Number";
    Master_reportlogobj["trackingNumber"] = trackingNo;
    Master_reportlogobj["clientId"] = this.clientID.toString();
    Master_reportlogobj["clientname"] = clientName;

    Master_reportlogobj["typeCode1"] = "UPS_Tracking_Number_Report";
    Master_reportlogobj["basisValue"] = this.clientType;
    this.fetch_TrackingReport(Master_reportlogobj);
    this.openModal("Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.");


  }

  fetch_TrackingReport(param: any) {
    this.httpClientService.fetch_TrackingReport(param).subscribe(
      result => {
        var resultObj = result;
        var urlParam: any = {};
        var urlObj: any = {};
        var date = new Date();
        var dateValue = this.datePipe.transform(date, "yyyy-MM-dd");
        urlParam['pdfpath'] = resultObj;
        urlParam['action'] = 'Trackingnumberreport';
        var fields_string: any = "";
        for (const [key, value] of Object.entries(urlParam)) {
          fields_string += key + '=' + value + '&';
        }
        this.httpClientService.reportServlet(fields_string);
      },
      error => {
        console.log('error ', error);

      })
  }

  generatetrackingpdfFedex(trackingNo: any, invoiceId: any) {

    var dateVal = this.fedexFormGroup.get('dateRange')?.value;
    var dateFr = this.fedexFormGroup.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.fedexFormGroup.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var clientName = this.clientName.replace(/[ ]/g, "_");
    var reportfromat = "PDF"
    var Master_reportlogobj: any = {};
    Master_reportlogobj["fromdate"] = dateFrom;
    Master_reportlogobj["todate"] = dateTo;
    Master_reportlogobj["chargeSource"] = "Tracking Number";
    Master_reportlogobj["trackingNumber"] = trackingNo;
    Master_reportlogobj["clientId"] = this.clientID.toString();
    Master_reportlogobj["clientname"] = clientName;
    Master_reportlogobj["invoiceId"] = invoiceId;
    Master_reportlogobj["type"] = "Fedex_Tracking_Number_Report";
    this.fedexFetch_TrackingReport(Master_reportlogobj);
    this.openModal("Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.");


  }

  fedexFetch_TrackingReport(param: any) {
    this.httpfedexService.fedexFetch_TrackingReport(param).subscribe(
      result => {
        var resultObj = result;
        var urlParam: any = {};
        var urlObj: any = {};
        var date = new Date();
        var dateValue = this.datePipe.transform(date, "yyyy-MM-dd");
        urlParam['pdfpath'] = resultObj;
        urlParam['action'] = 'Trackingnumberreport';
        var fields_string: any = "";
        for (const [key, value] of Object.entries(urlParam)) {
          fields_string += key + '=' + value + '&';
        }
        this.httpfedexService.reportServlet(fields_string);
      },
      (error: any) => {
        console.log('error ', error);

      })
  }
  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }


}
