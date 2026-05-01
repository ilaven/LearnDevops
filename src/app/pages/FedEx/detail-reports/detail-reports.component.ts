import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  signal
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { MatOption, MatSelect } from '@angular/material/select';
import { SchedularPopup } from './schedularpopup/schedular-popup.component';
import { FedexReportLogComponent } from './report-log/report-log.component';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MailPopupComponent } from './mail-popup/mail-popup.component';
import { map, startWith } from 'rxjs';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';

interface ReportOption {
  label: string;
  value: string;
  description: string;
}
interface DetailedReportsOptions {
  label: string;
  value: string;
  description: string;
}
interface DimensionalWeightAdjustmentReports {
  label: string;
  value: string;
  description: string;
}
interface SummaryReports {
  label: string;
  value: string;
  description: string;
}
@Component({
  selector: 'app-fedex-detail-reports',
  templateUrl: './detail-reports.component.html',
  styleUrls: ['./detail-reports.component.scss'],
  standalone: false
})
export class FedexDetailReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('allSelectedValueFedEx') private allSelectedValueFedEx!: MatOption;
  @ViewChild('accNoSelFedEx') private accNoSelFedEx!: MatSelect;

  favoriteSeason = '';
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];
  accountNumbers: string[] = [
    '007FR4',
    '1011X4',
    '3929X4',
    '50790W',
    '617E40',
    'A42R09',
    'HF0944',
    'V90V07',
    'W0446Y',
    'W6887X'
  ];

  //variable declaration
  clientType = signal<any>('');
  selectedAccounts: string[] = [];
  randomNumber!: number;
  currentDate!: Date;
  themeoption: any;
  loginId: any;
  tempfromDate: any;
  temptoDate: any;
  toDate: any;
  fromDate: any;
  userProfifleData: any;
  userProfifle: any;
  clientID: any;
  clientName: any;
  dataasof: any;
  dataasoffFormat: any;
  clientProfileList: any;
  selectedclientProfile: any;
  reportDescriptionResultAC: any[] = [];
  itemsAC: any[] = [];
  tempMasterAC: any[] = [];
  uniqueReportTypesArray: any[] = [];
  sortDir = 1;
  chunks: any[] = [];
  FilterReports: any;
  auditcustomerstatus: any;
  crmAccountnumber: any;
  List_chargedescription: any;
  accountAC: any;
  Default = 'ALL';
  defaultArr = ["ALL"];
  accountNickNameFlag: boolean = false;
  dataasofVisible = false;
  goopDataasofVisible = false;
  executiveManagementFlag: boolean = false;
  selectYear: any[] = [];
  PdfVisible: boolean = true;
  isExcelVisible: boolean = true;
  strippedDataVisible: boolean = false;
  fullInvoiceDataVisible: boolean = false;
  totalItems: any;
  selectedReport: string = '';
  ChargedescVisible: boolean = false;
  openModalConfig: any;
  panelClass: any;
  mailFromYear: any;
  mailToYear: any;
  t004_genralparameterobj: any;
  List_FullinvoicesummaryAcc: any;
  List_FullinvoicedetailAcc: any;
  List_StrippedDataAcc: any;
  List_FullinvoicesummaryTot: any;
  List_Fullinvoicesummary: any
  filteredprimaryAccountNumber: any;
  accountACFedex: any = [];
  fedexauditcustomerstatus: any;
  adminAccess: any;
  loginCustomerType: any;
  dateType = false;
  weekly_monthlyFlag = false;
  isTrendReportChecked: boolean = false;

  // Annual Report Section Variables
  annualReportVisible: boolean = true;
  checkboxesDataList: any[] = [];
  Annual_weekly_monthlyFlag: boolean = false;
  Annual_weekly_monthly_consFlag: boolean = false;
  Annual_weekly_monthly_accFlag: boolean = false;
  checkedIDs: any[] = [];



  //form group
  fedexFormGroup!: FormGroup;
  reportsFormGroup!: FormGroup;


  constructor(private loaderService: LoaderService, private cookiesService: CookiesService, private httpClientService: HttpClientService, public datePipe: DatePipe,
    private commonService: CommonService, public dialog: MatDialog,
    private httpfedexService: HttpfedexService, private cd: ChangeDetectorRef) {

    this.fedexFormGroup = new FormGroup({
      clientname: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      accNumber: new FormControl(''),
      accNo: new FormControl('ALL'),
      reportName: new FormControl(''),
      reportType: new FormControl(''),
      Weekly_Monthly: new FormControl('Monthly'),
      Weekly_Monthly_Cons: new FormControl('Monthly'),
      Weekly_Monthly_Acc: new FormControl('Monthly'),
      dateType: new FormControl('InvoiceDate'),
      status: new FormControl(''),
      modulename: new FormControl(''),
      loginId: new FormControl(''),
      chargeType: new FormControl(''),
      chargeDesc: new FormControl(''),
      chargeGroup: new FormControl(''),
      checkCrossYear: new FormControl(null),
      reportFormat: new FormControl('Excel'),
      createdDate: new FormControl(''),
      requesteddttm: new FormControl(''),
      t002ClientProfileobj: new FormGroup({
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
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      }),
      executiveReportType: new FormControl('Yearly'),
      accountNickNameFlag: new FormControl(false),
      displayYear: new FormControl(new Date().getFullYear())
    });

    this.reportsFormGroup = new FormGroup({
      reportLogId: new FormControl(''),
      t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
      t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
    });

    this.cookiesService.carrierType.subscribe((clienttype: string) => {
      console.log('clienttype', clienttype);
      this.clientType.set(clienttype);
    });

  }

  async ngOnInit() {
    this.openLoading();
    this.initialDefault();
    var startdate = new Date();
    let getdate = this.datePipe.transform(startdate, 'yyyy,M,d');
    var dt = new Date(getdate || '');
    var diff = dt.getDate() - dt.getDay() + (dt.getDay() === 0 ? -6 : 1);
    var startdateofweekTemp = new Date(dt.setDate(diff));
    dt = new Date(getdate || '');
    var lastday = dt.getDate() - (dt.getDay() - 1) + 6;
    var EnddateofweekTemp = new Date(dt.setDate(lastday));
    const tempmonthStartDay = new Date(Number(startdateofweekTemp));
    tempmonthStartDay.setDate(startdateofweekTemp.getDate() - 14);
    const tempmonthEndDay = new Date(Number(EnddateofweekTemp));
    tempmonthEndDay.setDate(EnddateofweekTemp.getDate() - 15);

    this.tempfromDate = tempmonthStartDay;
    this.temptoDate = tempmonthEndDay;
    //trackingDate
    this.toDate = this.datePipe.transform(tempmonthEndDay, "yyyy-MM-dd");
    this.fromDate = this.datePipe.transform(tempmonthStartDay, "yyyy-MM-dd");

    this.fedexFormGroup.patchValue({
      dateRange: {
        "start": new Date(this.fromDate), "end": new Date(this.toDate)
      }
    });

    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }

    this.fedexFormGroup.get('fromDate')?.setValue(this.fromDate);
    this.fedexFormGroup.get('toDate')?.setValue(this.toDate);

    await this.getUserFedex(true);
    await this.refreshFedex(true);
    await this.collectionFedex(true);

    this.filteredprimaryAccountNumber = this.fedexFormGroup.get("accNumber")?.valueChanges.pipe(startWith(''),
      map(primaryaccount => primaryaccount != '' ? this._filterprimaryAccountNumber(primaryaccount) : this.accountACFedex.slice())
    );
  }


  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  async initialDefault() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => { return res; });
    this.loginId = await (this.cookiesService.getCookie('loginId').then((res: any) => { return res; }));
    if (this.loginId == '' || this.loginId == undefined || this.loginId == null || this.loginId.length == 0) {
      this.loginId = '123';
    }
  }

  _filterprimaryAccountNumber(value: string): any[] {

    if (typeof value !== 'string')
      return [];
    return this.accountACFedex.filter((primaryaccount: any) => primaryaccount.primaryAccountNumber.toLowerCase().includes(value.toLowerCase()));
  }

  async getUserFedex(isInitial = false): Promise<void> {
    try {
      if (!isInitial) this.openLoading();
      await this.commonService.getUserprofileData().then(
        (result: any) => {
          this.userProfifleData = result;
          this.userProfifle = this.userProfifleData[0];
          this.clientProfileList = result;
          this.clientID = this.userProfifle.clientId;
          var strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
          var strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
          var strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);
          var dataasof = this.datePipe.transform(this.userProfifle.fileEndDate1, "MM/dd/yyyy");
          this.dataasof = strMonthEnd + "/" + strDateEnd + "/" + strYearEnd;
          let formatdate = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");
          if (formatdate) {
            this.dataasoffFormat = new Date(formatdate);
          } else {
            this.dataasoffFormat = new Date();
          }

          this.clientName = this.userProfifle.clientName;
          this.fedexauditcustomerstatus = this.userProfifle.auditcustomerstatus;
          const toDate = new Date(this.dataasoffFormat);
          this.fedexFormGroup.get('toDate')?.setValue(toDate);
          const fromDate = new Date(toDate);
          fromDate.setDate(toDate.getDate() - 6);
          this.fedexFormGroup.get('fromDate')?.setValue(fromDate);
          if (!isInitial) this.closeLoading();
        }, (error: any) => {
          this.closeLoading();
        });
    } catch (error) {
      this.closeLoading();
      console.error(error);
      this.closeLoading();
      this.openModal('Please Select Customer');
    }
  }

  async refreshFedex(isInitial = false): Promise<void> {
    if (!isInitial) this.openLoading();
    this.selectedclientProfile = this.userProfifle;
    var ClientNametWithSplChar = this.clientName;
    var clientName = this.clientName;
    var imagepath = "";
    imagepath = "assets/Ljm_image/" + clientName + ".jpg";
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
    await this.fetchaccountDetailsFedex(this.fedexFormGroup.value, isInitial);
  }

  async loadcrm_accountNumber(selectedclientProfile: any): Promise<void> {
    const t001LogincustObj = { upsClientId: this.clientID };

    this.httpClientService.findClientLoginCredential(t001LogincustObj).subscribe({
      next: (result) => this.fetchclientLoginCredentialResult(result),
      error: (err) => { this.closeLoading(); console.error(err); }
    });
  }

  fetchclientLoginCredentialResult(result: any[]): void {
    const t001selectedClientList = result ?? [];
    let selectedclientLoginCredential: any = {};

    if (t001selectedClientList.length > 0) {
      selectedclientLoginCredential = t001selectedClientList[0];
      this.crmAccountnumber = selectedclientLoginCredential.crmAccountNumber ?? "-";
    } else {
      this.crmAccountnumber = "-";
    }
  }

  module1_initializeHandler(event: any): void {
    this.selectedclientProfile; // still referenced, though unused here

    if (!this.List_chargedescription || this.List_chargedescription.length === 0) {
      const fetchCharge_list = {};

      this.httpClientService.fetchCharge_list(fetchCharge_list).subscribe({
        next: (result: any[]) => {
          this.List_chargedescription = result;
          this.cd.detectChanges();
        },
        error: (err: any) => { this.closeLoading(); console.error(err); }
      });
    }
  }

  //Account number display
  fetchaccountDetailsFedex(t002AccSrchObj: any, isInitial = false): void {
    this.httpfedexService.fetchaccountDetails(t002AccSrchObj).subscribe({
      next: (result: any[]) => {
        this.accountACFedex = result;

        this.accountACFedex.forEach((item: any, index: number) => {
          if (!item.nickName) {
            this.accountACFedex[index].nickName = item.primaryAccountNumber;
          } else {
            this.accountACFedex[index].nickName =
              item.primaryAccountNumber + " - <span>" + item.nickName + "</span>";
          }
        });
        if (!isInitial) this.closeLoading();
        this.cd.detectChanges();
      },
      error: (err: any) => { this.closeLoading(); console.error(err) }
    });
  }


  collectionFedex(isInitial = false): void {
    if (!isInitial) this.openLoading();
    var t001ClientObj = {};
    this.httpfedexService.fetchReportDescription(t001ClientObj).subscribe({
      next: (result: any) => {
        this.ReportDescriptionResultFedex(result);
      }, error: (error: any) => {
        console.error(error);
        this.closeLoading();
      },
    });
  }

  ReportDescriptionResultFedex(result: any) {
    this.itemsAC = [];
    this.tempMasterAC = [];
    this.reportDescriptionResultAC = result;
    // this.sortArr('reportName');

    var index4 = this.reportDescriptionResultAC.findIndex(x => x.reportName === "Tracked Shipment Report");
    if (this.fedexauditcustomerstatus == "Y") {
    }
    else {
      this.reportDescriptionResultAC.splice(index4, 1);
    }

    var index3;
    if (this.adminAccess == "") {
      index3 = this.reportDescriptionResultAC.findIndex(x => x.reportName === "Box Summary Report");
      this.reportDescriptionResultAC.splice(index3, 1);
    }
    if (this.clientID != 1300242) {
      index3 = this.reportDescriptionResultAC.findIndex(x => x.reportName === "Shipment Detail Report");
      this.reportDescriptionResultAC.splice(index3, 1);
    }
    if (this.clientID != 1300182 || this.adminAccess == "") {
      index3 = this.reportDescriptionResultAC.findIndex(x => x.reportName === "Charge Description Contract Review Report");
      this.reportDescriptionResultAC.splice(index3, 1);
    }
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess == "" || this.loginCustomerType == "LJM_User" || this.loginCustomerType == "N") {
      index3 = this.reportDescriptionResultAC.findIndex(x => x.reportName === "Trend Report");
      this.reportDescriptionResultAC.splice(index3, 1);
    }
    if (this.adminAccess == "" || this.loginCustomerType == "LJM_User" || this.loginCustomerType == "N") {
      index3 = this.reportDescriptionResultAC.findIndex(x => x.reportName === "Annual Report");
      this.reportDescriptionResultAC.splice(index3, 1);
    }

    this.itemsAC = this.reportDescriptionResultAC;
    this.tempMasterAC = this.reportDescriptionResultAC;

    // Extract unique reportType values
    this.uniqueReportTypesArray = [...new Set(this.reportDescriptionResultAC.map(report => report.reportType))]
      .sort((a, b) => (a as string).localeCompare(b as string));
    this.getChuncksReportArray();
    this.cd.detectChanges();
  }


  sortArr(colName: any) {
    this.reportDescriptionResultAC.sort((a: any, b: any) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  async getChuncksReportArray() {
    this.chunks = [];
    const tempChunks: any[] = [];

    // Construct chunks for each report type
    for (const reportType of this.uniqueReportTypesArray) {
      const reports = this.getReportsByReportType(reportType);
      if (reports && reports.length > 0) {
        tempChunks.push(this.chunkReports(reports, 3));
      }
    }

    this.chunks = tempChunks;
    this.cd.detectChanges();

    // Use a small timeout to ensure the browser has finished rendering the 
    // large radio button list before we hide the loading indicator.
    // This serves as the single "close" point for the initial load too.
    setTimeout(() => {
      this.closeLoading();
      this.cd.detectChanges();
    }, 600);
  }

  chunkReports(reports: any[], columns: number): any[][] {
    const chunkSize = Math.ceil(reports.length / columns);
    return Array.from({ length: columns }, (_, index) =>
      reports.slice(index * chunkSize, (index + 1) * chunkSize)
    );
  }

  // Create a function to filter reports based on reportType
  getReportsByReportType(reportType: string): any[] {
    return this.itemsAC.filter((report: any) => report.reportType === reportType);
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  //UI - logic

  FilterReports_changeHandlerFedex(event: any): void {
    if (this.FilterReports != null && this.FilterReports.length != 0) {
      var filterAC: any = [];
      for (var loop = 0; loop < this.tempMasterAC.length; loop++) {
        var detailrptObj = this.tempMasterAC[loop];
        if (detailrptObj.reportName != null) {
          if ((detailrptObj.reportName.toUpperCase())
            .indexOf(this.FilterReports.toUpperCase()) >= 0) {
            filterAC.push(detailrptObj);
          }
        }
      }
      this.itemsAC = filterAC;
    }
    else {
      this.itemsAC = this.tempMasterAC;
    }

    this.openLoading(); // Open loader specifically for filtering
    this.getChuncksReportArray();
  }

  toggleAllSelectionFedEx() {
    if (this.allSelectedValueFedEx.selected) {
      this.accNoSelFedEx.options.forEach((item: MatOption) => { item.deselect() });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.fedexFormGroup.get('accNumber')?.setValue(setAllvalue);
    }
  }

  toggleSelectionFedEx() {
    var accvalue = this.fedexFormGroup.get('accNumber')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValueFedEx.deselect();
    }
  }

  openReportSchedulerScreen() {
    this.totalItems = this.tempMasterAC;

    const dialogConfig = this.dialog.open(SchedularPopup, {
      width: '95%',
      height: '85%',
      // panelClass: this.panelClass,
      data: {
        pageValue: this.totalItems,
        t001ClientProfile: this.userProfifle,
        // panelClass: this.panelClass,
        clienttype: this.clientType(),
        accountNumber: this.accountAC
      }

    });

  }

  async reportLog_clickHandlerFedex() {
    let userprofile: any = {};
    userprofile['t002ClientProfileobj'] = await this.fedexFormGroup.get('t002ClientProfileobj')?.value;

    if (this.adminAccess == "" || this.loginCustomerType == "LJM_User" || this.loginCustomerType == "N") {
      userprofile['reportType'] = "User";
    } else {
      userprofile['reportType'] = "Admin";
    }
    await this.httpfedexService.fetchReportData(userprofile).subscribe({
      next: (result: any[]) => {
        var reportDetails = result;
        const dialogRef = this.dialog.open(FedexReportLogComponent, {
          width: '95%',
          panelClass: this.panelClass,
          backdropClass: 'background_cls',
          data: { clientName: this.clientName, userprofile: userprofile, reportDetails: reportDetails }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }, error: (error: any) => {
        console.log(error);
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

  radiobtn_clickHandlerFedex(value: string, reportName: string, event: Event): void {
    this.selectedReport = value;

    if (this.selectedReport == 'ACCOUNT_SUMMARY' || this.selectedReport == 'BOX_SIZE_COUNT_REPORT' || this.selectedReport == 'WEIGHT_DIFFERENCE_LISTING'
      || this.selectedReport == 'ANNUAL_REPORT') {
      this.PdfVisible = true;
    } else {
      this.PdfVisible = false;
      this.fedexFormGroup.get('reportFormat')?.setValue('Excel');
    }
    if (this.selectedReport == 'ACCESSORIAL_REPORT_DETAIL') {
      this.strippedDataVisible = true;
    } else {
      this.strippedDataVisible = false;
      this.fedexFormGroup.get('reportFormat')?.setValue('Excel');
    }
    if (value == 'TREND_REPORT') {
      this.fedexFormGroup.get('reportType')?.setValue("Trend Weekly Report");
      this.weekly_monthlyFlag = true;
    } else { this.weekly_monthlyFlag = false; }

    if (value == 'ANNUAL_REPORT') {
      this.annualReportVisible = true;
      this.checkedIDs = [];
      this.checkboxesDataList.forEach((value, index) => {
        this.checkedIDs.push({ id: value.id, label: value.label, isChecked: value.isChecked });
      });
      this.checkboxesDataList = this.checkedIDs;
      if (this.checkboxesDataList[5].isChecked == true) {
        this.fedexFormGroup.get('Weekly_Monthly')?.setValue("Monthly");
        this.Annual_weekly_monthlyFlag = true;
      } else {
        this.Annual_weekly_monthlyFlag = false;
      }
      if (this.checkboxesDataList[6].isChecked == true) {
        this.fedexFormGroup.get('Weekly_Monthly_Cons')?.setValue("Monthly");
        this.Annual_weekly_monthly_consFlag = true;
      } else {
        this.Annual_weekly_monthly_consFlag = false;
      }
      if (this.checkboxesDataList[7].isChecked == true) {
        this.fedexFormGroup.get('Weekly_Monthly_Acc')?.setValue("Monthly");
        this.Annual_weekly_monthly_accFlag = true;
      } else {
        this.Annual_weekly_monthly_accFlag = false;
      }
    } else {
      this.annualReportVisible = false;
    }
    if (this.selectedReport == 'Tracked_Shipment_Report') {

      var dataasof = this.datePipe.transform(this.userProfifle.dateasof, "MM/dd/yyyy");
      this.dataasof = dataasof;
      const formattedDate = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");

      if (formattedDate) {
        this.dataasoffFormat = new Date(formattedDate);
      }
      this.PdfVisible = false;
      this.dataasofVisible = true;
      this.goopDataasofVisible = false;
    }
    else {
      var strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
      var strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
      var strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);
      var dataasof = this.datePipe.transform(this.userProfifle.fileEndDate1, "MM/dd/yyyy");
      this.dataasof = strMonthEnd + "/" + strDateEnd + "/" + strYearEnd;
      const formattedDate = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");
      if (formattedDate) {
        this.dataasoffFormat = new Date(formattedDate);
      }
      this.dataasofVisible = false;
      this.goopDataasofVisible = false;
    }

    if (this.selectedReport == 'Executive_Management_Report' || this.selectedReport == 'Carrier_Trends_Insights') {
      this.executiveManagementFlag = true;
    } else {
      this.executiveManagementFlag = false;
      this.fedexFormGroup.get('reportFormat')?.setValue('Excel');
    }
    if (this.selectedReport == "AVERAGE_DISCOUNT_REPORT_DETAIL" || this.selectedReport == "ACCOUNT_CHARGE_DESCRIPTION_STANDARD_DETAIL" ||
      this.selectedReport == "RAW_DATA_REPORT_ADJUSTED" || this.selectedReport == "ZONE_DISTRIBUTION_REPORT_DETAIL") {
      this.dateType = true;
    }
    else {
      this.dateType = false;
    }

    this.fedexFormGroup.get('reportName')?.setValue(this.selectedReport);
    if (value == 'TREND_REPORT') {
    } else {
      this.fedexFormGroup.get('reportType')?.setValue(reportName);
    }
    if (this.selectedReport == 'ACCOUNT_INVOICE_SUMMARY_DETAIL' || this.selectedReport == 'RAW_DATA_REPORT_ADJUSTED' || this.selectedReport == 'ACCOUNT_SUMMARY') {
      this.accountNickNameFlag = true;
    } else {
      this.accountNickNameFlag = false;
    }
  }

  async btn_runreport_clickHandlerFedex(): Promise<void> {
    var dateVal = this.fedexFormGroup.get('dateRange')?.value;
    var dateFr = this.fedexFormGroup.get('fromDate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.fedexFormGroup.get('toDate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");

    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");

    this.mailFromYear = dateFromYear;
    this.mailToYear = dateToYear;


    var fromDate = dateFrom;
    var toDate = dateTo;
    var reportsselectedValue = this.fedexFormGroup.get('reportName')?.value;
    var pdf_btnselected = this.fedexFormGroup.get('reportFormat')?.value;
    var fromyear = this.datePipe.transform(fromDate, "yyyy");
    var toyear = this.datePipe.transform(toDate, "yyyy");
    var accNoFedexArr = this.fedexFormGroup.get('accNumber')?.value;
    var containsAll_FedEx = accNoFedexArr[0].includes('ALL');
    if (accNoFedexArr == "ALL" || accNoFedexArr == '' || accNoFedexArr == null || containsAll_FedEx == true) {
      this.fedexFormGroup.get('accNo')?.setValue("");
    }
    else {
      var accNumber = accNoFedexArr.join('@');
      this.fedexFormGroup.get('accNo')?.setValue(accNumber);
    }


    if (fromDate == "" || toDate == "" || fromDate == null || toDate == null) {
      this.openModal("Please Select Date Range");
      return;
    }
    if (new Date(dateFr) > new Date(dateT)) {
      this.openModal("Please Select Valid Date Range");
      return;
    }



    if (reportsselectedValue == "ANNUAL_REPORT") {
      var ExecutiveSummary = this.checkboxesDataList[0].isChecked;
      var GroundServices = this.checkboxesDataList[1].isChecked;
      var NonFuelAccFees = this.checkboxesDataList[2].isChecked;
      var CarrierSummaryZone = this.checkboxesDataList[3].isChecked;
      var ContractExpedited = this.checkboxesDataList[4].isChecked;
      var TrendsByService = this.checkboxesDataList[5].isChecked;
      var TrendsConsolidated = this.checkboxesDataList[6].isChecked;
      var TrendsAccessorial = this.checkboxesDataList[7].isChecked;
      if (ExecutiveSummary == false && ContractExpedited == false && NonFuelAccFees == false && GroundServices == false && TrendsByService == false && TrendsConsolidated == false && CarrierSummaryZone == false && TrendsAccessorial == false) {
        this.openModal("Please select any one of the annual report");
        return;
      }
    }

    if (reportsselectedValue != null && reportsselectedValue != undefined && reportsselectedValue != "") {
      if (pdf_btnselected == "" || pdf_btnselected == null || pdf_btnselected == undefined) {
        this.openModal("Please select PDF or EXCEL!.....");
        return;
      }
      else {
        this.runreport_click_handlerFedex(null);
      }
    }
    else {
      this.openModal("Please select any one of the Reports");
    }
  }


  runreport_click_handlerFedex(event: any) {
    var reportsselectedValue = this.fedexFormGroup.get('reportName')?.value;
    var pdf_btnselected = this.fedexFormGroup.get('reportFormat')?.value;
    var fromDate = this.fedexFormGroup.get('fromDate')?.value;
    var toDate = this.fedexFormGroup.get('toDate')?.value;

    var accNoFedexArr = this.fedexFormGroup.get('accNumber')?.value;
    var containsAll_FedEx = accNoFedexArr[0].includes('ALL');
    if (accNoFedexArr == "ALL" || accNoFedexArr == '' || accNoFedexArr == null || containsAll_FedEx == true) {
      this.fedexFormGroup.get('accNo')?.setValue("");
    }
    else {
      var accNumber = accNoFedexArr.join('@');
      this.fedexFormGroup.get('accNo')?.setValue(accNumber);
    }

    var dateFrom = this.datePipe.transform(fromDate, "yyyy-MM-dd");

    var dateTo = this.datePipe.transform(toDate, "yyyy-MM-dd");
    this.fedexFormGroup.get('fromDate')?.setValue(dateFrom);
    this.fedexFormGroup.get('toDate')?.setValue(dateTo);

    if (reportsselectedValue == "ANNUAL_REPORT") {
      this.fedexFormGroup.get('reportType')?.setValue("Annual Report");
      var annualWeekly_MonthlyReport = this.fedexFormGroup.get('Weekly_Monthly')?.value;
      var annualWeekly_Monthly_ConsReport = this.fedexFormGroup.get('Weekly_Monthly_Cons')?.value;
      var annualWeekly_Monthly_AccReport = this.fedexFormGroup.get('Weekly_Monthly_Acc')?.value;
      var ExecutiveSummary = this.checkboxesDataList[0].isChecked;
      var GroundServices = this.checkboxesDataList[1].isChecked;
      var NonFuelAccFees = this.checkboxesDataList[2].isChecked;
      var CarrierSummaryZone = this.checkboxesDataList[3].isChecked;
      var ContractExpedited = this.checkboxesDataList[4].isChecked;
      var TrendsByService = this.checkboxesDataList[5].isChecked;
      var TrendsConsolidated = this.checkboxesDataList[6].isChecked;
      var TrendsAccessorial = this.checkboxesDataList[7].isChecked;

      var reportFlag: any = "1*1*1*1*1*1*1*1*1*1*1";
      let ExecutiveSummaryFlag = "1";
      let GroundServicesFlag = "1";
      let NonFuelAccFeesFlag = "1";
      let CarrierSummaryZoneFlag = "1";
      let ContractExpeditedFlag = "1";
      var TrendsByServiceMonthlyFlag = "1";
      var TrendsByServiceWeeklyFlag = "1";
      var TrendsConsolidatedMonthlyFlag = "1";
      var TrendsConsolidatedWeeklyFlag = "1";
      var TrendsAccessorialMonthlyFlag = "1";
      var TrendsAccessorialWeeklyFlag = "1";

      if (ExecutiveSummary == true) {
        ExecutiveSummaryFlag = "1";
      }
      else {
        ExecutiveSummaryFlag = "0";
      }
      if (GroundServices == true) {
        GroundServicesFlag = "1";
      }
      else {
        GroundServicesFlag = "0";
      }
      if (NonFuelAccFees == true) {
        NonFuelAccFeesFlag = "1";
      }
      else {
        NonFuelAccFeesFlag = "0";
      }
      if (CarrierSummaryZone == true) {
        CarrierSummaryZoneFlag = "1";
      }
      else {
        CarrierSummaryZoneFlag = "0";
      }
      if (ContractExpedited == true) {
        ContractExpeditedFlag = "1";
      }
      else {
        ContractExpeditedFlag = "0";
      }
      if (TrendsByService == true) {
        if (annualWeekly_MonthlyReport == "Monthly") {
          TrendsByServiceMonthlyFlag = "1";
        }
        else {
          TrendsByServiceMonthlyFlag = "0";
        }
        if (annualWeekly_MonthlyReport == "Weekly") {
          TrendsByServiceWeeklyFlag = "1";
        }
        else {
          TrendsByServiceWeeklyFlag = "0";
        }
      }
      else {
        TrendsByServiceMonthlyFlag = "0";
        TrendsByServiceWeeklyFlag = "0";
      }
      if (TrendsConsolidated == true) {
        if (annualWeekly_Monthly_ConsReport == "Monthly") {
          TrendsConsolidatedMonthlyFlag = "1";
        }
        else {
          TrendsConsolidatedMonthlyFlag = "0";
        }
        if (annualWeekly_Monthly_ConsReport == "Weekly") {
          TrendsConsolidatedWeeklyFlag = "1";
        }
        else {
          TrendsConsolidatedWeeklyFlag = "0";
        }
      }
      else {
        TrendsConsolidatedMonthlyFlag = "0";
        TrendsConsolidatedWeeklyFlag = "0";
      }
      if (TrendsAccessorial == true) {
        if (annualWeekly_Monthly_AccReport == "Monthly") {
          TrendsAccessorialMonthlyFlag = "1";
        }
        else {
          TrendsAccessorialMonthlyFlag = "0";
        }
        if (annualWeekly_Monthly_AccReport == "Weekly") {
          TrendsAccessorialWeeklyFlag = "1";
        }
        else {
          TrendsAccessorialWeeklyFlag = "0";
        }
      }
      else {
        TrendsAccessorialMonthlyFlag = "0";
        TrendsAccessorialWeeklyFlag = "0";
      }

      reportFlag = ExecutiveSummaryFlag + "*" + GroundServicesFlag + "*" + NonFuelAccFeesFlag + "*" + CarrierSummaryZoneFlag + "*" + ContractExpeditedFlag + "*" + TrendsByServiceMonthlyFlag + "*" + TrendsByServiceWeeklyFlag + "*" + TrendsConsolidatedMonthlyFlag + "*" + TrendsConsolidatedWeeklyFlag + "*" + TrendsAccessorialMonthlyFlag + "*" + TrendsAccessorialWeeklyFlag;

    }

    if (reportsselectedValue == "ACCESSORIAL_REPORT_DETAIL" && pdf_btnselected == "Stripped Data") {
      this.fedexFormGroup.get('reportType')?.setValue("Accessorial Detail Stripped Report");
      reportsselectedValue = "ACCESSORIAL_REPORT_STRIPPED_DETAIL";
    }
    if (reportsselectedValue == "ACCESSORIAL_REPORT_DETAIL" && pdf_btnselected == "Excel") {
      //FD03-E           
      this.fedexFormGroup.get('reportType')?.setValue("Accessorial Detail Report");
    }

    if (reportsselectedValue == "CHARGE_DESCRIPTION_CONTRACT_REVIEW_REPORT") {
      this.fedexFormGroup.get('reportType')?.setValue("Charge Description Contract Review Report");
    }
    if (reportsselectedValue == "RAW_DATA_REPORT_ADJUSTED_TEST") {
      this.fedexFormGroup.get('reportType')?.setValue("Invoice Data Adjusted test Report");
    }

    if (reportsselectedValue == "Executive_Management_Report" || reportsselectedValue == 'Carrier_Trends_Insights') {
      this.fedexFormGroup.get('reportType')?.setValue("Carrier Trends Insights");
      var displayYear = this.fedexFormGroup.get('displayYear')?.value;
      var from_Date: any = displayYear + "-01" + "-01";
      var to_Date: any = displayYear + "-12" + "-31";
      this.fedexFormGroup.get('fromDate')?.setValue(this.datePipe.transform(from_Date, "yyyy-MM-dd"));
      this.fedexFormGroup.get('toDate')?.setValue(this.datePipe.transform(to_Date, "yyyy-MM-dd"));
    }
    if (this.fedexFormGroup.get('reportType')?.value == "Trend Weekly Report") {
      this.fedexFormGroup.get('reportName')?.setValue("TREND_WEEKLY_REPORT");
      reportsselectedValue = this.fedexFormGroup.get('reportName')?.value;
    }
    else if (this.fedexFormGroup.get('reportType')?.value == "Trend Monthly Report") {
      this.fedexFormGroup.get('reportName')?.setValue("TREND_MONTHLY_REPORT");
      reportsselectedValue = this.fedexFormGroup.get('reportName')?.value;
    }
    if (reportsselectedValue == 'TREND_MONTHLY_REPORT' || reportsselectedValue == 'TREND_WEEKLY_REPORT'
      || reportsselectedValue == 'TREND_REPORT') {
      this.isTrendReportChecked = true;
    } else {
      this.isTrendReportChecked = false;
    }
    this.fedexFormGroup.get('status')?.setValue("IN QUEUE")

    if (this.mailFromYear != this.mailToYear && (reportsselectedValue == "ACCESSORIAL_REPORT_DETAIL" || reportsselectedValue == "ACCESSORIAL_REPORT_STRIPPED_DETAIL" || reportsselectedValue == "RESIDENTIAL_CHARGE_REPORT" || reportsselectedValue == "RAW_DATA_REPORT_DETAIL"
      || reportsselectedValue == "RAW_DATA_REPORT_ADJUSTED" || reportsselectedValue == "MULTIPLE_PACKAGE_REPORT" || reportsselectedValue == "RETURN_SHIPMENT_REPORT" || reportsselectedValue == "THIRD_PARTY_REPORT")) {
      this.fedexFormGroup.get('status')?.setValue("PENDING");
      this.fedexFormGroup.get('checkCrossYear')?.setValue("CROSSYEARRUN");
    }

    this.fedexFormGroup.get('modulename')?.setValue("Detail_Report");
    this.fedexFormGroup.get('loginId')?.setValue(this.loginId);
    if (accNumber == null || accNumber == "ALL") {

      this.fedexFormGroup.get('accNo')?.setValue("");
    }
    var currentDate = new Date();

    this.fedexFormGroup.patchValue({
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

    this.fedexFormGroup.get('createdDate')?.setValue(currentDate);
    this.fedexFormGroup.get('requesteddttm')?.setValue(currentDate);
    this.fedexFormGroup.get('reportName')?.setValue(reportsselectedValue);

    this.fedexFormGroup.get('chargeType')?.setValue("");
    if (reportsselectedValue == "ANNUAL_REPORT") {
      this.fedexFormGroup.get('chargeType')?.setValue(reportFlag);
    }
    if (reportsselectedValue == "Executive_Management_Report" || reportsselectedValue == 'Carrier_Trends_Insights') {
      var executiveReportType = this.fedexFormGroup.get('executiveReportType')?.value;
      this.fedexFormGroup.get('chargeType')?.setValue(executiveReportType);
    }
    this.fedexFormGroup.get('chargeDesc')?.setValue("");
    this.fedexFormGroup.get('chargeGroup')?.setValue("");
    if (reportsselectedValue == "AVERAGE_DISCOUNT_REPORT_DETAIL" || reportsselectedValue == "ACCOUNT_CHARGE_DESCRIPTION_STANDARD_DETAIL" ||
      reportsselectedValue == "RAW_DATA_REPORT_ADJUSTED" || reportsselectedValue == "ZONE_DISTRIBUTION_REPORT_DETAIL") {
      if (this.fedexFormGroup.get('dateType')?.value == "InvoiceDate") {
        this.fedexFormGroup.get('chargeGroup')?.setValue("InvoiceDate");
      } else {
        this.fedexFormGroup.get('chargeGroup')?.setValue("TransactionDate");
      }
    }
    var accNoFedexArr = this.fedexFormGroup.get('accNumber')?.value;
    var containsAll_FedEx = accNoFedexArr[0].includes('ALL');
    if (accNoFedexArr == "ALL" || accNoFedexArr == '' || accNoFedexArr == null || containsAll_FedEx == true) {
      this.fedexFormGroup.get('accNo')?.setValue("");
    }
    else {
      var accNumber = accNoFedexArr.join('@');
      this.fedexFormGroup.get('accNo')?.setValue(accNumber);
    }

    this.httpfedexService.runReport(this.fedexFormGroup.value).subscribe({
      next: (result: any) => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error: (error: any) => {
        console.log(error)
      }
    });
    this.fedexFormGroup.get('fromDate')?.setValue(new Date(fromDate));
    this.fedexFormGroup.get('toDate')?.setValue(new Date(toDate));
    if (reportsselectedValue == 'TREND_MONTHLY_REPORT' || reportsselectedValue == 'TREND_WEEKLY_REPORT' || reportsselectedValue == 'TREND_REPORT') {
      this.fedexFormGroup.get('reportType')?.setValue("Trend Report");
    }
    this.fedexFormGroup.get('chargeGroup')?.setValue("");
  }

  saveOrUpdateReportLogResultFedex(result: any) {
    var t007_reportlogobjResult = result;
    if (this.mailFromYear != this.mailToYear && (t007_reportlogobjResult.reportName == "ACCESSORIAL_REPORT_DETAIL" || t007_reportlogobjResult.reportName == "ACCESSORIAL_REPORT_STRIPPED_DETAIL" || t007_reportlogobjResult.reportName == "RESIDENTIAL_CHARGE_REPORT" || t007_reportlogobjResult.reportName == "RAW_DATA_REPORT_DETAIL"
      || t007_reportlogobjResult.reportName == "RAW_DATA_REPORT_ADJUSTED" || t007_reportlogobjResult.reportName == "MULTIPLE_PACKAGE_REPORT" || t007_reportlogobjResult.reportName == "RETURN_SHIPMENT_REPORT" || t007_reportlogobjResult.reportName == "THIRD_PARTY_REPORT")) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.fedexFormGroup.value, "CROSSYEARRUN");
      return;
    }
    if (t007_reportlogobjResult.countInvoiceData > 100000) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.fedexFormGroup.value, "BATCH");
      return;
    }
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);

    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");

  }

  openClientAcNoDetailsPopup(t007_reportlogobjResult: any, detailReportVal: any, DateRangeString: any) {
    const dialogConfig = this.dialog.open(MailPopupComponent, {
      width: '60%',
      height: '480px',
      panelClass: this.panelClass,
      data: {
        t007_reportlogobjResult: t007_reportlogobjResult,
        t007_reportlogobj: detailReportVal,
        DateRangeString: DateRangeString,
        clienttype: this.clientType
      }
    });
  }

  async clearall_clickHandlerFedex() {
    //trackingDate
    await this.fedexFormGroup.get('fromDate')?.setValue(new Date(this.tempfromDate));
    await this.fedexFormGroup.get('toDate')?.setValue(new Date(this.temptoDate));
    this.ChargedescVisible = false;
    this.strippedDataVisible = false;
    this.PdfVisible = false;
    await this.collectionFedex();
    this.FilterReports = '';
    this.fedexFormGroup.get('reportFormat')?.setValue('Excel');
    this.fedexFormGroup.get('reportName')?.setValue('');
    this.weekly_monthlyFlag = false;
    this.Annual_weekly_monthlyFlag = false;
    this.Annual_weekly_monthly_consFlag = false;
    this.Annual_weekly_monthly_accFlag = false;
    this.executiveManagementFlag = false;
    this.fedexFormGroup.get('dateType')?.setValue('InvoiceDate');
  }

  changeSelection(event: any, id: any) {
    this.checkedIDs = [];
    this.checkboxesDataList.forEach((value, index) => {
      if (id == value.id) {
        this.checkedIDs.push({ id: value.id, label: value.label, isChecked: event.target.checked });
      } else {
        this.checkedIDs.push({ id: value.id, label: value.label, isChecked: value.isChecked });
      }
    });
    this.checkboxesDataList = this.checkedIDs;
    if (this.checkboxesDataList[5].isChecked == true) {
      //this.fedexFormGroup.get('Weekly_Monthly').setValue("Monthly");    
      this.Annual_weekly_monthlyFlag = true;
    } else {
      this.Annual_weekly_monthlyFlag = false;
    }
    if (this.checkboxesDataList[6].isChecked == true) {
      //this.fedexFormGroup.get('Weekly_Monthly_Cons').setValue("Monthly");    
      this.Annual_weekly_monthly_consFlag = true;
    } else {
      this.Annual_weekly_monthly_consFlag = false;
    }
    if (this.checkboxesDataList[7].isChecked == true) {
      //this.fedexFormGroup.get('Weekly_Monthly_Acc').setValue("Monthly");    
      this.Annual_weekly_monthly_accFlag = true;
    } else {
      this.Annual_weekly_monthly_accFlag = false;
    }
  }

}
