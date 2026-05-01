import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Optional, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { ResetPopupComponent } from '../reset-popup/reset-popup.component';

@Component({
  selector: 'app-contractsummarydiscount',
  templateUrl: './contractsummarydiscount.component.html',
  styleUrls: ['./contractsummarydiscount.component.css'],
  standalone: false
})


export class ContractsummarydiscountComponent implements OnInit {

  selected = 'option1';
  saveButtonClicked: boolean = false;
  serviceName;
  editable = false;
  editableCommon = false;
  CurrentSavingsCombinedObj: any = {};
  zoneLookupListService: any = [];
  CurrentSavingsListNew: any = []
  MinSavingsListNew: any = []
  zoneLookupListServiceMin: any = []
  minTypeValues: string[] = ['$', '%',];
  ZoneLookupList: any = [];
  MinSavingsList: any = [];
  CurrentSavingsList: any = [];

  displayedColumns: any = [];
  columns: any = [];
  columnsSignal = signal<any>([]);
  columnsMin: any = [];
  columnsMinSignal = signal<any>([]);
  displayedColumnsMin: any = [];
  spans: any = [];
  currentServiceList: any = [];
  dataList: any = [];
  frightList: any = [];
  clientID: any;
  dataSource: any;
  dataSourceSignal: any = signal<any>([]);
  dataSourcehead: any;
  dataSourceMin: any;
  dataSourceMinSignal: any = signal<any>([]);
  dataSourceMinhaed: any;

  pivotResult: any = [];
  minPivotResult: any = [];
  pivotResultNew: any = [];
  minPivotResultNew: any = [];

  previousWholeNumber: any;
  previousDecimalNumber: any;
  subGroupName: any;
  duplicateList: any = [];
  carrierName;
  targetDetails;
  carrierDetails;
  zoneList = [];
  serviceType = "";
  serviceNameltr = "";
  serviceNamepkg = "";
  serviceNamedoc = "";
  serviceNamepak = "";
  ratesheetNameLTR = "";
  ratesheetNamePKG = "";
  ratesheetNameDOC = "";
  ratesheetNamePAK = "";
  containerTypeList: any = [];
  deleteList: any = [];
  currentAgreement: boolean;

  constructor(public dialogRef: MatDialogRef<ContractsummarydiscountComponent>, private dialog: MatDialog, private httpClientService: HttpClientService, private cookiesService: CookiesService,
    private fedexService: HttpfedexService, private cd: ChangeDetectorRef, private cookie: CookieService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
    this.carrierDetails = data.carrierDetails;
    this.serviceName = data.service;
    this.subGroupName = data.subGroup;
    this.carrierName = this.carrierDetails.carrierName;
    this.targetDetails = data.target;
    let serviceType = data.type;
    this.currentAgreement = data.currentAgreement;

    for (let index = 0; index < data.pageData.length; index++) {
      this.dataList[index] = Object.assign({}, data.pageData[index]);
    }

    if (serviceType == 'ground') {
      var unSortedData = this.dataList.filter((currentSavings: any) => currentSavings.subGroup == this.subGroupName);
    }
    else if (this.subGroupName.replaceAll(' ', '').toLowerCase() == 'internationalground') {
      var unSortedData = this.dataList.filter((currentSavings: any) => currentSavings.subGroup == this.subGroupName && currentSavings.zone1 != '9' && currentSavings.zone1 != '17');
    }
    else {
      var unSortedData = this.dataList.filter((currentSavings: any) => currentSavings.service == this.serviceName);
    }


    for (let index = 0; index < unSortedData.length; index++) {
      unSortedData[index].weightFrom = Number(unSortedData[index].weightFrom);
      unSortedData[index].weightTo = Number(unSortedData[index].weightTo);
      unSortedData[index].oldWeightFrom = unSortedData[index].weightFrom;
      unSortedData[index].oldWeightTo = unSortedData[index].weightTo;
      unSortedData[index].oldContainerType = unSortedData[index].containerType;
    }

    this.containerTypeList = ['LTR', 'DOC', 'PAK', 'PKG'];

    var sortedData = unSortedData.sort((a: any, b: any) => a.weightTo - b.weightTo);
    sortedData = sortedData.sort((a: any, b: any) => this.containerTypeList.indexOf(a.containerType) - this.containerTypeList.indexOf(b.containerType));
    sortedData.forEach((data: any) => this.currentServiceList.push(Object.assign({}, data)));

    for (let index = 0; index < this.currentServiceList.length; index++) {
      this.duplicateList[index] = Object.assign({}, this.currentServiceList[index]);
    }
  }
  async ngOnInit(): Promise<void> {

    await this.getPivotArray(this.currentServiceList);
    await this.displayedColumnsSet();
    await this.displayedColumnsSetMin();
  }

  async getPivotArray(dataArray: any) {
    var result: any = {};
    var minResult: any = {}
    var newCols: any = [];
    var countryCodes: any = [];
    for (var i = 0; i < dataArray.length; i++) {
      if (!result[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo]) {
        result[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo] = {};
      }
      if (result[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo][dataArray[i].zone1] == undefined) {
        result[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo][dataArray[i].zone1] = dataArray[i].targetDis;
      }
    }
    for (var i = 0; i < dataArray.length; i++) {
      if (!minResult[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo]) {
        minResult[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo] = {};
      }
      if (minResult[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo][dataArray[i].zone1] == undefined) {
        minResult[dataArray[i].subGroup + dataArray[i].containerType + dataArray[i].weightFrom + dataArray[i].weightTo][dataArray[i].zone1] = dataArray[i].targetMin;
      }
    }
    //To get column names
    for (var i = 0; i < dataArray.length; i++) {
      if (this.carrierName.toLowerCase() == 'ups') {
        if (Number(dataArray[i].zone1).toString() == 'NaN') {
          if (countryCodes.indexOf(dataArray[i].zone1) == -1) {
            countryCodes.push(dataArray[i].zone1);
          }
        }
        else {
          if (newCols.indexOf(dataArray[i].zone1) == -1) {
            newCols.push(dataArray[i].zone1);
          }
        }
      }
      else {
        if (newCols.indexOf(dataArray[i].zone1) == -1) {
          newCols.push(dataArray[i].zone1);
        }
      }
    }
    if (this.carrierName.toLowerCase() == 'ups') {
      this.zoneList.push.apply(this.zoneList, countryCodes);
      var sortedZones = newCols.sort((a: any, b: any) => a - b);
      this.zoneList.push.apply(this.zoneList, sortedZones);
    }
    else {
      this.zoneList = newCols.sort((a: any, b: any) => {
        if (Number(a).toString() != 'NaN')
          return a - b;
        else
          return a.localeCompare(b);
      });
    }
    var item = [];
    var minItem = [];
    item.push('service');
    item.push('container Type');
    item.push('oldContainerType')
    item.push('serviceType');
    item.push('weight From');
    item.push('weight To');
    item.push('oldWeightFrom');
    item.push('oldWeightTo');
    item.push.apply(item, this.zoneList);
    this.pivotResult.push(item);
    //Add Header Row Min
    minItem.push('service');
    minItem.push('container Type');
    minItem.push('oldContainerType')
    minItem.push('serviceType');
    minItem.push('weight From');
    minItem.push('weight To');
    minItem.push('oldWeightFrom');
    minItem.push('oldWeightTo');
    minItem.push('min Type');
    minItem.push.apply(minItem, this.zoneList);
    this.minPivotResult.push(minItem);

    var listWithDuplicates = [];
    var serviceList: any = [];
    //Add content
    for (var key in result) {
      for (var loop = 0; loop < dataArray.length; loop++) {
        if (key == dataArray[loop].subGroup + dataArray[loop].containerType + dataArray[loop].weightFrom + dataArray[loop].weightTo) {
          item = [];
          item.push(dataArray[loop].service);
          item.push(dataArray[loop].containerType);
          item.push(dataArray[loop].containerType);
          item.push(dataArray[loop].serviceType);
          item.push(dataArray[loop].weightFrom);
          item.push(dataArray[loop].weightTo);
          item.push(dataArray[loop].weightFrom);
          item.push(dataArray[loop].weightTo);
          for (var i = 0; i < this.zoneList.length; i++) {
            item.push(result[key][this.zoneList[i]] || '-');
          }
          if (dataArray[loop].containerType != null) {
            if (dataArray[loop].containerType.toLowerCase() == 'ltr') {
              this.serviceNameltr = dataArray[loop].subGroup;
              if (this.ratesheetNameLTR == "") {
                this.ratesheetNameLTR = dataArray[loop].ratesheetName;
              }
            }
            if (dataArray[loop].containerType.toLowerCase() == 'pkg') {
              this.serviceNamepkg = dataArray[loop].subGroup;
              if (this.ratesheetNamePKG == "") {
                this.ratesheetNamePKG = dataArray[loop].ratesheetName;
              }
            }
            if (dataArray[loop].containerType.toLowerCase() == 'doc') {
              this.serviceNamedoc = dataArray[loop].subGroup;
              if (this.ratesheetNameDOC == "") {
                this.ratesheetNameDOC = dataArray[loop].ratesheetName;
              }
            }
            if (dataArray[loop].containerType.toLowerCase() == 'pak') {
              this.serviceNamepak = dataArray[loop].subGroup;
              if (this.ratesheetNamePAK == "") {
                this.ratesheetNamePAK = dataArray[loop].ratesheetName;
              }
            }
          }
          this.serviceType = dataArray[loop].serviceType;
          listWithDuplicates.push(item);
        }
      }
    }


    //push distinct values 
    for (let index = 0; index < listWithDuplicates.length; index++) {
      if (!serviceList.includes(listWithDuplicates[index][0] + listWithDuplicates[index][1] + listWithDuplicates[index][4] + listWithDuplicates[index][5])) {
        serviceList.push(listWithDuplicates[index][0] + listWithDuplicates[index][1] + listWithDuplicates[index][4] + listWithDuplicates[index][5]);
        this.pivotResult.push([...listWithDuplicates[index]]);
      }
    }

    for (let index = 0; index < this.pivotResult.length; index++) {
      this.pivotResultNew[index] = [...this.pivotResult[index]];
    }

    listWithDuplicates = [];
    serviceList = [];

    //Add content min
    for (var key in minResult) {
      for (var loop = 0; loop < dataArray.length; loop++) {
        if (key == dataArray[loop].subGroup + dataArray[loop].containerType + dataArray[loop].weightFrom + dataArray[loop].weightTo) {
          item = [];
          item.push(dataArray[loop].service);
          item.push(dataArray[loop].containerType);
          item.push(dataArray[loop].containerType);
          item.push(dataArray[loop].serviceType);
          item.push(dataArray[loop].weightFrom);
          item.push(dataArray[loop].weightTo);
          item.push(dataArray[loop].weightFrom);
          item.push(dataArray[loop].weightTo);
          item.push(dataArray[loop].minType);
          for (var i = 0; i < this.zoneList.length; i++) {
            item.push(minResult[key][this.zoneList[i]] || '-');
          }
          listWithDuplicates.push(item);
        }
      }
    }

    //push distinct values min

    for (let index = 0; index < listWithDuplicates.length; index++) {
      if (!serviceList.includes(listWithDuplicates[index][0] + listWithDuplicates[index][1] + listWithDuplicates[index][4] + listWithDuplicates[index][5])) {
        serviceList.push(listWithDuplicates[index][0] + listWithDuplicates[index][1] + listWithDuplicates[index][4] + listWithDuplicates[index][5]);
        this.minPivotResult.push([...listWithDuplicates[index]]);
      }
    }

    for (let index = 0; index < this.minPivotResult.length; index++) {
      this.minPivotResultNew[index] = [...this.minPivotResult[index]];
    }

    await this.setPivotList();
    await this.setMinPivotList();

    //datapush
    // this.CurrentSavingsList.sort((a:any, b:any) => a.weightFrom - b.weightFrom);
    // this.MinSavingsList.sort((a:any, b:any) => a.weightFrom - b.weightFrom);


    var distinctList: any = [];
    if (this.serviceType.toLowerCase() == 'intl') {
      distinctList = await this.getDistinctData('CurrentSavingsList');
      this.CurrentSavingsList = [];
      await distinctList.forEach((data: any) => this.CurrentSavingsList.push(Object.assign({}, data)));
    }

    if (this.serviceType.toLowerCase() == 'intl' || this.serviceType.toLowerCase() == 'ground') {
      distinctList = await this.getDistinctData('MinSavingsList');
      this.MinSavingsList = [];
      await distinctList.forEach((data: any) => this.MinSavingsList.push(Object.assign({}, data)));
    }

    //creating duplicate list
    for (let index in this.CurrentSavingsList) {
      this.CurrentSavingsListNew.push(this.CurrentSavingsList[index]);
    }

    //creating duplicate list min
    for (let index in this.MinSavingsList) {
      this.MinSavingsListNew[index] = Object.assign({}, this.MinSavingsList[index]);
    }

    // this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
    this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
    this.dataSourceSignal.set(this.dataSource);
    this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
    this.dataSourceMinSignal.set(this.MinSavingsList);
    this.cd.detectChanges();
  }



  async setPivotList() {

    this.CurrentSavingsList = [];
    var pivotedRow: any = {};
    var columnList = this.pivotResult[0];

    //pivoting
    for (let i = 1; i < this.pivotResult.length; i++) {
      var currentData = Object.assign({}, this.pivotResult[i]);
      for (let j = 0; j < columnList.length; j++) {
        pivotedRow[columnList[j].replace(' ', '')] = currentData[j];
      }
      this.CurrentSavingsList.push(Object.assign({}, pivotedRow));
      pivotedRow = {};
    }
  }

  async setMinPivotList() {

    this.MinSavingsList = [];
    var pivotedRow: any = {};
    var minColumnList = this.minPivotResult[0];

    //pivoting min
    for (let i = 1; i < this.minPivotResult.length; i++) {
      var currentData = Object.assign({}, this.minPivotResult[i]);
      for (let j = 0; j < minColumnList.length; j++) {
        pivotedRow[minColumnList[j].replace(' ', '')] = currentData[j];
      }
      this.MinSavingsList.push(pivotedRow);
      pivotedRow = {};
    }
  }

  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];
  }

  async displayedColumnsSet() {

    this.columns = [];
    this.columnsSignal.set([]);
    this.displayedColumns = [];
    for (var loop = 0; loop < this.pivotResult[0].length; loop++) {
      var zoneValue = this.pivotResult[0][loop];
      if (zoneValue != 'serviceType' && zoneValue != 'oldWeightFrom' && zoneValue != 'oldWeightTo' && zoneValue != 'oldContainerType') {
        this.displayedColumns.push(zoneValue);
        this.columns.push(zoneValue);
      }
    }
    this.columnsSignal.set(this.columns);
  }

  async displayedColumnsSetMin() {

    this.columnsMin = [];
    this.columnsMinSignal.set([]);
    this.displayedColumnsMin = [];
    for (var loop = 0; loop < this.minPivotResult[0].length; loop++) {
      var zoneValue = this.minPivotResult[0][loop];
      if (zoneValue != 'serviceType' && zoneValue != 'oldWeightFrom' && zoneValue != 'oldWeightTo' && zoneValue != 'oldContainerType') {
        this.displayedColumnsMin.push(zoneValue);
        this.columnsMin.push(zoneValue);
      }
    }
    this.columnsMinSignal.set(this.columnsMin);
  }

  focusOutFunction(fieldvalue: any) {
    this.editable = false;
  }

  async AddNewRow() {

    var columns = this.pivotResult[0];
    var pivotData: any = [];
    var data: any = {};

    columns.forEach((columnName: any) => {
      if (columnName.toLowerCase().replace(' ', '') == 'servicetype') {
        pivotData.push(this.serviceType);
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'service') {
        pivotData.push(this.serviceName);
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'containertype') {
        pivotData.push('PKG');
      }
      else {
        pivotData.push('');
      }
    });

    columns.forEach((columnName: any) => {
      if (columnName.toLowerCase().replace(' ', '') == 'servicetype') {
        data[columnName.replaceAll(' ', '')] = this.serviceType;
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'service') {
        data[columnName.replaceAll(' ', '')] = this.serviceName;
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'containertype') {
        data[columnName.replaceAll(' ', '')] = 'PKG';
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'weightfrom') {
        var lastRow = this.CurrentSavingsList[this.CurrentSavingsList.length - 1];
        data[columnName.replaceAll(' ', '')] = (lastRow && lastRow.weightTo !== '' && lastRow.weightTo != null) ? Number(lastRow.weightTo) + 1 : '';
      }
      else {
        data[columnName.replaceAll(' ', '')] = '';
      }
    });

    data["isNewRow"] = true;

    this.pivotResult.push(pivotData);
    this.CurrentSavingsList.push(Object.assign({}, data));
    this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
    this.dataSourceSignal.set(this.dataSource);
    this.cd.detectChanges();
  }

  async AddNewRowMin() {

    var columns = this.minPivotResult[0];
    var pivotData: any = [];
    var data: any = {};

    columns.forEach((columnName: any) => {
      if (columnName.toLowerCase().replace(' ', '') == 'servicetype') {
        pivotData.push(this.serviceType);
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'service') {
        pivotData.push(this.serviceName);
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'containertype') {
        pivotData.push('PKG');
      }
      else {
        pivotData.push('');
      }
    });

    columns.forEach((columnName: any) => {
      if (columnName.toLowerCase().replace(' ', '') == 'servicetype') {
        data[columnName.replaceAll(' ', '')] = this.serviceType;
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'service') {
        data[columnName.replaceAll(' ', '')] = this.serviceName;
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'containertype') {
        data[columnName.replaceAll(' ', '')] = 'PKG';
      }
      else if (columnName.toLowerCase().replace(' ', '') == 'weightfrom') {
        var lastRow = this.MinSavingsList[this.MinSavingsList.length - 1];
        data[columnName.replaceAll(' ', '')] = (lastRow && lastRow.weightTo !== '' && lastRow.weightTo != null) ? Number(lastRow.weightTo) + 1 : '';
      }
      else {
        data[columnName.replaceAll(' ', '')] = '';
      }
    });

    data["isNewRow"] = true;
    this.minPivotResult.push(pivotData);
    this.MinSavingsList.push(Object.assign({}, data)); this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
    this.dataSourceMinSignal.set(this.dataSourceMin);
    this.cd.detectChanges();
  }
  minTypeChange(event: any) {
    for (var loop = 0; loop < this.MinSavingsList.length; loop++) {
      this.MinSavingsList[loop]['minType'] = event;
    }
  }

  reSetDisMin() {
    const dialogRef = this.dialog.open(ResetPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { message: "Are you sure you want to reset?  " }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.reset();
        }
      });
  }

  async reset() {
    this.deleteList = [];
    this.pivotResult = [];
    this.minPivotResult = [];
    for (let index in this.pivotResultNew) {
      this.pivotResult[index] = [];
      this.pivotResult[index] = [...this.pivotResultNew[index]];
    }
    await this.setPivotList();
    for (let index in this.minPivotResultNew) {
      this.minPivotResult[index] = {};
      this.minPivotResult[index] = [...this.minPivotResultNew[index]];
    }
    await this.setMinPivotList();
    this.dataSource = []
    this.dataSourceMin = [];
    this.dataSourceSignal.set([]);
    this.dataSourceMinSignal.set([]);
    var distinctList: any = [];
    if (this.serviceType.toLowerCase() == 'intl') {
      distinctList = await this.getDistinctData('CurrentSavingsList');
      this.CurrentSavingsList = [];
      await distinctList.forEach((data: any) => this.CurrentSavingsList.push(Object.assign({}, data)));
    }

    if (this.serviceType.toLowerCase() == 'intl' || this.serviceType.toLowerCase() == 'ground') {
      distinctList = await this.getDistinctData('MinSavingsList');
      this.MinSavingsList = [];
      await distinctList.forEach((data: any) => this.MinSavingsList.push(Object.assign({}, data)));
    }

    // this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
    this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
    this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
    this.dataSourceSignal.set(this.dataSource);
    this.dataSourceMinSignal.set(this.dataSourceMin);
    this.cd.detectChanges();
  }

  async onSubmit() {
    if (this.fromWeightToolTipId != -1 || this.toWeightToolTipId != -1) {
      return false;
    }
    this.saveButtonClicked = true;
    var emptyflag = false;
    var keys: any;
    keys = [...this.pivotResult[0]];

    let id = keys.indexOf('oldContainerType');
    keys.splice(id, 1);
    id = keys.indexOf('oldWeightFrom');
    keys.splice(id, 1);
    id = keys.indexOf('oldWeightTo');
    keys.splice(id, 1);
    for (let index = 0; index < this.CurrentSavingsList.length; index++) {
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        if (this.CurrentSavingsList[index][keys[keyIndex]] == "" && this.CurrentSavingsList[index][keys[keyIndex]].length == 0) {
          emptyflag = true;
          break;
        }
      }
      if (emptyflag == true) {
        break;
      }
    }
    keys.push('minType');
    for (let index = 0; index < this.MinSavingsList.length; index++) {
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        if (this.MinSavingsList[index][keys[keyIndex]] == "" && this.MinSavingsList[index][keys[keyIndex]].length == 0) {
          emptyflag = true;
          break;
        }
      }
      if (emptyflag == true) {
        break;
      }
    }

    if (emptyflag == true) {
      this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
      this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
      this.dataSourceSignal.set(this.dataSource);
      this.dataSourceMinSignal.set(this.dataSourceMin);
      return false;
    }
    await this.setPivotList();
    await this.setMinPivotList();

    var distinctList: any = [];
    if (this.serviceType.toLowerCase() == 'intl') {
      distinctList = await this.getDistinctData('CurrentSavingsList');
      this.CurrentSavingsList = [];
      await distinctList.forEach((data: any) => this.CurrentSavingsList.push(Object.assign({}, data)));
    }

    if (this.serviceType.toLowerCase() == 'ground' || this.serviceType.toLowerCase() == 'intl') {
      distinctList = await this.getDistinctData('MinSavingsList');
      this.MinSavingsList = [];
      await distinctList.forEach((data: any) => this.MinSavingsList.push(Object.assign({}, data)));
    }

    var sampleObject = Object.assign({}, this.duplicateList[0]);
    var key = Object.keys(sampleObject);

    key.forEach((element: any) => {
      sampleObject[element] = '';
    });
    var newList: any = [];
    var newMinList = [];
    var alteredList = [];

    for (let index = this.CurrentSavingsListNew.length; index < this.CurrentSavingsList.length; index++) {
      newList.push(Object.assign({}, this.CurrentSavingsList[index]));
    }

    for (let index = this.MinSavingsListNew.length; index < this.MinSavingsList.length; index++) {
      newMinList.push(Object.assign({}, this.MinSavingsList[index]));
    }

    var referenceList;
    if (newList != null && newList.length > newMinList.length) {
      referenceList = newList;
    }
    else {
      referenceList = newMinList;
    }
    if (referenceList.length != 0) {
      for (let rowNumber = 0; rowNumber < referenceList.length; rowNumber++) {
        for (let index = 0; index < this.zoneList.length; index++) {
          sampleObject.zone1 = this.zoneList[index];
          //targetDis
          if (newList[rowNumber] != undefined) {
            sampleObject.targetDis = newList[rowNumber][this.zoneList[index]].replace('%', '').replace('$', '');
            sampleObject.weightFrom = newList[rowNumber].weightFrom;
            sampleObject.weightTo = newList[rowNumber].weightTo;
            sampleObject.oldWeightFrom = newList[rowNumber].weightFrom;
            sampleObject.oldWeightTo = newList[rowNumber].weightTo;
            sampleObject.containerType = newList[rowNumber].containerType;
            sampleObject.service = newList[rowNumber].service;
            sampleObject.serviceType = newList[rowNumber].serviceType;
            sampleObject.minType = '$';
            sampleObject.frtRatesheetId = Math.random();
            sampleObject.netSpend = 0;
            sampleObject.isNewRow = true;
            if (newList[rowNumber].containerType.toLowerCase() == 'ltr') {
              sampleObject.subGroup = this.serviceNameltr;
              sampleObject.ratesheetName = this.ratesheetNameLTR;
            }
            if (newList[rowNumber].containerType.toLowerCase() == 'pkg') {
              sampleObject.subGroup = this.serviceNamepkg;
              sampleObject.ratesheetName = this.ratesheetNamePKG;
            }
            if (newList[rowNumber].containerType.toLowerCase() == 'doc') {
              sampleObject.subGroup = this.serviceNamedoc;
              sampleObject.ratesheetName = this.ratesheetNameDOC;
            }
            if (newList[rowNumber].containerType.toLowerCase() == 'pak') {
              sampleObject.subGroup = this.serviceNamepak;
              sampleObject.ratesheetName = this.ratesheetNamePAK;
            }
          }
          else {
            sampleObject.targetDis = "0.00";
          }
          //targetMin
          if (newMinList[rowNumber] != undefined) {
            sampleObject.targetMin = newMinList[rowNumber][this.zoneList[index]].replace('%', '').replace('$', '');
            sampleObject.weightFrom = newMinList[rowNumber].weightFrom;
            sampleObject.weightTo = newMinList[rowNumber].weightTo;
            sampleObject.oldWeightFrom = newMinList[rowNumber].weightFrom;
            sampleObject.oldWeightTo = newMinList[rowNumber].weightTo;
            sampleObject.containerType = newMinList[rowNumber].containerType;
            sampleObject.service = newMinList[rowNumber].service;
            sampleObject.serviceType = newMinList[rowNumber].serviceType;
            sampleObject.minType = '$';//newMinList[rowNumber].minType;
            sampleObject.frtRatesheetId = Math.random();
            sampleObject.netSpend = 0;
            sampleObject.isNewRow = true;
            if (newMinList[rowNumber].containerType.toLowerCase() == 'ltr') {
              sampleObject.subGroup = this.serviceNameltr;
              sampleObject.ratesheetName = this.ratesheetNameLTR;
            }
            if (newMinList[rowNumber].containerType.toLowerCase() == 'pkg') {
              sampleObject.subGroup = this.serviceNamepkg;
              sampleObject.ratesheetName = this.ratesheetNamePKG;
            }
            if (newMinList[rowNumber].containerType.toLowerCase() == 'doc') {
              sampleObject.subGroup = this.serviceNamedoc;
              sampleObject.ratesheetName = this.ratesheetNameDOC;
            }
            if (newMinList[rowNumber].containerType.toLowerCase() == 'pak') {
              sampleObject.subGroup = this.serviceNamepak;
              sampleObject.ratesheetName = this.ratesheetNamePAK;
            }
          }
          else {
            sampleObject.targetMin = "0.00";
          }
          this.duplicateList[this.duplicateList.length] = Object.assign({}, sampleObject);
        }
      }
    }

    var alteredList = [];

    keys = ["service", "containerType", "weightFrom", "weightTo", "targetDis", "targetMin", "minType"];
    for (let index = 0; index < this.duplicateList.length; index++) {
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        if (this.duplicateList[index][keys[keyIndex]] == "" && this.duplicateList[index][keys[keyIndex]].length == 0) {
          emptyflag = true;
          break;
        }
      }
      if (emptyflag == true) {
        break;
      }
    }
    if (emptyflag == false) {

      for (let index = 0; index < this.duplicateList.length; index++) {
        if (JSON.stringify(this.duplicateList[index]) !== JSON.stringify(this.currentServiceList[index])) {
          this.duplicateList[index].weightFrom = Number(this.duplicateList[index].weightFrom).toFixed(2);
          this.duplicateList[index].weightTo = Number(this.duplicateList[index].weightTo).toFixed(2);
          alteredList.push(this.duplicateList[index]);
        }
      }

      alteredList = alteredList.filter((data: any) => !this.deleteList.includes(data));
      let params = { alteredList: alteredList, deleteList: this.deleteList }
      this.dialogRef.close(params);
    }
    else {
      return false;
    }
    return false;
  }

  close() {
    this.dialogRef.close();
  }


  storePreviousPercentage(event: any, rowNumber: any, type: any) {

    var keyCode;
    keyCode = event.charCode;

    if (type == 'min') {
      if ((this.MinSavingsList[rowNumber].minType == '$' && event.key == '%') || (this.MinSavingsList[rowNumber].minType == '%' && event.key == '$') || keyCode == 45) {
        return false;
      }
    }

    if (event.target.value.includes(".")) {
      this.previousWholeNumber = event.target.value.split(".")[0];

      if (event.target.value.split(".").pop().replace('%', '').length < 3) {
        this.previousDecimalNumber = event.target.value.split(".").pop();
      }
    }

    if (keyCode == 45 || keyCode == 46 || keyCode == 37 || keyCode == 36 || keyCode == 8 || keyCode == 32 || (keyCode >= 48 && keyCode <= 57) || event.keyCode == 109 || event.keyCode == 189) {
      if (event.target.value.includes(".") && keyCode == 46) {
        return false;
      }
      else if (event.target.value.includes("%") && keyCode == 37) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  validatePercentage(event: any) {
    let wholeNumber;
    let decimalNumber;
    if (event.target.value.includes(".")) {
      wholeNumber = event.target.value.split(".")[0];
      decimalNumber = event.target.value.split(".").pop();
      if (decimalNumber.includes("%")) {
        decimalNumber = decimalNumber.replace('%', '');
      }
      if (decimalNumber.length > 2) {
        event.target.value = wholeNumber + "." + this.previousDecimalNumber;
        return false;
      }
    }
    return false;
  }

  percentageFocusout(event: any, column: any, containerType: any, rowNumber: any, type: any) {

    if (Number(event.target.value.replace('%', '')).toString() != 'NaN') {
      if (column != 'service' && column != 'minType' && column != 'containerType' && column != 'weightFrom' && column != 'weightTo') {
        var minType = "%"
        if (type == 'min') {
          minType = this.MinSavingsList[rowNumber].minType;
        }
        if (event.target.value.includes(".")) {
          let value = event.target.value.split(".")[0];
          let decimalValue = event.target.value.split(".").pop().replace('%', '');
          if (value == '') {
            if (type != 'min' && minType != "$") {
              event.target.value = "0." + decimalValue + "%";
            }
            else {
              event.target.value = "$0." + decimalValue;
            }
            this.onChange(event.target.value, column, containerType, rowNumber, type);
          }
          if (decimalValue == '') {
            if (type != 'min' && minType != "$") {
              event.target.value = value + ".00%";
            }
            else {
              event.target.value = "$" + value + ".00";
            }
            this.onChange(event.target.value, column, containerType, rowNumber, type);
          }
        }

        if (!(event.target.value.includes("."))) {
          event.target.value = Number(event.target.value.replaceAll('%', '').replaceAll('$', '')).toFixed(2);
          this.onChange(event.target.value, column, containerType, rowNumber, type);
        }

        if (type != 'min') {
          event.target.value = event.target.value.replaceAll('%', '') + "%";
          this.onChange(event.target.value, column, containerType, rowNumber, type);
        }
        else {
          if (minType == '$') {
            event.target.value = "$" + event.target.value.replaceAll('$', '');
            this.onChange(event.target.value, column, containerType, rowNumber, type);
          }
          else {
            event.target.value = event.target.value.replaceAll('%', '') + "%";
            this.onChange(event.target.value, column, containerType, rowNumber, type);
          }

        }
      }
    }
    if (type == 'min') {
      if (column != 'service') {
        if (column != 'weightFrom' && column != 'weightTo' && column != 'containerType' && column != 'minType' && column != 'service') {
          this.MinSavingsList[rowNumber][column] = event.target.value.replace('$', '').replace('%', '')
        }
        else {
          this.MinSavingsList[rowNumber][column] = event.target.value;
        }
      }
    }
    else {
      if (column != 'service') {
        if (column != 'weightFrom' && column != 'weightTo' && column != 'containerType' && column != 'minType' && column != 'service') {
          this.CurrentSavingsList[rowNumber][column] = event.target.value.replace('$', '').replace('%', '')
        }
        else {
          this.CurrentSavingsList[rowNumber][column] = event.target.value;
        }
      }
    }
  }

  resizeInput() {

  }

  async onChange(value: any, columnName: any, containerType: any, rowNumber: any, type: any) {

    var columnIndex: any;
    var weightFrom: any;
    var weightTo: any;
    var containerType: any;
    var distinctList: any = [];

    if (type == 'min') {

      weightFrom = this.MinSavingsList[rowNumber].weightFrom;
      weightTo = this.MinSavingsList[rowNumber].weightTo;
      containerType = this.MinSavingsList[rowNumber].containerType;
      columnIndex = this.minPivotResult[0].findIndex((data: any) => data.replace(' ', '') == columnName);

      if (this.serviceType.toLowerCase() == 'ground') {
        if (columnName != "minType") {
          for (let row = 1; row < this.minPivotResult.length; row++) {
            this.minPivotResult[row][columnIndex] = value.replace('%', '').replace('$', '');
          }
        }
        else {
          for (let row = 1; row < this.minPivotResult.length; row++) {
            this.minPivotResult[row][columnIndex] = value;
          }
        }

        if (columnName != 'weightFrom' && columnName != 'weightTo' && columnName != 'containerType' && columnName != 'minType') {
          var alteredObject = this.duplicateList.filter((data: any) => data.zone1 == columnName && data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
          alteredObject.forEach((element: any) => {
            element.targetMin = value.replace('$', '').replace('%', '');
          })
        }
        else if (columnName == 'minType') {
          var alteredObject = this.duplicateList.filter((data: any) => data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
          alteredObject.forEach((element: any) => {
            element.minType = value;
          })
          this.MinSavingsList[rowNumber][columnName] = value;
        }
        else {

          var alteredObject = this.duplicateList.filter((data: any) => data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
          alteredObject.forEach((element: any) => {
            element[columnName] = value;
          })
        }
      }
      else {

        if (columnName != "minType") {
          if (this.serviceType.toLowerCase() != 'intl') {
            this.minPivotResult[rowNumber + 1][columnIndex] = value.replace('%', '').replace('$', '');
          }
          else {
            if (rowNumber > this.MinSavingsListNew.length - 1) {
              distinctList = await this.getDistinctPivotData('minPivotResult');
              distinctList[rowNumber][columnIndex] = value.replace('%', '').replace('$', '');
            }
            else {
              for (let index = 1; index < this.minPivotResult.length; index++) {
                if (this.minPivotResult[index][4] >= weightFrom && this.minPivotResult[index][5] <= weightTo && this.minPivotResult[index][1] == containerType) {
                  if (this.serviceType.toLowerCase() == 'intl' && this.carrierName.toLowerCase() == 'fedex') {
                    this.minPivotResult[index]['weightFrom'] = weightFrom;
                    this.minPivotResult[index][columnIndex] = value.replace('%', '');
                  }
                  else
                    this.minPivotResult[index][columnIndex] = value.replace('%', '').replace('$', '');
                }
              }
            }
          }
        }
        else {
          // for (let index = 1; index < this.minPivotResult.length; index++) {
          // this.minPivotResult[index][columnIndex] = value;
          // }
          this.minPivotResult[rowNumber + 1][columnIndex] = value;

        }

        if (this.CurrentSavingsList[rowNumber] != undefined) {
          if (this.MinSavingsList[rowNumber].containerType.toLowerCase() == this.CurrentSavingsList[rowNumber].containerType.toLowerCase()) {
            if (columnName == 'weightFrom' || columnName == 'weightTo' || columnName == 'containerType') {

              if (this.CurrentSavingsList[rowNumber] != undefined) {
                if (this.serviceType.toLowerCase() != 'intl') {
                  this.pivotResult[rowNumber + 1][columnIndex] = value;
                  // this.CurrentSavingsList[rowNumber][columnName] = value;
                }
                else {
                  if (rowNumber > this.MinSavingsListNew.length - 1) {
                    distinctList = await this.getDistinctPivotData('pivotResult');
                    distinctList[rowNumber][columnIndex] = value.replace('%', '').replace('$', '');
                  }
                  else {
                    for (let index = 1; index < this.pivotResult.length; index++) {
                      if (this.pivotResult[index][4] >= weightFrom && this.pivotResult[index][5] <= weightTo && this.pivotResult[index][1] == containerType) {
                        if (this.serviceType.toLowerCase() == 'intl' && this.carrierName.toLowerCase() == 'fedex') {
                          this.pivotResult[index]['weightFrom'] = weightFrom;
                          this.pivotResult[index][columnIndex] = value.replace('%', '');
                        }
                        else
                          this.pivotResult[index][columnIndex] = value.replace('%', '');
                      }
                    }
                  }
                  // this.CurrentSavingsList[rowNumber][columnName] = value;
                }
                // this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
                this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
                this.dataSourceSignal.set(this.dataSource);
                this.cd.detectChanges();
              }
            }
          }
        }

        if (columnName != 'weightFrom' && columnName != 'weightTo' && columnName != 'containerType' && columnName != 'minType') {
          var alteredObject = this.duplicateList.filter((data: any) => {
            if (this.serviceType.toLowerCase() != 'intl') {
              return (data.zone1 == columnName && data.containerType == containerType && data.weightFrom == weightFrom && data.weightTo == weightTo);
            }
            else {
              return (data.zone1 == columnName && data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
            }
          });
          alteredObject.forEach((element: any) => {
            element.targetMin = value.replace('$', '').replace('%', '');
          })
        }
        else if (columnName == 'minType') {
          var alteredObject = this.duplicateList.filter((data: any) => data.containerType == containerType && data.weightFrom == weightFrom && data.weightTo == weightTo);
          alteredObject.forEach((element: any) => {
            element.minType = value;
          })
          this.MinSavingsList[rowNumber][columnName] = value;
          this.dataSourceMin = [];
          this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
          this.dataSourceMinSignal.set(this.dataSourceMin);
          this.cd.detectChanges();
          // alteredObject = this.MinSavingsList.filter((data:any) => data.containerType == containerType);
          // alteredObject.forEach((element:any) => {
          //   element.minType = value;
          // })
        }
        else {


          if (rowNumber < this.MinSavingsListNew.length) {
            var alteredObject = this.duplicateList.filter((data: any) => {
              if (this.serviceType.toLowerCase() != 'intl') {
                return (data.containerType == containerType && data.weightFrom == weightFrom && data.weightTo == weightTo);
              }
              else {
                return (data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
              }
            });
            alteredObject.forEach((element: any) => {
              element[columnName] = value;
            })
          }
        }
        if (columnName == 'weightFrom' || columnName == 'weightTo' || columnName == 'containerType' || columnName == 'service') {
          this.MinSavingsList[rowNumber][columnName] = value;
        }
      }
    }
    else {

      var weightFrom = this.CurrentSavingsList[rowNumber].weightFrom;
      var weightTo = this.CurrentSavingsList[rowNumber].weightTo;
      var containerType = this.CurrentSavingsList[rowNumber].containerType;
      columnIndex = this.pivotResult[0].findIndex((data: any) => data.replace(' ', '') == columnName);


      if (this.serviceType.toLowerCase() != 'intl') {
        this.pivotResult[rowNumber + 1][columnIndex] = value.replace('%', '');
      }
      else {
        if (rowNumber > this.CurrentSavingsListNew.length - 1) {
          distinctList = await this.getDistinctPivotData('pivotResult');
          distinctList[rowNumber][columnIndex] = value.replace('%', '').replace('$', '');
        }
        else {
          for (let index = 1; index < this.pivotResult.length; index++) {
            if (this.pivotResult[index][4] >= weightFrom && this.pivotResult[index][5] <= weightTo && this.pivotResult[index][1] == containerType) {
              if (this.serviceType.toLowerCase() == 'intl' && this.carrierName.toLowerCase() == 'fedex') {
                var alteredWeightObject = this.duplicateList.filter((data: any) => {
                  return (data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
                });
                alteredWeightObject.forEach((element: any) => {
                  element['weightFrom'] = weightFrom;
                });
                this.pivotResult[index]['weightFrom'] = weightFrom;
                this.pivotResult[index][columnIndex] = value.replace('%', '');
              }
              else
                this.pivotResult[index][columnIndex] = value.replace('%', '');
            }
          }
        }
      }

      if (this.MinSavingsList[rowNumber] != undefined) {
        if (this.MinSavingsList[rowNumber].containerType.toLowerCase() == this.CurrentSavingsList[rowNumber].containerType.toLowerCase()) {
          if (this.serviceType.toLowerCase() != 'ground') {
            if (columnName == 'weightFrom' || columnName == 'weightTo' || columnName == 'containerType' || columnName == 'service') {
              if (this.MinSavingsList[rowNumber] != undefined) {
                if (this.serviceType.toLowerCase() != 'intl') {
                  this.minPivotResult[rowNumber + 1][columnIndex] = value;
                  // this.MinSavingsList[rowNumber][columnName] = value;
                }
                else {
                  if (rowNumber > this.MinSavingsListNew.length - 1) {
                    distinctList = await this.getDistinctPivotData('minPivotResult');
                    distinctList[rowNumber][columnIndex] = value.replace('%', '').replace('$', '');
                  }
                  else {
                    for (let index = 1; index < this.minPivotResult.length; index++) {
                      if (this.minPivotResult[index][4] >= weightFrom && this.minPivotResult[index][5] <= weightTo && this.minPivotResult[index][1] == containerType) {
                        if (this.serviceType.toLowerCase() == 'intl' && this.carrierName.toLowerCase() == 'fedex') {
                          this.minPivotResult[index]['weightFrom'] = weightFrom;
                          this.minPivotResult[index][columnIndex] = value.replace('%', '');
                        }
                        else
                          this.minPivotResult[index][columnIndex] = value.replace('%', '');
                      }
                    }
                  }
                  // this.MinSavingsList[rowNumber][columnName] = value;
                }
                this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
                this.dataSourceMinSignal.set(this.dataSourceMin);
                this.cd.detectChanges();
              }
            }
          }
        }
      }
      if (columnName != 'weightFrom' && columnName != 'weightTo' && columnName != 'containerType' && columnName != 'service') {

        var alteredObject = this.duplicateList.filter((data: any) => {
          if (this.serviceType.toLowerCase() != 'intl') {
            return (data.zone1 == columnName && data.containerType == containerType && data.weightFrom == weightFrom && data.weightTo == weightTo);
          }
          else {
            return (data.zone1 == columnName && data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
          }
        });
        alteredObject.forEach((element: any) => {
          element.targetDis = value.replace('%', '');
        })
      }
      else {

        if (rowNumber < this.CurrentSavingsListNew.length) {
          var alteredObject = this.duplicateList.filter((data: any) => {
            if (this.serviceType.toLowerCase() != 'intl') {
              return (data.containerType == containerType && data.weightFrom == weightFrom && data.weightTo == weightTo);
            }
            else {
              return (data.containerType == containerType && data.weightFrom >= weightFrom && data.weightTo <= weightTo);
            }
          });
          alteredObject.forEach((element: any) => {
            element[columnName] = value.toString();
          });
        }
      }

      if (columnName == 'weightFrom' || columnName == 'weightTo' || columnName == 'containerType' || columnName == 'service') {
        this.CurrentSavingsList[rowNumber][columnName] = value;
      }

    }
    // this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
    // this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
  }

  fromWeightToolTipId: any = -1;
  toWeightToolTipId: any = -1;
  type = '';

  async fromWeightFocusout(value: any, columnName: any, containerType: any, rowNumber: any, type: any) {

    this.type = type;
    var listName = type == 'current' ? 'CurrentSavingsList' : 'MinSavingsList';
    var pivotList = type == 'current' ? 'pivotResult' : 'minPivotResult';
    var currentList = (this as any)[listName];
    var currentPivot = (this as any)[pivotList];
    var row = currentList[rowNumber];

    var oldWeightFrom = row.weightFrom;
    var weightTo = (row.weightTo === '' || row.weightTo === null) ? '' : Number(row.weightTo);
    var containerTypeStr = row.containerType.toLowerCase();

    var finalValue = value;

    // Rule 1: Row-based increment applies only when the field is empty
    if (value === '' || value === null || value === undefined) {
      var prevRow = currentList[rowNumber - 1];
      if (prevRow && prevRow.containerType.toLowerCase() === containerTypeStr) {
        finalValue = (prevRow.weightTo !== '' && prevRow.weightTo !== null) ? Number(prevRow.weightTo) + 1 : '';
      }
    }

    if (finalValue !== oldWeightFrom) {
      row[columnName] = finalValue;

      // Pushing Logic: If From > To, push To up to match From
      let prevToData: any = Number(finalValue);
      if (finalValue !== '' && weightTo !== '' && prevToData > weightTo) {
        await this.toWeightFocusout(finalValue, 'weightTo', row.containerType, rowNumber, type);
        return; // toWeightFocusout will handle the rest of the updates and cascades
      }

      // Update duplicate list
      var alteredObject = this.duplicateList.filter((data: any) => {
        if (this.serviceType.toLowerCase() != 'intl') {
          return (data.containerType.toLowerCase() == containerTypeStr && data.weightFrom == oldWeightFrom && data.weightTo == (row.weightTo === '' ? 0 : row.weightTo));
        } else {
          return (data.containerType.toLowerCase() == containerTypeStr && data.weightFrom >= oldWeightFrom && data.weightTo <= (row.weightTo === '' ? 0 : row.weightTo));
        }
      });

      alteredObject.forEach((element: any) => {
        element[columnName] = finalValue;
      });

      // Update pivot list
      var columnIndex = currentPivot[0].findIndex((data: any) => data.replace(' ', '') == columnName);
      if (this.serviceType.toLowerCase() != 'intl') {
        currentPivot[rowNumber + 1][columnIndex] = finalValue;
      } else {
        for (let index = 1; index < currentPivot.length; index++) {
          if (currentPivot[index][4] >= oldWeightFrom && currentPivot[index][5] <= (row.weightTo === '' ? 0 : row.weightTo) && currentPivot[index][1].toLowerCase() == containerTypeStr) {
            currentPivot[index][columnIndex] = finalValue;
          }
        }
      }

      // INTL Merging Logic
      if (this.serviceType.toLowerCase() === 'intl') {
        let sameTypeRows = currentList.filter((r: any, idx: number) =>
          idx !== rowNumber &&
          r.containerType.toLowerCase() === containerTypeStr
        );

        for (let otherRow of sameTypeRows) {
          let otherFrom = Number(otherRow.weightFrom);
          let otherTo = Number(otherRow.weightTo);
          let currentFrom = Number(row.weightFrom);
          let currentTo = Number(row.weightTo);

          if (currentFrom <= otherTo && currentTo >= otherFrom) {
            let newFrom = Math.min(currentFrom, otherFrom);
            let newTo = Math.max(currentTo, otherTo);

            this.duplicateList.filter((data: any) =>
              data.containerType.toLowerCase() === containerTypeStr &&
              ((data.weightFrom >= otherFrom && data.weightTo <= otherTo) ||
                (data.weightFrom >= currentFrom && data.weightTo <= currentTo))
            ).forEach((entry: any) => {
              entry.weightFrom = newFrom;
              entry.weightTo = newTo;
            });

            row.weightFrom = newFrom;
            row.weightTo = newTo;

            let otherIdx = currentList.indexOf(otherRow);
            if (otherIdx !== -1) {
              currentList.splice(otherIdx, 1);
              (this as any)[pivotList].splice(otherIdx + 1, 1);
            }
          }
        }
      }
    }

    // Sync signals and refresh data sources
    this.dataSource = [];
    this.dataSourceMin = [];
    this.dataSourceSignal.set([]);
    this.dataSourceMinSignal.set([]);
    this.CurrentSavingsList.forEach((data: any) => this.dataSource.push(Object.assign({}, data)));
    this.MinSavingsList.forEach((data: any) => this.dataSourceMin.push(Object.assign({}, data)));
    this.dataSourceSignal.set(this.dataSource);
    this.dataSourceMinSignal.set(this.dataSourceMin);
    this.cd.detectChanges();
  }

  async toWeightFocusout(value: any, columnName: any, containerType: any, rowNumber: any, type: any) {

    this.type = type;
    var listName = type == 'current' ? 'CurrentSavingsList' : 'MinSavingsList';
    var pivotList = type == 'current' ? 'pivotResult' : 'minPivotResult';
    var currentList = (this as any)[listName];
    var currentPivot = (this as any)[pivotList];
    var row = currentList[rowNumber];

    var weightFrom = (row.weightFrom === '' || row.weightFrom === null) ? '' : Number(row.weightFrom);
    var oldWeightTo = row.weightTo;
    var containerTypeStr = row.containerType.toLowerCase();

    var finalValue = value;

    if (finalValue !== oldWeightTo) {
      row[columnName] = finalValue;

      // Pushing Logic: If To < From, push From down to match To
      let finalValueData: any = Number(finalValue);
      if (finalValue !== '' && weightFrom !== '' && finalValueData < weightFrom) {
        await this.fromWeightFocusout(finalValue, 'weightFrom', row.containerType, rowNumber, type);
        return; // fromWeightFocusout will handle the rest
      }

      // Update duplicate list
      var alteredObject = this.duplicateList.filter((data: any) => {
        if (this.serviceType.toLowerCase() != 'intl') {
          return (data.containerType.toLowerCase() == containerTypeStr && data.weightFrom == (row.weightFrom === '' ? 0 : row.weightFrom) && data.weightTo == oldWeightTo);
        } else {
          return (data.containerType.toLowerCase() == containerTypeStr && data.weightFrom >= (row.weightFrom === '' ? 0 : row.weightFrom) && data.weightTo <= oldWeightTo);
        }
      });

      alteredObject.forEach((element: any) => {
        element[columnName] = finalValue;
      });

      // Update pivot list
      var columnIndex = currentPivot[0].findIndex((data: any) => data.replace(' ', '') == columnName);
      if (this.serviceType.toLowerCase() != 'intl') {
        currentPivot[rowNumber + 1][columnIndex] = finalValue;
      } else {
        for (let index = 1; index < currentPivot.length; index++) {
          if (currentPivot[index][4] >= (row.weightFrom === '' ? 0 : row.weightFrom) && currentPivot[index][5] <= oldWeightTo && currentPivot[index][1].toLowerCase() == containerTypeStr) {
            currentPivot[index][columnIndex] = finalValue;
          }
        }
      }

      // Cascading Logic (Normal Flow)
      if (this.serviceType.toLowerCase() !== 'intl' && finalValue !== '' && finalValue !== null) {
        let nextRowIndex = currentList.findIndex((r: any, idx: number) => idx > rowNumber && r.containerType.toLowerCase() === containerTypeStr);
        if (nextRowIndex !== -1) {
          let nextRow = currentList[nextRowIndex];
          let newFrom = Number(finalValue) + 1;
          await this.fromWeightFocusout(newFrom, 'weightFrom', nextRow.containerType, nextRowIndex, type);
        }
      }

      // INTL Merging Logic
      if (this.serviceType.toLowerCase() === 'intl') {
        let sameTypeRows = currentList.filter((r: any, idx: number) =>
          idx !== rowNumber &&
          r.containerType.toLowerCase() === containerTypeStr
        );

        for (let otherRow of sameTypeRows) {
          let otherFrom = Number(otherRow.weightFrom);
          let otherTo = Number(otherRow.weightTo);
          let currentFrom = Number(row.weightFrom);
          let currentTo = Number(row.weightTo);

          if (currentFrom <= otherTo && currentTo >= otherFrom) {
            let newFrom = Math.min(currentFrom, otherFrom);
            let newTo = Math.max(currentTo, otherTo);

            this.duplicateList.filter((data: any) =>
              data.containerType.toLowerCase() === containerTypeStr &&
              ((data.weightFrom >= otherFrom && data.weightTo <= otherTo) ||
                (data.weightFrom >= currentFrom && data.weightTo <= currentTo))
            ).forEach((entry: any) => {
              entry.weightFrom = newFrom;
              entry.weightTo = newTo;
            });

            row.weightFrom = newFrom;
            row.weightTo = newTo;

            let otherIdx = currentList.indexOf(otherRow);
            if (otherIdx !== -1) {
              currentList.splice(otherIdx, 1);
              (this as any)[pivotList].splice(otherIdx + 1, 1);
            }
          }
        }
      }
    }

    // Sync signals and refresh data sources
    this.dataSource = [];
    this.dataSourceMin = [];
    this.dataSourceSignal.set([]);
    this.dataSourceMinSignal.set([]);
    this.CurrentSavingsList.forEach((data: any) => this.dataSource.push(Object.assign({}, data)));
    this.MinSavingsList.forEach((data: any) => this.dataSourceMin.push(Object.assign({}, data)));
    this.dataSourceSignal.set(this.dataSource);
    this.dataSourceMinSignal.set(this.dataSourceMin);
    this.cd.detectChanges();
  }

  async getDistinctData(listName: any) {
    var distinctList = [];
    distinctList.push((this as any)[listName][0]);
    for (let i = 0; i < (this as any)[listName].length; i++) {
      var object1 = Object.assign({}, (this as any)[listName][i]);
      var object2 = Object.assign({}, (this as any)[listName][i + 1]);
      var flag = false;

      if ((i + 1) == (this as any)[listName].length) {
        break;
      }
      if (object1.containerType != object2.containerType) {
        distinctList.push(object2);
        continue;
      }
      else {
        for (let j = 0; j < this.zoneList.length; j++) {
          if (object1[this.zoneList[j]] == object2[this.zoneList[j]]) {
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
    return distinctList;
  }

  async getDistinctPivotData(pivotList: any) {

    var distinctList = [];

    distinctList.push((this as any)[pivotList][1]);
    for (let i = 1; i < (this as any)[pivotList].length; i++) {
      var object1 = (this as any)[pivotList][i];
      var object2 = (this as any)[pivotList][i + 1];
      var flag = false;

      if ((i + 1) == (this as any)[pivotList].length) {
        break;
      }
      if (object1[1].toLowerCase() != object2[1].toLowerCase()) {
        distinctList.push(object2);
        continue;
      }
      else {
        for (let j = 8; j < (this as any)[pivotList][0].length; j++) {
          if (object1[j] == object2[j] && object1[j] != '' && object2[j] != '') {
            flag = true;
          }
          else {
            flag = false;
            distinctList.push(object2);
            break;
          }
        }
        if (flag == true) {
          distinctList[distinctList.length - 1][5] = object2[5];
        }
      }
    }


    return distinctList;
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
  drop(event: any) {
  }

  async removeRow(rowNumber: any, type: any) {
    if (type == 'discount') {
      let removedData: any = this.CurrentSavingsList.splice(rowNumber, 1);
      if (rowNumber < this.CurrentSavingsListNew.length) {
        this.deleteList = this.currentServiceList.filter((data: any) => {
          if (this.serviceType.toLowerCase() != 'intl') {
            return (data.containerType.toLowerCase() == removedData[0].containerType.toLowerCase() && data.weightFrom == removedData[0].weightFrom && data.weightTo == removedData[0].weightTo);
          }
          else {
            return (data.containerType.toLowerCase() == removedData[0].containerType.toLowerCase() && data.weightFrom >= removedData[0].weightFrom && data.weightTo <= removedData[0].weightTo);
          }
        });
      }
      var pivotList = await this.getDistinctPivotData('pivotResult');
      // pivotList.splice(rowNumber, 1);
      var rowIndex = this.pivotResult.findIndex((data: any) => JSON.stringify(data) === JSON.stringify(pivotList[rowNumber]));
      this.pivotResult.splice(rowIndex, 1);
      this.dataSource = new MatTableDataSource(this.CurrentSavingsList);
      this.dataSourceSignal.set(this.dataSource);
    }
    else {
      let removedData = this.MinSavingsList.splice(rowNumber, 1);
      if (rowNumber < this.MinSavingsListNew.length) {
        this.deleteList = this.duplicateList.filter((data: any) => {
          if (this.serviceType.toLowerCase() != 'intl') {
            return (data.containerType.toLowerCase() == removedData[0].containerType.toLowerCase() && data.weightFrom == removedData[0].weightFrom && data.weightTo == removedData[0].weightTo);
          }
          else {
            return (data.containerType.toLowerCase() == removedData[0].containerType.toLowerCase() && data.weightFrom >= removedData[0].weightFrom && data.weightTo <= removedData[0].weightTo);
          }
        });
        // this.duplicateList = this.duplicateList.filter((data:any) => !alteredList.includes(data));
      }
      var pivotList = await this.getDistinctPivotData('minPivotResult');
      // pivotList.splice(rowNumber, 1);
      var rowIndex = this.minPivotResult.findIndex((data: any) => JSON.stringify(data) === JSON.stringify(pivotList[rowNumber]));
      this.minPivotResult.splice(rowIndex, 1);
      this.dataSourceMin = new MatTableDataSource(this.MinSavingsList);
      this.dataSourceMinSignal.set(this.dataSourceMin);
    } this.cd.detectChanges();
  }
}



