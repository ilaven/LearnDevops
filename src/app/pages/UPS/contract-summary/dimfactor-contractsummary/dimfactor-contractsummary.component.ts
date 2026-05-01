import { Component, OnInit, Optional, Inject, signal, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { CreateProposalComponent } from "../create-proposal/create-proposal.component";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: 'app-dimfactor-contractsummary',
  templateUrl: './dimfactor-contractsummary.component.html',
  styleUrls: ['./dimfactor-contractsummary.component.css'],
  standalone: false
})

export class DimfactorContractsummaryComponent implements OnInit {
  serviceName: any;
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
  targetNameList: any = [];
  carrierName: any = '';
  selectedCarrier: any = [];
  randomNumber: any;
  isLoading :any= signal<any>(false);
  tabIndex = 0;
  scenariosDisplayed: any = [];
  selectedScenario: any = [];
  currentMin: any = [];
  targetMin: any = [];
  currentService: any;
  columnsMin: any = [];
  dataSource: any = [];
  dataSourceSignal: any = signal<any>([]);
  dataSourceTargetSavings = [];
  dataSourceProposalSavings = [];
  dimDetails: any = [];
  freightTargetSavingsList: any = [];
  fedexClientId: number;
  netAmountMinMaxList: any = [];
  minimumReductionList: any = [];
  tabName = '';
  orderChanged: boolean = false;
  constructor(public dialogRef: MatDialogRef<DimfactorContractsummaryComponent>, private cd: ChangeDetectorRef, public dialog: MatDialog, private loaderService: LoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService,
    private fedexService: HttpfedexService, private cookiesService: CookiesService) {
    this.scenariosDisplayed = data.targetList;
    this.selectedCarrier = data.carrier;
    this.carrierName = data.carrier.carrierName;
    this.fedexClientId = data.fedexId;
    this.minimumReductionList = data.minimumReductionList;
    this.netAmountMinMaxList = data.netAmountMinMaxList;
    this.editable = data.editable;
    this.tabIndex = data.Dimtab;
    this.orderChanged = data.orderChanged;
    var dimList = data.dimFactor;
    dimList.forEach((data: any) => this.dimDetails.push(Object.assign({}, data)));
  }
  async ngOnInit(): Promise<void> {
    this.openLoading();
    await this.setDimDetails();
    this.closeLoading();
  }
  async Edit(clickValue: any) {
    let themeoption = await this.cookiesService.getCookie('themeOption').then((res: any) => { return res; });
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
      width: '90vw',
      height: '80vh',
      panelClass: panelClass,
      data: {
        valueClick: clickValue,
        carrierDetails: this.selectedCarrier,
        target: this.selectedScenario,
        targetList: this.scenariosDisplayed,
        fedexId: this.data.fedexId,
        tabIndex: 4,
        targetDetails: []
      },
    });
    dialogConfig.afterClosed().subscribe(async data => {
      this.dialogRef.close(data);
    });
  }

  columnsDimFactor: any = signal<any>([]);
  displayedColumnsDIM: any = signal<any>([]);
  targetDimFactorList: any = [];
  targetDimFactorListSignal = signal<any>([]);
  async setDimDetails() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    var userObj: any = {};
    this.scenariosDisplayed.forEach((data: any) => this.targetIdList.push(data.targetId));
    userObj['targetId'] = this.targetIdList.toString();
    this.dataSource = new MatTableDataSource(this.dimDetails);
    this.columnsDimFactor.set([
      { field: 'Criteria', fieldVal: 'criteria' },
      { field: 'Service Groupings', fieldVal: 'serviceGrouping' },
      { field: 'Cubic In From', fieldVal: 'cubicInchFrom' },
      { field: 'Cubic In To', fieldVal: 'cubicInchTo' },
      { field: 'Current DIM Factor', fieldVal: 'baselineDimFactor' },
    ]);
    this.displayedColumnsDIM.set(['criteria', 'serviceGrouping', 'cubicInchFrom', 'cubicInchTo', 'baselineDimFactor']);
    this.scenariosDisplayed.forEach((data: any) => {
      var targetDimFactor =
      {
        targetName: data.targetName,
        columns: [
          { field: 'Criteria', fieldVal: 'criteria' },
          { field: 'Service Groupings', fieldVal: 'serviceGrouping' },
          { field: 'Cubic In From', fieldVal: 'cubicInchFrom' },
          { field: 'Cubic In To', fieldVal: 'cubicInchTo' },
        ],
        displayedColumns: ['criteria', 'serviceGrouping', 'cubicInchFrom', 'cubicInchTo']
      }

      this.targetDimFactorList.push(Object.assign({}, targetDimFactor));
    })
    this.targetDimFactorListSignal.set(this.targetDimFactorList);

    if (!this.orderChanged) {
      this.targetDimFactorList[0].columns.push(Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' DIM Factor', fieldVal: 'targetDimDivisor' }));
      this.targetDimFactorList[0].displayedColumns.push('targetDimDivisor');
    }
    else {
      this.targetDimFactorList[0].columns.push(Object.assign({}, { field: this.scenariosDisplayed[0].targetName + ' DIM Factor', fieldVal: 'proposalDimDivisor' }));
      this.targetDimFactorList[0].displayedColumns.push('proposalDimDivisor');
    } this.targetDimFactorListSignal.set(this.targetDimFactorList);

    if (this.scenariosDisplayed.length > 1) {
      if (!this.orderChanged) {
        this.targetDimFactorList[1].columns.push(Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' DIM Factor', fieldVal: 'proposalDimDivisor' }));
        this.targetDimFactorList[1].displayedColumns.push('proposalDimDivisor');
      }
      else {
        this.targetDimFactorList[1].columns.push(Object.assign({}, { field: this.scenariosDisplayed[1].targetName + ' DIM Factor', fieldVal: 'targetDimDivisor' }));
        this.targetDimFactorList[1].displayedColumns.push('targetDimDivisor');
      }
      this.targetDimFactorListSignal.set(this.targetDimFactorList);
    }
    this.cd.detectChanges();
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

  proposalList: any = [];
  airProposalList: any = [];
  groundProposalList: any = [];
  intlProposalList: any = [];
  async getProposalList(scenario: any) {
    var clientObj: any = {};
    clientObj['type'] = 'Edit';
    clientObj['carrier'] = scenario.carrierName;
    clientObj['targetId'] = scenario.targetId;

    this.airProposalList = [];
    this.groundProposalList = [];
    this.intlProposalList = [];

    var groundServices = ['ground', 'home delivery', 'smartpost', 'ground economy'];
    var services = ['air', 'hwt', 'ground', 'home delivery', 'smartpost', 'ground economy'];

    if (this.selectedCarrier.carrierName.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.fedexClientId;
      var proposalData = await this.fedexService.fetchfreightEditProposal(clientObj).toPromise();
      {
        this.proposalList = proposalData;

        await proposalData.forEach((data: any) => {
          if (data.serviceType.toLowerCase() == 'air') {
            this.airProposalList.push(data);
          }
          else if (groundServices.includes(data.serviceType.toLowerCase())) {
            this.groundProposalList.push(data);
          }
          else if ((!services.includes(data.serviceType.toLowerCase()))) {
            this.intlProposalList.push(data);
          }
        });
      }
    }
    else {
      clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
      var proposalData = await this.httpClientService.fetchfreightEditProposal(clientObj).toPromise();
      {
        this.proposalList = proposalData;

        await proposalData.forEach((data: any) => {
          if (data.serviceType.toLowerCase() == 'air') {
            this.airProposalList.push(data);
          }
          else if (groundServices.includes(data.serviceType.toLowerCase())) {
            this.groundProposalList.push(data);
          }
          else if ((!services.includes(data.serviceType.toLowerCase()))) {
            this.intlProposalList.push(data);
          }
        });
      }
    }
  }

  async save() {
    this.openLoading();
    let columnIndex: number;
    if (this.tabIndex == 1) {
      columnIndex = 0;
    }
    else {
      columnIndex = 1;
    }
    var alteredList: any = [];
    var dimObj: any = {
      baselineDimFactor: null,
      carrier: null,
      category: "Proposed",
      clientId: '',
      criteria: "",
      cubicInchFrom: "",
      cubicInchTo: "",
      currentDiscount: null,
      dimDetailid: 0,
      proposalDimDivisor: null,
      serviceGrouping: "",
      targetDimDivisor: "",
      targetId: "",
      type: null
    }
    this.dataSource.data.forEach((data: any) => {
      dimObj.criteria = data.criteria;
      dimObj.serviceGrouping = data.serviceGrouping;
      if (!this.orderChanged) {
        dimObj.targetDimDivisor = (this.tabIndex == 1) ? data.targetDimDivisor : data.proposalDimDivisor;
      }
      else {
        dimObj.targetDimDivisor = (this.tabIndex == 1) ? data.proposalDimDivisor : data.targetDimDivisor;
      }
      dimObj.targetId = this.scenariosDisplayed[columnIndex].targetId;
      dimObj.clientId = data.clientId;
      dimObj.cubicInchFrom = data.cubicInchFrom;
      dimObj.cubicInchTo = data.cubicInchTo;
      alteredList.push(Object.assign({}, dimObj));
    });

    var clientObj: any = {};
    clientObj['targetId'] = Number(this.scenariosDisplayed[columnIndex].targetId);
    clientObj['carrierName'] = this.scenariosDisplayed[columnIndex].carrierName;
    if (this.carrierName.toLowerCase() == 'ups') {
      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientObj['clientName'] = this.selectedCarrier.clientName;
      clientObj['runType'] = 'Dashboard';
      for (let index = 0; index < alteredList.length; index++) {
        alteredList[index].clientId = clientObj['clientId'];
      }
      clientObj['dimDetailsList'] = alteredList;
      var dimTableName: any;
      this.httpClientService.saveOrUpdateDIM(clientObj).subscribe((data: any) => {
        dimTableName = data[0];
      }
      );
    }
    else {
      clientObj['clientId'] = this.fedexClientId;
      clientObj['clientName'] = this.selectedCarrier.clientName;
      clientObj['runType'] = 'Dashboard';
      for (let index = 0; index < alteredList.length; index++) {
        alteredList[index].clientId = clientObj['clientId'];
      }
      clientObj['dimDetailsList'] = alteredList;
      var dimTableName: any;
      this.fedexService.saveOrUpdateDIM(clientObj).subscribe((data: any) => {
        dimTableName = data[0];
      });
    }

    var airMinMaxList: any = [];
    var groundMinMaxList: any = [];
    var intlMinMaxList: any = [];

    await this.getProposalList(this.scenariosDisplayed[columnIndex]);

    this.scenariosDisplayed[columnIndex].airMinMaxList.forEach((data: any) => airMinMaxList.push(Object.assign({}, data)));
    this.scenariosDisplayed[columnIndex].intlMinMaxList.forEach((data: any) => intlMinMaxList.push(Object.assign({}, data)));

    var groundData = this.scenariosDisplayed[columnIndex].groundMinMaxList.filter((data: any) => !(data.service.includes('Sub Total')));
    groundData.forEach((data: any) => groundMinMaxList.push(Object.assign({}, data)));

    //air
    for (let row = 0; row < airMinMaxList.length; row++) {
      var filteredData = this.airProposalList.filter((data: any) => data.shortName == airMinMaxList[row].service);
      filteredData.forEach((data: any) => {
        if (airMinMaxList[row].disMin == airMinMaxList[row].disMax) {
          data.targetDis = airMinMaxList[row].disMin;
        }
      });
    }

    //ground
    for (let row = 0; row < groundMinMaxList.length; row++) {
      var serviceList = groundMinMaxList.filter((data: any) => data.name == groundMinMaxList[row].name);
      if (serviceList.length > 1) {
        if (groundMinMaxList[row + 1] != undefined) {
          if (groundMinMaxList[row].name != groundMinMaxList[row + 1].name) {
            groundMinMaxList[row].weightTo = 1000;
          }
        }
      }

      var serviceName = groundMinMaxList[row].name;
      var fromWeight = Number(groundMinMaxList[row].weightFrom);
      var toWeight = Number(groundMinMaxList[row].weightTo);
      if (groundMinMaxList[row - 1] != undefined) {
        var previousFromWeight = Number(groundMinMaxList[row - 1].weightFrom);
        var previousToWeight = Number(groundMinMaxList[row - 1].weightTo);
      }
      var listNotAvailable = false; //true if both fromweight and to weight is not available,otherwise becomes false
      var trueList = false; // true if both 
      var filteredData = this.groundProposalList.filter((data: any) => {

        if (data.shortName == serviceName && Number(data.weightFrom) >= fromWeight && Number(data.weightTo) <= toWeight) {
          trueList = true;
          return (data.shortName == serviceName && Number(data.weightFrom) >= fromWeight && Number(data.weightTo) <= toWeight);
        }
        else if (data.shortName == serviceName && Number(data.weightFrom) == fromWeight && Number(data.weightTo) != toWeight) {
          return (data.shortName == serviceName && Number(data.weightFrom) == fromWeight && Number(data.weightTo) != toWeight);
        }
        else if (data.shortName == serviceName && Number(data.weightFrom) != fromWeight && Number(data.weightTo) == toWeight) {
          return (data.shortName == serviceName && Number(data.weightFrom) != fromWeight && Number(data.weightTo) == toWeight);
        }
        else {
          return false;
        }

      });

      if (filteredData[0] == undefined) {
        listNotAvailable = true;
      }
      //if from weight or to weight is not found then list with previous weight is taken. 
      if (filteredData[0] == undefined) {
        var filteredData = this.groundProposalList.filter((data: any) => {
          if (data.shortName == serviceName && Number(data.weightFrom) >= previousFromWeight && Number(data.weightTo) <= previousToWeight) {
            return (data.shortName == serviceName && Number(data.weightFrom) >= previousFromWeight && Number(data.weightTo) <= previousToWeight);
          }
          else {
            return false;
          }
        });
      }

      if (listNotAvailable) {
        filteredData.forEach((data: any) => {
          var objectData = Object.assign({}, data);
          objectData.weightFrom = groundMinMaxList[row].weightFrom;
          objectData.weightTo = groundMinMaxList[row].weightTo;
          if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
            objectData.targetDis = groundMinMaxList[row].disMin;
          }
          this.groundProposalList.push(Object.assign({}, objectData));
        });
      }
      else {
        if (trueList) {
          filteredData.forEach((data: any) => {
            if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
              data.targetDis = groundMinMaxList[row].disMin;
            }
          });
        }
        else {
          var duplicateList = [];
          filteredData.forEach((data: any) => duplicateList.push(Object.assign({}, data)));
          filteredData.forEach((data: any) => {
            if (groundMinMaxList[row].disMin == groundMinMaxList[row].disMax) {
              data.targetDis = groundMinMaxList[row].disMin;
            }
            data.weightFrom = groundMinMaxList[row].weightFrom;
            data.weightTo = groundMinMaxList[row].weightTo;
            this.groundProposalList.push(Object.assign({}, data));
          });

        }
      }
    }

    for (let row = 0; row < groundMinMaxList.length; row++) {
      // if (JSON.stringify(groundMinMaxList[row]) !== JSON.stringify(groundMinMaxListOld[row])) {

      var filteredData = this.groundProposalList.filter((data: any) => {
        if (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo)))) {
          (data.shortName == groundMinMaxList[row].name && ((Number(data.weightFrom) == Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) != Number(groundMinMaxList[row].weightTo)) || (Number(data.weightFrom) != Number(groundMinMaxList[row].weightFrom) && Number(data.weightTo) == Number(groundMinMaxList[row].weightTo))))
        }
      });

      if (filteredData[0] != undefined) {
        filteredData.forEach((data: any) => {
          var rowIndex = this.groundProposalList.findIndex((data2: any) => JSON.stringify(data2) == JSON.stringify(data));
          this.groundProposalList.splice(rowIndex, 1);
        });

      }
    }

    //intl
    for (let row = 0; row < intlMinMaxList.length; row++) {
      var filteredData = this.intlProposalList.filter((data: any) => data.shortName == intlMinMaxList[row].service);
      filteredData.forEach((data: any) => {
        if (intlMinMaxList[row].disMin == intlMinMaxList[row].disMax) {
          data.targetDis = intlMinMaxList[row].disMin;
        }
      });
    }

    //minreduction
    for (let row = 0; row < this.netAmountMinMaxList.length; row++) {
      var minType: any;
      if (this.netAmountMinMaxList[row].target1Min.includes('$')) {
        minType = '$';
      }
      else if (this.netAmountMinMaxList[row].target1Min.includes('%')) {
        minType = '%';
      }
      else {
        minType = '%';
      }

      var filteredData = this.airProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
      if (filteredData[0] != undefined) {
        filteredData.forEach((data: any) => {
          if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
            data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
          }
          data.minType = minType;
        });
      }
      var filteredData = this.groundProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
      if (filteredData[0] != undefined) {
        filteredData.forEach((data: any) => {
          if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
            data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
          }
          data.minType = minType;
        });
      }

      if (this.netAmountMinMaxList[row].service != undefined) {
        if (this.netAmountMinMaxList[row].service.toLowerCase().includes('international')) {
          var minServiceList = this.minimumReductionList.filter((data: any) => data.service == this.netAmountMinMaxList[row].service);
          var intlServices = this.getUniqueService(minServiceList, 'subGroup');
          intlServices.forEach((serviceName: any) => {
            var filteredData = this.intlProposalList.filter((data: any) => data.ratesheetName == serviceName);
            if (filteredData[0] != undefined) {
              filteredData.forEach((data: any) => {
                if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                  data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
                }
                data.minType = minType;
              });
            }
          })
        }
        else {
          var filteredData = this.intlProposalList.filter((data: any) => data.shortName == this.netAmountMinMaxList[row].service);
          if (filteredData[0] != undefined) {
            filteredData.forEach((data: any) => {
              if (this.netAmountMinMaxList[row].target1Min.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '') == this.netAmountMinMaxList[row].target1Max.toString().replaceAll('%', '').replaceAll('$', '').replaceAll(',', '')) {
                data.targetMin = this.netAmountMinMaxList[row].target1Min.replaceAll('%', '').replaceAll('$', '').replaceAll(',', '');
              }
              data.minType = minType;
            });
          }
        }
      }
    }
    clientObj = {};
    clientObj['targetId'] = Number(this.scenariosDisplayed[columnIndex].targetId);
    clientObj['carrierName'] = this.scenariosDisplayed[columnIndex].carrierName;
    clientObj['runType'] = 'Dashboard';
    var freightList = [];
    for (let index = 0; index < this.airProposalList.length; index++) {
      this.airProposalList[index].frtRatesheetId = 0;
      this.airProposalList[index].type = "future";
      this.airProposalList[index].targetId = clientObj['targetId'];
      freightList.push(this.airProposalList[index]);
    }
    // return false;
    for (let index = 0; index < this.groundProposalList.length; index++) {
      this.groundProposalList[index].frtRatesheetId = 0;
      this.groundProposalList[index].type = "future";
      this.groundProposalList[index].targetId = clientObj['targetId'];
      freightList.push(this.groundProposalList[index]);
    }

    for (let index = 0; index < this.intlProposalList.length; index++) {
      this.intlProposalList[index].frtRatesheetId = 0;
      this.intlProposalList[index].type = "future";
      this.intlProposalList[index].targetId = clientObj['targetId'];
      freightList.push(this.intlProposalList[index]);
    }

    if (this.carrierName.toLowerCase() == 'ups') {
      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientObj['clientName'] = this.selectedCarrier.clientName;
      for (let index = 0; index < freightList.length; index++) {
        freightList[index].clientId = clientObj['clientId'];
      }
      clientObj['freightDetailsList'] = freightList;
      var tableName = await this.httpClientService.saveOrUpdateDiscounts(clientObj).toPromise();
      var targetObj: any = {};
      targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      targetObj['targetId'] = clientObj['targetId']
      targetObj['carrierName'] = this.scenariosDisplayed[columnIndex].carrierName;
      targetObj['type'] = 'Edit';
      targetObj['tableName'] = tableName[0].runType;
      targetObj['dimTableName'] = dimTableName.runType;
      var result = await this.httpClientService.generateProposalDIM(targetObj).toPromise();
    }
    else {
      clientObj['clientId'] = this.fedexClientId;;
      clientObj['clientName'] = this.selectedCarrier.clientName;
      for (let index = 0; index < freightList.length; index++) {
        freightList[index].clientId = clientObj['clientId'];
      }
      clientObj['freightDetailsList'] = freightList;
      var tableName = await this.fedexService.saveOrUpdateDiscounts(clientObj).toPromise();
      var targetObj: any = {};
      targetObj['clientId'] = this.fedexClientId;
      targetObj['targetId'] = clientObj['targetId'];
      targetObj['carrierName'] = this.scenariosDisplayed[columnIndex].carrierName;
      targetObj['type'] = 'Edit';
      targetObj['tableName'] = tableName[0].runType;
      targetObj['dimTableName'] = dimTableName.runType;
      var result = await this.fedexService.generateProposalDIM(targetObj).toPromise();
    }
    var data = { columnIndex: columnIndex, freightList: result, dimList: alteredList };
    this.dialogRef.close(data);
    this.cd.detectChanges();
    this.closeLoading();

  }
  getUniqueService(data: any, type: any) {
    let distinctValues: any = [];
    const arrayUniqueByService = [...new Map(data.map((item: any) =>
      [item[type], item])).values()];
    arrayUniqueByService.forEach((data: any) => {
      distinctValues.push(data[type]);
    });
    return distinctValues;
  }
}

