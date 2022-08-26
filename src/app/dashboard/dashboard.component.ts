import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loginName: any;
  constructor() {}

  ngOnInit() {
    this.loginName = sessionStorage.getItem('name');
  }
}
