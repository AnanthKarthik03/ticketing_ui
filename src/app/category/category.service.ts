import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(public http: HttpClient) {}

  add_category(body) {
    const url = AppSettings.API.category;
    return this.http.post(url, body, this.token());
  }
  get_category() {
    const url = AppSettings.API.category;
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
