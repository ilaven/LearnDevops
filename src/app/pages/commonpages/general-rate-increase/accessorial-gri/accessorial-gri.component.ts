import { Component, OnInit, Optional, Inject, signal } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { LoaderService } from "src/app/core/services/loader.service";
import { CreateProposalGRIComponent } from "../create-proposal-gri/create-proposal-gri.component";
import { ResetPopupGRIComponent } from "../reset-popup-gri/reset-popup-gri.component";


@Component({
  selector: 'app-accessorial-gri',
  templateUrl: './accessorial-gri.component.html',
  styleUrls: ['./accessorial-gri.component.css'],
  standalone: false
})
export class AccessorialGRIComponent implements OnInit {
  serviceName;
  isLoading: any = signal<any>(false);
  editable = false;
  editableCommon = false;
  CurrentSavingsCombinedList: any = [];
  AccLookUpListService: any = [];
  accDisTypeValuesArray: string[] = [];
  AccCurrentDetailsList: any = [];
  AccTargetDetailsList: any = [];
  AccTargetDetailsListSignal = signal<any>([]);
  displayedColumns: any = ['service', 'subGroup', 'currentDis', 'currentSpend', 'checkBox'];
  displayedColumnsTarget: any = ['service', 'subGroup', 'targetDis', 'targetSpend', 'checkBox'];
  columns = signal<any>([
    { field: 'Service', fieldVal: 'service' },
    { field: 'Service Type', fieldVal: 'subGroup' },
    { field: 'Discount', fieldVal: 'currentDis' },
    { field: 'Net Spend', fieldVal: 'currentSpend' },
    { field: 'Service Break Up', fieldVal: 'checkBox' }
  ]);
  columnsTarget = signal<any>([
    { field: 'Service', fieldVal: 'service' },
    { field: 'Service Type', fieldVal: 'subGroup' },
    { field: 'Discount', fieldVal: 'targetDis' },
    { field: 'Net Spend', fieldVal: 'targetSpend' },
    { field: 'Service Break Up', fieldVal: 'checkBox' }
  ])
  spans: any = [];
  targetIdList: any = [];
  targetNameList: any = [];
  carrierName: any = '';
  accDisTypeValues: string[] = ['$', '%'];
  accServiceTypeValue: string[] = ['Air', 'Ground', 'International', 'Surepost']
  spansIntl: any = [];
  AccDetailsListNew: any = [];
  dataSource: any = [];
  dataSourceSignal = signal<any>([]);
  tabIndex = 0;
  scenariosDisplayed: any = [];
  selectedScenario: any = [];
  selectedCarrier: any = [];
  randomNumber: any;
  currentAccCheckList: string[] = [];
  service: string;
  adminFlag: any;
  themeoption: any;
  constructor(public dialogRef: MatDialogRef<AccessorialGRIComponent>, public dialog: MatDialog, private loaderService: LoaderService,
    private httpclient: HttpClientService, private fedexService: HttpfedexService, private cookiesService: CookiesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.service = data.service;
    this.serviceName = data.serviceName;
    this.targetIdList = data.targetIdList;
    this.targetNameList = data.targetNameList;
    this.carrierName = data.carrier.carrierName;
    this.scenariosDisplayed = data.targetList;
    this.selectedCarrier = data.carrier;
    this.currentAccCheckList = data.currentCheckList;
    this.adminFlag = data.adminFlag;
  }
  async ngOnInit(): Promise<void> {
    await this.getData();
    for (let index in this.AccCurrentDetailsList) {
      this.AccDetailsListNew.push(this.AccCurrentDetailsList[index]);
    }
  }

  async getData() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    var clientDetail: any = {};
    clientDetail['service'] = this.serviceName;
    var targetIdList = this.targetIdList;
    if (this.carrierName.toLowerCase() == 'ups') {
      clientDetail['clientId'] = this.cookiesService.getCookieItem('clientId');
      this.httpclient.fetchGRIAccLookUp(clientDetail).subscribe(async data => {
        this.AccCurrentDetailsList = await data;
        this.dataSource = this.AccCurrentDetailsList;
        this.dataSourceSignal.set(this.dataSource);
      });
      if (targetIdList.length > 0) {
        for (let index = 0; index < targetIdList.length; index++) {
          clientDetail['targetId'] = targetIdList[index];
          var data = await this.httpclient.fetchGRIAccLookUpTarget(clientDetail).toPromise();
          var targetData = {
            targetId: targetIdList[index],
            targetName: this.targetNameList[index],
            targetList: data,
            targetAccCheckList: this.scenariosDisplayed[index].targetAccCheckList,
            year: this.scenariosDisplayed[index].year
          }
          await this.AccTargetDetailsList.push(targetData);
        }
        this.AccTargetDetailsListSignal.set(this.AccTargetDetailsList);
      }
      this.closeLoading();
    }
    else {
      clientDetail['clientId'] = this.data.fedexId;
      this.fedexService.fetchGRIAccLookUp(clientDetail).subscribe(async (data: any) => {
        this.AccCurrentDetailsList = await data;
        this.dataSource = this.AccCurrentDetailsList;
        this.dataSourceSignal.set(this.dataSource);
      });
      if (targetIdList.length > 0) {
        for (let index = 0; index < targetIdList.length; index++) {
          clientDetail['targetId'] = targetIdList[index];
          var data = await this.fedexService.fetchGRIAccLookUpTarget(clientDetail).toPromise();
          var targetData = {
            targetId: targetIdList[index],
            targetName: this.targetNameList[index],
            targetList: data,
            targetAccCheckList: this.scenariosDisplayed[index].targetAccCheckList,
            year: this.scenariosDisplayed[index].year
          }
          await this.AccTargetDetailsList.push(targetData);
        }
        this.AccTargetDetailsListSignal.set(this.AccTargetDetailsList);
      }
      this.closeLoading();
    }
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
    const dialogConfig = this.dialog.open(CreateProposalGRIComponent, {
      disableClose: true,
      width: '90vw',
      height: '90vh',
      panelClass: panelClass,
      data: {
        valueClick: clickValue,
        carrierDetails: this.selectedCarrier,
        target: this.selectedScenario,
        targetList: this.scenariosDisplayed,
        fedexId: this.data.fedexId,
        tabIndex: 5,
        serviceName: this.serviceName,
        targetDetails: [],
      },
    });
    dialogConfig.afterClosed().subscribe(async data => {
      this.dialogRef.close(data);
    });
  }

  save(type: any) {
  }
  close() {
    var data = { selectedList: this.currentAccCheckList, targetList: this.AccTargetDetailsList, service: this.service, serviceName: this.serviceName }
    this.dialogRef.close(data);
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
  onSelect(event: any, ratesheetGrouping: string, columnNumber?: number) {
    var ratesheetName = ratesheetGrouping.toLowerCase();
    var check = event.target.checked;
    if (columnNumber == undefined) {
      if (check)
        this.currentAccCheckList.push(ratesheetName + this.serviceName.toLowerCase());
      else
        this.currentAccCheckList = this.currentAccCheckList.filter(data => data != ratesheetName + this.serviceName.toLowerCase());
    }
    else {
      if (check)
        this.AccTargetDetailsList[columnNumber].targetAccCheckList.push(ratesheetName + this.serviceName.toLowerCase());
      else
        this.AccTargetDetailsList[columnNumber].targetAccCheckList = this.AccTargetDetailsList[columnNumber].targetAccCheckList.filter((data: any) => data != ratesheetName + this.serviceName.toLowerCase());
      this.AccTargetDetailsListSignal.set(this.AccTargetDetailsList);
    }
  }
  delete() {
    let panelClass = "";
    if (this.themeoption == 'dark') {
      panelClass = 'page-dark'
    }
    var alertDialog = this.dialog.open(ResetPopupGRIComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { message: "Are you sure you want to delete??" },
    });

    alertDialog.afterClosed().subscribe(
      async result => {
        let message = '';
        let APIresult = false;
        var clientObj: any = {};
        clientObj['clientId'] = await this.cookiesService.getCookie("clientId");
        clientObj['serviceType'] = 'Accessorial';
        clientObj['serviceName'] = this.serviceName;
        this.openLoading();
        if (result == true) {
          if (this.carrierName.toLowerCase() == 'ups') {
            await this.httpclient.deleteServiceGRI(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = this.serviceName + " deleted successfully";
                APIresult = true;
              } else
                message = "Oops something went wrong!";
            }).catch((err) => { message = "Oops something went wrong!"; });
          } else {
            await this.fedexService.deleteServiceGRIFedEx(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = this.serviceName + " deleted successfully";
                APIresult = true;
              } else
                message = "Oops something went wrong!";
            }).catch((err) => { message = "Oops something went wrong!"; });
          }
          var resetDialog = this.dialog.open(AlertPopupComponent, {
            disableClose: true,
            width: '470px',
            height: 'auto',
            panelClass: panelClass,
            data: { pageValue: message },
          })
          resetDialog.afterClosed().subscribe(res => {
            if (APIresult)
              this.dialogRef.close("delete");
          })
        }
        this.closeLoading();
      });
  }
  isChecked(row: any, serviceName: string): boolean {
    const group = row?.ratesheetGrouping?.toLowerCase() || '';
    const service = serviceName?.toLowerCase() || '';

    return this.currentAccCheckList.includes(group + service);
  }
}