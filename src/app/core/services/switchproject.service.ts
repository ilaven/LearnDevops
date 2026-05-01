import {
  Injectable
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject , BehaviorSubject, ReplaySubject} from 'rxjs';
import{
CookieService
} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})

export class SwitchProjectService {
  private readonly TRACKING_PAYLOAD_KEY = 'ljm_tracking_payload';

  commonArray: any[] = [];
  projectName: string = '';
  projNameSource: BehaviorSubject<string> = new BehaviorSubject(this.projectName);
  CommonSub: BehaviorSubject<any> = new BehaviorSubject(this.commonArray);
 

	constructor(private router:Router, private cookieService:CookieService){
     this.projectName=this.getItem('projName');
     this.projNameSource.next(this.projectName);
    }

switchToProj(projName:string){
if(projName=="fedex"){
this.router.navigate(['/fedex/dashboard']);
this.setItem(projName);

return "FedEx";  
}
else if(projName=="ontrac"){
	this.router.navigate(['/ontrac/dashboard']);
this.setItem(projName);
return "OnTrac";
  }

else if(projName=="dhl"){
  this.router.navigate(['/dhl/dashboard']);
this.setItem(projName);
return "Dhl";
  }
  else{
  this.router.navigate(['/ups/dashboard']);
this.setItem(projName);
return "ups";
  }
 }

 setItem(projName:string){
 	this.cookieService.set('projName',projName, 1,'/');
 }
  getItem(ProjNameKey:string):string{
    let locRes= localStorage.getItem(ProjNameKey);
if(locRes!=undefined)
{
  return locRes;
}
else{
return '';	
}
  }
  
  setCommonAc(): Observable<any> {
    return this.CommonSub.asObservable();
  }

  /** Persist the dashboard search payload across the navigation boundary. */
  setTrackingPayload(payload: any): void {
    try {
      sessionStorage.setItem(this.TRACKING_PAYLOAD_KEY, JSON.stringify(payload));
    } catch {
      // sessionStorage unavailable (e.g. private mode quota) — fall back silently
    }
  }

  /** Retrieve the persisted payload (returns null if absent). */
  getTrackingPayload(): any | null {
    try {
      const raw = sessionStorage.getItem(this.TRACKING_PAYLOAD_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /** Call this once the Tracking component has consumed the payload. */
  clearTrackingPayload(): void {
    sessionStorage.removeItem(this.TRACKING_PAYLOAD_KEY);
  }

}
