import { AfterViewInit, ElementRef, Component, OnInit, TemplateRef, ViewChild, signal } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { UserLogPopupComponent } from '../../commonpages/user-log-popup/user-log-popup.component';
import { AuthPopupComponent } from '../../UPS/popup/auth-popup/auth-popup.component';
import { AdminMenuControlComponent } from '../../commonpages/admin-menu-control/admin-menu-control.component';
import { UpdateUserPopupComponent } from '../../UPS/update-user-popup/update-user-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-usps-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  standalone: false
})
export class UspsSetupComponent implements OnInit, AfterViewInit {
  clientType = signal<any>('');
  t000lookupobj: any = {};
  t000Obj: any = {};

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('singleSelect') singleSelect!: MatSelect;

  public ClientNameFilterCtrl: FormControl = new FormControl('');

  uspsFilteredOptions!: Observable<string[]>;

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
  fileToUpload: File | null = null;
  isLoading = true;
  showPassword = false;
  passwordFieldType: 'password' | 'text' = 'password';
  dialogValue: any;
  isClientNameReadOnly = false;
  isClientNameReadOnlyFedex = false;
  isClientNameReadOnlyDhl = false;
  t002ClientObj: any = {};

  statusAC = [
    { label: 'ACTIVE', data: 'ACTIVE' },
    { label: 'INACTIVE', data: 'INACTIVE' }
  ];

  setUpFirstFormGroup = new UntypedFormGroup({
    contractReview: new FormControl(false),
    contractSavingsPopup: new FormControl(false),
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
    regDhl: new FormControl(false),
    regUps: new FormControl(false),
    regOntrac: new FormControl(false),
    regFedEx: new FormControl(false),
    perfomanceReports: new FormControl(false),
    address: new FormControl(''),
    statusSelected: new FormControl(''),
    phone: new FormControl(''),
    imageFile: new FormControl(''),
    crmAccountNumber: new FormControl(''),
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
      year: new FormControl(''),
      crmAccountNumber: new FormControl('')
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

  constructor(
    private loaderService: LoaderService,
    private httpUSPSService: HttpUSPSService,
    private httpClientService: HttpClientService,
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

  async ngOnInit(): Promise<void> {
    this.loaderService.show();

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => res);
    this.panelClass = this.themeoption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';

    if ((this.clientType() || '').toUpperCase() === 'USPS') {
      this.loadClientProfile({});
      await this.getUserUSPS();
    }
    this.demoloader();
  }

  ngAfterViewInit(): void {
    if (this.topScroll?.nativeElement && this.tableScroll?.nativeElement) {
      const tableWidth = this.tableScroll.nativeElement.scrollWidth;
      this.topScroll.nativeElement.firstElementChild?.setAttribute('style', `width:${tableWidth}px`);
    }
  }

  syncScroll(event: Event, source: 'top' | 'table'): void {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  demoloader(): void {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  private _filter(value: string): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue));
  }

  async getUserUSPS(): Promise<void> {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData?.[0];

    if (!this.userProfifle) {
      return;
    }

    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    this.setUpFirstFormGroup.patchValue({
      t001ClientProfile: {
        action: this.userProfifle.action,
        activeFlag: this.userProfifle.activeFlag,
        address: this.userProfifle.address,
        asonDate: this.userProfifle.asonDate,
        carrierType: this.userProfifle.carrierType,
        changePassword: this.userProfifle.changePassword,
        charges: this.userProfifle.charges,
        clientId: this.userProfifle.clientId,
        clientName: this.userProfifle.clientName,
        clientPassword: this.userProfifle.clientPassword,
        clientdbstatus: this.userProfifle.clientdbstatus,
        comments: this.userProfifle.comments,
        contactNo: this.userProfifle.contactNo,
        contractanalysisstatus: this.userProfifle.contractanalysisstatus,
        createdBy: this.userProfifle.createdBy,
        createdTs: this.userProfifle.createdTs,
        currentDate: this.userProfifle.currentDate,
        currentstatus: this.userProfifle.currentstatus,
        customertype: this.userProfifle.customertype,
        dataFileDestDir: this.userProfifle.dataFileDestDir,
        dataFileSourceDir: this.userProfifle.dataFileSourceDir,
        dataLoadBy: this.userProfifle.dataLoadBy,
        dataSource: this.userProfifle.dataSource,
        dataasof: this.userProfifle.dataasof,
        daystoweb: this.userProfifle.daystoweb,
        email: this.userProfifle.email,
        employeeTempTotal: this.userProfifle.employeeTempTotal,
        employerTempTotal: this.userProfifle.employerTempTotal,
        errorString: this.userProfifle.errorString,
        fetchPhoto: this.userProfifle.fetchPhoto,
        fileEndDate: this.userProfifle.fileEndDate,
        fileStartDate: this.userProfifle.fileStartDate,
        getImageInd: this.userProfifle.getImageInd,
        image: this.userProfifle.image,
        ipaddress: this.userProfifle.ipaddress,
        isSelected: this.userProfifle.isSelected,
        isdeletedbyowner: this.userProfifle.isdeletedbyowner,
        lazyLoad: this.userProfifle.lazyLoad,
        loginclientId: this.userProfifle.loginclientId,
        logostatus: this.userProfifle.logostatus,
        menucount: this.userProfifle.menucount,
        newPassword: this.userProfifle.newPassword,
        nextlevelflag: this.userProfifle.nextlevelflag,
        noofdaysinactive: this.userProfifle.noofdaysinactive,
        noofdaystoactive: this.userProfifle.noofdaystoactive,
        password: this.userProfifle.password,
        payInWords: this.userProfifle.payInWords,
        repname: this.userProfifle.repname,
        resetPassword: this.userProfifle.resetPassword,
        startDate: this.userProfifle.startDate,
        status: this.userProfifle.status,
        t301accountAC: this.userProfifle.t301accountAC,
        t302planAC: this.userProfifle.t302planAC,
        tablename: this.userProfifle.tablename,
        trackingcount: this.userProfifle.trackingcount,
        updatedTs: this.userProfifle.updatedTs,
        updatedby: this.userProfifle.updatedby,
        user_name: this.userProfifle.user_name,
        year: this.userProfifle.year,
        crmAccountNumber: this.userProfifle.crmAccountNumber
      }
    });
    this.demoloader();
  }

  async getuserProfile(): Promise<any> {
    this.userProfifleVal = await this.commonService.getUserprofileData().then((result) => {
      this.clientProfileList = result;
      return this.clientProfileList;
    });
    return this.userProfifleVal;
  }

  UserId_clickHandler(): void {
    this.dialog.open(UserLogPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {}
    });
  }

  Usermenuid_clickHandler(): void {
    this.dialog.open(AdminMenuControlComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {}
    });
  }

  toggleCompareAnalysisPopup(param: any): void {
    this.commonService.emitContractParam(param);
  }

  loadClientProfile(param: any): void {
    this.httpUSPSService.loadUSPSClientProfile(param).subscribe(
      (result: any) => {
        this.clientList = result || [];
        this.options = [];

        for (let loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName != null) {
            this.options.push(this.clientList[loop].clientName);
          }
        }

        this.uspsFilteredOptions = this.ClientNameFilterCtrl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value || ''))
        );
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  saveOrUpdateClientProfileUsps(param: any): void {
    this.httpUSPSService.saveOrUpdateClientProfile(param).subscribe(
      (result: any) => {
        this.resultObj = result;
        this.saveOrUpdateAdminresult();
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  fetchactiveClient(): void {
    this.httpClientService.fetchactiveClient(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  fetchUserLogin(): void {
    this.httpClientService.fetchUserLogin(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  fetchactiveinactiveClient(): void {
    this.httpClientService.fetchactiveinactiveClient(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  saveOrUpdateGridClientmenuList(): void {
    this.httpClientService.saveOrUpdateGridClientmenuList(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  findClientLoginCredential(): void {
    this.httpClientService.findClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  AddUserName_ClientLoginCredential(): void {
    this.httpClientService.AddUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  UpdateUserName_ClientLoginCredential(): void {
    this.httpClientService.UpdateUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  deleteUserName_ClientLoginCredential(): void {
    this.httpClientService.deleteUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  saveOrUpdateClientProfile(param: any, actionVal: string): void {
    this.httpUSPSService.saveOrUpdateClientProfile(param).subscribe(
      (result: any) => {
        this.resultObj = result;
        if (actionVal === 'Update') {
          this.updateclientresultUsps();
        } else {
          this.saveClientResultUsps();
        }
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  openUpdatePopup(): void {
    this.dialog.open(UpdateUserPopupComponent, {
      width: '60%',
      height: '350px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      disableClose: true,
      data: {
        pageValue: this.clientDetails,
        panelClass: this.panelClass
      }
    });
  }

  clearClickHandler(): void {
    this.isClientNameReadOnly = false;
    this.showAddUser = false;
    this.showUpdateBtn = false;
    this.showRegisterBtn = true;

    this.setUpFirstFormGroup.patchValue({
      clientName: '',
      user_name: '',
      password: '',
      email: '',
      repname: '',
      statusSelected: '',
      regDhl: false,
      regUps: false,
      regFedEx: false,
      regOntrac: false,
      perfomanceReports: false,
      contractReview: false,
      contractSavingsPopup: false,
      address: '',
      phone: '',
      crmAccountNumber: ''
    });

    this.setUpSecondFormGroup.patchValue({
      repname: '',
      fileStartDate: '',
      fileEndDate: '',
      customertype: '',
      dataLoadBy: '',
      status: '',
      clientNameSelected: '',
      comments: ''
    });

    this.dialogValue = 'false';
    this.imageUrl = null;
    this.base64result = null;
    this.fileToUpload = null;
  }

  regClickHandler(): void {
    const client_name = this.setUpFirstFormGroup.get('clientName')?.value;
    const email = this.setUpFirstFormGroup.get('email')?.value;
    const username = this.setUpFirstFormGroup.get('user_name')?.value;
    const password = this.setUpFirstFormGroup.get('password')?.value;
    const status = this.setUpFirstFormGroup.get('statusSelected')?.value;
    const address = this.setUpFirstFormGroup.get('address')?.value;
    const phone = this.setUpFirstFormGroup.get('phone')?.value;
    const repname = this.setUpFirstFormGroup.get('repname')?.value;
    const regDhl = this.setUpFirstFormGroup.get('regDhl')?.value;
    const regUps = this.setUpFirstFormGroup.get('regUps')?.value;
    const regFedEx = this.setUpFirstFormGroup.get('regFedEx')?.value;
    const regOntrac = this.setUpFirstFormGroup.get('regOntrac')?.value;

    if (!client_name || !username || !password || !status) {
      this.openModal('Please Fill the Required Fields!');
      return;
    }

    this.t001custObj = {};
    this.t001custObj['clientName'] = client_name;
    this.t001custObj['dataFileSourceDir'] = client_name;
    this.t001custObj['user_name'] = username;
    this.t001custObj['password'] = password;
    this.t001custObj['status'] = status;
    this.t001custObj['email'] = email;
    this.t001custObj['address'] = address;
    this.t001custObj['contactNo'] = phone;
    this.t001custObj['repname'] = repname;
    this.t001custObj['theme_option'] = 'light';
    this.t001custObj['createdBy'] = 'SYSTEM';
    this.t001custObj['customertype'] = 'LJM_User';
    this.t001custObj['regDhl'] = regDhl;
    this.t001custObj['regUps'] = regUps;
    this.t001custObj['regFedEx'] = regFedEx;
    this.t001custObj['regOntrac'] = regOntrac;

    let carrierType = '';
    if (regUps === true) {
      carrierType = 'ups~';
    }
    if (regFedEx === true) {
      carrierType += 'fedex~';
    }
    if (regOntrac === true) {
      carrierType += 'ontrac~';
    }
    if (regDhl === true) {
      carrierType += 'dhl~';
    }
    carrierType += 'usps';
    this.t001custObj['carrierType'] = carrierType;

    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
      this.t001custObj['image'] = this.base64result;
    } else {
      this.t001custObj['image'] = null;
    }

    const auditCustId = this.setUpFirstFormGroup.get('perfomanceReports')?.value;
    this.t001custObj['auditcustomerstatus'] = auditCustId === true ? 'Y' : 'N';

    const contractReviewStatus = this.setUpFirstFormGroup.get('contractReview')?.value;
    this.t001custObj['contractreviewstatus'] = contractReviewStatus === true;
    this.t001custObj['contractreviewstatusflag'] = 'No';

    const contractSavingStatus = this.setUpFirstFormGroup.get('contractSavingsPopup')?.value;
    this.t001custObj['contractanalysisstatus'] = contractSavingStatus === true ? 'Yes' : 'No';
    this.t001custObj['contractsavingspopupflag'] = 'No';
    this.t001custObj['crmAccountNumber'] = this.setUpFirstFormGroup.get('crmAccountNumber')?.value;

    this.saveOrUpdateClientProfile(this.t001custObj, 'Register');
  }

  sendMail(): void {
    this.t001custObj = {};
    const regDhl = this.setUpFirstFormGroup.get('regDhl')?.value;
    const regUps = this.setUpFirstFormGroup.get('regUps')?.value;
    const regOntrac = this.setUpFirstFormGroup.get('regOntrac')?.value;
    const regFedEx = this.setUpFirstFormGroup.get('regFedEx')?.value;
    const auditCustId = this.setUpFirstFormGroup.get('perfomanceReports')?.value;

    let carrierType = '';
    if (regUps === true) {
      carrierType = 'ups~';
    }
    if (regFedEx === true) {
      carrierType += 'fedex~';
    }
    if (regOntrac === true) {
      carrierType += 'ontrac~';
    }
    if (regDhl === true) {
      carrierType += 'dhl~';
    }
    carrierType += 'usps';

    this.t001custObj['carrierType'] = carrierType;
    this.t001custObj['auditcustomerstatus'] = auditCustId === true ? 'Y' : 'N';

    this.saveOrUpdateClientProfileUsps(this.t001custObj);
  }

  saveOrUpdateresult(): void {
    this.openModal('Customer Created Successfully');
    this.clearClickHandler();
  }

  lookupstatuslist(event: any): void {
    let txt_Dataloaded = '';
    this.lookupresultAC = {};
    this.resultlookup = event || [];

    if (this.resultlookup.length > 0) {
      this.lookupresultAC = this.resultlookup[0];
      txt_Dataloaded = this.lookupresultAC.lookup_Value;
    }
  }

  resultclientdata(event: any): void {
    this.resultclientfetch = event || [];
    if (this.resultclientfetch.length > 0) {
      this.t001client_profileObj = this.resultclientfetch[0];
    }
  }

  fetchresultcustomer(event: any): void {
    this.resultfetchcustomer = event || [];
    if (this.resultfetchcustomer.length !== 0) {
      this.openModal('Customer Already exist');
      this.clearClickHandler();
    }
  }

  custChangeHandler(event: any): void {
    this.isClientNameReadOnly = true;
    this.showUpdateBtn = true;
    this.showRegisterBtn = false;
    this.showAddUser = true;

    this.setUpFirstFormGroup.patchValue({
      regUps: false,
      regFedEx: false,
      regOntrac: false,
      regDhl: false,
      contractReview: false,
      contractSavingsPopup: false,
      perfomanceReports: false
    });

    for (let loop = 0; loop < this.clientList.length; loop++) {
      if (this.clientList[loop].clientName === event) {
        this.t001custObj = this.clientList[loop];
        break;
      }
    }

    this.clientDetails = this.t001custObj;

    const startDate = this.datePipe.transform(this.t001custObj.fileStartDate, 'MM-dd-yyyy');

    this.setUpSecondFormGroup.patchValue({
      fileStartDate: startDate,
      repname: this.t001custObj.repname,
      fileEndDate: this.t001custObj.fileEndDate,
      customertype: this.t001custObj.customertype,
      dataLoadBy: this.t001custObj.dataLoadBy,
      status: this.t001custObj.status,
      comments: this.t001custObj.comments || ''
    });

    this.setUpFirstFormGroup.patchValue({
      clientName: this.t001custObj.clientName,
      user_name: this.t001custObj.user_name,
      password: this.t001custObj.password,
      email: this.t001custObj.email,
      repname: this.t001custObj.repname,
      address: this.t001custObj.address,
      phone: this.t001custObj.contactNo,
      contractReview: this.t001custObj.contractreviewstatus,
      statusSelected: this.t001custObj.status,
      crmAccountNumber: this.t001custObj.crmAccountNumber
    });

    const carrierType = this.t001custObj.carrierType;
    const auditcustomerstatus = this.t001custObj.auditcustomerstatus;
    const contractanalysisstatus = this.t001custObj.contractanalysisstatus;

    if (carrierType != null) {
      if (carrierType.toUpperCase().includes('DHL')) {
        this.setUpFirstFormGroup.get('regDhl')?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('ONTRAC')) {
        this.setUpFirstFormGroup.get('regOntrac')?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('UPS')) {
        this.setUpFirstFormGroup.get('regUps')?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('FEDEX')) {
        this.setUpFirstFormGroup.get('regFedEx')?.setValue(true);
      }
    } else {
      this.setUpFirstFormGroup.patchValue({
        regDhl: false,
        regUps: false,
        regFedEx: false,
        regOntrac: false
      });
    }

    if (auditcustomerstatus != null) {
      this.setUpFirstFormGroup.get('perfomanceReports')?.setValue(auditcustomerstatus.toUpperCase() === 'Y');
    } else {
      this.setUpFirstFormGroup.get('perfomanceReports')?.setValue(false);
    }

    if (contractanalysisstatus != null) {
      this.setUpFirstFormGroup
        .get('contractSavingsPopup')
        ?.setValue(contractanalysisstatus.toUpperCase() === 'YES');
    } else {
      this.setUpFirstFormGroup.get('contractSavingsPopup')?.setValue(false);
    }

    if (
      this.t001custObj.status?.toUpperCase() === 'INACTIVE' ||
      this.t001custObj.status?.toUpperCase() === 'ACTIVE'
    ) {
      this.openModal('Customer Already Exist! You can Update the Customer now');
      this.showRegisterBtn = false;
      this.showUpdateBtn = true;
      this.showAddUser = true;
    } else {
      this.showRegisterBtn = true;
      this.showUpdateBtn = false;
      this.showAddUser = false;
    }

    this.t000lookupobj['lookup_Code'] = this.clientDetails?.['dataLoadBy'];
  }

  updateClickHandler(): void {
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

    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
      this.t001custObj['image'] = this.base64result;
    } else {
      this.t001custObj['image'] = null;
    }

    const regDhl = this.setUpFirstFormGroup.get('regDhl')?.value;
    const regUps = this.setUpFirstFormGroup.get('regUps')?.value;
    const regFedEx = this.setUpFirstFormGroup.get('regFedEx')?.value;
    const regOntrac = this.setUpFirstFormGroup.get('regOntrac')?.value;

    const auditCustId = this.setUpFirstFormGroup.get('perfomanceReports')?.value;
    const contractReviewStatus = this.setUpFirstFormGroup.get('contractReview')?.value;
    const contractAnalysisStatus = this.setUpFirstFormGroup.get('contractSavingsPopup')?.value;

    this.t001custObj['currentstatus'] = clientStatus;
    this.t001custObj['repname'] = txt_reps;
    this.t001custObj['email'] = txt_email;
    this.t001custObj['password'] = txt_password;
    this.t001custObj['user_name'] = user_name;
    this.t001custObj['clientdbstatus'] = txt_status;
    this.t001custObj['contactNo'] = phone;
    this.t001custObj['updatedby'] = 'Admin';
    this.t001custObj['address'] = address;

    this.sendLoginEmail();

    let carrierType = '';
    if (regUps === true) {
      carrierType = 'ups~';
    }
    if (regFedEx === true) {
      carrierType += 'fedex~';
    }
    if (regOntrac === true) {
      carrierType += 'ontrac~';
    }
    if (regDhl === true) {
      carrierType += 'dhl~';
    }
    carrierType += 'usps';
    this.t001custObj['carrierType'] = carrierType;

    this.t001custObj['auditcustomerstatus'] = auditCustId === true ? 'Y' : 'N';
    this.t001custObj['contractreviewstatus'] = contractReviewStatus === true;
    this.t001custObj['contractreviewstatusflag'] = 'No';
    this.t001custObj['contractanalysisstatus'] = contractAnalysisStatus === true ? 'Yes' : 'No';
    this.t001custObj['contractsavingspopupflag'] = 'No';
    this.t001custObj['loginEmailId'] = this.cookiesService.getCookieItem('loginEmailId');
    this.t001custObj['crmAccountNumber'] = this.setUpFirstFormGroup.get('crmAccountNumber')?.value;

    this.saveOrUpdateClientProfileUsps(this.t001custObj);

    this.t000Obj['clientid'] = this.t001custObj.clientId;
    this.t000Obj['status'] = clientStatus;
    this.t001custObj['status'] = clientStatus;
  }

  updateContractReviewStatus(): void {
    const contractReviewObj: any = {};
    contractReviewObj['clientId'] = this.t001custObj.clientId;

    const contractReviewStatus = this.setUpFirstFormGroup.get('contractReview')?.value;
    if (contractReviewStatus === true) {
      contractReviewObj['contractreviewstatus'] = true;
      this.t001custObj['contractreviewstatus'] = true;
    } else {
      contractReviewObj['contractreviewstatus'] = false;
      this.t001custObj['contractreviewstatus'] = false;
    }

    contractReviewObj['contractreviewstatusflag'] = 'Yes';

    this.httpUSPSService.saveOrUpdateClientProfile(contractReviewObj).subscribe(
      () => {
        this.openModal('Customer Updated Successfully');
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  saveOrUpdateAdminresult(): void {
    this.openModal('Customer Updated Successfully');
    this.clearClickHandler();
  }

  sendLoginEmail(): void { }

  saveClientResultUsps(): void {
    this.openModal('A new Customer has been added successfully!');
    this.clearClickHandler();
  }

  clientAC: any[] = [];

  updateclientresultUsps(): void {
    this.openModal('Customer updated successfully');
    this.clearClickHandler();
  }

  fileProgress(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    if (!file) {
      return;
    }

    this.fileToUpload = file;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.imageUrl = e.target?.result as string;
      if (this.imageUrl) {
        this.base64result = this.imageUrl.split(',')[1];
      }
    };
    reader.readAsDataURL(file);
  }

  openModal(alertVal: any): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  updateContractSavingsPopup(): void {
    const contractSavingsPopupObj: any = {};
    contractSavingsPopupObj['clientId'] = this.t001custObj.clientId;

    const contractSavingsStatus = this.setUpFirstFormGroup.get('contractSavingsPopup')?.value;
    if (contractSavingsStatus === true) {
      contractSavingsPopupObj['contractanalysisstatus'] = 'Yes';
      this.t001custObj['contractanalysisstatus'] = 'Yes';
    } else {
      contractSavingsPopupObj['contractanalysisstatus'] = 'No';
      this.t001custObj['contractanalysisstatus'] = 'No';
    }

    contractSavingsPopupObj['contractsavingspopupflag'] = 'Yes';

    this.httpUSPSService.saveOrUpdateClientProfile(contractSavingsPopupObj).subscribe(
      () => {
        this.openModal('Customer Updated Successfully');
      },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  async openAuthModal(): Promise<void> {
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => res);
    this.panelClass = this.themeoption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';
    this.loaderService.show();
    const dialogConfig = this.dialog.open(AuthPopupComponent, {
      width: '470px',
      height: 'auto',
      disableClose: true,
      panelClass: this.panelClass
    });

    dialogConfig.afterClosed().subscribe((result) => {
      this.dialogValue = result?.event;
      this.demoloader();
      return;
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