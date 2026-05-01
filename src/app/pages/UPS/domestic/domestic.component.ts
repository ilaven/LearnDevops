import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import * as am4core from "@amcharts/amcharts4/core";

import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import am4geodata_region_usa_akLow from "@amcharts/amcharts4-geodata/region/usa/akLow";
import am4geodata_region_usa_alLow from "@amcharts/amcharts4-geodata/region/usa/alLow";
import am4geodata_region_usa_arLow from "@amcharts/amcharts4-geodata/region/usa/arLow";
import am4geodata_region_usa_azLow from "@amcharts/amcharts4-geodata/region/usa/azLow";
import am4geodata_region_usa_caLow from "@amcharts/amcharts4-geodata/region/usa/caLow";
import am4geodata_region_usa_coLow from "@amcharts/amcharts4-geodata/region/usa/coLow";
import am4geodata_region_usa_ctLow from "@amcharts/amcharts4-geodata/region/usa/ctLow";
import am4geodata_region_usa_deLow from "@amcharts/amcharts4-geodata/region/usa/deLow";
import am4geodata_region_usa_flLow from "@amcharts/amcharts4-geodata/region/usa/flLow";
import am4geodata_region_usa_gaLow from "@amcharts/amcharts4-geodata/region/usa/gaLow";
import am4geodata_region_usa_hiLow from "@amcharts/amcharts4-geodata/region/usa/hiLow";
import am4geodata_region_usa_iaLow from "@amcharts/amcharts4-geodata/region/usa/iaLow";
import am4geodata_region_usa_idLow from "@amcharts/amcharts4-geodata/region/usa/idLow";
import am4geodata_region_usa_ilLow from "@amcharts/amcharts4-geodata/region/usa/ilLow";
import am4geodata_region_usa_inLow from "@amcharts/amcharts4-geodata/region/usa/inLow";
import am4geodata_region_usa_ksLow from "@amcharts/amcharts4-geodata/region/usa/ksLow";
import am4geodata_region_usa_kyLow from "@amcharts/amcharts4-geodata/region/usa/kyLow";
import am4geodata_region_usa_laLow from "@amcharts/amcharts4-geodata/region/usa/laLow";
import am4geodata_region_usa_maLow from "@amcharts/amcharts4-geodata/region/usa/maLow";
import am4geodata_region_usa_mdLow from "@amcharts/amcharts4-geodata/region/usa/mdLow";
import am4geodata_region_usa_meLow from "@amcharts/amcharts4-geodata/region/usa/meLow";
import am4geodata_region_usa_miLow from "@amcharts/amcharts4-geodata/region/usa/miLow";
import am4geodata_region_usa_mnLow from "@amcharts/amcharts4-geodata/region/usa/mnLow";
import am4geodata_region_usa_moLow from "@amcharts/amcharts4-geodata/region/usa/moLow";
import am4geodata_region_usa_msLow from "@amcharts/amcharts4-geodata/region/usa/msLow";
import am4geodata_region_usa_mtLow from "@amcharts/amcharts4-geodata/region/usa/mtLow";
import am4geodata_region_usa_ncLow from "@amcharts/amcharts4-geodata/region/usa/ncLow";
import am4geodata_region_usa_ndLow from "@amcharts/amcharts4-geodata/region/usa/ndLow";
import am4geodata_region_usa_neLow from "@amcharts/amcharts4-geodata/region/usa/neLow";
import am4geodata_region_usa_nhLow from "@amcharts/amcharts4-geodata/region/usa/nhLow";
import am4geodata_region_usa_njLow from "@amcharts/amcharts4-geodata/region/usa/njLow";
import am4geodata_region_usa_nmLow from "@amcharts/amcharts4-geodata/region/usa/nmLow";
import am4geodata_region_usa_nvLow from "@amcharts/amcharts4-geodata/region/usa/nvLow";
import am4geodata_region_usa_nyLow from "@amcharts/amcharts4-geodata/region/usa/nyLow";
import am4geodata_region_usa_ohLow from "@amcharts/amcharts4-geodata/region/usa/ohLow";
import am4geodata_region_usa_okLow from "@amcharts/amcharts4-geodata/region/usa/okLow";
import am4geodata_region_usa_orLow from "@amcharts/amcharts4-geodata/region/usa/orLow";
import am4geodata_region_usa_paLow from "@amcharts/amcharts4-geodata/region/usa/paLow";
import am4geodata_region_usa_riLow from "@amcharts/amcharts4-geodata/region/usa/riLow";
import am4geodata_region_usa_scLow from "@amcharts/amcharts4-geodata/region/usa/scLow";
import am4geodata_region_usa_sdLow from "@amcharts/amcharts4-geodata/region/usa/sdLow";
import am4geodata_region_usa_tnLow from "@amcharts/amcharts4-geodata/region/usa/tnLow";
import am4geodata_region_usa_txLow from "@amcharts/amcharts4-geodata/region/usa/txLow";
import am4geodata_region_usa_utLow from "@amcharts/amcharts4-geodata/region/usa/utLow";
import am4geodata_region_usa_vaLow from "@amcharts/amcharts4-geodata/region/usa/vaLow";
import am4geodata_region_usa_vtLow from "@amcharts/amcharts4-geodata/region/usa/vtLow";
import am4geodata_region_usa_waLow from "@amcharts/amcharts4-geodata/region/usa/waLow";
import am4geodata_region_usa_wiLow from "@amcharts/amcharts4-geodata/region/usa/wiLow";
import am4geodata_region_usa_wvLow from "@amcharts/amcharts4-geodata/region/usa/wvLow";
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap/offcanvas';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-ups-domestic',
  templateUrl: './domestic.component.html',
  styleUrls: ['./domestic.component.scss'],
  standalone: false
})
export class UpsDomesticComponent {
  attribute: any;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
  });
  loginId: Number = 123;
  clientType = signal<any>('');
  hashMapObj: any = new Map();
  panelClass: any;
  themeOption: any;
  randomNumber: any;
  showTitleData = signal<boolean>(true);
  apiControllerFormGroup: FormGroup;
  selectYear: any = [];
  filterLabel: any = [];
  ServicefilterLabel: any = [];
  searchActive = true;
  userProfifleData: any;
  constructor(private offcanvasService: NgbOffcanvas, private commonService: CommonService, private loaderService: LoaderService,
    private httpClientService: HttpClientService,
    private dialog: MatDialog, private datePipe: DatePipe, private router: Router,
    private cookiesService: CookiesService, private switchProj: SwitchProjectService,) {
    this.cookiesService.checkForClientName();
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
      if (this.clientType() == "OnTrac" || this.clientType() == "Dhl" || this.clientType() == "USPS") {
        this.router.navigate(['/dashboard/dashboard']);
      }
    });
    this.apiControllerFormGroup = new FormGroup({
      year: new FormControl(''),
      client_id: new FormControl(''),
      Client_id: new FormControl(''),
      clientname: new FormControl(''),
      filter: new FormControl('SHP'),
      servicefilter: new FormControl('ALL'),
      county: new FormControl(null),
      state: new FormControl(null),
      ipaddress: new FormControl(''),
      city: new FormControl(''),
      region: new FormControl(''),
      country: new FormControl(''),
      location: new FormControl(''),
      loginclientName: new FormControl(''),
      clientNameselected: new FormControl(''),
      type: new FormControl('Recipient'),
      t001ClientProfile: new FormGroup({
        action: new FormControl(''), activeFlag: new FormControl(''), address: new FormControl(''), asonDate: new FormControl(''), carrierType: new FormControl(''), changePassword: new FormControl(''),
        charges: new FormControl(''), clientId: new FormControl(''), clientName: new FormControl(''), clientPassword: new FormControl(''), clientdbstatus: new FormControl(''),
        comments: new FormControl(''), contactNo: new FormControl(''), contractanalysisstatus: new FormControl(''), createdBy: new FormControl(''),
        createdTs: new FormControl(''), currentDate: new FormControl(''), currentstatus: new FormControl(''), customertype: new FormControl(''), dataFileDestDir: new FormControl(''),
        dataFileSourceDir: new FormControl(''), dataLoadBy: new FormControl(''), dataSource: new FormControl(''), dataasof: new FormControl(''),
        daystoweb: new FormControl(''), email: new FormControl(''), employeeTempTotal: new FormControl(''), employerTempTotal: new FormControl(''), errorString: new FormControl(''),
        fetchPhoto: new FormControl(''), fileEndDate: new FormControl(''), fileStartDate: new FormControl(''), getImageInd: new FormControl(''), image: new FormControl(''),
        ipaddress: new FormControl(''), isSelected: new FormControl(''), isdeletedbyowner: new FormControl(''), lazyLoad: new FormControl(''), loginclientId: new FormControl(''),
        logostatus: new FormControl(''), menucount: new FormControl(''), newPassword: new FormControl(''), nextlevelflag: new FormControl(''), noofdaysinactive: new FormControl(''),
        noofdaystoactive: new FormControl(''), password: new FormControl(''), payInWords: new FormControl(''), repname: new FormControl(''), resetPassword: new FormControl(''), startDate: new FormControl(''),
        status: new FormControl(''), t301accountAC: new FormControl(''), t302planAC: new FormControl(''), tablename: new FormControl(''), trackingcount: new FormControl(''), updatedTs: new FormControl(''),
        updatedby: new FormControl(''), user_name: new FormControl(''), year: new FormControl('')
      })
    })
  }
  ngOnInit(): void {
    this.loaderService.show();
    this.openLoading();
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.showTitleData.set(true);
    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }

    this.filterLabel = [
      { value: "SHP", label: "Shipments-Number of Packages" },
      { value: "FRT", label: "Freight Charges Only" },
      { value: "ACC", label: "Freight Charges with Accessorials" },
      { value: "BW", label: "Total Billed Weight" }
    ];
    this.ServicefilterLabel = [
      { value: "ALL", label: "ALL" },
      { value: "NextDayAirAM", label: "Next Day Air A.M." },
      { value: "NextDayAir", label: "Next Day Air" },
      { value: "NextDayAirSaver", label: "Next Day Air Saver" },
      { value: "2Day", label: "2 Day" },
      { value: "3Day", label: "3 Day" },
      { value: "GroundCommercial", label: "Ground Commercial" },
      { value: "GroundResidential", label: "Ground Residential" },
      { value: "GroundHunderedWeight", label: "Ground Hundredweight" },
      { value: "GroundSaver", label: "Ground Saver" }];
    this.getUser();
    this.init();
    setTimeout(() => {
      this.searchActive = false;
    }, 15000);
  }
  isLoading = true;
  openLoading() {
    this.isLoading = true;
    this.loaderService.show();
  }
  closeLoading() {
    this.isLoading = false;
    this.loaderService.hide();
  }
  async init() {
    await this.hashMapObj.set("1", "JAN");
    await this.hashMapObj.set("2", "FEB");
    await this.hashMapObj.set("3", "MAR");
    await this.hashMapObj.set("4", "APR");
    await this.hashMapObj.set("5", "MAY");
    await this.hashMapObj.set("6", "JUN");
    await this.hashMapObj.set("7", "JUL");
    await this.hashMapObj.set("8", "AUG");
    await this.hashMapObj.set("9", "SEP");
    await this.hashMapObj.set("10", "OCT");
    await this.hashMapObj.set("11", "NOV");
    await this.hashMapObj.set("12", "DEC");
  }
  userProfifle: any;
  clientID: any;
  clientName: any;
  themeoption: any;
  level = "F";
  t004filteritem_type: any;
  t004filteryear_type: any;
  t004filteritem_Avg_type: any;
  t004filteryear_Avg_type: any;
  description_id_text: any;
  desc_detail_visible: any;
  desc_detail_text: any;
  myData1: any;
  t004filteryear: any = {};
  totalus_value: any;
  countryTotal: any;
  stateTotal: any;
  countyTotal: any;
  async getUser() {
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = this.userProfifle.clientId;
    this.clientName = this.userProfifle.clientName;
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    var toData = new Date();
    var Data = new Date();
    var fromData = new Date();
    fromData = new Date(fromData.setMonth(fromData.getMonth() - 1));
    var toDate = this.datePipe.transform(toData, "yyyy-MM-dd");
    var fromDate = this.datePipe.transform(fromData, "yyyy-MM-dd");
    await this.apiControllerFormGroup.patchValue({
      t001ClientProfile: {
        "action": this.userProfifle.action,
        "activeFlag": this.userProfifle.activeFlag,
        "address": this.userProfifle.address,
        "asonDate": this.userProfifle.asonDate,
        "carrierType": this.userProfifle.carrierType,
        "changePassword": this.userProfifle.changePassword,
        "charges": this.userProfifle.charges,
        "clientId": this.userProfifle.clientId,
        "clientName": this.userProfifle.clientName,
        "clientPassword": this.userProfifle.clientPassword,
        "clientdbstatus": this.userProfifle.clientdbstatus,
        "comments": this.userProfifle.comments,
        "contactNo": this.userProfifle.contactNo,
        "contractanalysisstatus": this.userProfifle.contractanalysisstatus,
        "createdBy": this.userProfifle.createdBy,
        "createdTs": this.userProfifle.createdTs,
        "currentDate": this.userProfifle.currentDate,
        "currentstatus": this.userProfifle.currentstatus,
        "customertype": this.userProfifle.customertype,
        "dataFileDestDir": this.userProfifle.dataFileDestDir,
        "dataFileSourceDir": this.userProfifle.dataFileSourceDir,
        "dataLoadBy": this.userProfifle.dataLoadBy,
        "dataSource": this.userProfifle.dataSource,
        "dataasof": this.userProfifle.dataasof,
        "daystoweb": this.userProfifle.daystoweb,
        "email": this.userProfifle.email,
        "employeeTempTotal": this.userProfifle.employeeTempTotal,
        "employerTempTotal": this.userProfifle.employerTempTotal,
        "errorString": this.userProfifle.errorString,
        "fetchPhoto": this.userProfifle.fetchPhoto,
        "fileEndDate": this.userProfifle.fileEndDate,
        "fileStartDate": this.userProfifle.fileStartDate,
        "getImageInd": this.userProfifle.getImageInd,
        "image": this.userProfifle.image,
        "ipaddress": this.userProfifle.ipaddress,
        "isSelected": this.userProfifle.isSelected,
        "isdeletedbyowner": this.userProfifle.isdeletedbyowner,
        "lazyLoad": this.userProfifle.lazyLoad,
        "loginclientId": this.userProfifle.loginclientId,
        "logostatus": this.userProfifle.logostatus,
        "menucount": this.userProfifle.menucount,
        "newPassword": this.userProfifle.newPassword,
        "nextlevelflag": this.userProfifle.nextlevelflag,
        "noofdaysinactive": this.userProfifle.noofdaysinactive,
        "noofdaystoactive": this.userProfifle.noofdaystoactive,
        "password": this.userProfifle.password,
        "payInWords": this.userProfifle.payInWords,
        "repname": this.userProfifle.repname,
        "resetPassword": this.userProfifle.resetPassword,
        "startDate": this.userProfifle.startDate,
        "status": this.userProfifle.status,
        "t301accountAC": this.userProfifle.t301accountAC,
        "t302planAC": this.userProfifle.t302planAC,
        "tablename": this.userProfifle.tablename,
        "trackingcount": this.userProfifle.trackingcount,
        "updatedTs": this.userProfifle.updatedTs,
        "updatedby": this.userProfifle.updatedby,
        "user_name": this.userProfifle.user_name,
        "year": this.userProfifle.year
      }
    });
    var date = new Date();
    if (date.getMonth() == 0 || (date.getMonth() == 1 && date.getDate() <= 5)) {
      var yearData = await new Date().getFullYear() - 1;
    }
    else {
      var yearData = await new Date().getFullYear();
    }
    await this.apiControllerFormGroup.get('clientname')?.setValue(this.clientName);
    await this.apiControllerFormGroup.get('client_id')?.setValue(this.clientID);
    await this.apiControllerFormGroup.get('Client_id')?.setValue(this.clientID);
    await this.apiControllerFormGroup.get('year')?.setValue(yearData);
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    await this.creation_Handler();
    this.closeLoading();
  }
  async creation_Handler() {
    this.level = "F";
    this.t004filteritem_type = this.apiControllerFormGroup.get('filter')?.value;
    this.t004filteryear_type = this.apiControllerFormGroup.get('year')?.value;
    this.t004filteritem_Avg_type = this.apiControllerFormGroup.get('filter')?.value;
    this.t004filteryear_Avg_type = this.apiControllerFormGroup.get('year')?.value;
    this.description_id_text = "Click On Any State to Zoom In";
    this.desc_detail_visible = true;
    var cmbyear = this.apiControllerFormGroup.get('year')?.value;
    var cmbcharge = this.apiControllerFormGroup.get('servicefilter')?.value;
    var filter_cmb = this.apiControllerFormGroup.get('filter')?.value;
    if (filter_cmb == "SHP") {
      this.desc_detail_text = "for" + " " + cmbyear + "" + " FRT Only in " + cmbcharge + " " + "data";
    } else {
      this.desc_detail_text = "for" + " " + cmbyear + " " + filter_cmb + " " + "data";
    }
    await this.fetchdisplay_Heatmap_list();
    await this.fetchCountry_Barchart();
    this.bindName();
  }
  async fetchdisplay_Heatmap_list() {
    await this.httpClientService.fetchdisplay_Heatmap_list(this.apiControllerFormGroup.value)?.subscribe(
      result => {
        if (result != null) {
          this.myData1 = result;
          this.createFirstLevelChartXML(result);
        }
        this.resultobj = result;
      },
      error => {

      })
  }
  async fetchCountry_Barchart() {
    await this.httpClientService.fetchCountry_Barchart(this.apiControllerFormGroup.value)?.subscribe(
      result => {
        this.Country_barchartAC = result;
        if (this.Country_barchartAC != null) {
          this.Country_barchartAC = this.Country_barchartAC;
          this.refreshCharts();
        }
        this.resultobj = result;
      },
      error => {

      })
  }
  async refreshCharts() {
    if (this.level == "T" || this.level == "F" || this.level == "S") {
      await this.Bar_chartshp(this.Country_barchartAC, "1stlevel");
      await this.pie_chart_New(this.Country_barchartAC, this.level);
    }
    if (this.level == "F" || this.level == "S") {
      this.createFirstLevelChartXML(this.myData1);
    }
  }
  async pie_chart_New(pie_AC: any, pietype: any) {
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;
    var field2 = filterVal;
    if (filterVal == "SHP" || filterVal == "FRT" || filterVal == "ACC" || filterVal == "BW") {
      await this.pie_data(pie_AC, pietype, field2);
    }
    else {
      await this.pie_data_Avg(pie_AC, pietype, field2);
    }
  }
  t004filteryear_Avg_year: any;
  pieChart_enabled: any;
  pieChart_visible: any;
  pieChart_includeInLayout: any;
  lbl_nodata_visible: any;
  lbl_nodata_includeInLayout: any;
  async pie_data_Avg(coll_Avg: any, field1: String, field2: String) {
    var temptotal_avg = 0;
    if (coll_Avg.length > 0) {
      for (var count1 = 0; count1 < coll_Avg.length; count1++) {
        this.t004filteryear_Avg_year = this.apiControllerFormGroup.get('year')?.value;
        if (this.t004filteritem_Avg_type == "ACPP")
          temptotal_avg = Number((coll_Avg[count1]).overall_YearAvg_cost_per_pound);
        if (this.t004filteritem_Avg_type == "ACS")
          temptotal_avg = Number((coll_Avg[count1]).overall_YearAvg_cost_per_shipment);
        if (this.t004filteritem_Avg_type == "ASACC")
          temptotal_avg = Number((coll_Avg[count1]).overall_Yearavg_cost_per_shipment_acc);
        if (this.t004filteritem_Avg_type == "ACPPCC")
          temptotal_avg = Number((coll_Avg[count1]).overall_YearAvg_cost_per_pound_acc);
      }
      if (field1 == "F") {
        this.countryTotal = temptotal_avg;
        if (this.countryTotal != 0) {
          this.pieChart_enabled = true;
          this.pieChart_visible = true;
          this.pieChart_includeInLayout = true;
          this.lbl_nodata_visible = false;
          this.lbl_nodata_includeInLayout = false;
        }
        else {
          this.pieChart_enabled = false;
          this.pieChart_visible = false;
          this.pieChart_includeInLayout = false;
          this.lbl_nodata_visible = true;
        }
      }
      else if (field1 == "S") {
        this.stateTotal = this.Avg_Statevalue;
      }
      else {
        this.countyTotal = temptotal_avg;
      }
    }
  }
  async Bar_chartshp(tempAC: any, field1: String) {
    // this.closeLoading();
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;

    if (filterVal == "SHP") {
      await this.createSeriesFromAC(tempAC, field1, "Bar");
    } else if (filterVal == "BW") {
      await this.createSeriesFromAC(tempAC, field1, "Bar");
    }
    else {
      await this.createSeriesFromAC(tempAC, field1, "Bar");
    }
  }
  async createSeriesFromAC(collection: any, field1: String, seriesName: String) {
    this.closeLoading();
    var chartData = [];
    if (collection.length > 0) {
      for (var loop = 0; loop < collection.length; loop++) {
        var monthObj = this.Country_barchartAC[loop];
        var monthStr = this.hashMapObj.get(monthObj.month) as String;
        if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
          //Service level FRT
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.groundResidential });
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.groundCommercial });
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.groundHunderedWeight });
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.surePost });
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.nextDayAir });
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirAM });
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirSaver });
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.twoDay });
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.threeDay });
          //shipment inbound service SHP
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.groundResidential_SHPinbound });
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.groundCommercial_SHPinbound });
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.groundHunderedWeight_SHPinbound });
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.surePost_SHPinbound });
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.nextDayAir_SHPinbound });
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirAM_SHPinbound });
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirSaver_SHPinbound });
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.twoDay_SHPinbound });
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.threeDay_SHPinbound });
          //Service level ACC
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.groundResidential_frt_access });
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.groundCommercial_frt_access });
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.groundHunderedWeight_frt_access });
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.surePost_frt_access });
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.nextDayAir_frt_access });
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirAM_frt_access });
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirSaver_frt_access });
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.twoDay_frt_access });
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.threeDay_frt_access });
          //Service level BW
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.groundResidential_total_billed_weight });
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.groundCommercial_total_billed_weight });
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.groundHunderedWeight_total_billed_weight });
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.surePost_total_billed_weight });
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.nextDayAir_total_billed_weight });
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirAM_total_billed_weight });
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.nextDayAirSaver_total_billed_weight });
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.twoDay_total_billed_weight });
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.threeDay_total_billed_weight });
        }
        else {
          if (this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.shipment_inbound });
          if (this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.freight_charges });
          if (this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.freight_charges_access });
          if (this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.total_billed_weight });
          if (this.t004filteritem_type == "ACPP")
            chartData.push({ date: monthStr, value: monthObj.overall_YearAvg_cost_per_pound });
          if (this.t004filteritem_type == "ACS")
            chartData.push({ date: monthStr, value: monthObj.overall_YearAvg_cost_per_pound_acc });
          if (this.t004filteritem_type == "ASACC")
            chartData.push({ date: monthStr, value: monthObj.overall_YearAvg_cost_per_shipment });
          if (this.t004filteritem_type == "ACPPCC")
            chartData.push({ date: monthStr, value: monthObj.overall_Yearavg_cost_per_shipment_acc });
        }
      }
    }
    else {
      chartData.push({ date: "JAN", value: "0" });
      chartData.push({ date: "FEB", value: "0" });
      chartData.push({ date: "MAR", value: "0" });
      chartData.push({ date: "APR", value: "0" });
      chartData.push({ date: "MAY", value: "0" });
      chartData.push({ date: "JUN", value: "0" });
      chartData.push({ date: "JULY", value: "0" });
      chartData.push({ date: "AUG", value: "0" });
      chartData.push({ date: "SEP", value: "0" });
      chartData.push({ date: "OCT", value: "0" });
      chartData.push({ date: "NOV", value: "0" });
      chartData.push({ date: "DEC", value: "0" });/**/
    }
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end
    // Create chart instance
    let chart = am4core.create("month_wize", am4charts.XYChart);
    // Add data
    chart.data = chartData;
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false; //Disable axis tooltip
    categoryAxis.dataFields.category = "date";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.fontSize = "9px";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false; //Disable axis tooltip
    if (this.t004filteritem_type == "FRT" || this.t004filteritem_type == "ACC") {
      valueAxis.title.text = "$Value";
    }
    else if (this.t004filteritem_type == "BW") {
      valueAxis.title.text = "LBS";
    }
    else {
      valueAxis.title.text = "Count";
    }
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", function (text) {
      return text;
    });

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "date";
    series.name = "Month";

    if (this.t004filteritem_type == "FRT" || this.t004filteritem_type == "ACC") {
      series.tooltipText = "$ [bold]{valueY}[/]";
    }
    else if (this.t004filteritem_type == "BW") {
      series.tooltipText = "[bold]{valueY}[/]";
    }
    else {
      series.tooltipText = "[bold]{valueY}[/]";
    }

    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill, target: any) {
      return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke, target: any) {
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
  }
  async pie_data(coll: any, field1: any, fieldVal: any) {
    var selectFilter = this.apiControllerFormGroup.get('filter')?.value;
    var field2 = this.filterLabel.find((xdata: any) => xdata.value == fieldVal).label;
    this.t004filterService_type = this.apiControllerFormGroup.get('servicefilter')?.value;
    var tot_shp = 0;

    if (coll.length > 0) {
      for (var count1 = 0; count1 < coll.length; count1++) {
        this.t004filteryear['year'] = this.apiControllerFormGroup.get('year')?.value;
        var temptotal = 0;
        if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
          //Serveice level FRT
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).groundResidential);
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).groundCommercial);
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).groundHunderedWeight);
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).surePost);
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).nextDayAir);
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).nextDayAirAM);
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).nextDayAirSaver);
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).twoDay);
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).threeDay);
          //service level shp
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).groundResidential_SHPinbound);
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).groundCommercial_SHPinbound);
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).groundHunderedWeight_SHPinbound);
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).surePost_SHPinbound);
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).nextDayAir_SHPinbound);
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).nextDayAirAM_SHPinbound);
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).nextDayAirSaver_SHPinbound);
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).twoDay_SHPinbound);
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).threeDay_SHPinbound);
          //Serveice level FRT+ACC 
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).groundResidential_frt_access);
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).groundCommercial_frt_access);
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).groundHunderedWeight_frt_access);
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).surePost_frt_access);
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).nextDayAir_frt_access);
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).nextDayAirAM_frt_access);
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).nextDayAirSaver_frt_access);
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).twoDay_frt_access);
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).threeDay_frt_access);
          //Serveice level BW
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).groundResidential_total_billed_weight);
          if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).groundCommercial_total_billed_weight);
          if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).groundHunderedWeight_total_billed_weight);
          if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).surePost_total_billed_weight);
          if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).nextDayAir_total_billed_weight);
          if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).nextDayAirAM_total_billed_weight);
          if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).nextDayAirSaver_total_billed_weight);
          if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).twoDay_total_billed_weight);
          if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).threeDay_total_billed_weight);

        }
        else {
          if (this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).shipment_inbound);
          if (this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).freight_charges);
          if (this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).freight_charges_access);

          if (this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).total_billed_weight);
        }
        if (isNaN(temptotal))
          temptotal = 0;
        else
          tot_shp += temptotal;

      }
      this.totalus_value = tot_shp;
      var chartData = [];
      if (field1 == "F") {
        this.countryTotal = this.totalus_value;
        var countryTotal = this.countryTotal;
        chartData.push({ name: field2, value: countryTotal });

      }
      else if (field1 == "S") {
        this.stateTotal = this.totalus_value;
        var stateTotal = this.stateTotal;
        var countryTotal = this.countryTotal;
        chartData.push({ name: field2, value: countryTotal - stateTotal });
        chartData.push({ name: field2 + " " + this.clickedName, value: stateTotal });

      }
      else {
        this.countyTotal = this.totalus_value;
        var stateTotal = this.stateTotal;
        var countryTotal = this.countryTotal;
        chartData.push({ name: field2, value: countryTotal - stateTotal });
        chartData.push({ name: field2 + " " + this.clickedName, value: stateTotal - this.countyTotal });
        chartData.push({ name: field2 + " " + this.countyName, value: this.countyTotal });

      }

    }

    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    let chart: any = am4core.create("pie_chart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = chartData;
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";

    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;

    series.alignLabels = false;
    series.labels.template.disabled = false;
    series.slices.template.strokeWidth = 2;
    series.slices.template.strokeOpacity = 1;
    series.ticks.template.disabled = false;
    series.labels.template.disabled = true;
    if (this.t004filteritem_type == "FRT" || this.t004filteritem_type == "ACC") {
      series.labels.template.text = "${value}";
      series.slices.template.tooltipText = "{category}: $[bold]{value}[/]";
    }
    else if (this.t004filteritem_type == "BW") {
      series.labels.template.text = "{value}";
      series.slices.template.tooltipText = "{category}: [bold]{value}[/]";
    }
    else {
      series.labels.template.text = "{value}";
      series.slices.template.tooltipText = "{category}: [bold]{value}[/]";
    }
    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;

    chart.legend = new am4charts.Legend();
    if (this.themeoption == "dark") {
      chart.legend.valueLabels.template.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
    }
  }
  clickedName: any;
  resultobj: any;
  Country_barchartAC: any;
  yearTitleFedex: any;
  countyNameValue: any;
  yearTitle = signal<any>('');
  servicefilterLabelVal = signal<any>('');
  filterLabelVal = signal<any>('');
  Servicelevel: any;
  t004filterService_type: any;
  t004filteryear_year: any;
  async bindName() {

    this.countyNameValue = "";
    this.yearTitle.set(this.apiControllerFormGroup.get('year')?.value);
    var selectFilter = this.apiControllerFormGroup.get('filter')?.value;
    var selectservicefilter = this.apiControllerFormGroup.get('servicefilter')?.value;

    var servicefilter = this.ServicefilterLabel.find((ydata: any) => ydata.value == selectservicefilter + "").label;
    var filter = this.filterLabel.find((xdata: any) => xdata.value == selectFilter).label;

    this.servicefilterLabelVal.set(servicefilter);
    if (this.servicefilterLabelVal() == "ALL" && filter == "Freight Charges Only") {
      this.servicefilterLabelVal.set("");
      this.filterLabelVal.set("FRT Only");
    }
    else if (filter == "Freight Charges Only") {
      this.filterLabelVal.set("FRT Only in");
    }
    else if (filter != "Freight Charges Only") {
      this.filterLabelVal.set(filter);
      this.servicefilterLabelVal.set("");
    }
    this.closeLoading();
  }

  async createFirstLevelChartXML(mapData1: any) {
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;
    var serviceFilter = this.apiControllerFormGroup.get('servicefilter')?.value;
    if (filterVal == "SHP" || filterVal == "BW") {
      await this.createSeriesXML(mapData1, "state", "shipment_inbound");
    }
    else if (serviceFilter == "GroundResidential" || serviceFilter == "GroundCommercial") {
      await this.createSeriesXML(mapData1, "state", "GroundResidential");
    } else {
      await this.createSeriesXML(mapData1, "state", "shipment_inbound")
    }
  }
  async createSeriesXML(collection: any, nameField: String, yField: String) {
    if (collection != null) {
      var chartData = [];

      for (var loop = 0; loop < collection.length; loop++) {
        var stateData;
        var monthObj = collection[loop];
        if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
          //service level FRT
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "FRT") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundResidential })

          }
          else if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "FRT") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundCommercial })
          }
          else if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "FRT") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundHunderedWeight });
          }
          else if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "FRT") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.surePost });
          }
          else if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "FRT") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAir });
          }
          else if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "FRT") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirAM });
          }
          else if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "FRT") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirSaver });
          }
          else if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "FRT") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.twoDay });
          }
          else if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "FRT") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.threeDay });
          }
          //service level FRT
          else if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundResidential_SHPinbound });
          }
          else if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundCommercial_SHPinbound });
          }
          else if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundHunderedWeight_SHPinbound });
          }
          else if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.surePost_SHPinbound });
          }
          else if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAir_SHPinbound });
          }
          else if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirAM_SHPinbound });
          }
          else if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirSaver_SHPinbound });
          }
          else if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "SHP") {

            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.twoDay_SHPinbound });
          }
          else if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "SHP") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.threeDay_SHPinbound });
          }
          //service level FRT+ACC
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundResidential_frt_access });
          }
          else if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundCommercial_frt_access });
          }
          else if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundHunderedWeight_frt_access });
          }
          else if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.surePost_frt_access });
          }
          else if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAir_frt_access });
          }
          else if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirAM_frt_access });
          }
          else if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirSaver_frt_access });
          }
          else if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.twoDay_frt_access });
          }
          else if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.threeDay_frt_access });
          }
          //Service level BW
          if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundResidential_total_billed_weight });
          }
          else if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundCommercial_total_billed_weight });
          }
          else if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.groundHunderedWeight_total_billed_weight });
          }
          else if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.surePost_total_billed_weight });
          }
          else if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAir_total_billed_weight });
          }
          else if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirAM_total_billed_weight });
          }
          else if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.nextDayAirSaver_total_billed_weight });
          }
          else if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.twoDay_total_billed_weight });
          }
          else if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.threeDay_total_billed_weight });
          }

        }
        else {
          if (this.t004filteritem_type == "SHP") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.shipmentInbound });
          }
          else if (this.t004filteritem_type == "FRT") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.freightCharges });
          }
          else if (this.t004filteritem_type == "ACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.freightChargesAccess });
          }
          else if (this.t004filteritem_type == "BW") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.totalBilledWeight });
          }
          else if (this.t004filteritem_type == "ACPP") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound });
          }
          else if (this.t004filteritem_type == "ACS") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total });
          }
          else if (this.t004filteritem_type == "ASACC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc });
          }
          else if (this.t004filteritem_type == "ACPPCC") {
            stateData = "US-" + monthObj.state;
            chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc });
          }
        }
      }
    }
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_usaLow;

    // Set projection
    chart.projection = new am4maps.projections.AlbersUsa();

    // Create map polygon series
    var polygonSeries: any = chart.series.push(new am4maps.MapPolygonSeries());

    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: chart.colors.getIndex(1).brighten(1),
      max: chart.colors.getIndex(1).brighten(-0.3)
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.calculateVisualCenter = true;
    // Set heatmap values for each state
    polygonSeries.data = chartData;

    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.valign = "bottom";
    heatLegend.width = am4core.percent(20);
    heatLegend.marginRight = am4core.percent(7);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 40000000;

    // Set up custom heat map legend labels using axis ranges
    let minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "Low";
    let maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "High";
    if (this.themeoption == "dark") {
      maxRange.label.fill = am4core.color("#ffffff");
      minRange.label.fill = am4core.color("#ffffff");
    }
    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText: any) {
      return "";
    });

    // Configure series tooltip
    var polygonTemplate = polygonSeries.mapPolygons.template;
    if (this.t004filteritem_type == "FRT" || this.t004filteritem_type == "ACC") {
      polygonTemplate.tooltipText = "[#fff]{name}: ${value}";
    }
    else if (this.t004filteritem_type == "BW") {
      polygonTemplate.tooltipText = "[#fff]{name}: {value}";
    }
    else {
      polygonTemplate.tooltipText = "[#fff]{name}: {value}";
    }
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    polygonTemplate.events.on("hit", (ev: any) => {
      const category = ev.target?.dataItem?.dataContext as {
        name: string;
        value: number;
      };

      if (category && category.value !== 0) {
        this.clickedName = category.name;
        this.openLoading();
        this.heatmap_pointClickHandler(category);
      }
    });
    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

    // Configure label series
    var labelSeries = chart.series.push(new am4maps.MapImageSeries());
    var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 10;
    if (this.themeoption == "dark")
      labelTemplate.fill = am4core.color("#353c48");
    else
      labelTemplate.fill = am4core.color("#ffffff");
    labelTemplate.fontWeight = "500";
    labelTemplate.interactionsEnabled = false;
    labelTemplate.nonScaling = true;

    // Set up label series to populate
    polygonSeries.events.on("inited", function () {
      polygonSeries.mapPolygons.each(function (polygon: any) {
        var label: any = labelSeries.mapImages.create();
        var state = polygon.dataItem.dataContext["id"].split("-").pop();
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        label.children.getIndex(0)["text"] = state;
      });
    });

  }
  Avg_Statevalue: any;
  regionName: any;
  regionID: any;
  stateName: any;
  countyName: any;
  _tempRegion_id: any;
  _isSecondLevel: any;
  btnBack_visible: any;
  btnBack_includeInLayout: any;
  async heatmap_pointClickHandler(event: any) {
    var eventID = event.id.replace("US-", "")
    this.showTitleData.set(false);
    this.countyNameValue = event.name;
    this.t004filteritem_type = this.apiControllerFormGroup.get('filter')?.value;
    this.t004filteryear_year = this.apiControllerFormGroup.get('year')?.value;
    var serviceFilter = this.apiControllerFormGroup.get('servicefilter')?.value;
    this.description_id_text = "Displaying state of" + " " + event.name;
    this.desc_detail_visible = true;

    if (this.t004filteritem_type == "FRT") {
      this.desc_detail_text = "for" + " " + this.t004filteryear_year + " " + "FRT Only in " + serviceFilter + " " + "data";
    } else {
      this.desc_detail_text = "for" + " " + this.t004filteryear_type + " " + "Year:" + " " + this.t004filteryear_year;
    }
    this.Avg_Statevalue = event.value;
    this.regionName = event.name;
    this.regionID = eventID;
    this._tempRegion_id = this.regionID;
    if (this.level == "F") {
      this.stateName = this.regionID;
      this.countyName = null;
    }
    else
      this.countyName = this.regionName;
    this._tempRegion_id = this.regionID;
    await this.apiControllerFormGroup.get('state')?.setValue(this.stateName);
    await this.apiControllerFormGroup.get('county')?.setValue(this.countyName);
    await this.fetchCountry_Barchart();
    if (this.level == "F") {
      this.fetchCity_Shipment();
    }
    if (!this._isSecondLevel) {
      this.level = "S";
      this.btnBack_visible = true;
      this.btnBack_includeInLayout = true;
      this._isSecondLevel = true;
    }
    else
      this.level = "T";

  }
  cityShipmentAC: any;
  Heatmap: any;
  async fetchCity_Shipment() {
    await this.httpClientService.fetchCity_Shipment(this.apiControllerFormGroup.value).subscribe(
      result => {
        this.cityShipmentAC = result;
        if (this.cityShipmentAC != null) {
          this.Heatmap = this.createSecondLevelChartXML(this._tempRegion_id, this.cityShipmentAC);
        }
        this.resultobj = result;
      },
      error => {

      })
  }
  async createSecondLevelChartXML(stateAbbr: any, second_dataAC: any) {
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;
    if (filterVal == "SHP" || filterVal == "BW") {
      await this.createSeriesSecondLevel(second_dataAC, "county", "shipment_inbound");

    } else {
      await this.createSeriesSecondLevel(second_dataAC, "county", "shipment_inbound");

    }
  }
  async createSeriesSecondLevel(cityresultAC: any, stateName: String, yField: String) {
    var chartData = [];
    for (var loop = 0; loop < cityresultAC.length; loop++) {

      var monthObj = cityresultAC[loop];
      if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
        //Service Level FRT
        if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "FRT") {

          chartData.push({ id: monthObj.postal, value: monthObj.groundResidential ? monthObj.groundResidential : "0" });

        }
        if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundCommercial ? monthObj.groundCommercial : "0" });

        }
        if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundHunderedWeight ? monthObj.groundHunderedWeight : "0" });

        }
        if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.surePost ? monthObj.surePost : "0" });

        }
        if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAir ? monthObj.nextDayAir : "0" });

        }
        if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirAM ? monthObj.nextDayAirAM : "0" });

        }
        if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirSaver ? monthObj.nextDayAirSaver : "0" });

        }
        if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.twoDay ? monthObj.twoDay : "0" });

        }
        if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.threeDay ? monthObj.threeDay : "0" });

        }
        //service level shp

        if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundResidential_SHPinbound ? monthObj.groundResidential_SHPinbound : "0" });
        }

        if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundCommercial_SHPinbound ? monthObj.groundCommercial_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundHunderedWeight_SHPinbound ? monthObj.groundHunderedWeight_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.surePost_SHPinbound ? monthObj.surePost_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAir_SHPinbound ? monthObj.nextDayAir_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirAM_SHPinbound ? monthObj.nextDayAirAM_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirSaver_SHPinbound ? monthObj.nextDayAirSaver_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.twoDay_SHPinbound ? monthObj.twoDay_SHPinbound : "0" });

        }
        if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "SHP") {
          chartData.push({ id: monthObj.postal, value: monthObj.threeDay_SHPinbound ? monthObj.threeDay_SHPinbound : "0" });
        }
        //Service Level FRT+ ACC
        if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundResidential_frt_access ? monthObj.groundResidential_frt_access : "0" });
        }
        if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundCommercial_frt_access ? monthObj.groundCommercial_frt_access : "0" });
        }
        if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "ACC") {

          chartData.push({ id: monthObj.postal, value: monthObj.groundHunderedWeight_frt_access ? monthObj.groundHunderedWeight_frt_access : "0" });
        }
        if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "ACC") {

          chartData.push({ id: monthObj.postal, value: monthObj.surePost_frt_access ? monthObj.surePost_frt_access : "0" });

        }
        if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAir_frt_access ? monthObj.nextDayAir_frt_access : "0" });

        }
        if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirAM_frt_access ? monthObj.nextDayAirAM_frt_access : "0" });
        }
        if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirSaver_frt_access ? monthObj.nextDayAirSaver_frt_access : "0" });
        }
        if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.twoDay_frt_access ? monthObj.twoDay_frt_access : "0" });
        }
        if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.threeDay_frt_access ? monthObj.threeDay_frt_access : "0" });

        }
        //SERVICE level BW
        if (this.t004filterService_type == "GroundResidential" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundResidential_total_billed_weight ? monthObj.groundResidential_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "GroundCommercial" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundCommercial_total_billed_weight ? monthObj.groundCommercial_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "GroundHunderedWeight" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.groundHunderedWeight_total_billed_weight ? monthObj.groundHunderedWeight_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "GroundSaver" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.surePost_total_billed_weight ? monthObj.surePost_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "NextDayAir" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAir_total_billed_weight ? monthObj.nextDayAir_total_billed_weight : "0" });


        }
        if (this.t004filterService_type == "NextDayAirAM" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirAM_total_billed_weight ? monthObj.nextDayAirAM_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "NextDayAirSaver" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.nextDayAirSaver_total_billed_weight ? monthObj.nextDayAirSaver_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "2Day" && this.t004filteritem_type == "BW") {

          chartData.push({ id: monthObj.postal, value: monthObj.twoDay_total_billed_weight ? monthObj.twoDay_total_billed_weight : "0" });

        }
        if (this.t004filterService_type == "3Day" && this.t004filteritem_type == "BW") {
          chartData.push({ id: monthObj.postal, value: monthObj.threeDay_total_billed_weight ? monthObj.threeDay_total_billed_weight : "0" });

        }
      } else {
        if (this.t004filteritem_type == "SHP") {

          chartData.push({ id: monthObj.postal, value: monthObj.shipment_inbound ? monthObj.shipment_inbound : "0" });

        }
        if (this.t004filteritem_type == "FRT") {
          chartData.push({ id: monthObj.postal, value: monthObj.freight_charges ? monthObj.freight_charges : "0" });

        }
        if (this.t004filteritem_type == "ACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.freight_charges_access ? monthObj.freight_charges_access : "0" });
        }
        if (this.t004filteritem_type == "BW") {

          chartData.push({ id: monthObj.postal, value: monthObj.total_billed_weight ? monthObj.total_billed_weight : "0" });

        }
        if (this.t004filteritem_type == "ACPP") {
          chartData.push({ id: monthObj.postal, value: monthObj.avg_cost_per_pound ? monthObj.avg_cost_per_pound : "0" });
        }
        if (this.t004filteritem_type == "ACS") {
          chartData.push({ id: monthObj.postal, value: monthObj.avg_cost_per_shipment ? monthObj.avg_cost_per_shipment : "0" });
        }
        if (this.t004filteritem_type == "ASACC") {
          chartData.push({ id: monthObj.postal, value: monthObj.avg_cost_per_shipment_access ? monthObj.avg_cost_per_shipment_access : "0" });
        }
        if (this.t004filteritem_type == "ACPPCC") {
          chartData.push({ id: monthObj.postal, value: monthObj.avg_cost_per_pound_access ? monthObj.avg_cost_per_pound_access : "0" });
        }
      }


    }



    // Create map instance
    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    var stateName: String = this.apiControllerFormGroup.get('state')?.value + "";


    var countyName = stateName.toLowerCase();


    switch (countyName) {
      case "ak":
        chart.geodata = am4geodata_region_usa_akLow;
        break;
      case "al":
        chart.geodata = am4geodata_region_usa_alLow;
        break;
      case "ar":
        chart.geodata = am4geodata_region_usa_arLow;
        break;
      case "az":
        chart.geodata = am4geodata_region_usa_azLow;
        break;
      case "ca":
        chart.geodata = am4geodata_region_usa_caLow;
        break;
      case "co":
        chart.geodata = am4geodata_region_usa_coLow;
        break;
      case "ct":
        chart.geodata = am4geodata_region_usa_ctLow;
        break;
      case "de":
        chart.geodata = am4geodata_region_usa_deLow;
        break;
      case "fl":
        chart.geodata = am4geodata_region_usa_flLow;
        break;
      case "ga":
        chart.geodata = am4geodata_region_usa_gaLow;
        break;
      case "hi":
        chart.geodata = am4geodata_region_usa_hiLow;
        break;
      case "ia":
        chart.geodata = am4geodata_region_usa_iaLow;
        break;
      case "id":
        chart.geodata = am4geodata_region_usa_idLow;
        break;
      case "il":
        chart.geodata = am4geodata_region_usa_ilLow;
        break;
      case "in":
        chart.geodata = am4geodata_region_usa_inLow;
        break;
      case "ks":
        chart.geodata = am4geodata_region_usa_ksLow;
        break;
      case "ky":
        chart.geodata = am4geodata_region_usa_kyLow;
        break;
      case "la":
        chart.geodata = am4geodata_region_usa_laLow;
        break;
      case "ma":
        chart.geodata = am4geodata_region_usa_maLow;
        break;
      case "md":
        chart.geodata = am4geodata_region_usa_mdLow;
        break;
      case "me":
        chart.geodata = am4geodata_region_usa_meLow;
        break;
      case "mi":
        chart.geodata = am4geodata_region_usa_miLow;
        break;
      case "mn":
        chart.geodata = am4geodata_region_usa_mnLow;
        break;
      case "mo":
        chart.geodata = am4geodata_region_usa_moLow;
        break;
      case "ms":
        chart.geodata = am4geodata_region_usa_msLow;
        break;
      case "mt":
        chart.geodata = am4geodata_region_usa_mtLow;
        break;
      case "nc":
        chart.geodata = am4geodata_region_usa_ncLow;
        break;
      case "nd":
        chart.geodata = am4geodata_region_usa_ndLow;
        break;
      case "ne":
        chart.geodata = am4geodata_region_usa_neLow;
        break;
      case "nh":
        chart.geodata = am4geodata_region_usa_nhLow;
        break;
      case "nj":
        chart.geodata = am4geodata_region_usa_njLow;
        break;
      case "nm":
        chart.geodata = am4geodata_region_usa_nmLow;
        break;
      case "nv":
        chart.geodata = am4geodata_region_usa_nvLow;
        break;
      case "ny":
        chart.geodata = am4geodata_region_usa_nyLow;
        break;
      case "oh":
        chart.geodata = am4geodata_region_usa_ohLow;
        break;
      case "ok":
        chart.geodata = am4geodata_region_usa_okLow;
        break;
      case "or":
        chart.geodata = am4geodata_region_usa_orLow;
        break;
      case "pa":
        chart.geodata = am4geodata_region_usa_paLow;
        break;
      case "ri":
        chart.geodata = am4geodata_region_usa_riLow;
        break;
      case "sc":
        chart.geodata = am4geodata_region_usa_scLow;
        break;
      case "sd":
        chart.geodata = am4geodata_region_usa_sdLow;
        break;
      case "tn":
        chart.geodata = am4geodata_region_usa_tnLow;
        break;
      case "tx":
        chart.geodata = am4geodata_region_usa_txLow;
        break;
      case "ut":
        chart.geodata = am4geodata_region_usa_utLow;
        break;
      case "va":
        chart.geodata = am4geodata_region_usa_vaLow;
        break;
      case "vt":
        chart.geodata = am4geodata_region_usa_vtLow;
        break;
      case "wa":
        chart.geodata = am4geodata_region_usa_waLow;
        break;
      case "wi":
        chart.geodata = am4geodata_region_usa_wiLow;
        break;
      case "wv":
        chart.geodata = am4geodata_region_usa_wvLow;
        break;
      default:
        chart.geodata = am4geodata_region_usa_mnLow;
        break;
    }



    chart.projection = new am4maps.projections.Miller();

    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: chart.colors.getIndex(1).brighten(1),
      max: chart.colors.getIndex(1).brighten(-0.3)
    });
    polygonSeries.useGeodata = true;
    polygonSeries.calculateVisualCenter = true;
    // Set heatmap values for each state
    polygonSeries.data = chartData;

    // Configure series tooltip
    var polygonTemplate = polygonSeries.mapPolygons.template;
    if (this.t004filteritem_type == "FRT" || this.t004filteritem_type == "ACC") {
      polygonTemplate.tooltipText = "{name}: ${value}";
    }
    else if (this.t004filteritem_type == "BW") {
      polygonTemplate.tooltipText = "{name}: {value}";
    }
    else {
      polygonTemplate.tooltipText = "{name}: {value}";
    }

    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.events.on("hit", function (ev) {
    })
    polygonTemplate.fill = am4core.color("#74B266");




    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

    // Configure label series
    var labelSeries = chart.series.push(new am4maps.MapImageSeries());
    var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    labelTemplate.fontSize = 10;
    labelTemplate.interactionsEnabled = false;
    labelTemplate.nonScaling = false;
    polygonSeries.events.on("inited", function () {
      polygonSeries.mapPolygons.each(function (polygon: any) {
        var label: any = labelSeries.mapImages.create();
        var county = polygon.dataItem.dataContext["name"];
        var countyName = county.slice(0, county.indexOf(' '));
        label.latitude = polygon.visualLatitude;
        label.longitude = polygon.visualLongitude;
        label.children.getIndex(0)["text"] = county;
        label.fontSize = 8;
      });
    });

    let myEvent = polygonTemplate.events.on("hit", function (ev) {
      var category: object = ev.target.dataItem.dataContext;
      var categoryName: any = category;
      if (categoryName["value"] != 0) {
        this.openLoading();
        this.heatmap_pointClickHandler(categoryName);
      }
    }, this);
    this.closeLoading();
  }

  async onBackButtonClick() {
    this.openLoading();
    this.level = "F";
    this.stateName = null;
    await this.apiControllerFormGroup.get('state')?.setValue(null);
    await this.apiControllerFormGroup.get('county')?.setValue(null);
    this.countyName = null;
    this._isSecondLevel = false;
    this.btnBack_visible = false;
    this.btnBack_includeInLayout = false;
    this.desc_detail_visible = false;
    this.showTitleData.set(true);
    this.creation_Handler();
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
  }
  excelDownload_clickHandler() {
    var urlParam: any = {};
    var urlParamArr = [];
    var clickedYear = this.apiControllerFormGroup.get('year')?.value;
    var chargeType = this.apiControllerFormGroup.get('servicefilter')?.value;
    var type = this.apiControllerFormGroup.get('type')?.value;
    if (this.countyName == undefined) {
      this.countyName = null;
    }
    var clientId = this.clientID;
    var currentDate = new Date();
    var currentYear = new Date().getFullYear();
    var dateValue = this.datePipe.transform(currentDate, "yyyy-MM-dd");
    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss");
    var dataasof = this.userProfifle.dataasof;

    urlParam['fromDate'] = clickedYear.toString() + "-01-01";
    if (clickedYear == currentYear)
      urlParam['toDate'] = this.datePipe.transform(dataasof, "yyyy-MM-dd");
    else
      urlParam['toDate'] = clickedYear + "-12" + "-31";
    //urlParam['toDate']=dateValue;  
    urlParam['moduleName'] = "Graphicalmap_Report";
    urlParam['login_id'] = this.loginId.toString();
    urlParam['t001ClientProfile'] = this.apiControllerFormGroup.get('t001ClientProfile')?.value;
    if (type == "Shipper") {
      urlParam['reportType'] = "DomesticMap Sender Detail Report";
      urlParam['designFileName'] = "DomesticMap_Sender_Detail_Report";
      urlParam['reportName'] = "DomesticMap Sender Detail Report";
    }
    else {
      urlParam['reportType'] = "DomesticMap Recipient Detail Report";
      urlParam['designFileName'] = "DomesticMap_Recipient_Detail_Report";
      urlParam['reportName'] = "DomesticMap Recipient Detail Report";
    }
    urlParam['status'] = 'IN QUEUE';
    urlParam['reportFormat'] = "CSV";
    urlParam['clientId'] = clientId;
    urlParam['clientname'] = this.userProfifle.clientName;
    urlParam['crmaccountNumber'] = "NA";
    urlParam['accountNumber'] = "NA";
    urlParam['chargeDes'] = type;
    urlParam['year'] = clickedYear;
    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['fZone'] = chargeType;
    urlParam['tZone'] = this.countyName;
    this.httpClientService.runReport(urlParam).subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
      });

  }
  async saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup?.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
  }
  t004CountryBarchartObj_year: any;
  openModalConfig: any;
  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: 'custom_alert_popup'
    });
  }
  async cmb_year_changeHandler() {
    this.openLoading();
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;
    var yearVal = this.apiControllerFormGroup.get('year')?.value;
    this.yearTitle.set(this.apiControllerFormGroup.get('year')?.value);
    await this.apiControllerFormGroup.get('servicefilter')?.setValue('ALL');
    var servicefilter = this.apiControllerFormGroup.get('servicefilter')?.value;
    if (filterVal == "ACPP") {
      this.openModal("Work in Progress");
    }
    this.t004filteryear_year = this.apiControllerFormGroup.get('year')?.value;
    this.t004filterService_type = "ALL";
    this.description_id_text = "Click On Any State to Zoom In";
    this.desc_detail_visible = true;
    if (filterVal == "FRT") {
      this.desc_detail_text = "for" + " " + this.t004filteryear_year + " " + " FRT Only in " + servicefilter + " " + "data";
    } else {
      this.desc_detail_text = "for" + " " + this.t004filteryear_year + " " + filterVal + " " + "data";
    }
    this.level = "F";
    this.onBackButtonClick();
    this._isSecondLevel = false;
    var clientname = this.apiControllerFormGroup.get('clientname')?.value;
    var client_id = this.apiControllerFormGroup.get('client_id')?.value;
    if (client_id == "666") {
      this.openModal(clientname);
    }
    this.fetchdisplay_Heatmap_list();
    this.t004CountryBarchartObj_year = this.apiControllerFormGroup.get('year')?.value;
    this.fetchCountry_Barchart();
  }
  t004filterService: any = {};
  t004filteritem: any = {};
  async filter_cmb_clickHandler() {
    this.openLoading();
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;
    if (filterVal == "ACPP") {
      this.openModal("Work in Progress");
    }
    await this.apiControllerFormGroup.get('servicefilter')?.setValue('ALL');
    this.t004filterService['type'] = "ALL";
    this.t004filteritem['type'] = this.apiControllerFormGroup.get('filter')?.value;
    this.t004filterService['type'] = this.apiControllerFormGroup.get('servicefilter')?.value;
    this._isSecondLevel = false;
    this.lbl_nodata_visible = false;
    this.pieChart_visible = true;
    this.level = "F";
    this.Servicelevel = "No";
    this.onBackButtonClick();

  }
  async Service_filter_cmb_clickHandler() {
    this.openLoading();
    await this.apiControllerFormGroup.get('state')?.setValue(null);
    await this.apiControllerFormGroup.get('county')?.setValue(null);
    this.t004filterService['type'] = this.apiControllerFormGroup.get('servicefilter')?.value;
    this.t004filterService_type = this.apiControllerFormGroup.get('servicefilter')?.value;
    this._isSecondLevel = false;
    this.lbl_nodata_visible = false;
    this.pieChart_visible = true;
    this.level = "F";
    if (this.t004filterService_type == 'ALL') {
      this.Servicelevel = "No";
      this.t004filterService['type'] == '';
    }
    else {
      this.Servicelevel = "Yes";
    }
    await this.creation_Handler();
    this.btnBack_visible = false;
    this.btnBack_includeInLayout = false;
  }
  Shipped_ReceivedLabelArr = ['Recipient', 'Shipper'];
  async Recieved_Shipped_CountHandler() {
    var type = await this.apiControllerFormGroup.get('type')?.value;
    this.openLoading();
    await this.apiControllerFormGroup.get('state')?.setValue(null);
    await this.apiControllerFormGroup.get('county')?.setValue(null);
    this.t004filterService['type'] = this.apiControllerFormGroup.get('servicefilter')?.value;
    this.t004filterService_type = this.apiControllerFormGroup.get('servicefilter')?.value;
    this._isSecondLevel = false;
    this.lbl_nodata_visible = false;
    this.pieChart_visible = true;
    this.level = "F";
    if (this.t004filterService_type == 'ALL') {
      this.Servicelevel = "No";
      this.t004filterService['type'] == '';
    }
    else {
      this.Servicelevel = "Yes";
    }
    await this.creation_Handler();
    this.btnBack_visible = false;
    this.btnBack_includeInLayout = false;
  }
} 
