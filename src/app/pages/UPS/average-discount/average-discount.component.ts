import { Component, AfterViewInit, ElementRef,  OnInit, Signal, signal, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/core/services/common.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { AuthPopupComponent } from '../popup/auth-popup/auth-popup.component';

@Component({
  selector: 'app-ups-average-discount',
  templateUrl: './average-discount.component.html',
  styleUrls: ['./average-discount.component.scss'],
  standalone: false
})
export class UpsAverageDiscountComponent implements OnInit , AfterViewInit {
  clientType = signal<any>('');
  currentday:any;
  fullyear: any;
  t009averagediscountObj: any;  
  customerListAC=[];
  testcustomer=[];
  selectedclientProfile: any;
  searchActive=false;
  selectYear: number[] = [];
  averageDiscountACList:any=[];
  averageDiscountReportACList:any=[];
  userProfileData: any;
  userProfileDataUps: any;
  clientID: any;
  clientName: any;
  themeoption: any;
  isLoading: any;
  dataasof: any;
  userProfileDataFedex: any ;
  clientListFedex: any;

  resultObj: any;
  clientList:any=[];
  randomNumber: any;
  selectedYear:any=[];
  dialogValue: any;
  averageDiscountACListFedex:any;
  serviceList:any;
  panelClass:any;

  SearchType="All"
  isServiceDisable=false;

  avgDiscountUpsFormGroup=new UntypedFormGroup({
    year:new FormControl(''),
    chargeDescription:new FormControl(''),
    clientName:new FormControl(''),
    clientId:new FormControl(''),
    downloadReport:new FormControl(null)
  })
  avgDiscountFedexFormGroup=new UntypedFormGroup({
    chargeDescription:new FormControl(''),
    avgYear:new FormControl(''),
    clientName:new FormControl(''),
    downloadReport:new FormControl(null)
  })

  constructor(private cookiesService: CookiesService,private loaderService: LoaderService, private authentocationService: AuthenticationService,
    private httpfedexService:HttpfedexService, private httpClientService:HttpClientService, private router: Router, 
    private commonService:CommonService, private dialog: MatDialog, private datePipe: DatePipe, private _cd:ChangeDetectorRef) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
      if(this.clientType()== "OnTrac" || this.clientType()== "Dhl" || this.clientType()== "USPS"){
        this.router.navigate(['/'+this.clientType().toLowerCase()+'/dashboard']);
      }
    });
    this.cookiesService.checkForClientName();
  }

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

   ngOnInit(): void {
    this.loaderService.show();
    this.demoloader()
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.openAuthModal();
  }

  ngAfterViewInit() {
    // Sync scrollbar width dynamically
    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    this.topScroll.nativeElement.firstElementChild!.setAttribute(
      'style',
      `width:${tableWidth}px`
    );
  }

  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }
 
  /**
  * Multiple Default Select2
  */
   selectValue = ['Choice 1', 'Choice 2', 'Choice 3'];
  // @ViewChild('exportDataString') exportDataString: ElementRef;
  
  toggleCompareAnalysisPopup(param: any){
    this.commonService.emitContractParam(param);
  }

  fetchaveragediscount(){
    this.avgDiscountUpsFormGroup.get('downloadReport')?.setValue(null);
  	this.httpClientService.fetchaveragediscount(this.avgDiscountUpsFormGroup.value).subscribe(
    (result:any)=>{
      this.selectedYear=this.avgDiscountUpsFormGroup.get('year')?.value;
      if(result==null || result.length==0)
      {
        this.openModal("No Record Found");
        this.closeLoading();
        return;
      }else{
        this.averageDiscountACList=result;
        if(this.averageDiscountACList!=null && this.averageDiscountACList.length!=0)
        {
          this.dataasof=this.datePipe.transform(result[0].dataAsOf,"MM-dd-yyyy");
        }                       
        this.resultDataFormatter(this.averageDiscountACList);
        this.closeLoading();
      }
    },	(error: any)=>{
      console.log(' error ',error);
    })
  }

  resultDataFormatter(resultParam:any){
    var paramList=resultParam;
    for(let loop =0; loop<paramList.length; loop++){
      var paramObj= paramList[loop];
      if(this.set2dpforPrice(paramObj["total_Spend"])=="0.00")
      {
        paramObj["total_Spend"]="NA";  
      }
      else{
        paramObj["total_Spend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["total_Spend"]));
      }
      if(this.set2dpforPrice(paramObj["service_Discount"])=="0.00")
      {
        paramObj["service_Discount"]="NA";  
      }
      else{
        paramObj["service_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["service_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["total_Spend_frt_Acc"])=="0.00")
      {
        paramObj["total_Spend_frt_Acc"]="NA";  
      }
      else{
        paramObj["total_Spend_frt_Acc"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["total_Spend_frt_Acc"]));
      }
      if(this.set2dpforPrice(paramObj["total_Spend_frt"])=="0.00")
      {
        paramObj["total_Spend_frt"]="NA";  
      }
      else{
        paramObj["total_Spend_frt"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["total_Spend_frt"]));
      }
      if(this.set2dpforPrice(paramObj["ltr_TotalSpent"])=="0.00")
      {
        paramObj["ltr_Discount"]="NA";  
      }
      else{
        paramObj["ltr_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["ltr_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["ltr_TotalSpent"])=="0.00")
      {
        paramObj["ltr_TotalSpent"]="NA";  
      }
      else{
        paramObj["ltr_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["ltr_TotalSpent"]));
      }
      if(this.set2dpforPrice(paramObj["oneto5lbs_TotalSpent"])=="0.00")
      {
        paramObj["oneto5_lbs_Discount"]="NA";  
      }
      else{
        paramObj["oneto5_lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["oneto5_lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["oneto5lbs_TotalSpent"])=="0.00")
      {
        paramObj["oneto5lbs_TotalSpent"]="NA";  
      }
      else{
        paramObj["oneto5lbs_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["oneto5lbs_TotalSpent"]));
      }
      if(this.set2dpforPrice(paramObj["sixto10_lbs_Totalspent"])=="0.00")
      {
        paramObj["sixto10_lbs_Discount"]="NA";  
      }
      else{
        paramObj["sixto10_lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["sixto10_lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["sixto10_lbs_Totalspent"])=="0.00")
      {
        paramObj["sixto10_lbs_Totalspent"]="NA";  
      }
      else{
        paramObj["sixto10_lbs_Totalspent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["sixto10_lbs_Totalspent"]));
      }
      if(this.set2dpforPrice(paramObj["elevento20_lbs_TotalSpent"])=="0.00")
      {
        paramObj["elevento20_lbs_Discount"]="NA";  
      }
      else{
        paramObj["elevento20_lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["elevento20_lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["elevento20_lbs_TotalSpent"])=="0.00")
      {
        paramObj["elevento20_lbs_TotalSpent"]="NA";  
      }
      else{
        paramObj["elevento20_lbs_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["elevento20_lbs_TotalSpent"]));
      }
      if(this.set2dpforPrice(paramObj["twentyoneto30_lbs_TotalSpent"])=="0.00")
      {
        paramObj["twentyoneto30_lbs_Discount"]="NA";  
      }
      else{
        paramObj["twentyoneto30_lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["twentyoneto30_lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["twentyoneto30_lbs_TotalSpent"])=="0.00")
      {
        paramObj["twentyoneto30_lbs_TotalSpent"]="NA";  
      }
      else{
        paramObj["twentyoneto30_lbs_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["twentyoneto30_lbs_TotalSpent"]));
      }
      if(this.set2dpforPrice(paramObj["thirtyoneto50_lbs_TotalSpent"])=="0.00")
      {
        paramObj["thirtyoneto50_lbs_Discount"]="NA";  
      }
      else{
        paramObj["thirtyoneto50_lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["thirtyoneto50_lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["thirtyoneto50_lbs_TotalSpent"])=="0.00")
      {
        paramObj["thirtyoneto50_lbs_TotalSpent"]="NA";  
      }
      else{
        paramObj["thirtyoneto50_lbs_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["thirtyoneto50_lbs_TotalSpent"]));
      }
      if(this.set2dpforPrice(paramObj["fiftyoneto70_lbs_TotalSpent"])=="0.00")
      {
        paramObj["fiftyoneto70_lbs_Discount"]="NA";  
      }
      else{
        paramObj["fiftyoneto70_lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["fiftyoneto70_lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["fiftyoneto70_lbs_TotalSpent"])=="0.00")
      {
        paramObj["fiftyoneto70_lbs_TotalSpent"]="NA";  
      }
      else{
        paramObj["fiftyoneto70_lbs_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["fiftyoneto70_lbs_TotalSpent"]));
      }
      if(this.set2dpforPrice(paramObj["above70lbs_TotalSpent"])=="0.00")
      {
        paramObj["above70lbs_Discount"]="NA";  
      }
      else{
        paramObj["above70lbs_Discount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["above70lbs_Discount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["above70lbs_TotalSpent"])=="0.00")
      {
        paramObj["above70lbs_TotalSpent"]="NA";  
      }
      else{
        paramObj["above70lbs_TotalSpent"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["above70lbs_TotalSpent"]));
      }

      if(this.set2dpforPrice(paramObj["netAmount"])=="0.00")
      {
        paramObj["netAmount"]="NA";  
      }
      else{
        paramObj["netAmount"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["netAmount"]));
      }
      if(this.set2dpforPrice(paramObj["incentiveAmount"])=="0.00")
      {
        paramObj["incentiveAmount"]="NA";  
      }
      else{
        paramObj["incentiveAmount"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["incentiveAmount"]));
      }
    }

  }

  resultDataFormatterFedex(resultParam:any){
    var paramList=resultParam;
    for(let loop =0; loop<paramList.length; loop++){
      var paramObj= paramList[loop];
      if(this.set2dpforPrice(paramObj["totalSpendForAllService"])=="0.00")
      {
        paramObj["totalSpendForAllService"]="NA";  
      }
      else{
        paramObj["totalSpendForAllService"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["totalSpendForAllService"]));
      }
      if(this.set2dpforPrice(paramObj["totalSpendFRTWithAcc"])=="0.00")
      {
        paramObj["totalSpendFRTWithAcc"]="NA";  
      }
      else{
        paramObj["totalSpendFRTWithAcc"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["totalSpendFRTWithAcc"]));
      }
      if(this.set2dpforPrice(paramObj["percentageOfServiceFRTWithAcc"])=="0.00")
      {
        paramObj["percentageOfServiceFRTWithAcc"]="NA";  
      }
      else{
        paramObj["percentageOfServiceFRTWithAcc"]=this.setCommaQty( this.set2dpforPercentage(paramObj["percentageOfServiceFRTWithAcc"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["totalSpendFRTOnly"])=="0.00")
      {
        paramObj["totalSpendFRTOnly"]="NA";  
      }
      else{
        paramObj["totalSpendFRTOnly"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["totalSpendFRTOnly"]));
      }
      if(this.set2dpforPrice(paramObj["w1to5lbsTotalSpend"])=="0.00")
      {
        paramObj["w1to5lbsTotalSpend"]="NA";  
      }
      else{
        paramObj["w1to5lbsTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w1to5lbsTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w1to5lbsTotalSpend"])=="0.00"||paramObj["w1to5lbsTotalSpend"]=="NA")
      {
        paramObj["w1to5lbsDiscount"]="NA";  
      }
      else{
        paramObj["w1to5lbsDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w1to5lbsDiscount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["w6to10lbsTotalSpend"])=="0.00")
      {
        paramObj["w6to10lbsTotalSpend"]="NA";  
      }
      else{
        paramObj["w6to10lbsTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w6to10lbsTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w6to10lbsTotalSpend"])=="0.00"||paramObj["w6to10lbsTotalSpend"]=="NA")
      {
        paramObj["w6to10lbsDiscount"]="NA";  
      }
      else{
        paramObj["w6to10lbsDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w6to10lbsDiscount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["w11to20lbsTotalSpend"])=="0.00")
      {
        paramObj["w11to20lbsTotalSpend"]="NA";  
      }
      else{
        paramObj["w11to20lbsTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w11to20lbsTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w11to20lbsTotalSpend"])=="0.00"||paramObj["w11to20lbsTotalSpend"]=="NA")
      {
        paramObj["w11to20lbsDiscount"]="NA";  
      }
      else{
        paramObj["w11to20lbsDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w11to20lbsDiscount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["w21to30lbsTotalSpend"])=="0.00")
      {
        paramObj["w21to30lbsTotalSpend"]="NA";  
      }
      else{
        paramObj["w21to30lbsTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w21to30lbsTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w21to30lbsTotalSpend"])=="0.00"||paramObj["w21to30lbsTotalSpend"]=="NA")
      {
        paramObj["w21to30lbsDiscount"]="NA";  
      }
      else{
        paramObj["w21to30lbsDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w21to30lbsDiscount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["w31to50lbsTotalSpend"])=="0.00")
      {
        paramObj["w31to50lbsTotalSpend"]="NA";  
      }
      else{
        paramObj["w31to50lbsTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w31to50lbsTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w31to50lbsTotalSpend"])=="0.00"||paramObj["w31to50lbsTotalSpend"]=="NA")
      {
        paramObj["w31to50lbsDiscount"]="NA";  
      }
      else{
        paramObj["w31to50lbsDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w31to50lbsDiscount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["w51to70lbsTotalSpend"])=="0.00")
      {
        paramObj["w51to70lbsTotalSpend"]="NA";  
      }
      else{
        paramObj["w51to70lbsTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w51to70lbsTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w51to70lbsTotalSpend"])=="0.00"||paramObj["w51to70lbsTotalSpend"]=="NA")
      {
        paramObj["w51to70lbsDiscount"]="NA";  
      }
      else{
        paramObj["w51to70lbsDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w51to70lbsDiscount"]))+"%";
      }
      if(this.set2dpforPrice(paramObj["w70lbsAboveTotalSpend"])=="0.00")
      {
        paramObj["w70lbsAboveTotalSpend"]="NA";  
      }
      else{
        paramObj["w70lbsAboveTotalSpend"]="$"+this.setCommaQty( this.set2dpforPrice(paramObj["w70lbsAboveTotalSpend"]));
      }
      if(this.set2dpforPrice(paramObj["w70lbsAboveTotalSpend"])=="0.00"||paramObj["w70lbsAboveTotalSpend"]=="NA")
      {
        paramObj["w70lbsAboveDiscount"]="NA";  
      }
      else{
        paramObj["w70lbsAboveDiscount"]=this.setCommaQty( this.set2dpforPercentage(paramObj["w70lbsAboveDiscount"]))+"%";
      }

      if(this.set2dpforPrice(paramObj["incentiveAmount"])=="0.00"||paramObj["incentiveAmount"]=="NA")
      {
        paramObj["incentiveAmount"]="NA";  
      }
      else{
        paramObj["incentiveAmount"]="$"+this.setCommaQty( this.set2dpforPercentage(paramObj["incentiveAmount"]));
      }

      if(this.set2dpforPrice(paramObj["netchargeFRT"])=="0.00"||paramObj["netchargeFRT"]=="NA")
      {
        paramObj["netchargeFRT"]="NA";  
      }
      else{
        paramObj["netchargeFRT"]="$"+this.setCommaQty( this.set2dpforPercentage(paramObj["netchargeFRT"]));
      }
    }
  }
  setCommaQty(eve: string){
    return eve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  set2dpforPrice(value_price: any){
    var value;
    if(value_price==null || value_price=="." || value_price=="" || value_price=='null') {
      value="0.00";
    } else if(value_price=="0")
    {  
      value="0.00";
    } else{          
     value=parseFloat(value_price).toFixed(2);
    }
    return value;
  }

  set2dpforPercentage(value_price:any){  
    var value=parseFloat(value_price).toFixed(2);
    if(value_price==null || value_price=="." || value_price=="" || value_price=='null' || value_price=="0.00"){
      value="0";
    } else if(value_price==0.00){
      value="0";
    }
    return value;
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height:'250px',     
      data: {pageValue: alertVal},
      panelClass:this.panelClass
    });
  }

    
  async openAuthModal() {
    this.themeoption=await this.cookiesService.getCookie('themeOption').then( res=>{ return res;  });
    if(this.themeoption=="dark"){
      this.panelClass='page-dark';
    } else{
      this.panelClass='custom-dialog-panel-class';
    }
    this.openLoading();
    const dialogConfig = this.dialog.open(AuthPopupComponent, {
      width: '470px',
      height: 'auto',  
      disableClose: true,
      panelClass:this.panelClass,  
    });

    dialogConfig.afterClosed().subscribe(result => {
      this.dialogValue = result.event;
      if(this.dialogValue=="true"){
        this.cookiesService.carrierType.subscribe((clienttype)=>{
          this.clientType.set(clienttype);
        }); 
        this.demoloader();
        var currentYear = new Date().getFullYear();
        var stYear=currentYear-1;
        this.selectYear=[];
        for (let yearloop = stYear; yearloop <= currentYear; yearloop++) {
          this.selectYear.push(yearloop);
        }
        if(this.clientType()=="FedEx"){     
          this.getUserFedex();
        } else{
          this.loadClientProfile();
          this.getUser();
        }
        return;
      }else{
        this.router.navigate(['/'+this.clientType().toLowerCase()+'/dashboard']);
      }
    });
  }

  openLoading(){
    this.isLoading=true;
  }
  closeLoading(){
    this.isLoading=false;
  }
  supervisorclientpassword(){
  	this.httpClientService.supervisorclientpassword(this.avgDiscountUpsFormGroup.value).subscribe(
    (result:any)=>{
      this.resultObj=result;
    }, error=>{
      console.log(' error ',error);
    })
  }
  loadClientProfile(){
    var t001custObj={};
    this.httpClientService.loadClientProfile(t001custObj).subscribe(
    result=>{
      result.splice(0, 0, {clientName:"All"}); 
      this.clientList=result;
    }, error=>{
      console.log('error',error);
    })
  }
  
  ///*Fedex API *////
  fedexFetchaveragediscount(){
     this.avgDiscountFedexFormGroup.get('downloadReport')?.setValue(null);
     this.httpfedexService.fedexFetchaveragediscount(this.avgDiscountFedexFormGroup.value).subscribe(
    (result:any)=>{
      this.selectedYear=this.avgDiscountFedexFormGroup.get('avgYear')?.value;
      this.averageDiscountACList=result;
      if(this.averageDiscountACList!=null && this.averageDiscountACList.length!=0)
      {
        this.dataasof=this.datePipe.transform(result[0].dataAsOf,"MM-dd-yyyy");
      }
      this.resultDataFormatterFedex(this.averageDiscountACList);
      if(this.averageDiscountACList==null || this.averageDiscountACList.length==0)
      {
        this.openModal("No Record Found");
        this.closeLoading();
        return;
      }
      this.closeLoading();
    },(error:any)=>{
      console.log(' error',error);
    })
  }
  
  fetchChargeDescritionList(){
    var t002ClientObj = {};
    this.httpfedexService.fetchChargeDescritionList(t002ClientObj).subscribe(
    (result:any)=>{
      this.serviceList=result;
    }, (error:any)=>{
      console.log('error',error);
    })
  }

  fetchClientName(){
    var t002ClientObj={};
    this.httpfedexService.fetchClientName(t002ClientObj).subscribe(
    (result:any)=>{
      this.clientList=result;
      this.clientList.splice(0, 0, {clientName:"All"});
      this.clientListFedex=this.clientList;
      this.closeLoading();
    },(error:any)=>{
      console.log('error',error);
    })
  }
 
  ///*Fedex API *////
  async getUser(){
    this.userProfileData =await this.commonService.getUserprofileData();
    this.userProfileDataUps=this.userProfileData[0];

    this.clientID = this.userProfileDataUps.clientId;
    this.clientName = this.userProfileDataUps.clientName;

    var yearData=await new Date().getFullYear();
    await this.avgDiscountUpsFormGroup.get('clientName')?.setValue("All");
    await this.avgDiscountUpsFormGroup.get('chargeDescription')?.setValue("Ground Commercial");
    await this.avgDiscountUpsFormGroup.get('year')?.setValue(yearData);
    await this.avgDiscountUpsFormGroup.get('downloadReport')?.setValue(null);
    this.fetchaveragediscount();
  }
      
  async getUserFedex(){
    this.userProfileData =await this.commonService.getUserprofileData();
    this.userProfileDataFedex=this.userProfileData[0];

    this.clientID = this.userProfileDataFedex.clientId;
    this.clientName = this.userProfileDataFedex.clientName;
    this.themeoption=await this.cookiesService.getCookie('themeOption').then( res=>{ return res;  });

    var yearData=await new Date().getFullYear();
    await this.avgDiscountFedexFormGroup.get('clientName')?.setValue("All");
    await this.avgDiscountFedexFormGroup.get('chargeDescription')?.setValue("Ground");
    await this.avgDiscountFedexFormGroup.get('avgYear')?.setValue(yearData);
    await this.avgDiscountFedexFormGroup.get('downloadReport')?.setValue(null);
    this.fetchClientName();
    this.fetchChargeDescritionList();
    this.fedexFetchaveragediscount();
  }

  async cmb_service_change() {
    this.openLoading();
    this.fetchaveragediscount(); 
  }
  
  async  cmb_year_change() {
    this.openLoading();
    this.fetchaveragediscount(); 
  }
      
  async  cmb_clientname_change(clientName:any) {
    var event:any;
		clientName=this.avgDiscountUpsFormGroup.get('clientName')?.value;
    this.openLoading();
    for(let loop= 0; loop<this.clientList.length; loop++){
      if(this.clientList[loop].clientName==clientName){
        event =loop;
      }
    }
    var clientName= this.clientList[event].clientName
    this.fetchaveragediscount();
    if(clientName=="All")
      this.isServiceDisable=false;  
    else
      this.isServiceDisable=true;  
  }

  async  cmb_service_changeFedex() {
    this.openLoading();
    this.fedexFetchaveragediscount(); 
  }
      
  async  cmb_year_changeFedex() {
    this.openLoading();
    this.fedexFetchaveragediscount();     
  }
      
      
  async  cmb_clientname_changeFedex(clientName:any) {
    var event:any;
    this.openLoading();
		clientName=this.avgDiscountFedexFormGroup.get('clientName')?.value;
    for(let loop= 0; loop<this.clientList.length; loop++){
      if(this.clientList[loop].clientName==clientName){
        event =loop;
      }
    }
    var clientName= this.clientList[event].clientName
    this.fedexFetchaveragediscount();
    if(clientName=="All")
      this.isServiceDisable=false;  
    else
      this.isServiceDisable=true;  
  }

  clickSearchFun(event: string){
    if(event=="open"){
      this.searchActive=true;
    }
    else{
      this.searchActive=false;
    }
  }  
}
