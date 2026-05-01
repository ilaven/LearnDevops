import { AfterViewInit, ElementRef, Component, OnInit, ViewChild, signal, ChangeDetectorRef } from '@angular/core';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { EditReportmenuAccessComponent } from './edit-reportmenu-access/edit-reportmenu-access.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-ups-reportmenu-access',
  templateUrl: './reportmenu-access.component.html',
  styleUrls: ['./reportmenu-access.component.scss'],
  standalone: false
})
export class UpsReportmenuAccessComponent implements OnInit, AfterViewInit {
  clientType = signal<any>('');
  randomNumber: any;

  webUserDetailsformgroup = new UntypedFormGroup({
    clientNameSelected: new FormControl('')
  });

  webUserDetailsFedexformgroup = new UntypedFormGroup({
    clientNameSelected: new FormControl('')
  });

  resultactiveusersAC: any[] = [];
  datagrid_id: any[] = [];
  dataSource: any[] = [];
  displayedColumns: any[] = [];
  columns: any[] = [];
  carrierName: any;
  activeclientList: any[] = [];
  dataGridClientList: any[] = [];
  clientDetailsList: any[] = [];
  clientNameList: string[] = [];
  filteredOptions!: Observable<string[]>;
  themeoption: any;

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  constructor(
    private cookiesService: CookiesService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private httpClientService: HttpClientService,
    private router: Router,
    private commonService: CommonService,
    private _cd:ChangeDetectorRef,
  ) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);

      if (this.clientType() === 'FedEx' || this.clientType() === 'OnTrac' || this.clientType() === 'Dhl' || this.clientType() === 'USPS' ) {
        this.router.navigate(['/'+this.clientType().toLowerCase()+'/dashboard']);
      }
    });

    this.cookiesService.checkForClientName();
  }

  ngOnInit(): void {
    this.loaderService.show();    

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.getThemeOption();

    this.carrierName = this.clientType();

    if (this.clientType() === 'UPS') {
      this.displayedColumns = ['clientName', 'crmAccountNumber','status','auditstatus', 'contractstatus','edit'];

      this.columns = [
        { field: 'Client Name', fieldVal: 'clientName' },
        { field: 'LJM Account Number', fieldVal: 'crmAccountNumber' },
        { field: 'Status', fieldVal: 'status' },
        { field: 'Audit Status', fieldVal: 'auditstatus' },
        { field: 'Contract Status', fieldVal: 'contractstatus' },
        { field: 'Edit', fieldVal: 'edit' }
      ];

      this.loadClientProfile();
      this.initializeSearch();
    } else {
      this.initializeSearch();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.tableScroll?.nativeElement && this.topScroll?.nativeElement?.firstElementChild) {
        const tableWidth = this.tableScroll.nativeElement.scrollWidth;
        this.topScroll.nativeElement.firstElementChild.setAttribute(
          'style',
          `width:${tableWidth}px`
        );
      }
    });
  }

  syncScroll(event: Event, source: 'top' | 'table'): void {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;

    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  openEditAccountPopup(): void {
    const dialogRef = this.dialog.open(EditReportmenuAccessComponent, {
      width: '900px',
      maxWidth: '95vw',
      height:'auto'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Updated account number:', result);
      }
    });
  }

  demoloader(): void {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  async getThemeOption(): Promise<void> {
    this.themeoption = await this.cookiesService.getCookie('themeOption').then((res) => {
      return res;
    });
  }

  initializeSearch(): void {
    const control =
      this.clientType() === 'UPS'
        ? this.webUserDetailsformgroup.get('clientNameSelected')
        : this.webUserDetailsFedexformgroup.get('clientNameSelected');

    if (!control) return;

    this.filteredOptions = control.valueChanges.pipe(
      startWith(''),
      map((value: string | null) => this._filter(value || ''))
    );

    control.valueChanges.subscribe((value: string | null) => {
      this.filterTableData(value || '');
    });
  }

  loadClientProfile(): void {
    const t001ClientObj = {};

    this.httpClientService.fetchactiveClient(t001ClientObj).subscribe(
    (result: any) => {
      this.activeclientList = result
        .filter((data: any) => data.status === 'ACTIVE')
        .sort((a: any, b: any) => a.clientName.localeCompare(b.clientName));

      this.clientactiveuserResult(this.activeclientList);
      this.dataGridClientList = [...this.clientDetailsList];
      this.dataSource = [...this.clientDetailsList];

      setTimeout(() => {
        if (this.tableScroll?.nativeElement && this.topScroll?.nativeElement?.firstElementChild) {
          const tableWidth = this.tableScroll.nativeElement.scrollWidth;
          this.topScroll.nativeElement.firstElementChild.setAttribute(
            'style',
            `width:${tableWidth}px`
          );
        }
      });
    }, (error) => { this.demoloader(); console.error(error); });
  }

  clientactiveuserResult(result: any): void {
    this.resultactiveusersAC = result;

    const t001clientAC = this.resultactiveusersAC.filter(
      (item: any) => item.status === 'ACTIVE' || item.status === 'INACTIVE'
    );

    this.clientDetailsList = [...t001clientAC];
    this.datagrid_id = [...t001clientAC];
    this.getClientNameList(t001clientAC);
    this.demoloader();
  }

  getClientNameList(param: any): void {
    this.clientNameList = param.map((item: any) => item.clientName);
    this._cd.markForCheck();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase().trim();

    if (!filterValue) {
      return [...this.clientNameList];
    }

    return this.clientNameList.filter((option: string) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  filterTableData(value: string): void {
    const filterValue = value.toLowerCase().trim();

    if (!filterValue) {
      this.dataGridClientList = [...this.clientDetailsList];
      this.dataSource = [...this.clientDetailsList];
      return;
    }

    const filteredList = this.clientDetailsList.filter((client: any) =>
      (client.clientName || '').toLowerCase().includes(filterValue)
    );

    this.dataGridClientList = [...filteredList];
    this.dataSource = [...filteredList];
  }

  toggleCompareAnalysisPopup(param: any): void {
    this.commonService.emitContractParam(param);
  }

  async module1_creationCompleteHandler(): Promise<void> {
    const t001ClientObj = {};

    this.httpClientService.fetchactiveClient(t001ClientObj).subscribe(
    (result: any) => {
      this.clientactiveuserResult(result);
      this.dataGridClientList = [...this.clientDetailsList];
      this.dataSource = [...this.clientDetailsList];
    },
    (error) => { console.error(error); });
  }

  burri_clickHandler(clientId: any, clientName: any): void {
    const ClientData = this.activeclientList.filter((data: any) => data.clientId === clientId);
    if (!ClientData.length) return;
    this.dialog.open(EditReportmenuAccessComponent, {
      width: '60%',
       height:'auto',
      backdropClass: 'custom-dialog-backdrop-class',
      data: {
        clientId: ClientData[0].clientId,
        clientName: ClientData[0].clientName,
        clientdata: ClientData
      }
    });
  }
}