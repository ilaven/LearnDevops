import { DatePipe } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
  TemplateRef,
  signal,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { Workbook } from 'exceljs';
import { map, startWith } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as fs from 'file-saver';
import { HttpDhlService } from 'src/app/core/services/httpdhl.service';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';

type ChargeType = 'Freight' | 'Accessorial' | string;

export interface UpsChargeRow {
  group: string;
  type: ChargeType;

  netCharge?: number | null;
  numberOfPackages?: number | null;

  avgCost?: number | null;
  costPerPound?: number | null;
  totalWeight?: number | null;

  percentOfSpend?: number | null;

  avgWeight?: number | null;
  avgZone?: number | null;

  avgGrossRate?: number | null;
  grossCharge?: number | null;

  avgDiscountPercent?: number | null;
  zeroChargePackageCount?: number | null;
}

type ColumnKey =
  | 'type'
  | 'netCharge'
  | 'numberOfPackages'
  | 'avgCost'
  | 'costPerPound'
  | 'totalWeight'
  | 'percentOfSpend'
  | 'avgWeight'
  | 'avgZone'
  | 'avgGrossRate'
  | 'grossCharge'
  | 'avgDiscountPercent'
  | 'zeroChargePackageCount';

interface ColumnDef {
  key: ColumnKey;
  label: string;
  visible: boolean;
  align?: 'start' | 'end';
}

interface SummaryRow {
  type: string;
  netCharge: number;
  packages: number | null;
  percent: number | null; // store like 37.45 (NOT 0.3745)
}

@Component({
  selector: 'app-dhl-charge-description',
  templateUrl: './charge-description.component.html',
  styleUrls: ['./charge-description.component.scss'],
  standalone: false
})
export class DhlChargeDescriptionComponent implements OnInit, AfterViewInit {
  // Scroll references
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('bottomScroll') bottomScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('metricsTable') metricsTable!: ElementRef<HTMLTableElement>;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('allSelectedValue') private allSelectedValue!: MatOption;
  @ViewChild('accNoSel') private accNoSel!: MatSelect;

  // Column picker
  showColumnPicker = false;
  attribute: any;
  selectedReport: string = '';

  // Prevent scroll feedback loop
  private syncing = false;
  dolVal: string = '';
  currentDate: Date = new Date();
  fromDate: any;
  toDate: any;
  tempfromDate: Date = new Date();
  temptoDate: Date = new Date();
  fromDateFormat: any;
  toDateFormat: any;
  clientType = signal<any>('');
  isLoading = true;
  randomNumber: any;
  searchActive = true;
  fromDateTemp: Date = new Date();
  toDateTemp: Date = new Date();
  filtereUPSAccountNo: any;
  account_detailsArr: any[] = [];
  userProfifleVal: any;
  userProfifle: any;
  clientID: any;
  clientName: any;
  fileStartDate: any;
  fileEndDate: any;
  carrierType: any;
  dataasof: any;
  dataasofFormat: any;
  dataasoffFormat: any;
  panelClass: string = '';
  clientProfileList: any[] = [];
  userProfifleData: any[] = [];
  fetchChargeDescriptionDetails: any = [];
  reportName: any;
  displayedColumns: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.fetchChargeDescriptionDetails);
  showInternationalShpmntBt = false;
  txt_lbl: any;
  typeData: any;
  account_details: number = 0;
  freightNetAmount: number = 0;
  accesorialNetAmount: number = 0;
  totalNetAmount: number = 0;
  freightNoofShipment: number = 0;
  freightSpend: number = 0;
  accesorialSpend: number = 0;
  airFRTGround: number = 0;
  air: number = 0;
  groundFRTGround: number = 0;
  ground: number = 0;
  totalAirGround: number = 0;
  groundSpend: number = 0;
  airSpend: number = 0;
  openModalConfig: any;
  columns: any[] = [];
  reportNameSearched: any;
  IsaccessorialCombined: boolean = false;
  plussign: boolean = false;
  buttonName: any;
  Defaultvalue = 'ALL';
  defaultvalueArr = ["ALL"];
  loginId = 123;
  allSelected = true;
  filtereAccountNo: any;
  totalShipments = 0;
  totalPieces = 0;


  //form group
  apiControllerFormGroup: FormGroup;
  reportFormGroup: FormGroup;

  // =======================
  // TABLE 1 & 2 data
  // =======================
  summaryData: SummaryRow[] = [
    { type: 'Freight', netCharge: 358591.59, packages: 58126, percent: 72.89 },
    { type: 'Accessorial', netCharge: 133352.44, packages: null, percent: 27.11 }
  ];

  summaryDataFRT: SummaryRow[] = [
    { type: 'Just FRT Ground', netCharge: 317850.17, packages: 55351, percent: 88.64 },
    { type: 'Just FRT Air', netCharge: 40741.42, packages: 2775, percent: 11.36 }
  ];

  get totalNetCharge(): number {
    return this.summaryData.reduce((s, r) => s + (r.netCharge ?? 0), 0);
  }
  get totalPackages(): number {
    return this.summaryData.reduce((s, r) => s + (r.packages ?? 0), 0);
  }

  get totalNetChargeFRT(): number {
    return this.summaryDataFRT.reduce((s, r) => s + (r.netCharge ?? 0), 0);
  }
  get totalPackagesFRT(): number {
    return this.summaryDataFRT.reduce((s, r) => s + (r.packages ?? 0), 0);
  }

  // =======================
  // TABLE 3 data
  // =======================
  chargeRows: UpsChargeRow[] = [];

  // -----------------------------------
  // Lifecycle
  constructor(private cookiesService: CookiesService,
    private loaderService: LoaderService, private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe, private commonService: CommonService,
    private httpDhlService: HttpDhlService, private dialog: MatDialog
    , private cd: ChangeDetectorRef
  ) {
    this.apiControllerFormGroup = new FormGroup({
      fromdate: new FormControl(''),
      todate: new FormControl(''),
      clientname: new FormControl(''),
      accNo: new FormControl('ALL'),
      report: new FormControl(''),
      ipaddress: new FormControl(''),
      city: new FormControl(''),
      region: new FormControl(''),
      country: new FormControl(''),
      loginclientName: new FormControl(''),
      clientNameselected: new FormControl(''),
      location: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      clientId: new FormControl(''),
      reportType: new FormControl(''),
      status: new FormControl(''),
      reportFormat: new FormControl(''),
      moduleName: new FormControl(''),
      login_id: new FormControl(''),
      accountNumber: new FormControl('ALL'),
      designFileName: new FormControl(''),
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
      }),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      })

    })

    this.reportFormGroup = new FormGroup({
      downloadReport: new FormControl('ADVANCE_CHARGE_DESCRIPTION'),
      reportLogId: new FormControl(''),
      t001ClientProfile: new FormControl({ clientId: new FormControl('') }),
    });
  }
  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  ngOnInit(): void {
    this.chargeRows = this.parseUpsChargeTable(this.rawChargeTableText);


    this.initializeDefaults(); // some pending
    this.currentDate = new Date();
    this.openLoading();
    var date = new Date();
    var monthStartDay = new Date(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    var monthEndDay = new Date(new Date(date.getFullYear(), date.getMonth(), 0));
    // var tempmonthStartDay =monthStartDay.toString();
    //  var tempmonthEndDay =monthEndDay.toString();
    /* Invoice Date range change to Week level Start */
    var startdate = new Date();
    let getdate = this.datePipe.transform(startdate, 'yyyy,M,d');

    var dt = new Date(getdate?.toString() ?? '');
    var diff = dt.getDate() - dt.getDay() + (dt.getDay() === 0 ? -6 : 1);
    var startdateofweekTemp = new Date(dt.setDate(diff));
    dt = new Date(getdate?.toString() ?? '');
    var lastday = dt.getDate() - (dt.getDay() - 1) + 6;
    var EnddateofweekTemp = new Date(dt.setDate(lastday));
    const tempmonthStartDay = new Date(Number(startdateofweekTemp));
    tempmonthStartDay.setDate(startdateofweekTemp.getDate() - 14);
    const tempmonthEndDay = new Date(Number(EnddateofweekTemp));
    tempmonthEndDay.setDate(EnddateofweekTemp.getDate() - 15);
    /* Invoice Date range change to Week level End */

    // Check if the years are different, then set same years for UPS
    if (tempmonthStartDay.getFullYear() !== tempmonthEndDay.getFullYear()) {
      tempmonthStartDay.setMonth(0); // January
      tempmonthStartDay.setDate(1); // 1st
      tempmonthStartDay.setFullYear(tempmonthEndDay.getFullYear()); // Match year with tempmonthEndDay
    }

    //trackingDate
    this.fromDate = this.datePipe.transform(tempmonthStartDay, "yyyy-MM-dd");
    this.toDate = this.datePipe.transform(tempmonthEndDay, "yyyy-MM-dd");
    this.tempfromDate = tempmonthStartDay;
    this.temptoDate = tempmonthEndDay;
    //added for change - T_13852
    this.fromDateFormat = this.datePipe.transform(tempmonthStartDay, "MMM dd,yyyy");
    this.toDateFormat = this.datePipe.transform(tempmonthEndDay, "MMM dd,yyyy");

    //added for change - T_13852
    this.apiControllerFormGroup.patchValue({
      dateRange: { "start": new Date(this.fromDate), "end": new Date(this.toDate) }
    });

    this.filtereAccountNo = this.apiControllerFormGroup.get("accountNumber")?.valueChanges.pipe(startWith(''),
      map(accountnumber => accountnumber != '' ? this._filterAccountNo(accountnumber) : this.account_detailsArr.slice())
    );

    setTimeout(() => {
      this.searchActive = false;
    }, 15000);
    this.getUser();


  }

  private initializeDefaults(): void {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.dolVal = "excelconvert";
  }

  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  _filterAccountNo(value: string): any[] {

    if (typeof value !== 'string')
      return [];
    return this.account_detailsArr.filter(accountnumber => accountnumber.accountNo.toLowerCase().includes(value.toLowerCase()));
  }

  async getUser(): Promise<void> {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    this.fileStartDate = this.userProfifle.fileStartDate;
    this.fileEndDate = this.userProfifle.fileEndDate;

    this.carrierType = this.userProfifle.carrierType;
    var fromDate = await this.fromDate;
    var toDate = await this.toDate;
    this.dataasof = this.userProfifle.dataasof;
    this.dataasofFormat = this.datePipe.transform(this.dataasof, "MMM dd,yyyy");
    const formattedDate = this.datePipe.transform(this.dataasof, 'MM/dd/yyyy');
    this.dataasoffFormat = formattedDate ? new Date(formattedDate) : null;

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

    this.apiControllerFormGroup.get('fromdate')?.setValue(fromDate);
    this.apiControllerFormGroup.get('todate')?.setValue(toDate);
    this.apiControllerFormGroup.get('fromDate')?.setValue(fromDate);
    this.apiControllerFormGroup.get('toDate')?.setValue(toDate);
    await this.apiControllerFormGroup.get('clientId')?.setValue(this.clientID);
    var accountNo = await this.fetchaccountDetails();
    //await this.apiControllerFormGroup.get('clientName').setValue(this.clientName);
    await this.apiControllerFormGroup.get('clientId')?.setValue(this.clientID);


    await this.apiControllerFormGroup.get('report')?.setValue("Freight_Accessorial_Separated");
    await this.fetchAdvanceChargeDescriptionDetails();
    this.apiControllerFormGroup.get('fromdate')?.setValue(new Date(this.tempfromDate));
    this.apiControllerFormGroup.get('todate')?.setValue(new Date(this.temptoDate));



  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }

  async fetchaccountDetails(): Promise<void> {
    const tempaccNoArr = this.apiControllerFormGroup.get('accountNumber')?.value;
    const containsAll = tempaccNoArr?.[0]?.includes('ALL');

    if (tempaccNoArr === 'ALL' || tempaccNoArr === '' || tempaccNoArr != null || containsAll) {
      this.apiControllerFormGroup.get('accNo')?.setValue(null);
    } else {
      const tempaccNo = tempaccNoArr.join('@');
      this.apiControllerFormGroup.get('accNo')?.setValue(tempaccNo);
    }

    this.httpDhlService.fetchaccountDetails(this.apiControllerFormGroup.value).subscribe({
      next: result => {
        this.account_detailsArr = result;

        this.account_detailsArr.forEach((item, index) => {
          if (!item.nickName) {
            this.account_detailsArr[index].nickName = item.accountNo;
          } else {
            this.account_detailsArr[index].nickName = `${item.accountNo} - <span>${item.nickName}</span>`;
          }
        });

        const accountNo = result[0]; // preserved logic
      },
      error: err => {
        console.error('error', err);
      }
    });

    this.apiControllerFormGroup.get('accNo')?.setValue(tempaccNoArr);
  }

  async fetchAdvanceChargeDescriptionDetails(): Promise<void> {
    var tempaccNoArr = this.apiControllerFormGroup.get('accountNumber')?.value;
    var containsAll = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == 'ALL' || tempaccNoArr == "" || containsAll == true) {
      var accno = null;
      this.apiControllerFormGroup.get('accNo')?.setValue(accno);

    } else {
      var tempaccNo = tempaccNoArr.join('@');

      this.apiControllerFormGroup.get('accNo')?.setValue(tempaccNo);
    }
    this.reportName = this.apiControllerFormGroup.get('report')?.value;

    await this.httpDhlService.fetchChargeDescriptionDetails(this.apiControllerFormGroup.value).subscribe({
      next: (result) => {
        this.fetchChargeDescriptionDetails = result;
        this.checkerMethod(this.fetchChargeDescriptionDetails);
      },
      error: error => {
        console.log(' error ', error);

      }
    })
    this.apiControllerFormGroup.get('accNo')?.setValue(tempaccNoArr);
    this.cd.detectChanges();
  }


  checkerMethod(fetchChargeDescriptionDetails: any[]): void {
    this.fetchChargeDescriptionDetails = fetchChargeDescriptionDetails;
    // return;

    for (let loop = 0; loop < this.fetchChargeDescriptionDetails.length; loop++) {
      if (this.fetchChargeDescriptionDetails[loop]['type'] == "Extra Charges") {
        if (this.fetchChargeDescriptionDetails[loop]['nooftrackingnoLbs'])
          this.fetchChargeDescriptionDetails[loop]['nooftrackingnoLbs'] = "";
        if (this.fetchChargeDescriptionDetails[loop]['nooftrackingnoKgs'])
          this.fetchChargeDescriptionDetails[loop]['nooftrackingnoKgs'] = "";
        if (this.fetchChargeDescriptionDetails[loop]['totalweightLbs'])
          this.fetchChargeDescriptionDetails[loop]['totalweightLbs'] = "";
        if (this.fetchChargeDescriptionDetails[loop]['totalweightKgs'])
          this.fetchChargeDescriptionDetails[loop]['totalweightKgs'] = "";
        if (this.fetchChargeDescriptionDetails[loop]['avgweightLbs'])
          this.fetchChargeDescriptionDetails[loop]['avgweightLbs'] = "";
        if (this.fetchChargeDescriptionDetails[loop]['avgweightKgs'])
          this.fetchChargeDescriptionDetails[loop]['avgweightKgs'] = "";
      }
    }

    this.dataSource = new MatTableDataSource(this.fetchChargeDescriptionDetails);
    this.dataSource.sort = this.sort;
    this.fetchData_ACAS(this.fetchChargeDescriptionDetails);
    this.setDisplayedColumns();
    // Trigger change detection after modifying arrays to prevent ExpressionChangedAfterItHasBeenCheckedError
    this.cd.markForCheck();
  }

  async fetchData_ACAS(resultParameter: any[]): Promise<void> {
    if (resultParameter.length == 0) {
      this.openModal("No record found");
    }
    this.account_details = 0;
    this.freightNetAmount = 0;
    this.accesorialNetAmount = 0;
    this.totalNetAmount = 0;
    this.freightNoofShipment = 0;
    this.freightSpend = 0;
    this.accesorialSpend = 0;
    this.airFRTGround = 0;
    this.air = 0;
    this.groundFRTGround = 0;
    this.ground = 0;
    this.totalAirGround = 0;
    this.groundSpend = 0;
    this.airSpend = 0;
    this.totalShipments = 0;
    this.totalPieces = 0;

    let sum = 0;
    for (let count = 0; count < resultParameter.length; count++) {
      if (resultParameter[count].type == "Weight Charge") {
        sum += Number(resultParameter[count].netamount);
        this.freightNetAmount = sum;
        this.freightNoofShipment += Number(resultParameter[count].nooftrackingno);

      }
      if (resultParameter[count].report == "TotalPieces") {
        this.totalShipments += Number(resultParameter[count].nooftrackingno);
        this.totalPieces += Number(resultParameter[count].totalPieces);
      }

      if (resultParameter[count].type == "Extra Charges") {
        this.accesorialNetAmount += Number(resultParameter[count].netamount);

      }
    }
    if (this.apiControllerFormGroup.get('report')?.value == "Freight_Accessorial_Separated") {
      this.txt_lbl = "Advance Charge Description Weight Charge and Extra Charges Separated";
      this.typeData = "Freight_Accessorial";
    }
    if (this.apiControllerFormGroup.get('report')?.value == "Freight_Accessorial_Combined") {
      this.txt_lbl = "Advance Charge Description Weight Charge and Extra Charges Combined";

      this.typeData = "Freight_Accessorial";
    }

    await this.freightNetAmount;
    await this.accesorialNetAmount;
    this.totalNetAmount = this.freightNetAmount + this.accesorialNetAmount;
    this.freightSpend = (this.freightNetAmount / this.totalNetAmount) * 100;
    this.accesorialSpend = (this.accesorialNetAmount / this.totalNetAmount) * 100;
    this.totalAirGround = this.ground + this.air;
    this.groundSpend = (this.ground / this.totalAirGround) * 100;
    this.airSpend = (this.air / this.totalAirGround) * 100;
    resultParameter = [];
    this.closeLoading();

  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },

    });
  }

  setDisplayedColumns() {
    var reportName = this.apiControllerFormGroup.get('report')?.value;
    this.displayedColumns = [];
    if (reportName == "Freight_Accessorial_Separated") {

      this.columns = [
        { field: 'Group', fieldVal: 'group', label: 'Group', visible: true },
        { field: 'Type', fieldVal: 'type', label: 'Type', visible: true },
        { field: 'Net Charge', fieldVal: 'netamount', label: 'Net Charge', visible: true },
        { field: 'Number of Shipments', fieldVal: 'nooftrackingno', label: 'Number of Shipments', visible: true },
        { field: 'Avg.Cost', fieldVal: 'avgcost', label: 'Avg.Cost', visible: true },
        { field: '% of Spend', fieldVal: 'percentofspent', label: '% of Spend', visible: true },
        { field: 'Total Weight (lbs)', fieldVal: 'totalweightLbs', label: 'Total Weight (lbs)', visible: true },
        { field: 'Total Weight (kgs)', fieldVal: 'totalweightKgs', label: 'Total Weight (kgs)', visible: true },
        { field: 'Average Weight per Shipment (lbs)', fieldVal: 'avgweightLbs', label: 'Average Weight per Shipment (lbs)', visible: true },
        { field: 'Average Weight per Shipment (kgs)', fieldVal: 'avgweightKgs', label: 'Average Weight per Shipment (kgs)', visible: true },
        { field: '# of Shipments billed in (lbs)', fieldVal: 'nooftrackingnoLbs', label: '# of Shipments billed in (lbs)', visible: true },
        { field: '# of Shipments billed in (kgs)', fieldVal: 'nooftrackingnoKgs', label: '# of Shipments billed in (kgs)', visible: true }
      ];

    } else if (reportName == "Freight_Accessorial_Combined") {

      this.columns = [
        { field: 'Group', fieldVal: 'group', label: 'Group', visible: true },
        { field: 'Type', fieldVal: 'type', label: 'Type', visible: true },
        { field: 'Net Charge', fieldVal: 'netamount', label: 'Net Charge', visible: true },
        { field: 'Number of Shipments', fieldVal: 'nooftrackingno', label: 'Number of Shipments', visible: true },
        { field: 'Avg.Cost', fieldVal: 'avgcost', label: 'Avg.Cost', visible: true },
        { field: '% of Spend', fieldVal: 'percentofspent', label: '% of Spend', visible: true },
        { field: 'Total Weight (lbs)', fieldVal: 'totalweightLbs', label: 'Total Weight (lbs)', visible: true },
        { field: 'Total Weight (kgs)', fieldVal: 'totalweightKgs', label: 'Total Weight (kgs)', visible: true },
        { field: 'Average Weight per Shipment (lbs)', fieldVal: 'avgweightLbs', label: 'Average Weight per Shipment (lbs)', visible: true },
        { field: 'Average Weight per Shipment (kgs)', fieldVal: 'avgweightKgs', label: 'Average Weight per Shipment (kgs)', visible: true },
        { field: '# of Shipments billed in (lbs)', fieldVal: 'nooftrackingnoLbs', label: '# of Shipments billed in (lbs)', visible: true },
        { field: '# of Shipments billed in (kgs)', fieldVal: 'nooftrackingnoKgs', label: '# of Shipments billed in (kgs)', visible: true }
      ];
    }

    // ✅ Apply visibility (same old loop style)
    this.columns.forEach((column, index) => {
      column.index = index;
      if (column.visible !== false) {
        this.displayedColumns.push(column.fieldVal);
      }
    });

    this.dataFormatter(this.displayedColumns);
    // Trigger change detection for the columns array
    this.cd.markForCheck();
  }

  updateDisplayedColumns() {
    this.displayedColumns = [];

    this.columns.forEach((col, index) => {
      col.index = index;
      if (col.visible) {
        this.displayedColumns.push(col.fieldVal);
      }
    });

    this.dataFormatter(this.displayedColumns);
    this.cd.markForCheck();
  }


  dataFormatter(displayedColumns: any) {
    for (let loop1 = 0; loop1 < displayedColumns.length; loop1++) {
      for (let loop2 = 0; loop2 < this.fetchChargeDescriptionDetails.length; loop2++) {
        if (this.fetchChargeDescriptionDetails[loop2]['report'] != 'TotalPieces') {
          if (displayedColumns[loop1] == 'netamount' || displayedColumns[loop1] == 'avgcost' || displayedColumns[loop1] == 'costperpound') {
            if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != "" &&
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != null) {

              if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]].indexOf("$") > -1) {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]])
              }
              else {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = '$' + this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(2))
              }
            }

            else if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] == null) {
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = '';
            }
          }
          else if (displayedColumns[loop1] == 'percentofspent') {

            if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != "" &&
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != null) {
              if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]].indexOf("%") > -1) {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] * 100)
              }
              else {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] * 100).toFixed(2)) + '%';
              }
            }
          }
          else if (displayedColumns[loop1] == 'totalweightLbs' || displayedColumns[loop1] == 'totalweightKgs' || displayedColumns[loop1] == 'avgweightLbs' || displayedColumns[loop1] == 'avgweightKgs') {
            if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != null) {
              if (this.fetchChargeDescriptionDetails[loop2]['type'] != 'Extra Charges') {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(2));
              } else {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]);
              }
            }

          }
          else if (displayedColumns[loop1] == 'nooftrackingnoLbs' || displayedColumns[loop1] == 'nooftrackingnoKgs') {
            if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != null) {
              if (this.fetchChargeDescriptionDetails[loop2]['type'] != 'Extra Charges') {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(0));
              } else {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]);
              }
            }

          }
          else if (displayedColumns[loop1] == 'nooftrackingno') {
            if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != null) {
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(0));
            }

          }
        }
      }
    }
  }



  setCommaQty(eve: any): string {
    if (eve != null) {
      return eve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      return '';
    }
  }


  ngAfterViewInit(): void {
    setTimeout(() => this.syncScrollWidths(), 0);
    this.cd.detectChanges();
  }

  // UI function 

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.syncScrollWidths();
  }

  // -----------------------------------
  // Column picker
  // -----------------------------------
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
    if (target.closest('.col-picker-wrap')) return;
    this.closeColumnPicker();
  }


  toggleAllColumns(val: boolean) {
    this.columns.forEach(c => c.visible = val);
    this.allSelected = val;
    this.onColumnsChanged();
  }


  onColumnsChanged() {
    this.allSelected = this.columns.every(c => c.visible);
    this.updateDisplayedColumns();
  }

  isColVisible(fieldVal: string): boolean {
    const col = this.columns.find(c => c.fieldVal === fieldVal);
    return col ? col.visible : false;
  }

  trackByIdx(index: number): number {
    return index;
  }

  // -----------------------------------
  // Scroll sync
  // -----------------------------------
  syncScroll(event: Event, source: 'top' | 'table' | 'bottom') {
    if (this.syncing) return;
    this.syncing = true;

    const scrollLeft = (event.target as HTMLElement).scrollLeft;

    if (source !== 'top') this.topScroll.nativeElement.scrollLeft = scrollLeft;
    if (source !== 'table') this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    if (source !== 'bottom') this.bottomScroll.nativeElement.scrollLeft = scrollLeft;

    this.syncing = false;
  }

  syncScrollWidths() {
    if (!this.metricsTable) return;

    const tableWidth = this.metricsTable.nativeElement.offsetWidth;

    const topInner = this.topScroll?.nativeElement.firstElementChild as HTMLElement | null;
    const bottomInner = this.bottomScroll?.nativeElement.firstElementChild as HTMLElement | null;

    if (topInner) topInner.style.width = `${tableWidth}px`;
    if (bottomInner) bottomInner.style.width = `${tableWidth}px`;
    this.cd.detectChanges();
  }

  // -----------------------------------
  // Row styling (TABLE 3)
  // -----------------------------------
  getRowClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'weight charge') return 'freight-row';
    if (t === 'extra charges') return 'accessorial-row';
    return '';
  }

  // Row styling (TABLE 1)
  getSummaryRowClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'weight') return 'freight-row';
    if (t === 'extra') return 'accessorial-row';
    return '';
  }

  // Row styling (TABLE 2)
  getFRTSummaryRowClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t.includes('ground')) return 'ground-row';
    if (t.includes('air')) return 'air-row';
    return '';
  }

  // -----------------------------------
  // Parsing logic
  // -----------------------------------
  rawChargeTableText = `
  Group	Type	Net Charge	Number of Packages	Avg.Cost	Cost Per Pound	Total Weight	% of Spend	Avg.Weight	Avg.Zone	Avg. Gross Rate	Gross Charge	Avg. Discount %	Zero Charge Package Count
  Ground Commercial	Freight	$224,586.51	39,585	$5.67	$0.52	433,568	45.65%	10.95	3.4	$18.82	$744,792.74	69.85%	10
  Ground Residential	Freight	$67,955.88	12,243	$5.55	$0.59	114,563	13.81%	9.36	3.5	$18.04	$220,906.50	69.24%	7
  Ground Hundredweight	Freight	$19,725.18	3,347	$5.89	$0.22	88,294	4.01%	26.38	3.0	$17.40	$58,239.52	66.13%	0
  2 Day	Freight	$13,829.39	1,213	$11.40	$1.38	10,001	2.81%	8.24	5.1	$72.41	$87,835.18	84.26%	0
  Next Day Air	Freight	$8,833.45	457	$19.33	$1.98	4,461	1.80%	9.76	4.1	$138.55	$63,316.78	86.05%	0
  Next Day Air Saver	Freight	$8,137.89	457	$17.81	$2.26	3,604	1.65%	7.89	4.5	$125.97	$57,568.56	85.86%	0
  3 Day	Freight	$4,428.45	497	$8.91	$1.11	4,003	0.90%	8.05	3.9	$43.13	$21,438.05	79.34%	0
  SCC Ground	Freight	$3,211.91	2,124	$1.51	$0.07	46,039	0.65%	21.68	4.3	$7.47	$15,856.54	79.74%	0
  SCC Air	Freight	$2,860.53	706	$4.05	$0.25	11,371	0.58%	16.11	5.2	$28.46	$20,090.88	85.76%	0
  Standard To Canada	Freight	$1,624.52	106	$15.33	$1.56	1,044	0.33%	9.85	0.0	$48.87	$5,179.69	68.64%	0
  Worldwide Expedited (EXPORT)	Freight	$1,040.99	43	$24.21	$4.55	229	0.21%	5.33	0.0	$157.70	$6,781.29	84.65%	0
  2 Day AM	Freight	$738.93	79	$9.35	$1.69	436	0.15%	5.52	4.6	$56.31	$4,448.61	83.39%	0
  Ground Returns	Freight	$566.46	106	$5.34	$0.66	856	0.12%	8.08	3.4	$16.93	$1,794.94	68.44%	0
  Worldwide Saver (EXPORT)	Freight	$357.20	7	$51.03	$3.97	90	0.07%	12.86	0.0	$281.99	$1,973.94	81.90%	0
  Standard	Freight	$348.53	8	$43.57	$0.64	545	0.07%	68.13	0.0	$141.65	$1,133.17	69.24%	0
  3 Day Hundredweight	Freight	$226.16	15	$15.08	$0.52	435	0.05%	29.00	4.0	$34.76	$521.35	56.62%	0
  Worldwide Express (EXPORT)	Freight	$161.92	7	$23.13	$7.71	21	0.03%	3.00	0.0	$156.40	$1,094.81	85.21%	0
  Next Day Air A.M.	Freight	$144.37	2	$72.19	$12.03	12	0.03%	6.00	2.5	$76.02	$152.03	5.04%	0
  Zone Adjustment	Freight	$76.79	8	$9.60	$0.00	0	0.02%		2.8	$34.12	$272.94	71.87%	0
  Voids Air	Freight	$-17.86	-2	$8.93	$0.99	18	0.00%	9.00	2.0	$63.69	$-127.38	85.98%	0
  Voids Ground	Freight	$-245.61	-44	$5.58	$0.48	511	-0.05%	11.61	3.0	$18.49	$-813.34	69.80%	0
  Residential Surcharge	Accessorial	$41,615.68	14,232	$2.92			8.46%			$6.41	$91,256.05	54.40%
  Fuel Surcharge	Accessorial	$37,995.28	62,585	$0.61			7.72%			$5.15	$322,282.36
  Delivery Area Surcharge	Accessorial	$19,080.50	7,889	$2.42			3.88%			$4.84	$38,183.00	50.03%
  Additional Handling	Accessorial	$11,164.00	829	$13.47			2.27%			$29.93	$24,809.30	55.00%
  Delivery Area Surcharge - Extended	Accessorial	$7,673.51	2,297	$3.34			1.56%			$6.69	$15,356.05	50.03%
  Large Package Surcharge	Accessorial	$6,220.95	84	$74.06			1.26%			$246.86	$20,736.50	70.00%
  Billing Adjustment	Accessorial	$4,062.14	273	$14.88			0.83%			$14.12	$3,854.97	5.37%
  Remote Area Surcharge	Accessorial	$3,998.75	249	$16.06			0.81%			$16.06	$3,998.75
  Delivery Intercept	Accessorial	$936.00	51	$18.35			0.19%			$18.35	$936.00
  Missing PLD Fee	Accessorial	$249.10	53	$4.70			0.05%			$4.70	$249.10
  Service Charge	Accessorial	$123.00	38	$3.24			0.03%			$32.95	$1,252.00	90.18%
  Miscellaneous	Accessorial	$69.93	0	$0.00			0.01%			$0.00	$69.93
  Declared Value	Accessorial	$54.72	10	$5.47			0.01%			$9.69	$96.90	43.53%
  Third Party Billing Service	Accessorial	$31.46	49	$0.64			0.01%			$2.92	$143.04	78.01%
  Shipping Correction Fee	Accessorial	$24.75	15	$1.65			0.01%			$1.65	$24.75
  Saturday Delivery	Accessorial	$19.20	2	$9.60			0.00%			$16.00	$32.00	40.00%
  Surge Fee	Accessorial	$18.20	28	$0.65			0.00%			$0.65	$18.20
  Peak Surcharge	Accessorial	$9.75	3	$3.25			0.00%			$3.25	$9.75
  Return Label	Accessorial	$4.60	4	$1.15			0.00%			$1.15	$4.60
  Payment Processing Fee	Accessorial	$0.92	1	$0.92			0.00%			$0.92	$0.92
  Address Correction	Accessorial	$0.00	803	$0.00			0.00%			$26.84	$21,553.00	100.00%
  Early A.M. Surcharge	Accessorial	$0.00	2	$0.00			0.00%			$30.00	$60.00	100.00%
  `.trim();

  private toNumber(val: string | undefined): number | null {
    if (!val) return null;
    const cleaned = val.replace(/\$/g, '').replace(/,/g, '').replace(/%/g, '').trim();
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  private splitRow(line: string): string[] {
    // robust split: tab OR 2+ spaces
    return line.split(/\t| {2,}/).map(v => v.trim());
  }

  private parseUpsChargeTable(raw: string): UpsChargeRow[] {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length <= 1) return [];

    const dataLines = lines.slice(1);
    const rows: UpsChargeRow[] = [];

    for (const line of dataLines) {
      const cols = this.splitRow(line);

      rows.push({
        group: cols[0] ?? '',
        type: cols[1] ?? '',
        netCharge: this.toNumber(cols[2]),
        numberOfPackages: this.toNumber(cols[3]),
        avgCost: this.toNumber(cols[4]),
        costPerPound: this.toNumber(cols[5]),
        totalWeight: this.toNumber(cols[6]),
        percentOfSpend: this.toNumber(cols[7]),
        avgWeight: this.toNumber(cols[8]),
        avgZone: this.toNumber(cols[9]),
        avgGrossRate: this.toNumber(cols[10]),
        grossCharge: this.toNumber(cols[11]),
        avgDiscountPercent: this.toNumber(cols[12]),
        zeroChargePackageCount: this.toNumber(cols[13])
      });
    }

    return rows;
  }

  startDate: Date = new Date(2026, 0, 12); // Jan 12, 2026
  endDate: Date = new Date(2026, 0, 17);   // Jan 17, 2026

  async onSubmit() {
    this.reportNameSearched = this.apiControllerFormGroup.get('report')?.value;
    var boolRes = this.compareTwoDates();
    if (boolRes != false) {
      var accountNoValArr = await this.apiControllerFormGroup.get('accountNumber')?.value;
      var containsAll = accountNoValArr[0].includes('ALL');
      if (accountNoVal == "ALL" || containsAll == true) {
        var accountNo = null;
        this.apiControllerFormGroup.get('accNo')?.setValue(accountNo);

      }
      else {
        var accountNoVal = accountNoValArr.join('@');
        this.apiControllerFormGroup.get('accNo')?.setValue(accountNoVal);

      }
      this.openLoading();

      var fromdate = this.apiControllerFormGroup.get('fromdate')?.value;
      var todate = this.apiControllerFormGroup.get('todate')?.value;
      this.fromDateFormat = this.datePipe.transform(fromdate, "MMM dd,yyyy");
      this.toDateFormat = this.datePipe.transform(todate, "MMM dd,yyyy");

      var report = await this.apiControllerFormGroup.get('report')?.value;
      if (report == "Freight_Accessorial_Combined") {
        this.IsaccessorialCombined = true;
      } else {
        this.IsaccessorialCombined = false;
      }

      await this.apiControllerFormGroup.get('report')?.setValue(report);
      var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
      var toDate = this.apiControllerFormGroup.get('todate')?.value;
      var fromDateTransformed = this.datePipe.transform(fromDate, "yyyy-MM-dd");
      var toDateTransformed = this.datePipe.transform(toDate, "yyyy-MM-dd");
      this.apiControllerFormGroup.get('fromdate')?.setValue(fromDateTransformed);
      this.apiControllerFormGroup.get('todate')?.setValue(toDateTransformed);
      this.reportName = this.apiControllerFormGroup.get('report')?.value;
      await this.httpDhlService.fetchChargeDescriptionDetails(this.apiControllerFormGroup.value).subscribe({
        next: (result) => {
          var serviceType = this.apiControllerFormGroup.get('report')?.value;

          if (serviceType == 'Freight_Accessorial_Combined') {
            for (let loop = 0; loop < result.length; loop++) {
              if (result[loop]['type'] == "Weight Charge + Extra Charges") {
                result[loop]['Typefrt_frtAcc'] = "Weight Charge + Extra Charges";
                result[loop]['type'] = "Weight Charge";
              }
            }
          }

          this.fetchChargeDescriptionDetails = result;

          this.checkerMethod(this.fetchChargeDescriptionDetails);
        },
        error: error => {
          console.log(' error ', error);

        }
      })
    }
    this.apiControllerFormGroup.get('fromdate')?.setValue(new Date(fromDate));
    this.apiControllerFormGroup.get('todate')?.setValue(new Date(toDate));
    this.apiControllerFormGroup.get('accNo')?.setValue(accountNoVal);
  }

  compareTwoDates(): boolean {
    const dateFr = this.apiControllerFormGroup.get('fromdate')?.value;
    const dateT = this.apiControllerFormGroup.get('todate')?.value;

    const dateFromYear = this.datePipe.transform(dateFr, 'yyyy');
    const dateToYear = this.datePipe.transform(dateT, 'yyyy');

    if (dateFromYear !== dateToYear) {
      this.openModal('Date range must be in same year');
      return false;
    }

    return true;
  }

  toggleSelection() {
    var accvalue = this.apiControllerFormGroup.get('accountNumber')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValue.deselect();
    }
  }

  toggleAllSelection() {
    if (this.allSelectedValue.selected) {
      this.accNoSel.options.forEach((item: MatOption) => { item.deselect() });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.apiControllerFormGroup.get('accountNumber')?.setValue(setAllvalue);
    }
  }

  async clearall_clickHandler() {
    await this.apiControllerFormGroup.get('fromdate')?.setValue(new Date(this.tempfromDate));
    await this.apiControllerFormGroup.get('todate')?.setValue(new Date(this.temptoDate));

  }

  exportTOExcelFun() {
    var downloadReport = this.reportFormGroup.get('downloadReport')?.value;
    if (downloadReport == "ADVANCE_CHARGE_DESCRIPTION_DETAILS") {
      this.ExportTOExcel();
    } else if (downloadReport == "ADVANCE_CHARGE_DESCRIPTION") {
      this.generateExcel();
    }
  }

  async ExportTOExcel(): Promise<void> {

    var t007_reportlogobj: any = {};
    t007_reportlogobj['t001ClientProfile'] = this.apiControllerFormGroup.get('t001ClientProfile')?.value;
    t007_reportlogobj["status"] = "IN QUEUE";
    t007_reportlogobj["reportFormat"] = "CSV";
    t007_reportlogobj["moduleName"] = "ChargeDescription";
    t007_reportlogobj["login_id"] = this.loginId;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientname'] = this.clientName;
    t007_reportlogobj['crmaccountNumber'] = "NA";
    var accNo = null;
    var tempaccNoArr = this.apiControllerFormGroup.get('accountNumber')?.value;
    var containsAll = tempaccNoArr[0].includes('ALL');
    var tempaccNo = tempaccNoArr.join('@');
    if (tempaccNo != null && tempaccNo != "ALL" && tempaccNo != "null" && containsAll == false) {
      accNo = tempaccNo;
      t007_reportlogobj["accountNumber"] = accNo;
    } else {
      t007_reportlogobj["accountNumber"] = null;
    }
    var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
    var toDate = this.apiControllerFormGroup.get('todate')?.value;
    var fromDateTransformed = this.datePipe.transform(fromDate, "yyyy-MM-dd");
    var toDateTransformed = this.datePipe.transform(toDate, "yyyy-MM-dd");
    t007_reportlogobj["fromDate"] = fromDateTransformed;
    t007_reportlogobj["toDate"] = toDateTransformed;
    t007_reportlogobj["fromdate"] = fromDateTransformed;
    t007_reportlogobj["todate"] = toDateTransformed;
    var reportName = this.apiControllerFormGroup.get('report')?.value;

    if (reportName == "Freight_Accessorial_Separated") {
      t007_reportlogobj["reportType"] = "WeightChargeandExtraCharges_Seperated_Details";
      t007_reportlogobj["reportName"] = "Weight Charge and Extra Charges Separated Details";
      t007_reportlogobj["designFileName"] = "FreightandAccessorialSeparated_Details";
    }
    if (reportName == "Freight_Accessorial_Combined") {
      t007_reportlogobj["reportType"] = "WeightChargeandExtraCharges_Combined_Details";
      t007_reportlogobj["reportName"] = "Weight Charge and Extra Charges Combined Details";
      t007_reportlogobj["designFileName"] = "FreightandAccessorialCombined_Details";
    }

    this.httpDhlService.runReport(t007_reportlogobj).subscribe({
      next: (result) => {
        this.saveOrUpdateReportLogResult(result);
      },
      error: (error) => {
      }
    });
  }

  generateExcel() {
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
    var d = new Date();
    var currentDate = this.datePipe.transform(d, "yyyy-MM-dd HH:mm:ss");
    var fileName = "";
    var title
    var fileNameSecond = ""
    if (this.reportNameSearched == 'Freight_Accessorial_Separated') {
      fileNameSecond = "_WeightChargeandExtraCharges_Seperated_";
      title = 'Weight Charge and Extra Charges Separated';
    }
    if (this.reportNameSearched == 'Freight_Accessorial_Combined') {
      fileNameSecond = "_WeightChargeandExtraCharges_Combined";
      title = "Weight Charge and Extra Charges Combined Report";
    }

    fileName = this.clientName + fileNameSecond + currentDate + ".xlsx";


    var tableOneArr = [];
    var headerTableOneArr = [];
    if (this.IsaccessorialCombined == false) {
      tableOneArr.push(['Weight Charge', Number(this.freightNetAmount.toFixed(2)), Number(this.freightNoofShipment), Number(this.freightSpend.toFixed(2)) / 100])
      tableOneArr.push(['Extra Charges', Number(this.accesorialNetAmount.toFixed(2)), '', Number(this.accesorialSpend.toFixed(2)) / 100])
    }
    else {
      tableOneArr.push(['Weight Charge + Extra Charges', Number(this.freightNetAmount.toFixed(2)), Number(this.freightNoofShipment),
        Number(this.freightSpend.toFixed(2)) / 100])
      tableOneArr.push(['-', '-', '', '-'])
    }
    tableOneArr.push(['Total', Number(this.totalNetAmount.toFixed(2)), '', ''])
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Charge Description Summary');
    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 35;
    worksheet.getColumn(10).width = 35;
    worksheet.getColumn(11).width = 30;
    worksheet.getColumn(12).width = 30;
    //Add Title
    var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
    var toDate = this.apiControllerFormGroup.get('todate')?.value;
    var fromDateTransformed = this.datePipe.transform(fromDate, "MM-dd-yyyy");
    var toDateTransformed = this.datePipe.transform(toDate, "MM-dd-yyyy");
    let titleRow = worksheet.addRow([title + "       From Invoice Date : " + fromDateTransformed + "  To Invoice Date : " + toDateTransformed]);
    // let titleRow = worksheet.addRow([title]);
    titleRow.font = { family: 4, size: 13, bold: true };
    worksheet.mergeCells('A1:G1');
    worksheet.addRow([]);
    //Add Header Row
    headerTableOneArr.push('Type', 'Net Charge', 'Number of Shipments', '% of Spend')
    let headerRow_TableOne = worksheet.addRow(headerTableOneArr);
    headerRow_TableOne.font = { family: 4, size: 11, bold: true };
    headerRow_TableOne.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',

        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    var count = 1;
    tableOneArr.forEach(d => {
      let row: any = worksheet.addRow(d);
      if (this.IsaccessorialCombined == false) {
        var typeVal = row['_cells'][0]['_value']?.model?.value;
        if (typeVal == "Weight Charge") {
          row.eachCell((cell: any, number: any) => {
            worksheet.getCell('B4').numFmt = '$#,##0.00';
            worksheet.getCell('C4').numFmt = '#,##0';
            worksheet.getCell('D4').numFmt = '0.00%';
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'a4d6ff' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
        else if (typeVal == "Extra Charges") {
          row.eachCell((cell: any, number: any) => {
            worksheet.getCell('B5').numFmt = '$#,##0.00';
            worksheet.getCell('D5').numFmt = '0.00%';
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'E2EFDA' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
        else {
          row.eachCell((cell: any, number: any) => {
            worksheet.getCell('B6').numFmt = '$#,##0.00';
            row.font = { family: 4, size: 11, bold: true };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'D3D3D3' },
              bgColor: { argb: 'D3D3D3' }
              // fgColor: { argb: 'ffffff' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
      }
      else {
        var typeVal = row['_cells'][0]['_value']?.model?.value;
        row.eachCell((cell: any, number: any) => {
          if (typeVal == "Weight Charge + Extra Charges") {
            worksheet.getCell('B4').numFmt = '$#,##0.00';
            worksheet.getCell('C4').numFmt = '#,##0';
            worksheet.getCell('D4').numFmt = '0.00%';
            if (count % 2 == 1) {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',

                fgColor: { argb: 'd0e3ff' }
              }
            }
          }
          else if (typeVal == "Total") {

            row.eachCell((cell: any, number: any) => {
              worksheet.getCell('B6').numFmt = '$#,##0.00';
              row.font = { family: 4, size: 11, bold: true };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',

                fgColor: { argb: 'D3D3D3' },
                bgColor: { argb: 'D3D3D3' }

              }

              cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            })

          }

          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })
        // let qty = row.getCell();
        let color = 'd0e3ff';

        count++;

      }
    }
    );
    worksheet.addRow([]);
    worksheet.addRow([]);
    var headerTableTwoArr = [];
    var tableTwoArr = [];
    tableTwoArr.push([Number(this.totalShipments.toFixed(2)), Number(this.totalPieces.toFixed(2))])


    headerTableTwoArr.push('Total Shipments', 'Total Pieces')
    let headerRow_TableTwo = worksheet.addRow(headerTableTwoArr);
    headerRow_TableTwo.font = { family: 4, size: 11, bold: true };
    headerRow_TableTwo.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',

        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    var count = 1;
    tableTwoArr.forEach(d => {
      let row: any = worksheet.addRow(d);
      if (this.IsaccessorialCombined == false) {
        var typeVal = row['_cells'][0]['_value']?.model?.value;
        worksheet.getCell('A10').numFmt = '#,##0';
        worksheet.getCell('B10').numFmt = '#,##0';
        row.eachCell((cell: any, number: any) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'a4d6ff' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

      }
      else {
        var typeVal = row['_cells'][0]['_value'].model.value;
        row.eachCell((cell: any, number: any) => {
          worksheet.getCell('A10').numFmt = '#,##0';
          worksheet.getCell('B10').numFmt = '#,##0';
          row.eachCell((cell: any, number: any) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'a4d6ff' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })

          if (count % 2 == 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'd0e3ff' }
            }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })
        // let qty = row.getCell();
        let color = 'd0e3ff';

        count++;

      }
    }
    );
    worksheet.addRow([]);
    worksheet.addRow([]);
    var tablethreeArr = [];
    var tablethreeDataArr;
    for (var loop1 = 0; loop1 < this.fetchChargeDescriptionDetails.length - 1; loop1++) {
      tablethreeDataArr = [];
      for (var loop2 = 0; loop2 < this.displayedColumns.length; loop2++) {
        if (this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[1]] == "Weight Charge" || this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[1]] == "Weight Charge + Extra Charges") {
          if (loop2 == 0 || loop2 == 1) {
            tablethreeDataArr.push(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]]);
          }
          else if (loop2 == 5) {
            tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '') / 100));

          }
          else {
            tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
          }
        }
        else if (this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[1]] == "Extra Charges") {
          if (loop2 == 0 || loop2 == 1 || loop2 == 6 || loop2 == 7 || loop2 == 8 || loop2 == 9 || loop2 == 10 || loop2 == 11) {
            tablethreeDataArr.push(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]]);
          }
          else if (loop2 == 5) {
            tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '') / 100));
          }
          else {
            tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
          }

        }
      }
      tablethreeArr.push(tablethreeDataArr)
    }

    var headerTableThreeArr = [];
    for (let loop = 0; loop < this.columns.length; loop++) {
      headerTableThreeArr.push(this.columns[loop]['field'])
    }
    let headerRow_TableThree = worksheet.addRow(headerTableThreeArr);
    headerRow_TableThree.font = { family: 4, size: 11, bold: true };
    headerRow_TableThree.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',

        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    if (this.reportNameSearched == 'Freight_Accessorial_Separated') {

      tablethreeArr.forEach((d, index) => {
        let row: any = worksheet.addRow(d);

        var typeVal = row['_cells'][1]['_value'].model.value;
        if (typeVal == "Weight Charge") {

          row.eachCell((cell: any, number: any) => {
            if (number == 3 || number == 5) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '$#,##0.00';
            }
            else if (number == 4 || number == 11 || number == 12) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '#,##0';
            }
            else if (number == 7 || number == 8 || number == 9 || number == 10) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '#,##0.00';
            }
            else if (number == 6) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '0.00%';
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'a4d6ff' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        } else {
          row.eachCell((cell: any, number: any) => {

            if (number == 3 || number == 5) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '$#,##0.00';
            }
            else if (number == 4) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '#,##0';
            }
            else if (number == 6) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '0.00%';
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'E2EFDA' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
      }
      );
    }
    else {
      var count = 1;
      tablethreeArr.forEach((d, index) => {
        let row = worksheet.addRow(d);

        row.eachCell((cell, number) => {
          if (number == 3 || number == 5) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '$#,##0.00';
          }
          else if (number == 4 || number == 11 || number == 12) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '#,##0';
          }
          else if (number == 7 || number == 8 || number == 9 || number == 10) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '#,##0.00';
          }
          else if (number == 6) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 14) + "'").numFmt = '0.00%';
          }
          if (count % 2 == 0) {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'd0e3ff' }
            }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

        count++;
      }
      );
    }
    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })

  }

  decimalLimiter(num: number | string, fixed: number): string {
    const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
    return num.toString().match(re)?.[0] ?? '';
  }

  GetExcelColumnName(columnNumber: number): string {
    let dividend = columnNumber;
    let columnName = '';

    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);

    return columnName;
  }

  saveOrUpdateReportLogResult(result: any): void {
    this.reportFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalDhl(this.reportFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
  }

  expandtableclick() {
    this.plussign = !this.plussign;
    if (this.plussign) {
      this.buttonName = '-';
      this.columns.forEach((colunm, index) => {
        colunm.index = 10;
        this.displayedColumns[index] = colunm.fieldVal;
      });

      this.dataFormatter(this.displayedColumns);
    }
    else {
      this.buttonName = '+';
      this.setDisplayedColumns();
    }
  }

  ChargeDescription_clickHandler(chargeDescription: string, chargeType: string): void {
    chargeDescription = chargeDescription.replace(/[ ]/g, "@");
    var t007_reportlogobj: any = {};
    t007_reportlogobj['t001ClientProfile'] = this.apiControllerFormGroup.get('t001ClientProfile')?.value;
    t007_reportlogobj["status"] = "IN QUEUE";
    t007_reportlogobj["reportFormat"] = "CSV";
    t007_reportlogobj["moduleName"] = "Advancecharge";
    t007_reportlogobj["login_id"] = this.loginId;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientname'] = this.clientName;
    t007_reportlogobj["reportType"] = "Invoice_Data_Report_ServiceType";
    t007_reportlogobj["reportName"] = "Charge Description Grouping";
    t007_reportlogobj["designFileName"] = "Invoice_Data_Report_ServiceType";
    t007_reportlogobj['chargeDes'] = chargeDescription;
    var reportName = this.apiControllerFormGroup.get('report')?.value;
    if (reportName == "Freight_Accessorial_Separated") {
      t007_reportlogobj['crmaccountNumber'] = chargeType;
    }
    if (reportName == "Freight_Accessorial_Combined") {
      t007_reportlogobj['crmaccountNumber'] = "Freight";
    }
    var accNo = null;
    var tempaccNoArr = this.apiControllerFormGroup.get('accountNumber')?.value;
    var containsAll = tempaccNoArr[0].includes('ALL');
    var tempaccNo = tempaccNoArr.join('@');
    if (tempaccNo != null && tempaccNo != "ALL" && tempaccNo != "null" && containsAll == false) {
      accNo = tempaccNo;
      t007_reportlogobj["accountNumber"] = accNo;
    } else {
      t007_reportlogobj["accountNumber"] = null;
    }

    var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
    var toDate = this.apiControllerFormGroup.get('todate')?.value;
    var fromDateTransformed = this.datePipe.transform(fromDate, "yyyy-MM-dd");
    var toDateTransformed = this.datePipe.transform(toDate, "yyyy-MM-dd");
    t007_reportlogobj["fromDate"] = fromDateTransformed;
    t007_reportlogobj["toDate"] = toDateTransformed;
    t007_reportlogobj["fromdate"] = fromDateTransformed;
    t007_reportlogobj["todate"] = toDateTransformed;

    this.httpDhlService.runReport(t007_reportlogobj).subscribe({
      next: (result) => {
        this.saveOrUpdateReportLogResult(result);
      }, error: error => {
      }
    });
  }


}