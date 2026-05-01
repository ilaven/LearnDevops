import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { environment } from 'src/environments/environment';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from 'src/app/core/services/loader.service';

am4core.useTheme(am4themes_animated);

interface ChartItem {
  id: number;
  lookup_Id: number;
  lookup_Value: string;
}

@Component({
  selector: 'app-ups-contract-analysis-review',
  templateUrl: './contract-analysis-review.component.html',
  styleUrls: ['./contract-analysis-review.component.scss'],
  standalone: false
})
export class ContractAnalysisReviewComponent implements OnInit, AfterViewInit, OnDestroy {
  clientType = '';
  clientID: string | null = null;
  clientName = '';
  themeOption = '';

  imageUrl = environment.imageURL;
  ImageUrlData = '';
  clientNameRegex = '';
  carrierType = '';
  randomNumber = 0;
  currentDate: string | null = null;

  panelClass = '';
  handFillColor = '#444';
  handStrokeColor = '#000';
  axisLabelColor = '#444';

  baseRateVal = 0;
  accessorialsVal = 0;
  termsCondtionVal = 0;
  packagingVal = 0;
  overallVal = 0;

  chartNames: any[] = [];
  charts: ChartItem[] = [];
  selectedChart = new FormControl<string[]>([]);
  clientDetails: any;
  isLoading =signal<any>(false);
  private chartInstances: { [key: string]: any } = {};

  constructor(
    private dialog: MatDialog,
    private cookiesService: CookiesService,
    private httpClientService: HttpClientService,
    private changeDetector: ChangeDetectorRef,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ContractAnalysisReviewComponent>,
    private loaderService: LoaderService,
  ) {
    this.openLoading();
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype || '';
    });
  }

  async ngOnInit(): Promise<void> {    
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = this.datePipe.transform(new Date(), 'MM-dd-yyyy');
    await this.getClientDetails();
  }
 openLoading() {
    this.isLoading.set(true);
  }
  closeLoading() {
    this.isLoading.set(false);
  }
  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.disposeCharts();
  }

  async getClientDetails(): Promise<void> {
    this.carrierType = (await this.cookiesService.getCookie('carrierType')) || '';
    this.clientID = await this.cookiesService.getCookie('clientId');
    this.clientName = (await this.cookiesService.getCookie('clientName')) || '';
    this.clientNameRegex = this.clientName.replace(/\s/g, '');
    this.ImageUrlData = this.imageUrl + this.clientNameRegex + '.jpg';
    this.getStatusList();
  }

  async themeFunction(): Promise<void> {
    const theme = await this.cookiesService.getCookie('themeOption');
    this.themeOption = theme || '';
    this.panelClass = this.themeOption === 'dark' ? 'page-dark' : 'custom-dialog-panel-class';

    this.colorOptions();
    this.fetchClientLoginCredentials();
  }

  colorOptions(): void {
    if (this.themeOption !== 'dark') {
      this.handFillColor = '#444';
      this.handStrokeColor = '#000';
      this.axisLabelColor = '#444';
    } else {
      this.handFillColor = '#c3c3c3';
      this.handStrokeColor = '#D3D3D3';
      this.axisLabelColor = '#c3c3c3';
    }
  }

  getBase64ImageFromURL(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('Canvas context not available');
          return;
        }

        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (error) => reject(error);
      img.src = url;
    });
  }

  async savePDF(): Promise<void> {
    if (!this.charts.length) {
      this.openModal('No charts selected to export.');
      return;
    }

    const exportedCharts = this.charts
      .map((chart) => this.chartInstances['chartdiv' + chart.id])
      .filter((chart) => !!chart);

    if (!exportedCharts.length) {
      this.openModal('Charts are still loading. Please try again.');
      return;
    }

    const currentDate = this.currentDate || '';

    let clientImageDataUrl: string | null = null;
    let ljmImageDataUrl: string | null = null;
    let ratingScaleImgUrl: string | null = null;

    try {
      clientImageDataUrl = await this.getBase64ImageFromURL('Ljm_image/' + this.clientNameRegex + '.jpg');
    } catch {
      clientImageDataUrl = null;
    }

    try {
      ljmImageDataUrl = await this.getBase64ImageFromURL('assets/images/logo/ljm_logoImg.png');
    } catch {
      ljmImageDataUrl = null;
    }

    try {
      ratingScaleImgUrl = await this.getBase64ImageFromURL('assets/images/RatescalePDF.png');
    } catch {
      ratingScaleImgUrl = null;
    }

    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');

    const exportPromises: Promise<any>[] = [
      exportedCharts[0].exporting.pdfmake,
      ...exportedCharts.map((chart) => chart.exporting.getImage('png'))
    ];

    Promise.all(exportPromises)
    .then((res) => {
      const pdfMake = res[0];
      pdfMake.vfs = null;
      pdfMake.vfs = pdfFonts;

      const doc: any = {
        pageSize: {
          width: 900,
          height: 'auto'
        },
        pageOrientation: 'portrait',
        pageMargins: [40, 40, 40, 40],
        content: []
      };

      doc.content.push({
        columns: [
          clientImageDataUrl
            ? {
                image: clientImageDataUrl,
                fit: [110, 80],
                width: 110,
                alignment: 'left',
                margin: [0, 0, 0, 0]
              }
            : {
                text: '',
                width: 110
              },

          {
            width: '*',
            stack: [
              {
                text: 'Contract Analysis Review',
                fontSize: 25,
                bold: true,
                alignment: 'center',
                margin: [0, 10, 0, 0]
              }
            ]
          },

          ljmImageDataUrl
            ? {
                image: ljmImageDataUrl,
                fit: [110, 80],
                width: 110,
                alignment: 'right',
                margin: [0, 0, 0, 0]
              }
            : {
                text: '',
                width: 110
              }
        ],
        columnGap: 10,
        margin: [0, 0, 0, 10]
      });

      doc.content.push({
        text: this.clientName,
        fontSize: 20,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 35]
      });

      if (ratingScaleImgUrl) {
        doc.content.push({
          image: ratingScaleImgUrl,
          alignment: 'center',
          fit: [300, 100],
          margin: [0, 0, 0, 30]
        });
      }

      let index = 0;
      while (index < this.charts.length) {
        const resData = this.setColumns(res, index);
        index = resData.row;

        doc.content.push({
          columns: resData.title
        });

        if (resData.images.length === 1) {
          doc.content.push(resData.images[0]);
        } else {
          doc.content.push({
            columns: resData.images
          });
        }
      }

      doc.content.push({
        text: 'Date: ' + currentDate,
        fontSize: 10,
        bold: true,
        alignment: 'right',
        margin: [0, 20, 0, 0]
      });

      pdfMake.createPdf(doc).download('Contract_Analysis_Review_' + this.clientName + '.pdf');
    })
    .catch((error) => {
      console.log('PDF export error', error);
      this.openModal('Unable to generate PDF.');
    });
  }

  openModal(alertVal: string): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  fetchClientLoginCredentials(): void {
    this.openLoading();
    const t001LogincustObj: any = {};

    if (this.clientType === 'UPS') {
      t001LogincustObj.upsClientId = this.clientID;
    } else {
      t001LogincustObj.fedexClientId = this.clientID;
    }

    t001LogincustObj.CarrierName = this.clientType;

    this.httpClientService.findClientLoginCredential(t001LogincustObj).subscribe(
      (response: any) => {
        this.clientDetails = response?.[0];

        if (!this.clientDetails) {
          return;
        }

        const crmAccountNumber = this.clientDetails.crmAccountNumber;
        this.fetchContractAnalysisReviewDetails(crmAccountNumber, this.clientType);

        if (this.clientType === 'UPS') {
          this.selectedChart.setValue(
            this.clientDetails.contractAnalysisRatingUPS
              ? this.clientDetails.contractAnalysisRatingUPS.split(',')
              : ['43']
          );
        } else {
          this.selectedChart.setValue(
            this.clientDetails.contractAnalysisRatingFedEx
              ? this.clientDetails.contractAnalysisRatingFedEx.split(',')
              : ['43']
          );
        }

        this.buildSelectedCharts();
        this.changeDetector.detectChanges();

        setTimeout(() => {
          this.renderSelectedCharts();
        }, 100);
      }, (error) => { this.closeLoading(); console.log(error); });
  }

  fetchContractAnalysisReviewDetails(crmAccNo: any, carrierName: any): void {
    this.httpClientService.fetchContractAnalysisReviewDetails(crmAccNo, carrierName).subscribe(
      (result: any) => {
        this.closeLoading();
        this.setChartVal(result);

        setTimeout(() => {
          this.renderSelectedCharts();
        }, 100);
      },
      (error: any) => { this.closeLoading();console.log('error', error); });
  }

  setChartVal(result: any): void {
    this.baseRateVal = Number(result?.BaseRate ?? 0);
    this.accessorialsVal = Number(result?.Accessorials ?? 0);
    this.termsCondtionVal = Number(result?.TermsCondtion ?? 0);
    this.packagingVal = Number(result?.Packaging ?? 0);
    this.overallVal = Number(result?.Overall ?? 0);
  }

  private renderSelectedCharts(): void {
    this.disposeCharts();

    this.charts.forEach((chart) => {
      const containerId = 'chartdiv' + chart.id;
      this.chartInstances[containerId] = this.createGaugeChart(containerId, 0);
    });
  }

  private getScoreByLookupId(lookupId: number): number {
    switch (Number(lookupId)) {
      case 39:
        return this.baseRateVal;
      case 40:
        return this.accessorialsVal;
      case 41:
        return this.termsCondtionVal;
      case 42:
        return this.packagingVal;
      case 43:
        return this.overallVal;
      default:
        return 0;
    }
  }

  rateCharts(param: number): void {
    const selected = this.charts.find((chart) => Number(chart.lookup_Id) === Number(param));
    if (!selected) {
      return;
    }

    const containerId = 'chartdiv' + selected.id;
    const chart = this.chartInstances[containerId];
    const value = this.getScoreByLookupId(selected.lookup_Id);

    if (chart?.hands?.length) {
      this.animateHand(chart.hands.getIndex(0), value);
    }
  }

  private animateHand(hand: any, value: number): void {
    hand.value = 0;
    new am4core.Animation(
      hand,
      {
        property: 'value',
        to: value
      },
      1000,
      am4core.ease.cubicOut
    ).start();
  }

  private createGaugeChart(containerId: string, resval: number): any {
    am4core.options.commercialLicense = true;

    const chartMin = 0;
    const chartMax = 5;

    const data = {
      score: resval,
      gradingData: [
        { title: 'Unsustainable', color: '#0f9747', lowScore: 0, highScore: 1 },
        { title: 'Foundational', color: '#b0d136', lowScore: 1, highScore: 2 },
        { title: 'Developing', color: '#f3eb0c', lowScore: 2, highScore: 3 },
        { title: 'Maturing', color: '#fdae19', lowScore: 3, highScore: 4 },
        { title: 'High Performing', color: '#ee1f25', lowScore: 4, highScore: 5 }
      ]
    };

    const colors = ['#0f9747', '#b0d136', '#f3eb0c', '#fdae19', '#ee1f25'];

    const createRange = (axis: any, from: number, to: number, color: any) => {
      const range = axis.axisRanges.create();
      range.value = from;
      range.endValue = to;
      range.axisFill.fill = color;
      range.axisFill.fillOpacity = 0.8;
      range.label.disabled = true;
      range.grid.disabled = true;
    };

    const chart = am4core.create(containerId, am4charts.GaugeChart);
    chart.hiddenState.properties.opacity = 0;
    chart.fontSize = 11;
    chart.innerRadius = am4core.percent(80);
    chart.resizable = true;

    const axis = chart.xAxes.push(new am4charts.ValueAxis() as any);
    axis.min = chartMin;
    axis.max = chartMax;
    axis.strictMinMax = true;
    axis.renderer.radius = am4core.percent(80);
    axis.renderer.inside = true;
    axis.renderer.line.strokeOpacity = 0.1;
    axis.renderer.ticks.template.disabled = false;
    axis.renderer.ticks.template.strokeOpacity = 1;
    axis.renderer.ticks.template.strokeWidth = 0.5;
    axis.renderer.ticks.template.length = 5;
    axis.renderer.grid.template.disabled = true;
    axis.renderer.labels.template.radius = am4core.percent(15);
    axis.renderer.labels.template.fontSize = '0.9em';
    axis.renderer.labels.template.fill = am4core.color(this.axisLabelColor);

    const axis2 = chart.xAxes.push(new am4charts.ValueAxis() as any);
    axis2.min = chartMin;
    axis2.max = chartMax;
    axis2.strictMinMax = true;
    axis2.renderer.labels.template.disabled = true;
    axis2.renderer.ticks.template.disabled = true;
    axis2.renderer.grid.template.disabled = false;
    axis2.renderer.grid.template.opacity = 0.5;

    const gradient = new am4core.LinearGradient();
    for (let i = 0; i < 5; ++i) {
      gradient.addColor(am4core.color(colors[i]));
    }
    createRange(axis2, 0, 5, gradient);

    for (const grading of data.gradingData) {
      const range = axis2.axisRanges.create();
      range.axisFill.fill = am4core.color(grading.color);
      range.axisFill.fillOpacity = 0.8;
      range.axisFill.zIndex = -1;
      range.value = grading.lowScore > chartMin ? grading.lowScore : chartMin;
      range.endValue = grading.highScore < chartMax ? grading.highScore : chartMax;
      range.grid.strokeOpacity = 0;
      range.stroke = am4core.color(grading.color).lighten(-0.1);
      range.label.inside = true;
      range.label.location = 0.5;
      range.label.radius = am4core.percent(10);
      range.label.paddingBottom = 10;
      range.label.fontSize = '0.9em';
    }

    const label = chart.radarContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.fontSize = '6em';
    label.x = am4core.percent(50);
    label.paddingBottom = 15;
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'bottom';
    label.text = Number(data.score).toFixed(1);

    const hand = chart.hands.push(new am4charts.ClockHand());
    hand.axis = axis2;
    hand.innerRadius = am4core.percent(55);
    hand.startWidth = 8;
    hand.pin.disabled = true;
    hand.value = 0;
    hand.fill = am4core.color(this.handFillColor);
    hand.stroke = am4core.color(this.handStrokeColor);

    hand.events.on('positionchanged', () => {
      label.text = axis2.positionToValue(hand.currentPosition).toFixed(1);
      label.fill = am4core.color(this.handFillColor);
    });

    this.animateHand(hand, Number(data.score));
    return chart;
  }

  setStyles(): any {
    if (this.charts.length === 1) {
      return {
        width: '98%',
        margin: '1%'
      };
    } else if (this.charts.length < 3) {
      return {
        width: '48%',
        margin: '1%'
      };
    } else {
      return {
        width: '48%',
        margin: '1%'
      };
    }
  }

  setColumns(res: any[], index: number): any {
    const columns1: any[] = [];
    const columns2: any[] = [];
    let count = 0;
    const width = this.charts.length === 1 ? 800 : 410;

    for (let row = index; row < this.charts.length; row++) {
      columns1.push({
        text: this.charts[row].lookup_Value,
        fontSize: 10,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      });

      columns2.push({
        image: res[row + 1],
        width,
        alignment: 'center',
        margin: [0, 0, 0, 20]
      });

      count++;

      if (count === 2) {
        return { title: columns1, images: columns2, row: row + 1 };
      }
    }

    return { title: columns1, images: columns2, row: this.charts.length };
  }

  getStatusList(): void {
    const param = {
      lookup_Code: '011'
    };

    this.httpClientService.getStatusList(param).subscribe(
      (result: any) => {
        this.chartNames = result || [];
        this.themeFunction();
      },
      (error) => {
        this.closeLoading();
        console.log('error', error);
      }
    );
  }

  buildSelectedCharts(): void {
    this.charts = [];
    const chartIdList: string[] = this.selectedChart.value || [];
    let displayIndex = 1;

    for (let row = 0; row < this.chartNames.length; row++) {
      if (chartIdList.includes(String(this.chartNames[row].lookup_Id))) {
        this.charts.push({
          id: displayIndex++,
          lookup_Id: Number(this.chartNames[row].lookup_Id),
          lookup_Value: this.chartNames[row].lookup_Value
        });
      }
    }
  }

  selectionChange(): void {
    this.buildSelectedCharts();
    this.changeDetector.detectChanges();

    setTimeout(() => {
      this.renderSelectedCharts();
    }, 100);
  }

  setChart(): void {
    this.save();
  }

  save(): void {
    if (!this.clientDetails) {
      return;
    }

    if (this.clientType === 'UPS') {
      this.clientDetails.contractAnalysisRatingUPS = (this.selectedChart.value || []).toString();
    } else {
      this.clientDetails.contractAnalysisRatingFedEx = (this.selectedChart.value || []).toString();
    }

    this.clientDetails.carrierType = this.clientType;

    this.httpClientService.saveOrUpdateContractAnalysisRating(this.clientDetails).subscribe(
      () => { },
      (error: any) => {
        console.log('error', error);
      }
    );
  }

  private disposeCharts(): void {
    Object.keys(this.chartInstances).forEach((key) => {
      if (this.chartInstances[key]) {
        this.chartInstances[key].dispose();
      }
    });
    this.chartInstances = {};
  }

  close() {
    this.dialogRef.close();
  }

}