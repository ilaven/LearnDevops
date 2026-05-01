import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-fedex-schedular-edit',
  templateUrl: './schedular-edit.component.html',
  styleUrls: ['./schedular-edit.component.scss'],
  standalone: false
})
export class SchedularEditComponent implements OnInit {
  @ViewChild('allSelectedValueFedEx') private allSelectedValueFedEx!: MatOption;
  @ViewChild('accNoSelFedEx') private accNoSelFedEx!: MatSelect;

  // variable Declaration
  clientType: any;
  panelClass: any;
  reportItems: any;
  t001ClientProfile: any;
  btnEdit: any;
  accountNumbers: any;
  sortDir = 1;
  Default = 'ALL';
  defaultArr = ["ALL"];
  click: boolean = false;
  submitted: boolean = false;
  openModalConfig: any;
  invoiceDataVisible: boolean = false;
  editRowData: any = null;

  //from group
  reportSchedulerFedexFormGroup!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SchedularEditComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog
    , private httpfedexService: HttpfedexService
  ) {
    this.reportSchedulerFedexFormGroup = new FormGroup({
      reportItem: new FormControl(''),
      accNo: new FormControl(''),
      Timebasis: new FormControl(''),
      Email: new FormControl(''),
      specialInstruct: new FormControl(''),
      status: new FormControl('')
    });

    this.clientType = data.clienttype;
    this.panelClass = data.panelClass;
    this.reportItems = data.pageValue;
    this.t001ClientProfile = data.t001ClientProfile;
    this.btnEdit = data.btnEdit;
    this.accountNumbers = data.accountNumber;

    if (this.btnEdit != 'yes') {
      this.reportSchedulerFedexFormGroup.get('status')?.setValue('Active');

      let detailrpt20Obj: any = {};
      detailrpt20Obj['reportName'] = "Cost Optimization Insights";
      detailrpt20Obj['reportDescription'] = "Cost Optimization Insights";
      detailrpt20Obj['reportValue'] = "Cost Optimization Insights";
      this.reportItems.push(detailrpt20Obj);

      this.reportItems.forEach((element: any, index: any) => {
        if (element['reportName'] == "Annual Report" || element['reportName'] == "Trend Report")
          this.reportItems.splice(index, 1);
      });
      this.sortArr('reportName');
    }
    else {
      this.reportItems['accountNumber'] = this.reportItems.accountNumber.replace(/@/g, ',').split(',');
      this.reportSchedulerFedexFormGroup.get('status')?.setValue(this.reportItems.status);
    }
  }

  ngOnInit(): void {
    if (this.clientType == "FedEx") {
      this.reportSchedulerFedexFormGroup = this.formBuilder.group({
        reportItem: [{ value: '', disabled: this.btnEdit === 'yes' }, Validators.required],
        accNo: ['', Validators.required],
        Timebasis: ['', Validators.required],
        Email: ['', [Validators.required, this.multipleEmailsValidator.bind(this)]],
        specialInstruct: ['', ''],
        status: [this.reportSchedulerFedexFormGroup.get('status')?.value || 'Active', ''],
        InvoiceData: ['', ''],
      });

      if (this.btnEdit === 'yes') {
        const timeFrameStr = this.reportItems.weeklyDayTime === 'Yes' ? 'Weekly' : (this.reportItems.monthlyDayTime === 'Yes' ? 'Monthly' : '');
        const editReportName = this.reportItems.reportType || this.reportItems.reportName;
        this.editRowData = this.reportItems;
        this.reportItems = [{ reportName: editReportName }];

        this.reportSchedulerFedexFormGroup.patchValue({
          reportItem: editReportName,
          accNo: this.editRowData.accountNumber,
          Timebasis: timeFrameStr,
          Email: this.editRowData.emailId,
          status: this.editRowData.status
        });
      }
    }
  }

  multipleEmailsValidator(control: AbstractControl) {
    if (!control.value) return null;
    const invalidEmails = this.validateMultipleEmails(control.value);
    return invalidEmails.length > 0 ? { email: true } : null;
  }

  // Close popup without saving
  close() {
    this.dialogRef.close();
  }

  sortArr(colName: any) {
    this.reportItems.sort((a: any, b: any) => {
      a = a[colName].toLowerCase();
      b = b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  get fedexform(): { [key: string]: AbstractControl } {
    return this.reportSchedulerFedexFormGroup.controls;
  }

  validateMultipleEmails(emailInput: string): string[] {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Split, trim, and filter invalid emails
    const invalidEmails = emailInput
      .split(",")
      .map(email => email.trim())
      .filter(email => !email || !regex.test(email));

    return invalidEmails;
  }

  btn_submit_clickFedex(): void {
    this.submitted = true;
    this.reportSchedulerFedexFormGroup.markAllAsTouched();

    if (this.reportSchedulerFedexFormGroup.invalid) {
      this.openModal("Enter all required Fields");
      return;
    }

    const email = this.reportSchedulerFedexFormGroup.get('Email')?.value;
    const timeBasis = this.reportSchedulerFedexFormGroup.get('Timebasis')?.value;
    const specialInstruct = this.reportSchedulerFedexFormGroup.get('specialInstruct')?.value;
    let reportItem = this.reportSchedulerFedexFormGroup.get('reportItem')?.value;
    const status = this.reportSchedulerFedexFormGroup.get('status')?.value;
    let accNoUPS = this.reportSchedulerFedexFormGroup.get('accNo')?.value || [];

    let accNo = '';
    if (accNoUPS.indexOf('ALL') >= 0 || accNoUPS === 'ALL') {
      accNo = 'ALL';
    } else {
      accNo = accNoUPS.join('@');
    }

    this.click = !this.click;

    if (this.btnEdit === 'yes') {
      const t007reportLogObj: any = {
        t002ClientProfile: this.t001ClientProfile,
        reportType: reportItem,
        emailId: email,
        specialInstructions: specialInstruct,
        checkCrossYear: 'Report_Scheduler',
        status: status,
        clientId: this.editRowData?.clientId,
        clientName: this.editRowData?.clientName,
        logId: this.editRowData?.logId,
        accountNumber: accNo,
        ...(timeBasis === 'Weekly' && { weeklyDayTime: 'Yes' }),
        ...(timeBasis === 'Monthly' && { monthlyDayTime: 'Yes' })
      };

      this.httpfedexService.updateReportScheduler(t007reportLogObj).subscribe({
        next: (result) => {
          this.openModal("Updated Successfully").afterClosed().subscribe(() => {
            this.dialogRef.close(true);
          });
        },
        error: (err) => console.log(err)
      });

    } else {
      const t007reportLogObj: any = {
        t001ClientProfile: this.t001ClientProfile,
        reportType: reportItem,
        emailId: email,
        specialInstructions: specialInstruct,
        checkCrossYear: 'Report_Scheduler',
        status: status,
        accountNumber: accNo,
        ...(timeBasis === 'Weekly' && { weeklyDayTime: 'Yes' }),
        ...(timeBasis === 'Monthly' && { monthlyDayTime: 'Yes' })
      };

      this.httpfedexService.saveReportScheduler(t007reportLogObj).subscribe({
        next: (result) => {
          if (result) {
            this.openModal(
              'Your request has been submitted successfully. The report will be sent to the given email recipient.'
            ).afterClosed().subscribe(() => {
              this.reportSchedulerFedexFormGroup.reset();
              this.dialogRef.close(true);
            });
          }
        },
        error: (err) => console.error(err)
      });
    }

  }


  openModal(alertVal: any) {
    return this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  toggleAllSelectionFedEx() {
    if (this.allSelectedValueFedEx.selected) {
      this.accNoSelFedEx.options.forEach((item: MatOption) => { item.deselect() });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.reportSchedulerFedexFormGroup.get('accNo')?.setValue(setAllvalue);
    }
  }
  toggleSelectionFedEx() {
    var accvalue = this.reportSchedulerFedexFormGroup.get('accNo')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValueFedEx.deselect();
    }
  }



}