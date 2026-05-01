import { Component, OnInit, Optional, Inject, ChangeDetectorRef } from "@angular/core";
import { CommonService } from "src/app/core/services/common.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { FormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from "@angular/common";
import { HttpOntracService } from "src/app/core/services/httpontrac.service";

@Component({
  selector: 'app-ontrac-tracking-popup',
  templateUrl: './tracking-popup.component.html',
  styleUrls: ['./tracking-popup.component.scss'],
  standalone: false
})
export class OntracTrackingPopupComponent implements OnInit {
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
  FirstScanDateTime: any;
  ProofOfDeliveryDateTime: any;
  WeightSource: any;
  ProofOfDeliveryName: any;
  CustomerOrderNumber: any;
  pa_dimlbs_id: any;
  letter: any;

  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new UntypedFormControl(''),
    t001ClientProfile: new UntypedFormGroup({
      clientId: new UntypedFormControl('')
    })
  });

  constructor(
    public dialogRef: MatDialogRef<OntracTrackingPopupComponent>,
    private httpOntracService: HttpOntracService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private _cd: ChangeDetectorRef, private datePipe: DatePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelClass = data?.panelClas;
    this.fromPage = data?.pageValue || {};
    this.typeinfo = this.fromPage?.carrierType;
    this.clientName = this.fromPage?.clientName;
    this.Trackinfo = this.fromPage?.searchDetail;
    this.fromDate = this.fromPage?.fromDate;
    this.toDate = this.fromPage?.toDate;
    this.themeoption = this.fromPage?.themeoption;
  }
  showColumnPicker = false;
  toggleColumnPicker() {
    this.showColumnPicker = !this.showColumnPicker;
  }

  ngOnInit(): void {
    if (this.fromPage) {
      this.httpOntracService.fetchShipmentDetailSearch(this.fromPage).subscribe(
        (result: any) => {
          this.fetchTrakingnumberRes = result || [];
          this.fetchTrakingnumberResult(this.fetchTrakingnumberRes);
        },
        (error: any) => {
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
    var tempaccObj: any = {};
    var amount: number = 0;
    var refund: number = 0;
    var acctotal: number = 0;

    if (this.fetchTrackResAC != null && this.fetchTrackResAC.length != 0) {
      var resultracking = [];
      for (var listcount = 0; listcount < this.fetchTrackResAC.length; listcount++) {
        let trackingNo = this.fetchTrackResAC[listcount].trackingNumber;

        if (resultracking.indexOf(trackingNo) == -1) {
          resultracking.push(trackingNo);
        }
      }
      var listcount = 0;
      tempObj = {};

      this.clientNameTxt = this.clientName;
      refund = 0.0;
      this.service_id = this.formatText(this.fetchTrackResAC[listcount].serviceCode);
      this.pa_service_id = this.formatText(this.fetchTrackResAC[listcount].serviceCode);
      amount = Number(this.fetchTrackResAC[listcount].netAmount);
      this.addressline_1 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperCompanyName);
      this.addressline_2 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperCompanyName);
      this.addressline_3 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperStreet);
      this.addressline_4 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperCity) + "  " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperState) + "   " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperPostalCode);
      this.addressline_5 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].shipperCountry);
      this.receiveraddressline_1 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationContact);
      this.receiveraddressline_2 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationContact);
      this.receiveraddressline_3 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationStreet);
      this.receiveraddressline_4 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationCity) + " " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationState) + "  " + this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationPostalCode);
      this.receiveraddressline_5 = this.formatTextCheckNull(this.fetchTrackResAC[listcount].destinationCountry);
      this.account_id = this.formatText(this.fetchTrackResAC[listcount].accountNumber);
      this.paaccount_id = this.formatText(this.fetchTrackResAC[listcount].accountNumber);
      this.pa_pack_id = this.formatText(this.fetchTrackResAC[listcount].packageCount);
      this.FirstScanDateTime = this.formatText(this.fetchTrackResAC[listcount].firstScanDateTime);
      this.ProofOfDeliveryName = this.formatText(this.fetchTrackResAC[listcount].proofOfDeliveryName);
      this.ProofOfDeliveryDateTime = this.formatText(this.fetchTrackResAC[listcount].proofOfDeliveryDateTime);
      this.WeightSource = this.formatText(this.fetchTrackResAC[listcount].weightSource);
      this.CustomerOrderNumber = this.formatText(this.fetchTrackResAC[listcount].customerOrderNumber);
      this.pack_id1 = "NA";
      this.pack_id2 = "NA";
      this.pack_id = "NA";
      this.pack_id13 = "NA";
      this.ad_gl_id = "NA";
      this.pa_billedweight_id = this.formatText(this.fetchTrackResAC[listcount].billedWeightLbs);
      this.pa_acutal_id = this.formatText(this.fetchTrackResAC[listcount].weightLbs);
      this.pa_dimlbs_id = this.formatText(this.fetchTrackResAC[listcount].dimlbs);
      this.letter = this.formatText(this.fetchTrackResAC[listcount].letter);
      this.ref1 = this.formatText(this.fetchTrackResAC[listcount].reference1);
      this.ref2 = this.formatText(this.fetchTrackResAC[listcount].reference2);
      this.ref3 = "NA";

      var chargeDesc: string = 'Service Charge';
      var chargeAmount: number = Number(this.fetchTrackResAC[listcount].serviceCharge);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Address Correction Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['addressCorrectionSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Delivery Intervention Required';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['deliveryInterventionRequired']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Extra Piece Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['extraPieceSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Residential Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['residentialSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Delivery Area Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['deliveryAreaSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Extended Area Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['extendedAreaSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Additional Handling Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['additionalHandlingSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Large Package Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['largePackageSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Over Maximum Limits Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['overMaximumLimitsSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Signature Required';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['signatureRequired']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Adult Signature Required';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['adultSignatureRequired']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Relabel Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['relabelSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Weekend Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['weekendSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Demand Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['demandSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Demand Additional Handling Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['demandAdditionalHandlingSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Demand Large Package Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['demandLargePackageSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Demand Over Maximum Limits Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['demandOverMaximumLimitsSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'On Call Pickup';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['onCallPickup']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Shipping Charge Correction Audit Fee';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['shippingChargeCorrectionAuditFee']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Missing PLD';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['missingPld']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Other Adjustments';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['otherAdjustments']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Miscellaneous Charges';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['miscellaneousCharges']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      var chargeDesc: string = 'Fuel Surcharge';
      var chargeAmount: number = Number((this.fetchTrackResAC[listcount])['fuelSurcharge']);
      if (chargeDesc != "" && chargeDesc != null && chargeAmount != 0.00) {
        tempaccObj = {};
        tempaccObj["chargeDescription"] = chargeDesc;
        tempaccObj["netAmount"] = String(chargeAmount);
        acctotal += chargeAmount;
        this.accessorialsAC.push(tempaccObj)
      }

      this.typeinfo = "OnTrac";
      this.total = this.formatText(this.fetchTrackResAC[listcount].totalCharges);
      var packagedimension = this.fetchTrackResAC[listcount].lengthIn + " x " + this.fetchTrackResAC[listcount].widthIn + " x " + this.fetchTrackResAC[listcount].heightIn;
      this.pa_dim_id = this.formatText(packagedimension);
      this.pa_ent_dim_id = "NA";
      this.invoice_id = this.formatText(this.fetchTrackResAC[listcount].invoiceNumber);
      this.tracking_id = this.formatText(this.fetchTrackResAC[listcount].trackingNumber);
      this.bi_invo_id = this.formatText(this.fetchTrackResAC[listcount].invoiceNumber);
      this.bi_invoidat_id = this.formatText(this.fetchTrackResAC[listcount].billingDate)
      this.pa_zone_id = this.formatText(this.fetchTrackResAC[listcount].zone);
      this.netFrtCharge = this.formatText(this.fetchTrackResAC[listcount].serviceCharge);
      this.ad_tran_id = this.formatText(this.fetchTrackResAC[listcount].shipdate);
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
          tempObj["trackingNumber"] = this.formatText(this.fetchTrackResAC[listcount1].trackingNumber);
          tempObj["type"] = "OnTrac";
          tempObj["merged"] = "N";
          tempObj["invoiceNumber"] = this.formatText(this.fetchTrackResAC[listcount1].invoiceNumber);
          tempObj["invoiceDate"] = this.formatText(this.fetchTrackResAC[listcount1].billingDate);
          tempObj["packageQuantity"] = this.formatText(this.fetchTrackResAC[listcount1].packageCount);
          tempObj["netAmount"] = this.formatText((this.fetchTrackResAC[listcount1].totalCharges));
          tempObj["gstamount"] = this.formatText((refund.toFixed(2)));
          this.gstAmount = tempObj["gstamount"];
          tempObj["total"] = this.formatText((this.fetchTrackResAC[listcount1].totalCharges));

          this.netdue_id = this.formatText((refund.toFixed(2)));
          this.refund_LinkBar11total = this.formatText((refund.toFixed(2)));
          this.commonAC.push(tempObj);
        }
      }
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
    t007_reportlogobj['clientname'] = trackingParam.clientName;
    t007_reportlogobj['crmaccountNumber'] = trackingParam.id;//trackingParam.crmaccountNumber;  
    t007_reportlogobj['login_id'] = this.loginId;
    t007_reportlogobj['fzone'] = 0;
    t007_reportlogobj['tzone'] = 0;
    this.httpOntracService.runReport(t007_reportlogobj).subscribe(
      (result: any) => {
        this.saveOrUpdateReportLogResult(result);
      }, (error: any) => {
        console.log(error);
      });
  }

  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalOnTrac(this.reportsFormGroup.value);
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
    Master_reportlogobj["id"] = this.fromPage.id;
    Master_reportlogobj["searchDetail"] = this.fromPage.searchDetail;
    Master_reportlogobj["clientId"] = this.fromPage.clientId;
    Master_reportlogobj["clientName"] = this.fromPage.clientName.replace(/[^a-zA-Z0-9 ]/g, "");
    Master_reportlogobj["typeCode1"] = "Tracking_Number_Report";
    Master_reportlogobj["basisValue"] = this.typeinfo;
    this.fetch_TrackingReport(Master_reportlogobj);
    this.openModal("Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.");
  }

  fetch_TrackingReport(param: any) {
    this.httpOntracService.fetch_TrackingReport(param).subscribe(
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
        this.httpOntracService.reportServlet(fields_string);
      }, error => {
        console.log('error ', error);
      })
  }
}