import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "src/app/app.settings";
@Injectable({
  providedIn: "root",
})
export class TimeReportService {
  constructor(public http: HttpClient) {}

  adminEmployeeReport(companyId) {
    const url = AppSettings.API.adminEmployeeReport + "/" + companyId;
    return this.http.get(url, this.token());
  }
  adminTimeSheetReport(cId, cuId, pId, d1, d2) {
    const url =
      AppSettings.API.adminTimeSheetReport + "/" + cId + "/" + cuId + "/" + pId + "/" + d1 + "/" + d2;
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