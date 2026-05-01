import { Component, OnInit, OnDestroy, signal, Optional, Inject } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-ups-carrier-agreement-savings-popup',
  templateUrl: './carrier-agreement-savings-popup.component.html',
  styleUrls: ['./carrier-agreement-savings-popup.component.scss'],
  standalone: false
})
export class CarrierAgreementSavingsPopup implements OnInit, OnDestroy {

  //variable declaration
  submitted = false;
  panelClass: any;
  fromPage: any;
  clientName: any;
  clientId: any;
  t001ClientProfile: any;
  click: boolean = false;
  breadCrumbItems!: Array<{}>;
  clientType = signal<any>('');
  private destroy$ = new Subject<void>();

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder, private cookiesService: CookiesService, private httpClient: HttpClientService,
    private httpFedex: HttpfedexService, private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlertPopupComponent>) {

    this.panelClass = data.panelClass;
    this.fromPage = data;
    this.clientName = this.fromPage.clientName;
    this.clientId = this.fromPage.clientId;
    this.t001ClientProfile = this.fromPage.t001ClientProfile;
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });


  }

  ngOnInit(): void {
    this.form = this.formBuilder.nonNullable.group({
      fullname: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(12)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const fullName: string | null = this.form.get('fullname')?.value;
    const email: string | null = this.form.get('email')?.value;
    const phone: string | null = this.form.get('phone')?.value;

    const t007reportLogObj: Record<string, unknown> = {
      t001ClientProfile: this.t001ClientProfile,
      fullName: fullName,
      emailId: email,
      phoneNo: phone,
      clientName: this.clientName,
      clientId: this.clientId
    };

    this.click = !this.click;

    if (this.clientType().toUpperCase() === "UPS") {
      this.httpClient.update_ContractSavings(t007reportLogObj).subscribe({
        next: (result: unknown) => {
          if (result) {
            this.openModal("Thank you, an LJM Analyst will reach out to you shortly.");
            this.click = !this.click;
          }
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
    } else if (this.clientType().toUpperCase() === "FEDEX") {
      this.httpFedex.update_ContractSavings(t007reportLogObj).subscribe({
        next: (result: unknown) => {
          if (result) {
            this.openModal("Thank you, an LJM Analyst will reach out to you shortly.");
            this.click = !this.click;
          }
        },
        error: (error: unknown) => {
          console.error(error);
        }
      });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  openModal(alertVal: unknown): void {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

    this.dialogRef.close({ event: 'true' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  close() {
    this.dialogRef.close();
  }
  

}