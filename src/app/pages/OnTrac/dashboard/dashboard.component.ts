import { Component, OnInit, Signal, signal, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';
import { circle, latLng, tileLayer } from 'leaflet';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CookiesService } from 'src/app/core/services/cookie.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { firstValueFrom, map, Observable, ReplaySubject, startWith, Subject, take, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
import { OntracWeightDistPopupComponent } from '../popup/ontrac-weight-dist-popup/ontrac-weight-dist-popup.component';
import { OntracZonePopupComponent } from '../popup/ontrac-zone-popup/ontrac-zone-popup.component';
import { OntracMoreServicePopupComponent } from '../popup/ontrac-more-service-popup/ontrac-more-service-popup.component';
import { OntracChargeDescPopupComponent } from '../popup/ontrac-charge-desc-popup/ontrac-charge-desc-popup.component';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-ontrac-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class OntracDashboardComponent implements OnInit {
  clientType: any;
  randomNumber: any;
  clientProfileFormGroup!: FormGroup;
  currentDate: any;
  selectedOption: any;
  toDate: any;
  fromDate: any;
  dates: any;
  searchForm: any;
  isLoading: any;
  userProfile: any[] = [];
  selectYear: any = [];
  projectName: any;
  dashBoardSHP!: FormGroup;
  Accountoptions = [];
  domesticGroundService = signal<any>([]);
  GprogressBar_visible: any;
  GprogressBar_includeInLayout: any;
  GprogressBar_label_visible: any;
  GprogressBar_label_includeInLayout: any;
  MisprogressBar_visible: any;
  MisprogressBar_includeInLayout: any;
  MisprogressBar_label_visible: any;
  MisprogressBar_label_includeInLayout: any;
  OnCallprogressBar_visible: any;
  OnCallprogressBar_includeInLayout: any;
  OnCallprogressBar_label_visible: any;
  OnCallprogressBar_label_includeInLayout: any;
  SerFeeprogressBar_visible: any;
  SerFeeprogressBar_includeInLayout: any;
  SerFeeprogressBar_label_visible: any;
  SerFeeprogressBar_label_includeInLayout: any;
  SunriseprogressBar_visible: any;
  SunriseprogressBar_includeInLayout: any;
  SunriseprogressBar_label_visible: any;
  SunriseprogressBar_label_includeInLayout: any;
  SunriseGoldprogressBar_visible: any;
  SunriseGoldprogressBar_includeInLayout: any;
  SunriseGoldprogressBar_label_visible: any;
  SunriseGoldprogressBar_label_includeInLayout: any;
  heavyweightprogressBar_visible: any;
  heavyweightprogressBar_includeInLayout: any;
  heavyweightprogressBar_label_visible: any;
  heavyweightprogressBar_label_includeInLayout: any;
  sameDayAnytimeprogressBar_visible: any;
  sameDayAnytimeprogressBar_includeInLayout: any;
  sameDayAnytimeprogressBar_label_visible: any;
  sameDayAnytimeprogressBar_label_includeInLayout: any;
  fuelprogressBar_visible: any;
  fuelprogressBar_includeInLayout: any;
  fuelprogressBar_label_visible: any;
  fuelprogressBar_label_includeInLayout: any;
  surepost_id_visible: any;
  surepost_id_includeInLayout: any;
  surepost_label_visible: any;
  surepost_label_includeInLayout: any;
  sccprogressBar_visible: any;
  sccprogressBar_includeInLayout: any;
  sccprogressBar_label_visible: any;
  sccprogressBar_label_includeInLayout: any;
  addressCorrection_visible: any;
  addressCorrection_includeInLayout: any;
  addressCorrection_label_visible: any;
  addressCorrection_label_includeInLayout: any;
  declaredValue_visible: any;
  declaredValue_includeInLayout: any;
  declaredValue_label_visible: any;
  declaredValue_label_includeInLayout: any;
  chargeBack_visible: any;
  chargeBack_includeInLayout: any;
  chargeBack_label_visible: any;
  chargeBack_label_includeInLayout: any;
  maxValue: any;
  maxVal: any;
  testtotSpend004AC = [];
  allzonefrtaccAC = [];
  chargePopupfrtaccAC = [];
  menuBgDefault: any;

  GprogressBar: any;
  MisprogressBar: any;
  OnCallprogressBar: any;
  SerFeeprogressBar: any;
  SunriseprogressBar: any;
  SunriseGoldprogressBar: any;
  heavyweightprogressBar: any;
  sameDayAnytimeprogressBar: any;
  fuelprogressBar: any;
  surepost_id: any;
  sccprogressBar: any;
  addressCorrection: any;
  declaredValueprogressBar: any;
  chargeBack: any;
  sendValue: any = {};
  dialogValue: any;
  progressBar = {};
  tempDate: any = [];
  themeOption: any;
  SearchType = 'TrackingNumber';
  progressBarOntracList: any[] = [];
  showColumnPicker = false;
  constructor(public toastService: ToastService, private commonService: CommonService,
    private httpOntracService: HttpOntracService, private loaderService: LoaderService,
    private dialog: MatDialog, private datePipe: DatePipe, private router: Router,
    private cookiesService: CookiesService, private switchProj: SwitchProjectService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
    });
    this.initForm();
  }

  toggleColumnPicker() {
    this.showColumnPicker = !this.showColumnPicker;
  }
  closeColumnPicker() {
    this.showColumnPicker = false;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('.more_btn_drop')) return;
    this.closeColumnPicker();
  }
  initForm() {
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('FRT+ACC')
    });

    this.searchForm = new FormGroup({
      clientId: new FormControl(''),
      clientname: new FormControl(''),
      fromdate: new FormControl(''),
      todate: new FormControl(''),
      basisValue: new FormControl(''),
      searchDetail: new FormControl(''),
      receiverPostal: new FormControl(''),
      chargeSource: new FormControl(''),
      upsinternalUse: new FormControl(''),
      typeCode1: new FormControl(''),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      })
    });

    this.clientProfileFormGroup = new FormGroup({
      status: new FormControl('ACTIVE'),
      lazyLoad: new FormControl('N'),
      clientName: new FormControl(''),
      clientId: new FormControl(''),
      accountNumber: new FormControl(null),
      year: new FormControl(''),
      month: new FormControl(null),
      invoiceMonth: new FormControl("1"),
      invoicemonth: new FormControl("1"),
      invoiceyear: new FormControl(""),
      groupby: new FormControl(""),
      accNo: new FormControl(''),
      group: new FormControl(""),
      chargetype: new FormControl(""),
      pointName: new FormControl(""),
      ipaddress: new FormControl(""),
      city: new FormControl(""),
      region: new FormControl(""),
      country: new FormControl(""),
      location: new FormControl(""),
      loginclientName: new FormControl(""),
      clientNameselected: new FormControl(""),
      fromDate: new FormControl(""),
      toDate: new FormControl(""),
      fromdate: new FormControl(""),
      todate: new FormControl(""),
      reportType: new FormControl(""),
      chargeDescription: new FormControl(""),
      services: new FormControl("")
    })
    this.cookiesService.checkForClientName();
    this.switchProj.projNameSource.subscribe((message: string) => {
      this.projectName = message;
    });
  }
  ngOnInit(): void {//Theme Style
    if (sessionStorage.getItem('toast')) {
      this.toastService.show('Logged in Successfull.', { classname: 'bg-success text-center text-white', delay: 5000 });
      sessionStorage.removeItem('toast');
    }
    // this._analyticsChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    // this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    //Theme Style

    this.initializeDefaults();
  }
  initializeDefaults() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.selectedOption = 'ALL';
    var date = new Date();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);
    var tempmonthStartDay = monthStartDay.toString();
    var tempmonthEndDay = monthEndDay.toString();
    //trackingDate
    this.toDate = new Date(tempmonthEndDay);
    this.fromDate = new Date(tempmonthEndDay);
    this.dates = { start: new Date(this.fromDate), end: new Date(this.toDate) };
    this.searchForm.patchValue({
      dateRange: {
        "start": new Date(this.fromDate), "end": new Date(this.toDate)
      }
    });


    this.searchForm.get('todate')?.setValue(new Date(tempmonthEndDay));
    this.searchForm.get('fromdate')?.setValue(new Date(tempmonthStartDay));
    this.initDashBoard();
    this.openLoading();

    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }
    this.cookiesService.getCookie('clientName').then((clientName) => {
      var clientName = clientName;
    });
    this.loadClientProfile();
  }
  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }
  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.Accountoptions.filter((option: any) => option.includes(filterValue));
  }
  cust_id_visible: any;
  cust_id_includeInLayout: any;
  cust_name_visible: any;
  cust_name_includeInLayout: any;
  //Init Load
  async intialize() {
    var clientName = await this.cookiesService.getCookie('clientName');
    if (clientName == "admin") {
      this.cust_id_visible = true;
      this.cust_id_includeInLayout = true;
      this.cust_name_visible = false;
      this.cust_name_includeInLayout = false;
    } else {
      this.cust_id_visible = false;
      this.cust_id_includeInLayout = false;
      this.cust_name_visible = true;
      this.cust_name_includeInLayout = true;
    }
  }

  currentyear: any;
  resultObj: any;
  async linkshpChange(data: any) {
    this.openLoading();
    this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
    this.bindingTitle();
    if (data == "FRT") {
      await this.linkfrt_clickHandler(data);
    }
    if (data == "FRT+ACC" || data == null) {
      await this.linkfrtacc_clickHandler(data);
    }

  }

  async fetchProgressServices() {
    await this.httpOntracService.fetchGroupedServicesChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.resultObj = result;
        this.fetchByServices_result(result);
      },
      (error: any) => {

      })
  }
  chargeBack_result = [];

  ground: any;
  miscellaneous: any;
  onCallPickup: any;
  serviceFee: any;
  sunrise: any;
  sunriseGold: any;
  declaredValue: any;
  extendedAreaFee: any;
  fuelSurcharge: any;
  wrongAddressFee: any;
  heavyweight: any;
  sameDayAnytime: any;
  chargeDesList: any = [];

  chargebackfrtacc: any;
  async fetchByServices_result(event: any) {
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.chargeBack_result = event;
    this.chargebackfrtacc = await this.chargeBack_result;
    var chargBacklength = 0;
    if (this.chargeBack_result != null && this.chargeBack_result.length > 0) {
      chargBacklength = this.chargeBack_result.length;
    }
    this.resetCharbackUI();
    this.ground = 0.00;
    this.miscellaneous = 0.00;
    this.onCallPickup = 0.00;
    this.serviceFee = 0.00;
    this.sunrise = 0.00;
    this.sunriseGold = 0.00;
    this.heavyweight = 0.00;
    this.sameDayAnytime = 0.00;
    this.declaredValue = 0.00;
    this.extendedAreaFee = 0.00;
    this.fuelSurcharge = 0.00;
    this.wrongAddressFee = 0.00;

    if (chargBacklength == 0) {
      this.ground = 0.00;
      this.miscellaneous = 0.00;
      this.onCallPickup = 0.00;
      this.serviceFee = 0.00;
      this.sunrise = 0.00;
      this.sunriseGold = 0.00;
      this.heavyweight = 0.00;
      this.sameDayAnytime = 0.00;
      this.declaredValue = 0.00;
      this.extendedAreaFee = 0.00;
      this.fuelSurcharge = 0.00;
      this.wrongAddressFee = 0.00;

      this.GprogressBar = 0.00;
      this.SerFeeprogressBar = 0.00;
      this.SunriseprogressBar = 0.00;
      this.OnCallprogressBar = 0.00;
      this.SunriseGoldprogressBar = 0.00;
      this.heavyweightprogressBar = 0.00;
      this.sameDayAnytimeprogressBar = 0.00;
      this.MisprogressBar = 0.00;
      this.progressBarOntracList = [];
      this.progressBarOntracList.push({ serviceType: 'Fuel Surcharge', progressBar: this.GprogressBar, netCharge: this.ground, serviceName: 'Fuel Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Additional Handling Surcharge', progressBar: this.SerFeeprogressBar, netCharge: this.serviceFee, serviceName: 'Additional Handling Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Delivery Area Surcharge', progressBar: this.SunriseprogressBar, netCharge: this.sunrise, serviceName: 'Delivery Area Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Over Maximum Limits Surcharge', progressBar: this.OnCallprogressBar, netCharge: this.onCallPickup, serviceName: 'Over Maximum Limits Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Address Correction Surcharge', progressBar: this.SunriseGoldprogressBar, netCharge: this.sunriseGold, serviceName: 'Address Correction Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Demand Surcharge', progressBar: this.heavyweightprogressBar, netCharge: this.heavyweight, serviceName: 'Demand Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Extended Area Surcharge', progressBar: this.sameDayAnytimeprogressBar, netCharge: this.sameDayAnytime, serviceName: 'Extended Area Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Demand Additional Handling Surcharge', progressBar: this.MisprogressBar, netCharge: this.miscellaneous, serviceName: 'Demand Additional Handling Surcharge' });
      this.progressBarOntracList.push({ serviceType: 'Demand Over Maximum Limits Surcharge', progressBar: this.MisprogressBar, netCharge: this.miscellaneous, serviceName: 'Demand Over Maximum Limits Surcharge' });
      this.domesticGroundService.set(this.progressBarOntracList);
      this.resetCharbackUI();
    }

    this.chargeDesList = [];
    this.maxValue = 0;

    if (this.chargeBack_result.length > 0) {
      this.progressBarOntracList = [];
      this.chargeBack_result.forEach((item: any) => {
        if (item.chargeType == 'ACC') {
          let amount = Number(item.netCharge);
          amount = Number.isNaN(amount) ? 0 : amount;
          this.progressBarOntracList.push({
            serviceType: item.groupBy,
            serviceName: item.groupBy,
            netCharge: amount,
            progressBar: 0
          });
        }
      });

      this.progressBarOntracList = this.progressBarOntracList
        .sort((a, b) => b.netCharge - a.netCharge)
        .slice(0, 10);

      const maxCharge = Math.max(
        ...this.progressBarOntracList.map(x => x.netCharge)
      );

      this.maxValue = maxCharge + (maxCharge / 10);

      for (let item of this.progressBarOntracList) {
        item.progressBar = await this.calcPercent(item.netCharge, this.maxValue);
      }
      this.domesticGroundService.set(this.progressBarOntracList);
    }
  }
  async calcPercent(dataValue: any, maxValue: any) {
    var obtained = dataValue;
    var total = maxValue;
    var percent = obtained * 100 / total;
    if (Number.isNaN(percent)) {
      return 0;
    }
    return await percent;
  }
  resetCharbackUI() {

    this.GprogressBar_visible = true;
    this.GprogressBar_includeInLayout = true;
    this.GprogressBar_label_visible = false;
    this.GprogressBar_label_includeInLayout = false;
    this.MisprogressBar_visible = true;
    this.MisprogressBar_includeInLayout = true;
    this.MisprogressBar_label_visible = false;
    this.MisprogressBar_label_includeInLayout = false;
    this.OnCallprogressBar_visible = true;
    this.OnCallprogressBar_includeInLayout = true;
    this.OnCallprogressBar_label_visible = false;
    this.OnCallprogressBar_label_includeInLayout = false;
    this.SerFeeprogressBar_visible = true;
    this.SerFeeprogressBar_includeInLayout = true;
    this.SerFeeprogressBar_label_visible = false;
    this.SerFeeprogressBar_label_includeInLayout = false;
    this.SunriseprogressBar_visible = true;
    this.SunriseprogressBar_includeInLayout = true;
    this.SunriseprogressBar_label_visible = false;
    this.SunriseprogressBar_label_includeInLayout = false;
    this.SunriseGoldprogressBar_visible = true;
    this.SunriseGoldprogressBar_includeInLayout = true;
    this.SunriseGoldprogressBar_label_visible = false;
    this.SunriseGoldprogressBar_label_includeInLayout = false;
    this.heavyweightprogressBar_visible = true;
    this.heavyweightprogressBar_includeInLayout = true;
    this.heavyweightprogressBar_label_visible = false;
    this.heavyweightprogressBar_label_includeInLayout = false;
    this.sameDayAnytimeprogressBar_visible = true;
    this.sameDayAnytimeprogressBar_includeInLayout = true;
    this.sameDayAnytimeprogressBar_label_visible = false;
    this.sameDayAnytimeprogressBar_label_includeInLayout = false;
    this.fuelprogressBar_visible = true;
    this.fuelprogressBar_includeInLayout = true;
    this.fuelprogressBar_label_visible = false;
    this.fuelprogressBar_label_includeInLayout = false;
    this.surepost_id_visible = true;
    this.surepost_id_includeInLayout = true;
    this.surepost_label_visible = false;
    this.surepost_label_includeInLayout = false;
    this.sccprogressBar_visible = true;
    this.sccprogressBar_includeInLayout = true;
    this.sccprogressBar_label_visible = false;
    this.sccprogressBar_label_includeInLayout = false;
    this.addressCorrection_visible = true;
    this.addressCorrection_includeInLayout = true;
    this.addressCorrection_label_visible = false;
    this.addressCorrection_label_includeInLayout = false;
    this.declaredValue_visible = true;
    this.declaredValue_includeInLayout = true;
    this.declaredValue_label_visible = false;
    this.declaredValue_label_includeInLayout = false;
    this.chargeBack_visible = true;
    this.chargeBack_includeInLayout = true;
    this.chargeBack_label_visible = false;
    this.chargeBack_label_includeInLayout = false;

  }


  userProfifle: any;
  clientID: any;
  themeoption: any;
  year_Select: any;
  month_Select: any;
  accountNumber: any;
  totalspendAcValue: any;
  isOpenModalOpened: boolean = false; //9126
  async initDashBoard() {
    this.userProfifle = await this.getuserProfile();
    this.clientID = await this.userProfifle[0].clientId;
    this.clientName = await this.userProfifle[0].clientName;
    var clientName = await this.userProfifle[0].clientName;
    await this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
    await this.fetchaccountDetailsOntrac();
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => {
      return res;
    });
    if (this.clientProfileFormGroup.get('year')?.value == "") {
      var date = new Date();
      if (date.getMonth() == 0 || (date.getMonth() == 1 && date.getDate() <= 5)) {
        var yearData: number = new Date().getFullYear() - 1;

      }
      else {
        var yearData: number = new Date().getFullYear();
      }
    } else {
      var yearData: number = this.clientProfileFormGroup.get('year')?.value;
    }
    if (this.clientProfileFormGroup.get('month')?.value == null || this.clientProfileFormGroup.get('month')?.value == '') {
      var monthdData = null;
    } else {
      var monthdData = this.clientProfileFormGroup.get('month')?.value;
    }
    this.currentyear = yearData;
    await this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
    await this.clientProfileFormGroup.get('clientName')?.setValue(this.clientName);
    await this.clientProfileFormGroup.get('year')?.setValue(yearData);
    await this.clientProfileFormGroup.get('invoiceyear')?.setValue(yearData);
    this.year_Select = await this.clientProfileFormGroup.get('year')?.value;
    this.month_Select = await this.clientProfileFormGroup.get('month')?.value;
    await this.clientProfileFormGroup.get('month')?.setValue(monthdData);
    if (this.accountNumber = "ALL") {
      await this.clientProfileFormGroup.get('accountNumber')?.setValue(null);
    }
    await this.httpOntracService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.fetchDataOntrac(result);
      },
      (error: any) => {
        console.log('error ', error);

      })
    await this.fetchdashboardservices()

    await this.fetchallzone();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();

  }
  totSpend004AC: any;
  async fetchdashboardservices() {
    await this.httpOntracService.fetchTotalSpendChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.totalspendAcValue = result;
        this.totalSpend(result);
      },
      (error: any) => {
        console.log('error ', error);

      })

    await this.httpOntracService.fetchDashBoard(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.totSpend004AC = result;
        this.fetchWeightDistribution_Result(result);
      },
      (error: any) => {
        console.log('error ', error);

      })
  }
  async acc_clientid_changeHandler(evt: any) {
    this.clientProfileFormGroup.get('accNo')?.setValue(evt);
    this.openLoading();
    var accountVal = evt;
    this.accountNumber = accountVal;
    if (accountVal == "ALL") {
      this.year_Select = await this.clientProfileFormGroup.get('year')?.value;
      this.month_Select = await this.clientProfileFormGroup.get('month')?.value;
      await this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
      await this.clientProfileFormGroup.get('clientName')?.setValue(this.clientName);
      await this.clientProfileFormGroup.get('year')?.setValue(this.year_Select);
      await this.clientProfileFormGroup.get('invoiceyear')?.setValue(this.year_Select);
      await this.clientProfileFormGroup.get('month')?.setValue(this.month_Select);
      await this.clientProfileFormGroup.get('accountNumber')?.setValue(null);
      await this.httpOntracService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
        (result: any) => {
          this.fetchDataOntrac(result);
        },
        (error: any) => {
          console.log('error ', error);

        })
      await this.fetchdashboardservices()
      await this.fetchallzone();
      await this.fetchServicesPieChart();
      await this.fetchProgressServices();
    }
    else {
      await this.clientProfileFormGroup.get('accountNumber')?.setValue(accountVal);
      await this.clientProfileFormGroup.get('accountNumber')?.setValue(accountVal);
      await this.httpOntracService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
        (result: any) => {
          this.fetchDataOntrac(result);
        },
        (error: any) => {
          console.log('error ', error);

        })
      await this.fetchdashboardservices()
      await this.fetchallzone();
      await this.fetchServicesPieChart();
      await this.fetchProgressServices();
    }

  }
  resultData = signal<any>([]);
  async fetchDataOntrac(result: any) {
    this.resultData.set([]);
    if (result.length > 0) {
      var t004Obj = result[1];
      var t004DashBoardCYObj: any = [];
      var monthflog = await this.clientProfileFormGroup.get('month')?.value;
      t004DashBoardCYObj["netCharge"] = await t004Obj.netCharge;
      t004DashBoardCYObj["costPerPackage"] = await t004Obj.costPerPackage;
      t004DashBoardCYObj["costPerLb"] = await t004Obj.costPerLb;
      t004DashBoardCYObj["enteredWeight"] = await t004Obj.enteredWeight;
      t004DashBoardCYObj["billedWeight"] = await t004Obj.billedWeight;
      t004DashBoardCYObj["netChargeFRT"] = await t004Obj.netChargeFRT;
      t004DashBoardCYObj["costPerLbFRT"] = await t004Obj.costPerLbFRT;
      t004DashBoardCYObj["costPerPackageFRT"] = await t004Obj.costPerPackageFRT;
      t004DashBoardCYObj["packageCount"] = await t004Obj.packageCount;
      t004DashBoardCYObj["averageWeight"] = await t004Obj.averageWeight;

      this.resultData.set(t004DashBoardCYObj);
    }
    else {
      this.openModal("No Record Found");
      this.closeLoading();
      return;
    }
  }

  async fetchServicesPieChart() {
    await this.httpOntracService.fetchServicesPieChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.chargePopupfrtaccAC = result;
        this.pie_chart(result);
      },
      (error: any) => {

      })
  }

  async fetchallzone() {
    await this.httpOntracService.fetchAllZone(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.allzonefrtaccAC = result;
        this.createSeriesFromAC_morezone(result);
      },
      (error: any) => {
      })
  }
  totalPackageCount = signal<any>(0);
  totalPackageCost = signal<any>(0);
  chargetypevalue = signal<any>('');
  dataasof: any;
  dataasoffFormat: any;
  //Total Spend Api for bar charts
  async totalSpend(resultObj: any) {
    var totSpend004AC = [];
    var arrayResult = [];
    this.totalPackageCount.set(0);
    this.totalPackageCost.set(0);
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    //-----------------------Total spend   
    var date = new Date();
    var day = date.getDay();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var monthlastdate: any = this.datePipe.transform(monthStartDay, "MM/dd/yyyy");
    this.dataasof = await this.userProfifle[0].dataasof;
    let dateVal: any = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");
    this.dataasoffFormat = new Date(dateVal);
    var currentYear = (new Date()).getFullYear();
    var currentMonthSlt = this.datePipe.transform(monthStartDay, "MM/yyyy");
    var dataasofSlt = this.datePipe.transform(this.dataasof, "MM/yyyy");
    if (this.dataasof <= monthlastdate) {
      var selectedMonthFlog = true;
    } else {
      selectedMonthFlog = false;
    }


    for (var count = 0; count < resultObj.length; count++) {
      var t004Obj = resultObj[count];
      var testtotSpend004AC = resultObj;
      if (chargetypevalue == null) {
        this.chargetypevalue.set("FRT+ACC");
      }
      if (t004Obj.chargeType == chargetypevalue) {
        var year_Select = this.clientProfileFormGroup.get('year')?.value;
        var totcount = t004Obj.packageCount;
        this.totalPackageCount.update((v: any) => v + (Number(totcount) || 0));
        var totValue = t004Obj.netCharge;
        this.totalPackageCost.update((v: any) => v + (Number(totValue) || 0));
        if (t004Obj.month == "1") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "1",
              "Month": year_Select + "-01"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "01/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "1",
                "Month": year_Select + "-01",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "1",
                "Month": year_Select + "-01",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "2") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "2",
              "Month": year_Select + "-02",
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "02/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "2",
                "Month": year_Select + "-02",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "2",
                "Month": year_Select + "-02",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "3") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "3",
              "Month": year_Select + "-03"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "03/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "3",
                "Month": year_Select + "-03",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "3",
                "Month": year_Select + "-03",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "4") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "4",
              "Month": year_Select + "-04"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "04/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "4",
                "Month": year_Select + "-04",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "4",
                "Month": year_Select + "-04",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "5") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "5",
              "Month": year_Select + "-05"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "05/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "5",
                "Month": year_Select + "-05",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "5",
                "Month": year_Select + "-05",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "6") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "6",
              "Month": year_Select + "-06"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "06/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "6",
                "Month": year_Select + "-06",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "6",
                "Month": year_Select + "-06",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "7") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "7",
              "Month": year_Select + "-07"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "07/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "7",
                "Month": year_Select + "-07",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "7",
                "Month": year_Select + "-07",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "8") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "8",
              "Month": year_Select + "-08"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "08/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "8",
                "Month": year_Select + "-08",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "8",
                "Month": year_Select + "-08",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }

        if (t004Obj.month == "9") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "9",
              "Month": year_Select + "-09"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "09/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "9",
                "Month": year_Select + "-09",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "9",
                "Month": year_Select + "-09",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "10") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "10",
              "Month": year_Select + "-10"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "10/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "10",
                "Month": year_Select + "-10",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "10",
                "Month": year_Select + "-10",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "11") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "11",
              "Month": year_Select + "-11"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "11/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "11",
                "Month": year_Select + "-11",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "11",
                "Month": year_Select + "-11",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "12") {
          if (totcount == "0" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "12",
              "Month": year_Select + "-12"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "12/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "12",
                "Month": year_Select + "-12",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "12",
                "Month": year_Select + "-12",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }

      }

    }
    const result = await totSpend004AC;
    arrayResult.push(result);
    this.totalSpendData(arrayResult);
  }
  t004reymax_by_year_resultAC: any;
  weight_mainAC: any;
  async totalSpendData(resultData: any) {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.colors.step = 2;
    chart.maskBullets = false;
    resultData[0].forEach((item: any) => {
      item.AvgCost = item.Count && Number(item.Count) !== 0
        ? item.NetAmount / item.Count
        : Number(item.NetAmount) !== 0 && Number(item.Count) === 0 ? 0.00 : null;
    });
    // Add data
    chart.data = resultData[0];

    var minNegVal = false;
    var noNetamount = false;
    for (var loop = 0; loop < resultData[0].length; loop++) {

      var netAmtArray = resultData[0];
      var netamt = netAmtArray[loop].NetAmount;
      if (netamt < 0) {
        minNegVal = true;
        break;
      }

    }

    // Create axes
    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.fullWidthTooltip = true;

    var distanceAxis = chart.yAxes.push(new am4charts.ValueAxis());
    distanceAxis.title.text = "Package Count";
    distanceAxis.renderer.grid.template.disabled = true;
    distanceAxis.renderer.opposite = true;
    distanceAxis.min = 0;
    var NetAmountAxis = chart.yAxes.push(new am4charts.ValueAxis());
    if (minNegVal == false) {
      NetAmountAxis.min = 0;
    }
    NetAmountAxis.title.text = "$ Net Charge";
    NetAmountAxis.renderer.grid.template.disabled = true;
    NetAmountAxis.renderer.opposite = false;
    NetAmountAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    var avgCostAxis = chart.yAxes.push(new am4charts.ValueAxis());
    avgCostAxis.title.text = "Avg Cost / Package ($)";
    avgCostAxis.renderer.opposite = true;
    avgCostAxis.renderer.grid.template.disabled = true;
    avgCostAxis.min = 0;
    avgCostAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    // Create series
    var distanceSeries: any = chart.series.push(new am4charts.ColumnSeries());
    distanceSeries.dataFields.valueY = "NetAmount";
    distanceSeries.dataFields.dateX = "Month";
    distanceSeries.yAxis = NetAmountAxis;
    distanceSeries.name = "Net Charge";
    distanceSeries.columns.template.fillOpacity = 0.7;
    distanceSeries.columns.template.propertyFields.strokeDasharray = "dashLength";
    distanceSeries.columns.template.propertyFields.fillOpacity = "alpha";
    distanceSeries.tooltipText = "Month: [bold]{dateX.formatDate('MMMM')}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";

    distanceSeries.tooltip.autoTextColor = false;
    distanceSeries.tooltip.label.fill = am4core.color("#ffffff");


    var disatnceState = distanceSeries.columns.template.states.create("hover");
    disatnceState.properties.fillOpacity = 0.9;

    var NetAmountSeries: any = chart.series.push(new am4charts.LineSeries());
    NetAmountSeries.dataFields.valueY = "Count";
    NetAmountSeries.dataFields.dateX = "Month";
    NetAmountSeries.yAxis = distanceAxis;
    NetAmountSeries.name = "Package Count";
    NetAmountSeries.strokeWidth = 2;
    NetAmountSeries.propertyFields.strokeDasharray = "dashLength";
    NetAmountSeries.tooltipText = "Month: [bold]{dateX.formatDate('MMMM')}[/]  \n  Package Count: [bold]{valueY}[/]";

    NetAmountSeries.tooltip.autoTextColor = false;
    NetAmountSeries.tooltip.label.fill = am4core.color("#ffffff");



    var NetAmountBullet = NetAmountSeries.bullets.push(new am4charts.CircleBullet());
    NetAmountBullet.circle.fill = am4core.color("#fff");
    NetAmountBullet.circle.strokeWidth = 2;
    NetAmountBullet.circle.propertyFields.radius = "townSize";


    var NetAmountBulletVal = NetAmountBullet.states.create("hover");
    NetAmountBulletVal.properties.scale = 1.2;
    var avgCostSeries: any = chart.series.push(new am4charts.LineSeries());
    avgCostSeries.dataFields.valueY = "AvgCost";
    avgCostSeries.dataFields.dateX = "Month";
    avgCostSeries.yAxis = avgCostAxis;
    avgCostSeries.name = "Average Cost per Package";

    // Styling (matches dashboard look)
    avgCostSeries.stroke = am4core.color("#8e44ad");
    avgCostSeries.fill = am4core.color("#8e44ad");
    avgCostSeries.strokeWidth = 2;
    avgCostSeries.propertyFields.strokeDasharray = "dashLength";

    avgCostSeries.tooltipText =
      "Month: [bold]{dateX.formatDate('MMMM')}[/]\nAvg Cost: $ [bold]{valueY.formatNumber('#,##0.00')}[/]";

    avgCostSeries.tooltip.autoTextColor = false;
    avgCostSeries.tooltip.label.fill = am4core.color("#ffffff");

    // Bullets
    var avgCostBullet = avgCostSeries.bullets.push(new am4charts.CircleBullet());
    avgCostBullet.circle.strokeWidth = 2;
    avgCostBullet.circle.stroke = am4core.color("#8e44ad");
    avgCostBullet.circle.fill = am4core.color("#ffffff");
    avgCostBullet.circle.propertyFields.radius = "townSize";

    // Add legend
    chart.legend = new am4charts.Legend();
    dateAxis.cursorTooltipEnabled = false;
    NetAmountAxis.cursorTooltipEnabled = false;
    distanceAxis.cursorTooltipEnabled = false;
    avgCostAxis.cursorTooltipEnabled = false;
    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineY.disabled = true;
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;

    chart.cursor.lineX.fillOpacity = 0.1;
    if (this.themeoption == "dark") {
      chart.cursor.lineX.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
      NetAmountAxis.renderer.labels.template.fill = am4core.color("#fff");
      distanceAxis.renderer.labels.template.fill = am4core.color("#fff");
      dateAxis.renderer.labels.template.fill = am4core.color("#fff");
      distanceAxis.renderer.grid.template.stroke = am4core.color("#fff");
      dateAxis.renderer.grid.template.stroke = am4core.color("#fff");
      distanceAxis.title.fill = am4core.color("#fff");
      NetAmountAxis.title.fill = am4core.color("#fff");
      dateAxis.renderer.grid.template.strokeOpacity = 1;
      NetAmountAxis.renderer.grid.template.strokeOpacity = 1;
      distanceAxis.renderer.grid.template.strokeWidth = 1;
      avgCostAxis.renderer.labels.template.fill = am4core.color("#fff");
      avgCostAxis.title.fill = am4core.color("#fff");
      avgCostAxis.renderer.grid.template.strokeOpacity = 1;
    }
  }

  async fetchWeightDistribution_Result(event: any) {
    this.year_Select = await this.clientProfileFormGroup.get('year')?.value;
    this.t004reymax_by_year_resultAC = await event;
    if (this.t004reymax_by_year_resultAC != undefined && this.t004reymax_by_year_resultAC.length > 0) {
      var typeObject: any = {};
      var tempt004DashBoardObj = {};
      typeObject["ServiceType"] = "year";
      await this.t004reymax_by_year_resultAC.push(typeObject);

      this.weight_mainAC = await this.t004reymax_by_year_resultAC;
      this.weight_Dis(this.t004reymax_by_year_resultAC, "year");
    } else {
      this.t004reymax_by_year_resultAC = [];
      this.weight_Dis(this.t004reymax_by_year_resultAC, "year");
    }
    this.bindingTitle();
  }

  chargeTitle: any;
  yearBindingTitle = signal<any>('');
  monthBindingTitle = signal<any>('');;
  frtaccBindingTitle = signal<any>('');;
  panelClass: any;
  async bindingTitle() {
    this.closeLoading();
    const yearData = this.clientProfileFormGroup.get('year')?.value;
    const monthData = this.clientProfileFormGroup.get('month')?.value;
    const chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.chargeTitle = chargeType;
    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value)
    this.yearBindingTitle.set(yearData);
    if (monthData == null) {
      this.monthBindingTitle.set("");
    } else {
      const monthArray = [
        "All", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      this.monthBindingTitle.set(monthArray[monthData]);
    }
    this.frtaccBindingTitle.set(chargeType === "FRT" ? " ( FRT only )" : "");
    this.panelClass = this.themeoption === "dark"
      ? 'page-dark'
      : 'custom-dialog-panel-class';
  }

  async weight_Dis(arrayAC: any, event_type: String) {
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    await this.weight_chart(arrayAC, chargetypevalue, event_type, "Bar");
  }

  async weight_chart(tempAC: any, chargetypevalue: String, event_type: String, field1: String) {
    await this.createSeriesFromAC(tempAC, chargetypevalue, event_type, "Bar");
  }
  clickedYear: any;
  weight_disTotalvalue = signal<any>('');
  async createSeriesFromAC(collectionAC: any, chargetypevalue: String, event_type: String, seriesName: String) {
    var totalValue = 0;
    this.clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    if (collectionAC.length > 0) {
      if (chargetypevalue == "FRT") {
        var tempObj = collectionAC[0];
      } else if (chargetypevalue == "FRT+ACC" || chargetypevalue == null) {
        tempObj = collectionAC[1];
      }
    }
    var chartData: any = [];
    if (tempObj != undefined) {
      if (tempObj != null) {
        chartData = [
          {
            "weight": "<1",
            "value": tempObj.netChargeLtr
          },
          {
            "weight": "1",
            "value": tempObj.netCharge1Lbs
          },
          {
            "weight": "2",
            "value": tempObj.netCharge2Lbs
          },
          {
            "weight": "3",
            "value": tempObj.netCharge3Lbs
          },
          {
            "weight": "4",
            "value": tempObj.netCharge4Lbs
          },
          {
            "weight": "5",
            "value": tempObj.netCharge5Lbs
          },
          {
            "weight": "6-10",
            "value": tempObj.netCharge6to10Lbs
          },
          {
            "weight": "11-20",
            "value": tempObj.netCharge11to20Lbs
          },
          {
            "weight": "21-30",
            "value": tempObj.netCharge21to30Lbs
          },
          {
            "weight": "31-50",
            "value": tempObj.netCharge31to50Lbs
          },
          {
            "weight": "51-70",
            "value": tempObj.netCharge51to70Lbs
          },
          {
            "weight": "71-150",
            "value": tempObj.netCharge71to150Lbs
          },
          {
            "weight": "150+",
            "value": tempObj.netCharge150PlusLbs
          }
        ]
        totalValue += Number(tempObj.netChargeLtr);
        totalValue += Number(tempObj.netCharge1Lbs);
        totalValue += Number(tempObj.netCharge2Lbs);
        totalValue += Number(tempObj.netCharge3Lbs);
        totalValue += Number(tempObj.netCharge4Lbs);
        totalValue += Number(tempObj.netCharge5Lbs);
        totalValue += Number(tempObj.netCharge6to10Lbs);
        totalValue += Number(tempObj.netCharge11to20Lbs);
        totalValue += Number(tempObj.netCharge21to30Lbs);
        totalValue += Number(tempObj.netCharge31to50Lbs);
        totalValue += Number(tempObj.netCharge51to70Lbs);
        totalValue += Number(tempObj.netCharge71to150Lbs);
        totalValue += Number(tempObj.netCharge150PlusLbs);

      }

    }
    this.weight_disTotalvalue.set(totalValue);
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end
    // Create chart instance
    let chart = am4core.create("weight_dis", am4charts.XYChart);

    // Add data
    chart.data = chartData;

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
    categoryAxis.dataFields.category = "weight";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
    valueAxis.renderer.grid.template.disabled = true;

    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });

    const barColors = [
      '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
      '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
      '#E07877', '#E09776', '#F4C5B0', '#F3B777',
      '#F5C7A0', '#F6D3B8'
    ];
    let series: any = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "weight";
    series.name = "Weight";
    series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
    series.columns.template.fillOpacity = 1;

    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#ffffff");
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    series.columns.template.adapter.add('fill', (_: any, target: any) => {
      return am4core.color(barColors[target.dataItem.index % barColors.length]);
    });

    if (this.themeoption == "dark") {
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
      valueAxis.renderer.grid.template.strokeWidth = 2;
    }
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }


  totalvaluezone = signal<any>(0);
  async createSeriesFromAC_morezone(collection: any) {
    this.totalvaluezone.set(0);
    var totalValue = 0;
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    var zone2 = {}; var zone3 = {}; var zone4 = {}; var zone5 = {}; var zone6 = {}; var zone7 = {}; var zone8 = {};
    if (collection.length > 0) {
      if (chargetypevalue == "FRT")
        var tempObj = collection[0];
      else if (chargetypevalue == undefined || chargetypevalue == "FRT+ACC")
        tempObj = collection[1];
    }
    if (tempObj != undefined) {
      if (tempObj.netChargeZone0 != '0.00' && tempObj.netChargeZone0 != null)
        zone2 = {
          "name": "Zone \n 2",
          "value": tempObj.netChargeZone0,
          "count": tempObj.volumeZone0,
          "category": "Zone",
          "zone": 2
        };

      else
        zone2 = {
          "name": "Zone \n 2",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 2
        };
      if (tempObj.netChargeZone1 != '0.00' && tempObj.netChargeZone1 != null)
        zone3 = {
          "name": "Zone \n 3",
          "value": tempObj.netChargeZone1,
          "count": tempObj.volumeZone1,
          "category": "Zone",
          "zone": 3
        };
      else
        zone3 = {
          "name": "Zone \n 3",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 3
        };

      if (tempObj.netChargeZone2 != '0.00' && tempObj.netChargeZone2 != null)
        zone4 = {
          "name": "Zone \n 4",
          "value": tempObj.netChargeZone2,
          "count": tempObj.volumeZone2,
          "category": "Zone",
          "zone": 4
        };
      else
        zone4 = {
          "name": "Zone \n 4",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 4
        };
      if (tempObj.netChargeZone3 != '0.00' && tempObj.netChargeZone3 != null)
        zone5 = {
          "name": "Zone \n 5",
          "value": tempObj.netChargeZone3,
          "count": tempObj.volumeZone3,
          "category": "Zone",
          "zone": 5
        };
      else
        zone5 = {
          "name": "Zone \n 5",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 5
        };

      if (tempObj.netChargeZone4 != '0.00' && tempObj.netChargeZone4 != null)
        zone6 = {
          "name": "Zone \n 6",
          "value": tempObj.netChargeZone4,
          "count": tempObj.volumeZone4,
          "category": "Zone",
          "zone": 6
        };
      else
        zone6 = {
          "name": "Zone \n 6",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 6
        };

      if (tempObj.netChargeZone5 != '0.00' && tempObj.netChargeZone5 != null)
        zone7 = {
          "name": "Zone \n 7",
          "value": tempObj.netChargeZone5,
          "count": tempObj.volumeZone5,
          "category": "Zone",
          "zone": 7
        };
      else
        zone7 = {
          "name": "Zone \n 7",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 7
        };

      if (tempObj.netChargeZone6 != '0.00' && tempObj.netChargeZone6 != null)
        zone8 = {
          "name": "Zone \n 8",
          "value": tempObj.netChargeZone6,
          "count": tempObj.volumeZone6,
          "category": "Zone",
          "zone": 8
        };
      else
        zone8 = {
          "name": "Zone \n 8",
          "value": 0,
          "count": 0,
          "category": "Zone",
          "zone": 8
        };

      totalValue += Number(tempObj.netChargeZone0);
      totalValue += Number(tempObj.netChargeZone1);
      totalValue += Number(tempObj.netChargeZone2);
      totalValue += Number(tempObj.netChargeZone3);
      totalValue += Number(tempObj.netChargeZone4);
      totalValue += Number(tempObj.netChargeZone5);
      totalValue += Number(tempObj.netChargeZone6);
      this.totalvaluezone.set(totalValue);
    }


    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    // Create chart instance
    let chart: any = am4core.create("container_zone", am4charts.XYChart);
    chart.paddingBottom = 40;
    chart.angle = 35;

    // Add data
    chart.data = [zone2, zone3, zone4, zone5, zone6, zone7, zone8];
    // Create axes

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false; //added by 9126
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false; //added by 9126
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    let series: any = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "name";
    series.name = "Net Amount";
    series.tooltipText = "{category} ({zone}): $ [bold]{valueY.formatNumber('#,###.00')}[/] \n [bold]CLICK TO VIEW MORE";
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.fill = am4core.color("#67B7DC");
    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#ffffff");
    series.columns.template.fillOpacity = 1;
    series.columns.template.events.on(
      "hit",
      (ev: any) => {
        const category = ev.target.dataItem.dataContext;
        this.moreviewZoneData(category);
      },
      this
    );
    let series2: any = chart.series.push(new am4charts.ColumnSeries());
    series2.dataFields.valueY = "count";
    series2.dataFields.categoryX = "name";
    series2.name = "Package Count";
    series2.clustered = true;
    series2.tooltipText = "Package Count: [bold]{valueY}[/]";
    series2.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series2.fill = am4core.color("#769EDF");
    series2.tooltip.autoTextColor = false;
    series2.tooltip.label.fill = am4core.color("#ffffff");
    series2.columns.template.fillOpacity = .8;
    series2.columns.template.events.on(
      "hit",
      (ev: any) => {
        const category = ev.target.dataItem.dataContext;
        this.moreviewZoneData(category);
      },
      this
    );
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");
    if (this.themeoption == "dark") {
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
      valueAxis.renderer.grid.template.strokeWidth = 2;
    }
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }

  highestItem: any;
  pipe_chartData: any = [];
  async pie_chart(tempAC: any) {
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.pipe_chartData = [];
    if (tempAC.length > 0) {
      for (var piecount = 0; piecount < tempAC.length; piecount++) {
        var pie_Obj = tempAC[piecount];
        if (pie_Obj.chargeType == "FRT" || pie_Obj.chargeType == "ACC") {
          var nameFiled = pie_Obj.groupBy;
          var yField = pie_Obj.netCharge;
          var chargeType = pie_Obj.chargeType;

          this.pipe_chartData.push({
            "serviceName": nameFiled,
            "rateVal": yField,
            "chargeType": chargeType
          });
        }
      }
    }
    if (this.pipe_chartData.length > 0) {
      setTimeout(() => {
        this.highestItem = this.pipe_chartData.reduce((max: { rateVal: any; }, item: { rateVal: any; }) =>
          Number(item.rateVal) > Number(max.rateVal) ? item : max
        );
      }, 0);
    }
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    let chart = am4core.create("container_individual", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0;

    chart.legend = new am4charts.Legend();
    chart.legend.disabled = true;
    chart.data = this.pipe_chartData;

    let series: any = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "rateVal";
    series.dataFields.category = "serviceName";
    series.alignLabels = false;
    series.labels.template.disabled = false;
    series.slices.template.strokeWidth = 2;
    series.slices.template.strokeOpacity = 1;
    series.ticks.template.disabled = true;
    series.labels.template.disabled = true;
    // series.labels.template.text = "${value}";    
    series.labels.template.adapter.add('text', function (_: any, target: any) {
      const percent = target.dataItem?.values?.value?.percent;
      return percent !== undefined ? `${Math.round(percent)}` : '';
    });
    series.labels.template.fontSize = 14;
    series.labels.template.fill = am4core.color('#333');
    series.labels.template.radius = am4core.percent(-30);

    series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
    series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.colors.list = [
      am4core.color('#BED5FF'),
      am4core.color('#A0E2FE'),
      am4core.color('#9CEFE5'),
      am4core.color('#D7BBEA'),
      am4core.color('#FFC9C9'),
      am4core.color('#FFD4A9'),
      am4core.color('#ffdb6d'),
      am4core.color('#9ccb66'),
      am4core.color('#796448')
    ];

    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#000");

    series.slices.template.stroke = am4core.color("#ffffff");
    series.slices.template.strokeWidth = 1;
    series.slices.template.strokeOpacity = 1;
    let myEvent = series.slices.template.events.on("hit", function (ev: any) {
      var category: object = ev.target.dataItem.dataContext;
      var categoryName = category;
      //  this.moreviewZoneDistByService(categoryName);
    }, this);
  }
  clientProfileList: any;
  //Get User Profile in init load
  async getuserProfile() {
    this.userProfifle = await this.commonService.getUserprofileData().then(
      (result: any) => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifle;

  }

  fetchaccountDetailsStr: any;
  async fetchaccountDetailsOntrac() {
    console.log('fetchaccountDetailsOntrac');
    await this.httpOntracService.fetchaccountDetails(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.fetchaccountDetailsStr = result;
        this.fetchaccountDetailsStr.forEach((item: any, index: any) => {
          if (item.nickName == null || item.nickName == undefined || item.nickName == '') {
            this.fetchaccountDetailsStr[index].nickName = item.accountNo;
          }
          else {
            this.fetchaccountDetailsStr[index].nickName = item.accountNo + " - <span>" + item.nickName + "</span>";
          }
        });
        const AccNoObj: any = { accountNo: 'ALL', nickName: "ALL" };
        this.fetchaccountDetailsStr.unshift(AccNoObj);
        this.onTracAccountNumber(this.fetchaccountDetailsStr);
      },
      (error: any) => {
      })
  }
  AccountoptionsOntrac: any;
  onTracAccountNumberList: any;
  async onTracAccountNumber(event: any) {
    var accNoObjAC = event;
    this.onTracAccountNumberList = [];
    this.AccountoptionsOntrac = [];
    for (var loop = 0; loop < accNoObjAC.length; loop++) {
      this.onTracAccountNumberList.push(accNoObjAC[loop]);

    }
    for (var loop = 0; loop < this.onTracAccountNumberList.length; loop++) {
      var primaryAccNoObj: any = {};
      primaryAccNoObj['accountNo'] = this.onTracAccountNumberList[loop].accountNo;
      primaryAccNoObj['nickName'] = this.onTracAccountNumberList[loop].nickName;
      this.AccountoptionsOntrac.push(primaryAccNoObj);
    }
    this.ExecMatOntracSelctFunctions();
  }
  public accNoOntracCtrl: FormControl = new FormControl();

  public accNoOntracFilterCtrl: FormControl = new FormControl();


  public filteredAccNoOntrac: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();
  @ViewChild('singleSelect') singleSelect!: MatSelect;
  ExecMatOntracSelctFunctions() {
    this.accNoOntracCtrl.setValue({ accountNo: null });
    this.filteredAccNoOntrac.next(this.AccountoptionsOntrac.slice());

    // listen for search field value changes
    this.accNoOntracFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOntracAccNo();
      });
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  private setInitialValue() {
    this.filteredAccNoOntrac
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) => a.accountNo === b.accountNo;
      });
  }
  private filterOntracAccNo() {
    if (!this.AccountoptionsOntrac) {
      return;
    }
    // get the search keyword
    let search = this.accNoOntracFilterCtrl.value;
    if (!search) {
      this.filteredAccNoOntrac.next(this.AccountoptionsOntrac.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredAccNoOntrac.next(
      this.AccountoptionsOntrac.filter((clientx: any) => clientx.accountNo.toLowerCase().indexOf(search) > -1)
    );
  }

  /** Below method will be called in dashbaord to laod the dropdwon value for teh admin users **/
  loadClientProfile() {
    this.httpOntracService.loadOnTracClientProfile(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {

        this.clientProfileList = result;
        this.closeLoading();
      },
      (error: any) => {
        console.log(' error ', error);
      })
  }
  zoneflag: any;
  linkflag: any;
  acclink_id_buttonMode: any;
  frtlink_id_enabled: any;
  frtacc_btn_selected: any;
  frt_btn_selected: any;
  acclink_id_enabled: any;
  acclink_id_styleName: any;
  frtlink_id_styleName: any;
  frtlink_id_buttonMode: any;
  async linkfrtacc_clickHandler(event: any) {
    this.closeLoading();
    this.chargetypevalue.set(event);
    var chargetypevalue = await event;
    if (chargetypevalue == "FRT+ACC" || chargetypevalue == null)

      this.zoneflag = 0;
    this.linkflag = 0;
    var clickedMonth = await this.clientProfileFormGroup.get('month')?.value;
    chargetypevalue = "FRT+ACC";
    if (clickedMonth == null) {

    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      var monthnumber = Number(clickedMonth);

    }

    this.acclink_id_buttonMode = true;
    this.frtlink_id_enabled = true;
    this.frtacc_btn_selected = true;
    this.frt_btn_selected = false;

    await this.totalSpend(this.totalspendAcValue);
    await this.createSeriesFromAC_morezone(this.allzonefrtaccAC);
    await this.chargeBack_frtacc(this.chargebackfrtacc);

    await this.pie_chart(this.chargePopupfrtaccAC);
    if (clickedMonth == null) {
      await this.weight_Dis(this.weight_mainAC, "year")
    } else {
      await this.weight_Dis(this.weight_mainAC, "month")
    }
  }


  async linkfrt_clickHandler(event: any) {
    this.closeLoading();
    this.chargetypevalue.set(event);
    var chargetypevalue = await event;
    var clickedMonth = await this.clientProfileFormGroup.get('month')?.value;
    if (chargetypevalue == "FRT")

      this.acclink_id_enabled = true;
    this.acclink_id_styleName = "linkButton";
    this.frtlink_id_styleName = "backgroundcolor";
    this.frtlink_id_buttonMode = true;
    this.frtacc_btn_selected = false;
    this.frt_btn_selected = true;
    this.zoneflag = 1;
    this.linkflag = 1;
    chargetypevalue = "FRT";
    if (clickedMonth == 0) {

    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      var monthnumber = Number(clickedMonth);
    }
    await this.totalSpend(this.totalspendAcValue);
    await this.createSeriesFromAC_morezone(this.allzonefrtaccAC);
    await this.chargeBack_frtacc(this.chargebackfrtacc);
    if (clickedMonth == null) {
      await this.weight_Dis(this.weight_mainAC, "year")
    } else {
      await this.weight_Dis(this.weight_mainAC, "month")
    }
  }
  async chargeBack_frtacc(chargebackfrtacc: any) {
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var chargeBack_result = chargebackfrtacc;
    var chargBacklength = chargeBack_result.length;
    if (chargBacklength != 0) {
      this.ground = 0.00;
      this.miscellaneous = 0.00;
      this.onCallPickup = 0.00;
      this.serviceFee = 0.00;
      this.sunrise = 0.00;
      this.sunriseGold = 0.00;
      this.heavyweight = 0.00;
      this.sameDayAnytime = 0.00;
      this.declaredValue = 0.00;
      this.extendedAreaFee = 0.00;
      this.fuelSurcharge = 0.00;
      this.wrongAddressFee = 0.00;
      this.resetCharbackUI();

      this.GprogressBar = 0.00;
      this.SerFeeprogressBar = 0.00;
      this.SunriseprogressBar = 0.00;
      this.OnCallprogressBar = 0.00;
      this.SunriseGoldprogressBar = 0.00;
      this.heavyweightprogressBar = 0.00;
      this.sameDayAnytimeprogressBar = 0.00;
      this.MisprogressBar = 0.00;
      this.progressBarOntracList = [];
      this.progressBarOntracList.push({ serviceType: 'Ground (C)', progressBar: this.GprogressBar, netCharge: this.ground, serviceName: 'Ground (C)' });
      this.progressBarOntracList.push({ serviceType: 'Service Fee (B)', progressBar: this.SerFeeprogressBar, netCharge: this.serviceFee, serviceName: 'Service Fee (B)' });
      this.progressBarOntracList.push({ serviceType: 'Sunrise (S)', progressBar: this.SunriseprogressBar, netCharge: this.sunrise, serviceName: 'Sunrise (S)' });
      this.progressBarOntracList.push({ serviceType: 'On Call Pickup (O)', progressBar: this.OnCallprogressBar, netCharge: this.onCallPickup, serviceName: 'On Call Pickup (O)' });
      this.progressBarOntracList.push({ serviceType: 'Sunrise Gold (G)', progressBar: this.SunriseGoldprogressBar, netCharge: this.sunriseGold, serviceName: 'Sunrise Gold (G)' });
      this.progressBarOntracList.push({ serviceType: 'Heavyweight / Palletized (H)', progressBar: this.heavyweightprogressBar, netCharge: this.heavyweight, serviceName: 'Heavyweight / Palletized (H)' });
      this.progressBarOntracList.push({ serviceType: 'Same Day Anytime (DC)', progressBar: this.sameDayAnytimeprogressBar, netCharge: this.sameDayAnytime, serviceName: 'Same Day Anytime (DC)' });
      this.progressBarOntracList.push({ serviceType: 'Miscellaneous (Z)', progressBar: this.MisprogressBar, netCharge: this.miscellaneous, serviceName: 'Miscellaneous (Z)' });
      this.domesticGroundService.set(this.progressBarOntracList);
    }

    this.chargeDesList = [];
    this.maxValue = 0;


    if (chargeBack_result == null)
      return;

    if (chargeBack_result.length > 0) {
      this.progressBarOntracList = [];
      this.chargeBack_result.forEach((item: any) => {
        if (item.chargeType == 'ACC') {
          let amount = Number(item.netCharge);
          amount = Number.isNaN(amount) ? 0 : amount;

          this.progressBarOntracList.push({
            serviceType: item.groupBy,
            serviceName: item.groupBy,
            netCharge: amount,
            progressBar: 0
          });
        }
      });

      this.progressBarOntracList = this.progressBarOntracList
        .sort((a: any, b: any) => b.netCharge - a.netCharge)
        .slice(0, 10);

      const maxCharge = Math.max(
        ...this.progressBarOntracList.map((x: any) => x.netCharge)
      );

      this.maxValue = maxCharge + (maxCharge / 10);

      for (let item of this.progressBarOntracList) {
        item.progressBar = await this.calcPercent(item.netCharge, this.maxValue);
      }
      this.domesticGroundService.set(this.progressBarOntracList);
    }
  }
  previousClickedYear: any;
  previousClickedMonth: any;
  clickedMonth: any;
  dashBoardLable: any;
  transportationLable: any;
  //Selected Year 
  async yearSelect(yeardata: any) {
    this.openLoading();
    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
    this.linkflag = 0;
    this.zoneflag = 0;
    this.month_Select = null;
    this.previousClickedYear = this.clickedYear;
    this.previousClickedMonth = this.clickedMonth;
    var monthValue = "Y";
    this.clickedMonth = 0;
    this.clickedYear = yeardata;
    this.currentyear = Number(this.clickedYear);
    this.dashBoardLable = String(this.currentyear);
    this.transportationLable = String(this.currentyear);
    var selectedIndex = 0;
    await this.clientProfileFormGroup.get('year')?.setValue(yeardata);
    await this.clientProfileFormGroup.get('month')?.setValue(null);
    //  this.initDashBoard();
    await this.httpOntracService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.fetchDataOntrac(result);
      },
      (error: any) => {
        console.log('error ', error);

      })
    await this.fetchdashboardservices()
    await this.fetchallzone();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();

  }
  //Selected Month
  async monthSelect(monthdata: any) {

    this.openLoading();
    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
    this.linkflag = 0;
    this.zoneflag = 0;
    this.month_Select = monthdata;
    this.previousClickedYear = await this.clientProfileFormGroup.get('year')?.value;
    this.previousClickedMonth = monthdata;
    this.currentyear = await this.clientProfileFormGroup.get('year')?.value;
    var monthValue = "Y";
    this.clickedMonth = 0;
    monthValue = "N";
    var currentyear = this.currentyear;
    var clickedYear = currentyear + "";
    var monthnumber = Number(this.clickedMonth);

    if (monthdata == "null") {
      monthdata = null
    }
    await this.clientProfileFormGroup.get('month')?.setValue(monthdata);
    await this.clientProfileFormGroup.get('year')?.setValue(this.currentyear);
    await this.httpOntracService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.fetchDataOntrac(result);
      },
      (error: any) => {
        console.log('error ', error);

      })
    await this.fetchdashboardservices()
    await this.fetchallzone();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();
    this.bindingTitle();
  }
  async moreviewWeightDist() {
    this.sendValue = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var weight_mainAC = await this.weight_mainAC;
    var accountNumber = this.accountNumber;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var moreviewObj = {
      month: invoiceMonth,
      year: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      weight_mainAC: weight_mainAC,
      chargetypevalue: chargetypevalue,
      accountNumber: accountNumber,
      themeoption: this.themeoption
    }
    this.sendValue = moreviewObj;
    this.openDialog();

  }

  openDialog() {
    const dialogRef = this.dialog.open(OntracWeightDistPopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.sendValue }
    });

    dialogRef.afterClosed()?.subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }
  async moreviewZoneData(event: any) {
    var eventName = event.name;
    var eventValue = event.value;
    var eventCategory = event.category;
    var eventName = eventName.replace(/(\r\n|\n|\r)/gm, "");
    this.sendValue = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var clickEvent = eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var accountNumber = await this.clientProfileFormGroup.get('accountNumber')?.value;

    var moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      accountNumber: accountNumber,
      chargeDescription: clickEvent,
      chargetypevalue: chargetypevalue,
      eventCategory: eventCategory,
      themeoption: this.themeoption
    }
    this.sendValue = moreviewObj;
    if (eventValue != "0") {
      this.openZoneDialog();
    }
  }
  openZoneDialog() {
    const dialogRef = this.dialog.open(OntracZonePopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.sendValue }
    });

    dialogRef.afterClosed()?.subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }
  async moreviewZoneDistByService(event: any) {
    var eventName = event.serviceName;
    var eventValue = event.rateVal;
    var chargeType = event.chargeType;

    this.sendValue = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var clickEvent = eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      chargeDescription: clickEvent,
      chargetypevalue: chargetypevalue,
      chargeType: chargeType,
      themeoption: this.themeoption
    }
    this.sendValue = moreviewObj;
    if (eventValue != "0") {
      this.openZoneDistByServicePopupComponent();
    }
  }
  openZoneDistByServicePopupComponent() {
    // const dialogRef = this.dialog.open(ZoneDistByServiceChartPopupComponent, {
    //   width: '100%',
    //   height: '100%',
    //   backdropClass: 'custom-dialog-backdrop-class',
    //   panelClass: this.panelClass,
    //   data: { popupValue: this.sendValue }
    // });

    // dialogRef.afterClosed()?.subscribe((result:any) => {
    //   this.dialogValue = result.data;
    // });
  }

  async progressBar_clickHandler(event: any, eventObj:any) {
    if (eventObj.netCharge == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }

    if (this.MisprogressBar == 0 && event == "Miscellaneous (Z)") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.OnCallprogressBar == 0 && event == "OnCallPickup (O)") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.GprogressBar == 0 && event == "Ground (C)") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.SerFeeprogressBar == 0 && event == "ServiceFee (B)") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.SunriseprogressBar == 0 && event == "Sunrise (S)") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.SunriseGoldprogressBar == 0 && event == "Sunrise Gold (G)") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.heavyweightprogressBar == 0 && event == "Heavyweight/Palletized (H)") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.sameDayAnytimeprogressBar == 0 && event == "Same Day Anytime (DC)") {
      this.openModal("Data Too Small to Display");
      return;
    }

    var eventName = event;
    this.progressBar = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = this.clientName;
    var accountNumber = this.accountNumber;
    var groupby = await eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var clientProfileFormGroup = this.clientProfileFormGroup.value;
    var moreviewObj = {
      month: invoiceMonth,
      year: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      groupBy: groupby,
      chargetypevalue: chargetypevalue,
      clientProfile: clientProfileFormGroup,
      accountNumber: accountNumber,
      themeoption: this.themeoption
    }
    this.progressBar = moreviewObj;
    this.progressBarPopupComponent();
  }
  async progressBarPopupComponent() {

    const dialogRef = this.dialog.open(OntracChargeDescPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.progressBar,
        dataasof: this.dataasof
      }
    });

    dialogRef.afterClosed()?.subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }
  moreService: any;
  async moreService_clickHandler() {
    var eventName = event;
    this.progressBar = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var accountNumber = await this.clientProfileFormGroup.get('accountNumber')?.value;
    var groupby = await eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      accountNumber: accountNumber,
      themeoption: this.themeoption
    }
    this.moreService = moreviewObj;
    this.moreServicePopupComponent();
  }
  async moreServicePopupComponent() {
    const dialogRef = this.dialog.open(OntracMoreServicePopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.moreService }
    });
    dialogRef.afterClosed()?.subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }

  compareTwoDates() {
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateT = this.searchForm.get('todate')?.value;
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    if (dateFromYear != dateToYear) {
      this.openModal("Time Frame Should be Same");
    }
  }

  dateRange: any;
  clientName: any;
  basis_Value: any;
  searchUserobjUPS: any;
  searchUserobjUPSArray: any = [];
  async searchUser() {
    var dateFr = this.searchForm.get('fromdate')?.value;
    var dateT = this.searchForm.get('todate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    this.datePipe.transform(dateT, "yyyy-MM-dd");
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    this.clientID = this.clientProfileFormGroup.get('clientId')?.value;
    var clientname = this.clientProfileFormGroup.get('clientName')?.value;
    this.clientName = clientname.replace(/\s/g, "");
    this.searchUserobjUPS = {
      clientId: this.clientID,
      clientName: this.clientName,
      fromDate: dateFrom,
      toDate: dateTo,
      basisValue: this.clientType,
      searchDetail: this.searchForm.get('searchDetail')?.value,
      searchSource: this.searchForm.get('chargeSource')?.value,

    };

    if (this.searchUserobjUPS.searchSource == "TrackingNumber") {
      this.searchUserobjUPSArray = [];
      if (this.searchForm.get('searchDetail')?.value != "") {
        var dateFrYear = dateFr.getFullYear();
        var dateTYear = dateT.getFullYear();
        var yearDiff = dateTYear - dateFrYear;
        if (yearDiff > 1) {
          this.openModal("Time Frame Greater than 2 years");
          return;
        }
        localStorage.setItem('payload_ontrac', JSON.stringify(this.searchUserobjUPS));
        // this.searchUserobjUPSArray.push(this.searchUserobjUPS);
        // this.switchProj.CommonSub.next(this.searchUserobjUPSArray);
        this.router.navigate(['ontrac/tracking']);
      }
      else {
        this.openModal("Please Enter Tracking number");
      }
    }
    else {
      if (this.searchForm.get('searchDetail')?.value != "") {
        var dateFrYear = dateFr.getFullYear();
        var dateTYear = dateT.getFullYear();
        var yearDiff = dateTYear - dateFrYear;
        if (yearDiff > 1) {
          this.openModal("Time Frame Greater than 2 years");
          return;
        }
        localStorage.setItem('payload_ontrac', JSON.stringify(this.searchUserobjUPS));
        // this.searchUserobjUPSArray = [];
        // this.searchUserobjUPSArray.push(this.searchUserobjUPS);

        // this.switchProj.CommonSub.next(this.searchUserobjUPSArray);
        this.router.navigate(['ontrac/tracking']);
      }
      else {
        this.openModal("Please Enter a value");

      }
    }

  }




  loginId: any;
  async common_clickHandler(designFileName: any) {
    if (this.addressCorrection == 0 && designFileName == "ADDRESS_CORRECTION_DASH") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.declaredValue == 0 && designFileName == "DECLARED_VALUE_DASH") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.chargeBack == 0 && designFileName == "CHARGEBACK_LISTING_DASH") {
      this.openModal("Data Too Small to Display");
      return;
    }
    if (this.clickedMonth == null && designFileName == 'ADDRESS_CORRECTION_DASH') {
      this.openModal("Please Select Month");
      return;
    }
    var t004masterObj: any = {};

    var t007_reportlogobj: any = {};
    if (this.clickedMonth == null) {
      t007_reportlogobj['fromdate'] = this.clickedYear + "-01" + "-01";
      t007_reportlogobj['todate'] = this.clickedYear + "-12" + "-31";
      t007_reportlogobj['fromDate'] = this.clickedYear + "-01" + "-01";
      t007_reportlogobj['toDate'] = this.clickedYear + "-12" + "-31";
    }
    else {
      var date: Date = new Date(this.clickedYear, this.clickedMonth, 0);
      var lastDay: Number = date.getDate();
      t007_reportlogobj['fromdate'] = this.clickedYear + "-01" + "-01";
      t007_reportlogobj['todate'] = this.clickedYear + "-" + this.clickedMonth + "-" + lastDay;
      t007_reportlogobj['fromDate'] = this.clickedYear + "-01" + "-01";
      t007_reportlogobj['toDate'] = this.clickedYear + "-" + this.clickedMonth + "-" + lastDay;
    }
    t007_reportlogobj['t001ClientProfile'] = this.userProfifle[0];
    t007_reportlogobj['reportType'] = designFileName;
    t007_reportlogobj['reportName'] = designFileName;
    t007_reportlogobj['designFileName'] = designFileName;
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['moduleName'] = "sccreport";
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['reportFormat'] = "CSV";

  }
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
  });
  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
  }
  moreSearch() {
    this.router.navigate(['/shipmentdetailsearch']);
  }
  async clickTotalspend(event: any) {
    var urlParam: any = {};
    var urlObj: any = {};
    var date = new Date();
    var dateValue = this.datePipe.transform(date, "yyyy-MM-dd");
    var monthVal = await this.clientProfileFormGroup.get('month')?.value
    var month = monthVal;
    urlParam['fromdate'] = dateValue;
    urlParam['todate'] = dateValue;
    urlParam['action'] = event;
    urlParam['year'] = await this.clientProfileFormGroup.get('year')?.value;
    urlParam['chargemonth'] = month;
    urlParam['clientId'] = await this.clientProfileFormGroup.get('clientId')?.value;
    urlParam['clientName'] = await this.clientProfileFormGroup.get('clientName')?.value;
    urlParam['chargetyperesult'] = await this.dashBoardSHP.get('chargetypevalue')?.value;
    urlParam['accountnumber'] = await this.clientProfileFormGroup.get('accountNumber')?.value;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }

    this.httpOntracService.reportServlet(fields_string);
  }

  async report_clickHandler(event: any) {

    var urlParam: any = {};
    var monthVal = await this.clientProfileFormGroup.get('month')?.value;
    var clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    var date = new Date();
    var currentYear = new Date().getFullYear();
    if (monthVal == null) {
      var month = 0;
    } else {
      month = monthVal;
    }
    if (month == 0) {
      urlParam['fromdate'] = clickedYear + "-01" + "-01";
      urlParam['todate'] = clickedYear + "-12" + "-31";
    }
    else {
      var date = new Date(clickedYear, month, 0);
      var lastDay = date.getDate();
      urlParam['fromdate'] = this.datePipe.transform(clickedYear + "-" + month + "-01", "yyyy-MM-dd");
      urlParam['month'] = month.toString();
      urlParam['todate'] = this.datePipe.transform(clickedYear + "-" + month + "-" + lastDay, "yyyy-MM-dd");
    }

    urlParam['action'] = event;
    urlParam['reportname'] = event;
    urlParam['year'] = clickedYear;
    urlParam['chargemonth'] = monthVal;
    urlParam['month'] = monthVal;
    urlParam['clientId'] = await this.clientProfileFormGroup.get('clientId')?.value;
    urlParam['clientName'] = await this.clientProfileFormGroup.get('clientName')?.value;
    urlParam['accountnumber'] = await this.clientProfileFormGroup.get('accountNumber')?.value;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }
    this.httpOntracService.reportServlet(fields_string);
  }
  openModalConfig: any;
  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

}
interface gridData {
  grossCharge: string;
  netCharge: string;
  costperPackage: string;
  costperlb: string;
  enteredWeight: string;
  billedWeight: string;
  scc: string;
  weightdifference: string;
  grosschargeFRT: string;
  netchargeFRT: string;
  costperlbFRT: string;
  costperpackageFRT: string;
  totalSpentCount: any;
  averageWeight: any;
}
