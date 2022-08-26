import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class TimeSheetService {
  constructor(public http: HttpClient) {}

  getTimeSheet(cId, cuId, empId) {
    const url =
      AppSettings.API.timeSheet + '/' + cId + '/' + cuId + '/' + empId;
    return this.http.get(url, this.token());
  }

  addTimeSheet(body) {
    const url = AppSettings.API.timeSheet;
    return this.http.post(url, body, this.token1());
  }

  // add_customer
  token() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'BEARER ' + sessionStorage.getItem('token'),
      }),
    };
    return httpOptions;
  }

  token1() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'BEARER ' + sessionStorage.getItem('token'),
      }),
    };

    return httpOptions;
  }
}
