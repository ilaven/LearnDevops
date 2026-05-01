import { AfterViewInit, ElementRef, Component, OnInit, ViewChild, signal, OnDestroy } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { UserLogPopupComponent } from '../../commonpages/user-log-popup/user-log-popup.component';
import { MatSelect } from '@angular/material/select';
import { AuthPopupComponent } from '../../UPS/popup/auth-popup/auth-popup.component';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
import { HttpDhlService } from 'src/app/core/services/httpdhl.service';
import { AdminMenuControlComponent } from '../../commonpages/admin-menu-control/admin-menu-control.component';
import { UpdateUserPopupComponent } from '../../UPS/update-user-popup/update-user-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-ontrac-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
  standalone: false,
})
export class ontracSetupComponent implements OnInit , AfterViewInit,OnDestroy {
  clientType = signal<any>('');
  t000lookupobj: any = {};
  t000Obj: any = {};

  public dhlClientNameFilterCtrl: FormControl = new FormControl('');
  public ontracClientNameFilterCtrl: FormControl = new FormControl('');

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
  ontracfilteredOptions!: Observable<string[]>;
  dhlfilteredOptions!: Observable<string[]>;

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
  isClientNameReadOnlyDhl = false;
  t002ClientObj: any = {};

  statusAC = [
    { label: 'ACTIVE', data: 'ACTIVE' },
    { label: 'INACTIVE', data: 'INACTIVE' }
  ];

  setUpFirstFormGroup = new UntypedFormGroup({
    contractReview: new FormControl(false),
    contractSavingsPopup: new FormControl(false),
    payStatus:new FormControl(false),
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
    regDhl: new FormControl(''),
    regUps: new FormControl(''),
    regFedEx: new FormControl(''),
    regUsps: new FormControl(''),
    perfomanceReports: new FormControl(''),
    address: new FormControl(''),
    statusSelected: new FormControl(''),
    phone: new FormControl(''),
    imageFile: new FormControl(''),
    crmAccountNumber:new FormControl(''),
    t001ClientProfile: new UntypedFormGroup({
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
    })
  })
  setUpSecondFormGroup = new UntypedFormGroup({
    customertype: new FormControl(''),
    repname: new FormControl(''),
    clientNameSelected: new FormControl(''),
    fileStartDate: new FormControl(''),
    fileEndDate: new FormControl(''),
    dataLoadBy: new FormControl(''),
    status: new FormControl(''),
    comments:new FormControl('')
  })

  setUpFirstDhlFormGroup = new UntypedFormGroup({
    contractReview: new FormControl(false),
    contractSavingsPopup: new FormControl(false),
    payStatus:new FormControl(false),
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
    regOntrac: new FormControl(''),
    regUps: new FormControl(''),
    regFedEx: new FormControl(''),
    regUsps: new FormControl(''),
    perfomanceReports: new FormControl(''),
    address: new FormControl(''),
    statusSelected: new FormControl(''),
    phone: new FormControl(''),
    imageFile: new FormControl(''),
    crmAccountNumber:new FormControl(''),
    t001ClientProfile: new UntypedFormGroup({
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
    })
  })
  setUpSecondDhlFormGroup = new UntypedFormGroup({
    customertype: new FormControl(''),
    repname: new FormControl(''),
    clientNameSelected: new FormControl(''),
    fileStartDate: new FormControl(''),
    fileEndDate: new FormControl(''),
    dataLoadBy: new FormControl(''),
    status: new FormControl(''),
    comments:new FormControl('')
  })

  constructor(
    private loaderService: LoaderService,
    private httpClientService: HttpClientService,
    private cookiesService: CookiesService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private httpOntracService: HttpOntracService,
    private httpDhlService: HttpDhlService,
  ) {
    this.cookiesService.checkForClientName();
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
  }

  async ngOnInit() {
    this.loaderService.show();
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    if (this.clientType().toUpperCase() == "DHL") {
      this.fetchClientName();
      this.getUserDhl();
    }
    else if (this.clientType().toUpperCase() == "ONTRAC") {
      var t001custObj = {};
      this.loadClientProfile(t001custObj);
      this.getUserOnTrac();
    }
    
    this.demoloader();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  async getUserOnTrac() {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    await this.setUpFirstFormGroup.patchValue({
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
        "year": this.userProfifle.year,
        "crmAccountNumber": this.userProfifle.crmAccountNumber
      }
    });

    this.demoloader();
  }

  async getUserDhl() {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;

    await this.setUpFirstFormGroup.patchValue({
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
        "year": this.userProfifle.year,
        "crmAccountNumber": this.userProfifle.crmAccountNumber
      }
    });
    this.demoloader();
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }

  UserId_clickHandler() {
    const dialogRef = this.dialog.open(UserLogPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Usermenuid_clickHandler() {
    const dialogRef = this.dialog.open(AdminMenuControlComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  toggleCompareAnalysisPopup(param:any) {
    this.commonService.emitContractParam(param);
  }

  /** Below method will be called in dashbaord to laod the dropdwon value for teh admin users **/
  loadClientProfile(param:any) {
    this.httpOntracService.loadOnTracClientProfile(param).subscribe(
      result => {
        this.clientList = result;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName != null) {
            this.options.push(this.clientList[loop].clientName);
          }
        }
        this.ontracfilteredOptions = this.ontracClientNameFilterCtrl.valueChanges
          .pipe(
            startWith(''),
            map((value: string | null) => this._filterontracClients(value || ''))
          );
      },
      error => {
        console.log('error ', error);
      })
  }
  private _filterontracClients(value: string): string[] {
      const filterValue = (value || '').toLowerCase();
      return this.clientListFedex
        .filter((item: any) => item.clientName)
        .map((item: any) => item.clientName)
        .filter((name: string) => name.toLowerCase().includes(filterValue));
    }

  saveOrUpdateClientProfileOntrac(param:any) {
    this.httpOntracService.saveOrUpdateClientProfile(param).subscribe(
      result => {
        var resultObj = result;
        this.saveOrUpdateAdminresult();
      },
      error => {
        console.log(' error ', error);
      })  }

  fetchactiveClient() {
    this.httpClientService.fetchactiveClient(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  fetchUserLogin() {
    this.httpClientService.fetchUserLogin(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  fetchactiveinactiveClient() {
    this.httpClientService.fetchactiveinactiveClient(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  saveOrUpdateGridClientmenuList() {
    this.httpClientService.saveOrUpdateGridClientmenuList(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  findClientLoginCredential() {
    this.httpClientService.findClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  AddUserName_ClientLoginCredential() {
    this.httpClientService.AddUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  UpdateUserName_ClientLoginCredential() {
    this.httpClientService.UpdateUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  deleteUserName_ClientLoginCredential() {
    this.httpClientService.deleteUserName_ClientLoginCredential(this.setUpFirstFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
      },
      error => {
        console.log(' error ', error);
      })
  }
  saveOrUpdateClientProfile(param: any, actionVal: string) { //modified by 9126 
    this.httpOntracService.saveOrUpdateClientProfile(param).subscribe(
      result => {
        this.resultObj = result;
        if (actionVal == "Update") {
          this.updateclientresultOntrac();
        } else {
          this.saveClientResultOntrac();
        }
      },
      error => {
        console.log(' error ', error);
      })
  }

  saveOrUpdateClientProfileDhl(param: any, actionVal: string) { //modified by 9126 
    this.httpDhlService.saveOrUpdateClientProfile(param).subscribe(
      result => {
        this.resultObj = result;
        if (actionVal == "Update") {
          this.updateclientresult();
        } else {
          this.saveClientResult();
        }
      },
      error => {
        console.log(' error ', error);
      })
  }
  clientListDhl:any;
  fetchClientName() {
    var t002ClientObj = {};
    this.httpDhlService.loadDhlClientProfile(t002ClientObj).subscribe(
      result => {
        this.clientList = result;
        for (var loop = 0; loop < this.clientList.length; loop++) {
          if (this.clientList[loop].clientName != null) {
            this.options.push(this.clientList[loop].clientName);
          }
        }
        this.clientListDhl = this.clientList;
        this.dhlfilteredOptions = this.dhlClientNameFilterCtrl.valueChanges
          .pipe(
            startWith(''),
            map((value: string | null) => this._filter(value || ''))
          );
        this.demoloader();
      },
      error => {
        console.log('error', error);
      })
  }

  openUpdatePopup() {
    const dialogRef = this.dialog.open(UpdateUserPopupComponent, {
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

  clearClickHandler() {
    this.isClientNameReadOnly = false; //modified by 9126
    this.showAddUser = false;
    this.showUpdateBtn = false;
    this.showRegisterBtn = true;
    this.setUpFirstFormGroup.get("clientName")?.setValue("");
    this.setUpFirstFormGroup.get("user_name")?.setValue("");
    this.setUpFirstFormGroup.get("password")?.setValue("");
    this.setUpFirstFormGroup.get("email")?.setValue("");
    this.setUpFirstFormGroup.get("repname")?.setValue("");
    this.setUpSecondFormGroup.get("repname")?.setValue("");
    this.setUpSecondFormGroup.get("fileStartDate")?.setValue("");
    this.setUpSecondFormGroup.get("fileEndDate")?.setValue("");
    this.setUpSecondFormGroup.get("customertype")?.setValue("");
    this.setUpSecondFormGroup.get("dataLoadBy")?.setValue("");
    this.setUpSecondFormGroup.get("status")?.setValue("");
    this.setUpFirstFormGroup.get("statusSelected")?.setValue("");
    this.setUpSecondFormGroup.get("clientNameSelected")?.setValue("");
    this.setUpFirstFormGroup.get("regDhl")?.setValue(false);
    this.setUpFirstFormGroup.get("regUps")?.setValue(false);
    this.setUpFirstFormGroup.get("regFedEx")?.setValue(false);
    this.setUpFirstFormGroup.get("regUsps")?.setValue(false);
    this.setUpFirstFormGroup.get("perfomanceReports")?.setValue(false);
    this.setUpFirstFormGroup.get("contractReview")?.setValue(false);
    this.setUpFirstFormGroup.get("contractSavingsPopup")?.setValue(false);
    this.setUpFirstFormGroup.get("payStatus")?.setValue(false);
    this.setUpFirstFormGroup.get("address")?.setValue("");
    this.setUpFirstFormGroup.get("phone")?.setValue("");
    this.setUpFirstFormGroup.get("crmAccountNumber")?.setValue("");
    this.dialogValue='false';
  }

  regClickHandler() {
    var client_name = this.setUpFirstFormGroup.get("clientName")?.value;
    var email = this.setUpFirstFormGroup.get("email")?.value;
    var username = this.setUpFirstFormGroup.get("user_name")?.value;
    var password = this.setUpFirstFormGroup.get("password")?.value;
    var status = this.setUpFirstFormGroup.get("statusSelected")?.value;
    var address = this.setUpFirstFormGroup.get("address")?.value;
    var phone = this.setUpFirstFormGroup.get("phone")?.value;
    var repname = this.setUpFirstFormGroup.get("repname")?.value;
    var regDhl = this.setUpFirstFormGroup.get("regDhl")?.value;
    var regUps = this.setUpFirstFormGroup.get("regUps")?.value;
    var regFedEx = this.setUpFirstFormGroup.get("regFedEx")?.value;
    var regUsps = this.setUpFirstFormGroup.get("regUsps")?.value;

    if (client_name == "" || username == "" || password == "" || status == "") {
      this.openModal("Please Fill the Required Fields!");
      return;
    }

    this.t001custObj = {};
    this.t001custObj["clientName"] = client_name;
    this.t001custObj["dataFileSourceDir"] = client_name;
    this.t001custObj["user_name"] = username;
    this.t001custObj["password"] = password;
    this.t001custObj["status"] = status;
    this.t001custObj["email"] = email;
    this.t001custObj["address"] = address;
    this.t001custObj["contactNo"] = phone;
    this.t001custObj["repname"] = repname;
    this.t001custObj["theme_option"] = "light"
    this.t001custObj["createdBy"] = "SYSTEM";
    this.t001custObj["customertype"] = "LJM_User";
    this.t001custObj["regDhl"] = regDhl;
    this.t001custObj["regUps"] = regUps;
    this.t001custObj["regFedEx"] = regFedEx;
    this.t001custObj["regUsps"] = regUsps;

    var carrierTypeOnTrac = "ontrac";
    var carrierType = "";
    if (regUps == true) {
      carrierType = "ups~";
    }
    if (regFedEx == true) {
      carrierType = carrierType + "fedex~";
    }
    carrierType = carrierType + "" + carrierTypeOnTrac;
    if (regDhl == true) {
      carrierType = carrierType + "~dhl";
    }
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }
    this.t001custObj["carrierType"] = carrierType;

    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
      this.t001custObj["image"] = this.base64result;
    }
    else {
      this.t001custObj["image"] = null;
    }
    var auditCustId = this.setUpFirstFormGroup.get("perfomanceReports")?.value;
    if (auditCustId == true) {
      this.t001custObj["auditcustomerstatus"] = "Y";
    }
    else {
      this.t001custObj["auditcustomerstatus"] = "N";
    }
    var contractReviewStatus = this.setUpFirstFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      this.t001custObj["contractreviewstatus"] = true;
    }
    else {
      this.t001custObj["contractreviewstatus"] = false;
    }
    this.t001custObj["contractreviewstatusflag"] = "No";
    var payWebPortalStatus= this.setUpFirstFormGroup.get("payStatus")?.value;
    if(payWebPortalStatus==true){
      this.t001custObj["payStatus"]=true;
    }
    else{
      this.t001custObj["payStatus"]=false;
    }
    this.t001custObj["payFlag"]="No";
    var contractSavingStatus = this.setUpFirstFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingStatus == true) {
      this.t001custObj["contractanalysisstatus"] = "Yes";
    }
    else {
      this.t001custObj["contractanalysisstatus"] = "No";
    }
    this.t001custObj["contractsavingspopupflag"] = "No";
    this.t001custObj["crmAccountNumber"] = this.setUpFirstFormGroup.get("crmAccountNumber")?.value;
    this.saveOrUpdateClientProfile(this.t001custObj, "Register");
  }

  sendMail() {

    this.t001custObj = {};
    var regDhl = this.setUpFirstFormGroup.get("regDhl")?.value;
    var regUps = this.setUpFirstFormGroup.get("regUps")?.value;
    var regFedEx = this.setUpFirstFormGroup.get("regFedEx")?.value;
    var regUsps = this.setUpFirstFormGroup.get("regUsps")?.value;

    var auditCustId = this.setUpFirstFormGroup.get("perfomanceReports")?.value;

    var carrierTypeOnTrac = "ontrac";
    var carrierType = "";
    if (regUps == true) {
      carrierType = "ups~";
    }
    if (regFedEx == true) {
      carrierType = carrierType + "fedex~";
    }
    carrierType = carrierType + "" + carrierTypeOnTrac;
    if (regDhl == true) {
      carrierType = carrierType + "~dhl";
    }
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }

    if (auditCustId.selected == true) {
      this.t001custObj["auditcustomerstatus"] = "Y";
    }
    else {
      this.t001custObj["auditcustomerstatus"] = "N";
    }
    this.saveOrUpdateClientProfileOntrac(this.t001custObj);
  }

  saveOrUpdateresult() {
    this.openModal("Customer Created Successfully");
    this.clearClickHandler();
  }

  lookupstatuslist(event:any) {
    var txt_Dataloaded; // form control
    this.lookupresultAC = {};
    this.resultlookup = event;;
    if (this.resultlookup.length == 0) {
      txt_Dataloaded = "";
    }
    if (this.resultlookup.length > 0) {
      this.lookupresultAC = this.resultlookup[0];
      txt_Dataloaded = this.lookupresultAC.lookup_Value;
    }
  }

  resultclientdata(event:any) {
    this.resultclientfetch = event;
    if (this.resultclientfetch.length > 0) {
      this.t001client_profileObj = this.resultclientfetch[0];
    }
  }

  fetchresultcustomer(event:any) {
    this.resultfetchcustomer = event;
    if (this.resultfetchcustomer.length != 0) {
      this.openModal("Customer Already exist");
      this.clearClickHandler();
    }
  }

  custChangeHandler(event:any) {
    this.isClientNameReadOnly = true;
    this.showUpdateBtn = true;
    this.showRegisterBtn = false;
    this.showAddUser = true;
    this.setUpFirstFormGroup.get("regUps")?.setValue(false);
    this.setUpFirstFormGroup.get("regFedEx")?.setValue(false);
    this.setUpFirstFormGroup.get("regDhl")?.setValue(false);
    this.setUpFirstFormGroup.get("regUsps")?.setValue(false);
    this.setUpFirstFormGroup.get("contractReview")?.setValue(false);
    this.setUpFirstFormGroup.get("contractSavingsPopup")?.setValue(false);
    this.setUpFirstFormGroup.get("payStatus")?.setValue(false);
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
      if (carrierType.toUpperCase().includes('DHL')) {
        this.setUpFirstFormGroup.get("regDhl")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('UPS')) {
        this.setUpFirstFormGroup.get("regUps")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('FEDEX')) {
        this.setUpFirstFormGroup.get("regFedEx")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('USPS')) {
        this.setUpFirstFormGroup.get("regUsps")?.setValue(true);
      }
    } else {
      this.setUpFirstFormGroup.get("regDhl")?.setValue(false);
      this.setUpFirstFormGroup.get("regUps")?.setValue(false);
      this.setUpFirstFormGroup.get("regFedEx")?.setValue(false);
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
  }

  updateClickHandler() {

    var txt_email = this.setUpFirstFormGroup.get("email")?.value;
    var txt_password = this.setUpFirstFormGroup.get("password")?.value;
    var user_name = this.setUpFirstFormGroup.get("user_name")?.value;
    var clientStatus = this.setUpFirstFormGroup.get("statusSelected")?.value;
    var txt_reps = this.setUpFirstFormGroup.get("repname")?.value;
    var txt_status = this.setUpSecondFormGroup.get("status")?.value;
    var address = this.setUpFirstFormGroup.get("address")?.value;
    var phone = this.setUpFirstFormGroup.get("phone")?.value;

    if (txt_password == "" || user_name == "" || clientStatus == "") {
      this.openModal("Enter All Required Field");
      return;
    }
    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];

      this.t001custObj["image"] = this.base64result;
    }
    else {
      this.t001custObj["image"] = null;
    }
    var regDhl = this.setUpFirstFormGroup.get("regDhl")?.value;
    var regUps = this.setUpFirstFormGroup.get("regUps")?.value;
    var regFedEx = this.setUpFirstFormGroup.get("regFedEx")?.value;
    var regUsps = this.setUpFirstFormGroup.get("regUsps")?.value;
    var auditCustId = this.setUpFirstFormGroup.get("perfomanceReports")?.value;
    var contractReviewStatus = this.setUpFirstFormGroup.get("contractReview")?.value;
    var contractAnalysisStatus = this.setUpFirstFormGroup.get("contractSavingsPopup")?.value;
    var payWebPortalStatus=this.setUpFirstFormGroup.get("payStatus")?.value;
    this.t001custObj["currentstatus"] = clientStatus;

    this.t001custObj["repname"] = txt_reps;
    this.t001custObj["email"] = txt_email;
    this.t001custObj["password"] = txt_password;
    this.t001custObj["user_name"] = user_name;
    this.t001custObj["clientdbstatus"] = txt_status;
    this.t001custObj["contactNo"] = phone;
    this.t001custObj["updatedby"] = "Admin";
    this.t001custObj["address"] = address;
    this.sendLoginEmail();
    var carrierTypeOnTrac = "ontrac";
    var carrierType = "";
    if (regUps == true) {
      carrierType = "ups~";
    }
    if (regFedEx == true) {
      carrierType = carrierType + "fedex~";
    }
    carrierType = carrierType + "" + carrierTypeOnTrac;
    if (regDhl == true) {
      carrierType = carrierType + "~dhl";
    }
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }
    this.t001custObj["carrierType"] = carrierType;
    if (auditCustId == true) {
      this.t001custObj["auditcustomerstatus"] = "Y";
    }
    else {
      this.t001custObj["auditcustomerstatus"] = "N";
    }
    if (contractReviewStatus == true) {
      this.t001custObj["contractreviewstatus"] = true;
    }
    else {
      this.t001custObj["contractreviewstatus"] = false;
    }
    this.t001custObj["contractreviewstatusflag"] = "No";

    if (contractAnalysisStatus == true) {
      this.t001custObj["contractanalysisstatus"] = "Yes";
    }
    else {
      this.t001custObj["contractanalysisstatus"] = "No";
    }
    this.t001custObj["contractsavingspopupflag"] = "No";
    if(payWebPortalStatus==true){
      this.t001custObj["payStatus"]=true;
    }
    else{
      this.t001custObj["payStatus"]=false;
    }
    this.t001custObj["payFlag"]="No";
    this.t001custObj["loginEmailId"] = this.cookiesService.getCookieItem('loginEmailId');
    this.t001custObj["crmAccountNumber"] = this.setUpFirstFormGroup.get("crmAccountNumber")?.value;
    this.saveOrUpdateClientProfileOntrac(this.t001custObj);

    this.t000Obj["clientid"] = this.t001custObj.clientId;
    this.t000Obj["status"] = clientStatus;
    this.t001custObj["status"] = clientStatus;
    // this.saveOrUpdateClientBilling(this.t000Obj);
  }
  updateContractReviewStatus() {
    var contractReviewObj:any = {};
    contractReviewObj["clientId"] = this.t001custObj.clientId;
    var contractReviewStatus = this.setUpFirstFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      contractReviewObj["contractreviewstatus"] = true;
      this.t001custObj["contractreviewstatus"] = true;
    }
    else {
      contractReviewObj["contractreviewstatus"] = false;
      this.t001custObj["contractreviewstatus"] = false;
    }
    contractReviewObj["contractreviewstatusflag"] = "Yes";
    this.httpOntracService.saveOrUpdateClientProfile(contractReviewObj).subscribe(
      result => {
        this.openModal("Customer Updated Successfully");
      },
      error => {
        console.log(' error ', error);
      })
  }
  updateContractReviewStatusDhl() {
    var contractReviewObj :any= {};
    contractReviewObj["clientId"] = this.t001custObj.clientId;
    var contractReviewStatus = this.setUpFirstDhlFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      contractReviewObj["contractreviewstatus"] = true;
      this.t001custObj["contractreviewstatus"] = true;
    }
    else {
      contractReviewObj["contractreviewstatus"] = false;
      this.t001custObj["contractreviewstatus"] = false;
    }
    contractReviewObj["contractreviewstatusflag"] = "Yes";
    this.httpDhlService.saveOrUpdateClientProfile(contractReviewObj).subscribe(
      result => {
        this.openModal("Customer Updated Successfully");
      },
      error => {
        console.log(' error ', error);
      })
  }
  saveOrUpdateAdminresult() {
    this.openModal("Customer Updated Successfully");
    this.clearClickHandler();
  }

  sendLoginEmail() {

  }

  clearClickHandlerDhl() {
    this.isClientNameReadOnlyDhl = false;
    this.showUpdateBtn = false;
    this.showRegisterBtn = true;
    this.setUpFirstDhlFormGroup.get("clientName")?.setValue("");
    this.setUpFirstDhlFormGroup.get("user_name")?.setValue("");
    this.setUpFirstDhlFormGroup.get("password")?.setValue("");
    this.setUpFirstDhlFormGroup.get("email")?.setValue("");
    this.setUpFirstDhlFormGroup.get("repname")?.setValue("");
    this.setUpSecondDhlFormGroup.get("repname")?.setValue("");
    this.setUpSecondDhlFormGroup.get("fileStartDate")?.setValue("");
    this.setUpSecondDhlFormGroup.get("fileEndDate")?.setValue("");
    this.setUpSecondDhlFormGroup.get("customertype")?.setValue("");
    this.setUpSecondDhlFormGroup.get("dataLoadBy")?.setValue("");
    this.setUpSecondDhlFormGroup.get("status")?.setValue("");
    this.setUpFirstDhlFormGroup.get("statusSelected")?.setValue("");
    this.setUpSecondDhlFormGroup.get("clientNameSelected")?.setValue("");
    this.setUpFirstDhlFormGroup.get("regFedEx")?.setValue(false);    
    this.setUpFirstDhlFormGroup.get("regUps")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("regOntrac")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("regUsps")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("perfomanceReports")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("contractReview")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("payStatus")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("address")?.setValue("");
    this.setUpFirstDhlFormGroup.get("phone")?.setValue("");
    this.setUpFirstDhlFormGroup.get("crmAccountNumber")?.setValue("");
    this.dialogValue='false'
  }

  save_clickHandlerDhl() {
    var client_name = this.setUpFirstDhlFormGroup.get("clientName")?.value;
    var email = this.setUpFirstDhlFormGroup.get("email")?.value;
    var username = this.setUpFirstDhlFormGroup.get("user_name")?.value;
    var password = this.setUpFirstDhlFormGroup.get("password")?.value;
    var status = this.setUpFirstDhlFormGroup.get("statusSelected")?.value;
    var address = this.setUpFirstDhlFormGroup.get("address")?.value;
    var phone = this.setUpFirstDhlFormGroup.get("phone")?.value;
    var repname = this.setUpFirstDhlFormGroup.get("repname")?.value;
    var regOntrac = this.setUpFirstDhlFormGroup.get("regOntrac")?.value;
    var regUps = this.setUpFirstDhlFormGroup.get("regUps")?.value;
    var regFedEx = this.setUpFirstDhlFormGroup.get("regFedEx")?.value;
    var regUsps = this.setUpFirstDhlFormGroup.get("regUsps")?.value;
    if (client_name == "" || username == "" || password == "" || status == "") {
      this.openModal("Please Fill the Required Fields!");
      return;
    }

    this.t001custObj = {};
    this.t001custObj["clientName"] = client_name;
    this.t001custObj["dataFileSourceDir"] = client_name;
    this.t001custObj["user_name"] = username;
    this.t001custObj["password"] = password;
    this.t001custObj["status"] = status;
    this.t001custObj["email"] = email;
    this.t001custObj["address"] = address;
    this.t001custObj["contactNo"] = phone;
    this.t001custObj["repname"] = repname;
    this.t001custObj["theme_option"] = "light"
    this.t001custObj["createdBy"] = "SYSTEM";
    this.t001custObj["customertype"] = "LJM_User";
    this.t001custObj["regOntrac"] = regOntrac;
    this.t001custObj["regUps"] = regUps;
    this.t001custObj["regFedEx"] = regFedEx;
    this.t001custObj["regUsps"] = regUsps;

    var carrierTypeDHL = "dhl";
    var carrierType = "";
    if (regUps == true) {
      carrierType = "ups~";
    }
    if (regFedEx == true) {
      carrierType = carrierType + "fedex~";
    }
    if (regOntrac == true) {
      carrierType = carrierType + "ontrac~";
    }
    carrierType = carrierType + "" + carrierTypeDHL;
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }
    this.t001custObj["carrierType"] = carrierType;

    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
      this.t001custObj["image"] = this.base64result;
    }
    else {
      this.t001custObj["image"] = null;
    }
    var auditCustId = this.setUpFirstDhlFormGroup.get("perfomanceReports")?.value;
    if (auditCustId == true) {
      this.t001custObj["auditcustomerstatus"] = "Y";
    }
    else {
      this.t001custObj["auditcustomerstatus"] = "N";
    }
    var contractReviewStatus = this.setUpFirstDhlFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      this.t001custObj["contractreviewstatus"] = true;
    }
    else {
      this.t001custObj["contractreviewstatus"] = false;
    }
    this.t001custObj["contractreviewstatusflag"] = "No";

    var contractSavingStatus = this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingStatus == true) {
      this.t001custObj["contractanalysisstatus"] = "Yes";
    }
    else {
      this.t001custObj["contractanalysisstatus"] = "No";
    }
    this.t001custObj["contractsavingspopupflag"] = "No";
    var payWebPortalStatus=this.setUpFirstDhlFormGroup.get("payStatus")?.value;
    if(payWebPortalStatus==true){
      this.t001custObj["payStatus"]=true;
    }
    else{
      this.t001custObj["payStatus"]=false;
    }
    this.t001custObj["payFlag"]="No";
    this.t001custObj["crmAccountNumber"] = this.setUpFirstDhlFormGroup.get("crmAccountNumber")?.value;
    this.saveOrUpdateClientProfileDhl(this.t001custObj, "Register");
  }

  saveClientResult() {
    this.openModal("A new Customer has been added successfully!");
    this.clearClickHandlerDhl();
  }
  saveClientResultOntrac() {
    this.openModal("A new Customer has been added successfully!");
    this.clearClickHandler();
  }

  clientAC = [];
  uptuser_changeHandler(event:any) {
    this.isClientNameReadOnlyDhl = true;
    this.setUpFirstDhlFormGroup.get("regUps")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("regFedEx")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("regOntrac")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("regUsps")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("contractReview")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.setValue(false);
    this.setUpFirstDhlFormGroup.get("payStatus")?.setValue(false);
    this.showUpdateBtn = true;
    this.showRegisterBtn = false;
    this.showAddUser = true;
    for (var loop = 0; loop < this.clientListDhl.length; loop++) {
      if (this.clientListDhl[loop].clientName == event) {
        this.t001custObj = this.clientListDhl[loop];
      }
    }

    this.clientDetails = this.t001custObj;
    var startDate = this.datePipe.transform(this.t001custObj.fileStartDate, "MM-dd-yyyy");
    this.setUpSecondDhlFormGroup.get("fileStartDate")?.setValue(startDate);
    this.setUpFirstDhlFormGroup.get("clientName")?.setValue(this.t001custObj.clientName);
    this.setUpFirstDhlFormGroup.get("user_name")?.setValue(this.t001custObj.user_name);
    this.setUpFirstDhlFormGroup.get("password")?.setValue(this.t001custObj.password);
    this.setUpFirstDhlFormGroup.get("email")?.setValue(this.t001custObj.email);
    this.setUpFirstDhlFormGroup.get("repname")?.setValue(this.t001custObj.repname);
    this.setUpFirstDhlFormGroup.get("address")?.setValue(this.t001custObj.address);
    this.setUpFirstDhlFormGroup.get("phone")?.setValue(this.t001custObj.contactNo);
    this.setUpFirstDhlFormGroup.get("contractReview")?.setValue(this.t001custObj.contractreviewstatus);
    this.setUpFirstDhlFormGroup.get("payStatus")?.setValue(this.t001custObj.payStatus);
    this.setUpSecondDhlFormGroup.get("repname")?.setValue(this.t001custObj.repname);
    this.setUpSecondDhlFormGroup.get("fileEndDate")?.setValue(this.t001custObj.fileEndDate);
    this.setUpSecondDhlFormGroup.get("customertype")?.setValue(this.t001custObj.customertype);
    this.setUpSecondDhlFormGroup.get("dataLoadBy")?.setValue(this.t001custObj.dataLoadBy);
    this.setUpSecondDhlFormGroup.get("status")?.setValue(this.t001custObj.status);
    this.setUpFirstDhlFormGroup.get("statusSelected")?.setValue(this.t001custObj.status);
    this.setUpFirstDhlFormGroup.get("crmAccountNumber")?.setValue(this.t001custObj.crmAccountNumber);
    var carrierType = this.t001custObj.carrierType;
    var auditcustomerstatus = this.t001custObj.auditcustomerstatus;
    var contractanalysisstatus = this.t001custObj.contractanalysisstatus;

    if (carrierType != null) {
      if (carrierType.toUpperCase().includes('ONTRAC')) {
        this.setUpFirstDhlFormGroup.get("regOntrac")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('UPS')) {
        this.setUpFirstDhlFormGroup.get("regUps")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('FEDEX')) {
        this.setUpFirstDhlFormGroup.get("regFedEx")?.setValue(true);
      }
      if (carrierType.toUpperCase().includes('USPS')) {
        this.setUpFirstDhlFormGroup.get("regUsps")?.setValue(true);
      }
    }
    else {
      this.setUpFirstDhlFormGroup.get("regOntrac")?.setValue(false);
      this.setUpFirstDhlFormGroup.get("regUps")?.setValue(false);
      this.setUpFirstDhlFormGroup.get("regFedEx")?.setValue(false);
      this.setUpFirstDhlFormGroup.get("regUsps")?.setValue(false);
    }
    if (auditcustomerstatus != null) {
      if (auditcustomerstatus.toUpperCase() == 'Y') {
        this.setUpFirstDhlFormGroup.get("perfomanceReports")?.setValue(true);
      } else {
        this.setUpFirstDhlFormGroup.get("perfomanceReports")?.setValue(false);
      }
    } else {
      this.setUpFirstDhlFormGroup.get("perfomanceReports")?.setValue(false);
    }

    if (contractanalysisstatus != null) {
      if (contractanalysisstatus.toUpperCase() == 'YES') {
        this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.setValue(true);
      } else {
        this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.setValue(false);
      }
    } else {
      this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.setValue(false);
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
  }

  updateclientresult() {
    this.openModal("Customer updated successfully");
    this.clearClickHandlerDhl();
  }
  updateclientresultOntrac() {
    this.openModal("Customer updated successfully");
    this.clearClickHandler();
  }

  update_clickHandlerDhl() {
    var txt_email = this.setUpFirstDhlFormGroup.get("email")?.value;
    var txt_password = this.setUpFirstDhlFormGroup.get("password")?.value;
    var user_name = this.setUpFirstDhlFormGroup.get("user_name")?.value;
    var clientStatus = this.setUpFirstDhlFormGroup.get("statusSelected")?.value;
    var txt_reps = this.setUpFirstDhlFormGroup.get("repname")?.value;
    var txt_status = this.setUpSecondDhlFormGroup.get("status")?.value;
    var address = this.setUpFirstDhlFormGroup.get("address")?.value;
    var phone = this.setUpFirstDhlFormGroup.get("phone")?.value;

    if (txt_password == "" || user_name == "" || clientStatus == "") {
      this.openModal("Enter All Required Field");
      return;
    }
    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];

      this.t001custObj["image"] = this.base64result;
    }
    else {
      this.t001custObj["image"] = null;
    }
    var regFedEx = this.setUpFirstDhlFormGroup.get("regFedEx")?.value;
    var regOntrac = this.setUpFirstDhlFormGroup.get("regOntrac")?.value;
    var regUps = this.setUpFirstDhlFormGroup.get("regUps")?.value;
    var regUsps = this.setUpFirstDhlFormGroup.get("regUsps")?.value;
    var auditCustId = this.setUpFirstDhlFormGroup.get("perfomanceReports")?.value;
    var contractReviewStatus = this.setUpFirstDhlFormGroup.get("contractReview")?.value;
    var contractAnalysisStatus = this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.value;
    var contractAnalysisStatus = this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.value;
    var payWebPortalStatus= this.setUpFirstDhlFormGroup.get("payStatus")?.value;
    this.t001custObj["currentstatus"] = clientStatus;

    this.t001custObj["repname"] = txt_reps;
    this.t001custObj["email"] = txt_email;
    this.t001custObj["password"] = txt_password;
    this.t001custObj["user_name"] = user_name;
    this.t001custObj["clientdbstatus"] = txt_status;
    this.t001custObj["contactNo"] = phone;
    this.t001custObj["updatedby"] = "Admin";
    this.t001custObj["address"] = address;
    this.sendLoginEmail();

    var carrierTypeDHL = "dhl";
    var carrierType = "";
    if (regUps == true) {
      carrierType = "ups~";
    }
    if (regFedEx == true) {
      carrierType = carrierType + "fedex~";
    }
    if (regOntrac == true) {
      carrierType = carrierType + "ontrac~";
    }
    carrierType = carrierType + "" + carrierTypeDHL;
    if (regUsps == true) {
      carrierType = carrierType + "~usps";
    }
    this.t001custObj["carrierType"] = carrierType;

    if (auditCustId == true) {
      this.t001custObj["auditcustomerstatus"] = "Y";
    }
    else {
      this.t001custObj["auditcustomerstatus"] = "N";
    }
    if (contractReviewStatus == true) {
      this.t001custObj["contractreviewstatus"] = true;
    }
    else {
      this.t001custObj["contractreviewstatus"] = false;
    }
    this.t001custObj["contractreviewstatusflag"] = "No";

    if (contractAnalysisStatus == true) {
      this.t001custObj["contractanalysisstatus"] = "Yes";
    }
    else {
      this.t001custObj["contractanalysisstatus"] = "No";
    }

    this.t001custObj["contractsavingspopupflag"] = "No";
   
    if(payWebPortalStatus==true){
      this.t001custObj["payStatus"]=true;
    }
    else{
      this.t001custObj["payStatus"]=false;
    }
    this.t001custObj["payFlag"]="No";
    this.t001custObj["loginEmailId"] = this.cookiesService.getCookieItem('loginEmailId');
    this.t001custObj["crmAccountNumber"] = this.setUpFirstDhlFormGroup.get("crmAccountNumber")?.value;
    this.saveOrUpdateClientProfileDhl(this.t001custObj, "Update");
    this.t000Obj["clientid"] = this.t001custObj.clientId;
    this.t000Obj["status"] = clientStatus;
    this.t001custObj["status"] = clientStatus;
  }

  fileProgress(fileInput: any) {
    this.fileToUpload = fileInput.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
    if (this.imageUrl != null) {
      this.base64result = this.imageUrl.split(',')[1];
    }

  }

  openModal(alertVal:any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  /*Contract Analysis Savings Popup Enable/Disable*/
  updateContractSavingsPopup() {
    var contractSavingsPopupObj:any = {};
    contractSavingsPopupObj["clientId"] = this.t001custObj.clientId;
    var contractSavingsStatus = this.setUpFirstFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingsStatus == true) {
      contractSavingsPopupObj["contractanalysisstatus"] = "Yes";
      this.t001custObj["contractanalysisstatus"] = "Yes";
    }
    else {
      contractSavingsPopupObj["contractanalysisstatus"] = "No";
      this.t001custObj["contractanalysisstatus"] = "No";
    }
    contractSavingsPopupObj["contractsavingspopupflag"] = "Yes";
    this.httpOntracService.saveOrUpdateClientProfile(contractSavingsPopupObj).subscribe(
      (result:any) => {
        this.openModal("Customer Updated Successfully");
      },
      (error:any) => {
        console.log(' error ', error);
      })
  }

  updateContractSavingsPopupDhl() {
    var contractSavingsPopupObj:any = {};
    contractSavingsPopupObj["clientId"] = this.t001custObj.clientId;
    var contractSavingsStatus = this.setUpFirstDhlFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingsStatus == true) {
      contractSavingsPopupObj["contractanalysisstatus"] = "Yes";
      this.t001custObj["contractanalysisstatus"] = "Yes";
    }
    else {
      contractSavingsPopupObj["contractanalysisstatus"] = "No";
      this.t001custObj["contractanalysisstatus"] = "No";
    }
    contractSavingsPopupObj["contractsavingspopupflag"] = "Yes";
    this.httpDhlService.saveOrUpdateClientProfile(contractSavingsPopupObj).subscribe(
      (result:any) => {
        this.openModal("Customer Updated Successfully");
      },
      (error:any) => {
        console.log(' error ', error);
      })
  }

  updatePayWebPortalDhl() {
    var payWebPortalObj:any = {};
    payWebPortalObj["clientId"] = this.t001custObj.clientId;
    var payWebPortalStatus = this.setUpFirstDhlFormGroup.get("payStatus")?.value;
    if (payWebPortalStatus == true) {
      payWebPortalObj["payStatus"]=true;
      this.t001custObj["payStatus"]=true;
    }
    else {
      payWebPortalObj["payStatus"]=false;
        this.t001custObj["payStatus"]=false;
    }
    payWebPortalObj["payFlag"]="Yes";
    this.httpDhlService.saveOrUpdateClientProfile(payWebPortalObj).subscribe(
      (result:any) => {
        this.openModal("Customer Updated Successfully");
      },
      (error:any) => {
        console.log(' error ', error);
      })
  }

  updatePayWebPortal() {
    var payWebPortalObj:any = {};
    payWebPortalObj["clientId"] = this.t001custObj.clientId;
    var payWebPortalStatus = this.setUpFirstFormGroup.get("payStatus")?.value;
    if (payWebPortalStatus == true) {
      payWebPortalObj["payStatus"]=true;
      this.t001custObj["payStatus"]=true;
    }
    else {
      payWebPortalObj["payStatus"]=false;
        this.t001custObj["payStatus"]=false;
    }
    payWebPortalObj["payFlag"]="Yes";
    this.httpOntracService.saveOrUpdateClientProfile(payWebPortalObj).subscribe(
      (result:any) => {
        this.openModal("Customer Updated Successfully");
      },
      (error:any) => {
        console.log(' error ', error);
      })
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  async openAuthModal() {
    this.themeoption=await this.cookiesService.getCookie('themeOption').then( res=>{ return res;  });
    if(this.themeoption=="dark"){
      this.panelClass='page-dark';
    }
    else{
      this.panelClass='custom-dialog-panel-class';
    }
    this.loaderService.show();
    const dialogConfig = this.dialog.open(AuthPopupComponent, {
      width: '470px',
      height:'250px',     
      disableClose: true ,
      panelClass:this.panelClass
    });
    dialogConfig.afterClosed().subscribe(result => {
      this.dialogValue = result.event;
      this.demoloader();
      return;
    });
  }
  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }
  confirmationModal(): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '350px',
      height:'auto',
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