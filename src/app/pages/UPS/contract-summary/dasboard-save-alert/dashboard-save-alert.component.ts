import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dashboard-save-alert',
  templateUrl: './dashboard-save-alert.component.html',
  standalone: false
})
export class DashBoardSaveAlertComponent implements OnInit {
  message = '';
  targetName = '';
  type = "";
  proposalName = "";
  proposalNickname = "";
  agreementList: any = [];
  createAsNewAgreement: boolean = false;
  targetId: any;
  saveClicked = false;
  constructor(public dialogRef: MatDialogRef<DashBoardSaveAlertComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.message = data.message;
    this.type = data.type;
    var scenarioList = data.agreementList;    
    this.targetId = data.targetId;
    this.agreementList = scenarioList.filter((data:any) => data.targetId.toString() == this.targetId.toString());
  }
  ngOnInit(): void {
  }
  save() {
    this.saveClicked = true;
    this.createAsNewAgreement=false;
    var rowIndex = this.agreementList.findIndex((data:any) => data.targetId.toString() == this.targetId.toString());
    var data = {
      result: true, proposalName: this.proposalName.trim(), proposalNickname: this.proposalNickname.trim(), create: this.createAsNewAgreement,
      scenario: this.agreementList[rowIndex]
    }
    this.dialogRef.close(data);
  }
  No(){
    this.createAsNewAgreement=true;
  }

  newAgreement() {
    if (this.proposalNickname.trim() == "" || this.proposalName.trim() == "") {
      return false;
    }
    var rowIndex = this.agreementList.findIndex((data:any) => data.targetId.toString() == this.targetId.toString());
    var data = {
      result: true, proposalName: this.proposalName.trim(), proposalNickname: this.proposalNickname.trim(), create: this.createAsNewAgreement,
      scenario: this.agreementList[rowIndex]
    }
    this.dialogRef.close(data);
    return true;
  }
  close() {
    var data = { result: false }
    this.dialogRef.close(data);
  }
  onCheckboxChange() {
  }
}
