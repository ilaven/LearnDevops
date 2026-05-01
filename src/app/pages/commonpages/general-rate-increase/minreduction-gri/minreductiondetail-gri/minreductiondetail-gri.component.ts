import { Component, OnInit, Optional, Inject, ChangeDetectorRef, signal } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { LoaderService } from "src/app/core/services/loader.service";

@Component({
  selector: 'app-minreductiondetail-gri',
  templateUrl: './minreductiondetail-gri.component.html',
  styleUrls: ['./minreductiondetail-gri.component.css'],
  standalone: false
})
export class MinreductiondetailGRIComponent implements OnInit {
 
  zoneLookupList: any = [];

  displayedColumns: any = [];
  displayedColumnsMin: any = [];

  targetIdList: any = [];
  carrierName: string = '';

  randomNumber: any;

  currentMin: any = [];
  currentNetMin: any = [];
  columnsMin: any = [];
  columnsMinSignal: any = signal<any>([]);

  type: any;
  targetId: any;
  fedexId: any;
  serviceName: string;
  carrier: string;
  year: any;
  serviceType: string = '';

  constructor(public dialogRef: MatDialogRef<MinreductiondetailGRIComponent>, private cd: ChangeDetectorRef, public dialog: MatDialog, private loaderService: LoaderService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private httpClientService: HttpClientService, private cookiesService: CookiesService,
    private fedexService: HttpfedexService) {

    this.serviceName = data.service;
    this.carrier = data.carrier;
    this.carrierName = data.carrierName;
    this.type = data.type;
    this.targetId = data.targetId;
    this.targetIdList = data.targetIdList;
    this.fedexId = data.fedexId;
    this.year = data.year;
  }

  async ngOnInit(): Promise<void> {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    var userObj: any = {};
    userObj['targetId'] = this.targetIdList.toString();
    userObj['service'] = this.serviceName;

    if (this.carrier.toLowerCase() == 'ups') {
      userObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      await this.fetchRateSheetLookUpUPS(userObj);
    }
    else {
      userObj['clientId'] = this.data.fedexId;
      await this.fetchRateSheetLookUpFedEx(userObj);
    }

    await this.displayedColumnsMinSet();
    await this.getMinDetails();
    await this.getNetMinDetails();
    this.closeLoading();
  }

  //get target minimum
  async getMinDetails() {
    var clientObj: any = {};
    clientObj['type'] = this.type;
    if (this.type.toLowerCase() == 'create') {
      clientObj['carrier'] = this.carrierName;
    }
    if (this.type.toLowerCase() == 'edit') {
      clientObj['targetId'] = this.targetId;
    }
    //for fedex
    if (this.carrier.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.fedexId;
      clientObj['service'] = this.serviceName;

      var currentMinData = await this.fedexService.fetchGRIMinDetailsPopup(clientObj).toPromise();

      //get distinct services
      var distinctServices = await currentMinData.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType) === i
      );
      var zoneList = this.zoneLookupList.filter((data: any) => data.carrier == this.carrierName.toLowerCase());

      //for every service create an object
      for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
        var sampleObject: any = {};
        var filteredData = currentMinData.filter((data: any) => data.containerType == distinctServices[serviceIndex].containerType);
        sampleObject['service'] = filteredData[0].service;
        sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
        sampleObject['weightFrom'] = 0;
        sampleObject['weightTo'] = 1000;
        sampleObject['netSpend'] = filteredData[0].netSpend;
        sampleObject['subGroup'] = filteredData[0].subGroup;
        sampleObject['minType'] = filteredData[0].minType;

        //with zonelist assign target min to all zones 
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
      //Group international services for fedex
      if (currentMinData[0] != undefined) {
        if (currentMinData[0].serviceType.toLowerCase() == 'intl') {
          this.getDistinctList('currentMin', zoneList);
        }
      }
    }
    else {
      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientObj['service'] = this.serviceName;
      var currentMinData = await this.httpClientService.fetchGRIMinDetailsPopup(clientObj).toPromise();
      var distinctServices = await currentMinData.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType) === i
      );
      var zoneList = this.zoneLookupList.filter((data: any) => data.carrier == this.carrierName.toLowerCase());
      var totalNetSpend = 0;
      for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
        var sampleObject: any = {};
        var filteredData = currentMinData.filter((data: any) => data.containerType == distinctServices[serviceIndex].containerType);
        sampleObject['service'] = filteredData[0].service;
        sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
        sampleObject['weightFrom'] = 0;
        sampleObject['weightTo'] = 1000;
        sampleObject['netSpend'] = filteredData[0].netSpend;
        totalNetSpend += filteredData[0].netSpend;
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
      if (currentMinData[0] != undefined) {
        if (currentMinData[0].serviceType.toLowerCase() == 'ground') {
          this.serviceType = 'ground';
          var totalNetSpend = 0;
          let filteredServices = await currentMinData.filter(
            (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo) === i
          );
          filteredServices.forEach((data: any) => {
            totalNetSpend += Number(data.netSpend);
          })
          this.currentMin[0].netSpend = totalNetSpend;
        }
      }
    }
    this.cd.detectChanges();
  }
  //get target minimum
  async getNetMinDetails() {
    var clientObj: any = {};
    clientObj['type'] = this.type;
    if (this.type.toLowerCase() == 'create') {
      clientObj['carrier'] = this.carrierName;
    }
    if (this.type.toLowerCase() == 'edit') {
      clientObj['targetId'] = this.targetId;
    }
    if (this.carrier.toLowerCase() == 'fedex') {
      clientObj['clientId'] = this.fedexId;
      clientObj['service'] = this.serviceName;

      var currentNetMinData = await this.fedexService.fetchGRIMinNetdetailsPopup(clientObj).toPromise();
      var distinctServices = await currentNetMinData.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup) === i
      );
      var zoneList = this.zoneLookupList.filter((data: any) => data.carrier == this.carrierName.toLowerCase());
      for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
        var sampleObject: any = {};
        var filteredData = currentNetMinData.filter((data: any) => data.subGroup == distinctServices[serviceIndex].subGroup);
        sampleObject['service'] = filteredData[0].service;
        sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
        sampleObject['weightFrom'] = 0;
        sampleObject['weightTo'] = 1000;
        sampleObject['netSpend'] = filteredData[0].netSpend;
        sampleObject['subGroup'] = filteredData[0].subGroup;
        sampleObject['minType'] = filteredData[0].minType;
        for (let index = 0; index < zoneList.length; index++) {
          for (let row = 0; row < filteredData.length; row++) {
            if (Number(zoneList[index].field).toString() != 'NaN') {
              if (Number(filteredData[row].zone1) == Number(zoneList[index].field)) {
                sampleObject[zoneList[index].fieldVal] = filteredData[row].currentMinNet;
              }
            }
            else {
              if (filteredData[row].zone1 == zoneList[index].field) {
                sampleObject[zoneList[index].fieldVal] = filteredData[row].currentMinNet;
              }
            }
          }
        }
        this.currentNetMin.push(sampleObject);
      }

      //Group international services for fedex
      if (currentNetMinData[0] != undefined) {
        if (currentNetMinData[0].serviceType.toLowerCase() == 'intl') {
          this.getDistinctList('currentNetMin', zoneList);
        }
      }
    }
    else {

      clientObj['clientId'] = this.cookiesService.getCookieItem('clientId');
      clientObj['service'] = this.serviceName;
      var currentNetMinData = await this.httpClientService.fetchGRIMinNetdetailsPopup(clientObj).toPromise();
      var distinctServices = await currentNetMinData.filter(
        (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.subGroup == thing.subGroup) === i
      );
      var zoneList = this.zoneLookupList.filter((data: any) => data.carrier == this.carrierName.toLowerCase());
      for (let serviceIndex = 0; serviceIndex < distinctServices.length; serviceIndex++) {
        var sampleObject: any = {};
        var filteredData = currentNetMinData.filter((data: any) => data.subGroup == distinctServices[serviceIndex].subGroup);
        sampleObject['service'] = filteredData[0].service;
        sampleObject['containerType'] = distinctServices[serviceIndex].containerType;
        sampleObject['weightFrom'] = 0;
        sampleObject['weightTo'] = 1000;
        sampleObject['netSpend'] = filteredData[0].netSpend;
        sampleObject['subGroup'] = filteredData[0].subGroup;
        sampleObject['minType'] = '$';
        for (let index = 0; index < zoneList.length; index++) {
          for (let row = 0; row < filteredData.length; row++) {
            if (Number(zoneList[index].field).toString() != 'NaN') {
              if (Number(filteredData[row].zone1) == Number(zoneList[index].field)) {
                sampleObject[zoneList[index].fieldVal] = filteredData[row].currentMinNet;
              }
            }
            else {
              if (filteredData[row].zone1 == zoneList[index].field) {
                sampleObject[zoneList[index].fieldVal] = filteredData[row].currentMinNet;
              }
            }
          }
        }
        this.currentNetMin.push(sampleObject);

      }
      if (currentNetMinData[0] != undefined) {
        if (this.serviceType == 'ground') {
          var totalNetSpend = 0;
          let filteredServices = await currentNetMinData.filter(
            (thing: any, i: any, arr: any) => arr.findIndex((t: any) => t.containerType == thing.containerType && t.weightFrom == thing.weightFrom && t.weightTo == thing.weightTo) === i
          );
          filteredServices.forEach((data: any) => {
            totalNetSpend += Number(data.netSpend);
          })
          this.currentNetMin[0].netSpend = totalNetSpend;
        }
      }
    }
    this.cd.detectChanges();
  }

  //To group intl services for fedex
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

  //To set column Names for table
  async displayedColumnsMinSet() {

    this.columnsMin = [];
    this.displayedColumnsMin = [];

    this.columnsMin.push({ service: this.serviceName, field: 'Container Type', fieldVal: 'containerType' });
    this.columnsMin.push({ service: this.serviceName, field: 'From Weight', fieldVal: 'weightFrom' });
    this.columnsMin.push({ service: this.serviceName, field: 'To Weight', fieldVal: 'weightTo' });

    this.displayedColumnsMin.push('containerType');
    this.displayedColumnsMin.push('weightFrom');
    this.displayedColumnsMin.push('weightTo');

    var columnObject = await this.zoneLookupList.filter((currentSavings: any) => currentSavings.carrier == this.carrierName.toLowerCase());
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
    this.cd.detectChanges();
  }

  //Fetch zones
  async fetchRateSheetLookUpUPS(userObj: any) {

    var result = await this.httpClientService.fetchGRIRatesheetLookUp(userObj).toPromise();
    result.forEach((element: any) => {
      if (Number(element.field).toString() == 'NaN') {
        this.zoneLookupList.push({ service: element.service, field: element.field, fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
      }
      else {
        this.zoneLookupList.push({ service: element.service, field: Number(element.field), fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
      }
    })
    this.zoneLookupList.sort((a: any, b: any) => {
      if (Number(a.field).toString() != 'NaN')
        return a.field - b.field;
      else
        return a.field.localeCompare(b.field);
    });
    this.zoneLookupList.sort((a: any, b: any) => a.carrier.localeCompare(b.carrier));

  }

  //Fetch zones
  async fetchRateSheetLookUpFedEx(userObj: any) {

    var result = await this.fedexService.fetchGRIRatesheetLookUp(userObj).toPromise();

    result.forEach((element: any) => {
      if (Number(element.field).toString() == 'NaN') {
        this.zoneLookupList.push({ service: element.service, field: element.field, fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
      }
      else {
        this.zoneLookupList.push({ service: element.service, field: Number(element.field), fieldVal: element.fieldVal, carrier: element.carrier.toLowerCase() })
      }

    })
    this.zoneLookupList.sort((a: any, b: any) => {
      if (Number(a.field).toString() != 'NaN')
        return a.field - b.field;
      else
        return a.field.localeCompare(b.field);
    });
    this.zoneLookupList.sort((a: any, b: any) => a.carrier.localeCompare(b.carrier));

  }

  close() {
    this.dialogRef.close();
  }

 isLoading :any= signal<any>(false);
    openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }

}
 
