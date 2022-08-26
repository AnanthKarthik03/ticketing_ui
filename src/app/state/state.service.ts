import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(public http: HttpClient) {}

  add_state(body) {
    const url = AppSettings.API.state;
    return this.http.post(url, body, this.token());
  }
  get_state() {
    const url = AppSettings.API.state;
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
