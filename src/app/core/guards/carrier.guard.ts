import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class CarrierRedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const type = this.getClientType(); // ups / dhl / fedex...

    const target = route.routeConfig?.path; // dynamic path

    this.router.navigate([`/${type}/${target}`]);

    return false;
  }

  getClientType() {
    return 'ups'; // 🔁 replace with your actual logic
  }
}