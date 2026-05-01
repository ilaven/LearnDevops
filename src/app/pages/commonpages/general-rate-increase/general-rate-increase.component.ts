import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, signal } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable, forkJoin, merge } from 'rxjs';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";
import { ExcelExportGRI } from './excel-export-gri/excelexport-gri.component';
import { CreateProposalGRIComponent } from './create-proposal-gri/create-proposal-gri.component';
import { FilterscreenGRIComponent } from './filterscreen-gir/filterscreen-gir.component';
import { DeleteAgreementGRIComponent } from './deleteagreement-gri/deleteagreement-gri.component';
import { AccessorialGRIComponent } from './accessorial-gri/accessorial-gri.component';
import { DashBoardSaveAlertGRIComponent } from './dasboard-save-alert-gri/dashboard-save-alert-gri.component';
import { DimfactorGRIComponent } from './dimfactor-gri/dimfactor-gri.component';
import { MinReductionGRIComponent } from './minreduction-gri/minreduction-gri.component';
import { DiscountGRIComponent } from './discount-gri/discount-gri.component';
import { ResetPopupGRIComponent } from './reset-popup-gri/reset-popup-gri.component';
import { HundredweightTierGRIComponent } from './hwttier-gri/hwttier-gri.component';
import { DownloadGRIComponent } from './download-GRI/download-GRI.component';
@Component({
  selector: 'app-general-rate-increase',
  templateUrl: './general-rate-increase.component.html',
  styleUrls: ['./general-rate-increase.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class GRIComponent implements OnInit, AfterViewInit {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;


  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }
  constructor(private dialog: MatDialog, private el: ElementRef, private loaderService: LoaderService, private cookiesService: CookiesService,
    private httpclient: HttpClientService, private fedexService: HttpfedexService, private router: Router, private datePipe: DatePipe,
  ) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      let clienttypesmall = clienttype.toLowerCase();
      this.chargetypevalue.set(clienttypesmall);
    });
  }

  editButtonVisibility = signal<any>(false);
  chargetypevalue = signal<any>('ups');
  //Current list
  currentSavingsAirList: any = [];
  currentSavingsGroundList: any = [];
  currentSavingsIntlList: any = [];
  currentSavingsHWTList: any = [];
  currentSavingsAccList: any = [];
  currentSavingsAccExcelList: any = [];

  //current list to store old list for refresh button
  currentSavingsAirListOld: any = [];
  currentSavingsGroundListOld: any = [];
  currentSavingsIntlListOld: any = [];
  currentSavingsHWTListOld: any = [];
  currentSavingsAccListOld: any = [];

  //current list to hold total
  currentSavingsAirTotalList: any = [];
  currentSavingsGroundTotalList: any = [];
  currentSavingsIntlTotalList: any = [];
  currentSavingsHWTTotalList: any = [];
  currentSavingsAccTotalList: any = [];

  //current list to hold old data for refresh purpose
  currentSavingsAirTotalListOld: any = [];
  currentSavingsGroundTotalListOld: any = [];
  currentSavingsIntlTotalListOld: any = [];
  currentSavingsHWTTotalListOld: any = [];
  currentSavingsAccTotalListOld: any = [];

  //target list
  targetSavingsAirList: any = [];
  targetSavingsGroundList: any = [];
  targetSavingsIntlList: any = [];
  targetSavingsHWTList: any = [];
  targetSavingsAccList: any = [];

  //target list to store total
  targetSavingsAirTotalList: any = [];
  targetSavingsGroundTotalList: any = [];
  targetSavingsIntlTotalList: any = [];
  targetSavingsHWTTotalList: any = [];
  targetSavingsAccTotalList: any = [];

  //dataSource to bind with table ui
  dataSourceAir: any = [];
  dataSourceGround: any = [];
  dataSourceIntl: any = [];
  dataSourceHWT: any = [];
  dataSourceAcc: any = [];

  dataSourceCurrentAirTotal: any = new MatTableDataSource();
  dataSourceCurrentGroundTotal: any = new MatTableDataSource();
  dataSourceCurrentIntlTotal: any = new MatTableDataSource();
  dataSourceCurrentHWTTotal: any = new MatTableDataSource();
  dataSourceCurrentAccTotal: any = new MatTableDataSource();

  dataSourceDimFactor: any = [];
  dataSourceMinReduction: any = [];
  dataSourceAccDetail = new MatTableDataSource();

  currentSavingsGroundSubTotalList: any = [];
  currentSavingsGroundSubTotalListOld: any = [];

  //declared variables
  totalCurrentSpend = 0;
  totalFreightSpend = 0;
  totalAccSpend = 0;

  totalCurrentSpendOld = 0;
  totalFreightSpendOld = 0;
  totalAccSpendOld = 0;

  panelClass: any;
  selectedScenarios: string[] = [];
  filterApplied: boolean = false;
  filterComponents: any = [];
  selectedCategory = signal<any>('');

  currentSavingsAirTotal: any;
  currentSavingsGroundTotal: any;
  currentSavingsIntlTotal: any;
  currentSavingsHWTTotal: any;
  currentSavingsAccTotal: any;

  targetSavingsTotal: any;
  targetSavingsGroundTotal: any;
  targetSavingsIntlTotal: any;
  targetSavingsHWTTotal: any;
  targetSavingsAccTotal: any;

  sccExcelList: any[] = [];
  weightZoneExcelList: any = {};
  servZoneExcelList: any = {};
  dimsExcelList: any = {};
  locationsExcelList: any = {};
  groundExcelList: any = {};
  chargeDescExcelList: any = {};
  revenueTierExcelList: any = {};
  executiveSummaryExcelList: any = {};
  invoiceSummaryExcelList: any = {};
  earnedDescExcelList: any = {};
  summaryExcelList: any = {};


  selected = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  selectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid')]);

  nativeSelectFormControl = new FormControl('valid', [Validators.required, Validators.pattern('valid'),]);

  displayedColumns: any = ['service', 'weightRange', 'count', 'currentPercent', 'currentSpend'];
  displayedColumnsAcc: any = ['service', 'serviceType', 'count', 'currentPercent', 'currentSpend'];

  displayedColumnsDIM: any = [];
  displayedColumnsMin: any = [];

  accessorialDetailListService: any = [];
  editable = signal<any>(false);
  editText = signal<any>('Edit');
  expandable = false;
  carrierAvailability: any = [];
  carrierAvailabilitySignal = signal<any>([]);
  selectedCarrier: any = {};
  selectedCarrierSignal: any = signal<any>({});
  spans: any = [];
  isLoading: any;
  dimFactorList: any = [];
  dimFactorListOld: any = [];

  minimumReductionList: any = [];

  freightCurrentDetails: any = [];
  freightCurrentDetailsOld: any = [];

  accessorialCurrentDetails: any = [];
  freightTargetDetails: any = [];
  accessorialTargetDetails: any = [];

  themeoption: any;

  previousWholeNumber: any;
  previousDecimalNumber: any;

  scenariosDisplayed: any[] = [];
  scenariosDisplayedSignal = signal<any>([]);
  totalScenarios: any = [];
  randomNumber: any;
  defaultCarrier: any;
  carrierName: any;
  fedexClientId: any;
  upsClientId: any;
  allIdList: any = [];
  availableIdList: any = [];
  loadedIdList: any = [];

  distinctAirServices: any = [];
  distinctGroundServices: any = [];
  distinctIntlServices: any = [];
  distinctHWTServices: any = [];
  distinctAccServices: any = [];

  distinctAirServiceName: any = [];
  distinctGroundServiceName: any = [];
  distinctIntlServiceName: any = [];
  distinctHWTServiceName: any = [];
  distinctAccServiceName: any = [];


  distinctAirExcelServiceName: any = [];
  distinctGroundExcelServiceName: any = [];
  distinctIntlExcelServiceName: any = [];
  distinctHWTExcelServiceName: any = [];
  distinctAccExcelServiceName: any = [];

  distinctGroundNewService: any = [];

  columnsDimFactor: any = signal<any>([]);
  columnsDimFactorSignal: any = signal<any>([]);
  columnsMinReduction: any = signal<any>([]);

  distinctGroundServicesWithWeight: any = [];
  distinctWeights: any = [];

  airMinMaxList: any = [];
  groundMinMaxList: any = [];
  intlMinMaxList: any = [];
  hwtMinMaxList: any = [];
  accMinMaxList: any = [];

  airMinMaxListOld: any = [];
  groundMinMaxListOld: any = [];
  intlMinMaxListOld: any = [];
  hwtMinMaxListOld: any = [];
  accMinMaxListOld: any = [];

  distinctMinReductionList: any = [];
  distinctMinReductionListOld: any = [];
  distinctMinServices: any = [];
  targetIdList: any = [];

  currentTier: any = '';
  netAmountMinMaxList: any = [];
  netAmountMinMaxListOld: any = [];

  proposalList: any = [];
  airProposalList: any = [];
  groundProposalList: any = [];
  hwtProposalList: any = [];
  intlProposalList: any = [];
  dimProposalList: any = [];
  accessorialProposalList: any = [];
  hwtAccountNumbersList: any[] = [];

  airSortIcons: any =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
  groundSortIcons: any =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
  intlSortIcons: any =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
  hwtSortIcons: any =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
  accSortIcons: any =
    {
      service: "",
      serviceType: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };

  hwtTier = ['1', '2', '3', '4', '5', '6', '7'];

  GridviewColCurrentformGroup: FormGroup = new FormGroup({
    weightRange: new FormControl(true),
    count: new FormControl(true),
    currentPercent: new FormControl(true),
    currentSpend: new FormControl(true)
  });

  weightRange = this.GridviewColCurrentformGroup.get('weightRange');
  count = this.GridviewColCurrentformGroup.get('count');
  currentUPSPercent = this.GridviewColCurrentformGroup.get('currentPercent');
  currentSpend = this.GridviewColCurrentformGroup.get('currentSpend');

  currentColumnDefinitions = [
    { def: 'weightRange', label: 'Weight Range', hide: this.weightRange!.value },
    { def: 'count', label: 'Count', hide: this.count!.value },
    { def: 'currentPercent', label: 'UPS Discount', hide: this.currentUPSPercent!.value },
    { def: 'currentSpend', label: 'Calculated Spends', hide: this.currentSpend!.value }
  ];

  columns = signal<any>([
    { field: 'Service', fieldVal: 'service' },
    { field: 'Weight Range', fieldVal: 'weightRange' },
    { field: 'Count', fieldVal: 'count' },
    { field: 'UPS Discount', fieldVal: 'currentPercent' },
    { field: 'Calculated Spend', fieldVal: 'currentSpend' }
  ]);

  columnsAcc = signal<any>([
    { field: 'Service', fieldVal: 'service' },
    { field: 'ServiceType', fieldVal: 'serviceType' },
    { field: 'Count', fieldVal: 'count' },
    { field: 'UPS Discount', fieldVal: 'currentPercent' },
    { field: 'Calculated Spend', fieldVal: 'currentSpend' }
  ]);
  clientName = '';
  tableOneArr: any;
  headerTextArr = [];
  allAccServices: any = [];
  isAccServiceAvailable: any = false;
  toggleClicked: boolean = false;

  currentAccCheckList: string[] = [];
  accCheckList: string[] = [];
  initialAccCheckList: string[] = [];
  breakupListServiceName: string[] = [];
  breakupListService: string[] = [];

  currentAccCheckListOld: string[] = [];
  accCheckListOld: string[] = [];

  viewDiscountsList: any;
  zoneLookupList: any;
  currentChanged: boolean = false;
  isDelete: boolean = false;

  currentDIMTable: String = "";
  currentDimList: any = [];

  distinctHWTServicesOld: any = [];
  distinctHWTServiceNameOld: any = [];
  distinctHWTExcelServiceNameOld: any = [];

  dimChanged: boolean = false;
  loaded: boolean = false;


  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Projects' },
      { label: 'Create Project', active: true }
    ];
    this.pageload();
  }
  async pageload() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    this.defaultCarrier = this.cookiesService.getCookieItem('currentCarrierType');
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => { return res; });
    await this.setCarrier();
    this.clientName = this.cookiesService.getCookieItem('clientName');
    await this.getCookieAdmin();
    await this.getTargetDetails();
    await this.setTargetDetails([]);
    let apiData = await this.getFreightAndProposal();
    apiData.subscribe({
      next: async results => {
        this.freightCurrentDetails = results[0];
        this.proposalList = results[1];
        this.scenariosDisplayed[0].freightTargetDetails = results[2];
        this.scenariosDisplayed[0].proposalList = results[3];
        if (this.scenariosDisplayed.length > 1) {
          this.scenariosDisplayed[1].freightTargetDetails = results[4];
          this.scenariosDisplayed[1].proposalList = results[5];
        }
        this.proposalList.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.airProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.groundProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtProposalList.push(dataNew);
          }
          else {
            this.intlProposalList.push(dataNew);
          }
        });
        this.scenariosDisplayed[0].proposalList.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.scenariosDisplayed[0].airProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.scenariosDisplayed[0].groundProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.scenariosDisplayed[0].hwtProposalList.push(dataNew);
          }
          else {
            this.scenariosDisplayed[0].intlProposalList.push(dataNew);
          }
        });
        if (this.scenariosDisplayed.length > 1) {
          this.scenariosDisplayed[1].proposalList.forEach((dataNew: any) => {
            if ((dataNew.serviceType).toLowerCase() == 'air') {
              this.scenariosDisplayed[1].airProposalList.push(dataNew);
            }
            else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
              this.scenariosDisplayed[1].groundProposalList.push(dataNew);
            }
            else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
              this.scenariosDisplayed[1].hwtProposalList.push(dataNew);
            }
            else {
              this.scenariosDisplayed[1].intlProposalList.push(dataNew);
            }
          });
        }
        this.scenariosDisplayed.forEach((data: any) => this.targetIdList.push(data.targetId));
        let proposalFreightData = await this.getAccessorialDimAndMin();
        proposalFreightData.subscribe({
          next: async accResults => {

            this.dimFactorList = accResults[0];
            this.minimumReductionList = accResults[1];
            this.accessorialCurrentDetails = accResults[2];
            this.scenariosDisplayed[0].accessorialTargetDetails = accResults[3];

            if (this.scenariosDisplayed.length > 1) {
              this.scenariosDisplayed[1].accessorialTargetDetails = accResults[4];
            }


            if (this.currentDIMTable != "") {
              this.dimFactorList.forEach((dimData: any) => {
                let rowNumber = this.currentDimList.findIndex((currentDimData: any) => currentDimData.criteria == dimData.criteria && currentDimData.serviceGrouping == dimData.serviceGrouping);
                if (rowNumber != -1) {
                  dimData.baselineDimFactor = this.currentDimList[rowNumber].targetDimDivisor;
                }
              })
            }

            let proposalData = await this.getProposalData();

            proposalData.subscribe({
              next: async proposalResults => {

                this.dimProposalList = (proposalResults[0] as any).filter((value: any) => value.category == 'Proposed');
                this.accessorialProposalList = proposalResults[1];

                this.scenariosDisplayed[0].dimProposalList = (proposalResults[2] as any).filter((value: any) => value.category == 'Proposed');
                this.scenariosDisplayed[0].accessorialProposalList = proposalResults[3];


                if (this.scenariosDisplayed.length > 1) {
                  this.scenariosDisplayed[1].dimProposalList = (proposalResults[4] as any).filter((value: any) => value.category == 'Proposed');
                  this.scenariosDisplayed[1].accessorialProposalList = proposalResults[5];
                }

                await this.getDistinctServices();

                this.columnsDimFactor.set([]);
                this.displayedColumnsDIM = [];
                this.columnsMinReduction.set([]);
                this.displayedColumnsMin = [];
                this.dataSourceDimFactor = [];
                this.dataSourceMinReduction = [];
                await this.getData();
                await this.gridViewfunction();
                await this.setColumnNames();
                await this.setColumn();
                this.loaded = true;
                this.scenariosDisplayed[0].loaded = true;
                if (this.scenariosDisplayed.length > 1) {
                  this.scenariosDisplayed[1].loaded = true;
                }
                let clientName: string = this.selectedCarrierSignal().clientName;
                this.cookiesService.setCookieItem('targetClientName', clientName);
                this.cookiesService.setCookieItem('targetIdList', this.targetIdList.toString());
                this.closeLoading();
              }
            });
          }
        });
      }
    });
    window.onbeforeunload = () => this.onReload();
  }

  async setCarrier() {

    var clientData: any = {};
    this.carrierAvailability = [];
    this.carrierAvailabilitySignal.set([]);
    clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
    var carrierData = await this.httpclient.fetchGRIClientDetails(clientData).toPromise();
    carrierData.forEach((data: any) => {
      if (data.carrierName.toLowerCase() == "fedex") {
        this.fedexClientId = data.clientId;
      }
      if (data.carrierName.toLowerCase() == "ups") {
        this.upsClientId = data.clientId;
      }
      var carrierDetails =
      {
        carrierName: data.carrierName, carrierValue: data.carrierName.toLowerCase(), year: data.year, agreementNo: data.agreementNo,
        isAvailable: data.available, defaultSelection: false, dateRange: data.dateRange, clientName: data.clientName,
      }
      this.carrierAvailability.push(carrierDetails);

    });
    var carrierCheck = false;

    this.carrierAvailability.forEach((element: any) => {
      if (element.carrierValue.toLowerCase() == this.defaultCarrier.toLowerCase() && element.isAvailable == true) {
        carrierCheck = true;
      }
    });
    if (carrierCheck == false || this.carrierAvailability.length == 0) {

      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = 'page-dark'
      }
      var alertDialog = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        panelClass: panelClass,
        data: { pageValue: "There is currently no data available for this particular report" },
      });
      alertDialog.afterClosed().subscribe(() => {
        this.router.navigate(['/dashboard/dashboard']);
      });
    }
    for (let row = 0; row < this.carrierAvailability.length; row++) {
      if (this.carrierAvailability[row].isAvailable == true && this.carrierAvailability[row].carrierName == this.defaultCarrier) {
        this.carrierAvailability[row].defaultSelection = true;
        this.selectedCarrier['carrierName'] = this.carrierAvailability[row].carrierName;
        this.selectedCarrier['dateRange'] = this.carrierAvailability[row].dateRange;
        this.selectedCarrier['clientName'] = this.carrierAvailability[row].clientName;
        this.selectedCarrier['year'] = this.carrierAvailability[row].year;
        this.selectedCarrier['agreementNo'] = this.carrierAvailability[row].agreementNo;
        const startDateStr = this.selectedCarrier['dateRange'].split(' to ')[0];
        const [month, day, year] = startDateStr.split('-').map(Number);
        this.selectedCarrier['fromYear'] = new Date(year, month - 1, day);
        const endDateStr = this.selectedCarrier['dateRange'].split(' to ')[1];
        const [month1, day1, year1] = endDateStr.split('-').map(Number);
        this.selectedCarrier['toYear'] = new Date(year1, month1 - 1, day1);
        this.selectedCarrierSignal.set(this.selectedCarrier);
        break;
      }
    }
    this.carrierAvailabilitySignal.set(this.carrierAvailability);
    this.carrierName = this.selectedCarrier.carrierName.toUpperCase();
  }
  async onCarrierChange(event: any) {
    this.openLoading();
    this.chargetypevalue.set(event.toLowerCase());
    if (event.toLowerCase() == 'ups') {
      this.cookiesService.setCookieItem('clientId', this.upsClientId);
    }
    else {
      this.cookiesService.setCookieItem('clientId', this.fedexClientId);
    }
    this.dataSourceAir = new MatTableDataSource([])
    this.dataSourceGround = new MatTableDataSource([]);
    this.dataSourceIntl = new MatTableDataSource([]);
    this.dataSourceHWT = new MatTableDataSource([]);
    this.dataSourceAcc = new MatTableDataSource([]);
    this.dataSourceCurrentAirTotal = new MatTableDataSource([]);
    this.dataSourceCurrentGroundTotal = new MatTableDataSource([]);
    this.dataSourceCurrentIntlTotal = new MatTableDataSource([]);
    this.dataSourceCurrentHWTTotal = new MatTableDataSource([]);
    this.dataSourceCurrentAccTotal = new MatTableDataSource([]);
    this.totalCurrentSpend = 0;
    this.totalFreightSpend = 0;
    this.totalAccSpend = 0;
    this.targetIdList = [];
    this.currentDIMTable = "";
    this.currentTier = '';
    await this.resetAllList();
    var carrierData = await this.carrierAvailability.filter((data: any) => data.carrierName == event);
    this.selectedCarrier['carrierName'] = await carrierData[0].carrierName;
    this.selectedCarrier['dateRange'] = await carrierData[0].dateRange;
    this.selectedCarrier['year'] = await carrierData[0].year;
    this.selectedCarrier['agreementNo'] = carrierData[0].agreementNo;
    const startDateStr = this.selectedCarrier['dateRange'].split(' to ')[0];
    const [day, month, year] = startDateStr.split('-').map(Number);
    this.selectedCarrier['fromYear'] = new Date(year, month - 1, day);
    const endDateStr = this.selectedCarrier['dateRange'].split(' to ')[1];
    const [day1, month1, year1] = endDateStr.split('-').map(Number);
    this.selectedCarrier['toYear'] = new Date(year1, month1 - 1, day1);
    this.carrierName = this.selectedCarrier.carrierName.toUpperCase();
    this.selectedCarrierSignal.set(this.selectedCarrier);
    await this.getTargetDetails();
    await this.setTargetDetails([]);
    let apiData = await this.getFreightAndProposal();
    apiData.subscribe({
      next: async results => {
        this.freightCurrentDetails = results[0];
        this.proposalList = results[1];
        this.scenariosDisplayed[0].freightTargetDetails = results[2];
        this.scenariosDisplayed[0].proposalList = results[3];
        if (this.scenariosDisplayed.length > 1) {
          this.scenariosDisplayed[1].freightTargetDetails = results[4];
          this.scenariosDisplayed[1].proposalList = results[5];
        }
        this.proposalList.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.airProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.groundProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtProposalList.push(dataNew);
          }
          else {
            this.intlProposalList.push(dataNew);
          }
        });
        this.scenariosDisplayed[0].proposalList.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.scenariosDisplayed[0].airProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.scenariosDisplayed[0].groundProposalList.push(dataNew);
          }

          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.scenariosDisplayed[0].hwtProposalList.push(dataNew);
          }
          else {
            this.scenariosDisplayed[0].intlProposalList.push(dataNew);
          }
        });
        if (this.scenariosDisplayed.length > 1) {
          this.scenariosDisplayed[1].proposalList.forEach((dataNew: any) => {
            if ((dataNew.serviceType).toLowerCase() == 'air') {
              this.scenariosDisplayed[1].airProposalList.push(dataNew);
            }
            else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
              this.scenariosDisplayed[1].groundProposalList.push(dataNew);
            }
            else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
              this.scenariosDisplayed[1].hwtProposalList.push(dataNew);
            }
            else {
              this.scenariosDisplayed[1].intlProposalList.push(dataNew);
            }
          });
        }
        this.scenariosDisplayed.forEach((data: any) => this.targetIdList.push(data.targetId));
        let proposalFreightData = await this.getAccessorialDimAndMin();
        proposalFreightData.subscribe({
          next: async accResults => {
            this.dimFactorList = accResults[0];
            this.minimumReductionList = accResults[1];
            this.accessorialCurrentDetails = accResults[2];
            this.scenariosDisplayed[0].accessorialTargetDetails = accResults[3];
            if (this.scenariosDisplayed.length > 1) {
              this.scenariosDisplayed[1].accessorialTargetDetails = accResults[4];
            }
            if (this.currentDIMTable != "") {
              this.dimFactorList.forEach((dimData: any) => {
                let rowNumber = this.currentDimList.findIndex((currentDimData: any) => currentDimData.criteria == dimData.criteria && currentDimData.serviceGrouping == dimData.serviceGrouping);
                if (rowNumber != -1) {
                  dimData.baselineDimFactor = this.currentDimList[rowNumber].targetDimDivisor;
                }
              })
            }
            let proposalData = await this.getProposalData();
            proposalData.subscribe({
              next: async proposalResults => {
                this.dimProposalList = (proposalResults[0] as any).filter((value: any) => value.category == 'Proposed');
                this.accessorialProposalList = proposalResults[1];
                this.scenariosDisplayed[0].dimProposalList = (proposalResults[2] as any).filter((value: any) => value.category == 'Proposed');
                this.scenariosDisplayed[0].accessorialProposalList = proposalResults[3];
                if (this.scenariosDisplayed.length > 1) {
                  this.scenariosDisplayed[1].dimProposalList = (proposalResults[4] as any).filter((value: any) => value.category == 'Proposed');
                  this.scenariosDisplayed[1].accessorialProposalList = proposalResults[5];
                }
                await this.getDistinctServices();
                this.columnsDimFactor.set([]);
                this.displayedColumnsDIM = [];
                this.columnsMinReduction.set([]);;
                this.displayedColumnsMin = [];
                this.dataSourceDimFactor = [];
                this.dataSourceMinReduction = [];
                await this.getData();
                await this.gridViewfunction();
                await this.setColumnNames();
                await this.setColumn();
                this.loaded = true;
                this.scenariosDisplayed[0].loaded = true;
                if (this.scenariosDisplayed.length > 1) {
                  this.scenariosDisplayed[1].loaded = true;
                }
                if (this.themeoption == "dark") {
                  this.panelClass = 'page-dark';
                }
                else {
                  this.panelClass = 'custom-dialog-panel-class';
                }
                this.carrierName = this.selectedCarrier.carrierName.toUpperCase();
                let clientName: string = this.selectedCarrier.clientName;
                this.cookiesService.setCookieItem('targetClientName', clientName);
                this.cookiesService.setCookieItem('targetIdList', this.targetIdList.toString());
                this.closeLoading();
              }
            });
          }
        });
      }
    });
  }
  async getTargetDetails() {
    let targetIdList = [];
    this.scenariosDisplayed.forEach((scenario: any) => targetIdList.push(scenario.targetId));
    var clientDetail: any = {};
    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
      clientDetail['clientId'] = this.fedexClientId;
      var targetDetails = await this.fedexService.fetchGRITargetDetails(clientDetail).toPromise();
      targetDetails.forEach((element: any) => {
        if (!this.availableIdList.includes(element.targetId)) {
          let rowNumber = this.scenariosDisplayed.findIndex((scenario: any) => scenario.targetId == element.targetId);
          this.totalScenarios.push(
            {
              targetId: element.targetId,
              targetName: element.targetName,
              targetNickName: element.targetNickName,
              carrierName: element.carrierName,
              agreementNo: element.agreementNo,
              year: element.year,
              totalNetSpend: 0,
              totalFreightSpend: 0,
              totalAccSpend: 0,
              totalSavings: 0,
              totalSavingsPercent: 0,
              totalNetSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalNetSpendOld : 0,
              totalFreightSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalFreightSpendOld : 0,
              totalAccSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalAccSpendOld : 0,
              totalSavingsPercentOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalSavingsPercentOld : 0,
              totalFreightSavings: 0,
              totalFreightSavingsPercent: 0,
              totalAccSavings: 0,
              totalAccSavingsPercent: 0,
              totalFreightSavingsOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalFreightSavingsOld : 0,
              totalFreightSavingsPercentOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalFreightSavingsPercentOld : 0,
              totalAccSavingsOld: 0,
              totalAccSavingsPercentOld: 0,
              dataSourceAirTarget: new MatTableDataSource(),
              dataSourceGroundTarget: new MatTableDataSource(),
              dataSourceIntlTarget: new MatTableDataSource(),
              dataSourceHWTTarget: new MatTableDataSource(),
              dataSourceAccTarget: new MatTableDataSource(),
              dataSourceTargetAirTotal: new MatTableDataSource(),
              dataSourceTargetGroundTotal: new MatTableDataSource(),
              dataSourceTargetIntlTotal: new MatTableDataSource(),
              dataSourceTargetHWTTotal: new MatTableDataSource(),
              dataSourceTargetAccTotal: new MatTableDataSource(),
              targetAirListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetAirListOld : [],
              targetGroundListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetGroundListOld : [],
              targetIntlListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetIntlListOld : [],
              targetHWTListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetHWTListOld : [],
              targetAccListOld: [],
              targetAirListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetAirListTotalOld : [],
              targetGroundListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetGroundListTotalOld : [],
              targetIntlListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetIntlListTotalOld : [],
              targetHWTListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetHWTListTotalOld : [],
              targetAccListTotalOld: [],
              freightTargetDetails: [],
              freightTargetDetailsOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].freightTargetDetailsOld : [],
              accessorialTargetDetails: [],
              airSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              groundSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              intlSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              hwtSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              accSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              currentColumnDefinitionsTarget: [
                { def: 'targetPercent', label: (element.targetId == 0) ? element.carrierName + ' Discount' : element.targetNickName + ' %', hide: false },
                { def: 'targetSpend', label: (element.targetId == 0) ? element.year + ' Calculation Spend' : element.targetNickName + ' Spend', hide: false },
                { def: 'savingsAmount', label: 'Projected Increase', hide: false },
                { def: 'targetSavingsPercent', label: 'Projected Increase%', hide: false }
              ],
              columnsTarget: [
                { field: (element.targetId == 0) ? element.carrierName + ' Discount' : element.targetNickName + ' %', fieldVal: 'targetPercent' },
                { field: (element.targetId == 0) ? element.year + ' Calculated Spend' : element.targetNickName + ' Spend', fieldVal: 'targetSpend' },
                { field: 'Projected Increase', fieldVal: 'savingsAmount' },
                { field: 'Projected Increase %', fieldVal: 'targetSavingsPercent' }
              ],
              gridviewColTargetformGroup: new FormGroup({
                targetPercent: new FormControl(true),
                targetSpend: new FormControl(true),
                savingsAmount: new FormControl(true),
                targetSavingsPercent: new FormControl(true)
              }),
              displayedColumnsTarget: ['targetPercent', 'targetSpend', 'savingsAmount', 'targetSavingsPercent'],
              airMinMaxList: [],
              groundMinMaxList: [],
              intlMinMaxList: [],
              hwtMinMaxList: [],
              accMinMaxList: [],
              airMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].airMinMaxListOld : [],
              groundMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].groundMinMaxListOld : [],
              intlMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].intlMinMaxListOld : [],
              hwtMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].hwtMinMaxListOld : [],
              accMinMaxListOld: [],
              distinctAirServices: [],
              distinctGroundServices: [],
              distinctIntlServices: [],
              distinctHWTServices: [],
              distinctAccServices: [],
              distinctAirServiceName: [],
              distinctGroundServiceName: [],
              distinctIntlServiceName: [],
              distinctHWTServiceName: [],
              distinctAccServiceName: [],
              distinctAirExcelServiceName: [],
              distinctGroundExcelServiceName: [],
              distinctIntlExcelServiceName: [],
              distinctHWTExcelServiceName: [],
              distinctAccExcelServiceName: [],
              distinctGroundNewService: [],
              targetSavingsGroundSubTotalList: [],
              targetSavingsGroundSubTotalListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetSavingsGroundSubTotalListOld : [],
              targetTier: '',
              hwtTier: ['1', '2', '3', '4', '5', '6', '7'],
              targetAccCheckList: [],
              targetAccCheckListOld: [],
              proposalList: [],
              airProposalList: [],
              groundProposalList: [],
              hwtProposalList: [],
              intlProposalList: [],
              dimProposalList: [],
              accessorialProposalList: [],
              loaded: false,

            }
          );
          this.availableIdList.push(element.targetId);
        }
      });
    }
    else {
      clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
      var targetDetails = await this.httpclient.fetchGRITargetDetails(clientDetail).toPromise();
      targetDetails.forEach((element: any) => {
        if (!this.availableIdList.includes(element.targetId)) {
          let rowNumber = this.scenariosDisplayed.findIndex((scenario: any) => scenario.targetId == element.targetId);
          this.totalScenarios.push(
            {
              targetId: element.targetId,
              targetName: element.targetName,
              targetNickName: element.targetNickName,
              carrierName: element.carrierName,
              agreementNo: element.agreementNo,
              year: element.year,

              totalNetSpend: 0,
              totalFreightSpend: 0,
              totalAccSpend: 0,
              totalSavings: 0,
              totalSavingsPercent: 0,

              totalNetSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalNetSpendOld : 0,
              totalFreightSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalFreightSpendOld : 0,
              totalAccSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalAccSpendOld : 0,
              totalSavingsOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalSavingsOld : 0,
              totalSavingsPercentOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalSavingsPercentOld : 0,

              totalFreightSavings: 0,
              totalFreightSavingsPercent: 0,

              totalAccSavings: 0,
              totalAccSavingsPercent: 0,

              totalFreightSavingsOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalFreightSavingsOld : 0,
              totalFreightSavingsPercentOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalFreightSavingsPercentOld : 0,

              totalAccSavingsOld: 0,
              totalAccSavingsPercentOld: 0,

              dataSourceAirTarget: new MatTableDataSource(),
              dataSourceGroundTarget: new MatTableDataSource(),
              dataSourceIntlTarget: new MatTableDataSource(),
              dataSourceHWTTarget: new MatTableDataSource(),
              dataSourceAccTarget: new MatTableDataSource(),

              dataSourceTargetAirTotal: new MatTableDataSource(),
              dataSourceTargetGroundTotal: new MatTableDataSource(),
              dataSourceTargetIntlTotal: new MatTableDataSource(),
              dataSourceTargetHWTTotal: new MatTableDataSource(),
              dataSourceTargetAccTotal: new MatTableDataSource(),

              targetAirListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetAirListOld : [],
              targetGroundListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetGroundListOld : [],
              targetIntlListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetIntlListOld : [],
              targetHWTListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetHWTListOld : [],
              targetAccListOld: [],

              targetAirListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetAirListTotalOld : [],
              targetGroundListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetGroundListTotalOld : [],
              targetIntlListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetIntlListTotalOld : [],
              targetHWTListTotalOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetHWTListTotalOld : [],
              targetAccListTotalOld: [],

              freightTargetDetails: [],
              freightTargetDetailsOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].freightTargetDetailsOld : [],
              accessorialTargetDetails: [],

              airSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              groundSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              intlSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              hwtSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },
              accSortIcons: { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" },

              currentColumnDefinitionsTarget: [
                { def: 'targetPercent', label: (element.targetId == 0) ? 'UPS Discount' : element.targetNickName + ' %', hide: false },
                { def: 'targetSpend', label: (element.targetId == 0) ? element.year + ' Calculation Spend' : element.targetNickName + ' Spend', hide: false },
                { def: 'savingsAmount', label: 'Projected Increase', hide: false },
                { def: 'targetSavingsPercent', label: 'Projected Increase%', hide: false }
              ],

              columnsTarget: [
                { field: (element.targetId == 0) ? 'UPS Discount' : element.targetNickName + ' %', fieldVal: 'targetPercent' },
                { field: (element.targetId == 0) ? element.year + ' Calculated Spend' : element.targetNickName + ' Spend', fieldVal: 'targetSpend' },
                { field: 'Projected Increase', fieldVal: 'savingsAmount' },
                { field: 'Projected Increase %', fieldVal: 'targetSavingsPercent' }
              ],
              gridviewColTargetformGroup: new FormGroup({
                targetPercent: new FormControl(true),
                targetSpend: new FormControl(true),
                savingsAmount: new FormControl(true),
                targetSavingsPercent: new FormControl(true)
              }),
              displayedColumnsTarget: ['targetPercent', 'targetSpend', 'savingsAmount', 'targetSavingsPercent'],

              airMinMaxList: [],
              groundMinMaxList: [],
              intlMinMaxList: [],
              hwtMinMaxList: [],
              accMinMaxList: [],

              airMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].airMinMaxListOld : [],
              groundMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].groundMinMaxListOld : [],
              intlMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].intlMinMaxListOld : [],
              hwtMinMaxListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].hwtMinMaxListOld : [],
              accMinMaxListOld: [],

              distinctAirServices: [],
              distinctGroundServices: [],
              distinctIntlServices: [],
              distinctHWTServices: [],
              distinctAccServices: [],

              distinctAirServiceName: [],
              distinctGroundServiceName: [],
              distinctIntlServiceName: [],
              distinctHWTServiceName: [],
              distinctAccServiceName: [],

              distinctAirExcelServiceName: [],
              distinctGroundExcelServiceName: [],
              distinctIntlExcelServiceName: [],
              distinctHWTExcelServiceName: [],
              distinctAccExcelServiceName: [],

              distinctGroundNewService: [],

              targetSavingsGroundSubTotalList: [],
              targetSavingsGroundSubTotalListOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].targetSavingsGroundSubTotalListOld : [],
              targetTier: '',
              hwtTier: ['1', '2', '3', '4', '5', '6', '7'],
              targetAccCheckList: [],
              targetAccCheckListOld: [],
              proposalList: [],
              airProposalList: [],
              groundProposalList: [],
              hwtProposalList: [],
              intlProposalList: [],
              dimProposalList: [],
              accessorialProposalList: [],
              loaded: false

            }
          );
          this.availableIdList.push(element.targetId);
        }
      });
    }
    this.selectedCategory.set('ALL');
  }

  async setTargetDetails(targetIdList: any) {
    this.selectedScenarios = [];
    var defaultLength = 0;
    if (this.totalScenarios.length < 2) {
      defaultLength = this.totalScenarios.length;
    }
    else {
      defaultLength = 2;
    }
    if (targetIdList.length == 0) {
      for (let index = 0; index < defaultLength; index++) {
        this.scenariosDisplayed.push(this.totalScenarios[index]);
        this.selectedScenarios.push(this.totalScenarios[index].targetId);
        if (!this.allIdList.includes(this.totalScenarios[index].targetId)) {
          this.allIdList.push(this.totalScenarios[index].targetId);
        }
        if (!this.loadedIdList.includes(this.totalScenarios[index].targetId)) {
          this.loadedIdList.push(this.totalScenarios[index].targetId);
        }
        await this.gridViewfunctionTarget(this.totalScenarios[index]);
      }
    }
    else if (targetIdList.length == 2) {
      for (let index = 0; index < targetIdList.length; index++) {
        var rowNumber = this.totalScenarios.findIndex((data: any) => data.targetId == targetIdList[index]);
        this.scenariosDisplayed.push(this.totalScenarios[rowNumber]);
        this.selectedScenarios.push(this.totalScenarios[rowNumber].targetId);
        if (!this.allIdList.includes(this.totalScenarios[rowNumber].targetId)) {
          this.allIdList.push(this.totalScenarios[rowNumber].targetId);
        }
        if (!this.loadedIdList.includes(this.totalScenarios[rowNumber].targetId)) {
          this.loadedIdList.push(this.totalScenarios[rowNumber].targetId);
        }
        await this.gridViewfunctionTarget(this.totalScenarios[rowNumber]);
      }
    }
    else if (targetIdList.length == 1) {
      var rowNumber = this.totalScenarios.findIndex((data: any) => data.targetId == targetIdList[0]);
      this.scenariosDisplayed.push(this.totalScenarios[rowNumber]);
      this.selectedScenarios.push(this.totalScenarios[rowNumber].targetId);
      if (!this.allIdList.includes(this.totalScenarios[rowNumber].targetId)) {
        this.allIdList.push(this.totalScenarios[rowNumber].targetId);
      }
      if (!this.loadedIdList.includes(this.totalScenarios[rowNumber].targetId)) {
        this.loadedIdList.push(this.totalScenarios[rowNumber].targetId);
      }
      await this.gridViewfunctionTarget(this.totalScenarios[rowNumber]);
    }
    this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
  }

  async getDistinctServices() {
    this.distinctAirServices = [];
    this.distinctGroundServices = [];
    this.distinctIntlServices = [];
    this.distinctHWTServices = [];
    this.distinctAccServices = [];
    this.distinctAirServiceName = [];
    this.distinctGroundServiceName = [];
    this.distinctIntlServiceName = [];
    this.distinctHWTServiceName = [];
    this.distinctAccServiceName = [];
    this.distinctAirExcelServiceName = [];
    this.distinctGroundExcelServiceName = [];
    this.distinctIntlExcelServiceName = [];
    this.distinctHWTExcelServiceName = [];
    this.distinctAccExcelServiceName = [];
    this.distinctGroundNewService = [];
    this.freightCurrentDetails.forEach((data: any, index: any) => {
      if ((data.serviceGrouping).toLowerCase() == 'air') {
        if (!(this.distinctAirServices.includes(data.service))) {
          this.distinctAirServices.push(data.service);
          this.distinctAirServiceName.push(data.serviceName);
          this.distinctAirExcelServiceName.push(data.finalService);
        }
      }
      else if ((data.serviceGrouping).toLowerCase() == 'ground' || (data.serviceGrouping).toLowerCase() == 'home delivery' || (data.serviceGrouping).toLowerCase() == 'smartpost' || (data.serviceGrouping).toLowerCase() == 'ground economy') {
        if (!(this.distinctGroundServices.includes(data.service))) {
          this.distinctGroundServices.push(data.service);
          this.distinctGroundServiceName.push(data.serviceName);
          this.distinctGroundExcelServiceName.push(data.finalService);
          this.distinctGroundNewService.push(data.newService);
        }
      }
      else if ((data.serviceGrouping).toLowerCase() == 'hwt') {
        if (!(this.distinctHWTServices.includes(data.service))) {
          this.distinctHWTServices.push(data.service);
          this.distinctHWTServiceName.push(data.serviceName);
          this.distinctHWTExcelServiceName.push(data.finalService);
        }
      }
      else {
        if (!(this.distinctIntlServices.includes(data.service))) {
          this.distinctIntlServices.push(data.service);
          this.distinctIntlServiceName.push(data.serviceName);
          this.distinctIntlExcelServiceName.push(data.finalService);
        }
      }
    });

    this.distinctAccServices = await this.getUniqueService(this.accessorialCurrentDetails, 'service');
    this.distinctAccServiceName = await this.getUniqueService(this.accessorialCurrentDetails, 'serviceName');
    this.distinctAccExcelServiceName = await this.getUniqueService(this.accessorialCurrentDetails, 'finalService');
    for (let columnNumber in this.scenariosDisplayed) {
      this.scenariosDisplayed[columnNumber].distinctAirServices = [];
      this.scenariosDisplayed[columnNumber].distinctGroundServices = [];
      this.scenariosDisplayed[columnNumber].distinctIntlServices = [];
      this.scenariosDisplayed[columnNumber].distinctHWTServices = [];
      this.scenariosDisplayed[columnNumber].distinctAccServices = [];
      this.scenariosDisplayed[columnNumber].distinctAirServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctGroundServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctIntlServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctHWTServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctAccServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctAirExcelServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctGroundExcelServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctIntlExcelServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctHWTExcelServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctAccExcelServiceName = [];
      this.scenariosDisplayed[columnNumber].distinctGroundNewService = [];
      this.scenariosDisplayed[columnNumber].freightTargetDetails.forEach((data: any, indexes: any) => {
        if ((data.serviceGrouping).toLowerCase() == 'air') {
          if (!(this.scenariosDisplayed[columnNumber].distinctAirServices.includes(data.service))) {
            this.scenariosDisplayed[columnNumber].distinctAirServices.push(data.service);
            this.scenariosDisplayed[columnNumber].distinctAirServiceName.push(data.serviceName);
            this.scenariosDisplayed[columnNumber].distinctAirExcelServiceName.push(data.finalService);
          }
        }
        else if ((data.serviceGrouping).toLowerCase() == 'ground' || (data.serviceGrouping).toLowerCase() == 'home delivery' || (data.serviceGrouping).toLowerCase() == 'smartpost' || (data.serviceGrouping).toLowerCase() == 'ground economy') {
          if (!(this.scenariosDisplayed[columnNumber].distinctGroundServices.includes(data.service))) {
            this.scenariosDisplayed[columnNumber].distinctGroundServices.push(data.service);
            this.scenariosDisplayed[columnNumber].distinctGroundServiceName.push(data.serviceName);
            this.scenariosDisplayed[columnNumber].distinctGroundExcelServiceName.push(data.finalService);
            this.scenariosDisplayed[columnNumber].distinctGroundNewService.push(data.newService);
          }
        }
        else if ((data.serviceGrouping).toLowerCase() == 'hwt') {
          if (!(this.scenariosDisplayed[columnNumber].distinctHWTServices.includes(data.service))) {
            this.scenariosDisplayed[columnNumber].distinctHWTServices.push(data.service);
            this.scenariosDisplayed[columnNumber].distinctHWTServiceName.push(data.serviceName);
            this.scenariosDisplayed[columnNumber].distinctHWTExcelServiceName.push(data.finalService);
          }
        }
        else {
          if (!(this.scenariosDisplayed[columnNumber].distinctIntlServices.includes(data.service))) {
            this.scenariosDisplayed[columnNumber].distinctIntlServices.push(data.service);
            this.scenariosDisplayed[columnNumber].distinctIntlServiceName.push(data.serviceName);
            this.scenariosDisplayed[columnNumber].distinctIntlExcelServiceName.push(data.finalService);
          }
        }
      });

      this.scenariosDisplayed[columnNumber].distinctAccServices = await this.getUniqueService(this.scenariosDisplayed[columnNumber].accessorialTargetDetails, 'service');
      this.scenariosDisplayed[columnNumber].distinctAccServiceName = await this.getUniqueService(this.scenariosDisplayed[columnNumber].accessorialTargetDetails, 'serviceName');
      this.scenariosDisplayed[columnNumber].distinctAccExcelServiceName = await this.getUniqueService(this.scenariosDisplayed[columnNumber].accessorialTargetDetails, 'finalService');
      let toAddIndex = [];
      toAddIndex = [];
      for (let index in this.scenariosDisplayed[columnNumber].distinctAirServices) {
        if (!this.distinctAirServices.includes(this.scenariosDisplayed[columnNumber].distinctAirServices[index])) {
          toAddIndex.push(Number(index));
        }
      }
      for (let id in toAddIndex) {
        this.distinctAirServices.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctAirServices[toAddIndex[id]]);
        this.distinctAirServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctAirServiceName[toAddIndex[id]]);
        this.distinctAirExcelServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctAirExcelServiceName[toAddIndex[id]]);
      }
      toAddIndex = [];
      for (let index in this.scenariosDisplayed[columnNumber].distinctGroundServices) {
        if (!this.distinctGroundServices.includes(this.scenariosDisplayed[columnNumber].distinctGroundServices[index])) {
          toAddIndex.push(Number(index));
        }
      }
      for (let id in toAddIndex) {
        this.distinctGroundServices.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctGroundServices[toAddIndex[id]]);
        this.distinctGroundServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctGroundServiceName[toAddIndex[id]]);
        this.distinctGroundExcelServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctGroundExcelServiceName[toAddIndex[id]]);
        this.distinctGroundNewService.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctGroundNewService[toAddIndex[id]]);
      }
      toAddIndex = [];
      for (let index in this.scenariosDisplayed[columnNumber].distinctIntlServices) {
        if (!this.distinctIntlServices.includes(this.scenariosDisplayed[columnNumber].distinctIntlServices[index])) {
          toAddIndex.push(Number(index));
        }
      }
      for (let id in toAddIndex) {
        this.distinctIntlServices.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctIntlServices[toAddIndex[id]]);
        this.distinctIntlServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctIntlServiceName[toAddIndex[id]]);
        this.distinctIntlExcelServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctIntlExcelServiceName[toAddIndex[id]]);
      }
      toAddIndex = [];
      for (let index in this.scenariosDisplayed[columnNumber].distinctHWTServices) {
        if (!this.distinctHWTServices.includes(this.scenariosDisplayed[columnNumber].distinctHWTServices[index])) {
          toAddIndex.push(Number(index));
        }
      }
      for (let id in toAddIndex) {
        this.distinctHWTServices.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctHWTServices[toAddIndex[id]]);
        this.distinctHWTServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctHWTServiceName[toAddIndex[id]]);
        this.distinctHWTExcelServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctHWTExcelServiceName[toAddIndex[id]]);
      }
      toAddIndex = [];
      for (let index in this.scenariosDisplayed[columnNumber].distinctAccServices) {
        if (!this.distinctAccServices.includes(this.scenariosDisplayed[columnNumber].distinctAccServices[index])) {
          toAddIndex.push(Number(index));
        }
      }
      for (let id in toAddIndex) {
        this.distinctAccServices.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctAccServices[toAddIndex[id]]);
        this.distinctAccServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctAccServiceName[toAddIndex[id]]);
        this.distinctAccExcelServiceName.splice(toAddIndex[id] + 1, 0, this.scenariosDisplayed[columnNumber].distinctAccExcelServiceName[toAddIndex[id]]);
      }
    }

    if (this.currentDIMTable == "") {
      this.distinctHWTServicesOld = [...this.distinctHWTServices];
      this.distinctHWTServiceNameOld = [...this.distinctHWTExcelServiceName];
      this.distinctHWTExcelServiceNameOld = [...this.distinctHWTExcelServiceName];
    }
    else {
      this.distinctHWTServices = [...this.distinctHWTServicesOld];
      this.distinctHWTServiceName = [...this.distinctHWTExcelServiceNameOld];
      this.distinctHWTExcelServiceName = [...this.distinctHWTExcelServiceNameOld];
    }
  }

  async getFreightAndProposal() {

    let observables: Observable<any>[] = [];

    if (this.loaded == false) {
      this.proposalList = [];
      this.airProposalList = [];
      this.groundProposalList = [];
      this.intlMinMaxList = [];
      this.hwtMinMaxList = [];
    }

    if (this.scenariosDisplayed[0].loaded == false) {
      this.scenariosDisplayed[0].proposalList = [];
      this.scenariosDisplayed[0].airProposalList = [];
      this.scenariosDisplayed[0].groundProposalList = [];
      this.scenariosDisplayed[0].intlMinMaxList = [];
      this.scenariosDisplayed[0].hwtMinMaxList = [];
    }

    if (this.scenariosDisplayed.length > 1) {
      if (this.scenariosDisplayed[1].loaded == false) {
        this.scenariosDisplayed[1].proposalList = [];
        this.scenariosDisplayed[1].airProposalList = [];
        this.scenariosDisplayed[1].groundProposalList = [];
        this.scenariosDisplayed[1].intlMinMaxList = [];
        this.scenariosDisplayed[1].hwtMinMaxList = [];
      }
    }

    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.fedexClientId;
        if (this.currentDIMTable == "") {
          observables.push(this.fedexService.fetchGRIFreightDetails(clientDetailcurrent));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.fedexClientId;
          targetObj['carrierName'] = this.carrierName;
          targetObj['type'] = 'Current';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.fedexService.generateProposalFedExCurrentDIMGRI(targetObj));
        }

        let clientObj: any = {};
        clientObj['type'] = 'create';
        clientObj['carrier'] = this.carrierName;
        clientObj['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchGRIfreightEditProposal(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.fedexClientId;
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        if (this.currentDIMTable == "") {
          observables.push(this.fedexService.fetchGRIFreightDetailsTarget(clientDetailtarget1));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.fedexClientId;
          targetObj['targetId'] = this.scenariosDisplayed[0].targetId;
          targetObj['carrierName'] = this.scenariosDisplayed[0].carrierName;
          targetObj['type'] = 'Edit';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.fedexService.generateProposalFedExCurrentDIMGRI(targetObj));
        }

        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.fedexClientId;
        console.log(clientObj1, this.scenariosDisplayed);
        observables.push(this.fedexService.fetchGRIfreightEditProposal(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.fedexClientId;
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          if (this.currentDIMTable == "") {
            observables.push(this.fedexService.fetchGRIFreightDetailsTarget(clientDetailtarget2));
          }
          else {
            let targetObj: any = {};
            targetObj['clientId'] = this.fedexClientId;
            targetObj['targetId'] = this.scenariosDisplayed[1].targetId;
            targetObj['carrierName'] = this.scenariosDisplayed[1].carrierName;
            targetObj['type'] = 'Edit';
            targetObj['dimTableName'] = this.currentDIMTable;
            observables.push(this.fedexService.generateProposalFedExCurrentDIMGRI(targetObj));
          }

          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.fedexClientId;
          console.log(clientObj2, this.scenariosDisplayed);
          observables.push(this.fedexService.fetchGRIfreightEditProposal(clientObj2));
        }
      }

    }
    else {

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
        if (this.currentDIMTable == "") {
          observables.push(this.httpclient.fetchGRIFreightDetails(clientDetailcurrent));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          targetObj['carrierName'] = this.carrierName;
          targetObj['type'] = 'Current';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.httpclient.generateProposalCurrentDIMGRI(targetObj));
        }

        let clientObj: any = {};
        clientObj['type'] = 'create';
        clientObj['carrier'] = this.carrierName;
        clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchGRIfreightEditProposal(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.cookiesService.getCookieItem('clientId');
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        if (this.currentDIMTable == "") {
          observables.push(this.httpclient.fetchGRIFreightDetailsTarget(clientDetailtarget1));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          targetObj['targetId'] = this.scenariosDisplayed[0].targetId;
          targetObj['carrierName'] = this.scenariosDisplayed[0].carrierName;
          targetObj['type'] = 'Edit';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.httpclient.generateProposalCurrentDIMGRI(targetObj));
        }

        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.cookiesService.getCookieItem('clientId');
        console.log(clientObj1, this.scenariosDisplayed)
        observables.push(this.httpclient.fetchGRIfreightEditProposal(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          if (this.currentDIMTable == "") {
            observables.push(this.httpclient.fetchGRIFreightDetailsTarget(clientDetailtarget2));
          }
          else {
            let targetObj: any = {};
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
            targetObj['targetId'] = this.scenariosDisplayed[1].targetId;
            targetObj['carrierName'] = this.scenariosDisplayed[1].carrierName;
            targetObj['type'] = 'Edit';
            targetObj['dimTableName'] = this.currentDIMTable;
            observables.push(this.httpclient.generateProposalCurrentDIMGRI(targetObj));
          }

          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.cookiesService.getCookieItem('clientId');
          console.log(clientObj2, this.scenariosDisplayed)
          observables.push(this.httpclient.fetchGRIfreightEditProposal(clientObj2));
        }
      }

    }
    return forkJoin(observables);
  }

  async getAccessorialDimAndMin() {

    let observables: Observable<any>[] = [];

    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {

      var clientDetailDimandMin: any = {};
      clientDetailDimandMin['clientId'] = this.fedexClientId;
      clientDetailDimandMin['targetId'] = this.targetIdList.toString();
      observables.push(this.fedexService.fetchGRIDimFactorDetails(clientDetailDimandMin));
      observables.push(this.fedexService.fetchGRIMinDetails(clientDetailDimandMin));

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchGRIAccessorialDetails(clientDetailcurrent));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.fedexClientId;
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        observables.push(this.fedexService.fetchGRIAccessorialDetailsTarget(clientDetailtarget1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.fedexClientId;
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          observables.push(this.fedexService.fetchGRIAccessorialDetailsTarget(clientDetailtarget2));
        }
      }

    }
    else {

      var clientDetailDimandMin: any = {};
      clientDetailDimandMin['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientDetailDimandMin['targetId'] = this.targetIdList.toString();
      observables.push(this.httpclient.fetchGRIDimFactorDetails(clientDetailDimandMin));
      observables.push(this.httpclient.fetchGRIMinDetails(clientDetailDimandMin));

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchGRIAccessorialDetails(clientDetailcurrent));
      }
      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.cookiesService.getCookieItem('clientId');
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        observables.push(this.httpclient.fetchGRIAccessorialDetailsTarget(clientDetailtarget1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          observables.push(this.httpclient.fetchGRIAccessorialDetailsTarget(clientDetailtarget2));
        }
      }

    }
    return forkJoin(observables);
  }

  async getProposalData() {

    let observables: Observable<any>[] = [];

    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {

      //proposal List
      if (this.loaded == false) {
        let clientObj: any = {};
        clientObj['type'] = 'create';
        clientObj['carrier'] = this.carrierName;
        clientObj['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchGRIDimFactor(clientObj));
        observables.push(this.fedexService.fetchGRIAccDetailsPopup(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchGRIDimFactor(clientObj1));
        observables.push(this.fedexService.fetchGRIAccDetailsPopup(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.fedexClientId;
          observables.push(this.fedexService.fetchGRIDimFactor(clientObj2));
          observables.push(this.fedexService.fetchGRIAccDetailsPopup(clientObj2));
        }
      }
    }
    else {

      //proposal List
      if (this.loaded == false) {
        let clientObj: any = {};
        clientObj['type'] = 'create';
        clientObj['carrier'] = this.carrierName;
        clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchGRIDimFactor(clientObj));
        observables.push(this.httpclient.fetchGRIAccDetailsPopup(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchGRIDimFactor(clientObj1));
        observables.push(this.httpclient.fetchGRIAccDetailsPopup(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.cookiesService.getCookieItem('clientId');
          observables.push(this.httpclient.fetchGRIDimFactor(clientObj2));
          observables.push(this.httpclient.fetchGRIAccDetailsPopup(clientObj2));
        }
      }

    }
    return forkJoin(observables);

  }
  async getData() {

    this.openLoading();
    var clientDetail: any = {};

    this.toggleClicked = false;
    this.isAccServiceAvailable = false;
    this.distinctGroundServicesWithWeight = [];
    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {

      //===> FreightDetails 
      //Push data into currentsavings Airlist
      for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
        await this.filterAirIntlHWTData(serviceIndex, this.distinctAirServices[serviceIndex], this.freightCurrentDetails, 'air', this.distinctAirServiceName[serviceIndex], this.distinctAirExcelServiceName[serviceIndex]);
      }

      let rowNumber = 0;
      //push data into currentsavings GroundList
      for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {

        if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
          await this.filterGroundData(1, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
          await this.filterGroundData(1, 2000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase() == "ground commercial" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground residential" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground returns" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "home delivery" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground - return") {
          await this.filterGroundData(0, 5, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(6, 10, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(11, 20, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(21, 30, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(31, 50, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(51, 70, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(71, 150, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(151, '', serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber += 8;
        }
        else {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        rowNumber = await this.calculateGroundSubTotal(this.currentSavingsGroundList, this.distinctGroundServices[serviceIndex], rowNumber);
      }


      //push data into currentsavings IntlList
      for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
        await this.filterAirIntlHWTData(serviceIndex, this.distinctIntlServices[serviceIndex], this.freightCurrentDetails, 'intl', this.distinctIntlServiceName[serviceIndex], this.distinctIntlExcelServiceName[serviceIndex]);
      }

      //push data into currentsavings hwtList

      if (this.currentDIMTable == "") {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTData(serviceIndex, this.distinctHWTServices[serviceIndex], this.freightCurrentDetails, 'hwt', this.distinctHWTServiceName[serviceIndex], this.distinctHWTExcelServiceName[serviceIndex]);
        }
      }
      else {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTData(serviceIndex, this.distinctHWTServices[serviceIndex], this.freightCurrentDetailsOld, 'hwt', this.distinctHWTServiceName[serviceIndex], this.distinctHWTExcelServiceName[serviceIndex]);
        }
      }


      this.currentSavingsAirList = this.currentSavingsAirList.filter(
        (airData: any) => this.distinctAirServices.includes(airData.service)
      );

      this.currentSavingsGroundList = this.currentSavingsGroundList.filter(
        (groundData: any) => this.distinctGroundServices.includes(groundData.service)
      );

      this.currentSavingsIntlList = this.currentSavingsIntlList.filter(
        (IntlData: any) => this.distinctIntlServices.includes(IntlData.service)
      );

      this.currentSavingsHWTList = this.currentSavingsHWTList.filter(
        (HWTData: any) => this.distinctHWTServices.includes(HWTData.service)
      );

      //set tier
      var tier = await this.setHWTMinMax('current');
      this.currentTier = tier;
      if (!this.hwtTier.includes(tier)) this.hwtTier.unshift(tier);

      if (!this.loaded) {
        this.calculateFreightCurrentTotal();
      }
      this.getInitRowSpan();

      for (let index = 0; index < this.currentSavingsGroundList.length; index++) {
        this.distinctGroundServicesWithWeight[index] = this.currentSavingsGroundList[index].service + this.currentSavingsGroundList[index].weightRange;
        this.distinctWeights[index] = this.currentSavingsGroundList[index].weightRange;
      }

      await this.setMinMax("air");
      await this.setMinMax("ground");
      await this.setMinMax("intl");
      await this.setMinMax("hwt");

      if (this.distinctAirServices.length > 0) {
        this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
      }
      else {
        this.dataSourceAir = new MatTableDataSource([]);
        this.currentSavingsAirList = [];
      }

      if (this.distinctGroundServices.length > 0) {
        this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
      }
      else {
        this.dataSourceGround = new MatTableDataSource([]);
        this.currentSavingsGroundList = [];
      }

      if (this.distinctIntlServices.length > 0) {
        this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
      }
      else {
        this.dataSourceIntl = new MatTableDataSource([]);
        this.currentSavingsIntlList = [];
      }

      if (this.distinctHWTServices.length > 0) {
        this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);
      }
      else {
        this.dataSourceHWT = new MatTableDataSource([]);
        this.currentSavingsHWTList = []
      }

      await this.getAccData();
    }
    else {

      //Push data into currentsavings Airlist
      for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
        await this.filterAirIntlHWTData(serviceIndex, this.distinctAirServices[serviceIndex], this.freightCurrentDetails, 'air', this.distinctAirServiceName[serviceIndex], this.distinctAirExcelServiceName[serviceIndex]);
      }
      //push data into currentsavings GroundList
      let rowNumber = 0;
      for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {

        if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
          await this.filterGroundData(1, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
          await this.filterGroundData(1, 2000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase() == "ground commercial" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground residential" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground returns" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "home delivery" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground - return") {
          await this.filterGroundData(0, 5, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(6, 10, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(11, 20, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(21, 30, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(31, 50, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(51, 70, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(71, 150, serviceIndex, this.freightCurrentDetails, rowNumber);
          await this.filterGroundData(151, '', serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber += 8;
        }
        else {
          await this.filterGroundData(0, 1000, serviceIndex, this.freightCurrentDetails, rowNumber);
          rowNumber++;
        }
        rowNumber = await this.calculateGroundSubTotal(this.currentSavingsGroundList, this.distinctGroundServices[serviceIndex], rowNumber);
      }

      //push data into currentsavings IntlList
      for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
        await this.filterAirIntlHWTData(serviceIndex, this.distinctIntlServices[serviceIndex], this.freightCurrentDetails, 'intl', this.distinctIntlServiceName[serviceIndex], this.distinctIntlExcelServiceName[serviceIndex]);
      }

      //push data into currentsavings hwtList

      if (this.currentDIMTable == "") {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTData(serviceIndex, this.distinctHWTServices[serviceIndex], this.freightCurrentDetails, 'hwt', this.distinctHWTServiceName[serviceIndex], this.distinctHWTExcelServiceName[serviceIndex]);
        }
      }
      else {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTData(serviceIndex, this.distinctHWTServices[serviceIndex], this.freightCurrentDetailsOld, 'hwt', this.distinctHWTServiceName[serviceIndex], this.distinctHWTExcelServiceName[serviceIndex]);
        }
      }

      this.currentSavingsAirList = this.currentSavingsAirList.filter(
        (airData: any) => this.distinctAirServices.includes(airData.service)
      );

      this.currentSavingsGroundList = this.currentSavingsGroundList.filter(
        (groundData: any) => this.distinctGroundServices.includes(groundData.service)
      );

      this.currentSavingsIntlList = this.currentSavingsIntlList.filter(
        (IntlData: any) => this.distinctIntlServices.includes(IntlData.service)
      );

      this.currentSavingsHWTList = this.currentSavingsHWTList.filter(
        (HWTData: any) => this.distinctHWTServices.includes(HWTData.service)
      );

      var tier = await this.setHWTMinMax('current');
      this.currentTier = tier;
      if (!this.hwtTier.includes(tier)) this.hwtTier.unshift(tier);

      if (!this.loaded) {
        this.calculateFreightCurrentTotal();
      }

      this.getInitRowSpan();

      for (let index = 0; index < this.currentSavingsGroundList.length; index++) {
        this.distinctGroundServicesWithWeight[index] = this.currentSavingsGroundList[index].service + this.currentSavingsGroundList[index].weightRange;
        this.distinctWeights[index] = this.currentSavingsGroundList[index].weightRange;
      }

      await this.setMinMax("air");
      await this.setMinMax("ground");
      await this.setMinMax("intl");
      await this.setMinMax("hwt");

      if (this.distinctAirServices.length > 0) {
        this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
      }
      else {
        this.dataSourceAir = new MatTableDataSource([]);
        this.currentSavingsAirList = [];
      }

      if (this.distinctGroundServices.length > 0) {
        this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
      }
      else {
        this.dataSourceGround = new MatTableDataSource([]);
        this.currentSavingsGroundList = [];
      }

      if (this.distinctIntlServices.length > 0) {
        this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
      }
      else {
        this.dataSourceIntl = new MatTableDataSource([]);
        this.currentSavingsIntlList = [];
      }

      if (this.distinctHWTServices.length > 0) {
        this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);
      }
      else {
        this.dataSourceHWT = new MatTableDataSource([]);
        this.currentSavingsHWTList = []
      }

      await this.getAccData();
    }

    await this.calculateOverallTotal('current');

    for (let columnNumber in this.scenariosDisplayed) {
      await this.getFreightTarget(this.selectedCarrier.carrierName.toLowerCase(), columnNumber);
      await this.getAccTarget(this.selectedCarrier.carrierName.toLowerCase(), columnNumber);
      await this.calculateOverallTotal('target', Number(columnNumber));
    }

    if (!this.loaded) {
      for (let row = 0; row < this.breakupListServiceName.length; row++) {
        var param = { service: this.breakupListService[row], serviceName: this.breakupListServiceName[row] };
        await this.accServiceBreakup(param, 'initial');
      }

      await this.getOldList('current');
    }

    for (let columnNumber in this.scenariosDisplayed) {
      if (!this.scenariosDisplayed[columnNumber].loaded) {
        await this.getOldList('target', Number(columnNumber));
      }
    }

    await this.getDimAndMin(this.selectedCarrier.carrierName.toLowerCase());

    if (!this.loaded) {
      let clientDetail: any = {};
      clientDetail['serviceType'] = this.selectedCarrier.carrierName.toLowerCase();
      var accessorialServices = await this.httpclient.fetchGRIAccessorialLookup(clientDetail).toPromise();

      this.allAccServices = await this.getUniqueService(accessorialServices, 'service');
    }
  }

  async getAccData() {

    this.currentSavingsAccList = [];
    this.currentSavingsAccTotalList = [];

    this.initialAccCheckList = [];
    this.breakupListService = [];
    this.breakupListService = [];
    this.breakupListServiceName = [];
    this.accCheckList = [];
    this.currentAccCheckList = [];

    //Accessorial
    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {

      for (let serviceIndex = 0; serviceIndex < this.distinctAccServices.length; serviceIndex++) {

        var filteredData;
        filteredData = this.accessorialCurrentDetails.filter((obj: any) => obj.service == this.distinctAccServices[serviceIndex] && obj.serviceBreakup == false);

        let accRowNumber = this.currentSavingsAccList.findIndex((obj: any) => obj.service == this.distinctAccServices[serviceIndex]);
        if (accRowNumber == -1) {
          let sum = 0;
          let count = 0;
          for (let key in filteredData) {
            sum = sum + Number(Number(filteredData[key].currentSpend).toFixed(2));
            count = count + Number(filteredData[key].count);
          }

          var calculatedData: any = [];
          if (filteredData[0] != undefined) {
            calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.currentSpend = Number(sum);
            calculatedData.count = count;
            calculatedData.serviceType = "All";
            calculatedData.sortService = filteredData[0].service;
            calculatedData.ratesheetGrouping = "";
            if (this.loaded) {
              this.currentSavingsAccList.splice(serviceIndex, 0, calculatedData);
            }
            else {
              this.currentSavingsAccList.push(calculatedData);
            }
          }
          else if (filteredData[0] == undefined) {
            calculatedData = {
              clientId: this.fedexClientId,
              targetId: 0,
              service: this.distinctAccServices[serviceIndex],
              weightRange: "All",
              count: 0,
              currentPercent: 0.00,
              currentSpend: 0,
              serviceType: "All",
              targetPercent: null,
              targetSpend: null,
              savingsAmount: null,
              currentPercentType: "%",
              targetPercentType: null,
              totalGrossAmount: "0.0000",
              serviceName: this.distinctAccServices[serviceIndex],
              includedInFuel: "Yes",
              ratesheetGrouping: "",
              finalService: this.distinctAccServices[serviceIndex],
              shortName: null,
              hoverName: null,
              clientName: null,
              accDetailsList: null,
              type: "New Web",
              serviceBreakup: false,
              sortService: this.distinctAccServices[serviceIndex]
            };

            if (this.loaded) {
              this.currentSavingsAccList.splice(serviceIndex, 0, calculatedData);
            }
            else {
              this.currentSavingsAccList.push(calculatedData);
            }

          }


          var splitupServices = this.accessorialCurrentDetails.filter((obj: any) => obj.service == this.distinctAccServices[serviceIndex] && obj.serviceBreakup == true);
          if (splitupServices.length > 0) {
            var distinctServices = await this.getUniqueService(splitupServices, 'shortName');
            for (let row = 0; row < distinctServices.length; row++) {
              let splitupData = splitupServices.filter((accData: any) => accData.shortName == distinctServices[row]);
              var calculatedData: any = [];
              if (splitupData[0] != undefined) {
                if (!this.initialAccCheckList.includes(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase())) {
                  this.accCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                  this.currentAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                  this.initialAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                }
                if (!this.breakupListServiceName.includes(splitupData[0].serviceName.toLowerCase())) {
                  this.breakupListService.push(splitupData[0].service.toLowerCase());
                  this.breakupListServiceName.push(splitupData[0].serviceName.toLowerCase());
                }
              }
            }
          }
        }
      }


      await this.setMinMax("acc");
      await this.currentSavingsAccList.sort((a: any, b: any) => b.currentSpend - a.currentSpend);
      var services: any = [];
      this.currentSavingsAccList.forEach((data: any) => services.push(data.service));
      this.accMinMaxList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
      this.distinctAccServices.sort((a: any, b: any) => services.indexOf(a) - services.indexOf(b));
      this.currentSavingsAccList = this.currentSavingsAccList.filter(
        (accData: any) => this.distinctAccServices.includes(accData.service)
      );
      this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);
      let totalCurrentSpend = 0;
      let totalCount = 0;
      for (let index = 0; index < this.currentSavingsAccList.length; index++) {
        totalCurrentSpend += this.currentSavingsAccList[index].currentSpend;
        totalCount += this.currentSavingsAccList[index].count;
      }

      this.currentSavingsAccTotalList.push({
        service: 'Accessorial Pricing :',
        weightRange: '',
        count: totalCount,
        currentPercent: '',
        currentSpend: Number(totalCurrentSpend.toFixed(2)),
        serviceType: ''
      });

      this.dataSourceCurrentAccTotal = new MatTableDataSource(this.currentSavingsAccTotalList);
    }
    else {

      for (let serviceIndex = 0; serviceIndex < this.distinctAccServices.length; serviceIndex++) {

        var filteredData;
        filteredData = this.accessorialCurrentDetails.filter((obj: any) => obj.service == this.distinctAccServices[serviceIndex]);
        let accRowNumber = this.currentSavingsAccList.findIndex((obj: any) => obj.service == this.distinctAccServices[serviceIndex]);
        if (accRowNumber == -1) {
          let sum = 0;
          let count = 0;
          for (let key in filteredData) {
            sum = sum + Number(Number(filteredData[key].currentSpend).toFixed(2));
            count = count + Number(filteredData[key].count);
          }

          var calculatedData: any = [];
          if (filteredData[0] != undefined) {
            calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.currentSpend = Number(sum);
            calculatedData.count = count;
            calculatedData.serviceType = "All";
            calculatedData.sortService = filteredData[0].service;
            calculatedData.ratesheetGrouping = "";
            if (this.loaded) {
              this.currentSavingsAccList.splice(serviceIndex, 0, calculatedData);
            }
            else {
              this.currentSavingsAccList.push(calculatedData);
            }
          }
          else if (filteredData[0] == undefined) {
            calculatedData = {
              clientId: this.cookiesService.getCookieItem("clientId"),
              targetId: 0,
              service: this.distinctAccServices[serviceIndex],
              weightRange: "All",
              count: 0,
              currentPercent: 0.00,
              currentSpend: 0,
              serviceType: "All",
              targetPercent: null,
              targetSpend: null,
              savingsAmount: null,
              currentPercentType: "%",
              targetPercentType: null,
              totalGrossAmount: "0.0000",
              serviceName: this.distinctAccServices[serviceIndex],
              includedInFuel: "Yes",
              ratesheetGrouping: "",
              finalService: this.distinctAccServices[serviceIndex],
              shortName: null,
              hoverName: null,
              clientName: null,
              accDetailsList: null,
              type: "New Web",
              serviceBreakup: false,
              sortService: this.distinctAccServices[serviceIndex]
            };

            if (this.loaded) {
              this.currentSavingsAccList.splice(serviceIndex, 0, calculatedData);
            }
            else {
              this.currentSavingsAccList.push(calculatedData);
            }

          }

          var splitupServices = this.accessorialCurrentDetails.filter((obj: any) => obj.service == this.distinctAccServices[serviceIndex] && obj.serviceBreakup == true);
          if (splitupServices.length > 0) {
            var distinctServices = await this.getUniqueService(splitupServices, 'shortName');
            for (let row = 0; row < distinctServices.length; row++) {
              let splitupData = splitupServices.filter((accData: any) => accData.shortName == distinctServices[row]);

              var calculatedData: any = [];
              if (splitupData[0] != undefined) {
                if (!this.initialAccCheckList.includes(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase())) {
                  this.accCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                  this.currentAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                  this.initialAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                }
                if (!this.breakupListServiceName.includes(splitupData[0].serviceName.toLowerCase())) {
                  this.breakupListService.push(splitupData[0].service.toLowerCase());
                  this.breakupListServiceName.push(splitupData[0].serviceName.toLowerCase());
                }
              }
            }
          }
        }
      }

      await this.setMinMax("acc");
      await this.currentSavingsAccList.sort((a: any, b: any) => b.currentSpend - a.currentSpend);

      var services: any = [];
      this.currentSavingsAccList.forEach((data: any) => services.push(data.service));

      this.accMinMaxList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
      this.distinctAccServices.sort((a: any, b: any) => services.indexOf(a) - services.indexOf(b));
      this.currentSavingsAccList = this.currentSavingsAccList.filter(
        (accData: any) => this.distinctAccServices.includes(accData.service)
      );
      this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);
      let totalCurrentSpend = 0;
      let totalCount = 0;
      for (let index = 0; index < this.currentSavingsAccList.length; index++) {
        totalCurrentSpend += this.currentSavingsAccList[index].currentSpend;
        totalCount += this.currentSavingsAccList[index].count;
      }
      this.currentSavingsAccTotalList.push({
        service: 'Accessorial Pricing :',
        weightRange: '',
        count: totalCount,
        currentPercent: '',
        currentSpend: Number(totalCurrentSpend.toFixed(2)),
        serviceType: ''
      });

      this.dataSourceCurrentAccTotal = new MatTableDataSource(this.currentSavingsAccTotalList);
    }
  }


  async getFreightTarget(carrier: any, index: any) {
    let rowNumber = this.totalScenarios.findIndex((data: any) => data.targetId == this.scenariosDisplayed[index].targetId);
    if (carrier == 'fedex') {
      this.targetSavingsAirList = [];
      this.targetSavingsGroundList = [];
      this.targetSavingsIntlList = [];
      this.targetSavingsHWTList = [];
      if (this.currentDIMTable != "") {
        this.scenariosDisplayed[index].targetHWTListOld.forEach((hwtData: any) => this.targetSavingsHWTList.push(Object.assign({}, hwtData)));
      }
      this.scenariosDisplayed[index].targetSavingsGroundSubTotalList = [];
      let data = this.scenariosDisplayed[index].freightTargetDetails;
      let data2 = this.scenariosDisplayed[index].freightTargetDetailsOld;
      for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctAirServices, data, serviceIndex, 'Air', rowNumber);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {
        if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
          await this.filterGroundTargetData(1, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
          await this.filterGroundTargetData(1, 2000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase() == "ground commercial" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground residential" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground returns" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "home delivery" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground - return") {
          await this.filterGroundTargetData(0, 5, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(6, 10, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(11, 20, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(21, 30, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(31, 50, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(51, 70, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(71, 150, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(151, '', this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        await this.calculateGroundSubTotalTarget(this.targetSavingsGroundList, serviceIndex, index);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctIntlServices, data, serviceIndex, 'Intl', rowNumber);
      }
      if (this.currentDIMTable == "") {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTTargetData(this.distinctHWTServices, data, serviceIndex, 'HWT', rowNumber);
        }
      }
      else {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTTargetData(this.distinctHWTServices, data2, serviceIndex, 'HWT', rowNumber);
        }
      }
      await this.calculateFreightTargetTotal(index);
      await this.getInitRowSpan();
      this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
      this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
      this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);
      this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);
      await this.setMinMaxTarget(index, "air");
      await this.setMinMaxTarget(index, "ground");
      await this.setMinMaxTarget(index, "intl");
      await this.setMinMaxTarget(index, "hwt");
      var tier = await this.setHWTMinMax('target');
      this.scenariosDisplayed[index].targetTier = tier;
      if (!this.scenariosDisplayed[index].hwtTier.includes(tier)) this.scenariosDisplayed[index].hwtTier.unshift(tier);
    }
    else {
      this.targetSavingsAirList = [];
      this.targetSavingsGroundList = [];
      this.targetSavingsIntlList = [];
      this.targetSavingsHWTList = [];
      this.scenariosDisplayed[index].targetSavingsGroundSubTotalList = [];
      let data = this.scenariosDisplayed[index].freightTargetDetails;
      let data2 = this.scenariosDisplayed[index].freightTargetDetailsOld;
      for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctAirServices, data, serviceIndex, 'Air', rowNumber);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {
        if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
          await this.filterGroundTargetData(1, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
          await this.filterGroundTargetData(1, 2000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase() == "ground commercial" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground residential" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground returns" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "home delivery" ||
          this.distinctGroundServices[serviceIndex].toLowerCase() == "ground - return") {
          await this.filterGroundTargetData(0, 5, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(6, 10, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(11, 20, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(21, 30, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(31, 50, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(51, 70, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(71, 150, this.distinctGroundServices, data, serviceIndex, rowNumber);
          await this.filterGroundTargetData(151, '', this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        else {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, rowNumber);
        }
        await this.calculateGroundSubTotalTarget(this.targetSavingsGroundList, serviceIndex, index);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctIntlServices, data, serviceIndex, 'Intl', rowNumber);
      }
      if (this.currentDIMTable == "") {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTTargetData(this.distinctHWTServices, data, serviceIndex, 'HWT', rowNumber);
        }
      }
      else {
        for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
          await this.filterAirIntlHWTTargetData(this.distinctHWTServices, data2, serviceIndex, 'HWT', rowNumber);
        }
      }
      await this.calculateFreightTargetTotal(index);
      await this.getInitRowSpan();
      this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
      this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
      this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);
      this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);
      await this.setMinMaxTarget(index, "air");
      await this.setMinMaxTarget(index, "ground");
      await this.setMinMaxTarget(index, "intl");
      await this.setMinMaxTarget(index, "hwt");
      var tier = await this.setHWTMinMax('target');
      this.scenariosDisplayed[index].targetTier = tier;
      if (!this.scenariosDisplayed[index].hwtTier.includes(tier)) this.scenariosDisplayed[index].hwtTier.unshift(tier);
    }
  }

  async getAccTarget(carrier: any, index: any) {
    let scenarioId = this.totalScenarios.findIndex((data: any) => data.targetId == this.scenariosDisplayed[index].targetId);
    this.scenariosDisplayed[index].targetAccCheckList = [];
    if (carrier == 'fedex') {
      this.targetSavingsAccList = [];
      this.targetSavingsAccTotalList = [];
      let distinctAccServices = await this.getUniqueService(this.currentSavingsAccList, 'service');
      for (let serviceIndex = 0; serviceIndex < distinctAccServices.length; serviceIndex++) {
        var filteredData: any;
        filteredData = this.scenariosDisplayed[index].accessorialTargetDetails.filter((obj: any) => obj.service == distinctAccServices[serviceIndex]);
        let totalTargetSpend = 0;
        let totalSavings = 0;
        let targetSavingsPercent = 0;
        let rowNumber = await this.totalScenarios[scenarioId].dataSourceAccTarget.data.findIndex((x: any) => x.service == distinctAccServices[serviceIndex]);
        if (rowNumber != -1 && this.totalScenarios[scenarioId].loaded) {
          totalTargetSpend = this.totalScenarios[scenarioId].dataSourceAccTarget.data[rowNumber].targetSpend;
        }
        else {
          for (let key in filteredData) {
            totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
          }
        }

        totalTargetSpend = Number(totalTargetSpend);
        if (filteredData[0] != undefined) {
          let currentService = await this.currentSavingsAccList.filter((data: any) => data.service == filteredData[0].service);
          if (currentService[0] != null && currentService[0] != undefined) {
            totalSavings = totalTargetSpend - currentService[0].currentSpend;
            totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;
            targetSavingsPercent = (currentService[0].currentSpend == 0) ? 0.00 : (totalSavings / currentService[0].currentSpend) * 100;
            var calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.targetSpend = totalTargetSpend;
            calculatedData.savingsAmount = totalSavings;
            calculatedData.sortService = filteredData[0].service;
            calculatedData.targetSavingsPercent = targetSavingsPercent;
            calculatedData.ratesheetGrouping = "";
            calculatedData.serviceType = "All";
            var row = await this.currentSavingsAccList.findIndex((x: any) => x.service == calculatedData.service);
            this.targetSavingsAccList[serviceIndex] = await calculatedData;
          }
        }
        else if (filteredData[0] == undefined) {
          calculatedData = {
            clientId: this.fedexClientId,
            count: 0,
            currentPercent: null,
            currentPercentType: null,
            currentSpend: null,
            includedInFuel: "Yes",
            savingsAmount: 0.00,
            service: distinctAccServices[serviceIndex],
            sortService: distinctAccServices[serviceIndex],
            serviceName: distinctAccServices[serviceIndex],
            ratesheetGrouping: "",
            serviceType: "Ground",
            targetId: 0,
            targetPercent: 0.00,
            targetPercentType: "%",
            targetSavingsPercent: 0.00,
            targetSpend: 0,
            totalGrossAmount: 0,
            weightRange: "All"
          };
          let row = await this.currentSavingsAccList.findIndex((x: any) => x.service == distinctAccServices[serviceIndex]);
          calculatedData.savingsAmount = Number(Number(this.currentSavingsAccList[row].currentSpend).toFixed(2));
          calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(this.currentSavingsAccList[row].currentSpend.toFixed(2)) == 0.00) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAccList[row].currentSpend.toFixed(2))) * 100));
          this.targetSavingsAccList[row] = await calculatedData;
        }
        var splitupServices = this.scenariosDisplayed[index].accessorialTargetDetails.filter((obj: any) => obj.service == this.distinctAccServices[serviceIndex] && obj.serviceBreakup == true);
        if (splitupServices.length > 0) {
          var distinctServices = await this.getUniqueService(splitupServices, 'ratesheetGrouping');
          for (let row = 0; row < distinctServices.length; row++) {
            let splitupData = splitupServices.filter((accData: any) => accData.ratesheetGrouping == distinctServices[row]);
            var calculatedData: any = [];
            if (splitupData[0] != undefined) {
              this.scenariosDisplayed[index].targetAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
              if (!this.initialAccCheckList.includes(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase())) {
                this.currentAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                this.accCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                this.initialAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
              }
              if (!this.breakupListServiceName.includes(splitupData[0].serviceName)) {
                this.breakupListService.push(splitupData[0].service);
                this.breakupListServiceName.push(splitupData[0].serviceName);
              }
            }
          }
        }
      }
      let totalTargetSpend = 0;
      let totalSavings = 0;
      for (let index = 0; index < this.targetSavingsAccList.length; index++) {
        totalTargetSpend += this.targetSavingsAccList[index].targetSpend;
        totalSavings += this.targetSavingsAccList[index].savingsAmount;
      }
      /*Exclude Customs and Duty amount for Savings % calculation*/
      let accDataList = this.dataSourceAcc.data;
      var filteredData = accDataList.filter((data: any) => data && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"));
      let customsDutySpend = 0;
      filteredData.forEach((data: any) => {
        customsDutySpend += Number(data.currentSpend) || 0;
      });
      this.targetSavingsAccTotalList.push({
        count: '',
        targetPercent: '',
        targetSpend: totalTargetSpend,
        targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) != 0) ? (totalSavings / (this.currentSavingsAccTotalList[0].currentSpend - customsDutySpend)) * 100 : 0,
        savingsAmount: totalSavings
      });
      this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);
      this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);
      await this.setMinMaxTarget(index, "acc");
      this.scenariosDisplayed[index].accMinMaxList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.service) - this.distinctAccServices.indexOf(b.service));
    }
    else {
      this.targetSavingsAccList = [];
      this.targetSavingsAccTotalList = [];
      let distinctAccServices = await this.getUniqueService(this.currentSavingsAccList, 'service');
      for (let serviceIndex = 0; serviceIndex < distinctAccServices.length; serviceIndex++) {
        var filteredData;
        filteredData = this.scenariosDisplayed[index].accessorialTargetDetails.filter((obj: any) => obj.service == distinctAccServices[serviceIndex]);
        let totalTargetSpend = 0;
        let totalSavings = 0;
        let targetSavingsPercent = 0;
        let rowNumber = await this.totalScenarios[scenarioId].dataSourceAccTarget.data.findIndex((x: any) => x.service == distinctAccServices[serviceIndex]);
        if (rowNumber != -1 && this.totalScenarios[scenarioId].loaded) {
          totalTargetSpend = this.totalScenarios[scenarioId].dataSourceAccTarget.data[rowNumber].targetSpend;
        }
        else {
          for (let key in filteredData) {
            if (filteredData[key].service != undefined && filteredData[key].service != null) {
              if (filteredData[key].service.toLowerCase().replaceAll(' ', '').includes('tpbilling') || filteredData[key].service.toLowerCase().replaceAll(' ', '').includes('thirdpartybilling')) {
                totalTargetSpend = totalTargetSpend + Number(filteredData[key].targetSpend);
              }
              else {
                totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
              }
            }
          }
        }
        totalTargetSpend = Number(totalTargetSpend);
        if (filteredData[0] != undefined) {
          let currentService = await this.currentSavingsAccList.filter((data: any) => data.service == filteredData[0].service);
          if (currentService[0] != null && currentService[0] != undefined) {
            totalSavings = totalTargetSpend - currentService[0].currentSpend;
            totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;
            targetSavingsPercent = (currentService[0].currentSpend == 0) ? 0.00 : (totalSavings / currentService[0].currentSpend) * 100;
            var calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.targetSpend = totalTargetSpend;
            calculatedData.savingsAmount = totalSavings;
            calculatedData.sortService = filteredData[0].service;
            calculatedData.targetSavingsPercent = targetSavingsPercent;
            calculatedData.ratesheetGrouping = "";
            calculatedData.serviceType = "All";
            var row = await this.currentSavingsAccList.findIndex((x: any) => x.service == calculatedData.service);
            this.targetSavingsAccList[serviceIndex] = await calculatedData;
          }
        }
        else if (filteredData[0] == undefined) {
          calculatedData = {
            clientId: this.cookiesService.getCookieItem('clientId'),
            count: 0,
            currentPercent: null,
            currentPercentType: null,
            currentSpend: null,
            includedInFuel: "Yes",
            savingsAmount: 0.00,
            service: distinctAccServices[serviceIndex],
            sortService: distinctAccServices[serviceIndex],
            serviceName: distinctAccServices[serviceIndex],
            ratesheetGrouping: "",
            serviceType: "Ground",
            targetId: 0,
            targetPercent: 0.00,
            targetPercentType: "%",
            targetSavingsPercent: 0.00,
            targetSpend: 0,
            totalGrossAmount: 0,
            weightRange: "All"
          };
          let row = await this.currentSavingsAccList.findIndex((x: any) => x.service == distinctAccServices[serviceIndex]);
          calculatedData.savingsAmount = Number(Number(this.currentSavingsAccList[row].currentSpend).toFixed(2));
          calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(this.currentSavingsAccList[row].currentSpend.toFixed(2)) == 0.00) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAccList[row].currentSpend.toFixed(2))) * 100));
          this.targetSavingsAccList[row] = await calculatedData;
        }
        var splitupServices = this.scenariosDisplayed[index].accessorialTargetDetails.filter((obj: any) => obj.service == this.distinctAccServices[serviceIndex] && obj.serviceBreakup == true);
        if (splitupServices.length > 0) {
          var distinctServices = await this.getUniqueService(splitupServices, 'ratesheetGrouping');
          for (let row = 0; row < distinctServices.length; row++) {
            let splitupData = splitupServices.filter((accData: any) => accData.ratesheetGrouping == distinctServices[row]);
            var calculatedData: any = [];
            if (splitupData[0] != undefined) {
              this.scenariosDisplayed[index].targetAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
              if (!this.initialAccCheckList.includes(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase())) {
                this.currentAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                this.accCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
                this.initialAccCheckList.push(splitupData[0].ratesheetGrouping.toLowerCase() + splitupData[0].serviceName.toLowerCase());
              }
              if (!this.breakupListServiceName.includes(splitupData[0].serviceName)) {
                this.breakupListService.push(splitupData[0].service);
                this.breakupListServiceName.push(splitupData[0].serviceName);
              }
            }
          }
        }
      }

      let totalTargetSpend = 0;
      let totalSavings = 0;
      for (let index = 0; index < this.targetSavingsAccList.length; index++) {
        totalTargetSpend += this.targetSavingsAccList[index].targetSpend;
        totalSavings += this.targetSavingsAccList[index].savingsAmount;
      }
      /*Exclude Customs and Duty amount for Savings % calculation*/
      let accDataList = this.dataSourceAcc.data;
      var filteredData = accDataList.filter((data: any) => data && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"));
      let customsDutySpend = 0;
      filteredData.forEach((data: any) => {
        customsDutySpend += Number(data.currentSpend) || 0;
      });
      this.targetSavingsAccTotalList.push({
        count: '',
        targetPercent: '',
        targetSpend: totalTargetSpend,
        targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) != 0) ? (totalSavings / (this.currentSavingsAccTotalList[0].currentSpend - customsDutySpend)) * 100 : 0,
        savingsAmount: totalSavings
      });

      this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);
      this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);

      await this.setMinMaxTarget(index, "acc");
      this.scenariosDisplayed[index].accMinMaxList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.service) - this.distinctAccServices.indexOf(b.service));
    }
  }

  async getOldList(type: string, scenarioIndex?: any) {

    if (type == 'current') {

      if (this.currentDIMTable == "") {

        this.freightCurrentDetailsOld = [];

        this.currentSavingsAirListOld = [];
        this.currentSavingsGroundListOld = [];
        this.currentSavingsIntlListOld = [];
        this.currentSavingsHWTListOld = [];

        this.currentSavingsAirTotalListOld = [];
        this.currentSavingsGroundTotalListOld = [];
        this.currentSavingsIntlTotalListOld = [];
        this.currentSavingsHWTTotalListOld = [];

        this.currentSavingsGroundSubTotalListOld = []

        this.airMinMaxListOld = [];
        this.groundMinMaxListOld = [];
        this.intlMinMaxListOld = [];
        this.hwtMinMaxListOld = [];

        this.freightCurrentDetails.forEach((data: any) => this.freightCurrentDetailsOld.push(Object.assign({}, data)));

        //Table List
        this.currentSavingsAirList.forEach((data: any) => this.currentSavingsAirListOld.push(Object.assign({}, data)));
        this.currentSavingsGroundList.forEach((data: any) => this.currentSavingsGroundListOld.push(Object.assign({}, data)));
        this.currentSavingsIntlList.forEach((data: any) => this.currentSavingsIntlListOld.push(Object.assign({}, data)));
        this.currentSavingsHWTList.forEach((data: any) => this.currentSavingsHWTListOld.push(Object.assign({}, data)));


        //TotalList
        this.currentSavingsAirTotalList.forEach((data: any) => this.currentSavingsAirTotalListOld.push(Object.assign({}, data)));
        this.currentSavingsGroundTotalList.forEach((data: any) => this.currentSavingsGroundTotalListOld.push(Object.assign({}, data)));
        this.currentSavingsIntlTotalList.forEach((data: any) => this.currentSavingsIntlTotalListOld.push(Object.assign({}, data)));
        this.currentSavingsHWTTotalList.forEach((data: any) => this.currentSavingsHWTTotalListOld.push(Object.assign({}, data)));

        this.currentSavingsGroundSubTotalList.forEach((data: any) => this.currentSavingsGroundSubTotalListOld.push(Object.assign({}, data)));

        //MinmaxList   
        this.airMinMaxList.forEach((data: any) => this.airMinMaxListOld.push(Object.assign({}, data)));
        this.groundMinMaxList.forEach((data: any) => this.groundMinMaxListOld.push(Object.assign({}, data)));
        this.intlMinMaxList.forEach((data: any) => this.intlMinMaxListOld.push(Object.assign({}, data)));
        this.hwtMinMaxList.forEach((data: any) => this.hwtMinMaxListOld.push(Object.assign({}, data)));


        //OverallTotal
        this.totalCurrentSpendOld = this.totalCurrentSpend;
        this.totalFreightSpendOld = this.totalFreightSpend;

      }

      this.currentSavingsAccListOld = [];
      this.currentSavingsAccTotalListOld = [];
      this.accMinMaxListOld = [];
      this.accCheckListOld = [...this.accCheckList];
      this.currentAccCheckListOld = [...this.currentAccCheckList];


      this.currentSavingsAccList.forEach((data: any) => this.currentSavingsAccListOld.push(Object.assign({}, data)));
      this.currentSavingsAccTotalList.forEach((data: any) => this.currentSavingsAccTotalListOld.push(Object.assign({}, data)));
      this.accMinMaxList.forEach((data: any) => this.accMinMaxListOld.push(Object.assign({}, data)));
      this.totalAccSpendOld = this.totalAccSpend;
    }
    else {


      if (this.currentDIMTable == "") {
        this.scenariosDisplayed[scenarioIndex].freightTargetDetailsOld = [];
        this.scenariosDisplayed[scenarioIndex].freightTargetDetails.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].freightTargetDetailsOld.push(Object.assign({}, data)));

        this.scenariosDisplayed[scenarioIndex].targetAirListOld = [];
        this.scenariosDisplayed[scenarioIndex].targetGroundListOld = [];
        this.scenariosDisplayed[scenarioIndex].targetIntlListOld = [];
        this.scenariosDisplayed[scenarioIndex].targetHWTListOld = [];

        this.scenariosDisplayed[scenarioIndex].dataSourceAirTarget.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetAirListOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].dataSourceGroundTarget.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetGroundListOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].dataSourceIntlTarget.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetIntlListOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].dataSourceHWTTarget.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetHWTListOld.push(Object.assign({}, data)));

        this.scenariosDisplayed[scenarioIndex].targetAirListTotalOld = [];
        this.scenariosDisplayed[scenarioIndex].targetGroundListTotalOld = [];
        this.scenariosDisplayed[scenarioIndex].targetIntlListTotalOld = [];
        this.scenariosDisplayed[scenarioIndex].targetHWTListTotalOld = [];

        this.scenariosDisplayed[scenarioIndex].dataSourceTargetAirTotal.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetAirListTotalOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].dataSourceTargetGroundTotal.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetGroundListTotalOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].dataSourceTargetIntlTotal.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetIntlListTotalOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].dataSourceTargetHWTTotal.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetHWTListTotalOld.push(Object.assign({}, data)));

        this.scenariosDisplayed[scenarioIndex].targetSavingsGroundSubTotalListOld = [];

        this.scenariosDisplayed[scenarioIndex].targetSavingsGroundSubTotalList.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetSavingsGroundSubTotalListOld.push(Object.assign({}, data)));

        this.scenariosDisplayed[scenarioIndex].airMinMaxListOld = [];
        this.scenariosDisplayed[scenarioIndex].groundMinMaxListOld = [];
        this.scenariosDisplayed[scenarioIndex].intlMinMaxListOld = [];
        this.scenariosDisplayed[scenarioIndex].hwtMinMaxListOld = [];

        this.scenariosDisplayed[scenarioIndex].airMinMaxList.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].airMinMaxListOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].groundMinMaxList.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].groundMinMaxListOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].intlMinMaxList.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].intlMinMaxListOld.push(Object.assign({}, data)));
        this.scenariosDisplayed[scenarioIndex].hwtMinMaxList.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].hwtMinMaxListOld.push(Object.assign({}, data)));


        this.scenariosDisplayed[scenarioIndex].totalNetSpendOld = this.scenariosDisplayed[scenarioIndex].totalNetSpend;
        this.scenariosDisplayed[scenarioIndex].totalFreightSpendOld = this.scenariosDisplayed[scenarioIndex].totalFreightSpend;
        this.scenariosDisplayed[scenarioIndex].totalAccSpendOld = this.scenariosDisplayed[scenarioIndex].totalAccSpend;
        this.scenariosDisplayed[scenarioIndex].totalSavingsOld = this.scenariosDisplayed[scenarioIndex].totalSavings;

        this.scenariosDisplayed[scenarioIndex].totalFreightSavingsOld = this.scenariosDisplayed[scenarioIndex].totalFreightSavings;
        this.scenariosDisplayed[scenarioIndex].totalSavingsPercentOld = this.scenariosDisplayed[scenarioIndex].totalSavingsPercent;
        this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercentOld = this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent;
      }

      this.scenariosDisplayed[scenarioIndex].targetAccListOld = [];
      this.scenariosDisplayed[scenarioIndex].targetAccListTotalOld = [];
      this.scenariosDisplayed[scenarioIndex].accMinMaxListOld = [];

      this.scenariosDisplayed[scenarioIndex].targetAccCheckListOld = [...this.scenariosDisplayed[scenarioIndex].targetAccCheckList];
      this.scenariosDisplayed[scenarioIndex].dataSourceAccTarget.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetAccListOld.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].dataSourceTargetAccTotal.data.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].targetAccListTotalOld.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].accMinMaxList.forEach((data: any) => this.scenariosDisplayed[scenarioIndex].accMinMaxListOld.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].totalAccSavingsOld = this.scenariosDisplayed[scenarioIndex].totalAccSavings;
      this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercentOld = this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercent;

    }
  }

  async getDimAndMin(carrier: any) {

    var clientDetail: any = {};
    var targetId: any = [];
    this.distinctMinServices = [];
    this.distinctMinReductionList = [];
    this.distinctMinReductionListOld = [];
    this.dataSourceMinReduction = [];
    this.netAmountMinMaxListOld = [];

    if (this.currentDIMTable == "") {
      this.dimFactorListOld = [];
    }
    this.dataSourceDimFactor = [];

    this.scenariosDisplayed.map((data: any) => {
      targetId.push(data.targetId);
    });

    clientDetail['targetId'] = targetId.toString();

    if (carrier == 'fedex') {

      clientDetail['clientId'] = this.fedexClientId;
      this.dimFactorList.forEach((data: any) => this.dimFactorListOld.push(Object.assign({}, data)));
      this.dataSourceDimFactor = new MatTableDataSource(this.dimFactorList);
      await this.minimumReductionList.forEach((data: any) => {
        if (!(this.distinctMinServices.includes(data.service))) {
          this.distinctMinServices.push(data.service);
          this.distinctMinReductionList.push(data);
          this.distinctMinReductionListOld.push(Object.assign({}, data));
        }
      });

      await this.setNetAmountMinMax();
      this.dataSourceMinReduction = new MatTableDataSource(this.netAmountMinMaxList);
      this.netAmountMinMaxList.forEach((data: any) => this.netAmountMinMaxListOld.push(Object.assign({}, data)));

    }
    else {

      clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');

      //DimFactor Details  
      if (this.currentDIMTable == "") {
        this.dimFactorList.forEach((data: any) => this.dimFactorListOld.push(Object.assign({}, data)));
      }
      this.dataSourceDimFactor = new MatTableDataSource(this.dimFactorList);

      //MinReduction Details  
      await this.minimumReductionList.forEach((data: any) => {
        if (!(this.distinctMinServices.includes(data.service))) {
          this.distinctMinServices.push(data.service);
          this.distinctMinReductionList.push(data);
          this.distinctMinReductionListOld.push(Object.assign({}, data));
        }
      })

      await this.setNetAmountMinMax();
      this.dataSourceMinReduction = new MatTableDataSource(this.netAmountMinMaxList);
      this.netAmountMinMaxList.forEach((data: any) => this.netAmountMinMaxListOld.push(Object.assign({}, data)));
    }
  }

  async getProposalList(scenario: any) {
    var clientObj: any = {};
    clientObj['type'] = 'Edit';
    clientObj['carrier'] = scenario.carrierName;
    clientObj['targetId'] = scenario.targetId;

    this.airProposalList = [];
    this.groundProposalList = [];
    this.hwtProposalList = [];
    this.intlProposalList = [];
    this.dimProposalList = [];
    this.accessorialProposalList = [];

    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.fedexClientId;
      var data = await this.fedexService.fetchGRIfreightEditProposal(clientObj).toPromise();
      {
        this.proposalList = data;
        await data.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.airProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.groundProposalList.push(dataNew);
          }

          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtProposalList.push(dataNew);
          }
          else {
            this.intlProposalList.push(dataNew);
          }
        });


        var dimData = await this.fedexService.fetchGRIDimFactor(clientObj).toPromise()
        this.dimProposalList = dimData.filter((value: any) => value.category == 'Proposed');
        this.accessorialProposalList = await this.fedexService.fetchGRIAccDetailsPopup(clientObj).toPromise();
      }
    }
    else {
      clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
      var data = await this.httpclient.fetchGRIfreightEditProposal(clientObj).toPromise();
      {
        this.proposalList = data;
        await data.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.airProposalList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.groundProposalList.push(dataNew);
          }

          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtProposalList.push(dataNew);
          }
          else {
            this.intlProposalList.push(dataNew);
          }
        });

        var dimData = await this.httpclient.fetchGRIDimFactor(clientObj).toPromise()
        this.dimProposalList = dimData.filter((value: any) => value.category == 'Proposed');
        this.accessorialProposalList = await this.httpclient.fetchGRIAccDetailsPopup(clientObj).toPromise();
      }
    }
  }

  async getHWTAccountsList(scenario: any, type: any) {

    this.hwtAccountNumbersList = [];
    var clientData: any = {};
    clientData['targetId'] = scenario;
    clientData['type'] = type;

    if (this.carrierName.toLowerCase() == 'fedex') {
      clientData['clientId'] = this.fedexClientId;
      this.hwtAccountNumbersList = await this.fedexService.fetchGRIAccountNumber(clientData).toPromise();
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      this.hwtAccountNumbersList = await this.httpclient.fetchGRIAccountNumber(clientData).toPromise();
    }
  }


  async getDiscounts(serviceName: string, index?: number) {
    this.viewDiscountsList = [];
    this.zoneLookupList = [];
    var userObj: any = {};
    let targetId;
    let carrierName;
    if (index != undefined) {
      targetId = this.scenariosDisplayed[index].targetId;
      carrierName = this.scenariosDisplayed[index].carrierName.toLowerCase();
    }
    else {
      carrierName = this.selectedCarrier.carrierName.toLowerCase();
    }
    userObj['service'] = serviceName;
  }

  async calculateGroundSubTotal(groundList: any, serviceName: any, row: any) {
    var tempData = {};
    var filteredData = groundList.filter((data: any) => data.service == serviceName);
    let rowNumber = groundList.findIndex((data: any) => data.service == serviceName && data.weightRange == 'Sub Total');

    if (filteredData.length > 1) {
      tempData = {
        service: filteredData[0].service,
        weightRange: 'Sub Total',
        count: '',
        currentPercent: '',
        currentSpend: ''
      }
      if (rowNumber == -1) {
        groundList.push(tempData);
      }
      row += 1;
    }
    await this.calculateSubTotal(groundList, serviceName, '');
    return row;
  }

  async calculateSubTotal(groundList: any, serviceName: any, weightRange: any) {

    var subTotalCurrentSpend = 0;
    var subCount = 0;
    var filteredData = groundList.filter((data: any) => data.service == serviceName);
    if (filteredData[0] != undefined) {
      var serviceData: any = {};
      filteredData.forEach((data: any) => {
        subTotalCurrentSpend = subTotalCurrentSpend + Number(data.currentSpend);
        subCount = subCount + Number(data.count);
        serviceData = {
          service: data.service,
          serviceName: data.service + data.weightRange,
          currentSpend: subTotalCurrentSpend,
          currentPercent: '',
          count: subCount
        }
        if (weightRange != '') {
          var rowNumber = this.currentSavingsGroundSubTotalList.findIndex((data: any) => data.serviceName == serviceName + 'Sub Total');
          serviceData['serviceName'] = serviceName + 'Sub Total';
          this.currentSavingsGroundSubTotalList[rowNumber] = Object.assign({}, serviceData);
        }
        else {
          this.currentSavingsGroundSubTotalList.push(serviceData);
        }
      });
    }
  }

  async calculateGroundSubTotalTargetExcel(groundList: any, serviceIndex: any, index: any) {

    var tempData = {};
    var filteredData = groundList.filter((data: any) => data.service == this.distinctGroundServices[serviceIndex]);
    if (filteredData.length > 1) {
      tempData = {
        service: filteredData[0].service,
        weightRange: 'Sub Total',
        targetPercent: '',
        targetSpend: '',
        savingsAmount: '',
        targetSavingsPercent: ''
      }
      groundList.push(tempData);
    }
    await this.calculateSubTotalTargetExcel(groundList, this.distinctGroundServices[serviceIndex], '', index);
  }

  async calculateSubTotalTargetExcel(groundList: any, serviceName: any, weightRange: any, index: any) {

    var totalTargetSpend = 0;
    var totalSavingsAmount = 0;
    var filteredData = groundList.filter((data: any) => data.service == serviceName);
    if (filteredData[0] != undefined) {
      var serviceData: any = {};
      filteredData.forEach((data: any) => {
        totalTargetSpend = totalTargetSpend + Number(data.targetSpend);
        totalSavingsAmount = totalSavingsAmount + Number(data.savingsAmount);
        serviceData = {
          service: data.service,
          serviceName: data.service + data.weightRange,
          weightRange: data.weightRange,
          targetPercent: ' ',
          targetSpend: totalTargetSpend,
          savingsAmount: totalSavingsAmount,
          targetSavingsPercent: ' ',
        }
        if (weightRange != '' && filteredData.length > 1) {
          var rowNumber = this.totalScenarios[index].targetSavingsGroundSubTotalList.findIndex((data: any) => data.serviceName == serviceName + 'Sub Total');
          serviceData['serviceName'] = serviceName + 'Sub Total';
          serviceData['targetSavingsPercent'] = (Math.abs(this.currentSavingsGroundSubTotalList[rowNumber].currentSpend) == 0.00) ? 0.00 : (serviceData['savingsAmount'] / this.currentSavingsGroundSubTotalList[rowNumber].currentSpend * 100);
          this.totalScenarios[index].targetSavingsGroundSubTotalList[rowNumber] = Object.assign({}, serviceData);
        }
        else {
          if (serviceData['weightRange'] == 'Sub Total') {
            var rowNumber = this.currentSavingsGroundSubTotalList.findIndex((data: any) => data.serviceName == serviceData['service'] + serviceData['weightRange']);
            serviceData['targetSavingsPercent'] = (Math.abs(this.currentSavingsGroundSubTotalList[rowNumber].currentSpend) == 0.00) ? 0.00 : (serviceData['savingsAmount'] / this.currentSavingsGroundSubTotalList[rowNumber].currentSpend * 100);
          }
          this.totalScenarios[index].targetSavingsGroundSubTotalList.push(serviceData);
        }
      });
    }
  }
  async calculateGroundSubTotalTarget(groundList: any, serviceIndex: any, index: any) {

    var tempData = {};
    var filteredData = groundList.filter((data: any) => data && data.service == this.distinctGroundServices[serviceIndex]);
    let rowNumber = groundList.findIndex((data: any) => data && data.service == this.distinctGroundServices[serviceIndex] && data.weightRange == "Sub Total");
    if (filteredData.length > 1) {
      tempData = {
        service: filteredData[0].service,
        weightRange: 'Sub Total',
        targetPercent: '',
        targetSpend: '',
        savingsAmount: '',
        targetSavingsPercent: ''
      }
      if (rowNumber == -1) {
        groundList.push(tempData);
      }
    }
    await this.calculateSubTotalTarget(groundList, this.distinctGroundServices[serviceIndex], '', index);
  }

  async calculateSubTotalTarget(groundList: any, serviceName: any, weightRange: any, index: any) {

    var totalTargetSpend = 0;
    var totalSavingsAmount = 0;
    var filteredData = groundList.filter((data: any) => data.service == serviceName);
    if (filteredData[0] != undefined) {
      var serviceData: any = {};
      filteredData.forEach((data: any) => {
        totalTargetSpend = totalTargetSpend + Number(data.targetSpend);
        totalSavingsAmount = totalSavingsAmount + Number(data.savingsAmount);
        serviceData = {
          service: data.service,
          serviceName: data.service + data.weightRange,
          weightRange: data.weightRange,
          targetPercent: ' ',
          targetSpend: totalTargetSpend,
          savingsAmount: totalSavingsAmount,
          targetSavingsPercent: ' ',
        }
        if (weightRange != '' && filteredData.length > 1) {
          var rowNumber = this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.findIndex((data: any) => data.serviceName == serviceName + 'Sub Total');
          serviceData['serviceName'] = serviceName + 'Sub Total';
          serviceData['targetSavingsPercent'] = (Math.abs(this.currentSavingsGroundSubTotalList[rowNumber].currentSpend) == 0.00) ? 0.00 : (serviceData['savingsAmount'] / this.currentSavingsGroundSubTotalList[rowNumber].currentSpend * 100);
          this.scenariosDisplayed[index].targetSavingsGroundSubTotalList[rowNumber] = Object.assign({}, serviceData);
        }
        else {
          if (serviceData['weightRange'] == 'Sub Total') {
            var rowNumber = this.currentSavingsGroundSubTotalList.findIndex((data: any) => data.serviceName == serviceData['service'] + serviceData['weightRange']);
            serviceData['targetSavingsPercent'] = (Math.abs(this.currentSavingsGroundSubTotalList[rowNumber].currentSpend) == 0.00) ? 0.00 : (serviceData['savingsAmount'] / this.currentSavingsGroundSubTotalList[rowNumber].currentSpend * 100);
          }
          this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.push(serviceData);
        }
      });
    }
  }

  async calculateFreightCurrentTotal() {

    this.currentSavingsAirTotalList = [];
    this.currentSavingsGroundTotalList = [];
    this.currentSavingsIntlTotalList = [];
    this.currentSavingsHWTTotalList = [];

    //air
    var service: any = await this.calculateCurrentSpend(this.currentSavingsAirList);
    this.currentSavingsAirTotalList.push({
      service: 'Express Pricing :',
      weightRange: '',
      count: service['totalCount'],
      currentPercent: '',
      currentSpend: service['totalCurrentSpend'],
      serviceType: ''
    });
    this.dataSourceCurrentAirTotal = new MatTableDataSource(this.currentSavingsAirTotalList);

    //ground
    service = await this.calculateCurrentSpend(this.currentSavingsGroundList);
    this.currentSavingsGroundTotalList.push({
      service: 'Ground Pricing :',
      weightRange: '',
      count: service['totalCount'],
      currentPercent: '',
      currentSpend: service['totalCurrentSpend'],
      serviceType: ''
    });
    this.dataSourceCurrentGroundTotal = new MatTableDataSource(this.currentSavingsGroundTotalList);

    //intl
    service = await this.calculateCurrentSpend(this.currentSavingsIntlList);
    this.currentSavingsIntlTotalList.push({
      service: 'International Pricing :',
      weightRange: '',
      count: service['totalCount'],
      currentPercent: '',
      currentSpend: service['totalCurrentSpend'],
      serviceType: ''
    });
    this.dataSourceCurrentIntlTotal = new MatTableDataSource(this.currentSavingsIntlTotalList);

    //hwt
    service = await this.calculateCurrentSpend(this.currentSavingsHWTList);
    this.currentSavingsHWTTotalList.push({
      service: 'Hundredweight Pricing :',
      weightRange: '',
      count: service['totalCount'],
      currentPercent: '',
      currentSpend: service['totalCurrentSpend'],
      serviceType: ''
    });
    this.dataSourceCurrentHWTTotal = new MatTableDataSource(this.currentSavingsHWTTotalList);


  }

  async calculateFreightTargetTotal(index: any) {

    this.targetSavingsAirTotalList = [];
    this.targetSavingsGroundTotalList = [];
    this.targetSavingsIntlTotalList = [];
    this.targetSavingsHWTTotalList = [];

    //air
    var service: any = await this.calculateTargetSpend(this.targetSavingsAirList);
    this.targetSavingsAirTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsAirTotalList[0].currentSpend) > 0) ? (service['totalSavings'] / this.currentSavingsAirTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.scenariosDisplayed[index].dataSourceTargetAirTotal = new MatTableDataSource(this.targetSavingsAirTotalList);

    //ground
    service = await this.calculateTargetSpend(this.targetSavingsGroundList);
    this.targetSavingsGroundTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsGroundTotalList[0].currentSpend) != 0) ? (service['totalSavings'] / this.currentSavingsGroundTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.scenariosDisplayed[index].dataSourceTargetGroundTotal = new MatTableDataSource(this.targetSavingsGroundTotalList);

    //intl
    service = await this.calculateTargetSpend(this.targetSavingsIntlList);
    this.targetSavingsIntlTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsIntlTotalList[0].currentSpend) != 0) ? (service['totalSavings'] / this.currentSavingsIntlTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.scenariosDisplayed[index].dataSourceTargetIntlTotal = new MatTableDataSource(this.targetSavingsIntlTotalList);

    //hwt
    service = await this.calculateTargetSpend(this.targetSavingsHWTList);
    this.targetSavingsHWTTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsHWTTotalList[0].currentSpend) != 0) ? (service['totalSavings'] / this.currentSavingsHWTTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.scenariosDisplayed[index].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);

  }

  async calculateFreightTargetTotalExcel(index: any) {

    this.targetSavingsAirTotalList = [];
    this.targetSavingsGroundTotalList = [];
    this.targetSavingsIntlTotalList = [];
    this.targetSavingsHWTTotalList = [];

    //air
    var service: any = await this.calculateTargetSpend(this.targetSavingsAirList);
    this.targetSavingsAirTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsAirTotalList[0].currentSpend) > 0) ? (service['totalSavings'] / this.currentSavingsAirTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.totalScenarios[index].dataSourceTargetAirTotal = new MatTableDataSource(this.targetSavingsAirTotalList);

    //ground
    service = await this.calculateTargetSpend(this.targetSavingsGroundList);
    this.targetSavingsGroundTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsGroundTotalList[0].currentSpend) != 0) ? (service['totalSavings'] / this.currentSavingsGroundTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.totalScenarios[index].dataSourceTargetGroundTotal = new MatTableDataSource(this.targetSavingsGroundTotalList);

    //intl
    service = await this.calculateTargetSpend(this.targetSavingsIntlList);
    this.targetSavingsIntlTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsIntlTotalList[0].currentSpend) != 0) ? (service['totalSavings'] / this.currentSavingsIntlTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.totalScenarios[index].dataSourceTargetIntlTotal = new MatTableDataSource(this.targetSavingsIntlTotalList);

    //hwt
    service = await this.calculateTargetSpend(this.targetSavingsHWTList);
    this.targetSavingsHWTTotalList.push({
      weightRange: '',
      count: '',
      targetPercent: '',
      targetSpend: service['totalTargetSpend'],
      targetSavingsPercent: (Math.abs(this.currentSavingsHWTTotalList[0].currentSpend) != 0) ? (service['totalSavings'] / this.currentSavingsHWTTotalList[0].currentSpend) * 100 : 0,
      savingsAmount: service['totalSavings']
    });
    this.totalScenarios[index].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);
  }

  async calculateOverallTotal(type: string, scenarioIndex?: any) {

    if (type == 'current') {
      this.totalCurrentSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend + this.currentSavingsAccTotalList[0].currentSpend;
      this.totalFreightSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend;
      this.totalAccSpend = this.currentSavingsAccTotalList[0].currentSpend;
    }
    else {

      this.targetSavingsAirTotalList = [];
      this.targetSavingsGroundTotalList = [];
      this.targetSavingsIntlTotalList = [];
      this.targetSavingsHWTTotalList = [];
      this.targetSavingsAccTotalList = [];

      this.scenariosDisplayed[scenarioIndex].dataSourceTargetAirTotal.data.forEach((data: any) => this.targetSavingsAirTotalList.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].dataSourceTargetGroundTotal.data.forEach((data: any) => this.targetSavingsGroundTotalList.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].dataSourceTargetIntlTotal.data.forEach((data: any) => this.targetSavingsIntlTotalList.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].dataSourceTargetHWTTotal.data.forEach((data: any) => this.targetSavingsHWTTotalList.push(Object.assign({}, data)));
      this.scenariosDisplayed[scenarioIndex].dataSourceTargetAccTotal.data.forEach((data: any) => this.targetSavingsAccTotalList.push(Object.assign({}, data)));

      this.scenariosDisplayed[scenarioIndex].totalNetSpend = Number((this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend + this.targetSavingsAccTotalList[0].targetSpend).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalFreightSpend = Number((this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalAccSpend = Number(Number(this.targetSavingsAccTotalList[0].targetSpend).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalSavings = Number((this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount + this.targetSavingsAccTotalList[0].savingsAmount).toFixed(2));
      /*Exclude Customs and Duty amount for Savings % calculation*/
      let accDataList = this.dataSourceAcc.data;
      var filteredData = accDataList.filter((data: any) => data && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"));
      let customsDutySpend = 0;
      filteredData.forEach((data: any) => {
        customsDutySpend += Number(data.currentSpend) || 0;
      });
      this.scenariosDisplayed[scenarioIndex].totalSavingsPercent = (this.totalCurrentSpend == 0) ? 0.00 : Number(((this.scenariosDisplayed[scenarioIndex].totalSavings / (this.totalCurrentSpend - customsDutySpend)) * 100).toFixed(2));

      this.scenariosDisplayed[scenarioIndex].totalFreightSavings = Number((this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent = (this.totalFreightSpend == 0) ? 0.00 : Number(((this.scenariosDisplayed[scenarioIndex].totalFreightSavings / this.totalFreightSpend) * 100).toFixed(2));
      // this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent = (this.scenariosDisplayed[scenarioIndex].totalFreightSavings < 0) ? -this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent : this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent;

      this.scenariosDisplayed[scenarioIndex].totalAccSavings = Number(Number(this.targetSavingsAccTotalList[0].savingsAmount).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercent = (this.totalAccSpend == 0) ? 0.00 : Number(((this.scenariosDisplayed[scenarioIndex].totalAccSavings / (this.totalAccSpend - customsDutySpend)) * 100).toFixed(2));
    }
  }

  async calculateCurrentSpend(data: any) {
    var service: any = {};
    service['totalCurrentSpend'] = 0
    service['totalCount'] = 0
    data.map((item: any) => {
      service['totalCurrentSpend'] += Number(item.currentSpend);
      service['totalCount'] += Number(item.count);
    });
    return service;
  }

  async calculateTargetSpend(data: any) {
    var service: any = {};
    service['totalTargetSpend'] = 0
    service['totalSavings'] = 0

    data.map((item: any) => {
      service['totalTargetSpend'] += Number(item.targetSpend);
      service['totalSavings'] += Number(item.savingsAmount);
    });
    return service;
  }

  async getInitRowSpan() {
    this.cacheSpan('service', (d: any) => d.service);
    this.cacheSpan('weightRange', (d: any) => d.service + d.weightRange);
    this.cacheSpan('count', (d: any) => d.service + d.weightRange + d.count);
    this.cacheSpan('currentPercent', (d: any) => d.service + d.weightRange + d.count + d.currentPercent);
    this.cacheSpan('currentSpend', (d: any) => d.service + d.weightRange + d.count + d.currentPercent + d.currentSpend);
  }
  getDisplayedCurrentColumns() {
    this.displayedColumns = this.currentColumnDefinitions.filter(cd => cd.hide).map(cd => cd.def);
    var newFirstElement = "service";
    this.displayedColumns = [newFirstElement].concat(this.displayedColumns);
  }

  async gridViewfunction() {
    let o1: Observable<boolean> = this.weightRange!.valueChanges;
    let o2: Observable<boolean> = this.count!.valueChanges;
    let o3: Observable<boolean> = this.currentUPSPercent!.valueChanges;
    let o4: Observable<boolean> = this.currentSpend!.valueChanges;

    merge(o1, o2, o3, o4).subscribe(v => {
      this.currentColumnDefinitions[0].hide = this.weightRange!.value;
      this.currentColumnDefinitions[1].hide = this.count!.value;
      this.currentColumnDefinitions[2].hide = this.currentUPSPercent!.value;
      this.currentColumnDefinitions[3].hide = this.currentSpend!.value;

      this.getDisplayedCurrentColumns();
    });

    this.getDisplayedCurrentColumns();
  }

  getDisplayedCurrentColumnsTarget(scenario: any) {

    scenario.displayedColumnsTarget = scenario.currentColumnDefinitionsTarget.filter((cd: any) => cd.hide).map((cd: any) => cd.def);
  }

  async gridViewfunctionTarget(scenario: any) {
    var targetPercent = scenario.gridviewColTargetformGroup.get('targetPercent');
    var targetSpend = scenario.gridviewColTargetformGroup.get('targetSpend');
    var savingsAmount = scenario.gridviewColTargetformGroup.get('savingsAmount');
    var targetSavingsPercent = scenario.gridviewColTargetformGroup.get('targetSavingsPercent');
    scenario.currentColumnDefinitionsTarget[0].hide = targetPercent.value;
    scenario.currentColumnDefinitionsTarget[1].hide = targetSpend.value;
    scenario.currentColumnDefinitionsTarget[2].hide = savingsAmount.value;
    scenario.currentColumnDefinitionsTarget[3].hide = targetSavingsPercent.value;
    this.getDisplayedCurrentColumnsTarget(scenario);
  }

  enableEdit() {
    let panelClass = "";
    if (this.themeoption == 'dark') {
      panelClass = 'page-dark'
    }
    let message = "Enable the edit button to add new rows";
    this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { pageValue: message },
    });
  }

  AddNewRowAir() {

    var newCurrentData = {
      service: '',
      finalService: '',
      serviceGrouping: 'air',
      weightRange: '',
      count: '',
      newCount: 0,
      currentPercent: '',
      currentSpend: '',
      isNewRow: true,
    }

    this.airMinMaxList.push({
      service: "",
      disMin: "",
      disMax: ""
    });
    this.currentSavingsAirList.push(newCurrentData);
    this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
    for (let index in this.scenariosDisplayed) {
      this.targetSavingsAirList = [];
      this.targetSavingsAirList = this.scenariosDisplayed[index].dataSourceAirTarget.data;

      var newTargetData = {
        service: '',
        finalService: '',
        weightRange: '',
        count: '',
        serviceGrouping: 'air',
        targetPercent: '',
        targetSpend: '',
        targetSavingsPercent: '',
        savingsAmount: '',
        isNewRow: true,
      }
      this.scenariosDisplayed[index].airMinMaxList.push({
        service: "",
        disMin: "",
        disMax: ""
      });
      this.targetSavingsAirList.push(newTargetData);
      this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
    }
  }

  AddNewRowGround() {

    this.currentSavingsGroundList.push({
      service: '',
      finalService: '',
      serviceGrouping: 'ground',
      weightRange: '',
      count: '',
      newCount: 0,
      currentPercent: '',
      currentSpend: '',
      isNewRow: true,
    });

    this.groundMinMaxList.push({
      service: "",
      disMin: "",
      disMax: ""
    });

    this.groundMinMaxListOld.push({
      service: "",
      disMin: "",
      disMax: ""
    });

    this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
    for (let index in this.scenariosDisplayed) {
      this.targetSavingsGroundList = [];
      this.targetSavingsGroundList = this.scenariosDisplayed[index].dataSourceGroundTarget.data;
      this.targetSavingsGroundList.push({
        weightRange: '',
        count: '',
        service: '',
        finalService: '',
        serviceGrouping: 'ground',
        targetPercent: '',
        targetSpend: '',
        targetSavingsPercent: '',
        savingsAmount: '',
        isNewRow: true,
      });
      this.scenariosDisplayed[index].groundMinMaxList.push({
        service: "",
        disMin: "",
        disMax: ""
      });
      this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
    }
  }

  AddNewRowIntl() {

    this.currentSavingsIntlList.push({
      service: '',
      finalService: '',
      weightRange: '',
      count: '',
      newCount: 0,
      currentPercent: '',
      currentSpend: '',
      serviceGrouping: 'intl',
      isNewRow: true
    });

    this.intlMinMaxList.push({
      service: "",
      disMin: "",
      disMax: ""
    });

    this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
    for (let index in this.scenariosDisplayed) {
      this.targetSavingsIntlList = [];
      this.targetSavingsIntlList = this.scenariosDisplayed[index].dataSourceIntlTarget.data;
      this.targetSavingsIntlList.push({
        weightRange: '',
        count: '',
        targetPercent: '',
        targetSpend: '',
        targetSavingsPercent: '',
        savingsAmount: '',
        serviceGrouping: 'intl',
        finalService: '',
        service: '',
        isNewRow: true,
      });

      this.scenariosDisplayed[index].intlMinMaxList.push({
        service: "",
        disMin: "",
        disMax: ""
      });
      this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);
    }
  }

  AddNewRowHWT() {

    this.currentSavingsHWTList.push({
      service: '',
      finalService: '',
      weightRange: '',
      count: '',
      newCount: 0,
      currentPercent: '',
      currentSpend: '',
      serviceGrouping: 'hwt',
      isNewRow: true,
    });

    this.hwtMinMaxList.push({
      service: "",
      disMin: "",
      disMax: ""
    });
    this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);
    for (let index in this.scenariosDisplayed) {
      this.targetSavingsHWTList = [];
      this.targetSavingsHWTList = this.scenariosDisplayed[index].dataSourceHWTTarget.data;
      this.targetSavingsHWTList.push({
        weightRange: '',
        count: '',
        targetPercent: '',
        targetSpend: '',
        targetSavingsPercent: '',
        savingsAmount: '',
        serviceGrouping: 'hwt',
        finalService: '',
        service: '',
        isNewRow: true,
      });

      this.scenariosDisplayed[index].hwtMinMaxList.push({
        service: "",
        disMin: "",
        disMax: ""
      });
      this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);
    }
  }

  AddNewRowAcc() {

    this.currentSavingsAccList.push({
      service: '',
      weightRange: '',
      count: '',
      newCount: 0,
      currentPercent: '',
      currentSpend: '',
      serviceType: '',
      isNewRow: true,
      rowNumber: undefined,
      currentPercentType: '%',
      additionalRow: true,
    });

    this.accMinMaxList.push({
      service: "",
      disMin: "",
      disMax: "",
      discountType: '%',
      additionalRow: true
    });
    this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);
    for (let index in this.scenariosDisplayed) {
      this.targetSavingsAccList = [];
      this.targetSavingsAccList = this.scenariosDisplayed[index].dataSourceAccTarget.data;
      this.targetSavingsAccList.push({
        weightRange: '',
        service: '',
        count: '',
        targetPercent: '',
        targetSpend: '',
        targetSavingsPercent: '',
        targetPercentType: '%',
        savingsAmount: '',
        serviceType: '',
        isNewRow: true,
        additionalRow: true,
      });

      this.scenariosDisplayed[index].accMinMaxList.push({
        service: "",
        disMin: "",
        disMax: "",
        discountType: '%',
        additionalRow: true,
      });
      this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);
    }
  }

  async calculateTargetTotal(index: any) {

    this.targetSavingsAirTotalList = [];
    this.targetSavingsGroundTotalList = [];
    this.targetSavingsIntlTotalList = [];
    this.targetSavingsHWTTotalList = [];
    this.targetSavingsAccTotalList = [];

    this.targetSavingsAirTotalList = this.scenariosDisplayed[index].dataSourceTargetAirTotal.data;
    this.targetSavingsGroundTotalList = this.scenariosDisplayed[index].dataSourceTargetGroundTotal.data;
    this.targetSavingsIntlTotalList = this.scenariosDisplayed[index].dataSourceTargetIntlTotal.data;
    this.targetSavingsHWTTotalList = this.scenariosDisplayed[index].dataSourceTargetHWTTotal.data;
    this.targetSavingsAccTotalList = this.scenariosDisplayed[index].dataSourceTargetAccTotal.data;

    this.scenariosDisplayed[index].totalNetSpend = 0;
    this.scenariosDisplayed[index].totalFreightSpend = 0;
    this.scenariosDisplayed[index].totalAccSpend = 0;
    this.scenariosDisplayed[index].totalSavings = 0;
    this.scenariosDisplayed[index].totalNetSpend += this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend + this.targetSavingsAccTotalList[0].targetSpend;
    this.scenariosDisplayed[index].totalFreightSpend += this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend;
    this.scenariosDisplayed[index].totalAccSpend += this.targetSavingsAccTotalList[0].targetSpend;
    this.scenariosDisplayed[index].totalSavings += this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount + this.targetSavingsAccTotalList[0].savingsAmount;


    if (this.totalCurrentSpend == 0) {
      this.scenariosDisplayed[index].totalSavingsPercent = 0.00;
    }
    else {
      this.scenariosDisplayed[index].totalSavingsPercent = (this.scenariosDisplayed[index].totalSavings / this.totalCurrentSpend) * 100;
    }

    this.scenariosDisplayed[index].totalFreightSavings = this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount;

    if (this.totalFreightSpend == 0) {
      this.scenariosDisplayed[index].totalFreightSavingsPercent = 0;
    }
    else {
      this.scenariosDisplayed[index].totalFreightSavingsPercent = (this.scenariosDisplayed[index].totalFreightSavings / this.totalFreightSpend) * 100;
    }

    this.scenariosDisplayed[index].totalAccSavings = this.targetSavingsAccTotalList[0].savingsAmount;
    if (this.totalAccSpend == 0) {
      this.scenariosDisplayed[index].totalAccSavingsPercent = 0;
    }
    else {
      this.scenariosDisplayed[index].totalAccSavingsPercent = (this.scenariosDisplayed[index].totalAccSavings / this.totalAccSpend) * 100;
    }
  }

  async removeNewService(rowIndex: any, gridName: any) {
    if (gridName == "DomesticAir") {
      this.currentSavingsAirList.splice(rowIndex, 1);
      this.airMinMaxList.splice(rowIndex, 1);
      this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
      var calculatedCurrentService: any = await this.calculateCurrentSpend(this.currentSavingsAirList);
      this.currentSavingsAirTotalList = [];
      this.currentSavingsAirTotalList.push({
        service: 'Express Pricing :',
        weightRange: '',
        count: calculatedCurrentService['totalCount'],
        currentPercent: '',
        currentSpend: calculatedCurrentService['totalCurrentSpend'],
        serviceType: ''
      });
      this.dataSourceCurrentAirTotal = new MatTableDataSource(this.currentSavingsAirTotalList);
      this.totalCurrentSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend + this.currentSavingsAccTotalList[0].currentSpend;
      this.totalFreightSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend;
      this.totalAccSpend = this.currentSavingsAccTotalList[0].currentSpend;
      for (let index in this.scenariosDisplayed) {
        this.targetSavingsAirList = [];
        this.targetSavingsAirList = this.scenariosDisplayed[index].dataSourceAirTarget.data;
        this.targetSavingsAirList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].airMinMaxList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
        var calculatedTargetService: any = await this.calculateTargetSpend(this.targetSavingsAirList);
        this.targetSavingsAirTotalList = [];
        this.targetSavingsAirTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (calculatedTargetService['totalTargetSpend'] > 0) ? (calculatedTargetService['totalSavings'] / calculatedTargetService['totalTargetSpend']) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });
        this.scenariosDisplayed[index].dataSourceTargetAirTotal = new MatTableDataSource(this.targetSavingsAirTotalList);
        this.calculateTargetTotal(index);
      }
    }
    else if (gridName == "DomesticGround") {
      this.currentSavingsGroundList.splice(rowIndex, 1);
      this.groundMinMaxList.splice(rowIndex, 1);
      this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
      var calculatedCurrentService: any = await this.calculateCurrentSpend(this.currentSavingsGroundList);
      this.currentSavingsGroundTotalList = [];
      this.currentSavingsGroundTotalList.push({
        service: 'Ground Pricing :',
        weightRange: '',
        count: calculatedCurrentService['totalCount'],
        currentPercent: '',
        currentSpend: calculatedCurrentService['totalCurrentSpend'],
        serviceType: ''
      });
      this.dataSourceCurrentGroundTotal = new MatTableDataSource(this.currentSavingsGroundTotalList);
      this.totalCurrentSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend + this.currentSavingsAccTotalList[0].currentSpend;
      this.totalFreightSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend;
      this.totalAccSpend = this.currentSavingsAccTotalList[0].currentSpend;

      for (let index in this.scenariosDisplayed) {
        this.targetSavingsGroundList = [];
        this.targetSavingsGroundList = this.scenariosDisplayed[index].dataSourceGroundTarget.data;
        this.targetSavingsGroundList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].groundMinMaxList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
        var calculatedTargetService: any = await this.calculateTargetSpend(this.targetSavingsGroundList);
        this.targetSavingsGroundTotalList = [];
        this.targetSavingsGroundTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (calculatedTargetService['totalTargetSpend'] > 0) ? (calculatedTargetService['totalSavings'] / calculatedTargetService['totalTargetSpend']) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });

        this.scenariosDisplayed[index].dataSourceTargetGroundTotal = new MatTableDataSource(this.targetSavingsGroundTotalList);
        this.calculateTargetTotal(index);
      }
    }
    else if (gridName == "DomesticIntl") {
      this.currentSavingsIntlList.splice(rowIndex, 1);
      this.intlMinMaxList.splice(rowIndex, 1);
      this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
      var calculatedCurrentService: any = await this.calculateCurrentSpend(this.currentSavingsIntlList);
      this.currentSavingsIntlTotalList = [];
      this.currentSavingsIntlTotalList.push({
        service: 'International Pricing :',
        weightRange: '',
        count: calculatedCurrentService['totalCount'],
        currentPercent: '',
        currentSpend: calculatedCurrentService['totalCurrentSpend'],
        serviceType: ''
      });
      this.dataSourceCurrentIntlTotal = new MatTableDataSource(this.currentSavingsIntlTotalList);
      this.totalCurrentSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend + this.currentSavingsAccTotalList[0].currentSpend;
      this.totalFreightSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend;
      this.totalAccSpend = this.currentSavingsAccTotalList[0].currentSpend;

      for (let index in this.scenariosDisplayed) {
        this.targetSavingsIntlList = [];
        this.targetSavingsIntlList = this.scenariosDisplayed[index].dataSourceIntlTarget.data;
        this.scenariosDisplayed[index].intlMinMaxList.splice(rowIndex, 1);
        this.targetSavingsIntlList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);
        var calculatedTargetService: any = await this.calculateTargetSpend(this.targetSavingsIntlList);
        this.targetSavingsIntlTotalList = [];
        this.targetSavingsIntlTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (calculatedTargetService['totalTargetSpend'] > 0) ? (calculatedTargetService['totalSavings'] / calculatedTargetService['totalTargetSpend']) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });

        this.scenariosDisplayed[index].dataSourceTargetIntlTotal = new MatTableDataSource(this.targetSavingsIntlTotalList);
        this.calculateTargetTotal(index);
      }
    }
    else if (gridName == "HundredWeight") {
      this.currentSavingsHWTList.splice(rowIndex, 1);
      this.hwtMinMaxList.splice(rowIndex, 1);
      this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);
      var calculatedCurrentService: any = await this.calculateCurrentSpend(this.currentSavingsHWTList);
      this.currentSavingsHWTTotalList = [];
      this.currentSavingsHWTTotalList.push({
        service: 'Hundredweight Pricing :',
        weightRange: '',
        count: calculatedCurrentService['totalCount'],
        currentPercent: '',
        currentSpend: calculatedCurrentService['totalCurrentSpend'],
        serviceType: ''
      });
      this.dataSourceCurrentHWTTotal = new MatTableDataSource(this.currentSavingsHWTTotalList);
      this.totalCurrentSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend + this.currentSavingsAccTotalList[0].currentSpend;
      this.totalFreightSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend;
      this.totalAccSpend = this.currentSavingsAccTotalList[0].currentSpend;
      for (let index in this.scenariosDisplayed) {
        this.targetSavingsHWTList = [];
        this.targetSavingsHWTList = this.scenariosDisplayed[index].dataSourceHWTTarget.data;
        this.scenariosDisplayed[index].hwtMinMaxList.splice(rowIndex, 1);
        this.targetSavingsHWTList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);
        var calculatedTargetService: any = await this.calculateTargetSpend(this.targetSavingsHWTList);
        this.targetSavingsHWTTotalList = [];
        this.targetSavingsHWTTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (calculatedTargetService['totalTargetSpend'] > 0) ? (calculatedTargetService['totalSavings'] / calculatedTargetService['totalTargetSpend']) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });

        this.scenariosDisplayed[index].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);
        this.calculateTargetTotal(index);
      }
    }
    else if (gridName == "Accessorial") {
      this.currentSavingsAccList.splice(rowIndex, 1);
      this.accMinMaxList.splice(rowIndex, 1);
      this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);
      var calculatedCurrentService: any = await this.calculateCurrentSpend(this.currentSavingsAccList);
      this.currentSavingsAccTotalList = [];
      this.currentSavingsAccTotalList.push({
        service: 'Accessorial Pricing :',
        weightRange: '',
        count: calculatedCurrentService['totalCount'],
        currentPercent: '',
        currentSpend: calculatedCurrentService['totalCurrentSpend'],
        serviceType: ''
      });
      this.dataSourceCurrentAccTotal = new MatTableDataSource(this.currentSavingsAccTotalList);
      this.totalCurrentSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend + this.currentSavingsAccTotalList[0].currentSpend;
      this.totalFreightSpend = this.currentSavingsAirTotalList[0].currentSpend + this.currentSavingsGroundTotalList[0].currentSpend + this.currentSavingsIntlTotalList[0].currentSpend + this.currentSavingsHWTTotalList[0].currentSpend;
      this.totalAccSpend = this.currentSavingsAccTotalList[0].currentSpend;
      for (let index in this.scenariosDisplayed) {
        this.targetSavingsAccList = [];
        this.targetSavingsAccList = this.scenariosDisplayed[index].dataSourceAccTarget.data;
        this.targetSavingsAccList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].accMinMaxList.splice(rowIndex, 1);
        this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);
        var calculatedTargetService: any = await this.calculateTargetSpend(this.targetSavingsAccList);
        this.targetSavingsAccTotalList = [];
        this.targetSavingsAccTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (calculatedTargetService['totalTargetSpend'] > 0) ? (calculatedTargetService['totalSavings'] / calculatedTargetService['totalTargetSpend']) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });
        this.scenariosDisplayed[index].dataSourceTargetAccTotal = [];
        this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);
        this.calculateTargetTotal(index);
      }
      let filteredService: any = [];
      this.currentSavingsAccList.filter((data: any, index: any) => {
        if (data.isNewRow != undefined) {
          filteredService.push(index);
        }
      });
      for (let index in filteredService) {
        let AccId = filteredService[index]
        let filteredAcc = this.currentSavingsAccList.filter((data: any, id: any) => id != AccId && data.rowNumber == undefined);
        let availableServices = await this.getUniqueService(filteredAcc, 'service');
        let currentService = this.currentSavingsAccList[AccId].service;
        if (availableServices.includes(currentService)) {
          this.currentSavingsAccList[AccId].rowNumber = AccId;
        }
        else {
          this.currentSavingsAccList[AccId].rowNumber = undefined;
        }
      }
      let row = this.currentSavingsAccList.findIndex((data: any) => data.rowNumber != undefined);
      if (row == -1) {
        this.isAccServiceAvailable = false;
      }
    }
  }
  editablePercent(fieldvalue: any) {
    if (fieldvalue.indexOf("%") !== -1) {
      this.editable.set(false);
    }
  }
  accessorialExpandable(serviceName: any) {
  }

  cacheSpan(accessKey: any, accessor: any) {
    for (let iRow = 0; iRow < this.currentSavingsGroundList.length;) {
      let currentValue = accessor(this.currentSavingsGroundList[iRow]);
      let count = 1;

      for (let jCol = iRow + 1; jCol < this.currentSavingsGroundList.length; jCol++) {
        if (currentValue != accessor(this.currentSavingsGroundList[jCol])) {
          break;
        }
        count++;
      }
      if (!this.spans[iRow]) {
        this.spans[iRow] = {};
      }
      this.spans[iRow][accessKey] = count;
      iRow += count;
    }
  }

  getRowSpan(col: any, index: any) {
    if (this.currentSavingsGroundList[index].isNewRow == undefined) {
      return this.spans[index] && this.spans[index][col];
    }
    else {
      return true;
    }
  }

  openFilterPopup(event: any) {
    var handelerPosition = this.gerClickhandlerPosition(window.innerHeight, event.y);
    const dialogPosition: DialogPosition = {
      top: handelerPosition + 'px',
      left: event.x - 250 + 'px'
    };
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'filter-modalbox';
    }
    const dialogRef = this.dialog.open(FilterscreenGRIComponent, {
      disableClose: true,
      width: "355px",
      height: "415px",
      position: dialogPosition,
      data: {
        service: this.selectedCarrier['carrierName'],
        targetList: this.selectedScenarios,
        category: this.selectedCategory(),
        fedexId: this.fedexClientId,
        allScenarios: this.totalScenarios,
      },
      panelClass: [this.panelClass],
    });

    dialogRef.afterClosed().subscribe(
      async (data: any) => {
        if (data != undefined) {
          var newId = [];
          this.selectedCategory.set(data[0]);
          this.selectedScenarios = data[1];
          this.filterApplied = true;
          var targetIdList = [];
          for (let index = 0; index < this.selectedScenarios.length; index++) {
            if (!(this.allIdList.includes(this.selectedScenarios[index]))) {
              targetIdList.push(this.selectedScenarios[index]);
            }
          }
          this.reloadData(this.selectedScenarios);
        }
      }
    );
  }
  async removeAllAdditionalRows() {
    while (this.currentSavingsAirList.length > this.currentSavingsAirListOld.length) {
      if (this.currentSavingsAirList[this.currentSavingsAirList.length - 1].isNewRow != undefined) {
        await this.removeNewService(this.currentSavingsAirList.length - 1, "DomesticAir");
      }
      else {
        break;
      }
    }
    while (this.currentSavingsGroundList.length > this.currentSavingsGroundListOld.length) {
      if (this.currentSavingsGroundList[this.currentSavingsGroundList.length - 1].isNewRow != undefined) {
        await this.removeNewService(this.currentSavingsGroundList.length - 1, "DomesticGround");
      }
      else {
        break;
      }
    }
    while (this.currentSavingsIntlList.length > this.currentSavingsIntlListOld.length) {
      if (this.currentSavingsIntlList[this.currentSavingsIntlList.length - 1].isNewRow != undefined) {
        await this.removeNewService(this.currentSavingsIntlList.length - 1, "DomesticIntl");
      }
      else {
        break;
      }
    }
    while (this.currentSavingsHWTList.length > this.currentSavingsHWTListOld.length) {
      if (this.currentSavingsHWTList[this.currentSavingsHWTList.length - 1].isNewRow != undefined) {
        await this.removeNewService(this.currentSavingsHWTList.length - 1, "HundredWeight");
      }
      else {
        break;
      }
    }
    while (this.currentSavingsAccList.length > this.currentSavingsAccListOld.length) {
      if (this.currentSavingsAccList[this.currentSavingsAccList.length - 1].additionalRow != undefined) {
        await this.removeNewService(this.currentSavingsAccList.length - 1, "Accessorial");
      }
      else {
        break;
      }
    }
    return true;
  }

  clickCreateProposal(clickValue: any, selectedScenario: any) {

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'Create-Proposal-Component-class';
    }
    const dialogConfig = this.dialog.open(CreateProposalGRIComponent, {
      disableClose: true,
      panelClass: this.panelClass,
      width: '1280px',
      maxWidth: '95vw',
      data: {
        valueClick: clickValue,
        carrierDetails: this.selectedCarrier,
        target: selectedScenario,
        targetList: this.scenariosDisplayed,
        fedexId: this.fedexClientId,
        tabIndex: 0,
        targetDetails: this.totalScenarios,
      },
    });
    dialogConfig.afterClosed().subscribe(async (data: any) => {

      if (data != undefined) {

        if (data.saved) {
          this.openLoading();
          this.defaultCarrier = this.selectedCarrier.carrierName;
          await this.setCarrier();

          let clientDetail: any = {};
          if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
            clientDetail['clientId'] = this.fedexClientId;
            var targetDetails = await this.fedexService.fetchGRITargetDetails(clientDetail).toPromise();

            targetDetails.forEach((element: any) => {


              let index = this.scenariosDisplayed.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index != -1) {
                this.scenariosDisplayed[index].agreementNo = element.agreementNo;
                this.scenariosDisplayed[index].targetNickName = element.targetNickName;
                this.scenariosDisplayed[index].year = element.year;
              }

              let index2 = this.totalScenarios.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index2 != -1) {
                this.totalScenarios[index2].agreementNo = element.agreementNo;
                this.totalScenarios[index2].targetNickName = element.targetNickName;
                this.totalScenarios[index2].year = element.year;
              }

            });
          }
          else {
            clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
            var targetDetails = await this.httpclient.fetchGRITargetDetails(clientDetail).toPromise();

            targetDetails.forEach((element: any) => {

              let index = this.scenariosDisplayed.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index != -1) {
                this.scenariosDisplayed[index].agreementNo = element.agreementNo;
                this.scenariosDisplayed[index].targetNickName = element.targetNickName;
                this.scenariosDisplayed[index].year = element.year;
              }

              let index2 = this.totalScenarios.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index2 != -1) {
                this.totalScenarios[index2].agreementNo = element.agreementNo;
                this.totalScenarios[index2].targetNickName = element.targetNickName;
                this.totalScenarios[index2].year = element.year;
              }
            });

          }


          this.closeLoading();
        }

        if (data.delete) {
          this.reloadPage(data);
        }
        else {
          var type = typeof data.target;
          var anyChanges = data.anyChange;
          if (type != 'undefined') {


            if (data.target != "") {

              if (data.dim != undefined) {
                this.currentDIMTable = data.dim.runType;
              }
              if (data.dimList != undefined) {
                this.currentDimList = data.dimList;
              }
              let panelClass = "";
              if (this.themeoption == 'dark') {
                panelClass = 'page-dark'
              }
              var resetDialog = this.dialog.open(ResetPopupGRIComponent, {
                disableClose: true,
                width: '470px',
                height: 'auto',
                panelClass: panelClass,
                data: { message: "Are you sure you want to refresh?" }
              });
              resetDialog.afterClosed().subscribe(
                result => {
                  if (result == true) {
                    this.reloadPage(data);
                  }
                });

            }
          }
        }
      }
    });
  }


  async reloadPage(data: any) {

    await this.removeAllAdditionalRows();
    var targetIdList = [];

    if (data.target != null) {
      if ((!(this.allIdList.includes(data.target))) && data.target != 'Current') {
        if (this.scenariosDisplayed.length > 1) {
          targetIdList.push(this.scenariosDisplayed[0].targetId);
        }
        targetIdList.push(data.target);
      }
      else if (data.target == 'Current') {
        this.loaded = false;
      }
      else {
        this.scenariosDisplayed.forEach((scenario: any) => {
          targetIdList.push(scenario.targetId);
          if (scenario.targetId == data.target) {
            scenario.loaded = false;
          }
        });
        this.totalScenarios.forEach((scenario: any) => {
          if (scenario.targetId == data.target) {
            scenario.loaded = false;
          }
        });
      }
    }

    this.reloadData(targetIdList);
  }

  editbtn_clickHandler() {
    this.editable.set(true);

  }
  savebtn_clickHandler() {
    this.editable.set(false);
  }

  async validateAcc(event: any) {
    var isEmpty = false;
    let newAccDataId: any = [];
    this.currentSavingsAccList.filter((data: any, id: any) => {
      if (data.isNewRow != undefined) {
        newAccDataId.push(id);
      }
    });
    for (let index in newAccDataId) {
      let data = this.currentSavingsAccList[newAccDataId[index]];
      let columns = this.displayedColumnsAcc.filter((data: any) => data != 'currentPercent');
      for (let id in columns) {
        let column = columns[id];
        if (data[column].toString().length == 0 || data[column] == undefined || data[column] == null) {
          isEmpty = true;
        }
      }
    }
    for (let columnNumber in this.scenariosDisplayed) {
      let newAccDataId: any = [];
      this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data.filter((data: any, id: any) => {
        if (data.isNewRow != undefined) {
          newAccDataId.push(id);
        }
      });
      for (let index in newAccDataId) {
        let data = this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[newAccDataId[index]];
        let columns = this.scenariosDisplayed[columnNumber].displayedColumnsTarget.filter((data: any) => data != 'targetPercent');
        for (let id in columns) {
          let column = columns[id];
          if (data[column].toString().length == 0 || data[column] == undefined || data[column] == null) {
            isEmpty = true;
          }
        }
        data = this.scenariosDisplayed[columnNumber].accMinMaxList[newAccDataId[index]];
        columns = ['disMin', 'disMax'];
        for (let id in columns) {
          let column = columns[id];
          if (data[column].toString().length == 0 || data[column] == undefined || data[column] == null) {
            isEmpty = true;
          }
        }
      }
    }
    if (isEmpty) {
      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = "page-dark";
      }
      let message = "Input fields should not be empty";
      this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        panelClass: panelClass,
        data: { pageValue: message },
      });
      this.toggleClicked = true;
      event.preventDefault();
      return;
    }
    if (this.isAccServiceAvailable == true) {
      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = 'page-dark'
      }
      let message = "Accessorial service already exists, select a different accessorial service";
      this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        panelClass: panelClass,
        data: { pageValue: message },
      });
      this.toggleClicked = true;
      event.preventDefault();
      return;
    }
  }
  async onToggle(event?: any) {
    if (event != undefined) {
      const input = event.target as HTMLInputElement;
      let isChecked = input.checked;
      console.log('isChecked', isChecked);
      this.editable.set(isChecked);
    } else {
      if (this.editable()) {
        this.editable.set(false);
      }
      else {
        this.editable.set(true);
      }
    }
    if (this.editable()) {
      this.toggleClicked = false;
      this.editText.set('Save');
      this.editable.set(true);
    } else {
      this.toggleClicked = true;
      this.editText.set('Edit');
      await this.saveCurrent();
    }
    return;
  }


  async saveCurrent() {
    var isAnythingChanged = false;
    var airMinMaxList = this.airMinMaxList;
    var groundMinMaxList = this.groundMinMaxList.filter((data: any) => !(data.service.includes('Sub Total')));
    var intlMinMaxList = this.intlMinMaxList;
    var hwtMinMaxList = this.hwtMinMaxList;
    var accMinMaxList = this.accMinMaxList;

    var airMinMaxListOld = this.airMinMaxListOld;
    var groundMinMaxListOld = this.groundMinMaxListOld.filter((data: any) => !(data.service.includes('Sub Total')));;
    var intlMinMaxListOld = this.intlMinMaxListOld;
    var hwtMinMaxListOld = this.hwtMinMaxListOld;
    var accMinMaxListOld = this.accMinMaxListOld;

    let accDataList = this.dataSourceAcc.data;
    let accDataListOld = this.currentSavingsAccListOld;

    var hwtTierOld = "";
    let duplicateHWTList: any = [];
    this.currentSavingsHWTList.forEach((hwtData: any) => duplicateHWTList.push(Object.assign({}, hwtData)));
    this.currentSavingsHWTList = this.currentSavingsHWTListOld;
    hwtTierOld = await this.setHWTMinMax('current');
    this.currentSavingsHWTList = [];
    duplicateHWTList.forEach((hwtData: any) => this.currentSavingsHWTList.push(Object.assign({}, hwtData)));


    if (this.currentTier != hwtTierOld) {
      isAnythingChanged = true;
    }

    if (airMinMaxList.length > 0) {
      for (let row = 0; row < airMinMaxList.length; row++) {
        if (JSON.stringify(airMinMaxList[row]) !== JSON.stringify(airMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (groundMinMaxList.length > 0) {
      for (let row = 0; row < groundMinMaxList.length; row++) {
        if (JSON.stringify(groundMinMaxList[row]) !== JSON.stringify(groundMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (intlMinMaxList.length > 0) {
      for (let row = 0; row < intlMinMaxList.length; row++) {
        if (JSON.stringify(intlMinMaxList[row]) !== JSON.stringify(intlMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (hwtMinMaxList.length > 0) {
      for (let row = 0; row < hwtMinMaxList.length; row++) {
        if (JSON.stringify(hwtMinMaxList[row]) !== JSON.stringify(hwtMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (accMinMaxList.length > 0) {
      for (let row = 0; row < accMinMaxList.length; row++) {
        if (JSON.stringify(accMinMaxList[row]) !== JSON.stringify(accMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    //for spend check
    if (accDataList.length > 0) {
      for (let row = 0; row < accDataList.length; row++) {
        if (accDataListOld[row] != undefined) {
          if (accDataList[row].currentSpend != accDataListOld[row].currentSpend) {
            isAnythingChanged = true;
          }
        }
        else {
          isAnythingChanged = true;
        }
      }
    }

    if (this.dimFactorList.length > 0) {
      for (let row = 0; row < this.dimFactorList.length; row++) {
        if (this.dimFactorList[row].baselineDimFactor != this.dimFactorListOld[row].baselineDimFactor) {
          isAnythingChanged = true;
        }
      }
    }

    if (this.netAmountMinMaxList.length > 0) {
      for (let row = 0; row < this.netAmountMinMaxList.length; row++) {
        if (this.netAmountMinMaxList[row].currentMax != this.netAmountMinMaxListOld[row].currentMax || this.netAmountMinMaxList[row].currentMin != this.netAmountMinMaxListOld[row].currentMin) {
          isAnythingChanged = true;
        }
      }
    }

    if (isAnythingChanged == true || this.isAnythingChangedNewWebCurrent == true) {
      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = 'page-dark'
      }
      var editSaveDialog = this.dialog.open(DashBoardSaveAlertGRIComponent, {
        disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass: panelClass,
        data: { message: "Do you want to save these changes to the existing agreement?", agreementList: this.totalScenarios, targetId: 'current' }
      });
      editSaveDialog.afterClosed().subscribe(async (resultData: any) => {
        if (resultData.result == true) {
          this.openLoading();
          await this.getHWTAccountsList(undefined, "create");
          var clientObj: any = {};
          clientObj['targetId'] = 0;
          var freightList = [];
          var hwtList = [];
          var dimList = [];
          var accList = [];
          //air
          for (let row = 0; row < airMinMaxList.length; row++) {
            var filteredData = this.airProposalList.filter((data: any) => data.shortName == airMinMaxList[row].service);
            filteredData.forEach((data: any) => {
              if (airMinMaxList[row].disMin == airMinMaxList[row].disMax) {
                data.targetDis = airMinMaxList[row].disMin;
              }
            });
          }
          //ground
          for (let row = 0; row < groundMinMaxList.length; row++) {
            let testList = [];
            var serviceList = groundMinMaxList.filter((data: any) => data.name == groundMinMaxList[row].name);
            if (serviceList.length > 1) {
              if (groundMinMaxList[row + 1] != undefined) {
                if (groundMinMaxList[row].name != groundMinMaxList[row + 1].name) {
                  groundMinMaxList[row].weightTo = 1000;
                }
              }
            }
            var serviceName = groundMinMaxList[row].name;
            var fromWeight = Number(groundMinMaxList[row].weightFrom);
            var toWeight = Number(groundMinMaxList[row].weightTo);
            if (groundMinMaxList[row - 1] != undefined) {
              var previousFromWeight = Number(groundMinMaxList[row - 1].weightFrom);
              var previousToWeight = Number(groundMinMaxList[row - 1].weightTo);
            }
            var listNotAvailable = false; //true if both fromweight and to weight is not available,otherwise becomes false
            var trueList = false; // true if both 
            var filteredData = this.groundProposalList.filter((data: any) => {

              if (data.shortName == serviceName && Number(data.weightFrom) >= fromWeight && Number(data.weightTo) <= toWeight) {
                trueList = true;
                return (data.shortName == serviceName && Number(data.weightFrom) >= fromWeight && Number(data.weightTo) <= toWeight);
              }
              else if (data.shortName == serviceName && Number(data.weightFrom) == fromWeight && Number(data.weightTo) != toWeight) {
                return (data.shortName == serviceName && Number(data.weightFrom) == fromWeight && Number(data.weightTo) != toWeight);
              }
              else if (data.shortName == serviceName && Number(data.weightFrom) != fromWeight && Number(data.weightTo) == toWeight) {
                return (data.shortName == serviceName && Number(data.weightFrom) != fromWeight && Number(data.weightTo) == toWeight);
              }

              return false;  // ✅ added line
            });

            if (filteredData[0] == undefined) {
              listNotAvailable = true;
            }
            //if from weight or to weight is not found then list with previous weight is taken. 
            if (filteredData[0] == undefined) {
              var filteredData = this.groundProposalList.filter((data: any) => {
                if (data.shortName == serviceName && Number(data.weightFrom) >= previousFromWeight && Number(data.weightTo) <= previousToWeight) {
                  return (data.shortName == serviceName && Number(data.weightFrom) >= previousFromWeight && Number(data.weightTo) <= previousToWeight);
                }
                return false;  // ✅ added line
              });
            }

            if (listNotAvailable) {

              filteredData.forEach((data: any) => {
                var objectData = Object.assign({}, data);
                objectData.weightFrom = groundMinMaxList[row].weightFrom;
                objectData.weightTo = groundMinMaxList[row].weightTo;
                objectData.frtRatesheetId = 0;
                if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                  objectData.targetDis = groundMinMaxList[row].disMin;
                }
                this.groundProposalList.push(Object.assign({}, objectData));
                testList.push(Object.assign({}, data));
              });
            }
            else {
              if (trueList) {
                filteredData.forEach((data: any) => {
                  if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                    data.targetDis = groundMinMaxList[row].disMin;
                    data.weightFrom = groundMinMaxList[row].weightFrom;
                    data.weightTo = groundMinMaxList[row].weightTo;
                  }
                });
              }
              else {
                let duplicateList: any = [];
                filteredData.forEach((data: any) => duplicateList.push(Object.assign({}, data)));
                duplicateList.forEach((data: any) => {
                  if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                    data.targetDis = groundMinMaxList[row].disMin;
                  }
                  data.frtRatesheetId = 0;
                  data.weightFrom = groundMinMaxList[row].weightFrom;
                  data.weightTo = groundMinMaxList[row].weightTo;
                  this.groundProposalList.push(Object.assign({}, data));
                  testList.push(Object.assign({}, data));
                });

              }
            }
          }


          let deleteList: any = [];
          for (let row = 0; row < groundMinMaxList.length; row++) {

            let checkList = groundMinMaxList.filter((data: any) => data.name == groundMinMaxList[row].name);
            if (checkList.length > 1) {
              // var filteredData = this.groundProposalList.filter((data: any) => {
              //   if (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo)))) {
              //     return (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))))
              //   }
              // });
              var filteredData = this.groundProposalList.filter((data: any) => {
                if (
                  data.shortName == groundMinMaxList[row].name &&
                  (
                    (Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) ||
                    (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))
                  )
                ) {
                  return (
                    data.shortName == groundMinMaxList[row].name &&
                    (
                      (Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) ||
                      (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))
                    )
                  );
                }

                return false; // ✅ required for filter
              });

              if (filteredData[0] != undefined) {
                filteredData.forEach((data: any) => {
                  deleteList.push(Object.assign({}, data));
                  var rowIndex = this.groundProposalList.findIndex((data2: any) => JSON.stringify(data2) == JSON.stringify(data));
                  this.groundProposalList.splice(rowIndex, 1);
                });
              }
            }
            else {
              if (groundMinMaxList[row].disMin != groundMinMaxList[row].disMax) {
                continue;
              }
              else {
                // var filteredData = this.groundProposalList.filter((data: any) => {
                //   if (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)))) {
                //     return (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))))
                //   }
                // });
                var filteredData = this.groundProposalList.filter((data: any) => {
                  if (
                    data.shortName == groundMinMaxList[row].name &&
                    (
                      (Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) ||
                      (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo)) ||
                      (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo))
                    )
                  ) {
                    return (
                      data.shortName == groundMinMaxList[row].name &&
                      (
                        (Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) ||
                        (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))
                      )
                    );
                  }

                  return false; // ✅ required
                });

                if (filteredData[0] != undefined) {
                  filteredData.forEach((data: any) => {
                    deleteList.push(Object.assign({}, data));
                    var rowIndex = this.groundProposalList.findIndex((data2: any) => JSON.stringify(data2) == JSON.stringify(data));
                    this.groundProposalList.splice(rowIndex, 1);
                  });
                }
              }
            }


          }

          if (deleteList.length > 0) await this.deleteRowFRTRatesheet(deleteList);
          for (let row = 0; row < intlMinMaxList.length; row++) {
            var filteredData = this.intlProposalList.filter((data: any) => data.shortName == intlMinMaxList[row].service);
            filteredData.forEach((data: any) => {
              if (intlMinMaxList[row].disMin == intlMinMaxList[row].disMax) {
                data.targetDis = intlMinMaxList[row].disMin;
              }
            });
          }

          //hwt
          for (let row = 0; row < hwtMinMaxList.length; row++) {
            var filteredData = this.hwtProposalList.filter((data: any) => data.shortName == hwtMinMaxList[row].service);
            filteredData.forEach((data: any) => {
              if (hwtMinMaxList[row].disMin == hwtMinMaxList[row].disMax) {
                data.targetDis = hwtMinMaxList[row].disMin;
              }
              if (hwtMinMaxList[row].amountMin == hwtMinMaxList[row].amountMax) {
                data.hwtTier = hwtMinMaxList[row].amountMin;
              }
            });
          }

          if (this.currentTier != hwtTierOld) {
            this.hwtAccountNumbersList.forEach((data: any) => {
              data.hwtTier = this.currentTier;
              data.targetId = clientObj['targetId'];
            })
          }

          var refAccObj = {
            accRatesheetId: 0,
            carrier: "",
            clientId: (this.carrierName.toLowerCase() == 'ups') ? this.cookiesService.getCookieItem('adminName') : this.fedexClientId,
            containerType: "",
            currentDis: "",
            currentDisType: "",
            currentSpend: "",
            field: "",
            fieldVal: "",
            netSpend: "",
            service: "",
            ratesheetGrouping: "",
            serviceType: "Ground",
            subGroup: "",
            targetDis: 0,
            targetDisType: "%",
            targetId: '',
            targetSpend: "",
            type: "",
            weightFrom: "",
            weightTo: ""
          }

          //acc
          for (let row = 0; row < accMinMaxList.length; row++) {

            if (accMinMaxList[row].serviceType == "All") {
              var filteredData = this.accessorialProposalList.filter((data: any) => data.service == accMinMaxList[row].serviceName);
            }
            else if (accMinMaxList[row].serviceType == "Remaining Services") {
              var filteredData = this.accessorialProposalList.filter((data: any) => data.service == accMinMaxList[row].serviceName && !this.accCheckList.includes(data.subGroup.toLowerCase() + data.serviceType.toLowerCase() + data.service.toLowerCase()));
            }
            else {
              var filteredData = this.accessorialProposalList.filter((data: any) => data.service == accMinMaxList[row].serviceName && accMinMaxList[row].ratesheetGrouping == (data.subGroup + data.serviceType));
            }

            filteredData.forEach((data: any) => {
              if (accMinMaxList[row].disMin == accMinMaxList[row].disMax) {
                data.targetDis = accMinMaxList[row].disMin;
              }
            });
          }

          var accTableList = this.dataSourceAcc.data;
          var newAccData = accTableList.filter((data: any) => data.isNewRow != undefined);

          let refAccSpendObj = {
            serviceType: "Ground",
            service: "",
            currentPercent: "",
            currentSpend: "",
            currentPercentType: "",
            count: "",
          }


          let spendSaveList: any = [];
          let newAccSpendData = accTableList.filter((data: any) => data.isNewRow != undefined || data.type == "New Web");

          newAccSpendData.forEach((data: any) => {
            let filteredList = this.accessorialCurrentDetails.filter((accData: any) => accData.service == data.service);
            let row = accTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = accTableList.findIndex((data2: any) => data2.service == data.service);

              refAccSpendObj.currentPercent = accMinMaxList[row].disMin;
              refAccSpendObj.service = data.service;
              refAccSpendObj.count = data.count;
              refAccSpendObj.currentPercentType = data.currentPercentType;
              refAccSpendObj.currentSpend = data.currentSpend.toString();

              spendSaveList.push(Object.assign({}, refAccSpendObj));
            }
            else {
              filteredList.forEach((accData: any) => {
                if (accMinMaxList[row].disMin == accMinMaxList[row].disMax) {
                  refAccSpendObj.currentPercent = accMinMaxList[row].disMin;
                  refAccSpendObj.count = data.count;
                  refAccSpendObj.currentPercentType = data.currentPercentType;
                }
                else {
                  refAccSpendObj.currentPercent = accData.currentPercent;
                  refAccSpendObj.count = accData.count;
                  refAccSpendObj.currentPercentType = accData.currentPercentType;
                }
                refAccSpendObj.service = data.service;
                refAccSpendObj.currentSpend = data.currentSpend.toString();
                spendSaveList.push(Object.assign({}, refAccSpendObj));
              })
            }
          });
          var freightAirTableList = this.dataSourceAir.data;
          var freightGroundTableList = this.dataSourceGround.data.filter((data: any) => !(data.weightRange.includes('Sub Total')));
          var freightIntlTableList = this.dataSourceIntl.data;
          let refFreightSpendObj = {
            service: "",
            newService: "",
            serviceGrouping: "",
            currentPercent: "",
            currentSpend: "",
            count: 0,
          }

          let freightSpendSaveList: any = [];
          let newAirSpendData = freightAirTableList.filter((data: any) => data.isNewRow != undefined || data.dataType == "New Web");
          newAirSpendData.forEach((data: any) => {
            let filteredList = this.freightCurrentDetails.filter((airData: any) => airData.service == data.service);
            let row = freightAirTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = freightAirTableList.findIndex((data2: any) => data2.service == data.service);

              refFreightSpendObj.currentPercent = airMinMaxList[row].disMin;
              refFreightSpendObj.service = data.service;
              refFreightSpendObj.newService = data.service;
              refFreightSpendObj.serviceGrouping = data.serviceGrouping;
              refFreightSpendObj.count = data.count;
              refFreightSpendObj.currentSpend = data.currentSpend.toString();

              freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (airMinMaxList[row].disMin == airMinMaxList[row].disMax) {
                  refFreightSpendObj.currentPercent = airMinMaxList[row].disMin;
                  refFreightSpendObj.count = data.count;
                }
                else {
                  refFreightSpendObj.currentPercent = airData.currentPercent;
                  refFreightSpendObj.count = airData.count;
                }
                refFreightSpendObj.service = data.service;
                refFreightSpendObj.newService = data.service;
                refFreightSpendObj.serviceGrouping = data.serviceGrouping;
                refFreightSpendObj.currentSpend = data.currentSpend.toString();
                freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
              })
            }
          });

          let newGroundSpendData = freightGroundTableList.filter((data: any) => !(data.weightRange.includes('Sub Total')) && (data.isNewRow != undefined || data.dataType == "New Web"));
          newGroundSpendData.forEach((data: any) => {
            let filteredList = this.freightCurrentDetails.filter((airData: any) => airData.service == data.service);
            let row = freightGroundTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = freightGroundTableList.findIndex((data2: any) => data2.service == data.service);

              refFreightSpendObj.currentPercent = groundMinMaxList[row].disMin;
              refFreightSpendObj.service = data.service;
              refFreightSpendObj.newService = data.service;
              refFreightSpendObj.serviceGrouping = data.serviceGrouping;
              refFreightSpendObj.count = data.count;
              refFreightSpendObj.currentSpend = data.currentSpend.toString();

              freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                  refFreightSpendObj.currentPercent = groundMinMaxList[row].disMin;
                  refFreightSpendObj.count = data.count;
                }
                else {
                  refFreightSpendObj.currentPercent = airData.currentPercent;
                  refFreightSpendObj.count = airData.count;
                }
                refFreightSpendObj.service = data.service;
                refFreightSpendObj.newService = data.service;
                refFreightSpendObj.serviceGrouping = data.serviceGrouping;
                refFreightSpendObj.currentSpend = data.currentSpend.toString();
                freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
              })
            }
          });

          let newIntlSpendData = freightIntlTableList.filter((data: any) => data.isNewRow != undefined || data.dataType == "New Web");
          newIntlSpendData.forEach((data: any) => {
            let filteredList = this.freightCurrentDetails.filter((airData: any) => airData.service == data.service);
            let row = freightIntlTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = freightIntlTableList.findIndex((data2: any) => data2.service == data.service);

              refFreightSpendObj.currentPercent = intlMinMaxList[row].disMin;
              refFreightSpendObj.service = data.service;
              refFreightSpendObj.newService = data.service;
              refFreightSpendObj.serviceGrouping = data.serviceGrouping;
              refFreightSpendObj.count = data.count;
              refFreightSpendObj.currentSpend = data.currentSpend.toString();

              freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (intlMinMaxList[row].disMin == intlMinMaxList[row].disMax) {
                  refFreightSpendObj.currentPercent = intlMinMaxList[row].disMin;
                  refFreightSpendObj.count = data.count;
                }
                else {
                  refFreightSpendObj.currentPercent = airData.currentPercent;
                  refFreightSpendObj.count = airData.count;
                }
                refFreightSpendObj.service = data.service;
                refFreightSpendObj.newService = data.service;
                refFreightSpendObj.serviceGrouping = data.serviceGrouping;
                refFreightSpendObj.currentSpend = data.currentSpend.toString();
                freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
              })
            }
          });

          //HWT 
          var hwtTableList = this.dataSourceHWT.data;

          let refHWTSpendObj = {
            service: "",
            newService: "",
            serviceGrouping: "",
            currentPercent: "",
            currentSpend: "",
            count: 0,
          }

          let hwtSpendSaveList: any = [];
          let newHWTSpendData = hwtTableList.filter((data: any) => data.isNewRow != undefined || data.dataType == "New Web");
          newHWTSpendData.forEach((data: any) => {
            let filteredList = this.freightCurrentDetails.filter((hwtData: any) => hwtData.service == data.service);
            let row = hwtTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = hwtTableList.findIndex((data2: any) => data2.service == data.service);

              refHWTSpendObj.currentPercent = hwtMinMaxList[row].disMin;
              refHWTSpendObj.service = data.service;
              refHWTSpendObj.newService = data.service;
              refHWTSpendObj.serviceGrouping = data.service;
              refHWTSpendObj.count = data.count;
              refHWTSpendObj.currentSpend = data.currentSpend.toString();

              hwtSpendSaveList.push(Object.assign({}, refHWTSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (hwtMinMaxList[row].disMin == hwtMinMaxList[row].disMax) {
                  refHWTSpendObj.currentPercent = hwtMinMaxList[row].disMin;
                  refHWTSpendObj.count = data.count;
                }
                else {
                  refHWTSpendObj.currentPercent = airData.currentPercent;
                  refHWTSpendObj.count = airData.count;
                }
                refHWTSpendObj.service = data.service;
                refHWTSpendObj.newService = data.service;
                refHWTSpendObj.serviceGrouping = data.service;
                refHWTSpendObj.currentSpend = data.currentSpend.toString();
                hwtSpendSaveList.push(Object.assign({}, refHWTSpendObj));
              })
            }
          });

          //dimFactor
          for (let row = 0; row < this.dimFactorList.length; row++) {
            var currentData = this.dimFactorList[row];
            var rowIndex = this.dimProposalList.findIndex((data: any) => data.criteria == currentData.criteria);
            this.dimProposalList[rowIndex].baselineDimFactor = currentData.baselineDimFactor;
          }

          //minreduction
          for (let row = 0; row < this.netAmountMinMaxList.length; row++) {
            var minType: any;
            if (this.netAmountMinMaxList[row].currentMin.includes('$')) {
              minType = '$';
            }
            else if (this.netAmountMinMaxList[row].currentMin.includes('%')) {
              minType = '%';
            }
            else {
              minType = '%';
            }

            var filteredData = this.airProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {

                if (this.netAmountMinMaxList[row].currentMin.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].currentMax.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                  data.targetMin = this.netAmountMinMaxList[row].currentMin.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                }


                data.minType = minType;
              });
            }

            var filteredData = this.groundProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {

                if (this.netAmountMinMaxList[row].currentMin.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].currentMax.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                  data.targetMin = this.netAmountMinMaxList[row].currentMin.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                }
                data.minType = minType;
              });
            }

            var filteredData = this.hwtProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {

                if (this.netAmountMinMaxList[row].currentMin.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].currentMax.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                  data.targetMin = this.netAmountMinMaxList[row].currentMin.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                }

                data.minType = minType;
              });
            }

            if (this.netAmountMinMaxList[row].service != undefined) {
              if (this.netAmountMinMaxList[row].service.toLowerCase().includes('international')) {
                var serviceList = this.minimumReductionList.filter((data: any) => data.service == this.netAmountMinMaxList[row].service);
                var intlServices: any = await this.getUniqueService(serviceList, 'subGroup');
                intlServices.forEach((serviceName: any) => {
                  var filteredData = this.intlProposalList.filter((data: any) => data.ratesheetName == serviceName);
                  if (filteredData[0] != undefined) {
                    filteredData.forEach((data: any) => {

                      if (this.netAmountMinMaxList[row].currentMin.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].currentMax.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                        data.targetMin = this.netAmountMinMaxList[row].currentMin.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                      }

                      data.minType = minType;
                    });
                  }
                })
              }
              else {
                var filteredData = this.intlProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
                if (filteredData[0] != undefined) {
                  filteredData.forEach((data: any) => {

                    if (this.netAmountMinMaxList[row].currentMin.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].currentMax.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                      data.targetMin = this.netAmountMinMaxList[row].currentMin.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                    }

                    data.minType = minType;
                  });
                }
              }
            }
          }

          for (let index = 0; index < this.airProposalList.length; index++) {
            this.airProposalList[index].targetId = clientObj['targetId'];
            this.airProposalList[index].type = "old";
            freightList.push(this.airProposalList[index]);
          }


          for (let index = 0; index < this.groundProposalList.length; index++) {
            this.groundProposalList[index].targetId = clientObj['targetId'];
            this.groundProposalList[index].type = "old";
            freightList.push(this.groundProposalList[index]);
          }


          for (let index = 0; index < this.intlProposalList.length; index++) {
            this.intlProposalList[index].targetId = clientObj['targetId'];
            this.intlProposalList[index].type = "old";
            if (this.intlProposalList[index].countryCode != "") {
              let zone = this.intlProposalList[index].zone1;
              let countryCode = this.intlProposalList[index].countryCode;
              this.intlProposalList[index].countryCode = zone;
              this.intlProposalList[index].zone1 = countryCode;
            }
            freightList.push(this.intlProposalList[index]);
          }

          for (let index = 0; index < this.hwtProposalList.length; index++) {
            this.hwtProposalList[index].type = "old";
            this.hwtProposalList[index].targetId = clientObj['targetId'];
            hwtList.push(this.hwtProposalList[index]);
          }

          for (let index = 0; index < this.dimProposalList.length; index++) {
            this.dimProposalList[index].targetId = clientObj['targetId'];
            dimList.push(this.dimProposalList[index]);
          }

          for (let index = 0; index < this.accessorialProposalList.length; index++) {
            this.accessorialProposalList[index].targetId = clientObj['targetId'];
            this.accessorialProposalList[index].targetDis = (Number(this.accessorialProposalList[index].targetDis) / 100).toFixed(4);
            accList.push(this.accessorialProposalList[index]);
          }


          for (let index = 0; index < spendSaveList.length; index++) {
            spendSaveList[index].currentPercent = (Number(spendSaveList[index].currentPercent) / 100).toFixed(4);
          }

          for (let index = 0; index < freightSpendSaveList.length; index++) {
            freightSpendSaveList[index].currentPercent = (Number(freightSpendSaveList[index].currentPercent) / 100).toFixed(4);
          }

          for (let index = 0; index < hwtSpendSaveList.length; index++) {
            hwtSpendSaveList[index].currentPercent = (Number(hwtSpendSaveList[index].currentPercent) / 100).toFixed(4);
          }

          clientObj['carrierName'] = this.carrierName;

          let result: any;

          if (this.carrierName.toLowerCase() == 'ups') {
            clientObj['clientId'] = Number(this.cookiesService.getCookieItem('clientId'));
            clientObj['clientName'] = this.selectedCarrier.clientName;

            for (let index = 0; index < freightList.length; index++) {
              freightList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < hwtList.length; index++) {
              hwtList[index].clientId = clientObj['clientId'];
            }

            for (let index = 0; index < dimList.length; index++) {
              dimList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < accList.length; index++) {
              accList[index].clientId = clientObj['clientId'];
            }

            clientObj['freightDetailsList'] = freightList;
            await this.httpclient.saveOrUpdateDiscountsGRI(clientObj).toPromise();

            clientObj['freightDetailsList'] = hwtList;
            await this.httpclient.saveOrUpdateDiscountsHWTGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;

            await this.httpclient.saveOrUpdateAccountNumberGRI(clientObj).toPromise();

            clientObj['type'] = "Current";
            clientObj['accDetailsList'] = accList;
            await this.httpclient.saveOrUpdateAccDiscountsGRI(clientObj).toPromise();

            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            await this.httpclient.saveOrUpdateAccDetailsGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            await this.httpclient.saveOrUpdateFreightDetailsGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            await this.httpclient.saveOrUpdateHWTDetailsGRI(clientObj).toPromise();

            var targetObj: any = {};
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
            targetObj['targetId'] = clientObj['targetId']
            targetObj['carrierName'] = this.carrierName;
            targetObj['type'] = 'Current';


            result = await this.httpclient.generateProposalGRI(targetObj).toPromise().catch((err) => {
              console.log(err);
              this.closeLoading();
            });
          }
          else {
            clientObj['clientId'] = this.fedexClientId;;
            clientObj['clientName'] = this.selectedCarrier.clientName;

            for (let index = 0; index < freightList.length; index++) {
              freightList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < hwtList.length; index++) {
              hwtList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < dimList.length; index++) {
              dimList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < accList.length; index++) {
              accList[index].clientId = clientObj['clientId'];
            }

            clientObj['freightDetailsList'] = freightList;
            await this.fedexService.saveOrUpdateDiscountsGRI(clientObj).toPromise();

            clientObj['freightDetailsList'] = hwtList;
            await this.fedexService.saveOrUpdateDiscountsHWTGRI(clientObj).toPromise();

            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;
            await this.fedexService.saveOrUpdateAccountNumberGRI(clientObj).toPromise();

            clientObj['type'] = "Current";
            clientObj['accDetailsList'] = accList;
            await this.fedexService.saveOrUpdateAccDiscountsGRI(clientObj).toPromise();

            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            await this.fedexService.saveOrUpdateAccDetailsGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            await this.fedexService.saveOrUpdateFreightDetailsGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            await this.fedexService.saveOrUpdateHWTDetailsGRI(clientObj).toPromise();

            var targetObj: any = {};
            targetObj['clientId'] = this.fedexClientId;
            targetObj['targetId'] = clientObj['targetId'];
            targetObj['carrierName'] = this.carrierName;
            targetObj['type'] = 'Current';
            result = await this.fedexService.generateProposalGRI(targetObj).toPromise().catch((err) => {
              console.log(err);
              this.closeLoading();
            });
          }

          let serviceBreakUpList = [];

          let fullCheckList = [...this.initialAccCheckList];

          this.accCheckList.forEach(accService => {
            if (!fullCheckList.includes(accService)) {
              fullCheckList.push(accService);
            }
          });

          for (let row = 0; row < fullCheckList.length; row++) {

            let splitupData = this.currentSavingsAccList.filter((accData: any) => accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase() == fullCheckList[row]);

            let reqData = {};
            if (splitupData[0] != undefined) {
              reqData = {
                service: splitupData[0].serviceName,
                serviceType: splitupData[0].ratesheetGrouping,
                targetId: '',
                serviceBreakup: true
              };
            }
            else {
              splitupData = this.accessorialCurrentDetails.filter((accData: any) => accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase() == fullCheckList[row]);
              reqData = {
                service: splitupData[0].serviceName,
                serviceType: splitupData[0].ratesheetGrouping,
                targetId: '',
                serviceBreakup: false
              };
            }

            serviceBreakUpList.push(reqData);
          }

          var param = {
            type: "Target",
            targetId: '',
            clientName: this.selectedCarrier.clientName.replaceAll(" ", ''),
            accDetailsList: serviceBreakUpList
          };

          if (this.carrierName.toLowerCase() == 'ups') {
            await this.httpclient.saveorUpdateServiceBreakupGRI(param).toPromise();
          }
          else {
            await this.fedexService.saveorUpdateServiceBreakupGRI(param).toPromise();
          }

          this.closeLoading();
          var alertDialog = await this.openSaveAlert("Baseline Spend", result);

          alertDialog.afterClosed().subscribe(
            async () => {

              this.currentChanged = true;
              this.loaded = false;
              await this.saveProposal(0);

            });
          this.editable.set(false);
        }
        else {
          await this.saveProposal(0);
        }
      });
    }
    else {
      await this.saveProposal(0);
    }
  }

  async saveProposal(columnNumber: any) {

    // ✅ SAFETY GUARD
    const scenario = this.scenariosDisplayed?.[columnNumber];
    if (!scenario) {
      console.warn('Invalid scenario for column:', columnNumber);
      return false;
    }

    var isAnythingChanged = false;

    var airMinMaxList = scenario.airMinMaxList || [];
    var groundMinMaxList = (scenario.groundMinMaxList || []).filter((data: any) => !((data?.service || '').includes('Sub Total')));
    var intlMinMaxList = scenario.intlMinMaxList || [];
    var hwtMinMaxList = scenario.hwtMinMaxList || [];
    var accMinMaxList = scenario.accMinMaxList || [];

    var airMinMaxListOld = scenario.airMinMaxListOld || [];
    var groundMinMaxListOld = (scenario.groundMinMaxListOld || []).filter((data: any) => !((data?.service || '').includes('Sub Total')));
    var intlMinMaxListOld = scenario.intlMinMaxListOld || [];
    var hwtMinMaxListOld = scenario.hwtMinMaxListOld || [];
    var accMinMaxListOld = scenario.accMinMaxListOld || [];

    let accDataList = scenario.dataSourceAccTarget?.data || [];
    let accDataListOld = scenario.targetAccListOld || [];

    var targetTierOld = "";
    this.targetSavingsHWTList = scenario.targetHWTListOld || [];

    targetTierOld = await this.setHWTMinMax('target');

    if (this.scenariosDisplayed[columnNumber].targetTier != targetTierOld) {
      isAnythingChanged = true;
    }

    if (airMinMaxList.length > 0) {
      for (let row = 0; row < airMinMaxList.length; row++) {
        if (JSON.stringify(airMinMaxList[row]) !== JSON.stringify(airMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (groundMinMaxList.length > 0) {
      for (let row = 0; row < groundMinMaxList.length; row++) {
        if (JSON.stringify(groundMinMaxList[row]) !== JSON.stringify(groundMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (intlMinMaxList.length > 0) {
      for (let row = 0; row < intlMinMaxList.length; row++) {
        if (JSON.stringify(intlMinMaxList[row]) !== JSON.stringify(intlMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (hwtMinMaxList.length > 0) {
      for (let row = 0; row < hwtMinMaxList.length; row++) {
        if (JSON.stringify(hwtMinMaxList[row]) !== JSON.stringify(hwtMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    if (accMinMaxList.length > 0) {
      for (let row = 0; row < accMinMaxList.length; row++) {
        if (JSON.stringify(accMinMaxList[row]) !== JSON.stringify(accMinMaxListOld[row])) {
          isAnythingChanged = true;
        }
      }
    }

    //for spend check
    if (accDataList.length > 0) {
      for (let row = 0; row < accDataList.length; row++) {
        if (accDataListOld[row] != undefined) {
          if (accDataList[row].targetSpend != accDataListOld[row].targetSpend) {
            isAnythingChanged = true;
          }
        }
        else {
          isAnythingChanged = true;
        }
      }
    }

    if (this.dimFactorList.length > 0) {
      for (let row = 0; row < this.dimFactorList.length; row++) {
        if (columnNumber == 0) {
          if (this.dimFactorList[row].targetDimDivisor != this.dimFactorListOld[row].targetDimDivisor) {
            isAnythingChanged = true;
          }
        }
        else if (columnNumber == 1) {
          if (this.dimFactorList[row].proposalDimDivisor != this.dimFactorListOld[row].proposalDimDivisor) {
            isAnythingChanged = true;
          }
        }
      }
    }

    if (this.netAmountMinMaxList.length > 0) {
      for (let row = 0; row < this.netAmountMinMaxList.length; row++) {
        if (columnNumber == 0) {
          if (this.netAmountMinMaxList[row].target1Max != this.netAmountMinMaxListOld[row].target1Max || this.netAmountMinMaxList[row].target1Min != this.netAmountMinMaxListOld[row].target1Min) {
            isAnythingChanged = true;
          }
        }
        else if (columnNumber == 1) {
          if (this.netAmountMinMaxList[row].target2Max != this.netAmountMinMaxListOld[row].target2Max || this.netAmountMinMaxList[row].target2Min != this.netAmountMinMaxListOld[row].target2Min) {
            isAnythingChanged = true;
          }
        }
      }
    }

    if (isAnythingChanged == true || this.isAnythingChangedNewWebTarget1 == true) {
      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = 'page-dark'
      }

      var editSaveDialog = this.dialog.open(DashBoardSaveAlertGRIComponent, {
        disableClose: true,
        width: '500px',
        height: 'auto',
        panelClass: panelClass,
        data: { message: "Do you want to save these changes to the existing agreement?", agreementList: this.totalScenarios, targetId: this.scenariosDisplayed[columnNumber].targetId }
      });
      editSaveDialog.afterClosed().subscribe(async (resultData: any) => {
        if (resultData.result == true) {
          this.openLoading();
          // await this.getProposalList(resultData.scenario);
          await this.getHWTAccountsList(resultData.scenario.targetId, "Edit");
          var clientObj: any = {};
          clientObj['targetId'] = Number(resultData.scenario.targetId);
          var freightList = [];
          var hwtList = [];
          var dimList = [];
          var accList = [];

          if (resultData.create) {
            if (this.carrierName.toLowerCase() == 'ups') {
              var targetObj: any = {};
              targetObj['targetName'] = resultData.proposalName;
              targetObj['targetNickName'] = resultData.proposalNickname;
              targetObj['carrierName'] = resultData.scenario.carrierName;
              targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
              if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
                targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
              }
              targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
              var targetDetails = await this.httpclient.saveOrUpdateTargetDetailsGRI(targetObj).toPromise();
              clientObj['targetId'] = targetDetails[0].targetId;
            }
            else {
              var targetObj: any = {};
              targetObj['targetName'] = resultData.proposalName;
              targetObj['targetNickName'] = resultData.proposalNickname;
              targetObj['carrierName'] = resultData.scenario.carrierName;
              targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
              if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
                targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
              }
              targetObj['clientId'] = this.fedexClientId;
              var targetDetails = await this.fedexService.saveOrUpdateTargetDetailsGRI(targetObj).toPromise();
              clientObj['targetId'] = targetDetails[0].targetId;
            }
          }

          //air
          for (let row = 0; row < airMinMaxList.length; row++) {
            var filteredData = this.scenariosDisplayed[columnNumber].airProposalList.filter((data: any) => data.shortName == airMinMaxList[row].service);
            filteredData.forEach((data: any) => {
              if (airMinMaxList[row].disMin == airMinMaxList[row].disMax) {
                data.targetDis = airMinMaxList[row].disMin;
              }
            });
          }

          //ground
          for (let row = 0; row < groundMinMaxList.length; row++) {
            let testList = [];
            var serviceList = groundMinMaxList.filter((data: any) => data.name == groundMinMaxList[row].name);
            if (serviceList.length > 1) {
              if (groundMinMaxList[row + 1] != undefined) {
                if (groundMinMaxList[row].name != groundMinMaxList[row + 1].name) {
                  groundMinMaxList[row].weightTo = 1000;
                }
              }
            }

            var serviceName = groundMinMaxList[row].name;
            var fromWeight = Number(groundMinMaxList[row].weightFrom);
            var toWeight = Number(groundMinMaxList[row].weightTo);
            if (groundMinMaxList[row - 1] != undefined) {
              var previousFromWeight = Number(groundMinMaxList[row - 1].weightFrom);
              var previousToWeight = Number(groundMinMaxList[row - 1].weightTo);
            }
            var listNotAvailable = false; //true if both fromweight and to weight is not available,otherwise becomes false
            var trueList = false; // true if both 
            var filteredData = this.scenariosDisplayed[columnNumber].groundProposalList.filter((data: any) => {

              if (data.shortName == serviceName && Number(data.weightFrom) >= fromWeight && Number(data.weightTo) <= toWeight) {
                trueList = true;
                return (data.shortName == serviceName && Number(data.weightFrom) >= fromWeight && Number(data.weightTo) <= toWeight);
              }
              else if (data.shortName == serviceName && Number(data.weightFrom) == fromWeight && Number(data.weightTo) != toWeight) {
                return (data.shortName == serviceName && Number(data.weightFrom) == fromWeight && Number(data.weightTo) != toWeight);
              }
              else if (data.shortName == serviceName && Number(data.weightFrom) != fromWeight && Number(data.weightTo) == toWeight) {
                return (data.shortName == serviceName && Number(data.weightFrom) != fromWeight && Number(data.weightTo) == toWeight);
              }
              return false;
            });

            if (filteredData[0] == undefined) {
              listNotAvailable = true;
            }
            //if from weight or to weight is not found then list with previous weight is taken. 
            if (filteredData[0] == undefined) {
              var filteredData = this.scenariosDisplayed[columnNumber].groundProposalList.filter((data: any) => {
                if (data.shortName == serviceName && Number(data.weightFrom) >= previousFromWeight && Number(data.weightTo) <= previousToWeight) {
                  return (data.shortName == serviceName && Number(data.weightFrom) >= previousFromWeight && Number(data.weightTo) <= previousToWeight);
                }
                return false;
              });
            }

            if (listNotAvailable) {

              filteredData.forEach((data: any) => {
                var objectData = Object.assign({}, data);
                objectData.weightFrom = groundMinMaxList[row].weightFrom;
                objectData.weightTo = groundMinMaxList[row].weightTo;
                objectData.frtRatesheetId = 0;
                if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                  objectData.targetDis = groundMinMaxList[row].disMin;
                }
                this.scenariosDisplayed[columnNumber].groundProposalList.push(Object.assign({}, objectData));
                testList.push(Object.assign({}, data));
              });
            }
            else {
              if (trueList) {
                filteredData.forEach((data: any) => {
                  if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                    data.targetDis = groundMinMaxList[row].disMin;
                    data.weightFrom = groundMinMaxList[row].weightFrom;
                    data.weightTo = groundMinMaxList[row].weightTo;
                  }
                });
              }
              else {
                let duplicateList: any = [];
                filteredData.forEach((data: any) => duplicateList.push(Object.assign({}, data)));
                duplicateList.forEach((data: any) => {
                  if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                    data.targetDis = groundMinMaxList[row].disMin;
                  }
                  data.frtRatesheetId = 0;
                  data.weightFrom = groundMinMaxList[row].weightFrom;
                  data.weightTo = groundMinMaxList[row].weightTo;
                  this.scenariosDisplayed[columnNumber].groundProposalList.push(Object.assign({}, data));
                  testList.push(Object.assign({}, data));
                });

              }
            }
          }


          let deleteList: any = [];
          for (let row = 0; row < groundMinMaxList.length; row++) {
            // if (JSON.stringify(groundMinMaxList[row]) !== JSON.stringify(groundMinMaxListOld[row])) {

            let checkList = groundMinMaxList.filter((data: any) => data.name == groundMinMaxList[row].name);
            if (checkList.length > 1) {
              var filteredData = this.scenariosDisplayed[columnNumber].groundProposalList.filter((data: any) => {
                if (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo)))) {
                  return (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))))
                }
                return false;
              });

              if (filteredData[0] != undefined) {
                filteredData.forEach((data: any) => {
                  deleteList.push(Object.assign({}, data));
                  var rowIndex = this.scenariosDisplayed[columnNumber].groundProposalList.findIndex((data2: any) => JSON.stringify(data2) == JSON.stringify(data));
                  this.scenariosDisplayed[columnNumber].groundProposalList.splice(rowIndex, 1);
                });
              }
            }
            else {
              if (groundMinMaxList[row].disMin != groundMinMaxList[row].disMax) {
                continue;
              }
              else {
                var filteredData = this.scenariosDisplayed[columnNumber].groundProposalList.filter((data: any) => {
                  if (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)))) {
                    return (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))))
                  }
                  return false;
                });

                if (filteredData[0] != undefined) {
                  filteredData.forEach((data: any) => {
                    deleteList.push(Object.assign({}, data));
                    var rowIndex = this.scenariosDisplayed[columnNumber].groundProposalList.findIndex((data2: any) => JSON.stringify(data2) == JSON.stringify(data));
                    this.scenariosDisplayed[columnNumber].groundProposalList.splice(rowIndex, 1);
                  });
                }
              }
            }


          }

          if (deleteList.length > 0) await this.deleteRowFRTRatesheet(deleteList, this.scenariosDisplayed[columnNumber]);
          for (let row = 0; row < intlMinMaxList.length; row++) {
            var filteredData = this.scenariosDisplayed[columnNumber].intlProposalList.filter((data: any) => data.shortName == intlMinMaxList[row].service);
            filteredData.forEach((data: any) => {
              if (intlMinMaxList[row].disMin == intlMinMaxList[row].disMax) {
                data.targetDis = intlMinMaxList[row].disMin;
              }
            });
          }
          for (let row = 0; row < hwtMinMaxList.length; row++) {
            var filteredData = this.scenariosDisplayed[columnNumber].hwtProposalList.filter((data: any) => data.shortName == hwtMinMaxList[row].service);
            filteredData.forEach((data: any) => {
              if (hwtMinMaxList[row].disMin == hwtMinMaxList[row].disMax) {
                data.targetDis = hwtMinMaxList[row].disMin;
              }
              if (hwtMinMaxList[row].amountMin == hwtMinMaxList[row].amountMax) {
                data.hwtTier = hwtMinMaxList[row].amountMin;
              }
            });
          }

          if (this.scenariosDisplayed[columnNumber].targetTier != targetTierOld) {
            this.hwtAccountNumbersList.forEach((data: any) => {
              data.hwtTier = this.scenariosDisplayed[columnNumber].targetTier;
              data.targetId = clientObj['targetId'];
            })
          }

          var refAccObj = {
            accRatesheetId: 0,
            carrier: "",
            clientId: (this.carrierName.toLowerCase() == 'ups') ? this.cookiesService.getCookieItem('adminName') : this.fedexClientId,
            containerType: "",
            currentDis: "",
            currentDisType: "",
            currentSpend: "",
            field: "",
            fieldVal: "",
            netSpend: "",
            service: "",
            serviceType: "Ground",
            subGroup: "",
            targetDis: 0,
            targetDisType: "%",
            targetId: '',
            targetSpend: "",
            type: "",
            weightFrom: "",
            weightTo: ""
          }

          //acc
          for (let row = 0; row < accMinMaxList.length; row++) {

            if (accMinMaxList[row].serviceType == "All") {
              var filteredData = this.scenariosDisplayed[columnNumber].accessorialProposalList.filter((data: any) => data.service == accMinMaxList[row].serviceName);
            }
            else if (accMinMaxList[row].serviceType == "Remaining Services") {
              var filteredData = this.scenariosDisplayed[columnNumber].accessorialProposalList.filter((data: any) => data.service == accMinMaxList[row].serviceName && !this.accCheckList.includes(data.subGroup.toLowerCase() + data.serviceType.toLowerCase() + data.service.toLowerCase()));
            }
            else {
              var filteredData = this.scenariosDisplayed[columnNumber].accessorialProposalList.filter((data: any) => data.service == accMinMaxList[row].serviceName && accMinMaxList[row].ratesheetGrouping == (data.subGroup + data.serviceType));
            }


            filteredData.forEach((data: any) => {
              if (accMinMaxList[row].disMin == accMinMaxList[row].disMax) {
                data.targetDis = accMinMaxList[row].disMin;
              }
            });
          }


          var accTableList = this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data;
          var newAccData = accTableList.filter((data: any) => data.isNewRow != undefined);
          let refAccSpendObj = {
            serviceType: "Ground",
            service: "",
            targetPercent: "",
            targetSpend: "",
            targetPercentType: "",
            count: "",
            targetId: 0,
          }

          let spendSaveList: any = [];
          let newAccSpendData = accTableList.filter((data: any) => data.isNewRow != undefined || data.type == "New Web");

          newAccSpendData.forEach((data: any) => {
            let filteredList = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((accData: any) => accData.service == data.service);
            let row = accTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = accTableList.findIndex((data2: any) => data2.service == data.service);

              refAccSpendObj.targetPercent = accMinMaxList[row].disMin;
              refAccSpendObj.service = data.service;
              refAccSpendObj.count = data.count;
              refAccSpendObj.targetPercentType = data.targetPercentType;
              refAccSpendObj.targetSpend = data.targetSpend.toString();

              spendSaveList.push(Object.assign({}, refAccSpendObj));
            }
            else {
              filteredList.forEach((accData: any) => {
                if (accMinMaxList[row].disMin == accMinMaxList[row].disMax) {
                  refAccSpendObj.targetPercent = accMinMaxList[row].disMin;
                  refAccSpendObj.count = data.count;
                  refAccSpendObj.targetPercentType = data.targetPercentType;
                }
                else {
                  refAccSpendObj.targetPercent = accData.targetPercent;
                  refAccSpendObj.count = accData.count;
                  refAccSpendObj.targetPercentType = accData.targetPercentType;
                }
                refAccSpendObj.service = data.service;
                refAccSpendObj.targetSpend = data.targetSpend.toString();
                spendSaveList.push(Object.assign({}, refAccSpendObj));
              })
            }
          });

          //Freight 
          var freightAirTableList = this.scenariosDisplayed[columnNumber].dataSourceAirTarget.data;
          var freightGroundTableList = this.scenariosDisplayed[columnNumber].dataSourceGroundTarget.data.filter((data: any) => !(data.weightRange.includes('Sub Total')));
          var freightIntlTableList = this.scenariosDisplayed[columnNumber].dataSourceIntlTarget.data;

          let refFreightSpendObj = {
            service: "",
            newService: "",
            serviceGrouping: "",
            targetPercent: "",
            targetSpend: "",
            count: 0,
            targetId: 0,
          }

          let freightSpendSaveList: any = [];
          let newAirSpendData = freightAirTableList.filter((data: any) => data.isNewRow != undefined || data.dataType == "New Web");
          newAirSpendData.forEach((data: any) => {
            let filteredList = this.scenariosDisplayed[columnNumber].freightTargetDetails.filter((airData: any) => airData.service == data.service);
            let row = freightAirTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = freightAirTableList.findIndex((data2: any) => data2.service == data.service);

              refFreightSpendObj.targetPercent = airMinMaxList[row].disMin;
              refFreightSpendObj.service = data.service;
              refFreightSpendObj.newService = data.service;
              refFreightSpendObj.serviceGrouping = data.serviceGrouping;
              refFreightSpendObj.targetSpend = data.targetSpend.toString();

              freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (airMinMaxList[row].disMin == airMinMaxList[row].disMax) {
                  refFreightSpendObj.targetPercent = airMinMaxList[row].disMin;
                }
                else {
                  refFreightSpendObj.targetPercent = airData.currentPercent;
                }
                refFreightSpendObj.service = data.service;
                refFreightSpendObj.newService = data.service;
                refFreightSpendObj.serviceGrouping = data.serviceGrouping;
                refFreightSpendObj.targetSpend = data.targetSpend.toString();
                freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
              })
            }
          });

          let newGroundSpendData = freightGroundTableList.filter((data: any) => !(data.weightRange.includes('Sub Total')) && (data.isNewRow != undefined || data.dataType == "New Web"));
          newGroundSpendData.forEach((data: any) => {
            let filteredList = this.scenariosDisplayed[columnNumber].freightTargetDetails.filter((airData: any) => airData.service == data.service);
            let row = freightGroundTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = freightGroundTableList.findIndex((data2: any) => data2.service == data.service);

              refFreightSpendObj.targetPercent = groundMinMaxList[row].disMin;
              refFreightSpendObj.service = data.service;
              refFreightSpendObj.newService = data.service;
              refFreightSpendObj.serviceGrouping = data.serviceGrouping;
              refFreightSpendObj.targetSpend = data.targetSpend.toString();

              freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
                  refFreightSpendObj.targetPercent = groundMinMaxList[row].disMin;
                }
                else {
                  refFreightSpendObj.targetPercent = airData.currentPercent;
                }
                refFreightSpendObj.service = data.service;
                refFreightSpendObj.newService = data.service;
                refFreightSpendObj.serviceGrouping = data.serviceGrouping;
                refFreightSpendObj.targetSpend = data.targetSpend.toString();
                freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
              })
            }
          });

          let newIntlSpendData = freightIntlTableList.filter((data: any) => data.isNewRow != undefined || data.dataType == "New Web");
          newIntlSpendData.forEach((data: any) => {
            let filteredList = this.scenariosDisplayed[columnNumber].freightTargetDetails.filter((airData: any) => airData.service == data.service);
            let row = freightIntlTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = freightIntlTableList.findIndex((data2: any) => data2.service == data.service);

              refFreightSpendObj.targetPercent = intlMinMaxList[row].disMin;
              refFreightSpendObj.service = data.service;
              refFreightSpendObj.newService = data.service;
              refFreightSpendObj.serviceGrouping = data.serviceGrouping;
              refFreightSpendObj.targetSpend = data.targetSpend.toString();

              freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (intlMinMaxList[row].disMin == intlMinMaxList[row].disMax) {
                  refFreightSpendObj.targetPercent = intlMinMaxList[row].disMin;
                }
                else {
                  refFreightSpendObj.targetPercent = airData.targetPercent;
                }
                refFreightSpendObj.service = data.service;
                refFreightSpendObj.newService = data.service;
                refFreightSpendObj.serviceGrouping = data.serviceGrouping;
                refFreightSpendObj.targetSpend = data.targetSpend.toString();
                freightSpendSaveList.push(Object.assign({}, refFreightSpendObj));
              })
            }
          });

          //HWT 
          var hwtTableList = this.scenariosDisplayed[columnNumber].dataSourceHWTTarget.data;

          let refHWTSpendObj = {
            service: "",
            newService: "",
            serviceGrouping: "",
            targetPercent: "",
            targetSpend: "",
            count: 0,
            targetId: 0,
          }

          let hwtSpendSaveList: any = [];
          let newHWTSpendData = hwtTableList.filter((data: any) => data.isNewRow != undefined || data.dataType == "New Web");
          newHWTSpendData.forEach((data: any) => {
            let filteredList = this.scenariosDisplayed[columnNumber].freightTargetDetails.filter((hwtData: any) => hwtData.service == data.service);
            let row = hwtTableList.findIndex((data2: any) => data2.service == data.service);
            if (filteredList.length <= 1) {
              let row = hwtTableList.findIndex((data2: any) => data2.service == data.service);

              refHWTSpendObj.targetPercent = hwtMinMaxList[row].disMin;
              refHWTSpendObj.service = data.service;
              refHWTSpendObj.newService = data.service;
              refHWTSpendObj.serviceGrouping = data.service;
              refHWTSpendObj.targetSpend = data.targetSpend.toString();

              hwtSpendSaveList.push(Object.assign({}, refHWTSpendObj));
            }
            else {
              filteredList.forEach((airData: any) => {
                if (hwtMinMaxList[row].disMin == hwtMinMaxList[row].disMax) {
                  refHWTSpendObj.targetPercent = hwtMinMaxList[row].disMin;
                }
                else {
                  refHWTSpendObj.targetPercent = airData.targetPercent;
                }
                refHWTSpendObj.service = data.service;
                refHWTSpendObj.newService = data.service;
                refHWTSpendObj.serviceGrouping = data.service;
                refHWTSpendObj.targetSpend = data.targetSpend.toString();
                hwtSpendSaveList.push(Object.assign({}, refHWTSpendObj));
              })
            }
          });

          for (let row = 0; row < this.dimFactorList.length; row++) {
            var currentData = this.dimFactorList[row];
            var rowIndex = this.scenariosDisplayed[columnNumber].dimProposalList.findIndex((data: any) => data.criteria == currentData.criteria);
            if (columnNumber == 0) {
              this.scenariosDisplayed[columnNumber].dimProposalList[rowIndex].targetDimDivisor = currentData.targetDimDivisor;
            }
            else if (columnNumber == 1) {
              this.scenariosDisplayed[columnNumber].dimProposalList[rowIndex].targetDimDivisor = currentData.proposalDimDivisor;
            }
          }

          //minreduction
          for (let row = 0; row < this.netAmountMinMaxList.length; row++) {
            var minType: any;
            if (columnNumber == 0) {
              if (this.netAmountMinMaxList[row].target1Min.includes('$')) {
                minType = '$';
              }
              else if (this.netAmountMinMaxList[row].target1Min.includes('%')) {
                minType = '%';
              }
              else {
                minType = '%';
              }
            }
            else {
              if (this.netAmountMinMaxList[row].target2Min.includes('$')) {
                minType = '$';
              }
              else if (this.netAmountMinMaxList[row].target2Min.includes('%')) {
                minType = '%';
              }
              else {
                minType = '%';
              }
            }

            var filteredData = this.scenariosDisplayed[columnNumber].airProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {
                if (columnNumber == 0) {
                  if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                    data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                  }

                }
                else {
                  if (this.netAmountMinMaxList[row].target2Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target2Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                    data.targetMin = this.netAmountMinMaxList[row].target2Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                  }
                }
                data.minType = minType;
              });
            }

            var filteredData = this.scenariosDisplayed[columnNumber].groundProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {
                if (columnNumber == 0) {
                  if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                    data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                  }
                }
                else {
                  if (this.netAmountMinMaxList[row].target2Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target2Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                    data.targetMin = this.netAmountMinMaxList[row].target2Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                  }
                }
                data.minType = minType;
              });
            }

            var filteredData = this.scenariosDisplayed[columnNumber].hwtProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {
                if (columnNumber == 0) {
                  if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                    data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                  }
                }
                else {
                  if (this.netAmountMinMaxList[row].target2Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target2Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                    data.targetMin = this.netAmountMinMaxList[row].target2Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                  }
                }
                data.minType = minType;
              });
            }

            if (this.netAmountMinMaxList[row].service != undefined) {
              if (this.netAmountMinMaxList[row].service.toLowerCase().includes('international')) {
                var serviceList = this.minimumReductionList.filter((data: any) => data.service == this.netAmountMinMaxList[row].service);
                var intlServices = await this.getUniqueService(serviceList, 'subGroup');
                intlServices.forEach((serviceName: any) => {
                  var filteredData = this.scenariosDisplayed[columnNumber].intlProposalList.filter((data: any) => data.ratesheetName == serviceName);
                  if (filteredData[0] != undefined) {
                    filteredData.forEach((data: any) => {
                      if (columnNumber == 0) {
                        if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                          data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                        }
                      }
                      else {
                        if (this.netAmountMinMaxList[row].target2Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target2Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                          data.targetMin = this.netAmountMinMaxList[row].target2Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                        }
                      }
                      data.minType = minType;
                    });
                  }
                })
              }
              else {
                var filteredData = this.scenariosDisplayed[columnNumber].intlProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
                if (filteredData[0] != undefined) {
                  filteredData.forEach((data: any) => {
                    if (columnNumber == 0) {
                      if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                        data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                      }
                    }
                    else {
                      if (this.netAmountMinMaxList[row].target2Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target2Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                        data.targetMin = this.netAmountMinMaxList[row].target2Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                      }
                      data.minType = minType;
                    }
                  });
                }
              }
            }
          }

          for (let index = 0; index < this.scenariosDisplayed[columnNumber].airProposalList.length; index++) {
            if (resultData.create) {
              this.scenariosDisplayed[columnNumber].airProposalList[index].frtRatesheetId = 0;
            }
            this.scenariosDisplayed[columnNumber].airProposalList[index].type = "future";
            this.scenariosDisplayed[columnNumber].airProposalList[index].targetId = clientObj['targetId'];
            freightList.push(this.scenariosDisplayed[columnNumber].airProposalList[index]);
          }

          for (let index = 0; index < this.scenariosDisplayed[columnNumber].groundProposalList.length; index++) {
            if (resultData.create) {
              this.scenariosDisplayed[columnNumber].groundProposalList[index].frtRatesheetId = 0;
            }
            this.scenariosDisplayed[columnNumber].groundProposalList[index].type = "future";
            this.scenariosDisplayed[columnNumber].groundProposalList[index].targetId = clientObj['targetId'];
            freightList.push(this.scenariosDisplayed[columnNumber].groundProposalList[index]);
          }

          for (let index = 0; index < this.scenariosDisplayed[columnNumber].intlProposalList.length; index++) {
            if (resultData.create) {
              this.scenariosDisplayed[columnNumber].intlProposalList[index].frtRatesheetId = 0;
            }
            this.scenariosDisplayed[columnNumber].intlProposalList[index].type = "future";
            this.scenariosDisplayed[columnNumber].intlProposalList[index].targetId = clientObj['targetId'];

            if (this.scenariosDisplayed[columnNumber].intlProposalList[index].countryCode != "") {
              let zone = this.scenariosDisplayed[columnNumber].intlProposalList[index].zone1;
              let countryCode = this.scenariosDisplayed[columnNumber].intlProposalList[index].countryCode;
              this.scenariosDisplayed[columnNumber].intlProposalList[index].zone1 = countryCode;
              this.scenariosDisplayed[columnNumber].intlProposalList[index].countryCode = zone;
            }
            freightList.push(this.scenariosDisplayed[columnNumber].intlProposalList[index]);
          }

          for (let index = 0; index < this.scenariosDisplayed[columnNumber].hwtProposalList.length; index++) {
            if (resultData.create) {
              this.scenariosDisplayed[columnNumber].hwtProposalList[index].frtRatesheetId = 0;
            }
            // this.hwtProposalList[index].hwtTier = this.scenariosDisplayed[columnNumber].targetTier;
            this.scenariosDisplayed[columnNumber].hwtProposalList[index].type = "future";
            this.scenariosDisplayed[columnNumber].hwtProposalList[index].targetId = clientObj['targetId'];
            hwtList.push(this.scenariosDisplayed[columnNumber].hwtProposalList[index]);
          }

          for (let index = 0; index < this.scenariosDisplayed[columnNumber].dimProposalList.length; index++) {
            if (resultData.create) {
              this.scenariosDisplayed[columnNumber].dimProposalList[index].dimDetailid = 0;
            }
            this.scenariosDisplayed[columnNumber].dimProposalList[index].targetId = clientObj['targetId'];
            dimList.push(this.scenariosDisplayed[columnNumber].dimProposalList[index]);
          }

          for (let index = 0; index < this.scenariosDisplayed[columnNumber].accessorialProposalList.length; index++) {
            if (resultData.create) {
              this.scenariosDisplayed[columnNumber].accessorialProposalList[index].accRatesheetId = 0;
            }
            this.scenariosDisplayed[columnNumber].accessorialProposalList[index].targetId = clientObj['targetId'];
            this.scenariosDisplayed[columnNumber].accessorialProposalList[index].targetDis = (Number(this.scenariosDisplayed[columnNumber].accessorialProposalList[index].targetDis) / 100).toFixed(4);
            accList.push(this.scenariosDisplayed[columnNumber].accessorialProposalList[index]);
          }

          for (let index = 0; index < spendSaveList.length; index++) {
            spendSaveList[index].targetPercent = (Number(spendSaveList[index].targetPercent) / 100).toFixed(4);
            spendSaveList[index].targetId = clientObj['targetId'];
          }

          for (let index = 0; index < freightSpendSaveList.length; index++) {
            freightSpendSaveList[index].targetPercent = (Number(freightSpendSaveList[index].targetPercent) / 100).toFixed(4);
            freightSpendSaveList[index].targetId = clientObj['targetId'];
          }

          for (let index = 0; index < hwtSpendSaveList.length; index++) {
            hwtSpendSaveList[index].targetPercent = (Number(hwtSpendSaveList[index].targetPercent) / 100).toFixed(4);
            hwtSpendSaveList[index].targetId = clientObj['targetId'];
          }

          clientObj['carrierName'] = resultData.scenario.carrierName;
          if (this.carrierName.toLowerCase() == 'ups') {
            clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
            clientObj['clientName'] = this.selectedCarrier.clientName;

            for (let index = 0; index < freightList.length; index++) {
              freightList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < hwtList.length; index++) {
              hwtList[index].clientId = clientObj['clientId'];
            }

            for (let index = 0; index < dimList.length; index++) {
              dimList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < accList.length; index++) {
              accList[index].clientId = clientObj['clientId'];
            }

            clientObj['freightDetailsList'] = freightList;
            await this.httpclient.saveOrUpdateDiscountsGRI(clientObj).toPromise();

            clientObj['freightDetailsList'] = hwtList;
            await this.httpclient.saveOrUpdateDiscountsHWTGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;

            await this.httpclient.saveOrUpdateAccountNumberGRI(clientObj).toPromise();

            clientObj['dimDetailsList'] = dimList;
            await this.httpclient.saveOrUpdateDIMGRI(clientObj).toPromise();

            clientObj['accDetailsList'] = accList;
            await this.httpclient.saveOrUpdateAccDiscountsGRI(clientObj).toPromise();

            delete clientObj['dimDetailsList'];
            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            clientObj['type'] = "Edit";
            await this.httpclient.saveOrUpdateAccDetailsHistoryGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            clientObj['type'] = "Edit";
            await this.httpclient.saveOrUpdateFreightDetailsHistoryGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            clientObj['type'] = "Edit";
            await this.httpclient.saveOrUpdateHWTDetailsHistoryGRI(clientObj).toPromise();

            var targetObj: any = {};
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
            targetObj['targetId'] = clientObj['targetId']
            targetObj['carrierName'] = resultData.scenario.carrierName;
            if (resultData.create) {
              targetObj['type'] = 'create';
            }
            else {
              targetObj['type'] = 'Edit';
            }
            var result = await this.httpclient.generateProposalGRI(targetObj).toPromise();
            // var result = true;

          }
          else {
            clientObj['clientId'] = this.fedexClientId;;
            clientObj['clientName'] = this.selectedCarrier.clientName;

            for (let index = 0; index < freightList.length; index++) {
              freightList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < hwtList.length; index++) {
              hwtList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < dimList.length; index++) {
              dimList[index].clientId = clientObj['clientId'];
            }
            for (let index = 0; index < accList.length; index++) {
              accList[index].clientId = clientObj['clientId'];
            }

            clientObj['freightDetailsList'] = freightList;
            await this.fedexService.saveOrUpdateDiscountsGRI(clientObj).toPromise();
            clientObj['freightDetailsList'] = hwtList;
            await this.fedexService.saveOrUpdateDiscountsHWTGRI(clientObj).toPromise();

            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;
            // await this.fedexService.saveOrUpdateAccountNumberGRI(clientObj).toPromise();

            clientObj['dimDetailsList'] = dimList;
            await this.fedexService.saveOrUpdateDIMGRI(clientObj).toPromise();
            clientObj['accDetailsList'] = accList;
            await this.fedexService.saveOrUpdateAccDiscountsGRI(clientObj).toPromise();

            delete clientObj['dimDetailsList'];
            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            clientObj['type'] = "Edit";
            await this.fedexService.saveOrUpdateAccDetailsHistoryGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            clientObj['type'] = "Edit";
            await this.fedexService.saveOrUpdateFreightDetailsHistoryGRI(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            clientObj['type'] = "Edit";
            await this.fedexService.saveOrUpdateHWTDetailsHistoryGRI(clientObj).toPromise();

            var targetObj: any = {};
            targetObj['clientId'] = this.fedexClientId;
            targetObj['targetId'] = clientObj['targetId'];
            targetObj['carrierName'] = resultData.scenario.carrierName;
            if (resultData.create) {
              targetObj['type'] = 'create';
            }
            else {
              targetObj['type'] = 'Edit';
            }
            var result = await this.fedexService.generateProposalGRI(targetObj).toPromise();
          }

          let serviceBreakUpList = [];

          let fullCheckList = [...this.initialAccCheckList];

          this.accCheckList.forEach(accService => {
            if (!fullCheckList.includes(accService)) {
              fullCheckList.push(accService);
            }
          });

          for (let row = 0; row < fullCheckList.length; row++) {

            let splitupData = this.currentSavingsAccList.filter((accData: any) => accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase() == fullCheckList[row]);

            let reqData = {};
            if (splitupData[0] != undefined) {
              reqData = {
                service: splitupData[0].serviceName,
                serviceType: splitupData[0].ratesheetGrouping,
                targetId: this.scenariosDisplayed[columnNumber].targetId,
                serviceBreakup: true
              };
            }
            else {
              splitupData = this.accessorialCurrentDetails.filter((accData: any) => accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase() == fullCheckList[row]);
              reqData = {
                service: splitupData[0].serviceName,
                serviceType: splitupData[0].ratesheetGrouping,
                targetId: this.scenariosDisplayed[columnNumber].targetId,
                serviceBreakup: false
              };
            }

            serviceBreakUpList.push(reqData);
          }

          var param = {
            type: "Target",
            targetId: this.scenariosDisplayed[columnNumber].targetId,
            clientName: this.selectedCarrier.clientName.replaceAll(" ", ''),
            accDetailsList: serviceBreakUpList
          };

          if (this.carrierName.toLowerCase() == 'ups') {
            await this.httpclient.saveorUpdateServiceBreakupGRI(param).toPromise();
          }
          else {
            await this.fedexService.saveorUpdateServiceBreakupGRI(param).toPromise();
          }

          this.closeLoading();
          var alertDialog = await this.openSaveAlert(targetObj['type'], result);

          alertDialog.afterClosed().subscribe(
            async () => {
              if ((targetObj['type'].toLowerCase() == "edit" && columnNumber == 1)) {

                this.scenariosDisplayed[1].loaded = false;

                if (!this.scenariosDisplayed[0].loaded) {
                  this.allIdList = this.allIdList.filter((scenarioId: any) => scenarioId != this.scenariosDisplayed[0].targetId);
                  this.availableIdList = this.availableIdList.filter((scenarioId: any) => scenarioId != this.scenariosDisplayed[0].targetId);
                  this.totalScenarios = this.totalScenarios.filter((scenario: any) => scenario.targetId != this.scenariosDisplayed[0].targetId);
                }

                this.allIdList = this.allIdList.filter((scenarioId: any) => scenarioId != this.scenariosDisplayed[1].targetId);
                this.availableIdList = this.availableIdList.filter((scenarioId: any) => scenarioId != this.scenariosDisplayed[1].targetId);
                this.totalScenarios = this.totalScenarios.filter((scenario: any) => scenario.targetId != this.scenariosDisplayed[1].targetId);
                var targetIdList: any = [];
                this.scenariosDisplayed.forEach((scenario: any) => {
                  targetIdList.push(scenario.targetId)
                });

                this.reloadData(targetIdList);
              }
              if (columnNumber == 0) {
                this.scenariosDisplayed[0].loaded = false;
                await this.saveProposal(1);
                return isAnythingChanged;
              }
              return isAnythingChanged;
            });
          this.editable.set(false);
        }
        else {
          if (columnNumber == 0) {
            await this.saveProposal(1);
            return isAnythingChanged;
          }
          if (columnNumber == 1 && this.currentChanged) {

            var targetIdList: any = [];
            this.scenariosDisplayed.forEach((scenario: any) => {
              targetIdList.push(scenario.targetId);
            });

            this.reloadData(targetIdList);
          }
          this.editable.set(false);
        }
        return false;
      });
    }
    else {
      if (columnNumber == 0) {
        await this.saveProposal(1);
        return isAnythingChanged;
      }
      if (columnNumber == 1 && this.currentChanged) {

        var targetIdList: any = [];
        this.scenariosDisplayed.forEach((scenario: any) => {
          targetIdList.push(scenario.targetId);
        });

        this.reloadData(targetIdList);
      }
      this.editable.set(false);
    }
    return false;
  }
  async checkAnyChanges(targetId: any) {

    if (targetId == 'current') {
      var airMinMaxList = this.airMinMaxList;
      var groundMinMaxList = this.groundMinMaxList.filter((data: any) => !(data.service.includes('Sub Total')));
      var intlMinMaxList = this.intlMinMaxList;
      var hwtMinMaxList = this.hwtMinMaxList;
      var accMinMaxList = this.accMinMaxList;

      var airMinMaxListOld = this.airMinMaxListOld;
      var groundMinMaxListOld = this.groundMinMaxListOld.filter((data: any) => !(data.service.includes('Sub Total')));
      var intlMinMaxListOld = this.intlMinMaxListOld;
      var hwtMinMaxListOld = this.hwtMinMaxListOld;
      var accMinMaxListOld = this.accMinMaxListOld;

      var airSpendList = this.currentSavingsAirList;
      var groundSpendList = this.currentSavingsGroundList.filter((data: any) => !(data.service.includes('Sub Total')));
      var intlSpendList = this.currentSavingsIntlList;
      var hwtSpendList = this.currentSavingsHWTList;
      var accSpendList = this.currentSavingsAccList;

      var airSpendListOld = this.currentSavingsAirListOld;
      var groundSpendListOld = this.currentSavingsGroundListOld.filter((data: any) => !(data.service.includes('Sub Total')));
      var intlSpendListOld = this.currentSavingsIntlListOld;
      var hwtSpendListOld = this.currentSavingsHWTListOld;
      var accSpendListOld = this.currentSavingsAccListOld;
    }
    else {
      var columnNumber = this.scenariosDisplayed.findIndex((data: any) => data.targetId == targetId);

      if (columnNumber != -1) {
        var airMinMaxList = this.scenariosDisplayed[columnNumber].airMinMaxList;
        var groundMinMaxList = this.scenariosDisplayed[columnNumber].groundMinMaxList.filter((data: any) => !(data.service.includes('Sub Total')));
        var intlMinMaxList = this.scenariosDisplayed[columnNumber].intlMinMaxList;
        var hwtMinMaxList = this.scenariosDisplayed[columnNumber].hwtMinMaxList;
        var accMinMaxList = this.scenariosDisplayed[columnNumber].accMinMaxList;

        var airMinMaxListOld = this.scenariosDisplayed[columnNumber].airMinMaxListOld;
        var groundMinMaxListOld = this.scenariosDisplayed[columnNumber].groundMinMaxListOld.filter((data: any) => !(data.service.includes('Sub Total')));
        var intlMinMaxListOld = this.scenariosDisplayed[columnNumber].intlMinMaxListOld;
        var hwtMinMaxListOld = this.scenariosDisplayed[columnNumber].hwtMinMaxListOld;
        var accMinMaxListOld = this.scenariosDisplayed[columnNumber].accMinMaxListOld;

        var airSpendList = this.scenariosDisplayed[columnNumber].dataSourceAirTarget.data;
        var groundSpendList = this.scenariosDisplayed[columnNumber].dataSourceGroundTarget.data.filter((data: any) => !(data.service.includes('Sub Total')));
        var intlSpendList = this.scenariosDisplayed[columnNumber].dataSourceIntlTarget.data;
        var hwtSpendList = this.scenariosDisplayed[columnNumber].dataSourceHWTTarget.data;
        var accSpendList = this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data;

        var airSpendListOld = this.scenariosDisplayed[columnNumber].targetAirListOld;
        var groundSpendListOld = this.scenariosDisplayed[columnNumber].targetGroundListOld.filter((data: any) => !(data.service.includes('Sub Total')));;
        var intlSpendListOld = this.scenariosDisplayed[columnNumber].targetIntlListOld;
        var hwtSpendListOld = this.scenariosDisplayed[columnNumber].hwtMinMaxListOldtargetHWTListOld;
        var accSpendListOld = this.scenariosDisplayed[columnNumber].targetAccListOld;
      }

      //discount check
      if (airMinMaxList.length > 0) {
        for (let row = 0; row < airMinMaxList.length; row++) {
          if (JSON.stringify(airMinMaxList[row]) !== JSON.stringify(airMinMaxListOld[row])) {
            return true;
          }
        }
      }

      if (groundMinMaxList.length > 0) {
        for (let row = 0; row < groundMinMaxList.length; row++) {
          if (JSON.stringify(groundMinMaxList[row]) !== JSON.stringify(groundMinMaxListOld[row])) {
            return true;
          }
        }
      }

      if (intlMinMaxList.length > 0) {
        for (let row = 0; row < intlMinMaxList.length; row++) {
          if (JSON.stringify(intlMinMaxList[row]) !== JSON.stringify(intlMinMaxListOld[row])) {
            return true;
          }
        }
      }

      if (hwtMinMaxList.length > 0) {
        for (let row = 0; row < hwtMinMaxList.length; row++) {
          if (JSON.stringify(hwtMinMaxList[row]) !== JSON.stringify(hwtMinMaxListOld[row])) {
            return true;
          }
        }
      }

      if (accMinMaxList.length > 0) {
        for (let row = 0; row < accMinMaxList.length; row++) {
          if (JSON.stringify(accMinMaxList[row]) !== JSON.stringify(accMinMaxListOld[row])) {
            return true;
          }
        }
      }

      if (this.netAmountMinMaxList.length > 0) {
        for (let row = 0; row < this.netAmountMinMaxList.length; row++) {
          if (JSON.stringify(this.netAmountMinMaxList[row]) !== JSON.stringify(this.netAmountMinMaxListOld[row])) {
            return true;
          }
        }
      }

      //spend check

      if (airSpendList.length > 0) {
        for (let row = 0; row < airSpendList.length; row++) {
          if (JSON.stringify(airSpendList[row]) !== JSON.stringify(airSpendListOld[row])) {
            return true;
          }
        }
      }

      if (groundSpendList.length > 0) {
        for (let row = 0; row < groundSpendList.length; row++) {
          if (JSON.stringify(groundSpendList[row]) !== JSON.stringify(groundSpendListOld[row])) {
            return true;
          }
        }
      }

      if (intlSpendList.length > 0) {
        for (let row = 0; row < intlSpendList.length; row++) {
          if (JSON.stringify(intlSpendList[row]) !== JSON.stringify(intlSpendListOld[row])) {
            return true;
          }
        }
      }

      if (hwtSpendList.length > 0) {
        for (let row = 0; row < hwtSpendList.length; row++) {
          if (JSON.stringify(hwtSpendList[row]) !== JSON.stringify(hwtSpendListOld[row])) {
            return true;
          }
        }
      }

      if (accSpendList.length > 0) {
        for (let row = 0; row < accSpendList.length; row++) {
          if (JSON.stringify(accSpendList[row]) !== JSON.stringify(accSpendListOld[row])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  async openSaveAlert(type: any, result: any) {
    let panelClass = "";
    if (this.themeoption == 'dark') {
      panelClass = 'page-dark'
    }
    var message;
    if (result == false) {
      message = "Oops something went wrong!";
    }
    else {
      if (type.toLowerCase() == "create") {
        message = "Agreement generated successfully";
      }
      else {
        message = "Agreement updated successfully";
      }
    }
    var alertDialog = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { pageValue: message },
    });
    return alertDialog;
  }

  gerClickhandlerPosition(innerHeight: any, clickPosition: any) {
    var innerPopupHeight = 350;
    var overAllHeight = clickPosition + innerPopupHeight;
    if (innerHeight <= overAllHeight) {
      var clickhandlerPosition = innerHeight - innerPopupHeight;
    }
    else {
      clickhandlerPosition = clickPosition;
    }
    return clickhandlerPosition;
  }

  drop(event: any) {
    moveItemInArray(this.columns(), event.previousIndex, event.currentIndex);
  }

  async dragAndDrop(event: any) {
    moveItemInArray(this.scenariosDisplayed, event.previousIndex, event.currentIndex);
    this.columnsDimFactor.set([]);
    this.displayedColumnsDIM = [];
    this.columnsMinReduction.set([]);;
    this.displayedColumnsMin = [];
    setTimeout(async () => {
      await this.setColumnNames();
      this.dataSourceDimFactor = new MatTableDataSource(this.dimFactorList);
      this.dataSourceMinReduction = new MatTableDataSource(this.netAmountMinMaxList);
    }, 1)

  }

  async popdiscount(rowIndex: any, service: any, serviceType: any, newService: any) {
    let serviceDataName = '';
    let serviceName = service;
    var index;
    if (serviceType.toLowerCase() == 'air') {
      index = 0;
      serviceDataName = 'DomesticAir';
    }
    else if (serviceType.toLowerCase() == 'ground') {
      index = 1;
      serviceDataName = 'DomesticGround';
    }
    else if (serviceType.toLowerCase() == 'hwt') {
      index = 3;
      serviceDataName = 'HundredWeight';
    }
    else {
      index = 2;
      serviceDataName = 'DomesticIntl';
    }

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }

    var targetId: any = [];
    var targetName: any = [];

    this.scenariosDisplayed.map((data: any) => {
      targetId.push(data.targetId);
      targetName.push(data.targetName);
    });

    const dialogRef = this.dialog.open(DiscountGRIComponent, {
      disableClose: true,
      width: "86%",
      height: "86%",
      panelClass: this.panelClass,
      data: { serviceType: serviceType, tabIndex: index, service: serviceName, targetIdList: targetId, targetNameList: targetName, targetList: this.scenariosDisplayed, carrier: this.selectedCarrier, fedexId: this.fedexClientId, adminFlag: this.adminFlag, newService: newService }
    });

    dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data == "delete") {
        window.location.reload();
      }

      if (data != undefined && data != "delete") {
        var type = typeof data.target;
        var anyChanges = data.anyChange;
        if (type != 'undefined') {

          if (data.target != "") {

            let panelClass = "";
            if (this.themeoption == 'dark') {
              panelClass = 'page-dark'
            }

            var resetDialog = this.dialog.open(ResetPopupGRIComponent, {
              disableClose: true,
              width: '470px',
              height: 'auto',
              panelClass: panelClass,
              data: { message: "Are you sure you want to refresh?" }
            });
            resetDialog.afterClosed().subscribe(
              result => {
                if (result == true) {
                  this.reloadPage(data);
                }
              });
          }
        }
      }
    });
  }


  popdiscountAcc(rowIndex: number) {

    let serviceName = this.currentSavingsAccList[rowIndex].serviceName;
    let service = this.currentSavingsAccList[rowIndex].service;

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }

    var targetId: any = [];
    var targetName: any = [];

    this.scenariosDisplayed.map((data: any) => {
      targetId.push(data.targetId);
      targetName.push(data.targetName);
    });

    const dialogRef = this.dialog.open(AccessorialGRIComponent, {
      disableClose: true,
      width: "86vw",
      height: "86vh",
      panelClass: this.panelClass,
      data: { service: service, serviceName: serviceName, targetIdList: targetId, targetNameList: targetName, targetList: this.scenariosDisplayed, carrier: this.selectedCarrier, fedexId: this.fedexClientId, currentCheckList: this.currentAccCheckList, adminFlag: this.adminFlag }
    });

    dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data == "delete") {
        window.location.reload();
        // this.removeNewService(rowIndex,'Accessorial')
      }

      if (data != undefined && data != "delete") {

        if (data.selectedList != undefined) {
          await this.accServiceBreakup(data, 'final');
        }
        else {
          var type = typeof data.target;
          var anyChanges = data.anyChange;
          if (type != 'undefined') {

            if (data.target != "") {


              let panelClass = "";
              if (this.themeoption == 'dark') {
                panelClass = 'page-dark';
              }

              var resetDialog = this.dialog.open(ResetPopupGRIComponent, {
                disableClose: true,
                width: '470px',
                height: 'auto',
                panelClass: panelClass,
                data: { message: "Are you sure you want to refresh?" }
              });
              resetDialog.afterClosed().subscribe(
                result => {
                  if (result == true) {
                    this.reloadPage(data);
                  }
                });
            }
          }
        }
      }
    });
  }

  async accServiceBreakup(data: any, step: string) {

    if (step == "final") {
      this.accCheckList = [];
      this.currentAccCheckList = [];
      this.currentAccCheckList = data.selectedList;

      this.currentAccCheckList.forEach((service: any) => {
        if (!this.accCheckList.includes(service.toLowerCase())) {
          this.accCheckList.push(service.toLowerCase());
        }
      });

      data.targetList.forEach(async (list: any, index: any) => {
        this.scenariosDisplayed[index].targetAccCheckList = [];
        this.scenariosDisplayed[index].targetAccCheckList = list.targetAccCheckList;
        this.scenariosDisplayed[index].targetAccCheckList.forEach((service: any) => {
          if (!this.accCheckList.includes(service.toLowerCase())) {
            this.accCheckList.push(service.toLowerCase());
          }
        })
      });
    }

    let serviceName: string = data.serviceName;
    let uniqueService: string = data.service;
    let accRowNumber: number;
    accRowNumber = this.currentSavingsAccList.findIndex((accData: any) => accData.serviceName == serviceName);
    let serviceIndex = this.accessorialCurrentDetails.findIndex((accData: any) => accData.serviceName == serviceName);
    let service = this.accessorialCurrentDetails[serviceIndex].service;

    this.currentSavingsAccList = this.currentSavingsAccList.filter((accServiceData: any) => accServiceData.serviceName != serviceName && !this.accCheckList.includes(accServiceData.ratesheetGrouping.toLowerCase() + accServiceData.serviceName.toLowerCase()));
    let rowIndex = accRowNumber;

    var filteredData: any;
    filteredData = this.accessorialCurrentDetails.filter((obj: any) => obj.serviceName == serviceName && !this.accCheckList.includes(obj.ratesheetGrouping.toLowerCase() + obj.serviceName.toLowerCase()));

    let remainingServices = false;

    this.accessorialCurrentDetails.forEach((accData: any) => {
      if (accData.serviceName == serviceName && this.accCheckList.includes(accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase())) {
        remainingServices = true;
      }
    });

    let sum = 0;
    let count = 0;
    for (let key in filteredData) {
      sum = sum + Number(Number(filteredData[key].currentSpend).toFixed(2));
      count = count + Number(filteredData[key].count);
    }

    var calculatedData: any = [];

    if (filteredData[0] != undefined) {
      calculatedData = Object.assign({}, filteredData[0]);
      calculatedData.currentSpend = Number(sum);
      calculatedData.count = count;
      calculatedData.sortService = filteredData[0].service;
      calculatedData.serviceType = (remainingServices) ? "Remaining Services" : "All";
      calculatedData.serviceBreakup = false;
      calculatedData.ratesheetGrouping = "";
      this.currentSavingsAccList.splice(rowIndex++, 0, calculatedData);
    }

    for (let serviceIndex = 0; serviceIndex < this.accCheckList.length; serviceIndex++) {

      var filteredData: any = [];
      filteredData = this.accessorialCurrentDetails.filter((obj: any) => obj.ratesheetGrouping.toLowerCase() + obj.serviceName.toLowerCase() == this.accCheckList[serviceIndex]);
      if (filteredData.length > 0) {
        let sum = 0;
        let count = 0;
        for (let key in filteredData) {
          sum = sum + Number(Number(filteredData[key].currentSpend).toFixed(2));
          count = count + Number(filteredData[key].count);
        }

        var calculatedData: any = [];
        if (filteredData[0] != undefined) {
          let serviceList = ["DAS", "DAS Extended", "DAS - Extended", "Delivery Area Surcharge", "Additional Handling", "Oversize"];

          let flag = serviceList.includes(filteredData[0].service);
          calculatedData = Object.assign({}, filteredData[0]);
          calculatedData.sortService = filteredData[0].service;
          calculatedData.currentSpend = Number(sum);
          calculatedData.count = count;
          calculatedData.serviceType = filteredData[0].serviceType;
          calculatedData.serviceBreakup = true;
          if (flag) {
            calculatedData.service = filteredData[0].shortName;
            calculatedData.isHover = true;
          }
          this.currentSavingsAccList.splice(rowIndex++, 0, calculatedData);
        }
      }
    }

    this.currentSavingsAccList.sort((a: any, b: any) => a.serviceType.localeCompare(b.serviceType));
    this.currentSavingsAccList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.sortService) - this.distinctAccServices.indexOf(b.sortService));
    this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);

    this.accMinMaxList = this.accMinMaxList.filter((accServiceData: any) => accServiceData.sortService != service && !this.accCheckList.includes(accServiceData.ratesheetGrouping.toLowerCase() + accServiceData.accServiceName.toLowerCase()));
    rowIndex = accRowNumber;

    var filteredService = this.accessorialCurrentDetails.filter((obj: any) => obj.serviceName == serviceName && !this.accCheckList.includes(obj.ratesheetGrouping.toLowerCase() + obj.serviceName.toLowerCase()));

    var minMax = {
      disMin: '999999999999',
      disMax: '-99999999999',
    };

    for (let row = 0; row < filteredService.length; row++) {
      if (filteredService[row].currentPercent == '') {
        minMax.disMin = "0.00";
        minMax.disMax = "0.00";
      }
      else {
        if (Number(minMax.disMin) >= Number(filteredService[row].currentPercent)) {
          minMax.disMin = Number(filteredService[row].currentPercent).toFixed(2);
        }
        if (Number(minMax.disMax) <= Number(filteredService[row].currentPercent)) {
          minMax.disMax = Number(filteredService[row].currentPercent).toFixed(2);
        }
      }
    }

    if (filteredService[0] != undefined) {
      let minMaxData = {
        service: filteredService[0].service,
        serviceType: (remainingServices) ? "Remaining Services" : "All",
        sortService: filteredService[0].service,
        name: filteredService[0].service,
        disMin: minMax.disMin,
        disMax: minMax.disMax,
        discountType: (filteredService[0].currentPercentType == '$') ? '$' : '%',
        ratesheetGrouping: filteredService[0].ratesheetGrouping,
        accServiceName: filteredService[0].serviceName
      };
      this.accMinMaxList.splice(rowIndex++, 0, minMaxData);
    }

    for (let index = 0; index < this.accCheckList.length; index++) {

      var filteredService = this.accessorialCurrentDetails.filter((data: any) => data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase() == this.accCheckList[index]);

      var minMax = {
        disMin: '999999999999',
        disMax: '-99999999999',
      };

      for (let row = 0; row < filteredService.length; row++) {
        if (filteredService[row].currentPercent == '') {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }
        else {
          if (Number(minMax.disMin) >= Number(filteredService[row].currentPercent)) {
            minMax.disMin = Number(filteredService[row].currentPercent).toFixed(2);
          }
          if (Number(minMax.disMax) <= Number(filteredService[row].currentPercent)) {
            minMax.disMax = Number(filteredService[row].currentPercent).toFixed(2);
          }
        }
      }

      if (filteredService[0] != undefined) {
        let serviceList = ["DAS", "DAS Extended", "DAS - Extended", "Delivery Area Surcharge", "Additional Handling", "Oversize"];
        let flag = serviceList.includes(filteredService[0].service);
        let minMaxData = {
          service: (flag) ? filteredService[0].shortName : filteredService[0].service,
          sortService: filteredService[0].service,
          serviceType: filteredService[0].serviceType,
          name: filteredService[0].service,
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          discountType: (filteredService[0].currentPercentType == '$') ? '$' : '%',
          ratesheetGrouping: filteredService[0].ratesheetGrouping,
          accServiceName: filteredService[0].serviceName
        };
        this.accMinMaxList.splice(rowIndex++, 0, minMaxData);
      }
    }

    this.accMinMaxList.sort((a: any, b: any) => a.serviceType.localeCompare(b.serviceType));
    this.accMinMaxList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.sortService) - this.distinctAccServices.indexOf(b.sortService));

    for (let columnNumber in this.scenariosDisplayed) {

      this.targetSavingsAccList = this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data;

      this.targetSavingsAccList = this.targetSavingsAccList.filter((accServiceData: any) => accServiceData.serviceName != serviceName && !this.accCheckList.includes(accServiceData.ratesheetGrouping.toLowerCase() + accServiceData.serviceName.toLowerCase()));
      rowIndex = accRowNumber;

      var filteredData;
      filteredData = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((obj: any) => obj.serviceName == serviceName && !this.accCheckList.includes(obj.ratesheetGrouping.toLowerCase() + obj.serviceName.toLowerCase()));

      let totalTargetSpend = 0;
      let totalSavings = 0;
      let targetSavingsPercent = 0;

      for (let key in filteredData) {
        totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
      }

      totalTargetSpend = Number(totalTargetSpend);
      if (filteredData[0] != undefined) {
        let currentService = await this.currentSavingsAccList.filter((data: any) => data.service == filteredData[0].service && !this.accCheckList.includes(data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase()));
        if (currentService[0] != null && currentService[0] != undefined) {

          totalSavings = totalTargetSpend - currentService[0].currentSpend;
          totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;
          targetSavingsPercent = (currentService[0].currentSpend == 0) ? 0.00 : (totalSavings / currentService[0].currentSpend) * 100;

          var calculatedData = Object.assign({}, filteredData[0]);
          calculatedData.targetSpend = totalTargetSpend;
          calculatedData.sortService = filteredData[0].service;
          calculatedData.savingsAmount = totalSavings;
          calculatedData.targetSavingsPercent = targetSavingsPercent;
          calculatedData.serviceType = (remainingServices) ? "Remaining Services" : "All";
          calculatedData.serviceBreakup = false;
          this.targetSavingsAccList.splice(rowIndex++, 0, calculatedData);
        }
      }
      else {

        let accRow = this.currentSavingsAccList.findIndex((accData: any) => accData.serviceName == serviceName && !this.accCheckList.includes(accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase()))
        if (accRow != -1) {
          calculatedData = {
            clientId: (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') ? this.fedexClientId : this.cookiesService.getCookieItem("clientId"),
            count: 0,
            currentPercent: null,
            currentPercentType: null,
            currentSpend: null,
            includedInFuel: "Yes",
            savingsAmount: 0.00,
            service: this.currentSavingsAccList[accRow].service,
            sortService: this.currentSavingsAccList[accRow].service,
            serviceName: this.currentSavingsAccList[accRow].serviceName,
            serviceType: this.currentSavingsAccList[accRow].serviceType,
            ratesheetGrouping: "",
            targetId: this.scenariosDisplayed[columnNumber].targetId,
            targetPercent: 0.00,
            targetPercentType: "%",
            targetSavingsPercent: 0.00,
            targetSpend: 0,
            totalGrossAmount: 0,
            weightRange: "All",
            serviceBreakup: false
          };

          calculatedData.savingsAmount = Number(Number(this.currentSavingsAccList[rowIndex].currentSpend).toFixed(2));
          calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(this.currentSavingsAccList[rowIndex].currentSpend.toFixed(2)) == 0.00) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAccList[rowIndex].currentSpend.toFixed(2))) * 100));
          this.targetSavingsAccList.splice(rowIndex++, 0, calculatedData);
        }
      }

      for (let serviceIndex = 0; serviceIndex < this.accCheckList.length; serviceIndex++) {

        var filteredData;
        filteredData = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((obj: any) => obj.ratesheetGrouping.toLowerCase() + obj.serviceName.toLowerCase() == this.accCheckList[serviceIndex]);

        let totalTargetSpend = 0;
        let totalSavings = 0;
        let targetSavingsPercent = 0;

        for (let key in filteredData) {
          totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
        }

        totalTargetSpend = Number(totalTargetSpend);
        if (filteredData[0] != undefined) {
          let serviceList = ["DAS", "DAS Extended", "DAS - Extended", "Delivery Area Surcharge", "Additional Handling", "Oversize"];
          let flag = serviceList.includes(filteredData[0].service);
          let currentService = await this.currentSavingsAccList.filter((data: any) => data.ratesheetGrouping == filteredData[0].ratesheetGrouping);
          if (currentService[0] != null && currentService[0] != undefined) {

            totalSavings = totalTargetSpend - currentService[0].currentSpend;
            totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;
            targetSavingsPercent = (currentService[0].currentSpend == 0) ? 0.00 : (totalSavings / currentService[0].currentSpend) * 100;

            var calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.targetSpend = totalTargetSpend;
            calculatedData.sortService = filteredData[0].service;
            calculatedData.savingsAmount = totalSavings;
            calculatedData.targetSavingsPercent = targetSavingsPercent;
            calculatedData.serviceType = filteredData[0].serviceType;
            calculatedData.serviceBreakup = true;
            if (flag) {
              calculatedData.service = filteredData[0].shortName;
              calculatedData.isHover = true;
              // calculatedData.serviceName = filteredData[0].hoverName;
            }
            this.targetSavingsAccList.splice(rowIndex++, 0, calculatedData);
          }
        }
        else if (filteredData[0] == undefined) {

          let accRow = this.currentSavingsAccList.findIndex((accData: any) => accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase() == this.accCheckList[serviceIndex]);

          calculatedData = {
            clientId: (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') ? this.fedexClientId : this.cookiesService.getCookieItem("clientId"),
            count: 0,
            currentPercent: null,
            currentPercentType: null,
            currentSpend: null,
            includedInFuel: "Yes",
            savingsAmount: 0.00,
            service: this.currentSavingsAccList[accRow].service,
            sortService: this.currentSavingsAccList[accRow].sortService,
            serviceName: this.currentSavingsAccList[accRow].serviceName,
            serviceType: this.currentSavingsAccList[accRow].serviceType,
            ratesheetGrouping: this.currentSavingsAccList[accRow].ratesheetGrouping,
            targetId: this.scenariosDisplayed[columnNumber].targetId,
            targetPercent: 0.00,
            targetPercentType: "%",
            targetSavingsPercent: 0.00,
            targetSpend: 0,
            totalGrossAmount: 0,
            weightRange: "All",
            serviceBreakup: true
          };

          calculatedData.savingsAmount = Number(Number(this.currentSavingsAccList[accRow].currentSpend).toFixed(2));
          calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(this.currentSavingsAccList[accRow].currentSpend.toFixed(2)) == 0.00) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAccList[accRow].currentSpend.toFixed(2))) * 100));
          this.targetSavingsAccList.splice(rowIndex++, 0, calculatedData);
        }
      }


      this.targetSavingsAccList.sort((a: any, b: any) => a.serviceType.localeCompare(b.serviceType));
      this.targetSavingsAccList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.sortService) - this.distinctAccServices.indexOf(b.sortService));

      this.scenariosDisplayed[columnNumber].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);

      this.scenariosDisplayed[columnNumber].accMinMaxList = this.scenariosDisplayed[columnNumber].accMinMaxList.filter((accServiceData: any) => accServiceData.sortService != service && !this.accCheckList.includes(accServiceData.ratesheetGrouping.toLowerCase() + accServiceData.serviceName.toLowerCase()));
      rowIndex = accRowNumber;



      var filteredService = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((obj: any) => obj.serviceName == serviceName && !this.accCheckList.includes(obj.ratesheetGrouping.toLowerCase() + obj.serviceName.toLowerCase()));

      var minMax = {
        disMin: '999999999999',
        disMax: '-99999999999',
      };

      if (filteredService.length == 0) {
        minMax.disMin = "0.00";
        minMax.disMax = "0.00";
      }

      for (let row = 0; row < filteredService.length; row++) {
        if (Number(minMax.disMin) >= Number(filteredService[row].targetPercent)) {
          minMax.disMin = Number(filteredService[row].targetPercent).toFixed(2);
        }
        if (Number(minMax.disMax) <= Number(filteredService[row].targetPercent)) {
          minMax.disMax = Number(filteredService[row].targetPercent).toFixed(2);
        }
      }

      if (filteredService[0] != undefined) {
        let accData = {
          service: filteredService[0].service,
          serviceType: (remainingServices) ? "Remaining Services" : "All",
          sortService: filteredService[0].service,
          serviceName: filteredService[0].serviceName,
          name: filteredService[0].service,
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          weightFrom: '',
          weightTo: '',
          discountType: (filteredService[0].targetPercentType == '$') ? '$' : '%',
          ratesheetGrouping: "",
          accServiceName: filteredService[0].serviceName,
        }
        this.scenariosDisplayed[columnNumber].accMinMaxList.splice(rowIndex++, 0, accData);
      }
      else {
        let accRow = this.currentSavingsAccList.findIndex((accData: any) => accData.serviceName == serviceName && !this.accCheckList.includes(accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase()))

        if (accRow != -1) {
          let accData = {
            service: this.currentSavingsAccList[accRow].service,
            serviceType: (remainingServices) ? "Remaining Services" : "All",
            sortService: this.currentSavingsAccList[accRow].sortService,
            serviceName: this.currentSavingsAccList[accRow].serviceName,
            name: this.currentSavingsAccList[accRow].service,
            disMin: minMax.disMin,
            disMax: minMax.disMax,
            weightFrom: '',
            weightTo: '',
            discountType: (this.currentSavingsAccList[accRow].currentPercentType == '$') ? '$' : '%',
            ratesheetGrouping: "",
            accServiceName: this.currentSavingsAccList[accRow].serviceName,
          }
          this.scenariosDisplayed[columnNumber].accMinMaxList.splice(rowIndex++, 0, accData);
        }
      }


      for (let index = 0; index < this.accCheckList.length; index++) {

        var filteredService = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((data: any) => data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase() == this.accCheckList[index]);

        var minMax = {
          disMin: '999999999999',
          disMax: '-99999999999',
        };

        if (filteredService.length == 0) {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        for (let row = 0; row < filteredService.length; row++) {
          if (Number(minMax.disMin) >= Number(filteredService[row].targetPercent)) {
            minMax.disMin = Number(filteredService[row].targetPercent).toFixed(2);
          }
          if (Number(minMax.disMax) <= Number(filteredService[row].targetPercent)) {
            minMax.disMax = Number(filteredService[row].targetPercent).toFixed(2);
          }
        }

        // if (filteredService[0] != undefined) {
        let serviceList = ["DAS", "DAS Extended", "DAS - Extended", "Delivery Area Surcharge", "Additional Handling", "Oversize"];
        let accData = {};
        if (filteredService[0] != undefined) {
          let flag = serviceList.includes(filteredService[0].service);
          accData = {
            service: (flag) ? filteredService[0].shortName : filteredService[0].service,
            sortService: filteredService[0].service,
            serviceType: filteredService[0].serviceType,
            serviceName: filteredService[0].serviceName,
            name: filteredService[0].service,
            disMin: minMax.disMin,
            disMax: minMax.disMax,
            weightFrom: '',
            weightTo: '',
            discountType: (filteredService[0].targetPercentType == '$') ? '$' : '%',
            ratesheetGrouping: filteredService[0].ratesheetGrouping,
            accServiceName: this.currentSavingsAccList[rowIndex].serviceName,
          }
        }
        else if (filteredService[0] == undefined) {

          let accRow = this.currentSavingsAccList.findIndex((accData: any) => accData.ratesheetGrouping.toLowerCase() + accData.serviceName.toLowerCase() == this.accCheckList[index]);

          accData = {
            service: this.currentSavingsAccList[accRow].service,
            serviceType: this.currentSavingsAccList[accRow].serviceType,
            sortService: this.currentSavingsAccList[accRow].sortService,
            serviceName: this.currentSavingsAccList[accRow].serviceName,
            name: this.currentSavingsAccList[accRow].service,
            disMin: minMax.disMin,
            disMax: minMax.disMax,
            weightFrom: '',
            weightTo: '',
            discountType: (this.currentSavingsAccList[accRow].currentPercentType == '$') ? '$' : '%',
            ratesheetGrouping: "",
            accServiceName: this.currentSavingsAccList[accRow].serviceName,
          }
        }
        this.scenariosDisplayed[columnNumber].accMinMaxList.splice(rowIndex++, 0, accData);
        // }
      }

      this.scenariosDisplayed[columnNumber].accMinMaxList.sort((a: any, b: any) => a.serviceType.localeCompare(b.serviceType));
      this.scenariosDisplayed[columnNumber].accMinMaxList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.sortService) - this.distinctAccServices.indexOf(b.sortService));

    }
  }

  async popDimFactor(targetdivisor: any, targetName: any, dimIndex: any) {
    var DimtabIndex = 0;
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    if (dimIndex == 0) {
      DimtabIndex = 0;
    }
    else {
      DimtabIndex = dimIndex - 1;
    }
    if (targetdivisor == "criteria" || targetdivisor == "targetDimDivisor" || targetdivisor == "proposalDimDivisor") {

      let orderChanged = false;
      var targetIdListnew: any = [];
      this.scenariosDisplayed.forEach((data: any) => targetIdListnew.push(data.targetId));

      if (this.targetIdList.toString() != targetIdListnew.toString()) {
        orderChanged = true;
      }

      const dialogRef = this.dialog.open(DimfactorGRIComponent, {
        disableClose: true,
        width: "86%",
        height: "86%",
        panelClass: this.panelClass,
        data: {
          dimFactor: this.dimFactorList,
          targetList: this.scenariosDisplayed,
          carrier: this.selectedCarrier,
          fedexId: this.fedexClientId,
          netAmountMinMaxList: this.netAmountMinMaxList,
          minimumReductionList: this.minimumReductionList,
          editable: this.editable(),
          Dimtab: DimtabIndex,
          targetName: targetName,
          orderChanged: orderChanged
        }
      });

      dialogRef.afterClosed().subscribe(async (data: any) => {
        if (data && data.freightList !== undefined) {
          this.openLoading();
          var index = data.columnIndex;
          var freightData = data.freightList;
          var dimData = data.dimList;
          this.targetSavingsAirList = [];
          this.targetSavingsGroundList = [];
          this.targetSavingsIntlList = [];
          this.scenariosDisplayed[index].targetSavingsGroundSubTotalList = [];
          this.scenariosDisplayed[index].freightTargetDetails = freightData;
          let rowNumber = this.totalScenarios.findIndex((data: any) => data.targetId == this.scenariosDisplayed[index].targetId);
          for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
            await this.filterAirIntlHWTTargetData(this.distinctAirServices, freightData, serviceIndex, 'Air', rowNumber);
          }
          for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {
            if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
              await this.filterGroundTargetData(1, 1000, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
              await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
              await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
              await this.filterGroundTargetData(1, 2000, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
              await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
              await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            else {
              await this.filterGroundTargetData(0, 5, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(6, 10, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(11, 20, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(21, 30, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(31, 50, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(51, 70, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(71, 150, this.distinctGroundServices, freightData, serviceIndex, rowNumber);
              await this.filterGroundTargetData(151, '', this.distinctGroundServices, freightData, serviceIndex, rowNumber);
            }
            await this.calculateGroundSubTotalTarget(this.targetSavingsGroundList, serviceIndex, index);
          }

          for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
            await this.filterAirIntlHWTTargetData(this.distinctIntlServices, freightData, serviceIndex, 'Intl', rowNumber);
          }

          this.targetSavingsHWTList = this.scenariosDisplayed[index].dataSourceHWTTarget.data;

          await this.calculateFreightTargetTotal(index);
          await this.getInitRowSpan();

          this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
          this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
          this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);

          await this.setMinMaxTarget(index, "air");
          await this.setMinMaxTarget(index, "ground");
          await this.setMinMaxTarget(index, "intl");

          var targetIdListnew: any = [];
          this.scenariosDisplayed.forEach((data: any) => targetIdListnew.push(data.targetId));

          if (this.targetIdList.toString() == targetIdListnew.toString()) {
            if ((index == 0)) {
              dimData.forEach((data: any, row: any) => {
                this.dimFactorList[row].targetDimDivisor = data.targetDimDivisor;
              });
            }
            else if (index == 1) {
              dimData.forEach((data: any, row: any) => {
                this.dimFactorList[row].proposalDimDivisor = data.targetDimDivisor;
              });
            }
          }
          else {
            if (index == 0) {
              dimData.forEach((data: any, row: any) => {
                this.dimFactorList[row].proposalDimDivisor = data.targetDimDivisor;
              });
            }
            else if (index == 1) {
              dimData.forEach((data: any, row: any) => {
                this.dimFactorList[row].targetDimDivisor = data.targetDimDivisor;
              });
            }
          }

          this.dataSourceDimFactor = [];
          this.dataSourceDimFactor = new MatTableDataSource(this.dimFactorList);
          await this.calculateOverallTotal('target', index);
          var targetList: any = [];
          this.scenariosDisplayed[index].dataSourceAccTarget.data.forEach((data: any) => targetList.push(Object.assign({}, data)));
          await this.calculateFuel(index, targetList);
          await this.calculateTPBilling(index, targetList);
          await this.onAccSpendChange('', '', 'target', index);
          this.closeLoading();
        }
        else if (data != undefined) {
          var type = typeof data.target;
          var anyChanges = data.anyChange;
          if (type != 'undefined') {

            if (data.target != "") {

              let panelClass = ""
              if (this.themeoption == "dark") {
                panelClass = 'page-dark';
              }

              var resetDialog = this.dialog.open(ResetPopupGRIComponent, {
                disableClose: true,
                width: '470px',
                height: 'auto',
                panelClass: panelClass,
                data: { message: "Are you sure you want to refresh?" }
              });
              resetDialog.afterClosed().subscribe(result => {
                if (result == true) {
                  this.reloadPage(data);
                }
              });

            }
          }
        }
      });
    }
  }

  async popMinReduction(service: any, serviceType: any) {

    var targetIdList: any = [];
    this.scenariosDisplayed.forEach((data: any) => targetIdList.push(data.targetId));

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }

    const dialogRef = this.dialog.open(MinReductionGRIComponent, {
      disableClose: true,
      width: "86%",
      height: "86%",
      panelClass: this.panelClass,
      data: {
        minReduction: this.minimumReductionList,
        targetList: this.scenariosDisplayed,
        carrier: this.selectedCarrier,
        fedexId: this.fedexClientId,
        service: service,
        serviceType: serviceType,
        totalTargetList: this.totalScenarios,
        order: (this.targetIdList.toString() == targetIdList.toString()),
        adminFlag: this.adminFlag
      }
    });
    dialogRef.afterClosed().subscribe(async (data: any) => {
      if (data != undefined) {
        var type = typeof data.target;
        var anyChanges = data.anyChange;
        if (type != 'undefined') {

          if (data.target != "") {

            let panelClass = "";
            if (this.themeoption == 'dark') {
              panelClass = 'page-dark'
            }
            var resetDialog = this.dialog.open(ResetPopupGRIComponent, {
              disableClose: true,
              width: '470px',
              height: 'auto',
              panelClass: panelClass,
              data: { message: "Are you sure you want to refresh?" }
            });
            resetDialog.afterClosed().subscribe(
              result => {
                if (result == true) {
                  this.reloadPage(data);
                }
              });
          }
        }
      }
    });
  }

  async popHWTTier(type: any, selectedScenario: any) {

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }

    const dialogRef = this.dialog.open(HundredweightTierGRIComponent, {
      disableClose: true,
      width: "86%",
      height: "86%",
      panelClass: this.panelClass,
      data: {
        valueClick: type,
        carrierDetails: this.selectedCarrier,
        target: selectedScenario,
        targetList: this.scenariosDisplayed,
        fedexId: this.fedexClientId,
        tabIndex: 3,
        targetDetails: this.totalScenarios
      }
    });
  }

  getClass(value: any) {
    if (value != undefined) {
      if (value.toString().includes('%') && value.toString().includes('-')) {
        return 'rangeDiscountclass'
      }
      else if (value == '' && value != 0 && value != null) {
        return 'textAlignLeft'
      }
      else {
        return 'textAlignRight'
      }
    }
    return 'textAlignRight';
  }

  getClassTotal(value: any) {
    if (value != undefined) {
      if (value.toString() == 'service') {
        return 'textAlignLeft'
      }
      else {
        return 'textAlignRight'
      }
    }
    return 'textAlignRight';
  }

  getClassTarget(value: any, columnName: any) {

    if (columnName.toString() == 'targetPercent') {
      return 'textAlignLeft'
    }
    else if (columnName.toString() == 'targetSavingsPercent') {
      return 'textAlignRight'
    }
    else {
      return 'textAlignRight'
    }
  }


  checkScenarios(ID: any) {

    if (this.selectedScenarios == undefined || this.selectedScenarios.length == 0) {
      this.filterApplied = false;
    }
    if (this.filterApplied) {
      return this.selectedScenarios.includes(ID);
    }
    else {
      return true;
    }
  }

  storePreviousPercentage(event: any) {

    var keyCode;
    keyCode = event.keyCode;
    if (event.target.value.includes(".")) {
      this.previousWholeNumber = event.target.value.split(".")[0];

      if (event.target.value.split(".").pop().replaceAll('%', '').replaceAll('$', '').length < 3) {
        this.previousDecimalNumber = event.target.value.split(".").pop();
      }
    }
    if (!(keyCode >= 65 && keyCode <= 90)) {
      if (event.target.value.includes(".") && (keyCode == 110 || keyCode == 190)) {
        return false;
      }
      else if (event.target.value.includes("%") && event.key == "%") {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  validatePercentage(event: any) {
    var percentageCount = (event.target.value.match(/%/g) || []).length;
    var dotCount = (event.target.value.match(/%/g) || []).length;
    if (percentageCount == 2 || dotCount == 2 || event.target.value.includes("-")) {
      return false;
    }
    let discount = Number(event.target.value.replaceAll('%', '').replaceAll('$', ''));
    if (discount.toString() == 'NaN') {
      return false;
    }

    let wholeNumber;
    let decimalNumber;
    if (event.target.value.includes(".")) {
      wholeNumber = event.target.value.split(".")[0];
      decimalNumber = event.target.value.split(".").pop();
      if (decimalNumber.includes("%")) {
        decimalNumber = decimalNumber.replace('%', '');
      }
      if (decimalNumber.length > 2) {
        event.target.value = wholeNumber + "." + this.previousDecimalNumber;
        return false;
      }
    } return false;
  }

  async percentageFocusout(event: any, rowNumber: any, minMaxList: string, type: any, columnNumber: any) {

    if (event.target.value.split('.').length - 1 > 1) {
      return false;
    }
    if (event.target.value.includes(".")) {
      let value = event.target.value.split(".")[0];
      let decimalValue = event.target.value.split(".").pop().replace('%', '');
      if (value == '') {
        event.target.value = "0." + decimalValue + "%";
      }
      if (decimalValue == '') {
        event.target.value = value + ".00%";
      }
    }

    if (!(event.target.value.includes("."))) {
      event.target.value = Number(event.target.value.replace('%', '').replaceAll('$', '')).toFixed(2);
    }

    if (!event.target.value.includes("%")) {
      event.target.value = event.target.value + "%"
    }

    if (type == 'current') {
      (this as any)[minMaxList][rowNumber].disMin = Number(event.target.value.replace('%', '')).toFixed(2);
      (this as any)[minMaxList][rowNumber].disMax = Number(event.target.value.replace('%', '')).toFixed(2);
      if (minMaxList == 'accMinMaxList') {
        (this as any)[minMaxList][rowNumber].discountType = "%";
      }
    }
    if (type == 'target') {
      this.scenariosDisplayed[columnNumber][minMaxList][rowNumber].disMin = Number(event.target.value.replace('%', '')).toFixed(2);
      this.scenariosDisplayed[columnNumber][minMaxList][rowNumber].disMax = Number(event.target.value.replace('%', '')).toFixed(2);
      if (minMaxList == 'accMinMaxList') {
        this.scenariosDisplayed[columnNumber][minMaxList][rowNumber].discountType = '%';
      }
    } return false;
  }

  preventText(event: any) {
    var keyCode = event.keyCode;
    if (!(keyCode >= 97 && keyCode <= 122) && !(keyCode >= 65 && keyCode <= 90))
      return true;
    else
      return false;
  }

  //for inserting service name and weight for new row

  onFreightInput(event: any, columnName: any, rowNumber: number, serviceType: string) {

    var currentList: any = '';
    var targetList = '';
    var value = event.target.value;

    if (serviceType == 'air') {
      currentList = this.currentSavingsAirList;
      targetList = 'dataSourceAirTarget';
    }
    else if (serviceType == 'ground') {
      currentList = this.currentSavingsGroundList;
      targetList = 'dataSourceGroundTarget';
    }
    else if (serviceType == 'hwt') {
      currentList = this.currentSavingsHWTList;
      targetList = 'dataSourceHWTTarget';
    }
    else if (serviceType == 'intl') {
      currentList = this.currentSavingsIntlList;
      targetList = 'dataSourceIntlTarget';
    }
    else {
      currentList = this.currentSavingsAccList;
      targetList = 'dataSourceAccTarget';
    }

    if (value != '') {
      currentList[rowNumber][columnName] = value[0].toUpperCase() + value.slice(1);
    }
    else {
      currentList[rowNumber][columnName] = '';
    }
    currentList[rowNumber]['serviceName'] = currentList[rowNumber]['service'];
    currentList[rowNumber]['finalService'] = currentList[rowNumber]['service'];
    for (let columnNumber in this.scenariosDisplayed) {
      if (value) {
        this.scenariosDisplayed[columnNumber][targetList].data[rowNumber][columnName] = value[0].toUpperCase() + value.slice(1);
      }
      else {
        this.scenariosDisplayed[columnNumber][targetList].data[rowNumber][columnName] = '';
      }
      this.scenariosDisplayed[columnNumber][targetList].data[rowNumber]['serviceName'] = this.scenariosDisplayed[columnNumber][targetList].data[rowNumber]['service'];
      this.scenariosDisplayed[columnNumber][targetList].data[rowNumber]['finalService'] = this.scenariosDisplayed[columnNumber][targetList].data[rowNumber]['service'];
    }
  }

  //get unique object from list buy passing the list and columnName which needs to be unique
  async getUniqueService(data: any, type: any) {
    let distinctValues: any = [];

    const arrayUniqueByService = [...new Map(data.map((item: any) =>
      [item[type], item])).values()];

    arrayUniqueByService.forEach((data: any) => {
      distinctValues.push(data[type]);
    });
    return distinctValues;
  }
  isAnythingChangedNewWebCurrent = false; isAnythingChangedNewWebTarget1 = false; isAnythingChangedNewWebTarget2 = false;
  async onSpendChange(event: any, rowNumber: any, service: any, type: any, columnNumber?: any) {

    let eventValue;

    if (typeof event == 'object') {
      eventValue = event.target.value;
    }
    else {
      eventValue = event.toString();
    }

    if (Number(eventValue.replaceAll('$', '').replaceAll(',', '').replaceAll('(', '').replace(')', '')).toString() != 'NaN') {
      let spend = Number(eventValue.replaceAll('$', '').replaceAll(',', '').replaceAll('(', '').replace(')', ''));
      var currentList: any = [];
      var targetList: any = [];
      var currentTotalList: any = '';
      var targetTotalList: any = ''
      var targetName = '';
      var currentTotalListName = '';
      var targetTotalListName = '';
      var totalServiceName = "";

      if (service == 'air') {
        this.currentSavingsAirList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsAirTotalList';
        targetTotalList = 'targetSavingsAirTotalList'
        targetName = "dataSourceAirTarget";
        currentTotalListName = 'dataSourceCurrentAirTotal';
        targetTotalListName = 'dataSourceTargetAirTotal';
        totalServiceName = "Express Pricing :";
      }
      else if (service == 'ground') {
        this.currentSavingsGroundList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsGroundTotalList';
        targetTotalList = 'targetSavingsGroundTotalList'
        targetName = "dataSourceGroundTarget";
        currentTotalListName = 'dataSourceCurrentGroundTotal'
        targetTotalListName = 'dataSourceTargetGroundTotal';
        totalServiceName = "Ground Pricing :";
      }
      else if (service == 'hwt') {
        this.currentSavingsHWTList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsHWTTotalList';
        targetTotalList = 'targetSavingsHWTTotalList'
        targetName = "dataSourceHWTTarget";
        currentTotalListName = 'dataSourceCurrentHWTTotal';
        targetTotalListName = 'dataSourceTargetHWTTotal';
        totalServiceName = "Hundredweight Pricing :";
      }
      else {
        this.currentSavingsIntlList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsIntlTotalList';
        targetTotalList = 'targetSavingsIntlTotalList'
        targetName = "dataSourceIntlTarget";
        currentTotalListName = 'dataSourceCurrentIntlTotal'
        targetTotalListName = 'dataSourceTargetIntlTotal';
        totalServiceName = "International Pricing :";
      }

      if (type == 'current') {
        this.isAnythingChangedNewWebCurrent = true;
        currentList[rowNumber].currentSpend = spend;
        // (this as any)[dataSource][rowNumber].currentSpend = spend;
        if (service == 'ground') {
          await this.calculateSubTotal(currentList, currentList[rowNumber].service, currentList[rowNumber].weightRange);
        }
        var calculatedCurrentService: any = await this.calculateCurrentSpend(currentList);

        (this as any)[currentTotalList] = [];
        (this as any)[currentTotalList].push({
          service: totalServiceName,
          weightRange: '',
          count: calculatedCurrentService['totalCount'],
          currentPercent: '',
          currentSpend: calculatedCurrentService['totalCurrentSpend'],
          serviceType: ''
        });
        (this as any)[currentTotalListName] = new MatTableDataSource((this as any)[currentTotalList]);

        await this.calculateOverallTotal('current');

        for (let index in this.scenariosDisplayed) {

          targetList = this.scenariosDisplayed[index][targetName].data;
          targetList = await this.calculateSavingsAndPercent(targetList, currentList, rowNumber);

          this.scenariosDisplayed[index][targetName] = new MatTableDataSource(targetList);

          if (service == 'ground') {
            await this.calculateSubTotalTarget(targetList, targetList[rowNumber].service, targetList[rowNumber].weightRange, index);
          }

          var calculatedTargetService: any = await this.calculateTargetSpend(targetList);

          (this as any)[targetTotalList] = [];
          (this as any)[targetTotalList].push({
            weightRange: '',
            count: '',
            targetPercent: '',
            targetSpend: calculatedTargetService['totalTargetSpend'],
            targetSavingsPercent: (Math.abs((this as any)[currentTotalList][0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / (this as any)[currentTotalList][0].currentSpend) * 100 : 0,
            savingsAmount: calculatedTargetService['totalSavings']
          });

          this.scenariosDisplayed[index][targetTotalListName] = new MatTableDataSource((this as any)[targetTotalList]);

          await this.calculateOverallTotal('target', Number(index))
        }
      }
      else {
        if (columnNumber == 1)
          this.isAnythingChangedNewWebTarget1 = true;
        if (columnNumber == 2)
          this.isAnythingChangedNewWebTarget2 = true;
        this.scenariosDisplayed[columnNumber][targetName].data.forEach((data: any) => targetList.push(Object.assign({}, data)));
        targetList[rowNumber].targetSpend = spend;

        targetList = await this.calculateSavingsAndPercent(targetList, currentList, rowNumber);

        this.scenariosDisplayed[columnNumber][targetName].data[rowNumber].targetSavingsPercent = targetList[rowNumber].targetSavingsPercent;
        this.scenariosDisplayed[columnNumber][targetName].data[rowNumber].savingsAmount = targetList[rowNumber].savingsAmount;

        if (service == 'ground') {
          await this.calculateSubTotalTarget(targetList, targetList[rowNumber].service, targetList[rowNumber].weightRange, columnNumber);
        }
        var calculatedTargetService: any = await this.calculateTargetSpend(targetList);

        (this as any)[targetTotalList] = [];
        (this as any)[targetTotalList].push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (Math.abs((this as any)[currentTotalList][0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / (this as any)[currentTotalList][0].currentSpend) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });

        this.scenariosDisplayed[columnNumber][targetTotalListName] = new MatTableDataSource((this as any)[targetTotalList]);

        if (typeof event == 'object') {
          await this.calculateFuel(columnNumber, this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data);
          await this.calculateTPBilling(columnNumber, this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data);
          await this.onAccSpendChange('', '', 'target', columnNumber);
        }

        await this.calculateOverallTotal('target', columnNumber);
      }
    }
  }

  async calculateSavingsAndPercent(targetList: any[], currentList: any[], rowNumber: number) {

    // ✅ Safety check
    if (!targetList?.[rowNumber] || !currentList?.[rowNumber]) {
      console.warn('Invalid row index:', rowNumber);
      return targetList;
    }

    const currentSpend = Number(currentList[rowNumber]?.currentSpend ?? 0);
    const targetSpend = Number(targetList[rowNumber]?.targetSpend ?? 0);


    targetList[rowNumber].savingsAmount = Number((targetList[rowNumber]?.targetSpend - currentList[rowNumber]?.currentSpend).toFixed(2));
    targetList[rowNumber].targetSavingsPercent =
      currentSpend === 0
        ? 0.00
        : Number(((targetList[rowNumber].savingsAmount / currentSpend) * 100).toFixed(2));

    // ✅ Sign correction
    if (
      (targetList[rowNumber].savingsAmount < 0 && targetList[rowNumber].targetSavingsPercent > 0) ||
      (targetList[rowNumber].savingsAmount > 0 && targetList[rowNumber].targetSavingsPercent < 0)
    ) {
      targetList[rowNumber].targetSavingsPercent =
        -targetList[rowNumber].targetSavingsPercent;
    }

    return targetList;
  }

  onSpendFocusOut(event: any, rowNumber: any, service: any, type: any, columnNumber: any) {

    if (Number(event.target.value.replaceAll('$', '').replaceAll(',', '').replaceAll('(', '').replace(')', '')).toString() != 'NaN') {
      let spend = Number(event.target.value.replaceAll('$', '').replaceAll(',', '').replaceAll('(', '').replaceAll(')', ''));

      var currentList = [];
      var targetList = [];
      var currentTotalList = '';
      var targetTotalList = ''
      var targetName = '';
      var currentTotalListName = '';
      var targetTotalListName = '';
      var dataSource: any = "";
      if (service.toLowerCase() == 'air') {
        currentList = this.currentSavingsAirList;
        currentTotalList = 'currentSavingsAirTotalList';
        targetTotalList = 'targetSavingsTotalList'
        targetName = "dataSourceAirTarget";
        currentTotalListName = 'dataSourceCurrentAirTotal'
        targetTotalListName = 'dataSourceTargetAirTotal'
        dataSource = "currentSavingsAirList";
      }
      else if (service.toLowerCase() == 'ground') {
        currentList = this.currentSavingsGroundList;
        currentTotalList = 'currentSavingsGroundTotalList';
        targetTotalList = 'targetSavingsGroundTotalList'
        targetName = "dataSourceGroundTarget";
        currentTotalListName = 'dataSourceCurrentGroundTotal'
        targetTotalListName = 'dataSourceTargetGroundTotal'
        dataSource = "currentSavingsGroundList";
      }
      else if (service.toLowerCase() == 'hwt') {
        currentList = this.currentSavingsHWTList;
        currentTotalList = 'currentSavingsHWTTotalList';
        targetTotalList = 'targetSavingsHWTTotalList'
        targetName = "dataSourceHWTTarget";
        currentTotalListName = 'dataSourceCurrentHwtTotal';
        targetTotalListName = 'dataSourceTargetHWTTotal';
        dataSource = "currentSavingsHWTList";
      }
      else {
        currentList = this.currentSavingsIntlList;
        currentTotalList = 'currentSavingsIntlTotalList';
        targetTotalList = 'targetSavingsIntlTotalList'
        targetName = "dataSourceIntlTarget";
        currentTotalListName = 'dataSourceCurrentIntlTotal';
        targetTotalListName = 'dataSourceTargetIntlTotal';
        dataSource = "currentSavingsIntlList";
      }

      if (type == 'current') {
        currentList[rowNumber].currentSpend = spend;
        (this as any)[dataSource][rowNumber].currentSpend = spend;
      }
      else if (type == 'target') {
        targetList = this.scenariosDisplayed[columnNumber][targetName].data;
        targetList[rowNumber].targetSpend = spend;
        this.scenariosDisplayed[columnNumber][targetName].data[rowNumber].targetSpend = spend;
        targetList[rowNumber].savingsAmount = targetList[rowNumber].targetSpend - currentList[rowNumber].currentSpend;

        if (currentList[rowNumber].currentSpend == 0) {
          targetList[rowNumber].targetSavingsPercent = "0.00";
        }
        else {
          targetList[rowNumber].targetSavingsPercent = ((((targetList[rowNumber].savingsAmount / currentList[rowNumber].currentSpend) * 100)).toFixed(2));
        }

        if ((targetList[rowNumber].savingsAmount < 0 && targetList[rowNumber].targetSavingsPercent > 0) || (targetList[rowNumber].savingsAmount > 0 && targetList[rowNumber].targetSavingsPercent < 0)) {
          targetList[rowNumber].targetSavingsPercent = -targetList[rowNumber].targetSavingsPercent;
        }

        this.scenariosDisplayed[columnNumber][targetName] = new MatTableDataSource(targetList);

      }
    }
  }

  async onAccSpendChange(event: any, rowNumber: any, type: any, columnNumber: any) {

    let eventValue;
    if (typeof event == 'object') {
      eventValue = event.target.value;
    }
    else {
      eventValue = event.toString();
    }

    if (Number(eventValue.replaceAll('$', '').replaceAll(',', '')).toString() != 'NaN') {
      let spend = Number(eventValue.replaceAll('$', '').replaceAll(',', '').replace('(', '').replace(')', ''));

      var currentList = [];
      var targetList: any = [];

      for (let no = 0; no < this.currentSavingsAccList.length; no++) {
        currentList[no] = Object.assign({}, this.currentSavingsAccList[no]);
      }

      if (type == 'current') {

        currentList[rowNumber].currentSpend = spend;
        var calculatedCurrentService: any = await this.calculateCurrentSpend(currentList);
        /*Exclude Customs and Duty amount for Savings % calculation*/
        let accDataList = this.dataSourceAcc.data;
        var filteredData = accDataList.filter((data: any) => data && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"));
        let customsDutySpend = 0;
        filteredData.forEach((data: any) => {
          customsDutySpend += Number(data.currentSpend) || 0;
        });
        this.currentSavingsAccTotalList = [];
        this.currentSavingsAccTotalList.push({
          service: 'Accessorial Pricing :',
          weightRange: '',
          count: calculatedCurrentService['totalCount'],
          currentPercent: '',
          currentSpend: calculatedCurrentService['totalCurrentSpend'],
          serviceType: ''
        });
        this.dataSourceCurrentAccTotal = new MatTableDataSource(this.currentSavingsAccTotalList);

        await this.calculateOverallTotal('current');

        for (let index in this.scenariosDisplayed) {

          targetList = this.scenariosDisplayed[index].dataSourceAccTarget.data;

          targetList = await this.calculateSavingsAndPercent(targetList, currentList, rowNumber);

          this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(targetList);

          var calculatedTargetService: any = await this.calculateTargetSpend(targetList);

          this.targetSavingsAccTotalList = [];
          this.targetSavingsAccTotalList.push({
            weightRange: '',
            count: '',
            targetPercent: '',
            targetSpend: calculatedTargetService['totalTargetSpend'],
            targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / (this.currentSavingsAccTotalList[0].currentSpend - customsDutySpend)) * 100 : 0,
            savingsAmount: calculatedTargetService['totalSavings']
          });

          this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);
          await this.calculateOverallTotal('target', Number(index));
        }
      }
      else {

        this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data.forEach((data: any) => targetList.push(Object.assign({}, data)));

        if (typeof event == 'object') {
          targetList = await this.calculateAccSavings(columnNumber, rowNumber, spend, targetList);
          if (targetList[rowNumber].isNewRow == undefined) {
            if ((!(targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('fuel'))) && (!(targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('tpbilling')))) {
              await this.calculateFuel(columnNumber, targetList);
            }
            if (!(targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('tpbilling') || targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('thirdpartybilling'))) {
              await this.calculateTPBilling(columnNumber, targetList);
            }
          }
        }
        var calculatedTargetService: any = await this.calculateTargetSpend(targetList);
        /*Exclude Customs and Duty amount for Savings % calculation*/
        let accDataList = this.dataSourceAcc.data;
        var filteredData = accDataList.filter((data: any) => data && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"));
        let customsDutySpend = 0;
        filteredData.forEach((data: any) => {
          customsDutySpend += Number(data.currentSpend) || 0;
        });
        this.targetSavingsAccTotalList = [];
        this.targetSavingsAccTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / (this.currentSavingsAccTotalList[0].currentSpend - customsDutySpend)) * 100 : 0,
          savingsAmount: calculatedTargetService['totalSavings']
        });

        this.scenariosDisplayed[columnNumber].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);

        await this.calculateOverallTotal('target', columnNumber);
      }
    }
  }

  onAccSpendFocusOut(event: any, rowNumber: any, type: any, columnNumber: any) {

    if (Number(event.target.value.replaceAll('$', '').replaceAll(',', '')).toString() != 'NaN') {
      let spend = Number(event.target.value.replaceAll('$', '').replaceAll(',', ''));

      var currentList = this.currentSavingsAccList;
      var targetList = [];

      if (type == 'current') {
        currentList[rowNumber].currentSpend = spend;
      }
      else if (type == 'target') {
        targetList = this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data;
        targetList[rowNumber].targetSpend = spend;
        targetList[rowNumber].savingsAmount = targetList[rowNumber].targetSpend - currentList[rowNumber].currentSpend;

        if (currentList[rowNumber].currentSpend == 0) {
          targetList[rowNumber].targetSavingsPercent = "0.00";
        }
        else {
          targetList[rowNumber].targetSavingsPercent = (((targetList[rowNumber].savingsAmount / currentList[rowNumber].currentSpend) * 100).toFixed(2));
        }

        if ((targetList[rowNumber].savingsAmount < 0 && targetList[rowNumber].targetSavingsPercent > 0) || (targetList[rowNumber].savingsAmount > 0 && targetList[rowNumber].targetSavingsPercent < 0)) {
          targetList[rowNumber].targetSavingsPercent = -targetList[rowNumber].targetSavingsPercent;
        }

        this.scenariosDisplayed[columnNumber].dataSourceAccTarget = new MatTableDataSource(targetList);

      }
    }
  }

  async onDiscountChange(value: any, rowNumber: any, service: any, serviceType: string, type: any, columnNumber?: any) {

    var percentageCount = (value.match(/%/g) || []).length;
    var dotCount = (value.match(/%/g) || []).length;
    if (percentageCount == 2 || dotCount == 2 || value.includes("-")) {
      return false;
    }

    let discount = Number(Number(value.replaceAll('%', '')).toFixed(2));
    var currentList = [];
    var targetList = [];
    var targetName = '';
    var minMaxList: any = '';

    if (serviceType == 'air') {
      currentList = this.currentSavingsAirList;
      targetName = "dataSourceAirTarget";
      minMaxList = "airMinMaxList";
    }
    else if (serviceType == 'ground') {
      currentList = this.currentSavingsGroundList;
      targetName = "dataSourceGroundTarget";
      minMaxList = "groundMinMaxList";
    }
    else if (serviceType == 'hwt') {
      currentList = this.currentSavingsHWTList;
      targetName = "dataSourceHWTTarget";
      minMaxList = "hwtMinMaxList";
    }
    else {
      currentList = this.currentSavingsIntlList;
      targetName = "dataSourceIntlTarget";
      minMaxList = "intlMinMaxList";
    }

    var min = this.netAmountMinMaxList.filter((minData: any) => minData.service == service);

    if (type == 'current') {

      if (serviceType == 'ground') {
        var filteredData = await this.getFilteredData(this.freightCurrentDetails, serviceType, service + currentList[rowNumber].weightRange);
      }
      else {
        var filteredData = await this.getFilteredData(this.freightCurrentDetails, serviceType, service);
      }

      var totalCurrentSpend = 0
      for (let row = 0; row < filteredData.length; row++) {

        let data = filteredData[row];
        let listRate = Number(data.oldBaseRate);
        let oldMinRate = Number(data.oldMinRatesheet);
        let count = Number(data.count);

        if (serviceType.toLowerCase() == 'hwt') {
          if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
            var currentSpend = ((Number((listRate * Number((1 - (discount / 100))))) < oldMinRate) ? Number(oldMinRate) : Number((listRate * Number((1 - (discount / 100))))));
          }
          else {
            var currentSpend = ((listRate - (listRate * (discount / 100)) < oldMinRate) ? Number(oldMinRate) : Number((listRate - (listRate * (discount / 100)))));
          }
          if (Number.isNaN(currentSpend) || currentSpend == Infinity || currentSpend == -Infinity) {
            currentSpend = 0;
          }
          var totalSpend = await this.roundTo(currentSpend, 2);
          data.currentSpend = await this.roundTo(totalSpend, 2);//Number(formatter[2].format(Number(totalSpend)).replaceAll(',', ''));
        }
        else {
          if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
            var currentSpend = ((Number((listRate * Number((1 - (discount / 100))))) < oldMinRate) ? Number(oldMinRate) : Number((listRate * Number((1 - (discount / 100))))));
          }
          else {
            var currentSpend = ((listRate - (listRate * (discount / 100)) < oldMinRate) ? Number(oldMinRate) : Number((listRate - (listRate * (discount / 100)))));
          }
          if (Number.isNaN(currentSpend) || currentSpend == Infinity || currentSpend == -Infinity) {
            currentSpend = 0;
          }
          totalSpend = await this.roundTo(currentSpend, 2) * count;
          data.currentSpend = totalSpend;
        }
        totalCurrentSpend += Number(data.currentSpend);
      }

      currentList[rowNumber].currentSpend = Number(await this.roundTo(totalCurrentSpend, 2));
      await this.onSpendChange(Number(await this.roundTo(totalCurrentSpend, 2)), rowNumber, serviceType, type, columnNumber);
    }
    else if (type == 'target') {

      if (min[0] == undefined) {
        if (serviceType != 'air' && serviceType != 'ground' && serviceType != 'hwt') {
          if (this.scenariosDisplayed[columnNumber].dataSourceIntlTarget.data[rowNumber].finalService.toLowerCase().includes('export')) {
            var min = this.netAmountMinMaxList.filter((minData: any) => minData.service.toLowerCase().includes('export'));
          }
          if (this.scenariosDisplayed[columnNumber].dataSourceIntlTarget.data[rowNumber].finalService.toLowerCase().includes('import')) {
            var min = this.netAmountMinMaxList.filter((minData: any) => minData.service.toLowerCase().includes('import'));
          }
        }
      }

      (this as any)[minMaxList].disMin = discount;
      (this as any)[minMaxList].disMax = discount;

      if (serviceType == 'ground') {
        var filteredData = await this.getFilteredData(this.scenariosDisplayed[columnNumber].freightTargetDetails, serviceType, service + this.scenariosDisplayed[columnNumber][targetName].data[rowNumber].weightRange);
      }
      else {
        var filteredData = await this.getFilteredData(this.scenariosDisplayed[columnNumber].freightTargetDetails, serviceType, service);
      }
      var totalTargetSpend = 0

      for (let rowNumber = 0; rowNumber < filteredData.length; rowNumber++) {
        let data = filteredData[rowNumber];

        var roundedTargetSpend;
        let newListRate = Number(Number(data.newBaseRate).toFixed(2));
        let newMinRate;

        if (min[0] != undefined) {
          if (columnNumber == 0) {
            if (min[0].target1Min == min[0].target1Max) {
              var minValue: any = min[0].target1Min;
            }
          }
          else {
            if (min[0].target2Min == min[0].target2Max) {
              var minValue: any = min[0].target2Min;
            }
          }

          var lowestRate = Number(data.lowestRate);

          if (minValue != undefined) {
            if (minValue.includes('%')) {
              var minValue: any = Number(minValue.replaceAll('$', '').replace('%', '').replaceAll(' ', ''));
              newMinRate = lowestRate - (lowestRate * (minValue / 100));
            }
            else {
              var minValue: any = Number(minValue.replaceAll('$', '').replace('%', '').replaceAll(' ', ''));
              newMinRate = lowestRate - minValue;
            }
          }
        }
        else {
          newMinRate = Number(Number(data.newMinRatesheet).toFixed(2));
        }

        if (newMinRate == undefined) {
          newMinRate = Number(data.newMinRatesheet);
        }

        let count = Number(data.count);

        if (serviceType.toLowerCase() == 'hwt') {
          if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
            var targetSpend = ((Number((newListRate * Number((1 - (discount / 100))))) < newMinRate) ? Number(newMinRate) : Number((newListRate * Number((1 - (discount / 100))))));
          }
          else {
            var targetSpend = ((newListRate - (newListRate * (discount / 100)) < newMinRate) ? Number(newMinRate) : Number((newListRate - (newListRate * (discount / 100)))));
          }
          if (Number.isNaN(targetSpend) || targetSpend == Infinity || targetSpend == -Infinity) {
            targetSpend = 0;
          }
          var totalSpend = await this.roundTo(targetSpend, 2);
          data.targetSpend = await this.roundTo(totalSpend, 2);//Number(formatter[2].format(Number(totalSpend)).replaceAll(',', ''));
        }
        else {
          if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
            var targetSpend = ((Number((newListRate * Number((1 - (discount / 100))))) < newMinRate) ? Number(newMinRate) : Number((newListRate * Number((1 - (discount / 100))))));
          }
          else {
            var targetSpend = ((newListRate - (newListRate * (discount / 100)) < newMinRate) ? Number(newMinRate) : Number((newListRate - (newListRate * (discount / 100)))));
          }
          if (Number.isNaN(targetSpend) || targetSpend == Infinity || targetSpend == -Infinity) {
            targetSpend = 0;
          }
          totalSpend = await this.roundTo(targetSpend, 2) * count;
          data.targetSpend = totalSpend;
        }
        totalTargetSpend += data.targetSpend;
      }

      // await this.exceldownloadList(filteredData);
      targetList = this.scenariosDisplayed[columnNumber][targetName].data;
      targetList[rowNumber].targetSpend = Number(totalTargetSpend.toFixed(2));
      await this.onSpendChange(Number(totalTargetSpend.toFixed(2)), rowNumber, serviceType, type, columnNumber);
      var accList: any = [];
      this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data.forEach((data: any) => accList.push(Object.assign({}, data)));
      await this.calculateFuel(columnNumber, accList);
      await this.calculateTPBilling(columnNumber, accList);
      await this.onAccSpendChange('', '', 'target', columnNumber);
    }
    return false;
  }

  async exceldownloadList(categoryYearACList: any) {
    var averageDiscountDataArr: any = []
    var today = new Date();
    var todayDate = this.datePipe.transform(today, "yyyy-MM-dd-HH-mm-ss");
    var fileName = this.carrierName + "_TemplistExcel" + todayDate + ".xlsx";
    var averageDiscountArr: any = [];

    for (let loop = 0; loop < categoryYearACList.length; loop++) {
      averageDiscountDataArr = []
      averageDiscountDataArr.push(categoryYearACList[loop].clientName,
        categoryYearACList[loop].lowestRate,
        categoryYearACList[loop].newBaseRate,
        categoryYearACList[loop].newMinRatesheet,
        categoryYearACList[loop].newService,
        categoryYearACList[loop].service,
        categoryYearACList[loop].serviceGrouping,
        categoryYearACList[loop].serviceName,
        categoryYearACList[loop].targetPercent,
        categoryYearACList[loop].targetSpend,
        categoryYearACList[loop].weightRange,
        categoryYearACList[loop].count,
      );
      averageDiscountArr.push(averageDiscountDataArr)
    }
    var averageDiscountHeaderArr = [];
    averageDiscountHeaderArr.push('Client Name', 'lowestRate', 'newBaseRate', 'newMinRatesheet', 'newService'
      , 'service', 'serviceGrouping', 'serviceName', 'targetPercent', 'targetSpend', 'weightRange', 'count')

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Total Spend By Customers');

    //Add Header Row
    let headerRow = worksheet.addRow(averageDiscountHeaderArr);
    headerRow.font = { family: 4, size: 12, bold: true };
    // Cell Style : Fill and Border
    headerRow.eachCell((cell: any, number: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',

        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    })
    //Add Data and Conditional Formatting
    var count = 1;
    averageDiscountArr.forEach((d: any) => {
      let row = worksheet.addRow(d);
      row.eachCell((cell, number) => {
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
    );
    worksheet.addRow([]);
    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
  }
  async calculateAccSavings(columnNumber: number, rowNumber: number, spend: number, targetList: any) {
    var currentList: any = [];
    this.currentSavingsAccList.forEach((data: any) => currentList.push(Object.assign({}, data)));
    targetList[rowNumber].targetSpend = spend;
    targetList[rowNumber].savingsAmount = (Math.abs(Number(Number(targetList[rowNumber].targetSpend).toFixed(2)) - Number(Number(currentList[rowNumber].currentSpend).toFixed(2))).toFixed(2) == '0.00') ? 0.00 : (Number(Number(targetList[rowNumber].targetSpend).toFixed(2)) - Number(Number(currentList[rowNumber].currentSpend).toFixed(2)));
    if (currentList[rowNumber].currentSpend == 0) {
      targetList[rowNumber].targetSavingsPercent = 0;
    }
    else {
      targetList[rowNumber].targetSavingsPercent = (((targetList[rowNumber].savingsAmount / currentList[rowNumber].currentSpend) * 100).toFixed(2));
    }
    if ((targetList[rowNumber].savingsAmount < 0 && targetList[rowNumber].targetSavingsPercent > 0) || (targetList[rowNumber].savingsAmount > 0 && targetList[rowNumber].targetSavingsPercent < 0)) {
      targetList[rowNumber].targetSavingsPercent = -targetList[rowNumber].targetSavingsPercent;
    }
    this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[rowNumber].targetSavingsPercent = targetList[rowNumber].targetSavingsPercent;
    this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[rowNumber].savingsAmount = targetList[rowNumber].savingsAmount;
    return targetList;
  }

  async calculateFuel(columnNumber: number, targetList: any) {

    var currentTotalAccSpend = 0;
    var targetTotalAccSpend = 0;

    let distinctAccServices = await this.getUniqueService(this.currentSavingsAccList, 'service');

    var rowIndex = distinctAccServices.findIndex((data: any) =>
      (data || '').toString().trim().toLowerCase().includes('fuel')
    );

    // ✅ safe access (no crash if -1)
    var NetAmount = this.currentSavingsAccList[rowIndex]?.currentSpend;

    var filteredCurrentAccData = this.currentSavingsAccList.filter((data: any) =>
      (data?.includedInFuel || '').toString().toLowerCase() == 'yes' &&
      !((data?.service || '').toString().trim().toLowerCase().includes('fuel'))
    );

    filteredCurrentAccData.forEach((data: any) => {
      currentTotalAccSpend += Number(data?.currentSpend || 0);
    });

    var currentSpend = Number((this.totalFreightSpend + currentTotalAccSpend).toFixed(2));

    var filteredTargetAccData = targetList.filter((data: any) =>
      (data?.includedInFuel || '').toString().toLowerCase() == 'yes' &&
      !((data?.service || '').toString().trim().toLowerCase().includes('fuel'))
    );

    filteredTargetAccData.forEach((data: any) => {
      targetTotalAccSpend += Number(data?.targetSpend || 0);
    });

    this.targetSavingsAirTotalList = this.scenariosDisplayed[columnNumber]?.dataSourceTargetAirTotal?.data;
    this.targetSavingsGroundTotalList = this.scenariosDisplayed[columnNumber]?.dataSourceTargetGroundTotal?.data;
    this.targetSavingsIntlTotalList = this.scenariosDisplayed[columnNumber]?.dataSourceTargetIntlTotal?.data;
    this.targetSavingsAccTotalList = this.scenariosDisplayed[columnNumber]?.dataSourceTargetAccTotal?.data;
    this.targetSavingsHWTTotalList = this.scenariosDisplayed[columnNumber]?.dataSourceTargetHWTTotal?.data;

    var targetSpend = Number((
      (this.targetSavingsAirTotalList?.[0]?.targetSpend || 0) +
      (this.targetSavingsGroundTotalList?.[0]?.targetSpend || 0) +
      (this.targetSavingsIntlTotalList?.[0]?.targetSpend || 0) +
      (this.targetSavingsHWTTotalList?.[0]?.targetSpend || 0) +
      targetTotalAccSpend
    ).toFixed(2));

    var savingsPercent = Number(((targetSpend - currentSpend) / currentSpend).toFixed(4));

    var fuelSurchargeCurrentData = this.accessorialCurrentDetails.filter((data: any) =>
      ((data?.service || '').toString().trim().toLowerCase().includes('fuel'))
    );

    var fuelSurchargeTargetData = this.scenariosDisplayed[columnNumber]?.accessorialTargetDetails?.filter((data: any) =>
      ((data?.service || '').toString().trim().toLowerCase().includes('fuel'))
    );

    var targetSavingsAccList = targetList;

    var baselineGrossAmount = 0;

    for (let data of fuelSurchargeCurrentData) {
      let currentDiscount = Number(Number(data?.currentPercent || 0).toFixed(4));
      let GrossAmount = Number((NetAmount / (1 - (currentDiscount / 100))).toFixed(2));
      baselineGrossAmount += GrossAmount;
      break;
    }

    var totalTargetSpend = 0;

    for (let data of fuelSurchargeTargetData || []) {
      let targetGrossAmount = Number((baselineGrossAmount + (baselineGrossAmount * savingsPercent)).toFixed(2));

      if (Number.isNaN(targetGrossAmount)) {
        targetGrossAmount = 0;
      }

      let targetDiscount = Number(Number(data?.targetPercent || 0).toFixed(4));

      var targetSpend = targetGrossAmount * (1 - (targetDiscount / 100));

      if (Number.isNaN(targetSpend) || targetSpend == Infinity || targetGrossAmount == -Infinity) {
        targetSpend = 0;
      }

      data.targetSpend = await this.roundTo(targetSpend, 2);
      totalTargetSpend += data.targetSpend;
      break;
    }

    targetSavingsAccList = await this.calculateAccSavings(columnNumber, rowIndex, totalTargetSpend, targetSavingsAccList);

    if (this.scenariosDisplayed[columnNumber]?.dataSourceAccTarget?.data?.[rowIndex]) {
      this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[rowIndex].targetSpend =
        targetSavingsAccList?.[rowIndex]?.targetSpend;
    }
  }

  async calculateTPBilling(columnNumber: number, targetList: any) {
    var currentTotalAccSpend = 0;
    var targetTotalAccSpend = 0;
    let distinctAccServices = await this.getUniqueService(this.currentSavingsAccList, 'service');
    var rowIndex = distinctAccServices.findIndex((data: any) => data.replaceAll(' ', '').toLowerCase().includes('thirdpartybilling') || data.replaceAll(' ', '').toLowerCase().includes('tpbilling'));

    if (rowIndex > 0) {
      var filteredCurrentAccData = this.currentSavingsAccList.filter((data: any) => (data.includedInFuel || '').toLowerCase() == 'yes');
      filteredCurrentAccData.forEach((data: any) => {
        currentTotalAccSpend += Number(data.currentSpend);
      });
      var currentSpend = Number((this.totalFreightSpend + currentTotalAccSpend).toFixed(2));
      var filteredTargetAccData = targetList.filter((data: any) => (data.includedInFuel || '').toLowerCase() == 'yes');
      filteredTargetAccData.forEach((data: any) => {
        targetTotalAccSpend += Number(data.targetSpend);
      });
      this.targetSavingsAirTotalList = this.scenariosDisplayed[columnNumber].dataSourceTargetAirTotal.data;
      this.targetSavingsGroundTotalList = this.scenariosDisplayed[columnNumber].dataSourceTargetGroundTotal.data;
      this.targetSavingsIntlTotalList = this.scenariosDisplayed[columnNumber].dataSourceTargetIntlTotal.data;
      this.targetSavingsAccTotalList = this.scenariosDisplayed[columnNumber].dataSourceTargetAccTotal.data;
      this.targetSavingsHWTTotalList = this.scenariosDisplayed[columnNumber].dataSourceTargetHWTTotal.data;
      var targetSpend = Number((this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend + targetTotalAccSpend).toFixed(2));
      var savingsPercent = Number(((currentSpend - targetSpend) / currentSpend).toFixed(4));
      var tpBillingCurrentData = this.accessorialCurrentDetails.filter((data: any) => {
        const service = data?.service?.replaceAll(' ', '').toLowerCase();
        return service?.includes('thirdpartybilling') || service?.includes('tpbilling');
      });

      var tpBillingTargetData = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((data: any) => {
        const service = data?.service?.replaceAll(' ', '').toLowerCase();
        return service?.includes('thirdpartybilling') || service?.includes('tpbilling');
      });
      var targetSavingsAccList = targetList;
      var totalTargetSpend = 0;
      for (let index = 0; index < tpBillingTargetData.length; index++) {
        let data = tpBillingTargetData[index];
        let currentSpend = Number(tpBillingCurrentData[index].currentSpend);
        let currentPercent = Number(tpBillingCurrentData[index].currentPercent);
        let targetGrossAmount = Number(Number((currentSpend / (1 - (currentPercent / 100))) * (1 - savingsPercent)).toFixed(4));
        if (Number.isNaN(targetGrossAmount) || targetGrossAmount == Infinity || targetGrossAmount == -Infinity) {
          targetGrossAmount = 0;
        }
        let targetDiscount = Number(Number(data.targetPercent).toFixed(4));
        var targetSpend = targetGrossAmount * (1 - (targetDiscount / 100));
        if (Number.isNaN(targetSpend) || targetSpend == Infinity || targetGrossAmount == -Infinity) {
          targetSpend = 0;
        }
        data.targetSpend = targetSpend;
        totalTargetSpend += data.targetSpend;
      }
      targetSavingsAccList = await this.calculateAccSavings(columnNumber, rowIndex, totalTargetSpend, targetSavingsAccList);
      this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[rowIndex].targetSpend = targetSavingsAccList[rowIndex].targetSpend;
    }
  }

  async onAccDiscountChange(event: any, rowNumber: any, service: any, serviceType: any, type: any, columnNumber: any) {
    var percentageCount = (event.target.value.match(/%/g) || []).length;
    var dotCount = (event.target.value.match(/%/g) || []).length;
    if (percentageCount == 2 || dotCount == 2 || event.target.value.includes("-")) {
      return false;
    }
    let discountType = '';

    if (event.target.value.includes('%')) {
      discountType = '%';
    }
    else if (event.target.value.includes('$')) {
      discountType = '$';
    }
    let discount = Number(event.target.value.replaceAll('%', '').replaceAll('$', ''));
    if (discount.toString() == 'NaN') {
      return false;
    }
    var currentList: any = [];
    var targetList: any = [];
    currentList = this.currentSavingsAccList;

    let ratesheetGrouping = this.currentSavingsAccList[rowNumber].ratesheetGrouping.toLowerCase() + this.currentSavingsAccList[rowNumber].serviceName.toLowerCase();
    let serviceName = this.currentSavingsAccList[rowNumber].serviceName;

    if (type == 'current') {

      if (discountType == '') {
        discountType = this.accMinMaxList[rowNumber].discountType;
      }
      else {
        this.currentSavingsAccList[rowNumber].currentPercentType = discountType;
      }

      if (!this.accCheckList.includes(this.currentSavingsAccList[rowNumber].ratesheetGrouping.toLowerCase() + this.currentSavingsAccList[rowNumber].serviceName.toLowerCase())) {
        var filteredData = this.accessorialCurrentDetails.filter((data: any) => data.service == service && !this.accCheckList.includes(data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase()));
      }
      else {
        var filteredData = this.accessorialCurrentDetails.filter((data: any) => data.ratesheetGrouping == this.currentSavingsAccList[rowNumber].ratesheetGrouping && data.serviceName == this.currentSavingsAccList[rowNumber].serviceName);
      }

      var totalCurrentSpend = 0
      for (let row = 0; row < filteredData.length; row++) {
        let data = filteredData[row];
        data.currentPercentType = discountType;
        let currentPercentType = data.currentPercentType;
        let totalGrossAmount = Number(Number(data.totalGrossAmount).toFixed(2));
        let count = Number(data.count);
        data.currentPercent = discount;
        if (data.service.toLowerCase().replaceAll(' ', '') == 'tpbilling') {
          var currentSpend = totalGrossAmount;
        }
        else if (data.service.toLowerCase().replaceAll(' ', '') == 'declaredvalue' && this.carrierName.toLowerCase() == 'ups') {
          var currentSpend = totalGrossAmount;
        }
        else {
          if (currentPercentType == '%') {
            var currentSpend = totalGrossAmount * (1 - (discount / 100));
          }
          else {
            var currentSpend = totalGrossAmount - discount;
          }
        }
        if (Number.isNaN(currentSpend) || currentSpend == Infinity || currentSpend == -Infinity) {
          currentSpend = 0;
        }
        data.currentSpend = await this.roundTo(currentSpend, 2);
        totalCurrentSpend += Number(Number(data.currentSpend).toFixed(2));
      }

      currentList[rowNumber].currentSpend = totalCurrentSpend;
      this.onAccSpendChange(totalCurrentSpend, rowNumber, type, columnNumber);
    }
    else if (type == 'target') {


      if (discountType == '') {
        discountType = this.scenariosDisplayed[columnNumber].accMinMaxList[rowNumber].discountType;
      }
      else {
        // this.scenariosDisplayed[columnNumber].accMinMaxList[rowNumber].discountType = discountType;
        this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[rowNumber].targetPercentType = discountType;
      }

      if (!this.accCheckList.includes(this.currentSavingsAccList[rowNumber].ratesheetGrouping.toLowerCase() + this.currentSavingsAccList[rowNumber].serviceName.toLowerCase())) {
        var filteredData = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((data: any) => data.service == service && !this.accCheckList.includes(data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase()));
        var currentfilteredData = this.accessorialCurrentDetails.filter((data: any) => data.service == service && !this.accCheckList.includes(data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase()));
      }
      else {
        var filteredData = this.scenariosDisplayed[columnNumber].accessorialTargetDetails.filter((data: any) => data.ratesheetGrouping == this.currentSavingsAccList[rowNumber].ratesheetGrouping && data.serviceName == this.currentSavingsAccList[rowNumber].serviceName);
        var currentfilteredData = this.accessorialCurrentDetails.filter((data: any) => data.ratesheetGrouping == this.currentSavingsAccList[rowNumber].ratesheetGrouping && data.serviceName == this.currentSavingsAccList[rowNumber].serviceName);
      }
      var totalTargetSpend = 0
      for (let row = 0; row < filteredData.length; row++) {
        let data = filteredData[row];
        data.targetPercentType = discountType;
        let targetPercentType = data.targetPercentType;
        let totalGrossAmount = Number(Number(data.totalGrossAmount).toFixed(2));
        let count = Number(data.count);
        data.targetPercent = discount;
        var currentDiscount = Number(Number(currentfilteredData[row].currentPercent).toFixed(2));

        if (data.service.toLowerCase().replaceAll(' ', '') == 'declaredvalue' && this.carrierName.toLowerCase() == 'ups') {
          if (targetPercentType == '%') {
            var targetSpend = (totalGrossAmount / (1 - (currentDiscount / 100))) * (1 - (discount / 100));
          }
          else {
            var targetSpend = totalGrossAmount - discount;
          }
        }
        else {
          if (targetPercentType == '%') {
            var targetSpend = totalGrossAmount * (1 - (discount / 100));
          }
          else {
            var targetSpend = totalGrossAmount - discount;
          }
        }
        if (Number.isNaN(targetSpend) || targetSpend == Infinity || targetSpend == -Infinity) {
          targetSpend = 0;
        }

        data.targetSpend = await this.roundTo(targetSpend, 2);
        totalTargetSpend += data.targetSpend;
      }
      this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data[rowNumber].targetSpend = totalTargetSpend;
      this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data.forEach((data: any) => targetList.push(Object.assign({}, data)));
      targetList = await this.calculateAccSavings(columnNumber, rowNumber, totalTargetSpend, targetList);
      if (targetList[rowNumber].isNewRow == undefined) {
        if ((!(targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('fuel'))) && (!(targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('tpbilling')))) {
          await this.calculateFuel(columnNumber, targetList);
        }
        if (!(targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('tpbilling') || targetList[rowNumber].service.toLowerCase().replaceAll(' ', '').includes('thirdpartybilling'))) {
          await this.calculateTPBilling(columnNumber, targetList);
        }
      }
      await this.onAccSpendChange('', '', 'target', columnNumber);
    }
    return false;
  }
  async filterAirIntlHWTData(index: number, serviceName: any, dataList: any, serviceType: any, hoverName: string, excelServiceName: string) {
    var filteredData = await dataList.filter((obj: any) => obj.service == serviceName);
    let rowNumber;
    if (serviceType == 'air') {
      rowNumber = this.currentSavingsAirList.findIndex((airData: any) => airData.service == serviceName);
    }
    else if (serviceType == 'hwt') {
      rowNumber = this.currentSavingsHWTList.findIndex((airData: any) => airData.service == serviceName);
    }
    else {
      rowNumber = this.currentSavingsIntlList.findIndex((airData: any) => airData.service == serviceName);
    }
    if (rowNumber == -1) {
      let totalCurrentSpend = 0;
      let totalCount = 0;

      for (let key in filteredData) {
        if (serviceType == 'hwt' || filteredData[key].dataType == 'New Web') {
          totalCurrentSpend = totalCurrentSpend + Number(Number(filteredData[key].currentSpend).toFixed(2));
        }
        else {
          totalCurrentSpend = totalCurrentSpend + Number(Number(filteredData[key].currentSpend).toFixed(2)) * Number(filteredData[key].count);
        }
        totalCount = totalCount + Number(filteredData[key].count);
      }
      if (filteredData[0] != undefined) {
        var calculatedData = Object.assign({}, filteredData[0]);
        calculatedData.currentSpend = Number(totalCurrentSpend.toFixed(2));
        calculatedData.count = totalCount;
        calculatedData.weightRange = (serviceType == 'hwt') ? '1-2000' : 'All';
        if (serviceType == 'air') {
          if (this.loaded) {
            this.currentSavingsAirList.splice(index, 0, calculatedData);
          }
          else {
            this.currentSavingsAirList.push(calculatedData);
          }
        }
        else if (serviceType == 'hwt') {
          if (this.loaded) {
            this.currentSavingsHWTList.splice(index, 0, calculatedData);
          }
          else {
            this.currentSavingsHWTList.push(calculatedData);
          }
        }
        else {
          if (this.loaded) {
            this.currentSavingsIntlList.splice(index, 0, calculatedData);
          }
          else {
            this.currentSavingsIntlList.push(calculatedData);
          }
        }
      }
      else if (filteredData[0] == undefined) {
        calculatedData = {
          clientId: (this.selectedCarrier.carrierName.toLowerCase() == 'ups') ? this.cookiesService.getCookieItem("clientId") : this.fedexClientId,
          clientName: null,
          count: 0,
          currentPercent: 0.00,
          currentSpend: 0.00,
          newBaseRate: "0.00",
          newMinRatesheet: "0.00",
          newService: "",
          oldBaseRate: 0.00,
          oldDiscountRate: 0.00,
          oldMinRatesheet: 0.00,
          savingsAmount: 0.00,
          service: serviceName,
          serviceName: hoverName,
          finalService: excelServiceName,
          serviceGrouping: serviceType,
          targetId: '',
          targetPercent: "0.00",
          targetSavingsPercent: 0.00,
          targetSpend: 0.00,
          weightRange: 'All',
          newRow: true
        };
        if (serviceType == 'air') {
          if (this.loaded) {
            this.currentSavingsAirList.splice(index, 0, calculatedData);
          }
          else {
            this.currentSavingsAirList.push(calculatedData);
          }
        }
        else if (serviceType == 'hwt') {
          if (this.loaded) {
            this.currentSavingsHWTList.splice(index, 0, calculatedData);
          }
          else {
            this.currentSavingsHWTList.push(calculatedData);
          }
        }
        else {
          if (this.loaded) {
            this.currentSavingsIntlList.splice(index, 0, calculatedData);
          }
          else {
            this.currentSavingsIntlList.push(calculatedData);
          }
        }
      }
    }
  }

  async filterAirIntlHWTTargetData(distinctServices: any, data: any, index: any, service: any, scenarioId: any) {

    var filteredData: any;
    filteredData = await data.filter((obj: any) => obj.service == distinctServices[index]);
    var totalTargetSpend = 0;
    var totalSavings = 0;
    var targetSavingsPercent;

    let currentList = [];
    let targetList = [];
    let targetName = '';
    let minMaxList = '';
    let rowNumber;

    if (service.toLowerCase() == 'air') {
      currentList = this.currentSavingsAirList;
      targetName = "dataSourceAirTarget";
      minMaxList = "airMinMaxList";
      rowNumber = await this.totalScenarios[scenarioId][targetName].data.findIndex((x: any) => x.service == distinctServices[index]);
    }
    else if (service.toLowerCase() == 'hwt') {
      currentList = this.currentSavingsHWTList;
      targetName = "dataSourceHWTTarget";
      minMaxList = "hwtMinMaxList";
      rowNumber = await this.totalScenarios[scenarioId][targetName].data.findIndex((x: any) => x.service == distinctServices[index]);
    }
    else {
      currentList = this.currentSavingsIntlList;
      targetName = "dataSourceIntlTarget";
      minMaxList = "intlMinMaxList";
      rowNumber = await this.totalScenarios[scenarioId][targetName].data.findIndex((x: any) => x.service == distinctServices[index]);
    }

    if (rowNumber != -1 && this.totalScenarios[scenarioId].loaded) {
      targetList = this.totalScenarios[scenarioId][targetName].data;
      totalTargetSpend = Number(targetList[rowNumber].targetSpend.toFixed(2));
    }
    else {
      for (let key in filteredData) {
        if (service.toLowerCase() == 'hwt' || filteredData[key].dataType == 'New Web') {
          totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
        }
        else {
          totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2)) * Number(filteredData[key].count);
        }
      }

      totalTargetSpend = Number(totalTargetSpend.toFixed(2));
    }

    if (filteredData[0] != undefined) {
      var calculatedData = Object.assign({}, filteredData[0]);
      calculatedData.targetSpend = totalTargetSpend;

      if (service == 'Air') {
        let currentService = await this.currentSavingsAirList.filter((Services: any) => Services.service == filteredData[0].service)
        if (filteredData[0] != undefined) {
          if (currentService[0] != null && currentService[0] != undefined) {
            totalSavings = totalTargetSpend - currentService[0].currentSpend;
            totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;

            if (currentService[0].currentSpend == 0)
              targetSavingsPercent = 0;
            else
              targetSavingsPercent = (totalSavings / currentService[0].currentSpend) * 100;
            // }

            calculatedData.savingsAmount = totalSavings;
            calculatedData.targetSavingsPercent = targetSavingsPercent;

            index = await this.currentSavingsAirList.findIndex((x: any) => x.service == filteredData[0].service);
            this.targetSavingsAirList[index] = await calculatedData;

          }
        }
      }

      else if (service == 'Intl') {
        let currentService = await this.currentSavingsIntlList.filter((Data: any) => Data.service == filteredData[0].service)
        if (currentService[0] != null && currentService[0] != undefined) {
          totalSavings = totalTargetSpend - currentService[0].currentSpend;
          totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;

          if (currentService[0].currentSpend == 0)
            targetSavingsPercent = 0;
          else
            targetSavingsPercent = (totalSavings / currentService[0].currentSpend) * 100;
          // }

          calculatedData.savingsAmount = totalSavings;
          calculatedData.targetSavingsPercent = targetSavingsPercent;

          index = await this.currentSavingsIntlList.findIndex((x: any) => x.service == filteredData[0].service);
          this.targetSavingsIntlList[index] = await calculatedData;
        }

      }
      else if (service.toLowerCase() == 'hwt') {
        let currentService = await this.currentSavingsHWTList.filter((Data: any) => Data.service == filteredData[0].service)
        if (currentService[0] != null && currentService[0] != undefined) {
          totalSavings = currentService[0].currentSpend - totalTargetSpend;
          totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;

          if (currentService[0].currentSpend == 0)
            targetSavingsPercent = 0;
          else
            targetSavingsPercent = (totalSavings / currentService[0].currentSpend) * 100;
          // }
          calculatedData.savingsAmount = totalSavings;
          calculatedData.targetSavingsPercent = targetSavingsPercent;

          index = await this.currentSavingsHWTList.findIndex((x: any) => x.service == filteredData[0].service);
          this.targetSavingsHWTList[index] = await calculatedData;
        }
      }
    }
    else if (filteredData[0] == undefined) {
      calculatedData = {
        clientId: (this.selectedCarrier.carrierName.toLowerCase() == 'ups') ? this.cookiesService.getCookieItem("clientId") : this.fedexClientId,
        clientName: null,
        count: 0,
        currentPercent: null,
        currentSpend: null,
        newBaseRate: "0.00",
        newMinRatesheet: "0.00",
        newService: "",
        oldBaseRate: 0.00,
        oldDiscountRate: 0.00,
        oldMinRatesheet: 0.00,
        savingsAmount: 0.00,
        service: distinctServices[index],
        serviceGrouping: service,
        targetId: '',
        targetPercent: "0.00",
        targetSavingsPercent: 0.00,
        targetSpend: 0.00,
        weightRange: 0.00,
        isNewRow: true
      };

      if (service == 'Air') {
        let row = await this.currentSavingsAirList.findIndex((x: any) => x.service == distinctServices[index]);
        calculatedData.savingsAmount = Number(Number(this.currentSavingsAirList[row].currentSpend).toFixed(2));
        calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAirList[row].currentSpend.toFixed(2))) * 100);
        this.targetSavingsAirList[row] = await calculatedData;
      }
      else if (service == 'Intl') {
        let row = await this.currentSavingsIntlList.findIndex((x: any) => x.service == distinctServices[index]);
        calculatedData.savingsAmount = Number(Number(this.currentSavingsIntlList[row].currentSpend).toFixed(2));
        calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsIntlList[row].currentSpend.toFixed(2))) * 100);
        this.targetSavingsIntlList[row] = await calculatedData;
      }
      else if (service.toLowerCase() == 'hwt') {
        let row = await this.currentSavingsHWTList.findIndex((x: any) => x.service == distinctServices[index]);
        calculatedData.savingsAmount = Number(Number(this.currentSavingsHWTList[row].currentSpend).toFixed(2));
        calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsHWTList[row].currentSpend.toFixed(2))) * 100);
        this.targetSavingsHWTList[row] = await calculatedData;
      }
    }
  }

  async filterGroundData(fromWeight: any, toWeight: any, index: number, dataList: any, serviceIndex: number) {

    let serviceName = this.distinctGroundServices[index];
    let hoverName = this.distinctGroundServiceName[index];
    let excelServiceName = this.distinctGroundExcelServiceName[index];
    let newService = this.distinctGroundNewService[index];

    var filteredData;
    var totalCurrentSpend: any = 0;
    var totalCount = 0;
    let weightRange = '';

    let dataExists: boolean = false;
    let groundRowNumber;

    if (toWeight != '') {
      weightRange = fromWeight + '-' + toWeight;
      filteredData = dataList.filter((obj: any) => obj.service == serviceName && (Number(obj.weightRange) >= fromWeight && Number(obj.weightRange) <= toWeight));

      if (serviceName == "SmartPost Less Than 1lb" || serviceName == "Surepost Less Than 1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || serviceName == "UPS Ground Saver - Less than 1 lb" || serviceName == "Ground Saver - Less than 1 lb" || serviceName == "UPS Ground Saver Less Than 1lb" || serviceName == "Ground Saver Less Than 1lb") {
        groundRowNumber = await this.currentSavingsGroundList.findIndex((x: any) => x.serviceName == hoverName);
      }
      else {
        groundRowNumber = await this.currentSavingsGroundList.findIndex((x: any) => x.serviceName == hoverName && x.weightRange == (fromWeight + "-" + toWeight));
      }
    }
    else {
      weightRange = fromWeight + '+';
      filteredData = dataList.filter((obj: any) => obj.service == serviceName && Number(obj.weightRange) >= fromWeight);

      groundRowNumber = await this.currentSavingsGroundList.findIndex((x: any) => x.serviceName == hoverName && x.weightRange == (fromWeight + "+"));
    }

    if (groundRowNumber == -1) {
      for (let key in filteredData) {
        if (serviceName == "Ground (Freight Pricing)" || serviceName == "ARS Ground" || filteredData[key].dataType == 'New Web') {
          totalCurrentSpend = totalCurrentSpend + Number(filteredData[key].currentSpend);
        }
        else {
          totalCurrentSpend = totalCurrentSpend + Number(Number(filteredData[key].currentSpend).toFixed(2)) * Number(filteredData[key].count);
        }
        totalCount = totalCount + Number(filteredData[key].count);
      }

      totalCurrentSpend = Number(totalCurrentSpend.toFixed(2));

      if (filteredData[0] != undefined) {
        var calculatedData = Object.assign({}, filteredData[0]);
        calculatedData.currentSpend = totalCurrentSpend;
        calculatedData.count = totalCount;
        if (toWeight != '') {
          if (serviceName == "SmartPost Less Than 1lb" || serviceName == "Surepost Less Than 1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || serviceName == "UPS Ground Saver - Less than 1 lb" || serviceName == "Ground Saver - Less than 1 lb" || serviceName == "UPS Ground Saver Less Than 1lb" || serviceName == "Ground Saver Less Than 1lb") {
            calculatedData.weightRange = "0-0.99";
          }
          else {
            calculatedData.weightRange = fromWeight + '-' + toWeight;
          }
        }
        else {
          calculatedData.weightRange = fromWeight + '+';
        }
        var rowIndex;
        if (toWeight != '') {
          if (calculatedData.serviceName == "SmartPost Less Than 1lb" || calculatedData.serviceName == "Surepost Less Than 1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundeconomygreaterthan1lb" || calculatedData.serviceName == "UPS Ground Saver - Less than 1 lb" || calculatedData.serviceName == "Ground Saver - Less than 1 lb" || calculatedData.serviceName == "UPS Ground Saver Less Than 1lb" || calculatedData.serviceName == "Ground Saver Less Than 1lb")
            rowIndex = await this.currentSavingsGroundList.findIndex((x: any) => x.serviceName == calculatedData.serviceName);
          else
            rowIndex = await this.currentSavingsGroundList.findIndex((x: any) => x.serviceName == calculatedData.serviceName && x.weightRange == (fromWeight + "-" + toWeight));
        }
        else {
          rowIndex = await this.currentSavingsGroundList.findIndex((x: any) => x.serviceName == calculatedData.serviceName && x.weightRange == (fromWeight + "+"));
        }

        if (this.loaded) {
          this.currentSavingsGroundList.splice(serviceIndex, 0, calculatedData);
        }
        else {
          this.currentSavingsGroundList.push(calculatedData);
        }

      }
      else if (filteredData[0] == undefined) {

        let weightFrom = fromWeight;
        let weightTo = (toWeight == '') ? 1000 : toWeight;

        calculatedData = {
          clientId: (this.selectedCarrier.carrierName.toLowerCase() == 'ups') ? this.cookiesService.getCookieItem("clientId") : this.fedexClientId,
          clientName: null,
          count: 0,
          currentPercent: 0.00,
          currentSpend: 0.00,
          newBaseRate: "0.00",
          newMinRatesheet: "0.00",
          oldBaseRate: 0.00,
          oldDiscountRate: 0.00,
          oldMinRatesheet: 0.00,
          savingsAmount: 0.00,
          service: serviceName,
          serviceName: hoverName,
          finalService: excelServiceName,
          newService: newService,
          serviceGrouping: 'Ground',
          targetId: '',
          targetPercent: "0.00",
          targetSavingsPercent: 0.00,
          targetSpend: 0.00,
          weightRange: weightRange,
          newRow: true,
          weightFrom: weightFrom,
          weightTo: weightTo
        };

        if (toWeight != '') {
          if (serviceName == "SmartPost Less Than 1lb" || serviceName == "Surepost Less Than 1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || serviceName.toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundsaver" || serviceName.toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || serviceName == "UPS Ground Saver - Less than 1 lb" || serviceName == "Ground Saver - Less than 1 lb" || serviceName == "UPS Ground Saver Less Than 1lb" || serviceName == "Ground Saver Less Than 1lb") {
            calculatedData.weightRange = "0-0.99";
          }
          else {
            calculatedData.weightRange = fromWeight + '-' + toWeight;
          }
        }
        else {
          calculatedData.weightRange = fromWeight + '+';
        }

        if (this.loaded) {
          this.currentSavingsGroundList.splice(serviceIndex, 0, calculatedData);
        }
        else {
          this.currentSavingsGroundList.push(calculatedData);
        }
      }
    }
  }

  async filterGroundTargetData(fromWeight: any, toWeight: any, distinctServices: any, data: any, index: any, scenarioId: number) {

    var filteredData;
    var totalTargetSpend = 0;
    var totalSavings = 0;
    var targetSavingsPercent = 0;

    if (toWeight != '') {
      filteredData = data.filter((obj: any) => obj.service == distinctServices[index] && (Number(obj.weightRange) >= fromWeight && Number(obj.weightRange) <= toWeight));
    }
    else {
      filteredData = data.filter((obj: any) => obj.service == distinctServices[index] && Number(obj.weightRange) >= fromWeight);
    }

    let groundRowNumber;
    if (toWeight != '') {
      if (distinctServices[index] == "SmartPost Less Than 1lb" || distinctServices[index] == "Surepost Less Than 1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || distinctServices[index] == "UPS Ground Saver - Less than 1 lb" || distinctServices[index] == "Ground Saver - Less than 1 lb" || distinctServices[index] == "UPS Ground Saver Less Than 1lb" || distinctServices[index] == "Ground Saver Less Than 1lb")
        groundRowNumber = await this.totalScenarios[scenarioId].dataSourceGroundTarget.data.findIndex((x: any) =>
          x.service == distinctServices[index]);
      else
        groundRowNumber = await this.totalScenarios[scenarioId].dataSourceGroundTarget.data.findIndex((x: any) =>
          x.service == distinctServices[index] && x.weightRange == (fromWeight + "-" + toWeight));
    }
    else {
      groundRowNumber = await this.totalScenarios[scenarioId].dataSourceGroundTarget.data.findIndex((x: any) => x.service == distinctServices[index] && x.weightRange == (fromWeight + "+"));
    }

    if (groundRowNumber != -1 && this.totalScenarios[scenarioId].loaded) {
      let currentList = this.currentSavingsGroundList;
      let targetName = "dataSourceGroundTarget";
      let minMaxList = "groundMinMaxList";


      let targetList = this.totalScenarios[scenarioId][targetName].data;

      totalTargetSpend = Number(targetList[groundRowNumber].targetSpend.toFixed(2));
    }
    else {
      for (let key in filteredData) {
        if (distinctServices[index] == "Ground (Freight Pricing)" || distinctServices[index] == "ARS Ground" || filteredData[key].dataType == 'New Web') {
          totalTargetSpend = totalTargetSpend + Number(filteredData[key].targetSpend);
        }
        else {
          totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2)) * Number(filteredData[key].count);
        }
      }
    }
    totalTargetSpend = Number(totalTargetSpend.toFixed(2));

    let currentService;
    var calculatedData: any;
    if (toWeight != '') {

      if (distinctServices[index] == "SmartPost Less Than 1lb" || distinctServices[index] == "Surepost Less Than 1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || distinctServices[index] == "UPS Ground Saver - Less than 1 lb" || distinctServices[index] == "Ground Saver - Less than 1 lb" || distinctServices[index] == "UPS Ground Saver Less Than 1lb" || distinctServices[index] == "Ground Saver Less Than 1lb")
        currentService = await this.currentSavingsGroundList.filter((Services: any) => Services.service == distinctServices[index]);
      else
        currentService = await this.currentSavingsGroundList.filter((Services: any) => Services.service == distinctServices[index] && Services.weightRange == (fromWeight + "-" + toWeight));
    }
    else {
      currentService = await this.currentSavingsGroundList.filter((Services: any) => Services.service == distinctServices[index] && Services.weightRange == (fromWeight + "+"));
    }

    if (filteredData[0] != undefined) {
      if (currentService[0] != null && currentService[0] != undefined) {

        totalSavings = totalTargetSpend - currentService[0].currentSpend;
        totalSavings = (totalSavings.toFixed(2) == '0.00') ? 0.00 : totalSavings;
        if (currentService[0].currentSpend == 0)
          targetSavingsPercent = 0;
        else
          targetSavingsPercent = (totalSavings / currentService[0].currentSpend) * 100;
        // }
        var row;
        calculatedData = Object.assign({}, filteredData[0]);
        calculatedData.targetSpend = totalTargetSpend;
        calculatedData.savingsAmount = totalSavings;
        calculatedData.targetSavingsPercent = targetSavingsPercent;
        if (toWeight != '') {
          if (distinctServices[index] == "SmartPost Less Than 1lb" || distinctServices[index] == "Surepost Less Than 1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || distinctServices[index] == "UPS Ground Saver - Less than 1 lb" || distinctServices[index] == "Ground Saver - Less than 1 lb" || distinctServices[index] == "UPS Ground Saver Less Than 1lb" || distinctServices[index] == "Ground Saver Less Than 1lb")
            row = await this.currentSavingsGroundList.findIndex((x: any) => x.service == calculatedData.service);
          else
            row = await this.currentSavingsGroundList.findIndex((x: any) => x.service == calculatedData.service && x.weightRange == (fromWeight + "-" + toWeight));
        }
        else {
          row = await this.currentSavingsGroundList.findIndex((x: any) => x.service == calculatedData.service && x.weightRange == (fromWeight + "+"));
        }
        if (toWeight != '') {
          if (distinctServices[index] == "SmartPost Less Than 1lb" || distinctServices[index] == "Surepost Less Than 1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || distinctServices[index] == "UPS Ground Saver - Less than 1 lb" || distinctServices[index] == "Ground Saver - Less than 1 lb" || distinctServices[index] == "UPS Ground Saver Less Than 1lb" || distinctServices[index] == "Ground Saver Less Than 1lb") {
            calculatedData.weightRange = "0-0.99";
          }
          else {
            calculatedData.weightRange = fromWeight + '-' + toWeight;
          }
        }
        else {
          calculatedData.weightRange = fromWeight + '+';
        }
        this.targetSavingsGroundList[row] = await calculatedData;
      }
    }
    else if (filteredData[0] == undefined && currentService != '') {
      var row;
      if (toWeight != '') {
        if (distinctServices[index] == "SmartPost Less Than 1lb" || distinctServices[index] == "Surepost Less Than 1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "upsgroundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundsaver" || distinctServices[index].toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb" || distinctServices[index] == "UPS Ground Saver - Less than 1 lb" || distinctServices[index] == "Ground Saver - Less than 1 lb" || distinctServices[index] == "UPS Ground Saver Less Than 1lb" || distinctServices[index] == "Ground Saver Less Than 1lb")
          row = await this.currentSavingsGroundList.findIndex((x: any) =>
            x.service == distinctServices[index]);
        else
          row = await this.currentSavingsGroundList.findIndex((x: any) =>
            x.service == distinctServices[index] && x.weightRange == (fromWeight + "-" + toWeight));
      }
      else {
        row = await this.currentSavingsGroundList.findIndex((x: any) => x.service == distinctServices[index] && x.weightRange == (fromWeight + "+"));
      }

      calculatedData = {
        clientId: (this.selectedCarrier.carrierName.toLowerCase() == 'ups') ? this.cookiesService.getCookieItem("clientId") : this.fedexClientId,
        clientName: null,
        count: 0,
        currentPercent: null,
        currentSpend: null,
        newBaseRate: "0.00",
        newMinRatesheet: "0.00",
        newService: this.distinctGroundNewService[index],
        oldBaseRate: 0.00,
        oldDiscountRate: 0.00,
        oldMinRatesheet: 0.00,
        savingsAmount: this.currentSavingsGroundList[row].currentSpend,
        service: distinctServices[index],
        serviceGrouping: "Ground",
        targetId: '',
        targetPercent: "0.00",
        targetSavingsPercent: 0.00,
        targetSpend: 0.00,
        weightRange: (toWeight != '') ? (fromWeight + '-' + toWeight) : (fromWeight + '+'),
      };

      calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsGroundList[row].currentSpend.toFixed(2))) * 100);
      this.targetSavingsGroundList[row] = await calculatedData;
    }

  }

  async resetCurrentList() {

    this.accCheckList = [];
    this.currentAccCheckList = [];

    // this.allIdList = [];
    // this.availableIdList = [];

    this.currentSavingsAccList = [];
    this.currentSavingsAccListOld = [];
    this.accMinMaxList = [];
    this.accMinMaxListOld = [];

    this.accSortIcons =
    {
      service: "",
      serviceType: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.currentSavingsAirList = [];
    this.currentSavingsGroundList = [];
    this.currentSavingsIntlList = [];
    this.currentSavingsHWTList = [];
    this.airMinMaxList = [];
    this.groundMinMaxList = [];
    this.intlMinMaxList = [];
    this.hwtMinMaxList = [];
    this.airSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.groundSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.intlSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.hwtSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };

    if (this.currentDIMTable == "") {
      this.currentSavingsAirListOld = [];
      this.currentSavingsGroundListOld = [];
      this.currentSavingsIntlListOld = [];
      this.currentSavingsHWTListOld = [];

      this.airMinMaxListOld = [];
      this.groundMinMaxListOld = [];
      this.intlMinMaxListOld = [];
      this.hwtMinMaxListOld = [];
    }
  }
  async resetAllList() {
    await this.resetCurrentList();
    this.allIdList = [];
    this.availableIdList = [];
    this.freightCurrentDetails = [];
    this.accessorialCurrentDetails = [];
    this.loaded = false;
    this.targetIdList = [];
    for (let index = 0; index < this.scenariosDisplayed.length; index++) {
      this.scenariosDisplayed[index].targetAccCheckList = [];
      this.scenariosDisplayed[index].targetAccCheckListOld = [];
      this.scenariosDisplayed[index].loaded = false;
      this.scenariosDisplayed[index].targetTier = '';
      this.scenariosDisplayed[index].totalNetSpendOld = 0;
      this.scenariosDisplayed[index].totalFreightSpendOld = 0;
      this.scenariosDisplayed[index].totalAccSpendOld = 0;
      this.scenariosDisplayed[index].totalSavingsOld = 0;
      this.scenariosDisplayed[index].totalSavingsPercentOld = 0;
      this.scenariosDisplayed[index].totalFreightSavings = 0;
      this.scenariosDisplayed[index].totalFreightSavingsPercent = 0;
      this.scenariosDisplayed[index].totalAccSavings = 0;
      this.scenariosDisplayed[index].totalAccSavingsPercent = 0;
      this.scenariosDisplayed[index].targetAirListOld = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceTargetAirTotal = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceTargetGroundTotal = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceTargetIntlTotal = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceTargetHWTTotal = new MatTableDataSource();
      this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource();
      this.scenariosDisplayed[index].accMinMaxList = [];
      this.scenariosDisplayed[index].airMinMaxList = [];
      this.scenariosDisplayed[index].groundMinMaxList = [];
      this.scenariosDisplayed[index].intlMinMaxList = [];
      this.scenariosDisplayed[index].hwtMinMaxList = [];
      this.scenariosDisplayed[index].accMinMaxListOld = [];
      this.scenariosDisplayed[index].airMinMaxListOld = [];
      this.scenariosDisplayed[index].groundMinMaxListOld = [];
      this.scenariosDisplayed[index].intlMinMaxListOld = [];
      this.scenariosDisplayed[index].hwtMinMaxListOld = [];
      this.scenariosDisplayed[index].airSortIcons = { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" };
      this.scenariosDisplayed[index].groundSortIcons = { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" };
      this.scenariosDisplayed[index].intlSortIcons = { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" };
      this.scenariosDisplayed[index].accSortIcons = { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" };
      this.scenariosDisplayed[index].hwtSortIcons = { targetPercent: "", targetSpend: "", savingsAmount: "", targetSavingsPercent: "" };
    }
    this.targetSavingsAirList = [];
    this.targetSavingsGroundList = [];
    this.targetSavingsIntlList = [];
    this.targetSavingsAccList = [];
    this.targetSavingsHWTList = [];
    this.targetSavingsAirTotalList = [];
    this.targetSavingsGroundTotalList = [];
    this.targetSavingsIntlTotalList = [];
    this.targetSavingsAccTotalList = [];
    this.targetSavingsHWTTotalList = [];
    this.currentSavingsAccTotalList = [];
    this.dataSourceDimFactor = new MatTableDataSource();
    this.dataSourceMinReduction = new MatTableDataSource();
    this.spans = [];
    this.totalCurrentSpend = 0;
    this.totalFreightSpend = 0;
    this.totalAccSpend = 0;
    this.totalScenarios = [];
    this.scenariosDisplayed = [];
    this.selectedScenarios = [];
    this.selectedCategory.set('ALL');
    this.filterApplied = false;
  }


  async onCountChange(event: any, service: any, rowNumber: any) {

    let count = event.target.value;
    if (Number(count).toString() != 'NaN') {
      var totalCount = 0;
      var currentList: any = '';
      var currentTotalList = '';
      var dataSourceList = '';
      if (service == 'air') {
        currentList = 'currentSavingsAirList';
        currentTotalList = 'currentSavingsAirTotalList';
        dataSourceList = 'dataSourceCurrentAirTotal';
      }
      else if (service == 'ground') {
        currentList = 'currentSavingsGroundList';
        currentTotalList = 'currentSavingsGroundTotalList';
        dataSourceList = 'dataSourceCurrentGroundTotal';
      }
      else if (service == 'intl') {
        currentList = 'currentSavingsIntlList';
        currentTotalList = 'currentSavingsIntlTotalList';
        dataSourceList = 'dataSourceCurrentIntlTotal';
      }
      else if (service == 'hwt') {
        currentList = 'currentSavingsHWTList';
        currentTotalList = 'currentSavingsHWTTotalList';
        dataSourceList = 'dataSourceCurrentHWTTotal';
      }
      else {
        currentList = 'currentSavingsAccList';
        currentTotalList = 'currentSavingsAccTotalList';
        dataSourceList = 'dataSourceCurrentAccTotal';
      }

      (this as any)[currentList][rowNumber].newCount = count;

      await (this as any)[currentList].forEach((data: any) => {
        if (data.isNewRow == undefined)
          totalCount += Number(data.count);
        else
          totalCount += Number(data.newCount);
      });

      (this as any)[currentList][rowNumber].count = count;
      (this as any)[currentTotalList][0].count = totalCount;
      (this as any)[dataSourceList] = new MatTableDataSource((this as any)[currentTotalList]);

    }
  }

  async setDimAndMinColumns() {
    this.columnsDimFactor.set([
      { field: 'Criteria', fieldVal: 'criteria' },
      { field: this.carrierName + ' DIM Factor', fieldVal: 'baselineDimFactor' },
    ]);

    this.columnsMinReduction.set([
      { field: 'Service', fieldVal: 'service' },
      { field: this.selectedCarrier.year + ' ' + this.carrierName + ' Minimum Reduction ', fieldVal: 'currentMin' },
    ])

    // 'serviceGrouping', 'cubicInchFrom', 'cubicInchTo',
    this.displayedColumnsDIM = ['criteria', 'baselineDimFactor'];
    this.displayedColumnsMin = ['service', 'currentMin'];
  }

  async setColumnNames() {
    this.columnsDimFactor.set([]);
    this.displayedColumnsDIM = [];
    this.columnsMinReduction.set([]);;
    this.displayedColumnsMin = [];
    this.setDimAndMinColumns();
    var newTargetIdList: any = [];
    this.scenariosDisplayed.forEach((data: any) => newTargetIdList.push(data.targetId));
    if (this.targetIdList.toString() == newTargetIdList.toString()) {
      this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[0].carrierName + ' DIM Factor', fieldVal: 'targetDimDivisor' });
      this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'targetDimDivisor';
      this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[0].year + ' ' + this.scenariosDisplayed[0].carrierName + ' Minimum Reduction', fieldVal: 'targetMin1', columnNumber: 0 });
      this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin1';
      if (this.scenariosDisplayed.length > 1) {
        this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[1].carrierName + ' DIM Factor', fieldVal: 'proposalDimDivisor' });
        this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'proposalDimDivisor';
        this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[1].year + ' ' + this.scenariosDisplayed[1].targetName + ' Minimum Reduction', fieldVal: 'targetMin2', columnNumber: 1 });
        this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin2';
      }
    }
    else {
      this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[0].carrierName + ' DIM Factor', fieldVal: 'proposalDimDivisor' });
      this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'proposalDimDivisor';
      this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[0].year + ' ' + this.scenariosDisplayed[0].targetName + ' Minimum Reduction', fieldVal: 'targetMin2', columnNumber: 0 });
      this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin2';
      if (this.scenariosDisplayed.length > 1) {
        this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[1].carrierName + ' DIM Factor', fieldVal: 'targetDimDivisor' });
        this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'targetDimDivisor';
        this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[0].year + ' ' + this.scenariosDisplayed[1].targetName + ' Minimum Reduction', fieldVal: 'targetMin1', columnNumber: 1 });
        this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin1';
      }
    }
  }
  async setColumn() {
    this.columns()[3].field = this.selectedCarrier.carrierName + " Discount";
    this.columnsAcc()[3].field = this.selectedCarrier.carrierName + " Discount";
    this.columns()[4].field = this.selectedCarrier.year + ' Calculated Spend';
    this.columnsAcc()[4].field = this.selectedCarrier.year + ' Calculated Spend';
  }
  async setOldList() {
    this.freightCurrentDetails = [];
    this.freightCurrentDetailsOld.forEach((data: any) => this.freightCurrentDetails.push(Object.assign({}, data)));
    for (let row = 0; row < this.airMinMaxList.length; row++) {
      if (row > this.airMinMaxListOld.length - 1)
        this.airMinMaxList[row] = { service: "", disMin: "", disMax: "" };
      else
        this.airMinMaxList[row] = Object.assign({}, this.airMinMaxListOld[row]);
    }
    for (let row = 0; row < this.groundMinMaxList.length; row++) {
      if (row > this.groundMinMaxListOld.length - 1)
        this.groundMinMaxList[row] = { service: "", disMin: "", disMax: "" };
      else
        this.groundMinMaxList[row] = Object.assign({}, this.groundMinMaxListOld[row]);
    }
    for (let row = 0; row < this.intlMinMaxList.length; row++) {
      if (row > this.intlMinMaxListOld.length - 1)
        this.intlMinMaxList[row] = { service: "", disMin: "", disMax: "" };
      else
        this.intlMinMaxList[row] = Object.assign({}, this.intlMinMaxListOld[row]);
    }

    for (let row = 0; row < this.hwtMinMaxList.length; row++) {
      if (row > this.hwtMinMaxListOld.length - 1)
        this.hwtMinMaxList[row] = { service: "", disMin: "", disMax: "" };
      else
        this.hwtMinMaxList[row] = Object.assign({}, this.hwtMinMaxListOld[row]);
    }
    for (let row = 0; row < this.accMinMaxList.length; row++) {
      if (this.accMinMaxList[row].additionalRow != undefined)
        this.accMinMaxList[row] = { service: "", disMin: "", disMax: "" };
      else if ((this.accMinMaxListOld[row] != undefined))
        this.accMinMaxList[row] = Object.assign({}, this.accMinMaxListOld[row]);
      else
        this.accMinMaxList.splice(row, 1)
    }

    for (let row = 0; row < this.currentSavingsAirList.length; row++) {
      if (row > this.currentSavingsAirListOld.length - 1)
        this.currentSavingsAirList[row] = {
          service: '',
          serviceGrouping: 'air',
          weightRange: '',
          count: '',
          newCount: 0,
          currentPercent: '',
          currentSpend: '',
          isNewRow: true
        };
      else
        this.currentSavingsAirList[row] = Object.assign({}, this.currentSavingsAirListOld[row]);
    }

    for (let row = 0; row < this.currentSavingsGroundList.length; row++) {
      if (row > this.currentSavingsGroundListOld.length - 1)
        this.currentSavingsGroundList[row] = {
          service: '',
          serviceGrouping: 'ground',
          weightRange: '',
          count: '',
          newCount: 0,
          currentPercent: '',
          currentSpend: '',
          isNewRow: true
        };
      else
        this.currentSavingsGroundList[row] = Object.assign({}, this.currentSavingsGroundListOld[row]);
    }

    for (let row = 0; row < this.currentSavingsIntlList.length; row++) {
      if (row > this.currentSavingsIntlListOld.length - 1)
        this.currentSavingsIntlList[row] = {
          service: '',
          serviceGrouping: 'intl',
          weightRange: '',
          count: '',
          newCount: 0,
          currentPercent: '',
          currentSpend: '',
          isNewRow: true
        };
      else
        this.currentSavingsIntlList[row] = Object.assign({}, this.currentSavingsIntlListOld[row]);
    }

    for (let row = 0; row < this.currentSavingsHWTList.length; row++) {
      if (row > this.currentSavingsHWTListOld.length - 1)
        this.currentSavingsHWTList[row] = {
          service: '',
          serviceGrouping: 'hwt',
          weightRange: '',
          count: '',
          newCount: 0,
          currentPercent: '',
          currentSpend: '',
          isNewRow: true
        };
      else
        this.currentSavingsHWTList[row] = Object.assign({}, this.currentSavingsHWTListOld[row]);
    }
    for (let row = 0; row < this.currentSavingsAccList.length; row++) {
      if (this.currentSavingsAccList[row].additionalRow != undefined)
        this.currentSavingsAccList[row] = {
          service: '',
          weightRange: '',
          count: '',
          newCount: 0,
          currentPercent: '',
          currentSpend: '',
          serviceType: '',
          isNewRow: true,
        };
      else if (this.currentSavingsAccListOld[row] != undefined)
        this.currentSavingsAccList[row] = Object.assign({}, this.currentSavingsAccListOld[row]);
      else
        this.currentSavingsAccList.splice(row, 1);
    }
    this.currentSavingsAirTotalList = [];
    this.currentSavingsGroundTotalList = [];
    this.currentSavingsIntlTotalList = [];
    this.currentSavingsHWTTotalList = [];
    this.currentSavingsAccTotalList = [];
    this.currentSavingsAirTotalListOld.forEach((data: any) => this.currentSavingsAirTotalList.push(Object.assign({}, data)));
    this.currentSavingsGroundTotalListOld.forEach((data: any) => this.currentSavingsGroundTotalList.push(Object.assign({}, data)));
    this.currentSavingsIntlTotalListOld.forEach((data: any) => this.currentSavingsIntlTotalList.push(Object.assign({}, data)));
    this.currentSavingsHWTTotalListOld.forEach((data: any) => this.currentSavingsHWTTotalList.push(Object.assign({}, data)));
    this.currentSavingsAccTotalListOld.forEach((data: any) => this.currentSavingsAccTotalList.push(Object.assign({}, data)));
    this.currentSavingsGroundSubTotalList = [];
    this.currentSavingsGroundSubTotalListOld.forEach((data: any) => this.currentSavingsGroundSubTotalList.push(Object.assign({}, data)));
  }

  async refreshClickHandler(type: any) {
    this.toggleClicked = false;
    this.isAccServiceAvailable = false;
    this.openLoading();
    var indexArray: any = [];
    if (type != 'current') {
      indexArray = type.toString().split(',');
    }
    if (this.accCheckList.length > 0) {
      type = 'current';
    }
    if (type == 'current' || indexArray.length == this.targetIdList.length) {
      await this.setOldList();
      this.currentAccCheckList = [...this.currentSavingsAccListOld];
      this.currentTier = '';
      var tier = await this.setHWTMinMax('current');
      this.currentTier = tier;
      if (!this.hwtTier.includes(tier)) this.hwtTier.unshift(tier);
      this.spans = [];
      this.getInitRowSpan();
      this.airSortIcons =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      this.groundSortIcons =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      this.intlSortIcons =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      this.hwtSortIcons =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      this.accSortIcons =
      {
        service: "",
        serviceType: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
      this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
      this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
      this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);
      this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);
      this.dataSourceCurrentAirTotal = new MatTableDataSource(this.currentSavingsAirTotalList);
      this.dataSourceCurrentGroundTotal = new MatTableDataSource(this.currentSavingsGroundTotalList);
      this.dataSourceCurrentIntlTotal = new MatTableDataSource(this.currentSavingsIntlTotalList);
      this.dataSourceCurrentHWTTotal = new MatTableDataSource(this.currentSavingsHWTTotalList);
      this.dataSourceCurrentAccTotal = new MatTableDataSource(this.currentSavingsAccTotalList);

      this.totalCurrentSpend = this.totalCurrentSpendOld;
      this.totalFreightSpend = this.totalFreightSpendOld;
      this.totalAccSpend = this.totalAccSpendOld;

      this.netAmountMinMaxListOld.forEach((data: any, index: any) => {
        this.netAmountMinMaxList[index].currentMin = data.currentMin;
        this.netAmountMinMaxList[index].currentMax = data.currentMax;
      });

      this.distinctMinReductionListOld.forEach((data: any, index: any) => {
        this.distinctMinReductionList[index].currentMin = data.currentMin;
      });


      //For calculating target savings and savings percentage after current spend is changed by refresh
      if (this.accCheckList.length == 0) {
        for (let index in this.scenariosDisplayed) {

          var currentAccList: any = [];
          var targetAccList = [];
          var services = ['air', 'ground', 'hwt', 'intl'];

          for (let row = 0; row < services.length; row++) {

            var currentList: any = [];
            var targetList = [];
            var currentTotalList = '';
            var targetTotalList = ''
            var targetName = '';
            var currentTotalListName = '';
            var targetTotalListName = '';
            var totalServiceName = "";
            var service: any = services[row];

            if (service == 'air') {
              this.currentSavingsAirList.forEach((data: any) => currentList.push(Object.assign({}, data)));
              currentTotalList = 'currentSavingsAirTotalList';
              targetTotalList = 'targetSavingsAirTotalList'
              targetName = "dataSourceAirTarget";
              currentTotalListName = 'dataSourceCurrentAirTotal';
              targetTotalListName = 'dataSourceTargetAirTotal';
              totalServiceName = "Express Pricing :";
            }
            else if (service == 'ground') {
              this.currentSavingsGroundList.forEach((data: any) => currentList.push(Object.assign({}, data)));
              currentTotalList = 'currentSavingsGroundTotalList';
              targetTotalList = 'targetSavingsGroundTotalList'
              targetName = "dataSourceGroundTarget";
              currentTotalListName = 'dataSourceCurrentGroundTotal'
              targetTotalListName = 'dataSourceTargetGroundTotal';
              totalServiceName = "Ground Pricing :";
            }
            else if (service == 'hwt') {
              this.currentSavingsHWTList.forEach((data: any) => currentList.push(Object.assign({}, data)));
              currentTotalList = 'currentSavingsHWTTotalList';
              targetTotalList = 'targetSavingsHWTTotalList'
              targetName = "dataSourceHWTTarget";
              currentTotalListName = 'dataSourceCurrentHWTTotal';
              targetTotalListName = 'dataSourceTargetHWTTotal';
              totalServiceName = "Hundredweight Pricing :";
            }
            else {
              this.currentSavingsIntlList.forEach((data: any) => currentList.push(Object.assign({}, data)));
              currentTotalList = 'currentSavingsIntlTotalList';
              targetTotalList = 'targetSavingsIntlTotalList'
              targetName = "dataSourceIntlTarget";
              currentTotalListName = 'dataSourceCurrentIntlTotal'
              targetTotalListName = 'dataSourceTargetIntlTotal';
              totalServiceName = "International Pricing :";
            }

            targetList = this.scenariosDisplayed[index][targetName].data;

            for (let rowNumber = 0; rowNumber < targetList.length; rowNumber++) {
              targetList = await this.calculateSavingsAndPercent(targetList, currentList, rowNumber);

              this.scenariosDisplayed[index][targetName] = new MatTableDataSource(targetList);

              if (service == 'ground') {
                await this.calculateSubTotalTarget(targetList, targetList[rowNumber].service, targetList[rowNumber].weightRange, index);
              }
            }
            var calculatedTargetService: any = await this.calculateTargetSpend(targetList);
            (this as any)[targetTotalList] = [];
            (this as any)[targetTotalList].push({
              weightRange: '',
              count: '',
              targetPercent: '',
              targetSpend: calculatedTargetService['totalTargetSpend'],
              targetSavingsPercent: (Math.abs((this as any)[currentTotalList][0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / (this as any)[currentTotalList][0].currentSpend) * 100 : 0,
              savingsAmount: calculatedTargetService['totalSavings']
            });
            this.scenariosDisplayed[index][targetTotalListName] = new MatTableDataSource((this as any)[targetTotalList]);
          }
          this.currentSavingsAccList.forEach((data: any) => currentAccList.push(Object.assign({}, data)));
          targetAccList = this.scenariosDisplayed[index].dataSourceAccTarget.data;
          for (let rowNumber = 0; rowNumber < targetAccList.length; rowNumber++) {
            targetAccList = await this.calculateSavingsAndPercent(targetAccList, currentAccList, rowNumber);
          }
          this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(targetAccList);
          var calculatedTargetService: any = await this.calculateTargetSpend(targetAccList);
          this.targetSavingsAccTotalList = [];
          this.targetSavingsAccTotalList.push({
            weightRange: '',
            count: '',
            targetPercent: '',
            targetSpend: calculatedTargetService['totalTargetSpend'],
            targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
            savingsAmount: calculatedTargetService['totalSavings']
          });
          this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);
          await this.calculateOverallTotal('target', Number(index));
        }
      }
    }
    var targetIdListnew: any = [];
    this.scenariosDisplayed.forEach((data: any) => targetIdListnew.push(data.targetId));
    if (this.accCheckList.length > 0) {
      type = targetIdListnew.toString();
    }
    if (type != 'current') {
      indexArray = type.toString().split(',');
    }
    if (type != 'current') {
      for (let rowIndex = 0; rowIndex < indexArray.length; rowIndex++) {
        var index = this.scenariosDisplayed.findIndex((data: any) => data.targetId.toString() == indexArray[rowIndex]);
        if (this.scenariosDisplayed[index] != undefined) {
          this.scenariosDisplayed[index].targetAccCheckList = [...this.scenariosDisplayed[index].targetAccCheckListOld];
          this.scenariosDisplayed[index].freightTargetDetails = [];
          this.scenariosDisplayed[index].freightTargetDetailsOld.forEach((data: any) => this.scenariosDisplayed[index].freightTargetDetails.push(Object.assign({}, data)));
          this.scenariosDisplayed[index].totalNetSpend = this.scenariosDisplayed[index].totalNetSpendOld;
          this.scenariosDisplayed[index].totalFreightSpend = this.scenariosDisplayed[index].totalFreightSpendOld;
          this.scenariosDisplayed[index].totalAccSpend = this.scenariosDisplayed[index].totalAccSpendOld;
          this.scenariosDisplayed[index].totalSavings = this.scenariosDisplayed[index].totalSavingsOld;
          this.scenariosDisplayed[index].totalSavingsPercent = this.scenariosDisplayed[index].totalSavingsPercentOld;
          this.scenariosDisplayed[index].totalFreightSavings = this.scenariosDisplayed[index].totalFreightSavingsOld;
          this.scenariosDisplayed[index].totalFreightSavingsPercent = this.scenariosDisplayed[index].totalFreightSavingsPercentOld;
          this.scenariosDisplayed[index].totalAccSavings = this.scenariosDisplayed[index].totalAccSavingsOld;
          this.scenariosDisplayed[index].totalAccSavingsPercent = this.scenariosDisplayed[index].totalAccSavingsPercentOld;
          this.scenariosDisplayed[index].airSortIcons =
          {
            targetPercent: "",
            targetSpend: "",
            savingsAmount: "",
            targetSavingsPercent: "",
          };

          this.scenariosDisplayed[index].groundSortIcons =
          {
            targetPercent: "",
            targetSpend: "",
            savingsAmount: "",
            targetSavingsPercent: "",
          };

          this.scenariosDisplayed[index].intlSortIcons =
          {
            targetPercent: "",
            targetSpend: "",
            savingsAmount: "",
            targetSavingsPercent: "",
          };

          this.scenariosDisplayed[index].hwtSortIcons =
          {
            targetPercent: "",
            targetSpend: "",
            savingsAmount: "",
            targetSavingsPercent: "",
          };

          this.scenariosDisplayed[index].accSortIcons =
          {
            targetPercent: "",
            targetSpend: "",
            savingsAmount: "",
            targetSavingsPercent: "",
          };

          // let newLength;
          // let currentLength;

          for (let row = 0; row < this.scenariosDisplayed[index].airMinMaxList.length; row++) {
            if (row > this.scenariosDisplayed[index].airMinMaxListOld.length - 1)
              this.scenariosDisplayed[index].airMinMaxList[row] = { service: "", disMin: "", disMax: "" };
            else
              this.scenariosDisplayed[index].airMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].airMinMaxListOld[row]);
          }

          for (let row = 0; row < this.scenariosDisplayed[index].groundMinMaxList.length; row++) {
            if (row > this.scenariosDisplayed[index].groundMinMaxListOld.length - 1)
              this.scenariosDisplayed[index].groundMinMaxList[row] = { service: "", disMin: "", disMax: "" };
            else
              this.scenariosDisplayed[index].groundMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].groundMinMaxListOld[row]);
          }

          for (let row = 0; row < this.scenariosDisplayed[index].intlMinMaxList.length; row++) {
            if (row > this.scenariosDisplayed[index].intlMinMaxListOld.length - 1)
              this.scenariosDisplayed[index].intlMinMaxList[row] = { service: "", disMin: "", disMax: "" };
            else
              this.scenariosDisplayed[index].intlMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].intlMinMaxListOld[row]);
          }

          for (let row = 0; row < this.scenariosDisplayed[index].hwtMinMaxList.length; row++) {
            if (row > this.scenariosDisplayed[index].hwtMinMaxListOld.length - 1)
              this.scenariosDisplayed[index].hwtMinMaxList[row] = { service: "", disMin: "", disMax: "" };
            else
              this.scenariosDisplayed[index].hwtMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].hwtMinMaxListOld[row]);
          }

          // newLength = this.accMinMaxList.length;

          // this.scenariosDisplayed[index].accMinMaxList = [];
          // this.scenariosDisplayed[index].accMinMaxListOld.forEach((data:any) => this.scenariosDisplayed[index].accMinMaxList.push(Object.assign({}, data)));

          // currentLength = this.accMinMaxList.length;

          // for (let row = currentLength; row < newLength; row++) {
          //   this.scenariosDisplayed[index].accMinMaxList[row] = { service: "", disMin: "", disMax: "" };
          // }

          for (let row = 0; row < this.scenariosDisplayed[index].accMinMaxList.length; row++) {
            if (this.scenariosDisplayed[index].accMinMaxList[row].additionalRow != undefined)
              this.scenariosDisplayed[index].accMinMaxList[row] = { service: "", disMin: "", disMax: "" };
            else if (this.scenariosDisplayed[index].accMinMaxListOld[row] != undefined)
              this.scenariosDisplayed[index].accMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].accMinMaxListOld[row]);
            else
              this.scenariosDisplayed[index].accMinMaxList.splice(row, 1)
          }

          this.scenariosDisplayed[index].displayedColumnsTarget = ['targetPercent', 'targetSpend', 'savingsAmount', 'targetSavingsPercent'];

          this.targetSavingsAirList = this.scenariosDisplayed[index].dataSourceAirTarget.data;;
          for (let row = 0; row < this.targetSavingsAirList.length; row++) {
            if (row > this.scenariosDisplayed[index].targetAirListOld.length - 1)
              this.targetSavingsAirList[row] = {
                service: '',
                weightRange: '', count: '',
                serviceGrouping: 'air', targetPercent: '',
                targetSpend: '', targetSavingsPercent: '',
                savingsAmount: '', isNewRow: true
              };
            else
              this.targetSavingsAirList[row] = Object.assign({}, this.scenariosDisplayed[index].targetAirListOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);

          this.targetSavingsGroundList = this.scenariosDisplayed[index].dataSourceGroundTarget.data;;
          for (let row = 0; row < this.targetSavingsGroundList.length; row++) {
            if (row > this.scenariosDisplayed[index].targetGroundListOld.length - 1)
              this.targetSavingsGroundList[row] = {
                service: '',
                weightRange: '', count: '',
                serviceGrouping: 'ground', targetPercent: '',
                targetSpend: '', targetSavingsPercent: '',
                savingsAmount: '', isNewRow: true
              };
            else
              this.targetSavingsGroundList[row] = Object.assign({}, this.scenariosDisplayed[index].targetGroundListOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);

          this.targetSavingsIntlList = this.scenariosDisplayed[index].dataSourceIntlTarget.data;;
          for (let row = 0; row < this.targetSavingsIntlList.length; row++) {
            if (row > this.scenariosDisplayed[index].targetIntlListOld.length - 1)
              this.targetSavingsIntlList[row] = {
                service: '',
                weightRange: '', count: '',
                serviceGrouping: 'intl', targetPercent: '',
                targetSpend: '', targetSavingsPercent: '',
                savingsAmount: '', isNewRow: true
              };
            else
              this.targetSavingsIntlList[row] = Object.assign({}, this.scenariosDisplayed[index].targetIntlListOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);

          this.targetSavingsHWTList = this.scenariosDisplayed[index].dataSourceHWTTarget.data;
          for (let row = 0; row < this.targetSavingsHWTList.length; row++) {
            if (row > this.scenariosDisplayed[index].targetHWTListOld.length - 1)
              this.targetSavingsHWTList[row] = {
                service: '',
                weightRange: '', count: '',
                serviceGrouping: 'hwt', targetPercent: '',
                targetSpend: '', targetSavingsPercent: '',
                savingsAmount: '', isNewRow: true
              };
            else
              this.targetSavingsHWTList[row] = Object.assign({}, this.scenariosDisplayed[index].targetHWTListOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);

          this.targetSavingsAccList = this.scenariosDisplayed[index].dataSourceAccTarget.data; for (let row = 0; row < this.targetSavingsAccList.length; row++) {
            if (this.targetSavingsAccList[row].additionalRow != undefined)
              this.targetSavingsAccList[row] = {
                weightRange: '', service: '', count: '', targetPercent: '',
                targetSpend: '', targetSavingsPercent: '', savingsAmount: '', serviceType: '', isNewRow: true,
              };
            else if (this.scenariosDisplayed[index].targetAccListOld[row] != undefined)
              this.targetSavingsAccList[row] = Object.assign({}, this.scenariosDisplayed[index].targetAccListOld[row]);
            else
              this.targetSavingsAccList.splice(row, 1);
          }
          this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);

          this.scenariosDisplayed[index].targetTier = '';
          var tier = await this.setHWTMinMax('target');
          this.scenariosDisplayed[index].targetTier = tier;
          if (!this.scenariosDisplayed[index].hwtTier.includes(tier)) this.scenariosDisplayed[index].hwtTier.unshift(tier);
          this.targetSavingsAirTotalList = [];
          for (let row = 0; row < this.scenariosDisplayed[index].targetAirListTotalOld.length; row++) {
            this.targetSavingsAirTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetAirListTotalOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceTargetAirTotal = new MatTableDataSource(this.targetSavingsAirTotalList);

          this.targetSavingsGroundTotalList = [];
          for (let row = 0; row < this.scenariosDisplayed[index].targetGroundListTotalOld.length; row++) {
            this.targetSavingsGroundTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetGroundListTotalOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceTargetGroundTotal = new MatTableDataSource(this.targetSavingsGroundTotalList);


          this.targetSavingsIntlTotalList = [];
          for (let row = 0; row < this.scenariosDisplayed[index].targetIntlListTotalOld.length; row++) {
            this.targetSavingsIntlTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetIntlListTotalOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceTargetIntlTotal = new MatTableDataSource(this.targetSavingsIntlTotalList);

          this.targetSavingsHWTTotalList = [];
          for (let row = 0; row < this.scenariosDisplayed[index].targetHWTListTotalOld.length; row++) {
            this.targetSavingsHWTTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetHWTListTotalOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);

          this.targetSavingsAccTotalList = [];
          for (let row = 0; row < this.scenariosDisplayed[index].targetAccListTotalOld.length; row++) {
            this.targetSavingsAccTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetAccListTotalOld[row]);
          }
          this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);

          this.scenariosDisplayed[index].targetSavingsGroundSubTotalList = [];
          this.scenariosDisplayed[index].targetSavingsGroundSubTotalListOld.forEach((data: any) => this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.push(Object.assign({}, data)));

          if (this.targetIdList.toString() == targetIdListnew.toString()) {
            if ((index == 0)) {
              this.netAmountMinMaxListOld.forEach((data: any, row: any) => {
                this.netAmountMinMaxList[row].target1Min = data.target1Min;
                this.netAmountMinMaxList[row].target1Max = data.target1Max;
              });
              this.dimFactorListOld.forEach((data: any, row: any) => {
                this.dimFactorList[row].targetDimDivisor = data.targetDimDivisor;
              });
              this.distinctMinReductionListOld.forEach((data: any, row: any) => {
                this.distinctMinReductionList[row].targetMin1 = data.targetMin1;
              });
            }
            else if (index == 1) {
              this.netAmountMinMaxListOld.forEach((data: any, row: any) => {
                this.netAmountMinMaxList[row].target2Min = data.target2Min;
                this.netAmountMinMaxList[row].target2Max = data.target2Max;
              });
              this.dimFactorListOld.forEach((data: any, row: any) => {
                this.dimFactorList[row].proposalDimDivisor = data.proposalDimDivisor;
              });
              this.distinctMinReductionListOld.forEach((data: any, row: any) => {
                this.distinctMinReductionList[row].targetMin2 = data.targetMin2;
              });
            }
          }
          else {
            if (index == 0) {
              this.netAmountMinMaxListOld.forEach((data: any, row: any) => {
                this.netAmountMinMaxList[row].target2Min = data.target2Min;
                this.netAmountMinMaxList[row].target2Max = data.target2Max;
              });
              this.dimFactorListOld.forEach((data: any, row: any) => {
                this.dimFactorList[row].proposalDimDivisor = data.proposalDimDivisor;
              });
              this.distinctMinReductionListOld.forEach((data: any, row: any) => {
                this.distinctMinReductionList[row].targetMin2 = data.targetMin2;
              });
            }
            else if (index == 1) {
              this.netAmountMinMaxListOld.forEach((data: any, row: any) => {
                this.netAmountMinMaxList[row].target1Min = data.target1Min;
                this.netAmountMinMaxList[row].target1Max = data.target1Max;
              });
              this.dimFactorListOld.forEach((data: any, row: any) => {
                this.dimFactorList[row].targetDimDivisor = data.targetDimDivisor;
              });
              this.distinctMinReductionListOld.forEach((data: any, row: any) => {
                this.distinctMinReductionList[row].targetMin1 = data.targetMin1;
              });
            }
          }
          this.dataSourceMinReduction = [];
          this.dataSourceMinReduction = new MatTableDataSource(this.netAmountMinMaxList);
          this.dataSourceDimFactor = [];
          this.dataSourceDimFactor = new MatTableDataSource(this.dimFactorList);
        }
      }
    }

    this.accCheckList = [...this.accCheckListOld];

    if (indexArray.length == this.targetIdList.length) {
      this.editable.set(false);
      if (this.targetIdList.toString() != targetIdListnew.toString()) {
        moveItemInArray(this.scenariosDisplayed, 1, 0);
      }
      setTimeout(async () => {
        await this.setColumnNames();
        this.dataSourceDimFactor = new MatTableDataSource(this.dimFactorList);
        this.dataSourceMinReduction = new MatTableDataSource(this.netAmountMinMaxList);
      }, 3000);
    }
    setTimeout(async () => {
      this.closeLoading();
    }, 1500);

  }

  async refreshClickHandler2() {

    this.toggleClicked = false
    this.isAccServiceAvailable = false;
    await this.setOldList();

    this.currentTier = '';

    var tier = await this.setHWTMinMax('current');
    this.currentTier = tier;
    if (!this.hwtTier.includes(tier)) this.hwtTier.unshift(tier);

    this.spans = [];
    this.getInitRowSpan();

    this.airSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.groundSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.intlSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.hwtSortIcons =
    {
      service: "",
      weightRange: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };
    this.accSortIcons =
    {
      service: "",
      serviceType: "",
      count: "",
      currentPercent: "",
      currentSpend: ""
    };

    this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
    this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
    this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
    this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);
    this.dataSourceAcc = new MatTableDataSource(this.currentSavingsAccList);

    this.dataSourceCurrentAirTotal = new MatTableDataSource(this.currentSavingsAirTotalList);
    this.dataSourceCurrentGroundTotal = new MatTableDataSource(this.currentSavingsGroundTotalList);
    this.dataSourceCurrentIntlTotal = new MatTableDataSource(this.currentSavingsIntlTotalList);
    this.dataSourceCurrentHWTTotal = new MatTableDataSource(this.currentSavingsHWTTotalList);
    this.dataSourceCurrentAccTotal = new MatTableDataSource(this.currentSavingsAccTotalList);

    this.totalCurrentSpend = this.totalCurrentSpendOld;
    this.totalFreightSpend = this.totalFreightSpendOld;
    this.totalAccSpend = this.totalAccSpendOld;

    for (let index = 0; index < this.scenariosDisplayed.length; index++) {


      this.scenariosDisplayed[index].freightTargetDetails = [];
      this.scenariosDisplayed[index].freightTargetDetailsOld.forEach((data: any) => this.scenariosDisplayed[index].freightTargetDetails.push(Object.assign({}, data)));

      this.scenariosDisplayed[index].totalNetSpend = this.scenariosDisplayed[index].totalNetSpendOld;
      this.scenariosDisplayed[index].totalFreightSpend = this.scenariosDisplayed[index].totalFreightSpendOld;
      this.scenariosDisplayed[index].totalAccSpend = this.scenariosDisplayed[index].totalAccSpendOld;

      this.scenariosDisplayed[index].totalSavings = this.scenariosDisplayed[index].totalSavingsOld;
      this.scenariosDisplayed[index].totalSavingsPercent = this.scenariosDisplayed[index].totalSavingsPercentOld;

      this.scenariosDisplayed[index].totalFreightSavings = this.scenariosDisplayed[index].totalFreightSavingsOld;
      this.scenariosDisplayed[index].totalFreightSavingsPercent = this.scenariosDisplayed[index].totalFreightSavingsPercentOld;

      this.scenariosDisplayed[index].totalAccSavings = this.scenariosDisplayed[index].totalAccSavingsOld;
      this.scenariosDisplayed[index].totalAccSavingsPercent = this.scenariosDisplayed[index].totalAccSavingsPercentOld;

      this.scenariosDisplayed[index].airSortIcons =
      {
        targetPercent: "",
        targetSpend: "",
        savingsAmount: "",
        targetSavingsPercent: "",
      };
      this.scenariosDisplayed[index].groundSortIcons =
      {
        targetPercent: "",
        targetSpend: "",
        savingsAmount: "",
        targetSavingsPercent: "",
      };
      this.scenariosDisplayed[index].intlSortIcons =
      {
        targetPercent: "",
        targetSpend: "",
        savingsAmount: "",
        targetSavingsPercent: "",
      };
      this.scenariosDisplayed[index].hwtSortIcons =
      {
        targetPercent: "",
        targetSpend: "",
        savingsAmount: "",
        targetSavingsPercent: "",
      };
      this.scenariosDisplayed[index].accSortIcons =
      {
        targetPercent: "",
        targetSpend: "",
        savingsAmount: "",
        targetSavingsPercent: "",
      };

      this.scenariosDisplayed[index].airMinMaxList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].airMinMaxListOld.length; row++) {
        this.scenariosDisplayed[index].airMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].airMinMaxListOld[row]);
      }

      this.scenariosDisplayed[index].groundMinMaxList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].groundMinMaxListOld.length; row++) {
        this.scenariosDisplayed[index].groundMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].groundMinMaxListOld[row]);
      }

      this.scenariosDisplayed[index].intlMinMaxList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].intlMinMaxListOld.length; row++) {
        this.scenariosDisplayed[index].intlMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].intlMinMaxListOld[row]);
      }

      this.scenariosDisplayed[index].hwtMinMaxList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].hwtMinMaxListOld.length; row++) {
        this.scenariosDisplayed[index].hwtMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].hwtMinMaxListOld[row]);
      }

      this.scenariosDisplayed[index].accMinMaxList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].accMinMaxListOld.length; row++) {
        this.scenariosDisplayed[index].accMinMaxList[row] = Object.assign({}, this.scenariosDisplayed[index].accMinMaxListOld[row]);
      }

      this.scenariosDisplayed[index].displayedColumnsTarget = ['targetPercent', 'targetSpend', 'savingsAmount', 'targetSavingsPercent'];

      this.targetSavingsAirList = [];
      this.scenariosDisplayed[index].targetAirListOld.forEach((data: any) => this.targetSavingsAirList.push(Object.assign({}, data)));
      this.scenariosDisplayed[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);

      this.targetSavingsGroundList = [];
      this.scenariosDisplayed[index].targetGroundListOld.forEach((data: any) => this.targetSavingsGroundList.push(Object.assign({}, data)));
      this.scenariosDisplayed[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);

      this.targetSavingsIntlList = [];
      this.scenariosDisplayed[index].targetIntlListOld.forEach((data: any) => this.targetSavingsIntlList.push(Object.assign({}, data)));
      this.scenariosDisplayed[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);

      this.targetSavingsHWTList = [];
      this.scenariosDisplayed[index].targetHWTListOld.forEach((data: any) => this.targetSavingsHWTList.push(Object.assign({}, data)));
      this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);

      this.targetSavingsAccList = [];
      this.scenariosDisplayed[index].targetAccListOld.forEach((data: any) => this.targetSavingsAccList.push(Object.assign({}, data)));
      this.scenariosDisplayed[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);

      this.scenariosDisplayed[index].targetTier = '';
      var tier = await this.setHWTMinMax('target');
      this.scenariosDisplayed[index].targetTier = tier;
      if (!this.scenariosDisplayed[index].hwtTier.includes(tier)) this.scenariosDisplayed[index].hwtTier.unshift(tier);
      this.targetSavingsAirTotalList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].targetAirListTotalOld.length; row++) {
        this.targetSavingsAirTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetAirListTotalOld[row]);
      }
      this.scenariosDisplayed[index].dataSourceTargetAirTotal = new MatTableDataSource(this.targetSavingsAirTotalList);

      this.targetSavingsGroundTotalList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].targetGroundListTotalOld.length; row++) {
        this.targetSavingsGroundTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetGroundListTotalOld[row]);
      }
      this.scenariosDisplayed[index].dataSourceTargetGroundTotal = new MatTableDataSource(this.targetSavingsGroundTotalList);

      this.targetSavingsIntlTotalList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].targetIntlListTotalOld.length; row++) {
        this.targetSavingsIntlTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetIntlListTotalOld[row]);
      }
      this.scenariosDisplayed[index].dataSourceTargetIntlTotal = new MatTableDataSource(this.targetSavingsIntlTotalList);

      this.targetSavingsHWTTotalList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].targetHWTListTotalOld.length; row++) {
        this.targetSavingsHWTTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetHWTListTotalOld[row]);
      }
      this.scenariosDisplayed[index].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);

      this.targetSavingsAccTotalList = [];
      for (let row = 0; row < this.scenariosDisplayed[index].targetAccListTotalOld.length; row++) {
        this.targetSavingsAccTotalList[row] = Object.assign({}, this.scenariosDisplayed[index].targetAccListTotalOld[row]);
      }
      this.scenariosDisplayed[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);

      this.scenariosDisplayed[index].targetSavingsGroundSubTotalList = [];
      this.scenariosDisplayed[index].targetSavingsGroundSubTotalListOld.forEach((data: any) => this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.push(Object.assign({}, data)));
    }
  }


  excelDownloadClickHandler(event: any, reportType: any) {

    var handelerPosition = this.gerClickhandlerPosition(window.innerHeight, event.y);
    const dialogPosition: DialogPosition = {
      top: handelerPosition + 'px',
      left: event.x - 250 + 'px'
    };

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'filter-modalbox-excel';
    }

    let excelDialog = this.dialog.open(ExcelExportGRI, {
      disableClose: true,
      width: "14% !important",
      height: "auto !important",
      position: dialogPosition,
      data: {
        service: this.selectedCarrier['carrierName'],
        targetList: this.selectedScenarios,
        category: this.selectedCategory(),
        fedexId: this.fedexClientId,
        allScenarios: this.totalScenarios,
        reportType: reportType,
      },
      panelClass: this.panelClass
    });

    excelDialog.afterClosed().subscribe((data: any) => {
      if (data != undefined) {
        if (reportType == 'Excel')
          this.excelDownload(data);
        else if (reportType == 'PDF')
          this.generatePdf(data);
      }
    });
  }

  async insertDataForExcel(carrier: string, index: number) {
    //FreightDetailsTarget 
    var clientDetail: any = {};
    if (carrier == 'fedex') {
      this.targetSavingsAirList = [];
      this.targetSavingsGroundList = [];
      this.targetSavingsIntlList = [];
      this.targetSavingsHWTList = [];
      this.totalScenarios[index].targetSavingsGroundSubTotalList = [];

      clientDetail['clientId'] = this.fedexClientId;
      clientDetail['targetId'] = this.totalScenarios[index].targetId;
      var unfilteredData: any = await this.fedexService.fetchGRIFreightDetailsTarget(clientDetail).toPromise();

      var data = unfilteredData.filter((data: any) => data.targetId == this.totalScenarios[index].targetId);

      this.totalScenarios[index].freightTargetDetails = data;
      data.forEach((serviceData: any) => this.totalScenarios[index].freightTargetDetailsOld.push(Object.assign({}, serviceData)));

      for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctAirServices, data, serviceIndex, 'Air', index);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {
        if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
          await this.filterGroundTargetData(1, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
          await this.filterGroundTargetData(1, 2000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else {
          await this.filterGroundTargetData(0, 5, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(6, 10, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(11, 20, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(21, 30, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(31, 50, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(51, 70, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(71, 150, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(151, '', this.distinctGroundServices, data, serviceIndex, index);
        }
        await this.calculateGroundSubTotalTargetExcel(this.targetSavingsGroundList, serviceIndex, index);
      }

      for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctIntlServices, data, serviceIndex, 'Intl', index);
      }

      for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctHWTServices, data, serviceIndex, 'HWT', index);
      }

      for (let dataNo = 0; dataNo < this.targetSavingsHWTList.length; dataNo++) {
        if (this.totalScenarios[index].targetTier == '')
          this.totalScenarios[index].targetTier = this.targetSavingsHWTList[dataNo].hwtTier;
        else
          break;
      }

      await this.calculateFreightTargetTotalExcel(index);
      await this.getInitRowSpan();

      this.totalScenarios[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
      this.totalScenarios[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
      this.totalScenarios[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);
      this.totalScenarios[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);

      await this.setMinMaxTargetExcel(index, "air");
      await this.setMinMaxTargetExcel(index, "ground");
      await this.setMinMaxTargetExcel(index, "intl");
      await this.setMinMaxTargetExcel(index, "hwt");
    }
    else {
      this.targetSavingsAirList = [];
      this.targetSavingsGroundList = [];
      this.targetSavingsIntlList = [];
      this.targetSavingsHWTList = [];
      this.totalScenarios[index].targetSavingsGroundSubTotalList = [];
      clientDetail['targetId'] = this.totalScenarios[index].targetId;
      clientDetail['clientId'] = this.cookiesService.getCookieItem("clientId");
      var unfilteredData: any = await this.httpclient.fetchGRIFreightDetailsTarget(clientDetail).toPromise();
      var data = unfilteredData.filter((data: any) => data.targetId == this.totalScenarios[index].targetId);
      this.totalScenarios[index].freightTargetDetails = data;
      data.forEach((serviceData: any) => this.totalScenarios[index].freightTargetDetailsOld.push(Object.assign({}, serviceData)));
      for (let serviceIndex = 0; serviceIndex < this.distinctAirServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctAirServices, data, serviceIndex, 'Air', index);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctGroundServices.length; serviceIndex++) {
        if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("greater")) {
          await this.filterGroundTargetData(1, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("less")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex] == "Ground (Freight Pricing)" || this.distinctGroundServices[serviceIndex] == "ARS Ground") {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("wt")) {
          await this.filterGroundTargetData(1, 2000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("intl")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else if (this.distinctGroundServices[serviceIndex].toLowerCase().includes("9-96")) {
          await this.filterGroundTargetData(0, 1000, this.distinctGroundServices, data, serviceIndex, index);
        }
        else {
          await this.filterGroundTargetData(0, 5, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(6, 10, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(11, 20, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(21, 30, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(31, 50, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(51, 70, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(71, 150, this.distinctGroundServices, data, serviceIndex, index);
          await this.filterGroundTargetData(151, '', this.distinctGroundServices, data, serviceIndex, index);
        }
        await this.calculateGroundSubTotalTargetExcel(this.targetSavingsGroundList, serviceIndex, index);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctIntlServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctIntlServices, data, serviceIndex, 'Intl', index);
      }
      for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctHWTServices, data, serviceIndex, 'HWT', index);
      }
      for (let dataNo = 0; dataNo < this.targetSavingsHWTList.length; dataNo++) {
        if (this.totalScenarios[index].targetTier == '')
          this.totalScenarios[index].targetTier = this.targetSavingsHWTList[dataNo].hwtTier;
        else
          break;
      }
      await this.calculateFreightTargetTotalExcel(index);
      await this.getInitRowSpan();
      this.totalScenarios[index].dataSourceAirTarget = new MatTableDataSource(this.targetSavingsAirList);
      this.totalScenarios[index].dataSourceGroundTarget = new MatTableDataSource(this.targetSavingsGroundList);
      this.totalScenarios[index].dataSourceIntlTarget = new MatTableDataSource(this.targetSavingsIntlList);
      this.totalScenarios[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);
      await this.setMinMaxTargetExcel(index, "air");
      await this.setMinMaxTargetExcel(index, "ground");
      await this.setMinMaxTargetExcel(index, "intl");
      await this.setMinMaxTargetExcel(index, "hwt");
    }

    if (carrier == 'fedex') {
      this.targetSavingsAccList = [];
      this.targetSavingsAccTotalList = [];
      var unfilteredData: any = await this.fedexService.fetchGRIAccessorialDetailsTarget(clientDetail).toPromise();
      var data = unfilteredData.filter((data: any) => data.targetId == this.totalScenarios[index].targetId);
      this.totalScenarios[index].accessorialTargetDetails = data;
      let distinctAccServices = await this.getUniqueService(this.currentSavingsAccList, 'service');
      for (let serviceIndex = 0; serviceIndex < distinctAccServices.length; serviceIndex++) {
        var filteredData: any;
        filteredData = data.filter((obj: any) => obj.service == distinctAccServices[serviceIndex]);
        let totalTargetSpend = 0;
        let totalSavings = 0;
        let targetSavingsPercent = 0;
        for (let key in filteredData) {
          totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
        }
        totalTargetSpend = Number(totalTargetSpend);
        if (filteredData[0] != undefined) {
          let currentService = await this.currentSavingsAccList.filter((data: any) => data.service == filteredData[0].service);
          if (currentService[0] != null && currentService[0] != undefined) {
            totalSavings = totalTargetSpend - currentService[0].currentSpend;
            totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;
            targetSavingsPercent = (currentService[0].currentSpend == 0) ? 0.00 : (totalSavings / currentService[0].currentSpend) * 100;
            var calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.targetSpend = totalTargetSpend;
            calculatedData.savingsAmount = totalSavings;
            calculatedData.targetSavingsPercent = targetSavingsPercent;
            calculatedData.targetPercentType = '%';
            calculatedData.serviceType = "All";
            var row = await this.currentSavingsAccList.findIndex((x: any) => x.service == calculatedData.service);
            this.targetSavingsAccList[row] = await calculatedData;
          }
        }
        else if (filteredData[0] == undefined) {
          calculatedData = {
            clientId: this.fedexClientId,
            count: 0,
            currentPercent: null,
            currentPercentType: null,
            currentSpend: null,
            includedInFuel: "Yes",
            savingsAmount: 0.00,
            service: distinctAccServices[serviceIndex],
            serviceName: distinctAccServices[serviceIndex],
            ratesheetGrouping: this.currentSavingsAccList[serviceIndex].ratesheetGrouping,
            serviceType: "Ground",
            targetId: 0,
            targetPercent: 0.00,
            targetPercentType: "%",
            targetSavingsPercent: 0.00,
            targetSpend: 0,
            totalGrossAmount: 0,
            weightRange: "All"
          };
          let row = await this.currentSavingsAccList.findIndex((x: any) => x.service == distinctAccServices[serviceIndex]);
          calculatedData.savingsAmount = Number(Number(this.currentSavingsAccList[row].currentSpend).toFixed(2));
          calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(this.currentSavingsAccList[row].currentSpend.toFixed(2)) == 0.00) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAccList[row].currentSpend.toFixed(2))) * 100));
          this.targetSavingsAccList[row] = await calculatedData;
        }
      }
      let totalTargetSpend = 0;
      let totalSavings = 0;
      for (let index = 0; index < this.targetSavingsAccList.length; index++) {
        totalTargetSpend += this.targetSavingsAccList[index].targetSpend;
        totalSavings += this.targetSavingsAccList[index].savingsAmount;
      }
      this.targetSavingsAccTotalList.push({
        count: '',
        targetPercent: '',
        targetSpend: totalTargetSpend,
        targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) != 0) ? (totalSavings / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
        savingsAmount: totalSavings
      });
      this.totalScenarios[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);
      this.totalScenarios[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);
      await this.setMinMaxTargetExcel(index, "acc");
      this.totalScenarios[index].accMinMaxList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.service) - this.distinctAccServices.indexOf(b.service));
    }
    else {
      this.targetSavingsAccList = [];
      this.targetSavingsAccTotalList = [];
      var unfilteredData: any = await this.httpclient.fetchGRIAccessorialDetailsTarget(clientDetail).toPromise();
      var data = unfilteredData.filter((data: any) => data.targetId == this.totalScenarios[index].targetId);
      this.totalScenarios[index].accessorialTargetDetails = data;
      let distinctAccServices = await this.getUniqueService(this.currentSavingsAccList, 'service');
      for (let serviceIndex = 0; serviceIndex < distinctAccServices.length; serviceIndex++) {
        var filteredData;
        filteredData = data.filter((obj: any) => obj.service == distinctAccServices[serviceIndex]);
        let totalTargetSpend = 0;
        let totalSavings = 0;
        let targetSavingsPercent = 0;
        for (let key in filteredData) {
          totalTargetSpend = totalTargetSpend + Number(Number(filteredData[key].targetSpend).toFixed(2));
        }
        totalTargetSpend = Number(totalTargetSpend);
        if (filteredData[0] != undefined) {
          let currentService = await this.currentSavingsAccList.filter((data: any) => data.service == filteredData[0].service);
          if (currentService[0] != null && currentService[0] != undefined) {
            totalSavings = totalTargetSpend - currentService[0].currentSpend;
            totalSavings = (Math.abs(totalSavings).toFixed(2) == '0.00') ? 0.00 : totalSavings;
            targetSavingsPercent = (currentService[0].currentSpend == 0) ? 0.00 : (totalSavings / currentService[0].currentSpend) * 100;
            var calculatedData = Object.assign({}, filteredData[0]);
            calculatedData.targetSpend = totalTargetSpend;
            calculatedData.savingsAmount = totalSavings;
            calculatedData.targetSavingsPercent = targetSavingsPercent;
            calculatedData.targetPercentType = '%';
            calculatedData.serviceType = "All";
            var row = await this.currentSavingsAccList.findIndex((x: any) => x.service == calculatedData.service);
            this.targetSavingsAccList[row] = await calculatedData;
          }
        }
        else if (filteredData[0] == undefined) {
          calculatedData = {
            clientId: this.fedexClientId,
            count: 0,
            currentPercent: null,
            currentPercentType: null,
            currentSpend: null,
            includedInFuel: "Yes",
            savingsAmount: 0.00,
            service: distinctAccServices[serviceIndex],
            serviceName: distinctAccServices[serviceIndex],
            ratesheetGrouping: this.currentSavingsAccList[serviceIndex].ratesheetGrouping,
            serviceType: "Ground",
            targetId: 0,
            targetPercent: 0.00,
            targetPercentType: "%",
            targetSavingsPercent: 0.00,
            targetSpend: 0,
            totalGrossAmount: 0,
            weightRange: "All"
          };
          let row = await this.currentSavingsAccList.findIndex((x: any) => x.service == distinctAccServices[serviceIndex]);
          calculatedData.savingsAmount = Number(Number(this.currentSavingsAccList[row].currentSpend).toFixed(2));
          calculatedData.targetSavingsPercent = (calculatedData.savingsAmount == 0) ? 0.00 : ((Number(this.currentSavingsAccList[row].currentSpend.toFixed(2)) == 0.00) ? 0.00 : ((Number(calculatedData.savingsAmount.toFixed(2)) / Number(this.currentSavingsAccList[row].currentSpend.toFixed(2))) * 100));
          this.targetSavingsAccList[row] = await calculatedData;
        }
      }
      let totalTargetSpend = 0;
      let totalSavings = 0;
      for (let index = 0; index < this.targetSavingsAccList.length; index++) {
        totalTargetSpend += this.targetSavingsAccList[index].targetSpend;
        totalSavings += this.targetSavingsAccList[index].savingsAmount;
      }
      this.targetSavingsAccTotalList.push({
        count: '',
        targetPercent: '',
        targetSpend: totalTargetSpend,
        targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) != 0) ? (totalSavings / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
        savingsAmount: totalSavings
      });
      this.totalScenarios[index].dataSourceAccTarget = new MatTableDataSource(this.targetSavingsAccList);
      this.totalScenarios[index].dataSourceTargetAccTotal = new MatTableDataSource(this.targetSavingsAccTotalList);
      await this.setMinMaxTargetExcel(index, "acc");
      this.totalScenarios[index].accMinMaxList.sort((a: any, b: any) => this.distinctAccServices.indexOf(a.service) - this.distinctAccServices.indexOf(b.service));
    }
  }

  async calculateOverallTotalExcel(scenarioIndex: number) {
    this.targetSavingsAirTotalList = [];
    this.targetSavingsGroundTotalList = [];
    this.targetSavingsIntlTotalList = [];
    this.targetSavingsHWTTotalList = [];
    this.targetSavingsAccTotalList = [];
    this.totalScenarios[scenarioIndex].dataSourceTargetAirTotal.data.forEach((data: any) => this.targetSavingsAirTotalList.push(Object.assign({}, data)));
    this.totalScenarios[scenarioIndex].dataSourceTargetGroundTotal.data.forEach((data: any) => this.targetSavingsGroundTotalList.push(Object.assign({}, data)));
    this.totalScenarios[scenarioIndex].dataSourceTargetIntlTotal.data.forEach((data: any) => this.targetSavingsIntlTotalList.push(Object.assign({}, data)));
    this.totalScenarios[scenarioIndex].dataSourceTargetHWTTotal.data.forEach((data: any) => this.targetSavingsHWTTotalList.push(Object.assign({}, data)));
    this.totalScenarios[scenarioIndex].dataSourceTargetAccTotal.data.forEach((data: any) => this.targetSavingsAccTotalList.push(Object.assign({}, data)));
    this.totalScenarios[scenarioIndex].totalNetSpend = Number((this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend + this.targetSavingsAccTotalList[0].targetSpend).toFixed(2));
    this.totalScenarios[scenarioIndex].totalFreightSpend = Number((this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend).toFixed(2));
    this.totalScenarios[scenarioIndex].totalAccSpend = Number((this.targetSavingsAccTotalList[0].targetSpend).toFixed(2));
    this.totalScenarios[scenarioIndex].totalSavings = Number((this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount + this.targetSavingsAccTotalList[0].savingsAmount).toFixed(2));
    this.totalScenarios[scenarioIndex].totalSavingsPercent = (this.totalCurrentSpend == 0) ? 0.00 : Number(((this.totalScenarios[scenarioIndex].totalSavings / this.totalCurrentSpend) * 100).toFixed(2));
    this.totalScenarios[scenarioIndex].totalFreightSavings = Number((this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount).toFixed(2));
    this.totalScenarios[scenarioIndex].totalFreightSavingsPercent = (this.totalFreightSpend == 0) ? 0.00 : Number(((this.totalScenarios[scenarioIndex].totalFreightSavings / this.totalFreightSpend) * 100).toFixed(2));
    this.totalScenarios[scenarioIndex].totalAccSavings = Number(Number(this.targetSavingsAccTotalList[0].savingsAmount).toFixed(2));
    this.totalScenarios[scenarioIndex].totalAccSavingsPercent = (this.totalAccSpend == 0) ? 0.00 : Number(((this.totalScenarios[scenarioIndex].totalAccSavings / this.totalAccSpend) * 100).toFixed(2));
  }
  combineAndSum(data: any[], columnName: string, columnsToSum: string[]) {
    const result: { [key: string]: { [key: string]: number } } = {};
    data.forEach((item) => {
      const key = item[columnName];
      if (!result[key]) {
        result[key] = {};
        columnsToSum.forEach((column) => {
          result[key][column] = 0;
        });
      }
      columnsToSum.forEach((column) => {
        result[key][column] += item[column];
      });
    });
    const combinedData = Object.keys(result).map((key) => ({
      [columnName]: key,
      ...result[key],
    }));
    return combinedData;
  }

  async excelDownload(scenarios: number[]) {

    this.openLoading();

    let scenariosDisplayed = []
    let selectedScenarios = [];
    let dimFactorList: any = [];
    let netAmountMinMaxList: any = [];

    this.dimFactorList.forEach((data: any) => dimFactorList.push(Object.assign({}, data)));
    this.netAmountMinMaxList.forEach((data: any) => netAmountMinMaxList.push(Object.assign({}, data)));

    for (let index = 0; index < scenarios.length; index++) {
      if (!this.allIdList.includes(scenarios[index])) {
        this.allIdList.push(scenarios[index]);
        for (let row = 0; row < this.totalScenarios.length; row++) {
          if (this.totalScenarios[row].targetId == scenarios[index]) {
            await this.insertDataForExcel(this.selectedCarrier.carrierName.toLowerCase(), row);
            await this.calculateOverallTotalExcel(row);
            break;
          }
        }
        if (!this.availableIdList.includes(scenarios[index])) {
          await this.getTargetDetails();
          var scenarioIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
          await this.insertDataForExcel(this.selectedCarrier.carrierName.toLowerCase(), scenarioIndex);
          await this.calculateOverallTotalExcel(scenarioIndex);
        }
      }
    }

    for (let index = 0; index < scenarios.length; index++) {
      selectedScenarios.push(scenarios[index].toString());
      var rowIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
      scenariosDisplayed.push(this.totalScenarios[rowIndex]);
    }

    var clientDetail: any = {}
    if (scenarios != undefined) {
      for (let index = 0; index < scenarios.length; index++) {

        clientDetail['targetId'] = scenarios[index];

        if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
          clientDetail['clientId'] = this.fedexClientId;
          var dimList = await this.fedexService.fetchGRIDimFactorDetails(clientDetail).toPromise();
          var minimumReductionList = await this.fedexService.fetchGRIMinDetails(clientDetail).toPromise();
        }
        else {
          clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
          var dimList = await this.httpclient.fetchGRIDimFactorDetails(clientDetail).toPromise();
          var minimumReductionList = await this.httpclient.fetchGRIMinDetails(clientDetail).toPromise();
        }

        var minMaxList = await this.setNetAmountMinMaxExcel(minimumReductionList);

        minMaxList.forEach((data, row) => {
          netAmountMinMaxList[row]['targetMin' + scenarios[index]] = data.targetMin;
          netAmountMinMaxList[row]['targetMax' + scenarios[index]] = data.targetMax;
        });

        dimList.forEach((data: any, row: any) => {
          dimFactorList[row]['targetDimDivisor' + scenarios[index]] = data.targetDimDivisor;
        });
      }
    }

    var d = new Date();
    var currentDate = this.datePipe.transform(d, "MM-dd-yyyy");
    var fileName = this.selectedCarrier.carrierName + '_GRI_Analysis_' + this.selectedCarrier.clientName + '_' + currentDate + ".xlsx";
    var carrierColumnName = 'UPS DISCOUNT';
    if (this.selectedCarrier.carrierName.toLowerCase() == 'ups') {
      carrierColumnName = 'UPS DISCOUNT';
    }
    else {
      carrierColumnName = 'FEDEX DISCOUNT';
    }
    var tableOneArr = [];
    let headerArray = ['', 'Client Name:', this.clientName, '', '', ''];

    for (let row = 0; row < selectedScenarios.length * 4; row++) {
      headerArray.push('');
    }

    tableOneArr.push(headerArray);
    tableOneArr.push(['', 'Total Net Spend:', Number(this.totalCurrentSpend.toFixed(2))])
    tableOneArr.push(['', 'Invoice From Date:', this.selectedCarrier['dateRange'].split(' to ')[0]])
    tableOneArr.push(['', 'Invoice To Date:', this.selectedCarrier['dateRange'].split(' to ')[1]])

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('GRI Detail', {
      views: [{ showGridLines: false }]
    });

    worksheet.properties.showGridLines = false;
    worksheet.getColumn(1).width = 4;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 25;
    let columnIndex = 3;

    for (let row = 0; row < selectedScenarios.length; row++) {
      columnIndex++;
      worksheet.getColumn(columnIndex).width = 25;
    }

    let totalLength = 6 + (selectedScenarios.length * 4)
    for (let row = columnIndex++; row <= totalLength; row++) {
      worksheet.getColumn(row).width = 15;
    }
    worksheet.addRow([]);

    let header = worksheet.addRow(["", "2026 " + this.selectedCarrier.carrierName + " General Rate Increase (GRI) Projection Report"]);


    header.eachCell((cell: any, cellNum: any) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
      if (cellNum != 1) {
        cell.font = { name: "Cambria", size: 20, bold: true, color: { argb: '4F81BD' } };
      }
    });

    tableOneArr.forEach(d => {
      let row: any = worksheet.addRow(d);
      var typeVal = row['_cells'][1]['_value'].model.value;

      if (typeVal == "Client Name:") {
        row.eachCell((cell: any, cellNum: any) => {

          if (cellNum != 1) {
            if (cellNum == 2) {
              cell.font = { family: 4, size: 11, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
            else if (cellNum == 3) {
              cell.font = { family: 4, size: 11, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } } };
            }
            else {
              cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
            }
          }

        });
      }
      else if (typeVal == "Total Net Spend:") {
        row.eachCell((cell: any, cellNum: any) => {

          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
            cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          if (cellNum == 3) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.numFmt = '$#,##0.00';
          }
        })
      }
      else {
        row.eachCell((cell: any, cellNum: any) => {

          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
            cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          if (cellNum == 3) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
        })
      }
    });

    worksheet.addRow([]);
    var tableTwoArr = [];
    var tempArr: any = [''];

    // scenariosDisplayed.forEach(scenario => {
    //   tempArr = [...tempArr, 'Projected Annual Savings:\n ' + scenario.targetName + '\n' + '$ ' + this.setCommaQty(Number(scenario.totalSavings).toFixed(2)) + ' / ' + this.setCommaQty(Number(scenario.totalSavingsPercent).toFixed(2)) + ' %'];
    // });

    scenariosDisplayed.forEach(scenario => {
      tempArr = [...tempArr, 'Projected Annual Cost Increase: ', '$ ' + this.setCommaQty(Number(scenario.totalSavings).toFixed(2))];
    });
    tableTwoArr.push(tempArr);

    tempArr = [''];
    scenariosDisplayed.forEach(scenario => {
      tempArr = [...tempArr, 'Projected Annual Percent Increase: ', this.setCommaQty(Number(scenario.totalSavingsPercent).toFixed(2)) + ' %'];
    });
    tableTwoArr.push(tempArr);

    tempArr = [''];
    scenariosDisplayed.forEach(scenario => {
      tempArr = [...tempArr, '$ ' + this.setCommaQty(Number(scenario.totalSavings).toFixed(2)) + ' / ' + this.setCommaQty(Number(scenario.totalSavingsPercent).toFixed(2)) + ' %'];
    });
    tableTwoArr.push(tempArr);

    tableTwoArr.forEach((d, rowCount) => {
      let row = worksheet.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {

        if (cellNum != 1) {
          if (rowCount == 0) {
            cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
            if (cellNum != 2) {
              cell.border = { left: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
          }
          if (rowCount == 1) {
            cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
            if (cellNum != 2) {
              cell.border = { left: { style: 'thin', color: { argb: 'BFBFBF' } } };
            }
          }
          if (rowCount == 2) {
            cell.font = { family: 4, size: 11, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '95B3D7' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
            if (cellNum != 2) {
              cell.border = { left: { style: 'thin', color: { argb: 'BFBFBF' } } };
            }
          }
        }
      });
    });
    worksheet.addRow([]);
    /* Domestic Air Service Level */
    var headerTableAirArr = [];

    var columnsHeader = ['', 'DOMESTIC AIR SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, this.selectedCarrier.year + ' CALCULATED SPEND'];
    var indexArr: any = ['', '', '', '', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      scenario.columnsTarget.forEach((column: any) => {
        columnsHeader.push(column['field'].toUpperCase())
        indexArr.push(index);
      });
    });

    headerTableAirArr.push(columnsHeader);
    headerTableAirArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.height = 36.5;
      row.eachCell((cell: any, cellNum: any) => {
        var fgColorCode = '';
        if (cellNum != 1) {
          if (cellNum >= 7) {
            var index = indexArr[cellNum - 1];
            if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
              fgColorCode = '95B3D7';
            }
            else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
              fgColorCode = 'B8CCE4';
            }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
          }
          else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
          }
          cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
          cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
          if (cellNum != 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
          }
        }
      });
    });


    var tableAirArr = [];
    tempArr = [];

    for (var loop1 = 0; loop1 < this.currentSavingsAirList.length; loop1++) {

      let currentDiscountsList = this.airProposalList.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType === thing.containerType && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo && t.shortName == this.currentSavingsAirList[loop1].service) === i
      );

      currentDiscountsList = currentDiscountsList.sort((a: any, b: any) => a.weightFrom - b.weightFrom);

      if (currentDiscountsList.length > 0) {

        let minMax: any;
        for (let row = 0; row < currentDiscountsList.length; row++) {
          minMax = { disMin: currentDiscountsList[row]['targetDis'], disMax: '-1' };

          let filteredData = this.airProposalList.filter((airData: any) => airData.containerType == currentDiscountsList[row].containerType && airData.weightFrom == currentDiscountsList[row].weightFrom && airData.weightTo == currentDiscountsList[row].weightTo && airData.shortName == currentDiscountsList[row].shortName);

          filteredData.forEach((airData: any) => {
            if ((airData.zone1.toLowerCase() == 'pr' && Number(airData.targetDis) != 0) || airData.zone1.toLowerCase() != 'pr') {

              if (airData['targetDis'] == '') {
                minMax.disMin = "0.00";
                minMax.disMax = "0.00";
              }
              else {
                if (Number(minMax.disMin) >= Number(airData['targetDis'])) {
                  minMax.disMin = Number(airData['targetDis']).toFixed(2);
                }
                if (Number(minMax.disMax) <= Number(airData['targetDis'])) {
                  minMax.disMax = Number(airData['targetDis']).toFixed(2);
                }
              }
            }
          });

          let currentDiscountMinimum = Number(minMax.disMin);
          let currentDiscountMaximum = Number(minMax.disMax);
          let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

          let weightFrom = Number(currentDiscountsList[row].weightFrom);
          let weightTo = Number(currentDiscountsList[row].weightTo);

          let containerType = currentDiscountsList[row].containerType;

          let currentCount = 0;
          let currentTotalSpend = 0;
          this.freightCurrentDetails.forEach((data: any) => {
            if (data.service == this.currentSavingsAirList[loop1].service && data.service.toLowerCase().includes(containerType.toLowerCase()) && Number(data.weightRange) >= weightFrom && Number(data.weightRange) <= weightTo) {
              currentCount += Number(data.count);
              currentTotalSpend += Number(Number(data.currentSpend).toFixed(2)) * Number(data.count);
            }
          });

          tempArr = ['', this.currentSavingsAirList[loop1].finalService + " " + containerType, (containerType.toLowerCase() == 'ltr') ? "Letter" : (weightFrom + '-' + weightTo), currentCount, currentDiscount, Number(currentTotalSpend.toFixed(2))];

          for (let column = 0; column < scenariosDisplayed.length; column++) {

            let scenario = scenariosDisplayed[column];

            var targetSavingsAirList = scenario.dataSourceAirTarget.data;

            let targetDiscountsList = scenario.airProposalList.filter(
              (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType === thing.containerType && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo && t.shortName == this.currentSavingsAirList[loop1].service) === i
            );

            targetDiscountsList = targetDiscountsList.sort((a: any, b: any) => a.weightFrom - b.weightFrom);
            let rowIndex = targetDiscountsList.findIndex((data: any) => data.containerType == containerType && weightFrom >= data.weightFrom && weightTo <= data.weightTo);
            if (targetDiscountsList[rowIndex] != undefined) {

              minMax = { disMin: targetDiscountsList[rowIndex]['targetDis'], disMax: '-1' };
              let filteredData = scenario.airProposalList.filter((airData: any) => airData.containerType == targetDiscountsList[rowIndex].containerType && airData.weightFrom == targetDiscountsList[rowIndex].weightFrom && airData.weightTo == targetDiscountsList[rowIndex].weightTo && airData.shortName == targetDiscountsList[rowIndex].shortName);

              filteredData.forEach((airData: any) => {
                if ((airData.zone1.toLowerCase() == 'pr' && Number(airData.targetDis) != 0) || airData.zone1.toLowerCase() != 'pr') {
                  if (airData['targetDis'] == '') {
                    minMax.disMin = "0.00";
                    minMax.disMax = "0.00";
                  }
                  else {
                    if (Number(minMax.disMin) >= Number(airData['targetDis'])) {
                      minMax.disMin = Number(airData['targetDis']).toFixed(2);
                    }
                    if (Number(minMax.disMax) <= Number(airData['targetDis'])) {
                      minMax.disMax = Number(airData['targetDis']).toFixed(2);
                    }
                  }
                }
              });

              let targetDiscountMinimum = Number(minMax.disMin);
              let targetDiscountMaximum = Number(minMax.disMax);
              let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';

              let targetTotalSpend = 0;
              scenario.freightTargetDetails.forEach((data: any) => {
                if (data.service == this.targetSavingsAirList[loop1].service && data.service.toLowerCase().includes(containerType.toLowerCase()) && Number(data.weightRange) >= weightFrom && Number(data.weightRange) <= weightTo) {
                  targetTotalSpend += Number(Number(data.targetSpend).toFixed(2)) * Number(data.count);
                }
              });

              tempArr = [...tempArr, targetDiscount, Number(targetTotalSpend.toFixed(2)), Number((targetTotalSpend - currentTotalSpend).toFixed(2)), (currentTotalSpend == 0) ? Number((currentTotalSpend).toFixed(2)) : (Number(((targetTotalSpend - currentTotalSpend) / currentTotalSpend).toFixed(4)))];
            }
            else {
              let targetDiscountMinimum = Number(scenario.airMinMaxList[loop1].disMin);
              let targetDiscountMaximum = Number(scenario.airMinMaxList[loop1].disMax);
              let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
              var targetSavingsAirList = scenario.dataSourceAirTarget.data;
              tempArr = [...tempArr, targetDiscount, Number(targetSavingsAirList[loop1].targetSpend), Number(targetSavingsAirList[loop1].savingsAmount), Number(targetSavingsAirList[loop1].targetSavingsPercent / 100)];
            }
          }
          tableAirArr.push(tempArr);
        }
      }
      else {
        let currentDiscountMinimum = Number(this.airMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.airMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', this.currentSavingsAirList[loop1].finalService, this.currentSavingsAirList[loop1].weightRange, Number(this.currentSavingsAirList[loop1].count), currentDiscount, Number(this.currentSavingsAirList[loop1].currentSpend)]

        scenariosDisplayed.forEach(scenario => {

          let targetDiscountMinimum = Number(scenario.airMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.airMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          var targetSavingsAirList = scenario.dataSourceAirTarget.data;

          tempArr = [...tempArr, targetDiscount, Number(targetSavingsAirList[loop1].targetSpend), Number(targetSavingsAirList[loop1].savingsAmount), Number(targetSavingsAirList[loop1].targetSavingsPercent / 100)];
        });
        tableAirArr.push(tempArr);
      }
    }

    var dollarArray: any = [];
    var percentageArray: any = [];

    var lengthFlag = 2;

    if (tableAirArr[0] != undefined) {
      for (let index = 8; index <= tableAirArr[0].length; index++) {
        if (lengthFlag != dollarArray.length) dollarArray.push(index);
        else percentageArray.push(index);
        if (lengthFlag == percentageArray.length) lengthFlag += 2;
      }
    }

    tableAirArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {

        if (cellNum != 1) {
          cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        }
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        if (cellNum == 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
        else if (cellNum == totalLength || cellNum == 7) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        }
        else {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }

        if (cellNum == 4) {
          cell.numFmt = '#,##0';
        }
        else if (cellNum == 5) {
          cell.numFmt = '0.00%';
        }
        else if (cellNum == 6) {
          cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
        else if (cellNum == 7) {
          cell.numFmt = '0.00%';
        }
        else if (dollarArray.includes(cellNum)) {
          cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
        else if (percentageArray.includes(cellNum)) {
          cell.numFmt = '0.00%';
        }
      })
    });
    worksheet.addRow([]);

    /* Domestic Ground Service Level */
    if (this.currentSavingsGroundList.length > 0) {
      var headerTableGroundArr = [];
      var columnsHeader = ['', 'DOMESTIC GROUND SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, this.selectedCarrier.year + ' CALCULATED SPEND'];

      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field'].toUpperCase()));
      });

      headerTableGroundArr.push(columnsHeader);
      headerTableGroundArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.height = 36.5;
        row.eachCell((cell: any, cellNum: any) => {
          var fgColorCode = '';
          if (cellNum != 1) {
            if (cellNum >= 7) {
              var index = indexArr[cellNum - 1];
              if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
                fgColorCode = '95B3D7';
              }
              else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
                fgColorCode = 'B8CCE4';
              }
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
            }
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            }
            cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            if (cellNum != 2) {
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
            else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
            }
          }
        });
      });
      var tableGroundArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsGroundList.length; loop1++) {

        let currentDiscountMinimum = Number(this.groundMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.groundMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', (this.carrierName.toLowerCase() == "fedex") ? "FedEx " + this.currentSavingsGroundList[loop1].serviceName : this.currentSavingsGroundList[loop1].serviceName, this.currentSavingsGroundList[loop1].weightRange, Number(this.currentSavingsGroundList[loop1].count), currentDiscount, Number(this.currentSavingsGroundList[loop1].currentSpend)]

        if (this.currentSavingsGroundList[loop1].weightRange != 'Sub Total') {

          scenariosDisplayed.forEach(scenario => {

            let targetDiscountMinimum = Number(scenario.groundMinMaxList[loop1].disMin);
            let targetDiscountMaximum = Number(scenario.groundMinMaxList[loop1].disMax);
            let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
            var targetSavingsGroundList = scenario.dataSourceGroundTarget.data;

            tempArr = [...tempArr, targetDiscount, Number(targetSavingsGroundList[loop1].targetSpend), Number(targetSavingsGroundList[loop1].savingsAmount), Number(targetSavingsGroundList[loop1].targetSavingsPercent / 100)];
          });
          tableGroundArr.push(tempArr);
        }
      }

      tableGroundArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          }
          else if (cellNum == totalLength || cellNum == 7) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          if (cellNum == 4) {
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 5) {
            cell.numFmt = '0.00%';
          }
          else if (cellNum == 6) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum == 7) {
            cell.numFmt = '0.00%';
          }
          else if (dollarArray.includes(cellNum)) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (percentageArray.includes(cellNum)) {
            cell.numFmt = '0.00%';
          }
        })
      });
      worksheet.addRow([]);
    }

    /* Hundred Weight Service Level */
    if (this.currentSavingsHWTList.length > 0) {
      var headerTableHwtArr = [];
      var columnsHeader = ['', 'HWT SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, this.selectedCarrier.year + ' CALCULATED SPEND'];

      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field'].toUpperCase()));
      });

      headerTableHwtArr.push(columnsHeader);
      headerTableHwtArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.height = 36.5;
        row.eachCell((cell: any, cellNum: any) => {
          var fgColorCode = '';
          if (cellNum != 1) {
            if (cellNum >= 7) {
              var index = indexArr[cellNum - 1];
              if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
                fgColorCode = '95B3D7';
              }
              else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
                fgColorCode = 'B8CCE4';
              }
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
            }
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            }
            cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            if (cellNum != 2) {
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
            else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
            }
          }
        });
      });
      var tableHwtArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsHWTList.length; loop1++) {

        let currentDiscountMinimum = Number(this.hwtMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.hwtMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', (this.carrierName.toLowerCase() == "fedex" && !this.currentSavingsHWTList[loop1].finalService.toLowerCase().includes("fedex")) ? "FedEx " + this.currentSavingsHWTList[loop1].finalService : this.currentSavingsHWTList[loop1].finalService, this.currentSavingsHWTList[loop1].weightRange, Number(this.currentSavingsHWTList[loop1].count), currentDiscount, Number(this.currentSavingsHWTList[loop1].currentSpend)];

        scenariosDisplayed.forEach(scenario => {
          let targetDiscountMinimum = Number(scenario.hwtMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.hwtMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          var targetSavingsHwtList = scenario.dataSourceHWTTarget.data;
          tempArr = [...tempArr, targetDiscount, Number(targetSavingsHwtList[loop1].targetSpend), Number(targetSavingsHwtList[loop1].savingsAmount), Number(targetSavingsHwtList[loop1].targetSavingsPercent / 100)];
        });
        tableHwtArr.push(tempArr);
      }

      tableHwtArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          }
          else if (cellNum == totalLength || cellNum == 7) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          if (cellNum == 4) {
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 5) {
            cell.numFmt = '0.00%';
          }
          else if (cellNum == 6) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum == 7) {
            cell.numFmt = '0.00%';
          }
          else if (dollarArray.includes(cellNum)) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (percentageArray.includes(cellNum)) {
            cell.numFmt = '0.00%';
          }
        })
      });
      worksheet.addRow([]);
    }

    /* International Service Level */
    if (this.currentSavingsIntlList.length > 0) {
      var headerTableIntlArr = [];
      var columnsHeader = ['', 'INTERNATIONAL SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, this.selectedCarrier.year + ' CALCULATED SPEND'];

      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field'].toUpperCase()));
      });

      headerTableIntlArr.push(columnsHeader);
      headerTableIntlArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.height = 36.5;
        row.eachCell((cell: any, cellNum: any) => {
          var fgColorCode = '';
          if (cellNum != 1) {
            if (cellNum >= 7) {
              var index = indexArr[cellNum - 1];
              if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
                fgColorCode = '95B3D7';
              }
              else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
                fgColorCode = 'B8CCE4';
              }
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
            }
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            }
            cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            if (cellNum != 2) {
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
            else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
            }
          }
        });
      });
      var tableIntlArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsIntlList.length; loop1++) {

        let intlDataIndex = this.intlProposalList.findIndex((data: any) => data.shortName == this.currentSavingsIntlList[loop1].service);
        let currentDiscountMinimum = Number(this.intlMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.intlMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        if (intlDataIndex == -1) {
          let containerType = "";
          if (this.currentSavingsIntlList[loop1].service.toLowerCase().includes('ltr')) {
            containerType = "LTR";
          }
          else if (this.currentSavingsIntlList[loop1].service.toLowerCase().includes('pkg')) {
            containerType = "PKG";
          }
          else if (this.currentSavingsIntlList[loop1].service.toLowerCase().includes('doc')) {
            containerType = "DOC";
          }
          else if (this.currentSavingsIntlList[loop1].service.toLowerCase().includes('pak')) {
            containerType = "PAK";
          }
          tempArr = ['', this.currentSavingsIntlList[loop1].finalService + " " + containerType, this.currentSavingsIntlList[loop1].weightRange, Number(this.currentSavingsIntlList[loop1].count), currentDiscount, Number(this.currentSavingsIntlList[loop1].currentSpend)];
        }
        else {
          tempArr = ['', this.currentSavingsIntlList[loop1].finalService + " " + this.intlProposalList[intlDataIndex].containerType, this.currentSavingsIntlList[loop1].weightRange, Number(this.currentSavingsIntlList[loop1].count), currentDiscount, Number(this.currentSavingsIntlList[loop1].currentSpend)];
        }
        scenariosDisplayed.forEach(scenario => {
          let targetDiscountMinimum = Number(scenario.intlMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.intlMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          var targetSavingsIntlList = scenario.dataSourceIntlTarget.data;
          tempArr = [...tempArr, targetDiscount, Number(targetSavingsIntlList[loop1].targetSpend), Number(targetSavingsIntlList[loop1].savingsAmount), Number(targetSavingsIntlList[loop1].targetSavingsPercent / 100)];
        });
        tableIntlArr.push(tempArr);
      }
      tableIntlArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          }
          else if (cellNum == totalLength || cellNum == 7) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          if (cellNum == 4) {
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 5) {
            cell.numFmt = '0.00%';
          }
          else if (cellNum == 6) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum == 7) {
            cell.numFmt = '0.00%';
          }
          else if (dollarArray.includes(cellNum)) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (percentageArray.includes(cellNum)) {
            cell.numFmt = '0.00%';
          }
        })
      });
      worksheet.addRow([]);
    }

    /* Accessorial Charge */
    if (this.currentSavingsAccList.length > 0) {
      var headerTableAccArr = [];

      var columnsHeader = ['', 'ACCESSORIAL CHARGE', 'SERVICE TYPE', 'COUNT', carrierColumnName, this.selectedCarrier.year + ' CALCULATED SPEND'];
      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field'].toUpperCase()));
      });

      headerTableAccArr.push(columnsHeader);
      headerTableAccArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.height = 36.5;
        row.eachCell((cell: any, cellNum: any) => {
          var fgColorCode = '';
          if (cellNum != 1) {
            if (cellNum >= 7) {
              var index = indexArr[cellNum - 1];
              if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
                fgColorCode = '95B3D7';
              }
              else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
                fgColorCode = 'B8CCE4';
              }
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
            }
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            }
            cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            if (cellNum != 2) {
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            }
            else {
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
            }
          }
        });
      });

      var tableAccArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsAccList.length; loop1++) {

        let filteredData = this.currentSavingsAccList.filter((data: any) => data.service == this.currentSavingsAccList[loop1].service);
        let rowIndex = -1;
        let splitIndex = false;
        if (this.currentSavingsAccList[loop1].ratesheetGrouping != null && this.currentSavingsAccList[loop1].serviceName != null) {
          splitIndex = this.accCheckList.includes(this.currentSavingsAccList[loop1].ratesheetGrouping.toLowerCase() + this.currentSavingsAccList[loop1].serviceName.toLowerCase());
        }
        if (filteredData.length > 1) {
          rowIndex = this.currentSavingsAccList.findIndex((data: any) => data.service == this.currentSavingsAccList[loop1].service && !this.accCheckList.includes(data.ratesheetGrouping.toLowerCase() + data.serviceName.toLowerCase()));
        }


        let currentDiscountMinimum = Number(this.accMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.accMinMaxList[loop1].disMax);
        let currentDiscountType = this.accMinMaxList[loop1].discountType;
        let currentDiscount;
        if (currentDiscountType == '$') {
          currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? ('$' + (currentDiscountMinimum.toFixed(2))) : '$' + currentDiscountMinimum.toFixed(2) + ' - $' + currentDiscountMaximum.toFixed(2);
        }
        else {
          currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '%  - ' + currentDiscountMaximum.toFixed(2) + '%';
        }

        tempArr = ['', (splitIndex) ? ((this.currentSavingsAccList[loop1].hoverName != undefined) ? this.currentSavingsAccList[loop1].hoverName : this.currentSavingsAccList[loop1].service) : this.currentSavingsAccList[loop1].finalService, (rowIndex == loop1) ? 'Remaining Services' : this.currentSavingsAccList[loop1].serviceType, Number(this.currentSavingsAccList[loop1].count), currentDiscount, Number(this.currentSavingsAccList[loop1].currentSpend)];

        scenariosDisplayed.forEach(scenario => {
          let targetDiscountMinimum = Number(scenario.accMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.accMinMaxList[loop1].disMax);
          let targetDiscountType = scenario.accMinMaxList[loop1].discountType;
          let targetDiscount;
          if (targetDiscountType == '$') {
            targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? ('$' + (targetDiscountMinimum.toFixed(2))) : '$' + targetDiscountMinimum.toFixed(2) + ' - $' + targetDiscountMaximum.toFixed(2);
          }
          else {
            targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '%  - ' + targetDiscountMaximum.toFixed(2) + '%';
          }
          var targetSavingsAccList = scenario.dataSourceAccTarget.data;
          tempArr = [...tempArr, targetDiscount, Number(targetSavingsAccList[loop1].targetSpend), Number(targetSavingsAccList[loop1].savingsAmount), Number(targetSavingsAccList[loop1].targetSavingsPercent / 100)];
        });

        tableAccArr.push(tempArr);
      }

      tableAccArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          }
          else if (cellNum == totalLength || cellNum == 7) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          if (cellNum == 4) {
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 5) {
            cell.numFmt = '0.00%';
          }
          else if (cellNum == 6) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum == 7) {
            cell.numFmt = '0.00%';
          }
          else if (dollarArray.includes(cellNum)) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (percentageArray.includes(cellNum)) {
            cell.numFmt = '0.00%';
          }
        })
      });
      worksheet.addRow([]);
    }

    /* Total Row */
    var headerTableTotalArr = [];
    tempArr = ['', 'Total', '', '', '', Number(this.totalCurrentSpend.toFixed(2))];

    scenariosDisplayed.forEach(scenario => {
      tempArr = [...tempArr, '', Number(scenario.totalNetSpend.toFixed(2)), Number(scenario.totalSavings.toFixed(2)), Number(scenario.totalSavingsPercent / 100)];
    });

    headerTableTotalArr.push(tempArr);

    var formatArray = 0;
    headerTableTotalArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {

        if (cellNum != 1) {
          cell.font = { family: 4, size: 11, bold: true, color: { argb: '000000' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '95B3D7' } };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
          if (cellNum == 1) {
          }
          else if (cellNum == 6) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum > 6) {
            if (formatArray == 0) cell.numFmt = '';
            else if (formatArray <= 2) cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            else if (formatArray == 3) cell.numFmt = '0.00%';
            formatArray++;
            if (formatArray == 4) formatArray = 0;
          }
        }
      });
    });

    worksheet.addRow([]);
    /* Dim Factor */
    var headerTableDimArr = [];
    tempArr = ['', 'CRITERIA', 'SERVICE GROUPINGS', 'CUBIC IN FROM', 'CUBIC IN TO', this.carrierName + ' DIM Factor'];
    indexArr = ['', '', '', '', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      tempArr = [...tempArr, (scenario.carrierName + ' dim Factor').toUpperCase()];
      indexArr.push(index);
    });

    headerTableDimArr.push(tempArr);

    headerTableDimArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.height = 28.5;
      row.eachCell((cell: any, cellNum: any) => {
        var fgColorCode = '';
        if (cellNum != 1) {
          if (cellNum >= 7) {
            var index = indexArr[cellNum - 1];
            if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
              fgColorCode = '95B3D7';
            }
            else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
              fgColorCode = 'B8CCE4';
            }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
          }
          else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
          }
          cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
          cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
          if (cellNum != 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
          }
        }
      });
    });

    var tableDimArr: any = [];

    dimFactorList.forEach((data: any) => {
      tempArr = ['', data.criteria, data.serviceGrouping, data.cubicInchFrom, data.cubicInchTo, Number(data.baselineDimFactor)];
      selectedScenarios.forEach(scenarioIndex => {
        tempArr = [...tempArr, data['targetDimDivisor' + scenarioIndex]];
      })
      tableDimArr.push(tempArr);
    });

    tableDimArr.forEach((d: any) => {
      let row = worksheet.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {
        if (cellNum != 1) {
          cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        }
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        if (cellNum == 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
        else {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
      })
    });
    worksheet.addRow([]);

    /* Minimum Reduction */
    var headerTableMinimumArr = [];
    tempArr = ['', 'MINIMUM REDUCTION', this.selectedCarrier.year + ' ' + this.carrierName + ' MINIMUM REDUCTION'];
    indexArr = ['', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      tempArr = [...tempArr, (scenario.year + ' ' + scenario.carrierName + ' Minimum Reduction').toUpperCase()];
      indexArr.push(index)
    });

    headerTableMinimumArr.push(tempArr);

    headerTableMinimumArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.height = 36.5;
      row.eachCell((cell: any, cellNum: any) => {
        var fgColorCode = '';
        if (cellNum != 1) {
          if (cellNum >= 4) {
            var index = indexArr[cellNum - 1];
            if (scenariosDisplayed[index].carrierName.toUpperCase() == 'UPS') {
              fgColorCode = '95B3D7';
            }
            else if (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') {
              fgColorCode = 'B8CCE4';
            }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
          }
          else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
          }
          cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
          cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
          if (cellNum != 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
          }
        }
      });
    });

    var tableMinimumArr = [];

    for (var loop = 0; loop < this.distinctMinReductionList.length; loop++) {

      let currentMinimum = Number(netAmountMinMaxList[loop].currentMin.replace('%', '').replace('$', '')).toFixed(2);
      let currentMaximum = Number(netAmountMinMaxList[loop].currentMax.replace('%', '').replace('$', '')).toFixed(2);
      if (netAmountMinMaxList[loop].currentMin.indexOf('%') > 0) {
        var prefixCurrentMinType = '';
        var suffixCurrentMinType = '%';
        var currentMin = (currentMinimum == currentMaximum) ? (prefixCurrentMinType + currentMinimum + suffixCurrentMinType) : (prefixCurrentMinType + currentMinimum + suffixCurrentMinType + ' - ' + prefixCurrentMinType + currentMaximum + suffixCurrentMinType);
      }
      else {
        var prefixCurrentMinType = '$';
        var suffixCurrentMinType = '';
        var currentMin = (currentMinimum == currentMaximum) ? (prefixCurrentMinType + currentMinimum + suffixCurrentMinType) : (prefixCurrentMinType + currentMinimum + suffixCurrentMinType + ' - ' + prefixCurrentMinType + currentMaximum + suffixCurrentMinType);
      }

      tempArr = ['', (this.carrierName.toLowerCase() == "fedex") ? "FedEx " + this.netAmountMinMaxList[loop].service : this.netAmountMinMaxList[loop].service, currentMin];

      selectedScenarios.forEach((scenarioIndex, rowIndex) => {
        let targetMinimum = Number(netAmountMinMaxList[loop]['targetMin' + scenarioIndex].replace('%', '').replace('$', '')).toFixed(2);
        let targetMaximum = Number(netAmountMinMaxList[loop]['targetMax' + scenarioIndex].replace('%', '').replace('$', '')).toFixed(2);

        if (netAmountMinMaxList[loop]['targetMin' + scenarioIndex].indexOf('%') > 0) {
          var prefixTargetMin1Type = '';
          var suffixTargetMin1Type = '%';
          var targetMin = (targetMinimum == targetMaximum) ? (prefixTargetMin1Type + targetMinimum + suffixTargetMin1Type) : (prefixTargetMin1Type + targetMinimum + suffixTargetMin1Type + ' - ' + prefixTargetMin1Type + targetMaximum + suffixTargetMin1Type);
        }
        else {
          var prefixTargetMin1Type = '$';
          var suffixTargetMin1Type = '';
          var targetMin = (targetMinimum == targetMaximum) ? (prefixTargetMin1Type + targetMinimum + suffixTargetMin1Type) : (prefixTargetMin1Type + targetMinimum + suffixTargetMin1Type + ' - ' + prefixTargetMin1Type + targetMaximum + suffixTargetMin1Type);
        }
        tempArr = [...tempArr, targetMin];
      });
      tableMinimumArr.push(tempArr);
    }

    tableMinimumArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {
        if (cellNum != 1) {
          cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        }
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        if (cellNum == 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
        else {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
      })
    });
    let worksheetName = workbook.addWorksheet('GRI Analysis', {//scenariosDisplayed[index].targetNickName
      views: [{ showGridLines: false }]
    });
    selectedScenarios.forEach((scenario, index) => {
      worksheetName.getColumn(1).width = 4;
      worksheetName.getColumn(2).width = 35;
      worksheetName.getColumn(3).width = 25;
      worksheetName.getColumn(4).width = 15;
      worksheetName.getColumn(5).width = 25;
      worksheetName.getColumn(6).width = 15;
      worksheetName.getColumn(7).width = 15;
      worksheetName.addRow([]);

      var tableOneArr = [];
      var date = new Date();
      var TotalFreightSavings = scenariosDisplayed[index].dataSourceTargetAirTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetGroundTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetIntlTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetHWTTotal.data[0].savingsAmount;
      var TotalAccessorialSavings = scenariosDisplayed[index].dataSourceTargetAccTotal.data[0].savingsAmount;

      var tableArr: any = [];
      var TargetServiceList = [];
      var TargetAccessorialList = [];
      var TotalFreightCurrentSpend = 0;
      var TotalAccCurrentSpend = 0;
      var airList = [];
      var GroundList = [];
      var intlList = [];
      var accList = [];

      for (var loop = 0; loop < this.currentSavingsAirList.length; loop++) {

        if (Number(this.currentSavingsAirList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAirList = scenariosDisplayed[index].dataSourceAirTarget.data;
        airList.push({
          id: '', service: this.currentSavingsAirList[loop].finalService, count: Number(this.currentSavingsAirList[loop].count), currentSpend: Number(this.currentSavingsAirList[loop].currentSpend), targetSpend: Number(targetSavingsAirList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newAirList: any = this.combineAndSum(airList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAirList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newAirList[loop].service, count: newAirList[loop].count, currentSpend: newAirList[loop].currentSpend, targetSpend: newAirList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsGroundList.length; loop++) {
        if (Number(this.currentSavingsGroundList[loop].count) == 0) {
          continue;
        }
        if (this.currentSavingsGroundList[loop].weightRange != 'Sub Total') {
          var targetSavingsGroundList = scenariosDisplayed[index].dataSourceGroundTarget.data;
          GroundList.push({
            id: '', service: this.currentSavingsGroundList[loop].finalService, count: Number(this.currentSavingsGroundList[loop].count), currentSpend: Number(this.currentSavingsGroundList[loop].currentSpend), targetSpend: Number(targetSavingsGroundList[loop].targetSpend)
            , difference: '=E11-D11', increase: '=F11/D11'
          });
        }
      }

      var newGroundList: any = this.combineAndSum(GroundList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newGroundList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newGroundList[loop].service, count: newGroundList[loop].count, currentSpend: newGroundList[loop].currentSpend, targetSpend: newGroundList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsHWTList.length; loop++) {
        if (Number(this.currentSavingsHWTList[loop].count) == 0) {
          continue;
        }
        var targetSavingsHwtList = scenariosDisplayed[index].dataSourceHWTTarget.data;
        TargetServiceList.push({
          id: '', service: this.currentSavingsHWTList[loop].finalService, count: Number(this.currentSavingsHWTList[loop].count), currentSpend: Number(this.currentSavingsHWTList[loop].currentSpend), targetSpend: Number(targetSavingsHwtList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsIntlList.length; loop++) {
        if (Number(this.currentSavingsIntlList[loop].count) == 0) {
          continue;
        }
        var targetSavingsIntlList = scenariosDisplayed[index].dataSourceIntlTarget.data;
        intlList.push({
          id: '', service: this.currentSavingsIntlList[loop].finalService, count: Number(this.currentSavingsIntlList[loop].count), currentSpend: Number(this.currentSavingsIntlList[loop].currentSpend), targetSpend: Number(targetSavingsIntlList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newIntlList: any = this.combineAndSum(intlList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newIntlList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newIntlList[loop].service, count: newIntlList[loop].count, currentSpend: newIntlList[loop].currentSpend, targetSpend: newIntlList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsAccList.length; loop++) {
        if (Number(this.currentSavingsAccList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAccList = scenariosDisplayed[index].dataSourceAccTarget.data;
        accList.push({
          id: '', service: this.currentSavingsAccList[loop].finalService, count: Number(this.currentSavingsAccList[loop].count), currentSpend: Number(this.currentSavingsAccList[loop].currentSpend), targetSpend: Number(targetSavingsAccList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newAccList: any = this.combineAndSum(accList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAccList.length; loop++) {
        TargetAccessorialList.push({
          id: '', service: newAccList[loop].service, count: newAccList[loop].count, currentSpend: newAccList[loop].currentSpend, targetSpend: newAccList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      TargetServiceList.sort((a: any, b: any) => Number(b.currentSpend) - Number(a.currentSpend));

      TargetServiceList.forEach((data: any) => {
        const currentSpend = Number(data.currentSpend) || 0;
        const targetSpend = Number(data.targetSpend) || 0;
        const count = Number(data.count) || 0;
        const diff = targetSpend - currentSpend;
        const percent = currentSpend !== 0 ? diff / currentSpend : 0;

        TotalFreightCurrentSpend += currentSpend;

        tableArr.push(['', data.service, count, Number(currentSpend.toFixed(2)), Number(targetSpend.toFixed(2)), Number(diff.toFixed(2)), Number(percent.toFixed(4))]);
      });
      let customsDutySpend = 0;
      TargetAccessorialList.sort((a: any, b: any) => { return Number(b.currentSpend) - Number(a.currentSpend); });
      TargetAccessorialList.forEach((data: any) => {
        const currentSpend = Number(data.currentSpend) || 0;
        const targetSpend = Number(data.targetSpend) || 0;
        const count = Number(data.count) || 0;
        const diff = targetSpend - currentSpend;
        const percent = currentSpend !== 0 ? diff / currentSpend : 0;
        if (data.service != null && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"))
          customsDutySpend += Number(data.currentSpend) || 0;
        TotalAccCurrentSpend += currentSpend;
        tableArr.push(['', data.service, count, Number(currentSpend.toFixed(2)), Number(targetSpend.toFixed(2)), Number(diff.toFixed(2)), Number(percent.toFixed(4))]);
      });

      tableOneArr.push(['', 'CLIENT NAME', this.clientName])
      tableOneArr.push(['', 'Analysis Date:', this.datePipe.transform(date, "MM-dd-yyyy"), '', 'Total Estimated Increase:', '$' + this.setCommaQty(Number(scenariosDisplayed[index].totalSavings).toFixed(2))])
      tableOneArr.push(['', 'Invoice From Date:', this.selectedCarrier['dateRange'].split(' to ')[0], '', '% Increase Overall:',
        this.setCommaQty(Number(Number((Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)) - Number(this.totalCurrentSpend.toFixed(2))) / (Number(this.totalCurrentSpend.toFixed(2)) - Number(customsDutySpend.toFixed(2)))) * 100).toFixed(2)) + '%', '% Increase'])
      //this.setCommaQty(Number(scenariosDisplayed[index].totalSavingsPercent).toFixed(2)) + '%', '% Increase'])
      tableOneArr.push(['', 'Invoice To Date:', this.selectedCarrier['dateRange'].split(' to ')[1], '', 'Total Freight Increase:', '$' + this.setCommaQty(Number(TotalFreightSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalFreightSavings) / this.totalFreightSpend) * 100).toFixed(2)) + '%'])
      tableOneArr.push(['', 'Current Spend Carrier', this.selectedCarrier.carrierName, '', 'Total Accessorial Increase:', '$' + this.setCommaQty(Number(TotalAccessorialSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalAccessorialSavings) / (this.totalAccSpend - customsDutySpend)) * 100).toFixed(2)) + '%'])
      tableOneArr.push(['', 'Rerated Spend Carrier', (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') ? 'FedEx' : scenariosDisplayed[index].carrierName])

      tableOneArr.forEach(d => {
        let row: any = worksheetName.addRow(d);
        var typeVal = row['_cells'][1]['_value'].model.value;

        if (typeVal == "CLIENT NAME") {
          row.eachCell((cell: any, cellNum: any) => {
            if (cellNum != 1) {
              if (cellNum == 2) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
                cell.font = { family: 4, size: 11, bold: true, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 3) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
                cell.font = { family: 4, size: 11, bold: true, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 5) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 6 || cellNum == 7) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
            }
          })
        }
        else if (typeVal == "Invoice From Date:") {
          row.eachCell((cell: any, cellNum: any) => {
            if (cellNum != 1) {
              if (cellNum == 2) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 3) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 5) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 7) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 6 || cellNum == 7) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
            }
          })
        }
        else {
          row.eachCell((cell: any, cellNum: any) => {
            if (cellNum != 1) {
              if (cellNum == 2) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 3) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 5) {
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
              else if (cellNum == 6 || cellNum == 7) {
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              }
            }
          })
        }
      });

      worksheetName.addRow([]);
      worksheetName.addRow([]);
      var headerTableArr = [];
      headerTableArr.push(['', 'SERVICE/ CHARGE TYPE', 'VOLUME', this.selectedCarrier.year + ' CALCULATED SPEND', this.scenariosDisplayed[index].year + ' CALCULATED SPEND', 'PROJECTED INCREASE', 'PROJECTED INCREASE % ']);

      headerTableArr.forEach(d => {
        let row = worksheetName.addRow(d);
        row.height = 28.5;
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            if (cellNum == 7) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
            else if (cellNum == 2) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
          }
        });
      });

      var rowNumber = 10;
      tableArr.forEach((d: any) => {
        let row = worksheetName.addRow(d);
        rowNumber = rowNumber + 1;
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum == 2) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          else if (cellNum == 3) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 4 || cellNum == 5) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "0.00"??_);_(@_)';
          }
          else if (cellNum == 6) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "0.00"??_);_(@_)';
            // { formula: 'E' + rowNumber + '-D' + rowNumber };
          }
          else if (cellNum == 7) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
            cell.numFmt = '0.00%';
            // cell.value = { formula: 'IFERROR(F' + rowNumber + '/D' + rowNumber + ',0)' };
          }
        })
      });
      worksheetName.addRow([]);
      worksheetName.addRow([]);
      /* Total Row */
      var headerTableTotalArr = [];
      headerTableTotalArr.push(['', '', 'TOTAL:', Number(this.totalCurrentSpend.toFixed(2)), Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)),
        Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)) - Number(this.totalCurrentSpend.toFixed(2)),
        Number(Number((Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)) - Number(this.totalCurrentSpend.toFixed(2))) / (Number(this.totalCurrentSpend.toFixed(2)) - Number(customsDutySpend.toFixed(2)))) * 100).toFixed(2) + '%']);

      headerTableTotalArr.forEach(d => {
        let row = worksheetName.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum == 1 || cellNum == 2) {
          }
          else if (cellNum == 3) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
          }
          else if (cellNum == 4) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "0.00"??_);_(@_)';
            // cell.value = { formula: 'SUM(D11:D' + (rowNumber) + ')' };
            // cell.protection = { locked: false };
          }
          else if (cellNum == 5) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "0.00"??_);_(@_)';
            // cell.value = { formula: 'SUM(E11:E' + (rowNumber) + ')' };
            // cell.protection = { locked: false };
          }
          else if (cellNum == 6) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "0.00"??_);_(@_)';
            // cell.value = { formula: 'E' + (rowNumber + 3) + '-D' + (rowNumber + 3) };
            // cell.protection = { locked: false };
          }
          else if (cellNum == 7) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '0.00%';
            // cell.value = { formula: 'IFERROR(F' + (rowNumber + 3) + '/D' + (rowNumber + 3) + ',0)' };
            // cell.protection = { locked: false };
          }
        });
      });
    });

    const workbook1 = new Workbook();

    const newSummary = workbook1.addWorksheet('GRI Analysis', worksheetName);
    newSummary.model = worksheetName.model;

    const newDetail = workbook1.addWorksheet('GRI Detail', worksheet);
    newDetail.model = worksheet.model;

    workbook1.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
    this.closeLoading();
  }


  setCommaQty(eve: any) {
    if (eve != null) {
      return eve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      return '';
    }
  }

  GetExcelColumnName(columnNumber: any) {
    var dividend: number = columnNumber;
    var columnName: string = "";
    var modulo: number;

    modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = ((dividend - modulo) / 26);

    return columnName;
  }

  formatNumber(value: any) {
    return Number(value)?.toLocaleString('en-US') || value;
  }

  async sort(serviceType: any, columnName: any) {

    var services: any = [];
    var targetSavingsList = [];
    var iconsList: any;
    var targetList: any;
    var currentList: any;
    var dataSource: any;
    var defaultList: any;
    var minMaxList: any;

    if (serviceType == 'air') {
      currentList = "currentSavingsAirList";
      targetList = "dataSourceAirTarget";
      iconsList = "airSortIcons";
      dataSource = "dataSourceAir";
      defaultList = "distinctAirServices";
      minMaxList = "airMinMaxList";
    }
    else if (serviceType == 'ground') {
      iconsList = "groundSortIcons";
      targetList = "dataSourceGroundTarget";
      currentList = "currentSavingsGroundList";
      dataSource = "dataSourceGround";
      defaultList = "distinctGroundServices";
      minMaxList = "groundMinMaxList";
    }
    else if (serviceType == 'intl') {
      iconsList = "intlSortIcons";
      targetList = "dataSourceIntlTarget";
      currentList = "currentSavingsIntlList";
      dataSource = "dataSourceIntl";
      defaultList = "distinctIntlServices";
      minMaxList = "intlMinMaxList";
    }
    else if (serviceType == 'hwt') {
      iconsList = "hwtSortIcons";
      targetList = "dataSourceHWTTarget";
      currentList = "currentSavingsHWTList";
      dataSource = "dataSourceHWT";
      defaultList = "distinctHWTServices";
      minMaxList = "hwtMinMaxList";
    }
    else if (serviceType == 'acc') {
      iconsList = "accSortIcons";
      targetList = "dataSourceAccTarget";
      currentList = "currentSavingsAccList";
      dataSource = "dataSourceAcc";
      defaultList = "distinctAccServices";
      minMaxList = "accMinMaxList";
    }


    if ((this as any)[iconsList][columnName] == '') {// || ((this as any)[iconsList][columnName] == "fa fa-sort-amount-desc" && columnName != "service")

      (this as any)[iconsList] =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };

      for (let index in this.scenariosDisplayed) {
        this.scenariosDisplayed[index][iconsList] =
        {
          targetPercent: "",
          targetSpend: "",
          savingsAmount: "",
          targetSavingsPercent: ""
        };
      }

      (this as any)[iconsList][columnName] = "fa fa-sort-amount-asc";

      if (columnName == 'service' || columnName == 'weightRange') {
        if (serviceType == "ground" && columnName == 'weightRange') {
          (this as any)[currentList].sort((a: any, b: any) => {
            var firstValue;
            var secondValue;
            if (a[columnName].includes('-')) {
              firstValue = Number(a[columnName].split('-')[0]);
            }
            else {
              firstValue = Number(a[columnName].split('+')[0]);
            }
            if (b[columnName].includes('-')) {
              secondValue = Number(b[columnName].split('-')[0]);
            }
            else {
              secondValue = Number(b[columnName].split('+')[0]);
            }
            return firstValue - secondValue;

          });

        }
        else {
          (this as any)[currentList].sort((a: any, b: any) => a[columnName].localeCompare(b[columnName]));
        }
        if (serviceType == "ground") {
          if (columnName != 'service') {
            (this as any)[currentList].sort((a: any, b: any) => a['service'].localeCompare(b['service']));
          }
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service + element.weightRange)
          });

          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service)
          });
        }
        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          targetSavingsList = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);
        }
      }
      else if (columnName == 'currentPercent') {

        (this as any)[minMaxList].sort((a: any, b: any) => a.disMin.localeCompare(b.disMin));
        if (serviceType == "ground") {
          (this as any)[minMaxList].sort((a: any, b: any) => a['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '').localeCompare(b['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '')));
          (this as any)[minMaxList].sort((a: any, b: any) => a['name'].localeCompare(b['name']));
        }

        (this as any)[minMaxList].forEach((element: any) => {
          services.push(element.service)
        });

        if (serviceType == "ground") {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));

        }

        for (let index = 0; index < this.scenariosDisplayed.length; index++) {

          targetSavingsList = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);
        }
      }
      else {
        var emptyList = (this as any)[currentList].filter((data: any) => data.currentSpend.toString().length == 0);
        for (let row = 0; row < emptyList.length; row++) {
          var index = (this as any)[currentList].findIndex((data: any) => data == emptyList[row]);
          (this as any)[currentList][index][columnName] = 9999999999999999;
        }
        (this as any)[currentList].sort((a: any, b: any) => a[columnName] - b[columnName]);

        if (serviceType == "ground") {
          var emptyObject
          (this as any)[currentList].sort((a: any, b: any) => a['service'].localeCompare(b['service']));
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service + element.weightRange)
          });

          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service)
          });
        }

        emptyList = (this as any)[currentList].filter((data: any) => data.currentSpend == 9999999999999999);
        for (let row = 0; row < emptyList.length; row++) {
          var index = (this as any)[currentList].findIndex((data: any) => data == emptyList[row]);
          (this as any)[currentList][index][columnName] = '';
        }
        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          targetSavingsList = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);
        }
      }
      (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);
    }
    else if ((this as any)[iconsList][columnName] == 'fa fa-sort-amount-asc') {

      (this as any)[iconsList] =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };

      for (let index in this.scenariosDisplayed) {
        this.scenariosDisplayed[index][iconsList] =
        {
          targetPercent: "",
          targetSpend: "",
          savingsAmount: "",
          targetSavingsPercent: ""
        };
      }
      (this as any)[iconsList][columnName] = "fa fa-sort-amount-desc";
      if (columnName == 'service' || columnName == 'weightRange') {
        if (serviceType == "ground" && columnName == 'weightRange') {
          (this as any)[currentList].sort((a: any, b: any) => {
            var firstValue;
            var secondValue;
            if (a[columnName].includes('-')) {
              firstValue = Number(a[columnName].split('-')[0]);
            }
            else {
              firstValue = Number(a[columnName].split('+')[0]);
            }
            if (b[columnName].includes('-')) {
              secondValue = Number(b[columnName].split('-')[0]);
            }
            else {
              secondValue = Number(b[columnName].split('+')[0]);
            }
            return secondValue - firstValue;
          });
        }
        else {
          (this as any)[currentList].sort((a: any, b: any) => b[columnName].localeCompare(a[columnName]));
        }
        if (serviceType == "ground") {
          if (columnName != 'service') {
            (this as any)[currentList].sort((a: any, b: any) => a['service'].localeCompare(b['service']));
          }
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service + element.weightRange)
          });
          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service)
          });
        }
        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          targetSavingsList = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);;
        }
      }
      else if (columnName == 'currentPercent') {
        (this as any)[minMaxList].sort((a: any, b: any) => b.disMin.localeCompare(a.disMin));
        if (serviceType == "ground") {
          (this as any)[minMaxList].sort((a: any, b: any) => a['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '').localeCompare(b['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '')));
          (this as any)[minMaxList].sort((a: any, b: any) => a['name'].localeCompare(b['name']));
        }
        (this as any)[minMaxList].forEach((element: any) => {
          services.push(element.service)
        });
        if (serviceType == "ground") {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }
        (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);
        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          targetSavingsList = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);
        }
      }
      else {
        var emptyList = (this as any)[currentList].filter((data: any) => data.currentSpend.toString().length == 0);
        for (let row = 0; row < emptyList.length; row++) {
          var index = (this as any)[currentList].findIndex((data: any) => data == emptyList[row]);
          (this as any)[currentList][index][columnName] = -1;
        }
        (this as any)[currentList].sort((a: any, b: any) => b[columnName] - a[columnName]);
        if (serviceType == "ground") {
          (this as any)[currentList].sort((a: any, b: any) => a['service'].localeCompare(b['service']));
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service + element.weightRange)
          });
          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          (this as any)[currentList].forEach((element: any) => {
            services.push(element.service)
          });
        }
        emptyList = (this as any)[currentList].filter((data: any) => data.currentSpend == -1);
        for (let row = 0; row < emptyList.length; row++) {
          var index = (this as any)[currentList].findIndex((data: any) => data == emptyList[row]);
          (this as any)[currentList][index][columnName] = '';
        }
        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          targetSavingsList = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);
        }
      }
      (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);
    }
    else if ((this as any)[iconsList][columnName] == "fa fa-sort-amount-desc") {//&& columnName == "service"

      (this as any)[iconsList] =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };

      for (let index in this.scenariosDisplayed) {
        this.scenariosDisplayed[index][iconsList] =
        {
          targetPercent: "",
          targetSpend: "",
          savingsAmount: "",
          targetSavingsPercent: ""
        };
      }

      if (serviceType == "ground") {

        services = this.distinctGroundServicesWithWeight;
        (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        this.spans = [];
        await this.getInitRowSpan();
      }
      else {
        services = (this as any)[defaultList];
        if (serviceType != "acc") {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }
        else {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
        }
      }

      if (serviceType != "acc") {
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
      }
      else {
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
      }

      for (let index = 0; index < this.scenariosDisplayed.length; index++) {
        targetSavingsList = this.scenariosDisplayed[index][targetList].data;
        if (serviceType == "ground") {
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        }
        else {
          if (serviceType != "acc") {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          else {
            targetSavingsList.sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
          }
        }

        if (serviceType != "acc") {
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }
        else {
          this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
        }
        this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList);;
      }

      (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);
    }
  }

  async sortTarget(serviceType: any, columnName: any, scenarioNumber: any) {

    var services: any = [];
    var targetSavingsList = [];
    var targetSavingsList2 = [];
    var iconsList: any;
    var targetList: any;
    var currentList: any;
    var dataSource: any;
    var defaultList: any;
    var minMaxList: any;

    if (serviceType == 'air') {
      iconsList = "airSortIcons";
      targetList = "dataSourceAirTarget";
      currentList = "currentSavingsAirList";
      dataSource = "dataSourceAir";
      defaultList = "distinctAirServices";
      minMaxList = "airMinMaxList";
    }
    else if (serviceType == 'ground') {
      iconsList = "groundSortIcons";
      targetList = "dataSourceGroundTarget";
      currentList = "currentSavingsGroundList";
      dataSource = "dataSourceGround";
      defaultList = "distinctGroundServices";
      minMaxList = "groundMinMaxList";
    }
    else if (serviceType == 'intl') {
      iconsList = "intlSortIcons";
      targetList = "dataSourceIntlTarget";
      currentList = "currentSavingsIntlList";
      dataSource = "dataSourceIntl";
      defaultList = "distinctIntlServices";
      minMaxList = "intlMinMaxList";
    }
    else if (serviceType == 'hwt') {
      iconsList = "hwtSortIcons";
      targetList = "dataSourceHWTTarget";
      currentList = "currentSavingsHWTList";
      dataSource = "dataSourceHWT";
      defaultList = "distinctHWTServices";
      minMaxList = "hwtMinMaxList";
    }
    else if (serviceType == 'acc') {
      iconsList = "accSortIcons";
      targetList = "dataSourceAccTarget";
      currentList = "currentSavingsAccList";
      dataSource = "dataSourceAcc";
      defaultList = "distinctAccServices";
      minMaxList = "accMinMaxList";
    }

    targetSavingsList = this.scenariosDisplayed[scenarioNumber][targetList].data;

    if (this.scenariosDisplayed[scenarioNumber][iconsList][columnName] == "") {//|| (this.scenariosDisplayed[scenarioNumber][iconsList][columnName] == "fa fa-sort-amount-desc" && columnName != "service")
      (this as any)[iconsList] =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      for (let index in this.scenariosDisplayed) {
        this.scenariosDisplayed[index][iconsList] =
        {
          targetPercent: "",
          targetSpend: "",
          savingsAmount: "",
          targetSavingsPercent: ""
        };
      }

      this.scenariosDisplayed[scenarioNumber][iconsList][columnName] = "fa fa-sort-amount-asc";
      if (columnName == 'targetPercent') {

        this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => a.disMin.localeCompare(b.disMin));
        if (serviceType == "ground") {
          this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => a['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '').localeCompare(b['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '')));
          this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => a['name'].localeCompare(b['name']));
        }

        this.scenariosDisplayed[scenarioNumber][minMaxList].forEach((element: any) => {
          services.push(element.service)
        });
        if (serviceType == "ground") {
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.scenariosDisplayed[scenarioNumber].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        this.scenariosDisplayed[scenarioNumber][targetList] = new MatTableDataSource(targetSavingsList);;
        (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);

        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          if (index != scenarioNumber) {
            targetSavingsList2 = this.scenariosDisplayed[index][targetList].data;
            if (serviceType == "ground") {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
              this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
            }
            else {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            }
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList2);
          }
        }
      }
      else {
        var rowNumber;
        var emptyList = targetSavingsList.filter((data: any) => data[columnName].toString() == '');
        for (let row = 0; row < emptyList.length; row++) {
          rowNumber = targetSavingsList.findIndex((data: any) => data == emptyList[row]);
          targetSavingsList[rowNumber][columnName] = 9999999999999999;
        }

        targetSavingsList.sort((a: any, b: any) => a[columnName] - b[columnName]);
        if (serviceType == "ground") {
          targetSavingsList.sort((a: any, b: any) => a['service'].localeCompare(b['service']));
          targetSavingsList.forEach((element: any) => {
            services.push(element.service + element.weightRange);
          });
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          emptyList = targetSavingsList.filter((data: any) => data[columnName] == 9999999999999999);
          for (let row = 0; row < emptyList.length; row++) {
            rowNumber = targetSavingsList.findIndex((data: any) => data == emptyList[row]);
            targetSavingsList[rowNumber][columnName] = '';
          }
          this.scenariosDisplayed[scenarioNumber].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        }
        else {
          targetSavingsList.forEach((element: any) => {
            services.push(element.service)
          });
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }

        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        this.spans = [];
        await this.getInitRowSpan();
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));

        this.scenariosDisplayed[scenarioNumber][targetList] = new MatTableDataSource(targetSavingsList);
        (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);

        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          if (index != scenarioNumber) {

            targetSavingsList2 = this.scenariosDisplayed[index][targetList].data;

            emptyList = targetSavingsList2.filter((data: any) => data[columnName].toString() == '');
            for (let row = 0; row < emptyList.length; row++) {
              rowNumber = targetSavingsList2.findIndex((data: any) => data == emptyList[row]);
              targetSavingsList2[rowNumber][columnName] = 9999999999999999;
            }
            if (serviceType == "ground") {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
              emptyList = targetSavingsList2.filter((data: any) => data[columnName] == 9999999999999999);
              for (let row = 0; row < emptyList.length; row++) {
                rowNumber = targetSavingsList2.findIndex((data: any) => data == emptyList[row]);
                targetSavingsList2[rowNumber][columnName] = '';
              }
              this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
            }
            else {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            }
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList2);
          }
        }
      }
    }
    else if (this.scenariosDisplayed[scenarioNumber][iconsList][columnName] == 'fa fa-sort-amount-asc') {
      (this as any)[iconsList] =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };
      for (let index in this.scenariosDisplayed) {
        this.scenariosDisplayed[index][iconsList] =
        {
          targetPercent: "",
          targetSpend: "",
          savingsAmount: "",
          targetSavingsPercent: ""
        };
      }
      this.scenariosDisplayed[scenarioNumber][iconsList][columnName] = "fa fa-sort-amount-desc";

      if (columnName == 'targetPercent') {

        this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => b.disMin.localeCompare(a.disMin));
        if (serviceType == "ground") {
          this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => a['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '').localeCompare(b['service'].replace(/[0-9]/g, '').replace('-', '').replace('+', '')));
          this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => a['name'].localeCompare(b['name']));
        }

        this.scenariosDisplayed[scenarioNumber][minMaxList].forEach((element: any) => {
          services.push(element.service)
        });
        if (serviceType == "ground") {
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.scenariosDisplayed[scenarioNumber].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
          this.spans = [];
          await this.getInitRowSpan();
        }
        else {
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }

        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        this.scenariosDisplayed[scenarioNumber][targetList] = new MatTableDataSource(targetSavingsList);
        (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);

        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          if (index != scenarioNumber) {
            targetSavingsList2 = this.scenariosDisplayed[index][targetList].data;
            if (serviceType == "ground") {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
              this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
            }
            else {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            }
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList2);
          }
        }
      }
      else {
        var rowNumber;
        var emptyList = targetSavingsList.filter((data: any) => data[columnName].toString() == '');
        for (let row = 0; row < emptyList.length; row++) {
          rowNumber = targetSavingsList.findIndex((data: any) => data == emptyList[row]);
          targetSavingsList[rowNumber][columnName] = -9999999999999999;
        }
        targetSavingsList.sort((a: any, b: any) => b[columnName] - a[columnName]);
        if (serviceType == "ground") {
          targetSavingsList.sort((a: any, b: any) => a['service'].localeCompare(b['service']));
          targetSavingsList.forEach((element: any) => {
            services.push(element.service + element.weightRange);
          });
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
          emptyList = targetSavingsList.filter((data: any) => data[columnName] == -9999999999999999);
          for (let row = 0; row < emptyList.length; row++) {
            rowNumber = targetSavingsList.findIndex((data: any) => data == emptyList[row]);
            targetSavingsList[rowNumber][columnName] = '';
          }
          this.scenariosDisplayed[scenarioNumber].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        }
        else {
          targetSavingsList.forEach((element: any) => {
            services.push(element.service)
          });
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }

        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        this.spans = [];
        await this.getInitRowSpan();

        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));

        this.scenariosDisplayed[scenarioNumber][targetList] = new MatTableDataSource(targetSavingsList);
        (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);

        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          if (index != scenarioNumber) {
            targetSavingsList2 = this.scenariosDisplayed[index][targetList].data;

            var emptyList = targetSavingsList2.filter((data: any) => data[columnName].toString() == '');
            for (let row = 0; row < emptyList.length; row++) {
              rowNumber = targetSavingsList2.findIndex((data: any) => data == emptyList[row]);
              targetSavingsList2[rowNumber][columnName] = -9999999999999999;
            }
            if (serviceType == "ground") {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
              var emptyList = targetSavingsList2.filter((data: any) => data[columnName].toString() == -9999999999999999);
              for (let row = 0; row < emptyList.length; row++) {
                rowNumber = targetSavingsList2.findIndex((data: any) => data == emptyList[row]);
                targetSavingsList2[rowNumber][columnName] = '';
              }
              this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
            }
            else {
              targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            }
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList2);
          }
        }
      }
    }
    else if (this.scenariosDisplayed[scenarioNumber][iconsList][columnName] == 'fa fa-sort-amount-desc') {// && columnName == "service"

      (this as any)[iconsList] =
      {
        service: "",
        weightRange: "",
        count: "",
        currentPercent: "",
        currentSpend: ""
      };

      for (let index in this.scenariosDisplayed) {
        this.scenariosDisplayed[index][iconsList] =
        {
          targetPercent: "",
          targetSpend: "",
          savingsAmount: "",
          targetSavingsPercent: ""
        };
      }

      if (serviceType == "ground") {
        services = this.distinctGroundServicesWithWeight;
        (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
        this.currentSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
        this.scenariosDisplayed[scenarioNumber].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
        this.spans = [];
        await this.getInitRowSpan();
      }
      else {
        services = (this as any)[defaultList];
        if (serviceType == "acc") {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        }
        else {
          (this as any)[currentList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
          targetSavingsList.sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
        }
      }

      if (serviceType == "acc") {
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
        this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
      }
      else {
        (this as any)[minMaxList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
        this.scenariosDisplayed[scenarioNumber][minMaxList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
      }

      (this as any)[dataSource] = new MatTableDataSource((this as any)[currentList]);
      this.scenariosDisplayed[scenarioNumber][targetList] = new MatTableDataSource(targetSavingsList);

      for (let index = 0; index < this.scenariosDisplayed.length; index++) {
        if (index != scenarioNumber) {
          targetSavingsList2 = this.scenariosDisplayed[index][targetList].data;
          if (serviceType == "ground") {
            targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service + a.weightRange) - services.indexOf(b.service + b.weightRange));
            this.scenariosDisplayed[index].targetSavingsGroundSubTotalList.sort((a: any, b: any) => services.indexOf(a.serviceName) - services.indexOf(b.serviceName));
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }
          else if (serviceType == "acc") {
            targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.sortService) - services.indexOf(b.sortService));
          }
          else {
            targetSavingsList2.sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
            this.scenariosDisplayed[index][minMaxList].sort((a: any, b: any) => services.indexOf(a.service) - services.indexOf(b.service));
          }

          this.scenariosDisplayed[index][targetList] = new MatTableDataSource(targetSavingsList2);
        }
      }
    }

  }

  async setMinMax(type: any) {

    var minMaxList = "";
    var serviceList = "";
    var distinctList = "";

    if (type == 'air') {
      minMaxList = "airMinMaxList";
      serviceList = "freightCurrentDetails";
      distinctList = "distinctAirServices";
    }
    else if (type == 'ground') {
      minMaxList = "groundMinMaxList";
      serviceList = "freightCurrentDetails";
      distinctList = "distinctGroundServicesWithWeight";
    }
    else if (type == 'intl') {
      minMaxList = "intlMinMaxList";
      serviceList = "freightCurrentDetails";
      distinctList = "distinctIntlServices";
    }
    else if (type == 'hwt') {
      minMaxList = "hwtMinMaxList";
      serviceList = "freightCurrentDetails";
      distinctList = "distinctHWTServices";
    }
    else if (type == 'acc') {
      minMaxList = "accMinMaxList";
      serviceList = "accessorialCurrentDetails";
      distinctList = "distinctAccServices";
    }

    (this as any)[minMaxList] = [];
    var services = await (this as any)[serviceList];
    var groundServices = [];
    let discountType = '$';
    for (let index = 0; index < (this as any)[distinctList].length; index++) {


      var filteredService = await this.getFilteredData(services, type, (this as any)[distinctList][index]);

      var minMax = {
        disMin: '999999999999',
        disMax: '-99999999999',
      };

      if (filteredService[0] != undefined) {

        for (let row = 0; row < filteredService.length; row++) {
          if (filteredService[row].currentPercent == '') {
            minMax.disMin = "0.00";
            minMax.disMax = "0.00";
          }
          else {
            if (Number(minMax.disMin) >= Number(filteredService[row].currentPercent)) {
              minMax.disMin = Number(filteredService[row].currentPercent).toFixed(2);
            }
            if (Number(minMax.disMax) <= Number(filteredService[row].currentPercent)) {
              minMax.disMax = Number(filteredService[row].currentPercent).toFixed(2);
              discountType = filteredService[row].currentPercentType;
            }
          }
        }

        (this as any)[minMaxList][index] = {
          service: (this as any)[distinctList][index],
          sortService: (this as any)[distinctList][index],
          serviceName: (type == "acc") ? filteredService[0].serviceName : '',
          name: (filteredService[0] != undefined) ? (filteredService[0].service) : ((this as any)[distinctList][index].replace('Sub Total', '')),
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          discountType: (type == "acc") ? ((discountType == '$') ? '$' : '%') : '',
          serviceType: (type == "acc") ? 'All' : '',
          ratesheetGrouping: '',
          accServiceName: (type == "acc") ? this.distinctAccServiceName[index] : '',
          weightFrom: (type == "ground" && filteredService[0] != undefined) ? (((this as any)[distinctList][index].includes('-')) ? ((this as any)[distinctList][index].replace(filteredService[0].service, '').split('-')[0]) : (151)) : '',
          weightTo: (type == "ground" && filteredService[0] != undefined) ? ((this as any)[distinctList][index].includes('-')) ? ((this as any)[distinctList][index].split('-').pop()) : (1000) : '',
        }
      }
      else {

        if (type == 'ground' && !(this as any)[distinctList][index].includes('Sub Total')) {

          let weightFrom = this.currentSavingsGroundList[index].weightFrom;
          let weightTo = this.currentSavingsGroundList[index].weightTo;
          // let filteredData = this.viewDiscountsList.filter((data:any) => Number(weightFrom) >= data.weightFrom && Number(weightTo) <= data.weightTo);
          let filteredData = this.groundProposalList.filter((data: any) => data.service == this.currentSavingsGroundList[index].newService && Number(weightFrom) >= data.weightFrom && Number(weightTo) <= data.weightTo);

          if (filteredData.length > 0) {
            filteredData.forEach((groundData: any) => {
              if (groundData['targetDis'] == '') {
                minMax.disMin = "0.00";
                minMax.disMax = "0.00";
              }
              else {
                if (Number(minMax.disMin) >= Number(groundData['targetDis'])) {
                  minMax.disMin = Number(groundData['targetDis']).toFixed(2);
                }
                if (Number(minMax.disMax) <= Number(groundData['targetDis'])) {
                  minMax.disMax = Number(groundData['targetDis']).toFixed(2);
                }
              }
            });
          }
          else {
            minMax.disMin = "0.00";
            minMax.disMax = "0.00";
          }
        }
        else {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        (this as any)[minMaxList][index] = {
          service: (this as any)[distinctList][index],
          sortService: (this as any)[distinctList][index],
          name: (type != 'ground') ? (this as any)[distinctList][index] : ((this as any)[distinctList][index].replace(this.distinctWeights[index], '').replace('Sub Total', '')),
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          serviceType: (type == "acc") ? 'All' : '',
          discountType: (type == "acc") ? '%' : '',
          ratesheetGrouping: '',
          accServiceName: (type == "acc") ? this.distinctAccServiceName[index] : '',
          weightFrom: (type == "ground") ? ((this.distinctWeights[index].includes('-')) ? (this.distinctWeights[index].split('-')[0]) : (151)) : '',
          weightTo: (type == "ground") ? (this.distinctWeights[index].includes('-')) ? (this.distinctWeights[index].split('-').pop()) : (1000) : '',
        }
      }
    }
  }



  async setMinMaxTarget(scenarioIndex: any, type: any) {

    var minMaxList = "";
    var serviceList = "";
    var distinctList = "";
    var tableList = "";

    if (type == 'air') {
      minMaxList = "airMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctAirServices";
    }
    else if (type == 'ground') {
      minMaxList = "groundMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctGroundServicesWithWeight";
    }
    else if (type == 'intl') {
      minMaxList = "intlMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctIntlServices";
    }
    else if (type == 'hwt') {
      minMaxList = "hwtMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctHWTServices";
    }
    else if (type == 'acc') {
      minMaxList = "accMinMaxList";
      serviceList = "accessorialTargetDetails";
      distinctList = "distinctAccServices";
    }

    this.scenariosDisplayed[scenarioIndex][minMaxList] = [];
    var services = await this.scenariosDisplayed[scenarioIndex][serviceList];
    let groundServices = [];
    let discountType = '$'
    for (let index = 0; index < (this as any)[distinctList].length; index++) {

      var filteredService = await this.getFilteredData(services, type, (this as any)[distinctList][index]);

      var minMax = {
        disMin: '999999999999',
        disMax: '-99999999999',
      };

      if (filteredService[0] != undefined) {

        if (filteredService.length == 0) {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        for (let row = 0; row < filteredService.length; row++) {
          if (Number(minMax.disMin) >= Number(filteredService[row].targetPercent)) {
            minMax.disMin = Number(filteredService[row].targetPercent).toFixed(2);
          }
          if (Number(minMax.disMax) <= Number(filteredService[row].targetPercent)) {
            minMax.disMax = Number(filteredService[row].targetPercent).toFixed(2);
            discountType = filteredService[row].targetPercentType;
          }
        }

        this.scenariosDisplayed[scenarioIndex][minMaxList][index] = {
          service: (this as any)[distinctList][index],
          sortService: (this as any)[distinctList][index],
          serviceType: (type == "acc") ? 'All' : '',
          serviceName: (type == "acc") ? filteredService[0].serviceName : '',
          name: (filteredService[0] != undefined) ? (filteredService[0].service) : ((this as any)[distinctList][index].replace('Sub Total', '')),
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          weightFrom: (type == "ground" && filteredService[0] != undefined) ? (((this as any)[distinctList][index].includes('-')) ? ((this as any)[distinctList][index].replace(filteredService[0].service, '').split('-')[0]) : (151)) : '',
          weightTo: (type == "ground" && filteredService[0] != undefined) ? ((this as any)[distinctList][index].includes('-')) ? ((this as any)[distinctList][index].split('-').pop()) : (1000) : '',
          discountType: (type == "acc") ? ((discountType == '$') ? '$' : '%') : '',
          ratesheetGrouping: '',
          accServiceName: (type == "acc") ? this.distinctAccServiceName[index] : ''
        }
      }
      else {

        if (type == 'ground' && !(this as any)[distinctList][index].includes('Sub Total')) {

          let weightFrom = this.currentSavingsGroundList[index].weightFrom;
          let weightTo = this.currentSavingsGroundList[index].weightTo;
          let filteredData = this.scenariosDisplayed[scenarioIndex].groundProposalList.filter((data: any) => data.service == this.currentSavingsGroundList[index].newService && Number(weightFrom) >= data.weightFrom && Number(weightTo) <= data.weightTo);

          if (filteredData.length > 0) {
            filteredData.forEach((groundData: any) => {
              if (groundData['targetDis'] == '') {
                minMax.disMin = "0.00";
                minMax.disMax = "0.00";
              }
              else {
                if (Number(minMax.disMin) >= Number(groundData['targetDis'])) {
                  minMax.disMin = Number(groundData['targetDis']).toFixed(2);
                }
                if (Number(minMax.disMax) <= Number(groundData['targetDis'])) {
                  minMax.disMax = Number(groundData['targetDis']).toFixed(2);
                }
              }
            });
          }
          else {
            minMax.disMin = "0.00";
            minMax.disMax = "0.00";
          }
        }
        else {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        this.scenariosDisplayed[scenarioIndex][minMaxList][index] = {
          service: (this as any)[distinctList][index],
          sortService: (this as any)[distinctList][index],
          serviceType: (type == "acc") ? 'All' : '',
          serviceName: (type == "acc") ? (this as any)[distinctList][index] : '',
          name: (type != 'ground') ? (this as any)[distinctList][index] : this.currentSavingsGroundList[index].service,
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          weightFrom: (type == "ground") ? ((this.distinctWeights[index].includes('-')) ? (this.distinctWeights[index].split('-')[0]) : (151)) : '',
          weightTo: (type == "ground") ? (this.distinctWeights[index].includes('-')) ? (this.distinctWeights[index].split('-').pop()) : (1000) : '',
          discountType: (type == "acc") ? '%' : '',
          ratesheetGrouping: '',
          accServiceName: (type == "acc") ? this.distinctAccServiceName[index] : ''
        }
      }
    }
  }




  async setMinMaxTargetExcel(scenarioIndex: any, type: any) {

    var minMaxList = "";
    var serviceList = "";
    var distinctList = "";
    var tableList = "";

    if (type == 'air') {
      minMaxList = "airMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctAirServices";
    }
    else if (type == 'ground') {
      minMaxList = "groundMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctGroundServicesWithWeight";
    }
    else if (type == 'intl') {
      minMaxList = "intlMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctIntlServices";
    }
    else if (type == 'hwt') {
      minMaxList = "hwtMinMaxList";
      serviceList = "freightTargetDetails";
      distinctList = "distinctHWTServices";
    }
    else if (type == 'acc') {
      minMaxList = "accMinMaxList";
      serviceList = "accessorialTargetDetails";
      distinctList = "distinctAccServices";
    }

    this.totalScenarios[scenarioIndex][minMaxList] = [];
    var services = await this.totalScenarios[scenarioIndex][serviceList];
    let groundServices = [];
    let discountType = '$';
    for (let index = 0; index < (this as any)[distinctList].length; index++) {

      var filteredService = await this.getFilteredData(services, type, (this as any)[distinctList][index]);

      var minMax = {
        disMin: '999999999999',
        disMax: '-99999999999',
      };

      if (filteredService[0] != undefined) {
        if (filteredService.length == 0) {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        for (let row = 0; row < filteredService.length; row++) {
          if (Number(minMax.disMin) >= Number(filteredService[row].targetPercent)) {
            minMax.disMin = Number(filteredService[row].targetPercent).toFixed(2);
          }
          if (Number(minMax.disMax) <= Number(filteredService[row].targetPercent)) {
            minMax.disMax = Number(filteredService[row].targetPercent).toFixed(2);
            discountType = filteredService[row].targetPercentType;
          }
        }

        this.totalScenarios[scenarioIndex][minMaxList][index] = {
          service: (this as any)[distinctList][index],
          serviceName: (type == "acc") ? filteredService[0].serviceName : '',
          name: (filteredService[0] != undefined) ? (filteredService[0].service) : ((this as any)[distinctList][index].replace('Sub Total', '')),
          serviceType: (type == "acc") ? 'all' : '',
          discountType: (type == "acc") ? ((discountType == '$') ? '$' : '%') : '',
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          weightFrom: (type == "ground" && filteredService[0] != undefined) ? (((this as any)[distinctList][index].includes('-')) ? ((this as any)[distinctList][index].split('-')[0].replace(filteredService[0].service, '')) : (151)) : '',
          weightTo: (type == "ground" && filteredService[0] != undefined) ? ((this as any)[distinctList][index].includes('-')) ? ((this as any)[distinctList][index].split('-').pop()) : (1000) : ''
        }
      }
      else {

        if (type == 'ground' && !(this as any)[distinctList][index].includes('Sub Total')) {

          let weightFrom = this.currentSavingsGroundList[index].weightFrom;
          let weightTo = this.currentSavingsGroundList[index].weightTo;
          let filteredData = this.totalScenarios[scenarioIndex].groundProposalList.filter((data: any) => data.service == this.currentSavingsGroundList[index].newService && Number(weightFrom) >= data.weightFrom && Number(weightTo) <= data.weightTo);

          if (filteredData.length > 0) {
            filteredData.forEach((groundData: any) => {
              if (groundData['targetDis'] == '') {
                minMax.disMin = "0.00";
                minMax.disMax = "0.00";
              }
              else {
                if (Number(minMax.disMin) >= Number(groundData['targetDis'])) {
                  minMax.disMin = Number(groundData['targetDis']).toFixed(2);
                }
                if (Number(minMax.disMax) <= Number(groundData['targetDis'])) {
                  minMax.disMax = Number(groundData['targetDis']).toFixed(2);
                }
              }
            });
          }
          else {
            minMax.disMin = "0.00";
            minMax.disMax = "0.00";
          }
        }
        else {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        this.totalScenarios[scenarioIndex][minMaxList][index] = {
          service: (this as any)[distinctList][index],
          serviceName: (type == "acc" && filteredService[0] != undefined) ? filteredService[0].serviceName : '',
          serviceType: (type == "acc") ? 'all' : '',
          name: (this as any)[distinctList][index],
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          weightFrom: '',
          weightTo: ''
        }
      }
    }
  }

  async setNetAmountMinMax() {

    this.netAmountMinMaxList = [];
    var services = await this.minimumReductionList;

    for (let index = 0; index < this.distinctMinServices.length; index++) {


      var filteredService = [];
      var localWeightRange = "";

      filteredService = services.filter((data: any) => data.service == this.distinctMinServices[index]);

      if (filteredService[0] != undefined) {

        var minMax = {
          currentMin: '999999999999',
          currentMax: '-99999999999',
          target1Min: '999999999999',
          target1Max: '-99999999999',
          target2Min: '999999999999',
          target2Max: '-99999999999',
        };

        for (let row = 0; row < filteredService.length; row++) {
          if (filteredService[row].currentMin == '') {
            minMax.currentMin = '0.00';
            minMax.currentMax = '0.00';
          }
          else {
            if (Number(minMax.currentMin.toString().replace('$', '').replace('%', '')) >= Number(filteredService[row].currentMin.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.currentMin = filteredService[row].currentMin.replaceAll(' ', '');
            }
            if (Number(minMax.currentMax.toString().replace('$', '').replace('%', '')) <= Number(filteredService[row].currentMin.replace('$', '').replace('%', '').replace(' ', ''))) {
              minMax.currentMax = filteredService[row].currentMin.replaceAll(' ', '');
            }
          }
          if (filteredService[row].targetMin1 == '') {
            minMax.target1Min = '0.00';
            minMax.target1Max = '0.00';
          }
          else {
            if (Number(minMax.target1Min.toString().replace('$', '').replace('%', '')) >= Number(filteredService[row].targetMin1.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.target1Min = filteredService[row].targetMin1.replaceAll(' ', '');
            }
            if (Number(minMax.target1Max.toString().replace('$', '').replace('%', '')) <= Number(filteredService[row].targetMin1.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.target1Max = filteredService[row].targetMin1.replaceAll(' ', '');
            }
          }
          if (filteredService[row].targetMin2 == '') {
            minMax.target2Min = '0.00';
            minMax.target2Max = '0.00';
          }
          else {
            if (Number(minMax.target2Min.toString().replace('$', '').replace('%', '')) >= Number(filteredService[row].targetMin2.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.target2Min = filteredService[row].targetMin2.replaceAll(' ', '');
            }
            if (Number(minMax.target2Max.toString().replace('$', '').replace('%', '')) <= Number(filteredService[row].targetMin2.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.target2Max = filteredService[row].targetMin2.replaceAll(' ', '');
            }
          }
        }

        this.netAmountMinMaxList[index] = {
          service: filteredService[0].service.toLowerCase().includes('international') ? filteredService[0].service : filteredService[0].displayName,
          serviceType: filteredService[0].serviceType,
          currentMin: minMax.currentMin,
          currentMax: minMax.currentMax,
          target1Min: minMax.target1Min,
          target1Max: minMax.target1Max,
          target2Min: minMax.target2Min,
          target2Max: minMax.target2Max,
        }
      }
    }
  }

  async setNetAmountMinMaxExcel(minReductionList: any[]) {

    var netAmountMinMaxList = [];
    var services = await minReductionList;

    for (let index = 0; index < this.distinctMinServices.length; index++) {

      var filteredService = [];
      var localWeightRange = "";

      filteredService = services.filter((data: any) => data.service == this.distinctMinServices[index]);

      if (filteredService[0] != undefined) {

        var minMax = {
          targetMin: '999999999999',
          targetMax: '-99999999999',
        };

        for (let row = 0; row < filteredService.length; row++) {

          if (filteredService[row].targetMin1 == '') {
            minMax.targetMin = '0.00';
            minMax.targetMax = '0.00';
          }
          else {
            if (Number(minMax.targetMin.toString().replace('$', '').replace('%', '')) >= Number(filteredService[row].targetMin1.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.targetMin = filteredService[row].targetMin1.replaceAll(' ', '');
            }
            if (Number(minMax.targetMax.toString().replace('$', '').replace('%', '')) <= Number(filteredService[row].targetMin1.replace('$', '').replace('%', '').replaceAll(' ', ''))) {
              minMax.targetMax = filteredService[row].targetMin1.replaceAll(' ', '');
            }
          }
        }

        netAmountMinMaxList[index] = {
          targetMin: minMax.targetMin,
          targetMax: minMax.targetMax,
        }
      }
    }
    return netAmountMinMaxList;
  }

  storePreviousMin(event: any) {

    if (event.target.value.includes('-')) {
      event.target.value = '';
    }
    event.target.value = event.target.value.replaceAll(' ', '');

    var keyCode;
    keyCode = event.keyCode;

    if (event.target.value.includes(".")) {
      this.previousWholeNumber = event.target.value.split(".")[0].replace('$', '').replace('%', '');
      if (event.target.value.split(".").pop().replace('$', '').replace('%', '').length < 3) {
        this.previousDecimalNumber = event.target.value.split(".").pop().replace('$', '').replace('%', '');
      }
    }

    if (!(keyCode >= 65 && keyCode <= 90)) {
      if (event.target.value.includes(".") && (keyCode == 110 || keyCode == 190)) {
        return false;
      }
      else if (event.target.value.includes("%") && (event.key == "%" || event.key == "$")) {
        return false;
      }
      else if (event.target.value.includes("$") && (event.key == "%" || event.key == "$")) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  validateMin(event: any) {
    if (event.target.value.includes('-')) {
      event.target.value = '';
    }
    let discount = Number(event.target.value.replace('%', '').replace('$', ''));
    if (discount.toString() == 'NaN') {
      return;
    }
    let wholeNumber;
    let decimalNumber;
    if (event.target.value.includes(".")) {
      wholeNumber = event.target.value.split(".")[0];
      decimalNumber = event.target.value.split(".").pop().replace('%', '').replace('$', '');
      if (decimalNumber.length > 2) {
        event.target.value = wholeNumber + "." + this.previousDecimalNumber;
        return;
      }
    }
  }

  async onMinChange(event: any, rowNumber: any, columnName: any, type: any, columnNumber: any) {

    var value = event.target.value;
    var minType;

    // if (this.distinctMinReductionList[rowNumber].minType == undefined) {
    let minValue;
    if (columnNumber == 0) {
      minValue = this.distinctMinReductionList[rowNumber].targetMin1;
    }
    else if (columnNumber == 1) {
      minValue = this.distinctMinReductionList[rowNumber].targetMin2;
    }
    else {
      minValue = this.distinctMinReductionList[rowNumber].currentMin;
    }

    if (minValue.includes('$')) {
      minType = '$';
      this.distinctMinReductionList[rowNumber]['minType'] = '$';
    }
    else if (minValue.includes('%')) {
      minType = '%';
      this.distinctMinReductionList[rowNumber]['minType'] = '%';
    }
    else {
      minType = '$';
      this.distinctMinReductionList[rowNumber]['minType'] = '$';
    }
    var serviceName: any = [];

    if (this.distinctMinReductionList[rowNumber].service.toLowerCase().includes('international')) {
      var filteredIntlList = this.minimumReductionList.filter((data: any) => data.service == this.distinctMinReductionList[rowNumber].service);
      serviceName = await this.getUniqueService(filteredIntlList, 'subGroup');
      var filteredMinList = this.minimumReductionList.filter((data: any) => data.service == this.distinctMinReductionList[rowNumber].service);
    }
    else {
      serviceName.push(this.distinctMinReductionList[rowNumber].subGroup);
      var filteredMinList = this.minimumReductionList.filter((data: any) => data.subGroup == this.distinctMinReductionList[rowNumber].subGroup);
    }

    this.distinctMinReductionList[rowNumber][columnName] = value;
    filteredMinList.forEach((data: any) => {
      data[columnName] = value;
    })

    var value: any = Number(value.replaceAll('$', '').replace('%', '').replaceAll(' ', ''));
    var spend = "";
    var percent = "";
    var baseRate = "";
    var minRate = "";
    var airList = [];
    var groundList = [];
    var hwtList = [];
    var intlList = [];
    var minMaxList = [];

    //freight part
    if (columnName == 'currentMin') {
      var dataList = this.freightCurrentDetails;
      spend = "currentSpend";
      percent = "currentPercent";
      baseRate = "oldBaseRate";
      minRate = "oldMinRatesheet";
      airList = this.currentSavingsAirList;
      groundList = this.currentSavingsGroundList;
      hwtList = this.currentSavingsHWTList;
      intlList = this.currentSavingsIntlList;
    }
    else {
      var dataList = this.scenariosDisplayed[columnNumber].freightTargetDetails;
      spend = "targetSpend";
      percent = "targetPercent";
      baseRate = "newBaseRate";
      minRate = "newMinRatesheet";
      airList = this.scenariosDisplayed[columnNumber].dataSourceAirTarget.data;
      groundList = this.scenariosDisplayed[columnNumber].dataSourceGroundTarget.data;
      hwtList = this.scenariosDisplayed[columnNumber].dataSourceHWTTarget.data;
      intlList = this.scenariosDisplayed[columnNumber].dataSourceIntlTarget.data;
    }
    const formatter = [0, 1, 2, 3, 4, 5].map(
      (decimals) =>
        new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }),
    );
    var filteredFreightData = [];

    for (let index = 0; index < serviceName.length; index++) {
      var service: any = "";
      var serviceType = "";
      filteredFreightData = dataList.filter((data: any) => data.serviceName == serviceName[index].trim());

      if (filteredFreightData[0] != undefined) {
        if (service == "") {
          service = filteredFreightData[0].service;
        }
        if (serviceType == "") {
          serviceType = filteredFreightData[0].serviceGrouping.toLowerCase();
        }

        if (columnName == 'currentMin') {
          if (serviceType == "air") {
            minMaxList = this.airMinMaxList;
          }
          else if (serviceType == "ground") {
            minMaxList = this.groundMinMaxList;
          }
          else if (serviceType == "hwt") {
            minMaxList = this.hwtMinMaxList;
          }
          else {
            minMaxList = this.intlMinMaxList;
          }
        }
        else {
          if (serviceType == "air") {
            minMaxList = this.scenariosDisplayed[columnNumber].airMinMaxList;
          }
          else if (serviceType == "ground") {
            minMaxList = this.scenariosDisplayed[columnNumber].groundMinMaxList;
          }
          else if (serviceType == "hwt") {
            minMaxList = this.scenariosDisplayed[columnNumber].hwtMinMaxList;
          }
          else {
            minMaxList = this.scenariosDisplayed[columnNumber].intlMinMaxList;
          }
        }

        var totalSpend = 0;
        for (let row = 0; row < filteredFreightData.length; row++) {

          let data = filteredFreightData[row];
          let discountData: any = {};
          if (serviceType == 'ground') {
            discountData = minMaxList.filter((minMaxData: any) => minMaxData.name == service && Number(data.weightRange) >= Number(minMaxData.weightFrom) && Number(data.weightRange) <= Number(minMaxData.weightTo) && !minMaxData.service.includes('Sub Total'))[0];
          }
          else {
            discountData = minMaxList.filter((minMaxData: any) => minMaxData.service == service)[0];
          }

          var roundedTargetSpend;
          var lowestRate = Number(data.lowestRate);
          if (minType == '%') {
            data[minRate] = lowestRate - (lowestRate * (value / 100));
          }
          else {
            data[minRate] = lowestRate - value;
          }

          let discount;
          if (discountData.disMin == discountData.disMax) {
            discount = discountData.disMin;
          }
          else {
            discount = Number(data[percent]);
          }

          let listRate = Number(data[baseRate]);
          let oldMinRate = Number(data[minRate]);
          let count = Number(data.count);
          if (serviceType == 'hwt') {
            if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
              var targetSpend = ((Number((listRate * Number((1 - (discount / 100))))) < oldMinRate) ? Number(oldMinRate) : Number((listRate * Number((1 - (discount / 100))))));
            }
            else {
              var targetSpend = ((listRate - (listRate * (discount / 100)) < oldMinRate) ? Number(oldMinRate) : Number((listRate - (listRate * (discount / 100)))));
            }
            data[spend] = await this.roundTo(targetSpend, 2);
          }
          else {
            if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
              var targetSpend = ((Number((listRate * Number((1 - (discount / 100))))) < oldMinRate) ? Number(oldMinRate) : Number((listRate * Number((1 - (discount / 100))))));
            }
            else {
              var targetSpend = (((listRate - (listRate * (discount / 100))) < oldMinRate) ? Number(oldMinRate) : Number((listRate - (listRate * (discount / 100)))));
            }

            var finalSpend = await this.roundTo(targetSpend, 2) * count;
            data[spend] = finalSpend;
          }
          totalSpend += await this.roundTo(data[spend], 2);
        }

        if (serviceType == 'air') {
          var rowIndex = airList.findIndex((data: any) => data.service == service);
          airList[rowIndex][spend] = Number(totalSpend.toFixed(2));
          await this.onSpendChange(totalSpend, rowIndex, serviceType, type, columnNumber);
        }
        else if (serviceType == "ground" || serviceType == 'home delivery' || serviceType == 'smartpost' || serviceType == 'ground economy') {

          var filteredGroundData = groundList.filter((data: any) => data.service == service && data.weightRange != 'Sub Total');

          for (let row = 0; row < filteredGroundData.length; row++) {
            let groundData = filteredGroundData[row];
            totalSpend = 0;
            var weightRange = groundData.weightRange;
            var localWeightRange: any;
            var filteredData = dataList.filter((data: any) => {
              if (data.service.toLowerCase().includes("wt")) {
                localWeightRange = "1-2000";
              }
              else if (data.service.toLowerCase().includes("greater")) {
                localWeightRange = "1-1000";
              }
              else if (data.service.toLowerCase().includes("less")) {
                localWeightRange = "0-0.99";
              }
              else if (data.service.toLowerCase().includes("intl")) {
                localWeightRange = "0-1000";
              }
              else if (data.service.toLowerCase().includes("9-96")) {
                localWeightRange = "0-1000";
              }
              else {
                if (Number(data.weightRange) >= 0 && Number(data.weightRange) <= 5)
                  localWeightRange = "0-5";
                else if (Number(data.weightRange) >= 6 && Number(data.weightRange) <= 10)
                  localWeightRange = "6-10";
                else if (Number(data.weightRange) >= 11 && Number(data.weightRange) <= 20)
                  localWeightRange = "11-20";
                else if (Number(data.weightRange) >= 21 && Number(data.weightRange) <= 30)
                  localWeightRange = "21-30";
                else if (Number(data.weightRange) >= 31 && Number(data.weightRange) <= 50)
                  localWeightRange = "31-50";
                else if (Number(data.weightRange) >= 51 && Number(data.weightRange) <= 70)
                  localWeightRange = "51-70";
                else if (Number(data.weightRange) >= 71 && Number(data.weightRange) <= 150)
                  localWeightRange = "71-150";
                else if (Number(data.weightRange) > 150) {
                  localWeightRange = "151+";
                }
              }
              return (data.service == service && localWeightRange == weightRange);
            });

            for (let key in filteredData) {
              var targetGroundSpend = filteredData[key][spend];
              totalSpend = await this.roundTo(targetGroundSpend, 2) + totalSpend;
            }

            var rowIndex = groundList.findIndex((data: any) => data.service == service && data.weightRange == weightRange);
            groundList[rowIndex][spend] = Number(totalSpend.toFixed(2));
            await this.onSpendChange(Number(totalSpend.toFixed(2)), rowIndex, 'ground', type, columnNumber);
          }
        }
        else if (serviceType == 'hwt') {
          var rowIndex = hwtList.findIndex((data: any) => data.service == service);
          hwtList[rowIndex][spend] = totalSpend;
          await this.onSpendChange(totalSpend, rowIndex, serviceType, type, columnNumber);
        }
        else {
          var rowIndex = intlList.findIndex((data: any) => data.service == service);
          intlList[rowIndex][spend] = totalSpend;
          await this.onSpendChange(totalSpend, rowIndex, serviceType, type, columnNumber);
        }
        var accList: any = [];
        this.scenariosDisplayed[columnNumber].dataSourceAccTarget.data.forEach((data: any) => accList.push(Object.assign({}, data)));
        await this.calculateFuel(columnNumber, accList);
        await this.calculateTPBilling(columnNumber, accList);
        await this.onAccSpendChange('', '', 'target', columnNumber);
      }
    }
  }

  async minFocusout(event: any, rowNumber: any, columnName: any) {

    var minType = "";
    let minValue = "";

    // if (this.distinctMinReductionList[rowNumber].minType == undefined) {
    if (columnName == 'current') {
      minValue = this.distinctMinReductionList[rowNumber].currentMin;
    }
    else if (columnName == 'target1') {
      minValue = this.distinctMinReductionList[rowNumber].targetMin1;
    }
    else if (columnName == 'target2') {
      minValue = this.distinctMinReductionList[rowNumber].targetMin2;
    }
    if (minValue.indexOf('$') > 0) {
      minType = '$';
    }
    else if (minValue.indexOf('%') > 0) {
      minType = '%';
    }
    else {
      minType = '$';
    }
    // }
    // else {
    //   minType = this.distinctMinReductionList[rowNumber].minType;
    // }

    if (event.target.value.includes(".")) {
      let value = event.target.value.split(".")[0];
      let decimalValue = event.target.value.split(".").pop().replace('%', '');
      if (value == '') {
        event.target.value = "0." + decimalValue + "%";
      }
      if (decimalValue == '') {
        event.target.value = value + ".00";
      }
    }

    if ((!(event.target.value.includes(".")) && minType == '$')) {
      event.target.value = '$' + Number(event.target.value.replace('%', '').replace('$', '')).toFixed(2);
    }
    else if ((!(event.target.value.includes(".")) && minType == '%')) {
      event.target.value = Number(event.target.value.replace('%', '').replace('$', '')).toFixed(2) + '%';
    }
    else if (minType == '$' && event.target.value.indexOf('$') < 0) {
      event.target.value = '$' + event.target.value;
    }
    else if (minType == '%' && event.target.value.indexOf('%') < 0) {
      event.target.value = event.target.value + '%';
    }
    else if (event.target.value.indexOf('%') < 0 && event.target.value.indexOf('$') < 0) {
      event.target.value = '$' + event.target.value;
    }

    if (columnName == 'current') {
      this.netAmountMinMaxList[rowNumber].currentMin = event.target.value;
      this.netAmountMinMaxList[rowNumber].currentMax = event.target.value;
    }
    else if (columnName == 'target1') {
      this.netAmountMinMaxList[rowNumber].target1Min = event.target.value;
      this.netAmountMinMaxList[rowNumber].target1Max = event.target.value;
    }
    else if (columnName == 'target2') {
      this.netAmountMinMaxList[rowNumber].target2Min = event.target.value;
      this.netAmountMinMaxList[rowNumber].target2Max = event.target.value;
    }
  }

  async onHWTTierChange(type: any) {

    var hwtList: any = [];
    var filteredData = [];
    var clientObj: any = {};
    if (type == 'current') {
      var hwtTier = this.currentTier;
      filteredData = this.freightCurrentDetails.filter((data: any) => data.serviceGrouping.toLowerCase() == 'hwt');
      clientObj['carrierName'] = this.carrierName;
      clientObj['clientName'] = this.selectedCarrier.clientName;
    }
    else {
      var hwtTier = this.scenariosDisplayed[type].targetTier;
      filteredData = this.scenariosDisplayed[type].freightTargetDetails.filter((data: any) => data.serviceGrouping.toLowerCase() == 'hwt');
      clientObj['targetId'] = Number(this.scenariosDisplayed[type].targetId);
      clientObj['carrierName'] = this.scenariosDisplayed[type].carrierName;
      clientObj['clientName'] = this.selectedCarrier.clientName;
    }

    filteredData.forEach((data: any) => hwtList.push(Object.assign({}, data)));

    var hwtObj: any =
    {
      weightFrom: 1,
      weightTo: 10000,
      containerType: "PKG",
      minType: "$",
      frtRatesheetId: 0,
      hwtRatesheetId: 0,
      zone1: null,
    };

    var alteredList: any = [];

    var minMaxList = (type == 'current') ? this.hwtMinMaxList : this.scenariosDisplayed[type].hwtMinMaxList;

    hwtList.forEach((data: any) => {
      let rowIndex = minMaxList.findIndex((listData: any) => listData.service == data.service);
      let minMaxData = minMaxList[rowIndex];
      hwtObj.hwtTier = hwtTier;
      hwtObj.targetDis = (minMaxData.disMin == minMaxData.disMax) ? Number(Number(minMaxData.disMin).toFixed(2)) : data.targetPercent;
      hwtObj.subGroup = data.newService;
      hwtObj.service = data.newService;
      hwtObj.clientId = data.clientId;
      hwtObj.targetId = (type == 'current') ? 0 : data.targetId;
      hwtObj.targetMin = "0.00";
      hwtObj.serviceType = data.serviceGrouping;
      alteredList.push(Object.assign({}, hwtObj));
    });

    this.openLoading();
    if (this.carrierName.toLowerCase() == 'ups') {
      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientObj['freightDetailsList'] = alteredList;
      clientObj['runType'] = 'Dashboard';
      var tableName = await this.httpclient.saveOrUpdateDiscountsHWTGRI(clientObj).toPromise();

      var targetObj: any = {};
      targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      if ((type != 'current')) {
        targetObj['targetId'] = Number(this.scenariosDisplayed[type].targetId)
      }
      targetObj['carrierName'] = this.carrierName;
      targetObj['type'] = (type == 'current') ? 'create' : 'Edit';
      targetObj['tableName'] = tableName[0].runType;
      var result = await this.httpclient.generateProposalHWTGRI(targetObj).toPromise();
    }
    else {
      clientObj['clientId'] = this.fedexClientId;
      clientObj['freightDetailsList'] = alteredList;
      clientObj['runType'] = 'Dashboard';
      var tableName = await this.fedexService.saveOrUpdateDiscountsHWTGRI(clientObj).toPromise();

      var targetObj: any = {};
      targetObj['clientId'] = this.fedexClientId;
      targetObj['targetId'] = (type == 'current') ? 0 : Number(this.scenariosDisplayed[type].targetId);
      targetObj['carrierName'] = this.carrierName;
      targetObj['type'] = (type == 'current') ? 'create' : 'Edit';
      targetObj['tableName'] = tableName[0].runType;
      var result = await this.fedexService.generateProposalHWTGRI(targetObj).toPromise();
    }

    if (type == 'current') {
      var nonHWTData = this.freightCurrentDetails.filter((data: any) => data.serviceGrouping.toLowerCase() != 'hwt');
      this.freightCurrentDetails = nonHWTData;
      result.forEach((serviceData: any) => this.freightCurrentDetails.push(Object.assign({}, serviceData)));
    }
    else {
      var nonHWTData = this.scenariosDisplayed[type].freightTargetDetails.filter((data: any) => data.serviceGrouping.toLowerCase() != 'hwt');
      this.scenariosDisplayed[type].freightTargetDetails = nonHWTData;
      result.forEach((serviceData: any) => this.scenariosDisplayed[type].freightTargetDetails.push(Object.assign({}, serviceData)));
    }


    if (type != 'current') {

      var row: number = this.scenariosDisplayed[type].hwtTier.findIndex((data: any) => data.includes('-'));
      if (row != -1) this.scenariosDisplayed[type].hwtTier.splice(row, 1);

      this.targetSavingsHWTList = [];
      this.targetSavingsHWTTotal = [];
      this.targetSavingsHWTTotalList = [];
      this.scenariosDisplayed[type].hwtMinMaxList = [];
      this.scenariosDisplayed[type].targetTier = '';

      for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
        await this.filterAirIntlHWTTargetData(this.distinctHWTServices, result, serviceIndex, 'HWT', type);
      }

      var tier = await this.setHWTMinMax('target');
      this.scenariosDisplayed[type].targetTier = tier;
      // for (let dataNo = 0; dataNo < this.targetSavingsHWTList.length; dataNo++) {
      //   if (this.scenariosDisplayed[type].targetTier == '')
      //     this.scenariosDisplayed[type].targetTier = this.targetSavingsHWTList[dataNo].hwtTier;
      //   else
      //     break;
      // }
      this.scenariosDisplayed[type].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);

      var calculatedData = await this.calculateTargetSpend(this.targetSavingsHWTList);

      this.targetSavingsHWTTotalList.push({
        weightRange: '',
        count: '',
        targetPercent: '',
        targetSpend: calculatedData['totalTargetSpend'],
        targetSavingsPercent: (Math.abs(this.currentSavingsHWTTotalList[0].currentSpend) != 0) ? (calculatedData['totalSavings'] / this.currentSavingsHWTTotalList[0].currentSpend) * 100 : 0,
        savingsAmount: calculatedData['totalSavings']
      });

      this.scenariosDisplayed[type].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);

      await this.calculateOverallTotal('target', type);

      for (let index = 0; index < this.distinctHWTServices.length; index++) {
        var filteredService = [];

        filteredService = result.filter((data: any) => data.service == this.distinctHWTServices[index]);


        var minMax = {
          disMin: '',
          disMax: '',
        };

        if (filteredService.length == 0) {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }
        else {

          minMax.disMin = filteredService[0].targetPercent.toString();
          minMax.disMax = filteredService[0].targetPercent.toString();

          for (let row = 0; row < filteredService.length; row++) {
            if (filteredService[row].targetPercent == '') {
              minMax.disMin = "0.00";
              minMax.disMax = "0.00";
            }
            else {
              if (Number(minMax.disMin) >= Number(filteredService[row].targetPercent)) {
                minMax.disMin = Number(filteredService[row].targetPercent).toFixed(2);
              }
              if (Number(minMax.disMax) <= Number(filteredService[row].targetPercent)) {
                minMax.disMax = Number(filteredService[row].targetPercent).toFixed(2);
              }
            }
          }
        }

        this.scenariosDisplayed[type].hwtMinMaxList[index] = {
          service: this.distinctHWTServices[index],
          serviceName: '',
          name: (filteredService[0] != undefined) ? (filteredService[0].service) : (this.distinctHWTServices[index].replace('Sub Total', '')),
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          weightFrom: '',
          weightTo: ''
        }
      }
    }
    else {

      var row: number = this.hwtTier.findIndex((data: any) => data.includes('-'));
      if (row != -1) this.hwtTier.splice(row, 1);

      this.currentSavingsHWTList = [];
      this.currentSavingsHWTTotal = [];
      this.currentSavingsHWTTotalList = [];
      this.hwtMinMaxList = [];
      this.currentTier = '';

      for (let serviceIndex = 0; serviceIndex < this.distinctHWTServices.length; serviceIndex++) {
        await this.filterAirIntlHWTData(serviceIndex, this.distinctHWTServices[serviceIndex], result, 'hwt', this.distinctHWTServiceName[serviceIndex], this.distinctHWTExcelServiceName[serviceIndex]);
      }

      // for (let dataNo = 0; dataNo < this.currentSavingsHWTList.length; dataNo++) {
      //   if (this.currentTier == '')
      //     this.currentTier = this.currentSavingsHWTList[dataNo].hwtTier;
      //   else
      //     break;
      // } this.currentTier = '';

      var tier = await this.setHWTMinMax('current');
      this.currentTier = tier;

      this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);

      var calculatedData = await this.calculateCurrentSpend(this.currentSavingsHWTList);

      this.currentSavingsHWTTotalList.push({
        service: "Hundredweight Pricing :",
        weightRange: '',
        count: calculatedData['totalCount'],
        currentPercent: '',
        currentSpend: calculatedData['totalCurrentSpend'],
        serviceType: ''
      });
      this.dataSourceCurrentHWTTotal = new MatTableDataSource(this.currentSavingsHWTTotalList);

      await this.calculateOverallTotal('current');

      for (let index in this.scenariosDisplayed) {


        this.targetSavingsHWTList = this.scenariosDisplayed[index].dataSourceHWTTarget.data;

        for (let row = 0; row < this.currentSavingsHWTList.length; row++) {
          this.targetSavingsHWTList[row].savingsAmount = this.targetSavingsHWTList[row].targetSpend - this.currentSavingsHWTList[row].currentSpend;
          if (this.currentSavingsHWTList[row].currentSpend == 0) {
            this.targetSavingsHWTList[row].targetSavingsPercent = 0;
          }
          else {
            this.targetSavingsHWTList[row].targetSavingsPercent = (this.targetSavingsHWTList[row].savingsAmount / this.currentSavingsHWTList[row].currentSpend) * 100;
          }
        }

        this.scenariosDisplayed[index].dataSourceHWTTarget = new MatTableDataSource(this.targetSavingsHWTList);

        var calculatedData = await this.calculateTargetSpend(this.targetSavingsHWTList);

        this.targetSavingsHWTTotalList = [];
        this.targetSavingsHWTTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedData['totalTargetSpend'],
          targetSavingsPercent: (Math.abs(this.currentSavingsHWTTotalList[0].currentSpend) != 0) ? (calculatedData['totalSavings'] / this.currentSavingsHWTTotalList[0].currentSpend) * 100 : 0,
          savingsAmount: calculatedData['totalSavings']
        });

        this.scenariosDisplayed[index].dataSourceTargetHWTTotal = new MatTableDataSource(this.targetSavingsHWTTotalList);

        await this.calculateOverallTotal('target', Number(index));
      }

      for (let index = 0; index < this.distinctHWTServices.length; index++) {
        var filteredService = [];

        filteredService = result.filter((data: any) => data.service == this.distinctHWTServices[index]);

        var minMax = {
          disMin: '',
          disMax: '',
        };

        if (filteredService.length == 0) {
          minMax.disMin = "0.00";
          minMax.disMax = "0.00";
        }

        else {

          minMax.disMin = filteredService[0].currentPercent.toString();
          minMax.disMax = filteredService[0].currentPercent.toString();

          for (let row = 0; row < filteredService.length; row++) {
            if (filteredService[row].currentPercent == '') {
              minMax.disMin = "0.00";
              minMax.disMax = "0.00";
            }
            else {
              if (Number(minMax.disMin) >= Number(filteredService[row].currentPercent)) {
                minMax.disMin = Number(filteredService[row].currentPercent).toFixed(2);
              }
              if (Number(minMax.disMax) <= Number(filteredService[row].currentPercent)) {
                minMax.disMax = Number(filteredService[row].currentPercent).toFixed(2);
              }
            }
          }
        }

        this.hwtMinMaxList[index] = {
          service: this.distinctHWTServices[index],
          name: (filteredService[0] != undefined) ? (filteredService[0].service) : (this.distinctHWTServices[index].replace('Sub Total', '')),
          disMin: minMax.disMin,
          disMax: minMax.disMax,
        }
      }
    }

    if (type != 'current') {
      var targetList: any = [];
      this.scenariosDisplayed[type].dataSourceAccTarget.data.forEach((data: any) => targetList.push(Object.assign({}, data)));
      await this.calculateFuel(type, targetList);
      await this.calculateTPBilling(type, targetList);
      await this.onAccSpendChange('', '', 'target', type);
    }

    this.closeLoading();
    let panelClass = "";
    if (this.themeoption == 'dark') {
      panelClass = 'page-dark'
    }
    var message = "HundredWeight Tier updated successfully";
    var resultDialog = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { pageValue: message },
    });
  }

  async getFilteredData(serviceList: any, type: string, serviceName: string) {

    var localWeightRange = "";
    var filteredData = [];
    if (type == "acc") {
      filteredData = serviceList.filter((data: any) => data.service == serviceName);
    }
    else if (type == "ground") {
      filteredData = serviceList.filter((data: any) => {

        if (data.service == "SmartPost Greater Than 1lb" || data.service.toLowerCase().replaceAll(' ', '') == "groundeconomygreaterthan1lb") {
          localWeightRange = "1-1000";
        }
        else if (data.service == "SmartPost Less Than 1lb" || data.service.toLowerCase().replaceAll(' ', '') == "groundeconomylessthan1lb") {
          localWeightRange = "0-0.99";
        }
        else if (data.service == "Surepost Greater Than 1lb" || data.service.toLowerCase().replaceAll(' ', '') == "groundsavergreaterthan1lb" || data.service.toLowerCase().replaceAll(' ', '') == "upsgroundsavergreaterthan1lb" || data.service.toLowerCase().replaceAll(' ', '') == "upsgroundsaver1lborgreater" || data.service.toLowerCase().replaceAll(' ', '') == "groundsaver1lborgreater" || data.service == "UPS Ground Saver - 1 lb or Greater" || data.service == "Ground Saver - 1 lb or Greater" || data.service == "UPS Ground Saver 1 lb or Greater" || data.service == "Ground Saver 1 lb or Greater" || data.service == "UPS Ground Saver Greater Than 1lb" || data.service == "Ground Saver Greater Than 1lb") {
          localWeightRange = "1-1000";
        }
        else if (data.service == "Surepost Less Than 1lb" || data.service.toLowerCase().replaceAll(' ', '') == "groundsaverlessthan1lb" || data.service.toLowerCase().replaceAll(' ', '') == "upsgroundsaverlessthan1lb" || data.service == "UPS Ground Saver - Less than 1 lb" || data.service == "Ground Saver - Less than 1 lb" || data.service == "UPS Ground Saver Less Than 1lb" || data.service == "Ground Saver Less Than 1lb") {
          localWeightRange = "0-0.99";
        }
        else if (data.service == "Ground (Freight Pricing)" || data.service == "ARS Ground") {
          localWeightRange = "0-1000";
        }
        else if (data.service.toLowerCase().includes("9-96")) {
          localWeightRange = "0-1000";
        }
        else if (data.service.toLowerCase().includes("wt")) {
          if (this.selectedCarrier.carrierName.toLowerCase() == 'ups')
            localWeightRange = "1-2000";
          else
            localWeightRange = "1-10000";
        }
        else if (data.service.toLowerCase().includes("intl")) {
          localWeightRange = "0-1000";
        }

        else {
          if (Number(data.weightRange) >= 0 && Number(data.weightRange) <= 5)
            localWeightRange = "0-5";
          else if (Number(data.weightRange) >= 6 && Number(data.weightRange) <= 10)
            localWeightRange = "6-10";
          else if (Number(data.weightRange) >= 11 && Number(data.weightRange) <= 20)
            localWeightRange = "11-20";
          else if (Number(data.weightRange) >= 21 && Number(data.weightRange) <= 30)
            localWeightRange = "21-30";
          else if (Number(data.weightRange) >= 31 && Number(data.weightRange) <= 50)
            localWeightRange = "31-50";
          else if (Number(data.weightRange) >= 51 && Number(data.weightRange) <= 70)
            localWeightRange = "51-70";
          else if (Number(data.weightRange) >= 71 && Number(data.weightRange) <= 150)
            localWeightRange = "71-150";
          else if (Number(data.weightRange) > 150) {
            localWeightRange = "151+";
          }
        }
        return (data.service + localWeightRange == serviceName);
      });
    }
    else {
      filteredData = serviceList.filter((data: any) => data.service == serviceName);
    }
    return filteredData;
  }

  openLoading() {
    this.isLoading = true;
    this.loaderService.show();
  }

  closeLoading() {
    console.log('test CloseLoading')
    this.isLoading = false;
    this.loaderService.hide();
  }

  async setHWTMinMax(type: string) {

    if (type == 'target') {

      if (this.targetSavingsHWTList.length > 0) {

        var minMax = {
          minTier: this.targetSavingsHWTList[0].hwtTier,
          maxTier: this.targetSavingsHWTList[0].hwtTier,
        };

        for (let index = 0; index < this.targetSavingsHWTList.length; index++) {
          if (this.targetSavingsHWTList[index].hwtTier != null) {
            if (Number(minMax.minTier) >= Number(this.targetSavingsHWTList[index].hwtTier)) {
              minMax.minTier = Number(this.targetSavingsHWTList[index].hwtTier).toString();
            }
            if (Number(minMax.maxTier) <= Number(this.targetSavingsHWTList[index].hwtTier)) {
              minMax.maxTier = Number(this.targetSavingsHWTList[index].hwtTier).toString();
            }
          }
        }

        if (minMax.minTier == minMax.maxTier) {
          return minMax.minTier;
        }
        else {
          return minMax.minTier + '-' + minMax.maxTier;
        }
      }
      else {
        return '';
      }
    }
    else {
      if (this.currentSavingsHWTList.length > 0) {

        var minMax = {
          minTier: this.currentSavingsHWTList[0].hwtTier,
          maxTier: this.currentSavingsHWTList[0].hwtTier,
        };

        for (let index = 0; index < this.currentSavingsHWTList.length; index++) {
          if (this.currentSavingsHWTList[index].hwtTier != null) {
            if (Number(minMax.minTier) >= Number(this.currentSavingsHWTList[index].hwtTier)) {
              minMax.minTier = Number(this.currentSavingsHWTList[index].hwtTier).toString();
            }
            if (Number(minMax.maxTier) <= Number(this.currentSavingsHWTList[index].hwtTier)) {
              minMax.maxTier = Number(this.currentSavingsHWTList[index].hwtTier).toString();
            }
          }
        }

        if (minMax.minTier == minMax.maxTier) {
          return minMax.minTier;
        }
        else {
          return minMax.minTier + '-' + minMax.maxTier;
        }
      }
      else {
        return '';
      }
    }
  }

  async validateAccService(service: string, index: number) {
    if (this.currentSavingsAccList[index].isNewRow != undefined) { // vaildate only newly added rows
      let filteredAcc = this.currentSavingsAccList.filter((data: any, id: any) => id != index); //get all the acc services except the current service your are validating
      let availableServices = await this.getUniqueService(filteredAcc, 'service');
      if (availableServices.includes(service)) { //if the service is available then change the rowNumber value from undefined to any values
        this.currentSavingsAccList[index].rowNumber = index;
        this.isAccServiceAvailable = true;

      }
      else {
        this.currentSavingsAccList[index].rowNumber = undefined; //if the service is not available make the rowNumber value to be undefined

        //now, we have to validate all other newly added rows
        let filteredService: any = [];
        this.currentSavingsAccList.filter((data: any, index: any) => { //get the index of the newly added rows and push it into filteredService array
          if (data.isNewRow != undefined) {
            filteredService.push(index);
          }
        });
        for (let index in filteredService) {//loop the array list,with each index, get the service and check if service is already available
          let AccId = filteredService[index]
          let filteredAcc = this.currentSavingsAccList.filter((data: any, id: any) => id != AccId && data.rowNumber == undefined);
          let availableServices = await this.getUniqueService(filteredAcc, 'service');
          let currentService = this.currentSavingsAccList[AccId].service;
          if (availableServices.includes(currentService)) {
            this.currentSavingsAccList[AccId].rowNumber = AccId;
          }
          else {
            this.currentSavingsAccList[AccId].rowNumber = undefined;
          }
        }

        let rowIndex = this.currentSavingsAccList.findIndex((data: any) => data.rowNumber != undefined);
        //if there is rowNumber value for any row the there is 'service already exists' error ,if not then rowIndex would be -1
        if (rowIndex == -1) {
          this.isAccServiceAvailable = false;
        }
      }
    }
  }

  async roundTo(n: any, digits: any) {
    var negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;

    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if (negative) {
      n = (n * -1).toFixed(2);

    }
    return Number(n);
  }

  accSpendFocusOut(event: any, rowNumber: any, minMaxList: any, type: any, columnNumber: any) {

    if (event.target.value.split('.').length - 1 > 1) {
      return false;
    }

    if (!(event.target.value.includes("."))) {
      event.target.value = Number(event.target.value.replace('$', '')).toFixed(2);
    }

    if (!event.target.value.includes("$")) {
      event.target.value = '$' + event.target.value;
    }

    if (type == 'current') {
      this.accMinMaxList[rowNumber].disMin = Number(event.target.value.replace('$', '')).toFixed(2);
      this.accMinMaxList[rowNumber].disMax = Number(event.target.value.replace('$', '')).toFixed(2);
      this.accMinMaxList[rowNumber].discountType = "$";
    }
    if (type == 'target') {
      this.scenariosDisplayed[columnNumber].accMinMaxList[rowNumber].disMin = Number(event.target.value.replace('$', '')).toFixed(2);
      this.scenariosDisplayed[columnNumber].accMinMaxList[rowNumber].disMax = Number(event.target.value.replace('$', '')).toFixed(2);
      this.scenariosDisplayed[columnNumber].accMinMaxList[rowNumber].discountType = '$';
    }
    return false;
  }


  async deleteRowFRTRatesheet(frtRateObjList: any, targetDetails?: any) {
    var deleteFRTRatesheetList: any = [];
    frtRateObjList.forEach((data: any) => deleteFRTRatesheetList.push(Object.assign({}, data)));

    var deleteFRTRateObj: any = {};

    deleteFRTRateObj['clientName'] = this.selectedCarrier.clientName;
    if (targetDetails != undefined) {
      deleteFRTRateObj['targetId'] = Number(targetDetails.targetId);
      deleteFRTRateObj['carrierName'] = targetDetails.carrierName;
    }
    else {
      deleteFRTRateObj['targetId'] = 0;
      deleteFRTRateObj['carrierName'] = this.carrierName;
    }

    if (this.carrierName.toLowerCase() == 'ups') {
      deleteFRTRateObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      for (let index = 0; index < deleteFRTRatesheetList.length; index++) {
        if (targetDetails != undefined) {
          deleteFRTRatesheetList[index].targetId = Number(targetDetails.targetId);
        }
        deleteFRTRatesheetList[index].clientId = this.cookiesService.getCookieItem('clientId');
      }
      deleteFRTRateObj['freightDetailsList'] = deleteFRTRatesheetList;
      await this.httpclient.deleteFRTRatesheetGRI(deleteFRTRateObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
    }
    else {
      deleteFRTRateObj['clientId'] = this.fedexClientId;
      for (let index = 0; index < deleteFRTRatesheetList.length; index++) {
        if (targetDetails != undefined) {
          deleteFRTRatesheetList[index].targetId = Number(targetDetails.targetId);
        }
        deleteFRTRatesheetList[index].clientId = this.fedexClientId;
      }
      deleteFRTRateObj['freightDetailsList'] = deleteFRTRatesheetList;
      await this.fedexService.deleteFedExFRTRatesheetGRI(deleteFRTRateObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
    }
  }


  getMinMax(serviceName: string, list: any, columnName: string) {

  }

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scrollEvent, true);
    // const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    // this.topScroll.nativeElement.firstElementChild!.setAttribute(
    //   'style',
    //   `width:${tableWidth}px`
    // );
    console.log('selectedCarrierSignal()', this.selectedCarrierSignal())
  }

  scrollEvent = (event: any): void => {
    this.checkVisibility();
  }

  private isElementHidden(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.bottom < 0 ||
      rect.right < 0 ||
      rect.left > window.innerWidth ||
      rect.top > window.innerHeight
    );
  }

  private checkVisibility(): void {
    const element = this.el.nativeElement.querySelector('#editButton');

    if (this.isElementHidden(element)) {
      this.editButtonVisibility.set(true);
    } else {
      this.editButtonVisibility.set(false);
    }
  }

  popupVisible: boolean = false;
  popupPosition = { top: '0px', left: '0px' };

  togglePopup(event: MouseEvent) {

  }

  openDeleteAgreement(event: any) {
    this.popupVisible = false;
    var handelerPosition = this.gerClickhandlerPosition(window.innerHeight, event.y);
    const dialogPosition: DialogPosition = {
      top: handelerPosition + 'px',
      left: event.x - 250 + 'px'
    };

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'filter-modalbox';
    }

    const dialogRef = this.dialog.open(DeleteAgreementGRIComponent, {
      disableClose: true,
      width: "25%",
      height: "370px",
      position: dialogPosition,
      data: {
        service: this.selectedCarrier['carrierName'],
        targetList: this.selectedScenarios,
        category: this.selectedCategory(),
        fedexId: this.fedexClientId,
        allScenarios: this.totalScenarios,
      },
      panelClass: [this.panelClass],
    });

    dialogRef.afterClosed().subscribe(
      async (data: any) => {
        if (data != undefined) {
          let refresh = false;
          let selectedScenarios = data[0];
          let reset = data[1];

          let targetIdList: any = [];
          this.scenariosDisplayed.forEach((scenario: any) => targetIdList.push(scenario.targetId));
          for (let index = 0; index < selectedScenarios.length; index++) {
            if (targetIdList.includes(selectedScenarios[index])) {
              refresh = true;
              break;
            }
          }
          if (refresh || reset) {
            this.reloadData([]);
          }
        }
      }
    );
  }

  restoreProposal() {

    let panelClass = "";
    if (this.themeoption == 'dark') {
      panelClass = 'page-dark'
    }
    let resetDialog = this.dialog.open(ResetPopupGRIComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { message: "Are you sure you want to reset to initial upload?" }
    });
    resetDialog.afterClosed().subscribe(
      result => {
        if (result == true) {
          this.openLoading();
          this.popupVisible = false;
          let targetObj: any = {};
          if (this.selectedCarrier.carrierName.toLowerCase() == 'ups') {
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          }
          else {
            targetObj['clientId'] = this.fedexClientId;
          }
          targetObj['carrierName'] = this.carrierName;

          let message = "";
          this.httpclient.restoreProposalGRI(targetObj).subscribe(result => {

            if (result == true) {
              message = "Successfully restored to initial upload";
            }
            else {
              message = "Restore data unavailable";
            }

            var alertDialog = this.dialog.open(AlertPopupComponent, {
              disableClose: true,
              width: '470px',
              height: 'auto',
              panelClass: panelClass,
              data: { pageValue: message },
            });

            alertDialog.afterClosed().subscribe(() => {
              window.location.reload();
              this.closeLoading();
            });

          });

        }
      });
  }

  deleteTarget(targetId: any) {
    let resetDialog = this.dialog.open(ResetPopupGRIComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      data: { message: "Are you sure you want to delete?" }
    });
    resetDialog.afterClosed().subscribe(
      (data: any) => {
        if (data == true) {
          this.delete(targetId);
        }
      });
  }
  delete(targetId: any) {
    this.openLoading();
    var param: any = {
      targetId: targetId,
      clientId: null,
      carrierName: this.carrierName
    }
    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
      param.clientId = this.fedexClientId;
    }
    else {
      param.clientId = this.cookiesService.getCookieItem('clientId');
    }

    this.httpclient.deleteTargetDetailsGRI(param).subscribe(response => {

      let targetIdList: any = [];
      this.scenariosDisplayed.forEach((scenario: any) => targetIdList.push(scenario.targetId));
      if (targetIdList.includes(targetId)) {
        this.isDelete = true;
      }

      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = 'page-dark'
      }
      var alertDialog = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        panelClass: panelClass,
        data: { pageValue: "Agreement Deleted Successfully" },
      });

      alertDialog.afterClosed().subscribe(() => {
        this.totalScenarios = this.totalScenarios.filter((data: any) => data.targetId != targetId);
        if (this.isDelete) {
          this.reloadData([]);
        }
        else {
          this.closeLoading();
        }

      });
    });
  }

  async reloadData(targetIdList: any) {

    this.openLoading();
    this.isDelete = false;
    let includeCheck = true;
    for (let id = 0; id < targetIdList.length; id++) {

      let rowNumber = this.totalScenarios.findIndex((data: any) => data.targetId == targetIdList[id]);
      if (rowNumber != -1) {
        if (!this.totalScenarios[rowNumber].loaded) {
          includeCheck = false;
          break;
        }
      }
      else {
        includeCheck = false;
      }
    }
    this.targetIdList = [];
    if (!this.loaded) {
      await this.resetCurrentList();
    }
    await this.getTargetDetails();
    this.scenariosDisplayed = [];
    await this.setTargetDetails(targetIdList);

    if (!includeCheck || !this.loaded) {

      if (this.loaded == false) {
        this.dataSourceAir = new MatTableDataSource([])
        this.dataSourceGround = new MatTableDataSource([]);
        this.dataSourceIntl = new MatTableDataSource([]);
        this.dataSourceHWT = new MatTableDataSource([]);
        this.dataSourceAcc = new MatTableDataSource([]);

        this.dataSourceCurrentAirTotal = new MatTableDataSource([]);
        this.dataSourceCurrentGroundTotal = new MatTableDataSource([]);
        this.dataSourceCurrentIntlTotal = new MatTableDataSource([]);
        this.dataSourceCurrentHWTTotal = new MatTableDataSource([]);
        this.dataSourceCurrentAccTotal = new MatTableDataSource([]);

        this.totalCurrentSpend = 0;
        this.totalFreightSpend = 0;
        this.totalAccSpend = 0;
      }

      let apiData = await this.getFreightAndProposal();

      apiData.subscribe({
        next: async results => {

          if (this.loaded == false) {
            this.freightCurrentDetails = results[0];
            this.proposalList = results[1];
          }

          if (this.scenariosDisplayed[0].loaded == false) {
            if (results.length >= 4 && this.loaded == false) {
              this.scenariosDisplayed[0].freightTargetDetails = results[2];
              this.scenariosDisplayed[0].proposalList = results[3];
            }
            else {
              this.scenariosDisplayed[0].freightTargetDetails = results[0];
              this.scenariosDisplayed[0].proposalList = results[1];
            }
          }

          if (this.scenariosDisplayed.length > 1) {
            if (this.scenariosDisplayed[1].loaded == false) {
              if (results.length == 6) {
                this.scenariosDisplayed[1].freightTargetDetails = results[4];
                this.scenariosDisplayed[1].proposalList = results[5];
              }
              else if (results.length == 4) {
                this.scenariosDisplayed[1].freightTargetDetails = results[2];
                this.scenariosDisplayed[1].proposalList = results[3];
              }
              else {
                this.scenariosDisplayed[1].freightTargetDetails = results[0];
                this.scenariosDisplayed[1].proposalList = results[1];
              }
            }
          }

          this.proposalList.forEach((dataNew: any) => {
            if ((dataNew.serviceType).toLowerCase() == 'air') {
              this.airProposalList.push(dataNew);
            }
            else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
              this.groundProposalList.push(dataNew);
            }

            else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
              this.hwtProposalList.push(dataNew);
            }
            else {
              this.intlProposalList.push(dataNew);
            }
          });

          this.scenariosDisplayed[0].proposalList.forEach((dataNew: any) => {
            if ((dataNew.serviceType).toLowerCase() == 'air') {
              this.scenariosDisplayed[0].airProposalList.push(dataNew);
            }
            else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
              this.scenariosDisplayed[0].groundProposalList.push(dataNew);
            }

            else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
              this.scenariosDisplayed[0].hwtProposalList.push(dataNew);
            }
            else {
              this.scenariosDisplayed[0].intlProposalList.push(dataNew);
            }
          });

          if (this.scenariosDisplayed.length > 1) {
            this.scenariosDisplayed[1].proposalList.forEach((dataNew: any) => {
              if ((dataNew.serviceType).toLowerCase() == 'air') {
                this.scenariosDisplayed[1].airProposalList.push(dataNew);
              }
              else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
                this.scenariosDisplayed[1].groundProposalList.push(dataNew);
              }

              else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
                this.scenariosDisplayed[1].hwtProposalList.push(dataNew);
              }
              else {
                this.scenariosDisplayed[1].intlProposalList.push(dataNew);
              }
            });
          }


          this.scenariosDisplayed.forEach((data: any) => this.targetIdList.push(data.targetId));
          let proposalFreightData = await this.getAccessorialDimAndMin();

          proposalFreightData.subscribe({
            next: async accResults => {

              this.dimFactorList = accResults[0];
              this.minimumReductionList = accResults[1];

              if (this.loaded == false) {
                this.accessorialCurrentDetails = accResults[2];
              }

              if (this.scenariosDisplayed[0].loaded == false) {
                if (accResults.length >= 4 && this.loaded == false) {
                  this.scenariosDisplayed[0].accessorialTargetDetails = accResults[3];
                }
                else {
                  this.scenariosDisplayed[0].accessorialTargetDetails = accResults[2];
                }
              }

              if (this.scenariosDisplayed.length > 1) {

                if (this.scenariosDisplayed[1].loaded == false) {
                  if (accResults.length == 5) {
                    this.scenariosDisplayed[1].accessorialTargetDetails = accResults[4];
                  }
                  else if (accResults.length == 4) {
                    this.scenariosDisplayed[1].accessorialTargetDetails = accResults[3];
                  }
                  else {
                    this.scenariosDisplayed[1].accessorialTargetDetails = accResults[2];
                  }
                }
              }


              if (this.currentDIMTable != "") {
                this.dimFactorList.forEach((dimData: any) => {
                  let rowNumber = this.currentDimList.findIndex((currentDimData: any) => currentDimData.criteria == dimData.criteria && currentDimData.serviceGrouping == dimData.serviceGrouping);
                  if (rowNumber != -1) {
                    dimData.baselineDimFactor = this.currentDimList[rowNumber].targetDimDivisor;
                  }
                })
              }

              let proposalData = await this.getProposalData();

              proposalData.subscribe({
                next: async proposalResults => {

                  if (this.loaded == false) {
                    this.dimProposalList = (proposalResults[0] as any).filter((value: any) => value.category == 'Proposed');
                    this.accessorialProposalList = proposalResults[1];
                  }

                  if (this.scenariosDisplayed[0].loaded == false) {
                    if (proposalResults.length >= 4 && this.loaded == false) {
                      this.scenariosDisplayed[0].dimProposalList = (proposalResults[2] as any).filter((value: any) => value.category == 'Proposed');
                      this.scenariosDisplayed[0].accessorialProposalList = proposalResults[3];
                    }
                    else {
                      this.scenariosDisplayed[0].dimProposalList = (proposalResults[0] as any).filter((value: any) => value.category == 'Proposed');
                      this.scenariosDisplayed[0].accessorialProposalList = proposalResults[1];
                    }
                  }

                  if (this.scenariosDisplayed.length > 1) {

                    if (this.scenariosDisplayed[1].loaded == false) {
                      if (proposalResults.length == 6) {
                        this.scenariosDisplayed[1].dimProposalList = (proposalResults[4] as any).filter((value: any) => value.category == 'Proposed');
                        this.scenariosDisplayed[1].accessorialProposalList = proposalResults[5];
                      }
                      else if (proposalResults.length == 4) {
                        this.scenariosDisplayed[1].dimProposalList = (proposalResults[2] as any).filter((value: any) => value.category == 'Proposed');
                        this.scenariosDisplayed[1].accessorialProposalList = proposalResults[3];
                      }
                      else {
                        this.scenariosDisplayed[1].dimProposalList = (proposalResults[0] as any).filter((value: any) => value.category == 'Proposed');
                        this.scenariosDisplayed[1].accessorialProposalList = proposalResults[1];
                      }
                    }
                  }

                  await this.getDistinctServices();
                  this.columnsDimFactor.set([]);
                  this.displayedColumnsDIM = [];
                  this.columnsMinReduction.set([]);
                  this.displayedColumnsMin = [];
                  this.dataSourceDimFactor = [];
                  this.dataSourceMinReduction = [];
                  this.removeExtraRows();
                  await this.getData();
                  await this.gridViewfunction();
                  await this.setColumnNames();
                  await this.setColumn();
                  this.loaded = true;
                  this.scenariosDisplayed[0].loaded = true;
                  if (this.scenariosDisplayed.length > 1) {
                    this.scenariosDisplayed[1].loaded = true;
                  }
                  let clientName: string = this.selectedCarrier.clientName;
                  this.cookiesService.setCookieItem('targetClientName', clientName);
                  this.cookiesService.setCookieItem('targetIdList', this.targetIdList.toString());
                  this.closeLoading();
                }
              });
            }
          });
        }
      });
    }
    else {

      this.scenariosDisplayed.forEach((data: any) => this.targetIdList.push(data.targetId));
      await this.getDistinctServices();
      this.columnsDimFactor.set([]);
      this.displayedColumnsDIM = [];
      this.columnsMinReduction.set([]);
      this.displayedColumnsMin = [];
      this.dataSourceDimFactor = [];
      this.dataSourceMinReduction = [];
      this.removeExtraRows();
      await this.getData();
      await this.gridViewfunction();
      await this.setColumnNames();
      await this.setColumn();

      this.loaded = true;
      this.scenariosDisplayed[0].loaded = true;
      if (this.scenariosDisplayed.length > 1) {
        this.scenariosDisplayed[1].loaded = true;
      }

      let clientName: string = this.selectedCarrier.clientName;
      this.cookiesService.setCookieItem('targetClientName', clientName);
      this.cookiesService.setCookieItem('targetIdList', this.targetIdList.toString());
      this.closeLoading();
    }
  }

  onReload() {
    if (this.cookiesService.getCookieItem('clientId') == this.fedexClientId || this.cookiesService.getCookieItem('clientId') == this.upsClientId) {
      if (this.cookiesService.getCookieItem('currentCarrierType').toLowerCase() == 'fedex') {
        this.cookiesService.setCookieItem('clientId', this.fedexClientId);
      }
      else {
        this.cookiesService.setCookieItem('clientId', this.upsClientId);
      }
    }
  }

  removeExtraRows() {

    this.currentSavingsAirList = this.currentSavingsAirList.filter(
      (data: any) => this.distinctAirServices.includes(data.service)
    );
    this.currentSavingsGroundList = this.currentSavingsGroundList.filter(
      (data: any) => this.distinctGroundServices.includes(data.service)
    );
    this.currentSavingsHWTList = this.currentSavingsHWTList.filter(
      (data: any) => this.distinctHWTServices.includes(data.service)
    );
    this.currentSavingsIntlList = this.currentSavingsIntlList.filter(
      (data: any) => this.distinctIntlServices.includes(data.service)
    );

    this.dataSourceAir = new MatTableDataSource(this.currentSavingsAirList);
    this.dataSourceGround = new MatTableDataSource(this.currentSavingsGroundList);
    this.dataSourceIntl = new MatTableDataSource(this.currentSavingsIntlList);
    this.dataSourceHWT = new MatTableDataSource(this.currentSavingsHWTList);

    for (let scenarioIndex = 0; scenarioIndex < this.scenariosDisplayed.length; scenarioIndex++) {
      let targetSavingsAirList = this.scenariosDisplayed[scenarioIndex].dataSourceAirTarget.data;
      let targetSavingsGroundList = this.scenariosDisplayed[scenarioIndex].dataSourceGroundTarget.data;
      let targetSavingsIntlList = this.scenariosDisplayed[scenarioIndex].dataSourceIntlTarget.data;
      let targetSavingsHWTList = this.scenariosDisplayed[scenarioIndex].dataSourceHWTTarget.data;

      targetSavingsAirList = targetSavingsAirList.filter(
        (data: any) => this.distinctAirServices.includes(data.service)
      );
      targetSavingsGroundList = targetSavingsGroundList.filter(
        (data: any) => this.distinctGroundServices.includes(data.service)
      );
      targetSavingsHWTList = targetSavingsHWTList.filter(
        (data: any) => this.distinctHWTServices.includes(data.service)
      );
      targetSavingsIntlList = targetSavingsIntlList.filter(
        (data: any) => this.distinctIntlServices.includes(data.service)
      );

      this.scenariosDisplayed[scenarioIndex].dataSourceAirTarget = new MatTableDataSource(targetSavingsAirList);
      this.scenariosDisplayed[scenarioIndex].dataSourceGroundTarget = new MatTableDataSource(targetSavingsGroundList);
      this.scenariosDisplayed[scenarioIndex].dataSourceIntlTarget = new MatTableDataSource(targetSavingsIntlList);
      this.scenariosDisplayed[scenarioIndex].dataSourceHWTTarget = new MatTableDataSource(targetSavingsHWTList);
    }
  }

  async generatePdf1(scenarios: number[]) {
    pdfMake.vfs = pdfFonts;
    this.openLoading();

    let scenariosDisplayed = [];
    let selectedScenarios = [];

    for (let index = 0; index < scenarios.length; index++) {
      if (!this.allIdList.includes(scenarios[index])) {
        this.allIdList.push(scenarios[index]);
        for (let row = 0; row < this.totalScenarios.length; row++) {
          if (this.totalScenarios[row].targetId == scenarios[index]) {
            // await this.insertDataForExcel(this.selectedCarrier.carrierName.toLowerCase(), row);
            // await this.calculateOverallTotalExcel(row);
            break;
          }
        }
        if (!this.availableIdList.includes(scenarios[index])) {
          await this.getTargetDetails();
          var scenarioIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
          // await this.insertDataForExcel(this.selectedCarrier.carrierName.toLowerCase(), scenarioIndex);
          // await this.calculateOverallTotalExcel(scenarioIndex);
        }
      }
    }

    for (let index = 0; index < scenarios.length; index++) {
      selectedScenarios.push(scenarios[index].toString());
      var rowIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
      scenariosDisplayed.push(this.totalScenarios[rowIndex]);


      const date = new Date();
      const TotalFreightSavings =
        scenariosDisplayed[index].dataSourceTargetAirTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetGroundTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetIntlTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetHWTTotal.data[0].savingsAmount;

      const TotalAccessorialSavings =
        scenariosDisplayed[index].dataSourceTargetAccTotal.data[0].savingsAmount;

      // === Table One (Summary Info) ===
      let tableOneArr: any[] = [
        ["Client Name:", this.selectedCarrier.clientName, "Total Estimated Costs:", "$" + this.setCommaQty(Number(scenariosDisplayed[index].totalSavings).toFixed(2))],
        ["Analysis Date:", this.datePipe.transform(date, "MM-dd-yyyy"), "% Increase Overall:", this.setCommaQty(Number(scenariosDisplayed[index].totalSavingsPercent).toFixed(2)) + "%", '% Increase'],
        ["Invoice From Date:", this.selectedCarrier['dateRange'].split(' to ')[0], "Total Freight Increase:", "$" + this.setCommaQty(Number(TotalFreightSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalFreightSavings) / this.totalFreightSpend) * 100).toFixed(2)) + '%'],
        ["Invoice To Date:", this.selectedCarrier['dateRange'].split(' to ')[1], "Total Accessorial Increase:", "$" + this.setCommaQty(Number(TotalAccessorialSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalAccessorialSavings) / this.totalAccSpend) * 100).toFixed(2)) + '%']
      ];


      var tableArr = [];
      var TargetServiceList = [];
      var TargetAccessorialList = [];
      var TotalFreightCurrentSpend = 0;
      var TotalAccCurrentSpend = 0;
      var airList = [];
      var GroundList = [];
      var intlList = [];
      var accList = [];

      for (var loop = 0; loop < this.currentSavingsAirList.length; loop++) {

        if (Number(this.currentSavingsAirList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAirList = scenariosDisplayed[index].dataSourceAirTarget.data;
        airList.push({
          id: '', service: this.currentSavingsAirList[loop].finalService, count: Number(this.currentSavingsAirList[loop].count), currentSpend: Number(this.currentSavingsAirList[loop].currentSpend), targetSpend: Number(targetSavingsAirList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newAirList: any = this.combineAndSum(airList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAirList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newAirList[loop].service, count: newAirList[loop].count, currentSpend: newAirList[loop].currentSpend, targetSpend: newAirList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsGroundList.length; loop++) {
        if (Number(this.currentSavingsGroundList[loop].count) == 0) {
          continue;
        }
        if (this.currentSavingsGroundList[loop].weightRange != 'Sub Total') {
          var targetSavingsGroundList = scenariosDisplayed[index].dataSourceGroundTarget.data;
          GroundList.push({
            id: '', service: this.currentSavingsGroundList[loop].finalService, count: Number(this.currentSavingsGroundList[loop].count), currentSpend: Number(this.currentSavingsGroundList[loop].currentSpend), targetSpend: Number(targetSavingsGroundList[loop].targetSpend)
            , difference: '=E11-D11', increase: '=F11/D11'
          });
        }
      }

      var newGroundList: any = this.combineAndSum(GroundList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newGroundList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newGroundList[loop].service, count: newGroundList[loop].count, currentSpend: newGroundList[loop].currentSpend, targetSpend: newGroundList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsHWTList.length; loop++) {
        if (Number(this.currentSavingsHWTList[loop].count) == 0) {
          continue;
        }
        var targetSavingsHwtList = scenariosDisplayed[index].dataSourceHWTTarget.data;
        TargetServiceList.push({
          id: '', service: this.currentSavingsHWTList[loop].finalService, count: Number(this.currentSavingsHWTList[loop].count), currentSpend: Number(this.currentSavingsHWTList[loop].currentSpend), targetSpend: Number(targetSavingsHwtList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsIntlList.length; loop++) {
        if (Number(this.currentSavingsIntlList[loop].count) == 0) {
          continue;
        }
        var targetSavingsIntlList = scenariosDisplayed[index].dataSourceIntlTarget.data;
        intlList.push({
          id: '', service: this.currentSavingsIntlList[loop].finalService, count: Number(this.currentSavingsIntlList[loop].count), currentSpend: Number(this.currentSavingsIntlList[loop].currentSpend), targetSpend: Number(targetSavingsIntlList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newIntlList: any = this.combineAndSum(intlList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newIntlList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newIntlList[loop].service, count: newIntlList[loop].count, currentSpend: newIntlList[loop].currentSpend, targetSpend: newIntlList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsAccList.length; loop++) {
        if (Number(this.currentSavingsAccList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAccList = scenariosDisplayed[index].dataSourceAccTarget.data;
        accList.push({
          id: '', service: this.currentSavingsAccList[loop].finalService, count: Number(this.currentSavingsAccList[loop].count), currentSpend: Number(this.currentSavingsAccList[loop].currentSpend), targetSpend: Number(targetSavingsAccList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newAccList: any = this.combineAndSum(accList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAccList.length; loop++) {
        TargetAccessorialList.push({
          id: '', service: newAccList[loop].service, count: newAccList[loop].count, currentSpend: newAccList[loop].currentSpend, targetSpend: newAccList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }


      // Push Service Spend
      TargetServiceList.sort((a: any, b: any) => Number(b.currentSpend) - Number(a.currentSpend));
      TargetServiceList.forEach((data: any) => {
        TotalFreightCurrentSpend = data.currentSpend + TotalFreightCurrentSpend;
        tableArr.push([
          data.service,
          data.count,
          data.currentSpend,
          data.targetSpend,
          data.targetSpend - data.currentSpend,
          (((data.targetSpend - data.currentSpend) / data.currentSpend) * 100).toFixed(2) + "%"
        ]);
      });

      // Push Accessorial Spend
      TargetAccessorialList.sort((a: any, b: any) => { return Number(b.currentSpend) - Number(a.currentSpend); });
      TargetAccessorialList.forEach((data: any) => {
        TotalAccCurrentSpend = data.currentSpend + TotalAccCurrentSpend;
        tableArr.push([
          data.service,
          data.count,
          data.currentSpend,
          data.targetSpend,
          data.targetSpend - data.currentSpend,
          (((data.targetSpend - data.currentSpend) / data.currentSpend) * 100).toFixed(2) + "%"
        ]);
      });

      // Totals Row
      const totalRow = [
        "TOTAL",
        "",
        this.totalCurrentSpend,
        scenariosDisplayed[index].totalNetSpend,
        scenariosDisplayed[index].totalNetSpend - this.totalCurrentSpend,
        (((scenariosDisplayed[index].totalNetSpend - this.totalCurrentSpend) / this.totalCurrentSpend) * 100).toFixed(2) + "%"
      ];
      tableArr.push(totalRow);

      const pageSize = this.calculatePageSize(tableArr.length);

      const docDefinition: any = {
        pageSize: pageSize,
        // pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [20, 20, 20, 30],
        content: [
          { text: "2025 UPS General Rate Increase Projection Report", style: "reportHeader" },

          // === Summary Table ===
          {
            style: "summaryTable",
            table: {
              widths: ["20%", "20%", "20%", "20%", "10%"],
              body: tableOneArr.map(row => [
                { text: row[0], style: "summaryLabel" },
                { text: row[1], style: "summaryValue" },
                { text: row[2], style: "summaryLabel" },
                { text: row[3], style: "summaryValue" },
                { text: row[4], style: "summaryValue" },
              ])
            },
            layout: "noBorders"
          },

          { text: "\n" },

          // === Detail Table ===
          {
            style: "detailTable",
            table: {
              headerRows: 1,
              widths: ["*", "10%", "15%", "15%", "15%", "15%"],
              body: [
                [
                  { text: "SERVICE/CHARGE TYPE", style: "tableHeader" },
                  { text: "VOLUME", style: "tableHeader", alignment: "center" },
                  { text: "2024 CALCULATED SPEND", style: "tableHeader", alignment: "right" },
                  { text: "2025 CALCULATED SPEND", style: "tableHeader", alignment: "right" },
                  { text: "DIFFERENCE", style: "tableHeader", alignment: "right" },
                  { text: "% INCREASE", style: "tableHeader", alignment: "center" }
                ],
                ...tableArr.map((row, idx) => {
                  const isTotal = row[0] === "TOTAL";
                  return [
                    { text: row[0], style: isTotal ? "totalCell" : "tableCell" },
                    { text: row[1], alignment: "center", style: isTotal ? "totalCell" : "tableCell" },
                    { text: this.formatCurrency(row[2]), alignment: "right", style: isTotal ? "totalCell" : "tableCell" },
                    { text: this.formatCurrency(row[3]), alignment: "right", style: isTotal ? "totalCell" : "tableCell" },
                    { text: this.formatCurrency(row[4]), alignment: "right", style: isTotal ? "totalCell" : "tableCell" },
                    { text: row[5], alignment: "center", style: isTotal ? "totalCell" : "tableCell" }
                  ];
                })
              ]
            },
            layout: {
              hLineColor: () => "#D9D9D9",
              vLineColor: () => "#D9D9D9",
              hLineWidth: (i: any, node: any) => (i === 0 || i === node.table.body.length ? 1 : 0.5),
              vLineWidth: () => 0.5
            }
          },

          { text: "\n" },

          // === Footer Block ===
          {
            text: "\n\n" +
              "* Please note: rates and increases are calculated based on current year carrier rates compared to projected increases for next year.\n\n" +
              "LJM Group\n312 Conklin Street, Farmingdale, NY 11735\nTel: 631-844-9500   info@myljm.com",
            style: "footer"
          }
        ],
        styles: {
          reportHeader: {
            fontSize: 14,
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 15],
            color: "#404040"
          },
          summaryTable: {
            margin: [0, 0, 0, 15],
            fontSize: 9
          },
          summaryLabel: {
            bold: true,
            color: "#595959",
            // margin: [0, 2, 0, 2]
          },
          summaryValue: {
            color: "#404040",
            // margin: [0, 2, 0, 2]
          },
          detailTable: {
            fontSize: 9,
            margin: [0, 0, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 9,
            fillColor: "#DCE6F1",
            color: "#404040",
            margin: [2, 4, 2, 4]
          },
          tableCell: {
            fontSize: 9,
            color: "#404040",
            margin: [2, 2, 2, 2]
          },
          totalCell: {
            fontSize: 9,
            bold: true,
            fillColor: "#DCE6F1",
            color: "#404040",
            margin: [2, 2, 2, 2]
          },
          footer: {
            fontSize: 8,
            alignment: "center",
            color: "#404040",
            margin: [0, 30, 0, 0]
          }
        }
      };

      // Download PDF
      var d = new Date();
      var currentDate = this.datePipe.transform(d, "MM-dd-yyyy_HH:mm:ss");
      var fileName = this.selectedCarrier.clientName + ' 2025 ' + this.selectedCarrier.carrierName + 'GRI Analysis_' + currentDate + ".pdf";
      pdfMake.createPdf(docDefinition).download(fileName);
    }
    this.closeLoading();
  }

  private calculatePageSize(tableArrLength: number): { width: number; height: number } {
    const headerHeight = 40;
    const summaryHeight = 120;
    const footerHeight = 80;
    const rowHeight = 14;

    const totalRows = tableArrLength + 1; // include header
    const contentHeight = headerHeight + summaryHeight + footerHeight + (rowHeight * totalRows);

    const pageWidth = 800; // Fixed width, adjust as needed
    const pageHeight = contentHeight + 150; // Margin buffer

    return { width: pageWidth, height: pageHeight };
  }

  formatCurrency(value: number): string {
    if (value == null || isNaN(value)) return "-";
    const formatted = value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return "$" + formatted;
  }

  async generatePdf(scenarios: number[]) {
    (pdfMake as any).vfs = pdfFonts;
    this.openLoading();


    let scenariosDisplayed = [];
    let selectedScenarios = [];

    for (let index = 0; index < scenarios.length; index++) {
      if (!this.allIdList.includes(scenarios[index])) {
        this.allIdList.push(scenarios[index]);
        for (let row = 0; row < this.totalScenarios.length; row++) {
          if (this.totalScenarios[row].targetId == scenarios[index]) {
            break;
          }
        }
        if (!this.availableIdList.includes(scenarios[index])) {
          await this.getTargetDetails();
          var scenarioIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
        }
      }
    }
    // PDF content accumulator
    let pdfContent: any[] = [];
    let pageSize = { width: 1000, height: 800 };
    for (let index = 0; index < scenarios.length; index++) {
      selectedScenarios.push(scenarios[index].toString());
      var rowIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
      scenariosDisplayed.push(this.totalScenarios[rowIndex]);


      const date = new Date();
      const TotalFreightSavings =
        scenariosDisplayed[index].dataSourceTargetAirTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetGroundTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetIntlTotal.data[0].savingsAmount +
        scenariosDisplayed[index].dataSourceTargetHWTTotal.data[0].savingsAmount;

      const TotalAccessorialSavings =
        scenariosDisplayed[index].dataSourceTargetAccTotal.data[0].savingsAmount;

      // === Table One (Summary Info) ===
      let tableOneArr: any[] = [
        ["Client Name:", this.clientName, "Total Estimated Costs:", "$" + this.setCommaQty(Number(scenariosDisplayed[index].totalSavings).toFixed(2))],
        ["Analysis Date:", this.datePipe.transform(date, "MM-dd-yyyy"), "% Increase Overall:", this.setCommaQty(Number(scenariosDisplayed[index].totalSavingsPercent).toFixed(2)) + "%", '% Increase'],
        ["Invoice From Date:", this.selectedCarrier['dateRange'].split(' to ')[0], "Total Freight Increase:", "$" + this.setCommaQty(Number(TotalFreightSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalFreightSavings) / this.totalFreightSpend) * 100).toFixed(2)) + '%'],
        ["Invoice To Date:", this.selectedCarrier['dateRange'].split(' to ')[1], "Total Accessorial Increase:", "$" + this.setCommaQty(Number(TotalAccessorialSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalAccessorialSavings) / this.totalAccSpend) * 100).toFixed(2)) + '%']
      ];


      var tableArr = [];
      var TargetServiceList = [];
      var TargetAccessorialList = [];
      var TotalFreightCurrentSpend = 0;
      var TotalAccCurrentSpend = 0;
      var airList = [];
      var GroundList = [];
      var intlList = [];
      var accList = [];

      for (var loop = 0; loop < this.currentSavingsAirList.length; loop++) {

        if (Number(this.currentSavingsAirList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAirList = scenariosDisplayed[index].dataSourceAirTarget.data;
        airList.push({
          id: '', service: this.currentSavingsAirList[loop].finalService, count: Number(this.currentSavingsAirList[loop].count), currentSpend: Number(this.currentSavingsAirList[loop].currentSpend), targetSpend: Number(targetSavingsAirList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newAirList: any = this.combineAndSum(airList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAirList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newAirList[loop].service, count: newAirList[loop].count, currentSpend: newAirList[loop].currentSpend, targetSpend: newAirList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsGroundList.length; loop++) {
        if (Number(this.currentSavingsGroundList[loop].count) == 0) {
          continue;
        }
        if (this.currentSavingsGroundList[loop].weightRange != 'Sub Total') {
          var targetSavingsGroundList = scenariosDisplayed[index].dataSourceGroundTarget.data;
          GroundList.push({
            id: '', service: this.currentSavingsGroundList[loop].finalService, count: Number(this.currentSavingsGroundList[loop].count), currentSpend: Number(this.currentSavingsGroundList[loop].currentSpend), targetSpend: Number(targetSavingsGroundList[loop].targetSpend)
            , difference: '=E11-D11', increase: '=F11/D11'
          });
        }
      }

      var newGroundList: any = this.combineAndSum(GroundList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newGroundList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newGroundList[loop].service, count: newGroundList[loop].count, currentSpend: newGroundList[loop].currentSpend, targetSpend: newGroundList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsHWTList.length; loop++) {
        if (Number(this.currentSavingsHWTList[loop].count) == 0) {
          continue;
        }
        var targetSavingsHwtList = scenariosDisplayed[index].dataSourceHWTTarget.data;
        TargetServiceList.push({
          id: '', service: this.currentSavingsHWTList[loop].finalService, count: Number(this.currentSavingsHWTList[loop].count), currentSpend: Number(this.currentSavingsHWTList[loop].currentSpend), targetSpend: Number(targetSavingsHwtList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsIntlList.length; loop++) {
        if (Number(this.currentSavingsIntlList[loop].count) == 0) {
          continue;
        }
        var targetSavingsIntlList = scenariosDisplayed[index].dataSourceIntlTarget.data;
        intlList.push({
          id: '', service: this.currentSavingsIntlList[loop].finalService, count: Number(this.currentSavingsIntlList[loop].count), currentSpend: Number(this.currentSavingsIntlList[loop].currentSpend), targetSpend: Number(targetSavingsIntlList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newIntlList: any = this.combineAndSum(intlList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newIntlList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newIntlList[loop].service, count: newIntlList[loop].count, currentSpend: newIntlList[loop].currentSpend, targetSpend: newIntlList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsAccList.length; loop++) {
        if (Number(this.currentSavingsAccList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAccList = scenariosDisplayed[index].dataSourceAccTarget.data;
        accList.push({
          id: '', service: this.currentSavingsAccList[loop].finalService, count: Number(this.currentSavingsAccList[loop].count), currentSpend: Number(this.currentSavingsAccList[loop].currentSpend), targetSpend: Number(targetSavingsAccList[loop].targetSpend)
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }

      var newAccList: any = this.combineAndSum(accList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAccList.length; loop++) {
        TargetAccessorialList.push({
          id: '', service: newAccList[loop].service, count: newAccList[loop].count, currentSpend: newAccList[loop].currentSpend, targetSpend: newAccList[loop].targetSpend
          , difference: '=E11-D11', increase: '=F11/D11'
        });
      }


      // Push Service Spend
      TargetServiceList.sort((a: any, b: any) => Number(b.currentSpend) - Number(a.currentSpend));
      TargetServiceList.forEach((data: any) => {
        TotalFreightCurrentSpend = data.currentSpend + TotalFreightCurrentSpend;
        tableArr.push([
          data.service,
          data.count,
          data.currentSpend,
          data.targetSpend,
          data.targetSpend - data.currentSpend,
          data.currentSpend === 0 ? "0.00%" : (((data.targetSpend - data.currentSpend) / data.currentSpend) * 100).toFixed(2) + "%"
        ]);
      });

      // Push Accessorial Spend
      let customsDutySpend = 0;
      TargetAccessorialList.sort((a: any, b: any) => { return Number(b.currentSpend) - Number(a.currentSpend); });
      TargetAccessorialList.forEach((data: any) => {
        TotalAccCurrentSpend = data.currentSpend + TotalAccCurrentSpend;
        if (data.service != null && (data.service.toLowerCase() == "customs and duty" || data.service.toLowerCase() == "customs and duties"))
          customsDutySpend += Number(data.currentSpend) || 0;
        tableArr.push([
          data.service,
          data.count,
          data.currentSpend,
          data.targetSpend,
          data.targetSpend - data.currentSpend,
          data.currentSpend === 0 ? "0.00%" : (((data.targetSpend - data.currentSpend) / data.currentSpend) * 100).toFixed(2) + "%"
        ]);
      });

      // Totals Row
      const totalRow = [
        "",
        "Total:",
        this.totalCurrentSpend,
        scenariosDisplayed[index].totalNetSpend,
        scenariosDisplayed[index].totalNetSpend - this.totalCurrentSpend,
        (((scenariosDisplayed[index].totalNetSpend - this.totalCurrentSpend) / (this.totalCurrentSpend - customsDutySpend)) * 100).toFixed(2) + "%"
      ];
      tableArr.push(totalRow);
      const tempPageSize = this.calculatePageSize(tableArr.length);

      if (tempPageSize.height > pageSize.height) {
        pageSize.height = tempPageSize.height + 100;
      }
      pageSize.width = tempPageSize.width;

      // Add a section for this scenario
      pdfContent.push(
        // Report Title
        {
          text: '2026 ' + this.selectedCarrier.carrierName + ' General Rate Increase Projection Report',
          style: 'reportHeader',
          margin: [0, 0, 0, 15]
        },

        // === Summary Table ===
        {
          table: {
            widths: ['auto', '*', 'auto', 'auto', '*', 'auto'],
            body: [
              [
                { text: 'Client Name:', style: 's1' },
                { text: this.clientName, style: 's1', alignment: 'center' },
                { text: '' },
                { text: 'Total Estimated Costs:', style: 's3' },
                { text: '$' + this.setCommaQty(Number(scenariosDisplayed[index].totalSavings).toFixed(2)), style: 's4' },
                { text: '', style: 'tableCell' }
              ],
              [
                { text: 'Analysis Date:', style: 's2' },
                { text: this.datePipe.transform(date, 'MM/dd/yyyy'), style: 's2', alignment: 'center' },
                { text: '' },
                { text: '% Increase Overall:', style: 's2' },
                //{ text: this.setCommaQty(Number(scenariosDisplayed[index].totalSavingsPercent).toFixed(2)) + '%', style: 's5' },
                { text: this.setCommaQty(Number(Number((Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)) - Number(this.totalCurrentSpend.toFixed(2))) / (Number(this.totalCurrentSpend.toFixed(2)) - Number(customsDutySpend.toFixed(2)))) * 100).toFixed(2)) + '%', style: 's5' },
                { text: '% Increase', style: 's2', alignment: 'center' }
              ],
              [
                { text: 'Invoice From Date:', style: 's2' },
                { text: this.datePipe.transform(this.selectedCarrier['dateRange'].split(' to ')[0], 'MM/dd/yyyy'), style: 's2', alignment: 'center' },
                { text: '' },
                { text: 'Total Freight Increase:', style: 's2' },
                { text: '$' + this.setCommaQty(Number(TotalFreightSavings).toFixed(2)), style: 's5' },
                { text: this.setCommaQty(Number((Number(TotalFreightSavings) / this.totalFreightSpend) * 100).toFixed(2)) + '%', style: 's2', alignment: 'center' }
              ],
              [
                { text: 'Invoice To Date:', style: 's2' },
                { text: this.datePipe.transform(this.selectedCarrier['dateRange'].split(' to ')[1], 'MM/dd/yyyy'), style: 's2', alignment: 'center' },
                { text: '' },
                { text: 'Total Accessorial Increase:', style: 's2' },
                { text: '$' + this.setCommaQty(Number(TotalAccessorialSavings).toFixed(2)), style: 's5' },
                { text: this.setCommaQty(Number((Number(TotalAccessorialSavings) / (this.totalAccSpend - customsDutySpend)) * 100).toFixed(2)) + '%', style: 's2', alignment: 'center' }
              ]
            ]
          },
          layout: {
            hLineWidth: (i: any, node: any) => {
              // if (i === 0) return 1; // Top border for first row
              if (i === node.table.body.length) return 1; // Bottom border for last row
              return 0.5; // Other borders
            },
            vLineWidth: () => 0,
            hLineColor: (i: any) => {
              if (i === 0) return '#4AACC5'; // Blue for first row
              return '#D9D9D9'; // Gray for other rows
            },
            paddingTop: (i: any) => (i === 0 ? 3 : 2),
            paddingBottom: (i: any, node: any) => (i === node.table.body.length - 1 ? 2 : 2)
          },
          margin: [0, 0, 0, 20]
        },

        // === Detail Table ===
        {
          table: {
            headerRows: 1,
            widths: ['*', '15%', '15%', '15%', '10%', '10%'],
            body: [
              // Header row
              [
                { text: 'SERVICE/ CHARGE TYPE', style: 'tableHeader', fillColor: '#DCE6F0' },
                { text: 'VOLUME', style: 'tableHeader', fillColor: '#DCE6F0', alignment: 'center' },
                { text: this.selectedCarrier.year + ' CALCULATED SPEND', style: 'tableHeader', fillColor: '#DCE6F0', alignment: 'center' },
                { text: this.scenariosDisplayed[index].year + ' CALCULATED SPEND', style: 'tableHeader', fillColor: '#DCE6F0', alignment: 'center' },
                { text: 'DIFFERENCE', style: 'tableHeader', fillColor: '#DCE6F0', alignment: 'center' },
                { text: '% INCREASE', style: 'tableHeader', fillColor: '#B8CCE3', alignment: 'center' }
              ],
              // Data rows
              ...tableArr.map((row, idx) => {
                const isTotal = row[1] === 'Total:';

                return [
                  { text: row[0], style: isTotal ? 'totalCell' : 's5', margin: [9, 2, 0, 2], fillColor: isTotal ? '#E9EFF5' : 'white' },
                  { text: this.setCommaQty(row[1]), style: isTotal ? 'totalCell' : 's2', alignment: 'center', margin: [0, 2, 0, 2], fillColor: isTotal ? '#E9EFF5' : 'white' },
                  { text: this.formatCurrency(row[2]), style: isTotal ? 'totalCell' : 's2', alignment: 'right', margin: [0, 2, 0, 2], fillColor: isTotal ? '#E9EFF5' : 'white' },
                  { text: this.formatCurrency(row[3]), style: isTotal ? 'totalCell' : 's2', alignment: 'right', margin: [0, 2, 0, 2], fillColor: isTotal ? '#E9EFF5' : 'white' },
                  {
                    text: this.formatCurrency(row[4]),
                    style: isTotal ? 'totalCell' : 's5',
                    alignment: 'right',
                    margin: [0, 2, 0, 2],
                    fillColor: isTotal ? '#E9EFF5' : '#DCE6F0'
                  },
                  {
                    text: row[5],
                    style: isTotal ? 'totalCell' : 's5',
                    alignment: 'center',
                    margin: [0, 2, 0, 2],
                    fillColor: isTotal ? '#E9EFF5' : '#B8CCE3'
                  }
                ];
              })
            ]
          },
          layout: {
            hLineWidth: (i: any, node: any) => {
              if (i === 0 || i === 1 || i === node.table.body.length) return 1;
              return 0.5;
            },
            vLineWidth: (i: any, node: any) => {
              if (i === 0 || i === node.table.widths.length) return 0;
              return 0.5;
            },
            hLineColor: (i: any) => {
              if (i === 0 || i === 1) return '#4AACC5';
              return '#D9D9D9';
            },
            vLineColor: () => '#D9D9D9',
            vLineStyle: (i: any, node: any) => {
              if (i === 4) return { dash: { length: 1 } }; // Dotted line before last column
              return {};
            }
          }
        },

        // Footer
        {
          text: '\n*Please note rates and increase are calculated based on current year carrier rates in comparison to projected increases for next year.\n\nLJM Group\n312 Conklin Street, Farmingdale, NY 11735\nTel. 631-844-9500 info@myljm.com',
          style: 'footer',
          alignment: 'center',
          margin: [0, 20, 0, 0]
        },
        {
          text: " ", // gap
          pageBreak: index < scenariosDisplayed.length - 1 ? "after" : undefined
        }
      );
    }
    // const pageSize = this.calculatePageSize(tableArr.length);
    const docDefinition: any = {
      // pageSize: 'A4',
      pageSize: pageSize,
      pageOrientation: 'portrait',
      pageMargins: [20, 20, 20, 30],
      content: pdfContent,
      styles: {
        reportHeader: {
          fontSize: 13.5,
          bold: true,
          alignment: 'center',
          color: '#4F81BC',
          // fontFamily: 'Cambria'
        },
        s1: {
          fontSize: 9,
          bold: true,
          color: '#365F92',
          // fontFamily: 'Cambria'
        },
        s2: {
          fontSize: 7.5,
          color: '#585858',
          // fontFamily: 'Calibri'
        },
        s3: {
          fontSize: 7.5,
          color: '#585858',
          // fontFamily: 'Calibri',
          // decoration: 'underline'
        },
        s4: {
          fontSize: 7.5,
          bold: true,
          color: '#585858',
          // fontFamily: 'Calibri',
          // decoration: 'underline'
        },
        s5: {
          fontSize: 7.5,
          bold: true,
          color: '#585858',
          // fontFamily: 'Calibri'
        },
        s6: {
          fontSize: 6.5,
          bold: true,
          color: '#234061',
          // fontFamily: 'Cambria'
        },
        s7: {
          fontSize: 7.5,
          bold: true,
          color: '#355C7C',
          // fontFamily: 'Calibri'
        },
        tableHeader: {
          fontSize: 6.5,
          bold: true,
          color: '#234061',
          // fontFamily: 'Cambria'
        },
        tableCell: {
          fontSize: 7.5,
          color: '#585858',
          // fontFamily: 'Calibri'
        },
        totalCell: {
          fontSize: 7.5,
          bold: true,
          color: '#355C7C',
          // fontFamily: 'Calibri'
        },
        footer: {
          fontSize: 6,
          color: '#3A688D',
          // fontFamily: 'Cambria'
        }
      },
      defaultStyle: {
        // font: 'Calibri'
      }
    };

    // Download PDF
    var d = new Date();
    var currentDate = this.datePipe.transform(d, 'MM-dd-yyyy');
    var fileName = this.selectedCarrier.carrierName + '_GRI_Analysis_' + this.selectedCarrier.clientName + '_' + currentDate + '.pdf';
    pdfMake.createPdf(docDefinition).download(fileName);

    this.closeLoading();
  }


  downloadClick(event: any) {
    var handelerPosition = this.gerClickhandlerPosition(window.innerHeight, event.y);
    const dialogPosition: DialogPosition = {
      top: handelerPosition + 'px',
      left: event.x - 250 + 'px'
    };

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'filter-modalbox-excel';
    }

    let excelDialog = this.dialog.open(DownloadGRIComponent, {
      disableClose: true,
      width: "30% !important",
      height: "auto !important",
      position: dialogPosition,
      panelClass: [this.panelClass],
    });

    excelDialog.afterClosed().subscribe((data) => {
      if (data != undefined) {
        this.excelDownloadClickHandler(event, data)
      } this.closeLoading();
    });
  }
  adminFlag = false;
  async getCookieAdmin() {
    var adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    var loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (adminAccess != "" && loginCustomerType != "LJM_User" && loginCustomerType != "N") {
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }

  }
  async onDiscountChangeNewWeb(value: any, rowNumber: any, service: any, serviceType: string, type: any, columnNumber?: any) {

    var percentageCount = (value.match(/%/g) || []).length;
    var dotCount = (value.match(/%/g) || []).length;
    if (percentageCount == 2 || dotCount == 2 || value.includes("-")) {
      return false;
    }

    let discount = Number(Number(value.replaceAll('%', '')).toFixed(2));
    var minMaxList = '';

    if (serviceType == 'air') {
      minMaxList = "airMinMaxList";
    }
    else if (serviceType == 'ground') {
      minMaxList = "groundMinMaxList";
    }
    else if (serviceType == 'hwt') {
      minMaxList = "hwtMinMaxList";
    }
    else {
      minMaxList = "intlMinMaxList";
    }
    if (type == 'current') {
    }
    else if (type == 'target') {
      (this as any)[minMaxList].disMin = discount;
      (this as any)[minMaxList].disMax = discount;
    } return false;
  }

  deleteServiceList(rowIndex: any, serviceName: any, serviceType: any) {
    let serviceDataName = "";
    let typeservice = "";
    if (serviceType.toLowerCase() == 'air') {
      serviceDataName = 'DomesticAir';
      typeservice = "Freight";
    } else if (serviceType.toLowerCase() == 'ground') {
      serviceDataName = 'DomesticGround';
      typeservice = "Freight";
    } else if (serviceType.toLowerCase() == 'hwt') {
      serviceDataName = 'HundredWeight';
      typeservice = "HWT";
    } else if (serviceType.toLowerCase() == 'accessorial') {
      serviceDataName = 'Accessorial';
      typeservice = "Accessorial ";
    } else {
      serviceDataName = 'DomesticIntl';
      typeservice = "Freight";
    }

    let panelClass = "";
    if (this.themeoption == 'dark') {
      panelClass = 'page-dark'
    }

    var alertDialog = this.dialog.open(ResetPopupGRIComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { message: "Are you sure you want to delete??" },
    });

    alertDialog.afterClosed().subscribe(
      async result => {
        let message = '';
        let APIresult = false;
        var clientObj: any = {};
        clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
        clientObj['serviceType'] = typeservice;
        clientObj['serviceName'] = serviceName;
        this.openLoading();
        if (result == true) {
          if (this.carrierName.toLowerCase() == 'ups') {
            await this.httpclient.deleteServiceGRI(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = serviceName + " deleted successfully";
                APIresult = true;
              } else
                message = "Oops something went wrong!";
            }).catch((err) => { message = "Oops something went wrong!"; });
          } else {
            await this.fedexService.deleteServiceGRIFedEx(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = serviceName + " deleted successfully";
                APIresult = true;
              } else
                message = "Oops something went wrong!";
            }).catch((err) => { message = "Oops something went wrong!"; });
          }
          var resetDialog = this.dialog.open(AlertPopupComponent, {
            disableClose: true,
            width: '470px',
            height: 'auto',
            panelClass: panelClass,
            data: { pageValue: message },
          })
          resetDialog.afterClosed().subscribe(res => {
            if (APIresult)
              window.location.reload();
            // this.removeNewService(rowIndex,serviceDataName)
          })
        }
        this.closeLoading();
      });
  }

} 
