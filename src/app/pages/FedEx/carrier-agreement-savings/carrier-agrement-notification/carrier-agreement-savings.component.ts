import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CarrierAgreementSavingsPopup } from '../carrier-agreement-savings-popup/carrier-agreement-savings-popup.component';

@Component({
  selector: 'app-fedex-carrier-agreement-notification',
  templateUrl: './carrier-agreement-notification.component.html',
  styleUrls: ['./carrier-agreement-notification.component.scss'],
  standalone: false
})
export class CarrierAgreementNotificationComponent implements OnInit {

  //variable Decalration 
  fromPage: any;
  clientName: any;
  clientId: any;
  t001ClientProfile: any;
  isFreeAnalysis: boolean = false;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CarrierAgreementNotificationComponent>,
    private dialog: MatDialog, private loaderService: LoaderService
  ) {

    this.fromPage = data;
    this.clientName = this.fromPage.clientName;
    this.clientId = this.fromPage.clientId;
    this.t001ClientProfile = this.fromPage.t001ClientProfile;

  }

  ngOnInit(): void {
  }

  FreeAnalysisPopup_clickHandler() {
    this.isFreeAnalysis = true;
    this.dialogRef.close({ event: 'true' });
    const dialogConfig = this.dialog.open(CarrierAgreementSavingsPopup, {
      panelClass: 'notificationCls',
      width: '750px',
      height: '510px',
      data: {
        clientName: this.clientName,
        clientId: this.clientId,
        t001ClientProfile: this.t001ClientProfile
      }

    });
  }

  close() {
    this.dialogRef.close();
  }


}