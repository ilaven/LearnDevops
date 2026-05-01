import { DatePipe } from "@angular/common";
import { Component, OnInit, NgZone, Optional, Inject, signal, ChangeDetectorRef } from "@angular/core";
import { FormGroup, UntypedFormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from "src/app/core/services/common.service";
import { HttpDhlService } from "src/app/core/services/httpdhl.service";
@Component({
	selector: 'app-dhl-charge-desc-popup',
	templateUrl: './dhl-charge-desc-popup.component.html',
	styleUrls: ['./dhl-charge-desc-popup.component.css'],
	standalone: false
})
export class DhlChargeDescPopupComponent implements OnInit {
	private volume_weightChart!: am4charts.XYChart;
	private average_costChart!: am4charts.XYChart;
	private weight_disPopupChart!: am4charts.XYChart;
	private spendByMonthChart!: am4charts.XYChart;
	private acc_noChart!: am4charts.XYChart;
	reportsFormGroup = new FormGroup({
		reportLogId: new UntypedFormControl(''),
		t001ClientProfile: new FormGroup({ clientId: new UntypedFormControl('') }),
	});
	dashBoardSHP: FormGroup;
	fromPage
	invoiceMonth: any;
	invoiceyear: any;
	clientId
	clientName
	groupBy: any;
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
	themeoption;
	resultData = signal<any>([]);
	moreviewChargeDescFormGroupUPS!: FormGroup;
	apiControllerFormGroup: FormGroup;
	moreviewChargeDescFormGroupNew!: FormGroup;
	panelClass: any;

	clientProfile = [];
	accountNumber: any;
	dataasof;
	barColors = [
		'#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
		'#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
		'#E07877', '#E09776', '#F4C5B0', '#F3B777',
		'#F5C7A0', '#F6D3B8'
	];
	constructor(public dialogRef: MatDialogRef<DhlChargeDescPopupComponent>, private mlForm: UntypedFormBuilder, private dialog: MatDialog,
		private datePipe: DatePipe, private commonService: CommonService, private httpDhlService: HttpDhlService, private zone: NgZone, private cd: ChangeDetectorRef,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

		this.dashBoardSHP = new FormGroup({
			chargetypevalue: new UntypedFormControl('FRT+ACC')
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
			clientName: new UntypedFormControl(this.clientName),
			clientId: new UntypedFormControl(this.clientId),
			month: new UntypedFormControl(this.month),
			year: new UntypedFormControl(this.year),
			chargeDescription: new UntypedFormControl(this.groupBy),
			groupBy: new UntypedFormControl(this.groupBy),
			group: new UntypedFormControl(this.groupBy),
			services: new UntypedFormControl(this.groupBy),
			clientname: new UntypedFormControl(clientname),
			accountNumber: new UntypedFormControl(this.accountNumber),
		})
		this.moreviewChargeDescFormGroupNew = new FormGroup({
			clientName: new UntypedFormControl(this.clientName),
			clientId: new UntypedFormControl(this.clientId),
			invoiceMonth: new UntypedFormControl(this.invoiceMonth),
			invoicemonth: new UntypedFormControl(this.invoiceMonth),
			month: new UntypedFormControl(this.invoiceMonth),
			year: new UntypedFormControl(this.invoiceyear),
			chargeDescription: new UntypedFormControl(this.groupBy),
			groupBy: new UntypedFormControl(this.groupBy),
			group: new UntypedFormControl(this.groupBy),
			services: new UntypedFormControl(this.groupBy),
			invoiceyear: new UntypedFormControl(this.invoiceyear),
			clientname: new UntypedFormControl(clientname),
			accountNumber: new UntypedFormControl(this.accountNumber)
		})

		this.apiControllerFormGroup = new FormGroup({
			//action: new FormControl('Fetch'),
			// key: new FormControl('fn_groupedservices_popup'),    
			clientId: new UntypedFormControl(this.clientId),
			fromDate: new UntypedFormControl(''),
			toDate: new UntypedFormControl(''),
			tableName: new UntypedFormControl(''),
			clientName: new UntypedFormControl(''),
			//chargeType:new FormControl('FRTWithAcc'),
			serviceType: new UntypedFormControl(''),
			groupBy: new UntypedFormControl(''),
			month: new UntypedFormControl(''),
			year: new UntypedFormControl(''),
			accountNumber: new UntypedFormControl(''),
		});
	}

	ngOnInit() {
		this.bindingTitle();
		this.dragpanel_initializeHandler();
		this.fetchTopchartByService();
		this.fetchDashBoardCharts();
	}
	closeDialog() {
		this.dialogRef.close(true);
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

	openModalConfig: any;
	openModal(alertVal: any) {
		this.openModalConfig = this.dialog.open(AlertPopupComponent, {
			width: '470px',
			height: 'auto',
			data: { pageValue: alertVal },
			panelClass: this.panelClass
		});
	}

	async fetchDashBoardCharts() {
		this.httpDhlService.fetchByServicesPopupCharts(this.moreviewChargeDescFormGroup.value)?.subscribe(
			result => {
				this.pie_popupAC = result;
				this.loadAC(this.pie_popupAC, this.invoiceyear, this.invoiceMonth + "", this.chargeDescription, this.chargetypevalue());
			},
			error => {
				console.log('error ', error);

			})
	}

	async fetchTopchartByService() {

		this.apiControllerFormGroup.get('clientId')?.setValue(this.clientId);
		this.apiControllerFormGroup.get('clientName')?.setValue(this.clientName);
		this.apiControllerFormGroup.get('groupBy')?.setValue(this.groupBy);
		this.apiControllerFormGroup.get('month')?.setValue(this.month);
		this.apiControllerFormGroup.get('year')?.setValue(this.year);
		this.apiControllerFormGroup.get('accountNumber')?.setValue(this.accountNumber);

		this.httpDhlService.fetchByServiceTopChart(this.apiControllerFormGroup.value)?.subscribe(
			result => {

				var data = this.dashBoardSHP.get('chargetypevalue')?.value;
				this.fetchData(result);

			},
			error => {
				console.log('error ', error);

			})
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
		await this.Spend_WeightChart(this.weightAC, this.chargedesctype);
		await this.commoniter();
		await this.bar_chart0(this.chargedescriptionserviceAC, event);//modified by 9126
		await this.bar_chart5(this.volume_by_chargedescriptionserviceAC, event);


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
		await this.Spend_WeightChart(this.weightAC, this.chargedesctype);
		await this.commoniter();
		await this.bar_chart0(this.chargedescriptionserviceAC, event);//modified by 9126
		await this.bar_chart5(this.volume_by_chargedescriptionserviceAC, event);//modified by 9126

	}



	async loadAC(weightAC1: any, currentyear: String, currentmonth: String, clickedChargeDesc: String, chargetypevalue: String) {
		this.chargetitle = clickedChargeDesc;

		this.month = currentmonth;
		this.year = currentyear;

		this.weightAC = weightAC1;
		this.chargedescriptionserviceAC = weightAC1;
		this.chargedesctype = chargetypevalue;
		var chargedesctype = chargetypevalue; // added ny 9126
		this.chargetypeflag = chargetypevalue;

		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC";


		this.volume_by_chargedescriptionserviceAC = weightAC1;


		//----------------spend by weight
		this.Spend_WeightChart(this.weightAC, this.chargedesctype);

		//------------spend by month

		this.SpendByMonth();

		this.bar_chart0(this.chargedescriptionserviceAC, this.chargedesctype);

		//-----------------Volume by service
		await this.bar_chart5(this.volume_by_chargedescriptionserviceAC, this.chargedesctype);
		//---------------------sepnd by Acc.no				
		this.fun_ServiceAcc_No(currentyear, currentmonth, clickedChargeDesc);

		//this.fetchT004Rymax_VolumebyserviceFun(chargedesctype);

		//this.fun_chargeDescription_Service(currentyear,currentmonth,clickedChargeDesc, chargedesctype);
		var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		if (this.month == '0') {
			this.chargedistritxt_text = "Charge Distribution and Services For" + " " + this.chargetitle + " " + this.year;
		}
		else {
			var monthnumber = Number(this.month);
			this.chargedistritxt_text = "Charge Distribution and Services For" + " " + this.chargetitle + " " + this.year + " " + monthArray[Number(monthnumber - 1)];
		}
		this.cd.detectChanges();
	}

	async SpendByMonth() {
		this.httpDhlService.fetchServiceSpendByMonth(this.moreviewChargeDescFormGroup.value)?.subscribe(
			result => {
				this.fun_monthAC = result;
				this.fun_month(this.fun_monthAC);
			},
			error => {
				console.log('error ', error);
			})
	}


	async fetchDashBoard() {
		var ServiceType = this.moreviewChargeDescFormGroupNew.get('groupBy')?.value;
		var tableName = "T004_" + this.clientName.replace(/\s/g, "") + "_" + this.invoiceyear;

		if (this.invoiceMonth == 0) {

			var fromdate = this.invoiceyear + "-01-01";
			var todate = this.invoiceyear + "-12-31";
		}
		else {
			if (this.invoiceMonth == 1) {

				var fromdate = this.invoiceyear + "-01-01";
				var todate = this.invoiceyear + "-01-31";
			}
			else if (this.invoiceMonth == 2) {

				if ((Number(this.invoiceyear) % 400 == 0) || ((Number(this.invoiceyear) % 4 == 0) && (Number(this.invoiceyear) % 100 != 0))) {
					/* leap year */
					var fromdate = this.invoiceyear + "-02-01";
					var todate = this.invoiceyear + "-02-29";
				}
				var fromdate = this.invoiceyear + "-02-01";
				var todate = this.invoiceyear + "-02-28";
			}
			else if (this.invoiceMonth == 3) {

				var fromdate = this.invoiceyear + "-03-01";
				var todate = this.invoiceyear + "-03-31";
			}
			else if (this.invoiceMonth == 4) {

				var fromdate = this.invoiceyear + "-04-01";
				var todate = this.invoiceyear + "-04-30";
			}
			else if (this.invoiceMonth == 5) {

				var fromdate = this.invoiceyear + "-05-01";
				var todate = this.invoiceyear + "-05-31";
			}
			else if (this.invoiceMonth == 6) {

				var fromdate = this.invoiceyear + "-06-01";
				var todate = this.invoiceyear + "-06-30";
			}
			else if (this.invoiceMonth == 7) {

				var fromdate = this.invoiceyear + "-07-01";
				var todate = this.invoiceyear + "-07-31";
			}
			else if (this.invoiceMonth == 8) {

				var fromdate = this.invoiceyear + "-08-01";
				var todate = this.invoiceyear + "-08-31";
			}
			else if (this.invoiceMonth == 9) {

				var fromdate = this.invoiceyear + "-09-01";
				var todate = this.invoiceyear + "-09-30";
			}
			else if (this.invoiceMonth == 10) {

				var fromdate = this.invoiceyear + "-10-01";
				var todate = this.invoiceyear + "-10-31";
			}
			else if (this.invoiceMonth == 11) {

				var fromdate = this.invoiceyear + "-11-01";
				var todate = this.invoiceyear + "-11-30";
			}
			else if (this.invoiceMonth == 12) {

				var fromdate = this.invoiceyear + "-12-01";
				var todate = this.invoiceyear + "-12-31";
			}


		}


		this.httpDhlService.fetchByServicesPopupCharts(this.apiControllerFormGroup.value)?.subscribe(
			result => {

				var data = this.dashBoardSHP.get('chargetypevalue')?.value;

				this.fetchData(result);

			},
			error => {
				console.log('error ', error);

			})
	}
	async fetchData(result: any) {
		this.resultData.set([]);
		if (result.length > 0) {
			var t004Obj = result[0];
			let t004DashBoardCYObj: any = [];

			var monthflag = await this.moreviewChargeDescFormGroupNew.get('month')?.value;
			//var chargetypevalue=await this.dashBoardSHP.get('chargetypevalue')?.value;


			t004DashBoardCYObj["netCharge"] = await t004Obj.netCharge;
			t004DashBoardCYObj["netChargeFRT"] = await t004Obj.netChargeFRT;
			t004DashBoardCYObj["costPerPackage"] = await t004Obj.costPerPackage;
			t004DashBoardCYObj["costPerPackageFRT"] = await t004Obj.costPerPackageFRT;
			t004DashBoardCYObj["averageWeightPerPackageLbs"] = await t004Obj.averageWeightPerPackageLbs;
			t004DashBoardCYObj["averageWeightPerPackageKgs"] = await t004Obj.averageWeightPerPackageKgs;
			t004DashBoardCYObj["billedWeightKgs"] = await t004Obj.billedWeightKgs;
			t004DashBoardCYObj["billedWeightLbs"] = await t004Obj.billedWeightLbs;
			t004DashBoardCYObj["costPerKg"] = await t004Obj.costPerKg;
			t004DashBoardCYObj["costPerLb"] = await t004Obj.costPerLb;
			t004DashBoardCYObj["packageCount"] = await t004Obj.packageCount;
			t004DashBoardCYObj["totalPieces"] = await t004Obj.totalPieces;
			this.resultData.set(t004DashBoardCYObj);
		}
	}

	async bar_chart5(tempAC: any, chargedesctype: String) {
		await this.createSeriesFromAC2(tempAC, chargedesctype, "Bar");
		await this.createSeriesFromAC2Kgs(tempAC, chargedesctype, "Bar");
	}
	async bar_chart0(tempAC: any, chargedesctype: any) {
		await this.createSeriesFromAC0_Service(tempAC, chargedesctype, "")
		await this.createSeriesFromAC0_ServiceKgs(tempAC, chargedesctype, "")
	}

	async createSeriesFromAC2(collection: any, weightchargetype: String, seriesName: String) {
		if (weightchargetype == null) {
			weightchargetype == "FRT+ACC";
		}
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {
				var tempObj = collection[loop];

				if (tempObj.chargeType == weightchargetype) {


					var chartData = [
						{ "weight": "1", "value": tempObj.volume1Lbs ? tempObj.volume1Lbs : '0' },
						{ "weight": "2", "value": tempObj.volume2Lbs ? tempObj.volume2Lbs : '0' },
						{ "weight": "3", "value": tempObj.volume3Lbs ? tempObj.volume3Lbs : '0' },
						{ "weight": "4", "value": tempObj.volume4Lbs ? tempObj.volume4Lbs : '0' },
						{ "weight": "5", "value": tempObj.volume5Lbs ? tempObj.volume5Lbs : '0' },
						{ "weight": "6-10", "value": tempObj.volume6to10Lbs ? tempObj.volume6to10Lbs : '0' },
						{ "weight": "11-20", "value": tempObj.volume11to20Lbs ? tempObj.volume11to20Lbs : '0' },
						{ "weight": "21-30", "value": tempObj.volume21to30Lbs ? tempObj.volume21to30Lbs : '0' },
						{ "weight": "31-50", "value": tempObj.volume31to50Lbs ? tempObj.volume31to50Lbs : '0' },
						{ "weight": "51-70", "value": tempObj.volume51to70Lbs ? tempObj.volume51to70Lbs : '0' },
						{ "weight": "71-150", "value": tempObj.volume71to150Lbs ? tempObj.volume71to150Lbs : '0' },
						{ "weight": "151+", "value": tempObj.volume150PlusLbs ? tempObj.volume150PlusLbs : '0' }];

				}

			}
		}
		else {
			chartData = [
				{ "weight": "Nil", "value": 0 }];



		}


		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("volume_weight", am4charts.XYChart);
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
			chart.paddingBottom = 30;
			chart.angle = 35;



			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip


			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 10;
			categoryAxis.renderer.grid.template.location = 0;


			let labelTemplate = categoryAxis.renderer.labels.template;
			labelTemplate.rotation = 0;
			labelTemplate.fontSize = 12;
			labelTemplate.dy = 10; // moves it a bit down;
			labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //added by 9126
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
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "weight";
			series.name = "Weight";
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Package Count: [bold]{valueY}[/]";
			//Charge description UI issue - T_13855
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = 1;
			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.stroke = am4core.color("#FFFFFF");

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			});
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
			}
			this.volume_weightChart = chart;
			hideIndicator();
		});
	}

	async createSeriesFromAC2Kgs(collection: any, weightchargetype: String, seriesName: String) {
		if (weightchargetype == null) {
			weightchargetype == "FRT+ACC";
		}
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {
				var tempObj = collection[loop];

				if (tempObj.chargeType == weightchargetype) {


					var chartData = [
						{ "weight": "1", "value": tempObj.volume1Kgs ? tempObj.volume1Kgs : '0' },
						{ "weight": "2", "value": tempObj.volume2Kgs ? tempObj.volume2Kgs : '0' },
						{ "weight": "3", "value": tempObj.volume3Kgs ? tempObj.volume3Kgs : '0' },
						{ "weight": "4", "value": tempObj.volume4Kgs ? tempObj.volume4Kgs : '0' },
						{ "weight": "5", "value": tempObj.volume5Kgs ? tempObj.volume5Kgs : '0' },
						{ "weight": "6-10", "value": tempObj.volume6to10Kgs ? tempObj.volume6to10Kgs : '0' },
						{ "weight": "11-20", "value": tempObj.volume11to20Kgs ? tempObj.volume11to20Kgs : '0' },
						{ "weight": "21-30", "value": tempObj.volume21to30Kgs ? tempObj.volume21to30Kgs : '0' },
						{ "weight": "31-50", "value": tempObj.volume31to50Kgs ? tempObj.volume31to50Kgs : '0' },
						{ "weight": "51-70", "value": tempObj.volume51to70Kgs ? tempObj.volume51to70Kgs : '0' },
						{ "weight": "71-150", "value": tempObj.volume71to150Kgs ? tempObj.volume71to150Kgs : '0' },
						{ "weight": "151+", "value": tempObj.volume150PlusKgs ? tempObj.volume150PlusKgs : '0' }];

				}

			}
		}
		else {
			chartData = [
				{ "weight": "Nil", "value": 0 }];



		}


		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("volume_weightKgs", am4charts.XYChart);
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
			chart.paddingBottom = 30;
			chart.angle = 35;



			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip


			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 10;
			categoryAxis.renderer.grid.template.location = 0;


			let labelTemplate = categoryAxis.renderer.labels.template;
			labelTemplate.rotation = 0;
			labelTemplate.fontSize = 12;
			labelTemplate.dy = 10; // moves it a bit down;
			labelTemplate.inside = false; // this is done to avoid settings which are not suitable when label is rotated

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //added by 9126
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
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "weight";
			series.name = "Weight";
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Package Count: [bold]{valueY}[/]";
			//Charge description UI issue - T_13855
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = 1;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.stroke = am4core.color("#FFFFFF");
			columnTemplate.column.cornerRadiusTopLeft = 8;
			columnTemplate.column.cornerRadiusTopRight = 8;

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			});

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
			}
			this.volume_weightChart = chart;
			hideIndicator();
		});
	}
	collectionArr: any;
	chargedesctypeVal: any;
	async createSeriesFromAC0_Service(collection: any, chargedesctype: any, weightVal: any) {
		if (weightVal == "") {
			if (collection.length > 0) {
				this.collectionArr = collection;
				this.chargedesctypeVal = chargedesctype;
				for (var loop = 0; loop < collection.length; loop++) {
					var tempObj = collection[loop];

					if (tempObj.chargeType == chargedesctype) {

						var chartData = [

							{ "weight": "1", "value": tempObj.averageCost1Lbs ? tempObj.averageCost1Lbs : '0' },
							{ "weight": "2", "value": tempObj.averageCost2Lbs ? tempObj.averageCost2Lbs : '0' },
							{ "weight": "3", "value": tempObj.averageCost3Lbs ? tempObj.averageCost3Lbs : '0' },
							{ "weight": "4", "value": tempObj.averageCost4Lbs ? tempObj.averageCost4Lbs : '0' },
							{ "weight": "5", "value": tempObj.averageCost5Lbs ? tempObj.averageCost5Lbs : '0' },
							{ "weight": "6-10", "value": tempObj.averageCost6to10Lbs ? tempObj.averageCost6to10Lbs : '0' },
							{ "weight": "11-20", "value": tempObj.averageCost11to20Lbs ? tempObj.averageCost11to20Lbs : '0' },
							{ "weight": "21-30", "value": tempObj.averageCost21to30Lbs ? tempObj.averageCost21to30Lbs : '0' },
							{ "weight": "31-50", "value": tempObj.averageCost31to50Lbs ? tempObj.averageCost31to50Lbs : '0' },
							{ "weight": "51-70", "value": tempObj.averageCost51to70Lbs ? tempObj.averageCost51to70Lbs : '0' },
							{ "weight": "71-150", "value": tempObj.averageCost71to150Lbs ? tempObj.averageCost71to150Lbs : '0' },
							{ "weight": "151+", "value": tempObj.averageCost150PlusLbs ? tempObj.averageCost150PlusLbs : '0' }];

					}
				}
			}
			else {
				var nameFiled = "Nil";
				var yField = "0";
				chartData = [{ "weight": nameFiled, "value": yField }];


			}
		} else {
			chartData = collection;
			for (var loop = 0; loop < chartData.length; loop++) {
				if (chartData[loop]['weight'] == weightVal)
					chartData.splice(loop, 1);
			}
		}
		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("average_cost", am4charts.XYChart);
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


			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.renderer.grid.template.location = 0;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.title.text = "$ Net Charge";
			valueAxis.title.fontWeight = "bold";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return text;
			});
			if (minNegVal == false) {
				valueAxis.min = 0;
			}
			// Create series
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "weight";
			series.name = "Weight";
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Avg Cost: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = 1;
			series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
			series.columns.template.events.on("hit", (ev: any) => {
				const seriesColumn: any = ev.target.dataItem.categoryX;
				this.createSeriesFromAC0_Service(chartData, "", seriesColumn);
			});
			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.stroke = am4core.color("#FFFFFF");

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			});

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
			}
			this.average_costChart = chart;
			hideIndicator();
		});
	}

	async createSeriesFromAC0_ServiceKgs(collection: any, chargedesctype: any, weightVal: any) {
		if (weightVal == "") {
			if (collection.length > 0) {
				this.collectionArr = collection;
				this.chargedesctypeVal = chargedesctype;
				for (var loop = 0; loop < collection.length; loop++) {
					var tempObj = collection[loop];

					if (tempObj.chargeType == chargedesctype) {

						var chartData = [

							{ "weight": "1", "value": tempObj.averageCost1Kgs ? tempObj.averageCost1Kgs : '0' },
							{ "weight": "2", "value": tempObj.averageCost2Kgs ? tempObj.averageCost2Kgs : '0' },
							{ "weight": "3", "value": tempObj.averageCost3Kgs ? tempObj.averageCost3Kgs : '0' },
							{ "weight": "4", "value": tempObj.averageCost4Kgs ? tempObj.averageCost4Kgs : '0' },
							{ "weight": "5", "value": tempObj.averageCost5Kgs ? tempObj.averageCost5Kgs : '0' },
							{ "weight": "6-10", "value": tempObj.averageCost6to10Kgs ? tempObj.averageCost6to10Kgs : '0' },
							{ "weight": "11-20", "value": tempObj.averageCost11to20Kgs ? tempObj.averageCost11to20Kgs : '0' },
							{ "weight": "21-30", "value": tempObj.averageCost21to30Kgs ? tempObj.averageCost21to30Kgs : '0' },
							{ "weight": "31-50", "value": tempObj.averageCost31to50Kgs ? tempObj.averageCost31to50Kgs : '0' },
							{ "weight": "51-70", "value": tempObj.averageCost51to70Kgs ? tempObj.averageCost51to70Kgs : '0' },
							{ "weight": "71-150", "value": tempObj.averageCost71to150Kgs ? tempObj.averageCost71to150Kgs : '0' },
							{ "weight": "151+", "value": tempObj.averageCost150PlusKgs ? tempObj.averageCost150PlusKgs : '0' }];

					}
				}
			}
			else {
				var nameFiled = "Nil";
				var yField = "0";
				chartData = [{ "weight": nameFiled, "value": yField }];


			}
		} else {
			chartData = collection;
			for (var loop = 0; loop < chartData.length; loop++) {
				if (chartData[loop]['weight'] == weightVal)
					chartData.splice(loop, 1);
			}
		}
		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("average_costKgs", am4charts.XYChart);
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


			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.renderer.grid.template.location = 0;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
			valueAxis.title.text = "$ Net Charge";
			valueAxis.title.fontWeight = "bold";
			valueAxis.renderer.labels.template.adapter.add("text", function (text: any) {
				return text;
			});
			if (minNegVal == false) {
				valueAxis.min = 0;
			}
			// Create series
			let series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "weight";
			series.name = "Weight";
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Avg Cost: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = .8;
			series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
			series.columns.template.events.on("hit", (ev: any) => {
				const seriesColumn: any = ev.target.dataItem.categoryX;
				this.createSeriesFromAC0_ServiceKgs(chartData, "", seriesColumn);
			});
			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.stroke = am4core.color("#FFFFFF");

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			});

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
			}
			this.average_costChart = chart;
			hideIndicator();
		});
	}
	resetBars() {
		this.createSeriesFromAC0_Service(this.collectionArr, this.chargedesctypeVal, "");
	}

	resetBarsKgs() {
		this.createSeriesFromAC0_ServiceKgs(this.collectionArr, this.chargedesctypeVal, "");
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
			if (t004Obj.month == "1")
				this.tempt004AC.push({ Month: "JAN", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "2")
				this.tempt004AC.push({ Month: "FEB", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "3")
				this.tempt004AC.push({ Month: "MAR", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "4")
				this.tempt004AC.push({ Month: "APR", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "5")
				this.tempt004AC.push({ Month: "MAY", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "6")
				this.tempt004AC.push({ Month: "JUN", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "7")
				this.tempt004AC.push({ Month: "JULY", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "8")
				this.tempt004AC.push({ Month: "AUG", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "9")
				this.tempt004AC.push({ Month: "SEP", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "10")
				this.tempt004AC.push({ Month: "OCT", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "11")
				this.tempt004AC.push({ Month: "NOV", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.month == "12")
				this.tempt004AC.push({ Month: "DEC", value: totVaule, chargetyperesult: chargetypevalue });


		}
		this.Spend_Month(this.tempt004AC); //---------------------------Spend By Month 

	}


	//-------------Sender		




	async fetchT000Top_ten_States_By_Receiver_result(event: any) {
		this.ten_StateAC_Reveiver = event;
		this.ten_StateACfrt_Reveiver = this.ten_StateAC_Reveiver;

	}



	async fun_ServiceAcc_No(currentyear: String, currentmonth: String, clickedChargeDesc: String) {
		await this.httpDhlService.fetchByServiceSpendByAccNo(this.moreviewChargeDescFormGroup.value)?.subscribe(
			result => {
				this.fetchT000Service_Acc(result);
			},
			error => {
				console.log('error ', error);
			})

	}

	async fetchT000Service_Acc(event: any) {
		this.serviceAccAC = event;


		this.commonACSHP_FRT = [];
		this.commonACSHP_FRT_ACC = [];

		for (var count = 0; count < this.serviceAccAC.length; count++) {
			var tempobj = this.serviceAccAC[count];
			if (tempobj.chargeType == "FRT") {
				this.commonACSHP_FRT.push(tempobj);
			}
			else {
				this.commonACSHP_FRT_ACC.push(tempobj);
			}
		}

		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC";

		await this.commoniter();
	}
	async commoniter() {
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC";
		if (this.chargedesctype == "FRT+ACC") {
			if (this.commonACSHP_FRT_ACC.length < 5 || this.commonACSHP_FRT_ACC.length == 5) {
				this.fromACC = 0;
				this.toACC = this.commonACSHP_FRT_ACC.length;
				this.previous_id_visible = false;
				this.first_id_visible = false;
				this.next_id_visible = false;
			}
			else {
				this.fromACC = 0;
				this.toACC = 5;
				this.next_id_visible = true;
				this.previous_id_visible = false;
				this.first_id_visible = false;
			}
			await this.common();
		}
		else {
			if (this.commonACSHP_FRT.length < 5 || this.commonACSHP_FRT.length == 5) {
				this.from = 0;
				this.to = this.commonACSHP_FRT.length;
				this.previous_id_visible = false;
				this.first_id_visible = false;
				this.next_id_visible = false;
			}
			else {
				this.from = 0;
				this.to = 5;
				this.next_id_visible = true;
				this.previous_id_visible = false;
				this.first_id_visible = false;
			}
			await this.common();
		}
		this.cd.detectChanges();
	}

	async common() {
		this.commonAC = [];
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC";
		if (this.chargedesctype == "FRT+ACC") {

			for (var count = this.fromACC; count < this.toACC; count++) {
				var tempobj = this.commonACSHP_FRT_ACC[count];
				this.commonAC.push(tempobj);
			}
		} else {
			for (var count = this.from; count < this.to; count++) {
				var tempobj = this.commonACSHP_FRT[count];
				this.commonAC.push(tempobj);
			}
		}
		await this.Acc_No(this.commonAC);
	}
	async Spend_WeightChart(tempAC: any, chargedesctype: String) {
		await this.createSeriesFromAC(tempAC, chargedesctype);
		await this.createSeriesFromACKgs(tempAC, chargedesctype);
	}

	async createSeriesFromAC(collection: any, chargedesctype: String) {

		if (collection.length > 0)


			if (chargedesctype == "FRT") {

				var tempObj = collection[0];

			}
			else {

				var tempObj = collection[1];

			}

		if (tempObj != null) {

			var chartData = [

				{ "weight": "1", "value": tempObj.netCharge1Lbs ? tempObj.netCharge1Lbs : '0' },
				{ "weight": "2", "value": tempObj.netCharge2Lbs ? tempObj.netCharge2Lbs : '0' },
				{ "weight": "3", "value": tempObj.netCharge3Lbs ? tempObj.netCharge3Lbs : '0' },
				{ "weight": "4", "value": tempObj.netCharge4Lbs ? tempObj.netCharge4Lbs : '0' },
				{ "weight": "5", "value": tempObj.netCharge5Lbs ? tempObj.netCharge5Lbs : '0' },
				{ "weight": "6-10", "value": tempObj.netCharge6to10Lbs ? tempObj.netCharge6to10Lbs : '0' },
				{ "weight": "11-20", "value": tempObj.netCharge11to20Lbs ? tempObj.netCharge11to20Lbs : '0' },
				{ "weight": "21-30", "value": tempObj.netCharge21to30Lbs ? tempObj.netCharge21to30Lbs : '0' },
				{ "weight": "31-50", "value": tempObj.netCharge31to50Lbs ? tempObj.netCharge31to50Lbs : '0' },
				{ "weight": "51-70", "value": tempObj.netCharge51to70Lbs ? tempObj.netCharge51to70Lbs : '0' },
				{ "weight": "71-150", "value": tempObj.netCharge71to150Lbs ? tempObj.netCharge71to150Lbs : '0' },
				{ "weight": "151+", "value": tempObj.netCharge150PlusLbs ? tempObj.netCharge150PlusLbs : '0' }];


		}

		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("weight_disPopup", am4charts.XYChart);

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
			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.renderer.grid.template.location = 0;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
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


			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "weight";
			series.name = "Weight";
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = 1;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.fontSize = 12;
			columnTemplate.stroke = am4core.color("#FFFFFF");
			columnTemplate.column.cornerRadiusTopLeft = 8;
			columnTemplate.column.cornerRadiusTopRight = 8;

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			});

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
			}
			this.weight_disPopupChart = chart;
			hideIndicator();
		});
	}

	async createSeriesFromACKgs(collection: any, chargedesctype: String) {

		if (collection.length > 0)


			if (chargedesctype == "FRT") {

				var tempObj = collection[0];

			}
			else {

				var tempObj = collection[1];

			}

		if (tempObj != null) {

			var chartData = [

				{ "weight": "1", "value": tempObj.netCharge1Kgs ? tempObj.netCharge1Kgs : '0' },
				{ "weight": "2", "value": tempObj.netCharge2Kgs ? tempObj.netCharge2Kgs : '0' },
				{ "weight": "3", "value": tempObj.netCharge3Kgs ? tempObj.netCharge3Kgs : '0' },
				{ "weight": "4", "value": tempObj.netCharge4Kgs ? tempObj.netCharge4Kgs : '0' },
				{ "weight": "5", "value": tempObj.netCharge5Kgs ? tempObj.netCharge5Kgs : '0' },
				{ "weight": "6-10", "value": tempObj.netCharge6to10Kgs ? tempObj.netCharge6to10Kgs : '0' },
				{ "weight": "11-20", "value": tempObj.netCharge11to20Kgs ? tempObj.netCharge11to20Kgs : '0' },
				{ "weight": "21-30", "value": tempObj.netCharge21to30Kgs ? tempObj.netCharge21to30Kgs : '0' },
				{ "weight": "31-50", "value": tempObj.netCharge31to50Kgs ? tempObj.netCharge31to50Kgs : '0' },
				{ "weight": "51-70", "value": tempObj.netCharge51to70Kgs ? tempObj.netCharge51to70Kgs : '0' },
				{ "weight": "71-150", "value": tempObj.netCharge71to150Kgs ? tempObj.netCharge71to150Kgs : '0' },
				{ "weight": "151+", "value": tempObj.netCharge150PlusKgs ? tempObj.netCharge150PlusKgs : '0' }];


		}

		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("weight_disPopupKgs", am4charts.XYChart);

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
			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 20;
			categoryAxis.renderer.grid.template.location = 0;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
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


			series.dataFields.valueY = "value";
			series.dataFields.categoryX = "weight";
			series.name = "Weight";
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = 1;
			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.fontSize = 12;
			columnTemplate.stroke = am4core.color("#FFFFFF");

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			});

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
			}
			this.weight_disPopupChart = chart;
			hideIndicator();
		});
	}

	//----------------------  Spend by month

	async Spend_Month(tempAC: any) {
		await this.createSeriesFromAC1(tempAC, this.chargedesctype, "Month", "value");
	}


	async createSeriesFromAC1(collection: any, chargedesctype: any, nameField: String, yField: String) {

		this.hashMapObjData.clear();

		if (collection.length > 0)

			if (chargedesctype == "FRT+ACC")
				chargedesctype = null;
		var chartData: any = [];
		for (var count = 0; count < collection.length; count++) {
			var t004Objtemp = collection[count];
			if (t004Objtemp.chargetyperesult == "FRT+ACC") {
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

			if (t004Objtemp.chargetyperesult == "FRT") {
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
				this.hashMapFRTObjData.set("" + month, t004Objtemp);
			}



		}

		if (chargedesctype == "FRT") {

			for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
				var dataLoop_val = dataLoop + 1 + "";
				var t004Obj = this.hashMapFRTObjData.get(dataLoop_val);


				if (t004Obj != null) {
					var Month: String = t004Obj.Month;


					var yField: String = t004Obj.value;

					var monthStr: String = this.hashMapObj.get(t004Obj.Month) as String;

					chartData.push({ "Month": Month, "value": yField });



				}
			}

		}
		else {
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

			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;
			series.columns.template.column.fillOpacity = 1;
			series.columns.template.fontSize = 12;
			// on hover, make corner radiuses bigger
			let hoverState = series.columns.template.column.states.create("hover");
			hoverState.properties.cornerRadiusTopLeft = 8;
			hoverState.properties.cornerRadiusTopRight = 8;
			hoverState.properties.fillOpacity = 1;

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
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


	//------------------------Acc.No

	async Acc_No(tempAC: any) {
		await this.createSeriesFromAC21(tempAC);
	}

	async createSeriesFromAC21(collection: any) {
		var chartData: any = [];
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC"
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {

				var tempObj = collection[loop];
				if (tempObj.chargeType == this.chargedesctype) {
					var value1: String = tempObj.group;
					var nameFiled: String = tempObj.accountNumber;

					var yField: String = tempObj.netCharge;
					chartData.push({ "name": nameFiled, "points": yField })
				}
			}

		}
		else {

			var nameFiled: String = "Nil";
			var yField: String = "0";
			chartData.push({ "name": nameFiled, "points": yField })
		}


		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("acc_no", am4charts.XYChart);
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
			categoryAxis.dataFields.category = "name";
			categoryAxis.renderer.grid.template.location = 0;
			categoryAxis.renderer.minGridDistance = 30;

			let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
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
			series.dataFields.valueY = "points";
			series.dataFields.categoryX = "name";
			series.name = "Account";
			series.columns.template.tooltipText = "Account Number: [bold]{categoryX}[/]  \n Net Charge: $ [bold]{valueY.formatNumber('#,###.00')}[/]";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.fillOpacity = .8;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			this.acc_noChart = chart;
			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
			}
			hideIndicator();
		});
	}




	async createSeriesFromAC3_Sender(collection: any) {

		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {
				var tempObj = collection[loop];



				if (this.chargedesctype == null)
					this.chargedesctype = "FRT+ACC";

				if (tempObj.chargeType == this.chargedesctype) {
					var nameFiled: String = tempObj.sender_state;
					var yField: String = tempObj.sender_NetAmount;

				}

			}
		}
		else {
			var nameFiled: String = "Nil";
			var yField: String = "0";


		}


	}



	async createSeriesFromAC3_Receiver(collection: any) {
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC";
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {
				var tempObj = collection[loop];

				if (tempObj.chargeType == this.chargedesctype) {

					var nameFiled: String = tempObj.receiver_state;
					var yField: String = tempObj.receiver_NetAmount;

				}

			}
		}
		else {
			var nameFiled: String = "Nil";
			var yField: String = "0";


		}
	}




	async radiobutton_clickHandler(event: any) {

	}

	async btnBack_clickHandler(event: any) {
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC"
		if (this.chargedesctype == "FRT+ACC") {
			var tempto = this.toACC;
			tempto = tempto + 5;

			if (tempto < this.commonACSHP_FRT_ACC.length) {
				this.fromACC = this.toACC;
				this.toACC = this.toACC + 5;
			}
			if (tempto > this.commonACSHP_FRT_ACC.length) {
				this.fromACC = this.toACC;
				this.toACC += (this.commonACSHP_FRT_ACC.length - this.toACC);
			}
			if (this.toACC == this.commonACSHP_FRT_ACC.length) {
				this.next_id_visible = false;
			}
			this.previous_id_visible = true;
			this.first_id_visible = true;
			await this.common();
		}
		else {
			var tempto = this.to;
			tempto = tempto + 5;

			if (tempto < this.commonACSHP_FRT.length) {
				this.from = this.to;
				this.to = this.to + 5;
			}
			if (tempto > this.commonACSHP_FRT.length) {
				this.from = this.to;
				this.to += (this.commonACSHP_FRT.length - this.to);
			}
			if (this.to == this.commonACSHP_FRT.length) {
				this.next_id_visible = false;
			}
			this.previous_id_visible = true;
			this.first_id_visible = true;
			await this.common();
		}
	}

	async previous_id_clickHandler(event: any) {
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC"
		if (this.chargedesctype == "FRT+ACC") {
			this.toACC = this.fromACC;
			this.fromACC = this.fromACC - 5;
			if (this.fromACC == 0) {
				this.previous_id_visible = false;
				this.first_id_visible = false;
			}
			this.next_id_visible = true;
			this.common();
		} else {
			this.to = this.from;
			this.from = this.from - 5;
			if (this.from == 0) {
				this.previous_id_visible = false;
				this.first_id_visible = false;
			}
			this.next_id_visible = true;
			this.common();

		}

	}

	async first_id_clickHandler(event: any) {
		if (this.chargedesctype == null)
			this.chargedesctype = "FRT+ACC"
		if (this.chargedesctype == "FRT+ACC") {
			this.first_id_visible = false;
			this.previous_id_visible = false;
			this.next_id_visible = true;
			this.fromACC = 0;
			this.toACC = 5;
		} else {
			this.first_id_visible = false;
			this.previous_id_visible = false;
			this.next_id_visible = true;
			this.from = 0;
			this.to = 5;
		}
		await this.common();
	}



	async bar_chart0_delete(domainName: String, tempAC: any, deleteName: String) {
		await this.createSeriesFromAC_bar_delete(domainName, tempAC, "", "", deleteName);

	}



	async createSeriesFromAC_bar_delete(domainName: String, collection: any, nameField: String, yField: String, deleteName: String) {

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
		this.httpDhlService.reportServlet(fields_string);
	}

	ngOnDestroy() {
		this.zone.runOutsideAngular(() => {

			if (this.volume_weightChart) {
				this.volume_weightChart.dispose();
			}
			if (this.average_costChart) {
				this.average_costChart.dispose();
			}
			if (this.weight_disPopupChart) {
				this.weight_disPopupChart.dispose();
			}
			if (this.spendByMonthChart) {
				this.spendByMonthChart.dispose();
			}
			if (this.acc_noChart) {
				this.acc_noChart.dispose();
			}
		});
	}
	//Account st chart 

	btnBackacc_clickHandler(event: any) {
		// TODO Auto-generated method stub
		if (this.weightchargetype == null)
			this.weightchargetype = "FRT+ACC"
		if (this.weightchargetype == "FRT+ACC") {
			var tempto = this.toACC;
			tempto = tempto + 5;

			if (tempto < this.commonACSHP_FRT_ACC.length) {
				this.fromACC = this.toACC;
				this.toACC = this.toACC + 5;
			}
			if (tempto > this.commonACSHP_FRT_ACC.length) {
				this.fromACC = this.toACC;
				this.toACC += (this.commonACSHP_FRT_ACC.length - this.toACC);
			}
			if (this.toACC == this.commonACSHP_FRT_ACC.length) {
				this.next_id_visible = false;
			}
			this.previous_id_visible = true;
			this.first_id_visible = true;
			this.common();
		}
		else {
			var tempto = this.to;
			tempto = tempto + 5;

			if (tempto < this.commonACSHP_FRT.length) {
				this.from = this.to;
				this.to = this.to + 5;
			}
			if (tempto > this.commonACSHP_FRT.length) {
				this.from = this.to;
				this.to += (this.commonACSHP_FRT.length - this.to);
			}
			if (this.to == this.commonACSHP_FRT.length) {
				this.next_id_visible = false;
			}
			this.previous_id_visible = true;
			this.first_id_visible = true;
			this.common();
		}
	}
	//Acc end Chart

	async clickTopChart(event: any) {
		var urlParam: any = {};

		var monthVal = await this.moreviewChargeDescFormGroup.get('month')?.value;
		var clickedYear = await this.moreviewChargeDescFormGroup.get('year')?.value;
		var date = new Date();
		var currentYear = new Date().getFullYear();
		if (monthVal == null) {
			var month = 0;
		} else {
			month = monthVal;
		}
		if (month == 0) {
			urlParam['fromdate'] = clickedYear + "-01" + "-01";
			// if(clickedYear == currentYear)
			// 	urlParam['todate']=   this.datePipe.transform(this.dataasof,"yyyy-MM-dd");
			// else
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
		urlParam['clientId'] = this.clientId;
		urlParam['clientName'] = this.clientName;
		urlParam['accountnumber'] = this.accountNumber;
		urlParam['service'] = this.groupBy;
		var fields_string: any = "";
		for (const [key, value] of Object.entries(urlParam)) {
			fields_string += key + '=' + value + '&';
		}
		this.httpDhlService.reportServlet(fields_string);
	}
}
