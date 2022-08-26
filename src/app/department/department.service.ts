import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
    providedIn: 'root',
  })
  export class DepartmentService {
    constructor(public http: HttpClient) {}

    departmentDetailSend(values) {
        const url = AppSettings.API.department;
        return this.http.post(url, values, this.token());
      }

      get_department() {
        const url = AppSettings.API.department;
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
