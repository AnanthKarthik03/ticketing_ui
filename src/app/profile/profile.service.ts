import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "src/app/app.settings";
@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(public http: HttpClient) {}

  get_company() {
    const url = AppSettings.API.emp_details;
    return this.http.get(url, this.token());
  }
  editProfile(id) {
    const url = AppSettings.API.edit_profile;
    return this.http.post(url, id, this.token1());
  }

  token() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "BEARER " + sessionStorage.getItem("token"),
      }),
    };
    return httpOptions;
  }

  token1() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: "BEARER " + sessionStorage.getItem("token"),
      }),
    };

    return httpOptions;
  }
}
