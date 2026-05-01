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
import { AccessorialContractsummaryComponent } from './accessorial-contractsummary/accessorial-contractsummary.component';
import { CreateProposalComponent } from './create-proposal/create-proposal.component';
import { DashBoardSaveAlertComponent } from './dasboard-save-alert/dashboard-save-alert.component';
import { DeleteAgreementComponent } from './deleteagreement/deleteagreement.component';
import { DimfactorContractsummaryComponent } from './dimfactor-contractsummary/dimfactor-contractsummary.component';
import { DiscountContractsummaryComponent } from './discount-contractsummary/discount-contractsummary.component';
import { ExcelExport } from './excel-export/excelexport.component';
import { FilterscreenComponent } from './filterscreen/filterscreen.component';
import { HundredweightTierComponent } from './hwttier-contractsummary/hwttier-contractsummary.component';
import { MinReductionContractsummaryComponent } from './minreduction-contractsummary/minreduction-contractsummary.component';
import { NoteDialogComponent } from './note-dialog/note-dialog-component';
import { ResetPopupComponent } from './reset-popup/reset-popup.component';

@Component({
  selector: 'app-ups-contract-summary',
  templateUrl: './contract-summary.component.html',
  styleUrls: ['./contract-summary.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class UpsContractSummaryComponent implements OnInit, AfterViewInit {
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
    { def: 'currentPercent', label: 'Current UPS%', hide: this.currentUPSPercent!.value },
    { def: 'currentSpend', label: 'Current Spend', hide: this.currentSpend!.value }
  ];

  columns = signal<any>([
    { field: 'Service', fieldVal: 'service' },
    { field: 'Weight Range', fieldVal: 'weightRange' },
    { field: 'Count', fieldVal: 'count' },
    { field: 'Current UPS%', fieldVal: 'currentPercent' },
    { field: 'Current Spend', fieldVal: 'currentSpend' }
  ]);

  columnsAcc = signal<any>([
    { field: 'Service', fieldVal: 'service' },
    { field: 'ServiceType', fieldVal: 'serviceType' },
    { field: 'Count', fieldVal: 'count' },
    { field: 'Current UPS%', fieldVal: 'currentPercent' },
    { field: 'Current Spend', fieldVal: 'currentSpend' }
  ]);

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
    // debugger;
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    this.defaultCarrier = this.cookiesService.getCookieItem('currentCarrierType');
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => { return res; });
    await this.setCarrier();
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
    var carrierData = await this.httpclient.fetchClientDetails(clientData).toPromise();
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
      var targetDetails = await this.fedexService.fetchTargetDetails(clientDetail).toPromise();
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
              displayProposal: element.displayProposal,
              totalNetSpend: 0,
              totalSavings: 0,
              totalSavingsPercent: 0,
              totalNetSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalNetSpendOld : 0,
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
                { def: 'targetPercent', label: (element.targetId == 0) ? 'Target %' : element.targetNickName + ' %', hide: false },
                { def: 'targetSpend', label: (element.targetId == 0) ? 'Target Spend' : element.targetNickName + ' Spend', hide: false },
                { def: 'savingsAmount', label: 'Savings $', hide: false },
                { def: 'targetSavingsPercent', label: 'Savings %', hide: false }
              ],
              columnsTarget: [
                { field: (element.targetId == 0) ? 'Target %' : element.targetNickName + ' %', fieldVal: 'targetPercent' },
                { field: (element.targetId == 0) ? 'Target Spend' : element.targetNickName + ' Spend', fieldVal: 'targetSpend' },
                { field: 'Savings $', fieldVal: 'savingsAmount' },
                { field: 'Savings %', fieldVal: 'targetSavingsPercent' }
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
              accessorialTargetDetailsExcel: [],
              columnsAccessorialTargetExcel: [
                { field: (element.targetId == 0) ? 'TARGET DISCOUNT %' : element.targetNickName + ' %', fieldVal: 'targetAccPercent' },
                { field: (element.targetId == 0) ? 'TARGET DISCOUNT TYPE' : element.targetNickName + ' type', fieldVal: 'targetAccType' },
                { field: (element.targetId == 0) ? 'TARGET SPEND' : element.targetNickName + ' Spend', fieldVal: 'targetAccSpend' },
              ],
            }
          );
          this.availableIdList.push(element.targetId);
        }
      });
    }
    else {
      clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
      var targetDetails = await this.httpclient.fetchTargetDetails(clientDetail).toPromise();
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
              displayProposal: element.displayProposal,
              totalNetSpend: 0,
              totalSavings: 0,
              totalSavingsPercent: 0,
              totalNetSpendOld: (this.currentDIMTable != "" && rowNumber != -1) ? this.scenariosDisplayed[rowNumber].totalNetSpendOld : 0,
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
                { def: 'targetPercent', label: (element.targetId == 0) ? 'Target %' : element.targetNickName + ' %', hide: false },
                { def: 'targetSpend', label: (element.targetId == 0) ? 'Target Spend' : element.targetNickName + ' Spend', hide: false },
                { def: 'savingsAmount', label: 'Savings $', hide: false },
                { def: 'targetSavingsPercent', label: 'Savings %', hide: false }
              ],
              columnsTarget: [
                { field: (element.targetId == 0) ? 'Target %' : element.targetNickName + ' %', fieldVal: 'targetPercent' },
                { field: (element.targetId == 0) ? 'Target Spend' : element.targetNickName + ' Spend', fieldVal: 'targetSpend' },
                { field: 'Savings $', fieldVal: 'savingsAmount' },
                { field: 'Savings %', fieldVal: 'targetSavingsPercent' }
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
              accessorialTargetDetailsExcel: [],
              columnsAccessorialTargetExcel: [
                { field: (element.targetId == 0) ? 'TARGET DISCOUNT %' : element.targetNickName + ' %', fieldVal: 'targetAccPercent' },
                { field: (element.targetId == 0) ? 'TARGET DISCOUNT TYPE' : element.targetNickName + ' TYPE', fieldVal: 'targetAccType' },
                { field: (element.targetId == 0) ? 'TARGET SPEND' : element.targetNickName + ' SPEND', fieldVal: 'targetAccSpend' },
              ],
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
    var displayProposalList = this.totalScenarios.filter((data: any) => data.displayProposal == 1);
    if (displayProposalList.length > 2) {
      defaultLength = 1;
    }
    else {
      defaultLength = displayProposalList.length;
    }
    if (targetIdList.length == 0) {
      for (let index = 0; index < defaultLength; index++) {
        var rowNumber = this.totalScenarios.findIndex((data: any) => data.targetId == displayProposalList[index].targetId);
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
      const grouping = data.serviceGrouping?.toLowerCase();
      if (grouping == 'air') {
        if (!(this.distinctAirServices.includes(data.service))) {
          this.distinctAirServices.push(data.service);
          this.distinctAirServiceName.push(data.serviceName);
          this.distinctAirExcelServiceName.push(data.finalService);
        }
      }
      else if (grouping == 'ground' || grouping == 'home delivery' || grouping == 'smartpost' || grouping == 'ground economy') {
        if (!(this.distinctGroundServices.includes(data.service))) {
          this.distinctGroundServices.push(data.service);
          this.distinctGroundServiceName.push(data.serviceName);
          this.distinctGroundExcelServiceName.push(data.finalService);
          this.distinctGroundNewService.push(data.newService);
        }
      }

      else if (grouping == 'hwt') {
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
        let grouping = data.serviceGrouping?.toLowerCase();
        if (grouping == 'air') {
          if (!(this.scenariosDisplayed[columnNumber].distinctAirServices.includes(data.service))) {
            this.scenariosDisplayed[columnNumber].distinctAirServices.push(data.service);
            this.scenariosDisplayed[columnNumber].distinctAirServiceName.push(data.serviceName);
            this.scenariosDisplayed[columnNumber].distinctAirExcelServiceName.push(data.finalService);
          }
        }
        else if (grouping == 'ground' || grouping == 'home delivery' || grouping == 'smartpost' || grouping == 'ground economy') {
          if (!(this.scenariosDisplayed[columnNumber].distinctGroundServices.includes(data.service))) {
            this.scenariosDisplayed[columnNumber].distinctGroundServices.push(data.service);
            this.scenariosDisplayed[columnNumber].distinctGroundServiceName.push(data.serviceName);
            this.scenariosDisplayed[columnNumber].distinctGroundExcelServiceName.push(data.finalService);
            this.scenariosDisplayed[columnNumber].distinctGroundNewService.push(data.newService);
          }
        }
        else if (grouping == 'hwt') {
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
          observables.push(this.fedexService.fetchFreightDetails(clientDetailcurrent));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.fedexClientId;
          targetObj['carrierName'] = this.carrierName;
          targetObj['type'] = 'Current';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.fedexService.generateProposalFedExCurrentDIM(targetObj));
        }

        let clientObj: any = {};
        clientObj['type'] = 'create';
        clientObj['carrier'] = this.carrierName;
        clientObj['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchfreightEditProposal(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.fedexClientId;
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        if (this.currentDIMTable == "") {
          observables.push(this.fedexService.fetchFreightDetailsTarget(clientDetailtarget1));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.fedexClientId;
          targetObj['targetId'] = this.scenariosDisplayed[0].targetId;
          targetObj['carrierName'] = this.scenariosDisplayed[0].carrierName;
          targetObj['type'] = 'Edit';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.fedexService.generateProposalFedExCurrentDIM(targetObj));
        }

        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchfreightEditProposal(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.fedexClientId;
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          if (this.currentDIMTable == "") {
            observables.push(this.fedexService.fetchFreightDetailsTarget(clientDetailtarget2));
          }
          else {
            let targetObj: any = {};
            targetObj['clientId'] = this.fedexClientId;
            targetObj['targetId'] = this.scenariosDisplayed[1].targetId;
            targetObj['carrierName'] = this.scenariosDisplayed[1].carrierName;
            targetObj['type'] = 'Edit';
            targetObj['dimTableName'] = this.currentDIMTable;
            observables.push(this.fedexService.generateProposalFedExCurrentDIM(targetObj));
          }

          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.fedexClientId;
          observables.push(this.fedexService.fetchfreightEditProposal(clientObj2));
        }
      }

    }
    else {

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
        if (this.currentDIMTable == "") {
          observables.push(this.httpclient.fetchFreightDetails(clientDetailcurrent));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          targetObj['carrierName'] = this.carrierName;
          targetObj['type'] = 'Current';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.httpclient.generateProposalCurrentDIM(targetObj));
        }

        let clientObj: any = {};
        clientObj['type'] = 'create';
        clientObj['carrier'] = this.carrierName;
        clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchfreightEditProposal(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.cookiesService.getCookieItem('clientId');
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        if (this.currentDIMTable == "") {
          observables.push(this.httpclient.fetchFreightDetailsTarget(clientDetailtarget1));
        }
        else {
          let targetObj: any = {};
          targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          targetObj['targetId'] = this.scenariosDisplayed[0].targetId;
          targetObj['carrierName'] = this.scenariosDisplayed[0].carrierName;
          targetObj['type'] = 'Edit';
          targetObj['dimTableName'] = this.currentDIMTable;
          observables.push(this.httpclient.generateProposalCurrentDIM(targetObj));
        }

        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchfreightEditProposal(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          if (this.currentDIMTable == "") {
            observables.push(this.httpclient.fetchFreightDetailsTarget(clientDetailtarget2));
          }
          else {
            let targetObj: any = {};
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
            targetObj['targetId'] = this.scenariosDisplayed[1].targetId;
            targetObj['carrierName'] = this.scenariosDisplayed[1].carrierName;
            targetObj['type'] = 'Edit';
            targetObj['dimTableName'] = this.currentDIMTable;
            observables.push(this.httpclient.generateProposalCurrentDIM(targetObj));
          }

          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.cookiesService.getCookieItem('clientId');
          observables.push(this.httpclient.fetchfreightEditProposal(clientObj2));
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
      observables.push(this.fedexService.fetchDimFactorDetails(clientDetailDimandMin));
      observables.push(this.fedexService.fetchMinDetails(clientDetailDimandMin));

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchAccessorialDetails(clientDetailcurrent));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.fedexClientId;
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        observables.push(this.fedexService.fetchAccessorialDetailsTarget(clientDetailtarget1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.fedexClientId;
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          observables.push(this.fedexService.fetchAccessorialDetailsTarget(clientDetailtarget2));
        }
      }

    }
    else {

      var clientDetailDimandMin: any = {};
      clientDetailDimandMin['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientDetailDimandMin['targetId'] = this.targetIdList.toString();
      observables.push(this.httpclient.fetchDimFactorDetails(clientDetailDimandMin));
      observables.push(this.httpclient.fetchMinDetails(clientDetailDimandMin));

      if (this.loaded == false) {
        var clientDetailcurrent: any = {};
        clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchAccessorialDetails(clientDetailcurrent));
      }
      if (this.scenariosDisplayed[0].loaded == false) {
        var clientDetailtarget1: any = {};
        clientDetailtarget1['clientId'] = this.cookiesService.getCookieItem('clientId');
        clientDetailtarget1['targetId'] = this.scenariosDisplayed[0].targetId;
        observables.push(this.httpclient.fetchAccessorialDetailsTarget(clientDetailtarget1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          var clientDetailtarget2: any = {};
          clientDetailtarget2['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientDetailtarget2['targetId'] = this.scenariosDisplayed[1].targetId;
          observables.push(this.httpclient.fetchAccessorialDetailsTarget(clientDetailtarget2));
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
        observables.push(this.fedexService.fetchDimFactor(clientObj));
        observables.push(this.fedexService.fetchAccDetailsPopup(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.fedexClientId;
        observables.push(this.fedexService.fetchDimFactor(clientObj1));
        observables.push(this.fedexService.fetchAccDetailsPopup(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.fedexClientId;
          observables.push(this.fedexService.fetchDimFactor(clientObj2));
          observables.push(this.fedexService.fetchAccDetailsPopup(clientObj2));
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
        observables.push(this.httpclient.fetchDimFactor(clientObj));
        observables.push(this.httpclient.fetchAccDetailsPopup(clientObj));
      }

      if (this.scenariosDisplayed[0].loaded == false) {
        let clientObj1: any = {};
        clientObj1['type'] = 'Edit';
        clientObj1['targetId'] = this.scenariosDisplayed[0].targetId;
        clientObj1['clientId'] = this.cookiesService.getCookieItem('clientId');
        observables.push(this.httpclient.fetchDimFactor(clientObj1));
        observables.push(this.httpclient.fetchAccDetailsPopup(clientObj1));
      }

      if (this.scenariosDisplayed.length > 1) {
        if (this.scenariosDisplayed[1].loaded == false) {
          let clientObj2: any = {};
          clientObj2['type'] = 'Edit';
          clientObj2['targetId'] = this.scenariosDisplayed[1].targetId;
          clientObj2['clientId'] = this.cookiesService.getCookieItem('clientId');
          observables.push(this.httpclient.fetchDimFactor(clientObj2));
          observables.push(this.httpclient.fetchAccDetailsPopup(clientObj2));
        }
      }

    }
    return forkJoin(observables);

  }
  async getData() {

    this.openLoading();
    var clientDetail = {};

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
      var accessorialServices = await this.httpclient.fetchAccessorialLookup(clientDetail).toPromise();

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
            totalSavings = currentService[0].currentSpend - totalTargetSpend;
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
      this.targetSavingsAccTotalList.push({
        count: '',
        targetPercent: '',
        targetSpend: totalTargetSpend,
        targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) != 0) ? (totalSavings / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
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
            totalSavings = currentService[0].currentSpend - totalTargetSpend;
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

      this.targetSavingsAccTotalList.push({
        count: '',
        targetPercent: '',
        targetSpend: totalTargetSpend,
        targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) != 0) ? (totalSavings / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
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
      var data = await this.fedexService.fetchfreightEditProposal(clientObj).toPromise();
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


        var dimData = await this.fedexService.fetchDimFactor(clientObj).toPromise()
        this.dimProposalList = dimData.filter((value: any) => value.category == 'Proposed');
        this.accessorialProposalList = await this.fedexService.fetchAccDetailsPopup(clientObj).toPromise();
      }
    }
    else {
      clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
      var data = await this.httpclient.fetchfreightEditProposal(clientObj).toPromise();
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

        var dimData = await this.httpclient.fetchDimFactor(clientObj).toPromise()
        this.dimProposalList = dimData.filter((value: any) => value.category == 'Proposed');
        this.accessorialProposalList = await this.httpclient.fetchAccDetailsPopup(clientObj).toPromise();
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
      this.hwtAccountNumbersList = await this.fedexService.fetchAccountNumber(clientData).toPromise();
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      this.hwtAccountNumbersList = await this.httpclient.fetchAccountNumber(clientData).toPromise();
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

      this.scenariosDisplayed[scenarioIndex].totalSavings = Number((this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount + this.targetSavingsAccTotalList[0].savingsAmount).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalSavingsPercent = (this.totalCurrentSpend == 0) ? 0.00 : Number(((this.scenariosDisplayed[scenarioIndex].totalSavings / this.totalCurrentSpend) * 100).toFixed(2));
      // this.scenariosDisplayed[scenarioIndex].totalSavingsPercent = (this.scenariosDisplayed[scenarioIndex].totalSavings < 0) ? -this.scenariosDisplayed[scenarioIndex].totalSavingsPercent : this.scenariosDisplayed[scenarioIndex].totalSavingsPercent;

      this.scenariosDisplayed[scenarioIndex].totalFreightSavings = Number((this.targetSavingsAirTotalList[0].savingsAmount + this.targetSavingsGroundTotalList[0].savingsAmount + this.targetSavingsIntlTotalList[0].savingsAmount + this.targetSavingsHWTTotalList[0].savingsAmount).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent = (this.totalFreightSpend == 0) ? 0.00 : Number(((this.scenariosDisplayed[scenarioIndex].totalFreightSavings / this.totalFreightSpend) * 100).toFixed(2));
      // this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent = (this.scenariosDisplayed[scenarioIndex].totalFreightSavings < 0) ? -this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent : this.scenariosDisplayed[scenarioIndex].totalFreightSavingsPercent;

      this.scenariosDisplayed[scenarioIndex].totalAccSavings = Number(Number(this.targetSavingsAccTotalList[0].savingsAmount).toFixed(2));
      this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercent = (this.totalAccSpend == 0) ? 0.00 : Number(((this.scenariosDisplayed[scenarioIndex].totalAccSavings / this.totalAccSpend) * 100).toFixed(2));
      // this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercent = (this.scenariosDisplayed[scenarioIndex].totalAccSavings < 0) ? -this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercent : this.scenariosDisplayed[scenarioIndex].totalAccSavingsPercent;
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
    this.scenariosDisplayed[index].totalSavings = 0;
    this.scenariosDisplayed[index].totalNetSpend += this.targetSavingsAirTotalList[0].targetSpend + this.targetSavingsGroundTotalList[0].targetSpend + this.targetSavingsIntlTotalList[0].targetSpend + this.targetSavingsHWTTotalList[0].targetSpend + this.targetSavingsAccTotalList[0].targetSpend;
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
    const dialogRef = this.dialog.open(FilterscreenComponent, {
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
    const dialogConfig = this.dialog.open(CreateProposalComponent, {
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
            var targetDetails = await this.fedexService.fetchTargetDetails(clientDetail).toPromise();

            targetDetails.forEach((element: any) => {


              let index = this.scenariosDisplayed.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index != -1) {
                this.scenariosDisplayed[index].agreementNo = element.agreementNo;
                this.scenariosDisplayed[index].targetNickName = element.targetNickName;
              }

              let index2 = this.totalScenarios.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index2 != -1) {
                this.totalScenarios[index2].agreementNo = element.agreementNo;
                this.totalScenarios[index2].targetNickName = element.targetNickName;
              }

            });
          }
          else {
            clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
            var targetDetails = await this.httpclient.fetchTargetDetails(clientDetail).toPromise();

            targetDetails.forEach((element: any) => {

              let index = this.scenariosDisplayed.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index != -1) {
                this.scenariosDisplayed[index].agreementNo = element.agreementNo;
                this.scenariosDisplayed[index].targetNickName = element.targetNickName;
              }

              let index2 = this.totalScenarios.findIndex((scenario: any) => scenario.targetId == element.targetId);
              if (index2 != -1) {
                this.totalScenarios[index2].agreementNo = element.agreementNo;
                this.totalScenarios[index2].targetNickName = element.targetNickName;
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
              var resetDialog = this.dialog.open(ResetPopupComponent, {
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

  openNoteDialog(clickValue: any, selectedScenario: any) {
    const panelClass = this.themeoption === 'dark' ? 'page-dark' : 'note-dialog-light';
    let clientId;
    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
      clientId = this.fedexClientId;
    } else {
      clientId = this.cookiesService.getCookieItem('clientId');
    }

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      disableClose: true,
      width: '520px',
      maxWidth: '50vw',
      panelClass: [panelClass],
      data: {
        carrierDetails: this.selectedCarrier,   // sample value
        target: selectedScenario,           // optional
        noteTitle: 'Add Note for ' + clickValue,
        clientId: clientId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.saved) {
        console.log('Note saved:', result.note);
        // ⤵ You can now save this note to DB or update UI
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
      var editSaveDialog = this.dialog.open(DashBoardSaveAlertComponent, {
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
            if (this.netAmountMinMaxList[row].target1Min.includes('$')) {
              minType = '$';
            }
            else if (this.netAmountMinMaxList[row].target1Min.includes('%')) {
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
            await this.httpclient.saveOrUpdateDiscounts(clientObj).toPromise();

            clientObj['freightDetailsList'] = hwtList;
            await this.httpclient.saveOrUpdateDiscountsHWT(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;

            await this.httpclient.saveOrUpdateAccountNumber(clientObj).toPromise();

            clientObj['type'] = "Current";
            clientObj['accDetailsList'] = accList;
            await this.httpclient.saveOrUpdateAccDiscounts(clientObj).toPromise();

            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            await this.httpclient.saveOrUpdateAccDetails(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            await this.httpclient.saveOrUpdateFreightDetails(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            await this.httpclient.saveOrUpdateHWTDetails(clientObj).toPromise();

            var targetObj: any = {};
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
            targetObj['targetId'] = clientObj['targetId']
            targetObj['carrierName'] = this.carrierName;
            targetObj['type'] = 'Current';


            result = await this.httpclient.generateProposal(targetObj).toPromise().catch((err) => {
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
            await this.fedexService.saveOrUpdateDiscounts(clientObj).toPromise();

            clientObj['freightDetailsList'] = hwtList;
            await this.fedexService.saveOrUpdateDiscountsHWT(clientObj).toPromise();

            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;
            await this.fedexService.saveOrUpdateAccountNumber(clientObj).toPromise();

            clientObj['type'] = "Current";
            clientObj['accDetailsList'] = accList;
            await this.fedexService.saveOrUpdateAccDiscounts(clientObj).toPromise();

            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            await this.fedexService.saveOrUpdateAccDetails(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            await this.fedexService.saveOrUpdateFreightDetails(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            await this.fedexService.saveOrUpdateHWTDetails(clientObj).toPromise();

            var targetObj: any = {};
            targetObj['clientId'] = this.fedexClientId;
            targetObj['targetId'] = clientObj['targetId'];
            targetObj['carrierName'] = this.carrierName;
            targetObj['type'] = 'Current';
            result = await this.fedexService.generateProposal(targetObj).toPromise().catch((err) => {
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
            await this.httpclient.saveorUpdateServiceBreakup(param).toPromise();
          }
          else {
            await this.fedexService.saveorUpdateServiceBreakup(param).toPromise();
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

      var editSaveDialog = this.dialog.open(DashBoardSaveAlertComponent, {
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
              var targetDetails = await this.httpclient.saveOrUpdateTargetDetails(targetObj).toPromise();
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
              var targetDetails = await this.fedexService.saveOrUpdateTargetDetails(targetObj).toPromise();
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
            if (this.netAmountMinMaxList[row].target1Min.includes('$')) {
              minType = '$';
            }
            else if (this.netAmountMinMaxList[row].target1Min.includes('%')) {
              minType = '%';
            }
            else {
              minType = '%';
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
            await this.httpclient.saveOrUpdateDiscounts(clientObj).toPromise();

            clientObj['freightDetailsList'] = hwtList;
            await this.httpclient.saveOrUpdateDiscountsHWT(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;

            await this.httpclient.saveOrUpdateAccountNumber(clientObj).toPromise();

            clientObj['dimDetailsList'] = dimList;
            await this.httpclient.saveOrUpdateDIM(clientObj).toPromise();

            clientObj['accDetailsList'] = accList;
            await this.httpclient.saveOrUpdateAccDiscounts(clientObj).toPromise();

            delete clientObj['dimDetailsList'];
            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            clientObj['type'] = "Edit";
            await this.httpclient.saveOrUpdateAccDetailsHistory(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            clientObj['type'] = "Edit";
            await this.httpclient.saveOrUpdateFreightDetailsHistory(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            clientObj['type'] = "Edit";
            await this.httpclient.saveOrUpdateHWTDetailsHistory(clientObj).toPromise();

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
            var result = await this.httpclient.generateProposal(targetObj).toPromise();
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
            await this.fedexService.saveOrUpdateDiscounts(clientObj).toPromise();
            clientObj['freightDetailsList'] = hwtList;
            await this.fedexService.saveOrUpdateDiscountsHWT(clientObj).toPromise();

            clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;
            // await this.fedexService.saveOrUpdateAccountNumber(clientObj).toPromise();

            clientObj['dimDetailsList'] = dimList;
            await this.fedexService.saveOrUpdateDIM(clientObj).toPromise();
            clientObj['accDetailsList'] = accList;
            await this.fedexService.saveOrUpdateAccDiscounts(clientObj).toPromise();

            delete clientObj['dimDetailsList'];
            delete clientObj['accNoDetailsList'];
            clientObj['accDetailsList'] = spendSaveList;
            clientObj['type'] = "Edit";
            await this.fedexService.saveOrUpdateAccDetailsHistory(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = freightSpendSaveList;
            clientObj['type'] = "Edit";
            await this.fedexService.saveOrUpdateFreightDetailsHistory(clientObj).toPromise();

            delete clientObj['freightDetailsList'];
            clientObj['freightDetailsList'] = hwtSpendSaveList;
            clientObj['type'] = "Edit";
            await this.fedexService.saveOrUpdateHWTDetailsHistory(clientObj).toPromise();

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
            var result = await this.fedexService.generateProposal(targetObj).toPromise();
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
            await this.httpclient.saveorUpdateServiceBreakup(param).toPromise();
          }
          else {
            await this.fedexService.saveorUpdateServiceBreakup(param).toPromise();
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

    const dialogRef = this.dialog.open(DiscountContractsummaryComponent, {
      disableClose: true,
      width: "86%",
      height: "86%",
      panelClass: this.panelClass,
      data: { serviceType: serviceType, tabIndex: index, service: serviceName, targetIdList: targetId, targetNameList: targetName, targetList: this.scenariosDisplayed, carrier: this.selectedCarrier, fedexId: this.fedexClientId, newService: newService }
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

            var resetDialog = this.dialog.open(ResetPopupComponent, {
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

    const dialogRef = this.dialog.open(AccessorialContractsummaryComponent, {
      disableClose: true,
      width: "86vw",
      height: "86vh",
      panelClass: this.panelClass,
      data: { service: service, serviceName: serviceName, targetIdList: targetId, targetNameList: targetName, targetList: this.scenariosDisplayed, carrier: this.selectedCarrier, fedexId: this.fedexClientId, currentCheckList: this.currentAccCheckList }
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

              var resetDialog = this.dialog.open(ResetPopupComponent, {
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

          totalSavings = currentService[0].currentSpend - totalTargetSpend;
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

            totalSavings = currentService[0].currentSpend - totalTargetSpend;
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

      const dialogRef = this.dialog.open(DimfactorContractsummaryComponent, {
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

              var resetDialog = this.dialog.open(ResetPopupComponent, {
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

    const dialogRef = this.dialog.open(MinReductionContractsummaryComponent, {
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
        order: (this.targetIdList.toString() == targetIdList.toString())
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
            var resetDialog = this.dialog.open(ResetPopupComponent, {
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

    const dialogRef = this.dialog.open(HundredweightTierComponent, {
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

    for (let columnNumber in this.scenariosDisplayed) {
      if (value) {
        this.scenariosDisplayed[columnNumber][targetList].data[rowNumber][columnName] = value[0].toUpperCase() + value.slice(1);
      }
      else {
        this.scenariosDisplayed[columnNumber][targetList].data[rowNumber][columnName] = '';
      }
      this.scenariosDisplayed[columnNumber][targetList].data[rowNumber]['serviceName'] = this.scenariosDisplayed[columnNumber][targetList].data[rowNumber]['service'];
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
      var dataSource = "";

      if (service == 'air') {
        this.currentSavingsAirList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsAirTotalList';
        targetTotalList = 'targetSavingsAirTotalList'
        targetName = "dataSourceAirTarget";
        currentTotalListName = 'dataSourceCurrentAirTotal';
        targetTotalListName = 'dataSourceTargetAirTotal';
        totalServiceName = "Express Pricing :";
        dataSource = "currentSavingsAirList";
      }
      else if (service == 'ground') {
        this.currentSavingsGroundList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsGroundTotalList';
        targetTotalList = 'targetSavingsGroundTotalList'
        targetName = "dataSourceGroundTarget";
        currentTotalListName = 'dataSourceCurrentGroundTotal'
        targetTotalListName = 'dataSourceTargetGroundTotal';
        totalServiceName = "Ground Pricing :";
        dataSource = "currentSavingsGroundList";
      }
      else if (service == 'hwt') {
        this.currentSavingsHWTList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsHWTTotalList';
        targetTotalList = 'targetSavingsHWTTotalList'
        targetName = "dataSourceHWTTarget";
        currentTotalListName = 'dataSourceCurrentHWTTotal';
        targetTotalListName = 'dataSourceTargetHWTTotal';
        totalServiceName = "Hundredweight Pricing :";
        dataSource = "currentSavingsHWTList";
      }
      else {
        this.currentSavingsIntlList.forEach((data: any) => currentList.push(Object.assign({}, data)));
        currentTotalList = 'currentSavingsIntlTotalList';
        targetTotalList = 'targetSavingsIntlTotalList'
        targetName = "dataSourceIntlTarget";
        currentTotalListName = 'dataSourceCurrentIntlTotal'
        targetTotalListName = 'dataSourceTargetIntlTotal';
        totalServiceName = "International Pricing :";
        dataSource = "currentSavingsIntlList";
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

    // ✅ Calculation
    targetList[rowNumber].savingsAmount =
      Number((currentSpend - targetSpend).toFixed(2));

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
        targetList[rowNumber].savingsAmount = currentList[rowNumber].currentSpend - targetList[rowNumber].targetSpend;

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
            targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
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


        this.targetSavingsAccTotalList = [];
        this.targetSavingsAccTotalList.push({
          weightRange: '',
          count: '',
          targetPercent: '',
          targetSpend: calculatedTargetService['totalTargetSpend'],
          targetSavingsPercent: (Math.abs(this.currentSavingsAccTotalList[0].currentSpend) > 0) ? (calculatedTargetService['totalSavings'] / this.currentSavingsAccTotalList[0].currentSpend) * 100 : 0,
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
        targetList[rowNumber].savingsAmount = currentList[rowNumber].currentSpend - targetList[rowNumber].targetSpend;

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
    targetList[rowNumber].savingsAmount = (Math.abs(Number(Number(currentList[rowNumber].currentSpend).toFixed(2)) - Number(Number(targetList[rowNumber].targetSpend).toFixed(2))).toFixed(2) == '0.00') ? 0.00 : (Number(Number(currentList[rowNumber].currentSpend).toFixed(2)) - Number(Number(targetList[rowNumber].targetSpend).toFixed(2)));
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

    var savingsPercent = Number(((currentSpend - targetSpend) / currentSpend).toFixed(4));

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
      let targetGrossAmount = Number((baselineGrossAmount * (1 - savingsPercent)).toFixed(2));

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
        if (serviceType == 'hwt' || serviceName == "FedEx Intl Prty DirDist" || filteredData[key].dataType == 'New Web') {
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
        if (service.toLowerCase() == 'hwt' || distinctServices[index] == "FedEx Intl Prty DirDist" || filteredData[key].dataType == 'New Web') {
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
            totalSavings = currentService[0].currentSpend - totalTargetSpend;
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
          totalSavings = currentService[0].currentSpend - totalTargetSpend;
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

        totalSavings = currentService[0].currentSpend - totalTargetSpend;
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
      { field: 'Current Dim Factor', fieldVal: 'baselineDimFactor' },
    ]);

    this.columnsMinReduction.set([
      { field: 'Service', fieldVal: 'service' },
      { field: 'Current Min Reduction ' + this.carrierName, fieldVal: 'currentMin' },
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
      this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Dim Factor', fieldVal: 'targetDimDivisor' });
      this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'targetDimDivisor';
      this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Min Reduction', fieldVal: 'targetMin1', columnNumber: 0 });
      this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin1';
      if (this.scenariosDisplayed.length > 1) {
        this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Dim Factor', fieldVal: 'proposalDimDivisor' });
        this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'proposalDimDivisor';
        this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Min Reduction', fieldVal: 'targetMin2', columnNumber: 1 });
        this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin2';
      }
    }
    else {
      this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' DIM Factor', fieldVal: 'proposalDimDivisor' });
      this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'proposalDimDivisor';
      this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Min Reduction', fieldVal: 'targetMin2', columnNumber: 0 });
      this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin2';
      if (this.scenariosDisplayed.length > 1) {
        this.columnsDimFactor()[this.columnsDimFactor().length] = Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' DIM Factor', fieldVal: 'targetDimDivisor' });
        this.displayedColumnsDIM[this.displayedColumnsDIM.length] = 'targetDimDivisor';
        this.columnsMinReduction()[this.columnsMinReduction().length] = Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Min Reduction', fieldVal: 'targetMin1', columnNumber: 1 });
        this.displayedColumnsMin[this.displayedColumnsMin.length] = 'targetMin1';
      }
    }
  }
  async setColumn() {
    this.columns()[3].field = "Current " + this.selectedCarrier.carrierName + " %";
    this.columnsAcc()[3].field = "Current " + this.selectedCarrier.carrierName + " %";
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


  excelDownloadClickHandler(event: any) {

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

    let excelDialog = this.dialog.open(ExcelExport, {
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
      },
      panelClass: [this.panelClass],
    });

    excelDialog.afterClosed().subscribe((data: any) => {
      if (data != undefined) {
        const externalReportFlag = data.addExternalReport ? true : false;
        this.excelDownload(data.selected, externalReportFlag);
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
      var unfilteredData: any = await this.fedexService.fetchFreightDetailsTarget(clientDetail).toPromise();

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
      var unfilteredData: any = await this.httpclient.fetchFreightDetailsTarget(clientDetail).toPromise();
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
      var unfilteredData: any = await this.fedexService.fetchAccessorialDetailsTarget(clientDetail).toPromise();
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
            totalSavings = currentService[0].currentSpend - totalTargetSpend;
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
      var unfilteredData: any = await this.httpclient.fetchAccessorialDetailsTarget(clientDetail).toPromise();
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
            totalSavings = currentService[0].currentSpend - totalTargetSpend;
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

  async excelDownload(scenarios: number[], externalReportFlag: boolean) {
    this.openLoading();
    let scenariosDisplayed = []
    let selectedScenarios = [];
    let dimFactorList: any = [];
    let netAmountMinMaxList: any = [];
    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
      this.currentSavingsAccExcelList = [];
      var clientDetailcurrent: any = {};
      clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
      var dataCurrentExcel: any = await this.fedexService.fetchAccessorialDetailsExcel(clientDetailcurrent).toPromise();
      this.currentSavingsAccExcelList = dataCurrentExcel;
    }
    else {
      this.currentSavingsAccExcelList = [];
      var clientDetailcurrent: any = {};
      clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
      var dataCurrentExcel: any = await this.httpclient.fetchAccessorialDetailsExcel(clientDetailcurrent).toPromise();
      this.currentSavingsAccExcelList = dataCurrentExcel;
    }
    if (externalReportFlag) {
      if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
        const clientId = this.cookiesService.getCookieItem('clientId');
        try {
          const dataCurrentSccExcel: any = await this.fedexService.fetchEarnedDiscDetails(clientId).toPromise();
          this.earnedDescExcelList = dataCurrentSccExcel;
        } catch (error) {
          console.error('Error fetching SCC details:', error);
        }
        try {
          const dataCurrentWeightExcel: any = await this.fedexService.fetchUPsGroundWeightDetails(clientId).toPromise();
          this.weightZoneExcelList = dataCurrentWeightExcel;
        } catch (error) {
          console.error('Error fetching SCC details:', error);
        }
        try {
          const dataCurrentServZoneExcel: any = await this.fedexService.fetchUPsServZoneDetails(clientId).toPromise();
          this.servZoneExcelList = dataCurrentServZoneExcel;
        } catch (error) {
          console.error('Error fetching SCC details:', error);
        }
        try {
          const dataCurrentDimsExcel: any = await this.fedexService.fetchUPsDimsDetails(clientId).toPromise();
          this.dimsExcelList = dataCurrentDimsExcel;
        } catch (error) {
          console.error('Error fetching Dims details:', error);
        }
        try {
          const dataCurrentLocationExcel: any = await this.fedexService.fetchUPsLocationsDetails(clientId).toPromise();
          this.locationsExcelList = dataCurrentLocationExcel;
        } catch (error) {
          console.error('Error fetching Location details:', error);
        }
        try {
          const dataCurrentGroundExcel: any = await this.fedexService.fetchUPsGroundDetails(clientId).toPromise();
          this.groundExcelList = dataCurrentGroundExcel;
        } catch (error) {
          console.error('Error fetching ground details:', error);
        }
        try {
          const dataCurrentChargeDescExcel: any = await this.fedexService.fetchUPsChargeDescDetails(clientId).toPromise();
          this.chargeDescExcelList = dataCurrentChargeDescExcel;
        } catch (error) {
          console.error('Error fetching chargeDesc details:', error);
        }
        try {
          const dataCurrentExecutiveSummaryExcel: any = await this.fedexService.fetchUPsExecuteSummaryDetails(clientId).toPromise();
          this.executiveSummaryExcelList = dataCurrentExecutiveSummaryExcel;
        } catch (error) {
          console.error('Error fetching executiveSummary details:', error);
        }
        try {
          const dataCurrentInvoiceSummaryExcel: any = await this.fedexService.fetchUPsInvoiceSummaryDetails(clientId).toPromise();
          this.invoiceSummaryExcelList = dataCurrentInvoiceSummaryExcel;
        } catch (error) {
          console.error('Error fetching invoice Summary details:', error);
        }
      } else {
        const clientId = this.cookiesService.getCookieItem('clientId');
        try {
          const dataCurrentSccExcel: any = await this.httpclient.fetchSccDetails(clientId).toPromise();
          this.sccExcelList = dataCurrentSccExcel;
        } catch (error) {
          console.error('Error fetching SCC details:', error);
        }
        try {
          const dataCurrentWeightExcel: any = await this.httpclient.fetchUPsGroundWeightDetails(clientId).toPromise();
          this.weightZoneExcelList = dataCurrentWeightExcel;
        } catch (error) {
          console.error('Error fetching WeightZone details:', error);
        }
        try {
          const dataCurrentServZoneExcel: any = await this.httpclient.fetchUPsServZoneDetails(clientId).toPromise();
          this.servZoneExcelList = dataCurrentServZoneExcel;
        } catch (error) {
          console.error('Error fetching ServiceZone details:', error);
        }
        try {
          const dataCurrentDimsExcel: any = await this.httpclient.fetchUPsDimsDetails(clientId).toPromise();
          this.dimsExcelList = dataCurrentDimsExcel;
        } catch (error) {
          console.error('Error fetching Dims details:', error);
        }
        try {
          const dataCurrentLocationExcel: any = await this.httpclient.fetchUPsLocationsDetails(clientId).toPromise();
          this.locationsExcelList = dataCurrentLocationExcel;
        } catch (error) {
          console.error('Error fetching Location details:', error);
        }
        try {
          const dataCurrentGroundExcel: any = await this.httpclient.fetchUPsGroundDetails(clientId).toPromise();
          this.groundExcelList = dataCurrentGroundExcel;
        } catch (error) {
          console.error('Error fetching ground details:', error);
        }
        try {
          const dataCurrentChargeDescExcel: any = await this.httpclient.fetchUPsChargeDescDetails(clientId).toPromise();
          this.chargeDescExcelList = dataCurrentChargeDescExcel;
        } catch (error) {
          console.error('Error fetching chargeDesc details:', error);
        }
        try {
          const dataCurrentRevenueTierExcel: any = await this.httpclient.fetchUPsRevenueTierDetails(clientId).toPromise();
          this.revenueTierExcelList = dataCurrentRevenueTierExcel;
        } catch (error) {
          console.error('Error fetching RevenueTier details:', error);
        }
        try {
          const dataCurrentExecutiveSummaryExcel: any = await this.httpclient.fetchUPsExecuteSummaryDetails(clientId).toPromise();
          this.executiveSummaryExcelList = dataCurrentExecutiveSummaryExcel;
        } catch (error) {
          console.error('Error fetching executiveSummary details:', error);
        }
        try {
          const dataCurrentInvoiceSummaryExcel: any = await this.httpclient.fetchUPsInvoiceSummaryDetails(clientId).toPromise();
          this.invoiceSummaryExcelList = dataCurrentInvoiceSummaryExcel;
        } catch (error) {
          console.error('Error fetching invoice Summary details:', error);
        }
      }
    }
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
    var clientDetail: any = {}
    if (scenarios != undefined) {
      for (let index = 0; index < scenarios.length; index++) {
        clientDetail['targetId'] = scenarios[index];
        if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
          clientDetail['clientId'] = this.fedexClientId;
          var dimList = await this.fedexService.fetchDimFactorDetails(clientDetail).toPromise();
          var minimumReductionList = await this.fedexService.fetchMinDetails(clientDetail).toPromise();
        }
        else {
          clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
          var dimList = await this.httpclient.fetchDimFactorDetails(clientDetail).toPromise();
          var minimumReductionList = await this.httpclient.fetchMinDetails(clientDetail).toPromise();
        }
        var minMaxList = await this.setNetAmountMinMaxExcel(minimumReductionList);
        minMaxList.forEach((data: any, row: any) => {
          netAmountMinMaxList[row]['targetMin' + scenarios[index]] = data.targetMin;
          netAmountMinMaxList[row]['targetMax' + scenarios[index]] = data.targetMax;
        });
        dimList.forEach((data: any, row: any) => {
          dimFactorList[row]['targetDimDivisor' + scenarios[index]] = data.targetDimDivisor;
        });
        if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
          this.totalScenarios[index].accessorialTargetDetailsExcel = [];
          var unfilteredDataExcel: any = await this.fedexService.fetchAccessorialDetailsTargetExcel(clientDetail).toPromise();
          var scenarioIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
          var dataExcel = unfilteredDataExcel.filter((data: any) => data.targetId == scenarios[index]);
          this.totalScenarios[scenarioIndex].accessorialTargetDetailsExcel = dataExcel;
        }
        else {
          this.totalScenarios[index].accessorialTargetDetailsExcel = [];
          var unfilteredDataExcel: any = await this.httpclient.fetchAccessorialDetailsTargetExcel(clientDetail).toPromise();
          var scenarioIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
          var dataExcel = unfilteredDataExcel.filter((data: any) => data.targetId == scenarios[index]);
          this.totalScenarios[scenarioIndex].accessorialTargetDetailsExcel = dataExcel;
        }
      }
    }
    for (let index = 0; index < scenarios.length; index++) {
      selectedScenarios.push(scenarios[index].toString());
      var rowIndex = this.totalScenarios.findIndex((data: any) => data.targetId == scenarios[index]);
      scenariosDisplayed.push(this.totalScenarios[rowIndex]);
    }
    var d = new Date();
    var currentDate = this.datePipe.transform(d, "MM-dd-yyyy_HH:mm:ss");
    var fileName = this.selectedCarrier.carrierName + '_ContractSummaryReport_' + this.selectedCarrier.clientName + '_' + currentDate + ".xlsx";
    var carrierColumnName = 'CURRENT UPS %';
    if (this.selectedCarrier.carrierName.toLowerCase() == 'ups') {
      carrierColumnName = 'CURRENT UPS %';
    }
    else {
      carrierColumnName = 'CURRENT FEDEX %';
    }
    var tableOneArr = [];
    let headerArray = ['', 'Client Name:', this.selectedCarrier.clientName, '', '', ''];
    for (let row = 0; row < selectedScenarios.length * 4; row++) {
      headerArray.push('');
    }
    tableOneArr.push(headerArray);
    tableOneArr.push(['', 'Total Net Spend:', Number(this.totalCurrentSpend.toFixed(2))])
    tableOneArr.push(['', 'Invoice From Date:', this.selectedCarrier['dateRange'].split(' to ')[0]])
    tableOneArr.push(['', 'Invoice To Date:', this.selectedCarrier['dateRange'].split(' to ')[1]])
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Savings Summary', {
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

    let header = worksheet.addRow(["", "LJM Contract Analysis - Savings Summary"]);


    header.eachCell((cell: any, cellNum: any) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
      if (cellNum != 1) {
        cell.font = { name: "Cambria", size: 20, bold: true, color: { argb: '4F81BD' } };
      }
    });

    tableOneArr.forEach((d: any) => {
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
    scenariosDisplayed.forEach((scenario: any) => {
      tempArr = [...tempArr, 'Projected Annual Savings: '];
    });
    tableTwoArr.push(tempArr);

    tempArr = [''];
    scenariosDisplayed.forEach((scenario: any) => {
      tempArr = [...tempArr, scenario.targetName];
    });
    tableTwoArr.push(tempArr);

    tempArr = [''];
    scenariosDisplayed.forEach((scenario: any) => {
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
    var headerTableAirArr = [];

    var columnsHeader = ['', 'DOMESTIC AIR SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, 'CURRENT SPEND'];
    var indexArr: any = ['', '', '', '', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      scenario.columnsTarget.forEach((column: any) => {
        columnsHeader.push(column['field'])
        indexArr.push(index);
      });
    });

    headerTableAirArr.push(columnsHeader);
    headerTableAirArr.forEach((d: any) => {
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

              tempArr = [...tempArr, targetDiscount, Number(targetTotalSpend.toFixed(2)), Number((currentTotalSpend - targetTotalSpend).toFixed(2)), (currentTotalSpend == 0) ? Number((currentTotalSpend).toFixed(2)) : (Number(((currentTotalSpend - targetTotalSpend) / currentTotalSpend).toFixed(2)))];
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

        scenariosDisplayed.forEach((scenario: any) => {

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

    tableAirArr.forEach((d: any) => {
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
      var columnsHeader = ['', 'DOMESTIC GROUND SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, 'CURRENT SPEND'];

      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field']));
      });

      headerTableGroundArr.push(columnsHeader);
      headerTableGroundArr.forEach((d: any) => {
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
      var tableGroundArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsGroundList.length; loop1++) {

        let currentDiscountMinimum = Number(this.groundMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.groundMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', (this.carrierName.toLowerCase() == "fedex") ? "FedEx " + this.currentSavingsGroundList[loop1].serviceName : this.currentSavingsGroundList[loop1].serviceName, this.currentSavingsGroundList[loop1].weightRange, Number(this.currentSavingsGroundList[loop1].count), currentDiscount, Number(this.currentSavingsGroundList[loop1].currentSpend)]

        if (this.currentSavingsGroundList[loop1].weightRange != 'Sub Total') {

          scenariosDisplayed.forEach((scenario: any) => {

            let targetDiscountMinimum = Number(scenario.groundMinMaxList[loop1].disMin);
            let targetDiscountMaximum = Number(scenario.groundMinMaxList[loop1].disMax);
            let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
            var targetSavingsGroundList = scenario.dataSourceGroundTarget.data;

            tempArr = [...tempArr, targetDiscount, Number(targetSavingsGroundList[loop1].targetSpend), Number(targetSavingsGroundList[loop1].savingsAmount), Number(targetSavingsGroundList[loop1].targetSavingsPercent / 100)];
          });
          tableGroundArr.push(tempArr);
        }
      }

      tableGroundArr.forEach((d: any) => {
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
      var columnsHeader = ['', 'HWT SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, 'CURRENT SPEND'];

      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field']));
      });

      headerTableHwtArr.push(columnsHeader);
      headerTableHwtArr.forEach((d: any) => {
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
      var tableHwtArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsHWTList.length; loop1++) {

        let currentDiscountMinimum = Number(this.hwtMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.hwtMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', (this.carrierName.toLowerCase() == "fedex" && !this.currentSavingsHWTList[loop1].finalService.toLowerCase().includes("fedex")) ? "FedEx " + this.currentSavingsHWTList[loop1].finalService : this.currentSavingsHWTList[loop1].finalService, this.currentSavingsHWTList[loop1].weightRange, Number(this.currentSavingsHWTList[loop1].count), currentDiscount, Number(this.currentSavingsHWTList[loop1].currentSpend)];

        scenariosDisplayed.forEach((scenario: any) => {
          let targetDiscountMinimum = Number(scenario.hwtMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.hwtMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          var targetSavingsHwtList = scenario.dataSourceHWTTarget.data;
          tempArr = [...tempArr, targetDiscount, Number(targetSavingsHwtList[loop1].targetSpend), Number(targetSavingsHwtList[loop1].savingsAmount), Number(targetSavingsHwtList[loop1].targetSavingsPercent / 100)];
        });
        tableHwtArr.push(tempArr);
      }

      tableHwtArr.forEach((d: any) => {
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
      var columnsHeader = ['', 'INTERNATIONAL SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', carrierColumnName, 'CURRENT SPEND'];

      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field']));
      });

      headerTableIntlArr.push(columnsHeader);
      headerTableIntlArr.forEach((d: any) => {
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
        scenariosDisplayed.forEach((scenario: any) => {
          let targetDiscountMinimum = Number(scenario.intlMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.intlMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          var targetSavingsIntlList = scenario.dataSourceIntlTarget.data;
          tempArr = [...tempArr, targetDiscount, Number(targetSavingsIntlList[loop1].targetSpend), Number(targetSavingsIntlList[loop1].savingsAmount), Number(targetSavingsIntlList[loop1].targetSavingsPercent / 100)];
        });
        tableIntlArr.push(tempArr);
      }
      tableIntlArr.forEach((d: any) => {
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

      var columnsHeader = ['', 'ACCESSORIAL CHARGE', 'SERVICE TYPE', 'COUNT', carrierColumnName, 'CURRENT SPEND'];
      scenariosDisplayed.forEach((scenario) => {
        scenario.columnsTarget.forEach((column: any) => columnsHeader.push(column['field']));
      });

      headerTableAccArr.push(columnsHeader);
      headerTableAccArr.forEach((d: any) => {
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

        scenariosDisplayed.forEach((scenario: any) => {
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

      tableAccArr.forEach((d: any) => {
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

    scenariosDisplayed.forEach((scenario: any) => {
      tempArr = [...tempArr, '', Number(scenario.totalNetSpend.toFixed(2)), Number(scenario.totalSavings.toFixed(2)), Number(scenario.totalSavingsPercent / 100)];
    });

    headerTableTotalArr.push(tempArr);

    var formatArray = 0;
    headerTableTotalArr.forEach((d: any) => {
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
    tempArr = ['', 'CRITERIA', 'SERVICE GROUPINGS', 'CUBIC IN FROM', 'CUBIC IN TO', 'CURRENT DIM DIVISOR'];
    indexArr = ['', '', '', '', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      tempArr = [...tempArr, (scenario.targetName + ' dim Factor').toUpperCase()];
      indexArr.push(index);
    });

    headerTableDimArr.push(tempArr);

    headerTableDimArr.forEach((d: any) => {
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
      selectedScenarios.forEach((scenarioIndex: any) => {
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
    tempArr = ['', 'MINIMUM REDUCTION', 'CURRENT ' + this.carrierName];
    indexArr = ['', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      tempArr = [...tempArr, (scenario.targetName + ' Min Reduction').toUpperCase()];
      indexArr.push(index)
    });

    headerTableMinimumArr.push(tempArr);

    headerTableMinimumArr.forEach((d: any) => {
      let row = worksheet.addRow(d);
      row.height = 28.5;
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

    tableMinimumArr.forEach((d: any) => {
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

    //Sheet 2 Discount Summary
    let worksheet1 = workbook.addWorksheet('Discount Summary', {
      views: [{ showGridLines: false }]
    });
    worksheet1.getColumn(1).width = 4;
    worksheet1.getColumn(2).width = 40;
    worksheet1.getColumn(3).width = 25;
    columnIndex = 3;
    for (let row = 0; row < selectedScenarios.length; row++) {
      columnIndex++;
      worksheet1.getColumn(columnIndex).width = 25;
    }
    totalLength = 6 + selectedScenarios.length;
    for (let row = columnIndex++; row <= totalLength; row++) {
      worksheet1.getColumn(row).width = 20;
    }

    worksheet1.addRow([]);
    let header1 = worksheet1.addRow(["", "LJM Contract Analysis - Savings Summary"]);

    header1.eachCell((cell: any, cellNum: any) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
      if (cellNum != 1) {
        cell.font = { name: "Cambria", size: 20, bold: true, color: { argb: '4F81BD' } };
      }
    });

    var tableOneArr = [];
    let headerArray2 = ['', 'Client Name:', this.selectedCarrier.clientName, '', '', ''];

    for (let row = 0; row < selectedScenarios.length; row++) {
      headerArray2.push('');
    }

    tableOneArr.push(headerArray2);
    tableOneArr.push(['', 'Total Net Spend:', Number(this.totalCurrentSpend.toFixed(2))]);
    tableOneArr.push(['', 'Invoice From Date:', this.selectedCarrier['dateRange'].split(' to ')[0]]);
    tableOneArr.push(['', 'Invoice To Date:', this.selectedCarrier['dateRange'].split(' to ')[1]]);

    tableOneArr.forEach((d: any) => {
      let row: any = worksheet1.addRow(d);
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

    worksheet1.addRow([]);
    var tableTwoArr = [];
    var tempArr: any = [''];

    // scenariosDisplayed.forEach((scenario:any) => {
    //   tempArr = [...tempArr, 'Projected Annual Savings:\n ' + scenario.targetName + '\n' + '$ ' + this.setCommaQty(Number(scenario.totalSavings).toFixed(2)) + ' / ' + this.setCommaQty(Number(scenario.totalSavingsPercent).toFixed(2)) + ' %'];
    // });

    scenariosDisplayed.forEach((scenario: any) => {
      tempArr = [...tempArr, 'Projected Annual Savings: '];
    });
    tableTwoArr.push(tempArr);

    tempArr = [''];
    scenariosDisplayed.forEach((scenario: any) => {
      tempArr = [...tempArr, scenario.targetName];
    });
    tableTwoArr.push(tempArr);

    tempArr = [''];
    scenariosDisplayed.forEach((scenario: any) => {
      tempArr = [...tempArr, '$ ' + this.setCommaQty(Number(scenario.totalSavings).toFixed(2)) + ' / ' + this.setCommaQty(Number(scenario.totalSavingsPercent).toFixed(2)) + ' %'];
    });
    tableTwoArr.push(tempArr);

    tableTwoArr.forEach((d, rowCount) => {
      let row = worksheet1.addRow(d);
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
    worksheet1.addRow([]);

    /* Domestic Air Service Level */
    var headerTableAirArr = [];

    var columnsHeader = ['', 'DOMESTIC AIR SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', 'CURRENT SPEND', carrierColumnName];
    indexArr = ['', '', '', '', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      columnsHeader.push(scenario.columnsTarget[0]['field']);
      indexArr.push(index);
    });

    headerTableAirArr.push(columnsHeader);
    headerTableAirArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
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
    var tableAirArr = [];

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

          tempArr = ['', this.currentSavingsAirList[loop1].finalService + " " + containerType, (containerType.toLowerCase() == "ltr") ? "Letter" : (weightFrom + '-' + weightTo), currentCount, Number(currentTotalSpend.toFixed(2)), currentDiscount];

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
              tempArr = [...tempArr, targetDiscount];
            }
            else {
              let targetDiscountMinimum = Number(scenario.airMinMaxList[loop1].disMin);
              let targetDiscountMaximum = Number(scenario.airMinMaxList[loop1].disMax);
              let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
              var targetSavingsAirList = scenario.dataSourceAirTarget.data;
              tempArr = [...tempArr, targetDiscount];
            }
          }
          tableAirArr.push(tempArr);

        }
      }
      else {
        let currentDiscountMinimum = Number(this.airMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.airMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', this.currentSavingsAirList[loop1].finalService, this.currentSavingsAirList[loop1].weightRange, Number(this.currentSavingsAirList[loop1].count), Number(this.currentSavingsAirList[loop1].currentSpend), currentDiscount]

        scenariosDisplayed.forEach((scenario: any) => {

          let targetDiscountMinimum = Number(scenario.airMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.airMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          var targetSavingsAirList = scenario.dataSourceAirTarget.data;

          tempArr = [...tempArr, targetDiscount];
        });
        tableAirArr.push(tempArr);
      }
    }


    tableAirArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {
        if (cellNum != 1) {
          cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        }
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        if (cellNum == 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
        else if (cellNum > 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        }
        else if (cellNum == 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };
        }
        else {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        if (cellNum == 4) {
          cell.numFmt = '#,##0';
        }
        else if (cellNum == 5) {
          cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
        else if (cellNum >= 6) {
          cell.numFmt = '0.00%';
        }
      })
    });

    worksheet1.addRow([]);
    /* Domestic Ground Service Level */
    var headerTableGroundArr = [];
    var columnsHeader = ['', 'DOMESTIC GROUND SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', 'CURRENT SPEND', carrierColumnName];
    scenariosDisplayed.forEach((scenario) => {
      columnsHeader.push(scenario.columnsTarget[0]['field']);
    });

    headerTableGroundArr.push(columnsHeader);
    headerTableGroundArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
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
    var tableGroundArr = [];

    for (var loop1 = 0; loop1 < this.currentSavingsGroundList.length; loop1++) {

      let currentDiscountMinimum = Number(this.groundMinMaxList[loop1].disMin);
      let currentDiscountMaximum = Number(this.groundMinMaxList[loop1].disMax);
      let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

      tempArr = ['', (this.carrierName.toLowerCase() == "fedex") ? "FedEx " + this.currentSavingsGroundList[loop1].serviceName : this.currentSavingsGroundList[loop1].serviceName, this.currentSavingsGroundList[loop1].weightRange, Number(this.currentSavingsGroundList[loop1].count), Number(this.currentSavingsGroundList[loop1].currentSpend), currentDiscount]

      if (this.currentSavingsGroundList[loop1].weightRange != 'Sub Total') {

        scenariosDisplayed.forEach((scenario: any) => {

          let targetDiscountMinimum = Number(scenario.groundMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.groundMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';

          tempArr = [...tempArr, targetDiscount];
        });
        tableGroundArr.push(tempArr);
      }
    }

    tableGroundArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {
        if (cellNum != 1) {
          cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        }
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        if (cellNum == 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
        else if (cellNum > 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        }
        else if (cellNum == 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };
        }
        else {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        if (cellNum == 4) {
          cell.numFmt = '#,##0';
        }
        else if (cellNum == 5) {
          cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
        else if (cellNum >= 6) {
          cell.numFmt = '0.00%';
        }
      })
    });

    worksheet1.addRow([]);

    /* Hundred Weight Service Level */
    if (this.currentSavingsHWTList.length > 0) {
      var headerTableHwtArr = [];

      var columnsHeader = ['', 'HWT SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', 'CURRENT SPEND', carrierColumnName];
      scenariosDisplayed.forEach((scenario) => {
        columnsHeader.push(scenario.columnsTarget[0]['field']);
      });
      headerTableHwtArr.push(columnsHeader);
      headerTableHwtArr.forEach((d: any) => {
        let row = worksheet1.addRow(d);
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
      var tableHwtArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsHWTList.length; loop1++) {

        let currentDiscountMinimum = Number(this.hwtMinMaxList[loop1].disMin);
        let currentDiscountMaximum = Number(this.hwtMinMaxList[loop1].disMax);
        let currentDiscount = (currentDiscountMinimum == currentDiscountMaximum) ? currentDiscountMinimum / 100 : currentDiscountMinimum.toFixed(2) + '% - ' + currentDiscountMaximum.toFixed(2) + '%';

        tempArr = ['', (this.carrierName.toLowerCase() == "fedex" && !this.currentSavingsHWTList[loop1].finalService.toLowerCase().includes("fedex")) ? "FedEx " + this.currentSavingsHWTList[loop1].finalService : this.currentSavingsHWTList[loop1].finalService, this.currentSavingsHWTList[loop1].weightRange, Number(this.currentSavingsHWTList[loop1].count), Number(this.currentSavingsHWTList[loop1].currentSpend), currentDiscount];

        scenariosDisplayed.forEach((scenario: any) => {
          let targetDiscountMinimum = Number(scenario.hwtMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.hwtMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          tempArr = [...tempArr, targetDiscount];
        });
        tableHwtArr.push(tempArr);
      }

      tableHwtArr.forEach((d: any) => {
        let row = worksheet1.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          }
          else if (cellNum > 6) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
          else if (cellNum == 6) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          if (cellNum == 4) {
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 5) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum >= 6) {
            cell.numFmt = '0.00%';
          }
        })
      });
      worksheet1.addRow([]);
    }
    /* International Service Level */
    if (this.currentSavingsIntlList.length > 0) {
      var headerTableIntlArr = [];
      var columnsHeader = ['', 'INTERNATIONAL SERVICE LEVEL', 'WEIGHT RANGE', 'COUNT', 'CURRENT SPEND', carrierColumnName];
      scenariosDisplayed.forEach((scenario) => {
        columnsHeader.push(scenario.columnsTarget[0]['field']);
      });
      headerTableIntlArr.push(columnsHeader);
      headerTableIntlArr.forEach((d: any) => {
        let row = worksheet1.addRow(d);
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
          tempArr = ['', this.currentSavingsIntlList[loop1].finalService + " " + containerType, this.currentSavingsIntlList[loop1].weightRange, Number(this.currentSavingsIntlList[loop1].count), Number(this.currentSavingsIntlList[loop1].currentSpend), currentDiscount];
        }
        else {
          tempArr = ['', this.currentSavingsIntlList[loop1].finalService + " " + this.intlProposalList[intlDataIndex].containerType, this.currentSavingsIntlList[loop1].weightRange, Number(this.currentSavingsIntlList[loop1].count), Number(this.currentSavingsIntlList[loop1].currentSpend), currentDiscount];
        }

        scenariosDisplayed.forEach((scenario: any) => {
          let targetDiscountMinimum = Number(scenario.intlMinMaxList[loop1].disMin);
          let targetDiscountMaximum = Number(scenario.intlMinMaxList[loop1].disMax);
          let targetDiscount = (targetDiscountMinimum == targetDiscountMaximum) ? targetDiscountMinimum / 100 : targetDiscountMinimum.toFixed(2) + '% - ' + targetDiscountMaximum.toFixed(2) + '%';
          tempArr = [...tempArr, targetDiscount];
        });
        tableIntlArr.push(tempArr);
      }

      tableIntlArr.forEach((d: any) => {
        let row = worksheet1.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
          }
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          if (cellNum == 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          }
          else if (cellNum > 6) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          }
          else if (cellNum == 6) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };
          }
          else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
          if (cellNum == 4) {
            cell.numFmt = '#,##0';
          }
          else if (cellNum == 5) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum >= 6) {
            cell.numFmt = '0.00%';
          }
        })
      });
      worksheet1.addRow([]);
    }
    /* Accessorial Charge */
    var headerTableAccArr = [];

    var columnsHeader = ['', 'ACCESSORIAL CHARGE', 'SERVICE TYPE', 'COUNT', 'CURRENT SPEND', carrierColumnName];
    scenariosDisplayed.forEach((scenario) => {
      columnsHeader.push(scenario.columnsTarget[0]['field']);
    });
    headerTableAccArr.push(columnsHeader);
    headerTableAccArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
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

      tempArr = ['', (splitIndex) ? ((this.currentSavingsAccList[loop1].hoverName != undefined) ? this.currentSavingsAccList[loop1].hoverName : this.currentSavingsAccList[loop1].service) : this.currentSavingsAccList[loop1].finalService, (loop1 == rowIndex) ? 'Remaining Services' : this.currentSavingsAccList[loop1].serviceType, Number(this.currentSavingsAccList[loop1].count), Number(this.currentSavingsAccList[loop1].currentSpend), currentDiscount];

      scenariosDisplayed.forEach((scenario: any) => {
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
        tempArr = [...tempArr, targetDiscount];
      });
      tableAccArr.push(tempArr);
    }

    tableAccArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
      row.eachCell((cell: any, cellNum: any) => {
        if (cellNum != 1) {
          cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        }
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        if (cellNum == 2) {
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
        }
        else if (cellNum > 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
        }
        else if (cellNum == 6) {
          cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true, indent: 1 };
        }
        else {
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }
        if (cellNum == 4) {
          cell.numFmt = '#,##0';
        }
        else if (cellNum == 6 || cellNum == 7 || cellNum == 8) {
          cell.numFmt = '0.00%';
        }
        else if (cellNum == 5) {
          cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
        }
      })
    });
    worksheet1.addRow([]);

    /* Dim Factor */
    var headerTableDimArr = [];
    tempArr = ['', 'CRITERIA', 'SERVICE GROUPINGS', 'CUBIC IN FROM', 'CUBIC IN TO', 'CURRENT DIM DIVISOR'];
    indexArr = ['', '', '', '', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      tempArr = [...tempArr, (scenario.targetName + ' dim Factor').toUpperCase()];
      indexArr.push(index);
    });

    headerTableDimArr.push(tempArr);
    headerTableDimArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
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
      selectedScenarios.forEach((scenarioIndex: any) => {
        tempArr = [...tempArr, data['targetDimDivisor' + scenarioIndex]];
      })
      tableDimArr.push(tempArr);
    });
    tableDimArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
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
    worksheet1.addRow([]);
    /* Minimum Reduction */
    var headerTableMinimumArr = [];

    tempArr = ['', 'MINIMUM REDUCTION', 'CURRENT ' + this.carrierName];
    indexArr = ['', '', ''];

    scenariosDisplayed.forEach((scenario, index) => {
      tempArr = [...tempArr, (scenario.targetName + ' Min Reduction').toUpperCase()];
      indexArr.push(index)
    });

    headerTableMinimumArr.push(tempArr);
    headerTableMinimumArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
      row.height = 28.5;
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

      selectedScenarios.forEach((scenarioIndex: any) => {
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
    tableMinimumArr.forEach((d: any) => {
      let row = worksheet1.addRow(d);
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

    //Sheet 3 
    selectedScenarios.forEach((scenario, index) => {
      var worksheetName: any = 'worksheet' + (index + 2);
      worksheetName = workbook.addWorksheet(scenariosDisplayed[index].targetNickName, {
        views: [{ showGridLines: false }]
      });
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
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      var newAirList: any = this.combineAndSum(airList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAirList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newAirList[loop].service, count: newAirList[loop].count, currentSpend: newAirList[loop].currentSpend, targetSpend: newAirList[loop].targetSpend
          , difference: '=D11-E11', increase: '=F11/D11'
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
            , difference: '=D11-E11', increase: '=F11/D11'
          });
        }
      }

      var newGroundList: any = this.combineAndSum(GroundList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newGroundList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newGroundList[loop].service, count: newGroundList[loop].count, currentSpend: newGroundList[loop].currentSpend, targetSpend: newGroundList[loop].targetSpend
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsHWTList.length; loop++) {
        if (Number(this.currentSavingsHWTList[loop].count) == 0) {
          continue;
        }
        var targetSavingsHwtList = scenariosDisplayed[index].dataSourceHWTTarget.data;
        TargetServiceList.push({
          id: '', service: this.currentSavingsHWTList[loop].finalService, count: Number(this.currentSavingsHWTList[loop].count), currentSpend: Number(this.currentSavingsHWTList[loop].currentSpend), targetSpend: Number(targetSavingsHwtList[loop].targetSpend)
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsIntlList.length; loop++) {
        if (Number(this.currentSavingsIntlList[loop].count) == 0) {
          continue;
        }
        var targetSavingsIntlList = scenariosDisplayed[index].dataSourceIntlTarget.data;
        intlList.push({
          id: '', service: this.currentSavingsIntlList[loop].finalService, count: Number(this.currentSavingsIntlList[loop].count), currentSpend: Number(this.currentSavingsIntlList[loop].currentSpend), targetSpend: Number(targetSavingsIntlList[loop].targetSpend)
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      var newIntlList: any = this.combineAndSum(intlList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newIntlList.length; loop++) {
        TargetServiceList.push({
          id: '', service: newIntlList[loop].service, count: newIntlList[loop].count, currentSpend: newIntlList[loop].currentSpend, targetSpend: newIntlList[loop].targetSpend
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      for (var loop = 0; loop < this.currentSavingsAccList.length; loop++) {
        if (Number(this.currentSavingsAccList[loop].count) == 0) {
          continue;
        }
        var targetSavingsAccList = scenariosDisplayed[index].dataSourceAccTarget.data;
        accList.push({
          id: '', service: this.currentSavingsAccList[loop].finalService, count: Number(this.currentSavingsAccList[loop].count), currentSpend: Number(this.currentSavingsAccList[loop].currentSpend), targetSpend: Number(targetSavingsAccList[loop].targetSpend)
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      var newAccList: any = this.combineAndSum(accList, 'service', ['count', 'currentSpend', 'targetSpend']);

      for (var loop = 0; loop < newAccList.length; loop++) {
        TargetAccessorialList.push({
          id: '', service: newAccList[loop].service, count: newAccList[loop].count, currentSpend: newAccList[loop].currentSpend, targetSpend: newAccList[loop].targetSpend
          , difference: '=D11-E11', increase: '=F11/D11'
        });
      }

      TargetServiceList.sort((a: any, b: any) => Number(b.currentSpend) - Number(a.currentSpend));

      TargetServiceList.forEach((data: any) => {
        TotalFreightCurrentSpend = data.currentSpend + TotalFreightCurrentSpend;
        tableArr.push(['', data.service, data.count, data.currentSpend, data.targetSpend, data.currentSpend - data.targetSpend, (data.currentSpend - data.targetSpend) / data.currentSpend]);
      });

      TargetAccessorialList.sort((a: any, b: any) => { return Number(b.currentSpend) - Number(a.currentSpend); });
      TargetAccessorialList.forEach((data: any) => {
        TotalAccCurrentSpend = data.currentSpend + TotalAccCurrentSpend;
        tableArr.push(['', data.service, data.count, data.currentSpend, data.targetSpend, data.currentSpend - data.targetSpend, (data.currentSpend - data.targetSpend) / data.currentSpend]);
      });

      tableOneArr.push(['', 'CLIENT NAME', this.selectedCarrier.clientName])
      tableOneArr.push(['', 'Analysis Date:', this.datePipe.transform(date, "MM-dd-yyyy"), '', 'Total Estimated Savings:', '$' + this.setCommaQty(Number(scenariosDisplayed[index].totalSavings).toFixed(2))])
      tableOneArr.push(['', 'Invoice From Date:', this.selectedCarrier['dateRange'].split(' to ')[0], '', '% Savings Overall:', this.setCommaQty(Number(scenariosDisplayed[index].totalSavingsPercent).toFixed(2)) + '%', '% Savings'])
      tableOneArr.push(['', 'Invoice To Date:', this.selectedCarrier['dateRange'].split(' to ')[1], '', 'Total Freight Savings:', '$' + this.setCommaQty(Number(TotalFreightSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalFreightSavings) / this.totalFreightSpend) * 100).toFixed(2)) + '%'])
      tableOneArr.push(['', 'Current Spend Carrier', this.selectedCarrier.carrierName, '', 'Total Accessorial Savings:', '$' + this.setCommaQty(Number(TotalAccessorialSavings).toFixed(2)), this.setCommaQty(Number((Number(TotalAccessorialSavings) / this.totalAccSpend) * 100).toFixed(2)) + '%'])
      tableOneArr.push(['', 'Rerated Spend Carrier', (scenariosDisplayed[index].carrierName.toUpperCase() == 'FEDEX') ? 'FedEx' : scenariosDisplayed[index].carrierName])

      tableOneArr.forEach((d: any) => {
        let row = worksheetName.addRow(d);
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
      headerTableArr.push(['', 'SERVICE/ CHARGE TYPE', 'VOLUME', 'Current Spend', 'Target Spend', 'DIFFERENCE', '% INCREASE']);

      headerTableArr.forEach((d: any) => {
        let row = worksheetName.addRow(d);
        row.eachCell((cell: any, cellNum: any) => {
          if (cellNum != 1) {
            if (cellNum == 7) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
            else if (cellNum == 2) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 2 };
              cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, top: { style: 'thin', color: { argb: '8DB4E2' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            }
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
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
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum == 6) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            cell.value = { formula: 'D' + rowNumber + '-E' + rowNumber };
          }
          else if (cellNum == 7) {
            cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: false };
            cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } };
            cell.numFmt = '0.00%';
            cell.value = { formula: 'IFERROR(F' + rowNumber + '/D' + rowNumber + ',0)' };
          }
        })
      });
      worksheetName.addRow([]);
      worksheetName.addRow([]);
      /* Total Row */
      var headerTableTotalArr = [];
      headerTableTotalArr.push(['', '', 'TOTAL:', Number(this.totalCurrentSpend.toFixed(2)), Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)),
        Number(this.totalCurrentSpend.toFixed(2)) - Number(scenariosDisplayed[index].totalNetSpend.toFixed(2)),
        (Number(this.totalCurrentSpend.toFixed(2)) - Number(scenariosDisplayed[index].totalNetSpend.toFixed(2))) / Number(this.totalCurrentSpend.toFixed(2))]);

      headerTableTotalArr.forEach((d: any) => {
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
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            cell.value = { formula: 'SUM(D11:D' + (rowNumber) + ')' };
          }
          else if (cellNum == 5) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            cell.value = { formula: 'SUM(E11:E' + (rowNumber) + ')' };
          }
          else if (cellNum == 6) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            cell.value = { formula: 'D' + (rowNumber + 3) + '-E' + (rowNumber + 3) };
          }
          else if (cellNum == 7) {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '404040' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
            cell.numFmt = '0.00%';
            cell.value = { formula: 'IFERROR(F' + (rowNumber + 3) + '/D' + (rowNumber + 3) + ',0)' };
          }
        });
      });




    });

    /* Accessorial Detail */
    var worksheet5 = workbook.addWorksheet('Accessorial Details', {
      views: [{ showGridLines: false }]
    });
    worksheet5.getColumn(1).width = 4;
    worksheet5.getColumn(2).width = 30;
    worksheet5.getColumn(3).width = 35;
    worksheet5.getColumn(4).width = 15;
    worksheet5.getColumn(5).width = 15;
    worksheet5.getColumn(6).width = 15;
    worksheet5.getColumn(7).width = 15;
    worksheet5.getColumn(8).width = 15;
    worksheet5.getColumn(9).width = 15;
    worksheet5.getColumn(10).width = 15;
    worksheet5.getColumn(11).width = 15;
    worksheet5.getColumn(12).width = 15;
    worksheet5.getColumn(13).width = 15;
    worksheet5.getColumn(14).width = 15;
    worksheet5.addRow([]);

    if (this.currentSavingsAccExcelList.length > 0) {
      var headerTableAccExcelArr = [];
      var columnsHeader = ['', 'FINAL SUMMARY', 'CHARGE GROUP', 'SERVICE TYPE', 'CURRENT DISCOUNT %', 'CURRENT DISCOUNT TYPE', 'CURRENT SPEND'];
      indexArr = ['', '', '', '', '', '', ''];

      scenariosDisplayed.forEach((scenario, index) => {
        scenario.columnsAccessorialTargetExcel.forEach((column: any) => {
          columnsHeader.push(column['field']);
          indexArr.push(index);
        });
      });
      columnsHeader.push('GROSS AMOUNT ' + this.selectedCarrier.carrierName.toUpperCase());

      headerTableAccExcelArr.push(columnsHeader);
      // 💡 Calculate dynamic column group ranges
      const baseCols = 7; // columns before scenario-based columns
      const scenarioColumnCount = scenariosDisplayed[0]?.columnsAccessorialTargetExcel?.length || 0;
      const totalScenarios = scenariosDisplayed.length;

      // calculate dynamic start/end index for scenario columns
      const startCol = baseCols + 1;
      const endCol = baseCols + (scenarioColumnCount * totalScenarios);
      const grossAmountCol = endCol + 1; // next column after scenario-based

      headerTableAccExcelArr.forEach((d: any) => {
        let row = worksheet5.addRow(d);
        row.height = 28.5;
        row.eachCell((cell: any, cellNum: any) => {
          let fgColorCode = '';

          if (cellNum !== 1) {
            // Dynamic scenario color fill
            if (cellNum >= startCol && cellNum <= endCol) {
              const index = indexArr[cellNum - 1];
              const carrier = scenariosDisplayed[index]?.carrierName?.toUpperCase() || '';

              if (carrier === 'UPS') fgColorCode = '95B3D7';
              else if (carrier === 'FEDEX') fgColorCode = 'B8CCE4';
              else fgColorCode = 'D3E1ED'; // fallback

              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColorCode } };
            }
            // Gross amount column color
            else if (cellNum === grossAmountCol) {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' } };
            }
            // Default fill
            else {
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3E1ED' } };
            }

            // common styles
            cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.alignment =
              cellNum === 2
                ? { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 }
                : { vertical: 'middle', horizontal: 'center', wrapText: true };
          }
        });
      });

      var tableAccExcelArr = [];

      for (var loop1 = 0; loop1 < this.currentSavingsAccExcelList.length; loop1++) {
        var tempArr: any = [''];
        tempArr = ['', this.currentSavingsAccExcelList[loop1].service, this.currentSavingsAccExcelList[loop1].lookupGrouping, this.currentSavingsAccExcelList[loop1].serviceType, Number(this.currentSavingsAccExcelList[loop1].currentPercent) / 100, this.currentSavingsAccExcelList[loop1].currentPercentType, Number(this.currentSavingsAccExcelList[loop1].currentSpend)];

        scenariosDisplayed.forEach((scenario: any) => {
          let rowIndex = -1;
          var targetSavingsAccExcelList = scenario.accessorialTargetDetailsExcel;
          if (this.selectedCarrier.carrierName.toUpperCase() == 'UPS') {
            rowIndex = targetSavingsAccExcelList.findIndex((data: any) => data.ratesheetGrouping.toLowerCase() == this.currentSavingsAccExcelList[loop1].ratesheetGrouping.toLowerCase());
          }
          else if (this.selectedCarrier.carrierName.toUpperCase() == 'FEDEX') {
            if (scenario.carrierName.toUpperCase() == 'FEDEX') {
              rowIndex = targetSavingsAccExcelList.findIndex((data: any) => data.ratesheetGrouping.toLowerCase() == this.currentSavingsAccExcelList[loop1].ratesheetGrouping.toLowerCase());
            }
            else if (scenario.carrierName.toUpperCase() == 'UPS') {
              if (this.currentSavingsAccExcelList[loop1].finalService != null && this.currentSavingsAccExcelList[loop1].serviceType != null) {
                rowIndex = targetSavingsAccExcelList.findIndex((data: any) => data.ratesheetGrouping.toLowerCase() == (this.currentSavingsAccExcelList[loop1].finalService.toLowerCase() + this.currentSavingsAccExcelList[loop1].serviceType.toLowerCase()));
              }
            }
          }

          if (rowIndex != -1)
            tempArr = [...tempArr, Number(targetSavingsAccExcelList[rowIndex].targetPercent) / 100, targetSavingsAccExcelList[rowIndex].targetPercentType, Number(targetSavingsAccExcelList[rowIndex].targetSpend)];
          else
            tempArr = [...tempArr, Number(0.00), '%', Number(0.00)];
        });
        tempArr = [...tempArr, Number(this.currentSavingsAccExcelList[loop1].totalGrossAmount)];
        tableAccExcelArr.push(tempArr);
      }

      // --- Apply styles dynamically for data rows ---
      tableAccExcelArr.forEach((d: any) => {
        const row = worksheet5.addRow(d);

        row.eachCell((cell: any, cellNum: any) => {
          // Common font and border
          cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
          cell.border = {
            bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            left: { style: 'thin', color: { argb: 'D9D9D9' } },
            right: { style: 'thin', color: { argb: 'D9D9D9' } }
          };

          // Alignment logic
          if (cellNum === 2) {
            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 1 };
          } else if (cellNum === 7 || cellNum === grossAmountCol) {
            cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
          } else {
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          }

          // --- Dynamic number formatting based on scenario column position ---
          // Identify which column group the cell belongs to
          if (cellNum === 5) {
            cell.numFmt = '0.00%';
          }
          else if (cellNum === 7) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
          else if (cellNum >= startCol && cellNum <= endCol) {
            const colOffset = cellNum - baseCols;
            const colInScenario = ((colOffset - 1) % scenarioColumnCount) + 1; // 1-based index in each scenario group

            // You can now apply your logic dynamically instead of hardcoded positions
            if (colInScenario === 1) {
              cell.numFmt = '0.00%';
            } else if (colInScenario === 3) {
              cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)'; // Example: amount
            }
          }
          // Gross total column
          else if (cellNum === grossAmountCol) {
            cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
          }
        });
      });
      worksheet5.addRow([]);
    }
    if (externalReportFlag) {
      if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {

        if (this.dimsExcelList.rows != null) {
          const columns = this.dimsExcelList.columns;
          const dataRows = this.dimsExcelList.rows; // Expect dataRows to be an array, e.g., from your backend API

          const worksheetDims = workbook.addWorksheet('Dims', { views: [{ showGridLines: false }] });

          let currentRow = 1;

          // 1. Table header
          columns.forEach((col: any, colIdx: any) => {
            const cell: any = worksheetDims.getCell(currentRow, colIdx + 1);
            cell.value = col.toUpperCase();
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });
          currentRow++;

          // Track max cell width for auto-fit
          const colWidths = Array(columns.length).fill(0);

          // 2. Data rows (just straight values, with "-" for empty)
          dataRows.forEach((rowData: any) => {
            columns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetDims.getCell(currentRow, colIdx + 1);
              let value = rowData[col];

              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (value === null || value === undefined || value === "" || value === '0') {
                // Set numeric cell value to null for empty/zero to recognize as blank or zero number
                cell.value = 0;
                // Use custom number format to display "-"
                cell.numFmt = '[=0]"-";#,##0';
              } else {
                // Clean up string value (trim spaces)
                if (typeof value === 'string') value = value.trim();

                //  Check if value is numeric string (like "1", "1.23", "-45.6", "0.00")
                const numericPattern = /^-?\d+(\.\d+)?$/;
                if (typeof value === 'string' && numericPattern.test(value)) {
                  // Convert to numeric value
                  const numValue = parseFloat(value);
                  cell.value = numValue;
                  // Apply default number format
                  cell.numFmt = '[=0]"-";#,##0';
                } else {
                  // Keep original text
                  cell.value = value;
                  cell.numFmt = undefined;
                  cell.alignment = { vertical: 'middle', horizontal: 'left' };
                }
              }
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } }
              };
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              // cell.border if needed
              // Update auto-fit tracking
              colWidths[colIdx] = Math.max(colWidths[colIdx], cell.value ? cell.value.toString().length : 1);
            });
            currentRow++;
          });

          // 3. Autofit column widths
          columns.forEach((col: any, colIdx: any) => {
            worksheetDims.getColumn(colIdx + 1).width = Math.max(8, colWidths[colIdx] + 2);
          });
          worksheetDims.addRow([]);
        }

        if (this.executiveSummaryExcelList != null && Object.keys(this.executiveSummaryExcelList).length > 0) {
          const data = this.executiveSummaryExcelList;
          const worksheetExecutiveSummary = workbook.addWorksheet('Executive Summary', { views: [{ showGridLines: false }] });

          const BLUE_HEADER = 'B8CCE4'; //'4F81BD';
          // const LIGHT_BLUE = 'D0E3FF';
          // const WHITE = 'E6E1E1';
          const LIGHT_BLUE = 'F2F2F2';
          const WHITE = 'FFFFFF';

          let currentRow = 1;

          Object.keys(data).forEach((yearKey, yearIndex) => {
            const yearBlock = data[yearKey];

            // =================================
            // 2 HEADER ROW
            // =================================
            const headerRow = worksheetExecutiveSummary.getRow(currentRow);
            yearBlock.columns.forEach((colName: string, idx: number) => {
              const cell: any = headerRow.getCell(idx + 1);
              cell.value = colName.toUpperCase();
              cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });
            currentRow++;

            // =================================
            // 3 DATA ROWS
            // =================================
            yearBlock.rows.forEach((metricRow: any, rowIdx: number) => {
              const row = worksheetExecutiveSummary.getRow(currentRow);
              const bgColor = rowIdx % 2 === 0 ? WHITE : LIGHT_BLUE;

              // Metric name
              const metricCell = row.getCell(1);
              metricCell.value = metricRow.keyMetric;
              metricCell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              metricCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
              metricCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              metricCell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };

              // Values
              yearBlock.columns.slice(1).forEach((monthName: string, colIdx: number) => {
                const cell: any = row.getCell(colIdx + 2);
                const val = metricRow.values[monthName];
                let displayValue;

                // Auto-format logic
                if ((/spend|amount|cost/i.test(metricRow.keyMetric)) || metricRow.keyMetric === 'Accessorials (Fuel Excluded)' || metricRow.keyMetric === 'Accessorials (Fuel Included)') {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '"$"#,##0.00'; // Currency format

                } else if (metricRow.keyMetric === 'Average Zone') {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '0.00'; // Decimal with two decimals

                } else if (/weight/i.test(metricRow.keyMetric)) {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '#,##0.00';

                } else if (/discount|%/i.test(metricRow.keyMetric)) {
                  displayValue = val ? parseFloat(val) : '';
                  displayValue = val != null ? parseFloat(val) : null;
                  cell.numFmt = '0.00%';
                } else if (/package|count|lb/i.test(metricRow.keyMetric)) {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '#,##0';
                } else if (/zone/i.test(metricRow.keyMetric)) {
                  displayValue = val ? (+val).toFixed(2) : '';
                } else {
                  displayValue = val ? (+val).toFixed(2) : '';
                }

                // Styling
                cell.value = displayValue;
                const isTotalColumn = monthName === 'TOTAL';
                cell.font = { family: 4, size: 10, bold: isTotalColumn, color: { argb: '595959' } };

                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
              });

              currentRow++;
            });

            // Add a gap between each year's section
            currentRow += 3;
          });

          // =================================
          // 4 AUTO-FIT COLUMN WIDTHS
          // =================================
          const totalCols = worksheetExecutiveSummary.columnCount;
          for (let i = 1; i <= totalCols; i++) {
            const col = worksheetExecutiveSummary.getColumn(i);
            let maxLen = 0;
            col.eachCell({ includeEmpty: true }, (cell: any) => {
              const val = cell.value ? cell.value.toString() : '';
              maxLen = Math.max(maxLen, val.length);
            });
            col.width = Math.min(Math.max(maxLen + 3, 12), 30);
          }

          worksheetExecutiveSummary.addRow([]);
        }

        if (this.earnedDescExcelList.data != null && Object.keys(this.earnedDescExcelList.data).length > 0) {
          const data = this.earnedDescExcelList;
          const worksheetEarnedDesc = workbook.addWorksheet('Earned Disc', { views: [{ showGridLines: false }] });

          worksheetEarnedDesc.getColumn(1).width = 15; // Description column
          worksheetEarnedDesc.getColumn(2).width = 15;
          var earnedHeader = ['Invoice Week', 'Earned Disc'];


          let earnedHeaderRow = worksheetEarnedDesc.addRow(earnedHeader);
          earnedHeaderRow.height = 22;
          earnedHeaderRow.eachCell((cell: any, col: any) => {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '000000' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B0C4DE' } };
            cell.alignment = { vertical: 'middle', horizontal: col == 1 ? 'left' : 'center', wrapText: true };
            cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
          });

          // Data Rows
          this.earnedDescExcelList.data.forEach((item: any) => {
            let row = [
              new Date(item.invoiceWeek),
              Number(item.earnedDisc)
            ];
            const excelRow = worksheetEarnedDesc.addRow(row);
            excelRow.eachCell((cell: any, cellNum: any) => {

              if (cellNum === 2) {
                cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: false };
                cell.font = { family: 4, size: 11, bold: false, color: { argb: '595959' } };
                cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                cell.numFmt = '"$"#,##0.00';
              } else if (cellNum === 1) {
                cell.font = { family: 4, size: 10, bold: false, color: { argb: '000000' } };
                cell.alignment = { vertical: 'middle', horizontal: (cellNum === 1) ? 'left' : 'right', wrapText: true };
                cell.border = {
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } }
                };
                cell.numFmt = 'mm/dd/yyyy';
              }
              // Only for Spend and Average columns        
            });
          });
          worksheetEarnedDesc.addRow([]);
        }

        if (this.chargeDescExcelList != null && Object.keys(this.chargeDescExcelList).length > 0) {
          const dataBlocks = this.chargeDescExcelList; // Payload like your JSON (with totals & details)
          const worksheetChargeDesc = workbook.addWorksheet('Charge Description', { views: [{ showGridLines: false }] });

          let currentRow = 1;
          // =============================
          // 1  FREIGHT SUMMARY  (Left)
          // =============================
          const freightHeader = dataBlocks.totalColumns;
          const freightData = dataBlocks.data.totals.charge_frieght;

          freightHeader.forEach((header: any, colIdx: any) => {
            const cell: any = worksheetChargeDesc.getCell(currentRow, colIdx + 1);
            cell.value = header.toUpperCase();
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });
          currentRow++;

          freightData.forEach((rowObj: any) => {
            const row = worksheetChargeDesc.getRow(currentRow);

            let bgColor = 'FFFFFFFF'; // Default (white)
            if (rowObj['Type']) {
              const type = rowObj['Type'].toString().toLowerCase();
              if (type.includes('freight')) bgColor = 'FFFFFF';   // Light blue for Freight
              else if (type.includes('accessorial')) bgColor = 'F2F2F2'; // Light gray for Accessorial
            }

            freightHeader.forEach((colName: any, colIdx: any) => {
              const cell: any = row.getCell(colIdx + 1);
              let value = rowObj[colName];
              if (/charge|amount/i.test(colName)) {
                // cell.value = value ? `$${(+value).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00";
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
              } else if (/%|spend/i.test(colName)) {
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '0.00%';
              } else if (/packages/i.test(colName)) {
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0';
              } else {
                cell.value = value;
              }
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (colIdx === 0 || colName === 'Type') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text columns left
              }
              cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

              //  Bold for Total row
              if (rowObj['Type'] && rowObj['Type'].toString().toLowerCase().includes('total')) {
                cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              }
            });
            currentRow++;
          });

          // =============================
          // 2 GROUND SUMMARY (Right)
          // =============================
          const startColRight = freightHeader.length + 2; // Add space between two tables
          let summaryStartRow = 1;
          const groundHeader = dataBlocks.totalColumns;
          const groundData = dataBlocks.data.totals.charge_ground;

          groundHeader.forEach((header: any, colIdx: any) => {
            const cell: any = worksheetChargeDesc.getCell(summaryStartRow, startColRight + colIdx);
            cell.value = header.toUpperCase();
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });

          summaryStartRow++;

          groundData.forEach((rowObj: any) => {
            const row = worksheetChargeDesc.getRow(summaryStartRow);

            let bgColor = 'FFFFFFFF'; // Default (white)
            if (rowObj['Type']) {
              const type = rowObj['Type'].toString().toLowerCase();
              if (type.includes('just frt ground')) bgColor = 'FFFFFF';   // Light blue for Freight
              else if (type.includes('just frt air')) bgColor = 'F2F2F2'; // Light gray for Accessorial
            }

            groundHeader.forEach((colName: any, colIdx: any) => {
              const cell: any = row.getCell(startColRight + colIdx);
              let value = rowObj[colName];
              if (/charge|amount/i.test(colName)) {
                // cell.value = value ? `$${(+value).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00";
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
              } else if (/%|spend/i.test(colName)) {
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '0.00%';
              } else if (/packages/i.test(colName)) {
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0';
              } else {
                cell.value = value;
              }
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (colIdx === 0 || colName === 'Type') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text columns left
              }
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

              //  Bold for Total row
              if (rowObj['Type'] && rowObj['Type'].toString().toLowerCase().includes('total')) {
                cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              }
            });
            summaryStartRow++;
          });

          // =============================
          // 3  CHARGE DESCRIPTION DETAILS (Vertical Table)
          // =============================
          currentRow = Math.max(currentRow, summaryStartRow) + 1; // Leave gap below summaries
          const detailHeader = dataBlocks.detailColumns;
          const detailData = dataBlocks.data.details;

          // --- Header Row ---
          const headerRow = worksheetChargeDesc.getRow(currentRow);
          detailHeader.forEach((header: any, idx: any) => {
            const cell: any = headerRow.getCell(idx + 1);
            cell.value = header.toUpperCase();
            cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } }; // light gray header
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = {
              top: { style: 'thin', color: { argb: 'D9D9D9' } },
              left: { style: 'thin', color: { argb: 'D9D9D9' } },
              right: { style: 'thin', color: { argb: 'D9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            };
          });
          currentRow++;

          // --- Data Rows (with color by Type) ---
          detailData.forEach((rowObj: any) => {
            const row = worksheetChargeDesc.getRow(currentRow);

            //  Row color based on "Type"
            let bgColor = 'FFFFFFFF'; // Default (white)
            if (rowObj['Type']) {
              const type = rowObj['Type'].toString().toLowerCase();
              if (type.includes('freight')) bgColor = 'FFFFFF'; // Light blue for Freight
              else if (type.includes('accessorial')) bgColor = 'F2F2F2'; // Light greenish-gray for Accessorial
            }

            detailHeader.forEach((colName: any, idx: any) => {
              const cell: any = row.getCell(idx + 1);
              let value = rowObj[colName];

              // --- Formatting Logic ---
              if (colName === 'Zero Charge Package Count') {
                //  Count column — integer formatting only
                cell.value = value ? (+value).toLocaleString('en-US') : '';
              }
              else if (/charge|cost|rate|amount/i.test(colName)) {
                //  Currency columns
                const numVal = parseFloat(value);
                if (!isNaN(numVal)) {
                  cell.value = numVal;
                  cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                } else cell.value = value || '';
              }
              else if (/avg/i.test(colName)) {
                cell.value = value;
                cell.numFmt = '"$"#,##0.00'; // 
              }
              else if (/%|spend|discount/i.test(colName)) {
                //  Percent columns
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '0.00%';
              }
              else if (/package/i.test(colName)) {
                //  Numeric columns
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0';
              }
              else if (/weight|zone/i.test(colName)) {
                //  Numeric columns
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0.00';
              }
              else {
                //  Text columns (like Group, Type)
                cell.value = value;
              }

              // --- Apply Styles ---
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (idx === 0 || colName === 'Type') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text columns left
              }
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });

            currentRow++;
          });

          // =============================
          // 4 Auto-Fit Columns
          // =============================
          const totalCols = detailHeader.length + 5;
          for (let i = 1; i <= totalCols; i++) {
            let maxLen = 0;
            worksheetChargeDesc.eachRow((row: any) => {
              const val = row.getCell(i).value;
              if (val) maxLen = Math.max(maxLen, val.toString().length + 3);
            });
            worksheetChargeDesc.getColumn(i).width = Math.max(maxLen, 10);
          }
          worksheetChargeDesc.addRow([]);
        }

        if (this.invoiceSummaryExcelList != null && Object.keys(this.invoiceSummaryExcelList).length > 0) {
          const payload = this.invoiceSummaryExcelList;
          const columns = payload.columns;
          const dataObj = payload.data;
          const worksheetInvoiceSummary = workbook.addWorksheet('Inv Summary', { views: [{ showGridLines: false }] });
          const TABLE_COLOR = 'B8CCE4';

          // ---------- Helper Functions ----------
          const getActiveColumns = (dataGroup: any) =>
            columns.filter((col: any) => dataGroup.some((record: any) => record[col] && record[col] !== ''));

          const isTotalRow = (record: any) =>
            Object.values(record).some(val => (val + '').toUpperCase() === 'TOTAL');

          //  Enhanced reorderColumns to handle "Package Count" special layout
          const reorderColumns = (serviceKey: any, activeColumns: any) => {
            const reordered = [...activeColumns.map((c: any) => c.trim())];

            // Special layout for "Package Count" table
            if (serviceKey === 'Package Count') {
              const preferredOrder = ['INVOICE DATE', 'AMOUNT', 'PACKAGE COUNT'];
              const finalOrder: any = [];

              preferredOrder.forEach(col => {
                const idx = reordered.findIndex(c => c.toLowerCase() === col.toLowerCase());
                if (idx !== -1) {
                  finalOrder.push(reordered[idx]);
                  reordered.splice(idx, 1);
                }
              });

              // Add remaining columns (optional ones)
              reordered.forEach(col => finalOrder.push(col));
              return finalOrder;
            }

            // Default behavior for others
            const matchIdx = reordered.findIndex(col => col.toLowerCase() === serviceKey.toLowerCase());
            if (matchIdx > 0) {
              const [target] = reordered.splice(matchIdx, 1);
              reordered.unshift(target);
            }
            return reordered;
          };
          // ---------- Section 1: Bill To Account Number ----------
          let verticalRow = 1;
          if (dataObj['Bill To Account Number'] && Array.isArray(dataObj['Bill To Account Number'])) {
            const recipientData = dataObj['Bill To Account Number'];
            let activeColumns = getActiveColumns(recipientData);
            activeColumns = reorderColumns('Bill To Account Number', activeColumns);

            // Header row
            activeColumns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetInvoiceSummary.getCell(verticalRow, colIdx + 1);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } }
              };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
              worksheetInvoiceSummary.getColumn(colIdx + 1).width = 12;
            });
            verticalRow++;

            // Data rows
            recipientData.forEach(record => {
              const isBold = isTotalRow(record);
              activeColumns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetInvoiceSummary.getCell(verticalRow, colIdx + 1);
                const val = record[col];

                // Safe number/dates handling
                if (/(amount|charges|total)/i.test(col) && !/weight/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                  } else cell.value = val || '';
                } else if (/date/i.test(col)) {
                  cell.value = val ? (val) : null;
                  if (val) cell.numFmt = 'mm/dd/yyyy';
                } else if (/\b(count|qty|quantity)\b/i.test(col)) { ///count|qty|quantity/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '#,##0';
                  } else cell.value = val || '';
                } else if (/weight/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '0';
                  } else {
                    cell.value = val || '';
                  }
                }
                else {
                  cell.value = val || '';
                }

                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
                cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                if (isBold) cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              });
              verticalRow++;
            });
            verticalRow += 2; // spacing
          }


          // ---------- Section 2: Other Horizontal Tables ----------
          const otherServiceKeys = Object.keys(dataObj).filter(
            key => key !== 'Bill To Account Number'
          );

          if (otherServiceKeys.length > 0) {
            const horizontalStartRow = 1;
            const maxVerticalColWidth = 6;
            const gapBetweenVerticalAndHorizontal = 1;
            let horizontalBlockCol = maxVerticalColWidth + gapBetweenVerticalAndHorizontal;

            otherServiceKeys.forEach(serviceKey => {
              const serviceData = dataObj[serviceKey];
              if (!Array.isArray(serviceData) || serviceData.length === 0) return;
              let blockRow = horizontalStartRow;

              let activeColumns = getActiveColumns(serviceData);
              activeColumns = reorderColumns(serviceKey, activeColumns);

              // Header row
              activeColumns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetInvoiceSummary.getCell(blockRow, horizontalBlockCol + colIdx);
                cell.value = col.toUpperCase();
                cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TABLE_COLOR } };
                worksheetInvoiceSummary.getColumn(horizontalBlockCol + colIdx).width = 10;
              });
              blockRow++;

              // Data rows
              serviceData.forEach(record => {
                const isBold = isTotalRow(record);
                activeColumns.forEach((col: any, colIdx: any) => {
                  const cell: any = worksheetInvoiceSummary.getCell(blockRow, horizontalBlockCol + colIdx);
                  const val = record[col];
                  cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

                  if (/amount|spend|total spend|charges/i.test(col) && !/weight/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal;
                      cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                    } else cell.value = val || '';
                  } else if (/percentage|discount %|percent/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal / 100;
                      cell.numFmt = '0.00%';
                    } else cell.value = val || '';
                  } else if (/count|qty|quantity/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal;
                      cell.numFmt = '#,##0';
                    } else cell.value = val || '';
                  } else if (/weight/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal;
                      cell.numFmt = '0';
                    } else {
                      cell.value = val || '';
                    }
                  } else if (/date/i.test(col)) {
                    // Use a proper date parsing and check
                    let dateObj = null;
                    if (val && !isNaN(Date.parse(val))) {
                      dateObj = (val);
                    }
                    cell.value = dateObj;
                    if (dateObj) {
                      cell.numFmt = 'mm/dd/yyyy';
                    } else {
                      // For invalid values like "Total", "#NUM!", etc., set as plain text
                      cell.value = val;
                      cell.numFmt = undefined; // Ensures Excel does not treat as date
                    }
                  } else {
                    cell.value = val || '';
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                  }

                  cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
                  cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                  if (isBold) cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
                });
                blockRow++;
              });

              horizontalBlockCol += activeColumns.length + 1;
            });
          }

          // ---------- Autofit Column Widths ----------
          for (let c = 1; c <= worksheetInvoiceSummary.columnCount; c++) {
            let maxLength = 10;
            const column = worksheetInvoiceSummary.getColumn(c);
            column.eachCell({ includeEmpty: true }, (cell: any) => {
              if (cell.value) {
                const cellText = cell.value.toString();
                maxLength = Math.max(maxLength, cellText.length);
              }
            });
            column.width = Math.min(maxLength + 2, 30);
          }

          // Force description columns wider
          columns.forEach((col: any, idx: any) => {
            if (/description|charge desc|details/i.test(col)) {
              worksheetInvoiceSummary.getColumn(idx + 1).width = 22;
            }
          });

          worksheetInvoiceSummary.addRow([]);
        }

        if (this.servZoneExcelList.data != null && this.servZoneExcelList != "") {
          const columns = this.servZoneExcelList.columns;
          const data = this.servZoneExcelList.data;
          const worksheetServZone = workbook.addWorksheet('ServZoneD', { views: [{ showGridLines: false }] });

          let currentRow = 1;

          Object.keys(data).forEach(sectionKey => {
            // 1. Section header (merged)
            worksheetServZone.mergeCells(currentRow, 1, currentRow, columns.length);
            const titleCell = worksheetServZone.getCell(currentRow, 1);
            titleCell.value = sectionKey;
            titleCell.font = { family: 4, size: 14, bold: true, color: { argb: '595959' } };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            currentRow++;

            // 2. Table header
            columns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetServZone.getCell(currentRow, colIdx + 1);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
            });
            currentRow++;

            // Keep max cell width for autofit
            const colWidths = Array(columns.length).fill(0);

            // 3. Table data rows (autodetect percent/currency based on values)
            (data[sectionKey] || []).forEach((rowData: any) => {
              columns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetServZone.getCell(currentRow, colIdx + 1);
                let value = rowData[col];

                if (/percent|%/i.test(sectionKey) && col !== "Service/Zone") {
                  // Set numeric value as decimal
                  cell.value = value !== undefined ? parseFloat(value) : 0;
                  // Set Excel format as percentage with two decimals
                  cell.numFmt = '0.00%';
                } else if (/cost|amount|usd/i.test(sectionKey) && col !== "Service/Zone") {
                  // Set numeric value as number
                  cell.value = value !== undefined ? parseFloat(value) : 0;
                  // Set Excel format as currency
                  cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                } else if (/Transactions/i.test(sectionKey) && col !== "Service/Zone") {
                  cell.value = value ? Math.round(+value) : 0;
                  cell.numFmt = '#,##0';
                } else {
                  // For non-numeric or other fields keep the plain value
                  cell.value = value !== undefined ? value : "";
                  // Clear number format just in case
                  cell.numFmt = '#,##0';
                }

                // Common styling
                cell.font = { family: 4, size: 10, bold: rowData["Service/Zone"] === "TOTALS", color: { argb: '595959' } };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } }
                };

                // Totals row special formatting
                if (rowData["Service/Zone"] === "TOTALS") {
                  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
                  cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
                }

                // Update column width estimate
                colWidths[colIdx] = Math.max(colWidths[colIdx], (cell.value ? cell.value.toString().length : 0));
              });
              currentRow++;
            });


            // Autofit column widths for this block
            columns.forEach((col: any, colIdx: any) => {
              worksheetServZone.getColumn(colIdx + 1).width = Math.max(10, colWidths[colIdx] + 2);
            });

            // Blank row between blocks
            currentRow++;
          });
          worksheetServZone.addRow([]);
        }

        if (this.groundExcelList != null && Object.keys(this.groundExcelList).length > 0) {
          const dataBlocks = this.groundExcelList; // Your API structure with ORIGIN POINTS and DESTINATION POINTS lists

          const worksheetground = workbook.addWorksheet('Ground', { views: [{ showGridLines: false }] });

          let currentRow = 1;

          // Iterate over each block ("Ground Commercial", "Ground Residential")
          dataBlocks.columns.forEach((blockColArr: string[], bIdx: number) => {
            const blockHeader = blockColArr[0]; // e.g. "Ground Commercial"
            const columns = blockColArr.slice(1);
            const tableData = dataBlocks.data[blockHeader] || [];

            // Add vertical space between tables
            if (bIdx > 0) {
              currentRow += 2;
            }

            // --- 1 Table Header Row ---
            const headerRow = worksheetground.getRow(currentRow);
            const headerNames = [blockHeader, ...columns];

            headerNames.forEach((h, i) => {
              const cell: any = headerRow.getCell(i + 1);
              cell.value = h.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } }; //  header color
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });
            currentRow++;

            // --- 2 Data Rows ---
            tableData.forEach((rowObj: any) => {
              const row = worksheetground.getRow(currentRow);

              // RangeValue column (text or number as needed)
              row.getCell(1).value = rowObj['RangeValue'];
              row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
              row.getCell(1).font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };

              columns.forEach((colName: any, colIdx: any) => {
                const cell: any = row.getCell(colIdx + 2);
                let value = rowObj[colName];

                if (/net amount|cost/i.test(colName)) {
                  // Currency: set numeric value, apply currency format
                  cell.value = value ? +value : 0;
                  cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
                } else if (/txn count/i.test(colName)) {
                  // Integer count - set number, no decimals
                  cell.value = value ? Math.round(+value) : 0;
                  cell.numFmt = '#,##0';
                } else if (/% of total|discount/i.test(colName)) {
                  // Percent - set decimal value, multiply by 1 if your data is already fraction,
                  // or adjust accordingly. Here assuming the value is fractional
                  cell.value = value ? parseFloat(value) : 0;
                  cell.numFmt = '0.00%';
                } else {
                  // Regular numbers (2 decimals)
                  cell.value = value ? +parseFloat(value).toFixed(2) : 0;
                  cell.numFmt = '0.00';
                }

                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
              });

              // Border for RangeValue column
              row.getCell(1).border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };

              currentRow++;
            });

          });

          // --- 3 Auto-Fit Column Widths ---
          const maxCols = Math.max(...dataBlocks.columns.map((col: any) => col.length));
          for (let i = 1; i <= maxCols; i++) {
            let maxLen = 0;
            worksheetground.eachRow((row: any) => {
              const val = row.getCell(i).value;
              if (val) maxLen = Math.max(maxLen, val.toString().length + 3);
            });
            worksheetground.getColumn(i).width = Math.max(maxLen, 10);
          }
          worksheetground.addRow([]);
        }

        if (this.locationsExcelList != null && Object.keys(this.locationsExcelList).length > 0) {
          const dataBlocks = this.locationsExcelList; // Example: { "DESTINATION POINTS": [...], "ORIGIN POINTS": [...] }

          const worksheetLocation = workbook.addWorksheet('Locations', { views: [{ showGridLines: false }] });

          const headers = ["LOCATION", "SHIPMENTS"];

          //  Force correct table order regardless of API order
          const orderedBlocks = ["ORIGIN POINTS", "DESTINATION POINTS"];
          const blockStartCols = [1, 4]; // Left, Right placement

          orderedBlocks.forEach((blockKey, idx) => {
            const rows = dataBlocks[blockKey] || [];
            const startCol = blockStartCols[idx];

            // ==========================================================
            // 1 Header Titles (ORIGIN / DESTINATION)
            // ==========================================================
            const titleCell = worksheetLocation.getCell(1, startCol);
            titleCell.value = blockKey;
            titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffff' } };
            titleCell.font = { family: 4, size: 12, bold: true, color: { argb: '4F81BD' } };
            titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
            // titleCell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' }}, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

            // ==========================================================
            // 2 Table Headers (Row 3 immediately under header)
            // ==========================================================
            worksheetLocation.getCell(3, startCol).value = headers[0];
            worksheetLocation.getCell(3, startCol).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            worksheetLocation.getCell(3, startCol).font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            worksheetLocation.getCell(3, startCol).alignment = { vertical: 'middle', horizontal: 'left' };
            worksheetLocation.getCell(3, startCol).border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

            worksheetLocation.getCell(3, startCol + 1).value = headers[1];
            worksheetLocation.getCell(3, startCol + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            worksheetLocation.getCell(3, startCol + 1).font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            worksheetLocation.getCell(3, startCol + 1).alignment = { vertical: 'middle', horizontal: 'right' };
            worksheetLocation.getCell(3, startCol + 1).border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
            // ==========================================================
            // 3 Data Rows (start right below headers, row 4)
            // ==========================================================
            rows.forEach((rowObj: any, ridx: any) => {
              const rowNo = 4 + ridx;

              const locationCell = worksheetLocation.getCell(rowNo, startCol);
              const shipmentCell = worksheetLocation.getCell(rowNo, startCol + 1);

              // --- Location ---
              locationCell.value = rowObj.location || '';
              locationCell.alignment = { vertical: 'middle', horizontal: 'left' };
              locationCell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              locationCell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };

              // --- Shipments ---
              let shipmentValue = rowObj.shipment ?? '0';
              if (typeof shipmentValue === 'string') {
                shipmentValue = shipmentValue.trim();
                if (/^-?\d+(\.\d+)?$/.test(shipmentValue)) shipmentValue = parseFloat(shipmentValue);
              }

              shipmentCell.value = typeof shipmentValue === 'number' ? shipmentValue : 0;
              shipmentCell.numFmt = '#,##0';
              shipmentCell.alignment = { vertical: 'middle', horizontal: 'right' };
              shipmentCell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              shipmentCell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };

              // --- Font Style (bold for TOTAL rows) ---
              if ((rowObj.location || "").toUpperCase().includes("TOTAL")) {
                locationCell.font = shipmentCell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              } else {
                locationCell.font = shipmentCell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              }
            });

            // ==========================================================
            // 4 Auto-fit Columns
            // ==========================================================
            let colWidths = [headers[0].length, headers[1].length];
            rows.forEach((rowObj: any) => {
              colWidths[0] = Math.max(colWidths[0], (rowObj.location || '').toString().length);
              colWidths[1] = Math.max(colWidths[1], (rowObj.shipment || '').toString().length);
            });

            worksheetLocation.getColumn(startCol).width = Math.max(12, Math.min(32, colWidths[0] + 2));
            worksheetLocation.getColumn(startCol + 1).width = Math.max(10, Math.min(16, colWidths[1] + 2));

            // Add spacing column between tables
            if (idx === 0) worksheetLocation.getColumn(startCol + 2).width = 2;
          });

          worksheetLocation.addRow([]); // Small final gap row only
        }

        if (this.weightZoneExcelList?.data != null) {
          const columns = this.weightZoneExcelList.columns;
          const data = this.weightZoneExcelList.data;

          const worksheetWeightZone = workbook.addWorksheet('WeightZoneD', {
            views: [{ showGridLines: false }],
          });

          // Styling constants
          const HEADER_COLOR = 'B8CCE4';  //'B7C9DC'; // bluish header
          const WHITE = 'FFFFFF';
          const FONT_COLOR = '595959';

          let maxRows = 0;
          let startCol = 1; //  FIX: must start from 1

          Object.keys(data).forEach((serviceName, blockIdx) => {
            let rowOffset = 1;

            // 1 "Service" label in block's first column
            const serviceLabelCell = worksheetWeightZone.getCell(rowOffset, startCol);
            serviceLabelCell.value = 'SERVICE';
            serviceLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            serviceLabelCell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            serviceLabelCell.alignment = { vertical: 'middle', horizontal: 'left' };
            serviceLabelCell.border = {
              top: { style: 'thin', color: { argb: 'D9D9D9' } },
              left: { style: 'thin', color: { argb: 'D9D9D9' } },
              right: { style: 'thin', color: { argb: 'D9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            };

            // 2 Merged cell for service name
            if (columns.length > 1) {
              worksheetWeightZone.mergeCells(
                rowOffset,
                startCol + 1,
                rowOffset,
                startCol + columns.length - 1
              );
            }

            const serviceNameCell = worksheetWeightZone.getCell(rowOffset, startCol + 1);
            serviceNameCell.value = serviceName.toUpperCase();
            serviceNameCell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            serviceNameCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            serviceNameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };

            // Add border to merged row range
            for (let i = 0; i < columns.length; i++) {
              const c = worksheetWeightZone.getCell(rowOffset, startCol + i);
              c.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            }

            // 3 Table headers
            columns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetWeightZone.getCell(rowOffset + 1, startCol + colIdx);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: FONT_COLOR } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } };
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (cell.value == 'BILLEDWEIGHT' || cell.value == 'OTHER') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              }
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });

            // 4 Data rows
            data[serviceName].forEach((rowData: any, rowIdx: any) => {
              columns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetWeightZone.getCell(rowOffset + 2 + rowIdx, startCol + colIdx);
                let value = rowData[col] ?? '0';

                //  Convert numeric strings like "1", "1234.56" into actual numbers
                if (typeof value === 'string') {
                  value = value.trim();

                  // Optional: remove commas if string like "1,234.50"
                  if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) {
                    value = value.replace(/,/g, '');
                  }

                  // Check if it's a valid number string
                  if (/^-?\d+(\.\d+)?$/.test(value)) {
                    value = parseFloat(value);
                  }
                }

                //  Now handle numbers properly (including those converted from strings)
                if (typeof value === 'number') {
                  cell.value = value;
                  cell.numFmt = '#,##0'; // Number formatting with commas
                } else {
                  cell.value = value; // Keep text as-is
                  cell.numFmt = undefined;
                }

                // === Cell styling remains same ===
                if (col == "BilledWeight") {
                  cell.font = { family: 4, size: 10, bold: true, color: { argb: FONT_COLOR } };
                } else {
                  cell.font = { family: 4, size: 10, bold: false, color: { argb: FONT_COLOR } };
                }
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: colIdx === 0 ? 'left' : 'right', // fixed: colIdx is a number, not string
                };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WHITE } };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
              });
            });

            // Track maximum required row count
            maxRows = Math.max(maxRows, data[serviceName].length + 2);

            // Set width for each table's columns
            for (let i = 0; i < columns.length; i++) {
              worksheetWeightZone.getColumn(startCol + i).width = 12;
            }

            // 5 Add a blank gap column after each table block
            const gapCol = startCol + columns.length;
            worksheetWeightZone.getColumn(gapCol).width = 4;
            for (let r = 1; r <= maxRows; r++) {
              worksheetWeightZone.getCell(r, gapCol).value = ''; // keep blank
            }

            // Move startCol for the next block
            startCol += columns.length + 1;
          });

          worksheetWeightZone.addRow([]);
        }

      } else {

        if (this.sccExcelList.length > 0) {
          var worksheetScc = workbook.addWorksheet('SCC', {
            views: [{ showGridLines: false }]
          });
          worksheetScc.getColumn(1).width = 55; // Description column
          worksheetScc.getColumn(2).width = 10; // Count
          worksheetScc.getColumn(3).width = 15; // Spend
          worksheetScc.getColumn(4).width = 10; // Average

          worksheetScc.addRow([]);

          // Header Row
          var sccHeader = [
            'SHIPPING CHARGE CORRECTIONS',
            'COUNT',
            'SPEND',
            'AVERAGE'
          ];
          let sccHeaderRow = worksheetScc.addRow(sccHeader);
          sccHeaderRow.height = 22;
          sccHeaderRow.eachCell((cell: any, col: any) => {
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.alignment = { vertical: 'middle', horizontal: col == 1 ? 'left' : 'center', wrapText: true };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });

          // Data Rows
          this.sccExcelList.forEach((item: any) => {
            let row = [
              item.shippingChargeCorrections,
              Number(item.count),
              Number(item.spend),
              Number(item.average)
            ];
            const excelRow = worksheetScc.addRow(row);
            excelRow.eachCell((cell: any, cellNum: any) => {
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              cell.alignment = {
                vertical: 'middle',
                horizontal: (cellNum === 1) ? 'left' : 'right',
                wrapText: true
              };
              cell.border = {
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } }
              };
              // Only for Spend and Average columns
              if (cellNum === 2) cell.numFmt = '#,##0';
              if (cellNum === 3 || cellNum === 4) cell.numFmt = '_($* #,##0.00_);_($* (#,##0.00);_($* "-"??_);_(@_)';
            });
          });
          worksheetScc.addRow([]);
        }

        if (this.revenueTierExcelList != null && Object.keys(this.revenueTierExcelList).length > 0) {
          const dataBlocks = this.revenueTierExcelList;

          const worksheetReveneueTier = workbook.addWorksheet('Revenue Tier', { views: [{ showGridLines: false }] });

          let currentRow = 1;
          const BLUE_HEADER = 'B8CCE4'; //'507BA1';
          const LIGHT_BLUE = 'F2F2F2';
          const WHITE = 'FFFFFF';

          //  MAIN HEADER
          const headers = [
            'CLIENT ID NUMBER',
            'CLIENT NAME',
            'RUN DATE',
            'ACCOUNT NUMBER',
            'INVOICE/BILLED DATE',
            '52 WEEK ROLLING AVERAGE',
            'CURRENT TIER',
          ];

          const headerRow = worksheetReveneueTier.getRow(currentRow);
          headers.forEach((h, i) => {
            const cell: any = headerRow.getCell(i + 1);
            cell.value = h;
            cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {
              top: { style: 'thin', color: { argb: 'D9D9D9' } },
              left: { style: 'thin', color: { argb: 'D9D9D9' } },
              right: { style: 'thin', color: { argb: 'D9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            };
          });
          currentRow++;

          // 2 FETCH DATA
          const clientInfo =
            dataBlocks.revenueBandTierList.find((r: any) => r.clientIdNumber || r.clientName || r.runDate || r.accountNumber) || {};

          const historyList = dataBlocks.revenueBandTierList.filter((r: any) => r.invoiceBilledDate && r.weekRollingAverage);
          const tierBands = dataBlocks.revenueBidList;

          // 3 FILL TOP CLIENT ROW
          const clientRow = worksheetReveneueTier.getRow(currentRow);
          clientRow.getCell(1).value = clientInfo.clientIdNumber || '';
          clientRow.getCell(2).value = clientInfo.clientName || '';
          clientRow.getCell(3).value = clientInfo.runDate ? new Date(clientInfo.runDate) : null;
          clientRow.getCell(3).numFmt = 'mm/dd/yyyy';
          clientRow.getCell(4).value = clientInfo.accountNumber || '';

          const firstHistory = historyList[0];
          if (firstHistory) {
            clientRow.getCell(5).value = firstHistory.invoiceBilledDate ? new Date(firstHistory.invoiceBilledDate) : null;
            clientRow.getCell(5).numFmt = 'mm/dd/yyyy';

            clientRow.getCell(6).value = firstHistory.weekRollingAverage != null ? +firstHistory.weekRollingAverage : 0;
            clientRow.getCell(6).numFmt = '"$"#,##0.00';

            clientRow.getCell(7).value = firstHistory.currentTier != null ? +firstHistory.currentTier : null;
            clientRow.getCell(7).numFmt = '#,##0';
          }

          // Styling for client row
          for (let i = 1; i <= 7; i++) {
            const c = clientRow.getCell(i);
            c.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
            c.alignment = { vertical: 'middle', horizontal: i >= 5 ? 'right' : 'left', wrapText: true };
            c.border = {
              top: { style: 'thin', color: { argb: 'D9D9D9' } },
              left: { style: 'thin', color: { argb: 'D9D9D9' } },
              right: { style: 'thin', color: { argb: 'D9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            };
          }
          currentRow++;

          // 4 HISTORY + BID REVENUE TIER BAND TABLE
          const tierTableStartRow = 5; // Starting row for band table (after header and 3 history rows)
          const totalRows = Math.max(historyList.length, tierBands.length + tierTableStartRow);

          for (let i = 0; i < totalRows; i++) {
            const row = worksheetReveneueTier.getRow(currentRow);
            const bgColor = i % 2 === 0 ? LIGHT_BLUE : WHITE;

            // Right Section - Weekly History
            const hist = historyList[i];
            if (hist) {
              const dateCell = row.getCell(5);
              dateCell.value = hist.invoiceBilledDate ? new Date(hist.invoiceBilledDate) : null;
              dateCell.numFmt = 'mm/dd/yyyy';
              dateCell.alignment = { vertical: 'middle', horizontal: 'right' };
              dateCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };

              const avgCell = row.getCell(6);
              avgCell.value = hist.weekRollingAverage != null ? +hist.weekRollingAverage : 0;
              avgCell.numFmt = '"$"#,##0.00';
              avgCell.alignment = { vertical: 'middle', horizontal: 'right' };
              avgCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };

              const tierCell = row.getCell(7);
              tierCell.value = hist.currentTier != null ? +hist.currentTier : null;
              tierCell.numFmt = '#,##0';
              tierCell.alignment = { vertical: 'middle', horizontal: 'right' };
              tierCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };

              [5, 6, 7].forEach((c) => {
                row.getCell(c).border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
                row.getCell(c).font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              });
            }

            // Left Section - Bid Revenue Tier Band
            if (currentRow >= tierTableStartRow) {
              const bandIndex = currentRow - tierTableStartRow;

              if (bandIndex === 0) {
                // Header row for Bid Revenue Tier Band Table
                worksheetReveneueTier.mergeCells(currentRow, 1, currentRow, 2);
                const bandHeader = row.getCell(1);
                bandHeader.value = 'BID REVENUE TIER BAND';
                bandHeader.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
                bandHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
                bandHeader.alignment = { vertical: 'middle', horizontal: 'center' };
                bandHeader.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };

                const tierHeader = row.getCell(3);
                tierHeader.value = 'TIER';
                tierHeader.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
                tierHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
                tierHeader.alignment = { vertical: 'middle', horizontal: 'center' };
                tierHeader.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };

              } else if (tierBands[bandIndex - 1]) {
                const t = tierBands[bandIndex - 1];

                const fromCell = row.getCell(1);
                fromCell.value = t.fromRange || '';
                fromCell.alignment = { vertical: 'middle', horizontal: 'left' };
                fromCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                fromCell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
                fromCell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };

                const toCell = row.getCell(2);
                toCell.value = t.toRange || '';
                toCell.alignment = { vertical: 'middle', horizontal: 'left' };
                toCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                toCell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
                toCell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };

                const tierCell = row.getCell(3);
                tierCell.value = t.tier != null ? +t.tier : null;
                tierCell.numFmt = '#,##0';
                tierCell.alignment = { vertical: 'middle', horizontal: 'center' };
                tierCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                tierCell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
                tierCell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
              }
            }

            currentRow++;
          }

          // 5 AUTO-FIT COLUMNS
          for (let i = 1; i <= 7; i++) {
            let maxLen = 10;
            worksheetReveneueTier.eachRow((row: any) => {
              const val = row.getCell(i).value;
              if (val) maxLen = Math.max(maxLen, val.toString().length + 3);
            });
            worksheetReveneueTier.getColumn(i).width = Math.max(maxLen, 12);
          }

          worksheetReveneueTier.getColumn(3).width = 14; // Run Date
          worksheetReveneueTier.getColumn(5).width = 14; // Invoice/Billed Date
          worksheetReveneueTier.addRow([]);
        }

        if (this.executiveSummaryExcelList != null && Object.keys(this.executiveSummaryExcelList).length > 0) {
          const data = this.executiveSummaryExcelList;
          const worksheetExecutiveSummary = workbook.addWorksheet('Executive Summary', { views: [{ showGridLines: false }] });

          const BLUE_HEADER = 'B8CCE4'; //'4F81BD';
          // const LIGHT_BLUE = 'D0E3FF';
          // const WHITE = 'E6E1E1';
          const LIGHT_BLUE = 'F2F2F2';
          const WHITE = 'FFFFFF';

          let currentRow = 1;

          // Iterate through each year and append vertically
          Object.keys(data).forEach((yearKey, yearIndex) => {
            const yearBlock = data[yearKey];

            // =================================
            // 1 ADD YEAR TITLE ROW
            // =================================
            // const yearTitleRow = worksheetExecutiveSummary.getRow(currentRow);
            // const titleCell = yearTitleRow.getCell(1);
            // titleCell.value = `${yearKey} Metrics`;
            // titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
            // titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
            // titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
            // worksheetExecutiveSummary.mergeCells(currentRow, 1, currentRow, yearBlock.columns.length);
            // currentRow += 2;

            // =================================
            // 2 HEADER ROW
            // =================================
            const headerRow = worksheetExecutiveSummary.getRow(currentRow);
            yearBlock.columns.forEach((colName: string, idx: number) => {
              const cell: any = headerRow.getCell(idx + 1);
              cell.value = colName.toUpperCase();
              cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE_HEADER } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });
            currentRow++;

            // =================================
            // 3 DATA ROWS
            // =================================
            yearBlock.rows.forEach((metricRow: any, rowIdx: number) => {
              const row = worksheetExecutiveSummary.getRow(currentRow);
              const bgColor = rowIdx % 2 === 0 ? WHITE : LIGHT_BLUE;

              // Metric name
              const metricCell = row.getCell(1);
              metricCell.value = metricRow.keyMetric;
              metricCell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              metricCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
              metricCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              metricCell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };

              // Values
              yearBlock.columns.slice(1).forEach((monthName: string, colIdx: number) => {
                const cell: any = row.getCell(colIdx + 2);
                const val = metricRow.values[monthName];
                let displayValue;

                // Auto-format logic
                if (metricRow.keyMetric === 'Accessorials (Fuel Excluded)') {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '"$"#,##0.00'; // Currency format

                } else if (metricRow.keyMetric === 'Average Zone') {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '0.00'; // Decimal with two decimals

                } else if (/weight/i.test(metricRow.keyMetric)) {
                  displayValue = val != null ? +val : null;
                  cell.numFmt = '#,##0.000';

                } else if (metricRow.keyMetric === 'Accessorials (Fuel Included)') {
                  displayValue = val != null ? parseFloat(val) : null;
                  cell.numFmt = '#,##0'; // Count number formatting

                } else if (/spend|amount|cost/i.test(metricRow.keyMetric)) {
                  displayValue = val
                    ? `$${(+val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : '';
                } else if (/discount|%/i.test(metricRow.keyMetric)) {
                  displayValue = val
                    ? parseFloat(val)
                    : '';
                  cell.numFmt = '0.00%';
                } else if (/package|count|lb/i.test(metricRow.keyMetric)) {
                  displayValue = val ? +val : '';
                  cell.numFmt = '#,##0';
                } else if (/zone/i.test(metricRow.keyMetric)) {
                  displayValue = val ? (+val).toFixed(2) : '';
                } else {
                  displayValue = val ? (+val).toFixed(2) : '';
                }

                // Styling
                cell.value = displayValue;
                const isTotalColumn = monthName === 'TOTAL';
                cell.font = { family: 4, size: 10, bold: isTotalColumn, color: { argb: '595959' } };

                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                cell.alignment = { vertical: 'middle', horizontal: 'right' };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
              });

              currentRow++;
            });

            // Add a gap between each year's section
            currentRow += 3;
          });

          // =================================
          // 4 AUTO-FIT COLUMN WIDTHS
          // =================================
          const totalCols = worksheetExecutiveSummary.columnCount;
          for (let i = 1; i <= totalCols; i++) {
            const col = worksheetExecutiveSummary.getColumn(i);
            let maxLen = 0;
            col.eachCell({ includeEmpty: true }, (cell: any) => {
              const val = cell.value ? cell.value.toString() : '';
              maxLen = Math.max(maxLen, val.length);
            });
            col.width = Math.min(Math.max(maxLen + 3, 12), 30);
          }

          worksheetExecutiveSummary.addRow([]);
        }

        if (this.invoiceSummaryExcelList != null && Object.keys(this.invoiceSummaryExcelList).length > 0) {
          const payload = this.invoiceSummaryExcelList;
          const columns = payload.columns;
          const dataObj = payload.data;
          const worksheetInvoiceSummary = workbook.addWorksheet('Inv Summary', { views: [{ showGridLines: false }] });
          const TABLE_COLOR = 'B8CCE4';

          // ---------- Helper Functions ----------
          const getActiveColumns = (dataGroup: any) =>
            columns.filter((col: any) => dataGroup.some((record: any) => record[col] && record[col] !== ''));

          const isTotalRow = (record: any) =>
            Object.values(record).some(val => (val + '').toUpperCase() === 'TOTAL');

          //  Enhanced reorderColumns to handle "Package Count" special layout
          const reorderColumns = (serviceKey: any, activeColumns: any) => {
            const reordered = [...activeColumns.map((c: any) => c.trim())];

            // Special layout for "Package Count" table
            if (serviceKey === 'Package Count') {
              const preferredOrder = ['INVOICE DATE', 'AMOUNT', 'PACKAGE COUNT'];
              const finalOrder: any = [];

              preferredOrder.forEach(col => {
                const idx = reordered.findIndex(c => c.toLowerCase() === col.toLowerCase());
                if (idx !== -1) {
                  finalOrder.push(reordered[idx]);
                  reordered.splice(idx, 1);
                }
              });

              // Add remaining columns (optional ones)
              reordered.forEach(col => finalOrder.push(col));
              return finalOrder;
            }

            // Default behavior for others
            const matchIdx = reordered.findIndex(col => col.toLowerCase() === serviceKey.toLowerCase());
            if (matchIdx > 0) {
              const [target] = reordered.splice(matchIdx, 1);
              reordered.unshift(target);
            }
            return reordered;
          };

          // ---------- Section 1: Recipient Number ----------
          let verticalRow = 1;
          if (dataObj['Recipient Number'] && Array.isArray(dataObj['Recipient Number'])) {
            const recipientData = dataObj['Recipient Number'];
            let activeColumns = getActiveColumns(recipientData);
            activeColumns = reorderColumns('Recipient Number', activeColumns);

            // Header row
            activeColumns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetInvoiceSummary.getCell(verticalRow, colIdx + 1);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } }
              };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
              worksheetInvoiceSummary.getColumn(colIdx + 1).width = 12;
            });
            verticalRow++;

            // Data rows
            recipientData.forEach(record => {
              const isBold = isTotalRow(record);
              activeColumns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetInvoiceSummary.getCell(verticalRow, colIdx + 1);
                const val = record[col];

                // Safe number/dates handling
                if (/amount|charges|total/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                  } else cell.value = val || '';
                } else if (/date/i.test(col)) {
                  cell.value = val ? (val) : null;
                  if (val) cell.numFmt = 'mm/dd/yyyy';
                } else if (/count|qty|quantity/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '#,##0';
                  } else cell.value = val || '';
                } else {
                  cell.value = val || '';
                }

                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
                cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                if (isBold) cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              });
              verticalRow++;
            });
            verticalRow += 2; // spacing
          }

          // ---------- Section 2: Account Number ----------
          if (dataObj['Account Number'] && Array.isArray(dataObj['Account Number'])) {
            const accountData = dataObj['Account Number'];
            let activeColumns = getActiveColumns(accountData);
            activeColumns = reorderColumns('Account Number', activeColumns);

            activeColumns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetInvoiceSummary.getCell(verticalRow, colIdx + 1);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TABLE_COLOR } };
              worksheetInvoiceSummary.getColumn(colIdx + 1).width = 10;
            });
            verticalRow++;

            accountData.forEach(record => {
              const isBold = isTotalRow(record);
              activeColumns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetInvoiceSummary.getCell(verticalRow, colIdx + 1);
                const val = record[col];

                if (/amount|charges|total/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                  } else cell.value = val || '';
                } else if (/date/i.test(col)) {
                  cell.value = val ? (val) : null;
                  if (val) cell.numFmt = 'mm/dd/yyyy';
                } else if (/\b(count|qty|quantity)\b/i.test(col)) { ///count|qty|quantity/i.test(col)) {
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    cell.value = numVal;
                    cell.numFmt = '#,##0';
                  } else cell.value = val || '';
                } else {
                  cell.value = val || '';
                }

                cell.alignment = { vertical: 'middle', horizontal: 'left' };
                cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
                cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                if (isBold) cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              });
              verticalRow++;
            });
          }

          // ---------- Section 3: Other Horizontal Tables ----------
          const otherServiceKeys = Object.keys(dataObj).filter(
            key => key !== 'Recipient Number' && key !== 'Account Number'
          );

          if (otherServiceKeys.length > 0) {
            const horizontalStartRow = 1;
            const maxVerticalColWidth = 6;
            const gapBetweenVerticalAndHorizontal = 1;
            let horizontalBlockCol = maxVerticalColWidth + gapBetweenVerticalAndHorizontal;

            otherServiceKeys.forEach(serviceKey => {
              const serviceData = dataObj[serviceKey];
              if (!Array.isArray(serviceData) || serviceData.length === 0) return;
              let blockRow = horizontalStartRow;

              let activeColumns = getActiveColumns(serviceData);
              activeColumns = reorderColumns(serviceKey, activeColumns);

              // Header row
              activeColumns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetInvoiceSummary.getCell(blockRow, horizontalBlockCol + colIdx);
                cell.value = col.toUpperCase();
                cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TABLE_COLOR } };
                worksheetInvoiceSummary.getColumn(horizontalBlockCol + colIdx).width = 10;
              });
              blockRow++;

              // Data rows
              serviceData.forEach(record => {
                const isBold = isTotalRow(record);
                activeColumns.forEach((col: any, colIdx: any) => {
                  const cell: any = worksheetInvoiceSummary.getCell(blockRow, horizontalBlockCol + colIdx);
                  const val = record[col];
                  cell.alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };

                  if (/amount|spend|total spend|charges/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal;
                      cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                    } else cell.value = val || '';
                  } else if (/percentage|discount %|percent/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal / 100;
                      cell.numFmt = '0.00%';
                    } else cell.value = val || '';
                  } else if (/count|qty|quantity/i.test(col)) {
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      cell.value = numVal;
                      cell.numFmt = '#,##0';
                    } else cell.value = val || '';
                  } else if (/date/i.test(col)) {
                    // Use a proper date parsing and check
                    let dateObj = null;
                    if (val && !isNaN(Date.parse(val))) {
                      dateObj = (val);
                    }
                    cell.value = dateObj;
                    if (dateObj) {
                      cell.numFmt = 'mm/dd/yyyy';
                    } else {
                      // For invalid values like "Total", "#NUM!", etc., set as plain text
                      cell.value = val;
                      cell.numFmt = undefined; // Ensures Excel does not treat as date
                    }
                  } else {
                    cell.value = val || '';
                    cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                  }

                  cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
                  cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
                  if (isBold) cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
                });
                blockRow++;
              });

              horizontalBlockCol += activeColumns.length + 1;
            });
          }

          // ---------- Autofit Column Widths ----------
          for (let c = 1; c <= worksheetInvoiceSummary.columnCount; c++) {
            let maxLength = 10;
            const column = worksheetInvoiceSummary.getColumn(c);
            column.eachCell({ includeEmpty: true }, (cell: any) => {
              if (cell.value) {
                const cellText = cell.value.toString();
                maxLength = Math.max(maxLength, cellText.length);
              }
            });
            column.width = Math.min(maxLength + 2, 30);
          }

          // Force description columns wider
          columns.forEach((col: any, idx: any) => {
            if (/description|charge desc|details/i.test(col)) {
              worksheetInvoiceSummary.getColumn(idx + 1).width = 22;
            }
          });

          worksheetInvoiceSummary.addRow([]);
        }

        if (this.chargeDescExcelList != null && Object.keys(this.chargeDescExcelList).length > 0) {
          const dataBlocks = this.chargeDescExcelList; // Payload like your JSON (with totals & details)
          const worksheetChargeDesc = workbook.addWorksheet('Charge Description', { views: [{ showGridLines: false }] });

          let currentRow = 1;
          // =============================
          // 1  FREIGHT SUMMARY  (Left)
          // =============================
          const freightHeader = dataBlocks.totalColumns;
          const freightData = dataBlocks.data.totals.charge_frieght;

          freightHeader.forEach((header: any, colIdx: any) => {
            const cell: any = worksheetChargeDesc.getCell(currentRow, colIdx + 1);
            cell.value = header.toUpperCase();
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });
          currentRow++;

          freightData.forEach((rowObj: any) => {
            const row = worksheetChargeDesc.getRow(currentRow);

            let bgColor = 'FFFFFFFF'; // Default (white)
            if (rowObj['Type']) {
              const type = rowObj['Type'].toString().toLowerCase();
              if (type.includes('freight')) bgColor = 'FFFFFF';   // Light blue for Freight
              else if (type.includes('accessorial')) bgColor = 'F2F2F2'; // Light gray for Accessorial
            }

            freightHeader.forEach((colName: any, colIdx: any) => {
              const cell: any = row.getCell(colIdx + 1);
              let value = rowObj[colName];
              if (/charge|amount/i.test(colName)) {
                cell.value = value ? `$${(+value).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00";
                cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
              } else if (/%|spend/i.test(colName)) {
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '0.00%';
              } else if (/packages/i.test(colName)) {
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0';
              } else {
                cell.value = value;
              }
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (colIdx === 0 || colName === 'Type') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text columns left
              }
              cell.font = { family: 4, bold: false, size: 10, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

              //  Bold for Total row
              if (rowObj['Type'] && rowObj['Type'].toString().toLowerCase().includes('total')) {
                cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              }
            });
            currentRow++;
          });

          // =============================
          // 2 GROUND SUMMARY (Right)
          // =============================
          const startColRight = freightHeader.length + 2; // Add space between two tables
          let summaryStartRow = 1;
          const groundHeader = dataBlocks.totalColumns;
          const groundData = dataBlocks.data.totals.charge_ground;

          groundHeader.forEach((header: any, colIdx: any) => {
            const cell: any = worksheetChargeDesc.getCell(summaryStartRow, startColRight + colIdx);
            cell.value = header.toUpperCase();
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });

          summaryStartRow++;

          groundData.forEach((rowObj: any) => {
            const row = worksheetChargeDesc.getRow(summaryStartRow);

            let bgColor = 'FFFFFFFF'; // Default (white)
            if (rowObj['Type']) {
              const type = rowObj['Type'].toString().toLowerCase();
              if (type.includes('just frt ground')) bgColor = 'FFFFFF';   // Light blue for Freight
              else if (type.includes('just frt air')) bgColor = 'F2F2F2'; // Light gray for Accessorial
            }

            groundHeader.forEach((colName: any, colIdx: any) => {
              const cell: any = row.getCell(startColRight + colIdx);
              let value = rowObj[colName];
              if (/charge|amount/i.test(colName)) {
                cell.value = value ? `$${(+value).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00";
                cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
              } else if (/%|spend/i.test(colName)) {
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '0.00%';
              } else if (/packages/i.test(colName)) {
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0';
              } else {
                cell.value = value;
              }
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (colIdx === 0 || colName === 'Type') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text columns left
              }
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

              //  Bold for Total row
              if (rowObj['Type'] && rowObj['Type'].toString().toLowerCase().includes('total')) {
                cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
              }
            });
            summaryStartRow++;
          });

          // =============================
          // 3  CHARGE DESCRIPTION DETAILS (Vertical Table)
          // =============================
          currentRow = Math.max(currentRow, summaryStartRow) + 1; // Leave gap below summaries
          const detailHeader = dataBlocks.detailColumns;
          const detailData = dataBlocks.data.details;

          // --- Header Row ---
          const headerRow = worksheetChargeDesc.getRow(currentRow);
          detailHeader.forEach((header: any, idx: any) => {
            const cell: any = headerRow.getCell(idx + 1);
            cell.value = header.toUpperCase();
            cell.font = { family: 4, bold: true, size: 10, color: { argb: '595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } }; // light gray header
            cell.alignment = { vertical: 'middle', horizontal: 'left' };
            cell.border = {
              top: { style: 'thin', color: { argb: 'D9D9D9' } },
              left: { style: 'thin', color: { argb: 'D9D9D9' } },
              right: { style: 'thin', color: { argb: 'D9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            };
          });
          currentRow++;

          // --- Data Rows (with color by Type) ---
          detailData.forEach((rowObj: any) => {
            const row = worksheetChargeDesc.getRow(currentRow);

            //  Row color based on "Type"
            let bgColor = 'FFFFFFFF'; // Default (white)
            if (rowObj['Type']) {
              const type = rowObj['Type'].toString().toLowerCase();
              if (type.includes('freight')) bgColor = 'FFFFFF'; // Light blue for Freight
              else if (type.includes('accessorial')) bgColor = 'F2F2F2'; // Light greenish-gray for Accessorial
            }

            detailHeader.forEach((colName: any, idx: any) => {
              const cell: any = row.getCell(idx + 1);
              let value = rowObj[colName];

              // --- Formatting Logic ---
              if (colName === 'Zero Charge Package Count') {
                //  Count column — integer formatting only
                cell.value = value ? (+value).toLocaleString('en-US') : '';
              }
              else if (/\avg(charge|cost|rate|amount)/i.test(colName)) {
                //  Currency columns
                cell.value = value ? `$${(+value).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "$0.00";
                cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
              }
              else if (/avg/i.test(colName)) {
                cell.value = value;
                cell.numFmt = '"$"#,##0.00'; // 
              }
              else if (/%|spend|discount/i.test(colName)) {
                //  Percent columns
                cell.value = value ? parseFloat(value) : null;
                cell.numFmt = '0.00%';
              }
              else if (/package|weight|zone/i.test(colName)) {
                //  Numeric columns
                cell.value = value ? +value : null;
                cell.numFmt = '#,##0';
              }
              else {
                //  Text columns (like Group, Type)
                cell.value = value;
              }

              // --- Apply Styles ---
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (idx === 0 || colName === 'Type') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' }; // Align text columns left
              }
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });

            currentRow++;
          });



          // =============================
          // 4 Auto-Fit Columns
          // =============================
          const totalCols = detailHeader.length + 5;
          for (let i = 1; i <= totalCols; i++) {
            let maxLen = 0;
            worksheetChargeDesc.eachRow((row: any) => {
              const val = row.getCell(i).value;
              if (val) maxLen = Math.max(maxLen, val.toString().length + 3);
            });
            worksheetChargeDesc.getColumn(i).width = Math.max(maxLen, 10);
          }

          worksheetChargeDesc.addRow([]);
        }

        if (this.groundExcelList != null && Object.keys(this.groundExcelList).length > 0) {
          const dataBlocks = this.groundExcelList; // Your API structure with ORIGIN POINTS and DESTINATION POINTS lists

          const worksheetground = workbook.addWorksheet('Ground', { views: [{ showGridLines: false }] });

          let currentRow = 1;

          // Iterate over each block ("Ground Commercial", "Ground Residential")
          dataBlocks.columns.forEach((blockColArr: string[], bIdx: number) => {
            const blockHeader = blockColArr[0]; // e.g. "Ground Commercial"
            const columns = blockColArr.slice(1);
            const tableData = dataBlocks.data[blockHeader] || [];

            // Add vertical space between tables
            if (bIdx > 0) {
              currentRow += 2;
            }

            // --- 1 Table Header Row ---
            const headerRow = worksheetground.getRow(currentRow);
            const headerNames = [blockHeader, ...columns];

            headerNames.forEach((h, i) => {
              const cell: any = headerRow.getCell(i + 1);
              cell.value = h.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } }; //  header color
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });
            currentRow++;

            // --- 2 Data Rows ---
            tableData.forEach((rowObj: any) => {
              const row = worksheetground.getRow(currentRow);

              // RangeValue column (text or number as needed)
              row.getCell(1).value = rowObj['RangeValue'];
              row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
              row.getCell(1).font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };

              columns.forEach((colName: any, colIdx: any) => {
                const cell: any = row.getCell(colIdx + 2);
                let value = rowObj[colName];

                if (/net amount|cost/i.test(colName)) {
                  // Currency: set numeric value, apply currency format
                  cell.value = value ? +value : 0;
                  cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // US currency format
                } else if (/txn count/i.test(colName)) {
                  // Integer count - set number, no decimals
                  cell.value = value ? Math.round(+value) : 0;
                  cell.numFmt = '#,##0';
                } else if (/% of total|discount/i.test(colName)) {
                  // Percent - set decimal value, multiply by 1 if your data is already fraction,
                  // or adjust accordingly. Here assuming the value is fractional
                  cell.value = value ? parseFloat(value) : 0;
                  cell.numFmt = '0.00%';
                } else {
                  // Regular numbers (2 decimals)
                  cell.value = value ? +parseFloat(value).toFixed(2) : 0;
                  cell.numFmt = '0.00';
                }

                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
              });

              // Border for RangeValue column
              row.getCell(1).border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };

              currentRow++;
            });

          });

          // --- 3 Auto-Fit Column Widths ---
          const maxCols = Math.max(...dataBlocks.columns.map((col: any) => col.length));
          for (let i = 1; i <= maxCols; i++) {
            let maxLen = 0;
            worksheetground.eachRow((row: any) => {
              const val = row.getCell(i).value;
              if (val) maxLen = Math.max(maxLen, val.toString().length + 3);
            });
            worksheetground.getColumn(i).width = Math.max(maxLen, 10);
          }
          worksheetground.addRow([]);
        }

        if (this.servZoneExcelList.data != null && this.servZoneExcelList != "") {
          const columns = this.servZoneExcelList.columns;
          const data = this.servZoneExcelList.data;
          const worksheetServZone = workbook.addWorksheet('ServZoneD', { views: [{ showGridLines: false }] });

          let currentRow = 1;

          Object.keys(data).forEach(sectionKey => {
            // 1. Section header (merged)
            worksheetServZone.mergeCells(currentRow, 1, currentRow, columns.length);
            const titleCell = worksheetServZone.getCell(currentRow, 1);
            titleCell.value = sectionKey;
            titleCell.font = { family: 4, size: 14, bold: true, color: { argb: '595959' } };
            titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
            currentRow++;

            // 2. Table header
            columns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetServZone.getCell(currentRow, colIdx + 1);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
            });
            currentRow++;

            // Keep max cell width for autofit
            const colWidths = Array(columns.length).fill(0);

            // 3. Table data rows (autodetect percent/currency based on values)
            (data[sectionKey] || []).forEach((rowData: any) => {
              columns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetServZone.getCell(currentRow, colIdx + 1);
                let value = rowData[col];

                if (/percent|%/i.test(sectionKey) && col !== "Service/Zone") {
                  // Set numeric value as decimal
                  cell.value = value !== undefined ? parseFloat(value) : 0;
                  // Set Excel format as percentage with two decimals
                  cell.numFmt = '0.00%';
                } else if (/cost|amount|usd/i.test(sectionKey) && col !== "Service/Zone") {
                  // Set numeric value as number
                  cell.value = value !== undefined ? parseFloat(value) : 0;
                  // Set Excel format as currency
                  cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
                } else if (/Transactions/i.test(sectionKey) && col !== "Service/Zone") {
                  cell.value = value ? Math.round(+value) : 0;
                  cell.numFmt = '#,##0';
                } else {
                  // For non-numeric or other fields keep the plain value
                  cell.value = value !== undefined ? value : "";
                  // Clear number format just in case
                  cell.numFmt = '#,##0';
                }

                // Common styling
                cell.font = { family: 4, size: 10, bold: rowData["Service/Zone"] === "TOTALS", color: { argb: '595959' } };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } }
                };

                // Totals row special formatting
                if (rowData["Service/Zone"] === "TOTALS") {
                  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
                  cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
                }

                // Update column width estimate
                colWidths[colIdx] = Math.max(colWidths[colIdx], (cell.value ? cell.value.toString().length : 0));
              });
              currentRow++;
            });


            // Autofit column widths for this block
            columns.forEach((col: any, colIdx: any) => {
              worksheetServZone.getColumn(colIdx + 1).width = Math.max(10, colWidths[colIdx] + 2);
            });

            // Blank row between blocks
            currentRow++;
          });
          worksheetServZone.addRow([]);
        }

        if (this.weightZoneExcelList?.data != null) {
          const columns = this.weightZoneExcelList.columns;
          const data = this.weightZoneExcelList.data;

          const worksheetWeightZone = workbook.addWorksheet('WeightZoneD', {
            views: [{ showGridLines: false }],
          });

          // Styling constants
          const HEADER_COLOR = 'B8CCE4';  //'B7C9DC'; // bluish header
          const WHITE = 'FFFFFF';
          const FONT_COLOR = '595959';

          let maxRows = 0;
          let startCol = 1; //  FIX: must start from 1

          Object.keys(data).forEach((serviceName, blockIdx) => {
            let rowOffset = 1;

            // 1 "Service" label in block's first column
            const serviceLabelCell = worksheetWeightZone.getCell(rowOffset, startCol);
            serviceLabelCell.value = 'SERVICE';
            serviceLabelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };
            serviceLabelCell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            serviceLabelCell.alignment = { vertical: 'middle', horizontal: 'left' };
            serviceLabelCell.border = {
              top: { style: 'thin', color: { argb: 'D9D9D9' } },
              left: { style: 'thin', color: { argb: 'D9D9D9' } },
              right: { style: 'thin', color: { argb: 'D9D9D9' } },
              bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
            };

            // 2 Merged cell for service name
            if (columns.length > 1) {
              worksheetWeightZone.mergeCells(
                rowOffset,
                startCol + 1,
                rowOffset,
                startCol + columns.length - 1
              );
            }

            const serviceNameCell = worksheetWeightZone.getCell(rowOffset, startCol + 1);
            serviceNameCell.value = serviceName.toUpperCase();
            serviceNameCell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            serviceNameCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            serviceNameCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DCE6F1' } };

            // Add border to merged row range
            for (let i = 0; i < columns.length; i++) {
              const c = worksheetWeightZone.getCell(rowOffset, startCol + i);
              c.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            }

            // 3 Table headers
            columns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetWeightZone.getCell(rowOffset + 1, startCol + colIdx);
              cell.value = col.toUpperCase();
              cell.font = { family: 4, size: 10, bold: true, color: { argb: FONT_COLOR } };
              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_COLOR } };
              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (cell.value == 'BILLEDWEIGHT' || cell.value == 'OTHER') {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
              }
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } },
                left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } },
                bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
              };
            });

            // 4 Data rows
            data[serviceName].forEach((rowData: any, rowIdx: any) => {
              columns.forEach((col: any, colIdx: any) => {
                const cell: any = worksheetWeightZone.getCell(rowOffset + 2 + rowIdx, startCol + colIdx);
                let value = rowData[col] ?? '0';

                //  Convert numeric strings like "1", "1234.56" into actual numbers
                if (typeof value === 'string') {
                  value = value.trim();

                  // Optional: remove commas if string like "1,234.50"
                  if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(value)) {
                    value = value.replace(/,/g, '');
                  }

                  // Check if it's a valid number string
                  if (/^-?\d+(\.\d+)?$/.test(value)) {
                    value = parseFloat(value);
                  }
                }

                //  Now handle numbers properly (including those converted from strings)
                if (typeof value === 'number') {
                  cell.value = value;
                  cell.numFmt = '#,##0'; // Number formatting with commas
                } else {
                  cell.value = value; // Keep text as-is
                  cell.numFmt = undefined;
                }

                // === Cell styling remains same ===
                if (col == "BilledWeight") {
                  cell.font = { family: 4, size: 10, bold: true, color: { argb: FONT_COLOR } };
                } else {
                  cell.font = { family: 4, size: 10, bold: false, color: { argb: FONT_COLOR } };
                }
                cell.alignment = {
                  vertical: 'middle',
                  horizontal: colIdx === 0 ? 'left' : 'right', // fixed: colIdx is a number, not string
                };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: WHITE } };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'D9D9D9' } },
                  left: { style: 'thin', color: { argb: 'D9D9D9' } },
                  right: { style: 'thin', color: { argb: 'D9D9D9' } },
                  bottom: { style: 'thin', color: { argb: 'D9D9D9' } },
                };
              });
            });

            // Track maximum required row count
            maxRows = Math.max(maxRows, data[serviceName].length + 2);

            // Set width for each table's columns
            for (let i = 0; i < columns.length; i++) {
              worksheetWeightZone.getColumn(startCol + i).width = 12;
            }

            // 5 Add a blank gap column after each table block
            const gapCol = startCol + columns.length;
            worksheetWeightZone.getColumn(gapCol).width = 4;
            for (let r = 1; r <= maxRows; r++) {
              worksheetWeightZone.getCell(r, gapCol).value = ''; // keep blank
            }

            // Move startCol for the next block
            startCol += columns.length + 1;
          });

          worksheetWeightZone.addRow([]);
        }


        if (this.dimsExcelList.rows != null) {
          const columns = this.dimsExcelList.columns;
          const dataRows = this.dimsExcelList.rows; // Expect dataRows to be an array, e.g., from your backend API

          const worksheetDims = workbook.addWorksheet('Dims', { views: [{ showGridLines: false }] });

          let currentRow = 1;

          // 1. Table header
          columns.forEach((col: any, colIdx: any) => {
            const cell: any = worksheetDims.getCell(currentRow, colIdx + 1);
            cell.value = col.toUpperCase();
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'B8CCE4' } };
            cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
          });
          currentRow++;

          // Track max cell width for auto-fit
          const colWidths = Array(columns.length).fill(0);

          // 2. Data rows (just straight values, with "-" for empty)
          dataRows.forEach((rowData: any) => {
            columns.forEach((col: any, colIdx: any) => {
              const cell: any = worksheetDims.getCell(currentRow, colIdx + 1);
              let value = rowData[col];

              cell.alignment = { vertical: 'middle', horizontal: 'right' };
              if (value === null || value === undefined || value === "" || value === '0') {
                // Set numeric cell value to null for empty/zero to recognize as blank or zero number
                cell.value = 0;
                // Use custom number format to display "-"
                cell.numFmt = '[=0]"-";#,##0';
              } else {
                // Clean up string value (trim spaces)
                if (typeof value === 'string') value = value.trim();

                //  Check if value is numeric string (like "1", "1.23", "-45.6", "0.00")
                const numericPattern = /^-?\d+(\.\d+)?$/;
                if (typeof value === 'string' && numericPattern.test(value)) {
                  // Convert to numeric value
                  const numValue = parseFloat(value);
                  cell.value = numValue;
                  // Apply default number format
                  cell.numFmt = '[=0]"-";#,##0';
                } else {
                  // Keep original text
                  cell.value = value;
                  cell.numFmt = undefined;
                  cell.alignment = { vertical: 'middle', horizontal: 'left' };
                }
              }
              cell.border = {
                top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } },
                right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } }
              };
              cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              // cell.border if needed
              // Update auto-fit tracking
              colWidths[colIdx] = Math.max(colWidths[colIdx], cell.value ? cell.value.toString().length : 1);
            });
            currentRow++;
          });


          // 3. Autofit column widths
          columns.forEach((col: any, colIdx: any) => {
            worksheetDims.getColumn(colIdx + 1).width = Math.max(8, colWidths[colIdx] + 2);
          });
          worksheetDims.addRow([]);
        }

        if (this.locationsExcelList != null && Object.keys(this.locationsExcelList).length > 0) {
          const dataBlocks = this.locationsExcelList; // Example: { "DESTINATION POINTS": [...], "ORIGIN POINTS": [...] }

          const worksheetLocation = workbook.addWorksheet('Locations', { views: [{ showGridLines: false }] });

          const headers = ["LOCATION", "SHIPMENTS"];

          //  Force correct table order regardless of API order
          const orderedBlocks = ["ORIGIN POINTS", "DESTINATION POINTS"];
          const blockStartCols = [1, 4]; // Left, Right placement

          orderedBlocks.forEach((blockKey, idx) => {
            const rows = dataBlocks[blockKey] || [];
            const startCol = blockStartCols[idx];

            // ==========================================================
            // 1 Header Titles (ORIGIN / DESTINATION)
            // ==========================================================
            const titleCell = worksheetLocation.getCell(1, startCol);
            titleCell.value = blockKey;
            titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffff' } };
            titleCell.font = { family: 4, size: 12, bold: true, color: { argb: '4F81BD' } };
            titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
            // titleCell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' }}, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

            // ==========================================================
            // 2 Table Headers (Row 3 immediately under header)
            // ==========================================================
            worksheetLocation.getCell(3, startCol).value = headers[0];
            worksheetLocation.getCell(3, startCol).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            worksheetLocation.getCell(3, startCol).font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            worksheetLocation.getCell(3, startCol).alignment = { vertical: 'middle', horizontal: 'left' };
            worksheetLocation.getCell(3, startCol).border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };

            worksheetLocation.getCell(3, startCol + 1).value = headers[1];
            worksheetLocation.getCell(3, startCol + 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
            worksheetLocation.getCell(3, startCol + 1).font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
            worksheetLocation.getCell(3, startCol + 1).alignment = { vertical: 'middle', horizontal: 'right' };
            worksheetLocation.getCell(3, startCol + 1).border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
            // ==========================================================
            // 3 Data Rows (start right below headers, row 4)
            // ==========================================================
            rows.forEach((rowObj: any, ridx: any) => {
              const rowNo = 4 + ridx;

              const locationCell = worksheetLocation.getCell(rowNo, startCol);
              const shipmentCell = worksheetLocation.getCell(rowNo, startCol + 1);

              // --- Location ---
              locationCell.value = rowObj.location || '';
              locationCell.alignment = { vertical: 'middle', horizontal: 'left' };
              locationCell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              locationCell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };

              // --- Shipments ---
              let shipmentValue = rowObj.shipment ?? '0';
              if (typeof shipmentValue === 'string') {
                shipmentValue = shipmentValue.trim();
                if (/^-?\d+(\.\d+)?$/.test(shipmentValue)) shipmentValue = parseFloat(shipmentValue);
              }

              shipmentCell.value = typeof shipmentValue === 'number' ? shipmentValue : 0;
              shipmentCell.numFmt = '#,##0';
              shipmentCell.alignment = { vertical: 'middle', horizontal: 'right' };
              shipmentCell.border = { top: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } }, bottom: { style: 'thin', color: { argb: 'D9D9D9' } } };
              shipmentCell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };

              // --- Font Style (bold for TOTAL rows) ---
              if ((rowObj.location || "").toUpperCase().includes("TOTAL")) {
                locationCell.font = shipmentCell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
              } else {
                locationCell.font = shipmentCell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
              }
            });

            // ==========================================================
            // 4 Auto-fit Columns
            // ==========================================================
            let colWidths = [headers[0].length, headers[1].length];
            rows.forEach((rowObj: any) => {
              colWidths[0] = Math.max(colWidths[0], (rowObj.location || '').toString().length);
              colWidths[1] = Math.max(colWidths[1], (rowObj.shipment || '').toString().length);
            });

            worksheetLocation.getColumn(startCol).width = Math.max(12, Math.min(32, colWidths[0] + 2));
            worksheetLocation.getColumn(startCol + 1).width = Math.max(10, Math.min(16, colWidths[1] + 2));

            // Add spacing column between tables
            if (idx === 0) worksheetLocation.getColumn(startCol + 2).width = 2;
          });

          worksheetLocation.addRow([]); // Small final gap row only
        }
      }
    }
    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
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
  formatCurrency(value: any) {
    return Number(value)?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || value;
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
      var tableName = await this.httpclient.saveOrUpdateDiscountsHWT(clientObj).toPromise();

      var targetObj: any = {};
      targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      if ((type != 'current')) {
        targetObj['targetId'] = Number(this.scenariosDisplayed[type].targetId)
      }
      targetObj['carrierName'] = this.carrierName;
      targetObj['type'] = (type == 'current') ? 'create' : 'Edit';
      targetObj['tableName'] = tableName[0].runType;
      var result = await this.httpclient.generateProposalHWT(targetObj).toPromise();
    }
    else {
      clientObj['clientId'] = this.fedexClientId;
      clientObj['freightDetailsList'] = alteredList;
      clientObj['runType'] = 'Dashboard';
      var tableName = await this.fedexService.saveOrUpdateDiscountsHWT(clientObj).toPromise();

      var targetObj: any = {};
      targetObj['clientId'] = this.fedexClientId;
      targetObj['targetId'] = (type == 'current') ? 0 : Number(this.scenariosDisplayed[type].targetId);
      targetObj['carrierName'] = this.carrierName;
      targetObj['type'] = (type == 'current') ? 'create' : 'Edit';
      targetObj['tableName'] = tableName[0].runType;
      var result = await this.fedexService.generateProposalHWT(targetObj).toPromise();
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
          this.targetSavingsHWTList[row].savingsAmount = this.currentSavingsHWTList[row].currentSpend - this.targetSavingsHWTList[row].targetSpend;
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
        let dataService = data.service?.toLowerCase() || '';
        if (data.service == "SmartPost Greater Than 1lb" || dataService.replaceAll(' ', '') == "groundeconomygreaterthan1lb") {
          localWeightRange = "1-1000";
        }
        else if (data.service == "SmartPost Less Than 1lb" || dataService.replaceAll(' ', '') == "groundeconomylessthan1lb") {
          localWeightRange = "0-0.99";
        }
        else if (data.service == "Surepost Greater Than 1lb" || dataService.replaceAll(' ', '') == "groundsavergreaterthan1lb"
          || dataService.replaceAll(' ', '') == "upsgroundsavergreaterthan1lb"
          || dataService.replaceAll(' ', '') == "upsgroundsaver1lborgreater"
          || dataService.replaceAll(' ', '') == "groundsaver1lborgreater"
          || data.service == "UPS Ground Saver - 1 lb or Greater" || data.service == "Ground Saver - 1 lb or Greater"
          || data.service == "UPS Ground Saver 1 lb or Greater" || data.service == "Ground Saver 1 lb or Greater"
          || data.service == "UPS Ground Saver Greater Than 1lb" || data.service == "Ground Saver Greater Than 1lb") {
          localWeightRange = "1-1000";
        }
        else if (data.service == "Surepost Less Than 1lb" || dataService.replaceAll(' ', '') == "groundsaverlessthan1lb"
          || dataService.replaceAll(' ', '') == "upsgroundsaverlessthan1lb"
          || data.service == "UPS Ground Saver - Less than 1 lb" || data.service == "Ground Saver - Less than 1 lb"
          || data.service == "UPS Ground Saver Less Than 1lb" || data.service == "Ground Saver Less Than 1lb") {
          localWeightRange = "0-0.99";
        }
        else if (data.service == "Ground (Freight Pricing)" || data.service == "ARS Ground") {
          localWeightRange = "0-1000";
        }
        else if (dataService.includes("9-96")) {
          localWeightRange = "0-1000";
        }
        else if (dataService.includes("wt")) {
          if (this.selectedCarrier.carrierName.toLowerCase() == 'ups')
            localWeightRange = "1-2000";
          else
            localWeightRange = "1-10000";
        }
        else if (dataService.includes("intl")) {
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
      await this.httpclient.deleteFRTRatesheet(deleteFRTRateObj).toPromise().catch((err) => {
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
      await this.fedexService.deleteFedExFRTRatesheet(deleteFRTRateObj).toPromise().catch((err) => {
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

    const dialogRef = this.dialog.open(DeleteAgreementComponent, {
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
    let resetDialog = this.dialog.open(ResetPopupComponent, {
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
          this.httpclient.restoreProposal(targetObj).subscribe(result => {

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
    let resetDialog = this.dialog.open(ResetPopupComponent, {
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

    this.httpclient.deleteTargetDetails(param).subscribe(response => {

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

  async insertAccessorialDetailsForExcel(carrier: string, index: number) {
    var clientDetailExcel: any = {};
    if (carrier == 'fedex') {
      clientDetailExcel['clientId'] = this.fedexClientId;
      clientDetailExcel['targetId'] = this.totalScenarios[index].targetId;

      this.currentSavingsAccExcelList = [];
      var clientDetailcurrent: any = {};
      clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
      var dataCurrentExcel: any = await this.fedexService.fetchAccessorialDetailsExcel(clientDetailcurrent).toPromise();
      this.currentSavingsAccExcelList = dataCurrentExcel;
      this.totalScenarios[index].accessorialTargetDetailsExcel = [];
      var unfilteredDataExcel: any = await this.httpclient.fetchAccessorialDetailsTargetExcel(clientDetailExcel).toPromise();

      var dataExcel = unfilteredDataExcel.filter((data: any) => data.targetId == this.totalScenarios[index].targetId);
      this.totalScenarios[index].accessorialTargetDetailsExcel = dataExcel;
    }
    else {
      clientDetailExcel['targetId'] = this.totalScenarios[index].targetId;
      clientDetailExcel['clientId'] = this.cookiesService.getCookieItem("clientId");

      this.currentSavingsAccExcelList = [];
      var clientDetailcurrent: any = {};
      clientDetailcurrent['clientId'] = this.cookiesService.getCookieItem('clientId');
      var dataCurrentExcel: any = await this.httpclient.fetchAccessorialDetailsExcel(clientDetailcurrent).toPromise();
      this.currentSavingsAccExcelList = dataCurrentExcel;
      this.totalScenarios[index].accessorialTargetDetailsExcel = [];
      var unfilteredDataExcel: any = await this.httpclient.fetchAccessorialDetailsTargetExcel(clientDetailExcel).toPromise();

      var dataExcel = unfilteredDataExcel.filter((data: any) => data.targetId == this.totalScenarios[index].targetId);
      this.totalScenarios[index].accessorialTargetDetailsExcel = dataExcel;
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

    var alertDialog = this.dialog.open(ResetPopupComponent, {
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
            await this.httpclient.deleteService(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = serviceName + " deleted successfully";
                APIresult = true;
              } else
                message = "Oops something went wrong!";
            }).catch((err) => { message = "Oops something went wrong!"; });
          } else {
            await this.fedexService.deleteServiceFedEx(clientObj).toPromise().then(res2 => {
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
