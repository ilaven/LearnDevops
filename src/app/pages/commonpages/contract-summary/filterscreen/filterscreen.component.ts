import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import { ResetPopupComponent } from "../reset-popup/reset-popup.component";
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
interface category {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-filterscreen',
  templateUrl: './filterscreen.component.html',
  styleUrls: ['./filterscreen.component.css'],
  standalone: false
})

export class FilterscreenComponent implements OnInit {
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
  filterComponents: any = [];
  scenariosDisplayed: any = [];
  scenariosDisplayedSignal = signal<any>([]);
  totalScenarios: any = [];
  selectedMetric = '0';
  selectedSpend = '';
  selectedScenarios = 'ALL';
  serviceName = '';
  selected: string[] = [];
  selectedNew: string[] = [];
  applyClicked = false;

  displayedColumns = ['drag', 'name', 'display'];
  targetList = [];
  isSelected: any;
  isLoading: any = signal<any>(false);
  themeoption: any;
  constructor(public dialogRef: MatDialogRef<FilterscreenComponent>, private loaderService: LoaderService, private httpclient: HttpClientService, private fedexService: HttpfedexService, public dialog: MatDialog, public resetDialog: MatDialogRef<ResetPopupComponent>,
    private cookiesService: CookiesService, @Inject(MAT_DIALOG_DATA) private data: any, private changeDetectorRefs: ChangeDetectorRef,) {
    this.serviceName = data.service;
    data.targetList.forEach((element: any) => {
      this.selected.push(element);
      this.selectedNew.push(element);
    });
    this.selectedSpend = data.category;
    this.targetListValue.setValue(this.selected);
    this.targetList = data.targetList
  }

  async ngOnInit(): Promise<void> {
    await this.openLoading();
    await this.getTargetDetails();
  }

  async getTargetDetails() {
    var clientData: any = {};
    if (this.serviceName.toLowerCase() == 'fedex') {
      clientData['clientId'] = this.data.fedexId;
      var targetDetails = await this.fedexService.fetchTargetDetails(clientData).toPromise();
      targetDetails.forEach((element: any) => {
        this.isSelected = false;
        this.targetList.forEach(element2 => {
          if (element.targetId == element2) {
            this.isSelected = true;
          }
        });
        this.scenariosDisplayed.push(
          {
            targetId: element.targetId,
            targetName: element.targetName,
            isSelected: this.isSelected
          }
        );
      });
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed)
      this.closeLoading();
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      var targetDetails = await this.httpclient.fetchTargetDetails(clientData).toPromise();
      targetDetails.forEach((element: any) => {
        this.isSelected = false;
        this.targetList.forEach(element2 => {
          if (element.targetId == element2) {
            this.isSelected = true;
          }
        });
        this.scenariosDisplayed.push(
          {
            targetId: element.targetId,
            targetName: element.targetName,
            isSelected: this.isSelected
          }
        );
      });
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed)
      this.closeLoading();
    }
  }
  toggleSelection(event: MatCheckboxChange, index: number) {
    const selectedCount = this.scenariosDisplayed.filter((s: any) => s.isSelected).length;
    if (!event.checked || selectedCount < 2) {
      this.scenariosDisplayed[index].isSelected = event.checked;
    } else {
      this.scenariosDisplayed[index].isSelected = false;
    }
    this.selected = this.scenariosDisplayed.filter((s: any) => s.isSelected);
    this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
  }
  async applyfilterbtn_clickHandler() {
    this.selected = [];
    let message = '';
    var targetObj: any = {
      sortOrderList: []
    };
    this.scenariosDisplayed.forEach((element: any, index: any) => {
      if (element.isSelected == true) {
        this.selected.push(element.targetId)
      }
      targetObj['sortOrderList'].push({ targetId: element.targetId, sortOrder: index + 1, displayProposal: element.isSelected });
    });
    this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
    targetObj['clientId'] = this.cookiesService.getCookieItem('clientId');;
    targetObj['clientName'] = this.cookiesService.getCookieItem('clientName');
    targetObj['carrierName'] = this.serviceName;
    targetObj['targetId'] = this.selected.toString();
    if (this.serviceName.toLowerCase() == 'fedex') {
      await this.fedexService.updateTargetFilter(targetObj).toPromise().then(result => {
        if (result) {
          this.applyClicked = true;
          if (this.selected.length >= 1) {
            this.filterComponents = [];
            this.filterComponents.push(this.selectedSpend, this.selected)
            this.dialogRef.close(this.filterComponents);
          }
        }
      }).catch((err1) => {
        message = "Update Target Filter Failed";
      });
    } else {
      await this.httpclient.updateTargetFilter(targetObj).toPromise().then(result => {
        if (result) {
          this.applyClicked = true;
          if (this.selected.length >= 1) {
            this.filterComponents = [];
            this.filterComponents.push(this.selectedSpend, this.selected)
            this.dialogRef.close(this.filterComponents);
          }
        }
      }).catch((err1) => {
        message = "Update Target Filter Failed";
      });
    }

    if (!this.applyClicked) {
      let panelClass = "";
      if (this.themeoption == 'dark') {
        panelClass = 'page-dark'
      }
      var alertDialog = this.dialog.open(AlertPopupComponent, {
        disableClose: true,
        width: '470px',
        height: 'auto',
        panelClass: panelClass,
        data: { pageValue: message },
      });

      alertDialog.afterClosed().subscribe(() => {
      });
    }

  }
  close() {
    this.dialogRef.close();
  }

  deleteTarget(targetId: any) {
    this.resetDialog = this.dialog.open(ResetPopupComponent, {
      disableClose: true,
      width: '470px',
      height: 'auto',
      data: { message: "Are you sure you want to delete?" }
    });
    this.resetDialog.afterClosed().subscribe(
      data => {
        if (data == true) {
          this.scenarioBox.open();
          this.delete(targetId);
        }
      });
  }
  delete(targetId: any) {
    var param: any = {
      targetId: targetId,
      clientId: null,
      carrierName: this.serviceName
    }
    if (this.serviceName.toLowerCase() == 'fedex') {
      param.clientId = this.data.fedexId;
    }
    else {
      param.clientId = this.cookiesService.getCookieItem('clientId');
    }

    this.httpclient.deleteTargetDetails(param).subscribe(response => {
      this.scenariosDisplayed = this.scenariosDisplayed.filter((data: any) => data.targetId != targetId);
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed)
    });
  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.scenariosDisplayed, event.previousIndex, event.currentIndex);
  }
  openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
}
