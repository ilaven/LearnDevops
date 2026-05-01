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
import { lastValueFrom } from 'rxjs';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Workbook } from 'exceljs';
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
  selector: 'app-ups-cost-optimization',
  templateUrl: './cost-optimization.component.html',
  styleUrls: ['./cost-optimization.component.scss'],
  standalone: false
})
export class UpsCostOptimizationComponent implements OnInit, AfterViewInit {

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
  fileStartDate: any;
  fileEndDate: any;
  dataasof: any;
  carrierType: any;
  userProfifle: any;
  account_details: any[] = [];
  resultAC: any[] = [];
  dataSortField_name: string = "";
  dataSortField_numeric: boolean = true;
  myADG_dataProvider: any[] = [];
  dataGrid_dataProvider: any[] = [];
  dataGrid_columns: any[] = [];
  t006Obj: any;
  openModalConfig: any;
  panelClass: any;
  headerTextArr: any = [];
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
  yearArray = signal<string[]>([]);
  yearAC: any[] = [];
  displayYear: string = "";
  weekAC: any[] = [];
  previousSelectedYear: string | null = null;
  rdbtn_val: any;
  gridColumn: string = "";
  costOptYear: string = "";
  yearGC: any;

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
  apiControllerFormGroup!: FormGroup;
  treeFormGroup!: FormGroup;

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  collapsedChildrenCount = 0;

  // store expanded group ids
  expanded = new Set<string>();

  // expansion state for year panels in Month/Week tabs
  expandedYears = new Set<string>();
  // expansion state for month panels in Week tab (key = year+monthName)
  expandedWeekMonths = new Set<string>();

  // Search logic state
  selectedYear = signal<string>('');
  months = signal<Month[]>([]);
  selectedYearCheckboxes = new Set<string>();
  // initial search tab should be "month" so the UI doesn't jump to the
  selectedTab = signal<string>('month');
  methodCall = false;

  // derive a numeric index that the <mat-tab-group> can consume. by
  // making this computed it will automatically update whenever
  // `selectedTab()` changes, which keeps Angular's change detection happy.
  selectedTabIndex = computed(() => {
    const map: Record<string, number> = { year: 0, month: 1, week: 2 };
    return map[this.selectedTab()] ?? 0;
  });

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
    private loaderService: LoaderService,
    private commonService: CommonService,
    private httpClientService: HttpClientService,
    private dialog: MatDialog,
    private offcanvasService: NgbOffcanvas,
    private cd: ChangeDetectorRef) {
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
    this.cookiesService.carrierType.subscribe((clienttype: string) => {
      console.log('clienttype', clienttype);
      this.clientType.set(clienttype);
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
    });

    this.treeFormGroup = new FormGroup({
      children: new FormControl('month')
    });
  }

  ngOnInit(): void {
    this.openLoading();
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Create Project', active: true }
    ];
    this.initializeDefaults(); // some pending
    this.getUser();
  }

  openLoading() {
    this.loaderService.show()
  }
  closeLoading() {
    this.loaderService.hide()
  }

  private initializeDefaults(): void {
    this.randomNumber = Math.floor(100000 + Math.random() * 900000);

    // ensure displayYear starts aligned with whatever value the form has
    this.displayYear = this.apiControllerFormGroup.get('year')?.value || this.displayYear;
  }

  async getUser() {

    const result = await this.getuserProfile();
    this.userProfifle = result[0];
    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    this.fileStartDate = this.userProfifle.fileStartDate;
    this.fileEndDate = this.userProfifle.fileEndDate;
    this.dataasof = this.userProfifle.dataasof;
    this.carrierType = this.userProfifle.carrierType;

    this.apiControllerFormGroup.patchValue({
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

    const DateObj: Date = new Date();
    let displayYear: string;
    if (DateObj.getMonth() == 0 || (DateObj.getMonth() == 1 && DateObj.getDate() <= 5)) {
      displayYear = (DateObj.getFullYear() - 1) + "";
    } else {
      displayYear = (DateObj.getFullYear()) + "";
    }

    // var displayYear=(DateObj.getFullYear())+"";

    this.apiControllerFormGroup.get('year')?.setValue(displayYear);
    this.apiControllerFormGroup.get('accNo')?.setValue(null);
    this.apiControllerFormGroup.get('upsClientId')?.setValue(this.clientID);

    await this.fetchCostOptimizationDetails();

  }

  async getuserProfile(): Promise<any[]> {
    const result = await this.commonService.getUserprofileData();
    this.clientProfileList = result;
    return result;
  }

  async fetchaccountDetailsUPS() {
    try {
      // Modern Angular 20 way to await an Observable HTTP request
      const result: any = await lastValueFrom(
        this.httpClientService.fetchaccountDetailsUPS(this.apiControllerFormGroup.value)
      );
      this.account_details = result;
      const accountNo = result[0].accountNo;

      this.account_details.forEach(item => {
        if (!item.nickName) {
          item.nickName = item.accountNo;
        } else {
          item.nickName = `${item.accountNo} - <span>${item.nickName}</span>`;
        }
      });
      this.apiControllerFormGroup.get('accNo')?.setValue("null");
      // Return the accountNo so `const accountNo = await this.fetchaccountDetailsUPS();` works correctly
      return accountNo;

    } catch (error) {
      console.log(' error ', error);
      return null;
    }
  }

  // return the raw array so callers can make decisions based on whether
  // any records were returned.  previously this method merely populated the
  // component state which made it impossible for the year-change handler to
  // roll back when the server responded with zero rows.
  async fetchCostOptimizationDetails(): Promise<any[]> {
    try {
      const result: any = await lastValueFrom(
        this.httpClientService.fetchCostOptimizationDetails(this.apiControllerFormGroup.value)
      );
      const accNo = this.apiControllerFormGroup.get('accNo')?.value;
      if (accNo == "null" || accNo == this.clientID || accNo == null) {
        this.apiControllerFormGroup.get('accNo')?.setValue("null");
      }
      await this.fetchCostOptimizationData(result);
      return result;
    } catch (error) {
      console.log(error);
      this.closeLoading();
      return [];
    }
  }

  async fetchCostOptimizationData(resultData: any) {
    this.closeLoading();
    this.resultAC = resultData;

    // if the server returned no rows we should bail early.  the existing
    // implementation cleared every selection and year list which meant the
    // dropdown vanished and the year control looked like it had been
    // "cleared" when the user closed the panel.  keeping the previous
    // values makes it easier for the user to choose a different year.
    if (!resultData || resultData.length === 0) {
      const year = this.apiControllerFormGroup.get('year')?.value || '';
      this.openModal(`No records found for client in year ${year}. Please choose a different year or account.`);
      return; // skip the rest of the processing
    }

    this.dataSortField_name = "year";
    this.dataSortField_numeric = true;

    await this.clearAlldata();
    await this.formYearMapFromResult();  // populates yearHashMap and accessorialDescMap
    await this.getYearAC();
    await this.getMonthAC();      // monthAC will now be built for the new data
    await this.getWeekAC();       // weekAC rebuilt as well

    // make sure contained month list is up to date; depending on the order
    // selectedYear may have already been set by the caller, but we explicitly
    // use the form control so the behavior is deterministic.
    const yearVal = this.apiControllerFormGroup.get('year')?.value;
    this.refreshMonthList(yearVal);

    // refresh the grid according to the currently active tab
    if (this.methodCall) {
      this.syncSelectionsAndRefresh();
      this.methodCall = false;
    } else {
      await this.rdType_itemClickHandler();
    }

    this.cd.detectChanges();
  }

  async clearAlldata() {
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

  async formYearMapFromResult() {
    this.resultAC.forEach(t006Obj => {
      const valueMap = this.yearHashMap.get(t006Obj.year) || new Map<string, any>();
      valueMap.set(t006Obj.accessorialDesc, t006Obj);
      this.yearHashMap.set(t006Obj.year, valueMap);
      this.accessorialDescMap.set(t006Obj.accessorialDesc, { sortOrder: t006Obj.sortOrder, childOrder: t006Obj.childOrder });
    });

    // static value for month in login page
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

  async getYearAC() {
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

  async getMonthAC() {
    const keyAC: any[] = [];
    let monthCount = 0;

    for (const [key, value] of this.yearHashMap.entries()) {
      const year_key = key;

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

  async rdType_itemClickHandler() {
    // always keep displayYear in sync with the form value; avoids the
    // `Cannot select Week from Different Years` dialog appearing when a
    // user changes the dropdown and then switches to the week tab.
    this.displayYear = this.apiControllerFormGroup.get('year')?.value;

    this.previousSelectedYear = null;
    // convert to number so later equality checks succeed (string vs number
    // caused the false cross-year alert seen in the screenshot).
    const numericDisplay = Number(this.displayYear);
    this.previousSelectedYear = numericDisplay.toString();
    const displayYear = numericDisplay;

    // Ensure you define this method if you haven't yet:
    // await this.resettingAdvanceDataGrid();

    this.rdbtn_val = this.apiControllerFormGroup.get('searchcriteriabtn')?.value;

    if (this.rdbtn_val == "year") {
      this.gridColumn = "Year";
      this.costOptYear = "2017";

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
    }

    if (this.rdbtn_val == "month") {
      this.gridColumn = "Month";

      // Ensure you define these methods if you haven't yet:
      await this.formMonthMapFromResult(displayYear);
      await this.formDataGridMonthData(this.monthHashMap);

      this.monthGC = this.monthAC;

      for (let loop = 0; loop < 12; loop++) {
        const mntn = `${this.monthMasterHm.get(loop)} ${this.displayYear}`;
        this.monthMasterHm_temp.set(loop.toString(), mntn);
      }

      // Ensure you define this method if you haven't yet:
      await this.formGridColumn(this.monthHashMap, null, this.monthMasterHm_temp);
    }

    if (this.rdbtn_val == "week") {
      this.gridColumn = "Week";
      var weekItemAC: any[] = [];
      let count = 0;

      for (const obj of this.weekAC) {
        if (obj.Year === displayYear) {
          if (obj.state === "checked") {
            if (this.previousSelectedYear === null) {
              this.previousSelectedYear = obj.Year;
            }

            if (this.previousSelectedYear !== obj.Year.toString()) {
              // this situation should no longer occur because we clear any
              // weeks belonging to other years when the year dropdown changes.
              // keep the alert for safety but it will only trigger if something
              // really unexpected happens.
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
      this.formGridColumn(weekItemAC, weekItemAC, null);
      this.formDataGridWeekData(this.displayYear, arr);

      this.myADG = this.weekGC;
    }
  }

  async formDataGridYearData(inputyearHashMap: Map<string, any>) {
    this.dpAC = [];
    var serviceDescAC = this.accessorialDescMap.keys();

    let totalnetspend = 0;
    let totalAdditional = 0;
    let totalLargePackage = 0;
    let totalOverMaximum = 0;
    let totalPeakSurcharges = 0;
    let totalAddressCorrection = 0;
    let totalShippingCharge = 0;
    let totalChargebackFees = 0;
    let totalEarlyAM = 0;
    let totalLatePayment = 0;
    let totalMissingPLD = 0;
    let totalNonMachineable = 0;
    let totalServiceCharge = 0;
    let totalThirdParty = 0;
    let totalUndeliverable = 0;
    let totalDeclaredValue = 0;
    let totalAirShipping = 0;
    let totalGSR = 0;
    let totalVOIDS = 0;
    let totalZoneAdjustments = 0;
    let totalUPSPromoDiscount = 0;
    let totalCallTag = 0;
    let totalCreditCardSurcharge = 0;
    let totalPrintInvoiceFee = 0;
    let totalCheckFeesandWireFees = 0;
    let totalRebillFee = 0;
    let arrayLoop = [];
    for (let [key, value] of this.accessorialDescMap) {
      arrayLoop.push({ key })
    }

    for (var loop = 0; loop < this.accessorialDescMap.size; loop++) {
      let costObj: any = {};
      let childrenArray: any[] = [];
      let parentObj: any = {};
      let yearCheckAdditionalChild = false;
      let yearCheckLargeChild = false;
      let yearCheckOverChild = false;
      let yearCheckSCCChild = false;
      let serviceDescVal = arrayLoop[loop];
      let serviceDesc = serviceDescVal.key;


      costObj['servicedesc'] = serviceDesc;
      costObj["sortOrder"] = this.accessorialDescMap.get(serviceDesc).sortOrder;
      costObj["childOrder"] = this.accessorialDescMap.get(serviceDesc).childOrder;
      var yearArray = inputyearHashMap.keys();
      var yearArrSize = inputyearHashMap.size;
      var yearArray1 = inputyearHashMap.size;

      var yearArr = [];
      for (let yearCnt = 0; yearCnt < yearArrSize; yearCnt++) {
        yearArr.push(yearArray.next());
      }



      for (var valueCount = 0; valueCount < yearArray1; valueCount++) {

        var yearVal = yearArr[valueCount].value + "";
        var valueMap = this.yearHashMap.get(yearVal);

        if (valueMap.get(serviceDesc) != null) {
          var value = await this.summingthevalues(valueMap.get(serviceDesc), serviceDesc);
          this.t006Obj = valueMap.get(serviceDesc);

          costObj[`value${valueCount}`] = Number(value);

          if (this.t006Obj.accessorialDesc == "Additional Handling 40lb Min. Billed Weight Count" || this.t006Obj.accessorialDesc == "Net Spend") {
            value = Number(this.t006Obj.yearAvg) || 0;
            totalnetspend = value + totalnetspend;
            costObj["total"] = Number(totalnetspend);

          }
          else if (this.t006Obj.accessorialDesc == "Additional Handling Surcharge") {
            totalAdditional = value + totalAdditional;
            costObj["total"] = Number(totalAdditional);

            if (yearCheckAdditionalChild == false) {
              yearCheckAdditionalChild = true;


              let childObj: any = {};
              let additionalChildServiceDesc = [
                "Additional Handling - Weight",
                "Additional Handling - Girth",
                "Additional Handling - Cubic Volume",
                "Additional Handling - Length",
                "Additional Handling - Width",
                "Additional Handling - Packaging"
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
                    const childValue = await this.summingthevalues(childMap.get(filterKey), filterKey);

                    childObj[`value${childCount}`] = Number(childValue);

                    childObj["servicedesc"] = filterKey;
                    childObj["sortOrder"] = this.accessorialDescMap.get(filterKey).sortOrder;
                    childObj["childOrder"] = this.accessorialDescMap.get(filterKey).childOrder;

                    totalnetspendchild += childValue;
                    childObj["total"] = Number(totalnetspendchild);
                  }

                }
                childrenArray.push(childObj)
              }

            }

          }
          else if (this.t006Obj.accessorialDesc == "Large Package Surcharge") {
            //value=  Number(this.t006Obj.yearAvg);
            totalLargePackage = value + totalLargePackage;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice( totalLargePackage ));
            costObj["total"] = Number(totalLargePackage);

            if (yearCheckLargeChild == false) {
              yearCheckLargeChild = true;
              // 
              let childObj: any = {};
              let largeChildServiceDesc = [
                "Large Package - Weight",
                "Large Package - Girth",
                "Large Package - Cubic Volume",
                "Large Package - Length",
              ];
              let filteredValues = largeChildServiceDesc
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
                    const childValue = await this.summingthevalues(childMap.get(filterKey), filterKey);
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
          else if (this.t006Obj.accessorialDesc == "Over Maximum Surcharge") {
            // value=  Number(this.t006Obj.yearAvg);
            totalOverMaximum = value + totalOverMaximum;
            // costObj["total"] ="$"+this.setCommaQty(this.set2dpforPrice( totalOverMaximum ));
            costObj["total"] = Number(totalOverMaximum);
            if (yearCheckOverChild == false) {
              yearCheckOverChild = true;

              let childObj: any = {};
              let OverChildServiceDesc = [
                "Over Maximum - Girth",
                "Over Maximum - Length",
                "Over Maximum - Weight",
              ];
              let filteredValues = OverChildServiceDesc
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
                    const childValue = await this.summingthevalues(childMap.get(filterKey), filterKey);
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
          else if (this.t006Obj.accessorialDesc == "Peak Surcharges" || this.t006Obj.accessorialDesc == "Peak/Demand Surcharges") {
            totalPeakSurcharges = value + totalPeakSurcharges;
            costObj["total"] = Number(totalPeakSurcharges);
          }
          else if (this.t006Obj.accessorialDesc == "Address Correction Fees") {
            totalAddressCorrection = value + totalAddressCorrection;
            costObj["total"] = Number(totalAddressCorrection);
          }
          else if (this.t006Obj.accessorialDesc == "Shipping Charge Correction Audit Fee") {

            totalShippingCharge += value;
            costObj["total"] = Number(totalShippingCharge);

            if (!yearCheckSCCChild) {

              yearCheckSCCChild = true;

              const sccChildServiceDesc = [
                "Shipping Charge Corrections - Net Spend",
                "% of Packages Missing Shipper Box Dims",
                "# of Packages Missing Shipper Box Dims",
                "# of Packages UPS Audited Shippers Box Dims"
              ];

              const filteredValues = sccChildServiceDesc
                .filter(desc => this.accessorialDescMap.has(desc))
                .map(desc => ({ key: desc, value: valueMap.get(desc) }));

              for (const filterItem of filteredValues) {

                let totalnetspendchild = 0;
                let divideBy = 0;

                const filterKey = filterItem.key;
                const childObj: any = {};

                for (let childCount = 0; childCount < yearArray1; childCount++) {

                  const yearChildVal = String(yearArr[childCount].value);
                  const childMap = this.yearHashMap.get(yearChildVal);

                  if (childMap != null) {

                    let childValue;

                    if (filterKey == "% of Packages Missing Shipper Box Dims") {

                      const childMapValue = childMap.get(filterKey);
                      childValue = Number(childMapValue?.yearAvg);

                      if (childValue != 0) {
                        divideBy++;
                      }

                    } else {

                      childValue = await this.summingthevalues(childMap.get(filterKey), filterKey);

                    }

                    childObj[`value${childCount}`] = Number(childValue);

                    childObj["servicedesc"] = filterKey;
                    childObj["sortOrder"] = this.accessorialDescMap.get(filterKey).sortOrder;
                    childObj["childOrder"] = this.accessorialDescMap.get(filterKey).childOrder;
                    totalnetspendchild += childValue;
                  }
                }

                if (filterKey == "% of Packages Missing Shipper Box Dims" && divideBy != 0) {
                  totalnetspendchild = totalnetspendchild / divideBy;
                }

                childObj["total"] = Number(totalnetspendchild);

                childrenArray.push(childObj);
              }
            }
          }
          else if (this.t006Obj.accessorialDesc == "Chargeback Fees") {
            totalChargebackFees = value + totalChargebackFees;
            costObj["total"] = Number(totalChargebackFees);
          }
          else if (this.t006Obj.accessorialDesc == "Early AM Surcharges") {
            totalEarlyAM = value + totalEarlyAM;
            costObj["total"] = Number(totalEarlyAM);
          }
          else if (this.t006Obj.accessorialDesc == "Late Payment Fees") {
            totalLatePayment = value + totalLatePayment;
            costObj["total"] = Number(totalLatePayment);
          }
          else if (this.t006Obj.accessorialDesc == "Print Invoice Fee") {
            totalPrintInvoiceFee = value + totalPrintInvoiceFee;
            costObj["total"] = Number(totalPrintInvoiceFee);
          }
          else if (this.t006Obj.accessorialDesc == "Missing PLD Fees") {
            totalMissingPLD = value + totalMissingPLD;
            costObj["total"] = Number(totalMissingPLD);
          }
          else if (this.t006Obj.accessorialDesc == "Non-Machineable Charges (SurePost)" || this.t006Obj.accessorialDesc == "Non-Standard Charges (SurePost)" || this.t006Obj.accessorialDesc == "Non-Standard Charges (Ground Saver)") {
            totalNonMachineable = value + totalNonMachineable;
            costObj["total"] = Number(totalNonMachineable);
          }
          else if (this.t006Obj.accessorialDesc == "Service Charge Fees") {
            totalServiceCharge = value + totalServiceCharge;
            costObj["total"] = Number(totalServiceCharge);
          }
          else if (this.t006Obj.accessorialDesc == "Third Party Billing Surcharges") {
            totalThirdParty = value + totalThirdParty;
            costObj["total"] = Number(totalThirdParty);
          }
          else if (this.t006Obj.accessorialDesc == "Undeliverable Returns Charges") {
            totalUndeliverable = value + totalUndeliverable;
            costObj["total"] = Number(totalUndeliverable);
          }
          else if (this.t006Obj.accessorialDesc == "Declared Value") {
            totalDeclaredValue = value + totalDeclaredValue;
            costObj["total"] = Number(totalDeclaredValue);
          }
          else if (this.t006Obj.accessorialDesc == "Air Shipping Documents (ASD) Charges") {
            totalAirShipping = value + totalAirShipping;
            costObj["total"] = Number(totalAirShipping);
          }
          else if (this.t006Obj.accessorialDesc == "GSR (Guaranteed Service Refunds)") {
            totalGSR = value + totalGSR;
            costObj["total"] = Number(totalGSR);
          }
          else if (this.t006Obj.accessorialDesc == "VOIDS") {
            totalVOIDS = value + totalVOIDS;
            costObj["total"] = Number(totalVOIDS);
          }
          else if (this.t006Obj.accessorialDesc == "Zone Adjustments") {
            totalZoneAdjustments = value + totalZoneAdjustments;
            costObj["total"] = Number(totalZoneAdjustments);
          }
          else if (this.t006Obj.accessorialDesc == "UPS Promo Discount") {
            totalUPSPromoDiscount = value + totalUPSPromoDiscount;
            costObj["total"] = Number(totalUPSPromoDiscount);
          }
          else if (this.t006Obj.accessorialDesc == "Call Tag") {
            totalCallTag = value + totalCallTag;
            costObj["total"] = Number(totalCallTag);
          }
          else if (this.t006Obj.accessorialDesc == "Credit Card Surcharge" || this.t006Obj.accessorialDesc == "Payment Processing Fee") {
            totalCreditCardSurcharge = value + totalCreditCardSurcharge;
            costObj["total"] = Number(totalCreditCardSurcharge);
          }
          else if (this.t006Obj.accessorialDesc == "Check Fees and Wire Fees") {
            totalCheckFeesandWireFees = value + totalCheckFeesandWireFees;
            costObj["total"] = Number(totalCheckFeesandWireFees);
          }
          else if (this.t006Obj.accessorialDesc == "Rebill Fee") {
            totalRebillFee = value + totalRebillFee;
            costObj["total"] = Number(totalRebillFee);
          }


        }
      }

      if (serviceDesc == "Additional Handling Surcharge" || serviceDesc == "Large Package Surcharge" || serviceDesc == "Over Maximum Surcharge" || serviceDesc == "Shipping Charge Correction Audit Fee") {

        parentObj = {
          ...costObj,
          expanded: false,
          children: childrenArray,
        };
        this.dpAC.push(parentObj);
      }

      else {
        if (costObj['childOrder'] == null || costObj['childOrder'] == undefined || costObj['childOrder'] == 0) {
          this.dpAC.push(costObj);
        }
      }
    }
    console.log(this.dpAC);

  }


  async resettingAdvanceDataGrid(): Promise<void> {

    const rdbtn_val = this.apiControllerFormGroup.get('searchcriteriabtn')?.value;

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

  async summingthevalues(t006Obj: any, serviceDesc: string): Promise<number> {
    if (!t006Obj) return 0;

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    // Sum all month values cleanly using array reduce
    const value = months.reduce((sum, month) => sum + (Number(t006Obj[month]) || 0), 0);

    return value;
  }

  async formGridColumn(inputColumnArray: Map<any, any> | any[], allColumnArray: any[] | null, masterMap: Map<string, string> | null) {
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
  }


  async myADG_itemClickHandler(event: string[]) {
    if (!event) return;

    const rdbtn_Select = this.treeFormGroup.get('children')?.value;
    const yeardata = this.apiControllerFormGroup.get('year')?.value || null;

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
        this.weekArrAll = this.weekAC.map((w, index) => ({ Week: w.Week, WeeekIndex: index, state: w.state }));

        // Fix: populate tempWeekIdArr with ALL weeks for the requested year
        // to maintain correct indexing (1..53) in formDataGridWeekData
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
        await this.formGridColumn(this.itemHashMap, weekItemAC, null);
        await this.formDataGridWeekData(yeardata, checkedItemAC);
      } else {
        const selectCount = this.chechisItemSelected(this.weekAC);
        if (selectCount === 0) {
          this.previousSelectedYear = null;
          await this.formGridColumn(this.itemHashMap, weekItemAC, null);
          await this.formDataGridWeekData(yeardata, checkedItemAC);
        }
      }
    }
  }

  chechisItemSelected(checkAC: any[]): number {
    return checkAC.some(item => item.state === 'checked') ? 1 : 0;
  }

  async formMonthMapFromResult(selectedYear: any) {
    var costOptYear = selectedYear;


    let totalnetspend = 0;
    let totalAdditional = 0;
    let totalLargePackage = 0;
    let totalOverMaximum = 0;
    let totalPeakSurcharges = 0;
    let totalAddressCorrection = 0;
    let totalShippingCharge = 0;
    let totalChargebackFees = 0;
    let totalEarlyAM = 0;
    let totalLatePayment = 0;
    let totalMissingPLD = 0;
    let totalNonMachineable = 0;
    let totalServiceCharge = 0;
    let totalThirdParty = 0;
    let totalUndeliverable = 0;
    let totalDeclaredValue = 0;
    let totalAirShipping = 0;
    let totalGSR = 0;
    let totalVOIDS = 0;
    let totalZoneAdjustments = 0;
    let totalUPSPromoDiscount = 0;
    let totalCallTag = 0;
    let totalCreditCardSurcharge = 0;
    let totalPrintInvoiceFee = 0;
    let totalAdditionalWeight = 0;
    let totalAdditionalGirth = 0;
    let totalAdditionalCubic = 0;
    let totalAdditionalLength = 0;
    let totalAdditionalWidth = 0;
    let totalAdditionalPackaging = 0;
    let totalLargeWeight = 0;
    let totalLargeGirth = 0;
    let totalLargeCubic = 0;
    let totalLargeLength = 0;
    let totalOverGirth = 0;
    let totalOverLength = 0;
    let totalOverWeight = 0;

    let monthHm = this.yearHashMapObj.get(selectedYear.toString());
    const monthFields = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    var divideBy = 0;

    for (var loop = 0; loop < this.resultAC.length; loop++) {
      let costObj: any = {};
      let testObj: any = this.resultAC[loop];

      if (testObj.year != selectedYear) {
        continue;
      }



      for (var monthLoop = 0; monthLoop < monthHm.size; monthLoop++) {
        var monthvalue = monthLoop + "";
        //var monthSaturdayAC=monthHm.get(monthLoop +"");

        var valueForMonth = 0;
        divideBy = 0;

        if (["Additional Handling 40lb Min. Billed Weight Count", "Net Spend"].includes(testObj.accessorialDesc)) {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalnetspend);
        }



        else if (testObj.accessorialDesc === "Additional Handling Surcharge") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditional);

        }

        else if (testObj.accessorialDesc === "Additional Handling - Weight") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditionalWeight);

        }

        else if (testObj.accessorialDesc === "Additional Handling - Girth") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditionalGirth);

        }
        else if (testObj.accessorialDesc === "Additional Handling - Cubic Volume") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditionalCubic);

        }
        else if (testObj.accessorialDesc === "Additional Handling - Length") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditionalLength);
        }
        else if (testObj.accessorialDesc === "Additional Handling - Width") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditionalWidth);
        }
        else if (testObj.accessorialDesc === "Additional Handling - Packaging") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = String(totalAdditionalPackaging);
        }
        else if (testObj.accessorialDesc === "Large Package Surcharge") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalLargePackage));

        }
        else if (testObj.accessorialDesc == "Large Package - Girth") {

          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalLargeGirth));
        }
        else if (testObj.accessorialDesc == "Large Package - Weight") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalLargeWeight));

        }
        else if (testObj.accessorialDesc == "Large Package - Cubic Volume") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalLargeCubic));

        }
        else if (testObj.accessorialDesc == "Large Package - Length") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalLargeLength));
        }

        else if (testObj.accessorialDesc == "Over Maximum Surcharge") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalOverMaximum));
        }
        else if (testObj.accessorialDesc == "Over Maximum - Girth") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalOverGirth));
        }

        else if (testObj.accessorialDesc == "Over Maximum - Length") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalOverLength));
        }

        else if (testObj.accessorialDesc == "Over Maximum - Weight") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalOverWeight));
        }

        else if (testObj.accessorialDesc == "Peak Surcharges" || testObj.accessorialDesc == "Peak/Demand Surcharges") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalPeakSurcharges));
        }

        else if (testObj.accessorialDesc == "Address Correction Fees") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalAddressCorrection));
        }
        else if (testObj.accessorialDesc == "Shipping Charge Correction Audit Fee") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalShippingCharge));
        }
        else if (testObj.accessorialDesc == "% of Packages Missing Shipper Box Dims") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalShippingCharge));
        }
        else if (testObj.accessorialDesc == "# of Packages Missing Shipper Box Dims") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalShippingCharge));
        }
        else if (testObj.accessorialDesc == "# of Packages UPS Audited Shippers Box Dims") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalShippingCharge));
        }
        else if (testObj.accessorialDesc == "Shipping Charge Corrections - Net Spend") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalShippingCharge));
        }
        if (testObj.accessorialDesc == "Chargeback Fees") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalChargebackFees));


        }
        if (testObj.accessorialDesc == "Early AM Surcharges") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalEarlyAM));
        }
        if (testObj.accessorialDesc == "Late Payment Fees") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalLatePayment));

        }
        if (testObj.accessorialDesc == "Print Invoice Fee") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalPrintInvoiceFee));
        }
        if (testObj.accessorialDesc == "Missing PLD Fees") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalMissingPLD));
        }
        if (testObj.accessorialDesc == "Non-Machineable Charges (SurePost)" || testObj.accessorialDesc == "Non-Standard Charges (SurePost)" || testObj.accessorialDesc == "Non-Standard Charges (Ground Saver)") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalNonMachineable));
        }
        if (testObj.accessorialDesc == "Service Charge Fees") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalServiceCharge));
        }
        if (testObj.accessorialDesc == "Third Party Billing Surcharges") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalThirdParty));
        }
        if (testObj.accessorialDesc == "Undeliverable Returns Charges") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalUndeliverable));
        }
        if (testObj.accessorialDesc == "Declared Value") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalDeclaredValue));
        }
        if (testObj.accessorialDesc == "Air Shipping Documents (ASD) Charges") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalAirShipping));
        }
        if (testObj.accessorialDesc == "GSR (Guaranteed Service Refunds)") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalGSR));
        }
        if (testObj.accessorialDesc == "VOIDS") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalVOIDS));
        }
        if (testObj.accessorialDesc == "Zone Adjustments") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalZoneAdjustments));
        }
        if (testObj.accessorialDesc == "UPS Promo Discount") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalUPSPromoDiscount));
        }
        if (testObj.accessorialDesc == "Call Tag") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalCallTag));
        }
        if (testObj.accessorialDesc == "Credit Card Surcharge" || testObj.accessorialDesc == "Payment Processing Fee") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalCreditCardSurcharge));
        }
        if (testObj.accessorialDesc == "Check Fees and Wire Fees") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalCreditCardSurcharge));
        }

        if (testObj.accessorialDesc == "Rebill Fee") {
          valueForMonth = Number(testObj[monthFields[monthLoop]]);
          costObj["total"] = this.set2dpforPrice(String(totalCreditCardSurcharge));
        }

        var valueMap = new Map();
        //if the year was already added to map , then get the map and get the value map and add this value to the map and reset it
        // if the year map does not contain such year, then create a new map and add it to the year

        if (this.monthHashMap.has(monthvalue)) {

          valueMap = this.monthHashMap.get(monthvalue);
          valueMap.delete(testObj.accessorialDesc);
        }
        else {

          valueMap = new Map()
        }

        valueMap.set(testObj.accessorialDesc, valueForMonth);


        //reset the value map to the year map 
        await this.monthHashMap.set(monthvalue, valueMap);

      }

      console.log(this.monthHashMap);
    }
  }

  async formDataGridMonthData(inputMonthHm: any) {
    this.dpAC = [];
    var serviceDescAC = this.accessorialDescMap.keys();
    var totalShipmentsPackage = 0;
    var totalnetspend = 0;
    var totalAdditional = 0;
    var totalLargePackage = 0;
    var totalOverMaximum = 0;
    var totalPeakSurcharges = 0;
    var totalAddressCorrection = 0;
    var totalShippingCharge = 0;
    var totalChargebackFees = 0;
    var totalEarlyAM = 0;
    var totalLatePayment = 0;
    var totalMissingPLD = 0;
    var totalNonMachineable = 0;
    var totalServiceCharge = 0;
    var totalThirdParty = 0;
    var totalUndeliverable = 0;
    var totalDeclaredValue = 0;
    var totalAirShipping = 0;
    var totalGSR = 0;
    var totalVOIDS = 0;
    var totalZoneAdjustments = 0;
    var totalUPSPromoDiscount = 0;
    var totalCallTag = 0;
    var totalCreditCardSurcharge = 0;
    var totalPrintInvoiceFee = 0;
    var totalCheckFeesandWireFees = 0;
    var totalRebillFee = 0;
    var arrayLoop = [];
    for (let [key, value] of this.accessorialDescMap) {

      arrayLoop.push({ key })
    }
    for (var loop = 0; loop < this.accessorialDescMap.size; loop++) {
      let costObj: any = {};
      let childrenArray: any = [];
      let parentObj: any = {};
      let checkAdditionalChild: any = false;
      let checkLargeChild: any = false;
      let checkOverChild: any = false;
      let checkSCCChild: any = false;
      let serviceDescVal: any = arrayLoop[loop];
      let serviceDesc: any = serviceDescVal.key;


      costObj["servicedesc"] = serviceDesc;
      let monthArray = inputMonthHm.keys();
      let monthArray1 = inputMonthHm.size;
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
            let value = valueMap.get(serviceDesc);
            costObj[`value${valueCount}`] = Number(value);

            if (serviceDesc == "Additional Handling 40lb Min. Billed Weight Count" || serviceDesc == "Net Spend") {
              totalnetspend = value + totalnetspend;

              // costObj["total"] =this.setCommaQty( String(totalnetspend)) ;
              costObj["total"] = Number(totalnetspend);
            }

            if (serviceDesc === "Additional Handling Surcharge") {

              totalAdditional += value;
              costObj["total"] = Number(totalAdditional);

              if (!checkAdditionalChild) {

                checkAdditionalChild = true;

                const additionalChildServiceDesc = [
                  "Additional Handling - Weight",
                  "Additional Handling - Girth",
                  "Additional Handling - Cubic Volume",
                  "Additional Handling - Length",
                  "Additional Handling - Width",
                  "Additional Handling - Packaging"
                ].filter(desc => this.accessorialDescMap.has(desc));

                for (const filterKey of additionalChildServiceDesc) {

                  const childObj: any = {
                    servicedesc: filterKey,
                    sortOrder: this.accessorialDescMap.get(filterKey).sortOrder,
                    childOrder: this.accessorialDescMap.get(filterKey).childOrder
                  };

                  let childTotal = 0;

                  for (let i = 0; i < monthArray1; i++) {

                    const monthVal = String(monthArr[i].value);
                    const childMap = this.monthHashMap.get(monthVal);
                    const childValue = childMap?.get(filterKey) || 0;

                    childObj[`value${i}`] = Number(childValue);
                    childTotal += Number(childValue);
                  }

                  childObj["total"] = Number(childTotal);

                  childrenArray.push(childObj);
                }
              }
            }
            if (serviceDesc === "Large Package Surcharge") {

              totalLargePackage += value;
              costObj["total"] = Number(totalLargePackage);

              if (!checkLargeChild) {

                checkLargeChild = true;

                const largeChildServiceDesc = [
                  "Large Package - Weight",
                  "Large Package - Girth",
                  "Large Package - Cubic Volume",
                  "Large Package - Length"
                ].filter(desc => this.accessorialDescMap.has(desc));

                for (const filterKey of largeChildServiceDesc) {

                  const childObj: any = {
                    servicedesc: filterKey,
                    sortOrder: this.accessorialDescMap.get(filterKey).sortOrder,
                    childOrder: this.accessorialDescMap.get(filterKey).childOrder
                  };

                  let childTotal = 0;

                  for (let i = 0; i < monthArray1; i++) {

                    const monthVal = String(monthArr[i].value);
                    const childMap = this.monthHashMap.get(monthVal);
                    const childValue = childMap?.get(filterKey) || 0;

                    childObj[`value${i}`] = Number(childValue);
                    childTotal += Number(childValue);
                  }

                  childObj["total"] = Number(childTotal);

                  childrenArray.push(childObj);
                }
              }
            }
            if (serviceDesc === "Over Maximum Surcharge") {

              totalOverMaximum += value;
              costObj["total"] = Number(totalOverMaximum);

              if (!checkOverChild) {

                checkOverChild = true;

                const overChildServiceDesc = [
                  "Over Maximum - Girth",
                  "Over Maximum - Length",
                  "Over Maximum - Weight"
                ].filter(desc => this.accessorialDescMap.has(desc));

                for (const filterKey of overChildServiceDesc) {

                  const childObj: any = {
                    servicedesc: filterKey,
                    sortOrder: this.accessorialDescMap.get(filterKey).sortOrder,
                    childOrder: this.accessorialDescMap.get(filterKey).childOrder
                  };

                  let childTotal = 0;

                  for (let i = 0; i < monthArray1; i++) {

                    const monthVal = String(monthArr[i].value);
                    const childMap = this.monthHashMap.get(monthVal);
                    const childValue = childMap?.get(filterKey) || 0;

                    childObj[`value${i}`] = Number(childValue);
                    childTotal += Number(childValue);
                  }

                  childObj["total"] = Number(childTotal);

                  childrenArray.push(childObj);
                }
              }
            }
            if (serviceDesc == "Peak Surcharges" || serviceDesc == "Peak/Demand Surcharges") {
              totalPeakSurcharges = value + totalPeakSurcharges;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalPeakSurcharges)) );
              costObj["total"] = Number(totalPeakSurcharges);
            }
            if (serviceDesc == "Address Correction Fees") {
              totalAddressCorrection = value + totalAddressCorrection;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalAddressCorrection)) );
              costObj["total"] = Number(totalAddressCorrection);
            }
            if (serviceDesc === "Shipping Charge Correction Audit Fee") {

              totalShippingCharge += value;
              costObj["total"] = Number(totalShippingCharge);

              if (!checkSCCChild) {

                checkSCCChild = true;

                const sccChildServiceDesc = [
                  "Shipping Charge Corrections - Net Spend",
                  "% of Packages Missing Shipper Box Dims",
                  "# of Packages Missing Shipper Box Dims",
                  "# of Packages UPS Audited Shippers Box Dims"
                ];

                const filteredValues = sccChildServiceDesc
                  .filter(desc => this.accessorialDescMap.has(desc));

                for (const filterKey of filteredValues) {

                  const childObj: any = {
                    servicedesc: filterKey,
                    sortOrder: this.accessorialDescMap.get(filterKey).sortOrder,
                    childOrder: this.accessorialDescMap.get(filterKey).childOrder
                  };

                  let totalChild = 0;
                  let divideBy = 0;

                  for (let i = 0; i < monthArray1; i++) {

                    const monthVal = String(monthArr[i].value);
                    const childMap = this.monthHashMap.get(monthVal);
                    const childValue = childMap?.get(filterKey) || 0;

                    childObj[`value${i}`] = Number(childValue);

                    if (filterKey === "% of Packages Missing Shipper Box Dims" && Number(childValue) !== 0) {
                      divideBy++;
                    }

                    totalChild += Number(childValue);
                  }

                  if (filterKey === "% of Packages Missing Shipper Box Dims" && divideBy !== 0) {
                    totalChild = totalChild / divideBy;
                  }

                  childObj["total"] = Number(totalChild);

                  childrenArray.push(childObj);
                }
              }
            }
            if (serviceDesc == "Chargeback Fees") {
              totalChargebackFees = value + totalChargebackFees;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalChargebackFees)) );
              costObj["total"] = Number(totalChargebackFees);
            }
            if (serviceDesc == "Early AM Surcharges") {
              totalEarlyAM = value + totalEarlyAM;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalEarlyAM)) );
              costObj["total"] = Number(totalEarlyAM);
            }
            if (serviceDesc == "Late Payment Fees") {
              totalLatePayment = value + totalLatePayment;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalLatePayment)) );
              costObj["total"] = Number(totalLatePayment);
            }
            if (serviceDesc == "Print Invoice Fee") {
              totalPrintInvoiceFee = value + totalPrintInvoiceFee;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalPrintInvoiceFee)) );
              costObj["total"] = Number(totalPrintInvoiceFee);
            }
            if (serviceDesc == "Missing PLD Fees") {
              totalMissingPLD = value + totalMissingPLD;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalMissingPLD)) );
              costObj["total"] = Number(totalMissingPLD);
            }
            if (serviceDesc == "Non-Machineable Charges (SurePost)" || serviceDesc == "Non-Standard Charges (SurePost)" || serviceDesc == "Non-Standard Charges (Ground Saver)") {
              totalNonMachineable = value + totalNonMachineable;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalNonMachineable)) );
              costObj["total"] = Number(totalNonMachineable);
            }
            if (serviceDesc == "Service Charge Fees") {
              totalServiceCharge = value + totalServiceCharge;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalServiceCharge)) );
              costObj["total"] = Number(totalServiceCharge);
            }
            if (serviceDesc == "Third Party Billing Surcharges") {
              totalThirdParty = value + totalThirdParty;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalThirdParty)) );
              costObj["total"] = Number(totalThirdParty);
            }
            if (serviceDesc == "Undeliverable Returns Charges") {
              totalUndeliverable = value + totalUndeliverable;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalUndeliverable)) );
              costObj["total"] = Number(totalUndeliverable);
            }
            if (serviceDesc == "Declared Value") {
              totalDeclaredValue = value + totalDeclaredValue;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalDeclaredValue)) );
              costObj["total"] = Number(totalDeclaredValue);
            }
            if (serviceDesc == "Air Shipping Documents (ASD) Charges") {
              totalAirShipping = value + totalAirShipping;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalAirShipping)) );
              costObj["total"] = Number(totalAirShipping);
            }
            if (serviceDesc == "GSR (Guaranteed Service Refunds)") {
              totalGSR = value + totalGSR;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalGSR)) );
              costObj["total"] = Number(totalGSR);
            }
            if (serviceDesc == "VOIDS") {
              totalVOIDS = value + totalVOIDS;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalVOIDS)) );
              costObj["total"] = Number(totalVOIDS);
            }
            if (serviceDesc == "Zone Adjustments") {
              totalZoneAdjustments = value + totalZoneAdjustments;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalZoneAdjustments)) );
              costObj["total"] = Number(totalZoneAdjustments);
            }
            if (serviceDesc == "UPS Promo Discount") {
              totalUPSPromoDiscount = value + totalUPSPromoDiscount;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalUPSPromoDiscount)) );
              costObj["total"] = Number(totalUPSPromoDiscount);
            }
            if (serviceDesc == "Call Tag") {
              totalCallTag = value + totalCallTag;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalCallTag)) );
              costObj["total"] = Number(totalCallTag);
            }
            if (serviceDesc == "Credit Card Surcharge" || serviceDesc == "Payment Processing Fee") {
              totalCreditCardSurcharge = value + totalCreditCardSurcharge;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalCreditCardSurcharge)) );
              costObj["total"] = Number(totalCreditCardSurcharge);
            }
            if (serviceDesc == "Check Fees and Wire Fees") {
              totalCheckFeesandWireFees = value + totalCheckFeesandWireFees;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalCheckFeesandWireFees)) );
              costObj["total"] = Number(totalCheckFeesandWireFees);
            }
            if (serviceDesc == "Rebill Fee") {
              totalRebillFee = value + totalRebillFee;

              // costObj["total"] ="$"+ this.setCommaQty( this.set2dpforPrice(String(totalRebillFee)) );
              costObj["total"] = Number(totalRebillFee);
            }
          }
        }

      }

      if (serviceDesc == "Additional Handling Surcharge" || serviceDesc == "Large Package Surcharge" || serviceDesc == "Over Maximum Surcharge" || serviceDesc == "Shipping Charge Correction Audit Fee") {

        const parentObj = {
          ...costObj,
          expanded: false,
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
    console.log(this.dpAC);

  }

  async formDataGridWeekData(selectedYear: any, selectitem: any) {
    this.costOptYear = selectedYear;
    this.dpAC = [];

    // var serviceDescAC=this.accessorialDescMap.keys();
    var arrayLoop = [];
    for (let [key, value] of this.accessorialDescMap) {

      arrayLoop.push({ key })

    }
    var totalWeek = 0;
    for (var loop = 0; loop < this.accessorialDescMap.size; loop++) {
      let costObj: any = {};
      let childrenArray: any = [];
      let parentObj: any = {};
      let weekCheckAdditionalChild = false;

      let serviceDescVal = arrayLoop[loop];
      let serviceDesc = serviceDescVal.key;
      costObj["servicedesc"] = serviceDesc;
      costObj["sortOrder"] = this.accessorialDescMap.get(serviceDesc).sortOrder;
      costObj["childOrder"] = this.accessorialDescMap.get(serviceDesc).childOrder;

      var valueMap = this.yearHashMap.get(selectedYear);
      if (valueMap.get(serviceDesc) != null) {

        const serviceData = valueMap.get(serviceDesc);

        for (let i = 0; i < this.tempWeekIdArr.length; i++) {
          if (this.tempWeekIdArr[i]?.weekindex != null) {
            costObj[`value${i}`] = Number(serviceData?.[`w${i + 1}`]);
          }
        }
        totalWeek = 0;

        if (serviceDesc == "Additional Handling Surcharge" || serviceDesc == "Large Package Surcharge" || serviceDesc == "Over Maximum Surcharge" || serviceDesc == "Shipping Charge Correction Audit Fee") {

          for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
            if (this.tempWeekIdArr[i].weekstate === 'checked') {
              totalWeek += Number(this.removeCommas(costObj[`value${i}`]));
            }
          }

          costObj["total"] = Number(totalWeek);

          if (weekCheckAdditionalChild == false) {
            weekCheckAdditionalChild = true;

            let childObj = {};
            let ChildServiceDesc: any;
            if (serviceDesc == "Additional Handling Surcharge") {
              ChildServiceDesc = [
                "Additional Handling - Weight",
                "Additional Handling - Girth",
                "Additional Handling - Cubic Volume",
                "Additional Handling - Length",
                "Additional Handling - Width",
                "Additional Handling - Packaging"
              ]
            } else if (serviceDesc == "Large Package Surcharge") {
              ChildServiceDesc = [
                "Large Package - Weight",
                "Large Package - Girth",
                "Large Package - Cubic Volume",
                "Large Package - Length",
              ];
            } else if (serviceDesc == "Over Maximum Surcharge") {
              ChildServiceDesc = [
                "Over Maximum - Girth",
                "Over Maximum - Length",
                "Over Maximum - Weight",
              ];
            } else if (serviceDesc == "Shipping Charge Correction Audit Fee") {
              ChildServiceDesc = [
                "Shipping Charge Corrections - Net Spend",
                "% of Packages Missing Shipper Box Dims",
                "# of Packages Missing Shipper Box Dims",
                "# of Packages UPS Audited Shippers Box Dims"
              ];
            }
            let filteredValues = ChildServiceDesc
              .filter((desc: any) => this.accessorialDescMap.has(desc))       // Keep only if key exists
              .map((desc: any) => ({ key: desc, value: valueMap.get(desc) })); // Get the value
            for (var i = 0; i < filteredValues.length; i++) {
              let totalnetspendchild = 0;
              let childObj: any = {}
              let totalChildWeek = 0;
              let filterItem = filteredValues[i];
              let filterKey = filterItem.key;

              const weekData = valueMap.get(filterKey);

              if (weekData != null) {

                let totalChildWeek = 0;

                for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {

                  if (this.tempWeekIdArr[i]?.weekindex != null) {

                    const weekKey = `w${i + 1}`;
                    const value = Number(weekData?.[weekKey] || 0);

                    childObj[`value${i}`] = value;

                    if (this.tempWeekIdArr[i].weekstate === 'checked') {
                      totalChildWeek += Number(this.removeCommas(value));
                    }
                  }
                }

                childObj["servicedesc"] = filterKey;
                childObj["sortOrder"] = this.accessorialDescMap.get(filterKey).sortOrder;
                childObj["childOrder"] = this.accessorialDescMap.get(filterKey).childOrder;
                if (filterKey == "% of Packages Missing Shipper Box Dims") {

                  let divideBy = 0;

                  for (let cnt = 0; cnt < this.tempWeekIdArr.length; cnt++) {
                    if (this.tempWeekIdArr[cnt]?.weekindex != null) {

                      const key = `w${cnt + 1}`;

                      if (Number(weekData?.[key]) != 0) {
                        divideBy++;
                      }
                    }
                  }

                  if (divideBy != 0) {
                    totalChildWeek = totalChildWeek / divideBy;
                  }
                }

                childObj["total"] = Number(totalChildWeek);

                childrenArray.push(childObj);
              }

            }

          }

        } else {
          for (let i = 0; i < this.tempWeekIdArr.length && i < 53; i++) {
            if (this.tempWeekIdArr[i].weekstate === 'checked') {
              totalWeek += Number(this.removeCommas(costObj[`value${i}`]));
            }
          }
          costObj["total"] = Number(totalWeek);
        }
      }

      if (serviceDesc == "Additional Handling Surcharge" || serviceDesc == "Large Package Surcharge" || serviceDesc == "Over Maximum Surcharge" || serviceDesc == "Shipping Charge Correction Audit Fee") {

        parentObj = {
          ...costObj,
          expanded: false,
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
    console.log(this.dpAC);
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

      value = parseFloat(value_price).toFixed(2);
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

  isYearChecked(year: string): boolean {
    return this.selectedYearCheckboxes.has(year);
  }

  // ── Search Menu Logic ─────────────────────────────────────────────

  openEnd(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }

  async onYearChange(year: string): Promise<void> {
    // store the value that was previously in the control in case we need to
    // roll back (e.g. the backend returns no rows for the newly chosen year).
    const previous = this.apiControllerFormGroup.get('year')?.value;

    // optimistically update the UI so that the dropdown and month/week
    // lists appear to react immediately.  these changes may be reverted below
    // if the fetch comes back empty.
    this.displayYear = year;
    this.selectedYear.set(year);
    this.apiControllerFormGroup.get('year')?.setValue(year);
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

  isAllSelected(month: Month): boolean {
    return month.dates && month.dates.length > 0 && month.dates.every(d => d.selected);
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
        // Only pick a default if we're not currently selecting multiple years
        // or if we really have no selection at all.
        const today = new Date();
        let defaultIdx = 0;
        if (Number(year) === today.getFullYear()) {
          defaultIdx = today.getMonth();
        }
        if (defaultIdx < data.length) {
          // data[defaultIdx].selected = true; // Disabled auto-select to avoid confusion in multi-year
        }
      }
      this.months.set(data);
    }
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

  isIndeterminate(month: Month): boolean {
    const selectedCount = month.dates.filter(d => d.selected).length;
    return selectedCount > 0 && selectedCount < month.dates.length;
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

  async onTabChange(event: any): Promise<void> {
    const tabs = ['year', 'month', 'week'];
    const selectedTab = tabs[event.index];
    this.selectedTab.set(selectedTab);

    // Update underlying form controls so the grid logic knows which selection mode is active
    this.apiControllerFormGroup.get('searchcriteriabtn')?.setValue(selectedTab);
    this.treeFormGroup.get('children')?.setValue(selectedTab);

    // If switching to Month or Week tab, ensure only one year is selected to comply with requirements
    if (selectedTab === 'month' || selectedTab === 'week') {
      if (this.selectedYearCheckboxes.size > 1) {
        const sortedYears = Array.from(this.selectedYearCheckboxes).sort();
        const latestYear = sortedYears[sortedYears.length - 1];

        this.selectedYearCheckboxes.clear();
        this.selectedYearCheckboxes.add(latestYear);
        this.selectedYear.set(latestYear);
        this.apiControllerFormGroup.get('year')?.setValue(latestYear);

        // Clear selections for all other years in month/week arrays
        this.monthAC.forEach(m => {
          if (m.Year?.toString() !== latestYear) m.state = 'unchecked';
        });
        this.weekAC.forEach(w => {
          if (w.Year?.toString() !== latestYear) w.state = 'unchecked';
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
        // Default to showing all months for the active year ONLY IF THE YEAR IS CHECKED
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
        // Default to showing all weeks for the active year ONLY IF THE YEAR IS CHECKED
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

  // Helper method used by myADG_itemClickHandler
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

  async checkTree() {
    const nodeVal = this.treeFormGroup.get('children')?.value;
    this.apiControllerFormGroup.get('searchcriteriabtn')?.setValue(nodeVal);
    this.syncSelectionsAndRefresh();
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
    await this.fetchCostOptimizationDetails();
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

    const year = this.apiControllerFormGroup.get('year')?.value;
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

            if (count === 8 && childCount === 2) {
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
      count === 1 || (count === 8 && (childCount === 3 || childCount === 4));

    const isPercentage =
      count === 8 && childCount === 2;

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

  selectValue = ['Choice 1', 'Choice 2', 'Choice 3'];
}
