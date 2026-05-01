import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-ups-edit-account-number',
  templateUrl: './edit-account-number.component.html',
  styleUrls: ['./edit-account-number.component.scss'],
  standalone: false
})
export class EditAccountNumberComponent implements OnInit {

  // variable declaration
  accountAC: any;
  carrierName: any;
  crmAccountNumber: any;
  panelClass: any;
  countryCodeList: any = [];
  stateCodeList: any = [];

  //form group
  editAddressFormGroup!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAccountNumberComponent>,
    private cdr: ChangeDetectorRef, @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private httpclient: HttpClientService,
    private cookiesService: CookiesService, public dialog: MatDialog) {
    this.accountAC = data.accountdata;
    this.carrierName = data.carrierName;
    this.crmAccountNumber = data.crmAccountNumber;

    this.editAddressFormGroup = new FormGroup({
      accountAddressDetailsId: new FormControl(0),
      accountId: new FormControl(''),
      ljmClientName: new FormControl(''),
      crmAccountNumber: new FormControl(''),
      comments: new FormControl(null),
      carrierType: new FormControl(''),
      accountNumber: new FormControl(''),
      companyName: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      zipCode: new FormControl(''),
      countryCode: new FormControl(''),
      confirmedByClient: new FormControl(''),
      confirmedByClientDate: new FormControl(''),
      inactive: new FormControl('N'),
      updatedBy: new FormControl(''),
      createdBy: new FormControl(''),
      updatedTs: new FormControl(''),
      createdTs: new FormControl(''),
      userEmail: new FormControl(''),
    });
  }

  async ngOnInit(): Promise<void> {
    this.panelClass = 'Edit-discount-class';
    this.editAddressFormGroup.patchValue(this.accountAC);
    await this.getCountryCode();
    this.cdr.detectChanges(); // ✅ Forces UI update
  }

  // Close popup without saving
  close() {
    this.dialogRef.close();
  }


  async getCountryCode() {
    try {
      const res = await firstValueFrom(
        this.httpclient.getCountryCode()
      );
      this.countryCodeList = res;
      if (this.editAddressFormGroup.get('countryCode')?.value == "" || this.editAddressFormGroup.get('countryCode')?.value == null) {
        this.editAddressFormGroup.get('countryCode')?.setValue('128');
      }
      this.getStateList(this.editAddressFormGroup.get('countryCode')?.value)

    } catch (error) {
      console.error(error);
    }
  }

  async getStateList(countryObj: any) {
    let country_code: any;
    const selectedCountry: any = this.countryCodeList.find(
      (c: any) => c.CountryCode === parseInt(countryObj)
    );
    if (selectedCountry?.CountryName === 'United State of America') {
      country_code = "USA";
    } else {
      country_code = selectedCountry?.CountryName;
    }
    try {
      const result = await firstValueFrom(
        this.httpclient.getStateList(country_code)
      );
      this.stateCodeList = result;
    } catch (err) {
      console.error(err);
    }
  }

  // Save popup and return data
  async btn_submit_click() {
    let message;
    let APIfetch = false;
    const loginEmailId = this.cookiesService.getCookieItem('loginEmailId');
    const loginUserId = this.cookiesService.getCookieItem('loginUserId');
    if (loginEmailId && loginEmailId.includes('@myljm.com')) {
      if (!this.editAddressFormGroup.get('createdBy')?.value)
        this.editAddressFormGroup.get('createdBy')?.setValue(loginUserId);
      else
        this.editAddressFormGroup.get('updatedBy')?.setValue(loginUserId);
    } else {
      if (!this.editAddressFormGroup.get('createdBy')?.value)
        this.editAddressFormGroup.get('createdBy')?.setValue(loginEmailId);
      else
        this.editAddressFormGroup.get('updatedBy')?.setValue(loginEmailId);
    }
    if (!this.editAddressFormGroup.get('ljmClientName')?.value)
      this.editAddressFormGroup.get('ljmClientName')?.setValue(this.cookiesService.getCookieItem('clientName'));
    if (!this.editAddressFormGroup.get('carrierType')?.value)
      this.editAddressFormGroup.get('carrierType')?.setValue(this.cookiesService.getCookieItem('carrierType'));
    if (this.editAddressFormGroup.get('accountAddressDetailsId')?.value == null)
      this.editAddressFormGroup.get('accountAddressDetailsId')?.setValue(0);
    if (!this.editAddressFormGroup.get('crmAccountNumber')?.value)
      this.editAddressFormGroup.get('crmAccountNumber')?.setValue(this.crmAccountNumber);
    try {
      const res = await firstValueFrom(
        this.httpclient.accountNumberSaveorUpdate(this.editAddressFormGroup.value)
      );
      if (res !== undefined) {
        APIfetch = true;
        this.upsertAccountAddress();
      }
    } catch (err1) {
      message = "Something went wrong. Try again later.";
    }
    if (!APIfetch) {
      this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        data: { pageValue: message },
      }).afterClosed().subscribe(() => { });
    }
  }

  async upsertAccountAddress() {
    let message = '';
    let APIfetch = false;
    this.editAddressFormGroup.get('userEmail')
      ?.setValue(this.cookiesService.getCookieItem('loginEmailId'));
    try {

      const res = await firstValueFrom(
        this.httpclient.upsertAccountAddress(this.editAddressFormGroup.value)
      );
      if (res !== undefined) {
        APIfetch = true;
        message = "Address Updated Successfully.";
      }
    } catch (err1) {
      message = "Something went wrong. Try again later.";
    }
    let panelClass = "";
    const alertDialog = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      // panelClass: panelClass,
      data: { pageValue: message },
    });
    alertDialog.afterClosed().subscribe(() => {
      if (APIfetch) {
        this.dialogRef.close(this.editAddressFormGroup.value);
      }
    });
  }


}