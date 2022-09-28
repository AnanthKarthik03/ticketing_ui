import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EmployeesGroupService } from "./employees-group.service";
import { ToastrService } from "ngx-toastr";
import { IDropdownSettings } from "ng-multiselect-dropdown";
import { SelectItem } from "primeng/api";
import { CompanyService } from "../components/company/company.service";
import { CustomerService } from "../components/customer/customer.service";
import { ProjectService } from "../project-list/project-list.service";
import * as _ from "underscore";

@Component({
  selector: "app-employees-group",
  templateUrl: "./employees-group.component.html",
  styleUrls: ["./employees-group.component.css"],
})
export class EmployeesGroupComponent implements OnInit {
  employeesForm!: FormGroup;
  viewEmployeeGroup = false;
  submitted = false;
  spinner = false;
  employeesData = [];
  editId = "";
  selectedEmployees: string;
  employeeId: any[];
  items: SelectItem[];
  item: string;
  groupData = [];
  groupNames = [];
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
    private fb: FormBuilder,
    private toastr: ToastrService,
    public service: EmployeesGroupService,
    public companyService: CompanyService,
    public customerService: CustomerService,
    public projectService: ProjectService
  ) {}

  ngOnInit() {
    this.role = sessionStorage.getItem("role");
    this.companyId = sessionStorage.getItem("companyId");
    this.getCompanyById(this.companyId);
    this.customerId = sessionStorage.getItem("customerId");
    this.gitCustomerById(this.companyId);
    this.projectId = sessionStorage.getItem("projectId");
    this.getProjectById(this.projectId);
    this.getEmpGroup();
    this.employeesForm = this.fb.group({
      project_id: sessionStorage.getItem("projectId"),
      group_name: ["", Validators.required],
      emp_id: ["", Validators.required],
    });
    this.getEmployees();
  }
  getCompanyById(id) {
    this.companyService.get_company().subscribe((data) => {
      if (data["success"]) {
        this.companyData = data["data"];
        const temp = _.filter(
          this.companyData,
          (item) => parseInt(item.id, 10) === parseInt(id, 10)
        );

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
            (item) => parseInt(item.company_id, 10) === parseInt(id, 10)
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

  getEmpGroup() {
    this.groupData = [];
    this.service
      .getProjectGroup(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.groupData = data["data"];
          this.groupNames = _.uniq(this.groupData, "group_name");
        }
      });
  }
  get f() {
    return this.employeesForm.controls;
  }
  project() {
    this.router.navigate(["/projects"]);
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.employeesForm.invalid) {
      this.spinner = false;
      return;
    }

    // this.service.addProjectGroup(body).subscribe((data) => {
    //   if (data["success"]) {

    //   }
    //console.log(this.employeesForm.value);
    //if (this.editId) {
    //this.employeesForm.value.id = this.editId;
    //}
    const body = this.employeesForm.value;

    if (this.editId) {
      body["id"] = this.editId;
    }

    this.service.addProjectGroup(body).subscribe(
      (data) => {
        if (data["success"]) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Employee ID Added Successfully`);
          }
          this.employeesForm.reset();
          this.editId = "";
          this.showEmployeeGroupList();
          this.getEmployees();
          this.getEmpGroup();
        } else {
          this.spinner = false;
          this.toastr.error(data["message"]);
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
    //   body.status = JSON.parse(body.status);
    //   if (this.editId) {
    //     body['id'] = this.editId;
    //   }
    //   this.service.add_employees(body).subscribe(
    //     (data) => {

    //       if (data['success']) {
    //         this.spinner = false;
    //         if (this.editId) {
    //           this.toastr.success(`Updated Successfully`);
    //         } else {
    //           this.toastr.success(`Employee ID Added Successfully`);
    //         }

    //         // $('#large-Modal').modal('hide');
    //         this.clear();
    //       } else {
    //         this.spinner = false;
    //         this.toastr.error(data['message']);
    //       }
    //     },
    //     (err) => {
    //       this.spinner = false;
    //     }
    //   );
    // }
  }

  clear() {
    this.employeesForm.reset();
    this.editId = "";
    this.getEmployees();
    this.spinner = false;
    this.submitted = false;
  }
  // edit(item) {
  //   this.spinner = false;
  //   this.editId = item.id;

  //   this.showEmployeeGroupForm();
  //   this.employeesForm.patchValue({
  //     group_name: item.group_name,
  //     emp_id: parseInt(item.name, 10),
  //   });
  // }
  edit(item) {
    const dd = this.getUsernames(item.group_name);

    this.spinner = false;

    this.editId = item.id;

    this.showEmployeeGroupForm();
    this.employeesForm.patchValue({
      group_name: item.group_name,
    });
    const ff = [];
    dd.forEach((ele) => {
      ff.push(ele.id);
    });

    this.employeesForm.patchValue({
      emp_id: ff,
    });
  }
  showEmployeeGroupForm() {
    this.viewEmployeeGroup = true;
    this.employeesForm.reset();
    this.employeesForm.controls["project_id"].setValue(
      sessionStorage.getItem("projectId")
    );
    this.submitted = false;
    this.spinner = false;
  }
  showEmployeeGroupList() {
    this.employeesData = [];
    this.viewEmployeeGroup = false;
  }

  getEmpLinking() {
    this.employeesData = [];
    this.service
      .get_employees_link(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          data["data"].forEach((item) => {
            this.employeesData.push({
              label: item.emp_code + "-" + item.name,
              value: item.id,
            });
          });
        }
      });
  }

  getUsernames(id) {
    const data = _.filter(this.groupData, (item) => item.group_name === id);

    if (data.length > 0) {
      return data;
    }
  }

  getEmployees() {
    this.spinner = true;
    this.service.get_employees(sessionStorage.getItem("companyId")).subscribe(
      (data) => {
        if (data["success"]) {
          data["data"].forEach((item) => {
            this.employeesData.push({
              label: item.emp_code + "-" + item.name,
              value: item.id,
            });
          });
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
  company() {
    this.router.navigate(["/company"]);
  }
  customer() {
    this.router.navigate(["/customer"]);
  }
}
