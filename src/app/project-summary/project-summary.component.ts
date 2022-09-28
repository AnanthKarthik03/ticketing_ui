import { Component, OnInit } from '@angular/core';
import { TicketingAddService } from "../ticketing-add/ticketing-add.service";
import * as moment from "moment";
import * as _ from "underscore";
import { ProjectService } from "../project-list/project-list.service";
import { ExcelService } from "../excel.service";
import { EmployeeReportService } from '../employee-report/employee-report.service';
import { EmployeesService } from 'src/app/employees/employees.service';

@Component({
  selector: 'app-project-summary',
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.css']
})
export class ProjectSummaryComponent implements OnInit {
  othersService: any;

  constructor(
    public service: TicketingAddService,
    public projectService: ProjectService,
    public EmpReportservice: EmployeeReportService,
    private excelService: ExcelService,
    public empService: EmployeesService,
  ) {}
  spinner = false;
  date1 = new Date();
  date2 = new Date();
  project = "";
  companyId = sessionStorage.getItem("companyId");
  customerId = sessionStorage.getItem("customerId");
  role = sessionStorage.getItem("role");
  emp_id = sessionStorage.getItem("emp_id");
  othersList = [];
  excelData = [];
  summaryData1 = [];
  summaryData = [];
  selectProject = [];
  totalHrs = 0;
  empReportData = [];
  ngOnInit() {
    this.projectGet();
    this.getempReport(moment().format("YYYY-MM"));
    this.projectReport();
  }
  getOther() {
    this.othersList = [];
    this.spinner = true;
    this.othersService.get_other().subscribe(
      (data) => {
        if (data['success']) {
          // data['data'].forEach((ele) => {
          //   this.othersList.push({
          //     label: ele.others,
          //     value: ele.id,
          //   });
          // });
          this.othersList = data['data'];
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
      (item) =>
        parseInt(item.id, 10) === parseInt(id, 10)
    );
   
    if (othersNameFilter.length > 0 ) {
      return othersNameFilter[0].others;
    } else {
      return '-';
    }
  }

  getempReport(date) {
   

    this.service
      .getempReport(moment(date).format("YYYY-MM"))
      .subscribe((data) => {
        if (data["success"]) {
          this.empReportData = data["data"];
        }
      });
  }

  projectGet() {
    this.selectProject.unshift({
      label: "Filter By Project",
      value: null,
    });
    this.projectService.get_project(this.companyId, this.customerId).subscribe(
      (data) => {
        if (data["success"]) {
          const filterDataById = _.uniq(data["data"], "id");
          filterDataById.forEach((item) => {
            this.selectProject.push({
              label: item.project_name,
              value: item.id,
            });
          });
        
        } else {
        }
      },
      (err) => {}
    );
  }

  projectReport() {
    this.service
      .summaryReport(
        moment(this.date1).format("YYYY-MM-DD"),
        moment(this.date2).format("YYYY-MM-DD")
      )
      .subscribe((data) => {
      

        if (data["success"]) {
          let otherData = [];
          if (data["data"].length > 0 && this.role === "Pm") {
            otherData = _.filter(
              data["data"],
              (item) => parseInt(item.rm, 10) === parseInt(this.emp_id, 10)
            );
          } else {
            otherData = data["data"];
          }

        
          this.summaryData = otherData;
          this.calculateHrs();
        } else {
          this.calculateHrs();
          // tslint:disable-next-line:no-unused-expression
          this.totalHrs === 0;
          this.summaryData = [];

        
        }
      });
  }

  doSomething() {
   
    this.getempReport(moment(this.date1).format("YYYY-MM"));
    // this.calculateHrs();
    // this.projectReport();
  }
  calculateHrs() {
    this.totalHrs = this.summaryData
      .reduce((s, f) => s + parseFloat(f.totalHrs ? f.totalHrs : 0), 0)
      .toFixed(2);

   
  }

  filterdays(e) {
    this.summaryData = [];
    if (e === "a") {
      this.date1 = new Date();
      this.date2 = new Date();
      this.projectReport();
    } else if (e === "dd") {
      // this.date1 = new Date();
      // this.date2 = new Date();
      // this.projectReport(this.project);
      const d = new Date();
      d.setDate(d.getDate() - 0);
      this.date2 = new Date();
      this.date1 = d;
      this.projectReport();
    } else if (e === "w") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      this.date2 = new Date();
      this.date1 = d;
      this.projectReport();
    } else if (e === "m") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      this.date2 = new Date();
      this.date1 = d;
      this.projectReport();
    } else if (e === "y") {
      const d = new Date();
      d.setDate(d.getDate() - 365);
      this.date2 = new Date();
      this.date1 = d;
      this.projectReport();
    }
  }
  excelDownload() {
    this.excelData = [];
    this.summaryData.forEach((ele) => {
      this.excelData.push({
        name: ele.name,
        rm: ele.rm,
        totalHrs: ele.totalHrs,
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Project Summary - ${moment().format("YYYY-MM-DD")} `
    );
  }
}
