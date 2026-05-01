import { Component, Inject, Optional, OnInit, NgZone, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, UntypedFormBuilder } from '@angular/forms';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { DatePipe } from '@angular/common';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
am4core.options.commercialLicense = true;
@Component({
  selector: 'app-fedex-more-service-popup',
  templateUrl: './fedex-more-service-popup.component.html',
  standalone: false
})
export class FedexMoreServicePopupComponent implements OnInit {
  private pie_chartChart!: am4charts.PieChart;
  private pie_AccessChart!: am4charts.PieChart;
  private pie_AllchargesChart!: am4charts.PieChart;
  dashBoardSHP: FormGroup;
  moreviewServiceFormGroup: FormGroup;
  fromPage;
  invoiceMonth;
  invoiceyear;
  monthFlag;
  accountNumber;
  userProfifleFedex;
  themeoption;
  yearData_title: any;
  panelClass;
  monthData_title: any;
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') }),
  });
  constructor(public dialogRef: MatDialogRef<FedexMoreServicePopupComponent>, private httpfedexService: HttpfedexService, private datePipe: DatePipe, private dialog: MatDialog, private zone: NgZone,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('SHP_FRT+ACC')
    });
    this.fromPage = data.popupValue;
    if (this.fromPage.month == null) { this.invoiceMonth = '0'; } //9126
    else { this.invoiceMonth = this.fromPage.month; }
    this.invoiceyear = this.fromPage.year;
    this.monthFlag = this.fromPage.monthFlag;
    this.accountNumber = this.fromPage.accountNumber;
    this.userProfifleFedex = this.fromPage.t002ClientProfile;
    this.themeoption = this.fromPage.themeoption;
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    if (this.accountNumber == "ALL") {
      var accountNumber = null;
    } else {
      var accountNumber = this.accountNumber;
    }
    this.moreviewServiceFormGroup = new FormGroup({
      accountNumber: new FormControl(accountNumber),
      month: new FormControl(this.invoiceMonth),
      monthFlag: new FormControl(this.monthFlag),
      year: new FormControl(this.invoiceyear),
      t002ClientProfile: new FormControl({
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
        t002AccountDet: [''],
        customers: new FormControl('')
      })
    })
  }
  closeDialog() {
    this.dialogRef.close(true);
  }
  ngOnInit() {
    this.bindingTitle();
    this.moreviewServiceFormGroup.patchValue({
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

    this.fetchIndividualSerMoreView();
  }
  async bindingTitle() {
    this.yearData_title = this.moreviewServiceFormGroup.get('year')?.value;
    var monthData = this.moreviewServiceFormGroup.get('month')?.value;
    if (monthData == '0') {
      this.monthData_title = "";
    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      this.monthData_title = monthArray[monthData];
    }

  }
  async fetchIndividualSerMoreView() {
    this.httpfedexService.fetchIndividualSerMoreView(this.moreviewServiceFormGroup.value).subscribe(
      result => {
        var moreserviceAC: any = result;

        var moreserviceFRTAC = [];
        var moreserviceFRTWihtAccAC = [];
        var moreserviceFRTWihtAccCombinedAC = [];
        if (moreserviceAC == null || moreserviceAC.length == 0) {
          return;
        }
        for (var loop = 0; loop < moreserviceAC.length; loop++) {
          var t202chargeDesc: any = [];
          t202chargeDesc = moreserviceAC[loop];

          if (t202chargeDesc.chargeType == "FRT") {
            moreserviceFRTAC.push(t202chargeDesc);
          }
          else if (t202chargeDesc.chargeType == "FRTWithAcc") {
            moreserviceFRTWihtAccAC.push(t202chargeDesc);
          }
          else if (t202chargeDesc.chargeType == "FRTWithAccCombined") {
            moreserviceFRTWihtAccCombinedAC.push(t202chargeDesc);
          }

        }

        this.individualService(moreserviceFRTAC);
        this.individualServiceFRTWithAcc(moreserviceFRTWihtAccAC);
        // this.individualServiceFRTWithAccCombined(moreserviceFRTWihtAccCombinedAC);

      },
      error => {
        console.log(' error', error);
      })
  }
  indivServAC: any = [];
  async individualService(t202chargeDescAC: any) {
    this.indivServAC = [];
    var accNumberFlag = this.moreviewServiceFormGroup.get('accountNumber')?.value;
    var monthFlag = this.moreviewServiceFormGroup.get('monthFlag')?.value;
    if (t202chargeDescAC != null && t202chargeDescAC.length != 0) {
      for (var loop = 0; loop < t202chargeDescAC.length; loop++) {
        if (accNumberFlag == null) {
          if (monthFlag == "Y") {
            this.indivServAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription //9126
              , chargeDescValue: (t202chargeDescAC[loop]).grandYearTotalForServiceLevel
            });
          }
          else {
            this.indivServAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandYearTotalForServiceLevel
            });
          }
        }
        else {
          if (monthFlag == "Y") {
            this.indivServAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandAccountLevelTotalForServiceLevel
            });
          }
          else {
            this.indivServAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandAccountLevelTotalForServiceLevel
            });
          }
        }

      }
    }
    this.pie_chart1(this.indivServAC);
  }
  async pie_chart1(tempAC: any) { await this.createSeriesFromAC_for_pie(tempAC); }
  async pie_chart2(tempAC: any) { await this.createSeriesFromAC_for_pie_Access(tempAC) }
  async createSeriesFromAC_for_pie(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        var nameFiled: String = pie_Obj.chargeDescription;
        var yField: String = pie_Obj.chargeDescValue;
        chartData.push({ name: nameFiled, value: yField })

      }
    }
    am4core.options.commercialLicense = true;

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
  async createSeriesFromAC_for_pie_Access(collection: any) {
    var chartData: any = [];
    if (collection.length > 0) {
      for (var i = 0; i < collection.length; i++) {
        var pie_Obj = collection[i];
        var nameFiled: String = pie_Obj.chargeDescription;

        var yField: String = pie_Obj.chargeDescValue;

        chartData.push({ name: nameFiled, value: yField })

      }
    }
    am4core.options.commercialLicense = true;

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
      series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
      series.slices.template.strokeOpacity = 1;
      series.ticks.template.disabled = true;
      series.fontSize = 6;
      series.labels.template.disabled = true;
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
      this.pie_AccessChart = chart;
      if (chartData.length > 0) {
        hideIndicator();
      }
    });
  }
  indivServWithAccAC: any = [];
  async individualServiceFRTWithAcc(t202chargeDescAC: any) {
    this.indivServWithAccAC = [];
    var accNumberFlag = this.moreviewServiceFormGroup.get('accountNumber')?.value;
    var monthFlag = this.moreviewServiceFormGroup.get('monthFlag')?.value;
    if (t202chargeDescAC != null && t202chargeDescAC.length != 0) {
      for (var loop = 0; loop < t202chargeDescAC.length; loop++) {
        if (accNumberFlag == null) {
          if (monthFlag == "Y") {
            this.indivServWithAccAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandYearTotalForServiceLevel
            });
          }
          else {
            this.indivServWithAccAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandYearTotalForServiceLevel
            });
          }
        }
        else {
          if (monthFlag == "Y") {
            this.indivServWithAccAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandAccountLevelTotalForServiceLevel
            });
          }
          else {
            this.indivServWithAccAC.push({
              chargeDescription: (t202chargeDescAC[loop]).chargeDescription
              , chargeDescValue: (t202chargeDescAC[loop]).grandAccountLevelTotalForServiceLevel
            });
          }
        }

      }
    }
    this.pie_chart2(this.indivServWithAccAC);
  }
  accountNumberVal: any;
  designFileName: any;
  chargeGroup: any;
  async repostExcelDownload(event: any) {
    var urlParam: any = {};
    var urlParamArr = [];
    var monthVal = this.moreviewServiceFormGroup.get('month')?.value;
    var clickedYear = this.moreviewServiceFormGroup.get('year')?.value;
    // var chargeType=this.moreviewServiceFormGroup.get('chargeType').value;
    if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }

    var clientId = this.fromPage.t002ClientProfile.clientId;
    var weightchargetype = this.dashBoardSHP.get('chargetypevalue')?.value;

    if (event == "Top10FreightCharges") {
      urlParam['reportName'] = "Top10FreightCharges";
      urlParam['reportType'] = "Top10FreightCharges";

    }
    else if (event == "Top10AccCharges") {
      urlParam['reportName'] = "Top10AccCharges";
      urlParam['reportType'] = "Top10AccCharges";

    }
    else if (event == "Top10FRT+ACCCharges") {
      urlParam['reportName'] = "Top10FRT+ACCCharges";
      urlParam['reportType'] = "Top10FRT+ACCCharges";

    }



    var currentDate = new Date();

    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;



    urlParam['reportFormat'] = "excel";
    if (this.accountNumber == "ALL") {
      this.accountNumberVal = "";
    } else { this.accountNumberVal = this.accountNumber }

    urlParam['accNo'] = this.accountNumberVal;
    urlParam['clientName'] = (this.userProfifleFedex.clientName).replace(/[^a-zA-Z0-9 ]/g, "");
    urlParam['clientId'] = this.userProfifleFedex.clientId;
    urlParam['fromDate'] = clickedYear;
    urlParam['toDate'] = clickedMonth.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = "Charge_Desc_Report";
    urlParam['status'] = "IN QUEUE";
    urlParam['month'] = clickedMonth.toString();
    urlParam['year'] = clickedYear;
    urlParam['desc'] = "";
    urlParam['grp'] = "";
    urlParam['chargeType'] = "";
    urlParam['chargeDesc'] = "";
    urlParam['chargeGroup'] = "";
    urlParam['t002ClientProfileobj'] = this.moreviewServiceFormGroup.get('t002ClientProfile')?.value;
    urlParamArr.push(urlParam);
    this.httpfedexService.runReport(urlParam).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
      });
  }

  async saveOrUpdateReportLogResult(result: any) {

    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.httpfedexService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");


  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
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
