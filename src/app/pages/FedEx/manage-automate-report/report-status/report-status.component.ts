import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormControl, FormBuilder } from '@angular/forms';
import { TemplateRef, ViewChild } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { MatOption } from "@angular/material/core";
import { CommonService } from 'src/app/core/services/common.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-report-status.component',
  templateUrl: './report-status.component.html',
  standalone: false
})
export class ReportStatusPopupComponent implements OnInit {
  t002ClientAc: any;
  t002ClientDetails: any;
  clientId: any;
  t002ClntObj: any;
  adminId: any;
  panelClass: any;
  clientList: any;
  clientListFedex: any;
  clientDropDownLst: any;
  isLoading: any;
  click: any;
  reportItems: any;
  reportAutomationId: any;
  detailId;
  options = [];
  accountAC: any = [];
  RecipientId: any;

  filteredOptions: any;
  loadFlag: String = "";
  t002clientProObj = {};
  t002ClientDumAc = [];
  cmb_primaryAcc: any = [];
  lbl_title: any;
  gridObjList: any[] = [];
  showAddBtn = true;
  showUpdateBtn = false;
  showEditProfileBtn = false;
  tempAC = [];
  showpriamryAccTxt = true;
  showEditPrimaryAccTxt: any;
  showSecondaryAccTxt: any;
  cmb_primaryAccVal: any;
  flag: any;
  t002ClientAccAC = [];

  RecipientDetailsFormGroup = new UntypedFormGroup({
    emailName: new UntypedFormControl(''),
    emailId: new UntypedFormControl(''),
    mailCode: new UntypedFormControl('TO'),
    clientId: new UntypedFormControl(''),
    Timebasis: new UntypedFormControl(''),
    status: new UntypedFormControl('Active'),
    showEditPrimaryAccTxt: new UntypedFormControl(''),
  })

  constructor(
    public dialogRef: MatDialogRef<ReportStatusPopupComponent>, private httpClientService: HttpClientService, private datePipe: DatePipe,
    private commonService: CommonService, private dialog: MatDialog, private httpfedexService: HttpfedexService,
    private cookiesService: CookiesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelClass = data.panelClass;
    this.t002ClientDetails = data.pageValue;
    this.detailId = this.t002ClientDetails.detailId;
    this.AutomateReportStatusDetails(this.t002ClientDetails);
  }

  ngOnInit() {
    this.AutomateReportStatusDetails(this.t002ClientDetails);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option: any) => option.toLowerCase().includes(filterValue));
  }

  closeLoading() {
    this.isLoading = false;
  }


  AutomateReportStatusDetails(t002ClientAccAC: any) {
    console.log(t002ClientAccAC);
    this.gridObjList = [];
    this.detailId = t002ClientAccAC["detailId"];
    var reportname = "Report Status for Client : " + t002ClientAccAC["clientName"];
    this.lbl_title = reportname;
    console.log(t002ClientAccAC);
    this.httpfedexService.fetchAutomateClientReportStatus(t002ClientAccAC).subscribe(
      (result: any) => {
        console.log(result);
        this.gridObjList = result;
      }, (error: any) => {
        console.log('error', error);
      })

  }
  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '420px',
      height: 'auto;',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
}
