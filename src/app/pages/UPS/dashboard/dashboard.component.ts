import { Component, OnInit, Signal, signal, TemplateRef, HostListener, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';
import { circle, latLng, tileLayer } from 'leaflet';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { ChartType } from './dashboard.model';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { firstValueFrom, map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from '@angular/router';
import { WeightDistPopupComponent } from '../popup/weight-dist-popup/weight-dist-popup.component';
import { ZonePopupComponent } from '../popup/zone-popup/zone-popup.component';
import { ChargeDescPopupComponent } from '../popup/charge-desc-popup/charge-desc-popup.component';
import { MoreServicePopupComponent } from '../popup/more-service-popup/more-service-popup.component';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-ups-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class UpsDashboardComponent implements OnInit {
  clientType = '';
  dashBoardSHP!: FormGroup;
  searchForm: FormGroup;
  clientProfileFormGroup!: FormGroup;
  projectName: string = '';
  Accountoptions: any = [];
  isLoading = true;
  selectedOption: any;
  randomNumber: any;
  resultObj: any;
  zoneflag = 0;
  chargeBack_result: any[] = [];
  chargebackfrtacc: any[] = [];
  fromDate: any = new Date;
  toDate: any = new Date;
  dates: any = [];
  selectYear: any = [];
  filteredOptions!: Observable<string[]>;
  userProfifle: any;
  chargePopupfrtaccAC: any = [];

  ground_Hundredweight: any;
  ground_Commercial: any;
  ground_residential: any;
  next_day_air: any;
  next_day_air_AM: any;
  next_day_air_Saver: any;
  two_day: any;
  twoDayAM: any;
  three_day: any;
  groundFreightPricing: any;
  fuel_ser: any;
  add_correction: any;
  Declared_value: any;
  charge_back: any;
  sure_post: any;
  scc: any;
  chargeDesList: any;
  maxValue: any;
  maxVal: any;
  GHprogressBar: any;
  GCprogressBar: any;
  GRprogressBar: any;
  Next_dayprogressBar: any;
  Next_day_AMprogressBar: any;
  Next_day_saver_ProgressBar: any;
  twodayprogressBar: any;
  three_dayprogressBar: any;
  fuelprogressBar: any;
  surepost_id: any;
  twoDayAMProgressBar: any;
  groundFreightPricingProgressBar: any;
  domesticGroundService = signal<any>([])
  internationGroundService = signal<any>([])
  progressBarUpsList: any = [];
  clientProfileList: any;
  themeoption: any;
  year_Select: any;
  month_Select: any;
  currentyear: any;
  isOpenModalOpened!: boolean;
  frtacc_btn_selected = true;
  weight_labid_text: any;

  private _onDestroy = new Subject<void>();
  public accNoCtrl: FormControl = new FormControl();
  public accNoFilterCtrl: FormControl = new FormControl();
  public filteredAccNo: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  T201DashboardObj: any;
  totalPackCount: any;
  totalPackCost = signal<any>('');
  t201DashStaticCurrentYRObj: any;
  yearBindingTitle = signal<any>('');
  monthBindingTitle = signal<any>('');
  frtaccBindingTitle = signal<any>('');
  panelClass: any;
  openModalConfig: any;
  totalvaluezone = 0;
  sendValue = {};
  resultData = signal<gridData | null>(null);
  t004reymax_by_month_resultAC: any;
  valuegross: any;
  billed_weight_lbl_text: any;
  net_transporation_lbl_text: any;
  costperpackage_lbl_text: any;
  billedweight_lbl_text: any;
  costperpackage_ytd_lbl_text: any;
  net_transporation_ytd_lbl_text: any;
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
  });
  SearchType = 'Tracking Number';

  // Column picker
  showColumnPicker = false;
  // bread crumb items 
  analyticsChart!: ChartType;
  BestSelling: any;
  TopSelling: any;
  Recentelling: any;
  SalesCategoryChart!: ChartType;
  statData!: any;
  currentDate: any;
  themeColorMap: any;

  //international
  worldwideExpedite: any;
  worldwideExpress: any;
  worldwideExpressSaver: any;
  worldwideSaver: any;
  Standard: any
  worldwideExpressPlus: any
  worldwideExpressFreight: any
  worldwideEconomyDDP: any
  worldwideEconomyDDU: any
  Freight: any

  worldwideExpediteprogressBar: any;
  worldwideExpressprogressBar: any;
  worldwideExpressSaverprogressBar: any;
  worldwideSaverprogressBar: any;
  StandardprogressBar: any
  worldwideExpressPlusprogressBar: any
  worldwideExpressFreightprogressBar: any
  worldwideEconomyDDPprogressBar: any
  worldwideEconomyDDUprogressBar: any
  FreightprogressBar: any
  internationalchargeDesList: any;
  maxValueInt: any
  progressBarUpsListInternational: any = [];
  searchUserobjUpsArray: any = [];


  constructor(public toastService: ToastService, private commonService: CommonService,
    private httpClientService: HttpClientService,
    private dialog: MatDialog, private datePipe: DatePipe, private router: Router,
    private cookiesService: CookiesService, private switchProj: SwitchProjectService, private loaderService: LoaderService) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
    });
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
    this.initForm();
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.currentDate = { from: firstDay, to: lastDay }
  }
  initForm() {
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('SHP_FRT+ACC')
    });



    this.clientProfileFormGroup = new FormGroup({
      status: new FormControl('ACTIVE'),
      lazyLoad: new FormControl('N'),
      clientName: new FormControl(''),
      clientId: new FormControl(''),
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
    // this.switchProj.projNameSource.subscribe((message: string) => {
    //   this.projectName = message;
    // });
  }
  chargetypevalue = signal<any>('');
  linkflag = 0;
  previousClickedYear: any;
  previousClickedMonth: any;
  clickedMonth: any;
  dashBoardLable: any;
  transportationLable: any;
  async yearSelect(yeardata: any) {
    this.openLoading();
    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
    this.linkflag = 0;
    this.zoneflag = 0;
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
    this.initDashBoard();
  }
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
    if (monthdata == "null") {
      monthdata = null
    }
    await this.clientProfileFormGroup.get('month')?.setValue(monthdata);
    await this.clientProfileFormGroup.get('year')?.setValue(this.currentyear);
    await this.httpClientService.fetchDashBoard(this.clientProfileFormGroup.value).subscribe({
      next: (result: any) => {
        this.resultObj = result;
        this.fetchData(result);
        this.fetchT004Rymax_resultcurrent(result);
        this.fetchT004Rymax_by_month_result(result);
      },
      error: (error: any) => {
        console.log('error ', error);
      }
    })
    this.bindingTitle();
  }

  async fetchT004Rymax_by_month_result(event: any[]): Promise<void> {
    this.setDimensionTexts();
    if (!event || event.length === 0) {
      this.handleNoData();
      return;
    }
    this.t004reymax_by_month_resultAC = event;
    const lastDashboardObj = this.enrichDashboardData(event);
    this.updateMonthValues(lastDashboardObj);
    this.updateYTDValues();
    this.appendServiceType(event);
    this.triggerCharts(event);
    await this.loadChargeBackData();
    if (!this.valuegross || this.valuegross === '0.00') {
      this.handleNoData();
    }
  }
  private setDimensionTexts(): void {
    this.dim_id_text = this.dimension ?? '$0.00';
    this.dimyear_id_text = this.dimensionyear ?? '$0.00';
  }
  private enrichDashboardData(data: any[]): any {
    let lastObj: any = null;
    for (const obj of data) {
      obj.tempyearNetchargeForYTD = this.tempnetchargeYTD;
      obj.tempyearNetchargeForYTDFRT = this.tempyearNetchargeFRT;
      obj.tempyearCostperPackageYTD = this.tempyearcostperpackageYTD;
      obj.tempyearCostperpackageYTDFRT = this.tempyearcostperpackageFRT;
      obj.tempyearcostperlbYTD = this.tempyearcostperlbYTD;
      obj.tempyearbilledWeightYTD = this.tempyearbilledweightYTD;
      obj.tempyearEnteredWeightYTD = this.tempyearenteredWeightYTD;
      obj.tempyearSccYTD = this.tempyearsccYTD;
      obj.tempyearWeightdiffYTD = this.tempyearweightdiffYTD;

      lastObj = obj;
    }

    this.Panel2_Object = lastObj;
    this.Column_EnteredAC = [lastObj];

    return lastObj;
  }


  private updateMonthValues(obj: any): void {
    this.weightbox = obj?.billedWeight ?? 0;
    this.dimension = obj?.scc ?? 0;
    this.netcharge = obj?.netCharge ?? 0;
    this.costperpackage = obj?.costperPackage ?? 0;
    this.valuegross = obj?.grossCharge ?? '0.00';

    this.billed_weight_lbl_text = `${this.weightbox}`;
    this.net_transporation_lbl_text = `${this.netcharge}`;
    this.costperpackage_lbl_text = `${this.costperpackage}`;

    this.dim_id_text = this.dimension ?? '$0.00';
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

  // ======================= YTD VALUES =======================
  private updateYTDValues(): void {
    const ytd = this.tempPanel2_Object_YTD_Billed ?? {};

    this.billedweight_lbl_text = `${ytd.yearbilledWeight ?? 0}`;
    this.net_transporation_ytd_lbl_text = `${ytd.yearNetcharge ?? 0}`;
    this.costperpackage_ytd_lbl_text = `${ytd.yearCostperPackage ?? 0}`;

    this.dimensionyear = ytd.yearScc ?? '$0.00';
    this.dimyear_id_text = this.dimensionyear;
  }


  // ======================= SERVICE TYPE =======================
  private appendServiceType(data: any[]): void {
    data.push({ ServiceType: 'month' });
  }


  // ======================= CHART TRIGGER =======================
  private triggerCharts(data: any[]): void {
    this.weight_mainAC = data;
    this.weight_Dis(data, 'month');
  }


  // ======================= CHARGEBACK LOAD =======================
  private async loadChargeBackData(): Promise<void> {
    this.clientID = this.userProfifle?.[0]?.clientId;
    const clientName = this.userProfifle?.[0]?.clientName;

    this.clickedYear = this.clientProfileFormGroup.get('year')?.value;
    const currentMonth = this.clientProfileFormGroup.get('month')?.value;

    if (this.clientID && clientName) {
      await this.chargeBackLoadFunction(
        this.clickedYear,
        `${this.clientID}`,
        currentMonth,
        clientName
      );
    }
  }


  // ======================= NO DATA HANDLER =======================
  private handleNoData(): void {

    this.clickedYear = this.previousClickedYear;
    this.clickedMonth = this.previousClickedMonth;

    if (this.clickedMonth && this.clickedMonth !== 0) {
      this.loadMonthFunction(`${this.clickedMonth}`);
    } else {
      this.previousYearCall(this.clickedYear);
    }

    this.openModal('No Data Available for Selected Month!');
    this.initDashBoard();
  }
  async loadMonthFunction(monthVal: string | number): Promise<void> {
    this.clientProfileFormGroup.get('month')?.setValue(null);
    await this.initFetchDashBoard();
  }
  async previousYearCall(yearStr: string | number): Promise<void> {
    this.clientProfileFormGroup.get('year')?.setValue(yearStr);
    await this.initFetchDashBoard();
  }
  async initFetchDashBoard(): Promise<void> {

    try {
      /* ================= USER PROFILE ================= */
      this.userProfifle = await this.getuserProfile();
      if (!this.userProfifle || this.userProfifle.length === 0) {
        console.warn("UPS user profile is not ready.");
        this.closeLoading();
        return;
      }
      this.clientID = this.userProfifle?.[0]?.clientId;

      if (!this.clientID) {
        this.openModal('Client not found');
        return;
      }

      /* ================= THEME ================= */
      this.themeoption = await this.cookiesService.getCookie('themeOption');

      /* ================= YEAR ================= */
      const selectedYear = this.clientProfileFormGroup.get('year')?.value;
      const yearData: number =
        selectedYear === '' || selectedYear == null
          ? new Date().getFullYear() - 2
          : selectedYear;

      /* ================= MONTH ================= */
      const selectedMonth = this.clientProfileFormGroup.get('month')?.value;
      const monthData =
        selectedMonth === '' || selectedMonth == null
          ? null
          : selectedMonth;

      /* ================= FORM UPDATE ================= */
      this.currentyear = yearData;

      this.clientProfileFormGroup.patchValue({
        clientId: this.clientID,
        year: yearData,
        month: monthData
      });

      this.year_Select = yearData;
      this.month_Select = monthData;

      /* ================= API CALL ================= */
      this.httpClientService
        .fetchDashBoard(this.clientProfileFormGroup.value)
        .subscribe({
          next: (result: any[]) => {
            if (!result || result.length === 0) {
              this.openModal('No data available');
              this.fetchData(result);
              this.closeLoading();
              return;
            }

            this.resultObj = result;
            this.dashBoardFrtObj = result[0];
            this.dashBoardFrtAccObj = result[1];
          },
          error: (error: any) => {
            console.error('Dashboard fetch error:', error);
            this.closeLoading();
          }
        });

    } catch (error: any) {
      console.error('initFetchDashBoard failed:', error);
      this.closeLoading();
    }
  }
  dashBoardFrtObj: any;
  dashBoardFrtAccObj: any;
  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }
  ngOnInit(): void {
    //Theme Style
    if (sessionStorage.getItem('toast')) {
      this.toastService.show('Logged in Successfull.', { classname: 'bg-success text-center text-white', delay: 5000 });
      sessionStorage.removeItem('toast');
    }
    // this._analyticsChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    // this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    //Theme Style

    this.initializeDefaults();
    this.initializeDateRange();
    this.updateSearchFormDates();
    this.populateYearList();
    this.openLoading();
    this.initDashBoard();
    this.loadClientProfile();
    // this.initializeAutoComplete();
  }
  private initializeDefaults(): void {
    this.randomNumber = Math.floor(100000 + Math.random() * 900000);
    this.currentDate = new Date();
    this.selectedOption = 'ALL';
    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
    this.yearBindingTitle.set(this.clientProfileFormGroup.get('year')?.value)
  }

  private initializeDateRange(): void {
    const today = new Date();
    this.fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    this.toDate = new Date(today.getFullYear(), today.getMonth(), 0);

    this.dates = {
      start: new Date(this.fromDate),
      end: new Date(this.toDate)
    };
  }
  private updateSearchFormDates(): void {
    this.searchForm.patchValue({
      dateRange: {
        start: this.fromDate,
        end: this.toDate
      },
      fromdate: this.fromDate,
      todate: this.toDate
    });
  }
  private populateYearList(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 3; year <= currentYear; year++) {
      this.selectYear.push(year);
    }
  }
  loadClientProfile(): void {
    this.httpClientService.loadClientProfile(this.clientProfileFormGroup.value)
      .subscribe({
        next: (result: any[]) => {
          this.clientProfileList = result;
          this.closeLoading();
        },
        error: (err: any) => {
          console.error('Failed to load client profile', err);
        }
      });
  }





  accountNumberList: any[] = [];



  private filterAccNo(): void {
    if (!this.Accountoptions || !this.accNoFilterCtrl.value) {
      this.filteredAccNo.next([...this.Accountoptions]);
      return;
    }
    const search = this.accNoFilterCtrl.value.toLowerCase();
    const filtered = this.Accountoptions.filter((acc: any) =>
      acc.primaryAccountNumber.toLowerCase().includes(search)
    );

    this.filteredAccNo.next(filtered);
  }


  t201dashResultACYear: any;
  fetchTotalSpendVal: any;
  totalTransSummAC: any = [];

  totalTransSummAC1: number = 0;


  checkValueNull(event: any): number {
    return event == null ? 0 : event;
  }

  t219DashboardZoneChartAC: any;

  t219List: any[] = [];
  totalZoneValue = signal<any>(0);



  private getMonthValue(item: any, month: number): any {
    const monthMap: any = {
      1: item.jan,
      2: item.feb,
      3: item.mar,
      4: item.apr,
      5: item.may,
      6: item.jun,
      7: item.jul,
      8: item.aug,
      9: item.sep,
      10: item.oct,
      11: item.nov,
      12: item.decm
    };

    return monthMap[month] ?? null;
  }
  private zoneChartRoot!: am5.Root; // Keep reference to chart root for disposal






  private buildZoneChartData(zone: any): any[] {
    const map = [
      ['Ground', 'ground', 'Ground'],
      ['Home \n Delivery', 'homeDelivery', 'Home Delivery'],
      ['Ground \n Economy', 'smartPost', 'Ground Economy'],
      ['First \n Overnight', 'firstOvernight', 'First Overnight'],
      ['Priority \n Overnight', 'priorityOvernight', 'Priority Overnight'],
      ['Standard \n Overnight', 'standardOvernight', 'Standard Overnight'],
      ['2 Day', 'twoDay', '2 Day'],
      ['Express \n Saver', 'expressSaver', 'Express Saver'],
      ['International \n Ground', 'internatinalGround', 'International Ground'],
      ['International \n First', 'internationalFirst', 'International First'],
      ['International \n Priority \n Express', 'internationalPriorityExpress', 'International Priority Express'],
      ['International \n Priority', 'internationalPriority', 'International Priority'],
      ['International \n Economy', 'internationalEconomy', 'International Economy']
    ];

    return map.map(([name, key, categoryName]) => ({
      name,
      value: zone[key] ?? '0',
      categoryName
    }));
  }





  t202DashStaticChrgDescGrpAC: any;

  indivServAC: any[] = [];





  private pieChartRoot!: am5.Root; // Keep reference for disposal




  t202DashStaticChrgDescIndAC: any;





  private spendChartRoot!: am5.Root;

  async TotalSpend_bar_chart(resultData: any[]) {
    console.log('TotalSpend_bar_chart');
    // Dispose old chart
    if (this.spendChartRoot) {
      this.spendChartRoot.dispose();
    }

    // Calculate AvgCost dynamically
    resultData.forEach(item => {
      item.AvgCost = (item.Count && Number(item.Count) !== 0)
        ? item.NetAmount / item.Count
        : Number(item.NetAmount) !== 0 && Number(item.Count) === 0 ? 0.0 : null;
    });

    // Create root
    this.spendChartRoot = am5.Root.new("chartdiv");
    const root = this.spendChartRoot;

    // Theme
    root.setThemes([am5themes_Animated.new(root)]);

    // Create XY chart
    const chart: any = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout
      })
    );

    chart.data.setAll(resultData);

    const minNegVal = resultData.some(item => item.NetAmount < 0);

    // --- X Axis ---
    const dateAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        maxDeviation: 0,
        baseInterval: { timeUnit: "month", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 30 })
      })
    );
    dateAxis.get("renderer").grid.template.setAll({ visible: false });
    dateAxis.get("renderer").labels.template.setAll({ rotation: 0 });

    // --- Y Axes ---
    const countAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
        min: 0
      })
    );
    countAxis.get("renderer").grid.template.setAll({ visible: false });
    countAxis.children.push(am5.Label.new(root, { text: "Package Count", rotation: 0 }));

    const netAmountAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { opposite: false }),
        min: minNegVal ? undefined : 0
      })
    );
    netAmountAxis.get("renderer").grid.template.setAll({ visible: false });
    netAmountAxis.children.push(am5.Label.new(root, { text: "$ Net Charge", rotation: 0 }));

    const avgCostAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { opposite: true }),
        min: 0
      })
    );
    avgCostAxis.get("renderer").grid.template.setAll({ visible: false });
    avgCostAxis.children.push(am5.Label.new(root, { text: "Avg Cost / Package ($)", rotation: 0 }));

    // --- NetAmount Column Series ---
    const netAmountSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Net Charge",
        xAxis: dateAxis,
        yAxis: netAmountAxis,
        valueYField: "NetAmount",
        dateXField: "Month"
      })
    );
    console.log('chart')
    netAmountSeries.columns.template.setAll({
      fill: am5.color(0x1AA7E8),
      stroke: am5.color(0x1AA7E8),
      fillOpacity: 0.85,
      width: am5.percent(70)
    });
    netAmountSeries.columns.template.states.create("hover").setAll({ fillOpacity: 0.9 });
    netAmountSeries.set("tooltip", am5.Tooltip.new(root, {
      labelText: "Month: {dateX.formatDate('MMMM')}\nNet Charge: $ {valueY.formatNumber('#,###.00')}"
    }));

    // --- Count Line Series ---
    const countSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Package Count",
        xAxis: dateAxis,
        yAxis: countAxis,
        valueYField: "Count",
        dateXField: "Month"
      })
    );
    countSeries.set("tooltip", am5.Tooltip.new(root, {
      labelText: "Month: {dateX.formatDate('MMMM')}\nPackage Count: {valueY}"
    }));
    countSeries.bullets.push((root: any) =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, { radius: 5, fill: am5.color(0xffffff), strokeWidth: 2 })
      })
    );

    // --- AvgCost Line Series ---
    const avgCostSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Average Cost per Package",
        xAxis: dateAxis,
        yAxis: avgCostAxis,
        valueYField: "AvgCost",
        dateXField: "Month",
        stroke: am5.color(0x20A39E),
        strokeWidth: 2
      })
    );
    avgCostSeries.set("tooltip", am5.Tooltip.new(root, {
      labelText: "Month: {dateX.formatDate('MMMM')}\nAvg Cost: $ {valueY.formatNumber('#,##0.00')}"
    }));
    avgCostSeries.bullets.push((root: any) =>
      am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, { radius: 5, fill: am5.color(0xffffff), strokeWidth: 2 })
      })
    );

    // --- Legend ---
    chart.children.push(am5.Legend.new(root, {}));

    // --- Cursor ---
    const cursor = am5xy.XYCursor.new(root, { behavior: "none" });
    cursor.lineY.set("visible", false);
    cursor.lineX.setAll({ strokeOpacity: 0, fillOpacity: 0.1 });
    cursor.set("xAxis", dateAxis);
    chart.set("cursor", cursor);

    // --- Dark Theme ---
    if (this.themeoption === "dark") {
      chart.get("legend")!.labels.template.setAll({ fill: am5.color(0xffffff) });
      [netAmountAxis, countAxis, avgCostAxis, dateAxis].forEach(axis => {
        axis.get("renderer").labels.template.setAll({ fill: am5.color(0xffffff) });
        axis.get("renderer").grid.template.setAll({ stroke: am5.color(0xffffff), strokeOpacity: 1 });
      });
      cursor.lineX.setAll({ stroke: am5.color(0xffffff) });
    }
  }


  totalWgtDistbution: any;


  private weightChartRoot!: am5.Root;





  private closeModalIfOpen(): void {
    if (this.isOpenModalOpened) {
      this.openModalConfig.close();
      this.isOpenModalOpened = false;
    }
  }
  clientID: any;
  async initDashBoard(): Promise<void> {
    /* ================= USER PROFILE ================= */
    this.userProfifle = await this.getuserProfile();
    this.clientID = this.userProfifle?.[0]?.clientId;

    /* ================= THEME ================= */
    this.themeoption = await this.cookiesService.getCookie('themeOption');

    /* ================= YEAR LOGIC ================= */
    const selectedYear = this.clientProfileFormGroup.get('year')?.value;
    const today = new Date();

    const yearData: number = selectedYear
      ? selectedYear
      : (today.getMonth() === 0 || (today.getMonth() === 1 && today.getDate() <= 5))
        ? today.getFullYear() - 1
        : today.getFullYear();

    /* ================= MONTH LOGIC ================= */
    const monthValue = this.clientProfileFormGroup.get('month')?.value;
    const monthData = monthValue ? monthValue : null;

    this.currentyear = yearData;

    /* ================= FORM PATCH ================= */
    this.clientProfileFormGroup.patchValue({
      clientId: this.clientID,
      year: yearData,
      invoiceyear: yearData,
      month: monthData
    });

    this.year_Select = yearData;
    this.yearBindingTitle.set(this.year_Select);
    this.month_Select = monthData;

    /* ================= DASHBOARD API ================= */
    this.httpClientService
      .fetchDashBoard(this.clientProfileFormGroup.value)
      .subscribe({
        next: (result: any) => {
          this.totSpend004AC = result;
          this.totalspendAcValue = result;

          if (!this.month_Select) {
            this.total_Spend(result);
          }

          this.fetchData(result);
          this.fetchT004Rymax_by_year_result(result);
          this.fetchT004Rymax_resultcurrent(result);

          if (this.isOpenModalOpened) {
            this.openModalConfig.close();
            this.isOpenModalOpened = false;
          }
        },
        error: (error: any) => {
          console.error('Dashboard API error:', error);
        }
      });
  }
  async fetchData(result: any[]) {
    this.resultData.set(null);
    if (!result || result.length === 0) {
      return;
    }
    const monthflog = this.clientProfileFormGroup.get('month')?.value;
    let chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    if (chargetypevalue == null) {
      this.chargetypevalue.set('SHP_FRT+ACC');
    }
    const t004DashBoardCYObj: any = {};
    let totalSpentCount = 0;
    if (monthflog == null) {
      const yearObj = result[1];
      for (const item of result) {
        if (item.chargeType === chargetypevalue) {
          totalSpentCount += Number(item.totalSpentCount || 0);
        }
      }
      t004DashBoardCYObj.grossCharge = yearObj.yearGrossCharge;
      t004DashBoardCYObj.netCharge = yearObj.yearNetcharge;
      t004DashBoardCYObj.costperPackage = yearObj.yearCostperPackage;
      t004DashBoardCYObj.costperlb = yearObj.yearcostperlb;
      t004DashBoardCYObj.enteredWeight = yearObj.yearEnteredWeight;
      t004DashBoardCYObj.billedWeight = yearObj.yearbilledWeight;
      t004DashBoardCYObj.scc = yearObj.yearScc;
      t004DashBoardCYObj.weightdifference = yearObj.yearWeightdifference;
      t004DashBoardCYObj.grosschargeFRT = yearObj.yearGrosschargeFRT;
      t004DashBoardCYObj.netchargeFRT = yearObj.yearNetchargeFRT;
      t004DashBoardCYObj.costperlbFRT = yearObj.yearCostperlbFRT;
      t004DashBoardCYObj.costperpackageFRT = yearObj.yearCostperpackageFRT;
      t004DashBoardCYObj.totalSpentCount = totalSpentCount;
      t004DashBoardCYObj.averageWeight =
        (Number(yearObj.yearbilledWeight) + Number(yearObj.yearWeightdifference)) /
        Number(totalSpentCount);

    }
    // --------------------------------------------------
    // MONTHLY DATA
    // --------------------------------------------------
    else {

      for (const item of result) {
        if (item.month === monthflog) {
          t004DashBoardCYObj.grossCharge = item.grossCharge;
          t004DashBoardCYObj.netCharge = item.netCharge;
          t004DashBoardCYObj.costperPackage = item.costperPackage;
          t004DashBoardCYObj.costperlb = item.costperlb;
          t004DashBoardCYObj.enteredWeight = item.enteredWeight;
          t004DashBoardCYObj.billedWeight = item.billedWeight;
          t004DashBoardCYObj.scc = item.scc;
          t004DashBoardCYObj.weightdifference = item.weightdifference;
          t004DashBoardCYObj.grosschargeFRT = item.grosschargeFRT;
          t004DashBoardCYObj.netchargeFRT = item.netchargeFRT;
          t004DashBoardCYObj.costperlbFRT = item.costperlbFRT;
          t004DashBoardCYObj.costperpackageFRT = item.costperpackageFRT;
          t004DashBoardCYObj.totalSpentCount = item.totalSpentCount;

          t004DashBoardCYObj.averageWeight =
            (Number(item.billedWeight) + Number(item.weightdifference)) /
            Number(item.totalSpentCount);
        }
      }
    }

    this.resultData.set(t004DashBoardCYObj);
    console.log('resultData', this.resultData())
  }

  loginId: Number = 0;
  async report_clickHandler(event: any) {
    var t007_reportlogobj: any = {};
    var designFileName = event;
    var date = new Date();
    var currentYear = new Date().getFullYear();
    var dateValue = this.datePipe.transform(date, "yyyy-MM-dd");
    var monthVal = await this.clientProfileFormGroup.get('month')?.value
    var clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    if (monthVal == null) {
      var clickedMonth = 0;
    }
    else {
      clickedMonth = monthVal;
    }

    if (clickedMonth == 0) {
      t007_reportlogobj['fromDate'] = clickedYear + "-01" + "-01";
      if (clickedYear == currentYear)
        t007_reportlogobj['toDate'] = this.datePipe.transform(this.dataasof, "yyyy-MM-dd");
      else
        t007_reportlogobj['toDate'] = clickedYear + "-12" + "-31";

    }
    else {
      var date = new Date(clickedYear, clickedMonth, 0);
      var lastDay = date.getDate();
      t007_reportlogobj['fromDate'] = this.datePipe.transform(clickedYear + "-" + clickedMonth + "-01", "yyyy-MM-dd");
      t007_reportlogobj['month'] = clickedMonth.toString();
      t007_reportlogobj['toDate'] = this.datePipe.transform(clickedYear + "-" + clickedMonth + "-" + lastDay, "yyyy-MM-dd");
    }
    if (event == "SCCReportDash") {
      if (clickedMonth == 0) {
        t007_reportlogobj['month'] = clickedMonth.toString();
      }
      t007_reportlogobj['year'] = clickedYear.toString();
    }

    t007_reportlogobj['moduleName'] = "Dashboardmodule";
    t007_reportlogobj['login_id'] = this.loginId.toString();
    t007_reportlogobj['t001ClientProfile'] = this.userProfifle[0];

    t007_reportlogobj['reportType'] = designFileName;
    t007_reportlogobj['reportName'] = designFileName;
    t007_reportlogobj['designFileName'] = designFileName;
    t007_reportlogobj['status'] = 'IN QUEUE';
    t007_reportlogobj['reportFormat'] = "CSV";
    t007_reportlogobj['crmaccountNumber'] = "NA";
    t007_reportlogobj['accountNumber'] = "NA";
    t007_reportlogobj['chargeDesc'] = "";

    this.httpClientService.runReport(t007_reportlogobj).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, (error: any) => {
      });
  }
  async linkshpChange(data: any) {
    this.openLoading();
    this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
    this.bindingTitle();
    if (data == "SHP_FRT") {
      await this.linkfrt_clickHandler(data);
    }
    if (data == "SHP_FRT+ACC" || data == null) {
      await this.linkfrtacc_clickHandler(data);
    }
  }
  async linkfrt_clickHandler(event: string) {
    this.closeLoading();
    const chargeTypeValue = event;
    const clickedMonth = this.clientProfileFormGroup.get('month')?.value;
    // Flags
    this.zoneflag = 1;
    this.linkflag = 1;

    // Force charge type
    this.chargetypevalue.set('SHP_FRT');

    // Month handling (kept for logic compatibility)
    if (clickedMonth !== 0 && clickedMonth != null) {
      const monthNumber = Number(clickedMonth);
      // monthNumber available if needed later
    }

    // Data calls
    await this.total_Spend(this.totalspendAcValue);
    await this.createSeriesFromAC_morezone(this.allzonefrtaccAC);
    await this.chargeBack_frtacc(this.chargebackfrtacc);

    await this.weight_Dis(
      this.weight_mainAC,
      clickedMonth == null ? 'year' : 'month'
    );
  }
  async linkfrtacc_clickHandler(event: string) {
    this.closeLoading();

    const chargeTypeValue = event;
    const clickedMonth = this.clientProfileFormGroup.get('month')?.value;

    if (chargeTypeValue === 'SHP_FRT+ACC' || chargeTypeValue == null) {
      this.zoneflag = 0;
      this.linkflag = 0;
    }

    // Force charge type
    this.chargetypevalue.set('SHP_FRT+ACC');

    // Month handling (kept for compatibility)
    if (clickedMonth !== null) {
      const monthNumber = Number(clickedMonth);
      // monthNumber available if needed later
    }

    // Data calls
    await this.total_Spend(this.totalspendAcValue);
    await this.createSeriesFromAC_morezone(this.allzonefrtaccAC);
    await this.chargeBack_frtacc(this.chargebackfrtacc);
    console.log('this.chargePopupfrtaccAC', this.chargePopupfrtaccAC)
    await this.pie_chart(this.chargePopupfrtaccAC);

    await this.weight_Dis(
      this.weight_mainAC,
      clickedMonth == null ? 'year' : 'month'
    );
  }
  async chargeBack_frtacc(chargebackfrtacc: any[]) {
    let chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    const chargeBackResult = chargebackfrtacc;

    if (!chargeBackResult || chargeBackResult.length === 0) {
      return;
    }

    // Reset values
    this.ground_Hundredweight = 0;
    this.ground_Commercial = 0;
    this.ground_residential = 0;
    this.next_day_air = 0;
    this.next_day_air_AM = 0;
    this.next_day_air_Saver = 0;
    this.two_day = 0;
    this.twoDayAM = 0;
    this.three_day = 0;
    this.groundFreightPricing = 0;
    this.fuel_ser = 0;
    this.add_correction = 0;
    this.Declared_value = 0;
    this.charge_back = 0;
    this.sure_post = 0;
    this.scc = 0;

    this.GHprogressBar = 0;
    this.GCprogressBar = 0;
    this.GRprogressBar = 0;
    this.Next_dayprogressBar = 0;
    this.Next_day_AMprogressBar = 0;
    this.Next_day_saver_ProgressBar = 0;
    this.twodayprogressBar = 0;
    this.three_dayprogressBar = 0;
    this.surepost_id = 0;
    this.twoDayAMProgressBar = 0;
    this.groundFreightPricingProgressBar = 0;

    this.progressBarUpsList = [];
    this.chargeDesList = [];
    this.maxValue = 0;

    this.worldwideExpedite = 0;
    this.worldwideExpress = 0;
    this.worldwideExpressSaver = 0;
    this.worldwideSaver = 0;
    this.Standard = 0;
    this.worldwideExpressPlus = 0;
    this.worldwideExpressFreight = 0;
    this.worldwideEconomyDDP = 0;
    this.worldwideEconomyDDU = 0;
    this.Freight = 0;

    this.worldwideExpediteprogressBar = 0;
    this.worldwideExpressprogressBar = 0;
    this.worldwideExpressSaverprogressBar = 0;
    this.worldwideSaverprogressBar = 0;
    this.StandardprogressBar = 0;
    this.worldwideExpressPlusprogressBar = 0;
    this.worldwideExpressFreightprogressBar = 0;
    this.worldwideEconomyDDPprogressBar = 0;
    this.worldwideEconomyDDUprogressBar = 0;
    this.FreightprogressBar = 0;
    this.internationalchargeDesList = [];
    this.maxValueInt = 0;
    this.progressBarUpsListInternational = [];

    for (let i = 0; i < chargeBackResult.length; i++) {
      const obj = chargeBackResult[i];
      const amount = Number(obj.netamount) || 0;

      if (chargetypevalue === 'SHP_FRT+ACC') {
        chargetypevalue = null;
      }

      if (obj.chargetype === chargetypevalue) {
        switch (obj.groupby) {
          case 'Ground Hundredweight':
            this.ground_Hundredweight = amount;
            break;
          case 'Ground Commercial':
            this.ground_Commercial = amount;
            break;
          case 'Ground Residential':
            this.ground_residential = amount;
            break;
          case 'Next Day Air':
            this.next_day_air = amount;
            break;
          case 'Next Day Air A.M.':
            this.next_day_air_AM = amount;
            break;
          case 'Next Day Air Saver':
            this.next_day_air_Saver = amount;
            break;
          case '2 Day':
            this.two_day = amount;
            break;
          case '2 Day AM':
            this.twoDayAM = amount;
            break;
          case '3 Day':
            this.three_day = amount;
            break;
          case 'Ground (Freight Pricing)':
            this.groundFreightPricing = amount;
            break;
          case 'Fuel Surcharge':
            this.fuel_ser = amount;
            break;
          case 'Address Correction':
            this.add_correction = amount;
            break;
          case 'Declared Value':
            this.Declared_value = amount;
            break;
          case 'Chargeback':
            this.charge_back = amount;
            break;
          case 'Ground Saver':
            this.sure_post = amount;
            break;

          //International
          case 'Worldwide Expedited': this.worldwideExpedite = amount; break;
          case 'Worldwide Express': this.worldwideExpress = amount; break;
          case 'Worldwide Express Saver': this.worldwideExpressSaver = amount; break;
          case 'Worldwide Saver': this.worldwideSaver = amount; break;
          case 'Standard': this.Standard = amount; break;
          case 'Worldwide Express Plus': this.worldwideExpressPlus = amount; break;
          case 'Worldwide Express Freight': this.worldwideExpressFreight = amount; break;
          case 'Worldwide Economy DDP': this.worldwideEconomyDDP = amount; break;
          case 'Worldwide Economy DDU': this.worldwideEconomyDDU = amount; break;
          case 'Freight': this.Freight = amount; break;
        }
      }

      if (obj.groupby === 'SCC') {
        this.scc = amount;
      }
    }

    // Collect values for max calculation
    this.chargeDesList.push(
      this.ground_Hundredweight,
      this.ground_Commercial,
      this.ground_residential,
      this.next_day_air,
      this.next_day_air_AM,
      this.next_day_air_Saver,
      this.two_day,
      this.three_day,
      this.sure_post,
      this.twoDayAM,
      this.groundFreightPricing
    );

    this.maxVal = Math.max(...this.chargeDesList);
    this.maxValue = this.maxVal + this.maxVal / 10;

    this.internationalchargeDesList.push(
      this.worldwideExpedite,
      this.worldwideExpress,
      this.worldwideExpressSaver,
      this.worldwideSaver,
      this.Standard,
      this.worldwideExpressPlus,
      this.worldwideExpressFreight,
      this.worldwideEconomyDDP,
      this.worldwideEconomyDDU,
      this.Freight,
    );
    const maxValint = Math.max(...this.internationalchargeDesList);
    this.maxValueInt = maxValint + maxValint / 10;

    // Calculate progress bars
    this.GHprogressBar = await this.calcPercent(this.ground_Hundredweight, this.maxValue);
    this.GCprogressBar = await this.calcPercent(this.ground_Commercial, this.maxValue);
    this.GRprogressBar = await this.calcPercent(this.ground_residential, this.maxValue);
    this.Next_dayprogressBar = await this.calcPercent(this.next_day_air, this.maxValue);
    this.Next_day_AMprogressBar = await this.calcPercent(this.next_day_air_AM, this.maxValue);
    this.Next_day_saver_ProgressBar = await this.calcPercent(this.next_day_air_Saver, this.maxValue);
    this.twodayprogressBar = await this.calcPercent(this.two_day, this.maxValue);
    this.three_dayprogressBar = await this.calcPercent(this.three_day, this.maxValue);
    this.surepost_id = await this.calcPercent(this.sure_post, this.maxValue);
    this.twoDayAMProgressBar = await this.calcPercent(this.twoDayAM, this.maxValue);
    this.groundFreightPricingProgressBar = await this.calcPercent(this.groundFreightPricing, this.maxValue);

    this.worldwideExpediteprogressBar = await this.calcPercent(this.worldwideExpedite, this.maxValueInt);
    this.worldwideExpressprogressBar = await this.calcPercent(this.worldwideExpress, this.maxValueInt);
    this.worldwideExpressSaverprogressBar = await this.calcPercent(this.worldwideExpressSaver, this.maxValueInt);
    this.worldwideSaverprogressBar = await this.calcPercent(this.worldwideSaver, this.maxValueInt);
    this.StandardprogressBar = await this.calcPercent(this.Standard, this.maxValueInt);
    this.worldwideExpressPlusprogressBar = await this.calcPercent(this.worldwideExpressPlus, this.maxValueInt);
    this.worldwideExpressFreightprogressBar = await this.calcPercent(this.worldwideExpressFreight, this.maxValueInt);
    this.worldwideEconomyDDPprogressBar = await this.calcPercent(this.worldwideEconomyDDP, this.maxValueInt);
    this.worldwideEconomyDDUprogressBar = await this.calcPercent(this.worldwideEconomyDDU, this.maxValueInt);
    this.FreightprogressBar = await this.calcPercent(this.Freight, this.maxValueInt);

    // Build UI list
    this.progressBarUpsList = [
      { serviceType: 'Ground Commercial', progressBar: this.GCprogressBar, netCharge: this.ground_Commercial, serviceName: 'Ground Commercial' },
      { serviceType: 'Ground Residential', progressBar: this.GRprogressBar, netCharge: this.ground_residential, serviceName: 'Ground Residential' },
      { serviceType: 'Ground Hundredweight', progressBar: this.GHprogressBar, netCharge: this.ground_Hundredweight, serviceName: 'Ground Hundredweight' },
      { serviceType: 'Ground Saver', progressBar: this.surepost_id, netCharge: this.sure_post, serviceName: 'Ground Saver' },
      { serviceType: 'Next Day Air', progressBar: this.Next_dayprogressBar, netCharge: this.next_day_air, serviceName: 'Next Day Air' },
      { serviceType: 'Next Day Air A.M.', progressBar: this.Next_day_AMprogressBar, netCharge: this.next_day_air_AM, serviceName: 'Next Day Air A.M.' },
      { serviceType: 'Next Day Air Saver', progressBar: this.Next_day_saver_ProgressBar, netCharge: this.next_day_air_Saver, serviceName: 'Next Day Air Saver' },
      { serviceType: '2 Day', progressBar: this.twodayprogressBar, netCharge: this.two_day, serviceName: '2 Day' },
      { serviceType: '2 Day AM', progressBar: this.twoDayAMProgressBar, netCharge: this.twoDayAM, serviceName: '2 Day AM' },
      { serviceType: '3 Day', progressBar: this.three_dayprogressBar, netCharge: this.three_day, serviceName: '3 Day' },
      { serviceType: 'Ground (Freight Pricing)', progressBar: this.groundFreightPricingProgressBar, netCharge: this.groundFreightPricing, serviceName: 'Ground (Freight Pricing)' }
    ].sort((a: any, b: any) => b.netCharge - a.netCharge);
    this.domesticGroundService.set(this.progressBarUpsList);

    this.progressBarUpsListInternational = [
      { serviceType: 'Worldwide Expedited', progressBar: this.worldwideExpediteprogressBar, netCharge: this.worldwideExpedite, serviceName: 'Worldwide Expedited' },
      { serviceType: 'Worldwide Express', progressBar: this.worldwideExpressprogressBar, netCharge: this.worldwideExpress, serviceName: 'Worldwide Express' },
      { serviceType: 'Worldwide Express Saver', progressBar: this.worldwideExpressSaverprogressBar, netCharge: this.worldwideExpressSaver, serviceName: 'Worldwide Express Saver' },
      { serviceType: 'Worldwide Saver', progressBar: this.worldwideSaverprogressBar, netCharge: this.worldwideSaver, serviceName: 'Worldwide Saver Standard' },
      { serviceType: 'Standard', progressBar: this.StandardprogressBar, netCharge: this.Standard, serviceName: 'Worldwide Saver Standard' },
      { serviceType: 'Worldwide Express Plus', progressBar: this.worldwideExpressPlusprogressBar, netCharge: this.worldwideExpressPlus, serviceName: 'Worldwide Express Plus' },
      { serviceType: 'Worldwide Express Freight', progressBar: this.worldwideExpressFreightprogressBar, netCharge: this.worldwideExpressFreight, serviceName: 'Worldwide Express Freight' },
      { serviceType: 'Worldwide Economy DDP', progressBar: this.worldwideEconomyDDPprogressBar, netCharge: this.worldwideEconomyDDP, serviceName: 'Worldwide Economy DDP' },
      { serviceType: 'Worldwide Economy DDU', progressBar: this.worldwideEconomyDDUprogressBar, netCharge: this.worldwideEconomyDDU, serviceName: 'Worldwide Economy DDU' },
      { serviceType: 'Freight', progressBar: this.FreightprogressBar, netCharge: this.Freight, serviceName: 'Freight' },
    ].sort((a: any, b: any) => b.netCharge - a.netCharge);
    this.internationGroundService.set(this.progressBarUpsListInternational);
  }

  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
  }
  total_Spend(resultObj: any) {
    var totSpend004AC = [];
    var arrayResult = [];
    this.totalPackageCount.set(0);
    this.totalPackageCost.set(0);
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    //-----------------------Total spend   
    var date = new Date();
    var day = date.getDay();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var monthlastdate: any = this.datePipe.transform(monthStartDay, "MM/dd/yyyy");
    this.dataasof = this.userProfifle[0].dataasof;
    let dataVal: any = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");
    this.dataasoffFormat = new Date(dataVal);
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
        this.chargetypevalue.set("SHP_FRT+ACC");
      }
      if (t004Obj.chargeType == chargetypevalue) {
        var year_Select = this.clientProfileFormGroup.get('year')?.value;
        var totcount: any = Number(t004Obj.totalSpentCount) || 0;
        // this.totalPackageCount.set(+= Number(totcount));//9126
        this.totalPackageCount.update(v => v + (Number(totcount) || 0));
        var totValue: any = Number(t004Obj.netCharge) || 0;
        this.totalPackageCost.update(v => v + (Number(totValue) || 0));
        if (t004Obj.month == "1") {
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
          if (totcount == "0.00" && totValue == "0.00") {
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
    const result = totSpend004AC;
    arrayResult.push(result);
    this.totalSpandUps(arrayResult);
  }
  async clickTotalspend(action: string) {
    console.log("clickTotalspend");
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const urlParam = {
      fromdate: today,
      todate: today,
      action,
      year: this.clientProfileFormGroup.get('year')?.value,
      chargemonth: this.clientProfileFormGroup.get('month')?.value ?? '0',
      clientId: this.clientProfileFormGroup.get('clientId')?.value,
      chargetyperesult: this.dashBoardSHP.get('chargetypevalue')?.value
    };
    const fields_string = Object.entries(urlParam)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    this.httpClientService.reportServlet(fields_string);
  }

  async totalSpandUps(resultData: any) {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);

    chart.colors.step = 2;
    chart.maskBullets = false;
    // Add data
    resultData[0].forEach((item: any) => {
      item.AvgCost = item.Count && Number(item.Count) !== 0
        ? item.NetAmount / item.Count
        : Number(item.NetAmount) !== 0 && Number(item.Count) === 0 ? 0.00 : null;
    });
    chart.data = resultData[0];

    var minNegVal = false;
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
    NetAmountAxis.renderer.labels.template.adapter.add("text", function (text) {
      return "$" + text;
    });
    var avgCostAxis = chart.yAxes.push(new am4charts.ValueAxis());
    avgCostAxis.title.text = "Avg Cost / Package ($)";
    avgCostAxis.renderer.opposite = true;
    avgCostAxis.renderer.grid.template.disabled = true;
    avgCostAxis.min = 0;
    avgCostAxis.renderer.labels.template.adapter.add("text", function (text) {
      return "$" + text;
    });
    // Create series
    var distanceSeries: any = chart.series.push(new am4charts.ColumnSeries());
    distanceSeries.dataFields.valueY = "NetAmount";
    distanceSeries.dataFields.dateX = "Month";
    distanceSeries.yAxis = NetAmountAxis;
    distanceSeries.name = "Net Charge";
    distanceSeries.columns.template.fillOpacity = 0.8;
    distanceSeries.columns.template.fill = am4core.color("#1AA7E8");
    distanceSeries.columns.template.stroke = am4core.color("#1AA7E8");
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



  private setYearDefaults(value: string) {
    this.yearGrosschargecurrent = value;
    this.yearNetchargecurrent = value;
    this.yearCostperPackagecurrent = value;
    this.yearcostperlbcurrent = value;
    this.yearEnteredWeightcurrent = value;
    this.yearbilledWeightcurrent = value;
    this.yearScccurrent = value;
    this.yearWeightdifferencecurrent = value;
    this.yearGrosschargeFRTcurrent = value;
    this.yearNetchargeFRTcurrent = value;
    this.yearCostperpackageFRTcurrent = value;
  }

  fetchT004Rymax_resultcurrent(event: any[]) {

    // Default values
    const zero = "0.00";

    if (!event || event.length === 0) {
      this.setYearDefaults(zero);
      return;
    }

    // Assuming latest / current year record is last
    const t004Obj = event[event.length - 1];

    const dashboardData = {
      yearGrossCharge: t004Obj.yearGrossCharge,
      yearNetcharge: t004Obj.yearNetcharge,
      yearCostperPackage: t004Obj.yearCostperPackage,
      yearcostperlb: t004Obj.yearcostperlb,
      yearEnteredWeight: t004Obj.yearEnteredWeight,
      yearbilledWeight: t004Obj.yearbilledWeight,
      yearScc: t004Obj.yearScc,
      yearWeightdifference: t004Obj.yearWeightdifference,
      yearGrosschargeFRT: t004Obj.yearGrosschargeFRT,
      yearNetchargeFRT: t004Obj.yearNetchargeFRT,
      yearCostperpackageFRT: t004Obj.yearCostperpackageFRT
    };

    // Store YTD object
    this.tempPanel2_Object_YTD_Billed = dashboardData;

    // YTD temp values
    this.tempnetchargeYTD = t004Obj.yearNetcharge;
    this.tempyearNetchargeFRT = t004Obj.yearNetchargeFRT;
    this.tempyearcostperpackageYTD = t004Obj.yearCostperPackage;
    this.tempyearcostperpackageFRT = t004Obj.yearCostperpackageFRT;
    this.tempyearcostperlbYTD = t004Obj.yearcostperlb;
    this.tempyearcostperlbFRT = t004Obj.yearCostperlbFRT;
    this.tempyearbilledweightYTD = t004Obj.yearbilledWeight;
    this.tempyearenteredWeightYTD = t004Obj.yearEnteredWeight;
    this.tempyearsccYTD = t004Obj.yearScc;
    this.tempyearweightdiffYTD = t004Obj.yearWeightdifference;

    // Current Year display values
    this.yearGrosschargecurrent = dashboardData.yearGrossCharge;
    this.yearNetchargecurrent = dashboardData.yearNetcharge;
    this.yearCostperPackagecurrent = dashboardData.yearCostperPackage;
    this.yearcostperlbcurrent = dashboardData.yearcostperlb;
    this.yearEnteredWeightcurrent = dashboardData.yearEnteredWeight;
    this.yearbilledWeightcurrent = dashboardData.yearbilledWeight;
    this.yearScccurrent = dashboardData.yearScc;
    this.yearWeightdifferencecurrent = dashboardData.yearWeightdifference;
    this.yearGrosschargeFRTcurrent = dashboardData.yearGrosschargeFRT;
    this.yearNetchargeFRTcurrent = dashboardData.yearNetchargeFRT;
    this.yearCostperpackageFRTcurrent = dashboardData.yearCostperpackageFRT;
  }
  tempPanel2_Object_YTD_Billed: any;
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
  totalPackageCount = signal<any>(0);
  totalPackageCost = signal<any>(0);
  dataasof: any;
  dataasoffFormat: any;
  totalMonthZoneValue: any;
  totSpend004AC: any;
  totalspendAcValue: any;
  flag = 0;
  weight_mainAC: Record<string, any>[] = [];
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
  Column_EnteredAC: any[] = [];
  Panel2_Object: any = [];
  tempPanel2_Object_YTD: any;
  t004reymax_by_year_resultAC: Record<string, any>[] = [];
  weightyear: any;
  weightbox: any;
  dimensionyear: any;
  netcharge_year: any;
  netcharge: any;
  costperpackage_year: any;
  costperpackage: any;
  dim_id_text: any;
  dimyear_id_text: any;
  dimension: any;
  chargeTitle: any;
  // async fetchT004Rymax_by_year_result(event: any) {
  //   const clickedYear = this.clientProfileFormGroup.get('year')?.value;
  //   this.flag = 1;

  //   this.year_Select = clickedYear;
  //   this.t004reymax_by_year_resultAC = event || [];

  //   if (this.t004reymax_by_year_resultAC.length > 0) {
  //     // Add "year" ServiceType
  //     this.t004reymax_by_year_resultAC.push({ ServiceType: "year" });
  //     this.weight_mainAC = this.t004reymax_by_year_resultAC;

  //     // Call weight display
  //     this.weight_Dis(this.t004reymax_by_year_resultAC, "year");

  //     const t004DashBoardObj: any = this.t004reymax_by_year_resultAC[0];

  //     // Initialize previous year values (example: for 2020)
  //     if (t004DashBoardObj.year === "2020") {
  //       this.tempnetchargeYTD = t004DashBoardObj.yearNetcharge;
  //       this.tempyearNetchargeFRT = t004DashBoardObj.yearNetchargeFRT;
  //       this.tempyearcostperpackageYTD = t004DashBoardObj.yearCostperPackage;
  //       this.tempyearcostperpackageFRT = t004DashBoardObj.yearCostperpackageFRT;
  //       this.tempyearcostperlbYTD = t004DashBoardObj.yearcostperlb;
  //       this.tempyearcostperlbFRT = t004DashBoardObj.yearCostperlbFRT;
  //       this.tempyearbilledweightYTD = t004DashBoardObj.yearbilledWeight;
  //       this.tempyearenteredWeightYTD = t004DashBoardObj.yearEnteredWeight;
  //       this.tempyearsccYTD = t004DashBoardObj.yearScc;
  //       this.tempyearweightdiffYTD = t004DashBoardObj.yearWeightdifference;
  //     }

  //     // Consolidate YTD and current values
  //     const ytdFields = [
  //       "Netcharge", "NetchargeFRT", "CostperPackage", "CostperpackageFRT",
  //       "costperlb", "CostperlbFRT", "billedWeight", "yearEnteredWeight",
  //       "Scc", "Weightdifference"
  //     ];

  //     ytdFields.forEach(field => {
  //       const tempKey = `tempyear${field}YTD` as keyof UpsDashboardComponent;
  //       const yearKey = `year${field}` as keyof typeof t004DashBoardObj;

  //       t004DashBoardObj[tempKey] =
  //         (this[tempKey] ?? t004DashBoardObj[yearKey]) as any;

  //       // t004DashBoardObj[`tempyear${field}YTD`] = this[`tempyear${field}YTD`] ?? t004DashBoardObj[`year${field}`];
  //     });

  //     // Current year values
  //     t004DashBoardObj.yearGrossCharge = this.yearGrosschargecurrent;
  //     t004DashBoardObj.yearGrosschargeFRT = this.yearGrosschargeFRTcurrent;
  //     t004DashBoardObj.yearNetcharge = this.tempnetchargeYTD;
  //     t004DashBoardObj.yearNetchargeFRT = this.tempyearNetchargeFRT;
  //     t004DashBoardObj.yearCostperPackage = this.tempyearcostperpackageYTD;
  //     t004DashBoardObj.yearCostperpackageFRT = this.tempyearcostperpackageFRT;
  //     t004DashBoardObj.yearcostperlb = this.tempyearcostperlbYTD;
  //     t004DashBoardObj.yearCostperlbFRT = this.tempyearcostperlbFRT;
  //     t004DashBoardObj.yearEnteredWeight = this.tempyearenteredWeightYTD;
  //     t004DashBoardObj.yearbilledWeight = this.tempyearbilledweightYTD;
  //     t004DashBoardObj.yearScc = this.tempyearsccYTD;
  //     t004DashBoardObj.yearWeightdifference = this.tempyearweightdiffYTD;

  //     // Assign to panels and columns
  //     this.Column_EnteredAC = [t004DashBoardObj];
  //     this.Panel2_Object = t004DashBoardObj;
  //     this.tempPanel2_Object_YTD = t004DashBoardObj;

  //     // Map variables to UI labels
  //     const uiMappings: Record<string, string> = {
  //       billedweight_lbl_text: 'weightyear',
  //       billed_weight_lbl_text: 'weightboxtemp',
  //       dim_id_text: 'dimension',
  //       dimyear_id_text: 'dimensionyear',
  //       net_transporation_ytd_lbl_text: 'netcharge_year',
  //       net_transporation_lbl_text: 'netcharge',
  //       costperpackage_ytd_lbl_text: 'costperpackage_year',
  //       costperpackage_lbl_text: 'costperpackage'
  //     };

  //     for (const [label, value] of Object.entries(uiMappings) as [string, string][]) {
  //       (this as Record<string, any>)[label] =
  //         (this as Record<string, any>)[value] ?? '0';
  //     }

  //     // Tooltip mapping
  //     t004DashBoardObj.tempyearbilledWeightYTD = this.weightyear;
  //     t004DashBoardObj.billedWeight = this.weightbox;
  //     t004DashBoardObj.tempyearNetchargeForYTD = this.netcharge_year;
  //     t004DashBoardObj.netCharge = this.netcharge;
  //     t004DashBoardObj.tempyearCostperPackageYTD = this.costperpackage_year;
  //     t004DashBoardObj.costperPackage = this.costperpackage;

  //     // Set client info
  //     this.clientID = this.userProfifle[0]?.clientId;
  //     const clientName = this.userProfifle[0]?.clientName;
  //     this.clientProfileFormGroup.get('year')?.setValue(this.currentyear ?? clickedYear);
  //     this.clientProfileFormGroup.get('month')?.setValue(null);
  //     this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);

  //     // Column chart labels
  //     this.dim_id_text = this.dimension ?? "$0.00";
  //     this.dimyear_id_text = this.dimensionyear ?? "$0.00";

  //     // Load charge back function
  //     this.chargeBackLoadFunction(clickedYear, `${this.clientID}`, "0", clientName);
  //     this.loaderService.hide();
  //   } else {
  //     // No data scenario
  //     this.clientID = this.userProfifle[0]?.clientId;
  //     this.chargeBackLoadFunction(clickedYear, `${this.clientID}`, "0", this.userProfifle[0]?.clientName);
  //     this.openModal("No Record Found");
  //     this.loaderService.hide();
  //     this.closeLoading();
  //   }

  //   this.bindingTitle();
  // }
  weightboxtemp: any;
  async fetchT004Rymax_by_year_result(event: any) {

    var clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    this.flag = 1;
    var weightbox = null;
    var tempweightyear = null;
    var tempweightbox = null;
    var netcharge = null;
    var costperpackage = null;
    var tempnetcharge_year = null;
    var tempnetcharge = null;
    var tempcostperpackage_year = null;
    var tempcostperpackage = null;
    var t004DashBoardObj: any = [];
    this.year_Select = await this.clientProfileFormGroup.get('year')?.value;
    this.t004reymax_by_year_resultAC = await event;
    if (this.t004reymax_by_year_resultAC != undefined && this.t004reymax_by_year_resultAC.length > 0) {
      var typeObject: any = {};
      var tempt004DashBoardObj: any = {};
      typeObject["ServiceType"] = "year";
      await this.t004reymax_by_year_resultAC.push(typeObject);

      this.weight_mainAC = await this.t004reymax_by_year_resultAC;
      this.weight_Dis(this.t004reymax_by_year_resultAC, "year");
    } else {
      this.t004reymax_by_year_resultAC = [];
      this.weight_Dis(this.t004reymax_by_year_resultAC, "year");
    }

    if (this.t004reymax_by_year_resultAC != undefined && this.t004reymax_by_year_resultAC.length > 0) {
      t004DashBoardObj = await this.t004reymax_by_year_resultAC[0];


      /* change the year previous year at new year starts*/
      if (t004DashBoardObj["year"] == "2020") {
        //for ytd
        this.tempnetchargeYTD = t004DashBoardObj["yearNetcharge"];
        this.tempyearNetchargeFRT = t004DashBoardObj["yearNetchargeFRT"];
        this.tempyearcostperpackageYTD = t004DashBoardObj["yearCostperPackage"];
        this.tempyearcostperpackageFRT = t004DashBoardObj["yearCostperpackageFRT"];
        this.tempyearcostperlbYTD = t004DashBoardObj["yearcostperlb"];
        this.tempyearcostperlbFRT = t004DashBoardObj["yearCostperlbFRT"];
        this.tempyearbilledweightYTD = t004DashBoardObj["yearbilledWeight"];
        this.tempyearenteredWeightYTD = t004DashBoardObj["yearEnteredWeight"];
        this.tempyearsccYTD = t004DashBoardObj["yearScc"];
        this.tempyearweightdiffYTD = t004DashBoardObj["yearWeightdifference"];
      }


      //settign the Right hand side in the column chart 
      var monthflog = await this.clientProfileFormGroup.get("month")?.value;

      //settign the Left  hand side in the column chart 


      t004DashBoardObj["tempyearNetchargeForYTD"] = this.tempnetchargeYTD;
      t004DashBoardObj["tempyearNetchargeForYTDFRT"] = this.tempyearNetchargeFRT;
      t004DashBoardObj["tempyearCostperPackageYTD"] = this.tempyearcostperpackageYTD;
      t004DashBoardObj["tempyearCostperpackageYTDFRT"] = this.tempyearcostperpackageFRT;
      t004DashBoardObj["tempyearcostperlbYTD"] = this.tempyearcostperlbYTD;
      t004DashBoardObj["tempyearcostperlbFRT"] = this.tempyearcostperlbFRT;
      t004DashBoardObj["tempyearbilledWeightYTD"] = this.tempyearbilledweightYTD;
      t004DashBoardObj["tempyearEnteredWeightYTD"] = this.tempyearenteredWeightYTD;
      t004DashBoardObj["tempyearSccYTD"] = this.tempyearsccYTD;
      t004DashBoardObj["tempyearWeightdiffYTD"] = this.tempyearweightdiffYTD;


      t004DashBoardObj["yearGrossCharge"] = this.yearGrosschargecurrent;
      t004DashBoardObj["yearNetcharge"] = this.tempnetchargeYTD;
      t004DashBoardObj["yearCostperPackage"] = this.tempyearcostperpackageYTD;
      t004DashBoardObj["yearcostperlb"] = this.tempyearcostperlbYTD;
      t004DashBoardObj["yearEnteredWeight"] = this.tempyearenteredWeightYTD;
      t004DashBoardObj["yearbilledWeight"] = this.tempyearbilledweightYTD;
      t004DashBoardObj["yearScc"] = this.tempyearsccYTD;
      t004DashBoardObj["yearWeightdifference"] = this.tempyearweightdiffYTD;
      t004DashBoardObj["yearGrosschargeFRT"] = this.yearGrosschargeFRTcurrent;
      t004DashBoardObj["yearNetchargeFRT"] = this.tempyearNetchargeFRT;
      t004DashBoardObj["yearCostperpackageFRT"] = this.tempyearcostperpackageFRT;
      t004DashBoardObj["yearCostperlbFRT"] = this.tempyearcostperlbFRT;

      var current_monthAC = [];
      current_monthAC.push(t004DashBoardObj);

      this.Column_EnteredAC = current_monthAC;

      this.Panel2_Object = t004DashBoardObj;
      this.tempPanel2_Object_YTD = {};
      this.tempPanel2_Object_YTD = t004DashBoardObj;

      tempweightyear = this.Panel2_Object["yearbilledWeight"];
      tempweightbox = this.Panel2_Object["billedWeight"];
      var tempdimension = this.Panel2_Object["scc"];
      var tempdimensionyear = this.Panel2_Object["yearScc"];

      tempnetcharge = this.Panel2_Object["netCharge"];
      tempcostperpackage = this.Panel2_Object["costperPackage"];
      tempnetcharge_year = this.Panel2_Object["yearNetcharge"];
      tempcostperpackage_year = this.Panel2_Object["yearCostperPackage"];

      this.weightyear = tempweightyear;
      this.weightbox = tempweightbox;
      this.dimension = tempdimension;
      this.dimensionyear = tempdimensionyear;
      this.weightboxtemp = weightbox;

      netcharge = tempnetcharge;
      costperpackage = tempcostperpackage;
      this.netcharge_year = tempnetcharge_year;
      this.costperpackage_year = tempcostperpackage_year;

      if (this.weightyear == undefined)
        this.billedweight_lbl_text = "" + "0";
      else
        this.billedweight_lbl_text = "" + this.weightyear;
      if (weightbox == undefined)
        this.billed_weight_lbl_text = "" + "0";
      else
        this.billed_weight_lbl_text = "" + this.weightbox;

      if (this.netcharge_year == undefined)
        this.net_transporation_ytd_lbl_text = "" + "0";
      else
        this.net_transporation_ytd_lbl_text = "" + this.netcharge_year;
      if (netcharge == null)
        this.net_transporation_lbl_text = "" + "0";
      else
        this.net_transporation_lbl_text = "" + this.netcharge;

      if (this.costperpackage_year == undefined)
        this.costperpackage_ytd_lbl_text = "" + "0";
      else
        this.costperpackage_ytd_lbl_text = "" + this.costperpackage_year;
      if (costperpackage == null)
        this.costperpackage_lbl_text = "" + "0";
      else
        this.costperpackage_lbl_text = "" + this.costperpackage;

      //tool tip
      t004DashBoardObj["tempyearbilledWeightYTD"] = this.weightyear;
      t004DashBoardObj["billedWeight"] = this.weightbox;
      t004DashBoardObj["tempyearNetchargeForYTD"] = this.netcharge_year;
      t004DashBoardObj["netCharge"] = netcharge;
      t004DashBoardObj["tempyearCostperPackageYTD"] = this.costperpackage_year;
      t004DashBoardObj["costperPackage"] = costperpackage;
      //end
      if (this.currentyear == undefined) {
        this.currentyear = this.clientProfileFormGroup.get('year')?.value;
      }

      this.clientID = await this.userProfifle[0].clientId;
      var clientName = await this.userProfifle[0].clientName;
      await this.clientProfileFormGroup.get('year')?.setValue(this.currentyear);
      await this.clientProfileFormGroup.get('month')?.setValue(null);
      await this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
      //-------------T004_Dashboard Table for TotalSpend
      if (this.dimension == undefined)
        this.dim_id_text = "$0.00" + "";
      else
        this.dim_id_text = this.dimension;

      if (this.dimensionyear == undefined)
        this.dimyear_id_text = "$0.00" + "";
      else
        this.dimyear_id_text = this.dimensionyear;
      this.chargeBackLoadFunction(clickedYear, this.clientID + "", "0", clientName);
    } else {
      this.clientID = await this.userProfifle[0].clientId;
      this.chargeBackLoadFunction(clickedYear, this.clientID + "", "0", this.userProfifle[0].clientName);
      if (this.previousClickedYear != undefined && this.previousClickedMonth == 0) {
        this.clickedYear = this.previousClickedYear;
        this.clickedMonth = this.previousClickedMonth;
      }
      if (this.previousClickedMonth != 0 && this.t004reymax_by_year_resultAC.length > 0) { //modified by 9126
        this.clickedMonth = this.previousClickedMonth;
        this.clickedYear = this.previousClickedYear;
        this.loadMonthFunction(this.clickedMonth + "");
        var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
        var monthTansArray = new Array("All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var monthnumber = Number(this.clickedMonth);
        if (monthnumber == 0)
          this.dashBoardLable = this.clickedYear
        else
          this.dashBoardLable = this.clickedYear + " " + monthArray[monthnumber];
        this.transportationLable = monthTansArray[monthnumber];
        tempweightbox = tempt004DashBoardObj["billedWeight"];
        tempdimension = tempt004DashBoardObj["scc"];
        this.weightyear = this.tempPanel2_Object_YTD_Billed["yearbilledWeight"];
        weightbox = tempweightbox;

        tempnetcharge = tempt004DashBoardObj["netCharge"];
        tempcostperpackage = tempt004DashBoardObj["costperPackage"];
        this.netcharge_year = this.tempPanel2_Object_YTD_Billed["yearNetcharge"];
        this.costperpackage_year = this.tempPanel2_Object_YTD_Billed["yearCostperPackage"];
        netcharge = tempnetcharge;
        costperpackage = tempcostperpackage;

        if (this.weightyear == undefined)
          this.billedweight_lbl_text = "" + "0";
        else
          this.billedweight_lbl_text = "" + this.weightyear;
        if (weightbox == null)
          this.billed_weight_lbl_text = "" + "0";
        else
          this.billed_weight_lbl_text = "" + weightbox;

        if (this.dimension == undefined)
          this.dim_id_text = "$0.00" + "";
        else
          this.dim_id_text = this.dimension;
        if (this.dimensionyear == undefined)
          this.dimyear_id_text = "$0.00" + "";
        else
          this.dimyear_id_text = this.dimensionyear;

        if (this.netcharge_year == undefined)
          this.net_transporation_ytd_lbl_text = "" + "0";
        else
          this.net_transporation_ytd_lbl_text = "" + this.netcharge_year;
        if (netcharge == null)
          this.net_transporation_lbl_text = "" + "0";
        else
          this.net_transporation_lbl_text = "" + this.netcharge;

        if (this.costperpackage_year == undefined)
          this.costperpackage_ytd_lbl_text = "" + "0";
        else
          this.costperpackage_ytd_lbl_text = "" + this.costperpackage_year;
        if (costperpackage == null)
          this.costperpackage_lbl_text = "" + "0";
        else
          this.costperpackage_lbl_text = "" + costperpackage;

        var monthArraycolumn = new Array("All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var monthnumbercolumn = Number(this.clickedMonth);
        this.column_month_text = "" + monthArraycolumn[monthnumbercolumn - 1];
        this.cost_firstcolumn_text = "" + monthArraycolumn[monthnumbercolumn - 1];
        this.cost_perlb_text = "" + monthArraycolumn[monthnumbercolumn - 1];
        this.billed_weight_text = "" + monthArraycolumn[monthnumbercolumn - 1];
        this.scc_charge_text = "" + monthArraycolumn[monthnumbercolumn - 1];

      }


      if (this.weightyear == undefined)
        this.billedweight_lbl_text = "" + 0;
      else
        this.billedweight_lbl_text = "" + this.weightyear;
      if (this.weightboxtemp == undefined)
        this.billed_weight_lbl_text = "" + 0;
      else
        this.billed_weight_lbl_text = "" + this.weightboxtemp;
      if (this.dimension == undefined)
        this.dim_id_text = "$0.00" + "";
      else
        this.dim_id_text = this.dimension;
      if (this.dimensionyear == undefined)
        this.dimyear_id_text = "$0.00" + "";
      else
        this.dimyear_id_text = this.dimensionyear;

      if (this.netcharge_year == undefined)
        this.net_transporation_ytd_lbl_text = "" + "0";
      else
        this.net_transporation_ytd_lbl_text = "" + this.netcharge_year;
      if (netcharge == null)
        this.net_transporation_lbl_text = "" + "0";
      else
        this.net_transporation_lbl_text = "" + netcharge;

      if (this.costperpackage_year == undefined)
        this.costperpackage_ytd_lbl_text = "" + "0";
      else
        this.costperpackage_ytd_lbl_text = "" + this.costperpackage_year;
      if (costperpackage == undefined)
        this.costperpackage_lbl_text = "" + "0";
      else
        this.costperpackage_lbl_text = "" + costperpackage;

      this.openModal("No Record Found");
      this.closeLoading();
      return;
    }
    this.bindingTitle();
  } column_month_text: any;
  cost_firstcolumn_text: any;
  cost_perlb_text: any;
  billed_weight_text: any;
  scc_charge_text: any;
  async weight_Dis(arrayAC: any[], event_type: string) {
    const domain_Name = 'T004_Dashboard';
    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;

    await this.weight_chart(domain_Name, arrayAC, chargetypevalue, event_type, "Bar");
  }
  async weight_chart(domainName: any, tempAC: any, chargetypevalue: any, event_type: any, field1: any) {
    await this.createSeriesFromAC(domainName, tempAC, chargetypevalue, event_type, "Bar", '', '');
  }
  weight_disTotalvalue = signal<any>(0);
  clickedYear: any;
  async createSeriesFromAC(
    domainName: string,
    collectionAC: any[],
    chargetypevalue: string,
    event_type: string,
    seriesName: string,
    type: string,
    palette = 'Default'
  ) {

    let totalValue: any = 0;
    this.clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    if (collectionAC.length > 0) {
      if ((chargetypevalue == "SHP_FRT" && event_type == "month") || (chargetypevalue == "SHP_FRT" && event_type == "year")) {
        var tempObj = collectionAC[0];
      } else if ((chargetypevalue == "SHP_FRT+ACC" || chargetypevalue == null) && (event_type == "month")) {
        tempObj = collectionAC[1];
      } else {
        tempObj = collectionAC[12];
      }
    }
    let chartData: any[] = [];
    if (tempObj != undefined) {
      if (tempObj != null && event_type == "month") {
        chartData = [{
          "weight": "0-16\nOz",
          "value": tempObj.less16ounds
        },
        {
          "weight": "LTR",
          "value": tempObj.less0s
        },
        {
          "weight": "1",
          "value": tempObj.less1s
        },
        {
          "weight": "2",
          "value": tempObj.less2s
        },
        {
          "weight": "3",
          "value": tempObj.less3s
        },
        {
          "weight": "4",
          "value": tempObj.less4s
        },
        {
          "weight": "5",
          "value": tempObj.less5s
        },
        {
          "weight": "6-10",
          "value": tempObj.less10s
        },
        {
          "weight": "11-20",
          "value": tempObj.less20s
        },
        {
          "weight": "21-30",
          "value": tempObj.less30s
        },
        {
          "weight": "31-50",
          "value": tempObj.less50s
        },
        {
          "weight": "51-70",
          "value": tempObj.less70s
        },
        {
          "weight": "71-150",
          "value": tempObj.less150s
        },
        {
          "weight": "150+",
          "value": tempObj.less150plus
        }
        ]

        if (((this.clickedYear == "2020") || (this.clickedYear == "2019") || (this.clickedYear == "2018") || (this.clickedYear == "2017") || (this.clickedYear == "2016")) && event_type != "month") {
          totalValue += Number(tempObj.less16ounds);
          totalValue += Number(tempObj.less1s);
          totalValue += Number(tempObj.less2s);
          totalValue += Number(tempObj.less3s);
          totalValue += Number(tempObj.less4s);

          totalValue += Number(tempObj.less5s);
          totalValue += Number(tempObj.less10s);
          totalValue += Number(tempObj.less20s);
          totalValue += Number(tempObj.less30s);
          totalValue += Number(tempObj.less50s);
          totalValue += Number(tempObj.less70s);
          totalValue += Number(tempObj.less150s);
          totalValue += Number(tempObj.less150plus);

          var invoiceMonth = this.clientProfileFormGroup.get('month')?.value
          if (this.totSpend004AC != undefined && this.totSpend004AC.length != 0) {
            for (var count = 0; count < this.totSpend004AC.length; count++) {
              if (chargetypevalue == this.totSpend004AC[count].chargeType) {
                if (this.totSpend004AC[count].month == invoiceMonth) {
                  setTimeout(() => { this.totalvaluezone = this.totSpend004AC[count].netCharge; }, 0);
                  totalValue = this.totSpend004AC[count].netCharge;
                }
              }

            }
          }

        } else {
          if (this.totSpend004AC != null && this.totSpend004AC.length != 0) {


            var invoiceMonth = this.clientProfileFormGroup.get('month')?.value;
            for (var count = 0; count < this.totSpend004AC.length; count++) {
              if (chargetypevalue == this.totSpend004AC[count].chargeType) {
                if (this.totSpend004AC[count].month == invoiceMonth) {
                  totalValue = this.totSpend004AC[count].netCharge;
                }
              }

            }
          }
        }

      }
      else {
        chartData = [{
          "weight": "0-16\nOz",
          "value": tempObj.yearless16ounds
        },
        {
          "weight": "LTR",
          "value": tempObj.yearless0s
        },
        {
          "weight": "1",
          "value": tempObj.yearless1s
        },
        {
          "weight": "2",
          "value": tempObj.yearless2s
        },
        {
          "weight": "3",
          "value": tempObj.yearless3s
        },
        {
          "weight": "4",
          "value": tempObj.yearless4s
        },
        {
          "weight": "5",
          "value": tempObj.yearless5s
        },
        {
          "weight": "6-10",
          "value": tempObj.yearless10s
        },
        {
          "weight": "11-20",
          "value": tempObj.yearless20s
        },
        {
          "weight": "21-30",
          "value": tempObj.yearless30s
        },
        {
          "weight": "31-50",
          "value": tempObj.yearless50s
        },
        {
          "weight": "51-70",
          "value": tempObj.yearless70s
        },
        {
          "weight": "71-150",
          "value": tempObj.yearless150s
        },
        {
          "weight": "151+",
          "value": tempObj.yearless150plus
        }
        ];

        if ((this.clickedYear == "2020") || (this.clickedYear == "2019") || (this.clickedYear == "2018") || (this.clickedYear == "2017") || (this.clickedYear == "2016")) {

          totalValue += Number(tempObj.yearless16ounds);
          totalValue += Number(tempObj.yearless1s);
          totalValue += Number(tempObj.yearless2s);
          totalValue += Number(tempObj.yearless3s);
          totalValue += Number(tempObj.yearless4s);

          totalValue += Number(tempObj.yearless5s);
          totalValue += Number(tempObj.yearless10s);
          totalValue += Number(tempObj.yearless20s);
          totalValue += Number(tempObj.yearless30s);
          totalValue += Number(tempObj.yearless50s);
          totalValue += Number(tempObj.yearless70s);
          totalValue += Number(tempObj.yearless150s);
          totalValue += Number(tempObj.yearless150plus);

        } else {
          totalValue = this.totalPackageCost();
        }

      }
    }
    this.weight_disTotalvalue.set(totalValue);

    // -------------------------------------------------
    // RENDER 2D AMCHARTS (NO 3D)
    // -------------------------------------------------
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    // 🔴 IMPORTANT CHANGE: XYChart (NOT XYChart)
    const chart = am4core.create('weight_dis', am4charts.XYChart);
    chart.data = chartData;
    chart.padding(10, 10, 10, 10);
    // Check for negative values
    const minNegVal = chartData.some((item: any) => item.value < 0);
    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "weight";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.visible = false;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", text => "$" + text);
    valueAxis.cursorTooltipEnabled = false;
    if (!minNegVal) valueAxis.min = 0;

    const barColors = [
      '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
      '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
      '#E07877', '#E09776', '#F4C5B0', '#F3B777',
      '#F5C7A0', '#F6D3B8'
    ];

    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "weight";
    series.tooltipText = "Weight: [bold]{categoryX}[/]\nNet Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
    series.columns.template.fillOpacity = 1;
    series.tooltip!.autoTextColor = false;
    series.tooltip!.label.fill = am4core.color("#ffffff");
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    // columnTemplate.adapter.add("fill", (fill, target: any) => chart.colors.getIndex(target.dataItem.index));
    // columnTemplate.adapter.add("stroke", (stroke, target: any) => chart.colors.getIndex(target.dataItem.index));

    series.columns.template.adapter.add('fill', (_: any, target: any) => {
      return am4core.color(barColors[target.dataItem.index % barColors.length]);
    });
    // Dark mode styling
    if (this.themeoption === "dark") {
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
    if (this.themeoption === 'dark') {
      categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
      valueAxis.renderer.labels.template.fill = am4core.color('#fff');
      valueAxis.title.fill = am4core.color('#fff');
    }
  }






  bindingTitle() {
    this.closeLoading();
    const year = this.clientProfileFormGroup.get('year')?.value;
    const month = this.clientProfileFormGroup.get('month')?.value;
    const chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;

    this.yearBindingTitle.set(year);
    this.chargeTitle = chargeType;

    // Month title
    if (month == null) {
      this.monthBindingTitle.set('');
    } else {
      const monthArray = [
        'All', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      this.monthBindingTitle.set(monthArray[month] || '');
    }

    // Charge type title
    this.frtaccBindingTitle.set(chargeType === 'SHP_FRT' ? ' ( FRT only )' : '');

    // Theme class
    this.panelClass = this.themeoption === 'dark'
      ? 'page-dark'
      : 'custom-dialog-panel-class';
  }

  async getuserProfile(): Promise<any[]> {
    const result = await this.commonService.getUserprofileData();
    this.clientProfileList = result;
    return result;
  }



  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }


  private _filter(value: string): string[] {
    const filterValue = value;
    return this.Accountoptions.filter((option: any) => option.includes(filterValue));
  }
  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }
  async chargeBackLoadFunction(
    year: string,
    clientId: string,
    month: string,
    clientName: string
  ): Promise<void> {

    this.updateClientProfileForm(year, clientId, month, clientName);

    this.clientProfileFormGroup
      .get('chargeDescription')
      ?.setValue(this.userProfifle[0]?.charges);

    await this.fetchT004Rymax_chargeBack();
    await this.fetchT004Rymax_chargeBack_Piechart();

    if (this.zoneflag === 0) {
      await this.fetchallzone();
    }
  }
  allzonefrtaccAC: any = [];
  fetchallzone(): void {
    this.httpClientService
      .fetchallzone(this.clientProfileFormGroup.value)
      .subscribe({
        next: (result: any) => {
          this.allzonefrtaccAC = result;
          this.createSeriesFromAC_morezone(result);
        },
        error: (err: any) => {
          console.error('fetchallzone failed', err);
        }
      });
  }
  async createSeriesFromAC_morezone(collection: any) {

    setTimeout(() => { this.totalvaluezone = 0; }, 0);

    if (!collection || collection.length === 0) {
      return;
    }

    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;

    // ---------------------------------------------------
    // Select correct object
    // ---------------------------------------------------
    const tempObj =
      (chargetypevalue === undefined || chargetypevalue === 'SHP_FRT+ACC')
        ? collection[0]
        : collection[1];

    if (!tempObj) {
      return;
    }

    // ---------------------------------------------------
    // Helper to safely convert to number
    // ---------------------------------------------------
    const num = (val: any): number => {
      const n = Number(val);
      return isNaN(n) ? 0 : n;
    };

    // ---------------------------------------------------
    // Build zone objects (ALL SAFE)
    // ---------------------------------------------------
    const zone2 = {
      name: 'Ground',
      value: num(tempObj.zone2) + num(tempObj.zone9),
      category: 'Ground'
    };

    const zone3 = {
      name: 'Ground Saver',
      value: num(tempObj.zone3),
      category: 'Ground Saver'
    };

    const zone51 = {
      name: 'Standard to \n Canada',
      value: num(tempObj.zone51),
      category: 'Standard to Canada'
    };

    const zone100 = {
      name: 'Next Day \n Air',
      value: num(tempObj.zone100),
      category: 'Next Day Air'
    };

    const zone200 = {
      name: '2 DAY',
      value: num(tempObj.zone200),
      category: '2Day Air'
    };

    const zone300 = {
      name: '3 DAY',
      value: num(tempObj.zone300),
      category: '3Day Air'
    };

    const zone900 = {
      name: 'WW \n Express',
      value: num(tempObj.zone900),
      category: 'Worldwide Express'
    };

    const zone400 = {
      name: 'WW \n Saver',
      value: num(tempObj.zone400),
      category: 'Worldwide Saver'
    };

    const zone600 = {
      name: 'WW \n Expedited',
      value: num(tempObj.zone600),
      category: 'Worldwide Expedited'
    };

    // ---------------------------------------------------
    // Calculate total value (month / year logic)
    // ---------------------------------------------------
    this.clickedMonth = this.clientProfileFormGroup.get('month')?.value;
    const invoiceMonth = this.clientProfileFormGroup.get('invoiceMonth')?.value;

    if (!this.clickedMonth) {
      setTimeout(() => { this.totalvaluezone = this.totalPackageCost() || 0; }, 0);
    } else if (this.totSpend004AC?.length) {
      const matched = this.totSpend004AC.find(
        (x: any) => x.chargeType === chargetypevalue && x.month === invoiceMonth
      );

      setTimeout(() => { this.totalvaluezone = matched?.netCharge || 0; }, 0);
    }

    // ---------------------------------------------------
    // CHART CODE (UNCHANGED VISUALLY)
    // ---------------------------------------------------
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    const chart: any = am4core.create('container_zone', am4charts.XYChart);
    chart.paddingBottom = 40;
    chart.angle = 35;

    chart.data = [
      zone2,
      zone3,
      zone100,
      zone200,
      zone300,
      zone51,
      zone900,
      zone400,
      zone600
    ];
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 20;

    // ---------------------------------------------------
    // Y Axis
    // ---------------------------------------------------
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.title.text = '$ Net Charge';
    valueAxis.renderer.labels.template.adapter.add('text', (t: any) => `$${t}`);
    valueAxis.min = 0;

    // ---------------------------------------------------
    // SERIES (SINGLE COLOR + HIGHLIGHT)
    // ---------------------------------------------------
    const series: any = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'name';
    series.name = 'Zone';

    series.tooltipText =
      '{categoryX}: $ [bold]{valueY.formatNumber("#,###.00")}[/]\n[bold]CLICK TO VIEW MORE';

    // 🎨 BASE BAR STYLE
    const BASE_COLOR = am4core.color('#1AA7E8');
    const HIGHLIGHT_COLOR = am4core.color('#0F6FB5');

    series.columns.template.fill = BASE_COLOR;
    series.columns.template.stroke = BASE_COLOR;
    series.columns.template.fillOpacity = 0.9;
    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

    // Rounded bars (optional, looks modern)
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    // ---------------------------------------------------
    // HOVER STATE (DARKER BAR)
    // ---------------------------------------------------
    const hoverState = series.columns.template.states.create('hover');
    hoverState.properties.fill = HIGHLIGHT_COLOR;
    hoverState.properties.fillOpacity = 1;

    // ---------------------------------------------------
    // DIM OTHER BARS ON HOVER
    // ---------------------------------------------------
    series.columns.template.events.on('over', (ev: any) => {
      const hovered = ev.target;
      series.columns.each((column: any) => {
        column.fillOpacity = column === hovered ? 1 : 0.35;
      });
    });

    series.columns.template.events.on('out', () => {
      series.columns.each((column: any) => {
        column.fillOpacity = 0.9;
      });
    });

    // ---------------------------------------------------
    // CLICK HANDLER (KEEP HIGHLIGHT)
    // ---------------------------------------------------
    series.columns.template.events.on(
      'hit',
      (ev: any) => {
        const selected = ev.target;

        series.columns.each((column: any) => {
          column.fillOpacity = column === selected ? 1 : 0.35;
          column.fill = column === selected ? HIGHLIGHT_COLOR : BASE_COLOR;
        });

        const category = selected.dataItem?.dataContext;
        this.moreviewZoneData(category);
      },
      this
    );

    // ---------------------------------------------------
    // CURSOR
    // ---------------------------------------------------
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;
    categoryAxis.cursorTooltipEnabled = false;
    valueAxis.cursorTooltipEnabled = false;
    // ---------------------------------------------------
    // DARK MODE
    // ---------------------------------------------------
    if (this.themeoption === 'dark') {
      categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
      valueAxis.renderer.labels.template.fill = am4core.color('#fff');
      valueAxis.title.fill = am4core.color('#fff');
    }
  }

  private buildZone(name: string, value: any, category: string) {
    return {
      name,
      value: Number(value) || 0,
      category
    };
  }
  private calculateZoneTotal(): void {
    const clickedMonth = this.clientProfileFormGroup.get('month')?.value;

    if (clickedMonth == null) {
      setTimeout(() => { this.totalvaluezone = this.totalPackageCost(); }, 0);
      return;
    }

    const chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;
    const invoiceMonth = this.clientProfileFormGroup.get('invoiceMonth')?.value;

    const match = this.totSpend004AC?.find(
      (x: any) => x.chargeType === chargeType && x.month === invoiceMonth
    );

    setTimeout(() => { this.totalvaluezone = match?.netCharge || 0; }, 0);
  }




  private updateClientProfileForm(
    year: string,
    clientId: string,
    month: string,
    clientName: string
  ): void {
    this.clientProfileFormGroup.patchValue({
      invoiceMonth: month,
      invoiceyear: year,
      clientId,
      clientName
    });
  }
  async moreviewZoneData(event: any): Promise<void> {
    const eventName = (event.name || '').replace(/(\r\n|\n|\r)/gm, '');
    const eventValue = event.value;
    const eventCategory = event.category;

    const {
      month: invoiceMonth,
      year: invoiceyear,
      clientId,
      clientName
    } = this.clientProfileFormGroup.value;

    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;

    this.sendValue = {
      invoiceMonth,
      invoiceyear,
      clientId,
      clientName,
      chargeDescription: eventName,
      chargetypevalue,
      eventCategory,
      themeoption: this.themeoption
    };

    if (eventValue !== '0') {
      this.openZoneDialog();
    }
  }
  dialogValue: any;
  openZoneDialog(): void {
    console.log('ZonePopupComponent');
    const dialogRef = this.dialog.open(ZonePopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.sendValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.data) {
        this.dialogValue = result.data;
      }
    });
  }


  async fetchT004Rymax_chargeBack(): Promise<void> {
    try {
      const result: any = await firstValueFrom(
        this.httpClientService.fetchT004Rymax_chargeBack(
          this.clientProfileFormGroup.value
        )
      );

      this.resultObj = result;
      this.fetchT004Rymax_chargeBack_result(result);

    } catch (error: any) {
      console.log('ChargeBack API error', error);
    }
  }
  async fetchT004Rymax_chargeBack_Piechart(): Promise<void> {
    try {
      const result: any = await firstValueFrom(
        this.httpClientService.fetchT004Rymax_chargeBack_Piechart(
          this.clientProfileFormGroup.value
        )
      );
      console.log('result', result);
      this.chargePopupfrtaccAC = result;
      this.pie_chart(result);
    } catch (error: any) {
      console.log('ChargeBack Piechart API error', error);
    }
  }
  highestItem: any;
  pipe_chartData: Array<{ serviceName: string; rateVal: number }> = [];
  async pie_chart(tempAC: any) {
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.pipe_chartData = [];
    if (tempAC.length > 0) {  //added by manoj
      for (var piecount = 0; piecount < tempAC.length; piecount++) {
        var pie_Obj = tempAC[piecount];
        if (chargetypevalue == "SHP_FRT+ACC") {
          var chargetypevalue = null;
        } else {
          var chargetypevalue = chargetypevalue;
        }
        if (pie_Obj.chargetype == chargetypevalue) {
          var nameFiled = pie_Obj.chargeDescription;
          if (pie_Obj.totalnetamount != 0)
            var yField = pie_Obj.totalnetamount;
          else
            var yField = pie_Obj.netamount;

          this.pipe_chartData.push({
            "serviceName": nameFiled,
            "rateVal": yField
          });
        }

      }
    }
    if (this.pipe_chartData.length > 0) {
      setTimeout(() => {
        this.highestItem = this.pipe_chartData.reduce((max, item) =>
          Number(item.rateVal) > Number(max.rateVal) ? item : max
        );

        console.log('Highest Name:', this.highestItem.serviceName);
        console.log('Highest Value:', this.highestItem.rateVal);
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
    series.labels.template.disabled = true;
    series.slices.template.strokeWidth = 2;
    series.slices.template.strokeOpacity = 1;
    series.ticks.template.disabled = false;
    // series.labels.template.text = "${value}";
    // series.labels.template.text =  //   "{value.percent.formatNumber('#')}%";
    series.labels.template.adapter.add('text', function (_: any, target: any) {
      const percent = target.dataItem?.values?.value?.percent;
      return percent !== undefined ? `${Math.round(percent)}` : '';
    });
    series.labels.template.fontSize = 14;
    series.labels.template.fill = am4core.color('#333');
    series.labels.template.radius = am4core.percent(-30);

    series.ticks.template.disabled = true;
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
  sccprogressBar: any;
  async progressBar_clickHandler(event: any, eventObj:any) {
    if (eventObj.netCharge == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }
    if (this.GCprogressBar == 0 && event == "Ground Commercial") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.GRprogressBar == 0 && event == "Ground Residential") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.GHprogressBar == 0 && event == "Ground Hundredweight") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.surepost_id == 0 && event == "Ground Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.Next_dayprogressBar == 0 && event == "Next Day Air") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.Next_day_AMprogressBar == 0 && event == "Next Day Air A.M.") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.Next_day_saver_ProgressBar == 0 && event == "Next Day Air Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.twodayprogressBar == 0 && event == "2 Day") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.three_dayprogressBar == 0 && event == "3 Day") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.groundFreightPricingProgressBar == 0 && event == "Ground (Freight Pricing)") {
      this.openModal("Data Too Small to Display");
      return;
    }
    //International
    else if (this.worldwideExpediteprogressBar == 0 && event == "Worldwide Expedited") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.worldwideExpressprogressBar == 0 && event == "Worldwide Express") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwideExpressSaverprogressBar == 0 && event == "Worldwide Express Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.worldwideSaverprogressBar == 0 && event == "Worldwide Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.StandardprogressBar == 0 && event == "Standard") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwideExpressPlusprogressBar == 0 && event == "Worldwide Express Plus") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwideExpressFreightprogressBar == 0 && event == "Worldwide Express Freight") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwideEconomyDDPprogressBar == 0 && event == "Worldwide Economy DDP") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwideEconomyDDUprogressBar == 0 && event == "Worldwide Economy DDU") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.FreightprogressBar == 0 && event == "Freight") {
      this.openModal("Data Too Small to Display");
      return;
    }
    var eventName = event;
    this.progressBar = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var groupby = await eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var clientProfileFormGroup = this.clientProfileFormGroup.value;
    var moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      groupby: groupby,
      chargetypevalue: chargetypevalue,
      clientProfile: clientProfileFormGroup,
      themeoption: this.themeoption
    }
    this.progressBar = moreviewObj;
    this.progressBarPopupComponent();
  }
  async progressBarPopupComponent() {
    const dialogRef = this.dialog.open(ChargeDescPopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.progressBar,
        dataasof: this.dataasof
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }


  async fetchT004Rymax_chargeBack_result(event: any) {

    let chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.chargeBack_result = event;
    this.chargebackfrtacc = await this.chargeBack_result;

    if (!this.chargeBack_result?.length) {
      return;
    }

    // --------------------------------------------------
    // Helpers
    // --------------------------------------------------
    const safeNumber = (val: any): number => {
      const n = Number(val);
      return Number.isNaN(n) ? 0 : n;
    };

    // --------------------------------------------------
    // RESET VALUES
    // --------------------------------------------------
    this.ground_Hundredweight = 0;
    this.ground_Commercial = 0;
    this.ground_residential = 0;
    this.next_day_air = 0;
    this.next_day_air_AM = 0;
    this.next_day_air_Saver = 0;
    this.two_day = 0;
    this.three_day = 0;
    this.twoDayAM = 0;
    this.groundFreightPricing = 0;
    this.sure_post = 0;
    this.fuel_ser = 0;
    this.add_correction = 0;
    this.Declared_value = 0;
    this.charge_back = 0;
    this.scc = 0;

    this.GHprogressBar = 0;
    this.GCprogressBar = 0;
    this.GRprogressBar = 0;
    this.Next_dayprogressBar = 0;
    this.Next_day_AMprogressBar = 0;
    this.Next_day_saver_ProgressBar = 0;
    this.twodayprogressBar = 0;
    this.three_dayprogressBar = 0;
    this.twoDayAMProgressBar = 0;
    this.groundFreightPricingProgressBar = 0;
    this.surepost_id = 0;

    this.progressBarUpsList = [];
    this.chargeDesList = [];
    this.maxValue = 0;

    this.worldwideExpedite = 0;
    this.worldwideExpress = 0;
    this.worldwideExpressSaver = 0;
    this.worldwideSaver = 0;
    this.Standard = 0;
    this.worldwideExpressPlus = 0;
    this.worldwideExpressFreight = 0;
    this.worldwideEconomyDDP = 0;
    this.worldwideEconomyDDU = 0;
    this.Freight = 0;

    this.worldwideExpediteprogressBar = 0;
    this.worldwideExpressprogressBar = 0;
    this.worldwideExpressSaverprogressBar = 0;
    this.worldwideSaverprogressBar = 0;
    this.StandardprogressBar = 0;
    this.worldwideExpressPlusprogressBar = 0;
    this.worldwideExpressFreightprogressBar = 0;
    this.worldwideEconomyDDPprogressBar = 0;
    this.worldwideEconomyDDUprogressBar = 0;
    this.FreightprogressBar = 0;
    this.internationalchargeDesList = [];
    this.maxValueInt = 0;
    this.progressBarUpsListInternational = [];

    // --------------------------------------------------
    // PROCESS DATA
    // --------------------------------------------------
    for (const chargeBackObj of this.chargeBack_result) {

      if (chargetypevalue === 'SHP_FRT+ACC') {
        chargetypevalue = null;
      }

      const totAmt = safeNumber(chargeBackObj.netamount);

      if (chargeBackObj.chargetype === chargetypevalue) {
        switch (chargeBackObj.groupby) {
          case 'Ground Hundredweight': this.ground_Hundredweight = totAmt; break;
          case 'Ground Commercial': this.ground_Commercial = totAmt; break;
          case 'Ground Residential': this.ground_residential = totAmt; break;
          case 'Next Day Air': this.next_day_air = totAmt; break;
          case 'Next Day Air A.M.': this.next_day_air_AM = totAmt; break;
          case 'Next Day Air Saver': this.next_day_air_Saver = totAmt; break;
          case '2 Day': this.two_day = totAmt; break;
          case '2 Day AM': this.twoDayAM = totAmt; break;
          case '3 Day': this.three_day = totAmt; break;
          case 'Ground (Freight Pricing)': this.groundFreightPricing = totAmt; break;
          case 'Fuel Surcharge': this.fuel_ser = totAmt; break;
          case 'Address Correction': this.add_correction = totAmt; break;
          case 'Declared Value': this.Declared_value = totAmt; break;
          case 'Chargeback': this.charge_back = totAmt; break;
          case 'Ground Saver': this.sure_post = totAmt; break;
          //International
          case 'Worldwide Expedited': this.worldwideExpedite = totAmt; break;
          case 'Worldwide Express': this.worldwideExpress = totAmt; break;
          case 'Worldwide Express Saver': this.worldwideExpressSaver = totAmt; break;
          case 'Worldwide Saver': this.worldwideSaver = totAmt; break;
          case 'Standard': this.Standard = totAmt; break;
          case 'Worldwide Express Plus': this.worldwideExpressPlus = totAmt; break;
          case 'Worldwide Express Freight': this.worldwideExpressFreight = totAmt; break;
          case 'Worldwide Economy DDP': this.worldwideEconomyDDP = totAmt; break;
          case 'Worldwide Economy DDU': this.worldwideEconomyDDU = totAmt; break;
          case 'Freight': this.Freight = totAmt; break;
        }
      }

      if (chargeBackObj.groupby === 'SCC') {
        this.scc = totAmt;
      }
    }

    // --------------------------------------------------
    // MAX CALCULATION
    // --------------------------------------------------
    this.chargeDesList.push(
      this.ground_Hundredweight,
      this.ground_Commercial,
      this.ground_residential,
      this.next_day_air,
      this.next_day_air_AM,
      this.next_day_air_Saver,
      this.two_day,
      this.three_day,
      this.sure_post,
      this.twoDayAM,
      this.groundFreightPricing
    );

    const maxVal = Math.max(...this.chargeDesList);
    this.maxValue = maxVal + maxVal / 10;

    this.internationalchargeDesList.push(
      this.worldwideExpedite,
      this.worldwideExpress,
      this.worldwideExpressSaver,
      this.worldwideSaver,
      this.Standard,
      this.worldwideExpressPlus,
      this.worldwideExpressFreight,
      this.worldwideEconomyDDP,
      this.worldwideEconomyDDU,
      this.Freight,
    );
    const maxValint = Math.max(...this.internationalchargeDesList);
    this.maxValueInt = maxValint + maxValint / 10;

    // --------------------------------------------------
    // PROGRESS BAR CALC
    // --------------------------------------------------
    this.GHprogressBar = await this.calcPercent(this.ground_Hundredweight, this.maxValue);
    this.GCprogressBar = await this.calcPercent(this.ground_Commercial, this.maxValue);
    this.GRprogressBar = await this.calcPercent(this.ground_residential, this.maxValue);
    this.Next_dayprogressBar = await this.calcPercent(this.next_day_air, this.maxValue);
    this.Next_day_AMprogressBar = await this.calcPercent(this.next_day_air_AM, this.maxValue);
    this.Next_day_saver_ProgressBar = await this.calcPercent(this.next_day_air_Saver, this.maxValue);
    this.twodayprogressBar = await this.calcPercent(this.two_day, this.maxValue);
    this.three_dayprogressBar = await this.calcPercent(this.three_day, this.maxValue);
    this.surepost_id = await this.calcPercent(this.sure_post, this.maxValue);
    this.twoDayAMProgressBar = await this.calcPercent(this.twoDayAM, this.maxValue);
    this.groundFreightPricingProgressBar = await this.calcPercent(this.groundFreightPricing, this.maxValue);

    this.worldwideExpediteprogressBar = await this.calcPercent(this.worldwideExpedite, this.maxValueInt);
    this.worldwideExpressprogressBar = await this.calcPercent(this.worldwideExpress, this.maxValueInt);
    this.worldwideExpressSaverprogressBar = await this.calcPercent(this.worldwideExpressSaver, this.maxValueInt);
    this.worldwideSaverprogressBar = await this.calcPercent(this.worldwideSaver, this.maxValueInt);
    this.StandardprogressBar = await this.calcPercent(this.Standard, this.maxValueInt);
    this.worldwideExpressPlusprogressBar = await this.calcPercent(this.worldwideExpressPlus, this.maxValueInt);
    this.worldwideExpressFreightprogressBar = await this.calcPercent(this.worldwideExpressFreight, this.maxValueInt);
    this.worldwideEconomyDDPprogressBar = await this.calcPercent(this.worldwideEconomyDDP, this.maxValueInt);
    this.worldwideEconomyDDUprogressBar = await this.calcPercent(this.worldwideEconomyDDU, this.maxValueInt);
    this.FreightprogressBar = await this.calcPercent(this.Freight, this.maxValueInt);

    // --------------------------------------------------
    // BUILD UI LIST
    // --------------------------------------------------
    this.progressBarUpsList = [
      { serviceType: 'Ground Commercial', progressBar: this.GCprogressBar, netCharge: this.ground_Commercial, serviceName: 'Ground Commercial' },
      { serviceType: 'Ground Residential', progressBar: this.GRprogressBar, netCharge: this.ground_residential, serviceName: 'Ground Residential' },
      { serviceType: 'Ground Hundredweight', progressBar: this.GHprogressBar, netCharge: this.ground_Hundredweight, serviceName: 'Ground Hundredweight' },
      { serviceType: 'Ground Saver', progressBar: this.surepost_id, netCharge: this.sure_post, serviceName: 'Ground Saver' },
      { serviceType: 'Next Day Air', progressBar: this.Next_dayprogressBar, netCharge: this.next_day_air, serviceName: 'Next Day Air' },
      { serviceType: 'Next Day Air A.M.', progressBar: this.Next_day_AMprogressBar, netCharge: this.next_day_air_AM, serviceName: 'Next Day Air A.M.' },
      { serviceType: 'Next Day Air Saver', progressBar: this.Next_day_saver_ProgressBar, netCharge: this.next_day_air_Saver, serviceName: 'Next Day Air Saver' },
      { serviceType: '2 Day', progressBar: this.twodayprogressBar, netCharge: this.two_day, serviceName: '2 Day' },
      { serviceType: '2 Day AM', progressBar: this.twoDayAMProgressBar, netCharge: this.twoDayAM, serviceName: '2 Day AM' },
      { serviceType: '3 Day', progressBar: this.three_dayprogressBar, netCharge: this.three_day, serviceName: '3 Day' },
      { serviceType: 'Ground (Freight Pricing)', progressBar: this.groundFreightPricingProgressBar, netCharge: this.groundFreightPricing, serviceName: 'Ground (Freight Pricing)' }
    ].sort((a: any, b: any) => b.netCharge - a.netCharge);
    this.domesticGroundService.set(this.progressBarUpsList)

    this.progressBarUpsListInternational = [
      { serviceType: 'Worldwide Expedited', progressBar: this.worldwideExpediteprogressBar, netCharge: this.worldwideExpedite, serviceName: 'Worldwide Expedited' },
      { serviceType: 'Worldwide Express', progressBar: this.worldwideExpressprogressBar, netCharge: this.worldwideExpress, serviceName: 'Worldwide Express' },
      { serviceType: 'Worldwide Express Saver', progressBar: this.worldwideExpressSaverprogressBar, netCharge: this.worldwideExpressSaver, serviceName: 'Worldwide Express Saver' },
      { serviceType: 'Worldwide Saver', progressBar: this.worldwideSaverprogressBar, netCharge: this.worldwideSaver, serviceName: 'Worldwide Saver' },
      { serviceType: 'Standard', progressBar: this.StandardprogressBar, netCharge: this.Standard, serviceName: 'Standard' },
      { serviceType: 'Worldwide Express Plus', progressBar: this.worldwideExpressPlusprogressBar, netCharge: this.worldwideExpressPlus, serviceName: 'Worldwide Express Plus' },
      { serviceType: 'Worldwide Express Freight', progressBar: this.worldwideExpressFreightprogressBar, netCharge: this.worldwideExpressFreight, serviceName: 'Worldwide Express Freight' },
      { serviceType: 'Worldwide Economy DDP', progressBar: this.worldwideEconomyDDPprogressBar, netCharge: this.worldwideEconomyDDP, serviceName: 'Worldwide Economy DDP' },
      { serviceType: 'Worldwide Economy DDU', progressBar: this.worldwideEconomyDDUprogressBar, netCharge: this.worldwideEconomyDDU, serviceName: 'Worldwide Economy DDU' },
      { serviceType: 'Freight', progressBar: this.FreightprogressBar, netCharge: this.Freight, serviceName: 'Freight' },
    ].sort((a: any, b: any) => b.netCharge - a.netCharge);
    this.internationGroundService.set(this.progressBarUpsListInternational);
  }

  private resetAllChargeValues(): void {
    this.ground_Hundredweight = 0;
    this.ground_Commercial = 0;
    this.ground_residential = 0;
    this.next_day_air = 0;
    this.next_day_air_AM = 0;
    this.next_day_air_Saver = 0;
    this.two_day = 0;
    this.twoDayAM = 0;
    this.three_day = 0;
    this.fuel_ser = 0;
    this.add_correction = 0;
    this.Declared_value = 0;
    this.charge_back = 0;
    this.sure_post = 0;
    this.scc = 0;
    this.groundFreightPricing = 0;
  }
  private assignChargeValue(group: string, value: number): void {
    const map: Record<string, () => void> = {
      'Ground Hundredweight': () => (this.ground_Hundredweight = value),
      'Ground Commercial': () => (this.ground_Commercial = value),
      'Ground Residential': () => (this.ground_residential = value),
      'Next Day Air': () => (this.next_day_air = value),
      'Next Day Air A.M.': () => (this.next_day_air_AM = value),
      'Next Day Air Saver': () => (this.next_day_air_Saver = value),
      '2 Day': () => (this.two_day = value),
      '2 Day AM': () => (this.twoDayAM = value),
      '3 Day': () => (this.three_day = value),
      'Fuel Surcharge': () => (this.fuel_ser = value),
      'Address Correction': () => (this.add_correction = value),
      'Declared Value': () => (this.Declared_value = value),
      'Chargeback': () => (this.charge_back = value),
      'Ground Saver': () => (this.sure_post = value),
      'Ground (Freight Pricing)': () => (this.groundFreightPricing = value),
      'SCC': () => (this.scc = value)
    };

    map[group]?.();
  }


  private calculateProgressBars(): void {
    this.GHprogressBar = this.calcPercent(this.ground_Hundredweight, this.maxValue);
    this.GCprogressBar = this.calcPercent(this.ground_Commercial, this.maxValue);
    this.GRprogressBar = this.calcPercent(this.ground_residential, this.maxValue);
    this.Next_dayprogressBar = this.calcPercent(this.next_day_air, this.maxValue);
    this.Next_day_AMprogressBar = this.calcPercent(this.next_day_air_AM, this.maxValue);
    this.Next_day_saver_ProgressBar = this.calcPercent(this.next_day_air_Saver, this.maxValue);
    this.twodayprogressBar = this.calcPercent(this.two_day, this.maxValue);
    this.three_dayprogressBar = this.calcPercent(this.three_day, this.maxValue);
    this.twoDayAMProgressBar = this.calcPercent(this.twoDayAM, this.maxValue);
    this.groundFreightPricingProgressBar = this.calcPercent(this.groundFreightPricing, this.maxValue);
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
  async moreviewWeightDist() {
    this.sendValue = {};

    const invoiceMonth = this.clientProfileFormGroup.get('month')?.value;
    const invoiceyear = this.clientProfileFormGroup.get('year')?.value;
    const clientId = this.clientProfileFormGroup.get('clientId')?.value;
    const clientName = this.clientProfileFormGroup.get('clientName')?.value;
    const weightMainAC = this.weight_mainAC;
    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;

    this.sendValue = {
      invoiceMonth,
      invoiceyear,
      clientId,
      clientName,
      weight_mainAC: weightMainAC,
      chargetypevalue,
      themeoption: this.themeoption
    };

    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(WeightDistPopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.sendValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.data !== undefined) {
        this.dialogValue = result.data;
      }
    });
  }
  async moreService_clickHandler() {
    var eventName = event;
    this.progressBar = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var groupby = await eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      themeoption: this.themeoption
    }
    this.moreService = moreviewObj;
    this.moreServicePopupComponent();
  }
  async moreServicePopupComponent() {
    const dialogRef = this.dialog.open(MoreServicePopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.moreService }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }
  progressBar: any;
  moreService: any;

  searchUser() {
    const dateFr: Date = this.searchForm.get('fromdate')?.value;
    const dateT: Date = this.searchForm.get('todate')?.value;

    if (!this.isDateRangeValid(dateFr, dateT)) {
      this.openModal("Time Frame Greater than 2 years");
      return;
    }

    const dateFrom: any = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    const dateTo: any = this.datePipe.transform(dateT, "yyyy-MM-dd");
    const trackingNumber = this.searchForm.get('trackingNumber')?.value;
    const chargeSource = this.searchForm.get('chargeSource')?.value;

    if (!trackingNumber) {
      this.openModal(
        chargeSource === "Tracking Number"
          ? "Please Enter Tracking number"
          : "Please Enter a value"
      );
      return;
    }

    const payload: any = {};

    const clientId = this.clientProfileFormGroup.get('clientId')?.value;
    const clientName = this.clientProfileFormGroup
      .get('clientName')?.value
      .replace(/\s/g, '');

    payload.clientId = clientId;
    payload.clientname = clientName;
    payload.fromdate = dateFrom;
    payload.todate = dateTo;
    payload.basisValue = 'UPS';

    payload.trackingNumber = trackingNumber;
    payload.receiverPostal = trackingNumber;
    payload.chargeSource = chargeSource;

    this.searchUserobjUpsArray = [payload];
    this.switchProj.CommonSub.next(this.searchUserobjUpsArray);
    this.switchProj.setTrackingPayload(payload); // persist across reload

    this.router.navigate(['/ups/tracking']);
  }

  private isDateRangeValid(from: Date, to: Date): boolean {
    if (!from || !to) return false;
    return (to.getFullYear() - from.getFullYear()) <= 1;
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
