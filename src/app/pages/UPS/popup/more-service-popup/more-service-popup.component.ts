import { Component, Inject, Optional, OnInit, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpClientService } from 'src/app/core/services/httpclient.service';
am4core.options.commercialLicense = true;
@Component({
  selector: 'app-more-service-popup',
  templateUrl: './more-service-popup.component.html',
  standalone: false
})
export class MoreServicePopupComponent implements OnInit, AfterViewInit, OnDestroy {
  private pie_chartChart!: am4charts.PieChart;
  private pie_AccessChart!: am4charts.PieChart;
  private pie_AllchargesChart!: am4charts.PieChart;
  month: any;
  year: any;
  fromPage;
  invoiceMonth;
  dashBoardSHP: UntypedFormGroup;
  moreviewServiceFormGroup: UntypedFormGroup;
  invoiceyear;
  clientId;
  clientName;
  yearData_title: any;
  monthData_title: any;
  chargeType_title: any;
  services_title: any;
  MoreserviceZone_popup = [];
  MoreserviceZoneAllcharges_popupAC = [];
  MoreserviceZone_popupAC = [];
  packagetxt_text: any;
  accessorialtxt_text: any;
  packagetxtall_text: any;
  themeoption;
  constructor(public dialogRef: MatDialogRef<MoreServicePopupComponent>, private httpClientService: HttpClientService, private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dashBoardSHP = new UntypedFormGroup({
      chargetypevalue: new UntypedFormControl('SHP_FRT+ACC')
    });


    this.fromPage = data.popupValue;
    if (this.fromPage.invoiceMonth == null) { this.invoiceMonth = '0'; }
    else { this.invoiceMonth = this.fromPage.invoiceMonth; }
    this.invoiceyear = this.fromPage.invoiceyear;
    this.clientId = this.fromPage.clientId;
    this.clientName = this.fromPage.clientName;
    this.themeoption = this.fromPage.themeoption;
    var clientname = this.clientName.replace(/[^a-zA-Z0-9]/g, "");
    this.moreviewServiceFormGroup = new UntypedFormGroup({
      clientName: new UntypedFormControl(this.clientName),
      clientId: new UntypedFormControl(this.clientId),
      invoiceMonth: new UntypedFormControl(this.invoiceMonth),
      invoicemonth: new UntypedFormControl(this.invoiceMonth),
      invoiceyear: new UntypedFormControl(this.invoiceyear),
      clientname: new UntypedFormControl(clientname)
    })
  }
  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.bindingTitle();
    this.loadAC(this.invoiceyear, this.invoiceMonth);
  }

  closeDialog() {
    this.dialogRef.close(true);
  }

  async bindingTitle() {
    this.yearData_title = this.moreviewServiceFormGroup.get('invoiceyear')?.value;
    var monthData = this.moreviewServiceFormGroup.get('invoiceMonth')?.value;
    this.chargeType_title = this.dashBoardSHP.get('chargetypevalue')?.value;
    if (monthData == '0') {
      this.monthData_title = "";
    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      this.monthData_title = monthArray[monthData];
    }

  }

  async loadAC(currentyear: String, currentmonth: String) {
    this.month = currentmonth;
    this.year = currentyear;
    this.fetchT004Rymax_chargeBack_Piechart_MoreService();

    this.fetchT004Rymax_chargeBack_Piechart_MoreService2();

    this.fetchT004Rymax_chargeBack_Piechart_MoreService3();


    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    if (this.month == '0') {
      this.packagetxt_text = "Data Displayed only for Freight Charges" + " " + this.year;
      this.accessorialtxt_text = "Data Displayed only for Accessorial Charges" + " " + this.year;
      this.packagetxtall_text = "Data Displayed for Combined Freight and Accessorials Charges" + " " + this.year;
    }
    else {
      var monthnumber = Number(this.month);
      this.packagetxt_text = "Data Displayed only for Freight Charges" + " " + this.year + " " + monthArray[monthnumber - 1];
      this.accessorialtxt_text = "Data Displayed only for Accessorial Charges" + " " + this.year + " " + monthArray[monthnumber - 1];
      this.packagetxtall_text = "Data Displayed for Combined Freight and Accessorials Charges" + " " + this.year + " " + monthArray[monthnumber - 1];
    }

  }


  async fetchT004Rymax_chargeBack_Piechart_MoreService() {

    await this.httpClientService.fetchT004Rymax_chargeBack_Piechart_MoreService(this.moreviewServiceFormGroup.value).subscribe(
      result => {
        this.MoreserviceZone_popup = result;
        this.bar_chart1(this.MoreserviceZone_popup);
      },
      error => {
        console.log('error ', error);
      })

  }

  //-----------------------------With the "Accessorial"

  async fetchT004Rymax_chargeBack_Piechart_MoreService2() {
    await this.httpClientService.fetchT004Rymax_chargeBack_Piechart_MoreService2(this.moreviewServiceFormGroup.value).subscribe(
      result => {
        this.MoreserviceZone_popupAC = result;
        this.bar_chart2(this.MoreserviceZone_popupAC);
      },
      error => {
        console.log('error ', error);
      })


  }
  async fetchT004Rymax_chargeBack_Piechart_MoreService3() {
    this.httpClientService.fetchT004Rymax_chargeBack_Piechart_MoreService3(this.moreviewServiceFormGroup.value).subscribe(
      result => {
        this.MoreserviceZoneAllcharges_popupAC = result;
        this.bar_chart3(this.MoreserviceZoneAllcharges_popupAC);
      },
      error => {
        console.log('error ', error);
      })

  }







  async bar_chart1(tempAC: any) {
    await this.createSeriesFromAC_for_pie(tempAC);

  }


  async createSeriesFromAC_for_pie(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        var nameFiled: String = pie_Obj.chargeDescription;
        if (pie_Obj.totalnetamount != 0)
          var yField: String = pie_Obj.totalnetamount;
        else
          var yField: String = pie_Obj.netamount;
        chartData.push({ name: nameFiled, value: yField })

      }
    }
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("pie_chart", am4charts.PieChart);
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

      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.legend = new am4charts.Legend();
      // Position legend
      chart.legend.position = "top";
      chart.legend.contentAlign = "left";
      chart.legend.valign = "top";
      chart.legend.position = "left";
      // chart.legend.maxWidth = 99999;
      chart.data = chartData;
      // Enable wrapping instead of ellipsis
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = true;
      chart.legend.labels.template.maxWidth = 160;   // adjust width as needed
      chart.legend.labels.template.textAlign = "left";
      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      series.alignLabels = true;
      series.labels.template.disabled = false;
      series.slices.template.strokeWidth = 2;
      series.slices.template.strokeOpacity = 1;
      series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
      series.ticks.template.disabled = true;
      series.labels.template.disabled = true;
      series.fontSize = 6;
      series.labels.template.text = "${value}";
      series.slices.template.stroke = am4core.color("#ffffff");
      series.slices.template.strokeWidth = 1;
      series.slices.template.strokeOpacity = 1;
      if (this.themeoption == "dark") {
        chart.legend.valueLabels.template.fill = am4core.color("#fff");
        chart.legend.labels.template.fill = am4core.color("#fff");
      }
      series.colors.list = [
        am4core.color('#BED5FF'),
        am4core.color('#A0E2FE'),
        am4core.color('#9CEFE5'),
        am4core.color('#D7BBEA'),
        am4core.color('#FFC9C9'),
        am4core.color('#FFD4A9'),
        am4core.color('#ffdb6d'),
        am4core.color('#9ccb66'),
        am4core.color('#796448')
      ];
      this.pie_chartChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }


  async bar_chart3(tempAC: any) {
    await this.createSeriesFromAC_for_pie_Allcharges(tempAC);

  }
  async bar_chart2(tempAC: any) {
    await this.createSeriesFromAC_for_pie_Access(tempAC);
  }


  async createSeriesFromAC_for_pie_Access(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        var nameFiled: String = pie_Obj.chargeDescription;
        if (pie_Obj.totalnetamount != 0)
          var yField: String = pie_Obj.totalnetamount;
        else
          var yField: String = pie_Obj.netamount;

        chartData.push({ name: nameFiled, value: yField })

      }
    }
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("pie_Access", am4charts.PieChart);
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
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.legend = new am4charts.Legend();
      // Position legend
      chart.legend.position = "top";
      chart.legend.contentAlign = "left";
      chart.legend.valign = "top";
      chart.legend.position = "left";
      // chart.legend.maxWidth = 99999;
      chart.data = chartData;
      // Enable wrapping instead of ellipsis
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = true;
      chart.legend.labels.template.maxWidth = 160;   // adjust width as needed
      chart.legend.labels.template.textAlign = "left";
      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      series.alignLabels = true;
      series.labels.template.disabled = false;
      series.slices.template.strokeWidth = 1;
      series.slices.template.strokeOpacity = 1;
      series.ticks.template.disabled = true;
      series.fontSize = 6;
      series.labels.template.disabled = true;
      series.labels.template.text = "${value}";
      series.slices.template.stroke = am4core.color("#ffffff");
      series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
      if (this.themeoption == "dark") {
        chart.legend.valueLabels.template.fill = am4core.color("#fff");
        chart.legend.labels.template.fill = am4core.color("#fff");
      }
      series.colors.list = [
        am4core.color('#BED5FF'),
        am4core.color('#A0E2FE'),
        am4core.color('#9CEFE5'),
        am4core.color('#D7BBEA'),
        am4core.color('#FFC9C9'),
        am4core.color('#FFD4A9'),
        am4core.color('#ffdb6d'),
        am4core.color('#9ccb66'),
        am4core.color('#796448')
      ];
      this.pie_AccessChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }
  async createSeriesFromAC_for_pie_Allcharges(collection: any) {
    var chartData: any = [];

    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        var nameFiled: String = pie_Obj.chargeDescription;
        if (pie_Obj.totalnetamount != 0)
          var yField: String = pie_Obj.totalnetamount;
        else
          var yField: String = pie_Obj.netamount;
        chartData.push({ name: nameFiled, value: yField })

      }
    }
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("pie_Allcharges", am4charts.PieChart);
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
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

      chart.legend = new am4charts.Legend();
      // Position legend
      chart.legend.position = "top";
      chart.legend.contentAlign = "left";
      chart.legend.valign = "top";
      chart.legend.position = "left";
      chart.legend.maxWidth = 99999;
      chart.data = chartData;
      // Enable wrapping instead of ellipsis
      chart.legend.labels.template.truncate = false;
      chart.legend.labels.template.wrap = true;
      chart.legend.labels.template.maxWidth = 160;   // adjust width as needed
      chart.legend.labels.template.textAlign = "left";
      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "value";
      series.dataFields.category = "name";
      series.alignLabels = true;
      series.labels.template.disabled = false;
      series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
      series.slices.template.strokeWidth = 2;
      series.slices.template.strokeOpacity = 1;
      series.ticks.template.disabled = true;
      series.labels.template.disabled = true;
      series.fontSize = 6;
      series.labels.template.text = "${value}";
      series.slices.template.stroke = am4core.color("#ffffff");
      series.slices.template.strokeWidth = 1;
      series.slices.template.strokeOpacity = 1;
      if (this.themeoption == "dark") {
        chart.legend.valueLabels.template.fill = am4core.color("#fff");
        chart.legend.labels.template.fill = am4core.color("#fff");
      }
      this.pie_AllchargesChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }




  async repostExcelDownload(event: any) {
    var urlParam: any = {};
    var monthVal = await this.moreviewServiceFormGroup.get('invoicemonth')?.value
    var clickedYear = await this.moreviewServiceFormGroup.get('invoiceyear')?.value;
    if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }
    var clientName = await this.moreviewServiceFormGroup.get('clientName')?.value;
    var clientId = await this.moreviewServiceFormGroup.get('clientId')?.value;
    var weightchargetype = await this.dashBoardSHP.get('chargetypevalue')?.value;
    urlParam['action'] = event;
    urlParam['year'] = clickedYear;
    urlParam['chargemonth'] = clickedMonth;
    urlParam['clientId'] = clientId;
    urlParam['clientName'] = clientName;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }
    this.httpClientService.reportServlet(fields_string);

  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {

      if (this.pie_chartChart) {
        this.pie_chartChart.dispose();
      }
      if (this.pie_AccessChart) {
        this.pie_AccessChart.dispose();
      }
      if (this.pie_AllchargesChart) {
        this.pie_AllchargesChart.dispose();
      }

    });
  }

}
