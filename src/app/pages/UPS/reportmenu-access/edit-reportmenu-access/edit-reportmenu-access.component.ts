import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-ups-edit-reportmenu-access',
  templateUrl: './edit-reportmenu-access.component.html',
  styleUrls: ['./edit-reportmenu-access.component.scss'],
   standalone: false
})
export class EditReportmenuAccessComponent implements OnInit {
  // @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  clientType: any;
  randomNumber: any;

  resultactiveusersAC: any[] = [];
  datagrid_id: any[] = [];
  dataSource: any = [];
  displayedColumns: string[] = [];
  columns: any[] = [];
  carrierName: any;
  ClientName: string = '';
  ClientId: any;
  reportList: any[] = [];
  reportIdList: string = '';
  ReportdataList: any[] = [];
  panelClass: any;
  dataGridReportList: any[] = [];
  clientProfileData: any[] = [];
  t001custObj: any;
  filteredOptions?: Observable<string[]>;
  themeoption: any;

  webUserDetailsformgroup=new UntypedFormGroup({
    clientNameSelected:new FormControl('')
  });
  webUserDetailsFedexformgroup=new UntypedFormGroup({
    clientNameSelected:new FormControl('')
  });
  
  setUpUPSFormGroup=new UntypedFormGroup({
    contractReview:new FormControl(false),
    contractSavingsPopup:new FormControl(false), 
    clientName:new FormControl(''), 
    contractSummary:new FormControl(false),
    griAnalysis:new FormControl(false),       
  })
  constructor(private authentocationService: AuthenticationService,private httpfedexService:HttpfedexService,
    public dialogRef: MatDialogRef<EditReportmenuAccessComponent>, private httpClientService:HttpClientService, private router: Router, private cookiesService:CookiesService,
    private commonService:CommonService, private dialog: MatDialog, private datePipe: DatePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ) {  

    this.dataSource  = [];
    this.dataGridReportList=[];
    this.ClientName = data.clientName;
    this.ClientId=data.clientId;
         
    var t001ClientObj={};  

    this.httpClientService.loadClientProfile(t001ClientObj).subscribe(
    (result:any)=>{
      this.clientProfileData =result.filter((data:any) => data.clientId == this.ClientId);   
      this.loadformgroup();         
    }, (error:any)=>{
      console.log('error',error);
    }) 
  }

  loadformgroup(){
    if(this.clientProfileData[0].contractanalysisstatus.toUpperCase()=='YES'){
      this.setUpUPSFormGroup.get("contractSavingsPopup")?.setValue(true);
    }else{
      this.setUpUPSFormGroup.get("contractSavingsPopup")?.setValue(false);
    }
    this.setUpUPSFormGroup.get("contractReview")?.setValue(this.clientProfileData[0].contractreviewstatus);
    this.setUpUPSFormGroup.get("contractSummary")?.setValue(this.clientProfileData[0].contractSummary);
    this.setUpUPSFormGroup.get("clientName")?.setValue(this.ClientName);
    this.setUpUPSFormGroup.get("griAnalysis")?.setValue(this.clientProfileData[0].griAnalysis);
  }

  async getThemeOption(){
    this.themeoption= await this.cookiesService.getCookie('themeOption').then( res=>{ return res;  });
  }

  async loadClientReportData() {
    var t001ClientObj={clientId : this.ClientId};
    this.httpClientService.fetchReportMenuAccessDetails(t001ClientObj).subscribe(
    (result:any)=>{
      this.reportList=result;
      this.reportIdList = result[0].reportIds;
    },error=>{   });   
  }

  async ngOnInit() {

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.getThemeOption();
    await this.loadClientReportData(); 
    await this.loadMenuaccessdetails();
  }
  clientDetailsList : any; 
    
  toggleCompareAnalysisPopup(param:any){
    this.commonService.emitContractParam(param);
  }
  loadMenuaccessdetails(){
    var t001ClientReportObj={};
    this.httpClientService.fetchReportDescription(t001ClientReportObj).subscribe(
    (result:any)=>{
      this.ReportdataList = result.filter((data:any)=>data.reportType=="Custom Reports");    
      this.checkreportStatus();
    },error=>{  });

    this.displayedColumns = ['reportName','reportAvailable'];
    this.columns = [
      { field: 'Report Name', fieldVal: 'reportName' }, 
      { field: 'Report Status', fieldVal: 'reportAvailable' },  
    ]    
  }

  checkreportStatus(){  
    const newColumnName = 'reportAvailable';
    var isavailable;
    if (this.reportList.length >0 ) {
      let valuesList: string[] = this.reportIdList.split(',');   
      this.ReportdataList.forEach((item: any, index: any) => {     
        var reportId =this.ReportdataList[index].reportId;
        var avail = valuesList.filter(data=>data==reportId);    
        if (avail.length>0)  {
          isavailable= true;           
        } else {
          isavailable= false;       
        }
        item[newColumnName] = isavailable;    
      }); 
    } else{
      this.ReportdataList.forEach((item:any, index:any) => {
        item[newColumnName] =false;
      });
    }
  
    this.dataSource= new MatTableDataSource(this.ReportdataList); 
    this.dataGridReportList= this.ReportdataList;
  } 

  btn_upt_clickHandler(){ 
    var ReportIdListUpdated : any =[];
    var newReportIdList = this.ReportdataList.filter((data:any)=>data.reportAvailable==true);

    newReportIdList.forEach((data:any, index:any) => {        
      ReportIdListUpdated.push(data.reportId)
    }); 
    var newReportIdListString = ReportIdListUpdated.join(',');
  
    if (this.reportList.length>0){
      this.reportList[0].reportIds=newReportIdListString;
    } else{
      const newItem: any = {
        clientId: this.ClientId,
        clientName: this.ClientName,
        reportIds: newReportIdListString
      };
      this.reportList.push(newItem);
    }

    var newListSaveOrUpdate:any={}; 
        
    newListSaveOrUpdate["clientId"]=this.ClientId;
    newListSaveOrUpdate["clientName"]=this.ClientName;
    newListSaveOrUpdate["menuAccessDetailsList"]= this.reportList;
    this.httpClientService.saveOrUpdateReportAccessDetails(newListSaveOrUpdate).subscribe(
    (result:any)=>{    
      this.openModal("Customer Updated Successfully");
    },(error:any)=>{
      console.log(error);
      this.openModal("Error in Updating Customer")  
    });
  }

  clientNameList : any =[];
  getClientNameList(param:any){
    for(let loop =0; loop < param.length; loop++){
      this.clientNameList.push(param[loop]["clientName"]);
    }
  }

  openModal(alertVal:any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height:'250px',     
      data: {pageValue: alertVal},
      panelClass:this.panelClass
    }); 

    dialogConfig.afterClosed().subscribe((res:any) => {   
      this.dialogRef.close();
    })
  }	

  updateMenuAccess(){
    var clientMenuAccessReviewObj:any = {};
    clientMenuAccessReviewObj["clientId"] = this.ClientId;
    var contractReviewStatus = this.setUpUPSFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      clientMenuAccessReviewObj["contractreviewstatus"] = true;      
    } else {
      clientMenuAccessReviewObj["contractreviewstatus"] = false;      
    }
    clientMenuAccessReviewObj["contractreviewstatusflag"] = "Yes";

    var contractSavingsStatus = this.setUpUPSFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingsStatus == true) {
      clientMenuAccessReviewObj["contractanalysisstatus"] = "Yes";
        
    } else {
      clientMenuAccessReviewObj["contractanalysisstatus"] = "No";      
    }
    clientMenuAccessReviewObj["contractsavingspopupflag"] = "Yes";

    var contractSummaryWebPortalStatus = this.setUpUPSFormGroup.get("contractSummary")?.value;
    if (contractSummaryWebPortalStatus == true) {
      clientMenuAccessReviewObj["contractSummary"] = true;      
    }else {
      clientMenuAccessReviewObj["contractSummary"] = false;        
    }
    clientMenuAccessReviewObj["contractSummaryflag"] = "Yes";
      
    var griAnalysisWebPortalStatus = this.setUpUPSFormGroup.get("griAnalysis")?.value;
    if (griAnalysisWebPortalStatus == true) {
      clientMenuAccessReviewObj["griAnalysis"] = true;      
    } else {
      clientMenuAccessReviewObj["griAnalysis"] = false;        
    }
    clientMenuAccessReviewObj["griAnalysisflag"] = "Yes";

    this.httpClientService.saveOrUpdateClient(clientMenuAccessReviewObj).subscribe(
    (result:any) => {
      this.openModal("Customer Updated Successfully");
    },
    error => {  console.log(' error ', error); })
  }

 /*Contract Review Popup Enable/Disable*/
  updateContractReviewStatus() {
    var contractReviewObj :any= {};
    contractReviewObj["clientId"] = this.ClientId;
    var contractReviewStatus = this.setUpUPSFormGroup.get("contractReview")?.value;
    if (contractReviewStatus == true) {
      contractReviewObj["contractreviewstatus"] = true;      
    } else {
      contractReviewObj["contractreviewstatus"] = false;      
    }
    contractReviewObj["contractreviewstatusflag"] = "Yes";
    this.httpClientService.saveOrUpdateClient(contractReviewObj).subscribe(
    (result:any) => { },
    (error:any) => {  console.log(' error ', error); })
  }

  /*Contract Analysis Savings Popup Enable/Disable*/
  updateContractSavingsPopup() {
    var contractSavingsPopupObj:any = {};
    contractSavingsPopupObj["clientId"] = this.ClientId;
    var contractSavingsStatus = this.setUpUPSFormGroup.get("contractSavingsPopup")?.value;
    if (contractSavingsStatus == true) {
      contractSavingsPopupObj["contractanalysisstatus"] = "Yes";
    } else {
      contractSavingsPopupObj["contractanalysisstatus"] = "No";      
    }
    contractSavingsPopupObj["contractsavingspopupflag"] = "Yes";
    this.httpClientService.saveOrUpdateClient(contractSavingsPopupObj).subscribe(
    (result:any) => {     },
    (error:any) => { console.log(' error ', error);  })
  }

  /*Contract Summary  Enable/Disable*/
  updateContractSummary() {
    var contractSummaryWebPortalObj:any = {};
    contractSummaryWebPortalObj["clientId"] = this.ClientId;
    var contractSummaryWebPortalStatus = this.setUpUPSFormGroup.get("contractSummary")?.value;
    if (contractSummaryWebPortalStatus == true) {
      contractSummaryWebPortalObj["contractSummary"] = true;      
    } else {
      contractSummaryWebPortalObj["contractSummary"] = false;       
    }

    contractSummaryWebPortalObj["contractSummaryflag"] = "Yes";
    this.httpClientService.saveOrUpdateClient(contractSummaryWebPortalObj).subscribe(
    (result:any) => { },
    (error:any) => {  console.log(' error ', error);  })
  }

  updateGRIAnalysis() {
    var GRIAnalysisWebPortalObj:any = {};
    GRIAnalysisWebPortalObj["clientId"] = this.ClientId;
    var GRIAnalysisWebPortalStatus = this.setUpUPSFormGroup.get("griAnalysis")?.value;
    if (GRIAnalysisWebPortalStatus == true) {
      GRIAnalysisWebPortalObj["griAnalysis"] = true;      
    } else {
      GRIAnalysisWebPortalObj["griAnalysis"] = false;       
    }
    GRIAnalysisWebPortalObj["griAnalysisflag"] = "Yes";
    this.httpClientService.saveOrUpdateClient(GRIAnalysisWebPortalObj).subscribe(
    (result:any) => {  },
    (error:any) => {
      console.log('error', error);
    })
  }

  close() {
    this.dialogRef.close();
  }     
}
