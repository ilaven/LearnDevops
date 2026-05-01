import { DatePipe } from "@angular/common";
import { Component, OnInit, NgZone, Optional, Inject, signal } from "@angular/core";
import { FormGroup, UntypedFormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from "src/app/core/services/common.service";
@Component({
	selector: 'app-charge-desc-popup',
	templateUrl: './charge-desc-popup.component.html',
	styleUrls: ['./charge-desc-popup.component.css'],
	standalone: false
})
export class ChargeDescPopupComponent implements OnInit {
	private Sccvolume_weightChart!: am4charts.XYChart;
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
	invoiceMonth
	invoiceyear
	clientId
	clientName
	groupby
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
	moreviewChargeDescFormGroupUPS: FormGroup;
	apiControllerFormGroup: FormGroup;
	panelClass: any;
	clientProfile = [];
	dataasof;

	barColors = [
		'#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
		'#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
		'#E07877', '#E09776', '#F4C5B0', '#F3B777',
		'#F5C7A0', '#F6D3B8'
	];
	constructor(public dialogRef: MatDialogRef<ChargeDescPopupComponent>, private mlForm: UntypedFormBuilder, private dialog: MatDialog,
		private datePipe: DatePipe, private commonService: CommonService, private httpClientService: HttpClientService, private zone: NgZone,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

		this.dashBoardSHP = new FormGroup({
			chargetypevalue: new UntypedFormControl('SHP_FRT+ACC')
		});


		this.fromPage = data.popupValue;
		if (this.fromPage.invoiceMonth == null) { this.invoiceMonth = '0'; }
		else { this.invoiceMonth = this.fromPage.invoiceMonth; }
		this.invoiceyear = this.fromPage.invoiceyear;
		this.clientId = this.fromPage.clientId;
		this.clientName = this.fromPage.clientName;
		this.groupby = this.fromPage.groupby;
		this.chargeDescription = this.fromPage.groupby;
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
			invoiceMonth: new UntypedFormControl(this.invoiceMonth),
			invoicemonth: new UntypedFormControl(this.invoiceMonth),
			month: new UntypedFormControl(this.invoiceMonth),
			year: new UntypedFormControl(this.invoiceyear),
			chargeDescription: new UntypedFormControl(this.groupby),
			groupby: new UntypedFormControl(this.groupby),
			group: new UntypedFormControl(this.groupby),
			services: new UntypedFormControl(this.groupby),
			invoiceyear: new UntypedFormControl(this.invoiceyear),
			clientname: new UntypedFormControl(clientname)
		})
		this.moreviewChargeDescFormGroupUPS = new FormGroup({
			clientName: new UntypedFormControl(this.clientName),
			clientId: new UntypedFormControl(this.clientId),
			invoiceMonth: new UntypedFormControl(this.invoiceMonth),
			invoicemonth: new UntypedFormControl(this.invoiceMonth),
			month: new UntypedFormControl(this.invoiceMonth),
			year: new UntypedFormControl(this.invoiceyear),
			chargeDescription: new UntypedFormControl(this.groupby),
			groupby: new UntypedFormControl(this.groupby),
			group: new UntypedFormControl(this.groupby),
			services: new UntypedFormControl(this.groupby),
			invoiceyear: new UntypedFormControl(this.invoiceyear),
			clientname: new UntypedFormControl(clientname)
		})

		this.apiControllerFormGroup = new FormGroup({
			action: new UntypedFormControl('Fetch'),
			key: new UntypedFormControl('fn_groupedservices_popup'),
			clientId: new UntypedFormControl(this.clientId),
			fromDate: new UntypedFormControl(''),
			toDate: new UntypedFormControl(''),
			tableName: new UntypedFormControl(''),
			carrierType: new UntypedFormControl('UPS'),
			chargeType: new UntypedFormControl('FRTWithAcc'),
			serviceType: new UntypedFormControl(''),
		});
	}

	ngOnInit() {
		this.bindingTitle();
		this.dragpanel_initializeHandler();
		this.fetchT004Rymax_chargeBack_select();
		this.fetchDashBoard();

	}
	closeDialog() {
		this.dialogRef.close(true);
	}
	async bindingTitle() {
		this.chargetypevalue.set(this.dashBoardSHP.get('chargetypevalue')?.value);
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

	async fetchT004Rymax_chargeBack_select() {
		this.httpClientService.fetchT004Rymax_chargeBack_select(this.moreviewChargeDescFormGroup.value).subscribe(
			(result: any) => {
				this.pie_popupAC = result;
				this.loadAC(this.pie_popupAC, this.invoiceyear, this.invoiceMonth + "", this.chargeDescription, this.chargetypevalue());
			},
			(error: any) => {
				console.log('error ', error);

			})
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
		var domain_Name: string = "T004_Dashboard";
		if (this.month == '0') {
			var event_type: string = "year";
		} else {
			var event_type: string = "month";
		}
		this.chargedesctype = "SHP_FRT";
		await this.fun_month(this.fun_monthAC);
		await this.Spend_WeightChart(this.weightAC, this.chargedesctype);
		await this.commoniter();
		await this.bar_chart0(this.chargedescriptionserviceAC, event);//modified by 9126
		await this.bar_chart5(domain_Name, this.volume_by_chargedescriptionserviceAC, event_type, event);
	}
	async linkfrtacc_clickHandler(event: any) {
		var domain_Name: string = "T004_Dashboard";
		if (this.month == '0') {
			var event_type: string = "year";
		} else {
			var event_type: string = "month";
		}
		this.chargedesctype = "SHP_FRT+ACC";
		await this.fun_month(this.fun_monthAC);
		await this.Spend_WeightChart(this.weightAC, this.chargedesctype);
		await this.commoniter();
		await this.bar_chart0(this.chargedescriptionserviceAC, event);//modified by 9126
		await this.bar_chart5(domain_Name, this.volume_by_chargedescriptionserviceAC, event_type, event);//modified by 9126

	}



	async loadAC(weightAC1: any, currentyear: string, currentmonth: string, clickedChargeDesc: string, chargetypevalue: string) {
		this.chargetitle = clickedChargeDesc;

		this.month = currentmonth;
		this.year = currentyear;

		this.weightAC = weightAC1;
		this.chargedesctype = chargetypevalue;
		var chargedesctype = chargetypevalue; // added ny 9126
		this.chargetypeflag = chargetypevalue;

		if (this.chargedesctype == null)
			this.chargedesctype = "SHP_FRT+ACC";


		//----------------spend by weight
		this.Spend_WeightChart(this.weightAC, this.chargedesctype);

		//------------spend by month

		this.fetchT004Rymax_chargeBack_ByMonth();

		//---------------------sepnd by Acc.no				
		this.fun_ServiceAcc_No(currentyear, currentmonth, clickedChargeDesc);


		//-----------------Volume by service
		this.fetchT004Rymax_VolumebyserviceFun(chargedesctype);

		this.fetchT004Rymax_SCCVolumebyserviceFun(chargedesctype);

		this.fun_chargeDescription_Service(currentyear, currentmonth, clickedChargeDesc, chargedesctype);
		var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
		if (this.month == '0') {
			this.chargedistritxt_text = "Charge Distribution and Services For" + " " + this.chargetitle + " " + this.year;
		}
		else {
			var monthnumber = Number(this.month);
			this.chargedistritxt_text = "Charge Distribution and Services For" + " " + this.chargetitle + " " + this.year + " " + monthArray[Number(monthnumber - 1)];
		}

	}

	async fetchT004Rymax_chargeBack_ByMonth() {
		this.httpClientService.fetchT004Rymax_chargeBack_ByMonth(this.moreviewChargeDescFormGroup.value).subscribe(
			result => {
				this.fun_monthAC = result;
				this.fun_month(this.fun_monthAC);
			},
			error => {
				console.log('error ', error);
			})
	}

	async fetchT004Rymax_SCCVolumebyserviceFun(chargedesctype: any) {
		await this.httpClientService.fetchT004Rymax_SccVolumebyService(this.moreviewChargeDescFormGroup.value).subscribe(
			(result: any) => {
				if (this.month == '0') {
					var event_type: string = "year";
				} else {
					var event_type: string = "month";
				}
				this.Sccvolume_by_chargedescriptionserviceAC = result;
				this.bar_chart6(this.Sccvolume_by_chargedescriptionserviceAC, event_type, chargedesctype);

			},
			(error: any) => {
				console.log('error ', error);

			})
	}


	async fetchT004Rymax_VolumebyserviceFun(chargedesctype: any) {
		await this.httpClientService.fetchT004Rymax_VolumebyService(this.moreviewChargeDescFormGroup.value).subscribe(
			result => {
				this.resultObj = result;

				var domain_Name: string = "T004_Dashboard";
				if (this.month == '0') {
					var event_type: string = "year";
				} else {
					var event_type: string = "month";
				}
				this.volume_by_chargedescriptionserviceAC = result;
				this.bar_chart5(domain_Name, this.volume_by_chargedescriptionserviceAC, event_type, chargedesctype);

			},
			error => {
				console.log('error ', error);
			})
	}

	async fetchDashBoard() {

		var ServiceType = this.moreviewChargeDescFormGroupUPS.get('services')?.value;
		var tableName = "T004_" + this.clientName.replace(/\s/g, "") + "_" + this.invoiceyear;

		if (this.invoiceMonth == 0) {

			var fromdate: any = this.invoiceyear + "-01-01";
			var todate: any = this.invoiceyear + "-12-31";
		}
		else {
			if (this.invoiceMonth == 1) {

				fromdate = this.invoiceyear + "-01-01";
				todate = this.invoiceyear + "-01-31";
			}
			else if (this.invoiceMonth == 2) {

				if ((Number(this.invoiceyear) % 400 == 0) || ((Number(this.invoiceyear) % 4 == 0) && (Number(this.invoiceyear) % 100 != 0))) {
					/* leap year */
					fromdate = this.invoiceyear + "-02-01";
					todate = this.invoiceyear + "-02-29";
				}
				fromdate = this.invoiceyear + "-02-01";
				todate = this.invoiceyear + "-02-28";
			}
			else if (this.invoiceMonth == 3) {

				fromdate = this.invoiceyear + "-03-01";
				todate = this.invoiceyear + "-03-31";
			}
			else if (this.invoiceMonth == 4) {

				fromdate = this.invoiceyear + "-04-01";
				todate = this.invoiceyear + "-04-30";
			}
			else if (this.invoiceMonth == 5) {

				fromdate = this.invoiceyear + "-05-01";
				todate = this.invoiceyear + "-05-31";
			}
			else if (this.invoiceMonth == 6) {

				fromdate = this.invoiceyear + "-06-01";
				todate = this.invoiceyear + "-06-30";
			}
			else if (this.invoiceMonth == 7) {

				fromdate = this.invoiceyear + "-07-01";
				todate = this.invoiceyear + "-07-31";
			}
			else if (this.invoiceMonth == 8) {

				fromdate = this.invoiceyear + "-08-01";
				todate = this.invoiceyear + "-08-31";
			}
			else if (this.invoiceMonth == 9) {

				fromdate = this.invoiceyear + "-09-01";
				todate = this.invoiceyear + "-09-30";
			}
			else if (this.invoiceMonth == 10) {

				fromdate = this.invoiceyear + "-10-01";
				todate = this.invoiceyear + "-10-31";
			}
			else if (this.invoiceMonth == 11) {

				fromdate = this.invoiceyear + "-11-01";
				todate = this.invoiceyear + "-11-30";
			}
			else if (this.invoiceMonth == 12) {

				fromdate = this.invoiceyear + "-12-01";
				todate = this.invoiceyear + "-12-31";
			}


		}

		this.apiControllerFormGroup.get('tableName')?.setValue(tableName);
		this.apiControllerFormGroup.get('serviceType')?.setValue(ServiceType);
		this.apiControllerFormGroup.get('fromDate')?.setValue(fromdate);
		this.apiControllerFormGroup.get('toDate')?.setValue(todate);

		this.httpClientService.compareUpsData(this.apiControllerFormGroup.value).subscribe(
			(result: any) => {

				var data = this.dashBoardSHP.get('chargetypevalue')?.value;

				this.fetchData(result);

			},
			(error: any) => {
				console.log('error ', error);

			})
	}
	async fetchData(result: any) {

		this.resultData.set([]);
		if (result.length > 0) {
			var t004Obj = result[0];
			var t004DashBoardCYObj: any = [];
			var monthflag = await this.moreviewChargeDescFormGroupUPS.get('month')?.value;
			var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;

			t004DashBoardCYObj["netCharge"] = await t004Obj.comparisonResults[0]['Net Charge'];
			t004DashBoardCYObj["costperPackage"] = await t004Obj.comparisonResults[0]['Cost Per Package'];
			t004DashBoardCYObj["costperlb"] = await t004Obj.comparisonResults[0]['Cost Per Lb'];
			t004DashBoardCYObj["enteredWeight"] = await t004Obj.comparisonResults[0]['Entered Weight'];
			t004DashBoardCYObj["billedWeight"] = await t004Obj.comparisonResults[0]['Billed Weight'];
			t004DashBoardCYObj["scc"] = await t004Obj.comparisonResults[0]['SCC Charge'];
			t004DashBoardCYObj["weightdifference"] = await t004Obj.comparisonResults[0]['Weight Difference'];
			t004DashBoardCYObj["netchargeFRT"] = await t004Obj.comparisonResults[0]['Net Charge FRT'];
			t004DashBoardCYObj["costperlbFRT"] = await t004Obj.comparisonResults[0]['Cost Per Lb FRT Only'];
			t004DashBoardCYObj["costperpackageFRT"] = await t004Obj.comparisonResults[0]['Cost Per Package FRT Only'];
			t004DashBoardCYObj["packageCount"] = await t004Obj.comparisonResults[0]['Total Package Count'];
			t004DashBoardCYObj["averageWeight"] = await (Number(t004Obj.comparisonResults[0]['Billed Weight']) + Number(t004Obj.comparisonResults[0]['Weight Difference'])) / Number(t004Obj.comparisonResults[0]['Total Package Count']);

			this.resultData.set(t004DashBoardCYObj);
		}
		console.log(this.resultData());
	}
	async bar_chart6(tempAC: any, event_type: string, chargedesctype: string) {
		await this.createSeriesFromAC3(tempAC, event_type, chargedesctype, "Bar");

	}

	async bar_chart5(domainName: string, tempAC: any, event_type: string, chargedesctype: string) {
		await this.createSeriesFromAC2(domainName, tempAC, event_type, chargedesctype, "Bar");

	}
	async bar_chart0(tempAC: any, chargedesctype: any) {
		await this.createSeriesFromAC0_Service(tempAC, chargedesctype, "")
	}


	async createSeriesFromAC3(collection: any, event_type: string, weightchargetype: string, seriesName: string) {
		console.log(collection);
		if (weightchargetype == null) {
			weightchargetype == "SHP_FRT+ACC";
		}
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {
				var tempObj = collection[loop];
				if (tempObj.chargetype == weightchargetype) {
					if (tempObj != null && event_type == "month") {
						if (this.chargetitle == "Ground Saver") {

							var chartData = [{ "weight": "0-16\nOz", "value": tempObj.sccCount16ounds ? tempObj.sccCount16ounds : '0' },
							{ "weight": "1", "value": tempObj.sccCount1s ? tempObj.sccCount1s : '0' },
							{ "weight": "2", "value": tempObj.sccCount2s ? tempObj.sccCount2s : '0' },
							{ "weight": "3", "value": tempObj.sccCount3s ? tempObj.sccCount3s : '0' },
							{ "weight": "4", "value": tempObj.sccCount4s ? tempObj.sccCount4s : '0' },
							{ "weight": "5", "value": tempObj.sccCount5s ? tempObj.sccCount5s : '0' },
							{ "weight": "6", "value": tempObj.sccCount6s ? tempObj.sccCount6s : '0' },
							{ "weight": "7", "value": tempObj.sccCount7s ? tempObj.sccCount7s : '0' },
							{ "weight": "8", "value": tempObj.sccCount8s ? tempObj.sccCount8s : '0' },
							{ "weight": "9", "value": tempObj.sccCount9s ? tempObj.sccCount9s : '0' },
							{ "weight": "10-20", "value": tempObj.sccCount10to20s ? tempObj.sccCount10to20s : '0' },
							{ "weight": "21+", "value": tempObj.sccCount20plus ? tempObj.sccCount20plus : '0' }];

						}
						else if ((this.chargetitle == "Next Day Air") || (this.chargetitle == "Next Day Air Saver") || (this.chargetitle == "Next Day Air A.M.") || (this.chargetitle == "2 Day")) {
							var chartData = [
								{ "weight": "LTR", "value": tempObj.sccCountLTR ? tempObj.sccCountLTR : '0' },
								{ "weight": "1", "value": tempObj.sccCount1s ? tempObj.sccCount1s : '0' },
								{ "weight": "2", "value": tempObj.sccCount2s ? tempObj.sccCount2s : '0' },
								{ "weight": "3", "value": tempObj.sccCount3s ? tempObj.sccCount3s : '0' },
								{ "weight": "4", "value": tempObj.sccCount4s ? tempObj.sccCount4s : '0' },
								{ "weight": "5", "value": tempObj.sccCount5s ? tempObj.sccCount5s : '0' },
								{ "weight": "6-10", "value": tempObj.sccCount10s ? tempObj.sccCount10s : '0' },
								{ "weight": "11-20", "value": tempObj.sccCount20s ? tempObj.sccCount20s : '0' },
								{ "weight": "21-30", "value": tempObj.sccCount30s ? tempObj.sccCount30s : '0' },
								{ "weight": "31-50", "value": tempObj.sccCount50s ? tempObj.sccCount50s : '0' },
								{ "weight": "51-70", "value": tempObj.sccCount70s ? tempObj.sccCount70s : '0' },
								{ "weight": "71-150", "value": tempObj.sccCount150s ? tempObj.sccCount150s : '0' },
								{ "weight": "151+", "value": tempObj.sccCount150plus ? tempObj.sccCount150plus : '0' }];
						}
						else {
							var chartData = [
								{ "weight": "1", "value": tempObj.sccCount1s ? tempObj.sccCount1s : '0' },
								{ "weight": "2", "value": tempObj.sccCount2s ? tempObj.sccCount2s : '0' },
								{ "weight": "3", "value": tempObj.sccCount3s ? tempObj.sccCount3s : '0' },
								{ "weight": "4", "value": tempObj.sccCount4s ? tempObj.sccCount4s : '0' },
								{ "weight": "5", "value": tempObj.sccCount5s ? tempObj.sccCount5s : '0' },
								{ "weight": "6-10", "value": tempObj.sccCount10s ? tempObj.sccCount10s : '0' },
								{ "weight": "11-20", "value": tempObj.sccCount20s ? tempObj.sccCount20s : '0' },
								{ "weight": "21-30", "value": tempObj.sccCount30s ? tempObj.sccCount30s : '0' },
								{ "weight": "31-50", "value": tempObj.sccCount50s ? tempObj.sccCount50s : '0' },
								{ "weight": "51-70", "value": tempObj.sccCount70s ? tempObj.sccCount70s : '0' },
								{ "weight": "71-150", "value": tempObj.sccCount150s ? tempObj.sccCount150s : '0' },
								{ "weight": "151+", "value": tempObj.sccCount150plus ? tempObj.sccCount150plus : '0' }];
						}
					}
					else {
						if (this.chargetitle == "Ground Saver") {

							var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearSccCount16ounds ? tempObj.yearSccCount16ounds : '0' },
							{ "weight": "1", "value": tempObj.yearSccCount1s ? tempObj.yearSccCount1s : '0' },
							{ "weight": "2", "value": tempObj.yearSccCount2s ? tempObj.yearSccCount2s : '0' },
							{ "weight": "3", "value": tempObj.yearSccCount3s ? tempObj.yearSccCount3s : '0' },
							{ "weight": "4", "value": tempObj.yearSccCount4s ? tempObj.yearSccCount4s : '0' },
							{ "weight": "5", "value": tempObj.yearSccCount5s ? tempObj.yearSccCount5s : '0' },
							{ "weight": "6", "value": tempObj.yearSccCount6s ? tempObj.yearSccCount6s : '0' },
							{ "weight": "7", "value": tempObj.yearSccCount7s ? tempObj.yearSccCount7s : '0' },
							{ "weight": "8", "value": tempObj.yearSccCount8s ? tempObj.yearSccCount8s : '0' },
							{ "weight": "9", "value": tempObj.yearSccCount9s ? tempObj.yearSccCount9s : '0' },
							{ "weight": "10-20", "value": tempObj.yearSccCount10to20s ? tempObj.yearSccCount10to20s : '0' },
							{ "weight": "21+", "value": tempObj.yearSccCount20plus ? tempObj.yearSccCount20plus : '0' }];
						}
						else if ((this.chargetitle == "Next Day Air") || (this.chargetitle == "Next Day Air Saver") || (this.chargetitle == "Next Day Air A.M.") || (this.chargetitle == "2 Day")) {
							var chartData = [
								{ "weight": "LTR", "value": tempObj.yearSccCountLTR ? tempObj.yearSccCountLTR : '0' },
								{ "weight": "1", "value": tempObj.yearSccCount1s ? tempObj.yearSccCount1s : '0' },
								{ "weight": "2", "value": tempObj.yearSccCount2s ? tempObj.yearSccCount2s : '0' },
								{ "weight": "3", "value": tempObj.yearSccCount3s ? tempObj.yearSccCount3s : '0' },
								{ "weight": "4", "value": tempObj.yearSccCount4s ? tempObj.yearSccCount4s : '0' },
								{ "weight": "5", "value": tempObj.yearSccCount5s ? tempObj.yearSccCount5s : '0' },
								{ "weight": "6-10", "value": tempObj.yearSccCount10s ? tempObj.yearSccCount10s : '0' },
								{ "weight": "11-20", "value": tempObj.yearSccCount20s ? tempObj.yearSccCount20s : '0' },
								{ "weight": "21-30", "value": tempObj.yearSccCount30s ? tempObj.yearSccCount30s : '0' },
								{ "weight": "31-50", "value": tempObj.yearSccCount50s ? tempObj.yearSccCount50s : '0' },
								{ "weight": "51-70", "value": tempObj.yearSccCount70s ? tempObj.yearSccCount70s : '0' },
								{ "weight": "71-150", "value": tempObj.yearSccCount150s ? tempObj.yearSccCount150s : '0' },
								{ "weight": "151+", "value": tempObj.yearSccCount150plus ? tempObj.yearSccCount150plus : '0' }];
						}
						else {
							var chartData = [
								{ "weight": "1", "value": tempObj.yearSccCount1s ? tempObj.yearSccCount1s : '0' },
								{ "weight": "2", "value": tempObj.yearSccCount2s ? tempObj.yearSccCount2s : '0' },
								{ "weight": "3", "value": tempObj.yearSccCount3s ? tempObj.yearSccCount3s : '0' },
								{ "weight": "4", "value": tempObj.yearSccCount4s ? tempObj.yearSccCount4s : '0' },
								{ "weight": "5", "value": tempObj.yearSccCount5s ? tempObj.yearSccCount5s : '0' },
								{ "weight": "6-10", "value": tempObj.yearSccCount10s ? tempObj.yearSccCount10s : '0' },
								{ "weight": "11-20", "value": tempObj.yearSccCount20s ? tempObj.yearSccCount20s : '0' },
								{ "weight": "21-30", "value": tempObj.yearSccCount30s ? tempObj.yearSccCount30s : '0' },
								{ "weight": "31-50", "value": tempObj.yearSccCount50s ? tempObj.yearSccCount50s : '0' },
								{ "weight": "51-70", "value": tempObj.yearSccCount70s ? tempObj.yearSccCount70s : '0' },
								{ "weight": "71-150", "value": tempObj.yearSccCount150s ? tempObj.yearSccCount150s : '0' },
								{ "weight": "151+", "value": tempObj.yearSccCount150plus ? tempObj.yearSccCount150plus : '0' }];
						}
					}

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
			let chart: any = am4core.create("Sccvolume_weight", am4charts.XYChart);
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
			var indicator: any | null = null;
			let indicatorInterval: any;
			function showIndicator() {
				if (!indicator) return;
				if (indicator) {
					indicator.dispose();
					indicator = null;
				}


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
				if (!indicator) return;
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
			series.tooltipText = "Weight: [bold]{categoryX}[/]  \n Count: [bold]{valueY}[/]";
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
			// columnTemplate.adapter.add("fill", function (fill: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

			// columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

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
			this.Sccvolume_weightChart = chart;
			hideIndicator();
		});
	}


	async createSeriesFromAC2(domainName: string, collection: any, event_type: string, weightchargetype: string, seriesName: string) {
		if (weightchargetype == null) {
			weightchargetype == "SHP_FRT+ACC";
		}
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {
				var tempObj = collection[loop];
				if (tempObj.chargetype == weightchargetype) {
					if (tempObj != null && event_type == "month") {
						if (this.chargetitle == "Ground Saver") {

							var chartData = [{ "weight": "0-16\nOz", "value": tempObj.volumeless16ounds ? tempObj.volumeless16ounds : '0' },
							{ "weight": "1", "value": tempObj.volumeless1s ? tempObj.volumeless1s : '0' },
							{ "weight": "2", "value": tempObj.volumeless2s ? tempObj.volumeless2s : '0' },
							{ "weight": "3", "value": tempObj.volumeless3s ? tempObj.volumeless3s : '0' },
							{ "weight": "4", "value": tempObj.volumeless4s ? tempObj.volumeless4s : '0' },
							{ "weight": "5", "value": tempObj.volumeless5s ? tempObj.volumeless5s : '0' },
							{ "weight": "6", "value": tempObj.volumeless6s ? tempObj.volumeless6s : '0' },
							{ "weight": "7", "value": tempObj.volumeless7s ? tempObj.volumeless7s : '0' },
							{ "weight": "8", "value": tempObj.volumeless8s ? tempObj.volumeless8s : '0' },
							{ "weight": "9", "value": tempObj.volumeless9s ? tempObj.volumeless9s : '0' },
							{ "weight": "10-20", "value": tempObj.volumeless10to20s ? tempObj.volumeless10to20s : '0' },
							{ "weight": "21+", "value": tempObj.volumeless20plus ? tempObj.volumeless20plus : '0' }];

						}
						else if ((this.chargetitle == "Next Day Air") || (this.chargetitle == "Next Day Air Saver") || (this.chargetitle == "Next Day Air A.M.") || (this.chargetitle == "2 Day")) {
							var chartData = [
								{ "weight": "LTR", "value": tempObj.volumeLTR ? tempObj.volumeLTR : '0' },
								{ "weight": "1", "value": tempObj.volumeless1s ? tempObj.volumeless1s : '0' },
								{ "weight": "2", "value": tempObj.volumeless2s ? tempObj.volumeless2s : '0' },
								{ "weight": "3", "value": tempObj.volumeless3s ? tempObj.volumeless3s : '0' },
								{ "weight": "4", "value": tempObj.volumeless4s ? tempObj.volumeless4s : '0' },
								{ "weight": "5", "value": tempObj.volumeless5s ? tempObj.volumeless5s : '0' },
								{ "weight": "6-10", "value": tempObj.volumeless10s ? tempObj.volumeless10s : '0' },
								{ "weight": "11-20", "value": tempObj.volumeless20s ? tempObj.volumeless20s : '0' },
								{ "weight": "21-30", "value": tempObj.volumeless30s ? tempObj.volumeless30s : '0' },
								{ "weight": "31-50", "value": tempObj.volumeless50s ? tempObj.volumeless50s : '0' },
								{ "weight": "51-70", "value": tempObj.volumeless70s ? tempObj.volumeless70s : '0' },
								{ "weight": "71-150", "value": tempObj.volumeless150s ? tempObj.volumeless150s : '0' },
								{ "weight": "151+", "value": tempObj.volumeless150plus ? tempObj.volumeless150plus : '0' }];
						}
						else {
							var chartData = [
								{ "weight": "1", "value": tempObj.volumeless1s ? tempObj.volumeless1s : '0' },
								{ "weight": "2", "value": tempObj.volumeless2s ? tempObj.volumeless2s : '0' },
								{ "weight": "3", "value": tempObj.volumeless3s ? tempObj.volumeless3s : '0' },
								{ "weight": "4", "value": tempObj.volumeless4s ? tempObj.volumeless4s : '0' },
								{ "weight": "5", "value": tempObj.volumeless5s ? tempObj.volumeless5s : '0' },
								{ "weight": "6-10", "value": tempObj.volumeless10s ? tempObj.volumeless10s : '0' },
								{ "weight": "11-20", "value": tempObj.volumeless20s ? tempObj.volumeless20s : '0' },
								{ "weight": "21-30", "value": tempObj.volumeless30s ? tempObj.volumeless30s : '0' },
								{ "weight": "31-50", "value": tempObj.volumeless50s ? tempObj.volumeless50s : '0' },
								{ "weight": "51-70", "value": tempObj.volumeless70s ? tempObj.volumeless70s : '0' },
								{ "weight": "71-150", "value": tempObj.volumeless150s ? tempObj.volumeless150s : '0' },
								{ "weight": "151+", "value": tempObj.volumeless150plus ? tempObj.volumeless150plus : '0' }];
						}
					}
					else {
						if (this.chargetitle == "Ground Saver") {

							var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearVolumeless16ounds ? tempObj.yearVolumeless16ounds : '0' },
							{ "weight": "1", "value": tempObj.yearVolumeless1s ? tempObj.yearVolumeless1s : '0' },
							{ "weight": "2", "value": tempObj.yearVolumeless2s ? tempObj.yearVolumeless2s : '0' },
							{ "weight": "3", "value": tempObj.yearVolumeless3s ? tempObj.yearVolumeless3s : '0' },
							{ "weight": "4", "value": tempObj.yearVolumeless4s ? tempObj.yearVolumeless4s : '0' },
							{ "weight": "5", "value": tempObj.yearVolumeless5s ? tempObj.yearVolumeless5s : '0' },
							{ "weight": "6", "value": tempObj.yearVolumeless6s ? tempObj.yearVolumeless6s : '0' },
							{ "weight": "7", "value": tempObj.yearVolumeless7s ? tempObj.yearVolumeless7s : '0' },
							{ "weight": "8", "value": tempObj.yearVolumeless8s ? tempObj.yearVolumeless8s : '0' },
							{ "weight": "9", "value": tempObj.yearVolumeless9s ? tempObj.yearVolumeless9s : '0' },
							{ "weight": "10-20", "value": tempObj.yearVolumeless10to20s ? tempObj.yearVolumeless10to20s : '0' },
							{ "weight": "21+", "value": tempObj.yearVolumeless20plus ? tempObj.yearVolumeless20plus : '0' }];
						}
						else if ((this.chargetitle == "Next Day Air") || (this.chargetitle == "Next Day Air Saver") || (this.chargetitle == "Next Day Air A.M.") || (this.chargetitle == "2 Day")) {
							var chartData = [
								{ "weight": "LTR", "value": tempObj.yearVolumeLTR ? tempObj.yearVolumeLTR : '0' },
								{ "weight": "1", "value": tempObj.yearVolumeless1s ? tempObj.yearVolumeless1s : '0' },
								{ "weight": "2", "value": tempObj.yearVolumeless2s ? tempObj.yearVolumeless2s : '0' },
								{ "weight": "3", "value": tempObj.yearVolumeless3s ? tempObj.yearVolumeless3s : '0' },
								{ "weight": "4", "value": tempObj.yearVolumeless4s ? tempObj.yearVolumeless4s : '0' },
								{ "weight": "5", "value": tempObj.yearVolumeless5s ? tempObj.yearVolumeless5s : '0' },
								{ "weight": "6-10", "value": tempObj.yearVolumeless10s ? tempObj.yearVolumeless10s : '0' },
								{ "weight": "11-20", "value": tempObj.yearVolumeless20s ? tempObj.yearVolumeless20s : '0' },
								{ "weight": "21-30", "value": tempObj.yearVolumeless30s ? tempObj.yearVolumeless30s : '0' },
								{ "weight": "31-50", "value": tempObj.yearVolumeless50s ? tempObj.yearVolumeless50s : '0' },
								{ "weight": "51-70", "value": tempObj.yearVolumeless70s ? tempObj.yearVolumeless70s : '0' },
								{ "weight": "71-150", "value": tempObj.yearVolumeless150s ? tempObj.yearVolumeless150s : '0' },
								{ "weight": "151+", "value": tempObj.yearVolumeless150plus ? tempObj.yearVolumeless150plus : '0' }];
						}
						else {
							var chartData = [
								{ "weight": "1", "value": tempObj.yearVolumeless1s ? tempObj.yearVolumeless1s : '0' },
								{ "weight": "2", "value": tempObj.yearVolumeless2s ? tempObj.yearVolumeless2s : '0' },
								{ "weight": "3", "value": tempObj.yearVolumeless3s ? tempObj.yearVolumeless3s : '0' },
								{ "weight": "4", "value": tempObj.yearVolumeless4s ? tempObj.yearVolumeless4s : '0' },
								{ "weight": "5", "value": tempObj.yearVolumeless5s ? tempObj.yearVolumeless5s : '0' },
								{ "weight": "6-10", "value": tempObj.yearVolumeless10s ? tempObj.yearVolumeless10s : '0' },
								{ "weight": "11-20", "value": tempObj.yearVolumeless20s ? tempObj.yearVolumeless20s : '0' },
								{ "weight": "21-30", "value": tempObj.yearVolumeless30s ? tempObj.yearVolumeless30s : '0' },
								{ "weight": "31-50", "value": tempObj.yearVolumeless50s ? tempObj.yearVolumeless50s : '0' },
								{ "weight": "51-70", "value": tempObj.yearVolumeless70s ? tempObj.yearVolumeless70s : '0' },
								{ "weight": "71-150", "value": tempObj.yearVolumeless150s ? tempObj.yearVolumeless150s : '0' },
								{ "weight": "151+", "value": tempObj.yearVolumeless150plus ? tempObj.yearVolumeless150plus : '0' }];
						}
					}

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
			var indicator: any | null = null;
			let indicatorInterval: any;
			function showIndicator() {
				if (!indicator) return;
				if (indicator) {
					indicator.dispose();
					indicator = null;
				}

				indicator = chart.tooltipContainer.createChild(am4core.Container);
				indicator.background.fill = am4core.color("#fff");
				indicator.background.fillOpacity = 0.8;
				indicator.width = am4core.percent(100);
				indicator.height = am4core.percent(100);

				const indicatorLabel = indicator.createChild(am4core.Label);
				indicatorLabel.text = "Loading...";
				indicatorLabel.align = "center";
				indicatorLabel.valign = "middle";
				indicatorLabel.fontSize = 20;
				indicatorLabel.dy = 50;

				const hourglass = indicator.createChild(am4core.Image);
				hourglass.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/hourglass.svg";
				hourglass.align = "center";
				hourglass.valign = "middle";
				hourglass.horizontalCenter = "middle";
				hourglass.verticalCenter = "middle";
				hourglass.scale = 0.7;

				indicator.show();

				// ✅ SAFE CLEAR
				if (indicatorInterval) {
					clearInterval(indicatorInterval);
				}

				indicatorInterval = setInterval(() => {
					hourglass.animate(
						[{ from: 0, to: 360, property: "rotation" }],
						2000
					);
				}, 3000);
			}


			function hideIndicator() {
				if (!indicator) return;
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
			// columnTemplate.adapter.add("fill", function (fill: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

			// columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

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
						if (this.chargetitle == "Ground Saver") {
							var chartData = [{ "weight": "0-16\nOz", "value": tempObj.chargeYearAverageCostless16ounds ? tempObj.chargeYearAverageCostless16ounds : '0' },
							{ "weight": "1", "value": tempObj.chargeYearAverageCostless1s ? tempObj.chargeYearAverageCostless1s : '0' },
							{ "weight": "2", "value": tempObj.chargeYearAverageCostless2s ? tempObj.chargeYearAverageCostless2s : '0' },
							{ "weight": "3", "value": tempObj.chargeYearAverageCostless3s ? tempObj.chargeYearAverageCostless3s : '0' },
							{ "weight": "4", "value": tempObj.chargeYearAverageCostless4s ? tempObj.chargeYearAverageCostless4s : '0' },
							{ "weight": "5", "value": tempObj.chargeYearAverageCostless5s ? tempObj.chargeYearAverageCostless5s : '0' },
							{ "weight": "6", "value": tempObj.chargeYearAverageCostless6s ? tempObj.chargeYearAverageCostless6s : '0' },
							{ "weight": "7", "value": tempObj.chargeYearAverageCostless7s ? tempObj.chargeYearAverageCostless7s : '0' },
							{ "weight": "8", "value": tempObj.chargeYearAverageCostless8s ? tempObj.chargeYearAverageCostless8s : '0' },
							{ "weight": "9", "value": tempObj.chargeYearAverageCostless9s ? tempObj.chargeYearAverageCostless9s : '0' },
							{ "weight": "10-20", "value": tempObj.chargeYearAverageCostless10to20s ? tempObj.chargeYearAverageCostless10to20s : '0' },
							{ "weight": "21+", "value": tempObj.chargeYearAverageCostless20plus ? tempObj.chargeYearAverageCostless20plus : '0' }];

						}
						else if ((this.chargetitle == "Next Day Air") || (this.chargetitle == "Next Day Air Saver") || (this.chargetitle == "Next Day Air A.M.") || (this.chargetitle == "2 Day")) {
							var chartData = [
								{ "weight": "LTR", "value": tempObj.chargeYearAverageCostLTR ? tempObj.chargeYearAverageCostLTR : '0' },
								{ "weight": "1", "value": tempObj.chargeYearAverageCostless1s ? tempObj.chargeYearAverageCostless1s : '0' },
								{ "weight": "2", "value": tempObj.chargeYearAverageCostless2s ? tempObj.chargeYearAverageCostless2s : '0' },
								{ "weight": "3", "value": tempObj.chargeYearAverageCostless3s ? tempObj.chargeYearAverageCostless3s : '0' },
								{ "weight": "4", "value": tempObj.chargeYearAverageCostless4s ? tempObj.chargeYearAverageCostless4s : '0' },
								{ "weight": "5", "value": tempObj.chargeYearAverageCostless5s ? tempObj.chargeYearAverageCostless5s : '0' },
								{ "weight": "6-10", "value": tempObj.chargeYearAverageCostless10s ? tempObj.chargeYearAverageCostless10s : '0' },
								{ "weight": "11-20", "value": tempObj.chargeYearAverageCostless20s ? tempObj.chargeYearAverageCostless20s : '0' },
								{ "weight": "21-30", "value": tempObj.chargeYearAverageCostless30s ? tempObj.chargeYearAverageCostless30s : '0' },
								{ "weight": "31-50", "value": tempObj.chargeYearAverageCostless50s ? tempObj.chargeYearAverageCostless50s : '0' },
								{ "weight": "51-70", "value": tempObj.chargeYearAverageCostless70s ? tempObj.chargeYearAverageCostless70s : '0' },
								{ "weight": "71-150", "value": tempObj.chargeYearAverageCostless150s ? tempObj.chargeYearAverageCostless150s : '0' },
								{ "weight": "151+", "value": tempObj.chargeYearAverageCostless150Plus ? tempObj.chargeYearAverageCostless150Plus : '0' }];
						}
						else {
							var chartData = [
								{ "weight": "1", "value": tempObj.chargeYearAverageCostless1s ? tempObj.chargeYearAverageCostless1s : '0' },
								{ "weight": "2", "value": tempObj.chargeYearAverageCostless2s ? tempObj.chargeYearAverageCostless2s : '0' },
								{ "weight": "3", "value": tempObj.chargeYearAverageCostless3s ? tempObj.chargeYearAverageCostless3s : '0' },
								{ "weight": "4", "value": tempObj.chargeYearAverageCostless4s ? tempObj.chargeYearAverageCostless4s : '0' },
								{ "weight": "5", "value": tempObj.chargeYearAverageCostless5s ? tempObj.chargeYearAverageCostless5s : '0' },
								{ "weight": "6-10", "value": tempObj.chargeYearAverageCostless10s ? tempObj.chargeYearAverageCostless10s : '0' },
								{ "weight": "11-20", "value": tempObj.chargeYearAverageCostless20s ? tempObj.chargeYearAverageCostless20s : '0' },
								{ "weight": "21-30", "value": tempObj.chargeYearAverageCostless30s ? tempObj.chargeYearAverageCostless30s : '0' },
								{ "weight": "31-50", "value": tempObj.chargeYearAverageCostless50s ? tempObj.chargeYearAverageCostless50s : '0' },
								{ "weight": "51-70", "value": tempObj.chargeYearAverageCostless70s ? tempObj.chargeYearAverageCostless70s : '0' },
								{ "weight": "71-150", "value": tempObj.chargeYearAverageCostless150s ? tempObj.chargeYearAverageCostless150s : '0' },
								{ "weight": "151+", "value": tempObj.chargeYearAverageCostless150Plus ? tempObj.chargeYearAverageCostless150Plus : '0' }];
						}
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
			var indicator: any | null = null;
			let indicatorInterval: any;
			function showIndicator() {
				if (!indicator) return;
				if (indicator) {
					indicator.dispose();
					indicator = null;
				}

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
				if (!indicator) return;
				indicator.hide();
				clearInterval(indicatorInterval);
			}


			// Create axes
			let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
			categoryAxis.cursorTooltipEnabled = false; //disable axis tooltip
			categoryAxis.dataFields.category = "weight";
			categoryAxis.renderer.labels.template.rotation = 0;
			categoryAxis.renderer.labels.template.hideOversized = false;
			categoryAxis.renderer.minGridDistance = 30;
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
				const weight = ev.target.dataItem?.categories?.categoryX;
				this.createSeriesFromAC0_Service(chartData, "", weight);
			});

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.stroke = am4core.color("#FFFFFF");
			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;
			// columnTemplate.adapter.add("fill", function (fill: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

			// columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })
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
	async fun_month(arrayAC: any) {
		var invoicemonthAC: any = [];
		var totalmonth = 12;
		var monthNo = 0;
		var year: string = '';

		if (this.chargedesctype == "SHP_FRT+ACC")
			this.chargedesctype = null;
		for (var listcount = 0; listcount < arrayAC.length; listcount++) {
			this.t004tempObj = arrayAC[listcount];

			year = this.t004tempObj['invoiceyear'];
			if (!invoicemonthAC.indexOf(this.t004tempObj['invoiceMonth']))
				invoicemonthAC.push(this.t004tempObj['invoiceMonth']);

		}

		var resultmonthAC = [];
		for (var monthcount = 0; monthcount < totalmonth; monthcount++) {

			monthNo++;
			if (!invoicemonthAC.indexOf(String(monthNo)))
				resultmonthAC.push(String(monthNo));

		}

		for (var loop = 0; loop < resultmonthAC.length; loop++) {
			this.t004tempObj['invoiceMonth'] = resultmonthAC[loop].toString();
			this.t004tempObj['invoiceyear'] = year;
			arrayAC.push(this.t004tempObj);

		}




		for (var count = 0; count < arrayAC.length; count++) {


			var t004Obj = arrayAC[count];


			var totVaule: string = t004Obj.netamount;
			var chargetypevalue = t004Obj.chargetype;
			if (t004Obj.invoiceMonth == "1")
				this.tempt004AC.push({ Month: "JAN", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "2")
				this.tempt004AC.push({ Month: "FEB", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "3")
				this.tempt004AC.push({ Month: "MAR", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "4")
				this.tempt004AC.push({ Month: "APR", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "5")
				this.tempt004AC.push({ Month: "MAY", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "6")
				this.tempt004AC.push({ Month: "JUN", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "7")
				this.tempt004AC.push({ Month: "JULY", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "8")
				this.tempt004AC.push({ Month: "AUG", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "9")
				this.tempt004AC.push({ Month: "SEP", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "10")
				this.tempt004AC.push({ Month: "OCT", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "11")
				this.tempt004AC.push({ Month: "NOV", value: totVaule, chargetyperesult: chargetypevalue });
			if (t004Obj.invoiceMonth == "12")
				this.tempt004AC.push({ Month: "DEC", value: totVaule, chargetyperesult: chargetypevalue });


		}

		this.Spend_Month(this.tempt004AC); //---------------------------Spend By Month 

	}


	//-------------Sender		



	async fun_chargeDescription_Service(currentyear: string, currentmonth: string, clickedChargeDesc: string, chargedesctype: any) {



		this.fetchT004Rymax_chargeDescription_Service(chargedesctype);

	}
	async fetchT000Top_ten_States_By_Receiver_result(event: any) {
		this.ten_StateAC_Reveiver = event;
		this.ten_StateACfrt_Reveiver = this.ten_StateAC_Reveiver;

	}

	async fetchT004Rymax_chargeDescription_Service(chargedesctype: any) {
		this.httpClientService.fetchT004Rymax_chargeDescription_Service(this.moreviewChargeDescFormGroup.value).subscribe(
			result => {
				this.chargedescriptionserviceAC = result;
				this.bar_chart0(this.chargedescriptionserviceAC, chargedesctype);
			},
			error => {
				console.log('error ', error);
			})
	}

	async fun_ServiceAcc_No(currentyear: string, currentmonth: string, clickedChargeDesc: string) {
		await this.httpClientService.fetchT000Service_Acc(this.moreviewChargeDescFormGroup.value).subscribe(
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
			var tempobj: any = this.serviceAccAC[count];
			if (tempobj.chargeType == "SHP_FRT") {
				this.commonACSHP_FRT.push(tempobj);
			}
			else {
				this.commonACSHP_FRT_ACC.push(tempobj);
			}
		}

		if (this.chargedesctype == null)
			this.chargedesctype = "SHP_FRT+ACC";

		await this.commoniter();
	}
	async commoniter() {

		if (this.chargedesctype == "SHP_FRT+ACC") {
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
	}

	async common() {
		this.commonAC = [];
		if (this.chargedesctype == null)
			this.chargedesctype = "SHP_FRT+ACC";
		if (this.chargedesctype == "SHP_FRT+ACC") {

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
	async Spend_WeightChart(tempAC: any, chargedesctype: string) {
		await this.createSeriesFromAC(tempAC, chargedesctype);
	}

	async createSeriesFromAC(collection: any, chargedesctype: string) {

		if (collection.length > 0)

			if (chargedesctype == "SHP_FRT") {
				var tempObj = collection[1];
			}
			else {
				var tempObj = collection[0];
			}

		if (tempObj != null) {
			if (this.chargetitle == "Ground Saver") {
				var chartData = [{ "weight": "0-16\nOz", "value": tempObj.less16ounds ? tempObj.less16ounds : '0' },
				{ "weight": "1", "value": tempObj.less1s ? tempObj.less1s : '0' },
				{ "weight": "2", "value": tempObj.less2s ? tempObj.less2s : '0' },
				{ "weight": "3", "value": tempObj.less3s ? tempObj.less3s : '0' },
				{ "weight": "4", "value": tempObj.less4s ? tempObj.less4s : '0' },
				{ "weight": "5", "value": tempObj.less5s ? tempObj.less5s : '0' },
				{ "weight": "6", "value": tempObj.less6s ? tempObj.less6s : '0' },
				{ "weight": "7", "value": tempObj.less7s ? tempObj.less7s : '0' },
				{ "weight": "8", "value": tempObj.less8s ? tempObj.less8s : '0' },
				{ "weight": "9", "value": tempObj.less9s ? tempObj.less9s : '0' },
				{ "weight": "10-20", "value": tempObj.less10to20s ? tempObj.less10to20s : '0' },
				{ "weight": "21+", "value": tempObj.less20plus ? tempObj.less20plus : '0' }];


			}
			else if ((this.chargetitle == "Next Day Air") || (this.chargetitle == "Next Day Air Saver") || (this.chargetitle == "Next Day Air A.M.") || (this.chargetitle == "2 Day")) {
				var chartData = [
					{ "weight": "LTR", "value": tempObj.netChargeLTR ? tempObj.netChargeLTR : '0' },
					{ "weight": "1", "value": tempObj.less1s ? tempObj.less1s : '0' },
					{ "weight": "2", "value": tempObj.less2s ? tempObj.less2s : '0' },
					{ "weight": "3", "value": tempObj.less3s ? tempObj.less3s : '0' },
					{ "weight": "4", "value": tempObj.less4s ? tempObj.less4s : '0' },
					{ "weight": "5", "value": tempObj.less5s ? tempObj.less5s : '0' },
					{ "weight": "6-10", "value": tempObj.less10s ? tempObj.less10s : '0' },
					{ "weight": "11-20", "value": tempObj.less20s ? tempObj.less20s : '0' },
					{ "weight": "21-30", "value": tempObj.less30s ? tempObj.less30s : '0' },
					{ "weight": "31-50", "value": tempObj.less50s ? tempObj.less50s : '0' },
					{ "weight": "51-70", "value": tempObj.less70s ? tempObj.less70s : '0' },
					{ "weight": "71-150", "value": tempObj.less150s ? tempObj.less150s : '0' },
					{ "weight": "151+", "value": tempObj.less150plus ? tempObj.less150plus : '0' }];

			}
			else {
				var chartData = [
					{ "weight": "1", "value": tempObj.less1s ? tempObj.less1s : '0' },
					{ "weight": "2", "value": tempObj.less2s ? tempObj.less2s : '0' },
					{ "weight": "3", "value": tempObj.less3s ? tempObj.less3s : '0' },
					{ "weight": "4", "value": tempObj.less4s ? tempObj.less4s : '0' },
					{ "weight": "5", "value": tempObj.less5s ? tempObj.less5s : '0' },
					{ "weight": "6-10", "value": tempObj.less10s ? tempObj.less10s : '0' },
					{ "weight": "11-20", "value": tempObj.less20s ? tempObj.less20s : '0' },
					{ "weight": "21-30", "value": tempObj.less30s ? tempObj.less30s : '0' },
					{ "weight": "31-50", "value": tempObj.less50s ? tempObj.less50s : '0' },
					{ "weight": "51-70", "value": tempObj.less70s ? tempObj.less70s : '0' },
					{ "weight": "71-150", "value": tempObj.less150s ? tempObj.less150s : '0' },
					{ "weight": "151+", "value": tempObj.less150plus ? tempObj.less150plus : '0' }];

			}
		}

		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("weight_disPopup", am4charts.XYChart);

			showIndicator();
			var indicator: any | null = null;
			let indicatorInterval: any;
			function showIndicator() {
				if (!indicator) return;
				if (indicator) {
					indicator.dispose();
					indicator = null;
				}
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
				if (!indicator) return;
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
			categoryAxis.renderer.minGridDistance = 30;
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
			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;
			series.columns.template.fillOpacity = 1;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.fontSize = 12;
			columnTemplate.stroke = am4core.color("#FFFFFF");

			// columnTemplate.adapter.add("fill", function (fill: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

			// columnTemplate.adapter.add("stroke", function (stroke: any, target: any) {
			// 	return chart.colors.getIndex(target.dataItem.index);
			// })

			series.columns.template.adapter.add('fill', (_: any, target: any) => {
				return am4core.color(this.barColors[target.dataItem.index % this.barColors.length]);
			})

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


	async createSeriesFromAC1(collection: any, chargedesctype: any, nameField: string, yField: string) {

		this.hashMapObjData.clear();

		if (collection.length > 0)

			if (chargedesctype == "SHP_FRT+ACC")
				chargedesctype = null;
		var chartData: any = [];
		for (var count = 0; count < collection.length; count++) {


			var t004Objtemp = collection[count];
			if (t004Objtemp.chargetyperesult == null) {
				var month: string = '';

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

				var yField: string = t004Objtemp.value;
				this.hashMapObjData.set("" + month, t004Objtemp);
			}

			if (t004Objtemp.chargetyperesult == "SHP_FRT") {
				var month: string = '';

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

				var yField: string = t004Objtemp.value;
				this.hashMapFRTObjData.set("" + month, t004Objtemp);
			}



		}
		if (chargedesctype == "SHP_FRT") {

			for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
				var dataLoop_val = dataLoop + 1 + "";
				var t004Obj = this.hashMapFRTObjData.get(dataLoop_val);


				if (t004Obj != null) {
					var Month: string = t004Obj.Month;


					var yField: string = t004Obj.value;

					var monthStr: any = this.hashMapObj.get(t004Obj.Month) as string;

					chartData.push({ "Month": Month, "value": yField });



				}
			}

		}
		else {
			for (var dataLoop = 0; dataLoop < this.hashMapObj.size; dataLoop++) {
				var dataLoop_val = dataLoop + 1 + "";
				var t004Obj = this.hashMapObjData.get(dataLoop_val);


				if (t004Obj != null) {
					var Month: string = t004Obj.Month;


					var yField: string = t004Obj.value;

					var monthStr: any = this.hashMapObj.get(t004Obj.Month) as string;
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
			var indicator: any | null = null;
			let indicatorInterval: any;
			function showIndicator() {
				if (!indicator) return;
				if (indicator) {
					indicator.dispose();
					indicator = null;
				}


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
				if (!indicator) return;
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
			series.tooltipText = "Month: [bold] {categoryX}[/]  \n Net Charge: $[bold]{valueY.formatNumber('#,###.00')}";
			//Charge description UI issue - 
			series.tooltip.autoTextColor = false;
			series.tooltip.label.fill = am4core.color("#ffffff");
			//Charge description UI issue - 
			series.columns.template.strokeWidth = 0;

			series.tooltip.pointerOrientation = "vertical";

			series.columns.template.column.cornerRadiusTopLeft = 10;
			series.columns.template.column.cornerRadiusTopRight = 10;
			series.columns.template.column.fillOpacity = 1;
			series.columns.template.fontSize = 12;
			// on hover, make corner radiuses bigger
			let hoverState = series.columns.template.column.states.create("hover");
			hoverState.properties.cornerRadiusTopLeft = 0;
			hoverState.properties.cornerRadiusTopRight = 0;
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
		await this.createSeriesFromAC21(tempAC, "Bar");
	}

	async createSeriesFromAC21(collection: any, seriesName: string) {
		let chartData = [];
		if (this.chargedesctype == null)
			this.chargedesctype = "SHP_FRT+ACC"
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {

				var tempObj = collection[loop];
				if (tempObj.chargeType == this.chargedesctype) {
					var value1: string = tempObj.group;
					var nameFiled: string = tempObj.accountNumber;

					var yField: string = tempObj.netamount;
					chartData.push({ "name": nameFiled, "points": yField })
				}
			}

		}
		else {

			var nameFiled: string = "Nil";
			var yField: string = "0";
			chartData.push({ "name": nameFiled, "points": yField })
		}


		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("acc_no", am4charts.XYChart);
			showIndicator();
			var indicator: any | null = null;
			let indicatorInterval: any;
			function showIndicator() {
				if (!indicator) return;
				if (indicator) {
					indicator.dispose();
					indicator = null;
				}


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
				if (!indicator) return;
				indicator.hide();
				clearInterval(indicatorInterval);
			}
			chart.scrollbarX = new am4core.Scrollbar();
			// Add data
			chart.data = chartData;

			var minNegVal = false;
			for (var loop = 0; loop < chartData.length; loop++) {
				let netAmtArray: any = chartData;
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
			series.columns.template.fillOpacity = 1;

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




	async repostExcelDownload(event: any) {
		var urlParam: any = {};
		var monthVal = await this.moreviewChargeDescFormGroup.get('invoicemonth')?.value
		var clickedYear = await this.moreviewChargeDescFormGroup.get('invoiceyear')?.value;
		if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }
		var clientName = await this.moreviewChargeDescFormGroup.get('clientName')?.value;
		var clientId = await this.moreviewChargeDescFormGroup.get('clientId')?.value;
		var chargetypevalue = await this.dashBoardSHP.get('chargetypevalue')?.value;
		var chargeDescription = await this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;


		if (clickedMonth == 0) {
			urlParam['fromdate'] = clickedYear + "-01" + "-01";
			urlParam['todate'] = clickedYear + "-12" + "-31";

		}
		else {
			var date = new Date(clickedYear, clickedMonth, 0);
			var lastDay = date.getDate();
			urlParam['fromdate'] = clickedYear + "-" + clickedMonth + "-01";
			urlParam['todate'] = clickedYear + "-" + clickedMonth + "-" + lastDay;
		}
		urlParam['action'] = event;
		urlParam['chargedesc'] = chargeDescription;
		urlParam['year'] = clickedYear;
		urlParam['chargemonth'] = clickedMonth;
		urlParam['clientId'] = clientId;
		urlParam['clientName'] = clientName;
		urlParam['chargetyperesult'] = chargetypevalue;
		var fields_string: any = "";
		for (const [key, value] of Object.entries(urlParam)) {
			fields_string += key + '=' + value + '&';
		}
		this.httpClientService.reportServlet(fields_string);
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

			if (this.Sccvolume_weightChart) {
				this.Sccvolume_weightChart.dispose();
			}
		});
	}
	//Account st chart 

	btnBackacc_clickHandler(event: any) {
		// TODO Auto-generated method stub
		if (this.weightchargetype == null)
			this.weightchargetype = "SHP_FRT+ACC"
		if (this.weightchargetype == "SHP_FRT+ACC") {
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

	async report_clickHandler(event: any) {
		var t007_reportlogobj: any = {};
		var designFileName = event;
		var date = new Date();
		var dateValue = this.datePipe.transform(date, "yyyy-MM-dd");
		var monthVal = await this.month;
		var clickedYear = await this.year;

		if (monthVal == null) {
			var clickedMonth = 0;
		}
		else {
			clickedMonth = monthVal;
		}

		if (clickedMonth == 0) {
			t007_reportlogobj['fromDate'] = clickedYear + "-01" + "-01";
			t007_reportlogobj['toDate'] = clickedYear + "-12" + "-31";

		}
		else {
			var date = new Date(clickedYear, clickedMonth, 0);
			var lastDay = date.getDate();
			t007_reportlogobj['fromDate'] = clickedYear + "-" + clickedMonth + "-01";
			t007_reportlogobj['month'] = clickedMonth.toString();
			t007_reportlogobj['toDate'] = clickedYear + "-" + clickedMonth + "-" + lastDay;
		}

		t007_reportlogobj['moduleName'] = "Dashboardmodule";
		t007_reportlogobj['login_id'] = "123";
		t007_reportlogobj['t001ClientProfile'] = this.clientProfile;

		t007_reportlogobj['reportType'] = designFileName;
		t007_reportlogobj['reportName'] = designFileName;
		t007_reportlogobj['designFileName'] = designFileName;
		t007_reportlogobj['status'] = 'IN QUEUE';
		t007_reportlogobj['reportFormat'] = "CSV";
		t007_reportlogobj['crmaccountNumber'] = "NA";
		t007_reportlogobj['accountNumber'] = "NA";
		t007_reportlogobj['chargeDesc'] = "";

		this.httpClientService.runReport(t007_reportlogobj).subscribe(
			result => {
				this.saveOrUpdateReportLogResult(result);
			}, error => {
			});
	}

	saveOrUpdateReportLogResult(result: any) {
		this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
		this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
		this.commonService._setInterval(this.reportsFormGroup.value);
		this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
	}


	async clickTopChart(event: any) {
		var urlParam: any = {};

		var monthVal = await this.month;
		var clickedYear = await this.year;
		var date = new Date();
		var currentYear = new Date().getFullYear();
		if (monthVal == null) {
			var month = 0;
		} else {
			month = monthVal;
		}
		if (month == 0) {
			urlParam['fromdate'] = clickedYear + "-01" + "-01";
			if (clickedYear == currentYear)
				urlParam['todate'] = this.datePipe.transform(this.dataasof, "yyyy-MM-dd");
			else
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
		urlParam['year'] = await this.year;
		urlParam['chargemonth'] = month;
		urlParam['clientId'] = this.clientId;
		urlParam['clientName'] = this.clientName;
		urlParam['service'] = this.groupby;
		var fields_string: any = "";
		for (const [key, value] of Object.entries(urlParam)) {
			fields_string += key + '=' + value + '&';
		}
		this.httpClientService.reportServlet(fields_string);
	}
	async first_id_clickHandler(event: any) {
		if (this.chargedesctype == null)
			this.chargedesctype = "SHP_FRT+ACC"
		if (this.chargedesctype == "SHP_FRT+ACC") {
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
	async btnBack_clickHandler(event: any) {
		if (this.chargedesctype == null)
			this.chargedesctype = "SHP_FRT+ACC"
		if (this.chargedesctype == "SHP_FRT+ACC") {
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
			this.chargedesctype = "SHP_FRT+ACC"
		if (this.chargedesctype == "SHP_FRT+ACC") {
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
}
