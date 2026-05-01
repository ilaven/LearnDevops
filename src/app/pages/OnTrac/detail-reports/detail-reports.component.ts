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
import { OnTracReportLogComponent } from './report-log/report-log.component';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MailPopupComponent } from './mail-popup/mail-popup.component';
import { map, startWith } from 'rxjs/operators';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';

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
  selector: 'app-ontrac-detail-reports',
  templateUrl: './detail-reports.component.html',
  styleUrls: ['./detail-reports.component.scss'],
  standalone: false
})
export class OnTracDetailReportsComponent implements OnInit, AfterViewInit {
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
    private httpOntracService: HttpOntracService,
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
          this.detailReportsFormGroup.get('ontracClientId')?.setValue(this.clientID);
          this.detailReportsFormGroup.get('clientId')?.setValue(this.clientID);
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
      this.closeLoading();
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

  //Account number display
  fetchaccountDetails(t002AccSrchObj: any, isInitial = false): void {
    this.httpOntracService.fetchaccountDetails(t002AccSrchObj).subscribe({
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
    var t001ClientObj = {};
    this.httpOntracService.fetchReportDescription(t001ClientObj).subscribe({
      next: result => {
        this.ReportDescriptionResult(result);

      }, error: error => { this.closeLoading(); console.error(error) }
    });

    this.closeLoading();
  }

  ReportDescriptionResult(result: any) {
    this.itemsAC = [];
    this.tempMasterAC = [];
    this.reportDescriptionResultAC = result;
    this.sortArr('reportName');

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

  FilterReports_changeHandler(event: any): void {
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
    await this.httpOntracService.fetchReportLog(userprofile).subscribe({
      next: (result: any[]) => {
        var reportDetails = result;
        const dialogRef = this.dialog.open(OnTracReportLogComponent, {
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
    if (this.selectedReport == 'FUEL_SURCHARGE_DETAIL' || this.selectedReport == 'FUEL_SURCHARGE_SUMAMRY') {
      this.ChargedescVisible = true;
    } else {
      this.ChargedescVisible = false;
    }
    this.isExcelVisible = true;
    this.strippedDataVisible = false;
    this.detailReportsFormGroup.get('reportFormat')?.setValue('Excel');
    this.detailReportsFormGroup.get('reportType')?.setValue(this.selectedReport);
    this.detailReportsFormGroup.get('reportName')?.setValue(reportName);
    event.preventDefault();
  }

  async runreport_clickHandler(): Promise<void> {
    var dateFr = this.detailReportsFormGroup.get('fromDate')?.value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateT = this.detailReportsFormGroup.get('toDate')?.value;
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");

    var fromDate = dateFrom;
    var toDate = dateTo;
    var reportsselectedValue = this.detailReportsFormGroup.get('reportType')?.value;
    var pdf_btnselected = this.detailReportsFormGroup.get('reportFormat')?.value;
    var fromyear = this.datePipe.transform(fromDate, "yyyy");
    this.mailFromYear = fromyear;
    var toyear = this.datePipe.transform(toDate, "yyyy");
    this.mailToYear = toyear;
    var accNoUPS = this.detailReportsFormGroup.get('accNo')?.value;

    var accNo = accNoUPS.join('@');
    if (fromDate == "" || toDate == "" || fromDate == null || toDate == null) {
      this.openModal("Please Select Date Range");
      return;
    }
    if (new Date(dateFr) > new Date(dateT)) {
      this.openModal("Please Select Valid Date Range");
      return;
    }

    if (reportsselectedValue != null && reportsselectedValue != undefined && reportsselectedValue != "") {
      if (pdf_btnselected == "" || pdf_btnselected == null || pdf_btnselected == undefined) {
        this.openModal("Please Select PDF or EXCEL!.....");
      }
      else if (pdf_btnselected == 'PDF') {

        if (reportsselectedValue == 'ADDRESS_CORRECTION' || reportsselectedValue == 'AVG_COST_PACK' || reportsselectedValue == 'AVG_COST_PACK_STATE' ||
          reportsselectedValue == 'AVG_COST_PACK_ZONE' || reportsselectedValue == 'INVOICE_DATA' || reportsselectedValue == 'CHARGE_DESC_SUMMARY' ||
          reportsselectedValue == 'INVOICE_SUMMARY')
          this.openModal("Only Excel Data Available for this Report");
        else
          this.report_clickHandler(null);
      }
      else if (pdf_btnselected == 'Excel') {
        if (reportsselectedValue == "INVOICE_SUMMARY") {
          this.report_clickHandler(null);
        }
        else {
          this.report_clickHandler(null);
        }

      }
      else if (pdf_btnselected == 'Stripped Data') {
        if (reportsselectedValue == "INVOICE_DATA") {
          this.report_clickHandler(null);
        }
        else {
          this.openModal("Stripped Data Not Available for this Report");
          return;
        }
      }
      else {
        this.report_clickHandler(null);
      }
    }
    else {
      this.openModal("Please Select Any one of the Reports");
    }

  }


  report_clickHandler(event: any): void {

    var reportsselectedValue = this.detailReportsFormGroup.get('reportType')?.value;
    var cmbcharge = this.detailReportsFormGroup.get('chargeDes')?.value;
    var pdf_btnselected = this.detailReportsFormGroup.get('reportFormat')?.value;
    var fromDate = this.detailReportsFormGroup.get('fromDate')?.value;
    var toDate = this.detailReportsFormGroup.get('toDate')?.value;

    if (reportsselectedValue == 'FUEL_SURCHARGE_SUMAMRY' || reportsselectedValue == 'FUEL_SURCHARGE_DETAIL') {
      if (cmbcharge == 'Select') {
        this.openModal("Please ensure that charge description is selected and run the report");
        return;
      }
    }

    if (reportsselectedValue == 'ADDRESS_CORRECTION' || reportsselectedValue == 'AVG_COST_PACK' || reportsselectedValue == 'AVG_COST_PACK_STATE' || reportsselectedValue == 'AVG_COST_PACK_ZONE' || reportsselectedValue == 'INVOICE_DATA' || reportsselectedValue == 'CHARGE_DESC_SUMMARY' || reportsselectedValue == 'INVOICE_SUMMARY') {
      if (pdf_btnselected == 'PDF') {
        this.openModal("PDF Data Not Available for this Report");
        return;
      }
    }


    this.detailReportsFormGroup.get('fromDate')?.setValue(this.datePipe.transform(fromDate, "yyyy-MM-dd"));
    this.detailReportsFormGroup.get('toDate')?.setValue(this.datePipe.transform(toDate, "yyyy-MM-dd"));

    this.detailReportsFormGroup.get('t001ClientProfile.t301accountAC')?.setValue(null);
    this.detailReportsFormGroup.get('t001ClientProfile.t302planAC')?.setValue(null);
    if (pdf_btnselected == 'Stripped Data') {
      this.detailReportsFormGroup.get('reportType')?.setValue("INVOICE_STRIPPED_DATA");
      this.detailReportsFormGroup.get('designFileName')?.setValue("INVOICE_STRIPPED_DATA");
      this.detailReportsFormGroup.get('reportName')?.setValue("INVOICE STRIPPED DATA");
    }
    else {
      this.detailReportsFormGroup.get('reportType')?.setValue(reportsselectedValue);
      this.detailReportsFormGroup.get('designFileName')?.setValue(reportsselectedValue);

      if (reportsselectedValue == "ADDRESS_CORRECTION") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Address Corrections");
      }
      if (reportsselectedValue == "AVG_COST_PACK") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Average Cost Per Package");
      }
      if (reportsselectedValue == "AVG_COST_PACK_STATE") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Average Cost Per Package By State");
      }
      if (reportsselectedValue == "CHARGE_DESC_SUMMARY") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Charge Description Summary");
      }
      if (reportsselectedValue == "AVG_COST_PACK_ZONE") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Average Cost Per Package By Zone");
      }
      if (reportsselectedValue == "INVOICE_DATA") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Invoice Data");
      }
      if (reportsselectedValue == "INVOICE_SUMMARY") {
        this.detailReportsFormGroup.get('reportName')?.setValue("Invoice Summary");
      }

    }
    this.detailReportsFormGroup.get('moduleName')?.setValue("detailreport");
    this.detailReportsFormGroup.get('login_id')?.setValue(this.loginId);


    this.detailReportsFormGroup.get('status')?.setValue("IN QUEUE");
    if (this.mailFromYear != this.mailToYear) {
      this.detailReportsFormGroup.get('status')?.setValue("PENDING");
      this.detailReportsFormGroup.get('checkCrossYear')?.setValue("CROSSYEARRUN");
    }
    if (pdf_btnselected == "PDF") {
      this.detailReportsFormGroup.get('reportFormat')?.setValue("PDF");
    }
    if (pdf_btnselected == 'Excel') {

      this.detailReportsFormGroup.get('reportFormat')?.setValue("CSV");
    }
    if (pdf_btnselected == "Stripped Data") {
      this.detailReportsFormGroup.get('reportFormat')?.setValue("CSV_DETAIL");
    }

    var AccNumber = this.detailReportsFormGroup.get('accNo')?.value;
    var containsAll = AccNumber[0].includes('ALL');

    if (this.detailReportsFormGroup.get('accNo')?.value == "ALL" || containsAll == true) {
      this.detailReportsFormGroup.get('accountNumber')?.setValue(null);
    }
    else {

      var accNo = AccNumber.join('@');
      this.detailReportsFormGroup.get('accountNumber')?.setValue(accNo);
    }
    if (this.crmAccountnumber != null) {
      this.detailReportsFormGroup.get('crmaccountNumber')?.setValue(this.crmAccountnumber);
    }
    else {

      this.detailReportsFormGroup.get('crmaccountNumber')?.setValue("-");
    }
    if (this.detailReportsFormGroup.get('reportType')?.value == "INVOICE_STRIPPED_DATA" || this.detailReportsFormGroup.get('reportType')?.value == "INVOICE_DATA") {

      var dt1: any = new Date(fromDate);
      var dt2: any = new Date(toDate);

      var fourweeks: any = Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));

      var clientId: number = this.clientID;
      if (this.clientName == "admin") {
        this.detailReportsFormGroup.get('adminFlag')?.setValue("Y");


        this.httpOntracService.runReport(this.detailReportsFormGroup.value).subscribe({
          next: (result: any) => {
            this.saveOrUpdateReportLogResult(result);
          }, error: error => {

          }
        });
      }
      else {

        var AccNumber = this.detailReportsFormGroup.get('accNo')?.value;
        var containsAll = AccNumber[0].includes('ALL');

        if (this.detailReportsFormGroup.get('accNo')?.value == "ALL" || containsAll == true) {

          this.detailReportsFormGroup.get('accountNumber')?.setValue(null);

        }
        else {
          var accNo = AccNumber.join('@');
          this.detailReportsFormGroup.get('accountNumber')?.setValue(accNo);
        }
        this.detailReportsFormGroup.get('adminFlag')?.setValue("N");
        // if(fourweeks<=180){


        this.httpOntracService.runReport(this.detailReportsFormGroup.value).subscribe({
          next: (result: any) => {
            this.saveOrUpdateReportLogResult(result);
          }, error: error => {

          }
        });
        // }
        // else{
        //   this.openModal("Date range can't be more than six months");
        // }  
      }


      this.detailReportsFormGroup.get('fromDate')?.setValue(new Date(fromDate));
      this.detailReportsFormGroup.get('toDate')?.setValue(new Date(toDate));

    }
    else {

      var AccNumber = this.detailReportsFormGroup.get('accNo')?.value;
      var containsAll = AccNumber[0].includes('ALL');
      if (this.detailReportsFormGroup.get('accNo')?.value == "ALL" || containsAll == true) {
        this.detailReportsFormGroup.get('accountNumber')?.setValue(null);
      } else {

        var accNo = AccNumber.join('@');
        this.detailReportsFormGroup.get('accountNumber')?.setValue(accNo);
      }


      this.httpOntracService.runReport(this.detailReportsFormGroup.value).subscribe({
        next: (result: any) => {
          this.saveOrUpdateReportLogResult(result);
        }, error: error => {
        }
      });
      this.detailReportsFormGroup.get('fromDate')?.setValue(new Date(fromDate));
      this.detailReportsFormGroup.get('toDate')?.setValue(new Date(toDate));
    }
    var radioBtnSelected = this.detailReportsFormGroup.get('reportFormat')?.value;
    if (radioBtnSelected == "PDF") {
      this.detailReportsFormGroup.get('reportFormat')?.setValue("PDF");
    } else if (radioBtnSelected == "CSV") {
      this.detailReportsFormGroup.get('reportFormat')?.setValue("Excel");
    } else if (radioBtnSelected == "CSV_DETAIL") {
      this.detailReportsFormGroup.get('reportFormat')?.setValue("Stripped Data");
      this.detailReportsFormGroup.get('reportType')?.setValue("INVOICE_DATA");
    }


  }


  saveOrUpdateReportLogResult(result: any) {
    var t007_reportlogobjResult = result;
    if (t007_reportlogobjResult.count != 0) {
      this.openModal("This report is already available for the selected timeframe. Please go to the Reports Page to download.");
      return;
    }
    if (this.mailFromYear != this.mailToYear) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.detailReportsFormGroup.value, "CROSSYEARRUN");
      return;
    }
    if (t007_reportlogobjResult.countInvoiceData > 100000) {
      this.openClientAcNoDetailsPopup(t007_reportlogobjResult, this.detailReportsFormGroup.value, "BATCH");
      return;
    }
    this.detailReportsFormGroup.get('accountNumber')?.setValue("ALL");

    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalOnTrac(this.reportsFormGroup.value);

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