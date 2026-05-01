import { throwError, Observable, Subscription, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertPopupComponent } from 'src/app/shared/alert-popup/alert-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class HttpfedexService {
  url_path = environment.urlPath;
  setIntervalId: any;
  loadresult: any;
  constructor(private httpClient: HttpClient, private dialog: MatDialog,) { }
  private handleError(error: any): Observable<any> {
    let message = 'Something went wrong';

    if (error?.error?.message) {
      message = error.error.message;
    }

    return throwError(() => new Error(message));
  }
  async _setIntervalFedEx(reportsFormGroupObj: any) {
    clearInterval(this.setIntervalId);
    this.setIntervalId = setInterval(() => { this.sendDataFedEx(reportsFormGroupObj); }, 15000);
    return this.loadresult;
  }
  sendDataFedEx(reportsFormGroupObj: any) {
    this.fetchReportObjStatus(reportsFormGroupObj).subscribe(
      (result: any) => {
        var resultObj = [];
        resultObj = result;
        if (resultObj[0].status == "COMPLETED" && resultObj[0].reportLogId == reportsFormGroupObj.reportLogId && resultObj[0].t002ClientProfileobj.clientId == reportsFormGroupObj.t002ClientProfileobj.clientId) {

          var objectUrl = this.url_path + "FedexDownloadServlet?reportlogid=" + resultObj[0].reportLogId;
          window.open(objectUrl);
          this.openModal("Download completed successfully");
          clearInterval(this.setIntervalId);
        }
        if (resultObj[0].status == "ERROR") {
          clearInterval(this.setIntervalId);
        }
      },
      (error: any) => {
        console.log(' error ', error);

      });
  }
  openModal(alertVal: any) {
    const openModalConfig = this.dialog.open(AlertPopupComponent, {
      width: '470px',
      height: 'auto',
      data: { pageValue: alertVal },
      // panelClass: this.panelClass
    });
  }
  //fetchaccountDetails
  public fetchaccountDetails(fetchUserObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchaccountDetails", fetchUserObj);
  }
  public fetchdashBoard(fetchdashBoardObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchdashBoard", fetchdashBoardObj);
  }
  //fetchZone
  public fetchZone(fetchZoneObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchZone", fetchZoneObj);
  }
  //fetchdashBoardGrpSer
  public fetchdashBoardGrpSer(fetchdashBoardGrpSerObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchdashBoardGrpSer", fetchdashBoardGrpSerObj);
  }
  //fetchIndividualService
  public fetchIndividualService(fetchIndividualServiceObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchIndividualService", fetchIndividualServiceObj);
  }
  public reportServlet(urlParam: any) {
    var objectUrl = this.url_path + "FedexReportservlet?" + urlParam;
    window.open(objectUrl, "_self");

  }
  //fetchTotalSpendDashBoard
  public fetchTotalSpendDashBoard(fetchTotalSpendDashBoardObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchTotalSpendDashBoard", fetchTotalSpendDashBoardObj);
  }
  public runReport(runReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/runReport", runReportObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchDashAccountNumber
  public fetchDashAccountNumber(fetchDashAccountNumberObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchDashAccountNumber", fetchDashAccountNumberObj);
  }
  //fetchIndividualSerMoreView
  public fetchIndividualSerMoreView(fetchIndividualSerMoreViewObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchIndividualSerMoreView", fetchIndividualSerMoreViewObj);
  }
  public fetchReportObjStatus(runReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchReportObjStatus", runReportObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public compareUpsData(compareUpsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "UPS/fetchUPSComparisionReportData", compareUpsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchIndividualService
  public fetchdashBoardGrpSerPopup(fetchdashBoardGrpSerPopupObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchdashBoardGrpSerPopup", fetchdashBoardGrpSerPopupObj);
  }

  // fetchCostOptimizationDetailsFedex - Method Added by 9200
  public fetchCostOptimizationDetailsFedEx(fetchCostOptimizationDetailsFedExObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchCostOptimizationDetails", fetchCostOptimizationDetailsFedExObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetchExecutiveSummaryDetails - Method Added by 9200
  public fetchExecutiveSummaryDetails(fetchExecutiveSummaryDetailsObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchExecutiveSummaryDetails", fetchExecutiveSummaryDetailsObj);
  }

  // fetchServiceLevelUsageSummaryFedex - Method Added by 9200
  public fetchServiceLevelUsageSummaryFedEx(fetchServiceLevelUsageSummaryFedExObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchServiceLevelUsageSummary", fetchServiceLevelUsageSummaryFedExObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchTargetDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchTargetDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchFreightDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchFreightDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //generateProposalFedExCurrentDIM
  generateProposalFedExCurrentDIM(paramObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "ContractSummary/generateProposalFedExCurrentDIM", paramObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchfreightEditProposal(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchfreightEditProposalFedEx", dimFactorObj);
  }
  fetchFreightDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchFreightDetailsTargetFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchDimFactorDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchDimFactorDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchMinDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchMinDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchAccessorialDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchAccessorialDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsTargetFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetch Dim factor edit proposal
  public fetchDimFactor(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchDimFactorEditProposalFedEx", dimFactorObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  } //fetch Acc Details Popup
  public fetchAccDetailsPopup(accDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsPopupFedEx", accDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Fetch account Number for HWT in edit agreement
  public fetchAccountNumber(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccountNumberFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateDiscounts(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateDiscountsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateDiscountsHWT(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateDiscountsHWTFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Save or Update account Number for HWT in edit agreement
  public saveOrUpdateAccountNumber(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccountNumber", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateAccDiscounts(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccDiscounts", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateAccDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccDetails", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateFreightDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateFreightDetails", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateHWTDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateHWTDetails", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //generateProposal
  public generateProposal(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposal", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //save accessorial service break up
  public saveorUpdateServiceBreakup(accDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveorUpdateServiceBreakupFedEx", accDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateTargetDetails(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateTargetDetailsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateDIM(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateDIMFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateAccDetailsHistory(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateAccDetailsHistoryFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateFreightDetailsHistory(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateFreightDetailsHistoryFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public saveOrUpdateHWTDetailsHistory(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/saveOrUpdateHWTDetailsHistoryFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchAccessorialDetailsExcel(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsExcelFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchEarnedDiscDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexEranedDiscDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsGroundWeightDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexGroundWeightDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsServZoneDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexTransactionDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsDimsDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexDimsDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsLocationsDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexLocationsDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsGroundDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexGroundDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsChargeDescDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexChargeDescription', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsExecuteSummaryDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexExecutiveSumaryDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchUPsInvoiceSummaryDetails(clientId: string): Observable<any> {
    const params = new HttpParams().set('clientId', clientId);
    return this.httpClient.get(this.url_path + 'ContractSummary/fetchFedexInvoiceSummaryDetails', { params })
      .pipe(
        map((data: any) => data),
        catchError(this.handleError)
      );
  }
  fetchAccessorialDetailsTargetExcel(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccDetailsTargetExcelFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //generateProposalHWT
  public generateProposalHWT(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposalFedExHWT", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Delete FRT Ratesheet
  public deleteFedExFRTRatesheet(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteFedExFRTRatesheet", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  deleteServiceFedEx(paramObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteServiceFedEx", paramObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchAccLookUp(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccLookUpFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  fetchAccLookUpTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchAccLookUpTargetFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public deleteDIMFedEx(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/deleteDIMFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Generate freightList for Dim change through dashboard
  public generateProposalDIM(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/generateProposalFedExDIM", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchFreightRatesheet(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchFreightRatesheetFedEx", discountObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetch Ratesheet LookUp
  public fetchRatesheetLookUp(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchRatesheetLookUpFedEx", discountObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Min details for view discount 
  public fetchMinDetailsPopup(detailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchMindetailsPopupFedEx", detailsObj);
  }
  updateTargetFilter(paramObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + 'ContractSummary/updateTargetFilterFedEx', (paramObj))
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Min details for view discount 
  public fetchMinNetdetailsPopup(detailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchMinNetdetailsPopupFedEx", detailsObj);
  }

  //fetch report log - Method Added by 9200
  public fetchReportData(runReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchReportData", runReportObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetchzonedistribution - Method Added by 9200
  public fetchzonedistribution(fetchzonedistributionObj: any): Observable<any> {
    return this.httpClient.post<any>(this.url_path + "FedexAdmin/fetchzonedistribution", fetchzonedistributionObj);
  }


  //fetchReportDescription - Method Added by 9200
  public fetchReportDescription(fetchReportDescriptionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchReportDescription", fetchReportDescriptionObj)
      .pipe(map((data: any) => data), catchError(this.handleError));

  }

  //fetchReportScheduler - Method Added by 9200
  public fetchReportScheduler(fetchReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchReportScheduler", fetchReportSchedulerObj)
      .pipe(map((data: any) => data), catchError(this.handleError));

  }

  //saveReportScheduler - Method Added by 9200
  public saveReportScheduler(fetchactiveClientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/saveReportScheduler", fetchactiveClientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //updateReportScheduler - Method Added by 9200
  public updateReportScheduler(updateReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/updateReportScheduler", updateReportSchedulerObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetchAdvanceChargeDesc - Method Added by 9200
  public fetchAdvanceChargeDesc(fetchAdvanceChargeDescObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchAdvanceChargeDesc", fetchAdvanceChargeDescObj);
  }

  //update contract saving analysis - Method Added by 9200
  public update_ContractSavings(updateContractSavingsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/update_ContractSavings", updateContractSavingsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Sumofcontractsumary  - Method Added by 9200
  public fetchSumofcontractsumary(SumofcontractsumaryObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchSumofcontractsumary", SumofcontractsumaryObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchcategory
  public fedexFetchCategory(fetchcategoryObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchcategory", fetchcategoryObj);
  }
  //fetchClientName
  public fetchClientName(fetchClientNameObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchClientName", fetchClientNameObj);
  }
  //fetchChargeDescritionList
  public fetchChargeDescritionList(fetchChargeDescritionListObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchChargeDescritionList", fetchChargeDescritionListObj);
  }
  //fedexFetchaveragediscount
  public fedexFetchaveragediscount(fedexFetchaveragediscountObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchaveragediscount", fedexFetchaveragediscountObj);
  }
  //saveOrUpdateClientProfile
  public saveOrUpdateClientProfile(saveOrUpdateClientProfileObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/saveOrUpdateClientProfile", saveOrUpdateClientProfileObj);
  }
  //fetchactiveClient
  public fetchactiveClient(fetchactiveClientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchactiveClient", fetchactiveClientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //saveOrUpdateGridClientList
  public saveOrUpdateGridClientList(saveOrUpdateGridClientListObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/saveOrUpdateGridClientList", saveOrUpdateGridClientListObj);
  }
  public ResetorUpdateClient(fetchactiveClientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/ResetorUpdateClient", fetchactiveClientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public updateReportDescription(updateReportDescriptionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/updateReportDescription", updateReportDescriptionObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Account Number Sort Order  - Method Added by 9200
  public insertOrUpdateAccountSortOrder(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/insertOrUpdateAccountSortOrder", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Nick Name AccountNumber - Method Added by 9200
  public updateAccountNumber(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/updateAccountNumber", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //saveOrUpdateAccountAddressDetails - Method Added by 9200
  public accountNumberSaveorUpdate(paramObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/saveOrUpdateAccountAddressDetails", paramObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetchdisplayHeatmaplist
  public fetchdisplayHeatmaplist(fetchdisplayHeatmaplistObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchdisplayHeatmaplist", fetchdisplayHeatmaplistObj);
  }
  //fetchCountryBarchart
  public fetchCountryBarchart(fetchCountryBarchartObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchCountryBarchart", fetchCountryBarchartObj);
  }
  //fetchCityShipment
  public fetchCityShipment(fetchCityShipmentObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchCityShipment", fetchCityShipmentObj);
  }
  //fedexFetchInterDashboard_Service
  public fedexFetchInterDashboard_Service(fedexFetchInterDashboard_ServiceObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchInterDashboard_Service", fedexFetchInterDashboard_ServiceObj);
  }
  //fedexFetchdisplay_INT_Heatmap_list
  public fedexFetchdisplay_INT_Heatmap_list(fedexFetchdisplay_INT_Heatmap_listObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchdisplay_INT_Heatmap_list", fedexFetchdisplay_INT_Heatmap_listObj);
  }
  //fetchAutomateReportDetails
  public fetchAutomateReportDetails(fetchAutomateReportDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchAutomateReportDetails", fetchAutomateReportDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchManageAutomateRecipientClientDetails
  public fetchAutomateClientReportStatus(automateClientReportStatusObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchAutomateClientReportStatus", automateClientReportStatusObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //add/updateReportautomationdetails
  public manageAutomateReportDetails(manageAutomateReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/manageAutomateReportDetails", manageAutomateReportObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchManageAutomateRecipientClientDetails
  public fetchManageAutomateRecipientsDetails(manageAutomateRecipientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchManageAutomateRecipientsDetails", manageAutomateRecipientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //add/update ManageAutomateRecipientClientDetails
  public manageAutomateRecipientsDetails(manageAutomateRecipientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/manageAutomateRecipientsDetails", manageAutomateRecipientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //add/update ManageAutomateClientDetails
  public manageAutomateClientDetails(manageAutomateClientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/manageAutomateClientDetails", manageAutomateClientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchManageAutomateClientDetails
  public fetchManageAutomateClientDetails(manageAutomateReportClientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchManageAutomateClientDetails", manageAutomateReportClientObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fedexFetchInternationalPopUp_Service
  public fedexFetchInternationalPopUp_Service(fedexFetchInternationalPopUp_ServiceObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchInternationalPopUp_Service", fedexFetchInternationalPopUp_ServiceObj);
  }

  /* GRI Start*/

  fetchGRIFreightDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchFreightDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIFreightDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchFreightDetailsTargetFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIAccessorialDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIAccessorialDetailsTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccDetailsTargetFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIDimFactorDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchDimFactorDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIMinDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchMinDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public fetchGRIFreightRatesheet(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchFreightRatesheetFedEx", discountObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetch Ratesheet LookUp
  public fetchGRIRatesheetLookUp(discountObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchRatesheetLookUpFedEx", discountObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIAccLookUp(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccLookUpFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRIAccLookUpTarget(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccLookUpTargetFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  fetchGRITargetDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchTargetDetailsFedEx", clientDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public fetchGRIfreightEditProposal(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchfreightEditProposalFedEx", dimFactorObj);
  }
  //fetch Dim factor edit proposal
  public fetchGRIDimFactor(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchDimFactorEditProposalFedEx", dimFactorObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetch accessorial eidt proposal
  public fetchGRIAccessorial(dimFactorObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccessorialEditProposalFedEx", dimFactorObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateDiscountsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateDiscountsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateDiscountsHWTGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateDiscountsHWTFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateDIMGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateDIMFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateAccDiscountsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccDiscountsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateTargetDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateTargetDetailsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetch Acc Details Popup
  public fetchGRIAccDetailsPopup(accDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccDetailsPopupFedEx", accDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //generateProposal
  public generateProposalGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/generateProposalFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Min details for view discount 
  public fetchGRIMinDetailsPopup(detailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchMindetailsPopupFedEx", detailsObj);
  }

  //Min details for view discount 
  public fetchGRIMinNetdetailsPopup(detailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchMinNetdetailsPopupFedEx", detailsObj);
  }

  public deleteDIMFedExGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/deleteDIMFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //generateProposalHWT
  public generateProposalHWTGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/generateProposalFedExHWT", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Delete FRT Ratesheet
  public deleteFedExFRTRatesheetGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/deleteFedExFRTRatesheet", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Generate freightList for Dim change through dashboard
  public generateProposalDIMGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/generateProposalFedExDIM", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Fetch account Number for HWT in edit agreement
  public fetchGRIAccountNumber(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchAccountNumberFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Save or Update account Number for HWT in edit agreement
  public saveOrUpdateAccountNumberGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccountNumberFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Delete account Number for HWT in edit agreement
  public deleteAccountHWTGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/deleteAccountHWTFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //save accessorial service break up
  public saveorUpdateServiceBreakupGRI(accDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveorUpdateServiceBreakupFedEx", accDetails)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //generateProposalFedExCurrentDIM
  generateProposalFedExCurrentDIMGRI(paramObj: any) {
    return this.httpClient.post(this.url_path + "GRI/generateProposalFedExCurrentDIM", paramObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateAccDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccDetailsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateAccDetailsHistoryGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateAccDetailsHistoryFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateFreightDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateFreightDetailsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateFreightDetailsHistoryGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateFreightDetailsHistoryFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateHWTDetailsGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateHWTDetailsFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  public saveOrUpdateHWTDetailsHistoryGRI(clientDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/saveOrUpdateHWTDetailsHistoryFedEx", clientDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  deleteServiceGRIFedEx(paramObj: any) {
    return this.httpClient.post(this.url_path + "GRI/deleteServiceFedEx", paramObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  /* GRI End*/
  //fedexFetch_TrackingReport
  public fedexFetch_TrackingReport(fedexFetch_TrackingReportObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetch_TrackingReport", fedexFetch_TrackingReportObj);
  }
  //saveSearchHitDetails
  public saveSearchHitDetails(saveSearchHitDetailsObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/saveSearchHitDetails", saveSearchHitDetailsObj);
  }
  //fetchTrakingnumber
  public fetchTrakingnumber(fetchTrakingnumberObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchTrakingnumber", fetchTrakingnumberObj);
  }
  //fetchservicefedex
  public fetchservicefedex(fetchservicefedexObj: any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchservicefedex", fetchservicefedexObj);
  }
}
