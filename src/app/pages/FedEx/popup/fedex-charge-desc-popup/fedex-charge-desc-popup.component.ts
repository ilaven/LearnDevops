import { DatePipe } from "@angular/common";
import { Component, OnInit, NgZone, Optional, Inject, signal, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, UntypedFormBuilder } from "@angular/forms";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from "src/app/core/services/common.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
@Component({
	selector: 'app-fedex-charge-desc-popup',
	templateUrl: './fedex-charge-desc-popup.component.html',
	styleUrls: ['./fedex-charge-desc-popup.component.css'],
	standalone: false
})
export class FedexChargeDescPopupComponent implements OnInit, OnDestroy {
	private volume_weightChart!: am4charts.XYChart;
	private average_costChart!: am4charts.XYChart;
	private weight_disPopupChart!: am4charts.XYChart;
	private spendByMonthChart!: am4charts.XYChart;
	private acc_noChart!: am4charts.XYChart;

	dashBoardSHP: FormGroup;
	fromPage
	invoiceMonth
	invoiceyear
	clientId: any;
	clientName: any;
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
	commonAC = [];
	t004tempObj = {};
	tempt004AC = [];
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
	volume_bychargedesfrtserviceAC = [];
	t000topStateObj: any;
	ten_StateAC_Reveiver = [];
	ten_StateACfrt_Reveiver = [];
	commonACSHP_FRT = [];
	commonACSHP_FRT_ACC = [];
	serviceAccAC = [];
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
	chargeGroup;
	chargeType;
	monthFlag;
	accountNumber;
	userProfifleFedex;
	themeoption;
	panelClass;
	fedexFormGroupTop: FormGroup;
	totalTransSummAC = signal<any>([]);
	totalTransSummObj: any; tempnetchargeFRTWithSURYTD: any;
	tempyearNetchargeFRTFedex: any;
	tempyearcostperpackageFRTWithSURYTD: any;
	tempyearcostperpackageFRTFedex: any;
	tempyearcostperlbFRTWithSURYTD: any;
	tempyearcostperlbFRTYTD: any;
	tempyearbilledweightFRTWithSURYTD: any;
	tempyearenteredWeightFRT: any;
	tempyearenteredweightFRTWithSURYTD: any;//9069
	tempyearbilledWeightFRT: any;//9069
	tempyearweightdiffFRTWithSURYTD: any;
	tempyearweightdiffYTDFedex: any;
	fetchdashBoardFedexData: any;
	apiControllerFormGroup: FormGroup;
	reportsFormGroup = new FormGroup({
		reportLogId: new FormControl(''),
		t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
	});

	barColors = [
		'#94CDE7', '#759CDD', '#767EE0', '#8C77E0',
		'#CC77DF', '#DF76D3', '#DF75B3', '#DF7694',
		'#E07877', '#E09776', '#F4C5B0', '#F3B777',
		'#F5C7A0', '#F6D3B8'
	];

	constructor(public dialogRef: MatDialogRef<FedexChargeDescPopupComponent>, private mlForm: UntypedFormBuilder, private dialog: MatDialog,
		private datePipe: DatePipe, private commonService: CommonService, private httpfedexService: HttpfedexService, private zone: NgZone,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
		this.dashBoardSHP = new FormGroup({
			chargetypevalue: new FormControl('FRTWithAcc')
		});
		this.fromPage = data.popupValue;
		this.panelClass = data.panelClass;
		if (this.fromPage.month == null) { this.invoiceMonth = '0'; } //9126
		else { this.invoiceMonth = this.fromPage.month; }
		this.invoiceyear = this.fromPage.year;
		this.accountNumber = this.fromPage.accountNumber;
		this.chargeGroup = this.fromPage.chargeGroup;
		this.monthFlag = this.fromPage.monthFlag;
		this.chargeType = this.fromPage.chargeType;
		this.chargeDescription = this.fromPage.chargeDescription;
		this.userProfifleFedex = this.fromPage.t002ClientProfile;
		this.themeoption = this.fromPage.themeoption;
		if (this.accountNumber == "ALL") {
			var accountNumber = null;
		} else {
			var accountNumber = this.accountNumber;
		}
		this.chargetypevalue.set(this.fromPage.chargeType);
		this.chargedesctype = this.fromPage.chargeType;
		this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
		this.moreviewChargeDescFormGroup = new FormGroup({
			accountNumber: new FormControl(accountNumber),
			month: new FormControl(this.invoiceMonth),
			chargeGroup: new FormControl(this.chargeGroup),
			monthFlag: new FormControl(this.monthFlag),
			year: new FormControl(this.invoiceyear),
			chargeDescription: new FormControl(this.chargeDescription),
			chargeType: new FormControl(this.chargeType),
			t002ClientProfile: new FormControl({
				clientId: new FormControl(''),
				clientName: new FormControl(''),
				userName: new FormControl(''),
				password: new FormControl(''),
				siteUserName: new FormControl(''),
				sitePassword: new FormControl(''),
				address: new FormControl(''),
				contactNo: new FormControl(''),
				comments: new FormControl(''),
				endDate: new FormControl(''),
				startDate: new FormControl(''),
				status: new FormControl(''),
				auditStatus: new FormControl(''),
				contractStatus: new FormControl(''),
				email: new FormControl(''),
				userLogo: new FormControl(''),
				customerType: new FormControl(''),
				dataSource: new FormControl(''),
				dataLoadedBy: new FormControl(''),
				filestartdate: new FormControl(''),
				fileenddate: new FormControl(''),
				dateasof: new FormControl(''),
				currentDate: new FormControl(''),
				currentYear: new FormControl(''),
				currentMonth: new FormControl(''),
				startYear: new FormControl(''),
				createdBy: new FormControl(''),
				createdTs: new FormControl(''),
				updatedTs: new FormControl(''),
				adminFlag: new FormControl(''),
				filestartdate1: new FormControl(''),
				fileenddate1: new FormControl(''),
				trackingcount: new FormControl(''),
				logostatus: new FormControl(''),
				noofdaystoactive: new FormControl(''),
				noofdaysinactive: new FormControl(''),
				ipaddress: new FormControl(''),
				loginFlag: new FormControl(''),
				contractSavingFlag: new FormControl(''),
				clientProfileName: new FormControl(''),
				carrierType: new FormControl(''),
				t002AccountDet: [''],
				customers: new FormControl('')
			})
		})

		this.fedexFormGroupTop = new FormGroup({
			accountNumber: new FormControl(accountNumber),
			month: new FormControl(this.invoiceMonth),
			chargeGroup: new FormControl(this.chargeGroup),
			monthFlag: new FormControl(this.monthFlag),
			year: new FormControl(this.invoiceyear),
			chargeDescription: new FormControl(this.chargeDescription),
			chargeType: new FormControl(this.chargeType),
			t002ClientProfile: new FormControl({
				clientId: new FormControl(''),
				clientName: new FormControl(''),
				userName: new FormControl(''),
				password: new FormControl(''),
				siteUserName: new FormControl(''),
				sitePassword: new FormControl(''),
				address: new FormControl(''),
				contactNo: new FormControl(''),
				comments: new FormControl(''),
				endDate: new FormControl(''),
				startDate: new FormControl(''),
				status: new FormControl(''),
				auditStatus: new FormControl(''),
				contractStatus: new FormControl(''),
				email: new FormControl(''),
				userLogo: new FormControl(''),
				customerType: new FormControl(''),
				dataSource: new FormControl(''),
				dataLoadedBy: new FormControl(''),
				filestartdate: new FormControl(''),
				fileenddate: new FormControl(''),
				dateasof: new FormControl(''),
				currentDate: new FormControl(''),
				currentYear: new FormControl(''),
				currentMonth: new FormControl(''),
				startYear: new FormControl(''),
				createdBy: new FormControl(''),
				createdTs: new FormControl(''),
				updatedTs: new FormControl(''),
				adminFlag: new FormControl(''),
				filestartdate1: new FormControl(''),
				fileenddate1: new FormControl(''),
				trackingcount: new FormControl(''),
				logostatus: new FormControl(''),
				noofdaystoactive: new FormControl(''),
				noofdaysinactive: new FormControl(''),
				ipaddress: new FormControl(''),
				loginFlag: new FormControl(''),
				contractSavingFlag: new FormControl(''),
				clientProfileName: new FormControl(''),
				carrierType: new FormControl(''),
				t002AccountDet: [''],
				customers: new FormControl('')
			})
		})

		this.apiControllerFormGroup = new FormGroup({
			action: new FormControl('Fetch'),
			key: new FormControl('fn_groupedservices_popup'),
			fedexclientId: new FormControl(this.userProfifleFedex.clientId),
			fedexfromDate: new FormControl(''),
			fedextoDate: new FormControl(''),
			fedextableName: new FormControl(''),
			carrierType: new FormControl('FedEx'),
			chargeType: new FormControl('FRTWithAcc'),
			fedexserviceType: new FormControl(''),
			fedexaccountNumber: new FormControl(accountNumber),
		});
	}

	ngOnInit() {
console.log(this.fromPage);
		this.bindingTitle();
		this.moreviewChargeDescFormGroup.patchValue({
			t002ClientProfile: {
				"clientId": this.userProfifleFedex.clientId,
				"clientName": this.userProfifleFedex.clientName,
				"userName": this.userProfifleFedex.userName,
				"password": this.userProfifleFedex.password,
				"siteUserName": this.userProfifleFedex.siteUserName,
				'sitePassword': this.userProfifleFedex.sitePassword,
				"address": this.userProfifleFedex.address,
				"contactNo": this.userProfifleFedex.contactNo,
				"comments": this.userProfifleFedex.comments,
				"endDate": this.userProfifleFedex.endDate,
				"startDate": this.userProfifleFedex.startDate,
				"status": this.userProfifleFedex.status,
				"auditStatus": this.userProfifleFedex.auditStatus,
				"contractStatus": this.userProfifleFedex.contractStatus,
				"email": this.userProfifleFedex.email,
				"userLogo": this.userProfifleFedex.userLogo,
				"customerType": this.userProfifleFedex.customerType,
				"dataSource": this.userProfifleFedex.dataSource,
				"dataLoadedBy": this.userProfifleFedex.dataLoadedBy,
				"filestartdate": this.userProfifleFedex.filestartdate,
				"fileenddate": this.userProfifleFedex.fileenddate,
				"dateasof": this.userProfifleFedex.dateasof,
				"currentDate": this.userProfifleFedex.currentDate,
				"currentYear": this.userProfifleFedex.currentYear,
				"currentMonth": this.userProfifleFedex.currentMonth,
				"startYear": this.userProfifleFedex.startYear,
				"createdBy": this.userProfifleFedex.createdBy,
				"createdTs": this.userProfifleFedex.createdTs,
				"updatedTs": this.userProfifleFedex.updatedTs,
				"adminFlag": this.userProfifleFedex.adminFlag,
				"filestartdate1": this.userProfifleFedex.filestartdate1,
				"fileenddate1": this.userProfifleFedex.fileenddate1,
				"trackingcount": this.userProfifleFedex.trackingcount,
				"logostatus": this.userProfifleFedex.logostatus,
				"noofdaystoactive": this.userProfifleFedex.noofdaystoactive,
				"noofdaysinactive": this.userProfifleFedex.noofdaysinactive,
				"ipaddress": this.userProfifleFedex.ipaddress,
				"loginFlag": this.userProfifleFedex.loginFlag,
				"contractSavingFlag": this.userProfifleFedex.contractSavingFlag,
				"clientProfileName": this.userProfifleFedex.clientProfileName,
				"carrierType": this.userProfifleFedex.carrierType,
				"t002AccountDet": this.userProfifleFedex.t002AccountDet,
				"customers": this.userProfifleFedex.customers
			}
		});

		this.fedexFormGroupTop.patchValue({
			t002ClientProfile: {
				"clientId": this.userProfifleFedex.clientId,
				"clientName": this.userProfifleFedex.clientName,
				"userName": this.userProfifleFedex.userName,
				"password": this.userProfifleFedex.password,
				"siteUserName": this.userProfifleFedex.siteUserName,
				'sitePassword': this.userProfifleFedex.sitePassword,
				"address": this.userProfifleFedex.address,
				"contactNo": this.userProfifleFedex.contactNo,
				"comments": this.userProfifleFedex.comments,
				"endDate": this.userProfifleFedex.endDate,
				"startDate": this.userProfifleFedex.startDate,
				"status": this.userProfifleFedex.status,
				"auditStatus": this.userProfifleFedex.auditStatus,
				"contractStatus": this.userProfifleFedex.contractStatus,
				"email": this.userProfifleFedex.email,
				"userLogo": this.userProfifleFedex.userLogo,
				"customerType": this.userProfifleFedex.customerType,
				"dataSource": this.userProfifleFedex.dataSource,
				"dataLoadedBy": this.userProfifleFedex.dataLoadedBy,
				"filestartdate": this.userProfifleFedex.filestartdate,
				"fileenddate": this.userProfifleFedex.fileenddate,
				"dateasof": this.userProfifleFedex.dateasof,
				"currentDate": this.userProfifleFedex.currentDate,
				"currentYear": this.userProfifleFedex.currentYear,
				"currentMonth": this.userProfifleFedex.currentMonth,
				"startYear": this.userProfifleFedex.startYear,
				"createdBy": this.userProfifleFedex.createdBy,
				"createdTs": this.userProfifleFedex.createdTs,
				"updatedTs": this.userProfifleFedex.updatedTs,
				"adminFlag": this.userProfifleFedex.adminFlag,
				"filestartdate1": this.userProfifleFedex.filestartdate1,
				"fileenddate1": this.userProfifleFedex.fileenddate1,
				"trackingcount": this.userProfifleFedex.trackingcount,
				"logostatus": this.userProfifleFedex.logostatus,
				"noofdaystoactive": this.userProfifleFedex.noofdaystoactive,
				"noofdaysinactive": this.userProfifleFedex.noofdaysinactive,
				"ipaddress": this.userProfifleFedex.ipaddress,
				"loginFlag": this.userProfifleFedex.loginFlag,
				"contractSavingFlag": this.userProfifleFedex.contractSavingFlag,
				"clientProfileName": this.userProfifleFedex.clientProfileName,
				"carrierType": this.userProfifleFedex.carrierType,
				"t002AccountDet": this.userProfifleFedex.t002AccountDet,
				"customers": this.userProfifleFedex.customers
			}
		});
		this.fetchdashBoardGrpSerPopup();
		this.fetchdashBoardFedex();

	}
	closeDialog() {
		this.dialogRef.close(true);
	}
	async fetchdashBoardFedex() {
		var ServiceType = this.fedexFormGroupTop.get('chargeDescription')?.value;
		var tableNameFedex = "T001_" + this.userProfifleFedex.clientName.replace(/\s/g, "_") + "_invoice_raw";
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

		this.apiControllerFormGroup.get('fedextableName')?.setValue(tableNameFedex);
		this.apiControllerFormGroup.get('fedexserviceType')?.setValue(ServiceType);
		this.apiControllerFormGroup.get('fedexfromDate')?.setValue(fromdate);
		this.apiControllerFormGroup.get('fedextoDate')?.setValue(todate);

		await this.httpfedexService.compareUpsData(this.apiControllerFormGroup.value).subscribe(
			(result: any) => {
				this.fetchData(result);
			},
			error => {
			})
	}
	async fetchData(result: any) {
		this.totalTransSummAC.set([]);
		if (result.length > 0) {
			var t004Obj = result[0];
			var t004DashBoardCYObj: any = [];
			t004DashBoardCYObj["netTrans_Value"] = await t004Obj.fedexcomparisonResults[0]['Net Charge'];
			t004DashBoardCYObj["netTransFRT_Value"] = await t004Obj.fedexcomparisonResults[0]['Net Charge FRT'];
			t004DashBoardCYObj["costPackage_Value"] = await t004Obj.fedexcomparisonResults[0]['Cost Per Package'];
			t004DashBoardCYObj["costPackage_FRT_Value"] = await t004Obj.fedexcomparisonResults[0]['Cost Per Package FRT'];
			t004DashBoardCYObj["costLB_Value"] = await t004Obj.fedexcomparisonResults[0]['Cost Per lbs'];
			t004DashBoardCYObj["costLB_FRT_Value"] = await t004Obj.fedexcomparisonResults[0]['Cost Per kgs'];
			t004DashBoardCYObj["enterWT_Value"] = await t004Obj.fedexcomparisonResults[0]['Entered Weight lbs'];
			t004DashBoardCYObj["billWT_Value"] = await t004Obj.fedexcomparisonResults[0]['Billed Weight lbs'];
			t004DashBoardCYObj["enterWT_FRT_Value"] = await t004Obj.fedexcomparisonResults[0]['Entered Weight kgs'];
			t004DashBoardCYObj["billWT_FRT_Value"] = await t004Obj.fedexcomparisonResults[0]['Billed Weight kgs'];
			t004DashBoardCYObj["weightDiff_Value"] = await t004Obj.fedexcomparisonResults[0]['Weight Difference lbs'];
			t004DashBoardCYObj["weightDiff_FRT_Value"] = await t004Obj.fedexcomparisonResults[0]['Weight Difference kgs'];
			t004DashBoardCYObj["packageCount"] = await t004Obj.fedexcomparisonResults[0]['Total Package Count'];
			t004DashBoardCYObj["averageWeightLBS_Value"] = await Number(t004Obj.fedexcomparisonResults[0]['Billed Weight lbs']) / Number(t004Obj.fedexcomparisonResults[0]['Total Package Count']);
			t004DashBoardCYObj["averageWeightKGS_Value"] = await Number(t004Obj.fedexcomparisonResults[0]['Billed Weight kgs']) / Number(t004Obj.fedexcomparisonResults[0]['Total Package Count']);
			this.totalTransSummAC.set(t004DashBoardCYObj);
			console.log(this.totalTransSummAC());
		}
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
		this.chargeType_title = this.moreviewChargeDescFormGroup.get('chargeType')?.value;

		this.services_title = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;

	}
	async fetchdashBoardGrpSerPopup() {
		this.httpfedexService.fetchdashBoardGrpSerPopup(this.moreviewChargeDescFormGroup.value)?.subscribe(
			(result: any) => {
				this.resultObj = result;
				this.fetchSelectedGrpSerRslt(result);
			},
			(error: any) => {
			})
	}
	event_type: any;
	boolean: any;
	async fetchSelectedGrpSerRslt(event: any) {
		var GrpSerRsltAC = event;
		this.t201AccresultAC = event;
		var year = this.moreviewChargeDescFormGroup.get('year')?.value;
		var month = this.moreviewChargeDescFormGroup.get('month')?.value;
		var accountNumber = this.moreviewChargeDescFormGroup.get('accountNumber')?.value;
		var domain_Name: any = "T202_Dashboard";
		var t202Obj = GrpSerRsltAC[0];
		if (GrpSerRsltAC == null || GrpSerRsltAC.length == 0) {
			return;
		}
		this.previous_id_visible = false;
		this.first_id_visible = false;
		this.next_id_visible = false;
		this.fromAccCount = 0;
		this.toAccCount = 0;
		if (GrpSerRsltAC.length < 5 || GrpSerRsltAC.length == 5) {
			this.fromAccCount = 0;
			this.toAccCount = GrpSerRsltAC.length;
		}
		else {
			this.fromAccCount = 0;
			this.toAccCount = 5;
			this.next_id_visible = true;
			this.previous_id_visible = false;
			this.first_id_visible = false;
		}

		if (t202Obj.year == year && t202Obj.accountNumber != null && t202Obj.month == month) {
			if (accountNumber == null) {
				var event_type: any = "month";
				this.event_type = "month";
				this.boolean = null;
				var boolean = null;
			}
			else {
				boolean = 0;
				var event_type: any = null;
				this.event_type = null;
				this.boolean = 0;
			}
			this.bar_chart0(GrpSerRsltAC, event_type, boolean);
			this.bar_chart1(GrpSerRsltAC, event_type, boolean);
			this.bar_chart2(GrpSerRsltAC, event_type, boolean);
			this.Spend_Month(GrpSerRsltAC, event_type, boolean);
			this.Acc_No(GrpSerRsltAC, event_type, boolean);
		}
		else if (t202Obj.year == year && t202Obj.accountNumber != null) // if search by year and account number
		{
			if (accountNumber == null)//if search only by year
			{
				var event_type: any = "year";
				var boolean = null;
				this.event_type = "year";
				this.boolean = null;
			}
			else // if search by year and account number
			{
				boolean = 1;
				var event_type: any = null;
				this.event_type = null;
				this.boolean = 1;
			}
			this.bar_chart0(GrpSerRsltAC, event_type, boolean);
			this.bar_chart1(GrpSerRsltAC, event_type, boolean);
			this.bar_chart2(GrpSerRsltAC, event_type, boolean);
			this.Spend_Month(GrpSerRsltAC, event_type, boolean);
			this.Acc_No(GrpSerRsltAC, event_type, boolean);
		}


	}

	async bar_chart0(tempAC: any, event_type: any, boolean: any) { this.createSeriesFromAC_bar(tempAC, event_type, boolean, ""); }
	async bar_chart1(tempAC: any, event_type: any, boolean: any) { await this.createSeriesFromAC1(tempAC, event_type, boolean); }
	async bar_chart2(tempAC: any, event_type: any, boolean: any) {
		await this.createSeriesFromAC2(tempAC, event_type, boolean);
	}
	async Spend_Month(tempAC: any, event_type: any, boolean: any) { await this.createSeriesFromAC10(tempAC, event_type, boolean) }
	async Acc_No(tempAC: any, event_type: any, boolean: any) {
		this.spendAccNumberChart(tempAC, event_type, boolean);

	}
	async createSeriesFromAC21(collection: any, event_type: any, boolean: any) {
		var chartData: any = [];
		if (collection.length > 0) {
			for (var loop = 0; loop < collection.length; loop++) {

				var tempObj = collection[loop];
				var nameFiled: any = tempObj.accountNumber;
				if (event_type == "year")
					var yField: any = tempObj.grandAccountLevelTotalForServiceLevel;

				else if (event_type == "month")
					var yField: any = tempObj.grandMonthAndAccountLevelTotalForServiceLevel;

				else if (boolean == 1)
					var yField: any = tempObj.grandAccountLevelTotalForServiceLevel;

				else if (boolean == 0)
					var yField: any = tempObj.grandMonthAndAccountLevelTotalForServiceLevel;


				chartData.push({ "name": nameFiled, "points": yField })
			}
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
			series.columns.template.fillOpacity = .8;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;

			columnTemplate.column.cornerRadiusTopLeft = 8;
			columnTemplate.column.cornerRadiusTopRight = 8;

			if (this.themeoption == "dark") {
				categoryAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.title.fill = am4core.color("#fff");
				valueAxis.renderer.labels.template.fill = am4core.color("#fff");
				valueAxis.renderer.grid.template.strokeOpacity = 1;
				valueAxis.renderer.grid.template.stroke = am4core.color("#3d4552");
				valueAxis.renderer.grid.template.strokeWidth = 2;
			}
			this.acc_noChart = chart;
			hideIndicator();
		});
	}
	collectionArr: any;
	event_typeVal: any;
	booleanVal: any;
	async createSeriesFromAC_bar(collection: any, event_type: any, boolean: any, weightVal: any) {
		var description = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
		if (weightVal == "") {
			this.collectionArr = collection; this.event_typeVal = event_type; this.booleanVal = boolean;
			var tempObj = collection[0];
			if (tempObj != null) {
				if (description == "Ground Economy") {
					if (event_type == "month") {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.maverageBilledWeight0to16ozforMonth ? tempObj.maverageBilledWeight0to16ozforMonth : '0' },
						{ "weight": "1", "value": tempObj.maverageBilledWeight1forMonth ? tempObj.maverageBilledWeight1forMonth : '0' },
						{ "weight": "2", "value": tempObj.maverageBilledWeight2forMonth ? tempObj.maverageBilledWeight2forMonth : '0' },
						{ "weight": "3", "value": tempObj.maverageBilledWeight3forMonth ? tempObj.maverageBilledWeight3forMonth : '0' },
						{ "weight": "4", "value": tempObj.maverageBilledWeight4forMonth ? tempObj.maverageBilledWeight4forMonth : '0' },
						{ "weight": "5", "value": tempObj.maverageBilledWeight5forMonth ? tempObj.maverageBilledWeight5forMonth : '0' },
						{ "weight": "6", "value": tempObj.maverageBilledWeight6forMonth ? tempObj.maverageBilledWeight6forMonth : '0' },
						{ "weight": "7", "value": tempObj.maverageBilledWeight7forMonth ? tempObj.maverageBilledWeight7forMonth : '0' },
						{ "weight": "8", "value": tempObj.maverageBilledWeight8forMonth ? tempObj.maverageBilledWeight8forMonth : '0' },
						{ "weight": "9", "value": tempObj.maverageBilledWeight9forMonth ? tempObj.maverageBilledWeight9forMonth : '0' },
						{ "weight": "10-20", "value": tempObj.maverageBilledWeight10to20sforMonth ? tempObj.maverageBilledWeight10to20sforMonth : '0' },
						{ "weight": "21+", "value": tempObj.maverageBilledWeightAbove20forMonth ? tempObj.maverageBilledWeightAbove20forMonth : '0' }];
					}
					else if (event_type == "year") {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearTotalOfAverageBilledWeight0to16ozforMonth11 ? tempObj.yearTotalOfAverageBilledWeight0to16ozforMonth11 : '0' },
						{ "weight": "1", "value": tempObj.yearTotalOfAverageBilledWeight1forMonth1 ? tempObj.yearTotalOfAverageBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearTotalOfAverageBilledWeight2forMonth2 ? tempObj.yearTotalOfAverageBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearTotalOfAverageBilledWeight3forMonth3 ? tempObj.yearTotalOfAverageBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearTotalOfAverageBilledWeight4forMonth4 ? tempObj.yearTotalOfAverageBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearTotalOfAverageBilledWeight5forMonth5 ? tempObj.yearTotalOfAverageBilledWeight5forMonth5 : '0' },
						{ "weight": "6", "value": tempObj.yearTotalOfAverageBilledWeight6forMonth6 ? tempObj.yearTotalOfAverageBilledWeight6forMonth6 : '0' },
						{ "weight": "7", "value": tempObj.yearTotalOfAverageBilledWeight7forMonth7 ? tempObj.yearTotalOfAverageBilledWeight7forMonth7 : '0' },
						{ "weight": "8", "value": tempObj.yearTotalOfAverageBilledWeight8forMonth8 ? tempObj.yearTotalOfAverageBilledWeight8forMonth8 : '0' },
						{ "weight": "9", "value": tempObj.yearTotalOfAverageBilledWeight9forMonth9 ? tempObj.yearTotalOfAverageBilledWeight9forMonth9 : '0' },
						{ "weight": "10-20", "value": tempObj.yearTotalOfAverageBilledWeight10to20forMonth10 ? tempObj.yearTotalOfAverageBilledWeight10to20forMonth10 : '0' },
						{ "weight": "21+", "value": tempObj.yearTotalOfAverageBilledWeightAbove20forMonth12 ? tempObj.yearTotalOfAverageBilledWeightAbove20forMonth12 : '0' }];
					}
					else if (boolean == 1) {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearAccountOfVolumeBilledWeight0to16ozforMonth11 ? tempObj.yearAccountOfVolumeBilledWeight0to16ozforMonth11 : '0' },
						{ "weight": "1", "value": tempObj.yearAccountOfAverageBilledWeight1forMonth1 ? tempObj.yearAccountOfAverageBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearAccountOfAverageBilledWeight2forMonth2 ? tempObj.yearAccountOfAverageBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearAccountOfAverageBilledWeight3forMonth3 ? tempObj.yearAccountOfAverageBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearAccountOfAverageBilledWeight4forMonth4 ? tempObj.yearAccountOfAverageBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearAccountOfAverageBilledWeight5forMonth5 ? tempObj.yearAccountOfAverageBilledWeight5forMonth5 : '0' },
						{ "weight": "6", "value": tempObj.yearAccountOfAverageBilledWeight6forMonth6 ? tempObj.yearAccountOfAverageBilledWeight6forMonth6 : '0' },
						{ "weight": "7", "value": tempObj.yearAccountOfAverageBilledWeight7forMonth7 ? tempObj.yearAccountOfAverageBilledWeight7forMonth7 : '0' },
						{ "weight": "8", "value": tempObj.yearAccountOfAverageBilledWeight8forMonth8 ? tempObj.yearAccountOfAverageBilledWeight8forMonth8 : '0' },
						{ "weight": "9", "value": tempObj.yearAccountOfAverageBilledWeight9forMonth9 ? tempObj.yearAccountOfAverageBilledWeight9forMonth9 : '0' },
						{ "weight": "10-20", "value": tempObj.yearAccountOfAverageBilledWeight10to20forMonth10 ? tempObj.yearAccountOfAverageBilledWeight10to20forMonth10 : '0' },
						{ "weight": "21+", "value": tempObj.yearAccountOfAverageBilledWeightAbove20forMonth12 ? tempObj.yearAccountOfAverageBilledWeightAbove20forMonth12 : '0' }];

					}
					else if (boolean == 0) {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.accountOfAverageBilledWeight0to16ozforMonth11 ? tempObj.accountOfAverageBilledWeight0to16ozforMonth11 : '0' },
						{ "weight": "1", "value": tempObj.accountOfAverageBilledWeight1forMonth1 ? tempObj.accountOfAverageBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.accountOfAverageBilledWeight2forMonth2 ? tempObj.accountOfAverageBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.accountOfAverageBilledWeight3forMonth3 ? tempObj.accountOfAverageBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.accountOfAverageBilledWeight4forMonth4 ? tempObj.accountOfAverageBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.accountOfAverageBilledWeight5forMonth5 ? tempObj.accountOfAverageBilledWeight5forMonth5 : '0' },
						{ "weight": "6", "value": tempObj.accountOfAverageBilledWeight6forMonth6 ? tempObj.accountOfAverageBilledWeight6forMonth6 : '0' },
						{ "weight": "7", "value": tempObj.accountOfAverageBilledWeight7forMonth7 ? tempObj.accountOfAverageBilledWeight7forMonth7 : '0' },
						{ "weight": "8", "value": tempObj.accountOfAverageBilledWeight8forMonth8 ? tempObj.accountOfAverageBilledWeight8forMonth8 : '0' },
						{ "weight": "9", "value": tempObj.accountOfAverageBilledWeight9forMonth9 ? tempObj.accountOfAverageBilledWeight9forMonth9 : '0' },
						{ "weight": "10-20", "value": tempObj.accountOfAverageBilledWeight10to20forMonth10 ? tempObj.accountOfAverageBilledWeight10to20forMonth10 : '0' },
						{ "weight": "21+", "value": tempObj.accountOfAverageBilledWeightAbove20forMonth12 ? tempObj.accountOfAverageBilledWeightAbove20forMonth12 : '0' }];
					}
				}

				else if ((description == "FedEx Priority Overnight") || (description == "FedEx First Overnight") || (description == "FedEx Standard Overnight") || (description == "FedEx 2Day") || (description == "FedEx 2Day A.M.") || (description == "FedEx Express Saver")) {
					if (event_type == "month") {
						var chartData = [{ "weight": "LTR", "value": tempObj.maverageBilledWeightLTRforMonth ? tempObj.maverageBilledWeightLTRforMonth : '0' },
						{ "weight": "1", "value": tempObj.maverageBilledWeight1forMonth ? tempObj.maverageBilledWeight1forMonth : '0' },
						{ "weight": "2", "value": tempObj.maverageBilledWeight2forMonth ? tempObj.maverageBilledWeight2forMonth : '0' },
						{ "weight": "3", "value": tempObj.maverageBilledWeight3forMonth ? tempObj.maverageBilledWeight3forMonth : '0' },
						{ "weight": "4", "value": tempObj.maverageBilledWeight4forMonth ? tempObj.maverageBilledWeight4forMonth : '0' },
						{ "weight": "5", "value": tempObj.maverageBilledWeight5forMonth ? tempObj.maverageBilledWeight5forMonth : '0' },
						{ "weight": "6-10", "value": tempObj.maverageBilledWeight6to10forMonth ? tempObj.maverageBilledWeight6to10forMonth : '0' },
						{ "weight": "11-20", "value": tempObj.maverageBilledWeight10to20forMonth ? tempObj.maverageBilledWeight10to20forMonth : '0' },
						{ "weight": "21-30", "value": tempObj.maverageBilledWeight20to30forMonth ? tempObj.maverageBilledWeight20to30forMonth : '0' },
						{ "weight": "31-50", "value": tempObj.maverageBilledWeight30to50forMonth ? tempObj.maverageBilledWeight30to50forMonth : '0' },
						{ "weight": "51-70", "value": tempObj.maverageBilledWeight50to70forMonth ? tempObj.maverageBilledWeight50to70forMonth : '0' },
						{ "weight": "71-150", "value": tempObj.maverageBilledWeight70to150forMonth ? tempObj.maverageBilledWeight70to150forMonth : '0' },
						{ "weight": "151+", "value": tempObj.maverageBilledWeightAbove150forMonth ? tempObj.maverageBilledWeightAbove150forMonth : '0' }];
					}
					else if (event_type == "year") {
						var chartData = [{ "weight": "LTR", "value": tempObj.yearTotalOfAverageBilledWeightLTRforMonth1 ? tempObj.yearTotalOfAverageBilledWeightLTRforMonth1 : '0' },
						{ "weight": "1", "value": tempObj.yearTotalOfAverageBilledWeight1forMonth1 ? tempObj.yearTotalOfAverageBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearTotalOfAverageBilledWeight2forMonth2 ? tempObj.yearTotalOfAverageBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearTotalOfAverageBilledWeight3forMonth3 ? tempObj.yearTotalOfAverageBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearTotalOfAverageBilledWeight4forMonth4 ? tempObj.yearTotalOfAverageBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearTotalOfAverageBilledWeight5forMonth5 ? tempObj.yearTotalOfAverageBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.yearTotalOfAverageBilledWeight6to10forMonth6 ? tempObj.yearTotalOfAverageBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.yearTotalOfAverageBilledWeight11to20forMonth7 ? tempObj.yearTotalOfAverageBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.yearTotalOfAverageBilledWeight21to30forMonth8 ? tempObj.yearTotalOfAverageBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.yearTotalOfAverageBilledWeight31to50forMonth9 ? tempObj.yearTotalOfAverageBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.yearTotalOfAverageBilledWeight51to70forMonth10 ? tempObj.yearTotalOfAverageBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.yearTotalOfAverageBilledWeight71to150forMonth11 ? tempObj.yearTotalOfAverageBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.yearTotalOfAverageBilledWeightAbove150forMonth12 ? tempObj.yearTotalOfAverageBilledWeightAbove150forMonth12 : '0' }];
					}
					else if (boolean == 1) {
						var chartData = [{ "weight": "LTR", "value": tempObj.yearAccountOfVolumeBilledWeightLTRforMonth1 ? tempObj.yearAccountOfVolumeBilledWeightLTRforMonth1 : '0' }, { "weight": "1", "value": tempObj.yearAccountOfAverageBilledWeight1forMonth1 ? tempObj.yearAccountOfAverageBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearAccountOfAverageBilledWeight2forMonth2 ? tempObj.yearAccountOfAverageBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearAccountOfAverageBilledWeight3forMonth3 ? tempObj.yearAccountOfAverageBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearAccountOfAverageBilledWeight4forMonth4 ? tempObj.yearAccountOfAverageBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearAccountOfAverageBilledWeight5forMonth5 ? tempObj.yearAccountOfAverageBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.yearAccountOfAverageBilledWeight6to10forMonth6 ? tempObj.yearAccountOfAverageBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.yearAccountOfAverageBilledWeight11to20forMonth7 ? tempObj.yearAccountOfAverageBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.yearAccountOfAverageBilledWeight21to30forMonth8 ? tempObj.yearAccountOfAverageBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.yearAccountOfAverageBilledWeight31to50forMonth9 ? tempObj.yearAccountOfAverageBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.yearAccountOfAverageBilledWeight51to70forMonth10 ? tempObj.yearAccountOfAverageBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.yearAccountOfAverageBilledWeight71to150forMonth11 ? tempObj.yearAccountOfAverageBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.yearAccountOfAverageBilledWeightAbove150forMonth12 ? tempObj.yearAccountOfAverageBilledWeightAbove150forMonth12 : '0' }];

					}
					else if (boolean == 0) {
						var chartData = [{ "weight": "LTR", "value": tempObj.accountOfAverageBilledWeightLTRforMonth1 ? tempObj.accountOfAverageBilledWeightLTRforMonth1 : '0' },
						{ "weight": "1", "value": tempObj.accountOfAverageBilledWeight1forMonth1 ? tempObj.accountOfAverageBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.accountOfAverageBilledWeight2forMonth2 ? tempObj.accountOfAverageBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.accountOfAverageBilledWeight3forMonth3 ? tempObj.accountOfAverageBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.accountOfAverageBilledWeight4forMonth4 ? tempObj.accountOfAverageBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.accountOfAverageBilledWeight5forMonth5 ? tempObj.accountOfAverageBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.accountOfAverageBilledWeight6to10forMonth6 ? tempObj.accountOfAverageBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.accountOfAverageBilledWeight11to20forMonth7 ? tempObj.accountOfAverageBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.accountOfAverageBilledWeight21to30forMonth8 ? tempObj.accountOfAverageBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.accountOfAverageBilledWeight31to50forMonth9 ? tempObj.accountOfAverageBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.accountOfAverageBilledWeight51to70forMonth10 ? tempObj.accountOfAverageBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.accountOfAverageBilledWeight71to150forMonth11 ? tempObj.accountOfAverageBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.accountOfAverageBilledWeightAbove150forMonth12 ? tempObj.accountOfAverageBilledWeightAbove150forMonth12 : '0' }];
					}
				}
				else {
					if (event_type == "month") {
						var chartData = [
							{ "weight": "1", "value": tempObj.maverageBilledWeight1forMonth ? tempObj.maverageBilledWeight1forMonth : '0' },
							{ "weight": "2", "value": tempObj.maverageBilledWeight2forMonth ? tempObj.maverageBilledWeight2forMonth : '0' },
							{ "weight": "3", "value": tempObj.maverageBilledWeight3forMonth ? tempObj.maverageBilledWeight3forMonth : '0' },
							{ "weight": "4", "value": tempObj.maverageBilledWeight4forMonth ? tempObj.maverageBilledWeight4forMonth : '0' },
							{ "weight": "5", "value": tempObj.maverageBilledWeight5forMonth ? tempObj.maverageBilledWeight5forMonth : '0' },
							{ "weight": "6-10", "value": tempObj.maverageBilledWeight6to10forMonth ? tempObj.maverageBilledWeight6to10forMonth : '0' },
							{ "weight": "11-20", "value": tempObj.maverageBilledWeight10to20forMonth ? tempObj.maverageBilledWeight10to20forMonth : '0' },
							{ "weight": "21-30", "value": tempObj.maverageBilledWeight20to30forMonth ? tempObj.maverageBilledWeight20to30forMonth : '0' },
							{ "weight": "31-50", "value": tempObj.maverageBilledWeight30to50forMonth ? tempObj.maverageBilledWeight30to50forMonth : '0' },
							{ "weight": "51-70", "value": tempObj.maverageBilledWeight50to70forMonth ? tempObj.maverageBilledWeight50to70forMonth : '0' },
							{ "weight": "71-150", "value": tempObj.maverageBilledWeight70to150forMonth ? tempObj.maverageBilledWeight70to150forMonth : '0' },
							{ "weight": "151+", "value": tempObj.maverageBilledWeightAbove150forMonth ? tempObj.maverageBilledWeightAbove150forMonth : '0' }];
					}
					else if (event_type == "year") {
						var chartData = [
							{ "weight": "1", "value": tempObj.yearTotalOfAverageBilledWeight1forMonth1 ? tempObj.yearTotalOfAverageBilledWeight1forMonth1 : '0' },
							{ "weight": "2", "value": tempObj.yearTotalOfAverageBilledWeight2forMonth2 ? tempObj.yearTotalOfAverageBilledWeight2forMonth2 : '0' },
							{ "weight": "3", "value": tempObj.yearTotalOfAverageBilledWeight3forMonth3 ? tempObj.yearTotalOfAverageBilledWeight3forMonth3 : '0' },
							{ "weight": "4", "value": tempObj.yearTotalOfAverageBilledWeight4forMonth4 ? tempObj.yearTotalOfAverageBilledWeight4forMonth4 : '0' },
							{ "weight": "5", "value": tempObj.yearTotalOfAverageBilledWeight5forMonth5 ? tempObj.yearTotalOfAverageBilledWeight5forMonth5 : '0' },
							{ "weight": "6-10", "value": tempObj.yearTotalOfAverageBilledWeight6to10forMonth6 ? tempObj.yearTotalOfAverageBilledWeight6to10forMonth6 : '0' },
							{ "weight": "11-20", "value": tempObj.yearTotalOfAverageBilledWeight11to20forMonth7 ? tempObj.yearTotalOfAverageBilledWeight11to20forMonth7 : '0' },
							{ "weight": "21-30", "value": tempObj.yearTotalOfAverageBilledWeight21to30forMonth8 ? tempObj.yearTotalOfAverageBilledWeight21to30forMonth8 : '0' },
							{ "weight": "31-50", "value": tempObj.yearTotalOfAverageBilledWeight31to50forMonth9 ? tempObj.yearTotalOfAverageBilledWeight31to50forMonth9 : '0' },
							{ "weight": "51-70", "value": tempObj.yearTotalOfAverageBilledWeight51to70forMonth10 ? tempObj.yearTotalOfAverageBilledWeight51to70forMonth10 : '0' },
							{ "weight": "71-150", "value": tempObj.yearTotalOfAverageBilledWeight71to150forMonth11 ? tempObj.yearTotalOfAverageBilledWeight71to150forMonth11 : '0' },
							{ "weight": "151+", "value": tempObj.yearTotalOfAverageBilledWeightAbove150forMonth12 ? tempObj.yearTotalOfAverageBilledWeightAbove150forMonth12 : '0' }];

					}
					else if (boolean == 1) {
						var chartData = [
							{ "weight": "1", "value": tempObj.yearAccountOfAverageBilledWeight1forMonth1 ? tempObj.yearAccountOfAverageBilledWeight1forMonth1 : '0' },
							{ "weight": "2", "value": tempObj.yearAccountOfAverageBilledWeight2forMonth2 ? tempObj.yearAccountOfAverageBilledWeight2forMonth2 : '0' },
							{ "weight": "3", "value": tempObj.yearAccountOfAverageBilledWeight3forMonth3 ? tempObj.yearAccountOfAverageBilledWeight3forMonth3 : '0' },
							{ "weight": "4", "value": tempObj.yearAccountOfAverageBilledWeight4forMonth4 ? tempObj.yearAccountOfAverageBilledWeight4forMonth4 : '0' },
							{ "weight": "5", "value": tempObj.yearAccountOfAverageBilledWeight5forMonth5 ? tempObj.yearAccountOfAverageBilledWeight5forMonth5 : '0' },
							{ "weight": "6-10", "value": tempObj.yearAccountOfAverageBilledWeight6to10forMonth6 ? tempObj.yearAccountOfAverageBilledWeight6to10forMonth6 : '0' },
							{ "weight": "11-20", "value": tempObj.yearAccountOfAverageBilledWeight11to20forMonth7 ? tempObj.yearAccountOfAverageBilledWeight11to20forMonth7 : '0' },
							{ "weight": "21-30", "value": tempObj.yearAccountOfAverageBilledWeight21to30forMonth8 ? tempObj.yearAccountOfAverageBilledWeight21to30forMonth8 : '0' },
							{ "weight": "31-50", "value": tempObj.yearAccountOfAverageBilledWeight31to50forMonth9 ? tempObj.yearAccountOfAverageBilledWeight31to50forMonth9 : '0' },
							{ "weight": "51-70", "value": tempObj.yearAccountOfAverageBilledWeight51to70forMonth10 ? tempObj.yearAccountOfAverageBilledWeight51to70forMonth10 : '0' },
							{ "weight": "71-150", "value": tempObj.yearAccountOfAverageBilledWeight71to150forMonth11 ? tempObj.yearAccountOfAverageBilledWeight71to150forMonth11 : '0' },
							{ "weight": "151+", "value": tempObj.yearAccountOfAverageBilledWeightAbove150forMonth12 ? tempObj.yearAccountOfAverageBilledWeightAbove150forMonth12 : '0' }];
					}
					else if (boolean == 0) {
						var chartData = [
							{ "weight": "1", "value": tempObj.accountOfAverageBilledWeight1forMonth1 ? tempObj.accountOfAverageBilledWeight1forMonth1 : '0' },
							{ "weight": "2", "value": tempObj.accountOfAverageBilledWeight2forMonth2 ? tempObj.accountOfAverageBilledWeight2forMonth2 : '0' },
							{ "weight": "3", "value": tempObj.accountOfAverageBilledWeight3forMonth3 ? tempObj.accountOfAverageBilledWeight3forMonth3 : '0' },
							{ "weight": "4", "value": tempObj.accountOfAverageBilledWeight4forMonth4 ? tempObj.accountOfAverageBilledWeight4forMonth4 : '0' },
							{ "weight": "5", "value": tempObj.accountOfAverageBilledWeight5forMonth5 ? tempObj.accountOfAverageBilledWeight5forMonth5 : '0' },
							{ "weight": "6-10", "value": tempObj.accountOfAverageBilledWeight6to10forMonth6 ? tempObj.accountOfAverageBilledWeight6to10forMonth6 : '0' },
							{ "weight": "11-20", "value": tempObj.accountOfAverageBilledWeight11to20forMonth7 ? tempObj.accountOfAverageBilledWeight11to20forMonth7 : '0' },
							{ "weight": "21-30", "value": tempObj.accountOfAverageBilledWeight21to30forMonth8 ? tempObj.accountOfAverageBilledWeight21to30forMonth8 : '0' },
							{ "weight": "31-50", "value": tempObj.accountOfAverageBilledWeight31to50forMonth9 ? tempObj.accountOfAverageBilledWeight31to50forMonth9 : '0' },
							{ "weight": "51-70", "value": tempObj.accountOfAverageBilledWeight51to70forMonth10 ? tempObj.accountOfAverageBilledWeight51to70forMonth10 : '0' },
							{ "weight": "71-150", "value": tempObj.accountOfAverageBilledWeight71to150forMonth11 ? tempObj.accountOfAverageBilledWeight71to150forMonth11 : '0' },
							{ "weight": "151+", "value": tempObj.accountOfAverageBilledWeightAbove150forMonth12 ? tempObj.accountOfAverageBilledWeightAbove150forMonth12 : '0' }];

					}
				}

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
			series.columns.template.fillOpacity = 1;
			series.columns.template.cursorOverStyle = am4core.MouseCursorStyle.pointer;
			series.columns.template.events.on("hit", (ev: any) => {
				const seriesColumn = ev.target.dataItem.categoryX;
				this.createSeriesFromAC_bar(chartData, "", "", seriesColumn);
			});
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
			columnTemplate.column.cornerRadiusTopLeft = 8;
			columnTemplate.column.cornerRadiusTopRight = 8;
			columnTemplate.adapter.add('fill', (_: any, target: any) => {
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
		this.createSeriesFromAC_bar(this.collectionArr, this.event_typeVal, this.booleanVal, "");
	}
	async createSeriesFromAC1(collection: any, event_type: any, boolean: any) {
		var description = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
		if (collection.length > 0) {

			var tempObj = collection[0];

			if (tempObj != null) {
				if (description == "Ground Economy") {
					if (event_type == "month") {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.mbilledWeight0to16ozforMonth ? tempObj.mbilledWeight0to16ozforMonth : '0' },
						{ "weight": "1", "value": tempObj.mbilledWeight1forMonth ? tempObj.mbilledWeight1forMonth : '0' },
						{ "weight": "2", "value": tempObj.mbilledWeight2forMonth ? tempObj.mbilledWeight2forMonth : '0' },
						{ "weight": "3", "value": tempObj.mbilledWeight3forMonth ? tempObj.mbilledWeight3forMonth : '0' },
						{ "weight": "4", "value": tempObj.mbilledWeight4forMonth ? tempObj.mbilledWeight4forMonth : '0' },
						{ "weight": "5", "value": tempObj.mbilledWeight5forMonth ? tempObj.mbilledWeight5forMonth : '0' },
						{ "weight": "6", "value": tempObj.mbilledWeight6forMonth ? tempObj.mbilledWeight6forMonth : '0' },
						{ "weight": "7", "value": tempObj.mbilledWeight7forMonth ? tempObj.mbilledWeight7forMonth : '0' },
						{ "weight": "8", "value": tempObj.mbilledWeight8forMonth ? tempObj.mbilledWeight8forMonth : '0' },
						{ "weight": "9", "value": tempObj.mbilledWeight9forMonth ? tempObj.mbilledWeight9forMonth : '0' },
						{ "weight": "10-20", "value": tempObj.mbilledWeight10to20forMonth ? tempObj.mbilledWeight10to20forMonth : '0' },
						{ "weight": "21+", "value": tempObj.mbilledWeightAbove20forMonth ? tempObj.mbilledWeightAbove20forMonth : '0' }];
					}
					else if (event_type == "year") {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearTotalOfBilledWeight0to16ozforMonth11 ? tempObj.yearTotalOfBilledWeight0to16ozforMonth11 : '0' },
						{ "weight": "1", "value": tempObj.yearTotalOfBilledWeight1forMonth1 ? tempObj.yearTotalOfBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearTotalOfBilledWeight2forMonth2 ? tempObj.yearTotalOfBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearTotalOfBilledWeight3forMonth3 ? tempObj.yearTotalOfBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearTotalOfBilledWeight4forMonth4 ? tempObj.yearTotalOfBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearTotalOfBilledWeight5forMonth5 ? tempObj.yearTotalOfBilledWeight5forMonth5 : '0' },
						{ "weight": "6", "value": tempObj.yearTotalOfBilledWeight6forMonth6 ? tempObj.yearTotalOfBilledWeight6forMonth6 : '0' },
						{ "weight": "7", "value": tempObj.yearTotalOfBilledWeight7forMonth7 ? tempObj.yearTotalOfBilledWeight7forMonth7 : '0' },
						{ "weight": "8", "value": tempObj.yearTotalOfBilledWeight8forMonth8 ? tempObj.yearTotalOfBilledWeight8forMonth8 : '0' },
						{ "weight": "9", "value": tempObj.yearTotalOfBilledWeight9forMonth9 ? tempObj.yearTotalOfBilledWeight9forMonth9 : '0' },
						{ "weight": "10-20", "value": tempObj.yearTotalOfBilledWeight10to20forMonth10 ? tempObj.yearTotalOfBilledWeight10to20forMonth10 : '0' },
						{ "weight": "21+", "value": tempObj.yearTotalOfBilledWeightAbove20forMonth12 ? tempObj.yearTotalOfBilledWeightAbove20forMonth12 : '0' }];
					}
					else if (boolean == 1) {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearAccountTotalOfBilledWeight0to16ozforMonth11 ? tempObj.yearAccountTotalOfBilledWeight0to16ozforMonth11 : '0' },
						{ "weight": "1", "value": tempObj.yearAccountTotalOfBilledWeight1forMonth1 ? tempObj.yearAccountTotalOfBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearAccountTotalOfBilledWeight2forMonth2 ? tempObj.yearAccountTotalOfBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearAccountTotalOfBilledWeight3forMonth3 ? tempObj.yearAccountTotalOfBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearAccountTotalOfBilledWeight4forMonth4 ? tempObj.yearAccountTotalOfBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearAccountTotalOfBilledWeight5forMonth5 ? tempObj.yearAccountTotalOfBilledWeight5forMonth5 : '0' },
						{ "weight": "6", "value": tempObj.yearAccountTotalOfBilledWeight6forMonth6 ? tempObj.yearAccountTotalOfBilledWeight6forMonth6 : '0' },
						{ "weight": "7", "value": tempObj.yearAccountTotalOfBilledWeight7forMonth7 ? tempObj.yearAccountTotalOfBilledWeight7forMonth7 : '0' },
						{ "weight": "8", "value": tempObj.yearAccountTotalOfBilledWeight8forMonth8 ? tempObj.yearAccountTotalOfBilledWeight8forMonth8 : '0' },
						{ "weight": "9", "value": tempObj.yearAccountTotalOfBilledWeight9forMonth9 ? tempObj.yearAccountTotalOfBilledWeight9forMonth9 : '0' },
						{ "weight": "10-20", "value": tempObj.yearAccountTotalOfBilledWeight10to20forMonth10 ? tempObj.yearAccountTotalOfBilledWeight10to20forMonth10 : '0' },
						{ "weight": "21+", "value": tempObj.yearAccountTotalOfBilledWeightAbove20forMonth12 ? tempObj.yearAccountTotalOfBilledWeightAbove20forMonth12 : '0' }];

					}
					else if (boolean == 0) {
						var chartData = [{ "weight": "0-16\nOz", "value": tempObj.accountTotalOfBilledWeight0to16ozforMonth11 ? tempObj.accountTotalOfBilledWeight0to16ozforMonth11 : '0' },
						{ "weight": "1", "value": tempObj.accountTotalOfBilledWeight1forMonth1 ? tempObj.accountTotalOfBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.accountTotalOfBilledWeight2forMonth2 ? tempObj.accountTotalOfBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.accountTotalOfBilledWeight3forMonth3 ? tempObj.accountTotalOfBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.accountTotalOfBilledWeight4forMonth4 ? tempObj.accountTotalOfBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.accountTotalOfBilledWeight5forMonth5 ? tempObj.accountTotalOfBilledWeight5forMonth5 : '0' },
						{ "weight": "6", "value": tempObj.accountTotalOfBilledWeight6forMonth6 ? tempObj.accountTotalOfBilledWeight6forMonth6 : '0' },
						{ "weight": "7", "value": tempObj.accountTotalOfBilledWeight7forMonth7 ? tempObj.accountTotalOfBilledWeight7forMonth7 : '0' },
						{ "weight": "8", "value": tempObj.accountTotalOfBilledWeight8forMonth8 ? tempObj.accountTotalOfBilledWeight8forMonth8 : '0' },
						{ "weight": "9", "value": tempObj.accountTotalOfBilledWeight9forMonth9 ? tempObj.accountTotalOfBilledWeight9forMonth9 : '0' },
						{ "weight": "10-20", "value": tempObj.accountTotalOfBilledWeight10to20forMonth10 ? tempObj.accountTotalOfBilledWeight10to20forMonth10 : '0' },
						{ "weight": "21+", "value": tempObj.accountTotalOfBilledWeightAbove20forMonth12 ? tempObj.accountTotalOfBilledWeightAbove20forMonth12 : '0' }];

					}
				}
				else if ((description == "FedEx Priority Overnight") || (description == "FedEx First Overnight") || (description == "FedEx Standard Overnight") || (description == "FedEx 2Day") || (description == "FedEx 2Day A.M.") || (description == "FedEx Express Saver")) {
					if (event_type == "month") {
						var chartData = [{ "weight": "LTR", "value": tempObj.mbilledWeightLTRforMonth ? tempObj.mbilledWeightLTRforMonth : '0' },
						{ "weight": "1", "value": tempObj.mbilledWeight1forMonth ? tempObj.mbilledWeight1forMonth : '0' },
						{ "weight": "2", "value": tempObj.mbilledWeight2forMonth ? tempObj.mbilledWeight2forMonth : '0' },
						{ "weight": "3", "value": tempObj.mbilledWeight3forMonth ? tempObj.mbilledWeight3forMonth : '0' },
						{ "weight": "4", "value": tempObj.mbilledWeight4forMonth ? tempObj.mbilledWeight4forMonth : '0' },
						{ "weight": "5", "value": tempObj.mbilledWeight5forMonth ? tempObj.mbilledWeight5forMonth : '0' },
						{ "weight": "6-10", "value": tempObj.mbilledWeight6to10forMonth ? tempObj.mbilledWeight6to10forMonth : '0' },
						{ "weight": "11-20", "value": tempObj.mbilledWeight10to20forMonth ? tempObj.mbilledWeight10to20forMonth : '0' },
						{ "weight": "21-30", "value": tempObj.mbilledWeight20to30forMonth ? tempObj.mbilledWeight20to30forMonth : '0' },
						{ "weight": "31-50", "value": tempObj.mbilledWeight30to50forMonth ? tempObj.mbilledWeight30to50forMonth : '0' },
						{ "weight": "51-70", "value": tempObj.mbilledWeight50to70forMonth ? tempObj.mbilledWeight50to70forMonth : '0' },
						{ "weight": "71-150", "value": tempObj.mbilledWeight70to150forMonth ? tempObj.mbilledWeight70to150forMonth : '0' },
						{ "weight": "151+", "value": tempObj.mbilledWeightabove150forMonth ? tempObj.mbilledWeightabove150forMonth : '0' }];
					}
					else if (event_type == "year") {
						var chartData = [{ "weight": "LTR", "value": tempObj.yearTotalOfBilledWeightLTRforMonth1 ? tempObj.yearTotalOfBilledWeightLTRforMonth1 : '0' },
						{ "weight": "1", "value": tempObj.yearTotalOfBilledWeight1forMonth1 ? tempObj.yearTotalOfBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearTotalOfBilledWeight2forMonth2 ? tempObj.yearTotalOfBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearTotalOfBilledWeight3forMonth3 ? tempObj.yearTotalOfBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearTotalOfBilledWeight4forMonth4 ? tempObj.yearTotalOfBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearTotalOfBilledWeight5forMonth5 ? tempObj.yearTotalOfBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.yearTotalOfBilledWeight6to10forMonth6 ? tempObj.yearTotalOfBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.yearTotalOfBilledWeight11to20forMonth7 ? tempObj.yearTotalOfBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.yearTotalOfBilledWeight21to30forMonth8 ? tempObj.yearTotalOfBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.yearTotalOfBilledWeight31to50forMonth9 ? tempObj.yearTotalOfBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.yearTotalOfBilledWeight51to70forMonth10 ? tempObj.yearTotalOfBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.yearTotalOfBilledWeight71to150forMonth11 ? tempObj.yearTotalOfBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.yearTotalOfBilledWeightAbove150forMonth12 ? tempObj.yearTotalOfBilledWeightAbove150forMonth12 : '0' }];
					}
					else if (boolean == 1) {
						var chartData = [{ "weight": "LTR", "value": tempObj.yearAccountTotalOfBilledWeightLTRforMonth1 ? tempObj.yearAccountTotalOfBilledWeightLTRforMonth1 : '0' },
						{ "weight": "1", "value": tempObj.yearAccountTotalOfBilledWeight1forMonth1 ? tempObj.yearAccountTotalOfBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearAccountTotalOfBilledWeight2forMonth2 ? tempObj.yearAccountTotalOfBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearAccountTotalOfBilledWeight3forMonth3 ? tempObj.yearAccountTotalOfBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearAccountTotalOfBilledWeight4forMonth4 ? tempObj.yearAccountTotalOfBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearAccountTotalOfBilledWeight5forMonth5 ? tempObj.yearAccountTotalOfBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.yearAccountTotalOfBilledWeight6to10forMonth6 ? tempObj.yearAccountTotalOfBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.yearAccountTotalOfBilledWeight11to20forMonth7 ? tempObj.yearAccountTotalOfBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.yearAccountTotalOfBilledWeight21to30forMonth8 ? tempObj.yearAccountTotalOfBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.yearAccountTotalOfBilledWeight31to50forMonth9 ? tempObj.yearAccountTotalOfBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.yearAccountTotalOfBilledWeight51to70forMonth10 ? tempObj.yearAccountTotalOfBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.yearAccountTotalOfBilledWeight71to150forMonth11 ? tempObj.yearAccountTotalOfBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.yearAccountTotalOfBilledWeightAbove150forMonth12 ? tempObj.yearAccountTotalOfBilledWeightAbove150forMonth12 : '0' }];


					}
					else if (boolean == 0) {
						var chartData = [{ "weight": "LTR", "value": tempObj.accountTotalOfBilledWeightLTRforMonth1 ? tempObj.accountTotalOfBilledWeightLTRforMonth1 : '0' },
						{ "weight": "1", "value": tempObj.accountTotalOfBilledWeight1forMonth1 ? tempObj.accountTotalOfBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.accountTotalOfBilledWeight2forMonth2 ? tempObj.accountTotalOfBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.accountTotalOfBilledWeight3forMonth3 ? tempObj.accountTotalOfBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.accountTotalOfBilledWeight4forMonth4 ? tempObj.accountTotalOfBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.accountTotalOfBilledWeight5forMonth5 ? tempObj.accountTotalOfBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.accountTotalOfBilledWeight6to10forMonth6 ? tempObj.accountTotalOfBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.accountTotalOfBilledWeight11to20forMonth7 ? tempObj.accountTotalOfBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.accountTotalOfBilledWeight21to30forMonth8 ? tempObj.accountTotalOfBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.accountTotalOfBilledWeight31to50forMonth9 ? tempObj.accountTotalOfBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.accountTotalOfBilledWeight51to70forMonth10 ? tempObj.accountTotalOfBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.accountTotalOfBilledWeight71to150forMonth11 ? tempObj.accountTotalOfBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.accountTotalOfBilledWeightAbove150forMonth12 ? tempObj.accountTotalOfBilledWeightAbove150forMonth12 : '0' }];


					}
				}
				else {
					if (event_type == "month") {
						var chartData = [
							{ "weight": "1", "value": tempObj.mbilledWeight1forMonth ? tempObj.mbilledWeight1forMonth : '0' },
							{ "weight": "2", "value": tempObj.mbilledWeight2forMonth ? tempObj.mbilledWeight2forMonth : '0' },
							{ "weight": "3", "value": tempObj.mbilledWeight3forMonth ? tempObj.mbilledWeight3forMonth : '0' },
							{ "weight": "4", "value": tempObj.mbilledWeight4forMonth ? tempObj.mbilledWeight4forMonth : '0' },
							{ "weight": "5", "value": tempObj.mbilledWeight5forMonth ? tempObj.mbilledWeight5forMonth : '0' },
							{ "weight": "6-10", "value": tempObj.mbilledWeight6to10forMonth ? tempObj.mbilledWeight6to10forMonth : '0' },
							{ "weight": "11-20", "value": tempObj.mbilledWeight10to20forMonth ? tempObj.mbilledWeight10to20forMonth : '0' },
							{ "weight": "21-30", "value": tempObj.mbilledWeight20to30forMonth ? tempObj.mbilledWeight20to30forMonth : '0' },
							{ "weight": "31-50", "value": tempObj.mbilledWeight30to50forMonth ? tempObj.mbilledWeight30to50forMonth : '0' },
							{ "weight": "51-70", "value": tempObj.mbilledWeight50to70forMonth ? tempObj.mbilledWeight50to70forMonth : '0' },
							{ "weight": "71-150", "value": tempObj.mbilledWeight70to150forMonth ? tempObj.mbilledWeight70to150forMonth : '0' },
							{ "weight": "151+", "value": tempObj.mbilledWeightabove150forMonth ? tempObj.mbilledWeightabove150forMonth : '0' }];

					}
					else if (event_type == "year") {
						var chartData = [
							{ "weight": "1", "value": tempObj.yearTotalOfBilledWeight1forMonth1 ? tempObj.yearTotalOfBilledWeight1forMonth1 : '0' },
							{ "weight": "2", "value": tempObj.yearTotalOfBilledWeight2forMonth2 ? tempObj.yearTotalOfBilledWeight2forMonth2 : '0' },
							{ "weight": "3", "value": tempObj.yearTotalOfBilledWeight3forMonth3 ? tempObj.yearTotalOfBilledWeight3forMonth3 : '0' },
							{ "weight": "4", "value": tempObj.yearTotalOfBilledWeight4forMonth4 ? tempObj.yearTotalOfBilledWeight4forMonth4 : '0' },
							{ "weight": "5", "value": tempObj.yearTotalOfBilledWeight5forMonth5 ? tempObj.yearTotalOfBilledWeight5forMonth5 : '0' },
							{ "weight": "6-10", "value": tempObj.yearTotalOfBilledWeight6to10forMonth6 ? tempObj.yearTotalOfBilledWeight6to10forMonth6 : '0' },
							{ "weight": "11-20", "value": tempObj.yearTotalOfBilledWeight11to20forMonth7 ? tempObj.yearTotalOfBilledWeight11to20forMonth7 : '0' },
							{ "weight": "21-30", "value": tempObj.yearTotalOfBilledWeight21to30forMonth8 ? tempObj.yearTotalOfBilledWeight21to30forMonth8 : '0' },
							{ "weight": "31-50", "value": tempObj.yearTotalOfBilledWeight31to50forMonth9 ? tempObj.yearTotalOfBilledWeight31to50forMonth9 : '0' },
							{ "weight": "51-70", "value": tempObj.yearTotalOfBilledWeight51to70forMonth10 ? tempObj.yearTotalOfBilledWeight51to70forMonth10 : '0' },
							{ "weight": "71-150", "value": tempObj.yearTotalOfBilledWeight71to150forMonth11 ? tempObj.yearTotalOfBilledWeight71to150forMonth11 : '0' },
							{ "weight": "151+", "value": tempObj.yearTotalOfBilledWeightAbove150forMonth12 ? tempObj.yearTotalOfBilledWeightAbove150forMonth12 : '0' }];

					}
					else if (boolean == 1) {
						var chartData = [
							{ "weight": "1", "value": tempObj.yearAccountTotalOfBilledWeight1forMonth1 ? tempObj.yearAccountTotalOfBilledWeight1forMonth1 : '0' },
							{ "weight": "2", "value": tempObj.yearAccountTotalOfBilledWeight2forMonth2 ? tempObj.yearAccountTotalOfBilledWeight2forMonth2 : '0' },
							{ "weight": "3", "value": tempObj.yearAccountTotalOfBilledWeight3forMonth3 ? tempObj.yearAccountTotalOfBilledWeight3forMonth3 : '0' },
							{ "weight": "4", "value": tempObj.yearAccountTotalOfBilledWeight4forMonth4 ? tempObj.yearAccountTotalOfBilledWeight4forMonth4 : '0' },
							{ "weight": "5", "value": tempObj.yearAccountTotalOfBilledWeight5forMonth5 ? tempObj.yearAccountTotalOfBilledWeight5forMonth5 : '0' },
							{ "weight": "6-10", "value": tempObj.yearAccountTotalOfBilledWeight6to10forMonth6 ? tempObj.yearAccountTotalOfBilledWeight6to10forMonth6 : '0' },
							{ "weight": "11-20", "value": tempObj.yearAccountTotalOfBilledWeight11to20forMonth7 ? tempObj.yearAccountTotalOfBilledWeight11to20forMonth7 : '0' },
							{ "weight": "21-30", "value": tempObj.yearAccountTotalOfBilledWeight21to30forMonth8 ? tempObj.yearAccountTotalOfBilledWeight21to30forMonth8 : '0' },
							{ "weight": "31-50", "value": tempObj.yearAccountTotalOfBilledWeight31to50forMonth9 ? tempObj.yearAccountTotalOfBilledWeight31to50forMonth9 : '0' },
							{ "weight": "51-70", "value": tempObj.yearAccountTotalOfBilledWeight51to70forMonth10 ? tempObj.yearAccountTotalOfBilledWeight51to70forMonth10 : '0' },
							{ "weight": "71-150", "value": tempObj.yearAccountTotalOfBilledWeight71to150forMonth11 ? tempObj.yearAccountTotalOfBilledWeight71to150forMonth11 : '0' },
							{ "weight": "151+", "value": tempObj.yearAccountTotalOfBilledWeightAbove150forMonth12 ? tempObj.yearAccountTotalOfBilledWeightAbove150forMonth12 : '0' }];

					}
					else if (boolean == 0) {
						var chartData = [
							{ "weight": "1", "value": tempObj.accountTotalOfBilledWeight1forMonth1 ? tempObj.accountTotalOfBilledWeight1forMonth1 : '0' },
							{ "weight": "2", "value": tempObj.accountTotalOfBilledWeight2forMonth2 ? tempObj.accountTotalOfBilledWeight2forMonth2 : '0' },
							{ "weight": "3", "value": tempObj.accountTotalOfBilledWeight3forMonth3 ? tempObj.accountTotalOfBilledWeight3forMonth3 : '0' },
							{ "weight": "4", "value": tempObj.accountTotalOfBilledWeight4forMonth4 ? tempObj.accountTotalOfBilledWeight4forMonth4 : '0' },
							{ "weight": "5", "value": tempObj.accountTotalOfBilledWeight5forMonth5 ? tempObj.accountTotalOfBilledWeight5forMonth5 : '0' },
							{ "weight": "6-10", "value": tempObj.accountTotalOfBilledWeight6to10forMonth6 ? tempObj.accountTotalOfBilledWeight6to10forMonth6 : '0' },
							{ "weight": "11-20", "value": tempObj.accountTotalOfBilledWeight11to20forMonth7 ? tempObj.accountTotalOfBilledWeight11to20forMonth7 : '0' },
							{ "weight": "21-30", "value": tempObj.accountTotalOfBilledWeight21to30forMonth8 ? tempObj.accountTotalOfBilledWeight21to30forMonth8 : '0' },
							{ "weight": "31-50", "value": tempObj.accountTotalOfBilledWeight31to50forMonth9 ? tempObj.accountTotalOfBilledWeight31to50forMonth9 : '0' },
							{ "weight": "51-70", "value": tempObj.accountTotalOfBilledWeight51to70forMonth10 ? tempObj.accountTotalOfBilledWeight51to70forMonth10 : '0' },
							{ "weight": "71-150", "value": tempObj.accountTotalOfBilledWeight71to150forMonth11 ? tempObj.accountTotalOfBilledWeight71to150forMonth11 : '0' },
							{ "weight": "151+", "value": tempObj.accountTotalOfBilledWeightAbove150forMonth12 ? tempObj.accountTotalOfBilledWeightAbove150forMonth12 : '0' }];


					}
				}
			}
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
			series.columns.template.fillOpacity = 1;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.fontSize = 12;
			columnTemplate.stroke = am4core.color("#FFFFFF");

			columnTemplate.column.cornerRadiusTopLeft = 8;
			columnTemplate.column.cornerRadiusTopRight = 8;
			columnTemplate.adapter.add('fill', (_: any, target: any) => {
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
			chart.cursor = new am4charts.XYCursor();
			chart.cursor.lineX.strokeOpacity = 0;
			chart.cursor.lineY.strokeOpacity = 0;
			this.weight_disPopupChart = chart;
			hideIndicator();
		});



	}
	async createSeriesFromAC2(collection: any, event_type: any, boolean: any) {
		var description = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
		if (collection.length > 0) {
			var tempObj = collection[0];
			if (description == "Ground Economy") {
				if (event_type == "month") {
					var chartData = [{ "weight": "0-16\nOz", "value": tempObj.mvolumeBilledWeight0to16ozforMonth ? tempObj.mvolumeBilledWeight0to16ozforMonth : '0' },
					{ "weight": "1", "value": tempObj.mvolumeBilledWeight1forMonth ? tempObj.mvolumeBilledWeight1forMonth : '0' },
					{ "weight": "2", "value": tempObj.mvolumeBilledWeight2forMonth ? tempObj.mvolumeBilledWeight2forMonth : '0' },
					{ "weight": "3", "value": tempObj.mvolumeBilledWeight3forMonth ? tempObj.mvolumeBilledWeight3forMonth : '0' },
					{ "weight": "4", "value": tempObj.mvolumeBilledWeight4forMonth ? tempObj.mvolumeBilledWeight4forMonth : '0' },
					{ "weight": "5", "value": tempObj.mvolumeBilledWeight5forMonth ? tempObj.mvolumeBilledWeight5forMonth : '0' },
					{ "weight": "6", "value": tempObj.mvolumeBilledWeight6forMonth ? tempObj.mvolumeBilledWeight6forMonth : '0' },
					{ "weight": "7", "value": tempObj.mvolumeBilledWeight7forMonth ? tempObj.mvolumeBilledWeight7forMonth : '0' },
					{ "weight": "8", "value": tempObj.mvolumeBilledWeight8forMonth ? tempObj.mvolumeBilledWeight8forMonth : '0' },
					{ "weight": "9", "value": tempObj.mvolumeBilledWeight9forMonth ? tempObj.mvolumeBilledWeight9forMonth : '0' },
					{ "weight": "10-20", "value": tempObj.mvolumeBilledWeight10to20sforMonth ? tempObj.mvolumeBilledWeight10to20sforMonth : '0' },
					{ "weight": "21+", "value": tempObj.mvolumeBilledWeightAbove20forMonth ? tempObj.mvolumeBilledWeightAbove20forMonth : '0' }];
				}

				else if (event_type == "year") {
					var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearTotalOfVolumeBilledWeight0to16ozforMonth11 ? tempObj.yearTotalOfVolumeBilledWeight0to16ozforMonth11 : '0' },
					{ "weight": "1", "value": tempObj.yearTotalOfVolumeBilledWeight1forMonth1 ? tempObj.yearTotalOfVolumeBilledWeight1forMonth1 : '0' },
					{ "weight": "2", "value": tempObj.yearTotalOfVolumeBilledWeight2forMonth2 ? tempObj.yearTotalOfVolumeBilledWeight2forMonth2 : '0' },
					{ "weight": "3", "value": tempObj.yearTotalOfVolumeBilledWeight3forMonth3 ? tempObj.yearTotalOfVolumeBilledWeight3forMonth3 : '0' },
					{ "weight": "4", "value": tempObj.yearTotalOfVolumeBilledWeight4forMonth4 ? tempObj.yearTotalOfVolumeBilledWeight4forMonth4 : '0' },
					{ "weight": "5", "value": tempObj.yearTotalOfVolumeBilledWeight5forMonth5 ? tempObj.yearTotalOfVolumeBilledWeight5forMonth5 : '0' },
					{ "weight": "6", "value": tempObj.yearTotalOfVolumeBilledWeight6forMonth6 ? tempObj.yearTotalOfVolumeBilledWeight6forMonth6 : '0' },
					{ "weight": "7", "value": tempObj.yearTotalOfVolumeBilledWeight7forMonth7 ? tempObj.yearTotalOfVolumeBilledWeight7forMonth7 : '0' },
					{ "weight": "8", "value": tempObj.yearTotalOfVolumeBilledWeight8forMonth8 ? tempObj.yearTotalOfVolumeBilledWeight8forMonth8 : '0' },
					{ "weight": "9", "value": tempObj.yearTotalOfVolumeBilledWeight9forMonth9 ? tempObj.yearTotalOfVolumeBilledWeight9forMonth9 : '0' },
					{ "weight": "10-20", "value": tempObj.yearTotalOfVolumeBilledWeight10to20forMonth10 ? tempObj.yearTotalOfVolumeBilledWeight10to20forMonth10 : '0' },
					{ "weight": "21+", "value": tempObj.yearTotalOfVolumeBilledWeightAbove20forMonth12 ? tempObj.yearTotalOfVolumeBilledWeightAbove20forMonth12 : '0' }];

				}
				else if (boolean == 1) {
					var chartData = [{ "weight": "0-16\nOz", "value": tempObj.yearAccountOfVolumeBilledWeight0to16ozforMonth11 ? tempObj.yearAccountOfVolumeBilledWeight0to16ozforMonth11 : '0' },
					{ "weight": "1", "value": tempObj.yearAccountOfVolumeBilledWeight1forMonth1 ? tempObj.yearAccountOfVolumeBilledWeight1forMonth1 : '0' },
					{ "weight": "2", "value": tempObj.yearAccountOfVolumeBilledWeight2forMonth2 ? tempObj.yearAccountOfVolumeBilledWeight2forMonth2 : '0' },
					{ "weight": "3", "value": tempObj.yearAccountOfVolumeBilledWeight3forMonth3 ? tempObj.yearAccountOfVolumeBilledWeight3forMonth3 : '0' },
					{ "weight": "4", "value": tempObj.yearAccountOfVolumeBilledWeight4forMonth4 ? tempObj.yearAccountOfVolumeBilledWeight4forMonth4 : '0' },
					{ "weight": "5", "value": tempObj.yearAccountOfVolumeBilledWeight5forMonth5 ? tempObj.yearAccountOfVolumeBilledWeight5forMonth5 : '0' },
					{ "weight": "6", "value": tempObj.yearAccountOfVolumeBilledWeight6forMonth6 ? tempObj.yearAccountOfVolumeBilledWeight6forMonth6 : '0' },
					{ "weight": "7", "value": tempObj.yearAccountOfVolumeBilledWeight7forMonth7 ? tempObj.yearAccountOfVolumeBilledWeight7forMonth7 : '0' },
					{ "weight": "8", "value": tempObj.yearAccountOfVolumeBilledWeight8forMonth8 ? tempObj.yearAccountOfVolumeBilledWeight8forMonth8 : '0' },
					{ "weight": "9", "value": tempObj.yearAccountOfVolumeBilledWeight9forMonth9 ? tempObj.yearAccountOfVolumeBilledWeight9forMonth9 : '0' },
					{ "weight": "10-20", "value": tempObj.yearAccountOfVolumeBilledWeight10to20forMonth10 ? tempObj.yearAccountOfVolumeBilledWeight10to20forMonth10 : '0' },
					{ "weight": "21+", "value": tempObj.yearAccountOfVolumeBilledWeightAbove20forMonth12 ? tempObj.yearAccountOfVolumeBilledWeightAbove20forMonth12 : '0' }];

				}
				else if (boolean == 0) {
					var chartData = [{ "weight": "0-16\nOz", "value": tempObj.accountOfVolumeBilledWeight0to16ozforMonth11 ? tempObj.accountOfVolumeBilledWeight0to16ozforMonth11 : '0' },
					{ "weight": "1", "value": tempObj.accountOfVolumeBilledWeight1forMonth1 ? tempObj.accountOfVolumeBilledWeight1forMonth1 : '0' },
					{ "weight": "2", "value": tempObj.accountOfVolumeBilledWeight2forMonth2 ? tempObj.accountOfVolumeBilledWeight2forMonth2 : '0' },
					{ "weight": "3", "value": tempObj.accountOfVolumeBilledWeight3forMonth3 ? tempObj.accountOfVolumeBilledWeight3forMonth3 : '0' },
					{ "weight": "4", "value": tempObj.accountOfVolumeBilledWeight4forMonth4 ? tempObj.accountOfVolumeBilledWeight4forMonth4 : '0' },
					{ "weight": "5", "value": tempObj.accountOfVolumeBilledWeight5forMonth5 ? tempObj.accountOfVolumeBilledWeight5forMonth5 : '0' },
					{ "weight": "6", "value": tempObj.accountOfVolumeBilledWeight6forMonth6 ? tempObj.accountOfVolumeBilledWeight6forMonth6 : '0' },
					{ "weight": "7", "value": tempObj.accountOfVolumeBilledWeight7forMonth7 ? tempObj.accountOfVolumeBilledWeight7forMonth7 : '0' },
					{ "weight": "8", "value": tempObj.accountOfVolumeBilledWeight8forMonth8 ? tempObj.accountOfVolumeBilledWeight8forMonth8 : '0' },
					{ "weight": "9", "value": tempObj.accountOfVolumeBilledWeight9forMonth9 ? tempObj.accountOfVolumeBilledWeight9forMonth9 : '0' },
					{ "weight": "10-20", "value": tempObj.accountOfVolumeBilledWeight10to20forMonth10 ? tempObj.accountOfVolumeBilledWeight10to20forMonth10 : '0' },
					{ "weight": "21+", "value": tempObj.accountOfVolumeBilledWeightAbove20forMonth12 ? tempObj.accountOfVolumeBilledWeightAbove20forMonth12 : '0' }];

				}
			}
			else if ((description == "FedEx Priority Overnight") || (description == "FedEx First Overnight") || (description == "FedEx Standard Overnight") || (description == "FedEx 2Day") || (description == "FedEx 2Day A.M.") || (description == "FedEx Express Saver")) {
				if (event_type == "month") {
					var chartData = [{ "weight": "LTR", "value": tempObj.mvolumeBilledWeightLTRforMonth ? tempObj.mvolumeBilledWeightLTRforMonth : '0' },
					{ "weight": "1", "value": tempObj.mvolumeBilledWeight1forMonth ? tempObj.mvolumeBilledWeight1forMonth : '0' },
					{ "weight": "2", "value": tempObj.mvolumeBilledWeight2forMonth ? tempObj.mvolumeBilledWeight2forMonth : '0' },
					{ "weight": "3", "value": tempObj.mvolumeBilledWeight3forMonth ? tempObj.mvolumeBilledWeight3forMonth : '0' },
					{ "weight": "4", "value": tempObj.mvolumeBilledWeight4forMonth ? tempObj.mvolumeBilledWeight4forMonth : '0' },
					{ "weight": "5", "value": tempObj.mvolumeBilledWeight5forMonth ? tempObj.mvolumeBilledWeight5forMonth : '0' },
					{ "weight": "6-10", "value": tempObj.mvolumeBilledWeight6to10forMonth ? tempObj.mvolumeBilledWeight6to10forMonth : '0' },
					{ "weight": "11-20", "value": tempObj.mvolumeBilledWeight10to20forMonth ? tempObj.mvolumeBilledWeight10to20forMonth : '0' },
					{ "weight": "21-30", "value": tempObj.mvolumeBilledWeight20to30forMonth ? tempObj.mvolumeBilledWeight20to30forMonth : '0' },
					{ "weight": "31-50", "value": tempObj.mvolumeBilledWeight30to50forMonth ? tempObj.mvolumeBilledWeight30to50forMonth : '0' },
					{ "weight": "51-70", "value": tempObj.mvolumeBilledWeight50to70forMonth ? tempObj.mvolumeBilledWeight50to70forMonth : '0' },
					{ "weight": "71-150", "value": tempObj.mvolumeBilledWeight70to150forMonth ? tempObj.mvolumeBilledWeight70to150forMonth : '0' },
					{ "weight": "151+", "value": tempObj.mvolumeBilledWeightAbove150forMonth ? tempObj.mvolumeBilledWeightAbove150forMonth : '0' }];
				}

				else if (event_type == "year") {
					var chartData = [{ "weight": "LTR", "value": tempObj.yearTotalOfVolumeBilledWeightLTRforMonth1 ? tempObj.yearTotalOfVolumeBilledWeightLTRforMonth1 : '0' },
					{ "weight": "1", "value": tempObj.yearTotalOfVolumeBilledWeight1forMonth1 ? tempObj.yearTotalOfVolumeBilledWeight1forMonth1 : '0' },
					{ "weight": "2", "value": tempObj.yearTotalOfVolumeBilledWeight2forMonth2 ? tempObj.yearTotalOfVolumeBilledWeight2forMonth2 : '0' },
					{ "weight": "3", "value": tempObj.yearTotalOfVolumeBilledWeight3forMonth3 ? tempObj.yearTotalOfVolumeBilledWeight3forMonth3 : '0' },
					{ "weight": "4", "value": tempObj.yearTotalOfVolumeBilledWeight4forMonth4 ? tempObj.yearTotalOfVolumeBilledWeight4forMonth4 : '0' },
					{ "weight": "5", "value": tempObj.yearTotalOfVolumeBilledWeight5forMonth5 ? tempObj.yearTotalOfVolumeBilledWeight5forMonth5 : '0' },
					{ "weight": "6-10", "value": tempObj.yearTotalOfVolumeBilledWeight6to10forMonth6 ? tempObj.yearTotalOfVolumeBilledWeight6to10forMonth6 : '0' },
					{ "weight": "11-20", "value": tempObj.yearTotalOfVolumeBilledWeight11to20forMonth7 ? tempObj.yearTotalOfVolumeBilledWeight11to20forMonth7 : '0' },
					{ "weight": "21-30", "value": tempObj.yearTotalOfVolumeBilledWeight21to30forMonth8 ? tempObj.yearTotalOfVolumeBilledWeight21to30forMonth8 : '0' },
					{ "weight": "31-50", "value": tempObj.yearTotalOfVolumeBilledWeight31to50forMonth9 ? tempObj.yearTotalOfVolumeBilledWeight31to50forMonth9 : '0' },
					{ "weight": "51-70", "value": tempObj.yearTotalOfVolumeBilledWeight51to70forMonth10 ? tempObj.yearTotalOfVolumeBilledWeight51to70forMonth10 : '0' },
					{ "weight": "71-150", "value": tempObj.yearTotalOfVolumeBilledWeight71to150forMonth11 ? tempObj.yearTotalOfVolumeBilledWeight71to150forMonth11 : '0' },
					{ "weight": "151+", "value": tempObj.yearTotalOfVolumeBilledWeightAbove150forMonth12 ? tempObj.yearTotalOfVolumeBilledWeightAbove150forMonth12 : '0' }];

				}
				else if (boolean == 1) {
					var chartData = [{ "weight": "LTR", "value": tempObj.yearAccountOfVolumeBilledWeightLTRforMonth1 ? tempObj.yearAccountOfVolumeBilledWeightLTRforMonth1 : '0' },
					{ "weight": "1", "value": tempObj.yearAccountOfVolumeBilledWeight1forMonth1 ? tempObj.yearAccountOfVolumeBilledWeight1forMonth1 : '0' },
					{ "weight": "2", "value": tempObj.yearAccountOfVolumeBilledWeight2forMonth2 ? tempObj.yearAccountOfVolumeBilledWeight2forMonth2 : '0' },
					{ "weight": "3", "value": tempObj.yearAccountOfVolumeBilledWeight3forMonth3 ? tempObj.yearAccountOfVolumeBilledWeight3forMonth3 : '0' },
					{ "weight": "4", "value": tempObj.yearAccountOfVolumeBilledWeight4forMonth4 ? tempObj.yearAccountOfVolumeBilledWeight4forMonth4 : '0' },
					{ "weight": "5", "value": tempObj.yearAccountOfVolumeBilledWeight5forMonth5 ? tempObj.yearAccountOfVolumeBilledWeight5forMonth5 : '0' },
					{ "weight": "6-10", "value": tempObj.yearAccountOfVolumeBilledWeight6to10forMonth6 ? tempObj.yearAccountOfVolumeBilledWeight6to10forMonth6 : '0' },
					{ "weight": "11-20", "value": tempObj.yearAccountOfVolumeBilledWeight11to20forMonth7 ? tempObj.yearAccountOfVolumeBilledWeight11to20forMonth7 : '0' },
					{ "weight": "21-30", "value": tempObj.yearAccountOfVolumeBilledWeight21to30forMonth8 ? tempObj.yearAccountOfVolumeBilledWeight21to30forMonth8 : '0' },
					{ "weight": "31-50", "value": tempObj.yearAccountOfVolumeBilledWeight31to50forMonth9 ? tempObj.yearAccountOfVolumeBilledWeight31to50forMonth9 : '0' },
					{ "weight": "51-70", "value": tempObj.yearAccountOfVolumeBilledWeight51to70forMonth10 ? tempObj.yearAccountOfVolumeBilledWeight51to70forMonth10 : '0' },
					{ "weight": "71-150", "value": tempObj.yearAccountOfVolumeBilledWeight71to150forMonth11 ? tempObj.yearAccountOfVolumeBilledWeight71to150forMonth11 : '0' },
					{ "weight": "151+", "value": tempObj.yearAccountOfVolumeBilledWeightAbove150forMonth12 ? tempObj.yearAccountOfVolumeBilledWeightAbove150forMonth12 : '0' }];

				}
				else if (boolean == 0) {
					var chartData = [{ "weight": "LTR", "value": tempObj.accountOfVolumeBilledWeightLTRforMonth1 ? tempObj.accountOfVolumeBilledWeightLTRforMonth1 : '0' },
					{ "weight": "1", "value": tempObj.accountOfVolumeBilledWeight1forMonth1 ? tempObj.accountOfVolumeBilledWeight1forMonth1 : '0' },
					{ "weight": "2", "value": tempObj.accountOfVolumeBilledWeight2forMonth2 ? tempObj.accountOfVolumeBilledWeight2forMonth2 : '0' },
					{ "weight": "3", "value": tempObj.accountOfVolumeBilledWeight3forMonth3 ? tempObj.accountOfVolumeBilledWeight3forMonth3 : '0' },
					{ "weight": "4", "value": tempObj.accountOfVolumeBilledWeight4forMonth4 ? tempObj.accountOfVolumeBilledWeight4forMonth4 : '0' },
					{ "weight": "5", "value": tempObj.accountOfVolumeBilledWeight5forMonth5 ? tempObj.accountOfVolumeBilledWeight5forMonth5 : '0' },
					{ "weight": "6-10", "value": tempObj.accountOfVolumeBilledWeight6to10forMonth6 ? tempObj.accountOfVolumeBilledWeight6to10forMonth6 : '0' },
					{ "weight": "11-20", "value": tempObj.accountOfVolumeBilledWeight11to20forMonth7 ? tempObj.accountOfVolumeBilledWeight11to20forMonth7 : '0' },
					{ "weight": "21-30", "value": tempObj.accountOfVolumeBilledWeight21to30forMonth8 ? tempObj.accountOfVolumeBilledWeight21to30forMonth8 : '0' },
					{ "weight": "31-50", "value": tempObj.accountOfVolumeBilledWeight31to50forMonth9 ? tempObj.accountOfVolumeBilledWeight31to50forMonth9 : '0' },
					{ "weight": "51-70", "value": tempObj.accountOfVolumeBilledWeight51to70forMonth10 ? tempObj.accountOfVolumeBilledWeight51to70forMonth10 : '0' },
					{ "weight": "71-150", "value": tempObj.accountOfVolumeBilledWeight71to150forMonth11 ? tempObj.accountOfVolumeBilledWeight71to150forMonth11 : '0' },
					{ "weight": "151+", "value": tempObj.accountOfVolumeBilledWeightAbove150forMonth12 ? tempObj.accountOfVolumeBilledWeightAbove150forMonth12 : '0' }];

				}
			}
			else {

				if (event_type == "month") {
					var chartData = [
						{ "weight": "1", "value": tempObj.mvolumeBilledWeight1forMonth ? tempObj.mvolumeBilledWeight1forMonth : '0' },
						{ "weight": "2", "value": tempObj.mvolumeBilledWeight2forMonth ? tempObj.mvolumeBilledWeight2forMonth : '0' },
						{ "weight": "3", "value": tempObj.mvolumeBilledWeight3forMonth ? tempObj.mvolumeBilledWeight3forMonth : '0' },
						{ "weight": "4", "value": tempObj.mvolumeBilledWeight4forMonth ? tempObj.mvolumeBilledWeight4forMonth : '0' },
						{ "weight": "5", "value": tempObj.mvolumeBilledWeight5forMonth ? tempObj.mvolumeBilledWeight5forMonth : '0' },
						{ "weight": "6-10", "value": tempObj.mvolumeBilledWeight6to10forMonth ? tempObj.mvolumeBilledWeight6to10forMonth : '0' },
						{ "weight": "11-20", "value": tempObj.mvolumeBilledWeight10to20forMonth ? tempObj.mvolumeBilledWeight10to20forMonth : '0' },
						{ "weight": "21-30", "value": tempObj.mvolumeBilledWeight20to30forMonth ? tempObj.mvolumeBilledWeight20to30forMonth : '0' },
						{ "weight": "31-50", "value": tempObj.mvolumeBilledWeight30to50forMonth ? tempObj.mvolumeBilledWeight30to50forMonth : '0' },
						{ "weight": "51-70", "value": tempObj.mvolumeBilledWeight50to70forMonth ? tempObj.mvolumeBilledWeight50to70forMonth : '0' },
						{ "weight": "71-150", "value": tempObj.mvolumeBilledWeight70to150forMonth ? tempObj.mvolumeBilledWeight70to150forMonth : '0' },
						{ "weight": "151+", "value": tempObj.mvolumeBilledWeightAbove150forMonth ? tempObj.mvolumeBilledWeightAbove150forMonth : '0' }];

				}

				else if (event_type == "year") {
					var chartData = [
						{ "weight": "1", "value": tempObj.yearTotalOfVolumeBilledWeight1forMonth1 ? tempObj.yearTotalOfVolumeBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearTotalOfVolumeBilledWeight2forMonth2 ? tempObj.yearTotalOfVolumeBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearTotalOfVolumeBilledWeight3forMonth3 ? tempObj.yearTotalOfVolumeBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearTotalOfVolumeBilledWeight4forMonth4 ? tempObj.yearTotalOfVolumeBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearTotalOfVolumeBilledWeight5forMonth5 ? tempObj.yearTotalOfVolumeBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.yearTotalOfVolumeBilledWeight6to10forMonth6 ? tempObj.yearTotalOfVolumeBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.yearTotalOfVolumeBilledWeight11to20forMonth7 ? tempObj.yearTotalOfVolumeBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.yearTotalOfVolumeBilledWeight21to30forMonth8 ? tempObj.yearTotalOfVolumeBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.yearTotalOfVolumeBilledWeight31to50forMonth9 ? tempObj.yearTotalOfVolumeBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.yearTotalOfVolumeBilledWeight51to70forMonth10 ? tempObj.yearTotalOfVolumeBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.yearTotalOfVolumeBilledWeight71to150forMonth11 ? tempObj.yearTotalOfVolumeBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.yearTotalOfVolumeBilledWeightAbove150forMonth12 ? tempObj.yearTotalOfVolumeBilledWeightAbove150forMonth12 : '0' }];

				}
				else if (boolean == 1) {
					var chartData = [
						{ "weight": "1", "value": tempObj.yearAccountOfVolumeBilledWeight1forMonth1 ? tempObj.yearAccountOfVolumeBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.yearAccountOfVolumeBilledWeight2forMonth2 ? tempObj.yearAccountOfVolumeBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.yearAccountOfVolumeBilledWeight3forMonth3 ? tempObj.yearAccountOfVolumeBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.yearAccountOfVolumeBilledWeight4forMonth4 ? tempObj.yearAccountOfVolumeBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.yearAccountOfVolumeBilledWeight5forMonth5 ? tempObj.yearAccountOfVolumeBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.yearAccountOfVolumeBilledWeight6to10forMonth6 ? tempObj.yearAccountOfVolumeBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.yearAccountOfVolumeBilledWeight11to20forMonth7 ? tempObj.yearAccountOfVolumeBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.yearAccountOfVolumeBilledWeight21to30forMonth8 ? tempObj.yearAccountOfVolumeBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.yearAccountOfVolumeBilledWeight31to50forMonth9 ? tempObj.yearAccountOfVolumeBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.yearAccountOfVolumeBilledWeight51to70forMonth10 ? tempObj.yearAccountOfVolumeBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.yearAccountOfVolumeBilledWeight71to150forMonth11 ? tempObj.yearAccountOfVolumeBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.yearAccountOfVolumeBilledWeightAbove150forMonth12 ? tempObj.yearAccountOfVolumeBilledWeightAbove150forMonth12 : '0' }];

				}
				else if (boolean == 0) {
					var chartData = [
						{ "weight": "1", "value": tempObj.accountOfVolumeBilledWeight1forMonth1 ? tempObj.accountOfVolumeBilledWeight1forMonth1 : '0' },
						{ "weight": "2", "value": tempObj.accountOfVolumeBilledWeight2forMonth2 ? tempObj.accountOfVolumeBilledWeight2forMonth2 : '0' },
						{ "weight": "3", "value": tempObj.accountOfVolumeBilledWeight3forMonth3 ? tempObj.accountOfVolumeBilledWeight3forMonth3 : '0' },
						{ "weight": "4", "value": tempObj.accountOfVolumeBilledWeight4forMonth4 ? tempObj.accountOfVolumeBilledWeight4forMonth4 : '0' },
						{ "weight": "5", "value": tempObj.accountOfVolumeBilledWeight5forMonth5 ? tempObj.accountOfVolumeBilledWeight5forMonth5 : '0' },
						{ "weight": "6-10", "value": tempObj.accountOfVolumeBilledWeight6to10forMonth6 ? tempObj.accountOfVolumeBilledWeight6to10forMonth6 : '0' },
						{ "weight": "11-20", "value": tempObj.accountOfVolumeBilledWeight11to20forMonth7 ? tempObj.accountOfVolumeBilledWeight11to20forMonth7 : '0' },
						{ "weight": "21-30", "value": tempObj.accountOfVolumeBilledWeight21to30forMonth8 ? tempObj.accountOfVolumeBilledWeight21to30forMonth8 : '0' },
						{ "weight": "31-50", "value": tempObj.accountOfVolumeBilledWeight31to50forMonth9 ? tempObj.accountOfVolumeBilledWeight31to50forMonth9 : '0' },
						{ "weight": "51-70", "value": tempObj.accountOfVolumeBilledWeight51to70forMonth10 ? tempObj.accountOfVolumeBilledWeight51to70forMonth10 : '0' },
						{ "weight": "71-150", "value": tempObj.accountOfVolumeBilledWeight71to150forMonth11 ? tempObj.accountOfVolumeBilledWeight71to150forMonth11 : '0' },
						{ "weight": "151+", "value": tempObj.accountOfVolumeBilledWeightAbove150forMonth12 ? tempObj.accountOfVolumeBilledWeightAbove150forMonth12 : '0' }];

				}
			}

		}
		am4core.useTheme(am4themes_animated);
		am4core.options.commercialLicense = true;
		// Themes end
		this.zone.runOutsideAngular(() => {
			// Create chart instance
			let chart: any = am4core.create("volume_weight", am4charts.XYChart);

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
			valueAxis.cursorTooltipEnabled = false; //disable axis tooltip
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
			series.columns.template.fillOpacity = 1;

			let columnTemplate = series.columns.template;
			columnTemplate.strokeWidth = 2;
			columnTemplate.strokeOpacity = 1;
			columnTemplate.stroke = am4core.color("#FFFFFF");
			columnTemplate.column.cornerRadiusTopLeft = 8;
			columnTemplate.column.cornerRadiusTopRight = 8;
			columnTemplate.adapter.add('fill', (_: any, target: any) => {
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

			chart.cursor = new am4charts.XYCursor();
			chart.cursor.lineX.strokeOpacity = 0;
			chart.cursor.lineY.strokeOpacity = 0;
			this.volume_weightChart = chart;
			hideIndicator();
		});
	}
	t202mnthObj = [];
	async createSeriesFromAC10(collection: any, event_type: any, boolean: any) {
		var t202mnthObj: any = [];
		var month = this.moreviewChargeDescFormGroup.get('month')?.value;
		if (collection.length > 0) {
			var tempObj = collection[0];
			var chartData: any = [];

			if (event_type == "year") {

				chartData = [{ "Month": "JAN", "value": tempObj.yearTotalForMonth1 },
				{ "Month": "FEB", "value": tempObj.yearTotalForMonth2 },
				{ "Month": "MAR", "value": tempObj.yearTotalForMonth3 },
				{ "Month": "APR", "value": tempObj.yearTotalForMonth4 },
				{ "Month": "MAY", "value": tempObj.yearTotalForMonth5 },
				{ "Month": "JUNE", "value": tempObj.yearTotalForMonth6 },
				{ "Month": "JULY", "value": tempObj.yearTotalForMonth7 },
				{ "Month": "AUG", "value": tempObj.yearTotalForMonth8 },
				{ "Month": "SEP", "value": tempObj.yearTotalForMonth9 },
				{ "Month": "OCT", "value": tempObj.yearTotalForMonth10 },
				{ "Month": "NOV", "value": tempObj.yearTotalForMonth11 },
				{ "Month": "DEC", "value": tempObj.yearTotalForMonth12 }];
			}
			else if (event_type == "month" || boolean == 0) {
				if (month == "1")
					t202mnthObj["yearTotalForMonth1"] = tempObj.yearTotalForMonth1;

				if (month == "2")
					t202mnthObj["yearTotalForMonth2"] = tempObj.yearTotalForMonth2;

				if (month == "3")
					t202mnthObj["yearTotalForMonth3"] = tempObj.yearTotalForMonth3;

				if (month == "4")
					t202mnthObj["yearTotalForMonth4"] = tempObj.yearTotalForMonth4;

				if (month == "5")
					t202mnthObj["yearTotalForMonth5"] = tempObj.yearTotalForMonth5;

				if (month == "6")
					t202mnthObj["yearTotalForMonth6"] = tempObj.yearTotalForMonth6;

				if (month == "7")
					t202mnthObj["yearTotalForMonth7"] = tempObj.yearTotalForMonth7;

				if (month == "8")
					t202mnthObj["yearTotalForMonth8"] = tempObj.yearTotalForMonth8;

				if (month == "9")
					t202mnthObj["yearTotalForMonth9"] = tempObj.yearTotalForMonth9;

				if (month == "10")
					t202mnthObj["yearTotalForMonth10"] = tempObj.yearTotalForMonth10;

				if (month == "11")
					t202mnthObj["yearTotalForMonth11"] = tempObj.yearTotalForMonth12;

				if (month == "12")
					t202mnthObj["yearTotalForMonth12"] = tempObj.yearTotalForMonth12;

				chartData = [{ "Month": "JAN", "value": t202mnthObj.yearTotalForMonth1 ? t202mnthObj.yearTotalForMonth1 : 0 },
				{ "Month": "FEB", "value": t202mnthObj.yearTotalForMonth2 ? t202mnthObj.yearTotalForMonth2 : 0 },
				{ "Month": "MAR", "value": t202mnthObj.yearTotalForMonth3 ? t202mnthObj.yearTotalForMonth3 : 0 },
				{ "Month": "APR", "value": t202mnthObj.yearTotalForMonth4 ? t202mnthObj.yearTotalForMonth4 : 0 },
				{ "Month": "MAY", "value": t202mnthObj.yearTotalForMonth5 ? t202mnthObj.yearTotalForMonth5 : 0 },
				{ "Month": "JUNE", "value": t202mnthObj.yearTotalForMonth6 ? t202mnthObj.yearTotalForMonth6 : 0 },
				{ "Month": "JULY", "value": t202mnthObj.yearTotalForMonth7 ? t202mnthObj.yearTotalForMonth7 : 0 },
				{ "Month": "AUG", "value": t202mnthObj.yearTotalForMonth8 ? t202mnthObj.yearTotalForMonth8 : 0 },
				{ "Month": "SEP", "value": t202mnthObj.yearTotalForMonth9 ? t202mnthObj.yearTotalForMonth9 : 0 },
				{ "Month": "OCT", "value": t202mnthObj.yearTotalForMonth10 ? t202mnthObj.yearTotalForMonth10 : 0 },
				{ "Month": "NOV", "value": t202mnthObj.yearTotalForMonth11 ? t202mnthObj.yearTotalForMonth11 : 0 },
				{ "Month": "DEC", "value": t202mnthObj.yearTotalForMonth12 ? t202mnthObj.yearTotalForMonth12 : 0 }];

			}

			else if (boolean == 1) {
				chartData = [{ "Month": "JAN", "value": tempObj.yearAccountTotalForMonth1 ? tempObj.yearAccountTotalForMonth1 : 0 },
				{ "Month": "FEB", "value": tempObj.yearAccountTotalForMonth2 ? tempObj.yearAccountTotalForMonth2 : 0 },
				{ "Month": "MAR", "value": tempObj.yearAccountTotalForMonth3 ? tempObj.yearAccountTotalForMonth3 : 0 },
				{ "Month": "APR", "value": tempObj.yearAccountTotalForMonth4 ? tempObj.yearAccountTotalForMonth4 : 0 },
				{ "Month": "MAY", "value": tempObj.yearAccountTotalForMonth5 ? tempObj.yearAccountTotalForMonth5 : 0 },
				{ "Month": "JUNE", "value": tempObj.yearAccountTotalForMonth6 ? tempObj.yearAccountTotalForMonth6 : 0 },
				{ "Month": "JULY", "value": tempObj.yearAccountTotalForMonth7 ? tempObj.yearAccountTotalForMonth7 : 0 },
				{ "Month": "AUG", "value": tempObj.yearAccountTotalForMonth8 ? tempObj.yearAccountTotalForMonth8 : 0 },
				{ "Month": "SEP", "value": tempObj.yearAccountTotalForMonth9 ? tempObj.yearAccountTotalForMonth9 : 0 },
				{ "Month": "OCT", "value": tempObj.yearAccountTotalForMonth10 ? tempObj.yearAccountTotalForMonth10 : 0 },
				{ "Month": "NOV", "value": tempObj.yearAccountTotalForMonth11 ? tempObj.yearAccountTotalForMonth11 : 0 },
				{ "Month": "DEC", "value": tempObj.yearAccountTotalForMonth12 ? tempObj.yearAccountTotalForMonth12 : 0 }];
			}


		}

		//return seriesXML;

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
			series.tooltipText = "Month: [bold]{categoryX}[/]  \n Net Charge: $[bold]{valueY.formatNumber('#,###.00')}[/]";
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

			series.columns.template.column.cornerRadiusTopLeft = 8;
			series.columns.template.column.cornerRadiusTopRight = 8;
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
			series.columns.template.adapter.add("fill", function (fill: any, target: any) {
				return chart.colors.getIndex(target.dataItem.index);
			});
			// Cursor
			chart.cursor = new am4charts.XYCursor();
			this.spendByMonthChart = chart;
			hideIndicator();
		});
	}

	async linkshpChange(data: any) {

		this.moreviewChargeDescFormGroup.get('chargeType')?.setValue(data);
		this.bindingTitle();
		if (data == "FRT") {
			await this.linkfrt_clickHandler(data);
		}
		if (data == "FRTWithAcc" || data == null) {
			await this.linkfrtacc_clickHandler(data);
		}
		this.chargetypevalue.set(this.moreviewChargeDescFormGroup.get('chargeType')?.value);
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

		this.fetchdashBoardGrpSerPopup();

	}
	async linkfrtacc_clickHandler(event: any) {
		this.fetchdashBoardGrpSerPopup();

		var domain_Name: any = "T004_Dashboard";
		if (this.month == '0') {
			var event_type: any = "year";
		} else {
			var event_type: any = "month";
		}


	}

	accountNumberVal: any;
	designFileName: any;
	async repostExcelDownload(event: any) {
		var urlParam: any = {};
		var urlParamArr = [];
		var monthVal = this.moreviewChargeDescFormGroup.get('month')?.value;
		var clickedYear = this.moreviewChargeDescFormGroup.get('year')?.value;
		var chargeType = this.moreviewChargeDescFormGroup.get('chargeType')?.value;
		if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }

		var clientId = this.fromPage.t002ClientProfile.clientId;
		var weightchargetype = this.dashBoardSHP.get('chargetypevalue')?.value;
		if (this.moreviewChargeDescFormGroup.get('chargeDescription')?.value == "Ground Economy") {
			this.designFileName = "Charge_Distribution_Report_SmartPost";

		}
		else {
			this.designFileName = "Charge_Distribution_Report";
		}

		var currentDate = new Date();

		var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
		urlParam['createdDate'] = currentDate;
		urlParam['requesteddttm'] = currentDate;
		urlParam['reportName'] = this.designFileName;
		urlParam['reportType'] = "Charge Distribution Report";

		urlParam['reportFormat'] = "excel";
		if (this.accountNumber == "ALL") {
			this.accountNumberVal = null;
		} else { this.accountNumberVal = this.accountNumber }

		urlParam['accNo'] = this.accountNumberVal;
		urlParam['clientName'] = (this.userProfifleFedex.clientName).replace(/[^a-zA-Z0-9 ]/g, "");
		urlParam['clientId'] = clientId;
		urlParam['fromDate'] = clickedYear;
		urlParam['toDate'] = clickedMonth.toString();
		urlParam['loginId'] = 0;
		urlParam['modulename'] = "Charge_Desc_Report";
		urlParam['status'] = "IN QUEUE";
		urlParam['month'] = clickedMonth.toString();
		urlParam['year'] = clickedYear;
		urlParam['desc'] = "";
		urlParam['grp'] = "";
		urlParam['chargeType'] = chargeType;
		urlParam['chargeDesc'] = this.moreviewChargeDescFormGroup.get('chargeDescription')?.value;
		urlParam['chargeGroup'] = this.chargeGroup;
		urlParam['t002ClientProfileobj'] = this.moreviewChargeDescFormGroup.get('t002ClientProfile')?.value;
		urlParamArr.push(urlParam);
		this.httpfedexService.runReport(urlParam)?.subscribe(
			(result: any) => {
				this.saveOrUpdateReportLogResult(result);
			}, (error: any) => {
			});
	}

	async saveOrUpdateReportLogResult(result: any) {

		this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
		this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
		this.httpfedexService._setIntervalFedEx(this.reportsFormGroup.value);
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

	async spendAccNumberChart(tempAC: any, event_type: any, boolean: any) {
		var t201AccountChartACValue = [];
		for (var count = this.fromAccCount; count < this.toAccCount; count++) {
			var t201DashObj = tempAC[count];
			t201AccountChartACValue.push(t201DashObj);
		}
		await this.createSeriesFromAC21(t201AccountChartACValue, event_type, boolean);
	}

	toAccCount: any;
	fromAccCount: any;
	t201AccresultAC: any;
	async next_id_clickHandler(event: any) {

		var tempto = this.toAccCount;
		tempto = tempto + 5;
		if (tempto < this.t201AccresultAC.length) {
			this.fromAccCount = this.toAccCount;
			this.toAccCount = this.toAccCount + 5;
		}
		if (tempto > this.t201AccresultAC.length) {
			this.fromAccCount = this.toAccCount;
			this.toAccCount += (this.t201AccresultAC.length - this.toAccCount);
			this.next_id_visible = false;
		}
		if (tempto == this.t201AccresultAC.length) {
			this.fromAccCount = this.toAccCount;
			this.toAccCount = tempto;

		}
		this.previous_id_visible = true;
		this.first_id_visible = true;
		this.spendAccNumberChart(this.t201AccresultAC, this.event_type, this.boolean);
	}

	async first_id_clickHandler(event: any) {
		// TODO Auto-generated method stub
		this.first_id_visible = false;
		this.previous_id_visible = false;
		this.next_id_visible = true;
		this.fromAccCount = 0;
		this.toAccCount = 5;
		this.spendAccNumberChart(this.t201AccresultAC, this.event_type, this.boolean);
	}
	async previous_id_clickHandler(event: any) {
		this.toAccCount = this.fromAccCount;
		this.fromAccCount = this.fromAccCount - 5;
		if (this.fromAccCount == 0) {
			this.previous_id_visible = false;
			this.first_id_visible = false;
		}
		this.next_id_visible = true;
		this.spendAccNumberChart(this.t201AccresultAC, this.event_type, this.boolean);
	}

}
