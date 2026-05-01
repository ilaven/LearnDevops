import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Login Auth
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfake.service';
import { first } from 'rxjs/operators';
import { ToastService } from './toast-service';
import { Store } from '@ngrx/store';
import { login } from 'src/app/store/Authentication/authentication.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { restApiService } from 'src/app/core/services/rest-api.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {
  showNavigationArrows: any;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;
  toast!: false;
  error_text = signal<string>('');
  invalidLogin = false;

  year: number = new Date().getFullYear();
  clientProfileFormGroup: FormGroup;
  apiControllerFormGroup: FormGroup;
  clientId: any;
  //private formBuilder: FormBuilder,private store: Store,  private authenticationService: AuthenticationService,private authFackservice: AuthfakeauthenticationService, private route: ActivatedRoute,
  constructor(private router: Router, public toastService: ToastService, private modalService: NgbModal, private commonService: CommonService,
    private cookiesService: CookiesService, private restApiService: restApiService, public dialog: MatDialog, private loaderService: LoaderService) {
    this.loginCheck();
    this.clientProfileFormGroup = new FormGroup({
      userName: new FormControl(''),
      password: new FormControl(''),
      clientId: new FormControl(''),
      rememberMe: new FormControl(false),
      email: new FormControl(''),
    });
    this.apiControllerFormGroup = new FormGroup({
      ipaddress: new FormControl(''),
      city: new FormControl(''),
      region: new FormControl(''),
      country: new FormControl(''),
      location: new FormControl(''),
      username: new FormControl(''),
      status: new FormControl('Invalid'),
      loginclientName: new FormControl(''),
      accountOwnerName: new FormControl(''),
      accountOwnerEmail: new FormControl(''),
    })
  }
  async loginCheck() {
    this.clientId = await this.cookiesService.getCookie('clientId');
    if (this.clientId)
      this.router.navigate(['/ups/dashboard']);
  }
  ngOnInit(): void {

    this.setRememberMeCredentials();
    this.loadClientIPDetails();
  }

  private setRememberMeCredentials(): void {
    const credentials = this.cookiesService.getRememberMe();
    if (!credentials) {
      return;
    }
    this.clientProfileFormGroup.patchValue({
      userName: credentials.userName,
      password: credentials.password,
      rememberMe: true
    });
  }
  private loadClientIPDetails(): void {
    this.restApiService.getClientIpDetails().subscribe({
      next: (result: any) => {
        this.apiControllerFormGroup.patchValue({
          ipaddress: result.ip,
          city: result.city,
          region: result.region,
          country: result.country,
          location: `${result.latitude},${result.longitude}`
        });
      },
      error: (error) => {
        console.error('IP fetch error:', error);
      }
    });
  }
  centerModal(centerDataModal: any) {
    this.modalService.open(centerDataModal, { centered: true });
  }

  resultLoginData: any;
  AccountOwner = '';

  async checkLogin(): Promise<void> {
    this.loaderService.show();
    const username = this.clientProfileFormGroup.get('userName')?.value?.trim();
    const password = this.clientProfileFormGroup.get('password')?.value;

    if (!username || !password) {
      this.error_text.set('Please enter valid credentials');
      this.loaderService.hide();
      return;
    }

    // Remember Me
    if (this.clientProfileFormGroup.get('rememberMe')?.value) {
      this.cookiesService.setRememberMe(username, password);
    } else {
      this.cookiesService.clearRememberMe();
    }

    this.clientProfileFormGroup.patchValue({ userName: username, password });
    this.apiControllerFormGroup.get('username')?.setValue(username);

    // CRM Login
    if (username.includes('myljm.com')) {
      const result = await this.restApiService
        .getCRMCredential(username, password)
        .toPromise();

      if (result?.StatusCode !== '200' || !result?.UserResult?.UserId) {
        this.loaderService.hide();
        this.error_text.set(result?.Status || 'Invalid login');

        this.saveOrUpdateReportLogin();
        return;
      }

      this.handleCrmSuccess(result);
    } else {
      this.cookiesService.setCookieItem('loginEmailId', username);
    }

    // Validate Login
    this.restApiService
      .validateLoginDetails(this.clientProfileFormGroup.value)
      .subscribe({
        next: async (data) => {
          if (!data || data.clientId === 0) {
            this.loaderService.hide();
            this.error_text.set('Please check username and password');

            this.saveOrUpdateReportLogin();
            return;
          }

          this.resultLoginData = data;
          sessionStorage.setItem('currentUser', data.clientId);
          sessionStorage.setItem('toast', 'toast');
          this.commonService.setUserprofileData(data);
          this.cookiesService.setLoginCredentialCookie(data);

          const isActive = await this.validateCarrierStatus(data);
          if (!isActive) return;

          this.finalizeLogin(data);
        },
        error: (err) => console.error('Login Error:', err)
      });
  }
  private finalizeLogin(data: any): void {
    this.apiControllerFormGroup.patchValue({
      status: 'Valid',
      loginclientName: data.clientName
    });

    if (data.clientName?.toUpperCase() === 'ADMIN') {
      this.apiControllerFormGroup.patchValue({
        accountOwnerName: this.AccountOwner,
        accountOwnerEmail: '',
        loginclientName: data.userName
      });
    }

    this.loginEmail();
    this.saveOrUpdateReportLogin();
  }


  private async validateCarrierStatus(data: any): Promise<boolean> {
    const carrier = data.carrierType?.toUpperCase();

    const carrierMap: Record<string, string> = {
      UPS: data.status,
      FEDEX: data.statusFedex,
      ONTRAC: data.statusOntrac,
      DHL: data.statusDhl,
      USPS: data.statusUsps
    };

    for (const key in carrierMap) {
      if (carrier?.includes(key)) {
        if (carrierMap[key]?.toLowerCase() === 'active') {
          await this.callCarrierCheck(key, data);
          return true;
        }
        this.openInactiveModal();
        return false;
      }
    }

    this.openInactiveModal();
    return false;
  }
  private async callCarrierCheck(type: string, data: any): Promise<void> {
    switch (type) {
      case 'UPS': await this.checkActiveStatusUPS(data); break;
      case 'FEDEX': await this.checkActiveStatusFedEx(data); break;
      case 'ONTRAC': await this.checkActiveStatusOnTrac(data); break;
      case 'DHL': await this.checkActiveStatusDHL(data); break;
      case 'USPS': await this.checkActiveStatusUSPS(data); break;
    }
  }
  private openInactiveModal(): void {
    this.openModal(
      'Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500'
    );
  }
  private handleCrmSuccess(result: any): void {
    this.clientProfileFormGroup.patchValue({
      clientId: 12,
      userName: null,
      password: null
    });

    const userType = result.UserResult?.User_Type?.toUpperCase();
    if (userType) {
      this.cookiesService.setCookieItem('CRM_User_Type', userType);
      if (userType === 'USER' && result.UserResult.Email) {
        this.clientProfileFormGroup.get('email')?.setValue(result.UserResult.Email);
      }
    }

    this.cookiesService.setCookieItem('loginEmailId', result.UserResult.Email);
    this.cookiesService.setCookieItem('loginUserId', result.UserResult.UserId);

    this.AccountOwner = result.UserResult.AccountOwner;
    this.apiControllerFormGroup
      .get('accountOwnerName')
      ?.setValue(this.AccountOwner);
    this.error_text.set('');
  }
  async checkActiveStatusUPS(data: any): Promise<void> {
    const clientObj: any = {
      clientId: data.upsClientId,
      lazyLoad: 'Y'
    };

    data.clientId = data.upsClientId;
    await this.loadClientProfile(clientObj, data);
  }
  async checkActiveStatusFedEx(data: any): Promise<void> {
    const clientObj: any = {
      clientId: data.fedexClientId
    };

    data.clientId = data.fedexClientId;

    const loginEmailId = this.clientProfileFormGroup.get('email')?.value;
    if (loginEmailId) {
      clientObj.email = loginEmailId;
    }
    await this.fetchUser(clientObj, data);
  }
  async checkActiveStatusOnTrac(data: any): Promise<void> {
    const clientObj: any = {
      clientId: data.ontracClientId,
      lazyLoad: 'Y'
    };

    await this.loadOnTracClientProfile(clientObj, data);
  }
  async checkActiveStatusDHL(data: any): Promise<void> {
    const clientObj: any = {
      clientId: data.ontracClientId,
      lazyLoad: 'Y'
    };

    await this.loadDhlClientProfile(clientObj, data);
  }
  async checkActiveStatusUSPS(data: any): Promise<void> {
    const clientObj: any = {
      clientId: data.ontracClientId,
      lazyLoad: 'Y'
    };

    await this.loadUSPSClientProfile(clientObj, data);
  }
  clientList: any;

  async loadClientProfile(param: any, adminObj: any): Promise<void> {
    const result = await this.restApiService
      .loadClientProfile(param)
      .toPromise();

    const t001ClientProfileAC: any[] = result || [];

    if (!t001ClientProfileAC.length) {
      this.openModal('Invalid UserName and PassWord');
      return;
    }

    const t001ClientObj: any = t001ClientProfileAC[0];

    this.apiControllerFormGroup.patchValue({
      accountOwnerName: t001ClientObj.repname,
      accountOwnerEmail: t001ClientObj.email
    });

    const status = t001ClientObj.status?.toUpperCase();
    const customerType = t001ClientObj.customertype;

    if (
      (status === 'INACTIVE' || !status) &&
      (customerType !== 'Ljm_User' &&
        customerType !== 'User' &&
        !customerType)
    ) {
      this.openModal(
        'Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500'
      );
      return;
    }

    this.cookiesService.setCookieItem(
      'loginCustomerType',
      t001ClientObj.customertype
    );

    // LJM User Flow
    if (customerType === 'LJM_User') {

      // Master Account Login
      if (
        t001ClientObj.login_Type === 'Master' &&
        t001ClientObj.clientId !== 0
      ) {
        const t001custObj: any = {
          status: 'ACTIVE',
          lazyLoad: 'N',
          login_ParentClientId: t001ClientObj.clientId
        };

        await this.loadClientProfileFinal(
          t001custObj,
          this.resultLoginData
        );
        return;
      }

      // Normal LJM User
      this.cookiesService.setNotificationFlag(true);
      this.cookiesService.setCookieItem('notificationCountUPS', 1);
      this.cookiesService.setCookie(this.resultLoginData);
      this.router.navigate(['/ups/dashboard']);
      return;
    }

    // Non-LJM User Flow
    const t001custObj: any = {
      status: 'ACTIVE',
      lazyLoad: 'N'
    };

    const loginEmailId = this.clientProfileFormGroup.get('email')?.value;
    if (loginEmailId) {
      t001custObj.email = loginEmailId;
    }

    await this.loadClientProfileFinal(
      t001custObj,
      this.resultLoginData
    );
  }
  async loadClientProfileFinal(param: any, adminObjValue: any): Promise<void> {
    const result = await this.restApiService
      .loadClientProfile(param)
      .toPromise();

    this.clientList = result;

    if (!result || result.length === 0) {
      return;
    }

    // Admin login (multiple clients)
    if (result.length > 1) {
      this.cookiesService.setCookieAdmin(result, adminObjValue);

      if (result[0]?.login_ParentClientId !== 0) {
        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookieItem('notificationCountUPS', 1);
      }

      this.router.navigate(['/ups/dashboard']);
      this.invalidLogin = false;
      return;
    }

    // Single client login
    this.cookiesService.setNotificationFlag(true);
    this.cookiesService.setCookieItem('notificationCountUPS', 1);
    this.cookiesService.setCookie(this.resultLoginData);
    this.router.navigate(['/ups/dashboard']);
  }
  loginEmail(): void {
    this.restApiService
      .loginEmail(this.apiControllerFormGroup.value)
      .subscribe({
        next: () => {
          // Success logic (if needed later)
        },
        error: (error) => {
          console.error('Login email failed:', error);
        }
      });
  }
  saveOrUpdateReportLogin(): void {
    this.restApiService
      .saveOrUpdateReportLogin(this.apiControllerFormGroup.value)
      .subscribe({
        next: (result) => {
          this.cookiesService.setLoginIdCookie(result?.loginId);
        },
        error: (error) => {
          console.error('Save/update report login failed:', error);
        }
      });
  }
  async fetchUser(param: any, adminObj: any): Promise<void> {
    try {
      const users: any = await this.restApiService
        .fetchUser(param)
        .toPromise();

      if (!users || users.length === 0) {
        this.openModal('Invalid UserName and PassWord');
        return;
      }

      const loginUserIndex = users.findIndex((u: any) => u.loginFlag === 'Y');
      const loginUser = loginUserIndex !== -1 ? users.splice(loginUserIndex, 1)[0] : null;

      if (!loginUser || loginUser.clientId === 0) {
        this.openModal('You are not Authorized to Login. Please provide valid credentials');
        return;
      }

      this.apiControllerFormGroup.patchValue({
        accountOwnerName: loginUser.repName,
        accountOwnerEmail: loginUser.email
      });

      if (!loginUser.status || loginUser.status.toUpperCase() === 'INACTIVE') {
        this.openModal(
          'Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500'
        );
        return;
      }

      this.cookiesService.setCookieItem('loginCustomerType', loginUser.adminFlag);

      if (loginUser.adminFlag !== 'Y' && users.length == 0) {
        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookieItem('notificationCountFedEx', 1);
        this.cookiesService.setCookie(this.resultLoginData);
      } else {
        this.cookiesService.setCookieAdmin(loginUser, this.resultLoginData);
      }

      this.router.navigate(['/ups/dashboard']);

    } catch (error) {
      console.error('Fetch user failed:', error);
    }
  }
  async loadOnTracClientProfile(param: any, adminObj: any): Promise<void> {
    try {
      const profiles: any[] = await this.restApiService
        .loadOnTracClientProfile(param)
        .toPromise();

      if (!profiles || profiles.length === 0) {
        this.openModal('Invalid UserName and PassWord');
        return;
      }

      const client = profiles[0];

      this.apiControllerFormGroup.patchValue({
        accountOwnerName: client.repname,
        accountOwnerEmail: client.email
      });

      if (
        (!client.status || client.status.toUpperCase() === 'INACTIVE') &&
        client.customertype !== 'Ljm_User' &&
        client.customertype !== 'User'
      ) {
        this.openModal(
          'Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500'
        );
        return;
      }

      this.cookiesService.setCookieItem('loginCustomerType', client.customertype);

      // LJM User logic
      if (client.customertype === 'LJM_User') {
        if (client.login_Type === 'Master' && client.clientId !== 0) {
          await this.loadOnTracClientProfileFinal(
            {
              status: 'ACTIVE',
              lazyLoad: 'N',
              login_ParentClientId: client.clientId
            },
            this.resultLoginData
          );
          return;
        }

        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookie(this.resultLoginData);
        this.router.navigate(['/ups/dashboard']);
        return;
      }

      // Non-LJM User logic
      const customerObj: any = {
        status: 'ACTIVE',
        lazyLoad: 'N'
      };

      const email = this.clientProfileFormGroup.get('email')?.value;
      if (email) {
        customerObj.email = email;
      }

      await this.loadOnTracClientProfileFinal(customerObj, this.resultLoginData);

    } catch (error) {
      console.error('OnTrac profile load failed:', error);
    }
  }
  async loadOnTracClientProfileFinal(param: any, adminObjValue: any): Promise<void> {
    try {
      const result: any[] = await this.restApiService
        .loadOnTracClientProfile(param)
        .toPromise();

      this.clientList = result;

      if (!result || result.length === 0) {
        return;
      }

      // Admin login (multiple sub accounts)
      if (result.length > 1) {
        this.cookiesService.setCookieAdmin(result, adminObjValue);
        this.invalidLogin = false;
      }
      // Master login (single account)
      else {
        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookie(this.resultLoginData);
      }

      this.router.navigate(['/ups/dashboard']);

    } catch (error) {
      console.error('OnTrac final profile load failed:', error);
    }
  }
  async loadDhlClientProfile(param: any, adminObj: any): Promise<void> {
    try {
      const profiles: any[] = await this.restApiService
        .loadDhlClientProfile(param)
        .toPromise();

      if (!profiles || profiles.length === 0) {
        this.openModal('Invalid UserName and PassWord');
        return;
      }

      const client = profiles[0];

      this.apiControllerFormGroup.patchValue({
        accountOwnerName: client.repname,
        accountOwnerEmail: client.email
      });

      if (
        (!client.status || client.status.toUpperCase() === 'INACTIVE') &&
        client.customertype !== 'Ljm_User' &&
        client.customertype !== 'User'
      ) {
        this.openModal(
          'Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500'
        );
        return;
      }

      this.cookiesService.setCookieItem('loginCustomerType', client.customertype);

      // LJM User logic
      if (client.customertype === 'LJM_User') {
        if (client.login_Type === 'Master' && client.clientId !== 0) {
          await this.loadDhlClientProfileFinal(
            {
              status: 'ACTIVE',
              lazyLoad: 'N',
              login_ParentClientId: client.clientId
            },
            this.resultLoginData
          );
          return;
        }

        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookie(this.resultLoginData);
        this.router.navigate(['/ups/dashboard']);
        return;
      }

      // Non-LJM User logic
      const customerObj: any = {
        status: 'ACTIVE',
        lazyLoad: 'N'
      };

      const email = this.clientProfileFormGroup.get('email')?.value;
      if (email) {
        customerObj.email = email;
      }

      await this.loadDhlClientProfileFinal(customerObj, this.resultLoginData);

    } catch (error) {
      console.error('DHL profile load failed:', error);
    }
  }
  async loadDhlClientProfileFinal(param: any, adminObjValue: any): Promise<void> {
    try {
      const result: any[] = await this.restApiService
        .loadDhlClientProfile(param)
        .toPromise();

      this.clientList = result;

      if (!result || result.length === 0) {
        return;
      }

      // Admin login
      if (result.length > 1) {
        this.cookiesService.setCookieAdmin(result, adminObjValue);
        this.invalidLogin = false;
      }
      // Master login
      else {
        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookie(this.resultLoginData);
      }

      this.router.navigate(['/ups/dashboard']);

    } catch (error) {
      console.error('DHL final profile load failed:', error);
    }
  }
  openModal(alertVal: string): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal }
    });
  }

  async loadUSPSClientProfile(param: any, adminObj: any): Promise<void> {
    try {
      const profiles: any[] = await this.restApiService
        .loadUSPSClientProfile(param)
        .toPromise();

      if (!profiles || profiles.length === 0) {
        this.openModal('Invalid UserName and PassWord');
        return;
      }

      const client = profiles[0];

      this.apiControllerFormGroup.patchValue({
        accountOwnerName: client.repname,
        accountOwnerEmail: client.email
      });

      if (
        (!client.status || client.status.toUpperCase() === 'INACTIVE') &&
        client.customertype !== 'Ljm_User' &&
        client.customertype !== 'User'
      ) {
        this.openModal(
          'Due to inactivity, data load is suspended. Please contact LJM Support @ (631) 844-9500'
        );
        return;
      }

      this.cookiesService.setCookieItem('loginCustomerType', client.customertype);

      // LJM User logic
      if (client.customertype === 'LJM_User') {
        if (client.login_Type === 'Master' && client.clientId !== 0) {
          await this.loadUSPSClientProfileFinal(
            {
              status: 'ACTIVE',
              lazyLoad: 'N',
              login_ParentClientId: client.clientId
            },
            this.resultLoginData
          );
          return;
        }

        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookie(this.resultLoginData);
        this.router.navigate(['/ups/dashboard']);
        return;
      }

      // Non-LJM User logic
      const customerObj: any = {
        status: 'ACTIVE',
        lazyLoad: 'N'
      };

      const email = this.clientProfileFormGroup.get('email')?.value;
      if (email) {
        customerObj.email = email;
      }

      await this.loadUSPSClientProfileFinal(customerObj, this.resultLoginData);

    } catch (error) {
      console.error('USPS profile load failed:', error);
    }
  }
  async loadUSPSClientProfileFinal(param: any, adminObjValue: any): Promise<void> {
    try {
      const result: any[] = await this.restApiService
        .loadUSPSClientProfile(param)
        .toPromise();

      this.clientList = result;

      if (!result || result.length === 0) {
        return;
      }

      // Admin login
      if (result.length > 1) {
        this.cookiesService.setCookieAdmin(result, adminObjValue);
        this.invalidLogin = false;
      }
      // Master login
      else {
        this.cookiesService.setNotificationFlag(true);
        this.cookiesService.setCookie(this.resultLoginData);
      }

      this.router.navigate(['/ups/dashboard']);

    } catch (error) {
      console.error('USPS final profile load failed:', error);
    }
  }
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }







  onSubmit() {
    // this.submitted = true;

    // // Login Api
    // this.store.dispatch(login({ email: this.f['email'].value, password: this.f['password'].value }));
    // this.router.navigate(['/ups/dashboard']);
    // this.authenticationService.login(this.f['email'].value, this.f['password'].value).subscribe((data:any) => { 
    //   if(data.status == 'success'){
    //     sessionStorage.setItem('toast', 'true');
    //     sessionStorage.setItem('currentUser', JSON.stringify(data.data));
    //     sessionStorage.setItem('token', data.token);
    //     this.router.navigate(['/']);
    //   } else {
    //     this.toastService.show(data.data, { classname: 'bg-danger text-white', delay: 15000 });
    //   }
    // });

    // stop here if form is invalid
    // if (this.loginForm.invalid) {
    //   return;
    // } else {
    //   if (environment.defaultauth === 'firebase') {
    //     this.authenticationService.login(this.f['email'].value, this.f['password'].value).then((res: any) => {
    //       this.router.navigate(['/']);
    //     })
    //       .catch(error => {
    //         this.error = error ? error : '';
    //       });
    //   } else {
    //     this.authFackservice.login(this.f['email'].value, this.f['password'].value).pipe(first()).subscribe(data => {
    //           this.router.navigate(['/']);
    //         },
    //         error => {
    //           this.error = error ? error : '';
    //         });
    //   }
    // }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
