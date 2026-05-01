import { Component, OnInit, ViewChild, Inject, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { ResetPopupComponent } from "../reset-popup/reset-popup.component";
import { LoaderService } from "src/app/core/services/loader.service";

interface category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-deleteagreement',
  templateUrl: './deleteagreement.component.html',
  styleUrls: ['./deleteagreement.component.css'],
  standalone: false
})

export class DeleteAgreementComponent implements OnInit {
  // visibility='none';
  @ViewChild('scenarios') scenarioBox: any;
  selectedCategory: any;
  targetListValue = new FormControl();
  mySelections: any;
  metricFilter: category[] = [
    { value: '0', viewValue: 'ALL' },
    { value: '1', viewValue: 'Discount only' },
    { value: '2', viewValue: 'Spend only' },
  ];

  spendCategory: category[] = [
    { value: 'ALL', viewValue: 'ALL' },
    { value: 'Freight', viewValue: 'Freight' },
    { value: 'Accessorial', viewValue: 'Accessorial' },
  ];
  filterComponents: any = []
  scenariosDisplayed: any = [];
  scenariosDisplayedSignal: any = signal<any>([]);
  totalScenarios: any = [];
  selectedMetric = '0';
  selectedSpend = '';
  selectedScenarios = 'ALL';
  serviceName = '';
  selected: string[] = [];
  selectedNew: string[] = [];
  applyClicked = false;
  isLoading = signal<any>(false);
  randomNumber: any;
  isReset: boolean = false;
  deleteList: any = [];

  constructor(public dialogRef: MatDialogRef<DeleteAgreementComponent>, private loaderService: LoaderService, private httpclient: HttpClientService, private fedexService: HttpfedexService, public dialog: MatDialog, public resetDialog: MatDialogRef<AlertPopupComponent>,
    private cookiesService: CookiesService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.serviceName = data.service.toLowerCase();
    data.targetList.forEach((element: any) => {
    });
    this.selectedSpend = data.category;
  }

  async ngOnInit(): Promise<void> {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    await this.getTargetDetails();
  }

  async getTargetDetails() {
    var clientData: any = {};
    if (this.serviceName == 'fedex') {
      clientData['clientId'] = this.data.fedexId;
      var targetDetails = await this.fedexService.fetchTargetDetails(clientData).toPromise();
      const sortedIds = [...targetDetails]
        .sort((a, b) => Number(a.targetId) - Number(b.targetId))
        .slice(0, 2)  // first two smallest
        .map(x => x.targetId);  // extract only ids

      // 2. Loop original order and push only those not in the smallest two
      targetDetails.forEach((element: any) => {
        if (!sortedIds.includes(element.targetId)) {
          this.scenariosDisplayed.push({
            targetId: element.targetId,
            targetName: element.targetName
          });
        }
      });
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      var targetDetails = await this.httpclient.fetchTargetDetails(clientData).toPromise();
      const sortedIds = [...targetDetails]
        .sort((a, b) => Number(a.targetId) - Number(b.targetId))
        .slice(0, 2)  // first two smallest
        .map(x => x.targetId);  // extract only ids

      // 2. Loop original order and push only those not in the smallest two
      targetDetails.forEach((element: any) => {
        if (!sortedIds.includes(element.targetId)) {
          this.scenariosDisplayed.push({
            targetId: element.targetId,
            targetName: element.targetName
          });
        }
      });
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
    }
  }
  toggleSelection(event: any) {
    this.selected = this.targetListValue.value;
  }

  applyfilterbtn_clickHandler() {
    this.applyClicked = true;
    if (this.selected.length >= 1) {
      this.filterComponents = [];
      this.filterComponents.push(this.selectedSpend, this.selected)
    }
  }
  close() {
    this.dialogRef.close([this.deleteList, this.isReset]);
  }
  deleteTarget(targetId: any) {
    let resetDialog = this.dialog.open(ResetPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      data: { message: "Are you sure you want to delete?" }
    });
    resetDialog.afterClosed().subscribe(
      data => {
        if (data) {
          this.delete(targetId);
        }
      });
  }

  delete(targetId: any) {
    this.applyClicked = true;
    this.openLoading();
    var param: any = {
      targetId: targetId,
      clientId: null,
      carrierName: this.serviceName
    }
    if (this.serviceName == 'fedex') {
      param.clientId = this.data.fedexId;
    }
    else {
      param.clientId = this.cookiesService.getCookieItem('clientId');
    }

    this.httpclient.deleteTargetDetails(param).subscribe(response => {
      this.deleteList.push(targetId);
      this.scenariosDisplayed = this.scenariosDisplayed.filter((data: any) => data.targetId != targetId);
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
    });

    this.closeLoading();
    this.resetDialog = this.dialog.open(AlertPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      data: { pageValue: "Agreement Deleted Successfully" }
    });
    this.resetDialog.afterClosed().subscribe(
      data => {
        this.closeLoading();
      });

  }

  openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
  restoreProposal() {
    let panelClass = "";
    let resetDialog = this.dialog.open(ResetPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      panelClass: panelClass,
      data: { message: "Are you sure you want to reset to initial upload?" }
    });
    resetDialog.afterClosed().subscribe(
      result => {
        if (result == true) {
          this.openLoading();
          let targetObj: any = {};
          if (this.serviceName.toLowerCase() == 'ups') {
            targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');
          }
          else {
            targetObj['clientId'] = this.data.fedexId;
          }
          targetObj['carrierName'] = this.serviceName;

          let message = "";
          this.httpclient.restoreProposal(targetObj).subscribe(result => {

            if (result == true) {
              this.isReset = true;
              message = "Successfully restored to initial upload";
            }
            else {
              message = "Restore data unavailable";
            }
            var alertDialog = this.dialog.open(AlertPopupComponent, {
              disableClose: true,
              width: '470px',
              height: 'auto',
              panelClass: panelClass,
              data: { pageValue: message },
            });
            alertDialog.afterClosed().subscribe(() => {
              this.closeLoading();
            });

          });

        }
      });
  }
}
