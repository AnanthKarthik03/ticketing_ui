import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(public http: HttpClient) {}

  add_role(body) {
    const url = AppSettings.API.roles;
    return this.http.post(url, body, this.token());
  }
  get_role() {
    const url = AppSettings.API.roles;
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
