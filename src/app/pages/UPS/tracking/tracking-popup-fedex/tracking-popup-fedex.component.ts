import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { CommonService } from 'src/app/core/services/common.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tracking-popup-fedex',
  standalone: true,
  templateUrl: './tracking-popup-fedex.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatDatepickerModule, MatIconModule],
  providers: [DatePipe],
})
export class TrackingPopupFedexComponent implements OnInit {
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

  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new UntypedFormControl(''),
    t002ClientProfileobj: new UntypedFormGroup({
      clientId: new UntypedFormControl('')
    })
  });

  constructor(
    public dialogRef: MatDialogRef<TrackingPopupFedexComponent>,
    private httpfedexService: HttpfedexService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private fb: FormBuilder,
    private _cd: ChangeDetectorRef,
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

  ngOnInit(): void {
    if (this.fromPage) {
      this.httpfedexService.fetchTrakingnumber(this.fromPage).subscribe(
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

  fetchTrakingnumberResult(resultParameter: any): void {
    this.fetchTrackResAC = resultParameter || [];

    let tempObj: any = {};
    let tempfreightObj: any = {};
    let tempchargeinfoObj: any = {};
    let tempaccObj: any = {};

    let trackingnumber: any = null;
    let packagecount = 0;
    let amount = 0;
    let refund = 0;
    let grossCharge = 0;
    let netCharge = 0;
    let disamount = 0;
    let acctotal = 0;
    let count = 0;
    let countchargeDesc = 1;
    let returncount = 0;
    let returncount1 = 0;
    let shpflag = 0;
    let grossChargeAmt: string;

    if (this.fetchTrackResAC && this.fetchTrackResAC.length !== 0) {
      const resultracking: any[] = [];
      const resulGrossChrg: any[] = [];

      for (let listcount = 0; listcount < this.fetchTrackResAC.length; listcount++) {
        const trackingNo = this.fetchTrackResAC[listcount].trackingNumber;

        if (resultracking.indexOf(trackingNo) === -1) {
          resultracking.push(trackingNo);
        }

        grossChargeAmt = this.fetchTrackResAC[listcount].grossCharge;
        if (Number(grossChargeAmt) === 0) {
          resulGrossChrg.push(grossChargeAmt);
        }
      }

      if (resulGrossChrg.length !== 0) {
        for (let distinctlistcount = 0; distinctlistcount < resultracking.length; distinctlistcount++) {
          this.bi_cli__id = this.clientName;

          for (let listcount = 0; listcount < this.fetchTrackResAC.length; listcount++) {
            packagecount += Number(this.fetchTrackResAC[listcount].packageQuantity || 0);
            refund = 0;

            if (!this.bi_invoidat_id) {
              this.bi_invoidat_id = this.formatText(this.fetchTrackResAC[listcount].invoiceDate);
            }
            if (!this.addressline_1) {
              this.addressline_1 = this.fetchTrackResAC[listcount].senderName;
            }
            if (!this.addressline_2) {
              this.addressline_2 = this.fetchTrackResAC[listcount].senderCompanyName;
            }
            if (!this.addressline_3) {
              this.addressline_3 = this.fetchTrackResAC[listcount].senderAddressLine1;
            }
            if (!this.addressline_4) {
              this.addressline_4 = this.fetchTrackResAC[listcount].senderAddressLine2;
            }
            if (!this.addressline_5) {
              this.addressline_5 =
                (this.fetchTrackResAC[listcount].senderCity || '') + '  ' +
                (this.fetchTrackResAC[listcount].senderState || '') + '  ' +
                (this.fetchTrackResAC[listcount].senderPostal || '');
            }
            if (!this.addressline_6) {
              this.addressline_6 = this.fetchTrackResAC[listcount].senderCountry;
            }

            if (!this.receiveraddressline_1) {
              this.receiveraddressline_1 = this.fetchTrackResAC[listcount].receiverName;
            }
            if (!this.receiveraddressline_2) {
              this.receiveraddressline_2 = this.fetchTrackResAC[listcount].receiverCompanyName;
            }
            if (!this.receiveraddressline_3) {
              this.receiveraddressline_3 = this.fetchTrackResAC[listcount].receiverAddressLine1;
            }
            if (!this.receiveraddressline_4) {
              this.receiveraddressline_4 = this.fetchTrackResAC[listcount].receiverAddressLine2;
            }
            if (!this.receiveraddressline_5) {
              this.receiveraddressline_5 =
                (this.fetchTrackResAC[listcount].receiverCity || '') + '  ' +
                (this.fetchTrackResAC[listcount].receiverState || '') + '  ' +
                (this.fetchTrackResAC[listcount].receiverPostal || '');
            }
            if (!this.receiveraddressline_6) {
              this.receiveraddressline_6 = this.fetchTrackResAC[listcount].receiverCountry;
            }

            this.ref3 = this.formatText('NA');

            if (!this.service_id) {
              this.service_id = this.formatText(this.fetchTrackResAC[listcount].chargeDescription);
              this.pa_service_id = this.formatText(this.fetchTrackResAC[listcount].chargeDescription);
            }

            this.service_id = this.formatText(this.fetchTrackResAC[listcount].chargeDescription);
            this.pa_service_id = this.formatText(this.fetchTrackResAC[listcount].chargeDescription);
            this.account_id = this.formatText(this.fetchTrackResAC[listcount].accountNumber);
            this.paaccount_id = this.formatText(this.fetchTrackResAC[listcount].accountNumber);
            this.pa_pack_id = this.formatText(this.fetchTrackResAC[listcount].packageQuantity);

            this.pack_id1 = 'NA';
            this.pack_id2 = 'NA';
            this.pack_id = 'NA';
            this.pack_id13 = 'NA';
            this.ad_gl_id = 'NA';

            this.pa_billedweight_id = this.formatText(this.fetchTrackResAC[listcount].billedWeight);
            this.pa_acutal_id = this.formatText(this.fetchTrackResAC[listcount].enteredWeight);
            this.ref1 = this.formatText(this.fetchTrackResAC[listcount].shipmentReferenceNumber1);
            this.ref2 = this.formatText(this.fetchTrackResAC[listcount].shipmentReferenceNumber2);
            this.ref3 = this.formatText(this.fetchTrackResAC[listcount].originalRef3_PONumber);
            this.payor = this.formatText(this.fetchTrackResAC[listcount].billOptionCode);
            this.dimDivisor = this.formatText(this.fetchTrackResAC[listcount].dimDivisor);
            this.container_type = this.formatText(this.fetchTrackResAC[listcount].servicePackaging);
            this.pa_dim_id = this.formatText(this.fetchTrackResAC[listcount].packageDimensions);
            this.pa_ent_dim_id = 'NA';

            amount += Number(this.fetchTrackResAC[listcount].netAmount || 0);
            grossCharge += Number(this.fetchTrackResAC[listcount].grossCharge || 0);
            disamount += Number(this.fetchTrackResAC[listcount].incentiveAmount || 0);

            tempfreightObj = {};
            tempfreightObj['chargeDescription'] = this.formatText(this.fetchTrackResAC[listcount].chargeDescription);
            tempfreightObj['netAmount'] = String(this.fetchTrackResAC[listcount].grossCharge);
            this.freightChargeAC.push(tempfreightObj);

            this.grossamountgrandtotal_id += Number(this.fetchTrackResAC[listcount].grossCharge || 0);

            for (let loop1 = 1; loop1 <= 175; loop1++) {
              const lableDesc = 'trackingIDChargeDescription' + loop1;
              const lableAmount = 'trackingIDChargeAmount' + loop1;

              if (
                this.fetchTrackResAC[listcount].hasOwnProperty(lableDesc) &&
                this.fetchTrackResAC[listcount].hasOwnProperty(lableAmount)
              ) {
                const chargeDesc = this.fetchTrackResAC[listcount][lableDesc];
                const chargeAmount = Number(this.fetchTrackResAC[listcount][lableAmount]);

                if (chargeDesc !== '' && chargeDesc != null) {
                  if (chargeAmount < 0) {
                    tempaccObj = {};
                    tempaccObj['chargeDescription'] = chargeDesc;
                    tempaccObj['incentiveAmount'] = String(chargeAmount);
                    tempaccObj['netAmount'] = String(chargeAmount);
                    this.incentiveamountgrandtotal_id += chargeAmount;
                    this.accessorialsChargeAC.push(tempaccObj);
                  } else {
                    tempaccObj = {};
                    tempaccObj['chargeDescription'] = chargeDesc;
                    tempaccObj['netAmount'] = String(chargeAmount);
                    this.accnetamountgrandtotal_id += chargeAmount;
                    this.accessorialsChargeAC.push(tempaccObj);
                  }
                }
              }
            }

            this.netamountgrandtotal_id =
              this.grossamountgrandtotal_id +
              this.incentiveamountgrandtotal_id +
              this.accnetamountgrandtotal_id;

            if (!this.pa_ent_dim_id || this.pa_ent_dim_id === 'NA') {
              this.pa_ent_dim_id = this.formatText(this.fetchTrackResAC[listcount].billedDimension);
            }

            if (!this.pa_dim_id || this.pa_dim_id === 'NA') {
              this.pa_dim_id = this.formatText(this.fetchTrackResAC[listcount].packageDimensions);
            }

            for (let loop1 = 0; loop1 < 175; loop1++) {
              const lableDesc = 'trackingIDChargeDescription' + countchargeDesc;
              const lableAmount = 'trackingIDChargeAmount' + countchargeDesc;

              if (
                this.fetchTrackResAC[listcount].hasOwnProperty(lableDesc) &&
                this.fetchTrackResAC[listcount].hasOwnProperty(lableAmount)
              ) {
                const chargeDesc = this.fetchTrackResAC[listcount][lableDesc];
                const chargeAmount = Number(this.fetchTrackResAC[listcount][lableAmount]);

                if (chargeDesc !== '' && chargeDesc != null) {
                  tempaccObj = {};
                  tempaccObj['chargeDescription'] = chargeDesc;
                  tempaccObj['netAmount'] = String(chargeAmount);
                  acctotal += chargeAmount;
                  this.accessorialsAC.push(tempaccObj);
                }
              }

              returncount++;
              countchargeDesc++;
            }
          }

          tempObj = {};
          const lastItem = this.fetchTrackResAC[this.fetchTrackResAC.length - 1];

          this.invoice_id = this.formatText(lastItem?.invoiceNumber);
          this.tracking_id = this.formatText(lastItem?.trackingNumber);
          this.bi_invo_id = this.formatText(lastItem?.invoiceNumber);
          this.ad_tran_id = this.formatText(lastItem?.invoiceDueDate);
          this.ref1 = this.formatText(lastItem?.shipmentReferenceNumber1);
          this.ref2 = this.formatText(lastItem?.shipmentReferenceNumber2);
          this.ref3 = this.formatText(lastItem?.originalRef3_PONumber);

          netCharge = grossCharge + disamount;
          const grosstotal = netCharge + disamount;
          this.total = netCharge + acctotal;
          this.pa_pack_id = this.formatText(packagecount.toString());
          this.netdue_id = this.formatText(grosstotal.toString());
          this.charge_amt = this.formatText(this.total.toFixed(2));

          const txt_amount = this.formatText(refund.toFixed(2));
          this.refund_LinkBar11total = txt_amount;
          this.netdue_id = this.formatText((this.total + refund).toFixed(2));

          tempObj['trackingNumber'] = trackingnumber;
          tempObj['type'] = 'Fedex';
          tempObj['merged'] = 'Y';
          tempObj['invoiceNumber'] = this.formatText(lastItem?.invoiceNumber);
          tempObj['invoiceDate'] = this.formatText(this.bi_invoidat_id);
          tempObj['packageQuantity'] = this.formatText(packagecount.toString());
          tempObj['netAmount'] = this.formatText(amount.toFixed(2));
          tempObj['gstamount'] = this.formatText(refund.toFixed(2));
          this.gstAmount = tempObj['gstamount'];
          tempObj['total'] = this.formatText(amount.toFixed(2));
          this.commonAC.push(tempObj);
        }

        this.chargeinfocommonAC.push(tempchargeinfoObj);

        if (returncount <= 1) {
          const returncountplus = 2 - returncount;
          count = returncount + returncountplus;
        } else {
          count = this.accessorialsAC.length;
        }

        for (let listcount = 0; listcount < count; listcount++) {
          tempchargeinfoObj = {};

          if (shpflag === 0) {
            tempchargeinfoObj['gstamount'] = 'GROSS FRT CHARGE :';
            tempchargeinfoObj['netAmount'] = this.formatText(grossCharge.toFixed(2));
          } else if (shpflag === 1) {
            tempchargeinfoObj['gstamount'] = 'FRT INCENTIVE :';
            tempchargeinfoObj['netAmount'] = this.formatText('-' + disamount.toFixed(2));
            tempchargeinfoObj['gstrate'] = this.formatText((netCharge + acctotal).toFixed(2));
          } else if (shpflag === 2) {
            this.chargefieldFooter_headerText = ' NET FRT CHARGE :';
            this.accessfiledFooter1_headerText = this.formatText(netCharge.toFixed(2));
          } else {
            tempchargeinfoObj['gstamount'] = '';
            tempchargeinfoObj['netAmount'] = '';
          }

          if (listcount < this.accessorialsAC.length) {
            tempchargeinfoObj['chargeDescription'] = this.accessorialsAC[listcount].chargeDescription + ' :';
            tempchargeinfoObj['invoiceAmount'] = this.formatText(this.accessorialsAC[listcount].netAmount);
          } else {
            if (returncount1 === 0) {
              this.accessfiledFooter2_headerText = 'Total Accessorials';
              this.accessfiledFooter_headerText = this.formatText(acctotal.toFixed(2));
              returncount1 = 1;
            }
          }

          shpflag++;
          this.chargeinfocommonAC.push(tempchargeinfoObj);
        }

        tempchargeinfoObj = {};
        tempchargeinfoObj['gstamount'] = 'NET FRT CHARGE:';
        tempchargeinfoObj['netAmount'] = this.formatText(netCharge.toFixed(2));
        tempchargeinfoObj['chargeDescription'] = 'Total Accessorials';
        tempchargeinfoObj['invoiceAmount'] = this.formatText(acctotal.toFixed(2));
        this.chargeinfocommonACfooter.push(tempchargeinfoObj);
      } else {
        const listcount = 0;
        tempObj = {};

        this.bi_cli__id = this.clientName;
        refund = 0.0;
        this.service_id = this.formatText(this.fetchTrackResAC[listcount]?.chargeDescription);
        this.pa_service_id = this.formatText(this.fetchTrackResAC[listcount]?.chargeDescription);
        amount = Number(this.fetchTrackResAC[listcount]?.netAmount || 0);

        this.addressline_1 = this.fetchTrackResAC[listcount]?.senderName;
        this.addressline_2 = this.fetchTrackResAC[listcount]?.senderCompanyName;
        this.addressline_3 = this.fetchTrackResAC[listcount]?.senderAddressLine1;
        this.addressline_4 = this.fetchTrackResAC[listcount]?.senderAddressLine2;
        this.addressline_5 =
          (this.fetchTrackResAC[listcount]?.senderCity || '') + ' ' +
          (this.fetchTrackResAC[listcount]?.senderState || '') + '   ' +
          (this.fetchTrackResAC[listcount]?.senderPostal || '');
        this.addressline_6 = this.fetchTrackResAC[listcount]?.senderCountry;

        this.receiveraddressline_1 = this.fetchTrackResAC[listcount]?.receiverName;
        this.receiveraddressline_2 = this.fetchTrackResAC[listcount]?.receiverCompanyName;
        this.receiveraddressline_3 = this.fetchTrackResAC[listcount]?.receiverAddressLine1;
        this.receiveraddressline_4 = this.fetchTrackResAC[listcount]?.receiverAddressLine2;
        this.receiveraddressline_5 =
          (this.fetchTrackResAC[listcount]?.receiverCity || '') + '  ' +
          (this.fetchTrackResAC[listcount]?.receiverState || '') + '  ' +
          (this.fetchTrackResAC[listcount]?.receiverPostal || '');
        this.receiveraddressline_6 = this.fetchTrackResAC[listcount]?.receiverCountry;

        this.account_id = this.formatText(this.fetchTrackResAC[listcount]?.accountNumber);
        this.paaccount_id = this.formatText(this.fetchTrackResAC[listcount]?.accountNumber);
        this.pa_pack_id = this.formatText(this.fetchTrackResAC[listcount]?.packageQuantity);

        this.pack_id1 = 'NA';
        this.pack_id2 = 'NA';
        this.pack_id = 'NA';
        this.pack_id13 = 'NA';
        this.ad_gl_id = 'NA';

        this.pa_billedweight_id = this.formatText(this.fetchTrackResAC[listcount]?.billedWeight);
        this.pa_acutal_id = this.formatText(this.fetchTrackResAC[listcount]?.enteredWeight);
        this.ref1 = this.formatText(this.fetchTrackResAC[listcount]?.shipmentReferenceNumber1);
        this.ref2 = this.formatText(this.fetchTrackResAC[listcount]?.shipmentReferenceNumber2);
        this.ref3 = this.formatText(this.fetchTrackResAC[listcount]?.originalRef3_PONumber);
        this.payor = this.formatText(this.fetchTrackResAC[listcount]?.billOptionCode);
        this.dimDivisor = this.formatText(this.fetchTrackResAC[listcount]?.dimDivisor);
        this.container_type = this.formatText(this.fetchTrackResAC[listcount]?.servicePackaging);
        this.pa_dim_id = this.formatText(this.fetchTrackResAC[listcount]?.packageDimensions);
        this.pa_ent_dim_id = 'NA';
        this.invoice_id = this.formatText(this.fetchTrackResAC[listcount]?.invoiceNumber);
        this.tracking_id = this.formatText(this.fetchTrackResAC[listcount]?.trackingNumber);
        this.bi_invo_id = this.formatText(this.fetchTrackResAC[listcount]?.invoiceNumber);
        this.bi_invoidat_id = this.formatText(this.fetchTrackResAC[listcount]?.invoiceDate);
        this.pa_zone_id = this.formatText(this.fetchTrackResAC[listcount]?.zone);
        this.total = amount - refund;
        this.ad_tran_id = this.formatText(this.fetchTrackResAC[listcount]?.invoiceDueDate);
        this.fedexgross = Number(this.fetchTrackResAC[listcount]?.grossCharge || 0);
        this.fedexdiscount = Number(this.fetchTrackResAC[listcount]?.incentiveAmount || 0);
        this.charge_amt = this.formatText(this.fetchTrackResAC[listcount]?.chargeClassificationCode);

        const clientName = this.clientName || '';
        const clientwitSplcharName: string = clientName.replace(/[ ]/g, '_');
        this.mstTempObj['clientname'] = clientwitSplcharName;
        this.mstTempObj['fromdate'] = this.fromDate;
        this.mstTempObj['todate'] = this.toDate;
        this.mstTempObj['trackingNumber'] = this.Trackinfo;
        this.mstTempObj['chargeSource'] = 'Tracking Number';

        tempfreightObj = {};
        tempfreightObj['chargeDescription'] = this.formatText(this.fetchTrackResAC[listcount]?.chargeDescription);
        tempfreightObj['netAmount'] = String(this.fetchTrackResAC[listcount]?.grossCharge);
        this.freightChargeAC.push(tempfreightObj);

        this.grossamountgrandtotal_id += this.fedexgross;

        for (let loop1 = 1; loop1 <= 175; loop1++) {
          const lableDesc = 'trackingIDChargeDescription' + loop1;
          const lableAmount = 'trackingIDChargeAmount' + loop1;

          if (
            this.fetchTrackResAC[listcount].hasOwnProperty(lableDesc) &&
            this.fetchTrackResAC[listcount].hasOwnProperty(lableAmount)
          ) {
            const chargeDesc = this.fetchTrackResAC[listcount][lableDesc];
            const chargeAmount = Number(this.fetchTrackResAC[listcount][lableAmount]);

            if (chargeDesc !== '' && chargeDesc != null) {
              if (chargeAmount < 0) {
                tempaccObj = {};
                tempaccObj['chargeDescription'] = chargeDesc;
                tempaccObj['incentiveAmount'] = String(chargeAmount);
                tempaccObj['netAmount'] = String(chargeAmount);
                this.incentiveamountgrandtotal_id += chargeAmount;
                this.accessorialsChargeAC.push(tempaccObj);
              } else {
                tempaccObj = {};
                tempaccObj['chargeDescription'] = chargeDesc;
                tempaccObj['netAmount'] = String(chargeAmount);
                this.accnetamountgrandtotal_id += chargeAmount;
                this.accessorialsChargeAC.push(tempaccObj);
              }
            }
          }
        }

        this.netamountgrandtotal_id =
          this.grossamountgrandtotal_id +
          this.incentiveamountgrandtotal_id +
          this.accnetamountgrandtotal_id;

        if (this.invoiceCount === 0) {
          this.invoiceCount = this.fetchTrackResAC.length;

          for (let listcount1 = 0; listcount1 < this.fetchTrackResAC.length; listcount1++) {
            tempObj = {};
            tempObj['trackingNumber'] = this.formatText(this.fetchTrackResAC[listcount1]?.trackingNumber);
            tempObj['type'] = 'Fedex';
            tempObj['merged'] = 'N';
            tempObj['invoiceNumber'] = this.formatText(this.fetchTrackResAC[listcount1]?.invoiceNumber);
            tempObj['invoiceDate'] = this.formatText(this.fetchTrackResAC[listcount1]?.invoiceDate);
            tempObj['packageQuantity'] = this.formatText(this.fetchTrackResAC[listcount1]?.packageQuantity);
            tempObj['netAmount'] = this.formatText(this.fetchTrackResAC[listcount1]?.netAmount);
            tempObj['gstamount'] = this.formatText(refund.toFixed(2));
            this.gstAmount = tempObj['gstamount'];
            tempObj['total'] = this.formatText(this.fetchTrackResAC[listcount1]?.netAmount);
            this.netdue_id = this.formatText(refund.toFixed(2));
            this.refund_LinkBar11total = this.formatText(refund.toFixed(2));
            this.commonAC.push(tempObj);
          }
        }

        this.fetchservicefedex(this.mstTempObj);
      }
    }
  }

  fetchservicefedex(paramMstTempObj: any): void {
    this.httpfedexService.fetchservicefedex(paramMstTempObj).subscribe(
      (result: any) => {
        this.fetchServiceResult(result);
      },
      (error: any) => {
        console.error('fetchservicefedex error', error);
      }
    );
  }

  fetchServiceResult(event: any): void {
    this.serviceResultAC = event || [];
    this.postive = 0;
    this.fedexyear_2 = [];
    this.fedexyear_4 = [];

    if (this.serviceResultAC && this.serviceResultAC.length > 0) {
      this.fedexyear_1 = {};
      this.fedexyear_1['txt_default'] = 'Gross Frt Charges';
      this.fedexyear_1['txt_amount'] = this.formatText(Number(this.fedexgross || 0).toFixed(2));
      this.fedexyear_2.push(this.fedexyear_1);

      for (let listcount = 0; listcount < this.serviceResultAC.length; listcount++) {
        if (Number(this.serviceResultAC[listcount].chargeClassificationCode) < 0) {
          this.fedexgross += Number(this.serviceResultAC[listcount].chargeClassificationCode);

          this.fedexyear_1 = {};
          this.fedexyear_1['txt_default'] = this.formatText(this.serviceResultAC[listcount].chargeDescription);
          this.fedexyear_1['txt_amount'] = this.formatText(this.serviceResultAC[listcount].chargeClassificationCode);
          this.fedexyear_2.push(this.fedexyear_1);
        } else {
          this.fedexyear_3 = {};
          this.postive += Number(this.serviceResultAC[listcount].chargeClassificationCode);
          this.fedexyear_3['txt_default'] = this.formatText(this.serviceResultAC[listcount].chargeDescription);
          this.fedexyear_3['txt_amount'] = this.formatText(this.serviceResultAC[listcount].chargeClassificationCode);
          this.fedexyear_4.push(this.fedexyear_3);
        }
      }

      this.fedexyear_3 = {};
      this.fedexyear_3['txt_default'] = 'Total Accessorials';
      this.fedexyear_3['txt_amount'] = this.formatText(this.postive.toFixed(2));
      this.fedexyear_4.push(this.fedexyear_3);

      this.fedexyear_1 = {};
      this.fedexyear_1['txt_default'] = 'Net Frt Charges';
      this.fedexyear_1['txt_amount'] = this.formatText(Number(this.fedexgross || 0).toFixed(2));
      this.fedexyear_2.push(this.fedexyear_1);

      this.charge_amt = this.formatText((this.postive + this.fedexgross).toFixed(2));
      this.netdue_id = this.formatText((this.postive + this.fedexgross).toFixed(2));
    }
    this._cd.markForCheck()
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'close', data: this.fromDialog });
  }

  generatetrackingexcel(): void {
    const urlParam: any = {};
    const trackingParam = this.fromPage;
    const currentDate = new Date();

    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['reportName'] = 'TRACKING_NUMBER_EXCEL';
    urlParam['reportType'] = 'TRACKING_NUMBER_EXCEL';
    urlParam['reportFormat'] = 'excel';
    urlParam['accNo'] = '';
    urlParam['accountNumber'] = '';
    urlParam['clientName'] = trackingParam.clientname;
    urlParam['tableName'] = 'T001_' + trackingParam.clientname.replace(/[ ]/g, '_') + '_Invoice_2015';
    urlParam['clientId'] = trackingParam.clientId;
    urlParam['fromDate'] = trackingParam.fromdate;
    urlParam['toDate'] = trackingParam.todate?.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = 'TrackingNo_Report';
    urlParam['status'] = 'IN QUEUE';
    urlParam['desc'] = '';
    urlParam['grp'] = '';
    urlParam['chargeType'] = trackingParam.chargeDes;
    urlParam['chargeDesc'] = (this.clientName || '').replace(/[^a-zA-Z0-9 ]/g, '');
    urlParam['chargeGroup'] = '';
    urlParam['t002ClientProfileobj'] = trackingParam.t002ClientProfileObj;

    this.httpfedexService.runReport(urlParam).subscribe(
      (result: any) => {
        this.saveOrUpdateReportLogResultFedex(result);
      },
      (error: any) => {
        console.error('runReport error', error);
      }
    );
  }

  saveOrUpdateReportLogResultFedex(result: any): void {
    this.reportsFormGroup.get('reportLogId')?.setValue(result?.reportLogId);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result?.t002ClientProfileobj?.clientId);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal(
      'Your request has been added to the report queue. When complete, your file will be downloaded automatically.'
    );
  }

  generatetrackingpdfFedex(): void {
    const trackingParam = this.fromPage;
    const Master_reportlogobj: any = {};

    Master_reportlogobj['fromdate'] = trackingParam.fromdate;
    Master_reportlogobj['todate'] = trackingParam.todate;
    Master_reportlogobj['chargeSource'] = 'Tracking Number';
    Master_reportlogobj['trackingNumber'] = trackingParam.chargeDes;
    Master_reportlogobj['clientId'] = trackingParam.clientId?.toString();
    Master_reportlogobj['clientname'] = trackingParam.clientname.replace(/[ ]/g, '_');
    Master_reportlogobj['invoiceId'] = trackingParam.invoiceId;
    Master_reportlogobj['type'] = 'Fedex_Tracking_Number_Report';

    this.fedexFetch_TrackingReport(Master_reportlogobj);
    this.openModal('Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.');
  }

  fedexFetch_TrackingReport(param: any): void {
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
        console.error('fedexFetch_TrackingReport error', error);
      }
    );
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
}