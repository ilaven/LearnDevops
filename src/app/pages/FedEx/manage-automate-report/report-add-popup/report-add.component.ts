import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder, Validators
} from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-report-add-popup',
  templateUrl: './report-add.component.html',
  standalone: false
})
export class AutomateReportAddComponent implements OnInit {
  //ups
  themeoption: any;
  reportSchedulerFormGroup = new UntypedFormGroup({
    reportItem: new UntypedFormControl(''),
    Timebasis: new UntypedFormControl(''),
    Email: new UntypedFormControl(''),
    specialInstruct: new UntypedFormControl(''),
    status: new UntypedFormControl('Active'),
    reportType: new UntypedFormControl(''),
    logId: new UntypedFormControl('')
  });
  reportSchedulerFedexFormGroup = new UntypedFormGroup({
    reportItem: new UntypedFormControl(''),
    Timebasis: new UntypedFormControl(''),
    Email: new UntypedFormControl(''),
    reportType: new UntypedFormControl(''),
    specialInstruct: new UntypedFormControl(''),
    status: new UntypedFormControl('Active')
  });
  reportItems;
  reportAutomationId: any;
  t001ClientProfile;
  panelClass;
  clientType;
  btnEdit;
  click: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<AutomateReportAddComponent>, private httpfedexService: HttpfedexService, private dialog: MatDialog,
    private commonService: CommonService, public _fb: UntypedFormBuilder, private router: Router, private httpClientService: HttpClientService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientType = data.clienttype;
    this.panelClass = data.panelClass;
    this.reportItems = data.pageValue;
    console.log(this.reportItems);
    this.t001ClientProfile = data.t001ClientProfile;
    this.btnEdit = data.btnEdit;

  }
  ngOnInit() {

    if (this.btnEdit == 'yes') {
      console.log(this.reportItems);
      this.reportSchedulerFedexFormGroup.get('reportType')?.setValue(this.reportItems.type);
      this.reportSchedulerFedexFormGroup.get('reportItem')?.setValue(this.reportItems.reportName);
      // if(this.reportItems.reportStatus =="1")
      //           {
      //          this.reportSchedulerFedexFormGroup.get('status').setValue("Active");     

      //           }
      //           if(this.reportItems.reportStatus =="0")
      //           {
      //              this.reportSchedulerFedexFormGroup.get('status').setValue("InActive");       

      //           }
      this.reportSchedulerFedexFormGroup.get('status')?.setValue(this.reportItems.reportStatus);

      this.reportSchedulerFedexFormGroup.get('Timebasis')?.setValue(this.reportItems.trigger);
      this.reportAutomationId = this.reportItems.reportAutomationId;
    }

  }

  btn_submit_clickFedex() {
    var ReportType = this.reportSchedulerFedexFormGroup.get('reportType')?.value;
    var TimeBasis = this.reportSchedulerFedexFormGroup.get('Timebasis')?.value;
    var reportName = this.reportSchedulerFedexFormGroup.get('reportItem')?.value;
    var status = this.reportSchedulerFedexFormGroup.get('status')?.value;
    console.log(status);
    if (reportName == "") {
      this.openModal("Enter all required Fields");
      return;
    }
    if (status == "") {
      this.openModal("Enter all required Fields");
      return;
    }
    if (TimeBasis == "" || TimeBasis == undefined) {
      this.openModal("Enter all required Fields");
      return;
    }
    if (ReportType == "" || ReportType == undefined) {
      this.openModal("Enter all required Fields");
      return;
    }



    var t007reportLogObj: any = {};
    t007reportLogObj["reportName"] = reportName;

    t007reportLogObj["trigger"] = TimeBasis;
    t007reportLogObj["type"] = ReportType;
    t007reportLogObj["statusReport"] = status;


    if (this.btnEdit == 'yes') {
      t007reportLogObj["reportAutomationId"] = this.reportAutomationId;
      t007reportLogObj["action"] = "Update";
    }
    else {
      t007reportLogObj["action"] = "Insert";
    }
    this.click = !this.click;
    console.log(t007reportLogObj);
    this.httpfedexService.manageAutomateReportDetails(t007reportLogObj).subscribe(
      (result: any) => {
        console.log(result);
        if (result) {
          if (this.btnEdit == 'yes') {
            this.openModal("Your Automate Report has been Updated Successfully");
          }
          else {
            this.openModal("Your Automate Report has been added Successfully");
          }

          this.click = !this.click;
        }
      }, (error: any) => {
        console.log(error);
      }
    );

  }
  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '420px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

  }

  save_btn_clickFedex() {
    console.log(this.reportSchedulerFedexFormGroup.value);
    var ReportType = this.reportSchedulerFedexFormGroup.get('reportType')?.value;
    var TimeBasis = this.reportSchedulerFedexFormGroup.get('Timebasis')?.value;
    var reportName = this.reportSchedulerFedexFormGroup.get('reportItem')?.value;
    var status = this.reportSchedulerFedexFormGroup.get('status')?.value;
    console.log(ReportType);
    console.log(TimeBasis);
    console.log(reportName);
    console.log(status);
    if (reportName == "") {
      this.openModal("Enter all required Fields");
      return;
    }
    if (status == "") {
      this.openModal("Enter all required Fields");
      return;
    }
    if (TimeBasis == "" || TimeBasis == undefined) {
      this.openModal("Enter all required Fields");
      return;
    }
    if (ReportType == "" || ReportType == undefined) {
      this.openModal("Enter all required Fields");
      return;
    }

    if (status == "Active") {
      var reortStatus = "1";
    }
    else if (status == "InActive") {
      var reortStatus = "0";
    }

    var t007reportLogObj: any = {};
    t007reportLogObj["reportName"] = reportName;

    t007reportLogObj["trigger"] = TimeBasis;
    t007reportLogObj["type"] = ReportType;

    if (status == "Active") {
      t007reportLogObj['reportStatus'] = "1";

    }
    if (status == "InActive") {
      t007reportLogObj['reportStatus'] = "0";

    }
    t007reportLogObj["action"] = "Update";
    this.click = !this.click;
    console.log(t007reportLogObj);

    this.httpfedexService.manageAutomateReportDetails(t007reportLogObj).subscribe(
      (result: any) => {
        this.openModal("Updated Successfully");
        this.reportItems = result;

      }, (error: any) => {
        console.log(error);
      });
    this.dialogRef.close();

  }

}
