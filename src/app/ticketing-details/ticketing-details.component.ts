import { Component, OnInit } from '@angular/core';
import { EmployeesService } from '../employees/employees.service';
import { ProjectService } from '../project-list/project-list.service';
import { ProjectReportService } from '../project-report/projectReport.service';
import { TicketingDetailsService } from './ticketingDetails.service';
import * as _ from 'underscore';
import { CategoryService } from '../category/category.service';
import { ExcelService } from '../excel.service';
import * as moment from 'moment';
import { OtherService } from 'src/app/other/other.service';
@Component({
  selector: 'app-ticketing-details',
  templateUrl: './ticketing-details.component.html',
  styleUrls: ['./ticketing-details.component.css'],
})
export class TicketingDetailsComponent implements OnInit {
  spinner = false;
  ticketDetailsData = [];
  projectsData = [];
  projectListData = [];
  companyId = sessionStorage.getItem('companyId');
  customerId = sessionStorage.getItem('customerId');
  empData = [];
  categoryList = [];
  selectProject = [];
  excelData = [];
  othersList = [];
  date3 = new Date();
  date4 = new Date();
  role = sessionStorage.getItem('role');
  selectedProjects = '';
  ticketDetailsDataD = [];
  constructor(
    public service: TicketingDetailsService,
    public projectService: ProjectReportService,
    public projectService1: ProjectService,
    public empService: EmployeesService,
    public categoryService: CategoryService,
    public othersService: OtherService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.projectGet();
    this.getEmps();
    this.getCategory();
  }

  getEmps() {
    this.empService.get_employee(this.companyId).subscribe((data) => {
      if (data['success']) {
        console.log(data['data']);
        this.empData = data['data'];
      }
    });
  }
  

  getEmpName(id) {
    const data = _.filter(
      this.empData,
      (item) => parseInt(item.id, 10) === parseInt(id, 10)
    );
    console.log(data);
    if (data.length > 0) {
      return data[0].name;
    }
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
          console.log(data['message']);
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
    console.log(othersNameFilter);
    if (othersNameFilter.length > 0 ) {
      return othersNameFilter[0].others;
    } else {
      return '-';
    }
  }


  ticketDetails(id) {
    this.ticketDetailsData = [];
    this.service
      .adminTicketDetailsReport(
        sessionStorage.getItem('companyId'),
        id,
        moment(this.date3).format('YYYY-MM-DD'),
        moment(this.date4).format('YYYY-MM-DD')
      )
      .subscribe(
        (data) => {
          if (data['success']) {
            // this.ticketDetailsData = data['data'];
            console.log(data['data']);
            
            const arr = data['data'].concat(data['others']);

            data['data'].forEach((ele) => {
              this.ticketDetailsData.push({
                //ticket_no: ele.ticket_no,
                ticket_no:
                  ele.ticket_no === 0
                    ? this.getOthersName(ele.others)
                    : ele.ticket_no,
                assigned_by: this.getEmpName(ele.assigned_by),
                assigned_to: this.getEmpName(ele.assigned_to),
                project_name: ele.project_name ? ele.project_name : 'Others',
                category_id: this.getCategoryName(ele.category_id),
                end_date: ele.end_date,
                group_name: ele.group_name,
                id: ele.id,
                pm: ele.pm,
                priority: ele.priority,
                priority_name:
                  ele.priority === 0
                    ? 'Lower'
                    : ele.priority === 1
                      ? 'High'
                      : ele.priority === 2
                        ? 'Medium'
                        : 'Medium',
                start_date: ele.start_date,
                status: ele.status,
                status_name:
                  ele.status === 0
                    ? 'Open'
                    : ele.status === 1
                      ? 'In-Progress'
                      : ele.status === 2
                        ? 'Resolved'
                        : ele.status === 3
                          ? 'Awaiting Information'
                          : ele.status === 4
                            ? 'Approved'
                            : ele.status === 5
                              ? 'Closed'
                              : ele.status === 6
                                ? 'Hold'
                                : 'Reopen',
                ticket_desc: ele.ticket_desc,
              });
            });
            this.ticketDetailsDataD = this.ticketDetailsData;

            console.log(this.ticketDetailsData);
          } else {
            this.ticketDetailsData = [];
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }

  projectReport(id) {
    console.log(id);
    this.selectedProjects = id;
    this.ticketDetails(id);
  }

  projectGet() {
    // this.selectProject.unshift({
    //   label: 'Filter By Project',
    //   value: null,
    // });
    this.spinner = true;
    if (this.role === 'Pm') {
      this.projectService1
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
              this.ticketDetails(this.projectListData[0].id);
            } else {
              this.spinner = false;
            }
          },
          (err) => {
            this.spinner = false;
          }

        );
    } else {
      this.projectService1.get_project(
        sessionStorage.getItem('companyId'),
        sessionStorage.getItem('customerId')
      ).subscribe(
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
            this.ticketDetails(this.projectListData[0].id);
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

  getCategory() {
    this.categoryService.get_category().subscribe((data) => {
      if (data['success']) {
        this.categoryList = data['data'];
        console.log(this.categoryList);
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
    console.log(data);
    if (data.length > 0) {
      return data[0].category;
    } else {
      return '-';
    }
  }

  excelDownload() {
    this.excelData = [];
    this.ticketDetailsData.forEach((ele) => {
      this.excelData.push({
        ticket_no: ele.ticket_no,
        assigned_by: ele.assigned_by,
        assigned_to: ele.assigned_to,
        project_name: ele.project_name ? ele.project_name : 'Others',
        category_id: this.getCategoryName(ele.category_id),
        end_date: ele.end_date
          ? moment(ele.end_date).format('YYYY-MM-DD')
          : moment(ele.end_date).format('YYYY-MM-DD'),
        //end_date: ele.end_date,
        group_name: ele.group_name,
        id: ele.id,
        pm: ele.pm,
        priority:
          ele.priority === 0
            ? 'Lower'
            : ele.priority === 1
              ? 'High'
              : ele.priority === 2
                ? 'Medium'
                : 'Medium',
        //start_date: ele.start_date,
        start_date: ele.start_date
        ? moment(ele.start_date).format('YYYY-MM-DD')
        : moment(ele.start_date).format('YYYY-MM-DD'),
        status:
          ele.status === 0
            ? 'Open'
            : ele.status === 1
              ? 'In-Progress'
              : ele.status === 2
                ? 'Resolved'
                : ele.status === 3
                  ? 'Awaiting Information'
                  : ele.status === 4
                    ? 'Approved'
                    : ele.status === 5
                      ? 'Closed'
                      : ele.status === 6
                        ? 'Hold'
                        : 'Reopen',
        ticket_desc: ele.ticket_desc,
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Ticketing Details Report - ${moment().format('YYYY-MM-DD')} `
    );
  }

  doSomething(e) {
    this.ticketDetails(this.selectedProjects);
  }
  filterOthers(e) {
    const dd = _.filter(this.othersList, (item) => item.value === e);
    if (dd.length > 0) {
      return dd[0].label;
    } else {
      return '-';
    }
  }
}
