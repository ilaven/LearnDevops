import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { ResetPopupGRIComponent } from "../reset-popup-gri/reset-popup-gri.component";
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
interface category {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-filterscreen-gir',
  templateUrl: './filterscreen-gir.component.html',
  styleUrls: ['./filterscreen-gir.component.css'],
  standalone: false
})

export class FilterscreenGRIComponent implements OnInit {
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

  constructor(public dialogRef: MatDialogRef<FilterscreenGRIComponent>, private loaderService: LoaderService, private httpclient: HttpClientService, private fedexService: HttpfedexService, public dialog: MatDialog, public resetDialog: MatDialogRef<ResetPopupGRIComponent>,
    private cookiesService: CookiesService, @Inject(MAT_DIALOG_DATA) private data: any, private changeDetectorRefs: ChangeDetectorRef,) {
    this.serviceName = data.service;
    data.targetList.forEach((element: any) => {
      this.selected.push(element);
      this.selectedNew.push(element);
    });
    this.selectedSpend = data.category;
    this.targetListValue.setValue(this.selected);
  }

  ngOnInit() {
    debugger;
    this.openLoading();
    this.getTargetDetails();
  }

  async getTargetDetails() {
    var clientData: any = {};
    if (this.serviceName.toLowerCase() == 'fedex') {
      clientData['clientId'] = this.data.fedexId;
      var targetDetails = await this.fedexService.fetchGRITargetDetails(clientData).toPromise();
      targetDetails.forEach((element: any) => {
        this.scenariosDisplayed.push(
          {
            targetId: element.targetId,
            targetName: element.targetName,
            isSelected: this.targetListValue.value.includes(String(element.targetId))
          }
        );
      });
      console.log(this.targetListValue.value);
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed);
      console.log(this.scenariosDisplayedSignal());
      this.closeLoading();
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      var targetDetails = await this.httpclient.fetchGRITargetDetails(clientData).toPromise();
      targetDetails.forEach((element: any) => {
        this.scenariosDisplayed.push(
          {
            targetId: element.targetId,
            targetName: element.targetName,
            isSelected: this.targetListValue.value.includes(String(element.targetId))
          }
        );
      });
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed)
      this.closeLoading();
    }
  }
  toggleSelection(event: any, scenario: any) {
    if (event.checked) {
      if (this.selected.length < 2) {
        scenario.isSelected = true;
        this.selected.push(String(scenario.targetId));
      } else {
        // Prevent selecting more than 2
        scenario.isSelected = false;
        event.source.checked = false;
        // Optionally show an alert or snackbar here
      }
    } else {
      scenario.isSelected = false;
      const index = this.selected.indexOf(String(scenario.targetId));
      if (index > -1) {
        this.selected.splice(index, 1);
      }
    }
    this.targetListValue.setValue(this.selected);
  }
  async applyfilterbtn_clickHandler() {
    this.applyClicked = true;
    if (this.selected.length >= 1) {
      this.filterComponents = [];
      this.filterComponents.push(this.selectedSpend, this.selected)
      this.dialogRef.close(this.filterComponents);
    }
  }
  close() {
    this.dialogRef.close();
  }

  deleteTarget(targetId: any) {
    this.resetDialog = this.dialog.open(ResetPopupGRIComponent, {
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

    this.httpclient.deleteTargetDetailsGRI(param).subscribe(response => {
      this.scenariosDisplayed = this.scenariosDisplayed.filter((data: any) => data.targetId != targetId);
      this.scenariosDisplayedSignal.set(this.scenariosDisplayed)
    });
  }
  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.scenariosDisplayed, event.previousIndex, event.currentIndex);
  }
  isLoading: any = signal<any>(false);
  openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
}
