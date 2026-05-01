import { Component, Inject, Optional, OnInit, NgZone, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MatDialog } from '@angular/material/dialog';//9126 service by weight
import { ServiceByWeightPopupComponent } from './Serviceby-weight/serviceby-weight.component';//9126 service by weight
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';


am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

@Component({
  selector: 'app-weight-dist-popup',
  templateUrl: './weight-dist-popup.component.html',
  styleUrls: ['weight-dist-popup.component.css'],
  standalone: false
})
export class WeightDistPopupComponent implements OnInit {
  /* ---------------- Charts ---------------- */
  private volumeWeightChart!: am4charts.XYChart;
  private averageCostChart!: am4charts.XYChart;
  private weightDistPopupChart!: am4charts.XYChart;
  private spendByMonthChart!: am4charts.XYChart;
  private accNoChart!: am4charts.XYChart;
  moreviewWeightFormGroup!: FormGroup;
  dashBoardSHP: FormGroup;
  fromPage: any;
  clientId!: string;
  clientName!: string;
  invoiceMonth = '0';
  invoiceyear!: string;
  readonly groupby = 'Weightdes';
  readonly group = 'Weightdestri';
  themeoption: any;
  panelClass: any;
  weightMainAC: any;
  chargetypevalue = signal<any>('');
  byServiceAc: any[] = [];
  byServiceFrtAc: any[] = [];
  commonAC: any[] = [];
  tempT004AC: any = [];
  weightFrtAC: any[] = [];
  hashMapObjData = new Map();
  hashMapFRTObjData = new Map();
  hashMapObj = new Map();
  weight_mainAC: any;
  weightchargetype: any;
  linkflag = 0;
  ByServicefrtAc: any;
  weightfrtAC: any;
  fun_monthAC: any;
  weightdisttxt_text: any;
  barColors = [
    '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
    '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
    '#E07877', '#E09776', '#F4C5B0', '#F3B777',
    '#F5C7A0', '#F6D3B8'
  ];

  constructor(
    public dialogRef: MatDialogRef<WeightDistPopupComponent>,
    private fb: FormBuilder,
    private httpClientService: HttpClientService,
    private zone: NgZone, private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('SHP_FRT+ACC')
    });
    this.fromPage = data.popupValue;
    if (this.fromPage.invoiceMonth == null) { this.invoiceMonth = '0'; }
    else { this.invoiceMonth = this.fromPage.invoiceMonth; }
    this.invoiceyear = this.fromPage.invoiceyear;
    this.clientId = this.fromPage.clientId;
    this.clientName = this.fromPage.clientName;
    this.themeoption = this.fromPage.themeoption;
    this.panelClass = this.fromPage.panelClassVal; //9126 service by weight
    this.groupby = "Weightdes";
    this.group = "Weightdestri";
    this.weight_mainAC = this.fromPage.weight_mainAC;
    this.chargetypevalue.set(this.fromPage.chargetypevalue);
    this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
    this.moreviewWeightFormGroup = new FormGroup({
      clientName: new FormControl(this.clientName),
      clientId: new FormControl(this.clientId),
      invoiceMonth: new FormControl(this.invoiceMonth),
      invoicemonth: new FormControl(this.invoiceMonth),
      invoiceyear: new FormControl(this.invoiceyear),
      groupby: new FormControl(this.groupby),
      group: new FormControl(this.group)
    })
  }

  ngOnInit() {
    this.dragpanel_initializeHandler();
    this.loadAC(this.weight_mainAC, this.invoiceyear, this.invoiceMonth, this.chargetypevalue());

  }
  async linkshpChange(data: any) {
    this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
    if (data == "SHP_FRT") {
      this.chargetypevalue.set(data);
      await this.linkfrt_clickHandler(data);
    }
    if (data == "SHP_FRT+ACC" || data == null) {
      this.chargetypevalue.set(data);
      await this.linkfrtacc_clickHandler(data);
    }
  }
  closeDialog() {
    this.dialogRef.close(true);
  }
  dragpanel_initializeHandler() {
    this.hashMapObj.set('1', 'JAN');
    this.hashMapObj.set('2', 'FEB');
    this.hashMapObj.set('3', 'MAR');
    this.hashMapObj.set('4', 'APR');
    this.hashMapObj.set('5', 'MAY');
    this.hashMapObj.set('6', 'JUN');
    this.hashMapObj.set('7', 'JULY');
    this.hashMapObj.set('8', 'AUG');
    this.hashMapObj.set('9', 'SEP');
    this.hashMapObj.set('10', 'OCT');
    this.hashMapObj.set('11', 'NOV');
    this.hashMapObj.set('12', 'DEC');
  }
  async loadAC(weightAC1: any, clickedYear: any, clickedMonth: any, chargetypevalue: any) {
    var month = clickedMonth;
    var year = clickedYear;
    var weightAC = weightAC1;
    this.weightfrtAC = weightAC;
    var weightchargetype = chargetypevalue;
    if (weightchargetype == null)
      weightchargetype = "SHP_FRT+ACC";

    await this.By_Services(clickedYear, clickedMonth);
    await this.fun_ServiceAcc_No(clickedYear, clickedMonth);
    await this.fetchT004Rymax_chargeBack_ByMonth();
    var domain_Name = "T004_Dashboard";
    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    if (month == '0') {
      this.weightdisttxt_text = "Weight Distribution" + " " + year;
    }
    else {
      var monthnumber = Number(month);
      this.weightdisttxt_text = "Weight Distribution" + " " + year + " " + monthArray[monthnumber - 1];
    }

    for (var count = 0; count < weightAC.length; count++) {
      var t004Obj = weightAC[count];
      this.serviceType = weightAC[count];
      if (t004Obj.ServiceType == "year") {
        var event_type = "year";
        await this.bar_chart0(weightAC, event_type, weightchargetype);
        await this.bar_chart1(domain_Name, weightAC, event_type, weightchargetype);
        await this.bar_chart2(domain_Name, weightAC, event_type, weightchargetype);
      }
      else if (t004Obj.ServiceType == "month") {
        var event_type = "month";
        await this.bar_chart0(weightAC, event_type, weightchargetype);
        await this.bar_chart1(domain_Name, weightAC, event_type, weightchargetype);
        await this.bar_chart2(domain_Name, weightAC, event_type, weightchargetype);
      }

    }
    var data = this.dashBoardSHP.get('chargetypevalue')?.value;
    if (data == "SHP_FRT") {
      setTimeout(() => { this.linkshpChange('SHP_FRT') }, 5000);
    }
    if (data == "SHP_FRT+ACC" || data == null) {
      setTimeout(() => { this.linkshpChange('SHP_FRT+ACC') }, 5000);
    }

  }
  resultObj: any;
  ByServiceAc: any;
  async fetchT004Rymax_By_Services() {
    await this.httpClientService.fetchT004Rymax_By_Services(this.moreviewWeightFormGroup.value).subscribe(
      (result: any) => {
        this.resultObj = result;
        this.ByServiceAc = result;
        this.ByServicefrtAc = this.ByServiceAc;
        this.bar_chart3(this.ByServiceAc);
      },
      error => {
        console.log('error ', error);
      })
  }
  async bar_chart3(tempAC: any) {
    await this.createSeriesFromAC_bar3(tempAC);
  }
  async createSeriesFromAC_bar3(collection: any) {
    var outerNumber = collection.length;
    var newData = new Map();
    var chartData: any = [];
    if (this.weightchargetype == "SHP_FRT+ACC")
      this.weightchargetype = null;
    var chartDataChild0 = [];
    var chartDataChild1 = [];
    var chartDataChild2 = [];
    var chartDataChild3 = [];
    var chartDataChild4 = [];
    var chartDataChild5 = [];
    var chartDataChild6 = [];
    var chartDataChild7 = [];
    var chartDataChild8 = [];
    var chartDataChild9 = [];
    var chartDataChild10 = [];
    var chartDataChild11 = [];
    var chartDataChild12 = [];
    var chartDataChild13 = [];
    var chartData: any = [];
    var chartData1 = [];
    var chartData2 = [];
    var chartData3 = [];
    var chartData4 = [];
    var chartData5 = [];
    var chartData6 = [];
    var chartData7 = [];
    var chartData8 = [];
    var chartData9 = [];
    var chartData10 = [];
    var chartData11 = [];
    var chartData12 = [];
    var chartData13 = [];
    var chargeName_val = [];
    for (var loopValue = 0; loopValue < outerNumber; loopValue++) {

      var tempObj = collection[loopValue];

      var charDesc = tempObj.chargeDescription;

      if (tempObj != null && this.weightchargetype == tempObj.chargetype) {
        var chargeName = charDesc;
        chargeName_val.push(chargeName);
        chartDataChild0.push(tempObj.less16ounds ? tempObj.less16ounds : '0');
        chartDataChild1.push(tempObj.less0s ? tempObj.less0s : '0');
        chartDataChild2.push(tempObj.less1s ? tempObj.less1s : '0');
        chartDataChild3.push(tempObj.less2s ? tempObj.less2s : '0');
        chartDataChild4.push(tempObj.less3s ? tempObj.less3s : '0');
        chartDataChild5.push(tempObj.less4s ? tempObj.less4s : '0');
        chartDataChild6.push(tempObj.less5s ? tempObj.less5s : '0');
        chartDataChild7.push(tempObj.less10s ? tempObj.less10s : '0');
        chartDataChild8.push(tempObj.less20s ? tempObj.less20s : '0');
        chartDataChild9.push(tempObj.less30s ? tempObj.less30s : '0');
        chartDataChild10.push(tempObj.less50s ? tempObj.less50s : '0');
        chartDataChild11.push(tempObj.less70s ? tempObj.less70s : '0');
        chartDataChild12.push(tempObj.less150s ? tempObj.less150s : '0');
        chartDataChild13.push(tempObj.less150plus ? tempObj.less150plus : '0');
      }
    }
    chartData = chartDataChild0;
    chartData1 = chartDataChild1;
    chartData2 = chartDataChild2;
    chartData3 = chartDataChild3;
    chartData4 = chartDataChild4;
    chartData5 = chartDataChild5;
    chartData6 = chartDataChild6;
    chartData7 = chartDataChild7;
    chartData8 = chartDataChild8;
    chartData9 = chartDataChild9;
    chartData10 = chartDataChild10;
    chartData11 = chartDataChild11;
    chartData12 = chartDataChild12;
    chartData13 = chartDataChild13;
    var chartDataChild = [];
    chartDataChild.push({
      "category": "0-16\nOz",
      "value1": chartData[0],
      "value2": chartData[1],
      "value3": chartData[2],
      "value4": chartData[3],
      "value5": chartData[4],
      "value6": chartData[5],
      "value7": chartData[6],
      "value8": chartData[7],
      "value9": chartData[8],
      "value10": chartData[9]
    });
    chartDataChild.push({
      "category": "LTR",
      "value1": chartData1[0],
      "value2": chartData1[1],
      "value3": chartData1[2],
      "value4": chartData1[3],
      "value5": chartData1[4],
      "value6": chartData1[5],
      "value7": chartData1[6],
      "value8": chartData1[7],
      "value9": chartData1[8],
      "value10": chartData1[9]
    });
    chartDataChild.push({
      "category": "1",
      "value1": chartData2[0],
      "value2": chartData2[1],
      "value3": chartData2[2],
      "value4": chartData2[3],
      "value5": chartData2[4],
      "value6": chartData2[5],
      "value7": chartData2[6],
      "value8": chartData2[7],
      "value9": chartData2[8],
      "value10": chartData2[9]
    });
    chartDataChild.push({
      "category": "2",
      "value1": chartData3[0],
      "value2": chartData3[1],
      "value3": chartData3[2],
      "value4": chartData3[3],
      "value5": chartData3[4],
      "value6": chartData3[5],
      "value7": chartData3[6],
      "value8": chartData3[7],
      "value9": chartData3[8],
      "value10": chartData3[9]
    });
    chartDataChild.push({
      "category": "3",
      "value1": chartData4[0],
      "value2": chartData4[1],
      "value3": chartData4[2],
      "value4": chartData4[3],
      "value5": chartData4[4],
      "value6": chartData4[5],
      "value7": chartData4[6],
      "value8": chartData4[7],
      "value9": chartData4[8],
      "value10": chartData4[9]
    });
    chartDataChild.push({
      "category": "4",
      "value1": chartData5[0],
      "value2": chartData5[1],
      "value3": chartData5[2],
      "value4": chartData5[3],
      "value5": chartData5[4],
      "value6": chartData5[5],
      "value7": chartData5[6],
      "value8": chartData5[7],
      "value9": chartData5[8],
      "value10": chartData5[9]
    });
    chartDataChild.push({
      "category": "5",
      "value1": chartData6[0],
      "value2": chartData6[1],
      "value3": chartData6[2],
      "value4": chartData6[3],
      "value5": chartData[4],
      "value6": chartData6[5],
      "value7": chartData6[6],
      "value8": chartData6[7],
      "value9": chartData6[8],
      "value10": chartData6[9]
    });
    chartDataChild.push({
      "category": "6-10",
      "value1": chartData7[0],
      "value2": chartData7[1],
      "value3": chartData7[2],
      "value4": chartData7[3],
      "value5": chartData7[4],
      "value6": chartData7[5],
      "value7": chartData7[6],
      "value8": chartData7[7],
      "value9": chartData7[8],
      "value10": chartData7[9]
    });
    chartDataChild.push({
      "category": "11-20",
      "value1": chartData8[0],
      "value2": chartData8[1],
      "value3": chartData8[2],
      "value4": chartData8[3],
      "value5": chartData8[4],
      "value6": chartData8[5],
      "value7": chartData8[6],
      "value8": chartData8[7],
      "value9": chartData8[8],
      "value10": chartData8[9]
    });
    chartDataChild.push({
      "category": "21-30",
      "value1": chartData9[0],
      "value2": chartData9[1],
      "value3": chartData9[2],
      "value4": chartData9[3],
      "value5": chartData9[4],
      "value6": chartData9[5],
      "value7": chartData9[6],
      "value8": chartData9[7],
      "value9": chartData9[8],
      "value10": chartData9[9]
    });
    chartDataChild.push({
      "category": "31-50",
      "value1": chartData10[0],
      "value2": chartData10[1],
      "value3": chartData10[2],
      "value4": chartData10[3],
      "value5": chartData10[4],
      "value6": chartData10[5],
      "value7": chartData10[6],
      "value8": chartData10[7],
      "value9": chartData10[8],
      "value10": chartData10[9]
    });
    chartDataChild.push({
      "category": "51-70",
      "value1": chartData11[0],
      "value2": chartData11[1],
      "value3": chartData11[2],
      "value4": chartData11[3],
      "value5": chartData11[4],
      "value6": chartData11[5],
      "value7": chartData11[6],
      "value8": chartData11[7],
      "value9": chartData11[8],
      "value10": chartData11[9]
    });
    chartDataChild.push({
      "category": "71-150",
      "value1": chartData12[0],
      "value2": chartData12[1],
      "value3": chartData12[2],
      "value4": chartData12[3],
      "value5": chartData12[4],
      "value6": chartData12[5],
      "value7": chartData12[6],
      "value8": chartData12[7],
      "value9": chartData12[8],
      "value10": chartData12[9]
    });
    chartDataChild.push({
      "category": "151+",
      "value1": chartData13[0],
      "value2": chartData13[1],
      "value3": chartData13[2],
      "value4": chartData13[3],
      "value5": chartData13[4],
      "value6": chartData13[5],
      "value7": chartData13[6],
      "value8": chartData13[7],
      "value9": chartData13[8],
      "value10": chartData13[9]
    });


    var chart: any = am4core.create("service_weight", am4charts.XYChart);
    showIndicator();
    //Chart loader
    var indicator: any;
    var indicatorInterval: any;
    function showIndicator() {


      indicator = chart.tooltipContainer.createChild(am4core.Container);
      indicator.background.fill = am4core.color("#fff");
      indicator.background.fillOpacity = 0.8;
      indicator.width = am4core.percent(100);
      indicator.height = am4core.percent(100);

      var indicatorLabel = indicator.createChild(am4core.Label);
      indicatorLabel.text = "Loading...";
      indicatorLabel.align = "center";
      indicatorLabel.valign = "middle";
      indicatorLabel.fontSize = 20;
      indicatorLabel.dy = 50;

      var hourglass = indicator.createChild(am4core.Image);
      hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
      hourglass.align = "center";
      hourglass.valign = "middle";
      hourglass.horizontalCenter = "middle";
      hourglass.verticalCenter = "middle";
      hourglass.scale = 0.7;


      indicator.hide(0);
      indicator.show();

      clearInterval(indicatorInterval);
      indicatorInterval = setInterval(function () {
        hourglass.animate([{
          from: 0,
          to: 360,
          property: "rotation"
        }], 2000);
      }, 3000);
    }

    function hideIndicator() {

      indicator.hide();
      clearInterval(indicatorInterval);
    }

    // Add data
    chart.data = chartDataChild;
    var minNegVal = false;
    for (var loop = 0; loop < chartDataChild.length; loop++) {
      var netAmtArray: any = chartDataChild;
      var netamt = netAmtArray[loop].value;
      if (netamt < 0) {
        minNegVal = true;
        break;
      }
    }
    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.inside = false;
    categoryAxis.renderer.labels.template.valign = "top";
    categoryAxis.renderer.labels.template.fontSize = 11;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.min = 0;
    valueAxis.title.text = "$ NET CHARGE";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
      return "$" + text;
    });
    if (minNegVal == false) {
      valueAxis.min = 0;
    }
    // Create series
    function createSeries(field: any, name: any) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "category";
      series.name = name;
      series.columns.template.tooltipText = "{name}: $[bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.width = am4core.percent(95);
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;

      var bullet = series.bullets.push(new am4charts.LabelBullet);
      bullet.label.rotation = 90;
      bullet.label.truncate = false;
      bullet.label.hideOversized = false;
      bullet.label.horizontalCenter = "middle";
      bullet.locationY = 1;
      bullet.dy = 10;
    }
    if (this.themeoption == "dark") {
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
      valueAxis.renderer.grid.template.strokeWidth = 2;
    }
    //chart.paddingBottom = 150;
    chart.maskBullets = false;

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

    if (chartData.length > 0) {
      await hideIndicator();
    }
  }
  async linkfrt_clickHandler(event: any) {
    this.linkflag = 1;
    this.weightchargetype = "SHP_FRT";
    await this.bar_chart3(this.ByServicefrtAc);
    await this.weightdist(this.weightfrtAC);
    await this.fun_month(this.fun_monthAC);
    await this.commoniter();
  }
  async linkfrtacc_clickHandler(event: any) {
    this.linkflag = 0;
    this.weightchargetype = "SHP_FRT+ACC";
    await this.bar_chart3(this.ByServicefrtAc);
    this.weightchargetype = "SHP_FRT+ACC";
    await this.weightdist(this.weightfrtAC);
    await this.fun_month(this.fun_monthAC);
    this.weightchargetype = "SHP_FRT+ACC";
    await this.commoniter();
  }

  serviceType: any;
  t004ChargeObj = {};
  async By_Services(currentYear: any, clickedMonth: any) {
    await this.fetchT004Rymax_By_Services();

  }
  async fun_ServiceAcc_No(currentyear: string, currentmonth: string) {

    await this.fetchT000Service_Acc();

  }
  async bar_chart0(tempAC: any, event_type: string, weightchargetype: string) {
    await this.createSeriesFromAC_bar(tempAC, event_type, weightchargetype, "", "")
  }
  series: any;
  chartData: any;
  collectionArr: any;
  async createSeriesFromAC_bar(
    collection: any,
    event_type: string,
    weightchargetype: string,
    nameField: string,
    yField: string
  ) {

    this.collectionArr = collection;
    let tempObj: any;

    if (collection.length > 0) {

      if (
        (weightchargetype == "SHP_FRT" && event_type == "month") ||
        (weightchargetype == "SHP_FRT" && event_type == "year")
      ) {
        tempObj = collection[0];
      }
      else if (weightchargetype == "SHP_FRT+ACC" && event_type == "month") {
        tempObj = collection[1];
      }
      else {
        tempObj = collection[12];
      }
    }

    let chartData: any[] = [];

    if (tempObj != null && event_type == "month") {

      chartData = [
        { weight: "0-16\nOz", value: tempObj.averageCostless16ounds ? tempObj.averageCostless16ounds : '0' },
        { weight: "LTR", value: tempObj.averageCostless0s ? tempObj.averageCostless0s : '0' },
        { weight: "1", value: tempObj.averageCostless1s ? tempObj.averageCostless1s : '0' },
        { weight: "2", value: tempObj.averageCostless2s ? tempObj.averageCostless2s : '0' },
        { weight: "3", value: tempObj.averageCostless3s ? tempObj.averageCostless3s : '0' },
        { weight: "4", value: tempObj.averageCostless4s ? tempObj.averageCostless4s : '0' },
        { weight: "5", value: tempObj.averageCostless5s ? tempObj.averageCostless5s : '0' },
        { weight: "6-10", value: tempObj.averageCostless10s ? tempObj.averageCostless10s : '0' },
        { weight: "11-20", value: tempObj.averageCostless20s ? tempObj.averageCostless20s : '0' },
        { weight: "21-30", value: tempObj.averageCostless30s ? tempObj.averageCostless30s : '0' },
        { weight: "31-50", value: tempObj.averageCostless50s ? tempObj.averageCostless50s : '0' },
        { weight: "51-70", value: tempObj.averageCostless70s ? tempObj.averageCostless70s : '0' },
        { weight: "71-150", value: tempObj.averageCostless150s ? tempObj.averageCostless150s : '0' },
        { weight: "151+", value: tempObj.averageCostless150plus ? tempObj.averageCostless150plus : '0' }
      ];
    }
    else {

      chartData = [
        { weight: "0-16\nOz", value: tempObj.yearAverageCostless16ounds ? tempObj.yearAverageCostless16ounds : '0' },
        { weight: "LTR", value: tempObj.yearAverageCostless0s ? tempObj.yearAverageCostless0s : '0' },
        { weight: "1", value: tempObj.yearAverageCostless1s ? tempObj.yearAverageCostless1s : '0' },
        { weight: "2", value: tempObj.yearAverageCostless2s ? tempObj.yearAverageCostless2s : '0' },
        { weight: "3", value: tempObj.yearAverageCostless3s ? tempObj.yearAverageCostless3s : '0' },
        { weight: "4", value: tempObj.yearAverageCostless4s ? tempObj.yearAverageCostless4s : '0' },
        { weight: "5", value: tempObj.yearAverageCostless5s ? tempObj.yearAverageCostless5s : '0' },
        { weight: "6-10", value: tempObj.yearAverageCostless10s ? tempObj.yearAverageCostless10s : '0' },
        { weight: "11-20", value: tempObj.yearAverageCostless20s ? tempObj.yearAverageCostless20s : '0' },
        { weight: "21-30", value: tempObj.yearAverageCostless30s ? tempObj.yearAverageCostless30s : '0' },
        { weight: "31-50", value: tempObj.yearAverageCostless50s ? tempObj.yearAverageCostless50s : '0' },
        { weight: "51-70", value: tempObj.yearAverageCostless70s ? tempObj.yearAverageCostless70s : '0' },
        { weight: "71-150", value: tempObj.yearAverageCostless150s ? tempObj.yearAverageCostless150s : '0' },
        { weight: "151+", value: tempObj.yearAverageCostless150plus ? tempObj.yearAverageCostless150plus : '0' }
      ];
    }

    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);

    this.zone.runOutsideAngular(() => {

      const chart: any = am4core.create("weight_disPopup", am4charts.XYChart);

      let indicator: any;
      let indicatorInterval: any;

      const showIndicator = () => {

        indicator = chart.tooltipContainer.createChild(am4core.Container);
        indicator.background.fill = am4core.color("#fff");
        indicator.background.fillOpacity = 0.8;
        indicator.width = am4core.percent(100);
        indicator.height = am4core.percent(100);

        const indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = "Loading...";
        indicatorLabel.align = "center";
        indicatorLabel.valign = "middle";
        indicatorLabel.fontSize = 20;
        indicatorLabel.dy = 50;

        const hourglass = indicator.createChild(am4core.Image);
        hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
        hourglass.align = "center";
        hourglass.valign = "middle";
        hourglass.horizontalCenter = "middle";
        hourglass.verticalCenter = "middle";
        hourglass.scale = 0.7;

        indicator.hide(0);
        indicator.show();

        clearInterval(indicatorInterval);
        indicatorInterval = setInterval(() => {
          hourglass.animate([{ from: 0, to: 360, property: "rotation" }], 2000);
        }, 3000);
      };

      const hideIndicator = () => {
        indicator.hide();
        clearInterval(indicatorInterval);
      };

      showIndicator();

      this.chartData = chartData;
      this.chartDataTemp = chartData;
      chart.data = chartData;

      let minNegVal = false;
      for (let loop = 0; loop < chartData.length; loop++) {
        if (chartData[loop].value < 0) {
          minNegVal = true;
          break;
        }
      }

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false;
      categoryAxis.dataFields.category = "weight";
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.labels.template.fontSize = 11;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.title.text = "$ NET CHARGE";
      valueAxis.title.fontWeight = "bold";

      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => "$" + text);

      if (!minNegVal) {
        valueAxis.min = 0;
      }

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText =
        "Weight: [bold]{categoryX}[/]\n Avg Cost: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;

      // ✅ FIXED `this` issue
      series.columns.template.events.on("hit", (ev: any) => {
        this.barExclusionFunc(ev.target._dataItem.categories.categoryX);
      });

      const columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.fontSize = 11;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      // columnTemplate.adapter.add("fill", (_: any, target: any) =>
      //   chart.colors.getIndex(target.dataItem.index)
      // );

      // columnTemplate.adapter.add("stroke", (_: any, target: any) =>
      //   chart.colors.getIndex(target.dataItem.index)
      // );
      columnTemplate.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        // valueAxis.renderer.grid.template.strokeOpacity = 1;
        // valueAxis.renderer.grid.template.strokeWidth = 2;
      }

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = true;
      chart.cursor.lineY.strokeOpacity = true;

      this.weight_disPopupChart = chart;

      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }

  chartDataFinal: any;
  chartDataTemp: any;
  weight_disPopupChart: any;
  barExclusionFunc(categoryVal: any) {

    for (let loop = 0; loop < this.chartDataTemp.length; loop++) {
      if (this.chartDataTemp[loop]['weight'] == categoryVal) {
        this.chartDataTemp.splice(loop, 1);
      }
    }

    am4core.useTheme(am4themes_animated);

    this.zone.runOutsideAngular(() => {

      const chart: any = am4core.create("weight_disPopup", am4charts.XYChart);
      chart.data = this.chartDataTemp;

      let minNegVal = false;

      for (let loop = 0; loop < this.chartDataTemp.length; loop++) {
        const netamt = this.chartDataTemp[loop].value;
        if (netamt < 0) {
          minNegVal = true;
          break;
        }
      }

      const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false;
      categoryAxis.dataFields.category = "weight";
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.grid.template.disabled = true;

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.title.text = "$ NET CHARGE";
      valueAxis.title.fontWeight = "bold";
      valueAxis.renderer.grid.template.disabled = true;

      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return "$" + text;
      });

      if (minNegVal === false) {
        valueAxis.min = 0;
      }

      const series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText =
        "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";

      series.columns.template.fillOpacity = 1;
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      // ✅ FIXED: arrow function keeps component `this`
      series.columns.template.events.on("hit", (ev: any) => {
        this.barExclusionFunc(
          ev.target._dataItem.categories.categoryX
        );
      });

      const columnTemplate = series.columns.template;
      // columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 0;
      columnTemplate.fontSize = 11;
      // columnTemplate.stroke = am4core.color("#FFFFFF");
      columnTemplate.column.cornerRadiusTopLeft = 8;
      columnTemplate.column.cornerRadiusTopRight = 8;
      columnTemplate.column.cornerRadiusBottomLeft = 0;
      columnTemplate.column.cornerRadiusBottomRight = 0;

      // columnTemplate.adapter.add("fill", (_: any, target: any) => {
      //   return chart.colors.getIndex(target.dataItem.index);
      // });

      // columnTemplate.adapter.add("stroke", (_: any, target: any) => {
      //   return chart.colors.getIndex(target.dataItem.index);
      // });
      columnTemplate.adapter.add('fill', (fill: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption === "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        // valueAxis.renderer.grid.template.strokeOpacity = 1;
        // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        // valueAxis.renderer.grid.template.strokeWidth = 2;
      }

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      chart.cursor.lineX.disabled = true;
      chart.cursor.lineY.disabled = true;

      this.weight_disPopupChart = chart;
    });
  }

  resetBars() {
    this.bar_chart0(this.collectionArr, this.serviceType.ServiceType, this.chargetypevalue());
  }
  async weightdist(weightfrtAC: any) {
    var domain_Name = "T004_Dashboard";
    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var month = this.moreviewWeightFormGroup.get('invoiceMonth')?.value;
    var year = this.moreviewWeightFormGroup.get('invoiceyear')?.value;

    if (month == '0') {
      this.weightdisttxt_text = "Weight Distribution" + " " + year;
    }
    else {
      var monthnumber = Number(month);
      this.weightdisttxt_text = "Weight Distribution" + " " + year + " " + monthArray[monthnumber - 1];
    }

    for (var count = 0; count < weightfrtAC.length; count++) {
      var t004frtObj = weightfrtAC[count];

      if (t004frtObj.ServiceType == "year") {
        var event_type: string = "year";
        await this.bar_chart0(weightfrtAC, event_type, this.weightchargetype);
        await this.bar_chart1(domain_Name, weightfrtAC, event_type, this.weightchargetype);
        await this.bar_chart2(domain_Name, weightfrtAC, event_type, this.weightchargetype);
      }
      else if (t004frtObj.ServiceType == "month") {
        var event_type: string = "month";
        await this.bar_chart0(weightfrtAC, event_type, this.weightchargetype);
        await this.bar_chart1(domain_Name, weightfrtAC, event_type, this.weightchargetype);
        await this.bar_chart2(domain_Name, weightfrtAC, event_type, this.weightchargetype);
      }

    }
  }
  async bar_chart1(domainName: string, tempAC: any, event_type: string, weightchargetype: string) {
    await this.createSeriesFromAC_bar31(domainName, tempAC, event_type, weightchargetype);
  }
  async createSeriesFromAC_bar31(domainName: string, collection: any, event_type: string, weightchargetype: string) {


    if (collection.length > 0)

      var tempObj;


    if ((weightchargetype == "SHP_FRT" && event_type == "month") || (weightchargetype == "SHP_FRT" && event_type == "year")) {
      tempObj = collection[0];
    }
    else if (weightchargetype == "SHP_FRT+ACC" && event_type == "month") {
      tempObj = collection[1];
    }
    else {

      tempObj = collection[12];
    }


    if (tempObj != null && event_type == "month") {
      var chartData: any = [{
        "weight": "0-16\nOz",
        "value": tempObj.less16ounds ? tempObj.less16ounds : '0'
      },
      {
        "weight": "LTR",
        "value": tempObj.less0s ? tempObj.less0s : '0'
      },
      {
        "weight": "1",
        "value": tempObj.less1s ? tempObj.less1s : '0'
      },
      {
        "weight": "2",
        "value": tempObj.less2s ? tempObj.less2s : '0'
      },
      {
        "weight": "3",
        "value": tempObj.less3s ? tempObj.less3s : '0'
      },
      {
        "weight": "4",
        "value": tempObj.less4s ? tempObj.less4s : '0'
      },
      {
        "weight": "5",
        "value": tempObj.less5s ? tempObj.less5s : '0'
      },
      {
        "weight": "6-10",
        "value": tempObj.less10s ? tempObj.less10s : '0'
      },
      {
        "weight": "11-20",
        "value": tempObj.less20s ? tempObj.less20s : '0'
      },
      {
        "weight": "21-30",
        "value": tempObj.less30s ? tempObj.less30s : '0'
      },
      {
        "weight": "31-50",
        "value": tempObj.less50s ? tempObj.less50s : '0'
      },
      {
        "weight": "51-70",
        "value": tempObj.less70s ? tempObj.less70s : '0'
      },
      {
        "weight": "71-150",
        "value": tempObj.less150s ? tempObj.less150s : '0'
      },
      {
        "weight": "151+",
        "value": tempObj.less150plus ? tempObj.less150plus : '0'
      }
      ]
    }
    else {
      var chartData: any = [{
        "weight": "0-16\nOz",
        "value": tempObj.yearless16ounds ? tempObj.yearless16ounds : '0'
      },
      {
        "weight": "LTR",
        "value": tempObj.yearless0s ? tempObj.yearless0s : '0'
      },
      {
        "weight": "1",
        "value": tempObj.yearless1s ? tempObj.yearless1s : '0'
      },
      {
        "weight": "2",
        "value": tempObj.yearless2s ? tempObj.yearless2s : '0'
      },
      {
        "weight": "3",
        "value": tempObj.yearless3s ? tempObj.yearless3s : '0'
      },
      {
        "weight": "4",
        "value": tempObj.yearless4s ? tempObj.yearless4s : '0'
      },
      {
        "weight": "5",
        "value": tempObj.yearless5s ? tempObj.yearless5s : '0'
      },
      {
        "weight": "6-10",
        "value": tempObj.yearless10s ? tempObj.yearless10s : '0'
      },
      {
        "weight": "11-20",
        "value": tempObj.yearless20s ? tempObj.yearless20s : '0'
      },
      {
        "weight": "21-30",
        "value": tempObj.yearless30s ? tempObj.yearless30s : '0'
      },
      {
        "weight": "31-50",
        "value": tempObj.yearless50s ? tempObj.yearless50s : '0'
      },
      {
        "weight": "51-70",
        "value": tempObj.yearless70s ? tempObj.yearless70s : '0'
      },
      {
        "weight": "71-150",
        "value": tempObj.yearless150s ? tempObj.yearless150s : '0'
      },
      {
        "weight": "151+",
        "value": tempObj.yearless150plus ? tempObj.yearless150plus : '0'
      }
      ]
    }

    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart: any = am4core.create("average_cost", am4charts.XYChart);

      showIndicator();
      //Chart loader
      var indicator: any;
      var indicatorInterval: any;
      function showIndicator() {


        indicator = chart.tooltipContainer.createChild(am4core.Container);
        indicator.background.fill = am4core.color("#fff");
        indicator.background.fillOpacity = 0.8;
        indicator.width = am4core.percent(100);
        indicator.height = am4core.percent(100);

        var indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = "Loading...";
        indicatorLabel.align = "center";
        indicatorLabel.valign = "middle";
        indicatorLabel.fontSize = 20;
        indicatorLabel.dy = 50;

        var hourglass = indicator.createChild(am4core.Image);
        hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
        hourglass.align = "center";
        hourglass.valign = "middle";
        hourglass.horizontalCenter = "middle";
        hourglass.verticalCenter = "middle";
        hourglass.scale = 0.7;


        indicator.hide(0);
        indicator.show();

        clearInterval(indicatorInterval);
        indicatorInterval = setInterval(function () {
          hourglass.animate([{
            from: 0,
            to: 360,
            property: "rotation"
          }], 2000);
        }, 3000);
      }

      function hideIndicator() {

        indicator.hide();
        clearInterval(indicatorInterval);
      }
      // showIndicator();

      // Add data
      chart.data = chartData;
      var minNegVal = false;
      for (var loop = 0; loop < chartData.length; loop++) {
        var netAmtArray = chartData;
        var netamt = netAmtArray[loop].value;
        if (netamt < 0) {
          minNegVal = true;
          break;
        }
      }
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
      categoryAxis.dataFields.category = "weight";
      categoryAxis.renderer.minGridDistance = 10;
      // categoryAxis.renderer.labels.template.rotation = 0;
      // categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
      categoryAxis.renderer.labels.template.fontSize = 11;

      // categoryAxis.renderer.labels.template.horizontalCenter = "middle";
      // categoryAxis.renderer.labels.template.verticalCenter = "middle";
      // categoryAxis.renderer.line.strokeOpacity = 1;
      // categoryAxis.renderer.line.strokeWidth = 1;
      // categoryAxis.renderer.line.stroke = am4core.color("#000");

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      // valueAxis.renderer.grid.template.disabled = true;
      valueAxis.title.text = "$ NET CHARGE";
      valueAxis.title.fontWeight = "bold";
      valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
        return "$" + text;
      });
      if (minNegVal == false) {
        valueAxis.min = 0;
      }


      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.fontSize = 11;

      columnTemplate.stroke = am4core.color("#FFFFFF");
      columnTemplate.cornerRadiusTopLeft = 8;
      columnTemplate.cornerRadiusTopRight = 8;

      columnTemplate.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption == "dark") {

        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        // valueAxis.renderer.grid.template.strokeOpacity = 1;
        // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        // valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;

      this.average_costChart = chart;
      if (chartData.length > 0) {

        hideIndicator();
      }
    });
  }
  average_costChart: any;
  async bar_chart2(domainName: string, tempAC: any, event_type: string, weightchargetype: string) {
    await this.createSeriesFromAC2(domainName, tempAC, event_type, weightchargetype, "Bar")

  }
  async createSeriesFromAC2(domainName: string, collection: any, event_type: string, weightchargetype: string, seriesName: string) {

    if (collection.length > 0)

      var tempObj;

    if ((weightchargetype == "SHP_FRT" && event_type == "month") || (weightchargetype == "SHP_FRT" && event_type == "year")) {
      tempObj = collection[0];
    }
    else if (weightchargetype == "SHP_FRT+ACC" && event_type == "month") {
      tempObj = collection[1];
    }
    else {

      tempObj = collection[12];
    }


    if (tempObj != null && event_type == "month") {

      var chartData: any = [{
        "weight": "0-16\nOz",
        "value": tempObj.volumeless16ounds ? tempObj.volumeless16ounds : '0'
      },
      {
        "weight": "LTR",
        "value": tempObj.volumeless0s ? tempObj.volumeless0s : '0'
      },
      {
        "weight": "1",
        "value": tempObj.volumeless1s ? tempObj.volumeless1s : '0'
      },
      {
        "weight": "2",
        "value": tempObj.volumeless2s ? tempObj.volumeless2s : '0'
      },
      {
        "weight": "3",
        "value": tempObj.volumeless3s ? tempObj.volumeless3s : '0'
      },
      {
        "weight": "4",
        "value": tempObj.volumeless4s ? tempObj.volumeless4s : '0'
      },
      {
        "weight": "5",
        "value": tempObj.volumeless5s ? tempObj.volumeless5s : '0'
      },
      {
        "weight": "6-10",
        "value": tempObj.volumeless10s ? tempObj.volumeless10s : '0'
      },
      {
        "weight": "11-20",
        "value": tempObj.volumeless20s ? tempObj.volumeless20s : '0'
      },
      {
        "weight": "21-30",
        "value": tempObj.volumeless30s ? tempObj.volumeless30s : '0'
      },
      {
        "weight": "31-50",
        "value": tempObj.volumeless50s ? tempObj.volumeless50s : '0'
      },
      {
        "weight": "51-70",
        "value": tempObj.volumeless70s ? tempObj.volumeless70s : '0'
      },
      {
        "weight": "71-150",
        "value": tempObj.volumeless150s ? tempObj.volumeless150s : '0'
      },
      {
        "weight": "151+",
        "value": tempObj.volumeless150plus ? tempObj.volumeless150plus : '0'
      }
      ]

    }
    else {
      var chartData: any = [{
        "weight": "0-16\nOz",
        "value": tempObj.yearVolumeless16ounds ? tempObj.yearVolumeless16ounds : '0'
      },
      {
        "weight": "LTR",
        "value": tempObj.yearVolumeless0s ? tempObj.yearVolumeless0s : '0'
      },
      {
        "weight": "1",
        "value": tempObj.yearVolumeless1s ? tempObj.yearVolumeless1s : '0'
      },
      {
        "weight": "2",
        "value": tempObj.yearVolumeless2s ? tempObj.yearVolumeless2s : '0'
      },
      {
        "weight": "3",
        "value": tempObj.yearVolumeless3s ? tempObj.yearVolumeless3s : '0'
      },
      {
        "weight": "4",
        "value": tempObj.yearVolumeless4s ? tempObj.yearVolumeless4s : '0'
      },
      {
        "weight": "5",
        "value": tempObj.yearVolumeless5s ? tempObj.yearVolumeless5s : '0'
      },
      {
        "weight": "6-10",
        "value": tempObj.yearVolumeless10s ? tempObj.yearVolumeless10s : '0'
      },
      {
        "weight": "11-20",
        "value": tempObj.yearVolumeless20s ? tempObj.yearVolumeless20s : '0'
      },
      {
        "weight": "21-30",
        "value": tempObj.yearVolumeless30s ? tempObj.yearVolumeless30s : '0'
      },
      {
        "weight": "31-50",
        "value": tempObj.yearVolumeless50s ? tempObj.yearVolumeless50s : '0'
      },
      {
        "weight": "51-70",
        "value": tempObj.yearVolumeless70s ? tempObj.yearVolumeless70s : '0'
      },
      {
        "weight": "71-150",
        "value": tempObj.yearVolumeless150s ? tempObj.yearVolumeless150s : '0'
      },
      {
        "weight": "151+",
        "value": tempObj.yearVolumeless150plus ? tempObj.yearVolumeless150plus : '0'
      }
      ]

    }
    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart: any = am4core.create("volume_weight", am4charts.XYChart);
      showIndicator();
      //Chart loader
      var indicator: any;
      var indicatorInterval: any;
      function showIndicator() {


        indicator = chart.tooltipContainer.createChild(am4core.Container);
        indicator.background.fill = am4core.color("#fff");
        indicator.background.fillOpacity = 0.8;
        indicator.width = am4core.percent(100);
        indicator.height = am4core.percent(100);

        var indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = "Loading...";
        indicatorLabel.align = "center";
        indicatorLabel.valign = "middle";
        indicatorLabel.fontSize = 20;
        indicatorLabel.dy = 50;

        var hourglass = indicator.createChild(am4core.Image);
        hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
        hourglass.align = "center";
        hourglass.valign = "middle";
        hourglass.horizontalCenter = "middle";
        hourglass.verticalCenter = "middle";
        hourglass.scale = 0.7;


        indicator.hide(0);
        indicator.show();

        clearInterval(indicatorInterval);
        indicatorInterval = setInterval(function () {
          hourglass.animate([{
            from: 0,
            to: 360,
            property: "rotation"
          }], 2000);
        }, 3000);
      }

      function hideIndicator() {

        indicator.hide();
        clearInterval(indicatorInterval);
      }
      chart.paddingBottom = 30;
      chart.angle = 35;

      // Add data
      chart.data = chartData;
      var minNegVal = false;
      for (var loop = 0; loop < chartData.length; loop++) {
        var netAmtArray = chartData;
        var netamt = netAmtArray[loop].value;
        if (netamt < 0) {
          minNegVal = true;
          break;
        }
      }
      // Create axes

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
      categoryAxis.dataFields.category = "weight";
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 30;
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.labels.template.fontSize = 11;



      let labelTemplate = categoryAxis.renderer.labels.template;
      labelTemplate.rotation = 0;
      labelTemplate.fontSize = 12;
      labelTemplate.dy = 10; // moves it a bit down;
      labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
      valueAxis.title.text = "COUNT";
      valueAxis.title.fontWeight = "bold";
      valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
        return text;
      });
      if (minNegVal == false) {
        valueAxis.min = 0;
      }
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Package Count: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 1;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 0;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.column.cornerRadiusTopLeft = 8;
      columnTemplate.column.cornerRadiusTopRight = 8;
      columnTemplate.stroke = am4core.color("#FFFFFF");
      // columnTemplate.adapter.add("fill", function (fill: any, target: any) {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })

      // columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
      //   return chart.colors.getIndex(target.dataItem.index);
      // })
      series.columns.template.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });
      if (this.themeoption == "dark") {

        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        // valueAxis.renderer.grid.template.strokeOpacity = 1;
        // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        // valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      this.volume_weightChart = chart;
      if (chartData.length > 0) {

        hideIndicator();
      }
    });
  }
  volume_weightChart: any;
  serviceAccAC: any[] = [];
  commonACSHP_FRT: any[] = [];
  commonACSHP_FRT_ACC: any[] = [];
  fromACC: any;
  toACC: any;
  from: any;
  to: any;

  fetchT000Service_Acc(): void {
    this.httpClientService
      .fetchT000Service_Acc(this.moreviewWeightFormGroup.value)
      .subscribe(
        (result: any) => {
          this.resultObj = result;
          this.serviceAccAC = result;

          for (let count = 0; count < this.serviceAccAC.length; count++) {
            const tempobj: any = this.serviceAccAC[count];

            if (tempobj.chargeType === "SHP_FRT") {
              this.commonACSHP_FRT.push(tempobj);
            } else {
              this.commonACSHP_FRT_ACC.push(tempobj);
            }
          }

          if (this.weightchargetype == null) {
            this.weightchargetype = "SHP_FRT+ACC";
          }

          this.commoniter();
        },
        (error) => {
          console.log("error", error);
        }
      );
  }


  async common() {
    this.commonAC = [];
    if (this.weightchargetype == null)
      this.weightchargetype = "SHP_FRT+ACC";
    if (this.weightchargetype == "SHP_FRT+ACC") {

      for (var count = this.fromACC; count < this.toACC; count++) {
        var tempobj = this.commonACSHP_FRT_ACC[count];
        this.commonAC.push(tempobj);
      }
    } else {
      for (var count = this.from; count < this.to; count++) {
        var tempobj = this.commonACSHP_FRT[count];
        this.commonAC.push(tempobj);
      }
    }
    await this.Acc_No(this.commonAC);
    this.cd.detectChanges();
  }
  previous_id_visible: any;
  first_id_visible: any;
  next_id_visible: any;
  async commoniter() {

    if (this.weightchargetype == "SHP_FRT+ACC") {
      if (this.commonACSHP_FRT_ACC.length < 5 || this.commonACSHP_FRT_ACC.length == 5) {
        this.fromACC = 0;
        this.toACC = this.commonACSHP_FRT_ACC.length;
        this.previous_id_visible = false;
        this.first_id_visible = false;

        this.next_id_visible = false;
      }
      else {
        this.fromACC = 0;
        this.toACC = 5;
        this.next_id_visible = true;
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      await this.common();
    }
    else {
      if (this.commonACSHP_FRT.length < 5 || this.commonACSHP_FRT.length == 5) {
        this.from = 0;
        this.to = this.commonACSHP_FRT.length;
        this.previous_id_visible = false;
        this.first_id_visible = false;

        this.next_id_visible = false;
      }
      else {
        this.from = 0;
        this.to = 5;
        this.next_id_visible = true;
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      await this.common();
    }
  }
  async Acc_No(tempAC: any) {
    await this.createSeriesFromAC21(tempAC, "Bar")

  }

  async createSeriesFromAC21(collection: any, seriesName: string) {

    if (this.weightchargetype == null)
      this.weightchargetype = "SHP_FRT+ACC"
    var chartData: any = [];
    if (collection.length > 0) {
      for (var loop = 0; loop < collection.length; loop++) {

        var tempObj = collection[loop];

        var value1 = tempObj.group;
        var nameFiled = tempObj.accountNumber;


        var yField = tempObj.netamount;
        chartData.push({ "name": nameFiled, "points": yField })

      }

    }
    else {

      nameFiled = "Nil";
      yField = "0";

    }





    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart: any = am4core.create("acc_no", am4charts.XYChart);
      showIndicator();
      //Chart loader
      var indicator: any;
      var indicatorInterval: any;
      function showIndicator() {


        indicator = chart.tooltipContainer.createChild(am4core.Container);
        indicator.background.fill = am4core.color("#fff");
        indicator.background.fillOpacity = 0.8;
        indicator.width = am4core.percent(100);
        indicator.height = am4core.percent(100);

        var indicatorLabel = indicator.createChild(am4core.Label);
        indicatorLabel.text = "Loading...";
        indicatorLabel.align = "center";
        indicatorLabel.valign = "middle";
        indicatorLabel.fontSize = 20;
        indicatorLabel.dy = 50;

        var hourglass = indicator.createChild(am4core.Image);
        hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
        hourglass.align = "center";
        hourglass.valign = "middle";
        hourglass.horizontalCenter = "middle";
        hourglass.verticalCenter = "middle";
        hourglass.scale = 0.7;


        indicator.hide(0);
        indicator.show();

        clearInterval(indicatorInterval);
        indicatorInterval = setInterval(function () {
          hourglass.animate([{
            from: 0,
            to: 360,
            property: "rotation"
          }], 2000);
        }, 3000);
      }

      function hideIndicator() {

        indicator.hide();
        clearInterval(indicatorInterval);
      }
      chart.scrollbarX = new am4core.Scrollbar();
      // Add data
      chart.data = chartData;
      var minNegVal = false;
      for (var loop = 0; loop < chartData.length; loop++) {
        var netAmtArray = chartData;
        var netamt = netAmtArray[loop].value;
        if (netamt < 0) {
          minNegVal = true;
          break;
        }
      }
      // Create axes

      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
      valueAxis.title.text = "$ NET CHARGE";
      valueAxis.title.fontWeight = "bold";
      valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
        return "$" + text;
      });
      if (minNegVal == false) {
        valueAxis.min = 0;
      }
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "points";
      series.dataFields.categoryX = "name";
      series.name = "Account";
      series.columns.template.tooltipText = "Account Number: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;
      series.columns.template.adapter.add('fill', (_: any) => { return am4core.color('#1AA7E8'); });

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        // valueAxis.renderer.grid.template.strokeOpacity = 1;
        // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        // valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 0;
      columnTemplate.cornerRadiusTopLeft = 8;
      columnTemplate.cornerRadiusTopRight = 8;

      this.acc_noChart = chart;
      if (chartData.length > 0) {

        hideIndicator();
      }
    });
  }
  acc_noChart: any;
  async fetchT004Rymax_chargeBack_ByMonth() {
    await this.httpClientService.fetchT004Rymax_chargeBack_ByMonth(this.moreviewWeightFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
        this.fun_monthAC = result;
        this.fun_month(this.fun_monthAC);
      },
      error => {
        console.log('error ', error);
      })
  }
  tempt004AC: any = [];
  t004tempObj: any = [];
  async fun_month(arrayAC: any): Promise<void> {

    let invoicemonthAC: any[] = [];
    const totalmonth = 12;
    let monthNo = 0;
    let year: any;

    this.t004tempObj = [];

    // Collect invoice months
    for (let listcount = 0; listcount < arrayAC.length; listcount++) {

      this.t004tempObj = arrayAC[listcount];
      year = await this.t004tempObj['invoiceyear'];

      if (!invoicemonthAC.indexOf(this.t004tempObj['invoiceMonth'])) {
        invoicemonthAC.push(this.t004tempObj['invoiceMonth']);
      }
    }

    // Find missing months
    let resultmonthAC: any[] = [];

    for (let monthcount = 0; monthcount < totalmonth; monthcount++) {

      monthNo++;

      if (!invoicemonthAC.indexOf(String(monthNo))) {
        resultmonthAC.push(String(monthNo));
        resultmonthAC.push(String(monthNo));
      }
    }

    // Push missing months with alternating charge types
    for (let loop = 0; loop < resultmonthAC.length; loop++) {

      this.t004tempObj['invoiceMonth'] = resultmonthAC[loop];
      this.t004tempObj['invoiceyear'] = year;

      if (loop % 2 !== 0) {
        this.t004tempObj['chargetype'] = 'SHP_FRT+ACC';
      } else {
        this.t004tempObj['chargetype'] = 'SHP_FRT';
      }

      await arrayAC.push(this.t004tempObj);
    }

    // Month-wise transformation
    for (let count = 0; count < arrayAC.length; count++) {

      const t004Obj = arrayAC[count];
      const totVaule: string = t004Obj.netamount;
      const chargetypevalue = t004Obj.chargetype;

      if (t004Obj.invoiceMonth == '1')
        await this.tempt004AC.push({ Month: 'JAN', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '2')
        await this.tempt004AC.push({ Month: 'FEB', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '3')
        await this.tempt004AC.push({ Month: 'MAR', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '4')
        await this.tempt004AC.push({ Month: 'APR', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '5')
        await this.tempt004AC.push({ Month: 'MAY', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '6')
        await this.tempt004AC.push({ Month: 'JUN', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '7')
        await this.tempt004AC.push({ Month: 'JULY', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '8')
        await this.tempt004AC.push({ Month: 'AUG', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '9')
        await this.tempt004AC.push({ Month: 'SEP', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '10')
        await this.tempt004AC.push({ Month: 'OCT', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '11')
        await this.tempt004AC.push({ Month: 'NOV', value: totVaule, chargetyperesult: chargetypevalue });

      if (t004Obj.invoiceMonth == '12')
        await this.tempt004AC.push({ Month: 'DEC', value: totVaule, chargetyperesult: chargetypevalue });
    }

    await this.Spend_Month(this.tempt004AC);
  }

  async Spend_Month(tempAC: any) {
    await this.createSeriesFromAC10(tempAC, this.weightchargetype, "Month", "value")
  }
  async createSeriesFromAC10(collection: any, chargedesctype: String, nameField: String, yField: String) {


    this.hashMapObjData.clear();
    if (collection.length > 0) {


      for (var count = 0; count < collection.length; count++) {


        var t004Objtemp = collection[count];
        if (t004Objtemp.chargetyperesult == "SHP_FRT+ACC") {
          let month: string = '';

          if (t004Objtemp.Month == "JAN")
            month = "1";
          if (t004Objtemp.Month == "FEB")
            month = "2";
          if (t004Objtemp.Month == "MAR")
            month = "3";
          if (t004Objtemp.Month == "APR")
            month = "4";
          if (t004Objtemp.Month == "MAY")
            month = "5";
          if (t004Objtemp.Month == "JUN")
            month = "6";
          if (t004Objtemp.Month == "JULY")
            month = "7";
          if (t004Objtemp.Month == "AUG")
            month = "8";
          if (t004Objtemp.Month == "SEP")
            month = "9";
          if (t004Objtemp.Month == "OCT")
            month = "10";
          if (t004Objtemp.Month == "NOV")
            month = "11";
          if (t004Objtemp.Month == "DEC")
            month = "12";

          var yField: String = t004Objtemp.value;
          await this.hashMapObjData.set("" + month, t004Objtemp);
        }

        if (t004Objtemp.chargetyperesult == "SHP_FRT") {
          let month: any = '';

          if (t004Objtemp.Month == "JAN")
            month = "1";
          if (t004Objtemp.Month == "FEB")
            month = "2";
          if (t004Objtemp.Month == "MAR")
            month = "3";
          if (t004Objtemp.Month == "APR")
            month = "4";
          if (t004Objtemp.Month == "MAY")
            month = "5";
          if (t004Objtemp.Month == "JUN")
            month = "6";
          if (t004Objtemp.Month == "JULY")
            month = "7";
          if (t004Objtemp.Month == "AUG")
            month = "8";
          if (t004Objtemp.Month == "SEP")
            month = "9";
          if (t004Objtemp.Month == "OCT")
            month = "10";
          if (t004Objtemp.Month == "NOV")
            month = "11";
          if (t004Objtemp.Month == "DEC")
            month = "12";

          var yField: String = t004Objtemp.value;


          await this.hashMapFRTObjData.set("" + month, t004Objtemp);
        }



      }
      var chartData: any = [];
      if (chargedesctype == "SHP_FRT") {

        for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
          var dataloopCount: String = dataLoop + 1 + "";
          var t004Obj = this.hashMapFRTObjData.get(dataloopCount);


          if (t004Obj != null) {
            var Month: String = t004Obj.Month;
            var yField: String = t004Obj.value;

            var monthStr: String = this.hashMapObj.get(t004Obj.Month);

            chartData.push({ "Month": Month, "value": yField });

          }
        }

      }
      else {
        for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
          var dataloopCount: String = dataLoop + 1 + "";
          var t004Obj = this.hashMapObjData.get(dataloopCount);

          if (t004Obj != null) {
            var Month: String = t004Obj.Month;

            var yField: String = t004Obj.value;

            var monthStr: String = this.hashMapObj.get(t004Obj.Month);
            chartData.push({ "Month": Month, "value": yField });



          }
        }
      }

      am4core.options.commercialLicense = true;
      am4core.useTheme(am4themes_animated);
      // Themes end

      this.zone.runOutsideAngular(() => {
        // Create chart instance
        let chart: any = am4core.create("spendByMonth", am4charts.XYChart);

        showIndicator();
        //Chart loader
        var indicator: any;
        var indicatorInterval: any;
        function showIndicator() {


          indicator = chart.tooltipContainer.createChild(am4core.Container);
          indicator.background.fill = am4core.color("#fff");
          indicator.background.fillOpacity = 0.8;
          indicator.width = am4core.percent(100);
          indicator.height = am4core.percent(100);

          var indicatorLabel = indicator.createChild(am4core.Label);
          indicatorLabel.text = "Loading...";
          indicatorLabel.align = "center";
          indicatorLabel.valign = "middle";
          indicatorLabel.fontSize = 20;
          indicatorLabel.dy = 50;

          var hourglass = indicator.createChild(am4core.Image);
          hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
          hourglass.align = "center";
          hourglass.valign = "middle";
          hourglass.horizontalCenter = "middle";
          hourglass.verticalCenter = "middle";
          hourglass.scale = 0.7;


          indicator.hide(0);
          indicator.show();

          clearInterval(indicatorInterval);
          indicatorInterval = setInterval(function () {
            hourglass.animate([{
              from: 0,
              to: 360,
              property: "rotation"
            }], 2000);
          }, 3000);
        }

        function hideIndicator() {

          indicator.hide();
          clearInterval(indicatorInterval);
        }
        am4core.options.commercialLicense = true;
        am4core.useTheme(am4themes_animated);
        // Themes end
        chart.scrollbarX = new am4core.Scrollbar();

        // Add data
        chart.data = chartData;

        var minNegVal = false;
        for (var loop = 0; loop < chartData.length; loop++) {
          var netAmtArray = chartData;
          var netamt = netAmtArray[loop].value;
          if (netamt < 0) {
            minNegVal = true;
            break;
          }
        }
        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
        categoryAxis.dataFields.category = "Month";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.tooltip.disabled = true;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
        valueAxis.renderer.minWidth = 50;
        valueAxis.title.text = "$ NET CHARGE";
        valueAxis.title.fontWeight = "bold";
        valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
          return "$" + text;
        });
        if (minNegVal == false) {
          valueAxis.min = 0;
        }

        // Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "Month";
        series.tooltipText = "Month: [bold]{categoryX}[/]  \n Net Charge: $[bold]{valueY.formatNumber('#,###.00')}";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 8;
        series.columns.template.column.cornerRadiusTopRight = 8;
        series.columns.template.column.fillOpacity = 1;
        series.columns.template.fontSize = 11;
        series.columns.template.adapter.add('fill', (_: any, target: any) => {
          return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
        });

        // on hover, make corner radiuses bigger
        let hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;
        if (this.themeoption == "dark") {
          categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
          valueAxis.title.fill = am4core.color("#fff");
          valueAxis.renderer.labels.template.fill = am4core.color("#fff");
          // valueAxis.renderer.grid.template.strokeOpacity = 1;
          // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
          // valueAxis.renderer.grid.template.strokeWidth = 2;
        }

        // Cursor
        chart.cursor = new am4charts.XYCursor();
        this.spendByMonthChart = chart;
        if (chartData.length > 0) {
          hideIndicator();
        }
      });
    }
  }




  openServiceByWeightDialog() {

    const dialogRef = this.dialog.open(ServiceByWeightPopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { ServiceByWgtpopupVal: this.fromPage, chargetypevalue: this.dashBoardSHP.get('chargetypevalue')?.value }
    });
  }

  async excel_clickHandler(event: any) {
    var urlParam: any = {};
    var monthVal = await this.moreviewWeightFormGroup.get('invoicemonth')?.value
    var clickedYear = await this.moreviewWeightFormGroup.get('invoiceyear')?.value;
    if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }
    var clientName = await this.moreviewWeightFormGroup.get('clientName')?.value;
    var clientId = await this.moreviewWeightFormGroup.get('clientId')?.value;
    var weightchargetype = await this.dashBoardSHP.get('chargetypevalue')?.value;

    urlParam['value'] = clientName;
    urlParam['fromdate'] = "2014-10-01";
    urlParam['todate'] = "2014-10-13";
    urlParam['weightmonth'] = clickedMonth;
    urlParam['year'] = clickedYear;
    urlParam['clientId'] = clientId;
    urlParam['clientName'] = clientName;
    urlParam['action'] = "WeightDistributionExcel";
    urlParam['weightchargetype'] = weightchargetype;

    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }
    this.httpClientService.reportServlet(fields_string);
    this.openModal("Download completed successfully");
  }
  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '420px',
      height: 'auto',
      panelClass: this.panelClass,
      data: { pageValue: alertVal }
    });
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {

      if (this.volume_weightChart) {
        this.volume_weightChart.dispose();
      }
      if (this.average_costChart) {
        this.average_costChart.dispose();
      }
      if (this.weight_disPopupChart) {
        this.weight_disPopupChart.dispose();
      }
      if (this.spendByMonthChart) {
        this.spendByMonthChart.dispose();
      }
      if (this.acc_noChart) {
        this.acc_noChart.dispose();
      }
    });
  }




  //Account st chart 
  async first_id_clickHandler(event: any) {
    // TODO Auto-generated method stub
    if (this.weightchargetype == null)
      this.weightchargetype = "SHP_FRT+ACC"
    if (this.weightchargetype == "SHP_FRT+ACC") {
      this.first_id_visible = false;
      this.previous_id_visible = false;
      this.next_id_visible = true;
      this.fromACC = 0;
      this.toACC = 5;
    } else {
      this.first_id_visible = false;
      this.previous_id_visible = false;
      this.next_id_visible = true;
      this.from = 0;
      this.to = 5;
    }
    await this.common();
  }
  async previous_id_clickHandler(event: any) {
    if (this.weightchargetype == null)
      this.weightchargetype = "SHP_FRT+ACC"
    if (this.weightchargetype == "SHP_FRT+ACC") {
      this.toACC = this.fromACC;
      this.fromACC = this.fromACC - 5;
      if (this.fromACC == 0) {
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      this.next_id_visible = true;
      await this.common();
    } else {
      this.to = this.from;
      this.from = this.from - 5;
      if (this.from == 0) {
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      this.next_id_visible = true;
      await this.common();

    }

  }
  btnBackacc_clickHandler(event: any) {
    // TODO Auto-generated method stub
    if (this.weightchargetype == null)
      this.weightchargetype = "SHP_FRT+ACC"
    if (this.weightchargetype == "SHP_FRT+ACC") {
      var tempto = this.toACC;
      tempto = tempto + 5;

      if (tempto < this.commonACSHP_FRT_ACC.length) {
        this.fromACC = this.toACC;
        this.toACC = this.toACC + 5;
      }
      if (tempto > this.commonACSHP_FRT_ACC.length) {
        this.fromACC = this.toACC;
        this.toACC += (this.commonACSHP_FRT_ACC.length - this.toACC);
      }
      if (this.toACC == this.commonACSHP_FRT_ACC.length) {
        this.next_id_visible = false;
        /* next_lbid.visible=false; */
      }
      this.previous_id_visible = true;
      this.first_id_visible = true;
      /* previous_lbid.visible=true;  */
      this.common();
    }
    else {
      var tempto = this.to;
      tempto = tempto + 5;

      if (tempto < this.commonACSHP_FRT.length) {
        this.from = this.to;
        this.to = this.to + 5;
      }
      if (tempto > this.commonACSHP_FRT.length) {
        this.from = this.to;
        this.to += (this.commonACSHP_FRT.length - this.to);
      }
      if (this.to == this.commonACSHP_FRT.length) {
        this.next_id_visible = false;
      }
      this.previous_id_visible = true;
      this.first_id_visible = true;
      /* previous_lbid.visible=true;  */
      this.common();
    }
  }
  //Acc end Chart
}
