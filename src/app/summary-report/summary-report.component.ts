import { Component, OnInit } from "@angular/core";
import { TicketingAddService } from "../ticketing-add/ticketing-add.service";
import * as moment from "moment";
import * as _ from "underscore";
import { ProjectService } from "../project-list/project-list.service";
import { ExcelService } from "../excel.service";
//import { OtherService } from 'src/app/other/other.service';

@Component({
  selector: "app-summary-report",
  templateUrl: "./summary-report.component.html",
  styleUrls: ["./summary-report.component.css"],
})
export class SummaryReportComponent implements OnInit {
  constructor(
    public service: TicketingAddService,
    public projectService: ProjectService,
    private excelService: ExcelService
  ) {}
  date1 = new Date();
  date2 = new Date();
  project = "";
  companyId = sessionStorage.getItem("companyId");
  customerId = sessionStorage.getItem("customerId");
  role = sessionStorage.getItem("role");
  emp_id = sessionStorage.getItem("emp_id");

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
      `Project Report - ${moment().format("YYYY-MM-DD")} `
    );
  }
}
