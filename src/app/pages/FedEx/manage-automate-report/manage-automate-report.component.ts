import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AutomateClientdetailsPopupComponent } from '../manage-automate-report/automate-clientdetails-popup/automate-clientdetails-popup.component';
import { AutomateReportAddComponent } from '../manage-automate-report/report-add-popup/report-add.component';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

interface AutomateReportItem {
  reportAutomationId?: number | string;
  clientName?: string;
  reportName?: string;
  accountNumber?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-manage-automate-report',
  templateUrl: './manage-automate-report.component.html',
  styleUrls: ['./manage-automate-report.component.scss'],
  standalone: false
})
export class ManageAutomateReportComponent implements OnInit {
  clientList: any = [];
  clientListFedex: any = [];
  clientDropDownLst: any = [];
  datagridList: any = [];
  acClient: any = [];
  clientACcAC: any = [];

  t002clientAccAC: any = [];
  clientObj: any = null;
  reportItems1: any = null;
  clientDetailsPop: any;

  isLoading = false;
  clientType: string = '';
  themeoption: string = '';
  panelClass: string = 'custom-dialog-panel-class';
  FilterReports: string = '';
  btnEdit: string = 'No';
  randomNumber: number = 0;

  options: string[] = [];
  filteredOptions?: Observable<string[]>;

  t002ClntObj: any = {};
  t002clAccNoDetObj: any = {};

  manageClientFormGroup = new UntypedFormGroup({
    clientName: new UntypedFormControl(''),
    clientNameSelected: new UntypedFormControl(''),
    accountNumber: new UntypedFormControl(''),
  });

  constructor(private httpfedexService: HttpfedexService, private cookiesService: CookiesService,
    private dialog: MatDialog, private router: Router, private commonService: CommonService
  ) {
    this.cookiesService.checkForClientName();
    this.cookiesService.carrierType.subscribe((clienttype: string) => {
      this.clientType = clienttype;
      if (this.clientType !== 'FedEx') {
        this.router.navigate(['/dashboard/dashboard']);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => res);
    this.panelClass = this.themeoption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';
    this.loadAutomateDetails();
  }

  openLoading(): void {
    this.isLoading = true;
  }

  closeLoading(): void {
    this.isLoading = false;
  }

  loadAutomateDetails(): void {
    const param = {};
    this.fetchAutomateDetails(param);
  }

  fetchAutomateDetails(param: any): void {
    this.openLoading();
    this.options = [];
    this.httpfedexService.fetchAutomateReportDetails(param).subscribe({
      next: (result: AutomateReportItem[]) => {
        this.clientList = Array.isArray(result) ? result : [];
        this.clientListFedex = [...this.clientList];
        this.clientDropDownLst = [...this.clientList];

        this.options = this.clientList
          .filter((item: any) => !!item?.clientName)
          .map((item: any) => item.clientName as string);

        this.filteredOptions = this.manageClientFormGroup
          .get('clientNameSelected')
          ?.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
          );
        this.closeLoading();
      }, error: (error: any) => {
        this.closeLoading();
      },
    });
  }

  private _filter(value: string | null): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.options.filter((option: string) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  fetchManageaccountDetails(param: any): void {
    this.openLoading();
    this.httpfedexService.fetchAutomateReportDetails(param).subscribe({
      next: (result: AutomateReportItem[]) => {
        this.t002clientAccAC = Array.isArray(result) ? result : [];
        this.openAccDetailsDialog(this.t002clientAccAC);
        this.closeLoading();
      },
      error: (error: any) => {
        this.closeLoading();
      },
    });
  }

  toggleCompareAnalysisPopup(param: any): void {
    this.commonService.emitContractParam(param);
  }

  fetchclientSingleRes(event: AutomateReportItem[]): void {
    this.acClient = event || [];
    if (this.acClient.length !== 0) {
      this.datagridList = [...this.acClient];
    }
  }

  reset_id_clickHandler(): void {
    this.manageClientFormGroup.get('clientNameSelected')?.setValue('');
    this.manageClientFormGroup.get('accountNumber')?.setValue('');
    this.clientListFedex = [...this.clientList];
  }

  datagrid_id_doubleClickHandler(event: AutomateReportItem): void {
    this.clientObj = event;
    if (this.clientObj) {
      const t002ClntObj: any = {};
      t002ClntObj['reportAutomationId'] = this.clientObj.reportAutomationId;
      this.openAccDetailsDialog(this.clientObj);
    }
  }

  FilterReports_changeHandler(event: any): void {
    const filterValue = (this.FilterReports || '').trim().toUpperCase();
    if (filterValue) {
      this.clientListFedex = this.clientList.filter((item: any) =>
        item?.reportName?.toUpperCase().includes(filterValue)
      );
    } else {
      this.clientListFedex = [...this.clientList];
    }
  }

  openReportAdd(): void {
    this.btnEdit = 'No';
    const dialogRef = this.dialog.open(AutomateReportAddComponent, {
      width: '60%',
      height: '570px',
      panelClass: this.panelClass,
      data: {
        t001ClientProfile: this.clientObj,
        panelClass: this.panelClass,
        clienttype: this.clientType,
        btnEdit: this.btnEdit,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAutomateDetails();
    });
  }

  openReportAutomationEdit(datagrid_iditem: AutomateReportItem): void {
    this.btnEdit = 'yes';
    this.reportItems1 = datagrid_iditem;

    const dialogRef = this.dialog.open(AutomateReportAddComponent, {
      width: '60%',
      height: '550px',
      panelClass: this.panelClass,
      data: {
        pageValue: this.reportItems1,
        panelClass: this.panelClass,
        clienttype: this.clientType,
        btnEdit: this.btnEdit,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAutomateDetails();
    });
  }

  openAccDetailsDialog(t002clientAccAC: AutomateReportItem | AutomateReportItem[]): void {
    const dialogRef = this.dialog.open(AutomateClientdetailsPopupComponent, {
      width: '60%',
      height: '550px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        t002clientAccACVal: t002clientAccAC,
        panelClass: this.panelClass,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadAutomateDetails();
    });
  }

  openModal(alertVal: any): void {
    this.dialog.open(AlertPopupComponent, {
      width: '420px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass,
    });
  }
}