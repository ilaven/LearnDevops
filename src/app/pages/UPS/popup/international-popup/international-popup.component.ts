import { Component, Inject, OnDestroy, OnInit, Optional ,HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { HttpClientService } from 'src/app/core/services/httpclient.service';

am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

interface PopupData {
  popupValue: {
    invoiceMonth: string | number | null;
    invoiceyear: string | number;
    clientId: string | number;
    clientName: string;
    groupby: string;
    chargeDescription: string;
    chargetypevalue: string;
    typecode: 'IMP' | 'EXP' | string;
    themeoption?: 'dark' | 'light' | string;
  };
}

interface ChartBucketRow {
  weight: string;
  value: number | string;
}

interface MonthChartRow {
  Month: string;
  value: number | string;
  chargetyperesult?: string;
  typecodesel?: string;
}

@Component({
  selector: 'app-international-popup',
  templateUrl: './international-popup.component.html',
  styleUrls: ['./international-popup.component.css'],
  standalone: false
})
export class InternationalPopupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dashBoardSHP: UntypedFormGroup;
  moreviewChargeDescFormGroup: UntypedFormGroup;

  fromPage: any;
  invoiceMonth: any;
  invoiceyear: any;
  clientId: any;
  clientName: any;
  groupby: any;
  chargeDescription: any;
  chargetypevalue: any;
  typecode: any;
  year: any;
  themeoption: any;
  showColumnPicker = false;
  pie_popupAC: any[] = [];
  weightAC: any[] = [];
  resultObj: any;
  fun_monthAC: any[] = [];
  commonAC: any[] = [];
  tempt004AC: MonthChartRow[] = [];
  serviceAccAC: any[] = [];

  chargedesctype: any;
  chargetypeflag: any;
  chargeDescriptionValue: any;
  chargetitle: any;
  typecode_name: any;
  chargedistritxt_text: any;
  chargedesctype_title: any;

  chargedescriptionserviceAC: any[] = [];
  chargedesfrtserviceAC: any[] = [];
  volume_by_chargedescriptionserviceAC: any[] = [];
  volume_bychargedesfrtserviceAC: any[] = [];

  commonACSHP_FRT: any[] = [];
  commonACSHP_FRT_ACC: any[] = [];
  commonACSHP_FRT_IMP: any[] = [];
  commonACSHP_FRT_ACC_IMP: any[] = [];

  fromACC = 0;
  toACC = 0;
  previous_id_visible: any;
  first_id_visible: any;
  next_id_visible: any;

  hashMapObj = new Map<string, string>();
  hashMapFRTObjData_EXP = new Map<string, any>();
  hashMapFRTObjData_IMP = new Map<string, any>();
  hashMapObjData_IMP = new Map<string, any>();
  hashMapObjData_EXP = new Map<string, any>();

  indicator: any;
  indicatorInterval: any;

  barColors = [
    '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
    '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
    '#E07877', '#E09776', '#F4C5B0', '#F3B777',
    '#F5C7A0', '#F6D3B8'
  ];

  private weightChart?: am4charts.XYChart;
  private volumeChart?: am4charts.XYChart;
  private averageCostChart?: am4charts.XYChart;
  private spendByMonthChart?: am4charts.XYChart;
  private accNoChart?: am4charts.XYChart;

  private readonly MONTH_NAMES = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

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
  constructor(
    public dialogRef: MatDialogRef<InternationalPopupComponent>,
    private mlForm: UntypedFormBuilder,
    private httpClientService: HttpClientService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PopupData
  ) {
    this.dashBoardSHP = new UntypedFormGroup({
      chargeDescription: new UntypedFormControl('FRT+ACC')
    });

    this.fromPage = data?.popupValue ?? {};
    this.invoiceMonth = this.fromPage.invoiceMonth == null ? '0' : this.fromPage.invoiceMonth;
    this.invoiceyear = this.fromPage.invoiceyear;
    this.clientId = this.fromPage.clientId;
    this.clientName = this.fromPage.clientName;
    this.groupby = this.fromPage.groupby;
    this.chargetypevalue = this.fromPage.chargeDescription;
    this.typecode = this.fromPage.typecode;
    this.chargeDescriptionValue = this.fromPage.chargetypevalue;
    this.themeoption = this.fromPage.themeoption;

    this.dashBoardSHP.get('chargeDescription')?.setValue(this.chargeDescriptionValue);

    this.moreviewChargeDescFormGroup = new UntypedFormGroup({
      clientName: new UntypedFormControl(this.clientName),
      clientname: new UntypedFormControl(this.clientName),
      clientId: new UntypedFormControl(this.clientId),
      groupby: new UntypedFormControl(this.groupby),
      services: new UntypedFormControl(this.groupby),
      group: new UntypedFormControl(this.groupby),
      chargeDescription: new UntypedFormControl(this.groupby),
      year: new UntypedFormControl(this.invoiceyear),
      invoiceMonth: new UntypedFormControl(this.invoiceMonth),
      invoiceyear: new UntypedFormControl(this.invoiceyear)
    });
  }

  ngOnInit(): void {
    this.initializeMonthMap();
    this.fetchT004Rymax_chargeBack_select();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.disposeChart(this.weightChart);
    this.disposeChart(this.volumeChart);
    this.disposeChart(this.averageCostChart);
    this.disposeChart(this.spendByMonthChart);
    this.disposeChart(this.accNoChart);

    clearInterval(this.indicatorInterval);
  }

  private disposeChart(chart?: am4charts.Chart): void {
    if (chart) {
      chart.dispose();
    }
  }

  private initializeMonthMap(): void {
    this.hashMapObj.set('1', 'JAN');
    this.hashMapObj.set('2', 'FEB');
    this.hashMapObj.set('3', 'MAR');
    this.hashMapObj.set('4', 'APR');
    this.hashMapObj.set('5', 'MAY');
    this.hashMapObj.set('6', 'JUN');
    this.hashMapObj.set('7', 'JULY');
    this.hashMapObj.set('8', 'AUG');
    this.hashMapObj.set('9', 'SEP');
    this.hashMapObj.set('10', 'OCT');
    this.hashMapObj.set('11', 'NOV');
    this.hashMapObj.set('12', 'DEC');
  }

  private monthNumberToName(month: string | number): string {
    const idx = Number(month) - 1;
    return this.MONTH_NAMES[idx] ?? String(month);
  }

  private monthNameToNumber(month: string): string {
    const idx = this.MONTH_NAMES.indexOf(month);
    return idx >= 0 ? String(idx + 1) : month;
  }

  private toNumber(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private setDarkTheme(axisX: any, axisY: any): void {
    if (this.themeoption === 'dark') {
      axisX.renderer.labels.template.fill = am4core.color('#fff');
      axisY.title.fill = am4core.color('#fff');
      axisY.renderer.labels.template.fill = am4core.color('#fff');
      axisY.renderer.grid.template.strokeOpacity = 1;
      axisY.renderer.grid.template.stroke = am4core.color('#3d4552');
      axisY.renderer.grid.template.strokeWidth = 2;
    }
  }

  private addCurrencyAxisLabels(valueAxis: am4charts.ValueAxis, title = '$Value'): void {
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.title.text = title;
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.adapter.add('text', (text) => `$${text}`);
  }

  private hasNegativeValues(data: Array<{ value: any }>): boolean {
    return data.some(item => this.toNumber(item.value) < 0);
  }

  private applyBarColors(series: am4charts.ColumnSeries | am4charts.ColumnSeries): void {
    series.columns.template.adapter.add('fill', (_: any, target: any) => {
      return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
    });
  }

  fetchT004Rymax_chargeBack_select(): void {
    this.httpClientService
      .fetchT004Rymax_chargeBack_select_International(this.moreviewChargeDescFormGroup.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.pie_popupAC = result;
          this.loadAC(this.pie_popupAC, this.invoiceyear, this.groupby,this.chargetypevalue,this.typecode);
        },
        error: (error: any) => {
          console.error('fetch DashBoard error', error);
        }
      });
  }

  linkfrt_clickHandler(): void {
    this.dashBoardSHP.get('chargeDescription')?.setValue('FRT');
    this.chargedesctype = 'INT_FRT';

    this.fun_month(this.fun_monthAC);
    this.Spend_WeightChart(this.weightAC, this.chargedesctype);
    this.commoniter();
    this.bar_chart0(this.chargedesfrtserviceAC);
    this.bar_chart5('T004_Dashboard', this.volume_by_chargedescriptionserviceAC, 'year', this.chargedesctype);
  }

  linkfrtacc_clickHandler(): void {
    this.dashBoardSHP.get('chargeDescription')?.setValue('FRT+ACC');
    this.chargedesctype = 'INT+ACC';

    this.fun_month(this.fun_monthAC);
    this.Spend_WeightChart(this.weightAC, this.chargedesctype);
    this.commoniter();
    this.bar_chart0(this.chargedesfrtserviceAC);
    this.bar_chart5('T004_Dashboard', this.volume_by_chargedescriptionserviceAC, 'year', this.chargedesctype);
  }

  loadAC(
    weightAC1: any[],
    currentyear: string,
    clickedChargeDesc: string,
    chargetypevalue: string,
    typecodevalue: string
  ): void {
    this.chargetitle = clickedChargeDesc;
    const clickedChargeDescend = clickedChargeDesc.replace('WW', 'WorldWide');

    this.year = currentyear;
    this.typecode = typecodevalue;
    this.typecode_name = this.typecode === 'IMP' ? 'Import' : 'Export';
    this.weightAC = weightAC1 ?? [];
    this.chargedesctype = chargetypevalue;
    this.chargetypeflag = chargetypevalue;

    this.Spend_WeightChart(this.weightAC, this.chargedesctype);
    this.fetchT004Rymax_International_chargeBack_ByMonth();
    this.fun_ServiceAcc_No(currentyear, clickedChargeDescend);
    this.fun_volume_byService(currentyear, clickedChargeDescend);
    this.fun_chargeDescription_Service(currentyear, clickedChargeDescend);

    this.chargedesctype_title = this.chargetitle;
    this.chargedistritxt_text =
      `International Charge Distribution and Services For ${this.chargetitle} in ${this.typecode_name} ${this.year}`;
  }

  fetchT004Rymax_International_chargeBack_ByMonth(): void {
    this.moreviewChargeDescFormGroup.get('clientId')?.setValue(String(this.clientId));

    this.httpClientService
      .fetchT004Rymax_International_chargeBack_ByMonth(this.moreviewChargeDescFormGroup.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.fun_monthAC = Array.isArray(result) ? result : [];
          this.fun_month(this.fun_monthAC);
        },
        error: (error: any) => {
          console.error('fetch DashBoard error', error);
        }
      });
  }

  fun_volume_byService(currentyear: any, clickedChargeDescend: any): void {
    this.moreviewChargeDescFormGroup.get('clientId')?.setValue(String(this.clientId));
    this.moreviewChargeDescFormGroup.get('chargeDescription')?.setValue(clickedChargeDescend);

    this.httpClientService
      .fetchT004Rymax_International_VolumebyService(this.moreviewChargeDescFormGroup.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.resultObj = result;
          this.volume_by_chargedescriptionserviceAC = Array.isArray(result) ? result : [];
          this.volume_bychargedesfrtserviceAC = this.volume_by_chargedescriptionserviceAC;

          this.bar_chart5(
            'T004_Dashboard',
            this.volume_by_chargedescriptionserviceAC,
            'year',
            this.chargedesctype
          );
        },
        error: (error: any) => {
          console.error('fetch DashBoard error', error);
        }
      });
  }

  bar_chart5(domainName: string, tempAC: any[], event_type: string, chargedesctype: string): void {
    this.createSeriesFromAC2(domainName, tempAC, event_type, chargedesctype);
  }

  bar_chart0(tempAC: any[]): void {
    this.createSeriesFromAC0_Service(tempAC);
  }

  createSeriesFromAC2(
    domainName: string,
    collection: any[],
    event_type: string,
    chargedesctype: any
  ): void {
    let chartData: ChartBucketRow[] = [];

    if (Array.isArray(collection) && collection.length > 0) {
      for (const tempObj of collection) {
        if (tempObj.chargetype === this.chargedesctype && tempObj.typenewcode === this.typecode) {
          if (event_type === 'month') {
            chartData = [
              { weight: '1', value: tempObj.volumeless1s ?? 0 },
              { weight: '2', value: tempObj.volumeless2s ?? 0 },
              { weight: '3', value: tempObj.volumeless3s ?? 0 },
              { weight: '4', value: tempObj.volumeless4s ?? 0 },
              { weight: '5', value: tempObj.volumeless5s ?? 0 },
              { weight: '6-10', value: tempObj.volumeless10s ?? 0 },
              { weight: '11-20', value: tempObj.volumeless20s ?? 0 },
              { weight: '21-30', value: tempObj.volumeless30s ?? 0 },
              { weight: '31-50', value: tempObj.volumeless50s ?? 0 },
              { weight: '51-70', value: tempObj.volumeless70s ?? 0 },
              { weight: '71-150', value: tempObj.volumeless150s ?? 0 },
              { weight: '151+', value: tempObj.volumeless150plus ?? 0 }
            ];
          } else {
            chartData = [
              { weight: '1', value: tempObj.yearVolumeless1s ?? 0 },
              { weight: '2', value: tempObj.yearVolumeless2s ?? 0 },
              { weight: '3', value: tempObj.yearVolumeless3s ?? 0 },
              { weight: '4', value: tempObj.yearVolumeless4s ?? 0 },
              { weight: '5', value: tempObj.yearVolumeless5s ?? 0 },
              { weight: '6-10', value: tempObj.yearVolumeless10s ?? 0 },
              { weight: '11-20', value: tempObj.yearVolumeless20s ?? 0 },
              { weight: '21-30', value: tempObj.yearVolumeless30s ?? 0 },
              { weight: '31-50', value: tempObj.yearVolumeless50s ?? 0 },
              { weight: '51-70', value: tempObj.yearVolumeless70s ?? 0 },
              { weight: '71-150', value: tempObj.yearVolumeless150s ?? 0 },
              { weight: '151+', value: tempObj.yearVolumeless150plus ?? 0 }
            ];
          }
          break;
        }
      }
    }

    if (chartData.length === 0) {
      chartData = [
        { weight: '1', value: 0 }, { weight: '2', value: 0 }, { weight: '3', value: 0 },
        { weight: '4', value: 0 }, { weight: '5', value: 0 }, { weight: '6-10', value: 0 },
        { weight: '11-20', value: 0 }, { weight: '21-30', value: 0 }, { weight: '31-50', value: 0 },
        { weight: '51-70', value: 0 }, { weight: '71-150', value: 0 }, { weight: '151+', value: 0 }
      ];
    }

    this.disposeChart(this.volumeChart);
    this.volumeChart = am4core.create('volume_weight', am4charts.XYChart);

    const chart = this.volumeChart;
    chart.paddingBottom = 30;
    // chart.angle = 35;
    chart.data = chartData;

    const minNegVal = this.hasNegativeValues(chartData);

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'weight';
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.dy = 10;
    categoryAxis.renderer.labels.template.fontSize = 12;
    categoryAxis.renderer.labels.template.inside = false;
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    this.addCurrencyAxisLabels(valueAxis, 'Count');
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'weight';
    series.name = 'Weight';
    series.tooltipText = 'Weight: [bold]{categoryX}[/]\nPackage Count: [bold]{valueY}';
    series.columns.template.fillOpacity = 1;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');

    this.applyBarColors(series);
    this.setDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }

  createSeriesFromAC0_Service(collection: any[]): void {
    let chartData: ChartBucketRow[] = [];

    if (Array.isArray(collection) && collection.length > 0) {
      for (const tempObj of collection) {
        if (tempObj.chargeType === this.chargedesctype && tempObj.typecode === this.typecode) {
          chartData = [
            { weight: '1', value: tempObj.chargeYearAverageCostless1s ?? 0 },
            { weight: '2', value: tempObj.chargeYearAverageCostless2s ?? 0 },
            { weight: '3', value: tempObj.chargeYearAverageCostless3s ?? 0 },
            { weight: '4', value: tempObj.chargeYearAverageCostless4s ?? 0 },
            { weight: '5', value: tempObj.chargeYearAverageCostless5s ?? 0 },
            { weight: '6-10', value: tempObj.chargeYearAverageCostless10s ?? 0 },
            { weight: '11-20', value: tempObj.chargeYearAverageCostless20s ?? 0 },
            { weight: '21-30', value: tempObj.chargeYearAverageCostless30s ?? 0 },
            { weight: '31-50', value: tempObj.chargeYearAverageCostless50s ?? 0 },
            { weight: '51-70', value: tempObj.chargeYearAverageCostless70s ?? 0 },
            { weight: '71-150', value: tempObj.chargeYearAverageCostless150s ?? 0 },
            { weight: '151+', value: tempObj.chargeYearAverageCostless150Plus ?? 0 }
          ];
          break;
        }
      }
    }

    if (chartData.length === 0) {
      chartData = [
        { weight: '1', value: 0 }, { weight: '2', value: 0 }, { weight: '3', value: 0 },
        { weight: '4', value: 0 }, { weight: '5', value: 0 }, { weight: '6-10', value: 0 },
        { weight: '11-20', value: 0 }, { weight: '21-30', value: 0 }, { weight: '31-50', value: 0 },
        { weight: '51-70', value: 0 }, { weight: '71-150', value: 0 }, { weight: '151+', value: 0 }
      ];
    }

    this.disposeChart(this.averageCostChart);
    this.averageCostChart = am4core.create('average_cost', am4charts.XYChart);

    const chart = this.averageCostChart;

    setTimeout(() => this.showIndicator(chart));

    chart.data = chartData;

    const minNegVal = this.hasNegativeValues(chartData);

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'weight';
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    this.addCurrencyAxisLabels(valueAxis, '$Value');
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'weight';
    series.name = 'Weight';
    series.tooltipText = 'Weight: [bold]{categoryX}[/]\nAvg Cost: $ [bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.fillOpacity = 1;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');

    this.applyBarColors(series);
    this.setDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

    setTimeout(() => {
      if (chartData.length > 0) {
        this.hideIndicator();
      }
    });
  }

  showIndicator(chart: any): void {
    let hourglass: any;

    if (!this.indicator) {
      this.indicator = chart.tooltipContainer.createChild(am4core.Container);
      this.indicator.background.fill = am4core.color('#fff');
      this.indicator.background.fillOpacity = 0.8;
      this.indicator.width = am4core.percent(100);
      this.indicator.height = am4core.percent(100);

      const indicatorLabel = this.indicator.createChild(am4core.Label);
      indicatorLabel.text = 'Loading...';
      indicatorLabel.align = 'center';
      indicatorLabel.valign = 'middle';
      indicatorLabel.fontSize = 20;
      indicatorLabel.dy = 50;

      hourglass = this.indicator.createChild(am4core.Image);
      hourglass.href = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg';
      hourglass.align = 'center';
      hourglass.valign = 'middle';
      hourglass.horizontalCenter = 'middle';
      hourglass.verticalCenter = 'middle';
      hourglass.scale = 0.7;

      (this.indicator as any)._hourglassRef = hourglass;
    } else {
      hourglass = (this.indicator as any)._hourglassRef;
    }

    this.indicator.hide(0);
    this.indicator.show();

    clearInterval(this.indicatorInterval);
    this.indicatorInterval = setInterval(() => {
      hourglass?.animate([{ from: 0, to: 360, property: 'rotation' }], 2000);
    }, 3000);
  }

  hideIndicator(): void {
    this.indicator?.hide();
    clearInterval(this.indicatorInterval);
  }

  fun_month(arrayAC: any[]): void {
    if (!Array.isArray(arrayAC)) {
      this.tempt004AC = [];
      this.Spend_Month(this.tempt004AC);
      return;
    }

    const existingMonths = new Set<string>();
    let year: any = this.invoiceyear;

    for (const row of arrayAC) {
      if (row?.invoiceMonth != null) {
        existingMonths.add(String(row.invoiceMonth));
      }
      if (row?.invoiceyear != null) {
        year = row.invoiceyear;
      }
    }

    const completedArray = [...arrayAC];

    for (let monthNo = 1; monthNo <= 12; monthNo++) {
      const m = String(monthNo);
      if (!existingMonths.has(m)) {
        completedArray.push({
          invoiceMonth: m,
          invoiceyear: year,
          netamount: 0,
          chargetype: this.chargedesctype,
          typenewcode: this.typecode
        });
      }
    }

    this.tempt004AC = completedArray.map((row: any) => ({
      Month: this.monthNumberToName(row.invoiceMonth),
      value: row.netamount ?? 0,
      chargetyperesult: row.chargetype,
      typecodesel: row.typenewcode
    }));

    this.Spend_Month(this.tempt004AC);
  }

  fun_chargeDescription_Service(currentyear: string, clickedChargeDescend: string): void {
    this.fetchT004Rymax_chargeDescription_Service_result(currentyear, clickedChargeDescend);
  }

  fetchT000Top_ten_States_By_Receiver_result(event: any): void {
    // kept for compatibility
  }

  fetchT004Rymax_chargeDescription_Service_result(currentyear: any, clickedChargeDescend: any): void {
    this.moreviewChargeDescFormGroup.get('clientId')?.setValue(String(this.clientId));

    this.moreviewChargeDescFormGroup.get('services')?.setValue(clickedChargeDescend);

    const clientNameWithoutspcl = (this.clientName || '').replace(/[^a-zA-Z0-9]/g, '');
    this.moreviewChargeDescFormGroup.get('clientname')?.setValue(clientNameWithoutspcl);
    this.moreviewChargeDescFormGroup.get('year')?.setValue(this.invoiceyear);

    this.httpClientService
      .fetchT004Rymax_chargeDescription_International_Service(this.moreviewChargeDescFormGroup.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.chargedescriptionserviceAC = Array.isArray(result) ? result : [];
          this.chargedesfrtserviceAC = this.chargedescriptionserviceAC;
          this.bar_chart0(this.chargedescriptionserviceAC);
        },
        error: (error: any) => {
          console.error('fetch DashBoard error', error);
        }
      });
  }

  fun_ServiceAcc_No(currentyear: string, clickedChargeDescend: string): void {
    this.moreviewChargeDescFormGroup.get('clientId')?.setValue(String(this.clientId));
    this.moreviewChargeDescFormGroup.get('group')?.setValue(clickedChargeDescend);

    this.httpClientService
      .fetchT000Service_Acc_International(this.moreviewChargeDescFormGroup.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.fetchT000Service_Acc_result(result);
        },
        error: (error: any) => {
          console.error('fetch DashBoard error', error);
        }
      });
  }

  fetchT000Service_Acc_result(event: any): void {
    this.serviceAccAC = Array.isArray(event) ? event : [];

    this.commonACSHP_FRT = [];
    this.commonACSHP_FRT_ACC = [];
    this.commonACSHP_FRT_IMP = [];
    this.commonACSHP_FRT_ACC_IMP = [];

    for (const tempobj of this.serviceAccAC) {
      if (tempobj.chargeType === 'INT_FRT' && tempobj.typecode === 'IMP') {
        this.commonACSHP_FRT_IMP.push(tempobj);
      }
      if (tempobj.chargeType === 'INT_FRT' && tempobj.typecode === 'EXP') {
        this.commonACSHP_FRT.push(tempobj);
      }
      if (tempobj.chargeType === 'INT+ACC' && tempobj.typecode === 'EXP') {
        this.commonACSHP_FRT_ACC.push(tempobj);
      }
      if (tempobj.chargeType === 'INT+ACC' && tempobj.typecode === 'IMP') {
        this.commonACSHP_FRT_ACC_IMP.push(tempobj);
      }
    }

    this.commoniter();
  }

  commoniter(): void {
    let source: any[] = [];

    if (this.chargedesctype === 'INT_FRT' && this.typecode === 'IMP') {
      source = this.commonACSHP_FRT_IMP;
    } else if (this.chargedesctype === 'INT_FRT' && this.typecode === 'EXP') {
      source = this.commonACSHP_FRT;
    } else if (this.chargedesctype === 'INT+ACC' && this.typecode === 'EXP') {
      source = this.commonACSHP_FRT_ACC;
    } else if (this.chargedesctype === 'INT+ACC' && this.typecode === 'IMP') {
      source = this.commonACSHP_FRT_ACC_IMP;
    }

    if (source.length <= 5) {
      this.fromACC = 0;
      this.toACC = source.length;
      this.previous_id_visible = false;
      this.first_id_visible = false;
      this.next_id_visible = false;
    } else {
      this.fromACC = 0;
      this.toACC = 5;
      this.previous_id_visible = false;
      this.first_id_visible = false;
      this.next_id_visible = true;
    }

    this.common();
  }

  common(): void {
    let source: any[] = [];

    if (this.chargedesctype === 'INT_FRT' && this.typecode === 'IMP') {
      source = this.commonACSHP_FRT_IMP;
    } else if (this.chargedesctype === 'INT_FRT' && this.typecode === 'EXP') {
      source = this.commonACSHP_FRT;
    } else if (this.chargedesctype === 'INT+ACC' && this.typecode === 'EXP') {
      source = this.commonACSHP_FRT_ACC;
    } else if (this.chargedesctype === 'INT+ACC' && this.typecode === 'IMP') {
      source = this.commonACSHP_FRT_ACC_IMP;
    }

    this.commonAC = source.slice(this.fromACC, this.toACC);
    this.Acc_No(this.commonAC);
  }

  Spend_WeightChart(tempAC: any[], chargedesctype: string): void {
    this.createSeriesFromAC(tempAC, chargedesctype, this.typecode);
  }

  createSeriesFromAC(collection: any[], chargedesctype: string, typecode: any): void {
    let chartData: ChartBucketRow[] = [];

    if (Array.isArray(collection) && collection.length > 0) {
      for (const tempObj of collection) {
        if (tempObj.chargetype === chargedesctype && tempObj.typenewcode === typecode) {
          chartData = [
            { weight: '1', value: tempObj.less1s ?? 0 },
            { weight: '2', value: tempObj.less2s ?? 0 },
            { weight: '3', value: tempObj.less3s ?? 0 },
            { weight: '4', value: tempObj.less4s ?? 0 },
            { weight: '5', value: tempObj.less5s ?? 0 },
            { weight: '6-10', value: tempObj.less10s ?? 0 },
            { weight: '11-20', value: tempObj.less20s ?? 0 },
            { weight: '21-30', value: tempObj.less30s ?? 0 },
            { weight: '31-50', value: tempObj.less50s ?? 0 },
            { weight: '51-70', value: tempObj.less70s ?? 0 },
            { weight: '71-150', value: tempObj.less150s ?? 0 },
            { weight: '151+', value: tempObj.less150plus ?? 0 }
          ];
          break;
        }
      }
    }

    if (chartData.length === 0) {
      chartData = [
        { weight: '1', value: 0 }, { weight: '2', value: 0 }, { weight: '3', value: 0 },
        { weight: '4', value: 0 }, { weight: '5', value: 0 }, { weight: '6-10', value: 0 },
        { weight: '11-20', value: 0 }, { weight: '21-30', value: 0 }, { weight: '31-50', value: 0 },
        { weight: '51-70', value: 0 }, { weight: '71-150', value: 0 }, { weight: '151+', value: 0 }
      ];
    }

    this.disposeChart(this.weightChart);
    this.weightChart = am4core.create('weight_disPopup', am4charts.XYChart);

    const chart = this.weightChart;
    chart.data = chartData;

    const minNegVal = this.hasNegativeValues(chartData);

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'weight';
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.grid.template.location = 0;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    this.addCurrencyAxisLabels(valueAxis, '$Value');
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'weight';
    series.name = 'Weight';
    series.tooltipText = 'Weight: [bold]{categoryX}[/]\nNet Charge: $ [bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.fillOpacity = 1;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');

    this.applyBarColors(series);
    this.setDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }

  Spend_Month(tempAC: any[]): void {
    this.createSeriesFromAC1(tempAC, this.chargedesctype, 'Month', 'value');
  }

  createSeriesFromAC1(collection: any[], chargedesctype: string, nameField: string, yField: string): void {
    this.hashMapFRTObjData_EXP = new Map<string, any>();
    this.hashMapFRTObjData_IMP = new Map<string, any>();
    this.hashMapObjData_IMP = new Map<string, any>();
    this.hashMapObjData_EXP = new Map<string, any>();

    if (!Array.isArray(collection)) {
      collection = [];
    }

    for (const t004Objtemp of collection) {
      const month = this.monthNameToNumber(t004Objtemp.Month);

      if (t004Objtemp.chargetyperesult === 'INT+ACC' && t004Objtemp.typecodesel === 'IMP') {
        this.hashMapObjData_IMP.set(month, t004Objtemp);
      }
      if (t004Objtemp.chargetyperesult === 'INT+ACC' && t004Objtemp.typecodesel === 'EXP') {
        this.hashMapObjData_EXP.set(month, t004Objtemp);
      }
      if (t004Objtemp.chargetyperesult === 'INT_FRT' && t004Objtemp.typecodesel === 'IMP') {
        this.hashMapFRTObjData_IMP.set(month, t004Objtemp);
      }
      if (t004Objtemp.chargetyperesult === 'INT_FRT' && t004Objtemp.typecodesel === 'EXP') {
        this.hashMapFRTObjData_EXP.set(month, t004Objtemp);
      }
    }

    const chartData: any[] = [];

    for (let i = 1; i <= this.hashMapObj.size; i++) {
      const key = String(i);

      let t004Obj: any = null;
      if (this.chargedesctype === 'INT_FRT' && this.typecode === 'IMP') {
        t004Obj = this.hashMapFRTObjData_IMP.get(key);
      } else if (this.chargedesctype === 'INT_FRT' && this.typecode === 'EXP') {
        t004Obj = this.hashMapFRTObjData_EXP.get(key);
      } else if (this.chargedesctype === 'INT+ACC' && this.typecode === 'EXP') {
        t004Obj = this.hashMapObjData_EXP.get(key);
      } else if (this.chargedesctype === 'INT+ACC' && this.typecode === 'IMP') {
        t004Obj = this.hashMapObjData_IMP.get(key);
      }

      if (t004Obj != null) {
        chartData.push({
          Month: t004Obj.Month,
          value: t004Obj.value ?? 0
        });
      }
    }

    this.disposeChart(this.spendByMonthChart);
    this.spendByMonthChart = am4core.create('spendByMonth', am4charts.XYChart);

    const chart = this.spendByMonthChart;
    chart.scrollbarX = new am4core.Scrollbar();
    chart.data = chartData;

    const minNegVal = this.hasNegativeValues(chartData);

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'Month';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    this.addCurrencyAxisLabels(valueAxis, '$Value');
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'Month';
    series.tooltipText = 'Month: [bold]{categoryX}[/]\nNet Charge: $[bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.strokeWidth = 0;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;
    series.columns.template.column.fillOpacity = 1;

    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    this.applyBarColors(series);
    this.setDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
  }

  Acc_No(tempAC: any[]): void {
    this.createSeriesFromAC21(tempAC);
  }

  createSeriesFromAC21(collection: any[]): void {
    const chartData: any[] = [];

    if (Array.isArray(collection) && collection.length > 0) {
      for (const tempObj of collection) {
        chartData.push({
          name: tempObj.accountNumber ?? 'Nil',
          points: tempObj.netamount ?? 0
        });
      }
    } else {
      chartData.push({
        name: 'Nil',
        points: 0
      });
    }

    this.disposeChart(this.accNoChart);
    this.accNoChart = am4core.create('acc_no', am4charts.XYChart);

    const chart = this.accNoChart;
    chart.scrollbarX = new am4core.Scrollbar();
    chart.data = chartData;

    const minNegVal = chartData.some(item => this.toNumber(item.points) < 0);

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    this.addCurrencyAxisLabels(valueAxis, '$ Value');
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'points';
    series.dataFields.categoryX = 'name';
    series.name = 'Account';
    series.columns.template.tooltipText =
      'Account Number: [bold]{categoryX}[/]\nNet Charge: $ [bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.fillOpacity = 1;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;

    
    this.setDarkTheme(categoryAxis, valueAxis);
  }

  btnBack_clickHandler(event: any): void {
    let source: any[] = [];

    if (this.chargedesctype === 'INT+ACC') {
      source = this.commonACSHP_FRT_ACC;
    } else if (this.chargedesctype === 'INT_FRT' && this.typecode === 'IMP') {
      source = this.commonACSHP_FRT_IMP;
    } else {
      source = this.commonACSHP_FRT;
    }

    const tempto = this.toACC + 5;

    if (tempto < source.length) {
      this.fromACC = this.toACC;
      this.toACC = this.toACC + 5;
    } else {
      this.fromACC = this.toACC;
      this.toACC = source.length;
    }

    if (this.toACC === source.length) {
      this.next_id_visible = false;
    }

    this.previous_id_visible = true;
    this.first_id_visible = true;
    this.common();
  }

  previous_id_clickHandler(event: any): void {
    this.toACC = this.fromACC;
    this.fromACC = Math.max(this.fromACC - 5, 0);

    if (this.fromACC === 0) {
      this.previous_id_visible = false;
      this.first_id_visible = false;
    }

    this.next_id_visible = true;
    this.common();
  }

  first_id_clickHandler(event: any): void {
    this.first_id_visible = false;
    this.previous_id_visible = false;
    this.next_id_visible = true;
    this.fromACC = 0;
    this.toACC = 5;
    this.common();
  }

  btnBackacc_clickHandler(event: any): void {
    this.btnBack_clickHandler(event);
  }

  repostExcelDownload(event: any): void {
    const urlParam: any = {};

    const clickedYear = this.moreviewChargeDescFormGroup.get('invoiceyear')?.value;
    const clientName = this.moreviewChargeDescFormGroup.get('clientName')?.value;
    const clientId = this.moreviewChargeDescFormGroup.get('clientId')?.value;
    const chargeDescription = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
    const typecode = this.typecode;

    urlParam['fromdate'] = '2014-10-01';
    urlParam['todate'] = '2014-10-10';
    urlParam['action'] = event;
    urlParam['chargedesc'] = chargeDescription;
    urlParam['year'] = clickedYear;
    urlParam['clientId'] = clientId;
    urlParam['clientName'] = clientName;
    urlParam['chargetyperesult'] = this.chargedesctype;
    urlParam['weightchargetype'] = typecode;

    let fields_string = '';
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += `${key}=${value}&`;
    }

    this.httpClientService.reportServlet(fields_string);
  }
  closeDialog() {
		this.dialogRef.close(true);
	}
}