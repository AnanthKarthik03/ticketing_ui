import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../app.settings';
@Injectable({
  providedIn: 'root',
})
export class ForgotService {
  constructor(public http: HttpClient) {}

  // Forgot Password
  forget(values) {
    const url = AppSettings.API.forgot_password;
    return this.http.post(url, values);
  }

  // tslint:disable-next-line:typedef
  token() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'BEARER ' + sessionStorage.getItem('token'),
      }),
    };
    return httpOptions;
  }
}
