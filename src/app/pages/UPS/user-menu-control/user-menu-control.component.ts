import { AfterViewInit, ElementRef, Component, OnInit, ViewChild, signal, ChangeDetectorRef, } from '@angular/core';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-menu-control',
  templateUrl: './user-menu-control.component.html',
  styleUrls: ['./user-menu-control.component.scss'],
  standalone: false,
})
export class UserMenuControl implements OnInit, AfterViewInit {
  clientType = signal<any>('');

  resultactiveusersAC: any[] = [];
  t001clientAC: any[] = [];
  datagrid_id: any[] = [];
  randomNumber: number = 0;

  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  constructor(
    private cookiesService: CookiesService,
    private loaderService: LoaderService,
    private httpClientService: HttpClientService,
    private router: Router,
    private dialog: MatDialog,
    private _cd: ChangeDetectorRef,
  ) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType.set(clienttype);

      if (this.clientType() === 'OnTrac' || this.clientType() === 'Dhl' || this.clientType() === 'USPS') {
        this.router.navigate(['/' + this.clientType().toLowerCase() + '/dashboard']);
      }
    });
    this.cookiesService.checkForClientName();
  }

  ngOnInit(): void {
    this.loaderService.show();
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.module1_creationCompleteHandler();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateTopScrollbarWidth();
    });
  }

  updateTopScrollbarWidth(): void {
    if (!this.topScroll?.nativeElement || !this.tableScroll?.nativeElement) {
      return;
    }

    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    const firstChild = this.topScroll.nativeElement.firstElementChild as HTMLElement | null;

    if (firstChild) {
      firstChild.style.width = `${tableWidth}px`;
    }
  }

  syncScroll(event: Event, source: 'top' | 'table'): void {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;

    if (source === 'top' && this.tableScroll?.nativeElement) {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else if (source === 'table' && this.topScroll?.nativeElement) {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  demoloader(): void {
    setTimeout(() => {
      this.loaderService.hide();
    }, 1000);
  }

  burri_clickHandler(rowObj: any, index: number): void {
    const menuOrder = [
      rowObj.esValue ? 'Y' : 'N',
      rowObj.imValue ? 'Y' : 'N',
      rowObj.cdValue ? 'Y' : 'N',
      rowObj.trValue ? 'Y' : 'N',
      rowObj.zdValue ? 'Y' : 'N',
      rowObj.ahValue ? 'Y' : 'N',
    ].join('~');

    rowObj.menucount = menuOrder;

    const saveOrUpdateGridClientmenuObj = { ...rowObj };

    this.httpClientService.saveOrUpdateGridClientmenuList(saveOrUpdateGridClientmenuObj).subscribe(
      () => {
        this.datagrid_id[index].menucount = menuOrder;
        this.openModal('Updated the User Menu Control');
        // return;
      }, (error: any) => { console.log('error', error); });
  }

  module1_creationCompleteHandler(): void {
    const t001ClientObj = {};

    this.httpClientService.fetchactiveinactiveClient(t001ClientObj).subscribe(
      (result: any) => {
        this.clientactiveuserResult(result);
      }, (error: any) => { this.demoloader(); console.log('error', error); });
  }

  private parseMenuCount(menuData: string | null | undefined) {
    const values = (menuData || '').split('~');

    return {
      esValue: values[0] === 'Y',
      imValue: values[1] === 'Y',
      cdValue: values[2] === 'Y',
      trValue: values[3] === 'Y',
      zdValue: values[4] === 'Y',
      ahValue: values[5] === 'Y',
    };
  }

  clientactiveuserResult(result: any): void {
    this.demoloader();
    this.t001clientAC = Array.isArray(result) ? result : [];
    this.resultactiveusersAC = this.t001clientAC.map((item: any) => {
      const parsedValues = this.parseMenuCount(item?.menucount);

      return {
        ...item,
        ...parsedValues,
      };
    });
    this.datagrid_id = [...this.resultactiveusersAC];
    this._cd.markForCheck();
    setTimeout(() => {
      this.updateTopScrollbarWidth();
    });
  }

  openModal(alertVal: any): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
    });
  }
}