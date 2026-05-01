import { Component, OnInit, EventEmitter, Output, Inject, ViewChild, TemplateRef, DOCUMENT } from '@angular/core';

import { EventService } from '../../core/services/event.service';

//Logout
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../core/services/token-storage.service';

// Language
import { CookieService } from 'ngx-cookie-service';
import { TranslateService } from '@ngx-translate/core';
import { allNotification, messages } from './data'
import { NgbModal, NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { firstValueFrom, map, Observable, ReplaySubject, startWith, Subject, take, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { CommonService } from 'src/app/core/services/common.service';
import { MatSelect, MatOption } from '@angular/material/select';
import { restApiService } from 'src/app/core/services/rest-api.service';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { changeMode, changeSidebarColor } from 'src/app/store/layouts/layout-action';
import { getLayoutMode, getSidebarColor } from 'src/app/store/layouts/layout-selector';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: false
})
export class TopbarComponent implements OnInit {  // Multi-select for UPS accounts
  @ViewChild('allSelectedValue') private allSelectedValue!: MatOption;
  @ViewChild('accNoSel') private accNoSel!: MatSelect;
  attribute: any;
  // Multi-select for FedEx accounts
  @ViewChild('allSelectedValueFedEx') private allSelectedValueFedEx!: MatOption;
  @ViewChild('accNoSelFedEx') private accNoSelFedEx!: MatSelect;

  // Searchable select
  @ViewChild('singleSelect') singleSelect!: MatSelect;
  sidebar: string | undefined;
  projectName!: string;
  isLoggedin = true;

  compareActive: any;
  themeActive: any;

  fromDate: any = new Date();
  toDate: any = new Date();

  userProfifle: any;
  userProfifleData: any;

  clientID: any;
  clientName: any;
  clientNameRegex: any;

  fileStartDate: any;
  fileEndDate: any;
  dataasof: any;

  carrierType: any;
  carrierTypeCookies: any;
  clientType: any;

  ImageUrl = environment.imageURL;
  ImageUrlData: any;

  chooseCarrierFlag: any;
  themeOption = 'light';
  panelClass: any;

  adminAccess: any;
  adminFlag = false;
  adminChooseCarrier = false;

  compareDataDateOne: any;
  compareDataDateTwo: any;
  endDate: any;
  endDateUps: any;

  currentDate: any;

  // forms
  headerControllerFormGroup: FormGroup;
  headerFormGroup: FormGroup;

  headerFormGroupUPS: FormGroup;
  headerFormGroupFedEx: FormGroup;
  headerFormGroupOnTrac: FormGroup;
  headerFormGroupDhl: FormGroup;
  headerFormGroupUSPS: FormGroup;

  apiControllerFormGroup: FormGroup;
  adminFormGroup: FormGroup;

  // select data
  datedefalt: any;
  defaultArr = ['ALL'];
  Default = 'ALL';

  defaultArrFedex = ['ALL'];
  DefaultFedex = 'ALL';

  myControl = new FormControl();
  options: any[] = [];
  t007_reportlogobj: any = {};
  carrierList: any = [
    { name: 'UPS', value: 'UPS' },
    { name: 'FedEx', value: 'FedEx' },
    { name: 'OnTrac', value: 'OnTrac' },
    { name: 'DHL', value: 'Dhl' },
    { name: 'USPS', value: 'USPS' },
  ];
  t007_reportlogobjUps: any = {};
  clientDetailLstUps: any;
  // data for counts
  accountAC: any[] = [];
  accountCount = 0;
  planAC: any[] = [];
  planCount = 0;

  accountACFedex: any[] = [];
  accountCountFedex = 0;

  accountACOnTrac: any[] = [];
  accountCountOnTrac = 0;

  accountACDhl: any[] = [];
  accountCountDhl = 0;

  // customers / audit lists
  clientList: any[] = [];
  auditCustomerListAC: any[] = [];

  // notification / login flags
  loginCustomerType: any;
  crmUserType: any;

  // RX helpers
  filteredOptions!: Observable<any[]> | undefined;
  clientDetailLstFedex: any;
  clientIdFedex: any;
  clientDetailLstOntrac: any[] = [];
  clientDetailLstDhl: any[] = [];
  clientDetailLstUsps: any[] = [];
  public clientNameCtrl: FormControl = new FormControl({ name: '' });
  public clientNameFilterCtrl: FormControl = new FormControl();
  public filteredClients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  // compare navigation toggle
  bool = false;


  messages: any
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  total = 0;
  cart_length: any = 0;
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  isDropdownOpen = false;
  @ViewChild('removenotification') removenotification !: TemplateRef<any>;
  notifyId: any;

  constructor(@Inject(DOCUMENT) private document: any, private offcanvasService: NgbOffcanvas,
    private eventService: EventService,
    private store: Store<RootReducerState>,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private TokenStorageService: TokenStorageService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private httpClientService: HttpClientService,
    private cookiesService: CookiesService,
    private switchProj: SwitchProjectService,
    private commonService: CommonService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private restApiService: restApiService,) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
    });

    this.headerControllerFormGroup = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      fedexfromDate: new FormControl(''),
      fedextoDate: new FormControl(''),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl(''),
      }),
      accNo: new FormControl('ALL'),
      accNumber: new FormControl('ALL'),
    });

    this.adminFormGroup = new FormGroup({
      selectedClient: new FormControl(''),
    });

    this.headerFormGroupFedEx = new FormGroup({
      clientId: new FormControl(''),
      carrierType: new FormControl(''),
    });

    this.headerFormGroupUPS = new FormGroup({
      clientId: new FormControl(''),
      carrierType: new FormControl(''),
    });

    this.headerFormGroupOnTrac = new FormGroup({
      clientId: new FormControl(''),
      carrierType: new FormControl(''),
    });

    this.headerFormGroupDhl = new FormGroup({
      clientId: new FormControl(''),
      carrierType: new FormControl(''),
    });

    this.headerFormGroupUSPS = new FormGroup({
      clientId: new FormControl(''),
      carrierType: new FormControl(''),
    });

    this.headerFormGroup = new FormGroup({
      t001ClientProfile: new FormGroup({
        action: new FormControl(''),
        activeFlag: new FormControl(''),
        address: new FormControl(''),
        asonDate: new FormControl(''),
        carrierType: new FormControl(''),
        changePassword: new FormControl(''),
        charges: new FormControl(''),
        clientId: new FormControl(''),
        clientName: new FormControl(''),
        clientPassword: new FormControl(''),
        clientdbstatus: new FormControl(''),
        comments: new FormControl(''),
        contactNo: new FormControl(''),
        contractanalysisstatus: new FormControl(''),
        createdBy: new FormControl(''),
        createdTs: new FormControl(''),
        currentDate: new FormControl(''),
        currentstatus: new FormControl(''),
        customertype: new FormControl(''),
        dataFileDestDir: new FormControl(''),
        dataFileSourceDir: new FormControl(''),
        dataLoadBy: new FormControl(''),
        dataSource: new FormControl(''),
        dataasof: new FormControl(''),
        daystoweb: new FormControl(''),
        email: new FormControl(''),
        employeeTempTotal: new FormControl(''),
        employerTempTotal: new FormControl(''),
        errorString: new FormControl(''),
        fetchPhoto: new FormControl(''),
        fileEndDate: new FormControl(''),
        fileStartDate: new FormControl(''),
        getImageInd: new FormControl(''),
        image: new FormControl(''),
        ipaddress: new FormControl(''),
        isSelected: new FormControl(''),
        isdeletedbyowner: new FormControl(''),
        lazyLoad: new FormControl(''),
        loginclientId: new FormControl(''),
        logostatus: new FormControl(''),
        menucount: new FormControl(''),
        newPassword: new FormControl(''),
        nextlevelflag: new FormControl(''),
        noofdaysinactive: new FormControl(''),
        noofdaystoactive: new FormControl(''),
        password: new FormControl(''),
        payInWords: new FormControl(''),
        repname: new FormControl(''),
        resetPassword: new FormControl(''),
        startDate: new FormControl(''),
        status: new FormControl(''),
        t301accountAC: new FormControl(''),
        t302planAC: new FormControl(''),
        tablename: new FormControl(''),
        trackingcount: new FormControl(''),
        updatedTs: new FormControl(''),
        updatedby: new FormControl(''),
        user_name: new FormControl(''),
        year: new FormControl(''),
      }),
    });

    this.cookiesService.getLoginStatus().subscribe((res) => {
      this.isLoggedin = res;
    });

    this.apiControllerFormGroup = new FormGroup({
      theme_option: new FormControl(''),
      clientId: new FormControl(''),
    });

  }
  private pendingClientName: string | null = null;
  userName: any = '';
  ngOnInit(): void {
    this.userData = this.TokenStorageService.getUser();
    this.element = document.documentElement;
    this.messages = messages;
    this.pageLoad();

    // this.filteredClients.subscribe(list => {
    //   console.log(list, localStorage.getItem('clientName'));
    //   this.pendingClientName = localStorage.getItem('clientName');
    //   if (list?.length && this.pendingClientName) {

    //     const exists = list.some(
    //       x => x.name === this.pendingClientName
    //     );

    //     if (exists) {
    //       this.adminFormGroup.get('selectedClient')?.setValue(this.pendingClientName, {
    //         emitEvent: false
    //       });

    //       this.pendingClientName = null;
    //     }
    //   }
    // });

  }
  changeLayoutMode(mode: string) {
    console.log(mode);
    this.changeSidebarColor(mode);
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
    this.store.select(getLayoutMode).subscribe((mode) => {
      document.documentElement.setAttribute('data-bs-theme', mode)
    })
    // document.documentElement.setAttribute('data-bs-theme', mode)
  }
  // Sidebar Color Change
  changeSidebarColor(sidebarColor: string) {
    this.sidebar = sidebarColor;
    this.store.dispatch(changeSidebarColor({ sidebarColor }));
    this.store.select(getSidebarColor).subscribe((color) => {
      document.documentElement.setAttribute('data-sidebar', color);
    })
  }
  async pageLoad() {
    console.log('pageLoad');
    this.commonService.emittedContractParam
      .subscribe(res => this.clickCompareFun(res));
    let userName = this.cookiesService.getCookie('adminName');
    this.userName = (await userName).toUpperCase();
    this.currentDate = new Date();
    this.getThemeOption();
    this.getCookieAdmin();

    /* ---------- Date setup ---------- */
    const today = new Date();

    // last month range
    const monthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.fromDate = this.datePipe.transform(monthStart, 'yyyy-MM-dd');
    this.toDate = this.datePipe.transform(monthEnd, 'yyyy-MM-dd');

    this.headerControllerFormGroup.patchValue({
      fromDate: monthStart,
      toDate: monthEnd,
      fedexfromDate: monthStart,
      fedextoDate: monthEnd
    });

    /* ---------- Client handling ---------- */
    const clientType = this.clientType.toLowerCase();

    switch (clientType) {
      case 'fedex':
        this.chooseCarrierFlag = 'FedEx';
        await this.fetchUser();
        await this.getUserFedex();
        break;

      case 'ontrac':
        this.chooseCarrierFlag = 'OnTrac';
        await this.fetchUserOnTrac();
        await this.getUserOnTrac();
        break;

      case 'dhl':
        this.chooseCarrierFlag = 'Dhl';
        await this.fetchUserDhl();
        await this.getUserDhl();
        break;

      case 'usps':
        this.chooseCarrierFlag = 'USPS';
        await this.fetchUserUSPS();
        await this.getUserUSPS();
        break;

      default:
        this.chooseCarrierFlag = 'UPS';
        await this.fetchUPSalluser();
        await this.getUser();
    }

    /* ---------- Init + autocomplete ---------- */
    await this.initMethodUps_Fedex();

    this.filteredOptions = this.adminFormGroup.get('selectedClient')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    console.log(this.filteredOptions);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
  async getCookieAdmin(): Promise<void> {
    const adminId = await this.cookiesService.getCookieAdmin('adminId');
    this.adminAccess = adminId ?? '';
    this.adminFlag = adminId?.length > 0;
  }
  clickCompareFun(value: string): void {
    this.compareActive = value === 'open';
  }
  async getThemeOption() {
    this.themeOption = await this.cookiesService.getCookie('themeOption');
  }

  async initMethodUps_Fedex(): Promise<void> {
    const carrierType = await this.getCarrierType();
    if (!carrierType) {
      return;
    }
    const carrier = carrierType.toLowerCase();
    if (carrier.includes('ups')) {
      await this.fetchUPSalluserInitUps();
    }
    if (carrier.includes('fedex')) {
      await this.fetchUserInitFedex();
    }
    if (carrier.includes('ontrac')) {
      await this.fetchUserInitOntrac();
    }
    if (carrier.includes('dhl')) {
      await this.fetchUserInitDhl();
    }
    if (carrier.includes('usps')) {
      await this.fetchUserInitUsps();
    }
  }
  async getCarrierType(): Promise<string> {
    return localStorage.getItem('carrierTypevalue');
  }
  async fetchUPSalluserInitUps(): Promise<void> {
    const t001custObj = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    const clientName = await this.cookiesService.getCookie('clientName');
    if (!clientName) return;

    try {
      const result = await firstValueFrom(
        this.restApiService.loadClientProfile(t001custObj)
      );

      this.clientDetailLstUps = result;

      const matchedClient = this.clientDetailLstUps.find(
        (x: any) => x.clientName?.toLowerCase() === clientName.toLowerCase()
      );

      if (!matchedClient) return;

      await this.fetchaccountDetails(matchedClient.clientId);

    } catch (error) {
      console.error('UPS init error:', error);
    }
  }
  async fetchaccountDetails(clientIdUps: string): Promise<void> {
    const t002ClntObj = {
      clientId: clientIdUps
    };

    this.t007_reportlogobjUps = {
      t001ClientProfile: t002ClntObj
    };

    try {
      const result = await firstValueFrom(
        this.restApiService.fetchaccountDetailsUPS(this.t007_reportlogobjUps)
      );

      this.accountAC = result || [];

      this.accountAC = this.accountAC.map(item => ({
        ...item,
        nickName:
          !item.nickName
            ? item.accountNo
            : `${item.accountNo} - <span>${item.nickName}</span>`
      }));

      this.accountCount = this.accountAC.length;

    } catch (error) {
      console.error('Error fetching UPS account details:', error);
    }
  }

  async fetchUserInitFedex(): Promise<void> {
    try {
      const fedexId = await this.cookiesService.getCookieAdmin('fedexId');

      const t001custObj: any = {
        clientId: fedexId
      };

      this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
      const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

      if (this.crmUserType === 'USER' && loginEmailId) {
        t001custObj.email = loginEmailId;
      }

      const result = await firstValueFrom(
        this.restApiService.fetchUser(t001custObj)
      );

      this.clientDetailLstFedex = result || [];

      const matchedClient = this.clientDetailLstFedex.find(
        (x: any) => x.clientName?.toLowerCase() === this.clientName?.toLowerCase()
      );

      if (!matchedClient) {
        console.error('FedEx client not found');
        return;
      }

      this.clientIdFedex = matchedClient.clientId;

      await this.fetchaccountDetailsFedex(this.clientIdFedex);

    } catch (error) {
      console.error('Error fetching FedEx user init:', error);
    }
  }
  async cust_cmbid_changeHandler(evt: any) {

    if (!evt?.value) return;

    let clientName: string;

    // Handle both string and object
    if (typeof evt.value === 'string') {
      clientName = evt.value;
    } else {
      clientName = evt.value.name;
    }

    if (!clientName) return;

    const selectedClientObj = this.clientList.find(
      c => (c.clientName || '').toLowerCase() === clientName.toLowerCase()
    );

    if (!selectedClientObj) return;

    console.log('selectedClientObj', selectedClientObj);

    if (this.clientType?.toLowerCase() === 'fedex') {
      this.cookiesService.setCookie(selectedClientObj);
      // this.urlRouteAndReload();
      window.location.reload();
    }
    else if ((selectedClientObj?.status || '').toUpperCase() === 'ACTIVE') {
      this.cookiesService.setCookie(selectedClientObj);
      // this.urlRouteAndReload();
      window.location.reload();
    }
  }

  /********** Start UPS Code *************/
  urlRouteAndReload(): void {
    console.log('urlRouteAndReload');
    const remainingPath = this.router.url.split('/').slice(2);
    this.cookiesService.getCookie('currentCarrierType')
      .then((carrier: string) => {
        if (!carrier) return;
        const clientType = carrier.toLowerCase();
        this.router.navigate(['/', ...remainingPath]);
      });

  }


  loadClientProfile(param: any): Promise<any> {
    return firstValueFrom(
      this.restApiService.loadClientProfile(param)
    );
  }
  async fetchUPSalluser(): Promise<void> {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    if (this.adminAccess && this.loginCustomerType === 'LJM_User') {
      t001custObj.login_ParentClientId = this.adminAccess;
    }

    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    const result = await this.loadClientProfile(t001custObj);
    await this.allClientresultnew(result);
  }
  async allClientresultnew(event: any[]) {

    this.clientList = [];
    this.auditCustomerListAC = [];
    this.options = [];

    this.adminFlag = event.length > 1;

    for (const t002Obj of event) {
      if (t002Obj.customertype === 'LJM_User') {
        this.clientList.push(t002Obj);

        if (t002Obj.auditcustomerstatus === 'Y') {
          this.auditCustomerListAC.push(t002Obj);
        }
      }
    }

    if (this.adminChooseCarrier) {

      const carrierTypeValue = (await localStorage.getItem('carrierTypevalue'))?.toLowerCase();

      const allowedCarrierSets = [
        'both',
        'ups~fedex~ontrac~dhl~usps',
        'ups~fedex~ontrac~dhl',
        'ups~fedex~ontrac~usps',
        'ups~fedex~dhl~usps',
        'ups~ontrac~dhl~usps',
        'ups~fedex~ontrac',
        'ups~fedex~dhl',
        'ups~fedex~usps',
        'ups~ontrac~dhl',
        'ups~ontrac~usps',
        'ups~dhl~usps',
        'ups~fedex',
        'ups~ontrac',
        'ups~dhl',
        'ups~usps'
      ];

      if (allowedCarrierSets.includes(carrierTypeValue)) {

        const clientName = await this.cookiesService.getCookie('clientName');

        const matchedClient = this.clientList.find(
          c => c.clientName.toLowerCase() === clientName?.toLowerCase()
        );

        await this.cookiesService.setCookie(matchedClient || this.clientList[0]);
        this.reloadOnce();
        return;


      } else {

        await this.cookiesService.setCookie(this.clientList[0]);
        this.reloadOnce();
        return;

      }
    }

    this.options = this.clientList.map(client => ({
      name: client.clientName
    }));

    this.ExecMatSelctFunctions();
  }
  private reloadOnce() {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      this.urlRouteAndReload();
    }
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
  }
  async getUser(): Promise<void> {

    // ----------------------------
    // Cookies
    // ----------------------------
    this.carrierTypeCookies = await this.cookiesService.getCookie('carrierTypevalue');

    // ----------------------------
    // User profile
    // ----------------------------
    const profileData = await this.commonService.getUserprofileData();
    this.userProfifle = profileData[0];

    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    // ----------------------------
    // Patch main form
    // ----------------------------
    this.headerFormGroup.patchValue({
      t001ClientProfile: { ...this.userProfifle }
    });

    // ----------------------------
    // UPS form
    // ----------------------------
    this.headerFormGroupUPS.get('clientId')?.setValue(this.clientID);
    this.headerFormGroupUPS.get('carrierType')?.setValue('ups');

    // ----------------------------
    // Carrier type logic (CLEAN)
    // ----------------------------
    const carrierTypeValue = (this.carrierTypeCookies || '').toLowerCase();

    const upsAllowedCarriers = [
      'both',
      'ups~fedex~ontrac~dhl~usps',
      'ups~fedex~ontrac~dhl',
      'ups~fedex~ontrac~usps',
      'ups~fedex~dhl~usps',
      'ups~fedex~ontrac',
      'ups~fedex~dhl',
      'ups~fedex~usps',
      'ups~fedex'
    ];

    if (upsAllowedCarriers.includes(carrierTypeValue)) {
      this.functionDateAsOFUPS();
    }

    // ----------------------------
    // Admin + client selection
    // ----------------------------
    this.adminFormGroup.get('selectedClient')?.setValue(this.clientName);
    this.clientNameCtrl.setValue({ name: this.clientName });
    console.log(this.clientNameCtrl);
    // ----------------------------
    // Dates
    // ----------------------------
    this.fileStartDate = this.datePipe.transform(
      this.userProfifle.fileStartDate,
      'MM/dd/yyyy'
    );

    this.fileEndDate = this.userProfifle.fileEndDate;
    this.dataasof = this.userProfifle.dataasof;
    this.compareDataDateOne = this.userProfifle.dataasof;
    this.carrierType = this.userProfifle.carrierType;

    // ----------------------------
    // Image URL
    // ----------------------------
    this.clientNameRegex = this.clientName.replace(/\s/g, '');
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    this.ImageUrlData = `${this.ImageUrl}${this.clientNameRegex}.jpg?${randomNumber}`;

    // ----------------------------
    // Accounts & plans
    // ----------------------------
    await this.fetchaccountDetails(this.clientID);
    await this.fetchplanDetails();

    // ----------------------------
    // Theme
    // ----------------------------
    this.panelClass =
      this.themeOption === 'dark'
        ? 'page-dark'
        : 'custom-dialog-panel-class';
  }
  fetchplanDetails() {
    this.restApiService.fetchplanDetails(this.headerFormGroup.value).subscribe(
      result => {
        this.planAC = result;
        this.planCount = result.length;
      },
      error => {
        console.log(error);
      }
    );
  }

  functionDateAsOFUPS(): void {
    this.restApiService
      .fetchFedExComparisionReportadataAsOf(this.headerFormGroupUPS.value)
      .subscribe({
        next: (result: any) => {
          const resultDate = result.clientId;
          this.getProfileData(resultDate);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
  async getProfileData(clientId: string): Promise<void> {
    try {
      const userDataObj: any = {
        clientId: clientId
      };
      const clientProfile: any = await firstValueFrom(
        this.restApiService.fetchUser(userDataObj)
      );
      if (!clientProfile || clientProfile.length === 0) {
        return;
      }
      const resultData: string = clientProfile[0].fileenddate1;
      if (!resultData || resultData.length !== 8) {
        return;
      }
      const strYear = resultData.substring(0, 4);
      const strMonth = resultData.substring(4, 6);
      const strDate = resultData.substring(6, 8);
      const dataAsOf = `${strYear}-${strMonth}-${strDate}`;
      this.compareDataDate(dataAsOf);
    } catch (error) {
      console.error('Error in getProfileData:', error);
    }
  }
  async fetchUserInitOntrac(): Promise<void> {
    try {
      const clientName = await this.cookiesService.getCookie('clientName');

      const t001custObj: any = {
        status: 'ACTIVE',
        lazyLoad: 'N'
      };

      const result = await firstValueFrom(
        this.restApiService.loadOnTracClientProfile(t001custObj)
      );

      this.clientDetailLstOntrac = result || [];

      const matchedClient = this.clientDetailLstOntrac.find(
        x => x.clientName?.toLowerCase() === clientName?.toLowerCase()
      );

      if (!matchedClient) {
        console.error('OnTrac client not found');
        return;
      }

      const clientIdOntrac = matchedClient.clientId;

      await this.fetchOnTracAccountDetails(clientIdOntrac);

    } catch (error) {
      console.error('Error fetching OnTrac user init:', error);
    }
  }
  async fetchUserInitDhl(): Promise<void> {
    try {
      const clientName = await this.cookiesService.getCookie('clientName');

      const t001custObj: any = {
        status: 'ACTIVE',
        lazyLoad: 'N'
      };

      const result = await firstValueFrom(
        this.restApiService.loadDhlClientProfile(t001custObj)
      );

      this.clientDetailLstDhl = result || [];

      const matchedClient = this.clientDetailLstDhl.find(
        (x: any) => x.clientName?.toLowerCase() === clientName?.toLowerCase()
      );

      if (!matchedClient) {
        console.error('DHL client not found');
        return;
      }

      const clientIdDhl = matchedClient.clientId;

      await this.fetchDhlAccountDetails(clientIdDhl);

    } catch (error) {
      console.error('Error fetching DHL user init:', error);
    }
  }
  async fetchUserInitUsps() {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    const clientName = await this.cookiesService.getCookie('clientName');

    this.restApiService.loadUSPSClientProfile(t001custObj).subscribe(
      (result) => {
        this.clientDetailLstUsps = result;

        const index = this.clientDetailLstUsps.findIndex(
          (x: any) => x.clientName.toLowerCase() === clientName.toLowerCase()
        );

        const clientIdUsps = this.clientDetailLstUsps[index].clientId;
      },
      (error) => {
        console.log('error ', error);
      }
    );
  }
  compareClients(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.name === c2.name : c1 === c2;
  }
  /********** End UPS Code *************/
  /********** Start Fedex Code *************/
  async fetchUser(): Promise<void> {
    const clientId = await this.cookiesService.getCookieAdmin('fedexId');

    const crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

    const payload: any = { clientId };

    if (crmUserType === 'USER' && loginEmailId) {
      payload.email = loginEmailId;
    }

    this.restApiService.fetchUser(payload).subscribe({
      next: (result: any) => this.fedExUserResult(result),
      error: err => console.error('Fetch FedEx user error:', err)
    });
  }
  async fedExUserResult(event: any[]): Promise<void> {
    // Filter non-admin clients
    this.clientList = event.filter(client => client.adminFlag !== 'Y');

    if (this.adminChooseCarrier && this.clientList.length) {
      await this.handleAdminCarrierSelection();
    }

    // Build dropdown options
    this.options = this.clientList.map(client => ({
      name: client.clientName
    }));

    this.ExecMatSelctFunctions();
  }

  private async handleAdminCarrierSelection(): Promise<void> {
    const carrierTypeValue = (
      await localStorage.getItem('carrierTypevalue')
    )?.toLowerCase();

    if (!carrierTypeValue) {
      return this.setAndReload(this.clientList[0]);
    }

    const allowedCarriers = carrierTypeValue === 'both'
      ? ['fedex']
      : carrierTypeValue.split('~');

    if (!allowedCarriers.includes('fedex')) {
      return this.setAndReload(this.clientList[0]);
    }

    const clientName = (await this.cookiesService.getCookie('clientName'))?.toLowerCase();

    const matchedClient =
      this.clientList.find(
        client => client.clientName.toLowerCase() === clientName
      ) || this.clientList[0];

    this.setAndReload(matchedClient);
  }

  async setAndReload(client: any) {
    await this.cookiesService.setCookie(client);
    this.urlRouteAndReload();
  }

  ExecMatSelctFunctions(): void {
    // Emit full list initially
    this.filteredClients.next([...this.options]);

    // Listen for search field changes
    this.clientNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterClientName());
  }
  private filterClientName(): void {
    if (!this.options?.length) {
      return;
    }

    const search = this.clientNameFilterCtrl.value?.toLowerCase() ?? '';

    const filtered = !search
      ? [...this.options]
      : this.options.filter(client =>
        client.name.toLowerCase().includes(search)
      );

    this.filteredClients.next(filtered);
    this.clientNameCtrl.setValue({ name: this.clientName });
  }
  async getUserFedex() {
    // ---- Cookie (single source)
    const carrierTypeValue = (localStorage.getItem('carrierTypevalue') || '').toLowerCase();

    // ---- User profile
    const profileData = await this.commonService.getUserprofileData();
    const profile = profileData[0];

    this.userProfifle = profile;
    this.clientID = profile.clientId;
    this.clientName = profile.clientName;

    // ---- Form setup
    this.clientNameCtrl.setValue({ name: this.clientName });
    this.headerFormGroupFedEx.patchValue({
      clientId: this.clientID,
      carrierType: 'FedEx'
    });

    this.adminFormGroup.get('selectedClient')?.setValue(this.clientName);

    // ---- Carrier logic
    if (this.hasFedexAccess(carrierTypeValue)) {
      this.functionDateAsOFFedex();
    }

    // ---- Dates
    this.fileStartDate = this.formatYYYYMMDD(profile.filestartdate1);
    this.dataasof = this.formatYYYYMMDD(profile.fileenddate1);
    this.compareDataDateOne = this.dataasof;

    this.fileEndDate = profile.dataasof;
    this.carrierType = profile.carrierType;

    // ---- Image
    this.clientNameRegex = this.clientName.replace(/\s/g, '');
    this.ImageUrlData = `${this.ImageUrl}${this.clientNameRegex}.jpg`;

    // ---- Report log
    this.t007_reportlogobj['t002ClientProfile'] = {
      clientId: this.clientID
    };

    // ---- Fetch account data
    this.fetchaccountDetailsFedex(this.clientID);

    // ---- Theme
    this.panelClass =
      this.themeOption === 'dark'
        ? 'page-dark'
        : 'custom-dialog-panel-class';
  }
  private formatYYYYMMDD(value: string): string {
    if (!value || value.length !== 8) return '';
    return `${value.substring(4, 6)}/${value.substring(6, 8)}/${value.substring(0, 4)}`;
  } private hasFedexAccess(value: string): boolean {
    if (!value) return false;

    if (value === 'both') return true;

    return value
      .split('~')
      .map(v => v.trim().toLowerCase())
      .includes('fedex');
  }
  private isFedexAllowed(carrierTypeValue?: string): boolean {
    if (!carrierTypeValue) return false;

    if (carrierTypeValue === 'both') return true;

    return carrierTypeValue.split('~').includes('fedex');
  }
  private setFileDates(profile: any): void {
    const start = profile.filestartdate1;
    const end = profile.fileenddate1;

    const format = (date: string) =>
      `${date.substring(4, 6)}/${date.substring(6, 8)}/${date.substring(0, 4)}`;

    this.fileStartDate = format(start);
    this.dataasof = format(end);
    this.compareDataDateOne = this.dataasof;
  }

  async functionDateAsOFFedex(): Promise<void> {
    this.restApiService
      .fetchUPSComparisionReportadataAsOf(this.headerFormGroupFedEx.value)
      .subscribe({
        next: result => {
          const resultDate = result?.[0]?.dataasof;
          if (resultDate) {
            this.compareDataDate(resultDate);
          }
        },
        error: err => console.error('FedEx dataAsOf error:', err)
      });
  }
  async compareDataDate(event: string): Promise<void> {
    this.compareDataDateTwo =
      this.datePipe.transform(event, 'MM/dd/yyyy') ?? '';

    const dateOne = new Date(this.compareDataDateOne);
    const dateTwo = new Date(this.compareDataDateTwo);

    if (this.clientType.toUpperCase() === 'UPS') {
      this.endDateUps = dateOne;
      this.endDate = dateTwo;
    } else {
      this.endDate = dateOne;
      this.endDateUps = dateTwo;
    }
  }
  fetchaccountDetailsFedex(clientIdFedex: string): void {
    this.t007_reportlogobj['t002ClientProfile'] = {
      clientId: clientIdFedex
    };
    this.restApiService
      .fetchaccountDetails(this.t007_reportlogobj)
      .subscribe({
        next: (result: any) => {
          this.accountACFedex = result.map((item: any) => ({
            ...item,
            nickName: item.nickName
              ? `${item.primaryAccountNumber} - <span>${item.nickName}</span>`
              : item.primaryAccountNumber
          }));

          this.accountCountFedex = this.accountACFedex.length;
        },
        error: err => console.error('FedEx account fetch error:', err)
      });
  }
  /********** End Fedex Code *************/
  /********** Start OnTrac Code *************/
  async fetchUserOnTrac(): Promise<void> {
    const payload: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    const loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');

    if (this.adminAccess && loginCustomerType === 'LJM_User') {
      payload.login_ParentClientId = this.adminAccess;
    }

    const crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

    if (crmUserType === 'USER' && loginEmailId) {
      payload.email = loginEmailId;
    }

    this.loadOnTracClientProfile(payload);
  }
  loadOnTracClientProfile(param: any): void {
    this.restApiService.loadOnTracClientProfile(param).subscribe({
      next: result => this.onTracClientResult(result),
      error: err => console.error('OnTrac profile error:', err)
    });
  }
  async onTracClientResult(event: any[]): Promise<void> {
    // Reset lists
    this.clientList = [];
    this.auditCustomerListAC = [];

    // Admin flag
    this.adminFlag = event.length > 1 && this.adminFlag === true;

    // Filter customers
    event.forEach(customer => {
      if (customer.customertype === 'LJM_User') {
        this.clientList.push(customer);

        if (customer.auditcustomerstatus === 'Y') {
          this.auditCustomerListAC.push(customer);
        }
      }
    });

    // Handle admin carrier logic
    if (this.adminChooseCarrier && this.clientList.length) {
      await this.handleOnTracAdminCarrier();
    }

    // Build options
    this.options = this.clientList.map(client => ({
      name: client.clientName
    }));

    this.ExecMatSelctFunctions();
  }
  private async handleOnTracAdminCarrier(): Promise<void> {
    const carrierTypeValue = (
      await localStorage.getItem('carrierTypevalue')
    )?.toLowerCase();

    if (!this.isCarrierAllowed(carrierTypeValue, 'ontrac')) {
      return this.setClientAndReload(this.clientList[0]);
    }

    const cookieClientName = (
      await this.cookiesService.getCookie('clientName')
    )?.toLowerCase();

    const matchedClient =
      this.clientList.find(
        client => client.clientName.toLowerCase() === cookieClientName
      ) || this.clientList[0];

    this.setClientAndReload(matchedClient);
  }
  private isCarrierAllowed(value: string | undefined, carrier: string): boolean {
    if (!value) return false;
    if (value === 'both') return true;
    return value.split('~').includes(carrier);
  }
  private async setClientAndReload(client: any): Promise<void> {
    await this.cookiesService.setCookie(client);
    this.urlRouteAndReload();
  }
  async getUserOnTrac(): Promise<void> {
    // Carrier cookie
    this.carrierTypeCookies = await this.cookiesService.getCookie('carrierType');

    // User profile
    const [profile] = await this.commonService.getUserprofileData();
    this.userProfifle = profile;

    this.clientID = profile.clientId;
    this.clientName = profile.clientName;

    // Patch full profile (no need to re-map every field)
    this.headerFormGroup.patchValue({
      t001ClientProfile: profile
    });

    // Header form
    this.headerFormGroupOnTrac.patchValue({
      clientId: this.clientID,
      carrierType: 'OnTrac'
    });

    // Admin + client controls
    this.adminFormGroup.get('selectedClient')?.setValue(this.clientName);
    this.clientNameCtrl.setValue({ name: this.clientName });

    // Dates
    this.fileStartDate =
      this.datePipe.transform(profile.fileStartDate, 'MM/dd/yyyy') ?? '';

    this.fileEndDate = profile.fileEndDate;
    this.dataasof = profile.dataasof;
    this.compareDataDateOne = profile.dataasof;

    // Misc
    this.carrierType = profile.carrierType;
    this.clientNameRegex = this.clientName.replace(/\s/g, '');

    const cacheBuster = Math.floor(100000 + Math.random() * 900000);
    this.ImageUrlData = `${this.ImageUrl}${this.clientNameRegex}.jpg?${cacheBuster}`;

    // Accounts
    await this.fetchOnTracAccountDetails(this.clientID);

    // Theme
    this.panelClass =
      this.themeOption === 'dark'
        ? 'page-dark'
        : 'custom-dialog-panel-class';
  }
  async fetchOnTracAccountDetails(clientIdOntrac: string): Promise<void> {
    try {
      const result: any = await firstValueFrom(
        this.restApiService.fetchaccountDetails({ clientId: clientIdOntrac })
      );

      this.accountACOnTrac = result;
      this.accountCountOnTrac = result.length;
    } catch (err) {
      console.error('OnTrac account fetch error:', err);
    }
  }
  /********** End OnTrac Code *************/
  /********** Start Dhl Code *************/
  async fetchUserDhl(): Promise<void> {
    const payload: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    const loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');

    if (this.adminAccess && loginCustomerType === 'LJM_User') {
      payload.login_ParentClientId = this.adminAccess;
    }

    const crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

    if (crmUserType === 'USER' && loginEmailId) {
      payload.email = loginEmailId;
    }

    this.loadDhlClientProfile(payload);
  }
  loadDhlClientProfile(param: any): void {
    this.restApiService.loadDhlClientProfile(param).subscribe({
      next: result => this.dhlClientResult(result),
      error: err => console.error('DHL profile error:', err)
    });
  }
  async dhlClientResult(event: any[]): Promise<void> {
    // Reset
    this.clientList = [];
    this.auditCustomerListAC = [];

    // Admin flag
    this.adminFlag = event.length > 1 && this.adminFlag === true;

    // Filter customers
    event.forEach(customer => {
      if (customer.customertype === 'LJM_User') {
        this.clientList.push(customer);

        if (customer.auditcustomerstatus === 'Y') {
          this.auditCustomerListAC.push(customer);
        }
      }
    });

    // Admin carrier logic
    if (this.adminChooseCarrier && this.clientList.length) {
      await this.handleCarrierAdminSelection('dhl');
    }

    // Build dropdown options
    this.options = this.clientList.map(client => ({
      name: client.clientName
    }));

    this.ExecMatSelctFunctions();
  }
  private async handleCarrierAdminSelection(carrier: string): Promise<void> {
    const carrierTypeValue = (
      await localStorage.getItem('carrierTypevalue')
    )?.toLowerCase();

    if (!this.isCarrierAllowed(carrierTypeValue, carrier)) {
      return this.setClientAndReload(this.clientList[0]);
    }

    const cookieClientName = (
      await this.cookiesService.getCookie('clientName')
    )?.toLowerCase();

    const matchedClient =
      this.clientList.find(
        client => client.clientName.toLowerCase() === cookieClientName
      ) || this.clientList[0];

    this.setClientAndReload(matchedClient);
  }
  async getUserDhl(): Promise<void> {
    // Carrier cookie
    this.carrierTypeCookies = await this.cookiesService.getCookie('carrierType');

    // User profile
    const userProfileData = await this.commonService.getUserprofileData();
    this.userProfifle = userProfileData?.[0];

    if (!this.userProfifle) {
      return;
    }

    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    // Patch header form
    this.headerFormGroup.patchValue({
      t001ClientProfile: { ...this.userProfifle }
    });

    // DHL form
    this.headerFormGroupDhl.patchValue({
      clientId: this.clientID,
      carrierType: 'Dhl'
    });

    // Admin selection
    this.adminFormGroup.get('selectedClient')?.setValue(this.clientName);
    this.clientNameCtrl.setValue({ name: this.clientName });

    // Dates & misc
    this.fileStartDate = this.datePipe.transform(
      this.userProfifle.fileStartDate,
      'MM/dd/yyyy'
    );

    this.fileEndDate = this.userProfifle.fileEndDate;
    this.dataasof = this.userProfifle.dataasof;
    this.compareDataDateOne = this.userProfifle.dataasof;
    this.carrierType = this.userProfifle.carrierType;

    // Image URL
    this.clientNameRegex = this.clientName.replace(/\s/g, '');
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    this.ImageUrlData =
      `${this.ImageUrl}${this.clientNameRegex}.jpg?${randomNumber}`;

    // Account details
    await this.fetchDhlAccountDetails(this.clientID);

    // Theme
    this.panelClass =
      this.themeOption === 'dark'
        ? 'page-dark'
        : 'custom-dialog-panel-class';
  }
  fetchDhlAccountDetails(clientIdDhl: string): Promise<void> {
    const payload = {
      t001ClientProfile: { clientId: clientIdDhl }
    };

    return new Promise((resolve, reject) => {
      this.restApiService.fetchaccountDetails(payload).subscribe({
        next: (result: any) => {
          this.accountACDhl = result;
          this.accountCountDhl = result.length;
          resolve();
        },
        error: err => {
          console.error(err);
          reject(err);
        }
      });
    });
  }
  /********** End Dhl Code *************/

  /********** Start USPS Code *************/
  async fetchUserUSPS(): Promise<void> {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');

    if (this.adminAccess && this.loginCustomerType === 'LJM_User') {
      t001custObj.login_ParentClientId = this.adminAccess;
    }

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    const result = await this.loadUSPSClientProfile(t001custObj);
    this.uspsClientResult(result);
  }
  async loadUSPSClientProfile(param: any): Promise<any[]> {
    return await firstValueFrom(
      this.restApiService.loadUSPSClientProfile(param)
    );
  }
  uspsClientResult(event: any[]): void {
    this.clientList = [];
    this.auditCustomerListAC = [];

    this.adminFlag = event.length > 1 && this.adminFlag === true;

    for (const client of event) {
      if (client.customertype === 'LJM_User') {
        this.clientList.push(client);
      }

      if (
        client.customertype === 'LJM_User' &&
        client.auditcustomerstatus === 'Y'
      ) {
        this.auditCustomerListAC.push(client);
      }
    }

    this.handleAdminCarrierSelection();

    this.options = this.clientList.map(c => ({ name: c.clientName }));
    this.ExecMatSelctFunctions();
  }
  async getUserUSPS(): Promise<void> {
    this.carrierTypeCookies = await this.cookiesService.getCookie('carrierType');

    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = this.userProfifleData[0];

    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    this.headerFormGroup.patchValue({
      t001ClientProfile: { ...this.userProfifle }
    });

    this.headerFormGroupUSPS.get("clientId")?.setValue(this.clientID);
    this.headerFormGroupUSPS.get("carrierType")?.setValue("USPS");

    this.adminFormGroup.get("selectedClient")?.setValue(this.clientName);
    this.clientNameCtrl.setValue({ name: this.clientName });

    this.fileStartDate = this.datePipe.transform(
      this.userProfifle.fileStartDate,
      "MM/dd/yyyy"
    );

    this.fileEndDate = this.userProfifle.fileEndDate;
    this.dataasof = this.userProfifle.dataasof;
    this.compareDataDateOne = this.userProfifle.dataasof;
    this.carrierType = this.userProfifle.carrierType;

    this.clientNameRegex = this.clientName.replace(/\s/g, "");
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    this.ImageUrlData = `${this.ImageUrl}${this.clientNameRegex}.jpg?${randomNumber}`;

    this.panelClass =
      this.themeOption === "dark"
        ? "page-dark"
        : "custom-dialog-panel-class";
  }

  /********** End USPS Code *************/

  async chooseCarrier(projName: any) {
    debugger
    // let chooseCarrierType = this.cookiesService.getCarrierType();
    // if (chooseCarrierType.toUpperCase() == projName.toUpperCase())
    //   return;
    // const adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    // this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    // // ---------------- ADMIN (NON LJM USER) ----------------
    // if (adminAccess !== "" && this.loginCustomerType !== "LJM_User" && this.loginCustomerType !== "N") {
    //   this.cookiesService.clickCarrierType(projName);
    //   if (projName.toLowerCase() === "fedex") {
    //     this.carrierFedex();
    //   } else if (projName.toLowerCase() === "ontrac") {
    //     this.carrierOntrac();
    //   } else if (projName.toLowerCase() === "dhl") {
    //     this.carrierDhl();
    //   } else if (projName.toLowerCase() === "usps") {
    //     this.carrierUSPS();
    //   } else {
    //     this.carrierUps();
    //   }
    //   return;
    // }

    // // ---------------- NORMAL FLOW ----------------
    // const carrierName = localStorage.getItem('carrierType');
    // const carriertypevalue = localStorage.getItem('carrierTypevalue');
    // const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');
    // const data = JSON.parse(localStorage.getItem('logindata'));

    // if (carriertypevalue.toLowerCase().indexOf(projName.toLowerCase()) === -1) {
    //   this.openModal(
    //     this.clientName + " is not registered for " + (projName === 'Dhl' ? 'DHL' : projName)
    //   );
    //   this.clientType = currentCarrierType;
    //   return;
    // }

    // if (projName.toLowerCase() === "ups" && data.status.toLowerCase() === 'inactive') {
    //   this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
    //   return;
    // }

    // if (projName.toLowerCase() === "fedex" && data.statusFedex.toLowerCase() === 'inactive') {
    //   this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
    //   return;
    // }

    // if (projName.toLowerCase() === "ontrac" && data.statusOntrac.toLowerCase() === 'inactive') {
    //   this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
    //   return;
    // }

    // if (projName.toLowerCase() === "dhl" && data.statusDhl.toLowerCase() === 'inactive') {
    //   this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
    //   return;
    // }

    // if (projName.toLowerCase() === "usps" && data.statusUsps.toLowerCase() === 'inactive') {
    //   this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
    //   return;
    // }

    // this.cookiesService.clickCarrierType(projName);

    // // ---------------- NOTIFICATION COUNTS ----------------
    // if (projName.toLowerCase() === "ups") {
    //   this.cookiesService.setNotificationFlag(true);
    //   const count = this.cookiesService.getCookieItem('notificationCountUPS');
    //   this.cookiesService.setCookieItem('notificationCountUPS', count + 1);
    // }

    // if (projName.toLowerCase() === "fedex") {
    //   this.cookiesService.setNotificationFlag(true);
    //   const count = this.cookiesService.getCookieItem('notificationCountFedEx');
    //   this.cookiesService.setCookieItem('notificationCountFedEx', count + 1);
    // }

    // // ---------------- ADMIN (LJM USER / N) ----------------
    // if (adminAccess !== "" && (this.loginCustomerType === "LJM_User" || this.loginCustomerType === "N")) {

    //   if (projName.toLowerCase() === "fedex") {
    //     this.carrierFedex();
    //   } else if (projName.toLowerCase() === "ontrac") {
    //     this.carrierOntrac();
    //   } else if (projName.toLowerCase() === "dhl") {
    //     this.carrierDhl();
    //   } else if (projName.toLowerCase() === "usps") {
    //     this.carrierUSPS();
    //   } else {
    //     this.carrierUps();
    //   }

    // } else {
    //   this.cookiesService.setCookieItem('currentCarrierType', projName);
    //   this.urlRouteAndReload();
    // }
  }

  openModal(alertVal: string): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
  async carrierFedex() {
    this.adminChooseCarrier = true;
    await this.fetchUserChooseCarrier();
  }
  async fetchUserChooseCarrier(): Promise<void> {
    const t001custObj: any = {
      clientId: await this.cookiesService.getCookieAdmin('fedexId')
    };

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    this.restApiService.fetchUser(t001custObj).subscribe(
      (result: any) => this.fedExUserResultChooseCarrier(result),
      error => console.log('error', error)
    );
  }
  async fedExUserResultChooseCarrier(event: any[]): Promise<void> {
    const t002FedexClientAC = event;
    const t002ClntObj: any = {};

    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = (await this.cookiesService.getCookie('currentCarrierType'))?.toUpperCase();

    if (currentCarrierType === 'UPS') {
      t002ClntObj.upsClientId = clientId;
    } else if (currentCarrierType === 'ONTRAC') {
      t002ClntObj.ontracClientId = clientId;
    } else if (currentCarrierType === 'DHL') {
      t002ClntObj.dhlClientId = clientId;
    } else if (currentCarrierType === 'USPS') {
      t002ClntObj.uspsClientId = clientId;
    }

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      result => {
        const fedExClientId = result?.[0]?.fedexClientId;
        this.fedexClientLoginCredentialResultChooseCarrier(
          t002FedexClientAC,
          fedExClientId
        );
      },
      error => console.log('error', error)
    );
  }
  async fedexClientLoginCredentialResultChooseCarrier(
    t002FedexClientAC: any[],
    fedExClientId: any
  ): Promise<void> {

    this.clientList = [];
    for (var loop = 0; loop < t002FedexClientAC.length; loop++) {
      if (t002FedexClientAC[loop].adminFlag != "Y") {
        this.clientList.push(t002FedexClientAC[loop]);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" ||
        carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex" || carriertypevalue.toLowerCase() == "fedex~ontrac" || carriertypevalue.toLowerCase() == "fedex~dhl" || carriertypevalue.toLowerCase() == "fedex~usps") {

        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientId == fedExClientId) {
            checkActiveStatus = true;
            await this.cookiesService.setCookie(this.clientList[loop])
            this.urlRouteAndReload();

          }
        }
        if (checkActiveStatus == false) {
          await this.cookiesService.setCookie(this.clientList[0])
          this.urlRouteAndReload();

        }

      }
      else {
        await this.cookiesService.setCookie(this.clientList[0])
        this.urlRouteAndReload();

      }
    }

    for (var loop = 0; loop < this.clientList.length; loop++) {
      var clientObj: any = {};
      clientObj['name'] = this.clientList[loop].clientName;
      this.options.push(clientObj);
    }
    this.ExecMatSelctFunctions();
  }

  async carrierUps() {
    this.adminChooseCarrier = true;
    await this.fetchUPSalluserChooseCarrier();
  }
  async fetchUPSalluserChooseCarrier(): Promise<void> {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');

    if (this.adminAccess && this.loginCustomerType === 'LJM_User') {
      t001custObj.login_ParentClientId = this.adminAccess;
    }

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');

    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    await this.loadClientProfileChooseCarrier(t001custObj);
  }
  async loadClientProfileChooseCarrier(param: any): Promise<void> {
    this.restApiService.loadClientProfile(param).subscribe({
      next: result => this.allClientresultnewChooseCarrier(result),
      error: err => console.log('error ', err)
    });
  }
  async allClientresultnewChooseCarrier(event: any[]): Promise<void> {
    const customerList = event;
    const t002ClntObj: any = {};

    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = (await this.cookiesService.getCookie('currentCarrierType')).toUpperCase();

    if (currentCarrierType === 'FEDEX') {
      t002ClntObj.fedexClientId = clientId;
    } else if (currentCarrierType === 'ONTRAC') {
      t002ClntObj.ontracClientId = clientId;
    } else if (currentCarrierType === 'DHL') {
      t002ClntObj.dhlClientId = clientId;
    } else if (currentCarrierType === 'USPS') {
      t002ClntObj.uspsClientId = clientId;
    }

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe({
      next: result => {
        const upsClientId = result[0].upsClientId;
        this.upsClientLoginCredentialResultChooseCarrier(customerList, upsClientId);
      },
      error: err => console.log('error ', err)
    });
  }

  async upsClientLoginCredentialResultChooseCarrier(
    customerList: any[],
    UPS_ClientId: string
  ): Promise<void> {

    this.clientList = [];
    this.auditCustomerListAC = [];

    this.adminFlag = customerList.length > 1 && this.adminFlag === true;

    for (const customer of customerList) {
      if (customer.customertype === 'LJM_User') {
        this.clientList.push(customer);
      }
      if (
        customer.customertype === 'LJM_User' &&
        customer.auditcustomerstatus === 'Y'
      ) {
        this.auditCustomerListAC.push(customer);
      }
    }

    if (this.adminChooseCarrier === true) {
      const carriertypevalue = (await localStorage.getItem('carrierTypevalue')).toLowerCase();

      const multiCarrierTypes = [
        'both',
        'ups~fedex~ontrac~dhl~usps',
        'ups~fedex~ontrac~dhl',
        'ups~fedex~ontrac~usps',
        'ups~fedex~dhl~usps',
        'ups~ontrac~dhl~usps',
        'ups~fedex~ontrac',
        'ups~fedex~dhl',
        'ups~fedex~usps',
        'ups~ontrac~dhl',
        'ups~ontrac~usps',
        'ups~dhl~usps',
        'ups~fedex',
        'ups~ontrac',
        'ups~dhl',
        'ups~usps'
      ];

      if (multiCarrierTypes.includes(carriertypevalue)) {
        let isActive = false;

        for (const client of this.clientList) {
          if (client.clientId === UPS_ClientId) {
            isActive = true;
            await this.cookiesService.setCookie(client)
            this.urlRouteAndReload();

          }
        }

        if (!isActive && this.clientList.length > 0) {
          await this.cookiesService.setCookie(this.clientList[0])
          this.urlRouteAndReload();

        }
      } else if (this.clientList.length > 0) {
        await this.cookiesService.setCookie(this.clientList[0])
        this.urlRouteAndReload();

      }
    }

    for (const client of this.clientList) {
      this.options.push({ name: client.clientName });
    }

    this.ExecMatSelctFunctions();
  }
  async carrierOntrac() {
    this.adminChooseCarrier = true;
    await this.fetchOnTracalluserChooseCarrier();
  }
  async fetchOnTracalluserChooseCarrier(): Promise<void> {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess && this.loginCustomerType === 'LJM_User') {
      t001custObj.login_ParentClientId = this.adminAccess;
    }

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    this.loadOnTracClientProfileChooseCarrier(t001custObj);
  }
  async loadOnTracClientProfileChooseCarrier(param: any): Promise<void> {
    this.restApiService.loadOnTracClientProfile(param).subscribe({
      next: result => this.allClientOnTracResultChooseCarrier(result),
      error: err => console.log('error ', err)
    });
  }
  async allClientOnTracResultChooseCarrier(customerList: any[]): Promise<void> {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = (await this.cookiesService.getCookie('currentCarrierType')).toUpperCase();

    if (currentCarrierType === 'UPS') {
      t002ClntObj.upsClientId = clientId;
    } else if (currentCarrierType === 'FEDEX') {
      t002ClntObj.fedexClientId = clientId;
    } else if (currentCarrierType === 'DHL') {
      t002ClntObj.dhlClientId = clientId;
    } else if (currentCarrierType === 'USPS') {
      t002ClntObj.uspsClientId = clientId;
    }

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe({
      next: (result: any) => {
        const onTracClientId = result[0].ontracClientId;
        this.ontracClientLoginCredentialResultChooseCarrier(customerList, onTracClientId);
      },
      error: (err: any) => console.log('error ', err)
    });
  }
  async ontracClientLoginCredentialResultChooseCarrier(
    customerList: any[],
    onTracClientId: string
  ): Promise<void> {

    this.clientList = [];
    this.auditCustomerListAC = [];

    this.adminFlag = customerList.length > 1 && this.adminFlag === true;

    for (const customer of customerList) {
      if (customer.customertype === 'LJM_User') {
        this.clientList.push(customer);
      }
      if (
        customer.customertype === 'LJM_User' &&
        customer.auditcustomerstatus === 'Y'
      ) {
        this.auditCustomerListAC.push(customer);
      }
    }

    if (this.adminChooseCarrier) {
      const carrierTypeValue = (await localStorage.getItem('carrierTypevalue')).toLowerCase();

      const allowedCarrierTypes = [
        'both',
        'ups~fedex~ontrac~dhl~usps',
        'ups~fedex~ontrac~dhl',
        'ups~fedex~ontrac~usps',
        'ups~ontrac~dhl~usps',
        'fedex~ontrac~dhl~usps',
        'ups~fedex~ontrac',
        'ups~ontrac~dhl',
        'fedex~ontrac~dhl',
        'ups~ontrac~usps',
        'fedex~ontrac~usps',
        'ontrac~dhl~usps',
        'ups~ontrac',
        'fedex~ontrac',
        'ontrac~dhl',
        'ontrac~usps'
      ];

      if (allowedCarrierTypes.includes(carrierTypeValue)) {
        let activeFound = false;

        for (const client of this.clientList) {
          if (client.clientId === onTracClientId) {
            activeFound = true;
            await this.cookiesService.setCookie(client)
            this.urlRouteAndReload();

          }
        }

        if (!activeFound && this.clientList.length > 0) {
          await this.cookiesService.setCookie(this.clientList[0])
          this.urlRouteAndReload();

        }
      } else if (this.clientList.length > 0) {
        await this.cookiesService.setCookie(this.clientList[0])
        this.urlRouteAndReload();

      }
    }

    for (const client of this.clientList) {
      this.options.push({ name: client.clientName });
    }

    this.ExecMatSelctFunctions();
  }

  async carrierDhl() {
    this.adminChooseCarrier = true;
    await this.fetchDhlalluserChooseCarrier();
  }
  async fetchDhlalluserChooseCarrier(): Promise<void> {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess && this.loginCustomerType === 'LJM_User') {
      t001custObj.login_ParentClientId = this.adminAccess;
    }

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    this.loadDhlClientProfileChooseCarrier(t001custObj);
  }
  async loadDhlClientProfileChooseCarrier(param: any): Promise<void> {
    this.restApiService.loadDhlClientProfile(param).subscribe({
      next: result => this.allClientDhlResultChooseCarrier(result),
      error: err => console.log('error ', err)
    });
  }
  async allClientDhlResultChooseCarrier(customerList: any[]): Promise<void> {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = (await this.cookiesService.getCookie('currentCarrierType')).toUpperCase();

    switch (currentCarrierType) {
      case 'UPS':
        t002ClntObj.upsClientId = clientId;
        break;
      case 'FEDEX':
        t002ClntObj.fedexClientId = clientId;
        break;
      case 'ONTRAC':
        t002ClntObj.ontracClientId = clientId;
        break;
      case 'USPS':
        t002ClntObj.uspsClientId = clientId;
        break;
    }

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe({
      next: result => {
        const dhlClientId = result[0].dhlClientId;
        this.dhlClientLoginCredentialResultChooseCarrier(customerList, dhlClientId);
      },
      error: err => console.log('error ', err)
    });
  }
  async dhlClientLoginCredentialResultChooseCarrier(
    customerList: any[],
    dhlClientId: string
  ): Promise<void> {

    this.clientList = [];
    this.auditCustomerListAC = [];

    this.adminFlag = customerList.length > 1 && this.adminFlag === true;

    for (const customer of customerList) {
      if (customer.customertype === 'LJM_User') {
        this.clientList.push(customer);
      }
      if (
        customer.customertype === 'LJM_User' &&
        customer.auditcustomerstatus === 'Y'
      ) {
        this.auditCustomerListAC.push(customer);
      }
    }

    if (this.adminChooseCarrier) {
      const carrierTypeValue = (await localStorage.getItem('carrierTypevalue')).toLowerCase();

      const allowedCarrierTypes = [
        'both',
        'ups~fedex~ontrac~dhl~usps',
        'ups~fedex~ontrac~dhl',
        'ups~fedex~dhl~usps',
        'ups~ontrac~dhl~usps',
        'fedex~ontrac~dhl~usps',
        'ups~fedex~dhl',
        'ups~dhl~usps',
        'ups~ontrac~dhl',
        'fedex~ontrac~dhl',
        'fedex~dhl~usps',
        'ontrac~dhl~usps',
        'ups~dhl',
        'fedex~dhl',
        'ontrac~dhl',
        'dhl~usps'
      ];

      if (allowedCarrierTypes.includes(carrierTypeValue)) {
        let activeFound = false;

        for (const client of this.clientList) {
          if (client.clientId === dhlClientId) {
            activeFound = true;
            await this.cookiesService.setCookie(client)
            this.urlRouteAndReload();

          }
        }

        if (!activeFound && this.clientList.length) {
          await this.cookiesService.setCookie(this.clientList[0])
          this.urlRouteAndReload();

        }
      } else if (this.clientList.length) {
        await this.cookiesService.setCookie(this.clientList[0])
        this.urlRouteAndReload();

      }
    }

    this.options.push(
      ...this.clientList.map(c => ({ name: c.clientName }))
    );

    this.ExecMatSelctFunctions();
  }

  async carrierUSPS() {
    this.adminChooseCarrier = true;
    await this.fetchUSPSalluserChooseCarrier();
  }
  async fetchUSPSalluserChooseCarrier(): Promise<void> {
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess && this.loginCustomerType === 'LJM_User') {
      t001custObj.login_ParentClientId = this.adminAccess;
    }

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType === 'USER' && loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    this.loadUSPSClientProfileChooseCarrier(t001custObj);
  }
  async loadUSPSClientProfileChooseCarrier(param: any): Promise<void> {
    this.restApiService.loadUSPSClientProfile(param).subscribe({
      next: result => this.allClientUSPSResultChooseCarrier(result),
      error: err => console.log('error ', err)
    });
  }
  async allClientUSPSResultChooseCarrier(customerList: any[]): Promise<void> {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = (await this.cookiesService.getCookie('currentCarrierType')).toUpperCase();

    switch (currentCarrierType) {
      case 'UPS':
        t002ClntObj.upsClientId = clientId;
        break;
      case 'FEDEX':
        t002ClntObj.fedexClientId = clientId;
        break;
      case 'ONTRAC':
        t002ClntObj.ontracClientId = clientId;
        break;
      case 'DHL':
        t002ClntObj.dhlClientId = clientId;
        break;
    }

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe({
      next: result => {
        const uspsClientId = result[0].uspsClientId;
        this.uspsClientLoginCredentialResultChooseCarrier(customerList, uspsClientId);
      },
      error: err => console.log('error ', err)
    });
  }
  async uspsClientLoginCredentialResultChooseCarrier(
    customerList: any[],
    uspsClientId: string
  ): Promise<void> {

    this.clientList = [];
    this.auditCustomerListAC = [];

    this.adminFlag = customerList.length > 1 && this.adminFlag === true;

    for (const customer of customerList) {
      if (customer.customertype === 'LJM_User') {
        this.clientList.push(customer);
      }
      if (
        customer.customertype === 'LJM_User' &&
        customer.auditcustomerstatus === 'Y'
      ) {
        this.auditCustomerListAC.push(customer);
      }
    }

    if (this.adminChooseCarrier) {
      const carrierTypeValue = (await this.cookieService.get('carrierTypevalue')).toLowerCase();

      const allowedCarrierTypes = [
        'both',
        'ups~fedex~ontrac~dhl~usps',
        'ups~fedex~ontrac~usps',
        'ups~fedex~dhl~usps',
        'ups~ontrac~dhl~usps',
        'fedex~ontrac~dhl~usps',
        'ups~fedex~usps',
        'ups~ontrac~usps',
        'ups~dhl~usps',
        'fedex~ontrac~usps',
        'fedex~dhl~usps',
        'ontrac~dhl~usps',
        'ups~usps',
        'fedex~usps',
        'ontrac~usps',
        'dhl~usps'
      ];

      if (allowedCarrierTypes.includes(carrierTypeValue)) {
        let activeFound = false;

        for (const client of this.clientList) {
          if (client.clientId === uspsClientId) {
            activeFound = true;
            await this.cookiesService.setCookie(client)
            this.urlRouteAndReload();

          }
        }

        if (!activeFound && this.clientList.length) {
          await this.cookiesService.setCookie(this.clientList[0])
          this.urlRouteAndReload();

        }
      } else if (this.clientList.length) {
        await this.cookiesService.setCookie(this.clientList[0])
        this.urlRouteAndReload();

      }
    }

    this.options.push(
      ...this.clientList.map(c => ({ name: c.clientName }))
    );

    this.ExecMatSelctFunctions();
  }





















  /**  * Topbar Light-Dark Mode Change  */
  changeMode(mode: string) {
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
      case 'dark':
        document.documentElement.setAttribute('data-bs-theme', "dark");
        break;
      default:
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
    }
  }
  /**  * Toggle the menu bar when having mobile screen   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
  /**  * Logout the user   */
  logout() {
    var loginId = this.cookiesService.getCookie('loginId');
    var t100_TLoginObj: any = {};
    t100_TLoginObj["loginId"] = loginId;
    this.saveOrUpdateLogout(t100_TLoginObj);
    this.cookiesService.deleteCookie();
    window.location.reload();
    this.cookiesService.auth(false);
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  async saveOrUpdateLogout(t100_TLoginObj: any) {
    this.httpClientService.saveOrUpdateLogout(t100_TLoginObj).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log('error ', error);
      })
  }
  /**   * Fullscreen method  */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
  windowScroll() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow');
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow');
    }
  }


  toggleAllSelection() {
    if (this.allSelectedValue.selected) {
      this.accNoSel.options.forEach((item: MatOption) => { item.deselect(); });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.headerControllerFormGroup.get('accNo')?.setValue(setAllvalue);

    }
  }
  toggleSelection() {
    var accvalue = this.headerControllerFormGroup.get('accNo')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValue.deselect();
    }
  }

  toggleAllSelectionFedEx() {
    if (this.allSelectedValueFedEx.selected) {
      this.accNoSelFedEx.options.forEach((item: MatOption) => { item.deselect() });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.headerControllerFormGroup.get('accNumber')?.setValue(setAllvalue);
    }
  }
  toggleSelectionFedEx() {
    var accvalue = this.headerControllerFormGroup.get('accNumber')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValueFedEx.deselect();
    }
  }

  compareTwoDates() {
    var dateFr = this.headerControllerFormGroup.get("fromDate")?.value;
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var fedexdateFr = this.headerControllerFormGroup.get("fedexfromDate")?.value;
    var fedexdateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateT = this.headerControllerFormGroup.get("toDate")?.value;
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    var fedexdateT = this.headerControllerFormGroup.get("toDate")?.value;
    var fedexdateToYear = this.datePipe.transform(dateT, "yyyy");
    if (dateFromYear != dateToYear) {
      this.openModal("Please Select Same Year Range for From Date and To Date");
      return false;
    }
    if (fedexdateFromYear != fedexdateToYear) {
      this.openModal("Please Select Same Year Range for From Date and To Date");
      return false;
    }
    return true;
  }

  compare() {
    var boolRes = this.compareTwoDates();
    if (boolRes != false) {
      var x = Math.floor((Math.random() * 10) + 1);

      var dateFr = this.headerControllerFormGroup.get("fromDate")?.value;
      let dateFrom: any = this.datePipe.transform(dateFr, "yyyy-MM-dd");
      var dateT = this.headerControllerFormGroup.get("toDate")?.value;
      let dateTo: any = this.datePipe.transform(dateT, "yyyy-MM-dd");
      var dateFrFedex = this.headerControllerFormGroup.get("fedexfromDate")?.value;
      let dateFromFedex: any = this.datePipe.transform(dateFrFedex, "yyyy-MM-dd");
      var dateTFedex = this.headerControllerFormGroup.get("fedextoDate")?.value;
      var dateToFedex = this.datePipe.transform(dateTFedex, "yyyy-MM-dd");
      this.datePipe.transform(dateT, "yyyy-MM-dd");
      this.headerControllerFormGroup.patchValue({
        dateRange: { "start": new Date(dateFrom), "end": new Date(dateTo) }
      });
      this.commonService.setDatesFunction(dateFrom, dateTo, dateFromFedex, dateToFedex);
      var accArrUps = this.headerControllerFormGroup.get("accNo")?.value
      var accArrFedex = this.headerControllerFormGroup.get("accNumber")?.value
      this.commonService.emitAccValuesFunction(accArrUps, accArrFedex)
      if (this.bool == false) {
        this.router.navigate(['/compareanalysis']);
        this.bool = true;
      }
      else {
        this.router.navigate(['/compareanalysis', x]);
        this.bool = false;
      }
    }
  }


}
