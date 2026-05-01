import { Component, Inject, Optional, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmationPopupComponent } from 'src/app/shared/confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-update-user-popup',
  templateUrl: './update-user-popup.component.html',
  imports:[CommonModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatInputModule],
})
export class UpdateUserPopupComponent implements OnInit {
	clientDetails: any;
	clientId: any;

	usernameListAC: any[] = [];
	T001userNameResult: any = {};
	t001adduserObj: any = {};
	t001finduserObj: any = {};
	panelClass: any;

	gridObjList: any[] = [];
	t001ClientprofObj: any = {};
	t001LogincustObj: any = {};

	addNewUserFormGroup = new UntypedFormGroup({
		userName: new FormControl(''),
		password: new FormControl(''),
		clientId: new FormControl('')
	});

	t001updateuserObj: any = {};
	T001updateusernameResult: any = {};
	t001findusernameObj: any = {};

	showUpdateBtn = false;
	showAddBtn = true;

	deleteObjDetails: any;
	tempId: any = 0;
	gridAC: any[] = [];

	constructor(
		public dialogRef: MatDialogRef<UpdateUserPopupComponent>,
		private httpClientService: HttpClientService,
		private dialog: MatDialog,
		private _cd: ChangeDetectorRef,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.panelClass = data?.panelClass;
		this.clientDetails = data?.pageValue || {};
		this.clientId = this.clientDetails?.clientId;

		this.t001LogincustObj = { upsClientId: this.clientId };
		this.findClientLoginCredential(this.t001LogincustObj);
	}

	ngOnInit(): void {}

	findClientLoginCredential(param: any): void {
		this.httpClientService.findClientLoginCredential(param).subscribe(
		(result: any) => {
			if (!result || result.length === 0) {
				this.gridObjList = [];
				this.T001userNameResult = {};
				this.openModal('No User Found !');
				return;
			}

			this.gridObjList = result;
			this.T001userNameResult = this.gridObjList[0];
			this._cd.markForCheck();
		}, (error: any) => {
			console.log('error', error);
		});
	}

	AddUserName_ClientLoginCredential(param: any): void {
		this.httpClientService.AddUserName_ClientLoginCredential(param).subscribe(
		(result: any) => {
			this.AddUserName_ClientLoginCredentialResult(result);
		}, (error: any) => {
			console.log('error', error);
		});
	}

	deleteUserName_ClientLoginCredential(param: any): void {
		this.httpClientService.deleteUserName_ClientLoginCredential(param).subscribe(
		(result: any) => {
			this.deleteUserName_ClientLoginCredentialResult(param);
		},(error: any) => {
			console.log('error', error);
		});
	}

	findUser(): void {
		this.httpClientService.findUser(this.addNewUserFormGroup.value).subscribe(
		(result: any) => {
			this.findUserResult(result);
		},(error: any) => {
			console.log('error', error);
		});
	}

	findUserUpdate(): void {
		this.httpClientService.findUser(this.addNewUserFormGroup.value).subscribe(
		(result: any) => {
			this.findUserUpdateResult(result);
		},(error: any) => {
			console.log('error', error);
		});
	}

	UpdateUserName_ClientLoginCredential(): void {
		this.httpClientService.UpdateUserName_ClientLoginCredential(this.addNewUserFormGroup.value).subscribe(
		(result: any) => {
			this.UpdateUserName_ClientLoginCredentialResult(result);
		},(error: any) => {
			console.log('error', error);
		});
	}

	UpdateUserName_ClientLoginCredentialResult(event: any): void {
		this.t001LogincustObj['upsClientId'] = this.clientId;
		this.findClientLoginCredential(this.t001LogincustObj);
		this.clearClickHandler(null);
		this.showAddBtn = true;
		this.showUpdateBtn = false;
		this.openModal('Updated Successfully');
	}

	addClickHandler(): void {
		const txt_username = this.addNewUserFormGroup.get('userName')?.value;
		const txt_password = this.addNewUserFormGroup.get('password')?.value;

		if (!txt_username || !txt_password) {
		this.openModal('Enter All Required Field');
		return;
		}

		this.findUser();
	}

	findUserResult(event: any): void {
		const usernameList = event || [];

		if (usernameList.length > 0) {
		this.openModal('UserName and Password Already Exist');
		return;
		}

		this.t001adduserObj = {
		userName: this.addNewUserFormGroup.get('userName')?.value,
		password: this.addNewUserFormGroup.get('password')?.value,
		upsClientId: this.clientId,
		carrierType: this.T001userNameResult?.carrierType || '',
		clientName: this.T001userNameResult?.clientName || '',
		status: this.T001userNameResult?.status || '',
		fedexClientId: this.T001userNameResult?.fedexClientId || '',
		customerType: this.T001userNameResult?.customerType || ''
		};

		this.AddUserName_ClientLoginCredential(this.t001adduserObj);
	}

	AddUserName_ClientLoginCredentialResult(event: any): void {
		this.openModal('New User Added Successfully');
		this.clearClickHandler(null);
		this.t001LogincustObj['upsClientId'] = this.clientId;
		this.findClientLoginCredential(this.t001LogincustObj);
	}

	clearClickHandler(event: any): void {
		this.addNewUserFormGroup.patchValue({
		userName: '',
		password: '',
		clientId: ''
		});
	}

	updateClickHandler(): void {
		const selectedClientObj: any = this.T001updateusernameResult;
		const txt_username = this.addNewUserFormGroup.get('userName')?.value;
		const txt_password = this.addNewUserFormGroup.get('password')?.value;

		this.addNewUserFormGroup.get('clientId')?.setValue(selectedClientObj?.clientId);

		if (!txt_username || !txt_password) {
		this.openModal('Enter All Required Field');
		return;
		}

		this.findUserUpdate();
	}

	findUserUpdateResult(event: any): void {
		const usernameUpdateAC = event || [];

		if (usernameUpdateAC.length > 0) {
		this.openModal('UserName and Password Already Exist');
		return;
		}

		this.showAddBtn = true;
		this.showUpdateBtn = false;
		this.UpdateUserName_ClientLoginCredential();
	}

	editClickHandler(gridObj: any): void {
		this.showUpdateBtn = true;
		this.showAddBtn = false;

		this.addNewUserFormGroup.patchValue({
		userName: gridObj?.userName || '',
		password: gridObj?.password || '',
		clientId: gridObj?.clientId || ''
		});

		this.T001updateusernameResult = gridObj;
	}

	openDeletePopup(gridObj: any): void {
		this.deleteObjDetails = gridObj;
		this.confirmationModal();
	}

	deleteUserName(): void {
		const deleteObj = this.deleteObjDetails;
		if (!deleteObj) {
		return;
		}

		this.tempId = deleteObj.clientId;
		this.deleteUserName_ClientLoginCredential(deleteObj);
	}

	deleteUserName_ClientLoginCredentialResult(event: any): void {
		this.gridObjList = this.gridObjList.filter((item: any) => item !== this.deleteObjDetails);
		this.clearClickHandler(null);
		this.showAddBtn = true;
		this.showUpdateBtn = false;
		this.openModal('User deleted successfully');
	}

	openModal(alertVal: any): void {
		this.dialog.open(AlertPopupComponent, {
		width: '470px',
		height: 'auto',
		data: { pageValue: alertVal },
		panelClass: this.panelClass
		});
	}
	closeDialog() {
		this.dialogRef.close(true);
	}
	confirmationModal(): void {
		const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
		  width: '350px',
		  height:'auto',
		  data: { message: 'Are you sure you want to delete this user?' },
		  panelClass: this.panelClass,
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.deleteUserName();
			}
		});
	}
}