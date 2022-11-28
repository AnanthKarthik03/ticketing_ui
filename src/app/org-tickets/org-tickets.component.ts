import { Component, OnInit, } from "@angular/core";
import { EmployeesService } from "../employees/employees.service";
import { ProjectService } from "../project-list/project-list.service";
import { ProjectReportService } from "../project-report/projectReport.service";
import * as _ from "underscore";
import { CategoryService } from "../category/category.service";
import { ExcelService } from "../excel.service";
import * as moment from "moment";
import { OtherService } from "src/app/other/other.service";
import { TicketingAddService } from "../ticketing-add/ticketing-add.service";
import { TicketingDetailsService } from "../ticketing-details/ticketingDetails.service";
import { ToastrService } from "ngx-toastr";
import { CustomerService } from "../components/customer/customer.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

declare var $: any;

@Component({
  selector: "app-org-tickets",
  templateUrl: "./org-tickets.component.html",
  styleUrls: ["./org-tickets.component.css"],
})
export class OrgTicketsComponent implements OnInit {
  
  empTicket!: FormGroup;
  spinner = false;
  ticketDetailsData = [];
  projectsData = [];
  projectListData = [];
  customerData = [];
  selectClient = [];
  companyId = sessionStorage.getItem("companyId");
  customerId = sessionStorage.getItem("customerId");
  projectId = "";
  empData = [];
  status_dummy = "";
  status = "";
  categoryList = [];
  selectProject = [];
  selectCategory = [];
  selectStatus = [];
  selectAssignedTo = [];
  excelData = [];
  othersList = [];
  praticeList = [];
  date3 = new Date();
  date4 = new Date();
  editId = "";
  role = sessionStorage.getItem("role");
  selectedProjects = "";
  ticketDetailsDataD = [];
  ticketDetailsDataD1 = [];
  ticketDetailsData1 = [];
  ticketId = "";
  customerName = "";
  empFilter = [];
  allTicketsData = [];
  openData = [];
  InPorgressData = [];
  waitingForCustomer = [];
  closed = [];
  resolved = [];
  approved = [];
  hold = [];
  bugView = {};
  comments = "";
  reOpen = [];
  reassignField = false;
  submitted = false;
  historyData = [];
  itemImage = "";
  pratice = [];
  subCategoryList = [];
  subCategoryListD = [];
  subcategory = [];
  assignedToEmp = [];
  assignedToEmpDummy = [];
  constructor(
    public service: TicketingDetailsService,
    public projectService: ProjectReportService,
    public projectService1: ProjectService,
    public empService: EmployeesService,
    public categoryService: CategoryService,
    public othersService: OtherService,
    private excelService: ExcelService,
    public customerService: CustomerService,
    private toastr: ToastrService,
    public routers: Router, public router: ActivatedRoute,
    private fb: FormBuilder,
    public ticketService: TicketingAddService,
  ) {}

  ngOnInit() {
    this.getEmpLinking();
    this.projectGet();
    this.getEmps();
    this.getCategory();
    this.ticketDetails('9999');
    this.categoryGet();
    this.assignedToGet();
    this.customerId = sessionStorage.getItem("customerId");
    this.projectId = sessionStorage.getItem("projectId");
    this.get_customer();
    this.getSubCategory();
    //this.getDays();
    this.getPratice();
    this.empTicket = this.fb.group({
      comments: ["", Validators.required],
    });
  }

  getEmpLinking() {
    this.ticketService
      .get_employees_link(sessionStorage.getItem("projectId"))
      .subscribe((data) => {
        if (data["success"]) {
          this.assignedToEmpDummy = data["data"];
          console.log(this.assignedToEmpDummy)
          this.assignedToEmp.unshift({
            label: "Select Employee",
            value: null,
          });
          this.assignedToEmpDummy.forEach((item) => {
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

  get f() {
    return this.empTicket.controls;
  }

  // getTicketList() {
  //   this.empFilter = [];
  //   this.empFilter.unshift(
  //     {
  //       label: "Filter By Employee",
  //       value: null,
  //     },
  //     {
  //       label: "All",
  //       value: "all",
  //     }
  //   );
  //   const cId = sessionStorage.getItem("companyId");
  //   const cusId = sessionStorage.getItem("customerId");
  //   const projectId = sessionStorage.getItem("projectId");
  //   this.projectService1.get_ticket(cId, cusId, projectId).subscribe((data) => {
  //     if (data["success"]) {
  //       this.allTicketsData = data["data"];

  //       const filterDataById = _.uniq(data["data"], "assigned_to");
  //       filterDataById.forEach((item) => {
  //         this.empFilter.push({
  //           label: item.assigned_to_name,
  //           value: item.assigned_to,
  //         });
  //       });

  //       this.openData = _.filter(data["data"], (item) => item.status === 0);
  //       this.InPorgressData = _.filter(
  //         data["data"],
  //         (item) => item.status === 1
  //       );
  //       this.waitingForCustomer = _.filter(
  //         data["data"],
  //         (item) => item.status === 3
  //       );

  //       this.closed = _.filter(data["data"], (item) => item.status === 5);
  //       this.resolved = _.filter(data["data"], (item) => item.status === 2);
  //       this.approved = _.filter(data["data"], (item) => item.status === 4);
  //       this.hold = _.filter(data["data"], (item) => item.status === 6);
  //       this.reOpen = _.filter(data["data"], (item) => item.status === 7);
  //     }
  //   });
  // }

  // filterByEmployee(e) {
  //   if (e === "all" || e === null) {
  //     this.getTicketList();
  //   } else {
  //     const dd = _.filter(
  //       this.allTicketsData,
  //       (item) => parseInt(item.assigned_to, 10) === parseInt(e, 10)
  //     );
  //     this.openData = _.filter(dd, (item) => item.status === 0);
  //     this.InPorgressData = _.filter(dd, (item) => item.status === 1);
  //     this.waitingForCustomer = _.filter(dd, (item) => item.status === 3);
  //     this.closed = _.filter(dd, (item) => item.status === 5);
  //     this.resolved = _.filter(dd, (item) => item.status === 2);
  //     this.approved = _.filter(dd, (item) => item.status === 4);
  //     this.hold = _.filter(dd, (item) => item.status === 6);
  //     this.reOpen = _.filter(dd, (item) => item.status === 7);
  //   }
  // }

  onFileChange(event) {
    // const reader = new FileReader();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }

  viewTicket(item) {
    this.reassignField = false;
    this.submitted = false;
    this.historyData = [];
    this.bugView = item;
    console.log(this.bugView);
    this.status = item.status;
    this.status_dummy = item.status;
    this.ticketService.getTicketHistory(item.id).subscribe((data) => {
      if (data["success"]) {
        this.historyData = data["data"];
      }
    });
  }

  private prepareSave(): any {
    const body = {
      ticket_id: this.bugView["id"],
      status: this.status,
      comments: this.comments,
    };
    const input = new FormData();
    input.append("logo", this.itemImage);
    input.append("data", JSON.stringify(body));
    return input;
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

  reAssign() {
    this.reassignField = true;
  }

  get_customer() {
    this.selectClient = [];
    
    this.customerService
      .get_customer(sessionStorage.getItem('companyId'))
      .subscribe(
        (data) => {
          if (data["success"]) {
            console.log(data["data"]);
            this.customerData = data["data"];
          }
           else {
            this.spinner = false;
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }
  getcustomerName(id) {
    const data = _.filter(
      this.customerData,(item) => parseInt(item.id, 10) === parseInt(id, 10)
    );
    if (data.length > 0) {
      return data[0].customer_name_first;
    } else {
      return "-";
    }
  }
  getEmps() {
    this.empService.get_employee(this.companyId).subscribe((data) => {
      if (data["success"]) {
        console.log(data["data"]);
        this.empData = data["data"];
      }
    });
  }

  getEmpName(id) {
    const data = _.filter(
      this.empData,
      (item) => parseInt(item.id, 10) === parseInt(id, 10)
    );

    if (data.length > 0) {
      return data[0].name;
    }
  }

  clear() {
    this.empTicket.reset();
    this.editId = "";
    this.ticketDetails(this.selectedProjects.length > 0 ? this.selectedProjects : '9999');
    this.spinner = false;
    this.submitted = false;
  }

  getOther() {
    this.othersList = [];
    this.spinner = true;
    this.othersService.get_other().subscribe(
      (data) => {
        if (data["success"]) {
          // data['data'].forEach((ele) => {
          //   this.othersList.push({
          //     label: ele.others,
          //     value: ele.id,
          //   });
          // });
          this.othersList = data["data"];
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

  getOthersName(id) {
    const othersNameFilter = _.filter(
      this.othersList,
      (item) => parseInt(item.id, 10) === parseInt(id, 10)
    );

    if (othersNameFilter.length > 0) {
      return othersNameFilter[0].others;
    } else {
      return "-";
    }
  }

  ticketDetails(id) {
    this.ticketDetailsData = [];
    this.service
      .orgTickets(
        sessionStorage.getItem("companyId"),
        id,
        moment(this.date3).format("YYYY-MM-DD"),
        moment(this.date4).format("YYYY-MM-DD")
      )
      .subscribe(
        (data) => {
          if (data["success"]) {
            // this.ticketDetailsData = data['data'];
            console.log(data["data"]);
            const arr = data["data"].concat(data["others"]);
            data["data"].forEach((ele) => {
              this.ticketDetailsData.push({
                //ticket_no: ele.ticket_no,
                ticket_no:
                  ele.ticket_no === 0
                    ? this.getOthersName(ele.others)
                    : ele.ticket_no,
                assigned_by: this.getEmpName(ele.assigned_by),
                assigned_to: this.getEmpName(ele.assigned_to),
                project_name: ele.project_name ? ele.project_name : "Others",
                category_id: this.getCategoryName(ele.category_id),
                practice_id: this.getPraticeName(ele.practice_id),
                sub_category_id: this.getSubCategoryName(ele.sub_category_id),
                end_date: ele.end_date,
                group_name: ele.group_name,
                id: ele.id,
                pm: ele.pm,
                priority: ele.priority,
                files: ele.files,
                priority_name:
                  ele.priority === 0
                    ? "Lower"
                    : ele.priority === 1
                    ? "High"
                    : ele.priority === 2
                    ? "Medium"
                    : "Medium",
                start_date: ele.start_date,
                created_at: ele.created_at,
                updated_at: ele.updated_at,
                status: ele.status,
                status_name:
                  ele.status === 0
                    ? "Open"
                    : ele.status === 1
                    ? "In-Progress"
                    : ele.status === 2
                    ? "Resolved"
                    : ele.status === 3
                    ? "Awaiting Information"
                    : ele.status === 4
                    ? "Approved"
                    : ele.status === 5
                    ? "Closed"
                    : ele.status === 6
                    ? "Hold"
                    : "Reopen",
                ticket_desc: ele.ticket_desc,
                customer_id: this.getcustomerName(ele.customer_id)
              });
            });
            this.ticketDetailsDataD = this.ticketDetailsData;
          } else {
            this.ticketDetailsData = [];
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }

  // categoryDetails() {
  //   this.categoryService.get_category().subscribe((data) => {
  //     if (data["success"]) {
  //       //this.categoryList = data['data'];
  //       //console.log(data['data']);
  //       this.categoryData1 = data["data"].filter(
  //         (item) => parseInt(item.status, 10) === parseInt("0", 10)
  //       );
  //       //console.log(this.categoryData1);
  //       this.categoryData1.forEach((item) => {
  //         this.categoryList.push({
  //           label: item.category,
  //           value: item.id,
  //         });
  //       });
  //     } else {
  //       this.categoryList = [];
  //     }
  //   });
  // }

  // getCategoryName(id) {
  //   //console.log(this.categoryList)
  //   const data = _.filter(
  //     this.categoryList,
  //     (item) => item.value === id
  //     //(item) => parseInt(item.id, 10) === parseInt(id, 10)
  //   );
  //   //console.log(this.categoryList);
  //   if (data.length > 0) {
  //     return data[0].label;
  //   } else {
  //     return "-";
  //   }
  // }
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
 

  projectReport(id) {
    this.selectedProjects = id;
    sessionStorage.setItem("projectId", id);
    this.ticketDetails(id.length > 0 ? id : '9999');
    this.getEmpLinking();
  }

  assignedToReport(id) {
    this.selectAssignedTo = id;
    this.ticketDetails(id);
  }

  categoryReport(id) {
    this.selectCategory = id;
  }

  projectGet() {
    // this.selectProject.unshift({
    //   label: 'Filter By Project',
    //   value: null,
    // });
    this.spinner = true;
    if (this.role === "Pm") {
      this.projectService1
        .getPMProjectsList(sessionStorage.getItem("id"))
        .subscribe(
          (data) => {
            if (data["success"]) {
              this.spinner = false;
              this.projectListData = data["data"];
              const filterDataById = _.uniq(data["data"], "id");
              filterDataById.forEach((item) => {
                this.selectProject.push({
                  label: item.project_name,
                  value: item.id,
                });
              });
            } else {
              this.spinner = false;
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
    } else {
      this.projectService1
        .get_project(
          sessionStorage.getItem("companyId"),
          sessionStorage.getItem("customerId")
        )
        .subscribe(
          (data) => {
            if (data["success"]) {
              this.spinner = false;
              this.projectListData = data["data"];
              const filterDataById = _.uniq(data["data"], "id");
              filterDataById.forEach((item) => {
                this.selectProject.push({
                  label: item.project_name,
                  value: item.id,
                });
              });
             // console.log(data["data"]);
            } else {
              this.spinner = false;
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
    }
  }

  assignedToGet() {
    this.spinner = true;
    this.empService.get_employee(this.companyId).subscribe(

      (data) => {
        if (data["success"]) {
          this.spinner = false;
          this.empData = data["data"];
          const filterDataById = _.uniq(data["data"], "id");
          filterDataById.forEach((item) => {
            this.selectAssignedTo.push({
              label: item.name,
              value: item.id,
            });
          });
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
 
  categoryGet() {
    this.spinner = true;
    this.categoryService.get_category().subscribe(
      (data) => {
        if (data["success"]) {
          this.spinner = false;
          this.categoryList = data["data"];
          const filterDataById = _.uniq(data["data"], "id");
          filterDataById.forEach((item) => {
            this.selectCategory.push({
              label: item.category,
              value: item.id,
            });
          });
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  getCategory() {
    this.categoryService.get_category().subscribe((data) => {
      if (data["success"]) {
        this.categoryList = data["data"];
      } else {
        this.categoryList = [];
      }
    });
  }

  getCategoryName(id) {
    const data = _.filter(
      this.categoryList,
      (item) => parseInt(item.id, 10) === parseInt(id, 10)
    );

    if (data.length > 0) {
      return data[0].category;
    } else {
      return "-";
    }
  }

  excelDownload() {
    this.excelData = [];
    this.ticketDetailsData.forEach((ele) => {
      this.excelData.push({
        ticket_no: ele.ticket_no,
        assigned_by: ele.assigned_by,
        assigned_to: ele.assigned_to,
        project_name: ele.project_name ? ele.project_name : "Others",
        category_id: this.getCategoryName(ele.category_id),
        end_date: ele.end_date
          ? moment(ele.end_date).format("YYYY-MM-DD")
          : moment(ele.end_date).format("YYYY-MM-DD"),
        //end_date: ele.end_date,
        group_name: ele.group_name,
        id: ele.id,
        pm: ele.pm,
        priority:
          ele.priority === 0
            ? "Lower"
            : ele.priority === 1
            ? "High"
            : ele.priority === 2
            ? "Medium"
            : "Medium",
        //start_date: ele.start_date,
        start_date: ele.start_date
          ? moment(ele.start_date).format("YYYY-MM-DD")
          : moment(ele.start_date).format("YYYY-MM-DD"),
        status:
          ele.status === 0
            ? "Open"
            : ele.status === 1
            ? "In-Progress"
            : ele.status === 2
            ? "Resolved"
            : ele.status === 3
            ? "Awaiting Information"
            : ele.status === 4
            ? "Approved"
            : ele.status === 5
            ? "Closed"
            : ele.status === 6
            ? "Hold"
            : "Reopen",
        ticket_desc: ele.ticket_desc,
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Ticketing Details Report - ${moment().format("YYYY-MM-DD")} `
    );
  }

  doSomething(e) {
    this.ticketDetails(this.selectedProjects.length > 0 ? this.selectedProjects : '9999');
  }
  filterOthers(e) {
    const dd = _.filter(this.othersList, (item) => item.value === e);
    if (dd.length > 0) {
      return dd[0].label;
    } else {
      return "-";
    }
  }
  // clickTicket(item) {
  //   this.ticketId = item.id;
  // }
  onSubmit() {
    const id = sessionStorage.getItem("id");
    this.categoryService.updateTicket(id, this.ticketId).subscribe((data) => {
      this.ticketDetails(this.selectedProjects.length > 0 ? this.selectedProjects : '9999');
      this.toastr.success(`Ticket Assigned !`);
    });
  }
  ticketingList() {
    this.routers.navigate(['/ticketingList']);
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
  // getDays() {
  //   this.ticketService.ticket_history().subscribe((data) => {
  //     if (data["success"]) {
  //       this.ticketDetailsData1 = data["data"];
  //     } else {
  //       this.ticketDetailsData1 = [];
  //     }
  //   });
  // }

  // getDiffDays(id) {
  //   const data = _.filter(
  //     this.ticketDetailsData1,
  //     (item) => parseInt(item.id, 10) === parseInt(id, 10)
  //   );

  //   if (data.length > 0) {
  //     return data[0].;
  //   } else {
  //     return "-";
  //   }
  // }

//   getDays(id) {
    
//     this.ticketDetailsData1 = [];
//     this.service
//       .orgTickets(
//         sessionStorage.getItem("companyId"),
//         id,
//         moment(this.date3).format("YYYY-MM-DD"),
//         moment(this.date4).format("YYYY-MM-DD")
//       )
//       .subscribe(
//         (data) => {
//           if (data["success"]) {
           
//             console.log(data["data"]);
//             const arr = data["data"].concat(data["others"]);
            
//             data["data"].forEach((ele) => {
//               this.ticketDetailsData1.push({
                
//                 end_date: ele.end_date,
//                 start_date: ele.start_date,
//                 customer_id: this.getcustomerName(ele.customer_id)
//               });
//             });
//             this.ticketDetailsDataD1 = this.ticketDetailsData1;
//           } else {
//             this.ticketDetailsData1 = [];
//           }
//         },
//         (err) => {
//           this.spinner = false;
//         }
//       );
      
//   }
//   getDiffDays(id) {
    
//      const date1 = _.filter(
//       this.ticketDetailsData1,
    
//       (item) => parseInt(item. end_date, 10) === parseInt(id, 10)
//     );
//     const date2 = _.filter(
//       this.ticketDetailsData1,
      
//       (item) => parseInt(item.start_date, 10) === parseInt(id, 10)
//     );
    
    
   
//     var Time = date1.getTime() - date2.getTime();

//     return Time / (1000 * 3600 * 24);
    

//   }

    
}
