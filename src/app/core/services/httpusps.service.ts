import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class HttpUSPSService {
    url_path = environment.urlPath;
    constructor(private httpClient: HttpClient) { }
    private handleError(error: any): Observable<any> {
        let message = 'Something went wrong';

        if (error?.error?.message) {
            message = error.error.message;
        }

        return throwError(() => new Error(message));
    }
    //Topchart
    public fetchTopChart(fetchaccountDetailsObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsDashboard/fetchTopChart", fetchaccountDetailsObj)
            .pipe(map((data: any) => data), catchError(this.handleError));
    }
    //TotalSpendchart
    public fetchTotalSpendChart(fetchaccountDetailsObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsDashboard/fetchTotalSpendChart", fetchaccountDetailsObj)
            .pipe(map((data: any) => data), catchError(this.handleError));
    }
    //Grouped Service Chart
    public fetchGroupedServicesChart(fetchaccountDetailsObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsDashboard/fetchGroupedServicesChart", fetchaccountDetailsObj)
            .pipe(map((data: any) => data), catchError(this.handleError));
    }
    //Client Profile Fetch
    public loadUSPSClientProfile(clientProfileObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/LoadClientProfile", clientProfileObj)
            .pipe(map((data: any) => data), catchError(this.handleError));
    }
    // Report Servlet
    public reportServlet(urlParam: any) {
        var objectUrl = this.url_path + "UspsReportservlet?" + urlParam;
        window.open(objectUrl, "_self");
    }

    //fetchReportDescription - Method Added by 9200
    public fetchReportDescription(fetchReportDescriptionObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/fetchReportDescription", fetchReportDescriptionObj)
            .pipe(map((data: any) => data), catchError(this.handleError));

    }

    //Run Report - Method Added by 9200
    public runReport(runReportObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/runReport", runReportObj)
            .pipe(map(data => data), catchError(this.handleError));
    }

    //add mail in detail reports report scheduler - Method Added by 9200
    public addMailId(addMailObj: any) {
        return this.httpClient.post(this.url_path + "UspsAdmin/addMailId", addMailObj)
            .pipe(map(data => data), catchError(this.handleError));
    }
    //saveOrUpdateClientProfile
    public saveOrUpdateClientProfile(saveOrUpdateClientObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/saveOrUpdateClientProfile", saveOrUpdateClientObj)
            .pipe(map(data => data), catchError(this.handleError));
    }


    //fetchReportObjStatus - Method Added by 9200
    public fetchReportObjStatus(fetchReportObjStatusObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/fetchReportObjStatus", fetchReportObjStatusObj)
            .pipe(map(data => data), catchError(this.handleError));
    }

    //fetchReportScheduler - Method Added by 9200
    public fetchReportScheduler(fetchReportSchedulerObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/fetchReportScheduler", fetchReportSchedulerObj)
            .pipe(map(data => data), catchError(this.handleError));

    }

    //updateReportScheduler - Method Added by 9200
    public updateReportScheduler(updateReportSchedulerObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/updateReportScheduler", updateReportSchedulerObj)
            .pipe(map(data => data), catchError(this.handleError));

    }

    //fetch report log - Method Added by 9200
    public fetchReportLog(fetchReportLogObj: any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/fetchReportLog", fetchReportLogObj)
            .pipe(map(data => data), catchError(this.handleError));
    }

    //fetchChargeDescriptiondetails - Method Added by 9200
    public fetchChargeDescriptionDetails(fetchChargeDescriptionObj:any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsAdmin/fetchChargeDescriptionDetails", fetchChargeDescriptionObj)
            .pipe(map(data => data), catchError(this.handleError));
    }
    //ShipmentDetail Search
    public fetchShipmentDetailSearch(fetchShipmenDetailSerachObj:any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsDashboard/fetchShipmentDetailSearch", fetchShipmenDetailSerachObj)
            .pipe(map(data => data), catchError(this.handleError));
    }
    //fetch_TrackingReport
    public fetch_TrackingReport(fetch_TrackingReportObj:any): Observable<any> {
        return this.httpClient.post(this.url_path + "UspsDashboard/fetch_TrackingReport", fetch_TrackingReportObj)
            .pipe(map(data => data), catchError(this.handleError));
    }
}

