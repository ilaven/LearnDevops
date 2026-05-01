import { Component, OnInit, NgZone, Optional, Inject, signal, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpClientService } from "src/app/core/services/httpclient.service";
import { AlertPopupComponent } from "src/app/shared/alert-popup/alert-popup.component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CommonService } from "src/app/core/services/common.service";
import { HttpfedexService } from "src/app/core/services/httpfedex.service";
import { DatePipe } from "@angular/common";
@Component({
	selector: 'app-fedex-zone-popup',
	templateUrl: './fedex-zone-popup.component.html',
	styleUrls: ['./fedex-zone-popup.component.css'],
	standalone: false
})
export class FedexZonePopupComponent implements OnInit {
	private zone_popupChart!: am4charts.XYChart;
	private zone_popupChartTwo!: am4charts.XYChart;
	reportsFormGroup = new FormGroup({
		reportLogId: new FormControl(''),
		t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
	});
	loginId: Number = 123;
	userProfile: any;
	moreviewZoneFormGroup!: FormGroup;
	dashBoardSHP!: FormGroup;
	fromPage: any;
	invoiceMonth: any;
	invoiceyear: any;
	clientId: any;
	clientName: any;
	groupby: any;
	group: any;
	resultAc: any;
	resultAc2: any;
	chargeDescription: any;
	chargetypevalue = signal<any>('');
	pointName: any;
	fullmonth: any;
	tempfrtAC: any = [];
	month: any;
	year: any;
	fromdateReport: any;
	todateReport: any;
	zonechargetype: any;
	frtAC: any = [];
	zoneflag: any;
	zonerange: any;
	txtzone_text: any;
	fromzone: any;
	yearBindingTitle: any;
	monthBindingTitle: any;

	tozone: any; accountNumber: any;
	monthFlag: any;
	t002ClientProfile: any;
	userProfifleFedex: any;
	zoneChargeType: any;
	ZoneValueReport: any;
	ZoneCountReport: any;
	themeoption: any;
	panelClass: any;
	categoryName: any;
	serviceType: any;
	titleChart1: any;
	titleChart2: any;
	titleChart1Name = signal<any>('');
	titleChart2Name = signal<any>('');
	constructor(private commonService: CommonService, public dialog: MatDialog, public datePipe: DatePipe, private cd: ChangeDetectorRef,
		public dialogRef: MatDialogRef<FedexZonePopupComponent>, private mlForm: FormBuilder, private httpfedexService: HttpfedexService, private zone: NgZone,
		@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
		this.fromPage = data.popupValue;
		this.panelClass = data.panelClass;
		this.initForm();
	}
	initForm() {
		this.dashBoardSHP = new FormGroup({
			chargetypevalue: new FormControl('FRTWithAcc')
		});

		if (this.fromPage.invoiceMonth == null) { this.invoiceMonth = '0'; }
		else { this.invoiceMonth = this.fromPage.invoiceMonth; }
		this.invoiceyear = this.fromPage.invoiceyear;
		this.clientId = this.fromPage.clientId;
		this.monthFlag = this.fromPage.monthFlag;
		this.accountNumber = this.fromPage.accountNumber;
		this.chargeDescription = this.fromPage.chargeDescription;
		this.categoryName = this.fromPage.categoryName;
		this.userProfifleFedex = this.fromPage.t002ClientProfile;
		this.chargetypevalue.set(this.fromPage.chargetypevalue);
		this.zoneChargeType = this.fromPage.chargetypevalue;
		this.themeoption = this.fromPage.themeoption;
		this.dashBoardSHP.get('chargetypevalue')?.setValue(this.chargetypevalue());
		var pointVal = this.fromPage.chargeDescription;
		var selectedService = pointVal;
		if (selectedService == "Ground") {
			var selectedServiceFullName: any = "Ground";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}

		if (selectedService == "Home \n Delivery") {
			selectedServiceFullName = "Home Delivery";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		if (selectedService == "Ground \n Economy") {
			selectedServiceFullName = "Ground Economy";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		if (selectedService == "First \n Overnight") {
			selectedServiceFullName = "FedEx First Overnight";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		if (selectedService == "Priority \n Overnight") {
			selectedServiceFullName = "FedEx Priority Overnight";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		if (selectedService == "Standard \n Overnight") {
			selectedServiceFullName = "FedEx Standard Overnight";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		//if(selectedService=="2 Day AM")
		//	selectedServiceFullName="FedEx 2Day A.M.";
		if (selectedService == "2 Day") {
			selectedServiceFullName = "FedEx 2Day";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		if (selectedService == "Express \n Saver") {
			selectedServiceFullName = "FedEx Express Saver";
			this.titleChart1 = "US 48";
			this.titleChart2 = "AK PR HI";
		}
		if (selectedService == "International \n Ground") {
			selectedServiceFullName = "International Ground";
			this.titleChart1 = "Canada";
			this.titleChart2 = "";
		}
		if (selectedService == "International \n First") {
			selectedServiceFullName = "FedEx International First";
			this.titleChart1 = "International First";
			this.titleChart2 = "";
		}
		if (selectedService == "International \n Priority") {
			selectedServiceFullName = "FedEx Intl Priority";
			this.titleChart1 = "International Priority";
			this.titleChart2 = "";
		}
		if (selectedService == "International \n Economy") {
			selectedServiceFullName = "FedEx Intl Economy";
			this.titleChart1 = "International Economy";
			this.titleChart2 = "";
		}
		if (selectedService == "International \n Priority \n Express") {
			selectedServiceFullName = "FedEx Intl Priority Express";
			this.titleChart1 = "International Priority Express";
			this.titleChart2 = "";
		}
		this.titleChart1Name.set(this.titleChart1);
		this.titleChart2Name.set(this.titleChart2);
		this.serviceType = selectedServiceFullName;
		if (this.accountNumber == "ALL") {
			var accountNumber = this.clientId;
		} else { accountNumber = this.accountNumber; }

		this.chargeDescription = this.fromPage.chargeDescription;
		this.chargetypevalue.set(this.fromPage.chargetypevalue);
		this.moreviewZoneFormGroup = new FormGroup({
			selectedMonth: new FormControl(this.monthFlag), //9126
			clientId: new FormControl(this.clientId),
			month: new FormControl(this.invoiceMonth),
			year_1: new FormControl(this.invoiceyear),
			chargetypevalue: new FormControl(this.chargetypevalue()),
			serviceType: new FormControl(selectedServiceFullName),
			zoneChargeType: new FormControl(this.zoneChargeType),
			primaryAccountNumber: new FormControl(accountNumber),
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
		this.moreviewZoneFormGroup.get('chargetypevalue')?.setValue(data);
		this.moreviewZoneFormGroup.get('zoneChargeType')?.setValue(data);		
		this.chargetypevalue.set(data);
		this.bindingTitle();		
		this.fetchselectedzone();
		
	}
	async bindingTitle() {
		var yearData = this.moreviewZoneFormGroup.get('year_1')?.value;
		var monthData = this.moreviewZoneFormGroup.get('month')?.value;
		var chargeType = this.dashBoardSHP.get('chargetypevalue')?.value;
		this.yearBindingTitle = await this.moreviewZoneFormGroup.get('year_1')?.value;
		if (monthData == '0') {
			this.monthBindingTitle = "";
		} else {
			var monthArray = new Array("All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			this.monthBindingTitle = monthArray[monthData];
		}
		this.cd.detectChanges();

	}
	async fetchselectedzone() {
		this.moreviewZoneFormGroup.patchValue({
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
		await this.httpfedexService.fetchZone(this.moreviewZoneFormGroup.value)?.subscribe(
			result => {
				var resultAc = result;
				this.bar_chart1(resultAc);
			},
			error => {
				console.log('error', error);
			})
	}
	async bar_chart1(resultAc: any) {
		if (resultAc != null && resultAc.length != 0) {
			var serviceType = this.moreviewZoneFormGroup.get('serviceType')?.value;
			this.createSeriesFromAC_bar(resultAc);
			if (serviceType != 'International Ground' && serviceType != 'FedEx Express Saver' && serviceType != 'FedEx International First' && serviceType != 'FedEx Intl Priority' && serviceType != 'FedEx Intl Economy' && serviceType != 'FedEx Intl Priority Express') {
				this.createSeriesFromAC_morezoneChart(resultAc);
			}
		}
	}
	async createSeriesFromAC_bar(collection: any) {
		var selectedServiceZoneValue: any;
		var zoneCount: any;
		var selectedMonth = this.moreviewZoneFormGroup.get('month')?.value; //9126
		var seriescount: any = [];
		for (var loop = 0; loop < collection.length; loop++) {

			var t219DashboardZoneChartObj = collection[loop];

			if (this.monthFlag == "N") {
				if (t219DashboardZoneChartObj.serviceType == "Ground" || t219DashboardZoneChartObj.serviceType == "International Ground" || t219DashboardZoneChartObj.serviceType == "Home Delivery") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zone2To96TotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZone2to96TotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zone2To96TotalSpend";
					this.ZoneCountReport = "countZone2to96TotalSpend";
				}

				if (t219DashboardZoneChartObj.serviceType == "FedEx First Overnight" || t219DashboardZoneChartObj.serviceType == "FedEx Priority Overnight" || t219DashboardZoneChartObj.serviceType == "FedEx Standard Overnight"
					|| t219DashboardZoneChartObj.serviceType == "FedEx 2Day A.M." || t219DashboardZoneChartObj.serviceType == "FedEx 2Day" || t219DashboardZoneChartObj.serviceType == "FedEx Express Saver") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zone2To16TotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZone2to16TotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zone2To16TotalSpend";
					this.ZoneCountReport = "countZone2to16TotalSpend";
				}

				if (t219DashboardZoneChartObj.serviceType == "Ground Economy") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zone1To99TotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZone1to99TotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zone1To99TotalSpend";
					this.ZoneCountReport = "countZone1to99TotalSpend";
				}

				if (t219DashboardZoneChartObj.serviceType == "FedEx International First" || t219DashboardZoneChartObj.serviceType == "FedEx Intl First"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority Express"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority Express") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zoneAToOTotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZoneAtoOTotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zoneAToOTotalSpend";
					this.ZoneCountReport = "countZoneAtoOTotalSpend";
				}
			}


			else {

				if (selectedMonth == 1) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.jan;
					zoneCount = t219DashboardZoneChartObj.countJAN.replace(/\s/g, "");
					this.ZoneValueReport = "jan";
					this.ZoneCountReport = "countJAN";
				}
				else if (selectedMonth == 2) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.feb;
					zoneCount = t219DashboardZoneChartObj.countFEB.replace(/\s/g, "");
					this.ZoneValueReport = "feb";
					this.ZoneCountReport = "countFEB";
				}
				else if (selectedMonth == 3) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.mar;
					zoneCount = t219DashboardZoneChartObj.countMAR.replace(/\s/g, "");
					this.ZoneValueReport = "mar";
					this.ZoneCountReport = "countMAR";
				}
				else if (selectedMonth == 4) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.apr;
					zoneCount = t219DashboardZoneChartObj.countAPR.replace(/\s/g, "");
					this.ZoneValueReport = "apr";
					this.ZoneCountReport = "countAPR";
				}
				else if (selectedMonth == 5) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.may;
					zoneCount = t219DashboardZoneChartObj.countMAY.replace(/\s/g, "");
					this.ZoneValueReport = "may";
					this.ZoneCountReport = "countMAY";
				}
				else if (selectedMonth == 6) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.jun;
					zoneCount = t219DashboardZoneChartObj.countJUN.replace(/\s/g, "");
					this.ZoneValueReport = "jun";
					this.ZoneCountReport = "countJUN";
				}
				else if (selectedMonth == 7) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.jul;
					zoneCount = t219DashboardZoneChartObj.countJUL.replace(/\s/g, "");
					this.ZoneValueReport = "jul";
					this.ZoneCountReport = "countJUL";
				}
				else if (selectedMonth == 8) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.aug;
					zoneCount = t219DashboardZoneChartObj.countAUG.replace(/\s/g, "");
					this.ZoneValueReport = "aug";
					this.ZoneCountReport = "countAUG";
				}
				else if (selectedMonth == 9) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.sep;
					zoneCount = t219DashboardZoneChartObj.countSEP.replace(/\s/g, "");
					this.ZoneValueReport = "sep";
					this.ZoneCountReport = "countSEP";
				}

				else if (selectedMonth == 10) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.oct;
					zoneCount = t219DashboardZoneChartObj.countOCT.replace(/\s/g, "");
					this.ZoneValueReport = "oct";
					this.ZoneCountReport = "countOCT";
				}
				else if (selectedMonth == 11) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.nov;
					zoneCount = t219DashboardZoneChartObj.countNOV.replace(/\s/g, "");
					this.ZoneValueReport = "nov";
					this.ZoneCountReport = "countNOV";
				}
				else if (selectedMonth == 12) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.decm;
					zoneCount = t219DashboardZoneChartObj.countDECM.replace(/\s/g, "");
					this.ZoneValueReport = "decm";
					this.ZoneCountReport = "countDECM";
				}

			}

			if (t219DashboardZoneChartObj != null) {
				var netamountcurrency = selectedServiceZoneValue;
				if (t219DashboardZoneChartObj.serviceType == "FedEx International First" || t219DashboardZoneChartObj.serviceType == "FedEx Intl First"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority Express"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority Express") {
					//   if(t219DashboardZoneChartObj.zoneCode=="A" || t219DashboardZoneChartObj.zoneCode=="B" || t219DashboardZoneChartObj.zoneCode=="C" || t219DashboardZoneChartObj.zoneCode=="D" || 
					//      t219DashboardZoneChartObj.zoneCode=="E" || t219DashboardZoneChartObj.zoneCode=="F" || t219DashboardZoneChartObj.zoneCode=="G" || t219DashboardZoneChartObj.zoneCode=="H" ||
					//      t219DashboardZoneChartObj.zoneCode=="I" || t219DashboardZoneChartObj.zoneCode=="J" || t219DashboardZoneChartObj.zoneCode=="K" || t219DashboardZoneChartObj.zoneCode=="L" || 
					//      t219DashboardZoneChartObj.zoneCode=="N" || t219DashboardZoneChartObj.zoneCode=="O"){
					seriescount.push({
						"MonthValue": "1",
						"Month": t219DashboardZoneChartObj.zoneCode,
						"Count": zoneCount,
						"NetAmount": netamountcurrency
					});

					// }
				}
				else if (t219DashboardZoneChartObj.serviceType == "International Ground") {

					if (t219DashboardZoneChartObj.zoneCode == "51" || t219DashboardZoneChartObj.zoneCode == "54") {
						seriescount.push({
							"MonthValue": "1",
							"Month": t219DashboardZoneChartObj.zoneCode,
							"Count": zoneCount,
							"NetAmount": netamountcurrency
						});

					}
				}
				else if (t219DashboardZoneChartObj.zoneCode == "02" || t219DashboardZoneChartObj.zoneCode == "03" || t219DashboardZoneChartObj.zoneCode == "04" || t219DashboardZoneChartObj.zoneCode == "05" ||
					t219DashboardZoneChartObj.zoneCode == "06" || t219DashboardZoneChartObj.zoneCode == "07" || t219DashboardZoneChartObj.zoneCode == "08") {
					seriescount.push({
						"MonthValue": "1",
						"Month": t219DashboardZoneChartObj.zoneCode,
						"Count": zoneCount,
						"NetAmount": netamountcurrency
					});
				}
			}
		}
		am4core.options.commercialLicense = true;
		am4core.useTheme(am4themes_animated);
		this.zone.runOutsideAngular(() => {
			// Themes end
			let chart: any = am4core.create("zone_popup", am4charts.XYChart);
			// if (this.serviceType == "FedEx International First" || this.serviceType == "FedEx Intl First"
			//  || this.serviceType == "FedEx International Priority" || this.serviceType == "FedEx Intl Priority"
			//  || this.serviceType == "FedEx Intl Economy" || this.serviceType == "FedEx International Economy") {
			// 	let title = chart.titles.create();
			// 	title.text = "EXPORT";
			// 	title.fontSize = 25;
			// 	title.marginBottom = 30;
			// }
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
			series2.tooltipText = "Zone: [bold]{categoryX}[/] \n Net Charge :$ [bold]{valueY.formatNumber('#,###.00')}[/]";
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
		var selectedServiceZoneValue: any;
		var selectedServiceMonthZoneValue: any;
		var zoneCount: any;
		var monthZoneCount: string;
		var monthValue = 0;
		var selectedMonth = this.moreviewZoneFormGroup.get('month')?.value; //9126
		var seriescount: any = [];
		for (var loop = 0; loop < collection.length; loop++) {

			var t219DashboardZoneChartObj = collection[loop];

			if (this.monthFlag == "N") {
				if (t219DashboardZoneChartObj.serviceType == "Ground" || t219DashboardZoneChartObj.serviceType == "International Ground" || t219DashboardZoneChartObj.serviceType == "Home Delivery") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zone2To96TotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZone2to96TotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zone2To96TotalSpend";
					this.ZoneCountReport = "countZone2to96TotalSpend";
				}

				if (t219DashboardZoneChartObj.serviceType == "FedEx First Overnight" || t219DashboardZoneChartObj.serviceType == "FedEx Priority Overnight" || t219DashboardZoneChartObj.serviceType == "FedEx Standard Overnight"
					|| t219DashboardZoneChartObj.serviceType == "FedEx 2Day A.M." || t219DashboardZoneChartObj.serviceType == "FedEx 2Day" || t219DashboardZoneChartObj.serviceType == "FedEx Express Saver") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zone2To16TotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZone2to16TotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zone2To16TotalSpend";
					this.ZoneCountReport = "countZone2to16TotalSpend";
				}

				if (t219DashboardZoneChartObj.serviceType == "Ground Economy") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zone1To99TotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZone1to99TotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zone1To99TotalSpend";
					this.ZoneCountReport = "countZone1to99TotalSpend";
				}

				if (t219DashboardZoneChartObj.serviceType == "FedEx International First" || t219DashboardZoneChartObj.serviceType == "FedEx Intl First"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority Express"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority Express") {
					selectedServiceZoneValue = t219DashboardZoneChartObj.zoneAToOTotalSpend;
					zoneCount = t219DashboardZoneChartObj.countZoneAtoOTotalSpend.replace(/\s/g, "");
					this.ZoneValueReport = "zoneAToOTotalSpend";
					this.ZoneCountReport = "countZoneAtoOTotalSpend";
				}
			}


			else {

				if (selectedMonth == 1) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.jan;
					zoneCount = t219DashboardZoneChartObj.countJAN.replace(/\s/g, "");
					this.ZoneValueReport = "jan";
					this.ZoneCountReport = "countJAN";
				}
				else if (selectedMonth == 2) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.feb;
					zoneCount = t219DashboardZoneChartObj.countFEB.replace(/\s/g, "");
					this.ZoneValueReport = "feb";
					this.ZoneCountReport = "countFEB";
				}
				else if (selectedMonth == 3) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.mar;
					zoneCount = t219DashboardZoneChartObj.countMAR.replace(/\s/g, "");
					this.ZoneValueReport = "mar";
					this.ZoneCountReport = "countMAR";
				}
				else if (selectedMonth == 4) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.apr;
					zoneCount = t219DashboardZoneChartObj.countAPR.replace(/\s/g, "");
					this.ZoneValueReport = "apr";
					this.ZoneCountReport = "countAPR";
				}
				else if (selectedMonth == 5) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.may;
					zoneCount = t219DashboardZoneChartObj.countMAY.replace(/\s/g, "");
					this.ZoneValueReport = "may";
					this.ZoneCountReport = "countMAY";
				}
				else if (selectedMonth == 6) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.jun;
					zoneCount = t219DashboardZoneChartObj.countJUN.replace(/\s/g, "");
					this.ZoneValueReport = "jun";
					this.ZoneCountReport = "countJUN";
				}
				else if (selectedMonth == 7) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.jul;
					zoneCount = t219DashboardZoneChartObj.countJUL.replace(/\s/g, "");
					this.ZoneValueReport = "jul";
					this.ZoneCountReport = "countJUL";
				}
				else if (selectedMonth == 8) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.aug;
					zoneCount = t219DashboardZoneChartObj.countAUG.replace(/\s/g, "");
					this.ZoneValueReport = "aug";
					this.ZoneCountReport = "countAUG";
				}
				else if (selectedMonth == 9) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.sep;
					zoneCount = t219DashboardZoneChartObj.countSEP.replace(/\s/g, "");
					this.ZoneValueReport = "sep";
					this.ZoneCountReport = "countSEP";
				}

				else if (selectedMonth == 10) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.oct;
					zoneCount = t219DashboardZoneChartObj.countOCT.replace(/\s/g, "");
					this.ZoneValueReport = "oct";
					this.ZoneCountReport = "countOCT";
				}
				else if (selectedMonth == 11) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.nov;
					zoneCount = t219DashboardZoneChartObj.countNOV.replace(/\s/g, "");
					this.ZoneValueReport = "nov";
					this.ZoneCountReport = "countNOV";
				}
				else if (selectedMonth == 12) {
					selectedServiceZoneValue = t219DashboardZoneChartObj.decm;
					zoneCount = t219DashboardZoneChartObj.countDECM.replace(/\s/g, "");
					this.ZoneValueReport = "decm";
					this.ZoneCountReport = "countDECM";
				}

			}

			if (t219DashboardZoneChartObj != null) {
				var netamountcurrency = selectedServiceZoneValue;

				if (t219DashboardZoneChartObj.serviceType == "FedEx International First" || t219DashboardZoneChartObj.serviceType == "FedEx Intl First"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Economy"
					|| t219DashboardZoneChartObj.serviceType == "FedEx International Priority Express"
					|| t219DashboardZoneChartObj.serviceType == "FedEx Intl Priority Express") {
					// 	if(	t219DashboardZoneChartObj.zoneCode=="H" || t219DashboardZoneChartObj.zoneCode=="P" || t219DashboardZoneChartObj.zoneCode=="A" || t219DashboardZoneChartObj.zoneCode=="Z" || t219DashboardZoneChartObj.zoneCode=="M" ||
					// 	t219DashboardZoneChartObj.zoneCode=="C" || t219DashboardZoneChartObj.zoneCode=="D" || t219DashboardZoneChartObj.zoneCode=="E" || t219DashboardZoneChartObj.zoneCode=="F" || 
					// 	t219DashboardZoneChartObj.zoneCode=="G" || t219DashboardZoneChartObj.zoneCode=="I" || t219DashboardZoneChartObj.zoneCode=="J" || 
					// 	t219DashboardZoneChartObj.zoneCode=="K" || t219DashboardZoneChartObj.zoneCode=="L" || 
					//    t219DashboardZoneChartObj.zoneCode=="N" || t219DashboardZoneChartObj.zoneCode=="O"){
					seriescount.push({
						"MonthValue": "1",
						"Month": t219DashboardZoneChartObj.zoneCode,
						"Count": zoneCount,
						"NetAmount": netamountcurrency
					});

					//    }
				} else if (t219DashboardZoneChartObj.zoneCode == "09" || t219DashboardZoneChartObj.zoneCode == "14" || t219DashboardZoneChartObj.zoneCode == "17" || t219DashboardZoneChartObj.zoneCode == "22" || t219DashboardZoneChartObj.zoneCode == "23" ||
					t219DashboardZoneChartObj.zoneCode == "25" || t219DashboardZoneChartObj.zoneCode == "92" || t219DashboardZoneChartObj.zoneCode == "96" || t219DashboardZoneChartObj.zoneCode == "10" || t219DashboardZoneChartObj.zoneCode == "H" ||
					t219DashboardZoneChartObj.zoneCode == "P" || t219DashboardZoneChartObj.zoneCode == "A" || t219DashboardZoneChartObj.zoneCode == "Z" || t219DashboardZoneChartObj.zoneCode == "M" || t219DashboardZoneChartObj.zoneCode == "99" ||
					t219DashboardZoneChartObj.zoneCode == "11" || t219DashboardZoneChartObj.zoneCode == "12" || t219DashboardZoneChartObj.zoneCode == "13" || t219DashboardZoneChartObj.zoneCode == "15" || t219DashboardZoneChartObj.zoneCode == "16") {
					seriescount.push({
						"MonthValue": "1",
						"Month": t219DashboardZoneChartObj.zoneCode,
						"Count": zoneCount,
						"NetAmount": netamountcurrency
					});
				}
			}
		}

		am4core.options.commercialLicense = true;
		am4core.useTheme(am4themes_animated);
		this.zone.runOutsideAngular(() => {
			// Themes end
			let chart: any = am4core.create("zonechart_popup", am4charts.XYChart);
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
			series2.tooltipText = "Zone: [bold]{categoryX}[/] \n Net Charge :$ [bold]{valueY.formatNumber('#,###.00')}[/]";
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
			this.zone_popupChartTwo = chart;
			if (seriescount.length > 0) {
				hideIndicator();
			}
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
	accountNumberVal: any;
	tableName: any;
	async radiobutton_clickHandler() {

		var urlParam: any = {};
		var urlParamArr = [];
		var monthVal = this.moreviewZoneFormGroup.get('month')?.value
		var clickedYear = this.moreviewZoneFormGroup.get('year_1')?.value;
		if (monthVal == null) { var clickedMonth = 0; } else { clickedMonth = monthVal; }

		var clientId = this.moreviewZoneFormGroup.get('clientId')?.value;
		var weightchargetype = this.dashBoardSHP.get('chargetypevalue')?.value;
		if (weightchargetype == "FRTWithAcc") {
			this.tableName = "T219_DashboardZoneDistributionChartFRTWithACC";

		}
		else {
			this.tableName = "T219_DashboardZoneDistributionChartFRT";

		}

		var currentDate = new Date();

		var currDate = this.datePipe.transform(currentDate, "yyyy-MM-dd h:mm:ss")
		urlParam['createdDate'] = currentDate;
		urlParam['requesteddttm'] = currentDate;
		urlParam['reportName'] = "DASHBOARD_ZONE_DISTRIBUTION";
		urlParam['reportType'] = "Dashboard Zone Distribution";

		urlParam['reportFormat'] = "excel";
		if (this.accountNumber == "ALL") {
			this.accountNumberVal = clientId.toString();
		} else { this.accountNumberVal = this.accountNumber }

		urlParam['accNo'] = this.accountNumberVal;
		urlParam['accountNumber'] = this.accountNumberVal;
		urlParam['clientName'] = (this.userProfifleFedex.clientName).replace(/[^a-zA-Z0-9 ]/g, "");
		urlParam['tableName'] = this.tableName;
		urlParam['clientId'] = this.moreviewZoneFormGroup.get('clientId')?.value;
		urlParam['fromDate'] = clickedYear;
		urlParam['toDate'] = clickedMonth.toString();
		urlParam['loginId'] = 0;
		urlParam['modulename'] = "Dashboard_ZoneChart";
		urlParam['status'] = "IN QUEUE";
		urlParam['month'] = clickedMonth.toString();
		urlParam['year'] = clickedYear;
		urlParam['desc'] = "";
		urlParam['grp'] = "";
		urlParam['chargeType'] = this.ZoneValueReport;
		urlParam['chargeDesc'] = this.ZoneCountReport;
		urlParam['chargeGroup'] = this.moreviewZoneFormGroup.get('serviceType')?.value;

		urlParam['t002ClientProfileobj'] = this.moreviewZoneFormGroup.get('t002ClientProfile')?.value;
		urlParamArr.push(urlParam);


		this.httpfedexService.runReport(urlParam)?.subscribe(
			result => {
				this.saveOrUpdateReportLogResult(result);
			}, error => {
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
