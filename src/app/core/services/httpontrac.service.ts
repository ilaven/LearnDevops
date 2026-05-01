import {
  throwError,
  Observable,
  Subscription,
  Subject
} from 'rxjs';
import {
  map,
  catchError
} from 'rxjs/operators';
import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpOntracService {

  url_path = environment.urlPath;
  crm_Url = environment.crmUrl;
  constructor(private httpClient: HttpClient) { }
  private handleError(error: any): Observable<any> {
    let message = 'Something went wrong';

    if (error?.error?.message) {
      message = error.error.message;
    }

    return throwError(() => new Error(message));
  }
  //fetchGroupedServicesChart
  public fetchGroupedServicesChart(fetchallzoneObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchGroupedServicesChart", fetchallzoneObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Topchart
  public fetchTopChart(fetchaccountDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchTopChart", fetchaccountDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //TotalSpendchart
  public fetchTotalSpendChart(fetchaccountDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchTotalSpendChart", fetchaccountDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchDashBoard
  public fetchDashBoard(fetchDashBoardObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchDashBoard", fetchDashBoardObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchServicesPieChart
  public fetchServicesPieChart(fetchT004_PiechartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchServicesPieChart", fetchT004_PiechartObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchAllZone
  public fetchAllZone(fetchallzoneObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchAllZone", fetchallzoneObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchaccountDetails
  public fetchaccountDetails(fetchaccountDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchaccountDetails", fetchaccountDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Client Profile Fetch
  public loadOnTracClientProfile(clientProfileObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/LoadClientProfile", clientProfileObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }     //ShipmentDetail Search
  public fetchShipmentDetailSearch(fetchShipmenDetailSerachObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchShipmentDetailSearch", fetchShipmenDetailSerachObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchByServicesPopupCharts  
  public fetchByServicesPopupCharts(fetchServicechartsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchByServices", fetchServicechartsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchSelectedZone
  public fetchSelectedZone(fetchallzoneObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchSelectedZone", fetchallzoneObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //SpendBy accountNumber on WeightDis Popup  
  public fetchSpendByAccountNumber(fetchSpendAccObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchSpendByAccountNumber", fetchSpendAccObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Services By Weight Popup
  public fetchByServiceByWeight(fetchServiceByWeightObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchByServiceByWeight", fetchServiceByWeightObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Spend By Month ServicePopup  
  public fetchServiceSpendByMonth(fetchServicechartsSpendMonthObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchByServiceSpendByMonth", fetchServicechartsSpendMonthObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchTop10CarrierPieChartPopup
  public fetchFRTServices(fetchT004_PiechartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchFRTServices", fetchT004_PiechartObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  // Report Servlet
  public reportServlet(urlParam: any) {
    var objectUrl = this.url_path + "OntracReportservlet?" + urlParam;
    window.open(objectUrl, "_self");
  }

  //fetchZoneDistribution - method Added by 9200
  public fetchZoneDistribution(fetchZoneDistributionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchZoneDistribution", fetchZoneDistributionObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //Run Report - method Added by 9200
  public runReport(runReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/runReport", runReportObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetch_TrackingReport
  public fetch_TrackingReport(fetch_TrackingReportObj:any): Observable < any > {
    return this.httpClient.post(this.url_path+"OntracAdmin/fetch_TrackingReport", fetch_TrackingReportObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportObjStatus  - method Added by 9200
  public fetchReportObjStatus(fetchReportObjStatusObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchReportObjStatus", fetchReportObjStatusObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Account Number Sort Order  - method Added by 9200
  public insertOrUpdateAccountSortOrder(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/insertOrUpdateAccountSortOrder", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Nick Name AccountNumber - method Added by 9200
  public updateAccountNumber(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/updateAccountNumber", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //updateReportDescription
  public updateReportDescription(updateReportDescriptionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/updateReportDescription", updateReportDescriptionObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchReportDescription
  public fetchReportDescription(fetchReportDescriptionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchReportDescription", fetchReportDescriptionObj)
      .pipe(map(data => data), catchError(this.handleError));

  }
  //saveOrUpdateClientProfile
  public saveOrUpdateClientProfile(saveOrUpdateClientObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/saveOrUpdateClientProfile", saveOrUpdateClientObj)
      .pipe(map(data => data), catchError(this.handleError));
  }


  //fetchCarrierTrendsDetails - method Added by 9200
  public fetchCarrierTrendsDetails(fetchCarrierTrendsDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchCarrierTrendsDetails", fetchCarrierTrendsDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //fetch report log - method Added by 9200 
  public fetchReportLog(fetchReportLogObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchReportLog", fetchReportLogObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportScheduler - method Added by 9200 
  public fetchReportScheduler(fetchReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/fetchReportScheduler", fetchReportSchedulerObj)
      .pipe(map(data => data), catchError(this.handleError));

  }

  //add mail in detail reports report scheduler - method Added by 9200 
  public addMailId(addMailObj: any) {
    return this.httpClient.post(this.url_path + "OntracAdmin/addMailId", addMailObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //updateReportScheduler - method Added by 9200 
  public updateReportScheduler(updateReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "OntracAdmin/updateReportScheduler", updateReportSchedulerObj)
      .pipe(map(data => data), catchError(this.handleError));

  }

    //fetchChargeDescriptiondetails
   public fetchChargeDescriptionDetails(fetchChargeDescriptionObj:any): Observable < any > {
    return this.httpClient.post(this.url_path+"OntracAdmin/fetchChargeDescriptionDetails", fetchChargeDescriptionObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

}

