import { Component, OnInit, NgZone, Optional, Inject, signal, ChangeDetectorRef } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from "src/app/core/services/common.service";
@Component({
	selector: 'app-dhl-zone-popup',
	templateUrl: './dhl-zone-popup.component.html',
	styleUrls: ['./dhl-zone-popup.component.css'],
	standalone: false
})
export class DhlZonePopupComponent implements OnInit {
	private zone_popupChart!: am4charts.XYChart;
	private zone_popupChartTwo!: am4charts.XYChart;
	reportsFormGroup = new UntypedFormGroup({
		reportLogId: new UntypedFormControl(''),
		t001ClientProfile: new UntypedFormGroup({ clientId: new UntypedFormControl('') }),
	});
	loginId: Number = 123;
	userProfile: any;
	moreviewZoneFormGroup: UntypedFormGroup;
	dashBoardSHP: UntypedFormGroup;
	fromPage;
	invoiceMonth;
	invoiceyear;
	clientId;
	clientName;
	groupby;
	group;
	resultAc: any;
	chargeDescription;
	chargetypevalue = signal<any>('');
	pointName;
	fullmonth: any;
	tempfrtAC = [];
	month: any;
	year: any;
	fromdateReport: any;
	todateReport: any;
	zonechargetype: any;
	frtAC = [];
	zoneflag: any;
	zonerange: any;
	txtzone_text: any;
	fromzone: any;
	yearBindingTitle: any;
	monthBindingTitle: any;
	categoryName;
	tozone: any;
	themeoption;
	panelClass;
	titleChart1 = signal<any>('');
	titleChart2 = signal<any>('');
	constructor(private commonService: CommonService, public dialog: MatDialog, private cd: ChangeDetectorRef,
		public dialogRef: MatDialogRef<DhlZonePopupComponent>, private mlForm: UntypedFormBuilder, private httpClientService: HttpClientService, private zone: NgZone,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
		this.dashBoardSHP = new UntypedFormGroup({
			chargetypevalue: new UntypedFormControl('SHP_FRT+ACC')
		});
		this.fromPage = data.popupValue;
		this.panelClass = data.panelClass;
		if (this.fromPage.invoiceMonth == null) { this.invoiceMonth = '0'; }
		else { this.invoiceMonth = this.fromPage.invoiceMonth; }
		this.invoiceyear = this.fromPage.invoiceyear;
		this.clientId = this.fromPage.clientId;
		this.clientName = this.fromPage.clientName;
		this.themeoption = this.fromPage.themeoption;
		this.categoryName = this.fromPage.eventCategory;
		this.groupby = "Weightdes";
		this.group = "Weightdestri";
		this.chargetypevalue.set(this.fromPage.chargetypevalue);
		this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
		var pointVal = this.fromPage.chargeDescription;
		var pointName = pointVal.replace(/\s/g, "");

		if (pointName == "Ground") {
			this.pointName = "2-50";
			this.titleChart1.set("US 48");
			this.titleChart2.set("AK PR HI");
		}
		// else if(pointName=="Ground-A-P-H9-50"){
		//this.pointName="9-50";
		// }
		else if (pointName == "StandardtoCanada") {
			this.pointName = "51-56";
			this.titleChart1.set("Export");
			this.titleChart2.set("");
		}
		else if (pointName == "GroundSaver") {
			this.pointName = "2-13";
			this.titleChart1.set("US 48");
			this.titleChart2.set("AK PR HI");
		}
		else if (pointName == "NextDayAir") {
			this.pointName = "100-199";
			this.titleChart1.set("Next Day Air & Next Day Air AM");
			this.titleChart2.set("Next Day Air Saver");
		}
		else if (pointName == "2DAY") {
			this.pointName = "200-299";
			this.titleChart1.set("2 Day");
			this.titleChart2.set("2 Day AM");
		}
		else if (pointName == "3DAY") {
			this.pointName = "300-399";
			this.titleChart1.set("3 Day Select");
			this.titleChart2.set("");
		}
		else if (pointName == "WWSaver") {
			this.pointName = "400-499";
			this.titleChart1.set("Export");
			this.titleChart2.set("Import");
		}
		else if (pointName == "WWExpedited") {
			this.pointName = "600-699";
			this.titleChart1.set("Export");
			this.titleChart2.set("Import");
		}
		else if (pointName == "WWExpress") {
			this.pointName = "900-999";
			this.titleChart1.set("Export");
			this.titleChart2.set("Import");
		}
		else {
			this.pointName = "2-50";
			this.titleChart1.set("US 48");
			this.titleChart2.set("AK PR HI");
		}
		this.chargeDescription = this.fromPage.chargeDescription;
		this.chargetypevalue.set(this.fromPage.chargetypevalue)
		this.moreviewZoneFormGroup = new UntypedFormGroup({
			clientName: new UntypedFormControl(this.clientName),
			clientId: new UntypedFormControl(this.clientId),
			invoiceMonth: new UntypedFormControl(this.invoiceMonth),
			invoicemonth: new UntypedFormControl(this.invoiceMonth),
			invoiceyear: new UntypedFormControl(this.invoiceyear),
			pointName: new UntypedFormControl(this.pointName),
			chargeDescription: new UntypedFormControl(this.group)
		})
	}
	closeDialog() {
		this.dialogRef.close(true);
	}
	ngOnInit() {
		this.bindingTitle();
		this.fetchselectedzone();
	}
	async linkshpChange(data: any) {
		this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
		this.bindingTitle();
		if (data == "SHP_FRT") {
			await this.linkfrt_clickHandler(data);
		}
		if (data == "SHP_FRT+ACC" || data == null) {
			await this.linkfrtacc_clickHandler(data);
		}
		this.chargetypevalue.set(data);
	}
	async bindingTitle() {
		var yearData = this.moreviewZoneFormGroup.get('invoiceyear')?.value;
		var monthData = this.moreviewZoneFormGroup.get('invoiceMonth')?.value;
		var chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;
		this.yearBindingTitle = await this.moreviewZoneFormGroup.get('invoiceyear')?.value;
		if (monthData == '0') {
			this.monthBindingTitle = "";
		} else {
			var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			this.monthBindingTitle = monthArray[monthData];
		}
		this.cd.detectChanges();
	}
	async fetchselectedzone() {
		this.httpClientService.fetchselectedzone(this.moreviewZoneFormGroup.value).subscribe(
			(result: any) => {
				this.resultAc = result;
				var zonepopupflag = 1;
				this.loadAC(this.resultAc, this.invoiceyear, this.invoiceMonth, this.chargetypevalue(), zonepopupflag, this.pointName);
			},
			(error: any) => {
				console.log('error ', error);
			})
	}
	async loadAC(tempAC: any, Clickedyear: string, Clickedmonth: string, chargetypevalue: string, zonepopupflag: any, selectedrange: string) {
		this.zonerange = selectedrange;
		var selectedmonth = Number(Clickedmonth);
		var monthArray = new Array(Clickedyear, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
		this.month = monthArray[selectedmonth];
		this.year = Clickedyear;
		this.zonechargetype = chargetypevalue;
		this.tempfrtAC = tempAC;
		this.zoneflag = 0;
		if (this.zonechargetype == null)
			this.zonechargetype = "SHP_FRT+ACC";
		if (Clickedyear == this.month && tempAC != null && tempAC.length != 0) {
			this.txtzone_text = "Zone for" + " " + this.year;
			this.fromdateReport = this.year + "-01-01";
			this.todateReport = this.year + "-12-31";
		}
		else {
			if (this.month == "Jan") {
				this.fullmonth = "January";
				this.fromdateReport = this.year + "-01-01";
				this.todateReport = this.year + "-01-31";
			}
			else if (this.month == "Feb") {
				this.fullmonth = "February";

				if ((Number(this.year) % 400 == 0) || ((Number(this.year) % 4 == 0) && (Number(this.year) % 100 != 0))) {
					/* leap year */
					this.fromdateReport = this.year + "-02-01";
					this.todateReport = this.year + "-02-29";
				}
				this.fromdateReport = this.year + "-02-01";
				this.todateReport = this.year + "-02-28";
			}
			else if (this.month == "Mar") {
				this.fullmonth = "March";
				this.fromdateReport = this.year + "-03-01";
				this.todateReport = this.year + "-03-31";
			}
			else if (this.month == "Apr") {
				this.fullmonth = "April";
				this.fromdateReport = this.year + "-04-01";
				this.todateReport = this.year + "-04-30";
			}
			else if (this.month == "May") {
				this.fullmonth = "May";
				this.fromdateReport = this.year + "-05-01";
				this.todateReport = this.year + "-05-31";
			}
			else if (this.month == "Jun") {
				this.fullmonth = "June";
				this.fromdateReport = this.year + "-06-01";
				this.todateReport = this.year + "-06-30";
			}
			else if (this.month == "Jul") {
				this.fullmonth = "July";
				this.fromdateReport = this.year + "-07-01";
				this.todateReport = this.year + "-07-31";
			}
			else if (this.month == "Aug") {
				this.fullmonth = "August";
				this.fromdateReport = this.year + "-08-01";
				this.todateReport = this.year + "-08-31";
			}
			else if (this.month == "Sep") {
				this.fullmonth = "September";
				this.fromdateReport = this.year + "-09-01";
				this.todateReport = this.year + "-09-30";
			}
			else if (this.month == "Oct") {
				this.fullmonth = "October";
				this.fromdateReport = this.year + "-10-01";
				this.todateReport = this.year + "-10-31";
			}
			else if (this.month == "Nov") {
				this.fullmonth = "November";
				this.fromdateReport = this.year + "-11-01";
				this.todateReport = this.year + "-11-30";
			}
			else if (this.month == "Dec") {
				this.fullmonth = "December";
				this.fromdateReport = this.year + "-12-01";
				this.todateReport = this.year + "-12-31";
			}
			else
				this.fullmonth = "";
			this.txtzone_text = "Zone for" + " " + this.year + " " + this.fullmonth;
		}

		if (Clickedyear == this.month && tempAC != null && tempAC.length != 0) {
			this.txtzone_text = "Zone for" + " " + this.year;
		}
		else {
			if (this.month == "Jan")
				this.fullmonth = "January";
			else if (this.month == "Feb")
				this.fullmonth = "February";
			else if (this.month == "Mar")
				this.fullmonth = "March";
			else if (this.month == "Apr")
				this.fullmonth = "April";
			else if (this.month == "May")
				this.fullmonth = "May";
			else if (this.month == "Jun")
				this.fullmonth = "June";
			else if (this.month == "Jul")
				this.fullmonth = "July";
			else if (this.month == "Aug")
				this.fullmonth = "August";
			else if (this.month == "Sep")
				this.fullmonth = "September";
			else if (this.month == "Oct")
				this.fullmonth = "October";
			else if (this.month == "Nov")
				this.fullmonth = "November";
			else if (this.month == "Dec")
				this.fullmonth = "December";
			else
				this.fullmonth = "";
			this.txtzone_text = "Zone for" + " " + this.year + " " + this.fullmonth;
		}


		if (tempAC != null && tempAC.length != 0) {
			this.createSeriesFromAC_morezone(tempAC);
			if (this.zonerange == "2-50" || this.zonerange == "2-13" || this.zonerange == "200-299" || this.zonerange == "100-199" || this.zonerange == "400-499" || this.zonerange == "600-699" || this.zonerange == "900-999") {
				this.createSeriesFromAC_morezoneChart(tempAC);
			}
		}
	}

	async createSeriesFromAC_morezone(collection: any) {

		var charDesc: string = "ground";
		if (this.zonechargetype == null)
			this.zonechargetype == "SHP_FRT+ACC";
		var seriescount: any = [];
		for (var loop = 0; loop < collection.length; loop++) {

			var t004ChargeDescObj = collection[loop];

			if (t004ChargeDescObj != null) {

				if (t004ChargeDescObj.chargetype == this.zonechargetype) {


					var netamountcurrency = t004ChargeDescObj.netamount;
					var netamount = "Net" + "\n" + "--------------\n" + "Total" + ":" + netamountcurrency + " \n";
					var countfomatterpackegequntity = t004ChargeDescObj.packagequantity;
					var packagequantity = "Package Count" + "\n" + "--------------\n" + "Total" + ":" + countfomatterpackegequntity + " \n";
					if (this.zonerange == "2-50" || this.zonerange == "2-13" || this.zonerange == "200-299" || this.zonerange == "100-199" || this.zonerange == "400-499" || this.zonerange == "600-699" || this.zonerange == "900-999") {

						if (t004ChargeDescObj.zone == "102" || t004ChargeDescObj.zone == "103" || t004ChargeDescObj.zone == "104" || t004ChargeDescObj.zone == "105" || t004ChargeDescObj.zone == "106" || t004ChargeDescObj.zone == "107" || t004ChargeDescObj.zone == "108" || t004ChargeDescObj.zone == "124" || t004ChargeDescObj.zone == "125" || t004ChargeDescObj.zone == "126" ||
							t004ChargeDescObj.zone == "202" || t004ChargeDescObj.zone == "203" || t004ChargeDescObj.zone == "204" || t004ChargeDescObj.zone == "205" || t004ChargeDescObj.zone == "206" || t004ChargeDescObj.zone == "207" || t004ChargeDescObj.zone == "208" || t004ChargeDescObj.zone == "224" || t004ChargeDescObj.zone == "225" || t004ChargeDescObj.zone == "226" ||
							t004ChargeDescObj.zone == "401" || t004ChargeDescObj.zone == "402" || t004ChargeDescObj.zone == "403" || t004ChargeDescObj.zone == "404" || t004ChargeDescObj.zone == "405" || t004ChargeDescObj.zone == "406" || t004ChargeDescObj.zone == "407" || t004ChargeDescObj.zone == "408" || t004ChargeDescObj.zone == "409" || t004ChargeDescObj.zone == "411" ||
							t004ChargeDescObj.zone == "412" || t004ChargeDescObj.zone == "413" || t004ChargeDescObj.zone == "420" || t004ChargeDescObj.zone == "421" || t004ChargeDescObj.zone == "481" || t004ChargeDescObj.zone == "482" || t004ChargeDescObj.zone == "484" || t004ChargeDescObj.zone == "81" || t004ChargeDescObj.zone == "82" || t004ChargeDescObj.zone == "84" ||
							t004ChargeDescObj.zone == "901" || t004ChargeDescObj.zone == "902" || t004ChargeDescObj.zone == "903" || t004ChargeDescObj.zone == "904" || t004ChargeDescObj.zone == "905" || t004ChargeDescObj.zone == "906" || t004ChargeDescObj.zone == "907" || t004ChargeDescObj.zone == "908" || t004ChargeDescObj.zone == "909" || t004ChargeDescObj.zone == "911" ||
							t004ChargeDescObj.zone == "912" || t004ChargeDescObj.zone == "913" || t004ChargeDescObj.zone == "920" || t004ChargeDescObj.zone == "921" || t004ChargeDescObj.zone == "71" || t004ChargeDescObj.zone == "72" || t004ChargeDescObj.zone == "74" || t004ChargeDescObj.zone == "601" || t004ChargeDescObj.zone == "602" || t004ChargeDescObj.zone == "603" ||
							t004ChargeDescObj.zone == "604" || t004ChargeDescObj.zone == "605" || t004ChargeDescObj.zone == "606" || t004ChargeDescObj.zone == "607" || t004ChargeDescObj.zone == "608" || t004ChargeDescObj.zone == "609" || t004ChargeDescObj.zone == "611" || t004ChargeDescObj.zone == "612" || t004ChargeDescObj.zone == "613" || t004ChargeDescObj.zone == "620" ||
							t004ChargeDescObj.zone == "621" || t004ChargeDescObj.zone == "631" || t004ChargeDescObj.zone == "632" || t004ChargeDescObj.zone == "633" || t004ChargeDescObj.zone == "634" || t004ChargeDescObj.zone == "635" || t004ChargeDescObj.zone == "636" || t004ChargeDescObj.zone == "637" || t004ChargeDescObj.zone == "638" || t004ChargeDescObj.zone == "639" ||
							t004ChargeDescObj.zone == "641" || t004ChargeDescObj.zone == "642" || t004ChargeDescObj.zone == "643" || t004ChargeDescObj.zone == "2" || t004ChargeDescObj.zone == "3" || t004ChargeDescObj.zone == "4" || t004ChargeDescObj.zone == "5" || t004ChargeDescObj.zone == "6" || t004ChargeDescObj.zone == "7" || t004ChargeDescObj.zone == "8") {
							seriescount.push({
								"MonthValue": "1",
								"Month": t004ChargeDescObj.zone,
								"Count": countfomatterpackegequntity,
								"NetAmount": netamountcurrency
							});
						}

					}
					else {
						seriescount.push({
							"MonthValue": "1",
							"Month": t004ChargeDescObj.zone,
							"Count": countfomatterpackegequntity,
							"NetAmount": netamountcurrency
						});
					}

				}
			}
			var t004ChargeDesczoneObj = collection[0];

		}
		var tempString: string = this.zonerange;
		var tempArray = tempString.split("-");

		this.fromzone = tempArray[0];
		this.tozone = tempArray[1];
		am4core.options.commercialLicense = true;
		am4core.useTheme(am4themes_animated);
		this.zone.runOutsideAngular(() => {
			let chart: any = am4core.create("zone_popup", am4charts.XYChart);
			showIndicator();
			var indicator: any;
			var indicatorInterval: any;
			function showIndicator() {


				indicator = chart.tooltipContainer.createChild(am4core.Container);
				indicator.background.fill = am4core.color("#fff");
				indicator.background.fillOpacity = 0.8;
				indicator.width = am4core.percent(100);
				indicator.height = am4core.percent(100);

				var indicatorLabel = indicator.createChild(am4core.Label);
				indicatorLabel.text = "Loading...";
				indicatorLabel.align = "center";
				indicatorLabel.valign = "middle";
				indicatorLabel.fontSize = 20;
				indicatorLabel.dy = 50;

				var hourglass = indicator.createChild(am4core.Image);
				hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
				hourglass.align = "center";
				hourglass.valign = "middle";
				hourglass.horizontalCenter = "middle";
				hourglass.verticalCenter = "middle";
				hourglass.scale = 0.7;


				indicator.hide(0);
				indicator.show();

				clearInterval(indicatorInterval);
				indicatorInterval = setInterval(function () {
					hourglass.animate([{
						from: 0,
						to: 360,
						property: "rotation"
					}], 2000);
				}, 3000);
			}

			function hideIndicator() {
				indicator.hide();
				clearInterval(indicatorInterval);
			}
			// Add data
			chart.data = seriescount;

			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "Month";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			categoryAxis.renderer.cellStartLocation = 0.1;
			categoryAxis.renderer.cellEndLocation = 0.9;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.title.text = "$ Net Charge";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return "$" + text;
			});
			valueAxis.min = 0;

			let countAxis = chart.yAxes.push(new am4charts.ValueAxis());
			countAxis.cursorTooltipEnabled = false; //disable axis tooltip
			countAxis.renderer.opposite = true;
			countAxis.renderer.labels.template.dx = 25;
			countAxis.title.text = "Package Count";
			countAxis.title.dx = 35;
			countAxis.min = 0;

			// Create series
			let series2 = chart.series.push(new am4charts.ColumnSeries());
			series2.dataFields.valueY = "NetAmount";
			series2.dataFields.categoryX = "Month";
			series2.yAxis = valueAxis;
			series2.name = "Net Amount";
			series2.clustered = true;
			series2.tooltipText = "Zone: [bold]{categoryX}[/] \n Net  Charge :$ [bold]{valueY.formatNumber('#,###.00')}[/]";
			series2.columns.template.width = am4core.percent(80);

			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "Count";
			series.dataFields.categoryX = "Month";
			series.yAxis = countAxis;
			series.name = "Package Count";
			series.clustered = true;
			series.tooltipText = "Zone: [bold]{categoryX}[/] \n Package Count : [bold]{valueY}[/]";
			series.columns.template.fillOpacity = 0.9;
			series.columns.template.width = am4core.percent(80);

			chart.cursor = new am4charts.XYCursor();
			chart.cursor.lineX.strokeOpacity = 0;
			chart.cursor.lineY.strokeOpacity = 0;
			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
				countAxis.title.fill = am4core.color("#fff");
				countAxis.renderer.labels.template.fill = am4core.color("#fff");
				countAxis.renderer.grid.template.strokeOpacity = 1;
				countAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				countAxis.renderer.grid.template.strokeWidth = 2;
			}
			this.zone_popupChart = chart;
			if (seriescount.length > 0) {
				hideIndicator();
			}
		});
	}

	async createSeriesFromAC_morezoneChart(collection: any) {
		var charDesc: string = "ground";
		if (this.zonechargetype == null)
			this.zonechargetype == "SHP_FRT+ACC";
		var seriescount: any = [];
		for (var loop = 0; loop < collection.length; loop++) {

			var t004ChargeDescObj = collection[loop];

			if (t004ChargeDescObj != null) {

				if (t004ChargeDescObj.chargetype == this.zonechargetype) {


					var netamountcurrency = t004ChargeDescObj.netamount;
					var netamount = "Value" + "\n" + "--------------\n" + "Total" + ":" + netamountcurrency + " \n";
					var countfomatterpackegequntity = t004ChargeDescObj.packagequantity;
					var packagequantity = "Package Count" + "\n" + "--------------\n" + "Total" + ":" + countfomatterpackegequntity + " \n";
					if (this.zonerange == "2-50" || this.zonerange == "2-13" || this.zonerange == "200-299" || this.zonerange == "100-199" || this.zonerange == "400-499" || this.zonerange == "600-699" || this.zonerange == "900-999") {
						if (t004ChargeDescObj.zone == "132" || t004ChargeDescObj.zone == "133" || t004ChargeDescObj.zone == "134" || t004ChargeDescObj.zone == "135" || t004ChargeDescObj.zone == "136" || t004ChargeDescObj.zone == "137" || t004ChargeDescObj.zone == "138" ||
							t004ChargeDescObj.zone == "242" || t004ChargeDescObj.zone == "243" || t004ChargeDescObj.zone == "244" || t004ChargeDescObj.zone == "245" || t004ChargeDescObj.zone == "246" || t004ChargeDescObj.zone == "247" || t004ChargeDescObj.zone == "248" ||
							t004ChargeDescObj.zone == "451" || t004ChargeDescObj.zone == "452" || t004ChargeDescObj.zone == "453" || t004ChargeDescObj.zone == "454" || t004ChargeDescObj.zone == "455" || t004ChargeDescObj.zone == "456" || t004ChargeDescObj.zone == "457" ||
							t004ChargeDescObj.zone == "458" || t004ChargeDescObj.zone == "459" || t004ChargeDescObj.zone == "461" || t004ChargeDescObj.zone == "462" || t004ChargeDescObj.zone == "463" || t004ChargeDescObj.zone == "470" || t004ChargeDescObj.zone == "471" ||
							t004ChargeDescObj.zone == "491" || t004ChargeDescObj.zone == "494" || t004ChargeDescObj.zone == "91" || t004ChargeDescObj.zone == "94" || t004ChargeDescObj.zone == "951" || t004ChargeDescObj.zone == "952" || t004ChargeDescObj.zone == "953" ||
							t004ChargeDescObj.zone == "954" || t004ChargeDescObj.zone == "955" || t004ChargeDescObj.zone == "956" || t004ChargeDescObj.zone == "957" || t004ChargeDescObj.zone == "958" || t004ChargeDescObj.zone == "959" || t004ChargeDescObj.zone == "961" ||
							t004ChargeDescObj.zone == "962" || t004ChargeDescObj.zone == "963" || t004ChargeDescObj.zone == "970" || t004ChargeDescObj.zone == "971" || t004ChargeDescObj.zone == "61" || t004ChargeDescObj.zone == "64" || t004ChargeDescObj.zone == "651" ||
							t004ChargeDescObj.zone == "652" || t004ChargeDescObj.zone == "653" || t004ChargeDescObj.zone == "654" || t004ChargeDescObj.zone == "655" || t004ChargeDescObj.zone == "656" || t004ChargeDescObj.zone == "657" || t004ChargeDescObj.zone == "658" ||
							t004ChargeDescObj.zone == "659" || t004ChargeDescObj.zone == "661" || t004ChargeDescObj.zone == "662" || t004ChargeDescObj.zone == "663" || t004ChargeDescObj.zone == "670" || t004ChargeDescObj.zone == "671" || t004ChargeDescObj.zone == "681" ||
							t004ChargeDescObj.zone == "682" || t004ChargeDescObj.zone == "683" || t004ChargeDescObj.zone == "684" || t004ChargeDescObj.zone == "685" || t004ChargeDescObj.zone == "686" || t004ChargeDescObj.zone == "687" || t004ChargeDescObj.zone == "688" ||
							t004ChargeDescObj.zone == "689" || t004ChargeDescObj.zone == "691" || t004ChargeDescObj.zone == "692" || t004ChargeDescObj.zone == "693" || t004ChargeDescObj.zone == "44" || t004ChargeDescObj.zone == "45" || t004ChargeDescObj.zone == "46" ||
							t004ChargeDescObj.zone == "9" || t004ChargeDescObj.zone == "10" || t004ChargeDescObj.zone == "11" || t004ChargeDescObj.zone == "12" || t004ChargeDescObj.zone == "13") {
							seriescount.push({
								"MonthValue": "1",
								"Month": t004ChargeDescObj.zone,
								"Count": countfomatterpackegequntity,
								"NetAmount": netamountcurrency
							});
						}

					}

				}
			}
			var t004ChargeDesczoneObj = collection[0];

		}
		var tempString: string = this.zonerange;
		var tempArray = tempString.split("-");

		this.fromzone = tempArray[0];
		this.tozone = tempArray[1];
		am4core.options.commercialLicense = true;
		am4core.useTheme(am4themes_animated);
		this.zone.runOutsideAngular(() => {
			let chart: any = am4core.create("zonechart_popup", am4charts.XYChart);
			showIndicator();
			var indicator: any;
			var indicatorInterval: any;
			function showIndicator() {


				indicator = chart.tooltipContainer.createChild(am4core.Container);
				indicator.background.fill = am4core.color("#fff");
				indicator.background.fillOpacity = 0.8;
				indicator.width = am4core.percent(100);
				indicator.height = am4core.percent(100);

				var indicatorLabel = indicator.createChild(am4core.Label);
				indicatorLabel.text = "Loading...";
				indicatorLabel.align = "center";
				indicatorLabel.valign = "middle";
				indicatorLabel.fontSize = 20;
				indicatorLabel.dy = 50;

				var hourglass = indicator.createChild(am4core.Image);
				hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
				hourglass.align = "center";
				hourglass.valign = "middle";
				hourglass.horizontalCenter = "middle";
				hourglass.verticalCenter = "middle";
				hourglass.scale = 0.7;


				indicator.hide(0);
				indicator.show();

				clearInterval(indicatorInterval);
				indicatorInterval = setInterval(function () {
					hourglass.animate([{
						from: 0,
						to: 360,
						property: "rotation"
					}], 2000);
				}, 3000);
			}

			function hideIndicator() {
				indicator.hide();
				clearInterval(indicatorInterval);
			}
			// Add data
			chart.data = seriescount;

			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "Month";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			categoryAxis.renderer.cellStartLocation = 0.1;
			categoryAxis.renderer.cellEndLocation = 0.9;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.title.text = "$ Net Charge";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return "$" + text;
			});
			valueAxis.min = 0;

			let countAxis = chart.yAxes.push(new am4charts.ValueAxis());
			countAxis.cursorTooltipEnabled = false; //disable axis tooltip
			countAxis.renderer.opposite = true;
			countAxis.renderer.labels.template.dx = 25;
			countAxis.title.text = "Package Count";
			countAxis.title.dx = 35;
			countAxis.min = 0;

			// Create series
			let series2 = chart.series.push(new am4charts.ColumnSeries());
			series2.dataFields.valueY = "NetAmount";
			series2.dataFields.categoryX = "Month";
			series2.yAxis = valueAxis;
			series2.name = "Net Amount";
			series2.clustered = true;
			series2.tooltipText = "Zone: [bold]{categoryX}[/] \n Net  Charge :$ [bold]{valueY.formatNumber('#,###.00')}[/]";
			series2.columns.template.width = am4core.percent(80);

			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "Count";
			series.dataFields.categoryX = "Month";
			series.yAxis = countAxis;
			series.name = "Package Count";
			series.clustered = true;
			series.tooltipText = "Zone: [bold]{categoryX}[/] \n Package Count : [bold]{valueY}[/]";
			series.columns.template.fillOpacity = 0.9;
			series.columns.template.width = am4core.percent(80);

			chart.cursor = new am4charts.XYCursor();
			chart.cursor.lineX.strokeOpacity = 0;
			chart.cursor.fullWidthLineX = true;
			chart.cursor.lineY.disabled = true;
			// columnSeries.tooltipText = "{name}\n{dateX}: {valueY}";

			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
				countAxis.title.fill = am4core.color("#fff");
				countAxis.renderer.labels.template.fill = am4core.color("#fff");
				countAxis.renderer.grid.template.strokeOpacity = 1;
				countAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				countAxis.renderer.grid.template.strokeWidth = 2;
			}
			this.zone_popupChartTwo = chart;
			if (seriescount.length > 0) {
				hideIndicator();
			}
		});

	}


	async saveOrUpdateReportLogResult(result: any) {

		this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
		this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
		this.commonService._setInterval(this.reportsFormGroup.value);
		this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");



	}
	openModal(alertVal: any) {
		const dialogConfig = this.dialog.open(AlertPopupComponent, {
			width: '470px',
			height: 'auto',
			data: { pageValue: alertVal },
			panelClass: this.panelClass
		});
	}
	async linkfrt_clickHandler(event: any) {
		this.zonechargetype = "SHP_FRT";
		await this.loadAC(this.tempfrtAC, this.year, this.month, this.zonechargetype, this.zoneflag, this.zonerange);

	}

	async linkfrtacc_clickHandler(event: any) {
		if (this.zoneflag == 1)
			return;
		if (this.zonechargetype != "SHP_FRT+ACC") {
			this.zonechargetype = "SHP_FRT+ACC";
			await this.loadAC(this.tempfrtAC, this.year, this.month, this.zonechargetype, this.zoneflag, this.zonerange);
		}

	}

	async radiobutton_clickHandler() {
		var t007_reportlogobj: any = {};
		var designFileName = "ZONE_DISTRIBUTION";
		var reportName = "Zone Report"
		await this.commonService.getUserprofileData().then(
			result => {
				this.userProfile = result[0];
				t007_reportlogobj['fromDate'] = this.fromdateReport;
				t007_reportlogobj['toDate'] = this.todateReport;
				t007_reportlogobj['moduleName'] = "zonepopupmodule";
				t007_reportlogobj['login_id'] = this.loginId.toString();
				t007_reportlogobj['t001ClientProfile'] = this.userProfile;
				var zonechargetype = this.dashBoardSHP.get('chargetypevalue')?.value;
				if (zonechargetype == "SHP_FRT") {
					designFileName = "ZONE_DISTRIBUTION_FRT";
					reportName = "Zone Frt Report"
				} else {
					designFileName = "ZONE_DISTRIBUTION";
					reportName = "Zone Frt With Acc Report"
				}
				t007_reportlogobj['reportType'] = designFileName;
				t007_reportlogobj['reportName'] = reportName;
				t007_reportlogobj['designFileName'] = designFileName;
				t007_reportlogobj['status'] = 'IN QUEUE';
				t007_reportlogobj['reportFormat'] = "CSV";
				t007_reportlogobj['clientId'] = this.clientId;
				t007_reportlogobj['clientname'] = this.clientName;
				t007_reportlogobj['crmaccountNumber'] = "NA";
				t007_reportlogobj['accountNumber'] = "NA";
				t007_reportlogobj['chargeDesc'] = "";
				t007_reportlogobj['fZone'] = this.fromzone;
				t007_reportlogobj['tZone'] = this.tozone;
				this.httpClientService.runReport(t007_reportlogobj).subscribe(
					result => {
						this.saveOrUpdateReportLogResult(result);
					}, error => {
					});
			}, error => {
				console.log("error", error);
			});
	}

	ngOnDestroy() {
		this.zone.runOutsideAngular(() => {

			if (this.zone_popupChart) {
				this.zone_popupChart.dispose();
			}

			if (this.zone_popupChartTwo) {
				this.zone_popupChartTwo.dispose();
			}
		});
	}
}
