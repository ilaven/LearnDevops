import { Component, Inject, Optional, OnInit } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';  
import { UntypedFormGroup, UntypedFormControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';  
import { CommonService } from 'src/app/core/services/common.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-modal-selector',
  templateUrl: './modal.component.html',
  imports:[CommonModule, ReactiveFormsModule, MatDialogModule, MatDatepickerModule,MatIconModule],
  providers: [DatePipe],
})
export class TrackingPopupModalComponent implements OnInit {
  dialogValue:any;
  typeinfo:any;
  clientName:any;
  clientNameTxt:any;
  pack_id1:any;
  pack_id:any;
  ad_gl_id:any;
  pack_id2:any;
  pack_id3:any;
  pack_id13:any;
  addressline_1:any;
  addressline_2:any;
  addressline_3:any;
  addressline_4:any;
  addressline_5:any;
  addressline_6:any;
  receiveraddressline_1:any;
  receiveraddressline_2:any;
  receiveraddressline_3:any;
  receiveraddressline_4:any;
  receiveraddressline_5:any;
  receiveraddressline_6:any;
  ref3:any;
  accessorialsAC:any=[];
  allChargeDescAC:any=[];
  netamountgrandtotal_id:any;
  incentiveamountgrandtotal_id:any;
  grossamountgrandtotal_id:any;
  service_id:any;
  pa_service_id:any;
  bi_invoidat_id:any;
  ad_tran_id:any;
  account_id:any;
  paaccount_id:any;
  pa_zone_id:any;
  pa_billedweight_id:any;
  pa_acutal_id:any;
  pa_ent_dim_id:any;
  pa_dim_id:any;
  invoice_id:any;
  tracking_id:any;
  bi_invo_id:any;
  ref1:any;
  ref2:any;
  pa_pack_id:any;
  container_type:any;
  netdue_id:any;
  commonAC:any=[];
  chargeinfocommonAC:any=[];
  chargeinfocommonACfooter:any=[];
  refund_LinkBar:any=[];
  refund_LinkBar11:any=[];
  refund_LinkBar11total:any;

  totalAccessorialsAmnt:any;
  netFrtCharge:any;
  frtIncentive:any;
  grossFrtCharge:any;
  total:any;
  refund=0;
  txtAmount:any;
  loginId=123;
  fromPage:any;
  fromDialog:any;
  themeoption:any;
  panelClass:any;
  fetchTrakingnumberRes=[];
    reportsFormGroup = new UntypedFormGroup({  
    reportLogId: new UntypedFormControl(''),
    t001ClientProfile: new UntypedFormGroup({ clientId: new UntypedFormControl('')  }),  
  });
  constructor(
      public dialogRef: MatDialogRef<TrackingPopupModalComponent>, private httpClientService: HttpClientService, private datePipe: DatePipe,  
    private commonService:CommonService, private dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  this.panelClass=data.panelClass;
    this.fromPage = data.pageValue;
    this.typeinfo=this.fromPage.basisValue;
    this.clientName=this.fromPage.clientname;
    this.themeoption=this.fromPage.themeoption;
      this.httpClientService.fetch_Trakingnumber(this.fromPage).subscribe(
    (result:any) => {
      this.fetchTrakingnumberRes=result;
      this.trackingList(this.fetchTrakingnumberRes);
    },
    (error:any) => {
      console.log('error ', error);
    })
  }
 
  ngOnInit() {
  }
  private  formatText(textToFormat:string):string {
    return (textToFormat == null ||textToFormat == "")? "NA" : textToFormat;
  }

 trackingList(resultParameter:any){
    var trackingAC=resultParameter;
    var addressline1=null;
    var addressline2=null;
    var addressline3=null;
    var tempObj:any =[]; 
    var tempchargeinfoObj:any=[]; 
    var tempaccObj:any=[]; 
    var tempallchargedesObj:any =[]; 
    var trackingnumber=0;
    var privioustrackingnumber:any=null;
    var packagecount=0;
    var amount=0;
    var frtamount=0;
    var netdue=0;
    var grosstotal=0;
    var disamount=0;
    var acctotal=0;
    var count=0;  
    var returncount=0;  
    var returncount1=0;
    var shpflag=0;
    var refundflag=0;
    var accessfiledFooter2HeaderText:string;
    var chargefieldFooterHeaderText:string;
    var netamountgrandtotal=0;
    var incentiveamountgrandtotal=0;
    var grossamountgrandtotal=0;
    var chargeinfodatagrid_idRowCount;
    var chargeinfodatagrid_idFooterRowCount;
    var accessfiledFooter1HeaderText;
    var accessfiledFooterHeaderText;
    var chargeinfodatagrid_idFooterRowCount;
    if(trackingAC!=null && trackingAC.length>0 ){
      if (this.typeinfo=="UPS"){    
        var resultracking = [];
        for (var listcount= 0; listcount < trackingAC.length; listcount++) {
          let value = trackingAC[listcount].trackingNumber;         
          if (resultracking.indexOf(value) == -1) {
            resultracking.push(value);
          }
        }
        
        this.clientNameTxt=this.clientName;
        
        for(var distinctlistcount= 0; distinctlistcount < resultracking.length; distinctlistcount++) {
          trackingnumber=resultracking[distinctlistcount];

          for(var listcount= 0; listcount < trackingAC.length; listcount++) {
            if (trackingnumber == trackingAC[listcount].trackingNumber){                  
              packagecount+= Number(trackingAC[listcount].packageQuantity);
              netamountgrandtotal+=Number(trackingAC[listcount].netAmount);
              incentiveamountgrandtotal+=Number(trackingAC[listcount].incentiveAmount);
              grossamountgrandtotal= netamountgrandtotal + incentiveamountgrandtotal;
              this.netamountgrandtotal_id = this.formatText(netamountgrandtotal.toString());
              this.incentiveamountgrandtotal_id = this.formatText(incentiveamountgrandtotal.toString());
              this.grossamountgrandtotal_id = this.formatText(grossamountgrandtotal.toString());
              
              if (this.container_type ==null||this.container_type ==""||this.container_type == "NA"){
                this.container_type =this.formatText(trackingAC[listcount].containerType);
              }
              tempallchargedesObj=[];
              tempallchargedesObj["chargeDescription"]=this.formatText(trackingAC[listcount].chargeDescription);
              tempallchargedesObj["netAmount"]=trackingAC[listcount].netAmount;
              tempallchargedesObj["incentiveAmount"]=trackingAC[listcount].incentiveAmount;
              tempallchargedesObj["grossAmount"]=Number(trackingAC[listcount].netAmount)+Number(trackingAC[listcount].incentiveAmount);
                
              this.allChargeDescAC.push(tempallchargedesObj);
                          

              if (trackingAC[listcount].chargeCategoryCode=="SHP" && trackingAC[listcount].chargeClassificationCode=="FRT"){

                if (this.pack_id1 == null||this.pack_id1 == ""||this.pack_id1 == "NA"){
                  this.pack_id1=this.formatText(trackingAC[listcount].packageReferenceNumber1);
                  this.pack_id=this.formatText(trackingAC[listcount].packageReferenceNumber1);
                }
                if (this.pack_id2 == null||this.pack_id2 == ""||this.pack_id2 == "NA"){
                  this.pack_id2=this.formatText(trackingAC[listcount].packageReferenceNumber2);
                }
                if (this.pack_id13 == null||this.pack_id13 == ""||this.pack_id13 == "NA"){
                  this.pack_id13=this.formatText(trackingAC[listcount].packageReferenceNumber3);
                }
                if(this.ref1 == null||this.ref1 == ""||this.ref1 == "NA")
                {
                  this.ref1 =this.formatText(trackingAC[listcount].shipmentReferenceNumber1);
                }
                if(this.ref2 == null||this.ref2 == ""||this.ref2 == "NA")
                {
                  this.ref2 =this.formatText(trackingAC[listcount].shipmentReferenceNumber2);
                }
                if(this.pa_zone_id == null||this.pa_zone_id == ""||this.pa_zone_id == "NA")
                {
                  this.pa_zone_id =this.formatText(trackingAC[listcount].zone);
                }

                if (this.addressline_1==null||this.addressline_1 == ""){
                  this.addressline_1=trackingAC[listcount].senderName;
                }
                if (this.addressline_2==null||this.addressline_2 == ""){
                  this.addressline_2=trackingAC[listcount].senderCompanyName;
                }
                if (this.addressline_3==null||this.addressline_3==""){
                  this.addressline_3=trackingAC[listcount].senderAddressLine1;
                }
                if (this.addressline_4==null||this.addressline_4==""){
                  this.addressline_4=trackingAC[listcount].senderAddressLine2;
                }

                if (this.addressline_5==null||this.addressline_5=="" ||this.addressline_5==" " ){
                  
                  this.addressline_5 =trackingAC[listcount].senderCity+" "+trackingAC[listcount].senderState+" "+trackingAC[listcount].senderPostal;
                 
                }
                 if (this.addressline_6==null ||this.addressline_6=="" ||this.addressline_6==" " ){
                  this.addressline_6=trackingAC[listcount].senderCountry;
                }
                if (this.receiveraddressline_1==null|| this.receiveraddressline_1 ==""){
                  this.receiveraddressline_1=trackingAC[listcount].receiverName;
                }if (this.receiveraddressline_2==null|| this.receiveraddressline_2 ==""){
                  this.receiveraddressline_2=trackingAC[listcount].receiverCompanyName;
                }if (this.receiveraddressline_3==null || this.receiveraddressline_3 ==""){
                  this.receiveraddressline_3 = trackingAC[listcount].receiverAddressLine1;
                }if (this.receiveraddressline_4==null || this.receiveraddressline_4 ==""){
                  this.receiveraddressline_4 = trackingAC[listcount].receiverAddressLine2;
                }if (this.receiveraddressline_5==null || this.receiveraddressline_5 ==""){
                  this.receiveraddressline_5 = trackingAC[listcount].receiverCity+"  "+ trackingAC[listcount].receiverState+"  "+trackingAC[listcount].receiverPostal;
                }if (this.receiveraddressline_6 ==null || this.receiveraddressline_6 ==""){
                  this.receiveraddressline_6 =trackingAC[listcount].receiverCountry;
                }
              }
              else if (trackingAC[listcount].chargeCategoryCode=="RTN" && trackingAC[listcount].chargeClassificationCode=="FRT"){

                if (this.pack_id1 == null||this.pack_id1 == ""||this.pack_id1 == "NA"){
                  this.pack_id1=this.formatText(trackingAC[listcount].packageReferenceNumber1);
                  this.pack_id=this.formatText(trackingAC[listcount].packageReferenceNumber1);
                }
                if (this.pack_id2 == null||this.pack_id2 == ""||this.pack_id2 == "NA"){
                  this.pack_id2=this.formatText(trackingAC[listcount].packageReferenceNumber2);
                }
                if (this.pack_id13 == null||this.pack_id13 == ""||this.pack_id13 == "NA"){
                  this.pack_id13=this.formatText(trackingAC[listcount].packageReferenceNumber3);
                }
                if(this.ref1 == null||this.ref1 == ""||this.ref1 == "NA")
                {
                  this.ref1 =this.formatText(trackingAC[listcount].shipmentReferenceNumber1);
                }
                if(this.ref2 == null||this.ref2 == ""||this.ref2 == "NA")
                {
                  this.ref2 =this.formatText(trackingAC[listcount].shipmentReferenceNumber2);
                }
                if(this.pa_zone_id == null||this.pa_zone_id == ""||this.pa_zone_id == "NA")
                {
                  this.pa_zone_id =this.formatText(trackingAC[listcount].zone);
                }

                if (this.addressline_1==null||this.addressline_1 == ""){
                  this.addressline_1=trackingAC[listcount].senderName;
                }
                if (this.addressline_2==null||this.addressline_2 == ""){
                  this.addressline_2=trackingAC[listcount].senderCompanyName;
                }
                if (this.addressline_3==null||this.addressline_3==""){
                  this.addressline_3=trackingAC[listcount].senderAddressLine1;
                }
                if (this.addressline_4==null||this.addressline_4==""){
                  this.addressline_4=trackingAC[listcount].senderAddressLine2;
                }

                if (this.addressline_5==null||this.addressline_5=="" ||this.addressline_5==" " ){
                  
                  this.addressline_5 =trackingAC[listcount].senderCity+" "+trackingAC[listcount].senderState+" "+trackingAC[listcount].senderPostal;
                 
                }
                 if (this.addressline_6==null ||this.addressline_6=="" ||this.addressline_6==" " ){
                  this.addressline_6=trackingAC[listcount].senderCountry;
                }
                if (this.receiveraddressline_1==null|| this.receiveraddressline_1 ==""){
                  this.receiveraddressline_1=trackingAC[listcount].receiverName;
                }if (this.receiveraddressline_2==null|| this.receiveraddressline_2 ==""){
                  this.receiveraddressline_2=trackingAC[listcount].receiverCompanyName;
                }if (this.receiveraddressline_3==null || this.receiveraddressline_3 ==""){
                  this.receiveraddressline_3 = trackingAC[listcount].receiverAddressLine1;
                }if (this.receiveraddressline_4==null || this.receiveraddressline_4 ==""){
                  this.receiveraddressline_4 = trackingAC[listcount].receiverAddressLine2;
                }if (this.receiveraddressline_5==null || this.receiveraddressline_5 ==""){
                  this.receiveraddressline_5 = trackingAC[listcount].receiverCity+"  "+ trackingAC[listcount].receiverState+"  "+trackingAC[listcount].receiverPostal;
                }if (this.receiveraddressline_6 ==null || this.receiveraddressline_6 ==""){
                  this.receiveraddressline_6 =trackingAC[listcount].receiverCountry;
                }
              }
              else if (trackingAC[listcount].chargeClassificationCode=="FRT" && (trackingAC[listcount].chargeCategoryDetailCode =="CLB" || trackingAC[listcount].chargeCategoryDetailCode=="DIN") ){
               
                if (this.pack_id1 == null||this.pack_id1 == ""||this.pack_id1 == "NA"){
                  this.pack_id1=this.formatText(trackingAC[listcount].packageReferenceNumber1);
                  this.pack_id=this.formatText(trackingAC[listcount].packageReferenceNumber1);
                }
                if (this.pack_id2 == null||this.pack_id2 == ""||this.pack_id2 == "NA"){
                  this.pack_id2=this.formatText(trackingAC[listcount].packageReferenceNumber2);
                }
                if (this.pack_id13 == null||this.pack_id13 == ""||this.pack_id13 == "NA"){
                  this.pack_id13=this.formatText(trackingAC[listcount].packageReferenceNumber3);
                }
                if(this.ref1 == null||this.ref1 == ""||this.ref1 == "NA")
                {
                  this.ref1 =this.formatText(trackingAC[listcount-1].shipmentReferenceNumber1);
                }
                if(this.ref2 == null||this.ref2 == ""||this.ref2 == "NA")
                {
                  this.ref2 =this.formatText(trackingAC[listcount-1].shipmentReferenceNumber2);
                }
                if(this.pa_zone_id == null||this.pa_zone_id == ""||this.pa_zone_id == "NA")
                {
                  this.pa_zone_id =this.formatText(trackingAC[listcount].zone);
                }

                if (this.addressline_1==null||this.addressline_1 == ""){
                  this.addressline_1=trackingAC[listcount].senderName;
                }
                if (this.addressline_2==null||this.addressline_2 == ""){
                  this.addressline_2=trackingAC[listcount].senderCompanyName;
                }
                if (this.addressline_3==null||this.addressline_3==""){
                  this.addressline_3=trackingAC[listcount].senderAddressLine1;
                }
                if (this.addressline_4==null||this.addressline_4==""){
                  this.addressline_4=trackingAC[listcount].senderAddressLine2;
                }

                if (this.addressline_5==null||this.addressline_5=="" ||this.addressline_5==" " ){
                  
                  this.addressline_5 =trackingAC[listcount].senderCity+" "+trackingAC[listcount].senderState+" "+trackingAC[listcount].senderPostal;
                 
                }
                 if (this.addressline_6==null ||this.addressline_6=="" ||this.addressline_6==" " ){
                  this.addressline_6=trackingAC[listcount].senderCountry;
                }
                if (this.receiveraddressline_1==null|| this.receiveraddressline_1 ==""){
                  this.receiveraddressline_1=trackingAC[listcount].receiverName;
                }if (this.receiveraddressline_2==null|| this.receiveraddressline_2 ==""){
                  this.receiveraddressline_2=trackingAC[listcount].receiverCompanyName;
                }if (this.receiveraddressline_3==null || this.receiveraddressline_3 ==""){
                  this.receiveraddressline_3 = trackingAC[listcount].receiverAddressLine1;
                }if (this.receiveraddressline_4==null || this.receiveraddressline_4 ==""){
                  this.receiveraddressline_4 = trackingAC[listcount].receiverAddressLine2;
                }if (this.receiveraddressline_5==null || this.receiveraddressline_5 ==""){
                  this.receiveraddressline_5 = trackingAC[listcount].receiverCity+"  "+ trackingAC[listcount].receiverState+"  "+trackingAC[listcount].receiverPostal;
                }if (this.receiveraddressline_6 ==null || this.receiveraddressline_6 ==""){
                  this.receiveraddressline_6 =trackingAC[listcount].receiverCountry;
                }

              }
              this.ref3=this.formatText("NA");
              tempObj= [];
              if (trackingAC[listcount].chargeClassificationCode=="FRT" && (trackingAC[listcount].chargeCategoryCode !="ADJ" || trackingAC[listcount].chargeCategoryDetailCode =="CLB" || trackingAC[listcount].chargeCategoryDetailCode=="DIN") ){
                if ((trackingAC[listcount].chargeCategoryDetailCode =="CADJ" || trackingAC[listcount].chargeCategoryDetailCode=="VOID" ||trackingAC[listcount].chargeCategoryDetailCode=="GSR")){
                  this.refund+=Number(trackingAC[listcount].netAmount);
                  var txt_default;
                  var txt_amount;
                  txt_default = trackingAC[listcount].chargeCategoryDetailCode;
                  txt_amount = this.formatText(trackingAC[listcount].netAmount);
              
                  this.refund_LinkBar=[];
                  this.refund_LinkBar["txt_default"]=txt_default;
                  this.refund_LinkBar["txt_amount"]=txt_amount;
                  this.refund_LinkBar11.push(this.refund_LinkBar);                   
                } else{                      
                  if(trackingAC[listcount].chargeCategoryCode =="RTN" ) {
                    var shpflagcheck ="N";
                    
                    for(var innerlistcount = 0; innerlistcount < trackingAC.length; innerlistcount++){
                      if (trackingnumber== trackingAC[innerlistcount].trackingNumber && trackingAC[innerlistcount].chargeCategoryCode =="SHP" ){
                        shpflagcheck="Y";
                        break;
                      }
                    }
                    if (shpflagcheck=="Y"){
                      tempaccObj= [];
                      tempaccObj["chargeDescription"]=this.formatText(trackingAC[listcount].chargeDescription);
                      tempaccObj["netAmount"]=trackingAC[listcount].netAmount;
                      acctotal+=Number(trackingAC[listcount].netAmount);
                      this.accessorialsAC.push(tempaccObj);
                      returncount++;
                    } else{  
                      if (this.service_id ==null||this.service_id ==""||this.service_id =="NA"){
                        this.service_id = this.formatText(trackingAC[listcount].chargeDescription);
                        this.pa_service_id=this.formatText(trackingAC[listcount].chargeDescription);
                      }                          
                      amount+=Number(trackingAC[listcount].netAmount);
                      disamount+=Number(trackingAC[listcount].incentiveAmount);
                    }                        
                  }
                  else{  
                    if (this.service_id ==null||this.service_id ==""||this.service_id =="NA"){
                      this.service_id = this.formatText(trackingAC[listcount].chargeDescription);
                      this.pa_service_id=this.formatText(trackingAC[listcount].chargeDescription);                          
                    }                        
                    amount+=Number(trackingAC[listcount].netAmount);
                    disamount+=Number(trackingAC[listcount].incentiveAmount);
                  }                      
                }
              }
              else if (trackingAC[listcount].chargeCategoryDetailCode =="CADJ" || trackingAC[listcount].chargeCategoryDetailCode=="VOID" ||trackingAC[listcount].chargeCategoryDetailCode=="GSR"){
                this.refund+=Number(trackingAC[listcount].netAmount);
                var txt_default;
                var txt_amount;
                txt_default =trackingAC[listcount].chargeCategoryDetailCode;
                txt_amount = this.formatText(trackingAC[listcount].netAmount);
                this.refund_LinkBar=[];
                this.refund_LinkBar["txt_default"]=txt_default;
                this.refund_LinkBar["txt_amount"]=txt_amount;
                this.refund_LinkBar11.push(this.refund_LinkBar);              
              } else {                  
                tempaccObj=[];
                tempaccObj["chargeDescription"]=this.formatText(trackingAC[listcount].chargeDescription);
                tempaccObj["netAmount"]=trackingAC[listcount].netAmount;
                acctotal+=Number(trackingAC[listcount].netAmount);
                this.accessorialsAC.push(tempaccObj);
                returncount++
              }
              if (trackingAC[listcount].chargeCategoryCode=="SHP" && trackingAC[listcount].chargeClassificationCode=="FRT"){
                  
                if (this.bi_invoidat_id==null||this.bi_invoidat_id ==""||this.bi_invoidat_id =="NA"){
                  this.bi_invoidat_id =this.formatText(trackingAC[listcount].invoiceDate);
                  
                }
                if (this.ad_tran_id ==null||this.ad_tran_id ==""||this.ad_tran_id =="NA"){
                this.ad_tran_id = this.formatText(trackingAC[listcount].transactionDate);
                }
                }
                else if(trackingAC[listcount].chargeCategoryCode=="RTN"  && trackingAC[listcount].chargeClassificationCode=="FRT"){
                  if (this.bi_invoidat_id ==null||this.bi_invoidat_id ==""||this.bi_invoidat_id =="NA"){
                    this.bi_invoidat_id =this.formatText(trackingAC[listcount].invoiceDate);
                  }
                  if (this.ad_tran_id ==null||this.ad_tran_id ==""||this.ad_tran_id =="NA"){
                  this.ad_tran_id =this.formatText(trackingAC[listcount].transactionDate);
                  }
                }
                else if(trackingAC[listcount].chargeCategoryCode=="ADJ" && trackingAC[listcount].chargeClassificationCode=="FRT"){
                  if (this.bi_invoidat_id ==null||this.bi_invoidat_id ==""||this.bi_invoidat_id =="NA"){
                    this.bi_invoidat_id =this.formatText(trackingAC[listcount].invoiceDate);
                  }
                  if (this.ad_tran_id ==null||this.ad_tran_id.text==""||this.ad_tran_id =="NA"){
                    this.ad_tran_id =this.formatText(trackingAC[listcount].transactionDate);
                  }
                }
                
                if (( trackingAC[listcount].chargeCategoryCode=="RTN" || trackingAC[listcount].chargeCategoryCode=="ADJ" || trackingAC[listcount].chargeCategoryCode=="SHP" )&& trackingAC[listcount].chargeClassificationCode=="FRT"){
                  this.account_id =this.formatText(trackingAC[listcount].accountNumber);
                  
                  this.paaccount_id=this.formatText(trackingAC[listcount].accountNumber);
                    
                  if (trackingAC[listcount].chargeCategoryDetailCode=="SCC") {                    
                    var sccvalue =this.formatText(trackingAC[listcount].billedWeight);
                    if (sccvalue!=null&&sccvalue!=""&&sccvalue!="NA"&&sccvalue!="0.0"){
                      this.pa_billedweight_id =this.formatText(trackingAC[listcount].billedWeight);
                    }
                  }
                  if(this.pa_billedweight_id==null|| this.pa_billedweight_id=="" || this.pa_billedweight_id=="NA"){
                    this.pa_billedweight_id = this.formatText(trackingAC[listcount].billedWeight);
                  }
                  
                  if (this.pa_acutal_id ==null || this.pa_acutal_id == ""|| this.pa_acutal_id =="NA"){
                    this.pa_acutal_id =this.formatText(trackingAC[listcount].enteredWeight);
                  }                    
                    
                }
                  
                if (this.pa_ent_dim_id == null || this.pa_ent_dim_id ==""|| this.pa_ent_dim_id =="NA"){
                  this.pa_ent_dim_id = this.formatText(trackingAC[listcount].billeddimension);
                }
                if (this.pa_dim_id ==null||this.pa_dim_id ==""||this.pa_dim_id =="NA"){
                  this.pa_dim_id = this.formatText(trackingAC[listcount].packageDimensions);
                }
                
                if (trackingAC[listcount].chargeCategoryDetailCode  =="SCC" || trackingAC[listcount].chargeCategoryDetailCode=="WWS" ){
                  
                  if (this.pa_ent_dim_id ==null|| this.pa_ent_dim_id ==""||this.pa_ent_dim_id =="NA"){
                    this.pa_ent_dim_id = this.formatText(trackingAC[listcount].billeddimension);
                  }
                  if (this.pa_dim_id == null || this.pa_dim_id == ""||this.pa_dim_id =="NA"){
                    this.pa_dim_id = this.formatText(trackingAC[listcount].packageDimensions);
                  }
                }
              }
            } //second for iteration
            tempObj= [];
           
            this.invoice_id = this.formatText(trackingAC[listcount-1].invoiceNumber);
            this.tracking_id =this.formatText(trackingAC[listcount-1].trackingNumber);
            this.bi_invo_id = this.formatText(trackingAC[listcount-1].invoiceNumber);
            
            grosstotal= amount + disamount;
            this.total= amount + acctotal;
            this.pa_pack_id = this.formatText(packagecount.toString());
            this.netdue_id = this.formatText(grosstotal.toString());

            var txt_default;
            var txt_amount;
          
            txt_amount = this.formatText(this.refund.toFixed(2));
            
            this.refund_LinkBar11total= txt_amount; 
            
            
            this.netdue_id = this.formatText((this.total+this.refund).toFixed(2));
            tempObj["trackingNumber"]=trackingnumber;
            tempObj["containerType"] ="UPS";
            tempObj["invoiceNumber"]=this.formatText(trackingAC[listcount-1].invoiceNumber);
            tempObj["invoiceDate"]=this.formatText(this.bi_invoidat_id);
            tempObj["packageQuantity"]= this.formatText(packagecount.toString());
            
            tempObj["netAmount"]= this.formatText(this.total.toFixed(2));
            tempObj["gstamount"]=this.formatText(this.refund.toFixed(2));
            tempObj["total"]=this.formatText((this.total+this.refund).toFixed(2));
            this.commonAC.push(tempObj);            
            
          }//first for iteration
          this.chargeinfocommonAC.push(tempchargeinfoObj);
          if (returncount <= 1){
            var returncountplus =0;
            returncountplus=2-returncount;
            count=returncount+returncountplus;
            chargeinfodatagrid_idRowCount = count+1;
          }
          else{
            count=this.accessorialsAC.length;
            chargeinfodatagrid_idRowCount=this.accessorialsAC.length+1;
          }
          
          trackingnumber=resultracking[listcount];

          for(var listcount= 0; listcount < count; listcount++){
            tempchargeinfoObj= [];
            if (shpflag==0){
              tempchargeinfoObj["gstamount"]="GROSS FRT CHARGE :"
              tempchargeinfoObj["netAmount"]=this.formatText((amount+disamount).toFixed(2));
              this.grossFrtCharge=tempchargeinfoObj["netAmount"];
            }else if (shpflag==1){
              tempchargeinfoObj["gstamount"]="FRT INCENTIVE :"
              tempchargeinfoObj["netAmount"]= this.formatText((disamount).toFixed(2));
              this.frtIncentive=tempchargeinfoObj["netAmount"];
              tempchargeinfoObj["gstrate"]=this.formatText((amount+acctotal).toFixed(2));
            }else if (shpflag==2){
              chargeinfodatagrid_idFooterRowCount =0;
              chargefieldFooterHeaderText = " NET FRT CHARGE :";
              accessfiledFooter1HeaderText= this.formatText((amount).toFixed(2));          
            }
            else{
              tempchargeinfoObj["gstamount"]="";
              tempchargeinfoObj["netAmount"]="";
            }
            
            if (listcount< this.accessorialsAC.length){
              tempchargeinfoObj["chargeDescription"]=this.accessorialsAC[listcount].chargeDescription;
              tempchargeinfoObj["invoiceAmount"]=this.formatText(this.accessorialsAC[listcount].netAmount);
            }else{
              if (returncount1 == 0){
                accessfiledFooter2HeaderText="Total Accessorials";
                accessfiledFooterHeaderText=this.formatText((acctotal).toFixed(20));        
                returncount1=1
              }              
            }              
            shpflag++
            this.chargeinfocommonAC.push(tempchargeinfoObj);
          }
          tempchargeinfoObj= [];
          tempchargeinfoObj["gstamount"]="NET FRT CHARGE :";
          tempchargeinfoObj["netAmount"]=this.formatText((amount).toFixed(2)); 
          this.netFrtCharge=tempchargeinfoObj["netAmount"];
          tempchargeinfoObj["chargeDescription"]="Total Accessorials";
          tempchargeinfoObj["invoiceAmount"]=this.formatText((acctotal).toFixed(2)); 
          this.totalAccessorialsAmnt=tempchargeinfoObj["invoiceAmount"];
          this.chargeinfocommonACfooter.push(tempchargeinfoObj);
          chargeinfodatagrid_idFooterRowCount=this.chargeinfocommonACfooter.length;
        }      
    }
  }
  closeDialog(){ 
    this.dialogRef.close({event:'close',data:this.fromDialog}); 
  }
  generatetrackingexcel()  {  
    var trackingParam=this.fromPage;  

    var t007_reportlogobj:any={};  
    var modulename ="TrackingNumberreport";  
    var reportfromat="CSV";  
    t007_reportlogobj['fromDate']=trackingParam.fromdate;  
    t007_reportlogobj['toDate']=trackingParam.todate;  
    t007_reportlogobj['t001ClientProfile']=trackingParam.t001ClientProfile;  
    t007_reportlogobj['reportType']="UPS_Tracking_Number_Report";  
    t007_reportlogobj['reportName']="Tracking Number Report";
    t007_reportlogobj['designFileName']="TrackingNumber_Excel";  
    t007_reportlogobj['status']='IN QUEUE';  
    t007_reportlogobj['reportFormat']="CSV"  
    t007_reportlogobj['moduleName']=modulename;  
    t007_reportlogobj['chargeDes']=trackingParam.trackingNumber;  
    t007_reportlogobj['clientId']=trackingParam.clientId;  
    t007_reportlogobj['clientname']=trackingParam.clientname;  
    t007_reportlogobj['crmaccountNumber']=trackingParam.crmaccountNumber;  
    t007_reportlogobj['login_id']=this.loginId;  
    t007_reportlogobj['fzone']=0;  
    t007_reportlogobj['tzone']=0; 
    this.httpClientService.runReport(t007_reportlogobj).subscribe(  
    result=>{  
      this.saveOrUpdateReportLogResult(result);  
    },error=>{  
      console.log(error);  
    });  
  }  
  saveOrUpdateReportLogResult(result:any)  {  
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);  
    this.commonService._setInterval(this.reportsFormGroup.value);  
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")  
  }  
  
  openModal(alertVal:any) {  
    const dialogConfig = this.dialog.open(AlertPopupComponent, {  
      width: '470px',  
      height:'250px',       
      data: {pageValue: alertVal},
      panelClass:this.panelClass 
    });  
    dialogConfig.afterClosed().subscribe(result => {  
      this.dialogValue = result.data;  
    });  
  }
  generatetrackingpdf(){
    var reportfromat="PDF"
    var  Master_reportlogobj:any={};
    Master_reportlogobj["fromdate"]=this.fromPage.fromdate;
    Master_reportlogobj["todate"]=this.fromPage.todate;
    Master_reportlogobj["chargeSource"]="Tracking Number";
    Master_reportlogobj["trackingNumber"]=this.fromPage.trackingNumber;
    Master_reportlogobj["clientId"]=this.fromPage.clientId;
    Master_reportlogobj["clientname"]=this.fromPage.clientname.replace(/[^a-zA-Z0-9 ]/g,"");

    Master_reportlogobj["typeCode1"]="UPS_Tracking_Number_Report";
    Master_reportlogobj["basisValue"]=this.typeinfo;
    this.fetch_TrackingReport(Master_reportlogobj);
    this.openModal("Your Report is ready and will be downloaded automatically. You can also download the file from the Report Page.");
  }

  fetch_TrackingReport(param:any) {
    this.httpClientService.fetch_TrackingReport(param).subscribe(
    (result:any) => {
      var resultObj = result;
      var urlParam:any={};
      var urlObj:any={};
      var date = new Date();
      var dateValue=this.datePipe.transform(date,"yyyy-MM-dd");
      urlParam['pdfpath']= resultObj;
      urlParam['action']='Trackingnumberreport'; 
      var fields_string:any="";
      for (const [key, value] of Object.entries(urlParam)){
        fields_string += key+'='+value+'&';
      }
      this.httpClientService.reportServlet(fields_string);  
    },
    error => {
      console.log('error ', error);
    })
  }
}