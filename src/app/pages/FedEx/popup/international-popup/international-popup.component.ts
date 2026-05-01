import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Optional, signal, HostListener } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

am4core.useTheme(am4themes_animated);
am4core.options.commercialLicense = true;

@Component({
  selector: 'app-fedex-international-popup',
  templateUrl: './international-popup.component.html',
  styleUrls: ['./international-popup.component.css'],
  standalone: false
})
export class FedexInternationalPopupComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dashBoardSHP: UntypedFormGroup;
  moreviewChargeDescFormGroup: UntypedFormGroup;
  showColumnPicker = false;
  fromPage: any;
  invoiceMonth: any;
  invoiceyear: any;
  yearFedex: any;
  clientId: any;
  clientName: any;
  groupby: any;
  chargeGroup: any;
  chargeTypeVal: any;
  pie_popupAC: any[] = [];
  typecode: any;
  chargetitle: any;
  year: any;
  chart2AC: any[] = [];
  weightchargetype: any;
  chargetypeflag: any;
  group: any;
  resultObj: any;
  moreviewWeightFormGroup!: UntypedFormGroup;
  ByServiceAc: any[] = [];
  ByServicefrtAc: any[] = [];
  weight_mainAC: any;
  weightdisttxt_text: any;
  from: any;
  to: any;
  fromACC: any;
  toACC: any;
  month: any;
  fun_monthAC: any;
  commonAC: any[] = [];
  t004tempObj = {};
  tempt004AC: any[] = [];
  acclink_id_styleName: any;
  frtlink_id_styleName: any;
  frtacc_btn_selected: any;
  frt_btn_this_selected: any;
  weightfrtAC: any[] = [];
  hashMapObjData = new Map();
  hashMapFRTObjData = new Map();
  hashMapObj = new Map<string, string>();
  chargedistritxt_text: any;
  chargedesctype_title: any;
  chargedescriptionserviceAC: any[] = [];
  chargedesfrtserviceAC: any[] = [];
  volume_by_chargedescriptionserviceAC: any[] = [];
  volume_bychargedesfrtserviceAC: any[] = [];
  t000topStateObj: any;
  ten_StateAC_Reveiver: any[] = [];
  ten_StateACfrt_Reveiver: any[] = [];
  commonACSHP_FRT: any[] = [];
  commonACSHP_FRT_ACC: any[] = [];
  commonACSHP_FRT_IMP: any[] = [];
  commonACSHP_FRT_ACC_IMP: any[] = [];
  serviceAccAC: any[] = [];
  previous_id_visible: any;
  first_id_visible: any;
  next_id_visible: any;
  accountprev: any[] = [];
  accountsAC: any[] = [];
  chargeType_title: any;
  services_title: any;
  clientname: any;
  typecode_name: any;
  chargeDescription: any;
  weightchargetype_title: any;

  hashMapFRTObjData_EXP: any;
  hashMapFRTObjData_IMP: any;
  hashMapObjData_IMP: any;
  hashMapObjData_EXP: any;
  flag: any;
  domain_Name: any;
  event_type: any;
  boolean: any;
  t002ClientProfile: any;
  chargeType: any;
  themeoption: any;
  accountNumber: any;
  userProfifleFedex: any;

  reportsFormGroup = new UntypedFormGroup({
    reportLogId: new UntypedFormControl(''),
    t002ClientProfileobj: new UntypedFormGroup({
      clientId: new UntypedFormControl('')
    })
  });

  toAccCount: any;
  fromAccCount: any;
  t201AccresultAC: any;
  accountNumberVal: any;
  designFileName: any;
  panelClass: any;

  chargeDescriptionType = signal<any>('FRT+ACC');
  t202DashSrchObj: any = {};
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
    public dialogRef: MatDialogRef<FedexInternationalPopupComponent>,
    private httpfedexService: HttpfedexService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private commonService: CommonService,
    private datePipe: DatePipe
  ) {
    this.dashBoardSHP = new FormGroup({
      chargeDescription: new FormControl('FRT+ACC')
    });

    this.fromPage = data.pageValue;

    this.invoiceMonth = this.fromPage.invoiceMonth == null ? '0' : this.fromPage.invoiceMonth;
    this.clientName = this.fromPage.clientName;
    this.invoiceyear = this.fromPage.year;
    this.accountNumber = this.fromPage.accountNumber;
    this.yearFedex = this.fromPage.year;
    this.clientId = this.fromPage.clientId;
    this.t002ClientProfile = this.fromPage.t002ClientProfile;
    this.userProfifleFedex = this.fromPage.t002ClientProfile;
    this.chargeGroup = this.fromPage.chargeGroup;
    this.typecode = this.fromPage.typeCode;
    this.chargeDescription = this.fromPage.chargeDescription;
    this.chargeType = this.fromPage.chargeType;
    this.chargeTypeVal = this.fromPage.chargetypevalue;
    this.themeoption = this.fromPage.themeoption;

    const accountNumber = this.accountNumber === 'ALL' ? null : this.accountNumber;

    this.dashBoardSHP.get('chargeDescription')?.setValue(this.chargeTypeVal);

    this.moreviewChargeDescFormGroup = new UntypedFormGroup({
      year: new UntypedFormControl(this.yearFedex),
      month: new UntypedFormControl(this.invoiceMonth),
      accountNumber: new UntypedFormControl(accountNumber),
      clientName: new UntypedFormControl(this.clientName),
      clientId: new UntypedFormControl(this.clientId),
      t002ClientProfile: new UntypedFormControl(this.t002ClientProfile),
      chargeGroup: new UntypedFormControl(this.chargeGroup),
      typecode: new UntypedFormControl(this.typecode),
      chargeDescription: new UntypedFormControl(this.chargeDescription),
      chargeType: new UntypedFormControl(this.chargeType),
      invoiceMonth: new UntypedFormControl(this.invoiceMonth),
      invoiceyear: new UntypedFormControl(this.invoiceyear)
    });
  }

  ngOnInit(): void {
    this.dragpanel_initializeHandler();
    this.fedexFetchInternationalPopUp_Service(this.moreviewChargeDescFormGroup.value);
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

  private toNumber(value: any): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private hasNegativeValues(data: Array<{ value?: any; points?: any }>): boolean {
    return data.some(item => this.toNumber(item.value ?? item.points) < 0);
  }
  private applyBarColors(series: am4charts.ColumnSeries | am4charts.ColumnSeries): void {
    series.columns.template.adapter.add('fill', (_: any, target: any) => {
      return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
    });
  }

  private applyDarkTheme(categoryAxis: any, valueAxis: any): void {
    if (this.themeoption === 'dark') {
      categoryAxis.renderer.labels.template.fill = am4core.color('#fff');
      valueAxis.title.fill = am4core.color('#fff');
      valueAxis.renderer.labels.template.fill = am4core.color('#fff');
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color('#3d4552');
      valueAxis.renderer.grid.template.strokeWidth = 2;
    }
  }

  private initMonthMap(): void {
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

  dragpanel_initializeHandler(): void {
    this.initMonthMap();
  }

  fedexFetchInternationalPopUp_Service(resParam: any): void {
    this.httpfedexService
      .fedexFetchInternationalPopUp_Service(resParam)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.pie_popupAC = Array.isArray(result) ? result : [];
          this.loadAC(this.pie_popupAC, this.yearFedex, this.chargeDescription, this.chargeType, this.typecode);
        },
        error: (error: any) => {
          console.error('error', error);
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close(true);
  }

  linkfrt_clickHandler(event?: any): void {
    this.dashBoardSHP.get('chargeDescription')?.setValue('FRT');
    this.weightchargetype = 'FRT';
    this.fetchAccountNumber();
  }

  linkfrtacc_clickHandler(event?: any): void {
    this.dashBoardSHP.get('chargeDescription')?.setValue('FRT+ACC');
    this.weightchargetype = 'FRTWithAcc';
    this.fetchAccountNumber();
  }

  fetchAccountNumber(): void {
    const t202ChrgDescPopupObj: any = {};
    t202ChrgDescPopupObj['year'] = this.yearFedex;
    t202ChrgDescPopupObj['t002ClientProfile'] = this.t002ClientProfile;
    t202ChrgDescPopupObj['chargeGroup'] = 'Freight';
    t202ChrgDescPopupObj['chargeType'] =
      this.dashBoardSHP.get('chargeDescription')?.value === 'FRT+ACC' ? 'FRTWithAcc' : 'FRT';
    t202ChrgDescPopupObj['chargeDescription'] = this.chargetitle;

    this.fedexFetchInternationalPopUp_Service(t202ChrgDescPopupObj);
  }

  loadAC(weightAC: any[], clickedYear: any, clickedChargeDesc: string, chargetypevalue: any, chargeGrp: any): void {
    this.domain_Name = 'T202_Dashboard';
    this.chargetitle = clickedChargeDesc;

    if (!weightAC || weightAC.length === 0) {
      return;
    }

    this.previous_id_visible = false;
    this.first_id_visible = false;
    this.next_id_visible = false;
    this.fromAccCount = 0;
    this.toAccCount = weightAC.length <= 5 ? weightAC.length : 5;
    this.next_id_visible = weightAC.length > 5;

    this.year = clickedYear;
    this.typecode = chargeGrp;
    this.group = this.typecode === 'IMP' ? 'Import' : 'Export';
    this.chart2AC = weightAC;
    this.commonAC = weightAC;
    this.weightchargetype = chargetypevalue;
    this.chargetypeflag = chargetypevalue;

    this.chargedesctype_title = this.fromPage.chargeDescription;
    this.weightchargetype_title = this.chargetitle;
    this.chargedistritxt_text =
      `International Charge Distribution and Services For ${this.chargetitle} in ${this.group} ${this.year}`;

    const firstRow = weightAC[0];
    if (firstRow && firstRow.year === this.year && firstRow.accountNumber != null) {
      if (this.t202DashSrchObj['accountNumber'] == null) {
        this.event_type = 'year';
        this.boolean = null;
      } else {
        this.boolean = 1;
        this.event_type = null;
      }
    }

    this.bar_chart0(weightAC, this.event_type, this.weightchargetype, this.boolean);
    this.bar_chart1(this.domain_Name, weightAC, this.event_type, this.weightchargetype, this.boolean);
    this.bar_chart2(this.domain_Name, weightAC, this.event_type, this.weightchargetype, this.boolean);
    this.Spend_Month(weightAC, this.event_type, this.weightchargetype, this.boolean);
    this.Acc_No(this.domain_Name, weightAC, this.event_type, this.weightchargetype, this.boolean);
  }

  bar_chart2(domainName: any, tempAC: any, event_type: any, weightchargetype: any, boolean: any): void {
    this.createSeriesFromAC2(domainName, tempAC, event_type, weightchargetype, boolean);
  }

  bar_chart0(tempAC: any, event_type: any, weightchargetype: any, boolean: any): void {
    this.createSeriesFromAC_bar(tempAC, event_type, weightchargetype, boolean, '', '');
  }

  createSeriesFromAC2(
    _domainName: any,
    collection: any[],
    event_type: any,
    weightchargetype: any,
    boolean: any
  ): void {
    let chartData: any[] = [];

    if (collection?.length > 0) {
      const tempObj = collection[0];

      if (event_type === 'year') {
        chartData = [
          { weight: '1', value: tempObj.yearTotalOfVolumeBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.yearTotalOfVolumeBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.yearTotalOfVolumeBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.yearTotalOfVolumeBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearTotalOfVolumeBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.yearTotalOfVolumeBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.yearTotalOfVolumeBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.yearTotalOfVolumeBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.yearTotalOfVolumeBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.yearTotalOfVolumeBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.yearTotalOfVolumeBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.yearTotalOfVolumeBilledWeightAbove150forMonth12 ?? 0 }
        ];
      } else if (boolean === 1) {
        chartData = [
          { weight: '1', value: tempObj.yearAccountOfVolumeBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.yearAccountOfVolumeBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.yearAccountOfVolumeBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.yearAccountOfVolumeBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearAccountOfVolumeBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.yearAccountOfVolumeBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.yearAccountOfVolumeBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.yearAccountOfVolumeBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.yearAccountOfVolumeBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.yearAccountOfVolumeBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.yearAccountOfVolumeBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.yearAccountOfVolumeBilledWeightAbove150forMonth12 ?? 0 }
        ];
      } else if (boolean === 0) {
        chartData = [
          { weight: '1', value: tempObj.accountOfVolumeBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.accountOfVolumeBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.accountOfVolumeBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.accountOfVolumeBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.accountOfVolumeBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.accountOfVolumeBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.accountOfVolumeBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.accountOfVolumeBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.accountOfVolumeBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.accountOfVolumeBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.accountOfVolumeBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.accountOfVolumeBilledWeightAbove150forMonth12 ?? 0 }
        ];
      }
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
    categoryAxis.renderer.grid.template.location = 0;

    const labelTemplate = categoryAxis.renderer.labels.template;
    labelTemplate.rotation = 0;
    labelTemplate.dy = 10;
    labelTemplate.fontSize = 12;
    labelTemplate.inside = false;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.title.text = 'Count';
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.adapter.add('text', function (text) {
      return '$' + text;
    });
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'weight';
    series.name = 'Weight';
    series.tooltipText = 'Weight: [bold]{categoryX}[/]  \n Package Count: [bold]{valueY}';
    series.columns.template.fillOpacity = 0.8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    this.applyBarColors(series);
    this.applyDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }

  createSeriesFromAC_bar(
    collection: any[],
    event_type: any,
    weightchargetype: any,
    boolean: any,
    nameField: any,
    yField: any
  ): void {
    let chartData: any[] = [];

    if (collection?.length > 0) {
      const tempObj = collection[0];

      if (event_type === 'year') {
        chartData = [
          { weight: '1', value: tempObj.yearTotalOfAverageBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.yearTotalOfAverageBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.yearTotalOfAverageBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.yearTotalOfAverageBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearTotalOfAverageBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.yearTotalOfAverageBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.yearTotalOfAverageBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.yearTotalOfAverageBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.yearTotalOfAverageBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.yearTotalOfAverageBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.yearTotalOfAverageBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.yearTotalOfAverageBilledWeightAbove150forMonth12 ?? 0 }
        ];
      } else if (boolean === 1) {
        chartData = [
          { weight: '1', value: tempObj.yearAccountOfAverageBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.yearAccountOfAverageBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.yearAccountOfAverageBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.yearAccountOfAverageBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearAccountOfAverageBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.yearAccountOfAverageBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.yearAccountOfAverageBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.yearAccountOfAverageBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.yearAccountOfAverageBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.yearAccountOfAverageBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.yearAccountOfAverageBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.yearAccountOfAverageBilledWeightAbove150forMonth12 ?? 0 }
        ];
      } else if (boolean === 0) {
        chartData = [
          { weight: '1', value: tempObj.accountOfAverageBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.accountOfAverageBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.accountOfAverageBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.accountOfAverageBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.accountOfAverageBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.accountOfAverageBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.accountOfAverageBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.accountOfAverageBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.accountOfAverageBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.accountOfAverageBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.accountOfAverageBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.accountOfAverageBilledWeightAbove150forMonth12 ?? 0 }
        ];
      }
    }

    this.disposeChart(this.averageCostChart);
    this.averageCostChart = am4core.create('average_cost', am4charts.XYChart);

    const chart = this.averageCostChart;
    this.showIndicator(chart);
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
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.title.text = '$Value';
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.adapter.add('text', function (text) {
      return '$' + text;
    });
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'weight';
    series.name = 'Weight';
    series.tooltipText = 'Weight: [bold]{categoryX}[/]  \n Avg Cost: $ [bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.fillOpacity = 0.8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    this.applyBarColors(series);

    this.applyDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

    setTimeout(() => {
      if (chartData.length > 0) {
        this.hideIndicator();
      }
    }, 1000);
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
      hourglass?.animate(
        [
          {
            from: 0,
            to: 360,
            property: 'rotation'
          }
        ],
        2000
      );
    }, 3000);
  }

  hideIndicator(): void {
    this.indicator?.hide();
    clearInterval(this.indicatorInterval);
  }

  commoniter(): void {
    if (this.weightchargetype === 'INT_FRT' && this.typecode === 'IMP') {
      if (this.commonACSHP_FRT_IMP.length <= 5) {
        this.fromACC = 0;
        this.toACC = this.commonACSHP_FRT_IMP.length;
        this.previous_id_visible = false;
        this.first_id_visible = false;
        this.next_id_visible = false;
      } else {
        this.fromACC = 0;
        this.toACC = 5;
        this.next_id_visible = true;
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      this.common();
    }

    if (this.weightchargetype === 'INT_FRT' && this.typecode === 'EXP') {
      if (this.commonACSHP_FRT.length <= 5) {
        this.fromACC = 0;
        this.toACC = this.commonACSHP_FRT.length;
        this.previous_id_visible = false;
        this.first_id_visible = false;
        this.next_id_visible = false;
      } else {
        this.fromACC = 0;
        this.toACC = 5;
        this.next_id_visible = true;
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      this.common();
    }

    if (this.weightchargetype === 'INT+ACC' && this.typecode === 'EXP') {
      if (this.commonACSHP_FRT_ACC.length <= 5) {
        this.fromACC = 0;
        this.toACC = this.commonACSHP_FRT_ACC.length;
        this.previous_id_visible = false;
        this.first_id_visible = false;
        this.next_id_visible = false;
      } else {
        this.fromACC = 0;
        this.toACC = 5;
        this.next_id_visible = true;
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      this.common();
    }

    if (this.weightchargetype === 'INT+ACC' && this.typecode === 'IMP') {
      if (this.commonACSHP_FRT_ACC_IMP.length <= 5) {
        this.fromACC = 0;
        this.toACC = this.commonACSHP_FRT_ACC_IMP.length;
        this.previous_id_visible = false;
        this.first_id_visible = false;
        this.next_id_visible = false;
      } else {
        this.fromACC = 0;
        this.toACC = 5;
        this.next_id_visible = true;
        this.previous_id_visible = false;
        this.first_id_visible = false;
      }
      this.common();
    }
  }

  common(): void {
    this.commonAC = [];

    for (let count = this.fromACC; count < this.toACC; count++) {
      const tempobj: any = this.chart2AC[count];
      this.commonAC.push(tempobj);
    }

    if (this.flag === 1) {
      this.toACC = 0;
    }

    this.Acc_No(this.domain_Name, this.commonAC, this.event_type, this.weightchargetype, this.event_type);
  }

  bar_chart1(domainName: any, tempAC: any, event_type: any, weightchargetype: any, boolean: any): void {
    this.createSeriesFromAC1FedEx(domainName, tempAC, event_type, weightchargetype, boolean, 'Bar');
  }

  createSeriesFromAC1FedEx(
    domainName: any,
    collection: any[],
    event_type: any,
    weightchargetype: any,
    boolean: any,
    seriesName: any
  ): void {
    let chartData: any[] = [];

    if (collection?.length > 0) {
      const tempObj = collection[0];

      if (event_type === 'year') {
        chartData = [
          { weight: '1', value: tempObj.yearTotalOfBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.yearTotalOfBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.yearTotalOfBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.yearTotalOfBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearTotalOfBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.yearTotalOfBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.yearTotalOfBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.yearTotalOfBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.yearTotalOfBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.yearTotalOfBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.yearTotalOfBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.yearTotalOfBilledWeightAbove150forMonth12 ?? 0 }
        ];
      } else if (boolean === 1) {
        chartData = [
          { weight: '1', value: tempObj.yearAccountTotalOfBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.yearAccountTotalOfBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.yearAccountTotalOfBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.yearAccountTotalOfBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearTotalOfBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.yearAccountTotalOfBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.yearAccountTotalOfBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.yearAccountTotalOfBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.yearAccountTotalOfBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.yearAccountTotalOfBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.yearAccountTotalOfBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.yearAccountTotalOfBilledWeightAbove150forMonth12 ?? 0 }
        ];
      } else if (boolean === 0) {
        chartData = [
          { weight: '1', value: tempObj.accountTotalOfBilledWeight1forMonth1 ?? 0 },
          { weight: '2', value: tempObj.accountTotalOfBilledWeight2forMonth2 ?? 0 },
          { weight: '3', value: tempObj.accountTotalOfBilledWeight3forMonth3 ?? 0 },
          { weight: '4', value: tempObj.accountTotalOfBilledWeight4forMonth4 ?? 0 },
          { weight: '5', value: tempObj.yearTotalOfBilledWeight5forMonth5 ?? 0 },
          { weight: '6-10', value: tempObj.accountTotalOfBilledWeight6to10forMonth6 ?? 0 },
          { weight: '11-20', value: tempObj.accountTotalOfBilledWeight11to20forMonth7 ?? 0 },
          { weight: '21-30', value: tempObj.accountTotalOfBilledWeight21to30forMonth8 ?? 0 },
          { weight: '31-50', value: tempObj.accountTotalOfBilledWeight31to50forMonth9 ?? 0 },
          { weight: '51-70', value: tempObj.accountTotalOfBilledWeight51to70forMonth10 ?? 0 },
          { weight: '71-150', value: tempObj.accountTotalOfBilledWeight71to150forMonth11 ?? 0 },
          { weight: '151+', value: tempObj.accountTotalOfBilledWeightAbove150forMonth12 ?? 0 }
        ];
      }
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
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.title.text = '$Value';
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.adapter.add('text', function (text) {
      return '$' + text;
    });
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'weight';
    series.name = 'Weight';
    series.tooltipText = 'Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.fillOpacity = 0.8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color('#FFFFFF');
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    this.applyBarColors(series);
    this.applyDarkTheme(categoryAxis, valueAxis);

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }

  Spend_Month(tempAC: any, event_type: any, weightchargetype: any, boolean: any): void {
    this.createSeriesFromAC10(tempAC, event_type, weightchargetype, boolean, '', '');
  }

  createSeriesFromAC10(
    collection: any[],
    event_type: any,
    weightchargetype: any,
    boolean: any,
    nameField: any,
    yField: any
  ): void {
    const t202mnthObj: any = {};
    this.hashMapFRTObjData_EXP = new Map();
    this.hashMapFRTObjData_IMP = new Map();
    this.hashMapObjData_IMP = new Map();
    this.hashMapObjData_EXP = new Map();
    let chartData: any[] = [];

    if (collection?.length > 0) {
      const tempObj = collection[0];

      if (event_type === 'year') {
        chartData = [
          { Month: 'JAN', value: tempObj.yearTotalForMonth1 ?? 0 },
          { Month: 'FEB', value: tempObj.yearTotalForMonth2 ?? 0 },
          { Month: 'MAR', value: tempObj.yearTotalForMonth3 ?? 0 },
          { Month: 'APR', value: tempObj.yearTotalForMonth4 ?? 0 },
          { Month: 'MAY', value: tempObj.yearTotalForMonth5 ?? 0 },
          { Month: 'JUNE', value: tempObj.yearTotalForMonth6 ?? 0 },
          { Month: 'JULY', value: tempObj.yearTotalForMonth7 ?? 0 },
          { Month: 'AUG', value: tempObj.yearTotalForMonth8 ?? 0 },
          { Month: 'SEP', value: tempObj.yearTotalForMonth9 ?? 0 },
          { Month: 'OCT', value: tempObj.yearTotalForMonth10 ?? 0 },
          { Month: 'NOV', value: tempObj.yearTotalForMonth11 ?? 0 },
          { Month: 'DEC', value: tempObj.yearTotalForMonth12 ?? 0 }
        ];
      } else if (event_type === 'month' || boolean === 0) {
        if (this.month === '1') t202mnthObj['yearTotalForMonth1'] = tempObj.yearTotalForMonth1;
        if (this.month === '2') t202mnthObj['yearTotalForMonth2'] = tempObj.yearTotalForMonth2;
        if (this.month === '3') t202mnthObj['yearTotalForMonth3'] = tempObj.yearTotalForMonth3;
        if (this.month === '4') t202mnthObj['yearTotalForMonth4'] = tempObj.yearTotalForMonth4;
        if (this.month === '5') t202mnthObj['yearTotalForMonth5'] = tempObj.yearTotalForMonth5;
        if (this.month === '6') t202mnthObj['yearTotalForMonth6'] = tempObj.yearTotalForMonth6;
        if (this.month === '7') t202mnthObj['yearTotalForMonth7'] = tempObj.yearTotalForMonth7;
        if (this.month === '8') t202mnthObj['yearTotalForMonth8'] = tempObj.yearTotalForMonth8;
        if (this.month === '9') t202mnthObj['yearTotalForMonth9'] = tempObj.yearTotalForMonth9;
        if (this.month === '10') t202mnthObj['yearTotalForMonth10'] = tempObj.yearTotalForMonth10;
        if (this.month === '11') t202mnthObj['yearTotalForMonth11'] = tempObj.yearTotalForMonth11;
        if (this.month === '12') t202mnthObj['yearTotalForMonth12'] = tempObj.yearTotalForMonth12;

        chartData = [
          { Month: 'JAN', value: t202mnthObj['yearTotalForMonth1'] ?? 0 },
          { Month: 'FEB', value: t202mnthObj['yearTotalForMonth2'] ?? 0 },
          { Month: 'MAR', value: t202mnthObj['yearTotalForMonth3'] ?? 0 },
          { Month: 'APR', value: t202mnthObj['yearTotalForMonth4'] ?? 0 },
          { Month: 'MAY', value: t202mnthObj['yearTotalForMonth5'] ?? 0 },
          { Month: 'JUNE', value: t202mnthObj['yearTotalForMonth6'] ?? 0 },
          { Month: 'JULY', value: t202mnthObj['yearTotalForMonth7'] ?? 0 },
          { Month: 'AUG', value: t202mnthObj['yearTotalForMonth8'] ?? 0 },
          { Month: 'SEP', value: t202mnthObj['yearTotalForMonth9'] ?? 0 },
          { Month: 'OCT', value: t202mnthObj['yearTotalForMonth10'] ?? 0 },
          { Month: 'NOV', value: t202mnthObj['yearTotalForMonth11'] ?? 0 },
          { Month: 'DEC', value: t202mnthObj['yearTotalForMonth12'] ?? 0 }
        ];
      } else if (boolean === 1) {
        chartData = [
          { Month: 'JAN', value: tempObj.yearAccountTotalForMonth1 ?? 0 },
          { Month: 'FEB', value: tempObj.yearAccountTotalForMonth2 ?? 0 },
          { Month: 'MAR', value: tempObj.yearAccountTotalForMonth3 ?? 0 },
          { Month: 'APR', value: tempObj.yearAccountTotalForMonth4 ?? 0 },
          { Month: 'MAY', value: tempObj.yearAccountTotalForMonth5 ?? 0 },
          { Month: 'JUNE', value: tempObj.yearAccountTotalForMonth6 ?? 0 },
          { Month: 'JULY', value: tempObj.yearAccountTotalForMonth7 ?? 0 },
          { Month: 'AUG', value: tempObj.yearAccountTotalForMonth8 ?? 0 },
          { Month: 'SEP', value: tempObj.yearAccountTotalForMonth9 ?? 0 },
          { Month: 'OCT', value: tempObj.yearAccountTotalForMonth10 ?? 0 },
          { Month: 'NOV', value: tempObj.yearAccountTotalForMonth11 ?? 0 },
          { Month: 'DEC', value: tempObj.yearAccountTotalForMonth12 ?? 0 }
        ];
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
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.title.text = '$Value';
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.adapter.add('text', function (text) {
      return '$' + text;
    });
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = 'value';
    series.dataFields.categoryX = 'Month';
    series.tooltipText = 'Month: [bold]{categoryX}[/]  \n Net Charge: $[bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.strokeWidth = 0;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;
    series.columns.template.column.fillOpacity = 1;

    const hoverState = series.columns.template.column.states.create('hover');
    hoverState.properties.cornerRadiusTopLeft = 8;
    hoverState.properties.cornerRadiusTopRight = 8;
    hoverState.properties.fillOpacity = 0.8;

    this.applyBarColors(series);

    this.applyDarkTheme(categoryAxis, valueAxis);
    chart.cursor = new am4charts.XYCursor();
  }

  Acc_No(domainName: any, tempAC: any, event_type: any, weightchargetype: any, boolean: any): void {
    this.spendAccNumberChart(tempAC, event_type, boolean);
  }

  spendAccNumberChart(tempAC: any[], event_type: any, boolean: any): void {
    const t201AccountChartACValue: any[] = [];
    for (let count = this.fromAccCount; count < this.toAccCount; count++) {
      const t201DashObj = tempAC[count];
      t201AccountChartACValue.push(t201DashObj);
    }
    this.createSeriesFromAC21(t201AccountChartACValue, event_type, boolean);
  }

  createSeriesFromAC21(collection: any[], event_type: string, boolean: number): void {
    const chartData: any[] = [];

    if (collection != null && collection.length > 0) {
      for (let loop = 0; loop < collection.length; loop++) {
        const tempObj = collection[loop];
        const nameFiled = tempObj.accountNumber;

        let yField: any;
        if (event_type === 'year') {
          yField = tempObj.grandAccountLevelTotalForServiceLevel;
        } else if (event_type === 'month') {
          yField = tempObj.grandMonthAndAccountLevelTotalForServiceLevel;
        } else if (boolean === 1) {
          yField = tempObj.grandAccountLevelTotalForServiceLevel;
        } else if (boolean === 0) {
          yField = tempObj.grandMonthAndAccountLevelTotalForServiceLevel;
        }

        chartData.push({ name: nameFiled, points: yField ?? 0 });
      }
    }

    this.disposeChart(this.accNoChart);
    this.accNoChart = am4core.create('acc_no', am4charts.XYChart);

    const chart = this.accNoChart;
    chart.scrollbarX = new am4core.Scrollbar();
    chart.data = chartData;

    const minNegVal = this.hasNegativeValues(chartData);

    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.dataFields.category = 'name';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.cursorTooltipEnabled = false;
    valueAxis.title.text = '$ Value';
    valueAxis.title.fontWeight = 'bold';
    valueAxis.renderer.labels.template.adapter.add('text', function (text) {
      return '$' + text;
    });
    if (!minNegVal) {
      valueAxis.min = 0;
    }

    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = 'points';
    series.dataFields.categoryX = 'name';
    series.name = 'Account';
    series.columns.template.tooltipText =
      'Account Number: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber("#,###.00")}[/]';
    series.columns.template.fillOpacity = 1;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    this.applyDarkTheme(categoryAxis, valueAxis);
  }

  next_id_clickHandler(event: any): void {
    let tempto = this.toAccCount;
    tempto = tempto + 5;

    if (tempto < this.commonAC.length) {
      this.fromAccCount = this.toAccCount;
      this.toAccCount = this.toAccCount + 5;
    }

    if (tempto > this.commonAC.length) {
      this.fromAccCount = this.toAccCount;
      this.toAccCount += this.commonAC.length - this.toAccCount;
      this.next_id_visible = false;
    }

    if (tempto === this.commonAC.length) {
      this.fromAccCount = this.toAccCount;
      this.toAccCount = tempto;
    }

    this.previous_id_visible = true;
    this.first_id_visible = true;
    this.spendAccNumberChart(this.commonAC, this.event_type, this.boolean);
  }

  first_id_clickHandler(event: any): void {
    this.first_id_visible = false;
    this.previous_id_visible = false;
    this.next_id_visible = true;
    this.fromAccCount = 0;
    this.toAccCount = 5;
    this.spendAccNumberChart(this.commonAC, this.event_type, this.boolean);
  }

  previous_id_clickHandler(event: any): void {
    this.toAccCount = this.fromAccCount;
    this.fromAccCount = this.fromAccCount - 5;
    if (this.fromAccCount === 0) {
      this.previous_id_visible = false;
      this.first_id_visible = false;
    }
    this.next_id_visible = true;
    this.spendAccNumberChart(this.commonAC, this.event_type, this.boolean);
  }

  repostExcelDownload(event: any): void {
    const urlParam: any = {};
    const monthVal = this.moreviewChargeDescFormGroup.get('month')?.value;
    const clickedYear = this.moreviewChargeDescFormGroup.get('year')?.value;
    const chargeType = this.moreviewChargeDescFormGroup.get('chargeType')?.value;
    const clickedMonth = monthVal == null ? 0 : monthVal;
    const clientId = this.fromPage.t002ClientProfile.clientId;
    const accountNumber = this.moreviewChargeDescFormGroup.get('accountNumber')?.value;

    if (this.moreviewChargeDescFormGroup.get('chargeDescription')?.value === 'Ground Economy') {
      this.designFileName = 'International_Charge_Distribution_Report_SmartPost';
    } else {
      this.designFileName = 'International_Charge_Distribution_Report';
    }

    this.accountNumberVal = accountNumber === 'ALL' ? null : accountNumber;

    const currentDate = new Date();

    urlParam['createdDate'] = currentDate;
    urlParam['requesteddttm'] = currentDate;
    urlParam['reportName'] = this.designFileName;
    urlParam['reportType'] = 'International Charge Distribution Report';
    urlParam['reportFormat'] = 'excel';
    urlParam['accNo'] = this.accountNumberVal;
    urlParam['clientName'] = (this.userProfifleFedex.clientName).replace(/[^a-zA-Z0-9 ]/g, '');
    urlParam['clientId'] = clientId;
    urlParam['fromDate'] = clickedYear;
    urlParam['toDate'] = clickedMonth.toString();
    urlParam['loginId'] = 0;
    urlParam['modulename'] = 'Charge_Desc_Report';
    urlParam['status'] = 'IN QUEUE';
    urlParam['month'] = clickedMonth.toString();
    urlParam['year'] = clickedYear;
    urlParam['desc'] = '';
    urlParam['grp'] = '';
    urlParam['chargeType'] = chargeType;
    urlParam['chargeDesc'] = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
    urlParam['chargeGroup'] = this.chargeGroup;
    urlParam['t002ClientProfileobj'] = this.moreviewChargeDescFormGroup.get('t002ClientProfile')?.value;

    this.httpfedexService
      .runReport(urlParam)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.saveOrUpdateReportLogResult(result);
        },
        error: () => { }
      });
  }

  saveOrUpdateReportLogResult(result: any): void {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(
      result['t002ClientProfileobj']['clientId']
    );
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
    this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');
  }

  openModal(alertVal: any): void {
    this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }
}