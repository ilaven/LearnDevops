import { DatePipe } from '@angular/common';
import { Component, ElementRef, signal, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

type Cell = string | number;

interface ReportTable {
  title: string;
  headers: string[];   // e.g. ["Billed Weight","102","103",...]
  rows: Cell[][];      // each row length must match headers length
}

@Component({
  selector: 'app-ontrac-zone-distribution',
  templateUrl: './zone-distribution.component.html',
  styleUrls: ['./zone-distribution.component.scss'],
  standalone: false
})
export class OnTracZoneDistributionComponent implements OnInit, AfterViewInit {
  // optional (keep if you use it in HTML)
  // scroll sync refs (make sure your HTML has #tableScroll and #headerScroll)
  @ViewChild('tableScroll', { static: false }) tableScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('headerScroll', { static: false }) headerScroll!: ElementRef<HTMLDivElement>;
  @ViewChild('filtetcontent') filtetcontent!: TemplateRef<any>;
  @ViewChild('allSelectedValue') private allSelectedValue!: MatOption;
  @ViewChild('accNoSel') private accNoSel!: MatSelect;


  //Variable Declaration
  clientType = signal<string>('');
  defaultArr = ["ALL"];
  Default = 'ALL';
  modulename = "ZoneDistribution";
  attribute: any;
  private syncing = false;
  randomNumber: number = 0;
  currentDate: Date = new Date();
  searchActive: boolean = true;
  fromDate: any;
  toDate: any;
  fromDateFormat: string | null = '';
  toDateFormat: string | null = '';
  tempfromDate: Date = new Date();
  temptoDate: Date = new Date();
  userProfifleData: any;
  userProfifle: any;
  clientID: any;
  clientName: any
  dataasof: any;
  dataasofFormat: string | null = '';
  dataasoffFormat: Date | null = null;
  userProfifleVal: any;
  resultZoneDistributionUPS: any;
  serviceName: any;
  flag: number = 0;
  zonePacagecount: any[] = [];
  zoneAveFRT: any[] = [];
  zoneAvgACC: any[] = [];
  zonePackageFRT: any[] = [];
  zoneFRTACC: any[] = [];
  resultObj: any[] = [];
  zonedistributionAC: any[] = [];
  resultZoneDistribution: any;
  summaryZoneDistributionObj: any;
  datagridpackagecount_id_dataProvider: any[] = [];
  datagridavgfrt_id_dataProvider: any[] = [];
  datagridavgacc_id_dataProvider: any[] = [];
  datagridpackagefrt_id_dataProvider: any[] = [];
  datagridfrtacc_id_dataProvider: any[] = [];
  datagridpackagecount_id_rowCount: number = 0;
  datagridavgfrt_id_rowCount: number = 0;
  datagridavgacc_id_rowCount: number = 0;
  datagridpackagefrt_id_rowCount: number = 0;
  datagridfrtacc_id_rowCount: number = 0;
  idLoadingPanel_visible: boolean = false;
  packagecount: number = 0;
  avgFRT: number = 0;
  avgACC: number = 0;
  packageFRT: number = 0;
  packageFRTSCC: number = 0;
  defaultOption: any;
  zoneDistributionObj: any;
  packageflag: number = 0;
  totalus_value: number = 0;
  cmb_service_selectedLabel: any;
  packagelbl_id_text: any;
  field1_packagecount_headerText: any;
  openModalConfig: any;
  panelClass: string = '';
  field2_packagecount_headerText: any;
  field3_packagecount_headerText: any;
  field4_packagecount_headerText: any;
  field5_packagecount_headerText: any;
  field6_packagecount_headerText: any;
  field7_packagecount_headerText: any;
  field8_packagecount_headerText: any;
  field9_packagecount_headerText: any;
  field1_avgfrt_headerText: any;
  field2_avgfrt_headerText: any;
  field3_avgfrt_headerText: any;
  field4_avgfrt_headerText: any;
  field5_avgfrt_headerText: any;
  field6_avgfrt_headerText: any;
  field7_avgfrt_headerText: any;
  field8_avgfrt_headerText: any;
  field9_avgfrt_headerText: any;
  field1_avgacc_headerText: any;
  field2_avgacc_headerText: any;
  field3_avgacc_headerText: any;
  field4_avgacc_headerText: any;
  field5_avgacc_headerText: any;
  field6_avgacc_headerText: any;
  field7_avgacc_headerText: any;
  field8_avgacc_headerText: any;
  field9_avgacc_headerText: any;
  field1_packagefrt_headerText: any;
  field2_packagefrt_headerText: any;
  field3_packagefrt_headerText: any;
  field4_packagefrt_headerText: any;
  field5_packagefrt_headerText: any;
  field6_packagefrt_headerText: any;
  field7_packagefrt_headerText: any;
  field8_packagefrt_headerText: any;
  field9_packagefrt_headerText: any;
  field1_frtacc_headerText: any;
  field2_frtacc_headerText: any;
  field3_frtacc_headerText: any;
  field4_frtacc_headerText: any;
  field5_frtacc_headerText: any;
  field6_frtacc_headerText: any;
  field7_frtacc_headerText: any;
  field8_frtacc_headerText: any;
  field9_frtacc_headerText: any;
  field10_avgacc_headerText: any;
  field11_avgacc_headerText: any;
  field12_avgacc_headerText: any;
  field13_avgacc_headerText: any;
  field14_avgacc_headerText: any;
  field15_avgacc_headerText: any;
  field16_avgacc_headerText: any;
  field17_avgacc_headerText: any;
  field18_avgacc_headerText: any;
  field19_avgacc_headerText: any;
  field20_avgacc_headerText: any;
  field21_avgacc_headerText: any;
  field22_avgacc_headerText: any;
  field23_avgacc_headerText: any;
  field24_avgacc_headerText: any;
  field25_avgacc_headerText: any;
  field26_avgacc_headerText: any;
  field27_avgacc_headerText: any;
  field28_avgacc_headerText: any;
  field29_avgacc_headerText: any;
  field30_avgacc_headerText: any;
  field31_avgacc_headerText: any;
  field32_avgacc_headerText: any;
  field33_avgacc_headerText: any;
  field34_avgacc_headerText: any;
  field35_avgacc_headerText: any;
  field36_avgacc_headerText: any;
  field37_avgacc_headerText: any;
  field38_avgacc_headerText: any;
  field39_avgacc_headerText: any;
  field40_avgacc_headerText: any;
  field41_avgacc_headerText: any;
  field42_avgacc_headerText: any;
  field43_avgacc_headerText: any;
  field44_avgacc_headerText: any;
  field45_avgacc_headerText: any;
  field46_avgacc_headerText: any;
  field47_avgacc_headerText: any;
  field48_avgacc_headerText: any;
  field49_avgacc_headerText: any;
  field50_avgacc_headerText: any;
  field51_avgacc_headerText: any;
  field52_avgacc_headerText: any;
  field53_avgacc_headerText: any;
  field54_avgacc_headerText: any;
  field55_avgacc_headerText: any;
  field56_avgacc_headerText: any;
  field57_avgacc_headerText: any;
  field58_avgacc_headerText: any;
  field59_avgacc_headerText: any;
  field60_avgacc_headerText: any;
  field61_avgacc_headerText: any;
  field15_avgfrt_headerText: string = "";
  field16_avgfrt_headerText: string = "";
  field17_avgfrt_headerText: string = "";
  field18_avgfrt_headerText: string = "";
  field19_avgfrt_headerText: string = "";
  field20_avgfrt_headerText: string = "";
  field21_avgfrt_headerText: string = "";
  field22_avgfrt_headerText: string = "";
  field23_avgfrt_headerText: string = "";
  field24_avgfrt_headerText: string = "";
  field25_avgfrt_headerText: string = "";
  field26_avgfrt_headerText: string = "";
  field27_avgfrt_headerText: string = "";
  field28_avgfrt_headerText: string = "";
  field29_avgfrt_headerText: string = "";
  field30_avgfrt_headerText: string = "";
  field31_avgfrt_headerText: string = "";
  field32_avgfrt_headerText: string = "";
  field33_avgfrt_headerText: string = "";
  field34_avgfrt_headerText: string = "";
  field35_avgfrt_headerText: string = "";
  field36_avgfrt_headerText: string = "";
  field37_avgfrt_headerText: string = "";
  field38_avgfrt_headerText: string = "";
  field39_avgfrt_headerText: string = "";
  field40_avgfrt_headerText: string = "";
  field41_avgfrt_headerText: string = "";
  field42_avgfrt_headerText: string = "";
  field43_avgfrt_headerText: string = "";
  field44_avgfrt_headerText: string = "";
  field45_avgfrt_headerText: string = "";
  field46_avgfrt_headerText: string = "";
  field47_avgfrt_headerText: string = "";
  field48_avgfrt_headerText: string = "";
  field49_avgfrt_headerText: string = "";
  field50_avgfrt_headerText: string = "";
  field51_avgfrt_headerText: string = "";
  field52_avgfrt_headerText: string = "";
  field53_avgfrt_headerText: string = "";
  field54_avgfrt_headerText: string = "";
  field55_avgfrt_headerText: string = "";
  field56_avgfrt_headerText: string = "";
  field57_avgfrt_headerText: string = "";
  field58_avgfrt_headerText: string = "";
  field59_avgfrt_headerText: string = "";
  field60_avgfrt_headerText: string = "";
  field61_avgfrt_headerText: string = "";
  zoneACCSCC: any[] = [];
  zonepackageSCC: any[] = [];
  zoneFRTSCC: any[] = [];
  zonePackageACC: any[] = [];
  datagridaccscc_id_dataProvider: any[] = [];
  datagridpackagescc_id_dataProvider: any[] = [];
  datagridfrtscc_id_dataProvider: any[] = [];
  packageACCSCC: any;
  packageSCC: any;
  avgpackageFRTSCC: any;
  field10_packagecount_headerText: any;
  field11_packagecount_headerText: any;
  field12_packagecount_headerText: any;
  field10_avgfrt_headerText: any;
  field11_avgfrt_headerText: any;
  field12_avgfrt_headerText: any;
  showColumnPicker = false;
  field10_packagefrt_headerText: string = "";
  field11_packagefrt_headerText: string = "";
  field12_packagefrt_headerText: string = "";

  field1_accscc_headerText: string = "";
  field2_accscc_headerText: string = "";
  field3_accscc_headerText: string = "";
  field4_accscc_headerText: string = "";
  field5_accscc_headerText: string = "";
  field6_accscc_headerText: string = "";
  field7_accscc_headerText: string = "";
  field8_accscc_headerText: string = "";
  field9_accscc_headerText: string = "";
  field10_accscc_headerText: string = "";
  field11_accscc_headerText: string = "";
  field12_accscc_headerText: string = "";

  field1_packagescc_headerText: string = "";
  field2_packagescc_headerText: string = "";
  field3_packagescc_headerText: string = "";
  field4_packagescc_headerText: string = "";
  field5_packagescc_headerText: string = "";
  field6_packagescc_headerText: string = "";
  field7_packagescc_headerText: string = "";
  field8_packagescc_headerText: string = "";
  field9_packagescc_headerText: string = "";
  field10_packagescc_headerText: string = "";
  field11_packagescc_headerText: string = "";
  field12_packagescc_headerText: string = "";

  field10_frtacc_headerText: string = "";
  field11_frtacc_headerText: string = "";
  field12_frtacc_headerText: string = "";

  field1_frtscc_headerText: string = "";
  field2_frtscc_headerText: string = "";
  field3_frtscc_headerText: string = "";
  field4_frtscc_headerText: string = "";
  field5_frtscc_headerText: string = "";
  field6_frtscc_headerText: string = "";
  field7_frtscc_headerText: string = "";
  field8_frtscc_headerText: string = "";
  field9_frtscc_headerText: string = "";
  field10_frtscc_headerText: string = "";
  field11_frtscc_headerText: string = "";
  field12_frtscc_headerText: string = "";

  datagridaccscc_id_rowCount: number = 0;
  datagridpackagescc_id_rowCount: number = 0;
  datagridfrtscc_id_rowCount: number = 0;
  field13_avgfrt_headerText: string = "";
  field14_avgfrt_headerText: string = "";
  field13_packagecount_headerText: string = "";
  field14_packagecount_headerText: string = "";
  field15_packagecount_headerText: string = "";
  field16_packagecount_headerText: string = "";
  field17_packagecount_headerText: string = "";
  field18_packagecount_headerText: string = "";
  field19_packagecount_headerText: string = "";
  field20_packagecount_headerText: string = "";
  field21_packagecount_headerText: string = "";
  field22_packagecount_headerText: string = "";
  field23_packagecount_headerText: string = "";
  field24_packagecount_headerText: string = "";
  field25_packagecount_headerText: string = "";
  field26_packagecount_headerText: string = "";
  field27_packagecount_headerText: string = "";
  field28_packagecount_headerText: string = "";
  field29_packagecount_headerText: string = "";
  field30_packagecount_headerText: string = "";
  field31_packagecount_headerText: string = "";
  field32_packagecount_headerText: string = "";
  field33_packagecount_headerText: string = "";
  field34_packagecount_headerText: string = "";
  field35_packagecount_headerText: string = "";
  field13_frtscc_headerText: string = "";
  field14_frtscc_headerText: string = "";
  field15_frtscc_headerText: string = "";
  field16_frtscc_headerText: string = "";
  field17_frtscc_headerText: string = "";
  field18_frtscc_headerText: string = "";
  field19_frtscc_headerText: string = "";
  field20_frtscc_headerText: string = "";
  field21_frtscc_headerText: string = "";
  field22_frtscc_headerText: string = "";
  field23_frtscc_headerText: string = "";
  field24_frtscc_headerText: string = "";
  field25_frtscc_headerText: string = "";
  field26_frtscc_headerText: string = "";
  field27_frtscc_headerText: string = "";
  field28_frtscc_headerText: string = "";
  field29_frtscc_headerText: string = "";
  field30_frtscc_headerText: string = "";
  field31_frtscc_headerText: string = "";
  field32_frtscc_headerText: string = "";
  field33_frtscc_headerText: string = "";
  field34_frtscc_headerText: string = "";
  field35_frtscc_headerText: string = "";
  field36_frtscc_headerText: string = "";
  field37_frtscc_headerText: string = "";
  field38_frtscc_headerText: string = "";
  field39_frtscc_headerText: string = "";
  field40_frtscc_headerText: string = "";
  field41_frtscc_headerText: string = "";
  field42_frtscc_headerText: string = "";
  field43_frtscc_headerText: string = "";
  field44_frtscc_headerText: string = "";
  field45_frtscc_headerText: string = "";
  field46_frtscc_headerText: string = "";
  field47_frtscc_headerText: string = "";
  field48_frtscc_headerText: string = "";
  field49_frtscc_headerText: string = "";
  field50_frtscc_headerText: string = "";
  field51_frtscc_headerText: string = "";
  field52_frtscc_headerText: string = "";
  field53_frtscc_headerText: string = "";
  field54_frtscc_headerText: string = "";
  field55_frtscc_headerText: string = "";
  field56_frtscc_headerText: string = "";
  field57_frtscc_headerText: string = "";
  field58_frtscc_headerText: string = "";
  field59_frtscc_headerText: string = "";
  field60_frtscc_headerText: string = "";
  field61_frtscc_headerText: string = "";
  field13_frtacc_headerText: string = "";
  field14_frtacc_headerText: string = "";
  field15_frtacc_headerText: string = "";
  field16_frtacc_headerText: string = "";
  field17_frtacc_headerText: string = "";
  field18_frtacc_headerText: string = "";
  field19_frtacc_headerText: string = "";
  field20_frtacc_headerText: string = "";
  field21_frtacc_headerText: string = "";
  field22_frtacc_headerText: string = "";
  field23_frtacc_headerText: string = "";
  field24_frtacc_headerText: string = "";
  field25_frtacc_headerText: string = "";
  field26_frtacc_headerText: string = "";
  field27_frtacc_headerText: string = "";
  field28_frtacc_headerText: string = "";
  field29_frtacc_headerText: string = "";
  field30_frtacc_headerText: string = "";
  field31_frtacc_headerText: string = "";
  field32_frtacc_headerText: string = "";
  field33_frtacc_headerText: string = "";
  field34_frtacc_headerText: string = "";
  field35_frtacc_headerText: string = "";
  field36_frtacc_headerText: string = "";
  field37_frtacc_headerText: string = "";
  field38_frtacc_headerText: string = "";
  field39_frtacc_headerText: string = "";
  field40_frtacc_headerText: string = "";
  field41_frtacc_headerText: string = "";
  field42_frtacc_headerText: string = "";
  field43_frtacc_headerText: string = "";
  field44_frtacc_headerText: string = "";
  field45_frtacc_headerText: string = "";
  field46_frtacc_headerText: string = "";
  field47_frtacc_headerText: string = "";
  field48_frtacc_headerText: string = "";
  field49_frtacc_headerText: string = "";
  field50_frtacc_headerText: string = "";
  field51_frtacc_headerText: string = "";
  field52_frtacc_headerText: string = "";
  field53_frtacc_headerText: string = "";
  field54_frtacc_headerText: string = "";
  field55_frtacc_headerText: string = "";
  field56_frtacc_headerText: string = "";
  field57_frtacc_headerText: string = "";
  field58_frtacc_headerText: string = "";
  field59_frtacc_headerText: string = "";
  field60_frtacc_headerText: string = "";
  field61_frtacc_headerText: string = "";
  datagridfrtscc_id_columns: boolean[] = [];
  datagridaccscc_id_columns: boolean[] = [];
  datagridpackagescc_id_columns: boolean[] = [];
  field13_packagefrt_headerText: string = "";
  field14_packagefrt_headerText: string = "";
  field15_packagefrt_headerText: string = "";
  field16_packagefrt_headerText: string = "";
  field17_packagefrt_headerText: string = "";
  field13_accscc_headerText: string = "";
  field14_accscc_headerText: string = "";
  field15_accscc_headerText: string = "";
  field16_accscc_headerText: string = "";
  field17_accscc_headerText: string = "";
  field13_packagescc_headerText: string = "";
  field14_packagescc_headerText: string = "";
  field15_packagescc_headerText: string = "";
  field16_packagescc_headerText: string = "";
  field17_packagescc_headerText: string = "";
  field36_packagecount_headerText: string = "";
  field37_packagecount_headerText: string = "";
  field38_packagecount_headerText: string = "";
  field39_packagecount_headerText: string = "";
  field40_packagecount_headerText: string = "";
  field41_packagecount_headerText: string = "";
  field42_packagecount_headerText: string = "";
  field43_packagecount_headerText: string = "";
  field44_packagecount_headerText: string = "";
  field45_packagecount_headerText: string = "";
  field46_packagecount_headerText: string = "";
  field47_packagecount_headerText: string = "";
  field48_packagecount_headerText: string = "";
  field49_packagecount_headerText: string = "";
  field50_packagecount_headerText: string = "";
  field51_packagecount_headerText: string = "";
  field52_packagecount_headerText: string = "";
  field53_packagecount_headerText: string = "";
  field54_packagecount_headerText: string = "";
  field55_packagecount_headerText: string = "";
  field56_packagecount_headerText: string = "";
  field57_packagecount_headerText: string = "";
  field58_packagecount_headerText: string = "";
  field59_packagecount_headerText: string = "";
  field60_packagecount_headerText: string = "";
  field61_packagecount_headerText: string = "";
  vbfrtscc_id_visible: boolean = false;
  vbfrtscc_id_includeInLayout: boolean = false;

  vbaccscc_id_visible: boolean = false;
  vbaccscc_id_includeInLayout: boolean = false;

  vbpackagescc_id_visible: boolean = false;
  vbpackagescc_id_includeInLayout: boolean = false;

  field18_packagescc_headerText: string = "";
  field19_packagescc_headerText: string = "";
  field20_packagescc_headerText: string = "";
  field21_packagescc_headerText: string = "";
  field22_packagescc_headerText: string = "";
  field23_packagescc_headerText: string = "";
  field24_packagescc_headerText: string = "";
  field25_packagescc_headerText: string = "";
  field26_packagescc_headerText: string = "";
  field27_packagescc_headerText: string = "";
  field28_packagescc_headerText: string = "";
  field29_packagescc_headerText: string = "";
  field30_packagescc_headerText: string = "";
  field31_packagescc_headerText: string = "";
  field32_packagescc_headerText: string = "";
  field33_packagescc_headerText: string = "";
  field34_packagescc_headerText: string = "";
  field35_packagescc_headerText: string = "";
  field36_packagescc_headerText: string = "";
  field37_packagescc_headerText: string = "";
  field38_packagescc_headerText: string = "";
  field39_packagescc_headerText: string = "";
  field40_packagescc_headerText: string = "";
  field41_packagescc_headerText: string = "";
  field42_packagescc_headerText: string = "";
  field43_packagescc_headerText: string = "";
  field44_packagescc_headerText: string = "";

  field18_accscc_headerText: string = "";
  field19_accscc_headerText: string = "";
  field20_accscc_headerText: string = "";
  field21_accscc_headerText: string = "";
  field22_accscc_headerText: string = "";
  field23_accscc_headerText: string = "";
  field24_accscc_headerText: string = "";
  field25_accscc_headerText: string = "";
  field26_accscc_headerText: string = "";
  field27_accscc_headerText: string = "";
  field28_accscc_headerText: string = "";
  field29_accscc_headerText: string = "";
  field30_accscc_headerText: string = "";
  field31_accscc_headerText: string = "";
  field32_accscc_headerText: string = "";
  field33_accscc_headerText: string = "";
  field34_accscc_headerText: string = "";
  field35_accscc_headerText: string = "";
  field36_accscc_headerText: string = "";
  field37_accscc_headerText: string = "";
  field38_accscc_headerText: string = "";
  field39_accscc_headerText: string = "";
  field40_accscc_headerText: string = "";
  field41_accscc_headerText: string = "";
  field42_accscc_headerText: string = "";
  field43_accscc_headerText: string = "";
  field44_accscc_headerText: string = "";

  field18_packagefrt_headerText: string = "";
  field19_packagefrt_headerText: string = "";
  field20_packagefrt_headerText: string = "";
  field21_packagefrt_headerText: string = "";
  field22_packagefrt_headerText: string = "";
  field23_packagefrt_headerText: string = "";
  field24_packagefrt_headerText: string = "";
  field25_packagefrt_headerText: string = "";
  field26_packagefrt_headerText: string = "";
  field27_packagefrt_headerText: string = "";
  field28_packagefrt_headerText: string = "";
  field29_packagefrt_headerText: string = "";
  field30_packagefrt_headerText: string = "";
  field31_packagefrt_headerText: string = "";
  field32_packagefrt_headerText: string = "";
  field33_packagefrt_headerText: string = "";
  field34_packagefrt_headerText: string = "";
  field35_packagefrt_headerText: string = "";
  field36_packagefrt_headerText: string = "";
  field37_packagefrt_headerText: string = "";
  field38_packagefrt_headerText: string = "";
  field39_packagefrt_headerText: string = "";
  field40_packagefrt_headerText: string = "";
  field41_packagefrt_headerText: string = "";
  field42_packagefrt_headerText: string = "";
  field43_packagefrt_headerText: string = "";
  field44_packagefrt_headerText: string = "";

  field45_accscc_headerText: string = "";
  field46_accscc_headerText: string = "";
  field47_accscc_headerText: string = "";
  field48_accscc_headerText: string = "";
  field49_accscc_headerText: string = "";
  field50_accscc_headerText: string = "";
  field51_accscc_headerText: string = "";
  field52_accscc_headerText: string = "";
  field53_accscc_headerText: string = "";
  field54_accscc_headerText: string = "";
  field55_accscc_headerText: string = "";
  field56_accscc_headerText: string = "";
  field57_accscc_headerText: string = "";
  field58_accscc_headerText: string = "";
  field59_accscc_headerText: string = "";
  field60_accscc_headerText: string = "";
  field61_accscc_headerText: string = "";

  field45_packagefrt_headerText: string = "";
  field46_packagefrt_headerText: string = "";
  field47_packagefrt_headerText: string = "";
  field48_packagefrt_headerText: string = "";
  field49_packagefrt_headerText: string = "";
  field50_packagefrt_headerText: string = "";
  field51_packagefrt_headerText: string = "";
  field52_packagefrt_headerText: string = "";
  field53_packagefrt_headerText: string = "";
  field54_packagefrt_headerText: string = "";
  field55_packagefrt_headerText: string = "";
  field56_packagefrt_headerText: string = "";
  field57_packagefrt_headerText: string = "";
  field58_packagefrt_headerText: string = "";
  field59_packagefrt_headerText: string = "";
  field60_packagefrt_headerText: string = "";
  field61_packagefrt_headerText: string = "";

  field45_packagescc_headerText: string = "";
  field46_packagescc_headerText: string = "";
  field47_packagescc_headerText: string = "";
  field48_packagescc_headerText: string = "";
  field49_packagescc_headerText: string = "";
  field50_packagescc_headerText: string = "";
  field51_packagescc_headerText: string = "";
  field52_packagescc_headerText: string = "";
  field53_packagescc_headerText: string = "";
  field54_packagescc_headerText: string = "";
  field55_packagescc_headerText: string = "";
  field56_packagescc_headerText: string = "";
  field57_packagescc_headerText: string = "";
  field58_packagescc_headerText: string = "";
  field59_packagescc_headerText: string = "";
  field60_packagescc_headerText: string = "";
  field61_packagescc_headerText: string = "";


  datagridpackagecount_id_columns: any[] = [];
  datagridavgfrt_id_columns: any[] = [];
  datagridavgacc_id_columns: any[] = [];
  datagridpackagefrt_id_columns: any[] = [];
  datagridfrtacc_id_columns: any[] = [];
  vbpackage_id_visible: boolean = false;
  vbpackage_id_includeInLayout: boolean = false;
  vbavgfrt_id_visible: boolean = false;
  vbavgfrt_id_includeInLayout: boolean = false;
  vbavgacc_id_visible: boolean = false;
  vbavgacc_id_includeInLayout: boolean = false;
  vbpackagefrt_id_visible: boolean = false;
  vbpackagefrt_id_includeInLayout: boolean = false;
  vbfrtacc_id_visible: boolean = false;
  vbfrtacc_id_includeInLayout: boolean = false
  account_details: any[] = [];
  loginId = 123;
  avgFrtColumnIndexes: number[] = Array.from({ length: 61 }, (_, i) => i);
  packageCountColumnIndexes: number[] = Array.from({ length: 61 }, (_, i) => i);

  //Form Group
  apiControllerFormGroup!: FormGroup;
  reportsFormGroup!: FormGroup;

  // called from template: (scroll)="syncScroll($event, 'table')" / 'header'
  syncScroll(event: Event, source: 'table' | 'header') {
    if (this.syncing) return;
    this.syncing = true;

    const left = (event.target as HTMLElement).scrollLeft;

    if (source === 'table' && this.headerScroll?.nativeElement) {
      this.headerScroll.nativeElement.scrollLeft = left;
    } else if (source === 'header' && this.tableScroll?.nativeElement) {
      this.tableScroll.nativeElement.scrollLeft = left;
    }
    requestAnimationFrame(() => (this.syncing = false));
  }


  // called from template: (scroll)="syncScroll($event, 'table')" / 'header'
  syncScroll1(event: Event, source: 'table' | 'header') {
    if (this.syncing) return;
    this.syncing = true;

    const left = (event.target as HTMLElement).scrollLeft;

    if (source === 'table' && this.headerScroll?.nativeElement) {
      this.headerScroll.nativeElement.scrollLeft = left;
    } else if (source === 'header' && this.tableScroll?.nativeElement) {
      this.tableScroll.nativeElement.scrollLeft = left;
    }
    requestAnimationFrame(() => (this.syncing = false));
  }

  startDate: Date = new Date(2026, 0, 12); // Jan 12, 2026
  endDate: Date = new Date(2026, 0, 17);   // Jan 17, 2026

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
  constructor(private loaderService: LoaderService,
    private offcanvasService: NgbOffcanvas,
    private cookiesService: CookiesService,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private httpOntracService: HttpOntracService, private dialog: MatDialog,
    private cd: ChangeDetectorRef) {

    this.apiControllerFormGroup = new FormGroup({
      designFileName: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      clientId: new FormControl(''),
      reportType: new FormControl('ZONE_DISTRIBUTION_MODULE'),
      status: new FormControl(''),
      reportFormat: new FormControl('CVS'),
      moduleName: new FormControl(''),
      login_id: new FormControl(''),
      clientName: new FormControl(''),
      datetype: new FormControl('Invoice Date'),
      chargeDes: new FormControl('Invoice Date'),
      serviceType: new FormControl(''),
      reporttype: new FormControl(''),
      fzone: new FormControl(0),
      tzone: new FormControl(0),

      accNo: new FormControl(null),
      accountNumber: new FormControl(["ALL"]),
      t001ClientProfile: new FormGroup({
        action: new FormControl(''), activeFlag: new FormControl(''), address: new FormControl(''), asonDate: new FormControl(''), carrierType: new FormControl(''), changePassword: new FormControl(''),
        charges: new FormControl(''), clientId: new FormControl(''), clientName: new FormControl(''), clientPassword: new FormControl(''), clientdbstatus: new FormControl(''),
        comments: new FormControl(''), contactNo: new FormControl(''), contractanalysisstatus: new FormControl(''), createdBy: new FormControl(''),
        createdTs: new FormControl(''), currentDate: new FormControl(''), currentstatus: new FormControl(''), customertype: new FormControl(''), dataFileDestDir: new FormControl(''),
        dataFileSourceDir: new FormControl(''), dataLoadBy: new FormControl(''), dataSource: new FormControl(''), dataasof: new FormControl(''),
        daystoweb: new FormControl(''), email: new FormControl(''), employeeTempTotal: new FormControl(''), employerTempTotal: new FormControl(''), errorString: new FormControl(''),
        fetchPhoto: new FormControl(''), fileEndDate: new FormControl(''), fileStartDate: new FormControl(''), getImageInd: new FormControl(''), image: new FormControl(''),
        ipaddress: new FormControl(''), isSelected: new FormControl(''), isdeletedbyowner: new FormControl(''), lazyLoad: new FormControl(''), loginclientId: new FormControl(''),
        logostatus: new FormControl(''), menucount: new FormControl(''), newPassword: new FormControl(''), nextlevelflag: new FormControl(''), noofdaysinactive: new FormControl(''),
        noofdaystoactive: new FormControl(''), password: new FormControl(''), payInWords: new FormControl(''), repname: new FormControl(''), resetPassword: new FormControl(''), startDate: new FormControl(''),
        status: new FormControl(''), t301accountAC: new FormControl(''), t302planAC: new FormControl(''), tablename: new FormControl(''), trackingcount: new FormControl(''), updatedTs: new FormControl(''),
        updatedby: new FormControl(''), user_name: new FormControl(''), year: new FormControl('')
      }),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      })
    });

    this.reportsFormGroup = new FormGroup({
      reportLogId: new FormControl(''),
      t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
      t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
    });

  }

  ngOnInit(): void {
    this.initialDefault();
    this.openLoading();
    this.apiControllerFormGroup.patchValue({
      dateRange: { "start": new Date(this.fromDate), "end": new Date(this.toDate) }
    });
    this.getUser();
  }

  initialDefault() {
    this.randomNumber = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    this.currentDate = new Date();
    setTimeout(() => {
      this.searchActive = false;
    }, 15000);
    var toData = new Date();
    var Data = new Date();
    var fromData = new Date();
    fromData = new Date(fromData.setMonth(fromData.getMonth() - 1));
    this.fromDateFormat = this.datePipe.transform(fromData, "MMM dd,yyyy");
    this.toDateFormat = this.datePipe.transform(toData, "MMM dd,yyyy");

    var startdate = new Date();
    let getdate = this.datePipe.transform(startdate, 'yyyy,M,d');

    var dt = new Date(getdate?.toString() || '');
    var diff = dt.getDate() - dt.getDay() + (dt.getDay() === 0 ? -6 : 1);
    var startdateofweekTemp = new Date(dt.setDate(diff));
    dt = new Date(getdate?.toString() || '');
    var lastday = dt.getDate() - (dt.getDay() - 1) + 6;
    var EnddateofweekTemp = new Date(dt.setDate(lastday));
    const tempmonthStartDay = new Date(Number(startdateofweekTemp));
    tempmonthStartDay.setDate(startdateofweekTemp.getDate() - 14);
    const tempmonthEndDay = new Date(Number(EnddateofweekTemp));
    tempmonthEndDay.setDate(EnddateofweekTemp.getDate() - 15);
    /* Invoice Date range change to Week level End */

    //trackingDate
    this.toDate = this.datePipe.transform(tempmonthEndDay, "yyyy-MM-dd");
    this.fromDate = this.datePipe.transform(tempmonthStartDay, "yyyy-MM-dd");

    this.fromDateFormat = this.datePipe.transform(this.fromDate, "MMM dd,yyyy");
    this.toDateFormat = this.datePipe.transform(this.toDate, "MMM dd,yyyy");
    this.tempfromDate = tempmonthStartDay;
    this.temptoDate = tempmonthEndDay;
  }

  openLoading() {
    this.loaderService.show();
  }

  closeLoading() {
    this.loaderService.hide();
  }

  async getUser() {

    this.userProfifleData = await this.getuserProfile();
    this.userProfifle = this.userProfifleData[0];
    this.clientID = this.userProfifle.clientId;
    var clientname = this.userProfifle.clientName;
    this.clientName = clientname.replace(/\s/g, "");

    this.dataasof = this.userProfifle.dataasof;
    this.dataasofFormat = this.datePipe.transform(this.dataasof, "MMM dd,yyyy");
    const formattedDate = this.datePipe.transform(this.dataasof, 'MM/dd/yyyy');
    this.dataasoffFormat = formattedDate ? new Date(formattedDate) : null;
    await this.apiControllerFormGroup.get('datetype')?.setValue("Invoice Date");
    await this.apiControllerFormGroup.get('serviceType')?.setValue("RD");
    await this.apiControllerFormGroup.get('reporttype')?.setValue("All");
    await this.apiControllerFormGroup.get('clientId')?.setValue(this.clientID);
    await this.apiControllerFormGroup.get('fromDate')?.setValue(this.fromDate);
    await this.apiControllerFormGroup.get('toDate')?.setValue(this.toDate);

    await this.apiControllerFormGroup.get('reportType')?.setValue("ZONE_DISTRIBUTION_MODULE");
    await this.apiControllerFormGroup.get('status')?.setValue("IN QUEUE");
    await this.apiControllerFormGroup.get('reportFormat')?.setValue("CSV");
    await this.apiControllerFormGroup.get('moduleName')?.setValue("ZoneDistribution");
    await this.apiControllerFormGroup.get('clientName')?.setValue(this.clientName);

    await this.apiControllerFormGroup.patchValue({
      t001ClientProfile: {
        "action": this.userProfifle.action,
        "activeFlag": this.userProfifle.activeFlag,
        "address": this.userProfifle.address,
        "asonDate": this.userProfifle.asonDate,
        "carrierType": this.userProfifle.carrierType,
        "changePassword": this.userProfifle.changePassword,
        "charges": this.userProfifle.charges,
        "clientId": this.userProfifle.clientId,
        "clientName": this.userProfifle.clientName,
        "clientPassword": this.userProfifle.clientPassword,
        "clientdbstatus": this.userProfifle.clientdbstatus,
        "comments": this.userProfifle.comments,
        "contactNo": this.userProfifle.contactNo,
        "contractanalysisstatus": this.userProfifle.contractanalysisstatus,
        "createdBy": this.userProfifle.createdBy,
        "createdTs": this.userProfifle.createdTs,
        "currentDate": this.userProfifle.currentDate,
        "currentstatus": this.userProfifle.currentstatus,
        "customertype": this.userProfifle.customertype,
        "dataFileDestDir": this.userProfifle.dataFileDestDir,
        "dataFileSourceDir": this.userProfifle.dataFileSourceDir,
        "dataLoadBy": this.userProfifle.dataLoadBy,
        "dataSource": this.userProfifle.dataSource,
        "dataasof": this.userProfifle.dataasof,
        "daystoweb": this.userProfifle.daystoweb,
        "email": this.userProfifle.email,
        "employeeTempTotal": this.userProfifle.employeeTempTotal,
        "employerTempTotal": this.userProfifle.employerTempTotal,
        "errorString": this.userProfifle.errorString,
        "fetchPhoto": this.userProfifle.fetchPhoto,
        "fileEndDate": this.userProfifle.fileEndDate,
        "fileStartDate": this.userProfifle.fileStartDate,
        "getImageInd": this.userProfifle.getImageInd,
        "image": this.userProfifle.image,
        "ipaddress": this.userProfifle.ipaddress,
        "isSelected": this.userProfifle.isSelected,
        "isdeletedbyowner": this.userProfifle.isdeletedbyowner,
        "lazyLoad": this.userProfifle.lazyLoad,
        "loginclientId": this.userProfifle.loginclientId,
        "logostatus": this.userProfifle.logostatus,
        "menucount": this.userProfifle.menucount,
        "newPassword": this.userProfifle.newPassword,
        "nextlevelflag": this.userProfifle.nextlevelflag,
        "noofdaysinactive": this.userProfifle.noofdaysinactive,
        "noofdaystoactive": this.userProfifle.noofdaystoactive,
        "password": this.userProfifle.password,
        "payInWords": this.userProfifle.payInWords,
        "repname": this.userProfifle.repname,
        "resetPassword": this.userProfifle.resetPassword,
        "startDate": this.userProfifle.startDate,
        "status": this.userProfifle.status,
        "t301accountAC": this.userProfifle.t301accountAC,
        "t302planAC": this.userProfifle.t302planAC,
        "tablename": this.userProfifle.tablename,
        "trackingcount": this.userProfifle.trackingcount,
        "updatedTs": this.userProfifle.updatedTs,
        "updatedby": this.userProfifle.updatedby,
        "user_name": this.userProfifle.user_name,
        "year": this.userProfifle.year
      }
    });
    await this.fetchAccountDetails();
    await this.apiControllerFormGroup.get('upsClientId')?.setValue(this.clientID);
    await this.fetchzonedistribution();
    await this.apiControllerFormGroup.get('fromDate')?.setValue(new Date(this.tempfromDate));
    await this.apiControllerFormGroup.get('toDate')?.setValue(new Date(this.temptoDate));
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        return result;
      });
    return this.userProfifleVal;
  }

  async fetchAccountDetails() {
    try {
      const result = await firstValueFrom(
        this.httpOntracService.fetchaccountDetails(this.apiControllerFormGroup.value)
      );

      this.account_details = result.map((item: any) => {
        const nickName = item.nickName?.trim();
        return {
          ...item,
          nickName: !nickName
            ? item.accountNo
            : `${item.accountNo} - <span>${nickName}</span>`
        };
      });

      this.apiControllerFormGroup.patchValue({ accountNumber: ['ALL'] });
    } catch (error) {
      console.error('Error fetching UPS account details', error);
    }
  }

  async fetchzonedistribution() {
    const accNumberArr: string[] = this.apiControllerFormGroup.get('accountNumber')?.value ?? [];
    const containsAll = accNumberArr.some(val => val.includes('ALL'));

    // Normalize account number
    if (!accNumberArr || accNumberArr[0] === 'ALL' || accNumberArr[0] === 'null' || containsAll) {
      this.apiControllerFormGroup.patchValue({ accNo: null });
    } else {
      this.apiControllerFormGroup.patchValue({ accNo: accNumberArr.join('@') });
    }

    try {
      // Await observable with firstValueFrom
      const result = await firstValueFrom(
        this.httpOntracService.fetchZoneDistribution(this.apiControllerFormGroup.value)
      );
      this.summaryZoneDistributionObj = result[result.length - 1];
      this.resultZoneDistribution = result.slice(0, -1);
      this.zone_distribution(this.resultZoneDistribution);
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error fetching zone distribution UPS', error);
      this.zone_distribution([]); // Ensure UI structure is visible even on error
      this.closeLoading();
    }
  }

  async zone_distribution(zonedistributionAC: any) {

    this.serviceName = this.apiControllerFormGroup.get('serviceType')?.value;
    this.flag = 0;
    this.totalus_value = 0;
    this.zonePacagecount = [];
    this.zoneAveFRT = [];
    this.zoneAvgACC = [];
    this.zonePackageFRT = [];
    this.zoneFRTACC = [];
    this.zonedistributionAC = [];
    this.datagridpackagecount_id_dataProvider = [];
    this.datagridavgfrt_id_dataProvider = [];
    this.datagridavgacc_id_dataProvider = [];
    this.datagridpackagefrt_id_dataProvider = [];
    this.datagridfrtacc_id_dataProvider = [];
    if (zonedistributionAC == null || zonedistributionAC.length == 0) {
      this.datagridpackagecount_id_dataProvider = [];
      this.datagridavgfrt_id_dataProvider = [];
      this.datagridavgacc_id_dataProvider = [];
      this.datagridpackagefrt_id_dataProvider = [];
      this.datagridfrtacc_id_dataProvider = [];
      this.datagridpackagecount_id_rowCount = 1;
      this.datagridavgfrt_id_rowCount = 1;
      this.datagridavgacc_id_rowCount = 1;
      this.datagridpackagefrt_id_rowCount = 1;
      this.datagridfrtacc_id_rowCount = 1;
      this.idLoadingPanel_visible = false;
      this.openModal("No Record found");
    }
    this.packageflag = 0;
    for (var count = 0; count < zonedistributionAC.length; count++) {
      this.zoneDistributionObj = [];
      this.zoneDistributionObj = zonedistributionAC[count];

      if (this.zoneDistributionObj.field == "Total" && this.packageflag == 0) {
        this.datagridpackagecount_id_rowCount = count + 2;

        this.packagecount = this.zoneDistributionObj.field0;
      }
      if (this.zoneDistributionObj.field == "Total" && this.packageflag == 1) {
        this.datagridavgfrt_id_rowCount = (count - this.datagridpackagecount_id_rowCount) + 2;
        this.avgFRT = this.zoneDistributionObj.field0;
      }
      if (this.zoneDistributionObj.field == "Total" && this.packageflag == 2) {
        this.datagridavgacc_id_rowCount = (count - (this.datagridpackagecount_id_rowCount + this.datagridavgfrt_id_rowCount)) + 2;
        this.avgACC = this.zoneDistributionObj.field0;
      }
      if (this.zoneDistributionObj.field == "Total" && this.packageflag == 3) {
        this.datagridpackagefrt_id_rowCount = (count - (this.datagridpackagecount_id_rowCount + this.datagridavgfrt_id_rowCount + this.datagridavgacc_id_rowCount)) + 3;
        this.packageFRT = this.zoneDistributionObj.field0;
      }
      if (this.zoneDistributionObj.field == "Total" && this.packageflag == 4) {
        this.datagridfrtacc_id_rowCount = (count - (this.datagridpackagecount_id_rowCount + this.datagridavgfrt_id_rowCount + this.datagridavgacc_id_rowCount + this.datagridpackagefrt_id_rowCount)) + 4;
        this.packageFRTSCC = this.zoneDistributionObj.field0;
      }
      if (this.zoneDistributionObj.field == "Total")
        this.packageflag = this.packageflag + 1;
    }
    for (var count = 0; count < zonedistributionAC.length; count++) {
      this.zoneDistributionObj = zonedistributionAC[count];
      if (this.flag == 0) {
        if (this.zoneDistributionObj.field != "Total") {
          var packagecountper = this.roundValue(Number((this.zoneDistributionObj.field0 / this.packagecount) * 100));
          if (packagecountper || packagecountper == 0) {
            this.zoneDistributionObj.zonepercentage = packagecountper;
          }
        }
        else {
          packagecountper = 0;
          this.zoneDistributionObj.zonepercentage = packagecountper;
        }
        this.zonePacagecount.push(this.zoneDistributionObj);
      }
      if (this.zoneDistributionObj.field == "Total") {
        if (this.totalus_value == 0) {
          this.defaultOption = {
            field: "%", field0: this.roundValue(Number((this.zoneDistributionObj.field0 / this.zoneDistributionObj.field0) * 100)), field1: this.roundValue(Number((this.zoneDistributionObj.field1 / this.zoneDistributionObj.field0) * 100)),
            field2: this.roundValue(Number((this.zoneDistributionObj.field2 / this.zoneDistributionObj.field0) * 100)), field3: this.roundValue(Number((this.zoneDistributionObj.field3 / this.zoneDistributionObj.field0) * 100)),
            field4: this.roundValue(Number((this.zoneDistributionObj.field4 / this.zoneDistributionObj.field0) * 100)), field5: this.roundValue(Number((this.zoneDistributionObj.field5 / this.zoneDistributionObj.field0) * 100)),
            field6: this.roundValue(Number((this.zoneDistributionObj.field6 / this.zoneDistributionObj.field0) * 100)), field7: this.roundValue(Number((this.zoneDistributionObj.field7 / this.zoneDistributionObj.field0) * 100)),
            field8: this.roundValue(Number((this.zoneDistributionObj.field8 / this.zoneDistributionObj.field0) * 100)), field9: this.roundValue(Number((this.zoneDistributionObj.field9 / this.zoneDistributionObj.field0) * 100)),
            field10: this.roundValue(Number((this.zoneDistributionObj.field10 / this.zoneDistributionObj.field0) * 100)), field11: this.roundValue(Number((this.zoneDistributionObj.field11 / this.zoneDistributionObj.field0) * 100)),
            field12: this.roundValue(Number((this.zoneDistributionObj.field12 / this.zoneDistributionObj.field0) * 100)), field13: this.roundValue(Number((this.zoneDistributionObj.field13 / this.zoneDistributionObj.field0) * 100)),
            field14: this.roundValue(Number((this.zoneDistributionObj.field14 / this.zoneDistributionObj.field0) * 100)), field15: this.roundValue(Number((this.zoneDistributionObj.field15 / this.zoneDistributionObj.field0) * 100)),
            field16: this.roundValue(Number((this.zoneDistributionObj.field16 / this.zoneDistributionObj.field0) * 100)), field17: this.roundValue(Number((this.zoneDistributionObj.field17 / this.zoneDistributionObj.field0) * 100)),
            field18: this.roundValue(Number((this.zoneDistributionObj.field18 / this.zoneDistributionObj.field0) * 100)), field19: this.roundValue(Number((this.zoneDistributionObj.field19 / this.zoneDistributionObj.field0) * 100)),
            field20: this.roundValue(Number((this.zoneDistributionObj.field20 / this.zoneDistributionObj.field0) * 100)), field21: this.roundValue(Number((this.zoneDistributionObj.field21 / this.zoneDistributionObj.field0) * 100)),
            field22: this.roundValue(Number((this.zoneDistributionObj.field22 / this.zoneDistributionObj.field0) * 100)), field23: this.roundValue(Number((this.zoneDistributionObj.field23 / this.zoneDistributionObj.field0) * 100)),
            field24: this.roundValue(Number((this.zoneDistributionObj.field24 / this.zoneDistributionObj.field0) * 100)), field25: this.roundValue(Number((this.zoneDistributionObj.field25 / this.zoneDistributionObj.field0) * 100)),
            field26: this.roundValue(Number((this.zoneDistributionObj.field26 / this.zoneDistributionObj.field0) * 100)), field27: this.roundValue(Number((this.zoneDistributionObj.field27 / this.zoneDistributionObj.field0) * 100)),
            field28: this.roundValue(Number((this.zoneDistributionObj.field28 / this.zoneDistributionObj.field0) * 100)), field29: this.roundValue(Number((this.zoneDistributionObj.field29 / this.zoneDistributionObj.field0) * 100)),
            field30: this.roundValue(Number((this.zoneDistributionObj.field30 / this.zoneDistributionObj.field0) * 100)), field31: this.roundValue(Number((this.zoneDistributionObj.field31 / this.zoneDistributionObj.field0) * 100)),
            field32: this.roundValue(Number((this.zoneDistributionObj.field32 / this.zoneDistributionObj.field0) * 100)), field33: this.roundValue(Number((this.zoneDistributionObj.field33 / this.zoneDistributionObj.field0) * 100)),
            field34: this.roundValue(Number((this.zoneDistributionObj.field34 / this.zoneDistributionObj.field0) * 100)), field35: this.roundValue(Number((this.zoneDistributionObj.field35 / this.zoneDistributionObj.field0) * 100)),
            field36: this.roundValue(Number((this.zoneDistributionObj.field36 / this.zoneDistributionObj.field0) * 100)), field37: this.roundValue(Number((this.zoneDistributionObj.field37 / this.zoneDistributionObj.field0) * 100)),
            field38: this.roundValue(Number((this.zoneDistributionObj.field38 / this.zoneDistributionObj.field0) * 100)), field39: this.roundValue(Number((this.zoneDistributionObj.field39 / this.zoneDistributionObj.field0) * 100)),
            field40: this.roundValue(Number((this.zoneDistributionObj.field40 / this.zoneDistributionObj.field0) * 100)), field41: this.roundValue(Number((this.zoneDistributionObj.field41 / this.zoneDistributionObj.field0) * 100)),
            field42: this.roundValue(Number((this.zoneDistributionObj.field42 / this.zoneDistributionObj.field0) * 100)), field43: this.roundValue(Number((this.zoneDistributionObj.field43 / this.zoneDistributionObj.field0) * 100)),
            field44: this.roundValue(Number((this.zoneDistributionObj.field44 / this.zoneDistributionObj.field0) * 100)), field45: this.roundValue(Number((this.zoneDistributionObj.field45 / this.zoneDistributionObj.field0) * 100)),
            field46: this.roundValue(Number((this.zoneDistributionObj.field46 / this.zoneDistributionObj.field0) * 100)), field47: this.roundValue(Number((this.zoneDistributionObj.field47 / this.zoneDistributionObj.field0) * 100)),
            field48: this.roundValue(Number((this.zoneDistributionObj.field48 / this.zoneDistributionObj.field0) * 100)), field49: this.roundValue(Number((this.zoneDistributionObj.field49 / this.zoneDistributionObj.field0) * 100)),
            field50: this.roundValue(Number((this.zoneDistributionObj.field50 / this.zoneDistributionObj.field0) * 100)), field51: this.roundValue(Number((this.zoneDistributionObj.field51 / this.zoneDistributionObj.field0) * 100)),
            field52: this.roundValue(Number((this.zoneDistributionObj.field52 / this.zoneDistributionObj.field0) * 100)), field53: this.roundValue(Number((this.zoneDistributionObj.field53 / this.zoneDistributionObj.field0) * 100)),
            field54: this.roundValue(Number((this.zoneDistributionObj.field54 / this.zoneDistributionObj.field0) * 100)), field55: this.roundValue(Number((this.zoneDistributionObj.field55 / this.zoneDistributionObj.field0) * 100)),
            field56: this.roundValue(Number((this.zoneDistributionObj.field56 / this.zoneDistributionObj.field0) * 100)), field57: this.roundValue(Number((this.zoneDistributionObj.field57 / this.zoneDistributionObj.field0) * 100)),
            field58: this.roundValue(Number((this.zoneDistributionObj.field58 / this.zoneDistributionObj.field0) * 100)), field59: this.roundValue(Number((this.zoneDistributionObj.field59 / this.zoneDistributionObj.field0) * 100))
          };
          this.zonePacagecount.push(this.defaultOption);
        }
        if (this.totalus_value == 3) {
          this.defaultOption = {
            field: "%", field0: this.roundValue(Number((this.zoneDistributionObj.field0 / this.zoneDistributionObj.field0) * 100)), field1: this.roundValue(Number((this.zoneDistributionObj.field1 / this.zoneDistributionObj.field0) * 100)),
            field2: this.roundValue(Number((this.zoneDistributionObj.field2 / this.zoneDistributionObj.field0) * 100)), field3: this.roundValue(Number((this.zoneDistributionObj.field3 / this.zoneDistributionObj.field0) * 100)),
            field4: this.roundValue(Number((this.zoneDistributionObj.field4 / this.zoneDistributionObj.field0) * 100)), field5: this.roundValue(Number((this.zoneDistributionObj.field5 / this.zoneDistributionObj.field0) * 100)),
            field6: this.roundValue(Number((this.zoneDistributionObj.field6 / this.zoneDistributionObj.field0) * 100)), field7: this.roundValue(Number((this.zoneDistributionObj.field7 / this.zoneDistributionObj.field0) * 100)),
            field8: this.roundValue(Number((this.zoneDistributionObj.field8 / this.zoneDistributionObj.field0) * 100)), field9: this.roundValue(Number((this.zoneDistributionObj.field9 / this.zoneDistributionObj.field0) * 100)),
            field10: this.roundValue(Number((this.zoneDistributionObj.field10 / this.zoneDistributionObj.field0) * 100)), field11: this.roundValue(Number((this.zoneDistributionObj.field11 / this.zoneDistributionObj.field0) * 100)),
            field12: this.roundValue(Number((this.zoneDistributionObj.field12 / this.zoneDistributionObj.field0) * 100)), field13: this.roundValue(Number((this.zoneDistributionObj.field13 / this.zoneDistributionObj.field0) * 100)),
            field14: this.roundValue(Number((this.zoneDistributionObj.field14 / this.zoneDistributionObj.field0) * 100)), field15: this.roundValue(Number((this.zoneDistributionObj.field15 / this.zoneDistributionObj.field0) * 100)),
            field16: this.roundValue(Number((this.zoneDistributionObj.field16 / this.zoneDistributionObj.field0) * 100)), field17: this.roundValue(Number((this.zoneDistributionObj.field17 / this.zoneDistributionObj.field0) * 100)),
            field18: this.roundValue(Number((this.zoneDistributionObj.field18 / this.zoneDistributionObj.field0) * 100)), field19: this.roundValue(Number((this.zoneDistributionObj.field19 / this.zoneDistributionObj.field0) * 100)),
            field20: this.roundValue(Number((this.zoneDistributionObj.field20 / this.zoneDistributionObj.field0) * 100)), field21: this.roundValue(Number((this.zoneDistributionObj.field21 / this.zoneDistributionObj.field0) * 100)),
            field22: this.roundValue(Number((this.zoneDistributionObj.field22 / this.zoneDistributionObj.field0) * 100)), field23: this.roundValue(Number((this.zoneDistributionObj.field23 / this.zoneDistributionObj.field0) * 100)),
            field24: this.roundValue(Number((this.zoneDistributionObj.field24 / this.zoneDistributionObj.field0) * 100)), field25: this.roundValue(Number((this.zoneDistributionObj.field25 / this.zoneDistributionObj.field0) * 100)),
            field26: this.roundValue(Number((this.zoneDistributionObj.field26 / this.zoneDistributionObj.field0) * 100)), field27: this.roundValue(Number((this.zoneDistributionObj.field27 / this.zoneDistributionObj.field0) * 100)),
            field28: this.roundValue(Number((this.zoneDistributionObj.field28 / this.zoneDistributionObj.field0) * 100)), field29: this.roundValue(Number((this.zoneDistributionObj.field29 / this.zoneDistributionObj.field0) * 100)),
            field30: this.roundValue(Number((this.zoneDistributionObj.field30 / this.zoneDistributionObj.field0) * 100)), field31: this.roundValue(Number((this.zoneDistributionObj.field31 / this.zoneDistributionObj.field0) * 100)),
            field32: this.roundValue(Number((this.zoneDistributionObj.field32 / this.zoneDistributionObj.field0) * 100)), field33: this.roundValue(Number((this.zoneDistributionObj.field33 / this.zoneDistributionObj.field0) * 100)),
            field34: this.roundValue(Number((this.zoneDistributionObj.field34 / this.zoneDistributionObj.field0) * 100)), field35: this.roundValue(Number((this.zoneDistributionObj.field35 / this.zoneDistributionObj.field0) * 100)),
            field36: this.roundValue(Number((this.zoneDistributionObj.field36 / this.zoneDistributionObj.field0) * 100)), field37: this.roundValue(Number((this.zoneDistributionObj.field37 / this.zoneDistributionObj.field0) * 100)),
            field38: this.roundValue(Number((this.zoneDistributionObj.field38 / this.zoneDistributionObj.field0) * 100)), field39: this.roundValue(Number((this.zoneDistributionObj.field39 / this.zoneDistributionObj.field0) * 100)),
            field40: this.roundValue(Number((this.zoneDistributionObj.field40 / this.zoneDistributionObj.field0) * 100)), field41: this.roundValue(Number((this.zoneDistributionObj.field41 / this.zoneDistributionObj.field0) * 100)),
            field42: this.roundValue(Number((this.zoneDistributionObj.field42 / this.zoneDistributionObj.field0) * 100)), field43: this.roundValue(Number((this.zoneDistributionObj.field43 / this.zoneDistributionObj.field0) * 100)),
            field44: this.roundValue(Number((this.zoneDistributionObj.field44 / this.zoneDistributionObj.field0) * 100)), field45: this.roundValue(Number((this.zoneDistributionObj.field45 / this.zoneDistributionObj.field0) * 100)),
            field46: this.roundValue(Number((this.zoneDistributionObj.field46 / this.zoneDistributionObj.field0) * 100)), field47: this.roundValue(Number((this.zoneDistributionObj.field47 / this.zoneDistributionObj.field0) * 100)),
            field48: this.roundValue(Number((this.zoneDistributionObj.field48 / this.zoneDistributionObj.field0) * 100)), field49: this.roundValue(Number((this.zoneDistributionObj.field49 / this.zoneDistributionObj.field0) * 100)),
            field50: this.roundValue(Number((this.zoneDistributionObj.field50 / this.zoneDistributionObj.field0) * 100)), field51: this.roundValue(Number((this.zoneDistributionObj.field51 / this.zoneDistributionObj.field0) * 100)),
            field52: this.roundValue(Number((this.zoneDistributionObj.field52 / this.zoneDistributionObj.field0) * 100)), field53: this.roundValue(Number((this.zoneDistributionObj.field53 / this.zoneDistributionObj.field0) * 100)),
            field54: this.roundValue(Number((this.zoneDistributionObj.field54 / this.zoneDistributionObj.field0) * 100)), field55: this.roundValue(Number((this.zoneDistributionObj.field55 / this.zoneDistributionObj.field0) * 100)),
            field56: this.roundValue(Number((this.zoneDistributionObj.field56 / this.zoneDistributionObj.field0) * 100)), field57: this.roundValue(Number((this.zoneDistributionObj.field57 / this.zoneDistributionObj.field0) * 100)),
            field58: this.roundValue(Number((this.zoneDistributionObj.field58 / this.zoneDistributionObj.field0) * 100)), field59: this.roundValue(Number((this.zoneDistributionObj.field59 / this.zoneDistributionObj.field0) * 100))
          };
          this.zonePackageFRT.push(this.defaultOption);


          var lastEleCnt = this.zonePackageFRT.length - 1;

        }
        if (this.totalus_value == 4) {
          this.defaultOption = {
            field: "%", field0: this.roundValue(Number((this.zoneDistributionObj.field0 / this.zoneDistributionObj.field0) * 100)), field1: this.roundValue(Number((this.zoneDistributionObj.field1 / this.zoneDistributionObj.field0) * 100)),
            field2: this.roundValue(Number((this.zoneDistributionObj.field2 / this.zoneDistributionObj.field0) * 100)), field3: this.roundValue(Number((this.zoneDistributionObj.field3 / this.zoneDistributionObj.field0) * 100)),
            field4: this.roundValue(Number((this.zoneDistributionObj.field4 / this.zoneDistributionObj.field0) * 100)), field5: this.roundValue(Number((this.zoneDistributionObj.field5 / this.zoneDistributionObj.field0) * 100)),
            field6: this.roundValue(Number((this.zoneDistributionObj.field6 / this.zoneDistributionObj.field0) * 100)), field7: this.roundValue(Number((this.zoneDistributionObj.field7 / this.zoneDistributionObj.field0) * 100)),
            field8: this.roundValue(Number((this.zoneDistributionObj.field8 / this.zoneDistributionObj.field0) * 100)), field9: this.roundValue(Number((this.zoneDistributionObj.field9 / this.zoneDistributionObj.field0) * 100)),
            field10: this.roundValue(Number((this.zoneDistributionObj.field10 / this.zoneDistributionObj.field0) * 100)), field11: this.roundValue(Number((this.zoneDistributionObj.field11 / this.zoneDistributionObj.field0) * 100)),
            field12: this.roundValue(Number((this.zoneDistributionObj.field12 / this.zoneDistributionObj.field0) * 100)), field13: this.roundValue(Number((this.zoneDistributionObj.field13 / this.zoneDistributionObj.field0) * 100)),
            field14: this.roundValue(Number((this.zoneDistributionObj.field14 / this.zoneDistributionObj.field0) * 100)), field15: this.roundValue(Number((this.zoneDistributionObj.field15 / this.zoneDistributionObj.field0) * 100)),
            field16: this.roundValue(Number((this.zoneDistributionObj.field16 / this.zoneDistributionObj.field0) * 100)), field17: this.roundValue(Number((this.zoneDistributionObj.field17 / this.zoneDistributionObj.field0) * 100)),
            field18: this.roundValue(Number((this.zoneDistributionObj.field18 / this.zoneDistributionObj.field0) * 100)), field19: this.roundValue(Number((this.zoneDistributionObj.field19 / this.zoneDistributionObj.field0) * 100)),
            field20: this.roundValue(Number((this.zoneDistributionObj.field20 / this.zoneDistributionObj.field0) * 100)), field21: this.roundValue(Number((this.zoneDistributionObj.field21 / this.zoneDistributionObj.field0) * 100)),
            field22: this.roundValue(Number((this.zoneDistributionObj.field22 / this.zoneDistributionObj.field0) * 100)), field23: this.roundValue(Number((this.zoneDistributionObj.field23 / this.zoneDistributionObj.field0) * 100)),
            field24: this.roundValue(Number((this.zoneDistributionObj.field24 / this.zoneDistributionObj.field0) * 100)), field25: this.roundValue(Number((this.zoneDistributionObj.field25 / this.zoneDistributionObj.field0) * 100)),
            field26: this.roundValue(Number((this.zoneDistributionObj.field26 / this.zoneDistributionObj.field0) * 100)), field27: this.roundValue(Number((this.zoneDistributionObj.field27 / this.zoneDistributionObj.field0) * 100)),
            field28: this.roundValue(Number((this.zoneDistributionObj.field28 / this.zoneDistributionObj.field0) * 100)), field29: this.roundValue(Number((this.zoneDistributionObj.field29 / this.zoneDistributionObj.field0) * 100)),
            field30: this.roundValue(Number((this.zoneDistributionObj.field30 / this.zoneDistributionObj.field0) * 100)), field31: this.roundValue(Number((this.zoneDistributionObj.field31 / this.zoneDistributionObj.field0) * 100)),
            field32: this.roundValue(Number((this.zoneDistributionObj.field32 / this.zoneDistributionObj.field0) * 100)), field33: this.roundValue(Number((this.zoneDistributionObj.field33 / this.zoneDistributionObj.field0) * 100)),
            field34: this.roundValue(Number((this.zoneDistributionObj.field34 / this.zoneDistributionObj.field0) * 100)), field35: this.roundValue(Number((this.zoneDistributionObj.field35 / this.zoneDistributionObj.field0) * 100)),
            field36: this.roundValue(Number((this.zoneDistributionObj.field36 / this.zoneDistributionObj.field0) * 100)), field37: this.roundValue(Number((this.zoneDistributionObj.field37 / this.zoneDistributionObj.field0) * 100)),
            field38: this.roundValue(Number((this.zoneDistributionObj.field38 / this.zoneDistributionObj.field0) * 100)), field39: this.roundValue(Number((this.zoneDistributionObj.field39 / this.zoneDistributionObj.field0) * 100)),
            field40: this.roundValue(Number((this.zoneDistributionObj.field40 / this.zoneDistributionObj.field0) * 100)), field41: this.roundValue(Number((this.zoneDistributionObj.field41 / this.zoneDistributionObj.field0) * 100)),
            field42: this.roundValue(Number((this.zoneDistributionObj.field42 / this.zoneDistributionObj.field0) * 100)), field43: this.roundValue(Number((this.zoneDistributionObj.field43 / this.zoneDistributionObj.field0) * 100)),
            field44: this.roundValue(Number((this.zoneDistributionObj.field44 / this.zoneDistributionObj.field0) * 100)), field45: this.roundValue(Number((this.zoneDistributionObj.field45 / this.zoneDistributionObj.field0) * 100)),
            field46: this.roundValue(Number((this.zoneDistributionObj.field46 / this.zoneDistributionObj.field0) * 100)), field47: this.roundValue(Number((this.zoneDistributionObj.field47 / this.zoneDistributionObj.field0) * 100)),
            field48: this.roundValue(Number((this.zoneDistributionObj.field48 / this.zoneDistributionObj.field0) * 100)), field49: this.roundValue(Number((this.zoneDistributionObj.field49 / this.zoneDistributionObj.field0) * 100)),
            field50: this.roundValue(Number((this.zoneDistributionObj.field50 / this.zoneDistributionObj.field0) * 100)), field51: this.roundValue(Number((this.zoneDistributionObj.field51 / this.zoneDistributionObj.field0) * 100)),
            field52: this.roundValue(Number((this.zoneDistributionObj.field52 / this.zoneDistributionObj.field0) * 100)), field53: this.roundValue(Number((this.zoneDistributionObj.field53 / this.zoneDistributionObj.field0) * 100)),
            field54: this.roundValue(Number((this.zoneDistributionObj.field54 / this.zoneDistributionObj.field0) * 100)), field55: this.roundValue(Number((this.zoneDistributionObj.field55 / this.zoneDistributionObj.field0) * 100)),
            field56: this.roundValue(Number((this.zoneDistributionObj.field56 / this.zoneDistributionObj.field0) * 100)), field57: this.roundValue(Number((this.zoneDistributionObj.field57 / this.zoneDistributionObj.field0) * 100)),
            field58: this.roundValue(Number((this.zoneDistributionObj.field58 / this.zoneDistributionObj.field0) * 100)), field59: this.roundValue(Number((this.zoneDistributionObj.field59 / this.zoneDistributionObj.field0) * 100))
          };
          this.zoneFRTACC.push(this.defaultOption);
        }
        this.flag = this.flag + 1;
      }
      if (this.flag == 1) {
        this.totalus_value = 1;
        this.zoneDistributionObj = [];
        this.zoneDistributionObj = zonedistributionAC[count + 1];
        if (this.avgFRT == 0 || this.zoneDistributionObj.field != "Total") {
          var packagecountper = 0;
        }
        else {
          var packagecountper = Number((this.zoneDistributionObj.field0 / this.avgFRT) * 100);
        }
        if (packagecountper || packagecountper == 0) {
          this.zoneDistributionObj.zonepercentage = packagecountper;
        }
        this.zoneAveFRT.push(this.zoneDistributionObj);
      }
      if (this.flag == 2) {
        this.totalus_value = 2;
        this.zoneDistributionObj = zonedistributionAC[count + 1];
        if (this.avgACC == 0 || this.zoneDistributionObj.field == "Total") {
          var packagecountper = 0;
        }
        else {
          var packagecountper = Number((this.zoneDistributionObj.field0 / this.avgACC) * 100);
        }
        if (packagecountper || packagecountper == 0) {
          this.zoneDistributionObj.zonepercentage = packagecountper;
        }
        this.zoneAvgACC.push(this.zoneDistributionObj);
      }
      if (this.flag == 3) {
        this.totalus_value = 3;
        this.zoneDistributionObj = zonedistributionAC[count + 1];
        if (this.packageFRT == 0 || this.zoneDistributionObj.field != "Total") {

          var packagecountper = Number((this.zoneDistributionObj.field0 / this.packageFRT) * 100);
          if (packagecountper || packagecountper == 0) {
            this.zoneDistributionObj.zonepercentage = packagecountper;
          } else {
            packagecountper = 0;
            this.zoneDistributionObj.zonepercentage = packagecountper;
          }
        } else {
          packagecountper = 0;
          this.zoneDistributionObj.zonepercentage = packagecountper;
        }
        this.zonePackageFRT.push(this.zoneDistributionObj);

      }
      if (this.flag == 4) {
        this.totalus_value = 4;
        this.zoneDistributionObj = zonedistributionAC[count + 1];

        if (this.packageFRTSCC == 0 || this.zoneDistributionObj.field != "Total") {
          var packagecountper = Number((this.zoneDistributionObj.field0 / this.packageFRTSCC) * 100);
          if (packagecountper || packagecountper == 0) {
            this.zoneDistributionObj.zonepercentage = packagecountper;
          } else {
            packagecountper = 0;
            this.zoneDistributionObj.zonepercentage = packagecountper;
          }

        } else {
          packagecountper = 0;
          this.zoneDistributionObj.zonepercentage = packagecountper;
        }
        this.zoneFRTACC.push(this.zoneDistributionObj);
      }
    }

    if (this.apiControllerFormGroup.get('serviceType')?.value == "") {
      this.cmb_service_selectedLabel = "RD";

    } else {
      this.cmb_service_selectedLabel = this.apiControllerFormGroup.get('serviceType')?.value;
    }

    if (this.cmb_service_selectedLabel == "RD") {
      this.packagelbl_id_text = "Package Count";
      this.field1_packagecount_headerText = "Weight";
      this.field2_packagecount_headerText = "Total";
      this.field3_packagecount_headerText = "2";
      this.field4_packagecount_headerText = "3";
      this.field5_packagecount_headerText = "4";
      this.field6_packagecount_headerText = "5";
      this.field7_packagecount_headerText = "6";
      this.field8_packagecount_headerText = "7";
      this.field9_packagecount_headerText = "8";
      this.field1_avgfrt_headerText = "Weight";
      this.field2_avgfrt_headerText = "Total";
      this.field3_avgfrt_headerText = "2";
      this.field4_avgfrt_headerText = "3";
      this.field5_avgfrt_headerText = "4";
      this.field6_avgfrt_headerText = "5";
      this.field7_avgfrt_headerText = "6";
      this.field8_avgfrt_headerText = "7";
      this.field9_avgfrt_headerText = "8";
      this.field1_avgacc_headerText = "Weight";
      this.field2_avgacc_headerText = "Total";
      this.field3_avgacc_headerText = "2";
      this.field4_avgacc_headerText = "3";
      this.field5_avgacc_headerText = "4";
      this.field6_avgacc_headerText = "5";
      this.field7_avgacc_headerText = "6";
      this.field8_avgacc_headerText = "7";
      this.field9_avgacc_headerText = "8";
      this.field1_packagefrt_headerText = "Weight";
      this.field2_packagefrt_headerText = "Total";
      this.field3_packagefrt_headerText = "2";
      this.field4_packagefrt_headerText = "3";
      this.field5_packagefrt_headerText = "4";
      this.field6_packagefrt_headerText = "5";
      this.field7_packagefrt_headerText = "6";
      this.field8_packagefrt_headerText = "7";
      this.field9_packagefrt_headerText = "8";
      this.field1_frtacc_headerText = "Weight";
      this.field2_frtacc_headerText = "Total";
      this.field3_frtacc_headerText = "2";
      this.field4_frtacc_headerText = "3";
      this.field5_frtacc_headerText = "4";
      this.field6_frtacc_headerText = "5";
      this.field7_frtacc_headerText = "6";
      this.field8_frtacc_headerText = "7";
      this.field9_frtacc_headerText = "8";
      for (var count = 0; count < 9; count++) {
        this.datagridpackagecount_id_columns[count] = true;
        this.datagridavgfrt_id_columns[count] = true;
        this.datagridavgacc_id_columns[count] = true;
        this.datagridpackagefrt_id_columns[count] = true;
        this.datagridfrtacc_id_columns[count] = true;
      }
      for (var count = 9; count < 61; count++) {
        this.datagridpackagecount_id_columns[count] = false;
        this.datagridavgfrt_id_columns[count] = false;
        this.datagridavgacc_id_columns[count] = false;
        this.datagridpackagefrt_id_columns[count] = false;
        this.datagridfrtacc_id_columns[count] = false;
      }

    }

    if (this.apiControllerFormGroup.get('reporttype')?.value == "Package Count Report") {
      this.vbpackage_id_visible = true;
      this.vbpackage_id_includeInLayout = true;
      this.vbavgfrt_id_visible = false;
      this.vbavgfrt_id_includeInLayout = false;
      this.vbavgacc_id_visible = false;
      this.vbavgacc_id_includeInLayout = false;
      this.vbpackagefrt_id_visible = false;
      this.vbpackagefrt_id_includeInLayout = false;
      this.vbfrtacc_id_visible = false;
      this.vbfrtacc_id_includeInLayout = false;

    }
    else if (this.apiControllerFormGroup.get('reporttype')?.value == "Average Package Cost Report (Service Charges)") {
      this.vbpackage_id_visible = false;
      this.vbpackage_id_includeInLayout = false;
      this.vbavgfrt_id_visible = true;
      this.vbavgfrt_id_includeInLayout = true;
      this.vbavgacc_id_visible = false;
      this.vbavgacc_id_includeInLayout = false;
      this.vbpackagefrt_id_visible = false;
      this.vbpackagefrt_id_includeInLayout = false;
      this.vbfrtacc_id_visible = false;
      this.vbfrtacc_id_includeInLayout = false;
    }
    else if (this.apiControllerFormGroup.get('reporttype')?.value == "Average Package Cost Report (Total Charges)") {
      this.vbpackage_id_visible = false;
      this.vbpackage_id_includeInLayout = false;
      this.vbavgfrt_id_visible = false;
      this.vbavgfrt_id_includeInLayout = false;
      this.vbavgacc_id_visible = true;
      this.vbavgacc_id_includeInLayout = true;
      this.vbpackagefrt_id_visible = false;
      this.vbpackagefrt_id_includeInLayout = false;
      this.vbfrtacc_id_visible = false;
      this.vbfrtacc_id_includeInLayout = false;
    }
    else if (this.apiControllerFormGroup.get('reporttype')?.value == "Total Service Charges") {
      this.vbpackage_id_visible = false;
      this.vbpackage_id_includeInLayout = false;
      this.vbavgfrt_id_visible = false;
      this.vbavgfrt_id_includeInLayout = false;
      this.vbavgacc_id_visible = false;
      this.vbavgacc_id_includeInLayout = false;
      this.vbpackagefrt_id_visible = true;
      this.vbpackagefrt_id_includeInLayout = true;
      this.vbfrtacc_id_visible = false;
      this.vbfrtacc_id_includeInLayout = false;
    }
    else if (this.apiControllerFormGroup.get('reporttype')?.value == "Total Charges") {
      this.vbpackage_id_visible = false;
      this.vbpackage_id_includeInLayout = false;
      this.vbavgfrt_id_visible = false;
      this.vbavgfrt_id_includeInLayout = false;
      this.vbavgacc_id_visible = false;
      this.vbavgacc_id_includeInLayout = false;
      this.vbpackagefrt_id_visible = false;
      this.vbpackagefrt_id_includeInLayout = false;
      this.vbfrtacc_id_visible = true;
      this.vbfrtacc_id_includeInLayout = true;
    }
    else {
      this.vbpackage_id_visible = true;
      this.vbpackage_id_includeInLayout = true;
      this.vbavgfrt_id_visible = true;
      this.vbavgfrt_id_includeInLayout = true;
      this.vbavgacc_id_visible = true;
      this.vbavgacc_id_includeInLayout = true;
      this.vbpackagefrt_id_visible = true;
      this.vbpackagefrt_id_includeInLayout = true;
      this.vbfrtacc_id_visible = true;
      this.vbfrtacc_id_includeInLayout = true;
    }
    const index = this.zoneAveFRT.findIndex(x => x.field === "Total");
    this.zoneAveFRT.splice(index, 1);
    const index1 = this.zoneAvgACC.findIndex(x => x.field === "Total");
    this.zoneAvgACC.splice(index1, 1);
    this.datagridpackagecount_id_dataProvider = this.zonePacagecount;
    this.datagridavgfrt_id_dataProvider = this.zoneAveFRT;
    this.datagridavgacc_id_dataProvider = this.zoneAvgACC;
    this.datagridpackagefrt_id_dataProvider = this.zonePackageFRT;
    this.datagridfrtacc_id_dataProvider = this.zoneFRTACC;
    this.closeLoading();
    this.cd.detectChanges();
  }

  roundValue(mathValue: any): number {
    const num = Number(mathValue);

    // Guard against NaN, Infinity, null, undefined
    if (!Number.isFinite(num)) {
      return 0;
    }

    return num;
  }

  openModal(alertVal: any) {
    this.openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      panelClass: this.panelClass
    });
  }




  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  // For *ngFor trackBy
  trackByIdx = (i: number) => i;

  // helper: right-align numeric/currency/% columns
  isRightAligned(colHeader: string, colIndex: number): boolean {
    return colIndex > 0; // everything except first column
  }

  // optional: make Total/% rows bold like summary rows
  isSummaryRow(firstCell: Cell): boolean {
    return firstCell === 'Total' || firstCell === '%';
  }

  //UI- Logic
  openEnd(content: TemplateRef<any>) {
    const offcanvasRef: NgbOffcanvasRef =
      this.offcanvasService.open(content, { position: 'end' });

    // Fires when DOM is fully rendered
    offcanvasRef.shown.subscribe(() => {
      this.attribute = document.documentElement.getAttribute('data-layout');
    });
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  async onSubmit() {

    var boolRes = this.compareTwoDates();
    var tempdateFrom = this.apiControllerFormGroup.get('fromDate')?.value;
    var tempdateTo = this.apiControllerFormGroup.get('toDate')?.value;
    var validdateFrom = this.datePipe.transform(tempdateFrom, "yyyy-MM-dd");
    var validdateTo = this.datePipe.transform(tempdateTo, "yyyy-MM-dd");

    if (boolRes != false) {
      var accountNoValArr = await this.apiControllerFormGroup.get('accountNumber')?.value;
      var containsAll = accountNoValArr[0].includes('ALL');
      if (accountNoValArr == "null" || accountNoValArr == "ALL" || containsAll == true) {
        this.apiControllerFormGroup.get('accNo')?.setValue(null);
      }

      this.fromDateFormat = this.datePipe.transform(tempdateFrom, "MMM dd,yyyy");
      this.toDateFormat = this.datePipe.transform(tempdateTo, "MMM dd,yyyy");

      this.openLoading();
      this.apiControllerFormGroup.get('fromDate')?.setValue(validdateFrom);
      this.apiControllerFormGroup.get('toDate')?.setValue(validdateTo);
      var accountNoValArr = await this.apiControllerFormGroup.get('accountNumber')?.value;
      var containsAll = accountNoValArr[0].includes('ALL');
      if (accountNoValArr == "null" || accountNoValArr == "ALL" || accountNoValArr == null || containsAll == true) {
        this.apiControllerFormGroup.get('accNo')?.setValue(null);
      }
      else {
        var accountNoVal = accountNoValArr.join('@')
        this.apiControllerFormGroup.get('accNo')?.setValue(accountNoVal);
      }

      await this.httpOntracService.fetchZoneDistribution(this.apiControllerFormGroup.value).subscribe({
        next: (result) => {
          if (result && result.length > 0) {
            this.summaryZoneDistributionObj = result[result.length - 1];
            this.resultZoneDistribution = result.slice(0, -1);
          }
          // this.resultZoneDistribution = result;
          if (accountNoVal == "null" || accountNoVal == "ALL" || containsAll == true) {
            this.apiControllerFormGroup.get('accNo')?.setValue(null);
          }
          this.zone_distribution(result);
        },
        error: (error) => {
          this.zone_distribution([]); // Ensure tables are visible even on error
        }
      })
      this.apiControllerFormGroup.get('fromDate')?.setValue(new Date(tempdateFrom));
      this.apiControllerFormGroup.get('toDate')?.setValue(new Date(tempdateTo));
    }
  }

  compareTwoDates() {
    var dateFr = this.apiControllerFormGroup.get('fromdate')?.value;
    var dateT = this.apiControllerFormGroup.get('todate')?.value;
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    if (dateFromYear != dateToYear) {
      this.openModal("Please Select Same Year Range for From Date and To Date");
      return false;
    }
    return true;
  }

  toggleAllSelection() {

    if (this.allSelectedValue.selected) {
      this.accNoSel.options.forEach((item: MatOption) => { item.deselect() });
      var setAllvalue = {};
      setAllvalue = ["ALL"];
      this.apiControllerFormGroup.get('accountNumber')?.setValue(setAllvalue);
    }
  }

  toggleSelection() {
    var accvalue = this.apiControllerFormGroup.get('accountNumber')?.value;
    if (accvalue[0] == "ALL" && accvalue[1] != "undefined") {
      this.allSelectedValue.deselect();
    }
  }

  async image1_clickHandler() {

    var t007_reportlogobj: any = {};
    t007_reportlogobj['t001ClientProfile'] = this.apiControllerFormGroup.get('t001ClientProfile')?.value;
    t007_reportlogobj["status"] = "IN QUEUE";
    t007_reportlogobj["reportFormat"] = "CSV";
    t007_reportlogobj["moduleName"] = this.modulename;
    t007_reportlogobj["login_id"] = this.loginId;
    t007_reportlogobj['clientId'] = this.clientID;
    t007_reportlogobj['clientName'] = this.clientName;
    t007_reportlogobj['crmaccountNumber'] = "NA";
    t007_reportlogobj["reportType"] = "Zone_Distribution_Report";
    t007_reportlogobj['reportName'] = "Zone Distribution Report";
    t007_reportlogobj["designFileName"] = "Zone_Distribution_Report";
    t007_reportlogobj['chargeDes'] = this.apiControllerFormGroup.get('datetype')?.value;
    t007_reportlogobj['fZone'] = this.apiControllerFormGroup.get('serviceType')?.value;
    t007_reportlogobj['tZone'] = this.apiControllerFormGroup.get('reporttype')?.value;

    var accNo = null;
    var tempaccNoArr = this.apiControllerFormGroup.get('accountNumber')?.value;
    var containsAll = tempaccNoArr[0].includes('ALL');
    var tempaccNo = tempaccNoArr.join('@');
    if (tempaccNo != null && tempaccNo != "ALL" && tempaccNo != "null" && containsAll == false) {
      accNo = tempaccNo;
      t007_reportlogobj["accountNumber"] = accNo;
    } else {
      t007_reportlogobj["accountNumber"] = null;
    }

    var tempdateFrom = this.apiControllerFormGroup.get('fromDate')?.value;
    var tempdateTo = this.apiControllerFormGroup.get('toDate')?.value;
    var validdateFrom = this.datePipe.transform(tempdateFrom, "yyyy-MM-dd");
    var validdateTo = this.datePipe.transform(tempdateTo, "yyyy-MM-dd");

    t007_reportlogobj["fromDate"] = validdateFrom;
    t007_reportlogobj["toDate"] = validdateTo;

    this.httpOntracService.runReport(t007_reportlogobj).subscribe({
      next: (result: any) => {
        this.saveOrUpdateReportLogResult(result);
      }, error: error => {
      }
    });
  }

  saveOrUpdateReportLogResult(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t001ClientProfile.clientId')?.setValue(result['t001ClientProfile']['clientId']);
    this.commonService._setIntervalOnTrac(this.reportsFormGroup.value);
    this.openModal("Your request has been added to the report queue. When complete, your file will be downloaded automatically.");
  }

  getAvgFrtHeader(index: number): any {

    const headerIndex = index + 1;

    return (this as any)['field' + headerIndex + '_avgfrt_headerText'];

  }

  getPackageCountHeader(index: number): any {
    if (index === 0) {
      return this.field1_packagecount_headerText;
    }
    if (index === 1) {
      return this.field2_packagecount_headerText;
    }
    const headerIndex = index + 1;
    return (this as any)['field' + headerIndex + '_packagecount_headerText'];
  }

  getAvgFrtField(row: any, colIndex: number): number {
    if (colIndex === 0) return row.field; // first column label
    return row['field' + (colIndex - 1)];
  }

}