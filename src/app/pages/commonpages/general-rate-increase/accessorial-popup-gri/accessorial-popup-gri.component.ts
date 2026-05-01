import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { ResetPopupGRIComponent } from "../reset-popup-gri/reset-popup-gri.component";

@Component({
  selector: 'app-accessorial-popup-gri',
  templateUrl: './accessorial-popup-gri.component.html',
  styleUrls: ['./accessorial-popup-gri.component.css'],
  standalone: false
})
export class AccessorialPopupGRIComponent implements OnInit {

  serviceName;
  editable = false;
  editableCommon = false;
  CurrentSavingsCombinedList: any = [];
  AccDetailsList: any = [];
  previousDecimalNumber = 0;
  previousWholeNumber = 0;

  displayedColumns: any = ['subGroup', 'serviceType', 'targetDis', 'targetDisType'];
  columns = [
    { field: 'Service', fieldVal: 'subGroup' },
    { field: 'Service Type', fieldVal: 'serviceType' },
    { field: 'Discount', fieldVal: 'targetDis' },
    { field: 'Discount Type', fieldVal: 'targetDisType' },
  ];
  spans: any = [];
  accDisTypeValues: string[] = ['$', '%',];

  spansIntl: any = [];
  clientID: any;
  type: any;
  dataSource: any;
  accessorialData: any = [];
  accessorialDataNew: any = [];
  newService: any = [];
  accessorialDataInitialLength: any = [];
  saveButtonClicked: boolean = false;
  currentAgreement: boolean;

  constructor(public dialogRef: MatDialogRef<AccessorialPopupGRIComponent>, private cd: ChangeDetectorRef, private httpClientService: HttpClientService, private cookiesService: CookiesService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,) {

    this.serviceName = data.service;
    for (let index = 0; index < data.pageData.length; index++) {
      this.accessorialData[index] = Object.assign({}, data.pageData[index]);
    }
    this.currentAgreement = data.currentAgreement;
  }

  ngOnInit(): void {
    this.setData();
  }

  setData() {
    for (let index = 0; index < this.accessorialData.length; index++) {
      this.accessorialDataNew[index] = Object.assign({}, this.accessorialData[index]);
    }
    var filteredData = this.accessorialData.filter((currentSavings: any) => currentSavings.service == this.serviceName);
    var unsortedData = [];

    for (let index = 0; index < filteredData.length; index++) {
      unsortedData[index] = Object.assign({}, filteredData[index]);
    }
    this.AccDetailsList = unsortedData.sort((a, b) => a.subGroup.localeCompare(b.subGroup));
    this.dataSource = this.AccDetailsList;
  }

  getRowSpan(col: any, index: any) {
    return this.spans[index] && this.spans[index][col];

  }

  AddNewRowAcc(service: any) {
    var data = Object.assign({}, this.accessorialData[0]);
    var keys = Object.keys(data);

    for (let index = 0; index < keys.length; index++) {
      data[keys[index]] = '';
    }
    data['service'] = service;
    data['isNewRow'] = true;
    data.targetDis = 0.00;
    data['accRatesheetId'] = Math.floor(Math.random() * (999999 - 100000)) + 100000;

    this.AccDetailsList.push(data);
    this.accessorialData.push(data);

    this.dataSource = new MatTableDataSource(this.AccDetailsList);
  }


  focusOutFunction(fieldvalue: any) {
    this.editable = false;
  }

  onSubmit() {
    this.saveButtonClicked = true;
    var emptyflag = false;

    var filteredData = this.accessorialData.filter((data: any) => data.service == this.serviceName);

    var keys = ["subGroup", "serviceType", "targetDis", "targetDisType"];
    for (let index = 0; index < filteredData.length; index++) {
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        if (filteredData[index][keys[keyIndex]] == "" && filteredData[index][keys[keyIndex]].length == 0) {
          emptyflag = true;
          break;
        }
      }
      if (emptyflag == true) {
        break;
      }
    }

    if (emptyflag == false) {
      var oldLength = this.accessorialDataNew.length;
      for (let index = oldLength; index < this.accessorialData.length; index++) {
        this.accessorialData[index].accRatesheetId = 0;
      }

      var alteredList = [];
      for (let index = 0; index < this.accessorialData.length; index++) {
        if (JSON.stringify(this.accessorialData[index]) !== JSON.stringify(this.accessorialDataNew[index])) {
          delete this.accessorialData[index].isNewRow;
          alteredList.push(this.accessorialData[index]);
        }
      }
      this.dialogRef.close(alteredList);
    }
    else {
      return false;
    }
    return false;
  }

  close() {
    this.dialogRef.close();
  }

  otherFocusout(event: any, columnName: any, id: any, rowNumber: any) {
    var value = event.target.value.replace('$', '').replace('%', '');
    this.AccDetailsList[rowNumber][columnName] = value;
  }

  onChange(event: any, columnName: any, id: any, rowNumber: any) {
    var value = event.target.value.replace('$', '').replace('%', '');
    var filteredValue = this.accessorialData.filter((data: any) => data.accRatesheetId == id);
    filteredValue[0][columnName] = value;
  }

  onMinChange(value: any) {
    this.AccDetailsList.forEach((element: any) => {
      element.targetDisType = value;
    });
    var filteredValue = this.accessorialData.filter((data: any) => data.service == this.serviceName);
    filteredValue.forEach((element: any) => {
      element.targetDisType = value;
    });
  }

  storePreviousPercentage(event: any, rowNumber: any) {

    var keyCode;
    keyCode = event.charCode;

    if ((this.AccDetailsList[rowNumber].targetDisType == '$' && event.key == '%') || (this.AccDetailsList[rowNumber].targetDisType == '%' && event.key == '$')) {
      return false;
    }

    if (event.target.value.includes(".")) {
      this.previousWholeNumber = event.target.value.split(".")[0];

      if (event.target.value.split(".").pop().replace('%', '').length < 3) {
        this.previousDecimalNumber = event.target.value.split(".").pop();
      }
    }

    if (keyCode == 45 || keyCode == 46 || keyCode == 37 || keyCode == 36 || keyCode == 8 || keyCode == 32 || (keyCode >= 48 && keyCode <= 57)) {
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
    } return false;
  }
  percentageFocusout(event: any, columnName: any, id: any, rowNumber: any) {
    if (event.target.value.includes(".")) {
      let value = event.target.value.split(".")[0];
      let decimalValue = event.target.value.split(".").pop().replace('%', '');
      if (value == '') {
        event.target.value = "0." + decimalValue + "%";
      }
      if (decimalValue == '') {
        event.target.value = value + ".00%";
      }
    }

    if (!(event.target.value.includes("."))) {
      event.target.value = Number(event.target.value.replaceAll('%', '').replace('$', '')).toFixed(2);
    }

    if ((!event.target.value.includes("%")) && this.AccDetailsList[rowNumber].targetDisType == '%') {
      event.target.value = event.target.value + "%"
    }

    var value = event.target.value.replace('$', '').replace('%', '');
    this.AccDetailsList[rowNumber][columnName] = value;
    this.dataSource = [];
    this.dataSource = new MatTableDataSource(this.AccDetailsList);
  }

  reset() {
    const dialogRef = this.dialog.open(ResetPopupGRIComponent, {
      width: '470px',
      height: 'auto',
      data: { message: "Are you sure you want to reset?" }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.resetList();
        }
      });
  }
  resetList() {
    this.saveButtonClicked = false;
    this.accessorialData = [];
    for (let index = 0; index < this.accessorialDataNew.length; index++) {
      this.accessorialData[index] = Object.assign({}, this.accessorialDataNew[index]);
    }
    this.AccDetailsList = this.accessorialData.filter((currentSavings: any) => currentSavings.service == this.serviceName);
    this.dataSource = new MatTableDataSource(this.AccDetailsList);
    this.cd.detectChanges();
  }

  removeRow(rowIndex: number) {
    let accRatesheetId = this.AccDetailsList[rowIndex].accRatesheetId;
    this.AccDetailsList = this.AccDetailsList.filter((data: any) => data.accRatesheetId != accRatesheetId);
    this.accessorialData = this.accessorialData.filter((data: any) => data.accRatesheetId != accRatesheetId);
    this.dataSource = new MatTableDataSource(this.AccDetailsList);
  }
}
