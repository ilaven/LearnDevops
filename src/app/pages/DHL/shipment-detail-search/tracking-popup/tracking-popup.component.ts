import { Component, OnInit, Optional, Inject, ChangeDetectorRef } from "@angular/core";
import { CommonService } from "src/app/core/services/common.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { FormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { DatePipe } from "@angular/common";
import { HttpDhlService } from "src/app/core/services/httpdhl.service";

@Component({
  selector: 'app-dhl-tracking-popup',
  templateUrl: './tracking-popup.component.html',
  styleUrls: ['./tracking-popup.component.scss'],
  standalone: false
})
export class DhlTrackingPopupComponent implements OnInit {
  dialogValue: any;
  typeinfo: any;
  clientName: any;
  clientNameTxt: any;
  pack_id1: any;
  pack_id: any;
  ad_gl_id: any;
  pack_id2: any;
  pack_id3: any;
  pack_id13: any;
  addressline_1: any;
  addressline_2: any;
  addressline_3: any;
  addressline_4: any;
  addressline_5: any;
  addressline_6: any;
  receiveraddressline_1: any;
  receiveraddressline_2: any;
  receiveraddressline_3: any;
  receiveraddressline_4: any;
  receiveraddressline_5: any;
  receiveraddressline_6: any;
  ref3: any;
  accessorialsAC: any[] = [];
  freightChargeAC: any[] = [];
  accessorialsChargeAC: any[] = [];
  netamountgrandtotal_id = 0;
  incentiveamountgrandtotal_id = 0;
  grossamountgrandtotal_id = 0;
  accnetamountgrandtotal_id = 0;
  service_id: any;
  pa_service_id: any;
  bi_invoidat_id: any;
  ad_tran_id: any;
  account_id: any;
  paaccount_id: any;
  pa_zone_id: any;
  pa_billedweight_id: any;
  pa_acutal_id: any;
  pa_ent_dim_id: any;
  pa_dim_id: any;
  invoice_id: any;
  tracking_id: any;
  bi_invo_id: any;
  ref1: any;
  ref2: any;
  accessorialItem: any;
  pa_pack_id: any;
  netdue_id: any;
  dimDivisor: any;
  container_type: any;
  payor: any;
  commonAC: any[] = [];
  chargeinfocommonAC: any[] = [];
  chargeinfocommonACfooter: any[] = [];
  refund_LinkBar: any[] = [];
  refund_LinkBar11: any[] = [];
  refund_LinkBar11total: any;

  totalAccessorialsAmnt: any;
  netFrtCharge: any;
  frtIncentive: any;
  grossFrtCharge: any;
  total: any;
  refund = 0;
  txtAmount: any;
  loginId = 123;
  fromPage: any;
  fromDialog: any;
  fetchTrakingnumberRes: any[] = [];

  chargefieldFooter_headerText: any;
  accessfiledFooter1_headerText: any;
  accessfiledFooter2_headerText: any;
  accessfiledFooter_headerText: any;
  charge_amt: any;
  invoiceCount = 0;
  fedexgross: any = 0;
  fedexdiscount: any = 0;
  bi_cli__id: any;
  Trackinfo: any;
  fromDate: any;
  toDate: any;
  fedexyear_1: any = {};
  fedexyear_2: any[] = [];
  fedexyear_3: any = {};
  fedexyear_4: any[] = [];
  postive = 0;
  themeoption: any;
  panelClass: any;

  fetchTrackResAC: any[] = [];
  mstTempObj: any = {};
  gstAmount: any;
  serviceResultAC: any[] = [];
  product_id: any;
  weightFlag_id: any;
  weightUnit_id: any;
  dhlScaleWeight_id: any;
  custVolWeight_id: any;
  dhlVolWeight_id: any;

  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new UntypedFormControl(''),
    t002ClientProfileobj: new UntypedFormGroup({
      clientId: new UntypedFormControl('')
    })
  });

  constructor(
    public dialogRef: MatDialogRef<DhlTrackingPopupComponent>,
    private httpDhlService: HttpDhlService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private _cd: ChangeDetectorRef, private datePipe: DatePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelClass = data?.panelClas;
    this.fromPage = data?.pageValue || {};
    this.typeinfo = this.fromPage?.carrierType;
    this.clientName = this.fromPage?.clientname;
    this.Trackinfo = this.fromPage?.trackingNumber;
    this.fromDate = this.fromPage?.fromdate;
    this.toDate = this.fromPage?.todate;
    this.themeoption = this.fromPage?.themeoption;
  }
  showColumnPicker = false;
  toggleColumnPicker() {
    this.showColumnPicker = !this.showColumnPicker;
  }

  ngOnInit(): void {
    if (this.fromPage) {
      this.httpDhlService.fetchShipmentDetailSearch(this.fromPage).subscribe(
        (result: any) => {
          this.fetchTrakingnumberRes = result || [];
          this.fetchTrakingnumberResult(this.fetchTrakingnumberRes);
        }, (error: any) => {
          console.error('fetchTrakingnumber error', error);
        }
      );
    }
  }

  private formatText(textToFormat: any): string {
    return textToFormat == null || textToFormat === '' ? 'NA' : textToFormat;
  }
  private formatTextCheckNull(textToFormat: string): string {
    return (textToFormat == null || textToFormat == "") ? "" : textToFormat;
  }

  fetchTrakingnumberResult(resultParameter: any) {
    this.fetchTrackResAC = resultParameter;
    var tempObj: any = {};
    var tempchargeinfoObj = {};
    var tempaccObj: any = {};
    var packagecount: number = 0;
    var amount: number = 0;
    var frtamount: number = 0;
    var refund: number = 0;
    var netdue: number = 0;
    var grosstotal: number = 0;
    var grossCharge: number = 0;
    var netCharge: number = 0;
    var disamount: number = 0;
    var acctotal: number = 0;
    var count: number = 0;
    var countchargeDesc: number = 1;
    var returncount: number = 0;
    var returncount1: number = 0;
    var shpflag: number = 0;
    var refundflag: number = 0;

    var unique: object = {};
    var grossChargeAmt: string;

    if (this.fetchTrackResAC != null && this.fetchTrackResAC.length != 0) {
      var resultracking = [];
      for (var listcount = 0; listcount < this.fetchTrackResAC.length; listcount++) {
        let trackingNo = this.fetchTrackResAC[listcount].shipmentNumber;

        if (resultracking.indexOf(trackingNo) == -1) {
          resultracking.push(trackingNo);
        }
      }

      var listcount = 0;

      tempObj = {};

      this.clientNameTxt = this.clientName;
      refund = 0.0;
      this.service_id = this.formatText(this.fetchTrackResAC[listcount].productName);
      this.pa_service_id = this.formatText(this.fetchTrackResAC[listcount].productName);
      amount = Number(this.fetchTrackResAC[listcount].netAmount);
      this.addressline_1 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].senderContact);
      this.addressline_2 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersName);
      this.addressline_3 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersAddress1);
      this.addressline_4 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersAddress2);
      this.addressline_5 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersCity) + "  " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersState) + "   " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersPostcode);
      this.addressline_6 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].sendersCountry);
      this.receiveraddressline_1 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversContact);
      this.receiveraddressline_2 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversName);
      this.receiveraddressline_3 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversAddress1);
      this.receiveraddressline_4 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversAddress2);
      this.receiveraddressline_5 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversCity) + " " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversState) + "  " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversPostcode);
      this.receiveraddressline_6 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].receiversCountry);
      this.account_id = this.formatText(this.fetchTrackResAC[listcount].billingAccount);
      this.paaccount_id = this.formatText(this.fetchTrackResAC[listcount].billingAccount);
      this.pa_pack_id = this.formatText(this.fetchTrackResAC[listcount].pieces);

      this.pack_id1 = "NA";
      this.pack_id2 = "NA";
      this.pack_id = "NA";
      this.pack_id13 = "NA";
      this.ad_gl_id = "NA";
      this.pa_billedweight_id = this.formatText(this.fetchTrackResAC[listcount].weight);
      this.pa_acutal_id = this.formatText(this.fetchTrackResAC[listcount].custScaleWeight);
      this.product_id = this.formatText(this.fetchTrackResAC[listcount].product);
      this.weightUnit_id = this.formatText(this.fetchTrackResAC[listcount].weightUnit);
      this.dhlScaleWeight_id = this.formatText(this.fetchTrackResAC[listcount].dhlscaleWeight);
      this.custVolWeight_id = this.formatText(this.fetchTrackResAC[listcount].custVolWeight);
      this.dhlVolWeight_id = this.formatText(this.fetchTrackResAC[listcount].dhlvolWeight);
      this.weightFlag_id = this.formatText(this.fetchTrackResAC[listcount].weightFlag);
      this.ref1 = this.formatText(this.fetchTrackResAC[listcount].shipmentReference1);
      this.ref2 = this.formatText(this.fetchTrackResAC[listcount].shipmentReference1);
      this.ref3 = "NA";
      var chargeDesc: string = "Weight Charge";
      var chargeAmount: number = Number(this.fetchTrackResAC[listcount].weightCharge);

      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      for (var accCount = 1; accCount <= 9; accCount++) {
        var stringValue = "xc" + accCount + "Charge";
        var stringName = "xc" + accCount + "Name";
        var chargeDesc: string = (this.fetchTrackResAC[listcount])[stringName];
        var chargeAmount: number = Number((this.fetchTrackResAC[listcount])[stringValue]);

        if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
          tempaccObj = {};
          tempaccObj["chargeDescription"] = chargeDesc;
          tempaccObj["netAmount"] = String(chargeAmount);
          acctotal += chargeAmount;
          this.accessorialsAC.push(tempaccObj)
        }
      }

      this.typeinfo = "Dhl";
      this.total = this.formatText(this.fetchTrackResAC[listcount].totalCharge);
      var packagedimension = this.fetchTrackResAC[listcount].diml + " x " + this.fetchTrackResAC[listcount].dimw + " x " + this.fetchTrackResAC[listcount].dimh;
      this.pa_dim_id = this.formatText(packagedimension);
      this.pa_ent_dim_id = "NA";
      this.invoice_id = this.formatText(this.fetchTrackResAC[listcount].invoiceNumber);
      this.tracking_id = this.formatText(this.fetchTrackResAC[listcount].shipmentNumber);
      this.bi_invo_id = this.formatText(this.fetchTrackResAC[listcount].invoiceNumber);
      this.bi_invoidat_id = this.formatText(this.fetchTrackResAC[listcount].invoiceDate)
      // this.pa_zone_id=this.formatText(this.fetchTrackResAC[listcount].rateZone);
      this.netFrtCharge = this.formatText(this.fetchTrackResAC[listcount].weightCharge);
      this.ad_tran_id = this.formatText(this.fetchTrackResAC[listcount].shipmentDate);
      this.totalAccessorialsAmnt = acctotal;
      var clientName = this.clientName;
      var clientwitSplcharName: string = clientName.replace(/[ ]/g, "_");
      this.mstTempObj["clientname"] = clientwitSplcharName;


      this.mstTempObj["fromdate"] = this.fromDate;
      this.mstTempObj["todate"] = this.toDate;
      this.mstTempObj["trackingNumber"] = this.Trackinfo;
      this.mstTempObj["chargeSource"] = "TrackingNumber";

      if (this.invoiceCount == 0) {
        this.invoiceCount = this.fetchTrackResAC.length;
        for (var listcount1 = 0; listcount1 < this.fetchTrackResAC.length; listcount1++) {
          tempObj = {};
          tempObj["trackingNumber"] = this.formatText(this.fetchTrackResAC[listcount1].shipmentNumber);
          tempObj["type"] = "Dhl";
          tempObj["merged"] = "N";
          tempObj["invoiceNumber"] = this.formatText(this.fetchTrackResAC[listcount1].invoiceNumber);
          tempObj["invoiceDate"] = this.formatText(this.fetchTrackResAC[listcount1].invoiceDate);
          tempObj["packageQuantity"] = this.formatText(this.fetchTrackResAC[listcount1].pieces);
          tempObj["netAmount"] = this.formatText((this.fetchTrackResAC[listcount1].totalCharge));
          tempObj["gstamount"] = this.formatText((refund.toFixed(2)));
          this.gstAmount = tempObj["gstamount"];
          tempObj["total"] = this.formatText((this.fetchTrackResAC[listcount1].totalCharge));

          this.netdue_id = this.formatText((refund.toFixed(2)));
          this.refund_LinkBar11total = this.formatText((refund.toFixed(2)));
          this.commonAC.push(tempObj);
        }
      }
    }
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
    this.httpDhlService.runReport(t007_reportlogobj).subscribe(
      (result: any) => {
        this.saveOrUpdateReportLogResult(result);
      }, (error: any) => {
        console.log(error);
      });
  }
  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalDhl(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
  }

  openModal(alertVal: any): void {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      this.dialogValue = result?.data;
    });
  }

  generatetrackingpdf() {
    var reportfromat = "PDF"
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
    this.httpDhlService.fetch_TrackingReport(param).subscribe(
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
        this.httpDhlService.reportServlet(fields_string);
      }, (error: any) => {
        console.log('error ', error);
      })
  }
  closeDialog() {
    this.dialogRef.close({ event: 'close', data: this.fromDialog });
  }
}
