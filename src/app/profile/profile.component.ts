import { ChangePassService } from "../services/change-pass.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SelectItem } from "primeng/api";
import { ProfileService } from "./profile.service";
import { environment } from "src/environments/environment";
import * as _ from "underscore";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  martail: SelectItem[];
  selectedStatus: SelectItem;
  viewProfile = false;
  empData: any = [];
  myForm = new FormGroup({});
  itemImage = "";
  imagePath = environment.employee_logo;
  editId = "";
  submitted = false;
  spinner = false;
  role = "";
  cId = "";
  name = "";
  userProfile = "";
  mobile = "";
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private changePasswordService: ChangePassService,
    private toastr: ToastrService,
    private service: ProfileService
  ) {
    // this.martail = [
    //   { label: 'Unmarried', value: '1' },
    //   { label: 'Married', value: '2' },
    // ];
  }
  ngOnInit() {
    this.name = sessionStorage.getItem("name");
    this.role = sessionStorage.getItem("role");
    this.cId = sessionStorage.getItem("companyId");
    this.valiDate();
    this.employeeDetails();
  }
  dashboard() {
    this.router.navigate(["/dashboard"]);
  }
  adminDashboard(){
    this.router.navigate(["/adminDashboard"]);
  }
  pmDashboard(){
    this.router.navigate(["/pmDashboard"]);
  }
  employeeDashboard(){
    this.router.navigate(["/employeeDashboard"]);
  }

  showProfileForm() {
    this.viewProfile = true;
  }
  showProfileDetails() {
    this.viewProfile = false;
  }
  valiDate() {
    this.myForm = this.fb.group(
      {
        emp_id: sessionStorage.getItem("emp_id"),
        current_psw: ["", Validators.required],
        new_psw: ["", Validators.required],
        confirm_psw: ["", Validators.required],
      },
      { validators: this.mustMatch("new_psw", "confirm_psw") }
    );
  }
  get m() {
    return this.myForm.controls;
  }
  // Custom Validation for check Password
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchinControl = formGroup.controls[matchingControlName];
      if (matchinControl.errors && !matchinControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchinControl.value) {
        matchinControl.setErrors({ mustMatch: true });
      } else {
        matchinControl.setErrors(null);
      }
    };
  }

  onProfileUpload(event) {
    // const reader = new FileReader();

    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }

  private prepareSave(): any {
    const body = {};
    const input = new FormData();
    input.append("profile_image", this.itemImage);
    input.append("name", this.name);
    input.append("mobile", this.mobile);
    input.append("emp_code", sessionStorage.getItem("emp_id"));
    input.append("id", sessionStorage.getItem("id"));
    return input;
  }

  changePassword() {
    const body = this.myForm.value;
    console.log(body);
    this.changePasswordService.resetPassword(body).subscribe((data) => {
      if (data["success"]) {
        console.log(data);
        this.toastr.success("Password Change Successful");
        this.router.navigate(["/login"]);
      } else {
        this.toastr.error(data["message"]);
      }
    });
  }
  employeeDetails() {
    this.service.get_company().subscribe(
      (data) => {
        if (data["success"]) {
          console.log(data["data"]);
          this.empData = data["data"];
          this.userProfile = this.empData[0].profile_image;
          this.mobile = this.empData[0].phone;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  editProfile() {
    const body = this.prepareSave();

    this.service.editProfile(body).subscribe((data) => {
      if (data["success"]) {
        this.employeeDetails();
        this.toastr.success("Profile Updated!");
        
        this.showProfileForm();
        this.showProfileDetails();
        
      }
    });
  }
  // profile_image
}
