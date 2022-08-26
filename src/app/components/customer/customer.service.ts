import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(public http: HttpClient) {}

  add_customer(body) {
    const url = AppSettings.API.customer;
    return this.http.post(url, body, this.token1());
  }
  get_customer(id) {
    const url = AppSettings.API.customer + '/' + id;
    return this.http.get(url, this.token());
  }
  getCountDashboard(id) {
    const url = AppSettings.API.adminGetCountDashboard + '/' + id;
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
