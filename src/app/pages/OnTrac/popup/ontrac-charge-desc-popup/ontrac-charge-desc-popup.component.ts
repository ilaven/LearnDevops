import { DatePipe } from "@angular/common";
import { Component, OnInit, NgZone, Optional, Inject, signal } from "@angular/core";
import { FormGroup, FormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from "src/app/core/services/common.service";
import { HttpOntracService } from "src/app/core/services/httpontrac.service";
@Component({
	selector: 'app-ontrac-charge-desc-popup',
	templateUrl: './ontrac-charge-desc-popup.component.html',
	styleUrls: ['./ontrac-charge-desc-popup.component.css'],
	standalone: false
})
export class OntracChargeDescPopupComponent implements OnInit {
	private volume_weightChart!: am4charts.XYChart;
	private average_costChart!: am4charts.XYChart;
	private weight_disPopupChart!: am4charts.XYChart;
	private spendByMonthChart!: am4charts.XYChart;
	private acc_noChart!: am4charts.XYChart;
	reportsFormGroup = new FormGroup({
		reportLogId: new FormControl(''),
		t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
	});
	dashBoardSHP: FormGroup;
	fromPage
	invoiceMonth: any;
	invoiceyear: any;
	clientId
	clientName
	groupBy: any;
	groupby: any;
	chargeDescription
	chargetypevalue = signal<any>('');
	pie_popupAC = [];
	moreviewChargeDescFormGroup: FormGroup;
	chargetitle: any;
	year: any;
	weightAC: any;
	chargedesctype;
	chargetypeflag: any;
	group: any;
	resultObj: any;
	moreviewWeightFormGroup!: FormGroup;
	ByServiceAc = [];
	ByServicefrtAc = [];
	weightchargetype: any;
	weight_mainAC: any;
	weightdisttxt_text: any;
	from: any;
	to: any;
	fromACC: any;
	toACC: any;
	month: any;
	fun_monthAC: any;
	commonAC: any[] = [];
	t004tempObj: any = {};
	tempt004AC: any = [];
	acclink_id_styleName: any;
	frtlink_id_styleName: any;
	frtacc_btn_selected: any;
	frt_btn_this_selected: any;
	weightfrtAC = [];
	hashMapObjData = new Map();
	hashMapFRTObjData = new Map();
	hashMapObj = new Map();
	chargedistritxt_text: any;
	chargedescriptionserviceAC = [];
	chargedesfrtserviceAC = [];
	volume_by_chargedescriptionserviceAC = [];
	Sccvolume_by_chargedescriptionserviceAC = [];
	volume_bychargedesfrtserviceAC = [];
	t000topStateObj: any;
	ten_StateAC_Reveiver = [];
	ten_StateACfrt_Reveiver = [];
	commonACSHP_FRT: any[] = [];
	commonACSHP_FRT_ACC: any[] = [];
	serviceAccAC: any[] = [];
	previous_id_visible: any;
	first_id_visible: any;
	next_id_visible: any;
	accountprev = [];
	accountsAC = [];
	chargeType_title: any;
	services_title: any;
	clientname: any;
	yearData_title: any;
	monthData_title: any;
	themeoption: any;
	resultData = signal<any>([]);
	moreviewChargeDescFormGroupUPS!: FormGroup;
	apiControllerFormGroup: FormGroup;
	moreviewChargeDescFormGroupNew!: FormGroup;
	panelClass: any;

	clientProfile = [];
	accountNumber: any;
	dataasof;
	constructor(public dialogRef: MatDialogRef<OntracChargeDescPopupComponent>, private mlForm: UntypedFormBuilder, private dialog: MatDialog,
		private datePipe: DatePipe, private commonService: CommonService, private httpOntracService: HttpOntracService, private zone: NgZone,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {


		this.dashBoardSHP = new FormGroup({
			chargetypevalue: new FormControl('FRT+ACC')
		});


		this.fromPage = data.popupValue;
		if (this.fromPage.accountNumber == "ALL") { this.accountNumber = null; }
		else { this.accountNumber = this.fromPage.accountNumber; }
		this.month = this.fromPage.month;
		this.year = this.fromPage.year;
		this.clientId = this.fromPage.clientId;
		this.clientName = this.fromPage.clientName;
		this.groupBy = this.fromPage.groupBy;
		this.chargeDescription = this.fromPage.groupBy;
		this.themeoption = this.fromPage.themeoption;
		this.dataasof = this.data.dataasof;
		var clientname = this.clientName.replace(/[^a-zA-Z0-9]/g, "");
		this.chargetypevalue.set(this.fromPage.chargetypevalue);
		this.chargedesctype = this.fromPage.chargetypevalue;
		this.clientProfile = this.fromPage.clientProfile;
		this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
		this.moreviewChargeDescFormGroup = new FormGroup({
			clientName: new FormControl(this.clientName),
			clientId: new FormControl(this.clientId),
			month: new FormControl(this.month),
			year: new FormControl(this.year),
			chargeDescription: new FormControl(this.groupBy),
			groupBy: new FormControl(this.groupBy),
			group: new FormControl(this.groupBy),
			services: new FormControl(this.groupBy),
			clientname: new FormControl(clientname),
			accountNumber: new FormControl(this.accountNumber),
		})
		this.moreviewChargeDescFormGroupNew = new FormGroup({
			clientName: new FormControl(this.clientName),
			clientId: new FormControl(this.clientId),
			invoiceMonth: new FormControl(this.invoiceMonth),
			invoicemonth: new FormControl(this.invoiceMonth),
			month: new FormControl(this.invoiceMonth),
			year: new FormControl(this.invoiceyear),
			chargeDescription: new FormControl(this.groupby),
			groupBy: new FormControl(this.groupby),
			group: new FormControl(this.groupby),
			services: new FormControl(this.groupby),
			invoiceyear: new FormControl(this.invoiceyear),
			clientname: new FormControl(clientname),
			accountNumber: new FormControl(this.accountNumber)
		})

		this.apiControllerFormGroup = new FormGroup({
			//action: new FormControl('Fetch'),
			// key: new FormControl('fn_groupedservices_popup'),    
			clientId: new FormControl(this.clientId),
			fromDate: new FormControl(''),
			toDate: new FormControl(''),
			tableName: new FormControl(''),
			clientName: new FormControl(''),
			//chargeType:new FormControl('FRTWithAcc'),
			serviceType: new FormControl(''),
			groupBy: new FormControl(''),
			month: new FormControl(''),
			year: new FormControl(''),
			accountNumber: new FormControl(''),
		});
	}

	ngOnInit() {
		console.log(this.fromPage);
		this.bindingTitle();
		this.dragpanel_initializeHandler();
		this.fetchDashBoardCharts();
	}
	closeDialog() {
		this.dialogRef.close(true);
	}
	async fetchDashBoardCharts() {
		this.httpOntracService.fetchByServicesPopupCharts(this.moreviewChargeDescFormGroup.value).subscribe(
			(result:any) => {
				this.pie_popupAC = result;
				this.loadAC(this.pie_popupAC, this.invoiceyear, this.invoiceMonth + "", this.chargeDescription, this.chargetypevalue());
			},
			(error:any) => {
				console.log('error ', error);

			})
	}
	async dragpanel_initializeHandler() {
		await this.hashMapObj.set("1", "JAN");
		await this.hashMapObj.set("2", "FEB");
		await this.hashMapObj.set("3", "MAR");
		await this.hashMapObj.set("4", "APR");
		await this.hashMapObj.set("5", "MAY");
		await this.hashMapObj.set("6", "JUN");
		await this.hashMapObj.set("7", "JULY");
		await this.hashMapObj.set("8", "AUG");
		await this.hashMapObj.set("9", "SEP");
		await this.hashMapObj.set("10", "OCT");
		await this.hashMapObj.set("11", "NOV");
		await this.hashMapObj.set("12", "DEC");
	}
	async bindingTitle() {
		this.yearData_title = this.moreviewChargeDescFormGroup.get('year')?.value;
		var monthData_title = this.moreviewChargeDescFormGroup.get('month')?.value;
		var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		if (monthData_title == 0) {
			this.monthData_title = "";
		}
		else {
			this.monthData_title = monthArray[monthData_title - 1];
		}
		this.chargeType_title = this.dashBoardSHP.get('chargetypevalue')?.value;

		this.services_title = this.moreviewChargeDescFormGroup.get('services')?.value;
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
	
	async reportExcelDownload(event: any) {
		var urlParam: any = {};
		var clickedMonth = await this.moreviewChargeDescFormGroup.get('month')?.value;
		var clickedYear = await this.moreviewChargeDescFormGroup.get('year')?.value;
		var clientName = await this.moreviewChargeDescFormGroup.get('clientName')?.value;
		var clientId = await this.moreviewChargeDescFormGroup.get('clientId')?.value;
		var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
		var chargeDescription = await this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
		var accountNumber = await this.moreviewChargeDescFormGroup.get('accountNumber')?.value;
		if (clickedMonth == null) { var month = 0; } else { month = clickedMonth; }
		if (month == 0) {
			urlParam['fromdate'] = clickedYear + "-01" + "-01";
			urlParam['todate'] = clickedYear + "-12" + "-31";
		}
		else {
			var date = new Date(clickedYear, month, 0);
			var lastDay = date.getDate();
			urlParam['fromdate'] = clickedYear + "-" + month + "-01";
			urlParam['todate'] = clickedYear + "-" + month + "-" + lastDay;
		}
		urlParam['action'] = event;
		urlParam['chargedesc'] = chargeDescription;
		urlParam['year'] = clickedYear;
		urlParam['chargemonth'] = clickedMonth;
		urlParam['clientId'] = clientId;
		urlParam['clientName'] = clientName;
		urlParam['accountnumber'] = accountNumber;
		urlParam['chargetyperesult'] = chargetypevalue;
		var fields_string: any = "";
		for (const [key, value] of Object.entries(urlParam)) {
			fields_string += key + '=' + value + '&';
		}
		this.httpOntracService.reportServlet(fields_string);
	}
	async loadAC(weightAC1: any, currentyear: String, currentmonth: String, clickedChargeDesc: String, chargetypevalue: String) {
		this.chargetitle = clickedChargeDesc;
		this.month = currentmonth;
		this.year = currentyear;
		this.weightAC = weightAC1;
		this.chargedescriptionserviceAC = weightAC1;
		this.chargedesctype = chargetypevalue;
		var chargedesctype = chargetypevalue;
		this.chargetypeflag = chargetypevalue;
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC";
		this.volume_by_chargedescriptionserviceAC = weightAC1;
		this.SpendByMonth();
		var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		if (this.month == '0') {
			this.chargedistritxt_text = "Charge Distribution and Services For" + " " + this.chargetitle + " " + this.year;
		}
		else {
			var monthnumber = Number(this.month);
			this.chargedistritxt_text = "Charge Distribution and Services For" + " " + this.chargetitle + " " + this.year + " " + monthArray[Number(monthnumber - 1)];
		}
	}
	async SpendByMonth() {
		this.httpOntracService.fetchServiceSpendByMonth(this.moreviewChargeDescFormGroup.value).subscribe(
			(result:any) => {
				this.fun_monthAC = result;
				this.fun_month(this.fun_monthAC);
			},
			(error:any) => {
				console.log('error ', error);
			})
	}
	linkflag = 0;
	async linkfrt_clickHandler(event: any) {
		this.linkflag = 1;
		var domain_Name: String = "T004_Dashboard";
		if (this.month == null) {
			var event_type: String = "year";
		} else {
			var event_type: String = "month";
		}
		this.chargedesctype = "FRT";
		await this.fun_month(this.fun_monthAC);
	}
	async linkfrtacc_clickHandler(event: any) {
		var domain_Name: String = "T004_Dashboard";
		if (this.month == '0') {
			var event_type: String = "year";
		} else {
			var event_type: String = "month";
		}
		this.chargedesctype = "FRT+ACC";
		await this.fun_month(this.fun_monthAC);
	}
	async fun_month(arrayAC: any) {
		var invoicemonthAC: any = [];
		var totalmonth = 12;
		var monthNo = 0;
		var year: any;
		if (this.chargedesctype == "FRT+ACC")
			this.chargedesctype = null;
		for (var listcount = 0; listcount < arrayAC.length; listcount++) {
			var t004tempObj = arrayAC[listcount];

			year = t004tempObj.year;
			if (!invoicemonthAC.indexOf(t004tempObj.month))
				invoicemonthAC.push(t004tempObj.month);
		}
		var resultmonthAC = [];
		for (var monthcount = 0; monthcount < totalmonth; monthcount++) {
			monthNo++;
			if (!invoicemonthAC.indexOf(String(monthNo)))
				resultmonthAC.push(String(monthNo));
		}
		for (var loop = 0; loop < resultmonthAC.length; loop++) {
			t004tempObj.month = resultmonthAC[loop].toString();
			t004tempObj.year = year;
			arrayAC.push(t004tempObj);
		}
		for (var count = 0; count < arrayAC.length; count++) {
			var t004Obj = arrayAC[count];
			var totVaule: String = t004Obj.netCharge;
			var chargetypevalue = t004Obj.chargeType;
			var totCount = t004Obj.packageCount;
			var AvgCost = t004Obj.packageCount && Number(t004Obj.packageCount) !== 0
				? t004Obj.netCharge / t004Obj.packageCount : 0.00;
			if (t004Obj.month == "1")
				this.tempt004AC.push({ Month: "JAN", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "2")
				this.tempt004AC.push({ Month: "FEB", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "3")
				this.tempt004AC.push({ Month: "MAR", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "4")
				this.tempt004AC.push({ Month: "APR", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "5")
				this.tempt004AC.push({ Month: "MAY", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "6")
				this.tempt004AC.push({ Month: "JUN", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "7")
				this.tempt004AC.push({ Month: "JULY", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "8")
				this.tempt004AC.push({ Month: "AUG", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "9")
				this.tempt004AC.push({ Month: "SEP", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "10")
				this.tempt004AC.push({ Month: "OCT", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "11")
				this.tempt004AC.push({ Month: "NOV", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
			if (t004Obj.month == "12")
				this.tempt004AC.push({ Month: "DEC", value: totVaule, chargetyperesult: chargetypevalue, countValue: totCount, avgValue: AvgCost });
		}
		this.Spend_Month(this.tempt004AC); //---------------------------Spend By Month 

	}
	async Spend_Month(tempAC: any) {
		await this.createSeriesFromAC1(tempAC, this.chargedesctype, "Month", "value");
		await this.createSeriesFromAC2ByCount(tempAC, this.chargedesctype, "Month", "countValue");
		await this.createSeriesFromAC3ByAvg(tempAC, this.chargedesctype, "Month", "avgValue");
	}
	async createSeriesFromAC1(collection: any, chargedesctype: any, nameField: String, yField: String) {

		this.hashMapObjData.clear();

		if (collection.length > 0)

			if (chargedesctype == "FRT+ACC")
				chargedesctype = null;
		var chartData: any = [];
		for (var count = 0; count < collection.length; count++) {
			var t004Objtemp = collection[count];
			if (t004Objtemp.chargetyperesult == "ACC") {
				var month: any;

				if (t004Objtemp.Month == "JAN")
					month = "1";
				if (t004Objtemp.Month == "FEB")
					month = "2";
				if (t004Objtemp.Month == "MAR")
					month = "3";
				if (t004Objtemp.Month == "APR")
					month = "4";
				if (t004Objtemp.Month == "MAY")
					month = "5";
				if (t004Objtemp.Month == "JUN")
					month = "6";
				if (t004Objtemp.Month == "JULY")
					month = "7";
				if (t004Objtemp.Month == "AUG")
					month = "8";
				if (t004Objtemp.Month == "SEP")
					month = "9";
				if (t004Objtemp.Month == "OCT")
					month = "10";
				if (t004Objtemp.Month == "NOV")
					month = "11";
				if (t004Objtemp.Month == "DEC")
					month = "12";

				var yField: String = t004Objtemp.value;
				this.hashMapObjData.set("" + month, t004Objtemp);
			}
		}
		for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
			var dataLoop_val = dataLoop + 1 + "";
			var t004Obj = this.hashMapObjData.get(dataLoop_val);
			if (t004Obj != null) {
				var Month: String = t004Obj.Month;
				var yField: String = t004Obj.value;
				var monthStr: String = this.hashMapObj.get(t004Obj.Month) as String;
				chartData.push({ "Month": Month, "value": yField });
			}
		}
		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("spendByMonth", am4charts.XYChart);
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
			am4core.useTheme(am4themes_animated);
			am4core.options.commercialLicense = true;
			// Themes end
			chart.scrollbarX = new am4core.Scrollbar();

			// Add data
			chart.data = chartData;
			var minNegVal = false;
			for (var loop = 0; loop < chartData.length; loop++) {
				var netAmtArray = chartData;
				var netamt = netAmtArray[loop].value;
				if (netamt < 0) {
					minNegVal = true;
					break;
				}
			}
			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "Month";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			categoryAxis.tooltip.disabled = true;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.renderer.minWidth = 50;
			valueAxis.title.text = "$ Net Charge";
			valueAxis.title.fontWeight = "bold";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return "$" + text;
			});
			if (minNegVal == false) {
				valueAxis.min = 0;
			}
			// Create series
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.sequencedInterpolation = true;
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "Month";
			series.tooltipText = "Month: [bold]{categoryX}[/]  \n Net Charge: $[bold]{valueY.formatNumber('#,###.00')}";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.strokeWidth = 0;

			series.tooltip.pointerOrientation = "vertical";

			series.columns.template.column.cornerRadiusTopLeft = 10;
			series.columns.template.column.cornerRadiusTopRight = 10;
			series.columns.template.column.fillOpacity = 0.8;
			series.columns.template.fontSize = 12;
			// on hover, make corner radiuses bigger
			let hoverState = series.columns.template.column.states.create("hover");
			hoverState.properties.cornerRadiusTopLeft = 0;
			hoverState.properties.cornerRadiusTopRight = 0;
			hoverState.properties.fillOpacity = 1;

			series.columns.template.adapter.add("fill", function (fill: any, target: any) {
				return chart.colors.getIndex(target.dataItem.index);
			});
			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
			}
			// Cursor
			chart.cursor = new am4charts.XYCursor();
			this.spendByMonthChart = chart;
			hideIndicator();
		});
	}
	async createSeriesFromAC2ByCount(collection: any, chargedesctype: any, nameField: String, yField: String) {
		this.hashMapObjData.clear();
		if (collection.length > 0)
			if (chargedesctype == "FRT+ACC")
				chargedesctype = null;
		var chartData: any = [];
		for (var count = 0; count < collection.length; count++) {
			var t004Objtemp = collection[count];
			if (t004Objtemp.chargetyperesult == "ACC") {
				var month: any;
				if (t004Objtemp.Month == "JAN")
					month = "1";
				if (t004Objtemp.Month == "FEB")
					month = "2";
				if (t004Objtemp.Month == "MAR")
					month = "3";
				if (t004Objtemp.Month == "APR")
					month = "4";
				if (t004Objtemp.Month == "MAY")
					month = "5";
				if (t004Objtemp.Month == "JUN")
					month = "6";
				if (t004Objtemp.Month == "JULY")
					month = "7";
				if (t004Objtemp.Month == "AUG")
					month = "8";
				if (t004Objtemp.Month == "SEP")
					month = "9";
				if (t004Objtemp.Month == "OCT")
					month = "10";
				if (t004Objtemp.Month == "NOV")
					month = "11";
				if (t004Objtemp.Month == "DEC")
					month = "12";
				var yField: String = t004Objtemp.countValue;
				this.hashMapObjData.set("" + month, t004Objtemp);
			}
		}
		for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
			var dataLoop_val = dataLoop + 1 + "";
			var t004Obj = this.hashMapObjData.get(dataLoop_val);
			if (t004Obj != null) {
				var Month: String = t004Obj.Month;
				var yField: String = t004Obj.countValue;
				var monthStr: String = this.hashMapObj.get(t004Obj.Month) as String;
				chartData.push({ "Month": Month, "countValue": yField });
			}
		}
		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("countByMonth", am4charts.XYChart);

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
			am4core.useTheme(am4themes_animated);
			am4core.options.commercialLicense = true;
			// Themes end
			chart.scrollbarX = new am4core.Scrollbar();

			// Add data
			chart.data = chartData;
			var minNegVal = false;
			for (var loop = 0; loop < chartData.length; loop++) {
				var netAmtArray = chartData;
				var netamt = netAmtArray[loop].countValue;
				if (netamt < 0) {
					minNegVal = true;
					break;
				}
			}
			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "Month";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			categoryAxis.tooltip.disabled = true;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.renderer.minWidth = 50;
			valueAxis.title.text = "Count";
			valueAxis.title.fontWeight = "bold";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return text;
			});
			if (minNegVal == false) {
				valueAxis.min = 0;
			}
			// Create series
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.sequencedInterpolation = true;
			series.dataFields.valueY = "countValue";
			series.dataFields.categoryX = "Month";
			series.tooltipText = "Month: [bold]{categoryX}[/]  \n Count: [bold]{valueY.formatNumber('#,###')}";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.strokeWidth = 0;
			series.tooltip.pointerOrientation = "vertical";
			series.columns.template.column.cornerRadiusTopLeft = 10;
			series.columns.template.column.cornerRadiusTopRight = 10;
			series.columns.template.column.fillOpacity = 0.8;
			series.columns.template.fontSize = 12;
			// on hover, make corner radiuses bigger
			let hoverState = series.columns.template.column.states.create("hover");
			hoverState.properties.cornerRadiusTopLeft = 0;
			hoverState.properties.cornerRadiusTopRight = 0;
			hoverState.properties.fillOpacity = 1;

			series.columns.template.adapter.add("fill", function (fill: any, target: any) {
				return chart.colors.getIndex(target.dataItem.index);
			});
			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
			}
			// Cursor
			chart.cursor = new am4charts.XYCursor();
			this.spendByMonthChart = chart;
			hideIndicator();
		});
	}

	async createSeriesFromAC3ByAvg(collection: any, chargedesctype: any, nameField: String, yField: String) {
		this.hashMapObjData.clear();
		if (collection.length > 0)
			if (chargedesctype == "FRT+ACC")
				chargedesctype = null;
		var chartData: any = [];
		for (var count = 0; count < collection.length; count++) {
			var t004Objtemp = collection[count];
			if (t004Objtemp.chargetyperesult == "ACC") {
				var month: any;
				if (t004Objtemp.Month == "JAN")
					month = "1";
				if (t004Objtemp.Month == "FEB")
					month = "2";
				if (t004Objtemp.Month == "MAR")
					month = "3";
				if (t004Objtemp.Month == "APR")
					month = "4";
				if (t004Objtemp.Month == "MAY")
					month = "5";
				if (t004Objtemp.Month == "JUN")
					month = "6";
				if (t004Objtemp.Month == "JULY")
					month = "7";
				if (t004Objtemp.Month == "AUG")
					month = "8";
				if (t004Objtemp.Month == "SEP")
					month = "9";
				if (t004Objtemp.Month == "OCT")
					month = "10";
				if (t004Objtemp.Month == "NOV")
					month = "11";
				if (t004Objtemp.Month == "DEC")
					month = "12";
				var yField: String = t004Objtemp.avgValue;
				this.hashMapObjData.set("" + month, t004Objtemp);
			}
		}
		for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
			var dataLoop_val = dataLoop + 1 + "";
			var t004Obj = this.hashMapObjData.get(dataLoop_val);
			if (t004Obj != null) {
				var Month: String = t004Obj.Month;
				var yField: String = t004Obj.avgValue;
				var monthStr: String = this.hashMapObj.get(t004Obj.Month) as String;
				chartData.push({ "Month": Month, "avgValue": yField });
			}
		}
		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("avgCostByMonth", am4charts.XYChart);
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
			am4core.useTheme(am4themes_animated);
			am4core.options.commercialLicense = true;
			// Themes end
			chart.scrollbarX = new am4core.Scrollbar();

			// Add data
			chart.data = chartData;
			var minNegVal = false;
			for (var loop = 0; loop < chartData.length; loop++) {
				var netAmtArray = chartData;
				var netamt = netAmtArray[loop].avgValue;
				if (netamt < 0) {
					minNegVal = true;
					break;
				}
			}
			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "Month";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;
			categoryAxis.tooltip.disabled = true;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.renderer.minWidth = 50;
			valueAxis.title.text = "$ Average Cost";
			valueAxis.title.fontWeight = "bold";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return "$" + text;
			});
			if (minNegVal == false) {
				valueAxis.min = 0;
			}
			// Create series
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.sequencedInterpolation = true;
			series.dataFields.valueY = "avgValue";
			series.dataFields.categoryX = "Month";
			series.tooltipText = "Month: [bold]{categoryX}[/]  \n Avg Cost: $[bold]{valueY.formatNumber('#,###.00')}";
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			series.columns.template.strokeWidth = 0;
			series.tooltip.pointerOrientation = "vertical";
			series.columns.template.column.cornerRadiusTopLeft = 10;
			series.columns.template.column.cornerRadiusTopRight = 10;
			series.columns.template.column.fillOpacity = 0.8;
			series.columns.template.fontSize = 12;
			let hoverState = series.columns.template.column.states.create("hover");
			hoverState.properties.cornerRadiusTopLeft = 0;
			hoverState.properties.cornerRadiusTopRight = 0;
			hoverState.properties.fillOpacity = 1;

			series.columns.template.adapter.add("fill", function (fill: any, target: any) {
				return chart.colors.getIndex(target.dataItem.index);
			});
			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
			}
			// Cursor
			chart.cursor = new am4charts.XYCursor();
			this.spendByMonthChart = chart;
			hideIndicator();
		});
	}
}
