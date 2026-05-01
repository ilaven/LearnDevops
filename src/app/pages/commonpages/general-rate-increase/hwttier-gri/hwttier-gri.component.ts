import { Component, OnInit, Optional, Inject, ChangeDetectorRef, signal } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { CreateProposalGRIComponent } from "../create-proposal-gri/create-proposal-gri.component";
import { LoaderService } from "src/app/core/services/loader.service";
import { ResetPopupComponent } from "../../contract-summary/reset-popup/reset-popup.component";


@Component({
  selector: 'app-hwttier-gri',
  templateUrl: './hwttier-gri.component.html',
  styleUrls: ['./hwttier-gri.component.css'],
  standalone: false
})
export class HundredweightTierGRIComponent implements OnInit {


  carrier: any;
  carrierDetails: any;
  tabName: any;
  targetDetails: any;
  targetList: any;
  fedexClientId: any;
  nextBtnShow: any;
  pageValue: any;
  type: any;
  carrierName: any;
  targets: any;
  randomNumber: any;
  dataList: any;
  hwtDiscountsList: any = [];
  dataSource: any = [];
  distinctHWTServices: any = [];
  hwtDiscountsListNew: any;
  selectedScenario: any;
  columns: any;
  columnsSignal: any = signal<any>([]);
  displayedColumns: any;
  displayedColumnsSignal: any = signal<any>([]);
  hwtAccountNumbersList: any[] = [];

  constructor(public dialogRef: MatDialogRef<HundredweightTierGRIComponent>, public dialog: MatDialog, private loaderService: LoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService,
    private fedexService: HttpfedexService, private cookiesService: CookiesService, private cd: ChangeDetectorRef,) {

    this.carrierDetails = data.carrierDetails;
    this.carrier = this.carrierDetails.carrierName;
    this.tabName = data.tabName;
    this.targetDetails = data.target;

    this.targetList = data.targetList;
    this.fedexClientId = data.fedexId;
    this.nextBtnShow = data.tabIndex;

    if (data.valueClick == "create") {
      this.pageValue = "Create Agreement"
      this.type = data.valueClick;
      this.carrierName = this.carrierDetails.carrierName.toLowerCase();
    }
    if (data.valueClick == "Edit") {
      this.pageValue = "Edit Agreement"
      this.type = data.valueClick;
    }
  }

  async ngOnInit(): Promise<void> {
    this.openLoading();
    await this.getData();
    await this.displayedColumnsSet();
    await this.getHWTAccountsList();
    await this.setMinMaxHWT();
    this.closeLoading();
  }
  async getData() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    var clientObj: any = {};
    clientObj['type'] = this.type;
    if (this.type.toLowerCase() == 'create') {
      clientObj['carrier'] = this.carrierName;
    }
    clientObj['targetId'] = this.targetDetails.targetId;
    if (clientObj['targetId'] != undefined) {
      clientObj['type'] = 'Edit';
    }
    if (this.carrier.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.fedexClientId;
      var hwtData = await this.fedexService.fetchGRIfreightEditProposal(clientObj).toPromise();
      {
        this.dataList = hwtData;
        await hwtData.forEach((data: any) => {
          if ((data.serviceType).toLowerCase() == 'hwt') {
            this.hwtDiscountsList.push(data);
          }
        });
        for (let index = 0; index < this.hwtDiscountsList.length; index++) {
          this.hwtDiscountsList[index].weightFrom = Number(this.hwtDiscountsList[index].weightFrom);
          this.hwtDiscountsList[index].weightTo = Number(this.hwtDiscountsList[index].weightTo);
        }
        var hwtServices = await this.hwtDiscountsList.filter(
          (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup) === i
        );
        hwtServices.forEach((data: any) => this.distinctHWTServices.push(Object.assign({}, data)));
        this.dataSource = new MatTableDataSource(this.distinctHWTServices);
        this.cd.detectChanges();
      }
    }
    else {
      clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
      var data = await this.httpClientService.fetchGRIfreightEditProposal(clientObj).toPromise();
      {
        this.dataList = data;
        await data.forEach((dataNew: any) => {
          if ((dataNew.serviceType).toLowerCase() == 'hwt') {
            this.hwtDiscountsList.push(dataNew);
          }
        });
        for (let index = 0; index < this.hwtDiscountsList.length; index++) {
          this.hwtDiscountsList[index].weightFrom = Number(this.hwtDiscountsList[index].weightFrom);
          this.hwtDiscountsList[index].weightTo = Number(this.hwtDiscountsList[index].weightTo);
        }
        var hwtServices = await this.hwtDiscountsList.filter(
          (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup) === i
        );
        for (let row = 0; row < hwtServices.length; row++) {
          this.distinctHWTServices[row] = Object.assign({}, hwtServices[row]);
        }
        this.dataSource = new MatTableDataSource(this.distinctHWTServices);
        this.cd.detectChanges();
      }
    }
    this.closeLoading();
  }
  async displayedColumnsSet() {
    this.columns = [];
    this.displayedColumns = [];
    this.columns.push({ field: 'HWT Service Level', fieldVal: 'subGroup' });
    this.columns.push({ field: 'From Weight', fieldVal: 'weightFrom' });
    this.columns.push({ field: 'To Weight', fieldVal: 'weightTo' });
    this.columns.push({ field: 'HWT Tier', fieldVal: 'hwtTier' });
    this.columns.push({ field: 'Discount', fieldVal: 'targetDis' });
    this.columns.push({ field: 'Net Spend', fieldVal: 'netSpend' });
    this.displayedColumns.push('subGroup');
    this.displayedColumns.push('weightFrom');
    this.displayedColumns.push('weightTo');
    this.displayedColumns.push('hwtTier');
    this.displayedColumns.push('targetDis');
    this.displayedColumns.push('netSpend');
    this.columnsSignal.set(this.columns);
    this.displayedColumnsSignal.set(this.displayedColumns);
  }
  onSubmit() {
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }
  Edit(clickValue: any) {
    this.selectedScenario = this.targetDetails;
    const dialogConfig = this.dialog.open(CreateProposalGRIComponent, {
      disableClose: true,
      width: '85%',
      height: '68%',
      panelClass: 'Create-Proposal-Component-class',
      data: {
        valueClick: clickValue,
        carrierDetails: this.carrierDetails,
        target: this.selectedScenario,
        targetList: this.targetList,
        fedexId: this.data.fedexId,
        tabIndex: this.data.tabIndex,
        targetDetails: []
      },
    });
    dialogConfig.afterClosed().subscribe(async data => {
      this.dialogRef.close(data);
    });
  }

  isLoading: any = signal<any>(false);
  openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
  async getHWTAccountsList() {
    this.hwtAccountNumbersList = [];
    var clientData: any = {};
    clientData['targetId'] = this.targetDetails.targetId;
    clientData['type'] = this.type;
    if (this.type.toLowerCase() == 'create') {
      clientData['carrier'] = this.carrier;
    }
    if (this.carrier.toLowerCase() == 'fedex') {
      clientData['clientId'] = this.fedexClientId;
      this.hwtAccountNumbersList = await this.fedexService.fetchGRIAccountNumber(clientData).toPromise();
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      this.hwtAccountNumbersList = await this.httpClientService.fetchGRIAccountNumber(clientData).toPromise();
    }
    console.log(this.hwtAccountNumbersList);
  }

  async setMinMaxHWT() {

    var services = this.hwtAccountNumbersList;

    for (let index = 0; index < this.distinctHWTServices.length; index++) {

      var filteredService = services.filter(data => data.ratesheetName == this.distinctHWTServices[index].ratesheetName);

      if (filteredService[0] != undefined) {

        var minMax = {
          minTier: filteredService[0].hwtTier,
          maxTier: filteredService[0].hwtTier,
        };

        for (let row = 0; row < filteredService.length; row++) {

          //tier
          if (Number(minMax.minTier) >= Number(filteredService[row].hwtTier)) {
            minMax.minTier = Number(filteredService[row].hwtTier);
          }
          if (Number(minMax.maxTier) <= Number(filteredService[row].hwtTier)) {
            minMax.maxTier = Number(filteredService[row].hwtTier);
          }
        }

        if (minMax.minTier == minMax.maxTier) {
          this.distinctHWTServices[index].hwtTier = minMax.minTier;
        }
        else {
          this.distinctHWTServices[index].hwtTier = minMax.minTier + '-' + minMax.maxTier;
        }
      }
    }
    this.dataSource = new MatTableDataSource(this.distinctHWTServices);
    this.cd.detectChanges();

  }

  delete() {
    let panelClass = "";

    var alertDialog = this.dialog.open(ResetPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { message: "Are you sure you want to delete??" },
    });

    alertDialog.afterClosed().subscribe(
      result => {
        if (result == true) {

        }
      });
  }
}


