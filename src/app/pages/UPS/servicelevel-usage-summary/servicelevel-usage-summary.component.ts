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
export class UpsServicelevelUsageSummaryComponent implements OnInit {

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
  userProfifle: any;
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
  methodCall = false;
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
  apiControllerFormGroup!: FormGroup;
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
  constructor(private cookiesService: CookiesService, private loaderService: LoaderService,
    private fb: FormBuilder, private offcanvasService: NgbOffcanvas,
    private commonService: CommonService, private httpClientService: HttpClientService,
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

    this.apiControllerFormGroup = new FormGroup({
      year: new FormControl(''),
      searchcriteriabtn: new FormControl('month'),
      client_id: new FormControl(''),
      clientname: new FormControl(''),
      state: new FormControl(''),
      ipaddress: new FormControl(''),
      city: new FormControl(''),
      region: new FormControl(''),
      country: new FormControl(''),
      location: new FormControl(''),
      loginclientName: new FormControl(''),
      clientNameselected: new FormControl(''),
      upsClientId: new FormControl(''),
      accNo: new FormControl(''),
      dataLoadedType: new FormControl('Shipment Count'),
      t001ClientProfile: new FormGroup({
        action: new FormControl(''), activeFlag: new FormControl(''), address: new FormControl(''), asonDate: new FormControl(''), carrierType: new FormControl(''), changePassword: new FormControl(''),
        charges: new FormControl(''), clientId: new FormControl(''), clientName: new FormControl(''), clientPassword: new FormControl(''), clientdbstatus: new FormControl(''),
        comments: new FormControl(''), contactNo: new FormControl(''), contractanalysisstatus: new FormControl(''), createdBy: new FormControl(''),
        createdTs: new FormControl(''), currentDate: new FormControl(''), currentstatus: new FormControl(''), customertype: new FormControl(''), dataFileDestDir: new FormControl(''),
        dataFileSourceDir: new FormControl(''), dataLoadBy: new FormControl(''), dataSource: new FormControl(''), dataasof: new FormControl(''),
        daystoweb: new FormControl(''), email: new FormControl(''), employeeTempTotal: new FormControl(''), employerTempTotal: new FormControl(''), errorString: new FormControl(''),
        fetchPhoto: new FormControl(''), fileEndDate: new FormControl(''), fileStartDate: new FormControl(''), getImageInd: new FormControl(''), image: new FormControl(''),
        ipaddress: new FormControl(''), isSelected: new FormControl(''), isdeletedbyowner: new FormControl(''), lazyLoad: new FormControl(''), loginclientId: new FormControl(''),
        logostatus: new FormControl(''), menucount: new FormControl(''), newPassword: new FormControl(''), nextlevelflag: new FormControl(''), noofdaysinactive: new FormControl(''),
        noofdaystoactive: new FormControl(''), password: new FormControl(''), payInWords: new FormControl(''), repname: new FormControl(''), resetPassword: new FormControl(''), startDate: new FormControl(''),
        status: new FormControl(''), t301accountAC: new FormControl(''), t302planAC: new FormControl(''), tablename: new FormControl(''), trackingcount: new FormControl(''), updatedTs: new FormControl(''),
        updatedby: new FormControl(''), user_name: new FormControl(''), year: new FormControl('')
      })
    })

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
      const formYear = this.apiControllerFormGroup.get('year')?.value;
      if (formYear && formYear !== this.selectedYear()) {
        this.selectedYear.set(formYear);
      }
    });

  }

  ngOnInit(): void {
    this.openLoading();
    this.getUser();
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

  async getUser() {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    this.fileStartDate = this.userProfifle.fileStartDate;
    this.fileEndDate = this.userProfifle.fileEndDate;
    this.dataasof = this.userProfifle.dataasof;
    this.carrierType = this.userProfifle.carrierType;
    await this.apiControllerFormGroup.patchValue({
      t001ClientProfile: {
        "action": this.userProfifle.action,
        "activeFlag": this.userProfifle.activeFlag,
        "address": this.userProfifle.address,
        "asonDate": this.userProfifle.asonDate,
        "carrierType": this.userProfifle.carrierType,
        "changePassword": this.userProfifle.changePassword,
        "charges": this.userProfifle.charges,
        "clientId": this.userProfifle.clientId,
        "clientName": this.userProfifle.clientName,
        "clientPassword": this.userProfifle.clientPassword,
        "clientdbstatus": this.userProfifle.clientdbstatus,
        "comments": this.userProfifle.comments,
        "contactNo": this.userProfifle.contactNo,
        "contractanalysisstatus": this.userProfifle.contractanalysisstatus,
        "createdBy": this.userProfifle.createdBy,
        "createdTs": this.userProfifle.createdTs,
        "currentDate": this.userProfifle.currentDate,
        "currentstatus": this.userProfifle.currentstatus,
        "customertype": this.userProfifle.customertype,
        "dataFileDestDir": this.userProfifle.dataFileDestDir,
        "dataFileSourceDir": this.userProfifle.dataFileSourceDir,
        "dataLoadBy": this.userProfifle.dataLoadBy,
        "dataSource": this.userProfifle.dataSource,
        "dataasof": this.userProfifle.dataasof,
        "daystoweb": this.userProfifle.daystoweb,
        "email": this.userProfifle.email,
        "employeeTempTotal": this.userProfifle.employeeTempTotal,
        "employerTempTotal": this.userProfifle.employerTempTotal,
        "errorString": this.userProfifle.errorString,
        "fetchPhoto": this.userProfifle.fetchPhoto,
        "fileEndDate": this.userProfifle.fileEndDate,
        "fileStartDate": this.userProfifle.fileStartDate,
        "getImageInd": this.userProfifle.getImageInd,
        "image": this.userProfifle.image,
        "ipaddress": this.userProfifle.ipaddress,
        "isSelected": this.userProfifle.isSelected,
        "isdeletedbyowner": this.userProfifle.isdeletedbyowner,
        "lazyLoad": this.userProfifle.lazyLoad,
        "loginclientId": this.userProfifle.loginclientId,
        "logostatus": this.userProfifle.logostatus,
        "menucount": this.userProfifle.menucount,
        "newPassword": this.userProfifle.newPassword,
        "nextlevelflag": this.userProfifle.nextlevelflag,
        "noofdaysinactive": this.userProfifle.noofdaysinactive,
        "noofdaystoactive": this.userProfifle.noofdaystoactive,
        "password": this.userProfifle.password,
        "payInWords": this.userProfifle.payInWords,
        "repname": this.userProfifle.repname,
        "resetPassword": this.userProfifle.resetPassword,
        "startDate": this.userProfifle.startDate,
        "status": this.userProfifle.status,
        "t301accountAC": this.userProfifle.t301accountAC,
        "t302planAC": this.userProfifle.t302planAC,
        "tablename": this.userProfifle.tablename,
        "trackingcount": this.userProfifle.trackingcount,
        "updatedTs": this.userProfifle.updatedTs,
        "updatedby": this.userProfifle.updatedby,
        "user_name": this.userProfifle.user_name,
        "year": this.userProfifle.year
      }
    });
    await this.fetchaccountDetailsUPS();

    var DateObj = new Date();
    if (DateObj.getMonth() == 0 || (DateObj.getMonth() == 1 && DateObj.getDate() <= 5)) {
      var displayYear = (DateObj.getFullYear() - 1) + "";
    }
    else {
      var displayYear = (DateObj.getFullYear()) + "";
    }

    await this.apiControllerFormGroup.get('year')?.setValue(displayYear);
    await this.apiControllerFormGroup.get('accNo')?.setValue(null);
    await this.apiControllerFormGroup.get('upsClientId')?.setValue(this.clientID);
    await this.fetchServiceLevelUsageSummary();
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }

  fetchaccountDetailsUPS(): void {
    // variable declaration
    const formValue: any = this.apiControllerFormGroup.value;
    this.httpClientService.fetchaccountDetailsUPS(formValue).subscribe({
      next: (result: any[]) => {
        this.account_details = result.map((item: any) => {
          const nickName: string =
            item.nickName?.trim()
              ? `${item.accountNo} - <span>${item.nickName}</span>`
              : item.accountNo;
          return {
            ...item,
            nickName: nickName
          };
        });
        this.apiControllerFormGroup.get('accNo')?.setValue(null);
      },
      error: (error: any) => {
        console.error('Error fetching UPS account details:', error);
      }
    });
  }

  /// UPS Fetch fetchServiceLevelUsageSummaryUPS API ///
  fetchServiceLevelUsageSummary(): void {
    this.httpClientService
      .fetchServiceLevelUsageSummary(this.apiControllerFormGroup.value)
      .subscribe({
        next: (result) => {
          const accNo = this.apiControllerFormGroup.get('accNo')?.value;

          if (!accNo || accNo === 'null' || accNo === this.clientID) {
            this.apiControllerFormGroup.get('accNo')?.setValue('null');
          }

          this.fullResultAc = result;
          this.fetchServiceLevelUsageSummaryData(result);
        },
        error: (err) => {
          console.error('Service level usage summary fetch failed:', err);
          this.closeLoading();
        }
      });
  }

  fetchServiceLevelUsageSummaryData(resultData: any[]): void {
    this.closeLoading();
    const dataLoadedType = this.apiControllerFormGroup.get('dataLoadedType')?.value;
    this.resultAC = resultData?.filter(d => d.dataLoadedType === dataLoadedType) ?? [];

    if (!resultData || resultData.length === 0) {
      this.openModal("No Record found for selected Client!");
      return;
    }

    this.dataSortField_name = "year";
    this.dataSortField_numeric = true;

    this.clearAlldata()
      .then(() => this.formYearMapFromResult())
      .then(() => this.formYearMapFromResultForAverage())
      .then(() => this.getYearAC())
      .then(() => this.getMonthAC())
      .then(() => this.getWeekAC())
      .then(() => {
        if (this.methodCall) {
          this.syncSelectionsAndRefresh();
          this.methodCall = false;
        } else {
          this.rdType_itemClickHandler();
        }
      })
      .catch(err => console.error("Error processing summary data:", err));

    this.cd.detectChanges();
  }

  async clearAlldata() {
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

  formYearMapFromResult(): void {
    for (const t006Obj of this.resultAC) {
      // Get existing year map or create a new one
      const valueMap: any = this.yearHashMap.get(t006Obj.year) ?? new Map<string, any>();
      // Add service level entry
      valueMap.set(t006Obj.serviceLevelDesc, t006Obj);

      // Update maps
      this.yearHashMap.set(t006Obj.year, valueMap);
      this.serviceLevelDescMap.set(t006Obj.serviceLevelDesc, t006Obj.sortOrder);
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

  formYearMapFromResultForAverage(): void {
    // Net Spend (FRT)
    const resultACNetSpend = this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Net Spend (FRT)');
    for (const t006Obj of resultACNetSpend) {
      const valueMap: any = this.yearHashMapNetSpend.get(t006Obj.year) ?? new Map<string, any>();
      valueMap.set(t006Obj.serviceLevelDesc, t006Obj);
      this.yearHashMapNetSpend.set(t006Obj.year, valueMap);
    }

    // Shipment Count
    const resultACCount = this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Shipment Count');
    for (const t006Obj of resultACCount) {
      const valueMap: any = this.yearHashMapCount.get(t006Obj.year) ?? new Map<string, any>();
      valueMap.set(t006Obj.serviceLevelDesc, t006Obj);
      this.yearHashMapCount.set(t006Obj.year, valueMap);
    }

    // Total Weight (Lbs)
    const resultACTotalWeight = this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Total Weight (Lbs)');
    for (const t006Obj of resultACTotalWeight) {
      const valueMap: any = this.yearHashMapTotalWeight.get(t006Obj.year) ?? new Map<string, any>();
      valueMap.set(t006Obj.serviceLevelDesc, t006Obj);
      this.yearHashMapTotalWeight.set(t006Obj.year, valueMap);
    }

    // Net Spend (FRT+ACC)
    const resultACNetSpendFrtAcc = this.fullResultAc.filter((d: any) => d.dataLoadedType === 'Net Spend (FRT+ACC)');
    for (const t006Obj of resultACNetSpendFrtAcc) {
      const valueMap: any = this.yearHashMapNetSpendFrtAcc.get(t006Obj.year) ?? new Map<string, any>();
      valueMap.set(t006Obj.serviceLevelDesc, t006Obj);
      this.yearHashMapNetSpendFrtAcc.set(t006Obj.year, valueMap);
    }
  }

  async getYearAC(): Promise<void> {

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
    const current = this.apiControllerFormGroup.get('year')?.value;
    if (!current || (years.length > 0 && !years.includes(current))) {
      const defaultYear = years.length ? years[years.length - 1] : '';
      this.apiControllerFormGroup.get('year')?.setValue(defaultYear);
      this.selectedYear.set(defaultYear);
      this.displayYear = defaultYear;
    }

    // Initialize selectedYearCheckboxes with the active year if empty
    const activeYear = this.apiControllerFormGroup.get('year')?.value;
    if (activeYear && this.selectedYearCheckboxes.size === 0) {
      this.selectedYearCheckboxes.add(activeYear);
      this.selectedYear.set(activeYear);
    }
  }

  async getMonthAC(): Promise<void> {
    const keyAC: any[] = [];
    let monthCount = 0;

    for (const [key, value] of this.yearHashMap) {
      const year_key = key;
      this.displayYear = this.apiControllerFormGroup.get('year')?.value;

      for (const [monthKey, monthValue] of this.monthMasterHm) {
        monthCount = monthCount + 1;
        const dataval = this.monthMasterHm.get(monthKey);
        // Check if this month belongs to the displayed year - all months should be checked by default for the displayed year
        if (year_key.toString() === this.displayYear) {
          this.monthAC.push({ Year: year_key, Month: dataval, Week: "", state: "checked", sortOrder: monthKey, sortMonth: monthCount });
        } else {
          this.monthAC.push({ Year: year_key, Month: dataval, Week: "", state: "unchecked", sortOrder: monthKey, sortMonth: monthCount });
        }
      }
    }
  }

  async getWeekAC() {
    let firstDate = 1;
    let keyAC: any[] = [];
    let month = 0;
    const DateObj = new Date();

    // derive which year should have its weeks pre‑checked.  the old
    // implementation computed this based on the *current date*; instead we
    // prefer the selected year so that changing the dropdown keeps the
    // weeks in sync.
    const targetYear = this.apiControllerFormGroup.get('year')?.value ||
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

  rdType_itemClickHandler(): void {
    const monthHashMap = new Map();
    this.previousSelectedYear = this.displayYear;
    const displayYear = this.apiControllerFormGroup.get('year')?.value;
    const itemHashMap = new Map();
    //this.resettingAdvanceDataGrid();
    this.rdbtn_val = this.apiControllerFormGroup.get('searchcriteriabtn')?.value;
    if (this.rdbtn_val === "year") {
      this.gridColumn = "Year";
      this.costOptYear = "2017";
      if (this.yearAC && this.yearAC.length > 0) {
        for (const tempObj of this.yearAC) {
          (tempObj as any)["state"] = "checked";
        }
      }
      this.formDataGridYearData(this.yearHashMap);
      this.formGridColumn(this.yearHashMap, null, null);
      this.myADG = this.yearGC;
      //this.selectedChange(this.service.array);
    }
    if (this.rdbtn_val === "month") {
      this.gridColumn = "Month";
      this.formMonthMapFromResult(displayYear);
      this.formMonthMapFromResultForAverage(displayYear);
      this.formDataGridMonthData(this.monthHashMap);
      this.monthGC = this.monthAC;
      for (let loop = 0; loop < 12; loop++) {
        const mntn = `${this.monthMasterHm.get(loop)} ${this.displayYear}`;
        this.monthMasterHm_temp.set(loop.toString(), mntn);
      }
      this.formGridColumn(this.monthHashMap, null, this.monthMasterHm_temp);
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

      // Fix: populate tempWeekIdArr before calling grid functions
      const weeksForYear = this.weekAC.filter(w => String(w.Year) === String(this.displayYear));
      this.tempWeekIdArr = weeksForYear.map((w, i) => ({
        weekindex: w.state === 'checked' ? i : null,
        week: w.Week,
        weekstate: w.state
      }));

      // Setting Week Map
      const arr: any[] = [];
      this.formGridColumn(itemHashMap, weekItemAC, null);
      this.formDataGridWeekData(this.displayYear, arr);
      this.myADG = this.weekGC;
    }
  }

  resettingAdvanceDataGrid(): void {
    const dataGrid_columns: any[] = [];
    this.rdbtn_val = this.apiControllerFormGroup.get('searchcriteriabtn')?.value;
    if (this.rdbtn_val === "year") {
      if (this.yearAC != null) {
        this.yearGC = [];
        this.yearGC = this.yearAC;
      }
    }
    if (this.rdbtn_val === "month") {
      if (this.monthAC != null) {
        this.monthAC = this.settingCurrentStatechecked(this.monthAC, this.displayYear);
        this.monthGC = this.monthAC;
      }
    }
    if (this.rdbtn_val === "week") {
      if (this.weekAC !== undefined) {
        this.weekAC = this.settingCurrentStatechecked(this.weekAC, this.displayYear);
        this.weekGC = this.weekAC;
      }
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

  formDataGridYearData(inputyearHashMap: Map<string, Map<string, any>>): void {
    this.dpAC = [];

    let totalGroundCommercial = 0;
    let totalGroundResidential = 0;
    let totalGroundReturns = 0;
    let totalGroundHundredweight = 0;
    let totalGroundFreightPricing = 0;
    let totalSurePost1LBorGreater = 0;
    let totalSurePostLessthan1LB = 0;
    let totalNextDayAirAM = 0;
    let totalNextDayAir = 0;
    let totalNextDayAirSaver = 0;
    let total2DayAM = 0;
    let total2DAY = 0;
    let total3Day = 0;
    let totalWorldwideExpressPlus = 0;
    let totalWorldwideExpress = 0;
    let totalWorldwideSaver = 0;
    let totalWorldwideExpedited = 0;
    let totalStandardToCanada = 0;

    const arrayLoop: { key: string }[] = [];
    for (const [key] of this.serviceLevelDescMap) {
      arrayLoop.push({ key });
    }

    for (let loop = 0; loop < this.serviceLevelDescMap.size; loop++) {
      const costObj: any = {};
      const serviceDescVal = arrayLoop[loop];
      const serviceDesc = serviceDescVal.key;

      costObj["servicedesc"] = serviceDesc;

      const yearArray = inputyearHashMap.keys();
      const yearArrSize = inputyearHashMap.size;
      const yearArr: IteratorResult<string>[] = [];

      for (let yearCnt = 0; yearCnt < yearArrSize; yearCnt++) {
        yearArr.push(yearArray.next());
      }

      const dataLoadedType = this.apiControllerFormGroup.get('dataLoadedType')?.value;

      for (let valueCount = 0; valueCount < yearArrSize; valueCount++) {
        const yearVal = String(yearArr[valueCount].value);
        const valueMap = this.yearHashMap.get(yearVal);

        if (valueMap?.get(serviceDesc) != null) {
          let value = 0;
          this.t006Obj = valueMap.get(serviceDesc);

          // Assign yearAvg to value0..value10 depending on index
          costObj[`value${valueCount}`] = Number(this.t006Obj.yearAvg);

          // Totals by serviceLevelDesc
          if (this.t006Obj.serviceLevelDesc === "Ground Commercial") {
            value = Number(this.t006Obj.yearAvg);
            totalGroundCommercial += value;
            costObj["total"] = totalGroundCommercial;
          } else if (this.t006Obj.serviceLevelDesc === "Ground Residential") {
            value = Number(this.t006Obj.yearAvg);
            totalGroundResidential += value;
            costObj["total"] = totalGroundResidential;
          } else if (this.t006Obj.serviceLevelDesc === "Ground Returns") {
            value = Number(this.t006Obj.yearAvg);
            totalGroundReturns += value;
            costObj["total"] = totalGroundReturns;
          } else if (this.t006Obj.serviceLevelDesc === "Ground Hundredweight") {
            value = Number(this.t006Obj.yearAvg);
            totalGroundHundredweight += value;
            costObj["total"] = totalGroundHundredweight;
          } else if (this.t006Obj.serviceLevelDesc === "Ground (Freight Pricing)") {
            value = Number(this.t006Obj.yearAvg);
            totalGroundFreightPricing += value;
            costObj["total"] = totalGroundFreightPricing;
          } else if (this.t006Obj.serviceLevelDesc === "SurePost 1LB or Greater" || this.t006Obj.serviceLevelDesc === "Ground Saver 1LB or Greater") {
            value = Number(this.t006Obj.yearAvg);
            totalSurePost1LBorGreater += value;
            costObj["total"] = totalSurePost1LBorGreater;
          } else if (this.t006Obj.serviceLevelDesc === "SurePost Less Than 1LB (Oz)" || this.t006Obj.serviceLevelDesc === "Ground Saver Less than 1LB (Oz)") {
            value = Number(this.t006Obj.yearAvg);
            totalSurePostLessthan1LB += value;
            costObj["total"] = totalSurePostLessthan1LB;
          } else if (this.t006Obj.serviceLevelDesc === "Next Day Air AM") {
            value = Number(this.t006Obj.yearAvg);
            totalNextDayAirAM += value;
            costObj["total"] = totalNextDayAirAM;
          } else if (this.t006Obj.serviceLevelDesc === "Next Day Air") {
            value = Number(this.t006Obj.yearAvg);
            totalNextDayAir += value;
            costObj["total"] = totalNextDayAir;
          } else if (this.t006Obj.serviceLevelDesc === "Next Day Air Saver") {
            value = Number(this.t006Obj.yearAvg);
            totalNextDayAirSaver += value;
            costObj["total"] = totalNextDayAirSaver;
          } else if (this.t006Obj.serviceLevelDesc === "2 Day AM") {
            value = Number(this.t006Obj.yearAvg);
            total2DayAM += value;
            costObj["total"] = total2DayAM;
          } else if (this.t006Obj.serviceLevelDesc === "2 Day") {
            value = Number(this.t006Obj.yearAvg);
            total2DAY += value;
            costObj["total"] = total2DAY;
          } else if (this.t006Obj.serviceLevelDesc === "3 Day") {
            value = Number(this.t006Obj.yearAvg);
            total3Day += value;
            costObj["total"] = total3Day;
          } else if (this.t006Obj.serviceLevelDesc === "Worldwide Express Plus") {
            value = Number(this.t006Obj.yearAvg);
            totalWorldwideExpressPlus += value;
            costObj["total"] = totalWorldwideExpressPlus;
          } else if (this.t006Obj.serviceLevelDesc === "Worldwide Express") {
            value = Number(this.t006Obj.yearAvg);
            totalWorldwideExpress += value;
            costObj["total"] = totalWorldwideExpress;
          } else if (this.t006Obj.serviceLevelDesc === "Worldwide Saver") {
            value = Number(this.t006Obj.yearAvg);
            totalWorldwideSaver += value;
            costObj["total"] = totalWorldwideSaver;
          } else if (this.t006Obj.serviceLevelDesc === "Worldwide Expedited") {
            value = Number(this.t006Obj.yearAvg);
            totalWorldwideExpedited += value;
            costObj["total"] = totalWorldwideExpedited;
          } else if (this.t006Obj.serviceLevelDesc === "Standard") {
            value = Number(this.t006Obj.yearAvg);
            totalStandardToCanada += value;
            costObj["total"] = totalStandardToCanada;
          }

          // Special case for Average Cost/Weight
          if (dataLoadedType === 'Average Cost (FRT)' ||
            dataLoadedType === 'Average Weight (Lbs)' ||
            dataLoadedType === 'Average Cost (FRT+ACC)') {
            const value1 = this.summingthevalues(valueMap.get(serviceDesc), yearArr, serviceDesc, 'year');
            costObj["total"] = Number(value1);
          }

          costObj["category"] = this.t006Obj.serviceLevelGroup;
        }
      }

      this.dpAC.push(costObj);
    }
    console.log("Year DP: ", this.dpAC);
  }

  summingthevalues(t006Obj: any, yearArr: any, serviceDesc: string, type: string): number {
    let value = 0;
    let divideBy = 0;
    const dataLoadedType = this.apiControllerFormGroup.get('dataLoadedType')?.value;

    if (type === "month") {
      if (dataLoadedType === "Average Cost (FRT)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          const monthVal = String(yearArr[valueCount].value);
          const monthObjNetSpend = this.monthHashMapNetSpend.get(monthVal)?.get(serviceDesc);
          const monthObjCount = this.monthHashMapCount.get(monthVal)?.get(serviceDesc);

          if (monthObjNetSpend != null) value += Number(monthObjNetSpend);
          if (monthObjCount != null) divideBy += Number(monthObjCount);
        }
        if (divideBy !== 0) value /= divideBy;
      } else if (dataLoadedType === "Average Weight (Lbs)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          const monthVal = String(yearArr[valueCount].value);

          if (this.monthHashMapTotalWeight.size > 0) {
            const monthObjTotalWeight = this.monthHashMapTotalWeight.get(monthVal)?.get(serviceDesc);
            const monthObjCount = this.monthHashMapCount.get(monthVal)?.get(serviceDesc);

            if (monthObjTotalWeight != null) value += Number(monthObjTotalWeight);
            if (monthObjCount != null) divideBy += Number(monthObjCount);
          } else {
            const monthObj = this.monthHashMap.get(monthVal)?.get(serviceDesc);
            if (monthObj != null) {
              if (Number(monthObj) !== 0) divideBy += 1;
              value += Number(monthObj);
            }
          }
        }
        if (divideBy !== 0) value /= divideBy;
      } else if (dataLoadedType === "Average Cost (FRT+ACC)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          const monthVal = String(yearArr[valueCount].value);
          const monthObjNetSpendFrtAcc = this.monthHashMapNetSpendFrtAcc.get(monthVal)?.get(serviceDesc);
          const monthObjCountFrtAcc = this.monthHashMapCountFrtAcc.get(monthVal)?.get(serviceDesc);

          if (monthObjNetSpendFrtAcc != null) value += Number(monthObjNetSpendFrtAcc);
          if (monthObjCountFrtAcc != null) divideBy += Number(monthObjCountFrtAcc);
        }
        if (divideBy !== 0) value /= divideBy;
      }
    } else if (type === "year") {
      if (dataLoadedType === "Average Cost (FRT)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          const yearVal = String(yearArr[valueCount].value);
          const yearObjNetSpend = this.yearHashMapNetSpend.get(yearVal)?.get(serviceDesc);
          const yearObjCount = this.yearHashMapCount.get(yearVal)?.get(serviceDesc);

          if (yearObjNetSpend != null) value += Number(yearObjNetSpend.yearAvg);
          if (yearObjCount != null) divideBy += Number(yearObjCount.yearAvg);
        }
        if (divideBy !== 0) value /= divideBy;
      } else if (dataLoadedType === "Average Weight (Lbs)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          const yearVal = String(yearArr[valueCount].value);

          if (this.yearHashMapTotalWeight.size > 0) {
            const yearObjTotalWeight = this.yearHashMapTotalWeight.get(yearVal)?.get(serviceDesc);
            const yearObjCount = this.yearHashMapCount.get(yearVal)?.get(serviceDesc);

            if (yearObjTotalWeight != null) value += Number(yearObjTotalWeight.yearAvg);
            if (yearObjCount != null) divideBy += Number(yearObjCount.yearAvg);
          } else {
            const yearObj = this.yearHashMap.get(yearVal)?.get(serviceDesc);
            if (yearObj != null) {
              if (Number(yearObj.yearAvg) !== 0) divideBy += 1;
              value += Number(yearObj.yearAvg);
            }
          }
        }
        if (divideBy !== 0) value /= divideBy;
      } else if (dataLoadedType === "Average Cost (FRT+ACC)") {
        for (let valueCount = 0; valueCount < yearArr.length; valueCount++) {
          const yearVal = String(yearArr[valueCount].value);
          const yearObjNetSpendFrtAcc = this.yearHashMapNetSpendFrtAcc.get(yearVal)?.get(serviceDesc);
          const yearObjCountFrtAcc = this.yearHashMapCountFrtAcc.get(yearVal)?.get(serviceDesc);

          if (yearObjNetSpendFrtAcc != null) value += Number(yearObjNetSpendFrtAcc.yearAvg);
          if (yearObjCountFrtAcc != null) divideBy += Number(yearObjCountFrtAcc.yearAvg);
        }
        if (divideBy !== 0) value /= divideBy;
      }
    } else if (type === "week") {
      if (dataLoadedType === "Average Cost (FRT)") {
        for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
          if (this.tempWeekIdArr[cnt].weekindex != null) {
            const yearVal = String(yearArr);
            if (this.yearHashMapTotalWeight.size > 0) {
              const yearObjNetSpend = this.yearHashMapNetSpend.get(yearVal)?.get(serviceDesc);
              const yearObjCount = this.yearHashMapCount.get(yearVal)?.get(serviceDesc);

              if (yearObjNetSpend != null) value += Number(yearObjNetSpend[`w${cnt + 1}`]);
              if (yearObjCount != null) divideBy += Number(yearObjCount[`w${cnt + 1}`]);
            } else {
              const yearObj = this.yearHashMap.get(yearVal)?.get(serviceDesc);
              if (yearObj != null) {
                if (Number(yearObj[`w${cnt + 1}`]) !== 0) divideBy += 1;
                value += Number(yearObj[`w${cnt + 1}`]);
              }
            }
          }
        }
        if (divideBy !== 0) value /= divideBy;
      } else if (dataLoadedType === "Average Weight (Lbs)") {
        for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
          if (this.tempWeekIdArr[cnt].weekindex != null) {
            const yearVal = String(yearArr);
            const yearObjTotalWeight = this.yearHashMapTotalWeight.get(yearVal)?.get(serviceDesc);
            const yearObjCount = this.yearHashMapCount.get(yearVal)?.get(serviceDesc);

            if (yearObjTotalWeight != null) value += Number(yearObjTotalWeight[`w${cnt + 1}`]);
            if (yearObjCount != null) divideBy += Number(yearObjCount[`w${cnt + 1}`]);
          }
        }
        if (divideBy !== 0) value /= divideBy;
      } else if (dataLoadedType === "Average Cost (FRT+ACC)") {
        for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
          if (this.tempWeekIdArr[cnt].weekindex != null) {
            const yearVal = String(yearArr);
            if (this.yearHashMapTotalWeight.size > 0) {
              const yearObjNetSpendFrtAcc = this.yearHashMapNetSpendFrtAcc.get(yearVal)?.get(serviceDesc);
              const yearObjCountFrtAcc = this.yearHashMapCountFrtAcc.get(yearVal)?.get(serviceDesc);

              if (yearObjNetSpendFrtAcc != null) value += Number(yearObjNetSpendFrtAcc[`w${cnt + 1}`]);
              if (yearObjCountFrtAcc != null) divideBy += Number(yearObjCountFrtAcc[`w${cnt + 1}`]);
            } else {
              const yearObj = this.yearHashMap.get(yearVal)?.get(serviceDesc);
              if (yearObj != null) {
                if (Number(yearObj[`w${cnt + 1}`]) !== 0) divideBy += 1;
                value += Number(yearObj[`w${cnt + 1}`]);
              }
            }
          }
        }
        if (divideBy !== 0) value /= divideBy;
      }
    }

    return value;
  }

  formGridColumn(inputColumnArray: any, allColumnArray: any, masterMap: any): void {
    this.countOfActualArr += 1;

    if (this.countOfActualArr === 1 && allColumnArray != null) {
      for (let ploop = 0; ploop < allColumnArray.length; ploop++) {
        const dgcAll: any = {};
        dgcAll["headerText"] = allColumnArray[ploop];
        dgcAll["dataField"] = "value" + ploop;
        this.colsActual.push(dgcAll);
      }
    }

    let cols: any[] = [];
    const dgc: any = {};

    dgc["headerText"] = "Service Level";
    dgc["dataField"] = "servicedesc";
    dgc["width"] = 235;
    cols.push(dgc);

    if (this.rdbtn_val === "week") {
      let visibleBoolean = true;
      const dgcTotal: any = {};
      dgcTotal["headerText"] = "TOTAL";
      dgcTotal["dataField"] = "total";

      if (inputColumnArray.size === 0) visibleBoolean = false;
      if (visibleBoolean) cols.push(dgcTotal);
    }

    if (this.rdbtn_val !== "week") {
      const dgcTotal: any = {};
      dgcTotal["headerText"] = "TOTAL";
      dgcTotal["dataField"] = "total";
      cols.push(dgcTotal);
    }

    if (this.rdbtn_val === "week") {
      const arrData: any[] = [];
      const yearArray = inputColumnArray.keys();
      for (let yearCnt = 0; yearCnt < inputColumnArray.size; yearCnt++) {
        arrData.push(yearArray.next());
      }

      for (let ploop = 0; ploop < this.tempWeekIdArr.length; ploop++) {
        const dgcWeek: any = {};
        if (this.tempWeekIdArr[ploop].weekindex != null) {
          dgcWeek["headerText"] = this.tempWeekIdArr[ploop].week;
          dgcWeek["dataField"] = "value" + ploop;
          cols.push(dgcWeek);
        }
      }
    } else {
      const yearArray = inputColumnArray.keys();
      const arrData: any[] = [];
      for (let yearCnt = 0; yearCnt < inputColumnArray.size; yearCnt++) {
        arrData.push(yearArray.next());
      }

      for (let loop = 0; loop < inputColumnArray.size; loop++) {
        const dgcYear: any = {};
        const arrVal = String(arrData[loop].value);

        if (masterMap != null) {
          dgcYear["headerText"] = masterMap.get(loop.toString());
        } else {
          dgcYear["headerText"] = arrVal;
        }

        dgcYear["dataField"] = "value" + loop;
        cols.push(dgcYear);
      }
    }

    this.dataGrid_columns = cols;
    console.log("Columns formed:", this.dataGrid_columns);
    this.cd.detectChanges();
  }

  formMonthMapFromResult(selectedYear: string | number): void {
    const costOptYear = selectedYear;

    let totalGroundCommercial = 0;
    let totalGroundResidential = 0;
    let totalGroundReturns = 0;
    let totalGroundHundredweight = 0;
    let totalGroundFreightPricing = 0;
    let totalSurePost1LBorGreater = 0;
    let totalSurePostLessthan1LB = 0;
    let totalNextDayAirAM = 0;
    let totalNextDayAir = 0;
    let totalNextDayAirSaver = 0;
    let total2DayAM = 0;
    let total2DAY = 0;
    let total3Day = 0;
    let totalWorldwideExpressPlus = 0;
    let totalWorldwideExpress = 0;
    let totalWorldwideSaver = 0;
    let totalWorldwideExpedited = 0;
    let totalStandardToCanada = 0;

    const monthHm = this.yearHashMapObj.get(selectedYear.toString());
    let divideBy = 0;

    for (let loop = 0; loop < this.resultAC.length; loop++) {
      const costObj: any = {};
      const testObj = this.resultAC[loop];

      if (testObj.year !== selectedYear) continue;

      for (let monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        const monthValue = String(monthLoop);
        let valueForMonth = 0;
        divideBy = 0;

        // Month value assignment (jan..dec)
        switch (monthLoop) {
          case 0: valueForMonth = Number(testObj.jan); break;
          case 1: valueForMonth = Number(testObj.feb); break;
          case 2: valueForMonth = Number(testObj.mar); break;
          case 3: valueForMonth = Number(testObj.apr); break;
          case 4: valueForMonth = Number(testObj.may); break;
          case 5: valueForMonth = Number(testObj.jun); break;
          case 6: valueForMonth = Number(testObj.jul); break;
          case 7: valueForMonth = Number(testObj.aug); break;
          case 8: valueForMonth = Number(testObj.sep); break;
          case 9: valueForMonth = Number(testObj.oct); break;
          case 10: valueForMonth = Number(testObj.nov); break;
          case 11: valueForMonth = Number(testObj.dec); break;
        }

        // Totals by serviceLevelDesc
        if (testObj.serviceLevelDesc === "Ground Commercial") {
          costObj["total"] = String(totalGroundCommercial);
        } else if (testObj.serviceLevelDesc === "Ground Residential") {
          costObj["total"] = String(totalGroundResidential);
        } else if (testObj.serviceLevelDesc === "Ground Returns") {
          costObj["total"] = this.set2dpforPrice(String(totalGroundReturns));
        } else if (testObj.serviceLevelDesc === "Ground Hundredweight") {
          costObj["total"] = this.set2dpforPrice(String(totalGroundHundredweight));
        } else if (testObj.serviceLevelDesc === "Ground (Freight Pricing)") {
          costObj["total"] = this.set2dpforPrice(String(totalGroundFreightPricing));
        } else if (testObj.serviceLevelDesc === "SurePost 1LB or Greater" || testObj.serviceLevelDesc === "Ground Saver 1LB or Greater") {
          costObj["total"] = this.set2dpforPrice(String(totalSurePost1LBorGreater));
        } else if (testObj.serviceLevelDesc === "SurePost Less Than 1LB (Oz)" || testObj.serviceLevelDesc === "Ground Saver Less than 1LB (Oz)") {
          costObj["total"] = this.set2dpforPrice(String(totalSurePostLessthan1LB));
        } else if (testObj.serviceLevelDesc === "Next Day Air AM") {
          costObj["total"] = this.set2dpforPrice(String(totalNextDayAirAM));
        } else if (testObj.serviceLevelDesc === "Next Day Air") {
          costObj["total"] = this.set2dpforPrice(String(totalNextDayAir));
        } else if (testObj.serviceLevelDesc === "Next Day Air Saver") {
          costObj["total"] = this.set2dpforPrice(String(totalNextDayAirSaver));
        } else if (testObj.serviceLevelDesc === "2 Day AM") {
          costObj["total"] = this.set2dpforPrice(String(total2DayAM));
        } else if (testObj.serviceLevelDesc === "2 Day") {
          costObj["total"] = this.set2dpforPrice(String(total2DAY));
        } else if (testObj.serviceLevelDesc === "3 Day") {
          costObj["total"] = this.set2dpforPrice(String(total3Day));
        } else if (testObj.serviceLevelDesc === "Worldwide Express Plus") {
          costObj["total"] = this.set2dpforPrice(String(totalWorldwideExpressPlus));
        } else if (testObj.serviceLevelDesc === "Worldwide Express") {
          costObj["total"] = this.set2dpforPrice(String(totalWorldwideExpress));
        } else if (testObj.serviceLevelDesc === "Worldwide Saver") {
          costObj["total"] = this.set2dpforPrice(String(totalWorldwideSaver));
        } else if (testObj.serviceLevelDesc === "Worldwide Expedited") {
          costObj["total"] = this.set2dpforPrice(String(totalWorldwideExpedited));
        } else if (testObj.serviceLevelDesc === "Standard") {
          costObj["total"] = this.set2dpforPrice(String(totalStandardToCanada));
        }

        // ValueMap handling
        let valueMap: Map<string, number>;
        if (this.monthHashMap.has(monthValue)) {
          valueMap = this.monthHashMap.get(monthValue)!;
          valueMap.delete(testObj.serviceLevelDesc);
        } else {
          valueMap = new Map();
        }

        valueMap.set(testObj.serviceLevelDesc, valueForMonth);
        this.monthHashMap.set(monthValue, valueMap);
      }
    }
    console.log("Month HashMap: ", this.monthHashMap);
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

  formMonthMapFromResultForAverage(selectedYear: string | number): void {
    const monthHm = this.yearHashMapObj.get(selectedYear.toString());

    // Net Spend (FRT)
    const resultACNetSpend = this.fullResultAc.filter((d: any) => d.dataLoadedType === "Net Spend (FRT)");
    for (const testObj of resultACNetSpend) {
      if (testObj.year !== selectedYear) continue;

      for (let monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        const monthValue = String(monthLoop);
        let valueForMonth = 0;

        switch (monthLoop) {
          case 0: valueForMonth = Number(testObj.jan); break;
          case 1: valueForMonth = Number(testObj.feb); break;
          case 2: valueForMonth = Number(testObj.mar); break;
          case 3: valueForMonth = Number(testObj.apr); break;
          case 4: valueForMonth = Number(testObj.may); break;
          case 5: valueForMonth = Number(testObj.jun); break;
          case 6: valueForMonth = Number(testObj.jul); break;
          case 7: valueForMonth = Number(testObj.aug); break;
          case 8: valueForMonth = Number(testObj.sep); break;
          case 9: valueForMonth = Number(testObj.oct); break;
          case 10: valueForMonth = Number(testObj.nov); break;
          case 11: valueForMonth = Number(testObj.dec); break;
        }

        let valueMap = this.monthHashMapNetSpend.get(monthValue) ?? new Map();
        valueMap.delete(testObj.serviceLevelDesc);
        valueMap.set(testObj.serviceLevelDesc, valueForMonth);
        this.monthHashMapNetSpend.set(monthValue, valueMap);
      }
    }

    // Shipment Count
    const resultACCount = this.fullResultAc.filter((d: any) => d.dataLoadedType === "Shipment Count");
    for (const testObj of resultACCount) {
      if (testObj.year !== selectedYear) continue;

      for (let monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        const monthValue = String(monthLoop);
        let valueForMonth = 0;

        switch (monthLoop) {
          case 0: valueForMonth = Number(testObj.jan); break;
          case 1: valueForMonth = Number(testObj.feb); break;
          case 2: valueForMonth = Number(testObj.mar); break;
          case 3: valueForMonth = Number(testObj.apr); break;
          case 4: valueForMonth = Number(testObj.may); break;
          case 5: valueForMonth = Number(testObj.jun); break;
          case 6: valueForMonth = Number(testObj.jul); break;
          case 7: valueForMonth = Number(testObj.aug); break;
          case 8: valueForMonth = Number(testObj.sep); break;
          case 9: valueForMonth = Number(testObj.oct); break;
          case 10: valueForMonth = Number(testObj.nov); break;
          case 11: valueForMonth = Number(testObj.dec); break;
        }

        let valueMap = this.monthHashMapCount.get(monthValue) ?? new Map();
        valueMap.delete(testObj.serviceLevelDesc);
        valueMap.set(testObj.serviceLevelDesc, valueForMonth);
        this.monthHashMapCount.set(monthValue, valueMap);
      }
    }

    // Total Weight (Lbs)
    const resultACTotalWeight = this.fullResultAc.filter((d: any) => d.dataLoadedType === "Total Weight (Lbs)");
    for (const testObj of resultACTotalWeight) {
      if (testObj.year !== selectedYear) continue;

      for (let monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        const monthValue = String(monthLoop);
        let valueForMonth = 0;

        switch (monthLoop) {
          case 0: valueForMonth = Number(testObj.jan); break;
          case 1: valueForMonth = Number(testObj.feb); break;
          case 2: valueForMonth = Number(testObj.mar); break;
          case 3: valueForMonth = Number(testObj.apr); break;
          case 4: valueForMonth = Number(testObj.may); break;
          case 5: valueForMonth = Number(testObj.jun); break;
          case 6: valueForMonth = Number(testObj.jul); break;
          case 7: valueForMonth = Number(testObj.aug); break;
          case 8: valueForMonth = Number(testObj.sep); break;
          case 9: valueForMonth = Number(testObj.oct); break;
          case 10: valueForMonth = Number(testObj.nov); break;
          case 11: valueForMonth = Number(testObj.dec); break;
        }

        let valueMap = this.monthHashMapTotalWeight.get(monthValue) ?? new Map();
        valueMap.delete(testObj.serviceLevelDesc);
        valueMap.set(testObj.serviceLevelDesc, valueForMonth);
        this.monthHashMapTotalWeight.set(monthValue, valueMap);
      }
    }

    // Net Spend (FRT+ACC)
    const resultACNetSpendFrtAcc = this.fullResultAc.filter((d: any) => d.dataLoadedType === "Net Spend (FRT+ACC)");
    const monthHmFrtAcc = this.yearHashMapNetSpendFrtAcc.get(selectedYear);
    for (const testObj of resultACNetSpendFrtAcc) {
      if (testObj.year !== selectedYear) continue;

      for (let monthLoop = 0; monthLoop < monthHmFrtAcc.size; monthLoop++) {
        const monthValue = String(monthLoop);
        let valueForMonth = 0;

        switch (monthLoop) {
          case 0: valueForMonth = Number(testObj.jan); break;
          case 1: valueForMonth = Number(testObj.feb); break;
          case 2: valueForMonth = Number(testObj.mar); break;
          case 3: valueForMonth = Number(testObj.apr); break;
          case 4: valueForMonth = Number(testObj.may); break;
          case 5: valueForMonth = Number(testObj.jun); break;
          case 6: valueForMonth = Number(testObj.jul); break;
          case 7: valueForMonth = Number(testObj.aug); break;
          case 8: valueForMonth = Number(testObj.sep); break;
          case 9: valueForMonth = Number(testObj.oct); break;
          case 10: valueForMonth = Number(testObj.nov); break;
          case 11: valueForMonth = Number(testObj.dec); break;
        }

        let valueMap = this.monthHashMapNetSpendFrtAcc.get(monthValue) ?? new Map();
        valueMap.delete(testObj.serviceLevelDesc);
        valueMap.set(testObj.serviceLevelDesc, valueForMonth);
        this.monthHashMapNetSpendFrtAcc.set(monthValue, valueMap);
      }
    }
    console.log("Month HashMaps for Average: ", {
      monthHashMapNetSpend: this.monthHashMapNetSpend,
      monthHashMapCount: this.monthHashMapCount,
      monthHashMapTotalWeight: this.monthHashMapTotalWeight,
      monthHashMapNetSpendFrtAcc: this.monthHashMapNetSpendFrtAcc
    });
  }

  formDataGridMonthData(inputMonthHm: Map<string, Map<string, any>>): void {
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
      var dataLoadedType = this.apiControllerFormGroup.get('dataLoadedType')?.value;
      for (var valueCount = 0; valueCount < monthArray1; valueCount++) {
        var monthVal = monthArr[valueCount].value + "";
        var valueMap = this.monthHashMap.get(monthVal + "");
        var displayYear = this.apiControllerFormGroup.get('year')?.value;
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


            if (dataLoadedType == 'Shipment Count' || dataLoadedType == 'Net Spend (FRT)') {
              totalMonth = value + totalMonth;
              costObj["total"] = Number(totalMonth);
            }
            else {
              var value1 = this.summingthevalues(valueMap.get(serviceDesc), monthArr, serviceDesc, 'month');
              costObj["total"] = Number(value1);
            }


            costObj["category"] = (valueMap1.get(serviceDesc)).serviceLevelGroup;
          }
        }

      }


      this.dpAC.push(costObj);
    }
    console.log("MonthAC" + " DP: ", this.dpAC);

  }

  formDataGridWeekData(selectedYear: string | number, selectitem: any[]): void {
    this.costOptYear = selectedYear;
    this.dpAC = [];
    if (!selectitem || selectitem.length === 0) return;

    const arrayLoop: { key: string }[] = [];
    for (const [key] of this.serviceLevelDescMap) {
      arrayLoop.push({ key });
    }

    const dataLoadedType = this.apiControllerFormGroup.get("dataLoadedType")?.value;

    for (let loop = 0; loop < this.serviceLevelDescMap.size; loop++) {
      const costObj: any = {};
      const serviceDescVal = arrayLoop[loop];
      const serviceDesc = serviceDescVal.key;

      costObj["servicedesc"] = serviceDesc;
      costObj["sortOrder"] = this.serviceLevelDescMap.get(serviceDesc);

      const valueMap = this.yearHashMap.get(selectedYear);

      if (valueMap?.get(serviceDesc) != null) {
        // Assign weekly values dynamically
        for (let i = 0; i < this.tempWeekIdArr.length; i++) {
          if (this.tempWeekIdArr[i].weekindex != null) {
            costObj[`value${i}`] = Number((valueMap.get(serviceDesc))[`w${i + 1}`]);
          }
        }

        let totalWeek = 0;

        if (selectitem.length === 0) {
          // Sum all weeks when no specific selection
          for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
            if (this.tempWeekIdArr[i].weekstate === 'checked') {
              totalWeek += Number(this.removeCommas(costObj[`value${i}`]));
            }
          }

          if (dataLoadedType === "Shipment Count" || dataLoadedType === "Net Spend (FRT)") {
            costObj["total"] = Number(totalWeek);
          } else {
            costObj["total"] = Number((valueMap.get(serviceDesc)).yearAvg);
          }

          costObj["category"] = (valueMap.get(serviceDesc)).serviceLevelGroup;
        } else {
          // Sum only selected weeks
          for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
            if (this.tempWeekIdArr[cnt].weekindex != null) {
              totalWeek += Number(this.removeCommas(costObj[`value${cnt}`]));
            }
          }

          if (dataLoadedType === "Shipment Count" || dataLoadedType === "Net Spend (FRT)") {
            costObj["total"] = Number(totalWeek);
          } else {
            const value1 = this.summingthevalues(valueMap.get(serviceDesc), selectedYear, serviceDesc, "week");
            costObj["total"] = Number(value1);
          }

          costObj["category"] = (valueMap.get(serviceDesc)).serviceLevelGroup;
        }
      }

      this.dpAC.push(costObj);
    }
    console.log("week" + selectedYear + " DP: ", this.dpAC);
  }

  getExcelFormattedValue(value: any): string {
    const numericValue = Number(value);

    let dataLoadedType: string | null = null;
    dataLoadedType = this.apiControllerFormGroup.get("dataLoadedType")?.value;

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

  async account_clickHandler() {
    this.openLoading();
    var accNo = this.apiControllerFormGroup.get('accNo')?.value;

    if (accNo == "null") {
      await this.apiControllerFormGroup.get('accNo')?.setValue(null);
    } else {
      await this.apiControllerFormGroup.get('accNo')?.setValue(accNo);
    }
    this.methodCall = true;
    await this.fetchServiceLevelUsageSummary();
  }

  async changeDataloadedType() {
    this.openLoading();
    this.methodCall = true;
    await this.fetchServiceLevelUsageSummaryData(this.fullResultAc);
  }

  async checkTree() {
    var nodeVal = await this.treeFormGroup.get('children')?.value;
    await this.apiControllerFormGroup.get('searchcriteriabtn')?.setValue(nodeVal);
    if (nodeVal == "year") {
      await this.rdType_itemClickHandler();
    }
    if (nodeVal == "month") {
      await this.rdType_itemClickHandler();
    }
    if (nodeVal == "week") {
      await this.rdType_itemClickHandler();
    }
  }

  myADG_itemClickHandler(event: any[]): void {
    if (!event) return;

    const rdbtn_Select = this.treeFormGroup.get('children')?.value;
    const yeardata = this.apiControllerFormGroup.get('year')?.value || null;

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

      this.formGridColumn(this.itemHashMap, null, null);
      this.formDataGridYearData(this.itemHashMap);
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
        this.formGridColumn(this.itemHashMap, null, null);
        this.formMonthMapFromResult(yeardata);
        this.formDataGridMonthData(this.itemNumberHashMap);

      } else {
        const selectCount = this.chechisItemSelected(this.monthAC);
        if (selectCount === 0) {
          this.previousSelectedYear = null;
          this.formGridColumn(this.itemHashMap, null, null);
          this.formMonthMapFromResult(yeardata);
          this.formDataGridMonthData(this.itemNumberHashMap);

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
        // so that formGridColumn only adds columns for those weeks.
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

        this.formGridColumn(this.itemHashMap, weekItemAC, null);
        this.formDataGridWeekData(yeardata, checkedItemAC);

      } else {

        const selectCount = this.chechisItemSelected(this.weekAC);

        if (selectCount === 0) {

          this.previousSelectedYear = null;

          this.formGridColumn(this.itemHashMap, weekItemAC, null);
          this.formDataGridWeekData(yeardata, checkedItemAC);
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

      console.log('Width:', tableEl.scrollWidth); // 👈 check this

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
      // Do NOT pre-select all months – keep each month's current state.
      // The caller is responsible for resetting monthAC states if needed.
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
  updateTopScrollbar() {
    const tableEl = this.tableScroll.nativeElement;
    const topInner = this.topScroll.nativeElement.firstElementChild as HTMLElement;

    // 👇 KEY: match table width
    topInner.style.width = tableEl.scrollWidth + 'px';
  }
  // syncScroll(event: Event, source: 'top' | 'table') {
  //   const scrollLeft = (event.target as HTMLElement).scrollLeft;
  //   if (source === 'top') {
  //     this.tableScroll.nativeElement.scrollLeft = scrollLeft;
  //   } else {
  //     this.topScroll.nativeElement.scrollLeft = scrollLeft;
  //   }
  // }

  isYearChecked(year: string): boolean {
    return this.selectedYearCheckboxes.has(year);
  }

  openEnd(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }


  toggleYearCheckbox(year: string, checked: boolean): void {
    const tab = this.selectedTab();
    if (checked && (tab === 'month' || tab === 'week')) {
      if (this.selectedYearCheckboxes.size > 0 && !this.selectedYearCheckboxes.has(year)) {
        this.openModal("Please select only one year for " + (tab === 'month' ? "Month" : "Week") + " selection.");
        this.selectedYearCheckboxes.clear();
        // Uncheck all months/weeks of other years
        this.monthAC.forEach(m => m.state = 'unchecked');
        this.weekAC.forEach(w => w.state = 'unchecked');
      }
    }

    if (checked) {
      this.selectedYearCheckboxes.add(year);
      this.selectedYear.set(year);
      this.apiControllerFormGroup.get('year')?.setValue(year);
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
          this.apiControllerFormGroup.get('year')?.setValue(nextYear);
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

    // If year is provided, we're in the new multi-year accordion UI
    if (year) {
      const targetMonth = this.monthAC.find(m => m.Year.toString() === year.toString() && m.Month === month.name);
      if (targetMonth) {
        targetMonth.state = checked ? 'checked' : 'unchecked';
      }
      // Also update weeks
      this.weekAC.forEach(w => {
        if (w.Year.toString() === year.toString() && w.Month === month.value) {
          w.state = checked ? 'checked' : 'unchecked';
        }
      });
    } else {
      // Old logic for single year
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
      // Automaticaly select this year if none selected
      if (this.selectedYearCheckboxes.size === 0) {
        this.toggleYearCheckbox(year, true);
      }
    }

    if (year) {
      const targetWeek = this.weekAC.find(w => w.Year.toString() === year.toString() && w.Week === date.value);
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
    this.apiControllerFormGroup.get('year')?.setValue(year);
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
    await this.checkTree();
  }

  async onTabChange(event: any): Promise<void> {
    const tabs = ['year', 'month', 'week'];
    const selectedTab = tabs[event.index];

    this.selectedTab.set(selectedTab);
    this.treeFormGroup.get('children')?.setValue(selectedTab);
    this.apiControllerFormGroup.get('searchcriteriabtn')?.setValue(selectedTab);

    if (selectedTab === 'month' || selectedTab === 'week') {
      if (this.selectedYearCheckboxes.size > 1) {
        const sorted = Array.from(this.selectedYearCheckboxes).sort();
        const latest = sorted[sorted.length - 1];
        this.selectedYearCheckboxes.clear();
        this.selectedYearCheckboxes.add(latest);
        this.selectedYear.set(latest);
        this.apiControllerFormGroup.get('year')?.setValue(latest);

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

    this.myADG_itemClickHandler(selectedIds);
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


    year = this.apiControllerFormGroup.get("year")?.value;
    dataLoadedType = this.apiControllerFormGroup.get("dataLoadedType")?.value;
    fileName = `${this.clientName}_Service_Level_Usage_Summary_Report_${dataLoadedType}_${year}.xlsx`;

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