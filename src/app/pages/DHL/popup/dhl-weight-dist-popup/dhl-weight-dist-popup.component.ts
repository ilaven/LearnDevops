import { Component, Inject, Optional, OnInit, NgZone, OnDestroy, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MatDialog } from '@angular/material/dialog';//9126 service by weight 
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { ServiceByWeightPopupComponent } from 'src/app/pages/UPS/popup/weight-dist-popup/Serviceby-weight/serviceby-weight.component';
import { HttpDhlService } from 'src/app/core/services/httpdhl.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';


am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

@Component({
  selector: 'app-dhl-weight-dist-popup',
  templateUrl: './dhl-weight-dist-popup.component.html',
  styleUrls: ['dhl-weight-dist-popup.component.css'],
  standalone: false
})
export class DhlWeightDistPopupComponent implements OnInit {
  private volume_weightChart!: am4charts.XYChart;
  private average_costChart!: am4charts.XYChart;
  private weight_disPopupChart!: am4charts.XYChart;
  private spendByMonthChart!: am4charts.XYChart;
  private acc_noChart!: am4charts.XYChart;
  fromPage: any;
  invoiceMonth: any;
  invoiceyear: any;
  clientId: any;
  clientName: any;
  groupby: any;
  groupBy: any;
  year: any;
  accountNumber: any;
  group: any;
  resultObj: any;
  moreviewWeightFormGroup!: FormGroup;
  dashBoardSHP!: FormGroup;
  ByServiceAc = [];
  ByServicefrtAc = [];
  weightchargetype: any;
  weight_mainAC: any;
  chargetypevalue = signal<any>('');
  weightdisttxt_text: any;
  from: any;
  to: any;
  fromACC: any;
  toACC: any;
  month: any;
  fun_monthAC: any;
  commonAC: any[] = [];
  t004tempObj = {};
  tempt004AC: any[] = [];
  acclink_id_styleName: any;
  frtlink_id_styleName: any;
  frtacc_btn_selected: any;
  frt_btn_this_selected: any;
  weightfrtAC = [];
  hashMapObjData = new Map();
  hashMapFRTObjData = new Map();
  hashMapObj = new Map();
  themeoption: any;
  panelClass: any;
  chartType: any;
  userProfifleFedex: any;
  accountNumberVal: any;
  monthFlag: any;
  barColors = [
    '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
    '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
    '#E07877', '#E09776', '#F4C5B0', '#F3B777',
    '#F5C7A0', '#F6D3B8'
  ];

  constructor(
    public dialogRef: MatDialogRef<DhlWeightDistPopupComponent>,
    private fb: FormBuilder,
    private httpDhlService: HttpDhlService,
    private zone: NgZone,
    private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('FRT+ACC')
    });
    this.fromPage = data.popupValue;
    if (this.fromPage.accountNumber == "ALL") { this.accountNumber = null; }
    else { this.accountNumber = this.fromPage.accountNumber; }
    this.month = this.fromPage.month;
    this.year = this.fromPage.year;
    this.clientId = this.fromPage.clientId;
    this.clientName = this.fromPage.clientName;
    this.themeoption = this.fromPage.themeoption;
    this.panelClass = this.fromPage.panelClassVal;
    this.groupby = "Weightdes";
    this.chartType = this.fromPage.chartType;
    var clientname = this.clientName.replace(/[^a-zA-Z0-9]/g, "");
    this.group = "Weightdestri";
    this.weight_mainAC = this.fromPage.weight_mainAC;
    this.chargetypevalue.set(this.fromPage.chargetypevalue);
    this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
    this.moreviewWeightFormGroup = new FormGroup({
      clientName: new FormControl(this.clientName),
      clientId: new FormControl(this.clientId),
      month: new FormControl(this.month),
      year: new FormControl(this.year),
      services: new FormControl(this.groupBy),
      clientname: new FormControl(clientname),
      accountNumber: new FormControl(this.accountNumber),
      chartType: new FormControl(this.chartType)
    })

  }

  ngOnInit() {
    this.dragpanel_initializeHandler();
    this.loadAC(this.weight_mainAC, this.invoiceyear, this.invoiceMonth, this.chargetypevalue());
  }
  async linkshpChange(data: any) {
    this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
    if (data == "FRT") {
      this.chargetypevalue.set(data);
      await this.linkfrt_clickHandler(data);
    }
    if (data == "FRT+ACC" || data == null) {
      this.chargetypevalue.set(data);
      await this.linkfrtacc_clickHandler(data);
    }
  }

  async dragpanel_initializeHandler() {
    await this.hashMapObj.set("1", "JAN");
    await this.hashMapObj.set("2", "FEB");
    await this.hashMapObj.set("3", "MAR");
    await this.hashMapObj.set("4", "APR");
    await this.hashMapObj.set("5", "MAY");
    await this.hashMapObj.set("6", "JUN");
    await this.hashMapObj.set("7", "JULY");
    await this.hashMapObj.set("8", "AUG");
    await this.hashMapObj.set("9", "SEP");
    await this.hashMapObj.set("10", "OCT");
    await this.hashMapObj.set("11", "NOV");
    await this.hashMapObj.set("12", "DEC");


  }


  linkflag = 0;

  async linkfrt_clickHandler(event: any) {

    this.acclink_id_styleName = "linkButton";
    this.frtlink_id_styleName = "backgroundcolor";
    this.frtacc_btn_selected = false;
    this.frt_btn_this_selected = true;
    this.linkflag = 1;


    this.weightchargetype = "FRT";
    // await this.bar_chart3(this.ByServicefrtAc);
    await this.weightdist(this.weightfrtAC);
    await this.fun_month(this.fun_monthAC);
    await this.commoniter();


  }
  async linkfrtacc_clickHandler(event: any) {

    this.linkflag = 0;
    this.acclink_id_styleName = "backgroundcolor";
    this.frtlink_id_styleName = "linkButton";
    this.frtacc_btn_selected = true;

    this.weightchargetype = "FRT+ACC";
    // await this.bar_chart3(this.ByServicefrtAc);
    this.weightchargetype = "FRT+ACC";
    await this.weightdist(this.weightfrtAC);
    await this.fun_month(this.fun_monthAC);
    this.weightchargetype = "FRT+ACC";
    await this.commoniter();



  }

  async loadAC(weightAC1: any, clickedYear: String, clickedMonth: String, chargetypevalue: String) {
    var month = clickedMonth;
    var year = clickedYear;
    var weightAC = weightAC1;
    var orginalAC = weightAC;
    this.weightfrtAC = weightAC;
    var weightfrtAC = weightAC;
    var chargetypeflag = chargetypevalue;
    var weightchargetype = chargetypevalue;
    var orginalAC = weightAC1;
    //if(weightchargetype=="FRT+ACC")
    //this.weightchargetype="FRT+ACC";			
    this.weightchargetype = chargetypevalue;
    if (weightchargetype == "FRT+ACC") {

    }
    else {

    }
    // await this.fetchByServices(clickedYear,clickedMonth);
    await this.fun_ServiceAcc_No(clickedYear, clickedMonth);
    await this.fetchSpendByMonth();

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

      await this.bar_chart0(weightAC, weightchargetype);
      await this.bar_chart1(weightAC, weightchargetype);
      await this.bar_chart2(weightAC, weightchargetype);


    }
    var data = this.dashBoardSHP.get('chargetypevalue')?.value;
    if (data == "FRT") {
      setTimeout(() => { this.linkshpChange('FRT') }, 5000);
    }
    if (data == "FRT+ACC" || data == null) {
      setTimeout(() => { this.linkshpChange('FRT+ACC') }, 5000);
    }

  }
  serviceType: any;
  t004ChargeObj = {};
  async fun_ServiceAcc_No(currentyear: String, currentmonth: String) {
    await this.fetchServiceByAcc();
  }
  async bar_chart0(tempAC: any, weightchargetype: String) {
    await this.createSeriesFromAC_bar(tempAC, weightchargetype, "", "")

  }
  series: any;
  chartData: any;
  collectionArr: any;
  async createSeriesFromAC_bar(collection: any, weightchargetype: String, nameField: String, yField: String) {
    this.collectionArr = collection;
    var tempObj;

    if (collection.length > 0) {

      if ((weightchargetype == "FRT")) {
        tempObj = collection[0];
      }
      else if (weightchargetype == "FRT+ACC") {
        tempObj = collection[1];
      }
      else {

        tempObj = collection[12];
      }

    }
    if (this.chartType == "Lbs") {
      var chartData = [
        {
          "weight": "1",
          "value": tempObj.averageCost1Lbs ? tempObj.averageCost1Lbs : '0'
        },
        {
          "weight": "2",
          "value": tempObj.averageCost2Lbs ? tempObj.averageCost2Lbs : '0'
        },
        {
          "weight": "3",
          "value": tempObj.averageCost3Lbs ? tempObj.averageCost3Lbs : '0'
        },
        {
          "weight": "4",
          "value": tempObj.averageCost4Lbs ? tempObj.averageCost4Lbs : '0'
        },
        {
          "weight": "5",
          "value": tempObj.averageCost5Lbs ? tempObj.averageCost5Lbs : '0'
        },
        {
          "weight": "6-10",
          "value": tempObj.averageCost6to10Lbs ? tempObj.averageCost6to10Lbs : '0'
        },
        {
          "weight": "11-20",
          "value": tempObj.averageCost11to20Lbs ? tempObj.averageCost11to20Lbs : '0'
        },
        {
          "weight": "21-30",
          "value": tempObj.averageCost21to30Lbs ? tempObj.averageCost21to30Lbs : '0'
        },
        {
          "weight": "31-50",
          "value": tempObj.averageCost31to50Lbs ? tempObj.averageCost31to50Lbs : '0'
        },
        {
          "weight": "51-70",
          "value": tempObj.averageCost51to70Lbs ? tempObj.averageCost51to70Lbs : '0'
        },
        {
          "weight": "71-150",
          "value": tempObj.averageCost71to150Lbs ? tempObj.averageCost71to150Lbs : '0'
        },
        {
          "weight": "151+",
          "value": tempObj.averageCost150PlusLbs ? tempObj.averageCost150PlusLbs : '0'
        }
      ]
    }
    else {
      var chartData = [
        {
          "weight": "1",
          "value": tempObj.averageCost1Kgs ? tempObj.averageCost1Kgs : '0'
        },
        {
          "weight": "2",
          "value": tempObj.averageCost2Kgs ? tempObj.averageCost2Kgs : '0'
        },
        {
          "weight": "3",
          "value": tempObj.averageCost3Kgs ? tempObj.averageCost3Kgs : '0'
        },
        {
          "weight": "4",
          "value": tempObj.averageCost4Kgs ? tempObj.averageCost4Kgs : '0'
        },
        {
          "weight": "5",
          "value": tempObj.averageCost5Kgs ? tempObj.averageCost5Kgs : '0'
        },
        {
          "weight": "6-10",
          "value": tempObj.averageCost6to10Kgs ? tempObj.averageCost6to10Kgs : '0'
        },
        {
          "weight": "11-20",
          "value": tempObj.averageCost11to20Kgs ? tempObj.averageCost11to20Kgs : '0'
        },
        {
          "weight": "21-30",
          "value": tempObj.averageCost21to30Kgs ? tempObj.averageCost21to30Kgs : '0'
        },
        {
          "weight": "31-50",
          "value": tempObj.averageCost31to50Kgs ? tempObj.averageCost31to50Kgs : '0'
        },
        {
          "weight": "51-70",
          "value": tempObj.averageCost51to70Kgs ? tempObj.averageCost51to70Kgs : '0'
        },
        {
          "weight": "71-150",
          "value": tempObj.averageCost71to150Kgs ? tempObj.averageCost71to150Kgs : '0'
        },
        {
          "weight": "151+",
          "value": tempObj.averageCost150PlusKgs ? tempObj.averageCost150PlusKgs : '0'
        }
      ]
    }


    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart: any = am4core.create("weight_disPopup", am4charts.XYChart);

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
      this.chartData = chartData;
      this.chartDataTemp = this.chartData;
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
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
      valueAxis.title.text = "$ Net Charge";
      valueAxis.title.fontWeight = "bold";
      valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
        return "$" + text;
      });
      if (minNegVal == false) {
        valueAxis.min = 0;
      }
      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      // this.seriesGlobal=chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Avg Cost: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;
      series.columns.template.events.on("hit", (ev: any) => {
        this.barExclusionFunc(ev.target._dataItem.categories.categoryX);
      });

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.fontSize = 11;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      this.weight_disPopupChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }
  chartDataFinal: any;
  chartDataTemp: any;
  barExclusionFunc(categoryVal: any) {

    for (var loop = 0; loop < this.chartDataTemp.length; loop++) {
      if (this.chartDataTemp[loop]['weight'] == categoryVal)
        this.chartDataTemp.splice(loop, 1);

    }
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart: any = am4core.create("weight_disPopup", am4charts.XYChart);


      // Add data
      chart.data = this.chartDataTemp;
      var minNegVal = false;
      for (var loop = 0; loop < this.chartDataTemp.length; loop++) {
        var netAmtArray = this.chartDataTemp;
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
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
      valueAxis.title.text = "$ Net Charge";
      valueAxis.title.fontWeight = "bold";
      valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
        return "$" + text;
      });
      if (minNegVal == false) {
        valueAxis.min = 0;
      }
      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      // this.seriesGlobal=chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Avg Cost: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.events.on("hit", (ev: any) => {
        this.barExclusionFunc(ev.target._dataItem.categories.categoryX);
      });

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.fontSize = 11;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      series.columns.template.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      this.weight_disPopupChart = chart;

    });
  }
  resetBars() {
    this.bar_chart0(this.collectionArr, this.chargetypevalue());
  }
  async weightdist(weightfrtAC: any) {
    var domain_Name = "T004_Dashboard";
    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var month = this.moreviewWeightFormGroup.get('month')?.value;
    var year = this.moreviewWeightFormGroup.get('year')?.value;

    if (month == '0') {
      this.weightdisttxt_text = "Weight Distribution" + " " + year;
    }
    else {
      var monthnumber = Number(month);
      this.weightdisttxt_text = "Weight Distribution" + " " + year + " " + monthArray[monthnumber - 1];
    }

    for (var count = 0; count < weightfrtAC.length; count++) {
      var t004frtObj = weightfrtAC[count];



      await this.bar_chart0(weightfrtAC, this.weightchargetype);
      await this.bar_chart1(weightfrtAC, this.weightchargetype);
      await this.bar_chart2(weightfrtAC, this.weightchargetype);
    }

  }
  async bar_chart1(tempAC: any, weightchargetype: String) {
    await this.createSeriesFromAC_bar31(tempAC, weightchargetype);
  }
  async createSeriesFromAC_bar31(collection: any, weightchargetype: String) {


    if (collection.length > 0)

      var tempObj;


    if ((weightchargetype == "FRT")) {
      tempObj = collection[0];
    }
    else if (weightchargetype == "FRT+ACC") {
      tempObj = collection[1];
    }
    else {

      tempObj = collection[12];
    }

    if (this.chartType == "Lbs") {
      var chartData = [
        {
          "weight": "1",
          "value": tempObj.netCharge1Lbs ? tempObj.netCharge1Lbs : '0'
        },
        {
          "weight": "2",
          "value": tempObj.netCharge2Lbs ? tempObj.netCharge2Lbs : '0'
        },
        {
          "weight": "3",
          "value": tempObj.netCharge3Lbs ? tempObj.netCharge3Lbs : '0'
        },
        {
          "weight": "4",
          "value": tempObj.netCharge4Lbs ? tempObj.netCharge4Lbs : '0'
        },
        {
          "weight": "5",
          "value": tempObj.netCharge5Lbs ? tempObj.netCharge5Lbs : '0'
        },
        {
          "weight": "6-10",
          "value": tempObj.netCharge6to10Lbs ? tempObj.netCharge6to10Lbs : '0'
        },
        {
          "weight": "11-20",
          "value": tempObj.netCharge11to20Lbs ? tempObj.netCharge11to20Lbs : '0'
        },
        {
          "weight": "21-30",
          "value": tempObj.netCharge21to30Lbs ? tempObj.netCharge21to30Lbs : '0'
        },
        {
          "weight": "31-50",
          "value": tempObj.netCharge31to50Lbs ? tempObj.netCharge31to50Lbs : '0'
        },
        {
          "weight": "51-70",
          "value": tempObj.netCharge51to70Lbs ? tempObj.netCharge51to70Lbs : '0'
        },
        {
          "weight": "71-150",
          "value": tempObj.netCharge71to150Lbs ? tempObj.netCharge71to150Lbs : '0'
        },
        {
          "weight": "151+",
          "value": tempObj.netCharge150PlusLbs ? tempObj.netCharge150PlusLbs : '0'
        }
      ]
    }
    else {
      var chartData = [
        {
          "weight": "1",
          "value": tempObj.netCharge1Kgs ? tempObj.netCharge1Kgs : '0'
        },
        {
          "weight": "2",
          "value": tempObj.netCharge2Kgs ? tempObj.netCharge2Kgs : '0'
        },
        {
          "weight": "3",
          "value": tempObj.netCharge3Kgs ? tempObj.netCharge3Kgs : '0'
        },
        {
          "weight": "4",
          "value": tempObj.netCharge4Kgs ? tempObj.netCharge4Kgs : '0'
        },
        {
          "weight": "5",
          "value": tempObj.netCharge5Kgs ? tempObj.netCharge5Kgs : '0'
        },
        {
          "weight": "6-10",
          "value": tempObj.netCharge6to10Kgs ? tempObj.netCharge6to10Kgs : '0'
        },
        {
          "weight": "11-20",
          "value": tempObj.netCharge11to20Kgs ? tempObj.netCharge11to20Kgs : '0'
        },
        {
          "weight": "21-30",
          "value": tempObj.netCharge21to30Kgs ? tempObj.netCharge21to30Kgs : '0'
        },
        {
          "weight": "31-50",
          "value": tempObj.netCharge31to50Kgs ? tempObj.netCharge31to50Kgs : '0'
        },
        {
          "weight": "51-70",
          "value": tempObj.netCharge51to70Kgs ? tempObj.netCharge51to70Kgs : '0'
        },
        {
          "weight": "71-150",
          "value": tempObj.netCharge71to150Kgs ? tempObj.netCharge71to150Kgs : '0'
        },
        {
          "weight": "151+",
          "value": tempObj.netCharge150PlusKgs ? tempObj.netCharge150PlusKgs : '0'
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
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.horizontalCenter = "middle";
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
      valueAxis.title.text = "$ Net Charge";
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

      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
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
  async bar_chart2(tempAC: any, weightchargetype: String) {
    await this.createSeriesFromAC2(tempAC, weightchargetype, "Bar")

  }
  async createSeriesFromAC2(collection: any, weightchargetype: String, seriesName: String) {

    if (collection.length > 0)

      var tempObj;

    if ((weightchargetype == "FRT")) {
      tempObj = collection[0];
    }
    else if (weightchargetype == "FRT+ACC") {
      tempObj = collection[1];
    }
    else {

      tempObj = collection[12];
    }

    if (this.chartType == "Lbs") {

      var chartData = [
        {
          "weight": "1",
          "value": tempObj.volume1Lbs ? tempObj.volume1Lbs : '0'
        },
        {
          "weight": "2",
          "value": tempObj.volume2Lbs ? tempObj.volume2Lbs : '0'
        },
        {
          "weight": "3",
          "value": tempObj.volume3Lbs ? tempObj.volume3Lbs : '0'
        },
        {
          "weight": "4",
          "value": tempObj.volume4Lbs ? tempObj.volume4Lbs : '0'
        },
        {
          "weight": "5",
          "value": tempObj.volume5Lbs ? tempObj.volume5Lbs : '0'
        },
        {
          "weight": "6-10",
          "value": tempObj.volume6to10Lbs ? tempObj.volume6to10Lbs : '0'
        },
        {
          "weight": "11-20",
          "value": tempObj.volume11to20Lbs ? tempObj.volume11to20Lbs : '0'
        },
        {
          "weight": "21-30",
          "value": tempObj.volume21to30Lbs ? tempObj.volume21to30Lbs : '0'
        },
        {
          "weight": "31-50",
          "value": tempObj.volume31to50Lbs ? tempObj.volume31to50Lbs : '0'
        },
        {
          "weight": "51-70",
          "value": tempObj.volume51to70Lbs ? tempObj.volume51to70Lbs : '0'
        },
        {
          "weight": "71-150",
          "value": tempObj.volume71to150Lbs ? tempObj.volume71to150Lbs : '0'
        },
        {
          "weight": "151+",
          "value": tempObj.volume150PlusLbs ? tempObj.volume150PlusLbs : '0'
        }
      ]
    }
    else {
      var chartData = [
        {
          "weight": "1",
          "value": tempObj.volume1Kgs ? tempObj.volume1Kgs : '0'
        },
        {
          "weight": "2",
          "value": tempObj.volume2Kgs ? tempObj.volume2Kgs : '0'
        },
        {
          "weight": "3",
          "value": tempObj.volume3Kgs ? tempObj.volume3Kgs : '0'
        },
        {
          "weight": "4",
          "value": tempObj.volume4Kgs ? tempObj.volume4Kgs : '0'
        },
        {
          "weight": "5",
          "value": tempObj.volume5Kgs ? tempObj.volume5Kgs : '0'
        },
        {
          "weight": "6-10",
          "value": tempObj.volume6to10Kgs ? tempObj.volume6to10Kgs : '0'
        },
        {
          "weight": "11-20",
          "value": tempObj.volume11to20Kgs ? tempObj.volume11to20Kgs : '0'
        },
        {
          "weight": "21-30",
          "value": tempObj.volume21to30Kgs ? tempObj.volume21to30Kgs : '0'
        },
        {
          "weight": "31-50",
          "value": tempObj.volume31to50Kgs ? tempObj.volume31to50Kgs : '0'
        },
        {
          "weight": "51-70",
          "value": tempObj.volume51to70Kgs ? tempObj.volume51to70Kgs : '0'
        },
        {
          "weight": "71-150",
          "value": tempObj.volume71to150Kgs ? tempObj.volume71to150Kgs : '0'
        },
        {
          "weight": "151+",
          "value": tempObj.volume150PlusKgs ? tempObj.volume150PlusKgs : '0'
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
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.verticalCenter = "middle";
      categoryAxis.renderer.grid.template.location = 0;

      let labelTemplate = categoryAxis.renderer.labels.template;
      labelTemplate.rotation = 0;
      labelTemplate.fontSize = 12;
      labelTemplate.dy = 10; // moves it a bit down;
      labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
      valueAxis.title.text = "Count";
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
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
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

  serviceAccAC: any[] = [];
  commonACSHP_FRT: any[] = [];
  commonACSHP_FRT_ACC: any[] = [];
  async fetchServiceByAcc() {
    await this.httpDhlService.fetchSpendByAccountNumber(this.moreviewWeightFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
        this.serviceAccAC = result;
        for (var count = 0; count < this.serviceAccAC.length; count++) {
          var tempobj: any = this.serviceAccAC[count];
          if (tempobj.chargeType == "FRT") {
            this.commonACSHP_FRT.push(tempobj);
          }
          else {
            this.commonACSHP_FRT_ACC.push(tempobj);
          }
        }

        if (this.weightchargetype == null)
          this.weightchargetype = "FRT+ACC";

        this.commoniter();
      },
      error => {
        console.log('error ', error);
      })
  }

  async common() {
    this.commonAC = [];
    if (this.weightchargetype == null)
      this.weightchargetype = "FRT+ACC";
    if (this.weightchargetype == "FRT+ACC") {

      for (var count = this.fromACC; count < this.toACC; count++) {
        var tempobj: any[] = this.commonACSHP_FRT_ACC[count];
        this.commonAC.push(tempobj);
      }
    } else {
      for (var count = this.from; count < this.to; count++) {
        var tempobj: any[] = this.commonACSHP_FRT[count];
        this.commonAC.push(tempobj);
      }
    }
    await this.Acc_No(this.commonAC);
  }
  previous_id_visible: any;
  first_id_visible: any;
  next_id_visible: any;
  async commoniter() {

    if (this.weightchargetype == "FRT+ACC") {
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

  async createSeriesFromAC21(collection: any, seriesName: String) {

    if (this.weightchargetype == null)
      this.weightchargetype = "FRT+ACC"
    var chartData: any = [];
    if (collection.length > 0) {
      for (var loop = 0; loop < collection.length; loop++) {

        var tempObj = collection[loop];

        var value1 = tempObj.group;
        var nameFiled = tempObj.accountNumber;


        var yField = tempObj.netCharge;
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
        var netamt = chartData[loop].points;
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
      valueAxis.title.text = "$ Net Charge";
      valueAxis.title.fontWeight = "bold";
      if (minNegVal == false) {
        valueAxis.min = 0;
      }
      valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
        return "$" + text;
      });
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "points";
      series.dataFields.categoryX = "name";
      series.name = "Account";
      series.columns.template.tooltipText = "Account Number: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;

      series.columns.template.adapter.add('fill', (_: any, target: any) => {
        return am4core.color('#1AA7E8');
      });
      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      this.acc_noChart = chart;
      if (chartData.length > 0) {

        hideIndicator();
      }
    });
  }
  async fetchSpendByMonth() {
    await this.httpDhlService.fetchTotalSpendChart(this.moreviewWeightFormGroup.value).subscribe(
      result => {
        this.resultObj = result;
        this.fun_monthAC = result;
        this.fun_month(this.fun_monthAC);
      },
      error => {
        console.log('error ', error);
      })
  }

  async fun_month(arrayAC: any) {
    if (!arrayAC || !Array.isArray(arrayAC)) {
      console.error("arrayAC is undefined or invalid:", arrayAC);
      return;
    }
    var invoicemonthAC: any = [];
    var totalmonth = 12;
    var monthNo = 0;
    var year;
    this.t004tempObj = [];

    for (var listcount = 0; listcount < arrayAC.length; listcount++) {
      var t004tempObj = arrayAC[listcount];

      year = await t004tempObj.year;
      if (!invoicemonthAC.indexOf(t004tempObj.month))
        invoicemonthAC.push(t004tempObj.month);


    }

    var resultmonthAC = [];
    for (var monthcount = 0; monthcount < totalmonth; monthcount++) {

      monthNo++;
      if (!invoicemonthAC.indexOf(String(monthNo))) {
        resultmonthAC.push(String(monthNo));
        resultmonthAC.push(String(monthNo));
      }

    }

    for (var loop = 0; loop < resultmonthAC.length; loop++) {
      t004tempObj.month = resultmonthAC[loop];
      t004tempObj.year = year;
      if (loop % 2 != 0) {
        t004tempObj.chargeType = "FRT+ACC";
      }
      else {
        t004tempObj.chargeType = "FRT";
      }
      await arrayAC.push(t004tempObj);

    }


    for (var count = 0; count < arrayAC.length; count++) {


      var t004Obj = arrayAC[count];


      var totVaule: String = t004Obj.netCharge;
      var chargetypevalue = t004Obj.chargeType;
      if (t004Obj.month == "1")
        await this.tempt004AC.push({ Month: "JAN", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "2")
        await this.tempt004AC.push({ Month: "FEB", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "3")
        await this.tempt004AC.push({ Month: "MAR", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "4")
        await this.tempt004AC.push({ Month: "APR", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "5")
        await this.tempt004AC.push({ Month: "MAY", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "6")
        await this.tempt004AC.push({ Month: "JUN", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "7")
        await this.tempt004AC.push({ Month: "JULY", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "8")
        await this.tempt004AC.push({ Month: "AUG", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "9")
        await this.tempt004AC.push({ Month: "SEP", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "10")
        await this.tempt004AC.push({ Month: "OCT", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "11")
        await this.tempt004AC.push({ Month: "NOV", value: totVaule, chargetyperesult: chargetypevalue });
      if (t004Obj.month == "12")
        await this.tempt004AC.push({ Month: "DEC", value: totVaule, chargetyperesult: chargetypevalue });


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
        if (t004Objtemp.chargetyperesult == "FRT+ACC") {
          var month: any;

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

        if (t004Objtemp.chargetyperesult == "FRT") {
          var month: any;

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
      if (chargedesctype == "FRT") {

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
        valueAxis.title.text = "$ Net Charge";
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
        series.columns.template.strokeOpacity = 0;
        series.columns.template.adapter.add('fill', (_: any, target: any) => {
          return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
        });

        // on hover, make corner radiuses bigger
        let hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 8;
        hoverState.properties.cornerRadiusTopRight = 8;
        hoverState.properties.fillOpacity = 1;
        if (this.themeoption == "dark") {

          categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
          valueAxis.title.fill = am4core.color("#fff");
          valueAxis.renderer.labels.template.fill = am4core.color("#fff");
          valueAxis.renderer.grid.template.strokeOpacity = 1;
          valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
          valueAxis.renderer.grid.template.strokeWidth = 2;
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


  async excel_clickHandler(event: any) {
    var urlParam: any = {};
    var clickedMonth = await this.moreviewWeightFormGroup.get('month')?.value
    var clickedYear = await this.moreviewWeightFormGroup.get('year')?.value;
    var clientName = await this.moreviewWeightFormGroup.get('clientName')?.value;
    var clientId = await this.moreviewWeightFormGroup.get('clientId')?.value;
    var accountNumber = await this.moreviewWeightFormGroup.get('accountNumber')?.value;
    var weightchargetype = await this.dashBoardSHP.get('chargetypevalue')?.value;

    urlParam['fromdate'] = "2014-10-01";
    urlParam['todate'] = "2014-10-13";
    urlParam['weightmonth'] = clickedMonth;
    urlParam['year'] = clickedYear;
    urlParam['clientId'] = clientId;
    urlParam['clientName'] = clientName;
    urlParam['action'] = event;
    urlParam['weightchargetype'] = weightchargetype;
    urlParam['accountnumber'] = accountNumber;
    urlParam['reportname'] = this.chartType;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }
    this.httpDhlService.reportServlet(fields_string);
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
    if (this.weightchargetype == "FRT+ACC")
      this.weightchargetype = "FRT+ACC"
    if (this.weightchargetype == "FRT+ACC") {
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
    if (this.weightchargetype == "FRT+ACC")
      this.weightchargetype = "FRT+ACC"
    if (this.weightchargetype == "FRT+ACC") {
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
    if (this.weightchargetype == "FRT+ACC")
      this.weightchargetype = "FRT+ACC"
    if (this.weightchargetype == "FRT+ACC") {
      var tempto = this.toACC;
      tempto = tempto + 5;

      if (tempto < this.commonACSHP_FRT_ACC.length) {
        this.fromACC = this.toACC;
        this.toACC = this.toACC + 5;
      }
      if (tempto >= this.commonACSHP_FRT_ACC.length) {
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
  closeDialog() {
    this.dialogRef.close(true);
  }
}
