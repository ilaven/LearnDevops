import { Component, Inject, Optional, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormControl, FormBuilder } from '@angular/forms';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-usps-tracking-popup',
  templateUrl: './tracking-popup.component.html',
  styleUrls: ['./tracking-popup.component.scss'],
  standalone: false
})
export class TrackingUSPSPopupComponent implements OnInit {

  dialogValue: any
  typeinfo;
  clientName;
  clientNameTxt: any
  accessorialsAC = [];
  service_id: any
  quotedAmount: any
  adjAmount: any
  amountPaid: any
  recipient: any
  originZip: any
  printDate: any;
  tracking_id: any;
  classService: any
  weight: any
  printedMessage: any
  commonAC = [];
  chargeinfocommonAC = [];
  chargeinfocommonACfooter = [];
  refund_LinkBar = [];
  refund_LinkBar11 = [];
  refund_LinkBar11total: any
  fromDate;
  toDate;
  totalAccessorialsAmnt: any
  netFrtCharge: any
  frtIncentive: any
  grossFrtCharge: any
  total: any
  refund = 0;
  invoiceCount = 0;
  txtAmount: any
  loginId = 123;
  fromPage;
  fromDialog: any;
  themeoption;
  panelClass;
  charge_amt: any;
  Trackinfo;
  fetchTrakingnumberRes = [];
  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new UntypedFormControl(''),
    t001ClientProfile: new UntypedFormGroup({ clientId: new UntypedFormControl('') })
  });
  shipmentStatus: any;
  length: any;
  width: any;
  height: any;
  ratedWeight: any;
  ratedWeightUnit: any;
  reference1: any;
  shipperAddressLine1: any
  shipperCity: any;
  shipperState: any;
  shipperPostal: any;
  shipperCountry: any;
  receiverAddressLine1: any;
  receiverCity: any;
  receiverState: any;
  receiverPostal: any;
  receiverCountry: any;
  constructor(
    public dialogRef: MatDialogRef<TrackingUSPSPopupComponent>, private httpUSPSService: HttpUSPSService, private datePipe: DatePipe,
    private httpClientService: HttpClientService, private commonService: CommonService, private dialog: MatDialog, private _cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelClass = data.panelClass;
    this.fromPage = data.pageValue;
    this.typeinfo = this.fromPage.basisValue;
    this.clientName = this.fromPage.clientName;
    this.themeoption = this.fromPage.themeoption;
    this.fromDate = this.fromPage.fromDate;
    this.toDate = this.fromPage.toDate;
    this.Trackinfo = this.fromPage.trackingNumber;
    this.httpUSPSService.fetchShipmentDetailSearch(this.fromPage).subscribe(
      result => {
        this.fetchTrakingnumberRes = result;
        console.log(this.fetchTrakingnumberRes);
        this.fetchTrakingnumberResult(this.fetchTrakingnumberRes);
      },
      error => {
        console.log('error ', error);
      })
  }

  ngOnInit() {
  }
  showColumnPicker = false;
  toggleColumnPicker() {
    this.showColumnPicker = !this.showColumnPicker;
  }

  private formatText(textToFormat: string): string {
    return (textToFormat == null || textToFormat == "") ? "NA" : textToFormat;
  }
  private formatTextCheckNull(textToFormat: string): string {
    return (textToFormat == null || textToFormat == "") ? "" : textToFormat;
  }
  fetchTrackResAC: any = [];
  mstTempObj: any = {};
  gstAmount: any;
  fetchTrakingnumberResult(resultParameter: any) {
    this.fetchTrackResAC = resultParameter;

    if (this.fetchTrackResAC != null && this.fetchTrackResAC.length != 0) {
      var resultracking = [];
      var resulGrossChrg = [];
      for (var listcount = 0; listcount < this.fetchTrackResAC.length; listcount++) {
        this.clientNameTxt = this.clientName;

        this.tracking_id = this.formatText(this.fetchTrackResAC[listcount].trackingNo);
        this.printDate = this.formatText(this.fetchTrackResAC[listcount].printDate);
        this.classService = this.formatText(this.fetchTrackResAC[listcount].classService);
        this.reference1 = this.formatText(this.fetchTrackResAC[listcount].reference1);
        this.weight = this.formatText(this.fetchTrackResAC[listcount].weight);
        this.recipient = this.formatText(this.fetchTrackResAC[listcount].recipient);
        this.originZip = this.formatText(this.fetchTrackResAC[listcount].originZip.replace('.00', '').replace('.0', ''));
        this.quotedAmount = this.formatText(this.fetchTrackResAC[listcount].quotedAmount);
        this.adjAmount = this.formatText(this.fetchTrackResAC[listcount].adjAmount);
        this.amountPaid = this.formatText(this.fetchTrackResAC[listcount].amountPaid);
        this.shipmentStatus = this.formatText(this.fetchTrackResAC[listcount].status);
        this.length = this.formatText(this.fetchTrackResAC[listcount].dimLength);
        this.width = this.formatText(this.fetchTrackResAC[listcount].dimWidth);
        this.height = this.formatText(this.fetchTrackResAC[listcount].dimHeight);
        this.ratedWeight = this.formatText(this.fetchTrackResAC[listcount].ratedWeight);
        this.ratedWeightUnit = this.formatText(this.fetchTrackResAC[listcount].ratedWeightUnit);
        this.shipperAddressLine1 = this.formatText(this.fetchTrackResAC[listcount].shipperAddressLine1);
        this.shipperCity = this.formatText(this.fetchTrackResAC[listcount].shipperCity);
        this.shipperState = this.formatText(this.fetchTrackResAC[listcount].shipperState);
        this.shipperPostal = this.formatText(this.fetchTrackResAC[listcount].shipperPostal);
        this.shipperCountry = this.formatText(this.fetchTrackResAC[listcount].shipperCountry);
        this.receiverAddressLine1 = this.formatText(this.fetchTrackResAC[listcount].receiverAddressLine1);
        this.receiverCity = this.formatText(this.fetchTrackResAC[listcount].receiverCity);
        this.receiverState = this.formatText(this.fetchTrackResAC[listcount].receiverState);
        this.receiverPostal = this.formatText(this.fetchTrackResAC[listcount].receiverPostal);
        this.receiverCountry = this.formatText(this.fetchTrackResAC[listcount].receiverCountry);
      }
      this.typeinfo = "USPS";

      var clientName = this.clientName;
      var clientwitSplcharName: string = clientName.replace(/[ ]/g, "_");
      this.mstTempObj["clientname"] = clientwitSplcharName;


      this.mstTempObj["fromdate"] = this.fromDate;
      this.mstTempObj["todate"] = this.toDate;
      this.mstTempObj["trackingNumber"] = this.tracking_id;
      this.mstTempObj["chargeSource"] = "TrackingNumber";
    }
    this._cd.markForCheck()
  }

  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.fromDialog });
  }
  generatetrackingexcel() {
    var trackingParam = this.fromPage;

    var t007_reportlogobj: any = {};
    var modulename = "TrackingNumberreport";
    var reportfromat = "CSV";
    t007_reportlogobj['fromDate'] = trackingParam.fromDate;
    t007_reportlogobj['toDate'] = trackingParam.toDate;
    t007_reportlogobj['t001ClientProfile'] = trackingParam.t001ClientProfile;
    t007_reportlogobj['reportType'] = "Tracking_Number_Report";
    t007_reportlogobj['reportName'] = "Tracking Number Report";
    t007_reportlogobj['designFileName'] = "TrackingNumber_Excel";
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['reportFormat'] = "CSV"
    t007_reportlogobj['moduleName'] = modulename;
    t007_reportlogobj['chargeDes'] = trackingParam.searchDetail;
    t007_reportlogobj['clientId'] = trackingParam.clientId;
    t007_reportlogobj['clientname'] = trackingParam.clientname;
    t007_reportlogobj['crmaccountNumber'] = trackingParam.clientBillingId;//trackingParam.crmaccountNumber;  
    t007_reportlogobj['login_id'] = this.loginId;
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;
    this.httpUSPSService.runReport(t007_reportlogobj).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
        console.log(error);
      });
  }
  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalUSPS(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
  }

  generatetrackingpdf() {

    var reportfromat: any = "PDF"
    var Master_reportlogobj: any = {};
    Master_reportlogobj["fromDate"] = this.fromPage.fromDate;
    Master_reportlogobj["toDate"] = this.fromPage.toDate;
    Master_reportlogobj["searchSource"] = "TrackingNumberWithID";
    Master_reportlogobj["clientBillingId"] = this.fromPage.clientBillingId;
    Master_reportlogobj["searchDetail"] = this.fromPage.searchDetail;
    Master_reportlogobj["clientId"] = this.fromPage.clientId;
    Master_reportlogobj["clientName"] = this.fromPage.clientName.replace(/[^a-zA-Z0-9 ]/g, "");
    Master_reportlogobj["typeCode1"] = "Tracking_Number_Report";
    Master_reportlogobj["basisValue"] = this.typeinfo;
    this.fetch_TrackingReport(Master_reportlogobj);
    this.openModal("Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.");
  }

  fetch_TrackingReport(param: any) {
    this.httpUSPSService.fetch_TrackingReport(param).subscribe(
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
        this.httpUSPSService.reportServlet(fields_string);
      },
      error => {
        console.log('error ', error);
      })
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
    dialogConfig.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }
}
