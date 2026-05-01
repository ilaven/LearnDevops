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
import { firstValueFrom, map, startWith } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as fs from 'file-saver';
import { HttpDhlService } from 'src/app/core/services/httpdhl.service';
import { any } from '@amcharts/amcharts5/.internal/core/util/Array';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';

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
  selector: 'app-usps-charge-description',
  templateUrl: './charge-description.component.html',
  styleUrls: ['./charge-description.component.scss'],
  standalone: false
})
export class UspsChargeDescriptionComponent implements OnInit, AfterViewInit {
  // Scroll references
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('bottomScroll') bottomScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('metricsTable') metricsTable!: ElementRef<HTMLTableElement>;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @ViewChild(MatSort) sort!: MatSort;

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
  loginId = 123;
  allSelected = true;
  totalNetCharge: any;
  totalPackages: any;



  //form group
  apiControllerFormGroup: FormGroup;
  reportFormGroup: FormGroup;


  // =======================
  // TABLE 3 data
  // =======================
  chargeRows: UpsChargeRow[] = [];

  // -----------------------------------
  // Lifecycle
  constructor(private cookiesService: CookiesService,
    private loaderService: LoaderService, private offcanvasService: NgbOffcanvas,
    private datePipe: DatePipe, private commonService: CommonService,
    private httpUspsService: HttpUSPSService, private dialog: MatDialog
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
    await this.apiControllerFormGroup.get('clientId')?.setValue(this.clientID);
    await this.apiControllerFormGroup.get('clientId')?.setValue(this.clientID);
    await this.apiControllerFormGroup.get('report')?.setValue("ChargeDescriptionTab");
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

  async fetchAdvanceChargeDescriptionDetails(): Promise<void> {
    try {

      const result = await firstValueFrom(
        this.httpUspsService.fetchChargeDescriptionDetails(this.apiControllerFormGroup.value)
      );

      this.fetchChargeDescriptionDetails = result;

      await this.checkerMethod(this.fetchChargeDescriptionDetails);

    } catch (error) {
      console.log('error', error);
    }
  }


  checkerMethod(fetchChargeDescriptionDetails: any[]): void {
    this.fetchChargeDescriptionDetails = fetchChargeDescriptionDetails;
    this.dataSource = new MatTableDataSource(this.fetchChargeDescriptionDetails);
    this.dataSource.sort = this.sort;
    this.fetchData_ACAS(this.fetchChargeDescriptionDetails);
    this.setDisplayedColumns();
    this.closeLoading();
  }

  async fetchData_ACAS(resultParameter: any[]): Promise<void> {
    if (resultParameter.length == 0) {
      this.openModal("No record found");
    }
    else {
      this.totalNetCharge = 0;
      this.totalPackages = 0;
      for (let index = 0; index < resultParameter.length; index++) {
        this.totalNetCharge += Number(resultParameter[index].netamount.replace(',', '').replace('$', ''));
        this.totalPackages += Number(resultParameter[index].nooftrackingno.replace(',', ''));
      }
    }
    resultParameter = [];
  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },

    });
  }

  async setDisplayedColumns() {
    var reportName = this.apiControllerFormGroup.get('report')?.value;
    this.displayedColumns = [];

    this.columns = [
      { field: 'Mail Class', fieldVal: 'group', label: 'Mail Class', visible: true },
      { field: 'Total Charge', fieldVal: 'netamount', label: 'Total Charge', visible: true },
      { field: 'Number of Packages', fieldVal: 'nooftrackingno', label: 'Number of Packages', visible: true },
      { field: 'Average Cost', fieldVal: 'avgcost', label: 'Average Cost', visible: true },
      { field: '% of Spend', fieldVal: 'percentofspent', label: '% of Spend', visible: true },
      { field: 'Total Weight (Lbs)', fieldVal: 'totalweight', label: 'Total Weight (Lbs)', visible: true },
      { field: 'Total Weight (Oz)', fieldVal: 'totalweightOz', label: 'Total Weight (Oz)', visible: true },
      { field: 'Average Weight (Lbs)', fieldVal: 'avgweight', label: 'Average Weight (Lbs)', visible: true },
      { field: 'Average Weight (Oz)', fieldVal: 'avgweightOz', label: 'Average Weight (Oz)', visible: true },
      { field: 'Average Zone', fieldVal: 'avgzone', label: 'Average Zone', visible: true }
    ];

    // ✅ Same old loop + visibility check
    this.columns.forEach((column, index) => {

      column.index = index;

      if (column.visible !== false) {
        this.displayedColumns.push(column.fieldVal);
      }

    });

    this.dataFormatter(this.displayedColumns);
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

            if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] != "") {
              if (this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]].indexOf("%") > -1) {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] * 100)
              }
              else {
                this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] * 100).toFixed(2)) + '%';
              }
            }
          }
          else if (displayedColumns[loop1] == 'totalweightLbs' || displayedColumns[loop1] == 'totalweightKgs' || displayedColumns[loop1] == 'avgweightLbs' || displayedColumns[loop1] == 'avgweightKgs' || displayedColumns[loop1] == 'totalweight'
            || displayedColumns[loop1] == 'totalweightOz' || displayedColumns[loop1] == 'avgweight' || displayedColumns[loop1] == 'avgweightOz' || displayedColumns[loop1] == 'avgzone') {
            if (this.fetchChargeDescriptionDetails[loop2]['type'] != 'Extra Charges') {
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(2));
            } else {
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]);
            }

          }
          else if (displayedColumns[loop1] == 'nooftrackingnoLbs' || displayedColumns[loop1] == 'nooftrackingnoKgs') {
            if (this.fetchChargeDescriptionDetails[loop2]['type'] != 'Extra Charges') {
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(0));
            } else {
              this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]);
            }

          }
          else if (displayedColumns[loop1] == 'nooftrackingno') {
            this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]] = this.setCommaQty(Number(this.fetchChargeDescriptionDetails[loop2][displayedColumns[loop1]]).toFixed(0));

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
      await this.httpUspsService.fetchChargeDescriptionDetails(this.apiControllerFormGroup.value).subscribe({
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
    t007_reportlogobj["accountNumber"] = null;

    var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
    var toDate = this.apiControllerFormGroup.get('todate')?.value;
    var fromDateTransformed = this.datePipe.transform(fromDate, "yyyy-MM-dd");
    var toDateTransformed = this.datePipe.transform(toDate, "yyyy-MM-dd");
    t007_reportlogobj["fromDate"] = fromDateTransformed;
    t007_reportlogobj["toDate"] = toDateTransformed;
    t007_reportlogobj["fromdate"] = fromDateTransformed;
    t007_reportlogobj["todate"] = toDateTransformed;
    var reportName = this.apiControllerFormGroup.get('report')?.value;

    if (reportName == "ChargeDescriptionTab") {
      t007_reportlogobj["reportType"] = "Charge_Description_Report_with_Group_Details";
      t007_reportlogobj["reportName"] = "Charge Description Report with Group Details";
      t007_reportlogobj["designFileName"] = "Charge_Description_Group_Report_Details";
    }
    this.httpUspsService.runReport(t007_reportlogobj).subscribe({
      next: (result) => {
        this.saveOrUpdateReportLogResult(result);
      }, error: error => {
      }
    });
  }

  generateExcel() {
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
    var d = new Date();
    var currentDate = this.datePipe.transform(d, "yyyy-MM-dd HH:mm:ss");
    var fileName = "";
    var title = 'Charge Description Report';

    fileName = this.clientName + currentDate + ".xlsx";

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
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    //Add Title
    var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
    var toDate = this.apiControllerFormGroup.get('todate')?.value;
    var fromDateTransformed = this.datePipe.transform(fromDate, "MM-dd-yyyy");
    var toDateTransformed = this.datePipe.transform(toDate, "MM-dd-yyyy");
    let titleRow = worksheet.addRow([title + "       From Invoice Date : " + fromDateTransformed + "  To Invoice Date : " + toDateTransformed]);
    titleRow.font = { family: 4, size: 13, bold: true };
    worksheet.mergeCells('A1:G1');
    //Add Header Row

    var count = 1;
    worksheet.addRow([]);
    var headerTableTwoArr = [];
    headerTableTwoArr.push(['Total Charge', Number(this.totalNetCharge.toFixed(2))])
    headerTableTwoArr.push(['Number of Packages', Number(this.totalPackages.toFixed(2))])
    headerTableTwoArr.forEach((d, index) => {
      let row = worksheet.addRow(d);
      if (index == 0) {
        worksheet.getCell('B3').numFmt = '$#,##0.00';
      } else {
        worksheet.getCell('B4').numFmt = '#,##0';
      }
      row.eachCell((cell, number) => {
        if (number == 1) {
          cell.font = { family: 4, size: 11, bold: true, color: { argb: "ffffff" } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5b9bd5' }
          }
        }
        else {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'f2f2f2' }
          }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
    }
    );
    worksheet.addRow([]);

    var headerTableThreeArr = [];
    for (let loop = 0; loop < this.columns.length; loop++) {
      headerTableThreeArr.push(this.columns[loop]['field'])
    }
    let headerRow_TableThree = worksheet.addRow(headerTableThreeArr);
    headerRow_TableThree.font = { family: 4, size: 11, bold: true, color: { argb: "ffffff" } };
    headerRow_TableThree.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',

        fgColor: { argb: '5b9bd5' },
        bgColor: { argb: '5b9bd5' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      cell.alignment = { horizontal: 'center' };
    })


    var tablethreeArr = [];
    var tablethreeDataArr;
    for (var loop1 = 0; loop1 < this.fetchChargeDescriptionDetails.length; loop1++) {
      tablethreeDataArr = [];
      for (var loop2 = 0; loop2 < this.displayedColumns.length; loop2++) {
        if (loop2 == 0) {
          tablethreeDataArr.push(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]])
        }
        else if (loop2 == 4) {
          tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100);
        }
        else {
          tablethreeDataArr.push(Number(this.fetchChargeDescriptionDetails[loop1][this.displayedColumns[loop2]].replace('$', '').replace(/[,]/g, '').replace('%', '')));
        }
      }
      tablethreeArr.push(tablethreeDataArr)
    }

    var count = 1;
    tablethreeArr.forEach((d, index) => {
      let row = worksheet.addRow(d);
      row.eachCell((cell, number) => {
        if (number == 2 || number == 4) {
          worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 7) + "'").numFmt = '$#,##0.00';
        }
        else if (number == 3) {
          worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 7) + "'").numFmt = '#,##0';
        }
        else if (number == 6 || number == 7 || number == 8 || number == 9 || number == 10) {
          worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 7) + "'").numFmt = '#,##0.00';
        }
        else if (number == 5) {
          worksheet.getCell("'" + this.GetExcelColumnName(number) + "" + (index + 7) + "'").numFmt = '0.00%';
        }

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'f2f2f2' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      count++;
    });

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
    this.commonService._setIntervalUSPS(this.reportFormGroup.value);
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
    t007_reportlogobj["accountNumber"] = null;
    var fromDate = this.apiControllerFormGroup.get('fromdate')?.value;
    var toDate = this.apiControllerFormGroup.get('todate')?.value;
    var fromDateTransformed = this.datePipe.transform(fromDate, "yyyy-MM-dd");
    var toDateTransformed = this.datePipe.transform(toDate, "yyyy-MM-dd");
    t007_reportlogobj["fromDate"] = fromDateTransformed;
    t007_reportlogobj["toDate"] = toDateTransformed;
    t007_reportlogobj["fromdate"] = fromDateTransformed;
    t007_reportlogobj["todate"] = toDateTransformed;

    this.httpUspsService.runReport(t007_reportlogobj).subscribe({
      next: result => {
        this.saveOrUpdateReportLogResult(result);
      }, error: error => {
      }
    });
  }


}