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
import { UpsReportLogComponent } from './report-log/report-log.component';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MailPopupComponent } from './mail-popup/mail-popup.component';
import { map, startWith } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

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
  selector: 'app-ups-detail-reports',
  templateUrl: './detail-reports.component.html',
  styleUrls: ['./detail-reports.component.scss'],
  standalone: false
})
export class UpsDetailReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('allSelectedValue') private allSelectedValue!: MatOption;
  @ViewChild('accNoSel') private accNoSel!: MatSelect;

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
  filteredAccountNo: any;



  //form group
  detailReportsFormGroup!: FormGroup;
  reportsFormGroup!: FormGroup;

  constructor(private loaderService: LoaderService, private cookiesService: CookiesService,
    private httpClientService: HttpClientService, public datePipe: DatePipe,
    private commonService: CommonService, public dialog: MatDialog,
    private httpUspsService: HttpUSPSService, private cd: ChangeDetectorRef) {

    this.detailReportsFormGroup = new FormGroup({
      year: new FormControl(''),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      }),
      designFileName: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      clientname: new FormControl(''),
      basisValue: new FormControl(''),


      accNo: new FormControl('ALL'),
      chargeDes: new FormControl('Select'),
      checkCrossYear: new FormControl(null),
      clientId: new FormControl(''),
      reportType: new FormControl(''),
      reportName: new FormControl(''),
      status: new FormControl(''),
      moduleName: new FormControl(''),
      accountNumber: new FormControl(''),
      login_id: new FormControl(''),
      crmaccountNumber: new FormControl(''),
      reportFormat: new FormControl('Excel'),
      upsClientId: new FormControl(''),
      adminFlag: new FormControl(''),
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

    this.detailReportsFormGroup.patchValue({
      dateRange: {
        "start": new Date(this.fromDate), "end": new Date(this.toDate)
      }
    });

    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }

    this.detailReportsFormGroup.get('fromDate')?.setValue(this.fromDate);
    this.detailReportsFormGroup.get('toDate')?.setValue(this.toDate);

    await this.getUser(true);
    await this.refresh(true);
    await this.collection(true);

    const accNoControl = this.detailReportsFormGroup.get('accNo');
    if (accNoControl) {
      this.filteredAccountNo = accNoControl.valueChanges.pipe(
        startWith(''),
        map((accountnumber: any) => {
          const searchVal = typeof accountnumber === 'string' ? accountnumber : '';
          return searchVal !== '' ? this._filterAccountNo(searchVal) : (this.accountAC ? this.accountAC.slice() : []);
        })
      );
    }
  }

  _filterAccountNo(value: string): any[] {

    if (typeof value !== 'string')
      return [];
    return this.accountAC.filter((accountnumber: any) => accountnumber.accountNo.toLowerCase().includes(value.toLowerCase()));
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

  async getUser(isInitial = false): Promise<void> {
    try {
      if (!isInitial) this.openLoading();
      await this.commonService.getUserprofileData().then(
        (result: any) => {
          this.userProfifleData = result;
          this.userProfifle = this.userProfifleData[0];
          this.clientProfileList = result;
          this.clientID = this.userProfifle.clientId;
          this.dataasof = this.userProfifle.dataasof;
          let formatdate = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");
          if (formatdate) {
            this.dataasoffFormat = new Date(formatdate);
          } else {
            this.dataasoffFormat = new Date();
          }
          this.clientName = this.userProfifle.clientName;
          this.detailReportsFormGroup.get('upsClientId')?.setValue(this.clientID);
          this.detailReportsFormGroup.get('clientId')?.setValue(this.clientID);
          this.auditcustomerstatus = this.userProfifle.auditcustomerstatus;
          const toDate = new Date(this.dataasoffFormat);
          this.detailReportsFormGroup.get('toDate')?.setValue(toDate);
          const fromDate = new Date(toDate);
          fromDate.setDate(toDate.getDate() - 6);
          this.detailReportsFormGroup.get('fromDate')?.setValue(fromDate);
          if (!isInitial) this.closeLoading();
        }, (error: any) => {
          this.closeLoading();
        });
    } catch (error) {
      this.closeLoading();
      console.error(error);
      this.openModal('Please Select Customer');
    }
  }

  async refresh(isInitial = false): Promise<void> {
    if (!isInitial) this.openLoading();
    this.selectedclientProfile = this.userProfifle;
    await this.loadcrm_accountNumber(this.selectedclientProfile);
    var ClientNametWithSplChar = this.clientName;
    var clientName = this.clientName;
    var imagepath = "";
    imagepath = "assets/Ljm_image/" + clientName + ".jpg";
    await this.module1_initializeHandler(null);
    this.detailReportsFormGroup.patchValue({
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
    await this.fetchaccountDetails(this.detailReportsFormGroup.value, isInitial);
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
  fetchaccountDetails(t002AccSrchObj: any, isInitial = false): void {
    this.httpClientService.fetchaccountDetailsUPS(t002AccSrchObj).subscribe({
      next: (result: any[]) => {
        this.accountAC = result.map((item: any) => {
          const nickName = item.nickName;
          return {
            ...item,
            nickName: !nickName
              ? item.accountNo
              : `${item.accountNo} - <span>${nickName}</span>`
          };
        });
        if (!isInitial) this.closeLoading();
        this.cd.detectChanges();
      },
      error: (err) => { this.closeLoading(); console.error(err) }
    });
  }


  collection(isInitial = false): void {
    if (!isInitial) this.openLoading();
    const reportMenuAccessDetails: any[] = [];
    const t001ClientObjclient = { clientId: this.clientID };
    const t001ClientObj = {}; // declare before use

    this.httpClientService.fetchReportMenuAccessDetails(t001ClientObjclient).subscribe({
      next: (result: any[]) => {
        console.log(result);
        const reportAccessDetails = result;

        this.httpClientService.fetchReportDescription(t001ClientObj).subscribe({
          next: (descResult: any[]) => this.ReportDescriptionResult(descResult, reportAccessDetails),
          error: (err: any) => { this.closeLoading(); console.error(err) }
        });
      },
      error: (err: any) => { this.closeLoading(); console.error(err) }
    });
  }

  ReportDescriptionResult(result: any[], reportMenuAccessDetails: any[]): void {
    // Reset arrays
    this.itemsAC = [];
    this.tempMasterAC = [];

    // Filter out "Invoice Summary by Plan Number"
    this.reportDescriptionResultAC = result.filter(
      (report: any) => report.reportName !== "Invoice Summary by Plan Number"
    );

    this.sortArr("reportName");

    if (reportMenuAccessDetails.length > 0) {
      const reportAccessIdlist = reportMenuAccessDetails[0].reportIds.split(",");
      this.reportDescriptionResultAC = this.reportDescriptionResultAC.filter(
        (report: any) =>
          report.reportType !== "Custom Reports" ||
          reportAccessIdlist.includes(report.reportId.toString())
      );
    } else {
      this.reportDescriptionResultAC = this.reportDescriptionResultAC.filter(
        (report: any) => report.reportType !== "Custom Reports"
      );
    }

    // Assign to items and temp master
    this.itemsAC = this.reportDescriptionResultAC;
    this.tempMasterAC = this.reportDescriptionResultAC;

    // Extract unique reportType values, sorted alphabetically
    this.uniqueReportTypesArray = [...new Set(this.reportDescriptionResultAC.map(report => report.reportType))]
      .sort((a: any, b: any) => (a as string).localeCompare(b as string));

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

  FilterReports_changeHandler(event: any): void {
    if (this.FilterReports && this.FilterReports.length > 0) {
      const filterText = this.FilterReports.toUpperCase();

      this.itemsAC = this.tempMasterAC.filter(
        (detailrptObj: any) =>
          detailrptObj.reportName &&
          detailrptObj.reportName.toUpperCase().includes(filterText)
      );
    } else {
      this.itemsAC = this.tempMasterAC;
    }

    this.openLoading(); // Open loader specifically for filtering
    this.getChuncksReportArray();
  }

  toggleAllSelection() {
    if (this.allSelectedValue.selected) {
      this.accNoSel.options.forEach((item: MatOption) => { item.deselect(); });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.detailReportsFormGroup.get('accNo')?.setValue(setAllvalue);

    }
  }

  toggleSelection() {
    var accvalue = this.detailReportsFormGroup.get('accNo')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValue.deselect();
    }
  }

  openReportSchedulerScreen() {
    this.totalItems = this.tempMasterAC;

    const dialogConfig = this.dialog.open(SchedularPopup, {
      width: '95%', 
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

  async reportLog_clickHandler() {
    let userprofile: any = {};
    userprofile['t001ClientProfile'] = await this.detailReportsFormGroup.get('t001ClientProfile')?.value
    await this.httpClientService.fetchReportLog(userprofile).subscribe({
      next: (result: any[]) => {
        var reportDetails = result;
        const dialogRef = this.dialog.open(UpsReportLogComponent, {
          width: '95%',
          // height: '50%',
          // panelClass: this.panelClass,
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

  radiobtn_clickHandler(value: string, reportName: string, event: Event): void {
    this.selectedReport = value;

    // Charge description visibility
    this.ChargedescVisible =
      this.selectedReport === 'FUEL_SURCHARGE_DETAIL' ||
      this.selectedReport === 'FUEL_SURCHARGE_SUMAMRY';

    // Invoice Data handling
    if (this.selectedReport === 'INVOICE_DATA') {
      this.isExcelVisible = false;
      this.strippedDataVisible = true;
      this.detailReportsFormGroup.get('reportFormat')?.setValue('Stripped Data');
    } else {
      this.isExcelVisible = true;
      this.strippedDataVisible = false;
      this.detailReportsFormGroup.get('reportFormat')?.setValue('Excel');
    }

    // Report type binding
    this.detailReportsFormGroup.get('reportType')?.setValue(this.selectedReport);

    // Date handling based on report type
    if (this.selectedReport === 'Tracked_Shipment_Report') {
      this.dataasof = this.userProfifle.asonDate;
      this.dataasoffFormat = new Date(this.datePipe.transform(this.dataasof, 'MM/dd/yyyy')!);
      this.PdfVisible = false;
      this.dataasofVisible = true;
      this.goopDataasofVisible = false;
    } else if (this.selectedReport === 'Goop_Transaction_Detail_Report') {
      this.dataasof = this.userProfifle.goopDataAsOf;
      this.dataasoffFormat = new Date(this.datePipe.transform(this.dataasof, 'MM/dd/yyyy')!);
      this.PdfVisible = false;
      this.goopDataasofVisible = true;
      this.dataasofVisible = false;
    } else {
      this.dataasof = this.userProfifle.dataasof;
      this.dataasoffFormat = new Date(this.datePipe.transform(this.dataasof, 'MM/dd/yyyy')!);
      this.PdfVisible = true;
      this.dataasofVisible = false;
      this.goopDataasofVisible = false;
    }

    // Executive management flag
    this.executiveManagementFlag =
      this.selectedReport === 'Executive_Management_Report' ||
      this.selectedReport === 'Carrier_Trends_Insights';

    // Account nickname flag
    this.accountNickNameFlag =
      this.selectedReport === 'FULL_INVOICE_SUMMARY' ||
      this.selectedReport === 'INVOICE_DATA' ||
      this.selectedReport === 'Account_Summary_Report';

    // Report name binding
    this.detailReportsFormGroup.get('reportName')?.setValue(reportName);

    event.preventDefault();
  }

  async runreport_clickHandler(): Promise<void> {
    const dateFr = this.detailReportsFormGroup.get('fromDate')?.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');
    const dateT = this.detailReportsFormGroup.get('toDate')?.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');

    const dateFromYear = this.datePipe.transform(dateFr, 'yyyy');
    const dateToYear = this.datePipe.transform(dateT, 'yyyy');

    const fromDate = dateFrom;
    const toDate = dateTo;
    const reportsselectedValue = this.detailReportsFormGroup.get('reportType')?.value;
    const pdf_btnselected = this.detailReportsFormGroup.get('reportFormat')?.value;

    const fromyear = this.datePipe.transform(fromDate, 'yyyy');
    this.mailFromYear = fromyear;
    const toyear = this.datePipe.transform(toDate, 'yyyy');
    this.mailToYear = toyear;

    const accNoUPS = this.detailReportsFormGroup.get('accNo')?.value;
    const accNo = Array.isArray(accNoUPS) ? accNoUPS.join('@') : accNoUPS;

    // Validation checks
    if (!fromDate || !toDate) {
      this.openModal('Please Select Date Range');
      return;
    }
    if (new Date(dateFr) > new Date(dateT)) {
      this.openModal('Please Select Valid Date Range');
      return;
    }

    if (reportsselectedValue) {
      if (!pdf_btnselected) {
        this.openModal('Please Select PDF or EXCEL!.....');
      } else if (pdf_btnselected === 'PDF') {
        if (
          reportsselectedValue === 'Late_Exception_Report' ||
          reportsselectedValue === 'Mode_Conversion_Report' ||
          reportsselectedValue === 'Tracked_Shipment_Report' ||
          reportsselectedValue === 'ZONE_DIST_BY_SERVICE_TYPE' ||
          reportsselectedValue === 'FULL_INVOICE_SUMMARY' ||
          reportsselectedValue === 'Discount_by_service' ||
          reportsselectedValue === 'Contract_Rate_Report_Summary' ||
          reportsselectedValue === 'Service_By_State_Distribution' ||
          reportsselectedValue === 'Service_Charge_Report' ||
          reportsselectedValue === 'Peak_Surcharge_Report' ||
          reportsselectedValue === 'Executive_Management_Report' ||
          reportsselectedValue === 'Carrier_Trends_Insights' ||
          reportsselectedValue === 'Returns_Report' ||
          reportsselectedValue === 'DTP_DFC_Added_Charges' ||
          reportsselectedValue === 'Missing_PLD_Fee_Report' ||
          reportsselectedValue === 'Non_Machinable_Charge_Report' ||
          reportsselectedValue === 'Shipping_Audit_Fees_Report' ||
          reportsselectedValue === 'Goop_Transaction_Detail_Report' ||
          reportsselectedValue === 'Entered_Vs_Billed_Dimensions_Report' ||
          reportsselectedValue === 'ASD_Report' ||
          reportsselectedValue === 'Air_Shipping_Documents_Report' ||
          reportsselectedValue === 'Late_Payment_Fee_Report' ||
          reportsselectedValue === 'Early_AM_Surcharge_Report' ||
          reportsselectedValue === 'Zone_Adjustment_Report' ||
          reportsselectedValue === 'VOIDS_Report' ||
          reportsselectedValue === 'UPS_Promo_Discount_Report'
        ) {
          this.openModal('Only Excel Data Available for this Report');
        } else {
          this.report_clickHandler(null);
        }
      } else if (pdf_btnselected === 'Excel') {
        if (reportsselectedValue === 'FULL_INVOICE_SUMMARY') {
          this.t004_genralparameterobj['clientname'] = this.clientName;
          this.t004_genralparameterobj['fromdate'] = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
          this.t004_genralparameterobj['todate'] = this.datePipe.transform(toDate, 'yyyy-MM-dd');
          this.t004_genralparameterobj['accountNumber'] = accNo;

          await this.httpClientService.fullinvoiceReportaccount(this.t004_genralparameterobj).subscribe({
            next: (result) => (this.List_FullinvoicesummaryAcc = result),
            error: (err) => console.error(err)
          });

          await this.httpClientService.fullinvoiceReporttotal(this.t004_genralparameterobj).subscribe({
            next: (result) => (this.List_FullinvoicesummaryTot = result),
            error: (err) => console.error(err)
          });

          await this.httpClientService.fullinvoiceReport(this.t004_genralparameterobj).subscribe({
            next: (result) => {
              this.List_Fullinvoicesummary = result;

              if (
                this.List_FullinvoicesummaryTot.length !== 0 ||
                this.List_Fullinvoicesummary.length !== 0 ||
                this.List_FullinvoicesummaryAcc.length !== 0
              ) {
                this.List_Fullinvoicesummary = result;
                if (
                  this.List_FullinvoicesummaryTot.length !== 0 ||
                  this.List_Fullinvoicesummary.length !== 0 ||
                  this.List_FullinvoicesummaryAcc.length !== 0
                ) {
                  this.report_clickHandler(null);
                } else {
                  this.openModal('NO Record Found');
                  return;
                }
              } else {
                this.openModal('NO Record Found');
              }
            },
            error: (err) => console.error(err)
          });
        } else {
          this.report_clickHandler(null);
        }
      } else if (pdf_btnselected === 'Stripped Data') {
        if (reportsselectedValue === 'INVOICE_DATA') {
          this.report_clickHandler(null);
        } else {
          this.openModal('Stripped Data Not Available for this Report');
          return;
        }
      } else {
        this.report_clickHandler(null);
      }
    } else {
      this.openModal('Please Select Any one of the Reports');
    }
  }


  report_clickHandler(event: any): void {
    const reportsselectedValue = this.detailReportsFormGroup.get('reportType')?.value;
    const cmbcharge = this.detailReportsFormGroup.get('chargeDes')?.value;
    const pdf_btnselected = this.detailReportsFormGroup.get('reportFormat')?.value;
    const fromDate = this.detailReportsFormGroup.get('fromDate')?.value;
    const toDate = this.detailReportsFormGroup.get('toDate')?.value;

    // DIM Factor restriction
    if (reportsselectedValue === 'DIM_Factor') {
      if (pdf_btnselected === 'PDF' || pdf_btnselected === 'Stripped Data') {
        this.openModal('Only Excel Data Available for this Report');
        return;
      }
    }

    // Reports that don’t allow PDF
    if (
      reportsselectedValue === 'SCCandAudit_Fees_Report' ||
      reportsselectedValue === 'Discount_by_service' ||
      reportsselectedValue === 'Third_Party_Billing_Service' ||
      reportsselectedValue === 'Freight_Collect_and_Third_Party_Billing_Service' ||
      reportsselectedValue === 'INVOICE_DATA' ||
      reportsselectedValue === 'ADDL_HANDLING_LP_OVERMAX' ||
      reportsselectedValue === 'Service_By_State_Distribution' ||
      reportsselectedValue === 'MULTIPLE_PACKAGE' ||
      reportsselectedValue === 'Undeliverable_Returns_Report' ||
      reportsselectedValue === 'NonStandard_Charges_SurePost_Report'
    ) {
      if (pdf_btnselected === 'PDF') {
        this.openModal('PDF Data Not Available for this Report');
        return;
      }
    }

    // Date formatting
    this.detailReportsFormGroup.get('fromDate')?.setValue(this.datePipe.transform(fromDate, 'yyyy-MM-dd'));
    this.detailReportsFormGroup.get('toDate')?.setValue(this.datePipe.transform(toDate, 'yyyy-MM-dd'));

    this.detailReportsFormGroup.get('t001ClientProfile.t301accountAC')?.setValue(null);
    this.detailReportsFormGroup.get('t001ClientProfile.t302planAC')?.setValue(null);

    // Stripped Data handling
    if (pdf_btnselected === 'Stripped Data') {
      this.detailReportsFormGroup.get('reportType')?.setValue('INVOICE_STRIPPED_DATA');
      this.detailReportsFormGroup.get('designFileName')?.setValue('INVOICE_STRIPPED_DATA');
      this.detailReportsFormGroup.get('reportName')?.setValue('Stripped Invoice Data');
    } else {
      this.detailReportsFormGroup.get('reportType')?.setValue(reportsselectedValue);
      this.detailReportsFormGroup.get('designFileName')?.setValue(reportsselectedValue);

      if (reportsselectedValue === 'Executive_Management_Report' || reportsselectedValue === 'Carrier_Trends_Insights') {
        this.detailReportsFormGroup.get('reportName')?.setValue('Carrier Trends Insights');
        const executiveReportType = this.detailReportsFormGroup.get('executiveReportType')?.value;
        this.detailReportsFormGroup.get('chargeDes')?.setValue(executiveReportType);

        const displayYear = this.detailReportsFormGroup.get('displayYear')?.value;
        const from_Date = `${displayYear}-01-01`;
        const to_Date = `${displayYear}-12-31`;

        this.detailReportsFormGroup.get('fromDate')?.setValue(this.datePipe.transform(from_Date, 'yyyy-MM-dd'));
        this.detailReportsFormGroup.get('toDate')?.setValue(this.datePipe.transform(to_Date, 'yyyy-MM-dd'));
      }
    }

    // Common fields
    this.detailReportsFormGroup.get('moduleName')?.setValue('detailreport');
    this.detailReportsFormGroup.get('login_id')?.setValue(this.loginId);
    this.detailReportsFormGroup.get('status')?.setValue('IN QUEUE');

    if (this.mailFromYear !== this.mailToYear) {
      this.detailReportsFormGroup.get('status')?.setValue('PENDING');
      this.detailReportsFormGroup.get('checkCrossYear')?.setValue('CROSSYEARRUN');
    }

    // Report format mapping
    if (pdf_btnselected === 'PDF') {
      this.detailReportsFormGroup.get('reportFormat')?.setValue('PDF');
    }
    if (pdf_btnselected === 'Excel') {
      this.detailReportsFormGroup.get('reportFormat')?.setValue('CSV');
    }
    if (pdf_btnselected === 'Stripped Data') {
      this.detailReportsFormGroup.get('reportFormat')?.setValue('CSV_DETAIL');
    }

    // Account number handling
    const AccNumber = this.detailReportsFormGroup.get('accNo')?.value;
    const containsAll = Array.isArray(AccNumber) && AccNumber[0].includes('ALL');

    if (AccNumber === 'ALL' || containsAll) {
      this.detailReportsFormGroup.get('accountNumber')?.setValue(null);
    } else {
      const accNo = Array.isArray(AccNumber) ? AccNumber.join('@') : AccNumber;
      this.detailReportsFormGroup.get('accountNumber')?.setValue(accNo);
    }

    // CRM account number
    this.detailReportsFormGroup.get('crmaccountNumber')?.setValue(this.crmAccountnumber ?? '-');

    // Invoice reports special handling
    if (
      this.detailReportsFormGroup.get('reportType')?.value === 'INVOICE_STRIPPED_DATA' ||
      this.detailReportsFormGroup.get('reportType')?.value === 'INVOICE_DATA'
    ) {
      const dt1 = new Date(fromDate);
      const dt2 = new Date(toDate);

      const fourweeks = Math.floor(
        (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
          Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
        (1000 * 60 * 60 * 24)
      );

      const clientId: number = this.clientID;

      if (this.clientName === 'admin') {
        this.detailReportsFormGroup.get('adminFlag')?.setValue('Y');
        this.httpClientService.runReport(this.detailReportsFormGroup.value).subscribe({
          next: (result) => this.saveOrUpdateReportLogResult(result),
          error: (err) => console.error(err)
        });
      } else {
        if (AccNumber === 'ALL' || containsAll) {
          this.detailReportsFormGroup.get('accountNumber')?.setValue(null);
        } else {
          const accNo = Array.isArray(AccNumber) ? AccNumber.join('@') : AccNumber;
          this.detailReportsFormGroup.get('accountNumber')?.setValue(accNo);
        }

        this.detailReportsFormGroup.get('adminFlag')?.setValue('N');
        this.httpClientService.runReport(this.detailReportsFormGroup.value).subscribe({
          next: (result) => this.saveOrUpdateReportLogResult(result),
          error: (err) => console.error(err)
        });
      }

      this.detailReportsFormGroup.get('fromDate')?.setValue(new Date(fromDate));
      this.detailReportsFormGroup.get('toDate')?.setValue(new Date(toDate));
    } else {
      if (AccNumber === 'ALL' || containsAll) {
        this.detailReportsFormGroup.get('accountNumber')?.setValue(null);
      } else {
        const accNo = Array.isArray(AccNumber) ? AccNumber.join('@') : AccNumber;
        this.detailReportsFormGroup.get('accountNumber')?.setValue(accNo);
      }

      this.httpClientService.runReport(this.detailReportsFormGroup.value).subscribe({
        next: (result) => this.saveOrUpdateReportLogResult(result),
        error: (err) => console.error(err)
      });

      this.detailReportsFormGroup.get('fromDate')?.setValue(new Date(fromDate));
      this.detailReportsFormGroup.get('toDate')?.setValue(new Date(toDate));
    }

    // Reset reportFormat back to UI values
    const radioBtnSelected = this.detailReportsFormGroup.get('reportFormat')?.value;
    if (radioBtnSelected === 'PDF') {
      this.detailReportsFormGroup.get('reportFormat')?.setValue('PDF');
    } else if (radioBtnSelected === 'CSV') {
      this.detailReportsFormGroup.get('reportFormat')?.setValue('Excel');
    } else if (radioBtnSelected === 'CSV_DETAIL') {
      this.detailReportsFormGroup.get('reportFormat')?.setValue('Stripped Data');
      this.detailReportsFormGroup.get('reportType')?.setValue('INVOICE_DATA');
    }

    event.preventDefault();
  }


  saveOrUpdateReportLogResult(result: any) {
    var t007_reportlogobjResult = result;
    if (t007_reportlogobjResult.count != 0 && t007_reportlogobjResult.reportType != "Executive_Management_Report" && t007_reportlogobjResult.reportType != 'Carrier_Trends_Insights') {
      this.openModal("This report is already available for the selected timeframe. Please go to the Reports Page to download.");
      return;
    }
    if (this.mailFromYear != this.mailToYear) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.detailReportsFormGroup.value, "CROSSYEARRUN");
      return;
    }
    if (t007_reportlogobjResult.reportType == "ZONE_DIST_BY_SERVICE_TYPE" && t007_reportlogobjResult.countInvoiceData > 500000) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.detailReportsFormGroup.value, "BATCH");
      return;
    }
    if ((t007_reportlogobjResult.reportType == "SCCandAudit_Fees_Report" || t007_reportlogobjResult.reportType == "Shipping_Audit_Fees_Report") && t007_reportlogobjResult.countInvoiceData > 300000) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.detailReportsFormGroup.value, "BATCH");
      return;
    }
    if (t007_reportlogobjResult.reportType != "ZONE_DIST_BY_SERVICE_TYPE" && t007_reportlogobjResult.reportType != "SCCandAudit_Fees_Report" && t007_reportlogobjResult.reportType != "Shipping_Audit_Fees_Report" && t007_reportlogobjResult.countInvoiceData > 100000) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.detailReportsFormGroup.value, "BATCH");
      return;
    }
    this.detailReportsFormGroup.get('accountNumber')?.setValue("ALL");

    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);

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

  async clearall_clickHandler() {
    //trackingDate
    await this.detailReportsFormGroup.get('fromDate')?.setValue(new Date(this.tempfromDate));
    await this.detailReportsFormGroup.get('toDate')?.setValue(new Date(this.temptoDate));
    this.ChargedescVisible = false;
    this.strippedDataVisible = false;

    await this.collection();
    this.FilterReports = '';
    this.detailReportsFormGroup.get('reportFormat')?.setValue('Excel');
    this.detailReportsFormGroup.get('reportType')?.setValue('');
    this.executiveManagementFlag = false;
  }

}