import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "src/app/app.settings";
@Injectable({
  providedIn: "root",
})
export class TicketingDetailsService {
  constructor(public http: HttpClient) {}

  adminTicketDetailsReport(companyId, projectId, d1, d2) {
    const url =
      AppSettings.API.adminTicketDetailsReport +
      "/" +
      companyId +
      "/" +
      projectId +
      "/" +
      d1 +
      "/" +
      d2;
    return this.http.get(url, this.token());
  }
  employeeAdminReport(companyId, empId, d1, d2) {
    const url =
      AppSettings.API.employeeAdminReport +
      "/" +
      companyId +
      "/" +
      empId +
      "/" +
      d1 +
      "/" +
      d2;
    return this.http.get(url, this.token());
  }

  orgTickets(companyId, pId, d1, d2) {
    const url =
      AppSettings.API.orgTickets +
      "/" +
      companyId +
      "/" +
      pId +
      "/" +
      d1 +
      "/" +
      d2;
    return this.http.get(url, this.token());
  }

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
