import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { MENU, MENUfedex, MENUontrac, MENUdhl, MENUusps } from './menu';
import { MenuItem } from './menu.model';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter } from 'rxjs';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { MatDialog } from '@angular/material/dialog';
import { CarrierAgreementNotificationComponent } from 'src/app/pages/UPS/carrier-agreement-savings/carrier-agrement-notification/carrier-agreement-savings.component';
import { CarrierAgreementSavingsComponent } from 'src/app/pages/UPS/carrier-agreement-savings/carrier-agreement-savings.component';
import { AuthAlertPopupComponent } from 'src/app/shared/auth-alert-popup/auth-alert-popup.component';
import { RevenueBandReviewComponent } from 'src/app/pages/UPS/revenue-band-review/revenue-band-review.component';
import { ContractAnalysisReviewComponent } from 'src/app/pages/UPS/contract-analysis-review/contract-analysis-review.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false
})
export class SidebarComponent implements OnInit {
  @ViewChild('sideMenu') sideMenu!: ElementRef;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  clientType = signal<any>('ups');
  clientProfileList: any;
  menu: any;
  toggle: any = true;
  menuItems: MenuItem[] = [];
  activeLink = '';
  userProfifleVal: any;
  adminFlag: boolean = false;
  notificationFlag: boolean = false;
  notificationCountUPS: number = 0;
  notificationCountFedEx: number = 0;
  isContractReview: boolean = false;
  isContractSummary: boolean = false;
  isGRI: boolean = false;
  totalcostVal: any;
  totalcostValFedex: any;
  totalcostValList: any;
  dialogValue: any;

  constructor(private router: Router, public translate: TranslateService, private sanitizer: DomSanitizer,
    private cookiesService: CookiesService, private commonService: CommonService, private httpClientService: HttpClientService,
    private httpfedexService: HttpfedexService, private dialog: MatDialog) {

    this.cookiesService.carrierType.subscribe((clienttype: any) => {
      this.clientType.set(clienttype.toLowerCase());
      this.updateMenuItems();
      this.validateCurrentRoute();
    });
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeLink = event.urlAfterRedirects;
    });
    this.getuserProfile();
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result[0];
        if (!this.adminFlag && this.notificationFlag) {
          if ((this.clientType().toUpperCase() == "UPS" && this.notificationCountUPS == 1) || (this.clientType().toUpperCase() == "FEDEX" && this.notificationCountFedEx == 1)) {
            this.openContractDetail();
          }
        }
        this.setDisplayContractReviewFlag();
        this.setContractSummaryFlag();
      });

  }

  // async setDisplayContractReviewFlag() {
  //   var contractreviewstatus;
  //   if (this.clientType().toUpperCase() == 'FEDEX') {
  //     contractreviewstatus = this.clientProfileList.contractReviewStatus;
  //   } else {
  //     contractreviewstatus = this.clientProfileList.contractreviewstatus;
  //   }
  //   if (contractreviewstatus == true) {
  //     this.isContractReview = true;
  //   }
  //   else {
  //     this.isContractReview = false;
  //   }
  // }
  async setDisplayContractReviewFlag() {
    let contractreviewstatus;

    // ✅ guard check (important)
    if (!this.clientProfileList) {
      console.error('clientProfileList is undefined');
      this.isContractReview = false;
      return;
    }

    if (this.clientType()?.toUpperCase() == 'FEDEX') {
      contractreviewstatus = this.clientProfileList?.contractReviewStatus;
    } else {
      contractreviewstatus = this.clientProfileList?.contractreviewstatus;
    }

    if (contractreviewstatus == true) {
      this.isContractReview = true;
    } else {
      this.isContractReview = false;
    }
  }

  // async setContractSummaryFlag() {
  //   var contractSummarystatus;
  //   if (this.clientType().toUpperCase() == 'FEDEX') {
  //     contractSummarystatus = this.clientProfileList.contractSummary;
  //   } else {
  //     contractSummarystatus = this.clientProfileList.contractSummary;
  //   }
  //   if (contractSummarystatus == true) {
  //     this.isContractSummary = true;
  //   }
  //   else {
  //     this.isContractSummary = false;
  //   }
  //   var griStatus;
  //   if (this.clientType().toUpperCase() == 'FEDEX') {
  //     griStatus = this.clientProfileList.griAnalysis;
  //   } else {
  //     griStatus = this.clientProfileList.griAnalysis;
  //   }
  //   if (griStatus == true) {
  //     this.isGRI = true;
  //   }
  //   else {
  //     this.isGRI = false;
  //   }
  // }
  async setContractSummaryFlag() {
    let contractSummarystatus;

    // ✅ guard check
    if (!this.clientProfileList) {
      console.error('clientProfileList is undefined');
      this.isContractSummary = false;
      this.isGRI = false;
      return;
    }

    if (this.clientType()?.toUpperCase() == 'FEDEX') {
      contractSummarystatus = this.clientProfileList?.contractSummary;
    } else {
      contractSummarystatus = this.clientProfileList?.contractSummary;
    }

    if (contractSummarystatus == true) {
      this.isContractSummary = true;
    } else {
      this.isContractSummary = false;
    }

    let griStatus;

    if (this.clientType()?.toUpperCase() == 'FEDEX') {
      griStatus = this.clientProfileList?.griAnalysis;
    } else {
      griStatus = this.clientProfileList?.griAnalysis;
    }

    if (griStatus == true) {
      this.isGRI = true;
    } else {
      this.isGRI = false;
    }
  }

  updateMenuItems(): void {
    switch (this.clientType()) {
      case 'fedex':
        this.menuItems = MENUfedex;
        break;
      case 'ontrac':
        this.menuItems = MENUontrac;
        break;
      case 'dhl':
        this.menuItems = MENUdhl;
        break;
      case 'usps':
        this.menuItems = MENUusps;
        break;
      default:
        this.menuItems = MENU;
    }
  }

  /**
   * Validates if the current route is available for the selected carrier.
   * If not, redirects to the dashboard.
   */
  validateCurrentRoute(): void {
    const currentUrl = this.router.url;
    let pathName = currentUrl.split('?')[0]; // Remove query params

    if (environment.production) {
      pathName = pathName.replace('/velzon/angular/master', '');
    }

    // Extract the action part (e.g., /ups/cost-optimization -> /cost-optimization)
    const carriers = ['ups', 'fedex', 'ontrac', 'dhl', 'usps'];
    let actionPath = pathName;
    for (const carrier of carriers) {
      if (pathName.startsWith('/' + carrier)) {
        actionPath = pathName.substring(carrier.length + 1);
        break;
      }
    }

    // Normalized actionPath (ensure leading slash)
    if (!actionPath.startsWith('/')) {
      actionPath = '/' + actionPath;
    }


    // Always allow dashboard, basic paths, and tracking
    if (actionPath === '/' || actionPath === '' || actionPath === '/dashboard' || actionPath === '/dashboard/dashboard' || actionPath === '/tracking') {
      return;
    }

    // Check if this actionPath exists in the current carrier's menu
    const found = this.findMenuItem(actionPath, this.menuItems);
    if (!found) {
      // If not found in menu, navigate to the carrier's dashboard
      this.router.navigate(['/' + this.clientType() + '/dashboard']);
    }
  }
  ngOnInit(): void {
    this.updateMenuItems();
    this.router.events.subscribe((event) => {
      if (document.documentElement.getAttribute('data-layout') != "twocolumn") {
        if (event instanceof NavigationEnd) {
          this.initActiveMenu();
        }
      }
    });
  }
  safeIcon(svg: any): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  isActive(item: any): boolean {
    return this.activeLink === item.link;
  }
  /***
   * Activate droup down set
   */
  ngAfterViewInit() {
    setTimeout(() => {
      this.initActiveMenu();
    }, 0);
  }

  removeActivation(items: any) {
    items.forEach((item: any) => {
      item.classList.remove("active");
    });
  }
  hoverTimeout: any = false;

  openSidebar() {
    const sidebar = document.querySelector('[data-sidebar-size]') as HTMLElement;
    if (!sidebar) return;
    const size = sidebar.getAttribute('data-sidebar-size');
    if (size !== 'lg') {
      this.hoverTimeout = true;
      sidebar.setAttribute('data-sidebar-size', 'lg');
      document.querySelector('.hamburger-icon')?.classList.add('open');
      this.mobileMenuButtonClicked.emit();
    }
  }

  closeSidebar() {
    if (this.hoverTimeout) {
      setTimeout(() => {
        this.hoverTimeout = false;
        const sidebar = document.querySelector('[data-sidebar-size]') as HTMLElement;
        sidebar.setAttribute('data-sidebar-size', 'sm');
        document.querySelector('.hamburger-icon')?.classList.remove('open');
        this.mobileMenuButtonClicked.emit();
      }, 200);
    }
  }
  toggleItem(item: any) {
    this.menuItems.forEach((menuItem: any) => {

      if (menuItem == item) {
        menuItem.isCollapsed = !menuItem.isCollapsed
      } else {
        menuItem.isCollapsed = true
      }
      if (menuItem.subItems) {
        menuItem.subItems.forEach((subItem: any) => {

          if (subItem == item) {
            menuItem.isCollapsed = !menuItem.isCollapsed
            subItem.isCollapsed = !subItem.isCollapsed
          } else {
            subItem.isCollapsed = true
          }
          if (subItem.subItems) {
            subItem.subItems.forEach((childitem: any) => {

              if (childitem == item) {
                childitem.isCollapsed = !childitem.isCollapsed
                subItem.isCollapsed = !subItem.isCollapsed
                menuItem.isCollapsed = !menuItem.isCollapsed
              } else {
                childitem.isCollapsed = true
              }
              if (childitem.subItems) {
                childitem.subItems.forEach((childrenitem: any) => {

                  if (childrenitem == item) {
                    childrenitem.isCollapsed = false
                    childitem.isCollapsed = false
                    subItem.isCollapsed = false
                    menuItem.isCollapsed = false
                  } else {
                    childrenitem.isCollapsed = true
                  }
                })
              }
            })
          }
        })
      }
    });
  }

  activateParentDropdown(item: any) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
        if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse")) {
          parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.closest(".collapse").previousElementSibling.classList.add("active");
        }
      }
      return false;
    }
    return false;
  }

  updateActive(event: any, item: any) {

    if (item?.label === 'Carrier Agreement Savings') {
      event.preventDefault();
      event.stopPropagation();
      this.openContractDetail();
      return;
    }
    if (item?.label === 'Edit Profile') {
      event.preventDefault();
      event.stopPropagation();
      this.goEditProfile();
      return;
    }
    if (item?.label === 'Revenue Band') {
      event.preventDefault();
      event.stopPropagation();
      this.goRevenueBand();
      return;
    }
    if (item?.label === 'Contract Analysis Review') {
      event.preventDefault();
      event.stopPropagation();
      this.goContractAnalysisReview();
      return;
    }

    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      this.removeActivation(items);
    }
    this.activateParentDropdown(event.target);
  }

  async goEditProfile() {
    var adminVal = await this.cookiesService.getCookieAdmin("adminName").then(
      result => {
        return result;
      });
    var loginCustomerType = this.cookiesService.getCookieItem('loginCustomerType');
    if (adminVal != "" && adminVal != undefined && loginCustomerType != "LJM_User" && loginCustomerType != "N") {
      this.openAuthModal();
      return;
    } else {
      this.router.navigate(['/settings/editprofile']);
    }
  }


  openAuthModal() {
    const dialogConfig = this.dialog.open(AuthAlertPopupComponent, {
      width: '470px',
      height: 'auto',
      disableClose: true,
      // panelClass: this.panelClass
    });
    dialogConfig.afterClosed().subscribe(result => {
      this.dialogValue = result.event;
      if (this.dialogValue == "true") {
        this.router.navigate(['/settings/editprofile']);
        return;
      } else {
        return;
      }
    });
  }

  initActiveMenu() {
    let pathName = window.location.pathname;
    // Check if the application is running in production
    if (environment.production) {
      // Modify pathName for production build
      pathName = pathName.replace('/velzon/angular/master', '');
    }

    const active = this.findMenuItem(pathName, this.menuItems)
    this.toggleItem(active)
    const ul = document.getElementById("navbar-nav");
    if (ul) {
      const items = Array.from(ul.querySelectorAll("a.nav-link"));
      let activeItems = items.filter((x: any) => x.classList.contains("active"));
      this.removeActivation(activeItems);

      let matchingMenuItem = items.find((x: any) => {
        if (environment.production) {
          let path = x.pathname
          path = path.replace('/velzon/angular/master', '');
          return path === pathName;
        } else {
          return x.pathname === pathName;
        }

      });
      if (matchingMenuItem) {
        this.activateParentDropdown(matchingMenuItem);
      }
    }
  }

  private findMenuItem(pathname: string, menuItems: any[]): any {
    for (const menuItem of menuItems) {
      if (menuItem.link) {
        // Normalize menu link for comparison
        const normalizedMenuLink = menuItem.link.startsWith('/') ? menuItem.link : '/' + menuItem.link;
        if (normalizedMenuLink === pathname) {
          return menuItem;
        }
      }

      if (menuItem.subItems) {
        const foundItem = this.findMenuItem(pathname, menuItem.subItems);
        if (foundItem) {
          return foundItem;
        }
      }
    }

    return null;
  }
  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    var sidebarsize = document.documentElement.getAttribute("data-sidebar-size");
    if (sidebarsize == 'sm-hover-active') {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover');

    } else {
      document.documentElement.setAttribute("data-sidebar-size", 'sm-hover-active')
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    document.body.classList.remove('vertical-sidebar-enable');
  }


  async openContractDetail() {
    if (this.clientProfileList.carrierType.toUpperCase().includes("UPS")) {
      if (this.clientType().toUpperCase() == "UPS") {

        if (this.clientProfileList.customertype != "LJM_User") {
          return;
        }
        else {
          if (this.clientProfileList.contractanalysisstatus != "Yes") {
            this.openContractPopUpNoSavings();

          }
          else {
            var clientId = this.clientProfileList.clientId;
            this.Sumofcontractsumary(clientId);

          }
        }
      } else if (this.clientType().toUpperCase().includes("FEDEX")) {
        if (this.clientProfileList.contractSavingFlag != "Y") {

          this.openContractPopUpNoSavings();

        }
        else {

          var clientId = this.clientProfileList.clientId;

          let clientobj: any = {}
          clientobj["clientId"] = this.clientProfileList.clientId;
          this.fetchSumofcontractsumary(clientobj);
        }
      }
    }
    else if (this.clientProfileList.carrierType.toUpperCase().includes("FEDEX")) {
      if (this.clientProfileList.contractSavingFlag != "Y") {
        this.openContractPopUpNoSavings();
      }
      else {

        var clientId = this.clientProfileList.clientId;
        let clientobj: any = {}
        clientobj["clientId"] = this.clientProfileList.clientId;
        this.fetchSumofcontractsumary(clientobj);
      }
    }

  }

  openContractPopUpNoSavings() {
    const dialogConfig = this.dialog.open(CarrierAgreementNotificationComponent, {
      width: '600px',
      height: 'auto',
      panelClass: 'notificationCls',
      data: {
        clientName: this.clientProfileList.clientName,
        clientId: this.clientProfileList.clientId,
        t001ClientProfile: this.clientProfileList
      }
    });
    dialogConfig.afterClosed().subscribe(result => {
      this.cookiesService.deleteNotificationFlag();
    });
  }

  Sumofcontractsumary(param: any) {
    this.httpClientService.Sumofcontractsumary(param).subscribe((res: any) => {

      if (res != null) {
        this.totalcostVal = res;
      }
      else {
        this.totalcostVal = '0';
      }

      this.openContractPopUp(this.totalcostVal);
    })
  }

  async openContractPopUp(param: any) {
    const dialogConfig = this.dialog.open(CarrierAgreementSavingsComponent, {
      width: '820px',
      height: 'auto',
      panelClass: 'notificationCls',
      data: {
        totalCostVal: param,
        clientId: this.clientProfileList.clientId,
        clientName: this.clientProfileList.clientName,
        carrierType: this.clientType
      },
    });
    dialogConfig.afterClosed().subscribe(result => {
      this.cookiesService.deleteNotificationFlag();
    });
  }

  fetchSumofcontractsumary(param: any) {
    this.totalcostValFedex = 0
    this.httpfedexService.fetchSumofcontractsumary(param).subscribe((res) => {
      if (res != null) {
        this.totalcostValList = res;
      }
      else {
        this.totalcostValList = '0';
      }
      for (let count = 0; count < this.totalcostValList.length; count++) {
        this.totalcostValFedex += Number(this.totalcostValList[count].qty)
      }
      this.openContractPopUp(this.totalcostValFedex);
    })
  }

  async goRevenueBand() {
    if (this.clientProfileList.carrierType.toUpperCase().includes("UPS")) {
      const dialogConfig = this.dialog.open(RevenueBandReviewComponent, {
        width: '100%',
        height: '100%',
      });
    }
  }

  async goContractAnalysisReview() {
    if (this.clientProfileList.carrierType.toUpperCase().includes("UPS")) {
      const dialogConfig = this.dialog.open(ContractAnalysisReviewComponent, {
        width: '100%',
        height: '100%',
      });
    }
  }

}
