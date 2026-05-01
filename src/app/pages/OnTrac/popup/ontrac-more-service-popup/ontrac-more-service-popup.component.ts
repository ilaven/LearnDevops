import { Component, Inject, Optional, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, UntypedFormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
am4core.options.commercialLicense = true;
@Component({
  selector: 'app-ontrac-more-service-popup',
  templateUrl: './ontrac-more-service-popup.component.html',
  standalone: false
})
export class OntracMoreServicePopupComponent implements OnInit {
  private pie_FrtChart!: am4charts.PieChart;
  private pie_AccessorialChart!: am4charts.PieChart;
  month: any;
  year: any;
  fromPage;
  invoiceMonth;
  dashBoardSHP: FormGroup;
  moreviewServiceFormGroup: FormGroup;
  invoiceyear;
  clientId;
  clientName;
  accountNumber;
  yearData_title: any;
  monthData_title: any;
  chargeType_title: any;
  services_title: any;
  MoreserviceZone_Frtpopup: any = [];
  MoreserviceZone_Accessorialpopup: any = [];
  MoreserviceZone_FrtAccessorialpopup: any = [];
  packagetxt_text: any;
  accessorialtxt_text: any;
  packagetxtall_text: any;
  themeoption;
  constructor(public dialogRef: MatDialogRef<OntracMoreServicePopupComponent>, private httpOntracService: HttpOntracService, private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('FRT+ACC')
    });

    this.fromPage = data.popupValue;
    this.invoiceMonth = this.fromPage.invoiceMonth;
    this.invoiceyear = this.fromPage.invoiceyear;
    this.clientId = this.fromPage.clientId;
    this.clientName = this.fromPage.clientName;
    this.accountNumber = this.fromPage.accountNumber;
    this.themeoption = this.fromPage.themeoption;
    var clientname = this.clientName.replace(/[^a-zA-Z0-9]/g, "");
    this.moreviewServiceFormGroup = new FormGroup({
      clientName: new FormControl(this.clientName),
      clientId: new FormControl(this.clientId),
      accountNumber: new FormControl(this.accountNumber),
      invoicemonth: new FormControl(this.invoiceMonth),
      month: new FormControl(this.invoiceMonth),
      year: new FormControl(this.invoiceyear),
      clientname: new FormControl(clientname),
      chargeType: new FormControl('FRT+ACC')
    })
  }

  ngOnInit() {
    this.bindingTitle();
    this.loadAC(this.invoiceyear, this.invoiceMonth);
  }
  async bindingTitle() {
    this.yearData_title = this.moreviewServiceFormGroup.get('year')?.value;
    var monthData = this.moreviewServiceFormGroup.get('month')?.value;
    this.chargeType_title = this.dashBoardSHP.get('chargetypevalue')?.value;
    if (monthData == null) {
      this.monthData_title = "";
    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      this.monthData_title = monthArray[monthData];
    }

  }
  async loadAC(currentyear: String, currentmonth: String) {
    this.month = currentmonth;
    this.year = currentyear;
    this.fetch_FrtPiechart_MoreService();
    this.fetch_AccessorialPiechart_MoreService();
  }
  async fetch_FrtPiechart_MoreService() {
    this.moreviewServiceFormGroup.get('chargeType')?.setValue('FRT');
    await this.httpOntracService.fetchFRTServices(this.moreviewServiceFormGroup.value).subscribe(
      result => {
        this.MoreserviceZone_Frtpopup = result;
        this.bar_chart1(this.MoreserviceZone_Frtpopup);
      },
      error => {
        console.log('error ', error);
      })
  }
  async reportExcelDownload(event: any) {
    var urlParam: any = {};
    var monthVal = await this.moreviewServiceFormGroup.get('month')?.value
    var clickedYear = await this.moreviewServiceFormGroup.get('year')?.value;
    var clickedMonth = monthVal;
    var clientName = await this.moreviewServiceFormGroup.get('clientName')?.value;
    var clientId = await this.moreviewServiceFormGroup.get('clientId')?.value;
    var weightchargetype = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var accountNumber = await this.moreviewServiceFormGroup.get('accountNumber')?.value;
    urlParam['action'] = event;
    urlParam['year'] = clickedYear;
    urlParam['chargemonth'] = clickedMonth;
    urlParam['clientId'] = clientId;
    urlParam['clientName'] = clientName;
    urlParam['accountnumber'] = accountNumber;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }
    this.httpOntracService.reportServlet(fields_string);
  }
  async fetch_AccessorialPiechart_MoreService() {
    this.moreviewServiceFormGroup.get('chargeType')?.setValue('ACC');
    await this.httpOntracService.fetchFRTServices(this.moreviewServiceFormGroup.value).subscribe(
      result => {
        this.MoreserviceZone_Accessorialpopup = result;
        this.bar_chart2(this.MoreserviceZone_Accessorialpopup);
      },
      error => {
        console.log('error ', error);
      })
  }
  async bar_chart1(tempAC: any) {
    await this.createSeriesFromAC_for_FrtPieChart(tempAC);

  }
  async createSeriesFromAC_for_FrtPieChart(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        if (pie_Obj.chargeType == "FRT") {
          var nameFiled: String = pie_Obj.groupBy;
          var yField: String = pie_Obj.netCharge;
          chartData.push({ name: nameFiled, value: yField })
        }
      }
    }
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("pie_chart_Frt", am4charts.PieChart);
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
      series.slices.template.strokeWidth = 2;
      series.slices.template.strokeOpacity = 1;
      series.labels.template.adapter.add('text', function (_: any, target: any) {
        const percent = target.dataItem?.values?.value?.percent;
        return percent !== undefined ? `${Math.round(percent)}` : '';
      });
      series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
      series.ticks.template.disabled = true;
      series.labels.template.disabled = true;
      series.fontSize = 6;
      series.labels.template.text = "${value}";
      series.slices.template.stroke = am4core.color("#ffffff");
      series.slices.template.strokeWidth = 1;
      series.slices.template.strokeOpacity = 1;
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
      if (this.themeoption == "dark") {
        chart.legend.valueLabels.template.fill = am4core.color("#fff");
        chart.legend.labels.template.fill = am4core.color("#fff");
      }
      this.pie_FrtChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }
  async bar_chart2(tempAC: any) {
    await this.createSeriesFromAC_for_AccessorialPieChart(tempAC);
  }

  async createSeriesFromAC_for_AccessorialPieChart(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        if (pie_Obj.chargeType == "ACC") {
          var nameFiled: String = pie_Obj.groupBy;
          var yField: String = pie_Obj.netCharge;
          chartData.push({ name: nameFiled, value: yField })
        }
      }
    }
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("pie_chart_Access", am4charts.PieChart);
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
      series.labels.template.adapter.add('text', function (_: any, target: any) {
        const percent = target.dataItem?.values?.value?.percent;
        return percent !== undefined ? `${Math.round(percent)}` : '';
      });
      series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
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
      if (this.themeoption == "dark") {
        chart.legend.valueLabels.template.fill = am4core.color("#fff");
        chart.legend.labels.template.fill = am4core.color("#fff");
      }
      this.pie_AccessorialChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }
  closeDialog() {
    this.dialogRef.close(true);
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.pie_FrtChart) {
        this.pie_FrtChart.dispose();
      }
      if (this.pie_AccessorialChart) {
        this.pie_AccessorialChart.dispose();
      }
    });
  }

}
