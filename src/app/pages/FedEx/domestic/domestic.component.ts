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
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';

@Component({
  selector: 'app-fedex-domestic',
  templateUrl: './domestic.component.html',
  styleUrls: ['./domestic.component.scss'],
  standalone: false
})
export class FedExDomesticComponent {
  attribute: any;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
  });
  fedexFormGroup: FormGroup;
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
    private httpfedexService: HttpfedexService,
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

    this.fedexFormGroup = new FormGroup({
      county: new FormControl(null),
      state: new FormControl(null),
      clientname: new FormControl(''),
      clientId: new FormControl(''),
      getYear: new FormControl(''),
      year: new FormControl(''),
      client_id: new FormControl(''),
      servicefilter: new FormControl('ALL'),
      type: new FormControl('Recipient'),
      filter: new FormControl('SHP'),
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
  ngOnInit() {
    this.openLoading();
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.showTitleData.set(true);
    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }

    this.filterLabel = [{ value: "SHP", label: "Shipments-Number of Packages" },
    { value: "FRT", label: "Freight Charges Only" },
    { value: "ACC", label: "Freight Charges with Accessorials" },
    { value: "BW", label: "Total Billed Weight" }
    ];
    this.ServicefilterLabel = [{ value: "ALL", label: "ALL" },
    { value: "FedExFirstOvernight", label: "FedEx First Overnight" },
    { value: "FedExPriorityOvernight", label: "FedEx Priority Overnight" },
    { value: "FedExStandardOvernight", label: "FedEx Standard Overnight" },
    { value: "FedEx2dayAM", label: "FedEx 2 Day A.M." },
    { value: "FedEx2day", label: "FedEx 2 Day" },
    { value: "FedExExpressSaver", label: "FedEx Express Saver" },
    { value: "Ground", label: "Ground" },
    { value: "HomeDelivery", label: "Home Delivery" },
    { value: "GroundEconomy", label: "Ground Economy" }];
    this.getUserFedex();
    this.init();

    setTimeout(() => {
      this.searchActive = false;
    }, 15000);
  }

  ///*Fedex API *////
  clientName: any;
  clientID: any;
  themeoption: any;
  async getUserFedex() {
    this.userProfifleData = await this.commonService.getUserprofileData();
    this.userProfifleFedex = this.userProfifleData[0];
    this.clientID = this.userProfifleFedex.clientId;
    this.clientName = this.userProfifleFedex.clientName.replace(/[ ]/g, "_");
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    var toData = new Date();
    var Data = new Date();
    var fromData = new Date();
    fromData = new Date(fromData.setMonth(fromData.getMonth() - 1));
    var toDate = this.datePipe.transform(toData, "yyyy-MM-dd");
    var fromDate = this.datePipe.transform(fromData, "yyyy-MM-dd");
    await this.fedexFormGroup.patchValue({
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

    var date = new Date();
    if (date.getMonth() == 0 || (date.getMonth() == 1 && date.getDate() <= 5)) {
      var yearData = await new Date().getFullYear() - 1;
    }
    else {
      var yearData = await new Date().getFullYear();
    } await this.fedexFormGroup.get('clientname')?.setValue(this.clientName);
    await this.fedexFormGroup.get('clientId')?.setValue(this.clientID);
    await this.fedexFormGroup.get('client_id')?.setValue(this.clientID);
    await this.fedexFormGroup.get('year')?.setValue(yearData);
    await this.fedexFormGroup.get('getYear')?.setValue(yearData);
    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    await this.creation_HandlerFedex();
    this.closeLoading();

  }
  yearTitleFedex: any = signal<any>([]);
  countyNameValue: any;
  filterLabelVal: any = signal<any>('');
  servicefilterLabelVal: any = signal<any>('');
  async bindName() {
    this.countyNameValue = "";
    this.yearTitleFedex.set(this.fedexFormGroup.get('year')?.value);
    var selectFilter = this.fedexFormGroup.get('filter')?.value;
    var selectservicefilter = this.fedexFormGroup.get('servicefilter')?.value;
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

  isLoading = true;
  openLoading() {
    this.isLoading = true;
  }
  closeLoading() {
    this.isLoading = false;
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
  userProfifleFedex: any;
  resultobj: any;


  clientProfileList: any;
  userValue: any;
  async getuserProfile() {
    this.userValue = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userValue;
  }

  t004filteritem_type: any;
  t004filteryear_type: any;
  t004filteritem_Avg_type: any;
  t004filteryear_Avg_type: any;
  level: any = "F";
  t004filteryear_Avg_year: any;
  description_id_text: any;
  desc_detail_visible: any;
  desc_detail_text: any;
  myData1: any = [];
  countryTotal: any = 0;
  stateTotal: any = 0;
  countyTotal: any = 0;
  BarchartObj: any = {};
  List_clientName: any = [];
  t004filterService: any = {};
  t004filteritem: any = {};
  t004filteryear: any = {};
  t004filterService_type: any;
  regionID: any;
  regionName: any;
  _tempRegion_id: any;
  stateName: any;
  countyName: any;
  Avg_Statevalue = 0.00;
  Servicelevel: any;
  monthObj1 = {};
  monthObj2 = {};
  tot_inbound = 0;
  tot_outbound = 0;
  totalus_value = 0;
  totaluscity_value = 0;
  t004filteritem_Avg = {};
  t004filteryear_Avg = {};
  pieChart_enabled: any;
  pieChart_visible: any;
  pieChart_includeInLayout: any;
  lbl_nodata_visible: any;
  lbl_nodata_includeInLayout: any;
  cityshipmentAC = [];
  _USAData = null;
  _isSecondLevel = false;
  cityShipmentAC = [];
  userProfifle: any;
  Country_barchartAC: any = [];
  Heatmap: any;
  monthObj: any;
  btnBack_visible: any;
  btnBack_includeInLayout: any;
  t004filteryear_year: any;
  t004CountryBarchartObj_year: any;
  gioData: any;
  yearTitle: any;
  clickedName: any;




  //---------------------------------------------------Barchart

  async Bar_chart(tempAC: any, field1: String) {
    await this.createSeriesFromAC(tempAC, field1, "Bar");
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

  async Bar_chartbw(tempAC: any, field1: String) {
    await this.createSeriesFromAC(tempAC, field1, "Bar");
  }


  async createSeriesFromAC(collection: any, field1: String, seriesName: any) {
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

  //----------------------------------------------------PieChart--------------------------------------- 

  async pie_chart_New(pie_AC: any, pietype: any) {
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;

    var field2 = filterVal;


    if (filterVal == "SHP" || filterVal == "FRT" || filterVal == "ACC" || filterVal == "BW") {
      await this.pie_data(pie_AC, pietype, field2, "", "");
    }
    else {
      await this.pie_data_Avg(pie_AC, pietype, field2, "", "");
    }

  }



  async pie_chart(pie_AC: any, pietype: any) {
    var filterVal = this.apiControllerFormGroup.get('filter')?.value;

    var field2 = filterVal;

    if (filterVal == "SHP" || filterVal == "BW") {
      await this.pie_data(pie_AC, pietype, field2, "", "");
    }
    else {
      await this.pie_data(pie_AC, pietype, field2, "", "");
    }


  }



  async pie_data(coll: any, field1: any, fieldVal: any, yField: any, seriesName: any) {
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



  async pie_data_Avg(coll_Avg: any, field1: String, field2: String, yField: String, seriesName: any) {
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
  async faultHandler(event: any) {
    this.openModal("Work in Progress");
  }



  Shipped_ReceivedLabelArr = ['Recipient', 'Shipper'];



  async cityshipment_result(event: any) {
    this.cityshipmentAC = event;
  }






  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
  t004filterServiceFedex: any;
  t004filteritemFedex: any;
  t004filteryearFedex: any;
  t004DisplayObj: any;
  t602stateObj: any;
  regionIDFedex: any = "";
  regionNameFedex: any = "";
  _tempRegion_idFedex: any = "";
  stateNameFedex: any;
  countyNameFedex: any;
  Avg_StatevalueFedex: Number = 0.00;
  levelFedex: any = "F";
  ServicelevelFedex: any;
  async creation_HandlerFedex() {
    this.levelFedex = "F";
    this.t004filteritem_type = this.fedexFormGroup.get('filter')?.value;
    this.t004filteryear_type = this.fedexFormGroup.get('year')?.value;
    this.t004filteritem_Avg_type = this.fedexFormGroup.get('filter')?.value;
    this.t004filteryear_Avg_type = this.fedexFormGroup.get('year')?.value;
    this.description_id_text = "Click On Any State to Zoom In";
    this.desc_detail_visible = true;
    var cmbyear = this.fedexFormGroup.get('year')?.value;
    var cmbcharge = this.fedexFormGroup.get('servicefilter')?.value;
    this.t004filterService_type = this.fedexFormGroup.get('servicefilter')?.value;

    var filter_cmb = this.fedexFormGroup.get('filter')?.value;
    if (filter_cmb == "SHP") {
      this.desc_detail_text = "for" + " " + cmbyear + "" + " FRT Only in " + cmbcharge + " " + "data";
    } else {
      this.desc_detail_text = "for" + " " + cmbyear + " " + filter_cmb + " " + "data";
    }

    await this.fetchdisplayHeatmaplist();
    await this.fetchCountryBarchart();
    this.bindName();
  }

  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }

  async fetchdisplayHeatmaplist() {
    await this.httpfedexService.fetchdisplayHeatmaplist(this.fedexFormGroup.value).subscribe(
      result => {
        this.resultobj = result;
        this.myData1 = result;
        if (this.myData1 != null) {
          this.createFirstLevelChartXMLFedex(this.myData1);
        }
      },
      error => {
        console.log('error ', error);

      })
  }

  async createFirstLevelChartXMLFedex(mapData1: any) {
    var filterVal = this.fedexFormGroup.get('filter')?.value;
    var serviceFilter = this.fedexFormGroup.get('servicefilter')?.value;

    if (filterVal == "SHP" || filterVal == "BW") {
      await this.createSeriesXMLFedex(mapData1, "state", "shipmentInbound");
    }
    else if (serviceFilter == "Ground") {
      await this.createSeriesXMLFedex(mapData1, "state", "Ground");
    } else {
      await this.createSeriesXMLFedex(mapData1, "state", "shipmentInbound")
    }

  }
  async createSeriesXMLFedex(collection: any, nameField: String, yField: String) {
    if (collection != null) {
      var chartData = [];

      for (var loop = 0; loop < collection.length; loop++) {
        var monthObj = collection[loop];
        if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
          //service level FRT
          var stateData;
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "FRT") {
            if (loop == 0) {
              {
                stateData = "US-" + monthObj.state;
                chartData.push({ id: stateData, value: monthObj.ground_FRT });
              };
            }  //CA
            else if (loop == 1) {
              stateData = "US-" + monthObj.state;
              chartData.push({ id: stateData, value: monthObj.ground_FRT });
            }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FRT }); }
          }
          else if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FRT }); }
          }
          else if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FRT }); }
          }
          else if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2Day_FRT }); }
          }
          else if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2DayAM_FRT }); }
          }
          else if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FRT }); }
          }
          else if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandard_Overnight_FRT }); }
          }
          else if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_FRT }); }
          }
          else if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FRT }); }
          }
          else if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FRT }); }
          }
          //service level FRT
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_ShipInBound }); }
          }
          else if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_ShipInBound }); }
          }
          else if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_ShipInBound }); }
          }
          else if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_ShipInBound }); }
          }
          else if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_ShipInBound }); }
          }
          else if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_ShipInBound }); }
          }
          else if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_ShipInBound }); }
          }
          else if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_ShipInBound }); }
          }
          else if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_ShipInBound }); }
          }
          else if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_ShipInBound }); }
          }
          //service level FRT+ACC
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_FrtAcc }); }
          }
          else if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_FrtAcc }); }
          }
          else if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_FrtAcc }); }
          }
          else if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_FrtAcc }); }
          }
          else if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_FrtAcc }); }
          }
          else if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_FrtAcc }); }
          }
          else if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_FrtAcc }); }
          }
          else if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }
          }
          else if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_FrtAcc }); }
          }
          else if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_FrtAcc }); }
          }
          //Service level BW
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.ground_BilledWeight }); }
          }
          else if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExExpressSaver_BilledWeight }); }
          }
          else if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExFirstOvernight_BilledWeight }); }
          }
          else if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2day_BilledWeight }); }
          }
          else if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedEx2dayAM_BilledWeight }); }
          }
          else if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExPriorityOvernight_BilledWeight }); }
          }
          else if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.fedExStandardOvernight_BilledWeight }); }
          }
          else if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.homeDelivery_BilledWeight }); }
          }
          else if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.internationalGround_BilledWeight }); }
          }
          else if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.smartPost_BilledWeight }); }
          }

        }
        else {
          if (this.t004filteritem_type == "SHP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.shipmentInbound }); }
          }
          else if (this.t004filteritem_type == "FRT") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightCharges }); }
          }
          else if (this.t004filteritem_type == "ACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.freightChargesAccess }); }
          }
          else if (this.t004filteritem_type == "BW") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.totalBilledWeight }); }
          }
          else if (this.t004filteritem_type == "ACPP") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound }); }
          }
          else if (this.t004filteritem_type == "ACS") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_shipment_total }); }
          }
          else if (this.t004filteritem_type == "ASACC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearavg_cost_per_shipment_acc }); }
          }
          else if (this.t004filteritem_type == "ACPPCC") {
            if (loop == 0) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //CA
            else if (loop == 1) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //TX
            else if (loop == 2) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //FL
            else if (loop == 3) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //NY
            else if (loop == 4) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //PA
            else if (loop == 5) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //IL
            else if (loop == 6) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //OH
            else if (loop == 7) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //NJ
            else if (loop == 8) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //VA
            else if (loop == 9) { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }  //CO
            else { stateData = "US-" + monthObj.state; chartData.push({ id: stateData, value: monthObj.yearAvg_cost_per_pound_acc }); }
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



    // Configure series tooltip
    var polygonTemplate = polygonSeries.mapPolygons.template;
    //polygonTemplate.tooltipText = "{name}: {value}";
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
    let myEvent = polygonTemplate.events.on("hit", (ev: any) => {
      const category: any = ev.target.dataItem.dataContext;
      const categoryName: any = category;

      if (categoryName["value"] != 0) {
        this.openLoading();
        this.heatmap_pointClickHandlerFedex(categoryName);
      }
    });

    this.closeLoading();
    this.closeLoading();

    let heatLegend: any = chart.createChild(am4maps.HeatLegend);
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
    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

    // Configure label series
    var labelSeries = chart.series.push(new am4maps.MapImageSeries());
    var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
    labelTemplate.horizontalCenter = "middle";
    labelTemplate.verticalCenter = "middle";
    if (this.themeoption == "dark")
      labelTemplate.fill = am4core.color("#353c48");
    else
      labelTemplate.fill = am4core.color("#ffffff");
    labelTemplate.fontSize = 10;
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


  async fetchCountryBarchart() {
    await this.httpfedexService.fetchCountryBarchart(this.fedexFormGroup.value).subscribe(
      result => {
        this.resultobj = result;
        this.Country_barchartAC = result;

        this.refreshChartsFedex(result);
      },
      error => {

      })
  }
  async refreshChartsFedex(result: any) {
    if (this.levelFedex == "T" || this.levelFedex == "F" || this.levelFedex == "S") {
      await this.Bar_chartshpFedex(result, "1stlevel");
      await this.pie_chart_NewFedex(result, this.levelFedex);

    }
  }
  temparray: any = [];
  async Bar_chartshpFedex(tempAC: any, field1: String) {
    this.temparray = [];
    for (var Count = 1; Count <= 12; Count++) {
      var t601ACObj: any = [];
      t601ACObj["getMonth"] = Count;
      this.temparray.push(t601ACObj);
    }
    for (var loop = 0; loop < tempAC.length; loop++) {
      var t601resultObj = tempAC[loop];
      for (var innerLoop = 0; innerLoop < this.temparray.length; innerLoop++) {
        if (this.temparray[innerLoop].getMonth == t601resultObj.getMonth) {
        }
      }
    }

    this.closeLoading();
    var filterVal = this.fedexFormGroup.get('filter')?.value;

    if (filterVal == "SHP") {
      await this.createSeriesFromACFedex(tempAC, field1);
    } else if (filterVal == "BW") {
      await this.createSeriesFromACFedex(tempAC, field1);
    }
    else {
      await this.createSeriesFromACFedex(tempAC, field1);
    }
  }

  async createSeriesFromACFedex(collection: any, field1: String) {
    // this.closeLoading();
    var chartData = [];
    if (collection.length > 0) {
      for (var loop = 0; loop < collection.length; loop++) {
        var monthObj = collection[loop];
        var monthVal = monthObj.getMonth + "";
        var monthStr = this.hashMapObj.get(monthVal);
        if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
          //Service level FRT
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.ground_FRT });
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.fedExExpressSaver_FRT });
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.fedExFirstOvernight_FRT });
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.fedEx2Day_FRT });
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.fedEx2DayAM_FRT });
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.fedExPriorityOvernight_FRT });
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.fedExStandard_Overnight_FRT });
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.homeDelivery_FRT });
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.internationalGround_FRT });
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.smartPost_FRT });
          //shipment inbound service SHP
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.ground_ShipInBound });
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.fedExExpressSaver_ShipInBound });
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.fedExFirstOvernight_ShipInBound });
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.fedEx2day_ShipInBound });
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.fedEx2dayAM_ShipInBound });
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.fedExPriorityOvernight_ShipInBound });
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.fedExStandardOvernight_ShipInBound });
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.homeDelivery_ShipInBound });
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.internationalGround_ShipInBound });
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.smartPost_ShipInBound });
          //Service level ACC
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.ground_FrtAcc });
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.fedExExpressSaver_FrtAcc });
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.fedExFirstOvernight_FrtAcc });
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.fedEx2day_FrtAcc });
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.fedEx2dayAM_FrtAcc });
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.fedExPriorityOvernight_FrtAcc });
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.fedExStandardOvernight_FrtAcc });
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.homeDelivery_FrtAcc });
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.internationalGround_FrtAcc });
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.smartPost_FrtAcc });
          //Service level BW
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.ground_BilledWeight });
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.fedExExpressSaver_BilledWeight });
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.fedExFirstOvernight_BilledWeight });
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.fedEx2day_BilledWeight });
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.fedEx2dayAM_BilledWeight });
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.fedExPriorityOvernight_BilledWeight });
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.fedExStandardOvernight_BilledWeight });
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.homeDelivery_BilledWeight });
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.internationalGround_BilledWeight });
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.smartPost_BilledWeight });
        }
        else {
          if (this.t004filteritem_type == "SHP")
            chartData.push({ date: monthStr, value: monthObj.shipmentInbound });
          if (this.t004filteritem_type == "FRT")
            chartData.push({ date: monthStr, value: monthObj.freightCharges });
          if (this.t004filteritem_type == "ACC")
            chartData.push({ date: monthStr, value: monthObj.freightChargesAccess });
          if (this.t004filteritem_type == "BW")
            chartData.push({ date: monthStr, value: monthObj.totalBilledWeight });
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
      chartData.push({ date: "DEC", value: "0" });
    }


    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end
    // Create chart instance
    let chart = am4core.create("month_wize", am4charts.XYChart);

    // Add data
    chart.data = chartData;

    // Create axes
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
  async pie_chart_NewFedex(pie_AC: any, pietype: any) {
    var filterVal = this.fedexFormGroup.get('filter')?.value;

    var field2 = filterVal;


    if (filterVal == "SHP" || filterVal == "FRT" || filterVal == "ACC" || filterVal == "BW") {
      await this.pie_dataFedex(pie_AC, pietype, field2, "", "", "");
    }
    else {
      await this.pie_data_AvgFedex(pie_AC, pietype, field2, "", "", "");
    }
    // this.closeLoading();
  }
  async pie_dataFedex(coll: any, field1: any, fieldVal: any, yField: any, seriesName: any = null, type: any = null) {
    var selectFilter = this.fedexFormGroup.get('filter')?.value;
    var field2 = this.filterLabel.find((xdata: any) => xdata.value == fieldVal).label;


    this.t004filterService_type = this.fedexFormGroup.get('servicefilter')?.value;
    var tot_shp = 0;

    var chartData = [];
    if (coll.length > 0) {

      for (var count1 = 0; count1 < coll.length; count1++) {

        this.t004filteryear['year'] = this.fedexFormGroup.get('year')?.value;
        var temptotal = 0;
        if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
          //Serveice level FRT
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).ground_FRT);
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).fedExExpressSaver_FRT);
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).fedExFirstOvernight_FRT);
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).fedEx2Day_FRT);
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).fedEx2DayAM_FRT);
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).fedExPriorityOvernight_FRT);
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).fedExStandard_Overnight_FRT);
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).homeDelivery_FRT);
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).internationalGround_FRT);
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).smartPost_FRT);
          //service level shp
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).ground_ShipInBound);
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).fedExExpressSaver_ShipInBound);
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).fedExFirstOvernight_ShipInBound);
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).fedEx2day_ShipInBound);
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).fedEx2dayAM_ShipInBound);
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).fedExPriorityOvernight_ShipInBound);
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).fedExStandardOvernight_ShipInBound);
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).homeDelivery_ShipInBound);
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).internationalGround_ShipInBound);
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).smartPost_ShipInBound);
          //Serveice level FRT+ACC 
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).ground_FrtAcc);
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).fedExExpressSaver_FrtAcc);
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).fedExFirstOvernight_FrtAcc);
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).fedEx2day_FrtAcc);
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).fedEx2dayAM_FrtAcc);
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).fedExPriorityOvernight_FrtAcc);
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).fedExStandardOvernight_FrtAcc);
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).homeDelivery_FrtAcc);
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).internationalGround_FrtAcc);
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).smartPost_FrtAcc);
          //Serveice level BW
          if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).ground_BilledWeight);
          if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).fedExExpressSaver_BilledWeight);
          if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).fedExFirstOvernight_BilledWeight);
          if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).fedEx2day_BilledWeight);
          if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).fedEx2dayAM_BilledWeight);
          if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).fedExPriorityOvernight_BilledWeight);
          if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).fedExStandardOvernight_BilledWeight);
          if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).homeDelivery_BilledWeight);
          if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).internationalGround_BilledWeight);
          if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).smartPost_BilledWeight);
        }
        else {
          if (this.t004filteritem_type == "SHP")
            temptotal = Number((coll[count1]).shipmentInbound);
          if (this.t004filteritem_type == "FRT")
            temptotal = Number((coll[count1]).freightCharges);
          if (this.t004filteritem_type == "ACC")
            temptotal = Number((coll[count1]).freightChargesAccess);

          if (this.t004filteritem_type == "BW")
            temptotal = Number((coll[count1]).totalBilledWeight);
        }

        if (isNaN(temptotal))
          temptotal = 0;
        else
          tot_shp += temptotal;

      }
      this.totalus_value = tot_shp;

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
    else {
      if (field1 == "F") {
        this.countryTotal = 0;
        chartData.push({ name: field2, value: this.countryTotal });
      }
      else if (field1 == "S") {
        this.stateTotal = 0;
        chartData.push({ name: field2, value: this.countryTotal - this.stateTotal });
        chartData.push({ name: field2 + " " + this.clickedName, value: stateTotal });

      }
      else {
        this.countyTotal = 0;
        chartData.push({ name: field2, value: this.countryTotal - this.stateTotal });
        chartData.push({ name: field2 + " " + this.clickedName, value: stateTotal - this.countyTotal });
        chartData.push({ name: field2 + " " + this.countyName, value: this.countyTotal });

      }

    }

    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    let chart = am4core.create("pie_chart", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0;

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
    // this.closeLoading();
  }
  async pie_data_AvgFedex(coll_Avg: any, field1: String, field2: String, yField: String, seriesName: any = null, type: any = null) {
    var temptotal_avg = 0;
    if (coll_Avg.length > 0) {
      for (var count1 = 0; count1 < coll_Avg.length; count1++) {
        this.t004filteryear_Avg_year = this.fedexFormGroup.get('year')?.value;
        if (this.t004filteritem_Avg_type == "ACPP")
          temptotal_avg = Number((coll_Avg[count1]).overallYearAvgCostPerPound);

        if (this.t004filteritem_Avg_type == "ACS")
          temptotal_avg = Number((coll_Avg[count1]).overallYearAvgCostPerShipment);

        if (this.t004filteritem_Avg_type == "ASACC")
          temptotal_avg = Number((coll_Avg[count1]).overallYearavgCostPerShipmentAcc);

        if (this.t004filteritem_Avg_type == "ACPPCC")
          temptotal_avg = Number((coll_Avg[count1]).overallYearAvgCostPerPoundAcc);
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
    // this.closeLoading();
  }

  async filter_cmb_clickHandlerFedex() {
    this.openLoading();
    var filterVal = this.fedexFormGroup.get('filter')?.value;
    await this.fedexFormGroup.get('servicefilter')?.setValue("ALL");
    if (filterVal == "ACPP" || filterVal == "ACS" || filterVal == "ASACC" || filterVal == "ACPPCC") {
      this.openModal("Work in Progress");
      this.closeLoading();
    } else {
      this.t004filterService['type'] = "ALL";
      this.t004filteritem['type'] = this.fedexFormGroup.get('filter')?.value;
      this.t004filterService['type'] = this.fedexFormGroup.get('servicefilter')?.value;
      this._isSecondLevel = false;
      this.lbl_nodata_visible = false;
      this.pieChart_visible = true;
      this.levelFedex = "F";
      this.Servicelevel = "No";
      this.onBackButtonClickFedex();
    }
  }


  async Service_filter_cmb_clickHandlerFedex() {
    this.openLoading();
    var servicefilter = this.fedexFormGroup.get('servicefilter')?.value;
    await this.fedexFormGroup.get('servicefilter')?.setValue(servicefilter);
    await this.fedexFormGroup.get('state')?.setValue(null);
    await this.fedexFormGroup.get('county')?.setValue(null);
    this.t004filterService['type'] = this.fedexFormGroup.get('servicefilter')?.value;
    this.t004filterService_type = this.fedexFormGroup.get('servicefilter')?.value;
    this._isSecondLevel = false;
    this.lbl_nodata_visible = false;
    this.pieChart_visible = true;

    this.levelFedex = "F";
    if (this.t004filterService_type == 'ALL') {
      this.Servicelevel = "No";
      this.t004filterService['type'] == '';
    }
    else {
      this.Servicelevel = "Yes";
    }


    await this.creation_HandlerFedex();
    this.btnBack_visible = false;
    this.btnBack_includeInLayout = false;

  }
  async Recieved_Shipped_CountHandlerFedex() {
    var type = await this.fedexFormGroup.get('type')?.value;
    this.openLoading();
    await this.fedexFormGroup.get('state')?.setValue(null);
    await this.fedexFormGroup.get('county')?.setValue(null);
    this.t004filterService['type'] = this.fedexFormGroup.get('servicefilter')?.value;
    this.t004filterService_type = this.fedexFormGroup.get('servicefilter')?.value;
    this._isSecondLevel = false;
    this.lbl_nodata_visible = false;
    this.pieChart_visible = true;

    this.levelFedex = "F";
    if (this.t004filterService_type == 'ALL') {
      this.Servicelevel = "No";
      this.t004filterService['type'] == '';
    }
    else {
      this.Servicelevel = "Yes";
    }


    await this.creation_HandlerFedex();
    this.btnBack_visible = false;
    this.btnBack_includeInLayout = false;

  }

  async onBackButtonClickFedex() {
    this.openLoading();
    this.levelFedex = "F";
    this.stateName = null;
    await this.fedexFormGroup.get('state')?.setValue(null);
    await this.fedexFormGroup.get('county')?.setValue(null);
    this.countyName = null;
    this._isSecondLevel = false;
    this.btnBack_visible = false;
    this.btnBack_includeInLayout = false;
    this.desc_detail_visible = false;
    this.showTitleData.set(true);
    this.creation_HandlerFedex();
  }
  async cmb_year_changeHandlerFedex() {
    this.openLoading();
    await this.fedexFormGroup.get('servicefilter')?.setValue("ALL");
    var filterVal = this.fedexFormGroup.get('filter')?.value;

    var yearVal = this.fedexFormGroup.get('year')?.value;
    this.yearTitleFedex.set(this.fedexFormGroup.get('year')?.value);
    await this.fedexFormGroup.get('year')?.setValue(yearVal);
    await this.fedexFormGroup.get('getYear')?.setValue(yearVal);
    var servicefilter = this.fedexFormGroup.get('servicefilter')?.value;
    if (filterVal == "ACPP") {
      this.openModal("Work in Progress");
    }
    this.t004filteryear_year = this.fedexFormGroup.get('year')?.value;
    this.t004filterService_type = "ALL";
    this.description_id_text = "Click On Any State to Zoom In";
    this.desc_detail_visible = true;
    if (filterVal == "FRT") {
      this.desc_detail_text = "for" + " " + this.t004filteryear_year + " " + " FRT Only in " + servicefilter + " " + "data";
    } else {
      this.desc_detail_text = "for" + " " + this.t004filteryear_year + " " + filterVal + " " + "data";
    }

    this.levelFedex = "F";
    this.onBackButtonClickFedex();
    this._isSecondLevel = false;


    var clientname = this.fedexFormGroup.get('clientname')?.value;
    var client_id = this.fedexFormGroup.get('client_id')?.value;
    await this.fetchdisplayHeatmaplist();
    this.t004CountryBarchartObj_year = this.fedexFormGroup.get('year')?.value;
    await this.fetchCountryBarchart();
  }

  async heatmap_pointClickHandlerFedex(event: any) {

    var eventID = event.id.replace("US-", "")
    this.showTitleData.set(false);
    this.countyNameValue = event.name;
    this.t004filteritem_type = this.fedexFormGroup.get('filter')?.value;
    this.t004filteryear_year = this.fedexFormGroup.get('year')?.value;
    var serviceFilter = this.fedexFormGroup.get('servicefilter')?.value;

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


    if (this.levelFedex == "F") {
      this.stateName = this.regionID;
      this.countyName = null;
    }
    else
      this.countyName = this.regionName;

    this._tempRegion_id = this.regionID;


    await this.fedexFormGroup.get('state')?.setValue(this.stateName);
    await this.fedexFormGroup.get('county')?.setValue(this.countyName);
    // await this.fetchCountryBarchart();
    if (this.levelFedex == "F") {
      this.fetchCityShipment();
    } else { this.fetchCountryBarchart(); }


    if (!this._isSecondLevel) {

      this.levelFedex = "S";
      this.btnBack_visible = true;
      this.btnBack_includeInLayout = true;
      this._isSecondLevel = true;

    }
    else
      this.levelFedex = "T";

  }
  async fetchCityShipment() {
    await this.httpfedexService.fetchCityShipment(this.fedexFormGroup.value).subscribe(
      result => {
        if (result != null) {
          this.Heatmap = this.createSecondLevelChartXMLFedex(this._tempRegion_id, result);
          this.fetchCountryBarchart();
        }
        this.resultobj = result;
      },
      error => {

      })
  }
  async createSecondLevelChartXMLFedex(stateAbbr: any, second_dataAC: any) {
    var filterVal = this.fedexFormGroup.get('filter')?.value;

    if (filterVal == "SHP" || filterVal == "BW") {
      await this.createSeriesSecondLevelFedex(second_dataAC, "county", "shipment_inbound");

    } else {
      await this.createSeriesSecondLevelFedex(second_dataAC, "county", "shipment_inbound");

    }

  }
  async createSeriesSecondLevelFedex(cityresultAC: any, stateName: String, yField: String) {
    var chartData = [];
    for (var loop = 0; loop < cityresultAC.length; loop++) {

      var monthObj = cityresultAC[loop];

      if (this.Servicelevel == "Yes" && this.t004filterService_type != '') {
        //Service Level FRT
        if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "FRT") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FRT ? monthObj.ground_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "FRT") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FRT ? monthObj.fedExExpressSaver_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "FRT") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FRT ? monthObj.fedExFirstOvernight_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "FRT") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2Day_FRT ? monthObj.fedEx2Day_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "FRT") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2DayAM_FRT ? monthObj.fedEx2DayAM_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "FRT") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FRT ? monthObj.fedExPriorityOvernight_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "FRT") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandard_Overnight_FRT ? monthObj.fedExStandard_Overnight_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "FRT") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FRT ? monthObj.homeDelivery_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "FRT") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FRT ? monthObj.internationalGround_FRT : 0 });
          }
        }
        if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "FRT") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FRT ? monthObj.smartPost_FRT : 0 });
          }
        }
        //service level shp

        if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.groundResidential ? monthObj.groundResidential : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.groundResidential ? monthObj.groundResidential : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_ShipInBound ? monthObj.ground_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_ShipInBound ? monthObj.fedExExpressSaver_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_ShipInBound ? monthObj.fedExFirstOvernight_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_ShipInBound ? monthObj.fedEx2day_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_ShipInBound ? monthObj.fedEx2dayAM_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_ShipInBound ? monthObj.fedExPriorityOvernight_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_ShipInBound ? monthObj.fedExStandardOvernight_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_ShipInBound ? monthObj.homeDelivery_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_ShipInBound ? monthObj.internationalGround_ShipInBound : 0 });
          }
        }
        if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "SHP") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_ShipInBound ? monthObj.smartPost_ShipInBound : 0 });
          }
        }
        //Service Level FRT+ ACC
        if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_FrtAcc ? monthObj.ground_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_FrtAcc ? monthObj.fedExExpressSaver_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_FrtAcc ? monthObj.fedExFirstOvernight_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "ACC") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_FrtAcc ? monthObj.fedEx2day_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_FrtAcc ? monthObj.fedEx2dayAM_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_FrtAcc ? monthObj.fedExPriorityOvernight_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_FrtAcc ? monthObj.fedExStandardOvernight_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_FrtAcc ? monthObj.homeDelivery_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_FrtAcc ? monthObj.internationalGround_FrtAcc : 0 });
          }
        }
        if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "ACC") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_FrtAcc ? monthObj.smartPost_FrtAcc : 0 });
          }
        }
        //SERVICE level BW
        if (this.t004filterService_type == "Ground" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.ground_BilledWeight ? monthObj.ground_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "FedExExpressSaver" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExExpressSaver_BilledWeight ? monthObj.fedExExpressSaver_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "FedExFirstOvernight" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExFirstOvernight_BilledWeight ? monthObj.fedExFirstOvernight_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2day" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2day_BilledWeight ? monthObj.fedEx2day_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "FedEx2dayAM" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedEx2dayAM_BilledWeight ? monthObj.fedEx2dayAM_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "FedExPriorityOvernight" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExPriorityOvernight_BilledWeight ? monthObj.fedExPriorityOvernight_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "FedExStandardOvernight" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.fedExStandardOvernight_BilledWeight ? monthObj.fedExStandardOvernight_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "HomeDelivery" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.homeDelivery_BilledWeight ? monthObj.homeDelivery_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "InternationalGround" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.internationalGround_BilledWeight ? monthObj.internationalGround_BilledWeight : 0 });
          }
        }
        if (this.t004filterService_type == "GroundEconomy" && this.t004filteritem_type == "BW") {

          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.smartPost_BilledWeight ? monthObj.smartPost_BilledWeight : 0 });
          }
        }
      } else {
        if (this.t004filteritem_type == "SHP") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.shipmentInbound ? monthObj.shipmentInbound : 0 });
          }
        }
        if (this.t004filteritem_type == "FRT") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightCharges ? monthObj.freightCharges : 0 });
          }
        }
        if (this.t004filteritem_type == "ACC") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.freightChargesAccess ? monthObj.freightChargesAccess : 0 });
          }
        }
        if (this.t004filteritem_type == "BW") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.totalBilledWeight ? monthObj.totalBilledWeight : 0 });
          }
        }
        if (this.t004filteritem_type == "ACPP") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPound ? monthObj.avgCostPerPound : 0 });
          }
        }
        if (this.t004filteritem_type == "ACS") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipment ? monthObj.avgCostPerShipment : 0 });
          }
        }
        if (this.t004filteritem_type == "ASACC") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerShipmentAccess ? monthObj.avgCostPerShipmentAccess : 0 });
          }
        }
        if (this.t004filteritem_type == "ACPPCC") {
          if (loop == 0) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 1) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 2) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 3) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 4) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 5) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 6) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 7) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 8) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }
          else if (loop == 9) {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }

          else {
            chartData.push({ id: monthObj.postalId, value: monthObj.avgCostPerPoundAccess ? monthObj.avgCostPerPoundAccess : 0 });
          }

        }
      }

    }


    // Create map instance
    var chart = am4core.create("chartdiv", am4maps.MapChart);

    stateName = this.fedexFormGroup.get('state')?.value + "";

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



    // Set projection0 
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

    let myEvent = polygonTemplate.events.on("hit", function (ev: any) {

      var category: object = ev.target.dataItem.dataContext;
      var categoryName: any = category;
      if (categoryName["value"] != 0) {
        this.openLoading();
        this.heatmap_pointClickHandlerFedex(categoryName);
      }
    }, this);
    this.closeLoading();
  }

  ///*Fedex API *////
  clickSearchFun(event: any) {
    if (event == "open") {
      this.searchActive = true;
    }
    else {
      this.searchActive = false;
    }
  }
   openEnd(content: TemplateRef<any>) {
      const offcanvasRef: NgbOffcanvasRef =
        this.offcanvasService.open(content, { position: 'end' });
  
      // Fires when DOM is fully rendered
      offcanvasRef.shown.subscribe(() => {
        this.attribute = document.documentElement.getAttribute('data-layout');
      });
    }

  async saveOrUpdateReportLogResult(result: any) {

    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");



  }
  excelDownload_clickHandlerFedex() {
    var urlParam: any = {};
    var urlParamArr = [];
    var clickedYear = this.fedexFormGroup.get('year')?.value;
    var chargeType = this.fedexFormGroup.get('servicefilter')?.value;
    var type = this.fedexFormGroup.get('type')?.value;
    if (this.countyName == undefined) {
      this.countyName = null;
    }
    var clientId = this.clientID;
    var currentDate = new Date();
    var currentYear = new Date().getFullYear();
    var dateValue = this.datePipe.transform(currentDate, "yyyy-MM-dd");
    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
    var strYearEnd = this.userProfifleFedex.fileenddate1.substring(0, 4);
    var strMonthEnd = this.userProfifleFedex.fileenddate1.substring(4, 6);
    var strDateEnd = this.userProfifleFedex.fileenddate1.substring(6, 8);
    var dataasof = strMonthEnd + "-" + strDateEnd + "-" + strYearEnd;

    if (clickedYear == currentYear)
      urlParam['toDate'] = this.datePipe.transform(dataasof, "yyyy-MM-dd");
    else
      urlParam['toDate'] = clickedYear + "-12" + "-31";

    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    if (type == "Shipper") {
      urlParam['reportType'] = "DomesticMap Sender Detail Report";
      urlParam['reportName'] = "DomesticMap_Sender_Detail_Report";
    }
    else {
      urlParam['reportType'] = "DomesticMap Recipient Detail Report";
      urlParam['reportName'] = "DomesticMap_Recipient_Detail_Report";
    }


    urlParam['reportFormat'] = "excel";
    urlParam['clientName'] = (this.userProfifleFedex.clientName).replace(/[^a-zA-Z0-9 ]/g, "");
    urlParam['clientId'] = clientId;
    urlParam['fromDate'] = clickedYear.toString() + "-01-01";
    //urlParam['toDate']= dateValue;
    urlParam['loginId'] = 0;
    urlParam['modulename'] = "Graphicalmap_Report";
    urlParam['status'] = "IN QUEUE";
    urlParam['year'] = clickedYear;
    urlParam['desc'] = "";
    urlParam['grp'] = "";
    urlParam['chargeType'] = chargeType;
    urlParam['chargeDesc'] = this.countyName;
    urlParam['chargeGroup'] = type;
    urlParam['t002ClientProfileobj'] = this.fedexFormGroup.get('t002ClientProfile')?.value;
    urlParamArr.push(urlParam);
    this.httpfedexService.runReport(urlParam).subscribe(
      result => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error => {
      });
  }

  async saveOrUpdateReportLogResultFedex(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");


  }
} 
