import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-org-tickets',
  templateUrl: './org-tickets.component.html',
  styleUrls: ['./org-tickets.component.css']
})
export class OrgTicketsComponent implements OnInit {

  role = '';
  constructor(public router: Router) { }

  ngOnInit(): void {
    this.role = sessionStorage.getItem('role');
  }

  dashboard() {
    this.router.navigate(['/Dashboard']);
    if(this.role === 'Admin'){
      this.router.navigate(['/adminDashboard']);
    }
  }
  adminDashboard() {
    this.router.navigate(['/adminDashboard']);
  }
}
