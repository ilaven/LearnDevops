import { AfterViewInit, ElementRef, Component, OnInit, OnDestroy, ViewChild, signal, Inject, ChangeDetectorRef } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { environment } from 'src/environments/environment';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-fedex-detail-savings-popup',
  templateUrl: './detail-savings-popup.component.html',
  styleUrls: ['./detail-savings-popup.component.scss'],
  standalone: false
})
export class DetailSavingsPopup implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('topScroll') topScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  //variable Declaration
  clientType = signal<any>('');
  private destroy$ = new Subject<void>();
  fromPage: any;
  typeinfo: any;
  clientName: any;
  clientId: any;
  dataProviderList: any;
  panelClass: any;
  imageUrl = environment.imageURL;
  ImageUrlData: any;
  clientNameRegex: any;
  carrierType: any;
  breadCrumbItems!: Array<{}>;

  constructor(
    public dialogRef: MatDialogRef<DetailSavingsPopup>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpClient: HttpClientService,
    private cookiesService: CookiesService,
    private dialog: MatDialog,
    private httpFedex: HttpfedexService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) {
    this.panelClass = data.panelClass;
    this.fromPage = data;
    this.clientId = data.clientId;
    this.cookiesService.carrierType.pipe(takeUntil(this.destroy$)).subscribe((clienttype) => {
      this.clientType.set(clienttype);
    });
    if (this.clientType().toUpperCase() == "UPS") {
      this.fetch_ContractSavings(this.clientId)
    }
    else {
      let clientobj: any = {}
      clientobj["clientId"] = this.clientId;
      this.fetchSumofcontractsumary(clientobj)
    }
    this.getClientDetails();
  }

  fetch_ContractSavings(param: any): void {
    const T602_Contract_savingObj: Record<string, any> = {
      client_id: param
    };

    this.httpClient.fetch_ContractSavings(T602_Contract_savingObj).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          // If it's an array, assign 'carrier' to each item if needed
          this.dataProviderList = res.map((item: any) => ({
            ...item,
            carrier: 'UPS'
          }));
          this.cd.detectChanges();
        } else if (typeof res === 'object' && res !== null) {
          // If it's a plain object
          (res as Record<string, any>)['carrier'] = 'UPS';
          this.dataProviderList = [res];
          this.cd.detectChanges();
        }
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  fetchSumofcontractsumary(param: unknown): void {
    this.httpFedex.fetchSumofcontractsumary(param).subscribe({
      next: (res: unknown) => {
        if (Array.isArray(res)) {
          // If it's an array, assign 'carrier' to each item if needed
          this.dataProviderList = res.map((item: any) => ({
            ...item,
            carrier: 'FEDEX'
          }));
          this.cd.detectChanges();
        } else if (typeof res === 'object' && res !== null) {
          // If it's a plain object
          (res as Record<string, unknown>)['carrier'] = 'FEDEX';
          this.dataProviderList = [res];
          this.cd.detectChanges();
        }
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }


  async getClientDetails(): Promise<void> {
    this.carrierType = await this.cookiesService.getCookie("carrierType");
    this.clientName = await this.cookiesService.getCookie("clientName");

    this.clientNameRegex = this.clientName?.replace(/\s/g, "") ?? '';
    this.ImageUrlData = `${this.imageUrl}${this.clientNameRegex}.jpg`;
  }


  ngOnInit(): void {
    // Subscribe to carrierType and update signal
    this.cookiesService.carrierType
      .pipe(takeUntil(this.destroy$))
      .subscribe((clienttype) => {
        console.log('clienttype', clienttype);
        this.clientType.set(clienttype);
      });
  }

  ngAfterViewInit() {
    // Sync scrollbar width dynamically
    const tableWidth = this.tableScroll.nativeElement.scrollWidth;
    this.topScroll.nativeElement.firstElementChild!.setAttribute(
      'style',
      `width:${tableWidth}px`
    );
    this.cd.detectChanges();
  }


  async savePDF() {
    pdfMake.vfs = pdfFonts;
    this.getClientDetails();
    var date = new Date();
    var currentDate = this.datePipe.transform(date, "MM-dd-yyyy");
     let clientImageDataUrl: string | null = null;
      let ljmImageDataUrl: string | null = null;

      try {
        clientImageDataUrl = await this.getBase64ImageFromURL('https://cors-anywhere.herokuapp.com/' + this.ImageUrlData);
        // clientImageDataUrl = await this.getBase64ImageFromURL('Ljm_image/' + this.clientNameRegex + '.jpg');
      } catch {
        clientImageDataUrl = null;
      }

      try {
        ljmImageDataUrl = await this.getBase64ImageFromURL('assets/images/logo/ljm_logoImg.png');
      } catch {
        ljmImageDataUrl = null;
      }

    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
    var imgUrl = this.imageUrl;
    var clientNameObj = this.clientName;
    let docDefinition: any = {};
    if (this.clientType().toUpperCase() == "UPS") {
      docDefinition = {
        pageSize: {
          width: 700,
          height: 'auto'
        },
        pageOrientation: "portrait",
        pageMargins: [40, 40, 40, 40],

        content: [
          {
            columns: [{
              image: clientImageDataUrl,
              width: '*',
              alignment: 'left',
              fit: [100, 100],
            },

            {
              text: "Carrier Agreement Savings",
              fontSize: 25,
              bold: true,
              width: '*',
              margin: [0, 20, 0, 0],
              alignment: 'center',
            },
            {
              image: ljmImageDataUrl,
              width: '*',
              margin: [110, 0, 0, 0],
              fit: [100, 100],
            }
            ],
            columnGap: 5
          },
          {
            text: clientNameObj,
            fontSize: 20,
            bold: true,
            width: '*',
            alignment: 'center',
            margin: [0, 0, 0, 20]

          },
          {
            table: {
              headerRows: 1,
              widths: [40, 280, 80, 100, 100],
              body: [
                [{ text: 'Carrier', alignment: 'left', style: 'tableHeader' }, { text: 'Description', alignment: 'left', style: 'tableHeader' }, { text: 'Invoice Period', alignment: 'left', style: 'tableHeader' }, { text: 'Total Savings', alignment: 'left', style: 'tableHeader' }, { text: 'YTD Savings', alignment: 'left', style: 'tableHeader' }],
                ...this.dataProviderList.map((p: any) => ([{ text: p.carrier, alignment: 'left', style: 'body' }, { text: p.description, alignment: 'left', style: 'body' }, { text: p.date, alignment: 'left', style: 'body' },
                { text: '$' + this.setCommaQty(Number(p.qty.replace('$', '').replace(/[,]/g, '').replace('%', '')).toFixed(2)), alignment: 'left', style: 'body' },
                { text: '$' + this.setCommaQty(Number(p.rate.replace('$', '').replace(/[,]/g, '').replace('%', '')).toFixed(2)), alignment: 'left', style: 'body' }])),
              ]
            }
          },
          {
            text: " ",
          },
          {
            text: "Date: " + currentDate,
            fontSize: 10,
            bold: true,
            alignment: 'right',
            margin: [0, 0, 0, 30]
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            fontSize: 14,
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            fillColor: 'silver',
            // color:'#1b38a7',
            alignment: 'center'
          },
          body: {
            fontSize: 10,
            alignment: 'center'
          }
        }
      };
    }
    else if (this.clientType().toUpperCase() == "FEDEX") {
      docDefinition = {
        pageSize: {
          width: 700,
          height: 'auto'
        },
        pageOrientation: "portrait",
        pageMargins: [40, 40, 40, 40],

        content: [
          {
            columns: [{
              image: clientImageDataUrl,
              width: '*',
              alignment: 'left',
              fit: [100, 100],
            },

            {
              text: "Carrier Agreement Savings",
              fontSize: 25,
              bold: true,
              width: '*',
              margin: [0, 20, 0, 0],
              alignment: 'center',
            },
            {
              image: ljmImageDataUrl,
              width: '*',
              margin: [110, 0, 0, 0],
              fit: [100, 100],
            }
            ],
            columnGap: 5
          },
          {
            text: clientNameObj,
            fontSize: 20,
            bold: true,
            width: '*',
            alignment: 'center',
            margin: [0, 0, 0, 20]

          },
          {
            table: {
              headerRows: 1,
              widths: [40, 280, 80, 100, 100],
              body: [
                [{ text: 'Carrier', alignment: 'left', style: 'tableHeader' }, { text: 'Description', alignment: 'left', style: 'tableHeader' }, { text: 'Invoice Period', alignment: 'left', style: 'tableHeader' }, { text: 'Total Savings', alignment: 'left', style: 'tableHeader' }, { text: 'YTD Savings', alignment: 'left', style: 'tableHeader' }],
                ...this.dataProviderList.map((p: any) => ([{ text: p.carrier, alignment: 'left', style: 'body' }, { text: p.description, alignment: 'left', style: 'body' }, { text: p.contractDate, alignment: 'left', style: 'body' },
                { text: '$' + this.setCommaQty(Number(p.qty.replace('$', '').replace(/[,]/g, '').replace('%', '')).toFixed(2)), alignment: 'left', style: 'body' },
                { text: '$' + this.setCommaQty(Number(p.rate.replace('$', '').replace(/[,]/g, '').replace('%', '')).toFixed(2)), alignment: 'left', style: 'body' }])),
              ]
            }
          },
          {
            text: " ",
          },
          {
            text: "Date: " + currentDate,
            fontSize: 10,
            bold: true,
            alignment: 'right',
            margin: [0, 0, 0, 30]
          }
        ],
        styles: {
          sectionHeader: {
            bold: true,
            fontSize: 14,
            alignment: 'center',
            margin: [0, 15, 0, 15]
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            fillColor: 'silver',
            // color:'#1b38a7',
            alignment: 'center'
          },
          body: {
            fontSize: 10,
            alignment: 'center'
          }
        }
      };

    }

    // download the PDF
    pdfMake.createPdf(docDefinition).download("Carrier_Agreement_Savings_" + clientNameObj + ".pdf");

  }

  exportTOExcel() {
    var contractSavingsDataArr = []

    if (this.dataProviderList.length == 0) {
      this.openModal("No Record found");
      return;
    }
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.")
    var today = new Date();
    var todayDate = this.datePipe.transform(today, "yyyy-MM-dd-HH-mm-ss");
    var fileName = this.clientNameRegex + "_" + this.clientType() + "_Carrier_Agreement_Savings" + todayDate + ".xlsx";

    var contractSavingsArr = [];
    for (let loop = 0; loop < this.dataProviderList.length; loop++) {
      contractSavingsDataArr = [];
      if (this.clientType().toUpperCase() == "UPS") {
        contractSavingsDataArr.push(this.dataProviderList[loop].carrier,
          this.dataProviderList[loop].description,
          this.dataProviderList[loop].date,
          Number(this.dataProviderList[loop].qty.replace('$', '').replace(/[,]/g, '').replace('%', '')),
          Number(this.dataProviderList[loop].rate.replace('$', '').replace(/[,]/g, '').replace('%', ''))
        );
      }
      else if (this.clientType().toUpperCase() == "FEDEX") {
        contractSavingsDataArr.push(this.dataProviderList[loop].carrier,
          this.dataProviderList[loop].description,
          this.dataProviderList[loop].contractDate,
          Number(this.dataProviderList[loop].qty.replace('$', '').replace(/[,]/g, '').replace('%', '')),
          Number(this.dataProviderList[loop].rate.replace('$', '').replace(/[,]/g, '').replace('%', ''))
        );
      }
      contractSavingsArr.push(contractSavingsDataArr)
    }
    var contractSavingsHeaderArr = [];
    contractSavingsHeaderArr.push('Carrier', 'Description', 'Invoice Period', 'Total Savings', 'YTD Savings')

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Carrier Agreement Savings');
    //Add Title
    let titleRow = worksheet.addRow(["Carrier Agreement Savings - " + this.clientName]);
    // let titleRow = worksheet.addRow([title]);
    titleRow.font = { family: 4, size: 13, bold: true };
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1:E1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow([]);

    //Add Header Row
    let headerRow = worksheet.addRow(contractSavingsHeaderArr);
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
    var count = 1;
    contractSavingsArr.forEach(d => {
      let row = worksheet.addRow(d);
      row.eachCell((cell, number) => {
        if (count % 2 == 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',

            fgColor: { argb: 'd0e3ff' }
          }
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      })
      let color = 'd0e3ff';
      count++;
    }
    );
    worksheet.getColumn(4).numFmt = '$#,##0.00';
    worksheet.getColumn(5).numFmt = '$#,##0.00';

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 50;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 16;
    worksheet.getColumn(5).width = 16;

    worksheet.addRow([]);

    //Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })

  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img: HTMLImageElement = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        ctx.drawImage(img, 0, 0);

        const dataURL: string = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = (error: unknown) => {
        reject(error);
      };
      img.src = url;
    });
  }

  setCommaQty(eve: any) {
    if (eve != null) {
      return eve.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
      return '';
    }
  }


  syncScroll(event: Event, source: 'top' | 'table') {
    const scrollLeft = (event.target as HTMLElement).scrollLeft;
    if (source === 'top') {
      this.tableScroll.nativeElement.scrollLeft = scrollLeft;
    } else {
      this.topScroll.nativeElement.scrollLeft = scrollLeft;
    }
  }

  openModal(alertVal: unknown): void {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });

    this.dialogRef.close({ event: 'true' });
  }



  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  close() {
    this.dialogRef.close();
  }

}