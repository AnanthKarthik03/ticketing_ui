import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EmployeesGroupService } from "../employees-group/employees-group.service";
import * as _ from "underscore";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { CompanyService } from "../components/company/company.service";
import { CustomerService } from "../components/customer/customer.service";
import { ProjectService } from "../project-list/project-list.service";

@Component({
  selector: "app-project-employees",
  templateUrl: "./project-employees.component.html",
  styleUrls: ["./project-employees.component.css"],
})
export class ProjectEmployeesComponent implements OnInit {
  viewForm = false;
  editId = "";
  employeesForm: FormGroup;
  projectManager = [];
  employeeName = [];
  spinner = false;
  submitted = false;
  employeesData = [];
  empLinkData = [];
  pmNames = [];
  companyId = "";
  companyData = [];
  companyName = "";
  customerId = "";
  customerData = [];
  customerName = "";
  projectId = "";
  projectData = [];
  projectName = "";
  role = "";
  constructor(
    public router: Router,
    public service: EmployeesGroupService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public companyService: CompanyService,
    public customerService: CustomerService,
    public projectService: ProjectService
  ) { }

  ngOnInit() {
    this.role = sessionStorage.getItem("role");
    this.companyId = sessionStorage.getItem("companyId");
    this.projectId = sessionStorage.getItem("projectId");
    this.customerId = sessionStorage.getItem("customerId");
    this.getCompanyById(this.companyId);
    this.gitCustomerById(this.customerId);
    this.getProjectById(this.projectId);
    this.getEmployees();
    this.getEmpLinking();

    this.employeesForm = this.fb.group({
      project_id: sessionStorage.getItem("projectId"),
      project_manager: ["", Validators.required],
      emp_id: ["", Validators.required],
    });
  }

  getCompanyById(id) {
    this.companyService.get_company().subscribe((data) => {
      if (data["success"]) {
        this.companyData = data["data"];
        const temp = _.filter(
          this.companyData,
          (item) => parseInt(item.id, 10) === parseInt(id, 10)
        );
        console.log(this.companyName);
        if (temp.length > 0) {
          this.companyName = temp[0].company_name;
        }
      }
    });
  }
  gitCustomerById(id) {
    this.customerService
      .get_customer(sessionStorage.getItem("companyId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.customerData = data["data"];
          const temp = _.filter(
            this.customerData,
            (item) => parseInt(item.id, 10) === parseInt(id, 10)
          );

          if (temp.length > 0) {
            this.customerName = temp[0].company_name;
          }
        }
      });
  }
  getProjectById(id) {
    this.projectService
      .get_project(
        sessionStorage.getItem("companyId"),
        sessionStorage.getItem("customerId")
      )
      .subscribe((data) => {
        if (data["success"]) {
          this.projectData = data["data"];
          const temp = _.filter(
            this.projectData,
            (item) => parseInt(item.id, 10) === parseInt(id, 10)
          );

          if (temp.length > 0) {
            this.projectName = temp[0].project_name;
          }
        }
      });
  }

  company() {
    this.router.navigate(["/company"]);
  }
  customer() {
    this.router.navigate(["/customer"]);
  }
  project() {
    this.router.navigate(["/projects"]);
  }
  showProjectEmployeesForm() {
    this.employeesForm.reset();
    this.submitted = false;
    this.spinner = false;
    this.viewForm = true;
    this.employeesForm.controls["project_id"].setValue(
      sessionStorage.getItem("projectId")
    );
  }
  showProjectEmployeeTable() {
    this.viewForm = false;
    this.spinner = false;
  }

  get f() {
    return this.employeesForm.controls;
  }
  submitForm() {
    this.spinner = true;
    this.submitted = true;
    if (this.employeesForm.invalid) {
      this.spinner = false;
      return;
    }
    const body = this.employeesForm.value;

    if (this.editId) {
      body["id"] = this.editId;
    }
    this.service.addProjectEmp(body).subscribe((data) => {
      if (data["success"]) {
        this.spinner = false;
        if (this.editId) {
          this.toastr.success(`Updated Successfully`);
        } else {
          this.toastr.success(`Company Added Successfully`);
        }
        this.editId = "";
        this.employeesForm.reset();
        this.showProjectEmployeeTable();
        this.getEmployees();
        this.getEmpLinking();
      } else {
        this.spinner = false;
        this.toastr.warning(data["message"]);
      }
    });
  }
  private prepareSave(): any {
    const input = new FormData();
    input.append("data", JSON.stringify(this.employeesForm.value));
    return input;
  }
  getEmpLinking() {
    this.spinner = true;
    this.service
      .get_employees_link(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.empLinkData = data["data"];

          this.pmNames = _.uniq(this.empLinkData, "pm");
        }
      });
  }
  getUsernames(id) {
    const data = _.filter(this.empLinkData, (item) => item.pm === id);

    if (data.length > 0) {
      return data;
    }
  }
  getEmployees() {
    this.projectManager = [];
    this.employeeName = [];
    this.spinner = false;
    this.service.get_employees(sessionStorage.getItem("companyId")).subscribe(
      (data) => {
        if (data["success"]) {
          const pmData = _.filter(
            data["data"],
            (item) => item.role.toUpperCase() === "PM"
          );
          const UserType = _.filter(
            data["data"],
            (item) => item.user_type === "I"
          );
          console.log(UserType.user_type = "I")


          this.projectManager.unshift({
            label: "Select Project Manager",
            value: null,
            disabled: true,
          });
          pmData.forEach((pmd) => {
            this.projectManager.push({
              label: pmd.emp_code + "-" + pmd.name,
              value: pmd.id,
            });
          });
          this.employeeName.unshift({
            label: "Select Project Employee",
            value: null,
            disabled: true,
          });
          if (this.projectId === "28") {
            UserType.forEach((pmd) => {
              this.employeeName.push({
                label: pmd.emp_code + "-" + pmd.name,
                value: pmd.id,
              });
            });
            console.log("Hello", UserType)
          } else {
            data["data"].forEach((pmd) => {
              this.employeeName.push({
                label: pmd.emp_code + "-" + pmd.name,
                value: pmd.id,
              });
            });
            console.log("bye",data["data"])
          }

          this.spinner = false;
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  edit(item) {
    const dd = this.getUsernames(item.pm);

    this.spinner = false;

    this.editId = item.id;

    this.showProjectEmployeesForm();
    //  this.showProjectEmployeesForm();
    // item['data'].forEach((item) => {
    //   this.employeesForm.patchValue({
    //   project_manager: item.pmId,
    //   emp_id: item.emp_code + '-' + item.name,

    // });});
    this.employeesForm.patchValue({
      project_manager: item.pmId,
      //emp_id: item.emp_code + '-' + item.name,
      // emp_id: parseInt(item.emp_code, 10),
    });
    const ff = [];
    dd.forEach((ele) => {
      ff.push(ele.id);
    });

    this.employeesForm.patchValue({
      emp_id: ff,
    });
  }
}
