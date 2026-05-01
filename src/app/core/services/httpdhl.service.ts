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
export class HttpDhlService {
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

  //fetchaccountDetails
  public fetchaccountDetails(fetchaccountDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchaccountDetails", fetchaccountDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchTotalSpendChart(fetchaccountDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchTotalSpendChart", fetchaccountDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchGroupedServicesChart(fetchallzoneObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchGroupedServicesChart", fetchallzoneObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchTopChart(fetchaccountDetailsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchTopChart", fetchaccountDetailsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public loadDhlClientProfile(clientProfileObj: any): Observable<any> {
    return this.httpClient.post<T001ClientLoginCredential>(this.url_path + "DHLAdmin/LoadClientProfile", clientProfileObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchDashBoard(fetchDashBoardObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchDashBoard", fetchDashBoardObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchServicesPieChart
  public fetchServicesPieChart(fetchT004_PiechartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchServicesPieChart", fetchT004_PiechartObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  // Report Servlet
  public reportServlet(urlParam: any) {
    var objectUrl = this.url_path + "DhlReportservlet?" + urlParam;
    window.open(objectUrl, "_self");
  }
  public fetchSpendByAccountNumber(fetchSpendAccObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchSpendByAccountNumber", fetchSpendAccObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  public fetchByServicesPopupCharts(fetchServicechartsObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchByServices", fetchServicechartsObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchTOPChartGroupedServices  
  public fetchByServiceTopChart(fetchServiceTopChartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchByServiceTopChart", fetchServiceTopChartObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Spend By Month ServicePopup  
  public fetchServiceSpendByMonth(fetchServicechartsSpendMonthObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchByServiceSpendByMonth", fetchServicechartsSpendMonthObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //Spend by AccountNumber Popup

  public fetchByServiceSpendByAccNo(fetchServicechartsSpendAccObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchByServiceSpendByAccNo", fetchServicechartsSpendAccObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }
  //fetchTop10CarrierPieChartPopup
  public fetchFRTServices(fetchT004_PiechartObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchFRTServices", fetchT004_PiechartObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Account Number Sort Order - method Added by 9200
  public insertOrUpdateAccountSortOrder(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/insertOrUpdateAccountSortOrder", updateObj)
      .pipe(map((data: any) => data), catchError(this.handleError));
  }

  //update Nick Name AccountNumber - method Added by 9200
  public updateAccountNumber(updateObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/updateAccountNumber", updateObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //saveOrUpdateClientProfile
  public saveOrUpdateClientProfile(saveOrUpdateClientObj:any): Observable < any > {
    return this.httpClient.post(this.url_path+"DHLAdmin/saveOrUpdateClientProfile", saveOrUpdateClientObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetch report log - method Added by 9200 
  public fetchReportLog(fetchReportLogObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchReportLog", fetchReportLogObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportDescription - method Added by 9200 
  public fetchReportDescription(fetchReportDescriptionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchReportDescription", fetchReportDescriptionObj)
      .pipe(map(data => data), catchError(this.handleError));

  }

  //Run Report - method Added by 9200 
  public runReport(runReportObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/runReport", runReportObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportObjStatus - method Added by 9200 
  public fetchReportObjStatus(fetchReportObjStatusObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchReportObjStatus", fetchReportObjStatusObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //fetchReportScheduler - method Added by 9200 
  public fetchReportScheduler(fetchReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchReportScheduler", fetchReportSchedulerObj)
      .pipe(map(data => data), catchError(this.handleError));

  }

  //add mail in detail reports report scheduler  - method Added by 9200 
  public addMailId(addMailObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/addMailId", addMailObj)
      .pipe(map(data => data), catchError(this.handleError));
  }

  //updateReportScheduler - method Added by 9200 
  public updateReportScheduler(updateReportSchedulerObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/updateReportScheduler", updateReportSchedulerObj)
      .pipe(map(data => data), catchError(this.handleError));

  }

  //fetchChargeDescriptiondetails - method Added by 9200 
  public fetchChargeDescriptionDetails(fetchChargeDescriptionObj: any): Observable<any> {
    return this.httpClient.post(this.url_path + "DHLAdmin/fetchChargeDescriptionDetails", fetchChargeDescriptionObj)
      .pipe(map((data:any) => data), catchError(this.handleError));
  }
  //ShipmentDetail Search
  public fetchShipmentDetailSearch(fetchShipmenDetailSerachObj:any): Observable < any > {
    return this.httpClient.post(this.url_path+"DHLAdmin/fetchShipmentDetailSearch", fetchShipmenDetailSerachObj)
      .pipe(map((data:any) => data), catchError(this.handleError));
  }
  //fetch_TrackingReport
  public fetch_TrackingReport(fetch_TrackingReportObj:any): Observable < any > {
    return this.httpClient.post(this.url_path+"DHLAdmin/fetch_TrackingReport", fetch_TrackingReportObj)
      .pipe(map((data:any) => data), catchError(this.handleError));
  }

}
interface T001ClientLoginCredential {
  clientId: number;
  clientName: string;
  status: string;
  carrierType: string;
  userName: string;
  password: string;
  noofdaystoactive: string;
  upsClientId: number;
  fedexClientId: number;
  customerType: string;
  crmAccountNumber: string;
  ratingCustomerType: string;
}


