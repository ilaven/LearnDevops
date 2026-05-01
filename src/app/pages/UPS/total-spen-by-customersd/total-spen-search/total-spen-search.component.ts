import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild, signal, HostListener } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { EventService } from 'src/app/core/services/event.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { Router } from '@angular/router';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-total-spen-search',
  templateUrl: './total-spen-search.component.html',
  styleUrls: ['./total-spen-search.component.scss'],
  standalone: false
})

/**
 * Right Sidebar component
 */
export class TotalSpenSearchComponent implements OnInit {
  clientType = signal<string>('');
  attribute: any;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();
  selectedReport: string = '';
  selectYear: number[] = [];
  userProfileData: any;
  userProfileDataUps: any;

  categoryYearACList: any[] = [];
  totalSpendbyCustomerformGroup = new UntypedFormGroup({
    year: new FormControl(''),
    clientId: new FormControl(''),
    downloadReport: new FormControl('')
  });
  themeoption: any;
  showColumnPicker = false;
  toggleColumnPicker() {
    this.showColumnPicker = !this.showColumnPicker;
  }
  closeColumnPicker() {
    this.showColumnPicker = false;
  }
  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent) {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('.more_btn_drop')) return;
    this.closeColumnPicker();
  }

  constructor(private eventService: EventService, private offcanvasService: NgbOffcanvas, private store: Store<RootReducerState>, private loaderService: LoaderService,
    private dialog: MatDialog, private datePipe: DatePipe, private cookiesService: CookiesService, private router: Router, private httpfedexService: HttpfedexService,
    private httpClientService: HttpClientService, private commonService: CommonService
  ) {
    this.cookiesService.carrierType.subscribe((clienttype: string) => {
      this.clientType.set(clienttype);

      // If these client types should not access this page, redirect them
      if (clienttype === 'FedEx' || clienttype === 'OnTrac' || clienttype === 'Dhl' || clienttype === 'USPS') {
        this.router.navigate(['/' + this.clientType().toLowerCase() + '/dashboard']);
      }
    });
  }

  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }
  async ngOnInit(): Promise<void> {
    this.loaderService.show();
    const currentYear = new Date().getFullYear();
    const stYear = currentYear - 3;
    this.selectYear = [];

    for (let yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }
    this.userProfileData = await this.commonService.getUserprofileData();
    this.userProfileDataUps = this.userProfileData[0];

    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    var yearData = await new Date().getFullYear();
    await this.totalSpendbyCustomerformGroup.get('year')?.setValue(yearData);
    this.demoloader()
  }

  ngAfterViewInit() { }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
  }

  panelClass: any;
  openModal(alertVal: any) {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
  ExportTOExcel() {
    let averageDiscountDataArr: any[] = [];

    if (!this.categoryYearACList || this.categoryYearACList.length === 0) {
      this.openModal('No Record found');
      return;
    }

    this.openModal(
      'Your request has been added to the report queue. When complete, your file will be downloaded automatically.'
    );

    const today = new Date();
    const todayDate = this.datePipe.transform(today, 'yyyy-MM-dd-HH-mm-ss');
    const fileName = this.clientType() + '_Total_Spendby_Customers' + todayDate + '.xlsx';
    const averageDiscountArr: any[] = [];

    for (let loop = 0; loop < this.categoryYearACList.length; loop++) {
      averageDiscountDataArr = [];
      averageDiscountDataArr.push(
        this.categoryYearACList[loop].clientName,
        this.categoryYearACList[loop].crmAccountNumber,
        Number(this.categoryYearACList[loop].year),
        this.categoryYearACList[loop].quarter,
        Number(this.categoryYearACList[loop].net_amount.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].packagequantity.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].asd.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].gsr.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].voids.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].cadj.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].creditCardSurcharge.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].chargebacks.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].scc.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].sccAuditFee.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].weightdifference.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].fuelSurcharge.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].addresscorrection.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].addresscorrectiondiscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].rts_RT.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].dwpickup.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].latepaymentfee.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].missingPLDFee.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].additionalhandling.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].additionalhandlingdiscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].largepackagesurcharge.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].largepackagesurchargediscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].overmax.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].overmaxdiscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].peakSurcharge.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].peakSurchargeDiscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].residentialadjustmentnetamount.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].residentialadjustmentcount.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].residentialsurchargenetamount.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].residentialsurchargediscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].das.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].dasdiscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100,
        Number(this.categoryYearACList[loop].declarevalue.replace('$', '').replace(/[,]/g, '').replace('%', '')),
        Number(this.categoryYearACList[loop].declarevaluediscount.replace('$', '').replace(/[,]/g, '').replace('%', '')) / 100
      );

      averageDiscountArr.push(averageDiscountDataArr);
    }

    const averageDiscountHeaderArr: any[] = [];
    averageDiscountHeaderArr.push(
      'Client Name', 'LJM Account Number', 'Year', 'Quarter', 'Net Charge', 'Package Count',
      'ASD', 'GSR', 'Voids', 'CADJ', 'Payment Processing Fee', 'Charge Back', 'SCC', 'SCC Audit Fee',
      'SCC Weight Difference', 'Fuel Surcharge', 'Address Correction', 'Address Correction Discount',
      'Undeliverable Returns', 'Service Charge', 'Late Payment', 'Missing PLD Fee', 'Additional Handling',
      'Additional Handling Discount', 'Large Package', 'Large Package Discount', 'Over Max', 'Over Max Discount',
      'Peak Surcharge', 'Peak Surcharge Discount', 'Residential Adjustment', 'Residential Adjustment Count',
      'Residential Surcharge', 'Residential Surcharge Discount', 'DAS & DAS Extended',
      'DAS & DAS Extended Discount', 'Declared Value', 'Declare Discount'
    );

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Total Spend By Customers');

    const headerRow = worksheet.addRow(averageDiscountHeaderArr);
    headerRow.font = { family: 4, size: 12, bold: true };

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    let count = 1;
    averageDiscountArr.forEach((d) => {
      const row = worksheet.addRow(d);
      row.eachCell((cell) => {
        if (count % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'd0e3ff' }
          };
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      count++;
    });

    worksheet.getColumn(5).numFmt = '$#,##0.00';
    worksheet.getColumn(6).numFmt = '#,##0';
    worksheet.getColumn(7).numFmt = '$#,##0.00';
    worksheet.getColumn(8).numFmt = '$#,##0.00';
    worksheet.getColumn(9).numFmt = '$#,##0.00';
    worksheet.getColumn(10).numFmt = '$#,##0.00';
    worksheet.getColumn(11).numFmt = '$#,##0.00';
    worksheet.getColumn(12).numFmt = '$#,##0.00';
    worksheet.getColumn(13).numFmt = '$#,##0.00';
    worksheet.getColumn(14).numFmt = '$#,##0.00';
    worksheet.getColumn(15).numFmt = '#,##0.00';
    worksheet.getColumn(16).numFmt = '$#,##0.00';
    worksheet.getColumn(17).numFmt = '$#,##0.00';
    worksheet.getColumn(18).numFmt = '0.00%';
    worksheet.getColumn(19).numFmt = '$#,##0.00';
    worksheet.getColumn(20).numFmt = '$#,##0.00';
    worksheet.getColumn(21).numFmt = '$#,##0.00';
    worksheet.getColumn(22).numFmt = '$#,##0.00';
    worksheet.getColumn(23).numFmt = '$#,##0.00';
    worksheet.getColumn(24).numFmt = '0.00%';
    worksheet.getColumn(25).numFmt = '$#,##0.00';
    worksheet.getColumn(26).numFmt = '0.00%';
    worksheet.getColumn(27).numFmt = '$#,##0.00';
    worksheet.getColumn(28).numFmt = '0.00%';
    worksheet.getColumn(29).numFmt = '$#,##0.00';
    worksheet.getColumn(30).numFmt = '0.00%';
    worksheet.getColumn(31).numFmt = '$#,##0.00';
    worksheet.getColumn(32).numFmt = '#,##0';
    worksheet.getColumn(33).numFmt = '$#,##0.00';
    worksheet.getColumn(34).numFmt = '0.00%';
    worksheet.getColumn(35).numFmt = '$#,##0.00';
    worksheet.getColumn(36).numFmt = '0.00%';
    worksheet.getColumn(37).numFmt = '$#,##0.00';
    worksheet.getColumn(38).numFmt = '0.00%';

    worksheet.getColumn(1).width = 28;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 14;
    worksheet.getColumn(4).width = 14;
    worksheet.getColumn(5).width = 14;
    worksheet.getColumn(6).width = 16;
    worksheet.getColumn(7).width = 14;
    worksheet.getColumn(8).width = 14;
    worksheet.getColumn(9).width = 14;
    worksheet.getColumn(10).width = 14;
    worksheet.getColumn(11).width = 18;
    worksheet.getColumn(12).width = 14;
    worksheet.getColumn(13).width = 14;
    worksheet.getColumn(14).width = 14;
    worksheet.getColumn(15).width = 22;
    worksheet.getColumn(16).width = 14;
    worksheet.getColumn(17).width = 18;
    worksheet.getColumn(18).width = 27;
    worksheet.getColumn(19).width = 21;
    worksheet.getColumn(20).width = 14;
    worksheet.getColumn(21).width = 14;
    worksheet.getColumn(22).width = 16;
    worksheet.getColumn(23).width = 19;
    worksheet.getColumn(24).width = 27;
    worksheet.getColumn(25).width = 17;
    worksheet.getColumn(26).width = 23;
    worksheet.getColumn(27).width = 13;
    worksheet.getColumn(28).width = 19;
    worksheet.getColumn(29).width = 16;
    worksheet.getColumn(30).width = 24;
    worksheet.getColumn(31).width = 25;
    worksheet.getColumn(32).width = 28;
    worksheet.getColumn(33).width = 21;
    worksheet.getColumn(34).width = 29;
    worksheet.getColumn(35).width = 22;
    worksheet.getColumn(36).width = 29;
    worksheet.getColumn(37).width = 18;
    worksheet.getColumn(38).width = 17;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, fileName);
    });
  }

  cmb_year_changeHandler() {
    this.fetchcategory();
  }
  lastUpdatedDate: any;
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
      },
      (error: any) => {
        console.log(' error ', error);
      }
    );
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
