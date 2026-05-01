import { Component, OnInit, ViewChild, Inject, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"; 
import { CookiesService } from "src/app/core/services/cookie.service";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";


interface category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-excelexport-gri',
  templateUrl: './excelexport-gri.component.html',
  styleUrls: ['./excelexport-gri.component.css'],
  standalone: false
})

export class ExcelExportGRI implements OnInit {


  @ViewChild('scenarios') scenarioBox: any;
  targetListValue = new FormControl();
  selected: number[] = [];
  totalScenarios: any = [];
  totalScenariosSignal=signal<any>([]);
  serviceName: string;
  scenariosDisplayed: any = [];
  exportClicked = false;
  reportType: any;
  addExternalReport: boolean = false;
  constructor(public dialogRef: MatDialogRef<ExcelExportGRI>, @Inject(MAT_DIALOG_DATA) private data: any, private httpclient: HttpClientService, private fedexService: HttpfedexService,
    private cookiesService: CookiesService,) {

    this.serviceName = data.service.toLowerCase();
    data.targetList.forEach((element: any) => {
      this.selected.push(element);
    });
    this.targetListValue.setValue(this.selected);
    this.reportType = data.reportType;
  }

  async ngOnInit() {
    await this.getTargetDetails();
  }
  async getTargetDetails() {
    var clientData: any = {};
    if (this.serviceName == 'fedex') {
      clientData['clientId'] = this.data.fedexId;
      var targetDetails = await this.fedexService.fetchGRITargetDetails(clientData).toPromise();
      targetDetails.forEach((element: any) => {
        this.totalScenarios.push(
          {
            targetId: element.targetId,
            targetName: element.targetName
          }
        );
      });
      this.totalScenariosSignal.set(this.totalScenarios);
    }
    else {
      clientData['clientId'] = this.cookiesService.getCookieItem('clientId');
      var targetDetails = await this.httpclient.fetchGRITargetDetails(clientData).toPromise();
      targetDetails.forEach((element: any) => {
        this.totalScenarios.push(
          {
            targetId: element.targetId,
            targetName: element.targetName
          }
        );
      });
      this.totalScenariosSignal.set(this.totalScenarios)
    }
  }

  onToggle(event: any, targetId: number) {
    if (event.target.checked == true) {
      this.selected.push(targetId);
    }
    else {
      var index = this.selected.indexOf(targetId);
      this.selected.splice(index, 1);
    }
  }

  export() {
    this.exportClicked = true;
    if (this.selected.length == 0) {
      return;
    }
    this.dialogRef.close( this.selected
    );  
  }

  close() {
    this.dialogRef.close();
  }

}
