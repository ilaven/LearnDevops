import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { OntracTrackingPopupComponent } from './tracking-popup/tracking-popup.component';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';

@Component({
  selector: 'app-ontrac-shipment-detail-search',
  templateUrl: './shipment-detail-search.component.html',
  styleUrls: ['./shipment-detail-search.component.scss'],
  standalone: false
})

export class OntracShipmentDetailSearchComponent implements OnInit {

  @ViewChild('criteria', { static: true }) criteria: any;
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
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

  clientType: any;
  showTableFedEx: any;
  panelClass: any;
  dataNoneTxtFedEx: any;
  // private onSetCommonAc: Subscription;
  currentDate: any;
  randomNumber: any;
  //*Fedex API *//
  constructor(private loaderService: LoaderService, private cookiesService: CookiesService,
    public dialog: MatDialog, private router: Router, private commonService: CommonService,
    private datePipe: DatePipe, private cd: ChangeDetectorRef, private httpOntracService: HttpOntracService
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
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
      if (this.clientType != "OnTrac") {
        this.router.navigate(['/dashboard/dashboard']);
      }
    });
    if (localStorage.getItem('payload_ontrac')) {
      let searchUserobj: any = localStorage.getItem('payload_ontrac');
      this.searchUserobj = JSON.parse(searchUserobj);

      if (this.searchUserobj != undefined || this.searchUserobj != null) {
        var fromDatefrmDashbrd: any = this.datePipe.transform(this.searchUserobj.fromDate, "MM-dd-yyyy");
        var toDatefrmDashbrd: any = this.datePipe.transform(this.searchUserobj.toDate, "MM-dd-yyyy");
        this.getUser();
        this.openLoading();
        this.clientName = this.searchUserobj.clientName;

        this.searchForm.patchValue({
          dateRange: {
            "start": new Date(this.searchUserobj.fromdate), "end": new Date(this.searchUserobj.todate)
          }
        });

        if (this.searchUserobj != undefined || this.searchUserobj != null) {
          this.searchForm.get('fromdate')?.setValue(new Date(fromDatefrmDashbrd));
          this.searchForm.get('todate')?.setValue(new Date(toDatefrmDashbrd));
          this.searchForm.get('trackingNumber')?.setValue(this.searchUserobj.searchDetail);
          this.searchForm.get('chargeSource')?.setValue(this.searchUserobj.searchSource);
        }

        this.fromdate = this.searchUserobj.fromDate;
        this.fetch_Trakingnumber(this.searchUserobj);
      }
    }
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

    if (this.searchUserobj == undefined) {
      this.searchForm.get('fromdate')?.setValue(new Date(tempmonthStartDay));
      this.searchForm.get('todate')?.setValue(new Date(tempmonthEndDay));
    }
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    } else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    this.clientID = await this.userProfifle.clientId;
    this.clientName = await this.userProfifle.clientName;
    let currentDate: any = this.datePipe.transform(this.userProfifle.dataasof, "MM/dd/yyyy")
    this.currentDate = new Date(currentDate);

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
      var dateFrYear = dateFr.getFullYear();
      var dateTYear = dateT.getFullYear();
      var yearDiff = dateTYear - dateFrYear;
      if (yearDiff > 1) {
        this.openModal("Time Frame Greater than 2 years");
        return;
      }
      this.openLoading();
      this.searchUserobj = {
        clientId: (this.clientID).toString(),
        clientName: this.clientName,
        fromDate: dateFrom,
        toDate: dateTo,
        basisValue: "OnTrac",
        searchDetail: this.searchForm.get('trackingNumber')?.value,
        searchSource: this.searchForm.get('chargeSource')?.value,
      };
      this.clientType = "OnTrac";
      this.fetch_Trakingnumber(this.searchUserobj);
    } else {
      this.openModal("Pleace fill required field");
      return;
    }
  }

  async fetch_Trakingnumber(searchUserobjValue: any) {
    this.openLoading();
    await this.httpOntracService.fetchShipmentDetailSearch(searchUserobjValue).subscribe(
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
          this.openModal("No data found!");
          this.trackingList(null);
        }
      }, (error: any) => {
        console.log('error ', error);
      })
  }
  searchClickCnt = 0;
  tableCount = 0;

  dialogValue: any;
  sendValue: any;
  fromdate: any;
  todate: any;
  fetch_trackingForModal = [];

  trackingList(resultParameter: any) {
    var refund = 0.0;
    var amount;
    if (resultParameter == null || resultParameter.length == 0) {
      this.commoncollAC = null;
      this.showTable = true;
      this.showCount = false;
      this.dataNoneTxt = true;
      return;
    }
    this.trackingAC = resultParameter;

    if (this.trackingAC != null && this.trackingAC.length != 0) {
      this.commoncollAC = [];
      this.commoncollAC_value = [];
      for (var listcount = 0; listcount < this.trackingAC.length; listcount++) {
        var tempObj: any = [];
        if (this.trackingAC.length == 1) {
          refund = 0.0;
          amount = Number(this.trackingAC[listcount].totalCharges);
        }

        tempObj["id"] = this.trackingAC[listcount].clientBillingId;
        tempObj["trackingNumber"] = this.trackingAC[listcount].trackingNumber;
        tempObj["type"] = "OnTrac";
        tempObj["containerType"] = "OnTrac";
        tempObj["invoiceNumber"] = this.trackingAC[listcount].invoiceNumber;
        tempObj["invoiceDate"] = this.trackingAC[listcount].billingDate;
        tempObj["packageQuantity"] = this.trackingAC[listcount].packageCount;
        tempObj["netAmount"] = "$ " + Number(this.trackingAC[listcount].totalCharges).toFixed(2);
        tempObj["gstamount"] = "$ " + refund;
        tempObj["total"] = "$ " + Number(this.trackingAC[listcount].totalCharges).toFixed(2);
        this.commoncollAC_value.push(tempObj);
      }
      if (this.commoncollAC_value.length > 1) {
        this.commoncollAC = this.commoncollAC_value;
        this.tableCount = this.commoncollAC.length;
      } else {
        this.showTable = false;
        this.showCount = false;
        this.getTrackingDetail(this.commoncollAC_value[0]);
      }
    }
  }

  async getTrackingDetail(trackingParam: any) {
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.searchForm.get('todate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var modulename = "TrackingNumberreport";
    var trackingobj = {
      id: trackingParam.id,
      clientName: this.searchUserobj.clientName,
      fromDate: this.searchUserobj.fromDate,
      toDate: this.searchUserobj.toDate,
      searchDetail: trackingParam.trackingNumber,
      carrierType: trackingParam.type,
      searchSource: "TrackingNumberWithID",
      chargeSource: "TrackingNumberWithID",
      themeoption: this.themeoption,
      t001ClientProfile: this.userProfifle,
      reportType: "TRACKING_NUMBER_EXCEL",
      designFileName: "TrackingNumber_Excel",
      status: 'IN QUEUE',
      reportFormat: "excel",
      moduleName: modulename,
      clientId: this.searchUserobj.clientId,
      crmaccountNumber: "T004_" + this.clientName + "_" + this.datePipe.transform(dateT, "yyyy"),
      reportName: "TRACKING_NUMBER_EXCEL;",
      login_id: this.loginId.toString(),
      fzone: 0,
      tzone: 0
    }
    this.sendValue = null;
    this.sendValue = trackingobj;

    this.openDialog();

  }
  openDialog() {
    const dialogRef = this.dialog.open(OntracTrackingPopupComponent, {
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
    this.httpOntracService.runReport(t007_reportlogobj).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
        console.log(error);
      });
  }


  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalOnTrac(this.reportsFormGroup.value);
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

  generatetrackingexcel(trackingNo: any, id: any) {
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
    t007_reportlogobj['crmaccountNumber'] = id; // "T004_" + this.clientName + "_" + this.datePipe.transform(dateT, "yyyy");
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;
    this.httpOntracService.runReport(t007_reportlogobj).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
        console.log(error);
      });
  }

  generatetrackingpdf(trackingNo: any, id: any) {

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
    Master_reportlogobj["chargeSource"] = "TrackingNumberWithID";
    Master_reportlogobj["trackingNumber"] = trackingNo;
    Master_reportlogobj["clientId"] = this.clientID.toString();
    Master_reportlogobj["clientname"] = clientName;
    Master_reportlogobj["id"] = id;

    Master_reportlogobj["typeCode1"] = "Tracking_Number_Report";
    Master_reportlogobj["basisValue"] = this.clientType;
    this.fetch_TrackingReport(Master_reportlogobj);
    this.openModal("Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.");
  }

  fetch_TrackingReport(param: any) {
    this.httpOntracService.fetch_TrackingReport(param).subscribe(
      (result: any) => {
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
        this.httpOntracService.reportServlet(fields_string);
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