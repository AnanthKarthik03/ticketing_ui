import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class PmService {
  constructor(public http: HttpClient) {}

  employee_add(body) {
    const url = AppSettings.API.employee_add;
    return this.http.post(url, body, this.token1());
  }
  get_employee(companyId) {
    console.log(`in service`, companyId);

    const url = AppSettings.API.employee_add + '/' + companyId;
    return this.http.get(url, this.token());
  }
  getEmpProjectsList(id) {
    console.log(`in service`, id);

    const url = AppSettings.API.getEmpProjectsList + '/' + id;
    return this.http.get(url, this.token());
  }
  department() {
    const url = AppSettings.API.department;
    return this.http.get(url , this.token());
  }
  designation() {
    const url = AppSettings.API.designation;
    return this.http.get(url , this.token());
  }
  roles() {
    const url = AppSettings.API.roles;
    return this.http.get(url , this.token());
  }

  projectReport(id) {
    console.log(`in service`, id);

    const url = AppSettings.API.projectReport + '/' + id;
    return this.http.get(url, this.token());
  }
  timesheetReport(id) {
    console.log(`in service`, id);

    const url = AppSettings.API.timesheetReport + '/' + id;
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
