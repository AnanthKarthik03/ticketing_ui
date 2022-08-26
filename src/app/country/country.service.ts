import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
    providedIn: 'root',
  })
  export class CountryService {
    constructor(public http: HttpClient) {}

    countryDetailSend(values) {
        const url = AppSettings.API.country;
        return this.http.post(url, values, this.token());
      }

      get_country() {
        const url = AppSettings.API.country;
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
}
