import { DatePipe } from '@angular/common';
import { AfterViewInit, ElementRef, Component, OnInit, signal, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { startWith, switchMap } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-ups-active-users-popup',
  templateUrl: './active-users-popup.component.html',
  styleUrls: ['./active-users-popup.component.scss'],
  standalone: false,
})
export class UpsActiveUsersPopupComponent implements OnInit, AfterViewInit {
  clientType = signal<any>('');

  @Input() text = 'Upload';
  @Input() param = 'file';
  @Input() target = 'https://file.io';
  @Input() accept = 'image/*';

  @Output() complete = new EventEmitter<string>();

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('fileUploadRef') fileUploadRef!: ElementRef<HTMLInputElement>;

  webUserDetailsformgroup = new UntypedFormGroup({
    clientNameSelected: new FormControl(''),
  });

  webUserDetailsFedexformgroup = new UntypedFormGroup({
    clientNameSelected: new FormControl(''),
  });

  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new FormControl(''),
    reportType: new FormControl(''),
    t001ClientProfile: new UntypedFormGroup({
      clientId: new FormControl(''),
    }),
    t002ClientProfileobj: new UntypedFormGroup({
      clientId: new FormControl(''),
    }),
  });

  loginId = 123;
  userProfile: any;
  resultactiveusersAC: any;
  datagrid_id: any[] = [];
  fileToUpload: File | null = null;
  private files: any[] = [];
  randomNumber: any;
  themeoption: any;
  panelClass: any;
  clientDetailsList: any[] = [];
  clientNameList: string[] = [];
  selectedRowObj: any = null;
  selectedRowIndex: number | null = null;

  constructor(
    private httpClientService: HttpClientService,
    private commonService: CommonService,
    private cookiesService: CookiesService,
    private httpfedexService: HttpfedexService,
    private datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private _cd: ChangeDetectorRef,
  ) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);

      if (this.clientType() === 'OnTrac' || this.clientType() === 'Dhl' || this.clientType() === 'USPS') {
        this.router.navigate(['/' + this.clientType().toLowerCase() + '/dashboard']);
      }
    });
    this.cookiesService.checkForClientName();
  }

  async ngOnInit(): Promise<void> {
    this.loaderService.show();

    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => res);

    this.initializeSearch();

    if (this.clientType().toUpperCase() === 'UPS') {
      this.module1_creationCompleteHandler();
    } else {
      this.module1_creationCompleteHandlerFedex();
    }


  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateTopScrollbarWidth();
    });
  }

  get sortedDatagrid(): any[] {
    return [...this.datagrid_id].sort((a: any, b: any) => {
      const statusA = (a?.status || '').toString().toUpperCase();
      const statusB = (b?.status || '').toString().toUpperCase();

      if (statusA < statusB) return -1;
      if (statusA > statusB) return 1;

      const inactiveA = Number(a?.noofdaysinactive ?? 0);
      const inactiveB = Number(b?.noofdaysinactive ?? 0);

      return inactiveA - inactiveB;
    });
  }

  initializeSearch(): void {
    this.webUserDetailsformgroup.get('clientNameSelected')?.valueChanges.pipe(startWith(''))
      .subscribe((value: any) => {
        if (this.clientType() === 'UPS') {
          this.filterClientDetailsList(value || '');
        }
      });

    this.webUserDetailsFedexformgroup.get('clientNameSelected')?.valueChanges.pipe(startWith(''))
      .subscribe((value: any) => {
        if (this.clientType() !== 'UPS') {
          this.filterClientDetailsList(value || '');
        }
      });
  }

  updateTopScrollbarWidth(): void {
    if (this.topScroll?.nativeElement && this.tableScroll?.nativeElement) {
      const tableWidth = this.tableScroll.nativeElement.scrollWidth;
      const child = this.topScroll.nativeElement.firstElementChild as HTMLElement | null;

      if (child) {
        child.style.width = `${tableWidth}px`;
      }
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

  clearSearch(): void {
    if (this.clientType() === 'UPS') {
      this.webUserDetailsformgroup.get('clientNameSelected')?.setValue('');
    } else {
      this.webUserDetailsFedexformgroup.get('clientNameSelected')?.setValue('');
    }
  }

  private filterClientDetailsList(value: string): void {
    const filterValue = (value || '').trim().toLowerCase();

    if (!filterValue) {
      this.datagrid_id = [...this.clientDetailsList];
      setTimeout(() => this.updateTopScrollbarWidth());
      return;
    }

    this.datagrid_id = this.clientDetailsList.filter((item: any) =>
      (item?.clientName || '').toLowerCase().includes(filterValue)
    );

    setTimeout(() => this.updateTopScrollbarWidth());
  }

  async module1_creationCompleteHandler(): Promise<void> {
    const t001ClientObj = {};

    this.httpClientService.fetchactiveClient(t001ClientObj).subscribe(
      (result: any) => {
        this.clientactiveuserResult(result);
      }, (error: any) => {
        this.loaderService.hide();
        console.log('error', error);
      });
  }

  clientactiveuserResult(result: any): void {
    this.resultactiveusersAC = result || [];

    const t001clientAC = this.resultactiveusersAC.filter((item: any) =>
      item?.status === 'ACTIVE' || item?.status === 'INACTIVE'
    );

    this.clientDetailsList = [...t001clientAC];
    this.getClientNameList(t001clientAC);
    this.datagrid_id = [...t001clientAC];
    this.loaderService.hide();
    setTimeout(() => { this.updateTopScrollbarWidth(); });
    this._cd.markForCheck();
  }

  getClientNameList(param: any[]): void {
    this.clientNameList = param.filter((item: any) => !!item?.clientName).map((item: any) => item.clientName);
    this._cd.markForCheck();
  }

  handleFileInput(files: FileList): void {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  uploadFileToActivity(): void { }

  image1_clickHandler(): void {
    if (this.datagrid_id.length === 0) {
      this.openModal('No Record found');
      return;
    }

    const t007_reportlogobj: any = {};
    const designFileName = 'User_Detail_Report';

    this.commonService.getUserprofileData().then(
      (result: any) => {
        this.userProfile = result[0];

        t007_reportlogobj['clientId'] = this.userProfile.clientId;
        t007_reportlogobj['year'] = '';
        t007_reportlogobj['fromDate'] = '2018-01-01';
        t007_reportlogobj['toDate'] = '2018-12-31';
        t007_reportlogobj['moduleName'] = 'activeuserpopup';
        t007_reportlogobj['login_id'] = this.loginId.toString();
        t007_reportlogobj['t001ClientProfile'] = this.userProfile;
        t007_reportlogobj['designFileName'] = designFileName;
        t007_reportlogobj['reportType'] = designFileName;
        t007_reportlogobj['reportName'] = 'User Detail Report';
        t007_reportlogobj['status'] = 'IN QUEUE';
        t007_reportlogobj['reportFormat'] = 'CSV';
        t007_reportlogobj['fzone'] = 0;
        t007_reportlogobj['tzone'] = 0;

        this.httpClientService.runReport(t007_reportlogobj).subscribe(
          (reportResult: any) => {
            this.saveOrUpdateReportLogResult(reportResult);
          }, (error: any) => {
            console.log('error', error);
          });
      }, (error: any) => { console.log('error', error); });
  }

  saveOrUpdateReportLogResult(result: any): void {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('reportType')?.setValue('User_Detail_Report');
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result?.t001ClientProfile?.clientId);

    this.commonService._setInterval(this.reportsFormGroup.value);

    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');
  }

  onClick(rowObj: any, index: number): void {
    this.selectedRowObj = rowObj;
    this.selectedRowIndex = index;

    if (this.fileUploadRef?.nativeElement) {
      this.fileUploadRef.nativeElement.value = '';
      this.fileUploadRef.nativeElement.click();
    }
  }

  onClickFedex(rowObj: any, index: number): void {
    this.selectedRowObj = rowObj;
    this.selectedRowIndex = index;

    if (this.fileUploadRef?.nativeElement) {
      this.fileUploadRef.nativeElement.value = '';
      this.fileUploadRef.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;

    if (!fileList || fileList.length === 0 || !this.selectedRowObj) {
      return;
    }

    this.files = [];
    for (let i = 0; i < fileList.length; i++) {
      this.files.push({ uploadData: fileList[i] });
    }

    if (this.clientType() === 'UPS') {
      this.uploadFiles(this.selectedRowObj, this.selectedRowIndex);
    } else {
      this.uploadFilesFedex(this.selectedRowObj, this.selectedRowIndex);
    }
  }

  uploadFiles(rowObj: any, index: any): void {
    rowObj['image'] = this.files.length ? this.files[0].uploadData : null;
    this.burri_clickHandler(rowObj, index);
  }

  uploadFilesFedex(rowObj: any, index: any): void {
    rowObj['image'] = this.files.length ? this.files[0].uploadData : null;
    this.burri_clickHandlerFedex(rowObj, index);
  }

  burri_clickHandler(rowObj: any, index: any): void {
    const saveOrUpdateGridClientListObj = { ...rowObj };

    this.httpClientService.saveOrUpdateGridClientList(saveOrUpdateGridClientListObj).subscribe(
      () => {
        this.module1_creationCompleteHandler();
        this.openModal('Customer Updated Successfully');
      }, (error: any) => {
        console.log('error', error);
      });
  }

  burri_clickHandlerFedex(rowObj: any, index: any): void {
    const saveOrUpdateGridClientListObj = { ...rowObj };

    this.httpfedexService.saveOrUpdateGridClientList(saveOrUpdateGridClientListObj).subscribe(
      () => {
        this.module1_creationCompleteHandlerFedex();
        this.openModal('Customer Updated Successfully');
      }, (error: any) => {
        console.log('error', error);
      });
  }

  toggleCompareAnalysisPopup(param: any): void {
    this.commonService.emitContractParam(param);
  }

  Reset_clickHandler(rowObj: any, index: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '350px',
      height:'auto',
      data: { message: 'Are you sure Reset?' },
      panelClass: this.panelClass,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.httpClientService.getIpCliente().pipe(
        switchMap((ipResult: any) => {
          const resetorUpdateClientObj = {
            ...rowObj,
            ipaddress: ipResult?.ip
          };
          return this.httpClientService.resetorUpdateClient(resetorUpdateClientObj);
        })
      ).subscribe({
        next: () => {
          this.loaderService.hide();
          this.module1_creationCompleteHandler();
          this.openModal('Customer Reset Successfully');
        },
        error: (error: any) => {
          this.loaderService.hide();
          console.log('error', error);
        }
      });
    });
  }

  Reset_clickHandlerFedex(rowObj: any, index: any): void {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: '350px',
      height:'auto',
      data: { message: 'Are you sure Reset?' },
      panelClass: this.panelClass,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      this.httpClientService.getIpCliente().pipe(
        switchMap((ipResult: any) => {
          const resetorUpdateClientObj = {
            ...rowObj,
            ipaddress: ipResult?.ip
          };
          return this.httpfedexService.ResetorUpdateClient(resetorUpdateClientObj);
        })
      ).subscribe({
        next: () => {
          this.loaderService.hide();
          this.module1_creationCompleteHandlerFedex();
          this.openModal('Customer Reset Successfully');
        },
        error: (error: any) => {
          this.loaderService.hide();
          console.log('error', error);
        }
      });
    });
  }

  module1_creationCompleteHandlerFedex(): void {
    const t001ClientObj = {};

    this.httpfedexService.fetchactiveClient(t001ClientObj).subscribe(
      (result: any) => {
        this.clientactiveuserResultFedex(result);
      }, (error: any) => {
        this.loaderService.hide();
        console.log('error', error);
      }
    );
  }

  clientactiveuserResultFedex(result: any): void {
    this.resultactiveusersAC = result || [];
    const t001clientAC: any[] = [];

    for (let count = 0; count < this.resultactiveusersAC.length; count++) {
      const t002clientObj = this.resultactiveusersAC[count];
      const inactivedays = Number(t002clientObj.noofdaysinactive);
      const logoStatus = Number(t002clientObj.logostatus);
      const activedays = Number(t002clientObj.noofdaystoactive) === 0 ? 121 : Number(t002clientObj.noofdaystoactive);

      t002clientObj.logostatus = logoStatus;
      t002clientObj.noofdaystoactive = activedays;
      t002clientObj.noofdaysinactive = inactivedays;

      if (t002clientObj.status === 'ACTIVE' || t002clientObj.status === 'INACTIVE') {
        t001clientAC.push(t002clientObj);
      }
    }

    for (let loop = 0; loop < t001clientAC.length; loop++) {
      const paramObj = t001clientAC[loop];

      if (paramObj['fileenddate1'] != null && paramObj['fileenddate1'].length >= 8) {
        const strYearEnd = paramObj['fileenddate1'].substring(0, 4);
        const strMonthEnd = paramObj['fileenddate1'].substring(4, 6);
        const strDateEnd = paramObj['fileenddate1'].substring(6, 8);
        paramObj['dataasof'] = `${strMonthEnd}/${strDateEnd}/${strYearEnd}`;
      }
    }

    this.clientDetailsList = [...t001clientAC];
    this.getClientNameList(t001clientAC);
    this.datagrid_id = [...t001clientAC];
    this.loaderService.hide();
    this._cd.markForCheck();
    setTimeout(() => { this.updateTopScrollbarWidth(); });
  }

  handleFileInputFedex(files: FileList): void {
    this.fileToUpload = files.item(0);
    this.uploadFileToActivity();
  }

  saveOrUpdateReportLogResultFedex(result: any): void {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result?.t002ClientProfileobj?.clientId);

    this.commonService._setInterval(this.reportsFormGroup.value);

    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');
  }

  ExportTOExcel(): void {
    const datagrid_idArr: any[] = [];

    if (this.sortedDatagrid.length === 0) {
      this.openModal('No Record found');
      return;
    }

    const today = new Date();
    const todayDate = this.datePipe.transform(today, 'yyyy-MM-dd-HH-mm-ss');
    const carrierLabel = this.clientType() === 'UPS' ? 'UPS' : 'FedEx';
    const fileName = `${carrierLabel}_User_Details_${todayDate}.xlsx`;

    for (let loop = 0; loop < this.sortedDatagrid.length; loop++) {
      const item = this.sortedDatagrid[loop];

      datagrid_idArr.push([
        item.clientName ?? '',
        item.crmAccountNumber ?? '',
        item.currentDate == null ? '' : this.datePipe.transform(item.currentDate, 'MM/dd/yyyy HH:mm'),
        carrierLabel,
        item.user_name ?? item.userName ?? '',
        item.password ?? '',
        item.dataasof ?? '',
        item.repname ?? item.repName ?? '',
        item.status ?? '',
        item.auditstatus ?? item.auditStatus ?? '',
        item.contractstatus ?? item.contractStatus ?? '',
        item.noofdaysinactive ?? '',
        item.noofdaystoactive ?? '',
      ]);
    }

    const datagrid_idHeaderArr = [
      'Client Name',
      'LJM Account Number',
      'Last Sign In Date',
      'Carrier',
      'User Name',
      'Password',
      'Data as of',
      'Rep Name',
      'Platform Status',
      'Audit Status',
      'Contract Status',
      'Days to Inactive',
      'Total Active days',
    ];

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('User Details');
    const titleRow = worksheet.addRow(['User Details']);

    titleRow.font = { family: 4, size: 15, bold: true };

    worksheet.addRow([]);
    const headerRow = worksheet.addRow(datagrid_idHeaderArr);
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
    datagrid_idArr.forEach((d) => {
      const row = worksheet.addRow(d);
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
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 22;
    worksheet.getColumn(4).width = 16;
    worksheet.getColumn(5).width = 16;
    worksheet.getColumn(6).width = 16;
    worksheet.getColumn(7).width = 16;
    worksheet.getColumn(8).width = 16;
    worksheet.getColumn(9).width = 18;
    worksheet.getColumn(10).width = 16;
    worksheet.getColumn(11).width = 16;
    worksheet.getColumn(12).width = 16;
    worksheet.getColumn(13).width = 16;

    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fileName);
    });
  }

  openModal(alertVal: string): void {
    this.panelClass = this.themeoption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';

    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass,
    });
  }
}