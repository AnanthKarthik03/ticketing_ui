import { Component, OnInit } from "@angular/core";
import { ProjectService } from "../project-list/project-list.service";
import { TimeReportService } from "./time-report.service";
import * as _ from "underscore";
import * as moment from "moment";
import { ExcelService } from "../excel.service";

@Component({
  selector: "app-time-report",
  templateUrl: "./time-report.component.html",
  styleUrls: ["./time-report.component.css"],
})
export class TimeReportComponent implements OnInit {
  timeSheetData = [];
  timeSheetDataD = [];
  spinner = false;
  projectListData = [];
  empFilter = [];
  totalHrs = 0;
  selectProject = [];
  selectEmp = [];
  excelData = [];
  date3 = new Date();
  date4 = new Date();
  role = sessionStorage.getItem("role");
  emp_id = sessionStorage.getItem("emp_id");
  iid = sessionStorage.getItem("id");
  projectsId = "";
  constructor(
    public service: TimeReportService,
    public projectService: ProjectService,
    private excelService: ExcelService
  ) {}

  ngOnInit() {
    this.projectGet();
  }

  projectGet() {
    this.selectProject = [];
    // this.selectProject.unshift({
    //   label: 'Filter By Project',
    //   value: null,
    // });
    this.spinner = true;
    if (this.role === "Pm") {
      this.projectService
        .getPMProjectsList(sessionStorage.getItem("id"))
        .subscribe(
          (data) => {
            if (data["success"]) {
              this.spinner = false;
              this.projectListData = data["data"];
              this.timeSheetReport(0);
              const filterDataById = _.uniq(data["data"], "id");
              filterDataById.forEach((item) => {
                this.selectProject.push({
                  label: item.project_name,
                  value: item.id,
                });
              });
             
            } else {
              this.timeSheetReport(0);
              this.spinner = false;
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
    } else {
      this.projectService
        // .getPMProjectsList(sessionStorage.getItem('id'))
        .get_project(
          sessionStorage.getItem("companyId"),
          sessionStorage.getItem("customerId")
        )
        .subscribe(
          (data) => {
            if (data["success"]) {
              this.spinner = false;
              this.projectListData = data["data"];
              this.timeSheetReport(this.projectListData[0].id);
              const filterDataById = _.uniq(data["data"], "id");
              filterDataById.forEach((item) => {
                this.selectProject.push({
                  label: item.project_name,
                  value: item.id,
                });
              });
             
            } else {
              this.timeSheetReport(this.projectListData[0].id);
              this.spinner = false;
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
    }

    // this.projectService
    // .getPMProjectsList(sessionStorage.getItem('id'))
    //   // .get_project(
    //   //   sessionStorage.getItem('companyId'),
    //   //   sessionStorage.getItem('customerId')
    //   // )
    //   .subscribe(
    //     (data) => {
    //       if (data['success']) {
    //         this.spinner = false;
    //         this.projectListData = data['data'];
    //         this.timeSheetReport(this.projectListData[0].id);
    //         const filterDataById = _.uniq(data['data'], 'id');
    //         filterDataById.forEach((item) => {
    //           this.selectProject.push({
    //             label: item.project_name,
    //             value: item.id,
    //           });
    //         });
    //         console.log(data['data']);
    //       } else {
    //         this.timeSheetReport(this.projectListData[0].id);
    //         this.spinner = false;
    //       }
    //     },
  }
  timeSheetReport(id) {
    this.selectEmp = [];
    // this.selectEmp.unshift({
    //   label: 'Filter By Employee',
    //   value: null,
    // });
    this.spinner = true;
    this.timeSheetData = [];
    this.timeSheetDataD = [];
    this.empFilter = [];
    this.spinner = true;
   
    this.projectsId = id;

    if (id >= 0) {
      this.service
        .adminTimeSheetReport(
          sessionStorage.getItem("companyId"),
          sessionStorage.getItem("customerId"),
          id,
          moment(this.date3).format("YYYY-MM-DD"),
          moment(this.date4).format("YYYY-MM-DD")
        )
        .subscribe(
          (data) => {
            if (data["success"]) {
              this.spinner = false;
              let otherData = [];
              let mainData = [];
              if (data["others"].length > 0 && this.role === "Pm") {
                otherData = _.filter(
                  data["others"],
                  (item) => parseInt(item.rm, 10) === parseInt(this.emp_id, 10)
                );
              } else {
                otherData = data["others"];
              }
              mainData = _.filter(
                data["data"],
                (item) =>
                  parseInt(item.assigned_by, 10) === parseInt(this.iid, 10)
              );

              const arr = mainData.concat(otherData);

             
              this.timeSheetData = arr;
              this.timeSheetDataD = arr;
              this.calculateHrs();
              const filterDataById = _.uniq(data["data"], "name");
              filterDataById.forEach((item) => {
                this.selectEmp.push({
                  label: item.name,
                  value: item.emp_id,
                });
              });
              // this.empFilter = _.uniq(this.timeSheetData, "name");
            } else {
              this.spinner = false;
              this.timeSheetData = [];
              this.timeSheetDataD = [];
              this.empFilter = [];
              this.totalHrs = 0;
            }
          },
          (err) => {
            this.spinner = false;
          }
        );
    } else {
      this.selectEmp = [];
      this.spinner = false;
      this.totalHrs = 0;
    }
  }
  filterData(id) {
   
    if (id === '0') {
      this.timeSheetData = this.timeSheetDataD;
    } else if (id === '1') {
      const dayData = _.filter(
        this.timeSheetDataD,
        (item) =>
          moment(item.date).format('YYYY-MM-DD') ===
          moment().format('YYYY-MM-DD')
      );
     

      if (dayData.length > 0) {
        this.timeSheetData = dayData;
      } else {
        this.timeSheetData = [];
      }
    } else if (id === '2') {
      const dateTo = moment().format('YYYY-MM-DD');
      const dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD');
      const dayData = _.filter(
        this.timeSheetDataD,
        (item) =>
          moment(item.date).format('YYYY-MM-DD') >= dateFrom &&
          moment(item.date).format('YYYY-MM-DD') <= dateTo
      );
     

     

      if (dayData.length > 0) {
        this.timeSheetData = dayData;
      } else {
        this.timeSheetData = [];
      }
    } else if (id === '3') {
    
      const dayData = _.filter(
        this.timeSheetDataD,
        (item) => moment(item.date).format('MM') === moment().format('MM')
      );

      if (dayData.length > 0) {
        this.timeSheetData = dayData;
      } else {
        this.timeSheetData = [];
      }
    } else if (id === '4') {
      const dayData = _.filter(
        this.timeSheetDataD,
        (item) =>
          moment(item.date).format('YYYY') === moment().format('YYYY')
      );
     

      if (dayData.length > 0) {
        this.timeSheetData = dayData;
      } else {
        this.timeSheetData = [];
      }
    }

    this.calculateHrs();
  }

  // filterData(id) {
  //   this.timeSheetReport(this.projectListData[0].id);
  //   this.calculateHrs();
  // }

  selectEmpProject(id) {
   
    if (id.length === 0) {
      this.timeSheetData = this.timeSheetDataD;
     
    } else {
      if (id === "all") {
        this.timeSheetData = this.timeSheetDataD;
      } else {
        this.timeSheetData = this.timeSheetDataD.filter((person) =>
          id.includes(person.emp_id)
        );

        // this.timeSheetData = _.filter(
        //   this.timeSheetDataD,
        //   (item) => parseInt(item.emp_id, 10) === parseInt(id, 10)
        // );
      }
    }

  
    this.calculateHrs();
  }

  calculateHrs() {
    // this.totalHrs = this.timeSheetData.reduce(
    //   (s, f) => s + parseInt(f.hrs, 10),
    //   0
    // );
    this.totalHrs = this.timeSheetData
      .reduce((s, f) => s + parseFloat(f.hrs ? f.hrs : 0), 0)
      .toFixed(2);
   
  }

  excelDownload() {
    this.excelData = [];
    this.timeSheetData.forEach((ele) => {
      this.excelData.push({
        ticket_no: ele.ticket_no ? ele.ticket_no : "Others",
        name: ele.name,
        description: ele.description,
        date: ele.date
          ? moment(ele.date).format("YYYY-MM-DD")
          : moment().format("YYYY-MM-DD"),
        hrs: ele.hrs,
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Time Sheet Report - ${moment().format("YYYY-MM-DD")} `
    );
  }

  doSomething(e) {
    this.timeSheetReport(this.projectsId);
    // if (dayData.length > 0) {
    //   this.timeSheetData = dayData;
    //   this.calculateHrs();
    // } else {
    //   this.timeSheetData = [];
    // }
  }
}
