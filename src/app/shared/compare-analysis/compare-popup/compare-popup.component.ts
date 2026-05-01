import { Component, Inject, Optional, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
@Component({
  selector: 'compare-popup-popup',
  templateUrl: './compare-popup.component.html',
  standalone: false,
})
export class ComparePopupComponent implements OnInit {
  private More_popupChart!: am4charts.XYChart;

  //variable declaration
  fromPage: any;
  eventName: any;
  themeoption: any;
  eventNameSurcharge: any;

  constructor(public dialogRef: MatDialogRef<ComparePopupComponent>, private mlForm: FormBuilder, private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data.popupValue;
    this.themeoption = this.fromPage.themeoption;

  }

  ngOnInit() {
    this.loadAC(this.fromPage);
    this.loadACSurcharges(this.fromPage);

  }
  async loadAC(tempAC: any) {
    var tempAcVal = tempAC;
    var eventName = tempAcVal.eventName;
    this.eventName = "TRANSPORTATION COST";
    var eventValue = tempAcVal.eventValue;
    var eventDataVal = eventValue.comparisonResults;
    var eventDataFedexVal = eventValue.fedexcomparisonResults;
    var eventData = eventDataVal[0];
    var eventDataFedex = eventDataFedexVal[0];

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("More_popup", am4charts.XYChart);

      //Chart loader
      let indicator: any;
      let indicatorInterval: any;

      showIndicator();
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

      if (Object.keys(tempAcVal).length > 0) {
        chart.data = [{
          "category": "UPS",
          "Count": eventData['TRANSPORTATION COST'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": eventDataFedex['TRANSPORTATION COST'],
          "color": "#8250e7"
        }];
      }

      else {

        chart.data = [{
          "category": "UPS",
          "Count": "0",
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": "0",
          "color": "#8250e7"
        }];
      }

      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false;
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      var MaxVal = Math.max(eventData['TRANSPORTATION COST'], eventDataFedex['TRANSPORTATION COST']);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.title.text = "$ Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return "$" + text;
      });

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 0.9;
      series.columns.template.propertyFields.fill = "color";
      series.tooltip.autoTextColor = false;
      series.tooltip.label.fill = am4core.color("#FFFFFF");

      let series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "Count";
      series2.dataFields.categoryX = "Month";
      series2.name = "Net Amount";
      series2.clustered = false;
      series2.columns.template.tooltipText = "Total :$ [bold]{valueY}[/]";
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      this.More_popupChart = chart;

      if (chart.data.length > 0) {
        hideIndicator();
      }
    });
  }

  async loadACSurcharges(tempAC: any) {
    var tempAcVal = tempAC;
    var eventName = tempAcVal.eventName;
    this.eventNameSurcharge = "SURCHARGES";
    var eventValue = tempAcVal.eventValue;
    var eventDataVal = eventValue.comparisonResults;
    var eventDataFedexVal = eventValue.fedexcomparisonResults;
    var eventData = eventDataVal[0];
    var eventDataFedex = eventDataFedexVal[0];

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("More_popupSurcharge", am4charts.XYChart);

      //Chart loader
      let indicator: any;
      let indicatorInterval: any;

      showIndicator();
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
      if (Object.keys(tempAcVal).length > 0) {
        chart.data = [{
          "category": "UPS",
          "Count": eventData['SURCHARGES'],
          "color": "#a26606"
        }, {
          "category": "FedEx",
          "Count": eventDataFedex['SURCHARGES'],
          "color": "#4b2497"
        }];
      }
      else {
        chart.data = [{
          "category": "UPS",
          "Count": "0",
          "color": "#a26606"
        }, {
          "category": "FedEx",
          "Count": "0",
          "color": "#4b2497"
        }];
      }
      chart.colors.list = [
        am4core.color("#a26606"),
        am4core.color("#4b2497")
      ];
      // Create axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false;
      categoryAxis.dataFields.category = "category";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 30;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      var MaxVal = Math.max(eventData['SURCHARGES'], eventDataFedex['SURCHARGES']);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.title.text = "$ Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return "$" + text;
      });

      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY}[/]";
      series.columns.template.fillOpacity = 0.9;
      series.columns.template.propertyFields.fill = "color";
      series.tooltip.label.fill = am4core.color("#FFFFFF");


      let series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "Count";
      series2.dataFields.categoryX = "Month";
      series2.name = "Net Amount";
      series2.clustered = false;
      series2.columns.template.tooltipText = "Total :$ [bold]{valueY}[/]";
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.grid.template.strokeOpacity = 1;
        valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      this.More_popupChart = chart;

      if (chart.data.length > 0) {
        hideIndicator();
      }
    });
  }
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {

      if (this.More_popupChart) {
        this.More_popupChart.dispose();
      }

    });
  }

  close() {
    this.dialogRef.close();
  }
}
