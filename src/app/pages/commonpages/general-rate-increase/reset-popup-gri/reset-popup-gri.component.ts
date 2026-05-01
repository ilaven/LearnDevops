import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-reset-popup-gri',
  templateUrl: './reset-popup-gri.component.html',
  styleUrls: ['./reset-popup-gri.component.css'],
  standalone: false

})
export class ResetPopupGRIComponent implements OnInit {
  message = '';
  type = "";
  constructor(public dialogRef: MatDialogRef<ResetPopupGRIComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.message = data.message;
    this.type = data.type;
  }
  ngOnInit(): void {
  }
  onSubmit() {
    this.dialogRef.close(true);
  }
  close() {
    this.dialogRef.close(false);
  }
}
