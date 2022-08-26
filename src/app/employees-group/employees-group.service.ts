import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class EmployeesGroupService {
  constructor(public http: HttpClient) {}

  addProjectGroup(body) {
    const url = AppSettings.API.project_group;
    return this.http.post(url, body, this.token());
  }
  get_employees(id) {
    const url = AppSettings.API.employee_add + '/' + id;
    return this.http.get(url, this.token());
  }

  addProjectEmp(body) {
    const url = AppSettings.API.project_emp_linking;
    return this.http.post(url, body, this.token());
  }

  get_employees_link(id) {
    const url = AppSettings.API.project_emp_linking + '/' + id;
    return this.http.get(url, this.token());
  }
  getProjectGroup(id) {
    const url = AppSettings.API.project_group + '/' + id;
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
