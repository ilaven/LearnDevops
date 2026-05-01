import { AfterViewInit, ElementRef, Component, OnInit, OnDestroy, ViewChild, signal, ChangeDetectorRef, Optional } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { EditAccountNumberComponent } from './edit-account-number/edit-account-number.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';

@Component({
  selector: 'app-fedex-accountnumber',
  templateUrl: './accountnumber.component.html',
  styleUrls: ['./accountnumber.component.scss'],
  standalone: false
})
export class FedexAccountnumberComponent implements OnInit, AfterViewInit, OnDestroy {
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
  t002ClntObjFedEx: any = {};
  countryCodeList: any[] = [];
  originalSortOrders: any[] = [];
  private destroy$ = new Subject<void>();
  adminFlag: boolean = false;
  accountACFedEx: any;

  //from group

  constructor(
    private cookiesService: CookiesService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpfedexService: HttpfedexService,
    private commonService: CommonService, private cdr: ChangeDetectorRef, private datePipe: DatePipe,
    private router: Router,
    @Optional() public dialogRef: MatDialogRef<AlertPopupComponent>,
    private httpClientService: HttpClientService,
    private cd: ChangeDetectorRef) {

    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });
    this.funName = this.router.url.split('/')[2];
    if (this.clientType() == "USPS") {
      this.router.navigate(['/dashboard/dashboard']);
    }

  }

  ngOnInit(): void {
    this.openLoading();
    this.getUserFedex();
    this.getCountryCode();
    this.getCookieAdmin();
  }

  openLoading() {
    this.loaderService.show();
  }

  closeLoading() {
    this.loaderService.hide();
  }

  async getUserFedex() {
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = await this.userProfifleData[0];
    this.clientID = await this.userProfifle.clientId;
    this.crmAccountNumber = await this.userProfifle.crmAccountNumber;
    this.fetchaccountDetailsFedEx(this.clientID);


  }


  async fetchaccountDetailsFedEx(clientIdFedex: any) {
    let t002ClntObj: any = {};
    t002ClntObj["clientId"] = clientIdFedex;
    this.t002ClntObjFedEx['t002ClientProfile'] = t002ClntObj;
    try {
      const result = await firstValueFrom(
        this.httpfedexService.fetchaccountDetails(this.t002ClntObjFedEx)
      );
      this.accountACFedEx = result;
      if (!this.accountACFedEx || this.accountACFedEx.length === 0) {
        this.openModal(`No records found.`);
        this.closeLoading();
        return; // skip the rest of the processing
      }
      this.accountACFunction(result);
      this.closeLoading();
      this.cd.detectChanges();
    } catch (error) {
      console.error(error);
      this.closeLoading();
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

  async getCountryCode() {
    try {
      const res = await firstValueFrom(
        this.httpClientService.getCountryCode()
      );
      this.countryCodeList = res;

    } catch (error) {
      console.error(error);
    }
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
  excelDownloadClickHandler() {
    var clientName = this.userProfifle.clientName;
    var d = new Date();
    var currentDate = this.datePipe.transform(d, "MM-dd-yyyy_HH:mm:ss");
    var fileName = this.clientType() + '_' + clientName + '_AccountNumberReport_' + currentDate + ".xlsx";
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Account Listing', {
      views: [{ showGridLines: false }]
    });

    worksheet.properties.showGridLines = false;
    let columnIndex = 0;

    for (let row = 0; row < this.accountAC.length; row++) {
      columnIndex++;
      worksheet.getColumn(columnIndex).width = 15;
    }

    worksheet.addRow([]);
    let header = worksheet.addRow(["", "ACCOUNT NUMBER LISTING"]);
    header.eachCell((cell, cellNum) => {
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false, indent: 1 };
      if (cellNum != 1) {
        cell.font = { name: "Cambria", size: 18, bold: true, color: { argb: '4F81BD' } };
      }
    });
    var columnsHeader = []
    worksheet.addRow([]);
    if (this.clientType().toLowerCase() == 'fedex') {
      columnsHeader = ['ACCOUNT NUMBER', 'ACCOUNT NICKNAME', 'COMPANY NAME', 'ADDRESS LINE 1', 'ADDRESS LINE 2', 'CITY', 'STATE', 'COUNTRY', 'POSTAL', 'PRIMARY/ SECONDARY', 'START DATE'];
    } else {
      columnsHeader = ['ACCOUNT NUMBER', 'ACCOUNT NICKNAME', 'COMPANY NAME', 'ADDRESS LINE 1', 'ADDRESS LINE 2', 'CITY', 'STATE', 'COUNTRY', 'POSTAL', 'START DATE', 'END DATE'];
    }

    var indexArr: any = ['', '', '', '', '', ''];

    var headerTableArr = [];
    headerTableArr.push(columnsHeader);
    headerTableArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.height = 28.5;
      row.eachCell((cell, cellNum) => {
        var fgColorCode = 'B8CCE4';
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'd3e1ed' } };
        cell.border = { top: { style: 'thin', color: { argb: '8DB4E2' } } };
        cell.font = { family: 4, size: 10, bold: true, color: { argb: '595959' } };
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true, indent: 2 };
      });
    });

    let tableAirArr: any[] = [];
    let tempArr: any[] = [];
    if (this.accountAC.length > 0) {
      //for (let row=0; row< this.accountAC.length;row++)
      this.accountAC.forEach((account: any) => {
        account.addressDetailsList.forEach((address: any) => {
          if (this.clientType().toLowerCase() == 'fedex') {
            tempArr = [account.primaryAccountNumber, account.nickName == null ? '' : account.nickName, address.companyName, address.addressLine1, address.addressLine2, address.city, address.state, address.CountryName, address.zipCode, account.isPrimaryAccount, account.startDate == null ? '' : this.datePipe.transform(account.startDate, 'MM/dd/yyyy')]
          }
          else {
            tempArr = [account.accountNo, account.nickName == null ? '' : account.nickName, address.companyName, address.addressLine1, address.addressLine2, address.city, address.state, address.CountryName, address.zipCode, account.startDate == null ? '' : this.datePipe.transform(account.startDate, 'MM/dd/yyyy'), account.endDate == null ? '' : this.datePipe.transform(account.endDate, 'MM/dd/yyyy')]
          }
        })
        tableAirArr.push(tempArr);
      });
    }
    tableAirArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.eachCell((cell) => {
        cell.border = { bottom: { style: 'thin', color: { argb: 'D9D9D9' } }, left: { style: 'thin', color: { argb: 'D9D9D9' } }, right: { style: 'thin', color: { argb: 'D9D9D9' } } };
        cell.font = { family: 4, size: 10, bold: false, color: { argb: '595959' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      })
    });
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })
    this.closeLoading();
  }


  SortOrder_Update_ClickHandlerFedEx() {
    this.httpfedexService.insertOrUpdateAccountSortOrder(this.accountAC).subscribe({
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

  nickName_Add_AccountNumberFedEx(account: any) {
    const indexVal = this.accountAC.findIndex((object: any) => object.accountNumberId === account.accountNumberId);
    if (indexVal === -1) {

    } else {
      this.accountAC.forEach((element: any, index: any) => {
        if (element.accountNumberId == account.accountNumberId && element.primaryAccountNumber == account.primaryAccountNumber) {
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

  accountUpdate_ClickHandlerFedEx(rowObj: any, index: any) {
    var updateObj = {};
    updateObj = rowObj;
    this.httpfedexService.updateAccountNumber(updateObj).subscribe({
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

  openEditAccountPopup(address: any, accountIndex: number, addressIndex: number) {
    const dialogRef = this.dialog.open(EditAccountNumberComponent, {
      width: '900px',          // fixed width
      maxWidth: '95vw',
      panelClass: this.panelClass,
      data: { accountdata: address, indexdata: accountIndex, carrierName: this.clientType(), crmAccountNumber: this.crmAccountNumber }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.countryCode) {
          const selectedCountry = this.countryCodeList.find(
            (c: any) => c.CountryCode === parseInt(result.countryCode)
          );
          result["CountryName"] = selectedCountry?.CountryName || "";
        }
        this.accountAC[accountIndex].addressDetailsList[addressIndex] = (result);
        this.accountAC = [...this.accountAC];
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}