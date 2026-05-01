import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, ViewChild, ElementRef, ViewChildren, QueryList, Optional, Inject, signal, ChangeDetectorRef } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { MatTableDataSource } from "@angular/material/table";
import { Subject, ReplaySubject, take, takeUntil } from "rxjs";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { ResetPopupComponent } from "../reset-popup/reset-popup.component";
import { ContractsummarydiscountComponent } from "../contractsummarydiscount/contractsummarydiscount.component";
import { AccessorialPopupComponent } from "../accessorial-popup/accessorial-popup.component";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: 'app-create-proposal',
  templateUrl: './create-proposal.component.html',
  styleUrls: ['./create-proposal.component.scss'],
  standalone: false
})
export class CreateProposalComponent {
  @ViewChild('scrollframe', { static: false }) scrollFrame!: ElementRef;
  @ViewChildren('item') itemElements!: QueryList<any>;
  @ViewChild('scrollframeGround', { static: false }) scrollFrameGround!: ElementRef;
  @ViewChildren('itemGround') itemElementsGround!: QueryList<any>;
  @ViewChild('scrollFrameIntl', { static: false }) scrollFrameIntl!: ElementRef;
  @ViewChildren('itemIntl') itemElementsIntl!: QueryList<any>;
  @ViewChild('scrollFrameDIM', { static: false }) scrollFrameDIM!: ElementRef;
  @ViewChildren('itemDIM') itemElementsDIM!: QueryList<any>;
  @ViewChild('scrollFrameHWT', { static: false }) scrollFrameHWT!: ElementRef;
  @ViewChildren('itemHWT') itemElementsHWT!: QueryList<any>;
  @ViewChild('scrollFrameAcc', { static: false }) scrollFrameAcc!: ElementRef;
  @ViewChildren('itemAcc') itemElementsAcc!: QueryList<any>;

  private scrollContainer: any;
  private scrollContainerIntl: any
  private scrollContainerDIM: any
  private scrollContainerHWT: any
  private scrollContainerAcc: any
  private scrollContainerGround: any
  intlDiscountsListService: any = []
  dimListService: any = []
  selected = 'ups';
  matcher = '';
  nextBtnShow = 0;
  buttonName = "Next";
  pageValue: any;
  displayedColumns: any = ['subGroup', 'weightRange', 'targetDis', 'minType', 'targetMin', 'netSpend'];
  displayedColumnsDelete: any = ['subGroup', 'weightRange', 'targetDis', 'minType', 'targetMin', 'netMinimum', 'netSpend', 'delete'];
  displayedColumnsAcc: any = ['service', 'targetDis', 'netSpend', 'delete'];
  displayedColumnsMin: any = ['service', 'weightRange', 'minType', 'targetMin'];
  displayedColumnsDIM: any = ['service', 'criteria', 'cubicInFrom', 'cubicInTo', 'targetDimFactor', 'delete'];
  displayedColumnsHWTDelete: any = ['subGroup', 'weightRange', 'targetTier', 'targetDis', 'netSpend', 'delete'];
  minTypeValues: string[] = ['$', '%',];
  spans: any = []
  carrierValues = [{ name: 'UPS', value: 'UPS' }, { name: 'FedEx', value: 'FedEx' }];
  airMinMaxList: any[] = [];
  groundMinMaxList: any[] = [];
  intlMinMaxList: any[] = [];
  hwtMinMaxList: any[] = [];
  accMinMaxList: any[] = [];
  airMinMaxListOld: any[] = [];
  groundMinMaxListOld: any[] = [];
  intlMinMaxListOld: any[] = [];
  hwtMinMaxListOld: any[] = [];
  accMinMaxListOld: any[] = [];
  proposalName: string = "";
  proposalNickName: string = "";
  agreementNo: any = "";
  agreementNoDuplicate: string = ""
  freightList: any = [];
  dimFactorList: any = [];
  dimFactorListNew: any = [];
  accessorialDiscountList: any = [];
  accessorialDiscountListNew: any = [];
  airDiscountsList: any = [];
  airDiscountsListNew: any = [];
  groundDiscountsList: any = [];
  groundDiscountsListNew: any = [];
  intlDiscountsList: any = [];
  intlDiscountsListNew: any = [];
  hwtDiscountsList: any = [];
  hwtDiscountsListNew: any = [];
  distinctAirList: any = [];
  distinctAirListSignal = signal<any>([]);
  distinctGroundList: any = [];
  distinctIntlList: any = [];
  distinctHWTList: any = [];
  distinctAccList: any = [];
  distinctAirListOld: any = [];
  distinctGroundListOld: any = [];
  distinctIntlListOld: any = [];
  distinctHWTListOld: any = [];
  distinctAccListOld: any = [];
  distinctAirListNew: any = [];
  distinctGroundListNew: any = [];
  distinctIntlListNew: any = [];
  distinctHWTListNew: any = [];
  distinctAccListNew: any = [];
  distinctAirServices = [];
  distinctGroundServices = [];
  distinctIntlServices = [];
  distinctHWTServices = [];
  distinctGroundServicesWithWeight = [];
  dataSourceAir: any = [];
  dataSourceAirSignal: any = signal<any>([]);
  dataSourceGround: any = [];
  dataSourceGroundSignal: any = signal<any>([]);
  dataSourceIntl: any = [];
  dataSourceIntlSignal: any = signal<any>([]);
  dataSourceHWT: any = [];
  dataSourceHWTSignal: any = signal<any>([]);
  dataSourceDIM: any = [];
  dataSourceDIMSignal = signal<any>([]);
  dataSourceAcc: any = [];
  dataSourceAccSignal: any = signal<any>([]);
  airDeleteList: any = [];
  groundDeleteList: any = [];
  intlDeleteList: any = [];
  hwtDeleteList: any = [];

  tabName = "";
  clientType: any;
  type: any;
  serviceName: any;
  carrierName: any;
  targetDetails: any = [];
  carrierDetails;
  previousWholeNumber: any;
  previousDecimalNumber: any;
  targetList: any = [];
  isLoading = signal<any>(false);
  randomNumber: any;
  fedexClientId;
  submitClicked: any = signal<any>(false);
  saveClicked: boolean = false;
  isSaved: boolean = false;
  dimDuplicateList: any = [];
  carrier;
  targets: any = [];
  isAnythingChanged = false;
  proposalNickNameNew = "";
  carrierNew = "";
  airDiscountsLength = 0;
  groundDiscountsLength = 0;
  intlDiscountsLength = 0;
  hwtDiscountsLength = 0;
  accessorialLength = 0;
  differentMinType = false;
  filteredScenario: any = [];
  selectedId = 'current';
  groundRowSpanList: any = [];
  groundVisibleList: any = [];
  airServices: any = [];
  groundServices: any = [];
  intlServices: any = [];
  hwtServices: any = [];
  hwtAccountNumbersList: any[] = [];
  allAccServices: any[] = [];
  isAccServiceAvailable: boolean = false;
  totalScenarios: any = [];
  isDelete: boolean = false;
  themeOption: any = "";
  panelClass: any = "";
  currentAgreement: boolean = false;
  canIncrease: boolean = true;
  dimTable: any = [];
  dimList: any = [];
  dimChanged: boolean = false;
  scenariosDisplayed: any = [];
  targetIdSheet;
  serviceNameList = ["Ground", "Ground Zone 2-8", "Home Delivery", "Home Delivery Zone 2-8", "Ground Return", "Ground Return Zone 2-8", "Ground Zone 9,17", "Ground Zone 51", "Ground Zone 54", "Home Delivery Zone 9,17", "Home Delivery Zone 51", "Home Delivery Zone 54", "SmartPost Less Than 1lb", "SmartPost 1lb or Greater", "SmartPost Greater Than 1lb"];
  constructor(public dialog: MatDialog, private cd: ChangeDetectorRef, private loaderService: LoaderService, public dialogRef: MatDialogRef<CreateProposalComponent>, private httpClientService: HttpClientService, private cookiesService: CookiesService,
    private fedexService: HttpfedexService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public resetDialog: MatDialogRef<ResetPopupComponent>,
  ) {
    console.log(data);
    this.carrierDetails = data.carrierDetails;
    this.carrier = this.carrierDetails.carrierName;
    this.tabName = data.tabName;
    this.targetList = data.targetList;
    this.fedexClientId = data.fedexId;
    this.nextBtnShow = data.tabIndex;
    this.targetIdSheet = data.targetIdSheet
    this.totalScenarios = data.targetDetails;
    this.data = data
  }

  @ViewChild('singleSelect') singleSelect!: MatSelect;
  public serviceNameCtrl: FormControl = new FormControl();
  public serviceNameFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  public filteredService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  @ViewChild('singleDIMSelect') singleDIMSelect!: MatSelect;
  public DimServiceNameCtrl: FormControl = new FormControl();
  public DimserviceNameFilterCtrl: FormControl = new FormControl();
  private _onDIMDestroy = new Subject<void>();
  public filteredDIMService: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  async ngOnInit() {
    this.openLoading();
    var clientDetail1: any = {};
    if (this.data.target == 'ratesheet') {
      if (this.carrier.toLowerCase() == 'fedex') {
        clientDetail1['clientId'] = this.fedexClientId;
        var targetDetails = await this.fedexService.fetchTargetDetails(clientDetail1).toPromise();
        targetDetails.forEach(async (element: any) => {
          if (element.targetId == this.targetIdSheet) {
            this.targetDetails.push(targetDetails)
          }
        });
      } else {
        clientDetail1['clientId'] = this.cookiesService.getCookieItem('clientId');
        var targetDetails = await this.httpClientService.fetchTargetDetails(clientDetail1).toPromise();
        targetDetails.forEach(async (element: any) => {
          if (element.targetId == this.targetIdSheet) {
            this.targetDetails.push(targetDetails)
          }
        });
      }
    } else {
      this.targetDetails = this.data.target;
    }
    if (Array.isArray(this.targetDetails)) {
      this.targets = this.targetDetails.map((data: any) => ({ ...data }));
    } else {
      this.targets = []; // fallback
    }
    // this.targetDetails.forEach((data: any) => this.targets.push(Object.assign({}, data)));

    if (this.data.valueClick == "create") {
      this.pageValue = "Create Agreement"
      this.type = this.data.valueClick;
      this.carrierName = this.carrierDetails.carrierName;
      this.filteredScenario = this.targets.filter((data: any) => data.carrierName.toLowerCase() == this.carrierName.toLowerCase());
      this.filteredScenario.unshift(Object.assign({}, { targetId: 'current', targetName: 'Current Agreement' }));
    }
    else if (this.data.valueClick == "View") {
      this.pageValue = "Create Agreement"
      this.type = 'create';
      this.currentAgreement = true;
      this.agreementNo = this.carrierDetails.agreementNo;
      this.carrierName = this.carrierDetails.carrierName;
      this.filteredScenario = this.targets.filter((data: any) => data.carrierName.toLowerCase() == this.carrierName.toLowerCase());
      this.filteredScenario.unshift(Object.assign({}, { targetId: 'current', targetName: 'Current Agreement' }));
    }
    if (this.data.valueClick == "Edit") {
      this.pageValue = "Edit Agreement"
      this.type = this.data.valueClick;
    }
    if (this.nextBtnShow == 5) {
      this.buttonName = 'Generate';
    }
    this.themeOption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    if (this.themeOption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'Edit-discount-class';
    }
    await this.getData();
    await this.getHWTAccountsList();
    await this.setMinMaxHWT();

    // this.agreementYearList = [{ year: 2024 },{ year: 2025 },{ year: 2026 }];
    let keywords = ['do', 'if', 'in', 'for', 'new', 'try', 'for', 'var'];

    const sortWithWord = (words: any, firstWord: any) => words.sort((a: any, b: any) => {
      if (a === firstWord) return -1;
      return a.localeCompare(b);
    });

    //will print  ["new", "do", "for", "for", "if", "in", "try", "var"]

    await this.ExecMatSelctFunctions();
    await this.ExecDIMMatSelctFunctions();
    if (this.data.serviceName != undefined) {
      this.popdiscountAcc(this.data.serviceName);
    }
    await this.setRowSpan();

    let clientDetail: any = {};
    clientDetail['serviceType'] = this.carrier.toLowerCase();
    var accessorialServices = await this.httpClientService.fetchAccessorialLookup(clientDetail).toPromise();
    this.allAccServices = await this.getUniqueService(accessorialServices, 'service');

    if (this.pageValue == "Edit Agreement") {
      this.showDelete();
    }
  }

  clientID: any;
  dataList: any = [];

  showDelete() {
    let index = this.totalScenarios.findIndex((scenario: any) => scenario.targetId == this.proposalName);
    if (index > 1) {
      this.isDelete = true;
    }
    else {
      this.isDelete = false;
    }
  }

  async getTargetDetails() {

    if (this.type == "create" && this.targetDetails != '') {
      this.carrierName = this.targetDetails.carrierName;
      this.carrierNew = this.targetDetails.carrierName;
      return this.targetDetails.targetId;
    }
    if (this.targetDetails != '' && this.type != "create") {
      this.proposalName = this.targetDetails.targetId;
      this.proposalNickName = this.targetDetails.targetNickName;
      this.proposalNickNameNew = this.targetDetails.targetNickName;
      this.agreementNo = this.targetDetails.agreementNo;
      this.agreementNoDuplicate = this.targetDetails.agreementNo;
      this.carrierName = this.targetDetails.carrierName;
      this.carrierNew = this.targetDetails.carrierName;
      return this.targetDetails.targetId;
    }
  }

  async getData() {

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    var clientObj: any = {};
    clientObj['type'] = this.type;
    if (this.type.toLowerCase() == 'create') {
      clientObj['carrier'] = this.carrierName;
    }
    clientObj['targetId'] = await this.getTargetDetails();
    if (clientObj['targetId'] != undefined) {
      clientObj['type'] = 'Edit';
    }
    if (this.carrier.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.fedexClientId;
      var data = await this.fedexService.fetchfreightEditProposal(clientObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
      {

        this.dataList = data;

        await data.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.airDiscountsList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.groundDiscountsList.push(dataNew);
          }

          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtDiscountsList.push(dataNew);
          }
          else {
            this.intlDiscountsList.push(dataNew);
          }
        });

        await this.getDistinctAirData();
        await this.getDistinctGroundData();
        await this.getDistinctIntlData();
        await this.getDistinctHWTData();

        for (let index = 0; index < this.distinctAirList.length; index++) {
          this.distinctAirListOld[index] = Object.assign({}, this.distinctAirList[index]);
        }
        for (let index = 0; index < this.distinctIntlList.length; index++) {
          this.distinctIntlListOld[index] = Object.assign({}, this.distinctIntlList[index]);
        }
        for (let index = 0; index < this.distinctGroundList.length; index++) {
          this.distinctGroundListOld[index] = Object.assign({}, this.distinctGroundList[index]);
        }
        for (let index = 0; index < this.distinctHWTList.length; index++) {
          this.distinctHWTListOld[index] = Object.assign({}, this.distinctHWTList[index]);
        }

        //creating a duplicate list
        {
          for (let index = 0; index < this.airDiscountsList.length; index++) {
            this.airDiscountsListNew[index] = Object.assign({}, this.airDiscountsList[index]);
          }
          for (let index = 0; index < this.groundDiscountsList.length; index++) {
            this.groundDiscountsListNew[index] = Object.assign({}, this.groundDiscountsList[index]);
          }
          for (let index = 0; index < this.hwtDiscountsList.length; index++) {
            this.hwtDiscountsListNew[index] = Object.assign({}, this.hwtDiscountsList[index]);
          }
          for (let index = 0; index < this.intlDiscountsList.length; index++) {
            this.intlDiscountsListNew[index] = Object.assign({}, this.intlDiscountsList[index]);
          }
        }

        await this.setLength();

        //setMinMaxValue
        await this.setMinMax('air');
        await this.setMinMax('ground');
        await this.setMinMax('intl');
        await this.setMinMax('hwt');

        this.airMinMaxList.forEach((data: any) => this.airMinMaxListOld.push(Object.assign({}, data)));
        this.groundMinMaxList.forEach((data: any) => this.groundMinMaxListOld.push(Object.assign({}, data)));
        this.intlMinMaxList.forEach((data: any) => this.intlMinMaxListOld.push(Object.assign({}, data)));
        this.hwtMinMaxList.forEach((data: any) => this.hwtMinMaxListOld.push(Object.assign({}, data)));

        this.dataSourceAir = new MatTableDataSource(this.distinctAirList);
        this.dataSourceGround = new MatTableDataSource(this.distinctGroundList);
        this.dataSourceIntl = new MatTableDataSource(this.distinctIntlList);
        this.dataSourceHWT = new MatTableDataSource(this.distinctHWTList);

        this.dataSourceAirSignal.set(this.dataSourceAir);
        this.dataSourceGroundSignal.set(this.dataSourceGround)
        this.dataSourceIntlSignal.set(this.dataSourceIntl);
        this.dataSourceHWTSignal.set(this.dataSourceHWT);
      }

      var dimData = await this.fedexService.fetchDimFactor(clientObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
      this.dimFactorList = dimData.filter((value: any) => value.category == 'Proposed');
      this.dimFactorList.forEach((element: any, index: any) => {
        this.dimFactorList[index]['targetId'] = this.targetDetails.targetId;
      });

      for (let index = 0; index < this.dimFactorList.length; index++) {
        this.dimDuplicateList[index] = Object.assign({}, this.dimFactorList[index]);
      }
      var distinctDIMServices = this.getUniqueService(this.dimFactorList, 'serviceGrouping');
      for (var index = 0; index < distinctDIMServices.length; index++) {
        var currentServiceList = this.dimFactorList.filter((data: any) => data.serviceGrouping == distinctDIMServices[index]);
        if (currentServiceList.length < 3) {
          for (var loop = 0; loop < currentServiceList.length; loop++) {
            for (var loop1 = 0; loop1 < this.dimFactorList.length; loop1++) {
              if (this.dimFactorList[loop1].dimDetailid == currentServiceList[loop].dimDetailid)
                this.dimFactorList[loop1]['deleteIcon'] = false;
            }
          }
        }
        else {
          for (var loop = 0; loop < currentServiceList.length; loop++) {
            if (loop >= 2) {
              for (var loop1 = 0; loop1 < this.dimFactorList.length; loop1++) {
                if (this.dimFactorList[loop1].dimDetailid == currentServiceList[loop].dimDetailid) {
                  this.dimFactorList[loop1]['deleteIcon'] = true;
                }
              }
            }
            else {
              for (var loop1 = 0; loop1 < this.dimFactorList.length; loop1++) {
                if (this.dimFactorList[loop1].dimDetailid == currentServiceList[loop].dimDetailid) {
                  this.dimFactorList[loop1]['deleteIcon'] = false;
                }
              }
            }
          }
        }
      }
      if (this.dimFactorList.length > 0) {
        var service = this.dimFactorList[0].serviceGrouping;
        var color = '';
        if (this.themeOption == 'dark') {
          color = '#292D33'
        }
        else {
          color = '#EAEFF3'
        }

        for (let index = 0; index < this.dimFactorList.length; index++) {


          if (service != this.dimFactorList[index].serviceGrouping) {
            if (this.themeOption == 'dark') {
              color = (color == '#292D33') ? '#353C48' : '#292D33';
            }
            else {
              color = (color == '#EAEFF3') ? '#F4F8FB' : '#EAEFF3';
            }
          }

          service = this.dimFactorList[index].serviceGrouping;
          this.dimFactorList[index].color = color;
        }
      }
      this.dataSourceDIM = new MatTableDataSource(this.dimFactorList);
      this.dataSourceDIMSignal.set(this.dataSourceDIM);
      for (let index = 0; index < this.dimFactorList.length; index++) {
        this.dimFactorListNew[index] = Object.assign({}, this.dimFactorList[index]);
      }

      this.accessorialDiscountList = await this.fedexService.fetchAccDetailsPopup(clientObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });

      var unsortedList = await this.accessorialDiscountList.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.service == thing.service) === i
      );

      var accServices = unsortedList.sort((a: any, b: any) => a.service.localeCompare(b.service));

      for (let row = 0; row < accServices.length; row++) {
        this.distinctAccList[row] = Object.assign({}, accServices[row]);
      }

      this.distinctAccList.forEach((distinctData: any) => {
        var filteredData = this.accessorialDiscountList.filter((data: any) => data.service == distinctData.service);
        var totalSpend = 0;
        filteredData.forEach((data: any) => {
          totalSpend += Number(data.netSpend);
        });
        distinctData.netSpend = totalSpend;
      });

      for (let index = 0; index < this.distinctAccList.length; index++) {
        this.distinctAccListNew[index] = Object.assign({}, this.distinctAccList[index]);
      }

      for (let index = 0; index < this.accessorialDiscountList.length; index++) {
        this.accessorialDiscountListNew[index] = Object.assign({}, this.accessorialDiscountList[index]);
      }

      //Calculate net spend for acc
      //this.calculateAccNetSpend();

      //set minmax for acc
      await this.setAccMinMax();
      this.accMinMaxList.forEach((data: any) => this.accMinMaxListOld.push(Object.assign({}, data)));
      this.dataSourceAcc = new MatTableDataSource(this.distinctAccList);
      this.dataSourceAccSignal.set(this.dataSourceAcc);


    }
    else {
      clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
      var data = await this.httpClientService.fetchfreightEditProposal(clientObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
      {

        this.dataList = data;

        await data.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'air') {
            this.airDiscountsList.push(dataNew);
          }
          else if ((dataNew.serviceType).toLowerCase() == 'ground' || (dataNew.serviceType).toLowerCase() == 'home delivery' || (dataNew.serviceType).toLowerCase() == 'smartpost' || (dataNew.serviceType).toLowerCase() == 'ground economy') {
            this.groundDiscountsList.push(dataNew);
          }

          else if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtDiscountsList.push(dataNew);
          }
          else {
            this.intlDiscountsList.push(dataNew);
          }
        });

        await this.getDistinctAirData();
        await this.getDistinctGroundData();
        await this.getDistinctIntlData();
        await this.getDistinctHWTData();

        for (let index = 0; index < this.distinctAirList.length; index++) {
          this.distinctAirListOld[index] = Object.assign({}, this.distinctAirList[index]);
        }
        for (let index = 0; index < this.distinctIntlList.length; index++) {
          this.distinctIntlListOld[index] = Object.assign({}, this.distinctIntlList[index]);
        }
        for (let index = 0; index < this.distinctGroundList.length; index++) {
          this.distinctGroundListOld[index] = Object.assign({}, this.distinctGroundList[index]);
        }
        for (let index = 0; index < this.distinctHWTList.length; index++) {
          this.distinctHWTListOld[index] = Object.assign({}, this.distinctHWTList[index]);
        }

        //creating a duplicate list
        {
          for (let index = 0; index < this.airDiscountsList.length; index++) {
            this.airDiscountsListNew[index] = Object.assign({}, this.airDiscountsList[index]);
          }
          for (let index = 0; index < this.groundDiscountsList.length; index++) {
            this.groundDiscountsListNew[index] = Object.assign({}, this.groundDiscountsList[index]);
          }
          for (let index = 0; index < this.hwtDiscountsList.length; index++) {
            this.hwtDiscountsListNew[index] = Object.assign({}, this.hwtDiscountsList[index]);
          }
          for (let index = 0; index < this.intlDiscountsList.length; index++) {
            this.intlDiscountsListNew[index] = Object.assign({}, this.intlDiscountsList[index]);
          }
        }



        await this.setLength();

        //setMinMaxValue
        await this.setMinMax('air');
        await this.setMinMax('ground');
        await this.setMinMax('intl');
        await this.setMinMax('hwt');

        this.airMinMaxList.forEach((data: any) => this.airMinMaxListOld.push(Object.assign({}, data)));
        this.groundMinMaxList.forEach((data: any) => this.groundMinMaxListOld.push(Object.assign({}, data)));
        this.intlMinMaxList.forEach((data: any) => this.intlMinMaxListOld.push(Object.assign({}, data)));
        this.hwtMinMaxList.forEach((data: any) => this.hwtMinMaxListOld.push(Object.assign({}, data)));

        this.dataSourceAir = new MatTableDataSource(this.distinctAirList);
        this.dataSourceAirSignal.set(this.dataSourceAir);
        this.dataSourceGround = new MatTableDataSource(this.distinctGroundList);
        this.dataSourceGroundSignal.set(this.dataSourceGround)
        this.dataSourceIntl = new MatTableDataSource(this.distinctIntlList);
        this.dataSourceIntlSignal.set(this.dataSourceIntl);
        this.dataSourceHWT = new MatTableDataSource(this.distinctHWTList);
        this.dataSourceHWTSignal.set(this.dataSourceHWT);

      }

      var dimData = await this.httpClientService.fetchDimFactor(clientObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });

      this.dimFactorList = dimData.filter((value: any) => value.category == 'Proposed');
      this.dimFactorList.forEach((element: any, index: any) => {
        this.dimFactorList[index]['targetId'] = this.targetDetails.targetId;
      });

      for (let index = 0; index < this.dimFactorList.length; index++) {
        this.dimDuplicateList[index] = Object.assign({}, this.dimFactorList[index]);
      }
      var distinctDIMServices = this.getUniqueService(this.dimFactorList, 'serviceGrouping');
      for (var index = 0; index < distinctDIMServices.length; index++) {
        var currentServiceList = this.dimFactorList.filter((data: any) => data.serviceGrouping == distinctDIMServices[index]);
        if (currentServiceList.length < 3) {
          for (var loop = 0; loop < currentServiceList.length; loop++) {
            for (var loop1 = 0; loop1 < this.dimFactorList.length; loop1++) {
              if (this.dimFactorList[loop1].dimDetailid == currentServiceList[loop].dimDetailid)
                this.dimFactorList[loop1]['deleteIcon'] = false;
            }
          }
        }
        else {
          for (var loop = 0; loop < currentServiceList.length; loop++) {
            if (loop >= 2) {
              for (var loop1 = 0; loop1 < this.dimFactorList.length; loop1++) {
                if (this.dimFactorList[loop1].dimDetailid == currentServiceList[loop].dimDetailid) {
                  this.dimFactorList[loop1]['deleteIcon'] = true;
                }
              }
            }
            else {
              for (var loop1 = 0; loop1 < this.dimFactorList.length; loop1++) {
                if (this.dimFactorList[loop1].dimDetailid == currentServiceList[loop].dimDetailid) {
                  this.dimFactorList[loop1]['deleteIcon'] = false;
                }
              }
            }
          }
        }
      }
      if (this.dimFactorList.length > 0) {
        var service = this.dimFactorList[0].serviceGrouping;
        var color = '';
        if (this.themeOption == 'dark') {
          color = '#292D33';
        }
        else {
          color = '#EAEFF3';
        }
        for (let index = 0; index < this.dimFactorList.length; index++) {

          if (service != this.dimFactorList[index].serviceGrouping) {
            if (this.themeOption == 'dark') {
              color = (color == '#292D33') ? '#353C48' : '#292D33';
            }
            else {
              color = (color == '#EAEFF3') ? '#F4F8FB' : '#EAEFF3';
            }
          }
          service = this.dimFactorList[index].serviceGrouping;
          this.dimFactorList[index].color = color;
        }
      }
      for (let index = 0; index < this.dimFactorList.length; index++) {
        this.dimFactorListNew[index] = Object.assign({}, this.dimFactorList[index]);
      }
      this.dataSourceDIM = new MatTableDataSource(this.dimFactorList);
      this.dataSourceDIMSignal.set(this.dataSourceDIM);
      this.accessorialDiscountList = await this.httpClientService.fetchAccDetailsPopup(clientObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
      var unsortedList = await this.accessorialDiscountList.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.service == thing.service) === i
      );
      var accServices = unsortedList.sort((a: any, b: any) => a.service.localeCompare(b.service));
      for (let row = 0; row < accServices.length; row++) {
        this.distinctAccList[row] = Object.assign({}, accServices[row]);
      }
      this.distinctAccList.forEach((distinctData: any) => {
        var filteredData = this.accessorialDiscountList.filter((data: any) => data.service == distinctData.service);
        var totalSpend = 0;
        filteredData.forEach((data: any) => {
          totalSpend += Number(data.netSpend);
        });
        distinctData.netSpend = totalSpend;
      });
      for (let index = 0; index < this.distinctAccList.length; index++) {
        this.distinctAccListNew[index] = Object.assign({}, this.distinctAccList[index]);
      }
      for (let index = 0; index < this.accessorialDiscountList.length; index++) {
        this.accessorialDiscountListNew[index] = Object.assign({}, this.accessorialDiscountList[index]);
      }
      await this.setAccMinMax();
      this.accMinMaxList.forEach((data: any) => this.accMinMaxListOld.push(Object.assign({}, data)));
      this.dataSourceAcc = new MatTableDataSource(this.distinctAccList);
      this.dataSourceAccSignal.set(this.dataSourceAcc);

    }
    this.cd.detectChanges();
    this.closeLoading();
  }

  async setLength() {
    this.airDiscountsLength = this.distinctAirList.length;
    this.groundDiscountsLength = this.distinctGroundList.length;
    this.intlDiscountsLength = this.distinctIntlList.length;
    this.hwtDiscountsLength = this.distinctHWTList.length;
    this.accessorialLength = this.distinctAccList.length;
  }
  async getDistinctAirData() {

    this.distinctAirList = [];
    this.distinctAirListSignal.set([]);

    for (let index = 0; index < this.airDiscountsList.length; index++) {
      this.airDiscountsList[index].weightFrom = Number(this.airDiscountsList[index].weightFrom);
      this.airDiscountsList[index].weightTo = Number(this.airDiscountsList[index].weightTo);
    }

    var airServices = await this.airDiscountsList.filter(
      (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup) === i
    );
    for (let row = 0; row < airServices.length; row++) {
      this.distinctAirList[row] = Object.assign({}, airServices[row]);
    }

    for (let index = 0; index < this.distinctAirList.length; index++) {
      this.distinctAirList[index].weightFrom = 1;
      this.distinctAirList[index].weightTo = 150;
    }
    this.distinctAirListSignal.set(this.distinctAirList);
    // await this.distinctAirServices.sort((a:any, b:any) => a.subGroup.localeCompare(b.subGroup));
    this.airServices = this.getUniqueService(this.distinctAirList, 'subGroup');
  }

  async getDistinctGroundData() {


    this.distinctGroundList = [];
    for (let index = 0; index < this.groundDiscountsList.length; index++) {
      this.groundDiscountsList[index].weightFrom = Number(this.groundDiscountsList[index].weightFrom);
      this.groundDiscountsList[index].weightTo = Number(this.groundDiscountsList[index].weightTo);
    }
    var groundServices = await this.groundDiscountsList.filter(
      (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo) === i
    );


    for (let row = 0; row < groundServices.length; row++) {
      this.distinctGroundList[row] = Object.assign({}, groundServices[row]);
    }

    for (let index = 0; index < this.distinctGroundList.length; index++) {
      this.distinctGroundList[index].weightFrom = Number(this.distinctGroundList[index].weightFrom);
      this.distinctGroundList[index].weightTo = Number(this.distinctGroundList[index].weightTo);
    }

    let services = this.distinctGroundList.map((data: any) => data.subGroup);

    await this.distinctGroundList.sort((a: any, b: any) => a.weightFrom - b.weightFrom);
    await this.distinctGroundList.sort((a: any, b: any) => a.subGroup.localeCompare(b.subGroup));
    if (this.carrierName.toLowerCase() == 'fedex') {
      this.distinctGroundList = this.distinctGroundList.sort((a: any, b: any) => services.indexOf(a.subGroup) - services.indexOf(b.subGroup));
    }

    if (this.distinctGroundList.length > 0) {
      var service = this.distinctGroundList[0].subGroup;

      if (this.themeOption == 'dark') {
        var color = '#292D33';
      }
      else {
        var color = '#EAEFF3';
      }
      for (let index = 0; index < this.distinctGroundList.length; index++) {

        if (service != this.distinctGroundList[index].subGroup) {
          if (this.themeOption == 'dark') {
            color = (color == '#292D33') ? '#353C48' : '#292D33';
          }
          else {
            color = (color == '#EAEFF3') ? '#F4F8FB' : '#EAEFF3';
          }
        }

        service = this.distinctGroundList[index].subGroup;
        this.distinctGroundList[index].color = color;
      }
    }

    this.groundServices = [...new Map(this.distinctGroundList.map((item: any) =>
      [item['subGroup'], item])).values()];
  }

  async getDistinctIntlData() {

    this.distinctIntlList = [];
    for (let index = 0; index < this.intlDiscountsList.length; index++) {
      this.intlDiscountsList[index].weightFrom = Number(this.intlDiscountsList[index].weightFrom);
      this.intlDiscountsList[index].weightTo = Number(this.intlDiscountsList[index].weightTo);
    }

    // var intlServices = await this.intlDiscountsList.filter(
    //   (thing:any, i:any, arr:any) => arr.findIndex((t:any) => t.subGroup == thing.subGroup) === i
    // );

    const intlServices = Array.from(new Set(this.intlDiscountsList.map((item: any) => item.subGroup)))
      .map(subGroup => {
        return this.intlDiscountsList.find((item: any) => item.subGroup === subGroup);
      });

    for (let row = 0; row < intlServices.length; row++) {
      this.distinctIntlList[row] = Object.assign({}, intlServices[row]);
    }

    for (let row = 0; row < this.distinctIntlList.length; row++) {
      var filteredData = this.intlDiscountsList.filter((data: any) => data.subGroup == this.distinctIntlList[row].subGroup);
      var totalNetSpend = 0;
      filteredData.forEach((data: any) => {
        totalNetSpend += Number(data.netSpend);
      })
      this.distinctIntlList[row].netSpend = totalNetSpend;
    }

    // for (let index = 0; index < this.distinctIntlServices.length; index++) {
    //   var filteredData = this.intlDiscountsList.filter((data:any) => data.subGroup == this.distinctIntlServices[index].subGroup);
    //   var minType = filteredData[0].minType;
    //   var flag = false;
    //   for (let dataIndex = 0; dataIndex < filteredData.length; dataIndex++) {
    //     if (filteredData[dataIndex].minType != minType) {
    //       flag = true;
    //       break;
    //     }
    //   }

    //   if (flag) {
    //     this.distinctIntlServices[index].minType = '%';
    //   }
    // }  

    for (let index = 0; index < this.distinctIntlList.length; index++) {
      this.distinctIntlList[index].weightFrom = 1;
      this.distinctIntlList[index].weightTo = 1000;
    }

    // await this.distinctIntlServices.sort((a:any, b:any) => a.subGroup.localeCompare(b.subGroup));

    this.intlServices = this.getUniqueService(this.distinctIntlList, 'subGroup');
  }

  async getDistinctHWTData() {
    for (let index = 0; index < this.hwtDiscountsList.length; index++) {
      this.hwtDiscountsList[index].weightFrom = Number(this.hwtDiscountsList[index].weightFrom);
      this.hwtDiscountsList[index].weightTo = Number(this.hwtDiscountsList[index].weightTo);
    }

    var hwtServices = await this.hwtDiscountsList.filter(
      (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup) === i
    );
    for (let row = 0; row < hwtServices.length; row++) {
      this.distinctHWTList[row] = Object.assign({}, hwtServices[row]);
    }

    for (let index = 0; index < this.distinctHWTList.length; index++) {
      this.distinctHWTList[index].weightFrom = Number(this.distinctHWTList[index].weightFrom);
      this.distinctHWTList[index].weightTo = Number(this.distinctHWTList[index].weightTo);
    }

    //await this.distinctHWTServices.sort((a:any, b:any) => a.subGroup.localeCompare(b.subGroup));
    this.hwtServices = this.getUniqueService(this.distinctHWTList, 'subGroup');
  }

  async calculateAccNetSpend() {
    for (let index = 0; index < this.distinctAccList.length; index++) {
      var netSpend = 0;
      var filteredServices = this.accessorialDiscountList.filter((data: any) => data.service == this.distinctAccList[index].service);
      filteredServices.forEach((element: any) => {
        netSpend += Number(element.netSpend);
      });
      this.distinctAccList[index].netSpend = netSpend;
    }
  }

  async calculateNetSpend(serviceList: any, distinctList: any) {
    var netSpend: any;

    var distinctServices = this.getUniqueService(distinctList, 'subGroup');
    for (let index = 0; index < distinctServices.length; index++) {
      var currentServiceList = serviceList.filter((data: any) => data.subGroup == distinctServices[index]);

      var currentServices = currentServiceList.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType === thing.containerType && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo) === i
      );

      currentServices.sort((a: any, b: any) => a.weightFrom - b.weightFrom);

      netSpend = 0;
      for (let index = 0; index < currentServices.length; index++) {
        var filteredService = serviceList.filter((data: any) => data.subGroup == currentServices[index].subGroup && data.weightFrom == currentServices[index].weightFrom && data.weightTo == currentServices[index].weightTo);
        filteredService.forEach((element: any) => {
          netSpend += Number(element.netSpend);
        });
      }
      var rowNumber = distinctList.findIndex((data: any) => data.subGroup == distinctServices[index]);
      distinctList[rowNumber].netSpend = netSpend;
    }
  }

  ngAfterViewInit() {
    //this.setInitialValue();
    this.scrollAirGrid();
    this.scrollIntlGrid();
    this.scrollDIMGrid();
    this.scrollHWTGrid();
    this.scrollAccGrid();
    this.scrollGroundGrid();
  }

  //Scroll to bottom
  scrollGroundGrid() {
    this.scrollContainerGround = this.scrollFrameGround.nativeElement;
    this.itemElementsGround.changes.subscribe(_ => this.scrollToBottomGround());
  }
  scrollAccGrid() {
    this.scrollContainerAcc = this.scrollFrameAcc.nativeElement;
    this.itemElementsAcc.changes.subscribe(_ => this.scrollToBottomAcc());
  }
  scrollHWTGrid() {
    this.scrollContainerHWT = this.scrollFrameHWT.nativeElement;
    this.itemElementsHWT.changes.subscribe(_ => this.scrollToBottomHWT());
  }
  scrollDIMGrid() {
    this.scrollContainerDIM = this.scrollFrameDIM.nativeElement;
    this.itemElementsDIM.changes.subscribe(_ => this.scrollToBottomDIM());
  }
  scrollIntlGrid() {
    this.scrollContainerIntl = this.scrollFrameIntl.nativeElement;
    this.itemElementsIntl.changes.subscribe(_ => this.scrollToBottomIntl())
  }
  scrollAirGrid() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.scrollToBottom());
  }

  private scrollToBottom(): void {
    if (this.distinctAirList.length > this.airDiscountsLength) {
      this.airDiscountsLength = this.distinctAirList.length;
      this.scrollContainer.scroll({
        top: this.scrollContainer.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  private scrollToBottomGround(): void {
    if (this.distinctGroundList.length > this.groundDiscountsLength) {
      this.groundDiscountsLength = this.distinctGroundList.length;
      this.scrollContainerGround.scroll({
        top: this.scrollContainerGround.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  private scrollToBottomIntl(): void {
    if (this.distinctIntlList.length > this.intlDiscountsLength) {
      this.intlDiscountsLength = this.distinctIntlList.length;
      this.scrollContainerIntl.scroll({
        top: this.scrollContainerIntl.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  private scrollToBottomAcc(): void {
    if (this.distinctAccList.length > this.accessorialLength) {
      this.accessorialLength = this.distinctAccList.length;
      this.scrollContainerAcc.scroll({
        top: this.scrollContainerAcc.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  private scrollToBottomHWT(): void {

    if (this.distinctHWTList.length > this.hwtDiscountsLength) {
      this.hwtDiscountsLength = this.distinctHWTList.length;
      this.scrollContainerHWT.scroll({
        top: this.scrollContainerHWT.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
  private scrollToBottomDIM(): void {
    this.scrollContainerDIM.scroll({
      top: this.scrollContainerDIM.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }


  private setInitialValue() {


    this.filteredService
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function 
        // triggers initializing the selection according to the initial value of 
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially 
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: any, b: any) => a && b && a.id === b.id;
      });

    this.filteredDIMService
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function 
        // triggers initializing the selection according to the initial value of 
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially 
        // and after the mat-option elements are available
        this.singleDIMSelect.compareWith = (c, d) => c.name === d.name;
      });

  }

  async ExecDIMMatSelctFunctions() {
    var dimListServiceTemp = [];
    var distinctServices = this.getUniqueService(this.dimFactorList, 'serviceGrouping');
    for (var loop = 0; loop < distinctServices.length; loop++) {
      var clientObj: any = {};
      clientObj["name"] = distinctServices[loop];
      dimListServiceTemp.push(clientObj);
    }

    var columnName = '';
    if (this.carrier.toLowerCase() == 'fedex' || this.carrierName.toLowerCase() == 'ups') {
      columnName = 'service';
    }
    else {
      columnName = 'subGroup'
    }

    for (var loop = 0; loop < this.distinctIntlList.length; loop++) {
      var clientObj: any = {};
      clientObj["name"] = this.distinctIntlList[loop][columnName];
      dimListServiceTemp.push(clientObj);
    }

    for (var loop = 0; loop < this.distinctAirList.length; loop++) {
      var clientObj: any = {};
      clientObj["name"] = this.distinctAirList[loop][columnName];
      dimListServiceTemp.push(clientObj);
    }

    var arrayUniqueByKey = [...new Map(this.distinctGroundList.map((item: any) =>
      [item[columnName], item[columnName]])).values()];

    for (var loop = 0; loop < arrayUniqueByKey.length; loop++) {
      var clientObj: any = {};
      clientObj["name"] = arrayUniqueByKey[loop];
      dimListServiceTemp.push(clientObj);
    }
    var serviceUnique = [...new Map(dimListServiceTemp.map((item: any) =>
      [item["name"], item["name"]])).values()];

    serviceUnique.forEach((element: any) => {
      var clientObj: any = {};
      clientObj["name"] = element;
      this.dimListService.push(clientObj);
    });

    this.filteredDIMService.next(this.dimListService.slice());

    // listen for search field value changes
    this.DimserviceNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDIMDestroy))
      .subscribe(() => {
        this.filterServiceNameDIM();
      });
  }


  async ExecMatSelctFunctions() {

    for (var loop = 0; loop < this.distinctIntlList.length; loop++) {

      var clientObj: any = {};
      clientObj["subGroup"] = this.distinctIntlList[loop].subGroup;
      this.intlDiscountsListService.push(clientObj);
    }

    this.filteredService.next(this.intlDiscountsListService.slice());

  }

  private filterServiceNameDIM() {
    if (!this.dimListService) {
      return;
    }
    let search = this.DimserviceNameFilterCtrl.value;
    if (!search) {
      this.filteredDIMService.next(this.dimListService.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredDIMService.next(
      this.dimListService.filter((clientx: any) => clientx.name.toLowerCase().indexOf(search) > -1)
    );
  }

  filterIntlServices(event: any) {
    if (!this.intlDiscountsListService) {
      return;
    }
    let search = event.target.value;
    if (!search) {
      this.filteredService.next(this.intlDiscountsListService.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredService.next(
      this.intlDiscountsListService.filter((clientx: any) => clientx.subGroup.toLowerCase().indexOf(search) > -1)
    );
  }

  popdiscount(serviceName: string, subGroupName: string, listName: string, type: string) {

    const dialogRef = this.dialog.open(ContractsummarydiscountComponent, {
      disableClose: true,
      width: '90vw',
      maxWidth: '80vw',
      panelClass: this.panelClass,
      data: {
        service: serviceName,
        pageData: (this as any)[listName],
        subGroup: subGroupName,
        carrierDetails: this.carrierDetails,
        target: this.targetDetails,
        type: type,
        currentAgreement: this.currentAgreement
      }
    });

    dialogRef.afterClosed().subscribe(async params => {

      if (params != null && params != undefined) {

        let data = params.alteredList;
        let deleteData = params.deleteList;

        for (let index = 0; index < deleteData.length; index++) {

          var fromWeight = deleteData[index].oldWeightFrom;
          var toWeight = deleteData[index].oldWeightTo;
          deleteData[index].weightFrom = Number(deleteData[index].weightFrom);
          deleteData[index].weightTo = Number(deleteData[index].weightTo);

          if (deleteData[index].serviceType.toLowerCase() == 'air') {
            this.airDeleteList.push(Object.assign({}, deleteData[index]));
            let rowNumber = this.airDiscountsList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup && service.zone1 == deleteData[index].zone1 && service.weightFrom == fromWeight && service.weightTo == toWeight);
            if (rowNumber != -1) this.airDiscountsList.splice(rowNumber, 1);
            let tableRowNumber = this.distinctAirList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup);
            if (tableRowNumber != -1) this.distinctAirList.splice(tableRowNumber, 1);
          }
          else if (deleteData[index].serviceType.toLowerCase() == 'ground') {
            this.groundDeleteList.push(Object.assign({}, deleteData[index]));
            let rowNumber = this.groundDiscountsList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup && service.containerType == deleteData[index].oldContainerType && service.zone1 == deleteData[index].zone1 && service.weightFrom == deleteData[index].oldWeightFrom && service.weightTo == deleteData[index].oldWeightTo);
            if (rowNumber != -1) this.groundDiscountsList.splice(rowNumber, 1);
            let tableRowNumber = this.distinctGroundList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup && service.weightFrom == fromWeight && service.weightTo == toWeight);
            if (tableRowNumber != -1) this.distinctGroundList.splice(tableRowNumber, 1);
          }
          else {
            this.intlDeleteList.push(Object.assign({}, deleteData[index]));
            let rowNumber = this.intlDiscountsList.findIndex((service: any) => service.containerType == deleteData[index].containerType && service.zone1 == deleteData[index].zone1 && service.weightFrom == deleteData[index].oldWeightFrom && service.weightTo == deleteData[index].oldWeightTo);
            if (rowNumber != -1) this.intlDiscountsList.splice(rowNumber, 1);
            let tableRowNumber = this.distinctIntlList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup);
            if (tableRowNumber != -1) this.distinctIntlList.splice(tableRowNumber, 1);
          }
        }

        for (let index = 0; index < data.length; index++) {

          var fromWeight = data[index].oldWeightFrom;
          var toWeight = data[index].oldWeightTo;
          data[index].weightFrom = Number(data[index].weightFrom);
          data[index].weightTo = Number(data[index].weightTo);
          if (data[index].serviceType.toLowerCase() == 'air') {

            let rowNumber = this.airDiscountsList.findIndex((service: any) => service.subGroup == data[index].subGroup && service.zone1 == data[index].zone1 && service.weightFrom == fromWeight && service.weightTo == toWeight);
            if (rowNumber != -1) {
              this.airDiscountsList[rowNumber] = Object.assign({}, data[index]);
              let tableRowNumber = this.distinctAirList.findIndex((service: any) => service.subGroup == data[index].subGroup);
              this.distinctAirList[tableRowNumber] = data[index];
            }
            else {
              this.airDiscountsList[this.airDiscountsList.length] = Object.assign({}, data[index]);
            }
          }
          else if (data[index].serviceType.toLowerCase() == 'ground') {
            let rowNumber = this.groundDiscountsList.findIndex((service: any) => service.subGroup == data[index].subGroup && service.containerType == data[index].oldContainerType && service.zone1 == data[index].zone1 && service.weightFrom == data[index].oldWeightFrom && service.weightTo == data[index].oldWeightTo);
            if (rowNumber != -1) {
              this.groundDiscountsList[rowNumber] = Object.assign({}, data[index]);
              let tableRowNumber = this.distinctGroundList.findIndex((service: any) => service.subGroup == data[index].subGroup && service.weightFrom == fromWeight && service.weightTo == toWeight);
              this.distinctGroundList[tableRowNumber] = data[index];
            }
            else {
              this.groundDiscountsList[this.groundDiscountsList.length] = Object.assign({}, data[index]);
            }
          }
          else {
            let rowNumber = this.intlDiscountsList.findIndex((service: any) => service.subGroup == data[index].subGroup && service.containerType == data[index].containerType && service.zone1 == data[index].zone1 && service.weightFrom == data[index].oldWeightFrom && service.weightTo == data[index].oldWeightTo);
            if (rowNumber != -1) {
              this.intlDiscountsList[rowNumber] = Object.assign({}, data[index]);
              let tableRowNumber = this.distinctIntlList.findIndex((service: any) => service.subGroup == data[index].subGroup);
              this.distinctIntlList[tableRowNumber] = data[index];
            }
            else {
              this.intlDiscountsList[this.intlDiscountsList.length] = Object.assign({}, data[index]);
            }
          }
        }

        for (let index = 0; index < this.distinctIntlList.length; index++) {
          var filteredData = this.intlDiscountsList.filter((data: any) => data.subGroup == this.distinctIntlList[index].subGroup);
          if (filteredData[0] != undefined) {
            var minType = filteredData[0].minType;
          }
          var flag = false;
          for (let dataIndex = 0; dataIndex < filteredData.length; dataIndex++) {
            if (filteredData[dataIndex].minType != minType) {
              flag = true;
              break;
            }
          }
          if (flag) {
            this.distinctIntlList[index].minType = '%';
          }
        }

        await this.getDistinctAirData();
        await this.getDistinctGroundData();
        await this.getDistinctIntlData();

        await this.setMinMax('air');
        await this.setMinMax('ground');
        await this.setMinMax('intl');

        this.insertNewRow('air');
        this.insertNewRow('ground');
        this.insertNewRow('intl');

        this.setRowSpan();
        this.dataSourceAir = new MatTableDataSource(this.distinctAirList);
        this.dataSourceAirSignal.set(this.dataSourceAir);
        this.dataSourceGround = new MatTableDataSource(this.distinctGroundList);
        this.dataSourceGroundSignal.set(this.dataSourceGround)
        this.dataSourceIntl = new MatTableDataSource(this.distinctIntlList);
        this.dataSourceIntlSignal.set(this.dataSourceIntl);
      }
    });

  }

  popdiscountAcc(accName: any) {
    const dialogRef = this.dialog.open(AccessorialPopupComponent, {
      disableClose: true,
      width: '90vw',
      maxWidth: '80vw',
      panelClass: this.panelClass,
      data: {
        service: accName,
        pageData: this.accessorialDiscountList,
        carrierDetails: this.carrierDetails,
        target: this.targetDetails,
        currentAgreement: this.currentAgreement,
      }
    });
    dialogRef.afterClosed().subscribe(async data => {

      if (data != null && data != undefined) {

        for (let index = 0; index < data.length; index++) {

          var rowNumber = this.accessorialDiscountList.findIndex((service: any) => service.accRatesheetId == data[index].accRatesheetId);
          if (rowNumber != -1) {
            this.accessorialDiscountList[rowNumber] = data[index];
          }
          else {
            this.accessorialDiscountList.push(data[index]);
          }
          rowNumber = this.distinctAccList.findIndex((service: any) => service.service == data[index].service);
          this.distinctAccList[rowNumber] = data[index];
        }
        this.distinctAccList.forEach((distinctData: any) => {
          var filteredData = this.accessorialDiscountList.filter((data: any) => data.service == distinctData.service);
          var totalSpend = 0;
          filteredData.forEach((data: any) => totalSpend += Number(data.netSpend));
          distinctData.netSpend = totalSpend;
        });
        this.setAccMinMax();
        this.dataSourceAcc = new MatTableDataSource(this.distinctAccList);
        this.dataSourceAccSignal.set(this.dataSourceAcc);
      }
    });
  }

  AddNewRowAir() {

    var newRow = Object.assign({}, this.distinctAirList[0]);
    var keys = Object.keys(newRow);
    newRow['isNewRow'] = true;
    newRow['frtRatesheetId'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    for (let index = 0; index < keys.length; index++) {
      if (keys[index] != 'serviceType' && keys[index] != 'frtRatesheetId') {
        newRow[keys[index]] = '';
      }
    }
    this.distinctAirListNew.push(Object.assign({}, newRow));
    this.distinctAirList.push(Object.assign({}, newRow));
    this.distinctAirListSignal.set(this.distinctAirList)
    this.airMinMaxList.push({
      service: '',
      disMin: '',
      disMax: '',
      amountMin: '',
      amountMax: '',
      minWeight: '',
      maxWeight: '',
      netMinimumMin: '',
      netMinimumMax: '',
    })

    this.dataSourceAir = new MatTableDataSource(this.distinctAirList);
    this.dataSourceAirSignal.set(this.dataSourceAir);


  }
  async AddNewRowGround() {
    var newRow = Object.assign({}, this.distinctGroundList[0]);
    var keys = Object.keys(newRow);
    newRow['isNewRow'] = true;
    newRow['frtRatesheetId'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    for (let index = 0; index < keys.length; index++) {
      if (keys[index] != 'serviceType' && keys[index] != 'frtRatesheetId') {
        newRow[keys[index]] = '';
      }
    }

    if (this.themeOption == 'dark') {
      newRow['color'] = '#1C232D';
    }
    else {
      newRow['color'] = '#FEFEFE';
    }

    this.distinctGroundListNew.push(Object.assign({}, newRow));
    this.distinctGroundList[this.distinctGroundList.length] = Object.assign({}, newRow);

    this.groundMinMaxList.push({
      service: '',
      disMin: '',
      disMax: '',
      amountMin: '',
      amountMax: '',
      minWeight: '',
      maxWeight: '',
      netMinimumMin: '',
      netMinimumMax: '',
    })
    await this.setRowSpan();
    this.dataSourceGround = new MatTableDataSource(this.distinctGroundList);
    this.dataSourceGroundSignal.set(this.dataSourceGround)
  }

  AddNewRowIntl() {
    var newRow = Object.assign({}, this.distinctIntlList[0]);
    var keys = Object.keys(newRow);
    newRow['isNewRow'] = true;
    newRow['frtRatesheetId'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    for (let index = 0; index < keys.length; index++) {
      if (keys[index] != 'serviceType' && keys[index] != 'frtRatesheetId') {
        newRow[keys[index]] = '';
      }
    }
    this.distinctIntlListNew.push(Object.assign({}, newRow));
    this.distinctIntlList[this.distinctIntlList.length] = Object.assign({}, newRow);

    this.intlMinMaxList.push({
      service: '',
      disMin: '',
      disMax: '',
      amountMin: '',
      amountMax: '',
      minWeight: '',
      maxWeight: '',
      netMinimumMin: '',
      netMinimumMax: '',
    })
    this.dataSourceIntl = new MatTableDataSource(this.distinctIntlList);
    this.dataSourceIntlSignal.set(this.dataSourceIntl);
  }

  AddNewRowHWT() {
    var newRow = Object.assign({}, this.distinctHWTList[0]);
    var keys = Object.keys(newRow);
    newRow['isNewRow'] = true;
    newRow['frtRatesheetId'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    for (let index = 0; index < keys.length; index++) {
      if (keys[index] != 'serviceType' && keys[index] != 'frtRatesheetId') {
        newRow[keys[index]] = '';
      }
    }

    this.distinctHWTListNew.push(Object.assign({}, newRow));
    this.distinctHWTList[this.distinctHWTList.length] = Object.assign({}, newRow);

    this.hwtMinMaxList.push({
      service: '',
      disMin: '',
      disMax: '',
      amountMin: '',
      amountMax: '',
      minWeight: '',
      maxWeight: '',
      netMinimumMin: '',
      netMinimumMax: ''
    })
    this.dataSourceHWT = new MatTableDataSource(this.distinctHWTList);

  }
  AddNewRowDIM() {
    var newRow = Object.assign({}, this.dimFactorList[0]);
    var keys = Object.keys(newRow);
    newRow['dimDetailid'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    newRow['id'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    newRow['isNewRow'] = true;
    for (let index = 0; index < keys.length; index++) {
      if (keys[index] != 'serviceType' && keys[index] != 'dimDetailid') {
        newRow[keys[index]] = '';
      }
    }
    if (this.themeOption == 'dark') {
      newRow['color'] = '#1C232D';
    }
    else {
      newRow['color'] = '#FEFEFE';
    }
    this.dimFactorList.push(Object.assign({}, newRow));
    this.dimDuplicateList.push(Object.assign({}, newRow));
    this.dataSourceDIM = new MatTableDataSource(this.dimFactorList);
    this.dataSourceDIMSignal.set(this.dataSourceDIM);
  }

  AddNewRowAcc() {
    var newRow = Object.assign({}, this.accessorialDiscountList[0]);
    var keys = Object.keys(newRow);
    newRow['isNewRow'] = true;
    newRow['accRatesheetId'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    for (let index = 0; index < keys.length; index++) {
      if (keys[index] != 'serviceType' && keys[index] != 'accRatesheetId') {
        newRow[keys[index]] = '';
      }
    }
    newRow['targetDisType'] = "%";
    newRow['rowNumber'] = undefined;
    this.distinctAccList[this.distinctAccList.length] = Object.assign({}, newRow);
    this.accessorialDiscountList[this.accessorialDiscountList.length] = Object.assign({}, newRow);
    this.accMinMaxList.push({
      service: '',
      disMin: '',
      disMax: '',
    });
    this.dataSourceAcc = new MatTableDataSource(this.distinctAccList);
    this.dataSourceAccSignal.set(this.dataSourceAcc);
  }
  async insertNewRowsFreight() {
    //for air
    if (this.distinctAirListNew.length > 0) {
      var zoneList: any = [];
      var newList = [];
      for (let index = 0; index < this.distinctAirListNew.length; index++) {
        if (this.distinctAirListNew[index].subGroup == "") {
          return true;
        }
        else {
          var sampleObject = Object.assign({}, this.distinctAirListNew[index]);
          //get the available list of that service
          var serviceList = this.airDiscountsListNew.filter((data: any) => data.subGroup == sampleObject.subGroup);
          if (serviceList.length > 0) {
            serviceList = serviceList.filter((data: any) => data.subGroup == serviceList[0].subGroup && data.weightFrom == serviceList[0].weightFrom && data.weightTo == serviceList[0].weightTo);
            sampleObject.service = serviceList[0].service;
            sampleObject.serviceType = serviceList[0].serviceType;
            sampleObject.containerType = serviceList[0].containerType;
            sampleObject.ratesheetName = serviceList[0].ratesheetName;
            sampleObject.netSpend = 0;
            delete sampleObject['isNewRow'];
          }
          //create zone list
          serviceList.forEach((element: any) => {
            zoneList.push(element.zone1);
          });
          zoneList = zoneList.sort((a: any, b: any) => Number(a) - Number(b));
          for (let zoneIndex = 0; zoneIndex < zoneList.length; zoneIndex++) {
            sampleObject.zone1 = zoneList[zoneIndex];
            newList.push(Object.assign({}, sampleObject));
          }
        }
        for (let row = 0; row < newList.length; row++) {
          this.airDiscountsList.push(Object.assign({}, newList[row]));
        }
      }
    }

    //for ground   
    if (this.distinctGroundListNew.length > 0) {
      var zoneList: any = [];
      var newList = [];
      for (let index = 0; index < this.distinctGroundListNew.length; index++) {
        if (this.distinctGroundListNew[index].subGroup == "") {
          return true;
        }
        else {
          var sampleObject = Object.assign({}, this.distinctGroundListNew[index]);
          //get the available list of that service
          var serviceList = this.groundDiscountsListNew.filter((data: any) => data.subGroup == sampleObject.subGroup);
          if (serviceList.length > 0) {
            serviceList = serviceList.filter((data: any) => data.subGroup == serviceList[0].subGroup && data.weightFrom == serviceList[0].weightFrom && data.weightTo == serviceList[0].weightTo);
            sampleObject.service = serviceList[0].service;
            sampleObject.serviceType = serviceList[0].serviceType;
            sampleObject.containerType = serviceList[0].containerType;
            sampleObject.ratesheetName = serviceList[0].ratesheetName;
            delete sampleObject['isNewRow'];
          }

          //create zone list
          serviceList.forEach((element: any) => {
            zoneList.push(element.zone1);
          });

          for (let zoneIndex = 0; zoneIndex < zoneList.length; zoneIndex++) {
            sampleObject.zone1 = zoneList[zoneIndex];
            newList.push(Object.assign({}, sampleObject));
          }
        }
        for (let row = 0; row < newList.length; row++) {
          this.groundDiscountsList.push(Object.assign({}, newList[row]));
        }
      }
    }

    //for intl
    if (this.distinctIntlListNew.length > 0) {
      var zoneList: any = [];
      var newList = [];
      for (let index = 0; index < this.distinctIntlListNew.length; index++) {
        if (this.distinctIntlListNew[index].subGroup == "") {
          return true;
        }
        else {
          var sampleObject = Object.assign({}, this.distinctIntlListNew[index]);
          //get the available list of that service
          var serviceList = this.intlDiscountsListNew.filter((data: any) => data.subGroup == sampleObject.subGroup);
          if (serviceList.length > 0) {
            serviceList = serviceList.filter((data: any) => data.subGroup == serviceList[0].subGroup && data.weightFrom == serviceList[0].weightFrom && data.weightTo == serviceList[0].weightTo);
            sampleObject.service = serviceList[0].service;
            sampleObject.serviceType = serviceList[0].serviceType;
            sampleObject.containerType = serviceList[0].containerType;
            sampleObject.ratesheetName = serviceList[0].ratesheetName;
            delete sampleObject['isNewRow'];
          }
          //create zone list
          serviceList.forEach((element: any) => {
            zoneList.push(element.zone1);
          });
          for (let zoneIndex = 0; zoneIndex < zoneList.length; zoneIndex++) {
            sampleObject.zone1 = zoneList[zoneIndex];
            newList.push(Object.assign({}, sampleObject));
          }
        }
        for (let row = 0; row < newList.length; row++) {
          this.intlDiscountsList.push(Object.assign({}, newList[row]));
        }
      }
    }

    if (this.distinctHWTListNew.length > 0) {
      var zoneList: any = [];
      var newList = [];
      for (let index = 0; index < this.distinctHWTListNew.length; index++) {
        if (this.distinctHWTListNew[index].subGroup == "") {
          return true;
        }
        else {
          var sampleObject = Object.assign({}, this.distinctHWTListNew[index]);
          //get the available list of that service
          var serviceList = this.hwtDiscountsListNew.filter((data: any) => data.subGroup == sampleObject.subGroup);
          if (serviceList.length > 0) {
            serviceList = serviceList.filter((data: any) => data.subGroup == serviceList[0].subGroup && data.weightFrom == serviceList[0].weightFrom && data.weightTo == serviceList[0].weightTo);
            sampleObject.service = serviceList[0].service;
            sampleObject.serviceType = serviceList[0].serviceType;
            sampleObject.containerType = serviceList[0].containerType;
            sampleObject.clientId = serviceList[0].clientId;
            sampleObject.shortName = serviceList[0].shortName;
            delete sampleObject['isNewRow'];
          }
          //create zone list
          serviceList.forEach((element: any) => {
            zoneList.push(element.zone1);
          });
          for (let zoneIndex = 0; zoneIndex < zoneList.length; zoneIndex++) {
            sampleObject.zone1 = zoneList[zoneIndex];
            newList.push(Object.assign({}, sampleObject));
          }
        }
        for (let row = 0; row < newList.length; row++) {
          this.hwtDiscountsList.push(Object.assign({}, newList[row]));
        }
      }
    }

    for (let index = this.dimFactorListNew.length; index < this.dimDuplicateList.length; index++) {
      if (this.dimDuplicateList[index].serviceGrouping == "") {
        return true;
      }
      else {
        var symbol;
        if (this.dimDuplicateList[index].cubicInchFrom == '0')
          symbol = "(< " + this.dimDuplicateList[index].cubicInchTo + ")";
        else
          symbol = "(> " + this.dimDuplicateList[index].cubicInchFrom + ")";
        this.dimDuplicateList[index].criteria = "Dim Divisor " + this.dimDuplicateList[index].serviceGrouping + " " + symbol;
      }
    }
    return;
  }

  async checkAnyChanges() {
    if (this.isSaved) {
      this.isAnythingChanged = true;
    }
    if (this.proposalNickName != this.proposalNickNameNew) {
      this.isAnythingChanged = true;
    }
    if (this.carrierName != this.carrierNew) {
      this.isAnythingChanged = true;
    }
    if (this.airDiscountsList.length > this.airDiscountsListNew.length) {
      this.isAnythingChanged = true;
    }
    if (this.groundDiscountsList.length > this.groundDiscountsListNew.length) {
      this.isAnythingChanged = true;
    }
    if (this.intlDiscountsList.length > this.intlDiscountsListNew.length) {
      this.isAnythingChanged = true;
    }
    if (this.hwtDiscountsList.length > this.hwtDiscountsListNew.length) {
      this.isAnythingChanged = true;
    }
    if (this.dimFactorList.length > this.dimFactorListNew.length) {
      this.isAnythingChanged = true;
    }
    if (this.accessorialDiscountList.length > this.accessorialDiscountListNew.length) {
      this.isAnythingChanged = true;
    }

    for (let index = 0; index < this.airDiscountsList.length; index++) {
      if (JSON.stringify(this.airDiscountsListNew[index]) !== JSON.stringify(this.airDiscountsList[index])) {
        this.isAnythingChanged = true;
      }
    }

    for (let index = 0; index < this.groundDiscountsList.length; index++) {
      if (JSON.stringify(this.groundDiscountsListNew[index]) !== JSON.stringify(this.groundDiscountsList[index])) {
        this.isAnythingChanged = true;
      }
    }

    for (let index = 0; index < this.intlDiscountsList.length; index++) {
      if (JSON.stringify(this.intlDiscountsListNew[index]) !== JSON.stringify(this.intlDiscountsList[index])) {
        this.isAnythingChanged = true;
      }
    }

    for (let index = 0; index < this.hwtDiscountsList.length; index++) {
      if (JSON.stringify(this.hwtDiscountsListNew[index]) !== JSON.stringify(this.hwtDiscountsList[index])) {
        this.isAnythingChanged = true;
      }
    }

    for (let index = 0; index < this.dimFactorList.length; index++) {
      if (JSON.stringify(this.dimFactorListNew[index]) !== JSON.stringify(this.dimFactorList[index])) {
        this.isAnythingChanged = true;
      }
    }

    for (let index = 0; index < this.accessorialDiscountList.length; index++) {
      if (JSON.stringify(this.accessorialDiscountListNew[index]) !== JSON.stringify(this.accessorialDiscountList[index])) {
        this.isAnythingChanged = true;
      }
    }
  }

  async saveTargetDetails() {

    this.saveClicked = true;
    let message = '';
    this.openLoading();

    let panelClass = '';
    if (this.themeOption == "dark") {
      panelClass = 'page-dark';
    }
    if (this.currentAgreement) {
      if (this.carrier.toLowerCase() == 'ups') {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }
        targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        targetObj['type'] = 'Current';
        targetObj['agreementNo'] = this.agreementNo;
        this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          width: '470px',
          height: 'auto',
          panelClass: panelClass,
          data: { pageValue: message },
        });
      }
      else {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }

        //save target details 
        targetObj['clientId'] = this.fedexClientId;
        targetObj['type'] = 'Current';
        targetObj['agreementNo'] = this.agreementNo;
        this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          width: '470px',
          height: 'auto',
          panelClass: panelClass,
          data: { pageValue: message },
        });
      }
    }
    else {
      if (this.proposalName == "" || this.proposalNickName == "") {
        this.closeLoading();
        return false;
      }
      let proposalName = "";
      for (let index = 0; index < this.targetList.length; index++) {
        if (this.targetList[index].targetId == this.proposalName) {
          proposalName = this.targetList[index].targetName;
          break;
        }
      }

      if (this.carrier.toLowerCase() == 'ups') {
        var targetObj: any = {};
        targetObj['targetName'] = proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }
        targetObj['targetId'] = Number(this.targetDetails.targetId);
        //update target details
        targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        targetObj['type'] = 'Target';
        if (Number(this.targetDetails.targetId) != 0) {
          targetObj['agreementNo'] = this.agreementNo;
        }
        else {
          targetObj['targetAgreementNo'] = this.agreementNo;
        }

        var data = await this.httpClientService.saveOrUpdateTargetDetails(targetObj).toPromise().then(async res => {
          this.isSaved = true;
          message = "Agreement details saved successfully";

          if (Number(this.targetDetails.targetId) == 0) {
            await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res2 => {
              this.agreementNoDuplicate = this.agreementNo;
              this.isSaved = true;
              message = "Agreement details saved successfully";
            }).catch((err) => {
              message = "Agreement not saved";
            });
          }
        }).catch((err) => {
          message = "Agreement not saved";
        });
        var resetDialog = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          width: '470px',
          height: 'auto',
          panelClass: panelClass,
          data: { pageValue: message },
        });
      }
      else {
        var targetObj: any = {};
        targetObj['targetName'] = proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }
        targetObj['targetId'] = Number(this.targetDetails.targetId);
        //update target details
        targetObj['clientId'] = this.fedexClientId;
        targetObj['type'] = 'Target';
        if (Number(this.targetDetails.targetId) != 0) {
          targetObj['agreementNo'] = this.agreementNo;
        }
        else {
          targetObj['targetAgreementNo'] = this.agreementNo;
        }
        var data = await this.fedexService.saveOrUpdateTargetDetails(targetObj).toPromise().then(async res => {
          this.isSaved = true;
          message = "Agreement details saved successfully";
          if (Number(this.targetDetails.targetId) == 0) {
            await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res2 => {
              this.agreementNoDuplicate = this.agreementNo;
              this.isSaved = true;
              message = "Agreement details saved successfully";
            }).catch((err) => {
              message = "Agreement not saved";
            });
          }
        }).catch((err) => {
          message = "Agreement not saved";
        });
        var resetDialog = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          width: '470px',
          height: 'auto',
          panelClass: panelClass,
          data: { pageValue: message },
        });
      }
    }
    this.closeLoading();
    return false;//9057
  }
  async nextbtn_clickHandler(event: any) {
    this.submitClicked.set(true);
    this.saveClicked = true;
    if (this.fromWeightToolTipId != -1 || this.toWeightToolTipId != -1) {
      return;
    }
    if (this.buttonName == "Generate") {
      if ((this.proposalName == "" || this.proposalNickName == "") && !this.currentAgreement) {
        return;
      }
      if (this.isAccServiceAvailable == true) {
        return;
      }
      var isEmpty = await this.insertNewRowsFreight();
      if (isEmpty) {
        return;
      }
    }
    var keys = ["subGroup", "weightFrom", "weightTo", "targetDis", "targetMin", "minType"];
    if (this.nextBtnShow == 0 || this.buttonName == "Generate") {
      for (let index = 0; index < this.airDiscountsList.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.airDiscountsList[index][keys[keyIndex]] == "" && this.airDiscountsList[index][keys[keyIndex]].length == 0) {
            return;
          }
        }
      }
      for (let index = 0; index < this.distinctAirListNew.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.distinctAirListNew[index][keys[keyIndex]] == "" && this.distinctAirListNew[index][keys[keyIndex]].length == 0) {
            return;
          }
        }
      }
    }

    if (this.nextBtnShow == 1 || this.buttonName == "Generate") {
      for (let index = 0; index < this.groundDiscountsList.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.groundDiscountsList[index][keys[keyIndex]] == "" && this.groundDiscountsList[index][keys[keyIndex]].length == 0) {
            // isEmpty = true;
            return;
          }
        }
      }
      for (let index = 0; index < this.distinctGroundListNew.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.distinctGroundListNew[index][keys[keyIndex]] == "" && this.distinctGroundListNew[index][keys[keyIndex]].length == 0) {
            return;
          }
        }
      }
    }

    if (this.nextBtnShow == 2 || this.buttonName == "Generate") {
      for (let index = 0; index < this.intlDiscountsList.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.intlDiscountsList[index][keys[keyIndex]] == "" && this.intlDiscountsList[index][keys[keyIndex]].length == 0) {
            // isEmpty = true;
            return;
          }
        }
      }
      for (let index = 0; index < this.distinctIntlListNew.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.distinctIntlListNew[index][keys[keyIndex]] == "" && this.distinctIntlListNew[index][keys[keyIndex]].length == 0) {
            return;
          }
        }
      }
    }

    keys = ["subGroup", "weightFrom", "weightTo", "hwtTier", "targetDis"];
    if (this.nextBtnShow == 3 || this.buttonName == "Generate") {
      for (let index = 0; index < this.hwtDiscountsList.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.hwtDiscountsList[index][keys[keyIndex]] == "" && this.hwtDiscountsList[index][keys[keyIndex]].length == 0) {
            // isEmpty = true;
            return;
          }
        }
      }
      for (let index = 0; index < this.distinctHWTListNew.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.distinctHWTListNew[index][keys[keyIndex]] == "" && this.distinctHWTListNew[index][keys[keyIndex]].length == 0) {
            return;
          }
        }
      }
    }

    keys = ["serviceGrouping", "criteria", "cubicInchFrom", "cubicInchTo", "targetDimDivisor"];
    if (this.nextBtnShow == 4 || this.buttonName == "Generate") {
      for (let index = 0; index < this.dimDuplicateList.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.dimDuplicateList[index][keys[keyIndex]] == "" && this.dimDuplicateList[index][keys[keyIndex]].length == 0) {
            // isEmpty = true;
            return;
          }
        }
      }
    }

    keys = ["service", "targetDis"];
    if (this.nextBtnShow == 5 || this.buttonName == "Generate") {
      for (let index = 0; index < this.accessorialDiscountList.length; index++) {
        for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
          if (this.accessorialDiscountList[index][keys[keyIndex]] == "" && this.accessorialDiscountList[index][keys[keyIndex]].length == 0) {
            // isEmpty = true;
            return;
          }
        }
      }
    }

    // return false;
    if (this.buttonName == 'Generate') {
      this.openLoading();
      await this.checkAnyChanges();
    }
    var clientObj: any = {};
    if (!this.currentAgreement) {
      clientObj['targetId'] = Number(this.targetDetails.targetId);
    }
    else {
      clientObj['targetId'] = 0;
    }
    var alteredList = [];

    //save target details
    if (this.buttonName == 'Generate' && this.type.toLowerCase() == 'create' && this.currentAgreement) {
      if (this.carrier.toLowerCase() == 'ups') {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }

        //save target details 
        targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        targetObj['type'] = 'Current';
        targetObj['agreementNo'] = this.agreementNo;
        // targetObj['year'] = this.agreementYear;

        await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res => {
          this.agreementNoDuplicate = this.agreementNo;
          this.isSaved = true;
        }).catch((err) => {
        });

      }
      else {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }

        //save target details 
        targetObj['clientId'] = this.fedexClientId;
        targetObj['type'] = 'Current';
        targetObj['agreementNo'] = this.agreementNo;
        // targetObj['year'] = this.agreementYear;

        await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res => {
          this.agreementNoDuplicate = this.agreementNo;
          this.isSaved = true;
        }).catch((err) => {
        });

      }
    }
    else if (this.buttonName == 'Generate' && this.type.toLowerCase() == 'edit') {

      for (let index = 0; index < this.targetList.length; index++) {
        if (this.targetList[index].targetId == this.proposalName) {
          this.proposalName = this.targetList[index].targetName;
          break;
        }
      }

      if (this.carrier.toLowerCase() == 'ups') {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }
        targetObj['targetId'] = Number(this.targetDetails.targetId);

        //update target details
        targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        targetObj['type'] = 'Target';

        if (Number(this.targetDetails.targetId) != 0) {
          targetObj['agreementNo'] = this.agreementNo;
          // targetObj['year'] = this.agreementYear;
        }
        else {
          targetObj['targetAgreementNo'] = this.agreementNo;
          // targetObj['targetYear'] = this.agreementYear;
          await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res => {
            this.isSaved = true;
          }).catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }

        await this.httpClientService.saveOrUpdateTargetDetails(targetObj).toPromise().then(res => {
          this.isSaved = true;
        }).catch((err) => {
          console.log(err);
          this.closeLoading();
        });
      }
      else {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }
        targetObj['targetId'] = Number(this.targetDetails.targetId);

        //update target details
        targetObj['clientId'] = this.fedexClientId;
        targetObj['type'] = 'Target';
        if (Number(this.targetDetails.targetId) != 0) {
          targetObj['agreementNo'] = this.agreementNo;
          // targetObj['year'] = this.agreementYear;
        }
        else {
          targetObj['targetAgreementNo'] = this.agreementNo;
          // targetObj['targetYear'] = this.agreementYear;
          await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res => {
            this.isSaved = true;
          }).catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }

        await this.fedexService.saveOrUpdateTargetDetails(targetObj).toPromise().then(res => {
          this.isSaved = true;
        }).catch((err) => {
          console.log(err);
          this.closeLoading();
        });
      }
    }

    else if (this.buttonName == 'Generate' && this.type.toLowerCase() == 'create' && !this.currentAgreement) {

      if (this.carrier.toLowerCase() == 'ups') {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }

        //save target details 
        targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');

        targetObj['type'] = 'Current';
        targetObj['agreementNo'] = this.agreementNo;
        // targetObj['year'] = this.agreementYear;
        // await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res => {
        //   this.isSaved = true;
        // }).catch((err) => {
        //   console.log(err);
        //   this.closeLoading();
        // });

        await this.httpClientService.saveOrUpdateTargetDetails(targetObj).toPromise().then(res => {
          clientObj['targetId'] = res[0].targetId;
          this.isSaved = true;
        }).catch((err) => {
          console.log(err);
          this.closeLoading();
        });


      }
      else {
        var targetObj: any = {};
        targetObj['targetName'] = this.proposalName;
        targetObj['targetNickName'] = this.proposalNickName;
        targetObj['carrierName'] = this.carrierName;
        targetObj['createdBy'] = this.cookiesService.getCookieItem('adminName');
        if (targetObj['createdBy'] == '' || targetObj['createdBy'] == null || targetObj['createdBy'] == undefined) {
          targetObj['createdBy'] = this.cookiesService.getCookieItem('clientName');
        }

        //save target details 
        targetObj['clientId'] = this.fedexClientId;

        targetObj['type'] = 'Current';
        targetObj['agreementNo'] = this.agreementNo;
        // targetObj['year'] = this.agreementYear;
        // await this.httpClientService.saveOrUpdateAgreementNoDetails(targetObj).toPromise().then(res => {
        //   this.isSaved = true;
        // }).catch((err) => {
        //   console.log(err);
        //   this.closeLoading();
        // });

        await this.fedexService.saveOrUpdateTargetDetails(targetObj).toPromise().then(res => {
          clientObj['targetId'] = res[0].targetId;
          this.isSaved = true;
        }).catch((err) => {
          console.log(err);
          this.closeLoading();
        });

      }
    }




    if (this.buttonName == 'Generate' && this.type.toLowerCase() == 'edit') {
      if (this.airDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.airDeleteList);
      if (this.groundDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.groundDeleteList);
      if (this.intlDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.intlDeleteList);
      if (this.hwtDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.hwtDeleteList);
    }
    else if (this.buttonName == 'Generate' && this.type.toLowerCase() == 'create' && this.currentAgreement) {

      if (this.airDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.airDeleteList);
      if (this.groundDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.groundDeleteList);
      if (this.intlDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.intlDeleteList);
      if (this.hwtDeleteList.length > 0) await this.deleteRowFRTRatesheet(this.hwtDeleteList);
    }
    else if (this.buttonName == 'Generate' && this.type.toLowerCase() == 'create' && !this.currentAgreement) {
      this.airDeleteList.forEach((data: any) => {
        var rowIndex = this.airDiscountsList.findIndex((listData: any) => listData.frtRatesheetId == data.frtRatesheetId);
        this.airDiscountsList.splice(rowIndex, 1);
      });

      this.groundDeleteList.forEach((data: any) => {
        var rowIndex = this.groundDiscountsList.findIndex((listData: any) => listData.frtRatesheetId == data.frtRatesheetId);
        this.groundDiscountsList.splice(rowIndex, 1);
      });

      this.intlDeleteList.forEach((data: any) => {
        var rowIndex = this.intlDiscountsList.findIndex((listData: any) => listData.frtRatesheetId == data.frtRatesheetId);
        this.intlDiscountsList.splice(rowIndex, 1);
      });

      this.hwtDeleteList.forEach((data: any) => {
        var rowIndex = this.hwtDiscountsList.findIndex((listData: any) => listData.frtRatesheetId == data.frtRatesheetId);
        this.hwtDiscountsList.splice(rowIndex, 1);
      });
    }

    if (this.buttonName == 'Generate') {

      //air
      for (let index = this.airDiscountsListNew.length; index < this.airDiscountsList.length; index++) {
        this.airDiscountsList[index].frtRatesheetId = 0;
      }
      if (this.type.toLowerCase() == 'edit') {
        for (let index = 0; index < this.airDiscountsList.length; index++) {
          if (JSON.stringify(this.airDiscountsListNew[index]) !== JSON.stringify(this.airDiscountsList[index])) {
            this.airDiscountsList[index].targetId = clientObj['targetId'];
            this.airDiscountsList[index].type = "future";
            alteredList.push(Object.assign({}, this.airDiscountsList[index]));
          }
        }
      }
      else {
        for (let index = 0; index < this.airDiscountsList.length; index++) {

          if (!this.currentAgreement) {
            this.airDiscountsList[index].frtRatesheetId = 0;
            this.airDiscountsList[index].type = "future";
          }
          else {
            this.airDiscountsList[index].type = "old";
          }
          this.airDiscountsList[index].targetId = clientObj['targetId'];
          alteredList.push(this.airDiscountsList[index]);
        }
      }

      //ground
      for (let index = this.groundDiscountsListNew.length; index < this.groundDiscountsList.length; index++) {
        this.groundDiscountsList[index].frtRatesheetId = 0;
      }
      if (this.type.toLowerCase() == 'edit') {
        for (let index = 0; index < this.groundDiscountsList.length; index++) {
          if (JSON.stringify(this.groundDiscountsListNew[index]) !== JSON.stringify(this.groundDiscountsList[index])) {
            this.groundDiscountsList[index].type = "future";
            this.groundDiscountsList[index].targetId = clientObj['targetId'];
            alteredList.push(Object.assign({}, this.groundDiscountsList[index]));
          }
        }
      }
      else {
        for (let index = 0; index < this.groundDiscountsList.length; index++) {

          if (!this.currentAgreement) {
            this.groundDiscountsList[index].frtRatesheetId = 0;
            this.groundDiscountsList[index].type = "future";
          }
          else {
            this.groundDiscountsList[index].type = "old";
          }
          this.groundDiscountsList[index].targetId = clientObj['targetId'];
          alteredList.push(this.groundDiscountsList[index]);
        }
      }

      //intl
      for (let index = this.intlDiscountsListNew.length; index < this.intlDiscountsList.length; index++) {
        this.intlDiscountsList[index].frtRatesheetId = 0;
      }

      if (this.type.toLowerCase() == 'edit') {
        for (let index = 0; index < this.intlDiscountsList.length; index++) {
          if (JSON.stringify(this.intlDiscountsListNew[index]) !== JSON.stringify(this.intlDiscountsList[index])) {
            this.intlDiscountsList[index].type = "future";
            this.intlDiscountsList[index].targetId = clientObj['targetId'];
            alteredList.push(Object.assign({}, this.intlDiscountsList[index]));
          }
          if (this.intlDiscountsList[index].countryCode != "" && this.intlDiscountsList[index].countryCode != null) {
            let zone = this.intlDiscountsList[index].zone1;
            let countryCode = this.intlDiscountsList[index].countryCode;
            this.intlDiscountsList[index].countryCode = zone;
            this.intlDiscountsList[index].zone1 = countryCode;
          }
        }
      }
      else {
        for (let index = 0; index < this.intlDiscountsList.length; index++) {
          if (!this.currentAgreement) {
            this.intlDiscountsList[index].frtRatesheetId = 0;
            this.intlDiscountsList[index].type = "future";
          }
          else {
            this.intlDiscountsList[index].type = "old";
          }
          if (this.intlDiscountsList[index].countryCode != "" && this.intlDiscountsList[index].countryCode != null) {
            let zone = this.intlDiscountsList[index].zone1;
            let countryCode = this.intlDiscountsList[index].countryCode;
            this.intlDiscountsList[index].countryCode = zone;
            this.intlDiscountsList[index].zone1 = countryCode;
          }
          this.intlDiscountsList[index].targetId = clientObj['targetId'];
          alteredList.push(this.intlDiscountsList[index]);
        }
      }

      //Freight save api  
      if (this.type.toLowerCase() == 'edit') {
        clientObj['carrierName'] = this.carrierName;
        if (this.carrier.toLowerCase() == 'ups') {

          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.httpClientService.saveOrUpdateDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {
          clientObj['clientId'] = this.fedexClientId;

          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.fedexService.saveOrUpdateDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }

      if (this.type.toLowerCase() == 'create') {
        clientObj['carrierName'] = this.carrierName;

        if (this.carrier.toLowerCase() == 'ups') {
          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.httpClientService.saveOrUpdateDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {
          clientObj['clientId'] = this.fedexClientId;;
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.fedexService.saveOrUpdateDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }

      //HWT
      for (let index = this.hwtDiscountsListNew.length; index < this.hwtDiscountsList.length; index++) {
        this.hwtDiscountsList[index].frtRatesheetId = 0;
      }
      alteredList = [];
      if (this.type.toLowerCase() == 'edit') {
        for (let index = 0; index < this.hwtDiscountsList.length; index++) {
          if (JSON.stringify(this.hwtDiscountsListNew[index]) !== JSON.stringify(this.hwtDiscountsList[index])) {
            this.hwtDiscountsList[index].targetId = clientObj['targetId'];
            this.hwtDiscountsList[index].type = "future";
            alteredList.push(Object.assign({}, this.hwtDiscountsList[index]));
          }
        }
      }
      else {
        for (let index = 0; index < this.hwtDiscountsList.length; index++) {
          if (!this.currentAgreement) {
            this.hwtDiscountsList[index].frtRatesheetId = 0;
            this.hwtDiscountsList[index].type = "future";
          }
          else {
            this.hwtDiscountsList[index].type = "old";
          }

          this.hwtDiscountsList[index].targetId = clientObj['targetId'];
          alteredList.push(this.hwtDiscountsList[index]);
        }
      }

      //hwt save api
      if (this.type.toLowerCase() == 'edit') {
        clientObj['carrierName'] = this.carrierName;
        if (this.carrier.toLowerCase() == 'ups') {
          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.httpClientService.saveOrUpdateDiscountsHWT(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {
          clientObj['clientId'] = this.fedexClientId;
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;

          await this.fedexService.saveOrUpdateDiscountsHWT(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }

      if (this.type.toLowerCase() == 'create' && this.buttonName == 'Generate') {
        clientObj['carrierName'] = this.carrierName;
        if (this.carrier.toLowerCase() == 'ups') {

          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.httpClientService.saveOrUpdateDiscountsHWT(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {
          clientObj['clientId'] = this.fedexClientId;
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['freightDetailsList'] = alteredList;
          await this.fedexService.saveOrUpdateDiscountsHWT(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }

      delete clientObj['freightDetailsList'];


      if (this.buttonName == 'Generate') {

        if (this.type.toLowerCase() == 'create') {
          this.hwtAccountNumbersList.forEach((data: any) => {
            if (!this.currentAgreement) {
              data.accountId = 0;
            }

            data.targetId = clientObj['targetId'];
            data.type = 'Target';
          });
        }
        else {
          this.hwtAccountNumbersList.forEach((data: any) => {
            data.targetId = clientObj['targetId'];
            data.type = 'Target';
          });
        }
        clientObj['accNoDetailsList'] = this.hwtAccountNumbersList;

        if (this.carrierName.toLowerCase() == 'fedex') {
          await this.fedexService.saveOrUpdateAccountNumber(clientObj).toPromise();
        }
        else {
          await this.httpClientService.saveOrUpdateAccountNumber(clientObj).toPromise();
        }
      }

      delete clientObj['accNoDetailsList'];

      //dim
      for (let index = this.dimFactorListNew.length; index < this.dimDuplicateList.length; index++) {
        this.dimFactorList[index] = {};
        this.dimDuplicateList[index].dimDetailid = 0;
        this.dimFactorList[index] = Object.assign({}, this.dimDuplicateList[index]);
      }
      alteredList = [];
      if (this.type.toLowerCase() == 'edit') {
        for (let index = 0; index < this.dimFactorList.length; index++) {
          delete this.dimFactorList[index]['color'];
          delete this.dimFactorList[index]['deleteIcon'];
          if (JSON.stringify(this.dimFactorListNew[index]) !== JSON.stringify(this.dimFactorList[index])) {
            this.dimFactorList[index].targetId = clientObj['targetId'];
            alteredList.push(Object.assign({}, this.dimFactorList[index]));
          }
        }
      }
      else {
        for (let index = 0; index < this.dimFactorList.length; index++) {
          if (!this.currentAgreement) {
            this.dimFactorList[index].dimDetailid = 0;
          }

          this.dimFactorList[index].targetId = clientObj['targetId'];
          alteredList.push(this.dimFactorList[index]);
        }
      }

      //dim save api
      if (this.type.toLowerCase() == 'edit') {
        clientObj['carrierName'] = this.carrierName;
        if (this.carrier.toLowerCase() == 'ups') {
          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['dimDetailsList'] = alteredList;

          this.httpClientService.saveOrUpdateDIM(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {
          clientObj['clientId'] = this.fedexClientId;
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['dimDetailsList'] = alteredList;
          this.fedexService.saveOrUpdateDIM(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }


      if (this.type.toLowerCase() == 'create' && this.buttonName == 'Generate') {
        clientObj['carrierName'] = this.carrierName;
        if (this.currentAgreement) {
          clientObj['runType'] = "Dashboard";
          clientObj['type'] = 'Current';
        }
        if (this.carrier.toLowerCase() == 'ups') {
          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['dimDetailsList'] = alteredList;

          this.dimTable = await this.httpClientService.saveOrUpdateDIM(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });

        }
        else {
          clientObj['clientId'] = this.fedexClientId;
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['dimDetailsList'] = alteredList;

          this.dimTable = await this.fedexService.saveOrUpdateDIM(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }

      delete clientObj['dimDetailsList'];

      //Accessorial
      for (let index = this.accessorialDiscountListNew.length; index < this.accessorialDiscountList.length; index++) {
        this.accessorialDiscountList[index].accRatesheetId = 0;

      }

      alteredList = [];

      if (this.type.toLowerCase() == 'edit') {
        for (let index = 0; index < this.accessorialDiscountList.length; index++) {
          if (JSON.stringify(this.accessorialDiscountListNew[index]) !== JSON.stringify(this.accessorialDiscountList[index])) {
            this.accessorialDiscountList[index].targetId = clientObj['targetId'];
            this.accessorialDiscountList[index].targetDis = (this.accessorialDiscountList[index].targetDisType == '$') ? this.accessorialDiscountList[index].targetDis : (Number(this.accessorialDiscountList[index].targetDis) / 100).toFixed(4);
            alteredList.push(Object.assign({}, this.accessorialDiscountList[index]));
          }
        }
      }
      else {
        for (let index = 0; index < this.accessorialDiscountList.length; index++) {
          if (!this.currentAgreement) {
            this.accessorialDiscountList[index].accRatesheetId = 0;
          }

          this.accessorialDiscountList[index].targetId = clientObj['targetId'];
          this.accessorialDiscountList[index].targetDis = (this.accessorialDiscountList[index].targetDisType == '$') ? this.accessorialDiscountList[index].targetDis : (Number(this.accessorialDiscountList[index].targetDis) / 100).toFixed(4);
          alteredList.push(this.accessorialDiscountList[index]);
        }
      }

      //save api for accessorial
      if (this.type.toLowerCase() == 'edit') {
        clientObj['carrierName'] = this.carrierName;
        if (this.carrier.toLowerCase() == 'ups') {
          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['accDetailsList'] = alteredList;
          this.httpClientService.saveOrUpdateAccDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {
          clientObj['clientId'] = this.fedexClientId;
          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['accDetailsList'] = alteredList;
          this.fedexService.saveOrUpdateAccDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }
      if (this.type.toLowerCase() == 'create' && this.buttonName == 'Generate') {
        clientObj['carrierName'] = this.carrierName;

        if (this.currentAgreement) {
          clientObj['type'] = 'Current';
        }

        if (this.carrier.toLowerCase() == 'ups') {

          clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');


          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['accDetailsList'] = alteredList;
          await this.httpClientService.saveOrUpdateAccDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
        else {

          clientObj['clientId'] = this.fedexClientId;

          clientObj['clientName'] = this.carrierDetails.clientName;
          for (let index = 0; index < alteredList.length; index++) {
            alteredList[index].clientId = clientObj['clientId'];
          }
          clientObj['accDetailsList'] = alteredList;
          await this.fedexService.saveOrUpdateAccDiscounts(clientObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }
    }
    var type: any = "";
    if (this.buttonName == 'Generate') {
      if (this.carrier.toLowerCase() == 'ups') {
        var targetObj: any = {};
        targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
        targetObj['targetId'] = (this.type.toLowerCase() == 'edit') ? Number(this.targetDetails.targetId) : clientObj['targetId'];
        targetObj['carrierName'] = this.carrierName;
        if (!this.currentAgreement) {
          targetObj['type'] = this.type;
        }
        else {
          targetObj['type'] = 'Current';
        }

        if (this.currentAgreement && this.dimChanged) {
          type = true;
        }
        else {
          type = await this.httpClientService.generateProposal(targetObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }
      else {
        var targetObj: any = {};
        targetObj['clientId'] = this.fedexClientId;;
        targetObj['targetId'] = (this.type.toLowerCase() == 'edit') ? Number(this.targetDetails.targetId) : clientObj['targetId'];
        targetObj['carrierName'] = this.carrierName;
        if (!this.currentAgreement) {
          targetObj['type'] = this.type;
        }
        else {
          targetObj['type'] = 'Current';
        }
        if (this.currentAgreement && this.dimChanged) {
          type = true;
        }
        else {
          type = await this.fedexService.generateProposal(targetObj).toPromise().catch((err) => {
            console.log(err);
            this.closeLoading();
          });
        }
      }
      this.closeLoading();
      if (this.type.toLowerCase() == 'edit') {
        this.openSaveAlert(type, this.targetDetails.targetId);
      }
      else {
        this.openSaveAlert(type, clientObj['targetId']);
      }
    }
    if (this.canIncrease) {
      this.canIncrease = false;
      if (this.nextBtnShow < 4) {
        this.nextBtnShow = this.nextBtnShow + 1;
        this.buttonName = "Next";
        this.submitClicked.set(false);
      }
      else if (this.nextBtnShow == 4) {
        this.nextBtnShow = this.nextBtnShow + 1;
        this.buttonName = "Generate";
        this.submitClicked.set(false);
      }
      else if (this.nextBtnShow == 5) {
        this.nextBtnShow = 0;
        this.buttonName = "Next";
        this.submitClicked.set(false);
      }

      setTimeout(() => {
        this.canIncrease = true;
      }, 1);
    }
  }
  onTabChange(event: any) {
    this.nextBtnShow = event.index;
    if (event.index == 5)
      this.buttonName = "Generate";
    else
      this.buttonName = "Next";
  }

  async openSaveAlert(type: any, targetDetails: any) {
    let panelClass = '';
    if (this.themeOption == "dark") {
      panelClass = 'page-dark';
    }

    var message;
    if (type == false) {
      message = "Oops something went wrong!";
    }
    else {
      if (this.type.toLowerCase() == "create") {
        message = "Agreement generated successfully";
      }
      else {
        message = "Agreement updated successfully";
      }
    }

    var resetDialog = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { pageValue: message },
    });

    resetDialog.afterClosed().subscribe(
      () => {
        var data = { delete: false, target: (this.currentAgreement) ? 'Current' : targetDetails, dim: (this.dimChanged) ? this.dimTable[0] : undefined, anyChange: this.isAnythingChanged, agreementNo: this.agreementNoDuplicate, saved: this.isSaved, dimList: this.dimFactorList }
        this.dialogRef.close(data);
      });
  }

  async removeNewService(rowIndex: any, gridName: any) {

    if (gridName == "air") {
      if (this.distinctAirList[rowIndex].isNewRow == undefined) {
        var service = this.distinctAirList.splice(rowIndex, 1);
        var alteredList = this.airDiscountsList.filter((data: any) => data.subGroup == service[0].subGroup && data.weightFrom == this.airMinMaxList[rowIndex].minWeight && data.weightTo == this.airMinMaxList[rowIndex].maxWeight);
        alteredList.forEach((data: any) => this.airDeleteList.push(Object.assign({}, data)));
        this.airMinMaxList.splice(rowIndex, 1);
      }
      else {
        this.airMinMaxList.splice(rowIndex, 1);
        var service = this.distinctAirList.splice(rowIndex, 1);
        var rowIndexNew = this.distinctAirListNew.findIndex((data: any) => data.frtRatesheetId == service[0].frtRatesheetId);
        this.distinctAirListNew.splice(rowIndexNew, 1);
        if (service.subGroup != '' && service.subGroup != undefined) {
          await this.insertNewRow('air');
        }
      }

      this.dataSourceAir = new MatTableDataSource(this.distinctAirList);
      this.dataSourceAirSignal.set(this.dataSourceAir);
      this.airDiscountsLength -= 1;
    }
    else if (gridName == "DomesticGround") {

      if (this.distinctGroundList[rowIndex].isNewRow == undefined) {
        var service = this.distinctGroundList.splice(rowIndex, 1);
        var alteredList = this.groundDiscountsList.filter((data: any) => data.subGroup == service[0].subGroup && data.weightFrom == this.groundMinMaxList[rowIndex].minWeight && data.weightTo == this.groundMinMaxList[rowIndex].maxWeight);
        alteredList.forEach((data: any) => this.groundDeleteList.push(Object.assign({}, data)));
        this.groundMinMaxList.splice(rowIndex, 1);
      }
      else {
        this.groundMinMaxList.splice(rowIndex, 1);
        var service = this.distinctGroundList.splice(rowIndex, 1);
        var rowIndexNew = this.distinctGroundListNew.findIndex((data: any) => data.frtRatesheetId == service[0].frtRatesheetId);
        this.distinctGroundListNew.splice(rowIndexNew, 1);
        if (service.subGroup != '' && service.subGroup != undefined) {
          await this.insertNewRow('ground');
        }
      }
      this.setRowSpan();
      this.dataSourceGround = new MatTableDataSource(this.distinctGroundList);
      this.dataSourceGroundSignal.set(this.dataSourceGround)
      this.groundDiscountsLength -= 1;

    }
    else if (gridName == "DomesticIntl") {


      if (this.distinctIntlList[rowIndex].isNewRow == undefined) {
        var service = this.distinctIntlList.splice(rowIndex, 1);
        var alteredList = this.intlDiscountsList.filter((data: any) => data.subGroup == service[0].subGroup && data.weightFrom == this.intlMinMaxList[rowIndex].minWeight && data.weightTo == this.intlMinMaxList[rowIndex].maxWeight);
        alteredList.forEach((data: any) => this.intlDeleteList.push(Object.assign({}, data)));
        this.intlMinMaxList.splice(rowIndex, 1);
      }
      else {
        this.intlMinMaxList.splice(rowIndex, 1);
        var service = this.distinctIntlList.splice(rowIndex, 1);
        var rowIndexNew = this.distinctIntlListNew.findIndex((data: any) => data.frtRatesheetId == service[0].frtRatesheetId);
        this.distinctIntlListNew.splice(rowIndexNew, 1);
        if (service.subGroup != '' && service.subGroup != undefined) {
          await this.insertNewRow('intl');
        }
      }

      this.dataSourceIntl = new MatTableDataSource(this.distinctIntlList);
      this.dataSourceIntlSignal.set(this.dataSourceIntl);
      this.intlDiscountsLength -= 1;
    }
    else if (gridName == "HundredWeight") {

      if (this.distinctHWTList[rowIndex].isNewRow == undefined) {
        var service = this.distinctHWTList.splice(rowIndex, 1);
        var alteredList = this.hwtDiscountsList.filter((data: any) => data.subGroup == service[0].subGroup && data.weightFrom == this.hwtMinMaxList[rowIndex].minWeight && data.weightTo == this.hwtMinMaxList[rowIndex].maxWeight);
        alteredList.forEach((data: any) => this.hwtDeleteList.push(Object.assign({}, data)));
        this.hwtMinMaxList.splice(rowIndex, 1);
      }
      else {
        this.hwtMinMaxList.splice(rowIndex, 1);
        var service = this.distinctHWTList.splice(rowIndex, 1);
        var rowIndexNew = this.distinctHWTListNew.filter((data: any) => data.frtRatesheetId == service[0].frtRatesheetId);
        this.distinctHWTListNew.splice(rowIndexNew, 1);
        if (service.subGroup != '' && service.subGroup != undefined) {
          await this.insertNewRow('hwt');
        }
      }

      this.dataSourceHWT = new MatTableDataSource(this.distinctHWTList);
      this.dataSourceHWTSignal.set(this.dataSourceHWT);
      this.hwtDiscountsLength -= 1;

    }
    else if (gridName == "DIMservice") {
      if (this.dimFactorList[rowIndex].isNewRow == true) {
      } else {
        this.deleteRowDIM(this.dimFactorList[rowIndex]);
      }
      this.dimFactorList.splice(rowIndex, 1);
      this.dimDuplicateList.splice(rowIndex, 1);
      this.dataSourceDIM = new MatTableDataSource(this.dimFactorList);
      this.dataSourceDIMSignal.set(this.dataSourceDIM);
    }
    else if (gridName == "Accessorial") {
      let accRatesheetId = this.distinctAccList[rowIndex].accRatesheetId;
      this.distinctAccList.splice(rowIndex, 1);
      this.accMinMaxList.splice(rowIndex, 1);
      this.accessorialDiscountList = this.accessorialDiscountList.filter((data: any) => data.accRatesheetId != accRatesheetId);
      this.dataSourceAcc = new MatTableDataSource(this.distinctAccList);
      this.dataSourceAccSignal.set(this.dataSourceAcc);
      this.accessorialLength -= 1;
      //now, we have to validate all other newly added rows
      let filteredService: any = [];
      this.distinctAccList.filter((data: any, index: any) => { //get the index of the newly added rows and push it into filteredService array
        if (data.isNewRow != undefined) {
          filteredService.push(index);
        }
      });
      for (let index in filteredService) {//loop the array list,with each index, get the service and check if service is already available
        let AccId = filteredService[index]
        let filteredAcc = this.distinctAccList.filter((data: any, id: any) => id != AccId && data.rowNumber == undefined);
        let availableServices = this.getUniqueService(filteredAcc, 'service');
        let currentService = this.distinctAccList[AccId].service;
        if (availableServices.includes(currentService)) {
          this.distinctAccList[AccId].rowNumber = AccId;
        }
        else {
          this.distinctAccList[AccId].rowNumber = undefined;
        }
      }
      let row = this.distinctAccList.findIndex((data: any) => data.rowNumber != undefined);
      if (row == -1) {
        this.isAccServiceAvailable = false;
      }
    }
  }

  async close() {
    await this.checkAnyChanges();
    if (this.isAnythingChanged == true) {
      let panelClass = '';
      if (this.themeOption == "dark") {
        panelClass = 'page-dark';
      }
      this.resetDialog = this.dialog.open(ResetPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        panelClass: panelClass,
        data: { message: "Are you sure you want to close?" }
      });
      this.resetDialog.afterClosed().subscribe(
        data => {
          if (data == true) {
            this.dialogRef.close({ target: this.targetDetails.targetId, agreementNo: this.agreementNoDuplicate, saved: this.isSaved });
          }
        });
    }
    else {
      this.dialogRef.close();
    }
  }

  columns = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  changeCubicInch(event: any, rowIndex: any, columnName: any) {
    this.dimFactorList[rowIndex][columnName] = event.target.value;
  }

  async setMinMax(type: any) {
    var minMaxList = "";
    var serviceList = "";
    var tableList = "";
    if (type == 'air') {
      minMaxList = 'airMinMaxList';
      serviceList = 'airDiscountsList';
      tableList = 'distinctAirList';
    }
    else if (type == 'ground') {
      minMaxList = 'groundMinMaxList';
      serviceList = 'groundDiscountsList';
      tableList = 'distinctGroundList';
    }
    else if (type == 'intl') {
      minMaxList = 'intlMinMaxList';
      serviceList = 'intlDiscountsList';
      tableList = 'distinctIntlList';
    }
    else if (type == 'hwt') {
      minMaxList = 'hwtMinMaxList';
      serviceList = 'hwtDiscountsList';
      tableList = 'distinctHWTList';
    }
    (this as any)[minMaxList] = [];
    var services = await (this as any)[serviceList];
    var distinctServices = (type == 'ground') ? (this as any)[tableList] : this.getUniqueService((this as any)[tableList], 'subGroup');
    for (let index = 0; index < distinctServices.length; index++) {

      if (type == 'ground') {
        var filteredService = services.filter((data: any) => data.subGroup == distinctServices[index].subGroup && data.weightFrom == distinctServices[index].weightFrom && data.weightTo == distinctServices[index].weightTo);
      }
      else {
        var filteredService = services.filter((data: any) => data.subGroup == distinctServices[index]);
      }
      // var distinctWeights = this.getUniqueService(filteredService, 'subGroup');

      if (filteredService[0] != undefined) {

        var minMax = {
          minWeight: filteredService[0].weightFrom,
          maxWeight: filteredService[0].weightTo,
          disMin: filteredService[0].targetDis,
          disMax: filteredService[0].targetDis,
          amountMin: filteredService[0].targetMin,
          amountMax: filteredService[0].targetMin,
          netMinimumMin: filteredService[0].netMinimum,
          netMinimumMax: filteredService[0].netMinimum,
        };

        for (let row = 0; row < filteredService.length; row++) {
          //discount
          if (Number(minMax.disMin) >= Number(filteredService[row].targetDis)) {
            minMax.disMin = Number(filteredService[row].targetDis).toFixed(2);
          }
          if (Number(minMax.disMax) <= Number(filteredService[row].targetDis)) {
            minMax.disMax = Number(filteredService[row].targetDis).toFixed(2);
          }

          //min Reduction
          if (Number(minMax.amountMin) >= Number(filteredService[row].targetMin)) {
            minMax.amountMin = Number(filteredService[row].targetMin).toFixed(2);
          }
          if (Number(minMax.amountMax) <= Number(filteredService[row].targetMin)) {
            minMax.amountMax = Number(filteredService[row].targetMin).toFixed(2);
          }

          //weight
          if (Number(minMax.minWeight) >= Number(filteredService[row].weightFrom)) {
            minMax.minWeight = Number(filteredService[row].weightFrom).toFixed(0);
          }
          if (Number(minMax.maxWeight) <= Number(filteredService[row].weightTo)) {
            minMax.maxWeight = Number(filteredService[row].weightTo).toFixed(0);
          }

          //Net Minimum
          if (Number(minMax.netMinimumMin) >= Number(filteredService[row].netMinimum)) {
            minMax.netMinimumMin = Number(filteredService[row].netMinimum).toFixed(2);
          }
          if (Number(minMax.netMinimumMax) <= Number(filteredService[row].netMinimum)) {
            minMax.netMinimumMax = Number(filteredService[row].netMinimum).toFixed(2);
          }
        }

        (this as any)[minMaxList][index] = {
          service: (type == 'ground') ? distinctServices[index].subGroup : distinctServices[index],
          disMin: minMax.disMin,
          disMax: minMax.disMax,
          amountMin: minMax.amountMin,
          amountMax: minMax.amountMax,
          minWeight: minMax.minWeight,
          maxWeight: minMax.maxWeight,
          netMinimumMin: minMax.netMinimumMin,
          netMinimumMax: minMax.netMinimumMax,
          // minTier: minMax.minTier,
          // maxTier: minMax.maxTier,
        }
      }
    }
  }

  async setMinMaxHWT() {

    var services = this.hwtAccountNumbersList;


    for (let index = 0; index < this.distinctHWTList.length; index++) {


      this.hwtMinMaxList[index].amountMin = Number(this.hwtMinMaxList[index].amountMin);
      this.hwtMinMaxList[index].amountMax = Number(this.hwtMinMaxList[index].amountMax);

      var filteredService = services.filter((data: any) => {
        return data.ratesheetName == this.distinctHWTList[index].ratesheetName;
      });

      if (filteredService[0] != undefined) {

        var minMax = {
          minTier: filteredService[0].hwtTier,
          maxTier: filteredService[0].hwtTier,
        };

        for (let row = 0; row < filteredService.length; row++) {

          //tier
          if (Number(minMax.minTier) >= Number(filteredService[row].hwtTier)) {
            minMax.minTier = filteredService[row].hwtTier;
          }
          if (Number(minMax.maxTier) <= Number(filteredService[row].hwtTier)) {
            minMax.maxTier = filteredService[row].hwtTier;
          }
        }

        this.hwtMinMaxList[index].amountMin = minMax.minTier;
        this.hwtMinMaxList[index].amountMax = minMax.maxTier;
      }
      else {
        this.hwtMinMaxList[index].amountMin = this.distinctHWTList[index].hwtTier;
        this.hwtMinMaxList[index].amountMax = this.distinctHWTList[index].hwtTier;
      }
    }
  }

  async setAccMinMax() {

    this.accMinMaxList = [];
    var accServices = await this.accessorialDiscountList;

    let newrowList = accServices.filter((acc: any) => acc.isNewRow != undefined);

    var unsortedList = this.getUniqueService(accServices.filter((acc: any) => acc.isNewRow == undefined), 'service');
    var distinctServices = unsortedList.sort((a: any, b: any) => a.localeCompare(b));

    for (let index = 0; index < distinctServices.length; index++) {
      var filteredService = accServices.filter((data: any) => data.service == distinctServices[index]);

      var minMax = {
        disMin: '999999999999',
        disMax: '-99999999999',
      };

      for (let row = 0; row < filteredService.length; row++) {
        if (Number(minMax.disMin) >= Number(filteredService[row].targetDis)) {
          minMax.disMin = Number(filteredService[row].targetDis).toFixed(2);
        }
        if (Number(minMax.disMax) <= Number(filteredService[row].targetDis)) {
          minMax.disMax = Number(filteredService[row].targetDis).toFixed(2);
        }
      }

      this.accMinMaxList[index] = {
        service: distinctServices[index],
        disMin: minMax.disMin,
        disMax: minMax.disMax,
      }
    }

    for (let index = 0; index < newrowList.length; index++) {
      this.accMinMaxList.push({
        service: '',
        disMin: newrowList[index].targetDis,
        disMax: newrowList[index].targetDis,
      });
    }
  }

  getUniqueService(data: any, type: any) {
    let distinctValues: any = [];
    const arrayUniqueByService = [...new Map(data.map((item: any) =>
      [item[type], item])).values()];

    arrayUniqueByService.forEach((data: any) => {
      distinctValues.push(data[type]);
    });
    return distinctValues;
  }

  previousNumber: string = "";
  onProposalNameChange() {
    var text = this.proposalName.match(/[A-Z]/gi);
    if (text != null && this.proposalNickName == '') {
      this.proposalNickName = this.proposalNickName + text[0].toUpperCase();
    }
    var numbers = this.proposalName.match(/(\d+)/);
    var proposalNickNameNumber = this.proposalNickName.match(/(\d+)/);
    if (numbers != null && this.proposalName != '') {
      if (this.proposalNickName.length > 1 || text == null) {
        if (numbers[0].toString().length < 8) {
          var test = this.proposalNickName.replace(this.previousNumber, numbers[0].toString());
          this.proposalNickName = test;
          this.previousNumber = numbers[0].toString();
        }
      }
      else {
        this.proposalNickName = this.proposalNickName + numbers[0].toString();
        this.previousNumber = numbers[0].toString();
      }
    }
    else if (numbers == null && proposalNickNameNumber != null) {
      var test = this.proposalNickName.replace(this.previousNumber, '');
      this.proposalNickName = test;
    }
    if (this.proposalName == '') {
      this.proposalNickName = '';
    }
  }

  async onCarrierChange(event: any) {

    await this.resetAllList();
    this.carrierName = event;
    this.filteredScenario = this.targets.filter((data: any) => data.carrierName.toLowerCase() == this.carrierName.toLowerCase());
    if (this.carrier.toLowerCase() == this.carrierName.toLowerCase()) {
      this.targetDetails = '';
      this.filteredScenario.unshift(Object.assign({}, { targetId: 'current', targetName: 'Current Agreement' }));
      this.selectedId = 'current';
    }
    else {
      this.targetDetails = this.filteredScenario[0];
      this.selectedId = this.targetDetails.targetId;
    }
    await this.getData();
    await this.getHWTAccountsList();
    await this.setMinMaxHWT();
    await this.ExecMatSelctFunctions();
    await this.ExecDIMMatSelctFunctions();
    await this.setRowSpan();
    this.showDelete();
  }

  async resetAllList() {
    this.submitClicked.set(false);
    this.saveClicked = false;
    this.isAccServiceAvailable = false;
    this.distinctAirList = [];
    this.dataSourceAir = new MatTableDataSource();
    this.distinctGroundList = [];
    this.dataSourceGround = new MatTableDataSource();
    this.dataSourceGroundSignal.set(this.dataSourceGround)
    this.distinctIntlList = [];
    this.dataSourceIntl = new MatTableDataSource();
    this.dataSourceIntlSignal.set(this.dataSourceIntl);
    this.distinctHWTList = [];
    this.dataSourceHWT = new MatTableDataSource();
    this.dataSourceHWTSignal.set(this.dataSourceHWT);
    this.dimFactorList = [];
    this.dataSourceDIM = new MatTableDataSource();
    this.dataSourceDIMSignal.set(this.dataSourceDIM);
    this.accessorialDiscountList = [];
    this.distinctAccList = [];
    this.dataSourceAcc = new MatTableDataSource();
    this.airDiscountsList = [];
    this.airDiscountsListNew = [];
    this.groundDiscountsList = [];
    this.groundDiscountsListNew = [];
    this.intlDiscountsList = [];
    this.intlDiscountsListNew = [];
    this.hwtDiscountsList = [];
    this.hwtDiscountsListNew = [];
    this.accessorialDiscountListNew = [];
    this.spans = [];
  }


  storePreviousPercentage(event: any) {
    if (event.target.value.includes('-')) {
      event.target.value = '';
    }
    var keyCode;
    keyCode = event.charCode;
    if (event.target.value.includes(".")) {
      this.previousWholeNumber = event.target.value.split(".")[0];
      if (event.target.value.split(".").pop().replace('%', '').length < 3) {
        this.previousDecimalNumber = event.target.value.split(".").pop();
      }
    }
    if (keyCode == 46 || keyCode == 37 || keyCode == 8 || keyCode == 32 || (keyCode >= 48 && keyCode <= 57)) {
      if (event.target.value.includes(".") && keyCode == 46) {
        return false;
      }
      else if (event.target.value.includes("%") && keyCode == 37) {
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
    if (event.target.value.includes('-')) {
      return;
    }
    else {
      event.target.value = event.target.value.trim();
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
        return;
      }
    }
  }

  async insertNewRow(type: any) {
    let tableList = '';
    let minMaxList = '';
    if (type == 'air') {
      tableList = 'distinctAirList';
      minMaxList = 'airMinMaxList';
    }
    else if (type == 'ground') {
      tableList = 'distinctGroundList';
      minMaxList = 'groundMinMaxList';
    }
    else if (type == 'intl') {
      tableList = 'distinctIntlList';
      minMaxList = 'intlMinMaxList';
    }
    else {
      tableList = 'distinctHWTList';
      minMaxList = 'hwtMinMaxList';
    }

    for (let index = 0; index < (this as any)[tableList + 'New'].length; index++) {

      var newObject = (this as any)[tableList + 'New'][index];
      if (newObject.subGroup != '' && newObject.subGroup != undefined) {
        var filteredData: any = [];
        var serviceData = (this as any)[tableList].filter((data: any) => data.subGroup.toLowerCase() == newObject.subGroup.toLowerCase());
        serviceData.forEach((duplicateData: any) => filteredData.push(Object.assign({}, duplicateData)));
        var rowIndex = (this as any)[tableList].findIndex((data: any) => JSON.stringify(data) === JSON.stringify(filteredData[filteredData.length - 1]));
        var filteredMinMaxData = (this as any)[minMaxList].filter((data: any) => data.service.toLowerCase() == newObject.subGroup.toLowerCase());
        var minMaxObj = {
          service: newObject.subGroup,
          disMin: newObject.targetDis,
          disMax: newObject.targetDis,
          amountMin: newObject.targetMin,
          amountMax: newObject.targetMin,
          netMinimumMin: newObject.netMinimum,
          netMinimumMax: newObject.netMinimum,
          minWeight: Number(filteredMinMaxData[filteredMinMaxData.length - 1].maxWeight) + 1,
          maxWeight: (Number(newObject.weightTo) > (Number(filteredMinMaxData[filteredMinMaxData.length - 1].maxWeight) + 1)) ? newObject.weightTo : Number(filteredMinMaxData[filteredMinMaxData.length - 1].maxWeight) + 2
        }
        newObject.weightFrom = minMaxObj.minWeight;
        newObject.weightTo = minMaxObj.maxWeight;
        (this as any)[minMaxList].splice(rowIndex + 1, 0, minMaxObj);
        (this as any)[tableList].splice(rowIndex + 1, 0, newObject);
      }
      else {
        // var minMaxObj2: any = { service: '', disMin: '',
        //   disMax: '',
        //   amountMin: '',
        //   amountMax: '',
        //   minWeight: '',
        //   maxWeight: '',
        //   netMinimumMin: '',
        //   netMinimumMax: '',
        // }
        //   (this as any)[minMaxList].push(Object.assign({}, minMaxObj2));
        // (this as any)[tableList].push(Object.assign({}, newObject));
      }
    }
  }

  async onFreightChange(value: any, columnName: any, rowNumber: any, type: any) {

    let minType;

    if (value.includes('$')) {
      minType = '$';
    }
    else if (value.includes('%')) {
      minType = '%';
    }
    else {
      minType = '%';
    }

    let subGroup = '';
    let tableList = '';
    let listName = '';
    let minMaxList = '';
    let dataSource = '';
    let scrollContainer = '';

    if (type == 'air') {
      tableList = 'distinctAirList';
      listName = 'airDiscountsList';
      minMaxList = 'airMinMaxList';
      dataSource = 'dataSourceAir';
      scrollContainer = 'scrollContainer';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'ground') {
      tableList = 'distinctGroundList';
      listName = 'groundDiscountsList';
      minMaxList = 'groundMinMaxList';
      dataSource = 'dataSourceGround';
      scrollContainer = 'scrollContainerGround';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'intl') {
      tableList = 'distinctIntlList';
      listName = 'intlDiscountsList';
      minMaxList = 'intlMinMaxList';
      dataSource = 'dataSourceIntl';
      scrollContainer = 'scrollContainerIntl';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else {
      tableList = 'distinctHWTList';
      listName = 'hwtDiscountsList';
      minMaxList = 'hwtMinMaxList';
      dataSource = 'dataSourceHWT';
      scrollContainer = 'scrollContainerHWT';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }

    if (columnName != "subGroup") {
      if (Number(value.replace('%', '').replace('$', '')).toString() == 'NaN') {
        return false;
      }
    }

    //if condition for newly added rows
    if ((this as any)[tableList][rowNumber].isNewRow != undefined) {

      if (columnName == 'weightFrom' || columnName == 'weightTo' || columnName == 'minType' || columnName == 'hwtTier' || columnName == 'subGroup') {
        (this as any)[tableList][rowNumber][columnName] = value;
        if (columnName == 'weightFrom') {
          (this as any)[minMaxList][rowNumber].minWeight = value;
        }
        else if (columnName == 'weightTo') {
          (this as any)[minMaxList][rowNumber].maxWeight = value;
        }
        else if (columnName == 'minType' || columnName == 'hwtTier') {

          var filteredData = (this as any)[tableList].filter((data: any) => data.subGroup == (this as any)[tableList][rowNumber].subGroup);
          filteredData.forEach((data: any) => {
            data[columnName] = value;
          });

          var alteredObject = (this as any)[listName].filter(
            (data: any) => {
              return (data.subGroup == subGroup);
            });

          if (alteredObject.length > 0) {
            for (let row in alteredObject) {
              alteredObject[row][columnName] = value;
            }
          }
          if (columnName == 'hwtTier') {
            var filteredData: any = this.hwtAccountNumbersList.filter((data: any) => data.ratesheetName == (this as any)[tableList][rowNumber].ratesheetName);
            filteredData.forEach((data: any) => {
              data.hwtTier = value;
            })
          }
        }
        (this as any)[tableList][rowNumber][columnName] = value;
      }
      else {

        if (columnName == 'targetMin' || columnName == 'netMinimum') {

          var alteredObject = (this as any)[listName].filter((data: any) => {
            return (data.subGroup == subGroup);
          });
          alteredObject.forEach((element: any) => {
            element[columnName] = Number(value.replaceAll('$', '').replaceAll('%', '')).toFixed(2);
          });
          var filteredData = (this as any)[tableList].filter((data: any) => data.subGroup == (this as any)[tableList][rowNumber].subGroup);
          filteredData.forEach((data: any) => {
            data[columnName] = Number(value.replaceAll('$', '').replaceAll('%', '')).toFixed(2);
          });
        }
        (this as any)[tableList][rowNumber][columnName] = value.replace('$', '').replace('%', '');
      }

      if (columnName == 'subGroup') {

        var frtRatesheetId = (this as any)[tableList][rowNumber].frtRatesheetId;
        var rowIndex = (this as any)[tableList + 'New'].findIndex((data: any) => data.frtRatesheetId == frtRatesheetId);
        if (rowIndex != -1) {
          (this as any)[tableList + 'New'].splice(rowIndex, 1);
        }
        (this as any)[tableList + 'New'].push(Object.assign({}, (this as any)[tableList][rowNumber]));

        var newList = (this as any)[tableList].filter((data: any) => data.isNewRow != undefined);
        newList.forEach((service: any) => {
          let row = (this as any)[tableList].findIndex((data: any) => data.frtRatesheetId == service.frtRatesheetId);
          (this as any)[tableList].splice(row, 1);
          (this as any)[minMaxList].splice(row, 1);
        });

        await this.insertNewRow(type);
        this.spans = [];
        this.setRowSpan();
        (this as any)[dataSource] = new MatTableDataSource((this as any)[tableList]);
        this.filteredService.next(this.intlDiscountsListService.slice());

        var totalHeight = (this as any)[scrollContainer].scrollHeight;
        var height = totalHeight / (this as any)[tableList].length;
        var scrollIndex = (this as any)[tableList].findIndex((data: any) => data.frtRatesheetId == frtRatesheetId);
        (this as any)[scrollContainer].scroll({
          top: (height) * (scrollIndex - 1) - 70,
          left: 0,
          behavior: 'smooth'
        });
      }
      return;
    }
    else {

      var weightFrom = (this as any)[minMaxList][rowNumber].minWeight;
      var weightTo = (this as any)[minMaxList][rowNumber].maxWeight;

      if ((this as any)[tableList][rowNumber].frtRatesheetId != 0) {
        if (columnName != 'weightFrom' && columnName != 'weightTo' && columnName != 'hwtTier' && columnName != 'minType') {
          (this as any)[tableList][rowNumber][columnName] = value.replace('$', '').replace('%', '');
        }
        else {
          if (columnName == 'minType' || columnName == 'hwtTier') {
            var filteredData = (this as any)[tableList].filter((data: any) => data.subGroup == (this as any)[tableList][rowNumber].subGroup);
            filteredData.forEach((data: any) => {
              data[columnName] = value;
            });
            if (columnName == 'hwtTier') {
              var filteredData: any = this.hwtAccountNumbersList.filter((data: any) => data.ratesheetName == (this as any)[tableList][rowNumber].ratesheetName);
              filteredData.forEach((data: any) => {
                data.hwtTier = value;
              })
            }
          }
          else {
            (this as any)[tableList][rowNumber][columnName] = value;
            if (columnName == 'weightFrom') {
              (this as any)[minMaxList][rowNumber].minWeight = value;
            }
            else if (columnName == 'weightTo') {
              (this as any)[minMaxList][rowNumber].maxWeight = value;
            }
          }
        }
      }

      if (columnName == 'targetDis' || columnName == 'targetMin' || columnName == 'netMinimum') {

        var alteredObject = (this as any)[listName].filter((data: any) => {
          if (columnName == 'targetDis') {
            return (data.subGroup == subGroup && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
          }
          else {
            return (data.subGroup == subGroup);
          }
        });
        alteredObject.forEach((element: any) => {
          element[columnName] = Number(value.replaceAll('$', '').replaceAll('%', '')).toFixed(2);
        });

        if (columnName == 'netMinimum') {
          let netMin = Number(Number(value.replaceAll('$', '').replaceAll('%', '')).toFixed(2));
          alteredObject.forEach((obj: any) => {
            var lowestRate = Number(obj.lowestRate);
            if (obj.minType == '%') { //minType == '%'
              let targetMin = ((lowestRate - netMin) / lowestRate) * 100;

              var negative = false;
              if (targetMin < 0) {
                negative = true;
                targetMin = targetMin * -1;

              }
              var multiplicator = Math.pow(10, 2);
              targetMin = parseFloat((targetMin * multiplicator).toFixed(11));
              targetMin = Number((Math.round(targetMin) / multiplicator).toFixed(2));
              if (negative) {
                targetMin = Number((targetMin * -1).toFixed(2));
              }
              obj.targetMin = targetMin;
            }
            else {
              obj.targetMin = lowestRate - netMin;
            }
          });

          let minMax = {
            minTargetMin: alteredObject[0].targetMin,
            maxTargetMin: alteredObject[0].targetMin,
          };
          for (let row = 0; row < alteredObject.length; row++) {
            //min Reduction
            if (Number(minMax.minTargetMin) >= Number(alteredObject[row].targetMin)) {
              minMax.minTargetMin = Number(alteredObject[row].targetMin).toFixed(2);
            }
            if (Number(minMax.maxTargetMin) <= Number(alteredObject[row].targetMin)) {
              minMax.maxTargetMin = Number(alteredObject[row].targetMin).toFixed(2);
            }
          }
          var filteredData = (this as any)[minMaxList].filter((data: any) => data.service == (this as any)[minMaxList][rowNumber].service);
          filteredData.forEach((data: any) => {
            data.amountMax = minMax.maxTargetMin;
            data.amountMin = minMax.minTargetMin;
          });
        }
        if (columnName == 'targetMin') {
          let targetMin = Number(Number(value.replaceAll('$', '').replaceAll('%', '')).toFixed(2));
          alteredObject.forEach((element: any) => {
            var lowestRate = Number(element.lowestRate);
            if (element.minType == '%') {
              element.netMinimum = lowestRate - (lowestRate * (targetMin / 100));
            }
            else {
              element.netMinimum = lowestRate - targetMin;
            }
          });
          let minMax = {
            netMinimumMin: alteredObject[0].netMinimum,
            netMinimumMax: alteredObject[0].netMinimum,
          };
          for (let row = 0; row < alteredObject.length; row++) {
            //Net Minimum
            if (Number(minMax.netMinimumMin) >= Number(alteredObject[row].netMinimum)) {
              minMax.netMinimumMin = Number(alteredObject[row].netMinimum).toFixed(2);
            }
            if (Number(minMax.netMinimumMax) <= Number(alteredObject[row].netMinimum)) {
              minMax.netMinimumMax = Number(alteredObject[row].netMinimum).toFixed(2);
            }
          }
          var filteredData = (this as any)[minMaxList].filter((data: any) => data.service == (this as any)[minMaxList][rowNumber].service);
          filteredData.forEach((data: any) => {
            data.netMinimumMax = minMax.netMinimumMax;
            data.netMinimumMin = minMax.netMinimumMin;
          });
        }
      }
      else {
        var alteredObject = (this as any)[listName].filter(
          (data: any) => {
            if (columnName == 'weightFrom' || columnName == 'weightTo') {
              return (data.subGroup == subGroup && data.weightFrom == weightFrom && data.weightTo == weightTo);
            }
            else if (columnName == 'minType') {
              return (data.subGroup == subGroup);
            }
            else {
              return (data.subGroup == subGroup && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
            }
          });

        if (alteredObject.length > 0) {
          for (let row in alteredObject) {
            alteredObject[row][columnName] = value;
          }

          if (columnName == 'weightFrom') {
            (this as any)[minMaxList][rowNumber].minWeight = value;
          }
          else if (columnName == 'weightTo') {
            (this as any)[minMaxList][rowNumber].maxWeight = value;
          }
        }
      }
    }
    return false;
  }

  percentageFocusout(event: any, columnName: any, rowNumber: any, type: any): void {

    const value = event.target.value?.toString() || "";

    if (Number(value.replace('%', '').replace('$', '')).toString() == 'NaN') {
      return;
    }

    var minMaxList = "";
    var tableList = "";

    if (type == "air") {
      minMaxList = "airMinMaxList";
    }
    else if (type == "ground") {
      minMaxList = "groundMinMaxList";
    }
    else if (type == "intl") {
      minMaxList = "intlMinMaxList";
    }
    else {
      tableList = 'distinctHWTList';
    }

    if (minMaxList != "") {

      if (columnName == 'targetDis') {

        if (Number(value.replace('$', '').replace('%', '')) == 0) {
          (this as any)[minMaxList][rowNumber].disMax = "0";
          (this as any)[minMaxList][rowNumber].disMin = "0";
        }
        else {
          (this as any)[minMaxList][rowNumber].disMax = Number(value.replace('$', '').replace('%', ''));
          (this as any)[minMaxList][rowNumber].disMin = Number(value.replace('$', '').replace('%', ''));
        }

      }
      else if (columnName == 'targetMin') {

        var filteredData = (this as any)[minMaxList].filter((data: any) =>
          data.service == (this as any)[minMaxList][rowNumber].service
        );

        filteredData.forEach((data: any) => {
          data.amountMax = Number(value.replace('$', '').replace('%', ''));
          data.amountMin = Number(value.replace('$', '').replace('%', ''));
        });

      }
      else if (columnName == 'netMinimum') {

        var filteredData = (this as any)[minMaxList].filter((data: any) =>
          data.service == (this as any)[minMaxList][rowNumber].service
        );

        filteredData.forEach((data: any) => {
          data.netMinimumMax = Number(value.replace('$', '').replace('%', ''));
          data.netMinimumMin = Number(value.replace('$', '').replace('%', ''));
        });

      }

      return;
    }

    if (value.includes(".")) {

      let whole = value.split(".")[0];
      let decimalValue = value.split(".").pop()?.replace('%', '') || '';

      if (whole == '') {
        event.target.value = "0." + decimalValue + "%";
      }

      if (decimalValue == '') {
        event.target.value = whole + ".00%";
      }

    }

    if (!(value.includes("."))) {
      event.target.value = Number(value.replace('%', '')).toFixed(2);
    }

    if (!event.target.value.includes("%")) {
      event.target.value = event.target.value + "%";
    }

    if (event.target.value == "0.00%") {
      // this.onFreightChange(event.target.value, columnName, rowNumber, type);
    }

    if (type == 'hwt') {

      if ((this as any)[tableList][rowNumber].frtRatesheetId != 0) {

        if (columnName != 'weightFrom' && columnName != 'weightTo' && columnName != 'hwtTier' && columnName != 'minType') {

          (this as any)[tableList][rowNumber][columnName] =
            event.target.value.replace('$', '').replace('%', '');

        }
        else {

          (this as any)[tableList][rowNumber][columnName] =
            event.target.value;

        }

      }

    }

  }

  preventText(event: any, rowNumber: any, tableList: any, columnName: any) {

    var keyCode;
    keyCode = event.keyCode;

    if (columnName == 'hwtTier') {
      if (event.target.value.includes('-')) {
        event.target.value = '';
      }
    }

    if (columnName == 'targetMin') {
      if (((this as any)[tableList][rowNumber].minType == '$' && event.key == '%') || ((this as any)[tableList][rowNumber].minType == '%' && event.key == '$')) {
        return false;
      }
    }
    if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || keyCode == 8 || keyCode == 32 || keyCode == 109 || keyCode == 189 || keyCode == 37 || keyCode == 38 || keyCode == 39 || keyCode == 40 || keyCode == 46 || keyCode == 110 || keyCode == 190)
      return true;
    else
      return false;
  }
  onSpendFocusOut(event: any, columnName: any, subGroup: any, rowNumber: any, listName: any, tableList: any): void {

    const value = event.target?.value?.toString() || "";

    if (Number(value.replace('%', '').replace('$', '')).toString() == 'NaN') {
      return;
    }

    var minMaxList = "";

    if (listName == "airDiscountsList") {
      minMaxList = "airMinMaxList";
    }
    else if (listName == "groundDiscountsList") {
      minMaxList = "groundMinMaxList";
    }
    else if (listName == "intlDiscountsList") {
      minMaxList = "intlMinMaxList";
    }

    if (minMaxList != "") {

      if (columnName == 'targetDis') {

        (this as any)[minMaxList][rowNumber].disMax = Number(value.replace('$', '').replace('%', ''));
        (this as any)[minMaxList][rowNumber].disMin = Number(value.replace('$', '').replace('%', ''));

      }
      else if (columnName == 'targetMin') {

        var filteredData = (this as any)[minMaxList].filter((data: any) =>
          data.service == (this as any)[minMaxList][rowNumber].service
        );

        filteredData.forEach((data: any) => {
          data.amountMax = Number(value.replace('$', '').replace('%', ''));
          data.amountMin = Number(value.replace('$', '').replace('%', ''));
        });

      }
      else if (columnName == 'netMinimum') {

        var filteredData = (this as any)[minMaxList].filter((data: any) =>
          data.service == (this as any)[minMaxList][rowNumber].service
        );

        filteredData.forEach((data: any) => {
          data.netMinimumMax = Number(value.replace('$', '').replace('%', ''));
          data.netMinimumMin = Number(value.replace('$', '').replace('%', ''));
        });

      }

    }

    if (value.includes(".")) {

      let whole = value.split(".")[0];
      let decimalValue = value.split(".").pop()?.replace('$', '') || '';

      if (whole == '') {
        event.target.value = "$0." + decimalValue;
      }

      if (decimalValue == '') {
        event.target.value = "$" + whole + ".00";
      }

    }

    if (!(value.includes("."))) {
      event.target.value = Number(value.replace('$', '')).toFixed(2);
    }

    if (!event.target.value.includes("$")) {
      event.target.value = "$" + event.target.value;
    }

  }
  accPercentageFocusout(event: any, columnName: any, rowNumber: any, serviceName: any): void {

    const value = event.target?.value?.toString() || "";

    if (Number(value.replace('%', '').replace('$', '')).toString() == 'NaN') {
      return;
    }

    if (value.includes(".")) {

      let whole = value.split(".")[0];
      let decimalValue = value.split(".").pop()?.replace('%', '') || '';

      if (whole == '') {
        event.target.value = "0." + decimalValue + "%";
      }

      if (decimalValue == '') {
        event.target.value = whole + ".00%";
      }

    }

    if (!(value.includes("."))) {
      event.target.value = Number(value.replace('%', '').replace('$', '')).toFixed(2);
    }

    if ((!event.target.value.includes("%")) && this.distinctAccList[rowNumber].targetDisType == '%') {
      event.target.value = event.target.value + "%";
    }

    if (event.target.value == "0.00%") {
      this.onAccChange(event.target.value, columnName, rowNumber, serviceName);
    }

  }
  dimId: any = -1;
  async onChange(value: any, columnName: any, listName: any, rowNumber: any): Promise<void> {

    this.dimChanged = true;

    if (columnName != 'serviceGrouping') {

      value = value?.toString().replaceAll(',', '');

      if (Number.isNaN(Number(value))) {
        return;
      }

      var filteredData = this.dimDuplicateList.filter((data: any) =>
        data.serviceGrouping == this.dimDuplicateList[rowNumber].serviceGrouping
      );

      var currentId = filteredData.findIndex((data: any) =>
        data.dimDetailid == this.dimDuplicateList[rowNumber].dimDetailid
      );

      let beforeIndex: any;
      let currentIndex: any;
      let afterIndex: any;

      if (filteredData[currentId - 1] != undefined) {
        beforeIndex = this.dimDuplicateList.findIndex((data: any) =>
          data.dimDetailid == filteredData[currentId - 1].dimDetailid
        );
      }

      if (filteredData[currentId] != undefined) {
        currentIndex = this.dimDuplicateList.findIndex((data: any) =>
          data.dimDetailid == filteredData[currentId].dimDetailid
        );
      }

      if (filteredData[currentId + 1] != undefined) {
        afterIndex = this.dimDuplicateList.findIndex((data: any) =>
          data.dimDetailid == filteredData[currentId + 1].dimDetailid
        );
      }

      if (columnName == 'cubicInchFrom') {

        if (this.dimDuplicateList[beforeIndex] != undefined) {

          var cubicInchTo = this.dimDuplicateList[beforeIndex].cubicInchTo;

          if (cubicInchTo.toString().toLowerCase() == 'up') {

            this.dimDuplicateList[currentIndex][columnName] = Number(Number(value).toFixed(2));
            this.dimFactorList[currentIndex][columnName] = Number(Number(value).toFixed(2));

          }
          else {

            cubicInchTo = Number(cubicInchTo);

            if ((Number(value) <= cubicInchTo || Number(value) > (cubicInchTo + 0.1) || Number(value).toString() == 'NaN') && cubicInchTo != 0) {

              this.dimFactorList[currentIndex].cubicInchFrom = '';
              this.dimDuplicateList[currentIndex].cubicInchFrom = '';

              setTimeout(() => {
                this.dimDuplicateList[currentIndex][columnName] = Number(Number(cubicInchTo).toFixed(2)) + 0.1;
                this.dimFactorList[currentIndex][columnName] = Number(Number(cubicInchTo).toFixed(2)) + 0.1;
              }, 0);

              this.dimId = rowNumber;

              setTimeout(() => {
                this.dimId = -1;
              }, 2000);

              return;
            }
            else {

              this.dimDuplicateList[currentIndex][columnName] = Number(Number(value).toFixed(2));
              this.dimFactorList[currentIndex][columnName] = Number(Number(value).toFixed(2));

            }

          }

        }
        else {

          if (Number(value).toFixed(2) == '0.00') {

            this.dimDuplicateList[currentIndex][columnName] = Number(Number(value).toFixed(2));
            this.dimFactorList[currentIndex][columnName] = Number(Number(value).toFixed(2));

          }
          else {

            this.dimFactorList[currentIndex].cubicInchFrom = '';
            this.dimDuplicateList[currentIndex].cubicInchFrom = '';

            setTimeout(() => {
              this.dimDuplicateList[currentIndex][columnName] = 0.00;
              this.dimFactorList[currentIndex][columnName] = 0.00;
            }, 0);

            this.dimId = rowNumber;

            setTimeout(() => {
              this.dimId = -1;
            }, 2000);

            return;
          }

        }

      }
      else if (columnName == 'cubicInchTo') {

        var cubicInchFrom = Number(Number(this.dimFactorList[currentIndex].cubicInchFrom).toFixed(2));

        if (value.toString().toLowerCase() == 'up') {

          this.dimDuplicateList[currentIndex][columnName] = value;
          this.dimFactorList[currentIndex][columnName] = value;

        }
        else {

          if (Number(value) <= cubicInchFrom) {

            this.dimFactorList[currentIndex][columnName] = '';
            this.dimDuplicateList[currentIndex][columnName] = '';

            setTimeout(() => {
              this.dimDuplicateList[currentIndex][columnName] = cubicInchFrom + 0.1;
              this.dimFactorList[currentIndex][columnName] = cubicInchFrom + 0.1;
            }, 0);

            this.dimId = rowNumber;

            setTimeout(() => {
              this.dimId = -1;
            }, 2000);

            return;

          }
          else {

            this.dimDuplicateList[currentIndex][columnName] = Number(Number(value).toFixed(2));
            this.dimFactorList[currentIndex][columnName] = Number(Number(value).toFixed(2));

          }

          if (this.dimDuplicateList[afterIndex] != undefined) {

            this.dimDuplicateList[afterIndex].cubicInchFrom = Number(Number(value).toFixed(2)) + 0.1;
            this.dimFactorList[afterIndex].cubicInchFrom = Number(Number(value).toFixed(2)) + 0.1;

          }

        }

      }
      else {

        this.dimDuplicateList[currentIndex][columnName] = value;
        this.dimFactorList[currentIndex][columnName] = value;

      }

    }
    else {

      this.dimFactorList[rowNumber][columnName] = value;
      this.dimDuplicateList[rowNumber][columnName] = value;

    }

  }
  onAccChange(value: any, columnName: any, rowNumber: any, serviceName: any): void {

    if (columnName != "service") {
      const numericValue = Number(value?.toString().replace('%', '').replace('$', ''));
      if (Number.isNaN(numericValue)) {
        return;
      }
    }

    let filteredService: any[] = [];
    const cleanValue = value?.toString().replace('$', '').replace('%', '');

    this.distinctAccList[rowNumber][columnName] = cleanValue;

    if (this.distinctAccList[rowNumber].subGroup != "") {

      filteredService = this.accessorialDiscountList.filter(
        (data: any) => data.service == serviceName
      );

      for (let index = 0; index < filteredService.length; index++) {
        filteredService[index][columnName] = cleanValue;
      }

    }
    else {

      filteredService = this.accessorialDiscountList.filter(
        (data: any) => data.accRatesheetId == this.distinctAccList[rowNumber].accRatesheetId
      );

      for (let index = 0; index < filteredService.length; index++) {

        if (columnName == 'service') {

          filteredService[index][columnName] = value;
          filteredService[index]["subGroup"] = value;

        }
        else {

          filteredService[index][columnName] = cleanValue;

        }

      }

    }

  }
  async changeProposalName(event: any) {
    var targetDetails = this.targetList.filter((data: any) => data.targetId == event.value.toString());
    this.targetDetails = targetDetails[0];
    await this.resetAllList();
    await this.getData();
    await this.getHWTAccountsList();
    await this.setMinMaxHWT();
    await this.ExecMatSelctFunctions();
    await this.ExecDIMMatSelctFunctions();
    await this.setRowSpan();
    this.showDelete();
  }
  async selectTarget(event: any) {
    this.targetDetails = [];
    if (event.value != 'current') {
      var targetDetails = this.targets.filter((data: any) => data.targetId == event.value.toString());
      this.targetDetails = targetDetails[0];
    }
    await this.resetAllList();
    await this.getData();
    await this.getHWTAccountsList();
    await this.setMinMaxHWT();
    await this.ExecMatSelctFunctions();
    await this.ExecDIMMatSelctFunctions();
  }
  openLoading() {
    this.isLoading.set(true);
    // this.loaderService.show();
  }
  closeLoading() {
    this.isLoading.set(false);
    // this.loaderService.hide();
  }
  fromWeightToolTipId: any = -1;
  toWeightToolTipId: any = -1;
  fromWeightFocusout(value: any, columnName: any, rowNumber: any, type: any) {
    let tableList = '';
    let listName = '';
    let minMaxList = '';
    let dataSource = '';
    let subGroup = '';

    if (type == 'air') {
      tableList = 'distinctAirList';
      listName = 'airDiscountsList';
      minMaxList = 'airMinMaxList';
      dataSource = 'dataSourceAir';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'ground') {
      tableList = 'distinctGroundList';
      listName = 'groundDiscountsList';
      minMaxList = 'groundMinMaxList';
      dataSource = 'dataSourceGround';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'intl') {
      tableList = 'distinctIntlList';
      listName = 'intlDiscountsList';
      minMaxList = 'intlMinMaxList';
      dataSource = 'dataSourceIntl';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else {
      tableList = 'distinctHWTList';
      listName = 'hwtDiscountsList';
      minMaxList = 'hwtMinMaxList';
      dataSource = 'dataSourceHWT';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }

    if ((this as any)[tableList][rowNumber - 1] != undefined) {
      var weightFrom = Number((this as any)[tableList][rowNumber].weightFrom);
      var weightTo = Number((this as any)[tableList][rowNumber].weightTo);
      if ((this as any)[tableList][rowNumber - 1].subGroup == subGroup) {

        var toWeight = Number((this as any)[minMaxList][rowNumber - 1].maxWeight);

        if (Number(value) <= toWeight || Number(value) > (toWeight + 1) || Number(value).toString() == 'NaN') {
          (this as any)[tableList][rowNumber][columnName] = Number(toWeight) + 1;
          (this as any)[minMaxList][rowNumber].minWeight = Number(toWeight) + 1;

          if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
            var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == weightFrom);
            alteredObject.forEach((element: any) => {
              element[columnName] = Number(toWeight) + 1;
            });
          }

          this.fromWeightToolTipId = rowNumber;
          setTimeout(() => {
            this.fromWeightToolTipId = -1;
          }, 2000)
        }
        (this as any)[dataSource] = [];
        (this as any)[tableList].forEach((data: any) => (this as any)[dataSource].push(Object.assign({}, data)));
      }
      else if (weightFrom >= weightTo) {
        if (weightTo != 0) {
          (this as any)[tableList][rowNumber][columnName] = weightTo - 1;
          (this as any)[minMaxList][rowNumber].minWeight = weightTo - 1;

          if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
            var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == weightFrom);
            alteredObject.forEach((element: any) => {
              element[columnName] = weightTo - 1;
            });
          }

          this.fromWeightToolTipId = rowNumber;
          setTimeout(() => {
            this.fromWeightToolTipId = -1;
          }, 2000)
        }
        else {
          (this as any)[tableList][rowNumber][columnName] = 0;
          (this as any)[minMaxList][rowNumber].minWeight = 0;

          if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
            var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == weightFrom);
            alteredObject.forEach((element: any) => {
              element[columnName] = 0;
            });
          }

          this.fromWeightToolTipId = rowNumber;
          setTimeout(() => {
            this.fromWeightToolTipId = -1;
          }, 2000)
        }
      }
      // }

    }
    this.buindData();
  }
  buindData() {
    this.dataSourceGroundSignal.set(this.dataSourceGround);
    this.dataSourceIntlSignal.set(this.dataSourceIntl);
    this.dataSourceHWTSignal.set(this.dataSourceHWT);
    this.dataSourceDIMSignal.set(this.dataSourceDIM);
    this.dataSourceAirSignal.set(this.dataSourceAir);
    this.dataSourceAccSignal.set(this.dataSourceAcc);
  }
  async toWeightFocusout(value: any, columnName: any, rowNumber: any, type: any) {

    let tableList = '';
    let listName = '';
    let minMaxList = '';
    let dataSource = '';
    let subGroup = '';
    let deleteList = '';

    if (type == 'air') {
      tableList = 'distinctAirList';
      listName = 'airDiscountsList';
      minMaxList = 'airMinMaxList';
      dataSource = 'dataSourceAir';
      deleteList = 'airDeleteList';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'ground') {
      tableList = 'distinctGroundList';
      listName = 'groundDiscountsList';
      minMaxList = 'groundMinMaxList';
      dataSource = 'dataSourceGround';
      deleteList = 'groundDeleteList';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'intl') {
      tableList = 'distinctIntlList';
      listName = 'intlDiscountsList';
      minMaxList = 'intlMinMaxList';
      dataSource = 'dataSourceIntl';
      deleteList = 'intlDeleteList';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else {
      tableList = 'distinctHWTList';
      listName = 'hwtDiscountsList';
      minMaxList = 'hwtMinMaxList';
      dataSource = 'dataSourceHWT';
      deleteList = 'hwtDeleteList';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    var weightFrom = Number((this as any)[minMaxList][rowNumber].minWeight);
    var weightTo = Number((this as any)[minMaxList][rowNumber].maxWeight);
    var currentObjectList = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == weightFrom && data.weightTo == weightTo);
    if ((this as any)[tableList][rowNumber + 1] != undefined && (this as any)[tableList][rowNumber + 1].subGroup == subGroup) {
      var nextWeightFrom = Number((this as any)[minMaxList][rowNumber + 1].minWeight);
      var nextWeightTo = Number((this as any)[minMaxList][rowNumber + 1].maxWeight);
      if (Number(value) >= Number(nextWeightTo) && weightFrom < weightTo) {
        while (Number(value) >= Number(nextWeightTo)) {
          if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
            var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == nextWeightFrom && data.weightTo == nextWeightTo);
            alteredObject.forEach((data: any) => (this as any)[deleteList].push(Object.assign({}, data)));
            alteredObject.forEach((element: any, index: any) => {
              let rowIndex = currentObjectList.findIndex((data: any) => data.zone1 == element.zone1);
              element.targetDis = currentObjectList[rowIndex].targetDis;
              element.weightFrom = Number(weightFrom);
              element.weightTo = Number(weightTo);
            });
          }
          else {
            let frtRatesheetId = (this as any)[tableList][rowNumber + 1].frtRatesheetId;
            let rowIndex = (this as any)[tableList + 'New'].findIndex((data: any) => data.frtRatesheetId == frtRatesheetId);
            if (rowIndex != -1) {
              (this as any)[tableList + 'New'].splice(rowIndex, 1);
            }
          }

          (this as any)[tableList].splice(rowNumber + 1, 1);
          (this as any)[minMaxList].splice(rowNumber + 1, 1);
          if ((this as any)[tableList][rowNumber + 1] != undefined && (this as any)[tableList][rowNumber + 1].subGroup == subGroup) {
            nextWeightFrom = Number((this as any)[minMaxList][rowNumber + 1].minWeight);
            nextWeightTo = Number((this as any)[minMaxList][rowNumber + 1].maxWeight);
          }
          else {
            break;
          }
        }
        if ((this as any)[tableList][rowNumber + 1] != undefined && (this as any)[tableList][rowNumber + 1].subGroup == subGroup) {

          if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
            var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == (this as any)[minMaxList][rowNumber + 1].minWeight && data.weightTo == (this as any)[minMaxList][rowNumber + 1].maxWeight);
            alteredObject.forEach((element: any) => {
              element.weightFrom = Number(value) + 1;
            });
          }
          (this as any)[tableList][rowNumber + 1].weightFrom = Number(value) + 1;
          (this as any)[minMaxList][rowNumber + 1].minWeight = Number(value) + 1;
        }
        this.setRowSpan();
        (this as any)[dataSource] = [];
        (this as any)[tableList].forEach((data: any) => (this as any)[dataSource].push(Object.assign({}, data)));
      }
      else if ((weightFrom >= weightTo) || ((weightTo >= nextWeightFrom) && (weightTo == nextWeightTo - 1))) {
        if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
          var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightTo == weightTo);
          alteredObject.forEach((element: any) => {
            element[columnName] = Number((this as any)[tableList][rowNumber + 1].weightFrom) - 1;
          });
        }
        (this as any)[tableList][rowNumber].weightTo = Number((this as any)[minMaxList][rowNumber + 1].minWeight) - 1;
        (this as any)[minMaxList][rowNumber].maxWeight = Number((this as any)[minMaxList][rowNumber + 1].minWeight) - 1;
        this.toWeightToolTipId = rowNumber;
        setTimeout(() => {
          this.toWeightToolTipId = -1;
        }, 2000)
      }
      else {
        if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
          var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightFrom == nextWeightFrom && data.weightTo == nextWeightTo);
          alteredObject.forEach((element: any) => {
            element.weightFrom = Number(value) + 1;
          });
        }
        (this as any)[tableList][rowNumber + 1].weightFrom = Number(value) + 1;
        (this as any)[minMaxList][rowNumber + 1].minWeight = Number(value) + 1;
      }
      (this as any)[dataSource] = [];
      (this as any)[tableList].forEach((data: any) => (this as any)[dataSource].push(Object.assign({}, data)));
    }
    else if (weightTo <= weightFrom) {
      if ((this as any)[tableList][rowNumber].isNewRow == undefined) {
        var alteredObject = (this as any)[listName].filter((data: any) => data.subGroup == subGroup && data.weightTo == weightTo);
        alteredObject.forEach((element: any) => {
          element.weightTo = weightFrom + 1;
        });
      }
      (this as any)[tableList][rowNumber].weightTo = weightFrom + 1;
      (this as any)[minMaxList][rowNumber].maxWeight = weightFrom + 1;
      this.toWeightToolTipId = rowNumber;
      setTimeout(() => {
        this.toWeightToolTipId = -1;
      }, 2000)
    }
  }

  async deleteRowFRTRatesheet(frtRateObjList: any) {
    var deleteFRTRatesheetList: any = [];
    frtRateObjList.forEach((data: any) => deleteFRTRatesheetList.push(Object.assign({}, data)));
    var deleteFRTRateObj: any = {};
    deleteFRTRateObj['carrierName'] = this.carrierName;
    deleteFRTRateObj['clientName'] = this.carrierDetails.clientName;
    deleteFRTRateObj['targetId'] = Number(this.targetDetails.targetId);
    if (this.carrier.toLowerCase() == 'ups') {
      deleteFRTRateObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      for (let index = 0; index < deleteFRTRatesheetList.length; index++) {
        deleteFRTRatesheetList[index].targetId = (this.currentAgreement) ? 0 : Number(this.targetDetails.targetId);
        deleteFRTRatesheetList[index].clientId = this.cookiesService.getCookieItem('clientId');
        deleteFRTRatesheetList[index].type = (this.currentAgreement) ? "old" : "future";
      }
      deleteFRTRateObj['freightDetailsList'] = deleteFRTRatesheetList;
      await this.httpClientService.deleteFRTRatesheet(deleteFRTRateObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
    }
    else {
      deleteFRTRateObj['clientId'] = this.fedexClientId;
      for (let index = 0; index < deleteFRTRatesheetList.length; index++) {
        deleteFRTRatesheetList[index].targetId = (this.currentAgreement) ? 0 : Number(this.targetDetails.targetId);
        deleteFRTRatesheetList[index].clientId = this.fedexClientId;
        deleteFRTRatesheetList[index].type = (this.currentAgreement) ? "old" : "future";
      }
      deleteFRTRateObj['freightDetailsList'] = deleteFRTRatesheetList;
      await this.fedexService.deleteFedExFRTRatesheet(deleteFRTRateObj).toPromise().catch((err) => {
        console.log(err);
        this.closeLoading();
      });
    }
  }

  deleteRowDIM(dimObj: any) {
    var deleteDIMList = [];
    var deleteDIMObj: any = {};
    deleteDIMList.push(dimObj);
    deleteDIMObj['dimDetailsList'] = deleteDIMList;
    if (this.carrier.toLowerCase() == 'ups') {
      this.httpClientService.deleteDIM(deleteDIMObj).subscribe((data: any) => { console.log('deleted successfully.') });
    }
    else {
      this.fedexService.deleteDIMFedEx(deleteDIMObj).subscribe((data: any) => { console.log('deleted successfully.') });
    }
  }
  async setRowSpan() {
    this.groundVisibleList = [];
    this.groundRowSpanList = [];
    var groundServices: any = [];
    for (let index = 0; index < this.distinctGroundList.length; index++) {
      var filteredData = this.distinctGroundList.filter((data: any) => data.subGroup == this.distinctGroundList[index].subGroup);
      var newRowList = this.distinctGroundList.filter((data: any) => data.subGroup == this.distinctGroundList[index].subGroup && data.isNewRow != undefined);

      if (!groundServices.includes(this.distinctGroundList[index].subGroup)) {
        groundServices.push(this.distinctGroundList[index].subGroup);
        filteredData.forEach((data: any, index: any) => {
          if (index == 0 || data.isNewRow != undefined) {
            this.groundVisibleList.push(true);
          }
          else {
            this.groundVisibleList.push(false);
          }
          if (data.isNewRow != undefined) {
            this.groundRowSpanList.push(1);
          }
          else {
            this.groundRowSpanList.push(filteredData.length - newRowList.length);
          }
        });
      }
      if (this.distinctGroundList[index].subGroup == '') {
        this.groundVisibleList.push(true);
        this.groundRowSpanList.push(1);
      }
    }
  }

  onDefaultProposalChange(event: any) {
  }

  reset() {
    this.openLoading();
    if (this.nextBtnShow == 0) {
      this.airDiscountsList = [];
      this.airDiscountsListNew.forEach((data: any) => this.airDiscountsList.push(Object.assign({}, data)));
      this.airMinMaxList = [];
      this.airMinMaxListOld.forEach((data: any) => this.airMinMaxList.push(Object.assign({}, data)));
      this.distinctAirList = [];
      this.distinctAirListSignal.set([]);
      this.distinctAirListNew = [];
      this.distinctAirListOld.forEach((data: any) => this.distinctAirList.push(Object.assign({}, data)));
      this.distinctAirListSignal.set(this.distinctAirList);
      this.airDeleteList = [];
      this.airDiscountsLength = this.distinctAirList.length;
      this.dataSourceAir = new MatTableDataSource(this.distinctAirList);
      this.dataSourceAirSignal.set(this.dataSourceAir);
    }
    else if (this.nextBtnShow == 1) {
      this.groundDiscountsList = [];
      this.groundDiscountsListNew.forEach((data: any) => this.groundDiscountsList.push(Object.assign({}, data)));
      this.groundMinMaxList = [];
      this.groundMinMaxListOld.forEach((data: any) => this.groundMinMaxList.push(Object.assign({}, data)));
      this.distinctGroundList = [];
      this.distinctGroundListNew = [];
      this.distinctGroundListOld.forEach((data: any) => this.distinctGroundList.push(Object.assign({}, data)));
      this.groundDeleteList = [];
      this.setRowSpan();
      this.groundDiscountsLength = this.distinctGroundList.length;
      this.dataSourceGround = new MatTableDataSource(this.distinctGroundList);
      this.dataSourceGroundSignal.set(this.dataSourceGround)
    }
    else if (this.nextBtnShow == 2) {
      this.intlDiscountsList = [];
      this.intlDiscountsListNew.forEach((data: any) => this.intlDiscountsList.push(Object.assign({}, data)));
      this.intlMinMaxList = [];
      this.intlMinMaxListOld.forEach((data: any) => this.intlMinMaxList.push(Object.assign({}, data)));
      this.distinctIntlList = [];
      this.distinctIntlListNew = [];
      this.distinctIntlListOld.forEach((data: any) => this.distinctIntlList.push(Object.assign({}, data)));
      this.intlDeleteList = [];
      this.intlDiscountsLength = this.distinctIntlList.length;
      this.dataSourceIntl = new MatTableDataSource(this.distinctIntlList);
    }
    else if (this.nextBtnShow == 3) {
      this.hwtDiscountsList = [];
      this.hwtDiscountsListNew.forEach((data: any) => this.hwtDiscountsList.push(Object.assign({}, data)));
      this.hwtMinMaxList = [];
      this.hwtMinMaxListOld.forEach((data: any) => this.hwtMinMaxList.push(Object.assign({}, data)));
      this.distinctHWTList = [];
      this.distinctHWTListNew = [];
      this.distinctHWTListOld.forEach((data: any) => this.distinctHWTList.push(Object.assign({}, data)));
      this.hwtDeleteList = [];
      this.hwtDiscountsLength = this.distinctHWTList.length;
      this.dataSourceHWT = new MatTableDataSource(this.distinctHWTList);
    }
    else if (this.nextBtnShow == 4) {
      this.dimChanged = false;
      this.dimFactorList = [];
      this.dimFactorListNew.forEach((data: any) => this.dimFactorList.push(Object.assign({}, data)));
      this.dimDuplicateList = [];
      this.dimFactorListNew.forEach((data: any) => this.dimDuplicateList.push(Object.assign({}, data)));
      this.dataSourceDIM = new MatTableDataSource(this.dimFactorList);
      this.dataSourceDIMSignal.set(this.dataSourceDIM);
    }
    else if (this.nextBtnShow == 5) {
      this.isAccServiceAvailable = false;
      this.accessorialDiscountList = [];
      this.accessorialDiscountListNew.forEach((data: any) => this.accessorialDiscountList.push(Object.assign({}, data)));
      this.distinctAccList = [];
      this.distinctAccListNew.forEach((data: any) => this.distinctAccList.push(Object.assign({}, data)));
      this.accMinMaxList = [];
      this.accMinMaxListOld.forEach((data: any) => this.accMinMaxList.push(Object.assign({}, data)));
      this.accessorialLength = this.distinctAccList.length;
      this.dataSourceAcc = new MatTableDataSource(this.distinctAccList);
      this.dataSourceAccSignal.set(this.dataSourceAcc);
    }
    setTimeout(() => {
      this.closeLoading();
    }, 1000);
  }

  accountNumberUpdate(service: any, serviceName: any, listName: string) {
    // var hwtDialog = this.dialog.open(HWTAccountNumberUpdate, {
    //   width: "86%",
    //   height: "86%",
    //   panelClass: this.panelClass,
    //   data: {
    //     carrierName: this.carrierName,
    //     type: this.type,
    //     targetId: this.targetDetails.targetId,
    //     fedexId: this.fedexClientId,
    //     service: service,
    //     serviceName: serviceName,
    //     hwtAccountNumbersList: this.hwtAccountNumbersList,
    //     currentAgreement: this.currentAgreement,
    //     pageData: (this as any)[listName],
    //     target: this.targetDetails,
    //   }
    // });

    // hwtDialog.afterClosed().subscribe(async params => {

    //   if (params != null && params != undefined) {

    //     let data = params.alteredList;
    //     let deleteData = params.deleteList;

    //     for (let index = 0; index < deleteData.length; index++) {

    //       var fromWeight = deleteData[index].oldWeightFrom;
    //       var toWeight = deleteData[index].oldWeightTo;
    //       deleteData[index].weightFrom = Number(deleteData[index].weightFrom);
    //       deleteData[index].weightTo = Number(deleteData[index].weightTo);

    //       if (deleteData[index].serviceType.toLowerCase() == 'hwt') {
    //         this.hwtDeleteList.push(Object.assign({}, deleteData[index]));
    //         let rowNumber = this.hwtDiscountsList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup && service.zone1 == deleteData[index].zone1 && service.weightFrom == fromWeight && service.weightTo == toWeight);
    //         if (rowNumber != -1) this.hwtDiscountsList.splice(rowNumber, 1);
    //         let tableRowNumber = this.distinctHWTList.findIndex((service: any) => service.subGroup == deleteData[index].subGroup);
    //         if (tableRowNumber != -1) this.distinctHWTList.splice(tableRowNumber, 1);
    //       }
    //     }

    //     for (let index = 0; index < data.length; index++) {

    //       var fromWeight = data[index].oldWeightFrom;
    //       var toWeight = data[index].oldWeightTo;
    //       data[index].weightFrom = Number(data[index].weightFrom);
    //       data[index].weightTo = Number(data[index].weightTo);
    //       if (data[index].serviceType.toLowerCase() == 'hwt') {
    //         let rowNumber = this.hwtDiscountsList.findIndex((service: any) => service.subGroup == data[index].subGroup && service.zone1 == data[index].zone1 && service.weightFrom == fromWeight && service.weightTo == toWeight);
    //         if (rowNumber != -1) {
    //           this.hwtDiscountsList[rowNumber] = Object.assign({}, data[index]);
    //           let tableRowNumber = this.distinctHWTList.findIndex((service: any) => service.subGroup == data[index].subGroup);
    //           this.distinctHWTList[tableRowNumber] = data[index];
    //         }
    //         else {
    //           this.hwtDiscountsList[this.hwtDiscountsList.length] = Object.assign({}, data[index]);
    //         }
    //       }
    //     }
    //     await this.getDistinctHWTData();
    //     await this.setMinMax('hwt');
    //     this.insertNewRow('hwt');
    //     this.setRowSpan();
    //     this.dataSourceHWT = new MatTableDataSource(this.distinctHWTList);
    //   }
    //   await this.setMinMaxHWT();
    // });
  }

  async getHWTAccountsList() {
    this.hwtAccountNumbersList = [];
    var clientData: any = {};
    clientData['targetId'] = this.targetDetails.targetId;
    clientData['type'] = this.type;
    if (this.type.toLowerCase() == 'create') {
      clientData['carrier'] = this.carrierName;
    }
    if (this.carrier.toLowerCase() == 'fedex') {
      clientData['clientId'] = this.fedexClientId;
      this.hwtAccountNumbersList = await this.fedexService.fetchAccountNumber(clientData).toPromise();
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      this.hwtAccountNumbersList = await this.httpClientService.fetchAccountNumber(clientData).toPromise();
    }
  }

  validateAccService(service: string, index: number) {
    if (this.distinctAccList[index].isNewRow != undefined) {
      let filteredAcc = this.distinctAccList.filter((data: any, id: any) => id != index);
      let availableServices = this.getUniqueService(filteredAcc, 'service');
      if (availableServices.includes(service)) {
        this.distinctAccList[index].rowNumber = index;
        this.isAccServiceAvailable = true;
      }
      else {
        this.distinctAccList[index].rowNumber = undefined;
        let filteredService: any = [];
        this.distinctAccList.filter((data: any, index: any) => { //get the index of the newly added rows and push it into filteredService array
          if (data.isNewRow != undefined) {
            filteredService.push(index);
          }
        });
        for (let index in filteredService) {//loop the array list,with each index, get the service and check if service is already available
          let AccId = filteredService[index]
          let filteredAcc = this.distinctAccList.filter((data: any, id: any) => id != AccId && data.rowNumber == undefined);
          let availableServices = this.getUniqueService(filteredAcc, 'service');
          let currentService = this.distinctAccList[AccId].service;
          if (availableServices.includes(currentService)) {
            this.distinctAccList[AccId].rowNumber = AccId;
          }
          else {
            this.distinctAccList[AccId].rowNumber = undefined;
          }
        }
        let rowIndex = this.distinctAccList.findIndex((data: any) => data.rowNumber != undefined);
        if (rowIndex == -1) {
          this.isAccServiceAvailable = false;
        }
      }
    }
  }

  deleteTarget() {
    let panelClass = '';
    if (this.themeOption == "dark") {
      panelClass = 'page-dark';
    }
    this.resetDialog = this.dialog.open(ResetPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { message: "Are you sure you want to delete?" }
    });
    this.resetDialog.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.delete();
        }
      });
  }

  delete() {
    var param: any = {
      targetId: this.proposalName,
      clientId: null,
      carrierName: this.carrier.toLowerCase()
    }
    if (this.carrier.toLowerCase() == 'fedex') {
      param.clientId = this.fedexClientId;
    }
    else {
      param.clientId = this.cookiesService.getCookieItem('clientId');
    }
    this.httpClientService.deleteTargetDetails(param).subscribe(response => {
      let proposalName = "";
      for (let index = 0; index < this.targetList.length; index++) {
        if (this.targetList[index].targetId == this.proposalName) {
          proposalName = this.targetList[index].targetName;
          break;
        }
      }
      if (response) {
        let panelClass = '';
        if (this.themeOption == "dark") {
          panelClass = 'page-dark';
        }
        var resetDialog = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          width: '470px',
          height: 'auto',
          panelClass: panelClass,
          data: { pageValue: proposalName + " was deleted successfully" },
        });
        resetDialog.afterClosed().subscribe(
          () => {
            var data = { delete: true, target: null, anyChange: this.isAnythingChanged, agreementNo: this.agreementNoDuplicate, saved: this.isSaved }
            this.dialogRef.close(data);
          });
      }
      else {
        let panelClass = '';
        if (this.themeOption == "dark") {
          panelClass = 'page-dark';
        }
        var resetDialog = this.dialog.open(AlertPopupComponent, {
          disableClose: true,
          width: '470px',
          height: 'auto',
          panelClass: panelClass,
          data: { pageValue: "Oops something went wrong" },
        });
        resetDialog.afterClosed().subscribe(
          () => {
            var data = { delete: false, target: null, anyChange: this.isAnythingChanged, agreementNo: this.agreementNoDuplicate, saved: this.isSaved }
            this.dialogRef.close(data);
          });
      }
    });
  }

  onNetMinimumChange(value: any, rowNumber: any, type: any) {
    let subGroup = '';
    let tableList = '';
    let listName = '';
    let minMaxList = '';
    let dataSource = '';
    let scrollContainer = '';

    if (type == 'air') {
      tableList = 'distinctAirList';
      listName = 'airDiscountsList';
      minMaxList = 'airMinMaxList';
      dataSource = 'dataSourceAir';
      scrollContainer = 'scrollContainer';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'ground') {
      tableList = 'distinctGroundList';
      listName = 'groundDiscountsList';
      minMaxList = 'groundMinMaxList';
      dataSource = 'dataSourceGround';
      scrollContainer = 'scrollContainerGround';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
    }
    else if (type == 'intl') {
      tableList = 'distinctIntlList';
      listName = 'intlDiscountsList';
      minMaxList = 'intlMinMaxList';
      dataSource = 'dataSourceIntl';
      scrollContainer = 'scrollContainerIntl';
      subGroup = (this as any)[tableList][rowNumber].subGroup;
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
  getPercentageClass(value: any): string {
    const percent = parseFloat(value) || 0;
    if (percent > 75) {
      return 'green-box percentage';
    } else if (percent > 50) {
      return 'orange-box percentage';
    } else if (percent > 25) {
      return 'blue-box percentage';
    } else {
      return 'default-box percentage';
    }
  }
}

