import { AfterViewInit,  ElementRef, Component, OnInit, Signal, signal, TemplateRef, ViewChild } from '@angular/core';
import { LoaderService } from 'src/app/core/services/loader.service';
import { CookiesService } from 'src/app/core/services/cookie.service'; 
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

@Component({
  selector: 'app-detailsreport-edit',
  templateUrl: './detailsreport-edit.component.html',
  styleUrls: ['./detailsreport-edit.component.scss'],
  standalone: false
})
export class UpsDetailsReportEditComponent  implements OnInit , AfterViewInit{
  clientType = signal<any>('');

  sortDir = 1;
  reportDescriptionResultAC:any=[];
  t001clientAC:any=[];
  datagrid_id:any=[];
  randomNumber: any;
  carrierName: any;
  themeoption: any;
  panelClass: any;

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  constructor(private cookiesService: CookiesService,private loaderService: LoaderService,
    private httpClientService: HttpClientService, private dialog: MatDialog,
    private httpFedexService: HttpfedexService,private httpOntracService: HttpOntracService, private router: Router,
  ) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);
      this.cookiesService.checkForClientName();
      if (this.clientType().toUpperCase() == "DHL" || this.clientType().toUpperCase() == "USPS") {
        this.router.navigate(['/'+this.clientType().toLowerCase()+'/dashboard']);
      }
    });
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

  ngOnInit(): void {
    this.loaderService.show();
    this.demoloader()
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.getThemeOption();
    this.initModuleHandler();
  }
 
  async getThemeOption(){
    this.themeoption= await this.cookiesService.getCookie('themeOption').then( res=>{ return res;  });
  }

  async initModuleHandler(){
    this.carrierName= await this.cookiesService.getCookie('chooseCarrier').then( res=>{ return res;  });
    if(this.carrierName.toUpperCase()=="UPS")
      this.module1_creationCompleteHandler();
    else if(this.carrierName.toUpperCase()=="ONTRAC")
      this.module1_creationCompleteHandlerOntrac();
    else if(this.carrierName.toUpperCase()=="FEDEX")
      this.module1_creationCompleteHandlerFedex();
  }
  
  burri_clickHandler(rowObj: any,index: any){ 	
  	var saveOrUpdateGridClientmenuObj:any={};
  	saveOrUpdateGridClientmenuObj=rowObj;
  	this.httpClientService.updateReportDescription(saveOrUpdateGridClientmenuObj).subscribe(
    (result:any)=>{		
      this.module1_creationCompleteHandler();
      this.openModal("Report Description Updated Successfully" );
    },(error:any)=>{
          console.log(error);
    });  	
  }

  burri_clickHandlerOntrac(rowObj: any,index: any){
    var saveOrUpdateGridClientmenuObj:any={};
    saveOrUpdateGridClientmenuObj=rowObj;
    this.httpOntracService.updateReportDescription(saveOrUpdateGridClientmenuObj).subscribe(
    (result:any)=>{    
      this.module1_creationCompleteHandlerOntrac();
      this.openModal("Report Description Updated Successfully" );
    },(error:any)=>{ console.log(error); });    
  }

  burri_clickHandlerFedex(rowObj: any,index: any){ 
    var saveOrUpdateGridClientmenuObj:any={};
    saveOrUpdateGridClientmenuObj=rowObj;    
    this.httpFedexService.updateReportDescription(saveOrUpdateGridClientmenuObj).subscribe(
    (result:any)=>{    
      this.module1_creationCompleteHandlerFedex();
      this.openModal("Report Description Updated Successfully" );
    },(error:any)=>{  console.log(error);  });    
  }
  
  openModal(alertVal: string) {
    if(this.themeoption=="dark"){
      this.panelClass='page-dark';
    } else{
      this.panelClass='custom-dialog-panel-class';
    }
  
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height:'auto',     
      data: {pageValue: alertVal},
      panelClass:this.panelClass
    });
 }

  module1_creationCompleteHandler()	{
		var t001ClientObj={};
		this.httpClientService.fetchReportDescription(t001ClientObj).subscribe(
    (result:any)=>{
      this.ReportDescriptionResult(result);      
    },(error:any)=>{ console.log(error);   });
	}

  module1_creationCompleteHandlerFedex(){
    var t001ClientObj={};
    this.httpFedexService.fetchReportDescription(t001ClientObj).subscribe(
    (result:any)=>{
      this.ReportDescriptionResult(result);        
    },(error:any)=>{
      console.log(error);
    });
  }

  module1_creationCompleteHandlerOntrac() {
    var t001ClientObj={};
    this.httpOntracService.fetchReportDescription(t001ClientObj).subscribe(
    (result:any)=>{
      this.ReportDescriptionResult(result);        
    },(error:any)=>{
      console.log(error);
    });
  }

	ReportDescriptionResult(result:any)	{
    this.t001clientAC=result;
    this.reportDescriptionResultAC=this.t001clientAC;		
    this.datagrid_id=this.reportDescriptionResultAC;
    this.sortArr('reportName');
  }

  sortArr(colName:any){
    this.reportDescriptionResultAC.sort((a:any,b:any)=>{
      a= a[colName].toLowerCase();
      b= b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
}

