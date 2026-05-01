import { DatePipe } from '@angular/common';
import { AfterViewInit, ElementRef, Component, OnInit, ViewChild, signal } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-ups-user-log-popup',
  templateUrl: './user-log-popup.component.html',
  styleUrls: ['./user-log-popup.component.scss'],
  standalone: false,
})
export class UpsUserLogPopupComponent implements OnInit, AfterViewInit {
  clientType = signal<any>('');
  currentDate = new Date();
  from_date: any;
  to_date: any;
  datagrid_id: any[] = [];
  randomNumber: any;

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  constructor(
    private cookiesService: CookiesService,
    private loaderService: LoaderService,
    public datepipe: DatePipe,
    private httpClientService: HttpClientService,
    private dialog: MatDialog,
    private commonService: CommonService
  ) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });
    this.cookiesService.checkForClientName();
  }

  ngOnInit(): void {
    this.loaderService.show();

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.from_date = this.datepipe.transform(this.currentDate, 'yyyy-MM-01');
    this.to_date = this.datepipe.transform(this.currentDate, 'yyyy-MM-dd');
    this.module1_creationCompleteHandler();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateTopScrollbarWidth();
    }, 0);
  }

  updateTopScrollbarWidth(): void {
    if (!this.topScroll?.nativeElement || !this.tableScroll?.nativeElement) {
      return;
    }

    const table = this.tableScroll.nativeElement.querySelector('table') as HTMLElement | null;
    const firstChild = this.topScroll.nativeElement.firstElementChild as HTMLElement | null;

    if (table && firstChild) {
      firstChild.style.width = `${table.scrollWidth}px`;
    }
  }

  syncScroll(event: Event, source: 'top' | 'table'): void {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;

    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  demoloader(): void {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  async ExportTOExcel(): Promise<void> {
    if (this.datagrid_id.length === 0) {
      this.openModal('No Record found');
      return;
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('User Log');

    const titleRow = worksheet.addRow(['User Login Duration']);
    titleRow.font = { family: 4, size: 15, bold: true };

    worksheet.addRow([]);

    const headerRow = worksheet.addRow([
      'Client Name',
      'CRM Account Number',
      'Account Owner Name',
      'User Name',
      'LogIn Time',
      'Logout Time',
      'Duration (HH:MM:SS)',
      'IP Address',
      'Region',
      'Country',
    ]);

    headerRow.font = { family: 4, size: 12, bold: true };

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'D3D3D3' },
        bgColor: { argb: 'D3D3D3' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let count = 1;

    this.datagrid_id.forEach((item: any) => {
      const row = worksheet.addRow([
        item.loginclientName ?? '',
        item.crmAccountNumber == null
          ? ''
          : String(item.crmAccountNumber).padStart(5, '0'),
        item.accountOwnerName ?? '',
        item.username ?? '',
        item.loginDateTimeinFormat ?? '',
        item.logoutDateTimeinFormat ?? '',
        item.duration ?? '',
        item.ipaddress ?? '',
        item.region ?? '',
        item.country ?? '',
      ]);

      row.eachCell((cell) => {
        if (count % 2 === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D0E3FF' },
          };
        }

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      count++;
    });

    worksheet.getColumn(1).width = 25;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 25;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 22;
    worksheet.getColumn(6).width = 22;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 18;
    worksheet.getColumn(9).width = 18;
    worksheet.getColumn(10).width = 18;

    worksheet.addRow([]);

    const today = new Date();
    const todayDate = this.datepipe.transform(today, 'yyyy-MM-dd-HH-mm-ss');
    const fileName = `User_Log_${todayDate}.xlsx`;

    const data = await workbook.xlsx.writeBuffer();
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    fs.saveAs(blob, fileName);
  }

  toggleCompareAnalysisPopup(param: any): void {
    this.commonService.emitContractParam(param);
  }

  private isDateRangeValid(): boolean {
    if (!this.from_date || !this.to_date) {
      return true;
    }

    const fromDate = new Date(this.from_date);
    const toDate = new Date(this.to_date);

    if (fromDate > toDate) {
      this.openModal('From date should not be greater than To date');
      return false;
    }

    return true;
  }

  module1_creationCompleteHandler(): void {
    const t100_loginObj: any = {};

    if (!this.isDateRangeValid()) {
      this.demoloader();
      return;
    }

    if (this.from_date) {
      t100_loginObj['fromDate'] = this.from_date;
    }

    if (this.to_date) {
      t100_loginObj['toDate'] = this.to_date;
    }

    this.httpClientService.fetchUserLogin(t100_loginObj).subscribe(
      (result: any) => {
        this.fetchUserLoginResult(result);
      }, (error) => { this.demoloader(); console.log(error); }
    );
  }

  openModal(alertVal: any): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
    });
  }

  fetchUserLoginResult(result: any): void {
    const logingUsersAC = result || [];

    if (!logingUsersAC || logingUsersAC.length === 0) {
      this.datagrid_id = [];
      this.demoloader();
      this.openModal('No Record found');
      return;
    }

    const t100loginAC: any[] = [];

    for (let count = 0; count < logingUsersAC.length; count++) {
      const t100_loginObj: any = { ...logingUsersAC[count] };

      let duration = '-';
      let logoutDateTimeinFormat: any = '-';

      if (t100_loginObj.logoutDateTime != null) {
        duration = this.duaration(
          t100_loginObj.loginDateTime,
          t100_loginObj.logoutDateTime
        );

        logoutDateTimeinFormat = this.datepipe.transform(
          t100_loginObj.logoutDateTime,
          'MM-dd-yyyy HH:mm:ss'
        );
      }

      const loginDateTimeinFormat = this.datepipe.transform(
        t100_loginObj.loginDateTime,
        'MM-dd-yyyy HH:mm:ss'
      );

      t100_loginObj['duration'] = duration;
      t100_loginObj['loginDateTimeinFormat'] = loginDateTimeinFormat;
      t100_loginObj['logoutDateTimeinFormat'] = logoutDateTimeinFormat;

      t100loginAC.push(t100_loginObj);
    }

    this.datagrid_id = t100loginAC;
    this.demoloader();
    setTimeout(() => {
      this.updateTopScrollbarWidth();
    }, 0);
  }

  duaration(startDate: any, endDate: any): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const milisecondsDiff = end.getTime() - start.getTime();

    return (
      Math.floor(milisecondsDiff / (1000 * 60 * 60)).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }) +
      ':' +
      (Math.floor(milisecondsDiff / (1000 * 60)) % 60).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      }) +
      ':' +
      (Math.floor(milisecondsDiff / 1000) % 60).toLocaleString(undefined, {
        minimumIntegerDigits: 2,
      })
    );
  }

  btn_download_clickHandler(): void {
    const t100_loginObj: any = {};

    if (!this.isDateRangeValid()) {
      return;
    }

    if (this.from_date) {
      t100_loginObj['fromDate'] = this.datepipe.transform(this.from_date, 'yyyy-MM-dd');
    }

    if (this.to_date) {
      t100_loginObj['toDate'] = this.datepipe.transform(this.to_date, 'yyyy-MM-dd');
    }

    this.httpClientService.fetchUserLogin(t100_loginObj).subscribe(
      (result: any) => {
        this.fetchUserLoginResult(result);
      }, (error) => { console.log(error); });
  }
}