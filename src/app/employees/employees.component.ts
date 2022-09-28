import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EmployeesService } from "./employees.service";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { environment } from "src/environments/environment";
import { XlsxToJsonService } from "../xlsx-to-json-service";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.css"],
})
export class EmployeesComponent implements OnInit {
  myForm!: FormGroup;
  viewEmployee = false;
  submitted = false;
  itemImage = "";
  employeeData = [];
  spinner = false;
  editId = "";
  dept = [];
  desg = [];
  role = [];
  roleData = [];
  designationData = [];
  departmentData = [];
  imagePath = environment.employee_logo;
  roleName = "";
  fileUpload = "";
  excelData = [];
  finalExcelData = [];

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public employeeService: EmployeesService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.department();
    this.designation();
    this.roles();
    this.employeeGet();
    this.roleName = sessionStorage.getItem("role");

    this.myForm = this.fb.group({
      id: [""],
      company_id: sessionStorage.getItem("companyId"),
      emp_code: ["", Validators.required],
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      rm: ["", Validators.required],
      role: ["", Validators.required],
      dept: ["", Validators.required],
      desg: ["", Validators.required],
      profile_image: [""],
      doj: new Date(),
      dob: new Date(),
      ctc_per_month: ["", Validators.required],
      gender: ["", Validators.required],
      raise_bug: ["", Validators.required],
    });
  }

  employeeGet() {
    this.employeeData = [];
    this.spinner = true;
    this.employeeService
      .get_employee(sessionStorage.getItem("companyId"))
      .subscribe(
        (data) => {
          if (data["success"]) {
            this.spinner = false;

            //setTimeout(() => {
            this.employeeData = data["data"];
            //}, 200);

            this.spinner = false;
            // data['data'].forEach((ele) => {
            //   this.employeeData.push({
            //     id: ele.id,
            //     company_id: sessionStorage.getItem('companyId'),
            //     emp_code: ele.emp_code,
            //     name: ele.name,
            //     email: ele.email,
            //     phone: ele.phone,
            //     rm: ele.rm,
            //     role: ele.role,
            //     roleId: ele.roleId,
            //     dept: ele.dept,
            //     dept_name: this.getDeptName(ele.dept),
            //     desig_name: this.getDesgName(ele.desg),
            //     desg: ele.desg,
            //     profile_image: ele.profile_image,
            //     doj: new Date(),
            //     dob: new Date(),
            //     ctc_per_month: ele.ctc_per_month,
            //     gender: ele.gender,
            //     raise_bug: ele.raise_bug,
            //   });
            // });
          } else {
            this.spinner = false;
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }

  get f() {
    return this.myForm.controls;
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.myForm.invalid) {
      this.spinner = false;
      return;
    }
    if (this.editId) {
      this.myForm.value.id = this.editId;
    }
    const body = this.prepareSave();
    this.employeeService.employee_add(body).subscribe((data) => {
      if (data["success"]) {
        this.spinner = false;
        if (this.editId) {
          this.toastr.success(`Updated Successfully`);
        } else {
          this.toastr.success(`Employee Added Successfully`);
        }
        this.clear();
        this.showEmployeeList();
        this.employeeGet();
      } else {
        this.spinner = false;
        this.toastr.warning(data["message"]);
      }
    });
  }

  employeeEdit(item) {
    this.spinner = false;

    this.editId = item.id;
    this.showEmployeeForm();
    this.myForm.patchValue({
      emp_code: item.emp_code,
      name: item.name,
      email: item.email,
      phone: item.phone,
      rm: item.rm,
      role: item.roleId,
      dept: item.dept,
      desg: item.desg,
      profile_image: item.profile_image,
      doj: new Date(item.doj),
      dob: new Date(item.dob),
      ctc_per_month: item.ctc_per_month,
      gender: item.gender.toString(),
      raise_bug: item.raise_bug.toString(),
    });
  }

  clear() {
    this.myForm.reset();
    this.editId = "";
    this.employeeGet();
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = "";
  }

  company() {
    this.router.navigate(["/company"]);
  }
  customer() {
    if (this.roleName === "SuperAdmin") {
      this.router.navigate(["/company"]);
    } else {
      this.router.navigate(["/customer"]);
    }
  }

  showEmployeeForm() {
    this.viewEmployee = true;
    this.myForm.reset();
    this.myForm.controls["company_id"].setValue(
      sessionStorage.getItem("companyId")
    );
    this.myForm.controls["emp_code"].setValue(
      sessionStorage.getItem("emp_prefix") === "null"
        ? ""
        : sessionStorage.getItem("emp_prefix")
    );
  }
  showEmployeeList() {
    this.submitted = false;
    this.viewEmployee = false;
  }

  onFileChange(event) {
    // const reader = new FileReader();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }

  private prepareSave(): any {
    const input = new FormData();
    input.append("logo", this.itemImage);
    input.append("data", JSON.stringify(this.myForm.value));
    return input;
  }

  department() {
    this.dept = [];
    this.dept.unshift({
      label: "Select Department",
      value: null,
    });
    this.employeeService.department().subscribe((data) => {
      if (data["success"]) {
        this.departmentData = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.departmentData.forEach((element) => {
          this.dept.push({
            label: element.dept_name,
            value: element.id,
          });
        });
      } else {
        this.departmentData = [];
      }
    });
  }
  designation() {
    this.desg = [];
    this.desg.unshift({
      label: "Select Designation",
      value: null,
    });
    this.employeeService.designation().subscribe((data) => {
      if (data["success"]) {
        this.designationData = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.designationData.forEach((element) => {
          this.desg.push({
            label: element.designation,
            value: element.id,
          });
        });
      } else {
        this.designationData = [];
      }
    });
  }
  roles() {
    this.role = [];
    this.role.unshift({
      label: "Select Role",
      value: null,
    });
    this.employeeService.roles().subscribe((data) => {
      if (data["success"]) {
        this.roleData = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );

        this.roleData.forEach((element) => {
          this.role.push({
            label: element.role,
            value: element.id,
          });
        });
      } else {
        this.roleData = [];
      }
    });
  }

  getDeptName(id) {
    const data = _.filter(
      this.dept,
      (item) => parseInt(item.value, 10) === parseInt(id, 10)
    );
    console.log(data);
    if (data.length > 0) {
      return data[0].label;
    }
  }

  getDesgName(id) {
    const data = _.filter(
      this.desg,
      (item) => parseInt(item.value, 10) === parseInt(id, 10)
    );

    if (data.length > 0) {
      return data[0].label;
    }
  }

  getRoleName(id) {
    const data = _.filter(
      this.role,
      (item) => parseInt(item.value, 10) === parseInt(id, 10)
    );

    if (data.length > 0) {
      return data[0].label;
    }
  }

  handleFile(event) {
    this.excelData = [];
    let result1 = [];
    if (event) {
    }

    const file = event.target.files[0];

    this.xlsxToJsonService.processFileToJson({}, file).subscribe((data) => {
      this.excelData = data["sheets"]["Sheet1"];
      result1 = _.toArray(this.excelData);

      result1.forEach((ele) => {
        this.finalExcelData.push({
          emp_code: ele.emp_code,
          name: ele.name,
          email: ele.email,
          phone: ele.phone,
          rm: ele.rm,
          role: ele.role,
          dept: ele.dept,
          desg: ele.desg,
          doj: new Date(ele.doj),
          dob: new Date(ele.dob),
          gender: ele.gender,
        });
      });

      setTimeout(() => {
        event = null;
      }, 3000);

      // this.saveExcel();
    });
    // }
  }

  employeeUpload() {
    this.employeeService.employee_add(this.finalExcelData).subscribe(
      (data1) => {
        if (data1["success"]) {
          // this.back();
          this.toastr.success("Bulk Roles Added Succefully");
          this.employeeGet();
        } else {
          return this.toastr.error(data1["message"]);
        }
      },
      (error) => {
        this.toastr.error("Network Error");
      }
    );
  }
}
