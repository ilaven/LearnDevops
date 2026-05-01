import { ChangeDetectorRef, Component, OnInit, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl, } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ComparePopupComponent } from '../compare-analysis/compare-popup/compare-popup.component';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { AlertPopupComponent } from '../alert-popup/alert-popup.component';
import { environment } from 'src/environments/environment';
import { CompareCardsPopupComponent } from '../compare-analysis/compare-cards-poup/compare-cards-popup.component';
import { CompareServicesPopupComponent } from '../compare-analysis/compare-services-popup/compare-service.component';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { CommonService } from 'src/app/core/services/common.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-compare-analysis',
  templateUrl: './compare-analysis.component.html',
  styleUrls: ['./compare-analysis.component.scss'],
  standalone: false,
})

export class CompareAnalysisComponent implements OnInit {

  //variable Declaration
  compareData: any;
  fromDate: any;
  toDate: any;
  userProfifleData: any;
  userProfifle: any;
  clientID: any;
  userProfifleVal: any;
  clientProfileList: any;
  clientName: any;
  compageUpsData: any;
  shipingCost: any;
  compareVal: any = [];
  transportationData: any;
  packageShipped: any;
  avgCost: any;
  avgShipping: any;
  shippingCost: any;
  packageShippedFedex: any;
  avgCostFedex: any;
  avgShippingFedex: any;
  shippingCostFedex: any;
  packageShippedUPSFedex: any;
  avgCostUPSFedex: any;
  avgShippingUPSFedex: any;
  shippingCostUPSFedex: any;
  compareValFedex: any = [];
  fedexClientId: any;
  transportationDataFedex: any;
  fromDateFormat: any;
  toDateFormat: any;
  sendValue: any;
  dialogValue: any;
  indicator: any;
  themeoption: any;
  panelClass: any;
  userProfifleUpsVal: any;
  clientType: any;
  imageUrl = environment.imageURL;
  randomNumber: any;
  upsAccVal: any;
  fedexAccVal: any;
  message: any;
  frtAccTxt = "FRT+ACC";
  ImageUrlData: any;
  fromDateFedex: any;
  toDateFedex: any;
  fromDateFedexFormat: any;
  toDateFedexFormat: any;
  clntName: any;
  compareUpsFedexData: any;
  pipe_chartData: any = [];
  chargeTypeSelected: any;
  chargeTypeSignal: any = signal<any>('FRTWithAcc');
  labelTxt: any;
  upsshippingcost_serviceChart: any;
  upssurchargeChart: any;
  fedexsurchargeChart: any;
  pipe_chartDataFedex: any = [];
  showColumnPicker = false;

  // Form group
  apiControllerFormGroupTopService!: FormGroup;
  apiControllerFormGroup!: FormGroup;

  constructor(private commonService: CommonService, private datePipe: DatePipe, private dialog: MatDialog, private httpfedexService: HttpfedexService,
    private httpClientService: HttpClientService, private router: Router, private _cd: ChangeDetectorRef,
    private cookiesService: CookiesService, private loaderService: LoaderService) {
    this.cookiesService.carrierType.subscribe((clienttype) => {
      this.clientType = clienttype.toUpperCase();
    });
    this.apiControllerFormGroupTopService = new FormGroup({
      action: new FormControl('Fetch'),
      key: new FormControl('fn_topchart'),
      fedexclientId: new FormControl(''),
      clientId: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      fedexfromDate: new FormControl(''),
      fedextoDate: new FormControl(''),
      tableName: new FormControl(''),
      fedextableName: new FormControl(''),
      carrierType: new FormControl(''),
      accountNumber: new FormControl(''),
      fedexaccountNumber: new FormControl('')
    });

    this.apiControllerFormGroup = new FormGroup({
      action: new FormControl('Fetch'),
      key: new FormControl('fn_shippingcost_servicelevel'),
      fedexclientId: new FormControl(''),
      clientId: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      fedexfromDate: new FormControl(''),
      fedextoDate: new FormControl(''),
      tableName: new FormControl(''),
      fedextableName: new FormControl(''),
      carrierType: new FormControl(''),
      chargeType: new FormControl('FRTWithAcc'),
      serviceType: new FormControl(''),
      fedexserviceType: new FormControl(''),
      accountNumber: new FormControl(''),
      fedexaccountNumber: new FormControl('')
    });

  }
  isLoading = true;
  openLoading() {
    this.loaderService.show();
  }
  closeLoading() {
    this.loaderService.hide();
  }

  toggleCompareAnalysisPopup(param: any) {
    this.commonService.emitContractParam(param);
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

  ngOnInit() {
    this.openLoading();
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.commonService.fromcurrentDate.subscribe(selectedfromDate => {
      this.fromDate = selectedfromDate;

    });
    this.commonService.tocurrentDate.subscribe(selectedtoDate => { this.toDate = selectedtoDate; });

    this.commonService.fromcurrentDateFedex.subscribe(selectedfromDate => {
      this.fromDateFedex = selectedfromDate;
    });
    this.commonService.tocurrentDateFedex.subscribe(selectedtoDate => {
      this.toDateFedex = selectedtoDate;
    });

    this.commonService.getAccNoUps.subscribe(upsAccVal => { this.upsAccVal = upsAccVal[0] == 'ALL' ? null : upsAccVal.join('@'); });
    this.commonService.getAccNoFedex.subscribe(fedexAccVal => { this.fedexAccVal = fedexAccVal[0] == 'ALL' ? null : fedexAccVal.join('@'); });

    this.fromDateFormat = this.datePipe.transform(this.fromDate, "MMM dd,yyyy");
    this.toDateFormat = this.datePipe.transform(this.toDate, "MMM dd,yyyy");
    this.fromDateFedexFormat = this.datePipe.transform(this.fromDateFedex, "MMM dd,yyyy");
    this.toDateFedexFormat = this.datePipe.transform(this.toDateFedex, "MMM dd,yyyy");

    if (this.fromDate == "") {
      this.router.navigate(['/dashboard/dashboard']);
      return;
    }
    this.getUser();

  }

  linkshpChange(param: any) {
    this.openLoading();
    if (param == 'FRT')
      this.frtAccTxt = "FRT";
    else if (param == 'ACC')
      this.frtAccTxt = "ACC";
    else
      this.frtAccTxt = "FRT+ACC";
    this.chargeTypeSignal.set(param);
    this.apiControllerFormGroup.get('chargeType')?.setValue(param);
    this.chargeTypeSelected = this.apiControllerFormGroup.get('chargeType')?.value;
    this.compareBarCharts(this.compareUpsFedexData);
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");

      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        let ctx: any = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }

  async savePDF(): Promise<void> {
    this.openLoading();

    try {
      const fromDateFormat = this.fromDateFormat;
      const toDateFormat = this.toDateFormat;
      const fromDateFedexFormat = this.fromDateFedexFormat;
      const toDateFedexFormat = this.toDateFedexFormat;
      const frtAccText = this.frtAccTxt;

      const chart1 = this.upsshippingcost_serviceChart;
      const chart2 = this.upssurchargeChart;
      const chart3 = this.fedexsurchargeChart;

      if (!chart1 || !chart2 || !chart3) {
        this.openModal('Charts are not ready yet.');
        return;
      }

      let clientImageDataUrl: any;
      let ljmImageDataUrl: any;
      let upsIconUrl: any;
      let fedexIconUrl: any;

      try {
        clientImageDataUrl = await this.getBase64ImageFromURL(this.ImageUrlData);
      } catch {
        clientImageDataUrl = null;
      }

      try {
        ljmImageDataUrl = await this.getBase64ImageFromURL('assets/images/logo/ljm_logoImg.png');
      } catch {
        ljmImageDataUrl = null;
      }

      try {
        upsIconUrl = await this.getBase64ImageFromURL('assets/images/logo/ups.png');
      } catch {
        upsIconUrl = null;
      }

      try {
        fedexIconUrl = await this.getBase64ImageFromURL('assets/images/logo/fedex.png');
      } catch {
        fedexIconUrl = null;
      }

      this.openModal('Your request has been added to the report queue. When complete, your file will be downloaded automatically.');

      const res = await Promise.all([
        chart1.exporting.pdfmake,
        chart1.exporting.getImage('png'),
        chart2.exporting.getImage('png'),
        chart3.exporting.getImage('png')
      ]);

      const pdfMake = res[0];
      pdfMake.vfs = pdfFonts;

      const clientNameObj = this.clntName;

      const doc: any = {
        pageSize: {
          width: 890,
          height: 1150
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
              width: 135,
              alignment: 'left'
            }
            : {
              text: '',
              width: 135
            },

          {
            text: 'Compare Analysis',
            fontSize: 25,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 0]
          },

          ljmImageDataUrl
            ? {
              image: ljmImageDataUrl,
              width: 110,
              margin: [0, 0, 0, 0]
            }
            : {
              text: '',
              width: 110
            }
        ]
      });

      doc.content.push({
        text: clientNameObj,
        fontSize: 15,
        bold: true,
        alignment: 'center',
        margin: [0, -45, 0, 50]
      });

      doc.content.push({
        text: 'Invoice Reporting Period:',
        fontSize: 17,
        alignment: 'right',
        margin: [0, 0, 0, 0]
      });

      doc.content.push({
        text: 'UPS: ' + fromDateFormat + ' - ' + toDateFormat,
        fontSize: 11,
        bold: true,
        alignment: 'right',
        margin: [0, 5, 0, 0]
      });

      doc.content.push({
        text: 'FedEx: ' + fromDateFedexFormat + ' - ' + toDateFedexFormat,
        fontSize: 11,
        bold: true,
        alignment: 'right',
        margin: [0, 5, 0, 30]
      });

      doc.content.push({
        table: {
          widths: [800],
          body: [[
            {
              border: [true, true, true, false],
              text: 'Shipping Cost (' + frtAccText + ') – Service Level',
              fontSize: 10,
              bold: true,
              margin: [0, 30, 0, 0],
              alignment: 'center'
            }
          ]]
        }
      });

      doc.content.push({
        table: {
          widths: [800],
          body: [[
            {
              border: [true, false, true, true],
              image: res[1],
              width: 720,
              alignment: 'center'
            }
          ]]
        }
      });

      doc.content.push({
        table: {
          widths: [800],
          heights: [50],
          body: [[
            {
              border: [false, false, false, false],
              text: ''
            }
          ]]
        }
      });

      doc.content.push({
        table: {
          widths: [800],
          body: [[
            {
              border: [true, true, true, false],
              text: 'TRANSPORTATION COST VS SURCHARGES',
              fontSize: 10,
              bold: true,
              margin: [0, 20, 0, 50],
              alignment: 'center'
            }
          ]]
        }
      });

      doc.content.push({
        table: {
          widths: [800],
          body: [[
            {
              border: [true, false, true, false],
              columns: [
                upsIconUrl
                  ? {
                    image: upsIconUrl,
                    width: 35,
                    margin: [0, 0, 0, 0]
                  }
                  : {
                    text: '',
                    width: 35
                  },
                fedexIconUrl
                  ? {
                    image: fedexIconUrl,
                    width: 50,
                    margin: [0, 0, -400, 0],
                    alignment: 'center'
                  }
                  : {
                    text: '',
                    width: 50
                  }
              ]
            }
          ]]
        }
      });

      doc.content.push({
        table: {
          widths: [800],
          body: [[
            {
              border: [true, false, true, true],
              columns: [
                {
                  image: res[2],
                  width: 390,
                  margin: [0, 0, 0, 30]
                },
                {
                  image: res[3],
                  width: 390,
                  margin: [0, 0, 0, 30]
                }
              ]
            }
          ]]
        }
      });

      pdfMake.createPdf(doc).download('Compare_Analysis_' + clientNameObj + '.pdf');
    } catch (error) {
      console.log('PDF generation error', error);
      this.openModal('Unable to generate PDF.');
    } finally {
      this.closeLoading();
    }
  }

  async getUser() {
    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = await this.getCurrentUpsUserLogin();
    var clientName = this.userProfifle.clientName;
    this.clntName = clientName;
    this.themeoption = await this.cookiesService.getCookie('themeOption').then(res => {
      return res;
    });
    this.clientName = clientName.replace(/\s/g, "");
    this.ImageUrlData = await this.imageUrl + this.clientName + ".jpg";
    var tableNameFedex = "T001_" + clientName.replace(/\s/g, "_") + "_invoice_raw";
    this.fedexClientId = await this.getCurrentFedexUserLogin();
    await this.commonService.fromcurrentDate.subscribe(selectedfromDate => {
      this.fromDate = selectedfromDate;
      var fromDate = selectedfromDate;
    });
    await this.commonService.tocurrentDate.subscribe(selectedtoDate => {
      this.toDate = selectedtoDate;
    });
    await this.commonService.fromcurrentDateFedex.subscribe(selectedfromDate => {
      this.fromDateFedex = selectedfromDate;
    });
    await this.commonService.tocurrentDateFedex.subscribe(selectedtoDate => {
      this.toDateFedex = selectedtoDate;
    });
    this.fromDateFedexFormat = this.datePipe.transform(this.fromDateFedex, "MMM dd,yyyy");
    this.toDateFedexFormat = this.datePipe.transform(this.toDateFedex, "MMM dd,yyyy");
    var fromyear = this.datePipe.transform(this.fromDate, "yyyy");
    var tableName = "T004_" + this.clientName + "_" + fromyear;
    await this.apiControllerFormGroupTopService.get('clientId')?.setValue(this.clientID);
    await this.apiControllerFormGroupTopService.get('fromDate')?.setValue(this.fromDate);
    await this.apiControllerFormGroupTopService.get('toDate')?.setValue(this.toDate);
    await this.apiControllerFormGroupTopService.get('fedexfromDate')?.setValue(this.fromDateFedex);
    await this.apiControllerFormGroupTopService.get('fedextoDate')?.setValue(this.toDateFedex);
    await this.apiControllerFormGroupTopService.get('tableName')?.setValue(tableName);
    await this.apiControllerFormGroupTopService.get('fedexclientId')?.setValue(this.fedexClientId);
    await this.apiControllerFormGroupTopService.get('fedextableName')?.setValue(tableNameFedex);
    await this.apiControllerFormGroupTopService.get('carrierType')?.setValue(this.clientType);
    await this.apiControllerFormGroupTopService.get('accountNumber')?.setValue(this.upsAccVal);
    await this.apiControllerFormGroupTopService.get('fedexaccountNumber')?.setValue(this.fedexAccVal);

    await this.apiControllerFormGroup.get('clientId')?.setValue(this.clientID);
    await this.apiControllerFormGroup.get('fromDate')?.setValue(this.fromDate);
    await this.apiControllerFormGroup.get('toDate')?.setValue(this.toDate);
    await this.apiControllerFormGroup.get('fedexfromDate')?.setValue(this.fromDateFedex);
    await this.apiControllerFormGroup.get('fedextoDate')?.setValue(this.toDateFedex);
    await this.apiControllerFormGroup.get('tableName')?.setValue(tableName);
    await this.apiControllerFormGroup.get('fedexclientId')?.setValue(this.fedexClientId);
    await this.apiControllerFormGroup.get('fedextableName')?.setValue(tableNameFedex);
    await this.apiControllerFormGroup.get('carrierType')?.setValue(this.clientType);
    await this.apiControllerFormGroup.get('accountNumber')?.setValue(this.upsAccVal);
    await this.apiControllerFormGroup.get('fedexaccountNumber')?.setValue(this.fedexAccVal);

    if (this.themeoption == "dark") {
      this.panelClass = 'page-dark';
    }
    else {
      this.panelClass = 'custom-dialog-panel-class';
    }
    await this.fetchCompareData();
    await this.fetchCompareTopService();

  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        this.clientProfileList = result;
        return this.clientProfileList;
      });
    return this.userProfifleVal;
  }
  async getCurrentFedexUserLogin() {
    this.userProfifleVal = await this.commonService.getCurrentFedexUserLogin().then(
      result => {
        this.fedexClientId = result;
        return this.fedexClientId;
      });
    return this.userProfifleVal;
  }

  async getCurrentUpsUserLogin() {
    this.userProfifleUpsVal = await this.commonService.getCurrentUpsUserLogin().then(
      result => {
        var clientId = result;

        return clientId;
      });
    return this.userProfifleUpsVal;
  }

  async fetchCompareData() {
    await this.httpClientService.compareUpsData(this.apiControllerFormGroup.value).subscribe({
      next: (result) => {
        this.compareUpsFedexData = result[0];
        var result_length = result.length;
        if (result_length > 0) {
          this.displayCompareChart(result);
        }
        else {
          this.openModal("No data Found");
          this.closeLoading()
          return;
        }

      },
      error: (error) => {
        this.closeLoading()
        console.log(' error ', error);
      }
    })
  }

  openModal(alertVal: any) {
    const dialogConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }

  async fetchCompareTopService() {
    await this.httpClientService.compareUpsData(this.apiControllerFormGroupTopService.value).subscribe({
      next: (result) => {
        this.compageUpsData = result;
        this.displayCompareChartTopService(result);
      },
      error: (error) => {
        this.closeLoading();
        console.log(' error ', error);

      }
    })
  }
  async fetchCompareLabelService() {
    await this.httpClientService.compareUpsData(this.apiControllerFormGroup.value).subscribe({
      next: (result) => {
        this.compageUpsData = result;
        // this.displayCompareChartTopService(result);
      },
      error: (error) => {
        this.closeLoading();
        console.log(' error ', error);

      }
    })
  }
  async displayCompareChart(event: any) {
    this.closeLoading();
    var eventVal = event[0];
    var eventData = eventVal.comparisonResults;
    var eventDataFedex = eventVal.fedexcomparisonResults;
    var shipingCost = eventData[0];

    var shipingCostFedex = eventDataFedex[0];
    this.compareVal = eventData[1];
    this.compareValFedex = eventDataFedex[1];

    this.compareBarCharts(eventVal);
  }
  async displayCompareChartTopService(event: any) {

    var eventVal = event[0];
    var eventDataVal = eventVal.comparisonResults;
    var eventDataFedexVal = eventVal.fedexcomparisonResults;
    var eventData = eventDataVal[0];
    var eventDataFedex = eventDataFedexVal[0];
    var transportationData = eventData;
    var transportationDataFedex = eventDataFedex;
    this.packageShipped = transportationData['PACKAGES SHIPPED'];
    this.avgCost = transportationData['AVG. COST / PACKAGE'];
    this.avgShipping = transportationData['AVG. SHIPPING COST/LB'];
    this.shippingCost = transportationData['SHIPPING COSTS'];
    this.packageShippedFedex = transportationDataFedex['PACKAGES SHIPPED'];
    this.avgCostFedex = transportationDataFedex['AVG. COST / PACKAGE'];
    this.avgShippingFedex = transportationDataFedex['AVG. SHIPPING COST/LB'];
    this.shippingCostFedex = transportationDataFedex['SHIPPING COSTS'];
    this.shippingCostUPSFedex = (Number(transportationData['SHIPPING COSTS']) + Number(transportationDataFedex['SHIPPING COSTS'])).toFixed(2);
    this.packageShippedUPSFedex = (Number(transportationData['PACKAGES SHIPPED']) + Number(transportationDataFedex['PACKAGES SHIPPED'])).toFixed(2);
    this.avgCostUPSFedex = (Number(this.shippingCostUPSFedex) / Number(this.packageShippedUPSFedex)).toFixed(2);
    this.avgShippingUPSFedex = ((Number(transportationData['SHIPPING COSTS']) + Number(transportationDataFedex['COST LB'])) / (Number(transportationData['WEIGHT LB']) + Number(transportationDataFedex['WEIGHT LB']))).toFixed(2);


    this.compareHalfPieCharts(eventVal);
    this.compareHalfPieChartsFedex(eventVal);
    this._cd.markForCheck();
  }

  async compareBarCharts(eventVal: any) {
    this.closeLoading();
    var apiControllerFormGroup: FormGroup = this.apiControllerFormGroup;
    var httpClientService = this.httpClientService;
    var shipingCostFedex: any;
    var shipingCost: any;
    var eventData = eventVal.comparisonResults;

    var eventDataFedex = eventVal.fedexcomparisonResults;

    var chargeType = this.apiControllerFormGroup.get('chargeType')?.value;

    this.chargeTypeSelected = chargeType;
    if (chargeType == 'FRTWithAcc') {
      shipingCost = eventData[0];
      shipingCostFedex = eventDataFedex[0];
    }
    else if (chargeType == 'FRT') {
      shipingCost = eventData[2];
      shipingCostFedex = eventDataFedex[2];
    }
    else {
      shipingCost = eventData[3];
      shipingCostFedex = eventDataFedex[3];
    }

    // Themes begin
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;
    // Themes end

    // Create chart instance
    var chart = am4core.create("upsshippingcost_service", am4charts.XYChart);
    this.upsshippingcost_serviceChart = chart;
    this.showIndicator(chart);
    shipingCost
    shipingCostFedex

    var ground = "Ground Commercial / Ground";
    var threeday = "3 Day / FedEx Express Saver";
    var saver = "Next Day Air Saver / FedEx Standard Overnight";
    var twoDayAm = "2 Day AM / FedEx 2Day A.M.";
    var residential = "Ground Residential / Home Delivery";
    var twoday = "2 Day / FedEx 2Day";
    var dayAir = "Next Day Air / FedEx Priority Overnight";
    var SurePost = "Ground Saver / Ground Economy";
    var groundHundredweight = "Ground Hundredweight / Ground Hundredweight";
    var nextDay = "Next Day Air AM / FedEx First Overnight";


    // Add data
    chart.data = [{
      "service": ground,
      "ups": -shipingCost['Ground Commercial'],
      "fedex": shipingCostFedex['Ground']
    }, {
      "service": residential,
      "ups": -shipingCost['Ground Residential'],
      "fedex": shipingCostFedex['Home Delivery']
    }, {
      "service": groundHundredweight,
      "ups": -shipingCost['Ground Hundredweight'],
      "fedex": shipingCostFedex['Ground Hundredweight']
    }, {
      "service": SurePost,
      "ups": -shipingCost['Ground Saver'],
      "fedex": shipingCostFedex['Ground Economy']
    }, {
      "service": nextDay,
      "ups": -shipingCost['Next Day Air A.M.'],
      "fedex": shipingCostFedex['FedEx Priority First Overnight']
    }, {
      "service": dayAir,
      "ups": -shipingCost['Next Day Air'],
      "fedex": shipingCostFedex['FedEx Priority Overnight']
    }, {
      "service": saver,
      "ups": -shipingCost['Next Day Air Saver'],
      "fedex": shipingCostFedex['FedEx Standard Overnight']
    }, {
      "service": twoDayAm,
      "ups": -shipingCost['2 Day AM'],
      "fedex": shipingCostFedex['FedEx 2Day A.M.']
    }, {
      "service": twoday,
      "ups": -shipingCost['2 Day'],
      "fedex": shipingCostFedex['FedEx 2Day']
    }, {
      "service": threeday,
      "ups": -shipingCost['3 Day'],
      "fedex": shipingCostFedex['FedEx Express Saver']
    }
    ];
    if (chargeType == 'ACC') {

      var addresscorrection = "Address Correction";
      var additionalhandling = "Additional Handling";
      var largePackageSurcharge = "Large Package Surcharge/Oversize Charge";
      var OverMaximum = "Over Maximum/Unauthorized Package Fee";
      var PeakSurcharge = "Peak Surcharge";
      var DeliveryAreaSurcharge = "Delivery Area Surcharge";
      var DeliveryareaSurchargeExtended = "Delivery Area Surcharge - Extended";
      var FuelSurcharge = "Fuel Surcharge";
      var ResidentialSurcharge = "Residential Surcharge";


      // Add data
      chart.data = [{
        "service": addresscorrection,
        "ups": -shipingCost['Address Correction'],
        "fedex": shipingCostFedex['Address Correction']
      }, {
        "service": additionalhandling,
        "ups": -shipingCost['Additional Handling'],
        "fedex": shipingCostFedex['Additional Handling']
      }, {
        "service": largePackageSurcharge,
        "ups": -shipingCost['Large Package Surcharge'],
        "fedex": shipingCostFedex['Oversize Charge']
      }, {
        "service": OverMaximum,
        "ups": -shipingCost['Over Maximum'],
        "fedex": shipingCostFedex['Unauthorized Package Fee']
      }, {
        "service": PeakSurcharge,
        "ups": -shipingCost['Peak Surcharge'],
        "fedex": shipingCostFedex['Peak Surcharge']
      }, {
        "service": DeliveryAreaSurcharge,
        "ups": -shipingCost['Delivery Area Surcharge'],
        "fedex": shipingCostFedex['Delivery Area Surcharge']
      }, {
        "service": DeliveryareaSurchargeExtended,
        "ups": -shipingCost['Delivery Area Surcharge - Extended'],
        "fedex": shipingCostFedex['Delivery Area Surcharge Extended']
      }, {
        "service": FuelSurcharge,
        "ups": -shipingCost['Fuel Surcharge'],
        "fedex": shipingCostFedex['Fuel Surcharge']
      }, {
        "service": ResidentialSurcharge,
        "ups": -shipingCost['Residential Surcharge'],
        "fedex": shipingCostFedex['Residential Surcharge']
      }
      ];

    }
    // Use only absolute numbers
    chart.numberFormatter.numberFormat = "#.#s";

    // Create axes
    let categoryAxis: any = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "service";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.fontSize = 12;
    if (chargeType != 'ACC') {
      categoryAxis.renderer.labels.template.tooltipText = "[bold]\n [bold]CLICK TO VIEW MORE";
      categoryAxis.renderer.labels.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
      categoryAxis.tooltip.dy = 22;
      categoryAxis.renderer.labels.template.events.on("hit", (ev: any) => {
        this.openLoading();
        apiControllerFormGroup.get("key")?.setValue("fn_servicelevel_popup");
        this.labelTxt = ev.target.currentText;
        var labelTxtArr = this.labelTxt.split('/');
        var upsServiceType = labelTxtArr[0].trim();
        var fedexServiceType = labelTxtArr[1].trim();
        apiControllerFormGroup.get("serviceType")?.setValue(upsServiceType);

        apiControllerFormGroup.get("fedexserviceType")?.setValue(fedexServiceType);

        httpClientService.compareUpsData(apiControllerFormGroup.value).subscribe({
          next: (result: any) => {
            this.serviceResSelector(result);
          },
          error: (error: any) => {
            console.log(' error ', error);
          }
        })
      }, this);
    }
    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.extraMin = 0.1;
    valueAxis.extraMax = 0.1;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.minGridDistance = 40;
    valueAxis.renderer.ticks.template.length = 5;
    valueAxis.renderer.ticks.template.disabled = false;
    valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
    valueAxis.fontSize = 12;
    valueAxis.renderer.labels.template.adapter.add("text", (text: any) => {
      return "${text.formatNumber('#,##a')}[/]";
    });

    // let series = chart.series.push(new am4charts.ColumnSeries());
    //    series.dataFields.valueY = "value";
    //    series.dataFields.categoryX = "name";
    //    series.name = "Weight";
    //    series.tooltipText = "{categoryName}: $ [bold]{valueY.formatNumber('#,###.00')}[/] \n [bold]CLICK TO VIEW MORE";

    chart.colors.list = [
      am4core.color("#c07301"),
      am4core.color("#824fe7")
    ];
    // Create series
    var ups = chart.series.push(new am4charts.ColumnSeries());
    ups.dataFields.valueX = "ups";
    ups.dataFields.categoryY = "service";
    ups.clustered = false;
    ups.name = "UPS";
    ups.fontSize = 13;

    var upsLabel = ups.bullets.push(new am4charts.LabelBullet());
    upsLabel.label.text = "${valueX.formatNumber('#,###.00s')}[/]";
    upsLabel.label.hideOversized = false;
    upsLabel.label.truncate = false;
    upsLabel.label.horizontalCenter = "right";
    upsLabel.label.dx = -10;
    upsLabel.label.fontSize = 12;
    if (this.themeoption == "dark") {
      upsLabel.label.fill = am4core.color("#fff");
    }

    var fedex = chart.series.push(new am4charts.ColumnSeries());
    fedex.dataFields.valueX = "fedex";
    fedex.dataFields.categoryY = "service";
    fedex.clustered = false;
    fedex.name = "FedEx";
    fedex.fontSize = 13;

    var fedexLabel = fedex.bullets.push(new am4charts.LabelBullet());
    fedexLabel.label.text = "${valueX.formatNumber('#,###.00s')}[/]";
    fedexLabel.label.hideOversized = false;
    fedexLabel.label.truncate = false;
    fedexLabel.label.horizontalCenter = "left";
    fedexLabel.label.dx = 10;
    fedexLabel.label.fontSize = 12;
    if (this.themeoption == "dark") {
      fedexLabel.label.fill = am4core.color("#fff");
    }

    //Legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "left";
    chart.legend.disabled = false;
    chart.legend.align = "left";
    chart.legend.valueLabels.template.align = "left";
    chart.legend.valueLabels.template.textAlign = "end";
    chart.legend.position = "top";
    chart.paddingRight = 20;
    chart.legend.contentAlign = "left";
    if (this.themeoption == "dark") {
      chart.legend.labels.template.fill = am4core.color("#fff");
      chart.legend.valueLabels.template.fill = am4core.color("#fff");
      categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.title.fill = am4core.color("#fff");
      valueAxis.renderer.labels.template.fill = am4core.color("#fff");
      valueAxis.renderer.grid.template.strokeOpacity = 1;
      valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
      valueAxis.renderer.grid.template.strokeWidth = 2;


    }
    this.hideIndicator();
  }

  hideIndicator() {
    this.indicator.hide();
  }
  showIndicator(chart: any) {

    if (!this.indicator) {
      this.indicator = chart.tooltipContainer.createChild(am4core.Container);
      this.indicator.background.fill = am4core.color("#fff");
      this.indicator.background.fillOpacity = 0.8;
      this.indicator.width = am4core.percent(100);
      this.indicator.height = am4core.percent(100);
      var indicatorLabel = this.indicator.createChild(am4core.Label);
      indicatorLabel.text = "Loading...";
      indicatorLabel.align = "center";
      indicatorLabel.valign = "middle";
      indicatorLabel.fontSize = 20;
      indicatorLabel.dy = 50;

      var hourglass = this.indicator.createChild(am4core.Image);
      hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
      hourglass.align = "center";
      hourglass.valign = "middle";
      hourglass.horizontalCenter = "middle";
      hourglass.verticalCenter = "middle";
      hourglass.scale = 0.7;
    }

    this.indicator.hide(0);
    this.indicator.show();

  }
  serviceResSelector(param: any) {
    var serviceResultSet = [];
    var resultSetUps;
    var resultSetFedex;
    var accResultSetUps;
    var accResultSetFedex;

    if (this.chargeTypeSelected == 'FRTWithAcc') {
      resultSetUps = param[0]['comparisonResults'][0];
      resultSetFedex = param[0]['fedexcomparisonResults'][0];

    }
    else {
      resultSetUps = param[0]['comparisonResults'][1];
      resultSetFedex = param[0]['fedexcomparisonResults'][1];

    }
    accResultSetUps = param[0]['comparisonResults'][2];
    accResultSetFedex = param[0]['fedexcomparisonResults'][2];


    serviceResultSet.push(resultSetUps, resultSetFedex, accResultSetUps, accResultSetFedex)
    this.openServiceLevelPopup(serviceResultSet);
  }

  async compareHalfPieCharts(eventVal: any) {
    var eventPopup = eventVal;
    var eventData = eventVal.comparisonResults;
    var event = eventData[0];
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    let chart = am4core.create("upssurcharge", am4charts.PieChart);
    this.upssurchargeChart = chart;
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [{ name: "TRANSPORTATION COST", value: event['TRANSPORTATION COST'] },
    { name: "SURCHARGES", value: event['SURCHARGES'] }];

    chart.colors.list = [
      am4core.color("#dc9d3c"),
      am4core.color("#a26606")
    ];
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.slices.template.tooltipText = "{name}: $[bold]{value.formatNumber('#,###.00')}[/]";
    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;
    series.labels.template.disabled = true;
    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;
    series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    let myEvent = series.slices.template.events.on("hit", function (ev: any) {
      var category: object = ev.target.dataItem.dataContext;
      var categoryName = category;
      this.moreviewCompareCharts(categoryName, eventPopup);
    }, this);

    chart.legend = new am4charts.Legend();
    series.colors.list = [
      am4core.color("#dc9d3c"),
      am4core.color("#a26606")
    ];
    if (this.themeoption == "dark") {
      chart.legend.valueLabels.template.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
    }
  }
  async compareHalfPieChartsFedex(eventVal: any) {
    var eventPopup = eventVal;
    var eventData = eventVal.fedexcomparisonResults;
    var event = eventData[0];

    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    let chart = am4core.create("fedexsurcharge", am4charts.PieChart);
    this.fedexsurchargeChart = chart;
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [{ name: "TRANSPORTATION COST", value: event['TRANSPORTATION COST'] },
    { name: "SURCHARGES", value: event['SURCHARGES'] }];
    chart.colors.list = [
      am4core.color("#8250e7"),
      am4core.color("#4b2497")
    ];
    chart.radius = am4core.percent(70);
    chart.innerRadius = am4core.percent(40);
    chart.startAngle = 180;
    chart.endAngle = 360;

    let series = chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "value";
    series.dataFields.category = "name";
    series.slices.template.tooltipText = "{name}: $[bold]{value.formatNumber('#,###.00')}[/]";
    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = true;
    series.slices.template.inert = true;
    series.alignLabels = false;
    series.labels.template.disabled = true;
    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;
    series.slices.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
    let myEvent = series.slices.template.events.on("hit", function (ev: any) {
      var category: object = ev.target.dataItem.dataContext;
      var categoryName = category;
      this.moreviewCompareCharts(categoryName, eventPopup);
    }, this);
    chart.legend = new am4charts.Legend();
    series.colors.list = [
      am4core.color("#8250e7"),
      am4core.color("#4b2497")
    ];
    if (this.themeoption == "dark") {
      chart.legend.valueLabels.template.fill = am4core.color("#fff");
      chart.legend.labels.template.fill = am4core.color("#fff");
    }
  }
  //Fedex Compare
  async displayCompareChartFedex(event: any) {
    this.closeLoading();
    var evnetVal = event[0];
    var evnetData = evnetVal.comparisonResults;
    var shipingCost = evnetData[0];
    this.compareValFedex = evnetData[1];

    var transportationData = evnetData[2];
    this.transportationDataFedex = evnetData[2];
    this.packageShippedFedex = transportationData['PACKAGES SHIPPED'];
    this.avgCostFedex = transportationData['AVG. COST / PACKAGE'];
    this.avgShippingFedex = transportationData['AVG. SHIPPING COST/LB'];
    this.shippingCostFedex = transportationData['SHIPPING COSTS'];

    this.comparePieChartsFedex(shipingCost);

  }

  async comparePieChartsFedex(eventData: any) {
 /*  */  let chart = am4core.create("fedexshippingcost_service", am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();
    chart.legend.disabled = true;
    var objDataFedex = [eventData];
    for (let objFedex of objDataFedex) {
      for (let key in objFedex) {
        this.pipe_chartDataFedex.push({
          "value": key,
          "amount": objFedex[key]
        });
      }
    }


    chart.data = this.pipe_chartDataFedex;
    let series = chart.series.push(new am4charts.PieSeries());

    series.dataFields.value = "amount";
    series.dataFields.category = "value";
  }
  async moreviewCompareCharts(event: any, eventData: any) {
    var eventName = event.name;
    var eventValue = eventData;

    this.sendValue = {};
    var moreviewObj = {
      eventName: eventName,
      eventValue: eventValue,
      themeoption: this.themeoption
    }
    this.sendValue = moreviewObj;
    if (eventValue != "0") {
      this.openCompareChartsPopupComponent();
    }
    this._cd.markForCheck();
  }
  openCompareChartsPopupComponent() {
    const dialogRef = this.dialog.open(ComparePopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: { popupValue: this.sendValue }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogValue = result.data;
    });
  }
  openServiceLevelPopup(param: any) {
    this.closeLoading();
    const dialogRef = this.dialog.open(CompareServicesPopupComponent, {
      width: '100%',
      height: '100%',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: this.panelClass,
      data: {
        popupValue: param,
        ServiceTextVAl: this.labelTxt,
        themeoption: this.themeoption
      }
    });
  }
  compareCardObj = {};
  createCardValues(param: any) {
    if (param == 'Shipping Costs') {
      this.compareCardObj = { upsVal: this.shippingCost, FedexVal: this.shippingCostFedex, UPSFedExVal: this.shippingCostUPSFedex, cardName: param }
    }
    else if (param == 'Packages Shipped') {
      this.compareCardObj = { upsVal: this.packageShipped, FedexVal: this.packageShippedFedex, UPSFedExVal: this.packageShippedUPSFedex, cardName: param }
    }
    else if (param == 'AVG. Cost / Package') {
      this.compareCardObj = { upsVal: this.avgCost, FedexVal: this.avgCostFedex, UPSFedExVal: this.avgCostUPSFedex, cardName: param }
    }
    else {
      this.compareCardObj = { upsVal: this.avgShipping, FedexVal: this.avgShippingFedex, UPSFedExVal: this.avgShippingUPSFedex, cardName: param }
    }
    this.openCompareCardsPopupComponent(this.compareCardObj);
  }

  openCompareCardsPopupComponent(param: any) {
    this.dialog.open(CompareCardsPopupComponent, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: [this.panelClass],
      data: {
        popupValue: param,
        themeoption: this.themeoption
      }
    });
  }
}
