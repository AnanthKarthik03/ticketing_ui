import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project-list/project-list.service';
import { ProjectReportService } from './projectReport.service';
import * as _ from 'underscore';
import { ExcelService } from '../excel.service';
import * as moment from 'moment';


@Component({
  selector: 'app-project-report',
  templateUrl: './project-report.component.html',
  styleUrls: ['./project-report.component.css'],
})
export class ProjectReportComponent implements OnInit {
  projectsData = [];
  spinner = false;
  companyId = sessionStorage.getItem('companyId');
  customerId = sessionStorage.getItem('customerId');
  projectListData = [];
  selectProject = [];
  excelData = [];
  projectsData1 = [];
  // date3 = new Date();
  // date4 = new Date();
  role = sessionStorage.getItem('role');

  constructor(
    public service: ProjectReportService,
    public router: Router,
    public projectService: ProjectService,
    private excelService: ExcelService,

  ) { }
  ngOnInit() {
    this.projectGet();
  }

  projectGet() {
    // this.selectProject.unshift(
    //   {
    //     label: 'Filter By Project',
    //     value: null,
    //   },
    // );
    this.spinner = true;
    if (this.role === 'Pm') {
      this.projectService
        .getPMProjectsList(sessionStorage.getItem('id'))
        .subscribe(
          (data) => {
            if (data['success']) {
              this.spinner = false;
              this.projectListData = data['data'];
              const filterDataById = _.uniq(data['data'], 'id');
              filterDataById.forEach((item) => {
                this.selectProject.push({
                  label: item.project_name,
                  value: item.id,
                });
              });
              console.log(data['data']);
            } else {
              this.getProjectsList(this.projectListData[0].id);
              this.spinner = false;
            }
          },
          (err) => {
            this.spinner = false;
          }

        );
    } else {
      this.projectService.get_project(this.companyId, this.customerId).subscribe(
        (data) => {
          if (data['success']) {
            this.spinner = false;
            this.projectListData = data['data'];
            const filterDataById = _.uniq(data['data'], 'id');
            filterDataById.forEach((item) => {
              this.selectProject.push({
                label: item.project_name,
                value: item.id,
              });
            });
            console.log(data['data']);
          } else {
            this.getProjectsList(this.projectListData[0].id);
            this.spinner = false;
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
    }
  }

  getProjectsList(id) {
    this.spinner = true;
    this.service
      .getProjectCount(sessionStorage.getItem('companyId'), id)
      .subscribe(
        (data) => {
          if (data['success']) {
            this.projectsData = data['data'][0];
            console.log(data['data']);
            console.log(this.projectsData);
            this.spinner = false;
            const arr = data['data'];
            arr.forEach((ele) => {
              this.projectsData1.push({
                Approved: ele.Approved,
                AwaitingInformation: ele.AwaitingInformation,
                Closed: ele.Closed,
                Hold: ele.Hold,
                Reopen: ele.Reopen,
                inProgress: ele.inProgress,
                open: ele.open,
                projectName: ele.projectName,
                resolved: ele.resolved,
                totalTickets: ele.totalTickets
              });
            });
          } else {
            this.projectsData = [];
            this.projectsData1 = [];
            console.log(data['message']);
            this.spinner = false;
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }
  projectReport(id) {
    console.log(id);
    this.projectsData1 = [];
    this.getProjectsList(id);
  }


  excelDownload() {
    this.excelData = [];
    this.projectsData1.forEach((ele) => {
      this.excelData.push({
        Approved: ele.Approved,
        AwaitingInformation: ele.AwaitingInformation,
        Closed: ele.Closed,
        Hold: ele.Hold,
        Reopen: ele.Reopen,
        inProgress: ele.inProgress,
        open: ele.open,
        projectName: ele.projectName,
        resolved: ele.resolved,
        totalTickets: ele.totalTickets
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Project Report - ${moment().format('YYYY-MM-DD')} `
    );
  }

  // doSomething(e) {
  //   console.log(e);
  //   console.log(this.date3);
  //   console.log(this.date4);

  //   // timeSheetDate, this.employeeReportDataD

  //   const dayData = _.filter(
  //     this.projectsData1,
  //     (item) =>
  //       // tslint:disable-next-line:quotemark
  //       moment(this.date3).format("YYYY-MM-DD") <=
  //       // tslint:disable-next-line:quotemark
  //       moment(item.timeSheetDate).format("YYYY-MM-DD") &&
  //       // tslint:disable-next-line:quotemark
  //       moment(item.timeSheetDate).format("YYYY-MM-DD") <=
  //       // tslint:disable-next-line:quotemark
  //       moment(this.date3).format("YYYY-MM-DD")
  //   );
  //   console.log(dayData);

  //   if (dayData.length > 0) {
  //     this.projectsData = dayData;
  //   } else {
  //     this.projectsData = [];
  //   }
  // }
}
