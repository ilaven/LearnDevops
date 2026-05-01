import { AfterViewInit, ElementRef, Component, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthPopupComponent } from '../popup/auth-popup/auth-popup.component';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { UserLogPopupComponent } from '../../commonpages/user-log-popup/user-log-popup.component';
import { MatSelect } from '@angular/material/select';
import { UpdateUserPopupComponent } from '../update-user-popup/update-user-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-ups-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  standalone: false,
})
export class UpsSetupComponent implements OnInit, AfterViewInit {
  clientType = signal<any>('');
  t000lookupobj: any = {};

  public upsClientNameFilterCtrl: FormControl = new FormControl('');
  public fedexClientNameFilterCtrl: FormControl = new FormControl('');

  upsFilteredOptions!: Observable<string[]>;
  fedexFilteredOptions!: Observable<string[]>;

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  @ViewChild('singleSelect') singleSelect!: MatSelect;

  clientDetails: any;
  resultclientfetch: any[] = [];
  t001client_profileObj: any = {};
  resultlookup: any[] = [];
  lookupresultAC: any;
  t005customer: any = {};
  resultfetchcustomer: any[] = [];
  showAddUser = false;
  t001custObj: any = {};
  resultObj: any;

  userProfifleVal: any;
  userProfifleData: any;
  userProfifle: any;
  clientID: any;
  clientName: any;
  clientProfileList: any;

  showRegisterBtn = true;
  showUpdateBtn = false;
  themeoption: any;
  panelClass: any;
  filteredOptions!: Observable<string[]>;

  randomNumber: any;
  options: string[] = [];
  clientList: any[] = [];
  clientListFedex: any[] = [];
  maxSize = 10000;
  fileReference: any;
  base64result: any;
  imageUrl: any;
  fileToUpload: any;
  isLoading = true;
  showPassword = false;
  passwordFieldType: 'password' | 'text' = 'password';
  dialogValue: any;
  isClientNameReadOnly = false;
  isClientNameReadOnlyFedex = false;
  t002ClientObj: any = {};

  statusAC = [
    { label: 'ACTIVE', data: 'ACTIVE' },
    { label: 'INACTIVE', data: 'INACTIVE' }
  ];

  setUpFirstFormGroup = new UntypedFormGroup({
    contractReview: new FormControl(false),
    contractSavingsPopup: new FormControl(false),
    payStatus: new FormControl(false),
    clientName: new FormControl(''),
    user_name: new FormControl(''),
    password: new FormControl(''),
    customerType: new FormControl(''),
    email: new FormControl(''),
    customertype: new FormControl(''),
    repname: new FormControl(''),
    clientNameSelected: new FormControl(''),
    fileStartDate: new FormControl(''),
    fileEndDate: new FormControl(''),
    dataLoadBy: new FormControl(''),
    status: new FormControl(''),
    regFedex: new FormControl(false),
    regOntrac: new FormControl(false),
    regDhl: new FormControl(false),
    regUsps: new FormControl(false),
    perfomanceReports: new FormControl(false),
    address: new FormControl(''),
    statusSelected: new FormControl(''),
    phone: new FormControl(''),
    imageFile: new FormControl(''),
    crmAccountNumber: new FormControl(''),
    contractSummary: new FormControl(false),
    t001ClientProfile: new UntypedFormGroup({
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
      year: new FormControl('')
    })
  });

  setUpSecondFormGroup = new UntypedFormGroup({
    customertype: new FormControl(''),
    repname: new FormControl(''),
    clientNameSelected: new FormControl(''),
    fileStartDate: new FormControl(''),
    fileEndDate: new FormControl(''),
    dataLoadBy: new FormControl(''),
    status: new FormControl(''),
    comments: new FormControl('')
  });

  setUpFirstFedexFormGroup = new UntypedFormGroup({
    clientName: new FormControl(''),
    user_name: new FormControl(''),
    password: new FormControl(''),
    customerType: new FormControl(''),
    email: new FormControl(''),
    customertype: new FormControl(''),
    repname: new FormControl(''),
    clientNameSelected: new FormControl(''),
    fileStartDate: new FormControl(''),
    fileEndDate: new FormControl(''),
    dataLoadBy: new FormControl(''),
    status: new FormControl(''),
    regUps: new FormControl(false),
    regOntrac: new FormControl(false),
    regDhl: new FormControl(false),
    regUsps: new FormControl(false),
    address: new FormControl(''),
    phone: new FormControl(''),
    statusSelected: new FormControl(''),
    imageFile: new FormControl(''),
    contractReview: new FormControl(false),
    payStatus: new FormControl(false),
    contractSavingsPopup: new FormControl(false),
    contractSummary: new FormControl(false),
    crmAccountNumber: new FormControl(''),
    griAnalysis: new FormControl(false)
  });

  setUpSecondFedexFormGroup = new UntypedFormGroup({
    customertype: new FormControl(''),
    repname: new FormControl(''),
    clientNameSelected: new FormControl(''),
    fileStartDate: new FormControl(''),
    fileEndDate: new FormControl(''),
    dataLoadBy: new FormControl(''),
    status: new FormControl('')
  });

  constructor(
    private loaderService: LoaderService,
    private httpfedexService: HttpfedexService,
    private httpClientService: HttpClientService,
    private router: Router,
    private cookiesService: CookiesService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.cookiesService.checkForClientName();
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });
  }

  async ngOnInit() {
    this.loaderService.show();

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => res);
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    } else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    if (this.clientType().toUpperCase() === 'FEDEX') {
      this.fetchClientName();
      await this.getUserFedex();
    } else if (this.clientType().toUpperCase() === 'UPS') {
      this.loadClientProfile({});
      await this.getUser();
    }
    this.demoloader();
  }

  ngAfterViewInit() {
    if (this.topScroll?.nativeElement && this.tableScroll?.nativeElement) {
      const tableWidth = this.tableScroll.nativeElement.scrollWidth;
      this.topScroll.nativeElement.firstElementChild?.setAttribute(
        'style',
        `width:${tableWidth}px`
      );
    }
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  async getUser() {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData?.[0];

    if (!this.userProfifle) {
      return;
    }

    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    this.setUpFirstFormGroup.patchValue({
      t001ClientProfile: {
        action: this.userProfifle.action ?? '',
        activeFlag: this.userProfifle.activeFlag ?? '',
        address: this.userProfifle.address ?? '',
        asonDate: this.userProfifle.asonDate ?? '',
        carrierType: this.userProfifle.carrierType ?? '',
        changePassword: this.userProfifle.changePassword ?? '',
        charges: this.userProfifle.charges ?? '',
        clientId: this.userProfifle.clientId ?? '',
        clientName: this.userProfifle.clientName ?? '',
        clientPassword: this.userProfifle.clientPassword ?? '',
        clientdbstatus: this.userProfifle.clientdbstatus ?? '',
        comments: this.userProfifle.comments ?? '',
        contactNo: this.userProfifle.contactNo ?? '',
        contractanalysisstatus: this.userProfifle.contractanalysisstatus ?? '',
        createdBy: this.userProfifle.createdBy ?? '',
        createdTs: this.userProfifle.createdTs ?? '',
        currentDate: this.userProfifle.currentDate ?? '',
        currentstatus: this.userProfifle.currentstatus ?? '',
        customertype: this.userProfifle.customertype ?? '',
        dataFileDestDir: this.userProfifle.dataFileDestDir ?? '',
        dataFileSourceDir: this.userProfifle.dataFileSourceDir ?? '',
        dataLoadBy: this.userProfifle.dataLoadBy ?? '',
        dataSource: this.userProfifle.dataSource ?? '',
        dataasof: this.userProfifle.dataasof ?? '',
        daystoweb: this.userProfifle.daystoweb ?? '',
        email: this.userProfifle.email ?? '',
        employeeTempTotal: this.userProfifle.employeeTempTotal ?? '',
        employerTempTotal: this.userProfifle.employerTempTotal ?? '',
        errorString: this.userProfifle.errorString ?? '',
        fetchPhoto: this.userProfifle.fetchPhoto ?? '',
        fileEndDate: this.userProfifle.fileEndDate ?? '',
        fileStartDate: this.userProfifle.fileStartDate ?? '',
        getImageInd: this.userProfifle.getImageInd ?? '',
        image: this.userProfifle.image ?? '',
        ipaddress: this.userProfifle.ipaddress ?? '',
        isSelected: this.userProfifle.isSelected ?? '',
        isdeletedbyowner: this.userProfifle.isdeletedbyowner ?? '',
        lazyLoad: this.userProfifle.lazyLoad ?? '',
        loginclientId: this.userProfifle.loginclientId ?? '',
        logostatus: this.userProfifle.logostatus ?? '',
        menucount: this.userProfifle.menucount ?? '',
        newPassword: this.userProfifle.newPassword ?? '',
        nextlevelflag: this.userProfifle.nextlevelflag ?? '',
        noofdaysinactive: this.userProfifle.noofdaysinactive ?? '',
        noofdaystoactive: this.userProfifle.noofdaystoactive ?? '',
        password: this.userProfifle.password ?? '',
        payInWords: this.userProfifle.payInWords ?? '',
        repname: this.userProfifle.repname ?? '',
        resetPassword: this.userProfifle.resetPassword ?? '',
        startDate: this.userProfifle.startDate ?? '',
        status: this.userProfifle.status ?? '',
        t301accountAC: this.userProfifle.t301accountAC ?? '',
        t302planAC: this.userProfifle.t302planAC ?? '',
        tablename: this.userProfifle.tablename ?? '',
        trackingcount: this.userProfifle.trackingcount ?? '',
        updatedTs: this.userProfifle.updatedTs ?? '',
        updatedby: this.userProfifle.updatedby ?? '',
        user_name: this.userProfifle.user_name ?? '',
        year: this.userProfifle.year ?? ''
      }
    });
    this.demoloader();
  }

  async getUserFedex() {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData?.[0];
    this.clientID = this.userProfifle?.clientId;
    this.clientName = this.userProfifle?.clientName;
    this.demoloader();
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then((result: any) => {
      this.clientProfileList = result;
      return this.clientProfileList;
    });
    return this.userProfifleVal;
  }

  UserId_clickHandler() {
    this.dialog.open(UserLogPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {}
    });
  }

  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }

  loadClientProfile(param: any) {
    this.httpClientService.loadClientProfile(param).subscribe(
      (result: any) => {
        this.clientList = result || [];
        this.options = this.clientList
          .filter((item: any) => item.clientName != null)
          .map((item: any) => item.clientName);

        this.upsFilteredOptions = this.upsClientNameFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value: string | null) => this.filterUpsClients(value || ''))
        );
      },
      (error: any) => {
        console.log('error ', error);
      }
    );
  }
  private filterUpsClients(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }
  getStatusList(param: any) {
    this.httpClientService.getStatusList(param).subscribe(
      (result: any) => {
        const resultList = result || [];
        if (resultList.length === 0) {
          this.setUpSecondFormGroup.get('dataLoadBy')?.setValue('');
          return;
        }

        const lookupresultAC = resultList[0];
        this.setUpSecondFormGroup.get('dataLoadBy')?.setValue(lookupresultAC.lookup_Value);
      }, (error: any) => { console.log(' error ', error); });
  }

  saveOrUpdateClientBilling(param: any) {
    this.httpClientService.saveOrUpdateClientBilling(param).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => { console.log(' error ', error); });
  }

  saveOrUpdateClient(param: any) {
    this.httpClientService.saveOrUpdateClient(param).subscribe(
      (result: any) => {
        this.resultObj = result;
        this.saveOrUpdateAdminresult();
      }, (error: any) => { console.log(' error ', error); });
  }

  fetchactiveClient() {
    this.httpClientService.fetchactiveClient(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  fetchUserLogin() {
    this.httpClientService.fetchUserLogin(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  fetchactiveinactiveClient() {
    this.httpClientService.fetchactiveinactiveClient(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  saveOrUpdateGridClientmenuList() {
    this.httpClientService.saveOrUpdateGridClientmenuList(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  findClientLoginCredential() {
    this.httpClientService.findClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  AddUserName_ClientLoginCredential() {
    this.httpClientService.AddUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  UpdateUserName_ClientLoginCredential() {
    this.httpClientService.UpdateUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }
  deleteUserName_ClientLoginCredential() {
    this.httpClientService.deleteUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  saveOrUpdateClientProfileFedex(param: any, actionVal: any) { //modified by 9126 
    this.httpfedexService.saveOrUpdateClientProfile(param).subscribe(
      (result: any) => {
        this.resultObj = result;
        if (actionVal == "Update") {
          this.updateclientresult();
        } else {
          this.saveClientResult();
        }
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  fetchClientName() {
    const t002ClientObj: any = {};
    this.httpfedexService.fetchClientName(t002ClientObj).subscribe(
      (result: any) => {
        this.clientList = result || [];
        this.clientListFedex = this.clientList;

        this.fedexFilteredOptions = this.fedexClientNameFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value: string | null) => this.filterFedexClients(value || ''))
        );
      },
      (error) => {
        console.log('error', error);
      });
  }
  private filterFedexClients(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.clientListFedex
      .filter((item: any) => item.clientName)
      .map((item: any) => item.clientName)
      .filter((name: string) => name.toLowerCase().includes(filterValue));
  }

  clearClickHandler() {
    this.isClientNameReadOnly = false;
    this.showAddUser = false;
    this.showUpdateBtn = false;
    this.showRegisterBtn = true;
    this.imageUrl = null;
    this.dialogValue = 'false';

    this.setUpFirstFormGroup.patchValue({
      contractReview: false,
      contractSavingsPopup: false,
      payStatus: false,
      clientName: '',
      user_name: '',
      password: '',
      customerType: '',
      email: '',
      customertype: '',
      repname: '',
      dataLoadBy: '',
      status: '',
      regFedex: false,
      regOntrac: false,
      regDhl: false,
      regUsps: false,
      perfomanceReports: false,
      address: '',
      statusSelected: '',
      phone: '',
      imageFile: '',
      crmAccountNumber: '',
      contractSummary: false
    });

    this.setUpSecondFormGroup.patchValue({
      repname: '',
      clientNameSelected: '',
      fileStartDate: '',
      fileEndDate: '',
      dataLoadBy: '',
      status: '',
      customertype: '',
      comments: ''
    });
  }

  regClickHandler() {
    const txt_clientname = this.setUpFirstFormGroup.get('clientName')?.value;
    const txt_password = this.setUpFirstFormGroup.get('password')?.value;
    const user_name = this.setUpFirstFormGroup.get('user_name')?.value;
    const clientStatus = this.setUpFirstFormGroup.get('statusSelected')?.value;

    if (!txt_clientname || !txt_password || !user_name || !clientStatus) {
      this.openModal('Enter All Required Field');
      return;
    }

    this.confirmationModal()
  }

  sendMail() {
    this.t001custObj = {};
    const custRegid = this.setUpFirstFormGroup.get('regFedex')?.value;
    const auditCustId = this.setUpFirstFormGroup.get('perfomanceReports')?.value;

    this.t001custObj['carrierType'] = custRegid ? 'ups~fedex' : 'ups';
    this.t001custObj['auditcustomerstatus'] = auditCustId ? 'Y' : 'N';

    this.saveOrUpdateClient(this.t001custObj);
  }

  saveOrUpdateresult() {
    this.openModal('Customer Created Successfully');
    this.clearClickHandler();
  }

  lookupstatuslist(event: any) {
    this.lookupresultAC = {};
    this.resultlookup = event || [];

    if (this.resultlookup.length > 0) {
      this.lookupresultAC = this.resultlookup[0];
    }
  }

  resultclientdata(event: any) {
    this.resultclientfetch = event || [];
    if (this.resultclientfetch.length > 0) {
      this.t001client_profileObj = this.resultclientfetch[0];
    }
  }


  fetchresultcustomer(event: any) {
    this.resultfetchcustomer = event || [];
    if (this.resultfetchcustomer.length !== 0) {
      this.openModal('Customer Already exist');
      this.clearClickHandler();
    }
  }

  custChangeHandler(event: any) {
    this.isClientNameReadOnly = true;
    this.showUpdateBtn = true;
    this.showRegisterBtn = false;
    this.showAddUser = true;
    this.setUpFirstFormGroup.get("regFedex")?.setValue(false);
    this.setUpFirstFormGroup.get("regOntrac")?.setValue(false);
    this.setUpFirstFormGroup.get("regDhl")?.setValue(false);
    this.setUpFirstFormGroup.get("regUsps")?.setValue(false);
    this.setUpFirstFormGroup.get("perfomanceReports")?.setValue(false);
    this.setUpFirstFormGroup.get("contractReview")?.setValue(false);
    this.setUpFirstFormGroup.get("contractSavingsPopup")?.setValue(false);
    this.setUpFirstFormGroup.get("payStatus")?.setValue(false);
    this.setUpFirstFormGroup.get("contractSummary")?.setValue(false);

    for (var loop = 0; loop < this.clientList.length; loop++) {
      if (this.clientList[loop].clientName == event) {
        this.t001custObj = this.clientList[loop];
      }
    }
    this.clientDetails = this.t001custObj;
    var startDate = this.datePipe.transform(this.t001custObj.fileStartDate, "MM-dd-yyyy");
    this.setUpSecondFormGroup.get("fileStartDate")?.setValue(startDate);
    this.setUpFirstFormGroup.get("clientName")?.setValue(this.t001custObj.clientName);
    this.setUpFirstFormGroup.get("user_name")?.setValue(this.t001custObj.user_name);
    this.setUpFirstFormGroup.get("password")?.setValue(this.t001custObj.password);
    this.setUpFirstFormGroup.get("email")?.setValue(this.t001custObj.email);
    this.setUpFirstFormGroup.get("repname")?.setValue(this.t001custObj.repname);
    this.setUpFirstFormGroup.get("address")?.setValue(this.t001custObj.address);
    this.setUpFirstFormGroup.get("phone")?.setValue(this.t001custObj.contactNo);
    this.setUpFirstFormGroup.get("contractReview")?.setValue(this.t001custObj.contractreviewstatus);
    this.setUpFirstFormGroup.get("payStatus")?.setValue(this.t001custObj.payStatus);
    this.setUpFirstFormGroup.get("contractSummary")?.setValue(this.t001custObj.contractSummary);

    this.setUpSecondFormGroup.get("repname")?.setValue(this.t001custObj.repname);
    this.setUpSecondFormGroup.get("fileEndDate")?.setValue(this.t001custObj.fileEndDate);
    this.setUpSecondFormGroup.get("customertype")?.setValue(this.t001custObj.customertype);
    this.setUpSecondFormGroup.get("dataLoadBy")?.setValue(this.t001custObj.dataLoadBy);
    this.setUpSecondFormGroup.get("status")?.setValue(this.t001custObj.status);
    this.setUpFirstFormGroup.get("statusSelected")?.setValue(this.t001custObj.status);
    this.setUpFirstFormGroup.get("crmAccountNumber")?.setValue(this.t001custObj.crmAccountNumber);

    var carrierType = this.t001custObj.carrierType;
    var auditcustomerstatus = this.t001custObj.auditcustomerstatus;
    var contractanalysisstatus = this.t001custObj.contractanalysisstatus;


    if (carrierType != null) {
      if (carrierType.toUpperCase() == 'UPS~FEDEX' || carrierType.toUpperCase() == 'UPS~FEDEX~ONTRAC' || carrierType.toUpperCase() == 'UPS~FEDEX~DHL' || carrierType.toUpperCase() == 'UPS~FEDEX~ONTRAC~DHL') {
        this.setUpFirstFormGroup.get("regFedex")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('ONTRAC')) {
        this.setUpFirstFormGroup.get("regOntrac")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('DHL')) {
        this.setUpFirstFormGroup.get("regDhl")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('USPS')) {
        this.setUpFirstFormGroup.get("regUsps")?.setValue(true);
      }
    } else {
      this.setUpFirstFormGroup.get("regFedex")?.setValue(false);
      this.setUpFirstFormGroup.get("regDhl")?.setValue(false);
      this.setUpFirstFormGroup.get("regOntrac")?.setValue(false);
      this.setUpFirstFormGroup.get("regUsps")?.setValue(false);
    }
    if (auditcustomerstatus != null) {
      if (auditcustomerstatus.toUpperCase() == 'Y') {
        this.setUpFirstFormGroup.get("perfomanceReports")?.setValue(true);
      } else {
        this.setUpFirstFormGroup.get("perfomanceReports")?.setValue(false);
      }
    } else {
      this.setUpFirstFormGroup.get("perfomanceReports")?.setValue(false);
    }

    if (contractanalysisstatus != null) {
      if (contractanalysisstatus.toUpperCase() == 'YES') {
        this.setUpFirstFormGroup.get("contractSavingsPopup")?.setValue(true);
      } else {
        this.setUpFirstFormGroup.get("contractSavingsPopup")?.setValue(false);
      }
    } else {
      this.setUpFirstFormGroup.get("contractSavingsPopup")?.setValue(false);
    }
    if (this.t001custObj.status.toUpperCase() == "INACTIVE" || this.t001custObj.status.toUpperCase() == "ACTIVE") {
      this.openModal("Customer Already Exist! You can Update the Customer now");
      this.showRegisterBtn = false;
      this.showUpdateBtn = true;
      this.showAddUser = true;
    }
    else {
      this.showRegisterBtn = true;
      this.showUpdateBtn = false;
      this.showAddUser = false;
    }
    this.t000lookupobj["lookup_Code"] = this.clientDetails["dataLoadBy"];
    this.getStatusList(this.t000lookupobj);
  }
  updateClickHandler() {
    const txt_email = this.setUpFirstFormGroup.get('email')?.value;
    const txt_password = this.setUpFirstFormGroup.get('password')?.value;
    const user_name = this.setUpFirstFormGroup.get('user_name')?.value;
    const clientStatus = this.setUpFirstFormGroup.get('statusSelected')?.value;
    const txt_reps = this.setUpFirstFormGroup.get('repname')?.value;
    const txt_status = this.setUpSecondFormGroup.get('status')?.value;
    const address = this.setUpFirstFormGroup.get('address')?.value;
    const phone = this.setUpFirstFormGroup.get('phone')?.value;

    if (!txt_password || !user_name || !clientStatus) {
      this.openModal('Enter All Required Field');
      return;
    }

    this.t001custObj['image'] = this.imageUrl ? this.imageUrl.split(',')[1] : null;

    const regFedEx = this.setUpFirstFormGroup.get('regFedex')?.value;
    const regOntrac = this.setUpFirstFormGroup.get('regOntrac')?.value;
    const regDhl = this.setUpFirstFormGroup.get('regDhl')?.value;
    const regUsps = this.setUpFirstFormGroup.get('regUsps')?.value;
    const auditCustId = this.setUpFirstFormGroup.get('perfomanceReports')?.value;
    const contractReviewStatus = this.setUpFirstFormGroup.get('contractReview')?.value;
    const contractAnalysisStatus = this.setUpFirstFormGroup.get('contractSavingsPopup')?.value;
    const payWebPortalStatus = this.setUpFirstFormGroup.get('payStatus')?.value;
    const contractSummaryWebPortalStatus = this.setUpFirstFormGroup.get('contractSummary')?.value;

    this.t001custObj['currentstatus'] = clientStatus;
    this.t001custObj['repname'] = txt_reps;
    this.t001custObj['email'] = txt_email;
    this.t001custObj['password'] = txt_password;
    this.t001custObj['user_name'] = user_name;
    this.t001custObj['clientdbstatus'] = txt_status;
    this.t001custObj['contactNo'] = phone;
    this.t001custObj['updatedby'] = 'Admin';
    this.t001custObj['address'] = address;

    let carrierType = 'ups';
    if (regFedEx) carrierType += '~fedex';
    if (regOntrac) carrierType += '~ontrac';
    if (regDhl) carrierType += '~dhl';
    if (regUsps) carrierType += '~usps';

    this.t001custObj['carrierType'] = carrierType;
    this.t001custObj['auditcustomerstatus'] = auditCustId ? 'Y' : 'N';
    this.t001custObj['contractreviewstatus'] = !!contractReviewStatus;
    this.t001custObj['contractreviewstatusflag'] = 'No';
    this.t001custObj['payStatus'] = !!payWebPortalStatus;
    this.t001custObj['payFlag'] = 'No';
    this.t001custObj['contractSummary'] = !!contractSummaryWebPortalStatus;
    this.t001custObj['contractSummaryflag'] = 'No';
    this.t001custObj['contractanalysisstatus'] = contractAnalysisStatus ? 'Yes' : 'No';
    this.t001custObj['contractsavingspopupflag'] = 'No';
    this.t001custObj['loginEmailId'] = this.cookiesService.getCookieItem('loginEmailId');
    this.t001custObj['crmAccountNumber'] =
      this.setUpFirstFormGroup.get('crmAccountNumber')?.value;

    this.sendLoginEmail();
    this.saveOrUpdateClient(this.t001custObj);

    const billingObj: any = {};
    billingObj['clientid'] = this.t001custObj.clientId;
    billingObj['status'] = clientStatus;
    this.t001custObj['status'] = clientStatus;
    this.saveOrUpdateClientBilling(billingObj);
  }

  updateContractReviewStatus() {
    var contractReviewObj: any = {};
    contractReviewObj["clientId"] = this.t001custObj.clientId;
    var contractReviewStatus = this.setUpFirstFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      contractReviewObj["contractreviewstatus"] = true;
      this.t001custObj["contractreviewstatus"] = true;
    } else {
      contractReviewObj["contractreviewstatus"] = false;
      this.t001custObj["contractreviewstatus"] = false;
    }
    contractReviewObj["contractreviewstatusflag"] = "Yes";
    this.httpClientService.saveOrUpdateClient(contractReviewObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      },
      (error: any) => {
        console.log(' error ', error);
      })
  }

  updateContractReviewStatusFedex() {
    var contractReviewObj: any = {};
    contractReviewObj["clientId"] = this.t002ClientObj.clientId;
    var contractReviewStatus = this.setUpFirstFedexFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      contractReviewObj["contractReviewStatus"] = true;
      this.t002ClientObj["contractReviewStatus"] = true;
    } else {
      contractReviewObj["contractReviewStatus"] = false;
      this.t002ClientObj["contractReviewStatus"] = false;
    }
    contractReviewObj["contractReviewStatusFlag"] = "Yes";
    this.httpfedexService.saveOrUpdateClientProfile(contractReviewObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      },
      (error: any) => {
        console.log(' error ', error);
      })
  }

  saveOrUpdateAdminresult() {
    this.openModal('Customer Updated Successfully');
    this.clearClickHandler();
  }

  sendLoginEmail() { }


  save_clickHandlerFedex() {
    var client_name = this.setUpFirstFedexFormGroup.get("clientName")?.value;
    var email = this.setUpFirstFedexFormGroup.get("email")?.value;
    var username = this.setUpFirstFedexFormGroup.get("user_name")?.value;
    var password = this.setUpFirstFedexFormGroup.get("password")?.value;
    var status = this.setUpFirstFedexFormGroup.get("statusSelected")?.value;
    var address = this.setUpFirstFedexFormGroup.get("address")?.value;
    var phone = this.setUpFirstFedexFormGroup.get("phone")?.value;
    var regUps = this.setUpFirstFedexFormGroup.get("regUps")?.value;
    var regOntrac = this.setUpFirstFedexFormGroup.get("regOntrac")?.value;
    var regDhl = this.setUpFirstFedexFormGroup.get("regDhl")?.value;
    var regUsps = this.setUpFirstFedexFormGroup.get("regUsps")?.value;
    var payWebPortalStatus = this.setUpFirstFedexFormGroup.get("payStatus")?.value;
    var contractSummaryWebPortalStatus = this.setUpFirstFedexFormGroup.get("contractSummary")?.value;
    var griAnalysisWebPortalStatus = this.setUpFirstFedexFormGroup.get("griAnalysis")?.value;

    if (client_name == "" || username == "" || password == "" || status == "") {
      this.openModal("Please Fill the Required Fields!");
      return;
    }
    var t002newClientObj: any = {};
    t002newClientObj["clientName"] = client_name;
    t002newClientObj["clientProfileName"] = client_name;
    t002newClientObj["userName"] = username;
    t002newClientObj["password"] = password;
    t002newClientObj["siteUserName"] = username;
    t002newClientObj["sitePassword"] = password;
    t002newClientObj["status"] = status;
    t002newClientObj["email"] = email;
    t002newClientObj["address"] = address;
    t002newClientObj["contactNo"] = phone;
    t002newClientObj["theme_option"] = "light"
    t002newClientObj["adminFlag"] = "N";
    t002newClientObj["regUps"] = regUps;
    t002newClientObj["regOntrac"] = regOntrac;
    t002newClientObj["regDhl"] = regDhl;
    t002newClientObj["regUsps"] = regUsps;
    var carrierTypeFedEx = "fedex";
    var carrierType = "";
    if (regUps == true) {
      carrierType = carrierType + "ups~";
    }

    carrierType = carrierType + "" + carrierTypeFedEx;
    if (regOntrac == true) {
      carrierType = carrierType + "~ontrac";
    }
    if (regDhl == true) {
      carrierType = carrierType + "~dhl";
    }
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }

    t002newClientObj["carrierType"] = carrierType;
    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
      t002newClientObj["userLogo"] = this.base64result;
    } else {
      t002newClientObj["userLogo"] = null;
    }

    var contractReviewStatus = this.setUpFirstFedexFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      t002newClientObj["contractReviewStatus"] = true;
    } else {
      t002newClientObj["contractReviewStatus"] = false;
    }
    t002newClientObj["contractReviewStatusFlag"] = "No";

    var contractSavingStatus = this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingStatus == true) {
      t002newClientObj["contractSavingFlag"] = "Y";
    } else {
      t002newClientObj["contractSavingFlag"] = "N";
    }
    t002newClientObj["contractSavingsPopupFlag"] = "No";

    if (payWebPortalStatus == true) {
      t002newClientObj["payStatus"] = true;
    } else {
      t002newClientObj["payStatus"] = false;
    }
    t002newClientObj["payFlag"] = "No";
    if (contractSummaryWebPortalStatus == true) {
      t002newClientObj["contractSummary"] = true;
    } else {
      t002newClientObj["contractSummary"] = false;
    }

    t002newClientObj["contractSummaryflag"] = "No";
    t002newClientObj["crmAccountNumber"] = this.setUpFirstFedexFormGroup.get("crmAccountNumber")?.value;
    if (griAnalysisWebPortalStatus == true) {
      t002newClientObj["griAnalysis"] = true;
    } else {
      t002newClientObj["griAnalysis"] = false;
    }
    t002newClientObj["griAnalysisflag"] = "No";
    this.saveOrUpdateClientProfileFedex(t002newClientObj, "Register");
  }

  saveClientResult() {
    this.openModal("A new Customer has been added successfully!");
    this.clearClickHandlerFedex();
  }

  uptuser_changeHandler(event: any) {
    this.isClientNameReadOnlyFedex = true;
    this.setUpFirstFedexFormGroup.get("regUps")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("regOntrac")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("regDhl")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("regUsps")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("contractReview")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("payStatus")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("contractSummary")?.setValue(false);
    this.setUpFirstFedexFormGroup.get("griAnalysis")?.setValue(false);
    for (var loop = 0; loop < this.clientListFedex.length; loop++) {
      if (this.clientListFedex[loop].clientName == event) {
        this.t002ClientObj = this.clientListFedex[loop];
      }
    }
    var client_name = this.t002ClientObj.clientName;
    var email = this.t002ClientObj.email;
    var password = this.t002ClientObj.password;
    var status = this.t002ClientObj.status;
    var address = this.t002ClientObj.address;
    var user_name = this.t002ClientObj.userName;
    var customerType = this.t002ClientObj.customerType;
    var fileStartDate = this.t002ClientObj.startDate;
    this.setUpFirstFedexFormGroup.get('clientName')?.setValue(client_name);
    this.setUpFirstFedexFormGroup.get('email')?.setValue(email);
    this.setUpFirstFedexFormGroup.get('password')?.setValue(password);
    this.setUpFirstFedexFormGroup.get('address')?.setValue(address);
    this.setUpFirstFedexFormGroup.get('status')?.setValue(status);
    this.setUpFirstFedexFormGroup.get('user_name')?.setValue(user_name);
    this.setUpFirstFedexFormGroup.get("contractReview")?.setValue(this.t002ClientObj.contractReviewStatus);
    this.setUpFirstFedexFormGroup.get("payStatus")?.setValue(this.t002ClientObj.payStatus);
    this.setUpSecondFedexFormGroup.get('customertype')?.setValue(customerType);
    this.setUpSecondFedexFormGroup.get('fileStartDate')?.setValue(fileStartDate);
    this.setUpFirstFedexFormGroup.get("contractSummary")?.setValue(this.t002ClientObj.contractSummary);
    this.setUpFirstFedexFormGroup.get("crmAccountNumber")?.setValue(this.t002ClientObj.crmAccountNumber);
    this.setUpFirstFedexFormGroup.get("griAnalysis")?.setValue(this.t002ClientObj.griAnalysis);
    var status = this.setUpFirstFedexFormGroup.get("statusSelected")?.value;
    var contractanalysisstatus = this.t002ClientObj.contractSavingFlag;

    this.setUpSecondFedexFormGroup.get("status")?.setValue(this.t002ClientObj.status);
    if (this.t002ClientObj != null) {
      this.showUpdateBtn = true;
      this.showRegisterBtn = false;
      this.isClientNameReadOnly = true;
      var carrierType = this.t002ClientObj.carrierType;
      if (carrierType != null) {
        if (carrierType.toUpperCase() == 'UPS~FEDEX' || carrierType.toUpperCase() == 'UPS~FEDEX~ONTRAC' || carrierType.toUpperCase() == 'UPS~FEDEX~DHL' || carrierType.toUpperCase() == 'UPS~FEDEX~ONTRAC~DHL') {
          this.setUpFirstFedexFormGroup.get("regUps")?.setValue(true);
        }
        if (carrierType.toUpperCase().includes('ONTRAC')) {
          this.setUpFirstFedexFormGroup.get("regOntrac")?.setValue(true);
        }
        if (carrierType.toUpperCase().includes('DHL')) {
          this.setUpFirstFedexFormGroup.get("regDhl")?.setValue(true);
        }
        if (carrierType.toUpperCase().includes('USPS')) {
          this.setUpFirstFedexFormGroup.get("regUsps")?.setValue(true);
        }
      } else {
        this.setUpFirstFedexFormGroup.get("regUps")?.setValue(false);
        this.setUpFirstFedexFormGroup.get("regOntrac")?.setValue(false);
        this.setUpFirstFedexFormGroup.get("regDhl")?.setValue(false);
        this.setUpFirstFedexFormGroup.get("regUsps")?.setValue(false);
      }

      if (contractanalysisstatus != null) {
        if (contractanalysisstatus.toUpperCase() == 'Y') {
          this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.setValue(true);
        } else {
          this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.setValue(false);
        }
      } else {
        this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.setValue(false);
      }

      if (status == "" || status == "null" || status == null) {
        this.setUpFirstFedexFormGroup.get("statusSelected")?.setValue("");
      }
      if (this.t002ClientObj.status != null) {  //9126
        for (var loop = 0; loop < this.statusAC.length; loop++) {
          if (this.statusAC[loop].label == (this.t002ClientObj.status).toUpperCase())
            var status = this.t002ClientObj.status;  //9126
          this.setUpFirstFedexFormGroup.get("statusSelected")?.setValue(status.toUpperCase());
        }
      }
    }
  }

  updateclientresult() {
    this.openModal("Customer updated successfully");
    this.clearClickHandlerFedex();
  }

  update_clickHandlerFedex() {
    var client_name = this.setUpFirstFedexFormGroup.get("clientName")?.value;
    var email = this.setUpFirstFedexFormGroup.get("email")?.value;
    var username = this.setUpFirstFedexFormGroup.get("user_name")?.value;
    var password = this.setUpFirstFedexFormGroup.get("password")?.value;
    var status = this.setUpFirstFedexFormGroup.get("status")?.value;
    var currentstatus = this.setUpFirstFedexFormGroup.get("statusSelected")?.value;

    var address = this.setUpFirstFedexFormGroup.get("address")?.value;
    var phone = this.setUpFirstFedexFormGroup.get("phone")?.value;
    var regUps = this.setUpFirstFedexFormGroup.get("regUps")?.value;
    var regOntrac = this.setUpFirstFedexFormGroup.get("regOntrac")?.value;
    var regDhl = this.setUpFirstFedexFormGroup.get("regDhl")?.value;
    var regUsps = this.setUpFirstFedexFormGroup.get("regUsps")?.value;
    var contractReviewStatus = this.setUpFirstFedexFormGroup.get("contractReview")?.value;
    var contractSavingsStatus = this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.value;
    var payWebPortalStatus = this.setUpFirstFedexFormGroup.get("payStatus")?.value;
    var contractSummaryWebPortalStatus = this.setUpFirstFedexFormGroup.get("contractSummary")?.value;
    var griAnalysisWebPortalStatus = this.setUpFirstFedexFormGroup.get("griAnalysis")?.value;

    if (client_name == "" || username == "" || password == "" || currentstatus == "") {
      this.openModal("Please Fill the Required Fields!");
      return;
    }

    this.t002ClientObj["email"] = email;
    this.t002ClientObj["userName"] = username;
    this.t002ClientObj["password"] = password;
    this.t002ClientObj["address"] = address;
    this.t002ClientObj["phone"] = phone;
    this.t002ClientObj["regUps"] = regUps;
    this.t002ClientObj["currentstatus"] = currentstatus;
    this.t002ClientObj["updatedby"] = "Admin";

    if (this.t002ClientObj["adminFlag"] != null || this.t002ClientObj["adminFlag"] != "" || this.t002ClientObj["adminFlag"] != "Y") {
      this.t002ClientObj["adminFlag"] != "N"
    }
    this.t002ClientObj["status"] = status;//9059
    var carrierTypeFedEx = "fedex";
    var carrierType = "";
    if (regUps == true) {
      carrierType = carrierType + "ups~";
    }
    carrierType = carrierType + "" + carrierTypeFedEx;
    if (regOntrac == true) {
      carrierType = carrierType + "~ontrac";
    }
    if (regDhl == true) {
      carrierType = carrierType + "~dhl";
    }
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }

    this.t002ClientObj["carrierType"] = carrierType;

    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
      this.t002ClientObj["userLogo"] = this.base64result;//9126
    } else {
      this.t002ClientObj["userLogo"] = null;//9126
    }

    if (contractReviewStatus == true) {
      this.t002ClientObj["contractReviewStatus"] = true;
    } else {
      this.t002ClientObj["contractReviewStatus"] = false;
    }
    this.t002ClientObj["contractReviewStatusFlag"] = "No";

    if (payWebPortalStatus == true) {
      this.t002ClientObj["payStatus"] = true;
    } else {
      this.t002ClientObj["payStatus"] = false;
    }
    this.t002ClientObj["payFlag"] = "No";
    if (contractSummaryWebPortalStatus == true) {
      this.t002ClientObj["contractSummary"] = true;
    } else {
      this.t002ClientObj["contractSummary"] = false;
    }
    this.t002ClientObj["contractSummaryflag"] = "No";

    if (contractSavingsStatus == true) {
      this.t002ClientObj["contractSavingFlag"] = "Y";
    } else {
      this.t002ClientObj["contractSavingFlag"] = "N";
    }
    this.t002ClientObj["contractSavingsPopupFlag"] = "No";
    this.t002ClientObj["loginEmailId"] = this.cookiesService.getCookieItem('loginEmailId');
    this.t002ClientObj["crmAccountNumber"] = this.setUpFirstFedexFormGroup.get("crmAccountNumber")?.value;
    if (griAnalysisWebPortalStatus == true) {
      this.t002ClientObj["griAnalysis"] = true;
    } else {
      this.t002ClientObj["griAnalysis"] = false;
    }
    this.t002ClientObj["griAnalysisflag"] = "No";
    this.saveOrUpdateClientProfileFedex(this.t002ClientObj, "Update"); //9126
    this.t002ClientObj["status"] = currentstatus;
  }

  fileProgress(event: any) {
    const file = event?.target?.files?.[0];
    if (!file) {
      return;
    }

    this.fileToUpload = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imageUrl = e.target.result;
      this.base64result = this.imageUrl ? this.imageUrl.split(',')[1] : null;
    };
    reader.readAsDataURL(file);
  }
  openModalConfig: any;
  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  /*Contract Analysis Savings Popup Enable/Disable*/
  updateContractSavingsPopup() {
    var contractSavingsPopupObj: any = {};
    contractSavingsPopupObj["clientId"] = this.t001custObj.clientId;
    var contractSavingsStatus = this.setUpFirstFormGroup.get("contractSavingsPopup")?.value;

    contractSavingsPopupObj['contractanalysisstatus'] = contractSavingsStatus ? 'Yes' : 'No';
    this.t001custObj['contractanalysisstatus'] = contractSavingsStatus ? 'Yes' : 'No';
    contractSavingsPopupObj['contractsavingspopupflag'] = 'Yes';

    this.httpClientService.saveOrUpdateClient(contractSavingsPopupObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  updatePayWebPortal() {
    var payWebPortalObj: any = {};
    payWebPortalObj["clientId"] = this.t001custObj.clientId;
    var payWebPortalStatus = this.setUpFirstFormGroup.get("payStatus")?.value;
    if (payWebPortalStatus == true) {
      payWebPortalObj["payStatus"] = true;
      this.t001custObj["payStatus"] = true;
    } else {
      payWebPortalObj["payStatus"] = false;
      this.t001custObj["payStatus"] = false;
    }
    payWebPortalObj["payFlag"] = "Yes";

    this.httpClientService.saveOrUpdateClient(payWebPortalObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  updatePayWebPortalFedEx() {
    var payWebPortalObj: any = {};
    payWebPortalObj["clientId"] = this.t002ClientObj.clientId;
    var payWebPortalStatus = this.setUpFirstFedexFormGroup.get("payStatus")?.value;
    if (payWebPortalStatus == true) {
      payWebPortalObj["payStatus"] = true;
      this.t002ClientObj["payStatus"] = true;
    } else {
      payWebPortalObj["payStatus"] = false;
      this.t002ClientObj["payStatus"] = false;
    }
    payWebPortalObj["payFlag"] = "Yes";
    this.httpfedexService.saveOrUpdateClientProfile(payWebPortalObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  updateContractSavingsPopupFedex() {
    var contractSavingsPopupObj: any = {};
    contractSavingsPopupObj["clientId"] = this.t002ClientObj.clientId;
    var contractSavingsStatus = this.setUpFirstFedexFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingsStatus == true) {
      contractSavingsPopupObj["contractSavingFlag"] = "Y";
      this.t002ClientObj["contractSavingFlag"] = "Y";
    } else {
      contractSavingsPopupObj["contractSavingFlag"] = "N";
      this.t002ClientObj["contractSavingFlag"] = "N";
    }

    contractSavingsPopupObj["contractSavingsPopupFlag"] = "Yes";
    this.httpfedexService.saveOrUpdateClientProfile(contractSavingsPopupObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  updateContractSummary() {
    var contractSummaryWebPortalObj: any = {};
    contractSummaryWebPortalObj["clientId"] = this.t001custObj.clientId;
    var contractSummaryWebPortalStatus = this.setUpFirstFormGroup.get("contractSummary")?.value;
    if (contractSummaryWebPortalStatus == true) {
      contractSummaryWebPortalObj["contractSummary"] = true;
      this.t001custObj["contractSummary"] = true;
    } else {
      contractSummaryWebPortalObj["contractSummary"] = false;
      this.t001custObj["contractSummary"] = false;
    }

    contractSummaryWebPortalObj["contractSummaryflag"] = "Yes";
    this.httpClientService.saveOrUpdateClient(contractSummaryWebPortalObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  updateContractSummaryFedEx() {
    let contractSummaryWebPortalObj: any = {};
    contractSummaryWebPortalObj["clientId"] = this.t002ClientObj.clientId;
    var contractSummaryWebPortalStatus = this.setUpFirstFedexFormGroup.get("contractSummary")?.value;
    if (contractSummaryWebPortalStatus == true) {
      contractSummaryWebPortalObj["contractSummary"] = true;
      this.t002ClientObj["contractSummary"] = true;
    } else {
      contractSummaryWebPortalObj["contractSummary"] = false;
      this.t002ClientObj["contractSummary"] = false;
    }
    contractSummaryWebPortalObj["contractSummaryflag"] = "Yes";
    this.httpfedexService.saveOrUpdateClientProfile(contractSummaryWebPortalObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  updateGRIAnalysisFedEx() {
    var GRIAnalysisWebPortalObj: any = {};
    GRIAnalysisWebPortalObj["clientId"] = this.t002ClientObj.clientId;
    var GRIAnalysisWebPortalStatus = this.setUpFirstFedexFormGroup.get("griAnalysis")?.value;
    if (GRIAnalysisWebPortalStatus == true) {
      GRIAnalysisWebPortalObj["griAnalysis"] = true;
      this.t002ClientObj["griAnalysis"] = true;
    } else {
      GRIAnalysisWebPortalObj["griAnalysis"] = false;
      this.t002ClientObj["griAnalysis"] = false;
    }
    GRIAnalysisWebPortalObj["griAnalysisflag"] = "Yes";
    this.httpfedexService.saveOrUpdateClientProfile(GRIAnalysisWebPortalObj).subscribe(
      (result: any) => {
        this.openModal("Customer Updated Successfully");
      }, (error: any) => {
        console.log(' error ', error);
      })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  async openAuthModal() {
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => res);
    this.panelClass =
      this.themeoption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';

    const dialogConfig = this.dialog.open(AuthPopupComponent, {
      width: '470px',
      height: 'auto',
      disableClose: true,
      panelClass: this.panelClass
    });

    dialogConfig.afterClosed().subscribe((result) => {
      this.dialogValue = result?.event;
    });
  }

  clearClickHandlerFedex() {
    this.isClientNameReadOnlyFedex = false;
    this.showUpdateBtn = false;
    this.showRegisterBtn = true;
    this.imageUrl = null;
    this.dialogValue = 'false';

    this.setUpFirstFedexFormGroup.reset({
      clientName: '',
      user_name: '',
      password: '',
      customerType: '',
      email: '',
      customertype: '',
      repname: '',
      clientNameSelected: '',
      fileStartDate: '',
      fileEndDate: '',
      dataLoadBy: '',
      status: '',
      regUps: false,
      regOntrac: false,
      regDhl: false,
      regUsps: false,
      address: '',
      phone: '',
      statusSelected: '',
      imageFile: '',
      contractReview: false,
      payStatus: false,
      contractSavingsPopup: false,
      contractSummary: false,
      crmAccountNumber: '',
      griAnalysis: false
    });

    this.setUpSecondFedexFormGroup.reset({
      customertype: '',
      repname: '',
      clientNameSelected: '',
      fileStartDate: '',
      fileEndDate: '',
      dataLoadBy: '',
      status: ''
    });
  }

  openUpdatePopup() {
    const dialogRef = this.dialog.open(UpdateUserPopupComponent, {
      width: '60%',
      height: '350px',
      panelClass: this.panelClass,
      data: {
        pageValue: this.clientDetails,
        panelClass: this.panelClass
      }
    });
  }
  confirmationModal(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '350px',
      height: 'auto',
      data: { message: 'Do you want to register this customer?' },
      panelClass: this.panelClass,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sendMail();
      }
    });
  }
}