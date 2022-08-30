import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TicketingAddService } from "./ticketing-add.service";
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import { CompanyService } from "../components/company/company.service";
import { CustomerService } from "../components/customer/customer.service";
import { ProjectService } from "../project-list/project-list.service";
import { CategoryService } from "../category/category.service";

@Component({
  selector: "app-ticketing-add",
  templateUrl: "./ticketing-add.component.html",
  styleUrls: ["./ticketing-add.component.css"],
})
export class TicketingAddComponent implements OnInit {
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public service: TicketingAddService,
    public toastr: ToastrService,
    public companyService: CompanyService,
    public customerService: CustomerService,
    public projectService: ProjectService,
    public categoryService: CategoryService
  ) {}
  addTicket: FormGroup;
  submitted = false;
  spinner = false;
  editId = "";
  startDate = new Date();
  endDate = new Date();
  groupData = [];
  assignedToEmp = [];
  assignedToEmpDummy = [];
  itemImage = "";
  finalArray = [];
  companyId = "";
  companyData = [];
  companyName = "";
  customerId = "";
  customerData = [];
  customerName = "";
  projectId = "";
  projectData = [];
  projectName = "";
  roleId = "";
  categoryList = [];
  categoryListD = [];
  category = [];
  subCategoryList = [];
  subCategoryListD = [];
  subcategory = [];
  praticeList = [];
  pratice = [];
  ngOnInit() {
    this.getTicketList();
    this.getCategory();
    this.getSubCategory();
    this.getPratice();
    this.companyId = sessionStorage.getItem("companyId");
    this.getCompanyById(this.companyId);
    this.customerId = sessionStorage.getItem("customerId");
    this.gitCustomerById(this.customerId);

    this.projectId = sessionStorage.getItem("projectId");
    this.companyId = sessionStorage.getItem("companyId");
    this.customerId = sessionStorage.getItem("customerId");
    this.projectId = sessionStorage.getItem("projectId");
    this.getProjectById(this.projectId);
    this.roleId = sessionStorage.getItem("role");
    this.getEmpGroup();
    this.getEmpLinking();
    this.addTicket = this.fb.group({
      company_id: sessionStorage.getItem("companyId"),
      customer_id: sessionStorage.getItem("customerId"),
      project_id: sessionStorage.getItem("projectId"),
      pm: sessionStorage.getItem("project_manager"),
      ticket_no: ["", Validators.required],
      ticket_desc: ["", Validators.required],
      category_id: ["", Validators.required],
      priority: ["", Validators.required],
      start_date: [new Date(), Validators.required],
      end_date: [new Date(), Validators.required],
      assigned_group_id: [""],
      status: 0,
      remarks: [""],
      files: [""],
      practice_id: [""],
      sub_category_id: [""],
      assigned_to: [""],
      assigned_by: parseInt(sessionStorage.getItem("id"), 10),
    });
  }

  backToList() {
    this.router.navigate(["/ticketingList"]);
    this.spinner = false;
  }

  getEmpGroup() {
    this.service
      .getProjectGroup(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.groupData.unshift({
            label: `Select Group Name`,
            value: null,
          });
          const fData = _.uniq(data["data"], "group_name");
          fData.forEach((item) => {
            this.groupData.push({
              label: item.group_name,
              value: item.id,
            });
          });
        }
      });
  }

  getCategory() {
    this.category = [];
    this.category.unshift({
      label: "Select Category",
      value: null,
    });
    this.categoryService.get_category().subscribe((data) => {
      if (data["success"]) {
        this.categoryList = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.categoryListD = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.categoryList.forEach((element) => {
          this.category.push({
            label: element.category,
            value: element.id,
          });
        });
      } else {
        this.categoryList = [];
      }
    });
  }

  getSubCategory() {
    this.subcategory = [];
    this.subcategory.unshift({
      label: "Select Sub Category",
      value: null,
    });
    this.categoryService.get_sub_category().subscribe((data) => {
      if (data["success"]) {
        this.subCategoryList = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.subCategoryListD = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.subCategoryList.forEach((element) => {
          this.subcategory.push({
            label: element.sub_category,
            value: element.id,
          });
        });
      } else {
        this.subCategoryList = [];
      }
    });
  }

  getPratice() {
    this.pratice = [];
    this.pratice.unshift({
      label: "Select Pratice",
      value: null,
    });
    this.categoryService.get_practice().subscribe((data) => {
      if (data["success"]) {
        this.praticeList = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        this.praticeList.forEach((element) => {
          this.pratice.push({
            label: element.practice,
            value: element.id,
          });
        });
      } else {
        this.praticeList = [];
      }
    });
  }
  assignedGroup(e) {
    let gd = "";
    console.log(e, this.groupData);
    const fData = _.filter(
      this.groupData,
      (item) => parseInt(item.value, 10) === e
    );
    if (fData.length) {
      console.log(fData[0].label);
      gd = fData[0].label;
    } else {
    }

    const arr1 = [];
    this.assignedToEmp = [];
    this.service
      .getProjectEmployeesByID(gd, this.projectId)
      .subscribe((data) => {
        if (data["success"]) {
          this.assignedToEmp.unshift({
            label: "Select Employee",
            value: null,
          });
          console.log(data["data"]);
          data["data"].forEach((item) => {
            this.assignedToEmp.push({
              label: item.emp_code + "-" + item.name,
              value: item.id,
            });
            arr1.push(item.id);
            this.addTicket.controls["assigned_to"].setValue(arr1);
          });
        } else {
          this.getEmpLinking();
        }
      });
  }

  getEmpLinking() {
    this.service
      .get_employees_link(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.assignedToEmpDummy = data["data"];
          this.assignedToEmp.unshift({
            label: "Select Employee",
            value: null,
          });
          data["data"].forEach((item) => {
            this.assignedToEmp.push({
              label: item.emp_code + "-" + item.name,
              value: item.id,
            });
          });
          // this.addTicket.value;
        } else {
          this.assignedToEmp = [];
        }
      });
  }

  onFileChange(event) {
    // const reader = new FileReader();

    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }
  private prepareSave(): any {
    const input = new FormData();
    input.append("logo", this.itemImage);
    input.append("data", JSON.stringify(this.finalArray));
    return input;
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
          console.log(this.customerName);
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
          console.log(this.projectName);
          if (temp.length > 0) {
            this.projectName = temp[0].project_name;
          }
        }
      });
  }
  get f() {
    return this.addTicket.controls;
  }
  // valiDate() {
  //   this.addTicket = this.fb.group({
  //     company_id: this.companyId,
  //     customer_id: this.customerId,
  //     project_id: this.projectId,
  //     pm: [''],
  //     ticket_no: ['', Validators.required],
  //     ticket_desc: ['', Validators.required],
  //     category_id: ['', Validators.required],
  //     priority: ['', Validators.required],
  //     start_date: [new Date(), Validators.required],
  //     end_date: [new Date(), Validators.required],
  //     assigned_group_id: ['', Validators.required],
  //     status: 0,
  //     remarks: [''],
  //     files: ['', Validators.required],
  //     assigned_to: ['', Validators.required],
  //     assigned_by: parseInt(sessionStorage.getItem('id'), 10),
  //   });
  // }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.addTicket.invalid) {
      this.spinner = false;
      return;
    }
    this.finalArray = [];
    console.log(this.addTicket.value);

    this.addTicket.value.assigned_to.forEach((item) => {
      this.finalArray.push({
        assigned_by: this.addTicket.value.assigned_by,
        assigned_group_id: this.addTicket.value.assigned_group_id
          ? this.addTicket.value.assigned_group_id
          : null,
        assigned_to: item,
        category_id: this.addTicket.value.category_id,
        company_id: this.addTicket.value.company_id,
        customer_id: this.addTicket.value.customer_id,
        end_date: this.addTicket.value.end_date,
        files: this.addTicket.value.files,
        pm: sessionStorage.getItem("project_manager"),
        priority: this.addTicket.value.priority,
        project_id: this.addTicket.value.project_id,
        remarks: this.addTicket.value.remarks,
        start_date: this.addTicket.value.start_date,
        status: this.addTicket.value.status,
        ticket_desc: this.addTicket.value.ticket_desc,
        ticket_no: this.addTicket.value.ticket_no,
        practice_id: this.addTicket.value.practice_id,
        sub_category_id: this.addTicket.value.sub_category_id,
      });
    });

    console.log(this.finalArray);

    const body = this.prepareSave();
    this.service.addTicket(body).subscribe((data) => {
      if (data["success"]) {
        this.toastr.success(`Ticket Added Successfully`);
        this.backToList();
        this.addTicket.reset();
        this.addTicket.controls["pm"].setValue(
          sessionStorage.getItem("project_manager")
        );
        this.spinner = false;
      } else {
        this.spinner = false;

        this.toastr.warning(data["message"]);
      }
    });
  }

  getTicketList() {
    const cId = sessionStorage.getItem("companyId");
    const cusId = sessionStorage.getItem("customerId");
    const projectId = sessionStorage.getItem("projectId");
    this.projectService.get_ticket(cId, cusId, projectId).subscribe((data) => {
      if (data["success"]) {
        console.log(data["data"]);
        const latestTicket = parseFloat(data["data"][0]["ticket_no"]) + 1;

        console.log(latestTicket);
        this.addTicket.controls["ticket_no"].setValue(latestTicket);
      } else {
        this.addTicket.controls["ticket_no"].setValue(this.projectId + "001");
      }
    });
  }
  praticeChange(e) {
    this.category = [];
    console.log(e);
    this.category.unshift({
      label: "Select Category",
      value: null,
    });

    this.categoryList = this.categoryListD.filter(
      (item) =>
        parseInt(item.status, 10) === parseInt("0", 10) &&
        parseInt(item.p_id, 20) === parseInt(e, 10)
    );
    this.categoryList.forEach((element) => {
      this.category.push({
        label: element.category,
        value: element.id,
      });
    });
  }
  categoryChange(e) {
    this.subcategory = [];
    console.log(e);
    this.subcategory.unshift({
      label: "Select Sub Category",
      value: null,
    });

    this.subCategoryList = this.subCategoryListD.filter(
      (item) =>
        parseInt(item.status, 10) === parseInt("0", 10) &&
        parseInt(item.c_id, 20) === parseInt(e, 10)
    );
    this.subCategoryList.forEach((element) => {
      this.subcategory.push({
        label: element.sub_category,
        value: element.id,
      });
    });
  }
}
