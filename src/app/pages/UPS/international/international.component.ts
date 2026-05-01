import { ChangeDetectorRef, Component, HostListener, OnInit, OnDestroy, Signal, signal, TemplateRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { InternationalPopupComponent } from '../popup/international-popup/international-popup.component';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-ups-international',
  templateUrl: './international.component.html',
  styleUrls: ['./international.component.scss'],
  standalone: false
})
export class UpsInternationalComponent implements OnInit, OnDestroy {
  reportsFormGroup = new FormGroup({
    reportLogId: new FormControl(''),
    t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
    t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
  });
  clientType = signal<any>('');
  randomNumber: any;
  selectYear: any = [];
  internationalGroundService = signal<any>([]);
  internationalFormGroup = new FormGroup({
    invoiceyear: new FormControl(''),
    invoiceMonth: new FormControl(''),
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
    chargeGroup: new FormControl(""),
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
  private mapChart?: am4maps.MapChart;

  constructor(private cookiesService: CookiesService, private dialog: MatDialog, private cd: ChangeDetectorRef, private datePipe: DatePipe, private httpClientService: HttpClientService, private router: Router, private commonService: CommonService, private loaderService: LoaderService, private zone: NgZone) {
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
  displayYear = new Date().getFullYear();
  themeoption: any;
  clientId: any;
  clientName: any;
  panelClass: any;
  clickedYear: any;
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
  chargetypevalue: any = signal<any>("INT+ACC");
  frtAndFrt_AccBtnVal = signal<any>("FRT+ACC");
  typecodevalue: any = "Exp";
  expAndImpVal = "Exp"
  chargeType = "FRT+ACC";//To preselect value of radio btn
  typecode = "Exp";//To preselect value of radio btn
  currentyear: any;
  cmb_year: any;
  changeTitle: any;
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
  async cmb_clientid_changeHandler(event: any) {
    await this.refresh();

    var ClientNametWithSplChar = event.clientName;
    var clientName = ClientNametWithSplChar.replace(/[^a-zA-Z0-9]/g, "");

    var imagepath = "";
    imagepath = "assets/Ljm_image/" + clientName + ".jpg";

  }
  async refresh() {
    this.worldwideexpeditedtxt_id = "Worldwide Expedited";
    this.worldwideexpresstxt_id = "Worldwide Express";
    this.worldwidesavertxt_id = "Worldwide Saver";
    this.worldwidestandardtxt_id = "Standard";
    this.worldwideexpressEartlytxt_id = "Worldwide Express Freight";
    this.worldwideexpressPlustxt_id = "Worldwide Express Plus";
    this.worldwideexpressPlusReturnstxt_id = "Worldwide Express Saver";
    this.worldwideexpressReturnstxt_id = "Worldwide Economy DDP";
    this.worldwidesaverReturnstxt_id = "Worldwide Economy DDU";
    this.worldwidefreighttxt_id = "Freight";
    this.chargetypevalue.set("INT+ACC");
    this.typecodevalue = "EXP";
    this.currentyear = this.displayYear;
    this.cmb_year = this.displayYear;
    await this.creation_Handler();

  }
  async creation_Handler() {
    this.clickedYear = this.cmb_year + "";
    this.internationalFormGroup.get('client_name')?.setValue(this.clientName);
    this.internationalFormGroup.get('client_id')?.setValue(this.clientId);
    this.internationalFormGroup.get('year')?.setValue(this.clickedYear);
    if (this.expAndImpVal == "Imp")
      this.internationalFormGroup.get('typecode')?.setValue("IMP");
    if (this.expAndImpVal == "Exp")
      this.internationalFormGroup.get('typecode')?.setValue("EXP");
    await this.fetchdisplay_INT_Heatmap_list();
    this.internationalFormGroup.get('clientId')?.setValue(this.clientId);
    this.internationalFormGroup.get('clientName')?.setValue(this.clientName);
    this.internationalFormGroup.get('invoiceyear')?.setValue(this.clickedYear);
    await this.fetchInterDashboard_Service();
  }
  async fetchdisplay_INT_Heatmap_list() {
    this.changeTitle = this.internationalFormGroup.get('chargetypevalue')?.value;
    await this.httpClientService.fetchdisplay_INT_Heatmap_list(this.internationalFormGroup.value)?.subscribe(
      result => {
        this.result_Heatmap_list(result);
      },
      error => {
        console.log(' error ', error);
      })
  }
  async fetchInterDashboard_Service() {

    await this.httpClientService.fetchInterDashboard_Service(this.internationalFormGroup.value)?.subscribe(
      result => {
        var resultobj = result;
        this.fetchInterDashboard_Service_result_event(resultobj);
      },
      error => {
        console.log(' error ', error);

      })
  }
  totAmt = "0";
  chargeDesList: any = [];
  chargeBack_result = [];
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
  // worldwide_Express_Saver_progressBar:any;
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
  totalpackagetemp = 0;
  totalquantitytemp = 0;
  progressBarUpsList: any = [];
  resultobj: any;
  async Progressbarvalues(collection: any) {
    console.log(collection);
    var chargBacklength = collection.length;
    if (chargBacklength != 0) {
      this.worldwide_Expedited = 0.00;
      this.worldwide_Express = 0.00;
      this.worldwide_Saver = 0.00;
      this.worldwide_Standard = 0.00;

      this.worldwide_ExpressEartly = 0.00;
      this.worldwide_ExpressPlus = 0.00;
      this.worldwide_ExpressPlusReturns = 0.00;
      this.worldwide_ExpressReturns = 0.00;
      this.worldwide_SaverReturns = 0.00;
      this.worldwide_Freight = 0.00;
      this.internationalGroundService.set([]);
      this.progressBarUpsList = [];
      this.progressBarUpsList.push({ serviceType: this.worldwideexpeditedtxt_id, progressBar: this.worldwide_Expedited_progressBar, netCharge: this.worldwide_Expedited, serviceName: 'Worldwide Expedited' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpresstxt_id, progressBar: this.worldwide_Express_progressBar, netCharge: this.worldwide_Express, serviceName: 'Worldwide Express' });
      this.progressBarUpsList.push({ serviceType: this.worldwidesavertxt_id, progressBar: this.worldwide_Saver_progressBar, netCharge: this.worldwide_Saver, serviceName: 'Worldwide Saver' });
      this.progressBarUpsList.push({ serviceType: this.worldwidestandardtxt_id, progressBar: this.worldwide_Standard_progressBar, netCharge: this.worldwide_Standard, serviceName: 'Worldwide Standard' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressEartlytxt_id, progressBar: this.worldwide_ExpressEartly_progressBar, netCharge: this.worldwide_ExpressEartly, serviceName: 'Worldwide Express Freight' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressPlustxt_id, progressBar: this.worldwide_ExpressPlus_progressBar, netCharge: this.worldwide_ExpressPlus, serviceName: 'Worldwide Express Plus' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressPlusReturnstxt_id, progressBar: this.worldwide_ExpressPlusReturns_progressBar, netCharge: this.worldwide_ExpressPlusReturns, serviceName: 'Worldwide Express Saver' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressReturnstxt_id, progressBar: this.worldwide_ExpressReturns_progressBar, netCharge: this.worldwide_ExpressReturns, serviceName: 'Worldwide Economy DDP' });
      this.progressBarUpsList.push({ serviceType: this.worldwidesaverReturnstxt_id, progressBar: this.worldwide_SaverReturns_progressBar, netCharge: this.worldwide_SaverReturns, serviceName: 'Worldwide Economy DDU' });
      this.progressBarUpsList.push({ serviceType: this.worldwidefreighttxt_id, progressBar: this.worldwide_Freight_progressBar, netCharge: this.worldwide_Freight, serviceName: 'Freight' });
      this.internationalGroundService.set(this.progressBarUpsList);
    }
    this.chargeDesList = [];
    this.maxValue = 0;
    if (collection == null)
      return;
    if (collection.length > 0) {
      for (var rymloop = 0; rymloop < collection.length; rymloop++) {
        var chargeBackObj = collection[rymloop];
        if (chargeBackObj.chargetype == this.chargetypevalue() && chargeBackObj.typenewcode == this.typecodevalue) {
          this.totAmt = (chargeBackObj.netamount);
          if (chargeBackObj.groupby == "Worldwide Expedited")
            this.worldwide_Expedited = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Express")
            this.worldwide_Express = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Saver")
            this.worldwide_Saver = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Standard")
            this.worldwide_Standard = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Express Plus")
            this.worldwide_ExpressPlus = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Express Freight")
            this.worldwide_ExpressEartly = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Express Saver")
            this.worldwide_ExpressPlusReturns = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Economy DDP")
            this.worldwide_ExpressReturns = (this.totAmt);

          if (chargeBackObj.groupby == "Worldwide Economy DDU")
            this.worldwide_SaverReturns = (this.totAmt);

          if (chargeBackObj.groupby == "Freight")
            this.worldwide_Freight = (this.totAmt);
        }



      }
      this.chargeDesList.push(this.worldwide_Expedited);
      this.chargeDesList.push(this.worldwide_Express);
      this.chargeDesList.push(this.worldwide_Saver);
      this.chargeDesList.push(this.worldwide_Standard);

      this.chargeDesList.push(this.worldwide_ExpressEartly);
      this.chargeDesList.push(this.worldwide_ExpressPlus);
      this.chargeDesList.push(this.worldwide_ExpressPlusReturns);
      this.chargeDesList.push(this.worldwide_ExpressReturns);
      this.chargeDesList.push(this.worldwide_SaverReturns);
      this.chargeDesList.push(this.worldwide_Freight);

      this.maxValue = Math.max.apply(null, this.chargeDesList);
      var totMax: Number = this.maxValue / 5;

      this.worldwide_Expedited_progressBar = await this.setProgress(this.worldwide_Expedited, this.maxValue);

      this.worldwide_Express_progressBar = await this.setProgress(this.worldwide_Express, this.maxValue);

      // this.worldwide_Express_Saver_progressBar=await this.setProgress( this.worldwide_Express_Saver,this.maxValue);
      this.worldwide_Saver_progressBar = await this.setProgress(this.worldwide_Saver, this.maxValue);

      this.worldwide_Standard_progressBar = await this.setProgress(this.worldwide_Standard, this.maxValue);

      this.worldwide_ExpressEartly_progressBar = await this.setProgress(this.worldwide_ExpressEartly, this.maxValue);
      this.worldwide_ExpressPlus_progressBar = await this.setProgress(this.worldwide_ExpressPlus, this.maxValue);
      this.worldwide_ExpressPlusReturns_progressBar = await this.setProgress(this.worldwide_ExpressPlusReturns, this.maxValue);
      this.worldwide_ExpressReturns_progressBar = await this.setProgress(this.worldwide_ExpressReturns, this.maxValue);
      this.worldwide_SaverReturns_progressBar = await this.setProgress(this.worldwide_SaverReturns, this.maxValue);
      this.worldwide_Freight_progressBar = await this.setProgress(this.worldwide_Freight, this.maxValue);
      this.internationalGroundService.set([]);
      this.progressBarUpsList = [];
      this.progressBarUpsList.push({ serviceType: this.worldwideexpeditedtxt_id, progressBar: this.worldwide_Expedited_progressBar, netCharge: this.worldwide_Expedited, serviceName: 'Worldwide Expedited' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpresstxt_id, progressBar: this.worldwide_Express_progressBar, netCharge: this.worldwide_Express, serviceName: 'Worldwide Express' });
      this.progressBarUpsList.push({ serviceType: this.worldwidesavertxt_id, progressBar: this.worldwide_Saver_progressBar, netCharge: this.worldwide_Saver, serviceName: 'Worldwide Saver' });
      this.progressBarUpsList.push({ serviceType: this.worldwidestandardtxt_id, progressBar: this.worldwide_Standard_progressBar, netCharge: this.worldwide_Standard, serviceName: 'Worldwide Standard' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressEartlytxt_id, progressBar: this.worldwide_ExpressEartly_progressBar, netCharge: this.worldwide_ExpressEartly, serviceName: 'Worldwide Express Freight' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressPlustxt_id, progressBar: this.worldwide_ExpressPlus_progressBar, netCharge: this.worldwide_ExpressPlus, serviceName: 'Worldwide Express Plus' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressPlusReturnstxt_id, progressBar: this.worldwide_ExpressPlusReturns_progressBar, netCharge: this.worldwide_ExpressPlusReturns, serviceName: 'Worldwide Express Saver' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressReturnstxt_id, progressBar: this.worldwide_ExpressReturns_progressBar, netCharge: this.worldwide_ExpressReturns, serviceName: 'Worldwide Economy DDP' });
      this.progressBarUpsList.push({ serviceType: this.worldwidesaverReturnstxt_id, progressBar: this.worldwide_SaverReturns_progressBar, netCharge: this.worldwide_SaverReturns, serviceName: 'Worldwide Economy DDU' });
      this.progressBarUpsList.push({ serviceType: this.worldwidefreighttxt_id, progressBar: this.worldwide_Freight_progressBar, netCharge: this.worldwide_Freight, serviceName: 'Freight' });
      this.progressBarUpsList.sort((a: any, b: any) => b.netCharge - a.netCharge);
      this.internationalGroundService.set(this.progressBarUpsList);
    }
  }
  async fetchInterDashboard_Service_result_event(event: any) {
    this.chargeBack_result = event;
    if (this.chargeBack_result != null && this.chargeBack_result.length > 0) {
      await this.Progressbarvalues(this.chargeBack_result);
    }
    else {
      this.worldwide_Expedited = 0.00;
      this.worldwide_Express = 0.00;
      // this.worldwide_Express_Saver=0.00;
      this.worldwide_Saver = 0.00;
      this.worldwide_Standard = 0.00;

      this.worldwide_ExpressEartly = 0.00;
      this.worldwide_ExpressPlus = 0.00;
      this.worldwide_ExpressPlusReturns = 0.00;
      this.worldwide_ExpressReturns = 0.00;
      this.worldwide_SaverReturns = 0.00;
      this.worldwide_Freight = 0.00;

      this.worldwide_Express_progressBar_visible = false;
      this.worldwide_Express_progressBar_includeInLayout = false;
      this.worldwide_Express_progressBar_label_visible = true;
      this.worldwide_Express_progressBar_label_includeInLayout = true;

      this.worldwide_Expedited_progressBar_visible = false;
      this.worldwide_Expedited_progressBar_includeInLayout = false;
      this.worldwide_Expedited_progressBar_label_visible = true;
      this.worldwide_Expedited_progressBar_label_includeInLayout = true;

      this.worldwide_Express_Saver_progressBar_visible = false;
      this.worldwide_Express_Saver_progressBar_includeInLayout = false;
      this.worldwide_Express_Saver_progressBar_label_visible = true;
      this.worldwide_Express_Saver_progressBar_label_includeInLayout = true;

      this.worldwide_Saver_progressBar_visible = false;
      this.worldwide_Saver_progressBar_includeInLayout = false;
      this.worldwide_Saver_progressBar_label_visible = true;
      this.worldwide_Saver_progressBar_label_includeInLayout = true;

      this.worldwide_Standard_progressBar_visible = false;
      this.worldwide_Standard_progressBar_includeInLayout = false;
      this.worldwide_Standard_progressBar_label_visible = true;
      this.worldwide_Standard_progressBar_label_includeInLayout = true;
      this.internationalGroundService.set([]);
      this.progressBarUpsList = [];
      this.progressBarUpsList.push({ serviceType: this.worldwideexpeditedtxt_id, progressBar: this.worldwide_Expedited_progressBar, netCharge: this.worldwide_Expedited, serviceName: 'Worldwide Expedited' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpresstxt_id, progressBar: this.worldwide_Express_progressBar, netCharge: this.worldwide_Express, serviceName: 'Worldwide Express' });
      this.progressBarUpsList.push({ serviceType: this.worldwidesavertxt_id, progressBar: this.worldwide_Saver_progressBar, netCharge: this.worldwide_Saver, serviceName: 'Worldwide Saver' });
      this.progressBarUpsList.push({ serviceType: this.worldwidestandardtxt_id, progressBar: this.worldwide_Standard_progressBar, netCharge: this.worldwide_Standard, serviceName: 'Worldwide Standard' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressEartlytxt_id, progressBar: this.worldwide_ExpressEartly_progressBar, netCharge: this.worldwide_ExpressEartly, serviceName: 'Worldwide Express Freight' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressPlustxt_id, progressBar: this.worldwide_ExpressPlus_progressBar, netCharge: this.worldwide_ExpressPlus, serviceName: 'Worldwide Express Plus' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressPlusReturnstxt_id, progressBar: this.worldwide_ExpressPlusReturns_progressBar, netCharge: this.worldwide_ExpressPlusReturns, serviceName: 'Worldwide Express Saver' });
      this.progressBarUpsList.push({ serviceType: this.worldwideexpressReturnstxt_id, progressBar: this.worldwide_ExpressReturns_progressBar, netCharge: this.worldwide_ExpressReturns, serviceName: 'Worldwide Economy DDP' });
      this.progressBarUpsList.push({ serviceType: this.worldwidesaverReturnstxt_id, progressBar: this.worldwide_SaverReturns_progressBar, netCharge: this.worldwide_SaverReturns, serviceName: 'Worldwide Economy DDU' });
      this.progressBarUpsList.push({ serviceType: this.worldwidefreighttxt_id, progressBar: this.worldwide_Freight_progressBar, netCharge: this.worldwide_Freight, serviceName: 'Freight' });
      this.internationalGroundService.set(this.progressBarUpsList);
    }
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
    await this.creation_Handler();
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
  async setProgress(dataValue: any, maxValue: any) {
    console.log(dataValue, maxValue);
    var obtained = dataValue;
    var total = maxValue;
    var percent = obtained * 100 / total;
    if (Number.isNaN(percent)) {
      return 0;
    }
    return await percent;
  }
  async linkfrtacc_clickHandler(event: any) {
    this.frtAndFrt_AccBtnVal.set("FRT+ACC");
    this.internationalFormGroup.get('chargetypevalue')?.setValue(this.frtAndFrt_AccBtnVal());
    this.internationalFormGroup.get('chargeType')?.setValue("INT+ACC");
    await this.Mapdata();
    if (this.expAndImpVal == "Imp" && this.frtAndFrt_AccBtnVal() == "FRT+ACC") {
      this.chargetypevalue.set("INT+ACC");
      this.typecodevalue = "IMP";
      await this.chargeBack_frtacc(this.chargeBack_result);
    }
    if (this.expAndImpVal == "Exp" && this.frtAndFrt_AccBtnVal() == "FRT+ACC") {
      this.chargetypevalue.set("INT+ACC");
      this.typecodevalue = "EXP";
      await this.chargeBack_frtacc(this.chargeBack_result);
    }
  }
     async  linkfrt_clickHandler(event:any)
      {

       this.frtAndFrt_AccBtnVal.set("FRT");
       this.internationalFormGroup.get('chargetypevalue')?.setValue(this.frtAndFrt_AccBtnVal());
       this.internationalFormGroup.get('chargeType')?.setValue("INT_FRT");
       await this.Mapdata();
        if(this.expAndImpVal =="Imp" && this.frtAndFrt_AccBtnVal() =="FRT"){
          this.chargetypevalue.set("INT_FRT");
          this.typecodevalue="IMP";
        this.chargetypevalue.set("INT_FRT");
       await this.chargeBack_frtacc(this.chargeBack_result);
        }
        if(this.expAndImpVal=="Exp" && this.frtAndFrt_AccBtnVal()=="FRT"){
          this.chargetypevalue.set("INT_FRT");
           this.typecodevalue="EXP";
        
        this.chargetypevalue.set("INT_FRT");
       await this.chargeBack_frtacc(this.chargeBack_result);
        }
        
      }
loginId:Number=123;
  excelDownload_clickHandler() {
    var urlParam: any = {};
    var clickedYear: any = this.internationalFormGroup.get('year')?.value;
    var chargeType = this.internationalFormGroup.get('chargeType')?.value;
    var typeCode = this.internationalFormGroup.get('typecode')?.value;

    var clientId = this.clientId;
    var currentDate = new Date();
    var currentYear = new Date().getFullYear();
    var dateValue: any = this.datePipe.transform(currentDate, "yyyy-MM-dd");
    var currDate: any = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss");
    var dataasof = this.userProfileData.dataasof;

    urlParam['fromDate'] = clickedYear.toString() + "-01-01";
    if (clickedYear == currentYear)
      urlParam['toDate'] = this.datePipe.transform(dataasof, "yyyy-MM-dd");
    else
      urlParam['toDate'] = clickedYear + "-12" + "-31";

    urlParam['moduleName'] = "Internationalmap_Report";
    urlParam['login_id'] = this.loginId.toString();
    urlParam['t001ClientProfile'] = this.internationalFormGroup.get('t001ClientProfile')?.value;

    urlParam['reportType'] = "InternationalMap Detail Report";
    urlParam['designFileName'] = "InternationalMap_Detail_Report";
    urlParam['reportName'] = "InternationalMap Detail Report";

    urlParam['status'] = 'IN QUEUE';
    urlParam['reportFormat'] = "CSV";
    urlParam['clientId'] = clientId;
    urlParam['clientname'] = this.userProfileData.clientName;
    urlParam['accountNumber'] = "NA";
    urlParam['chargeDes'] = "";
    urlParam['year'] = clickedYear;
    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['fZone'] = chargeType;
    urlParam['tZone'] = typeCode;
    this.httpClientService.runReport(urlParam)?.subscribe(
      result => {
        this.saveOrUpdateReportLogResult(result);
      }, error => {
      });
  }
  async saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setInterval(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");



  }
  openModal(alertVal: any) {
    let openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
  async Exp_clickHandler(event: any) {
    this.expAndImpVal = event.target.value;
    this.worldwideexpeditedtxt_id = "Worldwide Expedited";
    this.worldwideexpresstxt_id = "Worldwide Express";
    this.worldwidesavertxt_id = "Worldwide Saver";
    this.worldwidestandardtxt_id = "Standard";
    this.worldwideexpressEartlytxt_id = "Worldwide Express Freight";
    this.worldwideexpressPlustxt_id = "Worldwide Express Plus";
    this.worldwideexpressPlusReturnstxt_id = "Worldwide Express Saver";
    this.worldwideexpressReturnstxt_id = "Worldwide Economy DDP";
    this.worldwidesaverReturnstxt_id = "Worldwide Economy DDU";
    this.worldwidefreighttxt_id = "Freight";

    await this.Mapdata();
    if (this.expAndImpVal == "Exp" && this.frtAndFrt_AccBtnVal() == "FRT+ACC") {
      this.chargetypevalue.set("INT+ACC");
      this.typecodevalue = "EXP";
      await this.chargeBack_frtacc(this.chargeBack_result);
    }
    if (this.expAndImpVal == "Exp" && this.frtAndFrt_AccBtnVal() == "FRT") {
      this.chargetypevalue.set("INT_FRT");
      this.typecodevalue = "EXP";
      await this.chargeBack_frtacc(this.chargeBack_result);
    }
  }
  async chargeBack_frtacc(chargebackfrtacc: any) {
    this.chargeBack_result = chargebackfrtacc;
    await this.Progressbarvalues(this.chargeBack_result);
  }
  async Mapdata() {
    this.clickedYear = this.cmb_year + "";
    this.internationalFormGroup.get('client_name')?.setValue(this.clientName);
    this.internationalFormGroup.get('client_id')?.setValue(this.clientId);
    this.internationalFormGroup.get('year')?.setValue(this.clickedYear);
    if (this.expAndImpVal == "Imp")
      this.internationalFormGroup.get('typecode')?.setValue("IMP");
    if (this.expAndImpVal == "Exp")
      this.internationalFormGroup.get('typecode')?.setValue("EXP");
    await this.fetchdisplay_INT_Heatmap_list();
  }
  async Imp_clickHandler(event: any) {
    this.expAndImpVal = event.target.value;
    this.worldwideexpeditedtxt_id = "Worldwide Expedited";
    this.worldwideexpresstxt_id = "Worldwide Express";
    this.worldwidesavertxt_id = "Worldwide Saver";
    this.worldwidestandardtxt_id = "Standard";
    this.worldwideexpressEartlytxt_id = "Worldwide Express Freight";
    this.worldwideexpressPlustxt_id = "Worldwide Express Plus";
    this.worldwideexpressPlusReturnstxt_id = "Worldwide Express Saver";
    this.worldwideexpressReturnstxt_id = "Worldwide Economy DDP";
    this.worldwidesaverReturnstxt_id = "Worldwide Economy DDU";
    this.worldwidefreighttxt_id = "Freight";
    await this.Mapdata();
    if (this.expAndImpVal == "Imp" && this.frtAndFrt_AccBtnVal() == "FRT+ACC") {
      this.chargetypevalue.set("INT+ACC");
      this.typecodevalue = "IMP";
      await this.Progressbarvalues(this.chargeBack_result);
    }
    if (this.expAndImpVal == "Imp" && this.frtAndFrt_AccBtnVal() == "FRT") {
      this.chargetypevalue.set("INT_FRT");
      this.typecodevalue = "IMP";
      await this.Progressbarvalues(this.chargeBack_result);
    }

  }

  async internationalGroupedClick(event: any, eventObj:any) {
    if (eventObj.netCharge == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }

    if (this.worldwide_Expedited_progressBar == 0 && event == "Worldwide Expedited") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_Express_progressBar == 0 && event == "Worldwide Express") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwide_Saver_progressBar == 0 && event == "Worldwide Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_Standard_progressBar == 0 && event == "Worldwide Standard") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.worldwide_ExpressEartly_progressBar == 0 && event == "Worldwide Express Freight") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_ExpressPlus_progressBar == 0 && event == "Worldwide Express Plus") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_ExpressPlusReturns_progressBar == 0 && event == "Worldwide Express Saver") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_ExpressReturns_progressBar == 0 && event == "Worldwide Economy DDP") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_SaverReturns_progressBar == 0 && event == "Worldwide Economy DDU") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.worldwide_Freight_progressBar == 0 && event == "Freight") {
      this.openModal("Data Too Small to Display");
      return;
    }

    this.internationalFormGroup.get('clientId')?.setValue((this.clientId).toString());
    this.internationalFormGroup.get('clientName')?.setValue(this.clientName);
    this.internationalFormGroup.get('invoiceyear')?.setValue(this.clickedYear);
    this.internationalFormGroup.get('groupby')?.setValue(event);
    this.internationalFormGroup.get('typecode')?.setValue(this.typecodevalue);
    this.internationalFormGroup.get('themeoption')?.setValue(this.themeoption);
    const chargetypevalue: any = this.internationalFormGroup.get('chargetypevalue')?.value;
    this.internationalFormGroup.get('chargetypevalue')?.setValue(chargetypevalue);
    this.internationalFormGroup.get('chargeDescription')?.setValue((this.chargetypevalue()));

    var resultobj = this.internationalFormGroup.value;
    this.openDialog(resultobj);

  }

  dialogValue: any;
  openDialog(sendValue: any) {
    const dialogRef = this.dialog.open(InternationalPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: sendValue }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result;
          this.cd.detectChanges();
    });
  }
} 
