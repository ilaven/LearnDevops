import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { RecipientsdetailsPopupComponent } from '../../manage-automate-report/recipients-add/recipients-add.component';
import { ReportStatusPopupComponent } from '../../manage-automate-report/report-status/report-status.component';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

interface ClientItem {
  clientId?: number | string;
  clientName?: string;
  [key: string]: any;
}

interface ReportClientDetail {
  detailId?: number | string;
  reportAutomationId?: number | string;
  reportName?: string;
  clientName?: string;
  clientid?: number | string;
  accountNo?: string;
  trigger?: string;
  status?: string;
  statusReport?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-automate-clientdetails-popup.component',
  templateUrl: './automate-clientdetails-popup.component.html',
  standalone: false
})
export class AutomateClientdetailsPopupComponent implements OnInit {
  t002ClientAc: ReportClientDetail | null = null;

  clientId: any;
  adminId: any;
  panelClass: string = '';
  isLoading = false;
  click = false;

  reportItems: ReportClientDetail | null = null;
  reportAutomationId: number | string | null = null;
  detailId: number | string | null = null;

  clientList: ClientItem[] = [];
  clientListFedex: ClientItem[] = [];
  clientDropDownLst: ClientItem[] = [];
  options: string[] = [];
  filteredOptions?: Observable<string[]>;

  accountAC: any[] = [];
  gridObjList: any[] = [];
  tempAC: any[] = [];
  t002ClientDumAc: any[] = [];
  cmb_primaryAcc: any[] = [];
  t002ClientAccAC: any[] = [];

  lbl_title: string = '';
  loadFlag: string = '';
  t002ClntObj: any = {};
  t002clientProObj: any = {};
  t002clAccNoDetObj: any = {};

  showAddBtn = true;
  showUpdateBtn = false;
  showEditProfileBtn = false;
  showpriamryAccTxt = true;
  showEditPrimaryAccTxt: any;
  showSecondaryAccTxt: any;
  cmb_primaryAccVal: any;
  flag: any;
  showPrimaryDropDown = true;
  t002ClientSelectObj: any;
  clientDetailsPop: any;

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  @ViewChild('allSelectedValue') private allSelectedValue!: MatOption;
  @ViewChild('accNoSel') private accNoSel!: MatSelect;

  clientAccDetailsFormGroup = new UntypedFormGroup({
    clientNameSelected: new UntypedFormControl(''),
    primaryAccSelected: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    clientId: new UntypedFormControl(''),
    accNoSelected: new UntypedFormControl([]),
    addprimaryaccount: new UntypedFormControl(''),
    editprimaryaccount: new UntypedFormControl(''),
    editsecondaryaccount: new UntypedFormControl(''),
    Timebasis: new UntypedFormControl(''),
    status: new UntypedFormControl('Active'),
    showEditPrimaryAccTxt: new UntypedFormControl(''),
    t002ClientProfile: new UntypedFormGroup({
      clientId: new UntypedFormControl(''),
      clientName: new UntypedFormControl(''),
      userName: new UntypedFormControl(''),
      password: new UntypedFormControl(''),
      siteUserName: new UntypedFormControl(''),
      sitePassword: new UntypedFormControl(''),
      address: new UntypedFormControl(''),
      contactNo: new UntypedFormControl(''),
      comments: new UntypedFormControl(''),
      endDate: new UntypedFormControl(''),
      startDate: new UntypedFormControl(''),
      status: new UntypedFormControl(''),
      auditStatus: new UntypedFormControl(''),
      contractStatus: new UntypedFormControl(''),
      email: new UntypedFormControl(''),
      userLogo: new UntypedFormControl(''),
      customerType: new UntypedFormControl(''),
      dataSource: new UntypedFormControl(''),
      dataLoadedBy: new UntypedFormControl(''),
      filestartdate: new UntypedFormControl(''),
      fileenddate: new UntypedFormControl(''),
      dateasof: new UntypedFormControl(''),
      currentDate: new UntypedFormControl(''),
      currentYear: new UntypedFormControl(''),
      currentMonth: new UntypedFormControl(''),
      startYear: new UntypedFormControl(''),
      createdBy: new UntypedFormControl(''),
      createdTs: new UntypedFormControl(''),
      updatedTs: new UntypedFormControl(''),
      adminFlag: new UntypedFormControl(''),
      filestartdate1: new UntypedFormControl(''),
      fileenddate1: new UntypedFormControl(''),
      trackingcount: new UntypedFormControl(''),
      logostatus: new UntypedFormControl(''),
      noofdaystoactive: new UntypedFormControl(''),
      noofdaysinactive: new UntypedFormControl(''),
      ipaddress: new UntypedFormControl(''),
      loginFlag: new UntypedFormControl(''),
      contractSavingFlag: new UntypedFormControl(''),
      clientProfileName: new UntypedFormControl(''),
      carrierType: new UntypedFormControl(''),
      t002AccountDet: new UntypedFormControl(''),
      customers: new UntypedFormControl('')
    })
  });

  constructor(
    public dialogRef: MatDialogRef<AutomateClientdetailsPopupComponent>,
    private httpClientService: HttpClientService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private dialog: MatDialog,
    private httpfedexService: HttpfedexService,
    private cookiesService: CookiesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelClass = data?.panelClass || '';
    this.t002ClientAc = data?.t002clientAccACVal || null;
  }

  ngOnInit(): void {
    this.loadPageData();
  }

  openLoading(): void {
    this.isLoading = true;
  }

  closeLoading(): void {
    this.isLoading = false;
  }

  loadPageData(): void {
    const t002ClntObj = {};
    this.fetchClientName(t002ClntObj);

    if (this.t002ClientAc) {
      this.AutomateClientDetails(this.t002ClientAc);
    }
  }

  fetchClientName(param: any): void {
    this.options = [];
    this.openLoading();

    this.httpfedexService.fetchClientName(param).subscribe({
      next: (result: any) => {
        this.clientList = Array.isArray(result) ? result : [];
        this.clientListFedex = [...this.clientList];
        this.clientDropDownLst = [...this.clientList];

        this.options = this.clientList
          .filter((item) => !!item?.clientName)
          .map((item) => item.clientName as string);

        this.filteredOptions = this.clientAccDetailsFormGroup
          .get('clientNameSelected')
          ?.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value))
          );

        this.closeLoading();
      },
      error: (error: any) => {
        console.log('error', error);
        this.closeLoading();
      }
    });
  }

  search_id_clickHandler(event: any): Promise<any> {
    console.log('search_id_clickHandler', event);

    const selectedClient = this.clientDropDownLst.find(
      (item) => item.clientName === event
    );

    if (!selectedClient) {
      this.openModal('Selected client not found');
      return Promise.resolve([]);
    }

    this.clientId = selectedClient.clientId;

    this.clientAccDetailsFormGroup.patchValue({
      t002ClientProfile: {
        clientId: selectedClient.clientId
      }
    });

    return new Promise((resolve, reject) => {
      this.httpfedexService.fetchaccountDetails(this.clientAccDetailsFormGroup.value).subscribe({
        next: (result: any) => {
          console.log(result, 'result');
          this.accountAC = Array.isArray(result) ? result : [];
          resolve(this.accountAC);
        },
        error: (error: any) => {
          console.log(error);
          reject(error);
        }
      });
    });
  }

  private _filter(value: string | null): string[] {
    const filterValue = (value || '').toLowerCase();
    return this.options.filter((option: string) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  AutomateClientDetails(t002ClientAccAC: ReportClientDetail): void {
    this.gridObjList = [];
    this.reportAutomationId = t002ClientAccAC?.reportAutomationId || null;
    this.lbl_title = `Report Name : ${t002ClientAccAC?.reportName || ''}`;

    this.httpfedexService.fetchManageAutomateClientDetails(t002ClientAccAC).subscribe({
      next: (result: any) => {
        console.log(result);
        this.gridObjList = Array.isArray(result) ? result : [];
      },
      error: (error: any) => {
        console.log('error', error);
      }
    });
  }

  private isBlank(value: any): boolean {
    return value == null || String(value).trim().length === 0;
  }

  private buildPayload(action: 'Insert' | 'Update'): any | null {
    const clientName = this.clientAccDetailsFormGroup.get('clientNameSelected')?.value;
    const primAccVal = this.clientAccDetailsFormGroup.get('accNoSelected')?.value;
    const timeBasis = this.clientAccDetailsFormGroup.get('Timebasis')?.value;
    const status = this.clientAccDetailsFormGroup.get('status')?.value;

    if (this.isBlank(clientName)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    if (this.isBlank(timeBasis)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    if (this.isBlank(status)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    let accountNumber = '';
    if (Array.isArray(primAccVal) && primAccVal.length > 0) {
      accountNumber = primAccVal.join(',');
    }

    const payload: any = {
      reportAutomationId: this.reportAutomationId,
      trigger: timeBasis,
      clientid: this.clientId,
      clientName: clientName,
      accountNo: accountNumber,
      statusReport: String(status),
      action: action
    };

    if (action === 'Update') {
      payload.detailId = this.detailId;
    }

    return payload;
  }

  btn_add_clickHandler(): void {
    const payload = this.buildPayload('Insert');
    if (!payload) {
      return;
    }

    this.click = !this.click;
    console.log(payload);

    this.httpfedexService.manageAutomateClientDetails(payload).subscribe({
      next: (result: any) => {
        if (result) {
          this.openModal('Your Automate Report Client Detail has been Added Successfully');
          this.click = !this.click;
          this.refreshAfterSave();
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  btn_upt_clickHandler(): void {
    const payload = this.buildPayload('Update');
    if (!payload) {
      return;
    }

    this.click = !this.click;
    console.log(payload);

    this.httpfedexService.manageAutomateClientDetails(payload).subscribe({
      next: (result: any) => {
        if (result) {
          this.openModal('Your Automate Report Client Detail has been Updated Successfully');
          this.click = !this.click;
          this.refreshAfterSave();
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  private refreshAfterSave(): void {
    this.showAddBtn = true;
    this.showUpdateBtn = false;
    this.loadPageData();
  }

  loadpage(): void {
    this.loadPageData();
  }

  dgrid_doubleClickHandler(event: any): void {
    // Intentionally left blank
  }

  openClientsDetailsEdit(event: any): void {
    this.detailId = event?.detailId;
    this.reportItems = event;

    const promise = this.search_id_clickHandler(event?.clientName);

    promise.then(() => {
      this.clientAccDetailsFormGroup.get('clientNameSelected')?.setValue(event?.clientName || '');
      this.clientAccDetailsFormGroup.get('Timebasis')?.setValue(event?.trigger || '');
      this.clientAccDetailsFormGroup.get('status')?.setValue(event?.status || '');

      const accountNumber = event?.accountNo;
      const userIdList: string[] = [];

      if (accountNumber) {
        if (String(accountNumber).includes(',')) {
          const userIdStrArray = String(accountNumber).split(',');
          for (let loopCount = 0; loopCount < userIdStrArray.length; loopCount++) {
            userIdList.push(userIdStrArray[loopCount].toString());
          }
        } else {
          userIdList.push(String(accountNumber));
        }
      }

      this.clientAccDetailsFormGroup.get('accNoSelected')?.setValue(userIdList);

      console.log(this.clientAccDetailsFormGroup.value);
      this.showAddBtn = false;
      this.showUpdateBtn = true;
    });
  }

  openRecipientsList(datagrid_iditem: any): void {
    const dialogConfig = this.dialog.open(RecipientsdetailsPopupComponent, {
      width: '60%',
      height: '570px',
      panelClass: this.panelClass,
      data: {
        pageValue: datagrid_iditem,
        panelClass: this.panelClass
      }
    });

    dialogConfig.afterClosed().subscribe(() => {
      this.loadPageData();
    });
  }

  datagrid_id_doubleClickHandler(datagrid_iditem: any): void {
    const dialogConfig = this.dialog.open(ReportStatusPopupComponent, {
      width: '60%',
      height: '570px',
      panelClass: this.panelClass,
      data: {
        pageValue: datagrid_iditem,
        panelClass: this.panelClass
      }
    });

    dialogConfig.afterClosed().subscribe(() => {
      this.loadPageData();
    });
  }

  openModal(alertVal: any): void {
    this.dialog.open(AlertPopupComponent, {
      width: '420px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
}