
import {
    Injectable
} from '@angular/core';

import {
    CookieService
} from 'ngx-cookie-service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class CookiesService2 {
    carrierTypeValue: string = '';
    carrierTypeVal: string = '';
    themeOptionVal: string = '';
    private isLoggedin = new Subject<boolean>();
    carrierType: BehaviorSubject<string> = new BehaviorSubject(this.carrierTypeVal);
    carrierTypevalue: BehaviorSubject<string> = new BehaviorSubject(this.carrierTypeValue);
    themeOption: BehaviorSubject<string> = new BehaviorSubject(this.themeOptionVal);
    constructor(private cookieService: CookieService, private router: Router) {
        this.carrierTypeVal = localStorage.getItem('chooseCarrier');
        this.themeOptionVal = localStorage.getItem('themeOption');
        this.carrierType.next(this.carrierTypeVal);
        this.themeOption.next(this.themeOptionVal);
        this.carrierTypevalue.next(this.carrierTypeValue);
    }

    async setCookietheme(data:any) {
        var browserName = this.getBrowserName();
        if (browserName == "chrome") {
            document.cookie = "themeOption=" + data+";path=/";
        } else {
            this.cookieService.set('themeOption', data, 1,'/');
        }
    }




    getBrowserName() {
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
            case agent.indexOf('edge') > -1:
                return 'edge';
            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
                return 'chrome';
            case agent.indexOf('trident') > -1:
                return 'ie';
            case agent.indexOf('firefox') > -1:
                return 'firefox';
            case agent.indexOf('safari') > -1:
                return 'safari';
            default:
                return 'other';
        }
    }
    async setCookie(data:any) {

        var carrierName = this.getCarrierType();
        var browserName = this.getBrowserName();
        var adminAccess = localStorage.getItem('adminId');
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "clientName=" + data.clientName+';path=/';
            document.cookie = "clientId=" + data.clientId;
            var carrierType = data.carrierType;
            this.carrierTypeValue = data.carrierType;
            this.carrierTypevalue.next(this.carrierTypeValue);
            document.cookie = "carrierTypevalue=" + this.carrierTypeValue+';path=/';
            var carrierTypeVal = carrierType.toLowerCase(); 
            if (adminAccess == "") {
                if (carrierTypeVal.includes("ups") && data.status.toLowerCase() == 'active') { var crType :any= "UPS"; }
                else if (carrierTypeVal.includes("fedex") && data.statusFedex.toLowerCase() == 'active') { crType = "FedEx"; }
                else if (carrierTypeVal.includes("ontrac") && data.statusOntrac.toLowerCase() == 'active') { crType = "OnTrac"; }
                else if (carrierTypeVal.includes("dhl") && data.statusDhl.toLowerCase() == 'active') { crType = "Dhl"; }
                else if (carrierTypeVal.includes("usps") && data.statusUsps.toLowerCase() == 'active') { crType = "USPS"; }
                //  else{crType="UPS";}
            }
            else {
                if (carrierTypeVal.includes("ups")) { var crType :any= "UPS"; }
                else if (carrierTypeVal.includes("fedex")) { crType = "FedEx"; }
                else if (carrierTypeVal.includes("ontrac")) { crType = "OnTrac"; }
                else if (carrierTypeVal.includes("dhl")) { crType = "Dhl"; }
                else if (carrierTypeVal.includes("usps")) { crType = "USPS"; }
                //  else{crType="UPS";}
            }
            document.cookie = "carrierType=" + crType+';path=/';

            if (adminAccess == "") {
                document.cookie = "themeOption=" + data.theme_option+';path=/';
            }
            document.cookie = "data=" + data+';path=/';
            if (data.carrierType.toLowerCase().includes(carrierName.toLowerCase()) && carrierName != "") {
                this.carrierType.next(carrierName);
                document.cookie = "chooseCarrier=" + carrierName+';path=/';
                document.cookie = "currentCarrierType=" + carrierName+';path=/';
            } else {
                this.carrierType.next(crType);
                document.cookie = "chooseCarrier=" + crType+';path=/';
                document.cookie = "currentCarrierType=" + crType+';path=/';
            }

        }
        else {
            this.cookieService.set('clientName', data.clientName, 1,'/');
            this.cookieService.set('clientId', data.clientId, 1,'/');
            var carrierType = data.carrierType;
            var carrierTypeVal = carrierType.toLowerCase();
            this.carrierTypeValue = data.carrierType;
            this.carrierTypevalue.next(this.carrierTypeValue);
            this.cookieService.set('carrierTypevalue', this.carrierTypeValue, 1,'/'); 
            if (adminAccess == "") {
                if (carrierTypeVal.includes("ups") && data.status.toLowerCase() == 'active') { var crType:any = "UPS"; }
                else if (carrierTypeVal.includes("fedex") && data.statusFedex.toLowerCase() == 'active') { crType = "FedEx"; }
                else if (carrierTypeVal.includes("ontrac") && data.statusOntrac.toLowerCase() == 'active') { crType = "OnTrac"; }
                else if (carrierTypeVal.includes("dhl") && data.statusDhl.toLowerCase() == 'active') { crType = "Dhl"; }
                else if (carrierTypeVal.includes("usps") && data.statusDhl.toLowerCase() == 'active') { crType = "USPS"; }
                //  else{crType="UPS";}
            } else {
                if (carrierTypeVal.includes("ups")) { var crType:any = "UPS"; }
                else if (carrierTypeVal.includes("fedex")) { crType = "FedEx"; }
                else if (carrierTypeVal.includes("ontrac")) { crType = "OnTrac"; }
                else if (carrierTypeVal.includes("dhl")) { crType = "Dhl"; }
                else if (carrierTypeVal.includes("usps")) { crType = "USPS"; }
                //  else{crType="UPS";}
            }
            this.cookieService.set('carrierType', crType, 1,'/');
            if (adminAccess == "") {
                this.cookieService.set('themeOption', data.theme_option, 1,'/');
            }
            this.cookieService.set('data', data, 1,'/');
            if (data.carrierType.toLowerCase().includes(carrierName.toLowerCase()) && carrierName != "") {
                this.carrierType.next(carrierName);
                this.cookieService.set('chooseCarrier', carrierName, 1,'/');
                this.cookieService.set('currentCarrierType', carrierName, 1,'/');
            }
            else {
                this.carrierType.next(crType);
                this.cookieService.set('chooseCarrier', crType, 1,'/');
                this.cookieService.set('currentCarrierType', crType, 1,'/');
            }
        }

    }
    setNotificationFlag(param:any) {
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "notificationFlag=" + param+';path=/';
        } else {
            this.cookieService.set('notificationFlag', param, 1,'/');
        }
    }

    deleteNotificationFlag() {
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "notificationFlag="+';path=/';
        }
        else {
            this.cookieService.delete('notificationFlag');
        }
    }


    getCarrierType() {
        var chooseCarrier = localStorage.getItem('chooseCarrier');
        if (chooseCarrier) {
            var carrierName = chooseCarrier;
        } else {
            carrierName = "";
        }
        return carrierName
    }

    async setCookieAdmin(result:any, adminObjValue:any) {
        var carrierName = this.getCarrierType();
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            var adminObj = adminObjValue;
            var adminIdValue = adminObj.clientId + "ad" + adminObj.upsClientId + "ad" + adminObj.fedexClientId + "ad" + adminObj.ontracClientId + "ad" + adminObj.dhlClientId + "ad" + adminObj.uspsClientId;
            document.cookie = "adminName=" + adminObj.clientName+';path=/';
            document.cookie = "adminId=" + adminIdValue+';path=/';
            var data = result[0];
            document.cookie = "clientName=" + data.clientName+';path=/';
            document.cookie = "clientId=" + data.clientId+';path=/';
            var carrierType = data.carrierType;
            var carrierTypeVal = carrierType.toLowerCase();
            this.carrierTypeValue = data.carrierType;

            this.carrierTypevalue.next(this.carrierTypeValue);
            document.cookie = "carrierTypevalue=" + this.carrierTypeValue+';path=/';
            if (carrierTypeVal.includes(carrierName.toLowerCase()) && carrierName != "") { var crType = carrierName; } 
            else if (carrierTypeVal.includes("ups")) { crType = "UPS"; }
            else if (carrierTypeVal.includes("fedex")) { crType = "FedEx"; }
            else if (carrierTypeVal.includes("ontrac")) { crType = "OnTrac"; }
            else if (carrierTypeVal.includes("dhl")) { crType = "Dhl"; }
            else if (carrierTypeVal.includes("usps")) { crType = "USPS"; }
            else { crType = "UPS"; }
            document.cookie = "carrierType=" + crType+';path=/';
            document.cookie = "themeOption=" + data.theme_option+';path=/';

            document.cookie = "carrierName=" + carrierName+';path=/';
            document.cookie = "data=" + data+';path=/';

            if (data.carrierType.toLowerCase().includes(carrierName.toLowerCase()) && carrierName != "") {
                this.carrierType.next(carrierName);
                document.cookie = "chooseCarrier=" + carrierName+';path=/';
                document.cookie = "currentCarrierType=" + carrierName+';path=/';
            }

            else {
                this.carrierType.next(crType);
                document.cookie = "chooseCarrier=" + crType+';path=/';
                document.cookie = "currentCarrierType=" + crType+';path=/';
            }
        }
        else {
            var adminObj = adminObjValue;

            var adminIdValue = adminObj.clientId + "ad" + adminObj.upsClientId + "ad" + adminObj.fedexClientId + "ad" + adminObj.ontracClientId + "ad" + adminObj.dhlClientId + "ad" + adminObj.uspsClientId;
            this.cookieService.set('adminName', adminObj.clientName, 1,'/');
            this.cookieService.set('adminId', adminIdValue, 1,'/');
            var data = result[0];
            this.carrierTypeValue = data.carrierType;
            this.cookieService.set('clientName', data.clientName, 1,'/');
            this.cookieService.set('clientId', data.clientId, 1,'/');
            var carrierType = data.carrierType;
            var carrierTypeVal = carrierType.toLowerCase();

            this.carrierTypevalue.next(this.carrierTypeValue);
            document.cookie = "carrierTypevalue=" + this.carrierTypeValue+';path=/';
            document.cookie = "carrierName=" + carrierName+';path=/';
            document.cookie = "data=" + data+';path=/';
            if (carrierTypeVal.includes(carrierName.toLowerCase())) { var crType = carrierName; }
            else { crType = "UPS"; }
            this.cookieService.set('carrierType', crType, 1,'/');
            this.cookieService.set('themeOption', data.theme_option, 1,'/');

            if (data.carrierType.toLowerCase().includes(carrierName.toLowerCase())) {
                this.carrierType.next(carrierName);
                this.cookieService.set('chooseCarrier', carrierName, 1,'/');
                this.cookieService.set('currentCarrierType', carrierName, 1,'/');
            }
            else {
                this.carrierType.next(crType);
                this.cookieService.set('chooseCarrier', crType, 1,'/');
                this.cookieService.set('currentCarrierType', crType, 1,'/');
            }

        }
    }
    async getCookieAdmin(admin:any) {

        var clientCookie = await localStorage.getItem('adminId');
        var res = clientCookie.split("ad");
        if (admin == 'adminName') {
            var clientCookie = await localStorage.getItem('adminName');
        } else if (admin == 'adminId') {
            var clientCookie = res[0];
        } else if (admin == 'upsId') {
            var clientCookie = res[1];
        } else if (admin == 'fedexId') {
            var clientCookie = res[2];
        } else if (admin == 'ontracId') {
            var clientCookie = res[3];
        } else if (admin == 'dhlId') {
            var clientCookie = res[4];
        } else if (admin == 'uspsId') {
            var clientCookie = res[5];
        } else {
            var clientCookie = "";
        }
        var clientData = clientCookie;
        return clientData;
    }

    clickCarrierType(event:any) {

        this.carrierTypeVal = event;
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            var adminAccess = localStorage.getItem('adminId');
            if (adminAccess != "") {
                this.carrierType.next(this.carrierTypeVal);
                document.cookie = "chooseCarrier=" + event+';path=/';

            } else { 
                var carrierName = localStorage.getItem('carrierTypevalue');

                document.cookie = "carrierName=" + carrierName+';path=/';
                if (carrierName.toLowerCase().includes(this.carrierTypeVal.toLowerCase())) {
                    this.carrierType.next(this.carrierTypeVal);
                    document.cookie = "chooseCarrier=" + event+';path=/';
                }
                else if (carrierName.toLowerCase() == "ups") {
                    this.carrierType.next("UPS"); 
                }
                else if (carrierName.toLowerCase() == "fedex") {
                    this.carrierType.next("fedex"); 
                }
                else if (carrierName.toLowerCase() == "ontrac") {
                    this.carrierType.next("ontrac"); 
                }
                else if (carrierName.toLowerCase() == "dhl") {
                    this.carrierType.next("dhl");
                    // document.cookie="chooseCarrier="+event;
                }
                else if (carrierName.toLowerCase() == "usps") {
                    this.carrierType.next("usps"); 
                }
            }
        } else {
            var adminAccess = localStorage.getItem('adminId');
            if (adminAccess != "") {
                this.carrierType.next(this.carrierTypeVal);
                this.cookieService.set('chooseCarrier', event, 1,'/');
            } else {
                // var carrierName= localStorage.getItem('carrierType');
                var carrierName = localStorage.getItem('carrierTypevalue');
                if (carrierName.toLowerCase().includes(this.carrierTypeVal.toLowerCase())) {
                    this.carrierType.next(this.carrierTypeVal);
                    this.cookieService.set('chooseCarrier', event, 1,'/');
                }
                else if (carrierName.toLowerCase() == "UPS") {
                    this.carrierType.next("UPS");
                }
                else if (carrierName.toLowerCase() == "fedex") {
                    this.carrierType.next("fedex");
                }
                else if (carrierName.toLowerCase() == "ontrac") {
                    this.carrierType.next("ontrac");
                }
                else if (carrierName.toLowerCase() == "dhl") {
                    this.carrierType.next("dhl");
                }
                else if (carrierName.toLowerCase() == "usps") {
                    this.carrierType.next("usps");
                }
            }

        }
    }


    async getCookie(client:any) {
        if (client == 'clientId') {
            var clientCookie:any = await localStorage.getItem('clientId');
        } else if (client == 'clientName') {
             clientCookie = await localStorage.getItem('clientName');
        } else if (client == 'carrierType') {
             clientCookie = await localStorage.getItem('carrierType');
        } else if (client == 'themeOption') {
             clientCookie = await localStorage.getItem('themeOption');
        } else if (client == 'notificationFlag') {
             clientCookie = await localStorage.getItem('notificationFlag');
        }
        else if (client == 'chooseCarrier') {
             clientCookie = await localStorage.getItem('chooseCarrier');
        }
        else if (client == 'currentCarrierType') {
             clientCookie = await localStorage.getItem('currentCarrierType');
        }
        else if (client == 'carrierTypevalue') {
             clientCookie = await localStorage.getItem('carrierTypevalue');
        }
        else if (client == 'loginId') {
             clientCookie = await localStorage.getItem('loginId');
        }
        else if (client == 'emailId') {
             clientCookie = await localStorage.getItem('emailId');
        }

        var clientData = clientCookie;

        return clientData;
    }


    // deleteCookie() {
    //     var browserName = this.getBrowserName();
    //     if (browserName == "chrome" || browserName == "firefox") {
    //         document.cookie = "clientName=";
    //         document.cookie = "clientId=";
    //         document.cookie = "carrierType=";
    //         document.cookie = "chooseCarrier=";
    //         document.cookie = "themeOption=";
    //         document.cookie = "adminName=";
    //         document.cookie = "adminId=";
    //         document.cookie = "currentCarrierType=";
    //         document.cookie = "carrierTypevalue=";
    //         document.cookie = "carrierName=";
    //         document.cookie = "data=";
    //         document.cookie = "logindata=";
    //         document.cookie = "loginId=";
    //         document.cookie = "loginEmailId=";
    //         document.cookie = "loginCustomerType=";
    //         document.cookie = "notificationCountUPS=";
    //         document.cookie = "notificationCountFedEx=";
    //         document.cookie = "CRM_User_Type=";
    //         this.router.navigate(['/']);
    //         window.location.reload();
    //     }
    //     else {
    //         this.cookieService.delete('clientName');
    //         this.cookieService.delete('clientId');
    //         this.cookieService.delete('carrierType');
    //         this.cookieService.delete('chooseCarrier');
    //         this.cookieService.delete('themeOption');
    //         this.cookieService.delete('adminName');
    //         this.cookieService.delete('adminId');
    //         this.cookieService.delete('currentCarrierType');
    //         this.cookieService.delete('carrierTypevalue');
    //         this.cookieService.delete('carrierName');
    //         this.cookieService.delete('data');
    //         this.cookieService.delete('logindata');
    //         this.cookieService.delete('loginId');
    //         this.cookieService.delete('loginEmailId');
    //         this.cookieService.delete('loginCustomerType');
    //         this.cookieService.delete('notificationCountUPS');
    //         this.cookieService.delete('notificationCountFedEx');
    //         this.cookieService.delete('CRM_User_Type');
    //         this.router.navigate(['/']);
    //         window.location.reload();
    //     }
    // }
    deleteCookie(): void {
        const domain = window.location.hostname;
        this.cookieService.deleteAll('/', domain);
        this.cookieService.deleteAll('/'); // fallback
        this.router.navigate(['/']).then(() => {
            window.location.reload();
        });
    }
    auth(res: boolean) {

        return this.isLoggedin.next(res);
    }

    getLoginStatus(): Observable<any> {
        return this.isLoggedin.asObservable();
    }

    async checkForClientName() {
        const getClientName = await this.getCookie('clientName');
        if (getClientName == "") {
            this.router.navigate(['/']);
        }
        else {
        }/**/
        return;
    }

    async setLoginCredentialCookie(data: any) {
        var browserName = this.getBrowserName();
        var dataObj: any = {};
        dataObj['clientId'] = data.clientId;
        dataObj['clientName'] = data.clientName;
        dataObj['status'] = data.status;
        dataObj['carrierType'] = data.carrierType;
        dataObj['userName'] = data.userName;
        // dataObj['password'] = encodeURIComponent(data.password);
        dataObj['upsClientId'] = data.upsClientId;
        dataObj['fedexClientId'] = data.fedexClientId;
        dataObj['ontracClientId'] = data.ontracClientId;
        dataObj['dhlClientId'] = data.dhlClientId;
        dataObj['customerType'] = data.customerType;
        dataObj['crmAccountNumber'] = data.crmAccountNumber;
        dataObj['statusFedex'] = data.statusFedex;
        dataObj['statusOntrac'] = data.statusOntrac;
        dataObj['statusDhl'] = data.statusDhl;
        dataObj['uspsClientId'] = data.uspsClientId;
        dataObj['statusUsps'] = data.statusUsps;
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "logindata=" + JSON.stringify(dataObj)+';path=/';
        }
        else {
            this.cookieService.set('logindata', JSON.stringify(dataObj), 1,'/');
        }
    }

    async setLoginIdCookie(loginId:any) {
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "loginId=" + loginId+';path=/';
        }
        else {
            this.cookieService.set('loginId', loginId, 1,'/');
        }
    }

    setRememberMe(userName: string, password: string): void {
        const credentials = { userName, password };
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "rememberMe=" + JSON.stringify(credentials)+';path=/';
        }
        else {
            this.cookieService.set('rememberMe', JSON.stringify(credentials),1,'/');
        }
    }

    getRememberMe(): { userName: string; password: string } | null {
        const credentialsJson = localStorage.getItem('rememberMe');
        return credentialsJson ? JSON.parse(credentialsJson) : null;
    }

    clearRememberMe(): void {
        this.cookieService.delete('rememberMe');
    }

    // Store data
    public setCookieItem(key: string, value: any): void {
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "" + key + "=" + value+';path=/';
        }
        else {
            this.cookieService.set(key, value, 1,'/');
        }
    }

    // Retrieve data
    public getCookieItem(key: string): any {
        return localStorage.getItem(key);
    }

    // Remove data
    public removeCookieItem(key: string): void {
        var browserName = this.getBrowserName();
        if (browserName == "chrome" || browserName == "firefox") {
            document.cookie = "" + key + "="+';path=/';
        }
        else {
            this.cookieService.delete(key);
        }
    }

}