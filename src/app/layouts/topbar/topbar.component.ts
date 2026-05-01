import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output, Inject, ViewChild, TemplateRef, DOCUMENT } from '@angular/core';

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
import { CookiesService } from 'src/app/core/services/cookie.service';
import { MENU, MENUfedex, MENUontrac, MENUdhl, MENUusps } from '../sidebar/menu';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: false
})
export class TopbarComponent implements OnInit, AfterViewInit, OnDestroy {
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
  tooltipText = 'Compare Analysis';

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

  accountACFedex: any = [];
  accountCountFedex = 0;

  accountACOnTrac: any = [];
  accountCountOnTrac = 0;

  accountACDhl: any[] = [];
  accountCountDhl = 0;

  // customers / audit lists
  clientList: any = [];
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
  public clientNameCtrl: FormControl = new FormControl(null);
  public clientNameFilterCtrl: FormControl = new FormControl('');
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

  compareClients = (a: any, b: any): boolean => {
    return a && b ? a.name === b.name : a === b;
  };

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
    this.cookiesService.carrierType.subscribe((clienttype: any) => {
      if (clienttype) {
        this.clientType = clienttype;
      }
      else {
        if (localStorage.getItem('carrierType'))
          this.clientType = localStorage.getItem('carrierType');
      }
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
      selectedClient: new FormControl(null),
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

    this.cookiesService.getLoginStatus().subscribe((res: any) => {
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
    setTimeout(() => {
      console.log(this.adminFormGroup.get('selectedClient')?.value);
      console.log(this.clientNameFilterCtrl)
    }, 2000);

    this.clientNameFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterClientName());
    if (localStorage.getItem('themeOption')) {
      this.changeLayoutMode(localStorage.getItem('themeOption') || 'light', 'Init');
      setTimeout(() => { this.openSidebar(); }, 500);
    }
  }

  openSidebar() {
    const sidebar = document.querySelector('[data-sidebar-size]') as HTMLElement;
    const size = sidebar.getAttribute('data-sidebar-size');
    if (size == 'lg') {
      const sidebar = document.querySelector('[data-sidebar-size]') as HTMLElement;
      sidebar.setAttribute('data-sidebar-size', 'sm');
      document.querySelector('.hamburger-icon')?.classList.remove('open');
      this.mobileMenuButtonClicked.emit();
    }
  }
  changeLayoutMode(mode: string, initData: any) {
    console.log(mode);
    this.changeSidebarColor(mode);
    this.mode = mode;
    this.store.dispatch(changeMode({ mode }));
    this.store.select(getLayoutMode).subscribe((mode) => {
      document.documentElement.setAttribute('data-bs-theme', mode)
    })
    if (initData != 'Init')
      this.setThemeOption(mode);
    // document.documentElement.setAttribute('data-bs-theme', mode)
  }
  async setThemeOption(themeName: any) {
    this.cookiesService.setCookietheme(themeName);
    var mainClientId = await this.cookiesService.getCookie("clientId").then(res => { return res; });
    await this.apiControllerFormGroup.get('clientId')?.setValue(mainClientId);
    await this.apiControllerFormGroup.get('theme_option')?.setValue(themeName);
    await this.httpClientService.UpdateTheme_ClientProfile(this.apiControllerFormGroup.value).subscribe((data: any) => {
      if (data != null) {
        window.location.reload();
      }
    });

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
      .subscribe((res: any) => this.clickCompareFun(res));
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
        break;
    }

    /* ---------- Init + autocomplete ---------- */
    await this.initMethodUps_Fedex();
    this.filteredOptions = this.adminFormGroup.get('selectedClient')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    console.log(this.filteredOptions);
  }

  private _filter(value: string): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.options.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  async initMethodUps_Fedex() {
    var carrierType: any = await this.getCarrierType();
    // var carrierType = "ups~fedex";

    if (carrierType.toLowerCase().includes("ups")) {
      await this.fetchUPSalluserInitUps();
    }
    if (carrierType.toLowerCase().includes("fedex")) {
      await this.fetchUserInitFedex();
    }
    if (carrierType.toLowerCase().includes("ontrac")) {
      await this.fetchUserInitOntrac();
    }
    if (carrierType.toLowerCase().includes("dhl")) {
      await this.fetchUserInitDhl();
    }
    if (carrierType.toLowerCase().includes("usps")) {
      await this.fetchUserInitUsps();
    }
  }
  async getCarrierType() {
    //  return  await this.cookiesService.getCookie('carrierType');
    return await localStorage.getItem('carrierTypevalue');

  }

  async functionDateAsOFUPS() {
    await this.restApiService.fetchFedExComparisionReportadataAsOf(this.headerFormGroupUPS.value).subscribe(
      result => {
        var resultDate = result.clientId;
        this.getProfileData(resultDate);

      },
      error => {

      })
  }
  async getProfileData(clientid: any) {
    var userDataObj: any = {};
    userDataObj['clientId'] = clientid;
    const clientProfile: any = await this.restApiService.fetchUser(userDataObj).toPromise();
    var resultData = clientProfile[0].fileenddate1;
    var strYear = resultData.substring(0, 4);
    var strMonth = resultData.substring(4, 6);
    var strDate = resultData.substring(6, 8);
    var dataasof = strYear + "-" + strMonth + "-" + strDate;
    this.compareDataDate(dataasof);
  }
  async compareDataDate(event: any) {
    this.compareDataDateTwo = this.datePipe.transform(event, "MM/dd/yyyy");
    let comparedate: any = this.datePipe.transform(this.compareDataDateOne, "MM/dd/yyyy");
    if (this.clientType.toUpperCase() === "UPS") {
      this.endDateUps = new Date(comparedate);
      this.endDate = new Date(this.compareDataDateTwo);
    }
    else {
      this.endDate = new Date(comparedate);
      this.endDateUps = new Date(this.compareDataDateTwo);
    }
  }
  async fetchUser() {
    var t001custObj: any = {};
    t001custObj["clientId"] = await this.cookiesService.getCookieAdmin("fedexId").then((res: any) => {
      return res;
    });
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType === "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    this.restApiService.fetchUser(t001custObj).subscribe(
      result => {
        this.fedExUserResult(result);
      },
      error => {
        console.log('error ', error);

      })
  }

  async fetchUserOnTrac() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType === "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType === "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadOnTracClientProfile(t001custObj);
  }

  async loadOnTracClientProfile(param: any) {
    this.restApiService.loadOnTracClientProfile(param).subscribe(
      result => {
        this.onTracClientResult(result);
      },
      error => {
        console.log('error ', error);

      })
  }
  accountNumber: any;
  async onTracClientResult(event: any) {
    var customerList = event;
    this.clientList = [];
    this.auditCustomerListAC = [];
    if (event.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype === "LJM_User" && t002Obj.auditcustomerstatus === "Y") {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl" ||
        carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac" || carriertypevalue.toLowerCase() == "fedex~ontrac" || carriertypevalue.toLowerCase() == "ontrac~dhl" || carriertypevalue.toLowerCase() == "ontrac~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName.toLowerCase() == clientName.toLowerCase()) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              // window.location.reload();
              this.changeService(this.clientType);
            });

          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    // for (var loop = 0; loop < this.clientList.length; loop++) {

    //   var clientObj: any = {};
    //   clientObj["name"] = this.clientList[loop].clientName;
    //   this.options.push(clientObj);
    // }
    // this.ExecMatSelctFunctions()
    this.buildClientOptions();
  }

  async getUserOnTrac() {
    await this.cookiesService.getCookie('carrierType').then((carrierType: any) => {
      this.carrierTypeCookies = carrierType;
    });
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    this.clientID = await this.userProfifle.clientId;
    this.clientName = await this.userProfifle.clientName;
    this.headerFormGroup.patchValue({
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

    this.headerFormGroupOnTrac.get("clientId")?.setValue(this.userProfifle.clientId);
    this.headerFormGroupOnTrac.get("carrierType")?.setValue("OnTrac");
    // if (this.carrierTypeCookies == "BOTH") {
    //   this.functionDateAsOFUPS();
    // }

    this.setSelectedClientByName(this.clientName);
    this.clientNameCtrl.setValue(this.clientName);

    setTimeout(async () => {
      this.fileStartDate = await this.datePipe.transform(this.userProfifle.fileStartDate, 'MM/dd/yyyy');
      this.fileEndDate = await this.userProfifle.fileEndDate;
      this.dataasof = await this.userProfifle.dataasof;
      this.compareDataDateOne = await this.userProfifle.dataasof;
      this.carrierType = await this.userProfifle.carrierType;
    }, 0);
    this.clientNameRegex = await this.clientName.replace(/\s/g, "");
    var randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    setTimeout(() => {
      this.ImageUrlData = this.ImageUrl + this.clientNameRegex + ".jpg?" + randomNumber;
    }, 0);

    this.accountNumber = await this.fetchOnTracAccountDetails(this.clientID);

    if (this.themeOption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
  }

  t007_reportlogobjOnTrac: any = {};
  async fetchOnTracAccountDetails(clientIdOntrac: any) {
    var t002ClntObj: any = {};
    t002ClntObj["clientId"] = clientIdOntrac;
    this.t007_reportlogobjOnTrac['t001ClientProfile'] = t002ClntObj;
    await this.restApiService.fetchaccountDetails(t002ClntObj).subscribe(
      (result: any) => {
        this.accountACOnTrac = result;
        this.accountCountOnTrac = result.length;
      }, error => {
        console.log(error);
      });
  }


  async fetchUserDhl() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType === "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType === "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadDhlClientProfile(t001custObj);
  }

  async loadDhlClientProfile(param: any) {
    this.restApiService.loadDhlClientProfile(param).subscribe(
      result => {
        this.dhlClientResult(result);
      },
      error => {
        console.log('error ', error);

      })
  }

  async dhlClientResult(event: any) {
    var customerList = event;
    this.clientList = [];
    this.auditCustomerListAC = [];
    if (event.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype === 'LJM_User' && t002Obj.auditcustomerstatus === 'Y') {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" || carriertypevalue.toLowerCase() == "ups~dhl~usps" ||
        carriertypevalue.toLowerCase() == "ups~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~dhl" || carriertypevalue.toLowerCase() == "fedex~dhl" || carriertypevalue.toLowerCase() == "ontrac~dhl" || carriertypevalue.toLowerCase() == "dhl~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName.toLowerCase() == clientName.toLowerCase()) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              window.location.reload();
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            window.location.reload();
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          window.location.reload();
        });
      }
    }

    this.buildClientOptions();
  }

  async getUserDhl() {
    await this.cookiesService.getCookie('carrierType').then((carrierType: any) => {
      this.carrierTypeCookies = carrierType;
    });
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    this.clientID = await this.userProfifle.clientId;
    this.clientName = await this.userProfifle.clientName;
    this.headerFormGroup.patchValue({
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

    this.headerFormGroupDhl.get("clientId")?.setValue(this.userProfifle.clientId);
    this.headerFormGroupDhl.get("carrierType")?.setValue("Dhl");

    this.setSelectedClientByName(this.clientName);
    this.clientNameCtrl.setValue(this.clientName);

    setTimeout(async () => {
      this.fileStartDate = await this.datePipe.transform(this.userProfifle.fileStartDate, 'MM/dd/yyyy');
      this.fileEndDate = await this.userProfifle.fileEndDate;
      this.dataasof = await this.userProfifle.dataasof;
      this.compareDataDateOne = await this.userProfifle.dataasof;
      this.carrierType = await this.userProfifle.carrierType;
    }, 0);
    this.clientNameRegex = await this.clientName.replace(/\s/g, "");
    var randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    setTimeout(() => {
      this.ImageUrlData = this.ImageUrl + this.clientNameRegex + ".jpg?" + randomNumber;
    }, 0);

    this.accountNumber = await this.fetchDhlAccountDetails(this.clientID);

    if (this.themeOption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
  }
  t007_reportlogobjDhl: any = {};
  async fetchDhlAccountDetails(clientIdDhl: any) {
    var t002ClntObj: any = {};
    t002ClntObj["clientId"] = clientIdDhl;
    this.t007_reportlogobjDhl['t001ClientProfile'] = t002ClntObj;
    await this.restApiService.fetchaccountDetails(t002ClntObj).subscribe(
      (result: any) => {
        this.accountACDhl = result;
        this.accountCountDhl = result.length;
      }, error => {
        console.log(error);
      });
  }

  async fetchUserUSPS() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType === "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType === "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadUSPSClientProfile(t001custObj);
  }
  async loadUSPSClientProfile(param: any) {
    this.restApiService.loadUSPSClientProfile(param).subscribe(
      result => {
        this.uspsClientResult(result);
      },
      error => {
        console.log('error ', error);

      })
  }
  async uspsClientResult(event: any) {
    var customerList = event;
    this.clientList = [];
    this.auditCustomerListAC = [];
    if (event.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype === 'LJM_User' && t002Obj.auditcustomerstatus === 'Y') {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~usps" ||
        carriertypevalue.toLowerCase() == "ups~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~usps" || carriertypevalue.toLowerCase() == "fedex~usps" || carriertypevalue.toLowerCase() == "ontrac~usps" || carriertypevalue.toLowerCase() == "dhl~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName.toLowerCase() == clientName.toLowerCase()) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              window.location.reload();
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            window.location.reload();
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          window.location.reload();
        });
      }
    }

    this.buildClientOptions();
  }

  async getUserUSPS() {
    await this.cookiesService.getCookie('carrierType').then((carrierType: any) => {
      this.carrierTypeCookies = carrierType;
    });
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    this.clientID = await this.userProfifle.clientId;
    this.clientName = await this.userProfifle.clientName;
    this.headerFormGroup.patchValue({
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

    this.headerFormGroupUSPS.get("clientId")?.setValue(this.userProfifle.clientId);
    this.headerFormGroupUSPS.get("carrierType")?.setValue("USPS");

    this.setSelectedClientByName(this.clientName);
    this.clientNameCtrl.setValue(this.clientName);

    setTimeout(async () => {
      this.fileStartDate = await this.datePipe.transform(this.userProfifle.fileStartDate, 'MM/dd/yyyy');
      this.fileEndDate = await this.userProfifle.fileEndDate;
      this.dataasof = await this.userProfifle.dataasof;
      this.compareDataDateOne = await this.userProfifle.dataasof;
      this.carrierType = await this.userProfifle.carrierType;
    }, 0);
    this.clientNameRegex = await this.clientName.replace(/\s/g, "");
    var randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    setTimeout(() => {
      this.ImageUrlData = this.ImageUrl + this.clientNameRegex + ".jpg?" + randomNumber;
    }, 0);

    if (this.themeOption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
  }

  async fetchUserInitFedex() {
    var t001custObj: any = {};
    t001custObj["clientId"] = await this.cookiesService.getCookieAdmin("fedexId").then((res: any) => {
      return res;
    });
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType === "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.restApiService.fetchUser(t001custObj).subscribe(
      result => {
        this.clientDetailLstFedex = result;
        const index = this.clientDetailLstFedex.findIndex((x: any) => x.clientName.toLowerCase() == this.clientName.toLowerCase());
        if (index !== -1 && this.clientDetailLstFedex[index]) {
          this.clientIdFedex = this.clientDetailLstFedex[index].clientId;
          this.fetchaccountDetailsFedex(this.clientIdFedex)
        }
      },
      error => {
        console.log('error ', error);

      })
  }

  async fedExUserResult(event: any) {
    var t002clientObj: any = {};
    var t002FedexClientAC = event;
    this.clientList = [];
    for (var loop = 0; loop < t002FedexClientAC.length; loop++) {
      if (t002FedexClientAC[loop].adminFlag != "Y") {
        this.clientList.push(t002FedexClientAC[loop]);


      }
      else {
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" ||
        carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex" || carriertypevalue.toLowerCase() == "fedex~ontrac" || carriertypevalue.toLowerCase() == "fedex~dhl" || carriertypevalue.toLowerCase() == "fedex~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName.toLowerCase() == clientName.toLowerCase()) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              window.location.reload();
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            window.location.reload();
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          window.location.reload();
        });
      }
    }

    // for (var loop = 0; loop < this.clientList.length; loop++) {
    //   var clientObj: any = {};
    //   clientObj['name'] = this.clientList[loop].clientName;
    //   this.options.push(clientObj);
    // }
    // this.ExecMatSelctFunctions()
    this.buildClientOptions();
  }

  async fetchUserChooseCarrier() {
    var t001custObj: any = {};
    t001custObj["clientId"] = await this.cookiesService.getCookieAdmin("fedexId").then((res: any) => {
      return res;
    });
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType == "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    this.restApiService.fetchUser(t001custObj).subscribe(
      result => {
        this.fedExUserResultChooseCarrier(result);
      },
      error => {
        console.log('error ', error);

      })
  }

  async fedExUserResultChooseCarrier(event: any) {
    var t002clientObj: any = {};
    var t002FedexClientAC = event;
    var t002ClntObj: any = {};
    var clientId = await this.cookiesService.getCookie('clientId');
    var currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');
    if (currentCarrierType.toUpperCase() == "UPS") {
      t002ClntObj["upsClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "ONTRAC") {
      t002ClntObj["ontracClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "DHL") {
      t002ClntObj["dhlClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "USPS") {
      t002ClntObj["uspsClientId"] = clientId;
    }

    var FedEx_ClientId;
    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      result => {
        if (result && result.length > 0 && result[0]) {
          FedEx_ClientId = result[0].fedexClientId;
          this.fedexClientLoginCredentialResultChooseCarrier(t002FedexClientAC, FedEx_ClientId);
        }
      },
      error => {
        console.log('error ', error);
      })


  }

  async fedexClientLoginCredentialResultChooseCarrier(t002FedexClientAC: any, FedEx_ClientId: any) {
    this.clientList = [];
    for (var loop = 0; loop < t002FedexClientAC.length; loop++) {
      if (t002FedexClientAC[loop].adminFlag != "Y") {
        this.clientList.push(t002FedexClientAC[loop]);


      }
      else {
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" ||
        carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex" || carriertypevalue.toLowerCase() == "fedex~ontrac" || carriertypevalue.toLowerCase() == "fedex~dhl" || carriertypevalue.toLowerCase() == "fedex~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientId == FedEx_ClientId) {
            checkActiveStatus = true;
            // await this.setClient(loop);
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              this.changeService(this.clientType)
              // window.location.reload();
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }

      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    // for (var loop = 0; loop < this.clientList.length; loop++) {
    //   var clientObj: any = {};
    //   clientObj['name'] = this.clientList[loop].clientName;
    //   this.options.push(clientObj);
    // }
    // this.ExecMatSelctFunctions();
    this.buildClientOptions();
  }

  async loadClientProfile(param: any) {
    this.restApiService.loadClientProfile(param).subscribe(
      result => {
        this.allClientresultnew(result);
      },
      error => {
        console.log('error ', error);

      })
  }
  async getCookieAdmin() {
    this.adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    if (this.adminAccess != "") { this.adminFlag = true; }
    else { this.adminFlag = false; }
  }
  async getThemeOption() {
    this.themeOption = await this.cookiesService.getCookie('themeOption');
  }
  // async setThemeOption(themeName: any) {
  //   this.cookiesService.setCookietheme(themeName);
  //   var mainClientId = await this.cookiesService.getCookie("clientId").then((res:any) => { return res; });
  //   await this.apiControllerFormGroup.get('clientId')?.setValue(mainClientId);
  //   await this.apiControllerFormGroup.get('theme_option')?.setValue(themeName);
  //   await this.restApiService.UpdateTheme_ClientProfile(this.apiControllerFormGroup.value).subscribe(data => {
  //     if (data != null) {
  //       window.location.reload();
  //     }
  //   });

  // }
  async chooseCarrier(projName: any) {
    console.log(projName);
    var adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    // this.cookiesService.clickCarrierType(projName);  /* commented by 9069 at Feb 01 2023 */

    var adminAccess = await this.cookiesService.getCookieAdmin('adminId');
    // this.cookiesService.clickCarrierType(projName);
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (adminAccess != "" && this.loginCustomerType != "LJM_User" && this.loginCustomerType != "N") {
      this.cookiesService.clickCarrierType(projName); /* added by 9069 at Feb 01 2023 */
      if (projName.toLowerCase() == "fedex") {
        this.carrierFedex();
      }
      else if (projName.toLowerCase() == "ontrac") {
        this.carrierOntrac();
      }
      else if (projName.toLowerCase() == "dhl") {
        this.carrierDhl();
      }
      else if (projName.toLowerCase() == "usps") {
        this.carrierUSPS();
      }
      else {
        this.carrierUps();
      }

    } else {
      var carrierName = localStorage.getItem('carrierType');
      var carriertypevalue: any = localStorage.getItem('carrierTypevalue');
      //    this.cookiesService.carrierTypevalue.subscribe((carrierTypevalue) => {
      //    carriertypevalue = carrierTypevalue;
      // });
      var currentCarrierType: any = await this.cookiesService.getCookie('currentCarrierType');
      var data: any = JSON.parse(localStorage.getItem('logindata') || '');
      if (carriertypevalue.toLowerCase().indexOf(projName.toLowerCase()) === -1) {
        this.openModal(this.clientName + " is not registered for " + (projName == 'Dhl' ? 'DHL' : projName) + "");
        this.clientType = currentCarrierType;
        return;
      }
      /* Start added by 9069 at Feb 01 2023*/
      else if (projName.toLowerCase() == "ups" && data.status.toLowerCase() == 'inactive') {
        this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
        this.clientType = currentCarrierType;
        return;
      }
      else if (projName.toLowerCase() == "fedex" && data.statusFedex.toLowerCase() == 'inactive') {
        this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
        this.clientType = currentCarrierType;
        return;
      }
      else if (projName.toLowerCase() == "ontrac" && data.statusOntrac.toLowerCase() == 'inactive') {
        this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
        this.clientType = currentCarrierType;
        return;
      }
      else if (projName.toLowerCase() == "dhl" && data.statusDhl.toLowerCase() == 'inactive') {
        this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
        this.clientType = currentCarrierType;
        return;
      }
      else if (projName.toLowerCase() == "usps" && data.statusUsps.toLowerCase() == 'inactive') {
        this.openModal("Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500");
        this.clientType = currentCarrierType;
        return;
      }
      this.cookiesService.clickCarrierType(projName);

      if (projName.toLowerCase() == "ups") {
        this.cookiesService.setNotificationFlag(true);
        var notificationCountUPS: any = this.cookiesService.getCookieItem('notificationCountUPS');
        this.cookiesService.setCookieItem('notificationCountUPS', (notificationCountUPS + 1));
      }
      else if (projName.toLowerCase() == "fedex") {
        this.cookiesService.setNotificationFlag(true);
        var notificationCountFedEx: any = this.cookiesService.getCookieItem('notificationCountFedEx');
        this.cookiesService.setCookieItem('notificationCountFedEx', (notificationCountFedEx + 1));
      }
      if (adminAccess != "" && (this.loginCustomerType == "LJM_User" || this.loginCustomerType == "N")) {
        if (projName.toLowerCase() == "fedex") {
          this.carrierFedex();
        }
        else if (projName.toLowerCase() == "ontrac") {
          this.carrierOntrac();
        }
        else if (projName.toLowerCase() == "dhl") {
          this.carrierDhl();
        }
        else if (projName.toLowerCase() == "usps") {
          this.carrierUSPS();
        }
        else {
          this.carrierUps();
        }
      }
      else {
        this.cookiesService.setCookieItem('currentCarrierType', projName);
        window.location.reload();
      }
    }

  }
  changeService(service: string) {
    console.log('test', service)
    const currentUrl = this.router.url;
    let actionPath = currentUrl.replace(/^\/[^\/]+/, '');
    if (actionPath && actionPath.includes('?')) {
      actionPath = actionPath.split('?')[0];
    }

    let menuItems: any[] = [];
    switch (service.toLowerCase()) {
      case 'fedex': menuItems = MENUfedex; break;
      case 'ontrac': menuItems = MENUontrac; break;
      case 'dhl': menuItems = MENUdhl; break;
      case 'usps': menuItems = MENUusps; break;
      default: menuItems = MENU; break;
    }

    const checkMenu = (items: any[], path: string): boolean => {
      for (const item of items) {
        if (item.link) {
          const normalizedLink = item.link.startsWith('/') ? item.link : '/' + item.link;
          if (normalizedLink === path) {
            return true;
          }
        }
        if (item.subItems && checkMenu(item.subItems, path)) {
          return true;
        }
      }
      return false;
    };

    let isValidRoute = false;
    if (actionPath === '/' || actionPath === '' || actionPath === '/dashboard' || actionPath === '/dashboard/dashboard' || actionPath === '/tracking') {
      isValidRoute = true;
    } else {
      const normalizedAction = actionPath.startsWith('/') ? actionPath : '/' + actionPath;
      isValidRoute = checkMenu(menuItems, normalizedAction);
    }

    let searchParams = '';
    if (currentUrl.includes('?') && currentUrl.split('?')[1]) {
      searchParams = '?' + currentUrl.split('?')[1];
    }

    const updatedUrl = isValidRoute ? `/${service}${actionPath}${searchParams}` : `/${service}/dashboard`;

    // Avoid destructive reloads specifically for tracking pages to preserve search data.
    // Also avoid reloads if staying within the same carrier module.

    const isTrackingPage = updatedUrl.toLowerCase().includes('/tracking');

    this.router.navigateByUrl(updatedUrl);

    if (!isTrackingPage) {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }
  async carrierFedex() {
    this.adminChooseCarrier = true;
    var fetchUserObj = await this.fetchUserChooseCarrier();
  }
  async carrierUps() {
    this.adminChooseCarrier = true;
    var fetchUserObj = await this.fetchUPSalluserChooseCarrier();
  }
  async carrierOntrac() {
    this.adminChooseCarrier = true;
    var fetchUserObj = await this.fetchOnTracalluserChooseCarrier();
  }
  async carrierDhl() {
    this.adminChooseCarrier = true;
    var fetchUserObj = await this.fetchDhlalluserChooseCarrier();
  }
  async carrierUSPS() {
    this.adminChooseCarrier = true;
    var fetchUserObj = await this.fetchUSPSalluserChooseCarrier();
  }
  async fetchUPSalluser() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType == "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType == "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadClientProfile(t001custObj);
  }
  async fetchUPSalluserInitUps() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    var clientName = await this.cookiesService.getCookie('clientName');
    this.restApiService.loadClientProfile(t001custObj).subscribe(
      result => {
        this.clientDetailLstUps = result
        const index = this.clientDetailLstUps.findIndex((x: any) => x.clientName.toLowerCase() == clientName.toLowerCase())
        if (index !== -1 && this.clientDetailLstUps[index]) {
          var clientIdUps = this.clientDetailLstUps[index].clientId;
          this.fetchaccountDetails(clientIdUps)
        }
      },
      error => {
        console.log('error ', error);

      })
  }
  async fetchUserInitOntrac() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    var clientName = await this.cookiesService.getCookie('clientName');
    this.restApiService.loadOnTracClientProfile(t001custObj).subscribe(
      result => {
        this.clientDetailLstOntrac = result || [];
        const index = this.clientDetailLstOntrac.findIndex(
          x => x.clientName?.toLowerCase() === clientName?.toLowerCase()
        );
        if (index !== -1 && this.clientDetailLstOntrac[index]) {
          const clientIdOntrac = this.clientDetailLstOntrac[index].clientId;
          this.fetchOnTracAccountDetails(clientIdOntrac);
        } else {
          console.error('Client not found:', clientName);
        }
      },
      error => {
        console.log('error ', error);

      })
  }

  async fetchUserInitDhl() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    var clientName = await this.cookiesService.getCookie('clientName');
    this.restApiService.loadDhlClientProfile(t001custObj).subscribe(
      result => {
        this.clientDetailLstDhl = result
        const index = this.clientDetailLstDhl.findIndex(x => x.clientName.toLowerCase() == clientName.toLowerCase())
        if (index !== -1 && this.clientDetailLstDhl[index]) {
          var clientIdDhl = this.clientDetailLstDhl[index].clientId
          this.fetchDhlAccountDetails(clientIdDhl)
        }
      },
      error => {
        console.log('error ', error);

      })
  }
  async fetchUserInitUsps() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    var clientName = await this.cookiesService.getCookie('clientName');
    this.restApiService.loadUSPSClientProfile(t001custObj).subscribe(
      result => {
        this.clientDetailLstUsps = result;
        const index = this.clientDetailLstUsps.findIndex(x => x.clientName.toLowerCase() == clientName.toLowerCase())
        if (index !== -1 && this.clientDetailLstUsps[index]) {
          var clientIdUsps = this.clientDetailLstUsps[index].clientId;
        }
      },
      error => {
        console.log('error ', error);
      })
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

  }
  // async getUser() {
  //   await this.cookiesService.getCookie('carrierTypevalue').then((carrierType: any) => {
  //     this.carrierTypeCookies = carrierType;
  //   });
  //   this.userProfifleData = await this.commonService.getUserprofileData();
  //   this.userProfifle = await this.userProfifleData[0];
  //   this.clientID = await this.userProfifle.clientId;
  //   this.clientName = await this.userProfifle.clientName;
  //   this.headerFormGroup.patchValue({
  //     t001ClientProfile: {
  //       "action": this.userProfifle.action,
  //       "activeFlag": this.userProfifle.activeFlag,
  //       "address": this.userProfifle.address,
  //       "asonDate": this.userProfifle.asonDate,
  //       "carrierType": this.userProfifle.carrierType,
  //       "changePassword": this.userProfifle.changePassword,
  //       "charges": this.userProfifle.charges,
  //       "clientId": this.userProfifle.clientId,
  //       "clientName": this.userProfifle.clientName,
  //       "clientPassword": this.userProfifle.clientPassword,
  //       "clientdbstatus": this.userProfifle.clientdbstatus,
  //       "comments": this.userProfifle.comments,
  //       "contactNo": this.userProfifle.contactNo,
  //       "contractanalysisstatus": this.userProfifle.contractanalysisstatus,
  //       "createdBy": this.userProfifle.createdBy,
  //       "createdTs": this.userProfifle.createdTs,
  //       "currentDate": this.userProfifle.currentDate,
  //       "currentstatus": this.userProfifle.currentstatus,
  //       "customertype": this.userProfifle.customertype,
  //       "dataFileDestDir": this.userProfifle.dataFileDestDir,
  //       "dataFileSourceDir": this.userProfifle.dataFileSourceDir,
  //       "dataLoadBy": this.userProfifle.dataLoadBy,
  //       "dataSource": this.userProfifle.dataSource,
  //       "dataasof": this.userProfifle.dataasof,
  //       "daystoweb": this.userProfifle.daystoweb,
  //       "email": this.userProfifle.email,
  //       "employeeTempTotal": this.userProfifle.employeeTempTotal,
  //       "employerTempTotal": this.userProfifle.employerTempTotal,
  //       "errorString": this.userProfifle.errorString,
  //       "fetchPhoto": this.userProfifle.fetchPhoto,
  //       "fileEndDate": this.userProfifle.fileEndDate,
  //       "fileStartDate": this.userProfifle.fileStartDate,
  //       "getImageInd": this.userProfifle.getImageInd,
  //       "image": this.userProfifle.image,
  //       "ipaddress": this.userProfifle.ipaddress,
  //       "isSelected": this.userProfifle.isSelected,
  //       "isdeletedbyowner": this.userProfifle.isdeletedbyowner,
  //       "lazyLoad": this.userProfifle.lazyLoad,
  //       "loginclientId": this.userProfifle.loginclientId,
  //       "logostatus": this.userProfifle.logostatus,
  //       "menucount": this.userProfifle.menucount,
  //       "newPassword": this.userProfifle.newPassword,
  //       "nextlevelflag": this.userProfifle.nextlevelflag,
  //       "noofdaysinactive": this.userProfifle.noofdaysinactive,
  //       "noofdaystoactive": this.userProfifle.noofdaystoactive,
  //       "password": this.userProfifle.password,
  //       "payInWords": this.userProfifle.payInWords,
  //       "repname": this.userProfifle.repname,
  //       "resetPassword": this.userProfifle.resetPassword,
  //       "startDate": this.userProfifle.startDate,
  //       "status": this.userProfifle.status,
  //       "t301accountAC": this.userProfifle.t301accountAC,
  //       "t302planAC": this.userProfifle.t302planAC,
  //       "tablename": this.userProfifle.tablename,
  //       "trackingcount": this.userProfifle.trackingcount,
  //       "updatedTs": this.userProfifle.updatedTs,
  //       "updatedby": this.userProfifle.updatedby,
  //       "user_name": this.userProfifle.user_name,
  //       "year": this.userProfifle.year
  //     }
  //   });

  //   this.headerFormGroupUPS.get("clientId")?.setValue(this.userProfifle.clientId);
  //   this.headerFormGroupUPS.get("carrierType")?.setValue("ups");
  //   var carriertypevalue = await localStorage.getItem('carrierTypevalue');
  //   if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" ||
  //     carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "ups~fedex") {
  //     this.functionDateAsOFUPS();
  //   }


  //   this.fileStartDate = await this.datePipe.transform(this.userProfifle.fileStartDate, 'MM/dd/yyyy');
  //   this.fileEndDate = await this.userProfifle.fileEndDate;
  //   this.dataasof = await this.userProfifle.dataasof;
  //   this.compareDataDateOne = await this.userProfifle.dataasof;
  //   this.carrierType = await this.userProfifle.carrierType;
  //   this.clientNameRegex = await this.clientName.replace(/\s/g, "");
  //   var randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  //   setTimeout(() => {
  //     this.ImageUrlData = this.ImageUrl + this.clientNameRegex + ".jpg?" + randomNumber;
  //   }, 0);

  //   this.accountNumber = await this.fetchaccountDetails(this.clientID);
  //   this.planNumber = await this.fetchplanDetails();

  //   if (this.themeOption == "dark") {
  //     this.panelClass = 'page-dark';
  //   }
  //   else {
  //     this.panelClass = 'custom-dialog-panel-class';
  //   }
  // }
  async getUser() {
    const carrierType = await this.cookiesService.getCookie('carrierTypevalue');
    this.carrierTypeCookies = carrierType;

    this.userProfifleData = await this.commonService.getUserprofileData();

    if (!this.userProfifleData || this.userProfifleData.length === 0) {
      console.error('User profile data is empty');
      return;
    }

    this.userProfifle = this.userProfifleData[0];

    this.clientID = this.userProfifle?.clientId;
    this.clientName = this.userProfifle?.clientName;

    this.headerFormGroup.patchValue({
      t001ClientProfile: {
        "action": this.userProfifle?.action,
        "activeFlag": this.userProfifle?.activeFlag,
        "address": this.userProfifle?.address,
        "asonDate": this.userProfifle?.asonDate,
        "carrierType": this.userProfifle?.carrierType,
        "changePassword": this.userProfifle?.changePassword,
        "charges": this.userProfifle?.charges,
        "clientId": this.userProfifle?.clientId,
        "clientName": this.userProfifle?.clientName,
        "clientPassword": this.userProfifle?.clientPassword,
        "clientdbstatus": this.userProfifle?.clientdbstatus,
        "comments": this.userProfifle?.comments,
        "contactNo": this.userProfifle?.contactNo,
        "contractanalysisstatus": this.userProfifle?.contractanalysisstatus,
        "createdBy": this.userProfifle?.createdBy,
        "createdTs": this.userProfifle?.createdTs,
        "currentDate": this.userProfifle?.currentDate,
        "currentstatus": this.userProfifle?.currentstatus,
        "customertype": this.userProfifle?.customertype,
        "dataFileDestDir": this.userProfifle?.dataFileDestDir,
        "dataFileSourceDir": this.userProfifle?.dataFileSourceDir,
        "dataLoadBy": this.userProfifle?.dataLoadBy,
        "dataSource": this.userProfifle?.dataSource,
        "dataasof": this.userProfifle?.dataasof,
        "daystoweb": this.userProfifle?.daystoweb,
        "email": this.userProfifle?.email,
        "employeeTempTotal": this.userProfifle?.employeeTempTotal,
        "employerTempTotal": this.userProfifle?.employerTempTotal,
        "errorString": this.userProfifle?.errorString,
        "fetchPhoto": this.userProfifle?.fetchPhoto,
        "fileEndDate": this.userProfifle?.fileEndDate,
        "fileStartDate": this.userProfifle?.fileStartDate,
        "getImageInd": this.userProfifle?.getImageInd,
        "image": this.userProfifle?.image,
        "ipaddress": this.userProfifle?.ipaddress,
        "isSelected": this.userProfifle?.isSelected,
        "isdeletedbyowner": this.userProfifle?.isdeletedbyowner,
        "lazyLoad": this.userProfifle?.lazyLoad,
        "loginclientId": this.userProfifle?.loginclientId,
        "logostatus": this.userProfifle?.logostatus,
        "menucount": this.userProfifle?.menucount,
        "newPassword": this.userProfifle?.newPassword,
        "nextlevelflag": this.userProfifle?.nextlevelflag,
        "noofdaysinactive": this.userProfifle?.noofdaysinactive,
        "noofdaystoactive": this.userProfifle?.noofdaystoactive,
        "password": this.userProfifle?.password,
        "payInWords": this.userProfifle?.payInWords,
        "repname": this.userProfifle?.repname,
        "resetPassword": this.userProfifle?.resetPassword,
        "startDate": this.userProfifle?.startDate,
        "status": this.userProfifle?.status,
        "t301accountAC": this.userProfifle?.t301accountAC,
        "t302planAC": this.userProfifle?.t302planAC,
        "tablename": this.userProfifle?.tablename,
        "trackingcount": this.userProfifle?.trackingcount,
        "updatedTs": this.userProfifle?.updatedTs,
        "updatedby": this.userProfifle?.updatedby,
        "user_name": this.userProfifle?.user_name,
        "year": this.userProfifle?.year
      }
    });

    this.headerFormGroupUPS.get("clientId")?.setValue(this.userProfifle?.clientId);
    this.headerFormGroupUPS.get("carrierType")?.setValue("ups");

    const carriertypevalue = await localStorage.getItem('carrierTypevalue');

    if (
      carriertypevalue?.toLowerCase() == "both" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~ontrac~dhl~usps" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~ontrac~dhl" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~ontrac~usps" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~dhl~usps" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~ontrac" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~dhl" ||
      carriertypevalue?.toLowerCase() == "ups~fedex~usps" ||
      carriertypevalue?.toLowerCase() == "ups~fedex"
    ) {
      this.functionDateAsOFUPS();
    }

    setTimeout(() => {
      this.fileStartDate = this.datePipe.transform(this.userProfifle?.fileStartDate, 'MM/dd/yyyy');
      this.fileEndDate = this.userProfifle?.fileEndDate;
      this.dataasof = this.userProfifle?.dataasof;
      this.compareDataDateOne = this.userProfifle?.dataasof;
    }, 0);
    this.carrierType = this.userProfifle?.carrierType;

    this.clientNameRegex = this.clientName?.replace(/\s/g, "");
    this.setSelectedClientByName(this.clientName);

    const randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    setTimeout(() => {
      this.ImageUrlData = this.ImageUrl + this.clientNameRegex + ".jpg?" + randomNumber;
    }, 0);

    this.accountNumber = await this.fetchaccountDetails(this.clientID);
    this.planNumber = await this.fetchplanDetails();

    this.panelClass = this.themeOption == "dark"
      ? 'page-dark'
      : 'custom-dialog-panel-class';
  }
  planNumber: any;
  async account_clickHandler() {
    var accountCount = this.accountAC.length;

    if (accountCount > 0) {
      this.moreviewPopup(this.accountAC, "AC");
    }

  }
  async plan_clickHandler() {
    var planCount = this.planAC.length;
    if (planCount > 0) {
      this.moreviewPopup(this.planAC, "PL");
    }
  }
  async account_clickHandlerFedex() {
    var accountCountFedex = this.accountACFedex.length;

    if (accountCountFedex > 0) {
      this.moreviewPopup(this.accountACFedex, "AC");
    }

  }
  async account_clickHandlerOnTrac() {
    var accountCountOnTrac = this.accountACOnTrac.length;

    if (accountCountOnTrac > 0) {
      this.moreviewPopup(this.accountACOnTrac, "AC");
    }

  }

  async account_clickHandlerDhl() {
    var accountCountDhl = this.accountACDhl.length;

    if (accountCountDhl > 0) {
      this.moreviewPopup(this.accountACDhl, "AC");
    }

  }
  async moreviewPopup(event: any, funName: any) {
    var moreviewObj = {
      event: event,
      themeoption: this.themeOption,
      funName: funName
    }

    this.openDialog(moreviewObj);


  }
  openDialog(moreviewObj: any) {
    // const dialogRef = this.dialog.open(HeaderPopupComponent, {
    //   width: '900px',
    //   height: '510px',
    //   backdropClass: 'custom-dialog-backdrop-class',
    //   panelClass: this.panelClass,
    //   data: { popupValue: moreviewObj }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    // });
  }


  async functionDateAsOFFedex() {
    await this.restApiService.fetchUPSComparisionReportadataAsOf(this.headerFormGroupFedEx.value).subscribe(
      result => {
        var resultDate = result[0].dataasof;
        this.compareDataDate(resultDate);
      },
      error => {

      })
  }
  async getUserFedex() {
    await this.cookiesService.getCookie('carrierTypevalue').then((carrierType: any) => {
      this.carrierTypeCookies = carrierType;
    });
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    this.clientID = await this.userProfifle.clientId;
    this.clientName = await this.userProfifle.clientName;

    this.clientNameCtrl.setValue(this.clientName);
    this.headerFormGroupFedEx.get('clientId')?.setValue(this.userProfifle.clientId);
    this.headerFormGroupFedEx.get('carrierType')?.setValue('FedEx');

    this.headerFormGroupFedEx.get('clientId')?.setValue(this.userProfifle.clientId);
    this.headerFormGroupFedEx.get('carrierType')?.setValue("FedEx");
    var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
    if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" ||
      carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "ups~fedex") {
      this.functionDateAsOFFedex();
    }

    this.setSelectedClientByName(this.clientName);

    const strYear = this.userProfifle.filestartdate1.substring(0, 4);
    const strMonth = this.userProfifle.filestartdate1.substring(4, 6);
    const strDate = this.userProfifle.filestartdate1.substring(6, 8);
    const strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
    const strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
    const strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);

    setTimeout(() => {
      this.fileStartDate = strMonth + '/' + strDate + '/' + strYear;
      this.dataasof = strMonthEnd + '/' + strDateEnd + '/' + strYearEnd;
      this.compareDataDateOne = strMonthEnd + '/' + strDateEnd + '/' + strYearEnd;
      this.fileEndDate = strMonthEnd + '/' + strDateEnd + '/' + strYearEnd;
    }, 0);
    this.carrierType = await this.userProfifle.carrierType;
    this.clientNameRegex = await this.clientName.replace(/\s/g, "");
    setTimeout(() => {
      this.ImageUrlData = this.ImageUrl + this.clientNameRegex + ".jpg";
    }, 0);
    var t002ClntObj: any = {};
    t002ClntObj["clientId"] = this.clientID;
    this.t007_reportlogobj['t002ClientProfile'] = t002ClntObj;
    this.fetchaccountDetailsFedex(this.clientID)
    if (this.themeOption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
  }
  async Loggout() {
    var loginId = await this.cookiesService.getCookie('loginId');
    var t100_TLoginObj: any = {};
    t100_TLoginObj["loginId"] = loginId;
    await this.saveOrUpdateLogout(t100_TLoginObj);
    await this.cookiesService.deleteCookie();
    window.location.reload();
    await this.cookiesService.auth(false);

  }

  async saveOrUpdateLogout(t100_TLoginObj: any) {
    this.restApiService.saveOrUpdateLogout(t100_TLoginObj).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log('error ', error);
      })
  }
  async fetchaccountDetails(clientIdUps: any) {
    var t002ClntObj: any = {};
    t002ClntObj["clientId"] = clientIdUps;
    this.t007_reportlogobjUps['t001ClientProfile'] = t002ClntObj;
    await this.restApiService.fetchaccountDetailsUPS(this.t007_reportlogobjUps).subscribe(
      result => {
        this.accountAC = result;
        this.accountAC.forEach((item, index) => {
          if (item.nickName == null || item.nickName == undefined || item.nickName == '') {
            this.accountAC[index].nickName = item.accountNo;
          }
          else {
            this.accountAC[index].nickName = item.accountNo + " - <span>" + item.nickName + "</span>";
          }
        });
        this.accountCount = result.length;
      }, error => {
        console.log(error);
      });
  }
  async fetchplanDetails() {
    await this.restApiService.fetchplanDetails(this.headerFormGroup.value).subscribe(
      result => {
        this.planAC = result;
        this.planCount = result.length;
      }, error => {
        console.log(error);
      });
  }


  fetchaccountDetailsFedex(clientIdFedex: any) {
    var t002ClntObj: any = {};
    t002ClntObj["clientId"] = clientIdFedex;
    this.t007_reportlogobj['t002ClientProfile'] = t002ClntObj;
    this.restApiService.fetchaccountDetails(this.t007_reportlogobj).subscribe(
      (result: any) => {
        this.accountACFedex = result;
        this.accountACFedex.forEach((item: any, index: any) => {
          if (item.nickName == null || item.nickName == undefined || item.nickName == '') {
            this.accountACFedex[index].nickName = item.primaryAccountNumber;
          }
          else {
            this.accountACFedex[index].nickName = item.primaryAccountNumber + " - <span>" + item.nickName + "</span>";
          }
        });
        this.accountCountFedex = this.accountACFedex.length;
      }, error => {
        console.log(error);
      });

  }

  async switchModule(projName: string) {
    this.projectName = await this.switchProj.switchToProj(projName);
    this.switchProj.projNameSource.next(this.projectName);
  }
  clickThemeFun(value: any) {
    if (value == "open") {
      this.themeActive = true;
    }
    else {
      this.themeActive = false;
    }
  }
  clickCompareFun(value: any) {
    if (value == "open") {
      this.compareActive = true;
    }
    else {
      this.compareActive = false;
    }
  }

  async cust_cmbid_changeHandler(evt: any) {
    const selectedOption = evt.value;

    if (!selectedOption || !selectedOption.name) {
      return;
    }

    const clientName = selectedOption.name;

    this.adminFormGroup.get('selectedClient')?.setValue(selectedOption, {
      emitEvent: false
    });

    let selectedClientObj: any = null;

    for (let loop = 0; loop < this.clientList.length; loop++) {
      const currentClientName = this.clientList[loop].clientName;
      if (currentClientName?.toLowerCase() === clientName?.toLowerCase()) {
        selectedClientObj = this.clientList[loop];
        break;
      }
    }

    if (!selectedClientObj) {
      return;
    }

    if (this.clientType?.toLowerCase() === 'fedex') {
      this.cookiesService.setCookie(selectedClientObj).then(() => {
        window.location.reload();
      });
    } else {
      if (selectedClientObj.status?.toUpperCase() === 'ACTIVE') {
        this.cookiesService.setCookie(selectedClientObj).then(() => {
          window.location.reload();
        });
      }
    }


  }

  async allClientresultnew(event: any) {
    var customerList = event;
    this.clientList = [];
    this.auditCustomerListAC = [];
    if (event.length > 1 && this.adminFlag == true) {
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype === 'LJM_User' && t002Obj.auditcustomerstatus === 'Y') {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" ||
        carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex" || carriertypevalue.toLowerCase() == "ups~ontrac" || carriertypevalue.toLowerCase() == "ups~dhl" || carriertypevalue.toLowerCase() == "ups~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName.toLowerCase() == clientName.toLowerCase()) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              // window.location.reload();
              this.changeService(this.clientType);
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    this.buildClientOptions();
  }


  async fetchUPSalluserChooseCarrier() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType == "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType == "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadClientProfileChooseCarrier(t001custObj);
  }

  async loadClientProfileChooseCarrier(param: any) {
    this.restApiService.loadClientProfile(param).subscribe(
      result => {
        this.allClientresultnewChooseCarrier(result);
      },
      error => {
        console.log('error ', error);

      })
  }

  async allClientresultnewChooseCarrier(event: any) {
    var customerList = event;
    var t002ClntObj: any = {};
    var clientId = await this.cookiesService.getCookie('clientId');
    var carrierType = await this.cookiesService.getCookie('carrierType');
    var currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');
    if (currentCarrierType.toUpperCase() == "FEDEX") {
      t002ClntObj["fedexClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "ONTRAC") {
      t002ClntObj["ontracClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "DHL") {
      t002ClntObj["dhlClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "USPS") {
      t002ClntObj["uspsClientId"] = clientId;
    }

    let UPS_ClientId: any;
    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      result => {
        if (result && result.length > 0 && result[0]) {
          UPS_ClientId = result[0].upsClientId;
        }
        this.upsClientLoginCredentialResultChooseCarrier(customerList, UPS_ClientId);
      },
      error => {
        console.log('error ', error);
      })


  }

  async upsClientLoginCredentialResultChooseCarrier(customerList: any, UPS_ClientId: any) {

    this.clientList = [];
    this.auditCustomerListAC = [];
    if (customerList.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype == "LJM_User" && t002Obj.auditcustomerstatus == "Y") {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" ||
        carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex" || carriertypevalue.toLowerCase() == "ups~ontrac" || carriertypevalue.toLowerCase() == "ups~dhl" || carriertypevalue.toLowerCase() == "ups~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientId == UPS_ClientId) {
            checkActiveStatus = true;
            // await this.setClient(loop);
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              // window.location.reload();
              this.changeService(this.clientType);
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    for (var loop = 0; loop < this.clientList.length; loop++) {

      var clientObj: any = {};
      clientObj["name"] = this.clientList[loop].clientName;
      this.options.push(clientObj);
    }
    this.ExecMatSelctFunctions();
  }

  async fetchOnTracalluserChooseCarrier() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType == "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType == "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadOnTracClientProfileChooseCarrier(t001custObj);
  }

  async loadOnTracClientProfileChooseCarrier(param: any) {
    this.restApiService.loadOnTracClientProfile(param).subscribe(
      result => {
        this.allClientOnTracResultChooseCarrier(result);
      },
      error => {
        console.log('error ', error);

      })
  }


  async allClientOnTracResultChooseCarrier(event: any) {
    var customerList = event;
    var t002ClntObj: any = {};
    var clientId = await this.cookiesService.getCookie('clientId');
    var carrierType = await this.cookiesService.getCookie('carrierType');
    var currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');
    if (currentCarrierType.toUpperCase() == "UPS") {
      t002ClntObj["upsClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "FEDEX") {
      t002ClntObj["fedexClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "DHL") {
      t002ClntObj["dhlClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "USPS") {
      t002ClntObj["uspsClientId"] = clientId;
    }
    let OnTrac_ClientId: any;
    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      result => {
        if (result && result.length > 0 && result[0]) {
          OnTrac_ClientId = result[0].ontracClientId;
        }
        this.ontracClientLoginCredentialResultChooseCarrier(customerList, OnTrac_ClientId);
      },
      error => {
        console.log('error ', error);
      })


  }

  async ontracClientLoginCredentialResultChooseCarrier(customerList: any, OnTrac_ClientId: any) {
    this.clientList = [];
    this.auditCustomerListAC = [];
    if (customerList.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype == "LJM_User" && t002Obj.auditcustomerstatus == "Y") {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl" ||
        carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac" || carriertypevalue.toLowerCase() == "fedex~ontrac" || carriertypevalue.toLowerCase() == "ontrac~dhl" || carriertypevalue.toLowerCase() == "ontrac~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientId == OnTrac_ClientId) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              // window.location.reload();
              this.changeService(this.clientType);
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    for (var loop = 0; loop < this.clientList.length; loop++) {

      var clientObj: any = {};
      clientObj["name"] = this.clientList[loop].clientName;
      this.options.push(clientObj);
    }
    this.ExecMatSelctFunctions();
  }


  async fetchDhlalluserChooseCarrier() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType == "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType == "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadDhlClientProfileChooseCarrier(t001custObj);
  }
  async fetchUSPSalluserChooseCarrier() {
    var t001custObj: any = {};
    t001custObj["status"] = 'ACTIVE';
    t001custObj["lazyLoad"] = "N";
    this.loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType == "LJM_User") {
      t001custObj["login_ParentClientId"] = this.adminAccess;
    }
    this.crmUserType = this.cookiesService.getCookieItem('CRM_User_Type');
    let loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    if (this.crmUserType != "" && this.crmUserType == "USER" && loginEmailId != "") {
      t001custObj['email'] = loginEmailId;
    }
    await this.loadUSPSClientProfileChooseCarrier(t001custObj);
  }

  async loadDhlClientProfileChooseCarrier(param: any) {
    this.restApiService.loadDhlClientProfile(param).subscribe(
      result => {
        this.allClientDhlResultChooseCarrier(result);
      },
      error => {
        console.log('error ', error);

      })
  }
  async loadUSPSClientProfileChooseCarrier(param: any) {
    this.restApiService.loadUSPSClientProfile(param).subscribe(
      result => {
        this.allClientUSPSResultChooseCarrier(result);
      },
      error => {
        console.log('error ', error);

      })
  }

  async allClientDhlResultChooseCarrier(event: any) {
    var customerList = event;
    var t002ClntObj: any = {};
    var clientId = await this.cookiesService.getCookie('clientId');
    var carrierType = await this.cookiesService.getCookie('carrierType');
    var currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');
    if (currentCarrierType.toUpperCase() == "UPS") {
      t002ClntObj["upsClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "FEDEX") {
      t002ClntObj["fedexClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "ONTRAC") {
      t002ClntObj["ontracClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "USPS") {
      t002ClntObj["uspsClientId"] = clientId;
    }

    let Dhl_ClientId: any;
    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      result => {
        if (result && result.length > 0 && result[0]) {
          Dhl_ClientId = result[0].dhlClientId;
        }
        this.dhlClientLoginCredentialResultChooseCarrier(customerList, Dhl_ClientId);
      },
      error => {
        console.log('error ', error);
      })
  }

  async allClientUSPSResultChooseCarrier(event: any) {
    var customerList = event;
    var t002ClntObj: any = {};
    var clientId = await this.cookiesService.getCookie('clientId');
    var carrierType = await this.cookiesService.getCookie('carrierType');
    var currentCarrierType = await this.cookiesService.getCookie('currentCarrierType');
    if (currentCarrierType.toUpperCase() == "UPS") {
      t002ClntObj["upsClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "FEDEX") {
      t002ClntObj["fedexClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "ONTRAC") {
      t002ClntObj["ontracClientId"] = clientId;
    }
    else if (currentCarrierType.toUpperCase() == "DHL") {
      t002ClntObj["dhlClientId"] = clientId;
    }

    let USPS_ClientId: any;
    this.restApiService.findClientLoginCredential(t002ClntObj).subscribe(
      result => {
        if (result && result.length > 0 && result[0]) {
          USPS_ClientId = result[0].uspsClientId;
        }
        this.uspsClientLoginCredentialResultChooseCarrier(customerList, USPS_ClientId);
      },
      error => {
        console.log('error ', error);
      })
  }

  async dhlClientLoginCredentialResultChooseCarrier(customerList: any, Dhl_ClientId: any) {
    this.clientList = [];
    this.auditCustomerListAC = [];
    if (customerList.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype == "LJM_User" && t002Obj.auditcustomerstatus == "Y") {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl" || carriertypevalue.toLowerCase() == "ups~dhl~usps" ||
        carriertypevalue.toLowerCase() == "ups~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~dhl" || carriertypevalue.toLowerCase() == "fedex~dhl" || carriertypevalue.toLowerCase() == "ontrac~dhl" || carriertypevalue.toLowerCase() == "dhl~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientId == Dhl_ClientId) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              // window.location.reload();
              this.changeService(this.clientType);
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    for (var loop = 0; loop < this.clientList.length; loop++) {

      var clientObj: any = {};
      clientObj["name"] = this.clientList[loop].clientName;
      this.options.push(clientObj);
    }
    this.ExecMatSelctFunctions();
  }
  async uspsClientLoginCredentialResultChooseCarrier(customerList: any, USPS_ClientId: any) {

    this.clientList = [];
    this.auditCustomerListAC = [];
    if (customerList.length > 1 && this.adminFlag == true) { // Add condition, If length > 1 then Admin login otherwise master login with no sub account  
      this.adminFlag = true;
    }
    else {
      this.adminFlag = false;
    }
    for (var loop = 0; loop < customerList.length; loop++) {
      var t002Obj = customerList[loop];
      if (t002Obj.customertype == "LJM_User") {
        this.clientList.push(t002Obj);
      }
      if (t002Obj.customertype == "LJM_User" && t002Obj.auditcustomerstatus == "Y") {
        this.auditCustomerListAC.push(t002Obj);
      }
    }
    if (this.adminChooseCarrier == true) {
      var carrierType = await this.cookiesService.getCookie('carrierType');
      var carriertypevalue: any = await localStorage.getItem('carrierTypevalue');
      if (carriertypevalue.toLowerCase() == "both" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "ups~fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~fedex~usps" || carriertypevalue.toLowerCase() == "ups~ontrac~usps" ||
        carriertypevalue.toLowerCase() == "ups~dhl~usps" || carriertypevalue.toLowerCase() == "fedex~ontrac~usps" || carriertypevalue.toLowerCase() == "fedex~dhl~usps" || carriertypevalue.toLowerCase() == "ontrac~dhl~usps" || carriertypevalue.toLowerCase() == "ups~usps" || carriertypevalue.toLowerCase() == "fedex~usps" || carriertypevalue.toLowerCase() == "ontrac~usps" || carriertypevalue.toLowerCase() == "dhl~usps") {
        var clientName = await this.cookiesService.getCookie('clientName');
        var checkActiveStatus = false;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientId == USPS_ClientId) {
            checkActiveStatus = true;
            this.cookiesService.setCookie(this.clientList[loop]).then(() => {
              // window.location.reload();
              this.changeService(this.clientType);
            });
          }
        }
        if (checkActiveStatus == false) {
          this.cookiesService.setCookie(this.clientList[0]).then(() => {
            // window.location.reload();
            this.changeService(this.clientType);
          });
        }
      }
      else {
        this.cookiesService.setCookie(this.clientList[0]).then(() => {
          // window.location.reload();
          this.changeService(this.clientType);
        });
      }
    }

    for (var loop = 0; loop < this.clientList.length; loop++) {

      var clientObj: any = {};
      clientObj["name"] = this.clientList[loop].clientName;
      this.options.push(clientObj);
    }
    this.ExecMatSelctFunctions();
  }
  ExecMatSelctFunctions(): void {
    // Emit full list initially
    this.filteredClients.next([...this.options]);

    if (this.clientName) {
      this.setSelectedClientByName(this.clientName);
    } else if (this.pendingClientName) {
      this.setSelectedClientByName(this.pendingClientName);
    }
  }

  ngAfterViewInit(): void {
    this.filteredClients
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        if (this.singleSelect) {
          this.singleSelect.compareWith = this.compareClients;
        }
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private setInitialValue() {
    this.filteredClients
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.singleSelect.compareWith = (a, b) => a.name === b.name;
      });
  }

  private filterClientName(): void {
    if (!this.options?.length) {
      this.filteredClients.next([]);
      return;
    }

    const search = (this.clientNameFilterCtrl.value || '').toLowerCase().trim();

    if (!search) {
      this.filteredClients.next([...this.options]);
      return;
    }

    const filtered = this.options.filter(client =>
      client.name.toLowerCase().includes(search)
    );

    this.filteredClients.next(filtered);
  }

  async setClient(id: any) {
    var url = this.router.url.split('/').pop();

    if (url == 'contract-summary') {
      if (this.clientType.toLowerCase() == "fedex") {
        if (id == 'load') {
          await this.fetchUser();
          await this.getUserFedex();
        }
        var clientData: any = {};
        clientData['clientId'] = '0';
        var carrierData = await this.restApiService.fetchClientDetails(clientData).toPromise();
        carrierData.forEach((data: any) => {
          if (data.carrierName.toLowerCase() == "fedex") {
            var row = this.clientList.findIndex((clientListData: any) => clientListData.clientName.toLowerCase().replaceAll(" ", "") == data.clientName.toLowerCase());
            if (row != undefined) {
              this.clientList[row]['contractSummaryAvailable'] = true;
              for (let index = 0; index < this.clientList.length; index++) {
                if (this.clientList[index]['contractSummaryAvailable'] == true) {
                  this.cookiesService.setCookie(this.clientList[index]).then(() => {
                    window.location.reload();
                  });

                }
              }
            }
          }
        });
      }
      else if (this.clientType.toLowerCase() == "ups") {
        if (id == 'load') {
          await this.fetchUPSalluser();
          await this.getUser();
        }
        var clientData: any = {};
        clientData['clientId'] = '0';
        var carrierData = await this.restApiService.fetchClientDetails(clientData).toPromise();
        carrierData.forEach((data: any) => {
          if (data.carrierName.toLowerCase() == "ups") {
            var row = this.clientList.findIndex((clientListData: any) => clientListData.clientName.toLowerCase().replaceAll(" ", "") == data.clientName.toLowerCase())
            if (row != undefined) {
              this.clientList[row]['contractSummaryAvailable'] = true;
              for (let index = 0; index < this.clientList.length; index++) {
                if (this.clientList[index]['contractSummaryAvailable'] == true) {
                  this.cookiesService.setCookie(this.clientList[index]).then(() => {
                    window.location.reload();
                  });
                }
              }
            }
          }
        });
      }
    }
    else if (url == 'general-rate-increase') {
      if (this.clientType.toLowerCase() == "fedex") {
        if (id == 'load') {
          await this.fetchUser();
          await this.getUserFedex();
        }
        var clientData: any = {};
        clientData['clientId'] = '0';
        var carrierData = await this.restApiService.fetchGRIClientDetails(clientData).toPromise();
        carrierData.forEach((data: any) => {
          if (data.carrierName.toLowerCase() == "fedex") {
            var row = this.clientList.findIndex((clientListData: any) => clientListData.clientName.toLowerCase().replaceAll(" ", "") == data.clientName.toLowerCase());
            if (row != undefined) {
              this.clientList[row]['contractSummaryAvailable'] = true;
              for (let index = 0; index < this.clientList.length; index++) {
                if (this.clientList[index]['contractSummaryAvailable'] == true) {
                  this.cookiesService.setCookie(this.clientList[index]).then(() => {
                    window.location.reload();
                  });
                }
              }
            }
          }
        });
      }
      else if (this.clientType.toLowerCase() == "ups") {
        if (id == 'load') {
          await this.fetchUPSalluser();
          await this.getUser();
        }
        var clientData: any = {};
        clientData['clientId'] = '0';
        var carrierData = await this.restApiService.fetchGRIClientDetails(clientData).toPromise();
        carrierData.forEach((data: any) => {
          if (data.carrierName.toLowerCase() == "ups") {
            var row = this.clientList.findIndex((clientListData: any) => clientListData.clientName.toLowerCase().replaceAll(" ", "") == data.clientName.toLowerCase())
            if (row != undefined) {
              this.clientList[row]['contractSummaryAvailable'] = true;
              for (let index = 0; index < this.clientList.length; index++) {
                if (this.clientList[index]['contractSummaryAvailable'] == true) {
                  this.cookiesService.setCookie(this.clientList[index]).then(() => {
                    window.location.reload();
                  });
                }
              }
            }
          }
        });
      }
    }
    else {
      this.cookiesService.setCookie(this.clientList[id]).then(() => {
        window.location.reload();
      });
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
    this.updateFooterPosition();
  }
  updateFooterPosition() {
    const placeholder = document.querySelector('.simplebar-placeholder') as HTMLElement;
    const content = document.querySelector('.page-content') as HTMLElement;
    const footer = document.querySelector('.footer') as HTMLElement;
    const navbarmenu = document.querySelector('.navbar-menu') as HTMLElement;

    if (placeholder && content && footer) {
      const placeholderHeight = placeholder.offsetHeight;
      const contentHeight = content.offsetHeight;

      if (contentHeight < placeholderHeight) {
        footer.style.position = 'fixed';
        // footer.style.bottom = '0';
        navbarmenu.style.setProperty('background-image', 'none', 'important');

      } else {
        // footer.style.position = 'static';
      }
    }
  }

  /**  * Toggle the menu bar when having mobile screen   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
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
  private setSelectedClientByName(clientName: string): void {
    if (!clientName || !this.options?.length) {
      this.pendingClientName = clientName;
      return;
    }

    const matchedClient = this.options.find(
      x => x.name?.trim().toLowerCase() === clientName?.trim().toLowerCase()
    );

    if (matchedClient) {
      this.adminFormGroup.get('selectedClient')?.setValue(matchedClient, {
        emitEvent: false
      });
      this.pendingClientName = null;
    } else {
      this.pendingClientName = clientName;
    }
  }

  private buildClientOptions(): void {
    this.options = this.clientList.map((item: any) => ({
      name: item.clientName
    }));
    this.ExecMatSelctFunctions();
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
