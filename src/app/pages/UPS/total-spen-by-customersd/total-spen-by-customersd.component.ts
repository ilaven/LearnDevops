import { CookiesService } from 'src/app/core/services/cookie.service';
import { AfterViewInit, ElementRef, Component, OnInit, signal, ViewChild } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthPopupComponent } from '../popup/auth-popup/auth-popup.component';

@Component({
  selector: 'app-ups-total-spen-by-customersd',
  templateUrl: './total-spen-by-customersd.component.html',
  styleUrls: ['./total-spen-by-customersd.component.scss'],
  standalone: false
})
export class UpsTotalSpenByCustomersdComponent implements OnInit, AfterViewInit {
  clientType = signal<string>('');
  dialogValue: any;
  panelClass: any;

  resultobj: any;
  selectYear: number[] = [];
  randomNumber: any;
  lastUpdatedDate: any;
  searchActive: boolean = false;

  userProfileData: any;
  userProfileDataUps: any;
  clientID: any;
  clientName: any;
  themeoption: any;
  isLoading: boolean = false;
  categoryYearACList: any[] = [];

  totalSpendbyCustomerformGroup = new UntypedFormGroup({
    year: new FormControl(''),
    clientId: new FormControl(''),
    downloadReport: new FormControl('')
  });

  fedexFormGroup = new UntypedFormGroup({
    chargeDescription: new FormControl(''),
    avgYear: new FormControl(''),
    clientName: new FormControl(''),
    t002ClientProfile: new FormGroup({
      totYear: new FormControl('')
    })
  });

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  constructor(
    private httpfedexService: HttpfedexService,
    private httpClientService: HttpClientService,
    private router: Router,
    private cookiesService: CookiesService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    this.cookiesService.carrierType.subscribe((clienttype: string) => {
      this.clientType.set(clienttype);

      // If these client types should not access this page, redirect them
      if (clienttype === 'FedEx' || clienttype === 'OnTrac' || clienttype === 'Dhl' || clienttype === 'USPS') {
        this.router.navigate(['/' + this.clientType().toLowerCase() + '/dashboard']);
      }
    });
    this.cookiesService.checkForClientName();
  }

  ngOnInit(): void {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openAuthModal();
  }

  ngAfterViewInit() {
    if (this.tableScroll?.nativeElement && this.topScroll?.nativeElement?.firstElementChild) {
      const tableWidth = this.tableScroll.nativeElement.scrollWidth;
      this.topScroll.nativeElement.firstElementChild.setAttribute(
        'style',
        `width:${tableWidth}px`
      );
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
  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }

  fetchcategory() {
    this.httpClientService.fetchcategory(this.totalSpendbyCustomerformGroup.value).subscribe(
      (result: any) => {
        this.categoryYearACList = result;

        if (!this.categoryYearACList || this.categoryYearACList.length === 0) {
          this.openModal('No Record Found');
          return;
        }

        this.lastUpdatedDate = this.datePipe.transform(result[0].updatedate, 'MM-dd-yyyy');
        this.categoryYearACList = result;
        this.resultDataFormatter(this.categoryYearACList);
      }, (error: any) => {
        console.log(' error ', error);
      }
    );
  }

  openModal(alertVal: any) {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  async openAuthModal() {
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => res);

    if (this.themeoption === 'dark') {
      this.panelClass = 'page-dark';
    } else {
      this.panelClass = 'custom-dialog-panel-class';
    }

    const dialogConfig = this.dialog.open(AuthPopupComponent, {
      width: '470px',
      height: 'auto',
      disableClose: true,
      panelClass: this.panelClass
    });

    dialogConfig.afterClosed().subscribe((result: any) => {
      if (!result) {
        this.router.navigate(['/' + this.clientType().toLowerCase() + '/dashboard']);
        return;
      }

      this.dialogValue = result.event;

      if (this.dialogValue === 'true') {
        const currentYear = new Date().getFullYear();
        const stYear = currentYear - 3;
        this.selectYear = [];

        for (let yearloop = stYear; yearloop <= currentYear; yearloop++) {
          this.selectYear.push(yearloop);
        }

        if (this.clientType() === 'FedEx') {
          this.fedexFormGroup.patchValue({
            chargeDescription: 'Ground',
            avgYear: '2019',
            clientName: 'All',
            t002ClientProfile: {
              totYear: '2019'
            }
          });
        } else {
          this.getUser();
        }
      } else {
        this.router.navigate(['/' + this.clientType().toLowerCase() + '/dashboard']);
      }
    });
  }

  supervisorclientpassword() {
    this.httpClientService.supervisorclientpassword(this.totalSpendbyCustomerformGroup.value).subscribe(
      (result: any) => {
        this.resultobj = result;
      }, (error: any) => {
        console.log(' error ', error);
      }
    );
  }

  fedexFetchCategory() {
    this.httpfedexService.fedexFetchCategory(this.fedexFormGroup.value).subscribe(
      (result: any) => {
        this.resultobj = result;
      }, (error: any) => {
        console.log(' error', error);
      }
    );
  }

  clickSearchFun(event: string) {
    this.searchActive = event === 'open';
  }

  async getUser() {
    this.userProfileData = await this.commonService.getUserprofileData();
    this.userProfileDataUps = this.userProfileData[0];

    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => res);

    const yearData = new Date().getFullYear();
    this.totalSpendbyCustomerformGroup.get('year')?.setValue(yearData);

    // set clientId if available from profile
    if (this.userProfileDataUps?.clientId) {
      this.totalSpendbyCustomerformGroup.get('clientId')?.setValue(this.userProfileDataUps.clientId);
    }

    this.fetchcategory();
  }

  cmb_year_changeHandler() {
    this.fetchcategory();
  }

  resultDataFormatter(resultParam: any) {
    const paramList = resultParam;

    for (let loop = 0; loop < paramList.length; loop++) {
      const paramObj = paramList[loop];
      paramObj['net_amount'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['net_amount']));
      paramObj['packagequantity'] = this.setCommaQty(paramObj['packagequantity']);
      paramObj['gsr'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['gsr']));
      paramObj['voids'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['voids']));
      paramObj['cadj'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['cadj']));
      paramObj['creditCardSurcharge'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['creditCardSurcharge']));
      paramObj['declarevalue'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['declarevalue']));
      paramObj['declarevaluediscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['declarevaluediscount'])) + '%';
      paramObj['chargebacks'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['chargebacks']));
      paramObj['scc'] = '$' + this.setCommaQty(this.set2dpforPercentage(paramObj['scc']));
      paramObj['weightdifference'] = this.setCommaQty(Number(paramObj['weightdifference'] || 0).toFixed(2));
      paramObj['residentialadjustmentnetamount'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['residentialadjustmentnetamount']));
      paramObj['residentialadjustmentcount'] = this.setCommaQty(paramObj['residentialadjustmentcount']);
      paramObj['residentialsurchargenetamount'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['residentialsurchargenetamount']));
      paramObj['residentialsurchargecount'] = this.setCommaQty(paramObj['residentialsurchargecount']);
      paramObj['residentialsurchargediscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['residentialsurchargediscount'])) + '%';
      paramObj['addresscorrection'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['addresscorrection']));
      paramObj['addresscorrectiondiscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['addresscorrectiondiscount'])) + '%';
      paramObj['imp'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['imp']));
      paramObj['impdiscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['impdiscount'])) + '%';
      paramObj['rts_RT'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['rts_RT']));
      paramObj['dwpickup'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['dwpickup']));
      paramObj['latepaymentfee'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['latepaymentfee']));
      paramObj['additionalhandling'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['additionalhandling']));
      paramObj['additionalhandlingdiscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['additionalhandlingdiscount'])) + '%';
      paramObj['largepackagesurcharge'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['largepackagesurcharge']));
      paramObj['largepackagesurchargediscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['largepackagesurchargediscount'])) + '%';
      paramObj['overmax'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['overmax']));
      paramObj['overmaxdiscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['overmaxdiscount'])) + '%';
      paramObj['das'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['das']));
      paramObj['dasdiscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['dasdiscount'])) + '%';
      paramObj['specialpickup'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['specialpickup']));
      paramObj['asd'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['asd']));
      paramObj['fuelSurcharge'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['fuelSurcharge']));
      paramObj['missingPLDFee'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['missingPLDFee']));
      paramObj['peakSurcharge'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['peakSurcharge']));
      paramObj['peakSurchargeDiscount'] = this.setCommaQty(this.set2dpforPercentage(paramObj['peakSurchargeDiscount'])) + '%';
      paramObj['sccAuditFee'] = '$' + this.setCommaQty(this.set2dpforPrice(paramObj['sccAuditFee']));
    }
  }

  setCommaQty(eve: any) {
    return eve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  set2dpforPrice(value_price: any) {
    if (
      value_price == null ||
      value_price === '.' ||
      value_price === '' ||
      value_price === 'null' ||
      value_price === '0'
    ) {
      return '0.00';
    }

    const num = parseFloat(value_price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }

  set2dpforPercentage(value_price: any) {
    if (
      value_price == null ||
      value_price === '.' ||
      value_price === '' ||
      value_price === 'null' ||
      value_price === '0.00' ||
      value_price === 0 ||
      value_price === 0.0
    ) {
      return '0.00';
    }

    const num = parseFloat(value_price);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  }
}