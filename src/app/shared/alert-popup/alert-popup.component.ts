import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 

@Component({
    selector: 'app-alert-popup',
    templateUrl: './alert-popup.component.html',
    styleUrls: ['./alert-popup.component.scss'],
    standalone: false
}) 
export class AlertPopupComponent implements OnInit {
dataValue;
typeinfo:any;
clientName:any;

constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AlertPopupComponent>,) {
this.dataValue=data.pageValue;
}

  ngOnInit() {
  }
  closePopup(event:any){
this.dialogRef.close(true);
  }

}
