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
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-usps-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class USPSDashboardComponent implements OnInit {
  clientType: any;

  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') })
  });
  filteredOptions!: Observable<any[]>;
  loginId: any = 123;
  private chart!: am4charts.XYChart;
  clientProfileFormGroup!: FormGroup;
  dashBoardSHP!: FormGroup;
  moreviewWeightDistFormGroup!: FormGroup;
  clientProfileList: any;
  dashBoardFrtAccObj: any;
  dashBoardFrtObj: any;
  names: any;
  clientID: any;
  accountNumber: any;
  resultObj: any;
  totSpend004AC: any;
  moreService: any;
  totalPackageCount = signal<any>(0);
  totalPackageCost = signal<any>(0);
  chargetypevalue: any;
  t004Obj: any;
  parameter: any;
  userProfifle: any;
  year_Select: any;
  month_Select: any;
  panelClass: any;
  linkflag: any;
  t004reymax_by_year_resultAC: any;
  billedweight_lbl_text: any;
  resultData = signal<any>([]);
  cust_id_visible: any;
  cust_id_includeInLayout: any;
  cust_name_visible: any;
  cust_name_includeInLayout: any;
  zoneflag = 0;
  selectYear: any[] = [];
  dimension: any;
  dim_id_text: any;
  flag = 0;
  themeoption: any;
  chargeDesList: any;
  t004reymax_resultAC = [];
  Panel2_Object = [];
  tempPanel2_Object_YTD: any;
  tempPanel2_Object_YTD_Billed: any;
  Column_EnteredAC: any = [];
  weight_mainAC: any = [];
  weight_labid_text: any;
  scclab_id_text: any;
  weight_enteryear_yField: any;
  weight_enter_yField: any;
  dimensionyear_id_yField: any;
  dimesion_id_yField: any;
  netchargeyearYTD_yField: any;
  netchargeyear_yField: any;
  costpackageyearYTD_yField: any;
  costpackageyear_yField: any;
  chargeTitle: any;
  yearGrosschargecurrent: any;
  yearNetchargecurrent: any;
  yearCostperPackagecurrent: any;
  yearcostperlbcurrent: any;
  yearEnteredWeightcurrent: any;
  yearbilledWeightcurrent: any;
  yearScccurrent: any;
  yearWeightdifferencecurrent: any;
  yearGrosschargeFRTcurrent: any;
  yearNetchargeFRTcurrent: any;
  yearCostperpackageFRTcurrent: any
  totalspendAcValue: any;
  searchUserobj: any;
  tempnetchargeYTD: any;
  tempyearNetchargeFRT: any;
  tempyearcostperpackageYTD: any;
  tempyearcostperpackageFRT: any;
  tempyearcostperlbYTD: any;
  tempyearcostperlbFRT: any;
  tempyearbilledweightYTD: any;
  tempyearenteredWeightYTD: any;
  tempyearsccYTD: any;
  tempyearweightdiffYTD: any;
  dimyear_id_text: any;
  clickedYear: any;
  previousClickedYear: any;
  previousClickedMonth: Number = 0;
  clickedMonth: any = 0;
  dashBoardLable: any = null;
  dashBoardFRTACCLable: any = null;
  transportationLable: any = null;
  weightyear: any;
  weightbox: any;
  dimensionyear: any;
  netcharge_year: any;
  netcharge: any;
  costperpackage_year: any;
  costperpackage: any;
  weight_disTotalvalue: any;
  weight_disTotalvalueKgs: any;
  acclink_id_buttonMode = true;
  frtlink_id_enabled = true;
  frtacc_btn_selected = true;
  frt_btn_selected = false;
  yearBindingTitle = signal<any>('');
  monthBindingTitle = signal<any>('');
  frtaccBindingTitle: any;
  expressNondoc12: any;
  expressNondoc10: any;
  expressNondoc09: any;
  expressBreakBulk: any;
  expressDomestic: any;
  expressEnvelope: any;
  expressWorldwide: any;
  importExportDuties: any;
  extendedAreaFee: any;
  fuelSurcharge: any;
  wrongAddressFee: any;
  addresscorrection: any;
  sameDay: any;
  searchForm!: FormGroup;
  acclink_id_enabled: any;
  acclink_id_styleName: any;
  frtlink_id_styleName: any;
  frtlink_id_buttonMode: any;
  totalvaluezone = 0;
  t004rymaxObj_chargeback: any;
  expressNondoc12ProgressBar_visible: any;
  expressNondoc12ProgressBar_includeInLayout: any;
  expressNondoc12ProgressBar_label_visible: any;
  expressNondoc12ProgressBar_label_includeInLayout: any;
  expressNondoc10ProgressBar_visible: any;
  expressNondoc10ProgressBar_includeInLayout: any;
  expressNondoc10ProgressBar_label_visible: any;
  expressNondoc10ProgressBar_label_includeInLayout: any;
  expressNondoc09ProgressBar_visible: any;
  expressNondoc09ProgressBar_includeInLayout: any;
  expressNondoc09ProgressBar_label_visible: any;
  expressNondoc09ProgressBar_label_includeInLayout: any;
  expressBreakBulkProgressBar_visible: any;
  expressBreakBulkProgressBar_includeInLayout: any;
  expressBreakBulkProgressBar_label_visible: any;
  expressBreakBulkProgressBar_label_includeInLayout: any;
  expressDomesticProgressBar_visible: any;
  expressDomesticProgressBar_includeInLayout: any;
  expressDomesticProgressBar_label_visible: any;
  expressDomesticProgressBar_label_includeInLayout: any;
  expressEnvelopeProgressBar_visible: any;
  expressEnvelopeProgressBar_includeInLayout: any;
  expressEnvelopeProgressBar_label_visible: any;
  expressEnvelopeProgressBar_label_includeInLayout: any;
  expressWorldwideprogressBar_visible: any;
  expressWorldwideprogressBar_includeInLayout: any;
  expressWorldwideprogressBar_label_visible: any;
  expressWorldwideprogressBar_label_includeInLayout: any;
  addresscorrectionprogressBar_visible: any;
  addresscorrectionprogressBar_includeInLayout: any;
  addresscorrectionprogressBar_label_visible: any;
  addresscorrectionprogressBar_label_includeInLayout: any;
  sameDayProgressBar_visible: any;
  sameDayProgressBar_includeInLayout: any;
  sameDayProgressBar_label_visible: any;
  sameDayProgressBar_label_includeInLayout: any;
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
  importExportDuties_visible: any;
  importExportDuties_includeInLayout: any;
  importExportDuties_label_visible: any;
  importExportDuties_label_includeInLayout: any;
  chargeBack_visible: any;
  chargeBack_includeInLayout: any;
  chargeBack_label_visible: any;
  chargeBack_label_includeInLayout: any;
  maxValue: any;
  testtotSpend004AC = [];
  allzonefrtaccAC = [];
  chargePopupfrtaccAC = [];
  projectName: any;
  menuBgDefault: any;
  expressNondoc12ProgressBar: any;
  expressNondoc10ProgressBar: any;
  expressNondoc09ProgressBar: any;
  expressBreakBulkProgressBar: any;
  expressDomesticProgressBar: any;
  expressEnvelopeProgressBar: any;
  expressWorldwideEuProgressBar: any;
  expressWorldwideNondocProgressBar: any;
  expressWorldwideprogressBar: any;
  addresscorrectionprogressBar: any;
  sameDayProgressBar: any;
  fuelprogressBar: any;
  surepost_id: any;
  sccprogressBar: any;
  addressCorrection: any;
  importExportDutiesprogressBar: any;
  chargeBack: any;
  sendValue = {};
  dialogValue: any;
  progressBar = {};
  fromDate: any = new Date;
  toDate: any = new Date;
  tempDate: any = [];
  dates: any = [];
  themeOption: any;
  SearchType = 'TrackingNumber';
  currentDate: any;
  randomNumber: any;
  selectedOption: any;
  showColumnPicker = false;
  showColumnPickerclass = false;
  constructor(public toastService: ToastService, private commonService: CommonService,
    private httpUSPSService: HttpUSPSService, private loaderService: LoaderService,
    private dialog: MatDialog, private datePipe: DatePipe, private router: Router,
    private cookiesService: CookiesService, private switchProj: SwitchProjectService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
    });
    this.initForm();
  }
  toggleColumnPickerClass() {
    this.showColumnPickerclass = !this.showColumnPicker;
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
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
    });
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
      clientName: new FormControl('Lens Direct'),
      clientId: new FormControl(1),
      accountNumber: new FormControl('ALL'),
      year: new FormControl(''),
      month: new FormControl(null),
      invoiceMonth: new FormControl("1"),
      invoicemonth: new FormControl("1"),
      invoiceyear: new FormControl(""),
      groupby: new FormControl(""),
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
  async initializeDefaults() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.selectedOption = 'ALL';
    var date = new Date();
    var monthStartDay: any = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var monthEndDay: any = new Date(date.getFullYear(), date.getMonth(), 0);
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
    await this.initDashBoard();
    this.yearBindingTitle.set(this.clientProfileFormGroup.get('year')?.value);
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

  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }
  Accountoptions: any;
  private _filter(value: any): any[] {
    const filterValue = value;
    return this.Accountoptions.filter((option: any) => option.includes(filterValue));
  }
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
  openLoading() {
    this.loaderService.show();
  }

  async fetchProgressServices() {
  }
  chargeBack_result = [];
  chargebackfrtacc: any;

  async calcPercent(dataValue: any, maxValue: any) {
    var obtained = dataValue;
    var total = maxValue;
    var percent = obtained * 100 / total;
    if (Number.isNaN(percent)) {
      return 0;
    }
    return await percent;
  }
  isOpenModalOpened: any;
  async initDashBoard() {
    this.userProfifle = await this.getuserProfile();
    this.clientID = await this.userProfifle[0].clientId;
    this.clientName = await this.userProfifle[0].clientName;
    var clientName = await this.userProfifle[0].clientName;
    await this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
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
    await this.httpUSPSService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
      async (result: any) => {
        await this.fetchDataUSPS(result);
      }, (error: any) => {
        console.log('error ', error);
      })
    await this.fetchdashboardservices()
    await this.fetchProgressServices();
  }

  async fetchdashboardservices() {

    await this.httpUSPSService.fetchTotalSpendChart(this.clientProfileFormGroup.value)?.subscribe(
      async (result: any) => {
        this.totalspendAcValue = result;
        await this.totalSpend(result);
      }, (error: any) => {
        console.log('error ', error);

      })

    await this.httpUSPSService.fetchGroupedServicesChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.totSpend004AC = result;
        this.formGroupedServiceChart(result);
      }, (error: any) => {
        console.log('error ', error);

      })
  }

  async fetchDataUSPS(result: any) {
    this.resultData.set([]);
    if (result.length > 0) {
      var t004Obj = result[0];
      var t004DashBoardCYObj: any = [];
      var monthflog = await this.clientProfileFormGroup.get('month')?.value;
      t004DashBoardCYObj["netCharge"] = await t004Obj.netCharge;
      t004DashBoardCYObj["packageCount"] = await t004Obj.packageCount;
      t004DashBoardCYObj["costPerPackage"] = await t004Obj.costPerPackage;
      t004DashBoardCYObj["totalWeightLbs"] = await t004Obj.billedWeight;
      t004DashBoardCYObj["totalWeightOz"] = await t004Obj.totalWeightOz;
      t004DashBoardCYObj["costPerLb"] = await t004Obj.costPerLb;
      t004DashBoardCYObj["averageWeight"] = await t004Obj.averageWeight;
      t004DashBoardCYObj["averageWeightOz"] = await t004Obj.averageWeightOz;
      this.resultData.set(t004DashBoardCYObj);
    }
    else {
      this.openModal("No Record Found");
      this.closeLoading();
      return;
    }
  }
  closeLoading() {
    this.loaderService.hide();
  }
  dataasof: any;
  dataasoffFormat: any;
  async totalSpend(resultObj: any) {
    var totSpend004AC = [];
    var arrayResult = [];
    this.totalPackageCount.set(0);
    this.totalPackageCost.set(0);
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
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
        this.chargetypevalue = "FRT+ACC";
      }
      if (t004Obj.chargeType == chargetypevalue) {
        var year_Select = this.clientProfileFormGroup.get('year')?.value;
        var totcount = t004Obj.packageCount;
        this.totalPackageCount.update((v: any) => v + (Number(totcount) || 0));
        var totValue = t004Obj.netCharge;
        this.totalPackageCost.update((v: any) => v + (Number(totValue) || 0));
        if (t004Obj.month == "1") {
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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
          if ((totcount == "0.00" || totcount == "0") && totValue == "0.00") {
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

  async totalSpendData(resultData: any) {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.colors.step = 2;
    chart.maskBullets = false;
    resultData[0].forEach((item: any) => {
      item.AvgCost = item.Count && Number(item.Count) !== 0
        ? item.NetAmount / item.Count
        : Number(item.NetAmount) !== 0 && Number(item.Count) === 0 ? 0.00 : null;
    });
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
    NetAmountSeries.tooltipText = "Month: [bold]{dateX.formatDate('MMMM')}[/]  \n Package Count: [bold]{valueY}[/]";
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
    avgCostSeries.stroke = am4core.color("#8e44ad");
    avgCostSeries.fill = am4core.color("#8e44ad");
    avgCostSeries.strokeWidth = 2;
    avgCostSeries.propertyFields.strokeDasharray = "dashLength";
    avgCostSeries.tooltipText =
      "Month: [bold]{dateX.formatDate('MMMM')}[/]\nAvg Cost: $ [bold]{valueY.formatNumber('#,##0.00')}[/]";
    avgCostSeries.tooltip.autoTextColor = false;
    avgCostSeries.tooltip.label.fill = am4core.color("#ffffff");
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
    //Add cursor
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

  async formGroupedServiceChart(data: any) {
    data.sort((a: any, b: any) => b.netCharge - a.netCharge);
    var expensesMax = 0;
    var packageCount = 0;
    for (let loop = 0; loop < data.length; loop++) {
      if (expensesMax < Number(data[loop].netCharge.replace(/\,/g, ""))) {
        expensesMax = Number(data[loop].netCharge.replace(/\,/g, ""));
      }
    }
    for (let loop = 0; loop < data.length; loop++) {
      if (packageCount < Number(data[loop].packageCount.replace(/\,/g, ""))) {
        packageCount = Number(data[loop].packageCount.replace(/\,/g, ""));
      }
    }
    am4core.useTheme(am4themes_animated);
    let chart = am4core.create('class_service', am4charts.XYChart)
    chart.colors.step = 2;
    chart.legend = new am4charts.Legend()
    chart.legend.position = 'bottom'
    chart.legend.paddingTop = 20
    chart.legend.labels.template.maxWidth = 95;
    let serviceAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    serviceAxis.dataFields.category = 'groupBy'
    serviceAxis.renderer.cellStartLocation = 0.1
    serviceAxis.renderer.cellEndLocation = 0.9
    serviceAxis.renderer.grid.template.location = 0;
    serviceAxis.renderer.grid.template.strokeWidth = 0;
    serviceAxis.renderer.labels.template.wrap = true;
    serviceAxis.renderer.labels.template.maxWidth = 120;
    serviceAxis.renderer.labels.template.textAlign = 'middle';
    serviceAxis.renderer.minGridDistance = 20;
    let netChargeAxis = chart.yAxes.push(new am4charts.ValueAxis());
    netChargeAxis.min = 0;
    netChargeAxis.title.text = "$ Net Charge";
    netChargeAxis.renderer.grid.template.strokeWidth = 0;
    netChargeAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    var packageCountAxis = chart.yAxes.push(new am4charts.ValueAxis());
    packageCountAxis.title.text = "Package Count";
    packageCountAxis.renderer.grid.template.disabled = true;
    packageCountAxis.renderer.opposite = true;
    packageCountAxis.min = 0;
    // packageCountAxis.max = packageCount + (packageCount * 0.10);
    packageCountAxis.renderer.grid.template.strokeWidth = 0;


    function createSeriesNetCharge(value: any, name: any) {
      let series: any = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value;
      series.dataFields.categoryX = 'groupBy';
      series.name = name;
      series.fill = am4core.color("#67B7DC");
      series.yAxis = netChargeAxis;
      series.tooltipText = "Service: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color("#ffffff");
      series.strokeWidth = 0;
      return series;
    }

    function createSeriesPackageCount(value: any, name: any) {
      let series: any = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.valueY = value;
      series.dataFields.categoryX = 'groupBy';
      series.name = name;
      series.fill = am4core.color("#769EDF");
      series.yAxis = packageCountAxis;
      series.strokeWidth = 0;
      series.tooltipText = "Service: [bold]{categoryX}[/]  \n Package Count: [bold]{valueY}[/]";
      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color("#ffffff");
      return series;
    }
    chart.data = data;
    createSeriesNetCharge('netCharge', 'Net Charge');
    createSeriesPackageCount("packageCount", "Package Count");
    serviceAxis.cursorTooltipEnabled = false;
    netChargeAxis.cursorTooltipEnabled = false;
    packageCountAxis.cursorTooltipEnabled = false;
    //Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineY.disabled = true;
    chart.cursor.xAxis = serviceAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fillOpacity = 0.1;
    if (this.themeoption == "dark") {
      chart.cursor.lineX.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
      netChargeAxis.renderer.labels.template.fill = am4core.color("#fff");
      packageCountAxis.renderer.labels.template.fill = am4core.color("#fff");
      serviceAxis.renderer.labels.template.fill = am4core.color("#fff");
      packageCountAxis.renderer.grid.template.stroke = am4core.color("#fff");
      serviceAxis.renderer.grid.template.stroke = am4core.color("#fff");
      packageCountAxis.title.fill = am4core.color("#fff");
      netChargeAxis.title.fill = am4core.color("#fff");
      serviceAxis.renderer.grid.template.strokeOpacity = 1;
      netChargeAxis.renderer.grid.template.strokeOpacity = 1;
      serviceAxis.renderer.grid.template.strokeWidth = 1;
    }
  }
  async bindingTitle() {
    this.closeLoading();
    var yearData = this.clientProfileFormGroup.get('year')?.value;
    var monthData = this.clientProfileFormGroup.get('month')?.value;
    var chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.chargeTitle = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.yearBindingTitle.set(this.clientProfileFormGroup.get('year')?.value);
    if (monthData == null) {
      this.monthBindingTitle.set("");
    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      this.monthBindingTitle.set(monthArray[monthData]);
    }

    if (chargeType == "FRT") {
      this.frtaccBindingTitle = " ( FRT only )";
    } else {
      this.frtaccBindingTitle = "";
    }


    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }

  }

  async weight_Dis(arrayAC: any, event_type: any) {

    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;

    await this.weight_chart(arrayAC, chargetypevalue, event_type, "Bar");
  }

  async weight_chart(tempAC: any, chargetypevalue: any, event_type: any, field1: any) {
    await this.createSeriesFromAC(tempAC, chargetypevalue, event_type, "Bar");
    await this.createSeriesFromACKgs(tempAC, chargetypevalue, event_type, "Bar");
  }

  async createSeriesFromACKgs(collectionAC: any, chargetypevalue: any, event_type: any, seriesName: any) {
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
            "weight": "1",
            "value": tempObj.netCharge1Kgs
          },
          {
            "weight": "2",
            "value": tempObj.netCharge2Kgs
          },
          {
            "weight": "3",
            "value": tempObj.netCharge3Kgs
          },
          {
            "weight": "4",
            "value": tempObj.netCharge4Kgs
          },
          {
            "weight": "5",
            "value": tempObj.netCharge5Kgs
          },
          {
            "weight": "6-10",
            "value": tempObj.netCharge6to10Kgs
          },
          {
            "weight": "11-20",
            "value": tempObj.netCharge11to20Kgs
          },
          {
            "weight": "21-30",
            "value": tempObj.netCharge21to30Kgs
          },
          {
            "weight": "31-50",
            "value": tempObj.netCharge31to50Kgs
          },
          {
            "weight": "51-70",
            "value": tempObj.netCharge51to70Kgs
          },
          {
            "weight": "71-150",
            "value": tempObj.netCharge71to150Kgs
          },
          {
            "weight": "150+",
            "value": tempObj.netCharge150PlusKgs
          }
        ]
        totalValue += Number(tempObj.netCharge1Kgs);
        totalValue += Number(tempObj.netCharge2Kgs);
        totalValue += Number(tempObj.netCharge3Kgs);
        totalValue += Number(tempObj.netCharge4Kgs);
        totalValue += Number(tempObj.netCharge5Kgs);
        totalValue += Number(tempObj.netCharge6to10Kgs);
        totalValue += Number(tempObj.netCharge11to20Kgs);
        totalValue += Number(tempObj.netCharge21to30Kgs);
        totalValue += Number(tempObj.netCharge31to50Kgs);
        totalValue += Number(tempObj.netCharge51to70Kgs);
        totalValue += Number(tempObj.netCharge71to150Kgs);
        totalValue += Number(tempObj.netCharge150PlusKgs);

      }

    }

    this.weight_disTotalvalueKgs = totalValue;
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    let chart = am4core.create("weight_disKgs", am4charts.XYChart);
    chart.data = chartData;
    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
    categoryAxis.dataFields.category = "weight";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    let series: any = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "weight";
    series.name = "Weight";
    series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
    series.columns.template.fillOpacity = .8;

    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#ffffff");

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill: any, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    })
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

  async createSeriesFromAC(collectionAC: any, chargetypevalue: any, event_type: any, seriesName: any = null, type: any = null, palette = "Default") {
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

    this.weight_disTotalvalue = totalValue;
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
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    let series: any = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "weight";
    series.name = "Weight";
    series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
    series.columns.template.fillOpacity = .8;

    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#ffffff");

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill: any, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    })
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
  onTracAccountNumberList: any;
  async onTracAccountNumber(event: any) {
    var accNoObjAC = event;
    this.onTracAccountNumberList = [];
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
    this.accNoOntracCtrl.setValue({ 'accountNo': "ALL" });
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
  AccountoptionsOntrac: any[] = [];
  private setInitialValue() {
    this.filteredAccNoOntrac
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) =>
          a.primaryAccountNumber === b.primaryAccountNumber;
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
    this.httpUSPSService.loadUSPSClientProfile(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {

        this.clientProfileList = result;
        this.closeLoading();
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  async linkfrtacc_clickHandler(event: any) {
    this.closeLoading();
    this.chargetypevalue = await event;
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
    await this.chargeBack_frtacc(this.chargebackfrtacc);
    if (clickedMonth == null) {
      await this.weight_Dis(this.weight_mainAC, "year")
    } else {
      await this.weight_Dis(this.weight_mainAC, "month")
    }
  }


  async linkfrt_clickHandler(event: any) {

    this.closeLoading();
    this.chargetypevalue = await event;
    var chargetypevalue = await event;
    var clickedMonth = await this.clientProfileFormGroup.get('month')?.value;
    if (chargetypevalue == "FRT")

      this.acclink_id_enabled = true;
    this.acclink_id_styleName = "linkButton";
    this.frtlink_id_styleName = "backexpressNondoccolor";
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
      this.expressNondoc12 = 0.00;
      this.expressNondoc10 = 0.00;
      this.expressNondoc09 = 0.00;
      this.expressBreakBulk = 0.00;
      this.expressDomestic = 0.00;
      this.expressEnvelope = 0.00;
      // this.expressWorldwideEu = 0.00;
      // this.expressWorldwideNondoc = 0.00;
      this.expressWorldwide = 0.00;
      this.addresscorrection = 0.00;
      this.sameDay = 0.00;
      this.importExportDuties = 0.00;
      this.extendedAreaFee = 0.00;
      this.fuelSurcharge = 0.00;
      this.wrongAddressFee = 0.00;
    }

    this.chargeDesList = [];
    this.maxValue = 0;


    if (chargeBack_result == null)
      return;

    if (chargeBack_result.length > 0) {
      for (var rymloop = 0; rymloop < chargeBack_result.length; rymloop++) {

        var chargeBackObj = chargeBack_result[rymloop];

        var totAmt = 0;


        if (chargetypevalue == "FRT+ACC")
          chargetypevalue = "FRT+ACC";
        if (chargeBackObj.chargeType == chargetypevalue) {
          totAmt = Number(chargeBackObj.netCharge);
          if (chargeBackObj.groupBy == "EXPRESS 12:00")
            if (Number.isNaN(totAmt)) {
              this.expressNondoc12 = 0.00;
            } else {
              this.expressNondoc12 = Number(totAmt);
            }
          if (chargeBackObj.groupBy == "EXPRESS 10:30")
            if (Number.isNaN(totAmt)) {
              this.expressNondoc10 = 0.00;
            } else {
              this.expressNondoc10 = Number(totAmt);
            }
          if (chargeBackObj.groupBy == "EXPRESS 9:00")
            if (Number.isNaN(totAmt)) {
              this.expressNondoc09 = 0.00;
            } else {
              this.expressNondoc09 = Number(totAmt);
            }


          if (chargeBackObj.groupBy == "EXPRESS BREAKBULK")
            if (Number.isNaN(totAmt)) {
              this.expressBreakBulk = 0.00;
            } else {
              this.expressBreakBulk = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "EXPRESS DOMESTIC")
            if (Number.isNaN(totAmt)) {
              this.expressDomestic = 0.00;
            } else {
              this.expressDomestic = Number(totAmt);
            }
          if (chargeBackObj.groupBy == "EXPRESS ENVELOPE")
            if (Number.isNaN(totAmt)) {
              this.expressEnvelope = 0.00;
            } else {
              this.expressEnvelope = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "EXPRESS WORLDWIDE")
            if (Number.isNaN(totAmt)) {
              this.expressWorldwide = 0.00;
            } else {
              this.expressWorldwide = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "ADDRESS CORRECTION")
            if (Number.isNaN(totAmt)) {
              this.addresscorrection = 0.00;
            } else {
              this.addresscorrection = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Same Day")
            if (Number.isNaN(totAmt)) {
              this.sameDay = 0.00;
            } else {
              this.sameDay = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Declared Value")
            if (Number.isNaN(totAmt)) {
              this.importExportDuties = 0.00;
            } else {
              this.importExportDuties = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Extended Area Fee")
            if (Number.isNaN(totAmt)) {
              this.extendedAreaFee = 0.00;
            } else {
              this.extendedAreaFee = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "FUEL SURCHARGE")
            if (Number.isNaN(totAmt)) {
              this.fuelSurcharge = 0.00;
            } else {
              this.fuelSurcharge = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Wrong Address Fee")
            if (Number.isNaN(totAmt)) {
              this.wrongAddressFee = 0.00;
            } else {
              this.wrongAddressFee = Number(totAmt);
            }
        }
      }


      this.chargeDesList.push(this.expressNondoc12);
      this.chargeDesList.push(this.expressNondoc10);
      this.chargeDesList.push(this.expressNondoc09);
      this.chargeDesList.push(this.expressBreakBulk);
      this.chargeDesList.push(this.expressDomestic);
      this.chargeDesList.push(this.expressEnvelope);
      this.chargeDesList.push(this.expressWorldwide);
      this.chargeDesList.push(this.sameDay);
      this.chargeDesList.push(this.addresscorrection);
      this.chargeDesList.push(this.importExportDuties);
      this.chargeDesList.push(this.fuelSurcharge);
      this.maxValue = Math.max.apply(null, this.chargeDesList);
      var totMax: Number = this.maxValue / 8;
      this.expressNondoc12ProgressBar = await this.calcPercent(this.expressNondoc12, this.maxValue);
      this.expressNondoc10ProgressBar = await this.calcPercent(this.expressNondoc10, this.maxValue);
      this.expressNondoc09ProgressBar = await this.calcPercent(this.expressNondoc09, this.maxValue);
      this.expressBreakBulkProgressBar = await this.calcPercent(this.expressBreakBulk, this.maxValue);
      this.sameDayProgressBar = await this.calcPercent(this.sameDay, this.maxValue);
      this.expressEnvelopeProgressBar = await this.calcPercent(this.expressEnvelope, this.maxValue);
      this.expressDomesticProgressBar = await this.calcPercent(this.expressDomestic, this.maxValue);
      this.expressWorldwideprogressBar = await this.calcPercent(this.expressWorldwide, this.maxValue);
      this.fuelprogressBar = await this.calcPercent(this.fuelSurcharge, this.maxValue);
      this.importExportDutiesprogressBar = await this.calcPercent(this.importExportDuties, this.maxValue);
      this.chargeDesList["expressNondoc12"];
      this.chargeDesList["expressNondoc10"];
      this.chargeDesList["expressNondoc09"];
      this.chargeDesList["expressBreakBulk"];
      this.chargeDesList["expressDomestic"];
      this.chargeDesList["expressEnvelope"];
      this.chargeDesList["addresscorrection"];
      this.chargeDesList["expressWorldwide"];
      this.chargeDesList["fuelSurcharge"];
      this.chargeDesList["sameDay"];
      this.chargeDesList["importExportDuties"];

    }
  }

  async yearSelect(yeardata: any) {
    this.openLoading();
    this.chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.linkflag = 0;
    this.zoneflag = 0;
    this.previousClickedYear = this.clickedYear;
    this.previousClickedMonth = this.clickedMonth;
    var monthValue = "Y";
    this.clickedMonth = 0;
    this.clickedYear = yeardata;
    this.currentyear = Number(this.clickedYear);
    this.dashBoardLable = (this.currentyear);
    this.transportationLable = (this.currentyear);
    var selectedIndex = 0;
    await this.clientProfileFormGroup.get('year')?.setValue(yeardata);
    await this.clientProfileFormGroup.get('month')?.setValue(null);
    await this.initDashBoard();
    this.bindingTitle();
    this.closeLoading();
  }
  //Selected Month
  async monthSelect(monthdata: any) {

    this.openLoading();
    this.chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
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
    await this.httpUSPSService.fetchTopChart(this.clientProfileFormGroup.value)?.subscribe(
      (result: any) => {
        this.fetchDataUSPS(result);
      }, (error: any) => {
        console.log('error ', error);

      })
    await this.fetchdashboardservices();
    await this.fetchProgressServices();
    this.bindingTitle();
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
  searchUserobjUPSArray: any[] = [];

  async searchUser(): Promise<void> {
    const dateFr = this.searchForm.get('fromdate')?.value;
    const dateT = this.searchForm.get('todate')?.value;
    const searchDetail = this.searchForm.get('searchDetail')?.value;
    const chargeSource = this.searchForm.get('chargeSource')?.value;

    if (!dateFr || !dateT) {
      this.openModal("Please select from and to date");
      return;
    }

    if (!searchDetail || searchDetail.trim() === '') {
      this.openModal(
        chargeSource === "TrackingNumber"
          ? "Please Enter Tracking number"
          : "Please Enter a value"
      );
      return;
    }

    const dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    const dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");

    this.clientID = this.clientProfileFormGroup.get('clientId')?.value;
    const clientname = this.clientProfileFormGroup.get('clientName')?.value;

    const dateFrYear = new Date(dateFr).getFullYear();
    const dateTYear = new Date(dateT).getFullYear();
    const yearDiff = dateTYear - dateFrYear;

    if (yearDiff > 1) {
      this.openModal("Time Frame Greater than 2 years");
      return;
    }

    this.searchUserobjUPS = {
      clientId: this.clientID,
      clientName: this.clientName, // or use clientname if needed
      fromDate: dateFrom,
      toDate: dateTo,
      basisValue: this.clientType,
      searchDetail: searchDetail.trim(),
      searchSource: chargeSource
    };

    localStorage.setItem('payload_usps', JSON.stringify(this.searchUserobjUPS));
    this.switchProj.setTrackingPayload(this.searchUserobjUPS);
    this.router.navigate(['/usps/tracking']);
  }

  moreSearch() {
    this.router.navigate(['/shipment-detail-search']);
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
    var fields_any: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_any += key + '=' + value + '&';
    }

    this.httpUSPSService.reportServlet(fields_any);
    this.openModal("Download completed successfully");
  }

  async report_clickHandler(event: any) {
    var urlParam: any = {};
    var monthVal = await this.clientProfileFormGroup.get('month')?.value;
    var clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    var date = new Date();
    var currentYear = new Date().getFullYear();
    if (monthVal == null) {
      var month: any = 0;
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
    var fields_any: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_any += key + '=' + value + '&';
    }
    this.httpUSPSService.reportServlet(fields_any);
    this.openModal("Download completed successfully");
    this.showColumnPickerclass = !this.showColumnPicker;
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