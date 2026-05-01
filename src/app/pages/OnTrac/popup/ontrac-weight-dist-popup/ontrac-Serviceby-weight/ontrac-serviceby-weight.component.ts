import {
  Component,
  Inject,
  Optional,
  OnInit,
  NgZone
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder
} from '@angular/forms';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpClientService } from 'src/app/core/services/httpclient.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-ontrac-serviceby-weight-popup',
  templateUrl: './ontrac-serviceby-weight.component.html',
   standalone: false
})
export class OntracServiceByWeightPopupComponent implements OnInit {

  private service_wgtPopupChart!: am4charts.XYChart;

  resultObj: any;
  ByServiceAc: any;
  ByServicefrtAc: any;

  valFromWgtSidtPage: any;
  moreviewWeightFormGroup!: UntypedFormGroup; 

  invoiceMonth: any;
  invoiceyear: any;
  clientId: any;
  clientName: any;
  themeoption: any;
  groupby: any;
  group: any;
  weight_mainAC: any;
  chargetypevalue: any;
  weightchargetype: any;

  constructor(
    public dialogRef: MatDialogRef<OntracServiceByWeightPopupComponent>,
    private mlForm: UntypedFormBuilder,
    private httpClientService: HttpClientService,
    private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.valFromWgtSidtPage = data.ServiceByWgtpopupVal;

    this.invoiceMonth = this.valFromWgtSidtPage.invoiceMonth ?? '0';
    this.invoiceyear = this.valFromWgtSidtPage.invoiceyear;
    this.clientId = this.valFromWgtSidtPage.clientId;
    this.clientName = this.valFromWgtSidtPage.clientName;
    this.themeoption = this.valFromWgtSidtPage.themeoption;

    this.groupby = "Weightdes";
    this.group = "Weightdestri";
    this.weight_mainAC = this.valFromWgtSidtPage.weight_mainAC;

    this.chargetypevalue = data.chargetypevalue;
    this.weightchargetype = this.chargetypevalue;

    this.moreviewWeightFormGroup = new UntypedFormGroup({
      clientName: new UntypedFormControl(this.clientName),
      clientId: new UntypedFormControl(this.clientId),
      invoiceMonth: new UntypedFormControl(this.invoiceMonth),
      invoicemonth: new UntypedFormControl(this.invoiceMonth),
      invoiceyear: new UntypedFormControl(this.invoiceyear),
      groupby: new UntypedFormControl(this.groupby),
      group: new UntypedFormControl(this.group)
    });

    this.fetchT004Rymax_By_Services();
  }
closeDialog(){
 this.dialogRef.close(true);
}
  ngOnInit(): void {}

  async fetchT004Rymax_By_Services() {
    await this.httpClientService
      .fetchT004Rymax_By_Services(this.moreviewWeightFormGroup.value)
      .subscribe(
        (result: any) => {
          this.resultObj = result;
          this.ByServiceAc = result;
          this.ByServicefrtAc = this.ByServiceAc;
          this.createSeriesFromAC_bar3(this.ByServiceAc);
        },
        (error: any) => {
          console.log('error ', error);
        }
      );
  }

  async createSeriesFromAC_bar3(
    collection: any[],
    seriesName: string | null = null,
    type: string | null = null
  ) {

    const outerNumber = collection.length;

    if (this.weightchargetype === "SHP_FRT+ACC") {
      this.weightchargetype = null;
    }

    const chartDataChild0: any[] = [];
    const chartDataChild1: any[] = [];
    const chartDataChild2: any[] = [];
    const chartDataChild3: any[] = [];
    const chartDataChild4: any[] = [];
    const chartDataChild5: any[] = [];
    const chartDataChild6: any[] = [];
    const chartDataChild7: any[] = [];
    const chartDataChild8: any[] = [];
    const chartDataChild9: any[] = [];
    const chartDataChild10: any[] = [];
    const chartDataChild11: any[] = [];
    const chartDataChild12: any[] = [];
    const chartDataChild13: any[] = [];

    const chargeName_val: any[] = [];

    for (let loopValue = 0; loopValue < outerNumber; loopValue++) {

      const tempObj = collection[loopValue];

      if (tempObj && this.weightchargetype === tempObj.chargetype) {

        chargeName_val.push(tempObj.chargeDescription);

        chartDataChild0.push(tempObj.less16ounds ?? '0');
        chartDataChild1.push(tempObj.less0s ?? '0');
        chartDataChild2.push(tempObj.less1s ?? '0');
        chartDataChild3.push(tempObj.less2s ?? '0');
        chartDataChild4.push(tempObj.less3s ?? '0');
        chartDataChild5.push(tempObj.less4s ?? '0');
        chartDataChild6.push(tempObj.less5s ?? '0');
        chartDataChild7.push(tempObj.less10s ?? '0');
        chartDataChild8.push(tempObj.less20s ?? '0');
        chartDataChild9.push(tempObj.less30s ?? '0');
        chartDataChild10.push(tempObj.less50s ?? '0');
        chartDataChild11.push(tempObj.less70s ?? '0');
        chartDataChild12.push(tempObj.less150s ?? '0');
        chartDataChild13.push(tempObj.less150plus ?? '0');
      }
    }

    const chartDataChild: any[] = [];

    const pushRow = (category: string, arr: any[]) => {
      chartDataChild.push({
        category,
        value1: arr[0],
        value2: arr[1],
        value3: arr[2],
        value4: arr[3],
        value5: arr[4],
        value6: arr[5],
        value7: arr[6],
        value8: arr[7],
        value9: arr[8],
        value10: arr[9]
      });
    };

    pushRow("0-16\nOz", chartDataChild0);
    pushRow("LTR", chartDataChild1);
    pushRow("1", chartDataChild2);
    pushRow("2", chartDataChild3);
    pushRow("3", chartDataChild4);
    pushRow("4", chartDataChild5);
    pushRow("5", chartDataChild6);
    pushRow("6-10", chartDataChild7);
    pushRow("11-20", chartDataChild8);
    pushRow("21-30", chartDataChild9);
    pushRow("31-50", chartDataChild10);
    pushRow("51-70", chartDataChild11);
    pushRow("71-150", chartDataChild12);
    pushRow("151+", chartDataChild13);

    const chart:any = am4core.create("service_weightZoomInPopup", am4charts.XYChart);

    let indicator: any;
    let indicatorInterval: any;

    const showIndicator = () => {
      indicator = chart.tooltipContainer.createChild(am4core.Container);
      indicator.background.fill = am4core.color("#fff");
      indicator.background.fillOpacity = 0.8;
      indicator.width = am4core.percent(100);
      indicator.height = am4core.percent(100);

      const label = indicator.createChild(am4core.Label);
      label.text = "Loading...";
      label.align = "center";
      label.valign = "middle";
      label.fontSize = 20;

      indicator.show();
    };

    const hideIndicator = () => {
      indicator.hide();
      clearInterval(indicatorInterval);
    };

    showIndicator();

    chart.data = chartDataChild;

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.minGridDistance = 30;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "$ Net Charge";

    const createSeries = (field: string, name: string) => {
      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "category";
      series.name = name;
    };

    createSeries("value1", chargeName_val[0]);
    createSeries("value2", chargeName_val[1]);
    createSeries("value3", chargeName_val[2]);
    createSeries("value4", chargeName_val[3]);
    createSeries("value5", chargeName_val[4]);
    createSeries("value6", chargeName_val[5]);
    createSeries("value7", chargeName_val[6]);
    createSeries("value8", chargeName_val[7]);
    createSeries("value9", chargeName_val[8]);
    createSeries("value10", chargeName_val[9]);

    hideIndicator();
  }
}
