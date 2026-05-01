import { Component, HostListener, OnInit, OnDestroy, signal, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { FedexInternationalPopupComponent } from '../popup/international-popup/international-popup.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';

@Component({
  selector: 'app-fedex-international',
  templateUrl: './international.component.html',
  styleUrls: ['./international.component.scss'],
  standalone: false
})
export class FedExInternationalComponent implements OnInit, OnDestroy {
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
  });
  totalpackagetemp: any;
  clientType = signal<any>('');
  randomNumber: any;
  selectYear: any = [];

  internationalGroundtxt_id: any;
  fedexIntlEconomytxt_id: any;
  fedexIntlPrioritytxt_id: any;
  fedexInternationalFirsttxt_id: any;
  FedExInternationalNextFlighttxt_id: any;
  fedExInternationalMailServicetxt_id: any;
  internationalHomeDeliverytxt_id: any;
  fedexIntlExpressSavertxt_id: any;
  fedexIntlIntlDirectDistFrttxt_id: any;
  fedExIntlPriorityFrttxt_id: any;
  fedExIntlEconomyFrttxt_id: any;
  fedExIntlEconomyDisttxt_id: any;
  fedExIntlPrtyDirDisttxt_id: any;
  intlMailServiceEconomytxt_id: any;
  intlMailServicePrioritytxt_id: any;
  chargetypevalueFedEx = "INT+ACC";
  typecodevalueFedEx = "Exp";
  internationalGroundService = signal<any>([]);
  worldwideexpeditedtxt_id: any;
  worldwideexpresstxt_id: any;
  worldwidesavertxt_id: any;
  worldwidestandardtxt_id: any;

  worldwideexpressEartlytxt_id: any;
  worldwideexpressPlustxt_id: any;
  worldwideexpressPlusReturnstxt_id: any;
  worldwideexpressReturnstxt_id: any;
  worldwidesaverReturnstxt_id: any;
  worldwidefreighttxt_id: any;

  chargetypevalue = "INT+ACC";
  frtAndFrt_AccBtnVal = "FRT+ACC";
  typecodevalue = "Exp";
  expAndImpVal = "Exp"
  chargeType = "FRT+ACC";//To preselect value of radio btn
  typecode = "Exp";//To preselect value of radio btn
  cmb_year: any;
  clickedYear: any;
  internationalFormBuilderGroup: any;
  clientId: any;
  clientName: any;
  displayYear = new Date().getFullYear();
  cmb_yearSelectedIndex: any;
  currentyear: any;
  projectName: any;
  chargeDesList = [];
  chargeBack_result: any = [];
  worldwide_Expedited: any;
  worldwide_Express: any;
  worldwide_Saver: any;
  worldwide_Standard: any;
  worldwide_ExpressEartly: any;
  worldwide_ExpressPlus: any;
  worldwide_ExpressPlusReturns: any;
  worldwide_ExpressReturns: any;
  worldwide_SaverReturns: any;
  worldwide_Freight: any;
  maxValue = 0;
  finalmaxValue = 0;
  changeTitle: any;
  worldwide_Expedited_progressBar_visible: any;
  worldwide_Expedited_progressBar_includeInLayout: any;
  worldwide_Expedited_progressBar_label_visible: any;
  worldwide_Expedited_progressBar_label_includeInLayout: any;
  worldwide_Express_progressBar_visible: any;
  worldwide_Express_progressBar_includeInLayout: any;
  worldwide_Express_progressBar_label_visible: any;
  worldwide_Express_progressBar_label_includeInLayout: any;
  worldwide_Express_Saver_progressBar_visible: any;
  worldwide_Express_Saver_progressBar_includeInLayout: any;
  worldwide_Express_Saver_progressBar_label_visible: any;
  worldwide_Express_Saver_progressBar_label_includeInLayout: any;
  worldwide_Saver_progressBar_visible: any;
  worldwide_Saver_progressBar_includeInLayout: any;
  worldwide_Saver_progressBar_label_visible: any;
  worldwide_Saver_progressBar_label_includeInLayout: any;
  worldwide_Standard_progressBar_visible: any;
  worldwide_Standard_progressBar_includeInLayout: any;
  worldwide_Standard_progressBar_label_visible: any;
  worldwide_Standard_progressBar_label_includeInLayout: any;

  worldwide_Expedited_progressBar: any;
  worldwide_Express_progressBar: any;
  // worldwide_Express_Saver_progressBar;
  worldwide_Saver_progressBar: any;
  worldwide_Standard_progressBar: any;

  worldwide_ExpressEartly_progressBar: any;
  worldwide_ExpressPlus_progressBar: any;
  worldwide_ExpressPlusReturns_progressBar: any;
  worldwide_ExpressReturns_progressBar: any;
  worldwide_SaverReturns_progressBar: any;
  worldwide_Freight_progressBar: any;

  Imp_btn: any;
  frt_btn: any;
  Exp_btn: any;
  frtacc_btn: any;
  totalquantitytemp: any = 0;
  themeoption: any;
  panelClass: any;

  resultobj: any;


  International_Ground: any;
  FedEx_Intl_Economy: any;
  FedEx_Intl_Priority: any;
  FedEx_International_First: any;
  FedEx_International_Next_Flight: any;
  FedEx_International_MailService: any;
  FedEx_Intl_Priority_Frt: any;
  FedEx_Intl_Economy_Frt: any;
  FedEx_Intl_Economy_Dist: any;
  FedEx_Intl_Prty_DirDist: any;
  Intl_MailService_Economy: any;
  Intl_MailService_Priority: any;
  International_Home_Delivery: any;
  Fedex_Intl_Express_Saver: any;
  Fedex_Intl_DirectDist_Frt: any;
  international_ground_progressBar_visible: any;
  international_ground_progressBar_label_visible: any;
  fedex_intl_economy_progressBar_visible: any;
  fedex_intl_economy_progressBar_label_visible: any;
  fedex_intl_priority_progressBar_visible: any;
  fedex_intl_priority_progressBar_label_visible: any;
  fedex_international_first_progressBar_visible: any;
  fedex_international_first_progressBar_label_visible: any;
  FedEx_International_Next_Flight_progressBar_visible: any;
  FedEx_International_Next_Flight_progressBar_label_visible: any;
  FedEx_International_MailService_progressBar_visible: any;
  FedEx_International_MailService_progressBar_label_visible: any;
  FedEx_Intl_Priority_Frt_progressBar_visible: any;
  FedEx_Intl_Priority_Frt_progressBar_label_visible: any;
  FedEx_Intl_Economy_Frt_progressBar_visible: any;
  FedEx_Intl_Economy_Frt_progressBar_label_visible: any;
  FedEx_Intl_Economy_Dist_progressBar_visible: any;
  FedEx_Intl_Economy_Dist_progressBar_label_visible: any;
  FedEx_Intl_Prty_DirDist_progressBar_visible: any;
  FedEx_Intl_Prty_DirDist_progressBar_label_visible: any;
  Intl_MailService_Economy_progressBar_visible: any;
  Intl_MailService_Economy_progressBar_label_visible: any;
  Intl_MailService_Priority_progressBar_visible: any;
  Intl_MailService_Priority_progressBar_label_visible: any;
  international_ground_progressBar: any;
  fedex_intl_economy_progressBar: any;
  fedex_intl_priority_progressBar: any;
  fedex_international_first_progressBar: any;
  FedEx_International_Next_Flight_progressBar: any;
  FedEx_International_MailService_progressBar: any;
  FedEx_Intl_Priority_Frt_progressBar: any;
  FedEx_Intl_Economy_Frt_progressBar: any;
  FedEx_Intl_Economy_Dist_progressBar: any;
  FedEx_Intl_Prty_DirDist_progressBar: any;
  Intl_MailService_Economy_progressBar: any;
  Intl_MailService_Priority_progressBar: any;
  international_HomeDelivery_progressBar: any;
  fedex_intl_Express_progressBar: any;
  fedex_intl_DirDistFrt_progressBar: any;
  chargeBack_resultFedEx: any;
  internationalFormGroup = new FormGroup({
    invoiceyear: new FormControl(''),
    themeoption: new FormControl(''),
    clientId: new FormControl(''),
    clientName: new FormControl(''),
    year: new FormControl(""),
    groupby: new FormControl(""),
    client_name: new FormControl(""),
    clientname: new FormControl(""),
    typecode: new FormControl(""),
    client_id: new FormControl(""),
    chargetypevalue: new FormControl("FRT+ACC"),
    chargeDescription: new FormControl(""),
    chargeType: new FormControl('INT+ACC'),
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
  ///*Fedex API *////
  fedexFormGroup = new FormGroup({
    county: new FormControl(''),
    state: new FormControl(''),
    clientname: new FormControl(''),
    clientId: new FormControl(''),
    themeoption: new FormControl(''),
    getYear: new FormControl(''),
    year: new FormControl(''),
    client_id: new FormControl(''),

    typeCode: new FormControl(''),
    chargeDescription: new FormControl(''),
    chargeGroup: new FormControl(''),
    chargeType: new FormControl('INT+ACC'),
    chargetypevalue: new FormControl(''),
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
  private mapChart?: am4maps.MapChart;

  constructor(private cookiesService: CookiesService, private dialog: MatDialog, private datePipe: DatePipe, private httpfedexService: HttpfedexService, private router: Router, private commonService: CommonService, private loaderService: LoaderService, private zone: NgZone) {
    this.cookiesService.checkForClientName();
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
      if (this.clientType() == "OnTrac" || this.clientType() == "Dhl" || this.clientType() == "USPS") {
        this.router.navigate(['/dashboard/dashboard']);
      }
    });

    this.getUserData();


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
  ngOnInit() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openLoading();
    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }
    this.dateObj = new Date();
    if (this.dateObj.getMonth() == 0 || (this.dateObj.getMonth() == 1 && this.dateObj.getDate() <= 5)) {
      this.displayYear = this.dateObj.getFullYear() - 1;
    }
    else {
      this.displayYear = this.dateObj.getFullYear();
    }

  }

  ngOnDestroy() {
    if (this.mapChart) {
      this.mapChart.dispose();
    }
  }
  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }

  userProfileData: any;
  dateObj: any;
  invoiceyear: any;
  invoiceMonth: any;
  async getUserData() {
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => { return res; });
    await this.commonService.getUserprofileData().then(
      result => {
        this.userProfileData = result[0];
        this.clientId = this.userProfileData.clientId;
        this.clientName = this.userProfileData.clientName;

        if (this.themeoption == "dark") {
          this.panelClass = 'page-dark';
        }
        else {
          this.panelClass = 'custom-dialog-panel-class';
        }
      });
    await this.internationalFormGroup.patchValue({
      t001ClientProfile: {
        "action": this.userProfileData.action,
        "activeFlag": this.userProfileData.activeFlag,
        "address": this.userProfileData.address,
        "asonDate": this.userProfileData.asonDate,
        "carrierType": this.userProfileData.carrierType,
        "changePassword": this.userProfileData.changePassword,
        "charges": this.userProfileData.charges,
        "clientId": this.userProfileData.clientId,
        "clientName": this.userProfileData.clientName,
        "clientPassword": this.userProfileData.clientPassword,
        "clientdbstatus": this.userProfileData.clientdbstatus,
        "comments": this.userProfileData.comments,
        "contactNo": this.userProfileData.contactNo,
        "contractanalysisstatus": this.userProfileData.contractanalysisstatus,
        "createdBy": this.userProfileData.createdBy,
        "createdTs": this.userProfileData.createdTs,
        "currentDate": this.userProfileData.currentDate,
        "currentstatus": this.userProfileData.currentstatus,
        "customertype": this.userProfileData.customertype,
        "dataFileDestDir": this.userProfileData.dataFileDestDir,
        "dataFileSourceDir": this.userProfileData.dataFileSourceDir,
        "dataLoadBy": this.userProfileData.dataLoadBy,
        "dataSource": this.userProfileData.dataSource,
        "dataasof": this.userProfileData.dataasof,
        "daystoweb": this.userProfileData.daystoweb,
        "email": this.userProfileData.email,
        "employeeTempTotal": this.userProfileData.employeeTempTotal,
        "employerTempTotal": this.userProfileData.employerTempTotal,
        "errorString": this.userProfileData.errorString,
        "fetchPhoto": this.userProfileData.fetchPhoto,
        "fileEndDate": this.userProfileData.fileEndDate,
        "fileStartDate": this.userProfileData.fileStartDate,
        "getImageInd": this.userProfileData.getImageInd,
        "image": this.userProfileData.image,
        "ipaddress": this.userProfileData.ipaddress,
        "isSelected": this.userProfileData.isSelected,
        "isdeletedbyowner": this.userProfileData.isdeletedbyowner,
        "lazyLoad": this.userProfileData.lazyLoad,
        "loginclientId": this.userProfileData.loginclientId,
        "logostatus": this.userProfileData.logostatus,
        "menucount": this.userProfileData.menucount,
        "newPassword": this.userProfileData.newPassword,
        "nextlevelflag": this.userProfileData.nextlevelflag,
        "noofdaysinactive": this.userProfileData.noofdaysinactive,
        "noofdaystoactive": this.userProfileData.noofdaystoactive,
        "password": this.userProfileData.password,
        "payInWords": this.userProfileData.payInWords,
        "repname": this.userProfileData.repname,
        "resetPassword": this.userProfileData.resetPassword,
        "startDate": this.userProfileData.startDate,
        "status": this.userProfileData.status,
        "t301accountAC": this.userProfileData.t301accountAC,
        "t302planAC": this.userProfileData.t302planAC,
        "tablename": this.userProfileData.tablename,
        "trackingcount": this.userProfileData.trackingcount,
        "updatedTs": this.userProfileData.updatedTs,
        "updatedby": this.userProfileData.updatedby,
        "user_name": this.userProfileData.user_name,
        "year": this.userProfileData.year
      }
    });

    this.dateObj = new Date();
    if (this.dateObj.getMonth() == 0 || (this.dateObj.getMonth() == 1 && this.dateObj.getDate() <= 5)) {
      this.clickedYear = await this.dateObj.getFullYear() - 1;
    }
    else {
      this.clickedYear = await this.dateObj.getFullYear();
    }
    this.invoiceMonth = await (this.dateObj.getMonth() + 1);

    var carrierType = await this.userProfileData.carrierType;

    await this.cmb_clientid_changeHandler({ 'clientid': this.clientId, 'clientName': this.clientName });

  }
  createFirstLevelChartXML(mapData1: any) {
    this.closeLoading();

    if (this.mapChart) {
      this.mapChart.dispose();
    }

    var collection = mapData1;
    this.totalpackagetemp = 0;
    this.totalquantitytemp = 0;
    var monthObj;
    var seriesResult: any[] = [];
    if (collection != null && collection.length > 0) {
      this.totalpackagetemp = Number((collection[0]).totalPackagecost);
      this.totalquantitytemp = Number((collection[0]).totalPackagequantity);
      for (var loop = 0; loop < collection.length; loop++) {
        monthObj = collection[loop];
        if (monthObj.netamount != null) {
          var name = monthObj.region_Name;
          var value = monthObj.netamount;
          var int_alpha2_code = monthObj.int_alpha2_code;
          seriesResult.push({ "id": int_alpha2_code, "name": name, "value": value, "fill": am4core.color("#4586d1") });
        }
      }
    }

    this.zone.runOutsideAngular(() => {
      am4core.options.commercialLicense = true;
      // Create map instance
      var chart = am4core.create("chartdiv", am4maps.MapChart);
      this.mapChart = chart;
      // Set map definition
      chart.geodata = am4geodata_worldLow;

      // Set projection
      chart.projection = new am4maps.projections.Miller();

      // Create map polygon series
      var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

      polygonSeries.heatRules.push({
        property: "fill",
        target: polygonSeries.mapPolygons.template,
        min: chart.colors.getIndex(1).brighten(1),
        max: chart.colors.getIndex(1).brighten(-0.3)
      });
      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true;

      // Configure series
      var polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name} : ${value}";
      polygonTemplate.fill = am4core.color("#dadada");
      var hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#3c5bdc");
      // Remove Antarctica
      polygonSeries.exclude = ["AQ"];
      // Add some data
      polygonSeries.data = seriesResult;
      // Bind "fill" property to "fill" key in data
      polygonTemplate.propertyFields.fill = "fill";
    });
  }
  async cmb_year_changeHandler(event: any) {
    this.openLoading();
    this.cmb_year = event;
    await this.initChartFedEx();
  }
  frtAndFrt_AccBtnValFedEx = signal<any>('FRT+ACC');
  async linkfrt_clickHandlerFedEx(event: any) {
    this.frtAndFrt_AccBtnValFedEx.set("FRT");
    this.fedexFormGroup.get('chargeType')?.setValue("INT_FRT");
    this.fedexFormGroup.get('chargetypevalue')?.setValue(this.frtAndFrt_AccBtnValFedEx());
    await this.MapdataFedEx();
    if (this.expAndImpValFedEx == "Imp" && this.frtAndFrt_AccBtnValFedEx() == "FRT") {
      this.chargetypevalueFedEx = "INT_FRT";
      this.typecodevalueFedEx = "IMP";
      this.chargetypevalueFedEx = "INT_FRT";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
    if (this.expAndImpValFedEx == "Exp" && this.frtAndFrt_AccBtnValFedEx() == "FRT") {
      this.chargetypevalueFedEx = "INT_FRT";
      this.typecodevalueFedEx = "EXP";
      this.chargetypevalueFedEx = "INT_FRT";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
  }
  showColumnPicker = false;
      toggleColumnPicker() {
      this.showColumnPicker = !this.showColumnPicker;
    }
    closeColumnPicker() {
      this.showColumnPicker = false;
    }
    @HostListener('document:click', ['$event'])
    onDocClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest('.more_btn_drop')) return;
      this.closeColumnPicker();
    }
  async linkfrtacc_clickHandlerFedEx(event: any) {
    this.frtAndFrt_AccBtnValFedEx.set("FRT+ACC");
    this.fedexFormGroup.get('chargetypevalue')?.setValue(this.frtAndFrt_AccBtnValFedEx());
    this.fedexFormGroup.get('chargeType')?.setValue("INT+ACC");
    await this.MapdataFedEx();
    if (this.expAndImpValFedEx == "Imp" && this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC") {
      this.chargetypevalueFedEx = "INT+ACC";
      this.typecodevalueFedEx = "IMP";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
    if (this.expAndImpValFedEx == "Exp" && this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC") {
      this.chargetypevalueFedEx = "INT+ACC";
      this.typecodevalueFedEx = "EXP";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
  }


  async Exp_clickHandlerFedEx(event: any) {
    this.expAndImpValFedEx = event.target.value;
    await this.MapdataFedEx();
    if (this.expAndImpValFedEx == "Exp" && this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC") {
      this.chargetypevalueFedEx = "INT+ACC";
      this.typecodevalueFedEx = "EXP";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
    if (this.expAndImpValFedEx == "Exp" && this.frtAndFrt_AccBtnValFedEx() == "FRT") {
      this.chargetypevalueFedEx = "INT_FRT";
      this.typecodevalueFedEx = "EXP";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);

    }

  }


  async Imp_clickHandlerFedEx(event: any) {
    this.expAndImpValFedEx = event.target.value;
    await this.MapdataFedEx();
    if (this.expAndImpValFedEx == "Imp" && this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC") {

      this.chargetypevalueFedEx = "INT+ACC";
      this.typecodevalueFedEx = "IMP";
      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
    if (this.expAndImpValFedEx == "Imp" && this.frtAndFrt_AccBtnValFedEx() == "FRT") {

      this.chargetypevalueFedEx = "INT_FRT";
      this.typecodevalueFedEx = "IMP";

      await this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }

  }


  async MapdataFedEx() {
    if (this.frtAndFrt_AccBtnValFedEx() == "FRT") {
      this.fedexFormGroup.get('chargeType')?.setValue("INT_FRT");
    }
    else {
      this.fedexFormGroup.get('chargeType')?.setValue("INT+ACC");
    }

    this.clickedYear = this.cmb_year + "";
    this.fedexFormGroup.get('clientId')?.setValue(this.clientId);
    this.fedexFormGroup.get('year')?.setValue(this.clickedYear);
    if (this.expAndImpValFedEx == "Imp")
      this.fedexFormGroup.get('typeCode')?.setValue("IMP");
    if (this.expAndImpValFedEx == "Exp")
      this.fedexFormGroup.get('typeCode')?.setValue("EXP");
    await this.fedexFetchdisplay_INT_Heatmap_list();

  }






  async cmb_clientid_changeHandler(event: any) {
    await this.refresh();

    var ClientNametWithSplChar = event.clientName;
    var clientName = ClientNametWithSplChar.replace(/[^a-zA-Z0-9]/g, "");

    var imagepath = "";
    imagepath = "assets/Ljm_image/" + clientName + ".jpg";

  }

  async refresh() {
    this.internationalGroundtxt_id = "FedEx International Ground";
    this.fedexIntlEconomytxt_id = "FedEx International Economy";
    this.fedexIntlPrioritytxt_id = "FedEx International Priority";
    this.fedexInternationalFirsttxt_id = "FedEx International First";
    this.fedExIntlPriorityFrttxt_id = "FedEx International Priority Freight";
    this.fedExIntlEconomyFrttxt_id = "FedEx International Economy Freight";
    this.fedexIntlExpressSavertxt_id = "FedEx International Priority Express";
    this.fedexIntlIntlDirectDistFrttxt_id = "FedEx International Connect Plus";
    this.chargetypevalueFedEx = "FRT_ACC";
    this.typecodevalueFedEx = "EXP";
    this.currentyear = this.displayYear;
    this.cmb_year = this.displayYear;
    await this.fedexFormGroup.patchValue({
      t002ClientProfile: {
        "clientId": this.userProfileData.clientId,
        "clientName": this.userProfileData.clientName,
        "userName": this.userProfileData.userName,
        "password": this.userProfileData.password,
        "siteUserName": this.userProfileData.siteUserName,
        'sitePassword': this.userProfileData.sitePassword,
        "address": this.userProfileData.address,
        "contactNo": this.userProfileData.contactNo,
        "comments": this.userProfileData.comments,
        "endDate": this.userProfileData.endDate,
        "startDate": this.userProfileData.startDate,
        "status": this.userProfileData.status,
        "auditStatus": this.userProfileData.auditStatus,
        "contractStatus": this.userProfileData.contractStatus,
        "email": this.userProfileData.email,
        "userLogo": this.userProfileData.userLogo,
        "customerType": this.userProfileData.customerType,
        "dataSource": this.userProfileData.dataSource,
        "dataLoadedBy": this.userProfileData.dataLoadedBy,
        "filestartdate": this.userProfileData.filestartdate,
        "fileenddate": this.userProfileData.fileenddate,
        "dateasof": this.userProfileData.dateasof,
        "currentDate": this.userProfileData.currentDate,
        "currentYear": this.userProfileData.currentYear,
        "currentMonth": this.userProfileData.currentMonth,
        "startYear": this.userProfileData.startYear,
        "createdBy": this.userProfileData.createdBy,
        "createdTs": this.userProfileData.createdTs,
        "updatedTs": this.userProfileData.updatedTs,
        "adminFlag": this.userProfileData.adminFlag,
        "filestartdate1": this.userProfileData.filestartdate1,
        "fileenddate1": this.userProfileData.fileenddate1,
        "trackingcount": this.userProfileData.trackingcount,
        "logostatus": this.userProfileData.logostatus,
        "noofdaystoactive": this.userProfileData.noofdaystoactive,
        "noofdaysinactive": this.userProfileData.noofdaysinactive,
        "ipaddress": this.userProfileData.ipaddress,
        "loginFlag": this.userProfileData.loginFlag,
        "contractSavingFlag": this.userProfileData.contractSavingFlag,
        "clientProfileName": this.userProfileData.clientProfileName,
        "carrierType": this.userProfileData.carrierType,
        "t002AccountDet": this.userProfileData.t002AccountDet,
        "customers": this.userProfileData.customers
      }
    });
    await this.initChartFedEx();

  }

  ///*Fedex API *////
  fedexFetchInterDashboard_Service() {
    this.httpfedexService.fedexFetchInterDashboard_Service(this.fedexFormGroup.value)?.subscribe(
      result => {
        var resultobj = result;
        this.fetchInterDashboard_Service_result_eventFedEx(resultobj);
      },
      error => {
        console.log('error ', error);

      })
  }
  fedexFetchdisplay_INT_Heatmap_list() {
    this.changeTitle = this.fedexFormGroup.get('chargetypevalue')?.value;
    this.httpfedexService.fedexFetchdisplay_INT_Heatmap_list(this.fedexFormGroup.value)?.subscribe(
      result => {
        var resultobj = result;
        this.result_Heatmap_listFedEx(resultobj);
      },
      error => {
        console.log('error ', error);

      })
  }


  async result_Heatmap_list(event: any) {
    if (event.length != 0) {
      await this.createFirstLevelChartXML(event);
    }
    else {
      await this.createFirstLevelChartXML(event);
      this.openModal("No data found!");
    }
    this.closeLoading();
  }
  resetCharbackUI() {
    this.worldwide_Expedited_progressBar_visible = true;
    this.worldwide_Expedited_progressBar_includeInLayout = true;
    this.worldwide_Expedited_progressBar_label_visible = false;
    this.worldwide_Expedited_progressBar_label_includeInLayout = false;
    this.worldwide_Express_progressBar_visible = true;
    this.worldwide_Express_progressBar_includeInLayout = true;
    this.worldwide_Express_progressBar_label_visible = false;
    this.worldwide_Express_progressBar_label_includeInLayout = false;
    this.worldwide_Express_Saver_progressBar_visible = true;
    this.worldwide_Express_Saver_progressBar_includeInLayout = true;
    this.worldwide_Express_Saver_progressBar_label_visible = false;
    this.worldwide_Express_Saver_progressBar_label_includeInLayout = false;
    this.worldwide_Saver_progressBar_visible = true;
    this.worldwide_Saver_progressBar_includeInLayout = true;
    this.worldwide_Saver_progressBar_label_visible = false;
    this.worldwide_Saver_progressBar_label_includeInLayout = false;
    this.worldwide_Standard_progressBar_visible = true;
    this.worldwide_Standard_progressBar_includeInLayout = true;
    this.worldwide_Standard_progressBar_label_visible = false;
    this.worldwide_Standard_progressBar_label_includeInLayout = false;

  }

  async internationalGroupFedExClick(event: any, eventObj:any) {
    if (eventObj.netCharge == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }
    if (this.international_ground_progressBar == 0 && event == "International Ground") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.fedex_intl_economy_progressBar == 0 && event == "FedEx Intl Economy") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.fedex_intl_priority_progressBar == 0 && event == "FedEx Intl Priority") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.fedex_international_first_progressBar == 0 && event == "FedEx International First") {
      this.openModal("Data Too Small to Display");
      return;
    }


    else if (this.FedEx_International_Next_Flight_progressBar == 0 && event == "FedEx International Next Flight") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedEx_International_MailService_progressBar == 0 && event == "FedEx International MailService") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedEx_Intl_Priority_Frt_progressBar == 0 && event == "FedEx Intl Priority Frt") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedEx_Intl_Economy_Frt_progressBar == 0 && event == "FedEx Intl Economy Frt") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedEx_Intl_Economy_Dist_progressBar == 0 && event == "FedEx Intl Economy Dist") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.FedEx_Intl_Prty_DirDist_progressBar == 0 && event == "FedEx Intl Prty DirDist") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.Intl_MailService_Economy_progressBar == 0 && event == "Intl MailService Economy") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.Intl_MailService_Priority_progressBar == 0 && event == "Intl MailService Priority") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.international_HomeDelivery_progressBar == 0 && event == "International Home Delivery") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.fedex_intl_Express_progressBar == 0 && event == "FedEx Intl Express Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.fedex_intl_DirDistFrt_progressBar == 0 && event == "FedEx Intl DirDist Frt") {
      this.openModal("Data Too Small to Display");
      return;
    }


    this.fedexFormGroup.get('year')?.setValue(this.clickedYear);

    this.fedexFormGroup.get('chargeGroup')?.setValue("Freight");
    this.fedexFormGroup.get('chargeDescription')?.setValue(event);
    this.fedexFormGroup.get('typeCode')?.setValue(this.typecodevalueFedEx);
    this.fedexFormGroup.get('themeoption')?.setValue(this.themeoption);
    if (this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC")
      this.fedexFormGroup.get('chargeType')?.setValue("FRTWithAcc");
    else
      this.fedexFormGroup.get('chargeType')?.setValue("FRT");
    this.fedexFormGroup.get('chargetypevalue')?.setValue(this.frtAndFrt_AccBtnValFedEx());
    var resultobj = this.fedexFormGroup.value;
    this.openDialogFedEx(resultobj);

  }
  dialogValue: any;
  openDialogFedEx(sendValue: any) {
    const dialogRef = this.dialog.open(FedexInternationalPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { pageValue: sendValue }
    });

    dialogRef.afterClosed()?.subscribe(result => {
      this.dialogValue = result;
    });
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
  ///*Fedex code *////
  expAndImpValFedEx: any = "Exp";
  async initChartFedEx() {
    this.clickedYear = this.cmb_year + "";

    this.fedexFormGroup.get('clientId')?.setValue((this.clientId).toString());
    this.fedexFormGroup.get('year')?.setValue(this.clickedYear);
    if (this.expAndImpValFedEx == "Imp")
      this.fedexFormGroup.get('typeCode')?.setValue("IMP");
    if (this.expAndImpValFedEx == "Exp")
      this.fedexFormGroup.get('typeCode')?.setValue("EXP");
    await this.fedexFetchdisplay_INT_Heatmap_list();
    await this.fedexFetchInterDashboard_Service();
  }


  async result_Heatmap_listFedEx(event: any) {
    if (event.length != 0) {

      await this.createFirstLevelChartXMLFedEx(event);
    }
    else {
      await this.createFirstLevelChartXMLFedEx(event);
      this.openModal("No data found!");
    }
    this.closeLoading();
  }

  createFirstLevelChartXMLFedEx(fedExmapData: any) {
    this.closeLoading();
    var collection = fedExmapData;
    this.totalpackagetemp = 0;
    this.totalquantitytemp = 0;
    var monthObj;

    var seriesResultFedEx = [];
    if (collection != null && collection.length > 0) {
      this.totalpackagetemp = Number((collection[0]).totalPackageCost);
      this.totalquantitytemp = Number((collection[0]).totalPackageQuantity);
      for (var loop = 0; loop < collection.length; loop++) {
        var seriesXML = [];
        monthObj = collection[loop];
        if (monthObj.netamount != null) {
          var name = monthObj.regionName;
          var value = monthObj.netamount;
          var int_alpha2_code = monthObj.intlCode;
          seriesResultFedEx.push({ "id": int_alpha2_code, "name": name, "value": value, "fill": am4core.color("#4586d1") });

        }
        else {
        }
      }
    }

    am4core.options.commercialLicense = true;
    // Create map instance
    var chart = am4core.create("chartdivFedEx", am4maps.MapChart);

    chart.geodata = am4geodata_worldLow;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: chart.colors.getIndex(1).brighten(1),
      max: chart.colors.getIndex(1).brighten(-0.3)
    });
    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name} : ${value}";
    polygonTemplate.fill = am4core.color("#dadada");



    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");
    // Remove Antarctica
    polygonSeries.exclude = ["AQ"];

    // Add some data
    polygonSeries.data = seriesResultFedEx;

    // Bind "fill" property to "fill" key in data
    polygonTemplate.propertyFields.fill = "fill";


  }
  progressBarFedexList: any = [];
  fetchInterDashboard_Service_result_eventFedEx(event: any) {
    this.chargeBack_resultFedEx = event;
    if (this.chargeBack_resultFedEx != null && this.chargeBack_resultFedEx.length > 0) {
      this.ProgressbarvaluesFedEx(this.chargeBack_resultFedEx);
    }
    else {
      this.International_Ground = 0.00;
      this.FedEx_Intl_Economy = 0.00;
      this.FedEx_Intl_Priority = 0.00;
      this.FedEx_International_First = 0.00;
      this.FedEx_International_Next_Flight = 0.00;
      this.FedEx_International_MailService = 0.00;
      this.FedEx_Intl_Priority_Frt = 0.00;
      this.FedEx_Intl_Economy_Frt = 0.00;
      this.FedEx_Intl_Economy_Dist = 0.00;
      this.FedEx_Intl_Prty_DirDist = 0.00;
      this.Intl_MailService_Economy = 0.00;
      this.Intl_MailService_Priority = 0.00;

      this.International_Home_Delivery = 0.00;
      this.Fedex_Intl_Express_Saver = 0.00;
      this.Fedex_Intl_DirectDist_Frt = 0.00;

      this.international_ground_progressBar_visible = false;
      this.international_ground_progressBar_label_visible = true;
      this.fedex_intl_economy_progressBar_visible = false;
      this.fedex_intl_economy_progressBar_label_visible = true;
      this.fedex_intl_priority_progressBar_visible = false;
      this.fedex_intl_priority_progressBar_label_visible = true;
      this.fedex_international_first_progressBar_visible = false;
      this.fedex_international_first_progressBar_label_visible = true;
      this.FedEx_International_Next_Flight_progressBar_visible = false;
      this.FedEx_International_Next_Flight_progressBar_label_visible = true;
      this.FedEx_International_MailService_progressBar_visible = false;
      this.FedEx_International_MailService_progressBar_label_visible = true;

      this.FedEx_Intl_Priority_Frt_progressBar_visible = false;
      this.FedEx_Intl_Priority_Frt_progressBar_label_visible = true;

      this.FedEx_Intl_Economy_Frt_progressBar_visible = false;
      this.FedEx_Intl_Economy_Frt_progressBar_label_visible = true;
      this.FedEx_Intl_Economy_Dist_progressBar_visible = false;;
      this.FedEx_Intl_Economy_Dist_progressBar_label_visible = true;
      this.FedEx_Intl_Prty_DirDist_progressBar_visible = false;
      this.FedEx_Intl_Prty_DirDist_progressBar_label_visible = true;
      this.Intl_MailService_Economy_progressBar_visible = false;
      this.Intl_MailService_Economy_progressBar_label_visible = true;
      this.Intl_MailService_Priority_progressBar_visible = false;
      this.Intl_MailService_Priority_progressBar_label_visible = true;

      this.progressBarFedexList = [];
      this.progressBarFedexList.push({ serviceType: this.internationalGroundtxt_id, progressBar: this.international_ground_progressBar, netCharge: this.International_Ground, serviceName: 'International Ground' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlEconomytxt_id, progressBar: this.fedex_intl_economy_progressBar, netCharge: this.FedEx_Intl_Economy, serviceName: 'FedEx Intl Economy' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlPrioritytxt_id, progressBar: this.fedex_intl_priority_progressBar, netCharge: this.FedEx_Intl_Priority, serviceName: 'FedEx Intl Priority' });
      this.progressBarFedexList.push({ serviceType: this.fedexInternationalFirsttxt_id, progressBar: this.fedex_international_first_progressBar, netCharge: this.FedEx_International_First, serviceName: 'FedEx International First' });
      this.progressBarFedexList.push({ serviceType: this.fedExIntlPriorityFrttxt_id, progressBar: this.FedEx_Intl_Priority_Frt_progressBar, netCharge: this.FedEx_Intl_Priority_Frt, serviceName: 'FedEx Intl Priority Frt' });
      this.progressBarFedexList.push({ serviceType: this.fedExIntlEconomyFrttxt_id, progressBar: this.FedEx_Intl_Economy_Frt_progressBar, netCharge: this.FedEx_Intl_Economy_Frt, serviceName: 'FedEx Intl Economy Frt' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlExpressSavertxt_id, progressBar: this.fedex_intl_Express_progressBar, netCharge: this.Fedex_Intl_Express_Saver, serviceName: 'FedEx Intl Priority Express' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlIntlDirectDistFrttxt_id, progressBar: this.fedex_intl_DirDistFrt_progressBar, netCharge: this.Fedex_Intl_DirectDist_Frt, serviceName: 'FedEx International Connect Plus' });
      this.internationalGroundService.set(this.progressBarFedexList);
    }


  }

  ProgressbarvaluesFedEx(collection: any) {
    var maxValue = 0;
    var chargBacklength = collection.length;
    if (chargBacklength != 0) {
      this.International_Ground = 0.00;
      this.FedEx_Intl_Economy = 0.00;
      this.FedEx_Intl_Priority = 0.00;
      this.FedEx_International_First = 0.00;
      this.FedEx_International_Next_Flight = 0.00;
      this.FedEx_International_MailService = 0.00;
      this.FedEx_Intl_Priority_Frt = 0.00;
      this.FedEx_Intl_Economy_Frt = 0.00;
      this.FedEx_Intl_Economy_Dist = 0.00;
      this.FedEx_Intl_Prty_DirDist = 0.00;
      this.Intl_MailService_Economy = 0.00;
      this.Intl_MailService_Priority = 0.00;

      this.International_Home_Delivery = 0.00;
      this.Fedex_Intl_Express_Saver = 0.00;
      this.Fedex_Intl_DirectDist_Frt = 0.00;

      this.progressBarFedexList = [];
      this.progressBarFedexList.push({ serviceType: this.internationalGroundtxt_id, progressBar: this.international_ground_progressBar, netCharge: this.International_Ground, serviceName: 'International Ground' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlEconomytxt_id, progressBar: this.fedex_intl_economy_progressBar, netCharge: this.FedEx_Intl_Economy, serviceName: 'FedEx Intl Economy' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlPrioritytxt_id, progressBar: this.fedex_intl_priority_progressBar, netCharge: this.FedEx_Intl_Priority, serviceName: 'FedEx Intl Priority' });
      this.progressBarFedexList.push({ serviceType: this.fedexInternationalFirsttxt_id, progressBar: this.fedex_international_first_progressBar, netCharge: this.FedEx_International_First, serviceName: 'FedEx International First' });
      // this.progressBarFedexList.push({serviceType: this.FedExInternationalNextFlighttxt_id,progressBar: this.FedEx_International_Next_Flight_progressBar,netCharge: this.FedEx_International_Next_Flight,serviceName: 'FedEx International Next Flight'});              
      // this.progressBarFedexList.push({serviceType: this.fedExInternationalMailServicetxt_id,progressBar: this.FedEx_International_MailService_progressBar,netCharge: this.FedEx_International_MailService,serviceName: 'FedEx International MailService'});
      this.progressBarFedexList.push({ serviceType: this.fedExIntlPriorityFrttxt_id, progressBar: this.FedEx_Intl_Priority_Frt_progressBar, netCharge: this.FedEx_Intl_Priority_Frt, serviceName: 'FedEx Intl Priority Frt' });
      this.progressBarFedexList.push({ serviceType: this.fedExIntlEconomyFrttxt_id, progressBar: this.FedEx_Intl_Economy_Frt_progressBar, netCharge: this.FedEx_Intl_Economy_Frt, serviceName: 'FedEx Intl Economy Frt' });
      // this.progressBarFedexList.push({serviceType: this.fedExIntlEconomyDisttxt_id,progressBar: this.FedEx_Intl_Economy_Dist_progressBar,netCharge: this.FedEx_Intl_Economy_Dist,serviceName: 'FedEx Intl Economy Dist'});  
      // this.progressBarFedexList.push({serviceType: this.fedExIntlPrtyDirDisttxt_id,progressBar: this.FedEx_Intl_Prty_DirDist_progressBar,netCharge: this.FedEx_Intl_Prty_DirDist,serviceName: 'FedEx Intl Prty DirDist'});
      // this.progressBarFedexList.push({serviceType: this.intlMailServiceEconomytxt_id,progressBar: this.Intl_MailService_Economy_progressBar,netCharge: this.Intl_MailService_Economy,serviceName: 'Intl MailService Economy'});
      // this.progressBarFedexList.push({serviceType: this.intlMailServicePrioritytxt_id,progressBar: this.Intl_MailService_Priority_progressBar,netCharge: this.Intl_MailService_Priority,serviceName: 'Intl MailService Priority'});
      // this.progressBarFedexList.push({serviceType: this.internationalHomeDeliverytxt_id,progressBar: this.international_HomeDelivery_progressBar,netCharge: this.International_Home_Delivery,serviceName: 'International Home Delivery'});
      // this.progressBarFedexList.push({serviceType: this.fedexIntlExpressSavertxt_id,progressBar: this.fedex_intl_Express_progressBar,netCharge: this.Fedex_Intl_Express_Saver,serviceName: 'FedEx Intl Express Saver'});
      // this.progressBarFedexList.push({serviceType: this.fedexIntlIntlDirectDistFrttxt_id,progressBar: this.fedex_intl_DirDistFrt_progressBar,netCharge: this.Fedex_Intl_DirectDist_Frt,serviceName: 'FedEx Intl DirDist Saver'});
      this.progressBarFedexList.push({ serviceType: this.fedexIntlExpressSavertxt_id, progressBar: this.fedex_intl_Express_progressBar, netCharge: this.Fedex_Intl_Express_Saver, serviceName: 'FedEx Intl Priority Express' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlIntlDirectDistFrttxt_id, progressBar: this.fedex_intl_DirDistFrt_progressBar, netCharge: this.Fedex_Intl_DirectDist_Frt, serviceName: 'FedEx International Connect Plus' });
      this.internationalGroundService.set(this.progressBarFedexList);
      this.resetCharbackUIFedEx();
    }
    var chargeDesList = [];
    var maxValue = 0;
    if (collection == null)
      return;
    if (collection.length > 0) {
      for (var rymloop = 0; rymloop < collection.length; rymloop++) {
        var chargeBackObj = collection[rymloop];
        var totAmt: Number = 0;
        if (this.expAndImpValFedEx == "Exp" && this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC") {
          totAmt = Number(chargeBackObj.exportFrtAccAmt);
          if (chargeBackObj.chargeDescription == "International Ground")
            this.International_Ground = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy")
            this.FedEx_Intl_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority")
            this.FedEx_Intl_Priority = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International First")
            this.FedEx_International_First = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Next Flight")
            this.FedEx_International_Next_Flight = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International MailService")
            this.FedEx_International_MailService = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Frt")
            this.FedEx_Intl_Priority_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Frt")
            this.FedEx_Intl_Economy_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Dist")
            this.FedEx_Intl_Economy_Dist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Prty DirDist")
            this.FedEx_Intl_Prty_DirDist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Economy")
            this.Intl_MailService_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Priority")
            this.Intl_MailService_Priority = Number(totAmt);

          if (chargeBackObj.chargeDescription == "International Home Delivery")
            this.International_Home_Delivery = Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl Express Saver")
          //   this.Fedex_Intl_Express_Saver= Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl DirDist Frt")
          //   this.Fedex_Intl_DirectDist_Frt= Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Express")
            this.Fedex_Intl_Express_Saver = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Connect Plus")
            this.Fedex_Intl_DirectDist_Frt = Number(totAmt);
        }

        if (this.expAndImpValFedEx == "Exp" && this.frtAndFrt_AccBtnValFedEx() == "FRT") {
          totAmt = Number(chargeBackObj.exportFrtAmt);
          if (chargeBackObj.chargeDescription == "International Ground")
            this.International_Ground = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy")
            this.FedEx_Intl_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority")
            this.FedEx_Intl_Priority = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International First")
            this.FedEx_International_First = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Next Flight")
            this.FedEx_International_Next_Flight = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International MailService")
            this.FedEx_International_MailService = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Frt")
            this.FedEx_Intl_Priority_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Frt")
            this.FedEx_Intl_Economy_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Dist")
            this.FedEx_Intl_Economy_Dist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Prty DirDist")
            this.FedEx_Intl_Prty_DirDist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Economy")
            this.Intl_MailService_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Priority")
            this.Intl_MailService_Priority = Number(totAmt);

          if (chargeBackObj.chargeDescription == "International Home Delivery")
            this.International_Home_Delivery = Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl Express Saver")
          //   this.Fedex_Intl_Express_Saver= Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl DirDist Frt")
          //   this.Fedex_Intl_DirectDist_Frt= Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Express")
            this.Fedex_Intl_Express_Saver = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Connect Plus")
            this.Fedex_Intl_DirectDist_Frt = Number(totAmt);
        }
        if (this.expAndImpValFedEx == "Imp" && this.frtAndFrt_AccBtnValFedEx() == "FRT+ACC") {
          totAmt = Number(chargeBackObj.importFrtAccAmt);
          if (chargeBackObj.chargeDescription == "International Ground")
            this.International_Ground = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy")
            this.FedEx_Intl_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority")
            this.FedEx_Intl_Priority = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International First")
            this.FedEx_International_First = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Next Flight")
            this.FedEx_International_Next_Flight = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International MailService")
            this.FedEx_International_MailService = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Frt")
            this.FedEx_Intl_Priority_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Frt")
            this.FedEx_Intl_Economy_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Dist")
            this.FedEx_Intl_Economy_Dist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Prty DirDist")
            this.FedEx_Intl_Prty_DirDist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Economy")
            this.Intl_MailService_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Priority")
            this.Intl_MailService_Priority = Number(totAmt);

          if (chargeBackObj.chargeDescription == "International Home Delivery")
            this.International_Home_Delivery = Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl Express Saver")
          //   this.Fedex_Intl_Express_Saver= Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl DirDist Frt")
          //   this.Fedex_Intl_DirectDist_Frt= Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Express")
            this.Fedex_Intl_Express_Saver = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Connect Plus")
            this.Fedex_Intl_DirectDist_Frt = Number(totAmt);
        }
        if (this.expAndImpValFedEx == "Imp" && this.frtAndFrt_AccBtnValFedEx() == "FRT") {
          totAmt = Number(chargeBackObj.importFrtAmt);
          if (chargeBackObj.chargeDescription == "International Ground")
            this.International_Ground = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy")
            this.FedEx_Intl_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority")
            this.FedEx_Intl_Priority = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International First")
            this.FedEx_International_First = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Next Flight")
            this.FedEx_International_Next_Flight = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International MailService")
            this.FedEx_International_MailService = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Frt")
            this.FedEx_Intl_Priority_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Frt")
            this.FedEx_Intl_Economy_Frt = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Economy Dist")
            this.FedEx_Intl_Economy_Dist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Prty DirDist")
            this.FedEx_Intl_Prty_DirDist = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Economy")
            this.Intl_MailService_Economy = Number(totAmt);
          if (chargeBackObj.chargeDescription == "Intl MailService Priority")
            this.Intl_MailService_Priority = Number(totAmt);

          if (chargeBackObj.chargeDescription == "International Home Delivery")
            this.International_Home_Delivery = Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl Express Saver")
          //   this.Fedex_Intl_Express_Saver= Number(totAmt);
          // if(chargeBackObj.chargeDescription=="FedEx Intl DirDist Frt")
          //   this.Fedex_Intl_DirectDist_Frt= Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx Intl Priority Express")
            this.Fedex_Intl_Express_Saver = Number(totAmt);
          if (chargeBackObj.chargeDescription == "FedEx International Connect Plus")
            this.Fedex_Intl_DirectDist_Frt = Number(totAmt);
        }
      }
      chargeDesList.push(this.International_Ground);
      chargeDesList.push(this.FedEx_Intl_Economy);
      chargeDesList.push(this.FedEx_Intl_Priority);
      chargeDesList.push(this.FedEx_International_First);
      chargeDesList.push(this.FedEx_International_Next_Flight);
      chargeDesList.push(this.FedEx_International_MailService);
      chargeDesList.push(this.FedEx_Intl_Priority_Frt);
      chargeDesList.push(this.FedEx_Intl_Economy_Frt);
      chargeDesList.push(this.FedEx_Intl_Economy_Dist);
      chargeDesList.push(this.FedEx_Intl_Prty_DirDist);
      chargeDesList.push(this.Intl_MailService_Economy);
      chargeDesList.push(this.Intl_MailService_Priority);

      chargeDesList.push(this.International_Home_Delivery);
      chargeDesList.push(this.Fedex_Intl_Express_Saver);
      chargeDesList.push(this.Fedex_Intl_DirectDist_Frt);

      maxValue = Math.max.apply(null, chargeDesList);

      var totMax: Number = maxValue / 5;

      this.international_ground_progressBar = this.setProgressFedEx(this.International_Ground, maxValue);

      this.fedex_intl_economy_progressBar = this.setProgressFedEx(this.FedEx_Intl_Economy, maxValue);


      this.fedex_intl_priority_progressBar = this.setProgressFedEx(this.FedEx_Intl_Priority, maxValue);

      this.fedex_international_first_progressBar = this.setProgressFedEx(this.FedEx_International_First, maxValue);


      this.FedEx_International_Next_Flight_progressBar = this.setProgressFedEx(this.FedEx_International_Next_Flight, maxValue);

      this.FedEx_International_MailService_progressBar = this.setProgressFedEx(this.FedEx_International_MailService, maxValue);

      this.FedEx_Intl_Priority_Frt_progressBar = this.setProgressFedEx(this.FedEx_Intl_Priority_Frt, maxValue);

      this.FedEx_Intl_Economy_Frt_progressBar = this.setProgressFedEx(this.FedEx_Intl_Economy_Frt, maxValue);

      this.FedEx_Intl_Economy_Dist_progressBar = this.setProgressFedEx(this.FedEx_Intl_Economy_Dist, maxValue);

      this.FedEx_Intl_Prty_DirDist_progressBar = this.setProgressFedEx(this.FedEx_Intl_Prty_DirDist, maxValue);

      this.Intl_MailService_Economy_progressBar = this.setProgressFedEx(this.Intl_MailService_Economy, maxValue);

      this.Intl_MailService_Priority_progressBar = this.setProgressFedEx(this.Intl_MailService_Priority, maxValue);

      this.international_HomeDelivery_progressBar = this.setProgressFedEx(this.International_Home_Delivery, maxValue);

      this.fedex_intl_Express_progressBar = this.setProgressFedEx(this.Fedex_Intl_Express_Saver, maxValue);

      this.fedex_intl_DirDistFrt_progressBar = this.setProgressFedEx(this.Fedex_Intl_DirectDist_Frt, maxValue);

      this.progressBarFedexList = [];
      this.progressBarFedexList.push({ serviceType: this.internationalGroundtxt_id, progressBar: this.international_ground_progressBar, netCharge: this.International_Ground, serviceName: 'International Ground' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlEconomytxt_id, progressBar: this.fedex_intl_economy_progressBar, netCharge: this.FedEx_Intl_Economy, serviceName: 'FedEx Intl Economy' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlPrioritytxt_id, progressBar: this.fedex_intl_priority_progressBar, netCharge: this.FedEx_Intl_Priority, serviceName: 'FedEx Intl Priority' });
      this.progressBarFedexList.push({ serviceType: this.fedexInternationalFirsttxt_id, progressBar: this.fedex_international_first_progressBar, netCharge: this.FedEx_International_First, serviceName: 'FedEx International First' });
      this.progressBarFedexList.push({ serviceType: this.fedExIntlPriorityFrttxt_id, progressBar: this.FedEx_Intl_Priority_Frt_progressBar, netCharge: this.FedEx_Intl_Priority_Frt, serviceName: 'FedEx Intl Priority Frt' });
      this.progressBarFedexList.push({ serviceType: this.fedExIntlEconomyFrttxt_id, progressBar: this.FedEx_Intl_Economy_Frt_progressBar, netCharge: this.FedEx_Intl_Economy_Frt, serviceName: 'FedEx Intl Economy Frt' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlExpressSavertxt_id, progressBar: this.fedex_intl_Express_progressBar, netCharge: this.Fedex_Intl_Express_Saver, serviceName: 'FedEx Intl Priority Express' });
      this.progressBarFedexList.push({ serviceType: this.fedexIntlIntlDirectDistFrttxt_id, progressBar: this.fedex_intl_DirDistFrt_progressBar, netCharge: this.Fedex_Intl_DirectDist_Frt, serviceName: 'FedEx International Connect Plus' });
      this.progressBarFedexList.sort((a: any, b: any) => b.netCharge - a.netCharge);
      this.internationalGroundService.set(this.progressBarFedexList);
    }

  }
  setProgressFedEx(dataValue: any, maxValue: any) {
    if (dataValue != 0 && maxValue != 0) {
      var obtained = dataValue;
      var total = maxValue;
      var percent = obtained * 100 / total;
    }
    else {
      var percent = 0;
    }
    return percent;
  }

  resetCharbackUIFedEx() {
    this.international_ground_progressBar_visible = true;
    this.international_ground_progressBar_label_visible = false;

    this.fedex_intl_economy_progressBar_visible = true;
    this.fedex_intl_economy_progressBar_label_visible = false;

    this.fedex_intl_priority_progressBar_visible = true;
    this.fedex_intl_priority_progressBar_label_visible = false;

    this.fedex_international_first_progressBar_visible = true;
    this.fedex_international_first_progressBar_label_visible = false;

    this.FedEx_International_Next_Flight_progressBar_visible = true;
    this.FedEx_International_Next_Flight_progressBar_label_visible = false;


    this.FedEx_International_MailService_progressBar_visible = true;
    this.FedEx_International_MailService_progressBar_label_visible = false;

    this.FedEx_Intl_Priority_Frt_progressBar_visible = true;
    this.FedEx_Intl_Priority_Frt_progressBar_label_visible = false;

    this.FedEx_International_MailService_progressBar_visible = true;
    this.FedEx_International_MailService_progressBar_label_visible = false;

    this.FedEx_Intl_Priority_Frt_progressBar_visible = true;
    this.FedEx_Intl_Priority_Frt_progressBar_label_visible = false;

    this.FedEx_Intl_Economy_Frt_progressBar_visible = true;
    this.FedEx_Intl_Economy_Frt_progressBar_label_visible = false;

    this.FedEx_Intl_Economy_Dist_progressBar_visible = true;
    this.FedEx_Intl_Economy_Dist_progressBar_label_visible = false;

    this.FedEx_Intl_Prty_DirDist_progressBar_visible = true;
    this.FedEx_Intl_Prty_DirDist_progressBar_label_visible = false;

    this.Intl_MailService_Economy_progressBar_visible = true;
    this.Intl_MailService_Economy_progressBar_label_visible = false;

    this.Intl_MailService_Priority_progressBar_visible = true;
    this.Intl_MailService_Priority_progressBar_label_visible = false;
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
    var clickedYear: any = this.fedexFormGroup.get('year')?.value;
    var chargeType = this.fedexFormGroup.get('chargeType')?.value;
    var typeCode = this.fedexFormGroup.get('typeCode')?.value;
    var clientId = this.clientId;
    var currentDate = new Date();
    var currentYear = new Date().getFullYear();
    var dateValue = this.datePipe.transform(currentDate, "yyyy-MM-dd");
    var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
    var strYearEnd = this.userProfileData.fileenddate1.substring(0, 4);
    var strMonthEnd = this.userProfileData.fileenddate1.substring(4, 6);
    var strDateEnd = this.userProfileData.fileenddate1.substring(6, 8);
    var dataasof = strMonthEnd + "-" + strDateEnd + "-" + strYearEnd;

    if (clickedYear == currentYear)
      urlParam['toDate'] = this.datePipe.transform(dataasof, "yyyy-MM-dd");
    else
      urlParam['toDate'] = clickedYear + "-12" + "-31";

    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;

    urlParam['reportType'] = "InternationalMap Detail Report";
    urlParam['reportName'] = "InternationalMap_Detail_Report";

    urlParam['reportFormat'] = "excel";
    urlParam['clientName'] = (this.userProfileData.clientName).replace(/[^a-zA-Z0-9 ]/g, "");
    urlParam['clientId'] = clientId;
    urlParam['fromDate'] = clickedYear.toString() + "-01-01";
    urlParam['loginId'] = 0;
    urlParam['modulename'] = "Internationalmap_Report";
    urlParam['status'] = "IN QUEUE";
    urlParam['year'] = clickedYear;
    urlParam['desc'] = "";
    urlParam['grp'] = "";
    urlParam['chargeType'] = chargeType;
    urlParam['chargeDesc'] = typeCode;
    urlParam['chargeGroup'] = "";
    urlParam['t002ClientProfileobj'] = this.fedexFormGroup.get('t002ClientProfile')?.value;
    urlParamArr.push(urlParam);
    this.httpfedexService.runReport(urlParam)?.subscribe(
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
