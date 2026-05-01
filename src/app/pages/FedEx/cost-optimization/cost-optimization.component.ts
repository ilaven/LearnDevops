import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  signal,
  effect,
  computed,
  TemplateRef,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';


export interface WeekDate {
  label: string;
  value: string;
  selected: boolean;
}

export interface Month {
  name: string;
  value: number;
  selected: boolean;
  dates: WeekDate[];
}


@Component({
  selector: 'app-ups-cost-optimizationFedex',
  templateUrl: './cost-optimization.component.html',
  styleUrls: ['./cost-optimization.component.scss'],
  standalone: false
})
export class FedexCostOptimizationComponent implements OnInit, AfterViewInit {
  @ViewChild('topScroll', { static: false }) topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll', { static: false }) tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContent', { static: false }) scrollContent!: ElementRef<HTMLDivElement>;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;

  // Variable Declare
  clientType = signal<any>('');
  isLoading = true;
  randomNumber: any;
  clientProfileList: any;
  clientID: any;
  clientName: any;
  clientIdFedex: any;
  fileStartDate: any;
  fileEndDate: any;
  dataasof: any;
  carrierType: any;
  userProfifleFedex: any;
  userProfifleData: any;
  account_details: any[] = [];
  resultAC: any[] = [];
  resultObj: any;
  dataSortField_name: string = "";
  dataSortField_numeric: boolean = true;
  myADG_dataProvider: any[] = [];
  dataGrid_dataProvider: any[] = [];
  dataGrid_columns: any[] = [];
  t006Obj: any;
  openModalConfig: any;
  panelClass: any;
  headerTextArr: any = [];
  t301Obj: any = [];
  yearArray = signal<string[]>([]);
  selectedYear = signal<string>('');
  resizeObserver?: ResizeObserver;



  yearHashMap = new Map();
  accessorialDescMap = new Map<string, any>();
  monthMasterHm = new Map<number, string>();
  monthAC: any[] = [];
  yearHashMapObj = new Map<string, any>();
  monthMasterHm_temp = new Map<string, string>();
  itemHashMap = new Map<string, any>();
  dpAC: any[] = [];
  monthHashMap = new Map<string, any>();
  yearAC: any[] = [];
  displayYear: string = "";
  weekAC: any[] = [];
  previousSelectedYear: string | null = null;
  rdbtn_val: any;
  gridColumn: string = "";
  costOptYear: string = "";
  yearGC: any;
  selectedTab = signal<string>('month');
  months = signal<Month[]>([]);
  selectedYearCheckboxes = new Set<string>();
  expandedYears = new Set<string>();
  // expansion state for month panels in Week tab (key = year+monthName)
  expandedWeekMonths = new Set<string>();
  methodcall = false;


  monthGC: any;
  weekGC: any;
  myADG: any;

  countOfActualArr: number = 0;
  colsActual: any[] = [];
  tempWeekIdArr: any[] = [];
  monthsData: any[] = []; // for the new material search UI

  itemNumberHashMap = new Map<string, any>();
  weekArrAll: any[] = [];

  showColumnPicker = false;
  //Form Group
  fedexFormGroup!: FormGroup;
  treeFormGroup!: FormGroup;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  selectedTabIndex = computed(() => {
    const map: Record<string, number> = { year: 0, month: 1, week: 2 };
    return map[this.selectedTab()] ?? 0;
  });

  collapsedChildrenCount = 0;

  // store expanded group ids
  expanded = new Set<string>();
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
  constructor(private cookiesService: CookiesService,
    private loaderService: LoaderService, private cd: ChangeDetectorRef,
    private commonService: CommonService, private httpfedexService: HttpfedexService, private dialog: MatDialog, private offcanvasService: NgbOffcanvas) {
    // Re-sync months when year change or initial load triggers data refresh
    // whenever the selected year changes we want to recompute the list of
    // months that appear under the month/week tabs; also pick a default
    // month if nothing has been chosen yet.
    effect(() => {
      const targetYear = this.selectedYear();
      if (!targetYear) return;
      this.refreshMonthList(targetYear);
    });

    // Sync selectedYear signal with form
    effect(() => {
      const formYear = this.fedexFormGroup.get('year')?.value;
      if (formYear && formYear !== this.selectedYear()) {
        this.selectedYear.set(formYear);
      }
    });


    this.cookiesService.carrierType.subscribe((clienttype: string) => {
      console.log('clienttype', clienttype);
      this.clientType.set(clienttype);
    });


    this.fedexFormGroup = new FormGroup({
      year: new FormControl(''),
      searchcriteriabtn: new FormControl('month'),
      clientId: new FormControl(''),
      clientName: new FormControl(''),

      primaryAccountNumber: new FormControl(''),
      t002ClientProfile: new FormControl({
        primaryAccountNumber: new FormControl(''),
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
    });

    this.treeFormGroup = new FormGroup({
      children: new FormControl('month')
    });
  }


  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }
  ngOnInit(): void {
    this.openLoading();
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Create Project', active: true }
    ];
    this.initializeDefaults(); // some pending
    this.getUserFedex();
  }

  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  private initializeDefaults(): void {
    this.randomNumber = Math.floor(100000 + Math.random() * 900000);

  }

  async getUserFedex() {
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifleFedex = this.userProfifleData[0];
    var clientID = this.userProfifleFedex.clientId;
    this.clientIdFedex = clientID;
    this.clientName = this.userProfifleFedex.clientName;//9126
    var clientName = this.userProfifleFedex.clientName;


    this.fileStartDate = this.userProfifleFedex.fileStartDate;
    this.fileEndDate = this.userProfifleFedex.fileEndDate;
    var strYearEnd = this.userProfifleFedex.fileenddate1.substring(0, 4);
    var strMonthEnd = this.userProfifleFedex.fileenddate1.substring(4, 6);
    var strDateEnd = this.userProfifleFedex.fileenddate1.substring(6, 8);
    this.dataasof = strMonthEnd + "/" + strDateEnd + "/" + strYearEnd;
    // this.dataasof = this.userProfifleFedex.fileenddate1;
    this.carrierType = this.userProfifleFedex.carrierType;
    this.fedexFormGroup.patchValue({
      t002ClientProfile: {
        "clientId": this.userProfifleFedex.clientId,
        "clientName": this.userProfifleFedex.clientName,
        "userName": this.userProfifleFedex.userName,
        "password": this.userProfifleFedex.password,
        "siteUserName": this.userProfifleFedex.siteUserName,
        'sitePassword': this.userProfifleFedex.sitePassword,
        "address": this.userProfifleFedex.address,
        "contactNo": this.userProfifleFedex.contactNo,
        "comments": this.userProfifleFedex.comments,
        "endDate": this.userProfifleFedex.endDate,
        "startDate": this.userProfifleFedex.startDate,
        "status": this.userProfifleFedex.status,
        "auditStatus": this.userProfifleFedex.auditStatus,
        "contractStatus": this.userProfifleFedex.contractStatus,
        "email": this.userProfifleFedex.email,
        "userLogo": this.userProfifleFedex.userLogo,
        "customerType": this.userProfifleFedex.customerType,
        "dataSource": this.userProfifleFedex.dataSource,
        "dataLoadedBy": this.userProfifleFedex.dataLoadedBy,
        "filestartdate": this.userProfifleFedex.filestartdate,
        "fileenddate": this.userProfifleFedex.fileenddate,
        "dateasof": this.userProfifleFedex.dateasof,
        "currentDate": this.userProfifleFedex.currentDate,
        "currentYear": this.userProfifleFedex.currentYear,
        "currentMonth": this.userProfifleFedex.currentMonth,
        "startYear": this.userProfifleFedex.startYear,
        "createdBy": this.userProfifleFedex.createdBy,
        "createdTs": this.userProfifleFedex.createdTs,
        "updatedTs": this.userProfifleFedex.updatedTs,
        "adminFlag": this.userProfifleFedex.adminFlag,
        "filestartdate1": this.userProfifleFedex.filestartdate1,
        "fileenddate1": this.userProfifleFedex.fileenddate1,
        "trackingcount": this.userProfifleFedex.trackingcount,
        "logostatus": this.userProfifleFedex.logostatus,
        "noofdaystoactive": this.userProfifleFedex.noofdaystoactive,
        "noofdaysinactive": this.userProfifleFedex.noofdaysinactive,
        "ipaddress": this.userProfifleFedex.ipaddress,
        "loginFlag": this.userProfifleFedex.loginFlag,
        "contractSavingFlag": this.userProfifleFedex.contractSavingFlag,
        "clientProfileName": this.userProfifleFedex.clientProfileName,
        "carrierType": this.userProfifleFedex.carrierType,
        "t002AccountDet": this.userProfifleFedex.t002AccountDet,
        "customers": this.userProfifleFedex.customers
      }
    });

    await this.fetchaccountDetails();

    const DateObj: Date = new Date();
    let displayYear: string;
    if (DateObj.getMonth() == 0 || (DateObj.getMonth() == 1 && DateObj.getDate() <= 5)) {
      displayYear = (DateObj.getFullYear() - 1) + "";
    } else {
      displayYear = (DateObj.getFullYear()) + "";
    }

    // var displayYear=(DateObj.getFullYear())+"";
    this.fedexFormGroup.get('year')?.setValue(displayYear);
    this.fedexFormGroup.get('primaryAccountNumber')?.setValue(clientID);
    this.fedexFormGroup.get('clientId')?.setValue(clientID);
    this.fedexFormGroup.get('clientName')?.setValue(clientName);
    this.fetchCostOptimizationDetailsFedEx();

  }

  async getuserProfile(): Promise<any[]> {
    const result = await this.commonService.getUserprofileData();
    this.clientProfileList = result;
    return result;
  }

  async fetchaccountDetails() {
    try {
      const result: any = await firstValueFrom(
        this.httpfedexService.fetchaccountDetails(this.fedexFormGroup.value)
      );

      this.account_details = result.map((item: any) => {
        const nickName = item.nickName?.trim();
        return {
          ...item,
          nickName: !nickName
            ? item.primaryAccountNumber
            : `${item.primaryAccountNumber} - <span>${nickName}</span>`
        };
      });

      // If you still need accountNo separately:
      const accountNo = result[0]?.accountNo;
      console.log("First account number:", accountNo);

    } catch (error: any) {
      console.log("Error fetching FedEx account details", error);
    }
  }

  async fetchCostOptimizationDetailsFedEx() {
    try {
      const result = await firstValueFrom(
        this.httpfedexService.fetchCostOptimizationDetailsFedEx(this.fedexFormGroup.value)
      );
      this.resultObj = result;
      const primeAccNo = this.fedexFormGroup.get('primaryAccountNumber')?.value;
      if (
        primeAccNo == null ||
        primeAccNo === "null" ||
        primeAccNo === this.clientID ||
        primeAccNo === this.clientIdFedex
      ) {
        this.fedexFormGroup.patchValue({ primaryAccountNumber: "null" });
      }
      this.fetchCostOptimizationDetailsFedExResult(result);
    } catch (error: any) {
      this.closeLoading();
      console.log("Error fetching FedEx cost optimization details", error);
    }
    this.cd.detectChanges();
  }

  async fetchCostOptimizationDetailsFedExResult(resultData: any) {
    this.closeLoading();
    this.resultAC = resultData;
    if (resultData == null || resultData.length == 0) {
      this.openModal("No Record found for selected Client!");
    } else {
      // Logic from original block
    }

    this.dataSortField_name = "year";
    this.dataSortField_numeric = true;
    await this.clearAlldataFedex();
    await this.formYearMapFromResultFedex();  //Setting Year Map-This will form number of years in Database 
    await this.getYearACFedex();      // This function will form Year Arraycollection, which is source for ADG. this function in CostOpt ASfile. 
    await this.getMonthACFedex();      // This function will form Month Arraycollection, which is source for ADG. this function in CostOpt ASfile.
    await this.getWeekACFedex();      // This function will form Week Arraycollection, which is source for ADG. this function in CostOpt ASfile.    

    // make sure contained month list is up to date; depending on the order
    // selectedYear may have already been set by the caller, but we explicitly
    // use the form control so the behavior is deterministic.
    const yearVal = this.fedexFormGroup.get('year')?.value;
    this.refreshMonthList(yearVal);
    if (this.methodcall) {
      this.syncSelectionsAndRefresh();
      this.methodcall = false;
    } else {
      await this.rdType_itemClickHandlerFedex();
    }
    this.cd.detectChanges();
  }

  async clearAlldataFedex() {
    this.myADG_dataProvider = [];
    this.dataGrid_dataProvider = [];
    this.dataGrid_columns = [];
    this.yearHashMap = new Map();
    this.accessorialDescMap = new Map();
    this.monthMasterHm = new Map();
    this.monthAC = [];
    this.yearAC = [];
    this.weekAC = [];
    this.yearHashMapObj = new Map();
    this.monthMasterHm_temp = new Map();
    this.itemHashMap = new Map();
    this.dpAC = [];
    this.monthHashMap = new Map();
  }

  async formYearMapFromResultFedex() {
    for (var loop = 0; loop < this.resultAC.length; loop++) {
      var t006Obj = this.resultAC[loop];
      var valueMap = new Map;
      if (this.yearHashMap.has(t006Obj.year)) {
        valueMap = this.yearHashMap.get(t006Obj.year);
      }
      else {
        valueMap = new Map();
      }
      valueMap.set(t006Obj.descriptionGroup, t006Obj);
      //reset the value map to the year map 
      await this.yearHashMap.set(t006Obj.year, valueMap);
      // this map will form the Description of Cost Optimization
      await this.accessorialDescMap.set(t006Obj.descriptionGroup, { sortOrder: t006Obj.sortOrder, childOrder: t006Obj.childOrder });
    }
    this.monthMasterHm.set(0, "JAN");
    this.monthMasterHm.set(1, "FEB");
    this.monthMasterHm.set(2, "MAR");
    this.monthMasterHm.set(3, "APR");
    this.monthMasterHm.set(4, "MAY");
    this.monthMasterHm.set(5, "JUN");
    this.monthMasterHm.set(6, "JUL");
    this.monthMasterHm.set(7, "AUG");
    this.monthMasterHm.set(8, "SEP");
    this.monthMasterHm.set(9, "OCT");
    this.monthMasterHm.set(10, "NOV");
    this.monthMasterHm.set(11, "DEC");
  }

  async getYearACFedex() {
    this.yearArray.set([]);
    this.yearAC = [];
    const displayYear = this.fedexFormGroup.get('year')?.value;

    const years: string[] = Array.from(this.yearHashMap.keys()).sort();
    for (const year of years) {
      const value = this.yearHashMap.get(year);
      this.yearAC.push({ Year: year, Month: "", Week: "", state: "unchecked", sortOrder: value, key: value });
    }
    this.yearArray.set(years);

    const current = this.fedexFormGroup.get('year')?.value;
    if (!current || (years.length > 0 && !years.includes(current))) {
      const defaultYear = years.length ? years[years.length - 1] : '';
      this.fedexFormGroup.get('year')?.setValue(defaultYear);
      this.selectedYear.set(defaultYear);
      this.displayYear = defaultYear;
    }

    // Initialize selectedYearCheckboxes with the active year if empty
    const activeYear = this.fedexFormGroup.get('year')?.value;
    if (activeYear && this.selectedYearCheckboxes.size === 0) {
      this.selectedYearCheckboxes.add(activeYear);
      this.selectedYear.set(activeYear);
    }

  }

  async getMonthACFedex() {
    const keyAC: any[] = [];
    let monthCount = 0;

    for (const [key, value] of this.yearHashMap.entries()) {
      const year_key = key;
      this.displayYear = this.fedexFormGroup.get('year')?.value;

      for (const [monthKey, monthVal] of this.monthMasterHm.entries()) {
        monthCount++;
        const dataval = monthVal;

        if (year_key.toString() === this.displayYear) {
          this.monthAC.push({
            Year: year_key,
            Month: dataval,
            Week: "",
            state: "checked",
            sortOrder: monthKey,
            sortMonth: monthCount
          });
        } else {
          this.monthAC.push({
            Year: year_key,
            Month: dataval,
            Week: "",
            state: "unchecked",
            sortOrder: monthKey,
            sortMonth: monthCount
          });
        }
      }
    }
  }

  async getWeekACFedex() {
    let firstDate = 1;
    let keyAC: any[] = [];
    let month = 0;
    const DateObj = new Date();

    let displayYr: string;
    if (DateObj.getMonth() === 0 || (DateObj.getMonth() === 1 && DateObj.getDate() <= 5)) {
      displayYr = String(DateObj.getFullYear() - 1);
    } else {
      displayYr = String(DateObj.getFullYear());
    }

    const yearData = Number(displayYr) + 1;
    let key_year = 0;

    for (const [key, value] of this.yearHashMap.entries()) {
      const year_val = Number(key);
      key_year = 1 + key_year;
      let weekCount = 1;
      const keyYear = key;
      const monthHashMapObj = new Map<string, any>();

      for (const [monthKey, monthVal] of this.monthMasterHm.entries()) {
        const key_month = monthKey;
        firstDate = 1;
        const year = Number(keyYear);
        month = key_month;
        const weekACtemp: any[] = [];

        let dateObj: Date = new Date(year_val, month + 1, 0);
        const daysInMonth = dateObj.getDate();
        dateObj = new Date(year_val, month, firstDate);
        const firstDayInMonth = dateObj.getDay();

        let flag: boolean = true;
        if (firstDayInMonth !== 6) {
          firstDate = 1 + (6 - firstDayInMonth);
        }

        while (flag) {
          dateObj = new Date(year_val, month, firstDate);
          const currentDay = dateObj.getDay();

          if (currentDay == 6) {
            if (year.toString() == this.displayYear) {
              this.weekAC.push({ Year: year, Month: month, Week: (month + 1) + "/" + firstDate + "/" + year_val, state: "checked", sortOrder: weekCount });
              weekACtemp.push(weekCount++);
            } else {
              this.weekAC.push({ Year: year, Month: month, Week: (month + 1) + "/" + firstDate + "/" + year_val, state: "unchecked", sortOrder: weekCount });
              weekACtemp.push(weekCount++);
            }
          }

          firstDate = firstDate + 7;
          if (firstDate > daysInMonth) {
            flag = false;
          }
        }
        monthHashMapObj.set(month + "", weekACtemp);
      }
      this.yearHashMapObj.set(year_val + "", monthHashMapObj);
    }
  }

  async rdType_itemClickHandlerFedex() {
    this.previousSelectedYear = null;
    this.previousSelectedYear = this.displayYear;
    const displayYear = this.fedexFormGroup.get('year')?.value;

    // Ensure you define this method if you haven't yet:
    // await this.resettingAdvanceDataGrid();

    this.rdbtn_val = this.fedexFormGroup.get('searchcriteriabtn')?.value;

    if (this.rdbtn_val == "year") {
      this.gridColumn = "Year";
      this.costOptYear = "2017";

      if (this.yearAC && this.yearAC.length > 0) {
        this.yearAC.forEach(tempObj => {
          tempObj.state = "checked";
        });
      }

      // Ensure you define these methods if you haven't yet:
      await this.formDataGridYearDataFedex(this.yearHashMap);
      await this.formGridColumnFedex(this.yearHashMap, null, null);

      this.myADG = this.yearGC;

      // Ensure you define this method if you haven't yet:
      //await this.selectedChange(this.rdbtn_val);
    }

    if (this.rdbtn_val == "month") {
      this.gridColumn = "Month";

      // Ensure you define these methods if you haven't yet:
      await this.formMonthMapFromResultFedex(displayYear);
      await this.formDataGridMonthDataFedex(this.monthHashMap);

      this.monthGC = this.monthAC;

      for (let loop = 0; loop < 12; loop++) {
        const mntn = `${this.monthMasterHm.get(loop)} ${this.displayYear}`;
        this.monthMasterHm_temp.set(loop.toString(), mntn);
      }

      // Ensure you define this method if you haven't yet:
      await this.formGridColumnFedex(this.monthHashMap, null, this.monthMasterHm_temp);
    }

    if (this.rdbtn_val == "week") {
      this.gridColumn = "Week";
      var weekItemAC: any[] = [];
      let count = 0;

      for (const obj of this.weekAC) {
        if (obj.Year === Number(this.displayYear)) {
          if (obj.state === "checked") {
            if (this.previousSelectedYear === null) {
              this.previousSelectedYear = obj.Year;
            }

            if (this.previousSelectedYear != obj.Year) {
              this.openModal("Cannot select Week from Different Years, Please unselect Previous Selected Year and Try again!");
              return;
            }
            this.itemHashMap.set(obj.Week, "");
          }
          weekItemAC[count++] = obj.Week;
        }
      }

      // setting Week Map
      const arr: any[] = [];

      // Ensure you define these methods if you haven't yet:
      this.formGridColumnFedex(weekItemAC, weekItemAC, null);
      this.formDataGridWeekDataFedex(this.displayYear, arr);

      this.myADG = this.weekGC;
    }
  }

  async formDataGridYearDataFedex(inputyearHashMap: Map<string, any>) {
    this.dpAC = [];
    let serviceDescAC = this.accessorialDescMap.keys();
    let totalnetspend = 0;
    let totalAdditional = 0;
    let totalOversize = 0;
    let totalUnauthorized = 0;
    let totalPeakSurcharges = 0;
    let totalAddressCorrection = 0;
    let totalResidential = 0;
    let totalLatePayment = 0;
    let totalServiceCharge = 0;
    let totalCallTag = 0;
    let totalDeclaredValue = 0;
    let totalNonMachineable = 0;
    let totalThirdParty = 0;
    let totalInvalidMissing = 0;
    let arrayLoop = [];
    for (let [key, value] of this.accessorialDescMap) {
      arrayLoop.push({ key })
    }
    for (var loop = 0; loop < this.accessorialDescMap.size; loop++) {
      let costObj: any = {};
      let childrenArray = [];
      let parentObj: any = {};
      let yearCheckAdditionalChild = false;
      let serviceDescVal = arrayLoop[loop];
      let serviceDesc = serviceDescVal.key;

      costObj['servicedesc'] = serviceDesc;
      costObj["sortOrder"] = this.accessorialDescMap.get(serviceDesc).sortOrder;
      costObj["childOrder"] = this.accessorialDescMap.get(serviceDesc).childOrder;

      let yearArray = inputyearHashMap.keys();
      let yearArrSize = inputyearHashMap.size;
      let yearArray1 = inputyearHashMap.size;

      var yearArr = [];
      for (let yearCnt = 0; yearCnt < yearArrSize; yearCnt++) {
        yearArr.push(yearArray.next());
      }
      for (var valueCount = 0; valueCount < yearArray1; valueCount++) {
        var yearVal = yearArr[valueCount].value + "";
        var valueMap = this.yearHashMap.get(yearVal);
        if (valueMap.get(serviceDesc) != null) {
          var value = await this.summingthevaluesFedex(valueMap.get(serviceDesc), serviceDesc);
          this.t301Obj = valueMap.get(serviceDesc);
          if (this.t301Obj.descriptionGroup == "Additional Handling 40lb Min. Billed Weight Count" || this.t301Obj.descriptionGroup == "Net Spend") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalnetspend = value + totalnetspend;
            // costObj["total"] =this.setCommaQty(String(totalnetspend)) ;
            costObj["total"] = Number(totalnetspend);
          }
          if (this.t301Obj.descriptionGroup == "Additional Handling Surcharge") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalAdditional = value + totalAdditional;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalAdditional)) );
            costObj["total"] = Number(totalAdditional);
            if (yearCheckAdditionalChild == false) {
              yearCheckAdditionalChild = true;


              let childObj: any = {};
              let additionalChildServiceDesc = [
                "Additional Handling - Weight",
                "Additional Handling - Dimensions",
                "Additional Handling - Packaging",
                "Additional Handling - Non Stackable",
                "Additional Handling - Freight",

              ];
              let filteredValues = additionalChildServiceDesc
                .filter(desc => this.accessorialDescMap.has(desc))       // Keep only if key exists
                .map(desc => ({ key: desc, value: valueMap.get(desc) })); // Get the value

              for (var i = 0; i < filteredValues.length; i++) {
                var totalnetspendchild = 0;
                childObj = {};
                var filterItem = filteredValues[i];
                var filterKey = filterItem.key;
                for (var childCount = 0; childCount < yearArray1; childCount++) {
                  var yearChildVal = yearArr[childCount].value + "";
                  var childMap = this.yearHashMap.get(yearChildVal + "");
                  if (childMap != null) {
                    var childValue = await this.summingthevaluesFedex(childMap.get(filterKey), filterKey);
                    childObj[`value${childCount}`] = Number(childValue);


                    childObj["servicedesc"] = filterKey;
                    childObj["sortOrder"] = this.accessorialDescMap.get(filterKey).sortOrder;
                    childObj["childOrder"] = this.accessorialDescMap.get(filterKey).childOrder;

                    totalnetspendchild = childValue + totalnetspendchild;
                    childObj["total"] = Number(totalnetspendchild);
                  }
                }
                childrenArray.push(childObj)
              }
            }
          }
          if (this.t301Obj.descriptionGroup == "Oversize Surcharge") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalOversize = value + totalOversize;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalOversize)) );
            costObj["total"] = Number(totalOversize);
          }
          if (this.t301Obj.descriptionGroup == "Unauthorized Package Surcharges") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalUnauthorized = value + totalUnauthorized;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalUnauthorized)));
            costObj["total"] = Number(totalUnauthorized);
          }
          if (this.t301Obj.descriptionGroup == "Peak Surcharges" || this.t301Obj.descriptionGroup == "Peak/Demand Surcharges") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalPeakSurcharges = value + totalPeakSurcharges;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalPeakSurcharges)));
            costObj["total"] = Number(totalPeakSurcharges);
          }
          if (this.t301Obj.descriptionGroup == "Address Correction Fees") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalAddressCorrection = value + totalAddressCorrection;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalAddressCorrection)));
            costObj["total"] = Number(totalAddressCorrection);
          }
          if (this.t301Obj.descriptionGroup == "Residential Surcharges via FedEx Ground") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalResidential = value + totalResidential;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalResidential)));
            costObj["total"] = Number(totalResidential);
          }
          if (this.t301Obj.descriptionGroup == "Late Payment Fees") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalLatePayment = value + totalLatePayment;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalLatePayment)) );
            costObj["total"] = Number(totalLatePayment);
          }
          if (this.t301Obj.descriptionGroup == "Call Tag Fees") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalCallTag = value + totalCallTag;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalCallTag)) );
            costObj["total"] = Number(totalCallTag);
          }
          if (this.t301Obj.descriptionGroup == "Declared Value") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalDeclaredValue = value + totalDeclaredValue;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalDeclaredValue)) );
            costObj["total"] = Number(totalDeclaredValue);
          }
          if (this.t301Obj.descriptionGroup == "Non-Machineable Charges (Ground Economy)") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalNonMachineable = value + totalNonMachineable;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalNonMachineable)) );
            costObj["total"] = Number(totalNonMachineable);
          }
          if (this.t301Obj.descriptionGroup == "Service Charge Fees" || this.t301Obj.descriptionGroup == "Pickup Fees") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalServiceCharge = value + totalServiceCharge;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalServiceCharge)) );
            costObj["total"] = Number(totalServiceCharge);
          }
          if (this.t301Obj.descriptionGroup == "Third Party Billing Surcharges") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalThirdParty = value + totalThirdParty;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalThirdParty)) );
            costObj["total"] = Number(totalThirdParty);
          }
          if (this.t301Obj.descriptionGroup == "Invalid/Missing Account Number Fees") {
            value = Number(this.t301Obj.gdyear) || 0;
            totalInvalidMissing = value + totalInvalidMissing;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice(String(totalInvalidMissing)) );
            costObj["total"] = Number(totalInvalidMissing);
          }
          costObj[`value${valueCount}`] = Number(this.t301Obj.gdyear) || 0;
        }

      }
      if (serviceDesc == "Additional Handling Surcharge") {
        parentObj = {
          servicedesc: costObj["servicedesc"],
          sortOrder: costObj["sortOrder"],
          childOrder: costObj["childOrder"],
          total: costObj["total"],
          expanded: false,
          value0: costObj["value0"],
          value1: costObj["value1"],
          value2: costObj["value2"],
          value3: costObj["value3"],
          value4: costObj["value4"],
          value5: costObj["value5"],
          value6: costObj["value6"],
          value7: costObj["value7"],
          value8: costObj["value8"],
          value9: costObj["value9"],
          value10: costObj["value10"],
          children: childrenArray

        };
        this.dpAC.push(parentObj);
      }
      else {
        if (costObj['childOrder'] == null || costObj['childOrder'] == undefined || costObj['childOrder'] == 0) {
          this.dpAC.push(costObj);
        }
      }
    }
  }

  async resettingAdvanceDataGrid(): Promise<void> {

    const rdbtn_val = this.fedexFormGroup.get('searchcriteriabtn')?.value;

    if (rdbtn_val === 'year') {

      if (this.yearAC) {
        this.yearGC = [...this.yearAC];
      }

    } else if (rdbtn_val === 'month') {

      if (this.monthAC) {
        this.monthAC = await this.settingCurrentStatechecked(this.monthAC, this.displayYear);
        this.monthGC = [...this.monthAC];
      }

    } else if (rdbtn_val === 'week') {

      if (this.weekAC) {
        this.weekAC = await this.settingCurrentStatechecked(this.weekAC, this.displayYear);
        this.weekGC = [...this.weekAC];
      }

    }

  }

  async settingCurrentStatechecked(uncheckList: any[], year: string): Promise<any[]> {

    if (!uncheckList || uncheckList.length === 0) {
      return [];
    }

    for (let i = 0; i < uncheckList.length; i++) {

      const obj = uncheckList[i];

      if (obj.Year === year) {
        obj.state = 'checked';
      } else {
        obj.state = 'unchecked';
      }

    }

    return uncheckList;
  }

  async summingthevaluesFedex(t301Objany: any, serviceDesc: string): Promise<number> {
    if (!t301Objany) return 0;

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    // Sum all month values cleanly using array reduce
    const value = months.reduce((sum, month) => sum + (Number(t301Objany[month]) || 0), 0);

    return value;
  }

  async formGridColumnFedex(inputColumnArray: Map<any, any> | any[], allColumnArray: any[] | null, masterMap: Map<string, string> | null) {
    this.countOfActualArr++;

    if (this.countOfActualArr === 1 && allColumnArray?.length) {
      this.colsActual.push(...allColumnArray.map((headerText, i) => ({
        headerText,
        dataField: `value${i}`
      })));
    }

    const cols: any[] = [
      { headerText: 'Key Metric', dataField: 'servicedesc', width: 235 }
    ];

    const inputSize = inputColumnArray instanceof Map ? inputColumnArray.size : inputColumnArray.length;

    if (this.rdbtn_val === 'week' || this.rdbtn_val !== 'week') {
      if (this.rdbtn_val !== 'week' || (this.rdbtn_val === 'week' && inputSize > 0)) {
        cols.push({ headerText: 'TOTAL', dataField: 'total' });
      }
    }

    if (this.rdbtn_val === 'week') {
      const validWeeks = this.tempWeekIdArr.filter(weekObj => weekObj?.weekindex != null && weekObj?.weekstate === "checked");
      cols.push(...validWeeks.map((weekObj) => ({
        headerText: weekObj.week,
        dataField: `value${weekObj.weekindex}`
      })));
    } else {
      const arrData = inputColumnArray instanceof Map ? Array.from(inputColumnArray.keys()) : inputColumnArray;
      cols.push(...arrData.map((key, i) => ({
        headerText: masterMap ? masterMap.get(String(i)) : String(key),
        dataField: `value${i}`
      })));
    }

    this.dataGrid_columns = cols;
    this.cd.detectChanges();
    console.log(this.dataGrid_columns);
  }

  async selectedChange(event: any[]) {
    if (!event?.length) return;

    const nodeVal = this.treeFormGroup.get('children')?.value;

    if (nodeVal === "year") {
      await this.myADG_itemClickHandler(event);
    }
    else if (nodeVal === "month") {
      // Extract unique years from the "MM/YYYY" format
      const uniqueYears = new Set(event.map(displayYr => displayYr.split("/")[1]));

      if (uniqueYears.size <= 1) {
        const displayYear = event[0].split("/")[1];
        if (displayYear && displayYear !== this.fedexFormGroup.get('year')?.value) {
          this.fedexFormGroup.get('year')?.setValue(displayYear);
        }
        await this.myADG_itemClickHandler(event);
      } else {
        this.openModal("Cannot select Month from Different Years, Please unselect Previous Selected Year and Try again!");
      }
    }
    else if (nodeVal === "week") {

      if (!event || event.length === 0) return;

      // Extract years from "MM/DD/YYYY"
      const years = event.map(v => v.split('/')[2]);
      const uniqueYears = [...new Set(years)];

      // Prevent selecting weeks from different years
      if (uniqueYears.length > 1) {
        this.openModal("Cannot select Week from Different Years, Please unselect Previous Selected Year and Try again!");
        return;
      }

      const displayYear = uniqueYears[0];

      // Update the dropdown year
      if (displayYear) {
        this.fedexFormGroup.get('year')?.setValue(displayYear);
      }

      // Call existing grid handler
      await this.myADG_itemClickHandler(event);
      this.cd.detectChanges();
    }
  }

  async myADG_itemClickHandler(event: string[]) {
    if (!event) return;

    const rdbtn_Select = this.treeFormGroup.get('children')?.value;
    const yeardata = this.fedexFormGroup.get('year')?.value || null;

    if (rdbtn_Select === "year") {
      this.rdbtn_val = 'year';
      this.yearAC = [];
      const eventSet = new Set(event); // O(1) lookups for keys

      for (const [key, value] of this.yearHashMap) {
        if (eventSet.has(key)) {
          this.yearAC.push({ Year: key, Month: "", Week: "", state: "checked", sortOrder: value, key: value });
        }
      }

      this.itemHashMap = new Map();
      this.itemNumberHashMap = new Map();

      this.yearAC.forEach(obj => {
        if (obj.state === "checked") {
          this.itemHashMap.set(obj.Year, "");
          this.itemNumberHashMap.set(obj.sortOrder, "");
        }
      });

      await this.formGridColumnFedex(this.itemHashMap, null, null);
      await this.formDataGridYearDataFedex(this.itemHashMap);
    }
    else if (rdbtn_Select === "month") {
      this.rdbtn_val = 'month';
      const eventMonths = new Set(event.map(e => e.split("/")[0])); // Pre-extract months

      this.monthAC.forEach(m => {
        if (m.Year?.toString() === yeardata?.toString()) {
          m.state = eventMonths.has(m.Month) ? "checked" : "unchecked";
        }
      });

      this.itemHashMap = new Map();
      this.itemNumberHashMap = new Map();

      this.monthAC.forEach(obj => {
        if (obj.Year === yeardata && obj.state === "checked" && obj.Month) {
          if (!this.previousSelectedYear) this.previousSelectedYear = obj.Year;
          this.itemHashMap.set(`${obj.Month} ${obj.Year}`, "");
          this.itemNumberHashMap.set(obj.sortOrder, "");
        }
      });

      if (this.itemHashMap.size > 0) {
        await this.formMonthMapFromResultFedex(yeardata);
        await this.formDataGridMonthDataFedex(this.itemNumberHashMap);
        await this.formGridColumnFedex(this.itemHashMap, null, null);
      } else {
        const selectCount = this.chechisItemSelected(this.monthAC);
        if (selectCount === 0) {
          this.previousSelectedYear = null;
          await this.formMonthMapFromResultFedex(yeardata);
          await this.formDataGridMonthDataFedex(this.itemNumberHashMap);
          await this.formGridColumnFedex(this.itemHashMap, null, null);
        }
      }
    }
    else if (rdbtn_Select === "week") {
      this.rdbtn_val = 'week';
      const eventWeeks = new Set(event);

      this.weekAC.forEach(w => {
        if (w.Year?.toString() === yeardata?.toString()) {
          w.state = eventWeeks.has(w.Week) ? "checked" : "unchecked";
        }
      });

      this.itemHashMap = new Map();
      this.itemNumberHashMap = new Map();
      const weekItemAC: string[] = [];
      const checkedItemAC: number[] = [];

      if (this.weekAC?.length) {
        // if (this.weekAC.length === 52 || this.weekAC.length === 53) {
        this.weekArrAll = this.weekAC.map((w, index) => ({ Week: w.Week, WeeekIndex: index }));
        // }

        const weeksForYear = this.weekAC.filter(w => String(w.Year) === String(yeardata));
        this.tempWeekIdArr = weeksForYear.map((w, i) => ({
          weekindex: i,
          week: w.Week,
          weekstate: w.state
        }));

        weeksForYear.forEach((obj, i) => {
          if (obj.state === "checked") {
            this.itemHashMap.set(obj.Week, "");
            checkedItemAC.push(i);
          }
          weekItemAC.push(obj.Week);
        });
      }

      if (this.itemHashMap.size > 0) {
        await this.formGridColumnFedex(this.itemHashMap, weekItemAC, null);
        await this.formDataGridWeekDataFedex(yeardata, checkedItemAC);
      } else {
        const selectCount = this.chechisItemSelected(this.weekAC);
        if (selectCount === 0) {
          this.previousSelectedYear = null;
          await this.formGridColumnFedex(this.itemHashMap, weekItemAC, null);
          await this.formDataGridWeekDataFedex(yeardata, checkedItemAC);
        }
      }
    }
  }

  chechisItemSelected(checkAC: any[]): number {
    return checkAC.some(item => item.state === 'checked') ? 1 : 0;
  }

  async formMonthMapFromResultFedex(selectedYear: any) {

    var monthHm = this.yearHashMapObj.get(selectedYear.toString());

    var divideBy = 0;

    for (var loop = 0; loop < this.resultAC.length; loop++) {
      var costObj = {};
      var testObj = this.resultAC[loop];
      if (testObj.year == selectedYear) {
        var valueArrayObj = this.formvalueArrayFedex(testObj);
      }
      if (testObj.year != selectedYear) {
        continue;
      }
      for (var monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {

        var monthvalue = monthLoop + "";
        var monthSaturdayAC = monthHm.get(monthLoop + "");
        var valueForMonth = 0;



        if (monthLoop == 0) {
          valueForMonth = Number(testObj.jan);

        }
        else if (monthLoop == 1) {
          valueForMonth = Number(testObj.feb);

        }
        else if (monthLoop == 2) {
          valueForMonth = Number(testObj.mar);

        }
        else if (monthLoop == 3) {
          valueForMonth = Number(testObj.apr);

        }
        else if (monthLoop == 4) {
          valueForMonth = Number(testObj.may);

        }

        else if (monthLoop == 5) {
          valueForMonth = Number(testObj.jun);

        }
        else if (monthLoop == 6) {
          valueForMonth = Number(testObj.jul);

        }
        else if (monthLoop == 7) {
          valueForMonth = Number(testObj.aug);

        }
        else if (monthLoop == 8) {
          valueForMonth = Number(testObj.sep);

        }
        else if (monthLoop == 9) {
          valueForMonth = Number(testObj.oct);

        }
        else if (monthLoop == 10) {
          valueForMonth = Number(testObj.nov);

        }
        else if (monthLoop == 11) {
          valueForMonth = Number(testObj.dec);

        }
        var valueMap = new Map();

        //if the year was already added to map , then get the map and get the value map and add this value to the map and reset it
        // if the year map does not contain such year, then create a new map and add it to the year
        if (this.monthHashMap.has(monthvalue)) {
          valueMap = this.monthHashMap.get(monthvalue);
          valueMap.delete(testObj.descriptionGroup);
        }
        else
          valueMap = new Map()

        valueMap.set(testObj.descriptionGroup, valueForMonth);

        await this.monthHashMap.set(monthvalue, valueMap);
      }
    }
  }

  formvalueArrayFedex(testObj: Record<string, any>): any[] {
    // Collect w1...w53 dynamically
    return Array.from({ length: 53 }, (_, i) => testObj[`w${i + 1}`]);
  }

  async formDataGridMonthDataFedex(inputMonthHm: any) {
    this.dpAC = [];
    let serviceDescAC = this.accessorialDescMap.keys();
    let totalAddressCorrection = 0;
    let totalnetspend = 0;
    let totalAdditional = 0;
    let totalOversize = 0;
    let totalResidential = 0;
    let totalLatePayment = 0;
    let totalCallTag = 0;
    let totalDeclaredValue = 0;
    let totalNonMachineable = 0;
    let totalServiceCharge = 0;
    let totalThirdParty = 0;
    let totalInvalid = 0;
    let totalUnauthorized = 0;
    let totalPeakSurcharges = 0;

    let arrayLoop = [];
    for (let [key, value] of this.accessorialDescMap) {

      arrayLoop.push({ key })

    }
    for (var loop = 0; loop < this.accessorialDescMap.size; loop++) {
      let costObj: any = {};
      let childrenArray = [];
      let parentObj: any = {};
      let checkAdditionalChild = false;
      let serviceDescVal = arrayLoop[loop];

      let serviceDesc = serviceDescVal.key;
      costObj["servicedesc"] = serviceDesc;
      var monthArray = inputMonthHm.keys();
      var monthArray1 = inputMonthHm.size;
      costObj["sortOrder"] = this.accessorialDescMap.get(serviceDesc).sortOrder;
      costObj["childOrder"] = this.accessorialDescMap.get(serviceDesc).childOrder;
      var monthArr = [];
      for (let yearCnt = 0; yearCnt < monthArray1; yearCnt++) {
        monthArr.push(monthArray.next());
      }
      for (var valueCount = 0; valueCount < monthArray1; valueCount++) {
        var monthVal = monthArr[valueCount].value + "";
        var valueMap = this.monthHashMap.get(monthVal + "");
        if (valueMap != null) {
          if (valueMap.get(serviceDesc) != null) {

            var value = valueMap.get(serviceDesc);
            costObj[`value${valueCount}`] = Number(value);
            //9059-S

            if (serviceDesc == "Additional Handling 40lb Min. Billed Weight Count" || serviceDesc == "Net Spend") {

              totalnetspend = value + totalnetspend;
              // costObj["total"] =this.setCommaQty( String(totalnetspend)) ;
              costObj["total"] = Number(totalnetspend);

            }
            if (serviceDesc == "Additional Handling Surcharge") {

              totalAdditional = value + totalAdditional;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalAdditional)) );
              costObj["total"] = Number(totalAdditional);
              if (checkAdditionalChild == false) {
                checkAdditionalChild = true;

                let childObj: any = {};
                let additionalChildServiceDesc = [
                  "Additional Handling - Weight",
                  "Additional Handling - Dimensions",
                  "Additional Handling - Packaging",
                  "Additional Handling - Non Stackable",
                  "Additional Handling - Freight"
                ];
                let filteredValues = additionalChildServiceDesc
                  .filter(desc => this.accessorialDescMap.has(desc))       // Keep only if key exists
                  .map(desc => ({ key: desc, value: valueMap.get(desc) })); // Get the value

                for (var i = 0; i < filteredValues.length; i++) {
                  var totalnetspendchild = 0;
                  childObj = {};
                  var filterItem = filteredValues[i];
                  var filterKey = filterItem.key;
                  for (var childCount = 0; childCount < monthArray1; childCount++) {
                    var monthVal = monthArr[childCount].value + "";
                    var childMap = this.monthHashMap.get(monthVal + "");
                    if (childMap != null) {
                      if (childMap.get(filterKey) != null) {
                        var childValue = childMap.get(filterKey);
                      }
                      childObj[`value${childCount}`] = Number(childValue);

                      childObj["servicedesc"] = filterKey;
                      childObj["sortOrder"] = this.accessorialDescMap.get(filterKey).sortOrder;
                      childObj["childOrder"] = this.accessorialDescMap.get(filterKey).childOrder;
                      const child = {
                        servicedesc: childObj["servicedesc"],
                        sortOrder: childObj["sortOrder"],
                        total: childObj["total"],
                        value0: childObj["value0"],
                        value1: childObj["value1"],
                        value2: childObj["value2"],
                        value3: childObj["value3"],
                        value4: childObj["value4"],
                        value5: childObj["value5"],
                        value6: childObj["value6"],
                        value7: childObj["value7"],
                        value8: childObj["value8"],
                        value9: childObj["value9"],
                        value10: childObj["value10"],
                        value11: childObj["value11"],


                      }
                      totalnetspendchild = childValue + totalnetspendchild;
                      childObj["total"] = Number(totalnetspendchild);
                    }
                  }
                  childrenArray.push(childObj)
                }
              }
            }
            if (serviceDesc == "Oversize Surcharge") {

              totalOversize = value + totalOversize;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalOversize)) );
              costObj["total"] = Number(totalOversize);
            }

            if (serviceDesc == "Unauthorized Package Surcharges") {

              totalUnauthorized = value + totalUnauthorized;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalUnauthorized)) );
              costObj["total"] = Number(totalUnauthorized);
            }
            if (serviceDesc == "Peak Surcharges" || serviceDesc == "Peak/Demand Surcharges") {

              totalPeakSurcharges = value + totalPeakSurcharges;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalPeakSurcharges)) );
              costObj["total"] = Number(totalPeakSurcharges);
            }
            if (serviceDesc == "Address Correction Fees") {

              totalAddressCorrection = value + totalAddressCorrection;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalAddressCorrection)) );
              costObj["total"] = Number(totalAddressCorrection);
            }
            if (serviceDesc == "Residential Surcharges via FedEx Ground") {

              totalResidential = value + totalResidential;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalResidential)) );
              costObj["total"] = Number(totalResidential);
            }
            if (serviceDesc == "Late Payment Fees") {

              totalLatePayment = value + totalLatePayment;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalLatePayment)) );
              costObj["total"] = Number(totalLatePayment);
            }
            if (serviceDesc == "Call Tag Fees") {

              totalCallTag = value + totalCallTag;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalCallTag)) );
              costObj["total"] = Number(totalCallTag);
            }
            if (serviceDesc == "Declared Value") {

              totalDeclaredValue = value + totalDeclaredValue;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalDeclaredValue)) );
              costObj["total"] = Number(totalDeclaredValue);
            }
            if (serviceDesc == "Non-Machineable Charges (Ground Economy)") {

              totalNonMachineable = value + totalNonMachineable;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalNonMachineable)) );
              costObj["total"] = Number(totalNonMachineable);
            }
            if (serviceDesc == "Service Charge Fees" || serviceDesc == "Pickup Fees") {

              totalServiceCharge = value + totalServiceCharge;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalServiceCharge)) );
              costObj["total"] = Number(totalServiceCharge);
            }
            if (serviceDesc == "Third Party Billing Surcharges") {

              totalThirdParty = value + totalThirdParty;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalThirdParty)) );
              costObj["total"] = Number(totalThirdParty);
            }
            if (serviceDesc == "Invalid/Missing Account Number Fees") {

              totalInvalid = value + totalInvalid;
              // costObj["total"] ="$"+this.setCommaQty( this.set2dpforPriceFedex(String(totalInvalid)) );
              costObj["total"] = Number(totalInvalid);
            }
            //9059-E
          }
        }

      }
      if (serviceDesc == "Additional Handling Surcharge") {

        parentObj = {
          servicedesc: costObj["servicedesc"],
          sortOrder: costObj["sortOrder"],
          childOrder: costObj["childOrder"],
          total: costObj["total"],
          expanded: false,
          value0: costObj["value0"],
          value1: costObj["value1"],
          value2: costObj["value2"],
          value3: costObj["value3"],
          value4: costObj["value4"],
          value5: costObj["value5"],
          value6: costObj["value6"],
          value7: costObj["value7"],
          value8: costObj["value8"],
          value9: costObj["value9"],
          value10: costObj["value10"],
          value11: costObj["value11"],
          children: childrenArray

        };
        this.dpAC.push(parentObj);
      }

      else {
        if (costObj['childOrder'] == null || costObj['childOrder'] == undefined || costObj['childOrder'] == 0) {
          this.dpAC.push(costObj);
        }
      }
    }
  }

  formDataGridWeekDataFedex(selectedYear: any, selectitem: any) {
    this.costOptYear = selectedYear;
    this.dpAC = [];

    var serviceDescAC: any = [];
    serviceDescAC = this.accessorialDescMap.keys();
    var arrayLoop = [];
    for (let [key, value] of this.accessorialDescMap) {
      arrayLoop.push({ key })
      /*
      
      */
    }

    var totalShipmentsPackage = 0;
    for (var loop = 0; loop < this.accessorialDescMap.size; loop++) {
      var costObj: any = {};
      var childrenArray = [];
      var parentObj: any = {};
      var weekCheckAdditionalChild = false;
      var serviceDescVal = arrayLoop[loop];
      var serviceDesc = serviceDescVal.key;
      costObj["servicedesc"] = serviceDesc;
      costObj["sortOrder"] = this.accessorialDescMap.get(serviceDesc).sortOrder;
      costObj["childOrder"] = this.accessorialDescMap.get(serviceDesc).childOrder;
      var valueMap = this.yearHashMap.get(selectedYear);

      if (valueMap.get(serviceDesc) != null) {
        const serviceData = valueMap.get(serviceDesc);
        for (let i = 0; i < this.tempWeekIdArr.length; i++) {
          if (this.tempWeekIdArr[i]?.weekindex != null) {
            costObj[`value${i}`] = Number(serviceData?.[`wk${i + 1}`]) || 0;
          }
        }

        totalShipmentsPackage = 0;

        if (serviceDesc == "Additional Handling Surcharge") {
          for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
            if (this.tempWeekIdArr[i].weekstate === 'checked') {
              totalShipmentsPackage += Number(this.removeCommas(costObj[`value${i}`]));
            }
          }

          costObj["total"] = Number(totalShipmentsPackage);

          if (weekCheckAdditionalChild == false) {
            weekCheckAdditionalChild = true;

            let childObj: any = {};
            var ChildServiceDesc: any;
            if (serviceDesc == "Additional Handling Surcharge") {
              ChildServiceDesc = [
                "Additional Handling - Weight",
                "Additional Handling - Dimensions",
                "Additional Handling - Packaging",
                "Additional Handling - Non Stackable",
                "Additional Handling - Freight"
              ]
            };
            let filteredValues = ChildServiceDesc
              .filter((desc: any) => this.accessorialDescMap.has(desc))       // Keep only if key exists
              .map((desc: any) => ({ key: desc, value: valueMap.get(desc) })); // Get the value
            for (var i = 0; i < filteredValues.length; i++) {
              var totalnetspendchild = 0;
              let childObj: any = {}
              var totalChildWeek = 0;
              var filterItem = filteredValues[i];
              var filterKey = filterItem.key;

              if (valueMap.get(filterKey) != null) {
                var childValue = valueMap.get(filterKey);
                const serviceData = valueMap.get(filterKey);
                for (let i = 0; i < this.tempWeekIdArr.length; i++) {
                  if (this.tempWeekIdArr[i]?.weekindex != null) {
                    childObj[`value${i}`] = Number(serviceData?.[`wk${i + 1}`]) || 0;
                  }
                }

                totalChildWeek = 0;
                for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
                  if (this.tempWeekIdArr[i].weekstate === 'checked') {
                    totalChildWeek += Number(this.removeCommas(childObj[`value${i}`]));
                  }
                }

                childObj["total"] = Number(totalChildWeek);
                childObj["servicedesc"] = filterKey;
                childObj["sortOrder"] = this.accessorialDescMap.get(filterKey).sortOrder;
                childObj["childOrder"] = this.accessorialDescMap.get(filterKey).childOrder;

                childrenArray.push(childObj)
              }
            }
          }

        } else {
          totalShipmentsPackage = 0;
          for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
            if (this.tempWeekIdArr[i].weekstate === 'checked') {
              totalShipmentsPackage += Number(this.removeCommas(costObj[`value${i}`]));
            }
          }
          costObj["total"] = Number(totalShipmentsPackage);
        }
        if (serviceDesc == "Additional Handling Surcharge") {
          parentObj = {
            servicedesc: costObj["servicedesc"],
            sortOrder: costObj["sortOrder"],
            childOrder: costObj["childOrder"],
            total: costObj["total"],
            expanded: false,
            value0: costObj["value0"],
            value1: costObj["value1"],
            value2: costObj["value2"],
            value3: costObj["value3"],
            value4: costObj["value4"],
            value5: costObj["value5"],
            value6: costObj["value6"],
            value7: costObj["value7"],
            value8: costObj["value8"],
            value9: costObj["value9"],
            value10: costObj["value10"],
            value11: costObj["value11"],
            value12: costObj["value12"],
            value13: costObj["value13"],
            value14: costObj["value14"],
            value15: costObj["value15"],
            value16: costObj["value16"],
            value17: costObj["value17"],
            value18: costObj["value18"],
            value19: costObj["value19"],
            value20: costObj["value20"],
            value21: costObj["value21"],
            value22: costObj["value22"],
            value23: costObj["value23"],
            value24: costObj["value24"],
            value25: costObj["value25"],
            value26: costObj["value26"],
            value27: costObj["value27"],
            value28: costObj["value28"],
            value29: costObj["value29"],
            value30: costObj["value30"],
            value31: costObj["value31"],
            value32: costObj["value32"],
            value33: costObj["value33"],
            value34: costObj["value34"],
            value35: costObj["value35"],
            value36: costObj["value36"],
            value37: costObj["value37"],
            value38: costObj["value38"],
            value39: costObj["value39"],
            value40: costObj["value40"],
            value41: costObj["value41"],
            value42: costObj["value42"],
            value43: costObj["value43"],
            value44: costObj["value44"],
            value45: costObj["value45"],
            value46: costObj["value46"],
            value47: costObj["value47"],
            value48: costObj["value48"],
            value49: costObj["value49"],
            value50: costObj["value50"],
            value51: costObj["value51"],
            value52: costObj["value52"],
            children: childrenArray

          };
          this.dpAC.push(parentObj);
        }
        else {
          if (costObj['childOrder'] == null || costObj['childOrder'] == undefined || costObj['childOrder'] == 0) {
            this.dpAC.push(costObj);
          }
        }
      }
    }
  }

  set2dpforPrice(value_price: any) {
    var value;
    if (value_price == null || value_price == "." || value_price == "" || value_price == 'null') {
      value = "0.00";
    }
    else if (value_price == "0") {
      value = "0.00";
    }
    else {
      let parsed = parseFloat(value_price);
      value = isNaN(parsed) ? "0.00" : parsed.toFixed(2);
    }
    return value;
  }

  removeCommas(str: any) {
    if (str != null) {
      str = (str.toString().replace(/[$,]/g, ""));
      return str;
    }
    return "0";
  }

  /** Formats a cell value for display in the data grid table.
   *  - Numbers are shown with 2 decimal places and thousands commas (e.g. 1,234.56)
   *  - null/undefined/NaN returns '-'
   */
  getExcelFormattedValue(value: any, row: number, childRow?: number): string {
    let numericValue = Number(value);
    if (isNaN(numericValue)) return '-';
    if (numericValue === 0) {
      // Excel format for zero values
      if (row === 0 || (row === 6 && (childRow === 2 || childRow === 3))) return '-';
      if (row === 6 && childRow === 1) return '- %';   // percentage row also shows '-'
      return '$ -';
    }

    let formattedValue = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(numericValue)); // Ensures 2 decimal places

    let formattedValueCount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(numericValue));

    if (row === 0 || (row === 6 && (childRow === 2 || childRow === 3))) {
      return `${formattedValueCount}`;
    }
    else if (row === 6 && childRow === 1) {
      return numericValue < 0 ? `(${formattedValue}) %` : `${formattedValue} %`;
    }
    else {
      return numericValue < 0 ? `$ (${formattedValue})` : `$ ${formattedValue}`;
    }

  }



  isExpanded(id: string): boolean {
    return this.expanded.has(id);
  }

  toggleGroup(id: string): void {
    this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
  }

  visibleChildren(group: { id: string; children?: any[] }): any[] {
    const kids = group.children ?? [];
    return this.isExpanded(group.id) ? kids : kids.slice(0, this.collapsedChildrenCount);
  }

  ngAfterViewInit() {
    this.updateTopScrollWidth();
    // Keep top scrollbar width in sync with table width changes
    this.resizeObserver = new ResizeObserver(() => this.updateTopScrollWidth());
    this.resizeObserver.observe(this.tableScroll.nativeElement);
    // Also update after a tick (helps when fonts/layout settle)
    setTimeout(() => this.updateTopScrollWidth(), 0);
    this.cd.detectChanges();
  }

  private updateTopScrollWidth(): void {
    if (!this.tableScroll?.nativeElement || !this.scrollContent?.nativeElement) return;
    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    this.scrollContent.nativeElement.style.width = `${tableWidth}px`;
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  getMonthsData(): any[] {
    const data: any[] = [];
    const yearList = this.yearArray();

    // Group monthAC by year
    yearList.forEach(year => {
      const yearMonths = this.monthAC.filter(m => m.Year === year);
      const yearWeeks = this.weekAC.filter(w => w.Year.toString() === year.toString());

      const monthsForYear = yearMonths.map((m, idx) => {
        const weeksForMonth = yearWeeks.filter(w => w.Month === m.sortOrder);
        return {
          name: m.Month,
          value: m.sortOrder,
          selected: m.state === 'checked',
          dates: weeksForMonth.map(w => ({
            label: w.Week,
            value: w.Week,
            selected: w.state === 'checked'
          }))
        };
      });

      // We'll just return the months for the currently selected year or all
      // For now, let's keep it simple as the search component expectation
    });

    // Actually, the search component expected a flat Month[] for a selected year
    // I will return all months and the search component can filter or I can filter here
    let targetYear = this.fedexFormGroup.get('year')?.value;
    if (this.yearArray().length > 0 && !this.yearArray().includes(targetYear)) {
      targetYear = this.yearArray()[0];
    }

    return this.monthAC
      .filter(m => m.Year?.toString() === targetYear?.toString())
      .map(m => {
        const weeksForMonth = this.weekAC.filter(w => w.Year?.toString() === m.Year?.toString() && w.Month === m.sortOrder);
        return {
          name: m.Month,
          value: m.sortOrder,
          selected: m.state === 'checked',
          dates: weeksForMonth.map(w => ({
            label: w.Week,
            value: w.Week,
            selected: w.state === 'checked'
          }))
        };
      });
  }

  async checkTree() {
    const nodeVal = this.treeFormGroup.get('children')?.value;
    this.fedexFormGroup.get('searchcriteriabtn')?.setValue(nodeVal);
    this.syncSelectionsAndRefresh();
  }

  async account_clickHandler() {
    this.openLoading();
    var primaryAccountNumber = this.fedexFormGroup.get('primaryAccountNumber')?.value;

    if (primaryAccountNumber == "null") {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(this.clientIdFedex);
    } else {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(primaryAccountNumber);
    }
    this.methodcall = true;
    await this.fetchCostOptimizationDetailsFedEx();
  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  generateExcel() {

    this.openModal(
      "Your request has been added to the report queue. When complete, your file will be downloaded automatically."
    );

    const headerTextArr = this.dataGrid_columns.map(c => c.headerText);

    const year = this.fedexFormGroup.get('year')?.value;
    const fileName = `${this.clientName}_Cost_Optimization_Report_${year}.xlsx`;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Cost Optimization Insights');

    worksheet.properties.outlineLevelRow = 1;

    const headerRow = worksheet.addRow(headerTextArr);

    headerRow.font = {
      family: 4,
      size: 12,
      color: { argb: 'F9F9F9' },
      bold: true
    };

    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F81BD' }
      };

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    let count = 1;

    const parseNumber = (value: any) =>
      Number(String(value).replace('$', '').replace('%', '').replace(/[,]/g, '')) || 0;

    for (const parent of this.dpAC) {

      const parentRowData = this.dataGrid_columns.map((col, index) => {

        let value = parent[col.dataField] ?? '';

        return index === 0 ? value : parseNumber(value);

      });

      const parentRow = worksheet.addRow(parentRowData);

      parentRow.outlineLevel = 0;
      parentRow.hidden = false;

      const parentColor = count % 2 === 0 ? 'd0e3ff' : 'e6e1e1';

      this.formatExcelRow(parentRow, count++, 0, parentColor);

      if (parent.children?.length) {

        let childCount = 1;

        for (const child of parent.children) {

          const childRowData = this.dataGrid_columns.map((col, index) => {

            let value = child[col.dataField] ?? '';

            if (index === 0) {
              return '    ' + value;
            }

            if (count === 8 && childCount === 1) {
              return parseNumber(value) / 100;
            }

            return parseNumber(value);

          });

          const childRow = worksheet.addRow(childRowData);

          childRow.outlineLevel = 1;
          childRow.hidden = false;

          this.formatExcelRow(childRow, count, childCount++, parentColor);

        }
      }
    }

    this.dataGrid_columns.forEach((_, i) => {
      worksheet.getColumn(i + 1).width = i === 0 ? 44 : 12;
    });

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then(data => {

      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      fs.saveAs(blob, fileName);

    });
  }

  formatExcelRow(row: any, count: number, childCount: number, customColor?: string): void {

    const fillColor = customColor;

    const isPlainNumber =
      count === 1 || (count === 8 && (childCount === 2 || childCount === 3));

    const isPercentage =
      count === 8 && childCount === 1;

    row.eachCell((cell: any, number: number) => {

      if (number === 1 || number === 2) {
        cell.font = { bold: true };
      }

      const val = cell.value;

      cell.alignment = {
        horizontal: "left",
        vertical: "middle"
      };

      if (typeof val === "number" && val === 0) {

        if (isPlainNumber) {
          cell.value = "-";
        }
        else if (isPercentage) {
          cell.value = "- %";
        }
        else {
          cell.value = "$ -";
        }
      }

      if (typeof val === "number") {

        if (isPlainNumber) {
          cell.numFmt = "#,##0";
        }
        else if (isPercentage) {
          cell.numFmt = "0.00%";
        }
        else {
          cell.numFmt = "$#,##0.00";
        }
      }

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fillColor }
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };

    });
  }

  openEnd(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }

  async onTabChange(event: any): Promise<void> {
    const tabs = ['year', 'month', 'week'];
    const selectedTab = tabs[event.index];
    this.selectedTab.set(selectedTab);

    // Sync with form group so underlying logic knows which mode is active
    this.fedexFormGroup.get('searchcriteriabtn')?.setValue(selectedTab);
    this.treeFormGroup.get('children')?.setValue(selectedTab);

    // Enforce single year constraint for month/week tabs
    if (selectedTab === 'month' || selectedTab === 'week') {
      if (this.selectedYearCheckboxes.size > 1) {
        const sorted = Array.from(this.selectedYearCheckboxes).sort();
        const latest = sorted[sorted.length - 1];
        this.selectedYearCheckboxes.clear();
        this.selectedYearCheckboxes.add(latest);
        this.selectedYear.set(latest);
        this.fedexFormGroup.get('year')?.setValue(latest);

        // Uncheck selections for other years
        this.monthAC.forEach(m => {
          if (m.Year?.toString() !== latest) m.state = 'unchecked';
        });
        this.weekAC.forEach(w => {
          if (w.Year?.toString() !== latest) w.state = 'unchecked';
        });
      }
    }

    this.syncSelectionsAndRefresh();
  }

  /**
   * populate the `months` signal for a given year and, if no months are
   * already selected, choose a sensible default (current calendar month when
   * the year matches today, otherwise the first month in the list).
   */
  private refreshMonthList(year: string): void {
    const data = this.getMonthsDataInternal(year);
    if (data && data.length > 0) {
      const anySelected = data.some(m => m.selected);
      if (!anySelected) {
        const today = new Date();
        let defaultIdx = 0;
        if (Number(year) === today.getFullYear()) {
          defaultIdx = today.getMonth();
        }
        if (defaultIdx < data.length) {
          data[defaultIdx].selected = true;
        }
      }
      this.months.set(data);
    }
  }

  private getMonthsDataInternal(year: string): Month[] {
    return this.monthAC
      .filter(m => m.Year?.toString() === year?.toString())
      .map(m => {
        const weeksForMonth = this.weekAC.filter(w => w.Year?.toString() === m.Year?.toString() && w.Month === m.sortOrder);
        return {
          name: m.Month,
          value: m.sortOrder,
          selected: m.state === 'checked',
          dates: weeksForMonth.map(w => ({
            label: w.Week,
            value: w.Week,
            selected: w.state === 'checked'
          }))
        };
      });
  }

  toggleYearCheckbox(year: string, checked: boolean): void {
    const tab = this.selectedTab();
    if (checked && (tab === 'month' || tab === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        // Enforce single selection with alert
        this.openModal("Please select only one year for " + tab + " selection. Currently " + Array.from(this.selectedYearCheckboxes).join(', ') + " is selected.");
        this.selectedYearCheckboxes.clear();
        this.monthAC.forEach(m => m.state = 'unchecked');
        this.weekAC.forEach(w => w.state = 'unchecked');
      }
    }

    if (checked) {
      this.selectedYearCheckboxes.add(year);
      this.selectedYear.set(year);
      this.fedexFormGroup.get('year')?.setValue(year);
      this.expandedYears.add(year);
      if (tab === 'month' || tab === 'week') {
        // Auto-check all months for this year when it's selected in month/week tabs
        this.monthAC.forEach(m => {
          if (m.Year?.toString() === year) m.state = 'checked';
        });
        this.weekAC.forEach(w => {
          if (w.Year?.toString() === year) w.state = 'checked';
        });
        this.refreshMonthList(year);
      }
    } else {
      this.selectedYearCheckboxes.delete(year);
      // Uncheck all months and weeks for this year
      this.monthAC.forEach(m => {
        if (m.Year.toString() === year.toString()) {
          m.state = 'unchecked';
        }
      });
      this.weekAC.forEach(w => {
        if (w.Year.toString() === year.toString()) {
          w.state = 'unchecked';
        }
      });

      if (this.selectedYear() === year) {
        const remaining = Array.from(this.selectedYearCheckboxes);
        if (remaining.length > 0) {
          const next = remaining[remaining.length - 1];
          this.selectedYear.set(next);
          this.fedexFormGroup.get('year')?.setValue(next);
        }
      }
    }
    this.syncSelectionsAndRefresh();
  }

  toggleYearExpansion(year: string): void {
    if (this.expandedYears.has(year)) {
      this.expandedYears.delete(year);
    } else {
      this.expandedYears.add(year);
    }
  }

  isYearExpanded(year: string): boolean {
    return this.expandedYears.has(year);
  }

  /** Toggle expand/collapse for a month row inside the Week tab. */
  toggleWeekMonthExpansion(year: string, monthName: string): void {
    const key = `${year}-${monthName}`;
    this.expandedWeekMonths.has(key)
      ? this.expandedWeekMonths.delete(key)
      : this.expandedWeekMonths.add(key);
  }

  /** Returns true when the given month panel is expanded in the Week tab. */
  isWeekMonthExpanded(year: string, monthName: string): boolean {
    return this.expandedWeekMonths.has(`${year}-${monthName}`);
  }

  getMonthsForYear(year: string): Month[] {
    return this.getMonthsDataInternal(year);
  }

  private syncSelectionsAndRefresh(): void {
    const selectedTab = this.selectedTab();
    const currentYear = this.selectedYear();
    let selectedIds: string[] = [];

    if (selectedTab === 'year') {
      const allUnchecked = this.selectedYearCheckboxes.size === 0;
      if (allUnchecked) {
        selectedIds = Array.from(this.yearArray());
      } else {
        selectedIds = Array.from(this.selectedYearCheckboxes);
      }
      this.yearAC.forEach(y => {
        y.state = allUnchecked || this.selectedYearCheckboxes.has(y.Year) ? 'checked' : 'unchecked';
      });
    } else if (selectedTab === 'month') {
      const selectedMonths = this.monthAC.filter(m => m.state === 'checked' && m.Year?.toString() === currentYear);
      if (selectedMonths.length === 0 && this.selectedYearCheckboxes.has(currentYear)) {
        selectedIds = this.monthAC
          .filter(m => m.Year?.toString() === currentYear)
          .map(m => `${m.Month}/${currentYear}`);
      } else {
        selectedIds = selectedMonths.map(m => `${m.Month}/${currentYear}`);
      }
    } else if (selectedTab === 'week') {
      const weeksForYear = this.weekAC.filter(w => w.Year?.toString() === currentYear);
      const selectedWeeks = weeksForYear.filter(w => w.state === 'checked');

      if (selectedWeeks.length === 0 && this.selectedYearCheckboxes.has(currentYear)) {
        selectedIds = weeksForYear.map(w => w.Week);
      } else {
        selectedIds = selectedWeeks.map(w => w.Week);
      }

      // Fix: populate tempWeekIdArr with ALL weeks for the year to maintain correct indexing (1..53)
      this.tempWeekIdArr = weeksForYear.map((w, i) => ({
        weekindex: i,
        week: w.Week,
        weekstate: w.state
      }));
    }

    this.myADG_itemClickHandler(selectedIds);
    this.cd.detectChanges();
  }

  async onYearChange(year: string): Promise<void> {
    // store the value that was previously in the control in case we need to
    // roll back (e.g. the backend returns no rows for the newly chosen year).
    const previous = this.fedexFormGroup.get('year')?.value;

    // optimistically update the UI so that the dropdown and month/week
    // lists appear to react immediately.  these changes may be reverted below
    // if the fetch comes back empty.
    this.displayYear = year;
    this.selectedYear.set(year);
    this.fedexFormGroup.get('year')?.setValue(year);
    this.refreshMonthList(year);
    this.previousSelectedYear = null;
    const numericYear = Number(year);
    // Reset ALL months and weeks to unchecked – none are pre-selected by default
    this.monthAC.forEach(m => m.state = 'unchecked');
    this.weekAC.forEach(w => {
      if (w.Year !== numericYear) {
        w.state = 'unchecked';
      }
    });

    // also keep the year tab checkboxes in sync
    this.selectedYearCheckboxes.clear();
    this.selectedYearCheckboxes.add(year);
    await this.checkTree();
  }

  isIndeterminate(month: Month): boolean {
    const selectedCount = month.dates.filter(d => d.selected).length;
    return selectedCount > 0 && selectedCount < month.dates.length;
  }

  toggleMonth(month: Month, checked: boolean, year?: string): void {
    if (checked && year && (this.selectedTab() === 'month' || this.selectedTab() === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        this.openModal("Please select only one year for " + this.selectedTab() + " selection.");
        return;
      }
      if (this.selectedYearCheckboxes.size === 0) {
        this.toggleYearCheckbox(year, true);
      }
    }

    if (year) {
      const target = this.monthAC.find(m => m.Year?.toString() === year.toString() && m.Month === month.name);
      if (target) target.state = checked ? 'checked' : 'unchecked';

      this.weekAC.forEach(w => {
        if (w.Year?.toString() === year.toString() && w.Month === month.value) {
          w.state = checked ? 'checked' : 'unchecked';
        }
      });
    } else {
      month.selected = checked;
      if (month.dates) month.dates.forEach(d => d.selected = checked);
    }
    this.syncSelectionsAndRefresh();
  }

  toggleDate(month: Month, date: WeekDate, checked: boolean, year?: string): void {
    if (checked && year && (this.selectedTab() === 'month' || this.selectedTab() === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        this.openModal("Please select only one year for " + this.selectedTab() + " selection.");
        return;
      }
      if (this.selectedYearCheckboxes.size === 0) {
        this.toggleYearCheckbox(year, true);
      }
    }

    if (year) {
      const targetWeek = this.weekAC.find(w => w.Year?.toString() === year.toString() && w.Week === date.value);
      if (targetWeek) targetWeek.state = checked ? 'checked' : 'unchecked';

      const weeksForMonth = this.weekAC.filter(w => w.Year?.toString() === year.toString() && w.Month === month.value);
      const allDone = weeksForMonth.every(w => w.state === 'checked');
      const targetMonth = this.monthAC.find(m => m.Year?.toString() === year.toString() && m.Month === month.name);
      if (targetMonth) targetMonth.state = allDone ? 'checked' : 'unchecked';
    } else {
      date.selected = checked;
      month.selected = month.dates.every(d => d.selected);
    }
    this.syncSelectionsAndRefresh();
  }

  isAllSelected(month: Month): boolean {
    return month.dates && month.dates.length > 0 && month.dates.every(d => d.selected);
  }

  isYearChecked(year: string): boolean {
    return this.selectedYearCheckboxes.has(year);
  }



}
