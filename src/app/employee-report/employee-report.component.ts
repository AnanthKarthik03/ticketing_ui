import { Component, OnInit } from '@angular/core';

import { EmployeesService } from 'src/app/employees/employees.service';
import { ProjectService } from 'src/app/project-list/project-list.service';
import { EmployeeReportService } from './employee-report.service';
import * as moment from 'moment';
import * as _ from 'underscore';

import { ExcelService } from 'src/app/excel.service';
import { OtherService } from 'src/app/other/other.service';

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css'],
})
export class EmployeeReportComponent implements OnInit {
  spinner = false;
  employeeReportData = [];
  employeeReportDataD = [];
  projectsData = [];
  employeeListData = [];
  selectEmp = [];
  companyId = sessionStorage.getItem('companyId');
  customerId = sessionStorage.getItem('customerId');
  role = sessionStorage.getItem('role');
  emp_id = sessionStorage.getItem('emp_id');
  totalHrs = 0;
  excelData = [];
  date3 = new Date();
  date4 = new Date();
  othersList = [];
  constructor(
    public service: EmployeeReportService,
    public projectService: ProjectService,
    public empService: EmployeesService,
    private excelService: ExcelService,
    public othersService: OtherService
  ) { }

  ngOnInit() {
    this.employeeGet();
    this.getOther();
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


  employeeDetails(id) {
    this.employeeReportData = [];

    this.service
      .employeeAdminReport(
        id,
        sessionStorage.getItem('companyId'),
        moment(this.date3).format('YYYY-MM-DD'),
        moment(this.date4).format('YYYY-MM-DD')
      )
      .subscribe(
        (data) => {
          if (data['success']) {
            console.log(data['data']);
            const arr = data['data'].concat(data['others']);

            arr.forEach((ele) => {
              this.employeeReportData.push({
                project_name: ele.project_name ? ele.project_name : 'Others',
                ticket_no:
                  ele.ticket_no === 0
                    ? this.getOthersName(ele.others)
                    : ele.ticket_no,
                timeSheetDate: ele.timeSheetDate ? ele.timeSheetDate : ele.date,
                description: ele.description ? ele.description : '-',
                hrs: ele.hrs ? ele.hrs : 0,
                status: ele.status ? ele.status : 'Others',
                emp_id: ele.emp_id,
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
                                : ele.status === 7
                                  ? 'Reopen'
                                  : 'Others',
                ticket_desc: ele.ticket_desc ? ele.ticket_desc : '-',
              });
            });
            this.employeeReportDataD = this.employeeReportData;
            this.calculateHrs();

            console.log(this.employeeReportData);
          } else {
            this.employeeReportData = [];
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }
  employeeReport(id) {
    console.log(id);
    if (id) {
      this.employeeDetails(id);
    } else {
      this.employeeReportData = [];
      this.totalHrs = 0;
    }
  }
  employeeGet() {
    this.selectEmp = [];
    // this.selectEmp.unshift({
    //   label: 'Filter By Employee',
    //   value: null,
    // });
    this.spinner = true;
    this.empService.get_employee(this.companyId).subscribe(
      (data) => {
        if (data['success']) {
          this.spinner = false;
          this.employeeListData = data['data'];
          this.employeeDetails(this.employeeListData[0].id);
          const filterDataById = _.uniq(data['data'], 'id');
          let filterEmpData = [];
          if (this.role === 'Pm') {
            filterEmpData = _.filter(
              filterDataById,
              (item) =>
                parseInt(item.rm, 10) === parseInt(this.emp_id, 10)
            );
          } else {
            filterEmpData = filterDataById;
          }

          filterEmpData.forEach((item) => {
            this.selectEmp.push({
              label: item.name,
              value: item.id,
            });
          });
          console.log(data['data']);
        } else {
          this.employeeDetails(this.employeeListData[0].id);

          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  filterData(id) {
    console.log(id, this.employeeReportData.length);

    if (id === '0') {
      this.employeeReportData = this.employeeReportDataD;
    } else if (id === '1') {
      const dayData = _.filter(
        this.employeeReportDataD,
        (item) =>
          moment(item.start_date).format('YYYY-MM-DD') ===
          moment().format('YYYY-MM-DD')
      );
      console.log(dayData);

      if (dayData.length > 0) {
        this.employeeReportData = dayData;
      } else {
        this.employeeReportData = [];
      }
    } else if (id === '2') {
      const dateTo = moment().format('YYYY-MM-DD');
      const dateFrom = moment().subtract(7, 'd').format('YYYY-MM-DD');
      const dayData = _.filter(
        this.employeeReportDataD,
        (item) =>
          moment(item.start_date).format('YYYY-MM-DD') >= dateFrom &&
          moment(item.start_date).format('YYYY-MM-DD') <= dateTo
      );
      console.log(dayData);

      console.log(
        moment().format('YYYY-MM-DD'),
        dateTo,
        moment().format('YYYY-MM-DD'),
        dateFrom
      );

      if (dayData.length > 0) {
        this.employeeReportData = dayData;
      } else {
        this.employeeReportData = [];
      }
    } else if (id === '3') {
      console.log(
        moment(this.employeeReportDataD[0].start_date).format('MM'),
        moment().format('MM')
      );
      const dayData = _.filter(
        this.employeeReportDataD,
        (item) => moment(item.start_date).format('MM') === moment().format('MM')
      );

      if (dayData.length > 0) {
        this.employeeReportData = dayData;
      } else {
        this.employeeReportData = [];
      }
    } else if (id === '4') {
      const dayData = _.filter(
        this.employeeReportDataD,
        (item) =>
          moment(item.start_date).format('YYYY') === moment().format('YYYY')
      );
      console.log(dayData);

      if (dayData.length > 0) {
        this.employeeReportData = dayData;
      } else {
        this.employeeReportData = [];
      }
    }

    this.calculateHrs();
  }

  calculateHrs() {
    this.totalHrs = this.employeeReportData
      .reduce((s, f) => s + parseFloat(f.hrs ? f.hrs : 0), 0)
      .toFixed(2);

    console.log(this.totalHrs);
  }

  excelDownload() {
    this.excelData = [];
    this.employeeReportData.forEach((ele) => {
      this.excelData.push({
        project_name: ele.project_name ? ele.project_name : 'Others',
        ticket_no: ele.ticket_no === 0 ? '-' : ele.ticket_no,
        ticket_desc: ele.ticket_desc ? ele.ticket_desc : '-',
        date: ele.timeSheetDate
          ? moment(ele.timeSheetDate).format('YYYY-MM-DD')
          : moment(ele.date).format('YYYY-MM-DD'),
        timeSheetDescription: ele.description,
        hrs: ele.hrs ? ele.hrs : '-',
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
                        : ele.status === 7
                          ? 'Reopen'
                          : 'Others',
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Employee Report - ${moment().format('YYYY-MM-DD')} `
    );
  }

  doSomething() {
    this.employeeDetails(this.employeeListData[0].id);
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
