import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-hwt-accountnumber-update-gri',
  templateUrl: './hwt-accountnumber-update.component.html',
  styleUrls: ['./hwt-accountnumber-update.component.css'], standalone: false
})

export class GRIHWTAccountNumberUpdate implements OnInit {
  carrier: any;
  buttonName: ('Add' | 'Update') = 'Add';
  clientData = {};
  hwtAccountNumberList: any = [];
  hwtAccountNumberListSelect: any = [];
  accountNumber = '';
  carrierName: string = '';
  headerService: string;
  targetId: number;
  hwtAccountsList: any = [];
  dataList: any;
  serviceName: string = '';
  type: ('create' | 'Edit');
  distinctHWTServices: any = [];
  distinctHWTServicesRaw: any = [];
  dataSource: any = [];
  fedexId: number;
  columns: any;
  displayedColumns: any;
  duplicatehwtAccountsList: any = [];
  savehwtAccountsList: any = [];
  tierValues: string[] = ['1', '2', '3', '4', '5', '6', '7'];
  allHWTAccountNumbersList: any[] = [];
  public accountNumberListFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject();
  @ViewChild('multiSelect', { static: true }) multiSelect!: MatSelect;
  selectedAccountNumbers: string[] = [];
  editIndex: any;
  accountNumberDeleteList: any[] = [];
  currentAgreement: boolean;

  constructor(public dialogRef: MatDialogRef<GRIHWTAccountNumberUpdate>, public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService, private cookie: CookieService,
    private fedexService: HttpfedexService) {
    this.carrierName = data.carrierName;
    this.targetId = data.targetId;
    this.type = data.type;
    this.fedexId = data.fedexId;
    this.serviceName = data.service;
    this.headerService = data.serviceName;
    this.allHWTAccountNumbersList = data.hwtAccountNumbersList;
    this.currentAgreement = data.currentAgreement;
  }

  async ngOnInit() {
    await this.getData();
    await this.displayedColumnsSet();
  }

  ngOnDestroy() {
    // this._onDestroy.next();
    this._onDestroy.complete();
  }

  async getData() {

    this.allHWTAccountNumbersList.forEach((data: any) => {
      if ((data.ratesheetName).toLowerCase() == this.serviceName.toLowerCase()) {
        this.hwtAccountsList.push(data);
      }
    });


    this.dataSource = new MatTableDataSource(this.hwtAccountsList);


  }

  async displayedColumnsSet() {

    this.displayedColumns = [];
    this.displayedColumns.push('accountNumber');
    this.displayedColumns.push('hwtTier');
    this.displayedColumns.push('netSpend');
  }


  async Save() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  async openSaveAlert() {
    var message;
    message = "Account Number Updated successfully";

    var resetDialog = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      data: { pageValue: message },
    });
    resetDialog.afterClosed().subscribe(
      () => {
        this.dialogRef.close();
      });
  }

  onSearch(value: string) {

    if (this.hwtAccountsList.length == 0) {
      return;
    }

    // get the search keyword
    let search = value;
    if (!search) {
      this.dataSource = new MatTableDataSource(this.hwtAccountsList);
      return;
    }
    else {
      search = search.toLowerCase();
    }

    var accountNumberList = this.hwtAccountsList.filter((data: any) => data.accountNumber.toLowerCase().indexOf(search) > -1);
    this.dataSource = new MatTableDataSource(accountNumberList);
  }

  onEdit(index: number) {
  }

  AddOrUpdate() {
  }

  onDelete(index: number) {
  }
}

