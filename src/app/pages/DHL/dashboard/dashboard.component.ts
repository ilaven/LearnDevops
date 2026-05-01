import { Component, OnInit, Signal, signal, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ToastService } from './toast-service';
import { circle, latLng, tileLayer } from 'leaflet';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { CookiesService } from 'src/app/core/services/cookie.service';
import { FormControl, FormGroup } from '@angular/forms';
import { SwitchProjectService } from 'src/app/core/services/switchproject.service';
import { firstValueFrom, map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { DhlZonePopupComponent } from '../popup/dhl-zone-popup/dhl-zone-popup.component';
import { DhlMoreServicePopupComponent } from '../popup/dhl-more-service-popup/dhl-more-service-popup.component';
import { DhlWeightDistPopupComponent } from '../popup/dhl-weight-dist-popup/dhl-weight-dist-popup.component';
import { DhlChargeDescPopupComponent } from '../popup/dhl-charge-desc-popup/dhl-charge-desc-popup.component';
import { HttpDhlService } from 'src/app/core/services/httpdhl.service';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-dhl-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})

/**
 * Ecommerce Component
 */
export class DhlDashboardComponent implements OnInit {
  clientType: any;
  randomNumber: any;
  clientProfileFormGroup!: FormGroup;
  currentDate: any;
  selectedOption: any;
  toDate: any;
  fromDate: any;
  dates: any;
  searchForm: any;
  isLoading: any;
  userProfile: any[] = [];
  selectYear: any = [];
  domesticGroundService = signal<any>([]);
  showColumnPicker = false;
  SearchType = 'TrackingNumber';

  constructor(public toastService: ToastService, private commonService: CommonService,
    private httpDhlService: HttpDhlService,
    private dialog: MatDialog, private datePipe: DatePipe, private router: Router, private loaderService: LoaderService,
    private cookiesService: CookiesService, private switchProj: SwitchProjectService,) {
    this.cookiesService.carrierType.subscribe((clienttype: any) => {
      this.clientType = clienttype;
    });
    this.initForm();
  }

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
  initForm() {
    this.clientProfileFormGroup = new FormGroup({
      status: new FormControl('ACTIVE'),
      lazyLoad: new FormControl('N'),
      clientName: new FormControl(''),
      clientId: new FormControl(''),
      accNo: new FormControl('ALL'),
      accountNumber: new FormControl(null),
      year: new FormControl(''),
      month: new FormControl(null),
      invoiceMonth: new FormControl("1"),
      invoicemonth: new FormControl("1"),
      invoiceyear: new FormControl(""),
      groupby: new FormControl(""),
      group: new FormControl(""),
      chargetype: new FormControl(""),
      pointName: new FormControl(""),
      ipaddress: new FormControl(""),
      city: new FormControl(""),
      region: new FormControl(""),
      country: new FormControl(""),
      location: new FormControl(""),
      loginclientName: new FormControl(""),
      clientNameselected: new FormControl(""),
      fromDate: new FormControl(""),
      toDate: new FormControl(""),
      fromdate: new FormControl(""),
      todate: new FormControl(""),
      reportType: new FormControl(""),
      chargeDescription: new FormControl(""),
      services: new FormControl("")
    });
    this.dashBoardSHP = new FormGroup({
      chargetypevalue: new FormControl('FRT+ACC')
    });
    this.searchForm = new FormGroup({
      clientId: new FormControl(''),
      clientname: new FormControl(''),
      fromdate: new FormControl(''),
      todate: new FormControl(''),
      basisValue: new FormControl(''),
      searchDetail: new FormControl(''),
      receiverPostal: new FormControl(''),
      chargeSource: new FormControl(''),
      upsinternalUse: new FormControl(''),
      typeCode1: new FormControl(''),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      })
    });
    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
  }
  ngOnInit(): void {//Theme Style
    if (sessionStorage.getItem('toast')) {
      this.toastService.show('Logged in Successfull.', { classname: 'bg-success text-center text-white', delay: 5000 });
      sessionStorage.removeItem('toast');
    }
    // this._analyticsChart('["--vz-primary", "--vz-success", "--vz-danger"]');
    // this._SalesCategoryChart('["--vz-primary", "--vz-success", "--vz-warning", "--vz-danger", "--vz-info"]');
    //Theme Style

    this.initializeDefaults();
  }
  initializeDefaults() {

    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    this.selectedOption = 'ALL';
    var date = new Date();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var monthEndDay = new Date(date.getFullYear(), date.getMonth(), 0);
    var tempmonthStartDay = monthStartDay.toString();
    var tempmonthEndDay = monthEndDay.toString();
    //trackingDate
    this.toDate = new Date(tempmonthEndDay);
    this.fromDate = new Date(tempmonthStartDay);
    this.dates = { start: new Date(this.fromDate), end: new Date(this.toDate) };
    this.searchForm.patchValue({
      dateRange: {
        "start": new Date(this.fromDate), "end": new Date(this.toDate)
      },
      fromdate: this.fromDate,
      todate: this.toDate
    });


    // this.searchForm.get('todate').setValue(new Date(tempmonthEndDay));
    // this.searchForm.get('fromdate').setValue(new Date(tempmonthStartDay));
    this.initDashBoard();
    this.openLoading();

    var currentYear = new Date().getFullYear();
    var stYear = currentYear - 3;
    for (var yearloop = stYear; yearloop <= currentYear; yearloop++) {
      this.selectYear.push(yearloop);
    }
    this.cookiesService.getCookie('clientName').then((clientName: any) => {
      var clientName = clientName;
    });
    this.loadClientProfile();

  }
  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }
  /** Loads the dropdown values for admin users */
  loadClientProfile() {
    this.httpDhlService.loadDhlClientProfile(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          this.clientProfileList = result;
          this.closeLoading();
        },
        (error: any) => {
          console.error('Error loading client profile:', error);
        }
      );
  }
  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
  }
  async linkshpChange(data: string | null) {
    this.openLoading();

    this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
    this.bindingTitle();

    if (data === "FRT") {
      await this.linkfrt_clickHandler(data);
    } else if (data === "FRT+ACC" || data === null) {
      await this.linkfrtacc_clickHandler(data);
    }
  }
  chargeTitle: any;
  yearBindingTitle = signal<any>('');
  monthBindingTitle = signal<any>('');;
  frtaccBindingTitle = signal<any>('');;
  panelClass: any;
  async bindingTitle() {
    this.closeLoading();

    const yearData = this.clientProfileFormGroup.get('year')?.value;
    const monthData = this.clientProfileFormGroup.get('month')?.value;
    const chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;

    this.chargeTitle = chargeType;
    this.yearBindingTitle.set(yearData);

    if (monthData == null) {
      this.monthBindingTitle.set("");
    } else {
      const monthArray = [
        "All", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      this.monthBindingTitle.set(monthArray[monthData]);
    }

    this.frtaccBindingTitle.set(chargeType === "FRT" ? " ( FRT only )" : "");

    this.panelClass = this.themeoption === "dark"
      ? 'page-dark'
      : 'custom-dialog-panel-class';
  }
  chargetypevalue = signal<any>('');
  acclink_id_enabled: any;
  acclink_id_styleName: any;
  frtlink_id_styleName: any;
  frtlink_id_buttonMode: any;
  frtacc_btn_selected: any;
  frt_btn_selected: any;
  zoneflag: any;
  linkflag: any;
  totalspendAcValue: any;
  async linkfrt_clickHandler(event: string) {
    this.closeLoading();
    this.chargetypevalue.set(event);
    var chargetypevalue = await event;
    var clickedMonth = await this.clientProfileFormGroup.get('month')?.value;
    if (chargetypevalue == "FRT")
      this.acclink_id_enabled = true;
    this.acclink_id_styleName = "linkButton";
    this.frtlink_id_styleName = "backexpressNondoccolor";
    this.frtlink_id_buttonMode = true;
    this.frtacc_btn_selected = false;
    this.frt_btn_selected = true;
    this.zoneflag = 1;
    this.linkflag = 1;
    chargetypevalue = "FRT";
    if (clickedMonth == 0) {

    } else {
      var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
      var monthnumber = Number(clickedMonth);
    }
    await this.totalSpend(this.totalspendAcValue);
    await this.chargeBack_frtacc(this.chargebackfrtacc);
    if (clickedMonth == null) {
      await this.weight_Dis(this.weight_mainAC, "year")
    } else {
      await this.weight_Dis(this.weight_mainAC, "month")
    }
  }
  acclink_id_buttonMode: any;
  frtlink_id_enabled: any;
  chargePopupfrtaccAC: any;
  async linkfrtacc_clickHandler(event: string | null) {
    this.closeLoading();
    this.chargetypevalue.set(event);
    const chargetypevalue = event;
    if (chargetypevalue === "FRT+ACC" || chargetypevalue == null) {
      this.zoneflag = 0;
      this.linkflag = 0;
    }
    const clickedMonth = this.clientProfileFormGroup.get('month')?.value;
    // Month array setup if needed
    if (clickedMonth != null) {
      const monthArray = [
        "All", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthnumber = Number(clickedMonth);
    }
    this.acclink_id_buttonMode = true;
    this.frtlink_id_enabled = true;
    this.frtacc_btn_selected = true;
    this.frt_btn_selected = false;
    console.log(this.totalspendAcValue)
    await this.totalSpend(this.totalspendAcValue);
    await this.chargeBack_frtacc(this.chargebackfrtacc);
    await this.pie_chart(this.chargePopupfrtaccAC);

    if (clickedMonth == null) {
      await this.weight_Dis(this.weight_mainAC, "year");
    } else {
      await this.weight_Dis(this.weight_mainAC, "month");
    }
  }

  totalPackageCount = signal<any>(0);
  totalPackageCost = signal<any>(0);
  dataasof: any;
  dataasoffFormat: any;
  async totalSpend(resultObj: any) {
    var totSpend004AC = [];
    var arrayResult = [];
    this.totalPackageCount.set(0);
    this.totalPackageCost.set(0);
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    //-----------------------Total spend   
    var date = new Date();
    var day = date.getDay();
    var monthStartDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var monthlastdate: any = this.datePipe.transform(monthStartDay, "MM/dd/yyyy");
    this.dataasof = await this.userProfifle[0].dataasof;
    let dataValue: any = this.datePipe.transform(this.dataasof, "MM/dd/yyyy");
    this.dataasoffFormat = new Date(dataValue);
    var currentYear = (new Date()).getFullYear();
    var currentMonthSlt = this.datePipe.transform(monthStartDay, "MM/yyyy");
    var dataasofSlt = this.datePipe.transform(this.dataasof, "MM/yyyy");
    if (this.dataasof <= monthlastdate) {
      var selectedMonthFlog = true;
    } else {
      selectedMonthFlog = false;
    }


    for (var count = 0; count < resultObj.length; count++) {
      var t004Obj = resultObj[count];
      var testtotSpend004AC = resultObj;
      if (chargetypevalue == null) {
        this.chargetypevalue.set("FRT+ACC");
      }
      if (t004Obj.chargeType == chargetypevalue) {
        var year_Select = this.clientProfileFormGroup.get('year')?.value;
        var totcount = t004Obj.packageCount;
        this.totalPackageCount.update((v: any) => v + (Number(totcount) || 0));
        var totValue = t004Obj.netCharge;
        this.totalPackageCost.update((v: any) => v + (Number(totValue) || 0));
        if (t004Obj.month == "1") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "1",
              "Month": year_Select + "-01"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "01/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "1",
                "Month": year_Select + "-01",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "1",
                "Month": year_Select + "-01",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "2") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "2",
              "Month": year_Select + "-02",
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "02/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "2",
                "Month": year_Select + "-02",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "2",
                "Month": year_Select + "-02",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "3") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "3",
              "Month": year_Select + "-03"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "03/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "3",
                "Month": year_Select + "-03",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "3",
                "Month": year_Select + "-03",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "4") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "4",
              "Month": year_Select + "-04"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "04/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "4",
                "Month": year_Select + "-04",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "4",
                "Month": year_Select + "-04",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "5") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "5",
              "Month": year_Select + "-05"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "05/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "5",
                "Month": year_Select + "-05",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "5",
                "Month": year_Select + "-05",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "6") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "6",
              "Month": year_Select + "-06"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "06/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "6",
                "Month": year_Select + "-06",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "6",
                "Month": year_Select + "-06",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "7") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "7",
              "Month": year_Select + "-07"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "07/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "7",
                "Month": year_Select + "-07",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "7",
                "Month": year_Select + "-07",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }
        if (t004Obj.month == "8") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "8",
              "Month": year_Select + "-08"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "08/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "8",
                "Month": year_Select + "-08",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "8",
                "Month": year_Select + "-08",
                "Count": totcount,
                "NetAmount": totValue
              });
            }
          }
        }

        if (t004Obj.month == "9") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "9",
              "Month": year_Select + "-09"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "09/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "9",
                "Month": year_Select + "-09",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "9",
                "Month": year_Select + "-09",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "10") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "10",
              "Month": year_Select + "-10"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "10/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "10",
                "Month": year_Select + "-10",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "10",
                "Month": year_Select + "-10",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "11") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "11",
              "Month": year_Select + "-11"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "11/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "11",
                "Month": year_Select + "-11",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "11",
                "Month": year_Select + "-11",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }
        if (t004Obj.month == "12") {
          if (totcount == "0.00" && totValue == "0.00") {
            totSpend004AC.push({
              "MonthValue": "12",
              "Month": year_Select + "-12"
            });
          } else {
            if (selectedMonthFlog == true && dataasofSlt == "12/" + year_Select) {
              totSpend004AC.push({
                "MonthValue": "12",
                "Month": year_Select + "-12",
                "Count": totcount,
                "NetAmount": totValue,
                "dashLength": 8,
                "alpha": 0.4
              });
            } else {
              totSpend004AC.push({
                "MonthValue": "12",
                "Month": year_Select + "-12",
                "Count": totcount,
                "NetAmount": totValue
              });
            }

          }
        }

      }

    }
    const result = await totSpend004AC;
    arrayResult.push(result);
    this.totalSpendData(arrayResult);
  }
  async totalSpendData(resultData: any) {
    console.log("chartdiv", resultData);
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    // Dispose any existing chart to avoid duplicates
    const existingChart = am4core.registry.baseSprites.find((c: any) => c.htmlContainer && c.htmlContainer.id === "chartdiv");
    if (existingChart) {
      existingChart.dispose();
    }

    // Create chart instance
    const chart: am4charts.XYChart = am4core.create("chartdiv", am4charts.XYChart);
    chart.colors.step = 2;
    chart.maskBullets = false;

    // Compute AvgCost for each data point
    resultData[0].forEach((item: any) => {
      item.AvgCost = item.Count && Number(item.Count) !== 0
        ? item.NetAmount / item.Count
        : Number(item.NetAmount) !== 0 && Number(item.Count) === 0
          ? 0.00
          : null;
    });

    chart.data = resultData[0];

    // Check if there are any negative NetAmount values
    const minNegVal: boolean = resultData[0].some((item: any) => item.NetAmount < 0);

    // Create axes
    const dateAxis: am4charts.DateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.fullWidthTooltip = true;

    const distanceAxis: am4charts.ValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    distanceAxis.title.text = "Shipment Count";
    distanceAxis.renderer.grid.template.disabled = true;
    distanceAxis.renderer.opposite = true;
    distanceAxis.min = 0;

    const netAmountAxis: am4charts.ValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    netAmountAxis.title.text = "$ Net Charge";
    netAmountAxis.renderer.grid.template.disabled = true;
    netAmountAxis.renderer.opposite = false;
    if (!minNegVal) netAmountAxis.min = 0;
    netAmountAxis.renderer.labels.template.adapter.add("text", (text: any) => "$" + text);

    const avgCostAxis: am4charts.ValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    avgCostAxis.title.text = "Avg Cost / Package ($)";
    avgCostAxis.renderer.opposite = true;
    avgCostAxis.renderer.grid.template.disabled = true;
    avgCostAxis.min = 0;
    avgCostAxis.renderer.labels.template.adapter.add("text", (text: any) => "$" + text);

    // Net Charge (Column Series)
    const netChargeSeries: am4charts.ColumnSeries = chart.series.push(new am4charts.ColumnSeries());
    netChargeSeries.dataFields.valueY = "NetAmount";
    netChargeSeries.dataFields.dateX = "Month";
    netChargeSeries.yAxis = netAmountAxis;
    netChargeSeries.name = "Net Charge";
    netChargeSeries.columns.template.fillOpacity = 0.7;
    netChargeSeries.columns.template.propertyFields.strokeDasharray = "dashLength";
    netChargeSeries.columns.template.propertyFields.fillOpacity = "alpha";
    netChargeSeries.tooltipText = "Month: [bold]{dateX.formatDate('MMMM')}[/]\nNet Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
    netChargeSeries.tooltip!.autoTextColor = false;
    netChargeSeries.tooltip!.label.fill = am4core.color("#ffffff");

    const netChargeState = netChargeSeries.columns.template.states.create("hover");
    netChargeState.properties.fillOpacity = 0.9;

    // Shipment Count (Line Series)
    const shipmentCountSeries: am4charts.LineSeries = chart.series.push(new am4charts.LineSeries());
    shipmentCountSeries.dataFields.valueY = "Count";
    shipmentCountSeries.dataFields.dateX = "Month";
    shipmentCountSeries.yAxis = distanceAxis;
    shipmentCountSeries.name = "Shipment Count";
    shipmentCountSeries.strokeWidth = 2;
    shipmentCountSeries.propertyFields.strokeDasharray = "dashLength";
    shipmentCountSeries.tooltipText = "Month: [bold]{dateX.formatDate('MMMM')}[/]\nShipment Count: [bold]{valueY}[/]";
    shipmentCountSeries.tooltip!.autoTextColor = false;
    shipmentCountSeries.tooltip!.label.fill = am4core.color("#ffffff");

    const shipmentBullet: am4charts.CircleBullet = shipmentCountSeries.bullets.push(new am4charts.CircleBullet());
    shipmentBullet.circle.fill = am4core.color("#fff");
    shipmentBullet.circle.strokeWidth = 2;
    shipmentBullet.circle.propertyFields.radius = "townSize";
    const shipmentBulletHover = shipmentBullet.states.create("hover");
    shipmentBulletHover.properties.scale = 1.2;

    // Average Cost per Package (Line Series)
    const avgCostSeries: am4charts.LineSeries = chart.series.push(new am4charts.LineSeries());
    avgCostSeries.dataFields.valueY = "AvgCost";
    avgCostSeries.dataFields.dateX = "Month";
    avgCostSeries.yAxis = avgCostAxis;
    avgCostSeries.name = "Average Cost per Package";
    // avgCostSeries.stroke = am4core.color("#20A39E");
    avgCostSeries.stroke = am4core.color("#8e44ad");
    avgCostSeries.fill = am4core.color("#8e44ad");

    avgCostSeries.strokeWidth = 2;
    avgCostSeries.propertyFields.strokeDasharray = "dashLength";
    avgCostSeries.tooltipText = "Month: [bold]{dateX.formatDate('MMMM')}[/]\nAvg Cost: $ [bold]{valueY.formatNumber('#,##0.00')}[/]";
    avgCostSeries.tooltip!.autoTextColor = false;
    avgCostSeries.tooltip!.label.fill = am4core.color("#ffffff");

    const avgCostBullet: am4charts.CircleBullet = avgCostSeries.bullets.push(new am4charts.CircleBullet());
    avgCostBullet.circle.strokeWidth = 2;
    avgCostBullet.circle.stroke = am4core.color("#8e44ad");
    avgCostBullet.circle.fill = am4core.color("#ffffff");
    avgCostBullet.circle.propertyFields.radius = "townSize";

    // Legend
    chart.legend = new am4charts.Legend();
    dateAxis.cursorTooltipEnabled = false;
    netAmountAxis.cursorTooltipEnabled = false;
    distanceAxis.cursorTooltipEnabled = false;
    avgCostAxis.cursorTooltipEnabled = false;
    // Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineY.disabled = true;
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fillOpacity = 0.1;

    // Dark theme adjustments
    if (this.themeoption === "dark") {
      chart.cursor.lineX.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
      dateAxis.renderer.labels.template.fill = am4core.color("#fff");
      distanceAxis.renderer.labels.template.fill = am4core.color("#fff");
      netAmountAxis.renderer.labels.template.fill = am4core.color("#fff");
      avgCostAxis.renderer.labels.template.fill = am4core.color("#fff");

      distanceAxis.renderer.grid.template.stroke = am4core.color("#fff");
      dateAxis.renderer.grid.template.stroke = am4core.color("#fff");
      distanceAxis.renderer.grid.template.strokeOpacity = 1;
      netAmountAxis.renderer.grid.template.strokeOpacity = 1;
      distanceAxis.renderer.grid.template.strokeWidth = 1;

      distanceAxis.title.fill = am4core.color("#fff");
      netAmountAxis.title.fill = am4core.color("#fff");
      avgCostAxis.title.fill = am4core.color("#fff");
    }
  }

  async chargeBack_frtacc(chargebackfrtacc: any) {
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var chargeBack_result = chargebackfrtacc;
    var chargBacklength = chargeBack_result.length;
    if (chargBacklength != 0) {
      this.expressNondoc12 = 0.00;
      this.expressNondoc10 = 0.00;
      this.expressNondoc09 = 0.00;
      this.expressBreakBulk = 0.00;
      this.expressDomestic = 0.00;
      this.expressEnvelope = 0.00;
      this.expressWorldwide = 0.00;
      this.addresscorrection = 0.00;
      this.sameDay = 0.00;
      this.importExportDuties = 0.00;
      this.extendedAreaFee = 0.00;
      this.fuelSurcharge = 0.00;
      this.wrongAddressFee = 0.00;

      this.expressWorldwideprogressBar = 0.00;
      this.expressNondoc09ProgressBar = 0.00;
      this.expressNondoc10ProgressBar = 0.00;
      this.expressNondoc12ProgressBar = 0.00;
      this.expressDomesticProgressBar = 0.00;
      this.expressBreakBulkProgressBar = 0.00;
      this.expressEnvelopeProgressBar = 0.00;
      this.sameDayProgressBar = 0.00;
      this.progressBarDhlList = [];
      this.progressBarDhlList.push({ serviceType: 'EXPRESS WORLDWIDE', progressBar: this.expressWorldwideprogressBar, netCharge: this.expressWorldwide, serviceName: 'EXPRESS WORLDWIDE' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 9:00', progressBar: this.expressNondoc09ProgressBar, netCharge: this.expressNondoc09, serviceName: 'EXPRESS 9:00' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 10:30', progressBar: this.expressNondoc10ProgressBar, netCharge: this.expressNondoc10, serviceName: 'EXPRESS 10:30' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 12:00', progressBar: this.expressNondoc12ProgressBar, netCharge: this.expressNondoc12, serviceName: 'EXPRESS 12:00' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS DOMESTIC', progressBar: this.expressDomesticProgressBar, netCharge: this.expressDomestic, serviceName: 'EXPRESS DOMESTIC' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS BREAKBULK', progressBar: this.expressBreakBulkProgressBar, netCharge: this.expressBreakBulk, serviceName: 'EXPRESS BREAKBULK' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS ENVELOPE', progressBar: this.expressEnvelopeProgressBar, netCharge: this.expressEnvelope, serviceName: 'EXPRESS ENVELOPE' });
      this.progressBarDhlList.push({ serviceType: 'SAME DAY', progressBar: this.sameDayProgressBar, netCharge: this.sameDay, serviceName: 'SAME DAY' });
      this.domesticGroundService.set(this.progressBarDhlList);
      this.resetCharbackUI();
    }

    this.chargeDesList = [];
    this.maxValue = 0;


    if (chargeBack_result == null)
      return;

    if (chargeBack_result.length > 0) {
      for (var rymloop = 0; rymloop < chargeBack_result.length; rymloop++) {

        var chargeBackObj = chargeBack_result[rymloop];

        var totAmt = 0;


        if (chargetypevalue == "FRT+ACC")
          chargetypevalue = "FRT+ACC";
        if (chargeBackObj.chargeType == chargetypevalue) {
          totAmt = Number(chargeBackObj.netCharge);
          if (chargeBackObj.groupBy == "EXPRESS 12:00")
            if (Number.isNaN(totAmt)) {
              this.expressNondoc12 = 0.00;
            } else {
              this.expressNondoc12 = Number(totAmt);
            }
          if (chargeBackObj.groupBy == "EXPRESS 10:30")
            if (Number.isNaN(totAmt)) {
              this.expressNondoc10 = 0.00;
            } else {
              this.expressNondoc10 = Number(totAmt);
            }
          if (chargeBackObj.groupBy == "EXPRESS 9:00")
            if (Number.isNaN(totAmt)) {
              this.expressNondoc09 = 0.00;
            } else {
              this.expressNondoc09 = Number(totAmt);
            }


          if (chargeBackObj.groupBy == "EXPRESS BREAKBULK")
            if (Number.isNaN(totAmt)) {
              this.expressBreakBulk = 0.00;
            } else {
              this.expressBreakBulk = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "EXPRESS DOMESTIC")
            if (Number.isNaN(totAmt)) {
              this.expressDomestic = 0.00;
            } else {
              this.expressDomestic = Number(totAmt);
            }
          if (chargeBackObj.groupBy == "EXPRESS ENVELOPE")
            if (Number.isNaN(totAmt)) {
              this.expressEnvelope = 0.00;
            } else {
              this.expressEnvelope = Number(totAmt);
            }


          if (chargeBackObj.groupBy == "EXPRESS WORLDWIDE")
            if (Number.isNaN(totAmt)) {
              this.expressWorldwide = 0.00;
            } else {
              this.expressWorldwide = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "ADDRESS CORRECTION")
            if (Number.isNaN(totAmt)) {
              this.addresscorrection = 0.00;
            } else {
              this.addresscorrection = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Same Day")
            if (Number.isNaN(totAmt)) {
              this.sameDay = 0.00;
            } else {
              this.sameDay = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Declared Value")
            if (Number.isNaN(totAmt)) {
              this.importExportDuties = 0.00;
            } else {
              this.importExportDuties = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Extended Area Fee")
            if (Number.isNaN(totAmt)) {
              this.extendedAreaFee = 0.00;
            } else {
              this.extendedAreaFee = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "FUEL SURCHARGE")
            if (Number.isNaN(totAmt)) {
              this.fuelSurcharge = 0.00;
            } else {
              this.fuelSurcharge = Number(totAmt);
            }

          if (chargeBackObj.groupBy == "Wrong Address Fee")
            if (Number.isNaN(totAmt)) {
              this.wrongAddressFee = 0.00;
            } else {
              this.wrongAddressFee = Number(totAmt);
            }
        }
      }
      this.chargeDesList.push(this.expressNondoc12);
      this.chargeDesList.push(this.expressNondoc10);
      this.chargeDesList.push(this.expressNondoc09);
      this.chargeDesList.push(this.expressBreakBulk);
      this.chargeDesList.push(this.expressDomestic);
      this.chargeDesList.push(this.expressEnvelope);
      this.chargeDesList.push(this.expressWorldwide);
      this.chargeDesList.push(this.sameDay);
      this.chargeDesList.push(this.addresscorrection);
      this.chargeDesList.push(this.importExportDuties);
      this.chargeDesList.push(this.fuelSurcharge);
      this.maxVal = Math.max.apply(null, this.chargeDesList);
      this.maxValue = this.maxVal + this.maxVal / 10;
      var totMax: Number = this.maxValue / 8;
      this.expressNondoc12ProgressBar = await this.calcPercent(this.expressNondoc12, this.maxValue);
      this.expressNondoc10ProgressBar = await this.calcPercent(this.expressNondoc10, this.maxValue);
      this.expressNondoc09ProgressBar = await this.calcPercent(this.expressNondoc09, this.maxValue);
      this.expressBreakBulkProgressBar = await this.calcPercent(this.expressBreakBulk, this.maxValue);
      this.sameDayProgressBar = await this.calcPercent(this.sameDay, this.maxValue);
      this.expressEnvelopeProgressBar = await this.calcPercent(this.expressEnvelope, this.maxValue);
      this.expressDomesticProgressBar = await this.calcPercent(this.expressDomestic, this.maxValue);
      this.expressWorldwideprogressBar = await this.calcPercent(this.expressWorldwide, this.maxValue);
      this.fuelprogressBar = await this.calcPercent(this.fuelSurcharge, this.maxValue);
      this.importExportDutiesprogressBar = await this.calcPercent(this.importExportDuties, this.maxValue);
      this.chargeDesList["expressNondoc12"];
      this.chargeDesList["expressNondoc10"];
      this.chargeDesList["expressNondoc09"];
      this.chargeDesList["expressBreakBulk"];
      this.chargeDesList["expressDomestic"];
      this.chargeDesList["expressEnvelope"];
      this.chargeDesList["addresscorrection"];
      this.chargeDesList["expressWorldwide"];
      this.chargeDesList["fuelSurcharge"];
      this.chargeDesList["sameDay"];
      this.chargeDesList["importExportDuties"];
      this.progressBarDhlList = [];
      this.progressBarDhlList.push({ serviceType: 'EXPRESS WORLDWIDE', progressBar: this.expressWorldwideprogressBar, netCharge: this.expressWorldwide, serviceName: 'EXPRESS WORLDWIDE' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 9:00', progressBar: this.expressNondoc09ProgressBar, netCharge: this.expressNondoc09, serviceName: 'EXPRESS 9:00' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 10:30', progressBar: this.expressNondoc10ProgressBar, netCharge: this.expressNondoc10, serviceName: 'EXPRESS 10:30' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 12:00', progressBar: this.expressNondoc12ProgressBar, netCharge: this.expressNondoc12, serviceName: 'EXPRESS 12:00' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS DOMESTIC', progressBar: this.expressDomesticProgressBar, netCharge: this.expressDomestic, serviceName: 'EXPRESS DOMESTIC' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS BREAKBULK', progressBar: this.expressBreakBulkProgressBar, netCharge: this.expressBreakBulk, serviceName: 'EXPRESS BREAKBULK' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS ENVELOPE', progressBar: this.expressEnvelopeProgressBar, netCharge: this.expressEnvelope, serviceName: 'EXPRESS ENVELOPE' });
      this.progressBarDhlList.push({ serviceType: 'SAME DAY', progressBar: this.sameDayProgressBar, netCharge: this.sameDay, serviceName: 'SAME DAY' });
      this.progressBarDhlList.sort((a: any, b: any) => b.netCharge - a.netCharge);
      this.domesticGroundService.set(this.progressBarDhlList);
    }
  }

  async weight_Dis(arrayAC: any[], event_type: string) {
    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value ?? "FRT+ACC";
    await this.weight_chart(arrayAC, chargetypevalue, event_type, "Bar");
  }

  async weight_chart(
    tempAC: any[],
    chargetypevalue: string,
    event_type: string,
    field1: string
  ) {
    await this.createSeriesFromAC(tempAC, chargetypevalue, event_type, field1);
    await this.createSeriesFromACKgs(tempAC, chargetypevalue, event_type, field1);
  }
  clickedYear: any;
  weight_disTotalvalue = signal<any>('');
  weight_disTotalvalueKgs = signal<any>('');
  async createSeriesFromAC(
    collectionAC: any,
    chargetypevalue: String,
    event_type: String,
    seriesName: string | null = null,
    type: string | null = null,
    palette = "Default"
  ) {
    this.clickedYear = await this.clientProfileFormGroup.get('year')?.value;

    if (!collectionAC || collectionAC.length === 0) return;

    // Select the proper object based on charge type
    let tempObj;
    if (chargetypevalue === "FRT") {
      tempObj = collectionAC[0];
    } else if (chargetypevalue === "FRT+ACC" || chargetypevalue == null) {
      tempObj = collectionAC[1];
    }

    if (!tempObj) return;

    // Define weight labels and corresponding object keys
    const weightLabels = ["1", "2", "3", "4", "5", "6-10", "11-20", "21-30", "31-50", "51-70", "71-150", "150+"];
    const chargeKeys = [
      "netCharge1Lbs", "netCharge2Lbs", "netCharge3Lbs", "netCharge4Lbs",
      "netCharge5Lbs", "netCharge6to10Lbs", "netCharge11to20Lbs", "netCharge21to30Lbs",
      "netCharge31to50Lbs", "netCharge51to70Lbs", "netCharge71to150Lbs", "netCharge150PlusLbs"
    ];

    // Build chart data dynamically and calculate total
    const chartData = chargeKeys.map((key, index) => ({
      weight: weightLabels[index],
      value: Number(tempObj[key] || 0)
    }));

    this.weight_disTotalvalue.set(chartData.reduce((sum, item) => sum + item.value, 0));

    // Initialize chart
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    // Dispose any existing chart to avoid duplicates
    const existingChart = am4core.registry.baseSprites.find((c: any) => c.htmlContainer && c.htmlContainer.id === "weight_dis");
    if (existingChart) {
      existingChart.dispose();
    }

    const chart = am4core.create("weight_dis", am4charts.XYChart);
    chart.data = chartData;
    chart.padding(10, 10, 10, 10);

    // Detect negative values
    const minNegVal = chartData.some(item => item.value < 0);

    // Create axes
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "weight";
    categoryAxis.renderer.labels.template.rotation = 0;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "middle";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.cursorTooltipEnabled = false;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.visible = false;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.title.text = "$ Net Charge";
    valueAxis.title.fontWeight = "bold";
    valueAxis.renderer.labels.template.adapter.add("text", text => "$" + text);
    valueAxis.cursorTooltipEnabled = false;
    if (!minNegVal) valueAxis.min = 0;

    const barColors = [
      '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
      '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
      '#E07877', '#E09776', '#F4C5B0', '#F3B777',
      '#F5C7A0', '#F6D3B8'
    ];
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "weight";
    series.name = seriesName || "Weight";
    series.tooltipText = "Weight: [bold]{categoryX}[/]\nNet Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
    series.columns.template.fillOpacity = 1;
    series.tooltip!.autoTextColor = false;
    series.tooltip!.label.fill = am4core.color("#ffffff");
    series.columns.template.column.cornerRadiusTopLeft = 8;
    series.columns.template.column.cornerRadiusTopRight = 8;

    const columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 0;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    // columnTemplate.adapter.add("fill", (fill, target: any) => chart.colors.getIndex(target.dataItem.index));
    // columnTemplate.adapter.add("stroke", (stroke, target: any) => chart.colors.getIndex(target.dataItem.index));

    series.columns.template.adapter.add('fill', (_: any, target: any) => {
      return am4core.color(barColors[target.dataItem.index % barColors.length]);
    });
    // Dark mode styling
    if (this.themeoption === "dark") {
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
      valueAxis.renderer.grid.template.strokeWidth = 2;
    }

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
  }
  async createSeriesFromACKgs(
    collectionAC: any,
    chargetypevalue: String,
    event_type: String,
    seriesName: string | null = null,
    type: string | null = null,
    palette = "Default"
  ) {
    let totalValue = 0;
    this.clickedYear = await this.clientProfileFormGroup.get('year')?.value;

    if (collectionAC.length > 0) {
      let tempObj;
      if (chargetypevalue === "FRT") {
        tempObj = collectionAC[0];
      } else if (chargetypevalue === "FRT+ACC" || chargetypevalue == null) {
        tempObj = collectionAC[1];
      }

      if (tempObj) {
        const chartData = [
          { weight: "1", value: tempObj.netCharge1Kgs },
          { weight: "2", value: tempObj.netCharge2Kgs },
          { weight: "3", value: tempObj.netCharge3Kgs },
          { weight: "4", value: tempObj.netCharge4Kgs },
          { weight: "5", value: tempObj.netCharge5Kgs },
          { weight: "6-10", value: tempObj.netCharge6to10Kgs },
          { weight: "11-20", value: tempObj.netCharge11to20Kgs },
          { weight: "21-30", value: tempObj.netCharge21to30Kgs },
          { weight: "31-50", value: tempObj.netCharge31to50Kgs },
          { weight: "51-70", value: tempObj.netCharge51to70Kgs },
          { weight: "71-150", value: tempObj.netCharge71to150Kgs },
          { weight: "150+", value: tempObj.netCharge150PlusKgs }
        ];

        totalValue += Number(tempObj.netCharge1Kgs);
        totalValue += Number(tempObj.netCharge2Kgs);
        totalValue += Number(tempObj.netCharge3Kgs);
        totalValue += Number(tempObj.netCharge4Kgs);
        totalValue += Number(tempObj.netCharge5Kgs);
        totalValue += Number(tempObj.netCharge6to10Kgs);
        totalValue += Number(tempObj.netCharge11to20Kgs);
        totalValue += Number(tempObj.netCharge21to30Kgs);
        totalValue += Number(tempObj.netCharge31to50Kgs);
        totalValue += Number(tempObj.netCharge51to70Kgs);
        totalValue += Number(tempObj.netCharge71to150Kgs);
        totalValue += Number(tempObj.netCharge150PlusKgs);

        this.weight_disTotalvalueKgs.set(totalValue);

        // Initialize chart
        am4core.useTheme(am4themes_animated);
        am4core.options.commercialLicense = true;

        // Dispose any existing chart to avoid duplicates
        const existingChart = am4core.registry.baseSprites.find((c: any) => c.htmlContainer && c.htmlContainer.id === "weight_disKgs");
        if (existingChart) {
          existingChart.dispose();
        }

        let chart = am4core.create("weight_disKgs", am4charts.XYChart);
        chart.data = chartData;

        // Check for negative values
        const minNegVal = chartData.some(item => item.value < 0);

        // Create axes
        const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "weight";
        categoryAxis.renderer.labels.template.rotation = 0;
        categoryAxis.renderer.labels.template.hideOversized = false;
        categoryAxis.renderer.minGridDistance = 20;
        categoryAxis.renderer.labels.template.horizontalCenter = "middle";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.cursorTooltipEnabled = false;
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.grid.template.visible = false;

        const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.title.text = "$ Net Charge";
        valueAxis.title.fontWeight = "bold";
        valueAxis.renderer.labels.template.adapter.add("text", text => "$" + text);
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.renderer.grid.template.disabled = true;

        if (!minNegVal) valueAxis.min = 0;

        const barColors = [
          '#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
          '#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
          '#E07877', '#E09776', '#F4C5B0', '#F3B777',
          '#F5C7A0', '#F6D3B8'
        ];
        // Create series
        const series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "value";
        series.dataFields.categoryX = "weight";
        series.name = "Weight";
        series.tooltipText = "Weight: [bold]{categoryX}[/]\nNet Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
        series.columns.template.fillOpacity = 1;
        series.tooltip!.autoTextColor = false;
        series.tooltip!.label.fill = am4core.color("#ffffff");
        series.columns.template.column.cornerRadiusTopLeft = 8;
        series.columns.template.column.cornerRadiusTopRight = 8;

        const columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;
        columnTemplate.stroke = am4core.color("#FFFFFF");
        // columnTemplate.adapter.add("fill", (fill, target: any) => chart.colors.getIndex(target.dataItem.index));
        // columnTemplate.adapter.add("stroke", (stroke, target: any) => chart.colors.getIndex(target.dataItem.index));
        columnTemplate.adapter.add('fill', (_: any, target: any) => {
          return am4core.color(barColors[target.dataItem.index % barColors.length]);
        })
        // Dark mode styling
        if (this.themeoption === "dark") {
          categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
          valueAxis.title.fill = am4core.color("#fff");
          valueAxis.renderer.labels.template.fill = am4core.color("#fff");
          valueAxis.renderer.grid.template.strokeOpacity = 1;
          valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
          valueAxis.renderer.grid.template.strokeWidth = 2;
        }

        // Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.lineX.strokeOpacity = 0;
        chart.cursor.lineY.strokeOpacity = 0;
      }
    }
  }
  highestItem: any;
  pipe_chartData: any;
  async pie_chart(tempAC: any) {
    console.log("container_individual", tempAC);
    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.pipe_chartData = [];

    if (tempAC.length > 0) {
      for (const pie_Obj of tempAC) {
        if (pie_Obj.chargeType === "FRT" || pie_Obj.chargeType === "ACC") {
          this.pipe_chartData.push({
            "serviceName": pie_Obj.groupBy,
            "rateVal": pie_Obj.netCharge
          });
        }
      }
    }
    if (this.pipe_chartData.length > 0) {
      setTimeout(() => {
        this.highestItem = this.pipe_chartData.reduce((max: { rateVal: any; }, item: { rateVal: any; }) =>
          Number(item.rateVal) > Number(max.rateVal) ? item : max
        );
      }, 0);
    }

    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    // Dispose any existing chart to avoid duplicates
    const existingChart = am4core.registry.baseSprites.find((c: any) => c.htmlContainer && c.htmlContainer.id === "container_individual");
    if (existingChart) {
      existingChart.dispose();
    }

    // Create chart instance
    const chart = am4core.create("container_individual", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0;

    chart.legend = new am4charts.Legend();
    chart.legend.disabled = true;
    chart.data = this.pipe_chartData;

    const series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "rateVal";
    series.dataFields.category = "serviceName";

    series.alignLabels = false;
    series.slices.template.strokeWidth = 2;
    series.slices.template.strokeOpacity = 1;
    series.ticks.template.disabled = false;
    series.labels.template.disabled = true;
    series.labels.template.adapter.add('text', function (_: any, target: any) {
      const percent = target.dataItem?.values?.value?.percent;
      return percent !== undefined ? `${Math.round(percent)}` : '';
    });
    series.labels.template.fontSize = 14;
    series.labels.template.fill = am4core.color('#333');
    series.labels.template.radius = am4core.percent(-30);

    series.ticks.template.disabled = true;
    series.slices.template.tooltipText = "{category}: $[bold]{value.formatNumber('#,###.00')}[/]";
    series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    series.colors.list = [
      am4core.color('#BED5FF'),
      am4core.color('#A0E2FE'),
      am4core.color('#9CEFE5'),
      am4core.color('#D7BBEA'),
      am4core.color('#FFC9C9'),
      am4core.color('#FFD4A9'),
      am4core.color('#ffdb6d'),
      am4core.color('#9ccb66'),
      am4core.color('#796448')
    ];
    series.tooltip!.autoTextColor = false;
    series.tooltip!.label.fill = am4core.color("#000");
    series.slices.template.stroke = am4core.color("#ffffff");
    series.slices.template.strokeWidth = 1;
    series.slices.template.strokeOpacity = 1;
    series.slices.template.events.on("hit", (ev) => {
      const category = ev.target.dataItem?.dataContext;
      const categoryName = category; // currently just storing the object
    });
  }

  userProfifle: any[] = [];
  clientID: any;
  clientName: any;
  themeoption: any;
  currentyear: any;
  year_Select: any;
  month_Select: any;
  accountNumber: any;
  async initDashBoard() {


    this.userProfifle = await this.getuserProfile();
    if (this.userProfifle) {
      this.clientID = this.userProfifle[0].clientId;
      this.clientName = this.userProfifle[0].clientName;
      const clientName = this.userProfifle[0].clientName;
    }


    this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);

    await this.fetchaccountDetailsOntrac();

    this.themeoption = await this.cookiesService.getCookie('themeOption');

    let yearData: number;

    if (this.clientProfileFormGroup.get('year')?.value == "") {

      const date = new Date();

      if (date.getMonth() == 0 || (date.getMonth() == 1 && date.getDate() <= 5)) {
        yearData = new Date().getFullYear() - 1;
      } else {
        yearData = new Date().getFullYear();
      }

    } else {
      yearData = this.clientProfileFormGroup.get('year')?.value;
    }

    let monthdData: any;

    if (this.clientProfileFormGroup.get('month')?.value == null ||
      this.clientProfileFormGroup.get('month')?.value == '') {
      monthdData = null;
    } else {
      monthdData = this.clientProfileFormGroup.get('month')?.value;
    }

    this.currentyear = yearData;

    this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
    this.clientProfileFormGroup.get('clientName')?.setValue(this.clientName);
    this.clientProfileFormGroup.get('year')?.setValue(yearData);
    this.clientProfileFormGroup.get('invoiceyear')?.setValue(yearData);

    this.year_Select = this.clientProfileFormGroup.get('year')?.value;
    this.month_Select = this.clientProfileFormGroup.get('month')?.value;

    this.clientProfileFormGroup.get('month')?.setValue(monthdData);

    if (this.accountNumber == null) {
      this.clientProfileFormGroup.get('accountNumber')?.setValue(null);
    }

    this.httpDhlService.fetchTopChart(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          this.fetchDataOntrac(result);
        },
        (error: any) => {
          console.log('error ', error);
        }
      );

    await this.fetchdashboardservices();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();
  }
  totSpend004AC: any
  async fetchdashboardservices() {

    this.httpDhlService.fetchTotalSpendChart(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          this.totalspendAcValue = result;
          this.totalSpend(result);
        },
        (error: any) => {
          console.log('error ', error);
        }
      );

    this.httpDhlService.fetchDashBoard(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          this.totSpend004AC = result;
          this.fetchWeightDistribution_Result(result);
        },
        (error: any) => {
          console.log('error ', error);
        }
      );
  }
  t004reymax_by_year_resultAC: any;
  weight_mainAC: any;
  async fetchWeightDistribution_Result(event: any) {
    this.year_Select = this.clientProfileFormGroup.get('year')?.value;
    this.t004reymax_by_year_resultAC = await event;

    if (this.t004reymax_by_year_resultAC && this.t004reymax_by_year_resultAC.length > 0) {
      const typeObject = { ServiceType: "year" };
      this.t004reymax_by_year_resultAC.push(typeObject);

      this.weight_mainAC = this.t004reymax_by_year_resultAC;
      await this.weight_Dis(this.t004reymax_by_year_resultAC, "year");
    } else {
      this.t004reymax_by_year_resultAC = [];
      await this.weight_Dis(this.t004reymax_by_year_resultAC, "year");
    }

    this.bindingTitle();
  }

  async fetchServicesPieChart() {
    this.httpDhlService.fetchServicesPieChart(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          this.chargePopupfrtaccAC = result;
          this.pie_chart(result);
        },
        (error: any) => {
          // optionally log error
        }
      );
  }
  resultData = signal<any>([]);
  async fetchDataOntrac(result: any) {
    this.resultData.set([]);

    if (result.length > 0) {
      const t004Obj = result[1];

      const t004DashBoardCYObj: any = {};
      const monthflog = this.clientProfileFormGroup.get('month')?.value;

      t004DashBoardCYObj["netCharge"] = t004Obj.netCharge;
      t004DashBoardCYObj["netChargeFRT"] = t004Obj.netChargeFRT;
      t004DashBoardCYObj["costPerPackage"] = t004Obj.costPerPackage;
      t004DashBoardCYObj["costPerPackageFRT"] = t004Obj.costPerPackageFRT;
      t004DashBoardCYObj["averageWeightPerPackageLbs"] = t004Obj.averageWeightPerPackageLbs;
      t004DashBoardCYObj["averageWeightPerPackageKgs"] = t004Obj.averageWeightPerPackageKgs;
      t004DashBoardCYObj["billedWeightKgs"] = t004Obj.billedWeightKgs;
      t004DashBoardCYObj["billedWeightLbs"] = t004Obj.billedWeightLbs;
      t004DashBoardCYObj["costPerKg"] = t004Obj.costPerKg;
      t004DashBoardCYObj["costPerLb"] = t004Obj.costPerLb;
      t004DashBoardCYObj["packageCount"] = t004Obj.packageCount;
      t004DashBoardCYObj["totalPieces"] = t004Obj.totalPieces;

      this.resultData.set(t004DashBoardCYObj);
    } else {
      this.openModal("No Record Found");
      this.closeLoading();
      return;
    }
  }

  resultObj: any;
  chargeBack_result: any;
  chargebackfrtacc: any;
  dashBoardSHP!: FormGroup;
  async fetchProgressServices() {
    this.httpDhlService.fetchGroupedServicesChart(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          this.resultObj = result;
          this.fetchByServices_result(result);
        },
        (error: any) => {
          // optionally log error
        }
      );
  }
  expressNondoc12: any;
  expressNondoc10: any;
  expressNondoc09: any;

  expressBreakBulk: any;
  expressDomestic: any;
  expressEnvelope: any;
  expressWorldwide: any;
  sameDay: any;

  addresscorrection: any;
  importExportDuties: any;
  extendedAreaFee: any;
  fuelSurcharge: any;
  wrongAddressFee: any;

  // Progress Bars
  expressWorldwideprogressBar: any;
  expressNondoc09ProgressBar: any;
  expressNondoc10ProgressBar: any;
  expressNondoc12ProgressBar: any;
  expressDomesticProgressBar: any;
  expressBreakBulkProgressBar: any;
  expressEnvelopeProgressBar: any;
  sameDayProgressBar: any;

  chargeDesList: any;
  maxValue: any;

  // Progress Bar List
  progressBarDhlList: any;
  maxVal: any;
  fuelprogressBar: any;
  importExportDutiesprogressBar: any;
  addresscorrectionprogressBar: any;
  fetchaccountDetailsStr: any;
  async fetchByServices_result(event: any) {
    var chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;
    this.chargeBack_result = event;
    this.chargebackfrtacc = await this.chargeBack_result;
    var chargBacklength = 0;
    if (this.chargeBack_result != null && this.chargeBack_result.length > 0) {
      chargBacklength = this.chargeBack_result.length;
    }
    this.resetCharbackUI();
    this.expressNondoc12 = 0.00;
    this.expressNondoc10 = 0.00;
    this.expressNondoc09 = 0.00;
    this.expressBreakBulk = 0.00;
    this.expressDomestic = 0.00;
    this.expressEnvelope = 0.00;
    this.expressWorldwide = 0.00;
    this.addresscorrection = 0.00;
    this.sameDay = 0.00;
    this.importExportDuties = 0.00;
    this.extendedAreaFee = 0.00;
    this.fuelSurcharge = 0.00;
    this.wrongAddressFee = 0.00;

    if (chargBacklength == 0) {
      this.expressNondoc12 = 0.00;
      this.expressNondoc10 = 0.00;
      this.expressNondoc09 = 0.00;
      this.expressBreakBulk = 0.00;
      this.expressDomestic = 0.00;
      this.expressEnvelope = 0.00;
      this.expressWorldwide = 0.00;
      this.addresscorrection = 0.00;
      this.sameDay = 0.00;
      this.importExportDuties = 0.00;
      this.extendedAreaFee = 0.00;
      this.fuelSurcharge = 0.00;
      this.wrongAddressFee = 0.00;
      this.expressWorldwideprogressBar = 0.00;
      this.expressNondoc09ProgressBar = 0.00;
      this.expressNondoc10ProgressBar = 0.00;
      this.expressNondoc12ProgressBar = 0.00;
      this.expressDomesticProgressBar = 0.00;
      this.expressBreakBulkProgressBar = 0.00;
      this.expressEnvelopeProgressBar = 0.00;
      this.sameDayProgressBar = 0.00;
      this.progressBarDhlList = [];
      this.progressBarDhlList.push({ serviceType: 'EXPRESS WORLDWIDE', progressBar: this.expressWorldwideprogressBar, netCharge: this.expressWorldwide, serviceName: 'EXPRESS WORLDWIDE' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 9:00', progressBar: this.expressNondoc09ProgressBar, netCharge: this.expressNondoc09, serviceName: 'EXPRESS 9:00' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 10:30', progressBar: this.expressNondoc10ProgressBar, netCharge: this.expressNondoc10, serviceName: 'EXPRESS 10:30' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS 12:00', progressBar: this.expressNondoc12ProgressBar, netCharge: this.expressNondoc12, serviceName: 'EXPRESS 12:00' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS DOMESTIC', progressBar: this.expressDomesticProgressBar, netCharge: this.expressDomestic, serviceName: 'EXPRESS DOMESTIC' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS BREAKBULK', progressBar: this.expressBreakBulkProgressBar, netCharge: this.expressBreakBulk, serviceName: 'EXPRESS BREAKBULK' });
      this.progressBarDhlList.push({ serviceType: 'EXPRESS ENVELOPE', progressBar: this.expressEnvelopeProgressBar, netCharge: this.expressEnvelope, serviceName: 'EXPRESS ENVELOPE' });
      this.progressBarDhlList.push({ serviceType: 'SAME DAY', progressBar: this.sameDayProgressBar, netCharge: this.sameDay, serviceName: 'SAME DAY' });
      this.domesticGroundService.set(this.progressBarDhlList);
      this.resetCharbackUI();
    }
    this.chargeDesList = [];
    this.maxValue = 0;
    if (this.chargeBack_result.length > 0) {
      for (var rymloop = 0; rymloop < this.chargeBack_result.length; rymloop++) {
        var chargeBackObj = this.chargeBack_result[rymloop];
        var totAmt = 0;
        if (chargetypevalue == "FRT+ACC")
          chargetypevalue = null;
        if (chargeBackObj.netCharge != null) {
          totAmt = Number(chargeBackObj.netCharge);
        }
        if (chargeBackObj.groupBy == "EXPRESS 12:00")
          if (Number.isNaN(totAmt)) {
            this.expressNondoc12 = 0.00;
          } else {
            this.expressNondoc12 = Number(totAmt);
          }
        if (chargeBackObj.groupBy == "EXPRESS 10:30")
          if (Number.isNaN(totAmt)) {
            this.expressNondoc10 = 0.00;
          } else {
            this.expressNondoc10 = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "EXPRESS 9:00")
          if (Number.isNaN(totAmt)) {
            this.expressNondoc09 = 0.00;
          } else {
            this.expressNondoc09 = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "EXPRESS BREAKBULK")
          if (Number.isNaN(totAmt)) {
            this.expressBreakBulk = 0.00;
          } else {
            this.expressBreakBulk = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "EXPRESS DOMESTIC")
          if (Number.isNaN(totAmt)) {
            this.expressDomestic = 0.00;
          } else {
            this.expressDomestic = Number(totAmt);
          }
        if (chargeBackObj.groupBy == "EXPRESS ENVELOPE")
          if (Number.isNaN(totAmt)) {
            this.expressEnvelope = 0.00;
          } else {
            this.expressEnvelope = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "EXPRESS WORLDWIDE")
          if (Number.isNaN(totAmt)) {
            this.expressWorldwide = 0.00;
          } else {
            this.expressWorldwide = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "ADDRESS CORRECTION")
          if (Number.isNaN(totAmt)) {
            this.addresscorrection = 0.00;
          } else {
            this.addresscorrection = Number(totAmt);
          }


        if (chargeBackObj.groupBy == "IMPORT EXPORT DUTIES & TAXES")
          if (Number.isNaN(totAmt)) {
            this.importExportDuties = 0.00;
          } else {
            this.importExportDuties = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "SAME DAY")
          if (Number.isNaN(totAmt)) {
            this.sameDay = 0.00;
          } else {
            this.sameDay = Number(totAmt);
          }

        if (chargeBackObj.groupBy == "FUEL SURCHARGE")
          if (Number.isNaN(totAmt)) {
            this.fuelSurcharge = 0.00;
          } else {
            this.fuelSurcharge = Number(totAmt);
          }

      }
    }
    this.chargeDesList.push(this.expressNondoc12);
    this.chargeDesList.push(this.expressNondoc10);
    this.chargeDesList.push(this.expressNondoc09);
    this.chargeDesList.push(this.expressBreakBulk);
    this.chargeDesList.push(this.expressDomestic);
    this.chargeDesList.push(this.expressEnvelope);
    this.chargeDesList.push(this.expressWorldwide);
    this.chargeDesList.push(this.sameDay);
    this.chargeDesList.push(this.addresscorrection);
    this.chargeDesList.push(this.importExportDuties);
    this.chargeDesList.push(this.fuelSurcharge);
    this.maxVal = Math.max.apply(null, this.chargeDesList);
    this.maxValue = this.maxVal + this.maxVal / 10;
    var totMax: Number = this.maxValue / 8;
    this.expressNondoc12ProgressBar = await this.calcPercent(this.expressNondoc12, this.maxValue);
    this.expressNondoc10ProgressBar = await this.calcPercent(this.expressNondoc10, this.maxValue);
    this.expressNondoc09ProgressBar = await this.calcPercent(this.expressNondoc09, this.maxValue);
    this.expressBreakBulkProgressBar = await this.calcPercent(this.expressBreakBulk, this.maxValue);
    this.sameDayProgressBar = await this.calcPercent(this.sameDay, this.maxValue);
    this.expressEnvelopeProgressBar = await this.calcPercent(this.expressEnvelope, this.maxValue);
    this.expressDomesticProgressBar = await this.calcPercent(this.expressDomestic, this.maxValue);
    this.expressWorldwideprogressBar = await this.calcPercent(this.expressWorldwide, this.maxValue);
    this.addresscorrectionprogressBar = await this.calcPercent(this.addresscorrection, this.maxValue);
    this.fuelprogressBar = await this.calcPercent(this.fuelSurcharge, this.maxValue);
    this.importExportDutiesprogressBar = await this.calcPercent(this.importExportDuties, this.maxValue);

    this.progressBarDhlList = [];
    this.progressBarDhlList.push({ serviceType: 'EXPRESS WORLDWIDE', progressBar: this.expressWorldwideprogressBar, netCharge: this.expressWorldwide, serviceName: 'EXPRESS WORLDWIDE' });
    this.progressBarDhlList.push({ serviceType: 'EXPRESS 9:00', progressBar: this.expressNondoc09ProgressBar, netCharge: this.expressNondoc09, serviceName: 'EXPRESS 9:00' });
    this.progressBarDhlList.push({ serviceType: 'EXPRESS 10:30', progressBar: this.expressNondoc10ProgressBar, netCharge: this.expressNondoc10, serviceName: 'EXPRESS 10:30' });
    this.progressBarDhlList.push({ serviceType: 'EXPRESS 12:00', progressBar: this.expressNondoc12ProgressBar, netCharge: this.expressNondoc12, serviceName: 'EXPRESS 12:00' });
    this.progressBarDhlList.push({ serviceType: 'EXPRESS DOMESTIC', progressBar: this.expressDomesticProgressBar, netCharge: this.expressDomestic, serviceName: 'EXPRESS DOMESTIC' });
    this.progressBarDhlList.push({ serviceType: 'EXPRESS BREAKBULK', progressBar: this.expressBreakBulkProgressBar, netCharge: this.expressBreakBulk, serviceName: 'EXPRESS BREAKBULK' });
    this.progressBarDhlList.push({ serviceType: 'EXPRESS ENVELOPE', progressBar: this.expressEnvelopeProgressBar, netCharge: this.expressEnvelope, serviceName: 'EXPRESS ENVELOPE' });
    this.progressBarDhlList.push({ serviceType: 'SAME DAY', progressBar: this.sameDayProgressBar, netCharge: this.sameDay, serviceName: 'SAME DAY' });
    this.progressBarDhlList.sort((a: any, b: any) => b.netCharge - a.netCharge);
    this.domesticGroundService.set(this.progressBarDhlList);
  }

  async calcPercent(dataValue: any, maxValue: any) {
    var obtained = dataValue;
    var total = maxValue;
    var percent = obtained * 100 / total;
    if (Number.isNaN(percent)) {
      return 0;
    }
    return await percent;
  }
  resetCharbackUI() {
    const bars = [
      "expressNondoc12ProgressBar",
      "expressNondoc10ProgressBar",
      "expressNondoc09ProgressBar",
      "expressBreakBulkProgressBar",
      "expressDomesticProgressBar",
      "expressEnvelopeProgressBar",
      "expressWorldwideprogressBar",
      "addresscorrectionprogressBar",
      "sameDayProgressBar",
      "fuelprogressBar",
      "surepost_id",
      "sccprogressBar",
      "addressCorrection",
      "importExportDuties",
      "chargeBack"
    ];

    bars.forEach(bar => {
      (this as any)[`${bar}_visible`] = true;
      (this as any)[`${bar}_includeInLayout`] = true;
      (this as any)[`${bar}_label_visible`] = false;
      (this as any)[`${bar}_label_includeInLayout`] = false;
    });
  }


  async fetchaccountDetailsOntrac() {
    this.httpDhlService.fetchaccountDetails(this.clientProfileFormGroup.value)
      .subscribe(
        (result: any) => {
          console.log('result', result);
          this.fetchaccountDetailsStr = result;

          this.fetchaccountDetailsStr.forEach((item: any, index: any) => {
            if (!item.nickName) {
              this.fetchaccountDetailsStr[index].nickName = item.accountNo;
            } else {
              this.fetchaccountDetailsStr[index].nickName = `${item.accountNo} - <span>${item.nickName}</span>`;
            }
          });

          const AccNoObj: any = { accountNo: 'ALL', nickName: "ALL" };
          this.fetchaccountDetailsStr.unshift(AccNoObj);

          this.onTracAccountNumber(this.fetchaccountDetailsStr);
        },
        error => {
          // optionally log error
        }
      );
  }
  private _onDestroy = new Subject<void>();
  private filterInitialized = false;
  clientProfileList: any;
  onTracAccountNumberList: any[] = [];
  AccountoptionsOntrac: any[] = [];

  public filteredAccNoOntrac: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public accNoOntracFilterCtrl: FormControl = new FormControl('');


  async onTracAccountNumber(event: any[]): Promise<void> {
    this.onTracAccountNumberList = [];
    this.AccountoptionsOntrac = [];

    for (const acc of event) {
      this.onTracAccountNumberList.push(acc);

      this.AccountoptionsOntrac.push({
        accountNo: acc.accountNo,
        nickName: acc.nickName
      });
    }

    this.ExecMatOntracSelctFunctions();
  }

  ExecMatOntracSelctFunctions(): void {
    // set dropdown default value through the actual form control
    this.clientProfileFormGroup.get('accNo')?.setValue(null);

    // load initial options
    this.filteredAccNoOntrac.next([...this.AccountoptionsOntrac]);

    // avoid duplicate subscriptions
    if (!this.filterInitialized) {
      this.filterInitialized = true;

      this.accNoOntracFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => this.filterOntracAccNo());
    }
  }

  private filterOntracAccNo(): void {
    if (!this.AccountoptionsOntrac?.length) {
      this.filteredAccNoOntrac.next([]);
      return;
    }

    const search = (this.accNoOntracFilterCtrl.value || '').toString().toLowerCase().trim();

    if (!search) {
      this.filteredAccNoOntrac.next([...this.AccountoptionsOntrac]);
      return;
    }

    const filtered = this.AccountoptionsOntrac.filter((client: any) =>
      (client.accountNo || '').toString().toLowerCase().includes(search) ||
      (client.nickName || '').toString().toLowerCase().includes(search)
    );

    this.filteredAccNoOntrac.next(filtered);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  //Get User Profile in init load
  async getuserProfile() {
    this.userProfifle = await this.commonService.getUserprofileData();
    this.clientProfileList = this.userProfifle;
    return this.userProfifle;
  }
  openModalConfig: any;
  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  async acc_clientid_changeHandler(evt: any) {
    this.clientProfileFormGroup.get('accNo')?.setValue(evt);
    this.accountNumber = evt;

    this.openLoading();

    if (evt === 'ALL') {
      this.year_Select = this.clientProfileFormGroup.get('year')?.value;
      this.month_Select = this.clientProfileFormGroup.get('month')?.value;

      await this.clientProfileFormGroup.get('clientId')?.setValue(this.clientID);
      await this.clientProfileFormGroup.get('clientName')?.setValue(this.clientName);
      await this.clientProfileFormGroup.get('year')?.setValue(this.year_Select);
      await this.clientProfileFormGroup.get('invoiceyear')?.setValue(this.year_Select);
      await this.clientProfileFormGroup.get('month')?.setValue(this.month_Select);
      await this.clientProfileFormGroup.get('accountNumber')?.setValue(null);
    } else {
      await this.clientProfileFormGroup.get('accountNumber')?.setValue(evt);
    }

    // Fetch data for top chart
    this.httpDhlService.fetchTopChart(this.clientProfileFormGroup.value).subscribe(
      (result: any) => this.fetchDataOntrac(result),
      (error: any) => console.error('error', error)
    );

    // Fetch other dashboard data
    await this.fetchdashboardservices();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();
  }
  previousClickedYear: any;
  previousClickedMonth: any;
  clickedMonth: any;
  dashBoardLable: any;
  transportationLable: any;
  async yearSelect(yeardata: any) {
    this.openLoading();

    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
    this.linkflag = 0;
    this.zoneflag = 0;
    this.month_Select = null;

    this.previousClickedYear = this.clickedYear;
    this.previousClickedMonth = this.clickedMonth;

    this.clickedMonth = 0;
    this.clickedYear = yeardata;
    this.currentyear = Number(this.clickedYear);
    this.dashBoardLable = String(this.currentyear);
    this.transportationLable = String(this.currentyear);

    await this.clientProfileFormGroup.get('year')?.setValue(yeardata);
    await this.clientProfileFormGroup.get('month')?.setValue(null);


    // Fetch top chart data
    this.httpDhlService.fetchTopChart(this.clientProfileFormGroup.value).subscribe(
      (result: any) => this.fetchDataOntrac(result),
      (error: any) => console.error('error', error)
    );

    // Fetch other dashboard data
    await this.fetchdashboardservices();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();
  }
  async monthSelect(monthdata: any) {
    this.openLoading();

    this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
    this.linkflag = 0;
    this.zoneflag = 0;

    this.month_Select = monthdata;
    this.previousClickedYear = this.clientProfileFormGroup.get('year')?.value;
    this.previousClickedMonth = monthdata;
    this.currentyear = this.previousClickedYear;

    this.clickedMonth = 0;

    // Normalize 'null' string to actual null
    if (monthdata === "null") {
      monthdata = null;
    }

    this.clientProfileFormGroup.get('month')?.setValue(monthdata);
    this.clientProfileFormGroup.get('year')?.setValue(this.currentyear);


    // Fetch top chart data
    this.httpDhlService.fetchTopChart(this.clientProfileFormGroup.value).subscribe(
      (result: any) => this.fetchDataOntrac(result),
      (error: any) => console.error('error', error)
    );

    // Fetch other dashboard data
    await this.fetchdashboardservices();
    await this.fetchServicesPieChart();
    await this.fetchProgressServices();

    this.bindingTitle();
  }
  sendValue: any;
  async moreviewWeightDist(event: string) {
    this.sendValue = {};

    const invoiceMonth = this.clientProfileFormGroup.get('month')?.value;
    const invoiceYear = this.clientProfileFormGroup.get('year')?.value;
    const clientId = this.clientProfileFormGroup.get('clientId')?.value;
    const clientName = this.clientProfileFormGroup.get('clientName')?.value;
    const weightMainAC = this.weight_mainAC;
    const accountNumber = this.accountNumber;
    const chargetypevalue = this.dashBoardSHP.get('chargetypevalue')?.value;

    const moreviewObj = {
      month: invoiceMonth,
      year: invoiceYear,
      clientId: clientId,
      clientName: clientName,
      weight_mainAC: weightMainAC,
      chargetypevalue: chargetypevalue,
      accountNumber: accountNumber,
      themeoption: this.themeoption,
      chartType: event
    };

    this.sendValue = moreviewObj;

    this.openDialog();
  }
  dialogValue: any;
  openDialog() {
    const dialogRef = this.dialog.open(DhlWeightDistPopupComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.sendValue }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }
  dateRange: any;
  basis_Value: any;
  searchUserobjUPS: any;
  searchUserobjUPSArray: any[] = [];
  async searchUser() {
    var dateFr = this.searchForm.get('fromdate').value;
    var dateT = this.searchForm.get('todate').value;
    var dateFrom = this.datePipe.transform(dateFr, "yyyy-MM-dd");
    var dateTo = this.datePipe.transform(dateT, "yyyy-MM-dd");
    this.datePipe.transform(dateT, "yyyy-MM-dd");
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    this.clientID = this.clientProfileFormGroup.get('clientId')?.value;
    var clientname = this.clientProfileFormGroup.get('clientName')?.value;
    this.clientName = clientname.replace(/\s/g, "");
    let searchUserobjUPS: any = {
      clientId: this.clientID,
      clientName: this.clientName,
      fromDate: dateFrom,
      toDate: dateTo,
      basisValue: this.clientType,
      searchDetail: this.searchForm.get('searchDetail').value,
      searchSource: this.searchForm.get('chargeSource').value,

    };

    if (searchUserobjUPS.searchSource == "TrackingNumber") {
      this.searchUserobjUPSArray = [];
      if (this.searchForm.get('searchDetail').value != "") {
        var dateFrYear = dateFr.getFullYear();
        var dateTYear = dateT.getFullYear();
        var yearDiff = dateTYear - dateFrYear;
        if (yearDiff > 1) {
          this.openModal("Time Frame Greater than 2 years");
          return;
        }
        localStorage.setItem('payload_dhl', JSON.stringify(searchUserobjUPS));
        // this.searchUserobjUPSArray.push(searchUserobjUPS);
        // this.switchProj.CommonSub.next(this.searchUserobjUPSArray);
        this.router.navigate(['dhl/tracking']);
      }
      else {
        this.openModal("Please Enter Tracking number");
      }
    }
    else {
      if (this.searchForm.get('searchDetail').value != "") {
        var dateFrYear = dateFr.getFullYear();
        var dateTYear = dateT.getFullYear();
        var yearDiff = dateTYear - dateFrYear;
        if (yearDiff > 1) {
          this.openModal("Time Frame Greater than 2 years");
          return;
        }
        localStorage.setItem('payload_dhl', JSON.stringify(searchUserobjUPS));
        // this.searchUserobjUPSArray = [];
        // this.searchUserobjUPSArray.push(searchUserobjUPS);

        // this.switchProj.CommonSub.next(this.searchUserobjUPSArray);
        this.router.navigate(['dhl/tracking']);
      }
      else {
        this.openModal("Please Enter a value");

      }
    }

  }
  progressBar: any;
  moreService: any;
  async moreService_clickHandler() {
    var eventName = event;
    this.progressBar = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = await this.clientProfileFormGroup.get('clientName')?.value;
    var accountNumber = await this.clientProfileFormGroup.get('accountNumber')?.value;
    var groupby = await eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var moreviewObj = {
      invoiceMonth: invoiceMonth,
      invoiceyear: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      accountNumber: accountNumber,
      themeoption: this.themeoption
    }
    this.moreService = moreviewObj;
    this.moreServicePopupComponent();
  }
  async moreServicePopupComponent() {
    const dialogRef = this.dialog.open(DhlMoreServicePopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.moreService }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }
  async report_clickHandler(event: any) {
    var urlParam: any = {};
    var monthVal = await this.clientProfileFormGroup.get('month')?.value;
    var clickedYear = await this.clientProfileFormGroup.get('year')?.value;
    var date = new Date();
    var currentYear = new Date().getFullYear();
    if (monthVal == null) {
      var month = 0;
    } else {
      month = monthVal;
    }
    if (month == 0) {
      urlParam['fromdate'] = clickedYear + "-01" + "-01";
      urlParam['todate'] = clickedYear + "-12" + "-31";
    }
    else {
      var date = new Date(clickedYear, month, 0);
      var lastDay = date.getDate();
      urlParam['fromdate'] = this.datePipe.transform(clickedYear + "-" + month + "-01", "yyyy-MM-dd");
      urlParam['month'] = month.toString();
      urlParam['todate'] = this.datePipe.transform(clickedYear + "-" + month + "-" + lastDay, "yyyy-MM-dd");
    }

    urlParam['action'] = event;
    urlParam['reportname'] = event;
    urlParam['year'] = clickedYear;
    urlParam['chargemonth'] = monthVal;
    urlParam['month'] = monthVal;
    urlParam['clientId'] = await this.clientProfileFormGroup.get('clientId')?.value;
    urlParam['clientName'] = await this.clientProfileFormGroup.get('clientName')?.value;
    urlParam['accountnumber'] = await this.clientProfileFormGroup.get('accountNumber')?.value;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }
    this.httpDhlService.reportServlet(fields_string);
  }
  async clickTotalspend(event: any) {
    var urlParam: any = {};
    var date = new Date();
    var dateValue = this.datePipe.transform(date, "yyyy-MM-dd");
    var monthVal = await this.clientProfileFormGroup.get('month')?.value
    var month = monthVal;
    urlParam['fromdate'] = dateValue;
    urlParam['todate'] = dateValue;
    urlParam['action'] = event;
    urlParam['year'] = await this.clientProfileFormGroup.get('year')?.value;
    urlParam['chargemonth'] = month;
    urlParam['clientId'] = await this.clientProfileFormGroup.get('clientId')?.value;
    urlParam['clientName'] = await this.clientProfileFormGroup.get('clientName')?.value;
    urlParam['chargetyperesult'] = await this.dashBoardSHP.get('chargetypevalue')?.value;
    urlParam['accountnumber'] = await this.clientProfileFormGroup.get('accountNumber')?.value;
    var fields_string: any = "";
    for (const [key, value] of Object.entries(urlParam)) {
      fields_string += key + '=' + value + '&';
    }

    this.httpDhlService.reportServlet(fields_string);
  }

  async progressBar_clickHandler(event: any, eventObj:any) {
    if (eventObj.netCharge == 0) {
      this.openModal("Data Too Small to Display");
      return;
    }
    if (this.expressBreakBulkProgressBar == 0 && event == "EXPRESS BREAKBULK") {
      this.openModal("Data Too Small to Display");
      return;
    }

    else if (this.expressDomesticProgressBar == 0 && event == "EXPRESS DOMESTIC") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.expressEnvelopeProgressBar == 0 && event == "EXPRESS ENVELOPE") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.sameDayProgressBar == 0 && event == "SAME DAY") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.expressNondoc12ProgressBar == 0 && event == "EXPRESS 12:00") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.expressNondoc10ProgressBar == 0 && event == "EXPRESS 10:30") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.expressNondoc09ProgressBar == 0 && event == "EXPRESS 9:00") {
      this.openModal("Data Too Small to Display");
      return;
    }
    else if (this.expressWorldwide == 0 && event == "EXPRESS WORLDWIDE") {
      this.openModal("Data Too Small to Display");
      return;
    }



    var eventName = event;
    this.progressBar = {};
    var invoiceMonth = await this.clientProfileFormGroup.get('month')?.value;
    var invoiceyear = await this.clientProfileFormGroup.get('year')?.value;
    var clientId = await this.clientProfileFormGroup.get('clientId')?.value;
    var clientName = this.clientName;
    var accountNumber = this.accountNumber;
    var groupby = await eventName;
    var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
    var clientProfileFormGroup = this.clientProfileFormGroup.value;
    var moreviewObj = {
      month: invoiceMonth,
      year: invoiceyear,
      clientId: clientId,
      clientName: clientName,
      groupBy: groupby,
      chargetypevalue: chargetypevalue,
      clientProfile: clientProfileFormGroup,
      accountNumber: accountNumber,
      themeoption: this.themeoption
    }
    this.progressBar = moreviewObj;
    this.progressBarPopupComponent();
  }
  async progressBarPopupComponent() {

    const dialogRef = this.dialog.open(DhlChargeDescPopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: this.progressBar,
        dataasof: this.dataasof
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      this.dialogValue = result.data;
    });
  }

}
interface gridData {
  grossCharge: string;
  netCharge: string;
  costperPackage: string;
  costperlb: string;
  enteredWeight: string;
  billedWeight: string;
  scc: string;
  weightdifference: string;
  grosschargeFRT: string;
  netchargeFRT: string;
  costperlbFRT: string;
  costperpackageFRT: string;
  totalSpentCount: any;
  averageWeight: any;
}
