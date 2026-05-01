import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

type Carrier = 'UPS' | 'FedEx' | 'OnTrac' | 'Dhl' | 'USPS';

@Injectable({
    providedIn: 'root'
})
export class CookiesService {

    /* ----------------------------------
     * Subjects & State
     * ---------------------------------- */
    private isLoggedIn$ = new Subject<boolean>();
    carrierTypeValue: any = '';
    carrierType$ = new BehaviorSubject<string>('');
    carrierTypeValue$ = new BehaviorSubject<string>('');
    themeOption$ = new BehaviorSubject<string>('');
    private isLoggedin = new Subject<boolean>();
    carrierType: BehaviorSubject<string> = new BehaviorSubject('');
    carrierTypevalue: BehaviorSubject<string> = new BehaviorSubject('');
    themeOption: BehaviorSubject<string> = new BehaviorSubject('');
      arrierTypeValue: any = '';
    carrierTypeVal: any = '';
    themeOptionVal: any = '';
    constructor(
        private cookieService: CookieService,
        private router: Router
    ) {

        this.initState();
        this.carrierTypeVal = localStorage.getItem('chooseCarrier');
        this.themeOptionVal = localStorage.getItem('themeOption');
        this.carrierType.next(this.carrierTypeVal);
        this.themeOption.next(this.themeOptionVal);
        this.carrierTypevalue.next(this.carrierTypeValue); 
    }
clearRememberMe(): void {
  this.cookieService.delete('rememberMe');
}
    // async setLoginCredentialCookie(data: any): Promise<void> {
    //     const browserName = this.getBrowserName();
    //     const dataObj = {
    //         clientId: data.clientId,
    //         clientName: data.clientName,
    //         status: data.status,
    //         carrierType: data.carrierType,
    //         userName: data.userName,
    //         upsClientId: data.upsClientId,
    //         fedexClientId: data.fedexClientId,
    //         ontracClientId: data.ontracClientId,
    //         dhlClientId: data.dhlClientId,
    //         customerType: data.customerType,
    //         crmAccountNumber: data.crmAccountNumber,
    //         statusFedex: data.statusFedex,
    //         statusOntrac: data.statusOntrac,
    //         statusDhl: data.statusDhl,
    //         uspsClientId: data.uspsClientId,
    //         statusUsps: data.statusUsps
    //     };

    //     const cookieValue = JSON.stringify(dataObj);

    //     if (browserName === 'chrome' || browserName === 'firefox') {
    //         document.cookie = `logindata=${cookieValue}; path=/`;
    //     } else {
    //         this.cookieService.set('logindata', cookieValue, 1, '/');
    //     }
    // }
    // async getCookieAdmin(admin: any) {
    //     var clientCookie = await localStorage.getItem('adminId');
    //     var res = clientCookie.split("ad");
    //     if (admin == 'adminName') {
    //         var clientCookie = await localStorage.getItem('adminName');
    //     } else if (admin == 'adminId') {
    //         var clientCookie = res[0];
    //     } else if (admin == 'upsId') {
    //         var clientCookie = res[1];
    //     } else if (admin == 'fedexId') {
    //         var clientCookie = res[2];
    //     } else if (admin == 'ontracId') {
    //         var clientCookie = res[3];
    //     } else if (admin == 'dhlId') {
    //         var clientCookie = res[4];
    //     } else if (admin == 'uspsId') {
    //         var clientCookie = res[5];
    //     } else {
    //         var clientCookie = "";
    //     }
    //     var clientData = clientCookie;
    //     return clientData;
    // }
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
  async setCookietheme(data:any){ 
    localStorage.setItem('themeOption', data);
  }
    
    async setLoginCredentialCookie(data: any): Promise<void> {
        const dataObj = {
            clientId: data.clientId,
            clientName: data.clientName,
            status: data.status,
            carrierType: data.carrierType,
            userName: data.userName,
            upsClientId: data.upsClientId,
            fedexClientId: data.fedexClientId,
            ontracClientId: data.ontracClientId,
            dhlClientId: data.dhlClientId,
            customerType: data.customerType,
            crmAccountNumber: data.crmAccountNumber,
            statusFedex: data.statusFedex,
            statusOntrac: data.statusOntrac,
            statusDhl: data.statusDhl,
            uspsClientId: data.uspsClientId,
            statusUsps: data.statusUsps
        };

        localStorage.setItem('logindata', JSON.stringify(dataObj));
    }

    async getCookieAdmin(admin: any) {
        var clientCookie = localStorage.getItem('adminId') || '';
        var res = clientCookie.split("ad");
        if (admin == 'adminName') {
            clientCookie = localStorage.getItem('adminName') || '';
        } else if (admin == 'adminId') {
            clientCookie = res[0];
        } else if (admin == 'upsId') {
            clientCookie = res[1];
        } else if (admin == 'fedexId') {
            clientCookie = res[2];
        } else if (admin == 'ontracId') {
            clientCookie = res[3];
        } else if (admin == 'dhlId') {
            clientCookie = res[4];
        } else if (admin == 'uspsId') {
            clientCookie = res[5];
        } else {
            clientCookie = "";
        }
        return clientCookie;
    }

    setNotificationFlag(param: any) {
        localStorage.setItem('notificationFlag', param);
    }

    public setCookieItem(key: string, value: any): void {
        localStorage.setItem(key, value);
    }


    async setCookie(data: any): Promise<void> {
        const carrierName = this.getCarrierType();
        const adminAccess = localStorage.getItem('adminId');

        const carrierTypeVal = data.carrierType.toLowerCase();
        const crType = this.resolveCarrier(carrierTypeVal, data, adminAccess || '');

        this.carrierTypeValue = data.carrierType;
        this.carrierTypevalue.next(this.carrierTypeValue);

        localStorage.setItem('clientName', data.clientName);
        localStorage.setItem('clientId', data.clientId);
        localStorage.setItem('carrierTypevalue', this.carrierTypeValue);
        localStorage.setItem('carrierType', crType);

        if (!adminAccess) {
            localStorage.setItem('themeOption', data.theme_option);
        }

        localStorage.setItem('data', JSON.stringify(data));

        /* --- Start Update logindata --- */
        let loginData = localStorage.getItem('logindata');
        if (loginData) {
            try {
                let loginDataObj = JSON.parse(loginData);
                loginDataObj.clientId = data.clientId;
                loginDataObj.clientName = data.clientName;
                localStorage.setItem('logindata', JSON.stringify(loginDataObj));
            } catch (e) {
                console.error('Error updating logindata in setCookie', e);
            }
        }
        /* --- End Update logindata --- */

        const finalCarrier =
            carrierName &&
                data.carrierType.toLowerCase().includes(carrierName.toLowerCase())
                ? carrierName
                : crType;

        this.carrierType.next(finalCarrier);
        localStorage.setItem('chooseCarrier', finalCarrier);
        localStorage.setItem('currentCarrierType', finalCarrier);
    }

    private resolveCarrier(type: string, data: any, adminAccess: string): string {
        if (adminAccess) {
            if (type.includes('ups')) return 'UPS';
            if (type.includes('fedex')) return 'FedEx';
            if (type.includes('ontrac')) return 'OnTrac';
            if (type.includes('dhl')) return 'Dhl';
            if (type.includes('usps')) return 'USPS';
            return '';
        }

        if (type.includes('ups') && data.status?.toLowerCase() === 'active') return 'UPS';
        if (type.includes('fedex') && data.statusFedex?.toLowerCase() === 'active') return 'FedEx';
        if (type.includes('ontrac') && data.statusOntrac?.toLowerCase() === 'active') return 'OnTrac';
        if (type.includes('dhl') && data.statusDhl?.toLowerCase() === 'active') return 'Dhl';
        if (type.includes('usps') && data.statusUsps?.toLowerCase() === 'active') return 'USPS';

        return '';
    }

    private setChooseCarrier(value: string): void {
        localStorage.setItem('chooseCarrier', value);
        this.changeService(value.toLocaleLowerCase());
    }

    changeService(service: string) {
        const currentUrl = this.router.url;
        const updatedUrl = currentUrl.replace(/^\/[^\/]+/, `/${service}`);
        this.router.navigateByUrl(updatedUrl);
    }

    clickCarrierType(event: string): void {
        this.carrierTypeVal = event;

        const isAdmin = !!localStorage.getItem('adminId');
        const selectedCarrier = this.normalizeCarrier(event);

        if (isAdmin) {
            this.carrierType.next(selectedCarrier);
            this.setChooseCarrier(event);
            return;
        }

        const allowedCarrier = this.normalizeCarrier(
            localStorage.getItem('carrierTypevalue') || ''
        );

        if (allowedCarrier.includes(selectedCarrier)) {
            this.carrierType.next(selectedCarrier);
            this.setChooseCarrier(event);
            return;
        }

        this.carrierType.next(allowedCarrier);
    }

    async setCookieAdmin(result: any[], adminObj: any) {
        const carrierName = this.getCarrierType();
        const data = result[0];

        const adminIdValue =
            `${adminObj.clientId}ad${adminObj.upsClientId}ad${adminObj.fedexClientId}` +
            `ad${adminObj.ontracClientId}ad${adminObj.dhlClientId}ad${adminObj.uspsClientId}`;

        const carrierType = data.carrierType;

        this.carrierTypeValue = carrierType;
        this.carrierTypevalue.next(this.carrierTypeValue);

        const resolvedCarrier = carrierName ? carrierName : 'UPS';

        localStorage.setItem('adminName', adminObj.clientName);
        localStorage.setItem('adminId', adminIdValue);
        localStorage.setItem('clientName', data.clientName);
        localStorage.setItem('clientId', data.clientId);
        localStorage.setItem('carrierTypevalue', carrierType);
        localStorage.setItem('carrierType', resolvedCarrier);
        localStorage.setItem('themeOption', data.theme_option);
        localStorage.setItem('carrierName', carrierName);
        localStorage.setItem('data', JSON.stringify(data));

        this.carrierType.next(resolvedCarrier);
        localStorage.setItem('chooseCarrier', resolvedCarrier);
        localStorage.setItem('currentCarrierType', resolvedCarrier);
    }

    deleteCookie(): void {
        localStorage.clear();
        this.router.navigate(['/']).then(() => {
            window.location.reload();
        });
    }

    private initState(): void {
        this.carrierType$.next(this.getStorageValue('chooseCarrier'));
        this.carrierTypeValue$.next(this.getStorageValue('carrierTypevalue'));
        this.themeOption$.next(this.getStorageValue('themeOption'));
    }

    private getStorageValue(key: string): string {
        return localStorage.getItem(key) || '';
    }

    private normalizeCarrier(value: string) {
        return value.trim().toLowerCase() as any;
    }

    auth(status: boolean): void {
        this.isLoggedIn$.next(status);
    }

    getLoginStatus(): Observable<boolean> {
        return this.isLoggedIn$.asObservable();
    }

    getCarrierType(): string {
        return this.getStorageValue('chooseCarrier');
    }

    async getAdminValue(type: string): Promise<string> {
        const adminId = this.getStorageValue('adminId');
        const parts = adminId.split('ad');

        const map: any = {
            adminId: parts[0],
            upsId: parts[1],
            fedexId: parts[2],
            ontracId: parts[3],
            dhlId: parts[4],
            uspsId: parts[5],
            adminName: this.getStorageValue('adminName')
        };

        return map[type] ?? '';
    }

    async getCookie(key: string): Promise<string> {
        return this.getStorageValue(key);
    }

    deleteAllCookies(): void {
        this.deleteCookie();
    }

    async checkForClientName(): Promise<boolean> {
        const clientName = await this.getCookie('clientName');
        if (!clientName) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }

    setRememberMe(userName: string, password: string): void {
        const credentials = JSON.stringify({ userName, password });
        localStorage.setItem('rememberMe', credentials);
    }

    async setLoginIdCookie(loginId: string): Promise<void> {
        localStorage.setItem('loginId', loginId);
    }

    getRememberMe(): { userName: string; password: string } | null {
        const data = this.getStorageValue('rememberMe');
        return data ? JSON.parse(data) : null;
    }

    getCookieItem(key: string): string {
        return this.getStorageValue(key);
    }

    deleteNotificationFlag() {
        localStorage.removeItem('notificationFlag');
    }

    clearDuplicateCookies() {
        localStorage.removeItem('carrierType');
        localStorage.removeItem('carrierTypevalue');
        localStorage.removeItem('chooseCarrier');
        localStorage.removeItem('currentCarrierType');
    }
}
