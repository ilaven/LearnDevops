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
export class UPScarriertreandsinsightComponent implements OnInit, AfterViewInit, OnDestroy {
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
  openModalConfig: any;
  panelClass: any;
  headerTextArr: any = [];
  execSummDataArr: any = [];
  methodCall = false;
  showColumnPicker = false;
  // Search logic state
  selectedYear = signal<string>('');
  months = signal<Month[]>([]);
  selectedYearCheckboxes = new Set<string>();
  // initial search tab should be "month" so the UI doesn't jump to the
  selectedTab = signal<string>('month');
  expandedYears = new Set<string>();
  // expansion state for month panels in Week tab (key = year+monthName)
  expandedWeekMonths = new Set<string>();

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
  apiControllerFormGroup!: FormGroup;
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
    private httpClientService: HttpClientService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef) {
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

      t001ClientProfile: new FormGroup({
        action: new FormControl(''),
        activeFlag: new FormControl(''),
        address: new FormControl(''),
        asonDate: new FormControl(''),
        carrierType: new FormControl(''),
        changePassword: new FormControl(''),
        charges: new FormControl(''),
        clientId: new FormControl(''),
        clientName: new FormControl(''),
        clientPassword: new FormControl(''),
        clientdbstatus: new FormControl(''),
        comments: new FormControl(''),
        contactNo: new FormControl(''),
        contractanalysisstatus: new FormControl(''),
        createdBy: new FormControl(''),
        createdTs: new FormControl(''),
        currentDate: new FormControl(''),
        currentstatus: new FormControl(''),
        customertype: new FormControl(''),
        dataFileDestDir: new FormControl(''),
        dataFileSourceDir: new FormControl(''),
        dataLoadBy: new FormControl(''),
        dataSource: new FormControl(''),
        dataasof: new FormControl(''),
        daystoweb: new FormControl(''),
        email: new FormControl(''),
        employeeTempTotal: new FormControl(''),
        employerTempTotal: new FormControl(''),
        errorString: new FormControl(''),
        fetchPhoto: new FormControl(''),
        fileEndDate: new FormControl(''),
        fileStartDate: new FormControl(''),
        getImageInd: new FormControl(''),
        image: new FormControl(''),
        ipaddress: new FormControl(''),
        isSelected: new FormControl(''),
        isdeletedbyowner: new FormControl(''),
        lazyLoad: new FormControl(''),
        loginclientId: new FormControl(''),
        logostatus: new FormControl(''),
        menucount: new FormControl(''),
        newPassword: new FormControl(''),
        nextlevelflag: new FormControl(''),
        noofdaysinactive: new FormControl(''),
        noofdaystoactive: new FormControl(''),
        password: new FormControl(''),
        payInWords: new FormControl(''),
        repname: new FormControl(''),
        resetPassword: new FormControl(''),
        startDate: new FormControl(''),
        status: new FormControl(''),
        t301accountAC: new FormControl(''),
        t302planAC: new FormControl(''),
        tablename: new FormControl(''),
        trackingcount: new FormControl(''),
        updatedTs: new FormControl(''),
        updatedby: new FormControl(''),
        user_name: new FormControl(''),
        year: new FormControl('')
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
      const formYear = this.apiControllerFormGroup.get('year')?.value;
      if (formYear && formYear !== this.selectedYear()) {
        this.selectedYear.set(formYear);
      }
    });

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
  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Create Project', active: true }
    ];
    this.openLoading();
    this.getUser();
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

  async getUser() {

    this.userProfifleData = await this.getuserProfile();
    //this.getThemeOption();

    if (!this.userProfifleData || this.userProfifleData.length === 0) {
      console.warn("User profile data not available yet.");
      this.closeLoading();
      return;
    }

    this.userProfifle = this.userProfifleData[0];

    this.clientID = this.userProfifle?.clientId;
    this.clientName = this.userProfifle.clientName;

    this.fileStartDate = this.userProfifle.fileStartDate;
    this.fileEndDate = this.userProfifle.fileEndDate;
    this.dataasof = this.userProfifle.dataasof;
    this.carrierType = this.userProfifle.carrierType;

    this.apiControllerFormGroup.patchValue({
      t001ClientProfile: {
        action: this.userProfifle.action,
        activeFlag: this.userProfifle.activeFlag,
        address: this.userProfifle.address,
        asonDate: this.userProfifle.asonDate,
        carrierType: this.userProfifle.carrierType,
        changePassword: this.userProfifle.changePassword,
        charges: this.userProfifle.charges,
        clientId: this.userProfifle.clientId,
        clientName: this.userProfifle.clientName,
        clientPassword: this.userProfifle.clientPassword,
        clientdbstatus: this.userProfifle.clientdbstatus,
        comments: this.userProfifle.comments,
        contactNo: this.userProfifle.contactNo,
        contractanalysisstatus: this.userProfifle.contractanalysisstatus,
        createdBy: this.userProfifle.createdBy,
        createdTs: this.userProfifle.createdTs,
        currentDate: this.userProfifle.currentDate,
        currentstatus: this.userProfifle.currentstatus,
        customertype: this.userProfifle.customertype,
        dataFileDestDir: this.userProfifle.dataFileDestDir,
        dataFileSourceDir: this.userProfifle.dataFileSourceDir,
        dataLoadBy: this.userProfifle.dataLoadBy,
        dataSource: this.userProfifle.dataSource,
        dataasof: this.userProfifle.dataasof,
        daystoweb: this.userProfifle.daystoweb,
        email: this.userProfifle.email,
        employeeTempTotal: this.userProfifle.employeeTempTotal,
        employerTempTotal: this.userProfifle.employerTempTotal,
        errorString: this.userProfifle.errorString,
        fetchPhoto: this.userProfifle.fetchPhoto,
        fileEndDate: this.userProfifle.fileEndDate,
        fileStartDate: this.userProfifle.fileStartDate,
        getImageInd: this.userProfifle.getImageInd,
        image: this.userProfifle.image,
        ipaddress: this.userProfifle.ipaddress,
        isSelected: this.userProfifle.isSelected,
        isdeletedbyowner: this.userProfifle.isdeletedbyowner,
        lazyLoad: this.userProfifle.lazyLoad,
        loginclientId: this.userProfifle.loginclientId,
        logostatus: this.userProfifle.logostatus,
        menucount: this.userProfifle.menucount,
        newPassword: this.userProfifle.newPassword,
        nextlevelflag: this.userProfifle.nextlevelflag,
        noofdaysinactive: this.userProfifle.noofdaysinactive,
        noofdaystoactive: this.userProfifle.noofdaystoactive,
        password: this.userProfifle.password,
        payInWords: this.userProfifle.payInWords,
        repname: this.userProfifle.repname,
        resetPassword: this.userProfifle.resetPassword,
        startDate: this.userProfifle.startDate,
        status: this.userProfifle.status,
        t301accountAC: this.userProfifle.t301accountAC,
        t302planAC: this.userProfifle.t302planAC,
        tablename: this.userProfifle.tablename,
        trackingcount: this.userProfifle.trackingcount,
        updatedTs: this.userProfifle.updatedTs,
        updatedby: this.userProfifle.updatedby,
        user_name: this.userProfifle?.user_name,
        year: this.userProfifle?.year
      }
    });

    await this.fetchaccountDetailsUPS();

    const DateObj = new Date();

    let displayYear: string;

    if (DateObj.getMonth() === 0 || (DateObj.getMonth() === 1 && DateObj.getDate() <= 5)) {
      displayYear = (DateObj.getFullYear() - 1).toString();
    } else {
      displayYear = DateObj.getFullYear().toString();
    }

    this.apiControllerFormGroup.get('year')?.setValue(displayYear);
    this.apiControllerFormGroup.get('accNo')?.setValue(null);
    this.apiControllerFormGroup.get('upsClientId')?.setValue(this.clientID);

    await this.fetchExecutiveSummaryDetailsUPS();
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }


  async fetchaccountDetailsUPS() {
    try {
      const result: any = await firstValueFrom(
        this.httpClientService.fetchaccountDetailsUPS(this.apiControllerFormGroup.value)
      );
      this.account_details = result;
      this.account_details.forEach((item: any, index: number) => {
        if (item.nickName == null || item.nickName == undefined || item.nickName === '') {
          this.account_details[index].nickName = item.accountNo;
        } else {
          this.account_details[index].nickName =
            item.accountNo + " - <span>" + item.nickName + "</span>";
        }
      });
      this.apiControllerFormGroup.get('accNo')?.setValue(null);
    } catch (error) {
      console.log(' error ', error);
    }

  }

  async fetchExecutiveSummaryDetailsUPS() {
    try {
      const result: any = await firstValueFrom(
        this.httpClientService.fetchExecutiveSummaryDetailsUPS(
          this.apiControllerFormGroup.value
        )
      );
      const accNo = this.apiControllerFormGroup.get('accNo')?.value;
      if (accNo === "null" || accNo === this.clientID || accNo == null) {
        this.apiControllerFormGroup.get('accNo')?.setValue("null");
      }
      this.fetchExectiveSummaryData(result);
    } catch (error) {
      console.log(error);
      this.closeLoading();
    }

  }


  async fetchExectiveSummaryData(resultData: any) {
    this.closeLoading();
    this.resultAC = resultData;

    if (resultData == null || resultData.length === 0) {
      this.openModal("No Record found for selected Client!");
    } else {
      // intentionally empty (same logic as original)
    }
    this.dataSortField_name = "year";
    this.dataSortField_numeric = true;

    await this.clearAlldata();

    // Setting Year Map – forms number of years in Database
    await this.formYearMapFromResult();

    let yearVal = this.apiControllerFormGroup.get('year')?.value;
    if (!this.yearHashMap.has(yearVal)) {
      const availableYears = Array.from(this.yearHashMap.keys());
      if (availableYears.length > 0) {
        yearVal = availableYears[0];
        this.apiControllerFormGroup.get('year')?.setValue(yearVal);
        this.selectedYear.set(yearVal);
        this.displayYear = yearVal;
      }
    }

    // Forms Year Array collection (source for ADG)
    await this.getYearAC();

    // Forms Month Array collection (source for ADG)
    await this.getMonthAC();

    // Forms Week Array collection (soursce for ADG)
    await this.getWeekAC();

    yearVal = this.apiControllerFormGroup.get('year')?.value;
    this.refreshMonthList(yearVal);

    if (this.methodCall) {
      this.syncSelectionsAndRefresh();
      this.methodCall = false;
    } else {
      await this.rdType_itemClickHandler();
    }

    this.cd.detectChanges();
  }

  async clearAlldata(): Promise<void> {
    this.myADG_dataProvider = [];
    this.dataGrid_dataProvider = [];
    this.dataGrid_columns = [];
    this.yearHashMap = new Map();
    this.execDescMap = new Map();
    this.monthMasterHm = new Map();
    this.monthAC = [];
    this.yearHashMapObj = new Map();
    this.monthMasterHm_temp = new Map();
    this.itemHashMap = new Map();
    this.dpAC = [];
    this.monthHashMap = new Map();

  }

  async formYearMapFromResult(): Promise<void> {
    for (let loop = 0; loop < this.resultAC.length; loop++) {
      const t006Obj = this.resultAC[loop];
      let valueMap: Map<any, any>;

      // If the year already exists, get the existing map
      if (this.yearHashMap.has(t006Obj.year)) {
        valueMap = this.yearHashMap.get(t006Obj.year);
      } else {
        valueMap = new Map();
      }

      // Add exec description data
      valueMap.set(t006Obj.execDesc, t006Obj);

      // Reset value map to year map
      this.yearHashMap.set(t006Obj.year, valueMap);

      // This map forms the Description of Executive Summary
      this.execDescMap.set(t006Obj.execDesc, t006Obj.sortOrder);
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

  async getYearAC(): Promise<void> {

    this.yearArray.set([]);
    this.yearAC = [];

    const displayYear = this.apiControllerFormGroup.get('year')?.value;

    const years: string[] = Array.from(this.yearHashMap.keys()).sort();
    for (const year of years) {
      const value = this.yearHashMap.get(year);
      this.yearAC.push({ Year: year, Month: "", Week: "", state: "unchecked", sortOrder: value, key: value });
    }
    this.yearArray.set(years);

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

  async rdType_itemClickHandler(): Promise<void> {
    this.displayYear = this.apiControllerFormGroup.get('year')?.value;

    this.previousSelectedYear = null;
    // convert to number so later equality checks succeed (string vs number
    // caused the false cross-year alert seen in the screenshot).
    const numericDisplay = Number(this.displayYear);
    this.previousSelectedYear = numericDisplay.toString();
    const displayYear = numericDisplay;
    this.rdbtn_val = this.apiControllerFormGroup.get('searchcriteriabtn')?.value;

    if (this.rdbtn_val == "year") {
      this.gridColumn = "Year";
      this.execSummYear = "2017";

      // maintain checkbox states according to `selectedYearCheckboxes`; if
      // none are chosen we treat it as "all selected" so the grid shows every
      // year (preserving previous behaviour).
      if (this.yearAC && this.yearAC.length > 0) {
        const allUnchecked = this.selectedYearCheckboxes.size === 0;
        this.yearAC.forEach(tempObj => {
          tempObj.state = (allUnchecked || this.selectedYearCheckboxes.has(tempObj.Year))
            ? 'checked' : 'unchecked';
        });
      }

      // filter the hash map so only the requested years are processed
      let yearMapToUse = this.yearHashMap;
      if (this.selectedYearCheckboxes.size > 0) {
        yearMapToUse = new Map<string, any>();
        for (const y of this.selectedYearCheckboxes) {
          if (this.yearHashMap.has(y)) {
            yearMapToUse.set(y, this.yearHashMap.get(y));
          }
        }
      }

      await this.formDataGridYearData(yearMapToUse);
      await this.formGridColumn(yearMapToUse, null, null);

      this.myADG = this.yearGC;
      //await this.selectedChange(this.service.array);
    }

    if (this.rdbtn_val == "month") {
      this.gridColumn = "Month";
      await this.formMonthMapFromResult(displayYear);
      await this.formDataGridMonthData(this.monthHashMap);
      this.monthGC = this.monthAC;
      for (let loop = 0; loop < 12; loop++) {
        const mntn = this.monthMasterHm.get(loop) + " " + this.displayYear;
        this.monthMasterHm_temp.set(loop.toString(), mntn);
      }

      await this.formGridColumn(this.monthHashMap, null, this.monthMasterHm_temp);
    }

    if (this.rdbtn_val == "week") {
      this.gridColumn = "Week";
      const weekItemAC: any[] = [];
      let count = 0;
      for (let loop = 0; loop < this.weekAC.length; loop++) {
        const obj = this.weekAC[loop];
        if (obj.Year == Number(this.displayYear)) {
          if (obj.state == "checked") {
            if (this.previousSelectedYear == null) {
              this.previousSelectedYear = obj.Year;
            }
            if (this.previousSelectedYear != obj.Year.toString()) {
              this.openModal("Cannot select Week from Different Years, Please unselect Previous Selected Year and Try again!");
              break;
            }
            this.itemHashMap.set(obj.Week, "");
          }
          weekItemAC[count] = obj.Week;
          count = count + 1;
        }
      }

      // setting Week Map
      const arr: any[] = [];
      this.formGridColumn(weekItemAC, weekItemAC, null);
      this.formDataGridWeekData(this.displayYear, arr);
      this.myADG = this.weekGC;

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



  async formDataGridYearData(inputyearHashMap: any): Promise<any> {
    this.dpAC = [];
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
    let PackageCountNotBilledtoShipper = 0;
    let arrayLoop = [];
    for (let [key, value] of this.execDescMap) {
      arrayLoop.push({ key })
    }

    for (var loop = 0; loop < this.execDescMap.size; loop++) {
      let execObj: any = {};

      let serviceDescVal = arrayLoop[loop];
      let serviceDesc = serviceDescVal.key;

      execObj['servicedesc'] = serviceDesc;

      let yearArray = inputyearHashMap.keys();
      let yearArrSize = inputyearHashMap.size;
      let yearArray1 = inputyearHashMap.size;

      let yearArr = [];
      for (let yearCnt = 0; yearCnt < yearArrSize; yearCnt++) {
        yearArr.push(yearArray.next());
      }

      for (let valueCount = 0; valueCount < yearArray1; valueCount++) {
        let yearVal = yearArr[valueCount].value + "";
        let valueMap = this.yearHashMap.get(yearVal);

        if (valueMap.get(serviceDesc) != null) {
          let value = await this.summingthevalues(valueMap.get(serviceDesc), serviceDesc);
          this.t006Obj = valueMap.get(serviceDesc);
          if (this.t006Obj.execDesc == "Average Cost Per Package") {
            value = Number(this.t006Obj.yearAvg);
          }
          else if ((this.t006Obj.execDesc == "Number of Packages" || this.t006Obj.execDesc == "Package Count")) {
            value = Number(this.t006Obj.yearAvg);
            totalShipmentsPackage = value + totalShipmentsPackage;
            execObj["total"] = this.setCommaQty(totalShipmentsPackage);
          }
          else if ((this.t006Obj.execDesc == "Package Count – Not Billed to Shipper")) {
            value = Number(this.t006Obj.yearAvg);
            PackageCountNotBilledtoShipper = value + PackageCountNotBilledtoShipper;
            execObj["total"] = this.setCommaQty(PackageCountNotBilledtoShipper);
          }
          else if (this.t006Obj.execDesc == "Net Spend") {
            value = Number(this.t006Obj.yearAvg);
            totalnetspend = value + totalnetspend;
            execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(totalnetspend));
          }
          else if (this.t006Obj.execDesc == "Average Weight Per Package") {
            value = Number(this.t006Obj.yearAvg);
          }
          else if (this.t006Obj.execDesc == "Average Cost Per lb") {
            value = Number(this.t006Obj.yearAvg);
          }
          else if (this.t006Obj.execDesc == "Average Zone") {
            value = Number(this.t006Obj.yearAvg);
          }
          else if (this.t006Obj.execDesc == "Average Weight Per Package For SCC") {
            value = Number(this.t006Obj.yearAvg);
          }
          else if (this.t006Obj.execDesc == "Effective Discount" || this.t006Obj.execDesc == "Average Cost Per Package" || this.t006Obj.execDesc == "Freight Effective Discount" ||//this.t006Obj.execDesc=="Commercial - % Manifested" || this.t006Obj.execDesc=="Residential - % Manifested" || 
            this.t006Obj.execDesc == "Total Manifested Entered Weight" || this.t006Obj.execDesc == "Total Manifested Billed Weight" || this.t006Obj.execDesc == "Total Actual Billed Weight" || this.t006Obj.execDesc == "SCC Weight Difference" || this.t006Obj.execDesc == "% of Packages Not Billed to Shipper") {
            value = Number(this.t006Obj.yearAvg);
          }
          else if (this.t006Obj.execDesc == "Commercial - % Manifested" || this.t006Obj.execDesc == "Residential - % Manifested" || this.t006Obj.execDesc == "Domestic Package %" || this.t006Obj.execDesc == "International Package %" ||
            this.t006Obj.execDesc == "Air Package %" || this.t006Obj.execDesc == "Ground Package %" || this.t006Obj.execDesc == "Accessorials (Fuel Included) %" || this.t006Obj.execDesc == "Accessorials (Fuel Excluded) %") {
            value = Number(this.t006Obj.yearAvg);
            if (value == 0) {
              value = await this.summingthevalues(valueMap.get(serviceDesc), serviceDesc);
            }
          }

          let sortOrder = this.execDescMap.get(serviceDesc);
          if (serviceDesc == "Effective Discount" || serviceDesc == "Accessorials (Fuel Included) %" || serviceDesc == "Commercial - % Manifested"
            || serviceDesc == "Residential - % Manifested" || serviceDesc == "Accessorials (Fuel Excluded) %" || serviceDesc == "Freight Effective Discount" ||
            serviceDesc == "Air Package %" || serviceDesc == "Ground Package %" || serviceDesc == "% of Packages Not Billed to Shipper" || serviceDesc == "Domestic Package %" || serviceDesc == "International Package %") {

            execObj[`value${valueCount}`] = this.setCommaQty(this.set2dpforPercentage(String(value))) + " %";

            if (serviceDesc == "% of Packages Not Billed to Shipper") {
              value = await this.summingtheTotalPercentageValues(this.yearHashMap, serviceDesc, "year");
              execObj["total"] = this.setCommaQty(this.set2dpforPercentage(String(value)) + " %");
            }
          }
          else if (serviceDesc == "Average Zone" || serviceDesc == "Average Weight Per Package" || serviceDesc == "Average Weight Per Package For SCC" || serviceDesc == "Total Manifested Entered Weight" || serviceDesc == "Total Manifested Billed Weight" || serviceDesc == "Total Actual Billed Weight" || serviceDesc == "SCC Weight Difference") {
            execObj[`value${valueCount}`] = this.setCommaQty(this.set2dpforMass(String(value)));
          }
          else if (serviceDesc == "Number of Packages" || serviceDesc == "Commercial - Manifested Count" || serviceDesc == "Shipping Charge Corrections - Package Count"
            || serviceDesc == "Residential- Manifested Count" || serviceDesc == "Commercial Adjustments Count" || serviceDesc == "Residential Adjustments Count" ||
            serviceDesc == "Package Count" || serviceDesc == "Package Count – Not Billed to Shipper") {
            execObj[`value${valueCount}`] = this.setCommaQty(String(value));

            if (serviceDesc == "Commercial - Manifested Count") {
              CommercialManifestedCount = value + CommercialManifestedCount;

              execObj["total "] = "$" + this.setCommaQty(String(CommercialManifestedCount));

            }
            if (serviceDesc == "Shipping Charge Corrections - Package Count") {
              DimensionalChargesnoofSCCChrge = value + DimensionalChargesnoofSCCChrge;

              execObj["total "] = "$" + this.setCommaQty(String(DimensionalChargesnoofSCCChrge));

            }
            if (serviceDesc == "Residential- Manifested Count") {
              ResidentialManifestedCount = value + ResidentialManifestedCount;

              execObj["total "] = "$" + this.setCommaQty(String(ResidentialManifestedCount));

            }
            if (serviceDesc == "Commercial Adjustments Count") {
              CommercialAdjustment = value + CommercialAdjustment;

              execObj["total "] = "$" + this.setCommaQty(String(CommercialAdjustment));

            }
            if (serviceDesc == "Residential Adjustments Count") {
              ResidentialAdjustments = value + ResidentialAdjustments;

              execObj["total "] = "$" + this.setCommaQty(String(ResidentialAdjustments));

            }
            if (serviceDesc == "Package Count – Not Billed to Shipper") {
              PackageCountNotBilledtoShipper = value + PackageCountNotBilledtoShipper;

              execObj["total "] = "$" + this.setCommaQty(String(PackageCountNotBilledtoShipper));

            }
          }
          else {
            execObj[`value${valueCount}`] = "$" + this.setCommaQty(this.set2dpforPrice(String(value)));
            if (serviceDesc == "Gross Spend") {
              totalgrossSpend = value + totalgrossSpend;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalgrossSpend)));
            }
            if (serviceDesc == "Incentive Amount") {
              totalIncentiveamt = value + totalIncentiveamt;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalIncentiveamt)));
            }
            if (serviceDesc == "Shipping Charge Corrections - Net Spend") {
              DimensionalSCCCharges = value + DimensionalSCCCharges;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(DimensionalSCCCharges)));
            }
            if (serviceDesc == "Freight Net Spend") {
              FreightOnlyNetSpend = value + FreightOnlyNetSpend;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightOnlyNetSpend)));
            }
            if (serviceDesc == "Freight Gross Spend") {
              FreightGrossSpend = value + FreightGrossSpend;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightGrossSpend)));
            }
            if (serviceDesc == "Freight Incentive Amount") {
              FreightIncentiveAmount = value + FreightIncentiveAmount;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightIncentiveAmount)));
            }
            if (serviceDesc == "Accessorials (Fuel Included)") {
              AccessorialsFuelIncluded = value + AccessorialsFuelIncluded;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(AccessorialsFuelIncluded)));
            }
            if (serviceDesc == "Accessorials (Fuel Excluded)") {
              AccessorialsFuelExcluded = value + AccessorialsFuelExcluded;

              execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(AccessorialsFuelExcluded)));
            }
          }
        }
      }
      this.dpAC.push(execObj);
    }
  }

  async formGridColumn(inputColumnArray: any, allColumnArray: any, masterMap: any) {
    this.countOfActualArr += 1;
    if (this.countOfActualArr == 1 && allColumnArray != null) {
      for (let ploop = 0; ploop < allColumnArray.length; ploop++) {
        const dgcAll: any = {};
        dgcAll["headerText"] = allColumnArray[ploop];
        dgcAll["dataField"] = "value" + ploop;
        this.colsActual.push(dgcAll);
      }
    }

    let cols: any[] = [];
    let dgc: any = {};

    dgc["headerText"] = "Key Metric";
    dgc["dataField"] = "servicedesc";
    dgc["width"] = 235;
    cols.push(dgc);

    // TOTAL column
    if (this.rdbtn_val == "week") {
      let visibleBoolean = true;
      const totalCol: any = {};
      totalCol["headerText"] = "TOTAL";
      totalCol["dataField"] = "total";
      if (inputColumnArray.length == 0) visibleBoolean = false;
      if (visibleBoolean) cols.push(totalCol);
    } else {
      const totalCol: any = {};
      totalCol["headerText"] = "TOTAL";
      totalCol["dataField"] = "total";
      cols.push(totalCol);
    }

    // WEEK MODE
    if (this.rdbtn_val == "week") {
      for (let ploop = 0; ploop < this.tempWeekIdArr.length; ploop++) {
        if (this.tempWeekIdArr[ploop].weekindex != null) {
          const dgc: any = {};
          dgc["headerText"] = this.tempWeekIdArr[ploop].week;
          dgc["dataField"] = "value" + ploop;
          cols.push(dgc);
        }
      }
    }
    // MONTH / YEAR MODE
    else {
      const yearArray = inputColumnArray.keys();
      const arrData: any[] = [];
      for (let yearCnt = 0; yearCnt < inputColumnArray.size; yearCnt++) {
        arrData.push(yearArray.next());
      }

      for (let loop = 0; loop < inputColumnArray.size; loop++) {
        const dgc: any = {};
        const arrVal = arrData[loop].value + "";
        if (masterMap != null) {
          dgc["headerText"] = masterMap.get(loop + "");
        } else {
          dgc["headerText"] = arrVal;
        }
        dgc["dataField"] = "value" + loop;
        cols.push(dgc);
      }
    }
    this.dataGrid_columns = cols;
    this.cd.detectChanges();
  }

  async formMonthMapFromResult(selectedYear: any): Promise<any> {
    let totalShipmentsPackage = 0;
    let totalnetspend = 0;
    let monthHm = this.yearHashMapObj.get(selectedYear.toString());
    let divideBy = 0;
    let valueArrayObj: any[] = [];
    const months = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    if (!monthHm) {
      return;
    }

    for (let loop = 0; loop < this.resultAC.length; loop++) {
      let execObj: any = {};
      let testObj = this.resultAC[loop];

      if (testObj.year == selectedYear) {
        valueArrayObj = this.formvalueArray(testObj);
      }
      if (testObj.year != selectedYear) {
        continue;
      }

      for (var monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        let monthvalue = monthLoop + "";
        let monthSaturdayAC = monthHm.get(monthLoop + "");

        let valueForMonth = 0;
        divideBy = 0;

        for (let valueLoop = 0; valueLoop < monthSaturdayAC.length; valueLoop++) {
          if (testObj.execDesc == "Effective Discount" || testObj.execDesc == "Accessorials (Fuel Included) %"
            || testObj.execDesc == "Accessorials (Fuel Excluded) %" || testObj.execDesc == "Average Cost Per Package" || testObj.execDesc == "Average Weight Per Package"
            || testObj.execDesc == "Average Weight Per Package For SCC" || testObj.execDesc == "Average Cost Per lb" || testObj.execDesc == "Average Zone"
            || testObj.execDesc == "Commercial - % Manifested" || testObj.execDesc == "Residential - % Manifested" || testObj.execDesc == "Freight Effective Discount"
            || testObj.execDesc == "Air Package %" || testObj.execDesc == "Ground Package %" || testObj.execDesc == "% of Packages Not Billed to Shipper"
            || testObj.execDesc == "Domestic Package %" || testObj.execDesc == "International Package %") {
            let monthPercentvalue = Number(valueArrayObj[(monthSaturdayAC[valueLoop]) - 1]);
            if (monthPercentvalue != 0) {
              divideBy = divideBy + 1;
            }
          }
          valueForMonth = valueForMonth + Number(valueArrayObj[(monthSaturdayAC[valueLoop]) - 1]);
        }

        if (divideBy != 0) {
          valueForMonth = valueForMonth / divideBy;
        }

        if (testObj.execDesc == "Average Cost Per Package") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        else if (testObj.execDesc == "Number of Packages" || testObj.execDesc == "Package Count") {
          valueForMonth = Number(testObj[months[monthLoop]]);
          //Shipmentsu
          totalShipmentsPackage = valueForMonth + totalShipmentsPackage;
          execObj["total"] = String(totalShipmentsPackage);
        }
        else if (testObj.execDesc == "Net Spend") {
          valueForMonth = Number(testObj[months[monthLoop]]);
          //netspentinclude
          totalShipmentsPackage = valueForMonth + totalShipmentsPackage;
          execObj["total"] = this.set2dpforPrice(String(totalnetspend));
        }
        else if (testObj.execDesc == "Average Weight Per Package") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        else if (testObj.execDesc == "Average Weight Per Package For SCC") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }

        else if (testObj.execDesc == "Average Cost Per lb") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        else if (testObj.execDesc == "Average Zone") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Gross Spend") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Incentive Amount") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Shipping Charge Corrections - Net Spend") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Freight Net Spend") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Freight Gross Spend") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Freight Incentive Amount") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Accessorials (Fuel Included)") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Accessorials (Fuel Excluded)") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Commercial - Manifested Count") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Shipping Charge Corrections - Package Count") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Residential- Manifested Count") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Commercial Adjustments Count") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Residential Adjustments Count") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }

        if (testObj.execDesc == "Effective Discount") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Freight Effective Discount") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Commercial - % Manifested") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Residential - % Manifested") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Accessorials (Fuel Included) %") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Accessorials (Fuel Excluded) %") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Ground Package %") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Air Package %") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Total Manifested Entered Weight") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Total Manifested Billed Weight") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Total Actual Billed Weight") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "SCC Weight Difference") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Package Count – Not Billed to Shipper") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "% of Packages Not Billed to Shipper") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "Domestic Package %") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }
        if (testObj.execDesc == "International Package %") {
          valueForMonth = Number(testObj[months[monthLoop]]);
        }

        var valueMap = new Map();
        //if the year was already added to map , then get the map and get the value map and add this value to the map and reset it
        // if the year map does not contain such year, then create a new map and add it to the year

        if (this.monthHashMap.has(monthvalue)) {
          valueMap = this.monthHashMap.get(monthvalue);
          valueMap.delete(testObj.execDesc);
        }
        else {
          valueMap = new Map()
        }
        valueMap.set(testObj.execDesc, valueForMonth);
        //reset the value map to the year map 
        await this.monthHashMap.set(monthvalue, valueMap);
      }
    }
  }

  async formDataGridMonthData(inputMonthHm: any): Promise<any> {
    this.dpAC = [];
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
    let PackageCountNotBilledtoShipper = 0;

    var arrayLoop = [];
    for (let [key, value] of this.execDescMap) {

      arrayLoop.push({ key })
    }
    for (var loop = 0; loop < this.execDescMap.size; loop++) {
      let execObj: any = {};
      var serviceDescVal = arrayLoop[loop];
      var serviceDesc = serviceDescVal.key;

      execObj["servicedesc"] = serviceDesc;
      var monthArray = inputMonthHm.keys();
      var monthArray1 = inputMonthHm.size;
      execObj["sortOrder"] = this.execDescMap.get(serviceDesc);
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

            if (serviceDesc == "Effective Discount" || serviceDesc == "Accessorials (Fuel Included) %" || serviceDesc == "Commercial - % Manifested"
              || serviceDesc == "Residential - % Manifested" || serviceDesc == "Accessorials (Fuel Excluded) %" || serviceDesc == "Freight Effective Discount"
              || serviceDesc == "Ground Package %" || serviceDesc == "Air Package %" || serviceDesc == "% of Packages Not Billed to Shipper" || serviceDesc == "Domestic Package %" || serviceDesc == "International Package %") {
              execObj[`value${valueCount}`] =
                this.setCommaQty(this.set2dpforPercentage(String(value)) + " %");

              if (serviceDesc == "% of Packages Not Billed to Shipper") {
                value = await this.summingtheTotalPercentageValues(this.monthHashMap, serviceDesc, "month");
                execObj["total"] = this.setCommaQty(this.set2dpforPercentage(String(value)) + " %");
              }
            }
            else if (serviceDesc == "Average Zone" || serviceDesc == "Average Weight Per Package" || serviceDesc == "Average Weight Per Package For SCC" || serviceDesc == "Total Manifested Entered Weight" || serviceDesc == "Total Manifested Billed Weight" || serviceDesc == "Total Actual Billed Weight" || serviceDesc == "SCC Weight Difference") {

              execObj[`value${valueCount}`] =
                this.setCommaQty(this.set2dpforMass(String(value)));

            }
            else if (serviceDesc == "Number of Packages" || serviceDesc == "Commercial - Manifested Count" || serviceDesc == "Shipping Charge Corrections - Package Count"
              || serviceDesc == "Residential- Manifested Count" || serviceDesc == "Commercial Adjustments Count" || serviceDesc == "Residential Adjustments Count"
              || serviceDesc == "Package Count" || serviceDesc == "Package Count – Not Billed to Shipper") {
              execObj[`value${valueCount}`] = this.setCommaQty(String(value));

              if (serviceDesc == "Number of Packages" || serviceDesc == "Package Count") {
                totalShipmentsPackage = value + totalShipmentsPackage;

                execObj["total"] = this.setCommaQty(String(totalShipmentsPackage));
              }
              if (serviceDesc == "Commercial - Manifested Count") {
                CommercialManifestedCount = value + CommercialManifestedCount;

                execObj["total"] = this.setCommaQty(String(CommercialManifestedCount));
              }
              if (serviceDesc == "Shipping Charge Corrections - Package Count") {
                DimensionalChargesnoofSCCChrge = value + DimensionalChargesnoofSCCChrge;

                execObj["total"] = this.setCommaQty(String(DimensionalChargesnoofSCCChrge));
              }
              if (serviceDesc == "Residential- Manifested Count") {
                ResidentialManifestedCount = value + ResidentialManifestedCount;

                execObj["total"] = this.setCommaQty(String(ResidentialManifestedCount));
              }
              if (serviceDesc == "Commercial Adjustments Count") {
                CommercialAdjustment = value + CommercialAdjustment;

                execObj["total"] = this.setCommaQty(String(CommercialAdjustment));
              }
              if (serviceDesc == "Residential Adjustments Count") {
                ResidentialAdjustments = value + ResidentialAdjustments;

                execObj["total"] = this.setCommaQty(String(ResidentialAdjustments));
              }
              if (serviceDesc == "Package Count – Not Billed to Shipper") {
                PackageCountNotBilledtoShipper = value + PackageCountNotBilledtoShipper;

                execObj["total"] = this.setCommaQty(String(PackageCountNotBilledtoShipper));
              }
            }
            else {
              execObj[`value${valueCount}`] = "$" + this.setCommaQty(this.set2dpforPrice(String(value)));

              if (serviceDesc == "Net Spend") {
                totalnetspend = value + totalnetspend;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalnetspend)));

              }
              if (serviceDesc == "Gross Spend") {
                totalgrossSpend = value + totalgrossSpend;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalgrossSpend)));

              }
              if (serviceDesc == "Incentive Amount") {
                totalIncentiveamt = value + totalIncentiveamt;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalIncentiveamt)));

              }
              if (serviceDesc == "Shipping Charge Corrections - Net Spend") {
                DimensionalSCCCharges = value + DimensionalSCCCharges;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(DimensionalSCCCharges)));

              }
              if (serviceDesc == "Freight Net Spend") {
                FreightOnlyNetSpend = value + FreightOnlyNetSpend;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightOnlyNetSpend)));

              }
              if (serviceDesc == "Freight Gross Spend") {
                FreightGrossSpend = value + FreightGrossSpend;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightGrossSpend)));

              }
              if (serviceDesc == "Freight Incentive Amount") {
                FreightIncentiveAmount = value + FreightIncentiveAmount;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(FreightIncentiveAmount)));

              }
              if (serviceDesc == "Accessorials (Fuel Included)") {
                AccessorialsFuelIncluded = value + AccessorialsFuelIncluded;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(AccessorialsFuelIncluded)));

              }
              if (serviceDesc == "Accessorials (Fuel Excluded)") {
                AccessorialsFuelExcluded = value + AccessorialsFuelExcluded;
                execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(AccessorialsFuelExcluded)));

              }
            }
          }
        }
      }
      this.dpAC.push(execObj);
    }
  }

  async formDataGridWeekData(selectedYear: any, selectitem: any): Promise<any> {
    this.execSummYear = selectedYear;
    this.dpAC = [];

    let serviceDescAC = this.execDescMap.keys();
    let arrayLoop: any = [];
    for (let [key, value] of this.execDescMap) {
      arrayLoop.push({ key })
    }
    var totalShipmentsPackage = 0;

    for (var loop = 0; loop < this.execDescMap.size; loop++) {
      let execObj: any = {};
      let serviceDescVal = arrayLoop[loop];
      let serviceDesc = serviceDescVal.key;
      execObj["servicedesc"] = serviceDesc;
      execObj["sortOrder"] = this.execDescMap.get(serviceDesc);
      let valueMap = this.yearHashMap.get(selectedYear);
      if (valueMap.get(serviceDesc) != null) //9126
      {
        if (serviceDesc == "Effective Discount" || serviceDesc == "Accessorials (Fuel Included) %" || serviceDesc == "Commercial - % Manifested"
          || serviceDesc == "Residential - % Manifested" || serviceDesc == "Accessorials (Fuel Excluded) %" || serviceDesc == "Freight Effective Discount"
          || serviceDesc == "Ground Package %" || serviceDesc == "Air Package %" || serviceDesc == "% of Packages Not Billed to Shipper" || serviceDesc == "Domestic Package %" || serviceDesc == "International Package %") {
          const serviceObj = valueMap.get(serviceDesc);
          for (let i = 0; i <= 52; i++) {
            if (this.tempWeekIdArr[i]?.weekindex != null) {
              const weekValue = serviceObj[`w${i + 1}`];
              execObj[`value${i}`] =
                this.setCommaQty(this.set2dpforPercentage(String(weekValue)) + " %");
            }
          }
        }
        else if (serviceDesc == "Average Zone" || serviceDesc == "Average Weight Per Package" || serviceDesc == "Average Weight Per Package For SCC" || serviceDesc == "Total Manifested Entered Weight" || serviceDesc == "Total Manifested Billed Weight" || serviceDesc == "Total Actual Billed Weight" || serviceDesc == "SCC Weight Difference") {
          const serviceObj = valueMap.get(serviceDesc);
          for (let i = 0; i <= 52; i++) {
            if (this.tempWeekIdArr[i]?.weekindex != null) {
              const weekValue = serviceObj[`w${i + 1}`];
              execObj[`value${i}`] =
                this.setCommaQty(this.set2dpforMass(String(weekValue)));
            }
          }
        }
        else if (serviceDesc == "Number of Packages" || serviceDesc == "Commercial - Manifested Count" || serviceDesc == "Shipping Charge Corrections - Package Count"
          || serviceDesc == "Residential- Manifested Count" || serviceDesc == "Commercial Adjustments Count" || serviceDesc == "Residential Adjustments Count"
          || serviceDesc == "Package Count" || serviceDesc == "Package Count – Not Billed to Shipper") {
          const serviceObj = valueMap.get(serviceDesc);
          for (let i = 0; i <= 52; i++) {
            if (this.tempWeekIdArr[i]?.weekindex != null) {
              const weekValue = serviceObj[`w${i + 1}`];
              execObj[`value${i}`] =
                this.setCommaQty(this.set2dpforWeekVal(String(weekValue)));
            }
          }
        }

        else {
          const obj = valueMap.get(serviceDesc);
          for (let i = 0; i < 53; i++) {
            if (this.tempWeekIdArr[i]?.weekindex != null) {
              execObj[`value${i}`] =
                "$" + this.setCommaQty(this.set2dpforPrice(String(obj[`w${i + 1}`])));
            }
          }
        }
      }
      if (serviceDesc == "Number of Packages" || serviceDesc == "Commercial - Manifested Count" || serviceDesc == "Shipping Charge Corrections - Package Count"
        || serviceDesc == "Residential- Manifested Count" || serviceDesc == "Commercial Adjustments Count" || serviceDesc == "Residential Adjustments Count"
        || serviceDesc == "Package Count" || serviceDesc == "Package Count – Not Billed to Shipper")//9126
      {
        var str: String;
        totalShipmentsPackage = 0;
        for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
          if (this.tempWeekIdArr[i].weekstate === 'checked') {
            totalShipmentsPackage += Number(this.removeCommasonly(execObj[`value${i}`]));
          }
        }
        execObj["total"] = this.setCommaQty(String(totalShipmentsPackage));
      }
      //currency
      else if (serviceDesc == "Net Spend" || serviceDesc == "Gross Spend" || serviceDesc == "Incentive Amount"
        || serviceDesc == "Shipping Charge Corrections - Net Spend" || serviceDesc == "Freight Net Spend" || serviceDesc == "Freight Gross Spend"
        || serviceDesc == "Freight Incentive Amount" || serviceDesc == "Accessorials (Fuel Included)" || serviceDesc == "Accessorials (Fuel Excluded)") {
        totalShipmentsPackage = 0;
        for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
          if (this.tempWeekIdArr[i].weekstate === 'checked') {
            totalShipmentsPackage += Number(this.removeCommas(execObj[`value${i}`]));
          }
        }
        execObj["total"] = "$" + this.setCommaQty(this.set2dpforPrice(String(totalShipmentsPackage)));
      }
      //percentage -9160
      else if (serviceDesc == "% of Packages Not Billed to Shipper") {
        var percentageNotBilledToShipper = valueMap.get(serviceDesc).yearAvg;
        percentageNotBilledToShipper = await this.summingtheTotalPercentageValues(valueMap, serviceDesc, "week");
        execObj["total"] = this.setCommaQty(this.set2dpforPercentage(String(percentageNotBilledToShipper)) + " %");
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
  async summingthevalues(t006Obj: any, serviceDesc: any): Promise<any> {
    let value = 0;
    let divideBy = 0;
    const validServices = new Set([
      "Effective Discount",
      "Accessorials (Fuel Included) %",
      "Accessorials (Fuel Excluded) %",
      "Average Cost Per Package",
      "Average Weight Per Package",
      "Average Cost Per lb",
      "Average Zone",
      "Commercial - % Manifested",
      "Residential - % Manifested",
      "Freight Effective Discount",
      "Air Package %",
      "Ground Package %",
      "% of Packages Not Billed to Shipper",
      "Domestic Package %",
      "International Package %"
    ]);
    if (t006Obj != null) {
      if (validServices.has(serviceDesc)) {
        for (let i = 1; i <= 53; i++) {
          if (Number(t006Obj[`w${i}`]) != 0) {
            divideBy = divideBy + 1;
          }
        }
      }
      let value = 0;
      for (let i = 1; i <= 53; i++) {
        value += Number(t006Obj[`w${i}`]);
      }
      if (divideBy != 0) {
        value = value / divideBy;
      }
    }
    return value;
  }

  async summingtheTotalPercentageValues(t006Obj: any, serviceDesc: any, type: any): Promise<any> {
    let value = 0;
    let totalValuePackageCount = 0;
    let totalValueShipperCount = 0;
    if (t006Obj != null) {
      if (type == "month") {
        const monthArray = t006Obj.keys();
        const monthArray1 = t006Obj.size;
        const monthArr = [];
        for (let yearCnt = 0; yearCnt < monthArray1; yearCnt++) {
          monthArr.push(monthArray.next());
        }
        for (let valueCount = 0; valueCount < monthArray1; valueCount++) {
          const monthVal = monthArr[valueCount].value + "";
          const valueMap = t006Obj.get(monthVal + "");
          const valuePackageCount = valueMap.get("Number of Packages");
          const valueShipperCount = valueMap.get("Package Count – Not Billed to Shipper");
          totalValuePackageCount = totalValuePackageCount + Number(valuePackageCount);
          totalValueShipperCount = totalValueShipperCount + Number(valueShipperCount);
        }
        value = (totalValueShipperCount / (totalValuePackageCount + totalValueShipperCount)) * 100;
      }
      else if (type == "year") {
        const yearArray = t006Obj.keys();
        const yearArrSize = t006Obj.size;
        const yearArr = [];
        for (let yearCnt = 0; yearCnt < yearArrSize; yearCnt++) {
          yearArr.push(yearArray.next());
        }
        for (let valueCount = 0; valueCount < yearArrSize; valueCount++) {
          const yearVal = yearArr[valueCount].value + "";
          const valueMap = t006Obj.get(yearVal);
          const valuePackageCountObj = valueMap.get("Number of Packages");
          const valueShipperCountObj = valueMap.get("Package Count – Not Billed to Shipper");
          if (valuePackageCountObj != null && valueShipperCountObj != null) {
            const valuePackageCount = valuePackageCountObj.yearAvg;
            const valueShipperCount = valueShipperCountObj.yearAvg;
            totalValuePackageCount = totalValuePackageCount + Number(valuePackageCount);
            totalValueShipperCount = totalValueShipperCount + Number(valueShipperCount);
          }
        }
        value = (totalValueShipperCount / (totalValuePackageCount + totalValueShipperCount)) * 100;
      }
      else if (type == "week") {
        const valuePackageCountObj = t006Obj.get("Number of Packages");
        const valueShipperCountObj = t006Obj.get("Package Count – Not Billed to Shipper");
        if (valuePackageCountObj != null && valueShipperCountObj != null) {
          for (let i = 1; i <= 53; i++) {
            totalValuePackageCount =
              totalValuePackageCount + Number(valuePackageCountObj[`w${i}`]);
            totalValueShipperCount =
              totalValueShipperCount + Number(valueShipperCountObj[`w${i}`]);
          }
        }
      }
      value = (totalValueShipperCount / (totalValuePackageCount + totalValueShipperCount)) * 100;

    }
    return value;
  }

  async account_clickHandler() {
    this.openLoading();
    var accNo = this.apiControllerFormGroup.get('accNo')?.value;
    if (accNo == "null") {
      await this.apiControllerFormGroup.get('accNo')?.setValue(null);
    } else {
      await this.apiControllerFormGroup.get('accNo')?.setValue(accNo);
    }
    this.methodCall = true;
    await this.fetchExecutiveSummaryDetailsUPS();
  }

  async checkTree() {
    var nodeVal = await this.treeFormGroup.get('children')?.value;
    await this.apiControllerFormGroup.get('searchcriteriabtn')?.setValue(nodeVal);
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
        if (this.clientType() == "UPS") {
          if (loop2 == 0) {
            execSummData.push(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']]);
          }
          else if (loop2 == 1) {
            var nodeVal = this.treeFormGroup.get('children')?.value;
            if (nodeVal == "year") {
              if (loop1 == 3 || loop1 == 5 || loop1 == 6 || loop1 == 7 || loop1 == 8 || loop1 == 9 || loop1 == 10 || loop1 == 11 || loop1 == 12 || loop1 == 13 || loop1 == 14 || loop1 == 15 || loop1 == 16 || loop1 == 17 || loop1 == 18 || loop1 == 23 || loop1 == 24 || loop1 == 25 || loop1 == 28 || loop1 == 29 || loop1 == 30 || loop1 == 31) {
                execSummData.push(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']]);
              }
              else if (loop1 == 33) {
                execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')) / 100);
              }
              else {
                execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')));
              }
            }
            else {
              if (loop1 == 3 || loop1 == 5 || loop1 == 6 || loop1 == 7 || loop1 == 8 || loop1 == 9 || loop1 == 10 || loop1 == 11 || loop1 == 12 || loop1 == 13 || loop1 == 14 || loop1 == 23 || loop1 == 24 || loop1 == 25 || loop1 == 28 || loop1 == 29 || loop1 == 30 || loop1 == 31) {
                execSummData.push(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']]);
              }
              else if (loop1 == 33) {
                execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')) / 100);
              }
              else {
                execSummData.push(Number(this.dpAC[loop1][this.dataGrid_columns[loop2]['dataField']].replace('$', '').replace(/[,]/g, '').replace(' %', '')));
              }
            }
          }
          else {
            if (loop1 == 3 || loop1 == 8 || loop1 == 9 || loop1 == 10 || loop1 == 11 || loop1 == 13 || loop1 == 14 || loop1 == 23 || loop1 == 24 || loop1 == 25 || loop1 == 33) {
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

    var year = this.apiControllerFormGroup.get('year')?.value;
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

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
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

    this.syncSelectionsAndRefresh();
  }

  async onTabChange(event: any): Promise<void> {
    const tabs = ['year', 'month', 'week'];
    const selectedTab = tabs[event.index];
    this.selectedTab.set(selectedTab);

    // Update underlying form controls so the grid logic knows which selection mode is active
    this.apiControllerFormGroup.get('searchcriteriabtn')?.setValue(selectedTab);
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

  async selectedChange(event: any[]) {
    this.myADG_itemClickHandler(event);
  }

  async myADG_itemClickHandler(event: string[]) {
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

      await this.formGridColumn(this.itemHashMap, null, null);
      await this.formDataGridYearData(this.itemHashMap);
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
        await this.formMonthMapFromResult(yeardata);
        await this.formDataGridMonthData(this.itemNumberHashMap);
        await this.formGridColumn(this.itemHashMap, null, null);
      } else {
        const selectCount = this.chechisItemSelected(this.monthAC);
        if (selectCount === 0) {
          this.previousSelectedYear = null;
          await this.formMonthMapFromResult(yeardata);
          await this.formDataGridMonthData(this.itemNumberHashMap);
          await this.formGridColumn(this.itemHashMap, null, null);
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
    let targetYear = this.apiControllerFormGroup.get('year')?.value;
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
    const clientWidth = this.tableScroll.nativeElement.clientWidth;

    this.scrollContent.nativeElement.style.width = `${tableWidth}px`;
    // Sync the container width to match the table's visible width (excluding vertical scrollbar)
    this.topScroll.nativeElement.style.width = `${clientWidth}px`;
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
      this.apiControllerFormGroup.get('year')?.setValue(year);
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


  isYearChecked(year: string): boolean {
    return this.selectedYearCheckboxes.has(year);
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

      // Update month.selected and all date.selected properties to reflect checkbox state
      month.selected = checked;
      if (month.dates) {
        month.dates.forEach(d => d.selected = checked);
      }
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
      // Update the date.selected property to reflect the checkbox state
      date.selected = checked;
      // Check if all weeks are checked for this month to update month state
      const weeksForMonth = this.weekAC.filter(w => w.Year.toString() === year.toString() && w.Month === month.value);
      const allChecked = weeksForMonth.every(w => w.state === 'checked');
      const targetMonth = this.monthAC.find(m => m.Year.toString() === year.toString() && m.Month === month.name);
      if (targetMonth) {
        targetMonth.state = allChecked ? 'checked' : 'unchecked';
      }
      // Update month.selected to match the current state
      month.selected = allChecked;
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

}