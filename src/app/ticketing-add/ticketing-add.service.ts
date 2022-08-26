import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "src/app/app.settings";
@Injectable({
  providedIn: "root",
})
export class TicketingAddService {
  adminTimeSheetReport(arg0: string, arg1: string, id: any, arg3: string, arg4: string) {
    throw new Error('Method not implemented.');
  }
  constructor(public http: HttpClient) {}

  getProjectGroup(id) {
    const url = AppSettings.API.project_group + "/" + id;
    return this.http.get(url, this.token());
  }

  getProjectEmployeesByID(id, id1) {
    const url = AppSettings.API.getProjectEmployeesByID + "/" + id + "/" + id1;
    return this.http.get(url, this.token());
  }
  get_employees_link(id) {
    const url = AppSettings.API.project_emp_linking + "/" + id;
    return this.http.get(url, this.token());
  }
  getTicketHistory(id) {
    const url = AppSettings.API.getTicketHistory + "/" + id;
    return this.http.get(url, this.token());
  }
  addTicket(body) {
    const url = AppSettings.API.addTicket;
    return this.http.post(url, body, this.token1());
  }
  ticket_history(body) {
    const url = AppSettings.API.ticket_history;
    return this.http.post(url, body, this.token1());
  }
  summaryReport(id, id1) {
    const url =
      AppSettings.API.summaryReport + "/" + id + "/" + id1;
    return this.http.get(url, this.token());
  }
  getempReport(date) {
    const url = AppSettings.API.getempReport+ "/" + date;
    return this.http.get(url, this.token());
  }
  // add_customer
  token() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "BEARER " + sessionStorage.getItem("token"),
      }),
    };
    return httpOptions;
  }

  token1() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "BEARER " + sessionStorage.getItem("token"),
      }),
    };

    return httpOptions;
  }
}
