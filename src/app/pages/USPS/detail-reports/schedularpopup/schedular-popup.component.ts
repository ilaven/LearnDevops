import { Component, Inject, OnInit, Optional, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { SchedularEditComponent } from '../schedular-edit/schedular-edit.component';
import { HttpUSPSService } from 'src/app/core/services/httpusps.service';

@Component({
  selector: 'app-schedular-popup',
  templateUrl: './schedular-popup.component.html',
  styleUrls: ['./schedular-popup.component.scss'],
  standalone: false,
})
export class SchedularPopup implements OnInit, AfterViewInit {

  //variablel decalration
  totalItems = [];
  userProfifle: any;
  clientType: any;
  reportItems: any;
  t001ClientProfile: any;
  reportSchedulerResultAC: any = [];
  datagrid_id: any = [];
  reportItems1: any;
  btnEdit: any;

  constructor(private dialogRef: MatDialogRef<SchedularPopup>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private httpUspsService: HttpUSPSService, private cookiesService: CookiesService, public dialog: MatDialog,
    private cdr: ChangeDetectorRef) {
    this.clientType = data.clienttype;
    // this.panelClass = data.panelClass;
    this.reportItems = data.pageValue;
    this.userProfifle = data.t001ClientProfile;
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype;
    });
  }

  ngOnInit(): void {
    this.module1_creationCompleteHandler()
  }

  module1_creationCompleteHandler() {
    let t001ClientObj: any = {};
    t001ClientObj['clientId'] = this.userProfifle.clientId;
    this.httpUspsService.fetchReportScheduler(t001ClientObj).subscribe({
      next: (descResult) => {
        this.ReportSchedulerResult(descResult);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  ReportSchedulerResult(result: any) {
    this.reportSchedulerResultAC = result;
    this.datagrid_id = this.reportSchedulerResultAC;
    this.cdr.detectChanges();
  }

  editDimRow(row: { dimFactor: string; minimumWeight: number; discount: string; netSpend: string }): void {
    console.log('Edit DIM row:', row);
  }

  close(): void {
    this.dialogRef.close();
  }

  openReportSchedulerEdit(datagrid_iditem: any) {
    this.btnEdit = 'yes';
    this.reportItems1 = datagrid_iditem;
    const dialogConfig = this.dialog.open(SchedularEditComponent, {
      width: '60%', 
      //panelClass: this.panelClass,
      data: {
        pageValue: this.reportItems1,
        t001ClientProfile: this.userProfifle,
        //panelClass: this.panelClass,
        clienttype: this.clientType,
        btnEdit: this.btnEdit,
        accountNumber: this.data.accountNumber
      }
    });
    dialogConfig.afterClosed().subscribe(res => {
      if (res) {
        this.module1_creationCompleteHandler();
      }
    })
  }


  openReportScheduler() {
    this.btnEdit = 'No';
    const dialogConfig = this.dialog.open(SchedularEditComponent, {
      width: '60%', 
      //panelClass: this.panelClass,
      data: {
        pageValue: this.reportItems,
        t001ClientProfile: this.userProfifle,
        //panelClass: this.panelClass,
        clienttype: this.clientType,
        btnEdit: this.btnEdit,
        accountNumber: this.data.accountNumber
      }

    });
    dialogConfig.afterClosed().subscribe(res => {
      if (res) {
        this.module1_creationCompleteHandler();
      }
    })
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

}