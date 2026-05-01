import { Component, Inject, OnInit, Optional } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

interface RecipientItem {
  recipientsId?: number | string;
  name?: string;
  mailId?: string;
  code?: 'TO' | 'CC' | 'BCC' | string;
  status?: '1' | '0' | string;
  [key: string]: any;
}

interface RecipientDialogData {
  panelClass?: string;
  pageValue?: any;
}

@Component({
  selector: 'app-recipients-add.component',
  templateUrl: './recipients-add.component.html',
  standalone: false
})
export class RecipientsdetailsPopupComponent implements OnInit {
  t002ClientAc: any = null;
  t002ClientDetails: any = null;

  clientId: number | string | null = null;
  t002ClntObj: any = {};
  adminId: any;

  panelClass: string = '';
  clientList: any[] = [];
  clientListFedex: any[] = [];
  clientDropDownLst: any[] = [];

  isLoading = false;
  click = false;

  reportItems: any = null;
  reportAutomationId: number | string | null = null;
  detailId: number | string | null = null;
  RecipientId: number | string | null = null;

  options: string[] = [];
  accountAC: any[] = [];
  filteredOptions: any;

  loadFlag: string = '';
  t002clientProObj: any = {};
  t002ClientDumAc: any[] = [];
  cmb_primaryAcc: any[] = [];
  lbl_title: string = '';
  gridObjList: RecipientItem[] = [];

  showAddBtn = true;
  showUpdateBtn = false;
  showEditProfileBtn = false;

  tempAC: any[] = [];
  showpriamryAccTxt = true;
  showEditPrimaryAccTxt: any;
  showSecondaryAccTxt: any;
  cmb_primaryAccVal: any;
  flag: any;

  t002clAccNoDetObj: any = {};
  t002ClientAccAC: any[] = [];
  showPrimaryDropDown = true;
  t002ClientSelectObj: any;

  RecipientDetailsFormGroup = new UntypedFormGroup({
    emailName: new UntypedFormControl(''),
    emailId: new UntypedFormControl(''),
    mailCode: new UntypedFormControl('TO'),
    clientId: new UntypedFormControl(''),
    Timebasis: new UntypedFormControl(''),
    status: new UntypedFormControl('1'),
    showEditPrimaryAccTxt: new UntypedFormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<RecipientsdetailsPopupComponent>,
    private httpClientService: HttpClientService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private dialog: MatDialog,
    private httpfedexService: HttpfedexService,
    private cookiesService: CookiesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: RecipientDialogData
  ) {
    this.panelClass = data?.panelClass || '';
    this.t002ClientDetails = data?.pageValue || null;
    this.detailId = this.t002ClientDetails?.detailId || null;
  }

  ngOnInit(): void {
    if (this.t002ClientDetails) {
      this.AutomateRecipientDetails(this.t002ClientDetails);
    }
  }

  openLoading(): void {
    this.isLoading = true;
  }

  closeLoading(): void {
    this.isLoading = false;
  }

  private isBlank(value: any): boolean {
    return value == null || String(value).trim().length === 0;
  }

  search_id_clickHandler(event: any): Promise<any> {
    console.log('search_id_clickHandler', event);

    const tempT002Obj = this.clientDropDownLst.find(
      (item: any) => item?.clientName === event
    );

    if (!tempT002Obj) {
      this.openModal('Selected client not found');
      return Promise.resolve([]);
    }

    this.clientId = tempT002Obj.clientId;

    this.RecipientDetailsFormGroup.patchValue({
      clientId: tempT002Obj.clientId
    });

    return new Promise((resolve, reject) => {
      this.httpfedexService.fetchaccountDetails(this.RecipientDetailsFormGroup.value).subscribe({
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

  AutomateRecipientDetails(t002ClientAccAC: any): void {
    if (!t002ClientAccAC) {
      this.gridObjList = [];
      this.lbl_title = '';
      return;
    }

    console.log(t002ClientAccAC);
    this.gridObjList = [];
    this.detailId = t002ClientAccAC['detailId'] ?? null;
    this.lbl_title = `Client Name : ${t002ClientAccAC['clientName'] || ''}`;

    this.httpfedexService.fetchManageAutomateRecipientsDetails(t002ClientAccAC).subscribe({
      next: (result: any) => {
        console.log(result);
        this.gridObjList = Array.isArray(result) ? result : [];
      },
      error: (error: any) => {
        console.log('error', error);
      }
    });
  }

  private buildRecipientPayload(action: 'Insert' | 'Update'): any | null {
    const emailName = this.RecipientDetailsFormGroup.get('emailName')?.value;
    const emailId = this.RecipientDetailsFormGroup.get('emailId')?.value;
    const code = this.RecipientDetailsFormGroup.get('mailCode')?.value;
    const status = this.RecipientDetailsFormGroup.get('status')?.value;

    if (this.isBlank(emailName)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    if (this.isBlank(emailId)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    if (this.isBlank(code)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    if (this.isBlank(status)) {
      this.openModal('Enter all required Fields');
      return null;
    }

    const payload: any = {
      reportDetailId: this.detailId,
      name: String(emailName).trim(),
      mailId: String(emailId).trim(),
      code: code,
      statusReport: String(status),
      action: action
    };

    if (action === 'Update') {
      payload['recipientsId'] = this.RecipientId;
    }

    return payload;
  }

  btn_add_clickHandler(): void {
    const payload = this.buildRecipientPayload('Insert');
    if (!payload) {
      return;
    }

    this.httpfedexService.manageAutomateRecipientsDetails(payload).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result) {
          this.openModal('Your Automate Recipient has been added Successfully');
          this.click = !this.click;
          this.resetFormForAdd();
          this.loadpage();
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  btn_upt_clickHandler(): void {
    const payload = this.buildRecipientPayload('Update');
    if (!payload) {
      return;
    }

    console.log(payload);

    this.httpfedexService.manageAutomateRecipientsDetails(payload).subscribe({
      next: (result: any) => {
        console.log(result);
        if (result) {
          this.openModal('Your Automate Recipient has been Updated Successfully');
          this.click = !this.click;
          this.resetFormForAdd();
          this.loadpage();
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  private resetFormForAdd(): void {
    this.RecipientDetailsFormGroup.patchValue({
      emailName: '',
      emailId: '',
      mailCode: 'TO',
      status: '1'
    });

    this.RecipientId = null;
    this.showAddBtn = true;
    this.showUpdateBtn = false;
  }

  loadpage(): void {
    console.log(this.t002ClientDetails);
    this.AutomateRecipientDetails(this.t002ClientDetails);
  }

  dgrid_doubleClickHandler(event: any): void {
    // Intentionally left blank
  }

  openRecipientsDetailsEdit(event: RecipientItem): void {
    console.log(event);

    this.RecipientDetailsFormGroup.patchValue({
      emailName: event?.name || '',
      emailId: event?.mailId || '',
      mailCode: event?.code || 'TO',
      status: event?.status ?? '1'
    });

    this.RecipientId = event?.recipientsId || null;
    this.showAddBtn = false;
    this.showUpdateBtn = true;
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