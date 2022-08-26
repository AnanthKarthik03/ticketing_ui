import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class EmployeeDashboardService {
  constructor(public http: HttpClient) {}

  getEmployeeCount(userId) {
    const url = AppSettings.API.userDashboardCount + '/' + userId;
    return this.http.get(url, this.token());
  }

  getClientCount(customerId) {
    const url = AppSettings.API.clientDashboardCount + '/' + customerId;
    return this.http.get(url, this.token());
  }

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
