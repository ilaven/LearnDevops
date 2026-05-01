import { Observable, Subscription, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  url_path = environment.urlPath;
  crm_Url = environment.crmUrl;
  crm_Urlnew = environment.crmUrlnew;
  constructor(private httpClient: HttpClient) { }
  public loadClientProfile(clientProfileObj: any): Observable<any> {
    return this.httpClient.post<T001ClientLoginCredential>(this.url_path + "Admin/LoadClientProfile", clientProfileObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  private handleError(error: any): Observable<any> {
    let message = 'Something went wrong';

    if (error?.error?.message) {
      message = error.error.message;
    }

    return throwError(() => new Error(message));
  }
  public validateLoginDetails(t001ClientLoginCredential: any) {
    return this.httpClient.post<T001ClientLoginCredential>(this.url_path + "Admin/Login", t001ClientLoginCredential)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchDashBoard
  public fetchDashBoard(fetchDashBoardObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchDashBoard", fetchDashBoardObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchallzone
  public fetchallzone(fetchallzoneObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchallzone", fetchallzoneObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack
  public fetchT004Rymax_chargeBack(fetchT004Rymax_chargeBackObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack", fetchT004Rymax_chargeBackObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack_Piechart
  public fetchT004Rymax_chargeBack_Piechart(fetchT004Rymax_chargeBack_PiechartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_Piechart", fetchT004Rymax_chargeBack_PiechartObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchFedExComparisionReportaddataAsOf
  public fetchFedExComparisionReportadataAsOf(fetchFedExComparisionReportadataAsOfObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "UPS/fetchFedExComparisionReportDataAsOf", fetchFedExComparisionReportadataAsOfObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public runReport(runReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/runReport", runReportObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchReportObjStatus
  public fetchReportObjStatus(fetchReportObjStatusObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/fetchReportObjStatus", fetchReportObjStatusObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public reportServlet(urlParam: any) {
    var objectUrl = this.url_path + "Reportservlet?" + urlParam;
    window.open(objectUrl, "_self");
  }
  //fetchT004Rymax_chargeBack_select
  public fetchT004Rymax_chargeBack_select(fetchT004Rymax_chargeBack_selectObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_select", fetchT004Rymax_chargeBack_selectObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_SccVolumebyService
  public fetchT004Rymax_SccVolumebyService(fetchT004Rymax_SccVolumebyServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_SccVolumebyService", fetchT004Rymax_SccVolumebyServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public compareUpsData(compareUpsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "UPS/fetchUPSComparisionReportData", compareUpsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeDescription_Service
  public fetchT004Rymax_chargeDescription_Service(fetchT004Rymax_chargeDescription_ServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeDescription_Service", fetchT004Rymax_chargeDescription_ServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_VolumebyService
  public fetchT004Rymax_VolumebyService(fetchT004Rymax_VolumebyServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_VolumebyService", fetchT004Rymax_VolumebyServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchselectedzone
  public fetchselectedzone(fetchselectedzoneObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchselectedzone", fetchselectedzoneObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_By_Services
  public fetchT004Rymax_By_Services(fetchT004Rymax_By_ServicesObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_By_Services", fetchT004Rymax_By_ServicesObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT000Service_Acc
  public fetchT000Service_Acc(fetchT000Service_AccObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT000Service_Acc", fetchT000Service_AccObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack_ByMonth
  public fetchT004Rymax_chargeBack_ByMonth(fetchT004Rymax_chargeBack_ByMonthObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_ByMonth", fetchT004Rymax_chargeBack_ByMonthObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack_Piechart_MoreService
  public fetchT004Rymax_chargeBack_Piechart_MoreService(fetchT004Rymax_chargeBack_Piechart_MoreServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_Piechart_MoreService", fetchT004Rymax_chargeBack_Piechart_MoreServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack_Piechart_MoreService2
  public fetchT004Rymax_chargeBack_Piechart_MoreService2(fetchT004Rymax_chargeBack_Piechart_MoreService2Obj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_Piechart_MoreService2", fetchT004Rymax_chargeBack_Piechart_MoreService2Obj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack_Piechart_MoreService3
  public fetchT004Rymax_chargeBack_Piechart_MoreService3(fetchT004Rymax_chargeBack_Piechart_MoreService3Obj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_Piechart_MoreService3", fetchT004Rymax_chargeBack_Piechart_MoreService3Obj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //saveOrUpdateLogout
  public saveOrUpdateLogout(saveOrUpdateLogoutObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateLogout", saveOrUpdateLogoutObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchdisplay_Heatmap_list
  public fetchdisplay_Heatmap_list(fetchdisplay_Heatmap_listObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchdisplay_Heatmap_list", fetchdisplay_Heatmap_listObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_By_Services
  public fetchCountry_Barchart(fetchCountry_BarchartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchCountry_Barchart", fetchCountry_BarchartObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchCity_Shipment
  public fetchCity_Shipment(fetchCity_ShipmentObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchCity_Shipment", fetchCity_ShipmentObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchdisplay_INT_Heatmap_list
  public fetchdisplay_INT_Heatmap_list(fetchdisplay_INT_Heatmap_listObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchdisplay_INT_Heatmap_list", fetchdisplay_INT_Heatmap_listObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchCity_Shipment
  public fetchInterDashboard_Service(fetchInterDashboard_ServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchInterDashboard_Service", fetchInterDashboard_ServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_chargeBack_select_International
  public fetchT004Rymax_chargeBack_select_International(fetchT004Rymax_chargeBack_select_InternationalObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeBack_select_International", fetchT004Rymax_chargeBack_select_InternationalObj)
      .pipe(map(data => data), catchError(this.handleError));
  }  //fetchT004Rymax_International_chargeBack_ByMonth
  public fetchT004Rymax_International_chargeBack_ByMonth(fetchT004Rymax_International_chargeBack_ByMonthObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_International_chargeBack_ByMonth", fetchT004Rymax_International_chargeBack_ByMonthObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_International_VolumebyService
  public fetchT004Rymax_International_VolumebyService(fetchT004Rymax_International_VolumebyServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_International_VolumebyService", fetchT004Rymax_International_VolumebyServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_International_chargeBack_ByMonth
  public fetchT004Rymax_chargeDescription_International_Service(fetchT004Rymax_chargeDescription_International_ServiceObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT004Rymax_chargeDescription_International_Service", fetchT004Rymax_chargeDescription_International_ServiceObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchT004Rymax_International_chargeBack_ByMonth
  public fetchT000Service_Acc_International(fetchT000Service_Acc_InternationalObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchT000Service_Acc_International", fetchT000Service_Acc_InternationalObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchaccountDetailsUPS - Method Added by 9200
  public fetchaccountDetailsUPS(fetchaccountDetailsUPSObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchaccountDetails", fetchaccountDetailsUPSObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  // fetchCostOptimizationDetails - Method Added by 9200
  public fetchCostOptimizationDetails(fetchCostOptimizationDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchCostOptimizationDetails", fetchCostOptimizationDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //  fetchExecutiveSummaryDetailsUPS - Method Added by 9200
  public fetchExecutiveSummaryDetailsUPS(fetchExecutiveSummaryDetailsUPSObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchExecutiveSummaryDetails", fetchExecutiveSummaryDetailsUPSObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  // fetchServiceLevelUsageSummary - Method Added by 9200
  public fetchServiceLevelUsageSummary(fetchServiceLevelUsageSummaryObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchServiceLevelUsageSummary", fetchServiceLevelUsageSummaryObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchAdvanceChargeDescriptionDetails - Method Added by 9200
  public fetchAdvanceChargeDescriptionDetails(fetchAdvanceChargeDescriptionDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchAdvanceChargeDescriptionDetails", fetchAdvanceChargeDescriptionDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportLog - Method Added by 9200
  public fetchReportLog(fetchReportLogObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "Report/fetchReportLog", fetchReportLogObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //findClientLoginCredential - Method Added by 9200
  public findClientLoginCredential(findClientLoginCredentialObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "Admin/findClientLoginCredential", findClientLoginCredentialObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchzonedistributionUPS  - Method Added by 9200
  public fetchzonedistributionUPS(fetchzonedistributionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchzonedistribution", fetchzonedistributionObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchCharge_list - Method Added by 9200
  public fetchCharge_list(fetchCharge_listObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "Report/fetchCharge_list", fetchCharge_listObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch report access menu Details - Method Added by 9200
  public fetchReportMenuAccessDetails(fetchreportMenuObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "Admin/fetchReportMenuAccessDetails", fetchreportMenuObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportDescription - Method Added by 9200
  public fetchReportDescription(fetchReportDescriptionObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "Report/fetchReportDescription", fetchReportDescriptionObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchClientDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchclientDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchTargetDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchTargetDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchFreightDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchFreightDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //generateProposalCurrentDIM
  generateProposalCurrentDIM(paramObj: any) {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposalCurrentDIM", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch freight edit proposal
  public fetchfreightEditProposal(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchfreightEditProposal", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchFreightDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchFreightDetailsTarget", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchDimFactorDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchDimFactorDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchMinDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchMinDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchAccessorialDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchAccessorialDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsTarget", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch Dim factor edit proposal
  public fetchDimFactor(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchDimFactorEditProposal", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch accessorial eidt proposal
  public fetchAccessorial(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccessorialEditProposal", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch Acc Details Popup
  public fetchAccDetailsPopup(accDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsPopup", accDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public fetchAccessorialLookup(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccessorialLookup", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Fetch account Number for HWT in edit agreement
  public fetchAccountNumber(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccountNumber", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateDiscounts(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateDiscounts", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateDiscountsHWT(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateDiscountsHWT", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Save or Update account Number for HWT in edit agreement
  public saveOrUpdateAccountNumber(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccountNumber", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateAccDiscounts(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccDiscounts", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateAccDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateFreightDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateFreightDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateHWTDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateHWTDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //generateProposal
  public generateProposal(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposal", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Save Accessorial service breakup
  public saveorUpdateServiceBreakup(accDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveorUpdateServiceBreakup", accDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateDIM(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateDIM", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateTargetDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateTargetDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateAccDetailsHistory(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccDetailsHistory", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateHWTDetailsHistory(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateHWTDetailsHistory", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public saveOrUpdateFreightDetailsHistory(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateFreightDetailsHistory", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchAccessorialDetailsExcel(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsExcel", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchSccDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchSccDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsGroundWeightDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPsGroundWeightDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsServZoneDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPSTransactionDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsDimsDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPsDimsDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsLocationsDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPsLocationsDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsGroundDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPSGroundDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsChargeDescDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPSChargeDescription', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsRevenueTierDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUPsRevenueTierDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsExecuteSummaryDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchExecutiveSumaryDetails', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }

  fetchUPsInvoiceSummaryDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchUpsInvoiceSummary', { params })
      .pipe(
        map(data => data),
        catchError(this.handleError)
      );
  }
  fetchAccessorialDetailsTargetExcel(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsTargetExcel", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //generateProposalHWT
  public generateProposalHWT(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposalHWT", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //deleteTargetDetails
  deleteTargetDetails(paramObj: any) {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteTargetDetails", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //deleteFRTRatesheet
  public deleteFRTRatesheet(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteFRTRatesheet", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //restore proposal
  restoreProposal(paramObj: any) {
    return this.httpClient.post(this.url_path + "ContractSummary/restoreProposal", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  deleteService(paramObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteService", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchAccLookUp(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccLookUp", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchAccLookUpTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccLookUpTarget", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Save Agreement No
  saveOrUpdateAgreementNoDetails(paramObj: any) {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAgreementNoDetails", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public deleteDIM(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteDIM", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Generate freightList for Dim change through dashboard
  public generateProposalDIM(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposalDIM", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch Freight Ratesheet
  public fetchFreightRatesheet(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchFreightRatesheet", discountObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch Ratesheet LookUp
  public fetchRatesheetLookUp(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchRatesheetLookUp", discountObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch freight edit proposal
  public fetchMinDetailsPopup(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchMindetailsPopup", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  updateTargetFilter(paramObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + 'ContractSummary/updateTargetFilter', paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch freight edit proposal
  public fetchMinNetdetailsPopup(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchMinNetdetailsPopup", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public fetchCustomerNoteByCarrierType(carrierType: string, clientName: string, targetId?: any, clientId?: any): Observable<any> {
    const params = new HttpParams().set('carrierType', carrierType).set('clientName', clientName)
      .set('targetId', targetId).set('clientId', clientId);
    return this.httpClient.get(
      this.url_path + 'ContractSummary/fetchCustomerNoteByCarrierType',
      { params, responseType: 'text' as 'json' }
    );
  }
//UpdateTheme_ClientProfile
  public UpdateTheme_ClientProfile(UpdateTheme_ClientProfileObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/UpdateTheme_ClientProfile", UpdateTheme_ClientProfileObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public updateCustomerNotesByCarrierType(carrierType: string, clientName: string, note: string, targetId: string, clientId?: number): Observable<string> {
    const payload = {
      carrierType: carrierType,
      clientName: clientName,
      note: note,
      targetId: targetId,
      clientId: clientId
    };

    return this.httpClient.post<string>(this.url_path + 'ContractSummary/updateCustomerNotesbyCarrierType', payload)
      .pipe(
        map(data => data || '0'), // Return '0' if no rows affected or adjust as needed
        catchError(this.handleError)
      );
  }

  //fetchReportScheduler - Method Added by 9200
  public fetchReportScheduler(fetchReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/fetchReportScheduler", fetchReportSchedulerObj)
      .pipe(map((data: any) => data), catchError(this.handleError));

  }

  //add mail in detail reports report scheduler - Method Added by 9200
  public addMailId(addMailObj: any) {
    return this.httpClient.post(this.url_path + "Report/addMailId", addMailObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //updateReportScheduler - Method Added by 9200
  public updateReportScheduler(updateReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/updateReportScheduler", updateReportSchedulerObj)
      .pipe(map((data: any) => data), catchError(this.handleError));

  }

  //fullinvoiceReport - Method Added by 9200
  public fullinvoiceReport(fullinvoiceReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/fullinvoiceReport", fullinvoiceReportObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fullinvoiceReportaccount - Method Added by 9200
  public fullinvoiceReportaccount(fullinvoiceReportaccountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/fullinvoiceReportaccount", fullinvoiceReportaccountObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fullinvoiceReporttotal  - Method Added by 9200
  public fullinvoiceReporttotal(fullinvoiceReporttotalObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/fullinvoiceReporttotal", fullinvoiceReporttotalObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update contract saving analysis - Method Added by 9200
  public update_ContractSavings(updateContractSavingsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/update_ContractSavings", updateContractSavingsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetch_ContractSavings - Method Added by 9200
  public fetch_ContractSavings(Fetch_ContractSavingsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/Fetch_ContractSavings", Fetch_ContractSavingsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Sumofcontractsumary - Method Added by 9200
  public Sumofcontractsumary(SumofcontractsumaryObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/Sumofcontractsumary", SumofcontractsumaryObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchcategory
  public fetchcategory(fetchcategoryObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchcategory", fetchcategoryObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //supervisorclientpassword
  public supervisorclientpassword(supervisorclientpasswordObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/supervisorclientpassword", supervisorclientpasswordObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchaveragediscount
  public fetchaveragediscount(fetchaveragediscountObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchaveragediscount", fetchaveragediscountObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //saveOrUpdateClient
  public saveOrUpdateClient(saveOrUpdateClientObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateClient", saveOrUpdateClientObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //saveOrUpdateGridClientmenuList
  public saveOrUpdateGridClientmenuList(saveOrUpdateGridClientmenuListObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateGridClientmenuList", saveOrUpdateGridClientmenuListObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //AddUserName_ClientLoginCredential
  public AddUserName_ClientLoginCredential(AddUserName_ClientLoginCredentialObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/AddUserName_ClientLoginCredential", AddUserName_ClientLoginCredentialObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //UpdateUserName_ClientLoginCredential
  public UpdateUserName_ClientLoginCredential(UpdateUserName_ClientLoginCredentialObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/UpdateUserName_ClientLoginCredential", UpdateUserName_ClientLoginCredentialObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //deleteUserName_ClientLoginCredential
  public deleteUserName_ClientLoginCredential(deleteUserName_ClientLoginCredentialObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/deleteUserName_ClientLoginCredential", deleteUserName_ClientLoginCredentialObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
   //saveOrUpdateClientBilling
  public saveOrUpdateClientBilling(saveOrUpdateClientBillingObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateClientBilling", saveOrUpdateClientBillingObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //getStatusList
  public getStatusList(getStatusListObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/getStatusList", getStatusListObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchactiveClient
  public fetchactiveClient(fetchactiveClientObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchactiveClient", fetchactiveClientObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch Plan Details header - Method Added by 9200
  public fetchplanDetails(fetchplanDetailsObj: any) {
    return this.httpClient.post(this.url_path + "Admin/fetchplanDetails", fetchplanDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Account Number Sort Order - Method Added by 9200
  public insertOrUpdateAccountSortOrder(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/insertOrUpdateAccountSortOrder", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //get Country Code - Method Added by 9200
  public getCountryCode(): Observable<any> {
    const headers = new HttpHeaders({ 'X-API-Key': 'B8D6D90F-B6C6-4E6F-8413-00B6F978EDAB' });
    return this.httpClient.get(this.crm_Urlnew + "api/getCountryCode", { headers })
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Nick Name AccountNumber - Method Added by 9200
  public updateAccountNumber(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/updateAccountNumber", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //get State List - Method Added by 9200
  public getStateList(countryObj: any): Observable<any> {
    const headers = new HttpHeaders({ 'X-API-Key': 'B8D6D90F-B6C6-4E6F-8413-00B6F978EDAB' });
    return this.httpClient.get(this.crm_Urlnew + "api/getStateListByCountry?country=" + countryObj, { headers })
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //save Or Update Account Address Details - Method Added by 9200
  public accountNumberSaveorUpdate(paramObj: any) {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateAccountAddressDetails", paramObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //upsert Account Address - Method Added by 9200
  public upsertAccountAddress(paramObj: any): Observable<any> {
    const headers = new HttpHeaders({ 'X-API-Key': 'B8D6D90F-B6C6-4E6F-8413-00B6F978EDAB' });
    return this.httpClient.post(this.crm_Urlnew + "api/upsertAccountAddress", paramObj, { headers })
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Nick Name PlanNumber  - Method Added by 9200 
  public updatePlanNumber(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/updatePlanNumber", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetchUserLogin
  public fetchUserLogin(fetchUserLoginObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchUserLogin", fetchUserLoginObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchactiveinactiveClient
  public fetchactiveinactiveClient(fetchactiveinactiveClientObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchactiveinactiveClient", fetchactiveinactiveClientObj)
      .pipe(map(data => data), catchError(this.handleError));
  } 


  /* GRI Start*/

  fetchGRIFreightDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchFreightDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
  getIpCliente(): Observable<any> {
    return this.httpClient.get('https://ipapi.co/json') // ...using post request '
      .pipe(map(data => data), catchError(this.handleError)); // ...and calling .json() on the response to return data
  }
  //ResetorUpdateClient
  public resetorUpdateClient(resetorUpdateClientObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/ResetorUpdateClient", resetorUpdateClientObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //ResetorUpdateClient
  public saveOrUpdateGridClientList(saveOrUpdateGridClientListObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateGridClientList", saveOrUpdateGridClientListObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //save or update report access menu Details
  public saveOrUpdateReportAccessDetails(fetchreportMenuObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateReportAccessDetails", fetchreportMenuObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //updateReportDescription
  public updateReportDescription(updateReportDescriptionObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/updateReportDescription", updateReportDescriptionObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Contract analysis review Api(Crm) 9126
  public fetchContractAnalysisReviewDetails(AccountNumber:any, CarrierName:any): Observable<any> {
    return this.httpClient.get(this.crm_Url + "api/values/Get?AccountNumber=" + AccountNumber + "&CarrierName=" + CarrierName)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //getStatusList
  public saveOrUpdateContractAnalysisRating(reqObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateContractAnalysisRating", reqObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //Contract analysis review Api(Crm) 9126
  public getRevenueBandTier(crmAccNo: any, carrierName: any): Observable<any> {
    return this.httpClient.post(this.crm_Url + "api/Values/GetRevenueBandTier",
      { "LJMCRM_AccountNumber": crmAccNo, "CarrierType": carrierName }).pipe(map(data => data), catchError(this.handleError));
  }
  //Contract analysis review Api(Crm) 9126
  public getInvoiceforUpsAndFedex(AccountNumber: any, CarrierName: any): Observable<any> {
    return this.httpClient.post(this.crm_Url + "api/Values/GetInvoiceForUPSAndFedex",
      { "LJMCRM_AccountNumber": AccountNumber, "CarrierType": CarrierName }).pipe(map(data => data), catchError(this.handleError));
  }
  //findUser
  public findUser(findUserObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/findUser", findUserObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch_TrackingReport
  public fetch_TrackingReport(fetch_TrackingReportObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetch_TrackingReport", fetch_TrackingReportObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //saveOrUpdateReportLog
  public saveOrUpdateReportLog(saveOrUpdateReportLogObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Report/saveOrUpdateReportLog", saveOrUpdateReportLogObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetch_Trakingnumber
  public fetch_Trakingnumber(fetch_TrakingnumberObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetch_Trakingnumber", fetch_TrakingnumberObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  fetchGRIFreightDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchFreightDetailsTarget", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIAccessorialDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIAccessorialDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccDetailsTarget", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIDimFactorDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchDimFactorDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIMinDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchMinDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIAccLookUp(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccLookUp", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIAccLookUpTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccLookUpTarget", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRIClientDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchclientDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  fetchGRITargetDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchTargetDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch freight edit proposal
  public fetchGRIfreightEditProposal(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchfreightEditProposal", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch Dim factor edit proposal
  public fetchGRIDimFactor(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchDimFactorEditProposal", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch accessorial eidt proposal
  public fetchGRIAccessorial(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccessorialEditProposal", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch Freight Ratesheet
  public fetchGRIFreightRatesheet(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchFreightRatesheet", discountObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch Ratesheet LookUp
  public fetchGRIRatesheetLookUp(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchRatesheetLookUp", discountObj)
      .pipe(map(data => data), catchError(this.handleError));
  }



  //fetch Acc Details Popup
  public fetchGRIAccDetailsPopup(accDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccDetailsPopup", accDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateDiscountsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateDiscounts", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateDiscountsHWTGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateDiscountsHWT", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateDIMGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateDIM", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateAccDiscountsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccDiscounts", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateTargetDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateTargetDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //generateProposal
  public generateProposalGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/generateProposal", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //min details for view discount 
  //fetch freight edit proposal
  public fetchGRIMinDetailsPopup(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchMindetailsPopup", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //min details for view discount 
  //fetch freight edit proposal
  public fetchGRIMinNetdetailsPopup(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchMinNetdetailsPopup", dimFactorObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public deleteDIMGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/deleteDIM", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //deleteFRTRatesheet
  public deleteFRTRatesheetGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/deleteFRTRatesheet", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //generateProposalHWT
  public generateProposalHWTGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/generateProposalHWT", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //Generate freightList for Dim change through dashboard
  public generateProposalDIMGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/generateProposalDIM", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //Fetch account Number for HWT in edit agreement
  public fetchGRIAccountNumber(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccountNumber", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //Save or Update account Number for HWT in edit agreement
  public saveOrUpdateAccountNumberGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccountNumber", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //Delete account Number for HWT in edit agreement
  public deleteAccountHWTGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/deleteAccountHWT", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public fetchGRIAccessorialLookup(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccessorialLookup", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //Save Accessorial service breakup
  public saveorUpdateServiceBreakupGRI(accDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveorUpdateServiceBreakup", accDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }


  //deleteTargetDetails
  deleteTargetDetailsGRI(paramObj: any) {
    return this.httpClient.post(this.url_path + "GRI/deleteTargetDetails", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //Save Agreement No
  saveOrUpdateAgreementNoDetailsGRI(paramObj: any) {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAgreementNoDetails", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //restore proposal
  restoreProposalGRI(paramObj: any) {
    return this.httpClient.post(this.url_path + "GRI/restoreProposal", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //generateProposalCurrentDIM
  generateProposalCurrentDIMGRI(paramObj : any){
    return this.httpClient.post(this.url_path + "GRI/generateProposalCurrentDIM", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateAccDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateAccDetailsHistoryGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccDetailsHistory", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateFreightDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateFreightDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateFreightDetailsHistoryGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateFreightDetailsHistory", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateHWTDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateHWTDetails", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  public saveOrUpdateHWTDetailsHistoryGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateHWTDetailsHistory", clientDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  deleteServiceGRI(paramObj: any) {
    return this.httpClient.post(this.url_path + "GRI/deleteService", paramObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  /* GRI End*/
}
export class T001ClientLoginCredential {
  public clientId!: number;
  public clientName!: string;
  public status!: string;
  public carrierType!: string;
  public userName!: string;
  public password!: string;
  public noofdaystoactive!: string;
  public upsClientId!: number;
  public fedexClientId!: number;
  public customerType!: string;
  public crmAccountNumber!: string;
  public ratingCustomerType!: string;
}

