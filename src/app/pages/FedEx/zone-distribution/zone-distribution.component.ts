import { DatePipe } from '@angular/common';
import { Component, ElementRef, signal, OnInit, AfterViewInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatOption, MatSelect } from '@angular/material/select';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { CookiesService } from 'src/app/core/services/cookie.service';
import { HttpClientService } from 'src/app/core/services/httpclient.service';
import { HttpfedexService } from 'src/app/core/services/httpfedex.service';
import { HttpOntracService } from 'src/app/core/services/httpontrac.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';

type Cell = string | number;

@Component({
  selector: 'app-fedex-zone-distribution',
  templateUrl: './zone-distribution.component.html',
  styleUrls: ['./zone-distribution.component.scss'],
  standalone: false
})
export class FedExZoneDistributionComponent implements OnInit, AfterViewInit {
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
  zonedistributionAC_FedEx: any;
  zonedistributionFOAC: any;
  zonedistributionPOAC: any;
  zonedistributionSOAC: any;
  zonedistribution2DAAC: any;
  zonedistribution2DAC: any;
  zonedistributionESAC: any;
  zonedistributionGAC: any;
  zonedistributionHDAC: any;
  zonedistributionSPAC: any;
  zonedistributionIGAC: any;
  zonedistributionIPAC: any;
  zonedistributionIFAC: any;
  zonedistributionIEAC: any;
  zonedistributionTempAC: any;
  zonedistributionTempAC_FO: any;
  zonedistributionTempAC_PO: any;
  zonedistributionTempAC_SO: any;
  zonedistributionTempAC_2DA: any;
  zonedistributionTempAC_2D: any;
  zonedistributionTempAC_ES: any;
  zonedistributionTempAC_G: any;
  zonedistributionTempAC_HD: any;
  zonedistributionTempAC_SP: any;
  zonedistributionTempAC_IG: any;
  zonedistributionTempAC_IP: any;
  zonedistributionTempAC_IF: any;
  zonedistributionTempAC_IE: any;
  zonePCAR: any;
  zonePCA: any;
  zonePCA_FO: any;
  zonePCA_PO: any;
  zonePCA_SO: any;
  zonePCA_2DA: any;
  zonePCA_2D: any;
  zonePCA_ES: any;
  zonePCA_G: any;
  zonePCA_HD: any;
  zonePCA_SP: any;
  zonePCA_IG: any;
  zonePCA_IP: any;
  zonePCA_IF: any;
  zonePCA_IE: any;
  zoneAPFRTAR: any;
  zoneAPFRTAR_FO: any;
  zoneAPFRTAR_PO: any;
  zoneAPFRTAR_SO: any;
  zoneAPFRTAR_2DA: any;
  zoneAPFRTAR_2D: any;
  zoneAPFRTAR_ES: any;
  zoneAPFRTAR_G: any;
  zoneAPFRTAR_HD: any;
  zoneAPFRTAR_SP: any;
  zoneAPFRTAR_IG: any;
  zoneAPFRTAR_IP: any;
  zoneAPFRTAR_IF: any;
  zoneAPFRTAR_IE: any;
  zoneAPACCAR: any;
  zoneTPFRTAR: any;
  zoneTPACCAR: any;
  zoneFRTACCAR: any;
  zoneAvgFRTACCAR: any;
  totalAR: any;
  myGrid1: any;
  myGrid3: any;
  myGrid4: any;
  myGrid5: any;
  myGrid6: any;
  myGrid7: any;
  myGrid8: any;
  myGrid1Arr: any;
  myGrid3Arr: any;
  myGrid4Arr: any;
  myGrid5Arr: any;
  myGrid6Arr: any;
  myGrid7Arr: any;
  myGrid8Arr: any;


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
  vbpackage_FedEx_visible: boolean = false;
  vbpackage_FedEx_includeInLayout: boolean = false;
  vbavgfrt_FedEx_visible: boolean = false;
  vbavgfrt_FedEx_includeInLayout: boolean = false;
  vbavgacc_FedEx_visible: boolean = false;
  vbavgacc_FedEx_includeInLayout: boolean = false;
  vbpackagefrt_FedEx_visible: boolean = false;
  vbpackagefrt_FedEx_includeInLayout: boolean = false;
  vbfrtacc_FedEx_visible: boolean = false;
  vbfrtacc_FedEx_includeInLayout: boolean = false;
  vbavgfrtacc_FedEx_visible: boolean = false;
  vbavgfrtacc_FedEx_includeInLayout: boolean = false;
  vbaccscc_FedEx_visible: boolean = false;
  vbaccscc_FedEx_includeInLayout: boolean = false;
  vbpackagescc_FedEx_visible: boolean = false;
  vbpackagescc_FedEx_includeInLayout: boolean = false;
  vbpackagefrtacc_FedEx_visible: boolean = false;
  vbpackagefrtacc_FedEx_includeInLayout: boolean = false;
  vbfrtpackagescc_FedEx_visible: boolean = false;
  vbfrtpackagescc_FedEx_includeInLayout: boolean = false;
  sortDir = 1;


  //Form Group
  fedexFormGroup!: FormGroup;
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

  constructor(private loaderService: LoaderService,
    private httpfedexService: HttpfedexService, private offcanvasService: NgbOffcanvas,
    private cookiesService: CookiesService, private datePipe: DatePipe,
    private commonService: CommonService, private httpOntracService: HttpOntracService,
    private dialog: MatDialog, private cd: ChangeDetectorRef) {

    this.fedexFormGroup = new FormGroup({
      loginId: new FormControl(''),
      requesteddttm: new FormControl(''),
      createdDate: new FormControl(''),
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      modulename: new FormControl(''),
      clientId: new FormControl(''),
      reportType: new FormControl('ZONE_DISTRIBUTION_MODULE'),
      status: new FormControl(''),
      reportFormat: new FormControl('CSV'),
      moduleName: new FormControl(''),
      login_id: new FormControl(''),
      upsClientId: new FormControl(''),
      clientname: new FormControl(''),
      clientName: new FormControl(''),
      fromdate: new FormControl(''),
      todate: new FormControl(''),
      datetype: new FormControl('InvoiceDate'),
      chargeDescription: new FormControl(''),
      reporttype: new FormControl(''),
      reportName: new FormControl(''),
      accountNumber: new FormControl(''),
      desc: new FormControl(''),
      grp: new FormControl(''),
      chargeType: new FormControl(''),
      chargeDesc: new FormControl(''),
      chargeGroup: new FormControl(''),
      accNo: new FormControl(null),
      t002ClientProfile: new FormGroup({
        clientId: new FormControl(''), clientName: new FormControl(''), userName: new FormControl(''), password: new FormControl(''), siteUserName: new FormControl(''), sitePassword: new FormControl(''),
        address: new FormControl(''), contactNo: new FormControl(''), comments: new FormControl(''), endDate: new FormControl(''), startDate: new FormControl(''),
        status: new FormControl(''), auditStatus: new FormControl(''), contractStatus: new FormControl(''), email: new FormControl(''),
        userLogo: new FormControl(''), customerType: new FormControl(''), dataSource: new FormControl(''), dataLoadedBy: new FormControl(''), filestartdate: new FormControl(''),
        fileenddate: new FormControl(''), dateasof: new FormControl(''), currentDate: new FormControl(''), currentYear: new FormControl(''),
        currentMonth: new FormControl(''), startYear: new FormControl(''), createdBy: new FormControl(''), createdTs: new FormControl(''), updatedTs: new FormControl(''),
        adminFlag: new FormControl(''), filestartdate1: new FormControl(''), fileenddate1: new FormControl(''), trackingcount: new FormControl(''), logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''), noofdaysinactive: new FormControl(''), ipaddress: new FormControl(''), loginFlag: new FormControl(''), contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''), carrierType: new FormControl(''), customers: new FormControl('')
      }),
      t002ClientProfileobj: new FormGroup({
        clientId: new FormControl(''), clientName: new FormControl(''), userName: new FormControl(''), password: new FormControl(''), siteUserName: new FormControl(''), sitePassword: new FormControl(''),
        address: new FormControl(''), contactNo: new FormControl(''), comments: new FormControl(''), endDate: new FormControl(''), startDate: new FormControl(''),
        status: new FormControl(''), auditStatus: new FormControl(''), contractStatus: new FormControl(''), email: new FormControl(''),
        userLogo: new FormControl(''), customerType: new FormControl(''), dataSource: new FormControl(''), dataLoadedBy: new FormControl(''), filestartdate: new FormControl(''),
        fileenddate: new FormControl(''), dateasof: new FormControl(''), currentDate: new FormControl(''), currentYear: new FormControl(''),
        currentMonth: new FormControl(''), startYear: new FormControl(''), createdBy: new FormControl(''), createdTs: new FormControl(''), updatedTs: new FormControl(''),
        adminFlag: new FormControl(''), filestartdate1: new FormControl(''), fileenddate1: new FormControl(''), trackingcount: new FormControl(''), logostatus: new FormControl(''),
        noofdaystoactive: new FormControl(''), noofdaysinactive: new FormControl(''), ipaddress: new FormControl(''), loginFlag: new FormControl(''), contractSavingFlag: new FormControl(''),
        clientProfileName: new FormControl(''), carrierType: new FormControl(''), customers: new FormControl('')
      }),
      dateRange: new FormGroup({
        start: new FormControl(''),
        end: new FormControl('')
      })
    })

    this.reportsFormGroup = new FormGroup({
      reportLogId: new FormControl(''),
      t001ClientProfile: new FormGroup({ clientId: new FormControl('') }),
      t002ClientProfileobj: new FormGroup({ clientId: new FormControl('') })
    });

  }

  ngOnInit(): void {
    this.initialDefault();
    this.openLoading();
    this.fedexFormGroup.patchValue({
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

    var strYearEnd = this.userProfifle.fileenddate1.substring(0, 4);
    var strMonthEnd = this.userProfifle.fileenddate1.substring(4, 6);
    var strDateEnd = this.userProfifle.fileenddate1.substring(6, 8);
    this.dataasof = strMonthEnd + "/" + strDateEnd + "/" + strYearEnd;
    this.dataasofFormat = this.datePipe.transform(this.dataasof, "MMM dd,yyyy");
    const formattedDate = this.datePipe.transform(this.dataasof, 'MM/dd/yyyy');
    this.dataasoffFormat = formattedDate ? new Date(formattedDate) : null;
    this.clientName = clientname.replace(/[ ]/g, "_");

    await this.fedexFormGroup.get('datetype')?.setValue("InvoiceDate");
    await this.fedexFormGroup.get('chargeDescription')?.setValue("First Overnight");
    await this.fedexFormGroup.get('reporttype')?.setValue("All");
    await this.fedexFormGroup.get('clientId')?.setValue(this.clientID);
    await this.fedexFormGroup.get('fromdate')?.setValue(this.fromDate);
    await this.fedexFormGroup.get('todate')?.setValue(this.toDate);
    await this.fedexFormGroup.get('fromDate')?.setValue(this.fromDate);
    await this.fedexFormGroup.get('toDate')?.setValue(this.toDate);

    await this.fedexFormGroup.get('reportType')?.setValue("ZONE_DISTRIBUTION_MODULE");
    await this.fedexFormGroup.get('status')?.setValue("IN QUEUE");
    await this.fedexFormGroup.get('reportFormat')?.setValue("excel");
    await this.fedexFormGroup.get('moduleName')?.setValue("ZoneDistribution");
    await this.fedexFormGroup.get('clientname')?.setValue(this.clientName);

    await this.fedexFormGroup.patchValue({
      t002ClientProfile: {
        "clientId": this.userProfifle.clientId,
        "clientName": this.userProfifle.clientName,
        "userName": this.userProfifle.userName,
        "password": this.userProfifle.password,
        "siteUserName": this.userProfifle.siteUserName,
        'sitePassword': this.userProfifle.sitePassword,
        "address": this.userProfifle.address,
        "contactNo": this.userProfifle.contactNo,
        "comments": this.userProfifle.comments,
        "endDate": this.userProfifle.endDate,
        "startDate": this.userProfifle.startDate,
        "status": this.userProfifle.status,
        "auditStatus": this.userProfifle.auditStatus,
        "contractStatus": this.userProfifle.contractStatus,
        "email": this.userProfifle.email,
        "userLogo": this.userProfifle.userLogo,
        "customerType": this.userProfifle.customerType,
        "dataSource": this.userProfifle.dataSource,
        "dataLoadedBy": this.userProfifle.dataLoadedBy,
        "filestartdate": this.userProfifle.filestartdate,
        "fileenddate": this.userProfifle.fileenddate,
        "dateasof": this.userProfifle.dateasof,
        "currentDate": this.userProfifle.currentDate,
        "currentYear": this.userProfifle.currentYear,
        "currentMonth": this.userProfifle.currentMonth,
        "startYear": this.userProfifle.startYear,
        "createdBy": this.userProfifle.createdBy,
        "createdTs": this.userProfifle.createdTs,
        "updatedTs": this.userProfifle.updatedTs,
        "adminFlag": this.userProfifle.adminFlag,
        "filestartdate1": this.userProfifle.filestartdate1,
        "fileenddate1": this.userProfifle.fileenddate1,
        "trackingcount": this.userProfifle.trackingcount,
        "logostatus": this.userProfifle.logostatus,
        "noofdaystoactive": this.userProfifle.noofdaystoactive,
        "noofdaysinactive": this.userProfifle.noofdaysinactive,
        "ipaddress": this.userProfifle.ipaddress,
        "loginFlag": this.userProfifle.loginFlag,
        "contractSavingFlag": this.userProfifle.contractSavingFlag,
        "clientProfileName": this.userProfifle.clientProfileName,
        "carrierType": this.userProfifle.carrierType,
        "t002AccountDet": this.userProfifle.t002AccountDet,
        "customers": this.userProfifle.customers
      }
    });

    await this.fetchzonedistributionFedEx();
    await this.fedexFormGroup.get('fromdate')?.setValue(new Date(this.tempfromDate));
    await this.fedexFormGroup.get('fromDate')?.setValue(new Date(this.tempfromDate));
    await this.fedexFormGroup.get('todate')?.setValue(new Date(this.temptoDate));
    await this.fedexFormGroup.get('toDate')?.setValue(new Date(this.temptoDate));
  }

  async getuserProfile() {
    this.userProfifleVal = await this.commonService.getUserprofileData().then(
      result => {
        return result;
      });
    return this.userProfifleVal;
  }

  async fetchzonedistributionFedEx(): Promise<void> {
    this.httpfedexService.fetchzonedistribution(this.fedexFormGroup.value).subscribe({
      next: (result: any) => {
        const resultObj = result;
        this.fetchzonedistribution_result(resultObj);
      },
      error: (err) => {
        console.error('error', err);
        this.fetchzonedistribution_result([]); // Ensure tables are visible even on error
      }
    });
  }

  fetchzonedistribution_result(event: any) {
    this.zonedistributionAC_FedEx = event || [];
    this.zonedistributionFOAC = [];
    this.zonedistributionPOAC = [];
    this.zonedistributionSOAC = [];
    this.zonedistribution2DAAC = [];
    this.zonedistribution2DAC = [];
    this.zonedistributionESAC = [];
    this.zonedistributionGAC = [];
    this.zonedistributionHDAC = [];
    this.zonedistributionSPAC = [];
    this.zonedistributionIGAC = [];
    this.zonedistributionIPAC = [];
    this.zonedistributionIFAC = [];
    this.zonedistributionIEAC = [];
    this.zonedistributionAC = [];
    this.zonedistributionAC = event || [];
    for (var zoneloop = 0; zoneloop < this.zonedistributionAC_FedEx.length; zoneloop++) {

      var zoneObj = this.zonedistributionAC_FedEx[zoneloop];
      if (zoneObj.serviceType == "FedEx First Overnight") {

        this.zonedistributionFOAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx Priority Overnight") {

        this.zonedistributionPOAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx Standard Overnight") {

        this.zonedistributionSOAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx 2Day A.M.") {

        this.zonedistribution2DAAC.push(zoneObj);

      } else if (zoneObj.serviceType == "FedEx 2Day") {

        this.zonedistribution2DAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx Express Saver") {

        this.zonedistributionESAC.push(zoneObj);
      } else if (zoneObj.serviceType == "Ground") {

        this.zonedistributionGAC.push(zoneObj);
      } else if (zoneObj.serviceType == "Home Delivery") {

        this.zonedistributionHDAC.push(zoneObj);
      } else if (zoneObj.serviceType == "Ground Economy") {

        this.zonedistributionSPAC.push(zoneObj);
      } else if (zoneObj.serviceType == "International Ground") {

        this.zonedistributionIGAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx Intl Priority") {

        this.zonedistributionIPAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx International First") {

        this.zonedistributionIFAC.push(zoneObj);
      } else if (zoneObj.serviceType == "FedEx Intl Economy") {

        this.zonedistributionIEAC.push(zoneObj);
      }
    }
    this.processDatagrid();
  }

  processDatagrid() {
    this.serviceName = this.fedexFormGroup.get('chargeDescription')?.value;
    this.closeLoading();
    var zoneCodes = "";
    this.zonedistributionTempAC = [];
    this.zonePCAR = [];
    this.zoneAPFRTAR = [];
    this.zoneAPACCAR = [];
    this.zoneTPFRTAR = [];
    this.zoneTPACCAR = [];
    this.zoneFRTACCAR = [];
    this.zoneAvgFRTACCAR = [];
    let StringAR = [];
    let StringAR1 = [];
    let totalAR: any = [];
    let tempObj: any = {};

    this.myGrid1 = [];
    this.myGrid3 = [];
    this.myGrid4 = [];
    this.myGrid5 = [];
    this.myGrid6 = [];
    this.myGrid7 = [];
    this.myGrid8 = [];
    this.myGrid1Arr = [];
    this.myGrid3Arr = [];
    this.myGrid4Arr = [];
    this.myGrid5Arr = [];
    this.myGrid6Arr = [];
    this.myGrid7Arr = [];
    this.myGrid8Arr = [];
    switch (this.fedexFormGroup.get("chargeDescription")?.value) {
      case "First Overnight":
        {
          this.zonedistributionTempAC = this.zonedistributionFOAC;

          break;
        }
      case "Priority Overnight":
        {
          this.zonedistributionTempAC = this.zonedistributionPOAC;
          break;
        }
      case "Standard Overnight":
        {
          this.zonedistributionTempAC = this.zonedistributionSOAC;
          break;
        }
      case "2Day AM":
        {
          this.zonedistributionTempAC = this.zonedistribution2DAAC;
          break;
        }
      case "2Day":
        {

          this.zonedistributionTempAC = this.zonedistribution2DAC;
          break;
        }
      case "Express Saver":
        {
          this.zonedistributionTempAC = this.zonedistributionESAC;
          break;
        }
      case "Ground":
        {
          this.zonedistributionTempAC = this.zonedistributionGAC;
          break;
        }
      case "Home Delivery":
        {
          this.zonedistributionTempAC = this.zonedistributionHDAC;
          break;
        }
      case "Ground Economy":
        {
          this.zonedistributionTempAC = this.zonedistributionSPAC;
          break;
        }
      case "International Ground":
        {
          this.zonedistributionTempAC = this.zonedistributionIGAC;
          break;
        }
      case "FedEx Intl Priority":
        {
          this.zonedistributionTempAC = this.zonedistributionIPAC;
          break;
        }
      case "FedEx International First":
        {
          this.zonedistributionTempAC = this.zonedistributionIFAC;
          break;
        }
      case "FedEx Intl Economy":
        {
          this.zonedistributionTempAC = this.zonedistributionIEAC;
          break;
        }
    }


    if (this.zonedistributionTempAC != null && this.zonedistributionTempAC.length != 0) {
      var zoneValue = 0;
      var ZoneAvgValue = 0;
      //--------------------------------------------------------------- Package count Report -----------------------------------
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        var zoneFOObj = this.zonedistributionTempAC[count1];

        if (zoneCodes != "" && zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "")
          zoneCodes += "," + zoneFOObj.zoneCode;
        else
          zoneCodes = zoneFOObj.zoneCode;
      }
      var zoneAR = zoneCodes.split(",");

      zoneAR = this.removeDuplicates(zoneAR);
      StringAR = [];
      totalAR = [];
      zoneValue = 0;
      for (let count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        let labelstr = "BilledWeight";
        let labelstr1: string = "Total Packages";
        let existFlag = false;
        let tempZoneObj1;
        let zoneFOObj = this.zonedistributionTempAC[count1];
        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        let zoneTot: number = 0;

        for (var zoLoop = 0; zoLoop < this.zonePCAR.length; zoLoop++) {

          tempZoneObj1 = this.zonePCAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {

            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number(zoneFOObj.numberOfPieces) + Number(tempZoneObj1[zoneFOObj.zoneCode]);
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = tempZoneObj1[labelstr1] + Number(zoneFOObj.numberOfPieces);
                totalAR[count2] = totalAR[count2] + Number(zoneFOObj.numberOfPieces);
              }
            }
            tempZoneObj1[labelstr1] = zoneTot;

            existFlag = true;
          }

        }
        if (!existFlag) {

          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(zoneFOObj.numberOfPieces);
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else
              totalAR[count2] = zoneValue;

            zoneTot = zoneTot + zoneValue
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot;
          this.zonePCAR.push(tempObj);
        }
      }
      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        let labelstr = "BilledWeight";
        let labelstr1 = "Total Packages";

        let zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        let zoneTot1: number = 0
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          zoneTot1 = zoneTot1 + totalAR[count2]
          tempObj[zoneAR[count2]] = totalAR[count2];

        }
        tempObj[labelstr1] = zoneTot1;


        this.zonePCAR.push(tempObj);



        var zoneVal = "";
        this.myGrid7Arr.push("BilledWeight");
        this.myGrid7.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid7Arr.push(zoneVal);
          this.myGrid7.push(zoneVal);
        }
        this.myGrid7.push("Total Packages");
        this.myGrid7Arr.push("Total Packages");
      }


      //--------------------------------------------------------------- Avg Package Cost Report(FRT) -----------------------------------


      StringAR = [];
      let totalSumAR: any = [];
      totalAR = [];
      zoneValue = 0;
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        let labelstr = "BilledWeight";
        let labelstr1 = "Total Net Amount"; //FD07
        let labelstr2 = "Total Packages";   //FD07
        let existFlag = false;

        let zoneFOObj = this.zonedistributionTempAC[count1];
        let tempZoneObj1: any = {};

        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        var zoneTot = 0;
        for (var zoLoop = 0; zoLoop < this.zoneAPFRTAR.length; zoLoop++) {
          tempZoneObj1 = this.zoneAPFRTAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {
            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number(Number(zoneFOObj.transportationChargeAmount).toFixed(2)) +
                  Number(Number(zoneFOObj.totalOfNegative).toFixed(2)) + tempZoneObj1[zoneFOObj.zoneCode]//Number(Number(tempZoneObj1[zoneFOObj.zoneCode]).toFixed(2));
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = Number(tempZoneObj1[labelstr1]) + Number(Number(zoneFOObj.transportationChargeAmount).toFixed(2)) +
                  Number(Number(zoneFOObj.totalOfNegative).toFixed(2));
                totalAR[count2] = Number(totalAR[count2]) + Number(Number(zoneFOObj.transportationChargeAmount).toFixed(2)) +
                  Number(Number(zoneFOObj.totalOfNegative).toFixed(2));
              }
            }
            tempZoneObj1[labelstr1] = zoneTot.toFixed(2);
            existFlag = true;
          }

        }
        if (!existFlag) {
          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(Number(zoneFOObj.transportationChargeAmount).toFixed(2)) + Number(Number(zoneFOObj.totalOfNegative).toFixed(2));
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else
              totalAR[count2] = zoneValue;

            zoneTot = zoneTot + zoneValue
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot.toFixed(2);
          this.zoneAPFRTAR.push(tempObj);
        }
      }

      for (var avgLoop = 0; avgLoop < this.zoneAPFRTAR.length; avgLoop++) {
        totalAR = new Array;//Removing the total frt values.
        let avgsumTot: number = 0;
        let zoneCodeTemp = [];
        let zoneAvgTot: number = 0
        let zoneSumAvgTot: number = 0
        let labelstr1 = "Total Net Amount";
        let tempAvgObj: any = this.zoneAPFRTAR[avgLoop];
        let tempPCObj: any = this.zonePCAR[avgLoop];
        for (var count5 = 0; count5 < zoneAR.length; count5++) {
          if ((tempAvgObj[zoneAR[count5]]) != "0.00" && (tempAvgObj[zoneAR[count5]]) != "0" && (tempAvgObj[zoneAR[count5]]) != "" && (tempAvgObj[zoneAR[count5]]) != null
            && (tempPCObj[zoneAR[count5]]) != "0.00" && (tempPCObj[zoneAR[count5]]) != "0" && (tempPCObj[zoneAR[count5]]) != "" && (tempPCObj[zoneAR[count5]]) != null) {
            tempAvgObj[zoneAR[count5]] = Number((tempAvgObj[zoneAR[count5]]) / (tempPCObj[zoneAR[count5]])).toFixed(2);


            ZoneAvgValue = tempAvgObj[zoneAR[count5]];
            totalAR[zoneAR[count5]] = ZoneAvgValue;  //Adding the average value for each zone code
            zoneCodeTemp[count5] = zoneAR[count5];   //Getting the zone code label.

            zoneAvgTot = Number(zoneAvgTot) + Number(ZoneAvgValue);  //Sum the total net amount          
          }
          else {
            totalAR[zoneAR[count5]] = 0;       //If zone code value is null then set as 0
            zoneCodeTemp[count5] = zoneAR[count5];
          }
        }

        //calulating the total sum values for each zone
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneCodeTemp[count2]) {
            if (avgLoop == 0) {
              totalSumAR[zoneAR[count2]] = totalAR[zoneAR[count2]];
            }
            else {

              totalSumAR[zoneAR[count2]] = this.formatToNum((totalSumAR[zoneAR[count2]]), (totalAR[zoneAR[count2]]));
            }
          }
        }

        tempAvgObj[labelstr1] = Number(zoneAvgTot).toFixed(2);

      }

      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";

        var zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        var zoneTot1: number = 0;
        for (var count5 = 0; count5 < zoneAR.length; count5++) {

          zoneTot1 = this.formatToNum(zoneTot1, (totalSumAR[zoneAR[count5]]));

          tempObj[zoneAR[count5]] = totalSumAR[zoneAR[count5]];

        }
        tempObj[labelstr1] = zoneTot1;
        this.zoneAPFRTAR.push(tempObj, this.zoneAPFRTAR.length);



        var zoneVal = "";
        this.myGrid6Arr.push("BilledWeight");
        this.myGrid6.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid6Arr.push(zoneVal);
          this.myGrid6.push(zoneVal);
        }


      }


      //--------------------------------------------------------------- Avg Package Cost Report(ACC) -----------------------------------

      StringAR = [];
      totalAR = [];
      zoneValue = 0;

      var exist = false;
      var indexNo = 0;
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";  //FD07
        var labelstr2 = "Total Packages";    //FD07
        var existFlag = false;

        var zoneFOObj = this.zonedistributionTempAC[count1];
        var tempZoneObj1: any = {};

        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        var zoneTot: number = 0;
        for (var zoLoop = 0; zoLoop < this.zoneAPACCAR.length; zoLoop++) {
          tempZoneObj1 = this.zoneAPACCAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {
            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number(Number(zoneFOObj.totalOfPositive).toFixed(2)) + tempZoneObj1[zoneFOObj.zoneCode]//Number(Number(tempZoneObj1[zoneFOObj.zoneCode]).toFixed(2));
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = Number(tempZoneObj1[labelstr1]) + Number(Number(zoneFOObj.totalOfPositive).toFixed(2));
                totalAR[count2] = Number(totalAR[count2]) + Number(Number(zoneFOObj.totalOfPositive).toFixed(2));
              }
            }
            tempZoneObj1[labelstr1] = zoneTot.toFixed(2);
            existFlag = true;
          }

        }
        if (!existFlag) {
          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(Number(zoneFOObj.totalOfPositive).toFixed(2));
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else {
              totalAR[count2] = zoneValue;
            }

            zoneTot = zoneTot + zoneValue
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot.toFixed(2);

          this.zoneAPACCAR.push(tempObj);
        }
      }

      for (var avgLoop = 0; avgLoop < this.zoneAPACCAR.length; avgLoop++) {
        totalAR = [];
        var avgsumTot: number = 0;
        var zoneCodeTemp = [];
        var zoneAvgTot: number = 0
        var zoneSumAvgTot: number = 0
        var labelstr1 = "Total Net Amount";
        let tempAvgObj: any = this.zoneAPACCAR[avgLoop];
        let tempPCObj: any = this.zonePCAR[avgLoop];
        for (var count5 = 0; count5 < zoneAR.length; count5++) {
          if ((tempAvgObj[zoneAR[count5]]) != "0.00" && (tempAvgObj[zoneAR[count5]]) != "0" && (tempAvgObj[zoneAR[count5]]) != "" && (tempAvgObj[zoneAR[count5]]) != null
            && (tempPCObj[zoneAR[count5]]) != "0.00" && (tempPCObj[zoneAR[count5]]) != "0" && (tempPCObj[zoneAR[count5]]) != "" && (tempPCObj[zoneAR[count5]]) != null) {
            tempAvgObj[zoneAR[count5]] = Number((tempAvgObj[zoneAR[count5]]) / (tempPCObj[zoneAR[count5]])).toFixed(2);

            ZoneAvgValue = tempAvgObj[zoneAR[count5]];
            totalAR[zoneAR[count5]] = ZoneAvgValue;  //Adding the average value for each zone code
            zoneCodeTemp[count5] = zoneAR[count5];   //Getting the zone code label.

            zoneAvgTot = Number(zoneAvgTot) + Number(ZoneAvgValue);  //Sum the total net amount       
          }
          else {
            totalAR[zoneAR[count5]] = 0;       //If zone code value is null then set as 0
            zoneCodeTemp[count5] = zoneAR[count5];
          }
        }

        //calulating the total sum values for each zone
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneCodeTemp[count2]) {
            if (avgLoop == 0) {
              totalSumAR[zoneAR[count2]] = totalAR[zoneAR[count2]];
            }

            else {
              totalSumAR[zoneAR[count2]] = this.formatToNum((totalSumAR[zoneAR[count2]]), (totalAR[zoneAR[count2]]));

            }
          }
        }

        tempAvgObj[labelstr1] = Number(zoneAvgTot).toFixed(2);
      }

      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";

        var zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        var zoneTot1: number = 0
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneTot1 = this.formatToNum(zoneTot1, totalSumAR[zoneAR[count2]]);
          tempObj[zoneAR[count2]] = totalSumAR[zoneAR[count2]];

        }
        tempObj[labelstr1] = zoneTot1;

        this.zoneAPACCAR.push(tempObj, this.zoneAPACCAR.length);

        var zoneVal = "";
        this.myGrid5Arr.push("BilledWeight");
        this.myGrid5.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid5Arr.push(zoneVal);
          this.myGrid5.push(zoneVal);

        }


      }

      //---------------------------------------------siva------------------ Average Package Cost Report(FRT & ACC) -----------------------------------

      StringAR = [];
      totalAR = [];
      zoneValue = 0;
      var exist = false;
      var indexNo = 0;
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";
        var existFlag = false;

        var zoneFOObj = this.zonedistributionTempAC[count1];
        var tempZoneObj1: any = {};

        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        var zoneTot: number = 0;
        for (var zoLoop = 0; zoLoop < this.zoneAvgFRTACCAR.length; zoLoop++) {
          tempZoneObj1 = this.zoneAvgFRTACCAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {
            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number((Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative) + Number(tempZoneObj1[zoneFOObj.zoneCode])).toFixed(2));//Number(Number(tempZoneObj1[zoneFOObj.zoneCode]).toFixed(2));
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = Number(tempZoneObj1[labelstr1]) + Number((Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
                totalAR[count2] = Number(totalAR[count2]) + Number((Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
              }
            }
            tempZoneObj1[labelstr1] = Number(zoneTot.toFixed(2));
            existFlag = true;
          }

        }
        if (!existFlag) {
          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else
              totalAR[count2] = zoneValue;

            zoneTot = zoneTot + zoneValue
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot.toFixed(2);
          this.zoneAvgFRTACCAR.push(tempObj);
        }
      }


      for (var avgLoop = 0; avgLoop < this.zoneAvgFRTACCAR.length; avgLoop++) {

        totalAR = [];
        var avgsumTot: number = 0;
        var zoneCodeTemp = [];
        var zoneAvgTot: number = 0
        var zoneSumAvgTot: number = 0

        var labelstr1 = "Total Net Amount";
        let tempAvgObj: any = this.zoneAvgFRTACCAR[avgLoop];
        let tempPCObj: any = this.zonePCAR[avgLoop];
        for (var count5 = 0; count5 < zoneAR.length; count5++) {
          if ((tempAvgObj[zoneAR[count5]]) != "0.00" && (tempAvgObj[zoneAR[count5]]) != "0" && (tempAvgObj[zoneAR[count5]]) != "" && (tempAvgObj[zoneAR[count5]]) != null
            && (tempPCObj[zoneAR[count5]]) != "0.00" && (tempPCObj[zoneAR[count5]]) != "0" && (tempPCObj[zoneAR[count5]]) != "" && (tempPCObj[zoneAR[count5]]) != null) {
            tempAvgObj[zoneAR[count5]] = Number((tempAvgObj[zoneAR[count5]]) / (tempPCObj[zoneAR[count5]])).toFixed(2);

            ZoneAvgValue = tempAvgObj[zoneAR[count5]];
            totalAR[zoneAR[count5]] = ZoneAvgValue;  //Adding the average value for each zone code
            zoneCodeTemp[count5] = zoneAR[count5];   //Getting the zone code label.

            zoneAvgTot = Number(zoneAvgTot) + Number(ZoneAvgValue);  //Sum the total net amount          
          }
          else {
            totalAR[zoneAR[count5]] = 0;       //If zone code value is null then set as 0
            zoneCodeTemp[count5] = zoneAR[count5];
          }

        }

        //calulating the total sum values for each zone
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneCodeTemp[count2]) {
            if (avgLoop == 0) {
              totalSumAR[zoneAR[count2]] = totalAR[zoneAR[count2]];
            }
            else {
              totalSumAR[zoneAR[count2]] = this.formatToNum((totalSumAR[zoneAR[count2]]), (totalAR[zoneAR[count2]]));

            }
          }
        }

        tempAvgObj[labelstr1] = Number(zoneAvgTot).toFixed(2);
      }

      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";

        var zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        var zoneTot1: number = 0;
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneTot1 = this.formatToNum(zoneTot1, totalSumAR[zoneAR[count2]]);

          tempObj[zoneAR[count2]] = Number(Number(totalSumAR[zoneAR[count2]]).toFixed(2));

        }
        tempObj[labelstr1] = zoneTot1;
        this.zoneAvgFRTACCAR.push(tempObj, this.zoneAvgFRTACCAR.length);


        var zoneVal = "";
        this.myGrid8Arr.push("BilledWeight");
        this.myGrid8.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid8Arr.push(zoneVal);

          this.myGrid8.push(zoneVal);
        }

      }


      //--------------------------------------------------------------- Total Package Cost Report(FRT) -----------------------------------

      StringAR = [];
      totalAR = [];
      zoneValue = 0;
      var exist = false;
      var indexNo = 0;
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";   //FD07
        var existFlag = false;

        var zoneFOObj = this.zonedistributionTempAC[count1];
        var tempZoneObj1: any = {};


        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        var zoneTot: number = 0;
        for (var zoLoop = 0; zoLoop < this.zoneTPFRTAR.length; zoLoop++) {
          tempZoneObj1 = this.zoneTPFRTAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {
            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfNegative) + Number(tempZoneObj1[zoneFOObj.zoneCode])).toFixed(2))//Number(Number(tempZoneObj1[zoneFOObj.zoneCode]).toFixed(2));
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = Number(tempZoneObj1[labelstr1]) + Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
                totalAR[count2] = Number(totalAR[count2]) + Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
              }
            }
            tempZoneObj1[labelstr1] = zoneTot.toFixed(2);
            existFlag = true;
          }

        }
        if (!existFlag) {
          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else
              totalAR[count2] = zoneValue;

            zoneTot = zoneTot + zoneValue;
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot;
          this.zoneTPFRTAR.push(tempObj);
        }
      }
      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";

        var zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        var zoneTot1: number = 0
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          zoneTot1 = this.formatToNum(zoneTot1, totalAR[count2]);
          tempObj[zoneAR[count2]] = Number(Number(totalAR[count2]).toFixed(2));

        }
        tempObj[labelstr1] = Number(zoneTot1.toFixed(2));
        this.zoneTPFRTAR.push(tempObj, this.zoneTPFRTAR.length);

        var zoneVal = "";
        this.myGrid4Arr.push("BilledWeight");
        this.myGrid4.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid4Arr.push(zoneVal);

          this.myGrid4.push(zoneVal);
        }
        this.myGrid4.push("Total Net Amount");
        this.myGrid4Arr.push("Total Net Amount");
      }

      //--------------------------------------------------------------- Total Package Cost Report(ACC) -----------------------------------

      StringAR = [];
      totalAR = [];
      zoneValue = 0;
      var exist = false;
      var indexNo = 0;
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";  //FD07

        var existFlag = false;

        var zoneFOObj = this.zonedistributionTempAC[count1];
        var tempZoneObj1: any = {};

        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        var zoneTot: number = 0;
        for (var zoLoop = 0; zoLoop < this.zoneTPACCAR.length; zoLoop++) {
          tempZoneObj1 = this.zoneTPACCAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {
            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number(Number(Number(zoneFOObj.totalOfPositive) + Number(tempZoneObj1[zoneFOObj.zoneCode])).toFixed(2))//Number(Number(tempZoneObj1[zoneFOObj.zoneCode]).toFixed(2));
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = Number(tempZoneObj1[labelstr1]) + Number(Number(zoneFOObj.totalOfPositive).toFixed(2));
                totalAR[count2] = Number(totalAR[count2]) + Number(Number(zoneFOObj.totalOfPositive).toFixed(2));
              }
            }
            tempZoneObj1[labelstr1] = zoneTot.toFixed(2);
            existFlag = true;
          }

        }
        if (!existFlag) {
          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(Number(zoneFOObj.totalOfPositive).toFixed(2));
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else
              totalAR[count2] = zoneValue;

            zoneTot = zoneTot + zoneValue
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot.toFixed(2);
          this.zoneTPACCAR.push(tempObj);
        }
      }
      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";

        var zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        var zoneTot1: number = 0
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          zoneTot1 = this.formatToNum(zoneTot1, totalAR[count2]);
          tempObj[zoneAR[count2]] = Number(Number(totalAR[count2]).toFixed(2));

        }
        tempObj[labelstr1] = Number(zoneTot1.toFixed(2));
        this.zoneTPACCAR.push(tempObj, this.zoneTPACCAR.length);

        var zoneVal = "";
        this.myGrid3Arr.push("BilledWeight");
        this.myGrid3.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid3Arr.push(zoneVal);

          this.myGrid3.push(zoneVal);
        }
        this.myGrid3.push("Total Net Amount");
        this.myGrid3Arr.push("Total Net Amount");
      }

      //--------------------------------------------------------------- Total Package Cost Report(FRT & ACC) -----------------------------------

      StringAR = [];
      totalAR = [];
      zoneValue = 0;
      var exist = false;
      var indexNo = 0;
      for (var count1 = 0; count1 < this.zonedistributionTempAC.length; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";
        var existFlag = false;

        var zoneFOObj = this.zonedistributionTempAC[count1];
        var tempZoneObj1: any = {};

        tempObj[labelstr] = zoneFOObj.ratedWeightAmount;
        var zoneTot: number = 0;
        for (var zoLoop = 0; zoLoop < this.zoneFRTACCAR.length; zoLoop++) {
          tempZoneObj1 = this.zoneFRTACCAR[zoLoop];
          if (tempZoneObj1 != null && tempZoneObj1.BilledWeight == zoneFOObj.ratedWeightAmount) {
            for (var count2 = 0; count2 < zoneAR.length; count2++) {
              if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode) {
                zoneValue = Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative) + Number(tempZoneObj1[zoneFOObj.zoneCode])).toFixed(2));//Number(Number(tempZoneObj1[zoneFOObj.zoneCode]).toFixed(2));
                tempZoneObj1[zoneAR[count2]] = zoneValue;
                zoneTot = Number(tempZoneObj1[labelstr1]) + Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
                totalAR[count2] = Number(totalAR[count2]) + Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
              }
            }
            tempZoneObj1[labelstr1] = Number(zoneTot.toFixed(2));
            existFlag = true;
          }

        }
        if (!existFlag) {
          for (var count2 = 0; count2 < zoneAR.length; count2++) {
            if (zoneFOObj.zoneCode != null && zoneFOObj.zoneCode != "" && zoneAR[count2] == zoneFOObj.zoneCode)
              zoneValue = Number(Number(Number(zoneFOObj.transportationChargeAmount) + Number(zoneFOObj.totalOfPositive) + Number(zoneFOObj.totalOfNegative)).toFixed(2));
            else
              zoneValue = 0;
            if (totalAR[count2] != null)
              totalAR[count2] = totalAR[count2] + zoneValue;
            else
              totalAR[count2] = zoneValue;

            zoneTot = zoneTot + zoneValue
            tempObj[zoneAR[count2]] = zoneValue;

          }
          tempObj[labelstr1] = zoneTot.toFixed(2);
          this.zoneFRTACCAR.push(tempObj);
        }
      }
      for (var count1 = 0; count1 < 1; count1++) {
        StringAR1 = [];
        tempObj = {};
        var labelstr = "BilledWeight";
        var labelstr1 = "Total Net Amount";

        var zoneFOObj = this.zonedistributionTempAC[0];
        if (zoneFOObj.ratedWeightAmount != null && zoneFOObj.ratedWeightAmount != "")
          tempObj[labelstr] = "Total";
        var zoneTot1: number = 0
        for (var count2 = 0; count2 < zoneAR.length; count2++) {
          zoneTot1 = zoneTot1 + totalAR[count2]
          tempObj[zoneAR[count2]] = Number(Number(totalAR[count2]).toFixed(2));

        }
        tempObj[labelstr1] = Number(zoneTot1.toFixed(2));
        this.zoneFRTACCAR.push(tempObj, this.zoneFRTACCAR.length);

        var zoneVal = "";
        this.myGrid1Arr.push("BilledWeight");
        this.myGrid1.push("Billed Weight");
        for (var count2 = 0; count2 < zoneAR.length; count2++) {

          zoneVal = zoneAR[count2].toString();
          this.myGrid1Arr.push(zoneVal);

          this.myGrid1.push(zoneVal);
        }
        this.myGrid1.push("Total Net Amount");
        this.myGrid1Arr.push("Total Net Amount");
      }

    }
    else {
      tempObj = {};
      let tempObj1: any = {};
      let labelstr = "BilledWeight";
      let labelstr1 = "Total Net Amount";
      let labelstr2 = "Total Packages";
      tempObj1[labelstr] = "Total";
      tempObj1[labelstr2] = "0";
      tempObj[labelstr] = "Total";
      tempObj[labelstr1] = "0.00";
      this.myGrid1 = [];
      this.myGrid3 = [];
      this.myGrid4 = [];
      this.myGrid5 = [];
      this.myGrid6 = [];
      this.myGrid7 = [];
      this.myGrid8 = [];
      this.myGrid1Arr = [];
      this.myGrid3Arr = [];
      this.myGrid4Arr = [];
      this.myGrid5Arr = [];
      this.myGrid6Arr = [];
      this.myGrid7Arr = [];
      this.myGrid8Arr = [];

      this.zonePCAR.push(tempObj1);
      this.zoneAPFRTAR.push(tempObj);
      this.zoneAPACCAR.push(tempObj);
      this.zoneTPFRTAR.push(tempObj);
      this.zoneTPACCAR.push(tempObj);
      this.zoneFRTACCAR.push(tempObj);
      this.zoneAvgFRTACCAR.push(tempObj);
      this.myGrid7Arr.push("BilledWeight");
      this.myGrid7.push("Billed Weight");
      this.myGrid7.push("Total Packages");
      this.myGrid7Arr.push("Total Packages");


      this.myGrid6Arr.push("BilledWeight");
      this.myGrid6.push("Billed Weight");
      this.myGrid6.push("Total Net Amount");
      this.myGrid6Arr.push("Total Net Amount");

      this.myGrid5Arr.push("BilledWeight");
      this.myGrid5.push("Billed Weight");
      this.myGrid5.push("Total Net Amount");
      this.myGrid5Arr.push("Total Net Amount");

      this.myGrid4Arr.push("BilledWeight");
      this.myGrid4.push("Billed Weight");
      this.myGrid4.push("Total Net Amount");
      this.myGrid4Arr.push("Total Net Amount");

      this.myGrid3Arr.push("BilledWeight");
      this.myGrid3.push("Billed Weight");
      this.myGrid3.push("Total Net Amount");
      this.myGrid3Arr.push("Total Net Amount");

      this.myGrid1Arr.push("BilledWeight");
      this.myGrid1.push("Billed Weight");
      this.myGrid1.push("Total Net Amount");
      this.myGrid1Arr.push("Total Net Amount");

      this.myGrid8Arr.push("BilledWeight");
      this.myGrid8.push("Billed Weight");
      this.myGrid8.push("Total Net Amount");
      this.myGrid8Arr.push("Total Net Amount");

    }

    if (this.fedexFormGroup.get('reporttype')?.value == "Package Count Report") {
      this.vbpackage_FedEx_visible = true;
      this.vbpackage_FedEx_includeInLayout = true;
      this.vbavgfrt_FedEx_visible = false;
      this.vbavgfrt_FedEx_includeInLayout = false;
      this.vbavgacc_FedEx_visible = false;
      this.vbavgacc_FedEx_includeInLayout = false;
      this.vbpackagefrt_FedEx_visible = false;
      this.vbpackagefrt_FedEx_includeInLayout = false;
      this.vbaccscc_FedEx_visible = false;
      this.vbaccscc_FedEx_includeInLayout = false;
      this.vbfrtacc_FedEx_visible = false;
      this.vbfrtacc_FedEx_includeInLayout = false;

      this.vbavgfrtacc_FedEx_visible = false;
      this.vbavgfrtacc_FedEx_includeInLayout = false;

    }
    else if (this.fedexFormGroup.get('reporttype')?.value == "Avg Package Cost Report(FRT)") {
      this.vbpackage_FedEx_visible = false;
      this.vbpackage_FedEx_includeInLayout = false;
      this.vbavgfrt_FedEx_visible = true;
      this.vbavgfrt_FedEx_includeInLayout = true;
      this.vbavgacc_FedEx_visible = false;
      this.vbavgacc_FedEx_includeInLayout = false;
      this.vbpackagefrt_FedEx_visible = false;
      this.vbpackagefrt_FedEx_includeInLayout = false;
      this.vbaccscc_FedEx_visible = false;
      this.vbaccscc_FedEx_includeInLayout = false;
      this.vbfrtacc_FedEx_visible = false;
      this.vbfrtacc_FedEx_includeInLayout = false;


      this.vbavgfrtacc_FedEx_visible = false;
      this.vbavgfrtacc_FedEx_includeInLayout = false;

    }
    else if (this.fedexFormGroup.get('reporttype')?.value == "Avg Package Cost Report(ACC)") {
      this.vbpackage_FedEx_visible = false;
      this.vbpackage_FedEx_includeInLayout = false;
      this.vbavgfrt_FedEx_visible = false;
      this.vbavgfrt_FedEx_includeInLayout = false;
      this.vbavgacc_FedEx_visible = true;
      this.vbavgacc_FedEx_includeInLayout = true;
      this.vbpackagefrt_FedEx_visible = false;
      this.vbpackagefrt_FedEx_includeInLayout = false;
      this.vbaccscc_FedEx_visible = false;
      this.vbaccscc_FedEx_includeInLayout = false;
      this.vbfrtacc_FedEx_visible = false;
      this.vbfrtacc_FedEx_includeInLayout = false;


      this.vbavgfrtacc_FedEx_visible = false;
      this.vbavgfrtacc_FedEx_includeInLayout = false;

    }


    else if (this.fedexFormGroup.get('reporttype')?.value == "Avg Package Cost Report(FRT & ACC)") {
      this.vbpackage_FedEx_visible = false;
      this.vbpackage_FedEx_includeInLayout = false;
      this.vbavgfrt_FedEx_visible = false;
      this.vbavgfrt_FedEx_includeInLayout = false;
      this.vbavgacc_FedEx_visible = false;
      this.vbavgacc_FedEx_includeInLayout = false;
      this.vbpackagefrt_FedEx_visible = false;
      this.vbpackagefrt_FedEx_includeInLayout = false;
      this.vbaccscc_FedEx_visible = false;
      this.vbaccscc_FedEx_includeInLayout = false;
      this.vbfrtacc_FedEx_visible = false;
      this.vbfrtacc_FedEx_includeInLayout = false;


      this.vbavgfrtacc_FedEx_visible = true;
      this.vbavgfrtacc_FedEx_includeInLayout = true;

    }

    else if (this.fedexFormGroup.get('reporttype')?.value == "Total Package Cost Report(FRT)") {
      this.vbpackage_FedEx_visible = false;
      this.vbpackage_FedEx_includeInLayout = false;
      this.vbavgfrt_FedEx_visible = false;
      this.vbavgfrt_FedEx_includeInLayout = false;
      this.vbavgacc_FedEx_visible = false;
      this.vbavgacc_FedEx_includeInLayout = false;
      this.vbpackagefrt_FedEx_visible = true;
      this.vbpackagefrt_FedEx_includeInLayout = true;
      this.vbaccscc_FedEx_visible = false;
      this.vbaccscc_FedEx_includeInLayout = false;
      this.vbfrtacc_FedEx_visible = false;
      this.vbfrtacc_FedEx_includeInLayout = false;


      this.vbavgfrtacc_FedEx_visible = false;
      this.vbavgfrtacc_FedEx_includeInLayout = false;

    }
    else if (this.fedexFormGroup.get('reporttype')?.value == "Total Package Cost Report(ACC)") {
      this.vbpackage_FedEx_visible = false;
      this.vbpackage_FedEx_includeInLayout = false;
      this.vbavgfrt_FedEx_visible = false;
      this.vbavgfrt_FedEx_includeInLayout = false;
      this.vbavgacc_FedEx_visible = false;
      this.vbavgacc_FedEx_includeInLayout = false;
      this.vbpackagefrt_FedEx_visible = false;
      this.vbpackagefrt_FedEx_includeInLayout = false;
      this.vbaccscc_FedEx_visible = true;
      this.vbaccscc_FedEx_includeInLayout = true;
      this.vbfrtacc_FedEx_visible = false;
      this.vbfrtacc_FedEx_includeInLayout = false;


      this.vbavgfrtacc_FedEx_visible = false;
      this.vbavgfrtacc_FedEx_includeInLayout = false;

    }

    else if (this.fedexFormGroup.get('reporttype')?.value == "Total Package Cost Report(FRT & ACC)") {
      this.vbpackage_FedEx_visible = false;
      this.vbpackage_FedEx_includeInLayout = false;
      this.vbavgfrt_FedEx_visible = false;
      this.vbavgfrt_FedEx_includeInLayout = false;
      this.vbavgacc_FedEx_visible = false;
      this.vbavgacc_FedEx_includeInLayout = false;
      this.vbpackagefrt_FedEx_visible = false;
      this.vbpackagefrt_FedEx_includeInLayout = false;
      this.vbaccscc_FedEx_visible = false;
      this.vbaccscc_FedEx_includeInLayout = false;
      this.vbfrtacc_FedEx_visible = true;
      this.vbfrtacc_FedEx_includeInLayout = true;


      this.vbavgfrtacc_FedEx_visible = false;
      this.vbavgfrtacc_FedEx_includeInLayout = false;

    }
    else {

      this.vbpackage_FedEx_visible = true;
      this.vbpackage_FedEx_includeInLayout = true;
      this.vbavgfrt_FedEx_visible = true;
      this.vbavgfrt_FedEx_includeInLayout = true;
      this.vbavgacc_FedEx_visible = true;
      this.vbavgacc_FedEx_includeInLayout = true;
      this.vbpackagefrt_FedEx_visible = true;
      this.vbpackagefrt_FedEx_includeInLayout = true;
      this.vbaccscc_FedEx_visible = true;
      this.vbaccscc_FedEx_includeInLayout = true;
      this.vbfrtacc_FedEx_visible = true;
      this.vbfrtacc_FedEx_includeInLayout = true; this.zoneAPFRTAR.findIndex


      this.vbavgfrtacc_FedEx_visible = true;
      this.vbavgfrtacc_FedEx_includeInLayout = true;

    }
    const index = this.zoneAPFRTAR.findIndex((x: any) => x.BilledWeight === "Total");
    this.zoneAPFRTAR.splice(index, 1);
    const index1 = this.zoneAPACCAR.findIndex((x: any) => x.BilledWeight === "Total");
    this.zoneAPACCAR.splice(index1, 1);
    const index2 = this.zoneAvgFRTACCAR.findIndex((x: any) => x.BilledWeight === "Total");
    this.zoneAvgFRTACCAR.splice(index2, 1);
    this.sortArr(this.zonePCAR)
    this.sortArr(this.zoneAPFRTAR)
    this.sortArr(this.zoneAPACCAR)
    this.sortArr(this.zoneAvgFRTACCAR)
    this.sortArr(this.zoneTPFRTAR)
    this.sortArr(this.zoneTPACCAR)
    this.sortArr(this.zoneFRTACCAR)
    this.cd.detectChanges();
  }

  sortArr(arr: any) {
    arr.sort((a: any, b: any) => {
      a = a["BilledWeight"] ? a["BilledWeight"] : "z";
      b = b["BilledWeight"] ? b["BilledWeight"] : "z";
      return a.localeCompare(b, undefined, { 'numeric': true }) * this.sortDir;
    });

  }
  removeDuplicates(arr: any) {
    var uniqueArray = [];
    var uniqueArraySorted = [];
    for (var i = 0; i < arr.length; i++) {
      if (uniqueArray.indexOf(arr[i]) === -1) {
        uniqueArray.push(arr[i]);
      }
    }
    uniqueArraySorted = uniqueArray.sort();
    return uniqueArraySorted;
  }

  formatToNum(param1: any, param2: any) {
    var paramSum;
    paramSum = Number(param1) + Number(param2);
    return Number((paramSum).toFixed(2));
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
    var tempdateFrom = this.fedexFormGroup.get('fromdate')?.value;
    var tempdateTo = this.fedexFormGroup.get('todate')?.value;
    var validdateFrom = this.datePipe.transform(tempdateFrom, "yyyy-MM-dd");
    var validdateTo = this.datePipe.transform(tempdateTo, "yyyy-MM-dd");

    this.fromDateFormat = this.datePipe.transform(tempdateFrom, "MMM dd,yyyy");
    this.toDateFormat = this.datePipe.transform(tempdateTo, "MMM dd,yyyy");
    var boolRes = this.compareTwoDatesFedex();
    if (boolRes != false) {
      this.openLoading();
      this.fedexFormGroup.get('fromdate')?.setValue(validdateFrom);
      this.fedexFormGroup.get('fromDate')?.setValue(validdateFrom);
      this.fedexFormGroup.get('todate')?.setValue(validdateTo);
      this.fedexFormGroup.get('toDate')?.setValue(validdateTo);
      await this.fetchzonedistributionFedEx();
      this.fedexFormGroup.get('fromdate')?.setValue(new Date(tempdateFrom));
      this.fedexFormGroup.get('fromDate')?.setValue(new Date(tempdateFrom));
      this.fedexFormGroup.get('todate')?.setValue(new Date(tempdateTo));
      this.fedexFormGroup.get('toDate')?.setValue(new Date(tempdateTo));
    }
  }

  compareTwoDatesFedex() {
    var dateFr = this.fedexFormGroup.get('fromdate')?.value;
    var dateT = this.fedexFormGroup.get('todate')?.value;
    var dateFromYear = this.datePipe.transform(dateFr, "yyyy");
    var dateToYear = this.datePipe.transform(dateT, "yyyy");
    if (dateFromYear != dateToYear) {
      this.openModal("Please Select Same Year Range for From Date and To Date");
      return false;
    }
    return true;
  }

  image1_clickHandlerFedex() {
    var currentDate = new Date();
    if (this.fedexFormGroup.get('datetype')?.value == "InvoiceDate") {
      this.fedexFormGroup.get('accountNumber')?.setValue("InvoiceDate");
      this.fedexFormGroup.get('accNo')?.setValue("InvoiceDate");
      this.fedexFormGroup.get('chargeGroup')?.setValue("InvoiceDate");
    } else {
      this.fedexFormGroup.get('accountNumber')?.setValue("TransactionDate");
      this.fedexFormGroup.get('accNo')?.setValue("TransactionDate");
      this.fedexFormGroup.get('chargeGroup')?.setValue("TransactionDate");
    }
    this.fedexFormGroup.get('requesteddttm')?.setValue(currentDate);
    this.fedexFormGroup.get('createdDate')?.setValue(currentDate);
    this.fedexFormGroup.get('reportName')?.setValue("ZONE_DISTRIBUTION_MODULE");
    this.fedexFormGroup.get('modulename')?.setValue("Zone_Distribution");
    this.fedexFormGroup.get('reportType')?.setValue("Zone Distribution Module");
    this.fedexFormGroup.get('status')?.setValue("IN QUEUE");
    this.fedexFormGroup.get('moduleName')?.setValue(this.modulename);
    this.fedexFormGroup.get('login_id')?.setValue(this.loginId + "");
    this.fedexFormGroup.get('loginId')?.setValue(0);
    var clientName = this.userProfifle.clientName.replace(/[ ]/g, "_");
    this.fedexFormGroup.get('clientName')?.setValue(clientName);
    this.fedexFormGroup.get('loginId')?.setValue(0);
    var tempdateFrom = this.fedexFormGroup.get('fromdate')?.value;
    var tempdateTo = this.fedexFormGroup.get('todate')?.value;
    var validdateFrom = this.datePipe.transform(tempdateFrom, "yyyy-MM-dd");
    var validdateTo = this.datePipe.transform(tempdateTo, "yyyy-MM-dd");
    this.fedexFormGroup.get('fromdate')?.setValue(validdateFrom);
    this.fedexFormGroup.get('fromDate')?.setValue(validdateFrom);
    this.fedexFormGroup.get('todate')?.setValue(validdateTo);
    this.fedexFormGroup.get('toDate')?.setValue(validdateTo);
    this.fedexFormGroup.get('chargeType')?.setValue(this.fedexFormGroup.get('chargeDescription')?.value);
    var reports = this.fedexFormGroup.get('reporttype')?.value;
    reports = reports.replace(/[&]/g, "and");
    this.fedexFormGroup.get('chargeDesc')?.setValue(reports);
    this.httpfedexService.runReport(this.fedexFormGroup.value).subscribe({
      next: (result) => {
        this.saveOrUpdateReportLogResultFedex(result);
      }, error: errror => {
      }
    });
    this.fedexFormGroup.get('fromdate')?.setValue(new Date(tempdateFrom));
    this.fedexFormGroup.get('fromDate')?.setValue(new Date(tempdateFrom));
    this.fedexFormGroup.get('todate')?.setValue(new Date(tempdateTo));
    this.fedexFormGroup.get('toDate')?.setValue(new Date(tempdateTo));
  }


  saveOrUpdateReportLogResultFedex(result: any) {
    this.reportsFormGroup.get('reportLogId')?.setValue(result['reportLogId']);
    this.reportsFormGroup.get('t002ClientProfileobj.clientId')?.setValue(result['t002ClientProfileobj']['clientId']);
    this.commonService._setIntervalFedEx(this.reportsFormGroup.value);
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