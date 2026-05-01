import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetailSavingsPopup } from './detail-savings-popup/detail-savings-popup.component'
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-fedex-carrier-agreement-savings',
  templateUrl: './carrier-agreement-savings.component.html',
  styleUrls: ['./carrier-agreement-savings.component.scss'],
  standalone: false
})
export class CarrierAgreementSavingsComponent implements OnInit {

  // variable declaration
  clientName: any;
  clientId: any;
  t001ClientProfile: any;
  clientType = signal<any>('');
  fromPage: any;
  totalCost: any;
  showTotalCostVal: boolean = true;
  carrierType: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CarrierAgreementSavingsComponent>,
    private dialog: MatDialog, private loaderService: LoaderService
  ) {

    this.fromPage = data;
    if (this.fromPage.totalCostVal == 0) {
      this.showTotalCostVal = false;
    }
    this.totalCost = this.fromPage.totalCostVal
    this.clientId = this.fromPage.clientId
    this.clientName = this.fromPage.clientName.toUpperCase();
    this.carrierType = this.fromPage.carrierType();

  }

  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }
  ngOnInit(): void {
    this.loaderService.show();
    this.demoloader()
  }


  ContractPopup_clickHandler() {
    if (this.totalCost > 0) {
      // this.dialogRef.close({event:'true'}); 
      const dialogConfig = this.dialog.open(DetailSavingsPopup, {
        panelClass: 'contractSavingsCls',
        width: '60%',
        height: '400px',
        data: {
          totalCostVal: this.totalCost,
          clientId: this.clientId
        }
      });
    }
  }
  // Save popup and return data

  close() {
    this.dialogRef.close();
  }


}