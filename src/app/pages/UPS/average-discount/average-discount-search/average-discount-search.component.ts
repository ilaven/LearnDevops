import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild, signal, ChangeDetectorRef } from '@angular/core';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-average-discount-search',
  templateUrl: './average-discount-search.component.html',
  styleUrls: ['./average-discount-search.component.scss'],
  standalone: false
})

/**
 * Right Sidebar component
 */
export class AverageDiscountSearchComponent implements OnInit {

  attribute: any;
  averageDiscountACList:any=[];
  averageDiscountReportACList:any=[];

  panelClass:any;
  clientType = signal<any>('');
  selectedYear: number[] = [];
  selectYear: number[] = [];
  dataasof: any;
  clientListFedex: any;
  serviceList:any;

  userProfileData: any;
  userProfileDataUps: any;
  userProfileDataFedex: any ;

  clientID: any;
  clientName: any;
  resultObj:any;

  avgDiscountUpsFormGroup = new UntypedFormGroup({
    year: new FormControl(''),
    chargeDescription: new FormControl({ value: '', disabled: false }),
    clientName: new FormControl(''),
    clientId: new FormControl(''),
    downloadReport: new FormControl(null)
  });

  avgDiscountFedexFormGroup = new UntypedFormGroup({
    chargeDescription: new FormControl({ value: '', disabled: false }),
    avgYear: new FormControl(''),
    clientName: new FormControl(''),
    downloadReport: new FormControl(null)
  });
  themeoption: any;

  demoloader() {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @Output() settingsButtonClicked = new EventEmitter();
  selectedReport: string = '';
  constructor(private offcanvasService: NgbOffcanvas, private store: Store<RootReducerState>,private commonService:CommonService,
    private cookiesService: CookiesService, private router: Router,private dialog: MatDialog,private httpfedexService:HttpfedexService, 
    private httpClientService:HttpClientService,private datePipe: DatePipe,private loaderService: LoaderService, private _cd:ChangeDetectorRef
  ) { 
    this.demoloader();
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
      if(this.clientType()== "OnTrac" || this.clientType()== "Dhl" || this.clientType()== "USPS"){
        this.router.navigate(['/'+this.clientType().toLowerCase()+'/dashboard']);
      }
    });
    
  }

  async ngOnInit() {
    
  }

  ngAfterViewInit() { }
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(async() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
      var currentYear = new Date().getFullYear();
      var stYear=currentYear-1;
      this.selectYear=[];
      for (let yearloop = stYear; yearloop <= currentYear; yearloop++) {
        this.selectYear.push(yearloop);
      }
      if(this.clientType()=="FedEx"){     
        await this.getUserFedex();
      } else{
        await this.loadClientProfile();
        await this.getUser();
      }
    });


  }

  async ExportTOExcel() { 
    this.averageDiscountReportACList=[];
    var averageDiscountDataArr=[]
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
    var fileName=this.clientType+"_Average_Discount"+this.selectedYear+".xlsx";
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Average Discount');
    var averageDiscountArr: any[][]=[];
    if(this.clientType().toUpperCase()=='UPS'){    
      this.avgDiscountUpsFormGroup.get('downloadReport')?.setValue("All");
      await this.httpClientService.fetchaveragediscount(this.avgDiscountUpsFormGroup.value).subscribe(
      (result: any)=>{
        if(result==null || result.length==0) {
          this.openModal("No Record Found");
          return;
        }else{
          this.averageDiscountReportACList=result;         
        this.resultDataFormatter(this.averageDiscountReportACList);
    
        for(let loop=0; loop < this.averageDiscountReportACList.length; loop++){
          averageDiscountDataArr=[];
          var total_Spend;
          var total_Spend_frt_Acc;
          var total_Spend_frt;
          var min_reduction;
          var min_netcharge;
          var ltr_TotalSpent;
          var ltr_Discount;
          var oneto5lbs_TotalSpent;
          var oneto5_lbs_Discount;
          var sixto10_lbs_Totalspent;
          var sixto10_lbs_Discount;
          var elevento20_lbs_TotalSpent;
          var elevento20_lbs_Discount;
          var twentyoneto30_lbs_TotalSpent;
          var twentyoneto30_lbs_Discount;
          var thirtyoneto50_lbs_TotalSpent;
          var thirtyoneto50_lbs_Discount;
          var fiftyoneto70_lbs_TotalSpent;
          var fiftyoneto70_lbs_Discount;
          var above70lbs_TotalSpent;
          var above70lbs_Discount;
    
          if(this.averageDiscountReportACList[loop].total_Spend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].total_Spend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            total_Spend="NA";  
          } else{
            total_Spend=Number(this.averageDiscountReportACList[loop].total_Spend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].total_Spend_frt_Acc=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].total_Spend_frt_Acc.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            total_Spend_frt_Acc="NA";  
          } else{
            total_Spend_frt_Acc=Number(this.averageDiscountReportACList[loop].total_Spend_frt_Acc.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].total_Spend_frt=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].total_Spend_frt.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            total_Spend_frt="NA";  
          } else{
            total_Spend_frt=Number(this.averageDiscountReportACList[loop].total_Spend_frt.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].ltr_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].ltr_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            ltr_TotalSpent="NA";  
          } else{
            ltr_TotalSpent=Number(this.averageDiscountReportACList[loop].ltr_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].ltr_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].ltr_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            ltr_Discount="NA";  
          } else{
            ltr_Discount=Number(this.averageDiscountReportACList[loop].ltr_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].oneto5lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].oneto5lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            oneto5lbs_TotalSpent="NA";  
          }  else{
            oneto5lbs_TotalSpent=Number(this.averageDiscountReportACList[loop].oneto5lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].oneto5lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].oneto5lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            oneto5_lbs_Discount="NA";  
          }  else{
            oneto5_lbs_Discount=Number(this.averageDiscountReportACList[loop].oneto5_lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].sixto10_lbs_Totalspent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].sixto10_lbs_Totalspent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            sixto10_lbs_Totalspent="NA";  
          } else{
            sixto10_lbs_Totalspent=Number(this.averageDiscountReportACList[loop].sixto10_lbs_Totalspent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].sixto10_lbs_Totalspent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].sixto10_lbs_Totalspent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            sixto10_lbs_Discount="NA";  
          }  else{
            sixto10_lbs_Discount=Number(this.averageDiscountReportACList[loop].sixto10_lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].elevento20_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].elevento20_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            elevento20_lbs_TotalSpent="NA";  
          } else{
            elevento20_lbs_TotalSpent=Number(this.averageDiscountReportACList[loop].elevento20_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].elevento20_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].elevento20_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            elevento20_lbs_Discount="NA";  
          } else{
            elevento20_lbs_Discount=Number(this.averageDiscountReportACList[loop].elevento20_lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].twentyoneto30_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].twentyoneto30_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            twentyoneto30_lbs_TotalSpent="NA";  
          }  else{
            twentyoneto30_lbs_TotalSpent=Number(this.averageDiscountReportACList[loop].twentyoneto30_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].twentyoneto30_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].twentyoneto30_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            twentyoneto30_lbs_Discount="NA";  
          }  else{
            twentyoneto30_lbs_Discount=Number(this.averageDiscountReportACList[loop].twentyoneto30_lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].thirtyoneto50_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].thirtyoneto50_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            thirtyoneto50_lbs_TotalSpent="NA";  
          } else{
            thirtyoneto50_lbs_TotalSpent=Number(this.averageDiscountReportACList[loop].thirtyoneto50_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          } if(this.averageDiscountReportACList[loop].thirtyoneto50_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].thirtyoneto50_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            thirtyoneto50_lbs_Discount="NA";  
          } else{
            thirtyoneto50_lbs_Discount=Number(this.averageDiscountReportACList[loop].thirtyoneto50_lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].fiftyoneto70_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].fiftyoneto70_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            fiftyoneto70_lbs_TotalSpent="NA";  
          }  else{
            fiftyoneto70_lbs_TotalSpent=Number(this.averageDiscountReportACList[loop].fiftyoneto70_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].fiftyoneto70_lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].fiftyoneto70_lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            fiftyoneto70_lbs_Discount="NA";  
          }  else{
            fiftyoneto70_lbs_Discount=Number(this.averageDiscountReportACList[loop].fiftyoneto70_lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].above70lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].above70lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00")  {
            above70lbs_TotalSpent="NA";  
          }  else{
            above70lbs_TotalSpent=Number(this.averageDiscountReportACList[loop].above70lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].above70lbs_TotalSpent=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].above70lbs_TotalSpent.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            above70lbs_Discount="NA";  
          } else{
            above70lbs_Discount=Number(this.averageDiscountReportACList[loop].above70lbs_Discount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }

          if(this.averageDiscountReportACList[loop].incentiveAmount=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].incentiveAmount.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00")  {
            min_reduction="NA";  
          } else{
            min_reduction=Number(this.averageDiscountReportACList[loop].incentiveAmount.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].netAmount=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].netAmount.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            min_netcharge="NA";  
          } else{
            min_netcharge=Number(this.averageDiscountReportACList[loop].netAmount.replace('$','').replace(/[,]/g,'').replace('%',''));
          }

          averageDiscountDataArr.push(this.averageDiscountReportACList[loop].crmAccountNumber,this.averageDiscountReportACList[loop].clientName,
            this.averageDiscountReportACList[loop].chargeDescription,
            total_Spend,total_Spend_frt_Acc,total_Spend_frt,min_reduction,min_netcharge,ltr_TotalSpent,ltr_Discount,oneto5lbs_TotalSpent,oneto5_lbs_Discount,sixto10_lbs_Totalspent,
            sixto10_lbs_Discount,elevento20_lbs_TotalSpent,elevento20_lbs_Discount,twentyoneto30_lbs_TotalSpent,twentyoneto30_lbs_Discount,
            thirtyoneto50_lbs_TotalSpent,thirtyoneto50_lbs_Discount,fiftyoneto70_lbs_TotalSpent,fiftyoneto70_lbs_Discount,above70lbs_TotalSpent,above70lbs_Discount
          );
          averageDiscountArr.push(averageDiscountDataArr)
        }
        var averageDiscountHeaderArr=[];
        averageDiscountHeaderArr.push('LJM Account Number','Client Name','Charge Description','Total Client Net Spend'
          ,'Total Service Spend (FRT+ACC)','Total Service Spend (FRT Only)','Minimum Reduction (PKG Only)','Minimum Net Charge (PKG Only)','Letter Total FRT Spend','Letter FRT Discount','1 to 5 lbs Total FRT Spend',
          '1 to 5 lbs FRT Discount','6 to 10 lbs Total FRT Spend','6 to 10 lbs FRT Discount','11 to 20 lbs Total FRT Spend',
          '11 to 20 lbs FRT Discount','21 to 30 lbs Total FRT Spend','21 to 30 lbs FRT Discount','31 to 50 lbs Total FRT Spend',
          '31 to 50 lbs FRT Discount','51 to 70 lbs Total FRT Spend','51 to 70 lbs FRT Discount','71 lbs above Total FRT Spend',
          '71 lbs above FRT Discount')
        worksheet.getColumn(4).numFmt = '$#,##0.00';
        worksheet.getColumn(5).numFmt = '$#,##0.00';
        worksheet.getColumn(6).numFmt = '$#,##0.00';
        worksheet.getColumn(7).numFmt = '$#,##0.00';
        worksheet.getColumn(8).numFmt = '$#,##0.00';
        worksheet.getColumn(9).numFmt =  '$#,##0.00';
        worksheet.getColumn(10).numFmt = '$#,##0.00';   
        worksheet.getColumn(11).numFmt = '$#,##0.00';
        worksheet.getColumn(12).numFmt = '0.00%';
        worksheet.getColumn(13).numFmt = '$#,##0.00';
        worksheet.getColumn(14).numFmt = '0.00%';
        worksheet.getColumn(15).numFmt = '$#,##0.00';
        worksheet.getColumn(16).numFmt = '0.00%';
        worksheet.getColumn(17).numFmt = '$#,##0.00';
        worksheet.getColumn(18).numFmt = '0.00%';
        worksheet.getColumn(19).numFmt = '$#,##0.00';
        worksheet.getColumn(20).numFmt = '0.00%';
        worksheet.getColumn(21).numFmt = '$#,##0.00';
        worksheet.getColumn(22).numFmt = '0.00%';
        worksheet.getColumn(23).numFmt = '$#,##0.00';
        worksheet.getColumn(24).numFmt = '0.00%';
      }
  
        //Add Header Row
      let headerRow = worksheet.addRow(averageDiscountHeaderArr);
      headerRow.font = { family: 4, size: 12, bold: true };
      // Cell Style : Fill and Border
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
      
          fgColor: { argb: 'D3D3D3' },
          bgColor: { argb: 'D3D3D3' }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      //Add Data and Conditional Formatting
      var count=1;
      averageDiscountArr.forEach(d => {
        let row = worksheet.addRow(d);
        row.eachCell((cell, number) => {
          if(count % 2==0){
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',

              fgColor: { argb: 'd0e3ff' }
            }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
          if(number==1||number==2||number==3){}
          else{    
            cell.alignment = { vertical: 'bottom',horizontal: 'right' }
          }
        })
        // let qty = row.getCell();
        let color = 'd0e3ff';
        count++;
      });
  
      worksheet.getColumn(1).width = 25;
      worksheet.getColumn(2).width = 30;
      worksheet.getColumn(3).width = 25;
      worksheet.getColumn(4).width = 25;
      worksheet.getColumn(5).width = 30;
      worksheet.getColumn(6).width = 30;
      worksheet.getColumn(7).width = 30;
      worksheet.getColumn(8).width = 25;
      worksheet.getColumn(9).width = 30;
      worksheet.getColumn(10).width = 25;
      worksheet.getColumn(11).width = 30;
      worksheet.getColumn(12).width = 25;
      worksheet.getColumn(13).width = 30;
      worksheet.getColumn(14).width = 25;
      worksheet.getColumn(15).width = 30;
      worksheet.getColumn(16).width = 25;
      worksheet.getColumn(17).width = 30;
      worksheet.getColumn(18).width = 25;
      worksheet.getColumn(19).width = 30;
      worksheet.getColumn(20).width = 27;
      worksheet.getColumn(21).width = 30;
      worksheet.getColumn(22).width = 27;
      worksheet.getColumn(23).width = 25;
      worksheet.addRow([]);
  
        //Generate Excel File with given name
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        })
      }, (error: any)=>{
        console.log(' error ',error);
      })  
    }else if(this.clientType().toUpperCase()=="FEDEX"){
      this.avgDiscountFedexFormGroup.get('downloadReport')?.setValue("All");
      this.httpfedexService.fedexFetchaveragediscount(this.avgDiscountFedexFormGroup.value).subscribe(
      (result: any)=>{
        this.averageDiscountReportACList=result;
        this.resultDataFormatterFedex(this.averageDiscountReportACList)
        if(this.averageDiscountReportACList==null || this.averageDiscountReportACList.length==0) {
          this.openModal("No Record Found");
          return;
        }
        
        for(let loop=0; loop < this.averageDiscountReportACList.length; loop++){
          averageDiscountDataArr=[]  
          var totalSpendForAllService;
          var totalSpendFRTWithAcc;
          var totalSpendFRTOnly;
          var w1to5lbsTotalSpend;
          var w1to5lbsDiscount;
          var w6to10lbsTotalSpend;
          var w6to10lbsDiscount;
          var w11to20lbsTotalSpend;
          var w11to20lbsDiscount;
          var w21to30lbsTotalSpend;
          var w21to30lbsDiscount;
          var w31to50lbsTotalSpend;
          var w31to50lbsDiscount;
          var w51to70lbsTotalSpend;
          var w51to70lbsDiscount;
          var w70lbsAboveTotalSpend;
          var w70lbsAboveDiscount;
          var netchargeFRT;
          var incentiveAmount;
          if(this.averageDiscountReportACList[loop].totalSpendForAllService=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].totalSpendForAllService.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            totalSpendForAllService="NA";  
          } else{
            totalSpendForAllService=Number(this.averageDiscountReportACList[loop].totalSpendForAllService.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].totalSpendFRTWithAcc=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].totalSpendFRTWithAcc.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            totalSpendFRTWithAcc="NA";  
          } else{
            totalSpendFRTWithAcc=Number(this.averageDiscountReportACList[loop].totalSpendFRTWithAcc.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].totalSpendFRTOnly=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].totalSpendFRTOnly.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00")  {
            totalSpendFRTOnly="NA";  
          } else{
            totalSpendFRTOnly=Number(this.averageDiscountReportACList[loop].totalSpendFRTOnly.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w1to5lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w1to5lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w1to5lbsTotalSpend="NA";  
          } else{
            w1to5lbsTotalSpend=Number(this.averageDiscountReportACList[loop].w1to5lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w1to5lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w1to5lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00")  {
            w1to5lbsDiscount="NA";  
          } else{
            w1to5lbsDiscount=Number(this.averageDiscountReportACList[loop].w1to5lbsDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].w6to10lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w6to10lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w6to10lbsTotalSpend="NA";  
          } else{
            w6to10lbsTotalSpend=Number(this.averageDiscountReportACList[loop].w6to10lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w6to10lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w6to10lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w6to10lbsDiscount="NA";  
          } else{
            w6to10lbsDiscount=Number(this.averageDiscountReportACList[loop].w6to10lbsDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].w11to20lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w11to20lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w11to20lbsTotalSpend="NA";  
          } else{
            w11to20lbsTotalSpend=Number(this.averageDiscountReportACList[loop].w11to20lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w11to20lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w11to20lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w11to20lbsDiscount="NA";  
          } else{
            w11to20lbsDiscount=Number(this.averageDiscountReportACList[loop].w11to20lbsDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].w21to30lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w21to30lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w21to30lbsTotalSpend="NA";  
          } else{
            w21to30lbsTotalSpend=Number(this.averageDiscountReportACList[loop].w21to30lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w21to30lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w21to30lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w21to30lbsDiscount="NA";  
          }  else{
            w21to30lbsDiscount=Number(this.averageDiscountReportACList[loop].w21to30lbsDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].w31to50lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w31to50lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w31to50lbsTotalSpend="NA";  
          } else{
            w31to50lbsTotalSpend=Number(this.averageDiscountReportACList[loop].w31to50lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w31to50lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w31to50lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w31to50lbsDiscount="NA";  
          }
          else{
            w31to50lbsDiscount=Number(this.averageDiscountReportACList[loop].w31to50lbsDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].w51to70lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w51to70lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w51to70lbsTotalSpend="NA";  
          }  else{
            w51to70lbsTotalSpend=Number(this.averageDiscountReportACList[loop].w51to70lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w51to70lbsTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w51to70lbsTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w51to70lbsDiscount="NA";  
          } else{
            w51to70lbsDiscount=Number(this.averageDiscountReportACList[loop].w51to70lbsDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
          if(this.averageDiscountReportACList[loop].w70lbsAboveTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w70lbsAboveTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00")  {
            w70lbsAboveTotalSpend="NA";  
          } else{
            w70lbsAboveTotalSpend=Number(this.averageDiscountReportACList[loop].w70lbsAboveTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''));
          }
          if(this.averageDiscountReportACList[loop].w70lbsAboveTotalSpend=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].w70lbsAboveTotalSpend.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            w70lbsAboveDiscount="NA";  
          }  else{
            w70lbsAboveDiscount=Number(this.averageDiscountReportACList[loop].w70lbsAboveDiscount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
  
          if(this.averageDiscountReportACList[loop].netchargeFRT=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].netchargeFRT.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            netchargeFRT="NA";  
          } else{
            netchargeFRT=Number(this.averageDiscountReportACList[loop].netchargeFRT.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
  
          if(this.averageDiscountReportACList[loop].incentiveAmount=="NA"||this.set2dpforPrice(this.averageDiscountReportACList[loop].incentiveAmount.replace('$','').replace(/[,]/g,'').replace('%',''))=="0.00") {
            incentiveAmount="NA";  
          }  else{
            incentiveAmount=Number(this.averageDiscountReportACList[loop].incentiveAmount.replace('$','').replace(/[,]/g,'').replace('%',''))/100;
          }
        
          averageDiscountDataArr.push(this.averageDiscountReportACList[loop].crmAccountNumber,this.averageDiscountReportACList[loop].clientName,
          this.averageDiscountReportACList[loop].chargeDescription,
            totalSpendForAllService,totalSpendFRTWithAcc,totalSpendFRTOnly,incentiveAmount,netchargeFRT,w1to5lbsTotalSpend,w1to5lbsDiscount,w6to10lbsTotalSpend,w6to10lbsDiscount,
            w11to20lbsTotalSpend,w11to20lbsDiscount,w21to30lbsTotalSpend,w21to30lbsDiscount,w31to50lbsTotalSpend,w31to50lbsDiscount,w51to70lbsTotalSpend,
            w51to70lbsDiscount,w70lbsAboveTotalSpend,w70lbsAboveDiscount
          );
          averageDiscountArr.push(averageDiscountDataArr)
        }
        var averageDiscountHeaderArr=[];
        averageDiscountHeaderArr.push('LJM Account Number','Client Name','Charge Description','Total Client Net Spend'
          ,'Total Service Spend (FRT+ACC)','Total Service Spend (FRT Only)','Minimum Reduction','Minimum Net Charge (PKG Only)','1 to 5 lbs Total FRT Spend',
          '1 to 5 lbs FRT Discount','6 to 10 lbs Total FRT Spend','6 to 10 lbs FRT Discount','11 to 20 lbs Total FRT Spend',
          '11 to 20 lbs FRT Discount','21 to 30 lbs Total FRT Spend','21 to 30 lbs FRT Discount','31 to 50 lbs Total FRT Spend',
          '31 to 50 lbs FRT Discount','51 to 70 lbs Total FRT Spend','51 to 70 lbs FRT Discount','71 lbs above Total FRT Spend',
          '71 lbs above FRT Discount')
        worksheet.getColumn(4).numFmt = '$#,##0.00';
        worksheet.getColumn(5).numFmt = '$#,##0.00';
        worksheet.getColumn(6).numFmt = '$#,##0.00';
        worksheet.getColumn(7).numFmt = '$#,##0.00';
        worksheet.getColumn(8).numFmt = '$#,##0.00';
        worksheet.getColumn(9).numFmt = '$#,##0.00';
        worksheet.getColumn(10).numFmt = '0.00%';
        worksheet.getColumn(11).numFmt = '$#,##0.00';
        worksheet.getColumn(12).numFmt = '0.00%';
        worksheet.getColumn(13).numFmt = '$#,##0.00';
        worksheet.getColumn(14).numFmt = '0.00%';
        worksheet.getColumn(15).numFmt = '$#,##0.00';
        worksheet.getColumn(16).numFmt = '0.00%';
        worksheet.getColumn(17).numFmt = '$#,##0.00';
        worksheet.getColumn(18).numFmt = '0.00%';
        worksheet.getColumn(19).numFmt = '$#,##0.00';
        worksheet.getColumn(20).numFmt = '0.00%';
        worksheet.getColumn(21).numFmt = '$#,##0.00';
        worksheet.getColumn(22).numFmt = '0.00%';
  
        //Add Header Row
        let headerRow = worksheet.addRow(averageDiscountHeaderArr);
        headerRow.font = { family: 4, size: 12, bold: true };
        // Cell Style : Fill and Border
        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
        
            fgColor: { argb: 'D3D3D3' },
            bgColor: { argb: 'D3D3D3' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })
        //Add Data and Conditional Formatting
        var count=1;
        averageDiscountArr.forEach(d => {
          let row = worksheet.addRow(d);
          row.eachCell((cell, number) => {
            if(count % 2==0){
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
  
                fgColor: { argb: 'd0e3ff' }
              }
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            if(number==1||number==2||number==3){}
            else{    
              cell.alignment = { vertical: 'bottom',horizontal: 'right' }
            }
          })
          // let qty = row.getCell();
          let color = 'd0e3ff';  
          count++;
        });
  
        worksheet.getColumn(1).width = 25;
        worksheet.getColumn(2).width = 30;
        worksheet.getColumn(3).width = 25;
        worksheet.getColumn(4).width = 25;
        worksheet.getColumn(5).width = 30;
        worksheet.getColumn(6).width = 30;
        worksheet.getColumn(7).width = 30;
        worksheet.getColumn(8).width = 25;
        worksheet.getColumn(9).width = 30;
        worksheet.getColumn(10).width = 25;
        worksheet.getColumn(11).width = 30;
        worksheet.getColumn(12).width = 25;
        worksheet.getColumn(13).width = 30;
        worksheet.getColumn(14).width = 25;
        worksheet.getColumn(15).width = 30;
        worksheet.getColumn(16).width = 25;
        worksheet.getColumn(17).width = 30;
        worksheet.getColumn(18).width = 25;
        worksheet.getColumn(19).width = 30;
        worksheet.getColumn(20).width = 27;
        worksheet.getColumn(21).width = 30;
        worksheet.getColumn(22).width = 27;
        worksheet.getColumn(23).width = 25;
        worksheet.addRow([]);
  
        //Generate Excel File with given name
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, fileName);
        })  
      }, (error: any)=>{
        console.log(' error',error);
      })
    }               
  
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height:'250px',     
      data: {pageValue: alertVal},
      panelClass:this.panelClass
    });
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
  clientList:any=[];
  isServiceDisable=false;
  searchActive=false;

  fetchaveragediscount(){
    this.avgDiscountUpsFormGroup.get('downloadReport')?.setValue(null);
  	this.httpClientService.fetchaveragediscount(this.avgDiscountUpsFormGroup.value).subscribe(
    (result:any)=>{
      this.selectedYear=this.avgDiscountUpsFormGroup.get('year')?.value;
      if(result==null || result.length==0)
      {
        this.openModal("No Record Found");
        // this.closeLoading();
        return;
      }else{
        this.averageDiscountACList=result;
        if(this.averageDiscountACList!=null && this.averageDiscountACList.length!=0)
        {
          this.dataasof=this.datePipe.transform(result[0].dataAsOf,"MM-dd-yyyy");
        }                       
        this.resultDataFormatter(this.averageDiscountACList);
        // this.closeLoading();
      }
    },	(error: any)=>{
      console.log(' error ',error);
    })
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
        // this.closeLoading();
        return;
      }
      // this.closeLoading();
    },(error:any)=>{
      console.log(' error',error);
    })
  }

  fetchChargeDescritionList(){
    var t002ClientObj = {};
    this.httpfedexService.fetchChargeDescritionList(t002ClientObj).subscribe(
    result=>{
      this.serviceList=result;
    }, error=>{
      console.log('error',error);
    })
  }

  fetchClientName(){
    var t002ClientObj={};
    this.httpfedexService.fetchClientName(t002ClientObj).subscribe(
    (result:any)=>{
      var resultObj=result;
      this.clientList=result;
      this.clientList.splice(0, 0, {clientName:"All"});
      this.clientListFedex=this.clientList;
      // this.closeLoading();
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
    this._cd.markForCheck();
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
    // this.openLoading();
    this.fetchaveragediscount(); 
  }
  
  async  cmb_year_change() {
    // this.openLoading();
    this.fetchaveragediscount(); 
  }
      
  async  cmb_clientname_change(clientName:any) {
    var event:any;
		clientName=this.avgDiscountUpsFormGroup.get('clientName')?.value;
    // this.openLoading();
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
    // this.openLoading();
    this.fedexFetchaveragediscount(); 
  }
      
  async  cmb_year_changeFedex() {
    // this.openLoading();
    this.fedexFetchaveragediscount();     
  }

  async  cmb_clientname_changeFedex(clientName:any) {
    var event:any;
    // this.openLoading();
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
    } else{
      this.searchActive=false;
    }
  }

}
