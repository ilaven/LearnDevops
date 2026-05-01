import { Component, Inject, Optional, OnInit, NgZone, OnDestroy, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { MatDialog } from '@angular/material/dialog';//9126 service by weight 
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { ServiceByWeightPopupComponent } from 'src/app/pages/UPS/popup/weight-dist-popup/Serviceby-weight/serviceby-weight.component';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { DatePipe } from '@angular/common';


am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

@Component({
  selector: 'app-fedex-weight-dist-popup',
  templateUrl: './fedex-weight-dist-popup.component.html',
  styleUrls: ['fedex-weight-dist-popup.component.css'],
  standalone: false
})
export class FedexWeightDistPopupComponent implements OnInit {
  private volume_weightChart!: am4charts.XYChart;
  private average_costChart!: am4charts.XYChart;
  private weight_disPopupChart!: am4charts.XYChart;
  private spendByMonthChart!: am4charts.XYChart;
  private acc_noChart!: am4charts.XYChart;
  fromPage;
  invoiceMonth;
  invoiceyear;
  clientId;
  clientName: any;
  groupby;
  group;
  resultObj: any;
  moreviewWeightFormGroup!: FormGroup;
  dashBoardSHP: FormGroup;
  ByServiceAc = [];
  ByServicefrtAc = [];
  weightchargetype: any;
  weight_mainAC; 
  weightdisttxt_text: any;
  from: any;
  to: any;
  fromACC: any;
  toACC: any;
  month: any;
  fun_monthAC: any;
  commonAC = [];
  t004tempObj = {};
  tempt004AC = [];
  acclink_id_styleName: any;
  frtlink_id_styleName: any;
  frtacc_btn_selected: any;
  frt_btn_this_selected: any;
  weightfrtAC = [];
  hashMapObjData = new Map();
  hashMapFRTObjData = new Map();
  hashMapObj = new Map();
  userProfifleFedex;
  totalSpendObj: any;
  accountNumber;
  monthFlag;
  themeoption;
  accountNumberVal;
  panelClass;
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') }),
  });
  barColors = [
    '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
    '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
    '#E07877', '#E09776', '#F4C5B0', '#F3B777',
    '#F5C7A0', '#F6D3B8'
  ];
  constructor(
    public dialogRef: MatDialogRef<FedexWeightDistPopupComponent>,
    private fb: FormBuilder,
    private httpfedexService: HttpfedexService,
    private zone: NgZone,
    private dialog: MatDialog,
    public datePipe: DatePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.panelClass = data.panelClass;
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('FRTWithAcc')
    });
    this.fromPage = data.popupValue;
    if (this.fromPage.invoiceMonth == null) { this.invoiceMonth = '0'; }
    else { this.invoiceMonth = this.fromPage.invoiceMonth; }
    this.invoiceyear = this.fromPage.invoiceyear;
    this.clientId = this.fromPage.clientId;
    this.groupby = "Weightdes";
    this.group = "Weightdestri";
    this.weight_mainAC = this.fromPage.weight_mainAC;
    this.chargetypevalue.set(this.fromPage.chargetypevalue);
    this.userProfifleFedex = this.fromPage.t002ClientProfile;
    this.themeoption = this.fromPage.themeoption;

    this.accountNumber = this.fromPage.accountNumber;
    if (this.accountNumber == "ALL") {
      this.accountNumberVal = null;
    } else { this.accountNumberVal = this.accountNumber; }
    this.monthFlag = this.fromPage.monthFlag;
    this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
    this.moreviewWeightFormGroup = new FormGroup({
      clientName: new FormControl(''),
      clientId: new FormControl(this.clientId),
      designFileName: new FormControl(''),
      month: new FormControl(this.invoiceMonth),
      year: new FormControl(this.invoiceyear),
      accountNumber: new FormControl(this.accountNumberVal),
      chargeType: new FormControl(this.chargetypevalue()),
      createdDate: new FormControl(''),
      requesteddttm: new FormControl(''),
      chargeDesc: new FormControl(''),
      chargeGroup: new FormControl(''),
      reportFormat: new FormControl(''),
      loginId: new FormControl(''),
      desc: new FormControl(''),
      grp: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      reportType: new FormControl(''),
      reportName: new FormControl(''),
      modulename: new FormControl(''),
      status: new FormControl(''),
      accNo: new FormControl(this.accountNumberVal),
      t002ClientProfile: new FormGroup({
        clientId: new FormControl(''),
        clientName: new FormControl(''),
        userName: new FormControl(''),
        password: new FormControl(''),
        siteUserName: new FormControl(''),
        sitePassword: new FormControl(''),
        address: new FormControl(''),
        contactNo: new FormControl(''),
        comments: new FormControl(''),
        endDate: new FormControl(''),
        startDate: new FormControl(''),
        status: new FormControl(''),
        auditStatus: new FormControl(''),
        contractStatus: new FormControl(''),
        email: new FormControl(''),
        userLogo: new FormControl(''),
        customerType: new FormControl(''),
        dataSource: new FormControl(''),
        dataLoadedBy: new FormControl(''),
        filestartdate: new FormControl(''),
        fileenddate: new FormControl(''),
        dateasof: new FormControl(''),
        currentDate: new FormControl(''),
        currentYear: new FormControl(''),
        currentMonth: new FormControl(''),
        startYear: new FormControl(''),
        createdBy: new FormControl(''),
        createdTs: new FormControl(''),
        updatedTs: new FormControl(''),
        adminFlag: new FormControl(''),
        filestartdate1: new FormControl(''),
        fileenddate1: new FormControl(''),
        trackingcount: new FormControl(''),
        logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''),
        noofdaysinactive: new FormControl(''),
        ipaddress: new FormControl(''),
        loginFlag: new FormControl(''),
        contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''),
        carrierType: new FormControl(''),
        customers: new FormControl('')
      }),
      t002ClientProfileobj: new FormGroup({
        clientId: new FormControl(''),
        clientName: new FormControl(''),
        userName: new FormControl(''),
        password: new FormControl(''),
        siteUserName: new FormControl(''),
        sitePassword: new FormControl(''),
        address: new FormControl(''),
        contactNo: new FormControl(''),
        comments: new FormControl(''),
        endDate: new FormControl(''),
        startDate: new FormControl(''),
        status: new FormControl(''),
        auditStatus: new FormControl(''),
        contractStatus: new FormControl(''),
        email: new FormControl(''),
        userLogo: new FormControl(''),
        customerType: new FormControl(''),
        dataSource: new FormControl(''),
        dataLoadedBy: new FormControl(''),
        filestartdate: new FormControl(''),
        fileenddate: new FormControl(''),
        dateasof: new FormControl(''),
        currentDate: new FormControl(''),
        currentYear: new FormControl(''),
        currentMonth: new FormControl(''),
        startYear: new FormControl(''),
        createdBy: new FormControl(''),
        createdTs: new FormControl(''),
        updatedTs: new FormControl(''),
        adminFlag: new FormControl(''),
        filestartdate1: new FormControl(''),
        fileenddate1: new FormControl(''),
        trackingcount: new FormControl(''),
        logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''),
        noofdaysinactive: new FormControl(''),
        ipaddress: new FormControl(''),
        loginFlag: new FormControl(''),
        contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''),
        carrierType: new FormControl(''),
        customers: new FormControl('')
      })
    })
  }
  chargetypevalue=signal<any>(''); 
  async linkshpChange(data: any) {
    await this.moreviewWeightFormGroup.get('chargeType')?.setValue(data);
    if (data == "FRT") {
      this.chargeType = "FRT";
      await this.linkfrt_clickHandler(data);
    }
    if (data == "FRTWithAcc" || data == null) {
      this.chargeType = "FRTWithAcc";
      await this.linkfrtacc_clickHandler(data);
    }
    this.chargetypevalue.set(this.moreviewWeightFormGroup.get('chargeType')?.value);
  }
  async linkfrt_clickHandler(event: any) {
    this.fetchTotalSpendDashBoard();
  }
  async linkfrtacc_clickHandler(event: any) {
    this.fetchTotalSpendDashBoard();

  }
  ngOnInit() {
    this.dragpanel_initializeHandler();

  }

  closeDialog() {
    this.dialogRef.close(true);
  }
  chargeType:any = "FRTWithAcc";
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
    this.moreviewWeightFormGroup.patchValue({
      t002ClientProfile: {
        "clientId": this.userProfifleFedex.clientId,
        "clientName": this.userProfifleFedex.clientName,
        "userName": this.userProfifleFedex.userName,
        "password": this.userProfifleFedex.password,
        "siteUserName": this.userProfifleFedex.siteUserName,
        'sitePassword': this.userProfifleFedex.sitePassword,
        "address": this.userProfifleFedex.address,
        "contactNo": this.userProfifleFedex.contactNo,
        "comments": this.userProfifleFedex.comments,
        "endDate": this.userProfifleFedex.endDate,
        "startDate": this.userProfifleFedex.startDate,
        "status": this.userProfifleFedex.status,
        "auditStatus": this.userProfifleFedex.auditStatus,
        "contractStatus": this.userProfifleFedex.contractStatus,
        "email": this.userProfifleFedex.email,
        "userLogo": this.userProfifleFedex.userLogo,
        "customerType": this.userProfifleFedex.customerType,
        "dataSource": this.userProfifleFedex.dataSource,
        "dataLoadedBy": this.userProfifleFedex.dataLoadedBy,
        "filestartdate": this.userProfifleFedex.filestartdate,
        "fileenddate": this.userProfifleFedex.fileenddate,
        "dateasof": this.userProfifleFedex.dateasof,
        "currentDate": this.userProfifleFedex.currentDate,
        "currentYear": this.userProfifleFedex.currentYear,
        "currentMonth": this.userProfifleFedex.currentMonth,
        "startYear": this.userProfifleFedex.startYear,
        "createdBy": this.userProfifleFedex.createdBy,
        "createdTs": this.userProfifleFedex.createdTs,
        "updatedTs": this.userProfifleFedex.updatedTs,
        "adminFlag": this.userProfifleFedex.adminFlag,
        "filestartdate1": this.userProfifleFedex.filestartdate1,
        "fileenddate1": this.userProfifleFedex.fileenddate1,
        "trackingcount": this.userProfifleFedex.trackingcount,
        "logostatus": this.userProfifleFedex.logostatus,
        "noofdaystoactive": this.userProfifleFedex.noofdaystoactive,
        "noofdaysinactive": this.userProfifleFedex.noofdaysinactive,
        "ipaddress": this.userProfifleFedex.ipaddress,
        "loginFlag": this.userProfifleFedex.loginFlag,
        "contractSavingFlag": this.userProfifleFedex.contractSavingFlag,
        "clientProfileName": this.userProfifleFedex.clientProfileName,
        "carrierType": this.userProfifleFedex.carrierType,
        "t002AccountDet": this.userProfifleFedex.t002AccountDet,
        "customers": this.userProfifleFedex.customers
      }
    });
    this.loadAC(this.weight_mainAC, this.invoiceyear, this.invoiceMonth, this.chargetypevalue());


  }
  async loadAC(weightAC1: any, clickedYear: string, clickedMonth: string, chargetypevalue: string) {
    var month = clickedMonth;
    var year = clickedYear;
    var weightAC = weightAC1;
    var orginalAC = weightAC;
    this.weightfrtAC = weightAC;
    var weightfrtAC = weightAC;
    var chargetypeflag = chargetypevalue;
    var weightchargetype = chargetypevalue;
    var orginalAC = weightAC1;
    if (weightchargetype == null)
      weightchargetype = "FRTWithAcc";

    if (weightchargetype == "FRTWithAcc") {

    }
    else {
    }

    var domain_Name = "T004_Dashboard";
    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

    if (month == '0') {
      this.weightdisttxt_text = "Weight Distribution" + " " + year;
    }
    else {
      var monthnumber = Number(month);
      this.weightdisttxt_text = "Weight Distribution" + " " + year + " " + monthArray[monthnumber - 1];
    }
    this.fetchTotalSpendDashBoard();


  }
  async fetchTotalSpendDashBoard() {
    this.httpfedexService.fetchTotalSpendDashBoard(this.moreviewWeightFormGroup.value)?.subscribe(
      (result: any) => {
        var t201SpendAC;
        t201SpendAC = result;
        if (t201SpendAC != null && t201SpendAC.length != 0) {
          var totalSpendObj = t201SpendAC[0];
        }
        this.formWeightDistribution(totalSpendObj);
        this.fetchDashAccountNumber();
      },
      error => {
        console.log(' error', error);
      })
  }
  previous_id_visible: any;
  first_id_visible: any;
  next_id_visible: any;
  async fetchDashAccountNumber() {
    this.httpfedexService.fetchDashAccountNumber(this.moreviewWeightFormGroup.value)?.subscribe(
      (result: any) => {
        this.resultObj = result;
        var t201AccresultAC;
        this.t201AccresultAC = result;
        t201AccresultAC = result;
        if (t201AccresultAC == null || t201AccresultAC.length == 0) {
          return;
        }
        this.previous_id_visible = false;
        this.first_id_visible = false;
        this.next_id_visible = false;
        this.fromAccCount = 0;
        this.toAccCount = 0;
        if (t201AccresultAC.length < 5 || t201AccresultAC.length == 5) {
          this.fromAccCount = 0;
          this.toAccCount = t201AccresultAC.length;
        }
        else {
          this.fromAccCount = 0;
          this.toAccCount = 5;
          this.next_id_visible = true;
          this.previous_id_visible = false;
          this.first_id_visible = false;
        }
        this.spendAccNumberChart(result);
      },
      error => {
        console.log('error', error);
      })
  }
  async spendAccNumberChart(t201AccountChartAC: any) {
    var t201AccountChartACValue = [];
    for (var count = this.fromAccCount; count < this.toAccCount; count++) {
      var t201DashObj = t201AccountChartAC[count];
      t201AccountChartACValue.push(t201DashObj);
    }
    await this.createSeriesFromAC21(t201AccountChartACValue);
  }

  async createSeriesFromAC21(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var loop = 0; loop < collection.length; loop++) {
        var tempObj = collection[loop];
        var nameFiled = tempObj.accountNumber;
        var yField = tempObj.aytotalNetCharge;
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
      categoryAxis.renderer.grid.template.location = 0;

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
      columnTemplate.column.cornerRadiusTopLeft = 8;
      columnTemplate.column.cornerRadiusTopRight = 8;
      this.acc_noChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });

  }
  async formWeightDistribution(totalSpendObj: any) {
    var weightDistObj: any = [];
    if (this.accountNumber == "ALL") {
      if (this.monthFlag == "Y") {
        //WEIGHT DISTRIBUTION
        weightDistObj["wdValue1"] = totalSpendObj.ymbilledDistribution1;
        weightDistObj["wdValue2"] = totalSpendObj.ymbilledWeightDistribution2;
        weightDistObj["wdValue3"] = totalSpendObj.ymbilledWeightDistribution3;
        weightDistObj["wdValue4"] = totalSpendObj.ymbilledWeightDistribution4;
        weightDistObj["wdValue5"] = totalSpendObj.ymbilledWeightDistribution5;
        weightDistObj["wdValue6"] = totalSpendObj.ymbilledWeightDistribution6to10;
        weightDistObj["wdValue7"] = totalSpendObj.ymbilledWeightDistribution10to20;
        weightDistObj["wdValue8"] = totalSpendObj.ymbilledWeightDistribution20to30;
        weightDistObj["wdValue9"] = totalSpendObj.ymbilledWeightDistribution30to50;
        weightDistObj["wdValue10"] = totalSpendObj.ymbilledWeightDistribution50to70;
        weightDistObj["wdValue11"] = totalSpendObj.ymbilledWeightDistribution70to150;
        weightDistObj["wdValue12"] = totalSpendObj.ymbilledWeightDistribution150;
        // weightDistObj["wdValue13"]=totalSpendObj.ymbilledWeightDistribution0to16oz;
        weightDistObj["wdValue13"] = totalSpendObj.ymbilledWeightDistributionLtr;

        //AVG BILLED WT
        weightDistObj["avgWtValue1"] = totalSpendObj.ymaverageBilledDistributon1;
        weightDistObj["avgWtValue2"] = totalSpendObj.ymaverageBilledDistributon2;
        weightDistObj["avgWtValue3"] = totalSpendObj.ymaverageBilledDistributon3;
        weightDistObj["avgWtValue4"] = totalSpendObj.ymaverageBilledDistributon4;
        weightDistObj["avgWtValue5"] = totalSpendObj.ymaverageBilledDistributon5;
        weightDistObj["avgWtValue6"] = totalSpendObj.ymaverageBilledDistributon6to10;
        weightDistObj["avgWtValue7"] = totalSpendObj.ymaverageBilledDistributon10to20;
        weightDistObj["avgWtValue8"] = totalSpendObj.ymaverageBilledDistributon20to30;
        weightDistObj["avgWtValue9"] = totalSpendObj.ymaverageBilledDistributon30to50;
        weightDistObj["avgWtValue10"] = totalSpendObj.ymaverageBilledDistributon50to70;
        weightDistObj["avgWtValue11"] = totalSpendObj.ymaverageBilledDistributon70to150;
        weightDistObj["avgWtValue12"] = totalSpendObj.ymaverageBilledDistributon150;
        // weightDistObj["avgWtValue13"]=totalSpendObj.ymaverageBilledDistributon0to16oz;
        weightDistObj["avgWtValue13"] = totalSpendObj.ymaverageBilledDistributonLtr;

        //VOLUME WT
        weightDistObj["volWtValue1"] = totalSpendObj.ymvolumeBilledDistribution1;
        weightDistObj["volWtValue2"] = totalSpendObj.ymvolumeBilledDistribution2;
        weightDistObj["volWtValue3"] = totalSpendObj.ymvolumeBilledDistribution3;
        weightDistObj["volWtValue4"] = totalSpendObj.ymvolumeBilledDistribution4;
        weightDistObj["volWtValue5"] = totalSpendObj.ymvolumeBilledDistribution5;
        weightDistObj["volWtValue6"] = totalSpendObj.ymvolumeBilledDistribution6to10;
        weightDistObj["volWtValue7"] = totalSpendObj.ymvolumeBilledDistribution10to20;
        weightDistObj["volWtValue8"] = totalSpendObj.ymvolumeBilledDistribution20to30;
        weightDistObj["volWtValue9"] = totalSpendObj.ymvolumeBilledDistribution30to50;
        weightDistObj["volWtValue10"] = totalSpendObj.ymvolumeBilledDistribution50to70;
        weightDistObj["volWtValue11"] = totalSpendObj.ymvolumeBilledDistribution70to150;
        weightDistObj["volWtValue12"] = totalSpendObj.ymvolumeBilledDistribution150;
        // weightDistObj["volWtValue13"]=totalSpendObj.ymvolumeBilledDistribution0to16oz;
        weightDistObj["volWtValue13"] = totalSpendObj.ymvolumeBilledDistributionLtr;
      }
      else {
        weightDistObj["wdValue1"] = totalSpendObj.ybilledDistribution1;
        weightDistObj["wdValue2"] = totalSpendObj.ybilledWeightDistribution2;
        weightDistObj["wdValue3"] = totalSpendObj.ybilledWeightDistribution3;
        weightDistObj["wdValue4"] = totalSpendObj.ybilledWeightDistribution4;
        weightDistObj["wdValue5"] = totalSpendObj.ybilledWeightDistribution5;
        weightDistObj["wdValue6"] = totalSpendObj.ybilledWeightDistribution6to10;
        weightDistObj["wdValue7"] = totalSpendObj.ybilledWeightDistribution10to20;
        weightDistObj["wdValue8"] = totalSpendObj.ybilledWeightDistribution20to30;
        weightDistObj["wdValue9"] = totalSpendObj.ybilledWeightDistribution30to50;
        weightDistObj["wdValue10"] = totalSpendObj.ybilledWeightDistribution50to70;
        weightDistObj["wdValue11"] = totalSpendObj.ybilledWeightDistribution70to150;
        weightDistObj["wdValue12"] = totalSpendObj.ybilledWeightDistribution150;
        // weightDistObj["wdValue13"]=totalSpendObj.ybilledWeightDistribution0to16oz;
        weightDistObj["wdValue13"] = totalSpendObj.ybilledWeightDistributionLtr;

        //AVG BILLED WT
        weightDistObj["avgWtValue1"] = totalSpendObj.yaverageBilledDistributon1;
        weightDistObj["avgWtValue2"] = totalSpendObj.yaverageBilledDistributon2;
        weightDistObj["avgWtValue3"] = totalSpendObj.yaverageBilledDistributon3;
        weightDistObj["avgWtValue4"] = totalSpendObj.yaverageBilledDistributon4;
        weightDistObj["avgWtValue5"] = totalSpendObj.yaverageBilledDistributon5;
        weightDistObj["avgWtValue6"] = totalSpendObj.yaverageBilledDistributon6to10;
        weightDistObj["avgWtValue7"] = totalSpendObj.yaverageBilledDistributon10to20;
        weightDistObj["avgWtValue8"] = totalSpendObj.yaverageBilledDistributon20to30;
        weightDistObj["avgWtValue9"] = totalSpendObj.yaverageBilledDistributon30to50;
        weightDistObj["avgWtValue10"] = totalSpendObj.yaverageBilledDistributon50to70;
        weightDistObj["avgWtValue11"] = totalSpendObj.yaverageBilledDistributon70to150;
        weightDistObj["avgWtValue12"] = totalSpendObj.yaverageBilledDistributon150;
        // weightDistObj["avgWtValue13"]=totalSpendObj.yaverageBilledDistributon0to16oz;
        weightDistObj["avgWtValue13"] = totalSpendObj.yaverageBilledDistributonLtr;

        //VOLUME WT
        weightDistObj["volWtValue1"] = totalSpendObj.yvolumeBilledDistribution1;
        weightDistObj["volWtValue2"] = totalSpendObj.yvolumeBilledDistribution2;
        weightDistObj["volWtValue3"] = totalSpendObj.yvolumeBilledDistribution3;
        weightDistObj["volWtValue4"] = totalSpendObj.yvolumeBilledDistribution4;
        weightDistObj["volWtValue5"] = totalSpendObj.yvolumeBilledDistribution5;
        weightDistObj["volWtValue6"] = totalSpendObj.yvolumeBilledDistribution6to10;
        weightDistObj["volWtValue7"] = totalSpendObj.yvolumeBilledDistribution10to20;
        weightDistObj["volWtValue8"] = totalSpendObj.yvolumeBilledDistribution20to30;
        weightDistObj["volWtValue9"] = totalSpendObj.yvolumeBilledDistribution30to50;
        weightDistObj["volWtValue10"] = totalSpendObj.yvolumeBilledDistribution50to70;
        weightDistObj["volWtValue11"] = totalSpendObj.yvolumeBilledDistribution70to150;
        weightDistObj["volWtValue12"] = totalSpendObj.yvolumeBilledDistribution150;
        // weightDistObj["volWtValue13"]=totalSpendObj.yvolumeBilledDistribution0to16oz;
        weightDistObj["volWtValue13"] = totalSpendObj.yvolumeBilledDistributionLtr;
      }

      //SPEND_BY_TIME
      weightDistObj["spendValue1"] = totalSpendObj.mtotalSpend1;
      weightDistObj["spendValue2"] = totalSpendObj.mtotalSpend2;
      weightDistObj["spendValue3"] = totalSpendObj.mtotalSpend3;
      weightDistObj["spendValue4"] = totalSpendObj.mtotalSpend4;
      weightDistObj["spendValue5"] = totalSpendObj.mtotalSpend5;
      weightDistObj["spendValue6"] = totalSpendObj.mtotalSpend6;
      weightDistObj["spendValue7"] = totalSpendObj.mtotalSpend7;
      weightDistObj["spendValue8"] = totalSpendObj.mtotalSpend8;
      weightDistObj["spendValue9"] = totalSpendObj.mtotalSpend9;
      weightDistObj["spendValue10"] = totalSpendObj.mtotalSpend10;
      weightDistObj["spendValue11"] = totalSpendObj.mtotalSpend11;
      weightDistObj["spendValue12"] = totalSpendObj.mtotalSpend12;
    }
    else {
      if (this.monthFlag == "Y") {
        weightDistObj["wdValue1"] = totalSpendObj.ambilledDistribution1;
        weightDistObj["wdValue2"] = totalSpendObj.ambilledWeightDistribution2;
        weightDistObj["wdValue3"] = totalSpendObj.ambilledWeightDistribution3;
        weightDistObj["wdValue4"] = totalSpendObj.ambilledWeightDistribution4;
        weightDistObj["wdValue5"] = totalSpendObj.ambilledWeightDistribution5;
        weightDistObj["wdValue6"] = totalSpendObj.ambilledWeightDistribution6to10;
        weightDistObj["wdValue7"] = totalSpendObj.ambilledWeightDistribution10to20;
        weightDistObj["wdValue8"] = totalSpendObj.ambilledWeightDistribution20to30;
        weightDistObj["wdValue9"] = totalSpendObj.ambilledWeightDistribution30to50;
        weightDistObj["wdValue10"] = totalSpendObj.ambilledWeightDistribution50to70;
        weightDistObj["wdValue11"] = totalSpendObj.ambilledWeightDistribution70to150;
        weightDistObj["wdValue12"] = totalSpendObj.ambilledWeightDistribution150;
        // weightDistObj["wdValue13"]=totalSpendObj.ambilledWeightDistribution0to16oz;
        weightDistObj["wdValue13"] = totalSpendObj.ambilledWeightDistributionLtr;

        //AVG BILLED WT
        weightDistObj["avgWtValue1"] = totalSpendObj.amaverageBilledDistributon1;
        weightDistObj["avgWtValue2"] = totalSpendObj.amaverageBilledDistributon2;
        weightDistObj["avgWtValue3"] = totalSpendObj.amaverageBilledDistributon3;
        weightDistObj["avgWtValue4"] = totalSpendObj.amaverageBilledDistributon4;
        weightDistObj["avgWtValue5"] = totalSpendObj.amaverageBilledDistributon5;
        weightDistObj["avgWtValue6"] = totalSpendObj.amaverageBilledDistributon6to10;
        weightDistObj["avgWtValue7"] = totalSpendObj.amaverageBilledDistributon10to20;
        weightDistObj["avgWtValue8"] = totalSpendObj.amaverageBilledDistributon20to30;
        weightDistObj["avgWtValue9"] = totalSpendObj.amaverageBilledDistributon30to50;
        weightDistObj["avgWtValue10"] = totalSpendObj.amaverageBilledDistributon50to70;
        weightDistObj["avgWtValue11"] = totalSpendObj.amaverageBilledDistributon70to150;
        weightDistObj["avgWtValue12"] = totalSpendObj.amaverageBilledDistributon150;
        // weightDistObj["avgWtValue13"]=totalSpendObj.amaverageBilledDistributon0to16oz;
        weightDistObj["avgWtValue13"] = totalSpendObj.amaverageBilledDistributonLtr;

        //VOLUME WT
        weightDistObj["volWtValue1"] = totalSpendObj.amvolumeBilledDistribution1;
        weightDistObj["volWtValue2"] = totalSpendObj.amvolumeBilledDistribution2;
        weightDistObj["volWtValue3"] = totalSpendObj.amvolumeBilledDistribution3;
        weightDistObj["volWtValue4"] = totalSpendObj.amvolumeBilledDistribution4;
        weightDistObj["volWtValue5"] = totalSpendObj.amvolumeBilledDistribution5;
        weightDistObj["volWtValue6"] = totalSpendObj.amvolumeBilledDistribution6to10;
        weightDistObj["volWtValue7"] = totalSpendObj.amvolumeBilledDistribution10to20;
        weightDistObj["volWtValue8"] = totalSpendObj.amvolumeBilledDistribution20to30;
        weightDistObj["volWtValue9"] = totalSpendObj.amvolumeBilledDistribution30to50;
        weightDistObj["volWtValue10"] = totalSpendObj.amvolumeBilledDistribution50to70;
        weightDistObj["volWtValue11"] = totalSpendObj.amvolumeBilledDistribution70to150;
        weightDistObj["volWtValue12"] = totalSpendObj.amvolumeBilledDistribution150;
        // weightDistObj["volWtValue13"]=totalSpendObj.amvolumeBilledDistribution0to16oz;
        weightDistObj["volWtValue13"] = totalSpendObj.amvolumeBilledDistributionLtr;
      }
      else {
        weightDistObj["wdValue1"] = totalSpendObj.aybilledDistribution1;
        weightDistObj["wdValue2"] = totalSpendObj.aybilledWeightDistribution2;
        weightDistObj["wdValue3"] = totalSpendObj.aybilledWeightDistribution3;
        weightDistObj["wdValue4"] = totalSpendObj.aybilledWeightDistribution4;
        weightDistObj["wdValue5"] = totalSpendObj.aybilledWeightDistribution5;
        weightDistObj["wdValue6"] = totalSpendObj.aybilledWeightDistribution6to10;
        weightDistObj["wdValue7"] = totalSpendObj.aybilledWeightDistribution10to20;
        weightDistObj["wdValue8"] = totalSpendObj.aybilledWeightDistribution20to30;
        weightDistObj["wdValue9"] = totalSpendObj.aybilledWeightDistribution30to50;
        weightDistObj["wdValue10"] = totalSpendObj.aybilledWeightDistribution50to70;
        weightDistObj["wdValue11"] = totalSpendObj.aybilledWeightDistribution70to150;
        weightDistObj["wdValue12"] = totalSpendObj.aybilledWeightDistribution150;
        // weightDistObj["wdValue13"]=totalSpendObj.aybilledWeightDistribution0to16oz;
        weightDistObj["wdValue13"] = totalSpendObj.aybilledWeightDistributionLtr;

        //AVG BILLED WT
        weightDistObj["avgWtValue1"] = totalSpendObj.ayaverageBilledDistributon1;
        weightDistObj["avgWtValue2"] = totalSpendObj.ayaverageBilledDistributon2;
        weightDistObj["avgWtValue3"] = totalSpendObj.ayaverageBilledDistributon3;
        weightDistObj["avgWtValue4"] = totalSpendObj.ayaverageBilledDistributon4;
        weightDistObj["avgWtValue5"] = totalSpendObj.ayaverageBilledDistributon5;
        weightDistObj["avgWtValue6"] = totalSpendObj.ayaverageBilledDistributon6to10;
        weightDistObj["avgWtValue7"] = totalSpendObj.ayaverageBilledDistributon10to20;
        weightDistObj["avgWtValue8"] = totalSpendObj.ayaverageBilledDistributon20to30;
        weightDistObj["avgWtValue9"] = totalSpendObj.ayaverageBilledDistributon30to50;
        weightDistObj["avgWtValue10"] = totalSpendObj.ayaverageBilledDistributon50to70;
        weightDistObj["avgWtValue11"] = totalSpendObj.ayaverageBilledDistributon70to150;
        weightDistObj["avgWtValue12"] = totalSpendObj.ayaverageBilledDistributon150;
        // weightDistObj["avgWtValue13"]=totalSpendObj.ayaverageBilledDistributon0to16oz;
        weightDistObj["avgWtValue13"] = totalSpendObj.ayaverageBilledDistributonLtr;

        //VOLUME WT
        weightDistObj["volWtValue1"] = totalSpendObj.ayvolumeBilledDistribution1;
        weightDistObj["volWtValue2"] = totalSpendObj.ayvolumeBilledDistribution2;
        weightDistObj["volWtValue3"] = totalSpendObj.ayvolumeBilledDistribution3;
        weightDistObj["volWtValue4"] = totalSpendObj.ayvolumeBilledDistribution4;
        weightDistObj["volWtValue5"] = totalSpendObj.ayvolumeBilledDistribution5;
        weightDistObj["volWtValue6"] = totalSpendObj.ayvolumeBilledDistribution6to10;
        weightDistObj["volWtValue7"] = totalSpendObj.ayvolumeBilledDistribution10to20;
        weightDistObj["volWtValue8"] = totalSpendObj.ayvolumeBilledDistribution20to30;
        weightDistObj["volWtValue9"] = totalSpendObj.ayvolumeBilledDistribution30to50;
        weightDistObj["volWtValue10"] = totalSpendObj.ayvolumeBilledDistribution50to70;
        weightDistObj["volWtValue11"] = totalSpendObj.ayvolumeBilledDistribution70to150;
        weightDistObj["volWtValue12"] = totalSpendObj.ayvolumeBilledDistribution150;
        // weightDistObj["volWtValue13"]=totalSpendObj.ayvolumeBilledDistribution0to16oz;
        weightDistObj["volWtValue13"] = totalSpendObj.ayvolumeBilledDistributionLtr;
      }

      //SPEND_BY_TIME
      weightDistObj["spendValue1"] = totalSpendObj.amtotalSpend1;
      weightDistObj["spendValue2"] = totalSpendObj.amtotalSpend2;
      weightDistObj["spendValue3"] = totalSpendObj.amtotalSpend3;
      weightDistObj["spendValue4"] = totalSpendObj.amtotalSpend4;
      weightDistObj["spendValue5"] = totalSpendObj.amtotalSpend5;
      weightDistObj["spendValue6"] = totalSpendObj.amtotalSpend6;
      weightDistObj["spendValue7"] = totalSpendObj.amtotalSpend7;
      weightDistObj["spendValue8"] = totalSpendObj.amtotalSpend8;
      weightDistObj["spendValue9"] = totalSpendObj.amtotalSpend9;
      weightDistObj["spendValue10"] = totalSpendObj.amtotalSpend10;
      weightDistObj["spendValue11"] = totalSpendObj.amtotalSpend11;
      weightDistObj["spendValue12"] = totalSpendObj.amtotalSpend12;
    }
    this.weightDistObjArr = weightDistObj;
    this.createSeriesFromAC1(weightDistObj);
    this.avgChartforming(weightDistObj);
    this.Spend_MonthForming(weightDistObj);
    this.volumeChartForming(weightDistObj);
  }
  weightDistObjArr: any;
  async createSeriesFromAC1(wghtDistObj: any) {

    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      var chartData = [];
      let chart: any = am4core.create("netcharge_charts", am4charts.XYChart);
      chartData = [{ "weight": "LTR", "value": wghtDistObj.wdValue13 ? wghtDistObj.wdValue13 : '0' },
      { "weight": "1", "value": wghtDistObj.wdValue1 ? wghtDistObj.wdValue1 : 0 },
      { "weight": "2", "value": wghtDistObj.wdValue2 ? wghtDistObj.wdValue2 : 0 },
      { "weight": "3", "value": wghtDistObj.wdValue3 ? wghtDistObj.wdValue3 : 0 },
      { "weight": "4", "value": wghtDistObj.wdValue4 ? wghtDistObj.wdValue4 : 0 },

      { "weight": "5", "value": wghtDistObj.wdValue5 ? wghtDistObj.wdValue5 : 0 },
      { "weight": "6-10", "value": wghtDistObj.wdValue6 ? wghtDistObj.wdValue6 : 0 },
      { "weight": "11-20", "value": wghtDistObj.wdValue7 ? wghtDistObj.wdValue7 : 0 },
      { "weight": "21-30", "value": wghtDistObj.wdValue8 ? wghtDistObj.wdValue8 : 0 },
      { "weight": "31-50", "value": wghtDistObj.wdValue9 ? wghtDistObj.wdValue9 : 0 },

      { "weight": "51-70", "value": wghtDistObj.wdValue10 ? wghtDistObj.wdValue10 : 0 },
      { "weight": "71-150", "value": wghtDistObj.wdValue11 ? wghtDistObj.wdValue11 : 0 },
      { "weight": "151+", "value": wghtDistObj.wdValue12 ? wghtDistObj.wdValue12 : 0 }];

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

  } async avgChartforming(weightDistObj: any) {
    await this.createSeriesFromAC_bar(weightDistObj, "");
  }
  async createSeriesFromAC_bar(wghtDistObj: any, weightVal: any) {
    var tempObj;
    var chartData: any = [];
    if (weightVal == "") {
      chartData = [
        { "weight": "LTR", "value": wghtDistObj.avgWtValue13 ? wghtDistObj.avgWtValue13 : '0' },
        { "weight": "1", "value": wghtDistObj.avgWtValue1 ? wghtDistObj.avgWtValue1 : '0' },
        { "weight": "2", "value": wghtDistObj.avgWtValue2 ? wghtDistObj.avgWtValue2 : '0' },
        { "weight": "3", "value": wghtDistObj.avgWtValue3 ? wghtDistObj.avgWtValue3 : '0' },
        { "weight": "4", "value": wghtDistObj.avgWtValue4 ? wghtDistObj.avgWtValue4 : '0' },
        { "weight": "5", "value": wghtDistObj.avgWtValue5 ? wghtDistObj.avgWtValue5 : '0' },
        { "weight": "6-10", "value": wghtDistObj.avgWtValue6 ? wghtDistObj.avgWtValue6 : '0' },
        { "weight": "11-20", "value": wghtDistObj.avgWtValue7 ? wghtDistObj.avgWtValue7 : '0' },
        { "weight": "21-30", "value": wghtDistObj.avgWtValue8 ? wghtDistObj.avgWtValue8 : '0' },
        { "weight": "31-50", "value": wghtDistObj.avgWtValue9 ? wghtDistObj.avgWtValue9 : '0' },
        { "weight": "51-70", "value": wghtDistObj.avgWtValue10 ? wghtDistObj.avgWtValue10 : '0' },
        { "weight": "71-150", "value": wghtDistObj.avgWtValue11 ? wghtDistObj.avgWtValue11 : '0' },
        { "weight": "151+", "value": wghtDistObj.avgWtValue12 ? wghtDistObj.avgWtValue12 : '0' }
      ];
    } else {
      chartData = wghtDistObj;
      for (var loop = 0; loop < chartData.length; loop++) {
        if (chartData[loop]['weight'] == weightVal)
          chartData.splice(loop, 1);

      }
    }


    am4core.options.commercialLicense = true;
    am4core.useTheme(am4themes_animated);
    // Themes end
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart: any = am4core.create("average_costCharts", am4charts.XYChart);

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
      categoryAxis.renderer.grid.template.location = 0;

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
      let series: any = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Avg Cost: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = 1;
      series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;

      series.columns.template.events.on("hit", (ev: any) => {
        const seriesColumn = ev.target.dataItem.categoryX;
        this.createSeriesFromAC_bar(chartData, seriesColumn);
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
        // valueAxis.renderer.grid.template.strokeOpacity = 1;
        // valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
        // valueAxis.renderer.grid.template.strokeWidth = 2;
      }
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      this.weight_disPopupChart = chart;
      if (chartData.length > 0 || weightVal != "") {
        hideIndicator();
      }
    });
  }
  resetBars() {
    this.avgChartforming(this.weightDistObjArr);
  }
  async Spend_MonthForming(weightDistObj: any) { await this.createSeriesFromAC10(weightDistObj); }
  async createSeriesFromAC10(weightDistObj: any) {



    var chartData: any = [];
    chartData = [{ "Month": "JAN", "value": weightDistObj.spendValue1 ? weightDistObj.spendValue1 : 0 },
    { "Month": "FEB", "value": weightDistObj.spendValue2 ? weightDistObj.spendValue2 : 0 },
    { "Month": "MAR", "value": weightDistObj.spendValue3 ? weightDistObj.spendValue3 : 0 },
    { "Month": "APR", "value": weightDistObj.spendValue4 ? weightDistObj.spendValue4 : 0 },

    { "Month": "MAY", "value": weightDistObj.spendValue5 ? weightDistObj.spendValue5 : 0 },
    { "Month": "JUN", "value": weightDistObj.spendValue6 ? weightDistObj.spendValue6 : 0 },
    { "Month": "JUL", "value": weightDistObj.spendValue7 ? weightDistObj.spendValue7 : 0 },
    { "Month": "AUG", "value": weightDistObj.spendValue8 ? weightDistObj.spendValue8 : 0 },
    { "Month": "SEP", "value": weightDistObj.spendValue9 ? weightDistObj.spendValue9 : 0 },

    { "Month": "OCT", "value": weightDistObj.spendValue10 ? weightDistObj.spendValue10 : 0 },
    { "Month": "NOV", "value": weightDistObj.spendValue11 ? weightDistObj.spendValue11 : 0 },
    { "Month": "DEC", "value": weightDistObj.spendValue12 ? weightDistObj.spendValue12 : 0 }];


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
      categoryAxis.renderer.grid.template.location = 0;

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
      series.tooltipText = "Month: [bold]{categoryX}[/]  \n Net Charge: $[bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.strokeWidth = 0;

      series.tooltip.pointerOrientation = "vertical";

      series.columns.template.column.cornerRadiusTopLeft = 8;
      series.columns.template.column.cornerRadiusTopRight = 8;
      series.columns.template.column.fillOpacity = 1;
      series.columns.template.fontSize = 11;

      // on hover, make corner radiuses bigger
      let hoverState = series.columns.template.column.states.create("hover");
      hoverState.properties.cornerRadiusTopLeft = 8;
      hoverState.properties.cornerRadiusTopRight = 8;
      hoverState.properties.fillOpacity = 0.9;

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
      // Cursor
      chart.cursor = new am4charts.XYCursor();
      this.spendByMonthChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });



  }
  async volumeChartForming(weightDistObj: any) {
    await this.createSeriesFromAC2(weightDistObj);
  }
  async createSeriesFromAC2(wghtDistObj: any) {


    var chartData: any = [];
    chartData = [{ "weight": "LTR", "value": wghtDistObj.volWtValue13 ? wghtDistObj.volWtValue13 : '0' },
    { "weight": "1", "value": wghtDistObj.volWtValue1 ? wghtDistObj.volWtValue1 : '0' },
    { "weight": "2", "value": wghtDistObj.volWtValue2 ? wghtDistObj.volWtValue2 : '0' },
    { "weight": "3", "value": wghtDistObj.volWtValue3 ? wghtDistObj.volWtValue3 : '0' },
    { "weight": "4", "value": wghtDistObj.volWtValue4 ? wghtDistObj.volWtValue4 : '0' },
    { "weight": "5", "value": wghtDistObj.volWtValue5 ? wghtDistObj.volWtValue5 : '0' },
    { "weight": "6-10", "value": wghtDistObj.volWtValue6 ? wghtDistObj.volWtValue6 : '0' },
    { "weight": "11-20", "value": wghtDistObj.volWtValue7 ? wghtDistObj.volWtValue7 : '0' },
    { "weight": "21-30", "value": wghtDistObj.volWtValue8 ? wghtDistObj.volWtValue8 : '0' },
    { "weight": "31-50", "value": wghtDistObj.volWtValue9 ? wghtDistObj.volWtValue9 : '0' },
    { "weight": "51-70", "value": wghtDistObj.volWtValue10 ? wghtDistObj.volWtValue10 : '0' },
    { "weight": "71-150", "value": wghtDistObj.volWtValue11 ? wghtDistObj.volWtValue11 : '0' },
    { "weight": "151+", "value": wghtDistObj.volWtValue12 ? wghtDistObj.volWtValue12 : '0' }];
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
        indicator.background.fillOpacity = 1;
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
      series.columns.template.strokeOpacity = 0;

      let columnTemplate = series.columns.template;
      // columnTemplate.strokeWidth = 2;
      columnTemplate.stroke = am4core.color("#FFFFFF");      

      columnTemplate.adapter.add('fill', (_: any, target: any) => {
        return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
      });  
      columnTemplate.column.cornerRadiusTopLeft = 8;
      columnTemplate.column.cornerRadiusTopRight = 8;    

      if (this.themeoption == "dark") {
        categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
        valueAxis.title.fill = am4core.color("#fff");
        valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      }
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;
      this.volume_weightChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });

  } async bar_chart0(tempAC: any, event_type: string, weightchargetype: string) {
    await this.createSeriesFromAC_barUPS(tempAC, event_type, weightchargetype, "", "")

  } async createSeriesFromAC_barUPS(collection: any, event_type: string, weightchargetype: string, nameField: string, yField: string) {

    var tempObj;

    if (collection.length > 0) {

      if ((weightchargetype == "FRT" && event_type == "month") || (weightchargetype == "FRT" && event_type == "year")) {
        tempObj = collection[0];
      }
      else if (weightchargetype == "FRTWithAcc" && event_type == "month") {
        tempObj = collection[1];
      }
      else {

        tempObj = collection[12];
      }

    }


    if (tempObj != null && event_type == "month") {

      var chartData = [{
        "weight": "0-16\nOz",
        "value": tempObj.averageCostless16ounds ? tempObj.averageCostless16ounds : '0'
      },
      {
        "weight": "1",
        "value": tempObj.averageCostless1s ? tempObj.averageCostless1s : '0'
      },
      {
        "weight": "2",
        "value": tempObj.averageCostless2s ? tempObj.averageCostless2s : '0'
      },
      {
        "weight": "3",
        "value": tempObj.averageCostless3s ? tempObj.averageCostless3s : '0'
      },
      {
        "weight": "4",
        "value": tempObj.averageCostless4s ? tempObj.averageCostless4s : '0'
      },
      {
        "weight": "5",
        "value": tempObj.averageCostless5s ? tempObj.averageCostless5s : '0'
      },
      {
        "weight": "6-10",
        "value": tempObj.averageCostless10s ? tempObj.averageCostless10s : '0'
      },
      {
        "weight": "11-20",
        "value": tempObj.averageCostless20s ? tempObj.averageCostless20s : '0'
      },
      {
        "weight": "21-30",
        "value": tempObj.averageCostless30s ? tempObj.averageCostless30s : '0'
      },
      {
        "weight": "31-50",
        "value": tempObj.averageCostless50s ? tempObj.averageCostless50s : '0'
      },
      {
        "weight": "51-70",
        "value": tempObj.averageCostless70s ? tempObj.averageCostless16ounds : '0'
      },
      {
        "weight": "71-150",
        "value": tempObj.averageCostless150s ? tempObj.averageCostless150s : '0'
      },
      {
        "weight": "151+",
        "value": tempObj.averageCostless150plus ? tempObj.averageCostless150plus : '0'
      }
      ]

    }
    else {
      var chartData = [{
        "weight": "0-16\nOz",
        "value": tempObj.yearAverageCostless16ounds ? tempObj.yearAverageCostless16ounds : '0'
      },
      {
        "weight": "1",
        "value": tempObj.yearAverageCostless1s ? tempObj.yearAverageCostless1s : '0'
      },
      {
        "weight": "2",
        "value": tempObj.yearAverageCostless2s ? tempObj.yearAverageCostless2s : '0'
      },
      {
        "weight": "3",
        "value": tempObj.yearAverageCostless3s ? tempObj.yearAverageCostless3s : '0'
      },
      {
        "weight": "4",
        "value": tempObj.yearAverageCostless4s ? tempObj.yearAverageCostless4s : '0'
      },
      {
        "weight": "5",
        "value": tempObj.yearAverageCostless5s ? tempObj.yearAverageCostless5s : '0'
      },
      {
        "weight": "6-10",
        "value": tempObj.yearAverageCostless10s ? tempObj.yearAverageCostless10s : '0'
      },
      {
        "weight": "11-20",
        "value": tempObj.yearAverageCostless20s ? tempObj.yearAverageCostless20s : '0'
      },
      {
        "weight": "21-30",
        "value": tempObj.yearAverageCostless30s ? tempObj.yearAverageCostless30s : '0'
      },
      {
        "weight": "31-50",
        "value": tempObj.yearAverageCostless50s ? tempObj.yearAverageCostless50s : '0'
      },
      {
        "weight": "51-70",
        "value": tempObj.yearAverageCostless70s ? tempObj.yearAverageCostless70s : '0'
      },
      {
        "weight": "71-150",
        "value": tempObj.yearAverageCostless150s ? tempObj.yearAverageCostless150s : '0'
      },
      {
        "weight": "151+",
        "value": tempObj.yearAverageCostless150plus ? tempObj.yearAverageCostless150plus : '0'
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
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = .8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.fontSize = 11;
      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add("fill", function (fill: any, target: any) {
        return chart.colors.getIndex(target.dataItem.index);
      })

      columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
        return chart.colors.getIndex(target.dataItem.index);
      })
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
  async bar_chart1(domainName: string, tempAC: any, event_type: string, weightchargetype: string) {
    await this.createSeriesFromAC_bar31(domainName, tempAC, event_type, weightchargetype);
  }
  async createSeriesFromAC_bar31(domainName: string, collection: any, event_type: string, weightchargetype: string) {


    if (collection.length > 0)

      var tempObj;


    if ((weightchargetype == "FRT" && event_type == "month") || (weightchargetype == "FRT" && event_type == "year")) {
      tempObj = collection[0];
    }
    else if (weightchargetype == "FRTWithAcc" && event_type == "month") {
      tempObj = collection[1];
    }
    else {

      tempObj = collection[12];
    }


    if (tempObj != null && event_type == "month") {
      var chartData = [{
        "weight": "0-16\nOz",
        "value": tempObj.less16ounds ? tempObj.less16ounds : '0'
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
      var chartData = [{
        "weight": "0-16\nOz",
        "value": tempObj.yearless16ounds ? tempObj.yearless16ounds : '0'
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
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "weight";
      series.name = "Weight";
      series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
      series.columns.template.fillOpacity = .8;

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;

      columnTemplate.stroke = am4core.color("#FFFFFF");

      columnTemplate.adapter.add("fill", function (fill: any, target: any) {
        return chart.colors.getIndex(target.dataItem.index);
      })

      columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
        return chart.colors.getIndex(target.dataItem.index);
      })
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
  } async bar_chart2(domainName: string, tempAC: any, event_type: string, weightchargetype: string) {
    await this.createSeriesFromAC2123(domainName, tempAC, event_type, weightchargetype, "Bar")
  }
  async createSeriesFromAC2123(domainName: string, collection: any, event_type: string, weightchargetype: string, seriesName: string) {

    if (collection.length > 0)

      var tempObj;

    if ((weightchargetype == "FRT" && event_type == "month") || (weightchargetype == "FRT" && event_type == "year")) {
      tempObj = collection[0];
    }
    else if (weightchargetype == "FRTWithAcc" && event_type == "month") {
      tempObj = collection[1];
    }
    else {

      tempObj = collection[12];
    }


    if (tempObj != null && event_type == "month") {

      var chartData = [{
        "weight": "0-16\nOz",
        "value": tempObj.volumeless16ounds ? tempObj.volumeless16ounds : '0'
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
      var chartData = [{
        "weight": "0-16\nOz",
        "value": tempObj.yearVolumeless16ounds ? tempObj.yearVolumeless16ounds : '0'
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
        indicator.background.fillOpacity = 1;
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
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip


      categoryAxis.dataFields.category = "weight";
      categoryAxis.renderer.labels.template.rotation = 0;
      categoryAxis.renderer.labels.template.hideOversized = false;
      categoryAxis.renderer.minGridDistance = 20;
      categoryAxis.renderer.labels.template.verticalCenter = "middle";

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

      let columnTemplate = series.columns.template;
      columnTemplate.strokeWidth = 2;
      columnTemplate.strokeOpacity = 1;
      columnTemplate.stroke = am4core.color("#FFFFFF");
      columnTemplate.column.cornerRadiusTopLeft = 8;
      columnTemplate.column.cornerRadiusTopRight = 8;
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
  commonACSHP_FRT: any[] = [];
  commonACSHP_FRT_ACC: any[] = [];

  async Acc_No(tempAC: any) {
    await this.createSeriesFromAC21123(tempAC, "Bar")

  }
  async createSeriesFromAC21123(collection: any, seriesName: string) {

    if (this.weightchargetype == null)
      this.weightchargetype = "FRTWithAcc"
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
      columnTemplate.column.cornerRadiusTopLeft = 8;
      columnTemplate.column.cornerRadiusTopRight = 8;
      series.columns.template.adapter.add('fill', (_: any) => {return am4core.color("#1AA7E8"); });
      this.acc_noChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });

  }
  urlParamArr = [];
  async excel_clickHandler(event: any) {
    var urlParam: any = {};
    var monthVal = await this.moreviewWeightFormGroup.get('month')?.value;
    var clickedYear = await this.moreviewWeightFormGroup.get('year')?.value;
    if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }
    var clientName = this.moreviewWeightFormGroup.get(["t002ClientProfile", "clientName"])?.value;
    var clientId = await this.moreviewWeightFormGroup.get('clientId')?.value;
    var weightchargetype = await this.dashBoardSHP.get('chargetypevalue')?.value;
    urlParam['t002'] = await this.moreviewWeightFormGroup.get('t002ClientProfile')?.value;
    this.moreviewWeightFormGroup.patchValue({
      t002ClientProfileobj: {
        "clientId": this.userProfifleFedex.clientId,
        "clientName": this.userProfifleFedex.clientName,
        "userName": this.userProfifleFedex.userName,
        "password": this.userProfifleFedex.password,
        "siteUserName": this.userProfifleFedex.siteUserName,
        'sitePassword': this.userProfifleFedex.sitePassword,
        "address": this.userProfifleFedex.address,
        "contactNo": this.userProfifleFedex.contactNo,
        "comments": this.userProfifleFedex.comments,
        "endDate": this.userProfifleFedex.endDate,
        "startDate": this.userProfifleFedex.startDate,
        "status": this.userProfifleFedex.status,
        "auditStatus": this.userProfifleFedex.auditStatus,
        "contractStatus": this.userProfifleFedex.contractStatus,
        "email": this.userProfifleFedex.email,
        "userLogo": this.userProfifleFedex.userLogo,
        "customerType": this.userProfifleFedex.customerType,
        "dataSource": this.userProfifleFedex.dataSource,
        "dataLoadedBy": this.userProfifleFedex.dataLoadedBy,
        "filestartdate": this.userProfifleFedex.filestartdate,
        "fileenddate": this.userProfifleFedex.fileenddate,
        "dateasof": this.userProfifleFedex.dateasof,
        "currentDate": this.userProfifleFedex.currentDate,
        "currentYear": this.userProfifleFedex.currentYear,
        "currentMonth": this.userProfifleFedex.currentMonth,
        "startYear": this.userProfifleFedex.startYear,
        "createdBy": this.userProfifleFedex.createdBy,
        "createdTs": this.userProfifleFedex.createdTs,
        "updatedTs": this.userProfifleFedex.updatedTs,
        "adminFlag": this.userProfifleFedex.adminFlag,
        "filestartdate1": this.userProfifleFedex.filestartdate1,
        "fileenddate1": this.userProfifleFedex.fileenddate1,
        "trackingcount": this.userProfifleFedex.trackingcount,
        "logostatus": this.userProfifleFedex.logostatus,
        "noofdaystoactive": this.userProfifleFedex.noofdaystoactive,
        "noofdaysinactive": this.userProfifleFedex.noofdaysinactive,
        "ipaddress": this.userProfifleFedex.ipaddress,
        "loginFlag": this.userProfifleFedex.loginFlag,
        "contractSavingFlag": this.userProfifleFedex.contractSavingFlag,
        "clientProfileName": this.userProfifleFedex.clientProfileName,
        "carrierType": this.userProfifleFedex.carrierType,
        "t002AccountDet": this.userProfifleFedex.t002AccountDet,
        "customers": this.userProfifleFedex.customers
      }
    });


    var designFileName = "Wgt_Distribution_Report";
    var removeSplChar = this.moreviewWeightFormGroup.get(["t002ClientProfile", "clientName"])?.value;
    var clientName = removeSplChar.replace(/[^a-zA-Z0-9 ]/g, "");

    var currentDate = new Date();

    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
    this.moreviewWeightFormGroup.get('createdDate')?.setValue(currentDate);
    this.moreviewWeightFormGroup.get('requesteddttm')?.setValue(currentDate);
    this.moreviewWeightFormGroup.get('reportName')?.setValue("Wgt_Distribution_Report");
    this.moreviewWeightFormGroup.get('reportType')?.setValue("Wgt Distribution Report");
    this.moreviewWeightFormGroup.get('chargeType')?.setValue(this.chargeType);
    this.moreviewWeightFormGroup.get('chargeDesc')?.setValue("");
    this.moreviewWeightFormGroup.get('chargeGroup')?.setValue("");
    this.moreviewWeightFormGroup.get('designFileName')?.setValue(designFileName);
    this.moreviewWeightFormGroup.get('reportFormat')?.setValue("excel");
    this.moreviewWeightFormGroup.get('accNo')?.setValue(this.accountNumberVal);
    this.moreviewWeightFormGroup.get('clientName')?.setValue(clientName);
    this.moreviewWeightFormGroup.get('fromDate')?.setValue(clickedYear);
    this.moreviewWeightFormGroup.get('toDate')?.setValue(clickedMonth);
    this.moreviewWeightFormGroup.get('loginId')?.setValue(0);
    this.moreviewWeightFormGroup.get('modulename')?.setValue("Weight_Distribution_Report");
    this.moreviewWeightFormGroup.get('status')?.setValue("IN QUEUE")

    this.httpfedexService.runReport(this.moreviewWeightFormGroup.value)?.subscribe(
      result => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error => {

      });

  }
  saveOrUpdateReportLogResultFedex(result: any) {

    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.httpfedexService._setIntervalFedEx(this.reportsFormGroup.value);

    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");

  }
  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      panelClass: this.panelClass,
      data: { pageValue: alertVal }
    });
  } ngOnDestroy() {
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
  toAccCount: any;
  fromAccCount: any;
  t201AccresultAC: any;
  async next_id_clickHandler(event: any) {
    var tempto = this.toAccCount;
    tempto = tempto + 5;

    if (tempto < this.t201AccresultAC.length) {
      this.fromAccCount = this.toAccCount;
      this.toAccCount = this.toAccCount + 5;
    }
    if (tempto > this.t201AccresultAC.length) {
      this.fromAccCount = this.toAccCount;
      this.toAccCount += (this.t201AccresultAC.length - this.toAccCount);
      this.next_id_visible = false;
    }
    if (tempto == this.t201AccresultAC.length) {
      this.fromAccCount = this.toAccCount;
      this.toAccCount = tempto;
      this.next_id_visible = false;
    }
    this.previous_id_visible = true;
    this.first_id_visible = true;
    this.spendAccNumberChart(this.t201AccresultAC);
  }

  async first_id_clickHandler(event: any) {
    // TODO Auto-generated method stub
    this.first_id_visible = false;
    this.previous_id_visible = false;
    this.next_id_visible = true;
    this.fromAccCount = 0;
    this.toAccCount = 5;
    this.spendAccNumberChart(this.t201AccresultAC);
  }
  async previous_id_clickHandler(event: any) {
    this.toAccCount = this.fromAccCount;
    this.fromAccCount = this.fromAccCount - 5;
    if (this.fromAccCount == 0) {
      this.previous_id_visible = false;
      this.first_id_visible = false;
    }
    this.next_id_visible = true;
    this.spendAccNumberChart(this.t201AccresultAC);
  }
}
