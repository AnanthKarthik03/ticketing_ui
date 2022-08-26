import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../components/customer/customer.service';
import { ClientReportService } from './client-report.service';
import * as _ from 'underscore';
import { ExcelService } from '../excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-client-report',
  templateUrl: './client-report.component.html',
  styleUrls: ['./client-report.component.css'],
})
export class ClientReportComponent implements OnInit {
  clientReportData = [];
  clientReportData1 = [];
  customerData = [];
  spinner = false;
  selectClient = [];
  excelData = [];
  // date3 = new Date();
  // date4 = new Date();
  constructor(
    public service: ClientReportService,
    public customerService: CustomerService,
    private excelService: ExcelService,

  ) { }

  ngOnInit() {

    this.get_customer();
  }

  get_customer() {
    this.selectClient = [];
    this.selectClient.unshift(
      {
        label: 'Filter By Client',
        value: null,
      },
    );
    this.customerService
      .get_customer(sessionStorage.getItem('companyId'))
      .subscribe(
        (data) => {
          if (data['success']) {
            this.customerData = data['data'];
            const filterDataById = _.uniq(data['data'], 'id');
            filterDataById.forEach((item) => {
              this.selectClient.push({
                label: item.customer_name_first,
                value: item.id,
              });
            });
            console.log(data['data']);
          } else {
            this.projectReport(this.customerData[0].id);
            this.spinner = false;
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }

  projectReport(id) {
    this.spinner = true;
    this.service
      .adminEmployeeReport(sessionStorage.getItem('companyId'), id)
      .subscribe(
        (data) => {
          if (data['success']) {
            this.spinner = false;
            console.log(data['data']);
            this.clientReportData = data['data'];
            const arr = data['data'];
            arr.forEach((ele) => {
              this.clientReportData1.push({
                id: ele.id,
                project_name: ele.project_name,
                Approved: ele.Approved,
                AwaitingInformation: ele.AwaitingInformation,
                Closed: ele.Closed,
                Hold: ele.Hold,
                Reopen: ele.Reopen,
                Resolved: ele.Resolved,
                inProgress: ele.inProgress,
                open: ele.open,
                totalTickets: ele.totalTickets
              });
            });


          } else {
            this.spinner = false;
            this.clientReportData = [];
            this.clientReportData1 = [];
          }
        },
        (err) => {
          this.spinner = false;
        }
      );
  }

  excelDownload() {
    this.excelData = [];
    this.clientReportData.forEach((ele) => {
      this.excelData.push({
        id: ele.id,
        project_name: ele.project_name,
        Approved: ele.Approved,
        AwaitingInformation: ele.AwaitingInformation,
        Closed: ele.Closed,
        Hold: ele.Hold,
        Reopen: ele.Reopen,
        Resolved: ele.Resolved,
        inProgress: ele.inProgress,
        open: ele.open,
        totalTickets: ele.totalTickets
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Client Report - ${moment().format('YYYY-MM-DD')} `
    );
  }

  // doSomething(e) {
  //   console.log(e);
  //   console.log(this.date3);
  //   console.log(this.date4);

  //   // timeSheetDate, this.employeeReportDataD

  //   const dayData = _.filter(
  //     this.clientReportData,
  //     (item) =>
  //       // tslint:disable-next-line:quotemark
  //       moment(this.date3).format("YYYY-MM-DD") <=
  //       // tslint:disable-next-line:quotemark
  //       moment(item.date).format("YYYY-MM-DD") &&
  //       // tslint:disable-next-line:quotemark
  //       moment(item.date).format("YYYY-MM-DD") <=
  //       // tslint:disable-next-line:quotemark
  //       moment(this.date3).format("YYYY-MM-DD")
  //   );
  //   console.log(dayData);

  //   if (dayData.length > 0) {
  //     this.clientReportData = dayData;
  //   } else {
  //     this.clientReportData = [];
  //   }
  // }
}
