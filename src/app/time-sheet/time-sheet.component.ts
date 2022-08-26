import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { CompanyService } from '../components/company/company.service';
import { CustomerService } from '../components/customer/customer.service';
import { ProjectService } from '../project-list/project-list.service';

import * as _ from 'underscore';
import { TimeSheetService } from './time-sheet.service';
import { EmployeesService } from '../employees/employees.service';
import { OtherService } from '../other/other.service';

declare var $: any;

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.css'],
})
export class TimeSheetComponent implements OnInit {
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public toastr: ToastrService,
    public projectService: ProjectService,
    public companyService: CompanyService,
    public customerService: CustomerService,
    public empService: EmployeesService,
    public service: TimeSheetService,
    public othersService: OtherService

  ) { }
  myTime: FormGroup;
  submitted = false;
  spinner = false;
  editId = '';
  calendarVisible = true;
  currentEvents: EventApi[] = [];
  calendarOptions: CalendarOptions = {};
  ticket_no = '';
  description = '';
  hrs = '';
  date = '';
  ticketsData = [];
  fData = [];
  Events = [];
  ticketsData1 = [];
  ticketsData2 = [];
  companyId = '';
  companyData = [];
  companyName = '';
  customerId = '';
  customerData = [];
  customerName = '';
  projectId = '';
  projectData = [];
  projectName = '';
  role = '';
  selectEmp = [];
  othersDisbale = false;
  othersList = [];
  ngOnInit() {
    this.getOther();
    this.role = sessionStorage.getItem('role');
    this.companyId = sessionStorage.getItem('companyId');
    this.projectId = sessionStorage.getItem('projectId');
    this.customerId = sessionStorage.getItem('customerId');
    this.getCompanyById(this.companyId);
    this.gitCustomerById(this.customerId);
    this.getProjectById(this.projectId);
    this.myTime = this.fb.group({
      id: [''],
      ticket_id: [''],
      description: ['', Validators.required],
      hrs: ['', Validators.required],
      project_id: ['', Validators.required],

      date: [''],
      others: [''],
      emp_id: sessionStorage.getItem('id'),
      company_id: sessionStorage.getItem('companyId'),
      customer_id: sessionStorage.getItem('customerId'),
    });
    this.getTimeSheet();
    this.getTicketList();

    console.log(`123`);
  }

  getOther() {
    this.othersList = [];
    this.spinner = true;
    this.othersService.get_other().subscribe(
      (data) => {
        if (data['success']) {
          data['data'].forEach((ele) => {
            this.othersList.push({
              label: ele.others,
              value: ele.id,
            });
          });
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


  calenderOptions() {
    console.log(this.fData);

    return this.fData;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.myTime.reset();
    this.submitted = false;
    console.log(selectInfo.startStr);
    this.date = selectInfo.startStr;
    this.myTime.controls['date'].setValue(this.date);
    $('#large-Modal').modal('show');
    this.myTime.controls['emp_id'].setValue(sessionStorage.getItem('id'));
    this.myTime.controls['company_id'].setValue(
      sessionStorage.getItem('companyId')
    );
    this.myTime.controls['customer_id'].setValue(
      sessionStorage.getItem('customerId')
    );
  }

  closeClear() {
    this.myTime.reset();
    this.submitted = false;
    this.ticketsData = [];
    // this.othersList = [];
    this.othersDisbale = false;
  }

  handleEventClick(clickInfo: EventClickArg) {
    $('#large-Modal').modal('show');

    // console.log(clickInfo.event._def.publicId);
    this.ticketsData2 = _.filter(
      this.ticketsData1,
      (item) =>
        parseInt(item.id, 10) === parseInt(clickInfo.event._def.publicId, 10)
    );
    console.log(this.ticketsData2);
    this.editId = this.ticketsData2[0].id;
    this.projectChange(this.ticketsData2[0].project_id ? this.ticketsData2[0].project_id.toString() : '0');
    this.myTime.patchValue({
      id: this.editId,
      ticket_id: this.ticketsData2[0].ticket_id,
      description: this.ticketsData2[0].description,
      project_id: this.ticketsData2[0].project_id ? this.ticketsData2[0].project_id : 0,
      hrs: this.ticketsData2[0].hrs,
      date: this.ticketsData2[0].date,
      emp_id: sessionStorage.getItem('id'),
      company_id: sessionStorage.getItem('companyId'),
      customer_id: sessionStorage.getItem('customerId'),
      others: parseInt(this.ticketsData2[0].others, 10)
    });
    console.log(this.myTime.value);
  }

  handleEvents(events: EventApi[]) { }

  getTicketList() {
    this.ticketsData = [];
    const cId = sessionStorage.getItem('companyId');
    const cusId = sessionStorage.getItem('customerId');
    const projectId = sessionStorage.getItem('projectId');
    this.projectService.get_ticket(cId, cusId, projectId).subscribe((data) => {
      if (data['success']) {
        console.log(data['data']);

        const dd = _.filter(
          data['data'],
          (item) =>
            parseInt(item.assigned_to, 10) ===
            parseInt(sessionStorage.getItem('id'), 10)
        );
        dd.forEach((item) => {
          this.ticketsData.push({
            label: item.ticket_no + '-' + item.ticket_desc,
            value: item.id,
          });
        });
        console.log(this.ticketsData);
      }
    });
  }
  getCompanyById(id) {
    this.companyService.get_company().subscribe((data) => {
      if (data['success']) {
        this.companyData = data['data'];
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
      .get_customer(sessionStorage.getItem('companyId'))
      .subscribe((data) => {
        if (data['success']) {
          this.customerData = data['data'];
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
    this.selectEmp = [];
    this.selectEmp.unshift({
      label: 'Filter By project Name',
      value: null,
    });
    this.empService
      .getEmpProjectsList(sessionStorage.getItem('id'))
      .subscribe((data) => {
        if (data['success']) {
          this.projectData = data['data'];
          const filterDataById = _.uniq(data['data'], 'id');
          filterDataById.forEach((item) => {
            this.selectEmp.push({
              label: item.project_name,
              value: item.id,
            });
          });

          console.log(data['data']);
        }
      });
    // this.projectService
    //   .get_project(
    //     sessionStorage.getItem("companyId"),
    //     sessionStorage.getItem("customerId")
    //   )
    //   .subscribe((data) => {
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

    //       const filterDataById = _.uniq(data["data"], "id");
    //       filterDataById.forEach((item) => {
    //         this.selectEmp.push({
    //           label: item.project_name,
    //           value: item.id,
    //         });
    //       });
    //     }
    //   });
  }

  get f() {
    return this.myTime.controls;
  }
  project() {
    this.router.navigate(['/projects']);
  }
  company() {
    this.router.navigate(['/company']);
  }
  customer() {
    this.router.navigate(['/customer']);
  }
  save() {
    this.spinner = true;
    this.submitted = true;
    if (this.myTime.invalid) {
      $('#large-Modal').modal('show');
      this.spinner = false;
      return;
    }

    if (this.myTime.controls['project_id'].value === '0') {
      this.myTime.controls['project_id'].setValue(null);
    }
    if (!this.myTime.controls['ticket_id'].value) {
      this.myTime.controls['ticket_id'].setValue(0);
    }
    const body = this.myTime.value;
    this.service.addTimeSheet(body).subscribe(
      (data) => {
        if (data['success']) {
          if (this.editId) {
            this.toastr.success(`Time Sheet Updated Successfully`);
          } else {
            this.toastr.success(`Time Sheet Added Successfully`);
          }
          this.spinner = false;
          console.log(data);
          $('#large-Modal').modal('hide');
          this.myTime.reset();
          this.getTimeSheet();
        } else {
          this.spinner = false;
          this.toastr.warning(data['message']);
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
    console.log(body);
  }

  getTimeSheet() {
    this.fData = [];
    const newTimeOffEvent = [];

    this.service
      .getTimeSheet(
        sessionStorage.getItem('companyId'),
        sessionStorage.getItem('customerId'),
        sessionStorage.getItem('id')
      )
      .subscribe((data) => {
        if (data['success']) {
          this.ticketsData1 = data['data'];
          console.log(data['data']);

          data['data'].forEach((ele, i) => {
            this.fData.push({
              id: ele.id,
              // tslint:disable-next-line:max-line-length
              title:
                (ele.ticket_no ? ele.ticket_no : 'others') +
                '-' +
                ele.hrs +
                ' Hrs',
              start: moment(ele.date).format('YYYY-MM-DD'),
            });
            newTimeOffEvent.push({
              // tslint:disable-next-line:max-line-length
              title:
                (ele.ticket_no ? ele.ticket_no : 'others') +
                '-' +
                ele.hrs +
                ' Hrs',
              start: new Date(ele.date),
              end: new Date(ele.date),
              allDay: true,
              editable: false,
            });
          });

          console.log(this.calendarOptions);

          this.currentEvents = newTimeOffEvent;

          // setTimeout(() => {
          console.log(`in settime`);
          this.calendarOptions = {
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
              right: 'dayGridMonth,listWeek',
            },
            initialView: 'dayGridMonth',
            weekends: true,
            editable: false,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            events: this.fData,
            select: this.handleDateSelect.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventsSet: this.handleEvents.bind(this),
          };

          console.log(this.calendarOptions);

          // }, 2000);
        } else {
          this.calendarOptions = {
            headerToolbar: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            },
            initialView: 'dayGridMonth',
            weekends: true,
            editable: false,
            selectable: true,
            selectMirror: true,
            dayMaxEvents: true,
            events: [],
            select: this.handleDateSelect.bind(this),
            eventClick: this.handleEventClick.bind(this),
            eventsSet: this.handleEvents.bind(this),
          };
        }
      });
  }

  projectChange(e) {
    console.log(e, typeof e);

    this.othersDisbale = false;
    this.ticketsData = [];
    let cust = null;
    console.log(this.projectData);

    const custId = _.filter(
      this.projectData,
      (item) => parseInt(item.id, 10) === parseInt(e, 10)
    );
    console.log(custId);
    if (custId.length > 0) {
      cust = custId[0].customer_id;
      this.myTime.controls['customer_id'].setValue(cust);
    } else {
      this.myTime.controls['customer_id'].setValue(0);
    }
    if (e === '0') {
      this.myTime.controls['project_id'].setValue(0);

      this.othersDisbale = true;
      console.log('others');
      if (this.ticketsData2.length > 0) {
        this.myTime.controls['others'].setValue(this.ticketsData2[0].others);
      }
      return this.myTime.controls['ticket_id'].setValue(0);
    } else {
      if (custId[0].ticket_status === 0){
        this.myTime.controls['project_id'].setValue(e);
        this.othersDisbale = false;
        this.myTime.controls['ticket_id'].enable();
        console.log(e);
        const cId = sessionStorage.getItem('companyId');
        const cusId = cust;
        const id = sessionStorage.getItem('id');
        const projectId = e;
        this.projectService
          .get_ticket(cId, cusId, projectId)
          .subscribe((data) => {
            console.log(data['data']);
            const dd = _.filter(
              data['data'],
              (item) => parseInt(item.assigned_to, 10) === parseInt(id, 10)
            );
            dd.forEach((item) => {
              this.ticketsData.push({
                label: item.ticket_no + '-' + item.ticket_desc,
                value: item.id,
              });
            });
  
            this.myTime.controls['ticket_id'].setValue(
              this.ticketsData2[0].ticket_id
            );
          });
      } else {
        this.myTime.controls['project_id'].setValue(e);
        this.othersDisbale = false;
        console.log(e);
        this.myTime.controls['ticket_id'].setValue(0);
        this.myTime.controls['ticket_id'].disable();
      }
    }
  }
}