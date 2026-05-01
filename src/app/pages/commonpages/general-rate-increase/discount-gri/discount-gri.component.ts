import { Component, OnInit, Optional, Inject, signal } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { CreateProposalGRIComponent } from "../create-proposal-gri/create-proposal-gri.component";
import { ResetPopupGRIComponent } from "../reset-popup-gri/reset-popup-gri.component";
import { LoaderService } from "src/app/core/services/loader.service";


@Component({
  selector: 'app-discount-gri',
  templateUrl: './discount-gri.component.html',
  styleUrls: ['./discount-gri.component.css'],
  standalone: false
})
export class DiscountGRIComponent implements OnInit {
  serviceName;
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
  targetIdList = [];
  targetNameList = [];
  carrierName: any = '';
  selectedCarrier: any = [];
  randomNumber: any;
  tabIndex = 0;
  scenariosDisplayed: any = [];
  selectedScenario: any = [];
  currentMin: any = [];
  currentMinSignal: any = signal<any>([]);
  targetMin: any = [];
  columnsMin: any = [];
  columnsMinSignal: any = signal<any>([]);
  dataSource: any = [];
  dataSourceSignal: any = signal<any>([]);
  dataSourceTargetSavings = [];
  dataSourceProposalSavings = [];
  zoneValuesList: any = [];
  freightTargetSavingsList: any = [];
  freightTargetSavingsListSignal: any = signal<any>([]);
  serviceType;
  themeoption: any;
  newService;
  adminFlag: any;
  constructor(public dialogRef: MatDialogRef<DiscountGRIComponent>, public dialog: MatDialog, private loaderService: LoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService, private cookiesService: CookiesService,
    private fedexService: HttpfedexService) {

    this.serviceName = data.service;
    this.targetIdList = data.targetIdList;
    this.targetNameList = data.targetNameList;
    this.scenariosDisplayed = data.targetList;
    this.selectedCarrier = data.carrier;
    this.carrierName = data.carrier.carrierName;
    this.serviceType = data.serviceType;
    this.newService = data.newService;
    this.adminFlag = data.adminFlag;
  }

  async ngOnInit(): Promise<void> {
    this.openLoading();
    await this.getDiscountDetails();
    await this.getMinDetails();
    this.closeLoading();
  }

  async getDiscountDetails() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    var userObj: any = {};
    userObj['targetId'] = this.targetIdList.toString();;
    userObj['service'] = this.serviceName;
    if (this.carrierName.toLowerCase() == 'ups') {
      userObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      var result = await this.httpClientService.fetchGRIFreightRatesheet(userObj).toPromise();
      this.dataSource = await result.filter((element: any) => element.criteria == "Current");
      this.dataSourceSignal.set(this.dataSource)
      if (this.targetIdList.length > 0) {
        for (let index = 0; index < this.scenariosDisplayed.length; index++) {
          var filteredData = await result.filter((element: any) => element.targetId == this.scenariosDisplayed[index].targetId && element.criteria != "Current");
          var targetData = {
            targetId: this.scenariosDisplayed[index].targetId,
            targetName: this.scenariosDisplayed[index].targetName,
            targetList: [],
            service: '',
            targetMinList: [],
            columns: [],
            displayedColumns: [],
            columnsMin: [],
            displayedColumnsMin: [],
            carrier: this.scenariosDisplayed[index].carrierName,
            year: this.scenariosDisplayed[index].year,
          }
          if (filteredData.length > 0) {
            targetData.targetList = filteredData;
            targetData.service = filteredData[0].service;
          }

          this.freightTargetSavingsList.push(targetData);
        }
      }
      this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
      for (let index in this.dataSource) {
        this.dataSource[index].weightFrom = Number(this.dataSource[index].weightFrom);
        this.dataSource[index].weightTo = Number(this.dataSource[index].weightTo);
      }

      this.dataSource.sort((a: any, b: any) => a.weightFrom - b.weightFrom);
      this.dataSourceSignal.set(this.dataSource)
      for (let row = 0; row < this.freightTargetSavingsList.length; row++) {
        this.TargetSavingsList = this.freightTargetSavingsList[row].targetList;
        for (let index in this.TargetSavingsList) {
          this.TargetSavingsList[index].weightFrom = Number(this.TargetSavingsList[index].weightFrom);
          this.TargetSavingsList[index].weightTo = Number(this.TargetSavingsList[index].weightTo);
        }
        this.TargetSavingsList.sort((a: any, b: any) => a.weightFrom - b.weightFrom);
        this.freightTargetSavingsList[row].targetData = this.TargetSavingsList;
      }
      this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
      var result = await this.httpClientService.fetchGRIRatesheetLookUp(userObj).toPromise();

      result.forEach((element: any, index: any) => {
        if (Number(element.field).toString() == 'NaN') {
          this.ZoneLookupList.push({ service: element.service, field: element.field, fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
        }
        else {
          this.ZoneLookupList.push({ service: element.service, field: Number(element.field), fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
        }
      })
      this.ZoneLookupList.sort((a: any, b: any) => {
        if (Number(a.field).toString() != 'NaN')
          return a.field - b.field;
        else
          return a.field.localeCompare(b.field);
      });
      this.ZoneLookupList.sort((a: any, b: any) => a.carrier.localeCompare(b.carrier));
      await this.displayedColumnsSet();
      await this.displayedColumnsMinSet();

      for (let index = 0; index < this.freightTargetSavingsList.length; index++) {
        await this.displayedColumnsSetTarget(this.freightTargetSavingsList[index].carrier.toLowerCase(), index);
        await this.displayedColumnsMinSetTarget(this.freightTargetSavingsList[index].carrier.toLowerCase(), index);
      }
      this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
    }
    else {
      userObj['clientId'] = this.data.fedexId;

      var result: any = await this.fedexService.fetchGRIFreightRatesheet(userObj).toPromise();
      this.dataSource = await result.filter((element: any) => element.criteria == "Current");
      if (this.targetIdList.length > 0) {
        for (let index = 0; index < this.targetIdList.length; index++) {

          var filteredData = await result.filter((element: any) => element.targetId == this.scenariosDisplayed[index].targetId && element.criteria != "Current");
          var targetData = {
            targetId: this.scenariosDisplayed[index].targetId,
            targetName: this.scenariosDisplayed[index].targetName,
            targetList: [],
            service: '',
            targetMinList: [],
            columns: [],
            displayedColumns: [],
            columnsMin: [],
            displayedColumnsMin: [],
            carrier: this.scenariosDisplayed[index].carrierName,
            year: this.scenariosDisplayed[index].year,
          }

          if (filteredData.length > 0) {
            targetData.targetList = filteredData;
            targetData.service = filteredData[0].service;
          }
          this.freightTargetSavingsList.push(targetData);
        }
        this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
      }

      for (let index in this.dataSource) {
        this.dataSource[index].weightFrom = Number(this.dataSource[index].weightFrom);
        this.dataSource[index].weightTo = Number(this.dataSource[index].weightTo);
      }

      this.dataSource.sort((a: any, b: any) => a.weightFrom - b.weightFrom);
      this.dataSourceSignal.set(this.dataSource)

      for (let row = 0; row < this.freightTargetSavingsList.length; row++) {
        this.TargetSavingsList = this.freightTargetSavingsList[row].targetList;
        for (let index in this.TargetSavingsList) {
          this.TargetSavingsList[index].weightFrom = Number(this.TargetSavingsList[index].weightFrom);
          this.TargetSavingsList[index].weightTo = Number(this.TargetSavingsList[index].weightTo);
        }
        if (this.TargetSavingsList != null) {
          this.TargetSavingsList.sort((a: any, b: any) => a.weightFrom - b.weightFrom);
        }
        this.freightTargetSavingsList[row].targetData = this.TargetSavingsList;
      }
      this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
      await this.fedexService.fetchGRIRatesheetLookUp(userObj).toPromise().then(
        async (result: any) => {
          result.forEach((element: any, index: any) => {
            if (Number(element.field).toString() == 'NaN') {
              this.ZoneLookupList.push({ service: element.service, field: element.field, fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
            }
            else {
              this.ZoneLookupList.push({ service: element.service, field: Number(element.field), fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
            }

          })
          this.ZoneLookupList.sort((a: any, b: any) => a.field - b.field);
          this.ZoneLookupList.sort((a: any, b: any) => a.carrier.localeCompare(b.carrier));
          await this.displayedColumnsSet();
          await this.displayedColumnsMinSet();
          var zoneList = this.zoneLookupListService.filter((data: any) => data.carrier == this.carrierName.toLowerCase());

          if (this.dataSource[0] != undefined) {
            if (this.serviceType.toLowerCase() != 'air' && this.serviceType.toLowerCase() != 'ground') {
              await this.getDistinctList('dataSource', zoneList);
            }
          }
          for (let index = 0; index < this.freightTargetSavingsList.length; index++) {
            await this.displayedColumnsSetTarget(this.freightTargetSavingsList[index].carrier.toLowerCase(), index);
            await this.displayedColumnsMinSetTarget(this.freightTargetSavingsList[index].carrier.toLowerCase(), index);
            var zoneList = this.zoneLookupListService.filter((data: any) => data.carrier == this.freightTargetSavingsList[index].carrier.toLowerCase());
            if (this.freightTargetSavingsList[index].targetList[0] != undefined) {
              if (this.serviceType.toLowerCase() != 'air' && this.serviceType.toLowerCase() != 'ground') {
                var distinctList = [];
                distinctList.push(this.freightTargetSavingsList[index].targetList[0]);
                for (let i = 0; i < this.freightTargetSavingsList[index].targetList.length; i++) {
                  var object1 = Object.assign({}, this.freightTargetSavingsList[index].targetList[i]);
                  var object2 = Object.assign({}, this.freightTargetSavingsList[index].targetList[i + 1]);
                  var flag = false;

                  if ((i + 1) == this.freightTargetSavingsList[index].targetList.length) {
                    break;
                  }
                  if (object1.containerType != object2.containerType) {
                    distinctList.push(object2);
                    continue;
                  }
                  else {
                    for (let j = 0; j < zoneList.length; j++) {
                      if (object1[zoneList[j].fieldVal] == object2[zoneList[j].fieldVal]) {
                        flag = true;
                      }
                      else {
                        flag = false;
                        distinctList.push(object2);
                        break;
                      }
                    }
                    if (flag == true) {
                      distinctList[distinctList.length - 1].weightTo = object2.weightTo;
                    }
                  }
                }

                this.freightTargetSavingsList[index].targetList = [];
                await distinctList.forEach((data: any) => this.freightTargetSavingsList[index].targetList.push(Object.assign({}, data)));
              }
            }
          }
          this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
        },
        error => {
          console.log(error);
        }
      )
    }


  }

  removeZeroColumns(data: any[], columnsToCheck: string[], removeData: any[]): any[] {
    const columnIndicesToRemove: number[] = [];
    const numRows = data.length;
    const zeroZoneNameList: string[] = [];
    // Find the columns to remove
    for (let col = 0; col < columnsToCheck.length; col++) {
      const columnName = columnsToCheck[col];
      const isAllZero = data.every((row) => row[columnName] === "0.00");
      if (isAllZero) {
        zeroZoneNameList.push(columnName);
        columnIndicesToRemove.push(col);
      }
    }

    const newArray = removeData.filter((item) => !zeroZoneNameList.includes(item));
    return newArray;
  }

  async getMinDetails() {

    var clientObj: any = {};
    clientObj['type'] = "create";
    clientObj['carrier'] = this.carrierName;
    clientObj['service'] = this.serviceName;
    var containerType = ['ltr', 'doc', 'pak', 'pkg'];
    if (this.carrierName.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.data.fedexId;
      var currentMinData = await this.fedexService.fetchGRIMinDetailsPopup(clientObj).toPromise();
      var distinctServices = await currentMinData.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo) === i
      );
      var zoneList = this.zoneLookupListService.filter((data: any) => data.carrier == this.carrierName.toLowerCase());
      for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
        var sampleObject: any = {};
        var filteredData = currentMinData.filter((data: any) => data.containerType == distinctServices[serviceIndex].containerType && data.weightFrom == distinctServices[serviceIndex].weightFrom && data.weightTo == distinctServices[serviceIndex].weightTo);
        sampleObject['service'] = filteredData[0].service;
        sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
        sampleObject['weightFrom'] = Number(filteredData[0].weightFrom);
        sampleObject['weightTo'] = Number(filteredData[0].weightTo);
        sampleObject['netSpend'] = filteredData[0].netSpend;
        sampleObject['subGroup'] = filteredData[0].subGroup;
        sampleObject['minType'] = filteredData[0].minType;
        for (let index = 0; index < zoneList.length; index++) {
          for (let row = 0; row < filteredData.length; row++) {
            if (Number(zoneList[index].field).toString() != 'NaN') {
              if (Number(filteredData[row].zone1) == Number(zoneList[index].field)) {
                sampleObject[zoneList[index].fieldVal] = filteredData[row].targetMin;
              }
            }
            else {
              if (filteredData[row].zone1 == zoneList[index].field) {
                sampleObject[zoneList[index].fieldVal] = filteredData[row].targetMin;
              }
            }
          }
        }
        this.currentMin.push(sampleObject);
      }
      this.currentMin = this.currentMin.sort((a: any, b: any) => {
        if (a.weightFrom != null && b.weightFrom != null)
          return a.weightFrom - b.weightFrom;
        else
          return false;
      });

      this.currentMin = this.currentMin.sort((a: any, b: any) => {
        if (a.containerType != null && a.containerType != '') {
          return containerType.indexOf(a.containerType.toLowerCase()) - containerType.indexOf(b.containerType.toLowerCase())
        } else
          return false;
      });

      if (currentMinData[0] != undefined) {
        if (currentMinData[0].serviceType.toLowerCase() == 'intl') {
          this.getDistinctList('currentMin', zoneList);
        }
      }
      this.currentMin = new MatTableDataSource(this.currentMin);
      this.currentMinSignal.set(this.currentMin)
      //set TargetMin
      clientObj = {};
      clientObj['type'] = "Edit";
      clientObj['clientId'] = this.data.fedexId;
      clientObj['service'] = this.serviceName;
      for (let targetIndex = 0; targetIndex < this.freightTargetSavingsList.length; targetIndex++) {
        if (this.freightTargetSavingsList[targetIndex].targetId != null) {
          clientObj['targetId'] = this.freightTargetSavingsList[targetIndex].targetId;
          var targetMinData = await this.fedexService.fetchGRIMinDetailsPopup(clientObj).toPromise();
          var distinctServices = await targetMinData.filter(
            (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType && Number(t.weightFrom) == Number(thing.weightFrom) && Number(t.weightTo) == Number(thing.weightTo)) === i
          );
          var zoneList = this.zoneLookupListService.filter((data: any) => data.carrier == this.freightTargetSavingsList[targetIndex].carrier.toLowerCase());
          for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
            var sampleObject: any = {};
            var filteredData = targetMinData.filter((data: any) => data.containerType == distinctServices[serviceIndex].containerType && data.weightFrom == distinctServices[serviceIndex].weightFrom && data.weightTo == distinctServices[serviceIndex].weightTo);
            sampleObject['service'] = filteredData[0].service;
            sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
            sampleObject['weightFrom'] = Number(filteredData[0].weightFrom);
            sampleObject['weightTo'] = Number(filteredData[0].weightTo);
            sampleObject['netSpend'] = filteredData[0].netSpend;
            sampleObject['subGroup'] = filteredData[0].subGroup;
            sampleObject['minType'] = filteredData[0].minType;
            for (let index = 0; index < zoneList.length; index++) {
              for (let row = 0; row < filteredData.length; row++) {
                if (Number(zoneList[index].field).toString() != 'NaN') {
                  if (Number(filteredData[row].zone1) == Number(zoneList[index].field)) {
                    sampleObject[zoneList[index].fieldVal] = filteredData[row].targetMin;
                  }
                }
                else {
                  if (filteredData[row].zone1 == zoneList[index].field) {
                    sampleObject[zoneList[index].fieldVal] = filteredData[row].targetMin;
                  }
                }
              }
            }
            this.targetMin.push(sampleObject);
          }

          this.targetMin = this.targetMin.sort((a: any, b: any) => {
            if (a.weightFrom != null && b.weightFrom != null)
              return a.weightFrom - b.weightFrom;
            else
              return false;
          });

          this.targetMin = this.targetMin.sort((a: any, b: any) => {
            if (a.containerType != null && a.containerType != '') {
              return containerType.indexOf(a.containerType.toLowerCase()) - containerType.indexOf(b.containerType.toLowerCase())
            } else
              return false;
          });
          if (targetMinData[0] != undefined) {
            if (targetMinData[0].serviceType.toLowerCase() == 'intl') {
              await this.getDistinctList('targetMin', zoneList);
            }
          }
          this.freightTargetSavingsList[targetIndex].targetMinList = new MatTableDataSource(this.targetMin);
          this.targetMin = [];
        }
      } this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)

    }
    else {
      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      //set currentmin
      var currentMinData = await this.httpClientService.fetchGRIMinDetailsPopup(clientObj).toPromise();
      var distinctServices = await currentMinData.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo) === i
      );
      var zoneList = this.zoneLookupListService.filter((data: any) => data.carrier == this.carrierName.toLowerCase());
      for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
        var sampleObject: any = {};
        var filteredData = currentMinData.filter((data: any) => data.containerType == distinctServices[serviceIndex].containerType && data.weightFrom == distinctServices[serviceIndex].weightFrom && data.weightTo == distinctServices[serviceIndex].weightTo);
        sampleObject['service'] = filteredData[0].service;
        sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
        sampleObject['weightFrom'] = Number(filteredData[0].weightFrom);
        sampleObject['weightTo'] = Number(filteredData[0].weightTo);
        sampleObject['netSpend'] = filteredData[0].netSpend;
        sampleObject['subGroup'] = filteredData[0].subGroup;
        sampleObject['minType'] = filteredData[0].minType;
        for (let index = 0; index < zoneList.length; index++) {
          for (let row = 0; row < filteredData.length; row++) {
            if (Number(filteredData[row].zone1) == Number(zoneList[index].field)) {
              sampleObject[zoneList[index].fieldVal] = filteredData[row].targetMin
            }
          }
        }
        this.currentMin.push(sampleObject);
      }
      this.currentMin = this.currentMin.sort((a: any, b: any) => {
        if (a.weightFrom != null && a.weightFrom != '')
          return a.weightFrom - b.weightFrom; else
          return false;
      });

      this.currentMin = this.currentMin.sort((a: any, b: any) => {
        if (a.containerType != null && a.containerType != '') {
          return containerType.indexOf(a.containerType.toLowerCase()) - containerType.indexOf(b.containerType.toLowerCase())
        } else
          return false;
      });

      this.currentMin = new MatTableDataSource(this.currentMin);
      this.currentMinSignal.set(this.currentMin)
      clientObj = {};
      clientObj['type'] = "Edit";
      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientObj['service'] = this.serviceName;
      for (let targetIndex = 0; targetIndex < this.freightTargetSavingsList.length; targetIndex++) {
        if (this.freightTargetSavingsList[targetIndex].targetId != null) {

          clientObj['targetId'] = this.freightTargetSavingsList[targetIndex].targetId;
          var targetMinData = await this.httpClientService.fetchGRIMinDetailsPopup(clientObj).toPromise();
          var distinctServices = await targetMinData.filter(
            (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType && Number(t.weightFrom) == Number(thing.weightFrom) && Number(t.weightTo) == Number(thing.weightTo)) === i
          );
          var zoneList = this.zoneLookupListService.filter((data: any) => data.carrier == this.freightTargetSavingsList[targetIndex].carrier.toLowerCase());
          for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
            var sampleObject: any = {};
            var filteredData = targetMinData.filter((data: any) => data.containerType == distinctServices[serviceIndex].containerType && data.weightFrom == distinctServices[serviceIndex].weightFrom && data.weightTo == distinctServices[serviceIndex].weightTo);
            sampleObject['service'] = filteredData[0].service;
            sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
            sampleObject['weightFrom'] = Number(filteredData[0].weightFrom);
            sampleObject['weightTo'] = Number(filteredData[0].weightTo);
            sampleObject['netSpend'] = filteredData[0].netSpend;
            sampleObject['subGroup'] = filteredData[0].subGroup;
            sampleObject['minType'] = filteredData[0].minType;
            for (let index = 0; index < zoneList.length; index++) {
              for (let row = 0; row < filteredData.length; row++) {
                if (Number(filteredData[row].zone1) == Number(zoneList[index].field)) {
                  sampleObject[zoneList[index].fieldVal] = filteredData[row].targetMin
                }
              }
            }
            this.targetMin.push(sampleObject);
          }

          this.targetMin = this.targetMin.sort((a: any, b: any) => {
            if (a.weightFrom != null && b.weightFrom != null)
              return a.weightFrom - b.weightFrom;
            else
              return false;
          });

          this.targetMin = this.targetMin.sort((a: any, b: any) => {
            if (a.containerType != null && a.containerType != '') {
              return containerType.indexOf(a.containerType.toLowerCase()) - containerType.indexOf(b.containerType.toLowerCase())
            }
            else
              return false;
          });
          this.freightTargetSavingsList[targetIndex].targetMinList = new MatTableDataSource(this.targetMin);
          this.targetMin = [];
          this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
        }
      }
    }

  }

  async getDistinctList(ListName: any, zoneList: any) {
    var distinctList = [];
    distinctList.push((this as any)[ListName][0]);
    for (let i = 0; i < (this as any)[ListName].length; i++) {
      var object1 = Object.assign({}, (this as any)[ListName][i]);
      var object2 = Object.assign({}, (this as any)[ListName][i + 1]);
      var flag = false;
      if ((i + 1) == (this as any)[ListName].length) {
        break;
      }
      if (object1.containerType != object2.containerType) {
        distinctList.push(object2);
        continue;
      }
      else {
        for (let j = 0; j < zoneList.length; j++) {
          if (object1[zoneList[j].fieldVal] == object2[zoneList[j].fieldVal]) {
            flag = true;
          }
          else {
            flag = false;
            distinctList.push(object2);
            break;
          }
        }
        if (flag == true) {
          distinctList[distinctList.length - 1].weightTo = object2.weightTo;
        }
      }
    }

    (this as any)[ListName] = [];
    await distinctList.forEach((data: any) => (this as any)[ListName].push(Object.assign({}, data)));
  }

  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }
  async displayedColumnsMinSet() {
    this.columnsMin = [];
    this.columnsMinSignal.set([]);
    this.zoneLookupListService = [];
    this.displayedColumnsMin = [];
    for (var loop = 0; loop < this.ZoneLookupList.length; loop++) {
      this.zoneLookupListService.push(this.ZoneLookupList[loop]);
    }
    this.columnsMin.push({ service: this.serviceName, field: 'Container Type', fieldVal: 'containerType' });
    this.columnsMin.push({ service: this.serviceName, field: 'From Weight', fieldVal: 'weightFrom' });
    this.columnsMin.push({ service: this.serviceName, field: 'To Weight', fieldVal: 'weightTo' });
    this.columnsMinSignal.set(this.columnsMin);
    this.displayedColumnsMin.push('containerType');
    this.displayedColumnsMin.push('weightFrom');
    this.displayedColumnsMin.push('weightTo');
    var columnObject = await this.zoneLookupListService.filter((currentSavings: any) => currentSavings.carrier == this.carrierName.toLowerCase());
    columnObject.forEach((element: any) => {
      this.columnsMin.push(element);
    });

    for (var loop = 0; loop < columnObject.length; loop++) {
      var zoneValue = columnObject[loop]['fieldVal'];
      this.displayedColumnsMin.push(zoneValue);
    }

    this.columnsMin.push({ service: this.serviceName, field: 'Net Spend', fieldVal: 'netSpend' });
    this.displayedColumnsMin.push('netSpend');
    this.columnsMinSignal.set(this.columnsMin);

  }

  async displayedColumnsSet() {

    this.columns = [];
    this.zoneLookupListService = [];
    this.displayedColumns = [];


    for (var loop = 0; loop < this.ZoneLookupList.length; loop++) {
      this.zoneLookupListService.push(this.ZoneLookupList[loop]);
    }

    this.columns.push({ service: this.serviceName, field: 'Container Type', fieldVal: 'containerType' });
    this.columns.push({ service: this.serviceName, field: 'From Weight', fieldVal: 'weightFrom' });
    this.columns.push({ service: this.serviceName, field: 'To Weight', fieldVal: 'weightTo' });

    this.displayedColumns.push('containerType');
    this.displayedColumns.push('weightFrom');
    this.displayedColumns.push('weightTo');

    var columnObject = await this.zoneLookupListService.filter((currentSavings: any) => currentSavings.carrier == this.carrierName.toLowerCase());
    columnObject.forEach((element: any) => {
      this.columns.push(element);
    });
    this.zoneValuesList = [];
    for (var loop = 0; loop < columnObject.length; loop++) {
      var zoneValue = columnObject[loop]['fieldVal'];
      this.displayedColumns.push(zoneValue);

      this.zoneValuesList.push(zoneValue);
    }

    this.columns.push({ service: this.serviceName, field: 'Net Spend', fieldVal: 'netSpend' });
    this.displayedColumns.push('netSpend');

  }

  async displayedColumnsSetTarget(carrierName: any, targetIndex: any) {

    var columns = [];
    this.zoneLookupListService = [];
    var displayedColumns = [];


    for (var loop = 0; loop < this.ZoneLookupList.length; loop++) {
      this.zoneLookupListService.push(this.ZoneLookupList[loop]);
    }

    columns.push({ service: this.serviceName, field: 'Container Type', fieldVal: 'containerType' });
    columns.push({ service: this.serviceName, field: 'From Weight', fieldVal: 'weightFrom' });
    columns.push({ service: this.serviceName, field: 'To Weight', fieldVal: 'weightTo' });

    displayedColumns.push('containerType');
    displayedColumns.push('weightFrom');
    displayedColumns.push('weightTo');


    var columnObject = await this.zoneLookupListService.filter((currentSavings: any) => currentSavings.carrier == carrierName);
    columnObject.forEach((element: any) => {
      columns.push(element);
    });
    this.zoneValuesList = [];
    for (var loop = 0; loop < columnObject.length; loop++) {
      var zoneValue = columnObject[loop]['fieldVal'];
      displayedColumns.push(zoneValue);

      this.zoneValuesList.push(zoneValue);
    }

    columns.push({ service: this.serviceName, field: 'Net Spend', fieldVal: 'netSpend' });
    displayedColumns.push('netSpend');
    this.freightTargetSavingsList[targetIndex].columns = columns;
    this.freightTargetSavingsList[targetIndex].displayedColumns = displayedColumns;
    this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
  }

  async displayedColumnsMinSetTarget(carrierName: any, targetIndex: any) {

    var columns = [];
    this.zoneLookupListService = [];
    var displayedColumns = [];


    for (var loop = 0; loop < this.ZoneLookupList.length; loop++) {
      this.zoneLookupListService.push(this.ZoneLookupList[loop]);
    }

    columns.push({ service: this.serviceName, field: 'Container Type', fieldVal: 'containerType' });
    columns.push({ service: this.serviceName, field: 'From Weight', fieldVal: 'weightFrom' });
    columns.push({ service: this.serviceName, field: 'To Weight', fieldVal: 'weightTo' });
    displayedColumns.push('containerType');
    displayedColumns.push('weightFrom');
    displayedColumns.push('weightTo');
    var columnObject = await this.zoneLookupListService.filter((currentSavings: any) => currentSavings.carrier == carrierName);
    columnObject.forEach((element: any) => {
      columns.push(element);
    });
    for (var loop = 0; loop < columnObject.length; loop++) {
      var zoneValue = columnObject[loop]['fieldVal'];
      displayedColumns.push(zoneValue);
    }
    columns.push({ service: this.serviceName, field: 'Net Spend', fieldVal: 'netSpend' });
    displayedColumns.push('netSpend');
    this.freightTargetSavingsList[targetIndex].columnsMin = columns;
    this.freightTargetSavingsList[targetIndex].displayedColumnsMin = displayedColumns;
    this.freightTargetSavingsListSignal.set(this.freightTargetSavingsList)
  }

  onSubmit() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
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
      width: '1280px',
      maxWidth: '95vw',
      panelClass: panelClass,
      data: {
        valueClick: clickValue,
        carrierDetails: this.selectedCarrier,
        target: this.selectedScenario,
        targetList: this.scenariosDisplayed,
        fedexId: this.data.fedexId,
        tabIndex: this.data.tabIndex,
        targetDetails: []
      },
    });
    dialogConfig.afterClosed().subscribe(async data => {
      this.dialogRef.close(data);
    });
  }

  onTabChanged(event: any) {
    this.tabIndex = event.index;
  }
  isLoading: any = signal<any>(false);
  openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
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
        clientObj['serviceType'] = this.serviceType == 'hwt' ? 'HWT' : 'Freight';
        clientObj['serviceName'] = this.newService; //serviceName;
        this.openLoading();
        if (result == true) {
          if (this.carrierName.toLowerCase() == 'ups') {
            await this.httpClientService.deleteServiceGRI(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = this.newService + " deleted successfully";
                APIresult = true;
              } else
                message = "Oops something went wrong!";
            }).catch((err) => { message = "Oops something went wrong!"; });
          } else {
            await this.fedexService.deleteServiceGRIFedEx(clientObj).toPromise().then(res2 => {
              if (res2 == true) {
                message = this.newService + " deleted successfully";
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
}

