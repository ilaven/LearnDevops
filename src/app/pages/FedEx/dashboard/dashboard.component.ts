import { Component, OnDestroy, OnInit, Signal, signal, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';
import { ChartType } from './dashboard.model';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { firstValueFrom, map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { FedexChargeDescPopupComponent } from '../popup/fedex-charge-desc-popup/fedex-charge-desc-popup.component';
import { FedexMoreServicePopupComponent } from '../popup/fedex-more-service-popup/fedex-more-service-popup.component';
import { FedexWeightDistPopupComponent } from '../popup/fedex-weight-dist-popup/fedex-weight-dist-popup.component';
import { FedexZonePopupComponent } from '../popup/fedex-zone-popup/fedex-zone-popup.component';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-fedex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class FedexDashboardComponent implements OnInit, OnDestroy {
  private weightChart: am4charts.XYChart | null = null;
  @ViewChild('singleSelect') singleSelect!: MatSelect;
  clientType: any = '';
  dashBoardSHP!: FormGroup;
  searchForm: FormGroup;
  fedexFormGroup!: FormGroup;
  fedexFormGroupTop!: FormGroup;
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
  filteredOptions!: Observable<string[]> | undefined;
  userProfifle: any;
  chargePopupfrtaccAC: any = [];
  totalTransSummAC: any = signal<any>([]);
  totalTransSummAC1: any = signal<any>([]);
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
  userProfifleFedex: any;
  themeoption: any;
  year_Select: any;
  month_Select: any;
  clientIDFedex: any;
  currentyear: any;
  isOpenModalOpened!: boolean;
  dashBoardFRTACCLableFedex: any;
  frtacc_btn_selected = true;
  weight_labid_text: any;
  chargeDescArray = new Array("Ground", "FedEx 2Day", "FedEx Express Saver", "FedEx First Overnight", "FedEx Priority Overnight", "FedEx Standard Overnight", "Home Delivery"
    , "International Ground", "Fuel Surcharge", "Address Correction", "Declared Value", "FedEx 2Day A.M.", "Ground Economy");
  fetchaccountDetailsFedexStr: any;
  private _onDestroy = new Subject<void>();
  public accNoCtrl: FormControl = new FormControl();
  public accNoFilterCtrl: FormControl = new FormControl();
  public filteredAccNo: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  T201DashboardObj: any;
  totalPackCount = signal<any>(null);
  totalPackCost = signal<any>(0);
  t201DashStaticCurrentYRObj: any;
  fetchdashBoardFedexData: any;
  yearBindingTitle = signal<any>('');
  monthBindingTitle = signal<any>('');
  frtaccBindingTitle = signal<any>('');
  panelClass: any;
  GprogressBarFedex: any;
  FExpSerprogressBarFedex: any;
  FFirOverprogressBarFedex: any;
  F2DayprogressBarFedex: any;
  F2DayAMprogressBarFedex: any;
  FPriovernitprogressBarFedex: any;
  FStdovernitprogressBarFedex: any;
  HmeDelprogressBarFedex: any;
  smartPostprogressBarFedex: any;
  fuelprogressBarFedex: any;
  addressCorrectionFedex: any;
  declaredValueFedex: any;
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


  // bread crumb items 
  analyticsChart!: ChartType;
  BestSelling: any;
  TopSelling: any;
  Recentelling: any;
  SalesCategoryChart!: ChartType;
  statData!: any;
  currentDate: any;
  themeColorMap: any;

  chargeDesListFedexFedex = [];
  Ground: any;
  FedEx_2Day: any;
  FedEx_Express_Saver: any;
  FedEx_First_Overnight: any;
  FedEx_2Day_AM: any;
  FedEx_Priority_Overnight: any;
  FedEx_Standard_Overnight: any;
  Home_Delivery: any;
  smartPost: any;
  fuel_serFedex: any;
  add_correctionFedex: any;
  Declared_valueFedex: any;
  charge_backFedex: any;
  chargeDesListFedex: any = [];
  progressBarFedexList: any = [];
  t202DashStaticChrgDescIndAC: any;
  t219List: any = [];
  totalZoneValue = signal<any>('0');
  dialogValue: any;
  chargetypevalue = signal<any>('');
  showColumnPicker = false;

  internationalGround: any;
  fedExIntlEconomy: any;
  fedExIntlPriority: any;
  FedExInternationalFirst: any;
  FedExIntlPriorityFrt: any;
  FedExIntlEconomyFrt: any;
  FedExIntlPriorityExpress: any;
  FedExInternationalConnectPlus: any;
  internationalchargeDesListFedex: any;

  internationalGroundprogressBar: any;
  fedExIntlEconomyprogressBar: any;
  fedExIntlPriorityprogressBar: any;
  FedExInternationalFirstprogressBar: any;
  FedExIntlPriorityFrtprogressBar: any;
  FedExIntlEconomyFrtprogressBar: any;
  FedExIntlPriorityExpressprogressBar: any;
  FedExInternationalConnectPlusprogressBar: any;
  internationalprogressBarFedexList: any = [];
  maxValueInt: any
  maxValInt: any;

  constructor(public toastService: ToastService, private commonService: CommonService,
    private httpClientService: HttpClientService, private httpfedexService: HttpfedexService,
    private dialog: MatDialog, private datePipe: DatePipe, private router: Router, private loaderService: LoaderService,
    private cookiesService: CookiesService, private switchProj: SwitchProjectService,) {
    this.cookiesService.carrierType.subscribe((clienttype: any) => {
      this.clientType = clienttype;
      if (clienttype) {
        this.clientType = clienttype;
      }
      else {
        if (localStorage.getItem('carrierType'))
          this.clientType = localStorage.getItem('carrierType');
      }
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
  toNumber(value: any): number | null {
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
  initForm() {
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('FRTWithAcc')
    });
    ///*Fedex API *////
    this.fedexFormGroup = new FormGroup({
      clientId: new FormControl(''),
      clientName: new FormControl(''),
      isPrimaryAccount: new FormControl(''),
      year: new FormControl(''),
      accountNumber: new FormControl('ALL'),
      month: new FormControl(''),
      monthFlag: new FormControl('N'),
      chargeType: new FormControl('FRTWithAcc'),
      chargeDescArray: new FormControl(['']),
      fetchProcessRecord: new FormControl('Y'),
      chargeGroup: new FormControl(''),
      year_1: new FormControl(''),
      primaryAccountNumber: new FormControl('ALL'),
      selectedMonth: new FormControl('N'),
      zoneChargeType: new FormControl('FRTWithAcc'),
      chargeDescription: new FormControl(''),
      createdDate: new FormControl(''),
      requesteddttm: new FormControl(''),
      reportName: new FormControl(''),
      reportType: new FormControl(''),
      chargeDesc: new FormControl(''),
      reportFormat: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      fromdate: new FormControl(""),
      todate: new FormControl(""),
      loginId: new FormControl(''),
      modulename: new FormControl(''),
      desc: new FormControl(''),
      grp: new FormControl(''),
      accNo: new FormControl(''),
      status: new FormControl(''),
      t002ClientProfile: new FormControl({
        clientId: new FormControl(''),
        clientName: new FormControl(''),
        userName: new FormControl(''),
        password: new FormControl(''),
        siteUserName: new FormControl(''),
        sitePassword: new FormControl(''),
        address: new FormControl(''),
        contactNo: new FormControl(''),
        comments: new FormControl(''),
        endDate: new FormControl(''),
        startDate: new FormControl(''),
        status: new FormControl(''),
        auditStatus: new FormControl(''),
        contractStatus: new FormControl(''),
        email: new FormControl(''),
        userLogo: new FormControl(''),
        customerType: new FormControl(''),
        dataSource: new FormControl(''),
        dataLoadedBy: new FormControl(''),
        filestartdate: new FormControl(''),
        fileenddate: new FormControl(''),
        dateasof: new FormControl(''),
        currentDate: new FormControl(''),
        currentYear: new FormControl(''),
        currentMonth: new FormControl(''),
        startYear: new FormControl(''),
        createdBy: new FormControl(''),
        createdTs: new FormControl(''),
        updatedTs: new FormControl(''),
        adminFlag: new FormControl(''),
        filestartdate1: new FormControl(''),
        fileenddate1: new FormControl(''),
        trackingcount: new FormControl(''),
        logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''),
        noofdaysinactive: new FormControl(''),
        ipaddress: new FormControl(''),
        loginFlag: new FormControl(''),
        contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''),
        carrierType: new FormControl(''),
        t002AccountDet: [''],
        customers: new FormControl('')
      })
    })
    this.fedexFormGroupTop = new FormGroup({
      clientId: new FormControl(''),
      clientName: new FormControl(''),
      isPrimaryAccount: new FormControl(''),
      year: new FormControl(''),
      accountNumber: new FormControl('ALL'),
      month: new FormControl(''),
      monthFlag: new FormControl('N'),
      chargeType: new FormControl('FRTWithAcc'),
      chargeDescArray: new FormControl(['']),
      fetchProcessRecord: new FormControl('Y'),
      chargeGroup: new FormControl(''),
      year_1: new FormControl(''),
      primaryAccountNumber: new FormControl('ALL'),
      selectedMonth: new FormControl('N'),
      zoneChargeType: new FormControl('FRTWithAcc'),
      chargeDescription: new FormControl(''),
      createdDate: new FormControl(''),
      requesteddttm: new FormControl(''),
      reportName: new FormControl(''),
      reportType: new FormControl(''),
      chargeDesc: new FormControl(''),
      reportFormat: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      fromdate: new FormControl(""),
      todate: new FormControl(""),
      loginId: new FormControl(''),
      modulename: new FormControl(''),
      desc: new FormControl(''),
      grp: new FormControl(''),
      accNo: new FormControl(''),
      status: new FormControl(''),
      t002ClientProfile: new FormControl({
        clientId: new FormControl(''),
        clientName: new FormControl(''),
        userName: new FormControl(''),
        password: new FormControl(''),
        siteUserName: new FormControl(''),
        sitePassword: new FormControl(''),
        address: new FormControl(''),
        contactNo: new FormControl(''),
        comments: new FormControl(''),
        endDate: new FormControl(''),
        startDate: new FormControl(''),
        status: new FormControl(''),
        auditStatus: new FormControl(''),
        contractStatus: new FormControl(''),
        email: new FormControl(''),
        userLogo: new FormControl(''),
        customerType: new FormControl(''),
        dataSource: new FormControl(''),
        dataLoadedBy: new FormControl(''),
        filestartdate: new FormControl(''),
        fileenddate: new FormControl(''),
        dateasof: new FormControl(''),
        currentDate: new FormControl(''),
        currentYear: new FormControl(''),
        currentMonth: new FormControl(''),
        startYear: new FormControl(''),
        createdBy: new FormControl(''),
        createdTs: new FormControl(''),
        updatedTs: new FormControl(''),
        adminFlag: new FormControl(''),
        filestartdate1: new FormControl(''),
        fileenddate1: new FormControl(''),
        trackingcount: new FormControl(''),
        logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''),
        noofdaysinactive: new FormControl(''),
        ipaddress: new FormControl(''),
        loginFlag: new FormControl(''),
        contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''),
        carrierType: new FormControl(''),
        t002AccountDet: [''],
        customers: new FormControl('')
      })
    })
    ///*Fedex API *////
    this.cookiesService.checkForClientName();
    this.switchProj.projNameSource.subscribe((message: string) => {
      this.projectName = message;
    });
    this.chargetypevalue.set(this.fedexFormGroup.get('chargeType')?.value);
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
    const today = new Date();
    const monthStartDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthEndDay = new Date(today.getFullYear(), today.getMonth(), 0);
    this.fromDate = new Date(monthStartDay);
    this.toDate = new Date(monthEndDay);
    this.dates = {
      start: new Date(this.fromDate),
      end: new Date(this.toDate)
    };
    this.searchForm.patchValue({
      dateRange: {
        start: new Date(this.fromDate),
        end: new Date(this.toDate)
      }
    });

    this.searchForm.get('fromdate')?.setValue(new Date(monthStartDay));
    this.searchForm.get('todate')?.setValue(new Date(monthEndDay));
    this.openLoading();
    const currentYear = new Date().getFullYear();
    const stYear = currentYear - 3;

    for (let yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }
    this.initDashBoardFedex();
    this.filteredOptions = this.fedexFormGroup.get("primaryAccountNumber")?.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }
  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }
  private _filter(value: string): string[] {
    const filterValue = value;
    return this.Accountoptions.filter((option: any) => option.includes(filterValue));
  }
  async initDashBoardFedex() {

    // -----------------------------
    // User Profile & Theme
    // -----------------------------
    const userProfifleFedex = await this.getuserProfileFedex();
    if (!userProfifleFedex || userProfifleFedex.length === 0) {
      console.warn("FedEx user profile is not ready.");
      this.closeLoading();
      return;
    }

    this.userProfifleFedex = userProfifleFedex[0];

    this.themeoption = await this.cookiesService
      .getCookie('themeOption')
      .then((res: any) => res);

    this.clientIDFedex = this.userProfifleFedex?.clientId;
    const clientName = this.userProfifleFedex?.clientName;

    // -----------------------------
    // Year Calculation
    // -----------------------------
    const today = new Date();
    let yearFedex: number;

    if (today.getMonth() == 0 || (today.getMonth() == 1 && today.getDate() <= 5)) {
      yearFedex = today.getFullYear() - 1;
    } else {
      yearFedex = today.getFullYear();
    }

    // -----------------------------
    // Form Value Initialization
    // -----------------------------
    await this.fedexFormGroup.get('clientId')?.setValue(this.clientIDFedex);
    await this.fedexFormGroup.get('clientName')?.setValue(clientName);
    await this.fedexFormGroup.get('year')?.setValue(yearFedex);
    await this.fedexFormGroup.get('accountNumber')?.setValue(null);
    await this.fedexFormGroup.get('month')?.setValue(null);
    await this.fedexFormGroup.get('monthFlag')?.setValue('N');
    await this.fedexFormGroup.get('selectedMonth')?.setValue('N');
    await this.fedexFormGroup.get('chargeDescArray')?.setValue(this.chargeDescArray);
    await this.fedexFormGroup.get('year_1')?.setValue(yearFedex);
    await this.fedexFormGroup.get('chargeGroup')?.setValue('Freight');

    this.year_Select = this.fedexFormGroup.get('year')?.value;
    this.month_Select = this.fedexFormGroup.get('month')?.value;

    // -----------------------------
    // Client Profile Object
    // -----------------------------
    const clientProfile = {
      clientId: this.userProfifleFedex.clientId,
      clientName: this.userProfifleFedex.clientName,
      userName: this.userProfifleFedex.userName,
      password: this.userProfifleFedex.password,
      siteUserName: this.userProfifleFedex.siteUserName,
      sitePassword: this.userProfifleFedex.sitePassword,
      address: this.userProfifleFedex.address,
      contactNo: this.userProfifleFedex.contactNo,
      comments: this.userProfifleFedex.comments,
      endDate: this.userProfifleFedex.endDate,
      startDate: this.userProfifleFedex.startDate,
      status: this.userProfifleFedex.status,
      auditStatus: this.userProfifleFedex.auditStatus,
      contractStatus: this.userProfifleFedex.contractStatus,
      email: this.userProfifleFedex.email,
      userLogo: this.userProfifleFedex.userLogo,
      customerType: this.userProfifleFedex.customerType,
      dataSource: this.userProfifleFedex.dataSource,
      dataLoadedBy: this.userProfifleFedex.dataLoadedBy,
      filestartdate: this.userProfifleFedex.filestartdate,
      fileenddate: this.userProfifleFedex.fileenddate,
      dateasof: this.userProfifleFedex.dateasof,
      currentDate: this.userProfifleFedex.currentDate,
      currentYear: this.userProfifleFedex.currentYear,
      currentMonth: this.userProfifleFedex.currentMonth,
      startYear: this.userProfifleFedex.startYear,
      createdBy: this.userProfifleFedex.createdBy,
      createdTs: this.userProfifleFedex.createdTs,
      updatedTs: this.userProfifleFedex.updatedTs,
      adminFlag: this.userProfifleFedex.adminFlag,
      filestartdate1: this.userProfifleFedex.filestartdate1,
      fileenddate1: this.userProfifleFedex.fileenddate1,
      trackingcount: this.userProfifleFedex.trackingcount,
      logostatus: this.userProfifleFedex.logostatus,
      noofdaystoactive: this.userProfifleFedex.noofdaystoactive,
      noofdaysinactive: this.userProfifleFedex.noofdaysinactive,
      ipaddress: this.userProfifleFedex.ipaddress,
      loginFlag: this.userProfifleFedex.loginFlag,
      contractSavingFlag: this.userProfifleFedex.contractSavingFlag,
      clientProfileName: this.userProfifleFedex.clientProfileName,
      carrierType: this.userProfifleFedex.carrierType,
      t002AccountDet: this.userProfifleFedex.t002AccountDet,
      customers: this.userProfifleFedex.customers
    };

    // -----------------------------
    // Patch Forms
    // -----------------------------
    await this.fedexFormGroup.patchValue({ t002ClientProfile: clientProfile });
    await this.fedexFormGroupTop.patchValue({ t002ClientProfile: clientProfile });

    // -----------------------------
    // Refresh & Modal Handling
    // -----------------------------
    await this.refresh();

    if (this.isOpenModalOpened) {
      this.openModalConfig.close();
      this.isOpenModalOpened = false;
    }
  }
  async refresh() {
    this.weight_labid_text = "Billed Weight";
    if (this.frtacc_btn_selected == true) {
      this.dashBoardFRTACCLableFedex = "";
    }
    else {
      this.dashBoardFRTACCLableFedex = " (FRT only)";
    }
    await this.initialDashBoardFetchFedex();
    await this.fetchaccountDetailsFedex();
  }
  async initialDashBoardFetchFedex() {
    await this.fetchdashBoardFedex();
  }
  async getuserProfileFedex() {
    this.userProfifle = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifle;
  }
  fetchdashBoardFedex(): void {
    this.bindingTitleFedex();
    this.httpfedexService
      .fetchdashBoard(this.fedexFormGroup.value)
      .subscribe({
        next: (result: any) => {
          this.fetchdashBoardFedexData = result;

          if (Object.keys(result).length == 0) {
            this.openModal('No data available'); // 9126
            this.closeLoading();
            return;
          }
          this.totalPackCount.set(0);
          this.totalPackCost.set(0);
          this.T201DashboardObj = result;
          this.t201DashStaticCurrentYRObj = result;
          this.fetchdashBoardInitialResult(result);
          this.fetchdashBoardFedexTop();
          this.closeLoading()
        },
        error: (err) => {
          console.error('FedEx dashboard fetch failed', err);
          this.closeLoading();
        }
      });
  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
  async fetchdashBoardFedexTop(): Promise<void> {

    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;
    const chargeType = this.fedexFormGroup.get('chargeType')?.value;

    if (monthFlag == "N") {
      this.fedexFormGroupTop.get('chargeType')?.setValue("FRT");
    }

    /* ---------- COPY FORM VALUES ---------- */
    this.fedexFormGroupTop.get("clientId")?.setValue(this.fedexFormGroup.get('clientId')?.value);
    this.fedexFormGroupTop.get("clientName")?.setValue(this.fedexFormGroup.get('clientName')?.value);
    this.fedexFormGroupTop.get("isPrimaryAccount")?.setValue(this.fedexFormGroup.get('isPrimaryAccount')?.value);
    this.fedexFormGroupTop.get("year")?.setValue(this.fedexFormGroup.get('year')?.value);
    this.fedexFormGroupTop.get("accountNumber")?.setValue(this.fedexFormGroup.get('accountNumber')?.value);
    this.fedexFormGroupTop.get("month")?.setValue(this.fedexFormGroup.get('month')?.value);
    this.fedexFormGroupTop.get("monthFlag")?.setValue(this.fedexFormGroup.get('monthFlag')?.value);
    this.fedexFormGroupTop.get("chargeDescArray")?.setValue(this.fedexFormGroup.get('chargeDescArray')?.value);
    this.fedexFormGroupTop.get("fetchProcessRecord")?.setValue(this.fedexFormGroup.get('fetchProcessRecord')?.value);
    this.fedexFormGroupTop.get("chargeGroup")?.setValue(this.fedexFormGroup.get('chargeGroup')?.value);
    this.fedexFormGroupTop.get("year_1")?.setValue(this.fedexFormGroup.get('year_1')?.value);
    this.fedexFormGroupTop.get("primaryAccountNumber")?.setValue(this.fedexFormGroup.get('primaryAccountNumber')?.value);
    this.fedexFormGroupTop.get("selectedMonth")?.setValue(this.fedexFormGroup.get('selectedMonth')?.value);
    this.fedexFormGroupTop.get("zoneChargeType")?.setValue(this.fedexFormGroup.get('zoneChargeType')?.value);
    this.fedexFormGroupTop.get("chargeDescription")?.setValue(this.fedexFormGroup.get('chargeDescription')?.value);
    this.fedexFormGroupTop.get("createdDate")?.setValue(this.fedexFormGroup.get('createdDate')?.value);
    this.fedexFormGroupTop.get("requesteddttm")?.setValue(this.fedexFormGroup.get('requesteddttm')?.value);
    this.fedexFormGroupTop.get("reportName")?.setValue(this.fedexFormGroup.get('reportName')?.value);
    this.fedexFormGroupTop.get("reportType")?.setValue(this.fedexFormGroup.get('reportType')?.value);
    this.fedexFormGroupTop.get("chargeDesc")?.setValue(this.fedexFormGroup.get('chargeDesc')?.value);
    this.fedexFormGroupTop.get("reportFormat")?.setValue(this.fedexFormGroup.get('reportFormat')?.value);
    this.fedexFormGroupTop.get("fromDate")?.setValue(this.fedexFormGroup.get('fromDate')?.value);
    this.fedexFormGroupTop.get("toDate")?.setValue(this.fedexFormGroup.get('toDate')?.value);
    this.fedexFormGroupTop.get("fromdate")?.setValue(this.fedexFormGroup.get('fromdate')?.value);
    this.fedexFormGroupTop.get("todate")?.setValue(this.fedexFormGroup.get('todate')?.value);
    this.fedexFormGroupTop.get("loginId")?.setValue(this.fedexFormGroup.get('loginId')?.value);
    this.fedexFormGroupTop.get("modulename")?.setValue(this.fedexFormGroup.get('modulename')?.value);
    this.fedexFormGroupTop.get("desc")?.setValue(this.fedexFormGroup.get('desc')?.value);
    this.fedexFormGroupTop.get("grp")?.setValue(this.fedexFormGroup.get('grp')?.value);
    this.fedexFormGroupTop.get("accNo")?.setValue(this.fedexFormGroup.get('accNo')?.value);
    this.fedexFormGroupTop.get("status")?.setValue(this.fedexFormGroup.get('status')?.value);

    /* ---------- API CALL ---------- */
    this.httpfedexService
      .fetchdashBoard(this.fedexFormGroupTop.value)
      .subscribe(
        (result: any) => {

          if (monthFlag == "N") {
            if (chargeType == "FRTWithAcc") {
              this.fedexFormGroupTop.get('chargeType')?.setValue("FRTWithAcc");
            } else {
              this.fedexFormGroupTop.get('chargeType')?.setValue("FRT");
            }
          }

          this.formingTransportationSummaryTop(result);
        },
        error => {
          // error handling intentionally unchanged
        }
      );
  }

  async formingTransportationSummaryTop(event: any[]): Promise<void> {
    this.totalTransSummAC1.set(0);
    if (!event || event.length == 0) {
      return;
    }
    const T201DashboardObj = event[0];
    const accountVal = this.fedexFormGroup.get('accountNumber')?.value;
    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;

    if (accountVal == null) {
      if (monthFlag == "Y") {
        this.totalTransSummAC1.set(this.checkValueNull(T201DashboardObj.ymnetAmountByFrt));
      } else {
        this.totalTransSummAC1.set(this.checkValueNull(T201DashboardObj.ytotalNetCharge));
      }
    } else {
      if (monthFlag == "Y") {
        this.totalTransSummAC1.set(this.checkValueNull(T201DashboardObj.amnetAmountByFrt));
      } else {
        this.totalTransSummAC1.set(this.checkValueNull(T201DashboardObj.aytotalNetCharge));
      }
    }
  }
  bindingTitleFedex(): void {
    this.closeLoading();

    const yearData = this.fedexFormGroup.get('year')?.value;
    const monthData = this.fedexFormGroup.get('month')?.value;
    const chargeType = this.fedexFormGroup.get('chargeType')?.value;

    this.year_Select = yearData;
    this.month_Select = monthData;
    this.yearBindingTitle.set(yearData);

    if (monthData == null) {
      this.monthBindingTitle.set('');
    } else {
      const monthArray = [
        'All', 'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ];
      this.monthBindingTitle.set(monthArray[monthData]);
    }

    this.frtaccBindingTitle.set(chargeType == 'FRT' ? ' ( FRT only )' : '');

    this.panelClass =
      this.themeoption == 'dark'
        ? 'page-dark'
        : 'custom-dialog-panel-class';
  }
  t201dashResultACYear: any;
  fetchTotalSpendVal: any;

  fetchdashBoardInitialResult(result: any[]): void {
    const t201dashResultAC = result;
    this.fetchTotalSpendVal = result;
    this.t201dashResultACYear = [];
    this.T201DashboardObj = [];
    this.totalPackCount.set(0);
    this.totalPackCost.set(0);
    const clickedYear = this.fedexFormGroup.get('year')?.value;
    for (let loop = 0; loop < t201dashResultAC.length; loop++) {
      this.t201dashResultACYear = t201dashResultAC[loop];

      if (clickedYear == this.t201dashResultACYear.year) {
        this.T201DashboardObj = this.t201dashResultACYear;
      }
    }
    this.formingTransportationSummary();
    this.fetchTotalSpendResult(result);
  }

  tempyearNetchargeFRTFedex: string = '';
  tempyearcostperpackageFRTWithSURYTD: string = '';
  tempyearcostperpackageFRTFedex: string = '';
  tempyearcostperlbFRTWithSURYTD: string = '';
  tempyearcostperlbFRTYTD: string = '';
  tempyearbilledweightFRTWithSURYTD: string = '';
  tempyearenteredWeightFRT: string = '';
  tempyearenteredweightFRTWithSURYTD: string = '';//9069
  tempyearbilledWeightFRT: string = '';//9069
  tempyearweightdiffFRTWithSURYTD: string = '';
  tempyearweightdiffYTDFedex: string = '';
  tempnetchargeFRTWithSURYTD: string = '';
  formingTransportationSummary(): void {

    const totalTransSummACVal: any[] = [];
    this.totalTransSummAC.set([]);
    const totalTransSummObj: any = {};

    const accountVal = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;

    if (accountVal == "ALL") {
      if (monthFlag == "Y") {

        this.tempyearNetchargeFRTFedex = this.t201DashStaticCurrentYRObj.ynetAmountByFrt;
        this.tempnetchargeFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ynetAmountByFrtWithAcc;

        this.tempyearcostperpackageFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ytotalCostPerPackageByFrtWithAcc;
        this.tempyearcostperpackageFRTFedex = this.t201DashStaticCurrentYRObj.ytotalCostPerPackageByFrt;

        this.tempyearcostperlbFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ytotalCostPerLbFrtwithAcc;
        this.tempyearcostperlbFRTYTD = this.t201DashStaticCurrentYRObj.ytotalCostPerkgsFRTWithAcc;

        this.tempyearbilledweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ybilledWeight;
        this.tempyearbilledWeightFRT = this.t201DashStaticCurrentYRObj.ybilledWeightkgs;

        this.tempyearenteredweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.yenterWeight;
        this.tempyearenteredWeightFRT = this.t201DashStaticCurrentYRObj.yenterWeightkgs;


        this.tempyearweightdiffFRTWithSURYTD = this.t201DashStaticCurrentYRObj.yweightDifference;
        this.tempyearweightdiffYTDFedex = this.t201DashStaticCurrentYRObj.yweightDifferencekgs;



        //NET TRANSPORTATION CHARGE
        totalTransSummObj['netTrans_YTD'] = this.checkValueNull(this.tempnetchargeFRTWithSURYTD);
        totalTransSummObj['netTrans_FRT_YTD'] = this.checkValueNull(this.tempyearNetchargeFRTFedex);

        totalTransSummObj['netTrans_Value'] = this.checkValueNull(this.T201DashboardObj.ymnetAmountByFrtWithAcc);
        totalTransSummObj['netTrans_FRT_value'] = this.checkValueNull(this.T201DashboardObj.ymnetAmountByFrt);

        //COST PER PACKAGE
        totalTransSummObj['costPackage_YTD'] = this.checkValueNull(this.tempyearcostperpackageFRTWithSURYTD);
        totalTransSummObj['costPackage_FRT_YTD'] = this.checkValueNull(this.tempyearcostperpackageFRTFedex);

        totalTransSummObj['costPackage_Value'] = this.checkValueNull(this.T201DashboardObj.ymtotalCostPerPackageByFrtWithAcc);
        totalTransSummObj['costPackage_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ymtotalCostPerPackageByFrt);

        //COST PER LB.
        totalTransSummObj['costLB_YTD'] = this.checkValueNull(this.tempyearcostperlbFRTWithSURYTD);
        totalTransSummObj['costLB_Value'] = this.checkValueNull(this.T201DashboardObj.ymtotalCostPerLbFrtwithAcc);
        //new enry
        totalTransSummObj['costLB_FRT_YTD'] = this.checkValueNull(this.tempyearcostperlbFRTYTD);
        totalTransSummObj['costLB_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ymtotalCostPerkgsFRTWithAcc);

        //BILLED WT
        totalTransSummObj['billWT_YTD'] = this.checkValueNull(this.tempyearbilledweightFRTWithSURYTD);
        totalTransSummObj['billWT_Value'] = this.checkValueNull(this.T201DashboardObj.ymbilledWeight);
        //new enry
        totalTransSummObj['billWT_FRT_YTD'] = this.checkValueNull(this.tempyearbilledWeightFRT);//906)9

        totalTransSummObj['billWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ymbilledWeightkgs);

        //ENTERED WT
        totalTransSummObj['enterWT_YTD'] = this.checkValueNull(this.tempyearenteredweightFRTWithSURYTD);//906)9
        totalTransSummObj['enterWT_Value'] = this.checkValueNull(this.T201DashboardObj.ymenterWeight);//906)9
        //new enry
        totalTransSummObj['enterWT_FRT_YTD'] = this.checkValueNull(this.tempyearenteredWeightFRT);//906)9
        totalTransSummObj['enterWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ymenterWeightkgs);//906)9

        //SCC Charge
        totalTransSummObj['weightDiff_YTD'] = this.checkValueNull(this.tempyearweightdiffFRTWithSURYTD);
        totalTransSummObj['weightDiff_Value'] = this.checkValueNull(this.T201DashboardObj.ymweightDifference);
        //new enry
        totalTransSummObj['weightDiff_FRT_YTD'] = this.checkValueNull(this.tempyearweightdiffYTDFedex);
        totalTransSummObj['weightDiff_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ymweightDifferencekgs);

        //Package Count
        totalTransSummObj['packageCount_Value'] = this.checkValueNull(this.T201DashboardObj.ymtotalPackageCount);

        //Average Weight Lb & Kg
        totalTransSummObj['averageWeightLBS_Value'] = this.checkValueNull(this.T201DashboardObj.ymbilledWeight / this.T201DashboardObj.ymtotalPackageCountLbs);
        totalTransSummObj['averageWeightKGS_Value'] = this.checkValueNull(this.T201DashboardObj.ymbilledWeightkgs / this.T201DashboardObj.ymtotalPackageCountKgs);

      }
      else {

        //for ytd
        this.tempyearNetchargeFRTFedex = this.t201DashStaticCurrentYRObj.ynetAmountByFrt;
        this.tempnetchargeFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ynetAmountByFrtWithAcc;

        this.tempyearcostperpackageFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ytotalCostPerPackageByFrtWithAcc;
        this.tempyearcostperpackageFRTFedex = this.t201DashStaticCurrentYRObj.ytotalCostPerPackageByFrt;

        this.tempyearcostperlbFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ytotalCostPerLbFrtwithAcc;
        this.tempyearcostperlbFRTYTD = this.t201DashStaticCurrentYRObj.ytotalCostPerkgsFRTWithAcc;

        this.tempyearbilledweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ybilledWeight;
        this.tempyearbilledWeightFRT = this.t201DashStaticCurrentYRObj.ybilledWeightkgs;

        this.tempyearenteredweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.yenterWeight;
        this.tempyearenteredWeightFRT = this.t201DashStaticCurrentYRObj.yenterWeightkgs;

        this.tempyearweightdiffFRTWithSURYTD = this.t201DashStaticCurrentYRObj.yweightDifference;
        this.tempyearweightdiffYTDFedex = this.t201DashStaticCurrentYRObj.yweightDifferencekgs;


        //NET TRANSPORTATION CHARGE
        totalTransSummObj['netTrans_YTD'] = this.checkValueNull(this.tempnetchargeFRTWithSURYTD);
        totalTransSummObj['netTrans_FRT_YTD'] = this.checkValueNull(this.tempyearNetchargeFRTFedex);

        totalTransSummObj['netTrans_Value'] = this.checkValueNull(this.T201DashboardObj.ynetAmountByFrtWithAcc);
        totalTransSummObj['netTrans_FRT_value'] = this.checkValueNull(this.T201DashboardObj.ynetAmountByFrt);
        //COST PER PACKAGE
        totalTransSummObj['costPackage_YTD'] = this.checkValueNull(this.tempyearcostperpackageFRTWithSURYTD);
        totalTransSummObj['costPackage_FRT_YTD'] = this.checkValueNull(this.tempyearcostperpackageFRTFedex);

        totalTransSummObj['costPackage_Value'] = this.checkValueNull(this.T201DashboardObj.ytotalCostPerPackageByFrtWithAcc);
        totalTransSummObj['costPackage_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ytotalCostPerPackageByFrt);

        //COST PER LB.
        totalTransSummObj['costLB_YTD'] = this.checkValueNull(this.tempyearcostperlbFRTWithSURYTD);
        totalTransSummObj['costLB_Value'] = this.checkValueNull(this.T201DashboardObj.ytotalCostPerLbFrtwithAcc);
        //new enry
        totalTransSummObj['costLB_FRT_YTD'] = this.checkValueNull(this.tempyearcostperlbFRTYTD);
        totalTransSummObj['costLB_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ytotalCostPerkgsFRTWithAcc);

        //BILLED WT
        totalTransSummObj['billWT_YTD'] = this.checkValueNull(this.tempyearbilledweightFRTWithSURYTD);
        totalTransSummObj['billWT_Value'] = this.checkValueNull(this.T201DashboardObj.ybilledWeight);
        //new enry
        totalTransSummObj['billWT_FRT_YTD'] = this.checkValueNull(this.tempyearbilledWeightFRT);

        totalTransSummObj['billWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ybilledWeightkgs);

        //ENTERED WT
        totalTransSummObj['enterWT_YTD'] = this.checkValueNull(this.tempyearenteredweightFRTWithSURYTD);
        totalTransSummObj['enterWT_Value'] = this.checkValueNull(this.T201DashboardObj.yenterWeight);
        //new enry
        totalTransSummObj['enterWT_FRT_YTD'] = this.checkValueNull(this.tempyearenteredWeightFRT);
        totalTransSummObj['enterWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.yenterWeightkgs);

        //Weight Difference
        totalTransSummObj['weightDiff_YTD'] = this.checkValueNull(this.tempyearweightdiffFRTWithSURYTD);
        totalTransSummObj['weightDiff_Value'] = this.checkValueNull(this.T201DashboardObj.yweightDifference);
        //new enry
        totalTransSummObj['weightDiff_FRT_YTD'] = this.checkValueNull(this.tempyearweightdiffYTDFedex);
        totalTransSummObj['weightDiff_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.yweightDifferencekgs);

        //Package Count
        totalTransSummObj['packageCount_Value'] = this.checkValueNull(this.T201DashboardObj.ytotalPackageCount);

        //Average Weight Lb & Kg
        totalTransSummObj['averageWeightLBS_Value'] = this.checkValueNull(this.T201DashboardObj.ybilledWeight / this.T201DashboardObj.ytotalPackageCountLbs);
        totalTransSummObj['averageWeightKGS_Value'] = this.checkValueNull(this.T201DashboardObj.ybilledWeightkgs / this.T201DashboardObj.ytotalPackageCountKgs);
      }

    }
    else {
      if (monthFlag == "Y") {
        this.tempyearNetchargeFRTFedex = this.t201DashStaticCurrentYRObj.aynetAmountByFrt;
        this.tempnetchargeFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aynetAmountByFrtWithAcc;

        this.tempyearcostperpackageFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aytotalCostPerPackageByFrtWithAcc;
        this.tempyearcostperpackageFRTFedex = this.t201DashStaticCurrentYRObj.aytotalCostPerPackageByFrt;

        this.tempyearcostperlbFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aytotalCostPerLbFrtwithAcc;
        this.tempyearcostperlbFRTYTD = this.t201DashStaticCurrentYRObj.aytotalCostPerkgsFRTWithAcc;

        this.tempyearbilledweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aybilledWeight;
        this.tempyearbilledWeightFRT = this.t201DashStaticCurrentYRObj.aybilledWeightkgs;//9069

        this.tempyearenteredweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ayenterWeight;//9069
        this.tempyearenteredWeightFRT = this.t201DashStaticCurrentYRObj.ayenterWeightkgs;//9069

        this.tempyearweightdiffFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ayweightDifference;
        this.tempyearweightdiffYTDFedex = this.t201DashStaticCurrentYRObj.ayweightDifferencekgs;



        //NET TRANSPORTATION CHARGE
        totalTransSummObj['netTrans_YTD'] = this.checkValueNull(this.tempnetchargeFRTWithSURYTD);
        totalTransSummObj['netTrans_FRT_YTD'] = this.checkValueNull(this.tempyearNetchargeFRTFedex);

        totalTransSummObj['netTrans_Value'] = this.checkValueNull(this.T201DashboardObj.amnetAmountByFrtWithAcc);
        totalTransSummObj['netTrans_FRT_value'] = this.checkValueNull(this.T201DashboardObj.amnetAmountByFrt);

        //COST PER PACKAGE
        totalTransSummObj['costPackage_YTD'] = this.checkValueNull(this.tempyearcostperpackageFRTWithSURYTD);
        totalTransSummObj['costPackage_FRT_YTD'] = this.checkValueNull(this.tempyearcostperpackageFRTFedex);

        totalTransSummObj['costPackage_Value'] = this.checkValueNull(this.T201DashboardObj.amtotalCostPerPackageByFrtWithAcc);
        totalTransSummObj['costPackage_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.amtotalCostPerPackageByFrt);

        //COST PER LB.
        totalTransSummObj['costLB_YTD'] = this.checkValueNull(this.tempyearcostperlbFRTWithSURYTD);
        totalTransSummObj['costLB_Value'] = this.checkValueNull(this.T201DashboardObj.amtotalCostPerLbFrtwithAcc);
        //new enry
        totalTransSummObj['costLB_FRT_YTD'] = this.checkValueNull(this.tempyearcostperlbFRTYTD);
        totalTransSummObj['costLB_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.amtotalCostPerkgsFRTWithAcc);

        //BILLED WT
        totalTransSummObj['billWT_YTD'] = this.checkValueNull(this.tempyearbilledweightFRTWithSURYTD);
        totalTransSummObj['billWT_Value'] = this.checkValueNull(this.T201DashboardObj.ambilledWeight);
        //new enry
        totalTransSummObj['billWT_FRT_YTD'] = this.checkValueNull(this.tempyearbilledWeightFRT);
        totalTransSummObj['billWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ambilledWeightkgs);

        //ENTERED WT
        totalTransSummObj['enterWT_YTD'] = this.checkValueNull(this.tempyearenteredweightFRTWithSURYTD);
        totalTransSummObj['enterWT_Value'] = this.checkValueNull(this.T201DashboardObj.amenterWeight);
        //new enry
        totalTransSummObj['enterWT_FRT_YTD'] = this.checkValueNull(this.tempyearenteredWeightFRT);
        totalTransSummObj['enterWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.amenterWeightkgs);

        //SCC Charge
        totalTransSummObj['weightDiff_YTD'] = this.checkValueNull(this.tempyearweightdiffFRTWithSURYTD);
        totalTransSummObj['weightDiff_Value'] = this.checkValueNull(this.T201DashboardObj.amweightDifference);
        //new enry
        totalTransSummObj['weightDiff_FRT_YTD'] = this.checkValueNull(this.tempyearweightdiffYTDFedex);
        totalTransSummObj['weightDiff_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.amweightDifferencekgs);

        //Package Count
        totalTransSummObj['packageCount_Value'] = this.checkValueNull(this.T201DashboardObj.amtotalPackageCount);

        //Average Weight Lb & Kg
        totalTransSummObj['averageWeightLBS_Value'] = this.checkValueNull(this.T201DashboardObj.ambilledWeight / this.T201DashboardObj.amtotalPackageCountLbs);
        totalTransSummObj['averageWeightKGS_Value'] = this.checkValueNull(this.T201DashboardObj.ambilledWeightkgs / this.T201DashboardObj.amtotalPackageCountKgs);
      }
      else {


        //for ytd
        this.tempyearNetchargeFRTFedex = this.t201DashStaticCurrentYRObj.aynetAmountByFrt;
        this.tempnetchargeFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aynetAmountByFrtWithAcc;

        this.tempyearcostperpackageFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aytotalCostPerPackageByFrtWithAcc;
        this.tempyearcostperpackageFRTFedex = this.t201DashStaticCurrentYRObj.aytotalCostPerPackageByFrt;

        this.tempyearcostperlbFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aytotalCostPerLbFrtwithAcc;
        this.tempyearcostperlbFRTYTD = this.t201DashStaticCurrentYRObj.aytotalCostPerkgsFRTWithAcc;

        this.tempyearbilledweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.aybilledWeight;
        this.tempyearbilledWeightFRT = this.t201DashStaticCurrentYRObj.aybilledWeightkgs;

        this.tempyearenteredweightFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ayenterWeight;
        this.tempyearenteredWeightFRT = this.t201DashStaticCurrentYRObj.ayenterWeightkgs;

        this.tempyearweightdiffFRTWithSURYTD = this.t201DashStaticCurrentYRObj.ayweightDifference;
        this.tempyearweightdiffYTDFedex = this.t201DashStaticCurrentYRObj.ayweightDifferencekgs;

        //NET TRANSPORTATION CHARGE
        totalTransSummObj['netTrans_Value'] = this.checkValueNull(this.T201DashboardObj.aynetAmountByFrtWithAcc);
        totalTransSummObj['netTrans_FRT_value'] = this.checkValueNull(this.T201DashboardObj.aynetAmountByFrt);

        //COST PER PACKAGE
        totalTransSummObj['costPackage_Value'] = this.checkValueNull(this.T201DashboardObj.aytotalCostPerPackageByFrtWithAcc);
        totalTransSummObj['costPackage_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.aytotalCostPerPackageByFrt);

        //COST PER LB.
        totalTransSummObj['costLB_Value'] = this.checkValueNull(this.T201DashboardObj.aytotalCostPerLbFrtwithAcc);
        //new enry
        totalTransSummObj['costLB_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.aytotalCostPerkgsFRTWithAcc);

        //BILLED WT
        totalTransSummObj['billWT_Value'] = this.checkValueNull(this.T201DashboardObj.aybilledWeight);
        //new enry
        totalTransSummObj['billWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.aybilledWeightkgs);

        //ENTERED WT
        totalTransSummObj['enterWT_Value'] = this.checkValueNull(this.T201DashboardObj.ayenterWeight);//906)9
        //new enry
        totalTransSummObj['enterWT_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ayenterWeightkgs);//906)9

        //SCC Charge
        totalTransSummObj['weightDiff_Value'] = this.checkValueNull(this.T201DashboardObj.ayweightDifference);
        //new enry
        totalTransSummObj['weightDiff_FRT_Value'] = this.checkValueNull(this.T201DashboardObj.ayweightDifferencekgs);

        //Package Count
        totalTransSummObj['packageCount_Value'] = this.checkValueNull(this.T201DashboardObj.aytotalPackageCount);

        //Average Weight Lb & Kg
        totalTransSummObj['averageWeightLBS_Value'] = this.checkValueNull(this.T201DashboardObj.aybilledWeight / this.T201DashboardObj.aytotalPackageCountLbs);
        totalTransSummObj['averageWeightKGS_Value'] = this.checkValueNull(this.T201DashboardObj.aybilledWeightkgs / this.T201DashboardObj.aytotalPackageCountKgs);
      }

    }

    totalTransSummACVal.push(totalTransSummObj);
    this.totalTransSummAC.set(totalTransSummACVal[0]);
    console.log(this.totalTransSummAC());
    this.closeLoading()
  }
  checkValueNull(event: any) {
    if (event == null) {
      var valueReturn = 0;
    }
    else {
      valueReturn = event;
    }
    return valueReturn;
  }
  fetchaccountDetailsFedex() {
    this.httpfedexService.fetchaccountDetails(this.fedexFormGroup.value)
      .subscribe(
        result => {
          this.fetchaccountDetailsFedexStr = result;

          this.fetchaccountDetailsFedexStr.forEach((item: any, index: any) => {
            if (!item.nickName) {
              this.fetchaccountDetailsFedexStr[index].nickName = item.primaryAccountNumber;
            } else {
              this.fetchaccountDetailsFedexStr[index].nickName =
                item.primaryAccountNumber + " - <span>" + item.nickName + "</span>";
            }
          });

          const AccNoObj: any = {
            primaryAccountNumber: 'ALL',
            nickName: 'ALL'
          };

          this.fetchaccountDetailsFedexStr.unshift(AccNoObj);
          this.fedExAccountNumber(this.fetchaccountDetailsFedexStr);
        },
        error => {
          // handle error
        }
      );
    this.closeLoading()
  }
  accountNumberList: any[] = [];

  fedExAccountNumber(event: any[]): void {
    const accNoObjAC = event;

    this.accountNumberList = [];

    for (let i = 0; i < accNoObjAC.length; i++) {
      this.accountNumberList.push(accNoObjAC[i]);
    }

    for (let i = 0; i < this.accountNumberList.length; i++) {
      const primaryAccNoObj: any = {};
      primaryAccNoObj['primaryAccountNumber'] =
        this.accountNumberList[i].primaryAccountNumber;
      primaryAccNoObj['nickName'] =
        this.accountNumberList[i].nickName;

      this.Accountoptions.push(primaryAccNoObj);
    }

    this.ExecMatSelctFunctions();
  }
  ExecMatSelctFunctions() {
    this.accNoCtrl.setValue({ 'primaryAccountNumber': "ALL" });
    this.filteredAccNo.next(this.Accountoptions.slice());

    // listen for search field value changes
    this.accNoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAccNo();
      });
  }
  private filterAccNo(): void {
    if (!this.Accountoptions || !this.filteredAccNo) {
      return;
    }

    let search = this.accNoFilterCtrl?.value;

    if (!search) {
      this.filteredAccNo.next([...this.Accountoptions]);
      return;
    }

    search = search.toLowerCase();

    this.filteredAccNo.next(
      this.Accountoptions.filter((clientx: any) =>
        clientx.primaryAccountNumber
          ?.toLowerCase()
          .indexOf(search) > -1
      )
    );
  }
  totalSpendObj = [];
  totalSpendObjYear = [];
  totalMonthZoneValue: any;
  t219DashboardZoneChartAC: any;
  fetchTotalSpendResult(result: any): void {
    this.closeLoading();

    const t201SpendAC = result;
    this.totalSpendService(t201SpendAC);
    this.initialDashBoardGrpSerFetch();
    this.formZoneDistribution();
  }
  async formZoneDistribution() {

    const primryAcc = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    const clientId = this.fedexFormGroup.get('clientId')?.value;

    if (primryAcc == "ALL") {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(clientId);
      await this.fedexFormGroup.get('accountNumber')?.setValue(null);
    }
    else {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(primryAcc);
      await this.fedexFormGroup.get('accountNumber')?.setValue(primryAcc);
    }

    this.httpfedexService.fetchZone(this.fedexFormGroup.value)?.subscribe(
      (result: any) => {

        this.t219DashboardZoneChartAC = result;
        this.fetchZoneDistibutiondashBoardRst(result);

        const primryAccNumber =
          this.fedexFormGroup.get('primaryAccountNumber')?.value;

        if (clientId == primryAccNumber) {
          this.fedexFormGroup.get('primaryAccountNumber')?.setValue("ALL");
          this.fedexFormGroup.get('accountNumber')?.setValue(null);
        }
        else {
          this.fedexFormGroup.get('primaryAccountNumber')?.setValue(primryAcc);
          this.fedexFormGroup.get('accountNumber')?.setValue(primryAcc);
        }
      },
      error => {
        // intentionally left blank (original logic)
      }
    );
  }

  dataasof: any;
  dataasoffFormat: any;
  async totalSpendService(t201SpendAC: any) {
    var totalSpendAC = [];
    var totalSpendObj;
    var totalSpendObjYear;
    //9059
    var clickedYear = this.fedexFormGroup.get("year")?.value;
    if (t201SpendAC != null && t201SpendAC.length != 0) {
      for (var loop = 0; loop < t201SpendAC.length; loop++) {
        totalSpendObjYear = t201SpendAC[loop];
        if (clickedYear == totalSpendObjYear.year) {
          totalSpendObj = totalSpendObjYear;
        }

      }
    }

    this.formWeightDistribution(totalSpendObj);
    var accountVal = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    var monthVal = this.fedexFormGroup.get('month')?.value;

    var date = new Date();
    var day = date.getDay();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var monthlastdate: any = this.datePipe.transform(monthStartDay, "MM/dd/yyyy");
    var strYearEnd = this.userProfifleFedex.fileenddate1.substring(0, 4);
    var strMonthEnd = this.userProfifleFedex.fileenddate1.substring(4, 6);
    var strDateEnd = this.userProfifleFedex.fileenddate1.substring(6, 8);
    var dataasof = await this.datePipe.transform(this.userProfifleFedex.fileEndDate1, "MM/dd/yyyy");
    this.dataasof = strMonthEnd + "/" + strDateEnd + "/" + strYearEnd;
    let dateVal: any = this.datePipe.transform(this.dataasof, "MM/dd/yyyy")
    this.dataasoffFormat = new Date(dateVal);
    var currentYear = (new Date()).getFullYear();
    var currentMonthSlt = this.datePipe.transform(monthStartDay, "MM/yyyy");
    var dataasofSlt = this.datePipe.transform(this.dataasof, "MM/yyyy");
    if (this.dataasof <= monthlastdate) {
      var selectedMonthFlog = true;
    } else {
      selectedMonthFlog = false;
    }
    if (t201SpendAC.length > 0) {
      if (accountVal == "ALL") {
        //JANUARY
        if (totalSpendObj.mtotalCount1 == "0" && totalSpendObj.mtotalSpend1 == "0.00") {
          totalSpendAC.push({ "MonthValue": "1", "Month": clickedYear + "-01" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "01/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "1", "Month": clickedYear + "-01", "Count": totalSpendObj.mtotalCount1 ? totalSpendObj.mtotalCount1 : 0, "NetAmount": totalSpendObj.mtotalSpend1 ? totalSpendObj.mtotalSpend1 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "1", "Month": clickedYear + "-01", "Count": totalSpendObj.mtotalCount1 ? totalSpendObj.mtotalCount1 : 0, "NetAmount": totalSpendObj.mtotalSpend1 ? totalSpendObj.mtotalSpend1 : 0 });
          }
        }
        //FEBRUARY
        if (totalSpendObj.mtotalCount2 == "0" && totalSpendObj.mtotalSpend2 == "0.00") {
          totalSpendAC.push({ "MonthValue": "2", "Month": clickedYear + "-02" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "02/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "2", "Month": clickedYear + "-02", "Count": totalSpendObj.mtotalCount2 ? totalSpendObj.mtotalCount2 : 0, "NetAmount": totalSpendObj.mtotalSpend2 ? totalSpendObj.mtotalSpend2 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "2", "Month": clickedYear + "-02", "Count": totalSpendObj.mtotalCount2 ? totalSpendObj.mtotalCount2 : 0, "NetAmount": totalSpendObj.mtotalSpend2 ? totalSpendObj.mtotalSpend2 : 0 });

          }
        }
        //MARCH
        if (totalSpendObj.mtotalCount3 == "0" && totalSpendObj.mtotalSpend3 == "0.00") {
          totalSpendAC.push({ "MonthValue": "3", "Month": clickedYear + "-03" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "03/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "3", "Month": clickedYear + "-03", "Count": totalSpendObj.mtotalCount3 ? totalSpendObj.mtotalCount3 : 0, "NetAmount": totalSpendObj.mtotalSpend3 ? totalSpendObj.mtotalSpend3 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "3", "Month": clickedYear + "-03", "Count": totalSpendObj.mtotalCount3 ? totalSpendObj.mtotalCount3 : 0, "NetAmount": totalSpendObj.mtotalSpend3 ? totalSpendObj.mtotalSpend3 : 0 });

          }

        }
        //APRIL
        if (totalSpendObj.mtotalCount4 == "0" && totalSpendObj.mtotalSpend4 == "0.00") {
          totalSpendAC.push({ "MonthValue": "4", "Month": clickedYear + "-04" });

        } else {
          if (selectedMonthFlog == true && dataasofSlt == "04/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "4", "Month": clickedYear + "-04", "Count": totalSpendObj.mtotalCount4 ? totalSpendObj.mtotalCount4 : 0, "NetAmount": totalSpendObj.mtotalSpend4 ? totalSpendObj.mtotalSpend4 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "4", "Month": clickedYear + "-04", "Count": totalSpendObj.mtotalCount4 ? totalSpendObj.mtotalCount4 : 0, "NetAmount": totalSpendObj.mtotalSpend4 ? totalSpendObj.mtotalSpend4 : 0 });

          }

        }
        //MAY
        if (totalSpendObj.mtotalCount5 == "0" && totalSpendObj.mtotalSpend5 == "0.00") {
          totalSpendAC.push({ "MonthValue": "5", "Month": clickedYear + "-05" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "05/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "5", "Month": clickedYear + "-05", "Count": totalSpendObj.mtotalCount5 ? totalSpendObj.mtotalCount5 : 0, "NetAmount": totalSpendObj.mtotalSpend5 ? totalSpendObj.mtotalSpend5 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "5", "Month": clickedYear + "-05", "Count": totalSpendObj.mtotalCount5 ? totalSpendObj.mtotalCount5 : 0, "NetAmount": totalSpendObj.mtotalSpend5 ? totalSpendObj.mtotalSpend5 : 0 });

          }
        }
        //JUNE
        if (totalSpendObj.mtotalCount6 == "0" && totalSpendObj.mtotalSpend6 == "0.00") {
          totalSpendAC.push({ "MonthValue": "6", "Month": clickedYear + "-06" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "06/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "6", "Month": clickedYear + "-06", "Count": totalSpendObj.mtotalCount6 ? totalSpendObj.mtotalCount6 : 0, "NetAmount": totalSpendObj.mtotalSpend6 ? totalSpendObj.mtotalSpend6 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "6", "Month": clickedYear + "-06", "Count": totalSpendObj.mtotalCount6 ? totalSpendObj.mtotalCount6 : 0, "NetAmount": totalSpendObj.mtotalSpend6 ? totalSpendObj.mtotalSpend6 : 0 });

          }
        }
        //JULY
        if (totalSpendObj.mtotalCount7 == "0" && totalSpendObj.mtotalSpend7 == "0.00") {
          totalSpendAC.push({ "MonthValue": "7", "Month": clickedYear + "-07" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "07/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "7", "Month": clickedYear + "-07", "Count": totalSpendObj.mtotalCount7 ? totalSpendObj.mtotalCount7 : 0, "NetAmount": totalSpendObj.mtotalSpend7 ? totalSpendObj.mtotalSpend7 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "7", "Month": clickedYear + "-07", "Count": totalSpendObj.mtotalCount7 ? totalSpendObj.mtotalCount7 : 0, "NetAmount": totalSpendObj.mtotalSpend7 ? totalSpendObj.mtotalSpend7 : 0 });

          }

        }
        //AUGUST
        if (totalSpendObj.mtotalCount8 == "0" && totalSpendObj.mtotalSpend8 == "0.00") {
          totalSpendAC.push({ "MonthValue": "8", "Month": clickedYear + "-08" });

        } else {
          if (selectedMonthFlog == true && dataasofSlt == "08/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "8", "Month": clickedYear + "-08", "Count": totalSpendObj.mtotalCount8 ? totalSpendObj.mtotalCount8 : 0, "NetAmount": totalSpendObj.mtotalSpend8 ? totalSpendObj.mtotalSpend8 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "8", "Month": clickedYear + "-08", "Count": totalSpendObj.mtotalCount8 ? totalSpendObj.mtotalCount8 : 0, "NetAmount": totalSpendObj.mtotalSpend8 ? totalSpendObj.mtotalSpend8 : 0 });

          }

        }
        //SEPTEMBER
        if (totalSpendObj.mtotalCount9 == "0" && totalSpendObj.mtotalSpend9 == "0.00") {
          totalSpendAC.push({ "MonthValue": "9", "Month": clickedYear + "-09" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "09/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "9", "Month": clickedYear + "-09", "Count": totalSpendObj.mtotalCount9 ? totalSpendObj.mtotalCount9 : 0, "NetAmount": totalSpendObj.mtotalSpend9 ? totalSpendObj.mtotalSpend9 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "9", "Month": clickedYear + "-09", "Count": totalSpendObj.mtotalCount9 ? totalSpendObj.mtotalCount9 : 0, "NetAmount": totalSpendObj.mtotalSpend9 ? totalSpendObj.mtotalSpend9 : 0 });

          }
        }
        //OCTOBER
        if (totalSpendObj.mtotalCount10 == "0" && totalSpendObj.mtotalSpend10 == "0.00") {
          totalSpendAC.push({ "MonthValue": "10", "Month": clickedYear + "-10" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "10/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "10", "Month": clickedYear + "-10", "Count": totalSpendObj.mtotalCount10 ? totalSpendObj.mtotalCount10 : 0, "NetAmount": totalSpendObj.mtotalSpend10 ? totalSpendObj.mtotalSpend10 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "10", "Month": clickedYear + "-10", "Count": totalSpendObj.mtotalCount10 ? totalSpendObj.mtotalCount10 : 0, "NetAmount": totalSpendObj.mtotalSpend10 ? totalSpendObj.mtotalSpend10 : 0 });

          }
        }
        //NOVEMBER
        if (totalSpendObj.mtotalCount11 == "0" && totalSpendObj.mtotalSpend11 == "0.00") {
          totalSpendAC.push({ "MonthValue": "11", "Month": clickedYear + "-11" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "11/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "11", "Month": clickedYear + "-11", "Count": totalSpendObj.mtotalCount11 ? totalSpendObj.mtotalCount11 : 0, "NetAmount": totalSpendObj.mtotalSpend11 ? totalSpendObj.mtotalSpend11 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "11", "Month": clickedYear + "-11", "Count": totalSpendObj.mtotalCount11 ? totalSpendObj.mtotalCount11 : 0, "NetAmount": totalSpendObj.mtotalSpend11 ? totalSpendObj.mtotalSpend11 : 0 });

          }
        }
        //DECEMBER
        if (totalSpendObj.mtotalCount12 == "0" && totalSpendObj.mtotalSpend12 == "0.00") {
          totalSpendAC.push({ "MonthValue": "12", "Month": clickedYear + "-12" });
        } else {
          if (selectedMonthFlog == true && dataasofSlt == "12/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "12", "Month": clickedYear + "-12", "Count": totalSpendObj.mtotalCount12 ? totalSpendObj.mtotalCount12 : 0, "NetAmount": totalSpendObj.mtotalSpend12 ? totalSpendObj.mtotalSpend12 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "12", "Month": clickedYear + "-12", "Count": totalSpendObj.mtotalCount12 ? totalSpendObj.mtotalCount12 : 0, "NetAmount": totalSpendObj.mtotalSpend12 ? totalSpendObj.mtotalSpend12 : 0 });
          }
        }

        this.totalPackCount.set(Number(totalSpendObj.mtotalCount1) +
          Number(totalSpendObj.mtotalCount2) +
          Number(totalSpendObj.mtotalCount3) +
          Number(totalSpendObj.mtotalCount4) +
          Number(totalSpendObj.mtotalCount5) +
          Number(totalSpendObj.mtotalCount6) +
          Number(totalSpendObj.mtotalCount7) +
          Number(totalSpendObj.mtotalCount8) +
          Number(totalSpendObj.mtotalCount9) +
          Number(totalSpendObj.mtotalCount10) +
          Number(totalSpendObj.mtotalCount11) +
          Number(totalSpendObj.mtotalCount12));
        this.totalPackCost.set(totalSpendObj.ytotalNetCharge);
        if (this.totalPackCost() == "" || this.totalPackCost() == null) {
          this.totalPackCost.set(0);
        }
        if (monthVal == "1")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend1;
        else if (monthVal == "2")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend2;
        else if (monthVal == "3")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend3;
        else if (monthVal == "4")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend4;
        else if (monthVal == "5")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend5;
        else if (monthVal == "6")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend6;
        else if (monthVal == "7")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend7;
        else if (monthVal == "8")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend8;
        else if (monthVal == "9")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend9;
        else if (monthVal == "10")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend10;
        else if (monthVal == "11")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend11;
        else if (monthVal == "12")
          this.totalMonthZoneValue = totalSpendObj.mtotalSpend12;

      }
      else {
        //JANUARY
        if (totalSpendObj.amtotalCount1 == "0" && totalSpendObj.amtotalSpend1 == "0.00") {
          totalSpendAC.push({ "MonthValue": "1", "Month": clickedYear + "-01" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "01/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "1", "Month": clickedYear + "-01", "Count": totalSpendObj.amtotalCount1 ? totalSpendObj.amtotalCount1 : 0, "NetAmount": totalSpendObj.amtotalSpend1 ? totalSpendObj.amtotalSpend1 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "1", "Month": clickedYear + "-01", "Count": totalSpendObj.amtotalCount1 ? totalSpendObj.amtotalCount1 : 0, "NetAmount": totalSpendObj.amtotalSpend1 ? totalSpendObj.amtotalSpend1 : 0 });
          }
        }
        //FEBRUARY
        if (totalSpendObj.amtotalCount2 == "0" && totalSpendObj.amtotalSpend2 == "0.00") {
          totalSpendAC.push({ "MonthValue": "2", "Month": clickedYear + "-02" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "02/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "2", "Month": clickedYear + "-02", "Count": totalSpendObj.amtotalCount2 ? totalSpendObj.amtotalCount2 : 0, "NetAmount": totalSpendObj.amtotalSpend2 ? totalSpendObj.amtotalSpend2 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "2", "Month": clickedYear + "-02", "Count": totalSpendObj.amtotalCount2 ? totalSpendObj.amtotalCount2 : 0, "NetAmount": totalSpendObj.amtotalSpend2 ? totalSpendObj.amtotalSpend2 : 0 });
          }
        }
        //MARCH
        if (totalSpendObj.amtotalCount3 == "0" && totalSpendObj.amtotalSpend3 == "0.00") {
          totalSpendAC.push({ "MonthValue": "3", "Month": clickedYear + "-03" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "03/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "3", "Month": clickedYear + "-03", "Count": totalSpendObj.amtotalCount3 ? totalSpendObj.amtotalCount3 : 0, "NetAmount": totalSpendObj.amtotalSpend3 ? totalSpendObj.amtotalSpend3 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "3", "Month": clickedYear + "-03", "Count": totalSpendObj.amtotalCount3 ? totalSpendObj.amtotalCount3 : 0, "NetAmount": totalSpendObj.amtotalSpend3 ? totalSpendObj.amtotalSpend3 : 0 });
          }
        }
        //APRIL
        if (totalSpendObj.amtotalCount4 == "0" && totalSpendObj.amtotalSpend4 == "0.00") {
          totalSpendAC.push({ "MonthValue": "4", "Month": clickedYear + "-04" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "04/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "4", "Month": clickedYear + "-04", "Count": totalSpendObj.amtotalCount4 ? totalSpendObj.amtotalCount4 : 0, "NetAmount": totalSpendObj.amtotalSpend4 ? totalSpendObj.amtotalSpend4 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "4", "Month": clickedYear + "-04", "Count": totalSpendObj.amtotalCount4 ? totalSpendObj.amtotalCount4 : 0, "NetAmount": totalSpendObj.amtotalSpend4 ? totalSpendObj.amtotalSpend4 : 0 });
          }
        }
        //MAY
        if (totalSpendObj.amtotalCount5 == "0" && totalSpendObj.amtotalSpend5 == "0.00") {
          totalSpendAC.push({ "MonthValue": "5", "Month": clickedYear + "-05" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "05/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "5", "Month": clickedYear + "-05", "Count": totalSpendObj.amtotalCount5 ? totalSpendObj.amtotalCount5 : 0, "NetAmount": totalSpendObj.amtotalSpend5 ? totalSpendObj.amtotalSpend5 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "5", "Month": clickedYear + "-05", "Count": totalSpendObj.amtotalCount5 ? totalSpendObj.amtotalCount5 : 0, "NetAmount": totalSpendObj.amtotalSpend5 ? totalSpendObj.amtotalSpend5 : 0 });
          }
        }
        //JUNE
        if (totalSpendObj.amtotalCount6 == "0" && totalSpendObj.amtotalSpend6 == "0.00") {
          totalSpendAC.push({ "MonthValue": "6", "Month": clickedYear + "-06" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "06/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "6", "Month": clickedYear + "-06", "Count": totalSpendObj.amtotalCount6 ? totalSpendObj.amtotalCount6 : 0, "NetAmount": totalSpendObj.amtotalSpend6 ? totalSpendObj.amtotalSpend6 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "6", "Month": clickedYear + "-06", "Count": totalSpendObj.amtotalCount6 ? totalSpendObj.amtotalCount6 : 0, "NetAmount": totalSpendObj.amtotalSpend6 ? totalSpendObj.amtotalSpend6 : 0 });
          }
        }
        //JULY
        if (totalSpendObj.amtotalCount7 == "0" && totalSpendObj.amtotalSpend7 == "0.00") {
          totalSpendAC.push({ "MonthValue": "7", "Month": clickedYear + "-07" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "07/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "7", "Month": clickedYear + "-07", "Count": totalSpendObj.amtotalCount7 ? totalSpendObj.amtotalCount7 : 0, "NetAmount": totalSpendObj.amtotalSpend7 ? totalSpendObj.amtotalSpend7 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "7", "Month": clickedYear + "-07", "Count": totalSpendObj.amtotalCount7 ? totalSpendObj.amtotalCount7 : 0, "NetAmount": totalSpendObj.amtotalSpend7 ? totalSpendObj.amtotalSpend7 : 0 });
          }
        }
        //AUGUST
        if (totalSpendObj.amtotalCount8 == "0" && totalSpendObj.amtotalSpend8 == "0.00") {
          totalSpendAC.push({ "MonthValue": "8", "Month": clickedYear + "-08" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "08/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "8", "Month": clickedYear + "-08", "Count": totalSpendObj.amtotalCount8 ? totalSpendObj.amtotalCount8 : 0, "NetAmount": totalSpendObj.amtotalSpend8 ? totalSpendObj.amtotalSpend8 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "8", "Month": clickedYear + "-08", "Count": totalSpendObj.amtotalCount8 ? totalSpendObj.amtotalCount8 : 0, "NetAmount": totalSpendObj.amtotalSpend8 ? totalSpendObj.amtotalSpend8 : 0 });
          }
        }
        //SEPTEMBER
        if (totalSpendObj.amtotalCount9 == "0" && totalSpendObj.amtotalSpend9 == "0.00") {
          totalSpendAC.push({ "MonthValue": "9", "Month": clickedYear + "-09" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "09/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "9", "Month": clickedYear + "-09", "Count": totalSpendObj.amtotalCount9 ? totalSpendObj.amtotalCount9 : 0, "NetAmount": totalSpendObj.amtotalSpend9 ? totalSpendObj.amtotalSpend9 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "9", "Month": clickedYear + "-09", "Count": totalSpendObj.amtotalCount9 ? totalSpendObj.amtotalCount9 : 0, "NetAmount": totalSpendObj.amtotalSpend9 ? totalSpendObj.amtotalSpend9 : 0 });
          }
        }
        //OCTOBER
        if (totalSpendObj.amtotalCount10 == "0" && totalSpendObj.amtotalSpend10 == "0.00") {
          totalSpendAC.push({ "MonthValue": "10", "Month": clickedYear + "-10" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "10/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "10", "Month": clickedYear + "-10", "Count": totalSpendObj.amtotalCount10 ? totalSpendObj.amtotalCount10 : 0, "NetAmount": totalSpendObj.amtotalSpend10 ? totalSpendObj.amtotalSpend10 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "10", "Month": clickedYear + "-10", "Count": totalSpendObj.amtotalCount10 ? totalSpendObj.amtotalCount10 : 0, "NetAmount": totalSpendObj.amtotalSpend10 ? totalSpendObj.amtotalSpend10 : 0 });
          }
        }
        //NOVEMBER
        if (totalSpendObj.amtotalCount11 == "0" && totalSpendObj.amtotalSpend11 == "0.00") {
          totalSpendAC.push({ "MonthValue": "11", "Month": clickedYear + "-11" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "11/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "11", "Month": clickedYear + "-11", "Count": totalSpendObj.amtotalCount11 ? totalSpendObj.amtotalCount11 : 0, "NetAmount": totalSpendObj.amtotalSpend11 ? totalSpendObj.amtotalSpend11 : 0, "dashLength": 8, "alpha": 0.4 });
          } else {
            totalSpendAC.push({ "MonthValue": "11", "Month": clickedYear + "-11", "Count": totalSpendObj.amtotalCount11 ? totalSpendObj.amtotalCount11 : 0, "NetAmount": totalSpendObj.amtotalSpend11 ? totalSpendObj.amtotalSpend11 : 0 });
          }
        }
        //DECEMBER
        if (totalSpendObj.amtotalCount12 == "0" && totalSpendObj.amtotalSpend12 == "0.00") {
          totalSpendAC.push({ "MonthValue": "12", "Month": clickedYear + "-12" });
        }
        else {
          if (selectedMonthFlog == true && dataasofSlt == "12/" + clickedYear) {
            totalSpendAC.push({ "MonthValue": "12", "Month": clickedYear + "-12", "Count": totalSpendObj.amtotalCount12 ? totalSpendObj.amtotalCount12 : 0, "NetAmount": totalSpendObj.amtotalSpend12 ? totalSpendObj.amtotalSpend12 : 0, "dashLength": 8, "alpha": 0.4 });

          } else {
            totalSpendAC.push({ "MonthValue": "12", "Month": clickedYear + "-12", "Count": totalSpendObj.amtotalCount12 ? totalSpendObj.amtotalCount12 : 0, "NetAmount": totalSpendObj.amtotalSpend12 ? totalSpendObj.amtotalSpend12 : 0 });

          }
        }

        this.totalPackCount.set(Number(totalSpendObj.amtotalCount1) +
          Number(totalSpendObj.amtotalCount2) +
          Number(totalSpendObj.amtotalCount3) +
          Number(totalSpendObj.amtotalCount4) +
          Number(totalSpendObj.amtotalCount5) +
          Number(totalSpendObj.amtotalCount6) +
          Number(totalSpendObj.amtotalCount7) +
          Number(totalSpendObj.amtotalCount8) +
          Number(totalSpendObj.amtotalCount9) +
          Number(totalSpendObj.amtotalCount10) +
          Number(totalSpendObj.amtotalCount11) +
          Number(totalSpendObj.amtotalCount12));
        this.totalPackCost.set(totalSpendObj.aytotalNetCharge);
        if (this.totalPackCost() == "" || this.totalPackCost() == null) {
          this.totalPackCost.set(0);
        }
        if (monthVal == "1")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend1;
        else if (monthVal == "2")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend2;
        else if (monthVal == "3")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend3;
        else if (monthVal == "4")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend4;
        else if (monthVal == "5")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend5;
        else if (monthVal == "6")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend6;
        else if (monthVal == "7")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend7;
        else if (monthVal == "8")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend8;
        else if (monthVal == "9")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend9;
        else if (monthVal == "10")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend10;
        else if (monthVal == "11")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend11;
        else if (monthVal == "12")
          this.totalMonthZoneValue = totalSpendObj.amtotalSpend12;
      }
    }
    this.TotalSpend_bar_chart(totalSpendAC);
  }
  totalWgtDistbution = signal<any>('');

  async formWeightDistribution(totalSpendObj: any) {
    if (totalSpendObj != undefined) {
      if (Object.keys(totalSpendObj).length > 0) {
        var clickedMonth = this.fedexFormGroup.get('month')?.value;
        var monthFlag = this.fedexFormGroup.get('monthFlag')?.value;
        var accountVal = this.fedexFormGroup.get('primaryAccountNumber')?.value;
        var chargeType = this.fedexFormGroup.get('chargeType')?.value;
        this.totalWgtDistbution.set("0");
        var weightDistObj: any = [];
        if (accountVal == null || accountVal == "ALL") { //9126
          if (monthFlag == "Y") {

            weightDistObj['wdValue1'] = totalSpendObj.ymbilledDistribution1;
            weightDistObj['wdValue2'] = totalSpendObj.ymbilledWeightDistribution2;
            weightDistObj['wdValue3'] = totalSpendObj.ymbilledWeightDistribution3;
            weightDistObj['wdValue4'] = totalSpendObj.ymbilledWeightDistribution4;
            weightDistObj['wdValue5'] = totalSpendObj.ymbilledWeightDistribution5;
            weightDistObj['wdValue6'] = totalSpendObj.ymbilledWeightDistribution6to10;
            weightDistObj['wdValue7'] = totalSpendObj.ymbilledWeightDistribution10to20;
            weightDistObj['wdValue8'] = totalSpendObj.ymbilledWeightDistribution20to30;
            weightDistObj['wdValue9'] = totalSpendObj.ymbilledWeightDistribution30to50;
            weightDistObj['wdValue10'] = totalSpendObj.ymbilledWeightDistribution50to70;
            weightDistObj['wdValue11'] = totalSpendObj.ymbilledWeightDistribution70to150;
            weightDistObj['wdValue12'] = totalSpendObj.ymbilledWeightDistribution150;
            //  weightDistObj['wdValue13']=totalSpendObj.ymbilledWeightDistribution0to16oz;
            weightDistObj['wdValue13'] = totalSpendObj.ymbilledWeightDistributionLtr;
            this.totalWgtDistbution.set(totalSpendObj.ymtotalNetCharge);
            if (this.totalWgtDistbution() == "" || this.totalWgtDistbution() == null) {
              this.totalWgtDistbution.set("0");
            }
          }
          else {
            weightDistObj['wdValue1'] = totalSpendObj.ybilledDistribution1;
            weightDistObj['wdValue2'] = totalSpendObj.ybilledWeightDistribution2;
            weightDistObj['wdValue3'] = totalSpendObj.ybilledWeightDistribution3;
            weightDistObj['wdValue4'] = totalSpendObj.ybilledWeightDistribution4;
            weightDistObj['wdValue5'] = totalSpendObj.ybilledWeightDistribution5;
            weightDistObj['wdValue6'] = totalSpendObj.ybilledWeightDistribution6to10;
            weightDistObj['wdValue7'] = totalSpendObj.ybilledWeightDistribution10to20;
            weightDistObj['wdValue8'] = totalSpendObj.ybilledWeightDistribution20to30;
            weightDistObj['wdValue9'] = totalSpendObj.ybilledWeightDistribution30to50;
            weightDistObj['wdValue10'] = totalSpendObj.ybilledWeightDistribution50to70;
            weightDistObj['wdValue11'] = totalSpendObj.ybilledWeightDistribution70to150;
            weightDistObj['wdValue12'] = totalSpendObj.ybilledWeightDistribution150;
            //  weightDistObj['wdValue13']=totalSpendObj.ybilledWeightDistribution0to16oz;
            weightDistObj['wdValue13'] = totalSpendObj.ybilledWeightDistributionLtr;
            this.totalWgtDistbution.set(totalSpendObj.ytotalNetCharge);
            if (this.totalWgtDistbution() == "" || this.totalWgtDistbution() == null) {
              this.totalWgtDistbution.set("0");
            }
          }
        }
        else {
          if (monthFlag == "Y") {
            weightDistObj['wdValue1'] = totalSpendObj.ambilledDistribution1;
            weightDistObj['wdValue2'] = totalSpendObj.ambilledWeightDistribution2;
            weightDistObj['wdValue3'] = totalSpendObj.ambilledWeightDistribution3;
            weightDistObj['wdValue4'] = totalSpendObj.ambilledWeightDistribution4;
            weightDistObj['wdValue5'] = totalSpendObj.ambilledWeightDistribution5;
            weightDistObj['wdValue6'] = totalSpendObj.ambilledWeightDistribution6to10;
            weightDistObj['wdValue7'] = totalSpendObj.ambilledWeightDistribution10to20;
            weightDistObj['wdValue8'] = totalSpendObj.ambilledWeightDistribution20to30;
            weightDistObj['wdValue9'] = totalSpendObj.ambilledWeightDistribution30to50;
            weightDistObj['wdValue10'] = totalSpendObj.ambilledWeightDistribution50to70;
            weightDistObj['wdValue11'] = totalSpendObj.ambilledWeightDistribution70to150;
            weightDistObj['wdValue12'] = totalSpendObj.ambilledWeightDistribution150;
            //  weightDistObj['wdValue13']=totalSpendObj.ambilledWeightDistribution0to16oz;
            weightDistObj['wdValue13'] = totalSpendObj.ambilledWeightDistributionLtr;
            this.totalWgtDistbution.set(totalSpendObj.amtotalNetCharge);
            if (this.totalWgtDistbution() == "" || this.totalWgtDistbution() == null) {
              this.totalWgtDistbution.set("0");
            }
          }
          else {
            weightDistObj['wdValue1'] = totalSpendObj.aybilledDistribution1;
            weightDistObj['wdValue2'] = totalSpendObj.aybilledWeightDistribution2;
            weightDistObj['wdValue3'] = totalSpendObj.aybilledWeightDistribution3;
            weightDistObj['wdValue4'] = totalSpendObj.aybilledWeightDistribution4;
            weightDistObj['wdValue5'] = totalSpendObj.aybilledWeightDistribution5;
            weightDistObj['wdValue6'] = totalSpendObj.aybilledWeightDistribution6to10;
            weightDistObj['wdValue7'] = totalSpendObj.aybilledWeightDistribution10to20;
            weightDistObj['wdValue8'] = totalSpendObj.aybilledWeightDistribution20to30;
            weightDistObj['wdValue9'] = totalSpendObj.aybilledWeightDistribution30to50;
            weightDistObj['wdValue10'] = totalSpendObj.aybilledWeightDistribution50to70;
            weightDistObj['wdValue11'] = totalSpendObj.aybilledWeightDistribution70to150;
            weightDistObj['wdValue12'] = totalSpendObj.aybilledWeightDistribution150;
            //  weightDistObj['wdValue13']=totalSpendObj.aybilledWeightDistribution0to16oz;
            weightDistObj['wdValue13'] = totalSpendObj.aybilledWeightDistributionLtr;
            this.totalWgtDistbution.set(totalSpendObj.aytotalNetCharge);
            if (this.totalWgtDistbution() == "" || this.totalWgtDistbution() == null) {
              this.totalWgtDistbution.set("0");
            }
          }

        }
      }
    }
    this.weight_chartFedex(weightDistObj);

  }
  async weight_chartFedex(wghtDistObj: any) {
    this.createSeriesFromACFedex(wghtDistObj, "", "");
  }
  async createSeriesFromACFedex(
    wghtDistObj: any,
    type: string,
    palette: string = "Default"
  ): Promise<void> {

    if (!wghtDistObj) return;
    let chartData: any = [];

    // ✅ Dispose old chart
    if (this.weightChart) {
      this.weightChart.dispose();
    }

    // ✅ Create numeric data
    if (wghtDistObj != undefined) {
      chartData = [
        { "weight": "LTR", "value": Number(wghtDistObj.wdValue13) || 0 },
        { "weight": "1", "value": Number(wghtDistObj.wdValue1) || 0 },
        { "weight": "2", "value": Number(wghtDistObj.wdValue2) || 0 },
        { "weight": "3", "value": Number(wghtDistObj.wdValue3) || 0 },
        { "weight": "4", "value": Number(wghtDistObj.wdValue4) || 0 },
        { "weight": "5", "value": Number(wghtDistObj.wdValue5) || 0 },
        { "weight": "6-10", "value": Number(wghtDistObj.wdValue6) || 0 },
        { "weight": "11-20", "value": Number(wghtDistObj.wdValue7) || 0 },
        { "weight": "21-30", "value": Number(wghtDistObj.wdValue8) || 0 },
        { "weight": "31-50", "value": Number(wghtDistObj.wdValue9) || 0 },
        { "weight": "51-70", "value": Number(wghtDistObj.wdValue10) || 0 },
        { "weight": "71-150", "value": Number(wghtDistObj.wdValue11) || 0 },
        { "weight": "151+", "value": Number(wghtDistObj.wdValue12) || 0 }
      ];
    }

    // ✅ Create chart
    this.weightChart = am4core.create("weight_dis", am4charts.XYChart);
    this.weightChart.data = chartData;
    this.weightChart.padding(10, 10, 10, 10);
    // Check for negative values
    const minNegVal = chartData.some((item: any) => item.value < 0);
    // Create axes
    const categoryAxis = this.weightChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "weight";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.visible = false;

    const valueAxis = this.weightChart.yAxes.push(new am4charts.ValueAxis());
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
    const series = this.weightChart.series.push(new am4charts.ColumnSeries());
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

    this.weightChart.cursor = new am4charts.XYCursor();
    this.weightChart.cursor.lineX.strokeOpacity = 0;
    this.weightChart.cursor.lineY.strokeOpacity = 0;
  }
  private totalSpendChart: am4charts.XYChart | null = null;
  async TotalSpend_bar_chart(resultData: any) {

    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    // ✅ Dispose previous chart (FIX)
    if (this.totalSpendChart) {
      this.totalSpendChart.dispose();
    }

    // Create chart instance
    this.totalSpendChart = am4core.create("chartdiv", am4charts.XYChart);
    var chart = this.totalSpendChart;

    chart.colors.step = 2;
    chart.maskBullets = false;

    // Add data
    resultData.forEach((item: any) => {
      item.AvgCost = item.Count && Number(item.Count) !== 0
        ? item.NetAmount / item.Count
        : Number(item.NetAmount) !== 0 && Number(item.Count) === 0 ? 0.00 : null;
    });

    chart.data = resultData;

    var minNegVal = false;
    for (var loop = 0; loop < resultData.length; loop++) {
      var netamt = resultData[loop].NetAmount;
      if (netamt < 0) {
        minNegVal = true;
        break;
      }
    }

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
    NetAmountAxis.title.text = "$ Net Charge";

    if (minNegVal == false) {
      NetAmountAxis.min = 0;
    }

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

    // Net Charge Column Series
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
    distanceSeries.tooltipText =
      "Month: [bold]{dateX.formatDate('MMMM')}[/] \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";

    distanceSeries.tooltip.autoTextColor = false;
    distanceSeries.tooltip.label.fill = am4core.color("#ffffff");

    var disatnceState = distanceSeries.columns.template.states.create("hover");
    disatnceState.properties.fillOpacity = 0.9;

    // Package Count Line Series
    var NetAmountSeries = chart.series.push(new am4charts.LineSeries());
    NetAmountSeries.dataFields.valueY = "Count";
    NetAmountSeries.dataFields.dateX = "Month";
    NetAmountSeries.yAxis = distanceAxis;
    NetAmountSeries.name = "Package Count";
    NetAmountSeries.strokeWidth = 2;
    NetAmountSeries.propertyFields.strokeDasharray = "dashLength";
    NetAmountSeries.tooltipText =
      "Month: [bold]{dateX.formatDate('MMMM')}[/]  \n Package Count: [bold]{valueY}[/]";

    NetAmountSeries.tooltip!.autoTextColor = false;
    NetAmountSeries.tooltip!.label.fill = am4core.color("#ffffff");

    var NetAmountBullet = NetAmountSeries.bullets.push(new am4charts.CircleBullet());
    NetAmountBullet.circle.fill = am4core.color("#fff");
    NetAmountBullet.circle.strokeWidth = 2;
    NetAmountBullet.circle.propertyFields.radius = "townSize";

    var NetAmountBulletVal = NetAmountBullet.states.create("hover");
    NetAmountBulletVal.properties.scale = 1.2;

    // Avg Cost Line Series
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

    // Legend
    chart.legend = new am4charts.Legend();

    dateAxis.cursorTooltipEnabled = false;
    NetAmountAxis.cursorTooltipEnabled = false;
    distanceAxis.cursorTooltipEnabled = false;
    avgCostAxis.cursorTooltipEnabled = false;

    // Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineY.disabled = true;
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fillOpacity = 0.1;

    // Dark Theme Support
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

  async initialDashBoardGrpSerFetch() {
    await this.fetchdashBoardGrpSer();
  }
  t202DashStaticChrgDescGrpAC: any;
  async fetchdashBoardGrpSer() {
    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;
    const monthData = this.fedexFormGroup.get('month')?.value;
    if (monthFlag == "N") {
      this.fedexFormGroup.get('month')?.setValue('1');
    } else {
      this.fedexFormGroup.get('month')?.setValue(monthData);
    }
    this.httpfedexService
      .fetchdashBoardGrpSer(this.fedexFormGroup.value)
      .subscribe(
        result => {
          this.t202DashStaticChrgDescGrpAC = result;

          if (monthFlag == "N") {
            this.fedexFormGroup.get('month')?.setValue(null);
          } else {
            this.fedexFormGroup.get('month')?.setValue(monthData);
          }

          this.groupService(result);
          this.fetchIndividualService();
        },
        error => {
          // intentionally left blank (no logic change)
        }
      );
  }

  async groupService(t202dashResultAC: any) {
    this.domesticGroundService.set([]);
    this.internationGroundService.set([]);
    if (t202dashResultAC == null || t202dashResultAC.length == 0) {

      this.Ground = 0.00;
      this.FedEx_2Day = 0.00;
      this.FedEx_Express_Saver = 0.00;
      this.FedEx_First_Overnight = 0.00;
      this.FedEx_2Day_AM = 0.00;
      this.FedEx_Priority_Overnight = 0.00;
      this.FedEx_Standard_Overnight = 0.00;
      this.Home_Delivery = 0.00;
      this.smartPost = 0.00;
      this.fuel_serFedex = 0.00;
      this.add_correctionFedex = 0.00;
      this.Declared_valueFedex = 0.00;
      this.charge_backFedex = 0.00;
      this.chargeDesListFedex = [];

      this.internationalGround = 0.00;
      this.fedExIntlEconomy = 0.00;
      this.fedExIntlPriority = 0.00;
      this.FedExInternationalFirst = 0.00;
      this.FedExIntlPriorityFrt = 0.00;
      this.FedExIntlEconomyFrt = 0.00;
      this.FedExIntlPriorityExpress = 0.00;
      this.FedExInternationalConnectPlus = 0.00;
      this.internationalchargeDesListFedex = [];

      this.GprogressBarFedex = 0;
      this.FExpSerprogressBarFedex = 0;
      this.FFirOverprogressBarFedex = 0;
      this.F2DayprogressBarFedex = 0;
      this.F2DayAMprogressBarFedex = 0;
      this.FPriovernitprogressBarFedex = 0;
      this.FStdovernitprogressBarFedex = 0;
      this.HmeDelprogressBarFedex = 0;
      this.smartPostprogressBarFedex = 0;
      this.progressBarFedexList = [];

      this.internationalGroundprogressBar = 0;
      this.fedExIntlEconomyprogressBar = 0;
      this.fedExIntlPriorityprogressBar = 0;
      this.FedExInternationalFirstprogressBar = 0;
      this.FedExIntlPriorityFrtprogressBar = 0;
      this.FedExIntlEconomyFrtprogressBar = 0;
      this.FedExIntlPriorityExpressprogressBar = 0;
      this.FedExInternationalConnectPlusprogressBar = 0;
      this.internationalprogressBarFedexList = [];


      this.progressBarFedexList.push({ serviceType: 'Ground', progressBar: this.GprogressBarFedex, netCharge: this.Ground, serviceName: 'Ground' });
      this.progressBarFedexList.push({ serviceType: 'Home Delivery', progressBar: this.HmeDelprogressBarFedex, netCharge: this.Home_Delivery, serviceName: 'Home Delivery' });
      this.progressBarFedexList.push({ serviceType: 'Ground Economy', progressBar: this.smartPostprogressBarFedex, netCharge: this.smartPost, serviceName: 'Ground Economy' });
      this.progressBarFedexList.push({ serviceType: 'FedEx First Overnight', progressBar: this.FFirOverprogressBarFedex, netCharge: this.FedEx_First_Overnight, serviceName: 'FedEx First Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Priority Overnight', progressBar: this.FPriovernitprogressBarFedex, netCharge: this.FedEx_Priority_Overnight, serviceName: 'FedEx Priority Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Standard Overnight', progressBar: this.FStdovernitprogressBarFedex, netCharge: this.FedEx_Standard_Overnight, serviceName: 'FedEx Standard Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx 2Day AM', progressBar: this.F2DayAMprogressBarFedex, netCharge: this.FedEx_2Day_AM, serviceName: 'FedEx 2Day A.M.' });
      this.progressBarFedexList.push({ serviceType: 'FedEx 2Day', progressBar: this.F2DayprogressBarFedex, netCharge: this.FedEx_2Day, serviceName: 'FedEx 2Day' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Express Saver', progressBar: this.FExpSerprogressBarFedex, netCharge: this.FedEx_Express_Saver, serviceName: 'FedEx Express Saver' });
      this.domesticGroundService.set(this.progressBarFedexList);

      this.internationalprogressBarFedexList.push({ serviceType: 'International Ground', progressBar: this.internationalGroundprogressBar, netCharge: this.internationalGround, serviceName: 'Ground' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Economy', progressBar: this.fedExIntlEconomyprogressBar, netCharge: this.fedExIntlEconomy, serviceName: 'Home Delivery' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority', progressBar: this.fedExIntlPriorityprogressBar, netCharge: this.fedExIntlPriority, serviceName: 'Ground Economy' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx International First', progressBar: this.FedExInternationalFirstprogressBar, netCharge: this.FedExInternationalFirst, serviceName: 'FedEx First Overnight' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority Frt', progressBar: this.FedExIntlPriorityFrtprogressBar, netCharge: this.FedExIntlPriorityFrt, serviceName: 'FedEx Priority Overnight' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Economy Frt', progressBar: this.FedExIntlEconomyFrtprogressBar, netCharge: this.FedExIntlEconomyFrt, serviceName: 'FedEx Standard Overnight' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority Express', progressBar: this.FedExIntlPriorityExpressprogressBar, netCharge: this.FedExIntlPriorityExpress, serviceName: 'FedEx 2Day A.M.' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx International Connect Plus', progressBar: this.FedExInternationalConnectPlusprogressBar, netCharge: this.FedExInternationalConnectPlus, serviceName: 'FedEx 2Day A.M.' });
      this.internationGroundService.set(this.internationalprogressBarFedexList);
    }

    if (t202dashResultAC.length != 0) {
      this.Ground = 0.00;
      this.FedEx_2Day = 0.00;
      this.FedEx_Express_Saver = 0.00;
      this.FedEx_First_Overnight = 0.00;
      this.FedEx_2Day_AM = 0.00;
      this.FedEx_Priority_Overnight = 0.00;
      this.FedEx_Standard_Overnight = 0.00;
      this.Home_Delivery = 0.00;
      this.smartPost = 0.00;
      this.fuel_serFedex = 0.00;
      this.add_correctionFedex = 0.00;
      this.Declared_valueFedex = 0.00;
      this.charge_backFedex = 0.00;

      this.internationalGround = 0.00;
      this.fedExIntlEconomy = 0.00;
      this.fedExIntlPriority = 0.00;
      this.FedExInternationalFirst = 0.00;
      this.FedExIntlPriorityFrt = 0.00;
      this.FedExIntlEconomyFrt = 0.00;;
      this.FedExIntlPriorityExpress = 0.00;
      this.FedExInternationalConnectPlus = 0.00;
      this.internationalchargeDesListFedex = 0.00;
    }


    this.chargeDesListFedex = [];
    this.internationalchargeDesListFedex = [];
    this.maxValue = 0;
    this.maxValueInt = 0;

    var clickedMonth = this.fedexFormGroup.get('month')?.value;
    var accountVal = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    var chargeType = this.fedexFormGroup.get('chargeType')?.value;
    if (t202dashResultAC.length > 0) {
      for (var rymloop = 0; rymloop < t202dashResultAC.length; rymloop++) {


        var t202dashboardGrpSerObj = t202dashResultAC[rymloop];
        var totAmt: Number = 0;

        if (accountVal != "ALL") {
          totAmt = Number(t202dashboardGrpSerObj.grandAccountLevelTotalForServiceLevel);
        }
        else {
          totAmt = Number(t202dashboardGrpSerObj.grandYearTotalForServiceLevel);
        }

        if (clickedMonth != 0) {
          if (clickedMonth == 1)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 2)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 3)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 4)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 5)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 6)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 7)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 8)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 9)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 10)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 11)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);

          if (clickedMonth == 12)
            totAmt = Number(t202dashboardGrpSerObj.grandMonthLevelTotalForServiceLevel);
        }
        if (clickedMonth != 0 && accountVal != "ALL") {

          if (clickedMonth == 1)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth1);

          if (clickedMonth == 2)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth2);

          if (clickedMonth == 3)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth3);

          if (clickedMonth == 4)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth4);

          if (clickedMonth == 5)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth5);

          if (clickedMonth == 6)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth6);

          if (clickedMonth == 7)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth7);

          if (clickedMonth == 8)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth8);

          if (clickedMonth == 9)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth9);

          if (clickedMonth == 10)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth10);

          if (clickedMonth == 11)
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth11);

          if (clickedMonth == 12)
            //9059
            totAmt = Number(t202dashboardGrpSerObj.accountTotalForMonth12);
        }

        if (t202dashboardGrpSerObj.chargeType == chargeType) {
          if (t202dashboardGrpSerObj.chargeGroup == "Freight") {
            var removeSplChar: String = t202dashboardGrpSerObj.chargeDescription;
            var chrgDescFedex2AM: String = removeSplChar.replace(/[^a-zA-Z0-9 ]/g, "");

            if (t202dashboardGrpSerObj.chargeDescription == "Ground")
              this.Ground = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "FedEx 2Day")
              this.FedEx_2Day = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Express Saver")
              this.FedEx_Express_Saver = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "FedEx First Overnight")
              this.FedEx_First_Overnight = Number(totAmt);

            if (chrgDescFedex2AM == "FedEx 2Day AM")
              this.FedEx_2Day_AM = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Priority Overnight")
              this.FedEx_Priority_Overnight = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Standard Overnight")
              this.FedEx_Standard_Overnight = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "Home Delivery")
              this.Home_Delivery = Number(totAmt);


            if (t202dashboardGrpSerObj.chargeDescription == "Ground Economy")
              this.smartPost = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "International Ground")
              this.internationalGround = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Intl Economy")
              this.fedExIntlEconomy = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Intl Priority")
              this.fedExIntlPriority = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx International First")
              this.FedExInternationalFirst = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Intl Priority Frt")
              this.FedExIntlPriorityFrt = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Intl Economy Frt")
              this.FedExIntlEconomyFrt = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx Intl Priority Express")
              this.FedExIntlPriorityExpress = Number(totAmt);
            if (t202dashboardGrpSerObj.chargeDescription == "FedEx International Connect Plus")
              this.FedExInternationalConnectPlus = Number(totAmt);
          }
          else if (t202dashboardGrpSerObj.chargeGroup == "Accessorial") {

            if (t202dashboardGrpSerObj.chargeDescription == "Fuel Surcharge")
              this.fuel_serFedex = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "Address Correction")
              this.add_correctionFedex = Number(totAmt);

            if (t202dashboardGrpSerObj.chargeDescription == "Declared Value")
              this.Declared_valueFedex = Number(totAmt);
          }

        }
      }
      this.chargeDesListFedex.push(this.Ground);
      this.chargeDesListFedex.push(this.FedEx_Express_Saver);
      this.chargeDesListFedex.push(this.FedEx_First_Overnight);
      this.chargeDesListFedex.push(this.FedEx_2Day);
      this.chargeDesListFedex.push(this.FedEx_2Day_AM);
      this.chargeDesListFedex.push(this.FedEx_Priority_Overnight);
      this.chargeDesListFedex.push(this.FedEx_Standard_Overnight);
      this.chargeDesListFedex.push(this.Home_Delivery);
      this.chargeDesListFedex.push(this.smartPost);
      //  this.chargeDesListFedex.push(this.fuel_serFedex);
      //  this.chargeDesListFedex.push(this.add_correctionFedex);
      //  this.chargeDesListFedex.push(this.Declared_valueFedex);
      //  this.chargeDesListFedex.push(this.charge_backFedex);
      this.maxVal = Math.max.apply(null, this.chargeDesListFedex);
      this.maxValue = this.maxVal + this.maxVal / 10;
      var totMax: Number = this.maxValue / 9;

      this.internationalchargeDesListFedex.push(this.internationalGround);
      this.internationalchargeDesListFedex.push(this.fedExIntlEconomy);
      this.internationalchargeDesListFedex.push(this.fedExIntlPriority);
      this.internationalchargeDesListFedex.push(this.FedExInternationalFirst);
      this.internationalchargeDesListFedex.push(this.FedExIntlPriorityFrt);
      this.internationalchargeDesListFedex.push(this.FedExIntlEconomyFrt);
      this.internationalchargeDesListFedex.push(this.FedExIntlPriorityExpress);
      this.internationalchargeDesListFedex.push(this.FedExInternationalConnectPlus);

      this.maxValInt = Math.max.apply(null, this.chargeDesListFedex);
      this.maxValueInt = this.maxVal + this.maxVal / 10;

      this.GprogressBarFedex = await this.calcPercent(this.Ground, this.maxValue);
      this.FExpSerprogressBarFedex = await this.calcPercent(this.FedEx_Express_Saver, this.maxValue);
      this.FFirOverprogressBarFedex = await this.calcPercent(this.FedEx_First_Overnight, this.maxValue);
      this.F2DayprogressBarFedex = await this.calcPercent(this.FedEx_2Day, this.maxValue);
      this.F2DayAMprogressBarFedex = await this.calcPercent(this.FedEx_2Day_AM, this.maxValue);
      this.FPriovernitprogressBarFedex = await this.calcPercent(this.FedEx_Priority_Overnight, this.maxValue);
      this.FStdovernitprogressBarFedex = await this.calcPercent(this.FedEx_Standard_Overnight, this.maxValue);
      this.HmeDelprogressBarFedex = await this.calcPercent(this.Home_Delivery, this.maxValue);
      this.smartPostprogressBarFedex = await this.calcPercent(this.smartPost, this.maxValue);
      this.fuelprogressBarFedex = await this.calcPercent(this.fuel_serFedex, this.maxValue);
      this.addressCorrectionFedex = await this.calcPercent(this.add_correctionFedex, this.maxValue);
      this.declaredValueFedex = await this.calcPercent(this.Declared_valueFedex, this.maxValue);

      this.internationalGroundprogressBar = await this.calcPercent(this.internationalGround, this.maxValueInt);
      this.fedExIntlEconomyprogressBar = await this.calcPercent(this.fedExIntlEconomy, this.maxValueInt);
      this.fedExIntlPriorityprogressBar = await this.calcPercent(this.fedExIntlPriority, this.maxValueInt);
      this.FedExInternationalFirstprogressBar = await this.calcPercent(this.FedExInternationalFirst, this.maxValueInt);
      this.FedExIntlPriorityFrtprogressBar = await this.calcPercent(this.FedExIntlPriorityFrt, this.maxValueInt);
      this.FedExIntlEconomyFrtprogressBar = await this.calcPercent(this.FedExIntlEconomyFrt, this.maxValueInt);
      this.FedExIntlPriorityExpressprogressBar = await this.calcPercent(this.FedExIntlPriorityExpress, this.maxValueInt);
      this.FedExInternationalConnectPlusprogressBar = await this.calcPercent(this.FedExInternationalConnectPlus, this.maxValueInt);


      this.progressBarFedexList = [];
      this.progressBarFedexList.push({ serviceType: 'Ground', progressBar: this.GprogressBarFedex, netCharge: this.Ground, serviceName: 'Ground' });
      this.progressBarFedexList.push({ serviceType: 'Home Delivery', progressBar: this.HmeDelprogressBarFedex, netCharge: this.Home_Delivery, serviceName: 'Home Delivery' });
      this.progressBarFedexList.push({ serviceType: 'Ground Economy', progressBar: this.smartPostprogressBarFedex, netCharge: this.smartPost, serviceName: 'Ground Economy' });
      this.progressBarFedexList.push({ serviceType: 'FedEx First Overnight', progressBar: this.FFirOverprogressBarFedex, netCharge: this.FedEx_First_Overnight, serviceName: 'FedEx First Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Priority Overnight', progressBar: this.FPriovernitprogressBarFedex, netCharge: this.FedEx_Priority_Overnight, serviceName: 'FedEx Priority Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Standard Overnight', progressBar: this.FStdovernitprogressBarFedex, netCharge: this.FedEx_Standard_Overnight, serviceName: 'FedEx Standard Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx 2Day AM', progressBar: this.F2DayAMprogressBarFedex, netCharge: this.FedEx_2Day_AM, serviceName: 'FedEx 2Day A.M.' });
      this.progressBarFedexList.push({ serviceType: 'FedEx 2Day', progressBar: this.F2DayprogressBarFedex, netCharge: this.FedEx_2Day, serviceName: 'FedEx 2Day' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Express Saver', progressBar: this.FExpSerprogressBarFedex, netCharge: this.FedEx_Express_Saver, serviceName: 'FedEx Express Saver' });
      this.progressBarFedexList.sort((a: any, b: any) => b.netCharge - a.netCharge);
      this.domesticGroundService.set(this.progressBarFedexList);

      this.internationalprogressBarFedexList = [];
      this.internationalprogressBarFedexList.push({ serviceType: 'International Ground', progressBar: this.internationalGroundprogressBar, netCharge: this.internationalGround, serviceName: 'International Ground' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Economy', progressBar: this.fedExIntlEconomyprogressBar, netCharge: this.fedExIntlEconomy, serviceName: 'FedEx Intl Economy' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority', progressBar: this.fedExIntlPriorityprogressBar, netCharge: this.fedExIntlPriority, serviceName: 'FedEx Intl Priority' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx International First', progressBar: this.FedExInternationalFirstprogressBar, netCharge: this.FedExInternationalFirst, serviceName: 'FedEx International First' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority Frt', progressBar: this.FedExIntlPriorityFrtprogressBar, netCharge: this.FedExIntlPriorityFrt, serviceName: 'FedEx Intl Priority Frt' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Economy Frt', progressBar: this.FedExIntlEconomyFrtprogressBar, netCharge: this.FedExIntlEconomyFrt, serviceName: 'FedEx Intl Economy Frt' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority Express', progressBar: this.FedExIntlPriorityExpressprogressBar, netCharge: this.FedExIntlPriorityExpress, serviceName: 'FedEx Intl Priority Express' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx International Connect Plus', progressBar: this.FedExInternationalConnectPlusprogressBar, netCharge: this.FedExInternationalConnectPlus, serviceName: 'FedEx International Connect Plus' });
      this.internationalprogressBarFedexList.sort((a: any, b: any) => b.netCharge - a.netCharge);
      this.internationGroundService.set(this.internationalprogressBarFedexList);
    } else {
      this.GprogressBarFedex = 0;
      this.FExpSerprogressBarFedex = 0;
      this.FFirOverprogressBarFedex = 0;
      this.F2DayprogressBarFedex = 0;
      this.F2DayAMprogressBarFedex = 0;
      this.FPriovernitprogressBarFedex = 0;
      this.FStdovernitprogressBarFedex = 0;
      this.HmeDelprogressBarFedex = 0;
      this.smartPostprogressBarFedex = 0;
      this.fuelprogressBarFedex = 0;
      this.addressCorrectionFedex = 0;
      this.declaredValueFedex = 0;
      this.Ground = 0;
      this.FedEx_2Day = 0;
      this.FedEx_Express_Saver = 0;
      this.FedEx_First_Overnight = 0;
      this.FedEx_2Day_AM = 0;
      this.FedEx_Priority_Overnight = 0;
      this.FedEx_Standard_Overnight = 0;
      this.Home_Delivery = 0;
      this.smartPost = 0;

      this.internationalGround = 0.00;
      this.fedExIntlEconomy = 0.00;
      this.fedExIntlPriority = 0.00;
      this.FedExInternationalFirst = 0.00;
      this.FedExIntlPriorityFrt = 0.00;
      this.FedExIntlEconomyFrt = 0.00;;
      this.FedExIntlPriorityExpress = 0.00;
      this.FedExInternationalConnectPlus = 0.00;

      this.internationalGroundprogressBar = 0;
      this.fedExIntlEconomyprogressBar = 0;
      this.fedExIntlPriorityprogressBar = 0;
      this.FedExInternationalFirstprogressBar = 0;
      this.FedExIntlPriorityFrtprogressBar = 0;
      this.FedExIntlEconomyFrtprogressBar = 0;
      this.FedExIntlPriorityExpressprogressBar = 0;
      this.FedExInternationalConnectPlusprogressBar = 0;

      this.progressBarFedexList = [];
      this.progressBarFedexList.push({ serviceType: 'Ground', progressBar: this.GprogressBarFedex, netCharge: this.Ground, serviceName: 'Ground' });
      this.progressBarFedexList.push({ serviceType: 'Home Delivery', progressBar: this.HmeDelprogressBarFedex, netCharge: this.Home_Delivery, serviceName: 'Home Delivery' });
      this.progressBarFedexList.push({ serviceType: 'Ground Economy', progressBar: this.smartPostprogressBarFedex, netCharge: this.smartPost, serviceName: 'Ground Economy' });
      this.progressBarFedexList.push({ serviceType: 'FedEx First Overnight', progressBar: this.FFirOverprogressBarFedex, netCharge: this.FedEx_First_Overnight, serviceName: 'FedEx First Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Priority Overnight', progressBar: this.FPriovernitprogressBarFedex, netCharge: this.FedEx_Priority_Overnight, serviceName: 'FedEx Priority Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Standard Overnight', progressBar: this.FStdovernitprogressBarFedex, netCharge: this.FedEx_Standard_Overnight, serviceName: 'FedEx Standard Overnight' });
      this.progressBarFedexList.push({ serviceType: 'FedEx 2Day AM', progressBar: this.F2DayAMprogressBarFedex, netCharge: this.FedEx_2Day_AM, serviceName: 'FedEx 2Day A.M.' });
      this.progressBarFedexList.push({ serviceType: 'FedEx 2Day', progressBar: this.F2DayprogressBarFedex, netCharge: this.FedEx_2Day, serviceName: 'FedEx 2Day' });
      this.progressBarFedexList.push({ serviceType: 'FedEx Express Saver', progressBar: this.FExpSerprogressBarFedex, netCharge: this.FedEx_Express_Saver, serviceName: 'FedEx Express Saver' });

      this.domesticGroundService.set(this.progressBarFedexList);

      this.internationalprogressBarFedexList = [];
      this.internationalprogressBarFedexList.push({ serviceType: 'International Ground', progressBar: this.internationalGroundprogressBar, netCharge: this.internationalGround, serviceName: 'International Ground' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Economy', progressBar: this.fedExIntlEconomyprogressBar, netCharge: this.fedExIntlEconomy, serviceName: 'FedEx Intl Economy' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority', progressBar: this.fedExIntlPriorityprogressBar, netCharge: this.fedExIntlPriority, serviceName: 'FedEx Intl Priority' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx International First', progressBar: this.FedExInternationalFirstprogressBar, netCharge: this.FedExInternationalFirst, serviceName: 'FedEx International First' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority Frt', progressBar: this.FedExIntlPriorityFrtprogressBar, netCharge: this.FedExIntlPriorityFrt, serviceName: 'FedEx Intl Priority Frt' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Economy Frt', progressBar: this.FedExIntlEconomyFrtprogressBar, netCharge: this.FedExIntlEconomyFrt, serviceName: 'FedEx Intl Economy Frt' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx Intl Priority Express', progressBar: this.FedExIntlPriorityExpressprogressBar, netCharge: this.FedExIntlPriorityExpress, serviceName: 'FedEx Intl Priority Express' });
      this.internationalprogressBarFedexList.push({ serviceType: 'FedEx International Connect Plus', progressBar: this.FedExInternationalConnectPlusprogressBar, netCharge: this.FedExInternationalConnectPlus, serviceName: 'FedEx International Connect Plus' });

      this.internationGroundService.set(this.internationalprogressBarFedexList);

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
  fetchIndividualService(): void {

    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;
    const monthData = this.fedexFormGroup.get('month')?.value;

    // Temporarily override month value
    this.fedexFormGroup.get('month')?.setValue(
      monthFlag == 'N' ? '0' : monthData
    );

    this.httpfedexService
      .fetchIndividualService(this.fedexFormGroup.value)
      .subscribe(
        (result) => {
          this.t202DashStaticChrgDescIndAC = result;
          this.individualService(result);

          // Restore month value
          this.fedexFormGroup.get('month')?.setValue(
            monthFlag == 'N' ? null : monthData
          );
        },
        (error) => {
          console.log('error', error);
        }
      );
  }
  indivServAC = [];

  individualService(t202chargeDescAC: any): void {

    this.indivServAC = [];
    const indivServAC = [];

    const accountVal = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    const monthVal = this.fedexFormGroup.get('month')?.value;

    if (t202chargeDescAC != null && t202chargeDescAC.length !== 0) {

      for (let loop = 0; loop < t202chargeDescAC.length; loop++) {

        let chargeDescValue;

        if (accountVal == "ALL") {

          if (monthVal != null) {
            chargeDescValue = t202chargeDescAC[loop].grandYearTotalForServiceLevel;
            indivServAC.push({
              chargeDescription: t202chargeDescAC[loop].chargeDescription,
              chargeDescValue: chargeDescValue
            });
          }
          else {
            chargeDescValue = t202chargeDescAC[loop].grandYearTotalForServiceLevel;
            indivServAC.push({
              chargeDescription: t202chargeDescAC[loop].chargeDescription,
              chargeDescValue: chargeDescValue
            });
          }

        }
        else {

          if (monthVal != null) {
            chargeDescValue = t202chargeDescAC[loop].grandAccountLevelTotalForServiceLevel;
            indivServAC.push({
              chargeDescription: t202chargeDescAC[loop].chargeDescription,
              chargeDescValue: chargeDescValue
            });
          }
          else {
            chargeDescValue = t202chargeDescAC[loop].grandAccountLevelTotalForServiceLevel;
            indivServAC.push({
              chargeDescription: t202chargeDescAC[loop].chargeDescription,
              chargeDescValue: chargeDescValue
            });
          }

        }
      }
    }

    this.pie_chartFedex(indivServAC);
  }
  async pie_chartFedex(event: any) {
    await this.createSeriesFromAC_for_pie(event);
  }
  pipe_chartDataFedex: any = [];
  highestItem: any;
  private individualPieChart: am4charts.PieChart | null = null;
  createSeriesFromAC_for_pie(collection: any): void {

    this.pipe_chartDataFedex = [];

    for (let loop = 0; loop < collection.length; loop++) {
      const pie_Obj = collection[loop];
      const nameFiled: string = pie_Obj.chargeDescription;
      const yField: string = pie_Obj.chargeDescValue;

      this.pipe_chartDataFedex.push({
        serviceName: nameFiled,
        rateVal: yField
      });
    }

    /* ---------- DISPOSE OLD CHART ---------- */
    if (this.individualPieChart) {
      this.individualPieChart.dispose();
    }

    if (this.pipe_chartDataFedex.length > 0) {
      setTimeout(() => {
        this.highestItem = this.pipe_chartDataFedex.reduce((max: { rateVal: any; }, item: { rateVal: any; }) =>
          Number(item.rateVal) > Number(max.rateVal) ? item : max
        );
      }, 0);
    }
    /* ---------- THEME ---------- */
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    /* ---------- CREATE CHART ---------- */
    this.individualPieChart = am4core.create(
      "container_individual",
      am4charts.PieChart
    );

    const chart = this.individualPieChart;

    chart.hiddenState.properties.opacity = 0;
    chart.legend = new am4charts.Legend();
    chart.legend.disabled = true;
    chart.data = this.pipe_chartDataFedex;

    /* ---------- SERIES ---------- */
    const series: any = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "rateVal";
    series.dataFields.category = "serviceName";

    series.alignLabels = false;
    series.labels.template.disabled = true;

    series.labels.template.adapter.add('text', function (_: any, target: any) {
      const percent = target.dataItem?.values?.value?.percent;
      return percent !== undefined ? `${Math.round(percent)}` : '';
    });
    series.labels.template.fontSize = 14;
    series.labels.template.fill = am4core.color('#333');
    series.labels.template.radius = am4core.percent(-30);

    series.slices.template.stroke = am4core.color("#ffffff");
    series.slices.template.strokeWidth = 1;
    series.slices.template.strokeOpacity = 1;

    series.slices.template.tooltipText =
      "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";

    series.tooltip.autoTextColor = false;
    series.ticks.template.disabled = false;
    series.tooltip.label.fill = am4core.color("#ffffff");
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

    /* ---------- SLICE CLICK EVENT ---------- */
    series.slices.template.events.on(
      "hit",
      (ev: any) => {
        const category: object = ev.target.dataItem.dataContext;
        const categoryName = category;
        // your existing logic can go here if needed
      },
      this
    );
  }

  async fetchZoneDistibutiondashBoardRst(event: any[]): Promise<void> {

    let t219ZoneResultObj: any = {};
    const t219DashboardZoneChartObj: any = {};
    const t219DashboardZoneChartAC: any[] = event;

    let year: any = null;
    let month: any = null;
    let monthValue: any = null;

    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;
    const clickedMonth = this.fedexFormGroup.get('month')?.value;
    const clickedYear = this.fedexFormGroup.get('year')?.value;

    this.t219List.push(t219DashboardZoneChartAC);

    /* ---------- EMPTY DATA HANDLING ---------- */
    if (!t219DashboardZoneChartAC || t219DashboardZoneChartAC.length == 0) {

      t219DashboardZoneChartObj['ground'] = "0.00";
      t219DashboardZoneChartObj['internatinalGround'] = "0.00";
      t219DashboardZoneChartObj['homeDelivery'] = "0.00";
      t219DashboardZoneChartObj['firstOvernight'] = "0.00";
      t219DashboardZoneChartObj['priorityOvernight'] = "0.00";
      t219DashboardZoneChartObj['standardOvernight'] = "0.00";
      t219DashboardZoneChartObj['twoDayAM'] = "0.00";
      t219DashboardZoneChartObj['twoDay'] = "0.00";
      t219DashboardZoneChartObj['expressSaver'] = "0.00";
      t219DashboardZoneChartObj['smartPost'] = "0.00";
      t219DashboardZoneChartObj['internationalFirst'] = "0.00";
      t219DashboardZoneChartObj['internationalPriority'] = "0.00";
      t219DashboardZoneChartObj['internationalEconomy'] = "0.00";
      t219DashboardZoneChartObj['internationalPriorityExpress'] = "0.00";

      this.dashboardZone_chart(t219DashboardZoneChartObj);
      this.totalZoneValue.set("0");
      return;
    }

    /* ---------- YEARLY VIEW ---------- */
    if (monthFlag == "N") {

      this.totalZoneValue.set(this.totalPackCost());

      for (let i = 0; i < t219DashboardZoneChartAC.length; i++) {

        t219ZoneResultObj = t219DashboardZoneChartAC[i];
        year = t219ZoneResultObj.year_1;

        if (clickedYear == year) {

          if (t219ZoneResultObj.zone2To96TotalSpend != null && t219ZoneResultObj.serviceType == "Ground")
            t219DashboardZoneChartObj['ground'] = t219ZoneResultObj.zone2To96TotalSpend;

          else if (t219ZoneResultObj.zone2To96TotalSpend != null && t219ZoneResultObj.serviceType == "International Ground")
            t219DashboardZoneChartObj['internatinalGround'] = t219ZoneResultObj.zone2To96TotalSpend;

          else if (t219ZoneResultObj.zone2To96TotalSpend != null && t219ZoneResultObj.serviceType == "Home Delivery")
            t219DashboardZoneChartObj['homeDelivery'] = t219ZoneResultObj.zone2To96TotalSpend;

          else if (t219ZoneResultObj.zone2To16TotalSpend != null && t219ZoneResultObj.serviceType == "FedEx First Overnight")
            t219DashboardZoneChartObj['firstOvernight'] = t219ZoneResultObj.zone2To16TotalSpend;

          else if (t219ZoneResultObj.zone2To16TotalSpend != null && t219ZoneResultObj.serviceType == "FedEx Priority Overnight")
            t219DashboardZoneChartObj['priorityOvernight'] = t219ZoneResultObj.zone2To16TotalSpend;

          else if (t219ZoneResultObj.zone2To16TotalSpend != null && t219ZoneResultObj.serviceType == "FedEx Standard Overnight")
            t219DashboardZoneChartObj['standardOvernight'] = t219ZoneResultObj.zone2To16TotalSpend;

          else if (t219ZoneResultObj.zone2To16TotalSpend != null && t219ZoneResultObj.serviceType == "FedEx 2Day A.M.")
            t219DashboardZoneChartObj['twoDayAM'] = t219ZoneResultObj.zone2To16TotalSpend;

          else if (t219ZoneResultObj.zone2To16TotalSpend != null && t219ZoneResultObj.serviceType == "FedEx 2Day")
            t219DashboardZoneChartObj['twoDay'] = t219ZoneResultObj.zone2To16TotalSpend;

          else if (t219ZoneResultObj.zone2To16TotalSpend != null && t219ZoneResultObj.serviceType == "FedEx Express Saver")
            t219DashboardZoneChartObj['expressSaver'] = t219ZoneResultObj.zone2To16TotalSpend;

          else if (t219ZoneResultObj.zone1To99TotalSpend != null && t219ZoneResultObj.serviceType == "Ground Economy")
            t219DashboardZoneChartObj['smartPost'] = t219ZoneResultObj.zone1To99TotalSpend;

          else if (
            t219ZoneResultObj.zoneAToOTotalSpend != null &&
            (t219ZoneResultObj.serviceType == "FedEx International First" || t219ZoneResultObj.serviceType == "FedEx Intl First")
          )
            t219DashboardZoneChartObj['internationalFirst'] = t219ZoneResultObj.zoneAToOTotalSpend;

          else if (
            t219ZoneResultObj.zoneAToOTotalSpend != null &&
            (t219ZoneResultObj.serviceType == "FedEx Intl Priority" || t219ZoneResultObj.serviceType == "FedEx International Priority")
          )
            t219DashboardZoneChartObj['internationalPriority'] = t219ZoneResultObj.zoneAToOTotalSpend;

          else if (
            t219ZoneResultObj.zoneAToOTotalSpend != null &&
            (t219ZoneResultObj.serviceType == "FedEx Intl Economy" || t219ZoneResultObj.serviceType == "FedEx International Economy")
          )
            t219DashboardZoneChartObj['internationalEconomy'] = t219ZoneResultObj.zoneAToOTotalSpend;

          else if (
            t219ZoneResultObj.zoneAToOTotalSpend != null &&
            (t219ZoneResultObj.serviceType == "FedEx Intl Priority Express" || t219ZoneResultObj.serviceType == "FedEx International Priority Express")
          )
            t219DashboardZoneChartObj['internationalPriorityExpress'] = t219ZoneResultObj.zoneAToOTotalSpend;

          this.dashboardZone_chart(t219DashboardZoneChartObj);
        }
      }
    }

    /* ---------- MONTHLY VIEW ---------- */
    if (monthFlag == "Y") {

      this.totalZoneValue.set(this.totalMonthZoneValue);

      for (let i = 0; i < t219DashboardZoneChartAC.length; i++) {

        t219ZoneResultObj = t219DashboardZoneChartAC[i];
        year = t219ZoneResultObj.year_1;

        if (clickedMonth == 1) { month = "Jan"; monthValue = t219ZoneResultObj.jan; }
        else if (clickedMonth == 2) { month = "Feb"; monthValue = t219ZoneResultObj.feb; }
        else if (clickedMonth == 3) { month = "Mar"; monthValue = t219ZoneResultObj.mar; }
        else if (clickedMonth == 4) { month = "Apr"; monthValue = t219ZoneResultObj.apr; }
        else if (clickedMonth == 5) { month = "May"; monthValue = t219ZoneResultObj.may; }
        else if (clickedMonth == 6) { month = "Jun"; monthValue = t219ZoneResultObj.jun; }
        else if (clickedMonth == 7) { month = "Jul"; monthValue = t219ZoneResultObj.jul; }
        else if (clickedMonth == 8) { month = "Aug"; monthValue = t219ZoneResultObj.aug; }
        else if (clickedMonth == 9) { month = "Sep"; monthValue = t219ZoneResultObj.sep; }
        else if (clickedMonth == 10) { month = "Oct"; monthValue = t219ZoneResultObj.oct; }
        else if (clickedMonth == 11) { month = "Nov"; monthValue = t219ZoneResultObj.nov; }
        else if (clickedMonth == 12) { month = "Dec"; monthValue = t219ZoneResultObj.decm; }

        if (clickedYear == year && monthValue != null) {

          if (t219ZoneResultObj.serviceType == "Ground")
            t219DashboardZoneChartObj['ground'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "International Ground")
            t219DashboardZoneChartObj['internatinalGround'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "Home Delivery")
            t219DashboardZoneChartObj['homeDelivery'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "FedEx First Overnight")
            t219DashboardZoneChartObj['firstOvernight'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "FedEx Priority Overnight")
            t219DashboardZoneChartObj['priorityOvernight'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "FedEx Standard Overnight")
            t219DashboardZoneChartObj['standardOvernight'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "FedEx 2Day A.M.")
            t219DashboardZoneChartObj['twoDayAM'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "FedEx 2Day")
            t219DashboardZoneChartObj['twoDay'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "FedEx Express Saver")
            t219DashboardZoneChartObj['expressSaver'] = monthValue;

          else if (t219ZoneResultObj.serviceType == "Ground Economy")
            t219DashboardZoneChartObj['smartPost'] = monthValue;

          else if (
            t219ZoneResultObj.serviceType == "FedEx International First" ||
            t219ZoneResultObj.serviceType == "FedEx Intl First"
          )
            t219DashboardZoneChartObj['internationalFirst'] = monthValue;

          else if (
            t219ZoneResultObj.serviceType == "FedEx Intl Priority" ||
            t219ZoneResultObj.serviceType == "FedEx International Priority"
          )
            t219DashboardZoneChartObj['internationalPriority'] = monthValue;

          else if (
            t219ZoneResultObj.serviceType == "FedEx Intl Economy" ||
            t219ZoneResultObj.serviceType == "FedEx International Economy"
          )
            t219DashboardZoneChartObj['internationalEconomy'] = monthValue;

          else if (
            t219ZoneResultObj.serviceType == "FedEx Intl Priority Express" ||
            t219ZoneResultObj.serviceType == "FedEx International Priority Express"
          )
            t219DashboardZoneChartObj['internationalPriorityExpress'] = monthValue;

          this.dashboardZone_chart(t219DashboardZoneChartObj);
        }
      }
    }
  }
  async dashboardZone_chart(t219DashboardZoneChartObj: any) {
    this.createSeriesFromAC_morezoneFedex(t219DashboardZoneChartObj);
  }
  private zoneChart: am4charts.XYChart | null = null;
  async createSeriesFromAC_morezoneFedex(t219DashboardZoneChartObj: any): Promise<void> {

    const chartData: any[] = [];

    chartData.push({ name: "Ground", value: t219DashboardZoneChartObj.ground ? t219DashboardZoneChartObj.ground : '0', categoryName: "Ground" });
    chartData.push({ name: "Home \n Delivery", value: t219DashboardZoneChartObj.homeDelivery ? t219DashboardZoneChartObj.homeDelivery : '0', categoryName: "Home Delivery" });
    chartData.push({ name: "Ground \n Economy", value: t219DashboardZoneChartObj.smartPost ? t219DashboardZoneChartObj.smartPost : '0', categoryName: "Ground Economy" });
    chartData.push({ name: "First \n Overnight", value: t219DashboardZoneChartObj.firstOvernight ? t219DashboardZoneChartObj.firstOvernight : '0', categoryName: "First Overnight" });
    chartData.push({ name: "Priority \n Overnight", value: t219DashboardZoneChartObj.priorityOvernight ? t219DashboardZoneChartObj.priorityOvernight : '0', categoryName: "Priority Overnight" });
    chartData.push({ name: "Standard \n Overnight", value: t219DashboardZoneChartObj.standardOvernight ? t219DashboardZoneChartObj.standardOvernight : '0', categoryName: "Standard Overnight" });
    chartData.push({ name: "2 Day", value: t219DashboardZoneChartObj.twoDay ? t219DashboardZoneChartObj.twoDay : '0', categoryName: "2 Day" });
    chartData.push({ name: "Express \n Saver", value: t219DashboardZoneChartObj.expressSaver ? t219DashboardZoneChartObj.expressSaver : '0', categoryName: "Express Saver" });
    chartData.push({ name: "International \n Ground", value: t219DashboardZoneChartObj.internatinalGround ? t219DashboardZoneChartObj.internatinalGround : '0', categoryName: "International Ground" });
    chartData.push({ name: "International \n First", value: t219DashboardZoneChartObj.internationalFirst ? t219DashboardZoneChartObj.internationalFirst : '0', categoryName: "International First" });
    chartData.push({ name: "International \n Priority \n Express", value: t219DashboardZoneChartObj.internationalPriorityExpress ? t219DashboardZoneChartObj.internationalPriorityExpress : '0', categoryName: "International Priority Express" });
    chartData.push({ name: "International \n Priority", value: t219DashboardZoneChartObj.internationalPriority ? t219DashboardZoneChartObj.internationalPriority : '0', categoryName: "International Priority" });
    chartData.push({ name: "International \n Economy", value: t219DashboardZoneChartObj.internationalEconomy ? t219DashboardZoneChartObj.internationalEconomy : '0', categoryName: "International Economy" });

    /* ---------- DISPOSE OLD CHART ---------- */
    if (this.zoneChart) {
      this.zoneChart.dispose();
    }

    /* ---------- THEME ---------- */
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    /* ---------- CHART ---------- */
    // this.zoneChart = am4core.create("container_zone", am4charts.XYChart);
    const chart: any = am4core.create("container_zone", am4charts.XYChart);

    chart.paddingBottom = 40;
    chart.angle = 35;
    chart.data = chartData;

    /* ---------- NEGATIVE VALUE CHECK ---------- */
    let minNegVal = false;
    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i].value < 0) {
        minNegVal = true;
        break;
      }
    }

    /* ---------- CATEGORY AXIS ---------- */
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    /* ---------- VALUE AXIS ---------- */
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";

    valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });

    if (minNegVal == false) {
      valueAxis.min = 0;
    }

    /* ---------- SERIES ---------- */
    const series: any = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "name";
    series.name = "Weight";
    series.tooltipText =
      "{categoryName}: $ [bold]{valueY.formatNumber('#,###.00')}[/] \n [bold]CLICK TO VIEW MORE";

    series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.columns.template.fillOpacity = 0.9;
    const BASE_COLOR = am4core.color('#1AA7E8');
    const HIGHLIGHT_COLOR = am4core.color('#0F6FB5');

    series.columns.template.fill = BASE_COLOR;
    series.columns.template.stroke = BASE_COLOR;

    series.tooltip.autoTextColor = false;
    series.tooltip.label.fill = am4core.color("#ffffff");

    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    series.columns.template.events.on(
      "hit",
      (ev: any) => {
        const category = ev.target.dataItem.dataContext;
        this.moreviewZoneDataFedex(category);
      },
      this
    );
    series.columns.template.events.on('out', () => {
      series.columns.each((column: any) => {
        column.fillOpacity = 0.9;
      });
    });
    series.columns.template.events.on('over', (ev: any) => {
      const hovered = ev.target;
      series.columns.each((column: any) => {
        column.fillOpacity = column === hovered ? 1 : 0.35;
      });
    });

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    const hoverState = series.columns.template.states.create('hover');
    hoverState.properties.fill = HIGHLIGHT_COLOR;
    hoverState.properties.fillOpacity = 1;

    /* ---------- DARK THEME ---------- */
    if (this.themeoption == "dark") {
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
      valueAxis.renderer.grid.template.strokeWidth = 2;
    }

    /* ---------- CURSOR ---------- */
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }

  async moreviewZoneDataFedex(event: any): Promise<void> {

    const eventName = event.name;
    const eventValue = event.value;
    const categoryName = event.categoryName;

    this.sendValue = {};

    const invoiceMonth = this.fedexFormGroup.get('month')?.value;
    const invoiceyear = this.fedexFormGroup.get('year')?.value;
    const clientId = this.fedexFormGroup.get('clientId')?.value;
    const monthFlag = this.fedexFormGroup.get('monthFlag')?.value;
    const accountNumber = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    const chargetypevalue = this.fedexFormGroup.get('chargeType')?.value;

    const t002ClientProfile = this.userProfifleFedex;

    const moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      monthFlag: monthFlag,
      accountNumber: accountNumber,
      chargeDescription: eventName,
      t002ClientProfile: t002ClientProfile,
      chargetypevalue: chargetypevalue,
      categoryName: categoryName,
      themeoption: this.themeoption
    };

    this.sendValue = moreviewObj;

    if (eventValue !== "0") {
      this.openZoneDialogFedex();
    }
  }

  openZoneDialogFedex() {
    const dialogRef = this.dialog.open(FedexZonePopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.sendValue,
        panelClass: this.panelClass
      }
    });

    dialogRef.afterClosed()?.subscribe(result => {
      this.dialogValue = result.data;
    });
  }
  async acc_clientid_changeHandler(evt: any): Promise<void> {
    let primaryAccountNumber = evt.value.primaryAccountNumber;
    this.fedexFormGroup.get('primaryAccountNumber')?.setValue(primaryAccountNumber);
    this.openLoading();
    const accountVal = primaryAccountNumber;
    this.fedexFormGroup.get('month')?.setValue(null);
    this.fedexFormGroup.get('monthFlag')?.setValue("N");
    this.fedexFormGroup.get('selectedMonth')?.setValue("N");
    if (accountVal == "ALL") {
      this.fedexFormGroup.get('primaryAccountNumber')?.setValue(accountVal);
      this.fedexFormGroup.get('accountNumber')?.setValue(null);
      this.fedexFormGroup.get('month')?.setValue(null);
      this.fedexFormGroup.get('monthFlag')?.setValue("N");
      this.fedexFormGroup.get('selectedMonth')?.setValue("N");
      this.year_Select = this.fedexFormGroup.get('year')?.value;
      this.month_Select = this.fedexFormGroup.get('month')?.value;
      await this.fetchdashBoardFedex();
    } else {
      this.fedexFormGroup.get('primaryAccountNumber')?.setValue(accountVal);
      this.fedexFormGroup.get('accountNumber')?.setValue(accountVal);
      await this.fetchdashBoardFedex();
    }
    this.closeLoading()
  }
  dashBoardFRTACCLable: any;
  async year_LinkBar_itemClickHandler(event: any): Promise<void> {
    this.openLoading();
    const clickedYear = event;
    this.weight_labid_text = "Billed Weight";
    this.fedexFormGroup.get('monthFlag')?.setValue("N");
    this.fedexFormGroup.get('selectedMonth')?.setValue("N");
    this.fedexFormGroup.get('month')?.setValue(null);
    this.fedexFormGroup.get('year')?.setValue(clickedYear);
    this.fedexFormGroup.get('year_1')?.setValue(clickedYear);
    const frtacc_btn = this.fedexFormGroup.get('chargeType')?.value;
    this.dashBoardFRTACCLable =
      frtacc_btn == "FRTWithAcc" ? "" : " (FRT only)";
    await this.fetchdashBoardFedex();
    this.closeLoading()
  }
  async month_LinkBar_itemClickHandler(event: any): Promise<void> {

    this.openLoading();
    this.weight_labid_text = "Billed Weight";

    const clickedMonth = event;

    this.fedexFormGroup.get('month')?.setValue(clickedMonth);
    this.fedexFormGroup.get('monthFlag')?.setValue("Y");
    this.fedexFormGroup.get('selectedMonth')?.setValue("Y");

    const frtacc_btn = this.fedexFormGroup.get('chargeType')?.value;
    this.dashBoardFRTACCLable =
      frtacc_btn == "FRTWithAcc" ? "" : " (FRT only)";

    // (Kept only if used elsewhere; otherwise safe to remove)
    const monthArray = [
      "All", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthTansArray = [
      "All", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (!clickedMonth) {
      this.fedexFormGroup.get('monthFlag')?.setValue("N");
      this.fedexFormGroup.get('selectedMonth')?.setValue("N");
      this.fedexFormGroup.get('month')?.setValue(null);
    } else {
      this.fedexFormGroup.get('monthFlag')?.setValue("Y");
      this.fedexFormGroup.get('selectedMonth')?.setValue("Y");
      this.fedexFormGroup.get('month')?.setValue(clickedMonth);
    }

    await this.fetchdashBoardFedex();
  }
  accountNumberValue: any | null;

  async report_clickHandlerFedex(event: string): Promise<void> {

    this.openModal(
      "Your request has been added to the report queue. When complete, your file will be downloaded automatically."
    );

    const urlParam: any = {};
    const today = new Date();
    const currentYear = today.getFullYear();

    const monthVal = this.fedexFormGroup.get('month')?.value;
    const clickedYear = this.fedexFormGroup.get('year')?.value;
    const clickedMonth = monthVal ?? 0;

    const clientName = this.fedexFormGroup.get('clientName')?.value;
    urlParam.clientName = clientName?.replace(/\s+/g, "_");

    const primaryAcc = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    this.accountNumberValue = primaryAcc == "ALL" ? null : primaryAcc;

    urlParam.accNo = this.accountNumberValue;
    urlParam.accountNumber = this.accountNumberValue;

    /** Date handling */
    if (clickedMonth == 0) {
      // Full year
      urlParam.fromdate = `${clickedYear}-01-01`;

      urlParam.todate =
        clickedYear == currentYear
          ? this.datePipe.transform(this.dataasof, "yyyy-MM-dd")
          : `${clickedYear}-12-31`;
    } else {
      // Specific month
      const lastDay = new Date(clickedYear, clickedMonth, 0).getDate();

      urlParam.fromdate = this.datePipe.transform(
        `${clickedYear}-${clickedMonth}-01`,
        "yyyy-MM-dd"
      );

      urlParam.todate = this.datePipe.transform(
        `${clickedYear}-${clickedMonth}-${lastDay}`,
        "yyyy-MM-dd"
      );

      urlParam.month = clickedMonth.toString();
    }

    /** Special case */
    if (event == "SCCReportDash") {
      urlParam.month = clickedMonth.toString();
      urlParam.year = clickedYear.toString();
    }

    urlParam.action = event;
    urlParam.reportname = event;
    urlParam.clientId = this.fedexFormGroup.get('clientId')?.value;

    /** Build query string */
    const fields_string = Object.entries(urlParam)
      .map(([key, value]) => `${key}=${value ?? ''}`)
      .join('&');

    this.httpfedexService.reportServlet(fields_string);
  }
  async linkshpChangeFedex(data: any) {
    this.openLoading();
    await this.fedexFormGroup.get('chargeType')?.setValue(data);
    await this.fedexFormGroup.get('zoneChargeType')?.setValue(data);//9126
    if (data == "FRT") {
      await this.linkfrt_clickHandlerFedex(data);
    }
    if (data == "FRTWithAcc" || data == null) {
      await this.linkfrtacc_clickHandlerFedex(data);
    }
    this.chargetypevalue.set(this.fedexFormGroup.get('chargeType')?.value);
    this.closeLoading()
  }
  async linkfrt_clickHandlerFedex(event: any) {
    this.dashBoardFRTACCLable = " (FRT only)";
    this.fetchdashBoardFedex();
  }
  async linkfrtacc_clickHandlerFedex(event: any) {
    this.dashBoardFRTACCLable = "";
    this.fetchdashBoardFedex();
  }
  async clickTotalspendFedex(event: any): Promise<void> {

    const urlParam: any = {};

    const monthVal = this.fedexFormGroup.get('month')?.value;
    const clickedYear = this.fedexFormGroup.get('year')?.value;
    const clickedMonth = monthVal ?? 0;

    const rawClientName = this.fedexFormGroup.get('clientName')?.value || '';
    const clientName = rawClientName.replace(/[^a-zA-Z0-9 ]/g, '');

    const currentDate = new Date();

    const primaryAcc = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    const accountNumberVal = primaryAcc == 'ALL' ? null : primaryAcc;

    urlParam.createdDate = currentDate;
    urlParam.requesteddttm = currentDate;
    urlParam.reportName = 'Total_Spend_Report';
    urlParam.reportType = 'Total Spend Report';
    urlParam.chargeDesc = '';
    urlParam.chargeGroup = '';
    urlParam.chargeType = this.fedexFormGroup.get('chargeType')?.value;
    urlParam.reportFormat = 'excel';

    urlParam.accNo = accountNumberVal;
    urlParam.accountNumber = accountNumberVal;
    urlParam.clientName = clientName;
    urlParam.clientId = this.fedexFormGroup.get('clientId')?.value;

    urlParam.fromDate = clickedYear;
    urlParam.toDate = clickedMonth.toString();
    urlParam.month = clickedMonth.toString();
    urlParam.year = clickedYear;

    urlParam.loginId = 0;
    urlParam.modulename = 'DashBoard_Report';
    urlParam.status = 'IN QUEUE';
    urlParam.desc = '';
    urlParam.grp = '';

    urlParam.t002ClientProfileobj =
      this.fedexFormGroup.get('t002ClientProfile')?.value;

    this.httpfedexService.runReport(urlParam).subscribe(
      result => this.saveOrUpdateReportLogResultFedex(result),
      error => console.error('Total Spend Report error', error)
    );
  }
  saveOrUpdateReportLogResultFedex(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.httpfedexService._setIntervalFedEx(this.reportsFormGroup.value);

    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");

  }
  async moreviewWeightDistFedex(): Promise<void> {

    const moreviewObj = {
      invoiceMonth: this.fedexFormGroup.get('month')?.value,
      invoiceyear: this.fedexFormGroup.get('year')?.value,
      clientId: this.fedexFormGroup.get('clientId')?.value,
      monthFlag: this.fedexFormGroup.get('monthFlag')?.value,
      accountNumber: this.fedexFormGroup.get('primaryAccountNumber')?.value,
      chargetypevalue: this.fedexFormGroup.get('chargeType')?.value,
      weight_mainAC: this.T201DashboardObj,
      t002ClientProfile: this.userProfifleFedex,
      themeoption: this.themeoption
    };

    this.sendValue = moreviewObj;
    this.openDialogFedex();
  }
  openDialogFedex() {
    console.log('test');
    const dialogRef = this.dialog.open(FedexWeightDistPopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.sendValue,
        panelClass: this.panelClass
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }
  progressBar: any;
  moreService: any;
  searchUserobjFedExArray: any = [];
  async moreService_clickHandlerFedex(): Promise<void> {

    this.progressBar = {};

    const moreviewObj = {
      month: this.fedexFormGroup.get('month')?.value,
      year: this.fedexFormGroup.get('year')?.value,
      monthFlag: this.fedexFormGroup.get('monthFlag')?.value,
      accountNumber: this.fedexFormGroup.get('primaryAccountNumber')?.value,
      t002ClientProfile: this.userProfifleFedex,
      themeoption: this.themeoption
    };

    this.moreService = moreviewObj;
    this.moreServicePopupComponentFedex();
  }
  async moreServicePopupComponentFedex() {
    const dialogRef = this.dialog.open(FedexMoreServicePopupComponent, {
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
  async searchUser(): Promise<void> {

    const dateFr: Date = this.searchForm.get('fromdate')?.value;
    const dateT: Date = this.searchForm.get('todate')?.value;

    if (!dateFr || !dateT) {
      this.openModal("Please select From and To dates");
      return;
    }

    const yearDiff = dateT.getFullYear() - dateFr.getFullYear();
    if (yearDiff > 1) {
      this.openModal("Time Frame Greater than 2 years");
      return;
    }

    const trackingNumber = this.searchForm.get('trackingNumber')?.value?.trim();
    const chargeSource = this.searchForm.get('chargeSource')?.value;

    if (!trackingNumber) {
      this.openModal(
        chargeSource == "Tracking Number"
          ? "Please Enter Tracking number"
          : "Please Enter a value"
      );
      return;
    }

    const clientName = this.fedexFormGroup.get('clientName')?.value?.replace(/[ ]/g, "_");

    const searchPayload = {
      clientname: clientName,
      fromdate: this.datePipe.transform(dateFr, "yyyy-MM-dd"),
      todate: this.datePipe.transform(dateT, "yyyy-MM-dd"),
      basisValue: 'FedEx',
      trackingNumber: trackingNumber,
      receiverPostal: trackingNumber, // keeping your original logic
      chargeSource: chargeSource,
      trackingcount: "",
      clientId: "",
      type: "",
      t002ClientProfileObj: this.userProfifle
    };

    // this.searchUserobjFedExArray = [searchPayload];
    // this.switchProj.CommonSub.next(this.searchUserobjFedExArray);
    localStorage.setItem('payload_fedex', JSON.stringify(searchPayload));
    this.switchProj.setTrackingPayload(searchPayload); // persist across reload
    this.router.navigate(['fedex/tracking']);
  }
  progressBar_clickHandlerFedex(event: string, eventObj:any) {
    if (eventObj.netCharge == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }
    if (this.GprogressBarFedex == 0 && event == "Ground") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.HmeDelprogressBarFedex == 0 && event == "Home Delivery") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.smartPostprogressBarFedex == 0 && event == "Ground Economy") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FFirOverprogressBarFedex == 0 && event == "FedEx First Overnight") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.FPriovernitprogressBarFedex == 0 && event == "FedEx Priority Overnight") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FStdovernitprogressBarFedex == 0 && event == "FedEx Standard Overnight") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.F2DayAMprogressBarFedex == 0 && event == "FedEx 2Day AM") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.F2DayprogressBarFedex == 0 && event == "FedEx 2Day") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FExpSerprogressBarFedex == 0 && event == "FedEx Express Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.FExpSerprogressBarFedex == 0 && event == "Ground Economy") {
      this.openModal("Data Too Small to Display");
      return;
    }

    //International
    else if (this.internationalGroundprogressBar == 0 && event == "International Ground") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.fedExIntlEconomyprogressBar == 0 && event == "FedEx Intl Economy") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.fedExIntlPriorityprogressBar == 0 && event == "FedEx Intl Priority") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.FedExInternationalFirstprogressBar == 0 && event == "FedEx International First") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.FedExIntlPriorityFrtprogressBar == 0 && event == "FedEx Intl Priority Frt") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedExIntlEconomyFrtprogressBar == 0 && event == "FedEx Intl Economy Frt") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedExIntlPriorityExpressprogressBar == 0 && event == "FedEx Intl Priority Express") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.FedExInternationalConnectPlusprogressBar == 0 && event == "FedEx International Connect Plus") {
      this.openModal("Data Too Small to Display");
      return;
    }
    const progressCheck: Record<string, number> = {
      "Ground": this.GprogressBarFedex,
      "Home Delivery": this.HmeDelprogressBarFedex,
      "Ground Economy": this.smartPostprogressBarFedex,
      "FedEx First Overnight": this.FFirOverprogressBarFedex,
      "FedEx Priority Overnight": this.FPriovernitprogressBarFedex,
      "FedEx Standard Overnight": this.FStdovernitprogressBarFedex,
      "FedEx 2Day A.M.": this.F2DayAMprogressBarFedex,
      "FedEx 2Day": this.F2DayprogressBarFedex,
      "FedEx Express Saver": this.FExpSerprogressBarFedex
    };

    if (progressCheck[event] == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }

    // ✅ Build payload
    this.progressBar = {
      month: this.fedexFormGroup.get('month')?.value,
      year: this.fedexFormGroup.get('year')?.value,
      t002ClientProfile: this.userProfifleFedex,
      accountNumber: this.fedexFormGroup.get('primaryAccountNumber')?.value,
      chargeGroup: this.fedexFormGroup.get('chargeGroup')?.value,
      monthFlag: this.fedexFormGroup.get('monthFlag')?.value,
      chargeType: this.fedexFormGroup.get('chargeType')?.value,
      chargeDescription: event,
      themeoption: this.themeoption
    };

    this.progressBarPopupComponentFedex();
  }

  async progressBarPopupComponentFedex() {
    const dialogRef = this.dialog.open(FedexChargeDescPopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.progressBar,
        panelClass: this.panelClass
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }
  ngOnDestroy(): void {
    if (this.weightChart) {
      this.weightChart.dispose();
    } if (this.totalSpendChart) {
      this.totalSpendChart.dispose();
    }
    if (this.zoneChart) {
      this.zoneChart.dispose();
    }
    if (this.individualPieChart) {
      this.individualPieChart.dispose();
    }
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
