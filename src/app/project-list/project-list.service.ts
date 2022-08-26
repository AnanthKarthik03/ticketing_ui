import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(public http: HttpClient) {}

  project_add(body) {
    const url = AppSettings.API.project;
    return this.http.post(url, body, this.token());
  }
  get_project(companyId, customerId) {
    console.log(`in service`, companyId);
    const url = AppSettings.API.project + '/' + companyId + '/' + customerId;
    return this.http.get(url, this.token());
  }
  get_ticket(id, id1, id2) {
    const url = AppSettings.API.ticketList + '/' + id + '/' + id1 + '/' + id2;
    return this.http.get(url, this.token());
  }
  getPMProjectsList(id) {
    const url = AppSettings.API.getPMProjectsList + '/' + id;
    return this.http.get(url, this.token());
  }
  pmDashboardCount(id) {
    const url = AppSettings.API.pmDashboardCount + '/' + id;
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
