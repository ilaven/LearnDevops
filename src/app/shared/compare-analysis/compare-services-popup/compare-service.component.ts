import { Component, Inject, Optional, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CompareCardsPopupComponent } from '../../compare-analysis/compare-cards-poup/compare-cards-popup.component';
@Component({
  selector: 'compare-services-popup',
  templateUrl: './compare-service.component.html',
  standalone: false,
})
export class CompareServicesPopupComponent implements OnInit {
  private More_popupChart!: am4charts.XYChart;

  //variable decalaration
  fromPage: any;
  eventName: any;
  themeoption: any;
  ServiceTextVAl: any;
  addlHandlCost: any;
  addressCorrCost: any;
  largePakageCost: any;
  overMaxCost: any;
  addlHandlCostFedex: any;
  addressCorrCostFedex: any;
  largePakageCostFedex: any;
  overMaxCostFedex: any;
  panelClass: any;

  constructor(public dialogRef: MatDialogRef<CompareServicesPopupComponent>, private dialog: MatDialog, private mlForm: FormBuilder, private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data.popupValue;
    this.ServiceTextVAl = data.ServiceTextVAl;
    this.themeoption = data.themeoption;

  }

  ngOnInit() {
    this.shippingCostChart(this.fromPage);
    this.avgCostPerPackageChart(this.fromPage);
    this.avgWgtPerPackageChart(this.fromPage);
    this.packagesShippedChart(this.fromPage);
    this.avgShippingCostPerLBChart(this.fromPage);
    this.avgZoneChart(this.fromPage);
    this.TotalBilledWgtChart(this.fromPage);

    var accDataVal = this.fromPage;
    this.addlHandlCost = accDataVal[2]['Additional Handling'];
    this.addressCorrCost = accDataVal[2]['Address Correction'];
    this.largePakageCost = accDataVal[2]['Large Package Surcharge'];
    this.overMaxCost = accDataVal[2]['Over Maximum'];
    this.addlHandlCostFedex = accDataVal[3]['Additional Handling'];
    this.addressCorrCostFedex = accDataVal[3]['Address Correction'];
    this.largePakageCostFedex = accDataVal[3]['Large Package Surcharge'];
    this.overMaxCostFedex = accDataVal[3]['Over Maximum'];

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
  }

  compareCardObj = {};
  createCardValues(param: any) {
    if (param == 'Additional Handling') {
      this.compareCardObj = { upsVal: this.addlHandlCost, FedexVal: this.addlHandlCostFedex, cardName: param }
    }
    else if (param == 'Address Correction') {
      this.compareCardObj = { upsVal: this.addressCorrCost, FedexVal: this.addressCorrCostFedex, cardName: param }
    }
    else if (param == 'Large Package Surcharge') {
      this.compareCardObj = { upsVal: this.largePakageCost, FedexVal: this.largePakageCostFedex, cardName: param }
    }
    else if (param == 'Over Maximum') {
      this.compareCardObj = { upsVal: this.overMaxCost, FedexVal: this.overMaxCostFedex, cardName: param }
    }
    this.openCompareCardsPopupComponent(this.compareCardObj);
  }
  openCompareCardsPopupComponent(param: any) {
    const dialogRef = this.dialog.open(CompareCardsPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: param,
        themeoption: this.themeoption
      }
    });

  }

  async shippingCostChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("shippingCost", am4charts.XYChart);

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
          "Count": tempAcVal[0]['SHIPPING COSTS'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['SHIPPING COSTS'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.title.text = "$ Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return "$" + text;
      });
      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      }
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
  async avgCostPerPackageChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("avgCostPerPackage", am4charts.XYChart);

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
          "Count": tempAcVal[0]['AVG. COST / PACKAGE'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['AVG. COST / PACKAGE'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
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
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
  async avgWgtPerPackageChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("avgWgtPerPackage", am4charts.XYChart);

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
          "Count": tempAcVal[0]['AVG. WEIGHT / PACKAGE'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['AVG. WEIGHT / PACKAGE'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;

      valueAxis.title.text = "Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return text;
      });
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
  async packagesShippedChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("packagesShipped", am4charts.XYChart);

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
          "Count": tempAcVal[0]['PACKAGES SHIPPED'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['PACKAGES SHIPPED'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;
      valueAxis.title.text = "Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return text;
      });
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
  async avgShippingCostPerLBChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("avgShippingCostPerLB", am4charts.XYChart);

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
          "Count": tempAcVal[0]['AVG. SHIPPING COST/LB'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['AVG. SHIPPING COST/LB'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
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
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
  async avgZoneChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("avgZone", am4charts.XYChart);

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
          "Count": tempAcVal[0]['AVG. ZONE'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['AVG. ZONE'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;

      valueAxis.title.text = "Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return text;
      });
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
  async TotalBilledWgtChart(param: any) {
    var tempAcVal = param;

    am4core.useTheme(am4themes_animated);  // Themes end
    am4core.options.commercialLicense = true;
    this.zone.runOutsideAngular(() => {
      let chart: any = am4core.create("TotalBilledWgt", am4charts.XYChart);

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
          "Count": tempAcVal[0]['TOTAL BILLED WEIGHT'],
          "color": "#dc9d3c"
        }, {
          "category": "FedEx",
          "Count": tempAcVal[1]['TOTAL BILLED WEIGHT'],
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
      var MaxVal = Math.max(tempAcVal.upsVal, tempAcVal.FedexVal);
      valueAxis.min = 0;
      valueAxis.max = MaxVal;
      valueAxis.cursorTooltipEnabled = false;

      valueAxis.title.text = "Value";
      valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
        return text;
      });
      // Create series
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Count";
      series.dataFields.categoryX = "category";
      series.name = "Count";
      series.clustered = false;
      series.columns.template.tooltipText = "Total: [bold]{valueY.formatNumber('#,###.00')}[/]";
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
