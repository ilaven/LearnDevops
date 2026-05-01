import { AfterViewInit, ElementRef, Component, OnInit, OnDestroy, ViewChild, signal, ChangeDetectorRef, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';

@Component({
  selector: 'app-ontrac-accountnumber',
  templateUrl: './accountnumber.component.html',
  styleUrls: ['./accountnumber.component.scss'],
  standalone: false
})
export class OnTracAccountnumberComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  //variable Declaration
  clientType = signal<any>('');
  funName: any;
  accountAC: any;
  planAC: any;
  userProfifle: any;
  clientID: any;
  userProfifleData: any;
  planNumber: any;
  accountNumber: any;
  panelClass: any;
  nickName: string = "";
  isLoading: boolean = false;
  crmAccountNumber: any;
  t002ClntObjUps: any = {};
  countryCodeList: any[] = [];
  originalSortOrders: any[] = [];
  private destroy$ = new Subject<void>();
  adminFlag: boolean = false;

  //from group

  constructor(
    private cookiesService: CookiesService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpOntracService: HttpOntracService,
    private commonService: CommonService, private cdr: ChangeDetectorRef, private datePipe: DatePipe,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<AlertPopupComponent>
    , private cd: ChangeDetectorRef) {

    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });
    this.funName = this.router.url.split('/')[2];
    if (this.clientType() == "USPS") {
      this.router.navigate(['/dashboard/dashboard']);
    }

  }

  ngOnInit(): void {
    this.getUserOnTrac();
    this.getCookieAdmin();
  }

  openLoading() {
    this.loaderService.show();
  }

  closeLoading() {
    this.loaderService.hide();
  }

  async getUserOnTrac() {
    const userProfileData = await this.commonService.getUserprofileData();

    this.userProfifle = userProfileData[0];
    this.clientID = this.userProfifle.clientId;
    this.crmAccountNumber = this.userProfifle.crmAccountNumber;
    await this.fetchOnTracAccountDetails(this.clientID);

  }


  async fetchOnTracAccountDetails(clientIdUps: any) {
    const t002ClntObj: any = {
      clientId: clientIdUps
    };
    this.t002ClntObjUps['t001ClientProfile'] = t002ClntObj;
    try {
      const result = await firstValueFrom(
        this.httpOntracService.fetchaccountDetails(this.t002ClntObjUps)
      );
      this.accountAC = result;
      if (!this.accountAC || this.accountAC.length === 0) {
        this.openModal(`No records found.`);
        return; // skip the rest of the processing
      }
      this.accountACFunction(result);
      this.cd.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }

  accountACFunction(result: any) {
    this.accountAC = result;

    if (this.clientType().toLowerCase() === "fedex" || this.clientType().toLowerCase() === 'ups') {

      const addressTemplate = {
        accountAddressDetailsId: '',
        accountId: "",
        ljmClientName: "",
        crmAccountNumber: "",
        comments: "",
        carrierType: "",
        accountNumber: "",
        companyName: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        countryCode: "",
        confirmedByClient: null,
        confirmedByClientDate: null,
        inactive: "",
        updatedBy: "",
        createdBy: "",
        updatedTs: "",
        createdTs: "",
      };

      for (let account of this.accountAC) {

        if (!account.addressDetailsList || account.addressDetailsList.length === 0) {
          account.addressDetailsList = [{ ...addressTemplate }];
        }

        for (let address of account.addressDetailsList) {

          if (!address.accountId) {
            address.accountId = "0";
          }

          if (!address.accountNumber) {
            address.accountNumber =
              this.clientType().toLowerCase() === "fedex"
                ? account.primaryAccountNumber
                : account.accountNo;
          }

          if (address.countryCode) {
            const selectedCountry = this.countryCodeList.find(
              (c: any) => c.CountryCode === parseInt(address.countryCode)
            );
            address["CountryName"] = selectedCountry?.CountryName || "";
          } else {
            address["CountryName"] = "";
          }
        }
      }
    }

    this.originalSortOrders = JSON.parse(JSON.stringify(this.accountAC));
    this.cd.detectChanges();
  }


  getCookieAdmin() {
    const adminAccess: any = this.cookiesService.getCookieAdmin('adminId');
    const loginCustomerType: any = this.cookiesService.getCookieItem('loginCustomerType');

    this.adminFlag =
      adminAccess !== "" &&
      loginCustomerType !== "LJM_User" &&
      loginCustomerType !== "N";
  }

  // UI -Logic 
  SortOrder_Update_ClickHandlerOnTrac() {
    this.httpOntracService.insertOrUpdateAccountSortOrder(this.accountAC).subscribe({
      next: (result: any) => {
        if (result == true)
          this.openModal("Sort Order Updated Successfully");
        else
          this.openModal("Something went wrong. Try again later.");
      }, error: (error: any) => {
        console.log(error);
        this.openModal("Something went wrong. Try again later.");
      }
    });
  }

  nickName_Add_AccountNumber(account: any) {
    const indexVal = this.accountAC.findIndex((object: any) => object.accountId === account.accountId);
    if (indexVal === -1) {
    } else {
      this.accountAC.forEach((element: any, index: any) => {
        if (element.accountId == account.accountId && element.accountNo == account.accountNo) {
          this.accountAC[index].nickName = account.nickName;
        }
      });
    }
  }

  openModal(alertVal: unknown): void {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

    this.dialogRef.close({ event: 'true' });
  }

  accountUpdate_ClickHandlerOnTrac(rowObj: any, index: any) {
    var updateObj = {};
    updateObj = rowObj;
    this.httpOntracService.updateAccountNumber(updateObj).subscribe({
      next: (result: any) => {
        this.openModal("Updated Successfully");

      }, error: (error: any) => {
        console.log(error);
        this.openModal("Something went wrong. Try again later.");
      }
    });
  }

  onSortOrderFocusOut(newValue: any, index: number): void {
    const parsedValue = parseInt(newValue, 10);
    if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= this.accountAC.length) {
      const prevIndex = parsedValue - 1;
      // ---- accountAC update ----
      const updatedAccountAC = [...this.accountAC];
      const [movedItem] = updatedAccountAC.splice(index, 1);
      updatedAccountAC.splice(prevIndex, 0, movedItem);
      updatedAccountAC.forEach((acc: any, i: number) => {
        acc.sortOrder = i + 1;
      });
      this.accountAC = updatedAccountAC;
      // ---- originalSortOrders update ----
      const updatedOriginal = [...this.originalSortOrders];
      const [movedOriginal] = updatedOriginal.splice(index, 1);
      updatedOriginal.splice(prevIndex, 0, movedOriginal);
      updatedOriginal.forEach((acc: any, i: number) => {
        acc.sortOrder = i + 1;
      });
      this.originalSortOrders = updatedOriginal;
    } else {
      this.openModal("Sort Order should be between 1 and " + this.accountAC.length);
      this.accountAC[index].sortOrder =
        this.originalSortOrders[index].sortOrder;
    }
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // Sync scrollbar width dynamically
    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    this.topScroll.nativeElement.firstElementChild!.setAttribute(
      'style',
      `width:${tableWidth}px`
    );
    this.cd.detectChanges();
  }

  // Move row one position up
  moveUp(index: number) {
    if (index > 0) {
      const temp = this.accountAC[index];
      this.accountAC[index] = this.accountAC[index - 1];
      this.accountAC[index - 1] = temp;
      this.accountAC[index].sortOrder = index + 1;
      this.accountAC[index - 1].sortOrder = index;
      const tempSortOrder = this.originalSortOrders[index];
      this.originalSortOrders[index] = this.originalSortOrders[index - 1];
      this.originalSortOrders[index - 1] = tempSortOrder;
      this.originalSortOrders[index].sortOrder = index + 1;
      this.originalSortOrders[index - 1].sortOrder = index;
      this.accountAC = [...this.accountAC];
      this.originalSortOrders = [...this.originalSortOrders];
    }
  }

  moveDown(index: number) {
    if (index < this.accountAC.length - 1) {
      const temp = this.accountAC[index];
      this.accountAC[index] = this.accountAC[index + 1];
      this.accountAC[index + 1] = temp;
      this.accountAC[index].sortOrder = index + 1;
      this.accountAC[index + 1].sortOrder = index + 2;
      const tempSortOrder = this.originalSortOrders[index];
      this.originalSortOrders[index] = this.originalSortOrders[index + 1];
      this.originalSortOrders[index + 1] = tempSortOrder;
      this.originalSortOrders[index].sortOrder = index + 1;
      this.originalSortOrders[index + 1].sortOrder = index + 2;
      this.accountAC = [...this.accountAC];
      this.originalSortOrders = [...this.originalSortOrders];
    }
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}