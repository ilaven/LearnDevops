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
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { allNotification, messages } from './data'
import { CartModel } from './topbar.model';
import { cartData } from './data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup } from '@angular/forms';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { firstValueFrom, map, Observable, ReplaySubject, startWith, Subject, take, takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpDhlService } from 'src/app/core/services/httpdhl.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { CommonService } from 'src/app/core/services/common.service';
import { MatSelect, MatOption } from '@angular/material/select';
import { restApiService } from 'src/app/core/services/rest-api.service';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: false
})
export class TopbarComponent implements OnInit {
  // Multi-select for UPS accounts
  @ViewChild('allSelectedValue') private allSelectedValue!: MatOption;
  @ViewChild('accNoSel') private accNoSel!: MatSelect;

  // Multi-select for FedEx accounts
  @ViewChild('allSelectedValueFedEx') private allSelectedValueFedEx!: MatOption;
  @ViewChild('accNoSelFedEx') private accNoSelFedEx!: MatSelect;

  // Searchable select
  @ViewChild('singleSelect') singleSelect!: MatSelect;

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

  carrierList: any = [
    { name: 'UPS', value: 'UPS' },
    { name: 'FedEx', value: 'FedEx' },
    { name: 'OnTrac', value: 'OnTrac' },
    { name: 'DHL', value: 'Dhl' },
    { name: 'USPS', value: 'USPS' },
  ];

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
  filteredOptions!: Observable<any[]>;
  public clientNameCtrl: FormControl = new FormControl();
  public clientNameFilterCtrl: FormControl = new FormControl();
  public filteredClients: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  private _onDestroy = new Subject<void>();

  // compare navigation toggle
  bool = false;


  messages: any
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();
  allnotifications: any
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  userData: any;
  cartData!: CartModel[];
  total = 0;
  cart_length: any = 0;
  totalNotify: number = 0;
  newNotify: number = 0;
  readNotify: number = 0;
  isDropdownOpen = false;
  @ViewChild('removenotification') removenotification !: TemplateRef<any>;
  notifyId: any;

  constructor(@Inject(DOCUMENT) private document: any,
    private eventService: EventService, public languageService: LanguageService,
    private modalService: NgbModal,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private authFackservice: AuthfakeauthenticationService,
    private TokenStorageService: TokenStorageService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private cookiesService: CookiesService,
    private switchProj: SwitchProjectService,
    private commonService: CommonService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private restApiService: restApiService,
    private domSanitizer: DomSanitizer
  ) {

    // this.matIconRegistry.addSvgIcon(
    //   'logout',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl(
    //     '../app-assets/images/maticon/logout.svg'
    //   )
    // );

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






  async ngOnInit() {
    //theme Code
    this.userData = this.TokenStorageService.getUser();
    this.element = document.documentElement;

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/images/flags/us.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }

    // Fetch Data
    this.allnotifications = allNotification;

    this.messages = messages;
    this.cartData = cartData;
    this.cart_length = this.cartData.length;
    this.cartData.forEach((item) => {
      var item_price = item.quantity * item.price
      this.total += item_price
    });
    //theme Code



    this.commonService.emittedContractParam.subscribe((res) => {
      this.clickCompareFun(res);
    });

    this.currentDate = new Date();
    this.getThemeOption();
    await this.getCookieAdmin();

    this.initDefaultDateRange();

    // Boot by current carrier type
    const carrier = this.normalizeCarrier(this.clientType || 'UPS');
    this.chooseCarrierFlag = this.displayCarrier(carrier);

    await this.loadCarrierClientList(carrier);
    await this.loadUserProfile(carrier);

    // init method (accounts init based on carrierTypevalue cookie)
    await this.initMethodUps_Fedex();

    // autocomplete filtering (admin select)
    this.filteredOptions = this.adminFormGroup.get('selectedClient')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSelectedClientValue(value))
    );
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // ---------------------------
  // Helpers (Cleaned)
  // ---------------------------

  private normalizeCarrier(v: string) {
    const x = (v || '').toLowerCase();
    if (x.includes('fedex')) return 'fedex';
    if (x.includes('ontrac')) return 'ontrac';
    if (x.includes('dhl')) return 'dhl';
    if (x.includes('usps')) return 'usps';
    return 'ups';
  }

  private displayCarrier(carrier: any): string {
    switch (carrier) {
      case 'fedex': return 'FedEx';
      case 'ontrac': return 'OnTrac';
      case 'dhl': return 'Dhl';
      case 'usps': return 'USPS';
      default: return 'UPS';
    }
  }

  private includesCarrier(all: string, carrier: any): boolean {
    const v = (all || '').toLowerCase();
    if (!v) return false;
    if (v === 'both') return true;
    return v.split('~').includes(carrier);
  }

  private isCarrierInactive(carrier: any, data: any): boolean {
    const map: Record<any, string> = {
      ups: 'status',
      fedex: 'statusFedex',
      ontrac: 'statusOntrac',
      dhl: 'statusDhl',
      usps: 'statusUsps',
    };
    const key = map[carrier];
    return ((data?.[key] || '').toLowerCase() === 'inactive');
  }

  private patchClientProfile(profile: any) {
    if (!profile) return;
    this.headerFormGroup.patchValue({
      t001ClientProfile: { ...profile },
    });
  }

  private initDefaultDateRange() {
    const date = new Date();
    const monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);

    this.toDate = this.datePipe.transform(monthEndDay, 'yyyy-MM-dd');
    this.fromDate = this.datePipe.transform(monthStartDay, 'yyyy-MM-dd');

    this.headerControllerFormGroup.get('fromDate')!.setValue(new Date(monthStartDay.toString()));
    this.headerControllerFormGroup.get('toDate')!.setValue(new Date(monthEndDay.toString()));

    this.headerControllerFormGroup.get('fedexfromDate')!.setValue(new Date(monthStartDay.toString()));
    this.headerControllerFormGroup.get('fedextoDate')!.setValue(new Date(monthEndDay.toString()));
  }

  private refreshPanelClass() {
    this.panelClass = this.themeOption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';
  }

  private async applyUserProfileCommon() {
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = this.userProfifleData?.[0];

    this.clientID = this.userProfifle?.clientId;
    this.clientName = this.userProfifle?.clientName;

    this.patchClientProfile(this.userProfifle);

    this.adminFormGroup.get('selectedClient')!.setValue(this.clientName);
    this.clientNameCtrl.setValue({ name: this.clientName });

    this.fileStartDate = this.datePipe.transform(this.userProfifle?.fileStartDate, 'MM/dd/yyyy');
    this.fileEndDate = this.userProfifle?.fileEndDate;
    this.dataasof = this.userProfifle?.dataasof;
    this.compareDataDateOne = this.userProfifle?.dataasof;
    this.carrierType = this.userProfifle?.carrierType;

    this.clientNameRegex = (this.clientName || '').replace(/\s/g, '');
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    this.ImageUrlData = `${this.ImageUrl}${this.clientNameRegex}.jpg?${randomNumber}`;

    this.refreshPanelClass();
  }

  // ---------------------------
  // Account multi-select toggles (unchanged)
  // ---------------------------

  toggleAllSelection() {
    if (this.allSelectedValue?.selected) {
      this.accNoSel.options.forEach((item: MatOption) => item.deselect());
      this.headerControllerFormGroup.get('accNo')!.setValue(['ALL']);
    }
  }

  toggleSelection() {
    const accvalue = this.headerControllerFormGroup.get('accNo')!.value;
    if (accvalue?.[0] === 'ALL' && accvalue?.[1] !== 'undefined') {
      this.allSelectedValue?.deselect();
    }
  }

  toggleAllSelectionFedEx() {
    if (this.allSelectedValueFedEx?.selected) {
      this.accNoSelFedEx.options.forEach((item: MatOption) => item.deselect());
      this.headerControllerFormGroup.get('accNumber')!.setValue(['ALL']);
    }
  }

  toggleSelectionFedEx() {
    const accvalue = this.headerControllerFormGroup.get('accNumber')!.value;
    if (accvalue?.[0] === 'ALL' && accvalue?.[1] !== 'undefined') {
      this.allSelectedValueFedEx?.deselect();
    }
  }

  // ---------------------------
  // Theme
  // ---------------------------
  async getThemeOption() {
    this.themeOption = await this.cookiesService.getCookie('themeOption');
    this.refreshPanelClass();
  }

  async setThemeOption(themeName: string) {
    // this.cookiesService.setCookietheme(themeName);
    // const mainClientId = await this.cookiesService.getCookie('clientId').then((res) => res);
    // this.apiControllerFormGroup.get('clientId')!.setValue(mainClientId);
    // this.apiControllerFormGroup.get('theme_option')!.setValue(themeName);

    // this.httpClientService.UpdateTheme_ClientProfile(this.apiControllerFormGroup.value).subscribe((data) => {
    //   if (data != null) window.location.reload();
    // });
  }

  // ---------------------------
  // Admin cookie
  // ---------------------------
  async getCookieAdmin() {
    this.adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    this.adminFlag = this.adminAccess !== '';
  }

  // ---------------------------
  // Init accounts based on carrierTypevalue cookie
  // ---------------------------
  async initMethodUps_Fedex() {
    const carrierTypeValue = await this.getCarrierType();
    const v = (carrierTypeValue || '').toLowerCase();

    if (v.includes('ups')) await this.fetchUPSalluserInitUps();
    if (v.includes('fedex')) await this.fetchUserInitFedex();
    if (v.includes('ontrac')) await this.fetchUserInitOntrac();
    if (v.includes('dhl')) await this.fetchUserInitDhl();
    if (v.includes('usps')) await this.fetchUserInitUsps();
  }

  async getCarrierType() {
    return await localStorage.getItem('carrierTypevalue');
  }

  // ---------------------------
  // Compare helpers
  // ---------------------------
  async functionDateAsOFUPS() {
    this.restApiService.fetchFedExComparisionReportadataAsOf(this.headerFormGroupUPS.value).subscribe(
      (result: any) => {
        const resultDate = result?.clientId;
        this.getProfileData(resultDate);
      }
    );
  }

  async getProfileData(clientid: any) {
    const userDataObj: any = { clientId: clientid };
    const clientProfile: any = await firstValueFrom(this.restApiService.fetchUser(userDataObj));
    const resultData = clientProfile?.[0]?.fileenddate1 || '';
    const strYear = resultData.substring(0, 4);
    const strMonth = resultData.substring(4, 6);
    const strDate = resultData.substring(6, 8);
    const dataasof = `${strYear}-${strMonth}-${strDate}`;
    this.compareDataDate(dataasof);
  }

  async compareDataDate(event: any) {
    this.compareDataDateTwo = this.datePipe.transform(event, 'MM/dd/yyyy');
    if ((this.clientType || '').toUpperCase() === 'UPS') {
      this.endDateUps = new Date(this.datePipe.transform(this.compareDataDateOne, 'MM/dd/yyyy') as any);
      this.endDate = new Date(this.compareDataDateTwo);
    } else {
      this.endDate = new Date(this.datePipe.transform(this.compareDataDateOne, 'MM/dd/yyyy') as any);
      this.endDateUps = new Date(this.compareDataDateTwo);
    }
  }

  async functionDateAsOFFedex() {
    this.restApiService.fetchUPSComparisionReportadataAsOf(this.headerFormGroupFedEx.value).subscribe(
      (result: any) => {
        const resultDate = result?.[0]?.dataasof;
        this.compareDataDate(resultDate);
      }
    );
  }

  // ---------------------------
  // Main: load client list + user profile for a carrier
  // ---------------------------
  private async loadCarrierClientList(carrier: any) {
    switch (carrier) {
      case 'fedex': return this.fetchUser(); // existing behavior
      case 'ontrac': return this.fetchUserOnTrac();
      case 'dhl': return this.fetchUserDhl();
      case 'usps': return this.fetchUserUSPS();
      default: return this.fetchUPSalluser();
    }
  }

  private async loadUserProfile(carrier: any) {
    switch (carrier) {
      case 'fedex': return this.getUserFedex();
      case 'ontrac': return this.getUserOnTrac();
      case 'dhl': return this.getUserDhl();
      case 'usps': return this.getUserUSPS();
      default: return this.getUser();
    }
  }

  // ---------------------------
  // Client list fetchers (CLEANED + DE-DUPED payload building)
  // ---------------------------

  private buildCommonClientListPayload(): any {
    const obj: any = { status: 'ACTIVE', lazyLoad: 'N' };

    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess !== '' && this.loginCustomerType === 'LJM_User') {
      obj['login_ParentClientId'] = this.adminAccess;
    }

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType !== '' && this.crmUserType === 'USER' && loginEmailId !== '') {
      obj['email'] = loginEmailId;
    }

    return obj;
  }

  async fetchUser() {
    const t001custObj: any = {};
    t001custObj['clientId'] = await this.cookiesService.getCookieAdmin('fedexId').then((res) => res);

    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType !== '' && this.crmUserType === 'USER' && loginEmailId !== '') {
      t001custObj['email'] = loginEmailId;
    }

    this.restApiService.fetchUser(t001custObj).subscribe(
      (result: any) => this.fedExUserResult(result),
      (error: any) => console.log('error ', error)
    );
  }

  async fetchUserOnTrac() {
    const payload = this.buildCommonClientListPayload();
    await this.loadOnTracClientProfile(payload);
  }

  async loadOnTracClientProfile(param: any) {
    this.restApiService.loadOnTracClientProfile(param).subscribe(
      (result: any) => this.onTracClientResult(result),
      (error: any) => console.log('error ', error)
    );
  }

  async fetchUserDhl() {
    const payload = this.buildCommonClientListPayload();
    await this.loadDhlClientProfile(payload);
  }

  async loadDhlClientProfile(param: any) {
    this.restApiService.loadDhlClientProfile(param).subscribe(
      (result: any) => this.dhlClientResult(result),
      (error: any) => console.log('error ', error)
    );
  }

  async fetchUserUSPS() {
    const payload = this.buildCommonClientListPayload();
    await this.loadUSPSClientProfile(payload);
  }

  async loadUSPSClientProfile(param: any) {
    this.restApiService.loadUSPSClientProfile(param).subscribe(
      (result: any) => this.uspsClientResult(result),
      (error: any) => console.log('error ', error)
    );
  }

  async fetchUPSalluser() {
    const payload = this.buildCommonClientListPayload();
    await this.loadClientProfile(payload);
  }

  async loadClientProfile(param: any) {
    this.restApiService.loadClientProfile(param).subscribe(
      (result: any) => this.allClientresultnew(result),
      (error: any) => console.log('error ', error)
    );
  }

  // ---------------------------
  // Client list result handlers (UPS/OnTrac/Dhl/USPS unified style)
  // ---------------------------
  private handleClientListCommon(event: any[]) {
    const customerList = event || [];
    this.clientList = [];
    this.auditCustomerListAC = [];

    // admin flag logic
    if (customerList.length > 1 && this.adminFlag === true) this.adminFlag = true;
    else this.adminFlag = false;

    for (let loop = 0; loop < customerList.length; loop++) {
      const t002Obj = customerList[loop];
      if (t002Obj?.customertype === 'LJM_User') this.clientList.push(t002Obj);
      if (t002Obj?.customertype === 'LJM_User' && t002Obj?.auditcustomerstatus === 'Y') {
        this.auditCustomerListAC.push(t002Obj);
      }
    }

    // fill options for dropdown
    this.options = this.options || [];
    for (let loop = 0; loop < this.clientList.length; loop++) {
      this.options.push({ name: this.clientList[loop].clientName });
    }

    this.ExecMatSelctFunctions();
  }

  async onTracClientResult(event: any) {
    this.handleClientListCommon(event);
    await this.adminChooseCarrierReloadIfNeeded();
  }

  async dhlClientResult(event: any) {
    this.handleClientListCommon(event);
    await this.adminChooseCarrierReloadIfNeeded();
  }

  async uspsClientResult(event: any) {
    this.handleClientListCommon(event);
    await this.adminChooseCarrierReloadIfNeeded();
  }

  async allClientresultnew(event: any) {
    this.handleClientListCommon(event);
    await this.adminChooseCarrierReloadIfNeeded();
  }

  // FedEx has special filtering adminFlag != "Y"
  async fedExUserResult(event: any) {
    const list = event || [];
    this.clientList = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i]?.adminFlag !== 'Y') this.clientList.push(list[i]);
    }

    // build options
    this.options = this.options || [];
    for (let loop = 0; loop < this.clientList.length; loop++) {
      this.options.push({ name: this.clientList[loop].clientName });
    }

    this.ExecMatSelctFunctions();
    await this.adminChooseCarrierReloadIfNeeded();
  }

  // When adminChooseCarrier is true, you were reloading and setting cookie based on allowed carrier list.
  // This function keeps the same behavior: if current cookie clientName exists in list, keep it; else set first.
  private async adminChooseCarrierReloadIfNeeded() {
    if (!this.adminChooseCarrier) return;

    const carriertypevalue = (await localStorage.getItem('carrierTypevalue')) || '';
    const clientName = await this.cookiesService.getCookie('clientName');

    // If multi-carrier allowed, try keep current clientName if found.
    // Otherwise just pick first.
    let shouldKeep = false;
    if (carriertypevalue.toLowerCase() === 'both' || carriertypevalue.toLowerCase().includes('~')) {
      for (let i = 0; i < this.clientList.length; i++) {
        if ((this.clientList[i]?.clientName || '').toLowerCase() === (clientName || '').toLowerCase()) {
          shouldKeep = true;
          await this.cookiesService.setCookie(this.clientList[i]);
          window.location.reload();
          return;
        }
      }
    }

    if (!shouldKeep && this.clientList.length > 0) {
      await this.cookiesService.setCookie(this.clientList[0]);
      window.location.reload();
    }
  }

  // ---------------------------
  // User Profile loaders (Cleaned)
  // ---------------------------
  async getUser() {
    await this.cookiesService.getCookie('carrierTypevalue').then((carrierType) => {
      this.carrierTypeCookies = carrierType;
    });

    await this.applyUserProfileCommon();

    this.headerFormGroupUPS.patchValue({ clientId: this.clientID, carrierType: 'ups' });

    const carriertypevalue = (await localStorage.getItem('carrierTypevalue')) || '';
    if (this.includesCarrier(carriertypevalue, 'fedex')) {
      this.functionDateAsOFUPS();
    }

    await this.fetchaccountDetails(this.clientID);
    await this.fetchplanDetails();
  }

  async getUserFedex() {
    await this.cookiesService.getCookie('carrierTypevalue').then((carrierType) => {
      this.carrierTypeCookies = carrierType;
    });

    // FedEx profile uses slightly different date fields in your old code (filestartdate1/fileenddate1).
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = this.userProfifleData?.[0];

    this.clientID = this.userProfifle?.clientId;
    this.clientName = this.userProfifle?.clientName;

    this.clientNameCtrl.setValue({ name: this.clientName });
    this.adminFormGroup.get('selectedClient')!.setValue(this.clientName);

    this.headerFormGroupFedEx.patchValue({ clientId: this.clientID, carrierType: 'FedEx' });

    const carriertypevalue = (await localStorage.getItem('carrierTypevalue')) || '';
    if (this.includesCarrier(carriertypevalue, 'ups')) {
      this.functionDateAsOFFedex();
    }

    // rebuild FedEx dates as per your original logic
    const startRaw = this.userProfifle?.filestartdate1 || '';
    const endRaw = this.userProfifle?.fileenddate1 || '';

    const sy = startRaw.substring(0, 4);
    const sm = startRaw.substring(4, 6);
    const sd = startRaw.substring(6, 8);

    const ey = endRaw.substring(0, 4);
    const em = endRaw.substring(4, 6);
    const ed = endRaw.substring(6, 8);

    this.fileStartDate = `${sm}/${sd}/${sy}`;
    this.dataasof = `${em}/${ed}/${ey}`;
    this.compareDataDateOne = `${em}/${ed}/${ey}`;

    this.fileEndDate = this.userProfifle?.dataasof;
    this.carrierType = this.userProfifle?.carrierType;

    this.clientNameRegex = (this.clientName || '').replace(/\s/g, '');
    this.ImageUrlData = `${this.ImageUrl}${this.clientNameRegex}.jpg`;

    this.refreshPanelClass();

    this.fetchaccountDetailsFedex(this.clientID);
  }

  async getUserOnTrac() {
    await this.cookiesService.getCookie('carrierType').then((carrierType) => {
      this.carrierTypeCookies = carrierType;
    });

    await this.applyUserProfileCommon();

    this.headerFormGroupOnTrac.patchValue({ clientId: this.clientID, carrierType: 'OnTrac' });
    await this.fetchOnTracAccountDetails(this.clientID);
  }

  async getUserDhl() {
    await this.cookiesService.getCookie('carrierType').then((carrierType) => {
      this.carrierTypeCookies = carrierType;
    });

    await this.applyUserProfileCommon();

    this.headerFormGroupDhl.patchValue({ clientId: this.clientID, carrierType: 'Dhl' });
    await this.fetchDhlAccountDetails(this.clientID);
  }

  async getUserUSPS() {
    await this.cookiesService.getCookie('carrierType').then((carrierType) => {
      this.carrierTypeCookies = carrierType;
    });

    await this.applyUserProfileCommon();
    this.headerFormGroupUSPS.patchValue({ clientId: this.clientID, carrierType: 'USPS' });
  }

  // ---------------------------
  // Account / Plan fetchers (kept)
  // ---------------------------
  t007_reportlogobjUps: any = {};
  async fetchaccountDetails(clientIdUps: any) {
    const t002ClntObj: any = { clientId: clientIdUps };
    this.t007_reportlogobjUps['t001ClientProfile'] = t002ClntObj;

    this.restApiService.fetchaccountDetailsUPS(this.t007_reportlogobjUps).subscribe(
      (result: any[]) => {
        this.accountAC = result || [];
        this.accountAC.forEach((item: any, index: number) => {
          if (!item?.nickName) this.accountAC[index].nickName = item.accountNo;
          else this.accountAC[index].nickName = `${item.accountNo} - <span>${item.nickName}</span>`;
        });
        this.accountCount = this.accountAC.length;
      },
      (error: any) => console.log(error)
    );
  }

  async fetchplanDetails() {
    this.restApiService.fetchplanDetails(this.headerFormGroup.value).subscribe(
      (result: any[]) => {
        this.planAC = result || [];
        this.planCount = this.planAC.length;
      },
      (error: any) => console.log(error)
    );
  }

  // FedEx accounts
  t007_reportlogobj: any = {};
  fetchaccountDetailsFedex(clientIdFedex: any) {
    const t002ClntObj: any = { clientId: clientIdFedex };
    this.t007_reportlogobj['t002ClientProfile'] = t002ClntObj;

    this.restApiService.fetchaccountDetails(this.t007_reportlogobj).subscribe(
      (result: any) => {
        this.accountACFedex = result || [];
        this.accountACFedex.forEach((item: any, index: number) => {
          if (!item?.nickName) this.accountACFedex[index].nickName = item.primaryAccountNumber;
          else this.accountACFedex[index].nickName = `${item.primaryAccountNumber} - <span>${item.nickName}</span>`;
        });
        this.accountCountFedex = this.accountACFedex.length;
      },
      (error: any) => console.log(error)
    );
  }

  // OnTrac accounts
  t007_reportlogobjOnTrac: any = {};
  async fetchOnTracAccountDetails(clientIdOntrac: any) {
    const t002ClntObj: any = { clientId: clientIdOntrac };
    this.t007_reportlogobjOnTrac['t001ClientProfile'] = t002ClntObj;

    this.restApiService.fetchaccountDetails(t002ClntObj).subscribe(
      (result: any) => {
        this.accountACOnTrac = result || [];
        this.accountCountOnTrac = this.accountACOnTrac.length;
      },
      (error: any) => console.log(error)
    );
  }

  // DHL accounts
  t007_reportlogobjDhl: any = {};
  async fetchDhlAccountDetails(clientIdDhl: any) {
    const t002ClntObj: any = { clientId: clientIdDhl };
    this.t007_reportlogobjDhl['t001ClientProfile'] = t002ClntObj;

    this.restApiService.fetchaccountDetails(t002ClntObj).subscribe(
      (result: any) => {
        this.accountACDhl = result || [];
        this.accountCountDhl = this.accountACDhl.length;
      },
      (error: any) => console.log(error)
    );
  }

  // ---------------------------
  // Popups
  // ---------------------------
  openModal(alertVal: string) {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass,
    });
  }

  async moreviewPopup(event: any, funName: string) {
    const moreviewObj = { event, themeoption: this.themeOption, funName };
    this.openDialog(moreviewObj);
  }

  openDialog(moreviewObj: any) {
    // const dialogRef = this.dialog.open(HeaderPopupComponent, {
    //   width: '900px',
    //   height: '510px',
    //   backdropClass: 'custom-dialog-backdrop-class',
    //   panelClass: this.panelClass,
    //   data: { popupValue: moreviewObj },
    // });

    // dialogRef.afterClosed().subscribe();
  }

  async account_clickHandler() {
    if (this.accountAC?.length) this.moreviewPopup(this.accountAC, 'AC');
  }

  async plan_clickHandler() {
    if (this.planAC?.length) this.moreviewPopup(this.planAC, 'PL');
  }

  async account_clickHandlerFedex() {
    if (this.accountACFedex?.length) this.moreviewPopup(this.accountACFedex, 'AC');
  }

  async account_clickHandlerOnTrac() {
    if (this.accountACOnTrac?.length) this.moreviewPopup(this.accountACOnTrac, 'AC');
  }

  async account_clickHandlerDhl() {
    if (this.accountACDhl?.length) this.moreviewPopup(this.accountACDhl, 'AC');
  }

  // ---------------------------
  // Header UI toggles
  // ---------------------------
  clickThemeFun(value: string) {
    this.themeActive = value === 'open';
  }

  clickCompareFun(value: string) {
    this.compareActive = value === 'open';
  }

  // ---------------------------
  // Compare feature (kept)
  // ---------------------------
  compareTwoDates() {
    const dateFr = this.headerControllerFormGroup.get('fromDate')!.value;
    const dateFromYear = this.datePipe.transform(dateFr, 'yyyy');

    const dateT = this.headerControllerFormGroup.get('toDate')!.value;
    const dateToYear = this.datePipe.transform(dateT, 'yyyy');

    const fedexdateFr = this.headerControllerFormGroup.get('fedexfromDate')!.value;
    const fedexdateFromYear = this.datePipe.transform(fedexdateFr, 'yyyy');

    const fedexdateT = this.headerControllerFormGroup.get('fedextoDate')!.value;
    const fedexdateToYear = this.datePipe.transform(fedexdateT, 'yyyy');

    if (dateFromYear !== dateToYear) {
      this.openModal('Please Select Same Year Range for From Date and To Date');
      return false;
    }
    if (fedexdateFromYear !== fedexdateToYear) {
      this.openModal('Please Select Same Year Range for From Date and To Date');
      return false;
    }
    return true;
  }

  compare() {
    const ok = this.compareTwoDates();
    if (!ok) return;

    const x = Math.floor(Math.random() * 10 + 1);

    const dateFr = this.headerControllerFormGroup.get('fromDate')!.value;
    const dateFrom = this.datePipe.transform(dateFr, 'yyyy-MM-dd');

    const dateT = this.headerControllerFormGroup.get('toDate')!.value;
    const dateTo = this.datePipe.transform(dateT, 'yyyy-MM-dd');

    const dateFrFedex = this.headerControllerFormGroup.get('fedexfromDate')!.value;
    const dateFromFedex = this.datePipe.transform(dateFrFedex, 'yyyy-MM-dd');

    const dateTFedex = this.headerControllerFormGroup.get('fedextoDate')!.value;
    const dateToFedex = this.datePipe.transform(dateTFedex, 'yyyy-MM-dd');

    this.headerControllerFormGroup.patchValue({
      dateRange: { start: new Date(dateFrom as any), end: new Date(dateTo as any) },
    });

    this.commonService.setDatesFunction(dateFrom, dateTo, dateFromFedex, dateToFedex);

    const accArrUps = this.headerControllerFormGroup.get('accNo')!.value;
    const accArrFedex = this.headerControllerFormGroup.get('accNumber')!.value;
    this.commonService.emitAccValuesFunction(accArrUps, accArrFedex);

    if (this.bool === false) {
      this.router.navigate(['/compareanalysis']);
      this.bool = true;
    } else {
      this.router.navigate(['/compareanalysis', x]);
      this.bool = false;
    }
  }

  // ---------------------------
  // Edit profile (kept)
  // ---------------------------
  dialogValue: any;

  async goEditProfile() {
    const adminVal = await this.cookiesService.getCookieAdmin('adminName').then((result) => result);
    if (adminVal) {
      this.openAuthModal();
      return;
    }
    this.openEditProfile();
  }

  openEditProfile() {
    // this.dialog.open(EditProfileComponent, {
    //   width: '700px',
    //   height: '320px',
    //   panelClass: this.panelClass,
    //   data: { panelClass: this.panelClass },
    // });
  }

  openAuthModal() {
    // const dialogConfig = this.dialog.open(AuthPopupComponent, {
    //   width: '470px',
    //   height: 'auto',
    //   disableClose: true,
    //   panelClass: this.panelClass,
    // });

    // dialogConfig.afterClosed().subscribe((result: any) => {
    //   this.dialogValue = result?.event;
    //   if (this.dialogValue === 'true') this.openEditProfile();
    // });
  }

  // ---------------------------
  // Switch client dropdown (kept)
  // ---------------------------
  async cust_cmbid_changeHandler(evt: any) {
    if (!evt?.source?.selected) return;
    const clientName = evt.source.value?.name;

    let idx: number | null = null;
    for (let loop = 0; loop < this.clientList.length; loop++) {
      if ((this.clientList[loop]?.clientName || '').toLowerCase() === (clientName || '').toLowerCase()) {
        idx = loop;
        break;
      }
    }
    if (idx == null) return;

    const selectedClientObj = this.clientList[idx];

    if (this.clientType?.toLowerCase() === 'fedex') {
      this.cookiesService.setCookie(selectedClientObj)
      window.location.reload();
    } else {
      if ((selectedClientObj?.status || '').toUpperCase() === 'ACTIVE') {
        this.cookiesService.setCookie(selectedClientObj)
        window.location.reload();
      }
    }
  }

  // ---------------------------
  // Choose carrier (cleaned but same rules)
  // ---------------------------
  async chooseCarrier(projName: string) {
    const carrier = this.normalizeCarrier(projName);
    const adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');

    // Admin non-LJM path: fetch list from that carrier and reload with cookie set
    if (adminAccess !== '' && this.loginCustomerType !== 'LJM_User' && this.loginCustomerType !== 'N') {
      this.cookiesService.clickCarrierType(projName);
      return this.chooseCarrierAdminFetch(carrier);
    }

    // Normal path: validate access and inactivity
    const carriertypevalue = (localStorage.getItem('carrierTypevalue') || '').toLowerCase();
    const data = JSON.parse(localStorage.getItem('logindata') || '{}');
    const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');

    if (!this.includesCarrier(carriertypevalue, carrier)) {
      this.openModal(`${this.clientName} is not registered for ${carrier === 'dhl' ? 'DHL' : this.displayCarrier(carrier)}`);
      this.clientType = currentCarrierType;
      return;
    }

    if (this.isCarrierInactive(carrier, data)) {
      this.openModal('Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500');
      return;
    }

    // keep your original notifications for UPS/FedEx
    this.cookiesService.clickCarrierType(projName);
    if (carrier === 'ups') {
      this.cookiesService.setNotificationFlag(true);
      const count = Number(this.cookiesService.getCookieItem('notificationCountUPS') || 0);
      this.cookiesService.setCookieItem('notificationCountUPS', String(count + 1));
    } else if (carrier === 'fedex') {
      this.cookiesService.setNotificationFlag(true);
      const count = Number(this.cookiesService.getCookieItem('notificationCountFedEx') || 0);
      this.cookiesService.setCookieItem('notificationCountFedEx', String(count + 1));
    }

    if (adminAccess !== '' && (this.loginCustomerType === 'LJM_User' || this.loginCustomerType === 'N')) {
      return this.chooseCarrierAdminFetch(carrier);
    }

    // Normal: set currentCarrierType and reload
    this.cookiesService.setCookieItem('currentCarrierType', projName);
    window.location.reload();
  }

  private async chooseCarrierAdminFetch(carrier: any) {
    this.adminChooseCarrier = true;
    switch (carrier) {
      case 'fedex': return this.fetchUserChooseCarrier();
      case 'ontrac': return this.fetchOnTracalluserChooseCarrier();
      case 'dhl': return this.fetchDhlalluserChooseCarrier();
      case 'usps': return this.fetchUSPSalluserChooseCarrier();
      default: return this.fetchUPSalluserChooseCarrier();
    }
  }

  // ---------------------------
  // Choose-carrier fetchers (kept but simplified)
  // ---------------------------
  async fetchUserChooseCarrier() {
    const obj: any = {};
    obj['clientId'] = await this.cookiesService.getCookieAdmin('fedexId').then((res) => res);
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType !== '' && this.crmUserType === 'USER' && loginEmailId) obj['email'] = loginEmailId;

    this.restApiService.fetchUser(obj).subscribe(
      (result: any) => this.fedExUserResultChooseCarrier(result),
      (error: any) => console.log('error ', error)
    );
  }

  async fedExUserResultChooseCarrier(t002FedexClientAC: any[]) {
    // Your original did: find mapping from current carrier clientId => fedexClientId then set cookie.
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');

    const c = this.normalizeCarrier(currentCarrierType || '');
    if (c === 'ups') t002ClntObj['upsClientId'] = clientId;
    if (c === 'ontrac') t002ClntObj['ontracClientId'] = clientId;
    if (c === 'dhl') t002ClntObj['dhlClientId'] = clientId;
    if (c === 'usps') t002ClntObj['uspsClientId'] = clientId;

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      (result: any) => {
        const fedexId = result?.[0]?.fedexClientId;
        this.applyChooseCarrierByClientId(t002FedexClientAC, fedexId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  async fetchUPSalluserChooseCarrier() {
    const payload = this.buildCommonClientListPayload();
    this.restApiService.loadClientProfile(payload).subscribe(
      (result: any) => this.allClientresultnewChooseCarrier(result),
      (error: any) => console.log('error ', error)
    );
  }

  async allClientresultnewChooseCarrier(customerList: any[]) {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');

    const c = this.normalizeCarrier(currentCarrierType || '');
    if (c === 'fedex') t002ClntObj['fedexClientId'] = clientId;
    if (c === 'ontrac') t002ClntObj['ontracClientId'] = clientId;
    if (c === 'dhl') t002ClntObj['dhlClientId'] = clientId;
    if (c === 'usps') t002ClntObj['uspsClientId'] = clientId;

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      (result: any) => {
        const upsId = result?.[0]?.upsClientId;
        this.applyChooseCarrierByClientId(customerList, upsId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  async fetchOnTracalluserChooseCarrier() {
    const payload = this.buildCommonClientListPayload();
    this.restApiService.loadOnTracClientProfile(payload).subscribe(
      (result: any) => this.allClientOnTracResultChooseCarrier(result),
      (error: any) => console.log('error ', error)
    );
  }

  async allClientOnTracResultChooseCarrier(customerList: any[]) {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');

    const c = this.normalizeCarrier(currentCarrierType || '');
    if (c === 'ups') t002ClntObj['upsClientId'] = clientId;
    if (c === 'fedex') t002ClntObj['fedexClientId'] = clientId;
    if (c === 'dhl') t002ClntObj['dhlClientId'] = clientId;
    if (c === 'usps') t002ClntObj['uspsClientId'] = clientId;

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      (result: any) => {
        const ontracId = result?.[0]?.ontracClientId;
        this.applyChooseCarrierByClientId(customerList, ontracId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  async fetchDhlalluserChooseCarrier() {
    const payload = this.buildCommonClientListPayload();
    this.restApiService.loadDhlClientProfile(payload).subscribe(
      (result: any) => this.allClientDhlResultChooseCarrier(result),
      (error: any) => console.log('error ', error)
    );
  }

  async allClientDhlResultChooseCarrier(customerList: any[]) {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');

    const c = this.normalizeCarrier(currentCarrierType || '');
    if (c === 'ups') t002ClntObj['upsClientId'] = clientId;
    if (c === 'fedex') t002ClntObj['fedexClientId'] = clientId;
    if (c === 'ontrac') t002ClntObj['ontracClientId'] = clientId;
    if (c === 'usps') t002ClntObj['uspsClientId'] = clientId;

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      (result: any) => {
        const dhlId = result?.[0]?.dhlClientId;
        this.applyChooseCarrierByClientId(customerList, dhlId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  async fetchUSPSalluserChooseCarrier() {
    const payload = this.buildCommonClientListPayload();
    this.restApiService.loadUSPSClientProfile(payload).subscribe(
      (result: any) => this.allClientUSPSResultChooseCarrier(result),
      (error: any) => console.log('error ', error)
    );
  }

  async allClientUSPSResultChooseCarrier(customerList: any[]) {
    const t002ClntObj: any = {};
    const clientId = await this.cookiesService.getCookie('clientId');
    const currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');

    const c = this.normalizeCarrier(currentCarrierType || '');
    if (c === 'ups') t002ClntObj['upsClientId'] = clientId;
    if (c === 'fedex') t002ClntObj['fedexClientId'] = clientId;
    if (c === 'ontrac') t002ClntObj['ontracClientId'] = clientId;
    if (c === 'dhl') t002ClntObj['dhlClientId'] = clientId;

    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      (result: any) => {
        const uspsId = result?.[0]?.uspsClientId;
        this.applyChooseCarrierByClientId(customerList, uspsId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  private applyChooseCarrierByClientId(customerList: any[], targetClientId: any) {
    // Keep list (LJM_User)
    const filtered = (customerList || []).filter((x) => x?.customertype === 'LJM_User');

    // build options
    this.clientList = filtered;
    this.options = [];
    for (let i = 0; i < this.clientList.length; i++) {
      this.options.push({ name: this.clientList[i].clientName });
    }
    this.ExecMatSelctFunctions();

    // set cookie by id or fallback
    if (this.adminChooseCarrier) {
      let found = false;
      for (let i = 0; i < this.clientList.length; i++) {
        if (this.clientList[i]?.clientId === targetClientId) {
          found = true;
          this.cookiesService.setCookie(this.clientList[i])
          window.location.reload();
          return;
        }
      }
      if (!found && this.clientList.length > 0) {
        this.cookiesService.setCookie(this.clientList[0])
        window.location.reload();
      }
    }
  }

  // ---------------------------
  // Init account lookups (kept)
  // ---------------------------
  clientDetailLstUps: any[] = [];
  async fetchUPSalluserInitUps() {
    const t001custObj: any = { status: 'ACTIVE', lazyLoad: 'N' };
    const clientName = await this.cookiesService.getCookie('clientName');

    this.restApiService.loadClientProfile(t001custObj).subscribe(
      (result: any[]) => {
        this.clientDetailLstUps = result || [];
        const index = this.clientDetailLstUps.findIndex(
          (x) => (x.clientName || '').toLowerCase() === (clientName || '').toLowerCase()
        );
        if (index >= 0) this.fetchaccountDetails(this.clientDetailLstUps[index].clientId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  clientDetailLstFedex: any[] = [];
  clientIdFedex: any;
  async fetchUserInitFedex() {
    const t001custObj: any = {};
    t001custObj['clientId'] = await this.cookiesService.getCookieAdmin('fedexId').then((res) => res);
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    if (this.crmUserType === 'USER' && loginEmailId) t001custObj['email'] = loginEmailId;

    this.restApiService.fetchUser(t001custObj).subscribe(
      (result: any) => {
        this.clientDetailLstFedex = result || [];
        const index = this.clientDetailLstFedex.findIndex(
          (x) => (x.clientName || '').toLowerCase() === (this.clientName || '').toLowerCase()
        );
        if (index >= 0) {
          this.clientIdFedex = this.clientDetailLstFedex[index].clientId;
          this.fetchaccountDetailsFedex(this.clientIdFedex);
        }
      },
      (error: any) => console.log('error ', error)
    );
  }

  clientDetailLstOntrac: any[] = [];
  async fetchUserInitOntrac() {
    const t001custObj: any = { status: 'ACTIVE', lazyLoad: 'N' };
    const clientName = await this.cookiesService.getCookie('clientName');

    this.restApiService.loadOnTracClientProfile(t001custObj).subscribe(
      (result: any[]) => {
        this.clientDetailLstOntrac = result || [];
        const index = this.clientDetailLstOntrac.findIndex(
          (x) => (x.clientName || '').toLowerCase() === (clientName || '').toLowerCase()
        );
        if (index >= 0) this.fetchOnTracAccountDetails(this.clientDetailLstOntrac[index].clientId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  clientDetailLstDhl: any[] = [];
  async fetchUserInitDhl() {
    const t001custObj: any = { status: 'ACTIVE', lazyLoad: 'N' };
    const clientName = await this.cookiesService.getCookie('clientName');

    this.restApiService.loadDhlClientProfile(t001custObj).subscribe(
      (result: any[]) => {
        this.clientDetailLstDhl = result || [];
        const index = this.clientDetailLstDhl.findIndex(
          (x) => (x.clientName || '').toLowerCase() === (clientName || '').toLowerCase()
        );
        if (index >= 0) this.fetchDhlAccountDetails(this.clientDetailLstDhl[index].clientId);
      },
      (error: any) => console.log('error ', error)
    );
  }

  clientDetailLstUsps: any[] = [];
  async fetchUserInitUsps() {
    const t001custObj: any = { status: 'ACTIVE', lazyLoad: 'N' };
    const clientName = await this.cookiesService.getCookie('clientName');

    this.restApiService.loadUSPSClientProfile(t001custObj).subscribe(
      (result: any[]) => {
        this.clientDetailLstUsps = result || [];
      },
      (error: any) => console.log('error ', error)
    );
  }

  // ---------------------------
  // Logout (kept)
  // ---------------------------
  async Loggout() {
    const loginId = await this.cookiesService.getCookie('loginId');
    const t100_TLoginObj: any = { loginId };
    await this.saveOrUpdateLogout(t100_TLoginObj);
    await this.cookiesService.deleteCookie();
    window.location.reload();
    await this.cookiesService.auth(false);
  }

  async saveOrUpdateLogout(t100_TLoginObj: any) {
    this.restApiService.saveOrUpdateLogout(t100_TLoginObj).subscribe(
      (result: any) => console.log(result),
      (error: any) => console.log('error ', error)
    );
  }

  // ---------------------------
  // Switch module (kept)
  // ---------------------------
  async switchModule(projName: string) {
    this.projectName = await this.switchProj.switchToProj(projName);
    this.switchProj.projNameSource.next(this.projectName);
  }

  // ---------------------------
  // Mat Select Searchable (fixed)
  // ---------------------------
  ExecMatSelctFunctions() {
    this.filteredClients.next(this.options.slice());

    this.clientNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterClientName());
  }

  private setInitialValue() {
    this.filteredClients
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a: any, b: any) => a?.name === b?.name;
      });
  }

  private filterClientName() {
    if (!this.options) return;

    let search = this.clientNameFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.options.slice());
      return;
    }
    search = (search || '').toLowerCase();

    this.filteredClients.next(
      this.options.filter((clientx) =>
        (clientx?.name || '').toLowerCase().indexOf(search) > -1
      )
    );
  }

  private _filterSelectedClientValue(value: any): any[] {
    const s = (value || '').toString().toLowerCase();
    return (this.options || []).filter((o) => (o?.name || '').toLowerCase().includes(s));
  }

  // ---------------------------
  // Old _filter() was buggy; kept name but fixed signature
  // ---------------------------
  private _filter(value: string): any[] {
    return this._filterSelectedClientValue(value);
  }

  // ---------------------------
  // setClient (kept mostly as-is; small safety guards)
  // ---------------------------
  async setClient(id: any) {
    const url = (this.router.url || '').split('/').pop();

    if (url === 'contract-summary') {
      return this.setClientForAvailability('contract-summary', id);
    }
    if (url === 'general-rate-increase') {
      return this.setClientForAvailability('general-rate-increase', id);
    }

    if (this.clientList?.[id]) {
      this.cookiesService.setCookie(this.clientList[id])
      window.location.reload();
    }
  }

  private async setClientForAvailability(page: 'contract-summary' | 'general-rate-increase', id: any) {
    const carrier = this.normalizeCarrier(this.clientType || 'ups');

    if (id === 'load') {
      await this.loadCarrierClientList(carrier);
      await this.loadUserProfile(carrier);
    }

    const clientData: any = { clientId: '0' };

    const carrierData =
      page === 'contract-summary'
        ? await firstValueFrom(this.restApiService.fetchClientDetails(clientData))
        : await firstValueFrom(this.restApiService.fetchGRIClientDetails(clientData));

    const carrierNameNeeded = carrier === 'fedex' ? 'fedex' : 'ups';
    carrierData.forEach((data: any) => {
      if ((data?.carrierName || '').toLowerCase() !== carrierNameNeeded) return;

      const row = this.clientList.findIndex(
        (cl) =>
          (cl?.clientName || '').toLowerCase().replaceAll(' ', '') ===
          (data?.clientName || '').toLowerCase()
      );

      if (row !== undefined && row >= 0) {
        this.clientList[row]['contractSummaryAvailable'] = true;
      }
    });

    for (let index = 0; index < this.clientList.length; index++) {
      if (this.clientList[index]?.contractSummaryAvailable === true) {
        this.cookiesService.setCookie(this.clientList[index])
        window.location.reload();
        break;

      }
    }
  }
























  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
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
  /**
* Open modal
* @param content modal content
*/
  // openModal(content: any) {
  //   // this.submitted = false;
  //   this.modalService.open(content, { centered: true });
  // }

  /**
  * Topbar Light-Dark Mode Change
  */
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

  /***
   * Language Listing
   */
  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Española', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    { text: 'Deutsche', flag: 'assets/images/flags/germany.svg', lang: 'de' },
    { text: 'Italiana', flag: 'assets/images/flags/italy.svg', lang: 'it' },
    { text: 'русский', flag: 'assets/images/flags/russia.svg', lang: 'ru' },
    { text: '中国人', flag: 'assets/images/flags/china.svg', lang: 'ch' },
    { text: 'français', flag: 'assets/images/flags/french.svg', lang: 'fr' },
    { text: 'Arabic', flag: 'assets/images/flags/ar.svg', lang: 'ar' },
  ];

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
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

  // Delete Item
  deleteItem(event: any, id: any) {
    var price = event.target.closest('.dropdown-item').querySelector('.item_price').innerHTML;
    var Total_price = this.total - price;
    this.total = Total_price;
    this.cart_length = this.cart_length - 1;
    this.total > 1 ? (document.getElementById("empty-cart") as HTMLElement).style.display = "none" : (document.getElementById("empty-cart") as HTMLElement).style.display = "block";
    document.getElementById('item_' + id)?.remove();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = true;
    }
  }
  // Search Topbar
  Search() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = ''
        if (element.querySelector("h6")) {
          var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
          var name = element.querySelector("h6").innerText.toLowerCase()
          if (name.includes(inputVal)) {
            notifiTxt = name
          } else {
            notifiTxt = spantext
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

  // Remove Notification
  checkedValGet: any[] = [];
  onCheckboxChange(event: any, id: any) {
    this.notifyId = id
    var result;
    if (id == '1') {
      var checkedVal: any[] = [];
      for (var i = 0; i < this.allnotifications.length; i++) {
        if (this.allnotifications[i].state == true) {
          result = this.allnotifications[i].id;
          checkedVal.push(result);
        }
      }
      this.checkedValGet = checkedVal;
    } else {
      var checkedVal: any[] = [];
      for (var i = 0; i < this.messages.length; i++) {
        if (this.messages[i].state == true) {
          result = this.messages[i].id;
          checkedVal.push(result);
        }
      }
      this.checkedValGet = checkedVal;
    }
    checkedVal.length > 0 ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
  }

  notificationDelete() {
    if (this.notifyId == '1') {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.allnotifications.length; j++) {
          if (this.allnotifications[j].id == this.checkedValGet[i]) {
            this.allnotifications.splice(j, 1)
          }
        }
      }
    } else {
      for (var i = 0; i < this.checkedValGet.length; i++) {
        for (var j = 0; j < this.messages.length; j++) {
          if (this.messages[j].id == this.checkedValGet[i]) {
            this.messages.splice(j, 1)
          }
        }
      }
    }
    this.calculatenotification()
    this.modalService.dismissAll();
  }

  calculatenotification() {
    this.totalNotify = 0;
    this.checkedValGet = []

    this.checkedValGet.length > 0 ? (document.getElementById("notification-actions") as HTMLElement).style.display = 'block' : (document.getElementById("notification-actions") as HTMLElement).style.display = 'none';
    if (this.totalNotify == 0) {
      document.querySelector('.empty-notification-elem')?.classList.remove('d-none')
    }
  }
}
