import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClientService } from './httpclient.service';
import { restApiService } from './rest-api.service';
import { CookiesService } from './cookie.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { HttpOntracService } from './httpontrac.service';
import { HttpfedexService } from './httpfedex.service';
import { HttpDhlService } from './httpdhl.service';
import { HttpUSPSService } from './httpusps.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService implements OnDestroy {
  static setLoginUserprofile: any;
  static setUserprofile: any;
  clientID: any;
  clientType: any;
  clientName: any;
  dataString = "";
  setIntervalId: any;
  loadresult: any;
  dialogValue: any;
  panelClass: any;
  commonArray: any = [];
  url_path = environment.urlPath;
  fromDateSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataString);
  fromcurrentDate = this.fromDateSubject.asObservable();
  toDateSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataString);
  tocurrentDate = this.toDateSubject.asObservable();
  fromDateFedexSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataString);
  fromcurrentDateFedex = this.fromDateFedexSubject.asObservable();
  toDateFedexSubject: BehaviorSubject<any> = new BehaviorSubject(this.dataString);
  accNoUpsSub: BehaviorSubject<any> = new BehaviorSubject([]);
  getAccNoUps = this.accNoUpsSub.asObservable();
  accNoFedexSub: BehaviorSubject<any> = new BehaviorSubject([]);
  getAccNoFedex = this.accNoFedexSub.asObservable();
  tocurrentDateFedex = this.toDateFedexSubject.asObservable();
  CommonSub: BehaviorSubject<any[]> = new BehaviorSubject(this.commonArray);
  apiControllerFormGroup = new FormGroup({
    clientId: new FormControl(''),
    fedexClientId: new FormControl(''),
    clientName: new FormControl('')
  });
  apiControllerFedexFormGroup = new FormGroup({
    clientId: new FormControl(''),
    clientName: new FormControl('')
  });
  apiControllerOntracFormGroup = new FormGroup({
    clientId: new FormControl(''),
    clientName: new FormControl('')
  });
  apiControllerDhlFormGroup = new FormGroup({
    clientId: new FormControl(''),
    clientName: new FormControl('')
  });
  apiControllerUSPSFormGroup = new FormGroup({
    clientId: new FormControl(''),
    clientName: new FormControl('')
  });
  openContractanlysisSub: BehaviorSubject<string> = new BehaviorSubject('close');
  emittedContractParam = this.openContractanlysisSub.asObservable();
  constructor(private cookieService: CookiesService, private restApiService: restApiService,
    private cookiesService: CookieService, private httpClientService: HttpClientService, private dialog: MatDialog, private httpOntracService: HttpOntracService,
    private httpfedexService: HttpfedexService, private httpDhlService: HttpDhlService,
    private httpUspsService: HttpUSPSService) {
    this.cookieService.carrierType.subscribe((clienttype: string) => {
      if (clienttype) {
        this.clientType = clienttype;
      }
      else {
        if (localStorage.getItem('carrierType'))
          this.clientType = localStorage.getItem('carrierType');
      }
    });

  }
  setAutoRefresh(reportsFormGroupObj: any): any {
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
    }
    this.setIntervalId = window.setInterval(() => {
      this.sendData(reportsFormGroupObj);
    }, 15000);
    return this.loadresult;
  }
  _setInterval(reportsFormGroupObj: any): any {
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
    }
    this.setIntervalId = window.setInterval(() => {
      this.sendData(reportsFormGroupObj);
    }, 15000);
    return this.loadresult;
  }
  sendData(reportsFormGroupObj: any): void {
    this.httpClientService
      .fetchReportObjStatus(reportsFormGroupObj)
      .subscribe({
        next: (result: any) => {

          if (!result) {
            return;
          }

          const isSameReport =
            result.reportLogId === reportsFormGroupObj.reportLogId &&
            result.t001ClientProfile?.clientId ===
            reportsFormGroupObj.t001ClientProfile?.clientId;

          /* ================= COMPLETED ================= */
          if (result.status === 'COMPLETED' && isSameReport) {
            const objectUrl =
              `${this.url_path}DownloadServlet?reportlogid=${result.reportLogId}`;

            window.open(objectUrl);
            this.openModal('Download completed successfully');
            this.clearAutoRefresh();
            return;
          }

          /* ================= ERROR ================= */
          if (result.status === 'ERROR') {
            this.clearAutoRefresh();
          }
        },

        error: (error: any) => {
          console.error('Report status error:', error);
          this.clearAutoRefresh();
        }
      });
  }
  private clearAutoRefresh(): void {
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
      this.setIntervalId = null;
    }
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }
  ngOnDestroy(): void {
    if (this.setIntervalId) {
      clearInterval(this.setIntervalId);
    }
  }
  setDatesFunction(fromDate: any, toDate: any, fromDateFedex: any, toDateFedex: any) {
    this.fromDateSubject.next(fromDate);
    this.toDateSubject.next(toDate);
    this.fromDateFedexSubject.next(fromDateFedex);
    this.toDateFedexSubject.next(toDateFedex);
  }
  setUserprofileData(userData: any) {
    CommonService.setLoginUserprofile = userData;
  }
  emitContractParam(param: any) {
    this.openContractanlysisSub.next(param);
  }
  parseData(value: any) {
    if (!value) return null;

    // handle Promise accidentally passed
    if (value?.__zone_symbol__value) {
      value = value.__zone_symbol__value;
    }

    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }

    return value;
  }
  async getUserprofileData() {
    if (CommonService.setLoginUserprofile != undefined && CommonService.setUserprofile != undefined) {
      return CommonService.setUserprofile;
    }
    else {
      await this.cookieService.getCookie('clientId').then((clientIDdata: string) => {
        this.clientID = clientIDdata;
      });
      await this.cookieService.getCookie('clientName').then((clientNamedata: string) => {
        this.clientName = clientNamedata;

      });;
      if (this.clientID != "" && this.clientName != "") {
        let loginData: any = this.cookieService.getCookie('logindata');
        let data = this.parseData(loginData);
        await this.apiControllerFormGroup.get('clientId')?.setValue(data.clientId);
        // await this.apiControllerFormGroup.get('clientId').setValue(this.clientID);
        await this.apiControllerFormGroup.get('clientName')?.setValue(this.clientName);
        this.apiControllerFedexFormGroup.get('clientName')?.setValue(this.clientName);
        this.apiControllerOntracFormGroup.get('clientName')?.setValue(this.clientName);
        this.apiControllerDhlFormGroup.get('clientName')?.setValue(this.clientName);
        this.apiControllerUSPSFormGroup.get('clientName')?.setValue(this.clientName);
        const getCurrent_user = await this.getCurrentLoginUser().then(userObj => {
          return userObj;
        });
        CommonService.setUserprofile = getCurrent_user;
        return getCurrent_user;
      }
    }
  }
  // async getCurrentLoginUser(): Promise<any> {
  //   try {
  //     const currentUser = await firstValueFrom(
  //       this.restApiService.validateLoginDetails(
  //         this.apiControllerFormGroup.value
  //       )
  //     );

  //     return await this.loadSelectedProfile(currentUser);
  //   } catch (error) {
  //     console.error('Failed to fetch current login user', error);
  //     throw error;
  //   }
  // }
  async getCurrentLoginUser() {
    const getCurrent = await firstValueFrom(
      this.httpClientService.validateLoginDetails(this.apiControllerFormGroup.value)
    );

    const selectProfile = await this.loadSelectedProfile(getCurrent);

    return selectProfile;
  }
  adminAccess: any;
  loginCustomerType: any;
  async loadSelectedProfile(param: any): Promise<any> {
    this.adminAccess = await this.cookieService.getCookieAdmin('adminId');
    this.loginCustomerType = this.cookieService.getCookieItem('loginCustomerType');
    if (this.adminAccess != "" && this.loginCustomerType != "LJM_User" && this.loginCustomerType != "N") {
      var upsClientId = await this.cookieService.getCookie('clientId').then((res: string) => { return res; });
      var fedexClientId = await this.cookieService.getCookie('clientId').then((res: string) => { return res; });
      var ontracClientId = await this.cookieService.getCookie('clientId').then((res: string) => { return res; });
      var dhlClientId = await this.cookieService.getCookie('clientId').then((res: string) => { return res; });
      var uspsClientId = await this.cookieService.getCookie('clientId').then((res: string) => { return res; });
    }
    else {
      upsClientId = param.upsClientId;
      fedexClientId = param.fedexClientId;
      ontracClientId = param.ontracClientId;
      dhlClientId = param.dhlClientId;
      uspsClientId = param.uspsClientId;
      var carrierType = param.carrierType;
    }

    this.apiControllerFedexFormGroup.get('clientId')?.setValue(fedexClientId);
    this.apiControllerFormGroup.get('clientId')?.setValue(upsClientId);
    this.apiControllerOntracFormGroup.get('clientId')?.setValue(ontracClientId);
    this.apiControllerDhlFormGroup.get('clientId')?.setValue(dhlClientId);
    this.apiControllerUSPSFormGroup.get('clientId')?.setValue(uspsClientId);

    if (this.clientType.toLocaleLowerCase() == "fedex") {
      const clientProfile = await this.restApiService.fetchUser(this.apiControllerFedexFormGroup.value).toPromise();
      return clientProfile;
    }
    else if (this.clientType.toLocaleLowerCase() == "ontrac") {
      const clientProfile = await this.restApiService.loadOnTracClientProfile(this.apiControllerOntracFormGroup.value).toPromise();
      return clientProfile;
    }
    else if (this.clientType.toLocaleLowerCase() == "dhl") {
      const clientProfile = await this.restApiService.loadDhlClientProfile(this.apiControllerDhlFormGroup.value).toPromise();
      return clientProfile;
    }
    else if (this.clientType.toLocaleLowerCase() == "usps") {
      const clientProfile = await this.restApiService.loadUSPSClientProfile(this.apiControllerUSPSFormGroup.value).toPromise();
      return clientProfile;
    }
    else {
      const clientProfile = await this.restApiService.loadClientProfile(this.apiControllerFormGroup.value).toPromise();
      return clientProfile;
    }


  }
  emitAccValuesFunction(accNoUps: any, accNoFedex: any) {
    this.accNoUpsSub.next(accNoUps);
    this.accNoFedexSub.next(accNoFedex);
  }

  async _setIntervalOnTrac(reportsFormGroupObj: any) {
    clearInterval(this.setIntervalId);
    this.setIntervalId = setInterval(() => { this.sendDataOnTrac(reportsFormGroupObj); }, 15000);
    return this.loadresult;
  }

  sendDataOnTrac(reportsFormGroupObj: any) {
    this.httpOntracService.fetchReportObjStatus(reportsFormGroupObj).subscribe({
      next: (resultObj: any) => {
        const sameReport =
          resultObj.reportLogId === reportsFormGroupObj.reportLogId &&
          resultObj.t001ClientProfile?.clientId === reportsFormGroupObj.t001ClientProfile?.clientId;

        if (resultObj.status === "COMPLETED" && sameReport) {
          const objectUrl = `${this.url_path}OntracDownloadServlet?reportlogid=${resultObj.reportLogId}`;
          window.open(objectUrl);
          this.openModal("Download completed successfully");
          clearInterval(this.setIntervalId);
        }

        if (resultObj.status === "ERROR") {
          clearInterval(this.setIntervalId);
        }
      },
      error: (err: any) => {
        console.error("Error fetching report status", err);
        clearInterval(this.setIntervalId);
      }
    });
  }

  async _setIntervalFedEx(reportsFormGroupObj: any) {
    clearInterval(this.setIntervalId);
    this.setIntervalId = setInterval(() => { this.sendDataFedEx(reportsFormGroupObj); }, 15000);
    return this.loadresult;
  }

  sendDataFedEx(reportsFormGroupObj: any) {
    this.httpfedexService.fetchReportObjStatus(reportsFormGroupObj).subscribe({
      next: (result: any) => {
        var resultObj = [];
        resultObj = result;
        if (resultObj[0].status == "COMPLETED" && resultObj[0].reportLogId == reportsFormGroupObj.reportLogId && resultObj[0].t002ClientProfileobj.clientId == reportsFormGroupObj.t002ClientProfileobj.clientId) {

          var objectUrl = this.url_path + "FedexDownloadServlet?reportlogid=" + resultObj[0].reportLogId;
          window.open(objectUrl);
          this.openModal("Download completed successfully");
          clearInterval(this.setIntervalId);
        }
        if (resultObj[0].status == "ERROR") {
          clearInterval(this.setIntervalId);
        }
      },
      error: (error: any) => {
        console.log(' error ', error);

      }
    });
  }

  async getCurrentFedexUserLogin() {
    var fedexClientId = this.apiControllerFedexFormGroup.get('clientId')?.value;
    return fedexClientId;
  }

  async getCurrentUpsUserLogin() {
    var upsClientId = this.apiControllerFormGroup.get('clientId')?.value;
    return upsClientId;
  }

  async _setIntervalDhl(reportsFormGroupObj: any) {
    clearInterval(this.setIntervalId);
    this.setIntervalId = setInterval(() => { this.sendDataDhl(reportsFormGroupObj); }, 15000);
    return this.loadresult;
  }

  sendDataDhl(reportsFormGroupObj: any) {
    this.httpDhlService.fetchReportObjStatus(reportsFormGroupObj).subscribe({
      next: (result: any) => {
        var resultObj = result;
        if (resultObj.status == "COMPLETED" && resultObj.reportLogId == reportsFormGroupObj.reportLogId && resultObj.t001ClientProfile.clientId == reportsFormGroupObj.t001ClientProfile.clientId) {

          var objectUrl = this.url_path + "DhlDownloadServlet?reportlogid=" + resultObj.reportLogId;
          window.open(objectUrl);
          this.openModal("Download completed successfully");
          clearInterval(this.setIntervalId);

        }
        if (resultObj.status == "ERROR") {
          clearInterval(this.setIntervalId);
        }
      },
      error: (error: any) => {
        console.log(' error ', error);
        clearInterval(this.setIntervalId);
      }
    });
  }

  async _setIntervalUSPS(reportsFormGroupObj: any) {
    clearInterval(this.setIntervalId);
    this.setIntervalId = setInterval(() => { this.sendDataUSPS(reportsFormGroupObj); }, 15000);
    return this.loadresult;
  }

  sendDataUSPS(reportsFormGroupObj: any) {
    this.httpUspsService.fetchReportObjStatus(reportsFormGroupObj).subscribe({
      next: (result: any) => {
        var resultObj = result;
        if (resultObj.status == "COMPLETED" && resultObj.reportLogId == reportsFormGroupObj.reportLogId && resultObj.t001ClientProfile.clientId == reportsFormGroupObj.t001ClientProfile.clientId) {

          var objectUrl = this.url_path + "UspsDownloadServlet?reportlogid=" + resultObj.reportLogId;
          window.open(objectUrl);
          this.openModal("Download completed successfully");
          clearInterval(this.setIntervalId);

        }
        if (resultObj.status == "ERROR") {
          clearInterval(this.setIntervalId);
        }
      },
      error: (error: any) => {
        console.log(' error ', error);
        clearInterval(this.setIntervalId);
      }
    });
  }
  setCommonAc(): Observable<any> {
    return this.CommonSub.asObservable();
  }

}
