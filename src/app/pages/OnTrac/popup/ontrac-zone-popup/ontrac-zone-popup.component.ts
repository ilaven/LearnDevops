import { Component, OnInit, OnDestroy, NgZone, Optional, Inject, signal, ChangeDetectorRef } from "@angular/core";
import { UntypedFormGroup, UntypedFormControl } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { HttpOntracService } from "src/app/core/services/httpontrac.service";
@Component({
	selector: 'app-ontrac-zone-popup',
	templateUrl: './ontrac-zone-popup.component.html',
	styleUrls: ['./ontrac-zone-popup.component.css'],
	standalone: false
})
export class OntracZonePopupComponent implements OnInit, OnDestroy {
	private zone_popupChart!: am4charts.XYChart;
	private _zoneSub!: Subscription;
	moreviewZoneFormGroup: UntypedFormGroup;
	dashBoardSHP: UntypedFormGroup;
	fromPage;
	invoiceMonth;
	invoiceyear;
	clientId;
	clientName;
	groupby: any;
	group: any;
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
	accountNumber: any;
	tozone: any;
	themeoption;
	panelClass;
	titleChart1 = signal<any>('');
	titleChart2 = signal<any>('');
	constructor(
		public dialog: MatDialog,
		private cd: ChangeDetectorRef,
		public dialogRef: MatDialogRef<OntracZonePopupComponent>,
		private httpOntracService: HttpOntracService,
		private zone: NgZone,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

		this.dashBoardSHP = new UntypedFormGroup({
			chargetypevalue: new UntypedFormControl('FRT+ACC')
		});
		this.fromPage = data.popupValue;
		this.panelClass = data.panelClass;
		this.invoiceMonth = this.fromPage.invoiceMonth;
		this.invoiceyear = this.fromPage.invoiceyear;
		this.clientId = this.fromPage.clientId;
		this.clientName = this.fromPage.clientName;
		this.accountNumber = this.fromPage.accountNumber;
		this.themeoption = this.fromPage.themeoption;
		this.categoryName = this.fromPage.eventCategory;
		this.chargetypevalue.set(this.fromPage.chargetypevalue);
		this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
		var pointVal = this.fromPage.chargeDescription;
		var pointName = pointVal.replace(/\s/g, "");

		const zoneMatch = pointName.match(/Zone(\d)/);
		this.pointName = zoneMatch ? zoneMatch[1] : "2";
		this.chargeDescription = this.fromPage.chargeDescription;
		this.moreviewZoneFormGroup = new UntypedFormGroup({
			clientName: new UntypedFormControl(this.clientName),
			clientId: new UntypedFormControl(this.clientId),
			accountNumber: new UntypedFormControl(this.accountNumber),
			invoicemonth: new UntypedFormControl(this.invoiceMonth),
			month: new UntypedFormControl(this.invoiceMonth),
			year: new UntypedFormControl(this.invoiceyear),
			pointName: new UntypedFormControl(this.pointName)
		})
	}
	closeDialog() {
		this.dialogRef.close(true);
	}
	ngOnInit() {
		console.log(this.fromPage)
		this.bindingTitle();
		this.fetchselectedzone();
	}
	async linkshpChange(data: any) {
		this.dashBoardSHP.get('chargetypevalue')?.setValue(data);
			this.chargetypevalue.set(data);
		this.bindingTitle();
		if (data == "FRT") {
			await this.linkfrt_clickHandler(data);
		}
		if (data == "FRT+ACC" || data == null) {
			await this.linkfrtacc_clickHandler(data);
		}
	
	}
	async linkfrt_clickHandler(event: any) {
		this.zonechargetype = "FRT";
		await this.loadAC(this.tempfrtAC, this.year, this.month, this.zonechargetype, this.zonerange);
	}

	async linkfrtacc_clickHandler(event: any) {
		this.zonechargetype = "FRT+ACC";
		await this.loadAC(this.tempfrtAC, this.year, this.month, this.zonechargetype, this.zonerange);
	}
	bindingTitle() {
		var monthData = this.moreviewZoneFormGroup.get('month')?.value;
		this.yearBindingTitle = this.moreviewZoneFormGroup.get('year')?.value;
		if (monthData == null) {
			this.monthBindingTitle = "";
		} else {
			var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			this.monthBindingTitle = monthArray[monthData];
		}
	}
	fetchselectedzone() {
		this._zoneSub = this.httpOntracService.fetchSelectedZone(this.moreviewZoneFormGroup.value).subscribe(
			(result: any) => {
				this.resultAc = result;
				this.loadAC(this.resultAc, this.invoiceyear, this.invoiceMonth, this.chargetypevalue(), this.pointName)
					.catch((err: any) => console.error('loadAC error:', err));
			},
			(error: any) => {
				console.log('error ', error);
			});
	}
	async loadAC(tempAC: any, Clickedyear: String, Clickedmonth: String, chargetypevalue: String, selectedrange: String) {
		const MONTH_INFO: Record<string, { name: string; end: string }> = {
			Jan: { name: 'January', end: '-01-31' },
			Feb: { name: 'February', end: '-02-28' },
			Mar: { name: 'March', end: '-03-31' },
			Apr: { name: 'April', end: '-04-30' },
			May: { name: 'May', end: '-05-31' },
			Jun: { name: 'June', end: '-06-30' },
			Jul: { name: 'July', end: '-07-31' },
			Aug: { name: 'August', end: '-08-31' },
			Sep: { name: 'September', end: '-09-30' },
			Oct: { name: 'October', end: '-10-31' },
			Nov: { name: 'November', end: '-11-30' },
			Dec: { name: 'December', end: '-12-31' },
		};
		this.zonerange = selectedrange;
		const selectedmonth = Number(Clickedmonth);
		const monthArray = [Clickedyear, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		this.month = monthArray[selectedmonth];
		this.year = Clickedyear;
		this.zonechargetype = chargetypevalue;
		this.tempfrtAC = tempAC;

		if (Clickedyear == this.month && tempAC != null && tempAC.length != 0) {
			this.txtzone_text = "Zone for " + this.year;
			this.fromdateReport = this.year + "-01-01";
			this.todateReport = this.year + "-12-31";
		} else {
			const info = MONTH_INFO[this.month as string];
			if (info) {
				this.fullmonth = info.name;
				this.fromdateReport = this.year + "-" + (selectedmonth < 10 ? '0' + selectedmonth : selectedmonth) + "-01";
				let endDate = info.end;
				// Fix leap year bug: correctly override Feb end date
				if (this.month === 'Feb') {
					const yr = Number(this.year);
					const isLeap = (yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0);
					endDate = isLeap ? '-02-29' : '-02-28';
				}
				this.todateReport = this.year + endDate;
			} else {
				this.fullmonth = "";
			}
			this.txtzone_text = "Zone for " + this.year + " " + this.fullmonth;
		}

		if (tempAC != null && tempAC.length != 0) {
			this.createSeriesFromAC_morezone(tempAC);
		}
	}
	async createSeriesFromAC_morezone(collection: any) {
		if (this.zonechargetype == null)
			this.zonechargetype = "FRT+ACC";
		var seriescount: any = [];
		for (var loop = 0; loop < collection.length; loop++) {
			var t004ChargeDescObj = collection[loop];
			if (t004ChargeDescObj != null) {
				if (t004ChargeDescObj.chargeType == this.zonechargetype) {
					const netamountcurrency = t004ChargeDescObj.netCharge;
					const countfomatterpackegequntity = t004ChargeDescObj.volumeCount;

					seriescount.push({
						"MonthValue": "1",
						// "Month": t004ChargeDescObj.zone,
						"Month": "",
						"Count": countfomatterpackegequntity,
						"NetAmount": netamountcurrency
					});

				}
			}
		}
		const tempArray = (this.zonerange as string).split("-");
		this.fromzone = tempArray[0];
		this.tozone = tempArray[1];
		am4core.options.commercialLicense = true;
		am4core.useTheme(am4themes_animated);
		this.zone.runOutsideAngular(() => {
			if (this.zone_popupChart) { this.zone_popupChart.dispose(); }
			const chart: any = am4core.create("zone_popup", am4charts.XYChart);
			showIndicator();
			//Chart loader
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

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.title.text = "Net Charge";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return text;
			});
			valueAxis.min = 0;
			// Create series
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "Count";
			series.dataFields.categoryX = "Month";
			series.name = "Package Count";
			series.clustered = true;
			series.tooltipText = "Package Count: [bold]{valueY}[/]";
			series.columns.template.fillOpacity = 0.9;

			let series2 = chart.series.push(new am4charts.ColumnSeries());
			series2.dataFields.valueY = "NetAmount";
			series2.dataFields.categoryX = "Month";
			series2.name = "Net Amount";
			series2.clustered = true;
			series2.tooltipText = "Net Charge :$ [bold]{valueY.formatNumber('#,###.00')}[/]";

			let serieslabel = series.bullets.push(new am4charts.LabelBullet());
			serieslabel.label.text = "Package Count";
			serieslabel.label.hideOversized = false;
			serieslabel.label.fontSize = 11;
			serieslabel.locationY = 1;
			serieslabel.dy = 10;

			let series2label = series2.bullets.push(new am4charts.LabelBullet());
			series2label.label.text = "Net Charge";
			series2label.label.hideOversized = false;
			series2label.label.fontSize = 11;
			series2label.locationY = 1;
			series2label.dy = 10;

			chart.cursor = new am4charts.XYCursor();
			chart.cursor.lineX.strokeOpacity = 0;
			chart.cursor.lineY.strokeOpacity = 0;
			chart.paddingBottom = 20;
			chart.maskBullets = false;
			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
			}
			this.zone_popupChart = chart;
			if (seriescount.length > 0) {
				hideIndicator();
			}
		});
	}
	radiobutton_clickHandler() {
		const urlParam: any = {};
		const month = this.moreviewZoneFormGroup.get('month')?.value;
		urlParam['fromdate'] = this.fromdateReport;
		urlParam['todate'] = this.todateReport;
		urlParam['action'] = "ZoneChartServiceExcel";
		urlParam['year'] = this.moreviewZoneFormGroup.get('year')?.value;
		urlParam['chargemonth'] = month;
		urlParam['clientId'] = this.clientId;
		urlParam['clientName'] = this.clientName;
		urlParam['chargetyperesult'] = this.dashBoardSHP.get('chargetypevalue')?.value;
		urlParam['accountnumber'] = this.accountNumber;
		urlParam['pointnumber'] = this.fromzone;
		var fields_string: any = "";
		for (const [key, value] of Object.entries(urlParam)) {
			fields_string += key + '=' + value + '&';
		}

		this.httpOntracService.reportServlet(fields_string);
	}
	ngOnDestroy() {
		this._zoneSub?.unsubscribe();
		this.zone.runOutsideAngular(() => {
			if (this.zone_popupChart) {
				this.zone_popupChart.dispose();
			}
		});
	}
}
