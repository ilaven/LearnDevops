import { Component, OnInit, Optional, Inject, ChangeDetectorRef, signal } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CookieService } from "ngx-cookie-service";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { CreateProposalComponent } from "../create-proposal/create-proposal.component";
import { MinreductiondetailComponent } from "./minreductiondetail/minreductiondetail.component";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: 'app-minreduction-contractsummary',
  templateUrl: './minreduction-contractsummary.component.html',
  styleUrls: ['./minreduction-contractsummary.component.css'],
  standalone: false
})
export class MinReductionContractsummaryComponent implements OnInit {
  editable = false;
  editableCommon = false;
  CurrentSavingsCombinedObj: any = {};
  zoneLookupListService: any = [];
  CurrentSavingsListNew: any = [];
  CurrentSavingsList: any = [];
  TargetSavingsList: any = [];
  TargetSavingsListNew: any = [];
  ProposalSavingsList: any = [];
  ProposalSavingsListNew: any = [];
  ZoneLookupList: any = [];

  displayedColumns: any = [];
  displayedColumnsMin: any = [];
  columns = [{
    service: '',
    field: '',
    fieldVal: ''
  }];
  spans: any = [];
  targetIdList: any = [];
  targetNameList = [];
  carrierName: any = '';
  selectedCarrier: any = [];
  randomNumber: any;
  isLoading: any = signal<any>(false);
  tabIndex = 0;
  scenariosDisplayed: any = [];
  selectedScenario: any = [];
  currentMin: any = [];
  targetMin: any = [];
  currentService: any;
  columnsMin: any = [];
  dataSource: any = [];
  dataSourceTargetSavings = [];
  dataSourceProposalSavings = [];
  minReductionList: any = [];
  freightTargetSavingsList: any = [];
  minMaxList: any = [];
  netAmountMinMaxList: any = [];
  year: any;
  distinctMinServices: any = [];
  distinctMinReductionList: any = [];
  themeoption: any;
  panelClass: any;
  service;
  serviceType;
  isOrderChanged = false;
  constructor(public dialogRef: MatDialogRef<MinReductionContractsummaryComponent>, private loaderService: LoaderService, public dialog: MatDialog, private cd: ChangeDetectorRef,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService, private cookie: CookieService, private cookiesService: CookiesService,
    private fedexService: HttpfedexService) {


    this.scenariosDisplayed = data.targetList;
    this.selectedCarrier = data.carrier;
    this.carrierName = data.carrier.carrierName;
    this.service = data.service;
    this.serviceType = data.serviceType;
    this.isOrderChanged = data.order;
    if (this.service.toLowerCase().includes('international')) {
      this.minReductionList = data.minReduction.filter((list: any) => list.service == this.service);
    }
    else {
      this.minReductionList = data.minReduction.filter((list: any) => list.serviceType == this.serviceType);
    }

    this.year = data.carrier.year;
  }

  async ngOnInit(): Promise<void> {
    this.openLoading();
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    await this.minReductionList.forEach((data: any) => {
      if (!(this.distinctMinServices.includes(data.subGroup))) {
        this.distinctMinServices.push(data.subGroup);
        this.distinctMinReductionList.push(data);
      }
    });

    await this.setNetAmountMinMax();
    await this.setDimDetails();
    this.closeLoading();
  }

  async Edit(clickValue: any) {
    let themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    let panelClass = "";
    if (themeoption == "dark") {
      panelClass = 'page-dark';
    }
    else {
      panelClass = 'Create-Proposal-Component-class';
    }

    if (this.tabIndex == 1) {
      this.selectedScenario = this.scenariosDisplayed[0];
    }
    else {
      this.selectedScenario = this.scenariosDisplayed[1];
    }
    const dialogConfig = this.dialog.open(CreateProposalComponent, {
      disableClose: true,
      width: '85%',
      height: '68%',
      panelClass: panelClass,
      data: {
        valueClick: clickValue,
        carrierDetails: this.selectedCarrier,
        target: this.selectedScenario,
        targetList: this.scenariosDisplayed,
        targetDetails: this.data.totalTargetList,
        fedexId: this.data.fedexId,
        tabIndex: 0,
      },
    });
    dialogConfig.afterClosed().subscribe(async data => {
      this.dialogRef.close(data);
    });
  }
  columnsMinReduction: any = signal<any>([]);
  targetMinReductionList: any = [];
  targetMinReductionListSignal: any = signal<any>([]);
  async setDimDetails() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    var userObj: any = {};
    this.scenariosDisplayed.forEach((data: any) => this.targetIdList.push(data.targetId));
    userObj['targetId'] = this.targetIdList.toString();
    this.dataSource = new MatTableDataSource(this.distinctMinReductionList);
    this.cd.detectChanges();
    this.columnsMinReduction.set([
      { field: 'Service', fieldVal: 'subGroup' },
      { field: 'Current Min Reduction ' + this.carrierName, fieldVal: 'currentMin' },
      { field: 'Current Net Minimum ' + this.carrierName + ' (' + this.year + ')', fieldVal: 'currentMinNet' },
    ])
    this.displayedColumnsMin = ['subGroup', 'currentMin', 'currentMinNet'];
    this.scenariosDisplayed.forEach((data: any) => {
      var targetMinReduction =
      {
        targetName: data.targetName,
        carrierName: data.carrierName,
        targetId: data.targetId,
        columns: [
          { field: 'Service', fieldVal: 'subGroup' },
        ],
        displayedColumns: ['subGroup']
      }
      this.targetMinReductionList.push(Object.assign({}, targetMinReduction));
    })
    if (this.isOrderChanged) {
      this.targetMinReductionList[0].columns.push(Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Min Reduction', fieldVal: 'targetMin1' }));
      this.targetMinReductionList[0].displayedColumns.push('targetMin1');
      this.targetMinReductionList[0].columns.push(Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Net Minimum' + ' (' + this.year + ')', fieldVal: 'targetMinNet1' }));
      this.targetMinReductionList[0].displayedColumns.push('targetMinNet1');
      if (this.scenariosDisplayed.length > 1) {
        this.targetMinReductionList[1].columns.push(Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Min Reduction', fieldVal: 'targetMin2' }));
        this.targetMinReductionList[1].displayedColumns.push('targetMin2');
        this.targetMinReductionList[1].columns.push(Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Net Minimum' + ' (' + this.year + ')', fieldVal: 'targetMinNet2' }));
        this.targetMinReductionList[1].displayedColumns.push('targetMinNet2');
      }
    }
    else {
      this.targetMinReductionList[0].columns.push(Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Min Reduction', fieldVal: 'targetMin2' }));
      this.targetMinReductionList[0].displayedColumns.push('targetMin2');
      this.targetMinReductionList[0].columns.push(Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' Net Minimum' + ' (' + this.year + ')', fieldVal: 'targetMinNet2' }));
      this.targetMinReductionList[0].displayedColumns.push('targetMinNet2');
      if (this.scenariosDisplayed.length > 1) {
        this.targetMinReductionList[1].columns.push(Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Min Reduction', fieldVal: 'targetMin1' }));
        this.targetMinReductionList[1].displayedColumns.push('targetMin1');
        this.targetMinReductionList[1].columns.push(Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' Net Minimum' + ' (' + this.year + ')', fieldVal: 'targetMinNet1' }));
        this.targetMinReductionList[1].displayedColumns.push('targetMinNet1');
      }
    }
    this.targetMinReductionListSignal.set(this.targetMinReductionList);
  }

  close() {
    this.dialogRef.close();
  }
  onTabChanged(event: any) {
    this.tabIndex = event.index;
  }
  openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
  async setNetAmountMinMax() {
    this.netAmountMinMaxList = [];
    var services = await this.minReductionList;
    for (let index = 0; index < this.distinctMinServices.length; index++) {
      var filteredService = [];
      filteredService = services.filter((data: any) => data.subGroup == this.distinctMinServices[index]);
      var minMax = {
        currentNetMin: '999999999999',
        currentNetMax: '-99999999999',
        targetNet1Min: '999999999999',
        targetNet1Max: '-99999999999',
        targetNet2Min: '999999999999',
        targetNet2Max: '-99999999999',
      };
      for (let row = 0; row < filteredService.length; row++) {
        if (filteredService[row].currentMinNet == '') {
          minMax.currentNetMin = '0.00';
          minMax.currentNetMax = '0.00';
        }
        else {
          if (Number(minMax.currentNetMin) >= Number(filteredService[row].currentMinNet)) {
            minMax.currentNetMin = Number(filteredService[row].currentMinNet).toFixed(2);
          }
          if (Number(minMax.currentNetMax) <= Number(filteredService[row].currentMinNet)) {
            minMax.currentNetMax = Number(filteredService[row].currentMinNet).toFixed(2);
          }
        }
        if (filteredService[row].targetMinNet1 == '') {
          minMax.targetNet1Min = '0.00';
          minMax.targetNet1Min = '0.00';
        }
        else {
          if (Number(minMax.targetNet1Min) >= Number(filteredService[row].targetMinNet1)) {
            minMax.targetNet1Min = Number(filteredService[row].targetMinNet1).toFixed(2);
          }
          if (Number(minMax.targetNet1Max) <= Number(filteredService[row].targetMinNet1)) {
            minMax.targetNet1Max = Number(filteredService[row].targetMinNet1).toFixed(2);
          }
        }
        if (filteredService[row].targetMinNet2 == '') {
          minMax.targetNet2Min = '0.00';
          minMax.targetNet2Max = '0.00';
        }
        else {
          if (Number(minMax.targetNet2Min) >= Number(filteredService[row].targetMinNet2)) {
            minMax.targetNet2Min = Number(filteredService[row].targetMinNet2).toFixed(2);
          }
          if (Number(minMax.targetNet2Max) <= Number(filteredService[row].targetMinNet2)) {
            minMax.targetNet2Max = Number(filteredService[row].targetMinNet2).toFixed(2);
          }
        }
      }
      this.netAmountMinMaxList[index] = {
        service: this.distinctMinServices[index],
        currentMin: minMax.currentNetMin,
        currentMax: minMax.currentNetMax,
        target1Min: minMax.targetNet1Min,
        target1Max: minMax.targetNet1Max,
        target2Min: minMax.targetNet2Min,
        target2Max: minMax.targetNet2Max,
      }
    }
  }
  async popMinReduction(subGroup: any, type: any, carrierName: any, id: any) {

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'Edit-discount-class';
    }

    var targetId: any = [];
    var targetName = [];

    this.scenariosDisplayed.map((data: any) => {
      targetId.push(data.targetId);
      targetName.push(data.targetName);
    });

    const dialogRef = this.dialog.open(MinreductiondetailComponent, {
      disableClose: true,
      width: "86%",
      height: "86%",
      panelClass: this.panelClass,
      data: { service: subGroup, targetIdList: targetId, carrier: this.carrierName, fedexId: this.data.fedexId, targetId: id, type: type, carrierName: carrierName, year: this.year }
    });
  }

  drop(event: any) {
  }
}

