import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { GlobalComponent } from "../../global-component";
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('token')}` })
};

export interface ClientIpDetails {
  ipaddress: string;
  city: string;
  region: string;
  country: string;
  location: string; // "lat,lng"
}
@Injectable({
  providedIn: 'root'
})
export class restApiService {
  
  url_path = environment.urlPath;
  crm_Url = environment.crmUrl;
  crm_Urlnew=environment.crmUrlnew;
  constructor(private httpClient: HttpClient) { }
   
  private locationApis = [
  'https://ipapi.co/json/',
  'https://ipinfo.io/json',
  'https://freeipapi.com/api/json'
];
getClientIpDetails(): Observable<ClientIpDetails | null> {
    return this.tryApi(0);
  }

  private tryApi(index: number): Observable<ClientIpDetails | null> {
    if (index >= this.locationApis.length) {
      return of(null);
    }

    return this.httpClient.get<any>(this.locationApis[index]).pipe(
      map(res => this.mapResponse(res)),
      switchMap(data => data ? of(data) : this.tryApi(index + 1)),
      catchError(() => this.tryApi(index + 1))
    );
  }

  private mapResponse(result: any): ClientIpDetails | null {
    if (!result) return null;

    const lat = result.latitude ?? result.lat;
    const lng = result.longitude ?? result.lon;

    if (!lat || !lng) return null;

    return {
      ipaddress: result.ip ?? '',
      city: result.city ?? '',
      region: result.region ?? result.regionName ?? '',
      country: result.country_name ?? result.country ?? '',
      location: `${lat},${lng}`
    };
  }
 private handleError(error: any): Observable<any> {
   let message = 'Something went wrong';
 
   if (error?.error?.message) {
     message = error.error.message;
   }
 
   return throwError(() => new Error(message));
 }
//LoginPage//
  public getCRMCredential(email:any, password:any): Observable<any> {
    // return this.httpClient.post(this.crm_Url +  "api/Home/CRMLogin", { Email: email, UserPassword: password });//, httpOptions
    return this.httpClient.post(this.crm_Url + "api/Home/CRMLogin", { Email: email, UserPassword: password })
      .pipe(map(data => data), catchError(this.handleError));
  }
  
    public validateLoginDetails(t001ClientLoginCredential:any) {
      // return this.httpClient.post(this.url_path + "Admin/Login", t001ClientLoginCredential);
      return this.httpClient.post<T001ClientLoginCredential>(this.url_path + "Admin/Login", t001ClientLoginCredential)
        .pipe(map(data => data), catchError(this.handleError));
    }
     public loadClientProfile(clientProfileObj:any): Observable<any> {
      // return this.httpClient.post(this.url_path + "Admin/LoadClientProfile", clientProfileObj);
        return this.httpClient.post<T001ClientLoginCredential>(this.url_path + "Admin/LoadClientProfile", clientProfileObj)
          .pipe(map(data => data), catchError(this.handleError));
      }
      //loginEmail
  public loginEmail(loginEmailObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/loginEmail", loginEmailObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
   //saveOrUpdateReportLogin
  public saveOrUpdateReportLogin(saveOrUpdateReportLoginObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateReportLogin", saveOrUpdateReportLoginObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  public fetchUser(fetchUserObj:any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchUser", fetchUserObj);
  }
    //Client Profile Fetch
    public loadOnTracClientProfile(clientProfileObj:any): Observable < any > {
      return this.httpClient.post < T001ClientLoginCredential > (this.url_path+"OntracAdmin/LoadClientProfile", clientProfileObj)
        .pipe(map(data => data), catchError(this.handleError));
    }
      public loadDhlClientProfile(clientProfileObj:any): Observable < any > {
        return this.httpClient.post < T001ClientLoginCredential > (this.url_path+"DHLAdmin/LoadClientProfile", clientProfileObj)
          .pipe(map(data => data), catchError(this.handleError));
      }
        //Client Profile Fetch
          public loadUSPSClientProfile(clientProfileObj:any): Observable<any> {
              return this.httpClient.post<T001ClientLoginCredential>(this.url_path + "UspsAdmin/LoadClientProfile", clientProfileObj)
                  .pipe(map(data => data), catchError(this.handleError));
          }
 
            //fetchFedExComparisionReportaddataAsOf
  public fetchFedExComparisionReportadataAsOf(fetchFedExComparisionReportadataAsOfObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "UPS/fetchFedExComparisionReportDataAsOf", fetchFedExComparisionReportadataAsOfObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchFedExComparisionReportaddataAsOf
  public fetchUPSComparisionReportadataAsOf(fetchUPSComparisionReportadataAsOfObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "UPS/fetchUPSComparisionReportDataAsOf", fetchUPSComparisionReportadataAsOfObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
//fetch Plan Details header
  public fetchplanDetails(fetchplanDetailsObj:any) {
    return this.httpClient.post(this.url_path + "Admin/fetchplanDetails", fetchplanDetailsObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //fetchaccountDetailsUPS
  public fetchaccountDetailsUPS(fetchaccountDetailsUPSObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/fetchaccountDetails", fetchaccountDetailsUPSObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
   //fetchaccountDetails
  public fetchaccountDetails(fetchUserObj:any) {
    return this.httpClient.post(this.url_path + "FedexAdmin/fetchaccountDetails", fetchUserObj);
  }
   //findClientLoginCredential
  public findClientLoginCredential(findClientLoginCredentialObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/findClientLoginCredential", findClientLoginCredentialObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
  //saveOrUpdateLogout
  public saveOrUpdateLogout(saveOrUpdateLogoutObj:any): Observable<any> {
    return this.httpClient.post(this.url_path + "Admin/saveOrUpdateLogout", saveOrUpdateLogoutObj)
      .pipe(map(data => data), catchError(this.handleError));
  }
    fetchClientDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "ContractSummary/fetchclientDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
 fetchGRIClientDetails(clientDetails: any): Observable<any> {
    return this.httpClient.post(this.url_path + "GRI/fetchclientDetails", clientDetails)
      .pipe(map(data => data), catchError(this.handleError));
  }
//Login Page//








  /**
  * Product Rest Api
  */
  // Get
  getData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + GlobalComponent.product, { headers: headerToken, responseType: 'text' });
  }

  // Delete 
  deleteData(id: any): Observable<any> {
    return this.httpClient.delete(GlobalComponent.API_URL + GlobalComponent.productDelete + id, { responseType: 'text' });
  }

  /**
  * Order Rest Api
  */

  // Get
  getOrderData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + GlobalComponent.order, { headers: headerToken, responseType: 'text' });
  }

  // POST
  postOrderData(employee: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + GlobalComponent.order, JSON.stringify(employee), httpOptions);
  }

  // Single
  getSingleOrderData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + GlobalComponent.orderId + id, { headers: headerToken, responseType: 'text' });
  }

  //Order Patch
  patchOrderData(employee: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + GlobalComponent.orderId + employee.ids, JSON.stringify(employee), httpOptions);
  }

  // Order Delete
  deleteOrder(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + GlobalComponent.orderId + id, { headers: headerToken, responseType: 'text' });
  }


  getSellerData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/seller');
  }

  getProjectData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/project');
  }

  /**
  * Customers Rest Api
  */
  // Get
  getCustomerData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + GlobalComponent.customer, { headers: headerToken, responseType: 'text' });
  }

  // POST
  postCustomerData(customers: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + GlobalComponent.customer, JSON.stringify(customers), httpOptions);
  }

  // Single
  getSingleCustomerData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/customer/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchCustomerData(customers: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/customer/' + customers.ids, JSON.stringify(customers), httpOptions);
  }

  // Delete
  deleteCustomer(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/customer/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
   * Task List Rest Api
   */
  // Get
  getTaskData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/task', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postTaskData(task: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + 'apps/task', JSON.stringify(task), httpOptions);
  }

  // Single
  getSingleTaskData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/task/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchTaskData(tasks: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/task/' + tasks.ids, JSON.stringify(tasks), httpOptions);
  }

  // Delete
  deleteTask(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/task/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Kanban
  getKanbanData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/kanban');
  }

  // Filemanger Folder
  getFolderData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/folder');
  }

  addFolderData(newData: any): Observable<any[]> {
    return this.httpClient.post<any[]>('/app/folder', newData);
  }

  updateFolderData(updatedData: any): Observable<any[]> {
    return this.httpClient.put<any[]>('/app/folder', updatedData);
  }

  deleteFolderData(): Observable<void> {
    return this.httpClient.delete<void>('/app/folder');
  }

  // Filemanger Files
  getFileData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/file');
  }

  addFileData(newData: any): Observable<any[]> {
    return this.httpClient.post<any[]>('/app/file', newData);
  }

  updateFileData(updatedData: any): Observable<any[]> {
    return this.httpClient.put<any[]>('/app/file', updatedData);
  }

  deleteFileData(): Observable<void> {
    return this.httpClient.delete<void>('/app/file');
  }

  /**
   * CRM Contect Rest Api
   */
  // Get
  getContactData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/contact', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postContactData(contact: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + 'apps/contact', JSON.stringify(contact), httpOptions);
  }

  // Single
  getSingleContactData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/contact/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchContactData(contacts: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/contact/' + contacts.ids, JSON.stringify(contacts), httpOptions);
  }

  // Delete
  deleteContact(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/contact/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
   * CRM Company Rest Api
   */
  // Get
  getCompanyData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/company', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postCompanyData(company: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + 'apps/company', JSON.stringify(company), httpOptions);
  }

  // Single
  getSingleCompanyData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/company/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchCompanyData(company: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/company/' + company.ids, JSON.stringify(company), httpOptions);
  }

  // Delete
  deleteCompany(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/company/' + id, { headers: headerToken, responseType: 'text' });
  }

  getDealData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/deal');
  }

  /* CRM Company Rest Api
  */
  // Get
  getLeadData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/lead', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postLeadData(company: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + 'apps/lead', JSON.stringify(company), httpOptions);
  }

  // Single
  getSingLeadData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/lead/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchLeadData(company: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/lead/' + company.ids, JSON.stringify(company), httpOptions);
  }

  // Delete
  deletelead(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/lead/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Crypto Order
  getCryptoOrderData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/cryptoOrder');
  }

  // Crypto Transaction
  getTransactionData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/transaction');
  }

  // Job Application
  getApplicationData(): Observable<any[]> {
    return this.httpClient.get<any[]>('/app/application');
  }

  addApplicationData(newData: any): Observable<any[]> {
    return this.httpClient.post<any[]>('/app/application', newData);
  }

  updateApplicationData(updatedData: any): Observable<any[]> {
    return this.httpClient.put<any[]>('/app/application', updatedData);
  }

  deleteApplicationData(): Observable<void> {
    return this.httpClient.delete<void>('/app/application');
  }

    // Job Apikey
    getApikeyData(): Observable<any[]> {
      return this.httpClient.get<any[]>('/app/apikey');
    }
  
    addApikeyData(newData: any): Observable<any[]> {
      return this.httpClient.post<any[]>('/app/apikey', newData);
    }
  
    updateApikeyData(updatedData: any): Observable<any[]> {
      return this.httpClient.put<any[]>('/app/apikey', updatedData);
    }
  
    deleteApikeyData(): Observable<void> {
      return this.httpClient.delete<void>('/app/apikey');
    }

  /* Support Ticket Rest Api
  */
  // Get
  getTicketData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/ticket', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postTicketData(ticket: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + 'apps/ticket', JSON.stringify(ticket), httpOptions);
  }

  // Single
  getSingTicketData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/ticket/' + id, { headers: headerToken, responseType: 'text' });
  }

  // Patch
  patchTicketData(ticket: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/ticket/' + ticket.ids, JSON.stringify(ticket), httpOptions);
  }

  // Delete
  deleteTicket(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/ticket/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
  * Support Ticket Rest Api
  */
  // Get
  getInvoiceData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/invoice', { headers: headerToken, responseType: 'text' });
  }

  // Delete
  deleteInvoice(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.delete(GlobalComponent.API_URL + 'apps/invoice/' + id, { headers: headerToken, responseType: 'text' });
  }

  /**
  * Todo Rest Api
  */
  // Get
  getTodoData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/todo/', { headers: headerToken, responseType: 'text' });
  }

  // POST
  postTodoData(employee: any): Observable<any> {
    return this.httpClient.post(GlobalComponent.API_URL + 'apps/todo/', JSON.stringify(employee), httpOptions);
  }

  // Single
  getSingleTodoData(id: any): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/todo/' + id, { headers: headerToken, responseType: 'text' });
  }

  //Patch
  patchTodoData(employee: any): Observable<any> {
    return this.httpClient.patch(GlobalComponent.API_URL + 'apps/todo/' + employee.ids, JSON.stringify(employee), httpOptions);
  }

  // deleteTodo(): Observable<void> {
  //   return this.httpClient.delete<void>('/app/file');
  // }

  /**
  * Calender Rest Api
  */
  // Get
  getCalendarData(): Observable<any> {
    var headerToken = { 'Authorization': `Bearer ` + sessionStorage.getItem('token') };
    return this.httpClient.get(GlobalComponent.API_URL + 'apps/calendar/', { headers: headerToken, responseType: 'text' });
  }


}
function observableThrowError(error: any): Observable<any> {
  throw new Error('Function not implemented.');
}
export class T001ClientLoginCredential {
  clientId!: number;
  clientName!: string;
  status!: string;
  carrierType!: string;
  userName!: string;
  password!: string;
  noofdaystoactive!: string;
  upsClientId!: number;
  fedexClientId!: number;
  customerType!: string;
  crmAccountNumber!: string;
  ratingCustomerType!: string;
}
