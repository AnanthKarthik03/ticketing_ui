import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class DesignationService {
  constructor(public http: HttpClient) {}

  add_designation(body) {
    const url = AppSettings.API.designation;
    return this.http.post(url, body, this.token1());
  }
  get_designation() {
    const url = AppSettings.API.designation;
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
