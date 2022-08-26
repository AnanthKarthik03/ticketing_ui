import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../app.settings';

@Injectable({
  providedIn: 'root'
})
export class ChangePassService {

  constructor(public http: HttpClient) { }
//Change Password
  resetPassword(values) {
    const url = AppSettings.API.change_password;
    return this.http.post(url, values,this.token());
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
