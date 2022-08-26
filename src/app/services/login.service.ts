import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from '../app.settings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class LoginserService {
  constructor(private http: HttpClient) {}


  public userData = [];

  adminLogin(values): Observable<any> {
    const url = AppSettings.API.AUTH;
    // const body = JSON.stringify(values);
    return this.http.post<any>(url, values).pipe(
      map((user) => {
        // login bem-sucedido se houver um token jwt na resposta
        if (user && user.token) {
          this.userData = user.data;
          console.log( this.userData);

          sessionStorage.setItem('token', user.token);
          sessionStorage.setItem('emp_id', user.data.emp_code);
          sessionStorage.setItem('id', user.data.id);
          sessionStorage.setItem('name', user.data.name);
          sessionStorage.setItem('role', user.data.role);
          sessionStorage.setItem('user_image', user.data.profile_image);
          sessionStorage.setItem('raise_bug', user.data.raise_bug);
          sessionStorage.setItem('companyId', user.data.company_id);
        }

        return user;
      })
    );
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
