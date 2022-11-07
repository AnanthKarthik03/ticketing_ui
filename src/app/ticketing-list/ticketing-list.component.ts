import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CompanyService } from "../components/company/company.service";
import { CustomerService } from "../components/customer/customer.service";
import { ProjectService } from "../project-list/project-list.service";
import * as _ from "underscore";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { TicketingAddService } from "../ticketing-add/ticketing-add.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CategoryService } from "../category/category.service";

declare var $: any;

@Component({
  selector: "app-ticketing-list",
  templateUrl: "./ticketing-list.component.html",
  styleUrls: ["./ticketing-list.component.css"],
})
export class TicketingListComponent implements OnInit {
  empTicket!: FormGroup;
  submitted = false;
  spinner = false;
  editId = "";
  companyId = "";
  companyData = [];
  companyName = "";
  customerId = "";
  customerData = [];
  customerName = "";
  projectId = "";
  projectData = [];
  projectName = "";
  openData = [];
  InPorgressData = [];
  waitingForCustomer = [];
  solutionVerified = [];
  closed = [];
  bugView = {};
  status = "";
  status_live = "";
  comments = "";
  cause="";
  resolution="";
  categoryList = [];
  //categoryListD = [];
  category = [];
  subCategoryList = [];
  subCategoryListD = [];
  subcategory = [];
  praticeList = [];
  pratice = [];
  practiceData = [];
  role = "";
  categoryData1 = [];
  path = environment.ticketingFiles;
  itemImage = "";
  ticketAdd = "";
  empId = "";
  historyData = [];
  resolved = [];
  approved = [];
  hold = [];
  reOpen = [];
  empFilter = [];
  allTicketsData = [];
  assignedToEmp = [];
  assignedToEmpLive = [];
  reassignField = false;
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public companyService: CompanyService,
    public customerService: CustomerService,
    public projectService: ProjectService,
    public toastr: ToastrService,
    public ticketService: TicketingAddService,
    public categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.role = sessionStorage.getItem("role");
    this.empId = sessionStorage.getItem("id");
    this.ticketAdd = sessionStorage.getItem("raise_bug");

    this.companyId = sessionStorage.getItem("companyId");
    this.getTicketList();
    this.categoryDetails();
    this.getSubCategory();
    this.getPratice();
    this.getCompanyById(this.companyId);
    this.customerId = sessionStorage.getItem("customerId");
    this.gitCustomerById(this.customerId);
    this.projectId = sessionStorage.getItem("projectId");
    this.getProjectById(this.projectId);
    this.getEmpLinking();

    this.empTicket = this.fb.group({
      comments: ["", Validators.required],
      resolution: ["",],
      cause: ["",],

    });
    
  }
  
  getEmpLinking() {
    this.ticketService
      .get_employees_link(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.assignedToEmpLive = data["data"];
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
  get f() {
    return this.empTicket.controls;
  }

  ticketingAdd() {
    this.router.navigate(["/ticketingAdd"]);
    this.spinner = false;
  }

  // getCompanyById(id) {
  //   this.companyService.get_company().subscribe((data) => {
  //     if (data["success"]) {
  //       this.companyData = data["data"];
  //       const temp = _.filter(
  //         this.companyData,
  //         (item) => parseInt(item.id, 10) === parseInt(id, 10)
  //       );
  //       console.log(this.companyName);
  //       if (temp.length > 0) {
  //         this.companyName = temp[0].company_name;
  //       }
  //     }
  //   });
  // }
  // gitCustomerById() {
  //   this.customerService
  //   const id = sessionStorage.getItem("companyId");
  //   this.customerService.get_customer(id).subscribe((data) => {
  //     if (data["success"]) {
  //       this.customerData = data["data"];
  //       const temp = _.filter(
  //         this.customerData,
  //         (item) => parseInt(item.id, 10) === parseInt(id, 10)
  //       );
  //       console.log(this.customerName);
  //       if (temp.length > 0) {
  //         this.customerName = temp[0].company_name;
  //       }
  //     }
  //   });
  // }
  // getProjectById(id) {
  //   this.projectService
  //   this.projectService.get_project(id, id).subscribe((data) => {
  //     if (data["success"]) {
  //       this.projectData = data["data"];
  //       const temp = _.filter(
  //         this.projectData,
  //         (item) => parseInt(item.id, 10) === parseInt(id, 10)
  //       );
  //       console.log(this.projectName);
  //       if (temp.length > 0) {
  //         this.projectName = temp[0].project_name;
  //       }
  //     }
  //   });
  //}

  company() {
    this.router.navigate(["/company"]);
  }
  customer() {
    this.router.navigate(["/customer"]);
  }

  project() {
    if (this.role === "Admin") {
      this.router.navigate(["/projects"]);
    }
    if (this.role === "Pm") {
      this.router.navigate(["/projects"]);
    } else {
      this.router.navigate(["/employeeDashboard"]);
    }
  }

  getTicketList() {
    this.empFilter = [];
    this.empFilter.unshift(
      {
        label: "Filter By Employee",
        value: null,
      },
      {
        label: "All",
        value: "all",
      }
    );
    const cId = sessionStorage.getItem("companyId");
    const cusId = sessionStorage.getItem("customerId");
    const projectId = sessionStorage.getItem("projectId");
    this.projectService.get_ticket(cId, cusId, projectId).subscribe((data) => {
      if (data["success"]) {
        this.allTicketsData = data["data"];

        const filterDataById = _.uniq(data["data"], "assigned_to");
        filterDataById.forEach((item) => {
          this.empFilter.push({
            label: item.assigned_to_name,
            value: item.assigned_to,
          });
        });

        this.openData = _.filter(data["data"], (item) => item.status === 0);
        this.InPorgressData = _.filter(
          data["data"],
          (item) => item.status === 1
        );
        this.waitingForCustomer = _.filter(
          data["data"],
          (item) => item.status === 3
        );

        this.closed = _.filter(data["data"], (item) => item.status === 5);
        this.resolved = _.filter(data["data"], (item) => item.status === 2);
        this.approved = _.filter(data["data"], (item) => item.status === 4);
        this.hold = _.filter(data["data"], (item) => item.status === 6);
        this.reOpen = _.filter(data["data"], (item) => item.status === 7);
      }
    });
  }

  filterByEmployee(e) {
    if (e === "all" || e === null) {
      this.getTicketList();
    } else {
      const dd = _.filter(
        this.allTicketsData,
        (item) => parseInt(item.assigned_to, 10) === parseInt(e, 10)
      );
      this.openData = _.filter(dd, (item) => item.status === 0);
      this.InPorgressData = _.filter(dd, (item) => item.status === 1);
      this.waitingForCustomer = _.filter(dd, (item) => item.status === 3);
      this.closed = _.filter(dd, (item) => item.status === 5);
      this.resolved = _.filter(dd, (item) => item.status === 2);
      this.approved = _.filter(dd, (item) => item.status === 4);
      this.hold = _.filter(dd, (item) => item.status === 6);
      this.reOpen = _.filter(dd, (item) => item.status === 7);
    }
  }
  viewTicket(item) {
    this.reassignField = false;
    this.submitted = false;
    this.historyData = [];
    this.comments = "";
    this.bugView = item;
    this.status = item.status;
    this.status_live = item.status;
    this.ticketService.getTicketHistory(item.id).subscribe((data) => {
      if (data["success"]) {
        this.historyData = data["data"];
      }
    });
  }
  categoryDetails() {
    this.categoryService.get_category().subscribe((data) => {
      if (data["success"]) {
        //this.categoryList = data['data'];
        //console.log(data['data']);
        this.categoryData1 = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        //console.log(this.categoryData1);
        this.categoryData1.forEach((item) => {
          this.categoryList.push({
            label: item.category,
            value: item.id,
          });
        });
      } else {
        this.categoryList = [];
      }
    });
  }

  getCategoryName(id) {
    //console.log(this.categoryList)
    const data = _.filter(
      this.categoryList,
      (item) => item.value === id
      //(item) => parseInt(item.id, 10) === parseInt(id, 10)
    );
    //console.log(this.categoryList);
    if (data.length > 0) {
      return data[0].label;
    } else {
      return "-";
    }
  }
  getSubCategory() {
    this.subcategory = [];

    this.categoryService.get_sub_category().subscribe((data) => {
      if (data["success"]) {
        this.subCategoryList = data["data"].filter(
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

  getSubCategoryName(id) {
    //console.log(this.subCategoryList)
    const data = _.filter(
      this.subcategory,
      //(item) => item.value === id
      (item) => parseInt(item.value, 10) === parseInt(id, 10)
    );
    //console.log( this.subCategoryList);
    if (data.length > 0) {
      return data[0].label;
    } else {
      return "-";
    }
  }

  getPratice() {
    //this.pratice = [];

    this.categoryService.get_practice().subscribe((data) => {
      if (data["success"]) {
        this.praticeList = data["data"].filter(
          (item) => parseInt(item.status, 10) === parseInt("0", 10)
        );
        //console.log(this.praticeList)
        this.praticeList.forEach((item) => {
          this.pratice.push({
            label: item.practice,
            value: item.id,
          });
        });
      } else {
        this.praticeList = [];
      }
    });
  }
  getPraticeName(id) {
    const data = _.filter(
      this.pratice, //(item) => item.value === id
      (item) => parseInt(item.value, 10) === parseInt(id, 10)
    );

    if (data.length > 0) {
      return data[0].label;
    } else {
      return "-";
    }
  }

  statusSubmit() {
    this.reassignField = false;
    this.spinner = true;
    this.submitted = true;
    if (this.empTicket.invalid) {
      this.spinner = false;
      $("#modal-fullscreen").modal("show");
      return;
    }

    // if (
    //  ( parseInt(this.empId, 10) === parseInt(this.bugView["assigned_to"], 10) &&
    //  parseInt(this.status, 10) !== 4 &&
    //   parseInt(this.status, 10) !== 5 &&
    //   parseInt(this.status, 10) !== 6 &&
    //   parseInt(this.status, 10) !== 7) ||  parseInt(this.empId, 10) === parseInt(this.bugView["assigned_by"], 10)
    // ) {
    const body = this.prepareSave();

    this.ticketService.ticket_history(body).subscribe((data) => {
      if (data["success"]) {
        this.spinner = false;
        this.toastr.success(`Ticket Updated Successfully`);
        $("#modal-fullscreen").modal("hide");
        this.clear();
      } else {
        this.spinner = false;
        this.toastr.error(data["message"]);
        this.toastr.warning(`You are not authorised to close this ticket`);
      }
    });
    // } else {
    //   this.spinner = false;
    //   this.toastr.warning(`You are not authorised to close this ticket`);
    // }
  }
  clear() {
    this.empTicket.reset();
    this.editId = "";
    this.getTicketList();
    this.spinner = false;
    this.submitted = false;
  }

  onFileChange(event) {
    // const reader = new FileReader();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }
  private prepareSave(): any {
    const body = {
      ticket_id: this.bugView["id"],
      status: this.status,
      comments: this.comments,
      resolution: this.resolution,
      cause: this.cause,
    };
    const input = new FormData();
    input.append("logo", this.itemImage);
    input.append("data", JSON.stringify(body));
    return input;
  }

  reAssign() {
    this.reassignField = true;
  }

  reAssignChange(id) {
    this.categoryService
      .updateTicket(id, this.bugView["id"])
      .subscribe((data) => {
        $("#modal-fullscreen").modal("hide");
         this.clear();
        this.toastr.success(`Ticket Re Assigned Assigned !`);
      });
  }
  statusChange(e) {
    console.log(e);
    this.status = e;
  }
  
}
