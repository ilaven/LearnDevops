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
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { MailPopupComponent } from '../detail-reports/mail-popup/mail-popup.component';

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
  selector: 'app-fedex-charge-description',
  templateUrl: './charge-description.component.html',
  styleUrls: ['./charge-description.component.scss'],
  standalone: false
})
export class FedexChargeDescriptionComponent implements OnInit, AfterViewInit {
  // Scroll references
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('bottomScroll') bottomScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('metricsTable') metricsTable!: ElementRef<HTMLTableElement>;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('allSelectedValueFedEx') private allSelectedValueFedEx!: MatOption;
  @ViewChild('accNoSelFedEx') private accNoSelFedEx!: MatSelect;

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
  fetchChargeDescriptionDetailsFedex: any = [];
  reportName: any;
  displayedColumns: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.fetchChargeDescriptionDetailsFedex);
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
  fetchaccountDetails: any;
  myAC: any[] = [];
  myAC_Res: any[] = [];
  tot_fright: number = 0;
  total_trackFright: number = 0;
  tot_Acc: number = 0;
  totaltrackaccpersent: number = 0;
  totaltrackGroundprecent: number = 0;
  Sum_trackNextPrecent: number = 0;
  totalvalue: number = 0;
  tot_Ground: number = 0;
  total_trackNo_Ground: number = 0;
  totaltrackfreprecent: number = 0;
  tot_Next: number = 0;
  total_trackNo_Next: number = 0;
  total_trackNextPrecent: number = 0;
  grandTot: number = 0;
  netAmt: number = 0;
  perOfSpent: number = 0;
  txt_lbl_text: any;
  typeDataFed: any;
  showImp_Exp: boolean = false;

  //form group
  fedexFormGroup: FormGroup;
  reportsFormGroup: FormGroup;
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
  constructor(private cookiesService: CookiesService, private loaderService: LoaderService,
    private offcanvasService: NgbOffcanvas, private datePipe: DatePipe,
    private commonService: CommonService,
    private httpfedexService: HttpfedexService, private dialog: MatDialog
    , private cd: ChangeDetectorRef
  ) {
    this.fedexFormGroup = new FormGroup({
      loginId: new FormControl(''),
      requesteddttm: new FormControl(''),
      createdDate: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      modulename: new FormControl(''),
      clientId: new FormControl(''),
      reportType: new FormControl('FreightandAccessorialSeparatedAdjusted'),
      status: new FormControl(''),
      reportFormat: new FormControl('excel'),
      moduleName: new FormControl(''),
      login_id: new FormControl(''),
      upsClientId: new FormControl(''),
      clientname: new FormControl(''),
      clientName: new FormControl(''),
      fromdate: new FormControl(''),
      todate: new FormControl(''),
      datetype: new FormControl('InvoiceDate'),
      chargeDescription: new FormControl(''),
      reporttype: new FormControl(''),
      reportName: new FormControl(''),
      accountNumber: new FormControl('ALL'),
      desc: new FormControl(''),
      grp: new FormControl(''),
      chargeType: new FormControl(''),
      chargeDesc: new FormControl(''),
      chargeGroup: new FormControl(''),
      accNo: new FormControl('ALL'),
      reportname: new FormControl(''),
      t002ClientProfile: new FormGroup({
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
        t002AccountDet: new FormControl(''),
        customers: new FormControl('')
      }),
      t002ClientProfileobj: new FormGroup({
        clientId: new FormControl(''), clientName: new FormControl(''), userName: new FormControl(''), password: new FormControl(''), siteUserName: new FormControl(''), sitePassword: new FormControl(''),
        address: new FormControl(''), contactNo: new FormControl(''), comments: new FormControl(''), endDate: new FormControl(''), startDate: new FormControl(''),
        status: new FormControl(''), auditStatus: new FormControl(''), contractStatus: new FormControl(''), email: new FormControl(''),
        userLogo: new FormControl(''), customerType: new FormControl(''), dataSource: new FormControl(''), dataLoadedBy: new FormControl(''), filestartdate: new FormControl(''),
        fileenddate: new FormControl(''), dateasof: new FormControl(''), currentDate: new FormControl(''), currentYear: new FormControl(''),
        currentMonth: new FormControl(''), startYear: new FormControl(''), createdBy: new FormControl(''), createdTs: new FormControl(''), updatedTs: new FormControl(''),
        adminFlag: new FormControl(''), filestartdate1: new FormControl(''), fileenddate1: new FormControl(''), trackingcount: new FormControl(''), logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''), noofdaysinactive: new FormControl(''), ipaddress: new FormControl(''), loginFlag: new FormControl(''), contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''), carrierType: new FormControl(''), customers: new FormControl('')
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

    this.reportsFormGroup = new FormGroup({
      reportLogId: new FormControl(''),
      t002ClientProfileobj: new FormControl({ clientId: new FormControl('') })
    });
  }
  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  ngOnInit(): void {
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
    this.fromDate = this.datePipe.transform(tempmonthStartDay, "yyyy-MM-dd");
    this.toDate = this.datePipe.transform(tempmonthEndDay, "yyyy-MM-dd");
    this.tempfromDate = tempmonthStartDay;
    this.temptoDate = tempmonthEndDay;
    //added for change T_13852
    this.fromDateFormat = this.datePipe.transform(tempmonthStartDay, "MMM dd,yyyy");
    this.toDateFormat = this.datePipe.transform(tempmonthEndDay, "MMM dd,yyyy");
    //added for change T_13852
    this.fedexFormGroup.patchValue({
      dateRange: { "start": new Date(this.fromDate), "end": new Date(this.toDate) }
    });

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

  _filterUPSAccountNo(value: string): any[] {

    if (typeof value !== 'string')
      return [];
    return this.account_detailsArr.filter(accountnumber => accountnumber.accountNo.toLowerCase().includes(value.toLowerCase()));
  }

  async getUser(): Promise<void> {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    const userProfileData = await this.getuserProfile();
    const userProfile = userProfileData[0];

    this.clientID = userProfile.clientId;
    this.clientName = userProfile.clientName;
    this.fileStartDate = userProfile.fileStartDate;
    this.fileEndDate = userProfile.fileEndDate;
    this.carrierType = userProfile.carrierType;

    const fromDate = await this.fromDate;
    const toDate = await this.toDate;

    var strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
    var strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
    var strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);
    this.dataasof = strMonthEnd + "/" + strDateEnd + "/" + strYearEnd;

    this.dataasofFormat = this.datePipe.transform(this.dataasof, 'MMM dd, yyyy');
    const formattedDate = this.datePipe.transform(this.dataasof, 'MM/dd/yyyy');
    this.dataasoffFormat = formattedDate ? new Date(formattedDate) : null;

    // Patch entire profile object instead of mapping each field manually
    await this.fedexFormGroup.patchValue({
      t002ClientProfile: {
        "clientId": this.userProfifle.clientId,
        "clientName": this.userProfifle.clientName,
        "userName": this.userProfifle.userName,
        "password": this.userProfifle.password,
        "siteUserName": this.userProfifle.siteUserName,
        'sitePassword': this.userProfifle.sitePassword,
        "address": this.userProfifle.address,
        "contactNo": this.userProfifle.contactNo,
        "comments": this.userProfifle.comments,
        "endDate": this.userProfifle.endDate,
        "startDate": this.userProfifle.startDate,
        "status": this.userProfifle.status,
        "auditStatus": this.userProfifle.auditStatus,
        "contractStatus": this.userProfifle.contractStatus,
        "email": this.userProfifle.email,
        "userLogo": this.userProfifle.userLogo,
        "customerType": this.userProfifle.customerType,
        "dataSource": this.userProfifle.dataSource,
        "dataLoadedBy": this.userProfifle.dataLoadedBy,
        "filestartdate": this.userProfifle.filestartdate,
        "fileenddate": this.userProfifle.fileenddate,
        "dateasof": this.userProfifle.dateasof,
        "currentDate": this.userProfifle.currentDate,
        "currentYear": this.userProfifle.currentYear,
        "currentMonth": this.userProfifle.currentMonth,
        "startYear": this.userProfifle.startYear,
        "createdBy": this.userProfifle.createdBy,
        "createdTs": this.userProfifle.createdTs,
        "updatedTs": this.userProfifle.updatedTs,
        "adminFlag": this.userProfifle.adminFlag,
        "filestartdate1": this.userProfifle.filestartdate1,
        "fileenddate1": this.userProfifle.fileenddate1,
        "trackingcount": this.userProfifle.trackingcount,
        "logostatus": this.userProfifle.logostatus,
        "noofdaystoactive": this.userProfifle.noofdaystoactive,
        "noofdaysinactive": this.userProfifle.noofdaysinactive,
        "ipaddress": this.userProfifle.ipaddress,
        "loginFlag": this.userProfifle.loginFlag,
        "contractSavingFlag": this.userProfifle.contractSavingFlag,
        "clientProfileName": this.userProfifle.clientProfileName,
        "carrierType": this.userProfifle.carrierType,
        "t002AccountDet": this.userProfifle.t002AccountDet,
        "customers": this.userProfifle.customers
      }
    });
    await this.fedexFormGroup.patchValue({
      t002ClientProfileobj: {
        "clientId": this.userProfifle.clientId,
        "clientName": this.userProfifle.clientName,
        "userName": this.userProfifle.userName,
        "password": this.userProfifle.password,
        "siteUserName": this.userProfifle.siteUserName,
        'sitePassword': this.userProfifle.sitePassword,
        "address": this.userProfifle.address,
        "contactNo": this.userProfifle.contactNo,
        "comments": this.userProfifle.comments,
        "endDate": this.userProfifle.endDate,
        "startDate": this.userProfifle.startDate,
        "status": this.userProfifle.status,
        "auditStatus": this.userProfifle.auditStatus,
        "contractStatus": this.userProfifle.contractStatus,
        "email": this.userProfifle.email,
        "userLogo": this.userProfifle.userLogo,
        "customerType": this.userProfifle.customerType,
        "dataSource": this.userProfifle.dataSource,
        "dataLoadedBy": this.userProfifle.dataLoadedBy,
        "filestartdate": this.userProfifle.filestartdate,
        "fileenddate": this.userProfifle.fileenddate,
        "dateasof": this.userProfifle.dateasof,
        "currentDate": this.userProfifle.currentDate,
        "currentYear": this.userProfifle.currentYear,
        "currentMonth": this.userProfifle.currentMonth,
        "startYear": this.userProfifle.startYear,
        "createdBy": this.userProfifle.createdBy,
        "createdTs": this.userProfifle.createdTs,
        "updatedTs": this.userProfifle.updatedTs,
        "adminFlag": this.userProfifle.adminFlag,
        "filestartdate1": this.userProfifle.filestartdate1,
        "fileenddate1": this.userProfifle.fileenddate1,
        "trackingcount": this.userProfifle.trackingcount,
        "logostatus": this.userProfifle.logostatus,
        "noofdaystoactive": this.userProfifle.noofdaystoactive,
        "noofdaysinactive": this.userProfifle.noofdaysinactive,
        "ipaddress": this.userProfifle.ipaddress,
        "loginFlag": this.userProfifle.loginFlag,
        "contractSavingFlag": this.userProfifle.contractSavingFlag,
        "clientProfileName": this.userProfifle.clientProfileName,
        "carrierType": this.userProfifle.carrierType,
        "t002AccountDet": this.userProfifle.t002AccountDet,
        "customers": this.userProfifle.customers
      }
    });

    // Safe optional chaining for form controls
    this.fedexFormGroup.get('fromdate')?.setValue(fromDate);
    this.fedexFormGroup.get('todate')?.setValue(toDate);
    this.fedexFormGroup.get('fromDate')?.setValue(fromDate);
    this.fedexFormGroup.get('toDate')?.setValue(toDate);

    this.clientName = this.userProfifle.clientName.replace(/[ ]/g, "_");
    await this.fetchaccountDetailsFedEx();


    await this.fedexFormGroup.get('fromdate')?.setValue(fromDate);
    await this.fedexFormGroup.get('todate')?.setValue(toDate);

    await this.fedexFormGroup.get('clientname')?.setValue(this.clientName);
    var tempaccNoArr = this.fedexFormGroup.get('accountNumber')?.value;
    var containsAllFedEx = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == 'ALL' || tempaccNoArr == "" || tempaccNoArr != null || containsAllFedEx == true) {
      var accno = null;
      this.fedexFormGroup.get('accNo')?.setValue(accno);

    }

    await this.fedexFormGroup.get('reportname')?.setValue("ImportExport");
    this.panelClass = 'custom-dialog-panel-class';

    await this.fetchAdvanceChargeDescFedEx();
    this.fedexFormGroup.get('fromdate')?.setValue(new Date(this.tempfromDate));
    this.fedexFormGroup.get('todate')?.setValue(new Date(this.temptoDate));
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }

  async fetchaccountDetailsFedEx(): Promise<void> {
    var tempaccNoArr = this.fedexFormGroup.get('accountNumber')?.value;
    var containsAllFedEx = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == 'ALL' || tempaccNoArr == "" || tempaccNoArr != null || containsAllFedEx == true) {
      var accno = null;
      this.fedexFormGroup.get('accNo')?.setValue(accno);

    } else {
      var tempaccNo = tempaccNoArr.join('@');
      this.fedexFormGroup.get('accNo')?.setValue(tempaccNo);

    }
    await this.httpfedexService.fetchaccountDetails(this.fedexFormGroup.value).subscribe({
      next: (result) => {
        this.fetchaccountDetails = result;
        this.fetchaccountDetails.forEach((item: any, index: any) => {
          if (item.nickName == null || item.nickName == undefined || item.nickName == '') {
            this.fetchaccountDetails[index].nickName = item.primaryAccountNumber;
          }
          else {
            this.fetchaccountDetails[index].nickName = item.primaryAccountNumber + " - <span>" + item.nickName + "</span>";
          }
        });


      },
      error: error => {
        console.log(' error', error);
      }
    })
    this.fedexFormGroup.get('accNo')?.setValue(tempaccNoArr);
  }

  async fetchAdvanceChargeDescFedEx() {
    var tempaccNoArr = this.fedexFormGroup.get('accountNumber')?.value;
    var containsAllFedEx = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == 'ALL' || tempaccNoArr == null || containsAllFedEx == true) {
      var accno = null;
      this.fedexFormGroup.get('accNo')?.setValue(accno);
    } else {
      var tempaccNo = tempaccNoArr.join('@');
      this.fedexFormGroup.get('accNo')?.setValue(tempaccNo);
    }

    await this.httpfedexService.fetchAdvanceChargeDesc(this.fedexFormGroup.value).subscribe({
      next: (result) => {
        this.fetchChargeDescriptionDetailsFedex = [];
        this.fetchChargeDescriptionDetailsFedex = result;
        this.checkerMethodFedex(this.fetchChargeDescriptionDetailsFedex);

      },
      error: error => {
        console.log('error', error);
      }
    })
    this.fedexFormGroup.get('accNo')?.setValue(tempaccNoArr);
  }

  checkerMethodFedex(fetchChargeDescriptionDetailsFedex: any): void {
    this.fetchChargeDescriptionDetailsFedex = fetchChargeDescriptionDetailsFedex;
    for (let loop = 0; loop < this.fetchChargeDescriptionDetailsFedex.length; loop++) {
      if (this.fetchChargeDescriptionDetailsFedex[loop]['type'] == "Accessorial") {
        if (this.fetchChargeDescriptionDetailsFedex[loop]['costperkgs'])
          this.fetchChargeDescriptionDetailsFedex[loop]['costperkgs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['costperlbs'])
          this.fetchChargeDescriptionDetailsFedex[loop]['costperlbs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['totalweightlbs'])
          this.fetchChargeDescriptionDetailsFedex[loop]['totalweightlbs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['totalweightkgs'])
          this.fetchChargeDescriptionDetailsFedex[loop]['totalweightkgs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['avgweightlbs'])
          this.fetchChargeDescriptionDetailsFedex[loop]['avgweightlbs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['avgweightkgs'])
          this.fetchChargeDescriptionDetailsFedex[loop]['avgweightkgs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['grossCharge'])
          this.fetchChargeDescriptionDetailsFedex[loop]['grossCharge'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['avgzone'])
          this.fetchChargeDescriptionDetailsFedex[loop]['avgzone'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['avgdiscount'])
          this.fetchChargeDescriptionDetailsFedex[loop]['avgdiscount'] = "";
      }
      else if (this.fetchChargeDescriptionDetailsFedex[loop]['type'] == "Freight") {
        if (this.fetchChargeDescriptionDetailsFedex[loop]['costperkgs'] == "0.00")
          this.fetchChargeDescriptionDetailsFedex[loop]['costperkgs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['avgweightkgs'] == "0.00")
          this.fetchChargeDescriptionDetailsFedex[loop]['avgweightkgs'] = "";
        if (this.fetchChargeDescriptionDetailsFedex[loop]['avgzone'] == "0.00")
          this.fetchChargeDescriptionDetailsFedex[loop]['avgzone'] = "";
      }
    }
    var serviceType = this.fedexFormGroup.get('reportname')?.value;
    if (serviceType == 'Freight_Accessorial_Combined') {
      for (let loop = 0; loop < this.fetchChargeDescriptionDetailsFedex.length; loop++) {
        if (this.fetchChargeDescriptionDetailsFedex[loop]['type'] == "Freight")
          this.fetchChargeDescriptionDetailsFedex[loop]['Typefrt_frtAcc'] = "Freight + Accessorial";
      }
    }
    this.dataSource = new MatTableDataSource(this.fetchChargeDescriptionDetailsFedex);
    this.dataSource.sort = this.sort;

    this.fetchChargeDescriptionDetailsFedEx(this.fetchChargeDescriptionDetailsFedex);
    this.setDisplayedColumnsFedex();
  }

  async fetchChargeDescriptionDetailsFedEx(resultParameter: any): Promise<void> {
    var tempaccNoArr = this.fedexFormGroup.get('accountNumber')?.value;
    var containsAllFedEx = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == 'ALL' || tempaccNoArr == null || containsAllFedEx == true) {
      this.fedexFormGroup.get('accountNumber')?.setValue(this.defaultvalueArr);
    }
    this.myAC = [];
    this.myAC_Res = [];

    this.tot_fright = 0;
    this.total_trackFright = 0;
    this.tot_Acc = 0;
    this.totaltrackaccpersent = 0;
    this.totaltrackGroundprecent = 0;
    this.Sum_trackNextPrecent = 0;
    this.totalvalue = 0;
    this.tot_Ground = 0;
    this.total_trackNo_Ground = 0;
    this.totaltrackfreprecent = 0;
    this.tot_Next = 0;
    this.total_trackNo_Next = 0;
    this.total_trackNextPrecent = 0;
    this.Sum_trackNextPrecent = 0;
    this.closeLoading();
    if (resultParameter.length == 0) {
      this.openModal("No record found");
      this.closeLoading();
      return;
    }
    this.reportName = this.fedexFormGroup.get('reportname')?.value;

    this.myAC = resultParameter;
    var myAclen: number = this.myAC.length;
    this.grandTot = Number(this.myAC[myAclen - 1].grandTot);

    for (let count = 0; count < this.myAC.length; count++) {
      let t008Obj: any = [];
      if (this.myAC[count].type == "Freight") {
        this.tot_fright += Number(this.myAC[count].netamount);
        this.total_trackFright += Number(this.myAC[count].noofshipments);


        if (resultParameter[count].airGround == "Ground") {
          this.tot_Ground += Number(resultParameter[count].netamount);
          this.total_trackNo_Ground += Number(resultParameter[count].noofshipments);

        }
        else if (resultParameter[count].airGround == "Air") {
          this.tot_Next += Number(resultParameter[count].netamount);
          this.total_trackNo_Next += Number(resultParameter[count].noofshipments);
        }

      }
      else if (this.myAC[count].type == "Accessorial") {
        this.tot_Acc += Number(this.myAC[count].netamount);
      }
      t008Obj['group'] = String(this.myAC[count].group);
      t008Obj['type'] = String(this.myAC[count].type);
      t008Obj['importexport'] = String(this.myAC[count].importexport);
      this.netAmt = Number(this.myAC[count].netamount);
      this.perOfSpent = (this.netAmt / this.grandTot) * 100;
      t008Obj['percentofspent'] = Number(this.perOfSpent.toFixed(2));
      this.myAC[count]['percentofspent'] = Number(this.perOfSpent.toFixed(2));
      t008Obj['noofshipments'] = (this.myAC[count].noofshipments);
      t008Obj['netamount'] = String(this.myAC[count].netamount);
      t008Obj['netamountfrtacc'] = String(this.myAC[count].netamountfrtacc);
      t008Obj['avgcost'] = String(this.myAC[count].avgcost);
      t008Obj['avgcostfrtacc'] = String(this.myAC[count].avgcostfrtacc);

      t008Obj['costperlbs'] = (String((this.myAC[count].costperlbs)));
      t008Obj['costperkgs'] = (String((this.myAC[count].costperkgs)));

      t008Obj['totalweightlbs'] = String((this.myAC[count].totalweightlbs));
      t008Obj['totalweightkgs'] = String((this.myAC[count].totalweightkgs));

      t008Obj['avgweightlbs'] = String((this.myAC[count].avgweightlbs));
      t008Obj['avgweightkgs'] = String((this.myAC[count].avgweightkgs));
      t008Obj['avgzone'] = String((this.myAC[count].avgzone));
      if (this.myAC[count].type == "Freight") {
        t008Obj['avgdiscount'] = Number(this.decimalLimiter(Number((this.myAC[count].avgdiscount) * 100), 1)).toFixed(1);
      }
      else {
        t008Obj['avgdiscount'] = Number(this.decimalLimiter(String(Number((this.myAC[count].avgdiscount))), 1)).toFixed(1);

        t008Obj['zerospackage'] = String((this.myAC[count].zerospackage));
        t008Obj['zerovalueprcentofpackages'] = String(Number((this.myAC[count].zerovalueprcentofpackages) * 100));
        t008Obj['avgcostzerovalues'] = (String((this.myAC[count].avgcostzerovalues)));
        t008Obj['netAmountRef'] = this.netAmt;
      }
      this.myAC_Res.push(t008Obj);
    }
    if (this.fedexFormGroup.get('reportname')?.value == "ImportExport") {
      this.txt_lbl_text = "Advance Charge Description Freight and Accessorial Separated  - Adjusted ";
      this.typeDataFed = "Freight_Accessorial";
      this.showImp_Exp = true;
    }
    if (this.fedexFormGroup.get('reportname')?.value == "Advance") {
      this.txt_lbl_text = "Advance Charge Description Freight and Accessorial Separated";
      this.typeDataFed = "Freight_Accessorial";
      this.showImp_Exp = false;
    }
    if (this.fedexFormGroup.get('reportname')?.value == "Freight_Accessorial_Combined") {
      this.txt_lbl_text = "Advance Charge Description Freight and Accessorial Combined";

      this.showImp_Exp = false;
      this.typeDataFed = "Freight_Accessorial";
    }
    if (this.fedexFormGroup.get('reportname')?.value == "FrieghtPackages") {
      this.txt_lbl_text = "Advance Charge Description Freight Packages";

      this.showImp_Exp = false;
      this.typeDataFed = "FrieghtPackages";
    }
    this.totalvalue = Number(this.tot_Acc + this.tot_fright);
    this.totaltrackaccpersent = (this.tot_Acc / (this.tot_Acc + this.tot_fright)) * 100;
    this.totaltrackfreprecent = (this.tot_fright / (this.tot_Acc + this.tot_fright)) * 100;

    /* Total ground and Air*/
    this.Sum_trackNextPrecent = Number(this.tot_Ground + this.tot_Next);
    this.total_trackNextPrecent = (this.tot_Next / (this.Sum_trackNextPrecent)) * 100;
    this.totaltrackGroundprecent = (this.tot_Ground / (this.Sum_trackNextPrecent)) * 100;
  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  setDisplayedColumnsFedex() {
    var reportName = this.fedexFormGroup.get('reportname')?.value;

    if (reportName == 'ImportExport' && this.showImp_Exp == true) {
      this.displayedColumns = [];
      this.columns = [
        { field: 'Group', fieldVal: 'group', label: 'Group', visible: true },
        { field: 'Type', fieldVal: 'type', label: 'Type', visible: true },
        { field: 'Import / Export', fieldVal: 'importexport', label: 'Import / Export', visible: true },
        { field: 'Net Charge', fieldVal: 'netamount', label: 'Net Charge', visible: true },
        { field: 'Number of Shipments', fieldVal: 'noofshipments', label: 'Number of Shipments', visible: true },
        { field: 'Avg.Cost', fieldVal: 'avgcost', label: 'Avg.Cost', visible: true },
        { field: 'Cost Per lbs', fieldVal: 'costperlbs', label: 'Cost Per lbs', visible: true },
        { field: 'Cost Per kgs', fieldVal: 'costperkgs', label: 'Cost Per kgs', visible: true },
        { field: 'Total Rated Weight lbs', fieldVal: 'totalweightlbs', label: 'Total Rated Weight lbs', visible: true },
        { field: 'Total Rated Weight kgs', fieldVal: 'totalweightkgs', label: 'Total Rated Weight kgs', visible: true },
        { field: '% of Spend', fieldVal: 'percentofspent', label: '% of Spend', visible: true },
        { field: 'Avg.Weight lbs', fieldVal: 'avgweightlbs', label: 'Avg.Weight lbs', visible: true },
        { field: 'Avg.Weight kgs', fieldVal: 'avgweightkgs', label: 'Avg.Weight kgs', visible: true },
        { field: 'Gross Charge', fieldVal: 'grossCharge', label: 'Gross Charge', visible: true },
        { field: 'Avg.Zone', fieldVal: 'avgzone', label: 'Avg.Zone', visible: true },
        { field: 'Avg. Discount %', fieldVal: 'avgdiscount', label: 'Avg. Discount %', visible: true }
      ];

    } else if (reportName == 'Advance') {
      this.displayedColumns = [];
      this.columns = [
        { field: 'Group', fieldVal: 'group', label: 'Group', visible: true },
        { field: 'Type', fieldVal: 'type', label: 'Type', visible: true },
        { field: 'Net Charge', fieldVal: 'netamount', label: 'Net Charge', visible: true },
        { field: 'Number of Shipments', fieldVal: 'noofshipments', label: 'Number of Shipments', visible: true },
        { field: 'Avg.Cost', fieldVal: 'avgcost', label: 'Avg.Cost', visible: true },
        { field: 'Cost Per lbs', fieldVal: 'costperlbs', label: 'Cost Per lbs', visible: true },
        { field: 'Cost Per kgs', fieldVal: 'costperkgs', label: 'Cost Per kgs', visible: true },
        { field: 'Total Rated Weight lbs', fieldVal: 'totalweightlbs', label: 'Total Rated Weight lbs', visible: true },
        { field: 'Total Rated Weight kgs', fieldVal: 'totalweightkgs', label: 'Total Rated Weight kgs', visible: true },
        { field: '% of Spend', fieldVal: 'percentofspent', label: '% of Spend', visible: true },
        { field: 'Avg.Weight lbs', fieldVal: 'avgweightlbs', label: 'Avg.Weight lbs', visible: true },
        { field: 'Avg.Weight kgs', fieldVal: 'avgweightkgs', label: 'Avg.Weight kgs', visible: true },
        { field: 'Gross Charge', fieldVal: 'grossCharge', label: 'Gross Charge', visible: true },
        { field: 'Avg.Zone', fieldVal: 'avgzone', label: 'Avg.Zone', visible: true },
        { field: 'Avg. Discount %', fieldVal: 'avgdiscount', label: 'Avg. Discount %', visible: true }
      ];

    } else if (reportName == 'Freight_Accessorial_Combined') {
      this.displayedColumns = [];
      this.columns = [
        { field: 'Group', fieldVal: 'group', label: 'Group', visible: true },
        { field: 'Type', fieldVal: 'Typefrt_frtAcc', label: 'Type', visible: true },
        { field: 'Net Charge', fieldVal: 'netamount', label: 'Net Charge', visible: true },
        { field: 'Number of Shipments', fieldVal: 'noofshipments', label: 'Number of Shipments', visible: true },
        { field: 'Avg.Cost', fieldVal: 'avgcost', label: 'Avg.Cost', visible: true },
        { field: 'Cost Per lbs', fieldVal: 'costperlbs', label: 'Cost Per lbs', visible: true },
        { field: 'Cost Per kgs', fieldVal: 'costperkgs', label: 'Cost Per kgs', visible: true },
        { field: 'Total Rated Weight lbs', fieldVal: 'totalweightlbs', label: 'Total Rated Weight lbs', visible: true },
        { field: 'Total Rated Weight kgs', fieldVal: 'totalweightkgs', label: 'Total Rated Weight kgs', visible: true },
        { field: '% of Spend', fieldVal: 'percentofspent', label: '% of Spend', visible: true },
        { field: 'Avg.Weight lbs', fieldVal: 'avgweightlbs', label: 'Avg.Weight lbs', visible: true },
        { field: 'Avg.Weight kgs', fieldVal: 'avgweightkgs', label: 'Avg.Weight kgs', visible: true },
        { field: 'Gross Charge', fieldVal: 'grossCharge', label: 'Gross Charge', visible: true },
        { field: 'Avg.Zone', fieldVal: 'avgzone', label: 'Avg.Zone', visible: true },
        { field: 'Avg. Discount %', fieldVal: 'avgdiscount', label: 'Avg. Discount %', visible: true }
      ];

    } else {
      this.displayedColumns = [];
      this.columns = [
        { field: 'Group', fieldVal: 'group', label: 'Group', visible: true },
        { field: 'Type', fieldVal: 'type', label: 'Type', visible: true },
        { field: 'Net Amount FRT', fieldVal: 'netamount', label: 'Net Amount FRT', visible: true },
        { field: 'Net Amount FRT+ACC', fieldVal: 'netamountfrtacc', label: 'Net Amount FRT+ACC', visible: true },
        { field: 'No. Of Shipments', fieldVal: 'noofshipments', label: 'No. Of Shipments', visible: true },
        { field: 'Avg.Cost FRT', fieldVal: 'avgcost', label: 'Avg.Cost FRT', visible: true },
        { field: 'Avg.Cost FRT+ACC', fieldVal: 'avgcostfrtacc', label: 'Avg.Cost FRT+ACC', visible: true },
        { field: 'Gross Charge', fieldVal: 'grossCharge', label: 'Gross Charge', visible: true }
      ];
    }

    this.updateDisplayedColumnsFedex();
  }

  updateDisplayedColumnsFedex() {
    this.displayedColumns = [];

    this.columns.forEach((column, index) => {
      column.index = index;
      if (column.visible) {
        this.displayedColumns.push(column.fieldVal);
      }
    });

    this.dataFormatterFedex(this.displayedColumns);
    this.cd.detectChanges();
  }


  dataFormatterFedex(displayedColumns: any[]) {
    for (let loop1 = 0; loop1 < displayedColumns.length; loop1++) {
      for (let loop2 = 0; loop2 < this.fetchChargeDescriptionDetailsFedex.length; loop2++) {
        const field = displayedColumns[loop1];
        let val = this.fetchChargeDescriptionDetailsFedex[loop2][field];

        if (field == 'netamount' || field == 'netamountfrtacc' || field == 'avgcost' || field == 'costperlbs'
          || field == 'costperkgs' || field == 'avgcostfrtacc' || field == 'grossCharge') {
          if (val != "" && val != null) {
            if (val.toString().indexOf('$') > -1) {
              this.fetchChargeDescriptionDetailsFedex[loop2][field] = this.setCommaQty(val);
            } else {
              this.fetchChargeDescriptionDetailsFedex[loop2][field] = '$' + this.setCommaQty(val);
            }
          }
        }
        else if (field == 'percentofspent') {
          if (val != "" && val != null) {
            if (val.toString().indexOf('%') > -1) {
              this.fetchChargeDescriptionDetailsFedex[loop2][field] = this.setCommaQty(val);
            } else {
              this.fetchChargeDescriptionDetailsFedex[loop2][field] = Number(val).toFixed(2) + '%';
            }
          }
        }
        else if (field == 'totalweightlbs' || field == 'totalweightkgs' || field == 'noofshipments' ||
          field == 'avgweightlbs' || field == 'avgweightkgs' || field == 'avgzone') {
          this.fetchChargeDescriptionDetailsFedex[loop2][field] = this.setCommaQty(val);
        }
        else if (field == 'avgdiscount') {
          if (val != "" && val != null) {
            if (val.toString().indexOf('%') > -1) {
              this.fetchChargeDescriptionDetailsFedex[loop2][field] = this.setCommaQty(val);
            } else {
              this.fetchChargeDescriptionDetailsFedex[loop2][field] = Number(this.decimalLimiter(Number(val * 100), 1)).toFixed(2) + '%';
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
    this.updateDisplayedColumnsFedex();
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
  }

  // -----------------------------------
  // Row styling (TABLE 3)
  // -----------------------------------
  getRowClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'freight') return 'freight-row';
    if (t === 'accessorial') return 'accessorial-row';
    return '';
  }

  // Row styling (TABLE 1)
  getSummaryRowClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t === 'freight') return 'freight-row';
    if (t === 'accessorial') return 'accessorial-row';
    return '';
  }

  // Row styling (TABLE 2)
  getFRTSummaryRowClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t.includes('ground')) return 'ground-row';
    if (t.includes('air')) return 'air-row';
    return '';
  }

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
    var boolRes = this.compareTwoDatesFedex();
    if (boolRes != false) {
      var accountNoValArr = await this.fedexFormGroup.get('accountNumber')?.value;
      var containsAllFedEx = accountNoValArr[0].includes('ALL');
      if (accountNoValArr == "ALL" || containsAllFedEx == true) {
        var accountNo = null;
        this.fedexFormGroup.get('accNo')?.setValue(accountNo);
      }
      else {
        var accountNoVal = accountNoValArr.join('@');
        this.fedexFormGroup.get('accNo')?.setValue(accountNoVal);

      }

      this.openLoading();
      //added for change T_13852
      var fromdate = this.fedexFormGroup.get('fromdate')?.value;
      var todate = this.fedexFormGroup.get('todate')?.value;
      this.fromDateFormat = this.datePipe.transform(fromdate, "MMM dd,yyyy");
      this.toDateFormat = this.datePipe.transform(todate, "MMM dd,yyyy");

      //added for change T_13852
      var report = await this.fedexFormGroup.get('reportname')?.value;
      if (report == "Freight_Accessorial_Combined") { //9126
        this.IsaccessorialCombined = true;
      } else {
        this.IsaccessorialCombined = false;
      }


      await this.fedexFormGroup.get('reportname')?.setValue(report);
      var fromDate = await this.fedexFormGroup.get('fromdate')?.value;
      var toDate = await this.fedexFormGroup.get('todate')?.value;
      var fromDateTransformed = await this.datePipe.transform(fromDate, "yyyy-MM-dd");
      var toDateTransformed = await this.datePipe.transform(toDate, "yyyy-MM-dd");
      await this.fedexFormGroup.get('fromdate')?.setValue(fromDateTransformed);
      await this.fedexFormGroup.get('todate')?.setValue(toDateTransformed);

      await this.httpfedexService.fetchAdvanceChargeDesc(this.fedexFormGroup.value).subscribe({
        next: (result) => {
          this.fetchChargeDescriptionDetailsFedex = [];
          this.fetchChargeDescriptionDetailsFedex = result;
          if (this.fetchChargeDescriptionDetailsFedex.length == 0) {
            this.openModal("No record found");
            this.closeLoading();
            return;
          }
          this.checkerMethodFedex(this.fetchChargeDescriptionDetailsFedex);

        },
        error: error => {
          console.log('error ', error);

        }
      })
    }
    this.fedexFormGroup.get('fromdate')?.setValue(new Date(fromDate));
    this.fedexFormGroup.get('todate')?.setValue(new Date(toDate));
    this.fedexFormGroup.get('accNo')?.setValue(accountNoVal);


  }

  compareTwoDatesFedex(): boolean {
    var dateFr = this.fedexFormGroup.get('fromdate')?.value;
    var dateT = this.fedexFormGroup.get('todate')?.value;
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    return true;
  }

  toggleSelectionFedEx() {
    var accvalue = this.fedexFormGroup.get('accountNumber')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValueFedEx.deselect();
    }
  }

  toggleAllSelectionFedEx() {
    if (this.allSelectedValueFedEx.selected) {
      this.accNoSelFedEx.options.forEach((item: MatOption) => { item.deselect() });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.fedexFormGroup.get('accountNumber')?.setValue(setAllvalue);
    }
  }

  async clearall_clickHandlerFedex() {
    await this.fedexFormGroup.get('fromdate')?.setValue(new Date(this.tempfromDate));
    await this.fedexFormGroup.get('todate')?.setValue(new Date(this.temptoDate));
    this.fedexFormGroup.get('reportFormGroup')?.setValue('ADVANCE_CHARGE_DESCRIPTION');
  }

  exportTOExcelFedEx() {
    var downloadReport = this.reportFormGroup.get('downloadReport')?.value;
    if (downloadReport == "ADVANCE_CHARGE_DESCRIPTION_DETAILS") {
      this.excel_clickHandlerFedex();
    } else if (downloadReport == "ADVANCE_CHARGE_DESCRIPTION") {
      this.generateExcelFedEx();
    }
  }


  excel_clickHandlerFedex() {
    var currentDate = new Date();
    this.fedexFormGroup.get('requesteddttm')?.setValue(currentDate);
    this.fedexFormGroup.get('createdDate')?.setValue(currentDate);
    var tempaccNoArr = this.fedexFormGroup.get('accountNumber')?.value;
    var containsAllFedEx = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == "ALL" || containsAllFedEx == true) {
      this.fedexFormGroup.get('accNo')?.setValue(null);

    }
    var reportName = this.fedexFormGroup.get('reportName')?.value;
    var downloadReportVal = this.reportFormGroup.get('downloadReport')?.value;
    if (downloadReportVal == "ADVANCE_CHARGE_DESCRIPTION") {
      if (this.fedexFormGroup.get('reportname')?.value == "ImportExport") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialSeparatedAdjusted");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialSeparatedAdjusted");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialSeparatedAdjusted");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "Advance") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialSeparated");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialSeparated");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialSeparated");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "Freight_Accessorial_Combined") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialCombined");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialCombined");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialCombined");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "FrieghtPackages") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightPackagesAverageCost");
        this.fedexFormGroup.get('modulename')?.setValue("FreightPackagesAverageCost");
        this.fedexFormGroup.get('reportType')?.setValue("FreightPackagesAverageCost");
      }
    }
    else if (downloadReportVal == "ADVANCE_CHARGE_DESCRIPTION_DETAILS") {
      if (this.fedexFormGroup.get('reportname')?.value == "ImportExport") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialSeparatedAdjusted_Details");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialSeparatedAdjusted_Details");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialSeparatedAdjusted_Details");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "Advance") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialSeparated_Details");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialSeparated_Details");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialSeparated_Details");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "Freight_Accessorial_Combined") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialCombined_Details");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialCombined_Details");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialCombined_Details");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "FrieghtPackages") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightPackagesAverageCost_Details");
        this.fedexFormGroup.get('modulename')?.setValue("FreightPackagesAverageCost_Details");
        this.fedexFormGroup.get('reportType')?.setValue("FreightPackagesAverageCost_Details");
      }
    }
    else {
      if (this.fedexFormGroup.get('reportname')?.value == "ImportExport") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialSeparatedAdjusted");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialSeparatedAdjusted");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialSeparatedAdjusted");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "Advance") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialSeparated");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialSeparated");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialSeparated");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "Freight_Accessorial_Combined") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightandAccessorialCombined");
        this.fedexFormGroup.get('modulename')?.setValue("FreightandAccessorialCombined");
        this.fedexFormGroup.get('reportType')?.setValue("FreightandAccessorialCombined");
      }
      if (this.fedexFormGroup.get('reportname')?.value == "FrieghtPackages") {
        this.fedexFormGroup.get('reportName')?.setValue("FreightPackagesAverageCost");
        this.fedexFormGroup.get('modulename')?.setValue("FreightPackagesAverageCost");
        this.fedexFormGroup.get('reportType')?.setValue("FreightPackagesAverageCost");
      }
    }
    this.fedexFormGroup.get('status')?.setValue("IN QUEUE");
    this.fedexFormGroup.get('login_id')?.setValue(this.loginId + "");
    this.fedexFormGroup.get('loginId')?.setValue(0);
    var clientName = this.userProfifle.clientName.replace(/[ ]/g, "_");
    this.fedexFormGroup.get('clientName')?.setValue(clientName);
    var tempdateFrom = this.fedexFormGroup.get('fromdate')?.value;
    var tempdateTo = this.fedexFormGroup.get('todate')?.value;
    var validdateFrom = this.datePipe.transform(tempdateFrom, "yyyy-MM-dd");
    var validdateTo = this.datePipe.transform(tempdateTo, "yyyy-MM-dd");
    this.fedexFormGroup.get('fromdate')?.setValue(validdateFrom);
    this.fedexFormGroup.get('fromDate')?.setValue(validdateFrom);
    this.fedexFormGroup.get('todate')?.setValue(validdateTo);
    this.fedexFormGroup.get('toDate')?.setValue(validdateTo);
    this.httpfedexService.runReport(this.fedexFormGroup.value).subscribe({
      next: (result) => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error: (error) => {
      }
    });
    this.fedexFormGroup.get('fromdate')?.setValue(new Date(tempdateFrom));
    this.fedexFormGroup.get('fromDate')?.setValue(new Date(tempdateFrom));
    this.fedexFormGroup.get('todate')?.setValue(new Date(tempdateTo));
    this.fedexFormGroup.get('toDate')?.setValue(new Date(tempdateTo));
  }

  saveOrUpdateReportLogResultFedex(result: any) {
    var t007_reportlogobjResult = result;
    if ((t007_reportlogobjResult.reportName == "RAW_DATA_REPORT_ADJUSTED_CHARGEDESCRIPTION" || t007_reportlogobjResult.reportName == "RAW_DATA_REPORT_CHARGEDESCRIPTION") && t007_reportlogobjResult.countInvoiceData > 100000) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.fedexFormGroup.value, "BATCH");
      return;
    }
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
  }

  generateExcelFedEx() {
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
    var d = new Date();
    var currentDate = this.datePipe.transform(d, "yyyy-MM-dd HH:mm:ss");
    var fileName = "";
    var title = "";
    if (this.clientType() == "UPS") {
    }
    else {
      var fileNameSecond = ""
      if (this.reportName == 'Advance') {
        fileNameSecond = "_Freight_Accessorial_Separated_";
        title = 'Freight Accessorial Separated';
      }
      if (this.reportName == 'Freight_Accessorial_Combined') {
        fileNameSecond = "_Freight_Accessorial_Combined";
        title = "Freight and Accessorial Combined Report";
      }
      if (this.reportName == 'FrieghtPackages') {
        fileNameSecond = "_FreightPackages_AvgCost";
        title = "Freight Package / Average Cost";
      }
      if (this.reportName == "ImportExport") {
        fileNameSecond = "_Freight_Accessorial_Separated_Adjusted_";
        title = 'Freight Accessorial Separated Adjusted';
      }

      fileName = this.clientName + fileNameSecond + currentDate + ".xlsx";
    }

    var tableOneArr = [];
    var headerTableOneArr = [];
    if (this.IsaccessorialCombined == false) {
      tableOneArr.push(['Freight', Number(this.tot_fright.toFixed(2)), Number(this.total_trackFright), Number(this.totaltrackfreprecent.toFixed(2)) / 100])
      tableOneArr.push(['Accessorial', Number(this.tot_Acc.toFixed(2)), '', Number(this.totaltrackaccpersent.toFixed(2)) / 100])
    }
    else {
      tableOneArr.push(['Freight + Accessorial', Number(this.tot_fright.toFixed(2)), Number(this.total_trackFright), Number(this.totaltrackfreprecent.toFixed(2)) / 100])
      tableOneArr.push(['-', '-', '', '-'])
    }
    tableOneArr.push(['Total', Number(this.totalvalue.toFixed(2)), '', ''])
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Charge Description Summary');
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    //Add Title
    var fromDate = this.fedexFormGroup.get('fromdate')?.value;
    var toDate = this.fedexFormGroup.get('todate')?.value;
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
        var typeVal = row['_cells'][0]['_value'].model.value;
        if (typeVal == "Freight") {
          row.eachCell((cell: any, number: number) => {
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
        else if (typeVal == "Accessorial") {
          row.eachCell((cell: any, number: number) => {
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
          row.eachCell((cell: any, number: number) => {
            worksheet.getCell('B6').numFmt = '$#,##0.00';
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'ffffff' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
      }
      else {
        var typeVal = row['_cells'][0]['_value'].model.value;
        row.eachCell((cell: any, number: number) => {
          if (typeVal == "Freight + Accessorial") {
            worksheet.getCell('B4').numFmt = '$#,##0.00';
            worksheet.getCell('C4').numFmt = '#,##0';
            worksheet.getCell('D4').numFmt = '0.00%';
          }
          else if (typeVal == "Total") {
            worksheet.getCell('B6').numFmt = '$#,##0.00';
          }
          if (count % 2 == 1) {
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
    var headerTableTwoArr = [];
    var tableTwoArr = [];
    if (this.IsaccessorialCombined == false) {
      tableTwoArr.push(['Just FRT Ground', Number(this.tot_Ground.toFixed(2)), Number(this.total_trackNo_Ground), Number(this.totaltrackGroundprecent.toFixed(2)) / 100])
      tableTwoArr.push(['Just FRT Air', Number(this.tot_Next.toFixed(2)), Number(this.total_trackNo_Next), Number(this.total_trackNextPrecent.toFixed(2)) / 100])
    }
    else {
      tableTwoArr.push(['Just FRT+ACC Ground', Number(this.decimalLimiter(this.tot_Ground, 2)), Number(this.total_trackNo_Ground),
        Number(this.totaltrackGroundprecent.toFixed(2)) / 100])
      tableTwoArr.push(['Just FRT+ACC Air', Number(this.tot_Next.toFixed(2)), Number(this.total_trackNo_Next),
        Number(this.total_trackNextPrecent.toFixed(2)) / 100])
    }
    tableTwoArr.push(['Total', Number(this.Sum_trackNextPrecent.toFixed(2)), '', ''])
    //Add Header Row
    headerTableTwoArr.push('Type', 'Net Charge', 'Number of Shipments', '% of Spend')
    let headerRow_TableTwo = worksheet.addRow(headerTableOneArr);
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
        var typeVal = row['_cells'][0]['_value'].model.value;
        if (typeVal == "Just FRT Ground" || typeVal == "Just FRT Air") {
          if (typeVal == "Just FRT Ground") {
            worksheet.getCell('B10').numFmt = '$#,##0.00';
            worksheet.getCell('C10').numFmt = '#,##0';
            worksheet.getCell('D10').numFmt = '0.00%';
          }
          if (typeVal == "Just FRT Air") {
            worksheet.getCell('B11').numFmt = '$#,##0.00';
            worksheet.getCell('C11').numFmt = '#,##0';
            worksheet.getCell('D11').numFmt = '0.00%';
          }
          row.eachCell((cell: any, number: number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'a4d6ff' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
        else {
          worksheet.getCell('B12').numFmt = '$#,##0.00';
          row.eachCell((cell: any, number: number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'ffffff' }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        }
      }
      else {
        var typeVal = row['_cells'][0]['_value'].model.value;
        row.eachCell((cell: any, number: number) => {
          if (typeVal == "Just FRT+ACC Ground") {
            worksheet.getCell('B10').numFmt = '$#,##0.00';
            worksheet.getCell('C10').numFmt = '#,##0';
            worksheet.getCell('D10').numFmt = '0.00%';
          }
          else if (typeVal == "Just FRT+ACC Air") {
            worksheet.getCell('B11').numFmt = '$#,##0.00';
            worksheet.getCell('C11').numFmt = '#,##0';
            worksheet.getCell('D11').numFmt = '0.00%';
          }
          else if (typeVal == "Total") {
            worksheet.getCell('B12').numFmt = '$#,##0.00';
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
    for (var loop1 = 0; loop1 < this.fetchChargeDescriptionDetailsFedex.length; loop1++) {
      tablethreeDataArr = [];
      for (var loop2 = 0; loop2 < this.displayedColumns.length; loop2++) {
        console.log(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[1]]);
        if (this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[1]] == "Freight") {
          if (this.reportName == 'Advance' || this.reportName == 'FrieghtPackages') {
            if (loop2 == 0 || loop2 == 1) {
              tablethreeDataArr.push(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]])
            }
            else if (loop2 == 9 || loop2 == 14) {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100);
            }
            else {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
            }
          }
          else {
            if (loop2 == 0 || loop2 == 1 || loop2 == 2) {
              tablethreeDataArr.push(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]])
            }
            else if (loop2 == 10 || loop2 == 15) {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100);
            }
            else {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
            }
          }

        }
        else if (this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[1]] == "Freight + Accessorial") {
          if (loop2 == 0 || loop2 == 1) {
            tablethreeDataArr.push(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]])
          }
          else if (loop2 == 9 || loop2 == 14) {
            tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100);
          }
          else {
            tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
          }
        }
        else if (this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[1]] == "Accessorial") {
          if (this.reportName == 'Advance') {
            if (loop2 == 0 || loop2 == 1 || loop2 == 5 || loop2 == 6 || loop2 == 7 || loop2 == 8 || loop2 == 10 || loop2 == 11 || loop2 == 12 || loop2 == 13 || loop2 == 14) {
              tablethreeDataArr.push(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]])
            }
            else if (loop2 == 9) {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100);
            }
            else {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
            }
          }
          else {
            if (loop2 == 0 || loop2 == 1 || loop2 == 2 || loop2 == 6 || loop2 == 7 || loop2 == 8 || loop2 == 9 || loop2 == 11 || loop2 == 12 || loop2 == 13 || loop2 == 14 || loop2 == 15) {
              tablethreeDataArr.push(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]])
            }
            else if (loop2 == 10) {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100);
            }
            else {
              tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetailsFedex[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
            }
          }
        }
      }
      tablethreeArr.push(tablethreeDataArr)
    }
    console.log(this.reportNameSearched);
    console.log(this.reportName);

    var headerTableThreeArr = [];
    for (let loop = 0; loop < this.columns.length; loop++) {
      headerTableThreeArr.push(this.columns[loop]['field']);
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
    if (this.reportName == 'ImportExport') {
      tablethreeArr.forEach((d, index) => {

        let row: any = worksheet.addRow(d);
        var typeVal = row['_cells'][1]['_value'].model.value;
        if (typeVal == "Freight") {

          row.eachCell((cell: any, number: number) => {
            if (number == 4 || number == 6 || number == 7 || number == 8 || number == 14) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '$#,##0.00';
            }
            else if (number == 5) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0';
            }
            else if (number == 9 || number == 10 || number == 12 || number == 13 || number == 15) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0.00';
            }
            else if (number == 11 || number == 16) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '0.00%';
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'a4d6ff' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        } else {
          row.eachCell((cell: any, number: number) => {
            if (number == 4 || number == 6 || number == 7 || number == 8 || number == 14) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '$#,##0.00';
            }
            else if (number == 5) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0';
            }
            else if (number == 9 || number == 10 || number == 12 || number == 13 || number == 15) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0.00';
            }
            else if (number == 11 || number == 16) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '0.00%';
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
    else if (this.reportName == 'Advance') {
      tablethreeArr.forEach((d, index) => {

        let row: any = worksheet.addRow(d);
        var typeVal = row['_cells'][1]['_value'].model.value;
        if (typeVal == "Freight") {

          row.eachCell((cell: any, number: number) => {

            if (number == 3 || number == 5 || number == 6 || number == 7 || number == 13) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '$#,##0.00';
            }
            else if (number == 4) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0';
            }
            else if (number == 8 || number == 9 || number == 11 || number == 12 || number == 14) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0.00';
            }
            else if (number == 10 || number == 15) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '0.00%';
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'a4d6ff' }
            }

            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          })
        } else {
          row.eachCell((cell: any, number: number) => {
            if (number == 3 || number == 5 || number == 6 || number == 7 || number == 13) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '$#,##0.00';
            }
            else if (number == 4) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0';
            }
            else if (number == 8 || number == 9 || number == 11 || number == 12 || number == 14) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0.00';
            }
            else if (number == 10 || number == 15) {
              worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '0.00%';
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
    else if (this.reportName == 'FrieghtPackages') {
      tablethreeArr.forEach((d, index) => {
        let row = worksheet.addRow(d);

        row.eachCell((cell, number) => {
          if (number == 3 || number == 4 || number == 6 || number == 7 || number == 8) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '$#,##0.00';
          }
          else if (number == 5) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0';
          }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',

            fgColor: { argb: 'a4d6ff' }
          }

          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })
      }
      );
    } else {
      var count = 1;
      tablethreeArr.forEach((d, index) => {
        let row = worksheet.addRow(d);

        row.eachCell((cell, number) => {
          if (number == 3 || number == 5 || number == 6 || number == 7 || number == 13) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '$#,##0.00';
          }
          else if (number == 4) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0';
          }
          else if (number == 8 || number == 9 || number == 11 || number == 12 || number == 14) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '#,##0.00';
          }
          else if (number == 10 || number == 15) {
            worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 16) + "'").numFmt = '0.00%';
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

  // need to Discuss
  openClientAcNoDetailsPopup(t007_reportlogobjResult: any, detailReportVal: any, DateRangeString: any) {
    const dialogConfig = this.dialog.open(MailPopupComponent, {
      width: '60%',
      height: '480px',
      //panelClass: this.panelClass,
      data: {
        t007_reportlogobjResult: t007_reportlogobjResult,
        t007_reportlogobj: detailReportVal,
        DateRangeString: DateRangeString,
        clienttype: this.clientType
      }

    });
  }

  ChargeDescription_clickHandlerFedex(chargeDescription: any, chargeType: any, importExport: any): void {
    var currentDate = new Date();
    this.fedexFormGroup.get('requesteddttm')?.setValue(currentDate);
    this.fedexFormGroup.get('createdDate')?.setValue(currentDate);
    var tempaccNoArr = this.fedexFormGroup.get('accountNumber')?.value;
    var containsAllFedEx = tempaccNoArr[0].includes('ALL');
    if (tempaccNoArr == "ALL" || containsAllFedEx == true) {
      this.fedexFormGroup.get('accNo')?.setValue("");
    } else {
      var tempaccNo = tempaccNoArr.join('@');
      this.fedexFormGroup.get('accNo')?.setValue(tempaccNo);
    }

    if (this.fedexFormGroup.get('reportname')?.value == "ImportExport") {
      this.fedexFormGroup.get('reportName')?.setValue("RAW_DATA_REPORT_ADJUSTED_CHARGEDESCRIPTION");
    }
    else {
      this.fedexFormGroup.get('reportName')?.setValue("RAW_DATA_REPORT_CHARGEDESCRIPTION");
    }
    chargeDescription = chargeDescription.replace(/[ ]/g, "@");
    this.fedexFormGroup.get('modulename')?.setValue("ChargeDescription");
    this.fedexFormGroup.get('reportType')?.setValue("Charge Description Grouping");
    this.fedexFormGroup.get('chargeDesc')?.setValue(chargeDescription);
    this.fedexFormGroup.get('chargeType')?.setValue(chargeType);
    if (importExport != undefined && this.fedexFormGroup.get('reportname')?.value == "ImportExport") {
      importExport = importExport.replace(/[ ]/g, "@");
    }
    this.fedexFormGroup.get('chargeGroup')?.setValue(importExport);
    this.fedexFormGroup.get('status')?.setValue("IN QUEUE");
    this.fedexFormGroup.get('login_id')?.setValue(this.loginId + "");
    var clientName = this.userProfifle.clientName.replace(/[ ]/g, "_");
    this.fedexFormGroup.get('clientName')?.setValue(clientName);
    var tempdateFrom = this.fedexFormGroup.get('fromdate')?.value;
    var tempdateTo = this.fedexFormGroup.get('todate')?.value;
    var validdateFrom = this.datePipe.transform(tempdateFrom, "yyyy-MM-dd");
    var validdateTo = this.datePipe.transform(tempdateTo, "yyyy-MM-dd");
    this.fedexFormGroup.get('fromdate')?.setValue(validdateFrom);
    this.fedexFormGroup.get('fromDate')?.setValue(validdateFrom);
    this.fedexFormGroup.get('todate')?.setValue(validdateTo);
    this.fedexFormGroup.get('toDate')?.setValue(validdateTo);
    this.httpfedexService.runReport(this.fedexFormGroup.value).subscribe({
      next: result => {
        this.saveOrUpdateReportLogResultFedex(result);
      },
      error: () => {
      }
    });
    this.fedexFormGroup.get('fromdate')?.setValue(new Date(tempdateFrom));
    this.fedexFormGroup.get('fromDate')?.setValue(new Date(tempdateFrom));
    this.fedexFormGroup.get('todate')?.setValue(new Date(tempdateTo));
    this.fedexFormGroup.get('toDate')?.setValue(new Date(tempdateTo));
  }


}