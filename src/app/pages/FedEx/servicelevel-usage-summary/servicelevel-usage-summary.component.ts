import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
  computed,
  effect,
  signal,
  HostListener
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import * as fs from 'file-saver';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { firstValueFrom } from 'rxjs';

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

type GroupKey = 'ground' | 'air' | 'international';

interface GroupRow {
  metric: string;
  values: string[];
}

interface GroupData {
  key: GroupKey;
  title: string;
  rows: GroupRow[];
}

@Component({
  selector: 'app-ups-servicelevel-usage-summary',
  templateUrl: './servicelevel-usage-summary.component.html',
  styleUrls: ['./servicelevel-usage-summary.component.scss'],
  standalone: false
})
export class FedexServicelevelUsageSummaryComponent implements OnInit {

  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @ViewChild('topScroll', { static: false }) topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll', { static: false }) tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('scrollContent', { static: false }) scrollContent!: ElementRef<HTMLDivElement>;

  //decalre variables
  isLoading = false;
  clientType = signal<any>('');
  randomNumber!: number;
  dolVal!: string;
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
  fullResultAc: any;
  resultAC: any[] = [];
  dataSortField_name: string = '';
  dataSortField_numeric: boolean = false;
  myADG_dataProvider: any[] = [];
  dataGrid_dataProvider: any[] = [];
  dataGrid_columns: any[] = [];
  yearHashMap: Map<any, any> = new Map();
  monthMasterHm: Map<any, any> = new Map();
  monthMasterHm_temp: Map<any, any> = new Map();
  monthHashMap: Map<any, any> = new Map();
  monthAC: any[] = [];
  yearHashMapObj: Map<string, any> = new Map();
  itemHashMap: Map<string, any> = new Map();
  dpAC: any[] = [];
  yearHashMapNetSpend = new Map();
  yearHashMapCount = new Map();
  yearHashMapTotalWeight = new Map();
  yearHashMapNetSpendFrtAcc = new Map();
  yearHashMapCountFrtAcc = new Map();
  yearAC: any[] = [];
  weekAC: any[] = [];
  displayYear: any;
  previousSelectedYear: any;
  rdbtn_val: any;
  gridColumn: any;
  costOptYear: any;
  myADG: any;
  yearGC: any;
  monthGC: any;
  weekGC: any;
  t006Obj: any;
  monthHashMapNetSpend = new Map();
  monthHashMapCount = new Map();
  monthHashMapTotalWeight = new Map();
  monthHashMapNetSpendFrtAcc = new Map();
  monthHashMapCountFrtAcc = new Map();
  colsActual: any[] = [];
  tempWeekIdArr: any[] = [];
  countOfActualArr: number = 0;
  serviceLevelDescMap = new Map();
  yearArray = signal<string[]>([]);
  private resizeObserver?: ResizeObserver;
  itemNumberHashMap = new Map<string, any>();
  weekArrAll: any[] = [];
  costOptDataArr: any[] = [];
  headerTextArr: any[] = [];
  openModalConfig: any;
  panelClass: any;
  clientIdFedex: any;
  t301Obj: any;
  methodcall = false;
  showColumnPicker = false;

  // Search logic state
  selectedYear = signal<string>('');
  months = signal<Month[]>([]);
  selectedYearCheckboxes = new Set<string>();
  expandedYears = new Set<string>();
  // expansion state for month panels in Week tab (key = year+monthName)
  expandedWeekMonths = new Set<string>();

  // initial search tab should be "month" so the UI doesn't jump to the
  selectedTab = signal<string>('month');

  // derive a numeric index that the <mat-tab-group> can consume. by
  // making this computed it will automatically update whenever
  // `selectedTab()` changes, which keeps Angular's change detection happy.
  selectedTabIndex = computed(() => {
    const map: Record<string, number> = { year: 0, month: 1, week: 2 };
    return map[this.selectedTab()] ?? 0;
  });

  //Form Group
  fedexFormGroup!: FormGroup;
  treeFormGroup!: FormGroup;
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
  constructor(private cookiesService: CookiesService, private loaderService: LoaderService, private fb: FormBuilder,
    private offcanvasService: NgbOffcanvas,
    private commonService: CommonService, private httpfedexService: HttpfedexService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef) {
    this.cookiesService.carrierType.subscribe((clienttype: any) => {
      if (clienttype) {
        this.clientType.set(clienttype);
      }
      else {
        if (localStorage.getItem('carrierType'))
          this.clientType.set(localStorage.getItem('carrierType'));
      }
    });

    this.fedexFormGroup = new FormGroup({
      year: new FormControl(''),
      searchcriteriabtn: new FormControl('month'),
      clientId: new FormControl(''),
      clientName: new FormControl(''),
      dataLoadedType: new FormControl('Shipment Count'),
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
    this.openLoading();
    this.getUserFedex();
    this.initializeForm();
  }

  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  initializeForm() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.dolVal = "excelconvert";
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
    await this.fedexFormGroup.patchValue({
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

    var DateObj = new Date();
    if (DateObj.getMonth() == 0 || (DateObj.getMonth() == 1 && DateObj.getDate() <= 5)) {
      var displayYear = (DateObj.getFullYear() - 1) + "";
    }
    else {
      var displayYear = (DateObj.getFullYear()) + "";
    }

    await this.fedexFormGroup.get('year')?.setValue(displayYear);
    await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(clientID);
    await this.fedexFormGroup.get('clientId')?.setValue(clientID);
    await this.fedexFormGroup.get('clientName')?.setValue(clientName);
    await this.fetchServiceLevelUsageSummaryFedEx();
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }

  fetchaccountDetails(): void {
    try {
      const result: any = firstValueFrom(
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

  /// UPS Fetch fetchServiceLevelUsageSummaryUPS API ///
  fetchServiceLevelUsageSummaryFedEx(): void {
    this.httpfedexService.fetchServiceLevelUsageSummaryFedEx(this.fedexFormGroup.value)
      .subscribe({
        next: (result) => {
          const accNo = this.fedexFormGroup.get('primaryAccountNumber')?.value;

          if (!accNo || accNo === 'null' || accNo === this.clientID) {
            this.fedexFormGroup.get('primaryAccountNumber')?.setValue('null');
          }

          this.fullResultAc = result;
          this.fetchServiceLevelUsageSummaryFedExResult(result);
        },
        error: (err) => {
          console.error('Service level usage summary fetch failed:', err);
        }
      });
  }

  fetchServiceLevelUsageSummaryFedExResult(resultData: any[]): void {
    this.closeLoading();
    const dataLoadedType = this.fedexFormGroup.get('dataLoadedType')?.value;
    this.resultAC = resultData?.filter(d => d.dataLoadedType === dataLoadedType) ?? [];

    if (!resultData || resultData.length === 0) {
      this.openModal("No Record found for selected Client!");
      return;
    }

    this.dataSortField_name = "year";
    this.dataSortField_numeric = true;

    this.clearAlldataFedex()
      .then(() => this.formYearMapFromResultFedex())
      .then(() => this.formYearMapFromResultForAverageFedex())
      .then(() => this.getYearACFedex())
      .then(() => this.getMonthACFedex())
      .then(() => this.getWeekACFedex())
      .then(() => {
        if (this.methodcall) {
          this.syncSelectionsAndRefresh();
          this.methodcall = false;
        } else {
          this.rdType_itemClickHandlerFedex();
        }
      })
      .catch(err => console.error("Error processing summary data:", err));
    this.cd.detectChanges();
  }

  async clearAlldataFedex() {
    this.myADG_dataProvider = [];
    this.dataGrid_dataProvider = [];
    this.dataGrid_columns = [];
    this.yearHashMap = new Map();
    this.serviceLevelDescMap = new Map();
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

  formYearMapFromResultFedex(): void {
    for (const t006Obj of this.resultAC) {
      // Get existing year map or create a new one
      const valueMap: any = this.yearHashMap.get(t006Obj.year) ?? new Map<string, any>();
      // Add service level entry
      valueMap.set(t006Obj.descriptionGroup, t006Obj);

      // Update maps
      this.yearHashMap.set(t006Obj.year, valueMap);
      this.serviceLevelDescMap.set(t006Obj.descriptionGroup, t006Obj.sortOrder);
    }
    // Static value for month in login page
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

  formYearMapFromResultForAverageFedex(): void {
    var resultACNetSpend = this.fullResultAc.filter((data: any) => data.dataLoadedType == 'Net Spend (FRT)');
    for (var loop = 0; loop < resultACNetSpend.length; loop++) {
      var t006Obj = resultACNetSpend[loop];
      var valueMap = new Map;
      if (this.yearHashMapNetSpend.has(t006Obj.year)) {
        valueMap = this.yearHashMapNetSpend.get(t006Obj.year);
      }
      else {
        valueMap = new Map();
      }
      valueMap.set(t006Obj.descriptionGroup, t006Obj);
      //reset the value map to the year map 
      this.yearHashMapNetSpend.set(t006Obj.year, valueMap);
    }

    var resultACCount = this.fullResultAc.filter((data: any) => data.dataLoadedType == 'Shipment Count');
    for (var loop = 0; loop < resultACCount.length; loop++) {
      var t006Obj = resultACCount[loop];
      var valueMap = new Map;
      if (this.yearHashMapCount.has(t006Obj.year)) {
        valueMap = this.yearHashMapCount.get(t006Obj.year);
      }
      else {
        valueMap = new Map();
      }
      valueMap.set(t006Obj.descriptionGroup, t006Obj);
      //reset the value map to the year map 
      this.yearHashMapCount.set(t006Obj.year, valueMap);
    }

    var resultACTotalWeight = this.fullResultAc.filter((data: any) => data.dataLoadedType == 'Total Weight (Lbs)');
    for (var loop = 0; loop < resultACTotalWeight.length; loop++) {
      var t006Obj = resultACTotalWeight[loop];
      var valueMap = new Map;
      if (this.yearHashMapTotalWeight.has(t006Obj.year)) {
        valueMap = this.yearHashMapTotalWeight.get(t006Obj.year);
      }
      else {
        valueMap = new Map();
      }
      valueMap.set(t006Obj.descriptionGroup, t006Obj);
      //reset the value map to the year map 
      this.yearHashMapTotalWeight.set(t006Obj.year, valueMap);
    }

    var resultACNetSpendFrtAcc = this.fullResultAc.filter((data: any) => data.dataLoadedType == 'Net Spend (FRT+ACC)');
    for (var loop = 0; loop < resultACNetSpendFrtAcc.length; loop++) {
      var t006Obj = resultACNetSpendFrtAcc[loop];
      var valueMap = new Map;
      if (this.yearHashMapNetSpendFrtAcc.has(t006Obj.year)) {
        valueMap = this.yearHashMapNetSpendFrtAcc.get(t006Obj.year);
      }
      else {
        valueMap = new Map();
      }
      valueMap.set(t006Obj.descriptionGroup, t006Obj);
      //reset the value map to the year map 
      this.yearHashMapNetSpendFrtAcc.set(t006Obj.year, valueMap);
    }
  }

  async getYearACFedex(): Promise<void> {

    this.yearArray.set([]);
    this.yearAC = [];

    const years: string[] = Array.from(this.yearHashMap.keys()).sort();
    for (const year of years) {
      const value = this.yearHashMap.get(year);
      this.yearAC.push({ Year: year, Month: "", Week: "", state: "unchecked", sortOrder: value, key: value });
    }
    this.yearArray.set(years);

    // automatically choose a sensible year if the form control is blank or
    // the previously selected value is not available in the newly populated
    // list.  this prevents the dropdown from showing an empty value when the
    // user first opens search.
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
          this.monthAC.push({ Year: year_key, Month: dataval, Week: "", state: "checked", sortOrder: monthKey, sortMonth: monthCount });
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

  rdType_itemClickHandlerFedex(): void {
    const monthHashMap = new Map();
    this.previousSelectedYear = this.displayYear;
    const displayYear = this.fedexFormGroup.get('year')?.value;
    const itemHashMap = new Map();
    //this.resettingAdvanceDataGrid();
    this.rdbtn_val = this.fedexFormGroup.get('searchcriteriabtn')?.value;
    if (this.rdbtn_val === "year") {
      this.gridColumn = "Year";
      this.costOptYear = "2017";
      if (this.yearAC && this.yearAC.length > 0) {
        for (const tempObj of this.yearAC) {
          (tempObj as any)["state"] = "checked";
        }
      }
      this.formDataGridYearDataFedex(this.yearHashMap);
      this.formGridColumnFedex(this.yearHashMap, null, null);
      this.myADG = this.yearGC;
      //this.selectedChange(this.service.array);
    }
    if (this.rdbtn_val === "month") {
      this.gridColumn = "Month";
      this.formMonthMapFromResultFedex(displayYear);
      this.formMonthMapFromResultFedexForAverage(displayYear);
      this.formDataGridMonthDataFedex(this.monthHashMap);
      this.monthGC = this.monthAC;
      for (let loop = 0; loop < 12; loop++) {
        const mntn = `${this.monthMasterHm.get(loop)} ${this.displayYear}`;
        this.monthMasterHm_temp.set(loop.toString(), mntn);
      }
      this.formGridColumnFedex(this.monthHashMap, null, this.monthMasterHm_temp);
    }
    if (this.rdbtn_val === "week") {
      this.gridColumn = "Week";
      const weekItemAC: string[] = [];
      let count = 0;

      for (const obj of this.weekAC) {
        if (obj.Year === Number(this.displayYear)) {
          if (obj.state === "checked") {
            if (!this.previousSelectedYear) {
              this.previousSelectedYear = obj.Year;
            }

            if (this.previousSelectedYear !== obj.Year.toString()) {
              this.openModal("Cannot select Week from Different Years, Please unselect Previous Selected Year and Try again!");
              break;
            }

            itemHashMap.set(obj.Week, "");
          }

          weekItemAC[count++] = obj.Week;
        }
      }

      // Initialize tempWeekIdArr correctly for the week tab
      const weeksForYear = this.weekAC.filter(w => String(w.Year) === String(this.displayYear));
      this.tempWeekIdArr = weeksForYear.map((w, i) => ({
        weekindex: w.state === 'checked' ? i : null,
        week: w.Week,
        weekstate: w.state
      }));

      // Setting Week Map
      const arr: any[] = [];
      this.formGridColumnFedex(itemHashMap, weekItemAC, null);
      this.formDataGridWeekDataFedex(this.displayYear, arr);
      this.myADG = this.weekGC;
    }
  }

  settingCurrentStatechecked(uncheckList: any[], year: string | number): any[] {
    for (let loop = 0; loop < uncheckList.length; loop++) {
      const obj = uncheckList[loop];

      if (obj.Year === year) {
        obj["state"] = "checked";
      } else {
        obj["state"] = "unchecked";
      }

      // preserve original logic: push back into list at index
      uncheckList[loop] = obj;
    }

    return uncheckList;
  }

  formDataGridYearDataFedex(inputyearHashMap: Map<string, Map<string, any>>): void {
    this.dpAC = [];
    var serviceDescAC = this.serviceLevelDescMap.keys();
    let totalFedExGround = 0;
    let totalFedExHomeDelivery = 0;
    let totalFedExSmartPost = 0;
    let totalFedExFirstOvernight = 0;
    let totalFedExPriorityOvernight = 0;
    let totalFedExStandardOvernight = 0;
    let totalFedEx2DayAM = 0;
    let totalFedEx2DAY = 0;
    let totalFedExExpressSaver = 0;
    let totalFedExInternationalFirst = 0;
    let totalFedExInternationalPriorityExpress = 0;
    let totalFedExInternationalPriority = 0;
    let totalFedExInternationalEconomy = 0;
    let totalFedExInternationalConnectPlus = 0;
    let totalFedExInternationalGround = 0;
    let totalFedExInternationalPriorityDirectDistribution = 0;
    let totalFedExInternationalEconomyDirectDistribution = 0;
    let arrayLoop = [];
    for (let [key, value] of this.serviceLevelDescMap) {

      arrayLoop.push({ key })

    }

    for (var loop = 0; loop < this.serviceLevelDescMap.size; loop++) {
      let costObj: any = {};
      let serviceDescVal = arrayLoop[loop];
      let serviceDesc = serviceDescVal.key;

      costObj['servicedesc'] = serviceDesc;

      let yearArray = inputyearHashMap.keys();
      let yearArrSize = inputyearHashMap.size;
      let yearArray1 = inputyearHashMap.size;
      let yearArr = [];
      for (let yearCnt = 0; yearCnt < yearArrSize; yearCnt++) {
        yearArr.push(yearArray.next());
      }

      var dataLoadedType = this.fedexFormGroup.get('dataLoadedType')?.value;
      for (var valueCount = 0; valueCount < yearArray1; valueCount++) {
        var yearVal = yearArr[valueCount].value + "";
        var valueMap = this.yearHashMap.get(yearVal);
        if (valueMap.get(serviceDesc) != null) {
          var value = 0;
          this.t301Obj = valueMap.get(serviceDesc);
          if (this.t301Obj.descriptionGroup == "FedEx Ground") {
            value = Number(this.t301Obj.gdyear);
            totalFedExGround = value + totalFedExGround;
            costObj["total"] = Number(totalFedExGround);
          }
          if (this.t301Obj.descriptionGroup == "FedEx Home Delivery") {
            value = Number(this.t301Obj.gdyear);
            totalFedExHomeDelivery = value + totalFedExHomeDelivery;

            costObj["total"] = Number(totalFedExHomeDelivery);
          }
          if (this.t301Obj.descriptionGroup == "FedEx Ground Economy") {
            value = Number(this.t301Obj.gdyear);
            totalFedExSmartPost = value + totalFedExSmartPost;

            costObj["total"] = Number(totalFedExSmartPost);
          }
          if (this.t301Obj.descriptionGroup == "FedEx First Overnight") {
            value = Number(this.t301Obj.gdyear);
            totalFedExFirstOvernight = value + totalFedExFirstOvernight;

            costObj["total"] = Number(totalFedExFirstOvernight);
          }
          if (this.t301Obj.descriptionGroup == "FedEx Priority Overnight") {
            value = Number(this.t301Obj.gdyear);
            totalFedExPriorityOvernight = value + totalFedExPriorityOvernight;
            costObj["total"] = Number(totalFedExPriorityOvernight);
          }
          if (this.t301Obj.descriptionGroup == "FedEx Standard Overnight") {
            value = Number(this.t301Obj.gdyear);
            totalFedExStandardOvernight = value + totalFedExStandardOvernight;
            costObj["total"] = Number(totalFedExStandardOvernight);
          }
          if (this.t301Obj.descriptionGroup == "FedEx 2 Day AM") {
            value = Number(this.t301Obj.gdyear);
            totalFedEx2DayAM = value + totalFedEx2DayAM;
            costObj["total"] = Number(totalFedEx2DayAM);
          }
          if (this.t301Obj.descriptionGroup == "FedEx 2 Day") {
            value = Number(this.t301Obj.gdyear);
            totalFedEx2DAY = value + totalFedEx2DAY;
            costObj["total"] = Number(totalFedEx2DAY);
          }
          if (this.t301Obj.descriptionGroup == "FedEx Express Saver") {
            value = Number(this.t301Obj.gdyear);
            totalFedExExpressSaver = value + totalFedExExpressSaver;
            costObj["total"] = Number(totalFedExExpressSaver);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International First") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalFirst = value + totalFedExInternationalFirst;
            costObj["total"] = Number(totalFedExInternationalFirst);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Priority Express") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalPriorityExpress = value + totalFedExInternationalPriorityExpress;
            costObj["total"] = Number(totalFedExInternationalPriorityExpress);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Priority") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalPriority = value + totalFedExInternationalPriority;
            costObj["total"] = Number(totalFedExInternationalPriority);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Economy") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalEconomy = value + totalFedExInternationalEconomy;
            costObj["total"] = Number(totalFedExInternationalEconomy);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Connect Plus") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalConnectPlus = value + totalFedExInternationalConnectPlus;
            costObj["total"] = Number(totalFedExInternationalConnectPlus);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Ground") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalGround = value + totalFedExInternationalGround;
            costObj["total"] = Number(totalFedExInternationalGround);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Priority DirectDistribution") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalPriorityDirectDistribution = value + totalFedExInternationalPriorityDirectDistribution;
            costObj["total"] = Number(totalFedExInternationalPriorityDirectDistribution);
          }
          if (this.t301Obj.descriptionGroup == "FedEx International Economy DirectDistribution") {
            value = Number(this.t301Obj.gdyear);
            totalFedExInternationalEconomyDirectDistribution = value + totalFedExInternationalEconomyDirectDistribution;
            costObj["total"] = Number(totalFedExInternationalEconomyDirectDistribution);
          }

          if (dataLoadedType == 'Average Cost (FRT)' || dataLoadedType == 'Average Weight (Lbs)' || dataLoadedType == 'Average Cost (FRT+ACC)') {
            var value1 = this.summingthevaluesFedex(valueMap.get(serviceDesc), yearArr, serviceDesc, 'year');
            costObj["total"] = Number(value1);
          }


          if (valueCount == 0)
            costObj["value0"] = Number(this.t301Obj.gdyear);
          if (valueCount == 1)
            costObj["value1"] = Number(this.t301Obj.gdyear);
          if (valueCount == 2)
            costObj["value2"] = Number(this.t301Obj.gdyear);
          if (valueCount == 3)
            costObj["value3"] = Number(this.t301Obj.gdyear);
          if (valueCount == 4)
            costObj["value4"] = Number(this.t301Obj.gdyear);
          if (valueCount == 5)
            costObj["value5"] = Number(this.t301Obj.gdyear);
          if (valueCount == 6)
            costObj["value6"] = Number(this.t301Obj.gdyear);
          if (valueCount == 7)
            costObj["value7"] = Number(this.t301Obj.gdyear);
          if (valueCount == 8)
            costObj["value8"] = Number(this.t301Obj.gdyear);
          if (valueCount == 9)
            costObj["value9"] = Number(this.t301Obj.gdyear);
          if (valueCount == 10)
            costObj["value10"] = Number(this.t301Obj.gdyear);

          costObj["category"] = this.t301Obj.serviceLevelGroup;

        }
      }


      this.dpAC.push(costObj);
    }
  }

  async summingthevaluesFedex(t301Obj: any, yearArr: any, serviceDesc: any, type: any) {
    let value = 0;
    let divideBy = 0;
    let dataLoadedType = this.fedexFormGroup.get('dataLoadedType')?.value;
    if (type == "month") {
      if (dataLoadedType == "Average Cost (FRT)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          let monthVal = yearArr[valueCount].value + "";
          let monthObjNetSpend = this.monthHashMapNetSpend.get(monthVal + "").get(serviceDesc);
          let monthObjCount = this.monthHashMapCount.get(monthVal + "").get(serviceDesc);
          if (monthObjNetSpend != null) {
            value = value + Number(monthObjNetSpend);
          }
          if (monthObjCount != null) {
            divideBy = divideBy + Number(monthObjCount);
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
      else if (dataLoadedType == "Average Weight (Lbs)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          let monthVal = yearArr[valueCount].value + "";
          if (this.monthHashMapTotalWeight.size > 0) {
            let monthObjTotalWeight = this.monthHashMapTotalWeight.get(monthVal + "").get(serviceDesc);
            let monthObjCount = this.monthHashMapCount.get(monthVal + "").get(serviceDesc);
            if (monthObjTotalWeight != null) {
              value = value + Number(monthObjTotalWeight);
            }
            if (monthObjCount != null) {
              divideBy = divideBy + Number(monthObjCount);
            }
          }
          else {
            let monthObj = this.monthHashMap.get(monthVal).get(serviceDesc);
            if (monthObj != null) {
              if (Number(monthObj) != 0) {
                divideBy = divideBy + 1;
              }
              value = value + Number(monthObj);
            }
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
      else if (dataLoadedType == "Average Cost (FRT+ACC)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          let monthVal = yearArr[valueCount].value + "";
          let monthObjNetSpendFrtAcc = this.monthHashMapNetSpendFrtAcc.get(monthVal + "").get(serviceDesc);
          let monthObjCountFrtAcc = this.monthHashMapCountFrtAcc.get(monthVal + "").get(serviceDesc);
          if (monthObjNetSpendFrtAcc != null) {
            value = value + Number(monthObjNetSpendFrtAcc);
          }
          if (monthObjCountFrtAcc != null) {
            divideBy = divideBy + Number(monthObjCountFrtAcc);
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
    }
    else if (type == "year") {
      if (dataLoadedType == "Average Cost (FRT)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          let yearVal = yearArr[valueCount].value + "";
          let yearObjNetSpend = this.yearHashMapNetSpend.get(yearVal).get(serviceDesc);
          let yearObjCount = this.yearHashMapCount.get(yearVal).get(serviceDesc);
          if (yearObjNetSpend != null) {
            value = value + Number(yearObjNetSpend.gdyear);
          }
          if (yearObjCount != null) {
            divideBy = divideBy + Number(yearObjCount.gdyear);
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
      else if (dataLoadedType == "Average Weight (Lbs)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          let yearVal = yearArr[valueCount].value + "";
          if (this.yearHashMapTotalWeight.size > 0) {
            let yearObjTotalWeight = this.yearHashMapTotalWeight.get(yearVal).get(serviceDesc);
            let yearObjCount = this.yearHashMapCount.get(yearVal).get(serviceDesc);
            if (yearObjTotalWeight != null) {
              value = value + Number(yearObjTotalWeight.gdyear);
            }
            if (yearObjCount != null) {
              divideBy = divideBy + Number(yearObjCount.gdyear);
            }
          }
          else {
            let yearObj = this.yearHashMap.get(yearVal).get(serviceDesc);

            if (yearObj != null) {
              if (Number(yearObj.gdyear) != 0) {
                divideBy = divideBy + 1;
              }
              value = value + Number(yearObj.gdyear);
            }
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
      else if (dataLoadedType == "Average Cost (FRT+ACC)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          let yearVal = yearArr[valueCount].value + "";
          let yearObjNetSpendFrtAcc = this.yearHashMapNetSpendFrtAcc.get(yearVal).get(serviceDesc);
          let yearObjCountFrtAcc = this.yearHashMapCountFrtAcc.get(yearVal).get(serviceDesc);
          if (yearObjNetSpendFrtAcc != null) {
            value = value + Number(yearObjNetSpendFrtAcc.gdyear);
          }
          if (yearObjCountFrtAcc != null) {
            divideBy = divideBy + Number(yearObjCountFrtAcc.gdyear);
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
    }
    else if (type == "week") {
      if (dataLoadedType == "Average Cost (FRT)") {
        for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
          if (this.tempWeekIdArr[cnt].weekindex != null) {
            let yearVal = yearArr + "";
            let yearObjNetSpend = this.yearHashMapNetSpend.get(yearVal).get(serviceDesc);
            let yearObjCount = this.yearHashMapCount.get(yearVal).get(serviceDesc);
            if (yearObjNetSpend != null) {
              value = value + Number(yearObjNetSpend["wk" + (cnt + 1)]);
            }
            if (yearObjCount != null) {
              divideBy = divideBy + Number(yearObjCount["wk" + (cnt + 1)]);
            }
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
      else if (dataLoadedType == "Average Weight (Lbs)") {
        for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
          if (this.tempWeekIdArr[cnt].weekindex != null) {
            let yearVal = yearArr + "";
            if (this.yearHashMapTotalWeight.size > 0) {
              let yearObjTotalWeight = this.yearHashMapTotalWeight.get(yearVal).get(serviceDesc);
              let yearObjCount = this.yearHashMapCount.get(yearVal).get(serviceDesc);
              if (yearObjTotalWeight != null) {
                value = value + Number(yearObjTotalWeight["wk" + (cnt + 1)]);
              }
              if (yearObjCount != null) {
                divideBy = divideBy + Number(yearObjCount["wk" + (cnt + 1)]);
              }
            }
            else {
              var yearObj = this.yearHashMap.get(yearVal).get(serviceDesc);
              if (yearObj != null) {
                if (Number(yearObj["wk" + (cnt + 1)]) != 0) {
                  divideBy = divideBy + 1;
                }
                value = value + Number(yearObj["wk" + (cnt + 1)]);
              }
            }
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
      if (dataLoadedType == "Average Cost (FRT+ACC)") {
        for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
          if (this.tempWeekIdArr[cnt].weekindex != null) {
            let yearVal = yearArr + "";
            let yearObjNetSpendFrtAcc = this.yearHashMapNetSpendFrtAcc.get(yearVal).get(serviceDesc);
            let yearObjCountFrtAcc = this.yearHashMapCountFrtAcc.get(yearVal).get(serviceDesc);
            if (yearObjNetSpendFrtAcc != null) {
              value = value + Number(yearObjNetSpendFrtAcc["wk" + (cnt + 1)]);
            }
            if (yearObjCountFrtAcc != null) {
              divideBy = divideBy + Number(yearObjCountFrtAcc["wk" + (cnt + 1)]);
            }
          }
        }
        if (divideBy != 0) {
          value = value / divideBy;
        }
      }
    }
    return value;

  }

  formGridColumnFedex(inputColumnArray: any, allColumnArray: any, masterMap: Map<string, string> | null): void {
    const cols: Array<{ headerText: string; dataField: string; width?: number }> = [];

    // Service Level column
    cols.push({ headerText: 'Service Level', dataField: 'servicedesc', width: 235 });

    // TOTAL column logic
    if (this.rdbtn_val !== 'week') {
      cols.push({ headerText: 'TOTAL', dataField: 'total' });
    } else {
      const visibleBoolean = inputColumnArray.size > 0;
      if (visibleBoolean) {
        cols.push({ headerText: 'TOTAL', dataField: 'total' });
      }
    }

    // Week-specific columns
    if (this.rdbtn_val === 'week') {
      const yearArray = Array.from(inputColumnArray.keys());

      for (let ploop = 0; ploop < this.tempWeekIdArr.length; ploop++) {
        const weekItem = this.tempWeekIdArr[ploop];
        if (weekItem.weekindex != null) {
          cols.push({
            headerText: weekItem.week,
            dataField: `value${ploop}`
          });
        }
      }
    } else {
      const yearArray = Array.from(inputColumnArray.keys());

      for (let loop = 0; loop < inputColumnArray.size; loop++) {
        const arrVal = String(yearArray[loop]);
        const headerText = masterMap?.get(String(loop)) ?? arrVal;

        cols.push({
          headerText,
          dataField: `value${loop}`
        });
      }
    }

    this.dataGrid_columns = cols;
    this.cd.detectChanges();
  }


  async formMonthMapFromResultFedex(selectedYear: number): Promise<void> {
    const costOptYear = selectedYear.toString();
    let totalShipmentsPackage = 0;
    let totalnetspend = 0;

    const monthHm = this.yearHashMapObj.get(selectedYear.toString());
    if (!monthHm) return;

    const divideBy = 0;

    for (const testObj of this.resultAC) {
      if (testObj.year !== selectedYear) continue;

      const valueArrayObj = this.formvalueArrayFedex(testObj);

      for (let monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        const monthKey = String(monthLoop);
        const monthSaturdayAC = monthHm.get(monthKey);

        // Map month index to property name
        const monthFields = [
          'jan', 'feb', 'mar', 'apr', 'may', 'jun',
          'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
        ];

        const fieldName = monthFields[monthLoop];
        const valueForMonth = Number(testObj[fieldName] ?? 0);

        // Retrieve or initialize valueMap
        let valueMap = this.monthHashMap.get(monthKey) ?? new Map<string, number>();

        // Reset existing entry for descriptionGroup
        valueMap.delete(testObj.descriptionGroup);
        valueMap.set(testObj.descriptionGroup, valueForMonth);

        this.monthHashMap.set(monthKey, valueMap);
      }
    }
  }

  formvalueArrayFedex(testObj: Record<string, any>): number[] {
    const valueArray: number[] = [];

    // Loop from w1 to w53 dynamically
    for (let i = 1; i <= 53; i++) {
      const fieldName = `w${i}`;
      valueArray.push(testObj[fieldName]);
    }

    return valueArray;
  }


  set2dpforPrice(value_price: string | null): string {
    let value: string;

    if (
      value_price == null ||
      value_price === "." ||
      value_price === "" ||
      value_price === "null"
    ) {
      value = "0.00";
    } else if (value_price === "0") {
      value = "0.00";
    } else {
      value = parseFloat(value_price).toFixed(2);
    }

    return value;
  }

  async formMonthMapFromResultFedexForAverage(selectedYear: number): Promise<void> {
    const monthFields = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];

    // Generic helper to process one dataset type
    const processDataSet = async (
      dataSet: any[],
      monthMap: Map<string, Map<string, number>>,
      yearMap: Map<any, any> | undefined
    ) => {
      if (!yearMap) return;

      for (const testObj of dataSet) {
        if (testObj.year !== selectedYear) continue;

        for (let monthLoop = 0; monthLoop < yearMap.size; monthLoop++) {
          const monthKey = String(monthLoop);
          const fieldName = monthFields[monthLoop];
          const valueForMonth = Number(testObj[fieldName] ?? 0);

          let valueMap = monthMap.get(monthKey) ?? new Map<string, number>();
          valueMap.delete(testObj.descriptionGroup);
          valueMap.set(testObj.descriptionGroup, valueForMonth);

          monthMap.set(monthKey, valueMap);
        }
      }
    };

    // Run the same process for each dataset
    await processDataSet(
      this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Net Spend (FRT)'),
      this.monthHashMapNetSpend,
      this.yearHashMapObj.get(selectedYear.toString())
    );

    await processDataSet(
      this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Shipment Count'),
      this.monthHashMapCount,
      this.yearHashMapObj.get(selectedYear.toString())
    );

    await processDataSet(
      this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Total Weight (Lbs)'),
      this.monthHashMapTotalWeight,
      this.yearHashMapObj.get(selectedYear.toString())
    );

    await processDataSet(
      this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Net Spend (FRT+ACC)'),
      this.monthHashMapNetSpendFrtAcc,
      this.yearHashMapNetSpendFrtAcc.get(selectedYear.toString())
    );
  }


  async formDataGridMonthDataFedex(inputMonthHm: Map<string, any>): Promise<void> {

    this.dpAC = [];

    var arrayLoop = [];
    for (let [key, value] of this.serviceLevelDescMap) {

      arrayLoop.push({ key })

    }

    for (var loop = 0; loop < this.serviceLevelDescMap.size; loop++) {
      let costObj: any = {};
      var serviceDescVal = arrayLoop[loop];
      var serviceDesc = serviceDescVal.key;
      var totalMonth = 0;

      costObj["servicedesc"] = serviceDesc;
      var monthArray = inputMonthHm.keys();
      var monthArray1 = inputMonthHm.size;
      costObj["sortOrder"] = this.serviceLevelDescMap.get(serviceDesc);
      var monthArr = [];
      for (let yearCnt = 0; yearCnt < monthArray1; yearCnt++) {
        monthArr.push(monthArray.next());
      }
      var dataLoadedType = this.fedexFormGroup.get('dataLoadedType')?.value;
      for (var valueCount = 0; valueCount < monthArray1; valueCount++) {
        var monthVal = monthArr[valueCount].value + "";
        var valueMap = this.monthHashMap.get(monthVal + "");
        var displayYear = this.fedexFormGroup.get('year')?.value;
        var valueMap1 = this.yearHashMap.get(displayYear);
        if (valueMap != null) {
          if (valueMap.get(serviceDesc) != null) {

            var value = valueMap.get(serviceDesc);


            if (valueCount == 0)
              costObj["value0"] = Number(value);
            if (valueCount == 1)
              costObj["value1"] = Number(value);
            if (valueCount == 2)
              costObj["value2"] = Number(value);
            if (valueCount == 3)
              costObj["value3"] = Number(value);
            if (valueCount == 4)
              costObj["value4"] = Number(value);
            if (valueCount == 5)
              costObj["value5"] = Number(value);
            if (valueCount == 6)
              costObj["value6"] = Number(value);
            if (valueCount == 7)
              costObj["value7"] = Number(value);
            if (valueCount == 8)
              costObj["value8"] = Number(value);
            if (valueCount == 9)
              costObj["value9"] = Number(value);
            if (valueCount == 10)
              costObj["value10"] = Number(value);
            if (valueCount == 11)
              costObj["value11"] = Number(value);

            if (dataLoadedType == 'Shipment Count' || dataLoadedType == 'Net Spend (FRT)' || dataLoadedType == 'Net Spend (FRT+ACC)') {
              totalMonth = value + totalMonth;
              costObj["total"] = Number(totalMonth);
            }
            else {
              var value1 = await this.summingthevaluesFedex(valueMap.get(serviceDesc), monthArr, serviceDesc, 'month');
              costObj["total"] = Number(value1);
            }
            costObj["category"] = (valueMap1.get(serviceDesc)).serviceLevelGroup;

          }
        }

      }

      this.dpAC.push(costObj);
    }

  }


  async formDataGridWeekDataFedex(selectedYear: number, selectitem: any[]): Promise<void> {
    this.costOptYear = selectedYear;
    this.dpAC = [];
    if (!selectitem || selectitem.length === 0) return;

    const serviceDescs = Array.from(this.serviceLevelDescMap.keys());
    const dataLoadedType = this.fedexFormGroup.get('dataLoadedType')?.value;

    for (const serviceDesc of serviceDescs) {
      const costObj: Record<string, any> = {
        servicedesc: serviceDesc,
        sortOrder: this.serviceLevelDescMap.get(serviceDesc)
      };

      const valueMap = this.yearHashMap.get(selectedYear);
      if (!valueMap?.get(serviceDesc)) continue;

      const serviceData = valueMap.get(serviceDesc);

      // Assign week values dynamically
      for (let i = 0; i < this.tempWeekIdArr.length; i++) {
        if (this.tempWeekIdArr[i].weekindex != null) {
          costObj[`value${i}`] = Number(serviceData[`wk${i + 1}`] ?? 0);
        }
      }

      // Calculate totals
      let totalShipmentsPackage = 0;
      if (selectitem.length === 0) {
        // Sum all week values dynamically 
        for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
          if (this.tempWeekIdArr[i].weekstate === 'checked') {
            totalShipmentsPackage += Number(this.removeCommas(costObj[`value${i}`] ?? 0));
          }
        }

        if (
          dataLoadedType === 'Shipment Count' ||
          dataLoadedType === 'Net Spend (FRT)' ||
          dataLoadedType === 'Net Spend (FRT+ACC)'
        ) {
          costObj["total"] = totalShipmentsPackage;
        } else {
          costObj["total"] = Number(serviceData.gdyear ?? 0);
        }
      } else {
        // Sum only selected weeks
        for (let i = 0; i < this.tempWeekIdArr.length; i++) {
          if (this.tempWeekIdArr[i].weekindex != null) {
            totalShipmentsPackage += Number(this.removeCommas(costObj[`value${i}`] ?? 0));
          }
        }

        if (
          dataLoadedType === 'Shipment Count' ||
          dataLoadedType === 'Net Spend (FRT)' ||
          dataLoadedType === 'Net Spend (FRT+ACC)'
        ) {
          costObj["total"] = totalShipmentsPackage;
        } else {
          const value1 = await this.summingthevaluesFedex(serviceData, selectedYear, serviceDesc, 'week');
          costObj["total"] = Number(value1);
        }
      }

      costObj["category"] = serviceData.serviceLevelGroup;
      this.dpAC.push(costObj);
    }
  }

  getExcelFormattedValue(value: any): string {
    const numericValue = Number(value);

    let dataLoadedType: string | null = null;
    dataLoadedType = this.fedexFormGroup.get("dataLoadedType")?.value;

    // Handle zero values
    if (numericValue === 0) {
      return (dataLoadedType === "Shipment Count" || dataLoadedType === "Average Weight (Lbs)")
        ? "-"
        : "$ -";
    }

    // Formatters
    const formattedValue = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(numericValue));

    const formattedValueCount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(numericValue));

    const formattedValueWeight = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(Math.abs(numericValue));

    // Negative values
    if (numericValue < 0) {
      if (dataLoadedType === "Shipment Count") {
        return formattedValueCount;
      } else if (dataLoadedType === "Average Weight (Lbs)") {
        return formattedValueWeight;
      } else {
        return `$ (${formattedValue})`; // Negative numbers in parentheses
      }
    }

    // Positive values
    if (dataLoadedType === "Shipment Count") {
      return formattedValueCount;
    } else if (dataLoadedType === "Average Weight (Lbs)") {
      return formattedValueWeight;
    } else {
      return `$ ${formattedValue}`;
    }
  }


  removeCommas(str: string) {
    if (str != null) {
      str = (str.toString().replace(/[$,]/g, ""));
      return str;
    }
    return "0";
  }

  // -- Search  Process Function --
  async acc_clientid_changeHandler() {
    this.openLoading();
    var primaryAccountNumber = this.fedexFormGroup.get('primaryAccountNumber')?.value;
    if (primaryAccountNumber == "null") {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(this.clientIdFedex);
    } else {
      await this.fedexFormGroup.get('primaryAccountNumber')?.setValue(primaryAccountNumber);
    }
    this.methodcall = true;
    await this.fetchServiceLevelUsageSummaryFedEx();
  }

  async changeDataloadedType() {
    this.openLoading();
    this.methodcall = true;
    await this.fetchServiceLevelUsageSummaryFedExResult(this.fullResultAc);
  }

  async checkTree() {
    var nodeVal = await this.treeFormGroup.get('children')?.value;
    await this.fedexFormGroup.get('searchcriteriabtn')?.setValue(nodeVal);
    this.syncSelectionsAndRefresh();
  }

  async myADG_itemClickHandlerFedex(event: any[]) {
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
        await this.formMonthMapFromResultFedexForAverage(yeardata);
        await this.formDataGridMonthDataFedex(this.itemNumberHashMap);
        await this.formGridColumnFedex(this.itemHashMap, null, null);
      }
      else {
        var selectCount = this.chechisItemSelected(this.monthAC);
        if (selectCount == 0) {
          this.previousSelectedYear = null;
          await this.formMonthMapFromResultFedex(yeardata);
          await this.formMonthMapFromResultFedexForAverage(yeardata);
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

        // Fix: populate tempWeekIdArr with weeks for the requested year,
        // but only set weekindex for those that are actually checked
        // so that formGridColumnFedex only adds columns for those weeks.
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
        });
      }

      if (this.itemHashMap.size > 0) {

        await this.formDataGridWeekDataFedex(this.displayYear, checkedItemAC);
        await this.formGridColumnFedex(this.itemHashMap, weekItemAC, null);

      } else {
        const selectCount = this.chechisItemSelected(this.weekAC);
        if (selectCount === 0) {
          this.previousSelectedYear = null;
          await this.formGridColumnFedex(this.itemHashMap, weekItemAC, null);
          await this.formDataGridWeekDataFedex(this.displayYear, checkedItemAC);
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


  ngAfterViewInit(): void {
    this.updateTopScrollWidth();

    // Keep top scrollbar width in sync with table width changes
    this.resizeObserver = new ResizeObserver(() => this.updateTopScrollWidth());
    this.resizeObserver.observe(this.tableScroll.nativeElement);

    // Also update after a tick (helps when fonts/layout settle)
    setTimeout(() => this.updateTopScrollWidth(), 0);
    this.cd.detectChanges();
    setTimeout(() => {
      const tableEl = this.tableScroll.nativeElement;
      const topInner = this.topScroll.nativeElement.firstElementChild as HTMLElement;

      console.log('Width:', tableEl.scrollWidth); // 

      topInner.style.width = tableEl.scrollWidth + 'px';
    }, 100);
  }

  // UI - Logic

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
    const top = this.topScroll.nativeElement;
    const table = this.tableScroll.nativeElement;

    const scrollLeft = (event.target as HTMLElement).scrollLeft;

    if (source === 'top') {
      if (table.scrollLeft !== scrollLeft) {
        table.scrollLeft = scrollLeft;
      }
    } else {
      if (top.scrollLeft !== scrollLeft) {
        top.scrollLeft = scrollLeft;
      }
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


  toggleMonth(month: Month, checked: boolean, year?: string): void {
    const activeTab = this.selectedTab();
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

  // selection logic
  isAllSelected(month: Month): boolean {
    return month.dates && month.dates.length > 0 && month.dates.every(d => d.selected);
  }

  isIndeterminate(month: Month): boolean {
    const selectedCount = month.dates.filter(d => d.selected).length;
    return selectedCount > 0 && selectedCount < month.dates.length;
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

  private syncSelectionsAndRefresh(): void {
    const selectedTab = this.selectedTab();
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


  generateExcel(): void {
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");

    this.costOptDataArr = [];
    this.headerTextArr = [];

    const sectionHeaders = ["DOMESTIC GROUND", "DOMESTIC AIR", "INTERNATIONAL"];
    const categorizedData: Record<string, any[][]> = {
      "DOMESTIC GROUND": [],
      "DOMESTIC AIR": [],
      "INTERNATIONAL": []
    };

    // Build categorized data
    for (let loop1 = 0; loop1 < this.dpAC.length; loop1++) {
      const costOptData: any[] = [];
      const serviceLevelGroup = this.dpAC[loop1]["category"] || "UNKNOWN";

      for (let loop2 = 0; loop2 < this.dataGrid_columns.length; loop2++) {
        if (this.dpAC[loop1][this.dataGrid_columns[loop2]["dataField"]] === undefined) {
          this.dpAC[loop1][this.dataGrid_columns[loop2]["dataField"]] = "";
        }
        const value = this.dpAC[loop1][this.dataGrid_columns[loop2]["dataField"]].toString();

        if (this.clientType() === "UPS") {
          if (loop2 === 0) {
            costOptData.push(value);
          } else {
            costOptData.push(Number(value.replace("$", "").replace(/[,]/g, "")));
          }
        } else {
          costOptData.push(value);
        }
      }

      if (serviceLevelGroup.includes("DOMESTIC GROUND")) {
        categorizedData["DOMESTIC GROUND"].push(costOptData);
      } else if (serviceLevelGroup.includes("DOMESTIC AIR")) {
        categorizedData["DOMESTIC AIR"].push(costOptData);
      } else {
        categorizedData["INTERNATIONAL"].push(costOptData);
      }
    }

    // Build header text
    for (const col of this.dataGrid_columns) {
      this.headerTextArr.push(col["headerText"]);
    }

    // File name
    let year: string;
    let dataLoadedType: string;
    let fileName: string;

    year = this.fedexFormGroup.get('year')?.value;
    dataLoadedType = this.fedexFormGroup.get('dataLoadedType')?.value;
    fileName = this.clientName + "_Service_Level_Usage_Summary_Report_" + dataLoadedType + "_" + year + ".xlsx";

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Service Level Usage Summary");

    // Header row
    const headerRow = worksheet.addRow(this.headerTextArr);
    headerRow.font = { family: 4, size: 12, color: { argb: "F9F9F9" } };

    headerRow.eachCell((cell, number) => {
      if (number === 1 || number === 2) {
        cell.font = { family: 4, size: 12, color: { argb: "F9F9F9" }, bold: true };
      }
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "16365c" }, bgColor: { argb: "16365c" } };
      cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
    });

    // Insert categorized data
    let rowIndex = 2;
    sectionHeaders.forEach(section => {
      const totalColumns = worksheet.columns.length;
      const sectionRowData = [section, ...new Array(totalColumns - 1).fill("")];
      const sectionRow = worksheet.addRow(sectionRowData);

      sectionRow.eachCell((cell, number) => {
        if (number === 1 || number === 2) {
          cell.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };
        }
        if (section === "DOMESTIC GROUND") cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4f81bd" } };
        if (section === "DOMESTIC AIR") cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "9bbb59" } };
        if (section === "INTERNATIONAL") cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "f79646" } };
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
      });
      rowIndex++;

      categorizedData[section].forEach(dataRow => {
        const row = worksheet.addRow(dataRow);

        if (this.clientType() === "UPS") {
          if (dataLoadedType === "Shipment Count") {
            worksheet.getRow(rowIndex).numFmt = "#,##0";
          } else if (dataLoadedType === "Average Weight (Lbs)") {
            worksheet.getRow(rowIndex).numFmt = "#,##0.0";
          } else {
            worksheet.getRow(rowIndex).numFmt = "$#,##0.00";
          }
        }

        row.eachCell((cell, number) => {
          if (number === 1 || number === 2) cell.font = { bold: true };
          if (typeof cell.value === "number" && cell.value === 0) {
            cell.alignment = { horizontal: "right", vertical: "middle" };
            cell.value = (dataLoadedType === "Shipment Count" || dataLoadedType === "Average Weight (Lbs)") ? "-" : "$ -";
          }
          if (section === "DOMESTIC GROUND") cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "dce6f1" } };
          if (section === "DOMESTIC AIR") cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "ebf1de" } };
          if (section === "INTERNATIONAL") cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "fde9d9" } };
          cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
        rowIndex++;
      });
    });

    worksheet.getColumn(1).width = 42;
    for (let loop = 2; loop <= 54; loop++) {
      worksheet.getColumn(loop).width = 12;
    }
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      fs.saveAs(blob, fileName);
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

  getRowTotal(values: (string | null | undefined)[]): string {
    let sum = 0;
    let hasNumber = false;

    for (const v of values) {
      if (v !== null && v !== undefined && v !== '-' && v !== '') {
        const n = Number(v.toString().replace(/,/g, ''));
        if (!Number.isNaN(n)) {
          sum += n;
          hasNumber = true;
        }
      }
    }

    return hasNumber ? sum.toLocaleString() : '-';
  }

  isYearChecked(year: string): boolean {
    return this.selectedYearCheckboxes.has(year);
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


}