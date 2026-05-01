import { AfterViewInit, ChangeDetectorRef, Component, computed, effect, ElementRef, OnDestroy, OnInit, signal, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as fs from 'file-saver';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';


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
  selector: 'app-ups-carrier-trends-insights',
  templateUrl: './carrier-trends-insights.component.html',
  styleUrls: ['./carrier-trends-insights.component.scss'],
  standalone: false
})
export class FedexcarriertreandsinsightComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('topScroll', { static: false }) topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll', { static: false }) tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContent', { static: false }) scrollContent!: ElementRef<HTMLDivElement>;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;

  //decalration
  breadCrumbItems!: Array<{}>;
  clientType = signal<any>('');
  isLoading = true;
  randomNumber: any;
  searchActive = true;
  userProfifleData: any;
  userProfifleFedex: any;
  clientProfileList: any;
  clientID: any;
  clientName: any;
  fileStartDate: any;
  fileEndDate: any;
  dataasof: any;
  carrierType: any;
  userProfifleVal: any;
  account_details: any[] = [];
  resultAC: any;
  dataSortField_name: any;
  dataSortField_numeric: any;
  yearAC: any[] = [];
  monthAC: any[] = [];
  weekAC: any[] = [];
  yearMap: any = {};
  monthMap: any = {};
  weekMap: any = {};
  yearArray = signal<string[]>([]);
  dolVal: any;
  displayYear: any;
  previousSelectedYear: any;
  rdbtn_val: any;
  gridColumn: any;
  execSummYear: any;
  myADG: any;
  yearGC: any;
  monthGC: any;
  weekGC: any;
  t006Obj: any;
  countOfActualArr: number = 0;
  colsActual: any[] = [];
  tempWeekIdArr: any[] = [];
  itemNumberHashMap = new Map<string, any>();
  itemHashMap = new Map<string, any>();
  weekArrAll: any[] = [];
  expanded = new Set<string>();
  expandedYears = new Set<string>();
  // expansion state for month panels in Week tab (key = year+monthName)
  expandedWeekMonths = new Set<string>();
  openModalConfig: any;
  panelClass: any;
  headerTextArr: any = [];
  execSummDataArr: any = [];
  clientIdFedex: any;
  resultObj: any
  t301Obj: any;
  methodcall = false;
  showColumnPicker = false;
  // Search logic state
  selectedYear = signal<string>('');
  months = signal<Month[]>([]);
  selectedYearCheckboxes = new Set<string>();
  // initial search tab should be "month" so the UI doesn't jump to the
  selectedTab = signal<string>('month');


  // derive a numeric index that the <mat-tab-group> can consume. by
  // making this computed it will automatically update whenever
  // `selectedTab()` changes, which keeps Angular's change detection happy.
  selectedTabIndex = computed(() => {
    const map: Record<string, number> = { year: 0, month: 1, week: 2 };
    return map[this.selectedTab()] ?? 0;
  });


  myADG_dataProvider: any[] = [];
  dataGrid_dataProvider: any[] = [];
  dataGrid_columns: any[] = [];

  yearHashMap: Map<any, any> = new Map();
  execDescMap: Map<any, any> = new Map();
  monthMasterHm: Map<any, any> = new Map();
  monthMasterHm_temp: Map<any, any> = new Map();
  monthHashMap: Map<any, any> = new Map();

  yearHashMapObj: Map<any, any> = new Map();

  dpAC: any[] = [];


  //Form Group
  fedexFormGroup!: FormGroup;
  treeFormGroup!: FormGroup;

  private resizeObserver?: ResizeObserver;
  private isSyncing = false;

  form!: FormGroup;

  // kept from your file
  selectValue = ['Choice 1', 'Choice 2', 'Choice 3'];
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
  constructor(private loaderService: LoaderService,
    private fb: FormBuilder, private offcanvasService: NgbOffcanvas,
    private commonService: CommonService,
    private httpfedexService: HttpfedexService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef) {

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
      children: new FormControl("month")
    })

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

  }

  ngOnInit(): void {
    this.loaderService.show();
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Create Project', active: true }
    ];
    this.openLoading();
    this.getUserFedex();
    if (this.yearArray().length > 0 && !this.selectedYear()) {
      this.selectedYear.set(this.yearArray()[0]);
    }
    this.initializeForm();

    setTimeout(() => {
      this.searchActive = false;
    }, 15000);
  }

  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  async getUserFedex() {
    try {
      // Fetch profile data
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
      this.dataasof = `${strMonthEnd}/${strDateEnd}/${strYearEnd}`;

      // Patch profile directly
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

      // Fetch account details
      await this.fetchaccountDetails();

      // Determine display year
      const today = new Date();
      const displayYear =
        today.getMonth() === 0 || (today.getMonth() === 1 && today.getDate() <= 5)
          ? (today.getFullYear() - 1).toString()
          : today.getFullYear().toString();

      // Patch additional values
      this.fedexFormGroup.get('year')?.setValue(displayYear);
      this.fedexFormGroup.get('primaryAccountNumber')?.setValue(clientID);
      this.fedexFormGroup.get('clientId')?.setValue(clientID);
      this.fedexFormGroup.get('clientName')?.setValue(clientName);

      // Fetch executive summary details
      await this.fetchExecutiveSummaryDetails();
    } catch (error) {
      this.closeLoading();
      console.error("Error in getUserFedex:", error);
    }
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
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

      const accountNo = result[0]?.accountNo;
      console.log("First account number:", accountNo);

    } catch (error) {
      console.error("Error fetching FedEx account details", error);
    }
  }

  async fetchExecutiveSummaryDetails() {
    try {
      const result: any = await firstValueFrom(
        this.httpfedexService.fetchExecutiveSummaryDetails(this.fedexFormGroup.value)
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

      this.fetchExecutiveSummaryDetailsResult(result);
    } catch (error) {
      this.closeLoading();
      console.error("Error fetching FedEx executive summary details", error);
    }
  }


  async fetchExecutiveSummaryDetailsResult(resultAC: any[]) {
    try {
      this.closeLoading();
      this.resultAC = resultAC;

      if (!resultAC || resultAC.length === 0) {
        this.openModal("No Record found for selected Client!");
      }

      // Sequential async calls
      await this.clearAlldataFedex();

      await this.formYearMapFromResultFedex();   // Build year map
      let yearVal = String(this.fedexFormGroup.get('year')?.value);
      if (!this.yearHashMap.has(yearVal)) {
        const availableYears = Array.from(this.yearHashMap.keys()).map(String);
        if (availableYears.length > 0) {
          yearVal = availableYears[0];
          this.fedexFormGroup.get('year')?.setValue(yearVal);
          this.selectedYear.set(yearVal);
          this.displayYear = yearVal;
        }
      }
      await this.getYearACFedex();               // Build year array collection
      await this.getMonthACFedex();              // Build month array collection
      await this.getWeekACFedex();               // Build week array collection

      yearVal = this.fedexFormGroup.get('year')?.value;
      this.refreshMonthList(yearVal);
      if (this.methodcall) {
        this.syncSelectionsAndRefresh();
        this.methodcall = false;
      } else {
        await this.rdType_itemClickHandlerFedex(); // Handle rdType click
      }
    } catch (error) {
      console.error("Error in fetchExecutiveSummaryDetailsResult:", error);
    }
    this.cd.detectChanges();
  }

  async clearAlldataFedex(): Promise<void> {
    this.myADG_dataProvider = [];
    this.dataGrid_dataProvider = [];
    this.dataGrid_columns = [];
    this.yearHashMap = new Map();
    this.execDescMap = new Map();
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

  async formYearMapFromResultFedex(): Promise<void> {
    for (var loop = 0; loop < this.resultAC.length; loop++) {
      var t006Obj = this.resultAC[loop];
      const yearKey = String(t006Obj.year);
      var valueMap = new Map;
      if (this.yearHashMap.has(yearKey)) {
        valueMap = this.yearHashMap.get(yearKey);
      }
      else {
        valueMap = new Map();
      }
      valueMap.set(t006Obj.descriptionGroup, t006Obj);
      //reset the value map to the year map 
      await this.yearHashMap.set(yearKey, valueMap);
      // this map will form the Description of Executive Summary 
      await this.execDescMap.set(t006Obj.descriptionGroup, t006Obj.sortOrder);
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

  async getYearACFedex(): Promise<void> {
    this.yearArray.set([]);
    this.yearAC = [];
    const displayYear = this.fedexFormGroup.get('year')?.value;

    const years: string[] = Array.from(this.yearHashMap.keys()).map(String).sort();
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

  async getMonthACFedex(): Promise<void> {
    const keyAC: any[] = [];
    let monthCount = 0;

    for (const [key, value] of this.yearHashMap) {
      const year_key = key;
      this.displayYear = this.fedexFormGroup.get('year')?.value;

      for (const [monthKey, monthValue] of this.monthMasterHm) {
        monthCount = monthCount + 1;
        const dataval = this.monthMasterHm.get(monthKey);
        // Check if this month belongs to the displayed year - all months should be checked by default for the displayed year
        if (year_key.toString() === this.displayYear) {
          this.monthAC.push({
            Year: year_key, Month: dataval, Week: "", state: "checked", sortOrder: monthKey, sortMonth: monthCount
          });
        } else {
          this.monthAC.push({
            Year: year_key, Month: dataval, Week: "", state: "unchecked", sortOrder: monthKey, sortMonth: monthCount
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

    // derive which year should have its weeks pre‑checked.  the old
    // implementation computed this based on the *current date*; instead we
    // prefer the selected year so that changing the dropdown keeps the
    // weeks in sync.
    const targetYear = this.fedexFormGroup.get('year')?.value ||
      // fallback to whatever was previously populated (usually the current
      // year as assigned in getUser).
      this.displayYear;

    const yearData = Number(targetYear) + 1;
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
            const isChecked = year.toString() === targetYear;
            this.weekAC.push({ Year: year, Month: month, Week: (month + 1) + "/" + firstDate + "/" + year_val, state: isChecked ? "checked" : "unchecked", sortOrder: weekCount });
            weekACtemp.push(weekCount++);
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
    try {
      this.previousSelectedYear = this.displayYear;
      const displayYear = this.fedexFormGroup.get('year')?.value;
      this.rdbtn_val = this.fedexFormGroup.get('searchcriteriabtn')?.value;

      if (this.rdbtn_val === "year") {
        this.gridColumn = "Year";
        this.execSummYear = "2017";

        if (this.yearAC?.length) {
          this.yearAC.forEach(obj => (obj["state"] = "checked"));
        }

        await this.formDataGridYearDataFedex(this.yearHashMap);
        await this.formGridColumnFedex(this.yearHashMap, null, null);
        this.myADG = this.yearGC;
      }

      if (this.rdbtn_val === "month") {
        this.gridColumn = "Month";

        await this.formMonthMapFromResultFedex(displayYear);
        await this.formDataGridMonthDataFedex(this.monthHashMap);

        this.monthGC = this.monthAC;

        Array.from({ length: 12 }, (_, i) => {
          const monthLabel = `${this.monthMasterHm.get(i)} ${this.displayYear}`;
          this.monthMasterHm_temp.set(i.toString(), monthLabel);
        });

        await this.formGridColumnFedex(this.monthHashMap, null, this.monthMasterHm_temp);
      }

      if (this.rdbtn_val === "week") {
        this.gridColumn = "Week";
        const weekItemAC: any = [];

        this.weekAC.forEach(obj => {
          if (obj.Year === Number(this.displayYear)) {
            if (obj.state === "checked") {
              if (!this.previousSelectedYear) {
                this.previousSelectedYear = obj.Year;
              }

              if (this.previousSelectedYear !== obj.Year.toString()) {
                this.openModal("Cannot select Week from Different Years, Please unselect Previous Selected Year and Try again!");
              }

              this.itemHashMap.set(obj.Week, "");
            }

            weekItemAC.push(obj.Week);
          }
        });

        const arr: any[] = [];
        this.formGridColumnFedex(weekItemAC, weekItemAC, null);
        this.formDataGridWeekDataFedex(this.displayYear, arr);

        this.myADG = this.weekGC;
      }
    } catch (error) {
      console.error("Error in rdType_itemClickHandlerFedex:", error);
    }
  }


  async settingCurrentStatechecked(uncheckList: any, year: any): Promise<any> {
    for (let loop = 0; loop < uncheckList.size; loop++) {
      const obj = uncheckList[loop];
      if (obj.Year == year) {
        obj['state'] = "checked";
      } else {
        obj['state'] = "unchecked";
      }
      uncheckList.push(obj, loop);
    }
    return uncheckList;
  }

  async formDataGridYearDataFedex(inputyearHashMap: Map<string, any>) {
    this.dpAC = [];

    // Collect service descriptions
    const arrayLoop = Array.from(this.execDescMap.keys()).map(key => ({ key }));

    // Totals
    let totalShipmentsPackage = 0;
    let totalnetspend = 0;
    let totalgrossSpend = 0;
    let totalIncentiveamt = 0;
    let CommercialManifestedCount = 0;
    let ResidentialAdjustments = 0;
    let DimensionalSCCCharges = 0;
    let DimensionalChargesnoofSCCChrge = 0;
    let FreightOnlyNetSpend = 0;
    let FreightGrossSpend = 0;
    let FreightIncentiveAmount = 0;
    let AccessorialsFuelIncluded = 0;
    let AccessorialsFuelExcluded = 0;
    let ResidentialManifestedCount = 0;
    let CommercialAdjustment = 0;

    for (const { key: serviceDesc } of arrayLoop) {
      const execObj: any = { servicedesc: serviceDesc };

      const yearArr = Array.from(inputyearHashMap.keys());

      for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
        const yearVal = String(yearArr[valueCount]);
        const valueMap = this.yearHashMap.get(yearVal);

        if (!valueMap?.get(serviceDesc)) continue;

        this.t301Obj = valueMap.get(serviceDesc);
        let value = await this.summingthevaluesFedex(this.t301Obj, serviceDesc);

        // Totals by descriptionGroup
        switch (this.t301Obj.descriptionGroup) {
          case "Number of Packages":
          case "Package Count":
            value = Number(this.t301Obj.gdyear);
            totalShipmentsPackage += value;
            execObj.total = this.setCommaQty(String(totalShipmentsPackage));
            break;

          case "Net Spend":
            value = Number(this.t301Obj.gdyear);
            totalnetspend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPrice(String(totalnetspend)));
            break;

          case "Gross Spend":
            value = Number(this.t301Obj.gdyear);
            totalgrossSpend += value;
            execObj.total = this.setCommaQty(this.set2dpforPrice(String(totalgrossSpend)));
            break;

          case "Incentive Amount":
            value = Number(this.t301Obj.gdyear);
            totalIncentiveamt += value;
            execObj.total = this.setCommaQty(this.set2dpforPrice(String(totalIncentiveamt)));
            break;

          case "Commercial Package Count":
            value = Number(this.t301Obj.gdyear);
            CommercialManifestedCount += value;
            execObj.total = this.setCommaQty(String(CommercialManifestedCount));
            break;

          case "Commercial Adjustments Count":
            value = Number(this.t301Obj.gdyear);
            CommercialAdjustment += value;
            execObj.total = this.setCommaQty(String(CommercialAdjustment));
            break;

          case "Residential Package Count":
            value = Number(this.t301Obj.gdyear);
            ResidentialManifestedCount += value;
            execObj.total = this.setCommaQty(String(ResidentialManifestedCount));
            break;

          case "Residential Adjustments Count":
            value = Number(this.t301Obj.gdyear);
            ResidentialAdjustments += value;
            execObj.total = this.setCommaQty(String(ResidentialAdjustments));
            break;

          case "Accessorials (Fuel Included)":
            value = Number(this.t301Obj.gdyear);
            AccessorialsFuelIncluded += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPrice(String(AccessorialsFuelIncluded)));
            break;

          case "Accessorials (Fuel Excluded)":
            value = Number(this.t301Obj.gdyear);
            AccessorialsFuelExcluded += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPrice(String(AccessorialsFuelExcluded)));
            break;

          case "Freight Incentive Amount":
            value = Number(this.t301Obj.gdyear);
            FreightIncentiveAmount += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightIncentiveAmount)));
            break;

          case "Freight Gross Spend":
            value = Number(this.t301Obj.gdyear);
            FreightGrossSpend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightGrossSpend)));
            break;

          case "Freight Net Spend":
            value = Number(this.t301Obj.gdyear);
            FreightOnlyNetSpend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightOnlyNetSpend)));
            break;
        }

        // Value formatting by serviceDesc
        if (
          [
            "Effective Discount",
            "Accessorials (Fuel Included) %",
            "Commercial Package %",
            "Residential Package %",
            "Accessorials (Fuel Excluded) %",
            "Freight Effective Discount",
            "Ground Package %",
            "Air Package %",
            "Domestic Package %",
            "International Package %"
          ].includes(serviceDesc)
        ) {
          execObj[`value${valueCount}`] = this.setCommaQty(
            this.set2dpforPercentage(String(this.t301Obj.gdyear)) + " %"
          );
        } else if (
          [
            "Average Zone",
            "Average Weight Per Package (Lbs)",
            "Average Weight Per Package (Kgs)",
            "Total Weight (lbs)",
            "Total Weight (Kgs)"
          ].includes(serviceDesc)
        ) {
          execObj[`value${valueCount}`] = this.setCommaQty(
            this.set2dpforMass(String(this.t301Obj.gdyear))
          );
        } else if (
          [
            "Number of Packages",
            "Commercial Package Count",
            "Dimensional Charges, # of Charge",
            "Residential Package Count",
            "Commercial Adjustments Count",
            "Residential Adjustments Count",
            "Package Count"
          ].includes(serviceDesc)
        ) {
          execObj[`value${valueCount}`] = this.setCommaQty(
            this.set2dpforWeekVal(String(this.t301Obj.gdyear))
          );
        } else {
          execObj[`value${valueCount}`] = "$" + this.setCommaQty(
            this.set2dpforPrice(String(this.t301Obj.gdyear))
          );
        }
      }

      this.dpAC.push(execObj);
    }
  }

  async formGridColumnFedex(inputColumnArray: Map<any, any>, allColumnArray: any, masterMap: Map<string, string> | null) {
    let cols: any[] = [];

    // First column: Key Metric
    cols.push({
      headerText: "Key Metric",
      dataField: "servicedesc",
      width: 235
    });

    // Add TOTAL column depending on rdbtn_val
    if (this.rdbtn_val !== "week") {
      cols.push({ headerText: "TOTAL", dataField: "total" });
    } else {
      const visibleBoolean = inputColumnArray.size > 0;
      if (visibleBoolean) {
        cols.push({ headerText: "TOTAL", dataField: "total" });
      }
    }

    // Week case
    if (this.rdbtn_val === "week") {
      for (let ploop = 0; ploop < this.tempWeekIdArr.length; ploop++) {
        const weekObj = this.tempWeekIdArr[ploop];
        if (weekObj.weekindex != null) {
          cols.push({
            headerText: weekObj.week,
            dataField: `value${ploop}`
          });
        }
      }
    } else {
      // Year/Month case
      const yearArr = Array.from(inputColumnArray.keys());

      for (let loop = 0; loop < inputColumnArray.size; loop++) {
        const arrVal = String(yearArr[loop]);

        cols.push({
          headerText: masterMap ? masterMap.get(String(loop)) : arrVal,
          dataField: `value${loop}`
        });
      }
    }

    this.dataGrid_columns = cols;
    this.cd.detectChanges();
  }

  async formMonthMapFromResultFedex(selectedYear: number) {
    const execSummYear = selectedYear.toString();
    let totalShipmentsPackage = 0;
    let totalnetspend = 0;

    const monthHm = this.yearHashMapObj.get(selectedYear.toString());

    for (const testObj of this.resultAC) {
      if (testObj.year !== selectedYear) continue;

      const valueArrayObj = this.formvalueArrayFedex(testObj);

      for (let monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        const monthValue = String(monthLoop);
        const monthSaturdayAC = monthHm.get(monthValue);

        let valueForMonth = 0;

        // Map month index to property name
        const monthProps = [
          "jan", "feb", "mar", "apr", "may", "jun",
          "jul", "aug", "sep", "oct", "nov", "dec"
        ];

        if (
          [
            "Accessorials (Fuel Excluded)",
            "Accessorials (Fuel Excluded) %",
            "Accessorials (Fuel Included)",
            "Accessorials (Fuel Included) %",
            "Average Cost/Package lbs",
            "Average Cost/Package kgs",
            "Average Cost Per (Lbs)",
            "Average Cost Per (Kgs)",
            "Average Weight Per Package (Lbs)",
            "Average Weight Per Package (Kgs)",
            "Average Cost Per Package",
            "Average Zone",
            "Commercial Package Count",
            "Commercial Adjustments Count",
            "Commercial Package %",
            "Dimensional -Charges",
            "Dimensional Charges, # of Charge",
            "Effective Discount",
            "Freight Effective Discount",
            "Freight Gross Spend",
            "Freight Incentive Amount",
            "Freight Net Spend",
            "Gross Spend",
            "Incentive Amount",
            "Net Spend",
            "Residential Package Count",
            "Residential Package %",
            "Residential Adjustments Count",
            "Number of Packages",
            "Package Count",
            "Total Weight (lbs)",
            "Total Weight (Kgs)",
            "Ground Package %",
            "Air Package %",
            "Domestic Package %",
            "International Package %"
          ].includes(testObj.descriptionGroup)
        ) {
          const monthProp = monthProps[monthLoop];
          valueForMonth = Number(testObj[monthProp]);
        }

        // Update monthHashMap
        let valueMap = this.monthHashMap.get(monthValue) ?? new Map();
        valueMap.delete(testObj.descriptionGroup);
        valueMap.set(testObj.descriptionGroup, valueForMonth);

        this.monthHashMap.set(monthValue, valueMap);
      }
    }
  }

  formvalueArrayFedex(testObj: any): number[] {
    const valueArray: number[] = [];

    for (let i = 1; i <= 53; i++) {
      valueArray.push(testObj[`w${i}`]);
    }

    return valueArray;
  }

  async formDataGridMonthDataFedex(inputMonthHm: Map<string, any>) {
    this.dpAC = [];

    const arrayLoop = Array.from(this.execDescMap.keys()).map(key => ({ key }));

    // Totals
    let totalShipmentsPackage = 0;
    let totalnetspend = 0;
    let totalgrossSpend = 0;
    let totalIncentiveamt = 0;
    let CommercialManifestedCount = 0;
    let ResidentialAdjustments = 0;
    let DimensionalSCCCharges = 0;
    let DimensionalChargesnoofSCCChrge = 0;
    let FreightOnlyNetSpend = 0;
    let FreightGrossSpend = 0;
    let FreightIncentiveAmount = 0;
    let AccessorialsFuelIncluded = 0;
    let AccessorialsFuelExcluded = 0;
    let ResidentialManifestedCount = 0;
    let CommercialAdjustment = 0;

    for (const { key: serviceDesc } of arrayLoop) {
      const execObj: any = { servicedesc: serviceDesc, sortOrder: this.execDescMap.get(serviceDesc) };

      const monthArr = Array.from(inputMonthHm.keys());

      for (let valueCount = 0; valueCount < monthArr.length; valueCount++) {
        const monthVal = String(monthArr[valueCount]);
        const valueMap = this.monthHashMap.get(monthVal);

        if (!valueMap) continue;
        const value = valueMap.get(serviceDesc);
        if (value == null) continue;

        // Formatting by serviceDesc
        if (
          [
            "Effective Discount",
            "Accessorials (Fuel Included) %",
            "Commercial Package %",
            "Residential Package %",
            "Accessorials (Fuel Excluded) %",
            "Freight Effective Discount",
            "Ground Package %",
            "Air Package %",
            "Domestic Package %",
            "International Package %"
          ].includes(serviceDesc)
        ) {
          execObj[`value${valueCount}`] = this.setCommaQty(this.set2dpforPercentage(String(value)) + " %");
        } else if (
          [
            "Average Zone",
            "Average Weight Per Package (Lbs)",
            "Average Weight Per Package (Kgs)",
            "Total Weight (lbs)",
            "Total Weight (Kgs)"
          ].includes(serviceDesc)
        ) {
          execObj[`value${valueCount}`] = this.setCommaQty(this.set2dpforMass(String(value)));
        } else if (
          [
            "Number of Packages",
            "Commercial Package Count",
            "Dimensional Charges, # of Charge",
            "Residential Package Count",
            "Commercial Adjustments Count",
            "Residential Adjustments Count",
            "Package Count"
          ].includes(serviceDesc)
        ) {
          execObj[`value${valueCount}`] = this.setCommaQty(String(value));

          // Totals
          if (["Number of Packages", "Package Count"].includes(serviceDesc)) {
            totalShipmentsPackage += value;
            execObj.total = this.setCommaQty(String(totalShipmentsPackage));
          }
          if (serviceDesc === "Commercial Package Count") {
            CommercialManifestedCount += value;
            execObj.total = this.setCommaQty(String(CommercialManifestedCount));
          }
          if (serviceDesc === "Residential Package Count") {
            ResidentialManifestedCount += value;
            execObj.total = this.setCommaQty(String(ResidentialManifestedCount));
          }
          if (serviceDesc === "Commercial Adjustments Count") {
            CommercialAdjustment += value;
            execObj.total = this.setCommaQty(String(CommercialAdjustment));
          }
          if (serviceDesc === "Residential Adjustments Count") {
            ResidentialAdjustments += value;
            execObj.total = this.setCommaQty(String(ResidentialAdjustments));
          }
        } else {
          execObj[`value${valueCount}`] = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(value)));

          // Totals
          if (serviceDesc === "Net Spend") {
            totalnetspend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(totalnetspend)));
          }
          if (serviceDesc === "Gross Spend") {
            totalgrossSpend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(totalgrossSpend)));
          }
          if (serviceDesc === "Incentive Amount") {
            totalIncentiveamt += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(totalIncentiveamt)));
          }
          if (serviceDesc === "Accessorials (Fuel Included)") {
            AccessorialsFuelIncluded += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(AccessorialsFuelIncluded)));
          }
          if (serviceDesc === "Accessorials (Fuel Excluded)") {
            AccessorialsFuelExcluded += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(AccessorialsFuelExcluded)));
          }
          if (serviceDesc === "Freight Incentive Amount") {
            FreightIncentiveAmount += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(FreightIncentiveAmount)));
          }
          if (serviceDesc === "Freight Gross Spend") {
            FreightGrossSpend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(FreightGrossSpend)));
          }
          if (serviceDesc === "Freight Net Spend") {
            FreightOnlyNetSpend += value;
            execObj.total = "$" + this.setCommaQty(this.set2dpforPriceFedex(String(FreightOnlyNetSpend)));
          }
        }
      }

      this.dpAC.push(execObj);
    }
  }

  set2dpforPriceFedex(value_price: string | null): string {
    if (!value_price || value_price === "." || value_price === "" || value_price === "null" || value_price === "0") {
      return "0.00";
    }

    return parseFloat(value_price).toFixed(2);
  }

  formDataGridWeekDataFedex(selectedYear: any, selectitem: any) {
    this.execSummYear = selectedYear;
    this.dpAC = [];

    var serviceDescAC: any = [];
    serviceDescAC = this.execDescMap.keys();
    var arrayLoop = [];
    for (let [key, value] of this.execDescMap) {
      arrayLoop.push({ key })
      /*
      
      */
    }
    var totalShipmentsPackage = 0;
    for (var loop = 0; loop < this.execDescMap.size; loop++) {
      var execObj: any = {};
      var serviceDescVal = arrayLoop[loop];
      var serviceDesc = serviceDescVal.key;
      execObj["servicedesc"] = serviceDesc;
      execObj["sortOrder"] = this.execDescMap.get(serviceDesc);
      const yearKey = String(selectedYear);
      var valueMap = this.yearHashMap.get(yearKey);

      if (valueMap?.get(serviceDesc) != null) {
        if (serviceDesc == "Effective Discount" || serviceDesc == "Accessorials (Fuel Included) %" || serviceDesc == "Commercial Package %"
          || serviceDesc == "Residential Package %" || serviceDesc == "Accessorials (Fuel Excluded) %" || serviceDesc == "Freight Effective Discount"
          || serviceDesc == "Ground Package %" || serviceDesc == "Air Package %" || serviceDesc == "Domestic Package %" || serviceDesc == "International Package %") {
          for (let i = 0; i < this.tempWeekIdArr.length; i++) {
            const weekObj = this.tempWeekIdArr[i];
            if (weekObj.weekindex != null) {
              const weekVal = (valueMap.get(serviceDesc))[`wk${i + 1}`];
              execObj[`value${i}`] = this.setCommaQty(
                this.set2dpforPercentage(String(weekVal))
              ) + " %";
            }
          }

        }
        else if (serviceDesc == "Average Zone" || serviceDesc == "Average Weight Per Package (Lbs)" || serviceDesc == "Average Weight Per Package (Kgs)"
          || serviceDesc == "Total Weight (lbs)" || serviceDesc == "Total Weight (Kgs)")//9126
        {
          for (let i = 0; i < this.tempWeekIdArr.length; i++) {
            const weekObj = this.tempWeekIdArr[i];
            if (weekObj.weekindex != null) {
              const weekVal = (valueMap.get(serviceDesc))[`wk${i + 1}`];
              execObj[`value${i}`] = this.setCommaQty(this.set2dpforMass(String(weekVal)));
            }
          }
        }
        else if (serviceDesc == "Number of Packages" || serviceDesc == "Commercial Package Count" || serviceDesc == "Dimensional Charges, # of Charge"
          || serviceDesc == "Residential Package Count" || serviceDesc == "Commercial Adjustments Count" || serviceDesc == "Residential Adjustments Count"
          || serviceDesc == "Package Count") {

          for (let i = 0; i < this.tempWeekIdArr.length; i++) {
            const weekObj = this.tempWeekIdArr[i];
            if (weekObj.weekindex != null) {
              const weekVal = (valueMap.get(serviceDesc))[`wk${i + 1}`];
              execObj[`value${i}`] = this.setCommaQty(this.set2dpforWeekVal(String(weekVal)));
            }
          }

        }
        else {
          for (let i = 0; i < this.tempWeekIdArr.length; i++) {
            const weekObj = this.tempWeekIdArr[i];
            if (weekObj.weekindex != null) {
              const weekVal = (valueMap.get(serviceDesc))[`wk${i + 1}`];
              execObj[`value${i}`] = "$" + this.setCommaQty(this.set2dpforPrice(String(weekVal)));
            }
          }
        }
      }
      if (serviceDesc == "Number of Packages" || serviceDesc == "Commercial Package Count" || serviceDesc == "Shipping Charge Corrections - Package Count"
        || serviceDesc == "Residential Package Count" || serviceDesc == "Commercial Adjustments Count" || serviceDesc == "Residential Adjustments Count"
        || serviceDesc == "Package Count") {
        var str: String;
        totalShipmentsPackage = 0;
        if (selectitem.length == 0) {
          for (let i = 0; i <= 52; i++) {
            totalShipmentsPackage += Number(
              this.removeCommasonly(execObj[`value${i}`])
            );
          }
          execObj["total"] = this.setCommaQty(String(totalShipmentsPackage));
        }
        else {
          for (var cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) { //9126 FedEx
            if (this.tempWeekIdArr[cnt].weekindex != null) {
              totalShipmentsPackage = totalShipmentsPackage + Number(this.removeCommasonly(execObj["value" + cnt]));
            }
          }

          execObj["total"] = this.setCommaQty(String(totalShipmentsPackage));
        }


      }

      else if (serviceDesc == "Net Spend" || serviceDesc == "Gross Spend" || serviceDesc == "Incentive Amount"
        || serviceDesc == "Shipping Charge Corrections - Net Spend" || serviceDesc == "Freight Net Spend" || serviceDesc == "Freight Gross Spend"
        || serviceDesc == "Freight Incentive Amount" || serviceDesc == "Accessorials (Fuel Included)" || serviceDesc == "Accessorials (Fuel Excluded)") {


        totalShipmentsPackage = 0;
        if (selectitem.length == 0) {
          for (let i = 0; i <= 52; i++) {
            totalShipmentsPackage += Number(
              this.removeCommas(execObj[`value${i}`])
            );
          }
          execObj["total"] = this.setCommaQty(this.set2dpforPrice(String(totalShipmentsPackage)));
        }
        else {

          for (var cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) { //9126 fedex
            if (this.tempWeekIdArr[cnt].weekindex != null) {
              totalShipmentsPackage = totalShipmentsPackage + Number(this.removeCommas(execObj["value" + cnt]));
            }
          }

          execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalShipmentsPackage)));
        }
      }


      this.dpAC.push(execObj);
    }

  }

  set2dpforWeekVal(value_price: any): any {
    if (value_price == "0" || value_price == null || value_price == "." || value_price == "" ||
      value_price == "null" || value_price == "0.00" || value_price == 0.00) {
      return "0";
    }

    return Number(value_price);
  }

  removeCommas(str: any): any {
    if (str != null) {
      str = str.replace(/[$,]/g, "");
    }
    return str;
  }

  removeCommasonly(str: any): any {
    if (str != null)
      str = (str.replace(/[,]/g, ""));
    return str;
  }

  formvalueArray(testObj: any): any[] {
    const valueArray: any[] = [];
    for (let i = 1; i <= 53; i++) {
      valueArray.push(testObj[`w${i}`]);
    }
    return valueArray;
  }

  setCommaQty(eve: any): string {
    return eve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  set2dpforMass(value_price: any): string {
    let value: string;
    if (value_price == "0" || value_price == null || value_price == "." || value_price == "" || value_price == "null") {
      value = "0";
    } else {
      value = parseFloat(value_price).toFixed(2);
    }
    return value;
  }

  set2dpforPercentage(value_price: any): string {
    let value = parseFloat(value_price).toFixed(2);

    if (value_price == null || value_price == "." || value_price == "" || value_price == "null" || value_price == "0.00") {
      value = "0";
    } else if (value_price == 0.00) {
      value = "0";
    }
    return value;
  }

  set2dpforPrice(value_price: any): string {
    let value: string;
    if (value_price == null || value_price == "." || value_price == "" || value_price == "null") {
      value = "0.00";
    } else if (value_price == "0") {
      value = "0.00";
    } else {
      value = parseFloat(value_price).toFixed(2);
    }
    return value;
  }

  async summingthevaluesFedex(t301Obj: any, serviceDesc: string) {
    if (!t301Obj) return;

    let value = 0;
    let divideBy = 0;

    const validServiceDescs = [
      "Effective Discount",
      "Accessorials (Fuel Included) %",
      "Accessorials (Fuel Excluded) %",
      "Average Cost Per Package",
      "Average Weight Per Package",
      "Average Cost Per lb",
      "Average Zone",
      "Commercial Package %",
      "Residential Package %",
      "Freight Effective Discount",
      "Ground Package %",
      "Air Package %",
      "Domestic Package %",
      "International Package %"
    ];

    if (validServiceDescs.includes(serviceDesc)) {
      for (let i = 1; i <= 53; i++) {
        const wkVal = Number(t301Obj[`wk${i}`]);
        if (wkVal !== 0) {
          divideBy++;
          value += wkVal;
        }
      }

      if (divideBy !== 0) {
        value = value / divideBy;
      }
    }

    return value;
  }



  async account_clickHandler() {
    var primaryAccountNumber = this.fedexFormGroup.get('primaryAccountNumber')?.value;

    if (primaryAccountNumber == "null") {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(this.clientIdFedex);
    } else {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(primaryAccountNumber);
    }
    this.methodcall = true;
    await this.fetchExecutiveSummaryDetails();
  }

  async checkTree() {
    var nodeVal = await this.treeFormGroup.get('children')?.value;
    await this.fedexFormGroup.get('searchcriteriabtn')?.setValue(nodeVal);
    this.syncSelectionsAndRefresh();
  }

  generateExcel() {
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
    this.execSummDataArr = [];
    this.headerTextArr = [];
    var execSummData = [];
    for (var loop1 = 0; loop1 < this.dpAC.length; loop1++) {
      execSummData = [];
      for (var loop2 = 0; loop2 < this.dataGrid_columns.length; loop2++) {
        if (this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']] == undefined) {
          this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']] = '';
        }
        if (this.clientType() == "FedEx") {
          if (loop2 == 0) {
            execSummData.push(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']]);
          }
          else if (loop2 == 1) {
            if (loop1 == 2 || loop1 == 3 || loop1 == 4 || loop1 == 5 || loop1 == 6 || loop1 == 7 || loop1 == 8 || loop1 == 9 || loop1 == 10 || loop1 == 11 || loop1 == 12 || loop1 == 13 || loop1 == 14 || loop1 == 15 || loop1 == 21 || loop1 == 24 || loop1 == 24) {
              execSummData.push(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']]);
            }
            else {
              execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')));
            }
          }
          else {
            if (loop1 == 5 || loop1 == 6 || loop1 == 7 || loop1 == 8 || loop1 == 14 || loop1 == 15 || loop1 == 21 || loop1 == 24 || loop1 == 25) {
              execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')) / 100);
            }
            else {
              execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')));
            }
          }
        }
        else {
          execSummData.push(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']]);
        }
      }
      this.execSummDataArr.push(execSummData);
    }
    for (let loop = 0; loop < this.dataGrid_columns.length; loop++) {
      this.headerTextArr.push(this.dataGrid_columns[loop]['headerText'])
    }

    var year = this.fedexFormGroup.get('year')?.value;
    var fileName = this.clientName + "_Carrier_Trends_Insights_Report_" + year + ".xlsx";
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Carrier Trends & Insights');


    //Add Header Row
    let headerRow = worksheet.addRow(this.headerTextArr);
    headerRow.font = { family: 4, size: 12, color: { argb: 'F9F9F9' } };


    headerRow.eachCell((cell, number) => {
      if (number == 1 || number == 2) {
        cell.font = { family: 4, size: 12, color: { argb: 'F9F9F9' }, bold: true }
      }

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',

        fgColor: { argb: '4F81BD' },
        bgColor: { argb: '4F81BD' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

    })

    // Add Data and Conditional Formatting
    var count = 1;
    this.execSummDataArr.forEach((d: any[], index: number) => {
      let row = worksheet.addRow(d);
      if (this.clientType() == "UPS") {
        var rowIndex = index + 2;
        if (index == 0 || index == 1 || index == 2 || index == 5 || index == 7 || index == 19 || index == 20 || index == 21 || index == 22 || index == 26 || index == 27) {
          worksheet.getRow(rowIndex).numFmt = '$#,##0.00';
        }
        else if (index == 4 || index == 15 || index == 16 || index == 17 || index == 18 || index == 32) {
          worksheet.getRow(rowIndex).numFmt = '#,##0';
        }
        else if (index == 3 || index == 8 || index == 9 || index == 10 || index == 11 || index == 13 || index == 14 || index == 23 || index == 24 || index == 25 || index == 33) {
          worksheet.getRow(rowIndex).numFmt = '0.00%';
        }
        else if (index == 6 || index == 12 || index == 28 || index == 29 || index == 30 || index == 31) {
          worksheet.getRow(rowIndex).numFmt = '#,##0.00';
        }
      }

      row.eachCell((cell, number) => {
        if (number == 1 || number == 2) {
          cell.font = { bold: true };
        }


        if (count % 2 == 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',

            fgColor: { argb: 'd0e3ff' }
          }
        }
        else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e6e1e1' }
          }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      // let qty = row.getCell();
      let color = 'd0e3ff';

      count++;
    }
    );
    worksheet.getColumn(1).width = 40;
    worksheet.getColumn(2).width = 12;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 12;
    worksheet.getColumn(8).width = 12;
    worksheet.getColumn(9).width = 12;
    worksheet.getColumn(10).width = 12;
    worksheet.getColumn(11).width = 12;
    worksheet.getColumn(12).width = 12;
    worksheet.getColumn(13).width = 12;
    worksheet.getColumn(14).width = 12;
    // worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }

  async onYearChange(year: string): Promise<void> {
    this.displayYear = year;
    this.selectedYear.set(year);
    this.fedexFormGroup.get('year')?.setValue(year);
    this.previousSelectedYear = null;
    const numericYear = Number(year);
    // Reset ALL months and weeks to unchecked – none are pre-selected by default
    this.monthAC.forEach(m => m.state = 'unchecked');

    this.weekAC.forEach(w => {
      if (w.Year !== numericYear) {
        w.state = 'unchecked';
      }
    });

    // Refresh the month list (without pre-selecting) and auto-expand accordion
    this.refreshMonthList(year);
    this.expandedYears.add(year);
    // also keep the year tab checkboxes in sync
    this.selectedYearCheckboxes.clear();
    this.selectedYearCheckboxes.add(year);

    this.syncSelectionsAndRefresh();
  }

  async onTabChange(event: any): Promise<void> {
    const tabs = ['year', 'month', 'week'];
    const selectedTab = tabs[event.index];

    this.selectedTab.set(selectedTab);
    this.treeFormGroup.get('children')?.setValue(selectedTab);
    this.fedexFormGroup.get('searchcriteriabtn')?.setValue(selectedTab);

    if (selectedTab === 'month' || selectedTab === 'week') {
      if (this.selectedYearCheckboxes.size > 1) {
        const sorted = Array.from(this.selectedYearCheckboxes).sort();
        const latest = sorted[sorted.length - 1];
        this.selectedYearCheckboxes.clear();
        this.selectedYearCheckboxes.add(latest);
        this.selectedYear.set(latest);
        this.fedexFormGroup.get('year')?.setValue(latest);

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

  async selectedChange(event: any[]) {
    this.myADG_itemClickHandlerFedex(event);
  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  async myADG_itemClickHandlerFedex(event: string[]) {
    if (!event) return;

    const rdbtn_Select = this.treeFormGroup.get('children')?.value;
    const yeardata = this.fedexFormGroup.get('year')?.value || null;

    if (rdbtn_Select === "year") {
      this.rdbtn_val = 'year';
      this.yearAC = [];
      for (const [key, value] of this.yearHashMap) {
        for (let loopval = 0; loopval < event.length; loopval++) {
          const eventValue = event[loopval];
          if (key === eventValue) {
            this.yearAC.push({ Year: key, Month: "", Week: "", state: "checked", sortOrder: value, key: value });
          }
        }
      }

      this.itemHashMap = new Map();
      this.itemNumberHashMap = new Map();
      if (this.yearAC != null) {
        this.yearAC.forEach(obj => {
          if (obj.state === "checked") {
            this.itemHashMap.set(obj.Year, "");
            this.itemNumberHashMap.set(obj.sortOrder, "");
          }
        });
      }

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
        //if (this.weekAC.length === 52 || this.weekAC.length === 53) {
        this.weekArrAll = this.weekAC.map((w, index) => ({ Week: w.Week, WeeekIndex: index, state: w.state }));
        // }

        const weeksForYear = this.weekAC.filter(w => String(w.Year) === String(yeardata));
        this.tempWeekIdArr = weeksForYear.map((w, i) => ({
          weekindex: w.state === 'checked' ? i : null,
          week: w.Week,
          weekstate: w.state
        }));

        // this.tempWeekIdArr = this.weekArrAll.map((w, i) => ({
        //   weekindex: tempWeekAcValArr.includes(w.Week) ? i : null,
        //   week: w.Week,
        //   weekstate: this.weekAC.find(wa => wa.Week === w.Week)?.state || "unchecked"
        // }));

        weeksForYear.forEach((obj, i) => {
          if (obj.state === "checked") {
            this.itemHashMap.set(obj.Week, "");
            checkedItemAC.push(i);
          }
          weekItemAC.push(obj.Week);
        })
      }

      if (this.itemHashMap.size > 0) {

        this.formGridColumnFedex(this.itemHashMap, weekItemAC, null);
        this.formDataGridWeekDataFedex(yeardata, checkedItemAC);

      } else {

        const selectCount = this.chechisItemSelected(this.weekAC);

        if (selectCount === 0) {

          this.previousSelectedYear = null;

          this.formGridColumnFedex(this.itemHashMap, weekItemAC, null);
          this.formDataGridWeekDataFedex(yeardata, checkedItemAC);
        }
      }
    }
  }

  chechisItemSelected(checkAC: any[]) {
    var count = 0;
    for (var loop = 0; loop < checkAC.length; loop++) {
      if (checkAC[loop].state == "checked")
        count = 1;
    }

    return count;
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

  ngAfterViewInit(): void {
    this.updateTopScrollWidth();
    // Keep top scrollbar width in sync with table width changes
    this.resizeObserver = new ResizeObserver(() => this.updateTopScrollWidth());
    this.resizeObserver.observe(this.tableScroll.nativeElement);
    // Also update after a tick (helps when fonts/layout settle)
    setTimeout(() => this.updateTopScrollWidth(), 0);
    this.cd.detectChanges();
  }


  initializeForm() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.dolVal = "excelconvert";
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  //  UI logic

  /**
   * populate the `months` signal for a given year and, if no months are
   * already selected, choose a sensible default (current calendar month when
   * the year matches today, otherwise the first month in the list).
   */
  private refreshMonthList(year: string): void {
    const data = this.getMonthsDataInternal(year);
    if (data && data.length > 0) {
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


  openEnd(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }


  toggleYearCheckbox(year: string, checked: boolean): void {
    const tab = this.selectedTab();
    if (checked && (tab === 'month' || tab === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        this.openModal("Please select only one year for " + (tab === 'month' ? "Month" : "Week") + " selection."); this.selectedYearCheckboxes.clear();
        // Uncheck all months/weeks of other years
        this.monthAC.forEach(m => m.state = 'unchecked');
        this.weekAC.forEach(w => w.state = 'unchecked');
      }
    }

    if (checked) {
      this.selectedYearCheckboxes.add(year);
      this.selectedYear.set(year);
      this.fedexFormGroup.get('year')?.setValue(year);
      this.fedexFormGroup.get('year')?.setValue(year);
      // Auto-expand the selected year so months are immediately visible
      // Auto-check all months/weeks for the selected year by default
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
          const nextYear = remaining[remaining.length - 1];
          this.selectedYear.set(nextYear);
          this.fedexFormGroup.get('year')?.setValue(nextYear);
        }
      }
    }
    this.syncSelectionsAndRefresh();
  }

  toggleYearExpansion(year: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.expandedYears.has(year)) {
      this.expandedYears.delete(year);
    } else {
      this.expandedYears.add(year);
    }
  }

  isYearExpanded(year: string): boolean {
    return this.expandedYears.has(year);
  }

  getMonthsForYear(year: string): Month[] {
    return this.getMonthsDataInternal(year);
  }

  isYearChecked(year: string): boolean {
    return this.selectedYearCheckboxes.has(year);
  }

  toggleDate(month: Month, date: WeekDate, checked: boolean, year?: string): void {
    if (checked && year && (this.selectedTab() === 'month' || this.selectedTab() === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        this.openModal("Please select only one year for " + this.selectedTab() + " selection. Currently " + Array.from(this.selectedYearCheckboxes).join(', ') + " is selected.");
        return;
      }
      if (this.selectedYearCheckboxes.size === 0) {
        this.toggleYearCheckbox(year, true);
      }
    }

    if (year) {
      const targetWeek = this.weekAC.find(w => w.Year?.toString() === year.toString() && w.Week === date.value);
      if (targetWeek) {
        targetWeek.state = checked ? 'checked' : 'unchecked';
      }
      // Check if all weeks are checked for this month to update month state
      const weeksForMonth = this.weekAC.filter(w => w.Year.toString() === year.toString() && w.Month === month.value);
      const allChecked = weeksForMonth.every(w => w.state === 'checked');
      const targetMonth = this.monthAC.find(m => m.Year.toString() === year.toString() && m.Month === month.name);
      if (targetMonth) {
        targetMonth.state = allChecked ? 'checked' : 'unchecked';
      }
    } else {
      date.selected = checked;
      month.selected = month.dates.every(d => d.selected);
    }
    this.syncSelectionsAndRefresh();
  }


  toggleMonth(month: Month, checked: boolean, year?: string): void {
    if (checked && year && (this.selectedTab() === 'month' || this.selectedTab() === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        this.openModal("Please select only one year for " + this.selectedTab() + " selection. Currently " + Array.from(this.selectedYearCheckboxes).join(', ') + " is selected.");
        return;
      }
      // Automaticaly select this year if none selected
      if (this.selectedYearCheckboxes.size === 0) {
        this.toggleYearCheckbox(year, true);
      }
    }

    if (year) {
      const targetMonth = this.monthAC.find(m => m.Year.toString() === year.toString() && m.Month === month.name);
      if (targetMonth) {
        targetMonth.state = checked ? 'checked' : 'unchecked';
      }

      this.weekAC.forEach(w => {
        if (w.Year?.toString() === year.toString() && w.Month === month.value) {
          w.state = checked ? 'checked' : 'unchecked';
        }
      });
    } else {
      month.selected = checked;
      if (month.dates) {
        month.dates.forEach(d => d.selected = checked);
      }
    }
    this.syncSelectionsAndRefresh();
  }

  // selection logic
  isAllSelected(month: Month): boolean {
    return month.dates && month.dates.length > 0 && month.dates.every(d => d.selected);
  }

  isIndeterminate(month: Month): boolean {
    const selectedCount = month.dates.filter(d => d.selected).length;
    return selectedCount > 0 && selectedCount < month.dates.length;
  }


  private syncSelectionsAndRefresh(): void {
    const selectedTab = this.selectedTab();
    const currentYear = this.selectedYear();
    let selectedIds: string[] = [];
    const activeYear = this.selectedYear();

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
      const selectedMonths = this.monthAC.filter(m => m.state === 'checked' && m.Year?.toString() === activeYear);
      if (selectedMonths.length === 0 && this.selectedYearCheckboxes.has(activeYear)) {
        selectedIds = this.monthAC
          .filter(m => m.Year?.toString() === activeYear)
          .map(m => `${m.Month}/${m.Year}`);
      } else {
        selectedIds = selectedMonths.map(m => `${m.Month}/${m.Year}`);
      }
    } else if (selectedTab === 'week') {
      const weeksForYear = this.weekAC.filter(w => w.Year?.toString() === activeYear);
      const selectedWeeks = weeksForYear.filter(w => w.state === 'checked');

      if (selectedWeeks.length === 0 && this.selectedYearCheckboxes.has(activeYear)) {
        // Default to showing all weeks for the active year
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

    // use the generic handler that already knows how to build the grid
    // from an array of ids; it will respect the active tab and automatically
    // filter years/months/weeks as required.  the previous implementation
    // ignored the selection completely, which is why only February ever
    // showed up.
    this.myADG_itemClickHandlerFedex(selectedIds);
    this.cd.detectChanges();
  }

  isExpanded(id: string): boolean {
    return this.expanded.has(id);
  }

  toggleGroup(id: string): void {
    this.expanded.has(id) ? this.expanded.delete(id) : this.expanded.add(id);
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
  formatGridValue(value: any): string {
    if (
      value === '$0.00' ||
      value === '$-0.00' ||
      value === '0' ||
      value === '-0' ||
      value === '0%' ||
      value === '-0%'
    ) {
      return '-';
    }

    return value;
  }
}