import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  userName = '';
  roleId='';
  itemImage = '';
  
  userProfile: any;
  imagePath = environment.employee_logo;
  constructor(public router: Router) {}
  ngOnInit() {
    this.userName = sessionStorage.getItem('name');
    this.roleId = sessionStorage.getItem('role');
    this.userProfile = sessionStorage.getItem('user_image');
    

  }
  showLoginForm() {
    this.router.navigate(['/login']);
    sessionStorage.clear();
  }


  profile() {
    this.router.navigate(['/profile']);
  }
  role() {
    this.router.navigate(['/role']);
  }
}
