import { Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginserService } from "../services/login.service";
import { ForgotService } from "../services/forgot.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  myForm = new FormGroup({});
  resetForm = new FormGroup({});
  spinner = false;
  constructor(
    public router: Router,
    private formbuilder: FormBuilder,
    private loginService: LoginserService,
    private toastr: ToastrService,
    private service: ForgotService
  ) {}

  viewSignIn = false;
  ngOnInit() {
    this.valiDate();
    this.resetPass();
  }
  // Validation Funcation of Login
  valiDate() {
    this.myForm = this.formbuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  // Validation Funcation of Login
  resetPass() {
    this.resetForm = this.formbuilder.group({
      empCode: ["", Validators.required],
    });
  }

  // asscess control of all Fields
  get m() {
    return this.myForm.controls;
  }
  // asscess control of all Fields
  get n() {
    return this.resetForm.controls;
  }
  // After Login Navigate to Dashboard Page
  dashboard() {
    this.spinner = true;
    const body = this.myForm.value;
    this.loginService.adminLogin(body).subscribe(
      (data) => {
        if (data["success"]) {
          this.spinner = false;
          this.toastr.success("Login Successfull");

          // data["data"].role.
          if (data["data"].role === "SuperAdmin") {
            this.router.navigate(["/dashboard"]);
          } else if (data["data"].role === "User") {
            this.router.navigate(["/employeeDashboard"]);
          } else if (data["data"].role === "Admin") {
            sessionStorage.setItem("companyId", data["data"].company_id);
            this.router.navigate(["/adminDashboard"]);
          } else if (data["data"].role === "Pm") {
            sessionStorage.setItem("companyId", data["data"].company_id);
            sessionStorage.setItem("customerId", data["data"].customer_id);
            // this.router.navigate(['/projects']);
            this.router.navigate(["/pmDashboard"]);
          } else if (data["data"].role === "Client") {
            this.router.navigate(["/clientDashboard"]);
          }
        } else {
          this.spinner = false;
          this.toastr.error(" Incorrect UserID or Password");
        }
      },
      (err) => {
        this.spinner = false;
        this.toastr.error("Network Error");
      }
    );
  }
  forgot = () => {
    this.viewSignIn = true;
    this.myForm.reset();
    this.resetForm.reset();
  };
  signOut = () => {
    this.viewSignIn = false;
    this.myForm.reset();
    this.resetForm.reset();
  };

  forgetPass() {
    const body = this.resetForm.value;

    this.service.forget(body).subscribe((data) => {
      if (data["success"]) {
        this.toastr.success("New Password sent to Admin");
        this.viewSignIn = false;
      } else {
        this.toastr.error(data["message"]);
      }
    });
  }
}
