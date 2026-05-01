import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';


@Component({
  selector: 'app-auth-alert-popup',
  templateUrl: './auth-alert-popup.component.html',
  styleUrls: ['./auth-alert-popup.component.scss'],
  standalone: false
})
export class AuthAlertPopupComponent implements OnInit {

  dialogConfig: any;
  authPopupFormGroup!: FormGroup;
  passwordFieldType: 'password' | 'text' = 'password';
  error_text: string = "";
  t001supervisorclient: any = {};
  t001supervisorPasswordobj: any = {};

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private httpClientService: HttpClientService, private cookiesService: CookiesService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AuthAlertPopupComponent>,) {
    dialogRef.disableClose = true;
    this.authPopupFormGroup = new FormGroup({
      password: new FormControl(''),
    })
  }

  ngOnInit() {
  }


  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  updateClickHandler() {
    var password_text = this.authPopupFormGroup.get("password")?.value;
    if (password_text == "") {
      this.error_text = "Please Enter Password";
      return;
    }
    this.t001supervisorclient["clientId"] = 717;
    this.supervisorclientpassword(this.t001supervisorclient);
  }

  supervisorclientpassword(param: any) {
    this.httpClientService.supervisorclientpassword(param).subscribe({
      next: (result: any) => {

        if (result == null || result.length == 0) {
          this.error_text = "Incorrect Password";
          return;
        } else {
          this.resultfetchsupervisorclientpassword(result);
        }

      },
      error: (error: any) => {
        console.log(' error ', error);
      }
    })
  }

  resultfetchsupervisorclientpassword(event: any) {
    var customerresultResource = [];
    customerresultResource = event;
    this.t001supervisorPasswordobj = customerresultResource[0];
    if (this.t001supervisorPasswordobj["password"] == this.authPopupFormGroup.get("password")?.value) {
      this.dialogRef.close({ event: 'true' });
      return;
    }
    else {
      this.error_text = "Incorrect Password";
      return;
    }
  }

  close() {
    this.dialogRef.close();
  }

}
