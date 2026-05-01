
import { CookiesService } from 'src/app/core/services/cookie.service';
import { Component, AfterViewInit, ElementRef, OnInit, Signal, signal, TemplateRef, ViewChild, ChangeDetectorRef, Optional } from '@angular/core';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-plannumber',
  templateUrl: './plannumber.component.html',
  styleUrls: ['./plannumber.component.scss'],
  standalone: false
})
export class UpsPlannumberComponent implements OnInit, AfterViewInit {
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  //variables Declaration
  clientType = signal<any>('');
  userProfifleData: any;
  userProfifle: any;
  clientID: any;
  crmAccountNumber: any;
  planNumber: any;
  countryCode: any;
  adminFlag: boolean = false;
  t002ClntObjUps: any = {};
  planAC: any;

  constructor(private cookiesService: CookiesService,
    private httpClientService: HttpClientService,
    private commonService: CommonService,
    private router: Router,
    private dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<AlertPopupComponent>) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });

    if (this.clientType() == "USPS") {
      this.router.navigate(['/dashboard/dashboard']);
    }
  }

  ngAfterViewInit() {
    // Sync scrollbar width dynamically
    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    this.topScroll.nativeElement.firstElementChild!.setAttribute(
      'style',
      `width:${tableWidth}px`
    );
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }
  ngOnInit(): void {
    this.getUser();
  }


  async getUser() {
    const userProfileData = await this.commonService.getUserprofileData();
    this.userProfifle = userProfileData[0];
    this.clientID = this.userProfifle.clientId;
    this.crmAccountNumber = this.userProfifle.crmAccountNumber;
    this.planNumber = await this.fetchplanDetails(this.clientID);

  }

  async fetchplanDetails(clientIdUps: any) {
    const t002ClntObj: any = {
      clientId: clientIdUps
    };
    this.t002ClntObjUps['t001ClientProfile'] = t002ClntObj;
    try {
      const result = await firstValueFrom(
        this.httpClientService.fetchplanDetails(this.t002ClntObjUps)
      );
      this.planAC = result;
      this.planACFunction(result);
    } catch (error) {
      console.error(error);
    }
  }

  planACFunction(result: any) {
    this.planAC = result;
  }

  // UI -logic

  nickName_Add_PlanNumber(plan: any) {
    const indexVal = this.planAC.findIndex(
      (object: any) => object.planId === plan.planId
    );
    if (indexVal !== -1) {
      if (
        this.planAC[indexVal].planId === plan.planId &&
        this.planAC[indexVal].planNo === plan.planNo
      ) {
        this.planAC[indexVal].nickName = plan.nickName;
        this.planAC = [...this.planAC];
      }
    }
  }

  planUpdate_ClickHandler(rowObj: any, index: any) {
    var updateObj = {};
    updateObj = rowObj;
    this.httpClientService.updatePlanNumber(updateObj).subscribe({
      next: (result) => {
        this.openModal("Updated Successfully");

      }, error: (error) => {
      }
    });
  }

  openModal(alertVal: unknown): void {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      // panelClass: this.panelClass
    });
  }


} 
