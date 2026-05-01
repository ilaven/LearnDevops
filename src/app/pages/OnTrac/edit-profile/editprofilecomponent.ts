import { AfterViewInit, ElementRef, Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-ontrac-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
  standalone: false
})

export class OnTracEditProfileComponent implements OnInit, AfterViewInit {
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  //variable declaration 
  clientType = signal<any>('');
  userProfifleData: any;
  userProfifle: any;
  clientName: any;
  clientID: any;
  userName: any;
  clientPassword: any;
  carrierType: any;
  userProfifleVal: any;
  clientProfileList: any;
  fileToUpload: any;
  imageUrl: any;

  //Form group
  editProfileFormGroup!: FormGroup;
  apiControllerFormGroup!: FormGroup;
  imageProfileFormGroup!: FormGroup;

  constructor(private loaderService: LoaderService,
    private cookiesService: CookiesService,
    private commonService: CommonService,
    private httpClientService: HttpClientService,
    private dialog: MatDialog) {

    this.editProfileFormGroup = new FormGroup({
      LoginclientId: new FormControl(''),
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
      updatedby: new FormControl(''), user_name: new FormControl(''), year: new FormControl(''), contractreviewstatus: new FormControl('')
    });

    this.apiControllerFormGroup = new FormGroup({
      clientId: new FormControl(''),
      clientName: new FormControl('')
    });

    this.imageProfileFormGroup = new FormGroup({
      imageFile: new FormControl('')
    });

  }

  passwordFieldType: 'password' | 'text' = 'password';

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  // Move row one position down

  ngAfterViewInit() {
    // Sync scrollbar width dynamically
    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    this.topScroll.nativeElement.firstElementChild!.setAttribute(
      'style',
      `width:${tableWidth}px`
    );
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  ngOnInit(): void {
    this.getUser();
  }


  async getUser(): Promise<void> {
    const adminAccess = await this.cookiesService.getCookieAdmin('adminId');

    if (adminAccess !== '') {
      this.editProfileFormGroup.get('updatedby')?.setValue('Admin');
      this.userProfifleData = await this.getuserProfileAdmin();
    } else {
      this.editProfileFormGroup.get('updatedby')?.setValue('User');
      this.userProfifleData = await this.getuserProfile();
    }

    this.userProfifle = this.userProfifleData[0];

    this.clientName = this.userProfifle.clientName;
    this.clientID = this.userProfifle.clientId;
    this.userName = this.userProfifle.user_name;
    this.clientPassword = this.userProfifle.password;
    this.carrierType = this.userProfifle.carrierType;

    this.editProfileFormGroup.patchValue({
      action: this.userProfifle.action,
      activeFlag: this.userProfifle.activeFlag,
      address: this.userProfifle.address,
      asonDate: this.userProfifle.asonDate,
      changePassword: this.userProfifle.changePassword,
      charges: this.userProfifle.charges,
      clientPassword: this.userProfifle.clientPassword,
      clientdbstatus: this.userProfifle.clientdbstatus,
      comments: this.userProfifle.comments,
      contactNo: this.userProfifle.contactNo,
      contractanalysisstatus: this.userProfifle.contractanalysisstatus,
      createdBy: this.userProfifle.createdBy,
      createdTs: this.userProfifle.createdTs,
      currentDate: this.userProfifle.currentDate,
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
      year: this.userProfifle.year,
      contractreviewstatus: this.userProfifle.contractreviewstatus
    });

    this.editProfileFormGroup.get('user_name')?.setValue(this.userName);
    this.editProfileFormGroup.get('clientName')?.setValue(this.clientName);
    this.editProfileFormGroup.get('password')?.setValue(this.clientPassword);
    this.editProfileFormGroup.get('clientId')?.setValue(this.clientID);
    this.editProfileFormGroup.get('currentstatus')?.setValue('ACTIVE');
    this.editProfileFormGroup.get('carrierType')?.setValue(this.carrierType);
    this.editProfileFormGroup.get('LoginclientId')?.setValue(this.clientID);
    this.editProfileFormGroup.get('contractreviewstatusflag')?.setValue('No');
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      (result: any) => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }

  async getuserProfileAdmin(): Promise<any> {
    const upsClientId = await this.cookiesService.getCookieAdmin('upsId');
    const clientID = await this.cookiesService.getCookieAdmin('adminId');
    const clientName = await this.cookiesService.getCookieAdmin('adminName');

    this.apiControllerFormGroup.get('clientId')?.setValue(upsClientId);
    this.apiControllerFormGroup.get('clientName')?.setValue(clientName);

    const clientProfile = await firstValueFrom(
      this.httpClientService.loadClientProfile(this.apiControllerFormGroup.value)
    );

    return clientProfile;
  }

  //UI-logic

  fileProgress(fileInput: any) {
    this.fileToUpload = fileInput.item(0);
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  btn_submit_click() {
    var clientName = this.editProfileFormGroup.get('clientName')?.value;
    var password = this.editProfileFormGroup.get('password')?.value;
    if (password == "") {
      this.openModal("Please Enter Password");
      return;
    }
    this.saveOrUpdateClient();

  }

  saveOrUpdateClient() {
    if (this.imageUrl != null) {
      var base64result = this.imageUrl.split(',')[1];
      this.editProfileFormGroup.get("image")?.setValue(base64result);
    }
    this.httpClientService.saveOrUpdateClient(this.editProfileFormGroup.value).subscribe({
      next: (result: any) => {
        this.openModal("Updated Successfully");
      },
      error: (error: any) => {
        console.log('error ', error);
      }
    })
  }

  openModal(alertVal: unknown): void {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      //panelClass: this.panelClass
    });

    //this.dialogRef.close({ event: 'true' });
  }


} 
