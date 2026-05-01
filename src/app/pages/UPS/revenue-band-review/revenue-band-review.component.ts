import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { environment } from 'src/environments/environment';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-ups-revenue-band-review',
  templateUrl: './revenue-band-review.component.html',
  styleUrls: ['./revenue-band-review.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatDialogModule,
    MatButtonModule, MatIconModule]
})
export class RevenueBandReviewComponent implements OnInit, AfterViewInit, OnDestroy {
  clientType = '';
  userProfifleData: any;
  clientName = '';
  themeOption: any;
  panelClass = '';
  currentDate: any;
  randomNumber: any;
  carrierType: any;
  clientID: any;
  clientNameRegex: any;
  crmAccountNumber: any; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog, private cookiesService: CookiesService,
    private httpClientService: HttpClientService, private changeDetector: ChangeDetectorRef,
    private datePipe: DatePipe, private router: Router, private commonService: CommonService,
    public dialogRef: MatDialogRef<RevenueBandReviewComponent>,
    private loaderService: LoaderService, private _cd: ChangeDetectorRef) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
      if (this.clientType == "OnTrac" || this.clientType == "Dhl" || this.clientType == "USPS") {
        this.router.navigate(['/' + this.clientType.toLowerCase() + '/dashboard']);
      }
    });
  }

  ngOnInit() {
    this.openLoading();
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    var date = new Date();
    this.currentDate = this.datePipe.transform(date, "MM-dd-yyyy");
    this.getProfilrDate();
    this.getClientDetails();
  }
  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    // this.disposeCharts();
  }
  async getClientDetails() {
    this.themeOption = await this.cookiesService.getCookie('themeOption').then(res => {
      return res;
    });
    this.clientName = await this.cookiesService.getCookie('clientName').then(res => {
      return res;
    });
    if (this.themeOption == "dark") {
      this.panelClass = 'page-dark';
    } else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    this.carrierType = await this.cookiesService.getCookie("chooseCarrier");
    this.clientID = await this.cookiesService.getCookie("clientId");
    this.clientNameRegex = await this.clientName.replace(/\s/g, "");
    this.ImageUrlData = await this.imageUrl + this.clientNameRegex + ".jpg";
    this.fetchClientLoginCredentials();
    this._cd.markForCheck();
  }

  fetchClientLoginCredentials() {
    var t001LogincustObj: any = {};
    if (this.carrierType == "UPS")
      t001LogincustObj['upsClientId'] = this.clientID;
    else
      t001LogincustObj['fedexClientId'] = this.clientID;

    t001LogincustObj['CarrierName'] = this.carrierType;
    this.httpClientService.findClientLoginCredential(t001LogincustObj).subscribe(
      (result: any) => {
        this.closeLoading();
        this.crmAccountNumber = result[0].crmAccountNumber;
        this.getRevenueBandTier(this.crmAccountNumber, this.carrierType)
      }, (error: any) => {
        this.closeLoading();
      })
  }
  async getProfilrDate() {
    this.userProfifleData = await this.commonService.getUserprofileData();
  }

  getRevenueBandTier(crmAccNo: any, carrierName: any) {
    this.httpClientService.getRevenueBandTier(crmAccNo, carrierName).subscribe(
      (result: any) => {
        if (result.length == 0 || result[0]['RevenueBand1From'] == null) {
          this.closeLoading();
          this.openModal("No Data Available");
          return;
        }
        this.getInvoiceforUpsAndFedex(this.crmAccountNumber, this.carrierType, result)

      }, (error: any) => {
        this.closeLoading();
        console.log("error", error);
      })
  }
  getInvoiceforUpsAndFedex(crmAccNo: any, carrierName: any, revenueBandTierRes: any) {
    this.httpClientService.getInvoiceforUpsAndFedex(crmAccNo, carrierName).subscribe(
      (result: any) => {
        if (result.length == 0) {
          this.openModal("No Data Available");
          return;
        }
        this.revenueband(revenueBandTierRes, result);
        this._cd.markForCheck();
      }, (error: any) => { console.log("error", error); })
  }

  async revenueband(revenueBandTierRes: any[], InvoiceforUpsAndFedexRes: any[]) {
    var revenueTierRes = revenueBandTierRes[0];
    var revenueBandFromFormattedVal: any;
    for (const key of Object.keys(revenueTierRes)) {
      if (revenueTierRes[key] == 'Up') {
        var revenueBandStr = key.slice(0, 12)
        var revenueBandFrom = revenueTierRes[revenueBandStr + 'From'].split(' ')[1];
        var revenueBandFromFormatted = revenueBandFrom.replace(/\,/g, "")
        revenueBandFromFormattedVal = parseInt(revenueBandFromFormatted.split('.')[0])
      }
    }
    var InvoiceforUpsAndFedexResRev = InvoiceforUpsAndFedexRes.reverse();
    var InvoiceforUpsAndFedexResArr = [];
    var countOfZero = 1;
    var valueToAdd = '1';
    while (countOfZero < revenueBandFromFormatted.split('.')[0].length) {
      valueToAdd += '0';
      countOfZero += 1;
    }
    var valueToAddNum = +valueToAdd / 2;
    var revenueBand7From = this.removeSpclCharacters(revenueTierRes.RevenueBand7From); var revenueBand7To = this.removeSpclCharacters(revenueTierRes.RevenueBand7To);
    var revenueBand6From = this.removeSpclCharacters(revenueTierRes.RevenueBand6From); var revenueBand6To = this.removeSpclCharacters(revenueTierRes.RevenueBand6To);
    var revenueBand5From = this.removeSpclCharacters(revenueTierRes.RevenueBand5From); var revenueBand5To = this.removeSpclCharacters(revenueTierRes.RevenueBand5To);
    var revenueBand4From = this.removeSpclCharacters(revenueTierRes.RevenueBand4From); var revenueBand4To = this.removeSpclCharacters(revenueTierRes.RevenueBand4To);
    var revenueBand3From = this.removeSpclCharacters(revenueTierRes.RevenueBand3From); var revenueBand3To = this.removeSpclCharacters(revenueTierRes.RevenueBand3To);
    var revenueBand2From = this.removeSpclCharacters(revenueTierRes.RevenueBand2From); var revenueBand2To = this.removeSpclCharacters(revenueTierRes.RevenueBand2To);
    var revenueBand1From = this.removeSpclCharacters(revenueTierRes.RevenueBand1From); var revenueBand1To = this.removeSpclCharacters(revenueTierRes.RevenueBand1To);
    var expensesMax = 0;
    var weeklySpendMax = 0;
    for (let loop = 0; loop < InvoiceforUpsAndFedexResRev.length; loop++) {
      if (expensesMax < Number(InvoiceforUpsAndFedexResRev[loop].InvoiceRevenueBand.replace(/\,/g, ""))) {
        expensesMax = Number(InvoiceforUpsAndFedexResRev[loop].InvoiceRevenueBand.replace(/\,/g, ""));
      }
    }
    for (let loop = 0; loop < InvoiceforUpsAndFedexResRev.length; loop++) {
      if (expensesMax < Number(InvoiceforUpsAndFedexResRev[loop].InvoiceRevenueBand.replace(/\,/g, ""))) {
        expensesMax = Number(InvoiceforUpsAndFedexResRev[loop].InvoiceRevenueBand.replace(/\,/g, ""));
      }
      if (weeklySpendMax < Number(InvoiceforUpsAndFedexResRev[loop].WeeklySpend.replace(/\,/g, ""))) {
        weeklySpendMax = Number(InvoiceforUpsAndFedexResRev[loop].WeeklySpend.replace(/\,/g, ""));
      }
      var countOfZeroWeeklySpend = 1;
      var valueToAddWeeklySpend = '1';
      while (countOfZeroWeeklySpend < InvoiceforUpsAndFedexResRev[loop].WeeklySpend.split('.')[0].length) {
        valueToAddWeeklySpend += '0';
        countOfZeroWeeklySpend += 1;
      }
      var valueToAddNumWeeklySpend = +valueToAddWeeklySpend / 2;

      var invoiceDate = InvoiceforUpsAndFedexResRev[loop].InvoiceDate;
      var date_TimeStamp = invoiceDate;
      var invoiceDD = date_TimeStamp.split('-')[1];
      var invoiceDay_Mnth = this.datePipe.transform(invoiceDate, "MM/dd/yyyy")
      var revenuBandMaxVal = revenueBandFromFormattedVal + valueToAddNum;
      var expensesMaxVal = Number(expensesMax) + Number(valueToAddNum);
      var maxValAxis: any = Math.max(expensesMaxVal, revenuBandMaxVal);
      var weeklySpendMaxVal = Number(weeklySpendMax) + Number(valueToAddNumWeeklySpend);
      var weeklySpendMaxAxis: any = Math.max(weeklySpendMaxVal, revenuBandMaxVal);
      if (invoiceDD == '01')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '02')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '03')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '04')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '05')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '06')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '07')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '08')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '09')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '10')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '11')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })
      if (invoiceDD == '12')
        InvoiceforUpsAndFedexResArr.push({
          "month": invoiceDay_Mnth,
          "expenses": InvoiceforUpsAndFedexRes[loop] ? InvoiceforUpsAndFedexRes[loop].InvoiceRevenueBand : 0,
          "tier7": revenueTierRes.RevenueBand7To == 'Up' ? maxValAxis : revenueBand7To - revenueBand7From,
          "tier6": revenueTierRes.RevenueBand6To == 'Up' ? maxValAxis : revenueBand6To - revenueBand6From,
          "tier5": revenueTierRes.RevenueBand5To == 'Up' ? maxValAxis : revenueBand5To - revenueBand5From,
          "tier4": revenueTierRes.RevenueBand4To == 'Up' ? maxValAxis : revenueBand4To - revenueBand4From,
          "tier3": revenueTierRes.RevenueBand3To == 'Up' ? maxValAxis : revenueBand3To - revenueBand3From,
          "tier2": revenueTierRes.RevenueBand2To == 'Up' ? maxValAxis : revenueBand2To - revenueBand2From,
          "tier1": revenueTierRes.RevenueBand1To == 'Up' ? maxValAxis : revenueBand1To - revenueBand1From,
          "weeklySpend": InvoiceforUpsAndFedexRes[loop].WeeklySpend,
        })

    }
    var chart = am4core.create("chartdiv1", am4charts.XYChart);
    this.chart1 = chart;
    chart.colors.step = 2;
    // Add data
    chart.data = InvoiceforUpsAndFedexResArr;

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
    categoryAxis.dataFields.category = "month";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.rotation = 300;
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.fontWeight = '400';

    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.min = 0;
    // valueAxis.max = revenuBandMaxVal+100;
    valueAxis.max = maxValAxis + 100;
    // valueAxis.extraMin = 0.1;
    // valueAxis.extraMax = 0.1;
    valueAxis.strictMinMax = true;
    valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
    valueAxis.title.text = "Weekly Revenue Band ($)";
    valueAxis.title.fontSize = 12;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.opposite = false;
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return "$" + text;
    });

    var NetAmountAxis = chart.yAxes.push(new am4charts.ValueAxis());
    NetAmountAxis.min = 0;
    NetAmountAxis.max = weeklySpendMaxAxis + 100;
    NetAmountAxis.strictMinMax = true;
    NetAmountAxis.cursorTooltipEnabled = false; //disable axis tooltip
    NetAmountAxis.title.text = "Total 52 Week Net Spend ($)";
    NetAmountAxis.title.fontSize = 12;
    NetAmountAxis.calculateTotals = true;
    NetAmountAxis.renderer.opposite = true;
    NetAmountAxis.renderer.labels.template.adapter.add("text", function (text) {
      return "$" + text;
    });

    var targetTier;
    if (this.carrierType.toLowerCase() == "ups")
      targetTier = revenueTierRes.Target_tier_UPS
    else
      targetTier = revenueTierRes.Target_tier_Fedex

    var series7 = chart.series.push(new am4charts.LineSeries());

    series7.name = "Tier1";
    series7.dataFields.valueY = "tier1";
    series7.dataFields.categoryX = "month";


    series7.fillOpacity = 0.85;
    series7.stacked = true;

    if (revenueTierRes.RevenueBand1From == "$ 0.00") {
      series7.hiddenInLegend = true;
    }

    if (targetTier != null) {
      series7.legendSettings.labelText = targetTier[2] == '1' ? "[Bold style='font-weight:800';] Tier1 :" : "Tier1 :";
      series7.legendSettings.valueText = targetTier[2] == '1' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand1From + " - " + revenueTierRes.RevenueBand1To :
        revenueTierRes.RevenueBand1From + " - " + revenueTierRes.RevenueBand1To;
    }
    else {
      series7.legendSettings.labelText = "Tier1 :";
      series7.legendSettings.valueText = revenueTierRes.RevenueBand1From + " - " + revenueTierRes.RevenueBand1To;
    }
    series7.fill = am4core.color("#FA5959")

    var series6 = chart.series.push(new am4charts.LineSeries());


    series6.name = "Tier2";
    series6.dataFields.valueY = "tier2";
    series6.dataFields.categoryX = "month";

    series6.fillOpacity = 0.85;
    series6.stacked = true;

    if (revenueTierRes.RevenueBand2From == "$ 0.00") {
      series6.hiddenInLegend = true;
    }

    if (targetTier != null) {
      series6.legendSettings.labelText = targetTier[2] == '2' ? "[Bold style='font-weight:800';] Tier2 :" : "Tier2 :";
      series6.legendSettings.valueText = targetTier[2] == '2' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand2From + " - " + revenueTierRes.RevenueBand2To :
        revenueTierRes.RevenueBand2From + " - " + revenueTierRes.RevenueBand2To;
    } else {
      series6.legendSettings.labelText = "Tier2 :";
      series6.legendSettings.valueText = revenueTierRes.RevenueBand2From + " - " + revenueTierRes.RevenueBand2To;
    }
    series6.fill = am4core.color("#F78881")

    var series5 = chart.series.push(new am4charts.LineSeries());


    series5.name = "Tier3";
    series5.dataFields.valueY = "tier3";
    series5.dataFields.categoryX = "month";

    series5.fillOpacity = 0.85;
    series5.stacked = true;

    if (revenueTierRes.RevenueBand3From == "$ 0.00") {
      series5.hiddenInLegend = true;
    }
    if (targetTier != null) {
      series5.legendSettings.labelText = targetTier[2] == '3' ? "[Bold style='font-weight:800';] Tier3 :" : "Tier3 :";
      series5.legendSettings.valueText = targetTier[2] == '3' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand3From + " - " + revenueTierRes.RevenueBand3To :
        revenueTierRes.RevenueBand3From + " - " + revenueTierRes.RevenueBand3To;
    } else {
      series5.legendSettings.labelText = "Tier3 :";
      series5.legendSettings.valueText = revenueTierRes.RevenueBand3From + " - " + revenueTierRes.RevenueBand3To;
    }
    series5.fill = am4core.color("#FB9B46")
    var series4 = chart.series.push(new am4charts.LineSeries());

    series4.name = "Tier4";
    series4.dataFields.valueY = "tier4";
    series4.dataFields.categoryX = "month";

    series4.fillOpacity = 0.85;
    series4.stacked = true;

    // static
    if (revenueTierRes.RevenueBand4From == "$ 0.00") {
      series4.hiddenInLegend = true;
    }
    if (targetTier != null) {
      series4.legendSettings.labelText = targetTier[2] == '4' ? "[Bold style='font-weight:800';] Tier4 :" : "Tier4 :";
      series4.legendSettings.valueText = targetTier[2] == '4' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand4From + " - " + revenueTierRes.RevenueBand4To :
        revenueTierRes.RevenueBand4From + " - " + revenueTierRes.RevenueBand4To;
    }
    else {
      series4.legendSettings.labelText = "Tier4 :";
      series4.legendSettings.valueText = revenueTierRes.RevenueBand4From + " - " + revenueTierRes.RevenueBand4To;
    }
    series4.fill = am4core.color("#FCD55A")

    var series3 = chart.series.push(new am4charts.LineSeries());


    series3.name = "Tier5";
    series3.dataFields.valueY = "tier5";
    series3.dataFields.categoryX = "month";


    series3.fillOpacity = 0.85;
    series3.stacked = true;

    // static
    if (revenueTierRes.RevenueBand5From == "$ 0.00") {
      series3.hiddenInLegend = true;
    }
    if (targetTier != null) {
      series3.legendSettings.labelText = targetTier[2] == '5' ? "[Bold style='font-weight:800';] Tier5 :" : "Tier5 :";
      series3.legendSettings.valueText = targetTier[2] == '5' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand5From + " - " + revenueTierRes.RevenueBand5To :
        revenueTierRes.RevenueBand5From + " - " + revenueTierRes.RevenueBand5To;
    }
    else {
      series3.legendSettings.labelText = "Tier5 :";
      series3.legendSettings.valueText = revenueTierRes.RevenueBand5From + " - " + revenueTierRes.RevenueBand5To;
    }
    series3.fill = am4core.color("#D2E77C")

    var series2 = chart.series.push(new am4charts.LineSeries());


    series2.name = "Tier6";
    series2.dataFields.valueY = "tier6";
    series2.dataFields.categoryX = "month";

    series2.fillOpacity = 0.85;
    series2.stacked = true;

    // static
    if (revenueTierRes.RevenueBand6From == "$ 0.00") {
      series2.hiddenInLegend = true;
    }
    if (targetTier != null) {
      series2.legendSettings.labelText = targetTier[2] == '6' ? "[Bold style='font-weight:800';] Tier6 :" : "Tier6 :";
      series2.legendSettings.valueText = targetTier[2] == '6' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand6From + " - " + revenueTierRes.RevenueBand6To :
        revenueTierRes.RevenueBand6From + " - " + revenueTierRes.RevenueBand6To;
    }
    else {
      series2.legendSettings.labelText = "Tier6 :";
      series2.legendSettings.valueText = revenueTierRes.RevenueBand6From + " - " + revenueTierRes.RevenueBand6To;
    }
    series2.fill = am4core.color("#5BD160")

    var series = chart.series.push(new am4charts.LineSeries());

    series.name = "Tier7";
    series.dataFields.valueY = "tier7";
    series.dataFields.categoryX = "month";

    series.fillOpacity = 0.85;
    series.stacked = true;

    // static
    if (revenueTierRes.RevenueBand7From == "$ 0.00") {
      series.hiddenInLegend = true;
    }
    if (targetTier != null) {
      series.legendSettings.labelText = targetTier[2] == '7' ? "[Bold style='font-weight:800';] Tier7 :" : "Tier7 :";
      series.legendSettings.valueText = targetTier[2] == '7' ? "[Bold style='font-weight:800';]" + revenueTierRes.RevenueBand7From + " - " + revenueTierRes.RevenueBand7To :
        revenueTierRes.RevenueBand7From + " - " + revenueTierRes.RevenueBand7To;
    }
    else {
      series.legendSettings.labelText = "Tier7 :";
      series.legendSettings.valueText = revenueTierRes.RevenueBand7From + " - " + revenueTierRes.RevenueBand7To;
    }
    series.fill = am4core.color("#55BDA0")

    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    chart.numberFormatter.numberFormat = "#,###.00";
    var lineSeries: any = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = "Expenses";
    lineSeries.dataFields.valueY = "expenses";
    lineSeries.dataFields.categoryX = "month";
    lineSeries.yAxis = valueAxis;
    lineSeries.stroke = am4core.color("#000000");
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    lineSeries.tooltip.label.textAlign = "middle";
    lineSeries.hiddenInLegend = true;

    var dottedSeries: any = chart.series.push(new am4charts.LineSeries());
    dottedSeries.name = "NetAmount";
    dottedSeries.dataFields.valueY = "weeklySpend";
    dottedSeries.dataFields.categoryX = "month";
    dottedSeries.yAxis = NetAmountAxis;
    dottedSeries.stroke = am4core.color("#717275");
    dottedSeries.strokeWidth = 5;
    dottedSeries.propertyFields.strokeDasharray = "dotteddash";
    dottedSeries.strokeDasharray = "12,6";
    dottedSeries.tooltip.label.textAlign = "middle";
    dottedSeries.hiddenInLegend = true;

    var bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("#000000"); // tooltips grab fill from parent by default
    bullet.tooltipText = "[#fff font-size: 12px]$ {valueY}[/]"
    var circle = bullet.createChild(am4core.Circle);
    circle.radius = 3;
    circle.fill = am4core.color("#000000");
    circle.strokeWidth = 6;

    var bullet = dottedSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("#717275"); // tooltips grab fill from parent by default
    bullet.tooltipText = "[#fff font-size: 12px]$ {valueY}[/]"
    var circle = bullet.createChild(am4core.Circle);
    circle.radius = 4;
    circle.fill = am4core.color("#717275");
    circle.strokeWidth = 7;

    if (this.themeOption == "dark") {
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      categoryAxis.title.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
      chart.legend.valueLabels.template.fill = am4core.color("#fff");
    }
    this._cd.markForCheck();
  }

  removeSpclCharacters(param: any) {
    return parseFloat(param.replace(/[^0-9.]/g, ""));
  }
  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        var ctx: any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var dataURL = canvas.toDataURL("image/png");

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }
  chart1: any;
  imageUrl = environment.imageURL;
  ImageUrlData: any;

  async savePDF(): Promise<void> {
    const currentDate = this.currentDate || '';
    const chart1 = this.chart1;

    if (!chart1) {
      this.openModal('No Data Available');
      return;
    }

    let clientImageDataUrl: any;
    let ljmImageDataUrl: any;
    let infoIconDataUrl: any;

    try {
      clientImageDataUrl = await this.getBase64ImageFromURL('Ljm_image/' + this.clientNameRegex + '.jpg');
    } catch {
      clientImageDataUrl = null;
    }

    try {
      ljmImageDataUrl = await this.getBase64ImageFromURL('assets/images/logo/ljm_logoImg.png');
    } catch {
      ljmImageDataUrl = null;
    }

    try {
      infoIconDataUrl = await this.getBase64ImageFromURL("assets/images/icon/info-icon.png");
    } catch {
      infoIconDataUrl = null;
    }

    this.openModal(
      'Your request has been added to the report queue. When complete, your file will be downloaded automatically.'
    );

    const clientNameObj = this.clientName || '';

    Promise.all([
      chart1.exporting.pdfmake,
      chart1.exporting.getImage('png')
    ])
    .then((res: any[]) => {
      const pdfMake = res[0];
      const chartImage = res[1];

      // Important
      pdfMake.vfs = null;
      pdfMake.vfs = pdfFonts;

      const doc: any = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [25, 25, 25, 25],
        content: []
      };

      const headerColumns: any[] = [];

      headerColumns.push(
        clientImageDataUrl
          ? {
              image: clientImageDataUrl,
              width: 80,
              alignment: 'left',
              margin: [0, 10, 0, 0]
            }
          : {
              text: '',
              width: 80
            }
      );

      headerColumns.push({
        width: '*',
        stack: [
          {
            text: 'Revenue Tier Analysis and Rolling 52 Week Spend',
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 15, 0, 0]
          }
        ]
      });

      headerColumns.push(
        ljmImageDataUrl
          ? {
              image: ljmImageDataUrl,
              width: 80,
              alignment: 'right',
              margin: [0, 5, 0, 0]
            }
          : {
              text: '',
              width: 80
            }
      );

      doc.content.push({
        columns: headerColumns,
        columnGap: 10,
        margin: [0, 0, 0, 10]
      });

      doc.content.push({
        text: clientNameObj,
        fontSize: 17,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 25]
      });

      doc.content.push({
        image: chartImage,
        width: 540,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      });

      const infoRows = [
        'Bold = Target Tier',
        'Solid Line = Weekly Revenue Band',
        'Dotted Line = Total 52 Week Net Spend'
      ];

      infoRows.forEach((text, index) => {
        const row: any = {
          columns: [],
          columnGap: 5,
          margin: [0, 0, 0, index === infoRows.length - 1 ? 20 : 5]
        };

        if (infoIconDataUrl) {
          row.columns.push({
            image: infoIconDataUrl,
            width: 10,
            margin: [0, 2, 0, 0]
          });
        } else {
          row.columns.push({
            text: '•',
            width: 10
          });
        }

        row.columns.push({
          text,
          fontSize: 10,
          bold: true,
          alignment: 'left'
        });

        doc.content.push(row);
      });

      doc.content.push({
        text: 'Date: ' + currentDate,
        fontSize: 10,
        bold: true,
        alignment: 'right',
        margin: [0, 10, 0, 0]
      });

      const safeClientName = String(clientNameObj)
        .replace(/[\\/:*?"<>|]/g, '')
        .trim();

      pdfMake
        .createPdf(doc)
        .download(`Revenue_Band_Tier_Analysis_${safeClientName}.pdf`);
    })
    .catch((error: any) => {
      console.error('PDF download error:', error);
      this.openModal('Unable to generate PDF. Please try again.');
    });
  }
  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  close() {
    this.dialogRef.close();
  }

 isLoading :any= signal<any>(false);   
    openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
}