import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-auth-popup',
  templateUrl: './auth-popup.component.html',
    styleUrls: ['./auth-popup.component.scss'],
  imports:[CommonModule,ReactiveFormsModule,MatDialogModule ,MatFormFieldModule ,MatInputModule],
})
export class AuthPopupComponent implements OnInit {
  dialogConfig: any;
  error_text = '';
 passwordFieldType: 'password' | 'text' = 'password';
  authPopupFormGroup = new UntypedFormGroup({
    password: new FormControl('')
  });

  public onClose: Subject<boolean> = new Subject<boolean>();

  t001ClientProfileobj: any = {};
  t001supervisorclient: any = {};
  t001supervisorPasswordobj: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AuthPopupComponent>,
    private httpClientService: HttpClientService,
  ) {
    this.dialogRef.disableClose = true;
  }

    togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  ngOnInit(): void {}

  supervisorclientpassword(param: any): void {
    this.httpClientService.supervisorclientpassword(param).subscribe(
      (result: any) => {
        if (!result || result.length === 0) {
          this.error_text = 'Incorrect Password';
          return;
        }

        this.resultfetchsupervisorclientpassword(result);
      }, (error: any) => {
        console.log('error', error);
        this.error_text = 'Something went wrong';
      }
    );
  }

  updateClickHandler(): void {
    this.error_text = '';

    const passwordText = this.authPopupFormGroup.get('password')?.value;

    if (!passwordText || String(passwordText).trim() === '') {
      this.error_text = 'Please Enter Password';
      return;
    }

    this.t001supervisorclient = {
      clientId: 717
    };

    this.supervisorclientpassword(this.t001supervisorclient);
  }

  resultfetchsupervisorclientpassword(event: any): void {
    const customerResultResource: any[] = event || [];
    this.t001supervisorPasswordobj = customerResultResource[0];

    if (this.t001supervisorPasswordobj &&
      this.t001supervisorPasswordobj.password === this.authPopupFormGroup.get('password')?.value
    ) {
      this.dialogRef.close({ event: 'true' });
      return;
    }

    this.error_text = 'Incorrect Password';
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'false' });
  }
}